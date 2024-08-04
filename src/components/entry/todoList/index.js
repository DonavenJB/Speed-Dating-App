const styles = require("./todoList.css");
const Store = require("../../common/store");
const reducer = require("./lib/reducer");
const { UPDATE_TODOS, INIT_TODO_LIST } = require("./lib/actions");
const { removeChildren, buildTodoList } = require("./lib/rendering");

const logger = {
  info: (message, ...args) => console.log(`[TodoList] ${message}`, ...args),
  error: (message, ...args) => console.error(`[TodoList] ${message}`, ...args)
};

// Using custom attributes will scale better than CSS classes/IDs
const numberOfTodos = document.querySelector("[data-js=number-of-todos]");
const form = document.querySelector("[data-js=todo-form]");
const list = document.querySelector("[data-js=todo-list]");
const textField = document.querySelector("[data-js=todo-field]");

// Clearly communicate what was missing
if (!numberOfTodos) throw new Error("number-of-todos not found");
if (!form) throw new Error("todo-form not found");
if (!list) throw new Error("todo-list not found");
if (!textField) throw new Error("todo-field not found");

// Subscribe to events
Store.subscribe((state, action) => {
  switch (action.type) {
    case UPDATE_TODOS:
      logger.info('UPDATE_TODOS - Updating todo list:', state.todoList.todos);
      removeChildren(list);
      buildTodoList(document, list, state.todoList.todos);
      numberOfTodos.textContent = state.todoList.todos.length;
      break;

    default:
      break;
  }
});

// Add our own module to hold state for this component
Store.addModule("todoList", reducer);

// Initialize todos
const todos = Array.from(list.querySelectorAll('tr')).slice(1).map(e => ({
  title: e.cells[0].textContent,
  description: e.cells[1].textContent,
  status: e.cells[2].textContent
}));
logger.info('Initial todos:', todos);
Store.dispatch({ type: INIT_TODO_LIST, todoList: { todos } });

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const todoTitle = textField.value;
  logger.info('Form submitted - New todo:', todoTitle);

  try {
    const res = await fetch("http://localhost:3000/todo", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: todoTitle, description: 'New Description', status: 'Pending' })
    });
    const todos = await res.json();   

    logger.info('Todos received from server:', todos);

    // Update DOM here
    removeChildren(list); // Remove existing list items
    todos.forEach(todo => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${todo.title}</td>
        <td>${todo.description}</td>
        <td>${todo.status}</td>
        <td></td>
      `;
      list.appendChild(newRow);
    });

    numberOfTodos.textContent = todos.length;
  } catch (error) {
    logger.error('Error submitting todo:', error.message);
  }
});
