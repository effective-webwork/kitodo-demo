<?php
namespace Kitodo\PresentationPackage\ViewHelpers;

class MenuHeaderSyncViewHelper extends \TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper
{

    public function render() {

        $content = file_get_contents('https://www.sub.uni-hamburg.de/startseite.html?type=6666');

        $content = explode('<div id="content_cols" class="clear" style="background: url(fileadmin/redaktion/Startseite/architectura.jpg) no-repeat center center fixed #8D0D1B; background-size: cover;">
        </div>', $content);

        $this->templateVariableContainer->add('topContent', $content[0]);
        $this->templateVariableContainer->add('bottomContent', $content[1]);
    }

}