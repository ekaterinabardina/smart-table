export function initFiltering(elements) {
    // Заполняем выпадающие списки данными с сервера
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => { //получаем ключи из объекта, перебираем по именам
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
            //elements[elementName].append(  //в каждый элемент добавляем опции
            //...Object.values(indexes[elementName])  //формируем массив имён, значений опций
            //.map(name => {  //используем name как значение и текстовое содержимое
                const el = document.createElement('option');
                el.textContent = name; //текст, который увидит пользователь
                el.value = name; //значение опции
                return el; //возвращаем тег опции
            }))
        })
    }

    // Формируем параметры фильтрации для запроса
    const applyFiltering = (query, state, action) => {
        // @todo: #4.2 — обработка очистки поля
        if (action && action.name === 'clear') {  //проверяем, нажата ли кнопка очистки
            const input = action.parentElement.querySelector('input');  //находим поле ввода (input) рядом с кнопкой
            input.value = '';  //очищаем поле на странице
            state[action.dataset.field] = '';  //очищаем соответствующее значение в состоянии
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}