<?php
defined('TYPO3') or die();

// Page-/User-TSconfig werden in TYPO3 v13 automatisch aus
// Configuration/page.tsconfig bzw. Configuration/user.tsconfig geladen.

$GLOBALS['TYPO3_CONF_VARS']['SYS']['Objects'][\Kitodo\Dlf\Hooks\ItemsProcFunc::class] = [
    'className' =>  \Kitodo\PresentationPackage\Hooks\ItemsProcFunc::class,
];

// Additional metadata labels. The override is registered for the default
// language file only - TYPO3 picks up the de. sibling next to it on its own -
// and its labels are merged into dlf's, so only new or changed ones are needed.
$GLOBALS['TYPO3_CONF_VARS']['SYS']['locallangXMLOverride']['EXT:dlf/Resources/Private/Language/locallang_metadata.xlf'][]
    = 'EXT:presentation_package/Resources/Private/Extensions/Dlf/Language/locallang_metadata.xlf';

// Image proxy with access restrictions, formerly an eID script inside dlf.
// The eID key must not change: it is part of the file URLs in every published
// METS file.
$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['tx_dlf_pageview_restriction_proxy']
    = \Kitodo\PresentationPackage\Eid\PageViewRestrictionProxy::class . '::main';
