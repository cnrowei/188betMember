var ForgetPasswordModel = function () {
    self = this;
    this.username = ko.observable('').extend({ required: true });
    this.password = ko.observable('');
    this.question = ko.observable('');
    this.answer = ko.observable().extend({ required: true });
}
var labelParam = {
    keys: "forgot.password,username,continue,security.question,security.answer,click.to.contact.us,sub.forgot.your.password,cancel"
};

var forgetPasswordViewModel = new ViewModel();

forgetPasswordViewModel.forgetPasswordModel = new ForgetPasswordModel();

// function generateNewPassword() {
//     var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
//     var string_length = 8;
//     var randomstring = '';

//     for (var i = 0; i < string_length; i++) {
//         var rnum = Math.floor(Math.random() * chars.length);
//         randomstring += chars.substring(rnum, rnum + 1);
//     }
    
//     forgetPasswordViewModel.forgetPasswordModel.password(randomstring);
// }

/*
function validateUser() {
    var url = "/Api/Account/ForgetPassword/";
    var username = forgetPasswordViewModel.forgetPasswordModel.username();
    
    if (forgetPasswordViewModel.forgetPasswordModel.username() == '') {
        Control.Dialog.showAlert('', $('#fill-up-all-required-fields').text());
        return false;
    }   

    $('#forgetPassword-continue-btn').addClass('disabled').attr("disabled", "disabled");

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(username),
        beforeSend: function () { processing.run(); },
        success: function (data) {
            if (data.Status == 0) {
                if (data.Message != "___SEQURITY_QUESTION___") {

                    forgetPasswordViewModel.forgetPasswordModel.question(data.Message);
                    
                    $("#secQuestionModal").modal('show');
                    
                    //Generate An Random Password
                    generateNewPassword(); processing.stop();
                } else {
                    Control.Dialog.showAlert('', $("#no-security-question").text());
                }

            } else {
                Control.Dialog.showAlert('', data.Message);
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        },
        complete: function (xhr, status) {
            //Enable submit button
            $('#forgetPassword-continue-btn').removeClass('disabled').removeAttr("disabled");
            processing.stop();
        }
    });
}

function submitSecurityAnswer() {
    var url = "/Api/Account/ResetPassword";
    var param = ko.toJSON(forgetPasswordViewModel.forgetPasswordModel);

    if (forgetPasswordViewModel.forgetPasswordModel.answer() == null) {
        Control.Dialog.showAlert('', $('#fill-up-all-required-fields').text());
        return false;
    }

    processing.run();

    $('#forgetPassword-submit-btn').addClass('disabled').attr("disabled", "disabled");
   
  
    //Remove unused properties
    param = JSON.parse(param);
    delete param.question;
    delete param.errors;

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(param),
        success: function (data) {
            if (data.Status == 0) {
                $("#secQuestionModal").modal('hide');
                forgetPasswordViewModel.forgetPasswordModel.username("");
                forgetPasswordViewModel.forgetPasswordModel.password("");
                forgetPasswordViewModel.forgetPasswordModel.question("");
                forgetPasswordViewModel.forgetPasswordModel.answer("");
                pager.goTo("#!/SuccessfulRecovery");

            } else {
                Control.Dialog.showAlert('', data.Message);
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        },
        complete: function (xhr, status) {
            //Enable submit button
            processing.stop();
            $('#forgetPassword-submit-btn').removeClass('disabled').removeAttr("disabled");
        }
    });
}

*/

$(document).ready(function () {
    //Set Background White
    $("#page-holder").css('background', 'none');

    //Declare Dialog
    /*
    $("#secQuestionModal").dialog({
    autoOpen: false,
    title: 'title',
    modal: true,
    width: "680",
    buttons: [{
    text: $("#btn-continue").text(),
    click: function () {
    submitSecurityAnswer();
    }
    }, {
    text: $("#btn-cancel").text(),
    click: function () {
    $(this).dialog("close"); 
    }
    }]
    });
    */


    //$("#forgetPassword-continue-btn").click(validateUser);
    //$("#forgetPassword-submit-btn").click(submitSecurityAnswer);
    $("#forgetPassword-cancel-btn").click(function () { $("#secQuestionModal").modal('hide'); });
    ko.applyBindings(forgetPasswordViewModel, document.getElementById('forgetPasswordView'));
    ko.applyBindings(forgetPasswordViewModel, document.getElementById('secQuestionModal'));
    ko.validation.group(forgetPasswordViewModel.forgetPasswordModel).showAllMessages(true);

    // Wait for pulling sources
    $.when(loadLabel(labelParam, forgetPasswordViewModel)).then(function () {

        $("#forgetPasswordView").show();
    });

});