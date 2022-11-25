import { SERVER_API } from "../../settings.js"
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js"

const URL = SERVER_API + "riders/scores"
let showRidersBelow26 = false


export async function initResults() {

  document.getElementById("below26-select").onclick = (evt) => {
    //showRidersBelow26 = evt.target.checked
    console.log("jfajfajfj")
    initResults()
  }

  showRidersBelow26 = document.getElementById("below26-select").checked

  const allRiders = await fetch(URL).then(handleHttpErrors)
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
  <td>${(r.timeTotal / 60).toFixed(2)} min.</td>
  <td>${r.name}</td>
  <td>${r.country}</td>
  </tr>`).join("")
  document.getElementById("table-body").innerHTML = sanitizeStringWithTableRows(rows)
}





