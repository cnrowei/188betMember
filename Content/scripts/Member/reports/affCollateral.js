var AffCollateral = function () {
    var self = this;

    this.DateFrom = ko.observable().extend({ required: true });
    this.DateTo = ko.observable().extend({ required: true });
    this.promotingList = ko.observableArray();
    this.summary = ko.observable();
}

var Promotion = function (Index, BannerName, BannerSize, ClickCount, ImpressionCount, Id, MediaSource, NewSignUp, NewSignUpDeposit, NewSignUpDepositRate, NewSignUpRate) {
    this.Index = Index;
    this.BannerName = BannerName;
    this.BannerSize = BannerSize;
    this.ClickCount = ClickCount;
    this.ImpressionCount = ImpressionCount;
    this.Id = Id;
    this.MediaSource = MediaSource;
    this.NewSignUp = NewSignUp;
    this.NewSignUpDeposit = NewSignUpDeposit;
    this.NewSignUpDepositRate = NewSignUpDepositRate;
    this.NewSignUpRate = NewSignUpRate;
}

var labelParam = {
    keys: "referral.listing,summary.of.win.loss.based.on.product,affiliate.commission.reports.by.period,affiliate.collateral.performance.by.report,commission.payment.report,s.no,"
    + "creative.id,banner.name,banner.size,media.source,no.of.clicks,no.new.sign.up,no.sign.up.deposit,percent.click.sign.up,"
    + "percent.click.sign.up.deposit,subtotal,submit,date.from,date.to,excel,no.of.impressions,show"
};
var affiliateCollateralViewModel = new ViewModel();
affiliateCollateralViewModel.affCollateral = new AffCollateral();


function exportAffCollateralReport() {

    if (affiliateCollateralViewModel.affCollateral.isValid() == false) {
        Control.Dialog.showAlert("",$("#fill-up-all-required-fields").text());
        return false;
    }

    //Disable button
    $('#affCollateral-download-excel').addClass('disabled').attr("disabled", "disabled");

    var url = "/Api/Report/AffPromoExport";
    var param = ko.toJSON(affiliateCollateralViewModel.affCollateral);
    //Remove unused properties
    param = JSON.parse(param);
    delete param.promotingList;
    delete param.summary;
    delete param.errors;

    $.ajax({
        url: url,
        type: "POST",
        success: function (data) {
            $.fileDownload(url, { httpMethod: "POST", data: param });
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

function loadAffCollateral() {

    if (affiliateCollateralViewModel.affCollateral.isValid() == false) {
        Control.Dialog.showAlert("",$("#fill-up-all-required-fields").text());
        return false;
    }

    var url = "/Api/Report/AffPromo";

    //Clear
    affiliateCollateralViewModel.affCollateral.summary(null)
    affiliateCollateralViewModel.affCollateral.promotingList.removeAll()

    var param = ko.toJSON(affiliateCollateralViewModel.affCollateral);
    //Remove unused properties
    param = JSON.parse(param);
    delete param.promotingList;
    delete param.summary;
    delete param.errors;

    $.post(url, param,
        function (data) {


            if (data.Status == 1) {
                Control.Dialog.showAlert("",data.Message);
                return;
            }

            if (data.PromotingList == null)
                return;

            //Load Summary
            affiliateCollateralViewModel.affCollateral.summary(data.Summary);

            //Load Promoting List
            $.each(data.PromotingList, function (index, item) {
                affiliateCollateralViewModel.affCollateral.promotingList.push(new Promotion(index + 1, item.BannerName, item.BannerSize, item.ClickCount, item.ImpressionCount, item.Id, item.MediaSource, item.NewSignUp, item.NewSignUpDeposit, item.NewSignUpDepositRate, item.NewSignUpRate));
            });

        })
    .fail(function (error) {
        Control.Dialog.showAlert("",error);
    });
}

$(document).ready(function () {

    col10Collapse();

    //Binding click event
    $("#affCollateral-download-excel").click(exportAffCollateralReport);

    //Binding Datepicker
    $("#affiliateCollateralView-date-from, #affiliateCollateralView-date-to").datepicker({ dateFormat: 'dd-mm-yy' });

    //Loader
    $("#subpage-loader").show();

    // Wait for pulling sources
    $.when(loadLabel(labelParam, affiliateCollateralViewModel)).then(function () {
        ko.applyBindings(affiliateCollateralViewModel, document.getElementById("affiliateCollateralView"));
        ko.validation.group(affiliateCollateralViewModel.affCollateral).showAllMessages(true);
        $("#ui-datepicker-div").css('display', 'none');
        $("#subpage-loader").hide();
        $("#affiliateCollateralView").show();
    });

});