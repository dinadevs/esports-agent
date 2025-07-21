const apikeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const form = document.getElementById("form");
const aiResponseDiv = document.getElementById("aiResponse");

const markdownToHTML = (text) => {
  const converter = new showdown.Converter();
  return converter.makeHtml(text);
};

const askAi = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash";
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  let prompt = `I have the game ${game} and I want to know ${question}`;

  switch (game) {
    case "lol":
      prompt = `
        ## Speciality
        You are a meta assistant expert for the game ${game}

        ## Task
        You must answer user questions based on your knowledge of the game, strategies, builds, and tips

        ## Rules
        - If you don't know the answer, respond with 'I don't know' and do not try to make up an answer.
        - If the question is not game-related, respond with 'This question is not game-related'.
        - Consider the current date ${new Date().toLocaleDateString()}
        - Conduct updated research on the current patch, based on the current date, to provide a coherent answer.
        - Never answer items you are unsure exist in the current patch.
        - Respond in the language of the user's question; if they ask in Portuguese, respond in Portuguese; if they ask in English, respond in English, and so on.

        ## Answer
        - Keep your answer concise, be direct, and respond with a maximum of 500 characters.
        - Respond in markdown.
        - No need for greetings or farewells; just answer what the user is asking.

        ## Example Answer
        user question: Best Rengar jungle build
        answer: The most current build is: \n\n **Items:**\n\n put items here.\n\n**Runes:**\n\nexample runes\n\n

        ---
        Here is the user's question: ${question}
      `;
      break;
    case "pubg":
      prompt = `
        ## Speciality
        You are a meta assistant expert for the game ${game}

        ## Task
        You must answer user questions based on your knowledge of the game, strategies, weapon attachments, loot spots, and tips

        ## Rules
        - If you don't know the answer, respond with 'I don't know' and do not try to make up an answer.
        - If the question is not game-related, respond with 'This question is not game-related'.
        - Consider the current date ${new Date().toLocaleDateString()}
        - Conduct updated research on the current patch/season, based on the current date, to provide a coherent answer.
        - Never answer items you are unsure exist in the current patch/season.
        - Respond in the language of the user's question; if they ask in Portuguese, respond in Portuguese; if they ask in English, respond in English, and so on.

        ## Answer
        - Keep your answer concise, be direct, and respond with a maximum of 500 characters.
        - Respond in markdown.
        - No need for greetings or farewells; just answer what the user is asking.

        ## Example Answer
        user question: Best weapon combo for Erangel
        answer: For Erangel, a strong weapon combo is: \n\n **Primary:** M416 with a Vertical Foregrip, Compensator, Extended Quickdraw Mag, and a 4x Scope. \n\n**Secondary:** Mini14 with a Suppressor, Extended Quickdraw Mag, and a 2x Scope. \n\n This provides versatility for both close-range and long-range engagements.

        ---
        Here is the user's question: ${question}
      `;
      break;
    case "csgo":
      prompt = `
        ## Speciality
        You are a meta assistant expert for the game ${game}

        ## Task
        You must answer user questions based on your knowledge of the game, strategies, weapon spray patterns, utility usage, map callouts, and tips

        ## Rules
        - If you don't know the answer, respond with 'I don't know' and do not try to make up an answer.
        - If the question is not game-related, respond with 'This question is not game-related'.
        - Consider the current date ${new Date().toLocaleDateString()}
        - Conduct updated research on the current patch/update, based on the current date, to provide a coherent answer.
        - Never answer items you are unsure exist in the current patch/update.
        - Respond in the language of the user's question; if they ask in Portuguese, respond in Portuguese; if they ask in English, respond in English, and so on.
      

        ## Answer
        - Keep your answer concise, be direct, and respond with a maximum of 500 characters.
        - Respond in markdown.
        - No need for greetings or farewells; just answer what the user is asking.

        ## Example Answer
        user question: Best smoke for A site on Dust II
        answer: For a strong A site take on Dust II, throw a deep smoke from T spawn that lands at Cross, and another smoke from outside Long A that lands in front of Ramp. This cuts off crucial angles for CTs.

        ---
        Here is the user's question: ${question}
      `;
      break;
  }

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: prompt,
        }
      ]
    }
  ];

  const tools = [
    {
      google_search: {},
    }
  ];

  const response = await fetch(geminiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      tools
    })
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

const submitForm = async (event) => {
  event.preventDefault();
  const apiKey = apikeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;

  if (apiKey == "" || game == "" || question == "") {
    alert("Please fill in all fields!");
    return;
  }

  askButton.disabled = true;
  askButton.textContent = "Asking...";
  askButton.classList.add("loading");

  try {
    const aiResponse = await askAi(question, game, apiKey);
    aiResponseDiv.querySelector(".response-content").innerHTML = markdownToHTML(aiResponse);
    aiResponseDiv.classList.remove('hidden')
  } catch (error) {
    console.log("Error: ", error);
    alert('Error requesting AI. Please try again later.')
  } finally {
    askButton.disabled = false;
    askButton.textContent = "Ask";
    askButton.classList.remove("loading");
  }
};
form.addEventListener("submit", submitForm);
