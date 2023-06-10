# MURERbot : Massive User REview-based Responsive bot
> 쇼핑몰 리뷰 분석 챗봇 서비스
<br>

## 프로젝트 개요
* 최근 chat GPT 의 등장 이후, 많은 서비스들이 대화형 interface 로 변해가고 있다. 우리는 이러한 흐름에 맞게 대화형 interface 인 MURERbot 을 구현한다.
* MURERbot 은 온라인 쇼핑몰 사이트의 수많은 리뷰 데이터를 활용하여 다음과 같은 기능을 제공한다.
  1. 상품에 대한 질문 답변
  2. 상품 상세 정보와 리뷰 요약본 제공
  3. 추천 기능을 제공
* 이를 위해 MURERbot 은 딥러닝 기반의 자연어 처리 모델을 활용하여 사용자의 의도에 맞는 답변을 생성하여 제공한다. 
* text mining 기법 중 하나인 TextRank 알고리즘을 활용하여 상품 정보 요약 기술을 개발한다. 
* 그리고 사용자의 질문과 상품의 리뷰 정보 간의 유사도를 활용한 콘텐츠 기반의 추천 알고리즘을 구축한다. 
* 마지막으로 서로다른 단어간의 유사한 의미를 파악하기 위해 FastText 를 활용하여 폭 넓은 상품 정보를 제공한다.
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
### - 개발 도구

### - 개발 언어

## References
* SBERT
  * Reimers, Nils, and Iryna Gurevych. "Sentence-bert: Sentence embeddings using siamese bertnetworks." arXiv preprint arXiv:1908.10084 (2019).
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
