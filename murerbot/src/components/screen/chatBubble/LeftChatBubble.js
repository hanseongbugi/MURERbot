import react from "react";
import bot from "../../../img/botIcon.png"
import "../../../css/screen/chatBubble/leftChatBubble.css"
import { DotPulse } from '@uiball/loaders'


const LeftChatBubble = ({selectProductName, message, state}) => {
    const bubbleText=(state)=>{
        switch(state){
            case "SUCCESS": 
                return 
            case "REQUIRE_PRODUCTNAME":
                return
            case "REQUIRE_DETAIL":
                return (<p>{
                    message.map(
                        (value,idx)=>idx!==message.length-1?
                        <button className="detail_button"key={idx} onClick={selectProductName}>{value}</button>
                        :value.trim()
                    )
                }
                </p>)
            case "REQUIRE_QUESTION":
                return
            default:
                return <p>{message==="..."?<DotPulse size={20} speed={1} color="black"/>:message}</p>

        }

    }
    

    return (
        <>
        <div className="chat_row">
            <div className="left_chat_bubble">
                <div className="bot_icon">
                    <img className="bot_image" alt="bot" src={bot}/>
                </div>

                <div className="left_chat_box"> 
                    {
                        bubbleText(state)
                    }
                </div>
            </div>
        </div>
            
        </>
    )
}

export default LeftChatBubble;