function Test() {
    var opt = {};
    opt.labels = {};
    opt.labels.Yes = "Да";
    opt.onclose = function(v){ alert(v);};
    opt.focus = 2;
    opt.title = "Title 1";
    var m1 = new MsgBox.MessageBox(opt);
    m1.confirm("Первый confirm");

    //Установлены локализованнные надписи для кнопок
    MsgBox.Labels.No = "Нет";
    MsgBox.Labels.Cancel = "Отмена";

    //Фокус на вторую кнопку
    var m2 = new MsgBox.MessageBox(2);
    m2.values.cancel = 1;
    m2.values.ok = 2;
    m2.cancel = true;

    //Установлен заголовок
    m2.onclose = function(v){MsgBox.MessageBox("заголовок").alert("Вы нажали " + "<br/>" +
                                (v==m2.values.ok ? m2.labels.OK : (v==m2.values.cancel ?  m2.labels.Cancel : "Неизвестно") ));};
    m2.alert("Второй alert");

    //Копирует настройки из первого MsgBox
    var m3 = MsgBox.MessageBox(m1);
    m3.alert("Четвертый alert");//выглядит как самый первый confirm

    //Копирует настройки из первого MsgBox
    var m4 = Object.create(m1);
    m4.cancel = true;
    m4.values.ok = "OK";
    m4.values.cancel = "Cancel";
    m4.alert("Пятый alert");
    
    //Установлена функция onclose
    MsgBox.MessageBox(m1.onclose).confirm("Шестой confirm");

    var n=1;
    opt.onclose = function(){alert(n);};
    opt.icon = MsgBox.Icons.Attention;
    var m5 = MsgBox.MessageBox(opt);
    m5.buttons = [
        {
            text: "Кнопка1",
            click: function () {
                n = 2;
                $(this).dialog("close");
            }
        },
        {
            text: "Кнопка2",
            click: function () {
                n = 3;
                $(this).dialog("close");
            }
        }
    ];

    m5.display(3, "Проверка кнопок", 2);
  
    //Использование возвращаемого thenable объекта
    MsgBox.MessageBox("Заголовок Thenable").confirm("Thenable confirm").then((x) => { alert(x)});

    //Использование объектов типа Promise
    Promise.resolve(MsgBox.MessageBox("Заголовок Promise").confirm("Promisified confirm")).then((x) => { alert(x)});
    
    //Объединение Promise объектов
    var p1 = MsgBox.MessageBox("Заголовок 1").confirm("Confirm");
    var p2 = MsgBox.MessageBox("Заголовок 2").alert("Alert");

    Promise.all([p1,p2]).then(([result1, result2]) => { alert(result1 + '   '+ result2)});
}

async function TestA() {
    var thenable = MsgBox.MessageBox("Заголовок Async").confirm("Async Confirm");
    var aresult = await thenable;

    MsgBox.MessageBox("Результат").alert(thenable.result + ' ' + aresult);
}