const loginForm = document.getElementsByClassName("login-form")[0];
const loginInput = loginForm.querySelector("input");
const loginButton = loginForm.querySelector("button");

function onLoginSubmit(event) {
    event.preventDefault();
    console.log(event);
}

loginForm.addEventListener("submit", onLoginSubmit);