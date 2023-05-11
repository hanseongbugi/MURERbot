import requests
from bs4 import BeautifulSoup
import re
import json

def findProductNames(searchItem):
    ####################################
    # 네이버 쇼핑에서 상품명 알아오기
    #
    # searchItem : 네이버 쇼핑에 검색할 단어
    # return : 네이버 쇼핑 검색 결과 (최대 5개 상품명)
    ####################################

    realItemNames = []
    # 가격비교>리뷰순으로 아이템 검색한 링크
    response = requests.get("https://search.shopping.naver.com/search/all?origQuery=" + searchItem +
                            "&pagingSize=40&productSet=model&query=" + searchItem + "&sort=review&timestamp=&viewType=list")
    html = response.text
    # html 번역
    soup = BeautifulSoup(html, 'html.parser')
    itemLists = soup.select('a.basicList_link__JLQJf')  # basicList_link__JLQJf = 네이버 쇼핑몰 상품명 태그
    itemLists = [item for item in itemLists if item.get("title")!=None]
    itemCategories = soup.select('div.basicList_depth__SbZWF') # 카테고리 div.class
    itemCategories = [re.sub('<.*?>',"", str(itemCategory)) for itemCategory in itemCategories]

    print("")
    print("### 네이버 쇼핑몰 검색 결과 ###")
    for idx,item in enumerate(itemLists):
        isContain = False
        itemTitle = item.get("title")
        itemCategory = itemCategories[idx]
        print("상품명"+str(idx)+" : " + itemTitle+" => "+itemCategory)
        if("디지털/가전" in itemCategory):
            if("노트북" in itemCategory):
                isContain = True
            elif("PC" in itemCategory):
                isContain = True
            elif("모니터" in itemCategory):
                isContain = True
            elif("주변기기" in itemCategory and ("키보드" in itemCategory or "마우스" in itemCategory)):
                isContain = True
        
        if isContain:
            realItemNames.append(itemTitle)
    
    return realItemNames

def findPrice(productName):
    ####################################
    # 네이버 쇼핑에서 가격정보 알아오기
    #
    # productName : 가격 궁금한 상품명
    # return : 상품 가격 정보
    ####################################
    response = requests.get("https://search.shopping.naver.com/search/all?origQuery=" + productName +
                                "&pagingSize=40&productSet=total&query=" + productName + "&sort=rel&timestamp=&viewType=list")
    html = response.text
    # html 번역
    soup = BeautifulSoup(html, 'html.parser')
    
    itemLists = soup.select('a.basicList_link__JLQJf')  # basicList_link__JLQJf = 네이버 쇼핑몰 상품명 태그
    itemLists = [item.get("title") for item in itemLists if item.get("title")!=None]

    prices = soup.select('span.price_num__S2p_v')  # 가격 태그.class
    prices = [re.sub('<.*?>',"", str(price)) for price in prices]
    price = prices[0]

    print(str(itemLists[0])+"의 가격 ==> "+str(prices[0]))

    return price + "입니다."

def findImageUrl(productName):
    ####################################
    # 네이버 쇼핑에서 image url 알아오기
    #
    # productName : image url 필요한 상품명
    # return : image url
    ####################################
    response = requests.get("https://search.shopping.naver.com/search/all?origQuery=" + productName +
                                "&pagingSize=40&productSet=model&query=" + productName + "&sort=rel&timestamp=&viewType=list")
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')
    detailUrl = soup.select("a.basicList_link__JLQJf")[0]["href"] # 상품 이미지 가져올 수 있는 url

    response = requests.get(detailUrl)
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')

    return str(soup.find(name="img", attrs={"alt":productName})["src"])
