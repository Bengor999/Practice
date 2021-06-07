//Создаем функцию
$.confirm = function(options) {
    //создаем промис
    return new Promise((resolve, rejekt) => {
        //Задаем параметры вызываемого окна
        const modal = $.modal({
            title: options.title,
            width: '400px',
            closable: false,
            content: options.content,
            onClose () {
                modal.destroy()
            },
            footerButtons: [
                //Если отмена, то вызываем реджект
                {text: 'Отмена', type: 'secondary', handler() {
                    modal.close()
                    rejekt()
                }},
                //Если удалить, вызываем резолв
                {text: 'Удалить', type: 'danger', handler() {
                    modal.close()
                    resolve()
                }},
            ]
        })
        //Вызываем модальное окно c задержкой для прорисовки анимации
        setTimeout(() => modal.open(), 100)
    });
}