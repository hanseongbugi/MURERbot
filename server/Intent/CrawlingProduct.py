import requests
from bs4 import BeautifulSoup
import re
import json
import usingDB
import nsTagConfig

tag = nsTagConfig.NAVERSHOPPINGTAG

def findProductNames(searchItem):
    ####################################
    # 네이버 쇼핑에서 상품명 알아오기
    #
    # searchItem : 네이버 쇼핑에 검색할 단어
    # return : 네이버 쇼핑 검색 결과 (최대 5개 상품명)
    ####################################
    print("### 네이버 쇼핑몰 "+str(searchItem)+" 검색 ###")
    realItemNames = []
    # 가격비교>리뷰순으로 아이템 검색한 링크
    response = requests.get("https://search.shopping.naver.com/search/all?origQuery=" + searchItem +
                            "&pagingSize=40&productSet=model&query=" + searchItem + "&sort=review&timestamp=&viewType=list")
    html = response.text
    # html 번역
    soup = BeautifulSoup(html, 'html.parser')
    itemLists = soup.select(tag["product_title"])  # a.basicList_link__JLQJf = 네이버 쇼핑몰 상품명 태그
    itemLists = [item for item in itemLists if item.get("title")!=None]
    itemCategories = soup.select(tag["product_category"]) # 카테고리 div.class, div.basicList_depth__SbZWF
    itemCategories = [re.sub('<.*?>',"", str(itemCategory)) for itemCategory in itemCategories]

    if len(itemLists) == 0:
        realItemNames = usingDB.searchProduct(searchItem)
    else:
        print("")
        print("###  네이버 쇼핑 "+searchItem+" 검색 결과 ###")
        #print(itemLists)
        if len(itemLists) == 0:
            print("상품 이름 crawling 실패 => db 검색 진행...")
            
        for idx,item in enumerate(itemLists):
            isContain = False
            type = -1
            itemTitle = item.get("title")
            itemCategory = itemCategories[idx]
            print("상품명"+str(idx)+" : " + itemTitle+" => "+itemCategory)
            if("디지털/가전" in itemCategory):
                if("노트북" in itemCategory):
                    type = 0
                    isContain = True
                elif("PC" in itemCategory):
                    type = 1
                    type = 1
                    isContain = True
                elif("모니터" in itemCategory):
                    type = 2
                    isContain = True
                elif("주변기기" in itemCategory):
                    if "키보드" in itemCategory:
                        type = 3
                        isContain = True
                    elif "마우스" in itemCategory:
                        type = 4
                        isContain = True
            
            if isContain:
                try:
                    usingDB.insertNewProduct(type, itemTitle, url=str(item.get("href")))
                    realItemNames.append(itemTitle)
                except Exception as e:
                    print(e)
                    continue
    
    return realItemNames


def findPrice(productName):

    ####################################
    # 네이버 쇼핑에서 가격정보 알아오기
    #
    # productName : 가격 궁금한 상품명
    # return : 상품 가격 정보
    ####################################

    response = requests.get(usingDB.getURL(productName))
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')
    # print(soup)
    prices = soup.select(tag["product_price"])  # basicList_link__JLQJf = 네이버 쇼핑몰 상품명 태그 'em.lowestPrice_num__A5gM9'
    # print(prices)
    if len(prices) == 0: # 판매 중단된 상품
        return 0
    else:
        price = re.sub('<.*?>',"", str(prices[0]))
        price = re.sub(r'[^0-9]', '', price)
        print(productName+"의 가격 ==> "+price)

        return int(price)


def findImageUrl(productName):
    
    ####################################
    # 네이버 쇼핑에서 image url 알아오기
    #
    # productName : image url 필요한 상품명
    # return : image url
    ####################################

    print("\n"+"crawling product img")
    print(productName+" 이미지 크롤링 진행 ...")

    try:
        response = requests.get(usingDB.getURL(productName))
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        imageurl = soup.find(name="img", attrs={"alt":productName})["src"]

        return str(imageurl)
    except Exception as e:
        print(e)
        return ""


def findProductInfo(productName):

    ####################################
    # 네이버 쇼핑에서 상품 정보 알아오기
    #
    # productName : 상세 상품명
    # return : 상품 정보
    ####################################

    print("\n"+"crawling product info")
    print(productName+" 상세정보 크롤링 진행 ...")

    productInfo = {}
    
    response = requests.get(usingDB.getURL(productName))
    html = response.text
    html_data = BeautifulSoup(html, 'html.parser')
    for data in html_data.select(tag["product_info"]): # product 상세 정보 가져오기 span.top_cell__5KJK9
        data = str(data).replace("<!-- -->", "")
        modified_data = re.sub('<.*?>',"", data)
        if ":" in modified_data:
            split_data = modified_data.split(":")
            productInfo[split_data[0].replace(" ","").strip()] = split_data[1].strip()

    return productInfo