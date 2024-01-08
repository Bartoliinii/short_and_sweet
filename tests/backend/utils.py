from scrape import preprocess_reviews, validate_url, extract_app_id


def test_preprocess_reviews():
    assert preprocess_reviews("This is a review... with some weird *** characters!!!") == "This is a review, with some weird characters!"
    assert preprocess_reviews("Good review😿") == "Good review"

def test_validate_url():
    assert validate_url("https://play.google.com/store/apps/details?id=com.google.android.apps.walletnfcrel&hl=en") == True
    assert validate_url("https://play.google.com/store/apps/details?id=com.g5e.twilight.land.hidden.object.android&hl=en_US&gl=US") == True
    assert validate_url("https://play.google.com/store/apps/details?id=com.ubisoft.rainbowsixmobile.r6.fps.pvp.shooter&hl=en_US&gl=UShttps://play.google.com/store/apps/details?id=com.livehindinewstvapp&hl=pl&gl=US") == False
    assert validate_url("https://play.google.com/store/apps") == False
    assert validate_url("https://play.google.com/store/apps/details") == False

def test_extract_app_id():
    assert extract_app_id("https://play.google.com/store/apps/details?id=com.google.android.apps.walletnfcrel&hl=en") == "com.google.android.apps.walletnfcrel"
    assert extract_app_id("https://play.google.com/store/apps") == None
