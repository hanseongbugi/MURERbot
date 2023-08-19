from gensim.models.keyedvectors import KeyedVectors

VECTOR_FILE_PATH = "./data/cc.ko.300.vec"
LIMIT = 50000

fastTextModel = KeyedVectors.load_word2vec_format(VECTOR_FILE_PATH, limit=LIMIT)

def fastText(otherWords_noun, productInfoKeys):
    # otherWords_noun과 유사한 단어찾기 ex) 색 & 색상

    # print(f"Type of model: {type(fastTextModel)}")
    findKeys = []
    for otherWord_noun in otherWords_noun:
        try:
            findSimilarWord = fastTextModel.most_similar(otherWord_noun)
            print(findSimilarWord)
            print("==" * 20)

            for value in findSimilarWord:
                for productInfoKey in productInfoKeys:
                    if value[0] == productInfoKey:
                        print(otherWord_noun + "is similar with " + productInfoKey)
                        findKeys.append(productInfoKey)
                        break
        except:
            pass

    return findKeys

def getSimilarWords(input):
    return fastTextModel.most_similar(input,topn=15)