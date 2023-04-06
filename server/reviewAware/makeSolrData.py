# -*- coding: utf-8 -*-
# 1. json file load
# 2. input query
# 3. 상품 리뷰와 query 간의 cosine similarity 구하기
# 4. 특정 threshold 이상일 때 제품에 점수 추가
# 5. 가장 높은 점수 제품을 출력 OR 제품 별 등수 출력

from sentence_transformers import SentenceTransformer
import json
import pandas as pd
model = SentenceTransformer('jhgan/ko-sbert-multitask')

# json file load
with open('data/laptop.json', 'r', encoding='utf-8') as f:
    file_data = json.load(f)
# with open('data/keyboard.json', 'r', encoding='utf-8') as f:
#     file_data = json.load(f)
# with open('data/monitor.json', 'r', encoding='utf-8') as f:
#     file_data = json.load(f)
# with open('data/mouse.json', 'r', encoding='utf-8') as f:
#     file_data = json.load(f)

file_df = pd.DataFrame(file_data)
file_df = file_df.drop([file_df.columns[1], file_df.columns[2], file_df.columns[4]], axis=1)
new_content = {'reviews': []}
for content in file_df['content']:
    for score in content:
        if score['score'] == 5:  # 5점 1점 이외에 리뷰는 무시 한다.
            reviews = score['reviews']
            new_content['reviews'].append(reviews)
file_new_content = pd.DataFrame(new_content, columns=['reviews'])
file_df = file_df.drop([file_df.columns[1]], axis=1)
file_df['reviews'] = file_new_content
new_json = []
product = 0

for idx in range(len(file_df)):
    data = file_df.iloc[idx]
    product_name = data['name']
    print(product_name)
    index = 0
    for reviews in data['reviews']:
        for sentence in reviews['sentences']:
            # print(sentence)
            if len(sentence) < 2:
                continue
            sentence_embeddings = model.encode(sentence)  # 임베딩 벡터을 얻는다.
            new_json.append({"product_id": product, 'vector_id': index, 'sentence': sentence,
                            'vector': sentence_embeddings.tolist()})
            index += 1
    product += 1

with open('data/laptop_embedding.json', 'w', encoding='utf-8') as out:
    json.dump(new_json, out, indent=4, ensure_ascii=False)

# with open('data/keyboard_embedding.json', 'w', encoding='utf-8') as out:
#     json.dump(new_json, out, indent=4, ensure_ascii=False)

# with open('data/monitor_embedding.json', 'w', encoding='utf-8') as out:
#     json.dump(new_json, out, indent=4, ensure_ascii=False)
#
# with open('data/mouse_embedding.json', 'w', encoding='utf-8') as out:
#     json.dump(new_json, out, indent=4, ensure_ascii=False)

