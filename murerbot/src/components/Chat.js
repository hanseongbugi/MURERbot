import React,{useState,useEffect} from "react";
import { useLocation } from "react-router-dom";
import "../css/chat.css";
import ChatMenu from "./menu/ChatMenu";
import ChatScreen from "./screen/ChatScreen";
import "../css/screen/chatScreen.css"
import "../css/menu/chatMenu.css"
import axios from 'axios' // npm install axios

const Chat = () => {
    const location=useLocation()
    const [tempItems,setTempItems]=useState([]);
    const [summaryItems,setSummaryItems] = useState([]);
    const [comparisonItems,setComparisonItems]=useState([]);
    const [recommandItems,setRecommandItems]=useState([]);
    const [informationItems,setInformationItems]=useState([]);
    const {userId, nickName}=location.state
    const [chatLog,setChatLog]=useState([])
    const [autoScroll,setAutoScroll]=useState(true)
    //console.log(chatLog)
    useEffect(() => {
        async function getDataFromServer() {
            try{
                const inputData =  {"userId":userId}
                const res = await axios.post(
                "/reloadPage",
                inputData
              );
              console.log(res.data);
              const reloadLog=res.data["log"]
              console.log(res.data["bookmark"])
              setChatLog([...reloadLog])
            } catch(e) {
                console.error(e)
            }
        }
        getDataFromServer()
      },[userId]);


    return <>
        <aside className="chatMenu">
            <ChatMenu tempItems={tempItems} summaryItems={summaryItems} comparisonItems={comparisonItems}
             recommandItems={recommandItems} informationItems={informationItems}
             setTempItems={setTempItems} setSummaryItems={setSummaryItems} setComparisonItems={setComparisonItems}
             setRecommandItems={setRecommandItems} setInformationItems={setInformationItems}/>
        </aside>
        <section className="chatScreen">
            <ChatScreen userId={userId} nickName={nickName} chatLog={chatLog} autoScroll={autoScroll} 
            setAutoScroll={setAutoScroll} tempItems={tempItems} summaryItems={summaryItems} 
            comparisonItems={comparisonItems} recommandItems={recommandItems} informationItems={informationItems}
            setTempItems={setTempItems} setSummaryItems={setSummaryItems} setComparisonItems={setComparisonItems} 
            setRecommandItems={setRecommandItems} setInformationItems={setInformationItems}/>
        </section>
    </>;
}

export default Chat;