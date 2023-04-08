import React, {useState} from "react";
import "../../css/menu/chatMenu.css"
import {Icon} from '@iconify/react';
import { Link } from 'react-router-dom'
//import NavDropdown from 'react-bootstrap/NavDropdown';

const ChatMenu=()=>{
    const [summaryOpen, setSummaryOpen] = useState(false)
    const [comparisonOpen, setComparisonOpen] = useState(false)
    const [recommandOpen, setRecommandOpen] = useState(false)
    const isSumaryOpen=()=>{
        if(summaryOpen) setSummaryOpen(false)
        else setSummaryOpen(true)
    }
    const isComparisonOpen=()=>{
        if(comparisonOpen) setComparisonOpen(false)
        else setComparisonOpen(true)
    }
    const isRecommandOpen=()=>{
        if(recommandOpen) setRecommandOpen(false)
        else setRecommandOpen(true)
    }
    return(
        <>
            <div className="menu_title">물어봇</div>
            
            <div className="menu_list">
                <div className="menu" onClick={isSumaryOpen}>
                    <label>요약</label>
                    <div className="menu_icon">
                        {
                        summaryOpen ?
                        <Icon icon="material-symbols:arrow-drop-up-rounded" height={40}/>
                        :<Icon icon="material-symbols:arrow-drop-down-rounded" height={40}/>
                        }
                    </div>
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
                </div>
                
                <div className="menu" onClick={isRecommandOpen}>
                    <label>추천</label>
                    <div className="menu_icon">
                    {
                        recommandOpen ?
                        <Icon icon="material-symbols:arrow-drop-up-rounded" height={40}/>
                        :<Icon icon="material-symbols:arrow-drop-down-rounded" height={40}/>
                        }
                    </div>
                </div>
                
            </div>
            <hr/>
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