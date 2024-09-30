//all checkboxes
const checkBoxes = document.querySelectorAll('input[type="checkbox"].checkbox');
//expand button
const expand = document.getElementById('_expand');
const expandText = document.querySelector('.select-text');
//dropdown items
const color_menu = document.getElementById('items');
//color boxes



checkBoxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const selected_boxes = Array.from(checkBoxes).filter(checkbox => checkbox.checked);
        document.querySelector('.select-text').innerHTML = `${selected_boxes.length} elements selected`;
        document.getElementById(`${checkbox.id.replace('opt-', '')}`).classList.toggle('visible');
        document.querySelector(`label #${checkbox.id}`).parentNode.classList.toggle('selected');
    });
});

function expandMenu() {
    color_menu.classList.toggle('visible');
    color_menu.classList.toggle('hide');
    expand.classList.toggle('up');
    expand.classList.toggle('down');
}

expand.addEventListener('click', () => {
    expandMenu();
});

expandText.addEventListener('click', () => {
    expandMenu();
});

function rgbToRgba(rgb, alpha = 1) {
    const rgbArray = rgb.match(/\d+/g); // Extract numbers from RGB string
    return [parseInt(rgbArray[0]), parseInt(rgbArray[1]), parseInt(rgbArray[2]), alpha];
}

function rgbaToArray(rgba) {
    const rgbaArray = rgba.match(/\d+(\.\d+)?/g); // Extract numbers from RGBA string
    return [
        parseInt(rgbaArray[0]),
        parseInt(rgbaArray[1]),
        parseInt(rgbaArray[2]),
        parseFloat(rgbaArray[3])
    ];
}

function parseColor(color) {
    if (color.startsWith('#')) {
        // HEX format
        return hexToRGBA(color);
    } else if (color.startsWith('rgb')) {
        // RGB or RGBA format
        if (color.startsWith('rgba')) {
            return rgbaToArray(color);
        } else {
            return rgbToRgba(color);
        }
    }

}

