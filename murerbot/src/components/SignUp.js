import React, { useState, useEffect } from "react";
import {  useNavigate , Link } from 'react-router-dom'
import axios from "axios";
import "../css/signup.css"


let state = "SUCCESS"
let idPattern = /^[a-z0-9_-]{5,20}$/;
let pwPattern = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z]).*$/;

const SignUp = ()=>{
    const [inputId, setInputId] = useState('');
    const [inputPw, setInputPw] = useState('');
    const [reInputPw, setReInputPw] = useState('');
    const [inputName, setInputName] = useState('');
    const [IDerrorMessage, setIDErrorMessage] = useState('');
    const [PWerrorMessage, setPWErrorMessage] = useState('');
    const [rePWerrorMessage, setRePWErrorMessage] = useState('');
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [isDuplicated,setIsDuplicated]=useState(false);
    const [isPwError,setIsPwError]=useState(false);
    const [isRePwError,setIsRePwError]=useState(false);
    const [isNameError,setIsNameError]=useState(false);
    const [buttonClick,setButtonClick]=useState(false);
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

    const nameTest=(inputName)=>{
        if(inputName.length<2||inputName.length>10)return false
        for (let i=0; i<inputName.length; i++)  { 
            let chk = inputName.substring(i,i+1); 

            if(chk===" ") return false
        }
        return true
    }

    const checkIdDuplication = async (e) => {
        try {
            setIsDuplicated(false)
            if (inputId.length===0) {
                setIDErrorMessage("필수 정보입니다.")
                setIsDuplicated(true)
                return
            } else if (!idPattern.test(inputId)) {
                setIDErrorMessage("5~20자의 영문 소문자, 숫자만 사용 가능합니다.")
                setIsDuplicated(true)
                return
            }
            const userInfo = {
                "userId": inputId
            }
            
            const res = await axios.post(
                "/doubleCheckID",
                userInfo
              );
            state = res.data["state"]
            if(state === "POSSIBLE") {
                //성공하였을 경우
                setIsDuplicated(false)
            } 
            else if(state === "IMPOSSIBLE"){
                setIsDuplicated(true)
                setIDErrorMessage("이미 사용 중인 아이디입니다.");
            }

        } catch (error) {
            console.error(error);
        }
    }
    const checkPwError=()=>{
        setIsPwError(false)
        if(inputPw.length===0){
            setPWErrorMessage("필수 정보입니다.")
            setIsPwError(true)
        }
        else if(!pwPattern.test(inputPw)){
            setPWErrorMessage("8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.")
            setIsPwError(true)
        }
    }
    const checkRePwError=()=>{
        setIsRePwError(false)
        if(reInputPw.length===0){
            setRePWErrorMessage("필수 정보입니다.")
            setIsRePwError(true)
        }
        else if(inputPw!==reInputPw){
            setRePWErrorMessage("비밀번호가 일치하지 않습니다.")
            setIsRePwError(true)
        }
    }
    const checkNameError=()=>{
        setIsNameError(false)
        if(inputName.length===0){
            setNameErrorMessage("필수 정보입니다.")
            setIsNameError(true)
        }else if(!nameTest(inputName)){
            setNameErrorMessage("공백없이 2~10자를 입력하세요.")
            setIsNameError(true)
        }
    }
    const registerUser= async ()=>{
        try {
            const userInfo = {
                "userId": inputId,
                "userPw":inputPw,
                "userNickname":inputName
            }
            
            const res = await axios.post(
                "/registerNewUser",
                userInfo
              );
            state = res.data["state"]
            if(state === "SIGNUP_SUCCESS") {
                //성공하였을 경우
                setButtonClick(true)
            } 
            else if(state==="SIGNUP_FAIL"){
                alert("회원가입에 실패 하였습니다.")
            }

        } catch (error) {
            console.error(error);
        }
    }
    const handleSubmit=(e)=>{
        e.preventDefault()
        if(isDuplicated||isNameError||isPwError||isRePwError)return;
        registerUser()
    }
    useEffect(()=>{
        if(buttonClick) navigate("/")
    },[buttonClick,navigate])

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
                    <input className="signup_input" type='text' name='input_id' placeholder="아이디를 입력하세요" onBlur={checkIdDuplication} value={inputId} onChange={handleInputId}/><br/>
                    {isDuplicated && <p className="error_message">{IDerrorMessage}</p>}
                    <div className="signup_label_div">
                        <label htmlFor='input_pw'>비밀번호</label>
                    </div><br/>
                    <input className="signup_input" type='password' name='input_pw' placeholder="비밀번호를 입력하세요" onBlur={checkPwError} value={inputPw} onChange={handleInputPw}/><br/>
                    {isPwError && <p className="error_message">{PWerrorMessage}</p>}
                    <div className="signup_label_div">
                        <label htmlFor='input_pw'>비밀번호 확인</label>
                    </div><br/>
                    <input className="signup_input" type='password' name='reInput_pw' placeholder="비밀번호를 다시 입력하세요" onBlur={checkRePwError} value={reInputPw} onChange={handleReInputPw}/><br/>
                    {isRePwError && <p className="error_message">{rePWerrorMessage}</p>}
                    <div className="signup_label_div">
                        <label htmlFor='input_name'>닉네임</label>
                    </div><br/>
                    <input className="signup_input" type='text' name='input_name' placeholder="닉네임을 입력하세요" onBlur={checkNameError} value={inputName} onChange={handleInputName}/><br/>
                    {isNameError? <p className="error_message">{nameErrorMessage}</p>:<br/>}
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