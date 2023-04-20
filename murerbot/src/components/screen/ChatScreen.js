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
    const [requestMessage,setRequestMessage]=useState([]);
    const [requestState,setRequestState]=useState([]);
    const [isFocused,setIsFocused]=useState(false);
    const [isComposing, setIsComposing]=useState(false);
    const [disable,setDisable]=useState(true);
    const scrollbarRef = useRef(null);
    const [itemArray,setItemArray]=useState([])
    //const [categorys,setCategorys]=useState([])
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
        if(chatLog.length!==0){
            //const sortUserChat = chatLog.filter((value)=>value[5]===1)
            const sortBotChat = chatLog.filter((value)=>value[5]===0)
            //const chatList = sortUserChat.map((value)=>({message:value[3], target:value[5]}))
            //const botChat = sortBotChat.map((value)=>value[3])
            const botChatStateNumber = sortBotChat.map((value)=>value[2])
            const botChatState = botChatStateNumber.map((value)=>{
                if(value===5) return "REQUIRE_DETAIL"
                else return "SUCCESS" 
            })
            const botChatItems=botChatStateNumber.map((value)=>{
                switch(value){
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
            })
            //console.log(botChatItems)
            //setCategorys([...botChatStateNumber])
            setItemArray([...botChatItems])
            setMessage([...chatLog])
            //setRequestMessage([...botChat])
            setRequestState([...botChatState])
        }
    },[chatLog,tempItems, summaryItems, comparisonItems, recommandItems, informationItems, setTempItems,setSummaryItems, setComparisonItems, setRecommandItems, setInformationItems])
    
    useEffect(()=>{
        inputMessage.length===0?setDisable(true):setDisable(false);
    },[inputMessage])


    useEffect(()=>{
        if(message.length!==0){
            setIsFirstChat(false);
            setIsFocused(true);
        }
        //scrollbarRef.current.scrollToBottom()
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
            if(state === "REQUIRE_DETAIL"){
                if(intent === "NONE")
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
            setRequestMessage([...requestMessage,"LOADING"])
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
          let text = res.data['text']
          setRequestState([...requestState,state]);
          //text = `<>${text}`
          //console.log(text)
          const newRequestMessage = requestMessage.filter((value)=>value!=="LOADING")
          //console.log(newRequestMessage)
          setRequestMessage([...newRequestMessage,text])
          if(state === "FALLBACK")
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
        if(state === "REQUIRE_DETAIL"){
            if(intent === "NONE")
                initSetting()
            else
                state = "REQUIRE_PRODUCTNAME"
        }
        sendInput2Server()
        setInputMessage("");
    }

    const selectProductName = (e) => {
        console.log("select Product Name");
        productName = e.target.textContent;
        setMessage([...message,productName]);
        state = "REQUIRE_DETAIL"
        sendInput2Server();
    } 
    const renderThumbVertical = ({ style, ...props }) => {
        const thumbStyle = {
          backgroundColor: '#B9B9B9', // 변경하고 싶은 색상으로 설정
          borderRadius: '18px',
          width: '8px',
        };
        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };  

    return(
        <>
        <div className="chat_box">
            <Scrollbars
                renderThumbVertical={renderThumbVertical}
                // style={{width: '100%', height: '100%'}}
                ref={scrollbarRef}>
                {isFirstChat&&<WelcomeChat/>}
                {isFocused&&<LeftChatBubble state={"NULL"} firstMessage={true} message={`안녕하세요 ${currentNickName}님! 저는 물어봇입니다.\n상품에 대한 정보, 요약, 비교, 추천을 원하시면 저한테 물어보세요!`}/>}
                {
                message.map((msg,idx)=>(
                    <div key={'div'+idx}>{
                        msg[5]===1?<RightChatBubble key={'right'+idx} message={msg[3]} scrollbarRef={scrollbarRef}/>:
                        <LeftChatBubble key={'left'+idx} idx={idx} userMessage={message[idx-1][3]} itemArray={itemArray[idx]} 
                        firstMessage={false} selectProductName={selectProductName} state={requestState[idx]} 
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