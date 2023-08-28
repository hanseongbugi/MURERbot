import "../../css/summary/summaryBook.css";
import PropertyChart from "./PropertyChart";
import { DotSpinner } from '@uiball/loaders'
import {MdOutlineDisabledByDefault} from "react-icons/md";
import {IoIosArrowDown,IoIosArrowUp} from "react-icons/io"
import React,{ useState } from "react";
import {FaUser, FaRegSadTear} from "react-icons/fa";
import PropertyReview from "./PropertyReview";
import FullChart from "./FullChart";

const infoNonDefine = "요약본이 존재하지 않습니다."

const SummaryBook = React.forwardRef(({summaryDict},scrollbarRef) => {
    const [inforMoreBtn,setInforMoreBtn]=useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0)

    console.log(summaryDict)
    if(summaryDict){
        const positive = parseFloat(summaryDict.fullPositivePercent);
        const negative = parseFloat(summaryDict.fullNegativePercent)
        const total = positive + negative;
        const fullData = [
            { name: '긍정',data: [parseFloat(positive/total*100).toFixed(2)]},
            { name: '부정', data: [parseFloat(negative/total*100).toFixed(2)]}
        ]

        const propertyData = [
            { name: '긍정', data: [parseFloat(summaryDict.designPositivePercent),parseFloat(summaryDict.weightPositivePercent), parseFloat(summaryDict.performancePositivePercent),parseFloat(summaryDict.noisePositivePercent), parseFloat(summaryDict.sizePositivePercent),parseFloat(summaryDict.satisficationPositivePercent)]}, 
            { name: '부정', data: [parseFloat(summaryDict.designNegativePercent),parseFloat(summaryDict.weightNegativePercent), parseFloat(summaryDict.performanceNegativePercent),parseFloat(summaryDict.noiseNegativePercent),  parseFloat(summaryDict.sizeNegativePercent),parseFloat(summaryDict.satisficationNegativePercent)]}
        ]
        const informationMore = (e)=>{
            e.preventDefault();
            if(scrollbarRef) scrollbarRef.current.scrollTop();
            inforMoreBtn?setInforMoreBtn(false):setInforMoreBtn(true);
        }

        const propertyArray = ["디자인", "무게", "성능", "소음", "크기", "만족도"]
        const propertiesPositiveSummary = [summaryDict.designPositiveSummary, summaryDict.weightPositiveSummary, summaryDict.performancePositiveSummary, summaryDict.noisePositiveSummary, summaryDict.sizePositiveSummary, summaryDict.satisficationPositiveSummary]
        const propertiesNegativeSummary = [summaryDict.designNegativeSummary, summaryDict.weightNegativeSummary, summaryDict.performanceNegativeSummary, summaryDict.noiseNegativeSummary, summaryDict.sizeNegativeSummary, summaryDict.satisficationNegativeSummary]
        const clickPropertyButton = (e,index) => {
            e.preventDefault();
            console.log("선택된 버튼 인덱스" + index)
            setSelectedIndex(index)
        } 


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
                        {summaryDict.detailInfo.length!==0?
                        <div className="infos_div">
                            <div className="info1">
                                    {inforMoreBtn?summaryDict.detailInfo.map((value,idx)=>idx<summaryDict.detailInfo.length/2?<p key={idx}>{value}</p>:null)
                                    :summaryDict.detailInfo.map((value,idx)=>idx<summaryDict.detailInfo.length/2&&idx<5?<p key={idx}>{value}</p>:null)}
                                </div>
                                <div className="info2">
                                    {inforMoreBtn?summaryDict.detailInfo.map((value,idx)=>idx>=summaryDict.detailInfo.length/2?<p key={idx}>{value}</p>:null)
                                    :summaryDict.detailInfo.map((value,idx)=>idx>=summaryDict.detailInfo.length/2&&idx<(summaryDict.detailInfo.length/2)+5?<p key={idx}>{value}</p>:null)}
                                </div>
                            </div>
                            :<div className="not_infos">상세 정보가 존재하지 않습니다.</div>}
                            {summaryDict.detailInfo.length/2>5?<div className="plus_info">
                                <button onClick={informationMore}>{inforMoreBtn?"상세 정보 접기":"상세 정보 펼치기"} 
                                {inforMoreBtn?<IoIosArrowUp className="arrow_down" size={18} color={"#b1b1b1"} />:<IoIosArrowDown className="arrow_down" size={18} color={"#b1b1b1"} />}
                                </button>
                            </div>:null}
                        </div>
                        {summaryDict.imageURL?<img className="product_img" alt="mosue" src={summaryDict.imageURL} />:null}   
                    </div>
                </div>:null}
                {summaryDict.designPositiveSummary||summaryDict.designNegativeSummary||
                summaryDict.weightPositiveSummary||summaryDict.weightNegativeSummary||
                summaryDict.performancePositiveSummary||summaryDict.performanceNegativeSummary||
                summaryDict.noisePositiveSummary||summaryDict.noiseNegativeSummary||
                summaryDict.sizePositiveSummary||summaryDict.sizeNegativeSummary||
                summaryDict.satisficationPositiveSummary||summaryDict.satisficationNegativeSummary?
                summaryDict.fullPositiveSummary.length!==0&&summaryDict.fullNegativeSummary.length!==0?
                <div className="total_review_summarization">
                    <h2 className="summary_h2">2. 전체 리뷰 요약</h2>
                    <div className="summary_division_line"></div>
                    <p className="review_source">※ 해당 상품 리뷰의 출처는 네이버 쇼핑입니다.</p>
                    <p className="review_source">※ 중립 리뷰를 제외한 지표입니다.</p>
                    <div className="total_chart">
                        <FullChart fullData={fullData}/>
                    </div>
                    {(summaryDict.fullPositiveSummary.length!==0 || summaryDict.fullNegativeSummary.length!==0)?
                    <PropertyReview name={"전체"} positiveSummary={summaryDict.fullPositiveSummary} negativeSummary={summaryDict.fullNegativeSummary}/>
                    :null}
                    
                </div>:null:null}
                {summaryDict.designPositiveSummary||summaryDict.designNegativeSummary||
                summaryDict.weightPositiveSummary||summaryDict.weightNegativeSummary||
                summaryDict.performancePositiveSummary||summaryDict.performanceNegativeSummary||
                summaryDict.noisePositiveSummary||summaryDict.noiseNegativeSummary||
                summaryDict.sizePositiveSummary||summaryDict.sizeNegativeSummary||
                summaryDict.satisficationPositiveSummary||summaryDict.satisficationNegativeSummary?
                <div className="review_property_summarization">
                    <h2 className="summary_h2">3. 속성별 리뷰 요약</h2>
                    <div className="summary_division_line"></div>
                    <p className="review_source">※ 해당 상품 리뷰의 출처는 네이버 쇼핑입니다.</p>
                    <p className="review_source">※ 중립 리뷰를 제외한 지표입니다.</p>
                    <div className="property_bar">
                        <PropertyChart propertyData={propertyData} />
                    </div>

                    <div className="property_button">
                        {
                            propertyArray.map(
                                (buttonName,idx)=>idx!==propertyArray.length-1?
                                <button key={idx} onClick={(e) => clickPropertyButton(e,idx)} 
                                    style={{backgroundColor: selectedIndex === idx ? '#252B48' : '#f5f5f5',
                                    color: selectedIndex === idx ? '#ffffff' : '#000000'}}
                                >{buttonName}</button>
                                :null
                            )
                        }
                    </div>

                    <div className="selected_property">
                        <PropertyReview name={propertyArray[selectedIndex]} positiveSummary={propertiesPositiveSummary[selectedIndex]} negativeSummary={propertiesNegativeSummary[selectedIndex]} />
                    </div>

                </div>:summaryDict.productName===infoNonDefine?null:<><div className="summary_division_line"></div>
                <div className="undefined_summary">
                    <p>해당 상품은 리뷰 요약을 제공하지 않습니다.</p><FaRegSadTear className="undefind_sad" size={30}/>
                    </div></>}
                
            </div>      
        </>
        );
    }
    else
        return <div className="spinner"><DotSpinner color="#A1A1A1" size={50}/></div>
    
});


export default SummaryBook;