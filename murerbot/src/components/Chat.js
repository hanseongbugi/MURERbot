import React,{useState} from "react";
import { useLocation } from "react-router-dom";
import "../css/chat.css";
import ChatMenu from "./menu/ChatMenu";
import ChatScreen from "./screen/ChatScreen";
import "../css/screen/chatScreen.css"
import "../css/menu/chatMenu.css"

const Chat = () => {
    const location=useLocation()
    const {userId, nickName, log}=location.state
    const [chatLog]=useState(log)
    return <>
        <aside className="chatMenu">
            <ChatMenu chatLog={chatLog}/>
        </aside>
        <section className="chatScreen">
            <ChatScreen userId={userId} nickName={nickName} chatLog={chatLog}/>
        </section>
    </>;
}

export default Chat;