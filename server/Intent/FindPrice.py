import requests
from bs4 import BeautifulSoup
import re
from sklearn.metrics.pairwise import cosine_similarity

def isPriceQuestion(model, otherWords_noun):
    modified_otherWords_noun = [otherWord for otherWord in otherWords_noun if len(otherWord)>1]
    input = " ".join(modified_otherWords_noun)
    input_encode = model.encode(input)
    price_encode = model.encode("가격")
    price_cosim = cosine_similarity([input_encode], [price_encode])
    print("가격, "+input+"의 cosine similarity => "+str(price_cosim[0][0]))
    
    if price_cosim[0][0] > 0.5:
        return True
    else:
        return False

def findPrice(productName):
    response = requests.get("https://search.shopping.naver.com/search/all?origQuery=" + productName +
                                "&pagingSize=40&productSet=model&query=" + productName + "&sort=review&timestamp=&viewType=list")
    html = response.text
    # html 번역
    soup = BeautifulSoup(html, 'html.parser')
    price = soup.select('span.price_num__S2p_v')[0]  # 가격 태그.class
    price = re.sub('<.*?>',"", str(price))

    return price + "입니다."