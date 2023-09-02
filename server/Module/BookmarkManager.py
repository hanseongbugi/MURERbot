import usingDB

ADD_BM = "ADD_BM"
DELETE_BM = "DELETE_BM"
MODIFY_BM = "MODIFY_BM"

def manageBookmark(state, logId, uid, title):
    # 북마크 관리
    if(state == ADD_BM):
        print("북마크 추가")
        usingDB.saveBookmark(logId, uid, title)
    elif(state == DELETE_BM): # 북마크 삭제
        print("북마크 삭제")
        usingDB.deleteBookmark(logId,uid)
    elif(state == MODIFY_BM): # 북마크 삭제
        print("북마크 수정")
        usingDB.modifyBookmark(logId,uid,title)