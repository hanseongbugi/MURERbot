# -*- coding: utf-8 -*-
import time
import requests
import urllib
from bs4 import BeautifulSoup
import warnings
from kss import split_sentences
import json
from emoji import core
import re
from hanspell import spell_checker

warnings.filterwarnings("ignore", category=UserWarning, module='bs4')

# start = time.time()  # 시작 시간 저장

query = "데스크탑"
query = urllib.parse.quote(query)



headers = {}

url = "https://search.shopping.naver.com/api/search/all?sort=review&pagingIndex=1&pagingSize=40&viewType=list" \
      "&productSet=model&deliveryFree=&deliveryTypeValue=&frm=NVSHATC&query=" + query + "&origQuery=" + query + \
      "&iq=&eq=&xq="
response = requests.get(url, headers=headers)
search_json = json.loads(response.text)

with open("searchResult", 'w', encoding='utf-8') as outfile:
    json.dump(search_json, outfile, indent=4, ensure_ascii=False)

filterValues = search_json.get("productSetFilter").get("filterValues")

for filterValue in filterValues:
    productCount = filterValue.get("productCount")
    # print(filterValue.get("productCount"))
    if filterValue.get("title") == "가격비교":
        break

pageCount = productCount // 40
if productCount % 40 != 0:
    pageCount += 1

if pageCount > 5:
    pageCount = 5


result = []

for page in range(1, pageCount + 1, 1):
    url = "https://search.shopping.naver.com/api/search/all?sort=review&pagingIndex=" + str(
        page) + "&pagingSize=40&viewType=list" \
                "&productSet=model&deliveryFree=&deliveryTypeValue=&frm=NVSHMDL&query=" + query + "&origQuery=" + query + \
          "&iq=&eq=&xq="
    response = requests.get(url, headers=headers)
    page_json = json.loads(response.text)
    with open("pageResult", 'w', encoding='utf-8') as outfile:
        json.dump(page_json, outfile, indent=4, ensure_ascii=False)

    productsList = page_json.get("shoppingResult").get("products")

    count = 0
    for product in productsList:
        productId = product.get("id")
        productTitle = product.get("productTitle").strip()     # 상품 이름
        scoreInfo = product.get("scoreInfo")       # 총 평점
        price = product.get("price")    # 가격
        # totalReviewCount = product.get("reviewCount")
        # print(productId)
        totalReviewCount = 0
        print(count)
        print(productTitle)
        count += 1

        title = BeautifulSoup(productTitle, "lxml").text  # 상품 이름에서 html 태그 제거
        title = core.replace_emoji(title, replace='')

        # start = time.time()  # 시작 시간 저장

        headers = {
        }

        response = requests.get('https://search.shopping.naver.com/catalog/' + str(productId),
                                headers=headers)
        reviewInfo_detail = response.text

        html_data = BeautifulSoup(reviewInfo_detail, 'html.parser')  # 파싱한 html을 변수로 정의
        description = html_data.find('meta', property="og:description")['content']

        detail_list = description.split(',')
        detail = []
        for i in detail_list:
            detail.append(i.lstrip())
        detail_list = detail
        # print(detail_list)

        product = {"name": title, "id": productId, "detail": detail_list,
                   "content": []}  # json 객체 - 상품 이름, 아이디, 내용(reviews(review 리스트))

        for score in range(1, 6):  # 1,2,3,4,5
            params = {
                'nvMid': str(productId),
                # 'reviewType': 'ALL',
                'sortType': 'QUALITY',
                'starScore': score,
                'isNeedAggregation': 'N',
                # 'isApplyFilter': 'Y',
                'page': 1,
                'pageSize': '20',
            }

            response = requests.get('https://search.shopping.naver.com/api/review', params=params, headers=headers)
            reviewInfo_json = json.loads(response.text)

            # print(score,"점 리뷰")
            # print("총 ", reviewInfo_json["totalCount"], "개의 리뷰 존재")
            reviewCount = reviewInfo_json["totalCount"]
            totalPage = reviewInfo_json["totalCount"] // 20
            if reviewInfo_json["totalCount"] % 20 != 0:
                totalPage = totalPage + 1
            if totalPage > 100:
                totalPage = 100
            reviewNo = 1
            # print("리뷰 총 ", totalPage, "페이지 존재")
            # time.sleep(100)

            reviews = []

            for i in range(1, totalPage + 1):  # 1~totalPage
                params = {
                    'nvMid': str(productId),
                    # 'reviewType': 'ALL',
                    # 'sort': 'RECENT',
                    'sortType': 'QUALITY',
                    'starScore': score,
                    'isNeedAggregation': 'N',
                    # 'isApplyFilter': 'Y',
                    'page': i,
                    'pageSize': '20',
                }
                time.sleep(0.5)
                response = requests.get('https://search.shopping.naver.com/api/review', params=params, headers=headers)
                reviewInfo_json = json.loads(response.text)
                # print("reviewInfo_json : ")
                # print(reviewInfo_json)
                # time.sleep(0.5)  # 페이지마다 0.1초 sleep
                # print("======== page ", i, " =============")

                k = 0
                idx = 0
                for review in reviewInfo_json["reviews"]:  # 전체 리뷰 중 리뷰 하나씩
                    string = review["content"]
                    cleantext = BeautifulSoup(string, "lxml").text  # 리뷰에서 html 태그 제거
                    cleantext = core.replace_emoji(cleantext, replace='')  # 이모지 제거
                    cleantext = re.sub(r"[^\uAC00-\uD7A30-9a-zA-Z,.\s]", "", cleantext)  # 한글, 영어, 숫자, . 제외하고 제거
                    idx = idx + 1
                    sentences = []
                    for sent in split_sentences(cleantext):
                        sent = sent.strip()
                        sentences.append(sent)

                    reviewObj = {"idx": idx, "sentences": sentences}
                    reviews.append(reviewObj)

                    reviewNo = reviewNo + 1
                # time.sleep(100)
                # print("time :", time.time() - start)  # 현재시각 - 시작시간 = 실행 시간
            # time.sleep(1)
            totalReviewCount = totalReviewCount + (reviewNo - 1)
            # product['totalReviewCount'] = totalReviewCount
            product['content'].append({'score': score, 'reviewCount': reviewNo - 1, 'reviews': reviews})
        product['totalReviewCount'] = totalReviewCount

        result.append(product)
        time.sleep(0.5)

    print("===================page" + str(page) + "===================")
    time.sleep(0.5)

with open("desktop.json", 'w', encoding='utf-8') as outfile:
    json.dump(result, outfile, indent=4, ensure_ascii=False)
