import { getTeams, SERVER_API } from "../..//settings.js"
import { handleHttpErrors, makeOptions } from "../../utils.js"
import { handleError, setStatusMsg, showSpinner } from "../pageUtils.js"

let teams = []
let initialized = false

export async function setupAddRider() {
  try {
    showSpinner("spinner", true)
    if (!initialized) {
      teams = await getTeams()
      const options = teams.map(team => `
      <option value="${team.id}">${team.teamName}</option>
    `)
      options.unshift("<option selected>Select a team</option>")
      document.getElementById("team-selector").innerHTML = DOMPurify.sanitize(options.join("/n"))
      initialized = true
      document.getElementById("save-rider").onclick = saveRider;
    }
    clearInputFields()
  } catch (err) {
    handleError(err, "status")
  } finally {
    showSpinner("spinner", false)
  }
}
async function saveRider() {
  const newRider = {}
  newRider.name = document.getElementById("name").value
  newRider.country = document.getElementById("country").value
  newRider.below26 = document.getElementById("below26").checked
  newRider.teamId = Number(document.getElementById("team-selector").value)

  // const options = {}
  // options.method = "POST"
  // options.headers = { "Content-type": "application/json" }
  // options.body = JSON.stringify(newRider)
  const options = makeOptions("POST",newRider,true)
  try {
    showSpinner("spinner", true)
    const addedRider = await fetch(SERVER_API + "riders", options).then(handleHttpErrors)
    clearInputFields()
    setStatusMsg("Added new rider: " + JSON.stringify(addedRider), "status", false)
  } catch (err) {
    handleError(err, "status")
  } finally{
    showSpinner("spinner", false)
  }
}

function clearInputFields() {
  document.getElementById("name").value = ""
  document.getElementById("country").value = ""
  document.getElementById("below26").checked = false
  document.getElementById("team-selector").selectedIndex = 0
  setStatusMsg("", "status")
}



