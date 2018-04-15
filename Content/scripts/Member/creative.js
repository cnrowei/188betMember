var CreativeModel = function () {
    var self = this;

    this.code = ko.observable().extend({ required: true });
    this.language = ko.observable();
    this.classification = ko.observable();
    this.collateralList = ko.observableArray();
    this.CollateralClassificationList = ko.observableArray();
    this.creativeLinkList = ko.observableArray();
    this.generatedScript = ko.observable("");
    this.generatedQRCode = ko.observable("");

    // Required for pagination index
    this.pageindex = ko.observable(1);
    this.pagesize;
    this.pagecount = ko.observable();

};

var Creative = function () {
    var preview = ko.observable();
};

var CreativeLink = function (No, Id, Code, LinkUrl, Type, QRUrl) {
    this.No = No;
    this.Id = Id;
    this.Code = Code;
    this.LinkUrl = LinkUrl;
    this.Type = Type;
    this.QRUrl = QRUrl;
};

var Classification = function (Id, Descr) {
    this.Id = Id;
    this.Descr = Descr;
};

var Collateral = function (Index, Id, TypeDescr, SizeCode, LangDescr, Name, EffectiveDate, PreviewUrl, Classification) {
    this.Index = Index;
    this.Id = Id;
    this.TypeDescr = TypeDescr;
    this.SizeCode = SizeCode;
    this.LangDescr = LangDescr;
    this.Name = "";
    this.EffectiveDate = EffectiveDate;
    this.PreviewUrl = PreviewUrl;
    this.Classification = Classification;

}

var labelParam = {
    keys: ",add,your.affiliate.link,language,classification,number,preview,type,size,creative,"
       + "added,code,get.code,add,marketing.link,cancel,link,name,copy,please.copy.msg,generate.code,added.date,QR.code,get.QR.code"
};


var creativeViewModel = new ViewModel();
creativeViewModel.creativeModel = new CreativeModel();

function buttonHandler(index) {
    if (index == 1) { 
        
    }
}

function showPrevCollateralList() {
    var index = creativeViewModel.creativeModel.pageindex();

    if (index > 1) 
    {  
        index--;
        creativeViewModel.creativeModel.pageindex(index);
        loadCollateralList(index);
    }

    
}

function showNextCollateralList() {
    var index = creativeViewModel.creativeModel.pageindex();
    var maxcount = creativeViewModel.creativeModel.pagecount();

    if (index < maxcount) {
        index++;
        creativeViewModel.creativeModel.pageindex(index);
        loadCollateralList(index);
    }
}

function generateMarketingScript(data, event) {
    var url = "/Api/Marketing/Script";    

    //If Name is blank
    if (data.Name == "") {
        Control.Dialog.showAlert("", $("#key-in-name").text());
        return false;
    }

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify({ 'Id': data.Id, 'Name': data.Name }),
        success: function (data) {
            if (data.Status == 0) {
                var withId = "/" + data.Id;
                $.get(url + withId, function (data) {
                    if (data.Status == 1) {
                        Control.Dialog.showAlert("",data.Message);
                        return false;
                    } else {
                        creativeViewModel.creativeModel.generatedScript(data.Script);
                        $("#getScriptModal").modal('show');
                    }
                });
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

function generateQRCode(data, event) {
    Control.Dialog.showQRImage($("#QRTranslation").text(), "<img src='" + data.QRUrl + "' style = 'margin-left:-15px;'>");
}


/*
function loadCreativeLinkList() {
    var url = "/Api/Marketing/Script";

    $.get(url, function (data) {
        $.each(data, function (index, item) {
            creativeViewModel.creativeModel.creativeLinkList.push(new CreativeLink(index + 1, item.Id, item.Code, item.LinkUrl, item.Type));
        });

    });
}
*/

function loadCreativeClassification(index) {
    if (index == "")
        index = "0";

    var url = "/Api/Marketing/CollateralClassificationList/" + index;
    creativeViewModel.creativeModel.collateralList.removeAll();

    $.get(url, function (data) {
        creativeViewModel.creativeModel.CollateralClassificationList.removeAll()
        creativeViewModel.creativeModel.CollateralClassificationList.push(new Classification("", "--------------------"));
        $.each(data.CollateralClassificationList, function (index, item) {
            creativeViewModel.creativeModel.CollateralClassificationList.push(new Classification(item.Id, item.Descr));
        });

    })
}

function loadCollateralList(index) {
    var url = "/Api/Marketing/CollateralList?page=" + index;

    //Remove Previous Record
    creativeViewModel.creativeModel.collateralList.removeAll();

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify({ 'LangId': creativeViewModel.creativeModel.language(), 'ClassId': creativeViewModel.creativeModel.classification() }),
        success: function (data) {
            $.each(data.CollateralList, function (index, item) {
                creativeViewModel.creativeModel.collateralList.push(new Collateral(index + 1, item.Id, item.TypeDescr, item.SizeCode, item.LangDescr, item.Name, item.EffectiveDate, item.PreviewUrl, item.Classification));
            });

            //Paging Data
            creativeViewModel.creativeModel.pagecount(data.Page.Count);
            creativeViewModel.creativeModel.pagesize = data.Page.Size;

        },
        error: function (xhr, status, error) {
            Control.Dialog.showAlert("",error);
        },
        complete: function (xhr, status) {

        }
    });

}

function loadCreativeLinkList() {
    var url = "/Api/Marketing/Link";

    $.get(url, function (data) {
        $.each(JSON.parse(data), function (index, item) {
            creativeViewModel.creativeModel.creativeLinkList.push(new CreativeLink(index + 1, item.Id, item.Code, item.LinkUrl, item.Type, item.QRUrl));
        });
    });
}


function addLink() {

    if (creativeViewModel.creativeModel.isValid() == false) {
        Control.Dialog.showAlert("",$('#fill-up-all-required-fields').text());
        return false;
    }

    var url = "/Api/Marketing/Link";

    //Disable submit
    $('#addLink-btn').addClass('disabled').attr("disabled", "disabled");

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(creativeViewModel.creativeModel.code()),
        success: function (data) {

            if (data.Status == 0) {
                $("#addMarketingModal").modal('hide');
                //Clear Code Field
                creativeViewModel.creativeModel.code('');
                //Reload Creative Link List
                creativeViewModel.creativeModel.creativeLinkList.removeAll();
                loadCreativeLinkList();
            } else {
                Control.Dialog.showAlert("",data.Message);
            }

        },
        error: function (xhr, status, error) {
            Control.Dialog.showAlert("",error);
            $('#addLink-btn').removeClass('disabled').removeAttr("disabled");
        },
        complete: function (xhr, status) {
            //Enable submit button
            $('#addLink-btn').removeClass('disabled').removeAttr("disabled");
        }
    });

    return false;

}

$(document).ready(function () {
    col10Collapse();

    //Disable contextmenu
    $('.disableContextMenu').on("contextmenu", function (e) {
        return false;
    });

    //$("#addLink-btn").click(addLink);
    $("#prevCollateralList").click(function (e) { e.preventDefault(); showPrevCollateralList(); });
    $("#nextCollateralList").click(function (e) { e.preventDefault(); showNextCollateralList(); });
    $("#collaterPageBtn").click(function (e) { e.preventDefault(); loadCollateralList(e.target.text); });
    $("#addLink-cancel-btn").click(function (e) { e.preventDefault(); $("#addMarketingModal").modal('hide'); });
    $("#okayBtn").click(function () { $("#getScriptModal").modal('hide'); });

    $("#subpage-loader").show();


    // Wait for pulling sources
    $.when(loadLabel(labelParam, creativeViewModel), loadCreativeLinkList(), loadCreativeClassification()).then(function () {
        ko.applyBindings(creativeViewModel, document.getElementById('creativeView'));
        ko.validation.group(creativeViewModel.creativeModel).showAllMessages(true);

        $("#creative-language-selection").change(function () { loadCreativeClassification(this.value); loadCollateralList(creativeViewModel.creativeModel.pageindex()); });
        $("#creative-classification-selection").change(function () { loadCollateralList(creativeViewModel.creativeModel.pageindex()); });

        $("#subpage-loader").hide();
        $("#creativeView").show();
    });

});