# -*- coding: utf-8 -*-
# 1. json file load
# 2. input query
# 3. 상품 리뷰와 query 간의 cosine similarity 구하기
# 4. 특정 threshold 이상일 때 제품에 점수 추가
# 5. 가장 높은 점수 제품을 출력 OR 제품 별 등수 출력

from sentence_transformers import SentenceTransformer
import json

model = SentenceTransformer('jhgan/ko-sbert-multitask')

keyboardFilename = 'keyboard'
laptopFilename = 'laptop'
monitorFilename = 'monitor'
mouseFilename = 'mouse'
desktopFilename = 'desktop'

# fileNames = [laptopFilename, desktopFilename, monitorFilename, keyboardFilename, mouseFilename]
fileNames = [desktopFilename]
folder = "E:/Hansung/2023_Capstone/data/"

for fileName in fileNames:
    print("=======================" + fileName + "=======================")
    originalFilePath = folder + "review/" + fileName + "_reviewWithModified2.json"  # 원본 json 파일 경로
    outputFilePath = folder + "embedding/" + fileName + "_embedding.json"  # 원본 json 파일 경로

    # json file load
    with open(originalFilePath, 'r', encoding='utf-8') as f:
        file_data = json.load(f)

    new_json = []
    for idx in range(len(file_data)):
        print(str(idx)+"/"+str(len(file_data)))
        data = file_data[idx]
        index = 0
        sentence = data["modified_sentence"]
        if len(sentence) < 2:
            continue
        sentence_embeddings = model.encode(sentence)
        new_json.append({"product_id": data["product_id"], 'vector_id': index, 'sentence': sentence,
                         'vector': sentence_embeddings.tolist()})
        index += 1

    with open(outputFilePath, 'w', encoding='utf-8') as out:
        json.dump(new_json, out, indent=4, ensure_ascii=False)
