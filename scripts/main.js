//tabs
const tab_items = document.querySelectorAll('.tab-btn');
const tabs = document.querySelectorAll('.picker');
//theme boxes
const theme_boxes = document.querySelectorAll('._box');
//sliders and spinners
const sliders = document.querySelectorAll('._slider');
const spinners = document.querySelectorAll('.spinner');
const hex_input = document.getElementById('hex-input');
//active color previewer
const colorDisplay = document.getElementById('color-display');
//global rgba variable
let rgba = new Proxy([255, 255, 255, 1], {
    set(target, property, value) {
        target[property] = value;
        updateColorDisplay();
        return true;
    }
});
//global active box
let active_box = document.getElementById('primary');

//initialize tab events
tab_items.forEach(tab_btn => {
    tab_btn.addEventListener('click', () => {
        tab_items.forEach(i => i.classList.remove('active'));
        tab_btn.classList.add('active');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tab_btn.id.replace('-tab', '-picker')}`).classList.add('active');
    });
});

const control = [...sliders, ...spinners];
control.forEach(x=>{
    x.addEventListener('input', ()=>{
        //connect slider-input
        if(x.classList.contains('_slider')){
            document.getElementById(`${x.id}-input`).value = x.value;
        }
        else{
            document.getElementById(`${x.id.replace('-input', '')}`).value = x.value;
        }
        //update color
        if (x.classList.contains('rgb')) {
            updateFromRGB();
        }
        else if (x.classList.contains('hsv')) {
            updateFromHSV();
        }
        else if (x.classList.contains('hsl')) {
            updateFromHSL();
        }
        else if (x.classList.contains('cmyk')) {
            updateFromCMYK()
        }
        else if (x.classList.contains('alpha')) {
            updateFromAlpha();
        }
    });
});

hex_input.addEventListener('input', () => {
    updateFromHex();
})

//update color
function updateColorDisplay() {
    colorDisplay.style.backgroundColor = `rgba(${rgba[0]},${rgba[1]},${rgba[2]}, ${rgba[3]})`;
    //call correct color formats ui
    correctRGB();
    correctHSV();
    correctHSL();
    correctCMYK();
    correctHex();
    correctAlpha();
    //update active box background
    active_box.style.backgroundColor = `rgba(${rgba[0]},${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
    /*correct the active box text color based on background*/
    correctFontColor(active_box); 
}

function initialize() {
    updateColorDisplay(); //update color editing ui
    //initialize event listeners
    initializeBoxes();
    initializeDraggableObjects();
}

//add click listeners to the color boxes
function initializeBoxes() {
    _theme_boxes.forEach(box => {
        box.addEventListener('click', (e) => {
            //set clicked box as active for editing
            active_box = box;
            _theme_boxes.forEach(b => b.classList.remove('active'));
            box.classList.add('active');
            let color = parseColor(getComputedStyle(box).backgroundColor);
            //change color changes to update ui
            ripple(e);
            rgba[0] = color[0];
            rgba[1] = color[1];
            rgba[2] = color[2];
            rgba[3] = color[3];
        });
        correctFontColor(box);
        box.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const menu = document.getElementById('context-menu');
            //menu position
            let x = e.clientX;
            let y = e.clientY;
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            menu.classList.add('active');//display menu
            const color = parseColor(getComputedStyle(box).backgroundColor);
            const ctx_menu_buttons = document.querySelectorAll('#context-menu>button');
            ctx_menu_buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    let sender = btn.id.slice(2);
                    let str;
                    //prepare appropriate color format based on sender type
                    switch (sender) {
                        case 'rgba':
                            let rgba = RGBAToString(color);
                            navigator.clipboard.writeText(rgba).then(() => { });
                            break;
                        case 'hsv':
                            let hsv = RGBToHSV(color[0], color[1], color[2]);
                            str = `hsv(${hsv[0]}, ${hsv[1]}, ${hsv[2]})`;
                            navigator.clipboard.writeText(str).then(() => { });
                            break;
                        case 'hsl':
                            let hsl = RGBToHSL(color[0], color[1], color[2]);
                            str = `hsl(${hsl[0]}, ${hsl[1]}, ${hsl[2]})`;
                            navigator.clipboard.writeText(str).then(() => { });
                            break;
                        case 'cmyk':
                            let cmyk = RGBToCMYK(color[0], color[1], color[2]);
                            str = `cmyk(${cmyk[0]}, ${cmyk[1]}, ${cmyk[2]}, ${cmyk[3]})`;
                            navigator.clipboard.writeText(str).then(() => { });
                            break;
                        case 'hex':
                            str = RGBToHex(color[0], color[1], color[2]);
                            navigator.clipboard.writeText(str).then(() => { });
                            break;
                        default:
                            break;
                    }
                });
            });
        });
    });
    //hide context menu on click
    window.addEventListener('click', () => {
        document.getElementById('context-menu').classList.remove('active');
    });
}

//drag and drop events
function initializeDraggableObjects() {
    const preview_element = document.getElementById('preview');
    const theme_boxes = document.querySelectorAll('._box');
    //draggable objects
    theme_boxes.forEach(box => {
        box.addEventListener('dragstart', (e) => {
            const color = getComputedStyle(box).backgroundColor;
            preview_element.style.backgroundColor = color;
            preview_element.style.display = 'block';
            //highlight droppable areas
            theme_boxes.forEach(b => {
                b.classList.add('highlighted');
            })
            //preview
            document.body.appendChild(preview_element);
            e.dataTransfer.setDragImage(preview_element, 30, 30);
            e.dataTransfer.setData('text/plain', color);
        });
        box.addEventListener('dragend', () => {
            theme_boxes.forEach(b => {
                b.classList.remove('highlighted');
            })
            preview_element.style.display = 'none';
        });
        box.addEventListener('dragover', (e) => {
            e.preventDefault(); //prevent unwanted dragover events
        });
        //drop event
        box.addEventListener('drop', (e) => {
            e.preventDefault(); //disable default behavior
            const color = e.dataTransfer.getData('text/plain');
            box.style.backgroundColor = color;
            active_box = box; //active box is now the drop target
            theme_boxes.forEach(b => b.classList.remove('active'));
            box.classList.add('active');
            let _color = parseColor(getComputedStyle(box).backgroundColor);
            //trigger color changes to update ui
            rgba[0] = _color[0];
            rgba[1] = _color[1];
            rgba[2] = _color[2];
            rgba[3] = _color[3];
        });
    });
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        preview_element.style.top = `${e.pageY}px`;
        preview_element.style.left = `${e.pageX}px`;
    })
}

//Automatically change color font based on background luminosity
function correctFontColor(box) {
    let color = parseColor(getComputedStyle(box).backgroundColor);
    let l = RGBToHSL(color[0], color[1], color[2])[2];
    box.classList.remove('text-black');
    box.classList.remove('text-white');
    if (l > 45) {
        box.classList.add('text-black');
    }
    else {
        box.classList.add('text-white');
    }
}
//UPDATE / CORRECT COLOR FORMATS
function updateFromRGB() {
    let r = document.getElementById('rgb-red').value;
    let g = document.getElementById('rgb-green').value;
    let b = document.getElementById('rgb-blue').value;
    rgba[0] = r;
    rgba[1] = g;
    rgba[2] = b;
}

function correctRGB() {
    const rgb_red_slider = document.getElementById('rgb-red')
    const rgb_green_slider = document.getElementById('rgb-green')
    const rgb_blue_slider = document.getElementById('rgb-blue')

    rgb_red_slider.value = rgba[0];
    rgb_green_slider.value = rgba[1];
    rgb_blue_slider.value = rgba[2];

    document.getElementById('rgb-red-input').value = rgba[0];
    document.getElementById('rgb-green-input').value = rgba[1];
    document.getElementById('rgb-blue-input').value = rgba[2];

    rgb_red_slider.style.backgroundImage = `linear-gradient(to right, rgb(0, ${rgba[1]}, ${rgba[2]}), rgb(255, ${rgba[1]}, ${rgba[2]}))`
    rgb_green_slider.style.backgroundImage = `linear-gradient(to right, rgb(${rgba[0]}, 0, ${rgba[2]}), rgb(${rgba[0]}, 255, ${rgba[2]}))`
    rgb_blue_slider.style.backgroundImage = `linear-gradient(to right, rgb(${rgba[0]}, ${rgba[1]}, 0), rgb(${rgba[0]}, ${rgba[1]}, 255))`
}

function updateFromHSV() {
    const h = document.getElementById('hsv-hue').value;
    const s = document.getElementById('hsv-saturation').value;
    const v = document.getElementById('hsv-value').value;

    const rgb = HSVToRGB(h, s, v);
    rgba[0] = rgb[0];
    rgba[1] = rgb[1];
    rgba[2] = rgb[2];
}

function correctHSV() {
    const hsv = RGBToHSV(rgba[0], rgba[1], rgba[2]);

    const hue_slider = document.getElementById('hsv-hue');
    const saturation_slider = document.getElementById('hsv-saturation');
    const value_slider = document.getElementById('hsv-value');

    hue_slider.value = hsv[0];
    saturation_slider.value = hsv[1];
    value_slider.value = hsv[2];

    document.getElementById('hsv-hue-input').value = hsv[0];
    document.getElementById('hsv-saturation-input').value = hsv[1];
    document.getElementById('hsv-value-input').value = hsv[2];

    let sat_rgb = RGBToString(HSVToRGB(hsv[0], 100, hsv[2]));
    let val_rgb = RGBToString(HSVToRGB(hsv[0], hsv[1], 100));
    saturation_slider.style.backgroundImage = `linear-gradient(to right, white, ${sat_rgb})`;
    value_slider.style.backgroundImage = `linear-gradient(to right, black, ${val_rgb})`;
}

function updateFromHSL() {
    const h = document.getElementById('hsl-hue').value;
    const s = document.getElementById('hsl-saturation').value;
    const l = document.getElementById('hsl-luminance').value;

    const rgb = HSLToRGB(h, s, l);
    rgba[0] = rgb[0];
    rgba[1] = rgb[1];
    rgba[2] = rgb[2];
}

function correctHSL() {
    const hsl = RGBToHSL(rgba[0], rgba[1], rgba[2]);

    const hue_slider = document.getElementById('hsl-hue');
    const saturation_slider = document.getElementById('hsl-saturation');
    const luminance_slider = document.getElementById('hsl-luminance');

    hue_slider.value = hsl[0];
    saturation_slider.value = hsl[1];
    luminance_slider.value = hsl[2];

    document.getElementById('hsl-hue-input').value = hsl[0];
    document.getElementById('hsl-saturation-input').value = hsl[1];
    document.getElementById('hsl-luminance-input').value = hsl[2];

    let rgb = RGBToString(HSVToRGB(hsl[0], hsl[1], hsl[2]));
    let sat_rgb = RGBToString(HSVToRGB(hsl[0], 100, hsl[2]));
    let lum_rgb = RGBToString(HSVToRGB(hsl[0], hsl[1], 100));
    saturation_slider.style.backgroundImage = `linear-gradient(to right, white, ${sat_rgb})`;
    luminance_slider.style.backgroundImage = `linear-gradient(to right, black, ${lum_rgb}, white)`;
}

function updateFromCMYK() {
    const c = document.getElementById('cmyk-cyan');
    const m = document.getElementById('cmyk-magenta');
    const y = document.getElementById('cmyk-yellow');
    const k = document.getElementById('cmyk-black');

    const rgb = CMYKToRGB(c.value, m.value, y.value, k.value);
    rgba[0] = rgb[0];
    rgba[1] = rgb[1];
    rgba[2] = rgb[2];

}

function correctCMYK() {
    const cmyk = RGBToCMYK(rgba[0], rgba[1], rgba[2]);

    const cyan_slider = document.getElementById('cmyk-cyan');
    const magenta_slider = document.getElementById('cmyk-magenta');
    const yellow_slider = document.getElementById('cmyk-yellow');
    const black_slider = document.getElementById('cmyk-black');

    cyan_slider.value = Math.round(cmyk[0] * 100);
    magenta_slider.value = Math.round(cmyk[1] * 100);
    yellow_slider.value = Math.round(cmyk[2] * 100);
    black_slider.value = Math.round(cmyk[3] * 100);

    document.getElementById('cmyk-cyan-input').value = Math.round(cmyk[0] * 100);
    document.getElementById('cmyk-magenta-input').value = Math.round(cmyk[1] * 100);
    document.getElementById('cmyk-yellow-input').value = Math.round(cmyk[2] * 100);
    document.getElementById('cmyk-black-input').value = Math.round(cmyk[3] * 100);

    let rgb = RGBToString(CMYKToRGB(cmyk[0] * 100, cmyk[1] * 100, cmyk[2] * 100, cmyk[3] * 100));
    let cyan_rgb = RGBToString(CMYKToRGB(100, cmyk[1] * 100, cmyk[2] * 100, cmyk[3] * 100));
    let magenta_rgb = RGBToString(CMYKToRGB(cmyk[0] * 100, 100, cmyk[2] * 100, cmyk[3] * 100));
    let yellow_rgb = RGBToString(CMYKToRGB(cmyk[0] * 100, cmyk[1] * 100, 100, cmyk[3] * 100));
    let black_rgb = RGBToString(CMYKToRGB(cmyk[0] * 100, cmyk[1] * 100, cmyk[2] * 100, 100));

    cyan_slider.style.backgroundImage = `linear-gradient(to right, ${rgb}, ${cyan_rgb})`;
    magenta_slider.style.backgroundImage = `linear-gradient(to right, ${rgb}, ${magenta_rgb})`;
    yellow_slider.style.backgroundImage = `linear-gradient(to right, ${rgb}, ${yellow_rgb})`;
    black_slider.style.backgroundImage = `linear-gradient(to right, ${rgb}, ${black_rgb})`;
}

function updateFromHex() {
    let hex = hex_input.value;
    const is_valid_hex = /#([A-Fa-f0-9]*)$/.test(hex);
    if (!is_valid_hex) {
        hex_input.classList.add('error');
        hex_input.value = hex.slice(0, -1);
        const timerID = setTimeout(() => {
            hex_input.classList.remove('error');
            clearTimeout(timerID);
        }, 300);
    }
    else {
        hex_input.classList.remove('error');
        let rgb = HEXToRGB(hex);
        rgba[0] = rgb[0];
        rgba[1] = rgb[1];
        rgba[2] = rgb[2];
    }
}

function correctHex() {
    hex_input.value = RGBToHex(rgba[0], rgba[1], rgba[2]);
}

function updateFromAlpha() {
    const alpha = document.getElementById('alpha');
    rgba[3] = alpha.value;
}

function correctAlpha() {
    const alpha_slider = document.getElementById('alpha');
    const alpha_input = document.getElementById('alpha-input');
    alpha_slider.value = rgba[3];
    alpha_input.value = rgba[3];
    alpha_slider.style.backgroundImage = `url('icons/checkerboard.png') , linear-gradient(to right, rgba(0,0,0,0), rgba(${rgba[0]},${rgba[1]},${rgba[2]},1))`
}
//CALL INITIALIZE TO SETUP EVERYTHING
initialize();
