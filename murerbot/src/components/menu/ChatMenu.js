import React from "react";
import "../../css/menu/chatMenu.css"
import { Link } from 'react-router-dom'
import SubMenu from "./SubMenu";
import {Icon} from '@iconify/react';
import { Scrollbar } from "smooth-scrollbar-react";


const ChatMenu=()=>{

    return(
        <>
            <div className="menu_title">물어봇</div>
            <div className="sub_menu">
                <Scrollbar
                    plugins={{
                        overscroll:{
                        effect:'bounce',
                        },
                }}>
                    <SubMenu title={"요약"}/>
                    <SubMenu title={"비교"}/>
                    <SubMenu title={"추천"}/>
                    <SubMenu title={"단순 정보"}/>
                    <SubMenu title={"기타"}/>
                </Scrollbar>
            </div>
            <div className="bottom_menu">
                <div className="division_line"></div>
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