/**
 * MessageBox class based on JQueryUI dialog widget
 *
 */
//Examples
/*
function Test() {
    var opt = {};
    opt.labels = {};
    opt.labels.Yes = "Yes1";
    opt.onclose = function(v){ alert(v);};
    opt.focus = 2;
    opt.title = "Title 1";
    var m1 = new MsgBox.MessageBox(opt);
    m1.confirm("First confirm");

    //Localized labels on buttons
    MsgBox.Labels.No = "Нет";
    MsgBox.Labels.Cancel = "Отмена";

    //Focus on second button
    var m2 = new MsgBox.MessageBox(2);
    m2.values.cancel = 1;
    m2.values.ok = 2;
    m2.cancel = true;

    //Title
    m2.onclose = function(v){MsgBox.MessageBox("Title 2").alert("You have pressed" + "<br/>" +
                                (v==m2.values.ok ? m2.labels.OK : (v==m2.values.cancel ?  m2.labels.Cancel : "Unknown") ));};
    m2.alert("Second alert");

    //Takes settings from first MsgBox
    var m3 = MsgBox.MessageBox(m1);
    m3.alert("Third alert");//Looks like first confirm

    //Takes settings from first MsgBox
    var m4 = Object.create(m1);
    m4.cancel = true;
    m4.values.ok = "OK";
    m4.values.cancel = "Cancel";
    m4.alert("Fourth alert");
    
    //Function onclose passed as parameter
    MsgBox.MessageBox(m1.onclose).confirm("Fifth confirm");

    var n=1;
    opt.onclose = function(){alert(n);};
    opt.icon = MsgBox.Icons.Attention;
    var m5 = MsgBox.MessageBox(opt);
    m5.buttons = [
        {
            text: "Button1",
            click: function () {
                n = 2;
                $(this).dialog("close");
            }
        },
        {
            text: "Button2",
            click: function () {
                n = 3;
                $(this).dialog("close");
            }
        }
    ];

    m5.display(3, "Test custom buttons", 2);

    //Using a returned thenable object
    MsgBox.MessageBox("Title Thenable").confirm("Thenable confirm").then((x) => { alert(x)});

    //With Promises, the same functionality is used like this:
    Promise.resolve(MsgBox.MessageBox("Title Promisified").confirm("Promisified confirm")).then((x) => { alert(x)});
    
    //And now chaining Promises
    var p1 = MsgBox.MessageBox("Title 1").confirm("Confirm");
    var p2 = MsgBox.MessageBox("Title 2").alert("Alert");

    Promise.all([p1,p2]).then(([result1, result2]) => { alert(result1 + '   '+ result2)});
}

async function TestA() {
    var thenable = MsgBox.MessageBox("Async Title").confirm("Async Confirm");
    var aresult = await thenable;

    MsgBox.MessageBox("Async Result").alert(thenable.result + ' ' + aresult);
}
*/

"use strict";

(function(exports) {
    //Icons
    exports.Icons = /** @class */ (function () {
        function Icons() {
        }
        Icons.Attention = "Attention.gif";
        Icons.Error = "Error.gif";
        Icons.Help = "Help.gif";
        Icons.Information = "Information.gif";
        Icons.Warning = "Warning.gif";
        return Icons;
    }());

    //Labels
    exports.Labels = /** @class */ (function () {
        function Labels() {
        }
        Labels.OK = "OK";
        Labels.Cancel = "Cancel";
        Labels.Yes = "Yes";
        Labels.No = "No";
        return Labels;
    }());

    //Return values
    exports.Values = /** @class */ (function () {
        function Values() {
        }
        Values.Unknown = null;
        Values.OK = 1;
        Values.Cancel = -1;
        Values.Yes = 2;
        Values.No = 0;
        return Values;
    }());

    exports.MessageBox = /** @class */ (function () {

        function MessageBox(parameter) {
            if (!(this instanceof MessageBox)) {
                return new MessageBox(parameter);
            }

            this.cancel = false;
            this.focus = 1;
            this.title = ""; //document.title;

            this.labels={};
            this.labels.OK = exports.Labels.OK;
            this.labels.Cancel = exports.Labels.Cancel;
            this.labels.Yes = exports.Labels.Yes;
            this.labels.No = exports.Labels.No;

            this.values={};
            this.values.unknown = exports.Values.Unknown;
            this.values.ok = exports.Values.OK;
            this.values.cancel = exports.Values.Cancel;
            this.values.yes = exports.Values.Yes;
            this.values.no = exports.Values.No;

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
                    if (typeof opts.values.unknown !== "undefined")
                        this.values.unknown = opts.values.unknown;
                    if (typeof opts.values.cancel !== "undefined")
                        this.values.cancel = opts.values.cancel;
                    if (typeof opts.values.no !== "undefined")
                        this.values.no = opts.values.no;
                    if (typeof opts.values.yes !== "undefined")
                        this.values.yes = opts.values.yes;
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

        /**
         * Displays alert and returns a thenable object
         *
         * @returns {Object}
         */
        MessageBox.prototype.alert = function (text) {
            if (this.icon === undefined)
                this.icon = exports.Icons.Attention;
            return this.display(1, text, this.focus);
        };

        /**
         * Displays confirm and returns a thenable object
         *
         * @returns {Object}
         */
        MessageBox.prototype.confirm = function (text) {
            if (this.icon === undefined)
                this.icon = exports.Icons.Information;
            return this.display(2, text, this.focus);
        };

        /**
         * Displays custom message box and returns a thenable object
         * the object is { then : Function; result: Object;}
         *
         * @returns {Object}
         */
        MessageBox.prototype.display = function (type, text, focus) {
            var return_value = this.values.unknown;
            var buttons = [];
            switch (type) {
            case 1://OKCancel
                var this_ok = this.values.ok;
                buttons = [
                    {
                        text: this.labels.OK,
                        click: function () {
                            return_value = this_ok;
                            $(this).dialog("close");
                        }
                    }
                ];
                break;
            case 2://YESNo
                var this_yes = this.values.yes;
                var this_no = this.values.no;
                buttons = [
                    {
                        text: this.labels.Yes,
                        click: function () {
                            return_value = this_yes;
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: this.labels.No,
                        click: function () {
                            return_value = this_no;
                            $(this).dialog("close");
                        }
                    }
                ];
                break;

            default://custom buttons
                buttons = this.buttons;
            }
            var this_cancel = this.values.cancel;
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

            var onclosedTask;
            var ret = {};
            ret.then = function(onClosed) {
                if(onClosed)
                {                   
                    onclosedTask = function () {
                        onClosed(return_value);
                    };
                }
            };

            dialogObj.dialog({
                autoOpen: false,
                resizable: false,
                modal: true,
                title: this.title,
                buttons: buttons,
                close: function () {
                    ret.result = return_value;
                    $(this).dialog("destroy").remove();
                    if(onclosedTask)
                        onclosedTask();
                    else
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

            return ret;
        };
        return MessageBox;
    }());

})(this.MsgBox = {});