import "../../css/screen/summaryBook.css";
import mouse from "../../img/mouse.png"
import { VictoryPie } from 'victory';
import BarChart from "./BarChart";

const SummaryBook = () => {
    const data = [
        { x: 1, y: 70, label: "긍정"},
        { x: 2, y: 30, label: "부정"}
    ]
    
    return (
        <>

            <div className="summaryBook_div">
                <header>
                    <h1>로지텍 페블 M305 마우스</h1>
                </header>
                
                <div className="product_info">
                    <h2>1. 상품 상세 정보</h2>
                    <div className="info_div">
                        <div className="info1">
                            <p>연결 방식: 무선</p>
                            <p>감응방식: 광</p>
                            <p>전송방식: RF 2.4GHz, 블루투스4.0</p>
                            <p>휠 조정: 상하</p>
                            <p>버튼수: 3버튼</p>
                        </div>
                        <div className="info2">
                            <p>최대 감도: 1000dpi</p>
                            <p>형태: 슬림형</p>
                            <p>배터리: AA건전지x1</p>
                            <p>수신기: 수납가능</p>
                            <p>크기: 5.9x10.7x2.7cm</p>
                        </div>
                        <img className="mouse_img" alt="mosue" src={mouse} />
                    </div>
                    
                </div>
                
                <div className="total_review_summarization">
                    <h2>2. 전체 리뷰 요약</h2>
                    <div className="total_chart">
                        <svg viewBox="0 0 1000 220">
                        <VictoryPie
                            
                            standalone={false}
                            name="pie"
                            width={1000}
                            height={420}
                            style={{ labels: { padding: 30, fontSize: 18, fill: "#626262"}}}
                            startAngle={90}
                            endAngle={-90}
                            colorScale={["#5BE7A9", "#F34C4C" ]}
                            data={data}
                            animate={{
                                duration: 2000
                            }}
                        />
                        </svg>

                    </div>
                    <div className="review_positive_summary">
                        <p><strong># 긍정</strong></p> 
                        <p>블루투스 연결도 편하고 사용 중인 노트북 키보드보다 소리가 작고 키감이 좋아 요즘은 이 키보드만 쓰고 있습니다<br/>
                        아이패드를 구매하고, 키보드를 찾다가 제일 많이 추천하는 걸 사자해서 사게되었는데, 단점이라곤 한영 바꾸는거랑, 영어 대소문자 구분하는 데에 있어서 조금 힘들분 사용하는 부분에서는 크게 문제 없어서 좋은거 같아요, 가지고 다니기도 편하구 좋아요.</p>
                    </div>
                    <div className="review_negative_summary">
                        <p><strong># 부정</strong></p>
                        <p>벌크 제품인지 누가쓰다 환불한 제품인지판매자만 알겠지만 돈받고 파시는건데최소한 배송중에 파손은 안되겠끔 해주고 보내셔야죠<br/>
                         스마트픽이라고 더 좋을줄 알고 했는데 보관이 엉망 박스는 밟았는지 찌그러져 있고 상품박스 헌거 처럼 얼룩지고다행이 상품은 정상인것 같아서 그냥 쓰기로 다시는 스마트픽 안할것 같네요</p>
                    </div>
                </div>
                
                <div className="review_property_summarization">
                    <h2>3. 속성별 리뷰 요약</h2>
                    <div className="property_list">
                        <ul>
                            <li>
                                <p><strong># 디자인 (40%)</strong></p>
                                <BarChart negativeVal={20} positiveVal={80} propertyName={'디자인'}/>
                            </li>
                            <li>
                                <p><strong># 무게 (20%)</strong></p>
                                <BarChart negativeVal={20} positiveVal={80} propertyName={'무게'}/>
                            </li>
                            <li>
                                <p><strong># 성능 (34%)</strong></p>
                                <BarChart negativeVal={20} positiveVal={80} propertyName={'무게'}/>
                            </li>
                            <li>
                                <p><strong># 소음 (60%)</strong></p>
                                <BarChart negativeVal={20} positiveVal={80} propertyName={'무게'}/>
                            </li>
                            <li>
                                <p><strong># 크기 (20%)</strong></p>
                                <BarChart negativeVal={20} positiveVal={80} propertyName={'무게'}/>
                            </li>
                            <li>
                                <p><strong># 만족도 (30%)</strong></p>
                                <BarChart negativeVal={20} positiveVal={80} propertyName={'무게'}/>
                            </li>
                        </ul>
                    </div>
                </div>
                
            </div>
        
           
        </>
    );
}

export default SummaryBook;