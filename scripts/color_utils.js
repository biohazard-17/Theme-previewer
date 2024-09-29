function hexToRGB(hex) {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }
}

function hexToRGBA(hex) {
    let a = hexToRGB(hex);
    return [a[0], a[1], a[2], 1];
}
//hue, saturation, luminosity
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
//hue, saturation, value
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

    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function RGBToHex(r, g, b) {
    return `#${((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1).toUpperCase()}`;
}

function RGBToCMYK(r, g, b) {
    let cyan = 1 - r / 255;
    let magenta = 1 - g / 255;
    let yellow = 1 - b / 255;

    const minCMY = Math.min(cyan, Math.min(magenta, yellow));
    let black = minCMY;
    if (black === 1) {
        return [0, 0, 0, 1];
    }
    cyan = ((cyan - black) / (1 - black)).toFixed(2);
    magenta = ((magenta - black) / (1 - black)).toFixed(2);
    yellow = ((yellow - black) / (1 - black)).toFixed(2);

    return [cyan, magenta, yellow, black];
}

function CMYKToRGB(c, m, y, k) {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;

    const red = 255 * (1 - c) * (1 - k);
    const green = 255 * (1 - m) * (1 - k);
    const blue = 255 * (1 - y) * (1 - k);

    return [red, green, blue]
}

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