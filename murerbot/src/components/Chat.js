import React from "react";
import "../css/chat.css";
import ChatMenu from "./menu/ChatMenu";
import ChatScreen from "./screen/ChatScreen";
import "../css/screen/chatScreen.css"

const Chat = () => {
    return <>
        <aside style={{position:'relative'}}>
            <ChatMenu/>
        </aside>
        <section className="chatScreen">
            <ChatScreen/>
        </section>
    </>;
}

export default Chat;