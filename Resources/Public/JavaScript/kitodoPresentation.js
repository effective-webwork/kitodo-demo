$(document).ready(function() {
    // mk 2023-09-20 # tidying up the facets
    // - remove textparts for lexicographical sorting in facets
    // - removes "Ausgabentitel" if "n.a." from metadata
    cleanup()
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

    //addThumbnailPlaceholder();

    // workaround
    fixLabelInputMetadata();

    showDeletionButton();

    searchInDocumentResetIcon();

    renameMetadataTab();

    calendarSelectBox();

    calendarSwitchViews();

    replaceRssFeedImage();

    listviewNewspaperRouting();

    pagegrid = 0;

    pageGridClickEvent();
    fulltextClickEvent();

    // mk 2023-09-05 # add download buttons in pageview
    addDownloadButtons();
});

function initOverlays() {
    if (document.getElementById("myNav") || document.getElementById("myNav2")) {
        if (Cookies.get('overlay1')) {
            openNav();
        }
        if (Cookies.get('overlay2')) {
            openNav2();
        }
        if (Cookies.get('overlay3') || dlfUtils.getCookie("tx-dlf-pageview-fulltext-select") === 'enabled') {
            if($('.no-fulltext').length > 0) {
                closeNav3();
            } else {
                openNav3();
            }
        }
        if (Cookies.get('overlay4')) {
            openNav4();
        }
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

// mk 2023-02-02 # create additional download buttons
function addDownloadButtons() {
    // declare path to folder for icons
    icon_folder = '/typo3conf/ext/presentation_package/Resources/Public/Images/download_icons/';

    // our anchor for button placement
    anchor = 'ul.download-anchor';

    // grab the record id
    record_id = $('dd.tx-dlf-metadata-record_id').text();
    pagenumber = 0;

    // make sure, that we have pagenumbers for objects with actual pages
    var structtype = $('dd.tx-dlf-type').text();
    if( structtype === 'Zeitschrift' ||
        structtype === 'Mehrbändiges Werk' ||
        structtype === 'Mehrteilige Graphik' ||
        structtype === 'Mehrteilige Handschrift' ||
        structtype === 'Mehrteiliges Kartenwerk' ||
        structtype === 'Zeitung' ||
        structtype === 'Jahr'
    ) {
        // show downloads even on toplevel
        $('.tx-dlf-toolbox').show();
    } else {
        // coming from the resultset may result in missing tx_dlf[page], so make it "1" instead of running into "undefined"
        pagenumber = "1";

        let searchParams = new URLSearchParams(window.location.search);
        if(searchParams.has('tx_dlf[page]'))
        {
            pagenumber = searchParams.get('tx_dlf[page]');
        }
    }

    // create data structure for download buttons
    var downloads = {
        fullLinkDownload:   {id:"fullLinkDownload", title:"Persistente URL zum Objekt teilen",                          icon:"filetype-share-fill-full.svg",    class:"reachable", event:"Zitierlink"},
        pageLinkDownload:   {id:"pageLinkDownload", title:"Persistente URL zur Einzelseite teilen",                     icon:"filetype-share-fill.svg",         class:"reachable", event:"Zitierlink (Einzelseite)"},
        iiifDownload:       {id:"iiifDownload",     title:"IIIF-Manifest für Objekt herunterladen",                     icon:"filetype-iiif.svg",               class:"reachable", event:"Download IIIF-Manifest"},
        metsDownload:       {id:"metsDownload",     title:"METS/MODS für Objekt herunterladen",                         icon:"filetype-mets.svg",               class:"reachable", event:"Download METS/MODS"},
        fullPDFDownload:    {id:"fullPDFDownload",  title:"Gesamtes Objekt als PDF herunterladen",                      icon:"filetype-pdf-full.svg",           class:"reachable", event:"Download PDF"},
        pagePDFDownload:    {id:"pagePDFDownload",  title:"Aktuelle Einzelseite als PDF herunterladen",                 icon:"filetype-pdf.svg",                class:"reachable", event:"Download PDF (Einzelseiten)"},
        pageJPEGDownload:   {id:"pageJPEGDownload", title:"Aktuelle Seite als JPEG herunterladen",                      icon:"filetype-jpeg.svg",               class:"reachable", event:"Download JPEG (Einzelseite)"},
        pageALTODownload:   {id:"pageALTODownload", title:"Volltext der aktuellen Seite als ALTO-XML herunterladen",    icon:"filetype-alto.svg",               class:"reachable", event:"Download ALTO-XML (Einzelseite)"},
        pageTXTDownload:    {id:"pageTXTDownload",  title:"Volltext der aktuellen Seite als TXT herunterladen",         icon:"filetype-txt.svg",                class:"reachable", event:"Download TXT (Einzelseite)"},
        DFGViewer:          {id:"DFGViewer",        title:"Zur Ansicht in den DFG-Viewer wechseln",                     icon:"dfgviewerLogo.svg",               class:"reachable", event:"Aufruf DFG-Viewer"},
    }

    // per document URLs
    downloads['fullPDFDownload'].link = 'https://img.sub.uni-hamburg.de/kitodo/' + record_id + '/PDF/' + record_id + '.pdf';        // https://img.sub.uni-hamburg.de/kitodo/PPN175933782X/PDF/PPN175933782X.pdf
    downloads['fullLinkDownload'].link = 'https://resolver.sub.uni-hamburg.de/kitodo/' + record_id;                                 // https://resolver.sub.uni-hamburg.de/kitodo/PPN175933782X
    downloads['iiifDownload'].link = 'https://iiif.sub.uni-hamburg.de/object/' + record_id + '/manifest';                           // https://iiif.sub.uni-hamburg.de/object/PPN175933782X/manifest
    downloads['metsDownload'].link = 'https://mets.sub.uni-hamburg.de/kitodo/' + record_id;                                         // https://mets.sub.uni-hamburg.de/kitodo/PPN175933782X

    // DFG Viewer URL
    downloads['DFGViewer'].link = 'https://dfg-viewer.de/show/?tx_dlf[id]=https://mets.sub.uni-hamburg.de/kitodo/' + record_id;     // https://dfg-viewer.de/show/?tx_dlf[id]=https://mets.sub.uni-hamburg.de/kitodo/PPN175933782X

    // per page URLs
    if(pagenumber > 0) {

        // use pagenumber as is here
        downloads['pageLinkDownload'].link = 'https://resolver.sub.uni-hamburg.de/kitodo/' + record_id + '/page/' + pagenumber;     // https://resolver.sub.uni-hamburg.de/kitodo/PPN175933782X/page/9

        // and update DFG-Viewer link if actual page navigation was in place
        downloads['DFGViewer'].link = 'https://dfg-viewer.de/show/?tx_dlf[id]=https://mets.sub.uni-hamburg.de/kitodo/' + record_id + '&tx_dlf[page]=' + pagenumber;     // https://dfg-viewer.de/show/?tx_dlf[id]=https://mets.sub.uni-hamburg.de/kitodo/PPN175933782X&tx_dlf[page]=9

        // change pagenumber to one with leading zeros now
        pagenumber = pagenumber.padStart(8, '0');

        downloads['pagePDFDownload'].link = 'https://img.sub.uni-hamburg.de/kitodo/' + record_id + '/PDF/' + pagenumber + '.pdf';   // https://img.sub.uni-hamburg.de/kitodo/PPN175933782X/PDF/00000009.pdf
        downloads['pageJPEGDownload'].link = 'https://pic.sub.uni-hamburg.de/kitodo/' + record_id + '/' + pagenumber + '.tif';      // https://pic.sub.uni-hamburg.de/kitodo/PPN175933782X/00000009.tif
        downloads['pageALTODownload'].link = 'https://img.sub.uni-hamburg.de/kitodo/' + record_id + '/' + pagenumber + '.xml';      // https://img.sub.uni-hamburg.de/kitodo/PPN175933782X/00000009.xml
        downloads['pageTXTDownload'].link = 'https://img.sub.uni-hamburg.de/kitodo/' + record_id + '/' + pagenumber + '.txt';       // https://img.sub.uni-hamburg.de/kitodo/PPN175933782X/00000009.txt

    }



    // decide whether a buttons target is reachable
    if(pagenumber == 0) {
        downloads['fullPDFDownload'].class = "unreachable";
        downloads['pageLinkDownload'].class = "unreachable";
        downloads['pagePDFDownload'].class = "unreachable";
        downloads['pageJPEGDownload'].class = "unreachable";
    }

    if($('dd.tx-dlf-metadata-fulltext_flag').text() != "FULLTEXT") {
        downloads['pageALTODownload'].class = "unreachable";
        downloads['pageTXTDownload'].class = "unreachable";
    }

    // populate buttons
    for (const key in downloads) {
        if(downloads[key].class == "reachable") {
            if (key === 'DFGViewer') {
                $('#dfgviewerLink').attr('href', downloads[key].link);
            } else {
                $(anchor).append('\
                <li>\
                    <a href="' + downloads[key].link + '" id="' + downloads[key].id + '" class="' + downloads[key].class + '" title="' + downloads[key].title + '" download>\
                        <img src="' + icon_folder + downloads[key].icon + '">\
                    </a>\
                </li>');
            }
            addMatomoDownloadEventListener(downloads[key].id, downloads[key].link, downloads[key].event);
        }
        else {
            $(anchor).append('\
            <li>\
                <span id="' + downloads[key].id + '" class="' + downloads[key].class + '" title="' + downloads[key].title + '">\
                    <img src="' + icon_folder + downloads[key].icon + '">\
                </span>\
            </li>');
        }
    }

    //$('span.tx-dlf-tools-fulltext').parent().prependTo('ul.tx-dlf-navigation');
}


// mk 2023-09-05 # helper function for addDownloadButtons()
// adds event listener for matomo tracking to download buttons
function addMatomoDownloadEventListener(anchor_id, event_link, event_type) {
    $('[id="' + anchor_id +  '"]').on('click', function (event) {
        event.preventDefault();

        // matomo statistic
        // total_item_requests are actual download and views
        if (
            event_type != 'Aufruf Zitierlink' &&
            event_type != 'Download IIIF-Manifest' &&
            event_type != 'Download METS/MODS' &&
            event_type != 'Aufruf Zitierlink (Einzelseite)' &&
            event_type != 'Aufruf DFG-Viewer'
        ){
            _paq.push(['trackEvent', 'COUNTER5', 'Total_Item_Requests', event_type]);
        }
        // redirects, citation-links and viewing of metadata is not part of total_item_requests
        else {
            _paq.push(['trackEvent', 'KITODO - REDIRECTS', event_type]);
        }
        _paq.push(['trackEvent', 'KITODO - TOP', record_id, event_type]);

        window.open(event_link);
    });
}

/*function addThumbnailPlaceholder() {
    $('.tx-dlf-listview-thumbnail').each(function () {
        if ($(this).children('img').length == 0) {
            $(this).append('<img class="no-hover" src="/typo3conf/ext/presentation_package/Resources/Public/Images/document-collection.png"/>');
        }
    });
}*/

function facetTouchStyle() {
    if ($('label.facet-sub-title')) {
        $('label.facet-sub-title').each(function(i) {
            $(this).attr('for', 'checkbox-menu'+i).parent().prepend('<input type="checkbox" id="checkbox-menu'+i+'">');
        });
    }
}

// general cleanup functions on unwanted or ugly elements
function cleanup() {

    // add backtolistview anchor for breadcrumbs
    $('.active.sub').each(function() {
        if($(this).text() == "Recherche") {
            $(this).text('Trefferliste');
            $(this).attr("id","backtolistview");
        }
    });

    // link back to calendar for the current year in breadcrumbs
    $('.active.sub').each(function() {
        
        if($(this).text() == "Kalender") {
            calendar_link = $('.tx-dlf-metadata-partof a').attr('href');
            if (calendar_link) {
                $(this).attr("href", calendar_link);
            }
        }
    });

    // replace copyright link in facet with name
    $('span.tx-dlf-facet-value-title').each(function () {
        // public domain
        if( $(this).text() == 'https://creativecommons.org/publicdomain/mark/1.0/' || 
            $(this).text() == 'http://creativecommons.org/publicdomain/mark/1.0/'
            ) {
            $(this).text('Public Domain Mark 1.0');
        }

        // in copyright
        if( $(this).text() == 'http://rightsstatements.org/vocab/InC/1.0/' ) {
            $(this).text('Urheberrechtsschutz 1.0');
        }

        // copyright not evaluated
        if( $(this).text() == 'https://rightsstatements.org/page/CNE/1.0/' || 
            $(this).text() == 'https://rightsstatements.org/page/CNE/1.0/?language' ||
            $(this).text() == 'https://rightsstatements.org/page/CNE/1.0/?language%3Dde'
            ) {
            $(this).text('Urheberrechtsschutz nicht bewertet');
        }
    });

    // replace copyright url in listview metadata with actual link and proper text
    $('dd.tx-dlf-metadata-license').each(function () {
        var license_link = $(this).text().trim();
        // public domain
        if( license_link == 'https://creativecommons.org/publicdomain/mark/1.0/' || 
            license_link == 'http://creativecommons.org/publicdomain/mark/1.0/'
            ) {
            $(this).text('');
            $(this).append('<a href="' + license_link + '">Public Domain Mark 1.0</a>');
        }

        // in copyright
        if( license_link == 'http://rightsstatements.org/vocab/InC/1.0/' ) {
            $(this).text('');
            $(this).append('<a href="' + license_link + '">Urheberrechtsschutz 1.0</a>');
        }

        // copyright not evaluated
        if( license_link == 'https://rightsstatements.org/page/CNE/1.0/' || 
            license_link == 'https://rightsstatements.org/page/CNE/1.0/?language' ||
            license_link == 'https://rightsstatements.org/page/CNE/1.0/?language%3Dde'
            ) {
            $(this).text('');
            $(this).append('<a href="' + license_link + '">Urheberrechtsschutz nicht bewertet</a>');
        }
    });

    // replace url to context info in listview metadata with actual link
    if (window.location.hostname == 'zeitungen.sub.uni-hamburg.de') {
        $('dd.tx-dlf-metadata-abstract_url').each(function () {
            var context_link = $(this).text().trim();
            $(this).text('');
            $(this).append('<a href="' + context_link + '">Kontextinformationen aufrufen</a>');
        });
    }

    // removes textpart from facet, that is required for lexicographical sorting of months/days of the week/calendar days in newspaper portal
    $('span.tx-dlf-facet-value-title').each(function () {
        facet_value = $(this).text();

        if (facet_value.match(/\[(\d+)\] \- /)) {
            facet_value = facet_value.replace(/\[(\d+)\] \- /, ' ');
            $(this).html(facet_value);
        }

    });

    // removes "Ausgabentitel" if "n.a." from metadata in listview and metadata-plugin
    $('dd.tx-dlf-metadata-title_issue').each(function () {
        if($(this).text().trim() == "n.a.") {
            $(this).prev().attr('style','display:none !important');
            $(this).attr('style','display:none !important');
        }
    });

    // removes repeating hr dividers from metadata in metadata-plugin
    $( "hr.tx-dlf-metadata-hr" ).each(function( index ) {
        if ($(this).next("hr.tx-dlf-metadata-hr").length) {
            $(this).remove();
        }
    });

    // sort metadata in listview
    if (window.location.hostname == 'zeitungen-dev.sub.uni-hamburg.de' || window.location.hostname == 'zeitungen.sub.uni-hamburg.de') {
        $('div.subhh-listview-metadata dl, li.pageresult dl').each(function () {
            // date
            $(this).append($(this).children('.tx-dlf-metadata-date_calendar'));
            $(this).children('dd.tx-dlf-metadata-date_calendar').after('<hr class="tx-dlf-metadata-hr">');
            // bibliographic description
            $(this).append($(this).children('.tx-dlf-title'));
            $(this).append($(this).children('.tx-dlf-metadata-sub_title'));
            $(this).append($(this).children('.tx-dlf-metadata-title_issue'));
            $(this).append($(this).children('.tx-dlf-metadata-volume_year'));
            $(this).append($(this).children('.tx-dlf-metadata-volume_issue'));
            $(this).append($(this).children('.tx-dlf-metadata-place'));
            $(this).append($(this).children('.tx-dlf-metadata-publisher'));
            $(this).append($(this).children('.tx-dlf-metadata-publication_run_digital'));
            $(this).append($(this).children('.tx-dlf-metadata-abstract'));
            $(this).append($(this).children('.tx-dlf-metadata-abstract_url'));
            // license
            $(this).append($(this).children('.tx-dlf-metadata-license'));
            $(this).children('dt.tx-dlf-metadata-license').before('<hr class="tx-dlf-metadata-hr">');
            // dataset
            $(this).append($(this).children('.tx-dlf-metadata-record_id'));
            $(this).children('dt.tx-dlf-metadata-record_id').before('<hr class="tx-dlf-metadata-hr">');
            $(this).append($(this).children('.tx-dlf-type'));
        });
    }

    if (window.location.hostname == 'digitalisate-dev.sub.uni-hamburg.de' || window.location.hostname == 'digitalisate.sub.uni-hamburg.de') {
        $('div.subhh-listview-metadata dl, li.pageresult dl').each(function () {
            // shelfmark
            $(this).append($(this).children('.tx-dlf-metadata-shelfmark'));
            $(this).children('dd.tx-dlf-metadata-shelfmark').after('<hr class="tx-dlf-metadata-hr">');
            // bibliographic description
            $(this).append($(this).children('.tx-dlf-title'));
            $(this).append($(this).children('.tx-dlf-metadata-author'));
            $(this).append($(this).children('.tx-dlf-metadata-recipient'));
            $(this).append($(this).children('.tx-dlf-metadata-name_scribe'));
            $(this).append($(this).children('.tx-dlf-metadata-place_of_publication'));
            $(this).append($(this).children('.tx-dlf-metadata-year_of_publication'));
            $(this).append($(this).children('.tx-dlf-metadata-place_of_production'));
            $(this).append($(this).children('.tx-dlf-metadata-year_of_production'));
            $(this).append($(this).children('.tx-dlf-metadata-production_year'));
            $(this).append($(this).children('.tx-dlf-metadata-date_other_related'));
            $(this).append($(this).children('.tx-dlf-metadata-publisher'));
            $(this).append($(this).children('.tx-dlf-metadata-language'));
            $(this).append($(this).children('.tx-dlf-metadata-name_collector'));
            $(this).append($(this).children('.tx-dlf-metadata-name_artist'));
            $(this).append($(this).children('.tx-dlf-metadata-name_photographer'));
            $(this).append($(this).children('.tx-dlf-metadata-name_depicted_person'));
            $(this).append($(this).children('.tx-dlf-metadata-name_editor'));
            $(this).append($(this).children('.tx-dlf-metadata-name_translator'));
            $(this).append($(this).children('.tx-dlf-metadata-name_corporation'));
            $(this).append($(this).children('.tx-dlf-metadata-catalog_kalliope'));
            $(this).append($(this).children('.tx-dlf-metadata-volume'));
            // license
            $(this).append($(this).children('.tx-dlf-metadata-license'));
            $(this).children('dt.tx-dlf-metadata-license').before('<hr class="tx-dlf-metadata-hr">');
            // dataset
            $(this).append($(this).children('.tx-dlf-metadata-record_id'));
            $(this).children('dt.tx-dlf-metadata-record_id').before('<hr class="tx-dlf-metadata-hr">');
            $(this).append($(this).children('.tx-dlf-type'));
        });
    }

    if (window.location.hostname == 'jungius-dev.sub.uni-hamburg.de' || window.location.hostname == 'jungius.sub.uni-hamburg.de') {
        $('div.subhh-listview-metadata dl, li.pageresult dl').each(function () {
            // shelfmark
            $(this).append($(this).children('.tx-dlf-metadata-shelflocator'));
            $(this).children('dd.tx-dlf-metadata-shelflocator').after('<hr class="tx-dlf-metadata-hr">');
            // bibliographic description
            $(this).append($(this).children('.tx-dlf-title'));
            $(this).append($(this).children('.tx-dlf-metadata-title_alternative'));
            $(this).append($(this).children('.tx-dlf-metadata-author'));
            $(this).append($(this).children('.tx-dlf-metadata-name_recepient'));
            $(this).append($(this).children('.tx-dlf-metadata-year'));
            $(this).append($(this).children('.tx-dlf-metadata-language'));
            $(this).append($(this).children('.tx-dlf-metadata-subjecttopic'));
            $(this).append($(this).children('.tx-dlf-metadata-subjectnamepersons'));
            // dataset
            $(this).append($(this).children('.tx-dlf-metadata-record_id'));
            $(this).children('dt.tx-dlf-metadata-record_id').before('<hr class="tx-dlf-metadata-hr">');
            $(this).append($(this).children('.tx-dlf-type'));
        });
    }

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
        documentType == "Mehrteilige Handschrift" || documentType == "Mehrteilige Graphik" || documentType == "Mehrteiliges Kartenwerk") {
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
    if ($('dd.tx-dlf-metadata-volume_list').length > 0) {
        $('article.breadcrumb ul .active.current').before('<li class="active sub"><a href="' + $('dd.tx-dlf-metadata-volume_list a').attr('href') + '" class="active sub">Bandliste</a>&nbsp;</li>&nbsp;');
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

// mk 2022-11-07 # transform ISO formatted date to locale date string
function transformDateFormat() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $('dd.tx-dlf-metadata-date').each(function() {
        var rawDate = $(this).text().trim();
        var dateString = new Date(rawDate).toLocaleDateString(undefined, options);
        $(this).text(dateString);
    });
}
