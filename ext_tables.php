<?php
if (!defined('TYPO3')) {
    die('Access denied.');
}

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile('presentation_package', 'Configuration/TypoScript', 'Kitodo Presentation Package');
