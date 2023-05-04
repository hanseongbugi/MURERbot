import pandas as pd

stopwordsFilePath = './data/stopwords.csv'

def stopWordProcess(userInput):
    df_stopwords = pd.read_csv(stopwordsFilePath, encoding='cp949')
    stopwords = df_stopwords["stopwords"].astype(str).tolist()

    for stopword in stopwords:
        #print(stopword)
        userInput = userInput.replace(stopword, "")
        userInput = userInput.replace(" ", "")
        #print(userInput)

    print("불용어 제거 완료 ==> " + userInput)
    return userInput
