var ChangePasswordModel = function () {
    this.current = ko.observable("").extend({ required: true });
    this.newpass = ko.observable("").extend({ required: true, minLength: 6, maxLength: 16 });
    this.confirm = ko.observable("").extend({ required: true, equal: this.newpass });
}

function changePassword() {
    if (changePasswordViewModel.changePasswordModel.isValid() == false) {
        Control.Dialog.showAlert("",$("#fill-up-all-required-fields").text());
        return false;
    }

    var url = "/Api/Account/Password";
    var param = ko.toJSON(changePasswordViewModel.changePasswordModel);

    //Disable button
    $('#changePassword-btn-submit').addClass('disabled').attr("disabled", "disabled");

    param = JSON.parse(param);
    delete param.errors;

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(param),
        success: function (data) {
            Control.Dialog.showAlert("", data.Message);
            console.log(data);
            if (data.Status == 0) {
                console.log(data);
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        },
        complete: function (xhr, status) {
            changePasswordViewModel.changePasswordModel.confirm(null);
            changePasswordViewModel.changePasswordModel.current(null);
            changePasswordViewModel.changePasswordModel.newpass(null);
            //Re-enable button
            $('#changePassword-btn-submit').removeClass('disabled').prop('disabled', false);
        }
    });

    return false;
}

var labelParam = {
    keys: "current.password,new.password,confirm.new.password,submit,change.password"
};


var changePasswordViewModel = new ViewModel();
changePasswordViewModel.changePasswordModel = new ChangePasswordModel();

$(document).ready(function () {
    $("#subpage-loader").show();

    $("#changePassword-btn-submit").click(changePassword);

    // Wait for pulling sources
    $.when(loadLabel(labelParam, changePasswordViewModel)).then(function () {

        ko.applyBindings(changePasswordViewModel, document.getElementById("changePasswordView"));
        ko.validation.group(changePasswordViewModel.changePasswordModel).showAllMessages();

    });



});