const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput"); /*where we will show the task of the user */
const taskList = document.querySelector("#taskList");
const errorMessage = document.querySelector("#errorMessage");

let tasks = []; /*what we have tasks given from the user*/

function renderTasks() { /*Take the information stored in tasks and display it inside taskList*/
    taskList.innerHTML = ""; /*renderTasks() is going to build the list again from the tasks array.
    When we render again, we first empty the old HTML and then create the list again using the updated array.*/
    tasks
        .map(taskToListItem)
        .forEach(li => taskList.append(li)); /*i am appending to the HTML list of tasks the task elemet i created*/
}

function taskToListItem(task) {
    const li = document.createElement("li"); /*I created an html element which will be <li></li> in order to put the task in it to be shown on the webpage */

    li.dataset.id = task.id; /*when clicking delete button, JS doesn't know which task the user wants to delete. However, we already gave every task an ID but it only exists inside the JavaScript object. The <li> on the webpage doesn't automatically know about that ID. That's where dataset allows to store this id inside the HTML element.*/

    li.textContent = task.text; /*write in the li created, the text of the task given in the tasks array by the user*/
    /*Until now, we have <li>hello</li> however for this li i want to assign a class name and i want next to each new task added i want a delete button in the same li*/
    li.classList.add("task-item");
    if (task.completed) {
        li.classList.add("completed");
    }
    const button = document.createElement("button");
    button.textContent = "Delete";
    button.classList.add("delete-button");
    li.append(button);
    return li;
}

function addTask() { /*analyze the input given from the user */
    const text = taskInput.value;

    if (text.trim() === "") { /* reject empty or whitespace-only tasks */
        errorMessage.textContent = "Please enter a task.";
        return;
    }
    const task = { /* create an object to store the information of one task */
        id: Date.now(), /* give the task a unique ID */
        text: text, /* store the text entered by the user */
        completed: false /* the task is just created so not completed yet */
    };

    tasks.push(task); /* adding the new task to the tasks array */
    renderTasks(); /* Display the updated tasks on the webpage */

    taskInput.value = ""; /*empties the input box from the task once it's added*/
    errorMessage.textContent = ""; /*removes an old error message after a successful addition*/
    saveTasks();
}

taskForm.addEventListener("submit", (event) => { /*submit event works when the Add button is clicked or Enter is pressed only because it's inside a form, if not then Enter would have needed a keypress */
    event.preventDefault(); /*once submitted the page doesn't reload */
    addTask();
});

function deleteTask(id) { /*is the ID of the task we want to delete*/
    tasks = tasks.filter(task => task.id !== Number(id)); /*Keep every task whose ID is different from the ID we want to delete*/
    renderTasks(); /*after deleting the task from the array, it displays on the webpage the updated tasks array */
    saveTasks();  /* Save the updated tasks */
}

function toggleTask(id) {
    tasks = tasks.map(task => { /* i will change the completed status of the task */
        if (task.id === Number(id)) { /* to check if this is the clicked task*/
            task.completed = !task.completed;
        }

        return task;
    });

    renderTasks();
    saveTasks();

}

taskList.addEventListener("click", (e) => {
    const li = e.target.closest("li"); /*e.target gives the element that was clicked and closest() means starting from this element go upward and find the closest element that matches what I give you.
    so in this case it will start from the button and search for the closest element that is an li */

    if (!li) return; /*if the user clicks somewhere in taskList that isn't inside an <li>, stop the function */

    if (e.target.closest(".delete-button")) {  /*starting from the element clicked (delete button) it will find the closest class given which is button itself*/
        deleteTask(li.dataset.id); /* Get the task ID as string and send it to deleteTask() */
        return;
    }
    toggleTask(li.dataset.id); /*mark the task as complete or incomplete */
});

/*localStorage is a place provided by the browser to save the data if the page is refreshed or closed*/
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks)); /*converting the array of objects tasks into a string to be stored in localstorage*/
}

function loadTasks() { /*it loads the saved data once page refreshed */
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);/*does the opposite of stringify so it converts the saved text back into an array of object */
    }

    renderTasks();
}

loadTasks(); /*run when the JS file loads*/