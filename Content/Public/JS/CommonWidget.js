/// <reference path="../Lib/Jquery/jquery-1.9.1-vsdoc.js" />

/*Authors: Hai Le <hailt@myvietnam.net>, <leehai013@gmail.com>
Depends:
*   ui.core.js
*   ui.effects.js : if use hide, show effect options 
*   bgiframe (optional),jquery.dropshadow.js of Larry Stevens (optional)
*/

(function($) {
    var uidropdown = new Array();
    $.widget("ui.dropdown", {
        //#region _init
        _init: function() {
            var self = this, options = this.options;
            uidropdown.push(self);
            if (!jQuery().dropShadow) options.dropShadow = false;
            if (!options.contentId) return;
            this._popupRoot = $("#" + options.contentId);
            this._popupRoot.css({ position: "absolute", display: "block", visibility: "hidden", zIndex: options.zIndex,'min-width' : options.width });
            this._delayhide = false;
            this._delayShow = false;
            this._isHiding = false;
            this._isShowing = false;
            this._isShowed = false;

            if (options.triggerEvent == "click") {
                self.element.mousedown(function (e) {
                    if (uidropdown) {
                        for (var i = 0; i < uidropdown.length; i++) {
                            if ((uidropdown[i]._isShowed || uidropdown[i]._isShowing) && uidropdown[i] != self)
                                uidropdown[i].hide(true);
                        }
                    }
                    if (self._isShowed)
                        self.hide();
                    else
                        self.show();

                    return false;
                }
                );
            }
            else {
                self.element.hover(
                function() {
                    if (self._hideTimeOut) clearTimeout(self._hideTimeOut);
                    self.show();
                },
                function() { self._hidePopupTimeOut(); });
            }

            this._popupRoot.appendTo(document.body);
            //this._popupRoot.attr("_h", this._popupRoot.outerHeight());
            //this._popupRoot.attr("_w", this._popupRoot.outerWidth());

            this._popupRoot.css({ display: "none", visibility: "visible" });
            this.hide(true);

            $(document).mousedown(function(event) {
                var $target = $(event.target);
                if ((self._isShowed || self._isShowing)
                    && event.target.id != options.contentId
                    && $target.parents("#" + options.contentId).length == 0
                    && (event.target.id != "" && event.target.id != self.element[0].id
                    || event.target.id == "" && self.element[0].id != ""
                    || event.target.id == "" && self.element[0].id == "" && event.target.uniqueID && event.target.uniqueID != self.element[0].uniqueID
                    )) {
                    self.hide(true);
                }
            });
            
            var to = null;
            var $autohidetarget= options.customhideTarget == null ? null : $(options.customhideTarget);
            var autohidefunction=function() { 
                if (self._isShowing || self._isShowed) {
                    self._popupRoot.stop(true, true);
                    if (to) clearTimeout(to);
                    to = setTimeout(function() {
                        self._popupRoot.hide();
                    }, 100);
                    self.hide(true);
                }
            };

            $(window).bind("resize scroll", autohidefunction);
            if( $autohidetarget != null)
            {
                $autohidetarget.bind("scroll", autohidefunction);
            }

            if (options.triggerEvent != "click") {
                this._popupRoot.hover(function() {
                    if (self._hideTimeOut) clearTimeout(self._hideTimeOut);
                }, function() { self._hidePopupTimeOut(); });
            }

            //if (options.bgiframe && $.fn.bgiframe && $.browser.msie && $.browser.version < 7) {
                //var iframe = this._popupRoot.bgiframe();
                //                this._popupRoot.resize(function(ev) {
                //                    iframe.height($(ev.target).height());
                //                    iframe.width($(ev.target).width());
                //                });
            //}
        },
        //#endregion

        //#region show
        show: function() {
            var self = this, options = this.options;
            if (self.element.attr("disabled")) return;
            self._delayShow = self._isHiding;
            if (self._isHiding || self._isShowing || self._isShowed) {
                return;
            }
            self._popupRoot.attr("_h", self._popupRoot.outerHeight());
            self._popupRoot.attr("_w", self._popupRoot.outerWidth());
            var pos = self._setPosition();
            var showedCallback = function() {
                if (options.dropShadow && self._isShowing) {
                        self._popupRoot.dropShadow(
                        { left: (options.autoPos == "left-top") ? -2 : 2,
                            top: (options.autoPos == "left-top" || options.autoPos == "right-top") ? -2 : 2
                        });
                }
                if (self._isShowing) {
                    self._popupRoot.attr("_h", self._popupRoot.outerHeight());
                    self._popupRoot.attr("_w", self._popupRoot.outerWidth());

                    if (options.onShowed && $.isFunction(options.onShowed)) {
                        options.onShowed(self);
                    }
                }
                self._isShowing = false;
                self._isShowed = true;
                self._isHiding = false;

                if (self._delayHide) {
                    self.hide();
                }
            };

            self._isShowing = true;
            if (options.show && options.show != "auto" && options.show != "animate") {
                self._popupRoot.show(options.show, options.showEffectOptions, options.showSpd, showedCallback);
            } else if (options.show == "animate") {
                self._popupRoot.animate(options.showEffectOptions, options.showSpd, showedCallback);
            }
            else {
                if (options.autoPos && (options.autoPos == "left-top" || options.autoPos == "right-top")) {
                    var $el = this.element;
                    var offset = $el.offset();
                    var popup = this._popupRoot;
                    self._popupRoot.animate({ top: offset.top - popup.outerHeight(), height: "toggle" }, options.showSpd, showedCallback);
                } else {
                    self._popupRoot.slideDown(options.showSpd, showedCallback);
                }
            }
        },
        //#endregion

        //#region hide
        hide: function(im) {
            var self = this, options = this.options;
            self._delayHide = self._isShowing;
            if (self._isHiding || !self._isShowed || self._isShowing) return;
            if (options.dropShadow && self._isShowed) {
                var shadowId = self._popupRoot.shadowId();
                if (shadowId) {
                    $("div#" + shadowId).hide();
                }
            }

            var hideCallback = function() {
                if (options.onHidden && $.isFunction(options.onHidden)) {
                    options.onHidden(self);
                }
                if (options.dropShadow && self._isShowed) {
                    var shadowId = self._popupRoot.shadowId();
                    if (shadowId) {
                        $("div#" + shadowId).hide();
                    }
                }
                self._isShowed = false;
                self._isHiding = false;

                if (self._delayShow) {
                    self.show();
                }
            };

            self._isHiding = true;
            if (options.hide && options.hide != "auto" && options.hide != "animate") {
                self._popupRoot.hide(options.hide, options.hideEffectOptions, options.hideSpd, hideCallback);
            } else if (options.hide == "animate") {
                self._popupRoot.animate(options.hideEffectOptions, options.hideSpd, hideCallback);
            }
            else {
                if (options.autoPos && (options.autoPos == "left-top" || options.autoPos == "right-top")) {
                    var $el = this.element;
                    var offset = $el.offset();
                    self._popupRoot.animate({ height: "toggle", top: offset.top }, options.hideSpd, hideCallback);
                } else {
                    self._popupRoot.slideUp(options.hideSpd, hideCallback);
                }
            }

            if (im) {
                self._popupRoot.stop(true, true);
            }
        },
        //#endregion

        //#region _setPosition
        _setPosition: function() {
            var options = this.options;

            var $el = this.element;
            var offset = $el.offset();
            var adjust = { left: 0, top: 0, right: 0, bottom: 0 };
            var popup = this._popupRoot;

            if (options.autoWidth) {
                var w = $el.outerWidth();
                if (popup.outerWidth() < w)
                    popup.css({ width: w });
            }

            //var popupOffset = popup.offset();
            if (options.popupAdjust) {
                if (options.popupAdjust.left)
                    adjust.left = options.popupAdjust.left;
                if (options.popupAdjust.top)
                    adjust.top = options.popupAdjust.top;
                if (options.popupAdjust.right)
                    adjust.right = options.popupAdjust.right;
                if (options.popupAdjust.bottom)
                    adjust.bottom = options.popupAdjust.bottom;
            }

            var calPost = null;
            var position = options.position ? options.position : "left-bottom";
            if (position == "auto") {
                //TODO:Calculate the position
                var winH = $(window).height(); var winW = $(window).width();
                var sT = $(window).scrollTop(); var sL = $(window).scrollLeft();
                var pW = parseInt(popup.attr("_w")); var pH = parseInt(popup.attr("_h"));
                position = "left";
                calPost = this._calPosition("left-bottom", offset, $el, adjust, options);

                if (calPost.left - sL + pW > winW) {
                    position = "right"
                }

                if (calPost.top - sT + pH > winH) {
                    position = position + "-top";
                } else {
                    position = position + "-bottom";
                }

                if (position != "left-bottom")
                    calPost = this._calPosition(position, offset, $el, adjust, options);
            }

            if (calPost == null)
                calPost = this._calPosition(position, offset, $el, adjust, options);

            popup.css(calPost);
            return calPost;
        },
        //#endregion

        //#region _calPosition
        _calPosition: function(position, offset, $el, adjust, options) {
            var popup = this._popupRoot;
            options.autoPos = "";
            switch (position) {
                case "left-bottom":
                    return { left: offset.left + adjust.left, top: offset.top + $el.outerHeight() + adjust.top };
                case "right-bottom":
                    return { left: offset.left + ($el.outerWidth() - popup.outerWidth() - adjust.right)
                        , top: offset.top + $el.outerHeight() + adjust.top
                    };
                case "left-top":
                    options.autoPos = "left-top";
                    return { left: offset.left + adjust.left
                        , top: offset.top + adjust.top - (options.show != "auto" ? popup.outerHeight() : 0)
                    };
                case "right-top":
                    options.autoPos = "right-top";
                    return { left: offset.left + $el.outerWidth() - popup.outerWidth() - adjust.right
                        , top: offset.top + adjust.top - (options.show != "auto" ? popup.outerHeight() : 0)
                    };
                case "top-right":
                    return { left: offset.left + $el.outerWidth() + adjust.left, top: offset.top + adjust.top };
                case "top-left":
                    return { left: offset.left - (adjust.left + popup.outerWidth()), top: offset.top + adjust.top };
            }
            return { lef: 0, top: 0 };
        },
        //#endregion

        //#region _hidePopupTimeOut
        _hidePopupTimeOut: function() {
            var self = this, options = this.options;
            if (self._hideTimeOut)
                clearTimeout(self._hideTimeOut);

            self._hideTimeOut = setTimeout(function() {
                self.hide();
            }, options.hideTimeout);
        }
        //#endregion
    });

    //#region $.extend($.ui.dropdown
    $.extend($.ui.dropdown, {
        version: "1.0",
        defaults: {
            contentId: null,
            triggerEvent: "mouseover",
            hide: "blind",
            show: "blind",
            zIndex: 1000,
            hideTimeout: 300,
            showSpd: "fast",
            hideSpd: "fast",
            hideEffectOptions: {},
            showEffectOptions: {},
            bgiframe: false,
            position: "left-bottom",
            moveToRoot: true, // Move Dropdown Html To Body
            autoWidth: true, // if true set popupcontent width equal trigger object
            dropShadow: true,
            popupAdjust: { left: 0, top: 0, bottom: 0, right: 0 },
            onShowed: null,
            onHidden: null,
            customhideTarget: null
        }
    });
    //#endregion
})(jQuery);

(function($) {
    $.widget("ui.floating", {
        //#region _init
        _init: function() {
            var self = this, options = this.options, el = this.element;
            this.udata = null;
            //options
            if (options.floatObject != "self") options.floatObject = "dummy";
            if (options.displayDummy != "hidden" && options.displayDummy != "auto" && options.displayDummy != "none")
                options.displayDummy = "none";
            if (isNaN(options.width)) options.width = "auto";
            //private vars
            this._isDestroyed = false;
            if (!options.getOffset && !$.isFunction(options.getOffset)) {
                options.getOffset = null;
                this.o = el.offset();
            } else {
                this.o = options.getOffset();
            }

            this._css = { left: el.css("left"), top: el.css("top"), position: el.css("position"), zIndex: el.css("z-index") };

            this.o.width = options.width == "auto" ? el.outerWidth() : options.width;
            this._isFloating = false;

            this.windowSize = { l: $(window).scrollLeft(), w: $(window).width(), h: $(window).height(), t: $(window).scrollTop() };
            if (options.dummy == null) {
                options.dummy = $("<div></div>");
            }
            //            if (options.displayDummy == "hidden") {
            //                options.dummy.css({ display: "none", width: this.o.width, height: el.height() });
            //            } else if (options.displayDummy == "auto") {
            //                options.dummy.css({ display: "none" });
            //            }

            //Init
            this.rfn = function(e) {
                self._windowResize(e);
            };
            $(window).bind("resize", this.rfn);
            this.sfn = function(e) {
                self._windowScroll(e)
            };
            $(window).bind("scroll", this.sfn);
        },
        //#endregion

        //#region floating
        floating: function() {
            this._floating(this.windowSize.l, this.windowSize.t, this.windowSize.w, this.windowSize.h);
        },
        //#endregion

        //#region windowScroll
        windowScroll: function() {
            this.windowSize.l = 0; this.windowSize.t = 0;
            this._windowScroll();
        },
        //#endregion

        //#region _windowScroll
        _windowScroll: function(e) {
            var t = $(window).scrollTop();
            var l = $(window).scrollLeft();
            if (this.windowSize.t != t || this.windowSize.l != l) {
                this.windowSize.t = t;

                if (this.windowSize.l != l) {
                    this.o.left = this._getOffset().left - l;
                    this.windowSize.l = l;
                }
                this._floating(l, t);
                this.onWindowScroll();
            }
        },
        //#endregion

        //#region windowResize
        windowResize: function() {
            this.windowSize.h = 0; this.windowSize.w = 0;
            this._windowResize();
        },
        //#endregion

        //#region _windowResize
        _windowResize: function(e) {
            var h = $(window).height(), w = $(window).width();
            var t = $(window).scrollTop();
            var options = this.options; var self = this;
            if (this.windowSize.h != h || this.windowSize.w != w || this.windowSize.t != t) { // must compare scroll top for document size changed by jquery animation
                if (typeof (this._to) != 'undefined' && this._to) clearTimeout(this._to);
                this._to = setTimeout(function() {
                    if (self._isDestroyed) return;
                    var l = $(window).scrollLeft();
                    if (self.windowSize.h != h || self.windowSize.w != w) {
                        if (self.windowSize.w != w) {
                            if (l > 0 && l == self.windowSize.l && self.windowSize.w < w) {
                                l = l - (w - self.windowSize.w);
                                if (l < 0) l = 0;
                            }
                            self.o.left = self._getOffset().left - l;
                        }
                        //                    else {
                        //                        if (!options.getOffset && !$.isFunction(options.getOffset)) {
                        //                            this.o.left = this._getOffset().left - $(window).scrollLeft();
                        //                        } else {
                        //                            //this.o = options.getOffset();
                        //                        }
                        //                    }
                    }
                    self.windowSize.l = l;
                    self.windowSize.h = h;
                    self.windowSize.w = w;
                    self.windowSize.t = t;
                    self.onWindowResize();
                    self._floating(l, t, h, w);
                }, 50);
            }
        },
        //#endregion

        //#region onWindowResize
        onWindowResize: function() {
            var self = this;
            if (self.options.onSized) self.options.onSized({ window: this.windowSize, isF: this._isFloating, element: this.element, oTop: this.o.top });
        },
        //#endregion

        //#region onWindowScroll
        onWindowScroll: function() {
            if (this.options.onScrolled) this.options.onScrolled({ window: this.windowSize, isF: this._isFloating, element: this.element, oTop: this.o.top });
        },
        //#endregion

        //#region _getOffset
        _getOffset: function() {
            var offset;
            if (this.options.floatObject == "self" && this._isFloating) {
                offset = this.options.dummy.offset();
            } else {
                offset = this.element.offset();
            }
            return offset;
        },
        //#endregion

        //#region updateOffset
        updateOffset: function(off) {
            if (off && off.left && off.top)
                this.o = off;
            else {
                if (this.options.getOffset)
                    this.o = this.options.getOffset();
                else
                    this.o = this._getOffset();
            }
        },
        //#endregion

        //#region updateDummySize
        updateDummySize: function(w, h) {
            if (this.options.displayDummy != "none") {
                if (w) this.options.dummy.width(w);
                if (h) this.options.dummy.height(h);
            }
        },
        //#endregion

        //#region _floating
        _floating: function(l, t, h, w) {
            if (this._isDestroyed) return;
            var ops = this.options, o = this.o, el = this.element, elH = el.height();
            if (t == null) t = $(window).scrollTop();
            if (t + ops.top >= o.top && t != 0) {
                if (!this._isFloating) {
                    var e = { data: this.udata, element: el, dummy: ops.dummy, window: this.windowSize, scrollTop: t, oTop: o.top, oLeft: o.left, elLeft: o.left, elTop: ops.top, cancel: false, elHeight: elH, elWidth: el.width(), isF: this._isFloating };
                    if (ops.onFloat && $.isFunction(ops.onFloat)) {
                        var rt = ops.onFloat(e);
                        if (rt === false) e.cancel = true;
                        this.udata = e.data;
                        o.top = e.oTop; o.left = e.oLeft;
                        if (e.cancel) return;
                    }
                    if (ops.dummy) {
                        try {
                            if (ops.dummyPosition == "after") {
                                ops.dummy.insertAfter(el);
                            } else {
                                ops.dummy.insertBefore(el);
                            }
                        } catch (exx) {
                            //element already removed
                            this.destroy();
                        }
                        if (ops.floatObject == "self") {
                            if (ops.displayDummy == "hidden" || ops.displayDummy == "none") ops.dummy.css("visibility", "hidden");
                            ops.dummy.css($.extend({ display: ops.displayDummy == "auto" || ops.displayDummy == "hidden" ? el.css("display") : "block",
                                height: ops.displayDummy == "none" ? 1 : elH, width: e.elWidth
                            }, this._css));
                        } else {
                            ops.dummy.css({ visibility: "visible" });
                        }
                    }
                    if (ops.floatObject == "self") {
                        el.css({ zoom: 1, left: e.elLeft, top: e.elTop, zIndex: ops.zIndex, width: e.elWidth, height: e.elHeight, position: "fixed" });
                    } else {
                        ops.dummy.css({ display: "block", zoom: 1, left: e.elLeft, top: e.elTop, zIndex: ops.zIndex, width: e.elWidth, height: elH, position: "fixed" });
                    }
                    this._isFloating = true;
                }

                if (this._isFloating) {
                    var e = { data: this.udata, element: el, dummy: ops.dummy, window: this.windowSize, scrollTop: t, oTop: o.top, oLeft: o.left, elLeft: o.left, elTop: ops.top, cancel: false, elHeight: el.height(), elWidth: el.width(), isF: this._isFloating };
                    if (ops.onFloating && $.isFunction(ops.onFloating)) {
                        var rt = ops.onFloating(e);
                        if (rt === false) e.cancel = true;
                        this.udata = e.data;
                        o.top = e.oTop; o.left = e.oLeft;
                        if (e.cancel)
                            return;
                    }
                    if (ops.floatObject == "self")
                        if (el.parent().prev().hasClass("collapsed"))
                            el.css({ left: e.elLeft, top: e.elTop, height: this.udata.z.h, width: this.udata.z.w });
                        else
                            el.css({ left: e.elLeft, top: e.elTop, height: e.elHeight, width: e.elWidth });
                    else
                        ops.dummy.css({ left: e.elLeft, top: e.elTop, height: e.elHeight, width: e.elWidth });
                }
            } else {
                this.dock();
            }
        },
        //#endregion

        //#region dock
        dock: function() {
            if (this._isFloating) {
                var ops = this.options; var o = this.o; var el = this.element;
                if (ops.onDock && $.isFunction(ops.onDock)) {
                    var e = { data: this.udata, element: el, dummy: ops.dummy, window: this.windowSize, oTop: o.top, oLeft: o.left, elLeft: o.left, elTop: ops.top, cancel: false, elHeight: "auto", elWidth: "auto" };
                    var rt = ops.onDock(e);
                    if (rt === false) e.cancel = true;
                    o.top = e.oTop; o.left = e.oLeft;
                    this.udata = e.data;
                }

                if (ops.floatObject == "self") {
                    var ss = $.extend({}, this._css, (e ? { height: e.elHeight, width: e.elWidth} : {}));
                    el.css(ss);
                }
                if (ops.dummy) { ops.dummy.remove(); ops.dummy.css("display", "none"); }
                this._isFloating = false;

                if (ops.onDocked && $.isFunction(ops.onDocked)) {
                    var e = { data: this.udata, element: el, dummy: ops.dummy, window: this.windowSize, oTop: o.top, oLeft: o.left };
                    ops.onDocked(e);
                    o.top = e.oTop; o.left = e.oLeft;
                    this.udata = e.data;
                }
            }
        },
        //#endregion

        //#region _getData
        _getData: function(key) {
            if (key === "isFloating") {
                return this._isFloating;
            }
            return $.widget.prototype._getData.apply(this, arguments);
        },
        //#endregion

        //#region destroy
        destroy: function() {
            this._isDestroyed = true;
            if (typeof (this._to) != 'undefined' && this._to) clearTimeout(this._to);
            this.dock();
            if (this.dummy)
                this.dummy.remove();
            $(window).unbind("scroll", this.sfn);
            $(window).unbind("resize", this.rfn);
            $.widget.prototype.destroy.apply(this, arguments);
        }
        //#endregion
    });

    //#region $.extend($.ui.floating
    $.extend($.ui.floating, {
        version: "1.0",
        defaults: {
            top: 0,
            left: "auto",
            width: "auto",
            displayDummy: "hidden", // "auto","hidden","none"
            dummy: null,
            zIndex: 1000,
            floatObject: "self", //self or dummy
            dummyPosition: "after",
            getOffset: null,
            onFloating: null,
            onFloat: null,
            onDock: null,
            onDocked: null,
            onScrolled: null,
            onSized: null
        }
    });
    //#endregion
})(jQuery);

(function($) {
    $.widget("ui.loadingMask", {
        //#region _init
        _init: function() {
            this.mask = $("<div class='processing'/>").insertBefore(this.element);
            this.mask.show();
            this.refresh();
            this.show();
        },
        //#endregion

        //#region refresh
        refresh: function(w, h) {
            if (!w) w = "auto";
            if (!h) h = "auto";
            var el = this.element;
            var ops = this.options;
            if (w == "auto") ops.width = el.width();
            else ops.width = w;
            if (h == "auto") ops.height = el.height();
            else ops.height = h;

            this.mask.width(ops.width).height(ops.height);
        },
        //#endregion

        //#region show
        show: function() { if (this.mask) this.mask.show(); },
        //#endregion

        //#region hide
        hide: function() { if (this.mask) this.mask.hide(); },
        //#endregion

        //#region _setOption
        _setOption: function(key, value) {
            this.options[key] = value;
            this.refresh();
        }
        //#endregion
    });

    //#region $.extend($.ui.loadingMask
    $.extend($.ui.loadingMask, {
        version: "1.0",
        defaults: {
            maskCss: "processing",
            width: "auto",
            height: "auto",
            zIndex: 999
        }
    });
    //#endregion
})(jQuery);
