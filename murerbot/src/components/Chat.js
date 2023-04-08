import React from "react";
import "../css/chat.css";
import ChatMenu from "./menu/ChatMenu";
import ChatScreen from "./menu/ChatScreen";

const Chat = () => {
    return <>
        <aside>
            <ChatMenu/>
        </aside>
        <section>
            <ChatScreen/>
        </section>
    </>;
}

export default Chat;