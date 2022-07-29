import { formatData } from "../helper/index.js";
import Task from "../models/Task.js";
import TasksView from "../views/TasksView.js";

export default class TaskController {
    constructor() {
        this.$ = document.querySelector.bind(document);

        this._inputTitle = this.$('#create-to-do-title');
        this._inputDescription = this.$('#create-to-do-description');
        this._inputCategory = this.$('#create-to-do-select');
        this._inputExpiresAt = this.$('#create-to-do-date');

        this._taskView = new TasksView('#to-do-list');
        this._taskView.updateView(this.listTasks());
    }

    notify() {
        const notified = localStorage.getItem('notified');
        const currentDate = new Intl.DateTimeFormat('fr-CA').format(new Date());

        if(!notified) localStorage.setItem('notified', currentDate);

        if(notified < currentDate) {
            const tasks = this.listTasks();
            let pendingTasks = '';
            let count = 0;

            tasks.forEach(task => {
                if(task.expiresAt < currentDate) {
                    count++;
                    pendingTasks += `\n Tarefa: ${task.title} - ${task.category} - ${formatData(task.expiresAt)}`;
                }
            });

            count > 1 ? alert(`Existem tarefas pendentes: ${pendingTasks}`) : alert(`Existe uma tarefa pendente: ${pendingTasks}`);
            localStorage.setItem('notified', currentDate);
        }   
    }

    generateNewId() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if(!tasks) return 0;

        let biggestId = 0;
        tasks.forEach(task => {
            if(parseInt(task.id) > biggestId) {
                biggestId = parseInt(task.id);
            }
        })
        
        return ++biggestId;
    }

    createNewTask() {
        if(!this._inputTitle.value || !this._inputDescription.value || !this._inputCategory.value || !this._inputExpiresAt.value) {
            alert('Preencha todos os campos!');
            return;
        }

        return new Task(
            this.generateNewId(), 
            this._inputTitle.value, 
            this._inputDescription.value,
            this._inputCategory.value,
            this._inputExpiresAt.value,
            false
        );
    }

    listTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    async addTask(task) {
        let tasks = this.listTasks();

        tasks.push(task);
        this.updateLocalStorage(tasks);
        this._taskView.updateView(tasks);

        // JSON
        await this.addTaskJSON(task);
    }

    async deleteTask(id) {
        let tasks = this.listTasks();
        let updatedTasks = tasks.filter(task => parseInt(task.id) !== parseInt(id));

        this.updateLocalStorage(updatedTasks);
        this._taskView.updateView(this.listTasks());

        // JSON
        await this.deleteTaskJSON(id);
    }

    async updateTask(updatedTask) {
        let tasks = this.listTasks();
        tasks.forEach(task => {
            if(parseInt(task.id) === parseInt(updatedTask.id)) {
                task.title = updatedTask.title;
                task.description = updatedTask.description;
                task.category = updatedTask.category;
                task.expiresAt = updatedTask.expiresAt;
                task.isDone = updatedTask.isDone;
            }
        });

        this.updateLocalStorage(tasks);
        this.clearInputs();
        this.unloadTaskInfoOnContainer();
        this._taskView.updateView(tasks);

        // JSON
        await this.updateTaskJSON(updatedTask);
    }

    changeTaskIsDone(taskId, callback) {
        const task = this.searchById(taskId);
        task.changeIsDone();
        this.updateTask(task.toObject())

        if(task.toObject().isDone && confirm('Deseja excluir a tarefa?')) {
            this.deleteTask(task.toObject().id)
        }

        callback();
    }

    searchById(id) {
        const tasks = this.listTasks()
        let filteredTasks = tasks.filter((task) => task.id === id);
        if(!filteredTasks) return;

        const task = filteredTasks[0];

        return new Task(task.id, task.title, task.description, task.category, task.expiresAt, task.isDone);

    }

    clearInputs() {
        this._inputTitle.value = '';
        this._inputDescription.value = '';
        this._inputCategory.childNodes[1].selected = true;
        this._inputExpiresAt.value = '';
    }

    loadTaskInfoOnContainer(task) {
        const createContainer = this.$('#to-do-create');
        const taskListContainer = this.$('#to-do-list');
        const saveTaskBtn = this.$('#save-to-do-btn');
        const createTaskBtn = this.$('#create-to-do-btn');

        this._inputTitle.value = task.title;
        this._inputDescription.value = task.description;
        this._inputCategory.value = task.category;
        this._inputExpiresAt.value = task.expiresAt;

        window.scrollTo(0, 0);
        createContainer.style.animation = 'attention 1s ease';
        setTimeout(() => {
            createContainer.style.animation = '';
        }, 1000);

        taskListContainer.style.display = 'none';
        createTaskBtn.style.display = 'none';
        saveTaskBtn.style.display = 'flex';
    }

    unloadTaskInfoOnContainer() {
        const taskListContainer = this.$('#to-do-list');
        const saveTaskBtn = this.$('#save-to-do-btn');
        const createTaskBtn = this.$('#create-to-do-btn');

        taskListContainer.style.display = 'initial';
        createTaskBtn.style.display = 'flex';
        saveTaskBtn.style.display = 'none';
    }

    // For LocalStorage purposes
    updateLocalStorage(tasks) {
        localStorage.clear();
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // For JSON Server purposes
    async addTaskJSON(task){
        delete task.id
        console.log(JSON.stringify(task));
        await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        }).then(res => res.json());
    }

    async deleteTaskJSON(id){
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => res.json());
    }

    async updateTaskJSON(task){
        console.log(JSON.stringify(task));
        await fetch("http://localhost:3000/tasks", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        }).then(res => res.json());
    }
}