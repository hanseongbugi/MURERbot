from hanspell import spell_checker
import Intent.userIntent as userIntent
import re
from ckonlpy.tag import Twitter

twitter = Twitter()

def replaceToNumber(word:str):
    notChanged = ""
    dict_productName = userIntent.dict_productName
    for key in dict_productName:
        noun = str(dict_productName[key])
        if noun in word:
            word = word.replace(noun, str(key))
            notChanged = word.replace(noun,"")

    if len(notChanged.replace(" ",""))>1:
        word = spell_checker.check(word).checked
    print("aa", word)

    for key in dict_productName:
        noun = str(dict_productName[key])
        if key in word:
            word = word.replace(str(key), noun)
    print(word)
    return word

def checkSpell(review):
    print("==== spell checking ====")
    review = re.sub('[\t\n\r\0]', ' ', review)  # 개행문자 제거
    review = review.strip()  # 양쪽 공백 제거
    review = review.replace(" ","") # 문장 내 공백 제거
    review = review.upper() # 문장 내 알파벳 대문자로 변환
    initialReview = review
    changePhrase = ""

    return replaceToNumber(review)
