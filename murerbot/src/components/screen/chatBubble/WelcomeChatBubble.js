import React from "react";
import bot from "../../../img/botIcon.png"
import "../../../css/screen/chatBubble/welcomeChatBubble.css"


const WelcomeChatBubble = ({currentNickName, sendMessage}) => {

    const clickMessageButton=(e)=>{
        e.preventDefault();
        sendMessage(e.target.value)
    }

    return (
        <>
        <div className={"chat_row"}>
            <div className={"left_chat_bubble"}>
                <div className="bot_icon">
                    <img className="bot_image" alt="bot" src={bot}/>
                </div>
                <div className="welcome_chat_box">
                    <div className="welcome_p">
                        <div className="welcome_in_div">
                            <p>{`안녕하세요, ${currentNickName}님!\n저는 물어봇입니다.\n\n상품에 대한 상세정보, 요약, 추천을 제공합니다.\n현재 지원하는 품목은 노트북, 데스크탑, 모니터, 키보드, 마우스입니다.`}</p>
                        </div>
                        <div className="welcome_in_div">
                            <p>{"1. 상품 상세정보"}</p>
                            <div className="welcome_btn_box">
                                <p>{"예시)"}</p>
                                <button onClick={(e)=>clickMessageButton(e)} value={"그램 16"}>{"그램 16"}</button> 
                                <p>{">> 원하는 상품 선택 >>"}</p> 
                                <button onClick={(e)=>clickMessageButton(e)} value={"무게 알려줘"}>{"무게 알려줘"}</button>
                            </div>
                        </div>
                        <div className="welcome_in_div">
                            <p className="welcome_out_p">{"2. 상품 요약"}</p>
                            <div className="welcome_btn_box">
                                <p className="welcome_in_p">{"예시)"}</p>
                                <button className="welcome_button" onClick={(e)=>clickMessageButton(e)} value="그램 16">{"그램 16"}</button>
                                <p className="welcome_in_p">{">> 원하는 상품 선택 >>"}</p>
                                <button className="welcome_button" onClick={(e)=>clickMessageButton(e)} value="요약해줘">{"요약해줘"}</button>
                            </div>
                        </div>
                        <div className="welcome_in_div">
                            <p className="welcome_out_p">{"3. 상품 추천"}</p>
                            <div className="welcome_btn_box">
                                <p className="welcome_in_p">{"예시)"}</p>
                                <button className="welcome_button" onClick={(e)=>clickMessageButton(e)} value="가벼운 노트북 추천해줘">{"가벼운 노트북 추천해줘"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            
        </>
    )
}

export default WelcomeChatBubble;