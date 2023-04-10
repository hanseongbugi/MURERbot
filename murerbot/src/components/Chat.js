import React from "react";
import "../css/chat.css";
import ChatMenu from "./menu/ChatMenu";
import ChatScreen from "./screen/ChatScreen";
import "../css/menu/chatScreen.css"

const Chat = () => {
    return <>
        <aside>
            <ChatMenu/>
        </aside>
        <section className="chatScreen">
            <ChatScreen/>
        </section>
    </>;
}

export default Chat;