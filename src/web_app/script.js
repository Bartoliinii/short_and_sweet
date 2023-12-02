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

document.getElementById('urlInput').addEventListener('focus', function (event) {
    hideAppInfo();
});

function animateInputField() {
    var inputElement = document.querySelector('.futuristic-input');
    inputElement.style.marginTop = '-5px';
    inputElement.style.transition = 'margin-top 0.5s ease';
}

function displayErrorMessage(message) {
    var errorMessageElement = document.createElement('div');
    errorMessageElement.textContent = message;
    errorMessageElement.className = 'error-message';
    document.body.appendChild(errorMessageElement);
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

function hideAppInfo() {
    var appInfoElement = document.getElementById('appInfo');
    appInfoElement.innerHTML = '';  // Removes all child elements
    document.querySelector('.inputField').classList.remove('moveUp');
}

function displayAppInfo(data) {

    var appInfoElement = document.getElementById('appInfo');


    var titleElement = document.createElement('h2');
    titleElement.textContent = data.title;

    var reviewsElement = document.createElement('p');
    reviewsElement.textContent = `Reviews: ${data.reviews}`;


    var iconElement = document.createElement('img');
    iconElement.src = data.icon;
    iconElement.alt = 'App Icon';
    var median_colour = getMedianColor(data.icon);
    console.log(median_colour);


    appInfoElement.innerHTML = '';
    appInfoElement.appendChild(iconElement);
    appInfoElement.appendChild(titleElement);
    appInfoElement.appendChild(reviewsElement);


    document.querySelector('.inputField').classList.add('moveUp');
}

document.getElementById('urlInput').addEventListener('focus', function () {
    document.querySelector('.inputField').classList.remove('moveUp');
});


function calculateAverage(values) {
    var sum = values.reduce(function (a, b) {
      return a + b;
    });
    var avg = sum / values.length;
    return avg;
};

function getMedianColor(imageUrl) {
    var img = new Image();
    img.crossOrigin = 'anonymous'; // Enable cross-origin resource sharing

    img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);

        var imageData = ctx.getImageData(0, 0, img.width, img.height);
        var data = imageData.data;

        var redValues = [];
        var greenValues = [];
        var blueValues = [];

        // Loop through pixel data and store RGB values
        for (var i = 0; i < data.length; i += 4) {
        redValues.push(data[i]);
        greenValues.push(data[i + 1]);
        blueValues.push(data[i + 2]);
        }

        // Calculate median RGB values
        var medianRed = calculateAverage(redValues);
        var medianGreen = calculateAverage(greenValues);
        var medianBlue = calculateAverage(blueValues);

        // Display the median color
        var resultColor = `rgb(${medianRed.toFixed(0)}, ${medianGreen.toFixed(0)}, ${medianBlue.toFixed(0)})`;
        console.log('Median Color:', resultColor);

        getMedianColor('your_image_url_here', function(resultColor) {
            setGradientBackground(resultColor);
        });
    };

    function setGradientBackground(averageColor) {
        var body = document.body;
        body.style.background = `linear-gradient(to bottom, ${averageColor} 20%, rgb(255, 253, 247) 20%)`;
        body.style.backgroundSize = '100% 100%';
    }

    img.src = imageUrl;
};