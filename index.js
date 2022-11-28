import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
  loadHtml,
  adjustForMissingHash,
  setActiveLink,
  renderTemplate,
} from "./utils.js"

import { toogleLoginStatus } from "./pages/login/login.js"

import { load } from "./pages/riders/all-rider.js"
import { setupAddRider } from "./pages/addRider/addRider.js"
import { setupFindEditRider } from "./pages/findEditRider/findEditRider.js"
import { initResults } from "./pages/results/results.js"
import { initLogin, logout } from "./pages/login/login.js"
import { initAddEditStageResults } from "./pages/addEditStageResults/addEditStageResults.js"

window.addEventListener("load", async () => {
  const templateHome = await loadHtml("./pages/home/home.html")
  const templateRiders = await loadHtml("./pages/riders/all-riders.html")
  const templateAddRider = await loadHtml("./pages/addRider/addRider.html")
  const templateFindEditRider = await loadHtml("./pages/findEditRider/findEditRider.html")
  const templateResults = await loadHtml("./pages/results/results.html")
  const templateLogin = await loadHtml("./pages/login/login.html")
  const templateStageResults = await loadHtml("./pages/addEditStageResults/addEditStageResults.html")

  const token = localStorage.getItem("token")
  toogleLoginStatus(token) //If token existed, for example after a refresh, set UI accordingly

  const router = new Navigo("/", { hash: true });
  window.router = router

  adjustForMissingHash()
  router
    .hooks({
      before(done, match) {
        setActiveLink("topnav", match.url)
        done()
      }
    })
    .on({
      "/": () => renderTemplate(templateHome, "content"),
      "/riders": (match) => {
        renderTemplate(templateRiders, "content")
        load(1, match)
      },
      "/add-rider": (match) => {
        renderTemplate(templateAddRider, "content")
        setupAddRider()
      }
      ,
      "/find-edit-rider": (match) => {
        renderTemplate(templateFindEditRider, "content")
        setupFindEditRider(match)
      },
      "/stage-results": () => {
        renderTemplate(templateStageResults, "content")
        initAddEditStageResults()
      },
      "/results": () => {
        renderTemplate(templateResults, "content")
        initResults()
      },
      "/login": () => {
        renderTemplate(templateLogin, "content")
        initLogin()
      },
      "/logout": () => {
        logout()
      }
    })
    .notFound(() => renderTemplate("No page for this route found", "content"))
    .resolve()
});


window.onerror = (e) => alert(e)