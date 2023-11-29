const urlPattern = /https:\/\/play.google.com\/store\/apps\/details\?id=([a-zA-Z0-9.]+)&hl=en_.*$/;
const idPattern = /id=([a-zA-Z0-9.]+)&/;
const apiUrl = 'http://0.0.0.0:7001/app_data/';

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

function displayErrorMessage(message) {
    // Create a div for the error message
    var errorMessageElement = document.createElement('div');
    errorMessageElement.textContent = message;
    errorMessageElement.className = 'error-message';

    // Append the error message div to the body
    document.body.appendChild(errorMessageElement);

    // Remove the error message after a certain duration (e.g., 5 seconds)
    setTimeout(function () {
        errorMessageElement.remove();
    }, 5000);
}

function pasteUrl() {
    var urlInput = document.getElementById('urlInput').value;
    if (verifyUrl(urlInput)) {
        encodedAppId = encodeURIComponent(extractId(urlInput));
        fetch(`${apiUrl}?app_id=${encodedAppId}`)
            .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();

                switch (response.status) {
                    case 403:
                        displayErrorMessage(errorData.detail);
                        break;
                    case 404:
                        displayErrorMessage('Not found, check the URL and endpoints');
                        break;
                    default:
                        console.log(response);
                        displayErrorMessage(errorData.detail);
                }
                console.error(`Error: ${errorData.detail}`);
            } else {
                const appData = await response.json();
                displayAppInfo(appData);
            }
            })
            .catch((error) => {
            console.error('Request failed:', error);
            });

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

    // Move the input field to the top
    document.querySelector('.inputField').classList.add('moveUp');
}

document.getElementById('urlInput').addEventListener('focus', function () {
    // Move the input field back to the center when it's focused
    document.querySelector('.inputField').classList.remove('moveUp');
});
