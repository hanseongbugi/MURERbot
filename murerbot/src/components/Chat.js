import React from "react";
import "../css/chat.css";
import ChatMenu from "./menu/ChatMenu";
import ChatScreen from "./screen/ChatScreen";
import "../css/screen/chatScreen.css"
import "../css/menu/chatMenu.css"

const Chat = () => {
    return <>
        <aside className="chatMenu">
            <ChatMenu/>
        </aside>
        <section className="chatScreen">
            <ChatScreen/>
        </section>
    </>;
}

export default Chat;