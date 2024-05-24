var htmlElement = document.querySelector('html');

// Create the radio buttons and wrapper div
var wrapperDiv = document.createElement('div');
wrapperDiv.style.position = 'fixed';
wrapperDiv.style.top = '16px';
wrapperDiv.style.right = '16px';
wrapperDiv.style.display = 'flex';
wrapperDiv.style.gap = '4px';
wrapperDiv.style.backgroundColor = 'var(--surface-front, white)';
wrapperDiv.style.padding = 'var(--base-2)';
wrapperDiv.style.borderRadius = 'var(--radius-circle)';
wrapperDiv.style.border = '1px solid var(--border-shiny)';
wrapperDiv.style.boxShadow = 'var(--elevation)';

var lightLabel = document.createElement('label');
lightLabel.textContent = 'Light';
lightLabel.style.marginInlineEnd = '8px';
var lightRadio = document.createElement('input');
lightRadio.type = 'radio';
lightRadio.name = 'theme';
lightRadio.value = 'light';
lightRadio.id = 'light-theme';

var darkLabel = document.createElement('label');
darkLabel.textContent = 'Dark';
var darkRadio = document.createElement('input');
darkRadio.type = 'radio';
darkRadio.name = 'theme';
darkRadio.value = 'dark';
darkRadio.id = 'dark-theme';

lightLabel.setAttribute('for', 'light-theme');
darkLabel.setAttribute('for', 'dark-theme');

wrapperDiv.appendChild(lightRadio);
wrapperDiv.appendChild(lightLabel);
wrapperDiv.appendChild(darkRadio);
wrapperDiv.appendChild(darkLabel);

document.body.appendChild(wrapperDiv);

// Function to set theme based on radio button selection
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
}

// Event listeners for radio buttons
lightRadio.addEventListener('change', function () {
    if (this.checked) {
        setTheme('light');
    }
});

darkRadio.addEventListener('change', function () {
    if (this.checked) {
        setTheme('dark');
    }
});

// Initialize the radio buttons based on current theme
var currentTheme = htmlElement.getAttribute('data-theme');
if (currentTheme === 'dark') {
    darkRadio.checked = true;
} else {
    lightRadio.checked = true;
}

// Add CSS styles for the themes
var style = document.createElement('style');
style.innerHTML = `
    [data-theme="light"] {
        background-color: white;
        color: black;
    }
    [data-theme="dark"] {
        background-color: black;
        color: white;
    }
`;
document.head.appendChild(style);
