import requests

BASE_URL = "http://localhost:7001"

def test_app_data_correct_data():
    url = f'{BASE_URL}/app_data/'
    urls = ['https://play.google.com/store/apps/details?id=com.google.android.apps.maps&hl=en',
            'https://play.google.com/store/apps/details?id=com.google.android.apps.youtube.kids&hl=en',
            'https://play.google.com/store/apps/details?id=com.google.android.apps.walletnfcrel&hl=en']
    
    stars = [3, 4, 5]
    counts = [1400, 1500, 2000]
    for i in range(len(urls)):
        params = {"url": urls[i], "stars": stars[i], "count": counts[i]}
        response = requests.get(url, params=params)
        assert response.status_code == 200


def test_healthcheck():
    url = f'{BASE_URL}/healthcheck/'
    response = requests.get(url)
    assert response.status_code == 200
    assert response.text == '"OK"'

def test_app_data_bad_url():
    url = f'{BASE_URL}/app_data/'
    bad_urls = ['https://play.google.com/store/apps/details?id=com.google.android.apps.maps',
                'https://play.google.com/store/apps/details?id=com.google.android.apps.youtube.kids',
                'https://play.google.com/store/apps/details?id=com.google.android.apps.walletnfcrel']
    
    for bad_url in bad_urls:
        params = {"url": bad_url, "stars": 4, "count": 1500}
        response = requests.get(url, params=params)
        assert response.status_code != 200

def test_app_data_bad_stars(): # helped me set up the star test
    url = f'{BASE_URL}/app_data/'
    bad_stars = [0, 6, -1]

    for bad_star in bad_stars:
        params = {"url": "https://play.google.com/store/apps/details?id=com.google.android.apps.maps&hl=en", 
                  "stars": bad_star, "count": 1500}
        response = requests.get(url, params=params)
        assert response.status_code != 200

def test_app_data_bad_count():
    url = f'{BASE_URL}/app_data/'
    bad_counts = [1399, 3001, 5000]

    for bad_count in bad_counts:
        params = {"url": "https://play.google.com/store/apps/details?id=com.google.android.apps.maps&hl=en", 
                  "stars": 4, "count": bad_count}
        response = requests.get(url, params=params)
        assert response.status_code != 200
