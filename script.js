// Function to update color display based on RGB values
function updateColorDisplay() {
    const r = document.getElementById('redSlider').value;
    const g = document.getElementById('greenSlider').value;
    const b = document.getElementById('blueSlider').value;
    const a = document.getElementById('alphaSlider').value / 100;

    // Update the color display box
    const colorDisplay = document.getElementById('colorDisplay');
    colorDisplay.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;

    // Update hex input
    const hexColor = rgbToHex(r, g, b);
    document.getElementById('hexInput').value = hexColor;
}

// Function to convert RGB to Hex
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1).toUpperCase()}`;
}

// Function to update sliders based on hex input
function updateSlidersFromHex(hex) {
    if (/^#[0-9A-F]{6}$/i.test(hex)) { // Validate hex format
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        document.getElementById('redSlider').value = r;
        document.getElementById('greenSlider').value = g;
        document.getElementById('blueSlider').value = b;

        // Update the display
        updateColorDisplay();
    }
}

// Event listeners for sliders
document.getElementById('redSlider').addEventListener('input', updateColorDisplay);
document.getElementById('greenSlider').addEventListener('input', updateColorDisplay);
document.getElementById('blueSlider').addEventListener('input', updateColorDisplay);
document.getElementById('alphaSlider').addEventListener('input', updateColorDisplay);

// Event listener for hex input
document.getElementById('hexInput').addEventListener('change', function() {
    const hexValue = this.value;
    updateSlidersFromHex(hexValue);
});

// Initialize with default values
updateColorDisplay();

const fonts = {
    "fonts": [
        { "name": "Arial", "value": "'Arial', sans-serif" },
        { "name": "Georgia", "value": "'Georgia', serif" },
        { "name": "Courier New", "value": "'Courier New', monospace" },
        { "name": "Times New Roman", "value": "'Times New Roman', serif" },
        { "name": "Verdana", "value": "'Verdana', sans-serif" },
        { "name": "Trebuchet MS", "value": "'Trebuchet MS', sans-serif" },
        { "name": "Impact", "value": "'Impact', sans-serif" },
        { "name": "Comic Sans MS", "value": "'Comic Sans MS', cursive, sans-serif" }
    ]
};

// Function to populate font selectors
function populateFontSelectors() {
    const titleFontSelector = document.getElementById('titleFontSelector');
    const subtitleFontSelector = document.getElementById('subtitleFontSelector');

    // Populate title font selector
    fonts.fonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font.value;
        option.textContent = font.name;
        titleFontSelector.appendChild(option);
    });

    // Populate subtitle font selector
    fonts.fonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font.value;
        option.textContent = font.name;
        subtitleFontSelector.appendChild(option);
    });
}

// Call function to populate fonts on page load
populateFontSelectors();

let activeBox = null;

// Function to handle box clicks
function handleBoxClick(event) {
    const selectedBox = event.target;

    // If there was an active box, remove its active state
    if (activeBox) {
        activeBox.style.border = '1px solid #ccc'; // Reset border
    }

    // Set the clicked box as active
    activeBox = selectedBox;
    activeBox.style.border = '2px solid blue'; // Highlight active box

    // Update color picker values based on the clicked box's background color
    const rgbColor = getComputedStyle(activeBox).backgroundColor;
    const rgbaValues = rgbColor.match(/\d+/g); // Extract RGBA values

    document.getElementById('redSlider').value = rgbaValues[0];
    document.getElementById('greenSlider').value = rgbaValues[1];
    document.getElementById('blueSlider').value = rgbaValues[2];
    
    // Update alpha slider (assuming full opacity)
    document.getElementById('alphaSlider').value = rgbaValues[3] ? (rgbaValues[3] / 255 * 100) : 100;

    // Update color display
    updateColorDisplay();
}

// Function to update color of the active box when sliders change
function updateActiveBoxColor() {
    if (activeBox) {
        const r = document.getElementById('redSlider').value;
        const g = document.getElementById('greenSlider').value;
        const b = document.getElementById('blueSlider').value;
        const a = document.getElementById('alphaSlider').value / 100;

        // Update the background color of the active box
        activeBox.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        
        // Update the color display
        updateColorDisplay();
    }
}

// Add event listeners to each color box
document.querySelectorAll('.color-box').forEach(box => {
    box.addEventListener('click', handleBoxClick);
});

// Event listeners for sliders to update active box color
document.getElementById('redSlider').addEventListener('input', updateActiveBoxColor);
document.getElementById('greenSlider').addEventListener('input', updateActiveBoxColor);
document.getElementById('blueSlider').addEventListener('input', updateActiveBoxColor);
document.getElementById('alphaSlider').addEventListener('input', updateActiveBoxColor);

// Initialize boxes with default colors (optional)
document.getElementById('box1').style.backgroundColor = 'rgba(22, 184, 243, 1)';
document.getElementById('box2').style.backgroundColor = 'rgba(255, 111, 97, 1)';
document.getElementById('box3').style.backgroundColor = 'rgba(97, 255, 111, 1)';
document.getElementById('box4').style.backgroundColor = 'rgba(97, 111, 255, 1)';