<?php
defined('TYPO3') or die('Access denied.');

\FluidTYPO3\Flux\Core::registerProviderExtensionKey('Kitodo.PresentationPackage', 'Content');
\FluidTYPO3\Flux\Core::registerProviderExtensionKey('Kitodo.PresentationPackage', 'Page');

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTypoScriptSetup(
    "@import 'EXT:presentation_package/Configuration/TypoScript/setup.typoscript'"
);

$domain = \TYPO3\CMS\Core\Utility\GeneralUtility::getIndpEnv('TYPO3_REQUEST_HOST');
if ($domain === 'https://hoerzu.sub.uni-hamburg.de' || $domain === 'https://hoerzu-dev.sub.uni-hamburg.de') {
    $GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['tx_dlf_pageview_proxy'] = \Kitodo\Dlf\Eid\PageViewProxy::class . '::main';
}

// Override language files
$GLOBALS['TYPO3_CONF_VARS']['SYS']['locallangXMLOverride']['EXT:dlf/Resources/Private/Language/locallang_metadata.xlf'][] = 'EXT:presentation_package/Resources/Private/Language/Overrides/locallang_metadata.xlf';
$GLOBALS['TYPO3_CONF_VARS']['SYS']['locallangXMLOverride']['de']['EXT:dlf/Resources/Private/Language/locallang_metadata.xlf'][] = 'EXT:presentation_package/Resources/Private/Language/Overrides/de.locallang_metadata.xlf';

$GLOBALS['TYPO3_CONF_VARS']['SYS']['locallangXMLOverride']['EXT:dlf/Resources/Private/Language/locallang_structure.xlf'][] = 'EXT:presentation_package/Resources/Private/Language/Overrides/locallang_structure.xlf';
$GLOBALS['TYPO3_CONF_VARS']['SYS']['locallangXMLOverride']['de']['EXT:dlf/Resources/Private/Language/locallang_structure.xlf'][] = 'EXT:presentation_package/Resources/Private/Language/Overrides/de.locallang_structure.xlf';

// subhh: Paginierung – Prev/Next wieder mit Text statt "<"/">" (dlf 7 Default)
$GLOBALS['TYPO3_CONF_VARS']['SYS']['locallangXMLOverride']['EXT:dlf/Resources/Private/Language/locallang.xlf'][] = 'EXT:presentation_package/Resources/Private/Language/Overrides/locallang.xlf';
$GLOBALS['TYPO3_CONF_VARS']['SYS']['locallangXMLOverride']['de']['EXT:dlf/Resources/Private/Language/locallang.xlf'][] = 'EXT:presentation_package/Resources/Private/Language/Overrides/de.locallang.xlf';

// override Caching Framework for Solr queries
$GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['tx_dlf_solr'] = [];
$GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['tx_dlf_solr']['backend'] = 'TYPO3\\CMS\\Core\\Cache\\Backend\\FileBackend';
$GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['tx_dlf_solr']['options']['defaultLifeTime'] = 3600; // 86400 seconds = 1 day
// override Caching Framework for XML file caching
$GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['tx_dlf_doc'] = [];
$GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['tx_dlf_doc']['backend'] = 'TYPO3\\CMS\\Core\\Cache\\Backend\\FileBackend';
$GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['tx_dlf_doc']['options']['defaultLifeTime'] = 3600; // 864000 seconds = 1 day