import React,{useState,useEffect,useRef } from "react";
import { useLocation } from "react-router-dom";
import "../css/chat.css";
import ChatMenu from "./menu/ChatMenu";
import ChatScreen from "./screen/ChatScreen";
import "../css/screen/chatScreen.css"
import "../css/menu/chatMenu.css"
import axios from 'axios' // npm install axios
import Modal from "./summary/Modal";
import Scrollbars from "react-custom-scrollbars-2";
import SummaryBook from "./summary/SummaryBook";

const Chat = () => {
    const location=useLocation()
    const [tempItems,setTempItems]=useState([]);
    const [summaryItems,setSummaryItems] = useState([]);
    const [recommandItems,setRecommandItems]=useState([]);
    const [informationItems,setInformationItems]=useState([]);
    const {userId, nickName}= location.state
    const [chatLog,setChatLog]=useState([])
    const [autoScroll,setAutoScroll]=useState(true)
    const [modalOpen, setModalOpen] = useState(false);
    const [shakeBubble,setShakeBubble] = useState([]);
    const scrollbarRef = useRef(null);
    const [summaryDict,setSummaryDict] = useState(null);
    const modalScrollbarRef = useRef(null);
    const [alarm,setAlarm] = useState([false, false, false, false]);

    
    useEffect(() => {
        function categoryBookmark(filterBookmark){
            let tempList=[]
            let summaryList=[]
            let recommandList=[]
            let informationList=[]
            for(let i=0;i<filterBookmark.length;i++){
                const value = Object.assign({},filterBookmark[i]);
                switch(value.category){
                    case 0:
                        tempList=[...tempList,value]
                        break;
                    case 1:
                        summaryList=[...summaryList,value]
                        break;
                    case 2:
                        recommandList=[...recommandList,value]
                        break;
                    case 3:
                        informationList=[...informationList,value]
                        break;
                    case 5:
                        tempList=[...tempList,value]
                        break;
                    default:
                        tempList=[...tempList,value]
                        break;
                }
            }
            setTempItems([...tempList])
            setSummaryItems([...summaryList])
            setRecommandItems([...recommandList])
            setInformationItems([...informationList])
        }
        async function getDataFromServer() {
            try{
                    const inputData =  {"userId":userId}
                    const res = await axios.post(
                    `${userId}/refresh`,
                    inputData
                    );

                //const imageUrls = res.data["imageUrls"]
                //console.log(res.data)
                let reloadLog=res.data["log"]
                reloadLog = reloadLog.map(value=>value.map((value,idx)=>{
                    if(idx===7){
                        if(value){
                            if(value.length!==0){
                                const newValue = value.slice(1,-1).split(",")
                                return newValue.map((item)=>item.trim().slice(1,-1))
                            }
                        }
                        return value;
                    }
                    return value;
                }))
                console.log(reloadLog);
                //reloadLog.map(value=>console.log(value))
          
                if(reloadLog.length!==0){
                    setChatLog([...reloadLog])
                }
                const reloadBookmark=res.data["bookmark"]
                if(reloadBookmark.length!==0){
                    const filterBookmark = reloadBookmark.map((item)=>({value:item[1],message:item[2],idx:item[0],category:item[3]}))
                    categoryBookmark(filterBookmark)
                }
            } catch(e) {
                console.error(e)
            }
        }
        getDataFromServer()
      },[userId]);
    
      const renderThumbVertical = ({ style, ...props }) => {
        const thumbStyle = {
          backgroundColor: '#B9B9B9', // 변경하고 싶은 색상으로 설정
          borderRadius: '18px',
          width: '8px',
        };
        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    }


    async function getSummaryFromServer(productName) {
        try{
           // var productName = '삼성전자 노트북 플러스2 NT550XDA-K14A'
            const inputData =  {"productName":productName}
            const res = await axios.post(
                `${userId}/product-summary`,
                inputData
            );
            setSummaryDict(res.data)
        } catch(e) {
            setSummaryDict({"productName":"요약본이 존재하지 않습니다."})
        }
    }

    const openModal = (productName) => {
        getSummaryFromServer(productName);
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
        setSummaryDict(null)
    }
    return <>
        <aside className="chatMenu">
            <ChatMenu tempItems={tempItems} summaryItems={summaryItems}
             recommandItems={recommandItems} informationItems={informationItems} setTempItems={setTempItems} setSummaryItems={setSummaryItems} 
             setRecommandItems={setRecommandItems} setInformationItems={setInformationItems} userId={userId} scrollbarRef={scrollbarRef}
             shakeBubble={shakeBubble} setShakeBubble={setShakeBubble} alarm={alarm} setAlarm={setAlarm}/>
        </aside>
        <section className="chatScreen">
            <ChatScreen userId={userId} nickName={nickName} chatLog={chatLog} autoScroll={autoScroll} 
            setAutoScroll={setAutoScroll} tempItems={tempItems} summaryItems={summaryItems} recommandItems={recommandItems} 
            informationItems={informationItems}setTempItems={setTempItems} setSummaryItems={setSummaryItems} setRecommandItems={setRecommandItems} 
            setInformationItems={setInformationItems} openModal={openModal} ref={scrollbarRef} shakeBubble={shakeBubble} 
            setShakeBubble={setShakeBubble} alarm={alarm} setAlarm={setAlarm}/>
        </section>
        <Modal open={modalOpen} close={closeModal}>
            <div style={{display: 'flex',  flexDirection: 'column',
                width: '100%',
                height: '100vh',
                paddingBottom: '20px'}}>
                <Scrollbars
                ref={modalScrollbarRef}
                renderThumbVertical={renderThumbVertical}>
                    <SummaryBook summaryDict={summaryDict} ref={modalScrollbarRef}/>
                </Scrollbars>
            </div>
        </Modal>
    </>;
}

export default Chat;