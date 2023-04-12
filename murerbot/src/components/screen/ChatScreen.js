
import React , { useState, useEffect }from "react";

import "../../css/screen/chatScreen.css"
import "../../css/grid.min.css"
import WelcomeChat from "./WelcomeChat"
import { Scrollbar } from "smooth-scrollbar-react";
import LeftChatBubble from "./chatBubble/LeftChatBubble";
import RightChatBubble from "./chatBubble/RightChatBubble";


const ChatScreen = () => {
    const [isFirstChat, setIsFirstChat] = useState(true);
    const [inputMessage, setInputMessage] = useState("");
    const [message,setMessage]=useState([]);
    const [isFocused,setIsFocused]=useState(false);
    const [isComposing, setIsComposing]=useState(false);
    const [disable,setDisable]=useState(true);

    useEffect(()=>{
        const input=document.querySelector('input');
        const handleFocus=()=>{
            setIsFirstChat(false);
            setIsFocused(true);
            input.removeEventListener('focus',handleFocus);
        }
        input.addEventListener('focus',handleFocus);
        return ()=>{
            input.removeEventListener('focus',handleFocus);
        }
    },[])

    useEffect(()=>{
        if(message.length!==0)
            setIsFirstChat(false);
    },[message])
    
    useEffect(()=>{
        inputMessage.length===0?setDisable(true):setDisable(false);
    },[inputMessage])

    const handleinputMessage = (e) => {
        setInputMessage(e.target.value)
    }

    const onClickSend = (e) => {
        if(inputMessage.length===0)return;
        setMessage([...message,inputMessage]);
        setInputMessage("");
    }
    const handleFocus=()=>{
        setIsFocused(true);
    }
    const enterKey=(e)=>{
        if(isComposing) return;
        if(inputMessage.length===0)return;
        if(e.key==='Enter'){
            setMessage([...message,inputMessage]);
            setInputMessage("");
        }
    }
    
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
                    {isFirstChat&&<WelcomeChat/>}
                    {isFocused&&<LeftChatBubble/>}

                {
                message.map((msg,idx)=>(
                    <div key={'div'+idx}>
                        <RightChatBubble key={'a'+idx} message={msg}/>
                        <LeftChatBubble key={idx}/>
                    </div>
                    )
                )
            }
            </Scrollbar>
        </div>
        
    
        
        <div className="input_box">
            <div className="input_division_line"></div>
            <div className="under_division_line">
                <input className="input_message" onFocus={handleFocus} type="text" name="input_message" 
                placeholder="메시지를 입력하세요" value={inputMessage} onKeyDown={enterKey} onChange={handleinputMessage}
                onCompositionStart={()=>setIsComposing(true)} onCompositionEnd={()=>setIsComposing(false)}/>
                <button className={disable?"send_message_button_disable":"send_message_button"} type="button" onClick={onClickSend}>보내기</button>
            </div>
        </div>
        
        </>
    )

}

export default ChatScreen;