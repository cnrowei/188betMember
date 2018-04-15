var DashboardViewModel = function () {
    this.commonLabel = ko.observableArray();
    this.label = ko.observableArray();
    this.AffCode = ko.observable();
    this.FirstName = ko.observable();
    this.LastLogin = ko.observable();
    this.LastUpdated = ko.observable();
    this.TotalMember = ko.observable();
    this.Currency = ko.observable();
    this.CreativeLink = ko.observable();
    this.CurrMonthClick = ko.observable();
    this.CurrMonthImpression = ko.observable();
    this.CurrMonthNewSignup = ko.observable();
    this.CurrMonthNewSignupDeposit = ko.observable();
    this.CurrMonthActivePlayer = ko.observable();    

    this.Message = ko.observable();
    this.Params = ko.observable();
    this.Status = ko.observable();
}

var CommissionModel = function () {
    this.commonLabel = ko.observableArray();
    this.commissionList = ko.observableArray();
}

var Commission = function (month, commission) {
    this.month = month;
    this.commission = commission;
}

var ProductModel = function () {
    this.commonLabel = ko.observableArray();
    this.productList = ko.observableArray();
}

var Product = function (ActivePlayer, Code, Name, Revenue, TotalBets, Turnover) {
    this.ActivePlayer = ActivePlayer;
    this.Code = Code;
    this.Name = Name;
    this.Revenue = Revenue;
    this.TotalBets = TotalBets;
    this.Turnover = Turnover;

}

var labelParam = {
    keys: "affiliate.home,your.last.login.on,your.affiliate.id,creative.message,last.updated,summary,total.referrals,"
    + "quick.summary.of.the.current.month,no.of.clicks,new.sign.up,new.sign.up.with.deposit,active.referrals,commission,"
    + "product.summary.of.current.month,total.active.referrals,number.of.bets,total.stake,company.win.loss,"
    + "your.affiliate.link,current.month,company.loss.message,no.of.impressions,creative,rake.amount,gross.revenue"
};


var dashboardViewModel = new DashboardViewModel();
dashboardViewModel.productModel = new ProductModel();
dashboardViewModel.commissionModel = new CommissionModel();

function loadCreativeLink(label_code,creativeLink) {

    var creativeMessage;
    var creativeLabel;

    $.each(dashboardViewModel.label(), function (key, item) {
        if (item.code == label_code) {
            return creativeMessage = item.descr;
        }
    });
    $.each(viewModel.commonLabel(), function (key, item) {
        if (item.code == 'creative.label') {
            return creativeLabel = item.descr;
        }
    });

    creativeMessage = creativeMessage.replace("{0}","<a href='"+creativeLink+"'>"+creativeLabel+"</a>");
    dashboardViewModel.CreativeLink(creativeMessage);
}

function loadInfo() {
    return $.ajax({
        url: "/Api/Dashboard/Info",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Status == 0) {
                dashboardViewModel.AffCode = data.AffCode;
                dashboardViewModel.FirstName = data.FirstName;
                dashboardViewModel.LastLogin = data.LastLogin;
                dashboardViewModel.LastUpdated = data.LastUpdated;
                dashboardViewModel.Message = data.Message;
                dashboardViewModel.Params = data.Params;
                dashboardViewModel.Status = data.Status;
                dashboardViewModel.TotalMember = data.TotalMember;
                dashboardViewModel.Currency = data.Currency;
                dashboardViewModel.CurrMonthClick = data.CurrMonthClick;
                dashboardViewModel.CurrMonthImpression = data.CurrMonthImpression;
                dashboardViewModel.CurrMonthNewSignup = data.CurrMonthNewSignup;
                dashboardViewModel.CurrMonthNewSignupDeposit = data.CurrMonthNewSignupDeposit;
                dashboardViewModel.CurrMonthActivePlayer = data.CurrMonthActivePlayer;
                dashboardViewModel.CommissionList = data.CommissionList;

                $.each(data.CommissionList, function (index, item) {
                    dashboardViewModel.commissionModel.commissionList.push(new Commission(item.Month, item.Commission));
                });

                $.each(data.ProductList, function (index, item) {
                    dashboardViewModel.productModel.productList.push(new Product(item.ActivePlayer, item.Code, item.Name, item.Revenue, item.TotalBets, item.Turnover));
                });
            } else {
                alert(data.Message);
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function currentMonthProduct( name) {

    if ($.cookie('Language') == "id-ID")
        return name + ' ' + $("#currentMonth").text();
    else {
        return $("#currentMonth").text()+ ' ' + name;
    }
}

$(document).ready(function () {
    var CreativeLink = '#!/Creative';

    //Show the sub page loading message
    $("#subpage-loader").show();

    // Wait for pulling sources
    $.when(loadLabel(labelParam, dashboardViewModel), loadInfo()).then(function () {

        ko.applyBindings(dashboardViewModel, document.getElementById("dashboardView"));

        //Replace the creative link
        loadCreativeLink('creative.message.label', CreativeLink);

        //Hide the sub page loading message
        $("#subpage-loader").hide();

        //Show the subpage content
        $("#dashboardView").show();
    });
});