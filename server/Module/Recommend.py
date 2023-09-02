from elasticsearch import Elasticsearch
import time
import pymysql
import config
import Module.Encoder as Encoder
import usingDB
from sklearn.metrics.pairwise import cosine_similarity
import Intent.userIntent as userIntent

# MariaDB 연결 정보
databaseInfo = config.DATABASE
RECOMMEND_CATEGORIES = usingDB.getRecommendCategories()
RECOMMEND_PHRASES = usingDB.getRecommendPhrases(RECOMMEND_CATEGORIES)

def predictAttribute(input):
    ##################################
    # 추천 의도 판단하기
    # input : 사용자가 입력한 문장
    ##################################

    input = input.replace(" ","")

    maxCosim = 0
    resultRecommendCategoryNames = []
    for recommend_phrase in RECOMMEND_PHRASES:
        # RECOMMEND_PHRASES => [[[phrase,phrase_vec],[phrase_category]],...]

        input_vec = Encoder.encodeProcess(input)

        cosim = cosine_similarity([recommend_phrase[0][1]],[input_vec])[0][0]
        
        print(recommend_phrase[0][0] + " --- "+input)
        print(cosim)

        if(cosim > 0.75 and maxCosim < cosim):
            print("check")
            maxCosim = cosim
            resultRecommendCategoryNames = recommend_phrase[1]
    
    return resultRecommendCategoryNames

    
def findIndexInSentence(sentence):
    if sentence.find('노트북') >= 0 or sentence.find('놋북') >= 0 or sentence.find('랩탑') >= 0:
        return 'laptop'
    elif sentence.find('컴퓨터') >= 0 or sentence.find('pc') >= 0 or sentence.find('데스크탑') >= 0 or sentence.find('PC') >= 0 :
        return 'desktop'
    elif sentence.find('모니터') >= 0 :
        return 'monitor'
    elif sentence.find('키보드') >= 0 :
        return 'keyboard'
    elif sentence.find('마우스') >= 0 :
        return 'mouse'
    else:
        return 0

def recommendProcess(inputSentence):
    # Elasticsearch 클라이언트 생성
    es = Elasticsearch(['http://localhost:9200'])  # Elasticsearch 주소에 맞게 수정

    if inputSentence.find("추천해줘") >=0:
        inputSentence = inputSentence.replace("추천해줘", "")
    elif inputSentence.find("추천") >=0: 
        inputSentence = inputSentence.replace("추천", "")

    input_vector = Encoder.encodeProcess(inputSentence)
    index = findIndexInSentence(inputSentence)
    if index == 0:
        return "추천이 불가능한 상품입니다."
    else :
        inputRecommendPhrase = inputSentence.replace('노트북',"").replace('놋북',"").replace('랩탑',"")
        inputRecommendPhrase = inputRecommendPhrase.replace('컴퓨터',"").replace('pc',"").replace('PC',"")
        inputRecommendPhrase = inputRecommendPhrase.replace('모니터',"").replace('키보드',"").replace('마우스',"")
        recommendAttribute = predictAttribute(inputRecommendPhrase)
        print("#"*50)
        print("추천 의도 파악 결과")
        print(recommendAttribute)
        print("#"*50)

        minScore = 1.79
        # 검색 쿼리 정의
        search_query = {
            "min_score": minScore, # 배터리 충전량에 따라 성능차이가 있을수있음
            "query":{
                    "script_score": {
                        "query": {
                        "match_all": {}    # 모든 문서 대상 검색
                    },
                    "script": {
                        "source": "cosineSimilarity(params.queryVector, 'vector')+1.0",
                        "params": {
                            "queryVector": input_vector  # 쿼리 벡터 값 설정
                        }
                    }
                }
            },
            "sort": [{"_score": {"order": "asc"}}]
        }

        connection = pymysql.connect(**databaseInfo)
        cur = connection.cursor()
        # 시작 시간 저장
        start = time.time()  
        # 초기 검색 요청
        response = es.search(index=index, body=search_query)

        # 검색 결과 처리
        i = 0
        product = {}
        keys = []
        while True:
            
            hits = response["hits"]["hits"]
            #print(hits)

            # 결과가 없을 때 반복 중단
            if not hits:
                break

            # 현재 페이지의 마지막 결과 값을 추출하여 search_after에 사용
            last_result = hits[-1]["sort"]

            # 다음 검색 요청을 위해 검색 쿼리 업데이트
            search_query["search_after"] = last_result

            # 추가 검색 요청
            response = es.search(index=index, body=search_query)

            #현재 페이지 결과 처리
            for hit in hits:
                #i += 1
                #print(hit["_score"])
                # if hit["_source"]["product_id"] == 787:
                #print("Product ID : {0}, Review ID : {1}, Sentence ID : {2}".format(hit["_source"]["product_id"], hit["_source"]["review_id"], hit["_source"]["sentence_id"]))
                #print('result=',i)
                # id값들을 리스트로 만들어서 저장하고 
                productID = hit["_source"]["product_id"]
                reviewID = hit["_source"]["review_id"]
                sentenceID = hit["_source"]["sentence_id"]
                if productID in product:
                    product[productID] += 1
                    keys.append([productID,reviewID,sentenceID])
                else :
                    product[productID] = 1
                    keys.append([productID,reviewID,sentenceID])

        sorted_product = sorted(product.items(), key=lambda x:x[1], reverse=True)
        #print(sorted_product)
        top_products = sorted_product[:6]
        print(top_products)
        #print(keys)

        reviews = []
        
        for product in top_products:
            # 만약 top_products에서 나온 product_id와 data[0]의 product_id가 같다면
            # => 상위 6개 물품의 key들이라면
            for data in keys:  
                if product[0] == data[0]:
                    reviewQuery = "SELECT sentence FROM review WHERE product_id = {0} AND review_id = {1} AND sentence_id = {2}".format(data[0], data[1], data[2])
                    cur.execute(reviewQuery)
                    resultReview = cur.fetchall()
                    reviews.append(resultReview)
                else:
                    continue
            # 마지막에 # 처리 해주기
            reviews.append("#")

        print(reviews)
        results = []
        while i < len(top_products):
            query = "SELECT name FROM product WHERE product_id = {0}".format(top_products[i][0])
            cur.execute(query)
            result = cur.fetchall()
            results.append(result)
            print(result)
            i+=1

        # recItem1name = results[0][0][0]
        # rec1Score = top_products[0][1]
        # rec2Score = top_products[1][1]
        # imageUrls =[]
        # imageUrls.append(usingDB.getProductImageURL(recItem1name))

        # print("time :", time.time() - start)  # 현재시각 - 시작시간 = 실행 시간 

        # recommendAttribute 속성명들
        recItemName = [] # 추천 상품 이름
        recScore = [] # 추천 점수
        imageUrls = [] # 추천 상품 이미지
        recValue = [] # 추천 상품 속성값들

        for i in range(6):
            recItemName.append(results[i][0][0])
            recScore.append(top_products[i][1])
            imageUrls.append(usingDB.getProductImageURL(recItemName[i]))
            
            # 하나의 추천 상품 대한 속성값 찾기
            itemRecValue = []
            for att in recommendAttribute:
                itemInfo = userIntent.findProductInfo(results[i][0][0], att)

                if(itemInfo == "해당 정보가 존재하지 않습니다."):
                    itemInfo = ""
                
                itemRecValue.append(itemInfo.replace("입니다.","").replace("검색결과","").replace("은(는)","").strip())
            recValue.append(itemRecValue)

        recommendLogId = usingDB.saveRecommendLog(str(recommendAttribute),str(recValue),str(recScore), str(reviews))

        return ("'" + inputSentence + "' 와 유사한 상품 리뷰가 많은 순서로 선정한 결과입니다.\n\n"
            + "1위 (" + str(recScore[0]) +" 개 리뷰) : %=" + str(recItemName[0]) + "=%\n"
            + "2위 (" + str(recScore[1]) +" 개 리뷰) : %=" + str(recItemName[1]) + "=%\n"
            + "3위 (" + str(recScore[2]) +" 개 리뷰) : %=" + str(recItemName[2]) + "=%"), imageUrls, recommendLogId

        # return ("'" + inputSentence + "' 와 유사한 상품 리뷰가 많은 순서로 선정한 결과입니다.\n\n"
        #     + "1위 (" + str(rec1Score) +" 개 리뷰) : %=" + str(recItem1name) + "=%\n"
        #     + "2위 (" + str(rec2Score) +" 개 리뷰) : %=" + str(recItem2name) + "=%\n"
        #     + "3위 (" + str(rec3Score) +" 개 리뷰) : %=" + str(recItem3name) + "=%"), imageUrls
    