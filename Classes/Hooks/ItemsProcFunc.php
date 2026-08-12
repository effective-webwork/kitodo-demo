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

namespace Kitodo\PresentationPackage\Hooks;

use Kitodo\Dlf\Common\Helper;
use Kitodo\Dlf\Hooks\ItemsProcFunc as DlfItemsProcFunc;
use TYPO3\CMS\Backend\Utility\BackendUtility;

/**
 * XCLASS of {@see \Kitodo\Dlf\Hooks\ItemsProcFunc} (registered in ext_localconf.php).
 *
 * dlf 7's toolList() reads the registered toolbox tools via
 * ConfigurationManager::getLocalConfigurationValueByPath('SC_OPTIONS'), which only
 * returns the persisted config/system/settings.php and therefore never contains the
 * tools registered at runtime in dlf's ext_localconf.php. As a result the Toolbox
 * plugin's "Available items" list stays empty in the backend. We override only that
 * one method to read the runtime-merged $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS'],
 * matching the behaviour of the previous (dlf 5) installation. The original dlf
 * FlexForm (which references Kitodo\Dlf\Hooks\ItemsProcFunc->toolList) is reused
 * unchanged — the XCLASS makes it resolve to this class.
 *
 * @access public
 */
class ItemsProcFunc extends DlfItemsProcFunc
{
    private const TOOL_KEY_MAP = [
        'tx_dlf_pdfdownloadtool'       => 'pdfDownloadTool',
        'tx_dlf_fulltexttool'          => 'fulltextTool',
        'tx_dlf_fulltextdownloadtool'  => 'fulltextDownloadTool',
        'tx_dlf_imagemanipulationtool' => 'imageManipulationTool',
        'tx_dlf_imagedownloadtool'     => 'imageDownloadTool',
        'tx_dlf_modeldownloadtool'     => 'modelDownloadTool',
        'tx_dlf_audiovideotool'        => 'audioVideoTool',
        'tx_dlf_annotationtool'        => 'annotationTool',
        'tx_dlf_scoretool'             => 'scoreTool',
        'tx_dlf_searchindocumenttool'  => 'searchInDocumentTool',
        'tx_dlf_multiviewaddsourcetool'=> 'multiViewAddSourceTool',
    ];


    /**
     * Populate the FlexForm's items array for plugin "Toolbox".
     *
     * @access public
     *
     * @param mixed[] &$params An array with parameters
     *
     * @return void
     */
    public function toolList(array &$params): void
    {
        $tools = $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['dlf/Classes/Plugin/Toolbox.php']['tools'] ?? [];
        foreach ($tools as $class => $label) {
            $toolName = self::TOOL_KEY_MAP[$class] ?? $class;
            $params['items'][] = [Helper::getLanguageService()->sL($label), $toolName];
        }
    }
    
    /**
     * When inserting a new content element "after" another one, TYPO3 sets a
     * negative pid (e.g. -1 = "behind tt_content uid 1"). The parent method
     * would hand that value to SiteFinder, which fails with
     * "No site found in root line of page -1". Resolve it to the real page id
     * first, then delegate to the parent implementation.
     */
    public function loadStoragePid(array $params): void
    {
        $pid = (int)($params['flexParentDatabaseRow']['pid'] ?? 0);
        if ($pid < 0) {
            $record = BackendUtility::getRecord('tt_content', abs($pid), 'pid');
            $params['flexParentDatabaseRow']['pid'] = (int)($record['pid'] ?? 0);
        }
        parent::loadStoragePid($params);
    }
}
