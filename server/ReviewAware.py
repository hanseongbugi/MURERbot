# -*- coding: utf-8 -*-
# 1. json file load
# 2. input query
# 3. 상품 리뷰와 query 간의 cosine similarity 구하기
# 4. 특정 threshold 이상일 때 제품에 점수 추가
# 5. 가장 높은 점수 제품을 출력 OR 제품 별 등수 출력
# 필요한 것 user input, 사용자가 질의한 상품의 category
# user input : 사용자의 문장, 사용자가 원하는 상품명
from sentence_transformers import SentenceTransformer
import time
from urllib import request
import json
import threading
import usingDB
import pandas as pd

lock = threading.Lock()
product = {}
type_dict = {"laptop": 0, "desktop": 1, "monitor": 2, "keyboard": 3, "mouse": 4}

def queryProduct(productType, product_num, query_embedding, cosine_score):
    # print("arrive queryProduct")
    connection = request.urlopen(
        'http://localhost:8983/solr/'+str(productType)+'/select?fq=product_id%3A'+str(product_num) +
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
        'http://localhost:8983/solr/'+str(productType)+'/select?fq=%7B!frange%20cache%3Dfalse%20l%3D'+str(cosine_score) +
        '%7D%24q&indent=true&q.op=OR&q=%7B!knn%20f%3Dvector%20topK%3D' + str(kValue) + '%7D' + query_embedding +
        '&fq=product_id%3A'+str(product_num)+'&wt=python'
        )
    except:
        connection = request.urlopen(
            'http://localhost:7574/solr/'+str(productType)+'/select?fq=%7B!frange%20cache%3Dfalse%20l%3D' + str(cosine_score) +
            '%7D%24q&indent=true&q.op=OR&q=%7B!knn%20f%3Dvector%20topK%3D' + str(kValue) + '%7D' + query_embedding +
            '&fq=product_id%3A' + str(product_num) + '&wt=python'
        )
    response = eval(connection.read())
    try:
        similar_num = response['response']['numFound']
    except KeyError:
        similar_num = 0
    type_id = type_dict[productType]

    lock.acquire()  # lock
    conn = usingDB.connectDB()
    cur = conn.cursor()
    product_num += (200 * type_id)
    sql = "SELECT name FROM product WHERE product_id = %s AND TYPE_id = %s"
    # print(sql,(str(product_num), str(type_id)))
    cur.execute(sql, (str(product_num), str(type_id)))
    product_name = cur.fetchall()
    product_name = product_name[0][0]
    cur.close()
    lock.release()  # lock 해제

    lock.acquire()  # lock
    product[product_name] = similar_num
    print(product_name)
    lock.release()  # lock 해제
    print("Query Ended")

def reviewAware(inputsentence):
    print("Arrive to Review Aware Module")
    model = SentenceTransformer('jhgan/ko-sbert-multitask')
    productType = ""
    if inputsentence.find('노트북') or inputsentence.find('놋북') or inputsentence.find('랩탑'):
        productType = 'laptop'
    elif inputsentence.find('컴퓨터') or inputsentence.find('pc') or inputsentence.find('데스크탑'):
        productType = 'desktop'
    elif inputsentence.find('모니터'):
        productType = 'monitor'
    elif inputsentence.find('키보드'):
        productType = 'keyboard'
    elif inputsentence.find('마우스'):
        productType = 'mouse'

    query = inputsentence
    # query = '가벼운 노트북'
    query_embedding = model.encode(query)
    # print(query)
    query_embedding = str(query_embedding.tolist())
    query_embedding = query_embedding.replace('[', '%5B').replace(']', '%5D').replace(',', '%2C').replace(' ', '%20')
    cosine_score = 0.6

    total_start = time.time()  # 시작 시간 저장
    th_list = []

    for product_num in range(200):
        t = threading.Thread(target=queryProduct, args=(productType, product_num, query_embedding, cosine_score))
        t.start()
        th_list.append(t)
        time.sleep(0.1)

    for th in th_list:
        th.join()
    print("run time :", time.time() - total_start)

    sort_product = sorted(product.items(), key=lambda item: item[1], reverse=True)

    recommand_product = sort_product[0]
    recommand_name = recommand_product[0]
    recommand_score = recommand_product[1]
    print(type(recommand_name))
    print(type(recommand_score))
    # print('추천하는 상품은 ', recommand_name, '입니다.')
    # print('점수는', recommand_score, '입니다.')
    return '추천하는 상품은 ' +  str(recommand_name) +  '이고 점수는'+ str(recommand_score)+ '입니다.'
