const save_css = document.getElementById('colors-save-css');
const save_json = document.getElementById('colors-save-json');
const theme_name = document.getElementById('theme-name');
const _theme_boxes = document.querySelectorAll('._theme-color');
let _name = theme_name.value.length === 0 ? "Default Theme 1" : theme_name.value;

const classes = [
    'primary', 'background', 'accent1', 'accent2', 'text-o-l',
    'text-o-d', 'warning', 'error', 'success', 'alert'
];

save_json.addEventListener('click', () => {
    saveJson();
});
save_css.addEventListener('click', () => {
    saveCss();
})

function saveJson() {
    _name = theme_name.value.length === 0 ? "Default Theme 1" : theme_name.value;
    let json_obj = {};
    json_obj[`${theme_name.id}`] = _name;
    _theme_boxes.forEach(box => {
        let color = parseColor(getComputedStyle(box).backgroundColor);//[r,g,b,a]
        color = RGBAToString(color);
        json_obj[`${box.id}`] = color;
    });
    json_obj = JSON.stringify(json_obj);
    const blob = new Blob([json_obj], { type: "application/json" });
    download(blob, 'json')
    console.log(json_obj);
}

function saveCss() {
    _name = theme_name.value.length === 0 ? "Default Theme 1" : theme_name.value;
    let str = '';
    str += `/*${_name}*/\n`
    str += ':root{\n';
    _theme_boxes.forEach(box => {
        let color = parseColor(getComputedStyle(box).backgroundColor);//[r,g,b,a]
        color = RGBAToString(color);
        str += `--${box.id}: ${color};\n`;
    })
    str += '}\n'
    const blob = new Blob([str], { type: "text/css" });
    download(blob, 'css')
    navigator.clipboard.writeText(str).then(() => { });
}

function download(blob, type) {
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${_name}.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}