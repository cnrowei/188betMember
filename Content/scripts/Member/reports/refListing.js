var MemberModal = function () {
    var self = this;

    this.memberList = ko.observableArray();
}

var Member = function (Index, userid, username,created,balance, credit, online, status) 
{
    this.Index = Index;
    this.userid = userid;
    this.username = username;
    this.created = created;
    this.balance = balance;
    this.credit = credit;
    this.online = online;
    this.status = status;


}

var labelParam = {
    keys: "referral.listing,summary.of.win.loss.based.on.product,affiliate.commission.reports.by.period,affiliate.collateral.performance.by.report,edit,"
        + "commission.payment.report,refferal.id,registration.date,website,country,currency,deposit,excel,sum,member.code,balance,online,currency,member.credit,administration,member.status,"
        + "stop.betting,frozen.account"
};
var referralListingViewModel = new ViewModel();
referralListingViewModel.memberModal = new MemberModal();

function loadReferralListing() {
    var url = "/Api/Report/MemberList";

    $.get(url, function (data) {

        $.each(data, function (index, item) {
            referralListingViewModel.memberModal.memberList.push(new Member(item.index + 1, item.id,item.username,item.created,item.balance,item.credit,item.online,item.status));
       });
    })
    .fail(function (error) {
        Control.Dialog.showAlert("",error);
    });
}

function manageMember(data, event) {
    var url = "/Api/Report/Member";
    alert(event.attr);
    Control.Dialog.showAlert("","OK");
    //Control.Dialog.showQRImage($("#QRTranslation").text(), "<img src='" + data.QRUrl + "' style = 'margin-left:-15px;'>");
    $.ajax({
        url: url,
        type: "POST",
        success: function (data) {
            Control.Dialog.showAlert("OK","OK");
            //$.fileDownload(url, { httpMethod: "POST", data: param });
        },
        error: function (xhr, status, error) {
            Control.Dialog.showAlert("",error);
        },
        complete: function () {
            //Re-enable button
            $('#affCollateral-download-excel').removeClass('disabled').prop('disabled', false);
        }
    });

}

function exportReferralList() {
    //Disable button
    $('#referralListing-download-excel').addClass('disabled').attr("disabled", "disabled");

    var url = "/Api/Report/MemberListExport";

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            $.fileDownload(url, { httpMethod: "GET" });
        },
        error: function (xhr, status, error) {
            Control.Dialog.showAlert("",error);
        },
        complete: function () {
            //Re-enable button
            $('#referralListing-download-excel').removeClass('disabled').prop('disabled', false);
        }
    });
}

$(document).ready(function () {
    col10Collapse();

    //Binding Click Event
    $("#referralListing-download-excel").click(exportReferralList);

    //Loader
    $("#subpage-loader").show();

    // Wait for pulling sources
    $.when(loadLabel(labelParam, referralListingViewModel), loadReferralListing()).then(function () {
        ko.applyBindings(referralListingViewModel, document.getElementById("referralListingView"));
        $("#subpage-loader").hide();
        $("#referralListingView").show();
    });

});