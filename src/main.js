import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";

import {initSearching} from './components/searching.js';

import {initFiltering} from './components/filtering.js';

import {initSorting} from "./components/sorting.js";

import {initPagination} from "./components/pagination.js";
// @todo: подключение


// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    state.total = [state.totalFrom, state.totalTo];
    delete state.totalFrom;
    delete state.totalTo;
    //формирование массива total в формат, который ожидает компоратор

    const rowsPerPage = parseInt(state.rowsPerPage);  // приведём количество страниц к числу
    const page = parseInt(state.page ?? 1);  //преобразует номер страницы в число

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения
    // @todo: использование
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);
    //result — все строки, которые мы подготовили для отображения, 
    //state — настройки таблицы: например, сколько строк показывать на странице и какая страница выбрана, 
    //action — действие пользователя, например переход на следующую страницу

    sampleTable.render(result)
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// @todo: инициализация
const applySearching = initSearching('search');

const applyFiltering = initFiltering(sampleTable.filter.elements, {  // передаём элементы фильтра
    //sampleTable.filter.elements — элементы управления из шаблона фильтра
    searchBySeller: indexes.sellers  // для элемента с именем searchBySeller устанавливаем массив продавцов
    //indexes.sellers — список продавцов, который уже подготовлен в initData() в src/data.js
});

const applySorting = initSorting([  //передаем массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
    sampleTable.header.elements.sortByDate,  //кнопка/элемент, который отвечает за сортировку по дате
    sampleTable.header.elements.sortByTotal  //отвечает за сортировку по сумме
]);

const applyPagination = initPagination(
    sampleTable.pagination.elements,  // передаём сюда элементы пагинации, найденные в шаблоне
    (el, page, isCurrent) => {  // и колбэк, чтобы заполнять кнопки страниц данными
    //el — HTML-элемент одной кнопки страницы, page — номер страницы, isCurrent — является ли эта страница текущей
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;  //отмечаем выбранную страницу
        label.textContent = page;  //показываем её номер
        return el;
    }
);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
