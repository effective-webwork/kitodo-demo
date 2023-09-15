function getSiteID(){

  var hostname = window.location.hostname;
  
  switch (hostname) {

    case 'digitalisate.sub.uni-hamburg.de':
      return '236';
      break;

    case 'jungius.sub.uni-hamburg.de':
      return '238';
      break;
    
    case 'zeitungen.sub.uni-hamburg.de':
      return '280';
      break;

    case 'digitalisate-dev.sub.uni-hamburg.de':
      return '240';
      break;

    case 'jungius-dev.sub.uni-hamburg.de':
      return '240';
      break;
    
    case 'zeitungen-dev.sub.uni-hamburg.de':
      return '240';
      break;

    default:
      return false;
      break;
  }
}

// list of all collections, that need some level of usage statistics
var collection_list = [

  /*
  Hamburger Kulturgut Digital
  */

  // Bücher
  "Historische Drucke: bis 1530",
  "Historische Drucke: 1531 bis 1600",
  "Historische Drucke: 1601 bis 1700",
  "Historische Drucke: 1701 bis 1800",
  "Historische Drucke: 1801 bis 1900",
  "Historische Drucke: 1901 bis 1950",
  "Drucke ab 1951",
  "Hamburgensien: Darstellungen und Nachschlagewerke",
  "Linga-Bibliothek für Lateinamerika-Forschung",

  // Periodika
  "Hamburgensien: Zeitschriften",
  "Hamburgensien: Parlamentaria",
  "Hamburgensien: Historische Statistik",

  // Zeitugnen
  // -leer-

  // Karten
  "Historische Karten",
  "Historische Ansichten",

  // Bildmaterial
  "Kupferstichsammlung",
  "Aus Nachlass Fritz Schumacher",
  "Aus Nachlass Gustav Oelsner",
  "Historische Ansichten",
  "Portraitsammlung",

  // Musikalien
  "Musikdruck",
  "Musikhandschrift",
  "Händels Direktionspartituren",
  "Opernlibretti der Hamburger Gänsemarktoper",

  // Nachlassmaterial
  "Aus Nachlass Fritz Schumacher",
  "Aus Nachlass Gustav Oelsner",
  "Aus Nachlass Gustav Schiefler",
  "Aus Nachlass Richard Dehmel",
  "Aus Nachlass Werner von Melle",
  "Aus Nachlass Wolfgang Borchert",
  "Aus Nachlass Karl Lorenz",
  "Brahms-Archiv",

  // Handschriften
  "Abendländische Handschriften",
  "Außereuropäische Handschriften",
  "Hebräische Handschriften",
  "Papyri",
  "Stammbücher",
  "Koptische Fragmente Makarios Kloster",
  "Koptische Fragmente Pischoi Kloster",
  "Handschriften aus St. Katharinen",

  // Hamburgensien
  "Hamburgensien: Darstellungen und Nachschlagewerke",
  "Hamburgensien: Nachlassmaterialien",
  "Hamburgensien: Ansichten",
  "Hamburgensien: Portraits",
  "Hamburgensien: Karten",
  "Hamburgensien: Historische Statistik",
  "Hamburgensien: Parlamentaria",
  "Hamburgensien: Zeitschriften",
  "Hamburgensien: Musikalien",
  "Brahms-Archiv",
  "Handschriften aus St. Katharinen",
  "Veröffentlichungen des Vereins für Hamburgische Geschichte",

  // Historische Bestandskataloge
  "Historische Bestandskataloge",

  // Digitalisate aus anderen Hamburger Sammlungen
  "Altonaer Museum - Bibliothek",
  "Archäologisches Museum Hamburg und Stadtmuseum Harburg - Bibliothek",
  "Asien-Afrika-Institut der Universität Hamburg - Bibliothek",
  "Behörde für Gesundheit und Verbraucherschutz - Bibliothek Gesundheit",
  "Bibliotheks- und Informationsservice (BIS) für Erdsystemforschung",
  "Fachbereichsbibliothek Biologie der Universität Hamburg",
  "Fachbereichsbibliothek Kulturwissenschaften der Universität Hamburg",
  "Forschungsstelle für Zeitgeschichte in Hamburg (FZH) - Bibliothek",
  "Hamburg Port Authority - Bibliothek",
  "Hamburger Bibliothek für Universitätsgeschichte",
  "Hamburger Kunsthalle - Bibliothek",
  "Hamburger Lehrerbibliothek",
  "Hochschule für Bildende Künste - Bibliothek",
  "Institut für die Geschichte der deutschen Juden - Bibliothek",
  "Institut für Geographie der Universität Hamburg - Bibliothek",
  "Institut für Hygiene und Umwelt - Bibliothek",
  "KZ-Gedenkstätte Neuengamme - Bibliothek",
  "Linga-Bibliothek für Lateinamerika-Forschung",
  "Museum am Rothenbaum, Kulturen und Künste der Welt (MARKK)",
  "Museum der Arbeit - Bibliothek",
  "Museum für Hamburgische Geschichte - Bibliothek",
  "Museum für Kunst und Gewerbe - Gerd Bucerius Bibliothek",
  "Theologische Bibliothek der Universität Hamburg - Fachbereich Evangelische Theologie und Institut für Katholische Theologie",

  /*
  Aus Nachlass Joachim Jungius
  */

  "Nachlass Joachim Jungius",

  /*
  Hamburger Zeitungen Digital
  */

  // -(noch) keine Kollektionen vorhanden-

];

function getMatomoCookie() {
  let result = document.cookie.match("(^|[^;]+)\\s*" + 'enablecookies' + "\\s*=\\s*([^;]+)");

  return result ? result.pop() : false
}

// mk-sub-hh 2023-08-04
// extract indicators from an url in order to be used for event tracking conditions
function getMatomoEventTrackingIndicators(url) {
  result = {};

  // sanitize url if empty string
  url = url || "http://sub.uni-hamburg.de";
  // remove #showResults anchor if added by sorting form
  url = url.replace('#showResults', '');
  // split url for hostname + pathname extraction
  result['url'] = url.split('?', 1)[0];

  // create URL search parameters object for parameter extraction
  url_obj = new URL(url);
  params = new URLSearchParams(url_obj.search);

  // extract search query (any) or default to "*" if emtpy
  query = params.get('tx_dlf_listview[searchParameter][query]');
  result['query'] = query || "*";

  // extract fulltext-search (0 or 1) flag or default to -1 if empty
  fulltext = params.get('tx_dlf_listview[searchParameter][fulltext]');
  result['fulltext'] = fulltext || -1;

  // extract datefrom (YYYY-MM-DD) or default to 0 if empty
  datefrom = params.get('tx_dlf_listview[searchParameter][dateFrom]');
  result['datefrom'] = datefrom || 0;

  // exract dateto (YYYY-MM-DD or NOW) or default to 0 if empty
  dateto = params.get('tx_dlf_listview[searchParameter][dateTo]');
  result['dateto'] = dateto || 0;

  // extract the current document id or default to 0 if empty
  id = params.get('tx_dlf[id]');
  result['id'] = id || 0;

  // extract the current collection or default to 0 if emtpy
  collection = params.get('tx_dlf_listview[searchParameter][collection]');
  result['collection'] = collection || 0;

  return result;
}

$(document).ready(function() {

  var _paq = window._paq = window._paq || [];
  _paq.push(['disableCookies']);

  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */

  /*
  _paq.push(['setCustomVariable', 1, 'printAll', 'PPN', 'page']);
  _paq.push(['setCustomVariable', 2, 'Users login', 'Eduard Trayan', 'page']);
  _paq.push(['setCustomDimension', customDimensionId = 1, customDimensionValue = 'Member']);
  */

  _paq.push(['trackAllContentImpressions']);
  _paq.push(['enableLinkTracking']);
  //_paq.push(['trackPageView']); // mk-sub-hh 2023-08-04 - do no track pageview, if it is a dynamic page

  (function() {
    var u="https://matomo.uni-hamburg.de/";

    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', getSiteID()]);

    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; 
    g.async=true; 
    g.src=u+'matomo.js';
    s.parentNode.insertBefore(g,s);
  })();

  // mk-sub-hh 2023-08-04
  // matomo event tracking

  // determine if there is a listview or pageview
  is_listview = $('.tx-dlf-listview').length;
  is_pageview = $('#tx-dlf-map').length;

  // enable trackPageView on static and quasi-static pages
  if (!is_listview && !is_pageview) {
    _paq.push(['trackPageView']);
  }

  // get the indicators for event tracking conditions
  referrer_page = getMatomoEventTrackingIndicators(document.referrer);
  current_page = getMatomoEventTrackingIndicators(document.location.href);

  // check for listview
  if(is_listview) {
    // check if listview was called from a different page - this includes links, bookmarks and direct visits
    // also check if it was not called from a child via breadcrumb
    if(
      referrer_page.url != current_page.url && 
        (
          !referrer_page.url.includes('/detail') &&
          !referrer_page.url.includes('/kalender') && 
          !referrer_page.url.includes('/startseite-joachim-jungius')
        )
      ) {
      //alert("Neue Suche erkannt! -> Searches_Platform");
      _paq.push(['trackEvent', 'COUNTER5', 'Searches_Platform', 'Recherche']);
      // check if a collection was called and track the page view if so
      if(current_page.collection > 0) {
        _paq.push(['trackPageView']);
      }
    }
    // if it was called from the same page check if the search parameters have changed
    else if (
      referrer_page.fulltext != current_page.fulltext   || 
      referrer_page.query    != current_page.query      || 
      referrer_page.datefrom != current_page.datefrom   ||
      referrer_page.dateto   != current_page.dateto
      ) {
      //alert("Neue Suche erkannt! -> Searches_Platform");
      _paq.push(['trackEvent', 'COUNTER5', 'Searches_Platform', 'Recherche']);
    }
  }

  // check for pageview
  if(is_pageview) {
    is_orphan = $('.tx-dlf-metadata-out_of_print').length;

    // check if pageview was called from a different page - this includes links, bookmarks and direct visits
    if(referrer_page.url != current_page.url || (referrer_page.url == current_page.url && referrer_page.id != current_page.id)) {
      //alert("Neuer Objektaufruf erkannt! -> Total_Item_Requests");
      _paq.push(['trackEvent', 'COUNTER5', 'Total_Item_Requests', 'View']);
      _paq.push(['trackEvent', 'KITODO - TOP', record_id, 'View']);
      // check if object is part of tracked HKD collections
      $('dd.tx-dlf-metadata-collection').each(function( index ) {
        let current_collection = $(this).text();
        if(collection_list.includes(current_collection)) {
          _paq.push(['trackEvent', 'KITODO - ' + current_collection, record_id, 'View']);
        }
      });
      // check if object is HZD newspaper
      if($('dd.tx-dlf-metadata-newspaper').length){
        //_paq.push(['trackEvent', 'KITODO - ' + current_collection, record_id, 'View']);
        //_paq.push(['trackEvent', 'KITODO - ' + record_id.substring(0, record_id.indexOf("_")), record_id, 'View']);
        //console.log(record_id.substring(0, record_id.indexOf("_") + 5));
        //console.log($('dd.tx-dlf-metadata-newspaper').text());
      }
      // check if object is out of print or orphan work
      if(is_orphan) {
        //alert("Vergriffenes oder verwaistes Werk erkannt!");
        // use last character in string for bucket
        _paq.push(['trackEvent', 'KITODO - VVW - ' + record_id.slice(-1), record_id, 'View']);
      }
    }
  }

});