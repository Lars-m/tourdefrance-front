import { SERVER_API } from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "../../utils.js"
import { handleError, setStatusMsg, secondsToHourMinSecStr } from "../pageUtils.js"

let riderIdInput
let initialized = false;




export function initAddEditStageResults() {
  if (!initialized) {
    initialized = true
    document.getElementById("btn-fetch-rider").onclick = fetchRider
    riderIdInput = document.getElementById("rider-id-input")
    document.getElementById("btn-save-scores").onclick = saveStageResults

  }
  clearAllFields()
}

async function fetchRider(evt) {
  evt.preventDefault()
  const id = riderIdInput.value
  try {
    const options = makeOptions("GET", null, true)
    const url = SERVER_API + `riders/${id}?addStages=true`
    const rider = await fetch(url, options).then(handleHttpErrors)
    // const rider = await fetch(url, options).then(res => {
    //   for (var pair of res.headers.entries()) {
    //     console.log(pair[0] + ': ' + pair[1]);
    //   }
    // })

    document.getElementById("player-name").innerText = rider.name
    const stageResults = rider.stageResults
    const rows = stageResults.map(sr => `
    <tr>
       <td id="id-stage">${sr.id}</td>
       <td>${sr.stageName}</td>
       <td><input class="form-control" style="max-width:7em;float:left" type="number" id="input-time" value="${sr.time}"/>
       <span style="vertical-allign:middle;"> &nbsp; (${secondsToHourMinSecStr(sr.time)})</td></span>
       <td><input class="form-control" style="max-width:7em;" type="number" id="input-mountainpoint" value="${sr.mountainPoint}"/></td>
       <td><input class="form-control" style="max-width:7em;" type="number" id="input-sprintpoint" value="${sr.sprintPoint}"/></td>
    </tr>
    `).join("")
    document.getElementById("table-rows").innerHTML = sanitizeStringWithTableRows(rows)

  } catch (err) {
    handleError(err, "status-1")
  }
}

async function saveStageResults() {
  const tblRows = document.getElementById("table-rows")
  const rows = tblRows.querySelectorAll("tr")

  const stageResults = []
  rows.forEach(tr => {
    const stageResult = {}
    stageResult.id = Number(tr.querySelector("#id-stage").innerText)
    stageResult.time = Number(tr.querySelector("#input-time").value)
    stageResult.mountainPoint = Number(tr.querySelector("#input-mountainpoint").value)
    stageResult.sprintPoint = Number(tr.querySelector("#input-sprintpoint").value)
    stageResults.push(stageResult)
  })
  const riderId = riderIdInput.value
  console.log(stageResults)
  const body = {
    riderId: Number(riderId),
    stageResults
  }
  const options = makeOptions("PUT", body, true)
  try {
    const response = await fetch(SERVER_API + "stageresults/" + riderId, options).then(handleHttpErrors)
    clearAllFields()
    setStatusMsg(response.status, "status-2", false)

  } catch (err) {
    handleError(err, "status-2")
  }
}

function clearAllFields() {
  setStatusMsg("", "status-1")
  setStatusMsg("", "status-2")
  riderIdInput.value = ""
  document.getElementById("table-rows").innerHTML = ""
  document.getElementById("player-name").innerText = ""
}

