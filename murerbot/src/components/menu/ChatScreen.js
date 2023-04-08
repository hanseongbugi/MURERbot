import React , { useState }from "react";
import "../../css/menu/chatScreen.css"
import "../../css/grid.min.css"

const ChatScreen = () => {
    
    const [inputMessage, setInputMessage] = useState('');




    return(
        <>
        
        
        
        
        
        
        
        <div className="container">
            <div className="input_box">
                <div className="row">
                    <div className="col-12">
                        <input type="text" name="input_message" placeholder="메시지를 입력하세요" value={inputMessage} />
                    </div>
                </div>
            </div>
            

        </div>
        </>
    )

}

export default ChatScreen;