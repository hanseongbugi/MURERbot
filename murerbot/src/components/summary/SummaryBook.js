import "../../css/summary/summaryBook.css";
import { VictoryPie } from 'victory';
import BarChart from "./BarChart";
import { DotSpinner } from '@uiball/loaders'
import {MdOutlineDisabledByDefault} from "react-icons/md";

const infoNonDefine = "요약본이 존재하지 않습니다."
const SummaryBook = ({summaryDict}) => {
    
    if(summaryDict){
        const data = [
            { x: 1, y: summaryDict.fullPositivePercent?parseFloat(summaryDict.fullPositivePercent):0, label: "긍정"},
            { x: 2, y: summaryDict.fullNegativePercent?parseFloat(summaryDict.fullNegativePercent):0, label: "부정"}
        ]
        return (
        <>

            <div className="summaryBook_div">
                <header className={summaryDict.productName===infoNonDefine?"product_info_nonDefine":""}>
                    <h1>{summaryDict.productName?summaryDict.productName:null}</h1>
                    {summaryDict.productName===infoNonDefine?<MdOutlineDisabledByDefault size={120} className="product_info_nonDefine_icon"/>:null}
                </header>
                
                {summaryDict.detailInfo?
                <div className="product_info">
                    <h2 className="summary_h2">1. 상품 상세 정보</h2>
                    <div className="summary_division_line"></div>
                    <div className="info_div">
                        <div className="info_box">
                            <div className="info1">
                                {summaryDict.detailInfo.map((value,idx)=>idx<summaryDict.detailInfo.length/2?<p key={idx}>{value}</p>:null)}
                            </div>
                            <div className="info2">
                            {summaryDict.detailInfo.map((value,idx)=>idx>=summaryDict.detailInfo.length/2?<p key={idx}>{value}</p>:null)}
                            </div>
                        </div>
                        {summaryDict.imageURL?<img className="product_img" alt="mosue" src={summaryDict.imageURL} />:null}
                       
                    </div>
                    
                </div>:null}
                {summaryDict.fullPositiveSummary?
                <div className="total_review_summarization">
                    <h2 className="summary_h2">2. 전체 리뷰 요약</h2>
                    <div className="summary_division_line"></div>
                    <p className="review_source">※ 해당 상품 리뷰의 출처는 네이버 쇼핑입니다.</p>
                    <div className="total_chart">
                        <svg viewBox="0 0 1000 220">
                        <VictoryPie
                            labelRadius={124}
                            standalone={false}
                            name="pie"
                            width={1000}
                            height={420}
                            style={{ labels: { padding: 33, fontSize: 17, fill: "#ffffff", fontWeight:"bold"}}}
                            startAngle={90}
                            endAngle={-90}
                            colorScale={["#6BA694", "#E3465F" ]}
                            data={data}
                            animate={{
                                duration: 2000
                            }}
                        />
                        </svg>

                    </div>
                
                    <div className="review_positive_summary">
                        <p><strong>{`긍정`}</strong></p> 
                        <div className="sentiment_box"><p>{summaryDict.fullPositiveSummary}</p></div>
                    </div>
                    <div className="review_negative_summary">
                        <p><strong>{`부정`}</strong></p>
                        <div className="sentiment_box"><p>{summaryDict.fullNegativeSummary}</p></div>
                    </div>
                </div>:null}
                {summaryDict.designPositivePercent?
                <div className="review_property_summarization">
                    <h2 className="summary_h2">3. 속성별 리뷰 요약</h2>
                    <div className="summary_division_line"></div>
                    <p className="review_source">※ 해당 상품 리뷰의 출처는 네이버 쇼핑입니다.</p>
                    <div className="property_list">
                        <ul>
                            {summaryDict.designPositivePercent||summaryDict.designNegativePercent?<li>
                                <p className="attribute_p"><strong># 디자인</strong></p>
                                <BarChart negativeVal={parseFloat(summaryDict.designNegativePercent)} positiveVal={parseFloat(summaryDict.designPositivePercent)} propertyName={'디자인'}/>
                                {summaryDict.designPositiveSummary?<><p className="positive_p"><strong>{`긍정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.designPositiveSummary}</p></div></>:null}
                                {summaryDict.designNegativeSummary?<><p><strong>{`부정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.designNegativeSummary}</p></div></>:null}
                            </li>:null}
                            {summaryDict.weightPositivePercent||summaryDict.weightNegativePercent?<li>
                                <p className="attribute_p"><strong># 무게</strong></p>
                                <BarChart negativeVal={parseFloat(summaryDict.weightNegativePercent)} positiveVal={parseFloat(summaryDict.weightPositivePercent)} propertyName={'무게'}/>
                                {summaryDict.weightPositiveSummary?<><p className="positive_p"><strong>{`긍정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.weightPositiveSummary}</p></div></>:null}
                                {summaryDict.weightNegativeSummary?<><p><strong>{`부정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.weightNegativeSummary}</p></div></>:null}
                            </li>:null}
                            {summaryDict.performancePositivePercent||summaryDict.performanceNegativePercent?<li>
                                <p className="attribute_p"><strong># 성능</strong></p>
                                <BarChart negativeVal={parseFloat(summaryDict.performanceNegativePercent)} positiveVal={parseFloat(summaryDict.performancePositivePercent)} propertyName={'성능'}/>
                                {summaryDict.performancePositiveSummary?<><p className="positive_p"><strong>{`긍정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.performancePositiveSummary}</p></div></>:null}
                                {summaryDict.performanceNegativeSummary?<><p><strong>{`부정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.performanceNegativeSummary}</p></div></>:null}
                            </li>:null}
                            {summaryDict.noisePositivePercent||summaryDict.noiseNegativePercent?<li>
                                <p className="attribute_p"><strong># 소음</strong></p>
                                <BarChart negativeVal={parseFloat(summaryDict.noiseNegativePercent)} positiveVal={parseFloat(summaryDict.noisePositivePercent)} propertyName={'소음'}/>
                                {summaryDict.noisePositiveSummary?<><p className="positive_p"><strong>{`긍정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.noisePositiveSummary}</p></div></>:null}
                                {summaryDict.noiseNegativeSummary?<><p><strong>{`부정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.noiseNegativeSummary}</p></div></>:null}
                            </li>:null}
                            {summaryDict.sizePositivePercent||summaryDict.sizeNegativePercent?<li>
                                <p className="attribute_p"><strong># 크기</strong></p>
                                <BarChart negativeVal={parseFloat(summaryDict.sizeNegativePercent)} positiveVal={parseFloat(summaryDict.sizePositivePercent)} propertyName={'크기'}/>
                                {summaryDict.sizePositiveSummary?<><p className="positive_p"><strong>{`긍정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.sizePositiveSummary}</p></div></>:null}
                                {summaryDict.sizeNegativeSummary?<><p><strong>{`부정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.sizeNegativeSummary}</p></div></>:null}
                            </li>:null}
                            {summaryDict.satisficationPositivePercent||summaryDict.satisficationNegativePercent?<li>
                                <p className="attribute_p"><strong># 만족도</strong></p>
                                <BarChart negativeVal={parseFloat(summaryDict.satisficationNegativePercent)} positiveVal={parseFloat(summaryDict.satisficationPositivePercent)} propertyName={'만족도'}/>
                                {summaryDict.satisficationPositiveSummary?<><p className="positive_p"><strong>{`긍정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.satisficationPositiveSummary}</p></div></>:null}
                                {summaryDict.satisficationNegativeSummary?<><p><strong>{`부정`}</strong></p>
                                <div className="sentiment_box"><p>{summaryDict.satisficationNegativeSummary}</p></div></>:null}
                            </li>:null}
                        </ul>
                    </div>
                </div>:null}
                
            </div>
                
        
           
        </>
        );
    }
    else
        return <div className="spinner"><DotSpinner color="#A1A1A1" size={50}/></div>
    
}

export default SummaryBook;