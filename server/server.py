from flask import Flask, request
from flask_cors import CORS # pip install flask_cors
import userIntent

app = Flask(__name__)
CORS(app)

@app.route('/users', methods=['GET'])
def get_users():
    print("get_users")
    print("=====request======")
    print(request)
    print("======request.form=======")
    print(request.form)
    print(request.form.get('member',"몰라"))
   # users 데이터를 Json 형식으로 반환한다
    return {"members": [{ "id" : 1, "name" : "yerin" },
                   { "id" : 2, "name" : "dalkong" }]}

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

    userInput = request.json["text"]
    state = request.json["state"]
    productName = request.json["productName"]
    intent = request.json["intent"]
    keyPhrase = request.json["keyPhrase"]

    try:
        if(state=="SUCCESS"): # 시나리오 첫 입력
            print("== SUCCESS ==")
            state, output, intent, keyPhrase = userIntent.predictIntent(productName, userInput, intent, keyPhrase)
            return {"state":state,"text":output, "intent":intent, "keyPhrase":keyPhrase}
        
        elif(state=="REQUIRE_PRODUCTNAME"): # 상품명이 필요한 경우 ex.처음부터 "가격 알려줘"라고 입력한 경우
            print("== REQUIRE_PRODUCTNAME ==")
            state, output = userIntent.getNounFromInput(userInput)
            return {"state":state,"text":output, "intent":intent, "keyPhrase":keyPhrase}
        
        elif(state=="REQUIRE_DETAIL"): # 자세한 상품명 받은 후
            print("== REQUIRE_DETAIL ==")
            if(intent == "NONE"):
                return {"state":"REQUIRE_QUESTION","text":productName+"에 대해 어떤 것을 도와드릴까요?", "intent":intent, "keyPhrase":keyPhrase}
            else:
                state, output = userIntent.processOnlyNoun(productName, keyPhrase)
                return {"state":state,"text":output, "intent":"NONE", "keyPhrase":keyPhrase}
        
        elif(state=="REQUIRE_QUESTION"): # 사용자 요청 받은 후
            print("== REQUIRE_QUESTION ==")
            state, output = userIntent.processOnlyNoun(productName,userInput)
            return {"state":state,"text":output, "intent":"NONE", "keyPhrase":keyPhrase }
    except:
        return {"state":"FALLBACK","text":"메시지 전송에 실패했습니다. 다시 요청해주세요", "intent":"NONE", "keyPhrase":""}


if __name__ == "__main__":
    app.run(debug = True)