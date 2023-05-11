import config
import mariadb
from datetime import datetime
import json

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
    

def saveLog(userId, categoryId, content, isUser, productName=""):

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
    sql = """INSERT INTO log VALUES(0,"{}", {}, "{}", "{}", {}, "{}")""".format(userId,categoryId,content,datetime.utcnow().strftime('%Y%m%d%H%M%S.%f'),isUser,productName )
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
    #        : sentiments = 리뷰 긍/부정
    #        : attributes = 리뷰 주제 list
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT r.sentence, r.sentiment, a.attribute_ids FROM attribute_define a INNER JOIN review r ON r.review_id = a.review_id and r.sentence_id = a.sentence_id INNER JOIN product p ON r.product_id = p.product_id WHERE p.name = '"+productName+"'"
    cur.execute(sql)
    # sql = "SELECT r.sentence, r.sentiment FROM review r INNER JOIN product p ON r.product_id = p.product_id WHERE p.name = '"+productName+"'"
    # cur.execute(sql)

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
    sql = "SELECT r.sentence, r.sentiment FROM review r INNER JOIN product p ON r.product_id = p.product_id WHERE p.name = '"+productName+"'"
    cur.execute(sql)

    reviewData = cur.fetchall()
    reviews = [data[0] for data in reviewData]
    sentiments = [data[1] for data in reviewData]

    conn.commit()
    conn.close()

    return reviews,sentiments

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

    info = cur.fetchone()
    if info == None:
        print("제품 이미지 url => 0개 검색결과")
        info = ""
    else:
        print("제품 이미지 url => "+str(len(info))+"개 검색결과")
        info = info[0]

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

    # 네이버 크롤링 상품명에 불용어가 포함되어있는경우


    conn = connectDB()
    cur = conn.cursor()
    sql = "SELECT info FROM product WHERE name='"+productName+"'"
    cur.execute(sql)

    info = cur.fetchone()
    if info == None:
        print("제품 상세정보 => 0개 검색결과")
        info = ""
    else:
        print("제품 상세정보 => "+str(len(info))+"개 검색결과")
        info = info[0]

    conn.commit()
    conn.close()

    return info

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
