/**
 * Simple MessageBox class based on JQueryUI dialog widget
 *
 */
interface JQuery{
    (context: any) : JQuery;
    (val: string, context: any) : JQuery;
    dialog(opt : any): JQuery;
    remove(): JQuery;
}

declare const $: JQuery;

class Icons {
    static Warning: string = "Warning.gif";
    static Error: string = "Error.gif";
    static Attention: string = "Attention.gif";
    static Help: string = "Help.gif";
    static Information: string = "Information.gif";
}

class Values {
    static Unknown: any = null;
    static OK: any = 1;
    static Cancel: any = -1;
    static Yes: any = 2;
    static No: any = 0;
}

class Labels {
    static OK: string = "OK";
    static Cancel: string = "Cancel";
    static Yes: string = "Yes";
    static No: string = "No";
}

class InstanceValues {
    Unknown: any = Values.Unknown;
    OK: any = Values.OK;
    Cancel: any = Values.Cancel;
    Yes: any = Values.Yes;
    No: any = Values.No;
}

class InstanceLabels {
    OK: string = Labels.OK;
    Cancel: string = Labels.Cancel;
    Yes: string = Labels.Yes;
    No: string = Labels.No;
}

class ThenAble {
    public result: any;
    public onclosedTask: Function;

    public then(onClosed: Function)
    {
        if(onClosed)
        {                   
            this.onclosedTask = function () {
                onClosed(this.result);
            };
        }
    }
}

interface OnCloseFunc {
    (ret_val: any): void;
}

class MessageBox {

    public cancel: boolean = false;
    public focus: number = 1;
    public title: string = "";
    public icon: string;

    public onclose: OnCloseFunc;
    public buttons: Array<any>;

    public labels : InstanceLabels = new InstanceLabels;
    public values : InstanceValues  = new InstanceValues;

    constructor(parameter: any) {
        if (typeof parameter === "function")
            this.onclose = parameter;
        else if (typeof parameter === "string")
            this.title = parameter;
        else if (typeof parameter === "number")
            this.focus = parameter;
        else
        if (typeof parameter === "object")
        {
            let opts = parameter;
            if(opts.labels)
            {
                if (typeof opts.labels.OK === "string") this.labels.OK = opts.labels.OK;
                if (typeof opts.labels.Cancel === "string") this.labels.Cancel = opts.labels.Cancel;
                if (typeof opts.labels.Yes === "string") this.labels.Yes = opts.labels.Yes;
                if (typeof opts.labels.No === "string") this.labels.No = opts.labels.No;
            }

            if(opts.values)
            {
                if(typeof opts.values.Unknown !== "undefined") this.values.Unknown = opts.values.Unknown;
                if(typeof opts.values.OK !== "undefined") this.values.Cancel = opts.values.OK;
                if(typeof opts.values.Cancel !== "undefined") this.values.Cancel = opts.values.Cancel;
                if(typeof opts.values.No !== "undefined") this.values.No = opts.values.No;
                if(typeof opts.values.Yes !== "undefined") this.values.Yes = opts.values.Yes;
            }

            if(typeof opts.cancel === "boolean") this.cancel = opts.cancel;
            if(typeof opts.focus === "number") this.focus = opts.focus;
            if(typeof opts.title === "string") this.title = opts.title;
            if(typeof opts.icon === "string") this.icon = opts.icon;
            if(typeof opts.onclose === "function") this.onclose = opts.onclose;
        }
    }

    public alert(text: string) {
        if (this.icon === undefined)
            this.icon = Icons.Attention;
        return this.display(1, text, this.focus);
    }

    public confirm(text: string) {
        if (this.icon === undefined)
            this.icon = Icons.Information;
        return this.display(2, text, this.focus);
    }

    private display(type: number, text: string, focus: number) {
        let return_value = this.values.Unknown;
        let buttons = [];
        switch (type) {
            case 1://OKCancel
                let this_ok: any = this.values.OK;
                buttons = [
                    {
                        text: this.labels.OK,
                        click: function() {
                            return_value = this_ok;
                            $(this).dialog("close");
                        }
                    }
                ];
                break;
            case 2://YESNo
                let this_yes: any = this.values.Yes;
                let this_no: any = this.values.No;
                buttons = [
                    {
                        text:  this.labels.Yes,
                        click: function() {
                            return_value = this_yes;
                            $(this).dialog("close");
                        }
                    },
                    {
                        text:  this.labels.No,
                        click: function() {
                            return_value = this_no;
                            $(this).dialog("close");
                        }
                    }
                ];
                break;

            default://custom buttons
                buttons = this.buttons;
        }
        let this_cancel: any = this.values.Cancel;
        if (this.cancel)
            buttons.push({
                text: this.labels.Cancel,
                click: function() {
                    return_value = this_cancel;
                    $(this).dialog("close");
                }
            });
        let img_html: string = "";
        if (this.icon)
            img_html = "<td><img src='" + this.icon + "' border='0'/></td>";
        let dialogObj = $("<table><tr>" + img_html + "<td>" + text + "</td></tr></table>");

        let this_onclose = this.onclose;
        let ret_then = new ThenAble;

        dialogObj.dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            title: this.title,
            buttons: buttons,
            close: function() {
                ret_then.result = return_value;   
                $(this).dialog("destroy").remove();
                
                if(ret_then.onclosedTask)
                    ret_then.onclosedTask();

                if (this_onclose)
                    this_onclose(return_value);
            },

            open: function() {
                if (focus) {
                    let tb = $(":tabbable", this.parentNode);
                    let tb_index: number = focus;
                    if (tb_index > 0 && tb.length > tb_index)
                        tb[tb_index].focus();
                }
            }
        });
        dialogObj.dialog("open");

        return ret_then;
    }
}