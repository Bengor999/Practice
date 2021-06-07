//Метод из ГУГЛА для ФООТЕРА
Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
    
}

function noop() {
    
}

//Создаем кнопки ФУТЕРА
function _createModalFooter(buttons = []) {
    //Если в параметр кнопки ФУТЕРА ничего не передано, то и не создаем их, иначе...
    if(buttons.length === 0) {
        return document.createElement('div')
    }
    //Создаем элемент и добавляем класс
const wrap = document.createElement('div')
wrap.classList.add('modal-footer')
//coздаем кнопки
buttons.forEach( btn => {
    //Установочные параметры в файле ИНДЕКС JS
    //создаем кнопку
    const $btn = document.createElement('button')
    //название кнопки
    $btn.textContent = btn.text
    //Класс общий и индивидуальный
    $btn.classList.add('btn')
    $btn.classList.add(`btn-${btn.type || 'secondary'}`)
    //Слушатель кнопки
    $btn.onclick = btn.handler || noop

    wrap.appendChild($btn)
})


return wrap
     
}


//Задаем функцию создания модального окна - элемента
function _createModal(options) {
    //Устанавливаем ширину по умолчанию
    const DEFAULT_WIDTH = '600px'
    //Создаем новый ДИВ с классом ВМОДАЛ
    const modal = document.createElement('div')
    modal.classList.add('vmodal')
    //Добавляем заранее готовый HTML в наш ДИВ
    modal.insertAdjacentHTML('afterbegin', `
    <div class="modal-overlay" data-close=true>
    <!-- Подключаем параметр ширина окна или по установке или по умолчанию  -->

        <div class="modal-window" style='width: ${options.width || DEFAULT_WIDTH}}'>
            <div class="modal-header">
            <!-- Подключаем заголовок окна и содержимое или по установке или по умолчанию  -->

                <span class="modal-title">${options.title || 'Окно'}</span>
                ${options.closable ? `<span class="modal-close" data-close=true>&times;</span>` : ''}
            </div>
            <div class="modal-body" data-content>
            ${options.content || ''}
            </div>
        </div>
    </div>
    `)
    //Получаем ноду футера
    const footer = _createModalFooter(options.footerButtons)
    //встраиваем ФООТЕР в ДОМ используя странный метод из интернета
    footer.appendAfter(modal.querySelector('[data-content]'))
    //Встраиваем ДИВ в БОДИ 
    document.body.appendChild(modal)
    //Возвращаем МОДАЛ для работы с ним
    return modal
}



//Управляем модальным окном
$.modal = function (options) {
    //Устанавливаем скорость появления/исчезания
    const ANIMATION_SPEED = 2000
    //Задаем переменную - результат вызова функции
    const $modal = _createModal(options)
    //Устанавливаем переключатель в значение ЛОЖЬ
    let closing = false
    //  еще один флаг для ДЕСТРОЙ, что бы не вызывать окно по новой
    let destroyed = false


//Сщздаем обьект с методами управления
    const modal = {
        //вызов модального окна
        open() { 
            if (destroyed) {
                return console.log('ДЕСТРОУЕД!!!')
            }
            //Добавим класс видимости к модальному окну
            !closing && $modal.classList.add('open')
         },
         //Закрывание модального окна
         close() {
             //меняем флаг переключателя, что бы избежать ошибок с сет-таймаутом
             closing = true
             //Удаляем класс видимости модального окна
             $modal.classList.remove('open')
             //Добавляем временный класс для анимации закрытия и удалим его через некоторе время с помощью сет-таймаут
             $modal.classList.add('hide')
             setTimeout(()=>{
                  $modal.classList.remove('hide')
                  //После завершения сет-таймаут не забываем сменить флаг
                  closing = false
                  if (typeof options.onClose === 'function') {
                      options.onClose()
                  }
             }, ANIMATION_SPEED)
          },
          setContent(html) {
              $modal.querySelector('[data-content]').innerHTML = html
          }
    }
    //Если слушатель зафиксировал клик на оверлей или крестик, то вызываем метод КЛОЗЕ
    const listener = event => {
        //У оверлей и крестика в HTML добавляем дата атрибут КЛОЗЕ
        //Если щелкнули по элементу с дата-КЛОЗЕ, то закрыть окно.
        if (event.target.dataset.close) {
            modal.close()
        }
    }
//Добавляем слушатель на все модальное окно
    $modal.addEventListener('click', listener)

//Добавляем для обьекта МОДАЛ дополнительный метод ДЕСТРОЙ
    return Object.assign(modal, {
        //Метод удаляет элемент из дом-дерева и слушатель на него подвешенный
        destroy() { 
        $modal.parentNode.removeChild($modal)
        $modal.removeEventListener('click', listener)

        destroyed = true
        },
    })
}