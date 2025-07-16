const apikeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const form = document.getElementById("form");
const aiResponse = document.getElementById("aiResponse");

const askAi = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const prompt = `I have the game ${game} and i want to know ${question}`
  const contents = [{
    parts: [{
      text: prompt
    }]
  }]
  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({contents})
  })
  const data = await response.json()
  return data.candidates[0].contents.parts[0].text;
}

const submitForm = async (event) => {
  event.preventDefault();
  const apikey = apikeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;

  if (apikey == "" || game == "" || question == "") {
    alert("Please fill in all fields!");
    return;
  }

  askButton.disabled = true;
  askButton.textContent = "Asking...";
  askButton.classList.add("loading");

  try {
    const aiResponse = await askAi(question, game, apiKey) 
  } catch (error) {
    console.log('Error: ', error)
  } finally {
    askButton.disabled = false;
    askButton.textContent = "Ask";
    askButton.classList.remove("loading");
  }
};
form.addEventListener("submit", submitForm);
