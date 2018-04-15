//Getting the query string objectalert(0);
var urlParams;
(window.onpopstate = function () {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
})();


var LanguageController = function () {

    this.setCookies = function (callback){
        if(typeof urlParams.language != 'undefined'){
            setLocale(urlParams.language,false,callback);
        }else if (typeof $.cookie("Language") === 'undefined' || $.cookie("Language") == "" || $.cookie("Language") == null) {
            return setLocale("zh-CN",false,callback);
        }else{
            return callback();
        }
    }

    this.setActive = function () {
        $('body').addClass("zh-CN");
        
        $('.language-selection li').each(function (i) {
            var value = $(this).attr('name');
            console.log(value)
            if (value == $.cookie("Language")) {
                $(this).addClass('active');


                $('body').addClass(value);
                $("#showLanguageList").addClass(value).text($(this).text());;
                $("#lanslist").addClass(value);
                $("#HeaderControl1_HeaderTopLinksControl2_SwitchLanguageControl1_lbLanguageName").text($(this).text());;
            } else {
                $(this).removeClass('active');
            }
            
        }).click(function (e) {
            // Prevent a page reload when a link is pressed
            e.preventDefault();
            $.sessionStorage('validator',null);
            setLocale(this.attributes['name'].value,true);
        });
    }

    this.generateLanguage = function () {
        var languagesSelection = $('.language-selection');
        var languagesPackage = viewModel.languages();

        //Auto append languages packages
        $.each(languagesPackage, function (key, item) {
            if (key != 0) {
                languagesSelection.append('<li name="' + item.code + '"><a href="" class="'+item.code+'">' + item.descr + '</a></li>');
            }
        });
    }

    this.run = function () {
        this.generateLanguage();
        this.setActive();
    }
}


var resource = {};

function getValidator() {
    var res = $.sessionStorage("validator");

    if (res != null)
        return JSON.parse(res);

    // Fetch from server if item not found in session
    $.ajax({
        url: "/Api/Web/Validator",
        type: "GET",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        async: false,
        success: function (data) {
            res = data;
        }
    });

    // And store it client session for future use
    $.sessionStorage("validator", JSON.stringify(res));

    return res;
}

var ProcessLoader = function() {
    
    var self = this;
    //Create Element
    $(document).ready(function () {
        $('body').prepend("<div id='processingDiv' class='mask'></div>");
    });

    this.run = function(){
        //transition effect		
        $('#processingDiv').fadeIn("fast");
        $('#processingDiv').fadeTo("slow", 0.8);
        $("body").css("overflow", "hidden");
    }

    this.stop = function(){
        $('#processingDiv').fadeOut("fast");
        $("body").css("overflow", "");
    }
}

var Country = function (code, descr) {
    this.code = code;
    this.descr = descr;
}

var Currency = function (code, descr) {
    this.code = code;
    this.descr = descr;
}

var Language = function (id, code, descr) {
    this.id = id;
    this.code = code;
    this.descr = descr;
}

var DialCode = function (code, descr) {
    this.code = code;
    this.descr = descr;
}

var ChatTool = function (code, descr) {
    this.code = code;
    this.descr = descr;
}

var Label = function (code, descr) {
    this.code = code;
    this.descr = descr;
}

var SecurityQuestion = function (code, descr) {
    this.code = code;
    this.descr = descr;
}

var StaticContent = function(lang, resname) {
    this.language = lang;
    this.resourceName = resname;
}

function showClock(){
    $('.clock .time').jclock({
        format: '%H:%M:%S'
    });

    var now = new Date();
    var tz = -1 * now.getTimezoneOffset() / 60;

    tz = tz >= 0 ? '+' + tz : tz;

    $('.clock .timezone').html('(GMT' + tz + ')');

}

function reloadCaptcha() {
    d = new Date();
    $(".captcha").attr("src", "/Captcha.ashx?" + d.getTime());
}

function logout() {
    var url = "/Api/Web/Logout";
    var redirect = "/Default.htm";

    if (confirm($('#confirm-logout-msg').text()) == false) {
        return false;
    }

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Status == 0)
                window.location.href = redirect;
            else
                alert(data.Message);
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function getCountry() {
    var country = $.sessionStorage("country");
   
    if (country != null)
        return JSON.parse(country);

    // Fetch from server if item not found in session
    $.ajax({
        url: "/Api/Web/CountryContact/1",
        type: "GET",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        async: false,
        success: function (data) {
            country = data;
        }
    });

    // And store it client session for future use
    $.sessionStorage("country", JSON.stringify(country));

    return country;
}

function loadLogo() {
    $("#HeadContainer").addClass($.cookie("Language"));
}

function loadSecurityQuestion(model) {
    return $.ajax({
        url: "/Api/Web/SecurityQuestions",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        success: function (data) {
            model.securityquestions.push(new SecurityQuestion("", "--------------------"));
            $.each(data, function (index, item) {
                model.securityquestions.push(new SecurityQuestion(item.Code, item.Descr));
            });
        }
    });
}

function loadCountryCode() {
    countryCode = {};
    var data = getCountry();

    $.each(data, function (index, item) {
        countryCode[item.Code] = item.DialCode;
    });
}


function loadCountry(model) {
    /*
    //Add High Piriority
    var highPriorityCountryList = ['CN', 'VN', 'ID', 'TH', 'KH', 'JP', 'KR', 'GB', 'BR'];
    var popularCountry = [];
    var restrictedCountries = ['SG','HR','HU'];

    return $.ajax({
        url: "/Api/Web/Country/1",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        success: function (data) {
            
            model.countries.push(new Country("", "--------------------"));
            $.each(data, function (index, item) {
                if(indexOf.call(restrictedCountries, item.Code) < 0){
                    if (indexOf.call(highPriorityCountryList, item.Code) > -1) {
                        popularCountry.push(new Country(item.Code, item.Description));
                    } else {
                        model.countries.push(new Country(item.Code, item.Description));
                    }
                }
            });

            //Sort the country base on highPiriorityCountryList
            for (var i = highPriorityCountryList.length; i >= 0; i--) {
                for (var j = 0; j < popularCountry.length; j++) {
                    if (highPriorityCountryList[i] === popularCountry[j].code)
                        model.countries.unshift(new Country(popularCountry[j].code, popularCountry[j].descr));
                }
            }
            model.countries.unshift(new Country("", "--------------------"));

        }
    });
    */
}

function loadCurrency(model) {
    /*
    return $.ajax({
        url: "/Api/Web/Currency/1",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        success: function (data) {

            if (typeof model.allCurrencies != 'undefined') {
                $.each(data, function (index, item) {
                    model.allCurrencies.push(new Currency(item.Code, item.Code));
                });

                currencyFilter(model);
            } else {
                $.each(data, function (index, item) {
                    model.currencies.push(new Currency(item.Code, item.Code));
                });
            }
        }
    });
    */
}

function currencyFilter(model, countryCode) {
    countryCurrency = {};
    var allCurrencies = model.allCurrencies();

    //*** Modify Common Currency Here ***
    var allowedCurrencies = ['EUR', 'GBP', 'USD'];

    //clear currencies
    model.currencies.removeAll();

    //***Add Special Country List Here ***
    countryCurrency['JP'] = ['JPY'];
    countryCurrency['KR'] = ['KRW'];
    countryCurrency['BR'] = ['BRL'];
    countryCurrency['CN'] = ['RMB'];
    countryCurrency['ID'] = ['IDR'];
    countryCurrency['MY'] = ['MYR'];
    countryCurrency['TH'] = ['THB'];
    countryCurrency['VN'] = ['VND'];

   
    //Prepend Special Country Currency
    if (typeof countryCode != 'undefined' && typeof countryCurrency[countryCode] != 'undefined') {
        for (k = 0; k < countryCurrency[countryCode].length; k++) {
            allowedCurrencies.unshift(countryCurrency[countryCode][k]);
        }
    }

    model.currencies.push(new Currency("", "--------------------"));
    
    //Populate Currency
    for (var i = 0; i < allCurrencies.length; i++) {
        for (var j = 0; j < allowedCurrencies.length; j++) {
            if (allCurrencies[i].code == allowedCurrencies[j]) {
                model.currencies.push(new Currency(allCurrencies[i].code, allCurrencies[i].code));
            }
        }
    }
}

//加载语言
function loadLanguage(model) {

    // return $.ajax({
    //     url: "/Api/Web/Language/1",
    //     contentType: "application/json; charset=UTF-8",
    //     dataType: "json",
    //     success: function (data) {
    //         model.languages.push(new Language("","", "--------------------"));
    //         $.each(data, function (index, item) {
    //             model.languages.push(new Language(item.Id, item.Code, item.Descr));
    //         });
    //     }
    // });
}

function loadCommonLabel(param,model) {

    //Example Param
    //var param = { keys: "how.it.works, commission.plan, live.chat" };

    $.ajax({
        url: "/Api/Web/Label",
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(param),
        async: false,
        success: function (data) {
            $.each(data, function (index, item) {
                model.commonLabel.push(new Label(item.Code + '.label', item.Descr));
            });
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
  
}


function loadLabel(param, model) {
    //Example Param
    //var param = { keys: "how.it.works, commission.plan, live.chat" };

    $.ajax({
        url: "/Api/Web/Label",
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(param),
        async: false,
        success: function (data) {
            $.each(data, function (index, item) {
                model.label.push(new Label(item.Code + '.label', item.Descr));
            });
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function loadDialCode(model) {
    /*
    return $.ajax({
        url: "/Api/Web/DialCode",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        success: function (data) {
            model.dialcodes.push(new DialCode("", "--------"));
            $.each(data, function (index, item) {
                model.dialcodes.push(new DialCode(item.Code, item.Descr));
            });
        }
    });
    */
}

function loadChatTool(model) {
    /*
    return $.ajax({
        url: "/Api/Web/ChatTools",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        success: function (data) {
            model.chattools.push(new ChatTool("", "--------"));
            $.each(data, function (index, item) {
                model.chattools.push(new ChatTool(item.Code, item.Descr));
            });
        }
    });
    */
}


function setLocale(selectedLanguage,isReload,callback){
    $.ajax({
        url: "/LocaleHandler?lang=" + selectedLanguage,
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $.cookie("Language", selectedLanguage, { path: '/' });

            if (isReload == true) {
                if (typeof urlParams.language != 'undefined') {
                    window.location.href = updateQueryStringParameter(window.location.href, 'language', selectedLanguage);
                } else {
                    window.location.reload();
                }

            }else{
                //Successful callback
                callback();
            }
            
        },
        error: function(error){
            return setLocale("en", true);
        }
    });
}

function updateQueryStringParameter(uri, key, value) {
       
  var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  var page = uri.slice(uri.indexOf('#!/'));
  
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2' + page);
  }
  else {
    return uri + separator + key + "=" + value + page;
  }
}

function clearQueryString() {
    /*
    if (window.location.search != "") {
        window.location.search = "";
    }
    */
}

function requireCdnView(view) {
    return function (page, callback) {

        var param = new StaticContent($.cookie("Language"), view + '.htm');
        var url = '/Api/Web/StaticContentsResourceUrl';

        $.ajax({
            url: url,
            type: "PUT",
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(param),            
            success: function (resourceUrl) {

                $.get(resourceUrl, function (data) {
                    $(page.element).html(data);
                })
                .fail(function (Error) {
                    if (Error.status == 404) {
                        $.get('Views/Content/' + $.cookie("Language") + '/PageNotFound.htm', function (data) {
                            $(page.element).html(data);
                        });
                    }
                });

            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });

        //var resourceUrl = 'http://doc-cdn.local.com/Contents/aff/en/' + view + '.htm?v=10';

    };
}

function bindGoto188Button() {

    var url = "https://www.188bet.com";

    $.getJSON("/Api/Web/RedirectTo188MemberSite", function (data) {
        if (data.Status === 0) url = data.Message;
        $("#goto188").attr("href", url);
    });

    //var subdomain = location.hostname.substr(location.hostname.indexOf('.') + 1);
    //if (location.hostname !== "localhost")
    //    url = location.protocol + "//www." + subdomain;
    //$("#goto188").attr("href",url);
}

//Custom KO Binder For Labeling
ko.bindingHandlers.labelTemplate = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var code = valueAccessor()[0] + '.label';
        var labelObj = valueAccessor()[1];
        $.each(labelObj, function (key, item) {
            if (item.code == code) {
                return $(element).html(item.descr);
            }
        });
    }
};

//Custom KO Binder For Labeling
ko.bindingHandlers.titleTemplate = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var code = valueAccessor()[0] + '.label';
        var labelObj = valueAccessor()[1];
        $.each(labelObj, function (key, item) {
            if (item.code == code) {
                return $(element).attr("title", item.descr);
            }
        });
    }
};

//Custom KO Binder For placeholder
ko.bindingHandlers.customPlaceHolderTemplate = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var code = valueAccessor()[0] + '.label';
        var labelObj = valueAccessor()[1];
        $.each(labelObj, function (key, item) {
            if (item.code == code) {
                return $(element).attr("placeholder", item.descr);
            }
        });
    }
};


//Get Unique in Array
Array.prototype.getUnique = function () {
    var u = {}, a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}


//IE 8 and below do not have the Array.prototype.indexOf method.
var indexOf = function (needle) {
    if (typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (needle) {
            var i = -1, index = -1;

            for (i = 0; i < this.length; i++) {
                if (this[i] === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle);
};



function isRake(productCode) {    
    //Rake products
    var rakeproducts = ['Mahjong'];
    return (rakeproducts.indexOf(productCode) > -1);
}