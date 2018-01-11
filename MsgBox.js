//Simple Message Box based on JQueryUI Dialod widget
var Icons = /** @class */ (function () {
    function Icons() {
    }
    Icons.Warning = "Warning.gif";
    Icons.Error = "Error.gif";
    Icons.Attention = "Attention.gif";
    Icons.Help = "Help.gif";
    Icons.Information = "Information.gif";
    return Icons;
}());
var Values = /** @class */ (function () {
    function Values() {
    }
    Values.Unknown = null;
    Values.OK = 1;
    Values.Cancel = -1;
    Values.Yes = 2;
    Values.No = 0;
    return Values;
}());
var Labels = /** @class */ (function () {
    function Labels() {
    }
    Labels.OK = "OK";
    Labels.Cancel = "Cancel";
    Labels.Yes = "Yes";
    Labels.No = "No";
    return Labels;
}());
var InstanceValues = /** @class */ (function () {
    function InstanceValues() {
        this.Unknown = Values.Unknown;
        this.OK = Values.OK;
        this.Cancel = Values.Cancel;
        this.Yes = Values.Yes;
        this.No = Values.No;
    }
    return InstanceValues;
}());
var InstanceLabels = /** @class */ (function () {
    function InstanceLabels() {
        this.OK = Labels.OK;
        this.Cancel = Labels.Cancel;
        this.Yes = Labels.Yes;
        this.No = Labels.No;
    }
    return InstanceLabels;
}());
var ThenAble = /** @class */ (function () {
    function ThenAble() {
    }
    ThenAble.prototype.then = function (onClosed) {
        if (onClosed) {
            this.onclosedTask = function () {
                onClosed(this.result);
            };
        }
    };
    return ThenAble;
}());
var MessageBox = /** @class */ (function () {
    function MessageBox(parameter) {
        this.cancel = false;
        this.focus = 1;
        this.title = "";
        this.labels = new InstanceLabels;
        this.values = new InstanceValues;
        if (typeof parameter === "function")
            this.onclose = parameter;
        else if (typeof parameter === "string")
            this.title = parameter;
        else if (typeof parameter === "number")
            this.focus = parameter;
        else if (typeof parameter === "object") {
            var opts = parameter;
            if (opts.labels) {
                if (typeof opts.labels.OK === "string")
                    this.labels.OK = opts.labels.OK;
                if (typeof opts.labels.Cancel === "string")
                    this.labels.Cancel = opts.labels.Cancel;
                if (typeof opts.labels.Yes === "string")
                    this.labels.Yes = opts.labels.Yes;
                if (typeof opts.labels.No === "string")
                    this.labels.No = opts.labels.No;
            }
            if (opts.values) {
                if (typeof opts.values.Unknown !== "undefined")
                    this.values.Unknown = opts.values.Unknown;
                if (typeof opts.values.OK !== "undefined")
                    this.values.Cancel = opts.values.OK;
                if (typeof opts.values.Cancel !== "undefined")
                    this.values.Cancel = opts.values.Cancel;
                if (typeof opts.values.No !== "undefined")
                    this.values.No = opts.values.No;
                if (typeof opts.values.Yes !== "undefined")
                    this.values.Yes = opts.values.Yes;
            }
            if (typeof opts.cancel === "boolean")
                this.cancel = opts.cancel;
            if (typeof opts.focus === "number")
                this.focus = opts.focus;
            if (typeof opts.title === "string")
                this.title = opts.title;
            if (typeof opts.icon === "string")
                this.icon = opts.icon;
            if (typeof opts.onclose === "function")
                this.onclose = opts.onclose;
        }
    }
    MessageBox.prototype.alert = function (text) {
        if (this.icon === undefined)
            this.icon = Icons.Attention;
        return this.display(1, text, this.focus);
    };
    MessageBox.prototype.confirm = function (text) {
        if (this.icon === undefined)
            this.icon = Icons.Information;
        return this.display(2, text, this.focus);
    };
    MessageBox.prototype.display = function (type, text, focus) {
        var return_value = this.values.Unknown;
        var buttons = [];
        switch (type) {
            case 1://OKCancel
                var this_ok_1 = this.values.OK;
                buttons = [
                    {
                        text: this.labels.OK,
                        click: function () {
                            return_value = this_ok_1;
                            $(this).dialog("close");
                        }
                    }
                ];
                break;
            case 2://YESNo
                var this_yes_1 = this.values.Yes;
                var this_no_1 = this.values.No;
                buttons = [
                    {
                        text: this.labels.Yes,
                        click: function () {
                            return_value = this_yes_1;
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: this.labels.No,
                        click: function () {
                            return_value = this_no_1;
                            $(this).dialog("close");
                        }
                    }
                ];
                break;
            default://custom buttons
                buttons = this.buttons;
        }
        var this_cancel = this.values.Cancel;
        if (this.cancel)
            buttons.push({
                text: this.labels.Cancel,
                click: function () {
                    return_value = this_cancel;
                    $(this).dialog("close");
                }
            });
        var img_html = "";
        if (this.icon)
            img_html = "<td><img src='" + this.icon + "' border='0'/></td>";
        var dialogObj = $("<table><tr>" + img_html + "<td>" + text + "</td></tr></table>");
        var this_onclose = this.onclose;
        var ret_then = new ThenAble;
        dialogObj.dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            title: this.title,
            buttons: buttons,
            close: function () {
                ret_then.result = return_value;
                $(this).dialog("destroy").remove();
                if (ret_then.onclosedTask)
                    ret_then.onclosedTask();
                if (this_onclose)
                    this_onclose(return_value);
            },
            open: function () {
                if (focus) {
                    var tb = $(":tabbable", this.parentNode);
                    var tb_index = focus;
                    if (tb_index > 0 && tb.length > tb_index)
                        tb[tb_index].focus();
                }
            }
        });
        dialogObj.dialog("open");
        return ret_then;
    };
    return MessageBox;
}());
//# sourceMappingURL=MsgBox.js.map