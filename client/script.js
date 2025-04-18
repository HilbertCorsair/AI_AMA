import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function genUId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(AI, val, uid) {
    return (
        `
        <div class="wrapper ${AI && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${AI ? bot : user} 
                      alt="${AI ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uid}>${val}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)
    const prompt = data.get('prompt')

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, prompt)

    form.reset()

    const uid = genUId()
    chatContainer.innerHTML += chatStripe(true, " ", uid)
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uid)
    loader(messageDiv)

    try {
        const response = await fetch("https://ai-ama.vercel.app", {  // Updated URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        clearInterval(loadInterval)
        messageDiv.innerHTML = " "

        if (response.ok) {
            const data = await response.json();
            const parsedData = data.bot.trim()
            typeText(messageDiv, parsedData)
        } else {
            const errorData = await response.text()
            console.error('Server error:', response.status, errorData)
            messageDiv.innerHTML = `Server error: ${response.status}. ${errorData}`
        }
    } catch (error) {
        clearInterval(loadInterval)
        console.error('Request error:', error)
        messageDiv.innerHTML = "Network error: " + error.message
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})
