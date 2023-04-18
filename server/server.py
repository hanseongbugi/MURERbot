from flask import Flask, request
from flask_cors import CORS # pip install flask_cors
import userIntent, signUp, signIn, usingDB

app = Flask(__name__)
app.config["SECRET_KEY"] = "hansungfanoiv23587v988erncnjke9332nfewll"
CORS(app)

SEND_FAIL = "FALLBACK"
SEND_FAIL_MSG = "메시지 전송에 실패했습니다. 다시 요청해주세요"

@app.route('/registerNewUser', methods=['POST'])
def register_user(): # 회원가입
    try:
        print("====== registerNewUser ======")
        print(request.json)

        registerInfo = request.json
        registerResult = signUp.registerUser(registerInfo["userId"],registerInfo["userPw"],registerInfo["userNickname"])
        return {"state":registerResult}
    except:
        return {"state":SEND_FAIL}
    
@app.route('/doubleCheckID', methods=['POST'])
def doubleCheckID(): # 회원가입 가능한 id인지 확인
    try:
        print("====== checkDuplicateID ======")
        print(request.json)

        registerResult = signUp.doubleCheckID(request.json["userId"])
        return {"state":registerResult}
    except:
        return {"state":SEND_FAIL}

@app.route('/signInUser', methods=['POST'])
def signInUser(): # 로그인
    try:
        print("====== signInUser ======")
        print(request.json)

        signInInfo = request.json # 사용자가 웹에서 입력한 id, pw
        registerResult, nickname, logs = signIn.checkValidInfo(signInInfo["userId"], signInInfo["userPw"])
        return {"state":registerResult, "nickname":nickname, "log":logs}
    except:
        return {"state":SEND_FAIL, "nickname":"", "log":[]}


# 웹에서 보낸 json 처리
# {
#   'text': '웹에서 사용자가 입력한 문장',
#   'state': 'SUCCESS/REQUIRE_DETAIL/REQUIRE_QUESTION/REQUIRE_NAME/FALLBACK',
#   'productName': '사용자가 원하는 상품 이름'
# }
@app.route('/getUserInput',methods=['POST'])
def get_input():
    print("====== getUserInput ======")
    print(request.json)

    userId = request.json["userId"]
    userInput = request.json["text"]
    state = request.json["state"]
    productName = request.json["productName"]
    intent = request.json["intent"]
    keyPhrase = request.json["keyPhrase"]

    if len(userInput)==0:
        usingDB.saveLog(userId,0,productName,1)
    else:
        usingDB.saveLog(userId,0,userInput,1) # 사용자가 보낸 채팅 db에 기록

    try:
        if(state=="SUCCESS"): # 시나리오 첫 입력
            print("== SUCCESS ==")
            state, output, intent, keyPhrase = userIntent.predictIntent(userId, productName, userInput, intent, keyPhrase)
            return {"state":state,"text":output, "intent":intent, "keyPhrase":keyPhrase}
        
        elif(state=="REQUIRE_PRODUCTNAME"): # 상품명이 필요한 경우 ex.처음부터 "가격 알려줘"라고 입력한 경우
            print("== REQUIRE_PRODUCTNAME ==")
            state, output = userIntent.getNounFromInput(userId, userInput)
            return {"state":state,"text":output, "intent":intent, "keyPhrase":keyPhrase}
        
        elif(state=="REQUIRE_DETAIL"): # 자세한 상품명 받은 후
            print("== REQUIRE_DETAIL ==")
            if(intent == "NONE"):
                output = productName+"에 대해 어떤 것을 도와드릴까요?"
                usingDB.saveLog(userId,0,output,0)
                return {"state":"REQUIRE_QUESTION","text":output, "intent":intent, "keyPhrase":keyPhrase}
            else:
                state, output = userIntent.processOnlyNoun(userId, productName, keyPhrase)
                return {"state":state,"text":output, "intent":"NONE", "keyPhrase":keyPhrase}
        
        elif(state=="REQUIRE_QUESTION"): # 사용자 요청 받은 후
            print("== REQUIRE_QUESTION ==")
            state, output = userIntent.processOnlyNoun(userId,productName,userInput)
            return {"state":state,"text":output, "intent":"NONE", "keyPhrase":keyPhrase }
    except:
        usingDB.saveLog(userId,0,SEND_FAIL_MSG,0)
        return {"state":"FALLBACK","text":SEND_FAIL_MSG, "intent":"NONE", "keyPhrase":""}


if __name__ == "__main__":
    app.run(debug = True, host='0.0.0.0', port=9900)