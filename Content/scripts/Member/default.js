var ViewModel = function () {
    this.Name = ko.observable();
    this.Content = ko.observable();
    this.languages = ko.observableArray();
    this.commonLabel = ko.observableArray();
    this.label = ko.observableArray();

    this.countries = ko.observableArray();
    this.currencies = ko.observableArray();
    this.languages = ko.observableArray();
    this.dialcodes = ko.observableArray();
    this.countrycontacts = ko.observableArray();
    this.chattools = ko.observableArray();
}

var processing = new ProcessLoader();

function requirePublicView(view) {
    return function (page, callback) {
        $.get('../../Views/Content/' + $.cookie("Language") + '/' + view + '.htm', function (data) {
            $(page.element).html(data);
        })
        .fail(function () {
            alert('Error load view file.');
        });
    };
};

function checkProfile() {
    return $.ajax({
        url: "/Api/Dashboard/CheckProfile",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Status == 0) {
                if (data.Params != null && data.Params.redirect)
                    window.location.href = "/Views/Member/#!/myAccount";
            } else {
                alert(data.Message);
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}


function loadMessage() {
    var url = "/Api/Web/Message";

    return $.ajax({
        url: url,
        type: 'POST',
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(2),
        async: false,
        success: function (data) {
            if (data.Status == 0) {
                viewModel.Name(data.Name);
                viewModel.Content(data.Content);
            } else {
                alert(data.Message);
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });

}


var viewModel = new ViewModel();

var Lang = new LanguageController();

var labelParam = {
    keys: "home,creative,report,payment,announcement,brand,aff.comm.by.period,aff.collateral.performance,key.in.name,"
        + "my.account,change.password,goto.188,contact.us,logout,profile,help,promo.type.sub.affiliate,confirm.logout.msg,fill.up.all.required.fields.msg,"
        + "empty.weburl.msg,confirm.delete.msg,invalid.web.address.msg,all,welcome,loading,not.valid.email.msg,more.than.ten.email.msg,okayBtn,"
        + "duplicated.msg,website.title,footer,error.amount.must.greater.than.zero,error.usd.minimum.payment,black,white,shade,BO_ANNOUNCE_MGNT,print,current.month,partner.wigan.gloucestershire"
};

function bindPage() {
    // use #!/ instead of the default #
    pager.Href.hash = '#!/';
    // extend your view-model with pager.js specific data
    pager.extendWithPage(viewModel);
    // apply the view-model using KnockoutJS as normal
    ko.applyBindings(viewModel);
    //Language
    Lang.run();
    

    // start pager.js
    pager.start();

    //common label;
    loadCommonLabel(labelParam, viewModel);

    processing.stop();
}

function localeBasedLoader() {
    loadCommonLabel(labelParam, viewModel);
}

function preLoader() {
    // Wait for all dropdowns datasource are loaded before doing binding
    $.when(loadLanguage(viewModel), loadMessage(),
        loadCountry(viewModel), loadCurrency(viewModel), loadDialCode(viewModel),loadChatTool(viewModel)).then(bindPage);
}

function col10Collapse() {

    //#region coll0 events
    var isCollapsing = false;

    $("a.coll0").click(function () {
        if (!isCollapsing) {
            isCollapsing = true;
            var $parent = $(this.parentNode);
            if ($parent.hasClass("collapsed")) {
                $parent.removeClass("collapsed");

                if (this.innerHTML.toLowerCase().indexOf('unsettled') > -1) {
                    if ($("#UBClone").length > 0) {
                        $("#UBClone").css("display", "none");
                    }
                }
                else {
                    if ($("#SBClone").length > 0) {
                        $("#SBClone").css("display", "none");
                    }
                }

                $parent.next().show("blind", function () {
                    isCollapsing = false;
                });
            }
            else {
                $parent.addClass("collapsed")

                if (this.innerHTML.toLowerCase().indexOf('unsettled') > -1) {
                    if ($("#UBClone").length > 0) {
                        $("#UBClone").css("display", "block");
                    }
                }
                else {
                    if ($("#SBClone").length > 0) {
                        $("#SBClone").css("display", "block");
                    }
                }

                $parent.next().hide("blind", function () {
                    isCollapsing = false;
                });
            }
        }
    });
    //#endregion
}


function isSessionExpired(page, route, callback) {
    $.ajax({
        url: "/Api/Web/IsSessionExpired",
        success: function (data) {
            if (data.Status == 0)
                window.location.reload();
            else
                callback();
        },
        error: function (error) {
            alert(erorr);
        }
    });
}


$(document).ready(function () {
    
    processing.run();

    //Loading Validator Resources
    var validator = getValidator();

    $.each(validator, function (index, value) {
        resource[value.MsgKey] = value.MsgVal;
    });

    bindGoto188Button();

    ko.validation.localize({
        required: resource['jquery.validator.required'],
        email: resource['jquery.validator.email'],
        equal: resource['jquery.validator.equalTo'],
        date: resource['jquery.validator.date'],
        dateISO: resource['jquery.validator.dateISO'],
        number: resource['jquery.validator.number'],
        digit: resource['jquery.validator.digits'],
        maxlength: resource['jquery.validator.maxLength'],
        minlength: resource['jquery.validator.minLength'],
        max: resource['jquery.validator.max'],
        min: resource['jquery.validator.min']
    });
    

    //Set the shade list color and width
    $('#themeslist').removeClass().addClass('shade menutitle ' + uv.pd.theme + '-theme');
    $('#drop_themeslist').css('min-width', '105px');

    //Logout function binding
    $("#btn-logout").bind("click", function (e) {
        e.preventDefault();
        logout();
    });

    checkProfile();

    //Predefined Language and run preLoader
    preLoader();
    Lang.setCookies(localeBasedLoader);

});

