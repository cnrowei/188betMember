/// <reference path="../Lib/Jquery/jquery-1.9.1-vsdoc.js" />

//#region Global Variables
var KEY_UP = 38, KEY_DOWN = 40, KEY_ENTER = 13;
var KEY_A = 65, KEY_Z = 90, KEY_0 = 48, KEY_9 = 57;
var KEY_NUMPAD_0 = 96, KEY_NUMPAD_9 = 105;
var timeout = 3000;
var lastBalance;
var loginCount = 0;
var retryCount = 3;
var isReceived = false;
var sslTimer;
//#endregion

//#region String.prototype
String.prototype.startWith = function (str) { return (this.match("^" + str) == str) }
String.prototype.trim = function () { return (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "")) }
String.prototype.endWith = function (str) { return (this.match(str + "$") == str) }
//#endregion

//#region Date.prototype
//#region parseUTCDateToLocalDate
Date.prototype.parseUTCDateToLocalDate = function (date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return new Date(date.getTime() - (getTimeZoneOffset() * 60 * 1000));
}
//#endregion

//#region getTimeZoneOffset
Date.prototype.getTimeZoneOffset = function () {
    if (global.timeZoneOffset) {
        return global.timeZone;
    }
    return ((new Date).getTimezoneOffset());
}
//#endregion

//#region gettimeZone
Date.prototype.gettimeZone = function () {
    if (global && global.timeZone) {
        return global.timeZone;
    }
    return ((new Date).gettimeZone());
}
//#endregion

//#region getLocalDateTime
Date.prototype.getLocalDateTime = function (serverDate) {
    if (!(serverDate instanceof Date)) {
        serverDate = new serverDate(serverDate);
    }
    return new Date(serverDate.getTime() - ((gettimeZone() - 4) * 60 * 60 * 1000));
}
//#endregion

//#region format
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] :
             ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
//#endregion

//#region toDateString
Date.prototype.toDateString = function () {
    return this.format("yyyy/MM/dd");
}
//#endregion

//#region toDateTimeString
Date.prototype.toDateTimeString = function () {
    return this.format("yyyy/MM/dd hh:mm:ss")
}
//#endregion
//#endregion

//#region jQuery.cookie
jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
//#endregion

//#region jquery.browser.mobile
/**jQuery.browser.mobile (http://detectmobilebrowser.com/)**/
(function (a) { jQuery.browser.mobile = /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)) })(navigator.userAgent || navigator.vendor || window.opera);
//#endregion

jQuery.expr[':'].hiddenSelf = function (a) {
    return jQuery(a).is(':hidden') && jQuery(a).css('display') == 'none';
};

(function ($) {
    $.fn.extend({
        //#region blueberry
        blueberry: function (options) {

            //default values for plugin options
            var defaults = {
                interval: 5000,
                duration: 500,
                lineheight: 1,
                height: 'auto', //reserved
                hoverpause: false,
                pager: true,
                nav: true, //reserved
                keynav: true
            }

            var options = $.extend(defaults, options);

            return this.each(function () {
                var o = options;
                var obj = $(this);

                //store the slide and pager li
                var slides = $('.slides li', obj);
                var pager = $('.pager li', obj);

                //set initial current and next slide index values
                var current = 0;
                var next = current + 1;

                //get height and width of initial slide image and calculate size ratio
                var imgHeight = slides.eq(current).find('img').height();
                var imgWidth = slides.eq(current).find('img').width();
                var imgRatio = imgWidth / imgHeight;

                //define vars for setsize function
                var sliderWidth = 0;
                var cropHeight = 0;

                //hide all slides, fade in the first, add active class to first slide
                slides.hide().eq(current).fadeIn(o.duration).addClass('active');


                //build pager if it doesn't already exist and if enabled
                if (pager.length) {
                    pager.eq(current).addClass('active');
                } else if (o.pager) {
                    obj.append('<ul class="pager"></ul>');
                    slides.each(function (index) {
                        $('.pager', obj).append('<li><a href="#"><span>' + index + '</span></a></li>')
                    });
                    pager = $('.pager li', obj);
                    pager.eq(current).addClass('active');
                    obj.append('<div class="b-timer-rail"><div class="b-timer"></div></div>');
                }

                //rotate to selected slide on pager click
                if (pager) {
                    $('a', pager).click(function () {
                        //stop the timer
                        clearTimeout(obj.play);
                        //set the slide index based on pager index
                        next = $(this).parent().index();
                        //rotate the slides
                        rotate();
                        return false;
                    });
                }

                //primary function to change slides
                var rotate = function () {
                    $('.b-timer').stop().width('0');
                    //fade out current slide and remove active class,
                    //fade in next slide and add active class
                    slides.eq(current).fadeOut(o.duration).removeClass('active')
                        .end().eq(next).fadeIn(o.duration).addClass('active').queue(function () {
                            //add rotateTimer function to end of animation queue
                            //this prevents animation buildup caused by requestAnimationFrame
                            //rotateTimer starts a timer for the next rotate
                            $('.b-timer').animate({
                                width: '100%'
                            }, o.interval);
                            rotateTimer();
                            $(this).dequeue()
                        });

                    //update pager to reflect slide change
                    if (pager) {
                        pager.eq(current).removeClass('active')
                            .end().eq(next).addClass('active');
                    }

                    //update current and next vars to reflect slide change
                    //set next as first slide if current is the last
                    current = next;
                    next = current >= slides.length - 1 ? 0 : current + 1;
                };
                //create a timer to control slide rotation interval
                var rotateTimer = function () {
                    obj.play = setTimeout(function () {
                        //trigger slide rotate function at end of timer
                        rotate();
                    }, o.interval);
                };
                //start the timer for the first time
                rotateTimer();

                //pause the slider on hover
                //disabled by default due to bug
                if (o.hoverpause) {
                    slides.hover(function () {
                        //stop the timer in mousein
                        clearTimeout(obj.play);
                    }, function () {
                        //start the timer on mouseout
                        rotateTimer();
                    });
                }

                //calculate and set height based on image width/height ratio and specified line height
                var setsize = function () {
                    sliderWidth = $('.slides', obj).width();
                    cropHeight = Math.floor(((sliderWidth / imgRatio) / o.lineheight)) * o.lineheight;

                    $('.slides', obj).css({ height: cropHeight });
                };
                setsize();

                //bind setsize function to window resize event
                $(window).resize(function () {
                    setsize();
                });
                //Add keyboard navigation
                if (o.keynav) {
                    $(document).keyup(function (e) {

                        switch (e.which) {
                            case 39: case 32: //right arrow & space
                                clearTimeout(obj.play);
                                rotate();
                                break;
                            case 37: // left arrow
                                clearTimeout(obj.play);
                                next = current - 1;
                                rotate();
                                break;
                        }
                    });
                }
            });
        }
        //#endregion
    });
})(jQuery);

//#region utility
var utility = {
    securetimeout: 10000,
    templateCache: new Object()
    , stopRequest: false
    , $error: null
    , $lostConn: null

    //#region showError
    , showError: function (message) {
        // utility.stopRequest = true;
        if (utility.$error == null) {
            utility.$error = $("<a href='javascript:void(0)' id='errMsg'>" + (new Date()) + ":Error Occur:Please refresh page</a>").click(function () {
                window.location.href = window.location.href;
            });
            window.status = new Date();
            //            $('body').append(utility.$error);
        }
        //        utility.$error.attr("title", message);
        //        alert(message);
    }
    //#endregion

    //#region showLostConn
    , showLostConn: function (url) {
        // GAS-635: fixed 'idle' issues
        // this method will be no longer used
        utility.stopRequest = true;
        if (utility.$lostConn == null) {
            utility.$lostConn = $("<a href='javascript:void(0)' id='errLostConnMsg'>" + (new Date()) + ":Lost connection,Please refresh page</a>").click(function () {
                window.location.href = window.location.href;
            });
            window.status = new Date();
            //            $('body').append(utility.$lostConn);
        }
        //        utility.$lostConn.attr("title", url);
        //        alert(message);
        //        if ($('body').hasClass("login")) {
        //            window.location.href = window.location.href;
        //        }
    }
    //#endregion

    //#region template
    , template: function (templateUrl, callBack, key) {
        var templateObj;
        if (key) {
            templateObj = this.templateCache[key];
            if (templateObj) {
                callBack(templateObj);
                return;
            }
        }
        var fileUrl = global.root + "..//Content/Public/Templates/" + templateUrl + "?v=" + global.rv;
        if (utility.stopRequest) {
            return;
        }
        $.ajax({
            url: fileUrl
            , cache: true
            , type: "GET"
            , success: function (response) {
                templateObj = TrimPath.parseTemplate(response);
                response = null;
                utility.templateCache[key] = templateObj;
                callBack(templateObj);
            }
            , error: function (response) {
                // GAS-635: template no need to handle everything.
                //                if (response.statusText) {
                //                    utility.showError("Server Error\r\n  URL:  " + fileUrl + "\r\n  " + response.statusText);
                //                }
                //                else {
                //                    if (($.browser.mozilla || $.browser.safari || navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
                //                        && response.status == 0 && response.responseText == "") {
                //                        // Request Aborted - Chrome & Firefox - Safari - Do nothing
                //                    } else {
                //                        utility.showError("Server Error\r\n  URL:  " + fileUrl + "\r\n  Detail:  " + response);
                //                    }
                //                }
                //                response = null;
            }
        });
    }
    //#endregion

    //#region getValueFromUrl
    , getValueFromUrl: function (name) {
        if (window.location.search) {
            var querys = [];
            var nameLowerCase = name.toLowerCase();
            $.each(window.location.search.substring(1).split('&'), function () {
                $.each(this.split('='), function () {
                    querys.push(this);
                })
            });
            for (var i = 0; i < querys.length; i += 2) {
                if (querys[i].toLowerCase() == nameLowerCase) {
                    return querys[i + 1];
                }
            }
        }
        return null;
    },
    //#endregion

    //#region getQueryFromUrl
    getQueryFromUrl: function (url, exclusion) {
        var querys = [];
        if (url === undefined) url = window.location.search;
        var urlTokens = url.split("?");
        if (urlTokens.length >= 2) {
            var queryTokens = urlTokens[1].split("&");
            for (var i = 0; i < queryTokens.length; i++) {
                var pair = queryTokens[i].split("=");
                if (pair[0].toLowerCase() !== exclusion.toLowerCase()) {
                    querys.push(queryTokens[i]);
                }
            }
            return querys.join("&");
        }
    },
    //#endregion

    //#region service
    service: function (serviceName, methodName, parameter, httpMethod, callBack, errorCallback, includeLanguage) {
        if (utility.stopRequest) {
            return;
        }
        var postData = this.objToPostString(parameter);
        var serviceUrl = "/" + global.lan + "/Service/" + serviceName + "?" + methodName;
        $.ajax({ url: serviceUrl, cache: false, data: postData, type: httpMethod,
            success: function (response) {
                utility.succeededAction(response, callBack, includeLanguage);
            },
            error: function (request) {
                utility.failedAction(request, errorCallback);
            }
        });
    },
    //#endregion

    //#region secureservice
    secureservice: function (serviceName, methodName, parameter, httpMethod, callBack, errorCallback, excludeLanguage) {
        if (utility.stopRequest) {
            return;
        }
        var postData = this.objToPostString(parameter);
        var serviceUrl = uv.sec + "Service/" + serviceName + "?" + methodName + "G";

        isReceived = false;
        utility.service("UserService", "SetSecureLog", { MemberCode: $("#txtName").val(), MethodName: methodName, Message: "sent request to SSL server. " }, "POST");
        sslTimer = new Date().getTime();
        $.jsonp({
            url: serviceUrl,
            data: postData,
            callback: callBack,
            timeout: utility.securetimeout,
            success: function (json) {
                utility.succeededAction(response, callBack, excludeLanguage);
            },
            error: function (d, msg) {
                if (!isReceived) {
                    isReceived = true;
                    utility.service(serviceName, methodName, parameter, httpMethod, callBack, errorCallback, excludeLanguage);
                    sslTimer = new Date().getTime() - sslTimer;
                    utility.service("UserService", "SetSecureLog", { MemberCode: $("#txtName").val(), MethodName: ("SSLTimeOut_" + methodName + "(cost " + sslTimer + "ms)") }, "POST");
                }
            }
        });
    },
    //#endregion

    //#region succeededJsonp
    succeededJsonp: function (data) {
        try {
            if (isReceived) {
                utility.service("UserService", "SetSecureLog", { MemberCode: $("#txtName").val(), MethodName: "Login", Message: "Received Data Info after Timeout!", ServerCode: data.srvc }, "POST");
                isReceived = false;
                return;
            }
            isReceived = true;
            if (data != "") {
                if (data.lostConn) {
                    utility.service("UserService", "SetSecureLog", { MemberCode: $("#txtName").val(), MethodName: "Login", Message: "lostConnect", ServerCode: data.srvc }, "POST");
                    window.location.href = window.location.href;
                }
                else if (data.isAuth == false) {
                    var $parent = window.parent ? window.parent : window.opener;
                    if ($parent && $parent != window)
                        $parent.location.reload();
                    if (data.u && data.u != '')
                        document.location.href = data.u;
                    else
                        document.location.reload();
                }
                else {
                    if (data.u) {
                        loginCount = 0;
                        if (data.DCheck && data.DCheck == true) {
                            Control.Dialog.showMessage(l.header_Help, data.dMsg, function () { window.location.href = data.u; });
                            setTimeout(function () { window.location.href = data.u; }, 10000);
                        }
                        else window.location.href = data.de && data.de == "true" && data.u2 ? HomeJS.replaceCurrentpara(data.u2) : data.u;
                        return;
                    }
                    if (data.suc) {
                        loginCount = 0;
                        //Should reload when loggin successfully.
                        //To Reload Oddpage with user OddType and TimeZone
                        document.location.reload();
                    }
                    else {
                        utility.service("UserService", "SetSecureLog", { MemberCode: $("#txtName").val(), MethodName: "Login", Message: (data.m ? data.m : data.error), ServerCode: data.srvc }, "POST");
                        if ($("#txtName").val() == "") {
                            $("#txtNameMask").focus();
                        }
                        $("#txtPass").val("");
                        $("#txtPassMask").focus();
                        HomeJS.ajaxLoading(false);
                        if (data.sc || loginCount > retryCount) {
                            utility.popupUrl("/" + global.lan + "/user/fail-login", "cpt-login", 450, 150);
                        }
                        else if (data.scp) {
                            utility.popupUrl("/" + global.lan + "/user/change-password?ud=" + $.trim(Base64.encode($("#txtName").val())), "changePassword", 480, 190);
                        }
                        else {
                            HomeJS.ajaxLoading(false);
                            Control.Dialog.showAlert(l.Dlg_Login, data.m ? data.m : data.error, function () {
                                //                                if ($("#txtName").val() == "")
                                //                                    $("#txtNameMask").focus();
                                //                                else
                                //                                    $("#txtPassMask").focus();
                            });
                        }
                    }
                }
            }
        }
        catch (e) {
            utility.showError("parse error: " + response);
        }
    },
    //#endregion

    //#region succeededCP
    succeededCP: function (data) {
        try {
            if (isReceived) {
                utility.service("UserService", "SetSecureLog", { MemberCode: $("#txtName").val(), MethodName: "changePassword", Message: "Received Data Info after Timeout!", ServerCode: data.srvc }, "POST");
                //                isReceived = false;
                //                return;
            }
            isReceived = true;
            if (data != "") {
                $(".r-window").loadingMask("hide");
                if (data.m == "true") {
                    utility.service("UserService", "SetSecureLog", { MemberCode: $("#txtName").val(), MethodName: "changePassword", Message: "success", ServerCode: data.srvc }, "POST");
                    hideMsg();
                    var isForce = window.location.search.indexOf("logout=false") < 0
                    var strMsg = chpSuccess;
                    if (isForce)
                        strMsg = spanSuccessful;

                    Control.Dialog.showMessage(changePasswordtxt, strMsg, function () {
                        if (isForce) Logout();
                        else $("#btnClose").trigger("click");
                    });

                    if (isForce) {
                        setTimeout("Logout()", 5000);
                    }
                }
                else {
                    //Control.Dialog.showMessage(changePasswordtxt, data.m, function() {  });
                    utility.service("UserService", "SetSecureLog", { MemberCode: $("#txtName").val(), MethodName: "changePassword", Message: (data.m ? data.m : data.error), ServerCode: data.srvc }, "POST");
                    if (data.m) {
                        showMsg(data.m);
                    }
                    else if (data.error) {
                        showMsg(data.error);
                    }
                };
            }
        }
        catch (e) {
            utility.showError("parse error: " + response);
        }
    },
    //#endregion

    //#region succeededAction
    succeededAction: function (response, callBack, includeLanguage) {
        var data, parsed = false;
        try {
            if (response != "") {
                eval("data =" + response);
                if (includeLanguage && window.l) {
                    data.$l = window.l;
                }
                parsed = true;
            }
            else {
                parsed = false;
            }
        }
        catch (e) {
            utility.showError("parse error: " + response);
        }
        if (parsed && data) {
            if (data.syserror) {
                //only 'DEBUG' mode will have this message
                //utility.showError(data.syserror);
            }
            else if (data.lostConn) {
                //utility.showLostConn(serviceUrl);
                window.location.href = window.location.href;
            }
            else if (data.isAuth == false) {
                var $parent = window.parent ? window.parent : window.opener;
                if ($parent && $parent != window)
                    $parent.location.reload();
                if (data.u && data.u != '')
                    document.location.href = data.u;
                else
                    document.location.reload();
            }
            else {
                if (callBack)
                    callBack(data);
            }
        }
        data = null;
        response = null;
    },
    //#endregion

    //#region failedAction
    failedAction: function (request, errorCallback) {
        //404 stop, other error do nothing
        if (request.status == 404) {
            utility.stopRequest = true;
            window.status = new Date();
        }
        //          if (response.statusText) {
        //              utility.showError("Server Error 3\r\n  URL:  " + serviceUrl + "\r\n  Par:  " + postData + "\r\n  Detail:  " + response.statusText);
        //          }
        //          else {
        //              if (($.browser.mozilla || $.browser.safari || navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
        //                  && response.status == 0 && response.responseText == "") {
        //                  // Request Aborted - Chrome & Firefox - Safari - Do nothing
        //              }
        //              else {
        //                  utility.showError("Server Error 2\r\n  URL:  " + serviceUrl + "\r\n  Par:  " + postData + "\r\n  Detail:  " + response);
        //              }
        //          }
        if (errorCallback) errorCallback();
        request = null;
    },
    //#endregion

    //#region objToPostString
    objToPostString: function (obj, preFix) {
        if (!preFix) {
            preFix = "";
        }
        var builder = [];
        for (var name in obj) {
            if (obj[name] == undefined || obj[name] == null) { }
            else if (obj[name] instanceof Array) {
                var arr = obj[name];
                for (var i = 0; i < arr.length; i++) {
                    builder.push(preFix + name + "=" + arr[i]);
                }
            }
            else if (typeof (obj[name]) == "object") {
                builder.push(this.objToPostString(obj[name], name + "."));
            }
            else {
                builder.push(preFix + name + "=" + encodeURIComponent(obj[name]));
            }
        }
        return builder.join("&");
    },
    //#endregion

    //#region isCookieEnabled
    isCookieEnabled: function () {
        var cookieEnabled = ((navigator.cookieEnabled) ? true : false);
        return cookieEnabled;
    },
    //#endregion

    cookie: {
        //#region write
        write: function (c_name, value, expiredays) {
            if (!expiredays) {
                expiredays = 7;
            }
            $.cookie(c_name, value, { expires: expiredays, path: '/' });
        },
        //#endregion

        //#region read
        read: function (c_name) {
            return $.cookie(c_name);
        },
        //#endregion

        //#region erase
        erase: function (c_name) {
            $.cookie(c_name, null);
        }
        //#endregion
    },

    dialogIndex: 0

    //#region popupUrl
    , popupUrl: function (url, id, w, h, scrolling, closeOnEsc, onClosed) {
        if (!url || url.indexOf('javascript:void') >= 0) { return false; }
        if (!w || w == -1) { w = 800; }
        if (!h || h == -1) { h = 550; }
        if (!scrolling) { scrolling = "no"; }
        if (id) {
            var iframe = $("#" + id);
            if (iframe.length > 0) {
                // this dialog already existed
                var dlg = iframe.parent().dialog('destroy');
                dlg.remove();
            }
        } else {
            id = "dialog" + (utility.dialogIndex++);
        }

        $("<div/>").dialog({ autoOpen: false, modal: true, height: h, width: w, closeOnEscape: (closeOnEsc == null ? true : closeOnEsc), resizable: false,
            close: function (event, ui) { if (onClosed && $.isFunction(onClosed)) onClosed(event, ui); }
        }
        ).html('<iframe id="' + id + '" width="100%" height="100%" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="' + scrolling + '" />').dialog("open");
        $("#" + id).attr("src", url);
    }
    //#endregion

    //#region haveClass
    , haveClass: function (array, className) {
        for (var i = 0; i < array.length; i++) {
            if (!$(array[i]).hasClass(className)) {
                return false;
            }
        }
        return true;
    }
    //#endregion

    //#region remove
    , remove: function (array, removeObj) {
        var arr = [];
        if (array) {
            for (var i = 0; i < array.length; i++) {
                var value = array[i];
                if (value && removeObj != value) {
                    arr.push(value);
                }
            }
        }
        return arr;
    }
    //#endregion

    //#region parseToSizeInfo
    , parseToSizeInfo: function (css) {
        var classvalues = css.split(' ');
        var id, w = -1, h = -1, s;
        for (var i = 0; i < classvalues.length; i++) {
            switch (String(classvalues[i]).toLowerCase().charAt(0)) {
                case "w": w = parseInt(String(classvalues[i]).substr(1)); break;
                case "h": h = parseInt(String(classvalues[i]).substr(1)); break;
                case "i": id = String(classvalues[i]).substr(1); break;
                case "s": s = String(classvalues[i]).substr(1); break;
                case "r": r = String(classvalues[i]).substr(1); break; // values in "yes" or "no"
            }
        }
        if (typeof (s) == 'undefined' || s.toLowerCase() != "no") s = 'yes';
        if (typeof (r) == 'undefined' || r.toLowerCase() != "yes") r = 'no';
        if (isNaN(w) || isNaN(h)) { Control.Dialog.showAlert(global.tLogin, "Error:" + css, function () { }); }
        return { 'id': id, 'width': w, 'height': h, 'scroll': s, resizable: r };
    },
    //#endregion

    //#region disableLinks
    disableLinks: function (selector) {
        $(selector).fadeTo(2000, .3).addClass("disabled_link").removeClass("popup-new").removeAttr("href").unbind("click");
    },
    //#endregion

    //#region popupUrlWin
    popupUrlWin: function (url, info, name) {
        var x = 0, y = 0, w = 800, h = 600; // default value: width=800, height=600
        if (info.width != -1) w = info.width;
        if (info.height != -1) h = info.height;
        x = (screen.width - w) / 2;
        y = (screen.height - h) / 2;
        var features = "resizable=" + info.resizable + ", scrollbars=" + info.scroll + ", left=" + x + ", top=" + y + ", width=" + w + ", height=" + h;
        if( window.name != name)
        {
            var win = window.open(url, name, features);
            //Fix IE pop-up 2 window at the same time
            if (win) { win.focus(); };
        }
        else
            location.href=url;
    },
    //#endregion

    //#region popupNewWin
    popupNewWin: function (event, obj, name, isStop) {
        var info = utility.parseToSizeInfo(obj.className);
        
        if (name == "_blank" || !name) { name = "188BET"; }
        if (info && info.id) { name = info.id; }

        utility.popupUrlWin(obj.href, info, name);

        if (isStop && isStop == true) return;

        event.stopPropagation();
        event.preventDefault();
    },
    //#endregion

    //#region ttip
    ttip: function (name) {
        $(name).tt({ showEvent: 'mouseover',
            hideEvent: 'mouseout',
            vAlign: "above",
            align: "flushLeft",
            ttClass: 'tooltip',
            distanceX: 0,
            distanceY: 0,
            visibleOnScroll: true
        });
    },
    //#endregion

    //#region ttip_st
    ttip_st: function (name) { //to disable the auto hide in statement pages
        $(name).tt({ showEvent: 'mouseover',
            hideEvent: 'mouseout',
            vAlign: "above",
            align: "flushLeft",
            ttClass: 'tooltip',
            distanceX: 0,
            distanceY: 0,
            visibleOnScroll: true,
            autoHide: false
        });
    }
    //#endregion

    //#region checkRefresh
    , checkRefresh: function () {
        if (uv) {
            utility.service("HomePageService", "NeedRefresh", { AccountID: uv.acid }, "POST", function (data) {
                if (data && data.ref) {
                    if (data.u && data.u != "" && HomeJS) {
                        document.location.href = data.u;
                    }
                    else {
                        if ($('.ui-dialog:visible').length > 0) return;
                        if (location.search.toLowerCase().indexOf('?playfor') != -1) {
                            var q = location.search.toLowerCase().replace("playfor=fun", "playfor=real")
                            document.location.replace(location.pathname + q);
                        }
                        else
                            document.location.reload();
                    }
                }
            }
            );
        }
    }
    //#endregion

    //#region cancelEvent
    , cancelEvent: function (e) {
        e = e ? e : window.event;
        if (e.stopPropagation)
            e.stopPropagation();
        if (e.preventDefault)
            e.preventDefault();
        e.cancelBubble = true;
        e.cancel = true;
        e.returnValue = false;
        return false;
    },
    //#endregion

    //#region setdomain
    setdomain: function () {
       // document.domain = location.hostname.substr(location.hostname.indexOf('.'));
    },
    //#endregion

    //#region setHistory
    setHistory: function (title, url) {
        var stateobj = { caller: 'sbk' };
        if (url) {
            if (!$.browser.msie)
                history.replaceState(stateobj, "", url);
            $('#drop_lanslist a').each(function (index, data) {
                var lan = $(this).attr('class');
                var hash = url.split('#');
                url = hash.length > 1 ? hash[1] : url;
                HomeJS.sbkframesrc = url;
                $(this).attr({ href: '/' + lan + url.substring(6) });
            });
        }
    },
    //#endregion

    //#region setframeHeight
    setframeHeight: function (newheight, isresize) {
        if ($('body').hasClass('in-play')) { return; }
        var $targetframe = $('#sbkFrame');
        var $parent = $targetframe.closest('div#container');
        $parent.animate({ height: newheight + 'px' }, isresize == true ? 0 : 300);
        return;
    },
    //#endregion

    //#region setframeHeight
    setNanoframeHeight: function (target, newheight) {
        var $targetframe = $(target);
        var $parent = $targetframe.closest('div.widget');
        $parent.animate({ height: newheight + 'px' }, 500, function () {
            if (parent.utility.setRightBannerFrameHeight)
                parent.utility.setRightBannerFrameHeight($('div#wrapper').height());
        });
        $targetframe.css({ 'position': 'absolute', 'top': 0, 'left': 0, 'z-index': 10 });
    },
    //#endregion

    //#region 
    setInplayPage: function (isInplay) {
        var contentheight = $(window).height() - $('#sbkFrame').offset().top - 1;
        if (isInplay) {
            $('#container').css('height', contentheight);
            if (!$('body').hasClass('in-play'))
                $('body').addClass('in-play');
            $('#footer').hide();
        }
        else {
            var e = $('#sbkFrame')[0];
            var newheight;
            try {
                newheight = e.contentWindow.utility.getBodyHeight();
                utility.setframeHeight(newheight, true);
            } catch (e) {
            }
            $('body').removeClass('in-play');
            $('#footer').show();
        }
        return;
    },
    //#endregion

    //#region MobilePromptMsg
    MobilePromptMsg: function () {
        if (!$.browser.mobile && !/iPad|iPod/i.test(navigator.userAgent)) return;
        if (!/home|sports|casino/i.test(location.pathname)
             && (location.pathname != "/" + global.lan + "/" && location.pathname != "/" + global.lan)) return;
        var isShowed = utility.cookie.read("mobilemsg");

        if (!isShowed) {
            utility.cookie.write("mobilemsg", true, { expires: 1, path: '/' });
            var mobileurl, wapurl;

            $(global.sdomains).each(function (index, obj) {
                if (obj.n == "mobile") mobileurl = obj.u + global.lan;
                if (obj.n == "wap") wapurl = obj.u;
            });
            if (confirm(l.Mobile_PromptMessage))
                window.location = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? mobileurl : wapurl;
            //location.replace('/'+global.lan+'/mobile/prompt')
        }
    },
    //#endregion

    //#region CountDown
    CountDown: function (EndDate, obj) {
        var diff = Math.round((new Date(EndDate) - new Date()) / 1000) * 1000;
        RepeatCountDown();
        var counter = setInterval(RepeatCountDown, 1000);
        function RepeatCountDown() {
            if (diff <= 0) { clearInterval(counter); diff = 0; } else { diff -= 1000; }
            var d = new Date(diff);
            var HH = Math.floor(diff / 3600000);
            $(obj).text(" " + HH + " " + l.MatainHour + " / " + d.getMinutes() + " " + l.MatainMins + " / " + d.getSeconds() + " " + l.MatainSec);
        }
    },
    //#region
    //#region Game Center Prompt message
    PlayForFunPrompt: function (second) {
        var buttonOption = new Array(l.Dlg_Join, l.Dlg_Login);
        var info = utility.parseToSizeInfo('w917 h660 ryes iregister');
        setTimeout(function () {
            Control.Dialog.showAlertWithOption(l.Dlg_Notice, l.ForFunPrompt, buttonOption,
            function (event) { utility.popupUrlWin("/" + global.lan + "/user/register", info, "_blank"); ; },
            function () {
                //fix chrome cannot focus
                setTimeout(function () { $("#txtNameMask").trigger("focus"); }, 0);
            });
        }, second*1000);
    }
};
//#endregion

//#region Base64
var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    //#region encode
    encode: function (input) { // public method for encoding
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
    //#endregion

    //#region decode
    decode: function (input) { // public method for decoding
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },
    //#endregion

    //#region _utf8_encode
    _utf8_encode: function (string) { // private method for UTF-8 encoding
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    //#endregion

    //#region _utf8_decode
    _utf8_decode: function (utftext) { // private method for UTF-8 decoding
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
    //#endregion
}
//#endregion

//#region HomeJS
var HomeJS = { // this is a Utility of Login
    isP: false,
    dymic: { parent: '#page-holder', target: '#centercontent', minW: 1001, maxW: 1001 },
    timeOutId: null,
    sbkframesrc: null,
    //#region Promte
    Promte: function (data) { },
    //#endregion

    //#region adjustContainer
    adjustContainer: function () {
        var winsize = $(window).width();
        var widgetW = $('#wrapper').length == 0 || winsize <= 1240 ? 0 : 252;
        var tWidth = winsize > HomeJS.dymic.maxW + widgetW ? HomeJS.dymic.maxW : (winsize > HomeJS.dymic.minW + widgetW ? winsize - widgetW : HomeJS.dymic.minW);
        var pWidth = winsize < HomeJS.dymic.minW + 252 ? HomeJS.dymic.minW + widgetW : tWidth + widgetW;

        var pminW = winsize <= 1280 ? HomeJS.dymic.minW : HomeJS.dymic.minW + widgetW;
        var pMaxW = winsize <= 1280 ? HomeJS.dymic.maxW : HomeJS.dymic.maxW + widgetW;

        if (pWidth > pMaxW)
            pWidth = pMaxW;
        else if (pWidth <= pminW)
            pWidth = pminW;

        if (winsize <= 1240 || widgetW == 0)
            $(HomeJS.dymic.target).css({ 'float': 'none', 'margin': '0 auto' });
        else
            $(HomeJS.dymic.target).css({ 'float': 'right', 'margin-right': '250px' });

        $(HomeJS.dymic.target).css({ 'width': tWidth });
        $(HomeJS.dymic.parent).css('min-width', pWidth + 'px');

        if (location.pathname.indexOf('/sports') != -1 || location.pathname.indexOf('/asia') != -1)
            utility.setInplayPage($('body').hasClass('in-play'));
        if (location.pathname.indexOf('casino.html') != -1)
            $(HomeJS.dymic.target).css({ 'width': 'auto' });

    },
    //#endregion

    //#region initShade
    initShade: function () {
        var currTheme = JSON.parse(utility.cookie.read("prefer"));

        if (currTheme)
            uv.pd = currTheme;

        utility.cookie.write('prefer', JSON.stringify(uv.pd), { expires: 0, path: '/' });
        
        $('head').append('<link id="themestyle" href="/Content/Public/CSS/Themes/' + uv.pd.theme + '-theme.css?v=' + global.rv + '" rel="stylesheet" type="text/css" />');
    },
    //#endregion
    //#region initLogin
    setMyStatement: function () {
        var route = location.pathname.split('/');
        var prod = route.length > 2 ? route[2] : "home";
        var newpath = "/" + global.lan + "/";
        switch (prod) {
            case "sports":
            case "financials":
            case "keno":
            case "racing":
                newpath += "my-account/statement/betting-history/" + prod + "/settled-bets";
                break;
            case "casino":
                newpath += "my-account/statement/betting-history/casino";
                break;
            case "live":
            case "live-uk":
                newpath += "my-account/statement/betting-history/livecsn";
                break;
            default:
                if (!uv.Deposit)
                    newpath += "my-account/statement/summary";
                else
                    newpath += "my-account/statement/transaction-history/summary";
                break;
        }
        $('a#mystatement').attr('href', newpath);
    },
    //#endregion
    //#region initLogin
    initLogin: function () {
        //HomeJS.initShade();
        if (typeof Redirect != 'undefined' && Redirect.isRedirectToNewUrl) {
            Redirect.isShowPopupMessage ? Control.Dialog.showMessage('', Redirect.popupMessage, function () { window.parent.location.href = Redirect.redirectURL; }) : window.parent.location.href = Redirect.redirectURL;
        }
        if (uv.login) {
            HomeJS.ajaxLoading(true);
            utility.template("UserInfo.html", HomeJS.loadUserInfo, "LoginSuccessful");
            var ShowSplash = !uv.Deposit && uv.pds == "0" && uv.showsp;
            //PromptMessage after User Login.//!uv.IntroV && !uv.Counter
            if (!uv.IntroV && !uv.Counter) {
                var showCounts = utility.cookie.read("PromptPage");
                if (showCounts != null) return;

                $.get(global.cdn + "/Content/Public/PromptForm/" + global.lan + "/" + global.lan + ".html", function (data) {
                    var buttonOption = new Array();
                    data = data.replace("[CdnUrl]", global.cdn);
                    $(data).find("input").each(function (index, d) {
                        buttonOption.push($(this).val() ? $(this).val() : $(this).text());
                    });

                    if (!uv.Deposit) data = data.replace("my-account/account-settings/profile", "my-account/account-settings");

                    Control.Dialog.showPromptMessage($(data).find("span.title").text(), $(data).find("div.content").html(), buttonOption, HomeJS.ChangeNow, HomeJS.Close);
                    utility.cookie.write("PromptPage", true, { expires: 0, path: '/' });
                });
            }
            else if (uv.Counter) {
                //if loginNums == 3 will update UserPreference.
                utility.service("UserService", "SetUserPreferenceDto", {}, "POST", function (data) { });
            }
        }
        else {
            $("#txtPassMask").focus(function () {
                $("#txtPass").removeClass("hidden").focus();
                $(this).addClass("hidden");
            });
            $("#txtNameMask").focus(function () {
                $("#txtName").removeClass("hidden").focus();
                $(this).addClass("hidden");
            });
            $("#txtPass").blur(function () {
                if (this.value == "") {
                    $("#txtPassMask").removeClass("hidden");
                    $(this).addClass("hidden");
                }
            });
            $("#txtName").blur(function () {
                if (this.value == "") {
                    $("#txtNameMask").removeClass("hidden");
                    $(this).addClass("hidden");
                }
            });

            InputController.textBoxsOnEnter(function () {
                $("#btnLogin").trigger("click");
            });
            $("#btnLogin").click(HomeJS.login);
        }
    },
    //#endregion

    //#region checkDisplayItems
    checkDisplayItems: function () {
        //in live-casino and casino page, should hide iom icon beside member in UK.
        //        if (window.location.href.toLowerCase().indexOf("/casino") != -1) {
        //            $("a.firstcagayan").css({ display: "none" });
        //            uv.showls = false;
        //        }
        //        if (window.location.href.toLowerCase().indexOf("/live-uk") != -1) {
        //            uv.showls = false;
        //            if (uv.country.toLowerCase() == "gb") {
        //                $("a.firstcagayan").css({ display: "none" });
        //            }
        //        }
        //        if ((window.location.href.toLowerCase().indexOf("/live") != -1 && uv.country.toLowerCase() != "gb")) {
        //            uv.showls = false;
        //            $("a.firstcagayan").removeClass("deposit-no-cred");
        //        }
        //        if (uv.showls) {
        //            $("li:has(a#liveStream),div .c-ls,li#tvicon").removeClass("hidden");
        //        }
        //        //member type is Unknown or Deposit.
        //        $("#ftRegistration").each(function(index, data) {
        //            if (!uv.mtid || uv.mtid != 1) return;
        //            $(data).attr("href", "/" + global.lan + "/info-centre/help/opening-an-account")
        //                       .attr("class", "popup-new ijoin w917 h600 ryes");

        //        });
    },
    //#endregion

    //#region selectSiteLink
    selectSiteLink: function () {
        //        var acmSiteUrl = $("a#changeToACM").attr("href");
        //        if (window.location.href.indexOf(acmSiteUrl) != -1) {
        //            $("a#changeToACM").toggleClass("selected");
        //        }
        //        else {
        //            $("a#changeToStar").toggleClass("selected");
        //        }

        //        $("a#changeToStar").click(function() {
        //            if ($('#acm_iframe').html() != null) {
        //                logoutACM();
        //            }
        //        });
    },
    //#endregion

    //#region ajaxLoading
    ajaxLoading: function (show) {
        var idt = $("#ajxldg");
        if (show) {
            HomeJS.isP = true;
            if (idt.length <= 0) {
                $("#preLogin").addClass("hidden");
                $("#TitleForgotPass").addClass("hidden");
                $("<div id='ajxldg' class='ajxldg'/>").insertAfter("#preLogin")
            }
            if (HomeJS.timeOutId) clearTimeout(HomeJS.timeOutId);
            else
                HomeJS.timeOutId = setTimeout('document.location.reload()', 120000)
        }
        else {
            $("#preLogin").removeClass("hidden");
            idt.remove();
            HomeJS.isP = false;
            $("#TitleForgotPass").removeClass("hidden");
            if (HomeJS.timeOutId) clearTimeout(HomeJS.timeOutId);
        }

    },
    //#endregion

    //#region loadUserInfo
    loadUserInfo: function (template) {
        var shtml = template.process(uv);
        var $userInfo = $("#user-info");
        $userInfo.empty();
        $userInfo.html(shtml);

        $('#header').on('click', '#btnLogout', HomeJS.logout);
        $('#header').on('click', 'a.balance', HomeJS.refreshBalance);
        HomeJS.expandBalance();
        // popup normal new window
        $("a.popup-new", $userInfo).unbind("click").click(function (event) {
            utility.popupNewWin(event, this, this.target);
        });
        $("a.hide-ban").bind("click", HomeJS.change_expandBalance);
        $("a.hide-ban").hover(function () {
            if ($(this).is('.-c'))
                $(this).find(".tt-wrap").fadeIn('slow');
        }).bind("mouseleave", function () { $(this).find(".tt-wrap").hide(); });

        // Popup a new specified (Deposit) window if winLinkId found
        //var depLink = "/" + global.lan + "/my-account/banking/deposit";
        // utility.popupUrlWin(depLink, "popup-new w917 h600 ryes", "_blank");
        if (typeof (lgv) != "undefined" && lgv.aou) {
            $(function () { $("#" + lgv.aou).trigger('click'); });
        } else if (location.href.indexOf("wlink=depLink") > 0) {
            $(function () { $("#depLink").trigger('click'); });
        }
        HomeJS.setMyStatement();
        HomeJS.ajaxLoading(false);
    },
    //#endregion

    //#region change_expandBalance
    change_expandBalance: function () {
        $("a.hide-ban").toggleClass("-c");
        var ExpandBalance = utility.cookie.read("ExpandBalance");
        if (ExpandBalance == "true") {
            $("a.balance").css("display", "none");
            utility.cookie.write("ExpandBalance", false, { expires: 0, path: '/' });
        }
        else {
            $("a.balance").css("display", "inline-block");
            utility.cookie.write("ExpandBalance", true, { expires: 0, path: '/' });
        }
    },
    //#endregion

    //#region expandBalance
    expandBalance: function () {
        var ExpandBalance = utility.cookie.read("ExpandBalance");
        if (ExpandBalance == "true") {
            $("a.balance").css("display", "inline-block");
            $("a.hide-ban").removeClass("-c");
        }
        else {
            $("a.balance").css("display", "none");
            $("a.hide-ban").addClass("-c");
        }
    },
    //#endregion

    //#region refreshBalance
    refreshBalance: function () {
        var refreshBalance = false;
        var timestamp = Date.parse(new Date());
        if (lastBalance) {
            var diffBalance = timestamp - lastBalance;
            if (diffBalance >= timeout) {
                lastBalance = timestamp;
                refreshBalance = true;
            }
        } else {
            lastBalance = timestamp;
            refreshBalance = true;
        }
        if (refreshBalance) {
            utility.service("HomePageService", "GetBalance", null, "GET",
                function (data) {
                    if (data != null) {
                        if (data.isAuth == null || data.isAuth == true) {
                            $("a.balance").html(data);
                        } else {
                            document.location.reload();
                        }
                    }
                }
            );
        }
    },
    //#endregion

    //Init announcements marquee (only for credit member)
    // No need to call if reload the page when login successfully
    //#region initAnns
    initAnns: function (anns) {
        // If called when login
        var marquee = null;
        if (anns != null && $.isArray(anns) && anns.length > 0) {
            marquee = $("#header .top .info ul");
            var lis = "";
            for (var i = 0; i < anns.length; i++) {
                lis = lis + "<li><a target='_blank' class='popup-new iaccount w917 h600 ryes' href='/" + global.lan + "/my-account/statement/betting-history'>" + anns[i] + " </a></li>";
            }
            marquee.html(lis);
            marquee.addClass("marquee");
            $("a", marquee).click(function (event) {
                utility.popupNewWin(event, this);
            });
        } else {
            marquee = $(".marquee");
        }

        if (marquee.length > 0) {
            marquee.marquee({ showSpeed: 700, scrollSpeed: 12, pauseSpeed: 3000 });
        }
    },
    //#endregion
    replaceCurrentpara: function (uri) {
        if (!HomeJS.sbkframesrc) return uri;
        var paras = uri.split('&');
        uri = uri.replace(paras[1], 'u=' + HomeJS.sbkframesrc);
        return uri;
    },
    //#region login
    login: function () {
        if (HomeJS.isP == true) return;
        var canSubmit = true;
        if ($("#txtName").val() == "") {
            canSubmit = false;
            $("#txtNameMask").focus();
        }
        if ($("#txtPass").val() == "") {
            canSubmit = false;
            $("#txtPassMask").focus();
        }

        if (canSubmit) {
            HomeJS.ClearCookie("DialogShowed");
            HomeJS.ajaxLoading(true);
            loginCount++;
            if (uv.usc && location.protocol != "https:") {
                utility.securetimeout = 5000;
                utility.secureservice("UserService", "Ln", { Ud: $.trim(Base64.encode($("#txtName").val())), Pd: Base64.encode($("#txtPass").attr("value")), ServerCode: uv.srvc }, "POST",
                function (data) {
                    if (data.suc) {
                        if (data.u) {
                            if (data.DCheck && data.DCheck == true) {
                                Control.Dialog.showMessage(l.header_Help, data.dMsg, function () { window.location.href = data.u; });
                                setTimeout(function () { window.location.href = data.u; }, 10000);
                            }
                            else window.location.href = data.de && data.de == "true" && data.u2 ? HomeJS.replaceCurrentpara(data.u2) : data.u;
                            return;
                        }
                        //Should reload when loggin successfully.
                        document.location.reload();
                    }
                    else {
                        if ($("#txtName").val() == "") {
                            $("#txtNameMask").focus();
                        }
                        $("#txtPass").val("");
                        $("#txtPassMask").focus();
                        HomeJS.ajaxLoading(false);
                        if (data.sc) {
                            utility.popupUrl("/" + global.lan + "/user/fail-login", "cpt-login", 445, 150);
                        }
                        else if (data.scp) {
                            utility.popupUrl("/" + global.lan + "/user/change-password?ud=" + $.trim(Base64.encode($("#txtName").val())), "changePassword", 480, 190);
                        }
                        else {
                            Control.Dialog.showAlert(l.Dlg_Login, data.m ? data.m : data.error, function () {
                                //if ($("#txtName").val() == "")
                                //$("#txtNameMask").focus();
                                //else
                                //$("#txtPassMask").focus();
                            });
                        }
                    }
                });
            } else {
                utility.service("UserService", "Ln", { Ud: $.trim(Base64.encode($("#txtName").val())), Pd: Base64.encode($("#txtPass").attr("value")) }, "POST",
                function (data) {
                    if (data.suc) {
                        if (data.u) {
                            if (data.DCheck && data.DCheck == true) {
                                Control.Dialog.showMessage(l.header_Help, data.dMsg, function () { window.location.href = data.u; });
                                setTimeout(function () { window.location.href = data.u; }, 10000);
                            }
                            else window.location.href = data.de && data.de == "true" && data.u2 ? HomeJS.replaceCurrentpara(data.u2) : data.u;
                            return;
                        }
                        document.location.href = document.location.href;
                    }
                    else {
                        if ($("#txtName").val() == "") {
                            $("#txtNameMask").focus();
                        }
                        $("#txtPass").val("");
                        $("#txtPassMask").focus();
                        HomeJS.ajaxLoading(false);
                        if (data.sc) {
                            utility.popupUrl("/" + global.lan + "/user/fail-login", "cpt-login", 445, 150);
                        }
                        else if (data.scp) {
                            utility.popupUrl("/" + global.lan + "/user/change-password?ud=" + $.trim(Base64.encode($("#txtName").val())), "changePassword", 480, 190);
                        }
                        else {
                            Control.Dialog.showAlert(l.Dlg_Login, data.m ? data.m : data.error, function () {
                                //if ($("#txtName").val() == "")
                                //$("#txtNameMask").focus();
                                //else
                                //$("#txtPassMask").focus();
                            });
                        }
                    }
                });
            }
        } else {
            if ($("#txtName").val() == "") {
                $("#txtNameMask").focus();
            }
            $("#txtPass").val("");
            $("#txtPassMask").focus();
            Control.Dialog.showAlert(l.Dlg_Login, l.lginv, function () {
                //if ($("#txtName").val() == "")
                //$("#txtNameMask").focus();
                //else
                //$("#txtPassMask").focus();
            });
        }
    },
    //#endregion

    //#region removeQueryString
    removeQueryString: function (url) {
        url = url.toLowerCase();
        if (url.indexOf("?competitionids") != -1) {
            return url.substr(0, url.indexOf("?competitionids"));
        }
        return url;
    },
    //#endregion

    //#region removeAllQueryString
    removeAllQueryString: function (url) {
        url = url.toLowerCase();
        if (url.indexOf("?") != -1) {
            return url.substr(0, url.indexOf("?"))
        }
        return url;
    },
    //#endregion

    //#region logout
    logout: function () {
        try {
            var $parent = window.opener != null ? window.parent : window.opener;
            if ($parent != null && $parent.HomeJS) {
                if (!$parent.closed)
                    $parent.HomeJS.logout();
                //prevent promot message when window opened by ctrl + clicking link
                window.open('', '_self', '');
                window.close();
            } else {
                //                utility.cookie.write("PromptPage", null, { expires: 0, path: '/' });
                utility.service("UserService", "Logout", {}, "POST", function (data) {
                    if (data.u != null && data.u.trim() != "") {
                        window.location.href = HomeJS.removeQueryString(data.u);
                    } else {
                        var url = window.location.href.indexOf('/sports') != -1 && HomeJS.sbkframesrc ? HomeJS.sbkframesrc : window.location.href;
                        url = url.toLowerCase();
                        if (url.indexOf("?competitionids") != -1) {
                            window.location.href = HomeJS.removeQueryString(url);
                        }
                        else
                            window.location.href = HomeJS.removeAllQueryString(url);
                    }
                });
            }
        } catch (ex) {
            utility.service("UserService", "Logout", {}, "POST", function (data) {
                if (data.u != null && data.u != "") {
                    window.location.href = data.u;
                } else {
                    document.location.reload();
                }
            });
        }
    },
    //#endregion

    //#region ChangeNow
    ChangeNow: function () {
        var $mydialog = $("div.ui-dialog");
        //popupnew feature page
        $mydialog.find("a.popup-new").click();
        //setUserPreference
        utility.service("UserService", "SetUserPreferenceDto", {}, "POST", function (data) { });
    },
    //#endregion

    //#region Close
    Close: function () {
        var $mydialog = $("div.ui-dialog");
        var DontShow = $mydialog.find("input#ckbDontShow").attr("checked");

        if (DontShow) {
            utility.service("UserService", "SetUserPreferenceDto", {}, "POST", function (data) { });
        }
    },
    //#endregion

    //#region ClearCookie
    ClearCookie: function (name) {
        utility.cookie.write(name, null, { expires: 0, path: '/' });
    }
    //#endregion
};
//#endregion

//#region ClockJS
var ClockJS = { // this is a Utility of Clock
    userTZOffset: null,
    serverDate: new Date(),
    tmpDt: new Date(),
    serverClientGap: 2,
    _onSecondChanged: [],
    beforeChangeTime: new Date(),

    //#region initTimeClock
    initTimeClock: function (tzOffset, svrDate, utcDate) {
        var tzNum = Number(tzOffset);
        if (tzOffset && !isNaN(tzNum)) { //For after Login (Before Login, tzOffset is null)
            ClockJS.userTZOffset = tzNum;
        }
        if (ClockJS.userTZOffset != null) { //For after Login
            ClockJS.serverDate = new Date(svrDate);
        }
        else {
            ClockJS.serverDate = new Date();
            var clientTZoffset = -(ClockJS.tmpDt.getTimezoneOffset());
            //ClockJS.serverDate.setMinutes(ClockJS.serverDate.getMinutes() + clientTZoffset);
        }
        ClockJS.tmpDt = new Date(ClockJS.serverDate); // QAT-3611 STAR - Remove GetCurrentDateStrRefresh
        ClockJS.serverClientGap = (new Date()) - ClockJS.serverDate;
        ClockJS.updateClock();
    },
    //#endregion

    //#region secondElapsed
    secondElapsed: function (hanlder) {
        if (hanlder && $.isFunction(hanlder)) {
            ClockJS._onSecondChanged.push(hanlder);
        }
    },
    //#endregion

    //#region updateClock
    updateClock: function () {
        var currentTime = new Date();
        var userChangeGap = currentTime.getTimezoneOffset() - ClockJS.beforeChangeTime.getTimezoneOffset();
        if ((userChangeGap > 14) || (userChangeGap < -14)) {
            window.location.reload();
            return;
        }
        // window.status = "ChangeGap=" + userChangeGap + ",currentTime=" + currentTime + ",beforeChangeTime=" + ClockJS.beforeChangeTime;

        //When the gap become big or less
//        var gap = currentTime - ClockJS.serverDate;
//        if (gap > (60000 + ClockJS.serverClientGap) || gap < (ClockJS.serverClientGap - 60000)) {
//            window.location.reload();
//            return;
//        }

        var clientDateTime = new Date(currentTime - ClockJS.serverClientGap); //ClockJS.serverDate;
        var clientTZoffset = -currentTime.getTimezoneOffset(); // eg: --480 -> +480

        for (var i = 0; i < ClockJS._onSecondChanged.length; i++) {
            if (ClockJS._onSecondChanged) ClockJS._onSecondChanged[i](currentTime);
        }

        var timer = setTimeout("ClockJS.updateClock()", 1000);
        var ckTz = utility.cookie.read("timeZone");

        //--------------------
        // referece: http://www.onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/
        var jan1 = new Date(currentTime.getFullYear(), 0, 1, 0, 0, 0, 0);  // jan 1st
        var june1 = new Date(currentTime.getFullYear(), 6, 1, 0, 0, 0, 0); // june 1st

        var temp = jan1.toGMTString();
        var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ") - 1));
        temp = june1.toGMTString();
        var june2 = new Date(temp.substring(0, temp.lastIndexOf(" ") - 1));

        var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60); // eg: 8, this will be the time zone you see in your machine
        var daylight_time_offset = (june1 - june2) / (1000 * 60 * 60); // eg: 9, this will be the time zone after add 1 hour for daylight saving time

        var dst = "0"; // daylight savings time, if 1 means user has checked "Automatically adjust clock for daylight saving changes"

        if (std_time_offset != daylight_time_offset) {  // positive is southern, negative is northern hemisphere
            var hemisphere = std_time_offset - daylight_time_offset;
            if (hemisphere >= 0) {
                std_time_offset = daylight_time_offset;
                dst = "1"; // daylight savings time is observed
            }
        }
        //--------------------

        //TimeZone
        if (ClockJS.userTZOffset != null) { //After login
            $("#tzgmt").html(" (GMT " + ClockJS.getTimeZoneString(ClockJS.userTZOffset) + ")");
            if (ClockJS.userTZOffset != ckTz) {
                utility.cookie.write("timeZone", ClockJS.userTZOffset);
                utility.cookie.write("dst", "0");
            }
        } else {//Before login
            if (clientTZoffset != ckTz) {
                utility.cookie.write("timeZone", clientTZoffset);
                utility.cookie.write("dst", dst);
            }
            $("#tzgmt").html(" (GMT " + ClockJS.getTimeZoneString(std_time_offset * 60) + ")");
        }

        //Date
        if (ClockJS.tmpDt.getDate() != clientDateTime.getDate()) {
            ClockJS.tmpDt = clientDateTime;
            utility.service("HomePageService", "GetCurrentDateStrRefresh", null, "GET", function (data) { $(".todayDateClock").html(data); });
        }

        //Time
        $("#lbClock").html(ClockJS.padNumber(clientDateTime.getHours()) + ":" + ClockJS.padNumber(clientDateTime.getMinutes()) + ":" + ClockJS.padNumber(clientDateTime.getSeconds()));
        ClockJS.serverDate.setSeconds(ClockJS.serverDate.getSeconds() + 1);
    },
    //#endregion

    //#region padNumber
    padNumber: function (num) {
        return num < 10 ? "0" + num : num;
    },
    //#endregion

    //#region getTimeZoneString
    getTimeZoneString: function (time_offset) {
        var hours = parseInt(time_offset / 60);
        var minus = Math.abs(time_offset % 60);
        var sign = (hours > 0 ? "+" : (hours < 0 ? "-" : ""));

        var absHours = Math.abs(Math.floor(hours));
        if (absHours < 10) {
            absHours = "0" + absHours;
        }
        if (Math.abs(minus) < 10) {
            minus = "0" + minus;
        }
        return sign + absHours + ":" + minus;
    }
    //#endregion
};
//#endregion

//#region IAnnJS
var IAnnJS = { // Important Announcement
    headline_count: 0,
    current_headline: 0,

    //#region headline_rotate
    headline_rotate: function () {
        var $iann = $("#iptAnns div.headline");
        old_headline = IAnnJS.current_headline;
        if (++IAnnJS.current_headline >= IAnnJS.headline_count) IAnnJS.current_headline = 0;
        $($iann[old_headline]).css('top', '210px');
        $($iann[IAnnJS.current_headline]).show().animate({ top: 5 }, "slow");
        $("div#iptAnns #content").animate({ height: $($iann[IAnnJS.current_headline]).height() + 10 });
    }
    //#endregion
};
//#endregion

//#region InputController
var InputController = {
    //#region initMaxLength
    initMaxLength: function (obj, max) {
        var val;
        obj.keyup(function (e) {
            val = obj.val();
            if (val.length > max) {
                obj.val(val.substring(0, max));
                e.returnValue = false;
                e.preventDefault();
                return false;
            }
        });
    },
    //#endregion

    //#region textBoxsOnEnter
    textBoxsOnEnter: function (onEnter, filter) {
        if (onEnter && $.isFunction(onEnter)) {
            var inputs = $;
            if (filter) inputs = $(filter);
            else inputs = $("input.login"); //input:text,input:password

            inputs.keypress(function (e) {
                var code;
                if (!e) var e = window.event;
                if (e.keyCode) code = e.keyCode;
                else if (e.which) code = e.which;
                if (code == 13) {
                    var sm = true;
                    for (var i = 0; i < inputs.length; i++) {
                        var $ip = $(inputs[i]);
                        if ($.trim($ip.val()) == "") {
                            $ip.focus();
                            // in case of 'mask'
                            $("#" + $ip.attr("id") + "Mask").focus();
                            sm = false;
                            break;
                        }
                    }
                    if (sm == true) {
                        onEnter();
                    }
                    e.cancelBubble = true;
                    if (e.stopPropagation) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });
        }
    }
    //#endregion
};
//#endregion

//#region jQuery.fn.topLink
jQuery.fn.topLink = function (settings) {
    settings = jQuery.extend({
        min: 50,
        fadeSpeed: 200,
        offsetY: 35,
        offsetX: 35
    }, settings);

    var $win = $(window);

    return this.each(function () {
        var $el = $(this);

        scroll();

        // listener for scroll/resize
        $win.scroll(function () { scroll(); });
        $win.resize(function () { scroll(); });

        $el.click(function (e) {
            $win.scrollTop(0);
            e.preventDefault();
        });

        function scroll() {
            $el.css({
                top: $win.scrollTop() + $win.height() - settings.offsetY,
                left: $win.scrollLeft() + $win.width() - settings.offsetX
            });
            if ($win.scrollTop() >= settings.min) {
                $el.fadeIn(settings.fadeSpeed);
            }
            else {
                $el.fadeOut(settings.fadeSpeed);
            }
        }
    });
};
//#endregion

$(function () {
    //#region ToolTip
    //HT: if CSH's tooltip need to same as SBK, then please copy from SBK
    //#endregion

    //#region console.log
    if (typeof console == "undefined") {
        window.console = {
            log: function () { }
        };
    }

    //console.log("Now you can use this to log for troubleshooting purpose in any pages. View logs in browser's console tab.");
    //#endregion

    $.fx.speeds._default = 300; // change default animation like show hide speed from 400ms to faster a bit
	
	
	
});
