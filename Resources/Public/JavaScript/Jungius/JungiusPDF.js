// PDF Generator
$(document).ready(function() {

    // disable download button
    $('#pdfDownload').removeClass('button_red').addClass('button_grey');

    // renders pdf list
    renderPdfList();

    // keep document in mind for later download
    $("#pdfList").click(function() {
        $("#documentPDFList").show();
        // get PURL
        var PPN = $("#purl").text();

        var re = /sub.uni-hamburg.de\/goobi\/(.*)/;
        var m;

        if ((m = re.exec(PPN)) !== null) {
            if (m.index === re.lastIndex) {
                re.lastIndex++;
            }
            // View your result using the m-variable.
            // eg m[0] etc.
            PPN = m[1];
        }

        //get image
        var imageSrc = tx_dlf_viewer.imageUrls[0].url;
        var length = imageSrc.length;
        var imageUrl = imageSrc.substr((length - 12),12);

        // get cookie array
        var documentArray = [];
        documentArray.push(PPN+'/'+imageUrl);

        // save in cookie for later use
        var cookieArray = Cookies.getJSON("pdfArray");

        if (typeof cookieArray != "undefined") {
            if (cookieArray.length > 0) {
                cookieArray[cookieArray.length] = PPN+'/'+imageUrl;
            }
        }

        var cookieLength = 0;
        if (typeof cookieArray != "undefined" ) {
            cookieLength = cookieArray.length;
        }

        if(typeof cookieArray == "undefined" || cookieLength === 0){
            Cookies.set("pdfArray", documentArray, { path: '/' });
            renderPdfList();
        } else {
            cookieArray = unique(cookieArray);

            Cookies.set("pdfArray", cookieArray, { path: '/' });

            // update pdf list
            removePdfList();
            renderPdfList();
        }
        return false;
    });

    // Download Button for all documents in list
    $("#pdfDownload").click(function() {
        // download all parts
        if(Cookies.getJSON("pdfArray")) {
            var pdfArray = Cookies.getJSON("pdfArray");
            var pdfUrl = '';
            var length = pdfArray.length;
            for (var i = 0; i < length; i++) {
                if (pdfArray[i] != ''){
                    pdfUrl = pdfUrl + pdfArray[i]+'$';
                }
            }
            if(pdfArray == "$"){

            } else {
                $('#p_nutzungsbedingungen_kapitel').show();
                // http://gcs.sub.uni-hamburg.de/gcs?action=pdf&pagesize=original&metsFile=PPN734636776&divID=LOG_0002
                $('#pdfdownloader_kapitel').attr('href', 'http://pdf.sub.uni-hamburg.de/gcs/cs?action=pdf&pagesize=original&images='+pdfUrl);
                event.preventDefault();
            }
        }
    });
});

function removePdfList() {
    // removes list entries only so
    // cookie still contains the entries
    $("#documentPDFList").children().remove();
}

function renderPdfList() {
    // show saved documents
    if(typeof Cookies.getJSON("pdfArray") !== "undefined") {
        var elements = Cookies.getJSON("pdfArray");
    } else {
        var elements = "undefined";
    }

    if(elements != "undefined") {
        var entries = Cookies.getJSON("pdfArray");
        var lengthEntries = entries.length;
        for (var i = 0; i < lengthEntries; i++) {
            if(entries[i] != "") {
                $("#documentPDFList").append('<li>'+ entries[i] +' <a id="removeElement_'+i+'" class="'+i+'" href="#remove">X</a></li>');

                // delete click
                $("#removeElement_"+i).click(function(e) {
                    e.preventDefault();
                    var delKey = $(this).attr("class");
                    $(this).parent().remove();
                    var cookieArray = Cookies.getJSON("pdfArray");

                    cookieArray.splice(delKey, 1);
                    Cookies.set("pdfArray", cookieArray, { path: '/' });

                    if (cookieArray.length == 0) {
                        $('#pdfDownload').removeClass('button_red').addClass('button_grey');
                    }

                    removePdfList();
                    renderPdfList();
                });

                // activate download button
                $('#pdfDownload').removeClass('button_grey').addClass('button_red');
            }
        }
        $("#documentPDFList").show();
    }

}

// called inline
function clearPDFList() {
    $("#documentPDFList").children().remove();
    Cookies.set("pdfArray", "", { path: '/' });
    $('#pdfDownload').removeClass('button_red').addClass('button_grey');
}

function unique(array) {
    return $.grep(array, function(el, index) {
        return index == $.inArray(el, array);
    });
}
