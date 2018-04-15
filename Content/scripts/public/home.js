$(document).ready(function () {
    //Set Background Image
    $("#page-holder").css('background', 'url("/Content/Contents/STAR/images/themes/black/affiliates-bg.png") repeat scroll 0% 0% transparent')
});

$("#btnRedirectToFormerAffiliateURL").bind("click", function (e) {
    var url = "/Api/Web/RedirectToFormerAffiliateURL";
    var formerAffiliateURL = '';
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: "",
        async: true,
        success: function (data) {
            console.log(data);
            formerAffiliateURL = data.Message;
            window.location.href = formerAffiliateURL;
        },
        error: function (xhr, status, error) {
        },
        complete: function () {
        }
    });
});