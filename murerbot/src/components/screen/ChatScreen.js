import React , { useState, useEffect, useRef }from "react";
import axios from 'axios' // npm install axios

import "../../css/screen/chatScreen.css"
import "../../css/grid.min.css"
import { Scrollbars } from 'react-custom-scrollbars-2';
import WelcomeChat from "./WelcomeChat"
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

const ChatScreen = ({userId, nickName, chatLog,  tempItems, summaryItems, comparisonItems, recommandItems, informationItems,
    setTempItems, setSummaryItems, setComparisonItems, setRecommandItems, setInformationItems}) => {
    const [currentUserId]=useState(userId)
    const [currentNickName]=useState(nickName)
    const [isFirstChat, setIsFirstChat] = useState(true);
    const [inputMessage, setInputMessage] = useState("");
    const [message,setMessage]=useState([]);
    const [isFocused,setIsFocused]=useState(false);
    const [isComposing, setIsComposing]=useState(false);
    const [disable,setDisable]=useState(true);
    const scrollbarRef = useRef(null);
    const [newMessage,setNewMessage]=useState([])
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
        if(chatLog.length!==0) setMessage([...chatLog])
    },[chatLog])
    
    useEffect(()=>{
        inputMessage.length===0?setDisable(true):setDisable(false);
    },[inputMessage])

    useEffect(()=>{
        if(newMessage.length!==0){
            const filterMessage = message.filter((value)=>value[3]!=="LOADING")
            setMessage([...filterMessage,newMessage])
            setNewMessage([])
        }
    },[newMessage,message])

    useEffect(()=>{
        if(message.length!==0){
            setIsFirstChat(false);
            setIsFocused(true);
            //console.log(message)
        }
        message.map((msg)=>console.log(msg))
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
            let processMessage = [0,0,0,inputMessage,0,1];
             // 상세 상품명 선택해야하는 경우인데 채팅했을 때
            if(state === "REQUIRE_DETAIL"){
                if(intent === "NONE")
                    initSetting()
                else
                    state = "REQUIRE_PRODUCTNAME"
            }
            sendInput2Server(processMessage)
            setInputMessage("");
        }
    }
    

    async function sendInput2Server(processMessage) {
        try{
            if(state==="SUCCESS"){
                initSetting()
            }
            console.log("user Id = ",currentUserId)
            console.log("send msg state => "+state)
            const inputData =  {"userId":currentUserId,
                                "text":inputMessage,
                                "state":state,
                                "productName":productName,
                                "intent":intent,
                                "keyPhrase":keyPhrase}
            setMessage([...message,processMessage,[0,0,0,"LOADING",0,0]])
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
          let log = res.data["log"];
          log.splice(0,0,0);
          log.splice(4,0,0);
          console.log(log)
          setNewMessage([...log])
          if(state === "FALLBACK")
                initSetting()
        } catch(e) {
            console.error(e)
        }
        
    }

    const onClickSend = () => {
        console.log("click 보내기")
        //console.log(inputMessage)
        if(inputMessage.length===0)return;
        let processMessage = [0,0,0,inputMessage,0,1];
        
        // 상세 상품명 선택해야하는 경우인데 채팅했을 때
        if(state === "REQUIRE_DETAIL"){
            if(intent === "NONE")
                initSetting()
            else
                state = "REQUIRE_PRODUCTNAME"
        }
        sendInput2Server(processMessage)
        setInputMessage("");
    }

    const selectProductName = (e) => {
        console.log("select Product Name");
        productName = e.target.textContent;
        let processMessage = [0,0,0,productName,0,1];
        state = "REQUIRE_DETAIL"
        sendInput2Server(processMessage);
    }    
    const selectItemArray=(state)=>{
        switch(state){
            case 0:
                return {setItems:setTempItems, items:tempItems};
            case 1:
                return {setItems:setSummaryItems, items:summaryItems};
            case 2:
                return {setItems:setRecommandItems, items:recommandItems};
            case 3:
                return {setItems:setInformationItems, items:informationItems};
            case 4:
                return {setItems:setComparisonItems, items:comparisonItems};
            case 5:
                return {setItems:setTempItems,items:tempItems};  
            default:
                return {setItems:setTempItems,items:tempItems};
        }
    }
    const renderThumbVertical = ({ style, ...props }) => {
        const thumbStyle = {
          backgroundColor: '#B9B9B9', // 변경하고 싶은 색상으로 설정
          borderRadius: '18px',
          width: '8px',
        };
        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    }
    return(
        <>
        <div className="chat_box">
            <Scrollbars
                renderThumbVertical={renderThumbVertical}
                ref={scrollbarRef}>
                {isFirstChat&&<WelcomeChat/>}
                {isFocused&&<LeftChatBubble state={"NULL"} firstMessage={true} message={`안녕하세요 ${currentNickName}님! 저는 물어봇입니다.\n상품에 대한 정보, 요약, 비교, 추천을 원하시면 저한테 물어보세요!`}/>}
                {
                message.map((msg,idx)=>(
                    <div key={'div'+idx}>{
                        msg[5]===1?<RightChatBubble key={'right'+idx} message={msg[3]} scrollbarRef={scrollbarRef}/>:
                        <LeftChatBubble key={'left'+idx} idx={idx} userMessage={message[idx-1][3]} itemArray={selectItemArray(msg[2])}
                        firstMessage={false} selectProductName={selectProductName} state={msg[2]===5?"REQUIRE_DETAIL":"SUCCESS"} 
                        category={msg[2]} message={msg[3]}/>
                    }
                    </div>
                    )
                )
            }
            </Scrollbars>
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