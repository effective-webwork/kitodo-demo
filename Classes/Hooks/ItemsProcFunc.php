<?php

namespace Kitodo\PresentationPackage\Hooks;

use TYPO3\CMS\Backend\Utility\BackendUtility;

class ItemsProcFunc extends \Kitodo\Dlf\Hooks\ItemsProcFunc
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


    public function toolList(array &$params): void
    {
        $tools = $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['dlf/Classes/Plugin/Toolbox.php']['tools'] ?? [];
        foreach ($tools as $class => $label) {
            $toolName = self::TOOL_KEY_MAP[$class] ?? $class;
            $params['items'][] = [\Kitodo\Dlf\Common\Helper::getLanguageService()->sL($label), $toolName];
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
