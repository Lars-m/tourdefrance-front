import { SERVER_API } from "../../settings.js"
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js"
import { secondsToHourMinSecStr } from "../pageUtils.js"

const URL = SERVER_API + "riders/scores"
let showRidersBelow26 = false


export async function initResults() {

  document.getElementById("below26-select").onclick = (evt) => {
    initResults()
  }

  showRidersBelow26 = document.getElementById("below26-select").checked

  let allRiders = await fetch(URL).then(handleHttpErrors)
  allRiders = allRiders.map(rider => {
    rider.timeAdjusted = secondsToHourMinSecStr(rider.timeTotal)
    return rider
  })
  const below26Riders = allRiders.filter(rider => rider.below26)
  const yellow = allRiders.sort((a, b) => a.timeTotal - b.timeTotal)[0].name
  const green = allRiders.sort((a, b) => a.sprintPointTotal - b.sprintPointTotal)[0].name
  const polka = allRiders.sort((a, b) => a.mountainPointTotal - b.mountainPointTotal)[0].name
  const white = below26Riders.sort((a, b) => a.timeTotal - b.timeTotal)[0].name

  const ridersToShow = showRidersBelow26 ? below26Riders : allRiders



  makeTableRows(ridersToShow)
  document.getElementById("yellow").innerText = yellow
  document.getElementById("green").innerText = green
  document.getElementById("polka").innerText = polka
  document.getElementById("white").innerText = white
}

function makeTableRows(riders) {
  const rows = riders.map(r => `
  <tr>
   <td>${r.timeAdjusted} (${r.timeTotal} sec)</td>
  <td>${r.name}</td>
  <td>${r.country}</td>
  </tr>`).join("")
  document.getElementById("table-body").innerHTML = sanitizeStringWithTableRows(rows)
}





