function Test() {
    var opt = {};
    opt.labels = {};
    opt.labels.Yes = "Yes1";
    opt.onclose = function(v){ alert(v);};
    opt.focus = 2;
    opt.title = "Title 1";
    var m1 = new MessageBox(opt);
    m1.confirm("First confirm");

    //Localized labels on buttons
    Labels.No = "Нет";
    Labels.Cancel = "Отмена";

    //Focus on second button
    var m2 = new MessageBox(2);
    m2.values.cancel = 1;
    m2.values.ok = 2;
    m2.cancel = true;

    //Title
    m2.onclose = function(v){new MessageBox("Title 2").alert("You have pressed" + "<br/>" +
                                (v==m2.values.ok ? m2.labels.OK : (v==m2.values.cancel ?  m2.labels.Cancel : "Unknown") ));};
    m2.alert("Second alert");

    //Takes settings from first MsgBox
    var m3 = new MessageBox(m1);
    m3.alert("Third alert");//Looks like first confirm

    //Takes settings from first MsgBox
    var m4 = Object.create(m1);
    m4.cancel = true;
    m4.values.ok = "OK";
    m4.values.cancel = "Cancel";
    m4.alert("Fourth alert");
    
    //Function onclose passed as parameter
    new MessageBox(m1.onclose).confirm("Fifth confirm");

    var n=1;
    opt.onclose = function(){alert(n);};
    opt.icon = Icons.Attention;
    var m5 = new MessageBox(opt);
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
    new MessageBox("Title Thenable").confirm("Thenable confirm").then((x) => { alert(x)});

    //With Promises, the same functionality is used like this:
    Promise.resolve(new MessageBox("Title Promisified").confirm("Promisified confirm")).then((x) => { alert(x)});
    
    //And now chaining Promises
    var p1 = new MessageBox("Title 1").confirm("Confirm");
    var p2 = new MessageBox("Title 2").alert("Alert");

    Promise.all([p1,p2]).then(([result1, result2]) => { alert(result1 + ' '+ result2)});
}

//Async function example
async function TestA()
{
    var thenable = new MessageBox("Async Title").confirm("Async Confirm");
    var aresult = await thenable;

    (new MessageBox("Async Result")).alert(thenable.result + ' ' + aresult);
}    
