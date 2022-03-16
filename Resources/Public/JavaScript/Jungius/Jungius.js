$(document).ready(function() {
    $.ajaxSetup({ cache: false });

    var detailPageName      = 'nc/detailseite.html',
        detailPageName2     = 'detailseite.html',
        detailPageId        = 41,
        detailFullscreenId  = 51;

    //set title filter placeholder
    $('.tx-dlf-search-query-0').attr('placeholder', 'Nach welchem Titel suchen Sie?');

    // set portlet on click
    $('.jungius-filter-title').on('click', function() {
        $('.jungius-filter-title-content').toggle(1000);
    });
    $('.jungius-filter-topic').on('click', function() {
        $('.jungius-filter-topic-content').toggle(1000);
    });
    $('.jungius-filter-signature').on('click', function() {
        $('.jungius-filter-signature-content').toggle(1000);
    });
    $('.jungius-filter-type').on('click', function() {
        $('.jungius-filter-type-content').toggle(1000);
    });
    $('.jungius-filter-person').on('click', function() {
        $('.jungius-filter-person-content').toggle(1000);
    });
    $('.jungius-filter-lang').on('click', function() {
        $('.jungius-filter-lang-content').toggle(1000);
    });
    $('.jungius-filter-year').on('click', function() {
        $('.jungius-filter-year-content').toggle(1000);
    });

    // set portlet content
    setFacets();

    // createPersonIndex();

    setFacetClick();

    // getFilter();

    // jungius detail tooltip
    $('.portlet_tooltip span').tooltip({
        position: {
            my: "center bottom-20",
            at: "center top",
            using: function( position, feedback ) {
                $( this ).css( position );
                $( "<div>" )
                    .addClass( "arrow" )
                    .addClass( feedback.vertical )
                    .addClass( feedback.horizontal )
                    .appendTo( this );
            }
        }
    });

    // title search
    $('.jungius-filter-title-content input.tx-dlf-search-query-0').on('change', function() {
        // save title in cookie
        Cookie.set('title', $(this).val());
        getRequest(1);
        setTimeout(function(){
            location.reload(true);
        }, 2000);
    });

    $('.jungius-filter-title-content input.tx-dlf-search-query-0').on('keyup', function(e) {
        // save title in cookie
        if (e.which === 13) {
            Cookie.set('title', $(this).val());
            getRequest(1);
            setTimeout(function(){
                location.reload(true);
            }, 2000);
            e.preventDefault();
        }

    });

    if ($(".tx-dlf-navigation-pageselect [id^=Navigation-] option").length > 0) {
        //var pageCount = $(".tx-dlf-navigation-pageselect [id^=Navigation-] option").length;
        var currentPage = $(".tx-dlf-navigation-pageselect [id^=Navigation-] option[selected^=selected]").val();

        // toggle fullscreen
        var id = getUrlParameter('tx_dlf[id]');
        if (window.location.pathname.substring(1) == detailPageName || window.location.pathname.substring(1) == detailPageName2 ||
            (window.location.pathname.substring(1) == "index.php" && parseInt(getUrlParameter('id')) === detailPageId)) {
            $("#jungius_view a").attr("href", '/index.php?id=' + detailFullscreenId + '&tx_dlf%5Bid%5D=' + id + '&tx_dlf%5Bpage%5D='+currentPage+'&tx_dlf%5Bpointer%5D=3&tx_dlf%5Bdouble%5D=0');
        } else {
            $("#jungius_view a").attr("href", '/index.php?id=' + detailPageId + '&tx_dlf%5Bid%5D=' + id + '&tx_dlf%5Bpage%5D='+currentPage+'&tx_dlf%5Bpointer%5D=3&tx_dlf%5Bdouble%5D=0');
        }
    }

    // active facet styling
    $(".active-facets a").each(function () {
        var facetText = $(this).text().replace("Auswahl entfernen (", "");
        facetText = facetText.replace(")", "");
        if (facetText.length <= 3) {
            facetText = translateLanguage(facetText, true);
        }
        var closeImage = '<img src="http://jungius.sub.uni-hamburg.de/fileadmin/templates/jungius_template/img/icon_clear.png">' + facetText;
        $(this).html(closeImage);
    });

    // ie only
    ieFacetClick();
    ieFacetSync();

});

function setFacetClick() {
    $('[class^=jungius-filter-] li a, .active-facets a').on('click', function(event) {
        if ($(this)[0].id != "titleSearchFacet") {
            // save new facet value
            var searchQuery = $(this)[0].search;
            searchQuery = searchQuery.replace(/id=([0-9]+)/g, '');
            Cookie.set('fq', encodeURIComponent(searchQuery));
        }
    });

}


function autoCompleteSignature() {
    var signatureArray = [],
        signatureItem = [];
    $(".jungius-filter-signature-content [class^=tx-dlf-search-] a").each(function() {
        // replace number in brackets
        regEx = /\(\d\)/;

        var object = {
            label:$(this).text().replace(regEx, ''),
            value:$(this).attr('href'),
            search:$(this)[0].search
        };
        signatureArray.push(object);
    });

    $( "#search_signature" ).autocomplete({
        minLength: 3,
        source: signatureArray,
        //appendTo: '#live_search_signature',
        open: function (event, ui) {
            $( "#live_search_signature" ).show();
        },
        close: function (event, ui) {
            $( "#live_search_signature" ).hide();
        },
        focus: function( event, ui ) {
            $( "#search_signature" ).val( ui.item.label );
            return false;
        },
        select: function( event, ui ) {
            $( "#search_signature" ).val( ui.item.label );
            $( "#live_search_signature" ).html( ui.item.label );
            // send filter request
            // setFilter(ui.item.value);
            var newUrl = location.href + ui.item.search;
            //newUrl = newUrl.replace(/id=([0-9]+)/g, '');
            Cookie.set('fq', encodeURIComponent(newUrl));
            getRequest(1);
            setTimeout(function(){
                location.reload(true);
            }, 2000);

            return false;
        }
    }).autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<a>" + item.label + "</a>" )
            .appendTo( ul );
    };

    // $( "#search_signature_mobile" ).autocomplete({
    //     minLength: 3,
    //     source: signatureArray,
    //     open: function (event, ui) {
    //         $( "#live_search_signature" ).show();
    //     },
    //     close: function (event, ui) {
    //         $( "#live_search_signature" ).hide();
    //     },
    //     focus: function( event, ui ) {
    //         $( "#search_signature" ).val( ui.item.label );
    //         return false;
    //     },
    //     select: function( event, ui ) {
    //         $( "#search_signature" ).val( ui.item.label );
    //         $( "#live_search_signature" ).html( ui.item.label );
    //         // send filter request
    //         // setFilter(ui.item.value);
    //         var newUrl = location.href + ui.item.search;
    //         newUrl = newUrl.replace(/id=([0-9]+)/g, '');
    //         Cookie.set('fq', encodeURIComponent(newUrl));
    //         getRequest(1);
    //         setTimeout(function(){
    //             location.reload(true);
    //         }, 2000);
    //
    //         return false;
    //     }
    // }).autocomplete( "instance" )._renderItem = function( ul, item ) {
    //     return $( "<li>" )
    //         .append( "<a>" + item.label + "</a>" )
    //         .appendTo( ul );
    // };
}

function ieFacetClick() {
    var ieVersion = getInternetExplorerVersion();
    if (ieVersion != -1) {
        // set click handler for all facets
        $('span[class*="jungius-filter-"] li a').on('click', function () {
            Cookie.set('ieFacetClick', 1);
        });

        // set click handler for active facets
        $('.active-facets a').on('click', function () {
            Cookie.set('ieFacetClick', 1);
        })
    }
}

/**
 * ie facet sync
 */
function ieFacetSync() {
    var ieVersion = getInternetExplorerVersion();
    if (ieVersion != -1) {
        if (Cookie.get('ieFacetClick') == 1) {
            Cookie.set('ieFacetClick', 0);
            // setTimeout(function () {
            location.reload(true);
            // }, 1000);
        }

    }
}

/**
 * ie detection
 * @returns {number}
 */
function getInternetExplorerVersion()
{
    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
    }
    else if (navigator.appName == 'Netscape')
    {
        var ua = navigator.userAgent;
        var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
    }
    return rv;
}


function setFacets() {
    if (typeof Cookie != "undefined") {
        var titleSearch = Cookie.get('title');
        if(titleSearch) {
            $('.active-facets').append('<a id="titleSearchFacet">'+Cookie.get('title')+'</a>');
            $('.active-facets #titleSearchFacet').on('click', function() {
                Cookie.set('title', '');
                getRequest(1);
                setTimeout(function(){
                    location.reload(true);
                }, 2000);
            });
        }
    }

    $('.tx-dlf-search-facets .tx-dlf-search-cur').each(function() {
        $('.active-facets').append($(this).html());
    });

    $(".jungius-filter-type-content ul").addClass("scrollList");
    $(".jungius-filter-topic-content ul").addClass('scrollList');
    $(".jungius-filter-lang-content ul").addClass("scrollList");
    $(".jungius-filter-year-content ul").addClass("scrollList");
    $(".jungius-filter-structure-content ul").addClass("scrollList");


    $('.tx-dlf-search-facets .tx-dlf-search-no').each(function() {
        // search for the facette content and save them for later use
        var html = '';
        var isFound = $(this).html().search(/Sprache/i);
        if(isFound === 0){
            html = this.innerHTML;
            html = html.replace("Sprache", "");
            html = translateLanguage(html, false);

            $(".jungius-filter-lang-content").html(html);
            if($(".jungius-filter-lang-content").text().length === 0) {
                $(".jungius-filter-lang-content").text('Keine weitere Filterung möglich');
            }

        }

        isFound = '';
        isFound = $(this).html().search(/Personen/i);
        if(isFound === 0){
            html = this.innerHTML;
            $(".jungius-filter-person-content").html(html.replace("Personen", ""));
            if($(".jungius-filter-person-content").text().length === 0) {
                $(".jungius-filter-person-content").text('Keine weitere Filterung möglich');
            }

        }

        isFound = '';
        isFound = $(this).html().search(/weitere Signaturen/i);
        if(isFound === 0){
            html = this.innerHTML;

            // prepare signature values for autocomplete
            if($(".jungius-filter-signature-content ul").length) {
                $(".jungius-filter-signature-content ul").html(html.replace("weitere Signaturen", ""));
                $(".jungius-filter-signature-content ul").css("style", "display:none");
            } else {
                $(".jungius-filter-signature-content").append(html.replace("weitere Signaturen", ""));
                $(".jungius-filter-signature-content ul").css("style", "display:none");
            }

        }

        isFound = '';
        isFound = $(this).html().search(/Strukturtyp/i);
        if(isFound === 0){
            html = this.innerHTML;
            html = html.replace("Abschnitt", "Manipel");

            $(".jungius-filter-type-content").html(html.replace("Strukturtyp", ""));


            $(".jungius-filter-type-content .tx-dlf-search-no").each(function() {
                // Do not show the following elements
                if($(this).text().match(/Bundle/) || $(this).text().match(/Folder/)) {
                    $(this).hide();
                }
            });
        }



        isFound = '';
        isFound = $(this).html().search(/Thema/i);
        if(isFound === 0){
            html = this.innerHTML;
            // tree view
            html = html.replace("Thema", "");
            html = setTreeStructure(html);
            $(".jungius-filter-topic-content").html(html);
            if($(".jungius-filter-topic-content").text().length === 0) {
                $(".jungius-filter-topic-content").text('Keine weitere Filterung möglich');
            }

        }

        //isFound = '';
        //isFound = $(this).html().search(/Sammlung/i);
        //if(isFound === 0){
        //html = this.innerHTML;
        //$(".jungius-filter-topic-content").html(html.replace("Thema", ""));

        //}

        isFound = '';
        isFound = $(this).html().search(/Erscheinungsjahr/i);
        if(isFound === 0){
            html = this.innerHTML;
            $(".jungius-filter-year-content").html(html.replace("Erscheinungsjahr", ""));
            if($(".jungius-filter-year-content").text().length === 0) {
                $(".jungius-filter-year-content").text('Keine Filterung auswählbar');
            }

        }

    });



    //
    // get all active facettes
    //
    $('.tx-dlf-search-act').each(function() {
        // search for the facette content and save them for later use
        var isFound = $(this).html().search(/Sprache/i);

        if(isFound === 0){
            html = this.innerHTML;
            html = html.replace("Sprache", "");
            html = translateLanguage(html, false);
            $(".jungius-filter-lang-content").html(html);
            if($(".jungius-filter-lang-content").text().length === 0) {
                $(".jungius-filter-lang-content").text('Keine weitere Filterung möglich');
            }
            $(this).hide();
        }

        isFound = '';
        isFound = $(this).html().search(/Personen/i);
        if(isFound === 0){
            html = this.innerHTML;
            $(".jungius-filter-person-content").html(html.replace("Personen", ""));
            if($(".jungius-filter-person-content").text().length === 0) {
                $(".jungius-filter-person-content").text('Keine weitere Filterung möglich');
            }
            $(".jungius-filter-person-content ul").addClass("scrollList");
            $(this).hide();
        }

        isFound = '';
        isFound = $(this).html().search(/Signatur/i);
        if(isFound === 0){
            html = this.innerHTML;
            $(".jungius-filter-signature-content").append(html.replace("Signatur", ""));
            $(this).hide();
        }

        isFound = '';
        isFound = $(this).html().search(/Thema/i);
        if(isFound === 0){
            html = this.innerHTML;
            $(".jungius-filter-topic-content").html(html.replace("Thema", ""));
            if($(".jungius-filter-topic-content").text().length === 0) {
                $(".jungius-filter-topic-content").text('Keine weitere Filterung möglich');
            }
            $(this).hide();
        }

        isFound = '';
        isFound = $(this).html().search(/Strukturtyp/i);
        if(isFound === 0){
            html = this.innerHTML;
            $(".jungius-filter-structure-content").html(html.replace("Strukturtyp", ""));
            if($(".jungius-filter-structure-content .tx-dlf-search-cur a").length <= 1) {
                $(".jungius-filter-structure-content").text('Keine weitere Filterung möglich');
            }
            $(this).hide();
        }

        isFound = '';
        isFound = $(this).html().search(/Erscheinungsjahr/i);
        if(isFound === 0){
            html = this.innerHTML;
            $(".jungius-filter-year-content").html(html.replace("Erscheinungsjahr", ""));
            if($(".jungius-filter-year-content").text().length === 0) {
                $(".jungius-filter-year-content").text('Keine weitere Filterung möglich');
            }
            $(this).hide();
        }


    });
}


function setTreeStructure(html) {

    var elements = $(html).children("li");
    var retour = '';


//13 Facetten
    var mathematica = [];
    mathematica.push('<p>Mathematica</p>');

    var astronomica = [];
    astronomica.push('<p>Astronomica</p>');

    var geographica= [];
    geographica.push('<p>Geographica</p>');

    var physica = [];
    physica.push('<p>Physica</p>');

    var biologica = [];
    biologica.push('<p>Biologica</p>');

    var linguistica = [];
    linguistica.push('<p>Linguistica</p>');

    var philologica = [];
    philologica.push('<p>Philologica</p>');

    var philosophica = [];
    philosophica.push('<p>Philosophica</p>');

    var philosophia = [];
    philosophia.push('<p>Philosophia</p>');

    var historica = [];
    historica.push('<p>Historica</p>');

    var theologica = [];
    theologica.push('<p>Theologica</p>');

    var politica = [];
    politica.push('<p>Politica</p>');

    var didactia = [];
    didactia.push('<p>Didactia</p>');

    var opera = [];
    opera.push('<p>Opera Jungiana</p>');



    $.each( elements, function( key, value) {

// Mathematik
        if($(value).children("a").text().search(/Mathematica.\(\d+\)/i) === 0) {
            mathematica[0] = $(value);
        }
        if($(value).children("a").text().search(/Mathematicae.Historia.\(\d+\)/i) === 0) {
            mathematica.push($(value));
        }
        if($(value).children("a").text().search(/Mathematicae.Theoria.\(\d+\)/i) === 0) {
            mathematica.push($(value));
        }
        if($(value).children("a").text().search(/Algebra.\(\d+\)/i) === 0) {
            mathematica.push($(value));
        }
        if($(value).children("a").text().search(/Arithmetica.\(\d+\)/i) === 0) {
            mathematica.push($(value));
        }
        if($(value).children("a").text().search(/Analytica.\(\d+\)/i) === 0) {
            mathematica.push($(value));
        }
        if($(value).children("a").text().search(/Geometria.\(\d+\)/i) === 0) {
            mathematica.push($(value));
        }
        if($(value).children("a").text().search(/Munitoria.\(\d+\)/i) === 0) {
            mathematica.push($(value));
        }
        if($(value).children("a").text().search(/Musica.\(\d+\)/i) === 0) {
            mathematica.push($(value));
        }

//Astronomie
        if($(value).children("a").text().search(/Astronomia.\(\d+\)/i) === 0) {
            astronomica[0] = $(value);
        }
        if($(value).children("a").text().search(/Astronomica.Generalia.\(\d+\)/i) === 0) {
            astronomica.push($(value));
        }
        if($(value).children("a").text().search(/Mechanica.Coelestis.\(\d+\)/i) === 0) {
            astronomica.push($(value));
        }
        if($(value).children("a").text().search(/Instrumenta.Astronomica.\(\d+\)/i) === 0) {
            astronomica.push($(value));
        }
        if($(value).children("a").text().search(/Planetae.\(\d+\)/i) === 0) {
            astronomica.push($(value));
        }
        if($(value).children("a").text().search(/Geographica.Mathematica.\(\d+\)/i) === 0) {
            astronomica.push($(value));
        }
        if($(value).children("a").text().search(/Navigatio.\(\d+\)/i) === 0) {
            astronomica.push($(value));
        }
        if($(value).children("a").text().search(/Ephemerides.\(\d+\)/i) === 0) {
            astronomica.push($(value));
        }
        if($(value).children("a").text().search(/Chronologia.\(\d+\)/i) === 0) {
            astronomica.push($(value));
        }

// Geografie
        if($(value).children("a").text().search(/Geographia.\(\d+\)/i) === 0) {
            geographica[0] = $(value);
        }
        if($(value).children("a").text().search(/Geographia.Generalia.\(\d+\)/i) === 0) {
            geographica.push($(value));
        }
        if($(value).children("a").text().search(/Mappae.\(\d+\)/i) === 0) {
            geographica.push($(value));
        }
        if($(value).children("a").text().search(/Geographia.Mundi.Antiqui.\(\d+\)/i) === 0) {
            geographica.push($(value));
        }
        if($(value).children("a").text().search(/Geographia.Europae.\(\d+\)/i) === 0) {
            geographica.push($(value));
        }
        if($(value).children("a").text().search(/Geographia.Africae.\(\d+\)/i) === 0) {
            geographica.push($(value));
        }
        if($(value).children("a").text().search(/Geographia.Asiae.\(\d+\)/i) === 0) {
            geographica.push($(value));
        }
        if($(value).children("a").text().search(/Geographia.Americae.\(\d+\)/i) === 0) {
            geographica.push($(value));
        }

// Physik
        if($(value).children("a").text().search(/Physica.\(\d+\)/i) === 0) {
            physica[0] = $(value);
        }
        if($(value).children("a").text().search(/Physica.\(\d+\)/i) === 0) {
            physica.push($(value));
        }
        if($(value).children("a").text().search(/Mechanica.\(\d+\)/i) === 0) {
            physica.push($(value));
        }
        if($(value).children("a").text().search(/Statica.\(\d+\)/i) === 0) {
            physica.push($(value));
        }
        if($(value).children("a").text().search(/Sonus.\(\d+\)/i) === 0) {
            physica.push($(value));
        }
        if($(value).children("a").text().search(/Optica.\(\d+\)/i) === 0) {
            physica.push($(value));
        }
        if($(value).children("a").text().search(/Chymia.\(\d+\)/i) === 0) {
            physica.push($(value));
        }
        if($(value).children("a").text().search(/Instrumenta.Chymica.\(\d+\)/i) === 0) {
            physica.push($(value));
        }
        if($(value).children("a").text().search(/Meteorologia.\(\d+\)/i) === 0) {
            physica.push($(value));
        }
        if($(value).children("a").text().search(/Mineralia.\(\d+\)/i) === 0) {
            physica.push($(value));
        }
        if($(value).children("a").text().search(/Metallurgia.\(\d+\)/i) === 0) {
            physica.push($(value));
        }

// Biologie
        if($(value).children("a").text().search(/Biologica.et.Medica.\(\d+\)/i) === 0) {
            biologica[0] = $(value);
        }
        if($(value).children("a").text().search(/Historia.Naturalis.\(\d+\)/i) === 0) {
            biologica.push($(value));
        }
        if($(value).children("a").text().search(/Botanica.\(\d+\)/i) === 0) {
            biologica.push($(value));
        }
        if($(value).children("a").text().search(/Zoologica.\(\d+\)/i) === 0) {
            biologica.push($(value));
        }
        if($(value).children("a").text().search(/Horticultura.\(\d+\)/i) === 0) {
            biologica.push($(value));
        }
        if($(value).children("a").text().search(/Medica.\(\d+\)/i) === 0) {
            biologica.push($(value));
        }
        if($(value).children("a").text().search(/Anatomica.\(\d+\)/i) === 0) {
            biologica.push($(value));
        }
        if($(value).children("a").text().search(/Praeventio.morborum.\(\d+\)/i) === 0) {
            biologica.push($(value));
        }
        if($(value).children("a").text().search(/Materia.medica.\(\d+\)/i) === 0) {
            biologica.push($(value));
        }
        if($(value).children("a").text().search(/Morbus.\(\d+\)/i) === 0) {
            biologica.push($(value));
        }
        if($(value).children("a").text().search(/Chirurgica.\(\d+\)/i) === 0) {
            biologica.push($(value));
        }
        if($(value).children("a").text().search(/Paediatria.\(\d+\)/i) === 0) {
            biologica.push($(value));
        }


// Sprache
        if($(value).children("a").text().search(/Linguistica.\(\d+\)/i) === 0) {
            linguistica[0] = $(value);
        }
        if($(value).children("a").text().search(/Linguistica.Naturalis.\(\d+\)/i) === 0) {
            linguistica.push($(value));
        }
        if($(value).children("a").text().search(/Etymologia.Germanica.\(\d+\)/i) === 0) {
            linguistica.push($(value));
        }
        if($(value).children("a").text().search(/Vocabula.Germanica.\(\d+\)/i) === 0) {
            linguistica.push($(value));
        }
        if($(value).children("a").text().search(/Linguistica.Latina.\(\d+\)/i) === 0) {
            linguistica.push($(value));
        }
        if($(value).children("a").text().search(/Etymologia.Latina.\(\d+\)/i) === 0) {
            linguistica.push($(value));
        }
        if($(value).children("a").text().search(/Vocabula.Latina.\(\d+\)/i) === 0) {
            linguistica.push($(value));
        }
        if($(value).children("a").text().search(/Linguistica.Graeca.\(\d+\)/i) === 0) {
            linguistica.push($(value));
        }
        if($(value).children("a").text().search(/Etymologia.Graeca.\(\d+\)/i) === 0) {
            linguistica.push($(value));
        }
        if($(value).children("a").text().search(/Vocabula.Graeca.\(\d+\)/i) === 0) {
            linguistica.push($(value));
        }
        if($(value).children("a").text().search(/Linguistica.Hebraica.\(\d+\)/i) === 0) {
            linguistica.push($(value));
        }



// Literatur
        if($(value).children("a").text().search(/Philologica.\(\d+\)/i) === 0) {
            philologica[0] = $(value);
        }
        if($(value).children("a").text().search(/Philologica.Generalia.\(\d+\)/i) === 0) {
            philologica.push($(value));
        }
        if($(value).children("a").text().search(/Philologia.Latina.\(\d+\)/i) === 0) {
            philologica.push($(value));
        }
        if($(value).children("a").text().search(/Rhetorica.Latina.\(\d+\)/i) === 0) {
            philologica.push($(value));
        }
        if($(value).children("a").text().search(/Epistulae.Latinae.\(\d+\)/i) === 0) {
            philologica.push($(value));
        }
        if($(value).children("a").text().search(/Satyrica.Latina.\(\d+\)/i) === 0) {
            philologica.push($(value));
        }
        if($(value).children("a").text().search(/Philologia.Graeca.\(\d+\)/i) === 0) {
            philologica.push($(value));
        }
        if($(value).children("a").text().search(/Rhetorica.Graeca.\(\d+\)/i) === 0) {
            philologica.push($(value));
        }
        if($(value).children("a").text().search(/Epistulae.Graecae.\(\d+\)/i) === 0) {
            philologica.push($(value));
        }
        if($(value).children("a").text().search(/Philologia.Hebraica.\(\d+\)/i) === 0) {
            philologica.push($(value));
        }

// Philosophie
        if($(value).children("a").text().search(/Philosophica.\(\d+\)/i) === 0) {
            philosophica[0] = $(value);
        }
        if($(value).children("a").text().search(/Metaphysica.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }
        if($(value).children("a").text().search(/Ontologia.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }
        if($(value).children("a").text().search(/Cosmologia.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }
        if($(value).children("a").text().search(/Metabasis.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }
        if($(value).children("a").text().search(/Epistemonica.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }
        if($(value).children("a").text().search(/Logica.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }
        if($(value).children("a").text().search(/Inductio.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }
        if($(value).children("a").text().search(/Deductio.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }
        if($(value).children("a").text().search(/Fallaciae.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }
        if($(value).children("a").text().search(/Syllogismi.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }
        if($(value).children("a").text().search(/Hypotheses.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }
        if($(value).children("a").text().search(/Apodictia.\(\d+\)/i) === 0) {
            philosophica.push($(value));
        }


// Historische Philosophie
        if($(value).children("a").text().search(/Philosophia.Historica.\(\d+\)/i) === 0) {
            philosophia[0] = $(value);
        }
        if($(value).children("a").text().search(/Philosophia.Historica.\(\d+\)/i) === 0) {
            philosophia.push($(value));
        }
        if($(value).children("a").text().search(/Praesocratica.\(\d+\)/i) === 0) {
            philosophia.push($(value));
        }
        if($(value).children("a").text().search(/Socratica.\(\d+\)/i) === 0) {
            philosophia.push($(value));
        }
        if($(value).children("a").text().search(/Platonica.\(\d+\)/i) === 0) {
            philosophia.push($(value));
        }
        if($(value).children("a").text().search(/Peripatetica.Antiqua.\(\d+\)/i) === 0) {
            philosophia.push($(value));
        }
        if($(value).children("a").text().search(/Sceptica.\(\d+\)/i) === 0) {
            philosophia.push($(value));
        }
        if($(value).children("a").text().search(/Epicureica.\(\d+\)/i) === 0) {
            philosophia.push($(value));
        }
        if($(value).children("a").text().search(/Stoica.\(\d+\)/i) === 0) {
            philosophia.push($(value));
        }
        if($(value).children("a").text().search(/Scholastici.\(\d+\)/i) === 0) {
            philosophia.push($(value));
        }
        if($(value).children("a").text().search(/Philosophia.moderna.\(\d+\)/i) === 0) {
            philosophia.push($(value));
        }

// Geschichte
        if($(value).children("a").text().search(/Historica.\(\d+\)/i) === 0) {
            historica[0] = $(value);
        }
        if($(value).children("a").text().search(/Historica.Generalia.\(\d+\)/i) === 0) {
            historica.push($(value));
        }
        if($(value).children("a").text().search(/Biographica.\(\d+\)/i) === 0) {
            historica.push($(value));
        }
        if($(value).children("a").text().search(/Philosophia.Historica.\(\d+\)/i) === 0) {
            historica.push($(value));
        }
        if($(value).children("a").text().search(/Historia.Antiqua.\(\d+\)/i) === 0) {
            historica.push($(value));
        }
        if($(value).children("a").text().search(/Historia.Aegypti.\(\d+\)/i) === 0) {
            historica.push($(value));
        }
        if($(value).children("a").text().search(/Historia.Palaestinae.\(\d+\)/i) === 0) {
            historica.push($(value));
        }
        if($(value).children("a").text().search(/Historia.Mesopotamiae.\(\d+\)/i) === 0) {
            historica.push($(value));
        }
        if($(value).children("a").text().search(/Historia.Europae.Antiquae.\(\d+\)/i) === 0) {
            historica.push($(value));
        }
        if($(value).children("a").text().search(/Historia.Italiae.Antiquae.\(\d+\)/i) === 0) {
            historica.push($(value));
        }
        if($(value).children("a").text().search(/Historia.Hellados.\(\d+\)/i) === 0) {
            historica.push($(value));
        }
        if($(value).children("a").text().search(/Historia.Europae.Modernae.\(\d+\)/i) === 0) {
            historica.push($(value));
        }
        if($(value).children("a").text().search(/Historia.Brasiliae.\(\d+\)/i) === 0) {
            historica.push($(value));
        }


// Religion
        if($(value).children("a").text().search(/Theologica.\(\d+\)/i) === 0) {
            theologica[0] = $(value);
        }
        if($(value).children("a").text().search(/Philosophia.Theologica.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }
        if($(value).children("a").text().search(/Theologica.Generalia.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }
        if($(value).children("a").text().search(/Iustificatio.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }
        if($(value).children("a").text().search(/Ordines.et.Monasteria.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }
        if($(value).children("a").text().search(/Denominationes.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }
        if($(value).children("a").text().search(/Catholica.Romana.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }
        if($(value).children("a").text().search(/Anglicana.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }
        if($(value).children("a").text().search(/Protestantica.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }
        if($(value).children("a").text().search(/Pagana.Antiqua.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }
        if($(value).children("a").text().search(/Iudaica.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }
        if($(value).children("a").text().search(/Islamica.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }
        if($(value).children("a").text().search(/Mores.sepulturarum.\(\d+\)/i) === 0) {
            theologica.push($(value));
        }


// Sozialwissenschaften
        if($(value).children("a").text().search(/Politica.\(\d+\)/i) === 0) {
            politica[0] = $(value);
        }
        if($(value).children("a").text().search(/Ethica.\(\d+\)/i) === 0) {
            politica.push($(value));
        }
        if($(value).children("a").text().search(/Politica.\(\d+\)/i) === 0) {
            politica.push($(value));
        }
        if($(value).children("a").text().search(/Rei.publicae.\(\d+\)/i) === 0) {
            politica.push($(value));
        }
        if($(value).children("a").text().search(/Servitudo.\(\d+\)/i) === 0) {
            politica.push($(value));
        }
        if($(value).children("a").text().search(/Ius.inter.gentium.\(\d+\)/i) === 0) {
            politica.push($(value));
        }
        if($(value).children("a").text().search(/Ius.poenalis.\(\d+\)/i) === 0) {
            politica.push($(value));
        }
        if($(value).children("a").text().search(/Ius.civitatum.quarundam.\(\d+\)/i) === 0) {
            politica.push($(value));
        }


// Erziehung und Bildung
        if($(value).children("a").text().search(/Didactica.\(\d+\)/i) === 0) {
            didactia[0] = $(value);
        }
        if($(value).children("a").text().search(/Didactica.Generalia.\(\d+\)/i) === 0) {
            didactia.push($(value));
        }
        if($(value).children("a").text().search(/Scholae.\(\d+\)/i) === 0) {
            didactia.push($(value));
        }
        if($(value).children("a").text().search(/Gymnasium.\(\d+\)/i) === 0) {
            didactia.push($(value));
        }
        if($(value).children("a").text().search(/Universitates.\(\d+\)/i) === 0) {
            didactia.push($(value));
        }
        if($(value).children("a").text().search(/Mores.academici.\(\d+\)/i) === 0) {
            didactia.push($(value));
        }
        if($(value).children("a").text().search(/Societates.Academicae.\(\d+\)/i) === 0) {
            didactia.push($(value));
        }
        if($(value).children("a").text().search(/Bibliothecarii.negotia.\(\d+\)/i) === 0) {
            didactia.push($(value));
        }
        if($(value).children("a").text().search(/Bibliothecae.quaedam.\(\d+\)/i) === 0) {
            didactia.push($(value));
        }
        if($(value).children("a").text().search(/Catalogi.bibliothecarii.\(\d+\)/i) === 0) {
            didactia.push($(value));
        }


// Opera Jungiana
        if($(value).children("a").text().search(/Aereolus.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Auctarium.Epitome.Sennerti.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Catalogus.soloecismorum.Scharffii.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Catena.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Chronologica.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Clavis.Logicae.Hamburgensis.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Compendium.ethicum.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Compendium.Logicae.Hamburgensis.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/De.demonstratione.ex.Galeno.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/De.stylo.sacrarum.literarum.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Disputationes.ethicae.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Disputationes.Hamburgenses.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Disputationes.noematicae.VIII.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Harmonica.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/In.librum.V.Ethicorum.Nicomachicorum.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Index.in.Aristotelis.opera.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Isagoge.phytoscopica.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Leges.Societatis.Ereuneticae.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Logica.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Logica.Hamburgensis.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Logicae.Hamburgensis.Praestantia.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Orationes.inaugurales.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Phoranomica.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Praelectiones.Physicae.\(\d+\)/i) === 0) {
            opera.push($(value));
        }
        if($(value).children("a").text().search(/Protonoeticae.philosophiae.sciagraphia.\(\d+\)/i) === 0) {
            opera.push($(value));
        }



    });

    retour += '<ul>';


    $.each( mathematica, function( key, value) {

        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub mathematica">'+$(value).html()+'</li>';
        }
    });

    $.each( astronomica, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub astronomica">'+$(value).html()+'</li>';
        }
    });

    $.each( geographica, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub geographica">'+$(value).html()+'</li>';
        }
    });

    $.each( physica, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub physica">'+$(value).html()+'</li>';
        }
    });

    $.each( biologica, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub biologica">'+$(value).html()+'</li>';
        }
    });

    $.each( linguistica, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub linguistica">'+$(value).html()+'</li>';
        }
    });

    $.each( philologica, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub philologica">'+$(value).html()+'</li>';
        }
    });

    $.each( philosophica, function( key, value) {
        if(typeof value !== "undefined"){
            if(key === 0) {
                retour += '<li>'+$(value).html()+'</li>';
            } else {
                retour += '<li class="sub philosophica">'+$(value).html()+'</li>';
            }
        }
    });

    $.each( philosophia, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub philosophia">'+$(value).html()+'</li>';
        }
    });

    $.each( historica, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub historica">'+$(value).html()+'</li>';
        }
    });

    $.each( theologica, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub theologica">'+$(value).html()+'</li>';
        }
    });


    $.each( politica, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub politica">'+$(value).html()+'</li>';
        }
    });

    $.each( didactia, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub didactia">'+$(value).html()+'</li>';
        }
    });

    $.each( opera, function( key, value) {
        if(key === 0) {
            retour += '<li>'+$(value).html()+'</li>';
        } else {
            retour += '<li class="sub opera">'+$(value).html()+'</li>';
        }
    });


    retour += '</ul>';

    return retour;
}

function translateLanguage(html, noSpace) {
    // translate
    var space = "&nbsp;";// must be & nbsp ;
    if (noSpace) {
        space = "";
    }
    html = html.replace("ara"+space, "Arabisch"+space);
    html = html.replace("arc"+space, "Aramäisch"+space);
    html = html.replace("arm"+space, "Armenisch"+space);
    html = html.replace("chi"+space, "Chinesisch"+space);
    html = html.replace("chu"+space, "Altkirchenslawisch"+space);
    html = html.replace("cze"+space, "Tschechisch"+space);
    html = html.replace("dsb"+space, "Niedersorbisch"+space);
    html = html.replace("dut"+space, "Niederländisch"+space);
    html = html.replace("eng"+space, "Englisch"+space);
    html = html.replace("fin"+space, "Finnisch"+space);
    html = html.replace("fre"+space, "Französisch"+space);
    html = html.replace("ger"+space, "Deutsch"+space);
    html = html.replace("gle"+space, "Irisch"+space);
    html = html.replace("grc"+space, "Altgriechisch (vor 1453)"+space);
    html = html.replace("grn"+space, "Guarani"+space);
    html = html.replace("heb"+space, "Hebräisch"+space);
    html = html.replace("hrv"+space, "Kroatisch"+space);
    html = html.replace("hun"+space, "Ungarisch"+space);
    html = html.replace("ita"+space, "Italienisch"+space);
    html = html.replace("lat"+space, "Lateinisch"+space);
    html = html.replace("lav"+space, "Lettisch"+space);
    html = html.replace("nds"+space, "Niederdeutsch"+space);
    html = html.replace("ota"+space, "Osmanisch"+space);
    html = html.replace("per"+space, "Persisch"+space);
    html = html.replace("pol"+space, "Polnisch"+space);
    html = html.replace("qwm"+space, "Kiptschakisch-Kumanisch"+space);

    return html;
}

function uniqueArray(array) {
    var newArray = [];
    for(var i=0, j=array.length; i<j; i++){
        if(newArray.indexOf(array[i]) == -1)
            newArray.push(array[i]);
    }
    return newArray;
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};


function createPersonIndex() {
    // Create person index for filter
    //
    var personIndexArray = [];
    var personArray = [];
    $(".jungius-filter-person-content [class^=tx-dlf-search-] a").each(function() {
        var href = '';
        var text = '';
        var newLink = '';
        if($(this).parent().attr('class') == 'tx-dlf-search-cur'){

            href = $(this).attr("href");
            text = $(this).html();
            var parent = $(this).parent();

            if(text.substring(0,17) == "Auswahl entfernen"){
                text = text.substring(17);
                text = text.replace("(","");
                text = text.replace(")","");
                text = $.trim(text);
            }

            // $(this).remove();
            parent.children("a").remove();

            newLink = '<a href="' + href + '" class="tx-dlf-search-cur">' + text + '</a>';

            personIndexArray.push(text.substring(0,1).toUpperCase());
            personArray.push(newLink);
            personIndexArray = $.unique(personIndexArray);
        } else {

            href = $(this).attr("href");
            text = $(this).html();


            newLink = '<a href="' + href + '" class="tx-dlf-search-no">' + text+ '</a>';
            var firstChar = $(this).html().substring(0,1).toUpperCase();
            if (firstChar == '&') {
                firstChar = '#';
            }
            personIndexArray.push(firstChar);
            personArray.push(newLink);
            personIndexArray = uniqueArray(personIndexArray);
        }
    });

    $(".jungius-filter-person-content ul").remove();
    $(".jungius-filter-person-content").append('<div class="clear"></div><ul class="personList scrollList"></ul>');

    var index = personIndexArray.indexOf('[');
    if (index > -1) {
        personIndexArray.splice(index, 1);
    }

    //sort desc
    personIndexArray.sort();
    personIndexArray.reverse();

    if (personIndexArray.length > 1) {
        var indexString = '';
        $.each(personIndexArray, function(index, elem) {
            if (elem == '#') {
                elementClassName = '1';
            } else {
                elementClassName = elem;
            }
            index = '<div class="person_index"><a href="" class="index_' + elementClassName + '">' + elem + '</a></div>';
            $(".jungius-filter-person-content").prepend(index);
            indexString = indexString + index;


            personArray.sort();


            // set click handler for every item
            $(".index_"+elementClassName).click(function(event) {
                event.preventDefault();
                $(".personList li").remove();
                personArray.forEach(function (personElem) {

                    // if name begins with...
                    if($(personElem).html().substring(0,1).toUpperCase() == elem){
                        if($(personElem).attr("class") == "tx-dlf-search-cur"){

                        } else {
                            urlSplit = $(personElem).attr('href').split('?');
                            $(".personList").append('<li><a href="' + $(personElem).attr('href') + '#person">' + $(personElem).html() + '</a></li>');
                        }

                    }
                    if($(personElem).html().substring(0,1).toUpperCase() == '&' && elem == '#'){
                        urlSplit = $(personElem).attr('href').split('?');
                        $(".personList").append('<li><a href="' + $(personElem).attr('href') + '#person">' + $(personElem).html() + '</a></li>');
                    }
                });

                // set click event for person list
                $(".personList a").click(function (event) {
                    event.preventDefault();
                    // click event for single entry
                    // setFilter(event.currentTarget.href);

                    var newUrl = location.href + $(this)[0].search;
                    newUrl = newUrl.replace(/id=([0-9]+)/g, '');
                    Cookie.set('fq', encodeURIComponent(newUrl));
                    window.location = newUrl;

                    return false;
                });
            });
        });
    }
}