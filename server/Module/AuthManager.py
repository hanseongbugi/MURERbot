import usingDB

ID_POSSIBLE = "POSSIBLE"
ID_IMPOSSIBLE = "IMPOSSIBLE"
SIGNUP_SUCCESS = "SIGNUP_SUCCESS"
SIGNUP_FAIL = "SIGNUP_FAIL"
SIGNIN_SUCCESS = "SIGNIN_SUCCESS"
SIGNIN_FAIL = "SIGNIN_FAIL"

def doubleCheckID(userId):
    # id 중복 확인
    try:
        conn = usingDB.connectDB()
        cur = conn.cursor()
        sql = "SELECT COUNT(user_id) FROM USER WHERE user_id='"+userId+"'"
        cur.execute(sql)
        
        userIdCnt = cur.fetchone()[0] # user_id 값이 userId인 행 개수

        conn.commit()
        conn.close()

        if userIdCnt == 0:
            return ID_POSSIBLE
        else:
            return ID_IMPOSSIBLE
    except:
        return SIGNUP_FAIL


def registerUser(userId, userPw, userNickname):
    # 회원가입
    try:
        checkIdResult = doubleCheckID(userId)
        if checkIdResult == ID_POSSIBLE:
            conn = usingDB.connectDB()
            cur = conn.cursor()
            sql = "INSERT INTO user VALUES('"+userId+"','"+userPw+"','"+userNickname+"')"
            cur.execute(sql)

            conn.commit()
            conn.close()
            return SIGNUP_SUCCESS
        else:
            SIGNUP_FAIL
    except:
        return SIGNUP_FAIL


def checkValidInfo(userId, userPw):
    # 로그인
    try:
        conn = usingDB.connectDB()
        cur = conn.cursor()
        sql = "SELECT * FROM USER WHERE BINARY(user_id)='"+userId+"' AND BINARY(user_pw)='"+userPw+"'"
        cur.execute(sql)

        searchResult = cur.fetchone()
        conn.commit()
        conn.close()

        if (searchResult!=None): # 아이디, 비번 제대로 작성한 경우
            #####################################################
            # searchResult[0] : user_id
            # searchResult[1] : user_pw
            # searchResult[2] : user_nickname
            #####################################################
            print(searchResult[2]+"님 환영합니다")
            logs = usingDB.getLog(userId)
            bookmarks = usingDB.getBookmarks(userId)
            return SIGNIN_SUCCESS, searchResult[2], logs, bookmarks
        else: 
            # 로그인 실패 (아이디 오류)
            return SIGNIN_FAIL, "", [], []

        
       
    except:
        return SIGNIN_FAIL