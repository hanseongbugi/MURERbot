import requests
from bs4 import BeautifulSoup
from konlpy.tag import Okt
import json
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from ckonlpy.tag import Twitter # pip install customized_konlpy
import math



model = SentenceTransformer('jhgan/ko-sbert-multitask')
# okt = Okt()
twitter = Twitter()


user_intent_recommand = "상품 추천 요청"
user_intent_iteminfo = "상품 정보 요청"
user_intent_reviewsum = "리뷰 요약본 요청"
user_intent_dontknow = "의도 알수없음"

stopwordsFileFullPath = "./data/stopwords.csv"
laptopFilePath = "E:/Hansung/2023_Capstone/data/productInfo/laptop_product.json"
df_stopwords = pd.read_csv(stopwordsFileFullPath, encoding='cp949')


stopwords_noun = df_stopwords["stopwords_noun"].astype(str).tolist()
stopwords = df_stopwords["stopwords"].astype(str).tolist()
stopwords = [x for x in stopwords if x != 'nan']
stopwords.extend(stopwords_noun)

##### 네이버 쇼핑에서 상품명 알아오기
def getProductNames(searchItem):
    realItemNames = []
    # 리뷰순으로 아이템 검색한 링크
    response = requests.get("https://search.shopping.naver.com/search/all?origQuery="+searchItem+
                            "&pagingSize=40&productSet=total&query="+searchItem+"&sort=review&timestamp=&viewType=list")
    html = response.text
    # html 번역
    soup = BeautifulSoup(html, 'html.parser')
    itemLists = soup.select('a.basicList_link__JLQJf') #basicList_link__JLQJf = 네이버 쇼핑몰 상품명 태그

    print("")
    print("### 네이버 쇼핑몰 검색 결과 ###")
    for item in itemLists:
        itemTitle = item.get("title")
        if itemTitle != None:
            realItemNames.append(itemTitle)
            print("상품명 : " + itemTitle) 
    
    return ",".join(realItemNames)

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
    if max_cosim>0.65:
        if max_cosim == recommand_max_cosim:
            # print("상품 추천")
            user_intent = user_intent_recommand
        elif max_cosim == detail_max_cosim:
            # print("상품 정보 제공")
            user_intent = user_intent_iteminfo
        elif max_cosim == summary_max_cosim:
            # print("요약본 제공")
            user_intent = user_intent_reviewsum
    else :
        # print("알 수 없음")
        user_intent = user_intent_dontknow
    return user_intent, max_cosim

##### 예상되는 유저 sentence array
recommand = ['적합한 추천해줘', '적합한 뭐 있어', '적합한 알려줘', '적합한 추천','뭐있어',"뭐 있어", "뭐 살까", "뭐가 좋아",
             '할만한 추천', '할만한 알려줘', '하기 좋은 알려줘', '하기 좋은 추천', '적합한', '추천', '가벼운 알려줘'
             '저렴한 알려줘', '가벼운 추천', '저렴한 추천', '예쁜 추천', '예쁜 알려줘', '큰 알려줘', '큰 추천', 
             '작은 알려줘', '작은 추천', '괜찮은 추천', '괜찮은 알려줘', '좋은 추천', '좋은 알려줘', '좋은', "안끊기는", "잘돌아가는"]

item_info = ['무게 알려줘', '무게 정보', '무게 정보 알려줘', '무게 어때', '무게 어떤지 알려줘',
          '가격 알려줘', '가격 정보', '가격 정보 알려줘', '가격 어때', '가격 어떤지 알려줘',
          '색 알려줘', '색 정보', '색 정보 알려줘', '색 어때', '색 어떤지 알려줘',
          '크기 알려줘', '크기 정보', '크기 정보 알려줘', '크기 어때', '크기 어떤지 알려줘', '사이즈 알려줘'
          '사이즈 어때', '사이즈 정보','사이즈 정보 알려줘' '사이즈 어떤지 알려줘']

review_sum = ['리뷰 알려줘', '리뷰', '리뷰 요약 알려줘', '리뷰 요약', '리뷰 요약본', '리뷰 요약본 알려줘', 
              '요약', '요약본', '요약해줘', '반응 어때', '반응 알려줘']

##### 별도 처리 단어
twitter.add_dictionary(stopwords, 'Noun')

##### 입력을 명사로만 접근했을때 -> 요약본 or 상품정보
def processOnlyNoun(productName, inputsentence):
    otherWords_noun = []
    words_noun = []

    # for word in okt.pos(inputsentence, stem=False):
    for word in twitter.pos(inputsentence):
        print(word[0] + " " + word[1])
        if word[1] in ['Noun', 'Number', 'Alpha']:
            if not word[0] in stopwords_noun:
                words_noun.append(word[0])
            else:
                otherWords_noun.append(word[0])
    else:
        otherWords_noun.append(word[0])


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
        state = "SUCCESS"
    # 요약본 제공
    elif detail_max_cosim < summary_max_cosim and summary_max_cosim > 0.7:
        user_intent = user_intent_reviewsum
        state = "SUCCESS"
    else:
        user_intent = user_intent_dontknow
        state = "FALLBACK"

    print("유저의 의도는 [ " + user_intent + " ] 입니다")

    return state, user_intent
    # output = ""
    # # # json file load
    # with open(laptopFilePath, 'r', encoding='utf-8') as f:
    #     keyboard = json.load(f)

    #     ### name 이 같지 않으면 다른거 search하도록 0330

    #     for data in keyboard:
    #         name = data['name']
    #         print(name) ## -> json 파일의 최상단 상품
    #         detail=data['info']
    #         for item in detail:
    #             key, value=item.split(':')
    #             print(key,value)
    #             # 상품명(명사)만 입력했을 경우 otherWords가 비어있게 되므로 
    #             # item_details 리스트 사용
    #             if key.strip() == otherWords_noun[0]:
    #                     print("")
    #                     find_data = value
    #                     print(key.strip() + " 검색결과 " + key.strip() + " 은(는)", find_data + "입니다.")
    #                     output = key.strip() + " 검색결과 " + key.strip() + " 은(는)", find_data + "입니다."
    #                     break
    #             else:
    #                 print("잘 모르겠어요")
    #                 output = "잘 모르겠어요"
    # return state, output
    

def getProductName(inputsentence):
    words = [] # stopwords 제외한 'Noun', 'Number', 'Alpha'
    otherWords = [] # words[]에 포함되지 않는 단어들

    # for word in okt.pos(inputsentence, stem=False):
    for word in twitter.pos(inputsentence):
        print(word[0] + " " + word[1])
        if word[1] in ['Noun', 'Number', 'Alpha']:
            if not word[0] in stopwords:
                words.append(word[0])
            else:
                otherWords.append(word[0])
        else:
            otherWords.append(word[0])

    print(words)
    print(otherWords)
    searchItem = "".join(words)
    realItemNames = getProductNames(searchItem) # 자세한 상품명 제공
    return "REQUIRE_DETAIL", realItemNames+" 중 어느 것을 원하시나요?"

def predictIntent(productName, inputsentence): 

    ####################################
    # 사용자가 입력한 문장 의도 판단
    #
    # productName : 사용자가 원하는 productName
    # inputsentence : 사용자가 입력한 문장
    ####################################

    input_encode = model.encode(inputsentence)
    words = [] # stopwords 제외한 'Noun', 'Number', 'Alpha'
    otherWords = [] # words[]에 포함되지 않는 단어들

    # for word in okt.pos(inputsentence, stem=False):
    for word in twitter.pos(inputsentence):
        print(word[0] + " " + word[1])
        if word[1] in ['Noun', 'Number', 'Alpha']:
            if not word[0] in stopwords:
                words.append(word[0])
            else:
                otherWords.append(word[0])
        else:
            otherWords.append(word[0])

    print(words)
    print(otherWords)

    # 입력을 명사로만 접근했을때
    if (len(otherWords) == 0):
        searchItem = "".join(words)
        realItemNames = getProductNames(searchItem) # 자세한 상품명 제공
        return "REQUIRE_DETAIL", realItemNames+" 중 어느 것을 원하시나요?"

    # 추천, 상품 정보, 요약본 분류, 알수없음
    else:
        inputsentence = " ".join(otherWords)
        input_encode = model.encode(inputsentence)
        rec_encode = model.encode(recommand)
        detail_encode = model.encode(item_info)
        summary_encode = model.encode(review_sum)

        cosim_input_rec = cosine_similarity([input_encode], rec_encode)  # 상품 추천 유사도
        cosim_input_detail = cosine_similarity([input_encode], detail_encode)  # 상품 정보 유사도
        cosim_input_summary = cosine_similarity([input_encode], summary_encode)  # 요약본 유사도

        recommand_max_cosim = get_max_cosim(user_intent_recommand, cosim_input_rec)
        detail_max_cosim = get_max_cosim(user_intent_iteminfo, cosim_input_detail)
        summary_max_cosim = get_max_cosim(user_intent_reviewsum, cosim_input_summary)
        user_intent, max_cosim = print_max_type(recommand_max_cosim, detail_max_cosim, summary_max_cosim)
        if user_intent == user_intent_recommand:
            state = "SUCCESS"
            output = "!!!를 추천드립니다"
            print("유저의 의도는 [ "+ user_intent + " ] 입니다")
        elif user_intent == user_intent_iteminfo:
            if(productName==""):
                if(len(words)>=2):
                    searchItem = "".join(words)
                    realItemNames = getProductNames(searchItem) # 자세한 상품명 제공
                    return "REQUIRE_DETAIL", realItemNames+" 중 어느 것을 원하시나요?"
                state = "REQUIRE_PRODUCTNAME"
                output = "어떤 상품에 대해 궁금하신가요?"
            else:
                state = "SUCCESS"
                output = user_intent
            print("유저의 의도는 [ "+ user_intent + " ] 입니다")
        elif user_intent == user_intent_reviewsum:
            if(productName==""):
                state = "REQUIRE_PRODUCTNAME"
                output = "어떤 상품에 대해 궁금하신가요?"
            else:
                state = "SUCCESS"
                output = user_intent
            print("유저의 의도는 [ "+ user_intent + " ] 입니다")
        else:
            state = "FALLBACK"
            output = user_intent
            print("유저의 의도를 알 수 없습니다 !!")

        return state, output
    # 상품 정보 요청일 경우
    # if user_intent == user_intent_iteminfo:
    #     searchItem = "".join(words)
    #     # 리뷰순으로 아이템 검색한 링크
    #     response = requests.get("https://search.shopping.naver.com/search/all?origQuery="+searchItem+
    #                             "&pagingSize=40&productSet=total&query="+searchItem+"&sort=review&timestamp=&viewType=list")
    #     html = response.text
    #     # html 번역
    #     soup = BeautifulSoup(html, 'html.parser')
    #     itemLists = soup.select('a.basicList_link__JLQJf') #basicList_link__JLQJf = 네이버 쇼핑몰 상품명 태그

    #     print("### 네이버 쇼핑몰 검색 결과 ###")
    #     for item in itemLists:
    #         itemTitle = item.get("title")
    #         if itemTitle != None:
    #             print("상품명 : " + itemTitle) 

        # # json file load
        # with open('data/keyboard.json', 'r', encoding='utf-8') as f:
        #     keyboard = json.load(f)

        # ### name 이 같지 않으면 다른거 search하도록 0330

        # for data in keyboard:
        #     name = data['name']
        #     print(name) ## -> json 파일의 최상단 상품
        #     detail=data['detail']
        #     for item in detail:
        #         key, value=item.split(':')
        #         print(key,value)
        #         # 상품명(명사)만 입력했을 경우 otherWords가 비어있게 되므로 
        #         # item_details 리스트 사용
        #         if not otherWords:
        #             if key.strip() == otherWords_noun[0]:
        #                 print("")
        #                 find_data = value
        #                 print(key.strip() + " 검색결과 " + key.strip() + " 은(는)", find_data + "입니다.")
        #                 break
        #             else:
        #                 print("잘 모르겠어요") 
        #         else:
        #             if key.strip() == otherWords[0]:
        #                 print("")
        #                 find_data = value
        #                 print(key.strip() + " 검색결과 " + key.strip() + " 은(는)", find_data + "입니다.")
        #                 break
        #             else:
        #                 print("잘 모르겠어요") 
                
        #     break
    # else:
    #     print(" !!! 리뷰 요약 or 상품추천 로직필요 !!! ")
