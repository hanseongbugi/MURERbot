# MURERbot : Massive User REview-based Responsive bot
> 쇼핑몰 리뷰 분석 챗봇 서비스
<br>

## 프로젝트 배경

돈을 주고 물건을 사는 소비자의 입장에서 만족스러운 쇼핑을 위해 사고자 하는 물건의 리뷰를 참고하는 경우가 많다.<br>

 최근 온라인 쇼핑몰에서는 소비자들이 물건이 어떤지 쉽게 알려주기 위해 AI를 이용하여 긍정적인 리뷰가 얼마나 있는지, 물건의 특정 속성에 대한 사용자들의 긍정적인 의견은 어떤지 간단하게 제공한다.<br>

 하지만 쇼핑몰에서 긍정적인 리뷰를 중점적으로 노출하기 때문에 만약 부정적인 리뷰를 원하는 소비자들은 직접 검색해야한다. <br>

이밖에도, 온라인 쇼핑몰에서는 특정 개수의 속성에 대해서만 정리해주기 때문에 원하는 속성의 요약된 리뷰를 제공받지 못하는 경우도 발생한다. 소비자가 간단한 질문만으로 원하는 대답을 얻을 수 있다면 쇼핑 시간이 단축될 것이며 보다 만족스러운 쇼핑을 할 수 있을 것이다.<br>

 그러므로 우리는 소비자가 관심 있는 물건에 대해 원하는 정보를 쉽게 얻을 수 있는 챗봇 서비스를 만들고자 한다. <br>
<br>

## 프로젝트 개요
최근 chat GPT의 등장 이후, 많은 서비스들이 대화형 interface로 변해가고 있다. 우리는 이러한 흐름에 맞게 대화형 interface인 MURERbot을 구현한다.<br>

 MURERbot은 온라인 쇼핑몰 사이트의 수많은 리뷰 데이터를 활용하여 다음과 같은 기능을 구현하였다.

1. 상품에 대한 질문 답변
   * MURERbot은 딥러닝 기반의 자연어 처리 모델을 활용하여 사용자의 의도에 맞는 답변을 생성하여 제공한다
2. 상품 상세 정보 제공
   * 서로다른 단어간의 유사한 의미를 파악하기 위해 FastText를 활용하여 폭 넓은 상품 정보를 제공하였다.
3. 리뷰 요약본 제공
   * text mining 기법 중 하나인 TextRank 알고리즘을 활용하여 상품 정보 요약 기술을 개발하였다.
4. 추천 기능
   * 사용자의 질문과 상품의 리뷰 정보 간의 유사도를 활용한 콘텐츠 기반의 추천 알고리즘을 구축하였다.

<br>

## 업무 분담
* Front
  * 배한성
  * 조유진
* Back
  * 김은서
  * 조현아
* NLP 모듈 설계 (추천, 상품정보, 요약)
  * 배한성
  * 김은서
  * 조유진
  * 조현아
  <br>

## 실행방법
### 1. Requirements
server를 이용하려면 반드시 Windows와 머신에 맞는 Pytorch가 되어 있어야합니다. 
<br>
### 2. install
git clone을 통해 MURERbot을 다운로드하고 사용할 수 있습니다. 아래 명령어를 통해서 MURERbot을 다운로드 받아주세요.
```
git clone https://github.com/hanseongbugi/MURERbot.git
```
<br>

### 3. Server Dependencies
server를 구현하는데 사용된 디펜던시는 다음과 같습니다.
```
requests == 2.31.0
bs4 == 0.0.1
konlpy == 0.6.0
pandas == 1.3.5
scikit-learn == 1.0.2
sentence_transformers == 2.2.2
gensim == 4.2.0
customized-konlpy == 0.0.64
flask_cors == 3.0.10
mariadb == 1.1.6
py-hanspell
textrank
```
[py-hanspell](https://github.com/ssut/py-hanspell)과 [textrank](https://github.com/lovit/textrank)는 해당 링크를 참고하여 다운받습니다.
<br>

### 4. Database
데이터베이스는 mariadb를 사용하며, 

## 시스템 구성
### 1. 구조도
* 전반적인 구조도
<img src="https://github.com/hanseongbugi/MURERbot/assets/69022662/8a5b75d8-b590-4490-8899-b30f3b96b3f5"  width="550" height="300">
<br>

* 상세 구조도
<img src="https://github.com/hanseongbugi/MURERbot/assets/69022662/d5ef0474-ac94-4604-927d-d894adef5b39"  width="600" height="400">
<br>

### 2. Data
* Data 폴더 안에 크롤링 데이터 존재
* 크롤링 데이터를 생성하고 싶은 경우, navershopping.py 실행
<br>

## 작품 사진
### 1. 초기 화면
<img src="https://github.com/hanseongbugi/MURERbot/assets/69022662/ca6e7bd8-a730-4520-ab06-751d1c9b09c2"  width="320" height="200"> 
<img src="https://github.com/hanseongbugi/MURERbot/assets/69022662/eff7e879-b028-4e0c-a34e-5fac8e2e6a69"  width="320" height="200"> 
<img src="https://github.com/hanseongbugi/MURERbot/assets/69022662/caf73b95-de67-492a-bc80-14f86dfe0efb"  width="320" height="200">
<br>

### 2. 상품 상세 정보
<img src="https://github.com/hanseongbugi/MURERbot/assets/69022662/f7a27980-8496-4ee7-a189-d58a2130675a"  width="320" height="200"> 
<br>

### 3. 요약본 제공
* 요약본 preview
<img src="https://github.com/hanseongbugi/MURERbot/assets/69022662/edc571e6-659a-4d71-b8b7-704cd5e961e2"  width="320" height="200"> 
<br><br>

* 요약본 상세보기
<img src="https://github.com/hanseongbugi/MURERbot/assets/69022662/1254ebf6-f651-4a6a-8abe-29a0e4d66594"  width="280" height="350"> 
<br>

### 4. 추천
<img src="https://github.com/hanseongbugi/MURERbot/assets/69022662/643c6918-f672-436d-8aa5-63c474ad66e4"  width="320" height="200"> 
<br>

## 기대 효과
* 실제 인터넷 쇼핑몰 플랫폼에서의 상용화 가능
* 대화형 interface를 통해 기존의 검색 방식보다 편리하게 원하는 정보 얻을 수 있음
* 실제 소비자들의 리뷰를 한눈에 파악할 수 있는 요약본을 제공함으로써 사용자의 제품 구매 결정에 도움을 줌
* 리뷰 요약본을 통해 사용자뿐만 아니라 해당 제품 판매자 또한 쉽게 서비스 및 제품의 개선점 파악 가능
<br><br>

## 적용 기술
### - 개발 환경
<img src="https://img.shields.io/badge/Windows 10-0078D6?style=for-the-badge&logo=Windows&logoColor=white">

### - 개발 도구
<img src="https://img.shields.io/badge/Anaconda-44A833?style=for-the-badge&logo=Anaconda&logoColor=white"> <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white"> <img src="https://img.shields.io/badge/mariadb-003545?style=for-the-badge&logo=mariadb&logoColor=white"> <img src="https://img.shields.io/badge/Pycharm-000000?style=for-the-badge&logo=pycharm&logoColor=white"> <img src="https://img.shields.io/badge/flask-000000?style=for-the-badge&logo=flask&logoColor=white">

### - 개발 언어
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"> <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white">
<br><br>

## 사용한 핵심기술
### - SBERT
물어봇 프로젝트에서는 사용자가 물어봇에 입력한 문장에 대한 임베딩 벡터를 얻는 모델로 SBERT를 사용합니다.
SBERT는 BERT의 문장 벡터화 성능을 우수하게 개선하기위해 mean-polling 연산을 수행하는 층을 추가한 모델입니다. 
BERT의 임베딩 벡터는 각 토큰들에 대한 임베딩 벡터가 출력되지만 SBERT를 사용하면 pooling을 통해 각 토큰의 의미를 반영한 문장 임베딩 벡터가 출력됩니다.
이 벡터는 문장의 의미를 담고 있으므로 문장 사이의 유사도 계산에 매우 적합한 값을 갖게 됩니다.
### - BERT for Sequence Classification
BERT for Sequence Classification은 기존 BERT 모델에 긍정, 부정, 중립 판단을 위한 작업 레이어를 추가한 모델입니다.
물어봇 프로젝트에서는 사전에 labeling된 데이터셋을 BERT for Sequence Classification 모델을 통하여 긍정, 부정, 중립 3단계의 
Sentiment Classification을 수행하게됩니다.
### - TextRank
TextRank는 Google의 PageRank를 활용한 그래프 순위 알고리즘 입니다. 
TextRank를 사용함으로써 문서 내 문장들간의 연관성을 계산할 수 있으며 그 결과로 문서 내 주요 문장을 추출할 수 있습니다.
### - FastText
FastText는 단어의 단순성과 독립성을 위해 자음, 모음 단위로 단어를 분리하고 벡터화를 진행하여 유사한 단어를 도출하는 라이브러리입니다.
워드임베딩 기법으로는 FastText 뿐만이 아닌 Word2Vec과 Glove가 존재하지만 물어봇 프로젝트 특성상 학습되지 않은 단어로부터 
벡터를 얻을 수 있어야 하기 때문에 FastText 라이브러리를 사용했습니다.
### - GRU
GRU는 이전에 활용했던 정보를 현재 학습에 사용할 수 있는 모델입니다. 또한 모델의 구조가 매우 간단하여 학습의 속도가 빠르고 적은 데이터셋으로도 괜찮은 성능을 보이는 장점이 있는 모델입니다. LSTM 모델을 사용할 수도 있으나 multi-classification 데이터셋이 충분하지 않았기 때문에 
GRU를 사용하여 multi-classification predict를 진행했습니다.
### - Cosine-Similarity
코사인 유사도란 두 벡터간의 각도를 측정하여 유사성을 측정하는 방법입니다.
물어봇 프로젝트에서는 코사인 유사도를 사용하여 텍스트간의 유사성을 측정하고 해당하는 시나리오로 분류하는데 사용됩니다.
<br><br>

## 모델 학습 데이터 형식
물어봇 프로젝트에서는 총 2가지 학습 데이터를 직접 제작하고 모델에 학습시켰습니다.
### - Multi-Classification
모니터, 키보드, 마우스, 노트북, 데스크탑 카테고리 리뷰 데이터에 대해 6가지 속성인 디자인, 무게, 성능, 소음, 사이즈, 만족도로 분류하여
multi-classification 학습 데이터셋을 제작하였습니다. 한 리뷰에는 여러가지 속성이 존재할 수 있습니다.
### - Sentiment-Classification
긍정, 부정, 중립 3가지 속성으로 리뷰에 대한 Sentiment-Classification 데이터셋을 제작하였습니다.
한 리뷰에는 긍정, 부정, 중립 중 한 가지 Sentiment 속성으로만 분류를 합니다.
<br><br>

## References
* SBERT
  * Reimers, Nils, and Iryna Gurevych. "Sentence-bert: Sentence embeddings using siamese bert networks." arXiv preprint arXiv:1908.10084 (2019).
* BERT
  * Devlin, Jacob, et al. "Bert: Pre-training of deep bidirectional transformers for language understanding." arXiv preprint arXiv:1810.04805 (2018).
* GRU
  * Empirical Evaluation of Gated Recurrent Neural Networks on Sequence Modeling. 2014. Junyoung Chung et el.
* TextRank 
  * Mihalcea, Rada, and Paul Tarau. "Textrank: Bringing order into text." Proceedings of the 2004 conference on empirical methods in natural language processing. 2004.
* PageRank 
  * Brin, Sergey, and Lawrence Page. "The anatomy of a large-scale hypertextual web search engine." Computer networks and ISDN systems 30.1-7 (1998): 107-117.
* Cosine Similarity
  * Singhal, Amit. "Modern information retrieval: A brief overview." IEEE Data Eng. Bull. 24.4 (2001): 35-43.
