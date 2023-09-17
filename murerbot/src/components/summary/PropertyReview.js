import {FaUser, FaRegSadTear} from "react-icons/fa";
import "../../css/summary/summaryBook.css";
import React, {useState} from "react";

const PropertyReview = ({name, positiveSummary, negativeSummary}) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const emotionArray = ["전체", "긍정", "부정"]
    const clickEmotionButton = (e,index) => {
        e.preventDefault();
        setSelectedIndex(index)
    }

    return (
        <>
        {(positiveSummary[0] || positiveSummary[1] || negativeSummary[0] || negativeSummary[1]) ? 
        <div className="description">
            <p>※전체 긍정/부정 리뷰 중 <bold>대표 리뷰를 선정한 결과</bold>입니다.</p>
            <div className="emotion_buttons">
                {emotionArray.map((value, idx)=>idx!==emotionArray.length?
                    <button key={idx} onClick={(e) => clickEmotionButton(e,idx)} 
                        style={{backgroundColor: selectedIndex === idx ? '#252B48' : '#f5f5f5',
                        color: selectedIndex === idx ? '#ffffff' : '#000000'}}
                    >{value}</button>
                :null)}
            </div>
            
        </div>:null}
        

        {selectedIndex === 0 || selectedIndex === 1 ?
            <>
            {positiveSummary[0]?
            <><p className="positive_p"><strong>{`긍정`}</strong></p>
            <div className="user_review">
                <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:positiveSummary[0]}}/></div>
            </div>
            </>:null}
            {positiveSummary[1]?
            <>
            <div className="user_review">
                <div className="user_positive"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:positiveSummary[1]}}/></div>
            </div>
            </>:null}
            </>
        :null}

        {selectedIndex === 0 || selectedIndex === 2 ?
        <>
            {negativeSummary[0]?
            <><p className="negative_p"><strong>{`부정`}</strong></p>
            <div className="user_review">
                <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:negativeSummary[0]}}/></div>
            </div>
            </>:null}
            {negativeSummary[1]?
            <>
            <div className="user_review">
                <div className="user_negative"><FaUser className="faUser" size={20} color={"#ffffff"}/></div>
                <div className="sentiment_box"><p dangerouslySetInnerHTML={{__html:negativeSummary[1]}}/></div>
            </div>
            </>:null}
        </>
        :null}
        

        

        {(positiveSummary[0] || positiveSummary[1] || negativeSummary[0] || negativeSummary[1]) ? null:
        <div className="undefined_summary">
            <p>해당 상품은 {name} 속성 리뷰 요약을 제공하지 않습니다.</p><FaRegSadTear className="undefind_sad" size={30}/>
        </div>
        }
        </>
    );
}

export default PropertyReview;