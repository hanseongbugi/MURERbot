import React,{useEffect} from "react";
import "../../css/menu/chatMenu.css"
import { Link } from 'react-router-dom'
import SubMenu from "./SubMenu";
import {Icon} from '@iconify/react';
import { Scrollbar } from "smooth-scrollbar-react";


const ChatMenu=({chatLog})=>{
    const items = [
        {value: 'apple'},
        {value: 'pear'},
        {value: 'orange'},
        {value: 'grape'},
        {value: 'banana'},
        {value: 'tmp1'},
        {value: 'tmp2'},
        {value: 'tmp3'},
        {value: 'tmp4'},
        {value: 'tmp5'},
        {value: 'tmp6'},
        {value: 'tmp7'},
        {value: 'tmp8'}
      ]
    useEffect(()=>{

    },[chatLog])
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
                    <SubMenu title={"요약"} items={items}/>
                    <SubMenu title={"비교"} items={items}/>
                    <SubMenu title={"추천"} items={items}/>
                    <SubMenu title={"단순 정보"} items={items}/>
                    <SubMenu title={"기타"} items={items}/>
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