import {FaUser, FaRegSadTear} from "react-icons/fa";
import "../../css/summary/summaryBook.css";
import React from "react";

const PropertyReview = ({name, positiveSummary, negativeSummary}) => {

    return (
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

        {(positiveSummary[0] && positiveSummary[1] && negativeSummary[0] && negativeSummary[1]) ? null:
        <div className="undefined_summary">
            <p>해당 상품은 {name} 속성 리뷰 요약을 제공하지 않습니다.</p><FaRegSadTear className="undefind_sad" size={30}/>
        </div>
        }
        </>
    );
}

export default PropertyReview;