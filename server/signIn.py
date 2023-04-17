import mariadb
import config

SIGNIN_SUCCESS = "SIGNIN_SUCCESS"
SIGNIN_FAIL = "SIGNIN_FAIL"

databaseInfo = config.DATABASE

def connectDB(): # db 연결
    return mariadb.connect(
    user=databaseInfo["user"],
    password=databaseInfo["password"],
    host=databaseInfo["host"],
    port=databaseInfo["port"],
    database=databaseInfo["database"]
    )

def checkValidInfo(userId, userPw):
    try:
        conn = connectDB()
        cur = conn.cursor()
        sql = "SELECT * FROM USER WHERE user_id='"+userId+"' AND user_pw='"+userPw+"'"
        cur.execute(sql)

        searchResult = cur.fetchone()
        conn.commit()
        conn.close()

        if (searchResult!=None): # 아이디, 비번 제대로 작성한 경우
            # searchResult[0] : user_id
            # searchResult[1] : user_pw
            # searchResult[2] : user_nickname
            print(searchResult[2]+"님 환영합니다")
            return SIGNIN_SUCCESS, searchResult[2]
        else: 
            # 로그인 실패 (아이디 오류)
            return SIGNIN_FAIL, ""

        
       
    except:
        return SIGNIN_FAIL