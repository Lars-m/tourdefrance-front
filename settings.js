export const SERVER_API = "http://localhost:8080/api/"

import { handleHttpErrors } from "./utils.js"
import { makeOptions } from "./utils.js"

let teams = []

export async function getTeams() {
  if (teams.length === 0) {
    teams = await fetch(SERVER_API + "teams", makeOptions("GET", null, true)).then(handleHttpErrors)
  }
  return teams
}

