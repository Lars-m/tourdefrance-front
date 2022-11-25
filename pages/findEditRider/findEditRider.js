import { SERVER_API, getTeams } from "../../settings.js"
import { handleHttpErrors, makeOptions } from "../../utils.js"
import { handleError, setStatusMsg, showSpinner } from "../pageUtils.js"
let initialized = false

let idParagraph
let idInput
let nameInput
let countryInput
let below26CheckBox
let teamSelect
let status1
let status2

export async function setupFindEditRider(match) {
  if (!initialized) {
    document.getElementById("btn-fetch-rider").onclick = fetchRiderFromProvidedID
    document.getElementById("save-rider").onclick = editRider
    document.getElementById("delete-rider").onclick = deleteRider
    idParagraph = document.getElementById("id")
    idInput = document.getElementById("rider-id-input")
    nameInput = document.getElementById("name")
    countryInput = document.getElementById("country")
    below26CheckBox = document.getElementById("below26")
    teamSelect = document.getElementById("team-selector")
    status1 = document.getElementById("status-1")
    status2 = document.getElementById("status-2")
    initialized = true
  }
  clearInputFields()
  status1.innerText = ""
  if (match?.params?.id) {
    const id = match.params.id

    try {
      showSpinner("spinner1", true)
      fetchRider(id)
    } catch (err) {
      clearInputFields()
      handleError(err, "status-1")
    } finally {
      showSpinner("spinner1", false)
    }
  }
}

async function fetchRiderFromProvidedID() {
  const id = document.getElementById("rider-id-input").value
  try {
    showSpinner("spinner1", true)
    await fetchRider(id)
  } catch (err) {
    clearInputFields()
    handleError(err, "status-1")
  } finally {
    showSpinner("spinner1", false)
  }
}

async function fetchRider(id) {
  status1.innerText = ""
  if (id === "" || isNaN(id)) {
    setStatusMsg("Please provide a valid id", "status-1", true)
    return
  }
  const rider = await fetch(`${SERVER_API}riders/${id}`, makeOptions("GET", null, true)).then(handleHttpErrors)
  idParagraph.innerText = rider.id
  nameInput.value = rider.name
  countryInput.value = rider.country
  below26CheckBox.checked = rider.below26
  const teams = await getTeams()
  const options = teams.map((team, indx) => {
    const selected = (rider.teamName === team.teamName) ? "selected" : ""
    return `
    <option value="${team.id}" ${selected} >${team.teamName}</option>
  `}).join("")
  teamSelect.innerHTML = DOMPurify.sanitize(options)
}


async function editRider(evt) {
  evt.preventDefault()
  const riderToEdit = {}
  riderToEdit.name = nameInput.value
  riderToEdit.country = countryInput.value
  riderToEdit.below26 = below26CheckBox.checked
  riderToEdit.teamId = Number(teamSelect.value)

  const options = makeOptions("PUT", riderToEdit, true)
  try {
    showSpinner("spinner2", true)
    const editedRider = await fetch(SERVER_API + `riders/${idParagraph.innerText}`, options).then(handleHttpErrors)
    clearInputFields()
    setStatusMsg("Edited rider: " + JSON.stringify(editedRider), "status-2", false)

  } catch (err) {
    handleError(err, "status-2")
  } finally {
    showSpinner("spinner2", false)
  }
}

async function deleteRider(evt) {
  evt.preventDefault()
  const id = idParagraph.innerText

  clearInputFields()
  if (id === "" || isNaN(id)) {
    setStatusMsg("Please provide a valid id", "status-1", true)
    return
  }
  try {
    showSpinner("spinner2", true)
    await fetch(SERVER_API + `riders/${id}`, makeOptions("DELETE", null, true)).then(handleHttpErrors)
    setStatusMsg(`Rider with ID: ${id} was deleted`, "status-2", true)
  } catch (err) {
    handleError(err, "status-2")
  } finally {
    showSpinner("spinner2", false)
  }
}

function clearInputFields() {
  idInput.value = ""
  idParagraph.innerText = ""
  nameInput.value = ""
  countryInput.value = ""
  below26CheckBox.checked = ""
  teamSelect.innerHTML = null
  status2.innerText = ""
}


