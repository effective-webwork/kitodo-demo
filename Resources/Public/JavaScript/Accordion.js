;(function($, document, window) {
    "use strict";

    $(document).ready(function() {

        $('[data-accordion]').each(function() {
            var $firstLevelLinks = $(this).find('> div > a,> div > h2 > a,> div > h3 > a,> div > h4 > a,> div > h5 > a');

            $firstLevelLinks.click(function(event) {
                event.preventDefault();

                var $a = $(this);

                var isExpanded = $a.hasClass('button_red');

                $a.toggleClass('button_grey', isExpanded);
                $a.toggleClass('button_red', !isExpanded);
                $a.find('em').toggleClass('subhh-icon_plus', isExpanded);
                $a.find('em').toggleClass('subhh-icon_less', !isExpanded);

                var $subMenu = $a.next('ul');

                if (!$subMenu.length) {
                    $subMenu = $a.parent().next('ul');
                }

                if ($subMenu.length) {
                    $subMenu.slideToggle();
                }
            });
        });
    });

})(jQuery, document, window);