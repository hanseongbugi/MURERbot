import React, { useState, useEffect } from "react";
import bot from "../../../img/botIcon.png"
import "../../../css/screen/chatBubble/leftChatBubble.css"
import { DotPulse } from '@uiball/loaders'
import _ from 'lodash';
import { BsStarFill } from "react-icons/bs";
import axios from 'axios' // npm install axios

const LeftChatBubble = ({idx, selectProductName, userMessage, itemArray, message, 
    autoScroll,setAutoScroll,scrollbarRef,state,firstMessage, category, userId, openModal}) => {
    const [clickStar,setClickStar]=useState(false)
    useEffect(()=>{
        if(autoScroll){
            scrollbarRef.current.scrollToBottom()
            setAutoScroll(false)
        }
    })
    useEffect(()=>{
        //console.log(state)
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
    //console.log(message)
    // 문자열 길이가 55이상이면 줄바꿈으로 만들기
    const checkStrLong = (str) => {
        let result = '';

        for (let i = 0; i < str.length; i++) {
            if (i > 0 && i % 55 === 0) {
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
                if(category===1){
                    return (<p>{message}<button onClick={openModal} style={{display:"block"}}>요약본 자세히 보기</button></p>)
                }
                return (message==="LOADING"?<DotPulse size={20} speed={1} color="black"/>:<p>{message}</p>)
            case "REQUIRE_PRODUCTNAME":
                return (<p>{message}</p>)
            case "REQUIRE_DETAIL":
                let product = message.split(",");
                product = product.filter((value)=>value!=="")
                //console.log(product)
                return (<p>{
                    product.map(
                        (value,idx)=>idx!==product.length-1?
                        <button className="detail_button"key={idx} onClick={selectProductName}>{value.length > 20 ? checkStrLong(value) : value}</button>
                        :value.trim()
                    )
                }
                </p>)
            case "REQUIRE_QUESTION":
                return (<p>{message}</p>)
            default:
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
            const res = await axios.post(
            `${userId}/manageBookmark`,
            inputData
          );
          console.log(res)
        } catch(e) {
            console.error(e)
        }
        
    }

    const clickBookMark=()=>{
        const {items,setItems}=itemArray
        const inputValue = {value: userMessage, message:message, category: category, idx:idx}
        if(clickStar){
            setItems(items.filter((value)=>!_.isEqual(value.idx,inputValue.idx)))
            
            // 북마크 삭제
            sendBookmark2Server(false, idx, userMessage)
        }
        else{

            let filterInputValue=Object.assign({},inputValue) //깊은 복사

            console.log(filterInputValue)
            setItems([...items,filterInputValue])

            // 북마크 추가
            sendBookmark2Server(true, idx, userMessage)
        }
    }

    const isLoading = (message) => {
        if(message === "LOADING") {
            return true;
        }
        return false;
    }
    

    return (
        <>
        <div className="chat_row">
            <div className="left_chat_bubble">
                <div className="bot_icon">
                    <img className="bot_image" alt="bot" src={bot}/>
                </div>
                <div className="left_chat_box">
                {!isLoading(message) && !firstMessage&&<BsStarFill size={20} onClick={clickBookMark} className={ clickStar?"fill_star":"stroke_star"}/> }
                    {
                        bubbleText(state,category)
                    }
                </div>
            </div>
        </div>
            
        </>
    )
}

export default LeftChatBubble;