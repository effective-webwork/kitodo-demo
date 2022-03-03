<?php
namespace Kitodo\PresentationPackage\ViewHelpers;

class MenuHeaderSyncViewHelper extends \TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper
{

    public function render() {

        $content = file_get_contents('https://www.sub.uni-hamburg.de/startseite.html?type=6666');

        $content = str_replace('<script src="https://www.sub.uni-hamburg.de/typo3conf/ext/subhh_website/Resources/Public/js/sub-website.min.js?1590473433" type="text/javascript"></script>', '', $content);

        // replace links
        $content = str_replace('https://www.sub.uni-hamburg.de/impressum.html', 'https://digitalisate.sub.uni-hamburg.de/impressum.html', $content);
        $content = str_replace('https://www.sub.uni-hamburg.de/datenschutzerklaerung.html', 'https://digitalisate.sub.uni-hamburg.de/datenschutzerklaerung.html', $content);

        $content = explode('<div id="content_cols" class="clear" style="background: url(fileadmin/redaktion/Startseite/architectura.jpg) no-repeat center center fixed #8D0D1B; background-size: cover;">
        </div>', $content);

        $this->templateVariableContainer->add('topContent', $content[0]);
        $this->templateVariableContainer->add('bottomContent', $content[1]);
    }

}