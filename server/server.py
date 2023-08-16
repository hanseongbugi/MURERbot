import signIn
import signUp
import stopWords
import usingDB
from flask import Flask, request
from flask_cors import CORS # pip install flask_cors
import signUp, signIn, usingDB, stopWords, Message
from SummaryReview import ProductSummary as ProductSummary
import Intent.Scenario as Scenario
import Intent.userIntent as userIntent
import json
import Intent.SpellChecker as SpellChecker
from random import randint

app = Flask(__name__)
app.secret_key = "hansungfanoiv23587v988erncnjke9332nfewll"
CORS(app)

ADD_BM = "ADD_BM"
DELETE_BM = "DELETE_BM"
MODIFY_BM = "MODIFY_BM"
SUCCESS = "SUCCESS"
SEND_FAIL = "FALLBACK"
SEND_FAIL_MSG = "메시지 전송에 실패했습니다. 다시 요청해주세요"
PRODUCT_QUESTION_EXAMPLE = ["가격 얼마야?","가격 알려줘", "얼마야?", "무게 알려줘", "GPU 알려줘", "화면크기 얼마야?", "연결방식 알려줘"]
PRODUCT_QUESTION_EXAMPLE_CNT = 7
SUMMARY_QUESTION_EXAMPLE = ["성능 어때?", "후기 어때?", "요약해줘", "요약본 줘"]
SUMMARY_QUESTION_EXAMPLE_CNT = 4

@app.route('/<uid>/refresh', methods=['POST'])
def send_log(uid): # 페이지 reload 됐을 때 log와 bookmark 다시 보내기
    try:
        print("====== Refresh Page ======")
        logs = usingDB.getLog(uid)
        bookmarks = usingDB.getBookmarks(uid)

        return {"state":"SUCCESS", "log":logs, "bookmark":bookmarks}
    except Exception as e: 
        print(e)
        usingDB.saveErrorLog(uid+"/refresh", str(e))
        return {"state":SEND_FAIL}
    
@app.route('/user/signup', methods=['POST'])
def register_user(): # 회원가입
    try:
        print("====== 회원가입 ======")
        print(request.json)

        registerInfo = request.json
        registerResult = signUp.registerUser(registerInfo["userId"],registerInfo["userPw"],registerInfo["userNickname"])
        return {"state":registerResult}
    except Exception as e: 
        print(e)
        usingDB.saveErrorLog("signup", str(e))
        return {"state":SEND_FAIL}
    
@app.route('/valid-id', methods=['POST'])
def doubleCheckID(): # 회원가입 가능한 id인지 확인
    try:
        print("====== ID 중복 확인 ======")
        print(request.json)

        registerResult = signUp.doubleCheckID(request.json["userId"])
        return {"state":registerResult}
    except Exception as e: 
        print(e)
        usingDB.saveErrorLog("valid-id => "+request.json["userId"], str(e))
        return {"state":SEND_FAIL}

@app.route('/<uid>/signin', methods=['POST'])
def signInUser(uid): # 로그인
    try:
        print("====== 로그인 ======")
        print(uid)
        print(request.json)

        signInInfo = request.json # 사용자가 웹에서 입력한 id, pw
        registerResult, nickname, logs, bookmarks = signIn.checkValidInfo(signInInfo["userId"], signInInfo["userPw"])
        return {"state":registerResult, "nickname":nickname, "log":logs, "bookmark":bookmarks}
    except Exception as e: 
        print(e)
        usingDB.saveErrorLog(uid+"/signin", str(e))
        return {"state":SEND_FAIL, "nickname":"", "log":[]}
    
@app.route('/<uid>/bookmark', methods=['POST'])
def manageBookmark(uid): # 북마크 관리
    try:
        print("====== manageBookmark ======")
        print(request.json)

        state = request.json["state"]
        logId = request.json["logId"]
        title = request.json["title"]

        if(state == ADD_BM):
            print("북마크 추가")
            usingDB.saveBookmark(logId, uid, title)
        elif(state == DELETE_BM): # 북마크 삭제
            print("북마크 삭제")
            usingDB.deleteBookmark(logId,uid)
        elif(state == MODIFY_BM): # 북마크 삭제
            print("북마크 수정")
            usingDB.modifyBookmark(logId,uid,title)

        return {"state":SUCCESS}
    except Exception as e:
        print(e)
        usingDB.saveErrorLog(uid+"/bookmark => "+state+" "+title, str(e))
        return {"state":SEND_FAIL}
    
@app.route('/<uid>/product-summary', methods=['POST'])
def sendProductSummary(uid):
    ####################################
    # 요약본에 필요한 정보 전송
    # 
    # request message : "productName": 상품명
    ####################################
    
    try:
        print("====== sendProductSummary ======")
        print(request.json)

        productName = request.json["productName"]

        productSummary = ProductSummary(productName)
        # print(json.dumps(productSummary.__dict__, ensure_ascii=False))
        return json.dumps(productSummary.__dict__, ensure_ascii=False)
    except Exception as e:
        print(e)
        usingDB.saveErrorLog(uid+"/product-summary => "+productName, str(e))
        return {"state":SEND_FAIL}


# 웹에서 보낸 json 처리
# {
#   'text': '웹에서 사용자가 입력한 문장',
#   'state': 'SUCCESS/REQUIRE_DETAIL/REQUIRE_QUESTION/REQUIRE_NAME/FALLBACK',
#   'productName': '사용자가 원하는 상품 이름'
# }
@app.route('/<uid>/user-input',methods=['POST'])
def get_input(uid):
    print("====== getUserInput ======")
    print(request.json)

    userInput = request.json["text"]
    originalUserInput = userInput
    state = request.json["state"]
    productName = request.json["productName"]
    intent = request.json["intent"]
    keyPhrase = request.json["keyPhrase"]

    if len(userInput)==0: # 사용자가 프론트에서 상품명 클릭한 경우
        usingDB.saveLog(uid,0,productName,1,productName)
    else:
        usingDB.saveLog(uid,0,userInput,1) # 사용자가 보낸 채팅 db에 기록

    
    try:
        # userInput = spell_checker.check(userInput).checked
        originalUserInput = userInput
        userInput = SpellChecker.checkSpell(userInput)
        print("Modified inputSentence => " + userInput)
        # stopword 처리
        userInput = stopWords.stopWordProcess(userInput)
        for word in Scenario.greeting:
            if word in userInput:
                output = "안녕하세요! 저는 물어봇입니다."
                logId = usingDB.saveLog(uid,0,output,0)
                return {"state":"SUCCESS","text":output, "intent":intent, "keyPhrase":keyPhrase, "log":[logId,uid,0,output,0]}
        for word in Scenario.thanks:
            if word in userInput:
                output = "다음에 또 이용해주세요😊"
                logId = usingDB.saveLog(uid,0,output,0)
                return {"state":"SUCCESS","text":output, "intent":intent, "keyPhrase":keyPhrase, "log":[logId,uid,0,output,0]}

        if(state=="SUCCESS"): # 시나리오 첫 입력
            print("== SUCCESS ==")
            logId, state, output, intent, keyPhrase, chat_category, imageUrls = userIntent.predictIntent(uid, productName, userInput, intent, keyPhrase, originalUserInput)
            # print(imageUrls)
            # return Message.Message(state, output, intent, keyPhrase, logId, uid, chat_category, 0, productName, imageUrls)
            return {"state":state,"text":output, "intent":intent, "keyPhrase":keyPhrase, "log":[logId,uid,chat_category,output,0,productName], "imageUrls":imageUrls}

        elif(state=="REQUIRE_PRODUCTNAME"): # 상품명이 필요한 경우 ex.처음부터 "가격 알려줘"라고 입력한 경우
            print("== REQUIRE_PRODUCTNAME ==")
            try:
                logId, state, output, chat_category, imageUrls = userIntent.getNounFromInput(uid, userInput)
                return {"state":state,"text":output, "intent":intent, "keyPhrase":keyPhrase, "log":[logId,uid,chat_category,output,0,productName], "imageUrls":imageUrls}
            except:
                logId, state, output, intent, keyPhrase, chat_category, imageUrls = userIntent.predictIntent(uid, productName, userInput, intent, keyPhrase, originalUserInput)
                return {"state":state,"text":output, "intent":intent, "keyPhrase":keyPhrase, "log":[logId,uid,chat_category,output,0,productName]}

        elif(state=="REQUIRE_DETAIL"): # 자세한 상품명 받은 후
            print("== REQUIRE_DETAIL ==")
            if(intent == "NONE"):
                output = productName+"에 대해 어떤 것을 도와드릴까요?"
                product_question_idx = randint(0,PRODUCT_QUESTION_EXAMPLE_CNT-1)
                summary_question_idx = randint(0,SUMMARY_QUESTION_EXAMPLE_CNT-1)
                output = output + "%=" + PRODUCT_QUESTION_EXAMPLE[product_question_idx]
                output = output + "%=" + SUMMARY_QUESTION_EXAMPLE[summary_question_idx]
                logId = usingDB.saveLog(uid,0,output,0,productName)
                return {"state":"REQUIRE_QUESTION","text":output, "intent":intent, "keyPhrase":keyPhrase, "log":[logId,uid,0,output,0,productName], "productName":productName}
            else:
                logId, state, output, chat_category = userIntent.processOnlyNoun(uid, productName, keyPhrase)
                return {"state":state,"text":output, "intent":"NONE", "keyPhrase":keyPhrase, "log":[logId,uid,chat_category,output,0,productName]}

        elif(state=="REQUIRE_QUESTION"): # 사용자 요청 받은 후
            print("== REQUIRE_QUESTION ==")
            logId, state, output, chat_category = userIntent.processOnlyNoun(uid,productName,userInput)
            return {"state":state,"text":output, "intent":"NONE", "keyPhrase":keyPhrase, "log":[logId,uid,chat_category,output,0,productName] }
    except Exception as e: 
        print(e)
        print("=========== save error ================")
        logId = usingDB.saveLog(uid,0,SEND_FAIL_MSG,0)
        usingDB.saveErrorLog(uid+"/user-input"+" => "+state, str(e))
        return Message.FallBack(uid, logId)


if __name__ == "__main__":
    app.run(debug = True, host='0.0.0.0', port=9900, threaded=True)