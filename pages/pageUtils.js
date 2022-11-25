export function handleError(err, statusField) {
  if (err.apiError) {
    console.error("Full API error: ", err.apiError)
    setStatusMsg(err.apiError.message, statusField, true)
  } else {
    setStatusMsg(err.message + " (Is the server running?)", statusField, true)
    console.error(err.message)
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