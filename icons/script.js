const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');
const addButton = document.getElementById('add-button');
const clearAllButton = document.getElementById('clear-all-button');

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTodo();
});

addButton.addEventListener('click', addTodo);

clearAllButton.addEventListener('click', clearAllTodos);

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false
        };
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }
}

function updateTodoList() {
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex);
        todoListUL.appendChild(todoItem);
    });
}

function createTodoItem(todo, todoIndex) {
    const todoId = `todo-${todoIndex}`;
    const todoLI = document.createElement("li");
    todoLI.className = "todo";
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}" ${todo.completed ? 'checked' : ''}>
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            </svg>
        </label>
        <span class="todo-text">${todo.text}</span>
        <button class="edit-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
        </button>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
    `;

    const deleteButton = todoLI.querySelector(".delete-button");
    const editButton = todoLI.querySelector(".edit-button");

    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    });

    editButton.addEventListener("click", () => {
        editTodoItem(todoIndex);
    });

    const checkbox = todoLI.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", () => {
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    });

    return todoLI;
}


function editTodoItem(todoIndex) {
    const todoItem = todoListUL.children[todoIndex];
    const todoText = todoItem.querySelector('.todo-text');
    const editButton = todoItem.querySelector('.edit-button');

    editButton.addEventListener('click', function() {
        todoText.contentEditable = true;
        todoText.focus();

        todoText.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                todoText.blur();
            }
        });

        todoText.addEventListener('blur', function() {
            allTodos[todoIndex].text = todoText.textContent.trim();
            updateTodoList();
            saveTodos();
            todoText.contentEditable = false; // Disable editing after blur
        });
    });
}

function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoList();
}

function clearAllTodos() {
    allTodos = [];
    saveTodos();
    updateTodoList();
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(allTodos));
}

function getTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}
