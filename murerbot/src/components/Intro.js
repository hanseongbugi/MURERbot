import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../css/intro.css"
import "../css/grid.min.css"
import { TypeAnimation } from 'react-type-animation';


const Intro=()=>{
    const navigate = useNavigate();
    const introTypeText = [
        // Same substring at the start will only be typed out once, initially
        '물어봇은\n리뷰 기반 챗봇 서비스 입니다',
        1000, 
        '',
        100,
        '궁금했던 상품의\n상세 정보와 리뷰 요약을 제공합니다',
        1000,
        '',
        100,
        '간단한 질문으로\n추천 상품을 얻어보세요',
        1000,
        '',
        100
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
                        <div>이미지</div>
                    </div>
                    <div className='intro_content_col'>
                        <div className='intro_comment_box'>
                            <TypeAnimation
                            sequence={introTypeText}
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