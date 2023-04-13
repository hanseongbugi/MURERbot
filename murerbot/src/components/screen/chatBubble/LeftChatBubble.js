import react from "react";
import bot from "../../../img/botIcon.png"
import "../../../css/screen/chatBubble/leftChatBubble.css"


const LeftChatBubble = () => {
    return (
        <>
        <div className="chat_row">
            <div className="left_chat_bubble">
                <div className="bot_icon">
                    <img className="bot_image" alt="bot" src={bot}/>
                </div>

                <div className="left_chat_box">
                    <p>안녕하세요 유저님! 저는 물어봇입니다.<br/> 상품에 대한 정보, 요약, 비교, 추천을 원하시면 저한테 물어보세요!</p>
                </div>
            </div>
        </div>
            
        </>
    )
}

export default LeftChatBubble;