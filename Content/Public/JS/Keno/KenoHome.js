/// <reference path="../../Lib/Jquery/jquery-1.9.1-vsdoc.js" />

var KenoHomeJS = {
    //#region initialPage
    initialPage: function () {
        if (uv.login) {
            if (uv.isProAva != true)
                $('#tv-screen').off('click').on('click', 'a#kenoLobby', function () { Control.Dialog.showAlert("KENO", l.CSN_disable); return; });
            //            $('#kenoLobby').attr('href', 'javascript:void(0)').removeClass('popup-new')
            //                  .unbind('click').bind('click', function () { Control.Dialog.showAlert("KENO", l.CSN_disable); return; });
        }
        else {
            $('#kenoLobby').attr('href', 'javascript:void(0)').removeClass('popup-new');
            $('#tv-screen').off('click').on('click', 'a#kenoLobby', function () { Control.Dialog.showAlert(l.Dlg_Login, l.Casino_PleaseLogin); });
            //            $('#kenoLobby').attr('href', 'javascript:void(0)').removeClass('popup-new')
            //            .unbind('click').bind('click', function () {
            //                Control.Dialog.showAlert(l.Dlg_Login, l.Casino_PleaseLogin, function () { });
            //                return;
            //            });
        }
    }
    //#endregion
};

$(function () {
    KenoHomeJS.initialPage();

    //QAT-7259 fix the alignment bug
    $(".nano-panel").live("click", function () {
        $("#NanoGameSection a").removeClass("ddl-text");
    });
});