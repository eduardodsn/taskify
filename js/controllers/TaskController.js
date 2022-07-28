import Task from "../models/Task.js";
import TasksView from "../views/TasksView.js";

export default class TaskController {
    constructor() {
        this._taskView = new TasksView('#to-do-list');
        this._taskView.updateView(this.listTasks());
    }

    generateNewId() {
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        if(!tasks) return 0;
        
        return parseInt(++tasks[tasks.length - 1].id);
    }

    createNewTask(title, description, category, expiresAt) {
        if(!title || !description || !category || !expiresAt) {
            alert('Preencha todos os campos!');
            return;
        }

        return new Task(
            this.generateNewId(), 
            title, 
            description,
            category,
            expiresAt
        );
    }

    listTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    addTask(task) {
        let tasks = this.listTasks();

        tasks.push(task);
        this.updateLocalStorage(tasks);
        this._taskView.updateView(tasks);
    }

    deleteTask(id) {
        let tasks = this.listTasks();
        let updatedTasks = tasks.filter(task => parseInt(task.id) !== parseInt(id));
        this.updateLocalStorage(updatedTasks);
        this._taskView.updateView(this.listTasks());
    }

    updateTask(updatedTask) {
        let tasks = this.listTasks();
        tasks.filter(task => {
            if(parseInt(task.id) === parseInt(updatedTask.id)) {
                task.title = updatedTask.title;
                task.description = updatedTask.description;
                task.category = updatedTask.category;
                task.expiresAt = updatedTask.expiresAt;
            }
        });

        this.updateLocalStorage(tasks);
    }

    searchById(id) {
        const tasks = this.listTasks()
        let filteredTasks = tasks.filter((task) => task.id === id);
        return filteredTasks[0];
    }

    // For LocalStorage purposes
    updateLocalStorage(tasks) {
        localStorage.clear();
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}