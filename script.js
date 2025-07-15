const apikeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput =  document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const form = document.getElementById('form')
const aiResponse = document.getElementById('aiResponse')

const submitForm = (event) => {
  event.preventDefault()
}
form.addEventListener('submit', submitForm)