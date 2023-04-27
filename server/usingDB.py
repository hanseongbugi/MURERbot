import config
import mariadb
from datetime import datetime

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

def saveLog(userId, categoryId, content, isUser):

    ####################################
    # db에 로그(채팅) 기록
    #
    # userId : 사용자 ID
    # categoryId : 0(기타), 1(요약), 2(추천), 3(단순 정보), 4(비교), 5(상세 제품명)
    # content : 채팅 내용
    # isUser : 사용자가 보낸 채팅인지 => 0(챗봇), 1(사용자)
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "INSERT INTO log VALUES(0,'"+userId+"', %d, '"+content+"', "+datetime.utcnow().strftime('%Y%m%d%H%M%S.%f')+", %d)"
    print("categoryId:"+str(categoryId)+", content:"+content+" => DB로 전송")
    cur.execute(sql,(categoryId,isUser))
    conn.commit()
    conn.close()

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

    cur.execute("SELECT * FROM bookmark WHERE user_id='"+userId+"'")
    bookmarks = cur.fetchall()
    print(bookmarks)

    conn.commit()
    conn.close()

    return bookmarks