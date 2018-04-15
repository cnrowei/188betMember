/// <reference path="../Lib/Jquery/jquery-1.9.1-vsdoc.js" />

var BrowserDetection = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser);
        this.version = this.searchVersion(navigator.userAgent);
        // alert(navigator.userAgent);
        var tridentCheck = navigator.userAgent.indexOf("Trident");
        if (this.browser == "IE") {
            if (this.version <= 7 && tridentCheck == -1) {
                if (this.readCookie() == false) {
                    this.writeNotice();
                    var el = this;
                    $('#browser-detection-close').on('click', function () {
                        el.writeCookie();
                        $('#old-browser').animate({ top: "-255px" }, 500, function () {
                            $('#old-browser').hide().remove();
                        });
                        $("body").css("marginTop", "0px");
                    });
                }
            }
        }
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "IE",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        }
    ],
    writeNotice: function () {
        var title = '';
        var notice = '';
        var upgrade = '';

        l.browserUpgrade = l.browserUpgrade.replace("{lang}", global.lan);
        title = l.browserUpgradeHeader.replace("{lang}", global.lan);
        notice = l.browserUpgradeWarning.replace("{lang}", global.lan);
        upgrade = l.browserUpgradeButton.replace("{lang}", global.lan);

        var code = '<div class="top-warning v-box" id="old-browser" style="top: 0px;">';
        code += ' <div id=browser-detection class=v-content><table class="v-content-txt">';
        code += ' <tr><td class="v-box-col1"><span class=v-title>' + title + '</span><span class=v-desc>' + notice + '</span>';
        code += '</td><td class="v-box-col2"><span class=rc-left><span class=rc-right><a class=v-btn-text href="http://windows.microsoft.com/en-us/internet-explorer/downloads/ie-8" target=_blank><span class="v-icon v-ie">&nbsp;</span>' + upgrade + '</a></span></span>';
        code += '</td></tr></table><div class="clear-b"></div></div>';
        code += '<span class="v-icon v-close"><a id=browser-detection-close href="#" >&nbsp;&nbsp;&nbsp;</a></span> </div>';

        //    var code =  '<div class="top-warning v-box" id="old-browser" style="top: 0px;">';
        //  code +='<div id="browser-detection" class="v-content">';
        //  code += '<div class="v-content-txt"><span class="v-title">' + title + '</span><span class="v-desc">' + notice + '</span>';
        //  code += '</div> <span class="rc-left"><span class="rc-right"><a class="v-btn-text" href="http://windows.microsoft.com/en-us/internet-explorer/downloads/ie-8" target="_blank"><span class="v-icon v-ie">&nbsp;</span>' + upgrade + '</a></span></span>';
        //  code +='<div class="clear-b"></div></div><span class="v-icon v-close"><a id="browser-detection-close" href="#">&nbsp;&nbsp;&nbsp;</a></span> </div>';
        $("body").prepend(code);
        $("body").css("marginTop", "55px");
        $('#old-browser').css('top', '0px');
    },
    writeCookie: function () {
        var expiration = "";
        var date = new Date();
        date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
        expiration = '; expires=' + date.toGMTString();

        document.cookie = 'BUExpire=1' + expiration + '; path=/';
    },
    readCookie: function () {
        if (!document.cookie) { return ''; }

        var searchName = 'BUExpire=1';
        var data = document.cookie.split(';');

        for (var i = 0; i < data.length; i++) {
            while (data[i].charAt(0) == ' ') {
                data[i] = data[i].substring(1, data[i].length);
            }

            if (data[i].indexOf(searchName) == 0) {
                return true;
            }
        }

        return false;
    }
}
