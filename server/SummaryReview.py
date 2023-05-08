# -*- coding: utf-8 -*-
import time

from textrank import KeysentenceSummarizer
from konlpy.tag import Komoran
import pandas as pd
import usingDB
import json

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
    
    
    # def __init__(self, productName):
    #     self.productName = productName
    #     dbInfo = json.loads(usingDB.getProductInfo(productName))
    #     self.detailInfo = [str(key)+": "+str(dbInfo[key]) for key in dbInfo]
    #     self.imageURL = usingDB.getProductImageURL(productName)
        
    #     reviews, sentiments = usingDB.getReviewData(productName)
    #     totalReviewCnt = len(reviews)
    #     positiveReviews = [review for idx, review in enumerate(reviews) if sentiments[idx] == 1]
    #     negativeReviews = [review for idx, review in enumerate(reviews) if sentiments[idx] == 0]

    #     self.fullPositivePercent = (len(positiveReviews)*100)/totalReviewCnt
    #     # # self.fullNegativePercent = (len(negativeReviews)*100)/len(productReviews)
    #     self.fullNegativePercent = 100 - self.fullPositivePercent
    #     self.fullPositiveSummary = summaryReviews(positiveReviews)
    #     self.fullNegativeSummary = summaryReviews(negativeReviews)

    #     designReviews = []
        # self.designPercent = 


    def __init__(self, productName):
        self.productName = productName
        dbInfo = json.loads(usingDB.getProductInfo(productName))
        self.detailInfo = [str(key)+": "+str(dbInfo[key]) for key in dbInfo]
        self.imageURL = usingDB.getProductImageURL(productName)
        
        reviews, sentiments, attributes = usingDB.getReviewData(productName)
        # reviews, sentiments = usingDB.getReviewData(productName)
        totalReviewCnt = len(reviews)
        print("split")
        positiveReviews, negativeReviews = self.splitPositiveNegative(reviews, sentiments)
        # positiveReviews =  [review for idx, review in enumerate(reviews) if sentiments[idx] == 1]
        # negativeReviews =  [review for idx, review in enumerate(reviews) if sentiments[idx] == 0]
        print("calculatePercentage")
        self.fullPositivePercent = self.calculatePercentage(positiveReviews, totalReviewCnt)
        self.fullNegativePercent = self.calculatePercentage(negativeReviews, totalReviewCnt)
        print("summaryReviews")
        # self.fullNegativePercent = (len(negativeReviews)*100)/len(productReviews)
        self.fullPositiveSummary = summaryReviews(positiveReviews)
        self.fullNegativeSummary = summaryReviews(negativeReviews)
        print("finish")

        # designReviews = [review for idx, review in enumerate(reviews) if 0 in attributes[idx]]
        # weightReiews = [review for idx, review in enumerate(reviews) if 1 in attributes[idx]]
        # performance = [review for idx, review in enumerate(reviews) if 2 in attributes[idx]]
        # noise = [review for idx, review in enumerate(reviews) if 3 in attributes[idx]]
        # size = [review for idx, review in enumerate(reviews) if 4 in attributes[idx]]
        # satisfication = [review for idx, review in enumerate(reviews) if 5 in attributes[idx]]
        
        designReviews = self.splitAttribute(reviews, attributes, 0)
        positiveReviews, negativeReviews = self.splitPositiveNegative(designReviews, sentiments)
        self.designPositivePercent = self.calculatePercentage(positiveReviews, totalReviewCnt)
        self.designNegativePercent = self.calculatePercentage(negativeReviews, totalReviewCnt)
        self.designPositiveSummary = summaryReviews(positiveReviews)
        self.designNegativeSummary = summaryReviews(negativeReviews)

        weightReiews = self.splitAttribute(reviews, attributes, 1)
        positiveReviews, negativeReviews = self.splitPositiveNegative(weightReiews, sentiments)
        self.weightPositivePercent = self.calculatePercentage(positiveReviews, totalReviewCnt)
        self.weightNegativePercent = self.calculatePercentage(negativeReviews, totalReviewCnt)
        self.weightPositiveSummary = summaryReviews(positiveReviews)
        self.weightNegativeSummary = summaryReviews(negativeReviews)

        performanceReviews = self.splitAttribute(reviews, attributes, 2)
        positiveReviews, negativeReviews = self.splitPositiveNegative(performanceReviews, sentiments)
        self.performancePositivePercent = self.calculatePercentage(positiveReviews, totalReviewCnt)
        self.performanceNegativePercent = self.calculatePercentage(negativeReviews, totalReviewCnt)
        self.performancePositiveSummary = summaryReviews(positiveReviews)
        self.performanceNegativeSummary = summaryReviews(negativeReviews)

        noiseReviews = self.splitAttribute(reviews, attributes, 3)
        positiveReviews, negativeReviews = self.splitPositiveNegative(noiseReviews, sentiments)
        self.noisePositivePercent = self.calculatePercentage(positiveReviews, totalReviewCnt)
        self.noiseNegativePercent = self.calculatePercentage(negativeReviews, totalReviewCnt)
        self.noisePositiveSummary = summaryReviews(positiveReviews)
        self.noiseNegativeSummary = summaryReviews(negativeReviews)
        
        sizeReviews = self.splitAttribute(reviews, attributes, 4)
        positiveReviews, negativeReviews = self.splitPositiveNegative(sizeReviews, sentiments)
        self.sizePositivePercent = self.calculatePercentage(positiveReviews, totalReviewCnt)
        self.sizeNegativePercent = self.calculatePercentage(negativeReviews, totalReviewCnt)
        self.sizePositiveSummary = summaryReviews(positiveReviews)
        self.sizeNegativeSummary = summaryReviews(negativeReviews)

        satisficationReviews = self.splitAttribute(reviews, attributes, 5)
        positiveReviews, negativeReviews = self.splitPositiveNegative(satisficationReviews, sentiments)
        self.satisficationPositivePercent = self.calculatePercentage(positiveReviews, totalReviewCnt)
        self.satisficationNegativePercent = self.calculatePercentage(negativeReviews, totalReviewCnt)
        self.satisficationPositiveSummary = summaryReviews(positiveReviews)
        self.satisficationNegativeSummary = summaryReviews(negativeReviews)

    def splitPositiveNegative(self, reviews, sentiments): # reviews를 긍/부정 따라 나눠주는 함수
        return [review for idx, review in enumerate(reviews) if sentiments[idx] == 1], [review for idx, review in enumerate(reviews) if sentiments[idx] == 0]

    def calculatePercentage(self, reviews,totalReviewCnt): # % 계산
        return round(len(reviews)/totalReviewCnt,3)*100

    def splitAttribute(self, reviews, attributes, attributeIdx): # attributeIdx에 해당하는 리뷰 list 반환
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

def summaryReviews(sents_1):
    return summarizer.summarize(sents_1, topk=5)



