const urlPattern = /https:\/\/play.google.com\/store\/apps\/details\?id=([a-zA-Z0-9.]+)&hl=en_.*$/;
const idPattern = /id=([a-zA-Z0-9.]+)&/;

function verifyUrl(url) {
    return urlPattern.test(url);
}

function extractId(url) {
    const match = url.match(idPattern);
    return match ? match[1] : null;
}

document.getElementById('urlInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        pasteUrl();
    }
});

function animateInputField() {
    var inputElement = document.querySelector('.futuristic-input');
    inputElement.style.marginTop = '-5px'; // Adjust the desired distance
    inputElement.style.transition = 'margin-top 0.5s ease'; // Adding transition for margin-top
}

function pasteUrl() {
    var urlInput = document.getElementById('urlInput').value;
    var is_id = verifyUrl(urlInput);
    console.log("Is google id: ", is_id);
    if (is_id) {
        var appId = extractId(urlInput);

        console.log('Extracted ID:', appId);

        // Make HTTP request to the specified endpoint with the extracted app ID
        fetch(`http://0.0.0.0:7001/app_data/?app_id=${encodeURIComponent(appId)}`)
            .then(response => response.json())
            .then(data => {
                // Process the data received from the endpoint
                console.log('Response from endpoint:', data);

                // Display app information and animate input field
                displayAppInfo(data);
                animateInputField();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        displayErrorMessage("URL must contain app id and come from the English version of the site");
    }
}

function displayAppInfo(data) {
    // Dynamically update the 'appInfo' div with the app information
    var appInfoElement = document.getElementById('appInfo');

    // Create elements to display title and reviews
    var titleElement = document.createElement('h2');
    titleElement.textContent = data.title;

    var reviewsElement = document.createElement('p');
    reviewsElement.textContent = `Reviews: ${data.reviews}`;

    // Create an image element for the icon
    var iconElement = document.createElement('img');
    iconElement.src = data.icon;
    iconElement.alt = 'App Icon';

    // Append elements to the 'appInfo' element
    appInfoElement.innerHTML = ''; // Clear previous content
    appInfoElement.appendChild(iconElement);
    appInfoElement.appendChild(titleElement);
    appInfoElement.appendChild(reviewsElement);
}
