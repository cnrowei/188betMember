/// <reference path="../Lib/Jquery/jquery-1.9.1-vsdoc.js" />

function dowidgets(data) {
    if (!data || data.length == 0) return;
    utility.template("Contents/widgets.html", function (template) {
        var contents = template.process({ d: data });
        if (location.protocol.indexOf('https:') != -1)
            contents = contents.replace(/http:/g, location.protocol);
        $('div#wrapper.widget-wrapper').html(contents);
        doframeHeight();
    });
    setInterval(function () {
        $('div.widget-content ul:has(li:hidden)').each(function () {
            var $current = $(this).find('li:visible');
            var exposetime = $current.children().data('exposure');
            var timer = $current.children().data('currt');

            if (timer != 1) {
                $current.children().data('currt', --timer);
                return;
            } else {
                $current.children().data('currt', exposetime);
                $current.hide();
                var index = $current.index() + 1 >= $(this).children('li').length ? 0 : $current.index() + 1;
                $(this).find('li:eq(' + index + ')').show();
            }
        });
    }, 1000);
}

function dosubscreens(data) {
    if (!data || data.length == 0) return;
    utility.template("Contents/subscreens.html", function (template) {
        var contents = template.process({ d: data });
        if (location.protocol.indexOf('https:') != -1)
            contents = contents.replace(/http:/g, location.protocol);
        $('div#subscreens.subscreen-wrapper').html(contents);
    });
}

function dotvscreens(data) {
    if (!data || data.length == 0) { sportsbanner(); return; }
    var prod = uv.login == true ? $('body').attr('class').split(' ')[2] : $('body').attr('class').split(' ')[1];
    //location.pathname.length > 7 ? location.pathname.substring(7) : 'home';
    //prod = prod.indexOf('/') != -1 ? prod.substring(0, prod.indexOf('/')) : prod;
    utility.template("Contents/tvscreens/" + prod + ".html", function (template) {
        var contents = template.process({ d: data });
        if (location.protocol.indexOf('https:') != -1)
            contents = contents.replace(/http:/g, location.protocol);
        $('div#tv-screen.tv-screen-wrapper').html(contents);

        var exposureTime = data[0].scenes[0].exposureTime == 0 ? 5000 : data[0].scenes[0].exposureTime;
        if ($('div.banner-slider.bmt').find('ul li').length > 1)
            $('div.banner-slider.bmt').blueberry({ interval: exposureTime, hoverpause: true });

        if ($('body.getbanner').hasClass('sports'))
            sportsbanner();
    });
}

function dopromotions(data) {
    if (!data || data.length == 0) { $('#geo-promotion').show(); return;}

    if (data[0].scenes[0].linkUrl != null) {
        var url = data[0].scenes[0].linkUrl;
        $.get(url, function (data) {
            $('#geo-promotion').html(data.responseText).show(500, function () { 
               if(location.hash.length!=0)
                   $('#content-panel').scrollTop($(location.hash).position().top);
            });
        });
    }
}

$(function () {
    doframeHeight();
});

function doframeHeight() {
    if ($('div#wrapper').length > 0 && parent.utility.setRightBannerFrameHeight )
        parent.utility.setRightBannerFrameHeight($('div#wrapper').height());
}

function sportsbanner() {
    if (!$('body.getbanner').hasClass('sports')) return;
    var xLoopInterval = 5000;
    //Reset initial values
    initXBanner();

    // Initial Animation
    var xBannerLoop = setInterval(function () { switchActive(); shiftBanner();}, xLoopInterval);

    //Animation Loop
    $('#sbk-car-img-container').hover(function (ev) { clearInterval(xBannerLoop); },
        function (ev) {
            xBannerLoop = setInterval(function () { switchActive(); shiftBanner(); }, xLoopInterval);
    });


    //#region Banner Navigation
    //Navigation Controls
    $('.banner-controls').hover(function() { $(this).animate({ opacity: 1 }, 400); },
        function() { $(this).animate({ opacity: .1 }, 400); });

    $('.nav-left').click(function () {
        clearInterval(xBannerLoop);
        if ($('.car-bnr-list li:first').hasClass('centered-banner')) {
            $('.centered-banner').removeClass('centered-banner');
            $('.car-bnr-list .real-banners:last').addClass('centered-banner');
        }
        else {
            $('.centered-banner').removeClass('centered-banner').prev().addClass('centered-banner');
        };
        shiftBanner();
    });

    $('.nav-right').click(function () {
        if ($('.car-bnr-list li:last').hasClass('centered-banner')) {
            $('.centered-banner').removeClass('centered-banner');
            $('.car-bnr-list li:first').addClass('centered-banner');
        }
        else {
            $('.centered-banner').removeClass('centered-banner').next().addClass('centered-banner');
        };
        shiftBanner();
    });

    $('.x-banner-bookmark li a').click(function (e) {
        e.preventDefault();
        var triggerLink = $(this);
        $('.centered-banner').removeClass('centered-banner');
        $('.car-bnr-list li:nth-child(' + triggerLink.attr('href') + ')').addClass('centered-banner');
        shiftBanner();
    });
    //#endregion
};


$(window).resize(function () {
    if (!$('body.getbanner').hasClass('sports')) return;
    shiftBanner();
});


//#region initXBannner
function initXBanner() {
    var bookmarkNumber = 0;
    //set the 1st item as active
    $('.car-bnr-list li:first').addClass('centered-banner');
    $('.car-bnr-list').css('left', -($('.centered-banner').position().left + ($('.centered-banner').width() / 2)) + ($('#tv-screen').width() / 2));
    $('.car-bnr-list').children().addClass('real-banners');
    //Builds the Navigation Control
    $('.car-bnr-list').after('<div class="banner-controls nav-left"></div><div class="banner-controls nav-right"></div><div class="x-banner-bookmark"></div>');
    $('.banner-controls').css({ opacity: .1 });
    $('.car-bnr-list li').each(function () {
        bookmarkNumber++;
        bookmarkNumber == 1 ? $('div.x-banner-bookmark').append('<li class="marked-banner"><a href="' + bookmarkNumber + '">' + bookmarkNumber + '</a></li>') :
        $('div.x-banner-bookmark').append('<li><a href="' + bookmarkNumber + '">' + bookmarkNumber + '</a></li>');
    });
};
//#endregion

//#region switchActive
function switchActive() {
    if ($('.car-bnr-list li:last').hasClass('centered-banner')) {
        //move the active banner to the first item if at the end of the list
        $('.centered-banner').removeClass('centered-banner');
        $('.car-bnr-list li:first').addClass('centered-banner');
    }
    else {
        //move the active banner to the right
        $('.centered-banner').removeClass('centered-banner').next().addClass('centered-banner');
    }
};
//#endregion

//#region shiftBanner
function shiftBanner() {
    var xAnimateDuration = 600;
    $('.x-banner-bookmark').find('.marked-banner').removeClass('marked-banner');
    shiftBookmark();

    //Move the Banner
    if ($('.centered-banner').length > 0) {
        $('.car-bnr-list').stop().animate({
            left: -($('.centered-banner').position().left + ($('.centered-banner').width() / 2)) + ($('#tv-screen').width() / 2), 'display':'inline-block'
            }, {
                duration: xAnimateDuration,
                complete: function() {
                    if (!$('.car-bnr-list li').hasClass('endClones')) {
                        $('.centered-banner').parent().children().clone().removeClass().addClass('endClones').appendTo($(this));
                    }

                    if ($('.endClones:first').next().hasClass('centered-banner')) {
                        $(this).removeClass('centered-banner');
                    
                        var firstBanner = $('.real-banners:first').next();
                        firstBanner.addClass('centered-banner');
                    
                        //Center the banner
                        $('.car-bnr-list').css('left',($(window).width()/2)-(firstBanner.width()/2)-firstBanner.width());
                    
                        //Reset the bookmark
                        shiftBookmark();
                        $('.endClones').remove();
                    }          
            }
        });
    }
}
//#endregion

//#region shift the Bookmark
function shiftBookmark() {
    $('.x-banner-bookmark li').removeClass('marked-banner');
    $('.x-banner-bookmark li:nth-child('+($('.centered-banner').index()+1)+')').addClass('marked-banner');

    if (!$('.x-banner-bookmark li.marked-banner').length) {
        $('.x-banner-bookmark li:nth-child(1)').addClass('marked-banner');
    }
}
//#endregion