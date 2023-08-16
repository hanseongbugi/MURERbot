from sentence_transformers import SentenceTransformer
from ckonlpy.tag import Twitter  # pip install customized_konlpy
import pandas as pd

##### Model
model = SentenceTransformer('jhgan/ko-sbert-multitask')
twitter = Twitter()

##### User Intent Status
user_intent_recommend = "RECOMMEND"
user_intent_iteminfo = "ITEM_INFO"
user_intent_reviewsum = "REVIEW_SUM"
user_intent_dontknow = "DONT_KNOW"

##### Word Files Path
specialwordsFileFullPath = "../server/data/specialwords.csv"
stopwordsFileFullPath = "../server/data/stopwords.csv"

#####
df_specialwords = pd.read_csv(specialwordsFileFullPath, encoding='cp949')

classificationNouns = df_specialwords["classification_noun"].astype(str).tolist() # 무조건 명사로 분류할 것들
classificationNouns = [x for x in classificationNouns if x != 'nan']

productNameNouns = df_specialwords["product_name"].astype(str).tolist() # 무조건 명사로 분류할 것들
productNameNouns = [x for x in productNameNouns if x != 'nan']

specialwords = df_specialwords["specialwords"].astype(str).tolist()
specialwords = [x for x in specialwords if x != 'nan']

df_specialwords.drop_duplicates(subset=['specialwords_noun'], inplace=True)  # 중복된 행 제거
specialwords_noun = df_specialwords["specialwords_noun"].astype(str).tolist()
specialwords.extend(specialwords_noun)

df_stopwords = pd.read_csv(stopwordsFileFullPath, encoding='cp949')
stopwords = df_stopwords["stopwords"].astype(str).tolist()
stopwords = [x for x in stopwords if x != 'nan']

##### 별도 처리 단어
twitter.add_dictionary(specialwords+classificationNouns+productNameNouns, 'Noun')
twitter.template_tagger.add_a_template(('Noun', 'Noun', 'Noun', 'Adjective'))

dict_productName = {}
for idx,noun in enumerate(productNameNouns+specialwords_noun):
    dict_productName["=+"+str(idx)+"+="] = noun
