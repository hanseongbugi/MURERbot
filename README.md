# MURERbot : Massive User REview-based Responsive bot
> 쇼핑몰 리뷰 분석 챗봇 서비스
<br>

## 프로젝트 배경

돈을 주고 물건을 사는 소비자의 입장에서 만족스러운 쇼핑을 위해 사고자 하는 물건의 리뷰를 참고하는 경우가 많다.<br>

 최근 온라인 쇼핑몰에서는 소비자들이 물건이 어떤지 쉽게 알려주기 위해 AI를 이용하여 긍정적인 리뷰가 얼마나 있는지, 물건의 특정 속성에 대한 사용자들의 긍정적인 의견은 어떤지 간단하게 제공한다.<br>

 하지만 쇼핑몰에서 긍정적인 리뷰를 중점적으로 노출하기 때문에 만약 부정적인 리뷰를 원하는 소비자들은 직접 검색해야한다. <br>

이밖에도, 온라인 쇼핑몰에서는 특정 개수의 속성에 대해서만 정리해주기 때문에 원하는 속성의 요약된 리뷰를 제공받지 못하는 경우도 발생한다. 소비자가 간단한 질문만으로 원하는 대답을 얻을 수 있다면 쇼핑 시간이 단축될 것이며 보다 만족스러운 쇼핑을 할 수 있을 것이다.<br>

 그러므로 우리는 소비자가 관심 있는 물건에 대해 원하는 정보를 쉽게 얻을 수 있는 챗봇 서비스를 만들고자 한다. <br>

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



## 구조도
### Data
* Data 폴더 안에는 크롤링 데이터가 존재한다.
* 크롤링 데이터를 생성하고 싶으면, navershopping.py를 실행한다.
  * python navershopping.py
  <br>

## 작품 사진
<br>

## 기대 효과
<br>

## 적용 기술
### - 개발 환경
<img src="https://img.shields.io/badge/Windows 10-0078D6?style=for-the-badge&logo=Windows&logoColor=white">

### - 개발 도구
<img src="https://img.shields.io/badge/Anaconda-44A833?style=for-the-badge&logo=Anaconda&logoColor=white"> <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white"> <img src="https://img.shields.io/badge/mariadb-003545?style=for-the-badge&logo=mariadb&logoColor=white"> <img src="https://img.shields.io/badge/Pycharm-000000?style=for-the-badge&logo=pycharm&logoColor=white"> <img src="https://img.shields.io/badge/flask-000000?style=for-the-badge&logo=flask&logoColor=white">

### - 개발 언어
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"> <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white">
<br><br>

## 사용한 핵심기술
* SBERT
* FastText
* TextRank
* BERT
* GRU
* Cosine-Similarity
  

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
