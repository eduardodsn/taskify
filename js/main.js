import TaskController from "./controllers/TaskController.js";

const controller = new TaskController();

notify();
loadCreateAction();
loadCoreActions();

// Create new task 
function loadCreateAction() {
    document.querySelector('#create-to-do-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const task = controller.createNewTask();
        if(task) {
            controller.addTask(task.toObject());
            controller.clearInputs();
            
            loadCoreActions();
        } 
    });
}

// Delete task
function loadDeleteAction() {
    let deleteBtns = document.querySelectorAll('.to-do-item-body-btn-excluir');
    
    deleteBtns.forEach(deleteBtn => {
        deleteBtn.onclick = () => {
            const taskId = parseInt(deleteBtn.parentElement.parentElement.parentElement.childNodes[1].value);
            controller.deleteTask(taskId);
            
            loadCoreActions();
        }
    });
}

// Update task 
function loadUpdateAction() {
    let updateBtns = document.querySelectorAll('.to-do-item-body-btn-editar');
    updateBtns.forEach(updateBtn => {
        updateBtn.addEventListener('click', (e) => {
            e.preventDefault()
            const taskId = parseInt(updateBtn.parentElement.parentElement.parentElement.childNodes[1].value);
            const task = controller.searchById(taskId);

            controller.loadTaskInfoOnContainer(task.toObject());

            document.querySelector('#save-to-do-btn').onclick = () => {
                const updatedTask = controller.createNewTask();
                updatedTask.id = taskId;
                updatedTask.isDone = task.toObject().isDone;
                controller.updateTask(updatedTask.toObject());

                loadCoreActions();
            };
        }      
    )});
}

function loadCheckAction() {
    let checks = document.querySelectorAll('.control-indicator');

    checks.forEach(check => {
        check.onclick = () => {
            const taskId = parseInt(check.parentElement.parentElement.parentElement.parentElement.childNodes[1].value);
            controller.changeTaskIsDone(taskId, loadCheckAction);
            loadUpdateAction();
            loadDeleteAction();   
        }
    })
}

function notify() {
    controller.notify();
}

function loadCoreActions() {
    loadDeleteAction();
    loadUpdateAction();
    loadCheckAction();
}