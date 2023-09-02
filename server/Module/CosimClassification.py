import Module.Encoder as Encoder
import numpy as np

##### 코사인 유사도 2중 분류
def get_max_cosim(type: str, cossim):
    # print(type(cossim)) # cossim -> 넘파이 배열 형식
    max_cosim = np.max(cossim)
    # print(type + " => " + str(max_cosim))
    return max_cosim

##### 코사인 유사도 3중 분류
def print_max_type(recommend_max_cosim, detail_max_cosim, summary_max_cosim):
    max_cosim = np.max([recommend_max_cosim, detail_max_cosim, summary_max_cosim])
    # print(str(max_cosim))
    if max_cosim > 0.65:
        if max_cosim == recommend_max_cosim:
            # print("상품 추천")
            user_intent = Encoder.user_intent_recommend
        elif max_cosim == detail_max_cosim:
            # print("상품 정보 제공")
            user_intent = Encoder.user_intent_iteminfo
        elif max_cosim == summary_max_cosim:
            # print("요약본 제공")
            user_intent = Encoder.user_intent_reviewsum
    else:
        # print("알 수 없음")
        user_intent = Encoder.user_intent_dontknow
    return user_intent