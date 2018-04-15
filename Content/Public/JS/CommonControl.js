/// <reference path="../Lib/Jquery/jquery-1.9.1-vsdoc.js" />

var Control = {}; // common control

//#region Control.Dialog
Control.Dialog = {
    _dialogID: "custom-dialog"
    , type: { Information: "info", Alert: "alert", Question: "confirm", Prompt: "promte", Splash: "splash", Blank : "blank" }

    //#region showMessage
    , showMessage: function (title, message, okFunction) {
        this._showDialog(this.type.Information, title, message, [{ Text: l.Dlg_OK, Callback: okFunction}]);
    }
    //#endregion

    //#region showQRImage
    , showQRImage: function (title, message, okFunction) {
        this._showDialog(this.type.Blank,title, message, [{ Text: l.Dlg_OK, Callback: okFunction }]);
    }
    //#endregion

    //#region showAlert
    , showAlert: function (title, message, okFunction) {
        this._showDialog(this.type.Alert, title, message, [{ Text: $("#okayBtn").text(), Callback: okFunction}]);
    }
    //#endregion
    , showAlertWithOption: function (title, message, buttonOption, btn1function, btn2function) {
        this._showDialog(this.type.Question, title, message, [{ Text: buttonOption[0], Callback: btn1function }, { Text: buttonOption[1], Callback: btn2function}]);
    }

    //#region showConfirm
    , showConfirm: function (title, message, yesFunction, noFunction) {
        this._showDialog(this.type.Question, title, message, [{ Text: l.Dlg_Yes, Callback: yesFunction }, { Text: l.Dlg_NO, Callback: noFunction}]);
    }
    //#endregion

    //#region showPromptMessage
    , showPromptMessage: function (title, message, buttonOption, but1function, but2function) {
        this._showDialog(this.type.Prompt, title, message, [{ Text: buttonOption[0], Callback: but1function }, { Text: buttonOption[1], Callback: but2function }, { Text: buttonOption[2], Callback: function () { } }]);
    }
    //#endregion

    //#region showSplashMessage
    , showSplashMessage: function (title, message) {
        this._showDialog(this.type.Splash, title, message);
    }
    //#endregion

    //#region _render
    , _render: function (iconClassName, title, message) {
        var builders = [];
        builders.push("<div id=\"" + this._dialogID + "\" title=\"" + title + "\">");
        builders.push("<table id='_dlgct'><tr><td valign='top'>");
        builders.push("<span class=\"" + iconClassName + " ui-icon ui-icon-circle-check\"></span>");
        builders.push("</td><td valign='middle'>");
        builders.push(message);
        builders.push("</td></tr></table>");
        builders.push("</div>");
        return $(builders.join(""));
    }
    //#endregion

    //#region _render_Splash
    , _render_Splash: function (iconClassName, title, message) {//GCR-518 for Splash Page.
        var builders = [];
        builders.push("<div id=\"" + this._dialogID + "\" title=\"" + title + "\" style='margin:5px 10px'>");
        builders.push(message);
        builders.push("</div>");
        return $(builders.join(""));
    }
    //#endregion

    //#region _showDialog
    , _showDialog: function (type, title, message, myButtons) {

        // TODO: move this function to the root of Dialog
        var winResize = function () {
            var left = ($(window).width() - $dlg.outerWidth()) / 2;
            var top = $(window).height() > $dlg.outerHeight() ? ($(window).height() - $dlg.outerHeight()) / 2 : 10;
            $dlg.css({ top: top, left: left });
        };

        var iconClass = (type && type.toString().length > 0) ? "icon-" + type : "icon-" + this.type.Information;
        var buttonOptions = {};

        if ($.isArray(myButtons)) {
            $(myButtons).each(function (index) {
                buttonOptions[myButtons[index].Text] = function () {
                    if (myButtons[index].Callback && $.isFunction(myButtons[index].Callback)) myButtons[index].Callback();
                    $(this).dialog("close");
                };
            });
        }

        var $myDialog = type == Control.Dialog.type.Splash ? this._render_Splash(iconClass, title, message) : this._render(iconClass, title, message);

        var _W = type == Control.Dialog.type.Prompt ? 785 : (type == Control.Dialog.type.Splash ? 840 : 260);
        var maxH = $(window).height();

        $myDialog.dialog({
            modal: true,
            resizable: false,
            width: _W,
            minHeight: 66,
            maxHeight: maxH,
            buttons: buttonOptions,
            draggable: false,
            open: function (event, ui) {
                $(window).resize(winResize);
            },
            close: function (event, ui) {
                $(window).unbind("resize", winResize);
                $(event.target || event.srcElement).remove();
            }
        });

        var $dlg = $myDialog.parent("div.ui-dialog");

        var dymheight = maxH > $dlg.outerHeight() ? (maxH - $dlg.outerHeight()) / 2 : 10;
        var dymwidth = $(window).width() > _W ? ($(window).width() - _W) / 2 : 10;

        $dlg.addClass("c-dlg").css({ width: _W, top: type == Control.Dialog.type.Splash ? 10 : dymheight, left: dymwidth });

        if (type == Control.Dialog.type.Splash) {//for scrollbar.
            $dlg.addClass("splash-dlg");
        }

        if (type == Control.Dialog.type.Alert || type == Control.Dialog.type.Splash)
            $("a.ui-dialog-titlebar-close", $dlg).remove(); // for Alert remove close button

        if (type == Control.Dialog.type.Prompt) {

            // $dlg.find("div.ui-dialog-titlebar").prepend("<a class='ui-dialog-titlebar-ribbon ui-corner-all'></a>");
            // $dlg.find(".ui-dialog-title").css("padding-left", "18px");
            $dlg.find("table#_dlgct tr td:eq(0)").remove();

            var $buttonpane = $dlg.find("div.ui-dialog-buttonpane");
            var $checkbox = $buttonpane.find("button:eq(2)");

            $buttonpane.append("<span class='btnright'>" + $checkbox.text() + "<input type='checkbox' id='ckbDontShow' /input></span>");
            $buttonpane.find('button').css({ "float": "left" });
            $checkbox.remove();

            $("#custom-dialog").css("margin", "3px 15px");
        }
    }
    //#endregion
};
//#endregion

//#region Control.Select
Control.Select = {
    List_Prefix: "list_",
    Text_Prefix: "text_",
    selectCache: new Array(),

    //#region init
    init: function(select, options) {
        options = $.extend({ type: "single", position: "auto", disabled: false, dropShadow: true }, options);
        var id = select.id;
        var $self = Control.Select._build.apply(select, [options]);
        $self._allLinks = $("li > a", $self.list);
        $self._selectedIndex = checkIndex($self._selectedIndex);
        $self._selectedLink = $self._allLinks.eq($self._selectedIndex);

        var focusedIndex = $self._selectedIndex;
        var focusedLink = $self._selectedLink;

        initBehavior();

        //#region initBehavior
        function initBehavior() {
            $self.text.dropdown({ contentId: $self.list[0].id, show: "auto", hide: "auto", position: options.position, triggerEvent: "click",
                dropShadow: options.dropShadow == true,
                onShowed: function() {
                    $self.isAnimating = false;
                    if ($self.list.is(":visible")) {
                        if (typeof ($self._selectedIndex) == "undefined" || $self._selectedIndex < 0) $self._selectedIndex = parseInt($self.attr("selectedIndex"));
                        if ($self._selectedIndex >= 0) $self._allLinks.removeClass("focus").eq($self._selectedIndex).addClass("focus");
                        $self.text.focus();
                        bindItemEvent();
                        scrollTo($self._selectedLink);
                    }
                }
            });

            $self.text.keydown(function(e) {
                if ($(this).attr("disabled")) return;
                var keyCode = e.keyCode;
                var focus = $self.list.is(":visible");
                keyDown(e, focus);
            });

            if ($.browser.msie) {
                $self.list.keydown(function(e) {
                    var keyCode = e.keyCode;
                    keyDown(e, true);
                });
                $("ul", $self.list).bind("mousewheel", function(e) { e.stopPropagation(); });
            } else {
                $("ul", $self.list).scroll(function(e) {
                    window.setTimeout(function() { $self.text.focus(); }, 1000);
                });
            }
        }
        //#endregion

        //#region bindItemEvent
        function bindItemEvent() {
            $self._allLinks.unbind("click").bind('click', function(e) {
                if (options.type == "link") return;
                var $this = $(this);
                $self._selectedIndex = $self._allLinks.index($this);
                moveToItem($this);
                $self.text.dropdown("hide");
                return false;
            }).hover(function() {
                var $this = $(this);
                $self._allLinks.eq($self._selectedIndex).removeClass("focus");
                $this.addClass("focus");
                focusedIndex = $self._allLinks.index($this);
            }, function() { $(this).removeClass("focus"); });
        }
        //#endregion

        //#region updateValue
        function updateValue(atLink) {
            var value = atLink.attr("value");
            if (value != $self.val()) {
                var html = atLink.html();
                $self.text.html(html);
                $self.val(value).trigger("change");
            }
        }
        //#endregion

        //#region checkIndex
        function checkIndex(newIndex) {
            return Math.max(0, Math.min(newIndex, ($self._allLinks) ? $self._allLinks.length - 1 : 0));
        }
        //#endregion

        //#region moveToItem
        function moveToItem(item) {
            if (options.type == "link") {
                item.get(0).click();
                return;
            }

            focusedIndex = $self._selectedIndex;

            $self._allLinks.removeClass();
            item.addClass("focus");

            $self._selectedLink = item;
            updateValue(item);
        }
        //#endregion

        //#region moveTo
        function moveTo(newIndex) {
            var newIndex = checkIndex(newIndex);

            if (newIndex != $self._selectedIndex) {
                $self._selectedIndex = newIndex;
                $self._selectedLink = $self._allLinks.eq($self._selectedIndex);

                focusedIndex = $self._selectedIndex;

                moveToItem($self._selectedLink);
            }
        }
        //#endregion

        //#region focusTo
        function focusTo(newIndex) {
            var newIndex = checkIndex(newIndex);
            if (newIndex != focusedIndex) {
                focusedIndex = newIndex;

                var atLink = $self._allLinks.eq(focusedIndex);
                $self._allLinks.removeClass("focus");
                atLink.addClass("focus");
                scrollTo(atLink);
            }
        }
        //#endregion

        //#region focusUp
        function focusUp() { focusTo(focusedIndex - 1); }
        //#endregion

        //#region moveUp
        function moveUp() { moveTo($self._selectedIndex - 1); }
        //#endregion

        //#region focusDown
        function focusDown() { focusTo(focusedIndex + 1); }
        //#endregion

        //#region moveDown
        function moveDown() { moveTo($self._selectedIndex + 1); }
        //#endregion

        //#region scrollTo
        function scrollTo(atLink) {
            var $scrollPanel = $("ul", $self.list);
            var curTop = $scrollPanel.scrollTop();
            var newTop = atLink.offset().top + $scrollPanel.scrollTop() - $scrollPanel.offset().top;
            if (newTop < curTop || newTop > curTop - 15 + $scrollPanel.height()) {
                $scrollPanel.scrollTop(-15 + newTop);
            }
        }
        //#endregion

        //#region keyDown
        function keyDown(e, focus) {
            var keyCode = e.keyCode;
            switch (keyCode) {
                case KEY_UP: focus ? focusUp() : moveUp(); e.preventDefault(); break;
                case KEY_DOWN: focus ? focusDown() : moveDown(); e.preventDefault(); break;
                case KEY_ENTER: if (focus) { moveTo(focusedIndex); $self.text.dropdown("hide"); } break;
                case $.ui.keyCode.TAB: if (focus) { $self.text.dropdown("hide"); } break;
                default:
                    if (acceptKey(keyCode)) {
                        var c = codeToChar(keyCode);
                        switchToChar(c, focus);
                    }
            }
        }
        //#endregion

        //#region acceptKey
        function acceptKey(keyCode) {
            return ((keyCode >= KEY_A && keyCode <= KEY_Z) || (keyCode >= KEY_0 && keyCode <= KEY_9) || (keyCode >= KEY_NUMPAD_0 && keyCode <= KEY_NUMPAD_9));
        }
        //#endregion

        //#region matchCharacter
        function matchCharacter(txt, c) {
            // UAT-888, ignore if starts with '+' sign
            if (txt.charAt(0) == '+') { return txt.charAt(1).toUpperCase() == c; }
            return txt.charAt(0).toUpperCase() == c;
        }
        //#endregion

        //#region switchToChar
        function switchToChar(c, focusingTo) {
            var start = focusedIndex;
            if (start < 0) start = $self._selectedIndex;
            if (start < 0) start = 0;

            var $list = $self._allLinks;
            var beforeIdx = -1, foundIdx = -1;
            $self._allLinks.each(function(idx) {

                var txt = $(this).text();
                if (beforeIdx < 0 && idx <= start) {
                    if (matchCharacter(txt, c)) {
                        beforeIdx = idx;
                    }
                } else if (foundIdx < 0 && idx > start) {
                    if (matchCharacter(txt, c)) {
                        foundIdx = idx;
                    }
                }
            });

            if (foundIdx < 0) {
                foundIdx = beforeIdx;
            }
            if (foundIdx >= 0) {
                if (focusingTo) {
                    focusTo(foundIdx);
                } else {
                    moveTo(foundIdx);
                }
            }
        }
        //#endregion

        //#region codeToChar
        function codeToChar(code) {
            if (code >= KEY_NUMPAD_0 && code <= KEY_NUMPAD_9) return (code - KEY_NUMPAD_0).toString();
            else return String.fromCharCode(code);
        }
        //#endregion

        return $self;
    },
    //#endregion

    //#region select
    select: function(ddl, accept) {
        var selObj = Control.Select.selectCache[ddl];
        var textObj = selObj.text;
        var listObj = selObj.list;

        var objs = $("a", listObj).each(function(idx) {
            var value = $(this).attr("value");
            if (accept(value)) {
                selObj._selectedIndex = idx;
                selObj._selectedLink = $(this);
                textObj.html($(this).html());
                return;
            };
        });
    },
    //#endregion

    //#region _buildLinkItem
    _buildLinkItem: function() {
        if (this.text) return "<li><a href=\"" + this.value + "\"" + (this.selected ? ' class="focus">' : '>') + this.text + "</a></li>";
        return "";
    },
    //#endregion

    //#region _buildBreak
    _buildBreak: function() {
        return "<li class='break-line'>" + this.text + "</li>";
    },
    //#endregion

    //#region _buildItem
    _buildItem: function() {
        if (this.text) return "<li><a href='javascript:void(0)' value=\"" + this.value + "\"" + (this.selected ? ' class="focus">' : '>') + this.text + "</a></li>";
        return "";
    },
    //#endregion

    //#region _buildHeader
    _buildHeader: function(id, disabled) {
        $this = $(this);
        return "<a id='" + Control.Select.Text_Prefix + id + "' href='javascript:void(0)' class='ddl-text'" + (disabled ? " disabled='disabled'" : "") + ">" + $this.text() + "</a>" +
"<input name='" + ($(this).attr("name") ? $(this).attr("name") : id) + "' id='" + id + "' value=\"" + $this.val() + "\" type='hidden' />";
    },
    //#endregion

    //#region _build
    _build: function(options) {
        var text = "";
        var list = [];
        var id = this.id;
        var selectedIndex = 0;

        list.push("<div class='ddl-list' id='" + Control.Select.List_Prefix + id + "'><ul>");

        if (this.options.length == 0) text = Control.Select._buildHeader.apply(this, [id, options.disabled]);
        else {
            var index = 0; // only index for links, don't count 'ignore' options
            $("option", $(this)).each(function() {
                if ($(this).is(":selected")) {
                    text = Control.Select._buildHeader.apply(this, [id, options.disabled]);
                    selectedIndex = index;
                }
                if (this.value == 'ignore') { list.push(Control.Select._buildBreak.apply(this)); index--; }
                else if (options.type == "link") { list.push(Control.Select._buildLinkItem.apply(this)); }
                else list.push(Control.Select._buildItem.apply(this));
                index++;
            });
        }
        list.push("</ul></div>");

        // attach text and list to DOM
        $(this).after(text);
        $(document.body).append(list.join(""));

        // set class & bind events
        this.id = "fake_" + id;
        var $self = $("#" + id);

        $self._selectedIndex = selectedIndex;

        $self.text = $("#" + Control.Select.Text_Prefix + id);
        $self.list = $("#" + Control.Select.List_Prefix + id);
        $self.options = options;
        $self._allLinks = $("li > a", $self.list);

        Control.Select.selectCache[id] = $self;

        if (this.className) $self.text.addClass(this.className);
        if ($(this).attr("title")) $self.text.attr("title", $(this).attr("title"));

        if (this.onfocus) $self.text.bind("focus", this.onfocus);
        if (this.onclick) $self.text.bind("click", this.onclick);
        if (this.onchange) $self.bind("change", this.onchange);
        var events = $.data(this, "events");
        if (events) {
            var types = ["click", "focus"];
            var handlers = [];
            // bind events to textbox
            for (var i = 0; i < types.length; i++) {
                handlers = events[types[i]];
                for (var handler in handlers) $.event.add($self.text[0], types[i], handlers[handler], handlers[handler].data);
            }
            // bind events to input
            types = ["change"];
            for (var i = 0; i < types.length; i++) {
                handlers = events[types[i]];
                for (var handler in handlers) $.event.add($self.get(0), types[i], handlers[handler], handlers[handler].data);
            }
        }
        $(this).remove();

        return $self;
    },
    //#endregion

    //#region remove
    remove: function(id, index) {
        var $self = Control.Select.selectCache[id];
        if ($self == null) { return; }

        var allItems = $("ul > li", $self.list);
        if (index < 0 || index > allItems.length - 1) {
            return;
        }

        if (index == $self._selectedIndex) {
            $self.text.text(" - ");
            $self.val("").trigger("change");
            $self._selectedIndex = -1;
        }
        allItems.eq(index).remove();
    },
    //#endregion

    //#region removeAll
    removeAll: function(id) {
        var $self = Control.Select.selectCache[id];
        if ($self == null) { return; }

        var allItems = $("ul > li", $self.list).remove();
        if ($self._selectedIndex >= 0) {
            $self.text.text(" - ");
            $self._selectedIndex = -1;
        }
    },
    //#endregion

    //#region addItem
    addItem: function(id, item, index) {
        Control.Select.addItems(id, [item], index);
    },
    //#endregion

    //#region addItems
    addItems: function(id, items, index) {
        if (items == null || items.length == 0) return;
        var $self = Control.Select.selectCache[id];
        if ($self == null) { return; }

        var options = $self.options;
        var itemCode = "Control.Select._buildItem.apply(this)";
        if (options && options.type == "link") {
            itemCode = "Control.Select._buildLinkItem.apply(this)";
        }

        // Performance improvement.
        var allItems = $("ul > li", $self.list);
        var parent = null;
        if (!index) {
            parent = $("ul", $self.list);
            $(items).each(function() {
                parent.append(eval(itemCode));
            });
        } else if (allItems.length == 0 && index == 0) {
            parent = $("ul", $self.list);
            $(items).each(function() {
                parent.append(eval(itemCode));
            });
        } else if (index < allItems.length && index >= 0) {
            var $current = allItems.eq(index);
            $(items).each(function() {
                $current.before(eval(itemCode));
            });
        } else {
            return;
        }
    },
    //#endregion

    //#region refresh
    refresh: function(id) {
        var $self = Control.Select.selectCache[id];
        if ($self == null) { return; }
        $self.list = $("#" + Control.Select.List_Prefix + id);
        $self._allLinks = $("li > a", $self.list);
        var $selected = $("li > a.focus", $self.list);
        if ($selected.size() > 0) {
            $self.text = $("#" + Control.Select.Text_Prefix + id);
            $self.text.html($selected.text());
            $self.val($selected.val());
            $self.attr("selectedIndex", $("li > a", $self.list).index($selected));
        }

        Control.Select.selectCache[id] = $self;
    },
    //#endregion

    //#region disabled
    disabled: function(id, disabled) {
        if (disabled) $("#" + Control.Select.Text_Prefix + id).attr("disabled", "disabled").addClass("ddl-dsd");
        else $("#" + Control.Select.Text_Prefix + id).removeAttr("disabled").removeClass("ddl-dsd");
    }
    //#endregion
};
//#endregion
