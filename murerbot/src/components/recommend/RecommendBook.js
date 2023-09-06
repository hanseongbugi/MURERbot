import { DotSpinner } from '@uiball/loaders'
import React, {useEffect, useState} from "react";
import {FaUser} from "react-icons/fa";
import {BsChevronCompactRight, BsChevronCompactLeft} from "react-icons/bs";
import {IoIosArrowDown,IoIosArrowUp} from "react-icons/io"
import "../../css/recommend/recommendBook.css";
import rank1 from "../../img/ranking1.png"
import rank2 from "../../img/ranking2.png"
import rank3 from "../../img/ranking3.png"
import rank4 from "../../img/ranking4.png"
import rank5 from "../../img/ranking5.png"
import rank6 from "../../img/ranking6.png"



const RecommendationBook = ({recommendationDict}) => {
    const [inforMoreBtn,setInforMoreBtn]=useState(false);
    const [selectedButton,setSelectedButton]=useState(0);
    const [productRangeIndex,setProductRangeIndex] = useState(0);
    const [productInfo, setProductInfo] = useState(null);
    const [productIndex,setProductIndex] = useState(0);
    const [infoDetail, setInfoDetail] = useState(null);
    const [reviews,setReviews] = useState(null)
    const [totalButtons, setTotalButtons] = useState(0);
    const buttonsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const rankingImage = [
                <img className='ranking_badge' alt="rank1" src={rank1}/>,
                <img className='ranking_badge' alt="rank2" src={rank2}/>,
                <img className='ranking_badge' alt="rank3" src={rank3}/>,
                <img className='ranking_badge' alt="rank4" src={rank4}/>,
                <img className='ranking_badge' alt="rank5" src={rank5}/>,
                <img className='ranking_badge' alt="rank6" src={rank6}/>
            ]
    useEffect(()=>{
        let tempDict = []
        recommendationDict.data[5].map((value,idx)=>
            tempDict.push({'productName': value, 'imgUrl':recommendationDict.imgUrl[idx], 
            'recommendDetailInfo':recommendationDict.data[0],'recommendDetail':recommendationDict.data[1][idx]})
        )  
        setProductInfo([...tempDict]);
        setInfoDetail(recommendationDict.data[4]);
        setReviews(recommendationDict.data[3])
        //setTotalButtons(recommendationDict.data[3].length)
    },[recommendationDict])
    //console.log(recommendationDict)
    useEffect(()=>{
        console.log(reviews)
        if(reviews){
            setTotalButtons(reviews[productIndex].length/5);
        }
    },[reviews,productIndex])
   //console.log(totalButtons)

    const productRightMoreClicked=(e)=>{
        e.preventDefault();
        let tempProductRangeIndex = productRangeIndex + 3;
        if(tempProductRangeIndex>=productInfo.length){
            tempProductRangeIndex -= 3;
        }
        setProductRangeIndex(tempProductRangeIndex);
    }
    const productLefttMoreClicked=(e)=>{
        e.preventDefault();
        let tempProductRangeIndex = productRangeIndex - 3;
        if(tempProductRangeIndex<0){
            tempProductRangeIndex += 3;
        }
        setProductRangeIndex(tempProductRangeIndex);
    }


    const informationMore = (e)=>{
        e.preventDefault();
        // if(scrollbarRef) scrollbarRef.current.scrollTop();
        inforMoreBtn?setInforMoreBtn(false):setInforMoreBtn(true);
    }
    
    const reviewButtonClick=(e, clickNum)=>{
        e.preventDefault();
        setSelectedButton(clickNum-1);

    }
    const selectedDetail=(e,idx)=>{
        e.preventDefault();
        //console.log(idx);
        setProductIndex(idx);
        setSelectedButton(0);
    }
    const getButtonsForCurrentPage = () => {
        const startIndex = (currentPage - 1) * buttonsPerPage;
        //const endIndex = startIndex + buttonsPerPage;
        return Array.from({ length: buttonsPerPage }, (_, index) => (
            startIndex+index<totalButtons?<div key={startIndex+index} 
            className={`${selectedButton===startIndex+index?'selected_review_page_button':'review_page_button'} ${index===0?'start_review_button':''}`}
            onClick={(e)=>reviewButtonClick(e,startIndex+index+1)}>{startIndex+index+1}</div>:null
          ));
       
      };
    
    if(recommendationDict&&infoDetail&&productInfo&&reviews){

        return (
        <>
            <div className="recommendBook_div">
                <h1>{`"${recommendationDict.userMessage}" 의 추천 결과 자세히 보기`}</h1>

                <div className="recommend_ranking">
                    <div className='buttons_box'>
                        <div className='more_product_button'>
                            {productRangeIndex>0?
                            <BsChevronCompactLeft className="bsChevronCompact" size={30} onClick={(e)=>productLefttMoreClicked(e)}/>
                            :<BsChevronCompactLeft style={{visibility:'hidden'}} size={30}/>}
                        </div>
                        
                    <div className='buttons'>
                        {
                            productInfo.map((value,idx)=>
                            (idx>=productRangeIndex&&idx<productRangeIndex+3)?        
                            <div key={idx} className={idx===productIndex?'product_selected_button':'product_button'} onClick={(e)=>selectedDetail(e,idx)}>
                                {rankingImage[idx]}
                                <img className="ranking_product_img" alt="mosue" src={value.imgUrl}/>
                                <div className='image_division_line'/>
                                <p>{value.productName}</p>
                                {
                                    value.recommendDetailInfo.map((detail,idx)=>
                                    value.recommendDetail[idx].length===0?null:<p key={idx}>{`${detail} : ${value.recommendDetail[idx]}`}</p>
                                    )
                                }
                        </div>:null)
                        }
                    </div>
                    
                    <div className='more_product_button'>
                        {productRangeIndex<productInfo.length-3&&productInfo.length>3?
                            <BsChevronCompactRight className="bsChevronCompact" size={30} onClick={(e)=>productRightMoreClicked(e)}/>
                            :<BsChevronCompactRight style={{visibility:'hidden'}} size={30}/>}
                        </div> 
                    </div>
                </div>


                {/* recommended product */}
                <div className="recommended_product">
                    <div className='product_title'>
                        <div className="product_division_line"/>
                        <h2>{productInfo[productIndex].productName}</h2>
                        <div className="product_division_line"/>
                    </div>
                    
                    <div className='product_info'>
                        <div className='product_info_title'>
                            <h3>1. 제품 상세정보</h3>
                        </div>
                        
                        <div className="info_div">
                            <div className="info_box">
                                {infoDetail[productIndex].length!==0?
                                    <div className="infos_div">
                                        <div className="info1">
                                                {inforMoreBtn?infoDetail[productIndex].map((value,idx)=>idx<infoDetail[productIndex].length/2?<p key={idx}>{value}</p>:null)
                                                :infoDetail[productIndex].map((value,idx)=>idx<infoDetail[productIndex].length/2&&idx<5?<p key={idx}>{value}</p>:null)}
                                            </div>
                                            <div className="info2">
                                                {inforMoreBtn?infoDetail[productIndex].map((value,idx)=>idx>=infoDetail[productIndex].length/2?<p key={idx}>{value}</p>:null)
                                                :infoDetail[productIndex].map((value,idx)=>idx>=infoDetail[productIndex].length/2&&idx<(infoDetail[productIndex].length/2)+5?<p key={idx}>{value}</p>:null)}
                                            </div>
                                        </div>
                                        :<div className="not_infos">상세 정보가 존재하지 않습니다.</div>}
                                        {infoDetail[productIndex].length/2>5?<div className="plus_info">
                                            <button onClick={(e)=>informationMore(e)}>{inforMoreBtn?"상세 정보 접기":"상세 정보 펼치기"} 
                                            {inforMoreBtn?<IoIosArrowUp className="arrow_down" color={"#b1b1b1"} />:<IoIosArrowDown className="arrow_down" color={"#b1b1b1"} />}
                                            </button>
                                    </div>
                                :null}
                            </div>
                            <img className="product_img" alt="mosue" src={productInfo[productIndex].imgUrl} />
                        </div>
                    </div>
                    
                    <div className='product_review'>
                        <div className="product_review_title">
                            <h3>2. 요청한 추천과 유사한 리뷰</h3>
                        </div>
                        
                    
                        <div className='product_reviews'>
                            {
                                reviews[productIndex].map((value,idx)=>
                                    (idx>=selectedButton*5&&idx<selectedButton*5+5)?
                                    <div key={idx} className="user_review">
                                <div className='user_div'>
                                    <FaUser className="faUser" size={20} color={"#ffffff"}/>
                                </div>

                                <div className="sentiment_box"><p>{value}</p></div>
                            </div>:null
                                    
                            
                                )
                            }
                            
                        </div>

                        <div className='review_page_div'>
                            <button className={currentPage === 1?'unvisible_review_page_next':'visible_review_page_next'}
                            onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}>이전 페이지</button>{
                                getButtonsForCurrentPage()
                            }
                        <button className={currentPage === Math.ceil(totalButtons / buttonsPerPage)?'unvisible_review_page_next':'visible_review_page_next'}
                        onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(totalButtons / buttonsPerPage)))}>
                            다음 페이지</button>
                        </div>
                    </div>
                    


                </div>
            </div>       
        </>
        );
    }
    else
        return <div className="spinner"><DotSpinner color="#A1A1A1" size={50}/></div>
    
};


export default RecommendationBook;