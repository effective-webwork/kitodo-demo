Cookie = {
    get: function (name) {
        var data    = document.cookie.split(";");
        var cookies = {};
        for(var i = 0; i < data.length; ++i) {
            var tmp = data[i].split("=");
            cookies[$.trim(tmp[0])] = tmp[1];
        }

        if (name) {
            return (cookies[name] || null);
        } else {
            return cookies;
        }
    },

    set: function (name, value) {
        document.cookie = name + "=" + value;
    }
};