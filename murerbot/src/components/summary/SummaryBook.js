import "../../css/summary/summaryBook.css";
import BarChart from "./BarChart";
import { DotSpinner } from '@uiball/loaders'
import {MdOutlineDisabledByDefault} from "react-icons/md";
import {IoIosArrowDown,IoIosArrowUp} from "react-icons/io"
import React,{ useState } from "react";
import {FaUser, FaRegSadTear} from "react-icons/fa";
import ApexCharts from 'react-apexcharts';

const infoNonDefine = "요약본이 존재하지 않습니다."
const SummaryBook = React.forwardRef(({summaryDict},scrollbarRef) => {
    const [inforMoreBtn,setInforMoreBtn]=useState(false);
    if(summaryDict){
        const positive = parseFloat(summaryDict.fullPositivePercent);
        const negative = parseFloat(summaryDict.fullNegativePercent)
        const total = positive + negative;
        const data = [
            { name: '긍정',data: [parseFloat(positive/total*100).toFixed(2)]},
            { name: '부정', data: [parseFloat(negative/total*100).toFixed(2)]}
        ]

        const barData = [
            { name: '긍정', data: [parseFloat(summaryDict.designPositivePercent),parseFloat(summaryDict.weightPositivePercent), parseFloat(summaryDict.performancePositivePercent),parseFloat(summaryDict.noisePositivePercent), parseFloat(summaryDict.sizePositivePercent),parseFloat(summaryDict.satisficationPositivePercent)]}, 
            { name: '부정', data: [parseFloat(summaryDict.designNegativePercent),parseFloat(summaryDict.weightNegativePercent), parseFloat(summaryDict.performanceNegativePercent),parseFloat(summaryDict.noiseNegativePercent),  parseFloat(summaryDict.sizeNegativePercent),parseFloat(summaryDict.satisficationNegativePercent)]}
        ]
        const informationMore = (e)=>{
            e.preventDefault();
            if(scrollbarRef) scrollbarRef.current.scrollTop();
            inforMoreBtn?setInforMoreBtn(false):setInforMoreBtn(true);
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
                {summaryDict.fullPositiveSummary?
                <div className="total_review_summarization">
                    <h2 className="summary_h2">2. 전체 리뷰 요약</h2>
                    <div className="summary_division_line"></div>
                    <p className="review_source">※ 해당 상품 리뷰의 출처는 네이버 쇼핑입니다.</p>
                    <p className="review_source">※ 중립 리뷰를 제외한 지표입니다.</p>
                    <div className="total_chart">
                        <ApexCharts
                            height={130}
                            width={"97%"}
                            type="bar"
                            series={data}
                            options={{
                                colors:['#6BA694', '#E3465F'],
                                chart:{
                                    stacked: true,
                                    stackType: '100%',
                                    toolbar: {
                                        show:false,
                                    },
                                    background: "transparent",
                                zoom: {
                                    enabled: false
                                    }
                                },
                                states: {
                                    hover: {
                                        filter: {
                                            type: 'none'
                                        }
                                    },
                                    active: {
                                        allowMultipleDataPointsSelection: false,
                                        filter: {
                                            type: 'none'
                                        }
                                    }
                                },
                                tooltip: {
                                    enabled: false,  
                                },
                                plotOptions:{
                                    bar: {
                                        horizontal: true,
                                    },
                                },
                                stroke:{
                                    width: 1,
                                    colors: ['#fff']
                                },
                                grid: {
                                    row: {
                                        colors: ['#f7f7f7', 'transparent'], // takes an array which will be repeated on columns
                                        opacity: 1
                                    },
                                },
                                yaxis:{
                                    show: false,
                                    axisTicks: {
                                        show: false
                                    }
                                },
                                xaxis:{
                                    show:false,
                                    labels: {
                                        show: false,
                                    },
                                    axisTicks: {
                                        show: true
                                    }
                                },
                                
                                fill:{
                                    opacity: 1
                                },
                                legend:{
                                    position: 'bottom',
                                    fontSize: '12px',
                                    horizontalAlign: 'right',
                                    onItemClick: {
                                        toggleDataSeries: false
                                    },
                                    onItemHover: {
                                        highlightDataSeries: false
                                    },
                                }         
                            }}
                        />
                    </div>
                    {summaryDict.fullPositiveSummary.length!==0?
                    <div className="review_positive_summary">
                        <p><strong>{`긍정`}</strong></p> 
                        {summaryDict.fullPositiveSummary[0]?
                        <div className="user_review">
                            <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                            <div className="sentiment_box1"><p dangerouslySetInnerHTML={{__html:summaryDict.fullPositiveSummary[0]}}/></div>   
                        </div>:null}
                        {summaryDict.fullPositiveSummary[1]?
                        <div className="user_review">
                            <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                            <div className="sentiment_box1"><p dangerouslySetInnerHTML={{__html:summaryDict.fullPositiveSummary[1]}}/></div>   
                        </div>:null}
                    </div>:null}
                    {summaryDict.fullNegativeSummary.length!==0?
                    <div className="review_negative_summary">
                        <p><strong>{`부정`}</strong></p>
                        {summaryDict.fullNegativeSummary[0]?
                        <div className="user_review">
                            <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                            <div className="sentiment_box1"><p dangerouslySetInnerHTML={{__html:summaryDict.fullNegativeSummary[0]}}/></div>
                        </div>:null}
                        {summaryDict.fullNegativeSummary[1]?
                        <div className="user_review">
                            <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                            <div className="sentiment_box1"><p dangerouslySetInnerHTML={{__html:summaryDict.fullNegativeSummary[1]}}/></div>
                        </div>:null}
                    </div>:null}
                    
                </div>:null}
                {summaryDict.designPositivePercent?
                <div className="review_property_summarization">
                    <h2 className="summary_h2">3. 속성별 리뷰 요약</h2>
                    <div className="summary_division_line"></div>
                    <p className="review_source">※ 해당 상품 리뷰의 출처는 네이버 쇼핑입니다.</p>
                    <p className="review_source">※ 중립 리뷰를 제외한 지표입니다.</p>
                    <div className="property_bar">
                        <BarChart barData={barData} />
                    </div>
                    <div className="property_list">
                        <ul>
                            {summaryDict.designPositiveSummary||summaryDict.designNegativeSummary?<li>
                                <div className="property_name">
                                    <h3>디자인</h3>
                                    <div className="property_division_line"></div>
                                </div>
                                {summaryDict.designPositiveSummary[0]?
                                <><p className="positive_p"><strong>{`긍정`}</strong></p>
                                <div className="user_review">
                                    <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.designPositiveSummary[0]}}/></div>
                                </div>
                                </>:null}
                                {summaryDict.designPositiveSummary[1]?
                                <>
                                <div className="user_review">
                                    <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.designPositiveSummary[1]}}/></div>
                                </div>
                                </>:null}

                                {summaryDict.designNegativeSummary[0]?
                                <><p className="negative_p"><strong>{`부정`}</strong></p>
                                <div className="user_review">
                                    <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.designNegativeSummary[0]}}/></div>
                                </div>
                                </>:null}
                                {summaryDict.designNegativeSummary[1]?
                                <>
                                <div className="user_review">
                                    <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.designNegativeSummary[1]}}/></div>
                                </div>
                                </>:null}
                            </li>:null}
                            {summaryDict.weightPositiveSummary||summaryDict.weightNegativeSummary?<li>
                                <div className="property_name">
                                    <h3>무게</h3>
                                    <div className="property_division_line"></div>
                                </div>
                                {summaryDict.weightPositiveSummary[0]?
                                <><p className="positive_p"><strong>{`긍정`}</strong></p>
                                <div className="user_review">
                                    <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.weightPositiveSummary[0]}}/></div>
                                </div>    
                                </>:null}
                                {summaryDict.weightPositiveSummary[1]?
                                <>
                                <div className="user_review">
                                    <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.weightPositiveSummary[1]}}/></div>
                                </div>    
                                </>:null}
                                {summaryDict.weightNegativeSummary[0]?
                                <><p className="negative_p"><strong>{`부정`}</strong></p>
                                <div className="user_review">
                                    <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.weightNegativeSummary[0]}}/></div>
                                </div>    
                                </>:null}
                                {summaryDict.weightNegativeSummary[1]?
                                <>
                                <div className="user_review">
                                    <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.weightNegativeSummary[1]}}/></div>
                                </div>    
                                </>:null}
                            </li>:null}
                            {summaryDict.performancePositiveSummary||summaryDict.performanceNegativeSummary?<li>
                                <div className="property_name">
                                    <h3>성능</h3>
                                    <div className="property_division_line"></div>
                                </div>
                                {summaryDict.performancePositiveSummary[0]?
                                <>
                                <p className="positive_p"><strong>{`긍정`}</strong></p>
                                    <div className="user_review">
                                    <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.performancePositiveSummary[0]}}/></div>
                                </div>
                                </>:null}
                                {summaryDict.performancePositiveSummary[1]?
                                <>
                                    <div className="user_review">
                                    <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.performancePositiveSummary[1]}}/></div>
                                </div>
                                </>:null}

                                {summaryDict.performanceNegativeSummary[0]?
                                <><p className="negative_p"><strong>{`부정`}</strong></p>
                                <div className="user_review">
                                    <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.performanceNegativeSummary[0]}}/></div>
                                </div>    
                                </>:null}
                                {summaryDict.performanceNegativeSummary[1]?
                                <>
                                <div className="user_review">
                                    <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.performanceNegativeSummary[1]}}/></div>
                                </div>    
                                </>:null}
                            </li>:null}
                            {summaryDict.noisePositiveSummary||summaryDict.noiseNegativeSummary?<li>
                                <div className="property_name">
                                    <h3>소음</h3>
                                    <div className="property_division_line"></div>
                                </div>
                                {summaryDict.noisePositiveSummary[0]?
                                <>
                                <p className="positive_p"><strong>{`긍정`}</strong></p>
                                <div className="user_review">
                                    <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.noisePositiveSummary[0]}}/></div>
                                </div>
                                </>:null}
                                {summaryDict.noisePositiveSummary[1]?
                                <>
                                <div className="user_review">
                                    <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.noisePositiveSummary[1]}}/></div>
                                </div>
                                </>:null}

                                {summaryDict.noiseNegativeSummary[0]?
                                <><p className="negative_p"><strong>{`부정`}</strong></p>
                                <div className="user_review">
                                    <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.noiseNegativeSummary[0]}}/></div>
                                </div>    
                                </>:null}
                                {summaryDict.noiseNegativeSummary[1]?
                                <>
                                <div className="user_review">
                                    <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.noiseNegativeSummary[1]}}/></div>
                                </div>    
                                </>:null}
                            </li>:null}
                            {summaryDict.sizePositiveSummary||summaryDict.sizeNegativeSummary?<li>
                                <div className="property_name">
                                    <h3>크기</h3>
                                    <div className="property_division_line"></div>
                                </div>
                                {summaryDict.sizePositiveSummary[0]?
                                <><p className="positive_p"><strong>{`긍정`}</strong></p>
                                <div className="user_review">
                                    <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.sizePositiveSummary[0]}}/></div>
                                </div>    
                                </>:null}
                                
                                {summaryDict.sizePositiveSummary[1]?
                                <>
                                    <div className="user_review">
                                        <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                        <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.sizePositiveSummary[1]}}/></div>
                                    </div>    
                                </>:null}
                                
                                {summaryDict.sizeNegativeSummary[0]?
                                <>
                                <p className="negative_p"><strong>{`부정`}</strong></p>
                                <div className="user_review">
                                    <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.sizeNegativeSummary[0]}}/></div>
                                </div>    
                                </>:null}
                                {summaryDict.sizeNegativeSummary[1]?
                                <>
                                    <div className="user_review">
                                        <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                        <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.sizeNegativeSummary[1]}}/></div>
                                    </div>    
                                </>:null}
                                
                            </li>:null}
                            {summaryDict.satisficationPositiveSummary||summaryDict.satisficationNegativeSummary?<li>
                                <div className="property_name">
                                    <h3>만족도</h3>
                                    <div className="property_division_line"></div>
                                </div>
                                {summaryDict.satisficationPositiveSummary[0]?
                                <><p className="positive_p"><strong>{`긍정`}</strong></p>
                                <div className="user_review">
                                    <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.satisficationPositiveSummary[0]}}/></div>
                                </div>
                                </>:null}
                                {summaryDict.satisficationPositiveSummary[1]?
                                <>
                                <div className="user_review">
                                    <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.satisficationPositiveSummary[1]}}/></div>
                                </div>
                                </>:null}
                    
                                {summaryDict.satisficationNegativeSummary[0]?
                                <><p className="negative_p"><strong>{`부정`}</strong></p>
                                <div className="user_review">
                                    <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.satisficationNegativeSummary[0]}}/></div>
                                </div>
                                </>:null}
                                {summaryDict.satisficationNegativeSummary[1]?
                                <>
                                <div className="user_review">
                                    <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                                    <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:summaryDict.satisficationNegativeSummary[1]}}/></div>
                                </div>
                                </>:null}
                            </li>:null}
                        </ul>
                    </div>
                </div>:<><div className="summary_division_line"></div>
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