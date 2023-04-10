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
            <Scrollbar
            className="menu_scroll"
            plugins={{
                overscroll:{
                    effect:'bounce',
                },
            }}>
            <div className="sub_menu">
                <SubMenu title={"요약"}/>
                <SubMenu title={"비교"}/>
                <SubMenu title={"추천"}/>
            </div>
            </Scrollbar>
            {/* <div className="menu_list">
                <Scrollbar
                    className="menu_scroll"
                    plugins={{
                        overscroll:{
                            effect:'bounce',
                        },
                    }}>
                <div className="menu" onClick={isSumaryOpen}>
                    <label>요약</label>
                    <div className="menu_icon">
                    {
                        summaryOpen ?
                        <Icon icon="material-symbols:arrow-drop-up-rounded" height={40}/>
                        :<Icon icon="material-symbols:arrow-drop-down-rounded" height={40}/>
                    }
                    </div>
                    <Downshift>
                    {
                        items.map((value,idx)=>
                        <div className="menu_item" key={idx}>{value}</div>)
                    }
                    </Downshift>
                </div>
                
                <div className="menu" onClick={isComparisonOpen}>
                    <label>비교</label>
                    <div className="menu_icon">
                    {
                        comparisonOpen ?
                        <Icon icon="material-symbols:arrow-drop-up-rounded" height={40}/>
                        :<Icon icon="material-symbols:arrow-drop-down-rounded" height={40}/>
                        }
                    </div>
                    <Downshift>
                    {
                        items.map((value,idx)=>
                        <div className="menu_item" key={idx}>{value}</div>)
                    }
                    </Downshift>
                </div>
                
                <div className="last_menu" onClick={isRecommandOpen}>
                    <label>추천</label>
                    <div className="menu_icon">
                        {
                            recommandOpen ?
                            <Icon icon="material-symbols:arrow-drop-up-rounded" height={40}/>
                            :<Icon icon="material-symbols:arrow-drop-down-rounded" height={40}/>
                        }
                    </div>
                    <Downshift>
                        {
                            items.map((value,idx)=>
                            <div className="menu_item" key={idx}>{value}</div>)
                        }
                    </Downshift>
                </div>
                </Scrollbar>
            </div>
            */}
            <hr className="menu_hr"/> 
            <Link to="/">
                <div className="logout_div">
                    <Icon className="logout_icon" icon="ic:baseline-logout" color="white"/>
                    <label className="logout_label">로그아웃</label>
                </div>
            </Link> 
        </>
    )
}
export default ChatMenu;