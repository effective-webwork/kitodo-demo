<?php

$EM_CONF[$_EXTKEY] = array(
	'title' => 'Kitodo Presentation Package',
	'description' => '',
	'category' => 'distribution',
	'author' => 'Christopher Timm',
	'author_email' => 'timm@effective-webwork.de',
	'state' => 'stable',
	'version' => '2.0.0',
	'constraints' => array(
		'depends' => array(
			'typo3' => '13.4.0-13.4.99',
			'flux' => '12.0.0-12.99.99',
		),
		'suggests' => array(
		),
	),
);
