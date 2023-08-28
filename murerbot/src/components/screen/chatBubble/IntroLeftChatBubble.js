import React from "react";
import bot from "../../../img/botIcon.png"
import "../../../css/screen/chatBubble/introLeftChatBubble.css"
import IntroRecommandChatText from "./chatText/IntroRecommandChatText";


const IntroLeftChatBubble = ({message, category}) => {
    const bubbleText=()=>{
       
        if(category===2){
            return <IntroRecommandChatText message={message}/>
        }   
        else{
            return <p dangerouslySetInnerHTML={{__html:message}}></p>
        }

    }
    return (
        <>
        <div className={"chat_row"}>
            <div className={"left_chat_bubble"}>
                <div className="intro_bot_icon">
                    <img className="intro_bot_image" alt="bot" src={bot}/>
                </div>
                <div className="intro_left_chat_box">
                    <div className="intro_chat_text">
                        {bubbleText()}
                    </div>
                    <div className="intro_summary_button_div">
                    {category === 1 ? <button className="intro_show_summary_button">{`요약본 자세히 보기 >`}</button>:null}
                    </div>
                </div>
            </div>
        </div>
            
        </>
    )
}

export default IntroLeftChatBubble;