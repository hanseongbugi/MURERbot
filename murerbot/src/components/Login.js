import React, { useState, useEffect }from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from "axios";
import "../css/login.css"
import "../css/grid.min.css"
import { BiArrowBack } from "react-icons/bi";

let state = "SUCCESS"

const Login=()=>{
    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')
    const navigate = useNavigate()
    useEffect(()=>{
        sessionStorage.clear();
    })
    const handleInputId = (e) => {
        setInputId(e.target.value)
    }
    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }
    const sendLogin= async ({inputId,inputPw})=>{
        try {
            const userInfo = {
                "userId": inputId,
                "userPw":inputPw,
            }
        
            const res = await axios.post(
                `${inputId}/signin`,
                userInfo
            );
            state = res.data["state"]
            const nickName=res.data["nickname"]
            const log = res.data["log"]
            const bookmark = res.data["bookmark"]
            sessionStorage.clear();
            sessionStorage.setItem('auth',inputId)
            if(state==="SIGNIN_SUCCESS")
                navigate("/Chat",{ state: {userId:inputId, nickName:nickName, log:log, bookmark:bookmark}})
            else if(state === "SIGNIN_FAIL" || state === "FALLBACK"){
                alert("로그인에 실패하였습니다.")
            }
        }catch (error) {
            alert("로그인에 실패하였습니다.")
        }
    }
    const onClickLogin = (e) => {
        e.preventDefault();
        sendLogin({inputId,inputPw}) //로그인 기능 활성화 시 주석 해제
        //navigate("/Chat")
    }
    const onEnterLogin = (e)=>{
        //e.preventDefault()
        if(e.key==='Enter'){
            if(inputId.length===0||inputPw.length===0) return;
            e.preventDefault();
            sendLogin({inputId,inputPw})
        }
    }
    const onClickBack = (e)=>{
        e.preventDefault();
        navigate('/');
    }

    return (
        <>
        <div className='back_box'>
            <BiArrowBack className='back_button' size={40} onClick={(e)=>onClickBack(e)}></BiArrowBack>
        </div>
        <div className="container">
            <div className="login_page">
                <div className="login_title">
                    <div className="row">
                        <div className="col-12">
                            <h1 onClick={(e)=>onClickBack(e)}>물어봇</h1>
                        </div>
                    </div>
                </div>
            <div className='login_white_box'>
                <div className='login_comment'>
                    <div>로그인</div>
                </div>
                <div className="input_group">
                    <div className="row">
                        <div className="col-12">
                            <input className="input_id" type='text' name='input_id' placeholder="아이디를 입력하세요" value={inputId} 
                            onChange={handleInputId} onKeyDown={onEnterLogin}/>
                        </div>
                        
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <input className="input_pw" type='password' name='input_pw' placeholder="비밀번호를 입력하세요"
                            value={inputPw} onChange={handleInputPw} onKeyDown={onEnterLogin}/>
                        </div>
                    </div>
                </div>

                <div className="login_button">
                    <div className="row">
                        <div className="col-12">
                            <div>
                                <button type='button' onClick={(e)=>onClickLogin(e)}>Login</button>
                            </div>
                            <div className='goto_signup_div'>
                                <Link className="goto_signup" to="/SignUp">회원가입</Link>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            </div>
            
        </div>
        
        </>
    )
}

export default Login;