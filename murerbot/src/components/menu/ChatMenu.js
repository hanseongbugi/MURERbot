import React from "react";
import "../../css/menu/chatMenu.css"
import { Link } from 'react-router-dom'
import SubMenu from "./SubMenu";
import {Icon} from '@iconify/react';
import { Scrollbar } from "smooth-scrollbar-react";
import { BsFillBookmarkFill } from "react-icons/bs";

const ChatMenu=({tempItems, summaryItems, recommandItems, informationItems, setTempItems,setSummaryItems,
    setRecommandItems,setInformationItems, userId, scrollbarRef,shakeBubble,setShakeBubble})=>{


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
                    <SubMenu title={"상품 상세정보"} items={informationItems} setItems={setInformationItems} userId={userId} 
                    scrollbarRef={scrollbarRef} shakeBubble={shakeBubble} setShakeBubble={setShakeBubble}/>
                    <SubMenu title={"요약"} items={summaryItems} setItems={setSummaryItems} userId={userId} 
                    scrollbarRef={scrollbarRef} shakeBubble={shakeBubble} setShakeBubble={setShakeBubble}/>
                    <SubMenu title={"추천"} items={recommandItems} setItems={setRecommandItems} userId={userId} 
                    scrollbarRef={scrollbarRef} shakeBubble={shakeBubble} setShakeBubble={setShakeBubble}/>
                    <SubMenu title={"기타"} items={tempItems} setItems={setTempItems} userId={userId} 
                    scrollbarRef={scrollbarRef} shakeBubble={shakeBubble} setShakeBubble={setShakeBubble}/>
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