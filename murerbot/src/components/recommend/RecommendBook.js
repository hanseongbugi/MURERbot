import { DotSpinner } from '@uiball/loaders'
import React, {useEffect, useState} from "react";
import {FaUser} from "react-icons/fa";
import {BsChevronCompactRight, BsChevronCompactLeft} from "react-icons/bs";
import {IoIosArrowDown,IoIosArrowUp} from "react-icons/io"
import "../../css/recommend/recommendBook.css";
import img from "../../img/mouse.png"
import rank1 from "../../img/ranking1.png"
import rank2 from "../../img/ranking2.png"
import rank3 from "../../img/ranking3.png"
import rank4 from "../../img/ranking4.png"
import rank5 from "../../img/ranking5.png"
import rank6 from "../../img/ranking6.png"



const RecommendationBook = React.forwardRef(({recommendationDict},scrollbarRef) => {
    const [inforMoreBtn,setInforMoreBtn]=useState(false);
    const [buttonIndex, setButtonIndex] = useState([]);
    const [selectedButton,setSelectedButton]=useState(0);
    const [productIndex,setProductIndex] = useState(0);

    const infoDetail = ["연결 방식: 무선", "감응방식: 광", "전송방식: RF 2.4GHz, 블루투스4.0", "휠 조정: 상하", "버튼수: 3버튼", "최대 감도: 1000dpi",
                        "형태: 슬림형", "배터리: AA건전지x1", "수신기: 수납가능", "크기: 5.9x10.7x2.7cm", "형태: 슬림형", "배터리: AA건전지x1", "수신기: 수납가능", "크기: 5.9x10.7x2.7cm"]
    const reviews = ["리뷰입니다1","리뷰입니다2","리뷰입니다3","리뷰입니다4","리뷰입니다5","리뷰입니다6",
    "리뷰입니다7","리뷰입니다8","리뷰입니다9","리뷰입니다10","리뷰입니다11"] // 5개 1 (0),2(1), 3, 5  

    const product = [
        <div className='product_button'>
                            <img className='ranking_badge' alt="rank1" src={rank1}/>
                            <img className="ranking_product_img" alt="mosue" src={img}/>
                            <div className='image_division_line'/>
                            <p>로지텍 페블M305 마우스1</p>
                            <p>무게: 30g</p>
                        </div>,
                        <div className='product_button'>
                        <img className='ranking_badge' alt="rank1" src={rank2}/>
                        <img className="ranking_product_img" alt="mosue" src={img}/>
                        <div className='image_division_line'/>
                        <p>로지텍 페블M305 마우스2</p>
                        <p>무게: 30g</p>
                    </div>,
                    <div className='product_button'>
                    <img className='ranking_badge' alt="rank1" src={rank3}/>
                    <img className="ranking_product_img" alt="mosue" src={img}/>
                    <div className='image_division_line'/>
                    <p>로지텍 페블M305 마우스3</p>
                    <p>무게: 30g</p>
                </div>,
                <div className='product_button'>
                <img className='ranking_badge' alt="rank1" src={rank4}/>
                <img className="ranking_product_img" alt="mosue" src={img}/>
                <div className='image_division_line'/>
                <p>로지텍 페블M305 마우스4</p>
                <p>무게: 30g</p>
            </div>,
            <div className='product_button'>
            <img className='ranking_badge' alt="rank1" src={rank5}/>
            <img className="ranking_product_img" alt="mosue" src={img}/>
            <div className='image_division_line'/>
            <p>로지텍 페블M305 마우스5</p>
            <p>무게: 30g</p>
        </div>,
        <div className='product_button'>
        <img className='ranking_badge' alt="rank1" src={rank6}/>
        <img className="ranking_product_img" alt="mosue" src={img}/>
        <div className='image_division_line'/>
        <p>로지텍 페블M305 마우스6</p>
        <p>무게: 30g</p>
    </div>
    ]
    
   
    useEffect(()=>{
        let buttonNum=[];
        for(let i=0;i<reviews.length/5;i++){
            buttonNum.push(i+1);
        }
        setButtonIndex(buttonNum);
    },[])

    const productRightMoreClicked=(e)=>{
        e.preventDefault();
        let tempProductIndex = productIndex + 3;
        if(tempProductIndex>=product.length){
            tempProductIndex -= 3;
        }
        setProductIndex(tempProductIndex);
    }
    const productLefttMoreClicked=(e)=>{
        e.preventDefault();
        let tempProductIndex = productIndex - 3;
        if(tempProductIndex<0){
            tempProductIndex += 3;
        }
        setProductIndex(tempProductIndex);
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
    
    if(recommendationDict){

        return (
        <>
            <div className="recommendBook_div">
                <h1>"가벼운 마우스 추천해줘"의 추천 결과</h1>

                <div className="recommend_ranking">
                    <div className='buttons_box'>
                        <div className='more_product_button'>
                            {productIndex>0?
                            <BsChevronCompactLeft className="bsChevronCompact" size={30} onClick={(e)=>productLefttMoreClicked(e)}/>
                            :<BsChevronCompactLeft style={{visibility:'hidden'}} size={30}/>}
                        </div>
                        
                    <div className='buttons'>
                        {
                            product.map((value,idx)=>
                            (idx>=productIndex&&idx<productIndex+3)?value:null)
                        }
                    </div>
                    
                    <div className='more_product_button'>
                        {productIndex<product.length-3&&product.length>3?
                            <BsChevronCompactRight className="bsChevronCompact" size={30} onClick={(e)=>productRightMoreClicked(e)}/>
                            :<BsChevronCompactRight style={{visibility:'hidden'}} size={30}/>}
                        </div> 
                    </div>
                </div>


                {/* recommended product */}
                <div className="recommended_product">
                    <div className='product_title'>
                        <div className="product_division_line"/>
                        <h2>로지텍 페블M305 마우스</h2>
                        <div className="product_division_line"/>
                    </div>
                    
                    <div className='product_info'>
                        <div className='product_info_title'>
                            <h3>1. 제품 상세정보</h3>
                        </div>
                        
                        <div className="info_div">
                            <div className="info_box">
                                {infoDetail.length!==0?
                                    <div className="infos_div">
                                        <div className="info1">
                                                {inforMoreBtn?infoDetail.map((value,idx)=>idx<infoDetail.length/2?<p key={idx}>{value}</p>:null)
                                                :infoDetail.map((value,idx)=>idx<infoDetail.length/2&&idx<5?<p key={idx}>{value}</p>:null)}
                                            </div>
                                            <div className="info2">
                                                {inforMoreBtn?infoDetail.map((value,idx)=>idx>=infoDetail.length/2?<p key={idx}>{value}</p>:null)
                                                :infoDetail.map((value,idx)=>idx>=infoDetail.length/2&&idx<(infoDetail.length/2)+5?<p key={idx}>{value}</p>:null)}
                                            </div>
                                        </div>
                                        :<div className="not_infos">상세 정보가 존재하지 않습니다.</div>}
                                        {infoDetail.length/2>5?<div className="plus_info">
                                            <button onClick={(e)=>informationMore(e)}>{inforMoreBtn?"상세 정보 접기":"상세 정보 펼치기"} 
                                            {inforMoreBtn?<IoIosArrowUp className="arrow_down" color={"#b1b1b1"} />:<IoIosArrowDown className="arrow_down" color={"#b1b1b1"} />}
                                            </button>
                                    </div>
                                :null}
                            </div>
                            <img className="product_img" alt="mosue" src={img} />
                        </div>
                    </div>
                    
                    <div className='product_review'>
                        <div className="product_review_title">
                            <h3>2. 요청된 추천 내용과 유사한 리뷰</h3>
                        </div>
                        
                    
                        <div className='product_reviews'>
                            {
                                reviews.map((value,idx)=>
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
                            {
                                buttonIndex.map((value,idx)=>
                                    <div key={idx} className={selectedButton===idx?'selected_review_page_button':'review_page_button'} onClick={(e)=>reviewButtonClick(e,value)}>{value}</div>)
                            }
                        </div>
                    </div>
                    


                </div>
            </div>       
        </>
        );
    }
    else
        return <div className="spinner"><DotSpinner color="#A1A1A1" size={50}/></div>
    
});


export default RecommendationBook;