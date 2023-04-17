import React from "react";
import { useLocation } from "react-router-dom";
import "../css/chat.css";
import ChatMenu from "./menu/ChatMenu";
import ChatScreen from "./screen/ChatScreen";
import "../css/screen/chatScreen.css"
import "../css/menu/chatMenu.css"

const Chat = () => {
    const location=useLocation()
    const {userId, nickName}=location.state
    return <>
        <aside className="chatMenu">
            <ChatMenu/>
        </aside>
        <section className="chatScreen">
            <ChatScreen userId={userId} nickName={nickName}/>
        </section>
    </>;
}

export default Chat;