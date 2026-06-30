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
	'version' => '13.4',
	'constraints' => array(
		'depends' => array(
		),
		'suggests' => array(
		),
	),
    'autoload' =>
    array (
        'psr-4' =>
            array (
                'Kitodo\\PresentationPackage\\' => 'Classes/',
            ),
    ),
);