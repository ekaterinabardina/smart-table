import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    before.reverse().forEach(subName => { //разворачивает порядок элементов перед добавлением. перебирает нужный массив идентификаторов
        root[subName] = cloneTemplate(subName);  // клонируем и получаем объект, сохраняем в таблице
        root.container.prepend(root[subName].container);  // добавляем к таблице - в конец (append) или в начало (prepend)
    });

    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(onAction);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map((item) => {  //берём все объекты из data и для каждого создаём строку
            const row = cloneTemplate(rowTemplate);  //берём шаблон одной строки и делаем из него настоящую строку

            Object.keys(item).forEach((key) => { //смотрим на каждое поле объекта данных
                if (key in row.elements) {
                    row.elements[key].textContent = item[key];
                } //если в шаблоне есть элемент с таким же названием — записываем туда значение
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    return {...root, render};
}