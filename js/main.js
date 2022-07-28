import TaskController from "./controllers/TaskController.js";

const controller = new TaskController();
const $ = document.querySelector.bind(document);

let title = $('#create-to-do-title');
let description = $('#create-to-do-description');
let category = $('#create-to-do-select');
let expiresAt = $('#create-to-do-date');

// Create new task
$('#create-to-do-btn').addEventListener('click', () => {
    const task = controller.createNewTask(title.value, description.value, category.value, expiresAt.value);
    if(task) controller.addTask(task.toObject());
});

let deleteBtns = document.querySelectorAll('.to-do-item-body-btn-excluir');

deleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener('click', () => {
        const taskId = parseInt(deleteBtn.parentElement.parentElement.parentElement.childNodes[1].value);
        controller.deleteTask(taskId);
    })
});

// Update task 
let updateBtns = document.querySelectorAll('.to-do-item-body-btn-editar');

updateBtns.forEach(updateBtn => {
    updateBtn.addEventListener('click', () => {
        const item = updateBtn.parentElement.parentElement.parentElement;
        const itemBody = updateBtn.parentElement.parentElement;
        const taskId = parseInt(updateBtn.parentElement.parentElement.parentElement.childNodes[1].value);
        const task = controller.searchById(taskId);
        const createContainer = $('#to-do-create');

        title.value = task.title;
        description.value = task.description;
        category.value = task.category;
        expiresAt.value = task.expiresAt;
        window.scrollTo(0, 0);

        createContainer.style.animation = 'attention 1s ease';
        setTimeout(() => {
            createContainer.style.animation = '';
        }, 1000);

        
    });
})

