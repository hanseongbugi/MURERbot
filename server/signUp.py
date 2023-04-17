import usingDB
ID_POSSIBLE = "POSSIBLE"
ID_IMPOSSIBLE = "IMPOSSIBLE"
SIGNUP_SUCCESS = "SIGNUP_SUCCESS"
SIGNUP_FAIL = "SIGNUP_FAIL"

def doubleCheckID(userId):
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
    try:
        conn = usingDB.connectDB()
        cur = conn.cursor()
        sql = "INSERT INTO user VALUES('"+userId+"','"+userPw+"','"+userNickname+"')"
        cur.execute(sql)

        conn.commit()
        conn.close()
        return SIGNUP_SUCCESS
    except:
        return SIGNUP_FAIL