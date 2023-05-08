SEND_FAIL_MSG = "메시지 전송에 실패했습니다. 다시 요청해주세요"

def Log(logId, uid, chat_category, output, isUser):

    ###########################################
    # 로그
    # 
    # logId : db에서의 log_id
    # uid : 사용자 id
    # chat_category : 0 = 기타
    #               : 1 = 요약
    #               : 2 = 추천
    #               : 3 = 단순 정보
    #               : 5 = 상세 제품명
    # output : 채팅 message
    # isUser : 사용자가 보낸 채팅인지 (1:사용자, 0:챗봇)
    ###########################################
    return [logId, uid, chat_category, output, isUser]

def FallBack(logId, uid):
    # 오류
    log = Log(logId, uid, 0, SEND_FAIL_MSG, 0)
    return {"state":"FALLBACK","text":SEND_FAIL_MSG, "intent":"NONE", "keyPhrase":"","log":log}

def Message(state, output, intent, keyPhrase, logId, uid, chat_category, isUser):
    log = Log(logId,uid,chat_category,output,isUser)
    return {"state":state,"text":output, "intent":intent, "keyPhrase":keyPhrase, "log":log}


