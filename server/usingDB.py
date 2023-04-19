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
