import "../../css/menu/welcomeChat.css"
import {Icon} from '@iconify/react';



const WelcomeChat = () => {
    



    return (
        <>
            <div className="welcome_chat">
                <div className="icons_div">
                    <div className="summarization_box">
                        <Icon icon="material-symbols:summarize-outline" height={45} color={"#585858"} name="summarization"/>
                        <label htmlFor="summarization">요약</label>
                    </div>
                    <div className="comparision_box">
                        <Icon icon="material-symbols:compare" height={45} color={"#585858"} name="comparision"/>
                        <label htmlFor="comparision">비교</label>
                    </div>
                    <div className="recommandation_box">
                        <Icon icon="material-symbols:recommend-outline" height={45} color={"#585858"} name="recommandation"/>
                        <label htmlFor="recommandation">추천</label>
                    </div>
                </div>
                <div className="description">
                    <p>
                       물어봇은 상품에 대한 리뷰를 기반으로 상품의 정보를 제공하는 서비스입니다.<br/>
                       원하는 상품에 대한 리뷰 요약, 비교를 해주며,<br/>
                       리뷰를 기반으로 추천을 해줄 수 있습니다!<br/>
                       원하시는 상품을 하단의 메세지 박스에 입력해주세요.<br/>
                    </p>
                </div>

            </div>
        
        </>
    )
}

export default WelcomeChat;