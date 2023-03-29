################################### 시나리오 분류 모듈 ###################################

from konlpy.tag import Okt
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
# from hanspell import spell_checker
# import re

okt = Okt()  # 형태소 분석 라이브러리

model = SentenceTransformer('jhgan/ko-sbert-multitask')
# model = SentenceTransformer('snunlp/KR-SBERT-V40K-klueNLI-augSTS')

# 코사인 유사도 2중 분류
def get_max_cosim(type: str, cossim):
    # print(type(cossim)) # cossim -> 넘파이 배열 형식
    max_cosim = np.max(cossim)
    print(type + " => " + str(max_cosim))
    return max_cosim

# 코사인 유사도 3중 분류
def print_max_type(recommand_max_cosim, detail_max_cosim, summary_max_cosim):
    max_cosim = np.max([recommand_max_cosim, detail_max_cosim, summary_max_cosim])
    # print(str(max_cosim))
    if max_cosim>0.65:
        if max_cosim == recommand_max_cosim:
            # print("상품 추천")
            user_intent = "상품 추천"
        elif max_cosim == detail_max_cosim:
            # print("상품 정보 제공")
            user_intent = "상품 정보 제공"
        elif max_cosim == summary_max_cosim:
            # print("요약본 제공")
            user_intent = "요약본 제공"
    else :
        # print("알 수 없음")
        user_intent = "알 수 없음"
    return user_intent, max_cosim

# 리뷰 요약의 '알려줘'는 추천이나 상품 정보 요청에도 사용될 수 있기 때문에 
# 리뷰 요약에만 '알려줘'를 두기에는 정확한 코사인 유사도 값을 구하는데 방해가 될 수 있을 것 같다.

recommand = ['적합한 추천해줘', '적합한 뭐 있어', '적합한 알려줘', '적합한 추천','뭐있어',"뭐 있어", "뭐 살까", "뭐가 좋아",
             '할만한 추천', '할만한 알려줘', '하기 좋은 알려줘', '하기 좋은 추천', '적합한', '추천', '가벼운 알려줘'
             '저렴한 알려줘', '가벼운 추천', '저렴한 추천', '예쁜 추천', '예쁜 알려줘', '큰 알려줘', '큰 추천', 
             '작은 알려줘', '작은 추천', '괜찮은 추천', '괜찮은 알려줘', '좋은 추천', '좋은 알려줘', '좋은', "안끊기는", "잘돌아가는"]

item_info = ['무게 알려줘', '무게 정보', '무게 정보 알려줘', '무게 어때', '무게 어떤지 알려줘',
          '가격 알려줘', '가격 정보', '가격 정보 알려줘', '가격 어때', '가격 어떤지 알려줘',
          '색 알려줘', '색 정보', '색 정보 알려줘', '색 어때', '색 어떤지 알려줘',
          '크기 알려줘', '크기 정보', '크기 정보 알려줘', '크기 어때', '크기 어떤지 알려줘']

review_sum = ['리뷰 알려줘', '리뷰', '리뷰 요약 알려줘', '리뷰 요약', '리뷰 요약본', '리뷰 요약본 알려줘', 
              '요약', '요약본', '요약해줘', '반응 어때', '반응 알려줘']

while (True):
    ### 유사도 비교할 input sentence
    
    inputsentence = input("명령 입력 >> ")
    input_encode = model.encode(inputsentence)
    print("input sentence = " + inputsentence)

    otherWords = []
    words = []
    stopwords = ["가격", "색", "크기", "무게", "추천", "뭐", "리뷰"]
    for word in okt.pos(inputsentence, stem=False):
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

    # 입력을 명사로만 접근했을때 -> 요약본 or 상품정보
    if (len(otherWords) == 0):
        # print("!제품 이름만 입력 한 경우!")
        print(inputsentence + "에 대해 어떤 것을 도와드릴까요?")
        inputsentence = input("입력 >> ")
        input_encode = model.encode(inputsentence)

        detail_encode = model.encode(item_info)
        summary_encode = model.encode(review_sum)

        cosim_input_detail = cosine_similarity([input_encode], detail_encode)
        cosim_input_summary = cosine_similarity([input_encode], summary_encode)

        detail_max_cosim = get_max_cosim('상품 정보 요청', cosim_input_detail)
        summary_max_cosim = get_max_cosim('리뷰 요약본 요청', cosim_input_summary)

        print(str(np.max([detail_max_cosim, summary_max_cosim])))

        if detail_max_cosim > summary_max_cosim and detail_max_cosim > 0.7:
            user_intent = "상품 정보 요청"
        elif detail_max_cosim < summary_max_cosim and summary_max_cosim > 0.7:
            user_intent = "리뷰 요약본 요청"
        else:
            user_intent = "알 수 없음"

        print("유저의 의도는 [ " + user_intent + " ] 입니다")

    # else -> 추천, 상품 정보, 요약본 분류
    else:
        inputsentence = " ".join(otherWords)
        print("사용자가 입력한 문장은 '"+inputsentence+"'")
        input_encode = model.encode(inputsentence)
        rec_encode = model.encode(recommand)
        detail_encode = model.encode(item_info)
        summary_encode = model.encode(review_sum)

        cosim_input_rec = cosine_similarity([input_encode], rec_encode)  # 상품 추천 유사도
        cosim_input_detail = cosine_similarity([input_encode], detail_encode)  # 상품 정보 유사도
        cosim_input_summary = cosine_similarity([input_encode], summary_encode)  # 요약본 유사도

        recommand_max_cosim = get_max_cosim('상품 추천 요청', cosim_input_rec)
        detail_max_cosim = get_max_cosim('상품 정보 요청', cosim_input_detail)
        summary_max_cosim = get_max_cosim('리뷰 요약 요청', cosim_input_summary)
        user_intent, max_cosim = print_max_type(recommand_max_cosim, detail_max_cosim, summary_max_cosim)
        if user_intent == "상품 추천":
            print("유저의 의도는 [ 상품 추천 ] 입니다")
        elif user_intent == "상품 정보 제공":
            print("유저의 의도는 [ 상품 정보 제공 ] 입니다")
        elif user_intent == "요약본 제공":
            print("유저의 의도는 [ 요약본 제공 ] 입니다")
        else:
            print("유저의 의도를 알 수 없습니다 !!")