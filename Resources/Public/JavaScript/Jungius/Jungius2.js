$(document).ready(function() {

    var detailPageName      = 'nc/detail.html',
        detailPageName2     = 'detail.html',
        detailPageId        = 41,
        detailFullscreenId  = 51;
    //test
    var partofObj = $('.PartOf');
    var partof = partofObj.text();

    partofObj.remove();

    setToc($(".tx-dlf-toc.tx-dlf-window .tx-dlf-toc-title"),$(".toc_table"));

    var whatType = $("td.Strukturtyp").text();
    $('a.chapter_download, a#pdfdownloadbutton').hide();
    if (whatType == "MehrbÃ¤ndiges Werk" || whatType == "Zeitschrift" || whatType == "periodical" || whatType == "journal") {
        $('.tx-dlf-metadata').parent().parent().hide();

        // set headline
        $('.toc_table').prepend('<tr><td><h2>Bandliste</h2></td></tr>');
    } else {
        // click handler toc
        $('a.chapter_download, a#pdfdownloadbutton').on('click', function(event) {
            $('#p_nutzungsbedingungen_kapitel').show();
            var link = $(this).attr('href');
            link = link.replace("http://resolver.sub.uni-hamburg.de/goobi/", "");
            $('#pdfdownloader_kapitel').attr('href', link);
            event.preventDefault();
        });
    }

    var ppn = $('#purl').text();
    $("#purl a").attr('href', $("#purl a").attr('href')+'/'+ppn);
    $("#purl a").text(ppn);

    // prepare metadata
    $('.tx-dlf-metadata td').each(function() {
        var metalabel = $(this).attr('class');
        var metadata = $(this).html();

        $('.portlet_tooltip strong#goobi_detail_metadata').append('<h4>'+metalabel+'</h4>');
        $('.portlet_tooltip strong#goobi_detail_metadata').append('<h5>'+metadata+'</h5>');
    });

    setPartOfUrl(partof);

    var text = ppn.replace('http://resolver.sub.uni-hamburg.de/goobi/', '');
    $('#pdfdownloadbutton').attr('href', 'http://gcs.sub.uni-hamburg.de/gcs?action=pdf&pagesize=original&metsFile='+text);

    $('a#close-kapitel-download').on('click', function(event) {
        event.preventDefault();
        $('#p_nutzungsbedingungen_kapitel').hide();
    });

    // prevent link following
    $(".show-volumes").on('click', function(event) {event.preventDefault();});

    // set map tools
    if ($(".tx-dlf-navigation-pageselect [id^=Navigation-] option").length > 0) {
        var id = getUrlParameter('tx_dlf[id]');
        //var pageCount = $(".tx-dlf-navigation-pageselect [id^=Navigation-] option").length;
        var currentPage = $(".tx-dlf-navigation-pageselect [id^=Navigation-] option[selected^=selected]").val();

        var pageSelect = $('.tx-dlf-navigation-pageselect').html();
        $("#dv_navigation").html(pageSelect);

        // set fwd rwd
        if (typeof $(".tx-dlf-navigation-prev a").attr("href") != "undefined") {
            $("#page_back").parent().attr("href", $(".tx-dlf-navigation-prev a").attr("href"));
        } else {
            $("#page_back").parent().on('click', function(event) {
                event.preventDefault();
            });
        }
        if (typeof $(".tx-dlf-navigation-next a").attr("href") != "undefined") {
            $("#page_forward").parent().attr("href", $(".tx-dlf-navigation-next a").attr("href"));
        } else {
            $("#page_forward").parent().on('click', function(event) {
                event.preventDefault();
            });
        }

        // toggle fullscreen
        if (window.location.pathname.substring(1) == detailPageName || window.location.pathname.substring(1) == detailPageName2 ||
            (window.location.pathname.substring(1) == "index.php" && parseInt(getUrlParameter('id')) === detailPageId)) {
            $("#goobi_view a").attr("href", '/index.php?id=' + detailFullscreenId + '&tx_dlf%5Bid%5D=' + id + '&tx_dlf%5Bpage%5D='+currentPage+'&tx_dlf%5Bpointer%5D=3&tx_dlf%5Bdouble%5D=0');
        } else {
            $("#goobi_view a").attr("href", '/index.php?id=' + detailPageId + '&tx_dlf%5Bid%5D=' + id + '&tx_dlf%5Bpage%5D='+currentPage+'&tx_dlf%5Bpointer%5D=3&tx_dlf%5Bdouble%5D=0');
        }
    }
    $(".headline_info").removeAttr("title");
    $(".headline_info_basket").removeAttr("title");
});

/* URL zur ParentUrl (Bandliste) */
function setPartOfUrl(partofObj) {
    if (partofObj) {
        var partof = partofObj;
        subpartof = partof.substr(1);
        var whatType = $("td.Strukturtyp").text();
        var collection = $("td.Sammlung").text();
        if (whatType != "MehrbÃ¤ndiges Werk" && whatType != "Zeitschrift" && whatType != "periodical" && whatType != "journal" && subpartof != '0') {
            if (collection != "Nachlass Joachim Jungius") {
                $('#goobi_detail_metadata').append('<h4>Bandliste</h4><h5><a href="detail.html?tx_dlf[id]=' + subpartof + '">zurÃ¼ck zur Bandliste</a></h5>');
            }
        }
    }
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function setToc (toc, container) {
    var ppn = $("#purl a").text();
    var j = 0;
    var i = 0;
    container.html('');
    toc.each(function() {
        if (j > 0){
            j--;
            return;
        }
        if (i > 0){
            currentElement = '';

            if($(this).parent().parent().children("ul").length !== 0) {

                currentElement = $(this).parent().parent().children("ul").html();

                $(this).parent().parent().children("ul").remove();

            }
            var hightlightClass = '';
            // highlighting
            var classes = $(this).parent().parent().attr('class').split(" ");
            if (classes[0] == "tx-dlf-toc-cur") {
                hightlightClass = 'tx-dlf-toc-cur';
            }
            if (classes[0] == "tx-dlf-toc-ifsub" || classes[1] == "tx-dlf-toc-ifsub") {
                $(this).prepend("+ ");
            }

            var entry_id = $(this).parent().children('.tx-dlf-toc-entry_id').text();
            $(this).parent().children('.tx-dlf-toc-entry_id').remove();

            var text = $(this).parent().parent().html();
            var chapterURL = 'http://gcs.sub.uni-hamburg.de/gcs?action=pdf&pagesize=original&metsFile=' + ppn + '&divID=' + entry_id;

            container.append('<tr class="'+hightlightClass+'"><td valign="middle">' + text + '</td><td><a class="chapter_download" href="' + chapterURL + '"><span class="tx-dlf-toc-chapter_download"><img src="https://digitalisate.sub.uni-hamburg.de/fileadmin/templates/jungius_template/img/icon_download_wh.gif" alt="Kapitel als PDF runterladen" title="Kapitel als PDF runterladen" /></span></a></td></tr>');

            if(currentElement.length !== 0) {
                $(currentElement).each(function() {
                    var entry_id = $(this).children().children('.tx-dlf-toc-entry_id').text();
                    $(this).children().children('.tx-dlf-toc-entry_id').remove();

                    var chapterURL = 'http://gcs.sub.uni-hamburg.de/gcs?action=pdf&pagesize=original&metsFile=' + ppn + '&divID=' + entry_id;

                    text = $(this).html();
                    if($(this).hasClass("tx-dlf-toc-cur")) {
                        container.append('<tr><td class="padding_toc" valign="middle"><b>' + text + '</b></td><td><a class="chapter_download" href="' + chapterURL + '"><span class="tx-dlf-toc-chapter_download"><img src="https://digitalisate.sub.uni-hamburg.de/fileadmin/templates/jungius_template/img/icon_download_wh.gif" alt="Kapitel als PDF runterladen" title="Kapitel als PDF runterladen" /></span></a></td></tr>');
                    } else {
                        container.append('<tr><td class="padding_toc" valign="middle">' + text + '</td><td><a class="chapter_download" href="' + chapterURL + '"><span class="tx-dlf-toc-chapter_download"><img src="https://digitalisate.sub.uni-hamburg.de/fileadmin/templates/jungius_template/img/icon_download_wh.gif" alt="Kapitel als PDF runterladen" title="Kapitel als PDF runterladen" /></span></a></td></tr>');
                    }

                    j++;
                });

            }
        }
        i++;
    });
}