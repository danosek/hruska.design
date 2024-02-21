var htmlElement = document.querySelector('html');

// Add event listener for click
htmlElement.addEventListener('dblclick', function () {
    // Get the current data-theme value
    var currentTheme = htmlElement.getAttribute('data-theme');

    // Toggle data-theme between "light" and "dark"
    var newTheme = (currentTheme === 'light' || !currentTheme) ? 'dark' : 'light';

    // Set the new data-theme value
    htmlElement.setAttribute('data-theme', newTheme);
});