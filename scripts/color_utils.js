/**
 * Converts from rgb color to hex color
 * @param {Number} r red component of the color
 * @param {Number} g green component of the color
 * @param {Number} b blue component of the color
 * @returns {String} hexadecimal encoded rgb color as: #RRGGBB
 */
function RGBToHex(r, g, b) {
    return `#${((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1).toUpperCase()}`;
    //#RRGGBB
}

/**
 * Converts from rgb color to hsv color
 * @param {Number} r red component of the color
 * @param {Number} g green component of the color
 * @param {Number} b blue component of the color
 * @returns {Number[]} HSV encoded rgb color as: [h, s, v]
 */
function RGBToHSV(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, Math.max(g, b));
    const min = Math.min(r, Math.min(g, b));
    const d = max - min;
    let h, s, v = max;
    if (max === min) {
        h = s = 0;
    }
    else {
        s = d / max;
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];//[h, s, v]
}

/**
 * Converts from rgb color to hsl color
 * @param {Number} r red component of the color
 * @param {Number} g green component of the color
 * @param {Number} b blue component of the color
 * @returns {Number[]} HSL encoded rgb color as: [h, s, l]
 */
function RGBToHSL(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, Math.max(g, b));
    const min = Math.min(r, Math.min(g, b));
    let h, s, l = (max + min) / 2;
    const d = max - min;
    if (max === min) {
        h = s = 0;
    }
    else {
        s = l > 0.5 ? d / (2 - max - min) : d / (max - min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Converts from rgb color to cmyk color
 * @param {Number} r red component of the color
 * @param {Number} g green component of the color
 * @param {Number} b blue component of the color
 * @returns {Number[]} CMYK encoded rgb color as: [c, m, y, k]
 */
function RGBToCMYK(r, g, b) {
    let cyan = 1 - r / 255;
    let magenta = 1 - g / 255;
    let yellow = 1 - b / 255;
    const minCMY = Math.min(cyan, Math.min(magenta, yellow));
    let black = minCMY;
    if (black === 1) {
        return [0, 0, 0, 1];
    }
    cyan = parseFloat(((cyan - black) / (1 - black)).toFixed(2));
    magenta = parseFloat(((magenta - black) / (1 - black)).toFixed(2));
    yellow = parseFloat(((yellow - black) / (1 - black)).toFixed(2));
    black = parseFloat(black.toFixed(2));
    return [cyan, magenta, yellow, black];
}

/**
 * Converts from hex color to rgb color
 * @param {String} hex 
 * @returns {Number[]} returns rgb color from hex as: [r, g, b]
 */
function HEXToRGB(hex) {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }
}

/**
 * Converts from hex color to rgba color, it returns 1 in the alfa channel by default.
 * It calls HEXToRGB to get the red, green and blue components
 * @param {String} hex 
 * @returns {Number[]} returns rgb color from hex as: [r, g, b, a]
 */
function HEXToRGBA(hex) {
    let a = HEXToRGB(hex);
    return [a[0], a[1], a[2], 1];
}

/**
 * Converts from hsv color to rgb color
 * @param {number} h hue component
 * @param {number} s saturation component
 * @param {number} v value component
 * @returns {number[]} rgb encoded hsv color as: [r, g, b]
 */
function HSVToRGB(h, s, v) {
    s /= 100;
    v /= 100;
    let r, g, b;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts from hsl color to rgb color
 * @param {number} h hue component
 * @param {number} s saturation component
 * @param {number} l luminance component
 * @returns {number[]} rgb encoded hsl color as: [r, g, b]
 */
function HSLToRGB(h, s, l) {
    h %= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        r = hueToRgb(p, q, h / 360 + 1 / 3);
        g = hueToRgb(p, q, h / 360);
        b = hueToRgb(p, q, h / 360 - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts from cmyk color to rgb color
 * @param {number} c cyan component
 * @param {number} m magenta component
 * @param {number} y yellow component
 * @param {number} k black component
 * @returns {number[]} rgb encoded cmyk color as: [r, g, b]
 */
function CMYKToRGB(c, m, y, k) {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;
    const red = parseInt(255 * (1 - c) * (1 - k));
    const green = parseInt(255 * (1 - m) * (1 - k));
    const blue = parseInt(255 * (1 - y) * (1 - k));
    return [red, green, blue]
}

function RGBToString(rgb){
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}
function RGBAToString(rgba){
    return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`
}

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
        return HEXToRGBA(color);
    } else if (color.startsWith('rgb')) {
        // RGB or RGBA format
        if (color.startsWith('rgba')) {
            return rgbaToArray(color);
        } else {
            return rgbToRgba(color);
        }
    }

}