import react from "react";
import bot from "../../../img/botIcon.png"
import "../../../css/screen/chatBubble/leftChatBubble.css"
import { DotPulse } from '@uiball/loaders'


const LeftChatBubble = ({selectProductName, message, state}) => {

    const checkStrLong = (str) => {
        let result = '';

        for (let i = 0; i < str.length; i++) {
            if (i > 0 && i % 55 == 0) {
                result += '\n';
            }
            result += str.charAt(i);
        }
        return result;
    }


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
                        <button className="detail_button"key={idx} onClick={selectProductName}>{value.length > 20 ? checkStrLong(value) : value}</button>
                        :value.trim()
                    )
                }
                {/* {
                    message.filter((value,idx)=>idx===message.length-1).map((value,key)=>{value})
                } */}
                </p>)
            case "REQUIRE_QUESTION":
                return
            default:
                return (message==="..."?<DotPulse size={20} speed={1} color="black"/>:<p>{message}</p>)

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