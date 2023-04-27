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
    useEffect(()=>{
        console.log(recommandItems)
    },[recommandItems])
    useEffect(() => {
        function categoryBookmark(filterBookmark){
            let tempList=[]
            let summaryList=[]
            let recommandList=[]
            let informationList=[]
            let comparisionList=[]
            filterBookmark.map(value=>{
                console.log(value)
                switch(value.category){
                    case 0:
                        tempList=[...tempList,value]
                    case 1:
                        summaryList=[...summaryList,value]
                    case 2:
                        recommandList=[...recommandList,value]
                    case 3:
                        informationList=[...informationList,value]
                    case 4:
                        comparisionList=[...comparisionList,value]
                    case 5:
                        tempList=[...tempList,value]
                    default:
                        tempList=[...tempList,value]
                }
            })
            setTempItems([...tempList])
            setSummaryItems([...summaryList])
            setRecommandItems([...recommandList])
            setInformationItems([...informationList])
            setComparisonItems([...comparisionList])
        }
        async function getDataFromServer() {
            try{
                    const inputData =  {"userId":userId}
                    const res = await axios.post(
                    "/reloadPage",
                    inputData
                    );
                //console.log(res.data);
                const reloadLog=res.data["log"]
                const reloadBookmark=res.data["bookmark"]
                const filterBookmark = reloadBookmark.map((item)=>({value:item[1],message:item[2],idx:item[0],category:item[3]}))
                //console.log(filterBookmark)
                categoryBookmark(filterBookmark)
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
             setRecommandItems={setRecommandItems} setInformationItems={setInformationItems} userId={userId}/>
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