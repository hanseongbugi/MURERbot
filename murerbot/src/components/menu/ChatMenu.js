import React from "react";
import "../../css/menu/chatMenu.css"
import { Link } from 'react-router-dom'
import SubMenu from "./SubMenu";
import {Icon} from '@iconify/react';
import { Scrollbar } from "smooth-scrollbar-react";
import { BsFillBookmarkFill } from "react-icons/bs";

const ChatMenu=({tempItems, summaryItems, recommandItems, informationItems, setTempItems,setSummaryItems,
    setRecommandItems,setInformationItems, userId, scrollbarRef,shakeBubble,setShakeBubble, alarm,setAlarm})=>{
    //console.log(alarm)
    const alarmAnimationController = (category)=>{
        //console.log('alarm2')
        setAlarm(alarm.map((value,idx)=>{
            if(idx===category) return false;
            return value;
        }))
    }
    return(
        <>
            <div className="menu_title">물어봇</div>
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