import { SERVER_API } from "../../settings.js"
import { handleHttpErrors } from "../../utils.js"
import { handleError } from "../pageUtils.js"

const URL = SERVER_API + "auth/login"



export function initLogin() {
  document.getElementById("btn-login").onclick = login
}

async function login() {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  const loginRequest = {
    username,  //Shortcut for username: username
    password
  }

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginRequest)
  }

  try {
    const res = await fetch(URL, options).then(handleHttpErrors)
    setLoginStatus(res)
  }
  catch (err) {
    handleError(err, "error")
  }
}


function setLoginStatus(res) {
  localStorage.setItem("user", res.username)
  localStorage.setItem("token", res.token)
  localStorage.setItem("roles", res.roles)
  toogleLoginStatus(true)
  window.router.navigate("/")
}

//Exported so it can be called by the router
export function logout() {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  localStorage.removeItem("roles")
  toogleLoginStatus(false)
  window.router.navigate("/")
}

export function toogleLoginStatus(loggedIn) {
  document.getElementById("login-container").style.display = loggedIn ? "none" : "block"
  document.getElementById("logout-container").style.display = loggedIn ? "block" : "none"
  const secretItems = document.querySelectorAll(".logged-in-menu")
  for (let i = 0; i < secretItems.length; i++) {
    secretItems[i].style.display = loggedIn ? "block" : "none"
  }


  if (loggedIn) {
    document.getElementById("logged-in-user").innerText = `Logged in as: ${localStorage.getItem("user")}  `
  }
}