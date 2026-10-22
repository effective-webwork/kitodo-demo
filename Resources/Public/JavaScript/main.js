function listviewCalendarSwitch() {
    $('.tx-dlf-listview li .tx-dlf-type span').each(function() {
        if ($(this).text().trim().toLowerCase() == 'zeitung' || $(this).text().trim().toLowerCase() == 'jahr') {
            var link = $(this).parent().parent().find("h2 a").attr('href');
            link = link.split("?");
            var params = link[1];
            link = link[0];
            link = link.replace('detailseite', 'kalender');
            link = link.replace('/startseite/trefferliste', '');
            $(this).parent().parent().find("h2 a").attr('href', link + '?' + params);
        }
    });
}

$( document ).ready(function() {
    // switch between list and calendar
    calendarSwitchViews();
    calendarSelectBox();
    listviewCalendarSwitch();
    calendarTitleOnly();
    pageGridButton();
});

function pageGridButton() {
    $('#pagegrid').on('click', function (evt) {
        evt.preventDefault();
        $('.fullsize-pagegrid').toggle();
    });
}

function calendarTitleOnly() {
    if ($('.tx-dlf-calendar').length || $('.tx-dlf-calendar-years').length) {
        var title = $('.tx-dlf-metadata .metadata-title ul li').text();
        $('.tx-dlf-metadata').parent().append('<div class="title-only">' + title + '</div>')
        $('.tx-dlf-metadata').hide();

    }
}

function calendarSwitchViews() {
    // ,calendar-items // .list-view
    // .select-calendar-view // .select-list-view active
    // .calendar-list-selection
    $('.tx-dlf-calendar-list-view').hide();
    $('.tx-dlf-calendar-list-selection .tx-dlf-calendar-select-calendar-view').addClass('selection-active');
    $('.tx-dlf-calendar-list-selection .tx-dlf-calendar-select-calendar-view').on('click', function (evt) {
        $('.tx-dlf-calendar-calendar-view').show();
        $('.tx-dlf-calendar-list-view').hide()
        $('.tx-dlf-calendar-list-selection .tx-dlf-calendar-select-calendar-view').addClass('selection-active');
        $('.tx-dlf-calendar-list-selection .tx-dlf-calendar-select-list-view').removeClass('selection-active');
    });

    $('.tx-dlf-calendar-list-selection .tx-dlf-calendar-select-list-view').on('click', function (evt) {
        $('.tx-dlf-calendar-list-view').show();
        $('.tx-dlf-calendar-calendar-view').hide();
        $('.tx-dlf-calendar-list-selection .tx-dlf-calendar-select-list-view').addClass('selection-active');
        $('.tx-dlf-calendar-list-selection .tx-dlf-calendar-select-calendar-view').removeClass('selection-active');
    });

}

function calendarSelectBox() {

    if (isTouchDevice()) {
        $(document).mouseup(function(e)
        {
            var container = $("div.tx-dlf-calendar-issues div.openSelectBox");

            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0)
            {
                container.hide();
                container.removeClass('openSelectBox');
            }
        });

        // $("div.issues div ul").each(function () {
        //     var interactiveElement = $(this).closest('div.issues');
        //     if ($(this).children('li').length > 1) {
        //         interactiveElement.on('click', function (event) {
        //             $("div.issues div.openSelectBox").hide();
        //
        //             $(this).children("div").addClass('openSelectBox');
        //             $(this).children("div").show();
        //         });
        //     } else {
        //         // dont show select box
        //         // set direct link instead
        //         interactiveElement.on('click', function (event) {
        //             window.location.href = $(this).find('div ul li a').attr('href');
        //         });
        //     }
        // });

    } else {

        $("div.tx-dlf-calendar-issues div.tx-dlf-calendar-day-link-list").each(function () {
            var interactiveElement = $(this).closest('div.tx-dlf-calendar-issues');
            if ($(this).children('a').length > 1) {
                // show select box
                interactiveElement.on('mouseenter', function (event) {
                    // $("div.issues div.dayLinkList").hide();

                    $(this).children("div").addClass('openSelectBox');
                    $(this).children("div").show();

                    setTimeout(function hoverTimeoutCheck() {
                        if ($('div.tx-dlf-calendar-issues div.openSelectBox:hover').length == 0 && $('div.tx-dlf-calendar-issues:hover').length == 0) {
                            $("div.tx-dlf-calendar-issues div.openSelectBox").hide();
                        } else {
                            setTimeout(hoverTimeoutCheck, 1000);
                        }
                    }, 1000);
                });
            } else {
                // set direct link
                interactiveElement.on('click', function (event) {
                    window.location.href = $(this).find('div a').attr('href');
                });
            }
        });
    }
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

$(document).ready(function() {
    setBackToListviewInBreadcrumb();
    initialFacetValueRestriction();
    setTitleOnDetailPage();
    shortenDescription();
    addLicenseIcon();
});

function shortenDescription() {
    // all short descriptions
    // $('p.short').each(function () {
    //     shortenText($(this));
    // });
    //
    // $('p.long').each(function () {
    //     shortenText($(this));
    // });
    $('.tx-dlf-collection-description').each(function() {
       shortenText($(this));
    });
    showMoreClickHandler();
}

function showMoreClickHandler() {
    $('.description-show-more').on('click', function (evt) {
        evt.preventDefault();
        $(this).parent().siblings('.tx-dlf-collection-description').toggleClass('shorten-text-4');
        if ($(this).text() == 'mehr...') {
            $(this).text('weniger...');
            $(this).toggleClass('show-less');
        } else {
            $(this).text('mehr...');
            $(this).toggleClass('show-less');
        }
    });
}

function shortenText(element) {
    if ($(element).text().length > 100) {
        $(element).addClass('shorten-text-4');
        $('<p><a href="#" class="description-show-more">mehr...</a></p>').insertAfter($(element));
    }

}

function initialFacetValueRestriction() {
    // $('.tx-dlf-search-facets ul').each(function () {
    //     if ($(this).children("li").length != 0 && $(this).children("li").length > 5) {
    //         $($(this).children("li")[4]).nextAll().hide();
    //         $(this).append('<li><a class="facetShowMore" href="#">Mehr ...</a></li>');
    //         $(this).append('<li><a class="facetShowLess" href="#">Weniger ...</a></li>');
    //         $(this).find('li a.facetShowLess').parent().hide();
    //     }
    // });
    $('.facetShowMore').on("click", function (event) {
        event.preventDefault();
        $(this).parent().parent().children("li").show();
        $(this).parent().hide();
        $(this).parent().parent().find('.facetShowLess').parent().show();
    });

    $('.facetShowLess').on("click", function (event) {
        event.preventDefault();
        $($(this).parent().parent().children("li")[4]).nextAll().hide();
        $(this).parent().hide();
        $(this).parent().parent().find('.facetShowMore').parent().show();
    });
}

function setTitleOnDetailPage() {
    var title = '';
    title = $('.tx-dlf-metadata article.metadata-title ul.metadata-values').text();

    // use class add2title to add metadata to title
    // default separator is "-" for a custom separator the data attribute "data-separator" can be used
    $('.tx-dlf-metadata dd.add2title').each(function () {
        if ($(this).data('separator')) {
            title = title + ' ' + $(this).data('separator') + ' ' + $(this).text();
        } else {
            title = title + ' - ' + $(this).text();
        }
    });

    $('.detail-view-header dd.tx-dlf-metadata-title').text(title);
}

function setBackToListviewInBreadcrumb() {
    $('#backtolistview a').attr("href", $('li.tx-dlf-navigation-backtolist a').attr("href"));
}

function addLicenseIcon() {
    if ($('.license-url ul li').length > 0) {
        var link = $('.license-url ul li').text();
        var res = link.split("/");

        // remove empty strings
        res = res.filter(String);

        var category = res[res.length - 4].substring(0,1);
        var shortName = res[res.length - 3];
        var version = res[res.length - 2];

        // http://i.creativecommons.org/p/zero/1.0/88x31.png
        // https://creativecommons.org/licenses/by-nc-sa/4.0/
        // http://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png

        var icon = 'https://i.creativecommons.org/' + category + '/' + shortName + '/' + version + '/88x31.png';

        $('.license_label_value').prepend('<a href="' + link + '"><img src="' + icon + '"/></a>');
    }
}