import config
import mariadb
from datetime import datetime
import json
import Intent.CrawlingProduct as CrawlingProduct
# from sklearn.metrics.pairwise import cosine_similarity
# from sentence_transformers import SentenceTransformer
# import numpy as np
import random


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
    

def saveLog(userId, categoryId, content, isUser, productName="", imageURLs=[]):

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
    sql = ""
    sql = """INSERT INTO log VALUES(0,"{}", {}, "{}", "{}", {}, "{}","{}")""".format(userId,categoryId,content,datetime.utcnow().strftime('%Y%m%d%H%M%S.%f'),isUser,productName,str(imageURLs))
    print("categoryId:"+str(categoryId)+", content:"+content+" => DB로 전송")
    cur.execute(sql)
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

    conn.commit()
    conn.close()

    return logs


def getReviewDataWithAttributes(productName):
    ####################################
    # db에서 제품 리뷰 리뷰, 감정 속성 가져오기
    #
    # productName : 제품 상세명
    # 
    # return : 
    #        : reviews = 리뷰 문장들
    #        : modifiedReviews = 맞춤법 검사한 리뷰 문장들
    #        : sentiments = 리뷰 긍/부정
    #        : attributes = 리뷰 주제 list
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT r.sentence_modified, r.sentiment, a.attribute_ids FROM attribute_define a INNER JOIN review r ON r.review_id = a.review_id and r.sentence_id = a.sentence_id INNER JOIN product p ON r.product_id = p.product_id WHERE p.name = '"+productName+"'"
    cur.execute(sql)

    reviewData = cur.fetchall()
    reviews = [data[0] for data in reviewData]
    sentiments = [data[1] for data in reviewData]
    attributes = [json.loads(data[2]) for data in reviewData]

    conn.commit()
    conn.close()

    return reviews, sentiments, attributes


def getReviewData(productName):
    ####################################
    # db에서 제품 리뷰, 감정 가져오기
    #
    # productName : 제품 상세명
    # 
    # return : 
    #        : reviews = 리뷰 문장들
    #        : sentiments = 리뷰 긍/부정
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT r.sentence_modified, r.sentiment FROM review r INNER JOIN product p ON r.product_id = p.product_id WHERE p.name = '"+productName+"'"
    cur.execute(sql)

    reviewData = cur.fetchall()
    reviews = [data[0] for data in reviewData]
    sentiments = [data[1] for data in reviewData]

    conn.commit()
    conn.close()

    return reviews,sentiments


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
    sql = "SELECT COUNT(*) FROM product WHERE type_id="+str(type_id)+" AND product_id<=1852"
    cur.execute(sql)

    totalCnt = cur.fetchone()[0]
    print(str(totalCnt))

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
        print(info)
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
    print("bookmarks join result")
    print(bookmarks)

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
    print(sentence+"가 포함된 리뷰 ============>>> ")

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
    # itemLists_encode = model.encode(itemLists)
    # searchItem_encode = model.encode(searchItem)
    # cosim_list = cosine_similarity([searchItem_encode], itemLists_encode)
    # item_cosims = []
    # for idx, item in enumerate(itemLists):
    #     item_cosims.append([item,cosim_list[0][idx]])
    
    # print(item_cosims)
    # item_cosims.sort(key=lambda x:x[1])
    # for item_cosim in item_cosims:
    #     print(item_cosim[0]+" => "+str(item_cosim[1]))
    conn.commit()
    conn.close()

    return itemLists