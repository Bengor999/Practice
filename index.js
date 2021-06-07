
//массив данных для рендера карточек товара
let fruits = [
{id: 1, title: 'Яблоки', price: 20, img: 'https://eco-lavkka.ru/image/catalog/jablokikrasnye.jpg'},
{id: 2, title: 'Апельсин', price: 30, img: 'https://factum-info.net/images/1_Fakty/4_Eda/47_2_unusual-fruits-21.jpg'},
{id: 3, title: 'Манго', price: 40, img: 'https://newshay.com/wp-content/uploads/2021/03/mango.jpg'},
]

//Создаем карточку на основе передаваемого элемента массива ФРУИТС
const toHTML = fruit => `
<div class="cool">
    <div class="card">
        <img class="card-img-top" style="width: 300px;" src="${fruit.img}" alt="${fruit.title}">
        <div class="card-body">
            <h5 class="card-title">${fruit.title}</h5>
            <a href="" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">Посмотреть цену</a>
            <a href="" class="btn btn-danger" data-btn="remove" data-id="${fruit.id}">Удалить</a>
        </div>
    </div>
</div>
`

//Функция рендера карточек
function render() {
    //пробегая по массиву фруитс создаем массив строк HTML используя функцию ФРУИТ и соединяем его пропусками
    const html = fruits.map(toHTML).join('')
    //Ищем элемент в который вставлять карточки
    document.querySelector('#fruits').innerHTML = html
}
render()

//Задаем параметры модального окна
const priceModal = $.modal({
    title: 'Цена товара',
    closable: true,
    // content: `
    // <h4>dfgdgdhgfdfghdfghdf<h4>
    // <p>lorem6<p>
    // `,
    width: '400px',
    footerButtons: [
        {text: 'Закрыть', type: 'primary', handler() {
            priceModal.close()
        }},
        // {text: 'Удалить', type: 'remove', handler() {
        //     priceModal.close()

        // }}
    ]
})


document.addEventListener('click', event => {
    //Убираем действие по умолчанию
    event.preventDefault()
    //Ищем клики по кнопкам
    const btnType = event.target.dataset.btn
    //Получаем ID фрукта от кнопки и преобразовываем его в число
    const id = +event.target.dataset.id
    const fruit = fruits.find( f => f.id === id)

    //Удостоверяемся, что кнопка показа цены и вызываем модальное окно
    if (btnType === 'price') {
        //Ищем нужную строку в масииве вруктов

        priceModal.setContent(`
        <p>Цена на ${fruit.title}: ${fruit.price} руб </p>
        `)
        priceModal.open()    
    } else if (btnType === 'remove') {
        $.confirm({
            title: 'Вы уверены?',
            content: `<p>Вы удаляете ${fruit.title}</p>`,
        }).then(() => {
            //создаем массив на основе старого и перерисовываем карточки
            fruits = fruits.filter(f => f.id !== id)
            render()
        }).catch(() => {
            console.log('не Удалить')
        })
    }
})