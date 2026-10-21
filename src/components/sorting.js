import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {  //columns - массив кнопок сортировки, который передали из main.js
    return (data, state, action) => {
        let field = null;  //по какому полю сортируем
        let order = null;  //в каком направлении

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value]; //берем текущее состояние кнопки, смотрим в sortMap, какое состояние должно быть следующим, и записываем его обратно
            field = action.dataset.field;
            order = action.dataset.value;

            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {  //берём каждую кнопку сортировки
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }  //если это не та кнопка, которую сейчас нажали сбрасываем её в начальное состояние none
            });

        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            columns.forEach(column => {  //перебираем все наши кнопки сортировки
                if (column.dataset.value !== 'none') {  //ищем ту, у которой сортировка не none
                    field = column.dataset.field;  //сохраняем в переменных поле
                    order = column.dataset.value;  //и направление сортировки
                }
            });
        }

        return sortCollection(data, field, order);
    }
}