# 질문 유효성 검사 모듈
# 1. 상품 정보에 관한 질문일 경우 -> specialWord 와 대조 후 결과 리턴
# 2. 그외 일 경우 유효하지 않은 검색입니다 리턴

import pandas as pd

specialwordsFileFullPath = "./data/specialwords.csv"
df_specialwords = pd.read_csv(specialwordsFileFullPath, encoding='cp949')
df_specialwords.drop_duplicates(subset=['specialwords_noun'], inplace=True)  # 중복된 행 제거
specialwords_noun = df_specialwords["specialwords_noun"].astype(str).tolist()

def checkValidQuery(inputsentence):
    print("input ==0>> ", inputsentence)
    checkFlag = False

    for special_words in specialwords_noun:
        if special_words.find(inputsentence) == -1:
            checkFlag = False
        else:
            print("checking====>",special_words)
            checkFlag = True
            break

    if checkFlag == True:
        return True
    else:
        return False

