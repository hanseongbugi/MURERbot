import usingDB

SIGNIN_SUCCESS = "SIGNIN_SUCCESS"
SIGNIN_FAIL = "SIGNIN_FAIL"

def checkValidInfo(userId, userPw):
    try:
        conn = usingDB.connectDB()
        cur = conn.cursor()
        sql = "SELECT * FROM USER WHERE BINARY(user_id)='"+userId+"' AND BINARY(user_pw)='"+userPw+"'"
        cur.execute(sql)

        searchResult = cur.fetchone()
        conn.commit()
        conn.close()

        if (searchResult!=None): # 아이디, 비번 제대로 작성한 경우
            # searchResult[0] : user_id
            # searchResult[1] : user_pw
            # searchResult[2] : user_nickname
            print(searchResult[2]+"님 환영합니다")
            logs = usingDB.getLog(userId)
            print(logs)
            bookmarks = usingDB.getBookmarks(userId)
            print(bookmarks)
            return SIGNIN_SUCCESS, searchResult[2], logs, bookmarks
        else: 
            # 로그인 실패 (아이디 오류)
            return SIGNIN_FAIL, "", [], []

        
       
    except:
        return SIGNIN_FAIL