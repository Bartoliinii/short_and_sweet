from bertopic import BERTopic
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import CountVectorizer
from hdbscan import HDBSCAN


sentence_model = SentenceTransformer('all-mpnet-base-v2')
vectorizer_model = CountVectorizer(stop_words="english",
                                   ngram_range=(1, 3),
                                   min_df=3)

hdbscan_model = HDBSCAN(min_cluster_size=10,
                        metric='euclidean',
                        cluster_selection_method='eom',
                        prediction_data=True)

model = BERTopic(
    embedding_model=sentence_model,
    vectorizer_model=vectorizer_model,
    hdbscan_model=hdbscan_model,
    nr_topics=10)
