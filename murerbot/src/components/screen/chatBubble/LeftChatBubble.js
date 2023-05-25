import React, { useState, useEffect } from "react";
import bot from "../../../img/botIcon.png"
import "../../../css/screen/chatBubble/leftChatBubble.css"
import { DotPulse } from '@uiball/loaders'
import _ from 'lodash';
import { BsStarFill } from "react-icons/bs";
import axios from 'axios' // npm install axios
import RecommandChatText from "./chatText/RecommandChatText";


const LeftChatBubble = ({idx, selectProductName, userMessage, itemArray, message, 
    autoScroll,setAutoScroll,scrollbarRef,state,firstMessage, category, userId, openModal,isShake, 
    shakeBubble,setShakeBubble, productName,clipProductName, bookmarkAlramEvent, imageUrls}) => {
    const [clickStar,setClickStar]=useState(false);
    const [showImage, setShowImage] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const handleMouseEnter = (e,idx) => {
        e.preventDefault()
        if (!showImage){
            setShowImage(true);
            setImageIndex(idx);
        }
    };

    const handleMouseLeave = (e) => {
        e.preventDefault()
        setShowImage(false);
    };

    useEffect(()=>{
        if(autoScroll){
            scrollbarRef.current.scrollToBottom()
            setAutoScroll(false)
        }
    })
    useEffect(()=>{
        if(state!=="NULL"){
            const {items}=itemArray;
            for(let i=0;i<items.length;i++){
                if(items[i].idx===idx){
                    setClickStar(true)
                    return;
                }
            }
            setClickStar(false)
        }
    },[itemArray,state,idx])
    // 문자열 길이가 55이상이면 줄바꿈으로 만들기
    const checkStrLong = (str, len) => {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            if (i > 0 && i % len === 0) {
                result += '\n';
            }
            result += str.charAt(i);
        }
        return result;
    }


    // 답변 유형에따라 다르게 메시지를 출력
    const bubbleText=(state,category)=>{
        switch(state){
            case "SUCCESS":
                if(category === 0&&productName&&productName.length!==0){
                    if(message.search(productName)!==-1){
                        const filterMessage = message.replace(productName,'');
                        return <p><b>{productName}</b>{filterMessage}</p>;
                    }else if(message.indexOf(productName)!==-1){
                        const filterMessage = message.replace(productName,'');
                        return <p><b>{productName}</b>{filterMessage}</p>;
                    }
                }
                if(category === 1){
                    return <p className="text_p" dangerouslySetInnerHTML={{__html:message}}></p>
                }
                if(category === 2){
                    return <RecommandChatText message={message} clipProductName={clipProductName}/>
                }
                return (message==="LOADING"?<DotPulse size={20} speed={1} color="black"/>:<p>{message}</p>)
            case "REQUIRE_PRODUCTNAME":
                return (<p>{message.length > 80 ? checkStrLong(message, 80): message}</p>)
            case "REQUIRE_DETAIL":
                let product = message.split(",");
                product = product.filter((value)=>value!=="")       
                
                // const chatdiv = document.querySelector('.left_chat_box');
                // console.log(chatdiv.style.width);

                return (<>
                <div className="items_message">
                    <div className="items_div">
                        <div className="detail_buttons">
                            {
                            product.map(
                                (value,idx)=>idx!==product.length-1?
                                <button className="detail_button" key={idx} onClick={selectProductName} 
                                    onMouseEnter={(e)=>handleMouseEnter(e,idx)} onMouseLeave={(e)=>handleMouseLeave(e)}
                                >{value.length > 55 ? checkStrLong(value, 55) : value}</button>
                                :null
                            )
                            }
                        </div>
                        <div className="item_image">
                            {showImage && imageUrls ? <img src={imageUrls[imageIndex]} alt="상품 이미지"/> : null}
                        </div>
                    </div>
                    <p>{product[product.length-1].trim()}</p>
                </div>
                
                </>)
            case "REQUIRE_QUESTION":
                return (<p>{message}</p>)
            default:
                if(category === 0&&productName&&productName.length!==0){
                    const filterMessage = message.replace(productName,'');
                    return <p><b>{productName}</b>{filterMessage}</p>;
                }
                if(category === 1){
                    return <p>{message}</p>
                }
                if(category === 2){
                    return <RecommandChatText message={message} clipProductName={clipProductName}/>
                }
                return (message==="LOADING"?<DotPulse size={20} speed={1} color="black"/>:<p>{message}</p>)

        }

    }

    async function sendBookmark2Server(isAdd, logId, bookmarkTitle) {
        // isAdd => 추가할 북마크인지 삭제할 북마크인지
        try{
            var inputData = {}
            if(isAdd){ // 북마크 추가
                inputData =  { state:"ADD_BM",
                "userId":userId,
                "logId":logId,
                "title":bookmarkTitle}
            }
            else{ // 북마크 삭제
                inputData =  {state:"DELETE_BM",
                "userId":userId,
                "logId":logId,
                "title":bookmarkTitle}
            }
            await axios.post(
            `${userId}/manageBookmark`,
            inputData
          );
        } catch(e) {
            console.error(e)
        }
        
    }

    const clickBookMark=()=>{
        const {items,setItems}=itemArray
        let bookmarkValue = userMessage
        if(productName){
            if(productName.length!==0&&userMessage!==productName){
                bookmarkValue = `${productName} : ${userMessage}`
            }
        }
        const inputValue = {value: bookmarkValue, message:message, category: category, idx:idx}
        if(clickStar){
            setItems(items.filter((value)=>!_.isEqual(value.idx,inputValue.idx)))
            
            // 북마크 삭제
            sendBookmark2Server(false, idx, userMessage)
        }
        else{

            let filterInputValue=Object.assign({},inputValue) //깊은 복사

            setItems([...items,filterInputValue])

            // 북마크 추가
            sendBookmark2Server(true, idx, userMessage)
            bookmarkAlramEvent(inputValue.category)
        }
    }

    const isLoading = (message) => {
        if(message === "LOADING"||message === "요청시간이 만료되었습니다.") {
            return true;
        }
        return false;
    }
    const shakeAnimation = ()=>{
        setShakeBubble(shakeBubble.filter(value=>value!==idx))
    }
    

    return (
        <>
        <div className={"chat_row"+idx}>
            <div className={isShake?"shake_left_chat_bubble":"left_chat_bubble"} onAnimationEnd={shakeAnimation}>
                <div className="bot_icon">
                    <img className="bot_image" alt="bot" src={bot}/>
                </div>
                <div className="left_chat_box">
                    <div className="p_and_star">
                        {
                            bubbleText(state,category)
                        }
                        {!isLoading(message) && !firstMessage&&<BsStarFill size={15} onClick={clickBookMark} className={ clickStar?"fill_star":"stroke_star"}/> }
                    </div>
                    <div className="summary_button_div">
                    {category === 1 ? <button className="show_summary_button" onClick={(e)=>{e.preventDefault();openModal(productName)}}>{`요약본 자세히 보기 >`}</button>:null}
                    </div>
                </div>
            </div>
        </div>
            
        </>
    )
}

export default LeftChatBubble;