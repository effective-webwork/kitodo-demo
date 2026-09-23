<?php

/**
 * (c) Kitodo. Key to digital objects e.V. <contact@kitodo.org>
 *
 * This file is part of the Kitodo and TYPO3 projects.
 *
 * @license GNU General Public License version 3 or later.
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 */

namespace Kitodo\PresentationPackage\Eid;

use Kitodo\Dlf\Common\AbstractDocument;
use Kitodo\Dlf\Common\Helper;
use Kitodo\Dlf\Common\StdOutStream;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerAwareTrait;
use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Context\Context;
use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Http\RequestFactory;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\TypoScript\AST\Node\RootNode;
use TYPO3\CMS\Core\TypoScript\FrontendTypoScript;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Frontend\Authentication\FrontendUserAuthentication;

/**
 * eID image proxy with access restrictions for plugin 'Page View' of the 'dlf'
 * extension.
 *
 * This is the TYPO3 v13 port of the former eID script
 * `Kitodo\Dlf\Plugin\Eid\PageViewRestrictionProxy`. It behaves like dlf's
 * {@see \Kitodo\Dlf\Eid\PageViewProxy}, but additionally checks whether the
 * requested file may be delivered to the current frontend user:
 *
 * - The page (physical structure element) or one of the logical structure
 *   elements it belongs to may be marked as "restricted" in the METS file.
 * - Restricted files are only delivered to logged in frontend users which are
 *   either member of the administrator group ({@see self::ADMIN_GROUP}) or of
 *   the group configured for the document ({@see self::RESTRICTION_GROUP_METADATA_INDEX}).
 * - Otherwise a placeholder image ({@see self::PLACEHOLDER_URL}) is delivered
 *   with `Cache-Control: no-store`.
 * - Internal fulltext requests (`ftxt_token=internal_request` together with
 *   `use=FULLTEXT`) bypass the restriction check.
 *
 * Supported query parameters:
 * - `url` (mandatory): The URL to be proxied
 * - `id` (optional): UID of the document the file belongs to. If missing, the
 *   record identifier is derived from the requested URL.
 * - `use` / `fileGrp` (optional): The METS file group the file belongs to
 * - `ftxt_token` (optional): Token for internal fulltext requests
 *
 * The URLs are part of the published METS files and must not change, which is
 * why this stays an eID script instead of becoming a PSR-15 middleware: the
 * core EidHandler short circuits the frontend middleware chain long before
 * `typo3/cms-frontend/authentication` runs, so a middleware reachable under
 * `?eID=` could never see a logged in frontend user. The bootstrap that core
 * skips is done in {@see self::main()}.
 *
 * NOTE: The constants below are installation specific (they were hardcoded in
 * the original eID script) and have to be adapted per installation.
 *
 * @package TYPO3
 * @subpackage presentation_package
 *
 * @access public
 */
class PageViewRestrictionProxy implements LoggerAwareInterface
{
    use LoggerAwareTrait;

    /**
     * Value of the METS access condition marking a restricted file.
     *
     * @var string
     */
    protected const RESTRICTED = 'restricted';

    /**
     * Title of the frontend user group which may access all restricted files.
     *
     * @var string
     */
    protected const ADMIN_GROUP = 'AdminGroup';

    /**
     * Name of the fulltext file group.
     *
     * @var string
     */
    protected const FULLTEXT_USE_GROUP = 'FULLTEXT';

    /**
     * Name of the download file group.
     *
     * @var string
     */
    protected const DOWNLOAD_USE_GROUP = 'DOWNLOAD';

    /**
     * Token which marks an internal (server side) fulltext request.
     *
     * @var string
     */
    protected const INTERNAL_REQUEST_TOKEN = 'internal_request';

    /**
     * Image which is delivered instead of a restricted file.
     *
     * @var string
     */
    protected const PLACEHOLDER_URL = 'https://digital.martin-opitz-bibliothek.de/fileadmin/placeholder.png';

    /**
     * URL prefix of the image server (IIIF).
     *
     * @var string
     */
    protected const IMAGE_SERVER_PREFIX = 'http://127.0.0.1:8182/iiif/2/';

    /**
     * URL prefix of the fulltext server.
     *
     * @var string
     */
    protected const FULLTEXT_SERVER_PREFIX = 'http://127.0.0.1:8085/';

    /**
     * URL prefix of the download server.
     *
     * @var string
     */
    protected const DOWNLOAD_SERVER_PREFIX = 'http://127.0.0.1:8090/';

    /**
     * URL prefixes which may be proxied at all.
     *
     * Together with {@see self::isValidFileLocation()} this is what actually
     * protects the proxy from being used for arbitrary URLs.
     *
     * @var string[]
     */
    protected const URL_WHITELIST = [
        'http://127.0.0.1:8085/',
        'http://127.0.0.1:8090/',
        'http://127.0.0.1:8182/',
        // 'http://167.86.98.211:8085/',
        // 'http://167.86.98.211:8182/',
    ];

    /**
     * XPath (namespace agnostic) which is evaluated on a metadata section to
     * determine the restriction of a file or structure element.
     *
     * @var string
     */
    protected const RESTRICTION_XPATH = './/*[local-name()="accessCondition"]';

    /**
     * Index name of the metadata field holding the frontend user group which
     * may access the restricted files of a document.
     *
     * @var string
     */
    protected const RESTRICTION_GROUP_METADATA_INDEX = 'restriction_group';

    /**
     * Fallback XPath (namespace agnostic) for the frontend user group which may
     * access the restricted files of a document.
     *
     * @var string
     */
    protected const RESTRICTION_GROUP_XPATH = './/*[local-name()="accessCondition"]/@displayLabel';

    /**
     * @access protected
     * @var RequestFactory
     */
    protected RequestFactory $requestFactory;

    /**
     * @access protected
     * @var mixed[]
     */
    protected array $extConf;

    /**
     * Constructs the instance
     *
     * @access public
     *
     * @return void
     */
    public function __construct()
    {
        $this->requestFactory = GeneralUtility::makeInstance(RequestFactory::class);
        $this->extConf = GeneralUtility::makeInstance(ExtensionConfiguration::class)->get('dlf', 'general');
    }

    /**
     * The main method of the eID script.
     *
     * @access public
     *
     * @param ServerRequestInterface $request
     *
     * @return ResponseInterface
     */
    public function main(ServerRequestInterface $request): ResponseInterface
    {
        // The core EidHandler short circuits the middleware chain before
        // `typo3/cms-frontend/tsfe` and `typo3/cms-frontend/authentication`, so
        // TypoScript, $GLOBALS['TYPO3_REQUEST'] and the frontend user all have
        // to be set up here.
        $request = $this->withStubbedFrontendTypoScript($request);

        // Assigned unconditionally: other middlewares running before the
        // EidHandler may already have put the untouched request there, and
        // Extbase's ConfigurationManager falls back to this global to find the
        // frontend.typoscript attribute. The eID request never continues down
        // the middleware chain, so overwriting it is safe.
        $GLOBALS['TYPO3_REQUEST'] = $request;

        $frontendUser = $this->initializeFrontendUser($request);

        return match ($request->getMethod()) {
            'OPTIONS' => $this->handleOptions($request),
            'GET' => $this->handleGet($request, $frontendUser),
            'HEAD' => $this->handleHead($request, $frontendUser),
            default => GeneralUtility::makeInstance(Response::class)
                ->withStatus(405),
        };
    }

    /**
     * Attach an empty frontend TypoScript setup to the request.
     *
     * `AbstractDocument::__construct()` calls `FormatRepository::useStoragePid()`,
     * which builds an Extbase query, and Extbase's FrontendConfigurationManager
     * insists on the `frontend.typoscript` attribute that only the regular
     * frontend middlewares produce. dlf reads no TypoScript while parsing a
     * document - the storage PID is passed in explicitly and the file groups
     * come from the extension configuration - so an empty setup is enough to
     * let Extbase fall back to its defaults.
     *
     * NOTE: FrontendTypoScript and its setter are marked @internal in the core.
     * If a TYPO3 update changes them, this is the place to look.
     *
     * @access protected
     *
     * @param ServerRequestInterface $request
     *
     * @return ServerRequestInterface
     */
    protected function withStubbedFrontendTypoScript(ServerRequestInterface $request): ServerRequestInterface
    {
        if ($request->getAttribute('frontend.typoscript') instanceof FrontendTypoScript) {
            return $request;
        }

        $frontendTypoScript = new FrontendTypoScript(new RootNode(), [], [], []);
        $frontendTypoScript->setSetupArray([]);

        return $request->withAttribute('frontend.typoscript', $frontendTypoScript);
    }

    /**
     * Authenticate the frontend user and register it in the context.
     *
     * This is the part of `TYPO3\CMS\Frontend\Middleware\FrontendUserAuthenticator`
     * that eID requests never reach. Registering the aspect matters beyond the
     * restriction check itself, because Helper::whereExpression() resolves the
     * fe_group enable fields through the context.
     *
     * @access protected
     *
     * @param ServerRequestInterface $request
     *
     * @return FrontendUserAuthentication
     */
    protected function initializeFrontendUser(ServerRequestInterface $request): FrontendUserAuthentication
    {
        $frontendUser = GeneralUtility::makeInstance(FrontendUserAuthentication::class);
        $frontendUser->start($request);
        $frontendUser->fetchGroupData($request);

        GeneralUtility::makeInstance(Context::class)
            ->setAspect('frontend.user', $frontendUser->createUserAspect());

        return $frontendUser;
    }

    /**
     * Return a response that is derived from $response and contains CORS
     * headers to be sent to the client.
     *
     * @access protected
     *
     * @param ResponseInterface $response
     * @param ServerRequestInterface $request The incoming request.
     *
     * @return ResponseInterface
     */
    protected function withCorsResponseHeaders(
        ResponseInterface $response,
        ServerRequestInterface $request
    ): ResponseInterface
    {
        $origin = $request->getHeaderLine('Origin') ?: '*';

        return $response
            ->withHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, HEAD')
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Access-Control-Max-Age', '86400');
    }

    /**
     * Takes headers listed in $headerNames from $fromResponse, adds them to
     * $toResponse and returns the result.
     *
     * @access protected
     *
     * @param ResponseInterface $fromResponse
     * @param ResponseInterface $toResponse
     * @param string[] $headerNames
     *
     * @return ResponseInterface
     */
    protected function copyHeaders(
        ResponseInterface $fromResponse,
        ResponseInterface $toResponse,
        array $headerNames
    ): ResponseInterface
    {
        $result = $toResponse;

        foreach ($headerNames as $headerName) {
            $headerValues = $fromResponse->getHeader($headerName);
            // Don't include empty header field when not present
            if (!empty($headerValues)) {
                $result = $result->withAddedHeader($headerName, $headerValues);
            }
        }

        return $result;
    }

    /**
     * Handle an OPTIONS request.
     *
     * @access protected
     *
     * @param ServerRequestInterface $request
     *
     * @return ResponseInterface
     */
    protected function handleOptions(ServerRequestInterface $request): ResponseInterface
    {
        // 204 No Content
        $response = GeneralUtility::makeInstance(Response::class)
            ->withStatus(204);
        return $this->withCorsResponseHeaders($response, $request);
    }

    /**
     * Handle a HEAD request.
     *
     * @access protected
     *
     * @param ServerRequestInterface $request
     * @param FrontendUserAuthentication $frontendUser
     *
     * @return ResponseInterface
     */
    protected function handleHead(
        ServerRequestInterface $request,
        FrontendUserAuthentication $frontendUser
    ): ResponseInterface
    {
        $url = $this->getValidatedUrl($request);
        if ($url instanceof ResponseInterface) {
            return $this->withCorsResponseHeaders($url, $request);
        }

        $access = $this->checkAccess($request, $url, $frontendUser);
        if ($access['response'] instanceof ResponseInterface) {
            return $this->withCorsResponseHeaders($access['response'], $request);
        }

        $targetUrl = $access['allowed'] ? $url : self::PLACEHOLDER_URL;

        try {
            $targetResponse = $this->requestFactory->request($targetUrl, 'HEAD', [
                'headers' => [
                    'User-Agent' => $this->extConf['userAgent'] ?? 'Kitodo.Presentation',
                ]
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Could not fetch "' . $targetUrl . '": ' . $e->getMessage());
            return new JsonResponse(['message' => 'Could not fetch resource of given URL.'], 500);
        }

        $clientResponse = GeneralUtility::makeInstance(Response::class)
            ->withStatus($targetResponse->getStatusCode());

        $clientResponse = $this->copyHeaders($targetResponse, $clientResponse, [
            'Content-Length',
            'Content-Type',
            'Last-Modified',
        ]);

        if (!$access['allowed']) {
            $clientResponse = $clientResponse->withHeader('Cache-Control', 'no-store');
        }

        return $this->withCorsResponseHeaders($clientResponse, $request);
    }

    /**
     * Handle a GET request.
     *
     * @access protected
     *
     * @param ServerRequestInterface $request
     * @param FrontendUserAuthentication $frontendUser
     *
     * @return ResponseInterface
     */
    protected function handleGet(
        ServerRequestInterface $request,
        FrontendUserAuthentication $frontendUser
    ): ResponseInterface
    {
        $url = $this->getValidatedUrl($request);
        if ($url instanceof ResponseInterface) {
            return $this->withCorsResponseHeaders($url, $request);
        }

        $access = $this->checkAccess($request, $url, $frontendUser);
        if ($access['response'] instanceof ResponseInterface) {
            return $this->withCorsResponseHeaders($access['response'], $request);
        }

        // Deliver the placeholder image instead of the restricted file.
        $targetUrl = $access['allowed'] ? $url : self::PLACEHOLDER_URL;

        try {
            $targetResponse = $this->requestFactory->request($targetUrl, 'GET', [
                'headers' => [
                    'User-Agent' => $this->extConf['userAgent'] ?? 'Kitodo.Presentation',
                ],

                // For performance, don't download content up-front. Rather, we'll
                // download and upload simultaneously.
                // https://docs.guzzlephp.org/en/6.5/request-options.html#stream
                'stream' => true,

                // Don't throw exceptions when a non-success status code is
                // received. We handle these manually.
                'http_errors' => false,
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Could not fetch "' . $targetUrl . '": ' . $e->getMessage());
            return new JsonResponse(['message' => 'Could not fetch resource of given URL.'], 500);
        }

        $body = new StdOutStream($targetResponse->getBody());

        $clientResponse = GeneralUtility::makeInstance(Response::class)
            ->withStatus($targetResponse->getStatusCode())
            ->withBody($body);

        $clientResponse = $this->copyHeaders($targetResponse, $clientResponse, [
            'Content-Length',
            'Content-Type',
            'Last-Modified',
        ]);

        // Never cache the placeholder in place of the requested file.
        if (!$access['allowed']) {
            $clientResponse = $clientResponse->withHeader('Cache-Control', 'no-store');
        }

        return $this->withCorsResponseHeaders($clientResponse, $request);
    }

    /**
     * Get the requested URL and validate it.
     *
     * NOTE: Unlike dlf's PageViewProxy there is no `uHash` check here. The URLs
     * of this proxy are written into the published METS files and never carried
     * a hash, so requiring one would reject every existing file reference. The
     * URL whitelist and the METS cross check in {@see self::checkAccess()} are
     * what restricts this proxy.
     *
     * @access protected
     *
     * @param ServerRequestInterface $request
     *
     * @return string|ResponseInterface The requested URL or an error response
     */
    protected function getValidatedUrl(ServerRequestInterface $request): string|ResponseInterface
    {
        $url = (string) ($request->getQueryParams()['url'] ?? '');

        if (!Helper::isValidHttpUrl($url)) {
            return new JsonResponse(['message' => 'Did not receive a valid URL.'], 400);
        }

        return $url;
    }

    /**
     * Check whether the requested URL may be delivered to the current frontend
     * user.
     *
     * @access protected
     *
     * @param ServerRequestInterface $request
     * @param string $url The requested URL
     * @param FrontendUserAuthentication $frontendUser
     *
     * @return array{allowed: bool, response: ?ResponseInterface} If `response`
     *         is set, it has to be returned instead of any content. Otherwise
     *         `allowed` determines whether the file itself or the placeholder
     *         is delivered.
     */
    protected function checkAccess(
        ServerRequestInterface $request,
        string $url,
        FrontendUserAuthentication $frontendUser
    ): array
    {
        $queryParams = $request->getQueryParams();

        // The file group of the requested file, `use` takes precedence over the
        // legacy `fileGrp` parameter.
        $useGroup = strtoupper((string) ($queryParams['use'] ?? $queryParams['fileGrp'] ?? ''));
        if ($useGroup === 'THUMBNAILS') {
            $useGroup = 'THUMBS';
        }

        $ftxtToken = (string) ($queryParams['ftxt_token'] ?? '');
        $isInternalFulltextRequest = ($ftxtToken === self::INTERNAL_REQUEST_TOKEN && $useGroup === self::FULLTEXT_USE_GROUP);

        $docId = (int) ($queryParams['id'] ?? 0);
        $recordId = $this->getRecordIdFromUrl($url, $useGroup);

        if ($docId === 0 && $recordId === '') {
            // Missing document identifier, return placeholder.
            return ['allowed' => false, 'response' => null];
        }

        $document = $this->getDocument($docId, $recordId);
        if ($document === null) {
            $this->logger->error('Failed to load document with UID "' . $docId . '" / record ID "' . $recordId . '"');
            return ['allowed' => false, 'response' => null];
        }

        $restriction = '';
        $restrictionStructElement = '';
        $restrictionGroup = '';

        // Determine the physical page the requested file belongs to.
        $page = $this->getPageFromFileLocation($document, $url);

        // Page 0 is the physical sequence itself (i.e. the thumbnail of the
        // document); those files as well as internal fulltext requests are
        // never restricted.
        if ($page > 0 && !$isInternalFulltextRequest) {
            $pageId = $document->physicalStructure[$page];
            $physicalStructureInfo = $document->physicalStructureInfo[$pageId] ?? [];

            $restriction = $this->getRestriction($document, (string) ($physicalStructureInfo['dmdId'] ?? ''));
            $restrictionGroup = $this->getDocumentRestrictionGroup($document);
            $restrictionStructElement = $this->getStructureRestriction($document, $pageId);

            // Check that the requested URL is really referenced by the METS file
            // for the given file group (prevents manipulated URLs).
            $fileId = $physicalStructureInfo['files'][$useGroup] ?? '';
            if ($useGroup !== '' && $fileId !== '') {
                $fileLocationFromMets = $document->getFileLocation($fileId);
                if (!$this->isValidFileLocation($fileLocationFromMets, $url)) {
                    // error / manipulation
                    return [
                        'allowed' => false,
                        'response' => new JsonResponse(['error' => 'Image or page not valid'], 403)
                    ];
                }
            }
        }

        $isRestricted = ($restriction === self::RESTRICTED || $restrictionStructElement === self::RESTRICTED);

        if ($isRestricted && !$isInternalFulltextRequest && !$this->isUserAllowed($frontendUser, $restrictionGroup)) {
            // Restricted file and insufficient permissions, return placeholder.
            return ['allowed' => false, 'response' => null];
        }

        if (!$this->isWhitelistedUrl($url)) {
            return [
                'allowed' => false,
                'response' => new JsonResponse(['message' => 'The URL is not allowed to be proxied.'], 403)
            ];
        }

        return ['allowed' => true, 'response' => null];
    }

    /**
     * Check if the current frontend user may access restricted files of the
     * document.
     *
     * @access protected
     *
     * @param FrontendUserAuthentication $frontendUser
     * @param string $restrictionGroup Title of the frontend user group configured for the document
     *
     * @return bool
     */
    protected function isUserAllowed(FrontendUserAuthentication $frontendUser, string $restrictionGroup): bool
    {
        if (empty($frontendUser->user['username'])) {
            return false;
        }

        $groupTitles = $frontendUser->groupData['title'] ?? [];

        if (in_array(self::ADMIN_GROUP, $groupTitles, true)) {
            return true;
        }

        return $restrictionGroup !== '' && in_array($restrictionGroup, $groupTitles, true);
    }

    /**
     * Load the document either by its UID or by its record identifier.
     *
     * @access protected
     *
     * @param int $uid UID of the document
     * @param string $recordId Record identifier of the document
     *
     * @return ?AbstractDocument
     */
    protected function getDocument(int $uid, string $recordId): ?AbstractDocument
    {
        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)
            ->getQueryBuilderForTable('tx_dlf_documents');

        if ($uid > 0) {
            $constraint = $queryBuilder->expr()->eq(
                'tx_dlf_documents.uid',
                $queryBuilder->createNamedParameter($uid, Connection::PARAM_INT)
            );
        } else {
            $constraint = $queryBuilder->expr()->eq(
                'tx_dlf_documents.record_id',
                $queryBuilder->createNamedParameter($recordId)
            );
        }

        $resArray = $queryBuilder
            ->select(
                'tx_dlf_documents.uid AS uid',
                'tx_dlf_documents.pid AS pid',
                'tx_dlf_documents.location AS location'
            )
            ->from('tx_dlf_documents')
            ->where(
                $constraint,
                Helper::whereExpression('tx_dlf_documents')
            )
            ->setMaxResults(1)
            ->executeQuery()
            ->fetchAssociative();

        if (empty($resArray['location'])) {
            return null;
        }

        return AbstractDocument::getInstance(
            (string) $resArray['location'],
            ['storagePid' => (int) $resArray['pid']]
        );
    }

    /**
     * Extract the record identifier from the requested URL.
     *
     * NOTE: This is installation specific and relies on the naming scheme of
     * the image, fulltext and download servers.
     *
     * @access protected
     *
     * @param string $url The requested URL
     * @param string $useGroup The file group of the requested file
     *
     * @return string The record identifier or an empty string
     */
    protected function getRecordIdFromUrl(string $url, string $useGroup): string
    {
        $prefix = match ($useGroup) {
            self::FULLTEXT_USE_GROUP => self::FULLTEXT_SERVER_PREFIX,
            self::DOWNLOAD_USE_GROUP => self::DOWNLOAD_SERVER_PREFIX,
            default => self::IMAGE_SERVER_PREFIX,
        };

        if (!str_starts_with($url, $prefix)) {
            return '';
        }

        $identifier = str_replace($prefix, '', $url);

        // IIIF identifiers carry the record ID directly, the fulltext and
        // download servers put it into a directory of its own.
        if ($prefix === self::IMAGE_SERVER_PREFIX) {
            return explode('%2F', explode('_', $identifier)[0])[0];
        }

        return explode('%2F', explode('/', explode('_', $identifier)[0])[0])[0];
    }

    /**
     * Determine the number of the physical page the requested file belongs to.
     *
     * This replaces the former `Document::getDmdIdFromFileLocationstring()`.
     *
     * @access protected
     *
     * @param AbstractDocument $document
     * @param string $url The requested URL
     *
     * @return int The page number or 0 if the file could not be found
     */
    protected function getPageFromFileLocation(AbstractDocument $document, string $url): int
    {
        foreach ($document->physicalStructure as $page => $pageId) {
            if ($page === 0) {
                // The first entry is the physical sequence itself.
                continue;
            }

            foreach ($document->physicalStructureInfo[$pageId]['files'] ?? [] as $fileId) {
                if ($this->isValidFileLocation($document->getFileLocation($fileId), $url)) {
                    return (int) $page;
                }
            }
        }

        return 0;
    }

    /**
     * Get the restriction of the metadata section(s) with the given ID(s).
     *
     * This replaces the former `Document::getFileRestriction()`.
     *
     * @access protected
     *
     * @param AbstractDocument $document
     * @param string $dmdIds Space separated list of metadata section IDs
     *
     * @return string The restriction, e.g. "restricted", or an empty string
     */
    protected function getRestriction(AbstractDocument $document, string $dmdIds): string
    {
        foreach ($this->getMdSecValues($document, $dmdIds, self::RESTRICTION_XPATH) as $value) {
            if (strtolower($value) === self::RESTRICTED) {
                return self::RESTRICTED;
            }
        }

        return '';
    }

    /**
     * Check if one of the logical structure elements the given page belongs to
     * is restricted.
     *
     * @access protected
     *
     * @param AbstractDocument $document
     * @param string $pageId ID of the physical structure element
     *
     * @return string The restriction, e.g. "restricted", or an empty string
     */
    protected function getStructureRestriction(AbstractDocument $document, string $pageId): string
    {
        $sections = $document->smLinks['p2l'][$pageId] ?? [];

        foreach ($sections as $logicalStructId) {
            $logicalStructure = $document->getLogicalStructure($logicalStructId);
            if ($this->getRestriction($document, (string) ($logicalStructure['dmdId'] ?? '')) === self::RESTRICTED) {
                return self::RESTRICTED;
            }
        }

        return '';
    }

    /**
     * Get the title of the frontend user group which may access the restricted
     * files of the document.
     *
     * This replaces the former `Document::getDocumentRestrictionGroup()`.
     *
     * @access protected
     *
     * @param AbstractDocument $document
     *
     * @return string Title of the frontend user group or an empty string
     */
    protected function getDocumentRestrictionGroup(AbstractDocument $document): string
    {
        $toplevelMetadata = $document->getToplevelMetadata();
        $restrictionGroup = $toplevelMetadata[self::RESTRICTION_GROUP_METADATA_INDEX][0] ?? '';

        if (!empty($restrictionGroup)) {
            return (string) $restrictionGroup;
        }

        // Fall back to the metadata section of the toplevel structure element.
        $toplevelId = $document->getToplevelId();
        $dmdIds = (string) ($document->getLogicalStructure($toplevelId)['dmdId'] ?? '');

        foreach ($this->getMdSecValues($document, $dmdIds, self::RESTRICTION_GROUP_XPATH) as $value) {
            if ($value !== '') {
                return $value;
            }
        }

        return '';
    }

    /**
     * Evaluate an XPath on the metadata sections with the given ID(s).
     *
     * @access protected
     *
     * @param AbstractDocument $document
     * @param string $dmdIds Space separated list of metadata section IDs
     * @param string $xpath The XPath to evaluate
     *
     * @return string[] The trimmed values of all matching nodes
     */
    protected function getMdSecValues(AbstractDocument $document, string $dmdIds, string $xpath): array
    {
        if (empty($dmdIds)) {
            return [];
        }

        $mdSec = $document->mdSec ?? [];
        $values = [];

        foreach (explode(' ', $dmdIds) as $dmdId) {
            $xml = $mdSec[$dmdId]['xml'] ?? null;
            if (!$xml instanceof \SimpleXMLElement) {
                continue;
            }

            $nodes = $xml->xpath($xpath);
            if (empty($nodes)) {
                continue;
            }

            foreach ($nodes as $node) {
                $values[] = trim((string) $node);
            }
        }

        return $values;
    }

    /**
     * Check if the requested URL may be proxied at all.
     *
     * @access protected
     *
     * @param string $url The requested URL
     *
     * @return bool
     */
    protected function isWhitelistedUrl(string $url): bool
    {
        foreach (self::URL_WHITELIST as $prefix) {
            if (str_starts_with($url, $prefix)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the requested URL matches the file location taken from the METS
     * file. The file location may either be the URL itself or a proxy URL which
     * contains the requested URL in its `url` parameter.
     *
     * This replaces the former `PageViewRestrictionProxy::checkUrl()`.
     *
     * @access protected
     *
     * @param string $metsUrl The file location from the METS file
     * @param string $url The requested URL
     *
     * @return bool
     */
    protected function isValidFileLocation(string $metsUrl, string $url): bool
    {
        if ($metsUrl === '') {
            return false;
        }

        if ($metsUrl === $url) {
            return true;
        }

        foreach (explode('&', $metsUrl) as $parameter) {
            if (urldecode(str_replace('url=', '', $parameter)) === $url) {
                return true;
            }
        }

        return false;
    }
}
