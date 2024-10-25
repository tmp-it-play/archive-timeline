const toDoForm = document.querySelector("#todo-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.getElementById("todo-list");
let toDos = [];

const TODOS_KEY = "todos"

function saveToDos() {
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function deleteToDo(event) {
    const li = event.target.parentElement;
    li.remove();
}

function paintToDo(newToDo) {
    const newLi = document.createElement("li");
    const newSpan = document.createElement("span");
    const newButton = document.createElement("button");
    newButton.innerText = "❌";
    newButton.addEventListener("click", deleteToDo);
    newSpan.innerText = newToDo;
    newLi.appendChild(newSpan);
    newLi.appendChild(newButton);
    toDoList.appendChild(newLi);
}

function handleToDoSubmit(event) {
    event.preventDefault();
    const newToDo = toDoInput.value;
    toDoInput.value = "";
    toDos.push(newToDo);
    paintToDo(newToDo);
    saveToDos()
}

toDoForm.addEventListener("submit", handleToDoSubmit);
const savedToDos = localStorage.getItem(TODOS_KEY);
console.log(savedToDos);
if (savedToDos) {
    const parsedToDos = JSON.parse(savedToDos);
    toDos=parsedToDos
    parsedToDos.forEach(paintToDo);
}