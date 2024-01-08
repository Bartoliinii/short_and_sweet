import matplotlib.pyplot as plt
import requests
import pandas as pd
import time

df = pd.read_csv('reddit.csv')
reviews = df['0'].tolist()

endpoint = ""

counter = []
for i in range(1400, len(reviews) + 1, 200):
    s = []
    for _ in range(3):
        print(len(reviews[:i]))
        start = time.time()
        response = requests.post('{}/inference'.format(endpoint),
                                 json={'reviews': reviews[:i]},
                                 timeout=700)
        end = time.time() - start
        s.append(end)
    counter.append({i: sum(s) / 3})

x = [list(c.keys())[0] for c in counter]
y = [list(c.values())[0] for c in counter]
plt.figure(figsize=(10, 6))
plt.plot(x, y)
plt.xlabel('number of reviews')
plt.ylabel('time [s]')
plt.title('Time of inference given amount of reviews')
plt.show()