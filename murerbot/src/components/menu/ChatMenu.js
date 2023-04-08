import React from "react";
import "../../css/menu/chatMenu.css"
import {Icon} from '@iconify/react';

const ChatMenu=()=>{
    return(
        <>
            <div class="menu_title">물어봇</div>
            <div class="menu_list">
                <label class="menu" for="menu">요약</label>
                <input id="menu" type="checkbox"/>
                <nav id="main_nav">
                    <ul>
                        <li>html</li>
                        <li>css</li>
                        <li>javaScript</li>
                    </ul>
                </nav>
                <label class="menu" for="menu">비교</label>
                <input id="menu" type="checkbox"/>
                <nav id="main_nav">
                    <ul>
                        <li>html</li>
                        <li>css</li>
                        <li>javaScript</li>
                    </ul>
                </nav>
                <label class="menu" for="menu">추천</label>
                <input id="menu" type="checkbox"/>
                <nav id="main_nav">
                    <ul>
                        <li>html</li>
                        <li>css</li>
                        <li>javaScript</li>
                    </ul>
                </nav>
            </div>
            <hr/>
            <div class="logout_div">
                <Icon class="logout_icon" icon="ic:baseline-logout" color="white"/>
                <label class="logout_label">로그아웃</label>
            </div>
        </>
    )
}
export default ChatMenu;