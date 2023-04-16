import React, { useState } from "react";
import {  useNavigate , Link } from 'react-router-dom'
import axios from "axios";
import "../css/signup.css"


let state = "SUCCESS"
let idPattern = /^[a-z0-9_-]{5,20}$/;


const SignUp = ()=>{
    const [inputId, setInputId] = useState('');
    const [isDuplicated,setIsDuplicated]=useState(false);
    const [inputPw, setInputPw] = useState('');
    const [reInputPw, setReInputPw] = useState('');
    const [inputName, setInputName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate=useNavigate();

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
            const userId = {
                "userId": inputId
            }
            
            const res = await axios.post(
                "/doubleCheckID",
                userId
              );
            console.log(res.data);
            state = res.data["state"]
            if(state === "ID_POSSIBLE") {
                setIsDuplicated(false)
            } 
            else if(state === "ID_IMPOSSIBLE"){
                setIsDuplicated(true)
                setErrorMessage("이미 사용 중인 아이디입니다.");
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
        if (inputId.length===0) {
            setErrorMessage("필수 정보입니다.")
            setIsDuplicated(true)
            return
        } else if (!idPattern.test(inputId)) {
            setErrorMessage("5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.")
            setIsDuplicated(true)
            return
        }

        await checkIdDuplication(inputId);
        if(!isDuplicated) navigate("/");
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

                    <button type="submit" className="signup_button">회원가입</button>
                    
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