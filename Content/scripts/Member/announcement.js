var AnnouncementModel = function () {
    this.announcementList = ko.observableArray();

}

var Announcement = function (no, id, ord, text, effectiveDate, language, whitelabel, type) {
    this.no = no;
    this.id = id;
    this.ord = ord;
    this.text = text;
    this.effectiveDate = effectiveDate;
    this.language = language;
    this.type = type;
}

var labelParam = {
    keys: "number,date.time"
};

var announcementViewModel = new ViewModel();
announcementViewModel.announcementModel = new AnnouncementModel();


function loadAnnoucement() {
    return $.ajax({
        url: "/Api/Announcement/AnnouncementList?page",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        success: function (data) {
            $.each(data.AnnouncementList, function (index, item) {
                announcementViewModel.announcementModel.announcementList.push(new Announcement(index + 1, item.Id, item.Ord, item.Text, item.EffectiveDate, item.Language, item.Whitelabel, item.Type));
            });
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

$(document).ready(function () {

    col10Collapse();

    $("#subpage-loader").show();


    // Wait for pulling sources
    $.when(loadLabel(labelParam, announcementViewModel), loadAnnoucement()).then(function () {
        ko.applyBindings(announcementViewModel, document.getElementById("announcementView"));

        $("#subpage-loader").hide();
        $("#announcementView").show();

    });

});