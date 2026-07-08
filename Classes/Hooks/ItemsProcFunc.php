<?php

/**
 * (c) Kitodo. Key to digital objects e.V. <contact@kitodo.org>
 *
 * This file is part of the Kitodo and TYPO3 projects.
 *
 * @license GNU General Public License version 3 or later.
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 */

namespace Kitodo\PresentationPackage\Hooks;

use Kitodo\Dlf\Common\Helper;
use Kitodo\Dlf\Hooks\ItemsProcFunc as DlfItemsProcFunc;
use TYPO3\CMS\Core\Utility\DebugUtility;
use TYPO3\CMS\Extbase\Utility\DebuggerUtility;

/**
 * XCLASS of {@see \Kitodo\Dlf\Hooks\ItemsProcFunc} (registered in ext_localconf.php).
 *
 * dlf 7's toolList() reads the registered toolbox tools via
 * ConfigurationManager::getLocalConfigurationValueByPath('SC_OPTIONS'), which only
 * returns the persisted config/system/settings.php and therefore never contains the
 * tools registered at runtime in dlf's ext_localconf.php. As a result the Toolbox
 * plugin's "Available items" list stays empty in the backend. We override only that
 * one method to read the runtime-merged $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS'],
 * matching the behaviour of the previous (dlf 5) installation. The original dlf
 * FlexForm (which references Kitodo\Dlf\Hooks\ItemsProcFunc->toolList) is reused
 * unchanged — the XCLASS makes it resolve to this class.
 *
 * @access public
 */
class ItemsProcFunc extends DlfItemsProcFunc
{
    /**
     * Populate the FlexForm's items array for plugin "Toolbox".
     *
     * @access public
     *
     * @param mixed[] &$params An array with parameters
     *
     * @return void
     */
    public function toolList(array &$params): void
    {
        $tools = $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['dlf/Classes/Plugin/Toolbox.php']['tools'] ?? [];
        foreach ($tools as $class => $label) {
            $params['items'][] = [Helper::getLanguageService()->sL($label), $class];
        }
    }
}
