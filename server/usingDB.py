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
    # categoryId : 0(기타), 1(요약), 2(추천), 3(단순 정보), 4(비교)
    # content : 채팅 내용
    # isUser : 사용자가 보낸 채팅인지 => 0(챗봇), 1(사용자)
    ####################################

    conn = connectDB()
    cur = conn.cursor()
    sql = "INSERT INTO log VALUES(0,'"+userId+"', %d, '"+content+"', "+datetime.utcnow().strftime('%Y%m%d%H%M%S.%f')+", %d)"
    cur.execute(sql,(categoryId,isUser))
    conn.commit()
    conn.close()

    # conn = connectDB()
    # cur = conn.cursor()
    # sql = "SELECT * FROM log"
    # cur.execute(sql)
    # searchResult = cur.fetchone()
    # print(searchResult)
    # conn.commit()
    # conn.close()