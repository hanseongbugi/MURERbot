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
        dbInfo = usingDB.getProductInfo(productName)
        self.detailInfo = [str(key)+": "+str(dbInfo[key]) for key in dbInfo if len(key.strip())>0]
        self.imageURL = usingDB.getProductImageURL(productName)
        
        reivewsWithSentimentAttributes = usingDB.getReviewDataWithAttributes(productName)
        
        totalReviewCnt = len(reivewsWithSentimentAttributes)
        if totalReviewCnt > 0:
            try:
                positiveReviews, negativeReviews = splitPositiveNegative(reivewsWithSentimentAttributes)

                self.fullPositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
                self.fullNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)

                self.fullPositiveSummary = summaryReviews(productName, positiveReviews)
                self.fullNegativeSummary = summaryReviews(productName, negativeReviews)
            except Exception as e:
                print("******* ProductSummary totalReviewCnt error *******")
                print(e)
                print(positiveReviews)
                print(negativeReviews)
                self.fullPositivePercent = "0"
                self.fullNegativePercent = "0"
                self.fullPositiveSummary = []
                self.fullNegativeSummary = []

            if len(self.fullPositiveSummary) > 0 or len(self.fullNegativeSummary) > 0:
                try:
                    print("==== designReviews ====")
                    designReviewsWithSentiment = splitAttribute(reivewsWithSentimentAttributes, 0)
                    totalReviewCnt = len(designReviewsWithSentiment)
                    positiveReviews, negativeReviews = splitPositiveNegative(designReviewsWithSentiment)
                    self.designPositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
                    self.designNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
                    self.designPositiveSummary = summaryReviews(productName, positiveReviews)
                    self.designNegativeSummary = summaryReviews(productName, negativeReviews)
                except Exception as e:
                    print("******* error *******")
                    print(e)
                    print(positiveReviews)
                    print(negativeReviews)
                    self.designPositivePercent = "0"
                    self.designNegativePercent = "0"
                    self.designPositiveSummary = []
                    self.designNegativeSummary = []

                try:
                    print("==== weightReiews ====")
                    weightReiewsWithSentiment = splitAttribute(reivewsWithSentimentAttributes, 1)
                    totalReviewCnt = len(weightReiewsWithSentiment)
                    positiveReviews, negativeReviews = splitPositiveNegative(weightReiewsWithSentiment)
                    self.weightPositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
                    self.weightNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
                    self.weightPositiveSummary = summaryReviews(productName, positiveReviews)
                    self.weightNegativeSummary = summaryReviews(productName, negativeReviews)
                except Exception as e:
                    print("******* error *******")
                    print(e)
                    print(positiveReviews)
                    print(negativeReviews)
                    self.weightPositivePercent = "0"
                    self.weightNegativePercent = "0"
                    self.weightPositiveSummary = []
                    self.weightNegativeSummary = []

                try:
                    print("==== performanceReviews ====")
                    performanceReviewsWithSentiment = splitAttribute(reivewsWithSentimentAttributes, 2)
                    totalReviewCnt = len(performanceReviewsWithSentiment)
                    positiveReviews, negativeReviews = splitPositiveNegative(performanceReviewsWithSentiment)
                    self.performancePositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
                    self.performanceNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
                    self.performancePositiveSummary = summaryReviews(productName, positiveReviews)
                    self.performanceNegativeSummary = summaryReviews(productName, negativeReviews)
                except Exception as e:
                    print("******* error *******")
                    print(e)
                    print(positiveReviews)
                    print(negativeReviews)
                    self.performancePositivePercent = "0"
                    self.performanceNegativePercent = "0"
                    self.performancePositiveSummary = []
                    self.performanceNegativeSummary = []

                try:
                    print("==== noiseReviews ====")
                    noiseReviewsWithSentiment = splitAttribute(reivewsWithSentimentAttributes, 3)
                    totalReviewCnt = len(noiseReviewsWithSentiment)
                    positiveReviews, negativeReviews = splitPositiveNegative(noiseReviewsWithSentiment)
                    self.noisePositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
                    self.noiseNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
                    self.noisePositiveSummary = summaryReviews(productName, positiveReviews)
                    self.noiseNegativeSummary = summaryReviews(productName, negativeReviews)
                except Exception as e:
                    print("******* error *******")
                    print(e)
                    print(positiveReviews)
                    print(negativeReviews)
                    self.noisePositivePercent = "0"
                    self.noiseNegativePercent = "0"
                    self.noisePositiveSummary = []
                    self.noiseNegativeSummary = []
                
                try:
                    print("==== sizeReviews ====")
                    sizeReviewsWithSentiment = splitAttribute(reivewsWithSentimentAttributes, 4)
                    totalReviewCnt = len(sizeReviewsWithSentiment)
                    positiveReviews, negativeReviews = splitPositiveNegative(sizeReviewsWithSentiment)
                    self.sizePositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
                    self.sizeNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
                    self.sizePositiveSummary = summaryReviews(productName, positiveReviews)
                    self.sizeNegativeSummary = summaryReviews(productName, negativeReviews)
                except Exception as e:
                    print("******* error *******")
                    print(e)
                    print(positiveReviews)
                    print(negativeReviews)
                    self.sizePositivePercent = "0"
                    self.sizeNegativePercent = "0"
                    self.sizePositiveSummary = []
                    self.sizeNegativeSummary = []

                try:
                    print("==== satisficationReviews ====")
                    satisficationReviewsWithSentiment = splitAttribute(reivewsWithSentimentAttributes, 5)
                    totalReviewCnt = len(satisficationReviewsWithSentiment)
                    positiveReviews, negativeReviews = splitPositiveNegative(satisficationReviewsWithSentiment)
                    self.satisficationPositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
                    self.satisficationNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)
                    self.satisficationPositiveSummary = summaryReviews(productName, positiveReviews)
                    self.satisficationNegativeSummary = summaryReviews(productName, negativeReviews)
                except Exception as e:
                    print("******* error *******")
                    print(e)
                    print(positiveReviews)
                    print(negativeReviews)
                    self.satisficationPositivePercent = "0"
                    self.satisficationNegativePercent = "0"
                    self.satisficationPositiveSummary = []
                    self.satisficationNegativeSummary = []


def previewSummary(productName):
    reviewsWithSentiment = usingDB.getReviewData(productName)
    
    totalReviewCnt = len(reviewsWithSentiment)
    if totalReviewCnt > 0:
        try:
            positiveReviews, negativeReviews = splitPositiveNegative(reviewsWithSentiment)

            fullPositivePercent = calculatePercentage(positiveReviews, totalReviewCnt)
            fullNegativePercent = calculatePercentage(negativeReviews, totalReviewCnt)

            fullPositiveSummary = summaryReviews(productName, positiveReviews,1)
            fullNegativeSummary = summaryReviews(productName, negativeReviews,1)
            
            if len(fullPositiveSummary)>0 :
                fullPositiveSummary = fullPositiveSummary[0]
                previewPositive = "<b>긍정)</b> "+"\n"+fullPositiveSummary+" <b>("+fullPositivePercent+"%)</b>"
            else:
                previewPositive = "<b>긍정)</b> "

            if len(fullNegativeSummary)>0 :
                fullNegativeSummary = fullNegativeSummary[0]
                previewNegative = "<b>부정)</b> "+"\n"+fullNegativeSummary+" <b>("+fullNegativePercent+"%)</b>"
            else:
                previewNegative = "<b>부정)</b> "
            return PREVIEW_START+"\n\n"+previewPositive+"\n\n"+previewNegative
        except Exception as e:
            print("******* previewSummary error *******")
            print(e)
            print(positiveReviews)
            print(negativeReviews)
            if len(usingDB.getProductInfo(productName)) > 0:
                return "해당 제품은 리뷰 요약을 제외한 상품 정보만을 제공합니다"
            else:
                return "해당 제품은 요약본을 지원하지 않는 제품입니다."
    else:
        if len(usingDB.getProductInfo(productName)) > 0:
                return "해당 제품은 리뷰 요약을 제외한 상품 정보만을 제공합니다"
        else:
            return "해당 제품은 요약본을 지원하지 않는 제품입니다."

def splitPositiveNegative(reviewData): # reviews를 긍/부정 따라 나눠주는 함수
    return [data[0] for data in reviewData if data[1] == 1], [data[0] for data in reviewData if data[1] == 0]

def calculatePercentage(reviews,totalReviewCnt): # % 계산
    # print(str(len(reviews))+"/"+str(totalReviewCnt))
    if len(reviews) > 0:
        return str('{:.2f}'.format((len(reviews)/totalReviewCnt)*100))
    else:
        return "0"


def splitAttribute(reviewData, attributeIdx): # attributeIdx에 해당하는 리뷰 list 반환
    return [[data[0],data[1]] for data in reviewData if str(attributeIdx) in data[2]]

# 자바로 개발된 한국어 형태소 분석기
komoran = Komoran()

# 토크나이저로는 KoNLPy 의 코모란을 이용
# 명사, 동사, 형용사, 어간의 품사만 이용하여 단어 그래프를 만들기
def komoran_tokenizer(sent):
    words = komoran.pos(sent, join=True)
    # print(words)
    words = [w for w in words if ('/NN' in w or '/XR' in w or '/VA' in w or '/VV' in w or '/EC' in w)]
    # print(words)
    # print("="*20)
    return words

summarizer = KeysentenceSummarizer(
    tokenize=komoran_tokenizer,
    min_sim=0.6,
    verbose=True
)

def summaryReviews(productName, reviews, resultSentenceCnt=2):
    print("Summary Reviews")
    summary = []
    # print(reviews)
    if len(reviews) > resultSentenceCnt:
        sentences  = summarizer.summarize(reviews, topk=resultSentenceCnt)
        for sent_ids, rank, sent in sentences:
            summary.append(usingDB.findPersonReview(productName, sent))
        summary = list(set(summary)) # 중복 제거
        return summary
    elif len(reviews) == 0:
        return []
    else:
        for review in reviews:
            summary.append(usingDB.findPersonReview(productName, review))
        summary = list(set(summary)) # 중복 제거
        return summary