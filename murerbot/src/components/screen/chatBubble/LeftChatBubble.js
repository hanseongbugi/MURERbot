import React from "react";
import bot from "../../../img/botIcon.png"
import "../../../css/screen/chatBubble/leftChatBubble.css"
import { DotPulse } from '@uiball/loaders'
import { BsStarFill } from "react-icons/bs";


const LeftChatBubble = ({selectProductName, message, state}) => {

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
    

    return (
        <>
        <div className="chat_row">
            <div className="left_chat_bubble">
                <div className="bot_icon">
                    <img className="bot_image" alt="bot" src={bot}/>
                </div>
                <div className="left_chat_box">
                <BsStarFill stroke="gray" color="#FFDD00" strokeWidth="1.2px" size={20} style={{display:"flex",flexDirection:"row-reverse"}}/> 
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