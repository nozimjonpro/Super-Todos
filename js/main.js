const elTodoForm = document.querySelector(".todo__form");
const elTodoInput = elTodoForm.querySelector(".todo__input");
const elTodoList = document.querySelector(".todo__list");
const elTodoTemplate = document.querySelector("#todo__template").content;
const elButtons = document.querySelector(".buttons");
const elButtonAll = elButtons.querySelector(".todo-button__all");
const elButtonComleted = elButtons.querySelector(".todo-button__completed");
const elButtonUncompleted = elButtons.querySelector(
  ".todo-button__uncompleted"
);
const elAllInfo = elButtons.querySelector(".all-button__info");
const elComletedInfo = elButtons.querySelector(".completed-button__info");
const elUncomletedInfo = elButtons.querySelector(".uncomleted-button__info");

const todos = JSON.parse(window.localStorage.getItem("todos")) || [];

// Speech regognition 


alert("If you don't wanna to write you may speak and it will be written on todos. For doing it click microphone icon!")

speech.addEventListener('click', ()=>{
  const recording = new webkitSpeechRecognition();

  recording.lang = 'uz-UZ'
  
  
  recording.onresult = (evt)=>{
    const speechValue = (evt.results[0][0].transcript)
    const speechObj = {
      id: todos[todos.length - 1]?.id + 1 || 0,
      title: speechValue,
      isCompleted: false
    };
    todos.push(speechObj);
    if(todos.length>=0){
      elButtons.style.display = 'block'
    }
    renderTodo(todos, elTodoList)
    }

  
  recording.onend = ()=>{
      console.log('goodbye world')
  }
  recording.start();

})

function renderInfos(array) {
  elAllInfo.textContent = array.length;

  const completedInfosLength = array.filter((info) => info.isCompleted);

  elComletedInfo.textContent = completedInfosLength.length;

  elUncomletedInfo.textContent = array.length - completedInfosLength.length;
}

elButtons.addEventListener("click", (evt) => {
  if (
    evt.target.matches(".todo-button__all") ||
    evt.target.matches(".all-button__info")
  ) {
    renderTodo(todos, elTodoList);
  } else if (
    evt.target.matches(".completed-button__info") ||
    evt.target.matches(".todo-button__completed")
  ) {
    const filteredComleted = todos.filter((todo) => todo.isCompleted);
    renderTodo(filteredComleted, elTodoList);
  } else if (
    evt.target.matches(".todo-button__uncompleted") ||
    evt.target.matches(".uncomleted-button__info")
  ) {
    const filteredUncompleted = todos.filter((todo) => !todo.isCompleted);
    renderTodo(filteredUncompleted, elTodoList);
  }
});

function renderTodo(array, node) {
  node.innerHTML = null;
  renderInfos(array);
  const todoFragment = document.createDocumentFragment();
  array.forEach((todo) => {
    const todoTemplate = elTodoTemplate.cloneNode(true);
    const todoText = todoTemplate.querySelector(".todo__text");
    const todoCheck = todoTemplate.querySelector(".todo__check");
    const todoDelete = todoTemplate.querySelector(".todo__delete-button");

    todoText.textContent = todo.title;
    todoCheck.dataset.todoId = todo.id;
    todoDelete.dataset.todoId = todo.id;

    if (todo.isCompleted) {
      todoCheck.checked = true;
      todoText.style.textDecoration = "line-through";
      todoText.style.opacity = "0.4";
    } else {
      todoCheck.checked = false;
    }
    todoFragment.appendChild(todoTemplate);
  });

  node.appendChild(todoFragment);
}

function deleteTodo(id, array) {
  const founIndex = array.findIndex((item) => item.id === id);
  array.splice(founIndex, 1);
  renderTodo(array, elTodoList);
  window.localStorage.setItem("todos", JSON.stringify(todos));
}

function checkedTodo(id, array) {
  const foundTodoElement = array.find((item) => item.id === id);
  foundTodoElement.isCompleted = !foundTodoElement.isCompleted;
  renderTodo(array, elTodoList);
  window.localStorage.setItem("todos", JSON.stringify(todos));
}

elTodoList.addEventListener("click", (evt) => {
  if (evt.target.matches(".todo__delete-button")) {
    const clickedTodo = Number(evt.target.dataset.todoId);
    deleteTodo(clickedTodo, todos);
if(todos.length === 0){
  elButtons.style.display = 'none'
  elTodoInput.style.boxShadow = '0 2px 7px 0 rgb(0 0 0 / 20%)'
}
  }
  if (evt.target.matches(".todo__check")) {
    const checkedInput = Number(evt.target.dataset.todoId);
    checkedTodo(checkedInput, todos);
  }
});

function handleFormSubmit(evt) {
  evt.preventDefault();

  const todoValue = elTodoInput.value.trim();

  if (todoValue === "") {
    return;
  }

  if(todos.length>=0){
    elButtons.style.display = 'block'
  }
 
  const newTodo = {
    id: todos[todos.length - 1]?.id + 1 || 0,
    title: todoValue,
    isCompleted: false,
  };
  elTodoList.style.boxShadow = '0 0 5px 0 rgb(0 0 0 / 20%)'
  elTodoInput.style.boxShadow = '0 0 5px 0 rgb(0 0 0 / 20%)'
  todos.push(newTodo);
  renderTodo(todos, elTodoList);
  window.localStorage.setItem("todos", JSON.stringify(todos));
  elTodoInput.value = null;
}



elTodoForm.addEventListener("submit", handleFormSubmit);
