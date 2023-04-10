
import React , { useState }from "react";

import "../../css/screen/chatScreen.css"
import "../../css/grid.min.css"
// import WelcomeChat from "./WelcomeChat"
import { Scrollbar } from "smooth-scrollbar-react";
import LeftChatBubble from "./chatBubble/LeftChatBubble";
import RightChatBubble from "./chatBubble/RightChatBubble";

const ChatScreen = () => {
    // const [isFirstChat, setIsFirstChat] = useState(false);
    const [inputMessage, setInputMessage] = useState('');

    const handleinputMessage = (e) => {
        setInputMessage(e.target.value)
    }

    const onClickSend = () => {

    }


    // useEffect(() => {
    //     // handleIsFirstChat();
    // } )

    // const handleIsFirstChat = () => {
    //     if(isFirstChat){
    //         setIsFirstChat(false)
    //     }
    //     else 
    //         setIsFirstChat(true)
    // }
    
    return(
        <>
        <div className="chat_box">
            <Scrollbar
                    className="chat_scroll"
                    plugins={{
                        overscroll:{
                            effect:'bounce',
                        },
                    }}>

                <LeftChatBubble/>
                <LeftChatBubble/>
                <RightChatBubble/>
                <RightChatBubble/>
                <RightChatBubble/>
                <RightChatBubble/>
                <RightChatBubble/>
                <RightChatBubble/>
            </Scrollbar>
        </div>
        
    
        
        <div className="input_box">
            <div className="input_division_line"></div>
            <div className="under_division_line">
                <input className="input_message" type="text" name="input_message" placeholder="메시지를 입력하세요" value={inputMessage} onChange={handleinputMessage}/>
                <button className="send_message_button" type="button" onClick={onClickSend}>보내기</button>
            </div>
        </div>
        
        </>
    )

}

export default ChatScreen;