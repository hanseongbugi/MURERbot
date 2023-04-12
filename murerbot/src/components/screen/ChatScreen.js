import React , { useState }from "react";
import axios from 'axios' // npm install axios

import "../../css/screen/chatScreen.css"
import "../../css/grid.min.css"
// import WelcomeChat from "./WelcomeChat"
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
    // const [isFirstChat, setIsFirstChat] = useState(false);
    const [inputMessage, setInputMessage] = useState('');

    const handleinputMessage = (e) => {
        setInputMessage(e.target.value)
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

        // 상세 상품명 선택해야하는 경우인데 채팅했을 때
        if(state == "REQUIRE_DETAIL"){
            if(intent == "NONE")
                initSetting()
            else
                state = "REQUIRE_PRODUCTNAME"
        }
        sendInput2Server()
        setInputMessage('')
    }

    const selectProductName = () => {
        console.log("select Product Name")
        productName = "LG전자 그램16 16ZD90P-GX50K"
        sendInput2Server()
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
                <button onClick={selectProductName}>aaaaaaaaaa</button>
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