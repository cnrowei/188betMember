/*
===============================================================================
    Author:     Bumi Gosali                                
    Description: Custom text format extenders for KnockoutJS                             
===============================================================================
*/

var formatNumber = function (element, valueAccessor, allBindingsAccessor, format) {
    // Set zero or null number formatting
    numeral.zeroFormat("0");

    // Provide a custom text value
    var value = valueAccessor(), allBindings = allBindingsAccessor();
    var numeralFormat = allBindingsAccessor.numeralFormat || format;
    var strNumber = ko.utils.unwrapObservable(value);

    return numeral(strNumber).format(numeralFormat);
};

var formatNumberCustom = function (element, valueAccessor, allBindingsAccessor, format) {
    // Set zero or null number formatting
    numeral.zeroFormat("0");

    // Provide a custom text value
    var value = valueAccessor(), allBindings = allBindingsAccessor();
    var numeralFormat = allBindingsAccessor.numeralFormat || format;
    var strNumber = ko.utils.unwrapObservable(value);

    return numeral((Math.floor(strNumber * 100) / 100)).format(numeralFormat);
};

var formatGeneral = function (element, valueAccessor, allBindingsAccessor, format) {
    // Set zero or null number formatting
    numeral.zeroFormat("0");

    // Provide a custom text value
    var value = valueAccessor(), allBindings = allBindingsAccessor();
    var numeralFormat = allBindingsAccessor.numeralFormat || format;
    var strNumber = ko.utils.unwrapObservable(value);

    if (strNumber == null)
        return "";
    if (isNaN(strNumber))
        return strNumber;

    return numeral(strNumber).format(numeralFormat);
};

ko.bindingHandlers.numericText = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0"));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0"));
    }
};

ko.bindingHandlers.moneyText = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0.00"));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0.00"));
    }
};

ko.bindingHandlers.moneyTextCustom = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumberCustom(element, valueAccessor, allBindingsAccessor, "0,0.00"));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumberCustom(element, valueAccessor, allBindingsAccessor, "0,0.00"));
    }
};

ko.bindingHandlers.percentText = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0.00 %"));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0.00 %"));
    }
};

ko.bindingHandlers.generalText = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatGeneral(element, valueAccessor, allBindingsAccessor, "0,0"));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatGeneral(element, valueAccessor, allBindingsAccessor, "0,0"));
    }
};
