import React, { useState } from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import "../css/signup.css"


let state = "SUCCESS"
let idPattern = /^[a-z0-9_-]{5,20}$/;


const SignUp = ()=>{
    const [inputId, setInputId] = useState('')
    var isDuplicated = false;
    const [inputPw, setInputPw] = useState('')
    const [reInputPw, setReInputPw] = useState('')
    const [inputName, setInputName] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

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

    const checkIdDuplication = async (inputId) => {
        try {
            isDuplicated = {
                "userId": inputId
            }
            
            const res = await axios.post(
                "/doubleCheckID",
                isDuplicated
              );
            console.log(res.data);
            state = res.data["state"]
            if(state === "ID_POSSIBLE") {
                isDuplicated = true;
                setErrorMessage("이미 사용 중인 아이디입니다.");
            } 
            else if(state === "ID_IMPOSSIBLE"){
                isDuplicated = false;
            }
            else {
                console.log("double check id: SEND FAIL")
            }

        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputId) {
            setErrorMessage("필수 정보입니다.")
            return;
        } else if (!idPattern.test(inputId)) {
            setErrorMessage("5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.")
            return;
        }

        await checkIdDuplication(inputId);
    }
    
    const onClickSignUp = (e) => {
        if (isDuplicated) {
            e.preventDefault();
        }
        console.log('click signup')
        if(inputId.length===0){
            alert("아이디를 입력해주세요.");
            e.preventDefault();
            return;
        }
        if(inputPw.length===0){
            alert("비밀번호를 입력해주세요.");
            e.preventDefault();
            return;
        }
        if(reInputPw.length===0){
            alert("비밀번호를 확인해주세요.");
            e.preventDefault();
            return;
        }
        if(inputPw!==reInputPw){
            alert("비밀번호와 비밀번호 확인이 다릅니다.");
            e.preventDefault();
            return;
        }
        if(inputName.length===0){
            alert("이름을 입력해주세요.");
            e.preventDefault();
            return;
        }
    }

    return (
        <>
        <div className="signup_page">
            <div className="signup_div">
                <div className="signup_title_div">
                    <h1>물어봇</h1>
                </div>
                <form onSubmit={handleSubmit}>
                <div className="signup_label_div"> 
                    <label htmlFor='input_id'>아이디</label>
                    </div><br/>
                    {isDuplicated && <p style={{color: "red" }}>{errorMessage}</p>}
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
                    <Link to="/" onClick={onClickSignUp}>
                        <button type="submit" className="signup_button">회원가입</button>
                    </Link>
                </form>
                   
                <div className="goto_login_div">
                    <label className="goto_login_label">이미 계정이 있으신가요?</label>
                    <Link className="goto_login" to="/">로그인</Link>
                </div>
            </div>
        </div>
        
        </>
        
    )
}
export default SignUp;