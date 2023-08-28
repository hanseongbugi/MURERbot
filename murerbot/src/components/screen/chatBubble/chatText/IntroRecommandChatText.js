import "../../../../css/screen/chatBubble/chatText/introRecommandChatText.css"

const IntroRecommandChatText = ({message})=>{

    const splitProductName = ()=>{
        if(!message||message.length===0) return;
        let productNames = ["-"]
        let saveName = false
        let saveIdx = 1
        for(let i = 0;i<message.length;i++){
            if(message[i]==='='&&message[i+1]==='%'){
                saveName = false;
                saveIdx += 1;
                i++;
            }
            if(saveName) productNames[saveIdx] += message[i]
            if(message[i]==='%'&&message[i+1]==='='){
                saveName = true;
                productNames.push("");
                i++;
            }
            
        }
        return productNames
    }
    const makeMessageArray = ()=>{
        if(!message||message.length===0) return;
        const replaceMessage = message.replaceAll('%=','').split('=%');
        const splitMessage = replaceMessage.map(value=>value.split('\n').filter(value=>value.length!==0));
        const remakeMessage = []
        splitMessage.map(value=>value.map(value=>remakeMessage.push(value)))
        return remakeMessage;
    }
    const productName = splitProductName()
    const filterMessage = makeMessageArray()
    return (
        filterMessage.length!==1?
    <div className="recommand_box">
        {
            filterMessage.map((value,idx)=>
            <div key={value+idx} className="recommand_message">
                {idx===0?<p className="recommand_title" key={'message'+idx}>{value}</p>:
                <div className="recommand_item"><p>{value.substr(0,value.search(productName[idx]))}</p><button className="intro_recommand_btn">{productName[idx]}</button></div>}
            </div>
            )
        }
        </div>:
        <div className="recommand_box">
            <div className="recommand_message" >
                <p>{filterMessage[0]}</p>
            </div>
        </div>
    );
}
export default IntroRecommandChatText;