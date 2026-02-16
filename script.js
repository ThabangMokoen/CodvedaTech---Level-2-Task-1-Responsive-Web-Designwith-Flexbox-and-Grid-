const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("category");
const dueDateInput = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");
const statsText = document.getElementById("statsText");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = localStorage.getItem("filter") || "All";



function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function isOverdue(task) {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
}

function updateStats() {
    const completed = tasks.filter(t => t.completed).length;
    statsText.textContent = `${completed} / ${tasks.length} completed`;
}

function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task =>
        currentFilter === "All" || task.category === currentFilter
    );

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (task.completed) li.classList.add("completed");
        if (isOverdue(task)) li.classList.add("overdue");

        const info = document.createElement("div");
        info.className = "task-info";
        info.innerHTML = `
      <strong>${task.text}</strong>
      <small>${task.category} • Due: ${task.dueDate || "No date"}</small>
    `;
        info.onclick = () => toggleTask(tasks.indexOf(task));

        const bin = document.createElement("img");
        bin.src = "https://cdn-icons-png.flaticon.com/512/3405/3405244.png";
        bin.className = "bin";
        bin.onclick = () => deleteTask(tasks.indexOf(task));

        li.appendChild(info);
        li.appendChild(bin);
        taskList.appendChild(li);
        li.classList.add(task.category.toLowerCase());

    });

    updateStats();
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
        text,
        category: categoryInput.value,
        dueDate: dueDateInput.value,
        completed: false
    });

    taskInput.value = "";
    dueDateInput.value = "";
    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentFilter = btn.dataset.filter;
        localStorage.setItem("filter", currentFilter);
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === currentFilter) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        renderTasks();
    });
});


addTaskBtn.addEventListener("click", addTask);

renderTasks();
