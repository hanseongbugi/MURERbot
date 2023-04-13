import React , { useState, useEffect }from "react";
import axios from 'axios' // npm install axios

import "../../css/screen/chatScreen.css"
import "../../css/grid.min.css"
import WelcomeChat from "./WelcomeChat"
import { Scrollbar } from "smooth-scrollbar-react";
import LeftChatBubble from "./chatBubble/LeftChatBubble";
import RightChatBubble from "./chatBubble/RightChatBubble";

let state = "SUCCESS"
let productName = ""
let intent = "NONE"
let keyPhrase = ""

function initSetting(){
    state = "SUCCESS"
    productName = ""
    intent = "NONE"
    keyPhrase = ""
}

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
        inputMessage.length===0?setDisable(true):setDisable(false);
    },[inputMessage])

    useEffect(()=>{
        if(message.length!==0)
            setIsFirstChat(false);
    },[message])

    const handleinputMessage = (e) => {
        setInputMessage(e.target.value)
    }

    const handleFocus=()=>{
        setIsFocused(true);
    }
    const enterKey=(e)=>{
        if(isComposing) return;
        if(inputMessage.length===0)return;
        if(e.key==='Enter'){
            setMessage([...message,inputMessage]);
             // 상세 상품명 선택해야하는 경우인데 채팅했을 때
            if(state == "REQUIRE_DETAIL"){
                if(intent == "NONE")
                    initSetting()
                else
                    state = "REQUIRE_PRODUCTNAME"
            }
            sendInput2Server()
            setInputMessage("");
        }
    }

    async function sendInput2Server() {
        try{
            if(state=="SUCCESS"){
                initSetting()
            }
                
            console.log("send msg state => "+state)
            const inputData =  {"text":inputMessage,
                                "state":state,
                                "productName":productName,
                                "intent":intent,
                                "keyPhrase":keyPhrase}
            const res = await axios.post(
            "/getUserInput",
            inputData
          );
          console.log(res.data);
          // 서버에서 보낸 데이터
          state = res.data["state"]
          intent = res.data["intent"]
          keyPhrase = res.data["keyPhrase"]
          console.log("state = "+state)
          console.log("productName = "+productName)
          console.log("intent = "+intent)
          console.log("keyPhrase = "+keyPhrase)
          if(state == "FALLBACK")
                initSetting()
        } catch(e) {
            console.error(e)
        }
    }

    const onClickSend = () => {
        console.log("click 보내기")
        console.log(inputMessage)
        if(inputMessage.length===0)return;
        setMessage([...message,inputMessage]);
        
        // 상세 상품명 선택해야하는 경우인데 채팅했을 때
        if(state == "REQUIRE_DETAIL"){
            if(intent == "NONE")
                initSetting()
            else
                state = "REQUIRE_PRODUCTNAME"
        }
        sendInput2Server()
        setInputMessage("");
    }

    const selectProductName = () => {
        console.log("select Product Name")
        productName = "LG전자 그램16 16ZD90P-GX50K"
        sendInput2Server()
    }     

    return(
        <>
        <div className="chat_box">
            <Scrollbar
                    plugins={{
                        overscroll:{
                            effect:'bounce',
                        }
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

                <button onClick={selectProductName}>aaaaaaaaaa</button>

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