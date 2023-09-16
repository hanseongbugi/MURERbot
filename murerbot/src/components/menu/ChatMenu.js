import React from "react";
import "../../css/menu/chatMenu.css"
import { Link } from 'react-router-dom'
import SubMenu from "./SubMenu";
import {Icon} from '@iconify/react';
import { Scrollbar } from "smooth-scrollbar-react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsFillBookmarkFill } from "react-icons/bs";

const ChatMenu=({tempItems, summaryItems, recommandItems, informationItems, setTempItems,setSummaryItems,
    setRecommandItems,setInformationItems, userId, scrollbarRef,shakeBubble,setShakeBubble, alarm,setAlarm, nickName})=>{
    const alarmAnimationController = (category)=>{
        setAlarm(alarm.map((value,idx)=>{
            if(idx===category) return false;
            return value;
        }))
    }
    const menuInfoOpen=(e)=>{
        e.preventDefault();
        console.log("open")
        const width = 600;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        // 팝업 창 열기 및 데이터 전달
        const dataToSend = { nickName : nickName };
        const queryString = new URLSearchParams(dataToSend).toString();
        window.open(`/Chat/InfoWindow?${queryString}`,'MURERBOT_Info',`width=${width}, height=${height}, left=${left}, top=${top}, resizable=no`)
    }
    return(
        <>
            <div className="menu_title_box">
                <div className="menu_title">물어봇</div>
                <div className="menu_info_circle_box"><AiOutlineInfoCircle onClick={(e)=>menuInfoOpen(e)} className="menu_info_circle"/></div>
            </div>
            <div className="division_line1"></div>
            <div className="sub_menu">
                <div className="submenu_title"><p>북마크</p><BsFillBookmarkFill className="title_icon"/></div>
                <Scrollbar
                    plugins={{
                        overscroll:{
                        effect:'bounce',
                        },
                }}>
                    
                    {alarm&&informationItems.length!==0?<SubMenu title={"상품 상세정보"} items={informationItems} setItems={setInformationItems} userId={userId} 
                    scrollbarRef={scrollbarRef} shakeBubble={shakeBubble} setShakeBubble={setShakeBubble} 
                    alarm={alarm[0]} alarmAnimationController={alarmAnimationController} controller={0}/>:null}
                    {alarm&&summaryItems.length!==0?<SubMenu title={"요약"} items={summaryItems} setItems={setSummaryItems} userId={userId} 
                    scrollbarRef={scrollbarRef} shakeBubble={shakeBubble} setShakeBubble={setShakeBubble} 
                    alarm={alarm[1]} alarmAnimationController={alarmAnimationController} controller={1}/>:null}
                    {alarm&&recommandItems.length!==0?<SubMenu title={"추천"} items={recommandItems} setItems={setRecommandItems} userId={userId} 
                    scrollbarRef={scrollbarRef} shakeBubble={shakeBubble} setShakeBubble={setShakeBubble} 
                    alarm={alarm[2]} alarmAnimationController={alarmAnimationController} controller={2}/>:null}
                    {alarm&&tempItems.length!==0?<SubMenu title={"기타"} items={tempItems} setItems={setTempItems} userId={userId} 
                    scrollbarRef={scrollbarRef} shakeBubble={shakeBubble} setShakeBubble={setShakeBubble} 
                    alarm={alarm[3]} alarmAnimationController={alarmAnimationController} controller={3}/>:null}
                </Scrollbar>
            </div>
            <div className="bottom_menu">
                <div className="division_line2"></div>
                <div className="under_division_line">
                    <Link className="logout_link" to="/">
                    <div className="logout_div">
                            <Icon className="logout_icon" icon="ic:baseline-logout" color="white"/>
                            <label className="logout_label">로그아웃</label>
                    </div>
                    </Link> 
                </div>

            </div>
        </>
    )
}
export default ChatMenu;