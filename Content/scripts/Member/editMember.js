var AffProfile = function (name, value, descr) {
    this.fieldname = name;
    this.fieldvalue = ko.observable(value);
    this.description = descr;
}

var AffWebsite = function (id, url, descr) {
    this.id = id;
    this.url = ko.observable(url);
    this.descr = descr;
}

var AffCommRcv = function (name, descr, support) {
    var self = this;

    this.fieldname = name;
    this.description = descr;
    this.support = support;
    self.data = ko.observableArray();
    self.data.subscribe(function () {
        self.errors = ko.validation.group(self.data(), { deep: true });
        self.errors.showAllMessages();
    });
}

var AffCommRcvData = function (parent, name, value, descr) {
    var self = this;
    self.parent = parent;

    this.fieldname = name;
    this.fieldvalue = ko.observable(value).extend({
        required: {
            onlyIf: function() {
                var required = false;

                //Required if parent selected
                if (self.parent == accountModel.commrcvopt())
                    required = true;

                //Custom Validation 
                if (name === 'comm.rcv.data.field.bt.iban' || name === 'comm.rcv.data.field.bt.sort.code' || name === 'comm.rcv.data.field.bt.swift.code')
                    required = false;

                return required;
            }
        },        
        maxLength: {
            message: 'Must be 10 digits',
            onlyIf: function () {
                return name === 'comm.rcv.data.field.ecopayz.acc.no';
            },
            params: 10
        },
        minLength: {
            message: 'Must be 10 digits',
            onlyIf: function() {
                return name === 'comm.rcv.data.field.ecopayz.acc.no';
            },
            params: 10
        }
    });

    this.description = descr;
}

var AffCommMode = function (id, type) {
    this.id = ko.observable(id);
    this.afftype = type;
}

var AccountModel = function () {

    var self = this;
    this.id = ko.observable();
    this.username = ko.observable().extend({ required: true });
    this.password = ko.observable().extend({ required: true });
    this.nickname = ko.observable().extend({ required: true });
    this.balance = ko.observable().extend({ required: true });
    this.currency = ko.observable().extend({ required: true });
    //self.ownwebsite = ko.observable().extend({ required: true });
    // this.describe = ko.observable().extend({ required: {
    //     onlyIf: function () {
    //         return self.ownwebsite() == 0;
    //     }
    // }, maxLength: 256
    // });
    // self.websitelist = ko.observableArray();
}

var labelParam = {
    keys: "affliate.account.information,transaction.details,action,cancel,username,password,email,lastname,first.name,company,"
        + "country,contact.number,address,city,postal.code.zip,massenger,preferred.language,preferred.currency,website.information,i.have.website,"
        + "web.address,promotion.method,i.dont.have.website,update,transaction.descr,add,security.question,security.answer,additional.information,delete,"
        + "update.editmember.info,promotion.method.without.website,payment.msg,nickname,balance"
};

var accountModel = new AccountModel();
var editMemberViewModel = new ViewModel();


function promoteOptions() {

    if ($("#with-website").is(':checked')) {
        $("#web-address , #add-web-address").prop('disabled', false); 
        $("#add-web-address").removeClass("disabled");
    } else {
        $("#add-web-address").addClass("disabled");
        $("#web-address , #add-web-address").prop('disabled', true);

    }

    if ($("#without-website").is(':checked')) {
        $("#promote-reason").prop('disabled', false);
    } else {
        $("#promote-reason").prop('disabled', true);
    }
}


function updateProfile() {
    if (accountModel.isValid() == false) {
        Control.Dialog.showAlert("",$("#fill-up-all-required-fields").text());
        return false;
    }

    var id = accountModel.id();
    var url = "/Api/Account/Update";
    var param = ko.toJSON(accountModel);

    //Disable button
    $('#myAccount-btn-update').addClass('disabled').attr("disabled", "disabled");
    $('#myAccount-btn-cancel').addClass('disabled').attr("disabled", "disabled");

    //Remove unused properties
    param = JSON.parse(param); 
    delete param.username;
    delete param.currency;
    delete param.weburl;
    delete param.securityquestions;
    delete param.updatedPaymentMethod;
    delete param.errors;

    processing.run();

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(param),
        success: function (data) {
            Control.Dialog.showAlert("", data.Message);
        },
        error: function (xhr, status, error) {
            alert(error);
        },
        complete: function (xhr, status) {
            getProfile();
            processing.stop();
        }
    });

    //Re-enable button
    $('#myAccount-btn-update').removeClass('disabled').prop('disabled', false);
    $('#myAccount-btn-cancel').removeClass('disabled').prop('disabled', false); 

    return false;
}

function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); return null; 
} 

function getProfile() {
    var url = "/Api/Account/Profile?id="+getQueryString("id");
    //Remove Previous Record
    // accountModel.websitelist.removeAll();
    // accountModel.profilelist.removeAll();
    // accountModel.commrcvlist.removeAll();

    $.getJSON(url, function (data) {

        // accountModel.id(data.Id);
        // accountModel.username(data.Username);
        // accountModel.lastname(data.LastName);
        // accountModel.firstname(data.FirstName);
        // accountModel.country(data.Country);
        // accountModel.language(data.Language);
        // accountModel.currency(data.Currency);
        // accountModel.city(data.City);
        // accountModel.address(data.Address);
        // accountModel.postal(data.Postal);
        // accountModel.dialcode(data.DialCode);
        // accountModel.contactno(data.ContactNo);
        // accountModel.email(data.Email);
        // accountModel.chattool(data.ChatTool);
        // accountModel.ownwebsite(data.OwnWebsite);
        // accountModel.chataddress(data.ChatAddress);
        // accountModel.describe(data.Describe);
        // accountModel.commrcvopt(data.CommRcvOpt);
        // accountModel.updatedPaymentMethod(data.CommRcvOpt);
        // accountModel.securityquestion(data.SecurityQuestion);
        // accountModel.securityanswer(data.SecurityAnswer);
        

        // $.each(data.ProfileList, function (index, item) {
        //     accountModel.profilelist.push(new AffProfile(item.FieldName, item.FieldValue, item.Description));
        // });

        // $.each(data.WebsiteList, function (index, item) {
        //     accountModel.websitelist.push(new AffWebsite(item.Id, item.Url, item.Descr));
        // });

        // $.each(data.CommRcvList, function (index, item) {
        //     var affCommRcv = new AffCommRcv(item.FieldName, item.Description, item.Support);

        //     $.each(item.Data, function (index, item2) {
        //         affCommRcv.data.push(new AffCommRcvData(item.FieldName, item2.FieldName, item2.FieldValue, item2.Description));
        //     });

        //     accountModel.commrcvlist.push(affCommRcv);
        // });

        promoteOptions();

        accountModel.errors = ko.validation.group(accountModel, { deep: true });
    });

}


// function reloadWebList() {
//     var url = "/Api/Account/Website";

//     //Remove Previous Record
//     accountModel.websitelist.removeAll();

//     $.getJSON(url, function (data) {

//         $.each(data, function (index, item) {
//             accountModel.websitelist.push(new AffWebsite(item.Id, item.Url, item.Descr));
//         });
        
//     });
// }

$(document).ready(function () {
    $("#subpage-loader").show();

    $("#with-website , #without-website").click(promoteOptions);
    $("#myAccount-btn-update").click(updateProfile);

    // Wait for pulling sources
    $.when(loadLabel(labelParam, editMemberViewModel), loadSecurityQuestion(accountModel), getProfile()).then(function () {
        ko.applyBindings(editMemberViewModel);
        ko.applyBindings(accountModel, document.getElementById("update-form"));

        promoteOptions();
             
        $("#subpage-loader").hide();
        $("#myAccountView").show();

    });


});
