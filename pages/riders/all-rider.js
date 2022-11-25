import { SERVER_API, getTeams } from "../../settings.js"

import { paginator } from "../../lib/paginator/paginate-bootstrap.js"
import { handleHttpErrors, sanitizeStringWithTableRows, makeOptions } from "../../utils.js"
import { handleError, setStatusMsg, showSpinner } from "../pageUtils.js"
const SIZE = 4
let TOTAL_RECORDS = 1 //Should come from the backend
let TOTAL = 1

let riders = []
let initialized = false

async function gotoToAddEditView(evt) {
  const target = evt.target
  if (!target.id.includes("-column-id")) {
    return
  }
  const id = target.id.replace("-column-id", "")
  window.router.navigate("find-edit-rider?id=" + id)
}

//sort=brand,asc
let sortField;
let sortOrder = "desc"

function handleSort(pageNo, field, match) {
  sortOrder = sortOrder == "asc" ? "desc" : "asc"
  sortField = field
  load(pageNo, match)
}
export async function load(pg, match) {
  try {
    if (!initialized) {
      initialized = true
      document.getElementById("tbody").onclick = gotoToAddEditView
      document.getElementById("headers").onclick = function (evt) {
        evt.preventDefault()
        if (evt.target.nodeName === "A") {
          const sortField = evt.target.innerText
          handleSort(pageNo, sortField, match)
        }
      }
    }
    showSpinner("spinner", true)
    setStatusMsg("", "error")
    const ridersCount = await fetch(`${SERVER_API}riders/count`, makeOptions("GET", null, true)).then(handleHttpErrors)
    TOTAL_RECORDS = Number(ridersCount.count)
    TOTAL = Math.ceil(TOTAL_RECORDS / SIZE)
    const p = match?.params?.page || pg
    let pageNo = Number(p)
    let queryString = `?size=${SIZE}&page=` + (pageNo - 1)
    if (sortField) {
      queryString += `&sort=${sortField},${sortOrder}`
    }

    riders = await fetch(`${SERVER_API}riders${queryString}`,makeOptions("GET",null,true)).then(handleHttpErrors)
    const rows = riders.map(rider => `
  <tr>
    <td>${rider.id}</td>
    <td>${rider.name}</td>
  
    <td>${rider.country}</td>
    <td>${rider.below26 ? "yes" : "no"}</td>
    <td>${rider.teamName}</td>
    <td><button id="${rider.id}-column-id" class="btn btn-sm btn-secondary">Edit/delete</button> </td>
  `).join("")
    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)

    //REDRAW PAGINATION
    paginator({
      target: document.getElementById("car-paginator"),
      total: TOTAL,
      current: pageNo,
      click: load
    });

    //Update URL to allow for CUT AND PASTE when used with the Navigo Router (callHandler: false ensures the handler will not be called twice)
    window.router?.navigate(`/riders${queryString}`, { callHandler: false, updateBrowserURL: true })
  } catch (e) {
    handleError(e, "error")
  } finally {
    showSpinner("spinner", false)
  }
}
