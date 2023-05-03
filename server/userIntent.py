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

model = SentenceTransformer('jhgan/ko-sbert-multitask')
twitter = Twitter()

user_intent_recommand = "RECOMMEND"
user_intent_iteminfo = "ITEM_INFO"
user_intent_reviewsum = "REVIEW_SUM"
user_intent_dontknow = "DONT_KNOW"

specialwordsFileFullPath = "./data/specialwords.csv"
stopwordsFileFullPath = "./data/stopwords.csv"

df_specialwords = pd.read_csv(specialwordsFileFullPath, encoding='cp949')
df_specialwords.drop_duplicates(subset=['specialwords_noun'], inplace=True)  # 중복된 행 제거

df_stopwords = pd.read_csv(stopwordsFileFullPath, encoding='cp949')

specialwords_noun = df_specialwords["specialwords_noun"].astype(str).tolist()
specialwords = df_specialwords["specialwords"].astype(str).tolist()
specialwords = [x for x in specialwords if x != 'nan']
specialwords.extend(specialwords_noun)

stopwords = df_stopwords["stopwords"].astype(str).tolist()
stopwords = [x for x in stopwords if x != 'nan']

##### 별도 처리 단어
#print(specialwords)
twitter.add_dictionary(specialwords, 'Noun')

##### 코사인 유사도 2중 분류
def get_max_cosim(type: str, cossim):
    # print(type(cossim)) # cossim -> 넘파이 배열 형식
    max_cosim = np.max(cossim)
    print(type + " => " + str(max_cosim))
    return max_cosim


##### 코사인 유사도 3중 분류
def print_max_type(recommand_max_cosim, detail_max_cosim, summary_max_cosim):
    max_cosim = np.max([recommand_max_cosim, detail_max_cosim, summary_max_cosim])
    # print(str(max_cosim))
    if max_cosim > 0.6:
        if max_cosim == recommand_max_cosim:
            # print("상품 추천")
            user_intent = user_intent_recommand
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


##### 예상되는 유저 sentence array
greeting = ['안녕','안녕하세요','하이','ㅎㅇ']
thanks = ['감사합니다','감사','고마워','ㄳ','ㄱㅅ']
recommand = ['적합한 추천해줘', '적합한 뭐 있어', '적합한 알려줘', '적합한 추천', '뭐있어', "뭐 있어", "뭐 살까", "뭐가 좋아", "추천해줘", '할만한 추천', '할만한 알려줘',
             '하기 좋은 알려줘', '하기 좋은 추천', '적합한', '추천', '가벼운 알려줘', '저렴한 알려줘', '가벼운 추천', '저렴한 추천', '예쁜 추천', '예쁜 알려줘', '큰 알려줘', '큰 추천',
             '작은 알려줘', '작은 추천', '괜찮은 추천', '괜찮은 알려줘', '좋은 추천', '좋은 알려줘', '좋은', "안 끊기는", "잘 돌아가는"]

item_info = ['무게 알려줘', '무게 정보', '무게 정보 알려줘', '무게 어때', '무게 어떤지 알려줘',
             '가격 알려줘', '가격 정보', '가격 정보 알려줘', '가격 어때', '가격 어떤지 알려줘',
             '색 알려줘', '색 정보', '색 정보 알려줘', '색 어때', '색 어떤지 알려줘',
             '크기 알려줘', '크기 정보', '크기 정보 알려줘', '크기 어때', '크기 어떤지 알려줘', '사이즈 알려줘',
             '사이즈 어때', '사이즈 정보', '사이즈 정보 알려줘' '사이즈 어떤지 알려줘', '부가기능', '기능']

review_sum = ['리뷰 알려줘', '리뷰', '리뷰 요약 알려줘', '리뷰 요약', '리뷰 요약본', '리뷰 요약본 알려줘',
              '요약', '요약본', '요약해줘', '반응 어때', '반응 알려줘']




def findProductInfo(productName, otherWords_noun):
    productInfo = {}

    try: # 네이버 크롤링을 통해 productName에 해당하는 상품 정보 가져오기
        response = requests.get("https://search.shopping.naver.com/search/all?origQuery=" + productName +
                                "&pagingSize=40&productSet=model&query=" + productName + "&sort=review&timestamp=&viewType=list")
        html = response.text
        # html 번역
        soup = BeautifulSoup(html, 'html.parser')
        itemLists = soup.select('a.basicList_link__JLQJf')  # basicList_link__JLQJf = 네이버 쇼핑몰 상품명 태그

        print("")
        print("### 네이버 쇼핑몰 검색 결과 ###")
        

        if len(itemLists)>0:
        
            item = itemLists[0]
            itemTitle = item.get("title")
            itemId = None
            
            url = item.get("href")
            urlInfos = url.split("&")
            for info in urlInfos:
                if("nvMid" in info):
                    itemId = info.split("=")[1].strip()
            print("상품명 : " + itemTitle + " / 상품Id : "+str(itemId))

            response = requests.get("https://search.shopping.naver.com/catalog/" + itemId)
            html = response.text
            html_data = BeautifulSoup(html, 'html.parser')
            for data in html_data.select("span.top_cell__5KJK9"): # product 상세 정보 가져오기
                data = str(data).replace("<!-- -->", "")
                modified_data = re.sub('<.*?>',"", data)
                if ":" in modified_data:
                    split_data = modified_data.split(":")
                    productInfo[split_data[0].strip()] = split_data[1].strip()
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

            fasttext_noun = fastText(otherWords_noun[0])
            print("")

            
            for key in productInfo:
                value = productInfo[key]
                print(key, value)
                # 상품명(명사)만 입력했을 경우 otherWords가 비어있게 되므로
                # item_details 리스트 사용
                if key.strip() == otherWords_noun[0]:
                    print("")
                    find_data = value
                    result = key.strip() + " 검색결과 " + key.strip() + "은(는) " + find_data + "입니다."
                    break
                elif key.strip() == fasttext_noun:
                    print("")
                    find_data = value
                    result = key.strip() + " 검색결과 " + key.strip() + "은(는) " + find_data + "입니다."
                    break
            if result == "":
                result = f"{otherWords_noun[0]} 정보가 존재하지 않습니다."
        else:
            result = "정보가 존재하지 않습니다."
    else:
            result = "정보가 존재하지 않습니다."
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

    input_encode = model.encode(inputsentence)

    detail_encode = model.encode(item_info)
    summary_encode = model.encode(review_sum)

    cosim_input_detail = cosine_similarity([input_encode], detail_encode)
    cosim_input_summary = cosine_similarity([input_encode], summary_encode)

    detail_max_cosim = get_max_cosim(user_intent_iteminfo, cosim_input_detail)
    summary_max_cosim = get_max_cosim(user_intent_reviewsum, cosim_input_summary)

    print(str(np.max([detail_max_cosim, summary_max_cosim])))

    # 상품 정보 제공
    if detail_max_cosim > summary_max_cosim and detail_max_cosim > 0.7:
        user_intent = user_intent_iteminfo
        print("===========확인=============")
        output = findProductInfo(productName, otherWords_noun)
        chat_category = 3
        state = "SUCCESS"
    # 요약본 제공
    elif detail_max_cosim < summary_max_cosim and summary_max_cosim > 0.7:
        user_intent = user_intent_reviewsum
        output = "요약본 제공 구현 예정입니다"
        chat_category = 1
        state = "SUCCESS"
    else:
        user_intent = user_intent_dontknow
        output = "채팅을 이해하지 못했습니다."
        chat_category = 0
        state = "FALLBACK"

    print("유저의 의도는 [ " + user_intent + " ] 입니다")
    logId = usingDB.saveLog(userId, chat_category, output, 0)
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
    print("++++++++++++++++++++")
    #print(specialwords)
    for word in twitter.pos(inputsentence):
        print(word[0] + " " + word[1])
        if word[1] in ['Noun', 'Number', 'Alpha']:
            if not word[0] in specialwords:
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
    realItemNames, chat_category = getProductNames(searchItem) # 자세한 상품명 제공
    
    logId = usingDB.saveLog(userId,chat_category,realItemNames,0)
    return logId, "REQUIRE_DETAIL", realItemNames, chat_category


def getProductNames(searchItem):
    ####################################
    # 네이버 쇼핑에서 상품명 알아오기
    #
    # searchItem : 네이버 쇼핑에 검색할 단어
    # return : 네이버 쇼핑 검색 결과 (5개 상품명)
    ####################################

    realItemNames = []
    # 가격비교>리뷰순으로 아이템 검색한 링크
    response = requests.get("https://search.shopping.naver.com/search/all?origQuery=" + searchItem +
                            "&pagingSize=40&productSet=model&query=" + searchItem + "&sort=review&timestamp=&viewType=list")
    html = response.text
    # html 번역
    soup = BeautifulSoup(html, 'html.parser')
    itemLists = soup.select('a.basicList_link__JLQJf')  # basicList_link__JLQJf = 네이버 쇼핑몰 상품명 태그

    print("")
    print("### 네이버 쇼핑몰 검색 결과 ###")
    for item in itemLists:
        itemTitle = item.get("title")
        if itemTitle != None:
            realItemNames.append(itemTitle)
            print("상품명 : " + itemTitle)

    output = ""
    chat_category = 5
    if len(realItemNames) == 0:
        output = "지원하지 않는 상품입니다."
        chat_category = 0
    else:
        output = ",".join(realItemNames)+", 원하시는 상품이 있는 경우 클릭해주세요!\n찾으시는 상품명이 없는 경우 상품명을 자세히 작성해주세요."
    return output, chat_category


def predictIntent(userId, productName, inputsentence, intent, keyPhrase):
    ####################################
    # 사용자가 입력한 문장 의도 판단
    #
    # productName : 사용자가 원하는 productName
    # inputsentence : 사용자가 입력한 문장
    # intent : 판단된 사용자 질문 의도 
    # keyPhrase : 사용자 질문 중 핵심 문구
    ####################################
    
    for stopword in stopwords:
        inputsentence = inputsentence.replace(stopword,"")
    input_encode = model.encode(inputsentence)
    words, otherWords = splitWords(inputsentence)

    print(words)
    print(otherWords)

    
    # 입력을 명사로만 접근했을때
    if (len(otherWords) == 0):
        searchItem = "".join(words)
        realItemNames,chat_category = getProductNames(searchItem) # 자세한 상품명 제공
        logId = usingDB.saveLog(userId,chat_category,realItemNames,0)
        return logId, "REQUIRE_DETAIL", realItemNames, intent, keyPhrase, chat_category

    # 추천, 상품 정보, 요약본 분류, 알수없음
    else:
        inputsentence = " ".join(otherWords)
        keyPhrase = inputsentence
        input_encode = model.encode(keyPhrase)
        rec_encode = model.encode(recommand)
        detail_encode = model.encode(item_info)
        summary_encode = model.encode(review_sum)

        cosim_input_rec = cosine_similarity([input_encode], rec_encode)  # 상품 추천 유사도
        cosim_input_detail = cosine_similarity([input_encode], detail_encode)  # 상품 정보 유사도
        cosim_input_summary = cosine_similarity([input_encode], summary_encode)  # 요약본 유사도

        recommand_max_cosim = get_max_cosim(user_intent_recommand, cosim_input_rec)
        detail_max_cosim = get_max_cosim(user_intent_iteminfo, cosim_input_detail)
        summary_max_cosim = get_max_cosim(user_intent_reviewsum, cosim_input_summary)

        # "추천"들어갈 경우 추천 가중치
        if "추천" in keyPhrase:
            recommand_max_cosim += 0.2
            print("RECOMMEND 가중치 +0.2")

        intent = print_max_type(recommand_max_cosim, detail_max_cosim, summary_max_cosim)
        if intent == user_intent_recommand:
            state = "SUCCESS"
            output = "!!!를 추천드립니다"
            chat_category = 2
            print("유저의 의도는 [ " + intent + " ] 입니다")
        elif intent == user_intent_iteminfo:
            if (productName == ""):
                if (len(words) != 0):
                    searchItem = "".join(words)
                    realItemNames,chat_category = getProductNames(searchItem) # 자세한 상품명 제공
                    logId = usingDB.saveLog(userId,chat_category,realItemNames,0)
                    return logId, "REQUIRE_DETAIL", realItemNames, intent, keyPhrase,chat_category
                state = "REQUIRE_PRODUCTNAME"
                output = "어떤 상품에 대해 궁금하신가요?"
                chat_category = 0
            else:  # (그램 16 무게 알려줘)
                state = "SUCCESS"
                output = findProductInfo(productName, otherWords)
                chat_category = 1
            print("유저의 의도는 [ " + intent + " ] 입니다")
        elif intent == user_intent_reviewsum:  # (삼성 오디세이 요약본 줘)
            if productName == "":
                state = "REQUIRE_PRODUCTNAME"
                output = "어떤 상품에 대해 궁금하신가요?"
                chat_category = 0
            else:
                state = "SUCCESS"
                output = "요약본 제공 구현 예정입니다"
                chat_category = 1
            print("유저의 의도는 [ " + intent + " ] 입니다")
        else:
            state = "FALLBACK"
            output = "채팅을 이해하지 못했습니다."
            print("유저의 의도를 알 수 없습니다 !!")
            keyPhrase = ""
            chat_category = 0
        logId = usingDB.saveLog(userId, chat_category, output, 0)
        return logId, state, output, intent, keyPhrase, chat_category
