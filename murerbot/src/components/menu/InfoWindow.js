import React from "react";
import "../../css/menu/infoWindow.css"
import bot from "../../img/botIcon.png";
const InfoWindow=()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const receivedData = Object.fromEntries(urlParams.entries());
    return(
        <>
            <div className="info_window_body">
            <div className={"chat_row"}>
            <div className={"left_chat_bubble"}>
                <div className="bot_icon">
                    <img className="bot_image" alt="bot" src={bot}/>
                </div>
                <div className="info_window_chat_box">
                    <div className="info_window_p">
                        <div className="info_window_in_div">
                            <p>{`안녕하세요, ${receivedData.nickName}님!\n저는 물어봇입니다.\n\n상품에 대한 상세정보, 요약, 추천을 제공합니다.\n`}현재 지원하는 품목은 <strong>노트북, 데스크탑, 모니터, 키보드, 마우스</strong>입니다.</p>
                        </div>
                        <div className="info_window_ex_div">
                            <p><strong className="info_window_module">1. 상품 상세정보</strong></p>
                            <div className="info_window_btn_box">
                                <p>{"예시 1)"}</p>
                                <div>{"그램 16"}</div> 
                                <p>{">> 원하는 상품 선택 >>"}</p> 
                                <div>{"무게 알려줘"}</div>
                            </div>
                            <div className="info_window_btn_box">
                                <p>{"예시 2)"}</p>
                                <div>{"로지텍 키보드"}</div> 
                                <p>{">> 원하는 상품 선택 >>"}</p> 
                                <div>{"가격 어떄"}</div>
                            </div>
                        </div>
                        <div className="info_window_ex_div">
                            <p><strong className="info_window_module">2. 상품 요약</strong></p>
                            <div className="info_window_btn_box">
                                <p>{"예시 1)"}</p>
                                <div>{"그램 16"}</div>
                                <p>{">> 원하는 상품 선택 >>"}</p>
                                <div>{"요약해줘"}</div>
                            </div>
                            <div className="info_window_btn_box">
                                <p>{"예시 2)"}</p>
                                <div>{"후기 어때?"}</div>
                                <p>{">> "}</p>
                                <div>{"로지텍 마우스"}</div>
                                <p>{">> 원하는 상품 선택"}</p>
                            </div>
                        </div>
                        <div className="info_window_ex_div">
                            <p><strong className="info_window_module">3. 상품 추천</strong></p>
                            <div className="info_window_btn_box">
                                <p>{"예시 1)"}</p>
                                <div>{"가벼운 노트북 추천해줘"}</div>
                            </div>
                            <div className="info_window_btn_box">
                                <p>{"예시 2)"}</p>
                                <div>{"저렴한 마우스 추천해줘"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            </div>
        </>
    )
}
export default InfoWindow;