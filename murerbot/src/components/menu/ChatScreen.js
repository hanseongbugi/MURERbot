import React , { useState }from "react";
import "../../css/menu/chatScreen.css"
import "../../css/grid.min.css"

const ChatScreen = () => {
    
    const [inputMessage, setInputMessage] = useState('');

    const handleinputMessage = (e) => {
        setInputMessage(e.target.value)
    }

    const onClickSend = () => {

    }

    return(
        <>
        
        
        
        
        
        
        
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