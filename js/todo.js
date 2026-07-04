// STATE
let tasks = []; // Array of task objects
let currentFilter = "all"; // "all" | "active" | "completed"

// -------------------------------------------------------
// DOM REFERENCES
// -------------------------------------------------------
const todoInput = document.getElementById("todo-input");
const addTaskBtn = document.getElementById("add-task-btn");
const todoList = document.getElementById("todo-list");
const todoEmpty = document.getElementById("todo-empty");
const todoValidationMsg = document.getElementById("todo-validation-msg");
const todoCount = document.getElementById("todo-count");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const filterBtns = document.querySelectorAll(".todo-filter-btn");

// -------------------------------------------------------
// LOCAL STORAGE HELPERS
// -------------------------------------------------------
function saveTasks() {
    localStorage.setItem("sochitTodoTasks", JSON.stringify(tasks));
}

function loadTasks() {
    const stored = localStorage.getItem("sochitTodoTasks");
    tasks = stored ? JSON.parse(stored) : [];
}

// -------------------------------------------------------
// TASK OPERATIONS
// -------------------------------------------------------
function addTask(text) {
    const task = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.unshift(task); // newest at top
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function updateTaskText(id, newText) {
    const task = tasks.find(t => t.id === id);
    if (task && newText.trim()) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
}

// -------------------------------------------------------
// FILTERING
// -------------------------------------------------------
function getFilteredTasks() {
    switch (currentFilter) {
        case "active":
            return tasks.filter(t => !t.completed);
        case "completed":
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

// -------------------------------------------------------
// RENDER
// -------------------------------------------------------
function renderTasks() {
    const filtered = getFilteredTasks();
    todoList.innerHTML = "";

    if (filtered.length === 0) {
        todoList.innerHTML = "";
        todoEmpty.classList.remove("hidden");
    } else {
        todoEmpty.classList.add("hidden");
        filtered.forEach(task => {
            todoList.appendChild(createTaskElement(task));
        });
    }

    updateStats();
}

function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = `todo-item${task.completed ? " completed" : ""}`;
    li.dataset.id = task.id;

    li.innerHTML = `
        <button class="todo-check-btn" aria-label="${task.completed ? "Mark incomplete" : "Mark complete"}" title="${task.completed ? "Mark incomplete" : "Mark complete"}">
            ${task.completed ? "✅" : "⬜"}
        </button>
        <span class="todo-text">${escapeHtml(task.text)}</span>
        <div class="todo-item-actions">
            <button class="todo-edit-btn" aria-label="Edit task" title="Edit">✏️</button>
            <button class="todo-delete-btn" aria-label="Delete task" title="Delete">🗑️</button>
        </div>
    `;

    // Toggle complete
    li.querySelector(".todo-check-btn").addEventListener("click", () =>
        toggleTask(task.id)
    );

    // Delete
    li.querySelector(".todo-delete-btn").addEventListener("click", () =>
        deleteTask(task.id)
    );

    // Edit
    li.querySelector(".todo-edit-btn").addEventListener("click", () =>
        startEditing(li, task)
    );

    return li;
}

function startEditing(li, task) {
    const textSpan = li.querySelector(".todo-text");
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "todo-edit-input";
    editInput.value = task.text;
    editInput.setAttribute("aria-label", "Edit task text");

    textSpan.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    // Change edit button to save
    const editBtn = li.querySelector(".todo-edit-btn");
    editBtn.textContent = "💾";
    editBtn.title = "Save";

    function saveEdit() {
        const newText = editInput.value.trim();
        if (!newText) {
            editInput.classList.add("input-error");
            editInput.placeholder = "Task cannot be empty";
            return;
        }
        updateTaskText(task.id, newText);
    }

    editBtn.onclick = saveEdit;

    editInput.addEventListener("keydown", e => {
        if (e.key === "Enter") saveEdit();
        if (e.key === "Escape") renderTasks(); // cancel
    });

    editInput.addEventListener("blur", () => {
        // Small delay to let save button click register
        setTimeout(() => {
            if (document.activeElement !== editBtn) {
                saveEdit();
            }
        }, 150);
    });
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;

    if (total === 0) {
        todoCount.textContent = "No tasks yet";
    } else {
        todoCount.textContent = `${active} task${active !== 1 ? "s" : ""} remaining`;
    }

    clearCompletedBtn.style.display = completed > 0 ? "inline-block" : "none";
}

// -------------------------------------------------------
// VALIDATION
// -------------------------------------------------------
function showValidation(msg) {
    todoValidationMsg.textContent = msg;
    todoValidationMsg.classList.remove("hidden");
    setTimeout(() => {
        todoValidationMsg.classList.add("hidden");
    }, 3000);
}

// -------------------------------------------------------
// EVENT LISTENERS
// -------------------------------------------------------
addTaskBtn.addEventListener("click", () => {
    const text = todoInput.value.trim();
    if (!text) {
        showValidation("⚠️ Please enter a task before adding.");
        todoInput.focus();
        return;
    }
    addTask(text);
    todoInput.value = "";
    todoInput.focus();
});

todoInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const text = todoInput.value.trim();
        if (!text) {
            showValidation("⚠️ Please enter a task before adding.");
            return;
        }
        addTask(text);
        todoInput.value = "";
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

clearCompletedBtn.addEventListener("click", clearCompleted);

// -------------------------------------------------------
// UTILITY: Prevent XSS
// -------------------------------------------------------
function escapeHtml(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// -------------------------------------------------------
// INIT
// -------------------------------------------------------
(function init() {
    loadTasks();
    renderTasks();
})();
