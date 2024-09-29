function copyToClipboard() {

    const text = `.rgba-color{\n\tcolor: rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]});\n}\n.rgba-background.color{\n\tbackground-color: rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]});\n}\n`
    navigator.clipboard.writeText(text).then(() => {
        alert("css rules copied to clipboard successfully");
    }).catch(err => {
        alert("Failed to copy rules to clipboard" + err);
    });
}

document.getElementById('color-display').addEventListener('click', () => {
    copyToClipboard();
})


