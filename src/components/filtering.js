import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {  //получаем ключи из объекта, перебираем по именам
    elements[elementName].append(  //в каждый элемент добавляем опции
        ...Object.values(indexes[elementName])  //формируем массив имён, значений опций
            .map(name => {  //используем name как значение и текстовое содержимое
                const option = document.createElement('option');
                option.value = name;  //значение опции
                option.textContent = name;  //текст, который увидит пользователь
                return option;  //возвращаем тег опции
            })
        );
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {  //проверяем, нажата ли кнопка очистки
            const input = action.parentElement.querySelector('input');  //находим поле ввода (input) рядом с кнопкой
            input.value = '';  //очищаем поле на странице
            state[action.dataset.field] = '';  //очищаем соответствующее значение в состоянии
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}