<?php
if (!defined('TYPO3_MODE')) {
	die('Access denied.');
}

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile("Kitodo.PresentationPackage", 'Configuration/TypoScript', 'Kitodo Presentation Package');
