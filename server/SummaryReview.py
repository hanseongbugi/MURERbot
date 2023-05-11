# -*- coding: utf-8 -*-
import time

from textrank import KeysentenceSummarizer
from konlpy.tag import Komoran
import pandas as pd
import usingDB
import json
from ckonlpy.tag import Twitter

PREVIEW_START = "상품의 리뷰에서 가장 많이 언급된 내용입니다!"

twitter = Twitter()

class ProductSummary:
    # - 상품 이름 productName
    # - 상품 상세 정보, 상품 이미지 url, 가격
    # - 전체 리뷰 요약) 부정 비율, 긍정 비율, 긍정 요약, 부정 요약
    # - 속성별 리뷰 요약)
    #     - 디자인) 리뷰 비율, 부정 비율, 긍정 비율, 부정 요약, 긍정 요약
    #     - 무게) 리뷰 비율, 부정 비율, 긍정 비율, 부정 요약, 긍정 요약
    #     - 성능) 리뷰 비율, 부정 비율, 긍정 비율, 부정 요약, 긍정 요약
    #     - 소음) 리뷰 비율, 부정 비율, 긍정 비율, 부정 요약, 긍정 요약
    #     - 크기) 리뷰 비율, 부정 비율, 긍정 비율, 부정 요약, 긍정 요약
    #     - 만족도) 리뷰 비율, 부정 비율, 긍정 비율, 부정 요약, 긍정 요약

    def __init__(self, productName):
        self.productName = productName
        dbInfo = json.loads(usingDB.getProductInfo(productName))
        self.detailInfo = [str(key)+": "+str(dbInfo[key]) for key in dbInfo]
        self.imageURL = usingDB.getProductImageURL(productName)
        
        reviews, sentiments, attributes = usingDB.getReviewDataWithAttributes(productName)
        
        totalReviewCnt = len(reviews)
        positiveReviews, negativeReviews = splitPositiveNegative(reviews, sentiments)

        self.fullPositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
        self.fullNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)

        self.fullPositiveSummary = summaryReviews(positiveReviews)
        self.fullNegativeSummary = summaryReviews(negativeReviews)
        
        designReviews = splitAttribute(reviews, attributes, 0)
        totalReviewCnt = len(designReviews)
        positiveReviews, negativeReviews = splitPositiveNegative(designReviews, sentiments)
        self.designPositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
        self.designNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
        self.designPositiveSummary = summaryReviews(positiveReviews)
        self.designNegativeSummary = summaryReviews(negativeReviews)

        weightReiews = splitAttribute(reviews, attributes, 1)
        totalReviewCnt = len(weightReiews)
        positiveReviews, negativeReviews = splitPositiveNegative(weightReiews, sentiments)
        self.weightPositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
        self.weightNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
        self.weightPositiveSummary = summaryReviews(positiveReviews)
        self.weightNegativeSummary = summaryReviews(negativeReviews)

        performanceReviews = splitAttribute(reviews, attributes, 2)
        totalReviewCnt = len(performanceReviews)
        positiveReviews, negativeReviews = splitPositiveNegative(performanceReviews, sentiments)
        self.performancePositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
        self.performanceNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
        self.performancePositiveSummary = summaryReviews(positiveReviews)
        self.performanceNegativeSummary = summaryReviews(negativeReviews)

        noiseReviews = splitAttribute(reviews, attributes, 3)
        totalReviewCnt = len(noiseReviews)
        positiveReviews, negativeReviews = splitPositiveNegative(noiseReviews, sentiments)
        self.noisePositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
        self.noiseNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
        self.noisePositiveSummary = summaryReviews(positiveReviews)
        self.noiseNegativeSummary = summaryReviews(negativeReviews)
        
        sizeReviews = splitAttribute(reviews, attributes, 4)
        totalReviewCnt = len(sizeReviews)
        positiveReviews, negativeReviews = splitPositiveNegative(sizeReviews, sentiments)
        self.sizePositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
        self.sizeNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
        self.sizePositiveSummary = summaryReviews(positiveReviews)
        self.sizeNegativeSummary = summaryReviews(negativeReviews)

        satisficationReviews = splitAttribute(reviews, attributes, 5)
        totalReviewCnt = len(satisficationReviews)
        positiveReviews, negativeReviews = splitPositiveNegative(satisficationReviews, sentiments)
        self.satisficationPositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
        self.satisficationNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
        self.satisficationPositiveSummary = summaryReviews(positiveReviews)
        self.satisficationNegativeSummary = summaryReviews(negativeReviews)

def previewSummary(productName):
    reviews, sentiments = usingDB.getReviewData(productName)
    
    totalReviewCnt = len(reviews)
    positiveReviews, negativeReviews = splitPositiveNegative(reviews, sentiments)

    fullPositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
    fullNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)

    fullPositiveSummary = summaryReviews(positiveReviews,1)
    fullNegativeSummary = summaryReviews(negativeReviews,1)

    
    [fullNegativeSummary[i:i+20] for i in range(0, len(fullNegativeSummary), 20)]

    length = 50
    previewPositive = "긍정) "+"\n".join([fullPositiveSummary[i:i+length] for i in range(0, len(fullPositiveSummary), length)])+" ("+fullPositivePercent+"%)"
    previewNegative = "부정) "+"\n".join([fullNegativeSummary[i:i+length] for i in range(0, len(fullNegativeSummary), length)])+" ("+fullNegativePercent+"%)"
    return PREVIEW_START+"\n\n"+previewPositive+"\n"+previewNegative

def splitPositiveNegative(reviews, sentiments): # reviews를 긍/부정 따라 나눠주는 함수
    return [review for idx, review in enumerate(reviews) if sentiments[idx] == 1], [review for idx, review in enumerate(reviews) if sentiments[idx] == 0]

def calculatePercentage(reviews,totalReviewCnt): # % 계산
    # print(str(len(reviews))+"/"+str(totalReviewCnt))
    return str('{:.2f}'.format((len(reviews)/totalReviewCnt)*100))

def splitAttribute(reviews, attributes, attributeIdx): # attributeIdx에 해당하는 리뷰 list 반환
    return [review for idx, review in enumerate(reviews) if attributeIdx in attributes[idx]]
# 자바로 개발된 한국어 형태소 분석기
komoran = Komoran()

# 토크나이저로는 KoNLPy 의 코모란을 이용
# 명사, 동사, 형용사, 어간의 품사만 이용하여 단어 그래프를 만들기
def komoran_tokenizer(sent):
    words = komoran.pos(sent, join=True)
    words = [w for w in words if ('/NN' in w or '/XR' in w or '/VA' in w or '/VV' in w)]
    return words

summarizer = KeysentenceSummarizer(
    tokenize=komoran_tokenizer,
    min_sim=0.6,
    verbose=True
)

def summaryReviews(reviews, resultSentenceCnt=2):
    sentences  = summarizer.summarize(reviews, topk=resultSentenceCnt)
    summary = ""
    for sent_ids, rank, sent in sentences:
        # print(twitter.pos(summary.strip()[-1]))
        if len(summary)>0:
            # if(twitter.pos(summary.strip()[-1])[0][1] == "Punctuation"):
            summary = summary + " "+sent
            # else:
                # summary += sent
        else:
            summary += sent
    return summary