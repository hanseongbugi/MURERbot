import React,{useEffect} from "react";
import "../../../css/screen/chatBubble/rightChatBubble.css"


const RightChatBubble = ({message,autoScroll,setAutoScroll,scrollbarRef}) => {
    useEffect(()=>{
        if(autoScroll){
            scrollbarRef.current.scrollToBottom()
            setAutoScroll(false)
        }
    })
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