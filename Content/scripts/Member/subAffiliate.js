var SubAffiliateModel = function () {
    var self = this;
    this.email = ko.observable().extend({ required: true });
    this.language = ko.observable().extend({ required: true });
    this.subAffiliateList = ko.observableArray();

}

var SubAffiliate = function (Code, Email, Name, Status) {
    this.Code = Code;
    this.Email = Email;
    this.Name = Name;
    this.Status = Status;
}

function isValidEmail(email) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(email);
};

function inviteSubAffiliate() {
    //If fail validation
    if (subaffiliateViewModel.subAffiliateModel.isValid() == false) {
        Control.Dialog.showAlert("", $("#fill-up-all-required-fields").text());
        return false;
    }

    var invalidEmail = "";
    var duplicateEmail = false;
    var emailArray = subaffiliateViewModel.subAffiliateModel.email().split(',');
    var url = "/Api/SubAffiliate/Invite";
    var param = ko.toJSON(subaffiliateViewModel.subAffiliateModel);


    //validate email
    for (var i = 0; i < emailArray.length; i++) {
        if (isValidEmail(emailArray[i]) == false)
            invalidEmail += emailArray[i] + " , ";

        for (var k = 0; k < emailArray.length; k++)
            if (k != i && emailArray[k] == emailArray[i])
                duplicateEmail = true;
    }


    //If invalid email exist
    if (invalidEmail != "") {
        Control.Dialog.showAlert("", invalidEmail + $("#not-valid-email-msg").text() + ".");
        return false;
    } else {
        //More than 10 email
        if (emailArray.length > 10) {
            Control.Dialog.showAlert("", $("#more-than-ten-email-msg").text());
            return false;
        }

        //Duplication Exist
        if (duplicateEmail == true) {
            Control.Dialog.showAlert("",emailArray.getUnique() + " " + $("#duplicated-msg").text() + ".");
            return false;
        }

        //disable button
        $('#subaffiliate-invite').addClass('disabled').attr("disabled", "disabled");

        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            data: JSON.stringify({ 'Language': subaffiliateViewModel.subAffiliateModel.language(), 'Email': emailArray }),
            beforeSend: function () { processing.run(); },
            success: function (data) {
                if (data.Status == 0) {
                    subaffiliateViewModel.subAffiliateModel.email("");
                    subaffiliateViewModel.subAffiliateModel.language("");
                    subaffiliateViewModel.subAffiliateModel.subAffiliateList.removeAll();
                    getSubbAffiliateList();
                } else {
                    Control.Dialog.showAlert("",data.Message);
                }

            },
            error: function (xhr, status, error) {
                alert(error);
            },
            complete: function (xhr, status) {
                processing.stop();
                //Enable submit button
                $('#subaffiliate-invite').removeClass('disabled').removeAttr("disabled");
            }
        });

    }

    return false;
   
}

function getSubbAffiliateList() {
    var url = "/Api/SubAffiliate/List";

    return $.ajax({
        url: url,
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        success: function (data) {
            $.each(data, function (index, item) {
                subaffiliateViewModel.subAffiliateModel.subAffiliateList.push(new SubAffiliate(item.Code, item.Email, item.Name, item.Status));
            });
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}


var labelParam = {
    keys: "email,name,status,affiliate.id,invite,cancel,subaffiliate.invite,language,subaffiliate.invite.msg"
};

var subaffiliateViewModel = new ViewModel();
subaffiliateViewModel.subAffiliateModel = new SubAffiliateModel();

$(document).ready(function () {
    $("#subaffiliate-invite").click(inviteSubAffiliate);

    $("#subpage-loader").show();
    // Wait for pulling sources
    $.when(loadLabel(labelParam, subaffiliateViewModel), getSubbAffiliateList()).then(function () {
        ko.applyBindings(subaffiliateViewModel, document.getElementById("subAffiliateView"));

        $("#subpage-loader").hide();
        $("#subAffiliateView").show();

        ko.validation.group(subaffiliateViewModel.subAffiliateModel).showAllMessages(true);
    });
});