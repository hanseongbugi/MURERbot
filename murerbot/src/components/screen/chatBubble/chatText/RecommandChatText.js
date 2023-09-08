import "../../../../css/screen/chatBubble/chatText/recommandChatText.css"
import React, {  useState } from "react";

const RecommandChatText = ({message, selectProductName, imageUrls, productInfo})=>{
    const [showImage, setShowImage] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);


    // 버튼에 마우스 올렸을 때
    const handleMouseEnter = (e,idx) => {
        e.preventDefault()
        if (!showImage){
            setShowImage(true);
            setImageIndex(idx-1);
        }
    };

    // 버튼에 마우스 없을 때
    const handleMouseLeave = (e) => {
        e.preventDefault()
        setShowImage(false);
    };

    //console.log("imageUrls: " + imageUrls[2])
    const splitProductName = ()=>{
        if(!message||message.length===0) return;
        //console.log(message)
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
        <div className="recommend_result">
            <div className="recommend_message">
                <p>{filterMessage[0]}</p>
            </div>
            
            <div className="recommend_contents">
                <div className="recommend_products">
                    {filterMessage.map((value, idx) => idx !== 0 && idx !== filterMessage.length?
                        <div key={idx} className="recommand_item">
                            <p>{value.substr(0, value.search(':')+1)}</p>
                            <div className="recommend_info">
                                {productInfo[0].map((info,infoIndex)=>
                                productInfo[1][idx-1][infoIndex]?
                                <div key={infoIndex} className="recommend_info">
                                    <p className="recommend_first_info">{info}</p>
                                    <p>{" : "}</p><p className="recommend_last_info">{productInfo[1][idx-1][infoIndex]}</p>
                                </div>:null)
                                }
                            </div>
                            <div className="recommend_buttons">
                                <button className="recommand_btn" onClick={selectProductName}
                                onMouseEnter={(e)=>handleMouseEnter(e,idx)} onMouseLeave={(e)=>handleMouseLeave(e)}
                                >{productName[idx]}</button>
                            </div>
                            </div>
                        :null
                    )}
                </div>

                <div className="item_image">
                {showImage && imageUrls ? <img src={imageUrls[imageIndex]} alt="상품 이미지"/> : null}
                </div>
            </div>
        </div>
        
        :
        // 추천 결과를 찾을 수 없을 때
        <div className="recommand_box">
            <div className="recommand_message" >
                <p>{filterMessage[0]}</p>
            </div>
        </div>
    );
}
export default RecommandChatText;
