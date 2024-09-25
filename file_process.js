// file_process.js

// Function to save theme settings
function saveTheme() {
    const titleFont = document.getElementById('titleFontSelector').value;
    const subtitleFont = document.getElementById('subtitleFontSelector').value;
    const primaryColorBox = document.getElementById('box1');
    const primaryColorRgb = getComputedStyle(primaryColorBox).backgroundColor.match(/\d+/g);
    const backgroundColorBox = document.getElementById('box2');
    const backgroundColorRgb = getComputedStyle(backgroundColorBox).backgroundColor.match(/\d+/g);
    const accentColorBox = document.getElementById('box3');
    const accentColorRgb = getComputedStyle(accentColorBox).backgroundColor.match(/\d+/g);
    const textOWColorBox = document.getElementById('box4');
    const textOWColorRgb = getComputedStyle(textOWColorBox).backgroundColor.match(/\d+/g);
    const textOBColorBox = document.getElementById('box5');
    const textOBColorRgb = getComputedStyle(textOBColorBox).backgroundColor.match(/\d+/g);
    const themeData = {
        title: titleFont,
        subTitle: subtitleFont,
        primary: {
            source: 'primary',
            hsl: rgbToHsl(...primaryColorRgb),
            hsv: rgbToHsv(...primaryColorRgb),
            hex: rgbToHex(...primaryColorRgb),
            rgba: `rgba(${primaryColorRgb[0]}, ${primaryColorRgb[1]}, ${primaryColorRgb[2]}, 1)`
        },
        background: {
            source: 'box2',
            hsl: rgbToHsl(...backgroundColorRgb),
            hsv: rgbToHsv(...backgroundColorRgb),
            hex: rgbToHex(...backgroundColorRgb),
            rgba: `rgba(${backgroundColorRgb[0]}, ${backgroundColorRgb[1]}, ${backgroundColorRgb[2]}, 1)`
        },
        accent: {
            source: 'box3',
            hsl: rgbToHsl(...accentColorRgb),
            hsv: rgbToHsv(...accentColorRgb),
            hex: rgbToHex(...accentColorRgb),
            rgba: `rgba(${accentColorRgb[0]}, ${accentColorRgb[1]}, ${accentColorRgb[2]}, 1)`
        },
        textOnWhite: {
            source: 'box4',
            hsl: rgbToHsl(...textOWColorRgb),
            hsv: rgbToHsv(...textOWColorRgb),
            hex: rgbToHex(...textOWColorRgb),
            rgba: `rgba(${textOWColorRgb[0]}, ${textOWColorRgb[1]}, ${textOWColorRgb[2]}, 1)`
        },
        textOnBlack: {
            source: 'box5',
            hsl: rgbToHsl(...textOBColorRgb),
            hsv: rgbToHsv(...textOBColorRgb),
            hex: rgbToHex(...textOBColorRgb),
            rgba: `rgba(${textOBColorRgb[0]}, ${textOBColorRgb[1]}, ${textOBColorRgb[2]}, 1)`
        }
    };
    // Convert themeData to JSON and save it in local storage or download as a file
    const jsonThemeData = JSON.stringify(themeData);
    // Download as a file
    const blob = new Blob([jsonThemeData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "theme-settings.json";
    document.body.appendChild(a);
    a.click();
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
// Function to load theme settings from a JSON file
function loadThemeFromFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const jsonData = event.target.result;
        try {
            const themeData = JSON.parse(jsonData);
            // Set font selectors
            document.getElementById('titleFontSelector').value = themeData.title;
            document.getElementById('subtitleFontSelector').value = themeData.subTitle;
            // Update boxes based on saved colors
            document.getElementById('box1').style.backgroundColor = themeData.primary.rgba; // Primary Color
            document.getElementById('box2').style.backgroundColor = themeData.background.rgba; // Background Color
            document.getElementById('box3').style.backgroundColor = themeData.accent.rgba; // Accent Color
            document.getElementById('box4').style.backgroundColor = themeData.textOnWhite.rgba; // Text on White Color
            document.getElementById('box5').style.backgroundColor = themeData.textOnBlack.rgba; // Text on Black Color
            // Update sliders based on primary color box
            const primaryRgbValues = themeData.primary.rgba.match(/\d+/g).slice(0, 3); // Get RGB values from RGBA string
            document.getElementById('redSlider').value = primaryRgbValues[0];
            document.getElementById('greenSlider').value = primaryRgbValues[1];
            document.getElementById('blueSlider').value = primaryRgbValues[2];
            updateThemeDisplay(); // Update display with loaded values.
        } catch (error) {
            alert("Error loading theme: " + error.message);
        }
    };
    reader.readAsText(file); // Read the uploaded file
}