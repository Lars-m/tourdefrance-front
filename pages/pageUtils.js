export function handleError(err, statusField) {
  if (err.apiError) {
    console.error("Full API error: ", err.apiError)
    setStatusMsg(err.apiError.message, statusField, true)
  } else {
    const msg = (err.statusCode && err.statusCode == 401) ? " Request could not be authenticated, you might need to login again" : " (Is the server running?)"
    setStatusMsg(err.message + msg, statusField, true)
    console.error(err.message + msg)
  }
}

export function setStatusMsg(msg, statusField, isError) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = document.getElementById(statusField)
  statusNode.style.color = color
  statusNode.innerText = msg
}

export function showSpinner(target, show) {
  const value = show ? "block" : "none"
  document.getElementById(target).style.display = value
}

export function secondsToHourMinSecStr(sec) {
  let hours = Math.floor(sec / 3600)
  let remainingSeconds = sec % 3600
  let min = Math.floor(remainingSeconds / 60)
  let seconds = remainingSeconds % 60
  const asStr = `${hours.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  return asStr
}