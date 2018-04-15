//Redirect to pager form.

//var pathname = window.location.pathname;

//if (pathname.indexOf("/Views/Content/Register.htm") >= 0) {
//    var queryString = window.location.search;

//    alert(queryString);
//    var url = "#!/Register";
//    var destination = '/' + queryString + url;
//    alert(destination);
//    //redirecting
//    //window.location.href = destination;
//}

var RegisterViewModel = function () {
    this.commonLabel = ko.observableArray();
    this.label = ko.observableArray();
}

var AffProfile = function (name, value, descr) {
    this.fieldname = name;
    this.fieldvalue = ko.observable(value);
    this.description = descr;
}

var AffiliateNewModel = function () {
    var self = this;

    this.captcha = ko.observable().extend({
        required: true
    });
    this.parentid = ko.observable();
    this.username = ko.observable().extend({
        required: true,
        pattern: {
            message: $('#register-invalidFormat').text(),
            params: '^[a-zA-Z0-9]+$'
        },
        minLength: {
            message: $('#register-invalidLength').text(),
            params: 5
        },
        maxLength: {
            message: $('#register-invalidLength').text(),
            params: 15
        }
    });
    this.password = ko.observable().extend({
        required: true,
        minLength: 6,
        maxLength: 16
    });
    this.confirm = ko.observable().extend({
        required: true,
        equal: this.password
    });
    this.lastname = ko.observable().extend({
        required: true
    });
    this.firstname = ko.observable().extend({
        required: true
    });
    this.country = ko.observable().extend({
        required: true
    });
    this.language = ko.observable().extend({
        required: true
    });
    this.currency = ko.observable().extend({
        required: true
    });
    this.city = ko.observable().extend({
        required: true
    });
    this.address = ko.observable().extend({
        required: true
    });
    this.postal = ko.observable().extend({
        required: true,
        maxLength: 20
    });
    this.dialcode = ko.observable();
    this.contactno = ko.observable().extend({
        required: true,
        digit: true,
        maxLength: 16
    });
    this.email = ko.observable().extend({
        required: true,
        email: true,
        maxLength: 50
    });
    this.chattool = ko.observable().extend({
        maxLength: 20
    });
    this.chataddress = ko.observable().extend({
        maxLength: 50
    });
    self.ownwebsite = ko.observable().extend({
        required: true
    });
    this.weburl = ko.observable().extend({
        required: {
            onlyIf: function () {
                return self.ownwebsite() == 1;
            }
        },
        maxLength: 256
    });
    this.describe = ko.observable().extend({
        required: {
            onlyIf: function () {
                return self.ownwebsite() == 0;
            }
        },
        maxLength: 256
    });

    this.profilelist = ko.observableArray();
    this.iOvationBlackbox = ko.observable();
}

function getProfile() {
    var url = "/Api/Account/Profile";

    $.getJSON(url, function (data) {

        affNewModel.username('');
        affNewModel.password('');
        affNewModel.confirm('');
        affNewModel.lastname('');
        affNewModel.firstname('');
        affNewModel.country(data.Country);
        affNewModel.language('');
        affNewModel.currency('');
        affNewModel.city('');
        affNewModel.address('');
        affNewModel.postal('');
        affNewModel.dialcode(data.Country);
        affNewModel.contactno('');
        affNewModel.email('');
        affNewModel.ownwebsite('');
        affNewModel.chattool('');
        affNewModel.chataddress('');
        affNewModel.weburl('');
        affNewModel.describe('');
        affNewModel.captcha('');
        affNewModel.errors = ko.validation.group(affNewModel);

        $.each(data.ProfileList, function (index, item) {
            affNewModel.profilelist.push(new AffProfile(item.FieldName, item.FieldValue, item.Description));
        });

        //If invitee email exist
        withEmail();

        //If referrer ID exist
        withReferrer();

        promoteOptions();

        //Change the validation css
        $("#captcha-input").next().css('display', 'inline-block');
    });
}

function promoteOptions() {
    if ($("#with-website").is(':checked')) {
        $("#web-address").prop('disabled', false);
    } else {
        $("#web-address").prop('disabled', true);

    }

    if ($("#without-website").is(':checked')) {
        $("#promote-reason").prop('disabled', false);
    } else {
        $("#promote-reason").prop('disabled', true);
    }
}

function agreementOption() {
    $('#agree').click(function () {
        if ($('#agree').is(':checked')) {
            $('#form-register-submit').removeClass('disabled')
                .removeAttr("disabled");
        } else {
            $('#form-register-submit').addClass('disabled')
                .attr("disabled", "disabled");
        }
    });
}

function submitNewAff() {

    if (affNewModel.isValid() == false) {
        Control.Dialog.showAlert('', $('#fill-up-all-required-fields').text());
        return false;
    }

    affNewModel.iOvationBlackbox = GetIovationBlackBox(1);
    
    var url = "/Api/Account/Register";
    var param = ko.toJSON(affNewModel);

    //Disable submit
    $('#form-register-submit').addClass('disabled').attr("disabled", "disabled");

    //Remove unused properties
    param = JSON.parse(param);


    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(param),
        async: true,
        beforeSend: function () {
            processing.run();
        },
        success: function (data) {
            if (data.Status == 0) {
                pager.goTo("#!/SuccessfulRegistration");
            } else {
                reloadCaptcha();
                Control.Dialog.showAlert('', data.Message);
            }

        },
        error: function (xhr, status, error) {
            alert(error);
            $('#form-register-submit').removeClass('disabled').removeAttr("disabled");
        },
        complete: function (xhr, status) {
            //Enable submit button
            $('#form-register-submit').removeClass('disabled').removeAttr("disabled");
            processing.stop();
            //dialog.parent().find(".ui-dialog-buttonset > button:first").prop("disabled", false).removeClass("ui-state-disabled");
        }
    });

    return false;
}

function checkUsername() {
    var username = $("#username-input").val();
    var url = "/Api/Account/CheckUsername/";
    var nameRegex = /^(\d|[a-zA-Z])+$/;

    if (username == '') {
        Control.Dialog.showAlert('', $("#empty-username").text());
        $("#validate-username-response").text('');
        return false;
    }
    console.log(nameRegex.test(username));
    if (!nameRegex.test(username) || !(username.length >= 5 && username.length <= 15)) {
        $("#validate-username-response").removeClass().text('');
        Control.Dialog.showAlert('', $("#register-invalidUserName").text());
        return false;
    }

    $('#validate-username').addClass('disabled').attr("disabled", "disabled");

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(username),
        success: function (data) {

            if (data.Status == 0) {
                $("#validate-username-response").removeClass().css("color", "red").text(data.Message);
                $("#username-avaibility").val(data.Status);
            } else {
                $("#validate-username-response").removeClass().css("color", "green").text(data.Message);
                $("#username-avaibility").val(data.Status);
            }

            $("#validate-username-response").show();
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });

    $('#validate-username').removeClass('disabled').removeAttr("disabled");
}


function checkEmail(e) {
    if (typeof e == 'undefined') {
        var email = $("#email").val().replace(/\s+/g, '');

        if (email == '') {
            Control.Dialog.showAlert('', $("#empty-email").text());
            $("#validate-email-response").text('');
            return false;
        }
    } else {
        var email = e;
    }

    var url = "/Api/Account/CheckEmail/" + email;


    $('#validate-email').addClass('disabled').attr("disabled", "disabled");


    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(email),
        success: function (data) {

            if (data.Status == 0) {
                $("#validate-email-response").removeClass().css("color", "green").text(data.Message);
                $("#email-avaibility").val(data.Status);
            } else {
                $("#validate-email-response").removeClass().css("color", "red").text(data.Message);
                $("#email-avaibility").val(data.Status);
            }

            $("#validate-email-response").show();
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });

    $('#validate-email').removeClass('disabled').removeAttr("disabled");
}

function withEmail() {
    if (typeof urlParams.email != 'undefined' && urlParams.email != '') {
        affNewModel.email(urlParams.email);
        $('#email').attr("disabled", "disabled");
        checkEmail(urlParams.email);
        $('#validate-email').addClass('disabled').attr("disabled", "disabled");
    }
}

function withReferrer() {

    if (typeof urlParams.ref != 'undefined' && urlParams.ref != '') {
        affNewModel.parentid(urlParams.ref);
    }
}

var labelParam = {
    keys: "register,general.information,term.and.condition,login.information,username,password,confirm.password,general.account.information,email,faq," +
        "lastname,first.name,country,contact.number,address,city,postal.code.zip,massenger,preferred.language,preferred.currency,website.information,promotion.method,mandatory.prefered.currency.info," +
        "i.have.website,web.address,i.dont.have.website,term.and.conditions.content,submit,company.loss.message,check,additional.information, affiliate, sub.affiliate.register, check.avaibility, promotion.method.without.website," +
        "submit.registration, pls.type.captcha"
};

var affNewModel = new AffiliateNewModel();
var registerViewModel = new RegisterViewModel();



$(document).ready(function () {
    //Set Background Image None
    $("#page-holder").css('background', 'none');

    $("#form-register-submit").click(submitNewAff);
    $("#with-website , #without-website").click(promoteOptions);

    $("#captcha-input").keyup(function () {
        $("#captcha-input").next().css('display', 'inline-block')
    });

    $("#validate-username").click(function (e) {
        e.preventDefault();
        checkUsername();
    });
    $("#validate-email").click(function (e) {
        e.preventDefault();
        checkEmail();
    });

    // Wait for pulling sources
    $.when(loadLabel(labelParam, registerViewModel), getProfile()).then(function () {

        // Subscribe to country and update the dial code when new country selected
        affNewModel.country.subscribe(function (selected) {
            affNewModel.dialcode(countryCode[selected]);
        });

        // Subscribe to country and update the currency when new country selected
        affNewModel.country.subscribe(function (selected) {
            currencyFilter(viewModel, selected);
        });

        ko.applyBindings(registerViewModel);
        ko.applyBindings(affNewModel, document.getElementById("register-form"));

        $("#registerView").show();

        agreementOption();

        //alert(affNewModel.parentid());

    });

});