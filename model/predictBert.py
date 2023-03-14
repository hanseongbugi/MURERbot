import torch
from keras.utils import pad_sequences
from transformers import BertTokenizer
import numpy as np
from transformers import BertForSequenceClassification
from keybert import KeyBERT

model_name = "bert-base-multilingual-cased"
device = "cuda" if torch.cuda.is_available() else "cpu"
model = BertForSequenceClassification.from_pretrained(model_name, num_labels=2).cuda()

model_file = ""  # 테스트 진행할 모델.pt
model.load_state_dict(torch.load(model_file))
tokenizer = BertTokenizer.from_pretrained(model_name, do_lower_case=False)


# 입력 데이터 변환
def convert_input_data(sentences):
    # BERT의 토크나이저로 문장을 토큰으로 분리
    tokenized_texts = [tokenizer.tokenize(sent) for sent in sentences]

    # 입력 토큰의 최대 시퀀스 길이
    MAX_LEN = 128

    # 토큰을 숫자 인덱스로 변환
    input_ids = [tokenizer.convert_tokens_to_ids(x) for x in tokenized_texts]

    # 문장을 MAX_LEN 길이에 맞게 자르고, 모자란 부분을 패딩 0으로 채움
    input_ids = pad_sequences(input_ids, maxlen=MAX_LEN, dtype="long", truncating="post", padding="post")

    # 어텐션 마스크 초기화
    attention_masks = []

    # 어텐션 마스크를 패딩이 아니면 1, 패딩이면 0으로 설정
    # 패딩 부분은 BERT 모델에서 어텐션을 수행하지 않아 속도 향상
    for seq in input_ids:
        seq_mask = [float(i > 0) for i in seq]
        attention_masks.append(seq_mask)

    # 데이터를 파이토치의 텐서로 변환
    inputs = torch.tensor(input_ids)
    masks = torch.tensor(attention_masks)

    return inputs, masks


# 문장 테스트
def test_sentences(sentences):
    # 평가모드로 변경
    model.eval()

    # 문장을 입력 데이터로 변환
    inputs, masks = convert_input_data(sentences)

    # 데이터를 GPU에 넣음
    b_input_ids = inputs.to(device)
    b_input_mask = masks.to(device)

    # 그래디언트 계산 안함
    with torch.no_grad():
        # Forward 수행
        outputs = model(b_input_ids,
                        token_type_ids=None,
                        attention_mask=b_input_mask)

    # 출력 로짓 구함
    logits = outputs[0]

    # CPU로 데이터 이동
    logits = logits.detach().cpu().numpy()

    return logits


kb = KeyBERT(model=model)
negativeCnt = 0
positiveCnt = 0
with open("", "r", encoding="utf-8") as f: # 테스트 진행할 txt 파일 경로
    for line in f:
        logits = test_sentences([line])

        if np.argmax(logits) == 1:
            print(line)
            positiveCnt += 1
        elif np.argmax(logits) == 0:
            negativeCnt += 1

total = positiveCnt + negativeCnt
print(str(negativeCnt) + "/" + str(total))
