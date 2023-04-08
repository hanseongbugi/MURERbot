import React, { useState } from "react";
import { Link } from 'react-router-dom'
import "../css/signup.css"

const SignUp = ()=>{
    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')
    const [reInputPw, setReInputPw] = useState('')
    const [inputName, setInputName] = useState('')

    const handleInputId = (e) => {
        setInputId(e.target.value)
    }
    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }
    const handleReInputPw = (e) => {
        setReInputPw(e.target.value)
    }
    const handleInputName = (e) => {
        setInputName(e.target.value)
    }

    const onClickSignUp = () => {
        console.log('click signup')
    }

    return (
        <div className="signup_div">
            <div className="signup_title_div">
                <h1>물어봇</h1>
            </div>
                <div className="signup_label_div"> 
                    <label htmlFor='input_id'>아이디</label>
                </div><br/>
                <input className="signup_input" type='text' name='input_id' placeholder="아이디를 입력하세요" value={inputId} onChange={handleInputId}/><br/>
                <div className="signup_label_div">
                    <label htmlFor='input_pw'>비밀번호</label>
                </div><br/>
                <input className="signup_input" type='password' name='input_pw' placeholder="비밀번호를 입력하세요" value={inputPw} onChange={handleInputPw}/><br/>
                <div className="signup_label_div">
                    <label htmlFor='input_pw'>비밀번호 확인</label>
                </div><br/>
                <input className="signup_input" type='password' name='reInput_pw' placeholder="비밀번호를 다시 입력하세요" value={reInputPw} onChange={handleReInputPw}/><br/>
                <div className="signup_label_div">
                    <label htmlFor='input_name'>이름</label>
                </div><br/>
                <input className="signup_input" type='text' name='input_name' placeholder="이름을 입력하세요" value={inputName} onChange={handleInputName}/><br/><br/>
            <Link to="/">
                <button className="signup_button" type='button' onClick={onClickSignUp}>회원가입</button>
            </Link>
            <div className="goto_login_div">
                <label className="goto_login_label">이미 계정이 있으신가요?</label>
                <Link className="goto_login" to="/">로그인</Link>
            </div>
    </div>
    )
}
export default SignUp;