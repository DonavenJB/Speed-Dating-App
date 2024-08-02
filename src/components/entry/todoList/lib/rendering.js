const removeChildren = node => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  console.log('[removeChildren] All children removed from node:', node); // Log the node after children removal
  return node;
};

const buildTodoList = (document, list, todos) => {
  console.log('[buildTodoList] Number of todos:', todos.length); // Log the number of todos

  todos.forEach((todo, index) => {
    console.log(`[buildTodoList] Processing todo ${index + 1}:`, todo); // Log each todo object
    console.log(`[buildTodoList] todo.text type: ${typeof todo.text}, value: ${todo.text}`); // Log the type and value of todo.text

    const li = document.createElement("li");
    li.className = "todo-list__li";
    li.textContent = todo.text; // Ensure that the text property is displayed

    console.log(`[buildTodoList] Created list item for todo ${index + 1}:`, li); // Log the created list item

    list.appendChild(li);
    console.log(`[buildTodoList] Appended list item for todo ${index + 1} to list`); // Log the appending of the list item
  });

  console.log('[buildTodoList] Completed building todo list'); // Log completion of the function
};

module.exports.removeChildren = removeChildren;
module.exports.buildTodoList = buildTodoList;
