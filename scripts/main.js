//Tabs widget
const tabs = document.querySelectorAll('.tab-btn');
const content_boxes = document.querySelectorAll('.content');
tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        tabs.forEach(tab => tab.classList.remove('active'));
        tab.classList.add('active');
        content_boxes.forEach(content => content.classList.remove('active'));
        content_boxes[index].classList.add('active')
    })
})

//Global variable to store red, green, blue and alpha values across tabs
const _sliders = document.querySelectorAll('._slider');
const _spinners = document.querySelectorAll('._spinner');
let rgba = new Proxy([125, 5, 200, 1], {
    set(target, property, value) {
        target[property] = value;
        updateColorDisplay();
        return true;
    }
});

//Sliders and spinners
function handleInputChange(target) {
    const min = target.min;
    const max = target.max;
    const val = target.value;
    let percentage = (val - min) * 100 / (max - min);
    if (target.classList.contains('_slider')) {
        target.style.backgroundSize = percentage + '% 100%';
    }
    else if (target.classList.contains('_spinner')) {
        const slider = document.querySelector(`#${target.id.replace('-input', '')}`);
        slider.style.backgroundSize = percentage + '% 100%';
    }
}

//Update color display
function updateColorDisplay() {
    const colorDisplay = document.getElementById('color-display');
    colorDisplay.style.backgroundColor = `rgba(${rgba[0]},${rgba[1]},${rgba[2]}, ${rgba[3]})`;
    correctRGB();
    correctHSV();
    correctHSL();
    correctCMYK();
    correctHex();
    correctAlpha();
}

function initialize() {
    updateColorDisplay();
    const values = [..._sliders, ..._spinners];
    values.forEach((s) => {
        handleInputChange(s);
    });
}
//SECTION TO UPDATE GLOBAL COLOR FROM RESPECTIVE FORMAT
function updateFromRGB() {
    let r = document.getElementById('red').value;
    let g = document.getElementById('green').value;
    let b = document.getElementById('blue').value;
    rgba[0] = r;
    rgba[1] = g;
    rgba[2] = b;
}

function updateFromHSV() {
    let h = document.getElementById('hsv-hue').value;
    let s = document.getElementById('hsv-saturation').value;
    let v = document.getElementById('hsv-value').value;
    const rgb = HSVToRGB(h, s, v);
    rgba[0] = rgb[0];
    rgba[1] = rgb[1];
    rgba[2] = rgb[2];

}
function updateFromHSL() {
    let h = document.getElementById('hsl-hue').value;
    let s = document.getElementById('hsl-saturation').value;
    let l = document.getElementById('hsl-luminosity').value;
    const rgb = HSLToRGB(h, s, l);
    rgba[0] = rgb[0];
    rgba[1] = rgb[1];
    rgba[2] = rgb[2];
}

function updateFromCMYK() {
    let c = document.getElementById('cyan').value;
    let m = document.getElementById('magenta').value;
    let y = document.getElementById('yellow').value;
    let k = document.getElementById('black').value;
    const rgb = CMYKToRGB(c, m, y, k);
    rgba[0] = rgb[0];
    rgba[1] = rgb[1];
    rgba[2] = rgb[2];
}

function updateFromHEX() {
    let hex = document.getElementById('hex-input').value;
    console.log(hex);
    const rgb = hexToRGB(hex);
    console.log(rgb);
    rgba[0] = rgb[0];
    rgba[1] = rgb[1];
    rgba[2] = rgb[2];
}

function updateFromAlpha() {
    rgba[3] = document.getElementById('alpha').value;
}
//SECTION TO FIX SLIDERS AND VALUES FROM GLOBAL COLOR
function correctRGB() {
    document.getElementById('red').value = Math.round(rgba[0]).toFixed(0);
    document.getElementById('green').value = Math.round(rgba[1]).toFixed(0);
    document.getElementById('blue').value = Math.round(rgba[2]).toFixed(0);
    document.getElementById('red-input').value = Math.round(rgba[0]).toFixed(0);
    document.getElementById('green-input').value = Math.round(rgba[1]).toFixed(0);
    document.getElementById('blue-input').value = Math.round(rgba[2]).toFixed(0);
}

function correctHSV() {
    const hsv = RGBToHSV(rgba[0], rgba[1], rgba[2]);
    document.getElementById('hsv-hue').value = hsv[0];
    document.getElementById('hsv-saturation').value = hsv[1];
    document.getElementById('hsv-value').value = hsv[2];
    document.getElementById('hsv-hue-input').value = hsv[0];
    document.getElementById('hsv-saturation-input').value = hsv[1];
    document.getElementById('hsv-value-input').value = hsv[2];
}

function correctHSL() {
    const hsl = RGBToHSL(rgba[0], rgba[1], rgba[2]);
    document.getElementById('hsl-hue').value = hsl[0];
    document.getElementById('hsl-saturation').value = hsl[1];
    document.getElementById('hsl-luminosity').value = hsl[2];
    document.getElementById('hsl-hue-input').value = hsl[0];
    document.getElementById('hsl-saturation-input').value = hsl[1];
    document.getElementById('hsl-luminosity-input').value = hsl[2];
}

function correctCMYK() {
    const cmyk = RGBToCMYK(rgba[0], rgba[1], rgba[2]);
    document.getElementById('cyan').value = Math.round(cmyk[0] * 100);
    document.getElementById('magenta').value = Math.round(cmyk[1] * 100);
    document.getElementById('yellow').value = Math.round(cmyk[2] * 100);
    document.getElementById('black').value = Math.round(cmyk[3] * 100);
    document.getElementById('cyan-input').value = Math.round(cmyk[0] * 100);
    document.getElementById('magenta-input').value = Math.round(cmyk[1] * 100);
    document.getElementById('yellow-input').value = Math.round(cmyk[2] * 100);
    document.getElementById('black-input').value = Math.round(cmyk[3] * 100);
}

function correctHex() {
    document.getElementById('hex-input').value = RGBToHex(rgba[0], rgba[1], rgba[2]);
}

function correctAlpha() {
    document.getElementById('alpha').value = rgba[3];
    document.getElementById('alpha-input').value = rgba[3];
}

/**
 * EVENT LISTENERS FOR SLIDERS AND SPINNERS
 * CLASSES
 * rgb for rgb items
 * hsv for hsv items
 * hsl for hsl items
 * hex for hex item
 * cmyk for cmyk items
 * alpha for alpha items
*/
_sliders.forEach(slider => {
    slider.addEventListener('input', () => {
        document.querySelector(`#${slider.id}-input`).value = parseInt(slider.value);
        if (slider.classList.contains('rgb')) {
            updateFromRGB();
        }
        else if (slider.classList.contains('hsv')) {
            updateFromHSV();
        }
        else if (slider.classList.contains('hsl')) {
            updateFromHSL();
        }
        else if (slider.classList.contains('cmyk')) {
            updateFromCMYK();
        }
        else if (slider.classList.contains('alpha')) {
            updateFromAlpha();
        }
        handleInputChange(slider);
        _sliders.forEach((s) => {
            handleInputChange(s);
        });
    });
});
_spinners.forEach(spinner => {
    spinner.addEventListener('input', () => {
        document.querySelector(`#${spinner.id.replace('-input', '')}`).value = parseInt(spinner.value);
        if (spinner.classList.contains('rgb')) {
            updateFromRGB();
        }
        else if (spinner.classList.contains('hsv')) {
            updateFromHSV();
        }
        else if (spinner.classList.contains('hsl')) {
            updateFromHSL();
        }
        else if (spinner.classList.contains('cmyk')) {
            updateFromCMYK();
        }
        else if (spinner.classList.contains('alpha')) {
            updateFromAlpha();
        }
        handleInputChange(spinner);
        _spinners.forEach((s) => {
            handleInputChange(s);
        });
    });
});

document.getElementById('hex-input').addEventListener('input', () => {
    updateFromHEX();
});

//call initialize to start process
initialize();
