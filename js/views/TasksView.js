import { formatData } from "../helper/index.js";

export default class TasksView {
    constructor(element) {
        this._element = document.querySelector(element);
    }

    _template(tasks) {
        return tasks.map(task => {
            return `
            <div class="to-do-item">
                <input id="to-do-item-id" value="${task.id}" style="display: none;"/>
                <div class="to-do-item-header">
                    <div class="to-do-item-status">
                        <label for="checkbox-${task.id}" title="Concluir tarefa">
                            <input type="checkbox" name="checkbox-${task.id}" id="checkbox-${task.id}" ${task.isDone ? 'checked' : ''}>
                            <div class="control-indicator"></div>
                        </label>
                    </div>
                    <div class="to-do-item-title">
                        <div class="to-do-item-fst-container">
                            <p "to-do-item-info-title">${task.title}</p>
                            <div class="data-container">
                                <p>Data: ${formatData(task.expiresAt)}</p>
                            </div>
                        </div>
                        <div class="to-do-item-snd-container">
                            <span class="${task.category.toLowerCase()}">${task.category}</span>
                            <button class="to-do-item-view-btn" title="Ver detalhes da tarefa">
                                <img src="./assets/down-arrow.png">
                            </button>
                        </div>
                    </div>
                </div>
                <div class="to-do-item-body">
                    <p class="to-do-item-body-description">${task.description}</p>
                    <div class="to-do-item-body-btn">
                        <button class="to-do-item-body-btn-excluir">Excluir</button>
                        <button class="to-do-item-body-btn-editar">Editar</button>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    updateView(tasks) {
        if(!tasks) return;
        this._element.innerHTML = this._template(tasks);
        this.updateButtons();
    }

    updateButtons() {
        let viewBtns = document.querySelectorAll('.to-do-item-view-btn');
        viewBtns.forEach(btn => {
            btn.onclick = () => {
                let item = btn.parentElement.parentElement.parentElement.parentElement;
                if(item.classList.contains('expanded-item')) {
                    item.classList.remove('expanded-item');
                    item.childNodes[5].style.visibility = 'hidden';
                } else {
                    item.classList.add('expanded-item');
                    item.childNodes[5].style.visibility = 'initial';

                }
            };
        });
    }
}