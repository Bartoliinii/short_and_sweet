import nltk
from typing import List, Callable
import re


class Operations():
    def __init__(self) -> None:
        self.punctuation_signs = ['.', ',', '!', '?', ':',
                                  ';', '(', ')', '[', ']',
                                  '{', '}', '...', '--']
        self.sw = set(nltk.corpus.stopwords.words('english'))
        self.lemmatizer = nltk.stem.WordNetLemmatizer()

    def lowercase(self, x: List[str]) -> List[str]:
        return [sentence.lower() for sentence in x]

    def punctuation(self, x: List[str]) -> List[str]:
        pattern = r'|'.join(re.escape(char)
                            for char in self.punctuation_signs)
        return [re.sub(pattern, '', sentence) for sentence in x]

    def numbers(self, x: List[str]) -> List[str]:
        return [re.sub(r'\d+', '', sentence) for sentence in x]

    def stop_words(self, x: List[str]) -> List[str]:
        return [' '.join([word for word in sentence.split()
                          if word not in self.sw])
                for sentence in x]

    def lemma(self, x: List[str]) -> List[str]:
        return [' '.join([self.lemmatizer.lemmatize(word)
                          for word in sentence.split()])
                for sentence in x]


class Pipeline():
    def __init__(self, pipeline: List[Callable]) -> None:
        self.pipeline = pipeline

    def __call__(self, x: List[str]) -> List[str]:
        for method in self.pipeline:
            x = method(x)
        return x