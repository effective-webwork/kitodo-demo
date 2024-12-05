
$('.tx-dlf-basket-button a').text("merken");
$('.add-to-cart a').text("merken");
$('#submitBasketForm').text("merken");

$('#kitodo-logo').attr("href", "index.php?id=1");

// calendar functions

$( document ).ready(function() {
    // switch between list and calendar
    calendarSwitchViews();
    calendarSelectBox();
    showVolumeList();
});

function showVolumeList() {
    // Volume list
    $('.metadata-title-only .secondpart').remove();
    
    var structtype = $('dd.doc-type').text();
    if( structtype === 'Zeitschrift' ||
        structtype === 'Mehrbändiges Werk'
    ) {
        $('.detail-view-main').append('<div class="volume-info-wrapper"><div class="volume-info">Bitte wählen Sie einen Band aus</div><ul class="volume-list"></ul></div>');
        $('.tx-dlf-toc ul ul li').each(function(index) {
            $('.volume-list').append('<li>'+$(this).html() +'</li>');
        });
        $('a.chapter_download, a#pdfdownloadbutton').hide();
        $('div.tx-dlf-toc span.headline_info').html('Bandliste');

        // reduce height of pageview map
        $('.tx-dlf-map').css('min-height', '0px');

        // Hide toolbox
        $('.tx-dlf-toolbox').hide();

        return false;
    }
}

function calendarSwitchViews() {
    // ,calendar-items // .list-view
    // .select-calendar-view // .select-list-view active
    // .calendar-list-selection
    $('.list-view').hide();
    $('.calendar-list-selection .select-calendar-view').addClass('selection-active');
    $('.calendar-list-selection .select-calendar-view').on('click', function (evt) {
        $('.calendar-items').show();
        $('.list-view').hide()
        $('.calendar-list-selection .select-calendar-view').addClass('selection-active');
        $('.calendar-list-selection .select-list-view').removeClass('selection-active');
    });

    $('.calendar-list-selection .select-list-view').on('click', function (evt) {
        $('.list-view').show();
        $('.calendar-items').hide();
        $('.calendar-list-selection .select-list-view').addClass('selection-active');
        $('.calendar-list-selection .select-calendar-view').removeClass('selection-active');
    });

}

function calendarSelectBox() {

    if (isTouchDevice()) {
        $(document).mouseup(function(e)
        {
            var container = $("div.issues div.openSelectBox");

            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0)
            {
                container.hide();
                container.removeClass('openSelectBox');
            }
        });

        $("div.issues div ul").each(function () {
            var interactiveElement = $(this).closest('div.issues');
            if ($(this).children('li').length > 1) {
                interactiveElement.on('click', function (event) {
                    $("div.issues div.openSelectBox").hide();

                    $(this).children("div").addClass('openSelectBox');
                    $(this).children("div").show();
                });
            } else {
                // dont show select box
                // set direct link instead
                interactiveElement.on('click', function (event) {
                    window.location.href = $(this).find('div ul li a').attr('href');
                });
            }
        });

    } else {

        $("div.issues div ul").each(function () {
            var interactiveElement = $(this).closest('div.issues');
            if ($(this).children('li').length > 1) {
                // show select box
                interactiveElement.on('mouseenter', function (event) {
                    $("div.issues div.openSelectBox").hide();

                    $(this).children("div").addClass('openSelectBox');
                    $(this).children("div").show();

                    setTimeout(function hoverTimeoutCheck() {
                        if ($('div.issues div.openSelectBox:hover').length == 0 && $('div.issues:hover').length == 0) {
                            $("div.issues div.openSelectBox").hide();
                        } else {
                            setTimeout(hoverTimeoutCheck, 1000);
                        }
                    }, 1000);
                });
            } else {
                // dont show select box
                // set direct link instead
                interactiveElement.on('click', function (event) {
                    window.location.href = $(this).find('div ul li a').attr('href');
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



// listview

// autocomplete
$('#tx-dlf-search-query').keypress(function () {
    console.log($("#tx-dlf-search-suggest ul li div")
        .text()
        .substr(0, 70) + " ...");
    $("#tx-dlf-search-suggest ul li div").text(
        $("#tx-dlf-search-suggest ul li div")
            .text()
            .substr(0, 70) + " ..."
    );
});


$(".tx-dlf-listview-list ol").hide();

$(".tx-dlf-listview-list ol").hide();

$(".tx-dlf-search-numHits").hide();

// show-volumes-expand
// show-volumes-minimize

 $(".show-volumes").each(function () {
    if ($(this).parent().find("ol").length > 0) {
        $(this).show();
    }
});

$(".show-volumes").on("click", function (evt) {
    evt.preventDefault();

    $(this).children("a").toggleClass("down");
    $(this).parent().find("ol").toggle();

    if ($(this).children("a").text() == "Details einblenden") {
        $(this).children("a").text("Details ausblenden");
    } else {
        $(this).children("a").text("Details einblenden");
    }

});


// Detailview

// return to list link
if ($('.tx-dlf-navigation-listview a').length > 0) {
    $('.meta-actions #backlink').show();
    $('.meta-actions #backlink').attr( "href", $('.tx-dlf-navigation-listview a').attr("href"));
}

$(".tx-dlf-metadata dd.tx-dlf-metadata-title").attr("data-full", $(".tx-dlf-metadata dd.tx-dlf-metadata-title").first().text());

$(".tx-dlf-metadata dd.tx-dlf-metadata-title").text(
    $(".tx-dlf-metadata dd.tx-dlf-metadata-title")
        .first()
        .text()
      //  .substring(0, 70) + " ..."
);

// collapse metadata
$(".tx-dlf-metadata input[type=checkbox]").prop('checked', true);

// add pagegrid button
if ($('div.tx-dlf-navigation').length > 0) {
    $('.detail-view-nav ul.tx-dlf-navigation').append('<li class="tx-dlf-navigation-pagegrid"><a href="#">Bildübersicht</a></li>');

    $('li.tx-dlf-navigation-pagegrid a').on('click', function(evt) {
        evt.preventDefault();
        $('section#main-content .tx-dlf-pagegrid .tx-dlf-pagegrid').toggle();
    });
}

// add ol reset button
if ($('div.tx-dlf-navigation').length > 0) {
    $('.detail-view-nav ul.tx-dlf-navigation').append('<li class="tx-dlf-navigation-reset"><a href="#">Zurücksetzen</a></li>');

    $('li.tx-dlf-navigation-reset a').on('click', function(evt) {
        evt.preventDefault();
        if (tx_dlf_viewer) {
            tx_dlf_viewer.map.resetRotation();
            tx_dlf_viewer.map.zoom(1);
        }
    });
}


// add fullscreen button
if ($('div.tx-dlf-navigation').length > 0) {
    $('.detail-view-nav ul.tx-dlf-navigation').append('<li class="tx-dlf-navigation-fullscreen"><a href="#">Vollbild</a></li>');

    if (Cookies.get('fullscreen')) {
        Cookies.set('fullscreen', '1');
        $('section.portal-meta').hide();
    } else {
        $('section.portal-meta').show();
    }

    $('li.tx-dlf-navigation-fullscreen a').on('click', function(evt) {
        evt.preventDefault();

        if (Cookies.get('fullscreen')) {
            Cookies.remove('fullscreen');
            $('section.portal-meta').show();
        } else {
            Cookies.set('fullscreen', '1');
            $('section.portal-meta').hide();
        }
    });
}

$(".tx-dlf-metadata .show-metadata").on("click", function (evt) {
    evt.preventDefault();

    $(this).children("a").toggleClass("down");
    $('.secondpart').toggle();

    if ($(this).children("a").text() == "Details einblenden") {
        $(this).children("a").text("Details ausblenden");
        $(".tx-dlf-metadata dd.tx-dlf-metadata-title").text(
            $(".tx-dlf-metadata dd.tx-dlf-metadata-title").attr("data-full")
        );
    } else {
        $(this).children("a").text("Details einblenden");
        $(".tx-dlf-metadata dd.tx-dlf-metadata-title").attr("data-full",
            $(".tx-dlf-metadata dd.tx-dlf-metadata-title")
                .text()
     //           .substring(0, 70) + " ..."
            );
    }

});

$(".tx-dlf-navigation-zoom-in").click(function() { tx_dlf_viewer.map.zoomIn(); });
$(".tx-dlf-navigation-zoom-out").click(function() { tx_dlf_viewer.map.zoomOut(); });

$(".tx-dlf-navigation-rotate-right a").click(function () {
    tx_dlf_viewer.map.rotate(90);
});
$(".tx-dlf-navigation-rotate-left a").click(function () {
    tx_dlf_viewer.map.rotate(-90);
});

$('.tx-dlf-navigation-double a, .tx-dlf-navigation-double span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-doublepage.svg" alt="Show double pages">');


$('.tx-dlf-navigation-double-plus a, .tx-dlf-navigation-double-plus span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-verso.svg" alt="Adjust recto/verso">');

$('.tx-dlf-navigation-zoom-in a, .tx-dlf-navigation-zoom-in span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-zoomin.svg" alt="Zoom In">');

$('.tx-dlf-navigation-zoom-out a, .tx-dlf-navigation-zoom-out span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-zoomout.svg" alt="Zoom Out">');

$('.tx-dlf-navigation-rotate-left a, .tx-dlf-navigation-rotate-left span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-rotateleft.svg" alt="Rotate Left">');

$('.tx-dlf-navigation-rotate-right a, .tx-dlf-navigation-rotate-right span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-rotateright.svg" alt="Rotate Right">');

$('.tx-dlf-navigation-first a, .tx-dlf-navigation-first span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-skipleft.svg" alt="First Page">');

$('.tx-dlf-navigation-back a, .tx-dlf-navigation-back span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-doubleleft.svg" alt="Back 5 Pages">');

$('.tx-dlf-navigation-prev a, .tx-dlf-navigation-prev span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-singleleft.svg" alt="Previous Page">');

$('.tx-dlf-navigation-next a, .tx-dlf-navigation-next span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-singleright.svg" alt="Next Page">');

$('.tx-dlf-navigation-fwd a, .tx-dlf-navigation-fwd span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-doubleright.svg" alt="Forward 5 Pages">');

$('.tx-dlf-navigation-last a, .tx-dlf-navigation-last span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-skipright.svg" alt="Last Page">');

$('.tx-dlf-navigation-listview a, .tx-dlf-navigation-listview span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-skipright.svg" alt="Zurück zur Liste">');

$('.tx-dlf-navigation-listview a, .tx-dlf-navigation-listview span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-skipright.svg" alt="Last Page">');

$('.tx-dlf-navigation-listview a, .tx-dlf-navigation-listview span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-tool.svg" alt="Toolbox">');


if ($('.tx-dlf-navigation-edit').length) {
    $('ul.tx-dlf-navigation').append('<li class="tx-dlf-navigation-edit">' + $('.tx-dlf-navigation-edit').html() + '</li>');
} else {
    $('ul.tx-dlf-navigation').append('<li class="tx-dlf-navigation-edit"><span></span></li>');
}

if ($('.tx-dlf-navigation-editRemove').length) {
    $('ul.tx-dlf-navigation').append('<li class="tx-dlf-navigation-editRemove" style="padding-left: 4px;">' + $('.tx-dlf-navigation-editRemove').html() + '</li>');
} else {
    $('ul.tx-dlf-navigation').append('<li class="tx-dlf-navigation-editRemove" style="padding-left: 4px;"><span></span></li>');
}

if ($('.tx-dlf-navigation-magnifier').length) {
    $('ul.tx-dlf-navigation').append('<li class="tx-dlf-navigation-magnifier" style="padding-left: 4px;">' + $('.tx-dlf-navigation-magnifier').html() + '</li>');
} else {
    $('ul.tx-dlf-navigation').append('<li class="tx-dlf-navigation-magnifier" style="padding-left: 4px;"><span></span></li>');
}

// TOOLBOX
$('aside ul.tx-dlf-navigation').append('<li class="tx-dlf-navigation-tools" style="margin-left:10px;"><div id="c16" class="detail-view-tools" style="display:inline-block;">' + $('.detail-view-tools').html() + '</div></li>');
$('aside li.tx-dlf-navigation-tools label[for="checkbox-menu2"]').text("").prepend('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-tool.svg" alt="Toolbox">');
$('aside .detail-view-itemoptions .detail-view-tools').hide();


$('.tx-dlf-navigation-edit a, .tx-dlf-navigation-edit span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-selection.svg" alt="Ausschnitt auswählen">');

$('.tx-dlf-navigation-editRemove a, .tx-dlf-navigation-editRemove span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-selection-x.svg" alt="Ausschnitt entfernen">');

$('.tx-dlf-navigation-magnifier a, .tx-dlf-navigation-magnifier span')
    .text("")
    .append('<img src="' + window.location.origin + '/typo3conf/ext/presentation_package/Resources/Public/Images/icon-magnifying.svg" alt="Lupe">');


$('div.tx-dlf-navigation-edit').hide();
$('div.tx-dlf-navigation-editRemove').hide();
$('div.tx-dlf-navigation-magnifier').hide();

// link transformation
$('.transformlink').each(function () {
    $(this).html('<a href="' + $(this).text() + '">Link</a>');
});

// license

// label
$('.license-label-key').hide();
var licenseLabel = $('.license-label-value').text();

$('.license').text(licenseLabel);
$('.license-label-value').hide();

// icon
var link = $('.license').attr('href');
if (link) {
    var res = link.split("/");

    // remove empty strings
    res = res.filter(String);

    if (res[1] == "creativecommons.org") {
        // get the last two non empty values
        var category = res[res.length - 3].substring(0,1);
        var shortName = res[res.length - 2];
        var version = res[res.length - 1];

        // http://i.creativecommons.org/p/zero/1.0/88x31.png
        // https://creativecommons.org/licenses/by-nc-sa/4.0/
        // http://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png

        var icon = 'https://i.creativecommons.org/' + category + '/' + shortName + '/' + version + '/88x31.png';

        $('.license').prepend('<img src="' + icon + '"/>');
    }
}

$('.tx-dlf-listview-list > li > dl .doc-type').each(function() {
    if ($(this).text().toLowerCase() == 'newspaper' || $(this).text().toLowerCase() == 'year') {
        var link = $(this).parent().find("dd.tx-dlf-metadata-title a").attr('href');
        link = link.split("?")[0];
        link = link.replace('detailseite', 'kalender');
        link = link.replace('/page', '');
        $(this).parent().find("dd.tx-dlf-metadata-title a").attr('href', link);
    }
});
