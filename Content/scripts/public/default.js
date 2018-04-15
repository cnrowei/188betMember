var ViewModel = function () {
    this.languages = ko.observableArray();
    this.countries = ko.observableArray();
    this.allCurrencies = ko.observableArray();
    this.currencies = ko.observableArray();
    this.dialcodes = ko.observableArray();
    this.chattools = ko.observableArray();
    this.securityquestions = ko.observableArray();
    this.commonLabel = ko.observableArray();
    this.label = ko.observableArray();
    this.Content = ko.observable();
    this.FailedLoginCount = ko.observable();

}

var viewModel = new ViewModel();

var Lang = new LanguageController();

var processing = new ProcessLoader();

var labelParam = {
    keys: "how.it.works,commission.plan,promotions,goto.188,contact.us,join.now,forgot.password,username,password,login,empty.username.msg, "
        + "empty.email.msg,empty.password.msg,fill.up.all.required.fields.msg,no.security.question.msg,home,website.title,footer,faq,shade,white,continue,cancel,black,"
        + "register,general.information,faq,term.and.condition,BO_ANNOUNCE_MGNT,okayBtn,register.help.invalidFormat,register.help.invalidLength,register.help.invalidUserName,partner.wigan.warriors,partner.wigan.gloucestershire"
};


function sessionLostRedirection() {
    if (typeof urlParams.ReturnUrl != 'undefined') {
        window.location.hash = "";
        window.location.search = "";
    }
}

function isCaptchaRequired() {
    if (viewModel.FailedLoginCount() >=3)
        return true;

    return false;
}

function login() {

    processing.run();

    //var iOvationBlackbox = GetIovationBlackBox(1);
    var url = "/Api/Web/Login";
    var redirect = "/188/Member/";

    var param = { username: $("#txtNameMask").val(), password: $("#txtPassMask").val(), captcha: $("#failedLogin-captcha-input").val()};

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(param),
        async: true,
        success: function (data) {
            if (data.Params != null) {
                if (typeof data.Params.FailedLogin != 'undefined') {
                    //Get Failed Login Count
                    viewModel.FailedLoginCount(data.Params.FailedLogin);
                }
            }

            if (data.Status == 0) {
                //Set Preferred Language to Language Cookies
                $.cookie("Language", data.Params.CultureCode, { path: '/' });
                window.location.href = redirect;                
            } else {
                Control.Dialog.showAlert($("#btnLogin").text(), data.Message);
                reloadCaptcha();
                $("#failedLogin-captcha-input").val("");
            }

        },
        error: function (xhr, status, error) {
            alert(error);
        },
        complete: function () {
            processing.stop();
        }
    });
}


function openCaptcha() {
    //transition effect		
    $('#CaptchaMask').fadeIn(1000);
    $('#CaptchaMask').fadeTo("slow", 0.8);

    //Get the window height and width
    var winH = $(window).height();
    var winW = $(window).width();

    //Set the popup window to center
    $("#FailedLoginCaptcha").css('top', winH / 2 - $("#FailedLoginCaptcha").height() / 2);
    $("#FailedLoginCaptcha").css('left', winW / 2 - $("#FailedLoginCaptcha").width() / 2);

    //transition effect
    $("#FailedLoginCaptcha").fadeIn(2000);
}


function loadMessage() {
    var url = "/Api/Web/PublicMessage";

    return $.ajax({
        url: url,
        type: 'POST',
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(1),
        async: false,
        success: function (data) {
            if (data.Status == 0) {
                viewModel.Content(data.Content);
            } else {
                alert(data.Message);
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });

}

function loadIovationJavascriptSource() {
    var url = "/Api/Web/IovationJavascriptSource";

    return $.ajax({
        url: url,
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        success: function (data) {
            if (data) loadJS(data);
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });

}

function requireView(view) {
    return function (page, callback) {
        $.get('Views/Content/' + $.cookie("Language") + '/' + view + '.htm', function (data) {
            $(page.element).html(data);
        })
        .fail(function (Error) {
            if (Error.status == 404) {
                $.get('Views/Content/' + $.cookie("Language") + '/PageNotFound.htm', function (data) {
                    $(page.element).html(data);
                });
            }
        });
    };
}

function bindPage() {

    // use #!/ instead of the default #
    pager.Href.hash = '#!/';

    // extend your view-model with pager.js specific data
    pager.extendWithPage(viewModel);

    // apply the view-model using KnockoutJS as normal
    ko.applyBindings(viewModel);

    //Language
    Lang.run();

    // start pager.js
    pager.start();

    //Completed Load
    processing.stop();

}

function localeBasedLoader() {
    loadCommonLabel(labelParam, viewModel);    
    loadLogo();
}

function preLoader() {
    // Wait for all dropdowns datasource are loaded before doing binding
    $.when(loadSecurityQuestion(viewModel), loadCountry(viewModel), loadCurrency(viewModel),
        loadDialCode(viewModel), loadChatTool(viewModel), loadCountryCode(), loadMessage()).then(bindPage);
}


function loadJS(file) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "application/javascript";
    // make the script element load file
    jsElm.src = file;
    // finally insert the element to the body element in order to load the script
    document.body.appendChild(jsElm);
}

$(document).ready(function () {

    //loadIovationJavascriptSource();

    //Set the shade list color and width
    $('#themeslist').removeClass().addClass('shade menutitle ' + uv.pd.theme + '-theme');
    $('#drop_themeslist').css('min-width', '105px');

    //Loading all resources
    processing.run();

    //Loading Validator Resources
    var validator = getValidator();

    $.each(validator, function (index, value) {
        resource[value.MsgKey] = value.MsgVal;
    });

    bindGoto188Button();

    ko.validation.localize({
        required: resource['jquery.validator.required'],
        email: resource['jquery.validator.email'],
        equal: resource['jquery.validator.equalTo'],
        date: resource['jquery.validator.date'],
        dateISO: resource['jquery.validator.dateISO'],
        number: resource['jquery.validator.number'],
        digit: resource['jquery.validator.digits'],
        maxlength: resource['jquery.validator.maxLength'],
        minlength: resource['jquery.validator.minLength'],
        max: resource['jquery.validator.max'],
        min: resource['jquery.validator.min']
    });

    $("#btnLogin").bind("click", function (e) {
        e.preventDefault();

        if ($("#txtNameMask").val() == "") {
            Control.Dialog.showAlert($("#btnLogin").text(), $("#empty-username").text());
            return false;
        }

        if ($("#txtPassMask").val() == "") {
            Control.Dialog.showAlert($("#btnLogin").text(), $("#empty-password").text());
            return false;
        }

        if (isCaptchaRequired()) {
            openCaptcha();
        } else {
            login();
        }
    });

    $('#user-info').keypress(function (e) {
        var key = e.which;
        if (key == 13)
        {
            $('#btnLogin').click();
            return false;
        }
    });


    $("#btn-login-captcha").bind("click", function (e) {
        e.preventDefault();

        if ($("#failedLogin-captcha-input").val() == '') {
            return false;
        } else {
            login();
        }

    });


    //If Lost Session
    sessionLostRedirection();


    //if mask is clicked
    $('#CaptchaMask').click(function () {
        $(this).hide();
        $('.windowdial').hide();
        reloadCaptcha();
        $("#failedLogin-captcha-input").val("");
    });


    //Predefined Language and run preLoader

    Lang.setCookies(localeBasedLoader);
    preLoader();

});