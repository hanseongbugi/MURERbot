import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import "../../../../css/screen/chatBubble/chatText/recommandChatText.css"

const RecommandChatText = ({message,clipProductName})=>{
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
    const productName = splitProductName();
    const filterMessage = makeMessageArray()
    console.log(productName)
    return (<div className="recommand_box">
        {
            filterMessage.map((value,idx)=>
            <div key={value+idx} className="recommand_message" >
                <p className={idx===0?"recommand_title":"recommand_item"} key={'message'+idx}>{value}</p>
                {idx!==0?<CopyToClipboard key={"clip"+idx} text={productName[idx]} onCopy={()=>clipProductName()}>
                    <MdContentCopy key={"copy"+idx} className="show_clip_button" size={18}/></CopyToClipboard>:null}
            </div>
            )
        }
        </div>
    );
}
export default RecommandChatText;