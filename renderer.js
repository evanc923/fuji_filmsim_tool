window.electron.onStdoutData((data) => {
    document.getElementById('stdout').innerText = data;
});

document.getElementById('select-path-button-1').addEventListener('click', async () => {
    const result = await window.electron.selectPath();
    document.getElementById('selected-path-1').innerText = result.length > 0 ? result[0] : 'No path selected';
    checkInput();
});

document.getElementById('select-path-button-2').addEventListener('click', async () => {
    const result = await window.electron.selectPath();
    document.getElementById('selected-path-2').innerText = result.length > 0 ? result[0] : 'No path selected';
    checkInput();
});

function checkInput () {
    let src_path = document.getElementById('selected-path-1').innerText;
    let dst_path = document.getElementById('selected-path-2').innerText;

    console.log('listening click')
    if (src_path.length > 0 && dst_path.length > 0) {
        document.getElementById('start').disabled = false;
    }
}

document.getElementById('start').addEventListener('click', async () => {
    let src_path = document.getElementById('selected-path-1').innerText;
    let dst_path = document.getElementById('selected-path-2').innerText;
    let camera_model = document.getElementById('camera-model').value;
    if (src_path.length == 0 || dst_path.length == 0 || camera_model.length == 0) {
        alert("Values cannot be empty!")
        return
    }
    const command = 'exiftool/exiftool_app';
    const args = [
    '-progress',
    `-Model=${camera_model}`,
    `${src_path}`,
    '-O',
    `${dst_path}`
    ];
    await window.electron.runCommand(command, args);
    alert("Convert complete!");
});