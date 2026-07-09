<?php

$EM_CONF[$_EXTKEY] = array(
	'title' => 'Kitodo Presentation Package',
	'description' => '',
	'category' => 'distribution',
	'author' => 'Christopher Timm',
	'author_email' => 'timm@effective-webwork.de',
	'state' => 'stable',
	'internal' => '',
	'uploadfolder' => '0',
	'createDirs' => '',
	'clearCacheOnLoad' => 0,
	'version' => '13.4.0',
	'constraints' => array(
		'depends' => array(
			'typo3' => '13.4.0-13.4.99',
			'fluid_styled_content' => '',
		),
		'conflicts' => array(
			'css_styled_content' => '',
		),
		'suggests' => array(
		),
	),
);