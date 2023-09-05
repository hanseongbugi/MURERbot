import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../css/intro.css"
import "../css/grid.min.css"
import { TypeAnimation } from 'react-type-animation';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import IntroLeftChatBubble from './screen/chatBubble/IntroLeftChatBubble';
import RightChatBubble from './screen/chatBubble/RightChatBubble';
import summaryImage from '../img/summary.png';
import recommendImage from '../img/recommend.png';



const Intro=()=>{
    const navigate = useNavigate();
    const [chatIndex, setChatIndex] = useState(0);
    const introTypeText = [
        // Same substring at the start will only be typed out once, initially
        '간단한 질문으로\n상품 정보를 얻어보세요.',
        1500,
        '',
        150,
        () => {
            setChatIndex(1)
          },
        '궁금했던 상품의\n리뷰 요약을 제공합니다.',
        2000,
        () => {
            setChatIndex(2)
          },
        '궁금했던 상품의\n리뷰 요약을 제공합니다.',
        2500,
        '',
        150,
        () => {
            setChatIndex(3)
          },
        '원하는 상품을\n추천 받아보세요.',
        2000, 
        ()=>{
            setChatIndex(4)
        },
        '원하는 상품을\n추천 받아보세요.',
        2500,
        '',
        150,
        () => {
            setChatIndex(0)
        }
      ]
    const animationElement= [
        <> 
            <Fade bottom appear exit spy={chatIndex} duration={1000}>
                <RightChatBubble message={'LG전자 그램16 16ZD90P-GX5BK 무게 알려줘'}/>
            </Fade>
            <Fade bottom appear exit spy={chatIndex} delay={400} duration={1000}>
                <IntroLeftChatBubble category={0} message={'무게 검색결과 무게은(는) 1.19Kg입니다.'} />
            </Fade>
        </>,
        <> 
            <Fade bottom appear spy={chatIndex} duration={1000}>
                <RightChatBubble message={'로지텍 페블 M350 마우스의 리뷰를 요약해줘'}/>
            </Fade>
            <Fade bottom appear spy={chatIndex} delay={400} duration={1000}>
                <IntroLeftChatBubble category={1} message={`상품의 리뷰에서 가장 많이 언급된 내용입니다!</br></br>긍정)</br>왜 이제삿나 싶을정도로 편해요 <mark>usb랑 블루투스 다 되니까 pc랑 노트북 같이쓸 수 잇어서 좋고 생긴것도 조약돌같이 귀여워요높이가 낮아서 걱정햇는데 불편한점은 없고 휴대성이 좋으니 가져다니기 좋을거같아요</mark> 무선최고ㅠㅠ (55.11%)</br></br>부정)</br> <mark>버튼감 무선 수신율 다좋음 다만 버튼키가 너무높게 디자인 되어있어서 손목 받침이 필요하고 손목받침 없이 검지로 휠을 돌리면 손목이 조금 불변해서 버티컬 사용 의미가 없는데 마우스가 그렇게 크지않아 작은손 사용에도 무리가 없으나 버튼이 너무 높게 설계되있네요</mark> 손목받침 쓰면 되지만 번거롭고 이질감이 생겨서 좀 그러네요 (15.92%)`} />
            </Fade>
        </>,
        <>
            <Zoom appear spy={chatIndex} duration={1000}>
                <div className='summary_img_box'>
                    <img src={summaryImage} alt="요약이미지" className='summary_img'/>
                </div>
            </Zoom>
        </>
        ,
        <> 
            <Fade bottom appear spy={chatIndex}  duration={1000}>
                <RightChatBubble  message={'저렴한 노트북 추천해줘'}/>
            </Fade>
            <Fade bottom appear spy={chatIndex} delay={400} duration={1000}>
                <IntroLeftChatBubble category={2} message={`'저렴한 노트북 추천해줘' 와 유사한 상품 리뷰가 많은 순서로 선정한 결과입니다.\n\n1위 (25 개 리뷰) : %=삼성전자 노트북 플러스2 NT550XDZ-AD1A=%\n2위 (24 개 리뷰) : %=삼성전자 노트북 플러스2 NT550XDA-K14A=%\n3위 (20 개 리뷰) : %=디클 클릭북 D14 Win11=%`} />
            </Fade>
        </>,
        <>
            <Zoom appear spy={chatIndex} duration={1000}>
                <div className='summary_img_box'>
                    <img src={recommendImage} alt="추천이미지" className='summary_img'/>
                </div>
            </Zoom>
        </>
    ]
    const loginClick=(e)=>{
        e.preventDefault();
        navigate('/login');
    }
    const signupClick=(e)=>{
        e.preventDefault();
        navigate('/signup');
    }
    return (
        <>
        <div className="intro_container">
            <div className="intro_page">
                    <div className="intro_title">
                        <h1>물어봇</h1>
                    </div>
            
                <div className='intro_content'>
                    <div className='intro_image'>
                        <div className='intro_chat_image'>
                            {animationElement[chatIndex]}
                        </div>
                    </div>
                    <div className='intro_content_col'>
                        <div className='intro_comment_box'>
                            <TypeAnimation
                            sequence={introTypeText}
                            omitDeletionAnimation={true}
                            wrapper="div"
                            speed={25}
                            className='intro_comment'
                            repeat={Infinity}/>
                        </div>
                
                        <div className='intro_button'>
                            <div className='login_box' onClick={(e)=>loginClick(e)}>
                                <div className='intro_button_text'>로그인</div>
                            </div>
                            <div className='signup_box' onClick={(e)=>signupClick(e)}>
                                <div className='intro_button_text'>회원가입</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='intro_license'>
                <div>Review Source From Naver</div>
            </div>
        </div>
        </>
    )
}

export default Intro;