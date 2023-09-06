import nltk
from typing import List, Callable
import re


class Preprocessor():
    def __init__(self) -> None:
        self.punctuation_signs = special_signs = ['.', ',', '!', '?', ':', ';',
                                            '(', ')', '[', ']', '{', '}',
                                            '"', "'", '``', "''", '`', '...',
                                            '--']
        self.stop_words = set(nltk.corpus.stopwords.words('english'))
        self.lemmatizer = nltk.stem.WordNetLemmatizer()

    def flowercase(self, x: List[str]) -> List[str]:
        return [sentence.lower() for sentence in x]

    def fpunctuation(self, x: List[str],
                    special_signs: List[str] = None) -> List[str]:
        if special_signs:
            chars = special_signs + self.punctuation_signs
        else:
            chars = self.punctuation_signs
        pattern = r'|'.join(re.escape(char) for char in chars)
        return [re.sub(pattern, '', sentence) for sentence in x]

    def fnumbers(self, x: List[str]) -> List[str]:
        return [re.sub(r'\d+', '', sentence) for sentence in x]

    def fstop_words(self, x: List[str]) -> List[str]:
        return [' '.join([word for word in sentence.split()
                          if word not in self.stop_words])
                for sentence in x]

    def flemmatize(self, x: List[str]) -> List[str]:
        return [' '.join([self.lemmatizer.lemmatize(word)
                          for word in sentence.split()])
                for sentence in x]

    def fpreprocess(self, x: List[str],
                   methods: List[Callable]) -> List[str]:
        for i, method in enumerate(methods):
            x = method(x)
        return x