import requests
from bs4 import BeautifulSoup
from konlpy.tag import Okt
import json
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from ckonlpy.tag import Twitter  # pip install customized_konlpy
import math
from hanspell import spell_checker
import usingDB
from gensim.models.keyedvectors import KeyedVectors
from gensim.models import FastText as FT
import re
import Intent.CrawlingProduct as CrawlingProduct
import Intent.Scenario as Scenario
import Intent.isValidQuery as isValidQuery
import ReviewAware
import SummaryReview
import papago


model = SentenceTransformer('jhgan/ko-sbert-multitask')
twitter = Twitter()

user_intent_recommend = "RECOMMEND"
user_intent_iteminfo = "ITEM_INFO"
user_intent_reviewsum = "REVIEW_SUM"
user_intent_dontknow = "DONT_KNOW"

specialwordsFileFullPath = "./data/specialwords.csv"
stopwordsFileFullPath = "./data/stopwords.csv"

df_specialwords = pd.read_csv(specialwordsFileFullPath, encoding='cp949')

classificationNouns = df_specialwords["classification_noun"].astype(str).tolist() # 무조건 명사로 분류할 것들
classificationNouns = [x for x in classificationNouns if x != 'nan']

productNameNouns = df_specialwords["product_name"].astype(str).tolist() # 무조건 명사로 분류할 것들
productNameNouns = [x for x in productNameNouns if x != 'nan']

specialwords = df_specialwords["specialwords"].astype(str).tolist()
specialwords = [x for x in specialwords if x != 'nan']

df_specialwords.drop_duplicates(subset=['specialwords_noun'], inplace=True)  # 중복된 행 제거
specialwords_noun = df_specialwords["specialwords_noun"].astype(str).tolist()
specialwords.extend(specialwords_noun)

df_stopwords = pd.read_csv(stopwordsFileFullPath, encoding='cp949')
stopwords = df_stopwords["stopwords"].astype(str).tolist()
stopwords = [x for x in stopwords if x != 'nan']

##### 별도 처리 단어
#print(specialwords)
twitter.add_dictionary(specialwords+classificationNouns+productNameNouns, 'Noun')

dict_productName = {}
for idx,noun in enumerate(productNameNouns):
    dict_productName["=+"+str(idx)+"+="] = noun

##### 코사인 유사도 2중 분류
def get_max_cosim(type: str, cossim):
    # print(type(cossim)) # cossim -> 넘파이 배열 형식
    max_cosim = np.max(cossim)
    print(type + " => " + str(max_cosim))
    return max_cosim


##### 코사인 유사도 3중 분류
def print_max_type(recommend_max_cosim, detail_max_cosim, summary_max_cosim):
    max_cosim = np.max([recommend_max_cosim, detail_max_cosim, summary_max_cosim])
    # print(str(max_cosim))
    if max_cosim > 0.65:
        if max_cosim == recommend_max_cosim:
            # print("상품 추천")
            user_intent = user_intent_recommend
        elif max_cosim == detail_max_cosim:
            # print("상품 정보 제공")
            user_intent = user_intent_iteminfo
        elif max_cosim == summary_max_cosim:
            # print("요약본 제공")
            user_intent = user_intent_reviewsum
    else:
        # print("알 수 없음")
        user_intent = user_intent_dontknow
    return user_intent



def isPriceQuestion(model, otherWords_noun):
    modified_otherWords_noun = [otherWord for otherWord in otherWords_noun if len(otherWord)>1]
    input = " ".join(modified_otherWords_noun)
    input_encode = model.encode(input)
    price_encode = model.encode("가격")
    price_cosim = cosine_similarity([input_encode], [price_encode])
    print("가격, "+input+"의 cosine similarity => "+str(price_cosim[0][0]))
    
    if price_cosim[0][0] > 0.57:
        return True
    else:
        return False

def findProductInfo(productName, otherWords_noun):
    productInfo = {}

    try: 
        if isPriceQuestion(model, otherWords_noun):
            return CrawlingProduct.findPrice(productName)

        # 네이버 크롤링을 통해 productName에 해당하는 상품 정보 가져오기
        response = requests.get("https://search.shopping.naver.com/search/all?origQuery=" + productName +
                                "&pagingSize=40&productSet=model&query=" + productName + "&sort=review&timestamp=&viewType=list")
        html = response.text
        # html 번역
        soup = BeautifulSoup(html, 'html.parser')
        itemLists = soup.select('a.basicList_link__JLQJf')  # basicList_link__JLQJf = 네이버 쇼핑몰 상품명 태그

        print("")
        print("### 네이버 상품 정보 검색 결과 ###")
        print(itemLists)
        if len(itemLists)>0:
        
            item = itemLists[0]
            itemTitle = item.get("title")
            itemId = None
            
            url = item.get("href")
            urlInfos = url.split("&")
            for info in urlInfos:
                if("nvMid" in info):
                    itemId = info.split("=")[1].strip()

            response = requests.get("https://search.shopping.naver.com/catalog/" + itemId)
            html = response.text
            html_data = BeautifulSoup(html, 'html.parser')
            for data in html_data.select("span.top_cell__5KJK9"): # product 상세 정보 가져오기
                data = str(data).replace("<!-- -->", "")
                modified_data = re.sub('<.*?>',"", data)
                if ":" in modified_data:
                    split_data = modified_data.split(":")
                    productInfo[split_data[0].replace(" ","").strip()] = split_data[1].strip()
    except Exception as e: 
        print(e)
        productInfoFromDB = usingDB.getProductInfo(productName)
        productInfo = json.loads(productInfoFromDB)
    
    print("==============================")
    print(productInfo)
    result = ""
    if productInfo != "":
        print("====findProductInfo======")
        print(productName)
        if len(otherWords_noun) > 0:
            print(otherWords_noun)
            print(otherWords_noun[0])

            #fasttext_noun = fastText(otherWords_noun[0])
            print("~~~~")
            itemDetailList = []
            
            for key in productInfo:
                key = key.upper()
                value = productInfo[key]
                print(key, value)
                print('<----->')
                itemDetailList.append(key)
               
                # 모든 상품 정보를 json 형식에서 list 형식으로 담아 놓은 뒤 search 진행
            print(itemDetailList)
            
            for itemkey in itemDetailList:
                if itemkey.find(otherWords_noun[0]) >=0 or otherWords_noun[0].find(itemkey) >=0:
                    print(productInfo[itemkey])
                    result = otherWords_noun[0] + " 검색결과 " + otherWords_noun[0] + "은(는) " + productInfo[itemkey] + "입니다."
            
            # 상품정보 검색 실패한 경우 fasttext사용
            if result == "":
                fasttext_noun = fastText(otherWords_noun[0])
                if otherWords_noun[0].find(fasttext_noun) >=0 or fasttext_noun.find(otherWords_noun[0]) >=0 :
                    print(productInfo[fasttext_noun])
                    result = otherWords_noun[0] + " 검색결과 " + otherWords_noun[0] + "은(는) " + productInfo[fasttext_noun] + "입니다."

            # fasttext에서도 상품정보 검색 실패한 경우
            if result == "":
                papago_noun = papago.papagoTranslate(otherWords_noun[0])
                if otherWords_noun[0].find(papago_noun) >=0 or papago_noun[0].find(otherWords_noun[0]) >=0:
                    print(productInfo[papago_noun])
                    result = otherWords_noun[0] + " 검색결과 " + otherWords_noun[0] + "은(는) " + productInfo[papago_noun] + "입니다."
                
            if result == "":
                result = "해당 정보가 존재하지 않습니다."
        else:
            result = "해당 정보가 존재하지 않습니다."
    else:
            result = "해당 정보가 존재하지 않습니다."
    print("result ==>" + result)
    return result


def fastText(otherWords_noun):
    ### FastText : otherWords_noun과 유사한 단어찾기 ex) 색 & 색상
    otherWords_noun_origin = otherWords_noun
    vectorFilePath = "./data/cc.ko.300.vec"
    with open(vectorFilePath, "r", encoding='UTF-8') as f:
        word_size, vector_size = f.readline().split(" ")
        # print(f"word_size  : {word_size:7s}")
        print("==" * 20)

    fasttext = KeyedVectors.load_word2vec_format(vectorFilePath, limit=50000)
    # print(f"Type of model: {type(fasttext)}")

    try:
        findSimilarWord = fasttext.most_similar(otherWords_noun)
        print(findSimilarWord)
        print("==" * 20)

        for index, value in enumerate(findSimilarWord):
            for index, specialwords_noun_value in enumerate(specialwords_noun):
                if value[0] == specialwords_noun_value:
                    otherWords_noun = specialwords_noun_value
                    break

        print("Similar Word is ====>>" + otherWords_noun)
        return otherWords_noun
    except:
        return otherWords_noun_origin



##### (무게 알려줘)-(그램 16 어쩌고) 접근했을때 -> 요약본 or 상품정보
def processOnlyNoun(userId, productName, inputsentence):
    words_noun, otherWords_noun = splitWords(inputsentence)

    # 상품명 선택 이후 유효한 쿼리 인지 검증
    # if isValidQuery.checkValidQuery(inputsentence) == False:
    #     print("CheckValidQuery is False")
    #     output = "유효하지 않은 검색입니다."
    #     chat_category = 0
    #     state = "FALLBACK"
    #     user_intent = "Uninvalid Searching"
    #     logId = usingDB.saveLog(userId, chat_category, output, 0, productName)
    #     return logId, state, output, chat_category
    # else:
    #     print("CheckValidQuery is True")

    input_encode = model.encode(inputsentence)

    detail_encode = model.encode(Scenario.item_info)
    summary_encode = model.encode(Scenario.review_sum)

    cosim_input_detail = cosine_similarity([input_encode], detail_encode)
    cosim_input_summary = cosine_similarity([input_encode], summary_encode)

    detail_max_cosim = get_max_cosim(user_intent_iteminfo, cosim_input_detail)
    summary_max_cosim = get_max_cosim(user_intent_reviewsum, cosim_input_summary)

    print(str(np.max([detail_max_cosim, summary_max_cosim])))

    # 상품 정보 제공
    if detail_max_cosim > summary_max_cosim and detail_max_cosim > 0.6:
        user_intent = user_intent_iteminfo
        print("===========확인=============")
        output = findProductInfo(productName, otherWords_noun)
        chat_category = 3
        state = "SUCCESS"
    # 요약본 제공
    elif detail_max_cosim < summary_max_cosim and summary_max_cosim > 0.6:
        user_intent = user_intent_reviewsum
        output = SummaryReview.previewSummary(productName)
        chat_category = 1
        state = "SUCCESS"
    else:
        user_intent = user_intent_dontknow
        output = "채팅을 이해하지 못했습니다."
        chat_category = 0
        state = "FALLBACK"

    print("유저의 의도는 [ " + user_intent + " ] 입니다")
    logId = usingDB.saveLog(userId, chat_category, output, 0, productName)
    return logId, state, output, chat_category


def splitWords(inputsentence):
    ####################################
    # 사용자가 입력한 문장에서 "specialwords 제외한 명사, 숫자, 영어 / 그 외 단어"로 분리
    #
    # inputsentence : 사용자가 입력한 문장
    # return
    #   : words = specialwords 제외한 명사, 숫자, 영어 
    #   : otherWords = 그 외 단어
    ####################################

    words = []  # specialwords 제외한 'Noun', 'Number', 'Alpha'
    otherWords = []  # words[]에 포함되지 않는 단어들
    # inputsentence = (spell_checker.check(inputsentence)[2])
    # print("Modified Sentence => " + inputsentence)
    #inputsentence = inputsentence.replace(" ", "")
    print("===== Split Words =====")
    #print(specialwords)
    for word in twitter.pos(inputsentence):
        print(word[0] + " " + word[1])
        if word[1] in ['Noun', 'Number', 'Alpha']:
            if not word[0] in specialwords:
                isAppend = False
                for productDetailWord in specialwords_noun:
                    if word[0] in productDetailWord:
                        otherWords.append(word[0])
                        isAppend = True
                        break
                
                if not isAppend:
                    words.append(word[0])
            else:
                otherWords.append(word[0])
        elif word[1] != "Punctuation":
            otherWords.append(word[0])

    return words, otherWords

def getNounFromInput(userId, inputsentence):
    ####################################
    # 사용자가 입력한 문장에서 명사(제품명) 추출
    #
    # inputsentence : 사용자가 입력한 문장
    ####################################

    words, otherWords = splitWords(inputsentence)

    print(words)
    print(otherWords)
    if len(otherWords) != 0:
        return "FALLBACK", "죄송합니다. 무슨 말인지 이해하지 못했습니다."
    searchItem = "".join(words)
    print("****** "+searchItem+" 검색해보기 ******")
    realItemNames, chat_category, imageUrls = getProductNames(searchItem) # 자세한 상품명 제공
    
    logId = usingDB.saveLog(userId,chat_category,realItemNames,0)
    print("REQUIRE_DETAIL")
    return logId, "REQUIRE_DETAIL", realItemNames, chat_category, imageUrls


def getProductNames(searchItem):
    ####################################
    # 네이버 쇼핑에서 상품명 알아오기
    #
    # searchItem : 네이버 쇼핑에 검색할 단어
    # return result(검색결과), chat_category(0/5)
    ####################################

    realItemNames = CrawlingProduct.findProductNames(searchItem) # 상품명 크롤링
    imageUrls = []
    output = ""
    chat_category = 5
    if len(realItemNames) == 0:
        output = "지원하지 않는 상품입니다."
        chat_category = 0
    else:
        for itemName in realItemNames:
            imageUrls.append(CrawlingProduct.findImageUrl(itemName))
        output = ",".join(realItemNames)+", 원하시는 상품이 있는 경우 클릭해주세요!\n찾으시는 상품명이 없는 경우 상품명을 자세히 작성해주세요."
    return output, chat_category, imageUrls


def predictIntent(userId, productName, inputsentence, intent, keyPhrase):
    ####################################
    # 사용자가 입력한 문장 의도 판단
    #
    # productName : 사용자가 원하는 productName
    # inputsentence : 사용자가 입력한 문장
    # intent : 판단된 사용자 질문 의도 
    # keyPhrase : 사용자 질문 중 핵심 문구
    ####################################
    originSentence = inputsentence
    recSentence = inputsentence
    for stopword in stopwords:
        inputsentence = inputsentence.replace(stopword,"")
    
    input_encode = model.encode(inputsentence)
    words, otherWords = splitWords(inputsentence)

    print("Words >>>",words)
    print("otherWords >>>", otherWords)

    
    # 입력을 명사로만 접근했을때
    if (len(otherWords) == 0):
        searchItem = "".join(words)
        realItemNames,chat_category,imageUrls = getProductNames(searchItem) # 자세한 상품명 제공
        logId = usingDB.saveLog(userId,chat_category,realItemNames,0)
        return logId, "REQUIRE_DETAIL", realItemNames, intent, keyPhrase, chat_category, imageUrls

    # 추천, 상품 정보, 요약본 분류, 알수없음
    else:
        imageUrls = []
        output = ""
        state = ""

        inputsentence = " ".join(otherWords)
        if len([otherWord for otherWord in otherWords if len(otherWord)==1]) == len(otherWords):
            state = "FALLBACK"
            output = "채팅을 이해하지 못했습니다."
            print("유저의 의도를 알 수 없습니다 !!")
            keyPhrase = ""
            chat_category = 0
        else:
            keyPhrase = inputsentence
            input_encode = model.encode(keyPhrase)
            rec_encode = model.encode(Scenario.recommend)
            detail_encode = model.encode(Scenario.item_info)
            summary_encode = model.encode(Scenario.review_sum)

            cosim_input_rec = cosine_similarity([input_encode], rec_encode)  # 상품 추천 유사도
            cosim_input_detail = cosine_similarity([input_encode], detail_encode)  # 상품 정보 유사도
            cosim_input_summary = cosine_similarity([input_encode], summary_encode)  # 요약본 유사도

            recommend_max_cosim = get_max_cosim(user_intent_recommend, cosim_input_rec)
            detail_max_cosim = get_max_cosim(user_intent_iteminfo, cosim_input_detail)
            summary_max_cosim = get_max_cosim(user_intent_reviewsum, cosim_input_summary)

            # "추천"들어갈 경우 추천 가중치
            if "추천" in keyPhrase:
                recommend_max_cosim += 0.2
                print("RECOMMEND 가중치 +0.2")

            if "사양" in keyPhrase or "스펙" in keyPhrase or "성능" in keyPhrase or "상세정보" in keyPhrase: 
                summary_max_cosim += 0.2
            
            # if originSentence.find("사양") > 0 or originSentence.find("스펙") > 0:
            #     state = "SUCCESS"
            #     output = SummaryReview.previewSummary(productName)
            #     chat_category = 1
            #     print("require product spec")
            #     return logId, state, output, chat_category
                
            
            intent = print_max_type(recommend_max_cosim, detail_max_cosim, summary_max_cosim)

            if intent == user_intent_recommend:
                state = "SUCCESS"
                output, imageUrls = ReviewAware.reviewAware(recSentence)
                chat_category = 2
                print("유저의 의도는 [ " + intent + " ] 입니다")

            elif intent == user_intent_iteminfo:
                print("elif intent == user_intent_iteminfo:")
                if len(words) != 0: # 명사가 적혀있는 경우
                    print("len(words) != 0")
                    searchItem = "".join(words)
                    realItemNames,chat_category, imageUrls = getProductNames(searchItem) # 해당 명사가 상품명인지 판단
                    if chat_category == 5: # 상품명인 경우
                        logId = usingDB.saveLog(userId,chat_category,realItemNames,0)
                        return logId, "REQUIRE_DETAIL", realItemNames, intent, keyPhrase,chat_category, imageUrls
                    elif productName == "": # 상품명 정보가 어디에도 없는 경우
                        state = "REQUIRE_PRODUCTNAME"
                        output = "어떤 상품에 대해 궁금하신가요?"
                        chat_category = 0
                    else:
                        state = "SUCCESS"
                        output = findProductInfo(productName, otherWords)
                        chat_category = 3
                else:  # 명사
                    if productName == "": # 상품명 정보가 어디에도 없는 경우
                        state = "REQUIRE_PRODUCTNAME"
                        output = "어떤 상품에 대해 궁금하신가요?"
                        chat_category = 0
                    else:
                        state = "SUCCESS"
                        output = findProductInfo(productName, otherWords)
                        chat_category = 3

                print("유저의 의도는 [ " + intent + " ] 입니다")
            elif intent == user_intent_reviewsum:  # (삼성 오디세이 요약본 줘)
                if productName == "":
                    state = "REQUIRE_PRODUCTNAME"
                    output = "어떤 상품에 대해 궁금하신가요?"
                    chat_category = 0
                else:
                    state = "SUCCESS"
                    output = SummaryReview.previewSummary(productName)
                    chat_category = 1
                print("유저의 의도는 [ " + intent + " ] 입니다")
            else:
                state = "FALLBACK"
                output = "채팅을 이해하지 못했습니다."
                print("유저의 의도를 알 수 없습니다 !!")
                keyPhrase = ""
                chat_category = 0
        logId = usingDB.saveLog(userId, chat_category, output, 0, productName)
        return logId, state, output, intent, keyPhrase, chat_category, imageUrls
