import os
import sys
import urllib.request
import json


def papagoTranslate(inputsentence):
    client_id = "5uX5UPr9xggJjoDhY4Mq" # 개발자센터에서 발급받은 Client ID 값
    client_secret = "hArlTAhKTK" # 개발자센터에서 발급받은 Client Secret 값
    encText = urllib.parse.quote(inputsentence) # 여기에 inputsentence 를 집어넣으면 된다
    data = "source=ko&target=en&text=" + encText
    url = "https://openapi.naver.com/v1/papago/n2mt"
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id",client_id)
    request.add_header("X-Naver-Client-Secret",client_secret)
    response = urllib.request.urlopen(request, data=data.encode("utf-8"))
    rescode = response.getcode()
    if(rescode==200):
        response_body = response.read()
        decode = json.loads(response_body.decode('utf-8'))
        result = decode['message']['result']['translatedText']
        print("translate text ->> : ",result)
        return result
    else:
        print("PaPago Error Code:" + rescode)