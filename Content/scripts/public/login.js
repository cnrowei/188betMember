var LoginModel = function () {
    self = this;
    this.username = ko.observable('').extend({ required: true });
    this.password = ko.observable('').extend({ required: true });
}

var labelParam = {
    keys: "forgot.password,username,continue,login.system,click.to.contact.us,sub.forgot.your.password,cancel"
};

var loginViewModel = new ViewModel();
loginViewModel.loginModel = new LoginModel();


$(document).ready(function () {

    $("#formlogin").bind("click", function (e) {
        e.preventDefault();

        if ($("#txtNameMask").val() == "") {
            Control.Dialog.showAlert($("#formlogin").text(), $("#empty-username").text());
            return false;
        }

        if ($("#txtPassMask").val() == "") {
            Control.Dialog.showAlert($("#formlogin").text(), $("#empty-password").text());
            return false;
        }

        if (isCaptchaRequired()) {
            openCaptcha();
        } else {
            login();
        }
    });
    //Set Background White
    $("#page-holder").css('background', 'none');

    ko.applyBindings(loginViewModel, document.getElementById('loginView'));

    // Wait for pulling sources
    $.when(loadLabel(labelParam, loginViewModel)).then(function () {

        $("#loginView").show();
    });

});