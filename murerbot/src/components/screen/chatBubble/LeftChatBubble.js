import React, { useState } from "react";
import bot from "../../../img/botIcon.png"
import "../../../css/screen/chatBubble/leftChatBubble.css"
import { DotPulse } from '@uiball/loaders'
import _ from 'lodash';
import { BsStarFill } from "react-icons/bs";


const LeftChatBubble = ({idx, selectProductName, userMessage, itemArray, message, state,firstMessage, category}) => {
    const [clickStar,setClickStar]=useState(false)
    //console.log(itemArray)

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
    const bubbleText=(state)=>{
        switch(state){
            case "SUCCESS": 
                return (<p>{message}</p>)
            case "REQUIRE_PRODUCTNAME":
                return (<p>{message}</p>)
            case "REQUIRE_DETAIL":
                let product = message.split(",");
                product = product.filter((value)=>value!=="")
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
    const clickBookMark=()=>{
        const {items,setItems}=itemArray
        const inputValue = {value: userMessage, message:message, category: category, idx:idx}
        if(clickStar){
            setItems(items.filter((value)=>!_.isEqual(value,inputValue)))
            setClickStar(false)
        }
        else{
            //console.log(items.length)
            let notStore=false
            console.log(items)
            items.forEach(element => {
                if(element.message===inputValue.message){
                    alert("이미 북마크에 존재하는 질문입니다.")
                    notStore=true
                    return;
                }
            });
            if(notStore)return;
            setItems([...items,inputValue].sort((a, b) => a.idx - b.idx))
            setClickStar(true)
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
                        bubbleText(state)
                    }
                </div>
            </div>
        </div>
            
        </>
    )
}

export default LeftChatBubble;