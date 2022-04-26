function getSiteID(){

    var hostname = window.location.hostname;
    
    switch (hostname) {
      case 'www.sub.uni-hamburg.de':
        return '171';
        
        break;
      case 'digitalisate.sub.uni-hamburg.de':
        return '236';
        
        break;
/*
      case 'spezialkataloge.sub.uni-hamburg.de':
        return '237';
        
        break;
      case 'jungius.sub.uni-hamburg.de':
        return '238';
      
        break;
      case 'fachwelt.sub.uni-hamburg.de':
        return '239';
      
        break;*/
      case 'digitalisate-dev.sub.uni-hamburg.de':
        return '240';
      
        break;

      case 'borchert.sub.uni-hamburg.de':
	return '262';

	break;

      default:
        return false;
        
        break;
    }
}

function getMatomoCookie() {
    let result = document.cookie.match("(^|[^;]+)\\s*" + 'enablecookies' + "\\s*=\\s*([^;]+)");
    return result ? result.pop() : false

}

$(document).ready(function() {
var _paq = window._paq = window._paq || [];
_paq.push(['disableCookies']);

/* tracker methods like "setCustomDimension" should be called before "trackPageView" */

/*_paq.push(['setCustomVariable', 1, 'printAll', 'PPN', 'page']);
_paq.push(['setCustomVariable', 2, 'Users login', 'Eduard Trayan', 'page']);

_paq.push(['setCustomDimension', customDimensionId = 1, customDimensionValue = 'Member']);*/


//list view
if($('.tx-dlf-listview').length > 0){ //recherche

        //check 1: no paging
        //check 2: no facets
	if( ((location.origin + location.pathname) == document.URL) && ($(".tx-dlf-icon-cur").length > 0) ){

    		_paq.push(['trackEvent', 'COUNTER5', 'Searches_Platform', 'recherche']);
	}

}

//list view - end

//detail view

if($('.tx-dlf-pageview').length > 0){

 setTotalItemRequests();

}


//detail view - end


_paq.push(['trackAllContentImpressions']);
_paq.push(['enableLinkTracking']);
_paq.push(['trackPageView']);

_paq.push(['trackAllContentImpressions']);
(function() {
  var u="https://matomo.uni-hamburg.de/";
  _paq.push(['setTrackerUrl', u+'matomo.php']);

  //_paq.push(['setSiteId', '240']);
  _paq.push(['setSiteId', getSiteID()]);


  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();


});
