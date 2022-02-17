$(document).ready(function() {
    //_paq = window._paq || [];//Matomo bei Bedarf initialisieren
    enrichBreadcrumbForVolumes();

    if (showVolumeList()) {
        setNavigationControls();
    } else {
        $('div.tx-dlf-navigation').hide();
    }

    setTitleOnDetailPage();

    setBackToListviewInBreadcrumb();

    listViewFunction();

    languageFacet();

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

    renameMetadataTab();

    initExpandCollapse();

    calendarSelectBox();

    calendarSwitchViews();

    replaceRssFeedImage();

    fulltextPositionAdjustment();

    fullscreenNavigationPositioning();

    clickEventMetadataToc();

    listviewNewspaperRouting();

});

function replaceRssFeedImage() {
    $('.tx-dlf-rss-feed a img').attr('src', 'https://digitalisate.sub.uni-hamburg.de/typo3conf/ext/subhh_website/Resources/Public/img/rss-feed.png');
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
    $('.tx-dlf-pdfdownloadtool')
        .append('<span class="fullPdfDownloadSpan"><a id="fullPdfDownload" href="#"><img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-pdf-white.svg" alt="PDF Download"></a></span>');

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
            $(this).append('<img class="no-hover" src="/typo3conf/ext/subhh_website/Resources/Public/img/document-collection.png"/>');
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
    $('#detail-view aside > article > div > div.tx-dlf-tableofcontents > div > div > .dropdown-menu').hide();
    $('#detail-view aside section').css('position', 'absolute').css('right', '300px');
    $('#header').hide();
    $('#opening_hours').hide();
    $('#detail-view section#main-content').css('width', '100%');

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
    $('#detail-view aside > article > div > div.tx-dlf-tableofcontents > div > div > .dropdown-menu').show();
    $('#detail-view aside section').css('position', 'initial').css('right', 0).css('top', '0px');
    $('#header').show();
    $('#opening_hours').show();
    $('#detail-view section#main-content').css('width', '67%');

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

    // PDF download is build in addFullPdfDownload function
    $('.tx-dlf-tools-fulltext span.no-fulltext')
        .text('')
        .append('<img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-text-white.svg" alt="Kein Volltext vorhanden">');

    $('.tx-dlf-tools-fulltext a')
        .text('')
        .append('<img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-text-white.svg" alt="Volltext anzeigen">');



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


function languageFacet() {
    $('.tx-dlf-search-facets .facet-sub-title').each(function () {
        if ($(this).text() == "Sprache:") {
            var facetList = $(this).parent().find('ul');
            facetList.html(translateLanguage(facetList.html()));
        }
    });
}

function translateLanguage(html, noSpace) {
    // translate
    var space = "&nbsp;";// must be & nbsp ;
    if (noSpace) {
        space = "";
    }
    html = html.replace("aar"+space, "Danakil-Sprache"+space);
    html = html.replace("abk"+space, "Abchasisch"+space);
    html = html.replace("ace"+space, "Aceh-Sprache"+space);
    html = html.replace("ach"+space, "Acholi-Sprache"+space);
    html = html.replace("ada"+space, "Adangme-Sprache"+space);
    html = html.replace("ady"+space, "Adygisch"+space);
    html = html.replace("afa"+space, "Hamitosemitische-Sprachen"+space);
    html = html.replace("afh"+space, "Afrihili"+space);
    html = html.replace("afr"+space, "Afrikaans"+space);
    html = html.replace("ain"+space, "Ainu-Sprache"+space);
    html = html.replace("aka"+space, "Akan-Sprache"+space);
    html = html.replace("akk"+space, "Akkadisch"+space);
    html = html.replace("sqi"+space, "Albanisch"+space);
    html = html.replace("ale"+space, "Aleutisch"+space);
    html = html.replace("alg"+space, "Algonkin-Sprachen"+space);
    html = html.replace("alt"+space, "Altaisch"+space);
    html = html.replace("amh"+space, "Amharisch"+space);
    html = html.replace("ang"+space, "Altenglisch"+space);
    html = html.replace("anp"+space, "Anga-Sprache"+space);
    html = html.replace("apa"+space, "Apachen-Sprachen"+space);
    html = html.replace("ara"+space, "Arabisch"+space);
    html = html.replace("arc"+space, "Aramäisch"+space);
    html = html.replace("arg"+space, "Aragonesisch"+space);
    html = html.replace("hye"+space, "Armenisch"+space);
    html = html.replace("arn"+space, "Arauka-Sprachen"+space);
    html = html.replace("arp"+space, "Arapaho-Sprache"+space);
    html = html.replace("art"+space, "Kunstsprachen"+space);
    html = html.replace("arw"+space, "Arawak-Sprachen"+space);
    html = html.replace("asm"+space, "Assamesisch"+space);
    html = html.replace("ast"+space, "Asturisch"+space);
    html = html.replace("ath"+space, "Athapaskische-Sprachen"+space);
    html = html.replace("aus"+space, "Australische-Sprachen"+space);
    html = html.replace("ava"+space, "Awarisch"+space);
    html = html.replace("ave"+space, "Avestisch"+space);
    html = html.replace("awa"+space, "Awadhi"+space);
    html = html.replace("aym"+space, "Aymará-Sprache"+space);
    html = html.replace("aze"+space, "Aserbeidschanisch"+space);
    html = html.replace("bad"+space, "(Ubangi-Sprachen)"+space);
    html = html.replace("bai"+space, "Bamileke-Sprachen"+space);
    html = html.replace("bak"+space, "Baschkirisch"+space);
    html = html.replace("bal"+space, "Belutschisch"+space);
    html = html.replace("bam"+space, "Bambara-Sprache"+space);
    html = html.replace("ban"+space, "Balinesisch"+space);
    html = html.replace("eus"+space, "Baskisch"+space);
    html = html.replace("bas"+space, "Basaa-Sprache"+space);
    html = html.replace("bat"+space, "Baltische-Sprachen"+space);
    html = html.replace("bej"+space, "Bedauye"+space);
    html = html.replace("bel"+space, "Weißrussisch"+space);
    html = html.replace("bem"+space, "Bemba-Sprache"+space);
    html = html.replace("ben"+space, "Bengali"+space);
    html = html.replace("ber"+space, "Berbersprachen"+space);
    html = html.replace("bho"+space, "Bhojpuri"+space);
    html = html.replace("bih"+space, "Bihari"+space);
    html = html.replace("bik"+space, "Bikol-Sprache"+space);
    html = html.replace("bin"+space, "Edo-Sprache"+space);
    html = html.replace("bis"+space, "Beach-la-mar"+space);
    html = html.replace("bla"+space, "Blackfoot-Sprache"+space);
    html = html.replace("bnt"+space, "Bantusprachen"+space);
    html = html.replace("bod"+space, "Tibetisch"+space);
    html = html.replace("bos"+space, "Bosnisch"+space);
    html = html.replace("bra"+space, "Braj-Bhakha"+space);
    html = html.replace("bre"+space, "Bretonisch"+space);
    html = html.replace("btk"+space, "Batak-Sprache"+space);
    html = html.replace("bua"+space, "Burjatisch"+space);
    html = html.replace("bug"+space, "Bugi-Sprache"+space);
    html = html.replace("bul"+space, "Bulgarisch"+space);
    html = html.replace("mya"+space, "Birmanisch"+space);
    html = html.replace("byn"+space, "Bilin-Sprache"+space);
    html = html.replace("cad"+space, "Caddo-Sprachen"+space);
    html = html.replace("cai"+space, "Zentralamerika"+space);
    html = html.replace("car"+space, "Karibische-Sprachen"+space);
    html = html.replace("cat"+space, "Katalanisch"+space);
    html = html.replace("cau"+space, "Kaukasische-Sprachen"+space);
    html = html.replace("ceb"+space, "Cebuano"+space);
    html = html.replace("cel"+space, "Keltische-Sprachen"+space);
    html = html.replace("ces"+space, "Tschechisch"+space);
    html = html.replace("cha"+space, "Chamorro-Sprache"+space);
    html = html.replace("chb"+space, "Chibcha-Sprachen"+space);
    html = html.replace("che"+space, "Tschetschenisch"+space);
    html = html.replace("chg"+space, "Tschagataisch"+space);
    html = html.replace("zho"+space, "Chinesisch"+space);
    html = html.replace("chk"+space, "Trukesisch"+space);
    html = html.replace("chm"+space, "Tscheremissisch"+space);
    html = html.replace("chn"+space, "Chinook-Jargon"+space);
    html = html.replace("cho"+space, "Choctaw-Sprache"+space);
    html = html.replace("chp"+space, "Chipewyan-Sprache"+space);
    html = html.replace("chr"+space, "Cherokee-Sprache"+space);
    html = html.replace("chu"+space, "Kirchenslawisch"+space);
    html = html.replace("chv"+space, "Tschuwaschisch"+space);
    html = html.replace("chy"+space, "Cheyenne-Sprache"+space);
    html = html.replace("cmc"+space, "Cham-Sprachen"+space);
    html = html.replace("cnr"+space, "Montenegrinisch"+space);
    html = html.replace("cop"+space, "Koptisch"+space);
    html = html.replace("cor"+space, "Kornisch"+space);
    html = html.replace("cos"+space, "Korsisch"+space);
    html = html.replace("cpe"+space, "Kreolisch-Englisch"+space);
    html = html.replace("cpf"+space, "Kreolisch-Französisch"+space);
    html = html.replace("cpp"+space, "Kreolisch-Portugiesisch"+space);
    html = html.replace("cre"+space, "Cree-Sprache"+space);
    html = html.replace("crh"+space, "Krimtatarisch"+space);
    html = html.replace("crp"+space, "Pidginsprachen"+space);
    html = html.replace("csb"+space, "Kaschubisch"+space);
    html = html.replace("cus"+space, "Kuschitische-Sprachen"+space);
    html = html.replace("cym"+space, "Kymrisch"+space);
    html = html.replace("ces"+space, "Tschechisch"+space);
    html = html.replace("dak"+space, "Dakota-Sprache"+space);
    html = html.replace("dan"+space, "Dänisch"+space);
    html = html.replace("dar"+space, "Darginisch"+space);
    html = html.replace("day"+space, "Dajakisch"+space);
    html = html.replace("del"+space, "Delaware-Sprache"+space);
    html = html.replace("den"+space, "Slave-Sprache"+space);
    html = html.replace("deu"+space, "Deutsch"+space);
    html = html.replace("ger"+space, "Deutsch"+space);
    html = html.replace("dgr"+space, "Dogrib-Sprache"+space);
    html = html.replace("din"+space, "Dinka-Sprache"+space);
    html = html.replace("div"+space, "Maledivisch"+space);
    html = html.replace("doi"+space, "Dogri"+space);
    html = html.replace("dra"+space, "Drawidische-Sprachen"+space);
    html = html.replace("dsb"+space, "Niedersorbisch"+space);
    html = html.replace("dua"+space, "Duala-Sprachen"+space);
    html = html.replace("dum"+space, "Mittelniederländisch"+space);
    html = html.replace("nld"+space, "Niederländisch"+space);
    html = html.replace("dyu"+space, "Dyula-Sprache"+space);
    html = html.replace("dzo"+space, "Dzongkha"+space);
    html = html.replace("efi"+space, "Efik"+space);
    html = html.replace("egy"+space, "Ägyptisch"+space);
    html = html.replace("eka"+space, "Ekajuk"+space);
    html = html.replace("ell"+space, "Neugriechisch"+space);
    html = html.replace("elx"+space, "Elamisch"+space);
    html = html.replace("eng"+space, "Englisch"+space);
    html = html.replace("enm"+space, "Mittelenglisch"+space);
    html = html.replace("epo"+space, "Esperanto"+space);
    html = html.replace("est"+space, "Estnisch"+space);
    html = html.replace("eus"+space, "Baskisch"+space);
    html = html.replace("ewe"+space, "Ewe-Sprache"+space);
    html = html.replace("ewo"+space, "Ewondo"+space);
    html = html.replace("fan"+space, "Pangwe-Sprache"+space);
    html = html.replace("fao"+space, "Färöisch"+space);
    html = html.replace("fas"+space, "Persisch"+space);
    html = html.replace("fat"+space, "Fante-Sprache"+space);
    html = html.replace("fij"+space, "Fidschi-Sprache"+space);
    html = html.replace("fil"+space, "Pilipino"+space);
    html = html.replace("fin"+space, "Finnisch"+space);
    html = html.replace("fiu"+space, "Finnougrische-Sprachen"+space);
    html = html.replace("fon"+space, "Fon-Sprache"+space);
    html = html.replace("fra"+space, "Französisch"+space);
    html = html.replace("fre"+space, "Französisch"+space);
    html = html.replace("frm"+space, "Mittelfranzösisch"+space);
    html = html.replace("fro"+space, "Altfranzösisch"+space);
    html = html.replace("frr"+space, "Nordfriesisch"+space);
    html = html.replace("frs"+space, "Ostfriesisch"+space);
    html = html.replace("fry"+space, "Friesisch"+space);
    html = html.replace("ful"+space, "Ful"+space);
    html = html.replace("fur"+space, "Friulisch"+space);
    html = html.replace("gaa"+space, "Ga-Sprache"+space);
    html = html.replace("gay"+space, "Gayo-Sprache"+space);
    html = html.replace("gba"+space, "Gbaya-Sprache"+space);
    html = html.replace("gem"+space, "Germanische-Sprachen"+space);
    html = html.replace("kat"+space, "Georgisch"+space);
    html = html.replace("deu"+space, "Deutsch"+space);
    html = html.replace("gez"+space, "Altäthiopisch"+space);
    html = html.replace("gil"+space, "Gilbertesisch"+space);
    html = html.replace("gla"+space, "Gälisch-Schottisch"+space);
    html = html.replace("gle"+space, "Irisch"+space);
    html = html.replace("glg"+space, "Galicisch"+space);
    html = html.replace("glv"+space, "Manx"+space);
    html = html.replace("gmh"+space, "Mittelhochdeutsch"+space);
    html = html.replace("goh"+space, "Althochdeutsch"+space);
    html = html.replace("gon"+space, "Gondi-Sprache"+space);
    html = html.replace("gor"+space, "Gorontalesisch"+space);
    html = html.replace("got"+space, "Gotisch"+space);
    html = html.replace("grb"+space, "Grebo-Sprache"+space);
    html = html.replace("grc"+space, "Griechisch"+space);
    html = html.replace("ell"+space, "Neugriechisch"+space);
    html = html.replace("grn"+space, "Guaraní-Sprache"+space);
    html = html.replace("gsw"+space, "Schweizerdeutsch"+space);
    html = html.replace("guj"+space, "Gujarati-Sprache"+space);
    html = html.replace("gwi"+space, "Kutchin-Sprache"+space);
    html = html.replace("hai"+space, "Haida-Sprache"+space);
    html = html.replace("hat"+space, "(Haiti-Kreolisch)"+space);
    html = html.replace("hau"+space, "Haussa-Sprache"+space);
    html = html.replace("haw"+space, "Hawaiisch"+space);
    html = html.replace("heb"+space, "Hebräisch"+space);
    html = html.replace("her"+space, "Herero-Sprache"+space);
    html = html.replace("hil"+space, "Hiligaynon-Sprache"+space);
    html = html.replace("him"+space, "Himachali"+space);
    html = html.replace("hin"+space, "Hindi"+space);
    html = html.replace("hit"+space, "Hethitisch"+space);
    html = html.replace("hmn"+space, "Miao-Sprachen"+space);
    html = html.replace("hmo"+space, "Hiri-Motu"+space);
    html = html.replace("hrv"+space, "Kroatisch"+space);
    html = html.replace("hsb"+space, "Obersorbisch"+space);
    html = html.replace("hun"+space, "Ungarisch"+space);
    html = html.replace("hup"+space, "Hupa-Sprache"+space);
    html = html.replace("hye"+space, "Armenisch"+space);
    html = html.replace("iba"+space, "Iban-Sprache"+space);
    html = html.replace("ibo"+space, "Ibo-Sprache"+space);
    html = html.replace("isl"+space, "Isländisch"+space);
    html = html.replace("ido"+space, "Ido"+space);
    html = html.replace("iii"+space, "Lalo-Sprache"+space);
    html = html.replace("ijo"+space, "Ijo-Sprache"+space);
    html = html.replace("iku"+space, "Inuktitut"+space);
    html = html.replace("ile"+space, "Interlingue"+space);
    html = html.replace("ilo"+space, "Ilokano-Sprache"+space);
    html = html.replace("ina"+space, "Interlingua"+space);
    html = html.replace("inc"+space, "Indoarische-Sprachen"+space);
    html = html.replace("ind"+space, "Indonesia"+space);
    html = html.replace("ine"+space, "Indogermanische-Sprachen"+space);
    html = html.replace("inh"+space, "Inguschisch"+space);
    html = html.replace("ipk"+space, "Inupik"+space);
    html = html.replace("ira"+space, "Iranische-Sprachen"+space);
    html = html.replace("iro"+space, "Irokesische-Sprachen"+space);
    html = html.replace("isl"+space, "Isländisch"+space);
    html = html.replace("ita"+space, "Italienisch"+space);
    html = html.replace("jav"+space, "Javanisch"+space);
    html = html.replace("jbo"+space, "Lojban"+space);
    html = html.replace("jpn"+space, "Japanisch"+space);
    html = html.replace("jpr"+space, "Jüdisch-Persisch"+space);
    html = html.replace("jrb"+space, "Jüdisch-Arabisch"+space);
    html = html.replace("kaa"+space, "Karakalpakisch"+space);
    html = html.replace("kab"+space, "Kabylisch"+space);
    html = html.replace("kac"+space, "Kachin-Sprache"+space);
    html = html.replace("kal"+space, "Grönländisch"+space);
    html = html.replace("kam"+space, "Kamba-Sprache"+space);
    html = html.replace("kan"+space, "Kannada"+space);
    html = html.replace("kar"+space, "Karenisch"+space);
    html = html.replace("kas"+space, "Kaschmiri"+space);
    html = html.replace("kat"+space, "Georgisch"+space);
    html = html.replace("kau"+space, "Kanuri-Sprache"+space);
    html = html.replace("kaw"+space, "Kawi"+space);
    html = html.replace("kaz"+space, "Kasachisch"+space);
    html = html.replace("kbd"+space, "Kabardinisch"+space);
    html = html.replace("kha"+space, "Khasi-Sprache"+space);
    html = html.replace("khi"+space, "Khoisan-Sprachen"+space);
    html = html.replace("khm"+space, "Kambodschanisch"+space);
    html = html.replace("kho"+space, "Sakisch"+space);
    html = html.replace("kik"+space, "Kikuyu-Sprache"+space);
    html = html.replace("kin"+space, "Rwanda-Sprache"+space);
    html = html.replace("kir"+space, "Kirgisisch"+space);
    html = html.replace("kmb"+space, "Kimbundu-Sprache"+space);
    html = html.replace("kok"+space, "Konkani"+space);
    html = html.replace("kom"+space, "Komi-Sprache"+space);
    html = html.replace("kon"+space, "Kongo-Sprache"+space);
    html = html.replace("kor"+space, "Koreanisch"+space);
    html = html.replace("kos"+space, "Kosraeanisch"+space);
    html = html.replace("kpe"+space, "Kpelle-Sprache"+space);
    html = html.replace("krc"+space, "Karatschaiisch-Balkarisch"+space);
    html = html.replace("krl"+space, "Karelisch"+space);
    html = html.replace("kro"+space, "Kru-Sprachen"+space);
    html = html.replace("kru"+space, "Oraon-Sprache"+space);
    html = html.replace("kua"+space, "Kwanyama-Sprache"+space);
    html = html.replace("kum"+space, "Kumükisch"+space);
    html = html.replace("kur"+space, "Kurdisch"+space);
    html = html.replace("kut"+space, "Kutenai-Sprache"+space);
    html = html.replace("lad"+space, "Judenspanisch"+space);
    html = html.replace("lah"+space, "Lahnda"+space);
    html = html.replace("lam"+space, "(Bantusprache)"+space);
    html = html.replace("lao"+space, "Laotisch"+space);
    html = html.replace("lat"+space, "Latein"+space);
    html = html.replace("lav"+space, "Lettisch"+space);
    html = html.replace("lez"+space, "Lesgisch"+space);
    html = html.replace("lim"+space, "Limburgisch"+space);
    html = html.replace("lin"+space, "Lingala"+space);
    html = html.replace("lit"+space, "Litauisch"+space);
    html = html.replace("lol"+space, "Mongo-Sprache"+space);
    html = html.replace("loz"+space, "Rotse-Sprache"+space);
    html = html.replace("ltz"+space, "Luxemburgisch"+space);
    html = html.replace("lua"+space, "Lulua-Sprache"+space);
    html = html.replace("lub"+space, "Luba-Katanga-Sprache"+space);
    html = html.replace("lug"+space, "Ganda-Sprache"+space);
    html = html.replace("lui"+space, "Luiseño-Sprache"+space);
    html = html.replace("lun"+space, "Lunda-Sprache"+space);
    html = html.replace("luo"+space, "Luo-Sprache"+space);
    html = html.replace("lus"+space, "Lushai-Sprache"+space);
    html = html.replace("mkd"+space, "Makedonisch"+space);
    html = html.replace("mad"+space, "Maduresisch"+space);
    html = html.replace("mag"+space, "Khotta"+space);
    html = html.replace("mah"+space, "Marschallesisch"+space);
    html = html.replace("mai"+space, "Maithili"+space);
    html = html.replace("mak"+space, "Makassarisch"+space);
    html = html.replace("mal"+space, "Malayalam"+space);
    html = html.replace("man"+space, "Malinke-Sprache"+space);
    html = html.replace("mri"+space, "Maori-Sprache"+space);
    html = html.replace("map"+space, "Austronesische-Sprachen"+space);
    html = html.replace("mar"+space, "Marathi"+space);
    html = html.replace("mas"+space, "Massai-Sprache"+space);
    html = html.replace("msa"+space, "Malaiisch"+space);
    html = html.replace("mdf"+space, "Mokscha-Sprache"+space);
    html = html.replace("mdr"+space, "Mandaresisch"+space);
    html = html.replace("men"+space, "Mende-Sprache"+space);
    html = html.replace("mga"+space, "Mittelirisch"+space);
    html = html.replace("mic"+space, "Micmac-Sprache"+space);
    html = html.replace("min"+space, "Minangkabau-Sprache"+space);
    html = html.replace("mis"+space, "andere-Sprachen"+space);
    html = html.replace("mkd"+space, "Makedonisch"+space);
    html = html.replace("mkh"+space, "Mon-Khmer-Sprachen"+space);
    html = html.replace("mlg"+space, "Malagassi-Sprache"+space);
    html = html.replace("mlt"+space, "Maltesisch"+space);
    html = html.replace("mnc"+space, "Mandschurisch"+space);
    html = html.replace("mni"+space, "Meithei-Sprache"+space);
    html = html.replace("mno"+space, "Manobo-Sprachen"+space);
    html = html.replace("moh"+space, "Mohawk-Sprache"+space);
    html = html.replace("mon"+space, "Mongolisch"+space);
    html = html.replace("mos"+space, "Mossi-Sprache"+space);
    html = html.replace("mri"+space, "Maori-Sprache"+space);
    html = html.replace("msa"+space, "Malaiisch"+space);
    html = html.replace("mul"+space, "Mehrere-Sprachen"+space);
    html = html.replace("mun"+space, "Mundasprachen"+space);
    html = html.replace("mus"+space, "Muskogisch"+space);
    html = html.replace("mwl"+space, "Mirandesisch"+space);
    html = html.replace("mwr"+space, "Marwari"+space);
    html = html.replace("mya"+space, "Birmanisch"+space);
    html = html.replace("myn"+space, "Maya-Sprachen"+space);
    html = html.replace("myv"+space, "Erza-Mordwinisch"+space);
    html = html.replace("nah"+space, "Nahuatl"+space);
    html = html.replace("nai"+space, "Nordamerika"+space);
    html = html.replace("nap"+space, "Mundart"+space);
    html = html.replace("nau"+space, "Nauruanisch"+space);
    html = html.replace("nav"+space, "Navajo-Sprache"+space);
    html = html.replace("nbl"+space, "(Transvaal)"+space);
    html = html.replace("nde"+space, "(Simbabwe)"+space);
    html = html.replace("ndo"+space, "Ndonga"+space);
    html = html.replace("nds"+space, "Niederdeutsch"+space);
    html = html.replace("nep"+space, "Nepali"+space);
    html = html.replace("new"+space, "Newari"+space);
    html = html.replace("nia"+space, "Nias-Sprache"+space);
    html = html.replace("nic"+space, "Nigerkordofanische-Sprachen"+space);
    html = html.replace("niu"+space, "Niue-Sprache"+space);
    html = html.replace("nld"+space, "Niederländisch"+space);
    html = html.replace("nno"+space, "Nynorsk"+space);
    html = html.replace("nob"+space, "Bokmål"+space);
    html = html.replace("nog"+space, "Nogaisch"+space);
    html = html.replace("non"+space, "Altnorwegisch"+space);
    html = html.replace("nor"+space, "Norwegisch"+space);
    html = html.replace("nqo"+space, "N'Ko"+space);
    html = html.replace("nso"+space, "Pedi-Sprache"+space);
    html = html.replace("nub"+space, "Nubische-Sprachen"+space);
    html = html.replace("nwc"+space, "Alt-Newari"+space);
    html = html.replace("nya"+space, "Nyanja-Sprache"+space);
    html = html.replace("nym"+space, "Nyamwezi-Sprache"+space);
    html = html.replace("nyn"+space, "Nkole-Sprache"+space);
    html = html.replace("nyo"+space, "Nyoro-Sprache"+space);
    html = html.replace("nzi"+space, "Nzima-Sprache"+space);
    html = html.replace("oci"+space, "Okzitanisch"+space);
    html = html.replace("oji"+space, "Ojibwa-Sprache"+space);
    html = html.replace("ori"+space, "Oriya-Sprache"+space);
    html = html.replace("orm"+space, "Galla-Sprache"+space);
    html = html.replace("osa"+space, "Osage-Sprache"+space);
    html = html.replace("oss"+space, "Ossetisch"+space);
    html = html.replace("ota"+space, "Osmanisch"+space);
    html = html.replace("oto"+space, "Otomangue-Sprachen"+space);
    html = html.replace("paa"+space, "Papuasprachen"+space);
    html = html.replace("pag"+space, "Pangasinan-Sprache"+space);
    html = html.replace("pal"+space, "Mittelpersisch"+space);
    html = html.replace("pam"+space, "Pampanggan-Sprache"+space);
    html = html.replace("pan"+space, "Pandschabi-Sprache"+space);
    html = html.replace("pap"+space, "Papiamento"+space);
    html = html.replace("pau"+space, "Palau-Sprache"+space);
    html = html.replace("peo"+space, "Altpersisch"+space);
    html = html.replace("fas"+space, "Persisch"+space);
    html = html.replace("phi"+space, "Philippinisch-Austronesisch"+space);
    html = html.replace("phn"+space, "Phönikisch"+space);
    html = html.replace("pli"+space, "Pali"+space);
    html = html.replace("pol"+space, "Polnisch"+space);
    html = html.replace("pon"+space, "Ponapeanisch"+space);
    html = html.replace("por"+space, "Portugiesisch"+space);
    html = html.replace("pra"+space, "Prakrit"+space);
    html = html.replace("pro"+space, "Altokzitanisch"+space);
    html = html.replace("pus"+space, "Paschtu"+space);
    html = html.replace("qaa-qtz"+space, "Verwendung"+space);
    html = html.replace("que"+space, "Quechua-Sprache"+space);
    html = html.replace("raj"+space, "Rajasthani"+space);
    html = html.replace("rap"+space, "Osterinsel-Sprache"+space);
    html = html.replace("rar"+space, "Rarotonganisch"+space);
    html = html.replace("roa"+space, "Romanische-Sprachen"+space);
    html = html.replace("roh"+space, "Rätoromanisch"+space);
    html = html.replace("rom"+space, "(Sprache)"+space);
    html = html.replace("ron"+space, "Rumänisch"+space);
    html = html.replace("ron"+space, "Rumänisch"+space);
    html = html.replace("run"+space, "Rundi-Sprache"+space);
    html = html.replace("rup"+space, "Aromunisch"+space);
    html = html.replace("rus"+space, "Russisch"+space);
    html = html.replace("sad"+space, "Sandawe-Sprache"+space);
    html = html.replace("sag"+space, "Sango-Sprache"+space);
    html = html.replace("sah"+space, "Jakutisch"+space);
    html = html.replace("sai"+space, "Südamerika"+space);
    html = html.replace("sal"+space, "Salish-Sprache"+space);
    html = html.replace("sam"+space, "Samaritanisch"+space);
    html = html.replace("san"+space, "Sanskrit"+space);
    html = html.replace("sas"+space, "Sasak"+space);
    html = html.replace("sat"+space, "Santali"+space);
    html = html.replace("scn"+space, "Sizilianisch"+space);
    html = html.replace("sco"+space, "Schottisch"+space);
    html = html.replace("sel"+space, "Selkupisch"+space);
    html = html.replace("sem"+space, "Semitische-Sprachen"+space);
    html = html.replace("sga"+space, "Altirisch"+space);
    html = html.replace("sgn"+space, "Zeichensprachen"+space);
    html = html.replace("shn"+space, "Schan-Sprache"+space);
    html = html.replace("sid"+space, "Sidamo-Sprache"+space);
    html = html.replace("sin"+space, "Singhalesisch"+space);
    html = html.replace("sio"+space, "Sioux-Sprachen"+space);
    html = html.replace("sit"+space, "Sinotibetische-Sprachen"+space);
    html = html.replace("sla"+space, "Slawische-Sprachen"+space);
    html = html.replace("slk"+space, "Slowakisch"+space);
    html = html.replace("slk"+space, "Slowakisch"+space);
    html = html.replace("slv"+space, "Slowenisch"+space);
    html = html.replace("sma"+space, "Südsaamisch"+space);
    html = html.replace("sme"+space, "Nordsaamisch"+space);
    html = html.replace("smi"+space, "Saamisch"+space);
    html = html.replace("smj"+space, "Lulesaamisch"+space);
    html = html.replace("smn"+space, "Inarisaamisch"+space);
    html = html.replace("smo"+space, "Samoanisch"+space);
    html = html.replace("sms"+space, "Skoltsaamisch"+space);
    html = html.replace("sna"+space, "Schona-Sprache"+space);
    html = html.replace("snd"+space, "Sindhi-Sprache"+space);
    html = html.replace("snk"+space, "Soninke-Sprache"+space);
    html = html.replace("sog"+space, "Sogdisch"+space);
    html = html.replace("som"+space, "Somali"+space);
    html = html.replace("son"+space, "Songhai-Sprache"+space);
    html = html.replace("sot"+space, "Süd-Sotho-Sprache"+space);
    html = html.replace("spa"+space, "Spanisch"+space);
    html = html.replace("sqi"+space, "Albanisch"+space);
    html = html.replace("srd"+space, "Sardisch"+space);
    html = html.replace("srn"+space, "Sranantongo"+space);
    html = html.replace("srp"+space, "Serbisch"+space);
    html = html.replace("srr"+space, "Serer-Sprache"+space);
    html = html.replace("ssa"+space, "Nilosaharanische-Sprachen"+space);
    html = html.replace("ssw"+space, "Swasi-Sprache"+space);
    html = html.replace("suk"+space, "Sukuma-Sprache"+space);
    html = html.replace("sun"+space, "Sundanesisch"+space);
    html = html.replace("sus"+space, "Susu"+space);
    html = html.replace("sux"+space, "Sumerisch"+space);
    html = html.replace("swa"+space, "Swahili"+space);
    html = html.replace("swe"+space, "Schwedisch"+space);
    html = html.replace("syc"+space, "Syrisch"+space);
    html = html.replace("syr"+space, "Neuostaramäisch"+space);
    html = html.replace("tah"+space, "Tahitisch"+space);
    html = html.replace("tai"+space, "Thaisprachen"+space);
    html = html.replace("tam"+space, "Tamil"+space);
    html = html.replace("tat"+space, "Tatarisch"+space);
    html = html.replace("tel"+space, "Telugu-Sprache"+space);
    html = html.replace("tem"+space, "Temne-Sprache"+space);
    html = html.replace("ter"+space, "Tereno-Sprache"+space);
    html = html.replace("tet"+space, "Tetum-Sprache"+space);
    html = html.replace("tgk"+space, "Tadschikisch"+space);
    html = html.replace("tgl"+space, "Tagalog"+space);
    html = html.replace("tha"+space, "Thailändisch"+space);
    html = html.replace("bod"+space, "Tibetisch"+space);
    html = html.replace("tig"+space, "Tigre-Sprache"+space);
    html = html.replace("tir"+space, "Tigrinja-Sprache"+space);
    html = html.replace("tiv"+space, "Tiv-Sprache"+space);
    html = html.replace("tkl"+space, "Tokelauanisch"+space);
    html = html.replace("tlh"+space, "Klingonisch"+space);
    html = html.replace("tli"+space, "Tlingit-Sprache"+space);
    html = html.replace("tmh"+space, "Tamašeq"+space);
    html = html.replace("tog"+space, "Sambia)"+space);
    html = html.replace("ton"+space, "Tongaisch"+space);
    html = html.replace("tpi"+space, "Neumelanesisch"+space);
    html = html.replace("tsi"+space, "Tsimshian-Sprache"+space);
    html = html.replace("tsn"+space, "Tswana-Sprache"+space);
    html = html.replace("tso"+space, "Tsonga-Sprache"+space);
    html = html.replace("tuk"+space, "Turkmenisch"+space);
    html = html.replace("tum"+space, "Tumbuka-Sprache"+space);
    html = html.replace("tup"+space, "Tupi-Sprache"+space);
    html = html.replace("tur"+space, "Türkisch"+space);
    html = html.replace("tut"+space, "Altaische-Sprachen"+space);
    html = html.replace("tvl"+space, "Elliceanisch"+space);
    html = html.replace("twi"+space, "Twi-Sprache"+space);
    html = html.replace("tyv"+space, "Tuwinisch"+space);
    html = html.replace("udm"+space, "Udmurtisch"+space);
    html = html.replace("uga"+space, "Ugaritisch"+space);
    html = html.replace("uig"+space, "Uigurisch"+space);
    html = html.replace("ukr"+space, "Ukrainisch"+space);
    html = html.replace("umb"+space, "Mbundu-Sprache"+space);
    html = html.replace("und"+space, "entscheiden"+space);
    html = html.replace("urd"+space, "Urdu"+space);
    html = html.replace("uzb"+space, "Usbekisch"+space);
    html = html.replace("vai"+space, "Vai-Sprache"+space);
    html = html.replace("ven"+space, "Venda-Sprache"+space);
    html = html.replace("vie"+space, "Vietnamesisch"+space);
    html = html.replace("vol"+space, "Volapük"+space);
    html = html.replace("vot"+space, "Wotisch"+space);
    html = html.replace("wak"+space, "Wakash-Sprachen"+space);
    html = html.replace("wal"+space, "Walamo-Sprache"+space);
    html = html.replace("war"+space, "Waray"+space);
    html = html.replace("was"+space, "Washo-Sprache"+space);
    html = html.replace("cym"+space, "Kymrisch"+space);
    html = html.replace("wen"+space, "Sorbisch"+space);
    html = html.replace("wln"+space, "Wallonisch"+space);
    html = html.replace("wol"+space, "Wolof-Sprache"+space);
    html = html.replace("xal"+space, "Kalmückisch"+space);
    html = html.replace("xho"+space, "Xhosa-Sprache"+space);
    html = html.replace("yao"+space, "(Bantusprache)"+space);
    html = html.replace("yap"+space, "Yapesisch"+space);
    html = html.replace("yid"+space, "Jiddisch"+space);
    html = html.replace("yor"+space, "Yoruba-Sprache"+space);
    html = html.replace("ypk"+space, "Ypik-Sprachen"+space);
    html = html.replace("zap"+space, "Zapotekisch"+space);
    html = html.replace("zbl"+space, "Bliss-Symbol"+space);
    html = html.replace("zen"+space, "Zenaga"+space);
    html = html.replace("zha"+space, "Zhuang"+space);
    html = html.replace("zho"+space, "Chinesisch"+space);
    html = html.replace("znd"+space, "Zande-Sprachen"+space);
    html = html.replace("zul"+space, "Zulu-Sprache"+space);
    html = html.replace("zun"+space, "Zuñi-Sprache"+space);
    html = html.replace("zxx"+space, "Inhalt"+space);
    html = html.replace("zza"+space, "Zazaki"+space);

    return html;
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
    var button = $('ol.subentry').parent('li').find('.show-volumes');
    button.show();
    button.on("click", function (evt) {
        evt.preventDefault();
        $(this).children('a').toggleClass('show-volumes-minimize');
        $(this).children('a').toggleClass('show-volumes-expand');
        $(this).siblings('ol.subentry').toggle();
    });

    var pagingForm = $('#pagingForm');
    $('.tx-dlf-listview').append(pagingForm.html());
    pagingForm.hide();

}

/* Kitodo Presentation Detail Breadcrumb */
function enrichBreadcrumbForVolumes() {
    if ($('dt#PartOf').next('dd').data('partof') > 0) {

        var partOfLink = 'detail.html?tx_dlf[id]=' + $('dt#PartOf').next('dd').data('partof');
        $('dt#PartOf').next('dd').children('a.partOf').attr('href', partOfLink);

        var parentVolumeLink = $('.partOf').attr('href');
        var breadcrumbHtml = '';
        $('.breadcrumb').children().each(function () {
            breadcrumbHtml += this.outerHTML + '<span> / </span>';
        });
        $('.breadcrumb').html('');
        $('.breadcrumb').append(breadcrumbHtml);
        $('.breadcrumb').append('<a href="' + partOfLink + '" class="fade">Bandliste</a>');
        $('.breadcrumb').append('<span> / </span>');
        $('.breadcrumb').append('<span>Detail</span>');
    } else {
        $('dt#PartOf').hide().next('dd').hide();
    }
}

function setBackToListviewInBreadcrumb() {
    $('#backtolistview').attr("href", $('li.tx-dlf-navigation-backtolist a').attr("href"));

}

function setTitleOnDetailPage() {
    var title = '';
    title = $('dd.tx-dlf-title').text();

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
    $('.tx-dlf-navigation .tx-dlf-navigation-prev a, .tx-dlf-navigation .tx-dlf-navigation-prev span')
        .text("")
        .append('<img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-arrow-left.svg" alt="Previous Page">');

    $('.tx-dlf-navigation .tx-dlf-navigation-next span, .tx-dlf-navigation .tx-dlf-navigation-next a')
        .text("")
        .append('<img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-arrow-right.svg" alt="Next Page">');

    $('.tx-dlf-navigation .tx-dlf-navigation-zoom-in span, .tx-dlf-navigation .tx-dlf-navigation-zoom-in a')
        .text("")
        .append('<img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-zoomin.svg" alt="Zoom in">');

    $('.tx-dlf-navigation .tx-dlf-navigation-zoom-out span, .tx-dlf-navigation .tx-dlf-navigation-zoom-out a')
        .text("")
        .append('<img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-zoomout.svg" alt="Zoom out">');

    $('.tx-dlf-navigation .tx-dlf-navigation-rotate-left span, .tx-dlf-navigation .tx-dlf-navigation-rotate-left a')
        .text("")
        .append('<img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-rotateleft.svg" alt="Rotate left">');

    $('.tx-dlf-navigation .tx-dlf-navigation-rotate-right span, .tx-dlf-navigation .tx-dlf-navigation-rotate-right a')
        .text("")
        .append('<img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-rotateright.svg" alt="Rotate right">');

    $('.tx-dlf-navigation .tx-dlf-navigation-double span, .tx-dlf-navigation .tx-dlf-navigation-double a')
        .text("")
        .append('<img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-doublepage.svg" alt="Show double pages">');

    $('ul.tx-dlf-navigation')
        .append('<li><a id="collapse" class="collexpand" href="#"><img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-arrow-bigger.svg" alt="Größer"></a></li>');

    $('ul.tx-dlf-navigation')
        .append('<li><a id="expand" class="collexpand" href="#"><img src="/typo3conf/ext/subhh_website/Resources/Public/img/icon-arrow-smaller.svg" alt="Kleiner"></a></li>');

    $(".tx-dlf-navigation-zoom-in").click(function(event) {
        event.preventDefault();
        tx_dlf_viewer.map.zoomIn();
    });
    $(".tx-dlf-navigation-zoom-out").click(function(event) {
        event.preventDefault();
        tx_dlf_viewer.map.zoomOut();
    });

    $(".tx-dlf-navigation-rotate-right a").click(function (event) {
        event.preventDefault();
        tx_dlf_viewer.map.rotate(90);
    });
    $(".tx-dlf-navigation-rotate-left a").click(function (event) {
        event.preventDefault();
        tx_dlf_viewer.map.rotate(-90);
    });

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
    $('dd.tx-dlf-type').each(function () {
        if ($(this).text() == 'Zeitung') {
            var url = $($(this).siblings('dd.tx-dlf-title')[0]).children().prop('href').replace('detail-zeitungen', 'kalender-zeitungen');
            $(this).siblings('dd.tx-dlf-title').children().prop('href', url);
        }
    });
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
