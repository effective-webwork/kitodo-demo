<?php
defined('TYPO3') or die();

// Page-/User-TSconfig werden in TYPO3 v13 automatisch aus
// Configuration/page.tsconfig bzw. Configuration/user.tsconfig geladen.

$GLOBALS['TYPO3_CONF_VARS']['SYS']['Objects'][\Kitodo\Dlf\Hooks\ItemsProcFunc::class] = [
    'className' =>  \Kitodo\PresentationPackage\Hooks\ItemsProcFunc::class,
];
