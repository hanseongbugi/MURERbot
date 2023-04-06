# -*- coding: utf-8 -*-
# 1. json file load
# 2. input query
# 3. 상품 리뷰와 query 간의 cosine similarity 구하기
# 4. 특정 threshold 이상일 때 제품에 점수 추가
# 5. 가장 높은 점수 제품을 출력 OR 제품 별 등수 출력

from sentence_transformers import SentenceTransformer
import time
from urllib import request
import json
import threading

lock = threading.Lock()

def queryProduct(product_num, query_embedding, cosine_score):
    connection = request.urlopen(
        'http://localhost:8983/solr/laptop/select?fq=product_id%3A'+str(product_num) +
        '&indent=true&q.op=OR&q=*%3A*&wt=python'
    )
    response = eval(connection.read())
    kValue = response['response']['numFound']
    kValue = round(kValue*0.07)
    if kValue % 2 == 0:
        kValue -= 1
    #  &q={!knn f=vector topK=10}[1.0, 2.0, 3.0, 4.0]&fq={!frange cache=false l=0.6}$q
    try:
        connection = request.urlopen(
        'http://localhost:8983/solr/laptop/select?fq=%7B!frange%20cache%3Dfalse%20l%3D'+str(cosine_score) +
        '%7D%24q&indent=true&q.op=OR&q=%7B!knn%20f%3Dvector%20topK%3D' + str(kValue) + '%7D' + query_embedding +
        '&fq=product_id%3A'+str(product_num)+'&wt=python'
        )
    except:
        connection = request.urlopen(
            'http://localhost:7574/solr/laptop/select?fq=%7B!frange%20cache%3Dfalse%20l%3D' + str(cosine_score) +
            '%7D%24q&indent=true&q.op=OR&q=%7B!knn%20f%3Dvector%20topK%3D' + str(kValue) + '%7D' + query_embedding +
            '&fq=product_id%3A' + str(product_num) + '&wt=python'
        )
    response = eval(connection.read())
    try:
        similar_num = response['response']['numFound']
    except KeyError:
        similar_num = 0
    lock.acquire()  # lock
    product_name = laptop_data[product_num]['name']
    laptop[product_name] = similar_num
    lock.release()  # lock 해제

model = SentenceTransformer('jhgan/ko-sbert-multitask')

# json file load
with open('data/laptop.json', 'r', encoding='utf-8') as f:
    laptop_data = json.load(f)
# with open('data/keyboard.json', 'r', encoding='utf-8') as f:
#     keyboard_data = json.load(f)
# with open('data/monitor.json', 'r', encoding='utf-8') as f:
#     monitor_data = json.load(f)
# with open('data/mouse.json', 'r', encoding='utf-8') as f:
#     mouse_data = json.load(f)

query = input('query : ')
# query = '가벼운 노트북'
query_embedding = model.encode(query)
# print(query)
query_embedding = str(query_embedding.tolist())
query_embedding = query_embedding.replace('[', '%5B').replace(']', '%5D').replace(',', '%2C').replace(' ', '%20')
laptop = {}
cosine_score = 0.6

total_start = time.time()  # 시작 시간 저장
th_list = []

for product_num in range(200):
    t = threading.Thread(target=queryProduct, args=(product_num, query_embedding, cosine_score))
    t.start()
    th_list.append(t)

for i in range(200):
    th_list[i].join()
print("run time :", time.time() - total_start)

# print(laptop)

sort_laptop = sorted(laptop.items(), key=lambda item: item[1], reverse=True)
print(sort_laptop)

recommand_product = sort_laptop[0]
recommand_name = recommand_product[0]
recommand_score = recommand_product[1]
print('추천하는 상품은 ', recommand_name, '입니다.')
print('점수는', recommand_score, '입니다.')

