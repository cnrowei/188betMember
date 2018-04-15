/// <reference path="../Lib/Jquery/jquery-1.9.1-vsdoc.js" />

//#region OpenHomeWindow
function OpenHomeWindow() {
    var $parent = window.opener ? window.opener : window.parent;
    if ($parent != window && !$parent.closed) {
        window.open($parent.location.href, $parent.name).focus();
        if (navigator.userAgent.indexOf('Chrome/') > 0) {
            $parent.blur();
            //window.close();
        }
        else
        //window.close();
            return false;
    } else {
        window.open(global.root, "", "left=0, top=0, resizable=1, scrollbars=1, width=" + screen.availWidth + ",height=" + screen.availHeight);
    }
}
//#endregion

$(function () {
    utility.MobilePromptMsg();
    if (typeof (BrowserDetection) != "undefined")
        browserUpgrade();
    //if ($('#impt-announcement').html() == "") $('#announcement-box').hide();

    //#region if maintenance then add class
    if (location.href.indexOf("forbidden") == -1) {
        $(global.mm).filter(function () { return this.isMt == true; }).each(function (index, obj) {
            switch (obj.mod) {
                case "pch":
                    $("#header ul.navs li." + obj.mod).addClass("maintain").prepend("<span class='wrench'></span>");
                    break;
                case "affiliate":
                    $("#footer li." + obj.mod).addClass("maintain").prepend("<span class='wrench'></span>");
                    utility.disableLinks("#footer li." + obj.mod + " a");
                    break;
                default:
                    $("#main-items li#" + obj.mod).addClass("maintain").prepend("<span class='wrench'></span>");
                    break;
            }
        });
    }
    //#endregion

    //#region for footer static links
    $("#header .menutitle,#footer .menutitle").each(function () {
        var $this = $(this);
        var id = "#drop_" + $this.attr('id');
        if ($(id + ' li').length > 0) {
            if (id == "#drop_regionlist")
                $this.dropdown({ contentId: "drop_" + $this.attr('id'), triggerEvent: "click", show: "auto", position: "left-top", hideSpd: 400, width: $this.closest('li').width() + 2 });
            else
                $this.dropdown({ contentId: "drop_" + $this.attr('id'), triggerEvent: "click", position: "left-bottom", hideSpd: 400, width: $this.closest('li.selector').width() + 15 });
        }
    });
    //#endregion

    //#region expand balance

    if (uv && uv.login) {
        var ExpandBalance = utility.cookie.read("ExpandBalance");
        if (ExpandBalance == null) {
            utility.cookie.write("ExpandBalance", true, { expires: 0, path: '/' });
        }
        HomeJS.expandBalance();
    }
    //#endregion

    //#region drop_regionlist events
    $('#drop_regionlist').on('click', 'a', function () {
        if (!uv.login) {
            uv.pd.r = $(this).attr('class');
            uv.pd.l = $(this).data('primarylang');
            var jsonstr = JSON.stringify(uv.pd);
            utility.cookie.write("prefer", jsonstr, { expires: 0, path: '/' });
            utility.service("UserService", "SetPreferData", { Region: uv.pd.r }, "POST", function (data) {
                document.location.href = "/" + uv.pd.l + location.pathname.substr(location.pathname.indexOf('/', 1)) + location.search;
            });
        }
        return;
    });
    //#endregion

    //#region drop_themeslist events
    $('#drop_themeslist').on('click', 'a', function () {

        var preTheme = $(this).data('theme');
        $('head #themestyle').attr('href', '/Content/Public/CSS/Themes/' + preTheme + '-theme.css?v=' + global.rv);

        uv.pd.theme = preTheme;
        var jsonstr = JSON.stringify(uv.pd);
        utility.cookie.write("prefer", jsonstr, { expires: 0, path: '/' });
        var newtheme = preTheme + '-theme';
        $('#themeslist').removeClass().addClass('shade menutitle ' + newtheme);
     
        $(this).data('theme', preTheme == 'black' ? 'white' : 'black').html(preTheme == 'black' ? $("#shadeWhite").text() : $("#shadeBlack").text());
        /*
        utility.service("UserService", "SetPreferData", { Theme: preTheme }, "POST");
        if ($('#sbkFrame').length > 0 )
        {
        if (location.pathname.indexOf('/asia')!= 6)
        $('#sbkFrame')[0].contentWindow.cCtrl.changeTheme(newtheme);
        else
        $('#sbkFrame')[0].thmo.switchtheme(newtheme);
        }
        */
    });
    //#endregion

    $('div[id^="drop_"]').on('click', 'a', function () {
        var target = $(this).closest('div').attr('id').replace('drop_', '');
        $('a#' + target).dropdown("hide");
    });

    if ($('div.banner-slider').find('ul li').length > 1)
        $('div.banner-slider:not(".bmt")').blueberry({ interval: 6000, hoverpause: true });

    //#region dynamicResolution
    dynamicResolution();
    $(window).resize(dynamicResolution);
    //#endregion

    //#region for indicating the active Menu Item
    var KeyValue = $("input.KeyValue").val();
    $("a." + KeyValue + "").addClass("selected");
    //#endregion

    //#region remember selected language
    if (window.global) {
        utility.cookie.write("lan", window.global.lan);
    }
    //#endregion

    //#region add this code for Clock in page Header
    $(".time-wrapper").html("<span class='clock-face'><span class='hour'><span class='minute'></span></span></span><span id='lbClock' class='time-text'></span><span class='time-zone' id='tzgmt'>(GMT " + uv.tz + ")</span>");
    ClockJS.initTimeClock(uv.tzoff, uv.svrDt, uv.utcDate);
    //#endregion

    // Announcement at the top of page
    //$("#marquee").marquee({ speed: 10000, gap: 50, delayBeforeStart: 500, direction: 'left', duplicated: false, pauseOnHover: true });
    $('#marquee').marquee({ loop: -1, showSpeed: 500, pauseSpeed: 2000, scrollSpeed: 15, yScroll: 'down' });

    // TODO: check the best place for this code   */
    $(".txt-date").datepicker({ showOn: 'button', buttonImage: '//Content/Public/Images/MyAccount/DateIcon.jpg', buttonImageOnly: true, maxDate: '+0d', minDate: '-1m' });

    //Check Auth and Refresh
    //setInterval('utility.checkRefresh();', 30000);

    //#region Important Announcements
    if (IAnnJS) {
        var $iann = $("#iptAnns div.headline");
        IAnnJS.headline_count = $iann.size();
        if (IAnnJS.headline_count > 0) {
            $("div#iptAnns #content").animate({ height: $($iann[IAnnJS.current_headline]).height() + 10 });
            $($iann[IAnnJS.current_headline]).css('top', '5px');
            if (IAnnJS.headline_count > 1) {
                setInterval(IAnnJS.headline_rotate, 5000);
            }
        }
    }
    //#endregion

    $('#footer ul.footer-text li a:visible:last').closest('li').addClass('last');
    $('#footer li:has(a:hiddenSelf)').hide();

    var sportsView = utility.cookie.read('sportsView');
    if (sportsView) {
        if ($('body').hasClass('sports'))
            sportsView = location.pathname.toLowerCase().indexOf(global.lan + '/asia') != -1 ? "2" : "1";

        uv.pd.sv = sportsView;
        $('#main-items li#sportsx a').attr('href', sportsView != 2 ? '/sports' : "/" + global.lan + '/asia');
        utility.cookie.write('sportsView', uv.pd.sv, 100);
    }

    //#region popup modal screen
    $("a.popup-div").click(function (event) {
        var info = utility.parseToSizeInfo(this.className);
        utility.popupUrl(this.href, info.id, info.width, info.height);
        event.stopPropagation();
        event.preventDefault();
    });
    //#endregion

    //#region popup normal new window
    $("body").on("click", 'a.popup-new', function (event) {
        if ($(this).attr('href') == "javascript:void(0)") return;
        utility.popupNewWin(event, this);
    });
    //#endregion

    //#region goto-home events
    $("a.goto-home").click(function () {
        OpenHomeWindow(); //check and open home page window
    });
    //#endregion

    //#region this logic must be after attaching click for 'popup modal screens'. isu = is sign up
    var isu = utility.cookie.read("?sign-up") == "1" || location.hash == "#register";
    if (isu && uv && !uv.login) {
        // In Star2, opens a new window for the register page
        // Option 1, use the window open 
        // URL needs to inlucde the language parameter
        //$location = $(window.location);
        //var registerUrl = $location.attr('protocol') + '//' + $location.attr('host') + '/' + $location.attr('pathname').split('/')[1] + '/user/register';
        //var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
        //window.open(registerUrl, "register", strWindowFeatures); 

        // Option 2, trigger the sign-up link
        $("#sign-up .sign-up").trigger("click");

        $("#preLogin .signup a.join").trigger("click");
        utility.cookie.write("?sign-up", "0");
    }
    //#endregion

    //#region show deposit dialog
    if (uv && uv.login && uv.mtid != 3) {
        var Showed = utility.cookie.read("DialogShowed");
        if (Showed != null) return;

        if (uv.sdd.toLowerCase() == "true") {
            utility.popupUrl("/" + global.lan + "/depositdialog", "depositdialog", 270, 160);
            utility.cookie.write("DialogShowed", true, { expires: 0, path: '/' });
            return false;
        }
    } else {
        $("#btn-Announce").click(false);
    }
    //#endregion

    //#region fix IE has extrenal footer space
    $('html').css("height", "");
    //#endregion
});

//#region browserUpgrade
function browserUpgrade() {
    if (BrowserDetection && BrowserDetection != null)
        BrowserDetection.init();
}
//#endregion

//#region dynamicResolution
function dynamicResolution() {
    if (location.pathname.indexOf('lobby') != -1 || location.pathname.indexOf('user') != -1 || location.pathname.indexOf('info') != -1 || location.pathname.indexOf('corporate-affairs') != -1) return;
    if ($('div.maintain-frame').length > 0) return;

    var w = $(window).width();
    var prod = window.location.pathname.substring(6);
    var c = w < 1240 ? "res1024" : (w >= 1440 ? "res1440" : "res1280");
    $('body').removeClass('res1024 res1440 res1280 res-fullwidth').addClass(c);
    HomeJS.adjustContainer();
}
//#endregion

//#region openDeposit
function openDeposit() {
    var obj = $('a#depLink').get(0);
    if (typeof (obj) == "undefined") return;

    var info = utility.parseToSizeInfo(obj.className);
    utility.popupUrlWin(obj.href, info, "188BET");
}
//#endregion