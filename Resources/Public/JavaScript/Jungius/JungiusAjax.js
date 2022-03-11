const pageAjax = 47,
    pageAjaxAll = 48,
    pageFilter = 49;

$.ajaxSetup({ cache: false });

function getFilter() {
    $('input#search_signature').attr('placeholder', 'Bitte warten Sie bis alle Signaturen geladen sind');
    $('input#search_signature_mobile').attr('placeholder', 'Bitte warten Sie bis alle Signaturen geladen sind');
    $('.jungius-filter-person-content').html('Bitte warten Sie bis alle Personen geladen sind');
    $('input#search_signature').prop( "disabled", true );
    $('input#search_signature_mobile').prop( "disabled", true );

    // Filter page
    url = 'index.php?id=' + pageFilter;

    $.ajax({
        url: url,
        success: function(result) {
            // attention! plugin facet sort order is important!
            // signature
            var signature = $(result).find(".tx-dlf-search-facets ul li ul")[0];
            $('.jungius-filter-signature-content').append($(signature).html());
            autoCompleteSignature();

            $('.jungius-filter-person-content').html('');
            var personen = $(result).find(".tx-dlf-search-facets ul li ul")[1];
            $('#nav_right .jungius-filter-person-content').append('<ul id="person" class="tx-dlf-hidden">'+$(personen).html()+'</ul>');
            createPersonIndex();

            $('input#search_signature').prop( "disabled", false );
            $('input#search_signature_mobile').prop( "disabled", false );
            $('input#search_signature').attr('placeholder', 'Nach welcher Signatur suchen Sie?');
            $('input#search_signature_mobile').attr('placeholder', 'Nach welcher Signatur suchen Sie?');
        }
    });
}

function setFilter(url) {
    $.ajax({
        url: url,
        success: function(result) {
            location.reload();
        }
    });
}

function getRequest(pageid, reset){

    var lastParams = Cookie.get('fq');
    if (lastParams) {
        lastParams = decodeURIComponent(lastParams);
        lastParams = lastParams.substring(1, lastParams.length);
        lastParams = '&'+lastParams;
    } else {
        lastParams = '';
    }

    var title = Cookie.get('title');
    if(title) {
        lastParams += '&tx_dlf%5Bquery%5D='+title;
    }

    url = 'index.php?id=1927&tx_dlf%5Bpointer%5D='+pageid+''; // 1925
    if (reset || pageid == 1){
        url = 'index.php?id=' + pageAjax + lastParams + '&tx_dlf%5Bpointer%5D=' + pageid + '';

        var searchParam = '&tx_dlf%5Bcollection%5D=1';
        if (!title) {
            searchParam += '&tx_dlf%5Bquery%5D=%2A';
        }
        url += searchParam;
        $("#tx-dlf-feed-list").html("");
    }

    $.ajax({
        url: url,
        success: function(result) {

            if (reset || pageid == 1){
                // second request for all entries
                url = 'index.php?id=' + pageAjaxAll + lastParams + '&tx_dlf%5Bpointer%5D=' + pageid + '';
                var searchParam = '&tx_dlf%5Bcollection%5D=1';
                if (!title) {
                    searchParam += '&tx_dlf%5Bquery%5D=%2A';
                } else {
                    searchParam += '&tx_dlf%5Bquery%5D='+title;
                }
                url += searchParam;
                $.ajax({
                    url: url,
                    success: function(result) {

                        // get all filter
                        getFilter();

                        var hitsRegEx = /\s(\d+)\D*(\d+)/

                        var matchHits = $(result).find(".tx-dlf-search-numHits").text().match(hitsRegEx);
                        if ($(".active-facets a").length > 0) {
                            $("#tx-dlf-count").html(matchHits[1] + ' Treffer in ' + matchHits[2] + ' Dokumenten');
                        }
                    }
                });
            }

            lockAjax = false;

            var hitsRegEx = /\s(\d+)\D*(\d+)/
            var matchHits = $(result).find(".tx-dlf-search-numHits").text().match(hitsRegEx);

            if(Math.ceil(parseInt(matchHits[2])/10) > pageid || pageid == 1) {

                var listItems = $(result).find("[class^=i-]");
                var j = 0;
                listItems.each(function() {

                    var structureType = $(this).children(".Strukturtyp").text();
                    var title = $(this).children(".Titel");
                    //var ort = $(this).children(".Erscheinungsort");
                    var signatur = $(this).children(".Signatur");
                    var sprache = $(this).children(".Sprache");

                    var thema = $(this).next(".tx-dlf-volume");

                    var subItems = $(result).find(".tx-dlf-volume."+$(this).attr("class"));

                    thema = thema.children('.Thema');

                    if(typeof thema.html() == "undefined"){
                        var htmlThema = '';
                    } else {
                        var htmlThema = thema.html();
                    }
                    var itemClass = $(this).attr("class");

                    var layoutHTML = '<ul class="row_item main_item ' + itemClass + '"><li class="'+structureType+'"><span></span></li>\
                    <li class="content_details">\
                    <h2 class="content_title"><a href="#">' + title.html() + '</a></h2>\
                    <div class="content_info_left">\
                    ' + htmlThema + '\
                    </div>\
                    <div class="content_info_right">\
                    ' + signatur.html() + ' | ' + sprache.html() + '\
                    </div>\
                    <div class="clear"></div>';

                    subItems.each(function() {
                        if ($(this).children('.Titel').text() != '[kein Titel]') {
                            layoutHTML += '<h3>' + $(this).children('.Titel').html() + '</h3>';
                        }

                    });

                    layoutHTML += '</li>';

                    $("#tx-dlf-feed-list").append(layoutHTML);

                    j++;
                });
                $('#scrollspy img').fadeOut();
            } else {
                $('#scrollspy').fadeOut();
            }
        }
    });
}
