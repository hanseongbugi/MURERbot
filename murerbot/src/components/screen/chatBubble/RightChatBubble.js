import react from "react";
import "../../../css/screen/chatBubble/rightChatBubble.css"


const RightChatBubble = ({message}) => {
    return (
        <>
        <div className="chat_row">
            <div className="right_chat_bubble">

                <div className="right_chat_box">
                    <p>{message}</p>
                </div>
            </div>
        </div>
            
        </>
    )
}

export default RightChatBubble;