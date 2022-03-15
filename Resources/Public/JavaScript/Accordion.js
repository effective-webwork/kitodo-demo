;(function($, document, window) {
    "use strict";

    $(document).ready(function() {

        $('[data-accordion]').each(function() {
            var $firstLevelLinks = $(this).find('> div > li > a,> div > li > h2 > a,> div > li > h3 > a,> div > li > h4 > a,> div > li > h5 > a');

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