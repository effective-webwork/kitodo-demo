$(document).ready(function() {
    enrichBreadcrumbForVolumes();

    if (showVolumeList()) {
        setNavigationControls();
    } else {
        $('div.tx-dlf-navigation').hide();
    }
    initOverlays();

    // mk 2022-11-07 # apply date format transformation before adding it to the title
    transformDateFormat();

    setTitleOnDetailPage();

    setBackToListviewInBreadcrumb();

    listViewFunction();

    initialFacetValueRestriction();

    setToolboxControl();

    addTocPlus();

    pagerFormAdjustment();

    facetTouchStyle();

    addThumbnailPlaceholder();

    addFullPdfDownload();

    // workaround
    fixLabelInputMetadata();

    showDeletionButton();

    searchInDocumentResetIcon();

    renameMetadataTab();

    initExpandCollapse();

    calendarSelectBox();

    calendarSwitchViews();

    replaceRssFeedImage();

    fulltextPositionAdjustment();

    fullscreenNavigationPositioning();

    clickEventMetadataToc();

    listviewNewspaperRouting();

    let pagegrid = 0;

    pageGridClickEvent();
    fulltextClickEvent();
});

function initOverlays() {
    if (Cookies.get('overlay1')) {
        openNav();
    }
    if (Cookies.get('overlay2')) {
        openNav2();
    }
    if (Cookies.get('overlay3')) {
        openNav3();
    }
    if (Cookies.get('overlay4')) {
        openNav4();
    }
}

function openNav() {
    Cookies.set('overlay1', '1');
    $('#myNav').addClass('active');
    $('#toc-overlay-btn').removeClass('active');
}

function closeNav() {
    Cookies.remove('overlay1');
    $('#myNav').removeClass('active');
    $('#toc-overlay-btn').addClass('active');
}

function openNav2() {
    Cookies.set('overlay2', '1');
    $('#myNav2').addClass('active');
    $('#meta-overlay-btn').removeClass('active');
}

function closeNav2() {
    Cookies.remove('overlay2');
    $('#myNav2').removeClass('active');
    $('#meta-overlay-btn').addClass('active');
}

function openNav3() {
    Cookies.set('overlay3', '1');
    document.getElementById("myNav").style.height = "calc(65% - 120px)";
    $('#myNav3').addClass('active');
}

function closeNav3() {
    Cookies.remove('overlay3');
    document.getElementById("myNav").style.height = "calc(100% - 200px)";
    $('#myNav3').removeClass('active');
}

function openNav4() {
    Cookies.set('overlay4', '1');
    document.getElementById("myNav2").style.height = "calc(60% - 120px)";
    $('#myNav4').addClass('active');
}

function closeNav4() {
    Cookies.remove('overlay4');
    document.getElementById("myNav2").style.height = "calc(100% - 200px)";
    $('#myNav4').removeClass('active');
}

function togglePagegrid() {
    if(pagegrid === 0) {
        $('#fullsize-pagegrid').show();
        pagegrid = 1;
    }
    else {
        $('#fullsize-pagegrid').hide();
        pagegrid = 0;
    }
}

function searchInDocumentResetIcon() {
    $('.reset-search-in-document').on('click', function (evt) {
        evt.preventDefault();
        $('#tx-dlf-search-in-document-results ul').remove();
        $('.results-active-indicator').remove();
        $('#tx-dlf-search-in-document-query').val('').focus();
        $('.reset-search-in-document').hide();
    });

    $('#tx-dlf-search-in-document-query').on('keydown', function () {
        if ($('#tx-dlf-search-in-document-query').val() != '') {
            $('.reset-search-in-document').show();
        } else {
            $('.reset-search-in-document').hide();
        }
    })
}

function pageGridClickEvent() {
    $('#pagegrid').on('click', function() {
        togglePagegrid();
    });
}

function fulltextClickEvent() {
    $('#tx-dlf-tools-fulltext').on('click', function () {
        if ($('#myNav3').hasClass('active')) {
            closeNav3();
        } else {
            openNav3();
        }
    });

    // close click event
    $('#myNav3 a').on('click', function (evt) {
        $('#tx-dlf-tools-fulltext').click();
    });
}

function replaceRssFeedImage() {
    $('.tx-dlf-rss-feed a img').attr('src', '/typo3conf/ext/presentation_package/Resources/Public/Images/rss-feed.png');
}

function renameMetadataTab() {
    $('.tx-dlf-metadata .detail-view-itemdetails').each(function (index) {
        if (index > 0) {
            $(this).find('label').text('Metadaten - Aktuelle Seite');
        }
    });
}

function showDeletionButton() {
    if ($('#tx-dlf-search-query').val()) {
        $('<span class="search-term-deletion">X</span>').insertAfter($('#tx-dlf-search-query'));

        $('.search-term-deletion').on('click', function (event) {
            $('.search-term-deletion').hide();
            $('#tx-dlf-search-query').val('').focus();
        })
    }
}

function fixLabelInputMetadata() {
    if ($('input#checkbox-menu3').length > 1) {
        var elementCounter = $('input#checkbox-menu3').length - 1;

        for (i = 1; i < elementCounter+1; i++) {
            $($('input#checkbox-menu3')[1]).next().attr('for', 'checkbox-menu3'+i);
            $($('input#checkbox-menu3')[1]).attr('id', 'checkbox-menu3'+i);
        }


    }
}

function addFullPdfDownload() {
    // $('.tx-dlf-pdfdownloadtool')
    //     .append('<span class="fullPdfDownloadSpan"><a id="fullPdfDownload" href="#"><img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-pdf-white.svg" alt="PDF Download"></a></span>');

    $('#fullPdfDownload').on('click', function (event) {
        event.preventDefault();
        var GCS = 'https://pdf.sub.uni-hamburg.de/kitodo/';
        var PPN = $('#purl').text();

        //matomo statistic
        _paq.push(['trackEvent', 'COUNTER5', 'Total_Item_Requests', 'Download PDF', PPN]);
        _paq.push(['trackPageView']);

        window.open(GCS + PPN);
    });
}

function addThumbnailPlaceholder() {
    $('.tx-dlf-listview-thumbnail').each(function () {
        if ($(this).children('img').length == 0) {
            $(this).append('<img class="no-hover" src="/typo3conf/ext/presentation_package/Resources/Public/Images/document-collection.png"/>');
        }
    });
}

function facetTouchStyle() {
    if ($('label.facet-sub-title')) {
        $('label.facet-sub-title').each(function(i) {
            $(this).attr('for', 'checkbox-menu'+i).parent().prepend('<input type="checkbox" id="checkbox-menu'+i+'">');
        });
    }
}

function initExpandCollapse() {

    $('#expand').hide();

    $('.collexpand').click(function(event) {
        event.preventDefault();
        $('.collexpand').toggle();
        if($(this).attr('id') == 'collapse') {
            sideCollapse();
        } else {
            sideExpand();
        }

    });

    if (Cookies.get('kitodo-fullscreen') == '1') {
        $('.collexpand').toggle();
        sideCollapse(false);
    }
    fulltextPositionAdjustment();
}

function sideCollapse(updateMap = true) {
    $('#detail-view aside').css('width', 0);
    $('#detail-view .tx-dlf-pagegrid').hide();
    $('#detail-view aside > article > div > div.tx-dlf-metadata > div > .dropdown-menu').hide();
    $('#detail-view aside > article > div > div.tx-dlf-tableofcontents > div > .dropdown-menu').hide();
    $('#detail-view aside section').css('position', 'absolute').css('right', '300px');
    //$('.ol-unselectable.ol-layers').css('cssText', 'position: absolute; width: 100% !important; height: 100%; z-index: 0;');
    $('#header').hide();
    $('#opening_hours').hide();
    $('#detail-view section#main-content').css('width', '100%');
    setTimeout(function(){$('.ol-unselectable.ol-layers').css('cssText', 'position: absolute; width: 100% !important; height: 100%; z-index: 0;')}, 1500);
    $('ul.tx-dlf-toolbox').addClass('fs_on');

    if (updateMap) {
        tx_dlf_viewer.map.updateSize();
    }

    Cookies.set('kitodo-fullscreen', '1');
    fulltextPositionAdjustment();
}

function sideExpand(updateMap = true) {
    $('#detail-view aside').css('width', '33%').show();
    $('#detail-view .tx-dlf-pagegrid').show();
    $('#detail-view aside > article > div > div.tx-dlf-metadata > div > .dropdown-menu').show();
    $('#detail-view aside > article > div > div.tx-dlf-tableofcontents > div > .dropdown-menu').show();
    $('#detail-view aside section').css('position', 'initial').css('right', 0).css('top', '0px');
    $('.ol-unselectable.ol-layers').css('cssText', 'position: absolute; width: 100%; height: 100%; z-index: 0;');
    $('#header').show();
    $('#opening_hours').show();
    $('#detail-view section#main-content').css('width', '67%');
    $('ul.tx-dlf-toolbox').removeClass('fs_on');

    if (updateMap) {
        tx_dlf_viewer.map.updateSize();
    }

    Cookies.set('kitodo-fullscreen', '0');
    fulltextPositionAdjustment();
}

function pagerFormAdjustment() {
    // show only if pagebrowser has elements
    if($('.tx-dlf-listview-pagebrowser a').length == 0) {
        $('.pagingFormDiv').hide();
    }

    $('#pagerFormText').on('change', function (event) {
        $('#pagerFormHidden').val($(this).val()-1);
    })
}

function addTocPlus() {
    $('.tx-dlf-tableofcontents li.tx-dlf-toc-ifsub > a > span.tx-dlf-toc-title').prepend('+ ');
}

function setToolboxControl() {

    $('#tx-dlf-tools-fulltext').on('change', function() {
        console.log("TRIGGERED");
    });

    // PDF download is build in addFullPdfDownload function
    // $('.tx-dlf-tools-fulltext span.no-fulltext')
    //     .text('')
    //     .append('<img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-text-white.svg" alt="Kein Volltext vorhanden">');
    //
    // $('.tx-dlf-tools-fulltext a')
    //     .text('')
    //     .append('<img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-text-white.svg" alt="Volltext anzeigen">');



    if ($('.detail-view-tools').length > 0) {
        var innerToolbox = $('.detail-view-tools')[0].innerHTML;
        $('.detail-aside-nav .tx-dlf-navigation ul').append('<li class="tx-dlf-navigation-tools"><div class="detail-view-tools">' + innerToolbox + '</div></li>');
    }
}

function initialFacetValueRestriction() {
    $('.tx-dlf-search-facets ul').each(function () {
        if ($(this).children("li").length != 0 && $(this).children("li").length > 10) {
            $($(this).children("li")[9]).nextAll().hide();
            $(this).append('<li><a class="facetShowMore" href="#">Mehr ...</a></li>');
            $(this).append('<li><a class="facetShowLess" href="#">Weniger ...</a></li>');
            $(this).find('li a.facetShowLess').parent().hide();
        }
    });
    $('.facetShowMore').on("click", function (event) {
        event.preventDefault();
        $(this).parent().parent().children("li").show();
        $(this).parent().hide();
        $(this).parent().parent().find('.facetShowLess').parent().show();
    });

    $('.facetShowLess').on("click", function (event) {
        event.preventDefault();
        $($(this).parent().parent().children("li")[9]).nextAll().hide();
        $(this).parent().hide();
        $(this).parent().parent().find('.facetShowMore').parent().show();
    });
}

function showVolumeList() {
    var documentType = $("dd.tx-dlf-type").text();
    if (documentType == "Mehrbändiges Werk" || documentType == "Zeitschrift" ||
        documentType == "periodical" || documentType == "journal" ||
        documentType == "Mehrteilige Handschrift" || documentType == "Mehrteilige Graphik") {
        $('.detail-view-main').append('<div><div class="volume-info">Bitte wählen Sie einen Band aus</div><ul class="volume-list"></ul></div>');
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
    } else {
        // click handler toc
        $('a.chapter_download, a#pdfdownloadbutton').on('click', function(event) {
            $('#p_nutzungsbedingungen_kapitel').show();
            // http://gcs.sub.uni-hamburg.de/gcs?action=pdf&pagesize=original&metsFile=PPN734636776&divID=LOG_0002
            var link = $(this).attr('href');
            link = link.replace("http://resolver.sub.uni-hamburg.de/goobi/", "");
            $('#pdfdownloader_kapitel').attr('href', link);
            event.preventDefault();
        });
        return true;
    }
}

// Listview
function listViewFunction() {
    var button = $('ol.tx-dlf-volume').parent('li').find('.show-volumes');
    button.show();
    button.on("click", function (evt) {
        evt.preventDefault();
        $(this).children('a').toggleClass('show-volumes-minimize');
        $(this).children('a').toggleClass('show-volumes-expand');
        $(this).siblings('ol.tx-dlf-volume').toggle();
    });

    var pagingForm = $('#pagingForm');
    $('.tx-dlf-listview').append(pagingForm.html());
    pagingForm.hide();

}

/* Kitodo Presentation Detail Breadcrumb */
function enrichBreadcrumbForVolumes() {
    if ($('dt#PartOf').next('dd').data('partof') > 0) {

        var partOfLink = $('.tx-dlf-toc ul:first() li:first() a:first()').attr('href');
        $('a.PartOf').attr('href', partOfLink);
        $('dt#PartOf').next('dd').children('a.partOf').attr('href', partOfLink);

        var parentVolumeLink = $('.partOf').attr('href');

        var lastBreadcrumChild = $('.breadcrumb span:last-child').html();
        $('article.breadcrumb span:last-child').remove();

        $('article.breadcrumb').append('<a href="' + partOfLink + '" class="fade">Bandliste</a> /');
        $('article.breadcrumb').append(lastBreadcrumChild);
    } else {
        $('dt#PartOf').hide().next('dd').hide();
    }
}

function setBackToListviewInBreadcrumb() {
    $('#backtolistview').attr("href", $('li.tx-dlf-navigation-backtolist a').attr("href"));

}

function setTitleOnDetailPage() {
    var title = '';
    title = $('dd.tx-dlf-metadata-title').text();

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

function setNavigationControls() {

    // set icons
    // $('.tx-dlf-navigation .tx-dlf-navigation-prev a, .tx-dlf-navigation .tx-dlf-navigation-prev span')
    //     .text("")
    //     .append('<img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-arrow-left.svg" alt="Previous Page">');

    // $('.tx-dlf-navigation .tx-dlf-navigation-next span, .tx-dlf-navigation .tx-dlf-navigation-next a')
    //     .text("")
    //     .append('<img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-arrow-right.svg" alt="Next Page">');
    //
    // $('.tx-dlf-navigation .tx-dlf-navigation-zoom-in span, .tx-dlf-navigation .tx-dlf-navigation-zoom-in a')
    //     .text("")
    //     .append('<img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-zoomin.svg" alt="Zoom in">');
    //
    // $('.tx-dlf-navigation .tx-dlf-navigation-zoom-out span, .tx-dlf-navigation .tx-dlf-navigation-zoom-out a')
    //     .text("")
    //     .append('<img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-zoomout.svg" alt="Zoom out">');
    //
    // $('.tx-dlf-navigation .tx-dlf-navigation-rotate-left span, .tx-dlf-navigation .tx-dlf-navigation-rotate-left a')
    //     .text("")
    //     .append('<img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-rotateleft.svg" alt="Rotate left">');
    //
    // $('.tx-dlf-navigation .tx-dlf-navigation-rotate-right span, .tx-dlf-navigation .tx-dlf-navigation-rotate-right a')
    //     .text("")
    //     .append('<img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-rotateright.svg" alt="Rotate right">');
    //
    // $('.tx-dlf-navigation .tx-dlf-navigation-double span, .tx-dlf-navigation .tx-dlf-navigation-double a')
    //     .text("")
    //     .append('<img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-doublepage.svg" alt="Show double pages">');

    $('#main-content ul.tx-dlf-navigation')
        .append('<li><a id="collapse" class="collexpand" href="#"><img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-arrow-bigger.svg" alt="Größer"></a></li>');

    $('#main-content ul.tx-dlf-navigation')
        .append('<li><a id="expand" class="collexpand" href="#"><img src="/typo3conf/ext/presentation_package/Resources/Public/Images/icon-arrow-smaller.svg" alt="Kleiner"></a></li>');

    // $(".tx-dlf-navigation-zoom-in").click(function(event) {
    //     event.preventDefault();
    //     tx_dlf_viewer.map.zoomIn();
    // });
    // $(".tx-dlf-navigation-zoom-out").click(function(event) {
    //     event.preventDefault();
    //     tx_dlf_viewer.map.zoomOut();
    // });
    //
    // $(".tx-dlf-navigation-rotate-right a").click(function (event) {
    //     event.preventDefault();
    //     tx_dlf_viewer.map.rotate(90);
    // });
    // $(".tx-dlf-navigation-rotate-left a").click(function (event) {
    //     event.preventDefault();
    //     tx_dlf_viewer.map.rotate(-90);
    // });

}

/**
 * Matomo
 * returns the value of the paramter page of links
 *
 * @param selector string
 * @returns string
 */
function getTargetPage(selector){
    let queryString = $(selector).attr('href');
    let urlParams = new URLSearchParams(queryString);
    let pageValue = urlParams.get('tx_dlf[page]')

    return pageValue;
}

/**
 * Matomo
 * set content pice atributes for links
 */
function setContentPiece(){
    //buttons for prev and nex
    var pageNext = getTargetPage(".tx-dlf-navigation-next a");
    $(".tx-dlf-navigation-next a").attr("data-content-piece", pageNext);

    var pagePrev = getTargetPage(".tx-dlf-navigation-prev a");
    $(".tx-dlf-navigation-prev a").attr("data-content-piece", pagePrev);

    //toc
    let entries = $(".tx-dlf-toc .dropdown-menu li a");

    entries.each(function(index) {
        let queryString = $( this ).attr('href');
        let urlParams = new URLSearchParams(queryString);
        let pageValue = urlParams.get('tx_dlf[page]');

        $( this ).attr("data-content-piece", pageValue);
    });
}

/**
 * Matomo
 *
 * @returns {undefined}
 */
function setContentTracking(){
    //_paq.push(['trackEvent', 'COUNTER5', 'Total_Item_Requests', 'Download PDF', PPN]);

    //set area for tracking
    document.querySelector('#detail-view').setAttribute('data-track-content', '');

    //set object: kitodo in area for tracking
    var PPN = $('#purl a').text();
    document.querySelector('#detail-view').setAttribute('data-content-name', 'kitodo-view-'+PPN);

    //set content pieces
    setContentPiece();

    //drop down
    $(".tx-dlf-navigation-pageselect form").submit(function() {
        _paq.push(['trackContentInteraction', 'click', 'kitodo-view', $(".tx-dlf-navigation-pageselect select").val(), 1]);
    });

}

/**
 * Matomo
 * Set Total_Item_Request, if refferer is not detail view of the same document
 * If you vie 1st time detail view, document ist opn. Paging --> document still open. If you leave and came back, new open.
 * Every opening is a Total_Item_Request
 *
 * @returns null
 */
function setTotalItemRequests(){
    var url = document.referrer;

    if (url.indexOf("?")>-1){
        url = url.substr(0,url.indexOf("?"));
    }

    //refferer is detail view?
    if((location.origin + location.pathname) == url){

        //check same parameter
        let urlParams = new URLSearchParams(document.referrer);
        let referrerValue = urlParams.get('tx_dlf[id]');

        urlParams = new URLSearchParams(document.URL);
        let documentValue = urlParams.get('tx_dlf[id]');

        //if document id has the same  value, the document is still "open"
        if(documentValue != referrerValue){
            _paq.push(['trackEvent', 'COUNTER5', 'Total_Item_Requests', 'View']);
        }

    }else{
        //the document is opened
        _paq.push(['trackEvent', 'COUNTER5', 'Total_Item_Requests', 'View']);
    }
}


document.addEventListener("DOMContentLoaded", function(event) {
    //matomo tracking
    if( ($('.tx-dlf-pageview').length > 0) ){ //detail
        setContentTracking();
    }

});

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

        $("div.issues div.dayLinkList").each(function () {
            var interactiveElement = $(this).closest('div.issues');
            if ($(this).children('a').length > 1) {
                interactiveElement.on('click', function (event) {
                    $("div.issues div.openSelectBox").hide();

                    $(this).children("div").addClass('openSelectBox');
                    $(this).children("div").show();
                });
            } else if ($(this).children('a').length == 1) {
                // dont show select box
                // set direct link instead
                interactiveElement.on('click', function (event) {
                    window.location.href = $(this).find('a').attr('href');
                });
            }
        });

    } else {

        $("div.issues div.dayLinkList").each(function () {
            var interactiveElement = $(this).closest('div.issues');
            if ($(this).children('a').length > 1) {
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
            } else if ($(this).children('a').length == 1) {
                // dont show select box
                // set direct link instead
                interactiveElement.on('click', function (event) {
                    window.location.href = $(this).find('a').attr('href');
                });
            }
        });

    }
}

function hoverTimeoutCheck() {
    $("div.issues div.openSelectBox").hide();
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

function calendarSwitchViews() {
    // ,calendar-items // .list-view
    // .select-calendar-view // .select-list-view active
    // .calendar-list-selection
    $('.list-view').hide();
    $('.calendar-list-selection .select-calendar-view').on('click', function (evt) {
        $('.calendar-items').show();
        $('.list-view').hide();
    });

    $('.calendar-list-selection .select-list-view').on('click', function (evt) {
        $('.list-view').show();
        $('.calendar-items').hide();
    });

}

function listviewNewspaperRouting() {
    // $('dd.tx-dlf-type').each(function () {
    //     if ($(this).text().trim() == 'Jahr') {
    //         var url = $($(this).siblings('dd.tx-dlf-title')[0]).children().prop('href').replace('recherche-zeitungen/detail-zeitungen', 'kalender-zeitungen');
    //         $(this).siblings('dd.tx-dlf-title').children().prop('href', url);
    //     }
    // });
}

function fulltextPositionAdjustment() {

    var initPos = 300;
    if (Cookies.get('kitodo-fullscreen') == 1) {
        initPos = 120;
    }

    var newTopPosition = initPos + $('div.tx-dlf-metadata .detail-view-itemdetails').height();
    if ($('div.tx-dlf-tableofcontents').length == 1) {
        newTopPosition = newTopPosition + $('div.tx-dlf-tableofcontents').height();
    }
    $('#tx-dlf-fulltextselection').attr('style', 'top:' + newTopPosition + 'px');

}

function fullscreenNavigationPositioning() {
    // reposition fullscreen page navigation
    if (window.outerHeight < 821) {
        if ($('#main-content dd.tx-dlf-metadata-title')[0]) {
            var titleHeight = $('#main-content dd.tx-dlf-metadata-title')[0].offsetHeight;
            // $('aside section').css('top', (titleHeight+15) + 'px');

        }
    }
}

function clickEventMetadataToc() {
    $('.tx-dlf-metadata .dropdown-menu label, .tx-dlf-toc .dropdown-menu label').on('click', function () {
        setTimeout(function() {
            fulltextPositionAdjustment();
        }, 200);
    });
}

// mk 2022-11-07 # transform ISO formatted date to locale date string
function transformDateFormat() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $('dd.tx-dlf-metadata-date').each(function() {
        var rawDate = $(this).text().trim();
        var dateString = new Date(rawDate).toLocaleDateString(undefined, options);
        $(this).text(dateString);
    });
}
