var WinLossModel = function () {
    var self = this;
    this.monthList = ko.observableArray();
    this.DateFrom = ko.observable("08-2012");

    this.summary = ko.observable();
    this.summaryList = ko.observableArray();
    this.productList = ko.observableArray();
}

var Product = function (Name) {
    this.Name = Name;
}

var Month = function (Value,Display) {
    this.Value = Value;
    this.Display = Display;
}

var labelParam = {
    keys: "referral.listing,summary.of.gross.revenue.based.on.product,affiliate.commission.reports.by.period,"
        + "affiliate.collateral.performance.by.report,commission.payment.report,month,excel,refferal.id,currency,"
        + "total,expenses,stake,company.win.loss.f,payment.fee,promotion.bonus,platform.fee,company.loss.message,sum,member.code,gross.revenue,rake.amount"
};

var winLossProductViewModel = new ViewModel();
winLossProductViewModel.winLossModel = new WinLossModel();

function populateReport(data) {
   
    $.each(data.SummaryList, function (index, item) {
        winLossProductViewModel.winLossModel.summaryList.push(item);
    });

    $.each(data.Summary.ProductList, function (index, item) {
        winLossProductViewModel.winLossModel.productList.push(new Product(item.Product));
    });

    winLossProductViewModel.winLossModel.summary(data.Summary);
}

function loadMonthList() {
    var url = "/Api/Report/MonthList";
        winLossProductViewModel.winLossModel.monthList.push(new Month("", "---------------"));
    $.get(url, function (data) {
        $.each(JSON.parse(data), function (index, item) {
            winLossProductViewModel.winLossModel.monthList.push(new Month(item.Value, item.Display));
        });
    })
    .fail(function (error) {
        Control.Dialog.showAlert("",error);
    });
}

function exportWinLossReport() {
    //Disable button
    $('#winLossProduct-download-excel').addClass('disabled').attr("disabled", "disabled");

    var url = "/Api/Report/WinLossProductExport";

    var param = ko.toJSON(winLossProductViewModel.winLossModel);
    param = JSON.parse(param);
    delete param.monthList;
    delete param.summary;
    delete param.summaryList;
    delete param.productList;

    $.ajax({
        url: url,
        type: "POST",
        success: function (data) {
            $.fileDownload(url, { httpMethod: "POST", data : param});
        },
        error: function (xhr, status, error) {
            Control.Dialog.showAlert("",error);
        },
        complete: function () {
            //Re-enable button
            $('#winLossProduct-download-excel').removeClass('disabled').prop('disabled', false);
        }
    });
}


function loadWinLossReport() {

    var url = "/Api/Report/WinLossProduct";

    var param = ko.toJSON(winLossProductViewModel.winLossModel);
    param = JSON.parse(param);
    delete param.monthList;
    delete param.summary;
    delete param.summaryList;
    delete param.productList;

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(param),
        beforeSend: function () {
            //Empty Previous Data;
            winLossProductViewModel.winLossModel.summary(null);
            winLossProductViewModel.winLossModel.productList.removeAll();
            winLossProductViewModel.winLossModel.summaryList.removeAll();
        },
        success: function (data) {

            if (data.Status == 0) {
                if(data.SummaryList == null)
                    return;
                populateReport(data);
            } else {
                Control.Dialog.showAlert("",data.Message);
            }
        },
        error: function (xhr, status, error) {
            Control.Dialog.showAlert("",error);
        },
        complete: function (xhr, status) {
        }
    });
}


$(document).ready(function () {
    col10Collapse();

    //Binding click event
    $("#winLossProduct-download-excel").click(exportWinLossReport);

    //Loader
    $("#subpage-loader").show();

    // Wait for pulling sources
    $.when(loadLabel(labelParam, winLossProductViewModel), loadMonthList()).then(function () {
        ko.applyBindings(winLossProductViewModel, document.getElementById("winLossProductView"));
        $("#subpage-loader").hide();
        $("#winLossProductView").show();
    });

});