import config
import mariadb
from datetime import datetime
import json
import ast
import Intent.CrawlingProduct as CrawlingProduct
# from sklearn.metrics.pairwise import cosine_similarity
# from sentence_transformers import SentenceTransformer
# import numpy as np
import random
import Module.Encoder as Encoder


# model = SentenceTransformer('jhgan/ko-sbert-multitask')

databaseInfo = config.DATABASE

def connectDB(): # db 연결
    try:
        conn = mariadb.connect(
            user=databaseInfo["user"],
            password=databaseInfo["password"],
            host=databaseInfo["host"],
            port=databaseInfo["port"],
            database=databaseInfo["database"]
            )
    except:
        print("*********** DB 연결 오류 ***********")
    return conn


def saveErrorLog(userAction, errorContent):
    ####################################
    # db에 에러 로그 저장
    #
    # action : 사용자 액션
    # errorContent : 에러 내용
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    cur.execute("INSERT INTO error_log VALUES(0, '"+userAction+"', \""+errorContent+"\", "+datetime.utcnow().strftime('%Y%m%d%H%M%S.%f')+")")
    conn.commit()
    conn.close()
    
def saveRecommendLog(attributenNames, attributeValues, reviewCounts=[4,1,2], reviewContents =[], recommendItemInfo = [], recommendItemName = []):
    ####################################
    # db에 추천 로그 기록
    #
    # attributenNames : 상품 속성명들 ["무게","색상"]
    # attributeValues : 상품 속성값들 [["1kg","흰색"],["0.9kg","검은색"]]
    # reviewCounts : 리뷰 개수
    # reviewContents : 리뷰 내용
    #
    # return : recommendId(db > recommend_log테이블에서의 id)
    ####################################
    print("************ save recommend log ***********")
    conn = connectDB()
    cur = conn.cursor()
    sql = """INSERT INTO recommend_log VALUES(0,"{}", "{}", "{}", "{}", \"{}\", "{}")""".format(attributenNames,attributeValues,reviewCounts,reviewContents, recommendItemInfo, recommendItemName)
    # print(sql)
    cur.execute(sql)
    
    logId = cur.lastrowid
    conn.commit()
    conn.close()

    return logId

def getRecommendLog(recommendLogId):
    
    ####################################
    # db에서 추천 로그 데이터 가져오기
    #
    # recommendLogId : 추천 로그 아이디
    # 
    # return : recommendLog
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT attribute_names, attribute_values, review_counts, review_contents, recommendItem_info, recommendItem_name FROM recommend_log WHERE id={}".format(recommendLogId)
    cur.execute(sql)

    recommendLog = cur.fetchone()

    attributeNames = ast.literal_eval(recommendLog[0])
    #print(attributeNames)
    attributeValues = ast.literal_eval(recommendLog[1])
    reviewCounts = ast.literal_eval(recommendLog[2])
    reviewContents = ast.literal_eval(recommendLog[3])
    recommendItem_info = ast.literal_eval(recommendLog[4])
    recommendItem_name = ast.literal_eval(recommendLog[5])

    infos = []
    for recommend_info in recommendItem_info:
        infos.append(json.loads(recommend_info.replace("'",'"')))

    detailInfos = []
    for info in infos:
        detailInfos.append([str(key)+": "+str(info[key]) for key in info])
    #print(detailInfos)

    conn.commit()
    conn.close()

    return attributeNames, attributeValues, reviewCounts, reviewContents, detailInfos, recommendItem_name

def saveLog(userId, categoryId, content, isUser, productName="", imageURLs=[], recommendLogId='NULL'):

    ####################################
    # db에 로그(채팅) 기록
    #
    # userId : 사용자 ID
    # categoryId : 0(기타), 1(요약), 2(추천), 3(단순 정보), 4(비교), 5(상세 제품명)
    # content : 채팅 내용
    # isUser : 사용자가 보낸 채팅인지 => 0(챗봇), 1(사용자)
    #
    # return : logId(db에서의 log_id)
    ####################################
    print("************ save log ***********")
    print(productName)

    conn = connectDB()
    cur = conn.cursor()
    try:
        sql = """INSERT INTO log VALUES(0,"{}", {}, "{}", "{}", {}, "{}","{}",{})""".format(userId,categoryId,content,datetime.utcnow().strftime('%Y%m%d%H%M%S.%f'),isUser,productName,str(imageURLs),recommendLogId)
        cur.execute(sql)
    except:
        try:
            print("sql error")
            sql = """INSERT INTO log VALUES(0,'{}', {}, '{}', '{}', {}, '{}','{}',{})""".format(userId,categoryId,content,datetime.utcnow().strftime('%Y%m%d%H%M%S.%f'),isUser,productName,str(imageURLs),recommendLogId)
            cur.execute(sql)
        except:
            print("sql error2")
            sql = """INSERT INTO log VALUES(0,'{}', {}, '{}', '{}', {}, '{}','{}',{})""".format(userId,categoryId,content.replace("'","'"+"'"),datetime.utcnow().strftime('%Y%m%d%H%M%S.%f'),isUser,productName,str(imageURLs),recommendLogId)
            cur.execute(sql)
    
    print("categoryId:"+str(categoryId)+", content:"+content+" => DB로 전송")
    logId = cur.lastrowid
    conn.commit()
    conn.close()

    return logId


def getLog(userId):
    
    ####################################
    # db에서 로그(채팅) 기록 가져오기
    #
    # userId : 사용자 ID
    # 
    # return : 로그 기록(list)
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT * FROM log WHERE user_id='"+userId+"'"
    cur.execute(sql)

    logs = cur.fetchall()
    changedLogs = []
    for idx, log in enumerate(logs):
        if(log[8] is not None):
            # print("================== not none ================")
            attributeNames, attributeValues, reviewCounts, reviewContents, recommendItem_info, recommendItem_name = getRecommendLog(log[8])
            changeLog = [log[0],log[1],log[2],log[3],log[4],log[5],log[6],log[7],[attributeNames,attributeValues,reviewCounts,reviewContents, recommendItem_info, recommendItem_name]]
            changedLogs.append(changeLog)
        else:
            changedLogs.append(log)
    conn.commit()
    conn.close()

    
    return changedLogs


def getReviewDataWithAttributes(productName):
    ####################################
    # db에서 제품 리뷰 리뷰, 감정 속성 가져오기
    #
    # productName : 제품 상세명
    # 
    # return : 
    #        : reviewData = 리뷰, 감성(0,1,2), 속성 포함된 데이터
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT r.sentence_modified, r.sentiment, a.attribute_ids FROM attribute_define a INNER JOIN review r ON r.review_id = a.review_id and r.sentence_id = a.sentence_id INNER JOIN product p ON r.product_id = p.product_id WHERE p.name = '"+productName+"'"
    cur.execute(sql)

    reviewData = cur.fetchall()

    conn.commit()
    conn.close()

    return reviewData


def getReviewData(productName):
    ####################################
    # db에서 제품 리뷰, 감정 가져오기
    #
    # productName : 제품 상세명
    # 
    # return : 
    #        : reviewData = 리뷰, 감성(0,1,2)
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT r.sentence_modified, r.sentiment FROM review r INNER JOIN product p ON r.product_id = p.product_id WHERE p.name = '"+productName+"'"
    cur.execute(sql)

    reviewData = cur.fetchall()
    
    conn.commit()
    conn.close()

    return reviewData


def getURL(productName):
    
    ####################################
    # db에서 제품 url 가져오기
    #
    # productName : 제품 상세명
    # 
    # return : 제품 url
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT url FROM product WHERE name='"+productName+"'"
    cur.execute(sql)

    url = cur.fetchone()[0]

    conn.commit()
    conn.close()

    return url
    

def getFirstProductId(productType):
    ####################################
    # typeId에 해당하는 가장 작은 productId 찾기
    #
    # productType : 제품 타입 이름
    # 
    # return : 가장 작은 productId
    ####################################
    type_id = -1
    if productType == 'laptop':
        type_id = 0
    elif productType == 'desktop':
        type_id = 1
    elif productType == 'monitor':
        type_id = 2
    elif productType == 'keyboard':
        type_id = 3
    elif productType == 'mouse':
        type_id = 4

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT product_id FROM product WHERE type_id="+str(type_id)+" ORDER BY product_id"
    cur.execute(sql)

    leastProductId = cur.fetchone()[0]

    conn.commit()
    conn.close()
    return leastProductId


def getTotalProductCnt(productType):
    ####################################
    # db에서 제품 타입 개수 가져오기
    #
    # productType : 제품 타입 이름
    # 
    # return : 제품 타입 개수
    ####################################
    type_id = -1
    if productType == 'laptop':
        type_id = 0
    elif productType == 'desktop':
        type_id = 1
    elif productType == 'monitor':
        type_id = 2
    elif productType == 'keyboard':
        type_id = 3
    elif productType == 'mouse':
        type_id = 4

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT COUNT(*) FROM product WHERE type_id="+str(type_id)+" AND product_id<="+str(config.COLLECTED_REVIEW_CNT)
    cur.execute(sql)

    totalCnt = cur.fetchone()[0]
    # print(str(totalCnt))

    conn.commit()
    conn.close()

    return totalCnt

def getProductImageURL(productName):
    ####################################
    # db에서 제품 사진 url 가져오기
    #
    # productName : 제품 상세명
    # 
    # return : 제품 사진 url
    ####################################
    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT imageurl FROM product WHERE name='"+productName+"'"
    cur.execute(sql)

    info = cur.fetchone()[0]
    if info == None: # db에 imageurl 값이 없는 경우
        info = CrawlingProduct.findImageUrl(productName)
        sql = "UPDATE product SET imageurl='"+info+"' WHERE name='"+productName+"'"
        cur.execute(sql)

    conn.commit()
    conn.close()

    return info


def getProductInfo(productName):
    
    ####################################
    # db에서 제품 정보 기록 가져오기
    #
    # productName : 제품 상세명
    # 
    # return : 제품 상세정보
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT info FROM product WHERE name='"+productName+"'"
    cur.execute(sql)

    info = cur.fetchone()[0]
    if info == None: # db에서 info가 NULL인 경우
        info = CrawlingProduct.findProductInfo(productName)
        if info == "":
            print("info empty")
            cur.execute("""UPDATE product SET info='{}' WHERE name='{}'""".format('{"":""}', productName))
            conn.commit()
            conn.close()
            return info
        else:
            print("save 2 db")
            json_info = json.dumps(json.loads(str(info).replace("'",'"')), ensure_ascii=False)
            cur.execute("""UPDATE product SET info='{}' WHERE name='{}'""".format(json_info, productName))
            conn.commit()
            conn.close()
            return info
        
    conn.commit()
    conn.close()
    return json.loads(info)


def getPrice(productName):
    
    ####################################
    # db에서 제품 가격 가져오기
    #
    # productName : 제품 상세명
    # 
    # return : 제품 가격
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT price FROM product WHERE name='"+productName+"'"
    cur.execute(sql)

    price = cur.fetchone()[0]
    if price == None:
        print("crawling price")
        price = CrawlingProduct.findPrice(productName)
        print(price)
        cur.execute('''UPDATE product SET price={} WHERE name="{}"'''.format(price, productName))

    conn.commit()
    conn.close()

    if price>0:
        return format(price, ',')+"원"
    else:
        return "현재 상품 일시 중단 또는 단종된 상품"


def saveBookmark(logId, userId, bookmarkTitle):

    ####################################
    # db에 북마크 저장
    #
    # logId : 채팅 log ID
    # userId : 사용자 ID
    # bookmarkTitle : 북마크 제목
    ####################################

    conn = connectDB()
    cur = conn.cursor()


    cur.execute("INSERT INTO bookmark VALUES(%d, %s, %s)",(logId,userId,bookmarkTitle))
    conn.commit()
    conn.close()


def deleteBookmark(logId,userId):

    ####################################
    # db에 북마크 삭제
    #
    # logId : 채팅 log ID
    # userId : 사용자 ID
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    cur.execute("DELETE FROM bookmark WHERE log_id=%d AND user_id=%s",(logId,userId))
    conn.commit()
    conn.close()


def getBookmarks(userId):
    ####################################
    # db에서 북마크 정보 가져오기
    #
    # userId : 사용자 ID
    ####################################
    conn = connectDB()
    cur = conn.cursor()

    sql = "SELECT bm.log_id, bm.bm_title, l.content, l.category_id FROM bookmark bm INNER JOIN log l ON l.log_id = bm.log_id WHERE l.user_id = '"+userId+"'"
    cur.execute(sql)
    bookmarks = cur.fetchall()
    # print("bookmarks join result")
    # print(bookmarks)

    conn.commit()
    conn.close()

    return bookmarks


def modifyBookmark(logId, userId, bookmarkTitle):
    ####################################
    # db에서 북마크 정보 수정하기
    #
    # logId : 로그 ID
    # userId : 사용자 ID
    # bookmarkTitle : 수정된 북마크 제목
    ####################################
    conn = connectDB()
    cur = conn.cursor()

    cur.execute("UPDATE bookmark SET bm_title=%s WHERE log_id=%d AND user_id=%s",(bookmarkTitle,logId,userId))

    conn.commit()
    conn.close()


def findPersonReview(productName, sentence):
    ####################################
    # db에서 한 사람이 쓴 리뷰 전체 가져오기
    #
    # sentence : review 한 문장
    # return : 리뷰 전체
    ####################################
    productId = findProductId(productName)

    conn = connectDB()
    cur = conn.cursor()
    # print(sentence+"가 포함된 리뷰 ============>>> ")

    cur.execute("""SELECT sentence, sentence_modified from review WHERE review_id=(SELECT review_id FROM review WHERE product_id={} and sentence_modified='{}' LIMIT 1)""".format(productId, sentence))
    results = cur.fetchall()

    conn.commit()
    conn.close()

    review = ""
    for result in results:
        reviewSentence = result[0]
        if result[1] == sentence:
            reviewSentence = "<mark>"+reviewSentence+"</mark>"
        if len(review) > 0:
            review = review + " " + reviewSentence
        else:
            review = reviewSentence.strip()

    return review


def findProductId(productName):
    ####################################
    # db에서 product_id 찾기
    #
    # productName : 제품 이름
    # return : product_id
    ####################################
    conn = connectDB()
    cur = conn.cursor()

    cur.execute("""SELECT product_id FROM product WHERE name='{}'""".format(productName))
    productId = cur.fetchone()[0]

    conn.commit()
    conn.close()

    return productId


def insertNewProduct(type_id, name, info="NULL", price="NULL", imageurl="NULL", url="NULL"):
    ####################################
    # db에 새로운 product 넣기
    ####################################
    conn = connectDB()
    cur = conn.cursor()

    cur.execute('''SELECT COUNT(*) FROM product WHERE name="{}"'''.format(name))
    if cur.fetchone()[0] == 0:
        print(name+"이 db에 존재하지 않습니다. insert 진행...")
        name = '"'+name+'"'
        if info != "NULL":
            info = "'"+info+"'"
        if imageurl != "NULL":
            imageurl = '"'+imageurl+'"'
        if url != "NULL":
            url = '"'+url+'"'

        cur.execute("""INSERT INTO product VALUES(0,{},{},0,{},{},{},{})""".format(type_id, name, info, price, imageurl, url))

    conn.commit()
    conn.close()


def searchProduct(searchItem):
    ####################################
    # 네이버 쇼핑몰 검색 실패 시 db에서 유사한 상품명의 제품 찾기
    ####################################
    conn = connectDB()
    cur = conn.cursor()

    cur.execute("""SELECT name FROM product WHERE name LIKE '%{}%'""".format(searchItem))
    itemLists = cur.fetchall()
    itemLists = [item[0] for item in itemLists]

    if len(itemLists) == 0:
        cur.execute("""SELECT name FROM product WHERE name LIKE '%{}%'""".format("%".join(list(searchItem))))
        itemLists = cur.fetchall()
        itemLists = [item[0] for item in itemLists]

    if len(itemLists)>5:
        randomIdxs = random.sample(range(0,len(itemLists)),5)
        itemLists = [itemLists[idx] for idx in randomIdxs]

    print(itemLists)
    conn.commit()
    conn.close()

    return itemLists

def getRecommendCategories():
    ####################################
    # db에서 recommend_category 가져오기
    # return 추천 카테고리(딕셔너리)
    ####################################
    conn = connectDB()
    cur = conn.cursor()

    cur.execute("SELECT * FROM recommend_category")
    recommend_categories = cur.fetchall()

    recommend_categories_dict = {}
    for recommend_category in recommend_categories:
        recommend_categories_dict[recommend_category[0]] = recommend_category[1]
    
    conn.commit()
    conn.close()
    return recommend_categories_dict

def getRecommendPhrases(catogory_dict):
    ####################################
    # db에서 recommend_cache 가져오기
    # return [[추천문구,추천문구 벡터],[추천 카테고리 이름]]
    ####################################
    print(catogory_dict)
    conn = connectDB()
    cur = conn.cursor()

    cur.execute("SELECT * FROM recommend_cache")
    recommend_phrases = cur.fetchall() # [[phrase_id,phrase,phrase_category],[],...]

    recommend_phrases_info = []
    for recommend_phrase in recommend_phrases: 
        # recommend_phrase => [phrase_id,phrase,phrase_category]
        recommend_categories = str(recommend_phrase[2]).split(",")
        recommend_category_names = []
        for recommend_category in recommend_categories:
            recommend_category_names.append(catogory_dict[int(recommend_category)])
        recommend_phrases_info.append([[recommend_phrase[1],Encoder.encodeProcess(recommend_phrase[1])],recommend_category_names])

    conn.commit()
    conn.close()
    return recommend_phrases_info