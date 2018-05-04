// var CreativeModel = function () {
//     var self = this;

//     this.code = ko.observable().extend({ required: true });
//     this.language = ko.observable();
//     this.classification = ko.observable();
//     this.collateralList = ko.observableArray();
//     this.CollateralClassificationList = ko.observableArray();
//     this.creativeLinkList = ko.observableArray();
//     this.generatedScript = ko.observable("");
//     this.generatedQRCode = ko.observable("");

//     // Required for pagination index
//     this.pageindex = ko.observable(1);
//     this.pagesize;
//     this.pagecount = ko.observable();

// };

var AccountModel = function () {
    var self = this;
    this.username = ko.observable().extend({
        required: true
    });
    this.password = ko.observable().extend({
        required: true
    });
    this.balance = ko.observable().extend({
        required: true
    });
    this.memberrole = ko.observable().extend({
        required: true
    });
    //this.memberroles = ko.observableArray();
}


var MemberModal = function () {
    var self = this;


    this.memberList = ko.observableArray();
}

var Member = function (Index, userid, username, created, balance, credit, online, status,login) {
    this.Index = Index;
    this.userid = userid;
    this.username = username;
    this.created = created;
    this.balance = balance;
    this.credit = credit;
    this.online = online;
    this.status = status;
    this.login = login;


}

var labelParam = {
    keys: "referral.listing,summary.of.win.loss.based.on.product,affiliate.commission.reports.by.period,affiliate.collateral.performance.by.report,edit," +
        "commission.payment.report,refferal.id,registration.date,website,country,currency,deposit,excel,sum,member.code,balance,online,currency,member.credit,administration,member.status," +
        "stop.betting,frozen.account,setting.balance,cancel,add,update.editmember.info,password,member.role,login.status"
};
var referralListingViewModel = new ViewModel();
var accountModel = new AccountModel();
referralListingViewModel.memberModal = new MemberModal();

function loadReferralListing() {
    var url = "/Api/Report/MemberList";

    $.get(url, function (data) {

            $.each(data, function (index, item) {
                referralListingViewModel.memberModal.memberList.push(new Member(item.index + 1, item.id, item.username, item.created, item.balance, item.credit, item.online, item.status,item.login));
            });
        })
        .fail(function (error) {
            Control.Dialog.showAlert("", error);
        });
}

// function manageMember(data, event) {
//     var url = "/Api/Report/Member";
//     //alert(event.attr);
//     console.log(data)
//     //Control.Dialog.showAlert("","OK");
//     //Control.Dialog.showQRImage($("#QRTranslation").text(), "<img src='" + data.QRUrl + "' style = 'margin-left:-15px;'>");
//     $.ajax({
//         url: url,
//         type: "POST",
//         success: function (data) {
//             Control.Dialog.showAlert("OK","OK");
//             //$.fileDownload(url, { httpMethod: "POST", data: param });
//         },
//         error: function (xhr, status, error) {
//             Control.Dialog.showAlert("",error);
//         },
//         complete: function () {
//             //Re-enable button
//             $('#affCollateral-download-excel').removeClass('disabled').prop('disabled', false);
//         }
//     });
// }


function manageMember(data, event) {
    $("#addBalanceModal").modal('show');

    var url = "/Api/Report/Member";

    console.log(data)
    //Control.Dialog.showAlert("","OK");
    //Control.Dialog.showQRImage($("#QRTranslation").text(), "<img src='" + data.QRUrl + "' style = 'margin-left:-15px;'>");
    // $.ajax({
    //     url: url,
    //     type: "POST",
    //     success: function (data) {
    //         Control.Dialog.showAlert("OK","OK");
    //         //$.fileDownload(url, { httpMethod: "POST", data: param });
    //     },
    //     error: function (xhr, status, error) {
    //         Control.Dialog.showAlert("",error);
    //     },
    //     complete: function () {
    //         //Re-enable button
    //         $('#affCollateral-download-excel').removeClass('disabled').prop('disabled', false);
    //     }
    // });
}

function stopMember(data, event) {
    var url = "/Api/Member/Status";
    var ustatus = true
    Control.Dialog.showConfirm("", "你确定吗？", function () {
        if (data.status == true) {
            ustatus = false
        } 
        var param = JSON.parse('{"status":'+ustatus+',"userid":'+data.userid+'}');
        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(param),
            success: function (data) {
                Control.Dialog.showAlert("OK", data.Message);
            },
            error: function (xhr, status, error) {
                Control.Dialog.showAlert("", error);
            },
            complete: function () {
                //Re-enable button
                $('#affCollateral-download-excel').removeClass('disabled').prop('disabled', false);
            }
        });

    });
}

function loginMember(data,event){
    var url = "/Api/Member/LoginStatus";
    var ustatus = true
    Control.Dialog.showConfirm("", "你确定吗？", function () {
        if (data.login == true) {
            ustatus = false
        } 
        var param = JSON.parse('{"status":'+ustatus+',"userid":'+data.userid+'}');
        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(param),
            success: function (data) {
                Control.Dialog.showAlert("OK", data.Message);
                //Control.Dialog.showAlert("OK", "OK");
                //$.fileDownload(url, { httpMethod: "POST", data: param });
            },
            error: function (xhr, status, error) {
                Control.Dialog.showAlert("", error);
            },
            complete: function () {
                //Re-enable button
                $('#affCollateral-download-excel').removeClass('disabled').prop('disabled', false);
            }
        });

    });
}

function exportReferralList() {
    //Disable button
    //$('#referralListing-download-excel').addClass('disabled').attr("disabled", "disabled");

    var url = "/Api/Report/MemberListExport";

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            $.fileDownload(url, {
                httpMethod: "GET"
            });
        },
        error: function (xhr, status, error) {
            Control.Dialog.showAlert("", error);
        },
        complete: function () {
            //Re-enable button
            $('#referralListing-download-excel').removeClass('disabled').prop('disabled', false);
        }
    });
}

function addMember() {
    if (accountModel.isValid() == false) {
        Control.Dialog.showAlert("", $('#fill-up-all-required-fields').text());
        return false;
    }

    console.log("000")


    var url = "/Api/Member/Add";

    //Disable submit
    $('#addLink-btn').addClass('disabled').attr("disabled", "disabled");
    var param = ko.toJSON(accountModel);
    param = JSON.parse(param);

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(param),
        success: function (data) {

            if (data.Status == 0) {
                $("#addMarketingModal").modal('hide');
                //Clear Code Field
                accountModel.username('')
                accountModel.password('')
                accountModel.balance('')
                //Reload Creative Link List
                //referralListingViewModel.memberModal.creativeLinkList.removeAll();
                loadReferralListing();
            } else {
                Control.Dialog.showAlert("", data.Message);
            }

        },
        error: function (xhr, status, error) {
            Control.Dialog.showAlert("", error);
            $('#addLink-btn').removeClass('disabled').removeAttr("disabled");
        },
        complete: function (xhr, status) {
            //Enable submit button
            $('#addLink-btn').removeClass('disabled').removeAttr("disabled");
        }
    });

    return false;


}

function addLink() {
    console.log("000")
    //Disable submit
    //$('#addLink-btn').addClass('disabled').attr("disabled", "disabled");


}

$(document).ready(function () {
    col10Collapse();

    //Binding Click Event
    //$("#addBalance-btn").click(addLink);
    $("#addMember-btn").click(addMember);
    //$("#addMember-btn").click(addMember);

    $("#referralListing-download-excel").click(exportReferralList);
    $("#addMember-cancel-btn").click(function (e) {
        e.preventDefault();
        $("#addMemberModal").modal('hide');
    });
    $("#addBalance-cancel-btn").click(function (e) {
        e.preventDefault();
        $("#addBalanceModal").modal('hide');
    });
    //Loader
    $("#subpage-loader").show();
    //accountModel.memberrole('0');

    // Wait for pulling sources
    $.when(loadLabel(labelParam, referralListingViewModel), loadReferralListing()).then(function () {

        ko.applyBindings(referralListingViewModel, document.getElementById("referralListingView"));
        ko.applyBindings(accountModel, document.getElementById("addMemberModal"));

        ko.validation.group(accountModel).showAllMessages(true);

        $("#subpage-loader").hide();
        $("#referralListingView").show();
    });

});