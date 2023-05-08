import React from "react";
import "../../../css/screen/chatBubble/rightChatBubble.css"


const RightChatBubble = ({message}) => {

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


    return (
        <>
        <div className="chat_row">
            <div className="right_chat_bubble">
                <div className="right_chat_box">
                    <p>{message.length > 30 ? checkStrLong(message) : message}</p>
                </div>
            </div>
        </div>
            
        </>
    )
}

export default RightChatBubble;