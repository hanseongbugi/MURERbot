import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import usingDB
import Intent.CrawlingProduct as CrawlingProduct
import Intent.Scenario as Scenario
import Module.Recommend as Recommend
import Module.Papago as Papago
import Module.Encoder as Encoder
import Module.FastTextProcessor as FastTextProcessor
import Module.CosimClassification as CosimClassification
import Module.SummaryReview as SummaryReview
import Module.Recommend as Recommend

model = Encoder.model
twitter = Encoder.twitter
user_intent_recommend = Encoder.user_intent_recommend
user_intent_iteminfo = Encoder.user_intent_iteminfo
user_intent_reviewsum = Encoder.user_intent_reviewsum
user_intent_dontknow = Encoder.user_intent_dontknow
specialwords = Encoder.specialwords
specialwords_noun = Encoder.specialwords_noun
stopwords = Encoder.stopwords
dict_productName = Encoder.dict_productName

def isPriceQuestion(model, otherWords_noun):
    # modified_otherWords_noun = [otherWord for otherWord in otherWords_noun if len(otherWord)>1]
    # if type(otherWords_noun) is list:
    #     input = " ".join(otherWords_noun)
    # else:
    #     input = otherWords_noun
    input = " ".join(otherWords_noun)
    if input.find("얼마")>-1:
        return True
    
    input_encode = Encoder.encodeProcess(input)
    price_encode = Encoder.encodeProcess("가격")
    price_cosim = cosine_similarity([input_encode], [price_encode])
    print("가격, "+input+"의 cosine similarity => "+str(price_cosim[0][0]))
    
    if price_cosim[0][0] > 0.57:
        return True
    else:
        return False

def findProductInfo(productName, otherWords_noun):
    if type(otherWords_noun) is str:
        otherWords_noun = [otherWords_noun]
        
    if isPriceQuestion(model, otherWords_noun):
        return usingDB.getPrice(productName)+"입니다."

    productInfo = usingDB.getProductInfo(productName)
    
    print("==============================")
    valid_words = []
    for otherWord_noun in otherWords_noun:
        if len(otherWord_noun) == 1 and (otherWord_noun == "램" or otherWord_noun == "색"):
            valid_words.append(otherWord_noun)
        elif len(otherWord_noun) > 1:
            valid_words.append(otherWord_noun)
    
    result = ""
    if productInfo != "":
        try:
            print("====findProductInfo======")
            print(productName)
            if len(valid_words) > 0:
                print(valid_words)
                findKeys = []
                # findValues = []
                findValues = {}

                for otherWord_noun in valid_words:
                    for key in productInfo:
                        if str(otherWord_noun).find(key) >=0 or str(key).find(otherWord_noun) >=0:
                            # print("if문 안에 들어옴 => "+key+"/"+str(otherWord_noun))
                            findKeys.append(key)
                            # findValues.append(productInfo[key])
                            findValues[key] = productInfo[key]
                            break
                
                if len(findKeys) > 0:
                    findKeys = list(set(findKeys))
                    print(findKeys)
                    print(findValues)
                    # result = " 검색결과 " + ", ".join([key+"은(는) "+findValues[idx] for idx, key in enumerate(findKeys)])+"입니다."
                    result = " 검색결과 " + ", ".join([key+"은(는) "+findValues[key] for key in findKeys])+"입니다."
                    print("1result ===", result)

                else:
                    print("단순 정보 검색 실패 후 fasttext ,,,")
                    # for searchProductInfo in valid_words:
                    findKeys = FastTextProcessor.fastText(valid_words, list(productInfo.keys()) )
                    if len(findKeys)>0 :
                        findKeys = list(set(findKeys))
                        result = " 검색결과 " + ", ".join([key+"은(는) "+productInfo[key] for key in findKeys])+"입니다."
                        print("2result ===", result)

                    # fasttext에서도 상품정보 검색 실패한 경우
                    if result == "":
                        for word in valid_words:
                            papago_noun = Papago.papagoTranslate(word)
                            for key in productInfo:
                                if key.find(papago_noun) >=0 or papago_noun[0].find(key) >=0:
                                    print(productInfo[key])
                                    result = " 검색결과 " + word + "은(는) " + productInfo[key] + "입니다."
                                    print("3result ===", result)
                                    break
                            
                            if result != "":
                                break

                if result == "":
                    result = "해당 정보가 존재하지 않습니다."
            else:
                result = "해당 정보가 존재하지 않습니다."
        except:
            print("error")
            result = "해당 정보가 존재하지 않습니다."
    else:
            result = "해당 정보가 존재하지 않습니다."
    print("result ==>" + result)
    return result


##### (무게 알려줘)-(그램 16 어쩌고) 접근했을때 -> 요약본 or 상품정보
def processOnlyNoun(userId, productName, inputsentence):
    words_noun, otherWords_noun = splitWords(inputsentence)

    # 상품명 선택 이후 유효한 쿼리 인지 검증
    # if isValidQuery.checkValidQuery(inputsentence) == False:
    #     print("CheckValidQuery is False")
    #     output = "유효하지 않은 검색입니다."
    #     chat_category = 0
    #     state = "FALLBACK"
    #     user_intent = "Uninvalid Searching"
    #     logId = usingDB.saveLog(userId, chat_category, output, 0, productName)
    #     return logId, state, output, chat_category
    # else:
    #     print("CheckValidQuery is True")

    input_encode = Encoder.encodeProcess(inputsentence)

    detail_encode = Encoder.encodeProcess(Scenario.item_info)
    summary_encode = Encoder.encodeProcess(Scenario.review_sum)

    cosim_input_detail = cosine_similarity([input_encode], detail_encode)
    cosim_input_summary = cosine_similarity([input_encode], summary_encode)

    detail_max_cosim = CosimClassification.get_max_cosim(user_intent_iteminfo, cosim_input_detail)
    summary_max_cosim = CosimClassification.get_max_cosim(user_intent_reviewsum, cosim_input_summary)

    print(str(np.max([detail_max_cosim, summary_max_cosim])))

    # 상품 정보 제공
    if detail_max_cosim > summary_max_cosim and detail_max_cosim > 0.6:
        user_intent = user_intent_iteminfo
        print("===========확인=============")
        output = findProductInfo(productName, otherWords_noun)
        chat_category = 3
        state = "SUCCESS"
    # 요약본 제공
    elif detail_max_cosim < summary_max_cosim and summary_max_cosim > 0.6:
        user_intent = user_intent_reviewsum
        output = SummaryReview.previewSummary(productName)
        chat_category = 1
        state = "SUCCESS"
    else:
        user_intent = user_intent_dontknow
        output = "채팅을 이해하지 못했습니다."
        chat_category = 0
        state = "FALLBACK"

    print("유저의 의도는 [ " + user_intent + " ] 입니다")
    logId = usingDB.saveLog(userId, chat_category, output, 0, productName)
    return logId, state, output, chat_category


def splitWords(inputsentence):
    ####################################
    # 사용자가 입력한 문장에서 "specialwords 제외한 명사, 숫자, 영어 / 그 외 단어"로 분리
    #
    # inputsentence : 사용자가 입력한 문장
    # return
    #   : words = specialwords 제외한 명사, 숫자, 영어 
    #   : otherWords = 그 외 단어
    ####################################

    words = []  # specialwords 제외한 'Noun', 'Number', 'Alpha'
    otherWords = []  # words[]에 포함되지 않는 단어들
    # inputsentence = (spell_checker.check(inputsentence)[2])
    # print("Modified Sentence => " + inputsentence)
    #inputsentence = inputsentence.replace(" ", "")
    print("===== Split Words =====")
    # print(specialwords)
    for word in twitter.pos(inputsentence):
        print(word[0] + " => " + word[1])
        if word[1] in ['Noun', 'Number', 'Alpha']:
            if not word[0] in specialwords:
                isAppend = False
                for productDetailWord in specialwords_noun:
                    if word[0] in productDetailWord:
                        if word[1] == 'Alpha' and word[1] != productDetailWord:
                            continue
                        otherWords.append(word[0])
                        isAppend = True
                        break
                
                if not isAppend:
                    words.append(word[0])
            else:
                otherWords.append(word[0])
        elif word[1] != "Punctuation":
            otherWords.append(word[0])

    return words, otherWords

def makeSearchKeyword(searchItem):
    isAlpha = True
    searchKeyword = ""
    for idx, character in enumerate(list(searchItem)):
        characterInfo = twitter.pos(character)[0]
        # print(characterInfo)
        if idx > 0:
            if isAlpha == True and (characterInfo[1] != 'Alpha' and characterInfo[1] != 'Number'):
                searchKeyword = searchKeyword + " "+ characterInfo[0]
                isAlpha = False
            elif isAlpha == False and characterInfo[1] == 'Alpha':
                searchKeyword = searchKeyword + " "+ characterInfo[0]
                isAlpha = True
            else:
                searchKeyword = searchKeyword + characterInfo[0]
        else:
            if characterInfo[1] != 'Alpha' and characterInfo[1] != 'Number':
                isAlpha = False
            searchKeyword = characterInfo[0]

    return searchKeyword

def getNounFromInput(userId, inputsentence):
    ####################################
    # 사용자가 입력한 문장에서 명사(제품명) 추출
    #
    # inputsentence : 사용자가 입력한 문장
    ####################################

    words, otherWords = splitWords(inputsentence)

    print(words)
    print(otherWords)
    if len(otherWords) != 0:
        return "FALLBACK", "죄송합니다. 무슨 말인지 이해하지 못했습니다."
    searchItem = "".join(words)
    # print("****** "+searchItem+" 검색해보기 ******")
    realItemNames, chat_category, imageUrls = getProductNames(searchItem) # 자세한 상품명 제공
    
    logId = usingDB.saveLog(userId,chat_category,realItemNames,0,imageURLs=imageUrls)
    print("REQUIRE_DETAIL")
    return logId, "REQUIRE_DETAIL", realItemNames, chat_category, imageUrls


def getProductNames(searchItem):
    ####################################
    # 네이버 쇼핑에서 상품명 알아오기
    #
    # searchItem : 네이버 쇼핑에 검색할 단어
    # return result(검색결과), chat_category(0/5)
    ####################################\
    searchKeyword = makeSearchKeyword(searchItem)
    realItemNames = CrawlingProduct.findProductNames(searchKeyword) # 상품명 크롤링
    sendItemNames = []
    imageUrls = []
    output = ""
    chat_category = 5
    if len(realItemNames) == 0:
        output = "지원하지 않는 상품입니다."
        chat_category = 0
    else:
        for idx, itemName in enumerate(realItemNames):
            imageUrl = usingDB.getProductImageURL(itemName) # db에서 imageUrl 가져오기
            if imageUrl != "":
                sendItemNames.append(itemName)
                imageUrls.append(imageUrl)
                
        print(str(imageUrls))
        if len(imageUrls) == 0:
            output = "지원하지 않는 상품입니다."
            chat_category = 0
        else:
            output = ",".join(sendItemNames)+", 원하시는 상품이 있는 경우 클릭해주세요!\n찾으시는 상품명이 없는 경우 상품명을 자세히 작성해주세요."
    
    if output == "지원하지 않는 상품입니다.":
        print("다시 크롤링")
        realItemNames = CrawlingProduct.findProductNames(searchKeyword.replace(" ","")) # 상품명 크롤링
        for idx, itemName in enumerate(realItemNames):
            imageUrl = usingDB.getProductImageURL(itemName) # db에서 imageUrl 가져오기
            if imageUrl != "":
                sendItemNames.append(itemName)
                imageUrls.append(imageUrl)
                
        print(str(imageUrls))
        if len(imageUrls) > 0:
            output = ",".join(sendItemNames)+", 원하시는 상품이 있는 경우 클릭해주세요!\n찾으시는 상품명이 없는 경우 상품명을 자세히 작성해주세요."
            chat_category = 5

    return output, chat_category, imageUrls


def predictIntent(userId, productName, inputsentence, intent, keyPhrase, originalUserInput):
    ####################################
    # 사용자가 입력한 문장 의도 판단
    #
    # productName : 사용자가 원하는 productName
    # inputsentence : 사용자가 입력한 문장
    # intent : 판단된 사용자 질문 의도 
    # keyPhrase : 사용자 질문 중 핵심 문구
    ####################################
    recResult = []
    recSentence = originalUserInput
    for stopword in stopwords:
        inputsentence = inputsentence.replace(stopword,"")
    
    input_encode = Encoder.encodeProcess(inputsentence)
    words, otherWords = splitWords(inputsentence)
    print("Product Name >>>", productName)
    print("Words >>>",words)
    # print(type(words))
    print("otherWords >>>", otherWords)

    # 해줄수있어? 해줄래가 입력되면 상품명 + 줄로 검색을해서
    # 밧줄같은 상품이 검색된다. 따라서 줄 삭제
    for word in words: 
        if "줄" in word:
            words.remove(word)
    print("Words delete 줄",words)
    
    recommendLogId = -1

    # 입력을 명사로만 접근했을때
    if (len(otherWords) == 0):
        searchItem = "".join(words)
        realItemNames,chat_category,imageUrls = getProductNames(searchItem) # 자세한 상품명 제공
        logId = usingDB.saveLog(userId,chat_category,realItemNames,0,imageURLs=imageUrls)
        return logId, "REQUIRE_DETAIL", realItemNames, intent, keyPhrase, chat_category, imageUrls, recResult

    # 추천, 상품 정보, 요약본 분류, 알수없음
    else:
        imageUrls = []
        output = ""
        state = ""

        inputsentence = " ".join(otherWords)
        if len([otherWord for otherWord in otherWords if len(otherWord)==1]) == len(otherWords):
            # state = "FALLBACK"
            # output = "채팅을 이해하지 못했습니다."
            # print("유저의 의도를 알 수 없습니다 !!")
            inputsentence = "".join(otherWords)
            keyPhrase = inputsentence
            # chat_category = 0
        else:
            keyPhrase = inputsentence
        input_encode = Encoder.encodeProcess(keyPhrase)
        rec_encode = Encoder.encodeProcess(Scenario.recommend)
        detail_encode = Encoder.encodeProcess(Scenario.item_info)
        summary_encode = Encoder.encodeProcess(Scenario.review_sum)

        something_encode = Encoder.encodeProcess("어떤것")
        something_cosim = np.max(cosine_similarity([input_encode],[something_encode]))
        if something_cosim>0.78:
            keyPhrase = ""
            searchItem = "".join(words)
            realItemNames,chat_category,imageUrls = getProductNames(searchItem) # 자세한 상품명 제공
            logId = usingDB.saveLog(userId,chat_category,realItemNames,0,imageURLs=imageUrls)
            return logId, "REQUIRE_DETAIL", realItemNames, intent, keyPhrase, chat_category, imageUrls, recResult
        print("어떤것과 "+keyPhrase+"와의 cosim => "+str(something_cosim))

        cosim_input_rec = cosine_similarity([input_encode], rec_encode)  # 상품 추천 유사도
        cosim_input_detail = cosine_similarity([input_encode], detail_encode)  # 상품 정보 유사도
        cosim_input_summary = cosine_similarity([input_encode], summary_encode)  # 요약본 유사도


        # 분류 => 코사인유사도 수치
        recommend_max_cosim = CosimClassification.get_max_cosim(user_intent_recommend, cosim_input_rec)
        detail_max_cosim = CosimClassification.get_max_cosim(user_intent_iteminfo, cosim_input_detail)
        summary_max_cosim = CosimClassification.get_max_cosim(user_intent_reviewsum, cosim_input_summary)

        # "추천"들어갈 경우 추천 가중치
        if "추천" in keyPhrase:
            recommend_max_cosim += 0.6
            print("RECOMMEND 가중치 +0.6")

        if "사양" in keyPhrase or "스펙" in keyPhrase or "성능" in keyPhrase or "상세정보" in keyPhrase or "장점" in keyPhrase or "단점" in keyPhrase or "장단점" in keyPhrase or "후기" in keyPhrase: 
            print("summary 가중치 +0.4")
            summary_max_cosim += 0.4
        print("RECOMMEND =>" + str(recommend_max_cosim))
        print("ITEM_INFO => "+str(detail_max_cosim))
        print("REVIEW_SUM => "+str(summary_max_cosim))

        intent = CosimClassification.print_max_type(recommend_max_cosim, detail_max_cosim, summary_max_cosim)

        if intent == user_intent_recommend:
            state = "SUCCESS"
            output, imageUrls, recommendLogId, recResult = Recommend.recommendProcess(recSentence)
            chat_category = 2
            print("유저의 의도는 [ " + intent + " ] 입니다")


        elif intent == user_intent_iteminfo:
            # print("elif intent == user_intent_iteminfo:")
            if len(words) != 0: # 명사가 적혀있는 경우
                # print("len(words) != 0")
                searchItem = "".join(words)
                realItemNames,chat_category, imageUrls = getProductNames(searchItem) # 해당 명사가 상품명인지 판단
                if chat_category == 5: # 상품명인 경우
                    logId = usingDB.saveLog(userId,chat_category,realItemNames,0,imageURLs=imageUrls)
                    return logId, "REQUIRE_DETAIL", realItemNames, intent, keyPhrase,chat_category, imageUrls, recResult
                elif productName == "": # 상품명 정보가 어디에도 없는 경우
                    state = "REQUIRE_PRODUCTNAME"
                    output = "어떤 상품에 대해 궁금하신가요?"
                    chat_category = 0
                else:
                    state = "SUCCESS"
                    output = findProductInfo(productName, otherWords)
                    chat_category = 3
            else:  # 명사
                if productName == "": # 상품명 정보가 어디에도 없는 경우
                    state = "REQUIRE_PRODUCTNAME"
                    output = "어떤 상품에 대해 궁금하신가요?"
                    chat_category = 0
                else:
                    state = "SUCCESS"
                    output = findProductInfo(productName, otherWords)
                    chat_category = 3

            print("유저의 의도는 [ " + intent + " ] 입니다")

        elif intent == user_intent_reviewsum:  # (삼성 오디세이 요약본 줘)
            if len(words) !=0:
                searchItem = "".join(words)
                realItemNames, chat_category, imageUrls = getProductNames(searchItem)
                if chat_category ==5:
                    logId = usingDB.saveLog(userId, chat_category, realItemNames,0)
                    return logId, "REQUIRE_DETAIL", realItemNames, intent, keyPhrase, chat_category, imageUrls, recResult
                elif productName == "": ## 그램 상품명 못잡는 곳.. 일단해결 0523
                    state = "REQUIRE_PRODUCTNAME"
                    output = "어떤 상품에 대해 궁금하신가요?"
                    chat_category = 0
                else:
                    state = "SUCCESS"
                    output = SummaryReview.previewSummary(productName)
                    chat_category = 1
            else:
                if productName == "": # 상품명 정보가 어디에도 없는 경우
                    state = "REQUIRE_PRODUCTNAME"
                    output = "어떤 상품에 대해 궁금하신가요?"
                    chat_category = 0
                else:
                    if len(otherWords) == 1 and ("사양" in otherWords[0] or "스펙" in otherWords[0] or "요약" in otherWords[0] or "성능" in otherWords[0] or "상세정보" in otherWords[0] or "장점" in otherWords[0] or "단점" in otherWords[0] or "장단점" in otherWords[0]):
                        state = "SUCCESS"
                        output = SummaryReview.previewSummary(productName)
                        chat_category = 1
                    elif "요약" in otherWords or "리뷰" in otherWords or "요약본" in otherWords:
                        state = "SUCCESS"
                        output = SummaryReview.previewSummary(productName)
                        chat_category = 1
                    else: # gpu 사양 어때, 리뷰 요약
                        state = "SUCCESS"
                        output = findProductInfo(productName, otherWords) # fasttext 시간
                        chat_category = 3
                        print(output)
                        if output == "해당 정보가 존재하지 않습니다.":
                            output = SummaryReview.previewSummary(productName) # + textrank 시간
                            chat_category = 1
            print("유저의 의도는 [ " + intent + " ] 입니다")
        else:
            state = "FALLBACK"
            output = "채팅을 이해하지 못했습니다."
            print("유저의 의도를 알 수 없습니다 !!!")
            keyPhrase = ""
            chat_category = 0

        if(recommendLogId == -1):
            logId = usingDB.saveLog(userId, chat_category, output, 0, productName, imageURLs=imageUrls)
        else:
            logId = usingDB.saveLog(userId, chat_category, output, 0, productName, imageURLs=imageUrls, recommendLogId=recommendLogId)
        return logId, state, output, intent, keyPhrase, chat_category, imageUrls, recResult