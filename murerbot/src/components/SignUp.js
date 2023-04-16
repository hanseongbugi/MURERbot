import React, { useState, useEffect } from "react";
import {  useNavigate , Link } from 'react-router-dom'
import axios from "axios";
import "../css/signup.css"


let state = "SUCCESS"
let idPattern = /^[a-z0-9_-]{5,20}$/;
let pwPattern = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

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
    const [sendServer,setSendServer]=useState(false);
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
        for (let i=0; i<inputName.length; i++)  { 
            let chk = inputName.substring(i,i+1); 
            if(chk.match(/[0-9]|[a-z]|[A-Z]/)) return false;
            
            if(chk.match(/([^가-힣\x20])/i))return false;
            
            if(chk===" ") return false
        }
        return true
    }

    useEffect(()=>{
        if(!isDuplicated&&!isPwError&&!isRePwError&&!isNameError&&buttonClick)
            setSendServer(true)
    },[isDuplicated,isPwError,isRePwError,isNameError,buttonClick])

    useEffect(()=>{
        const checkIdDuplication = async ({inputId,inputPw,inputName}) => {
            try {
                console.log(inputId, inputPw, inputName)
                
                const userInfo = {
                    "userId": inputId,
                    "userPw":inputPw,
                    "userName":inputName
                }
                
                const res = await axios.post(
                    "/doubleCheckID",
                    userInfo
                  );
                console.log(res.data);
                state = res.data["state"]
                if(state === "ID_POSSIBLE") {
                    navigate("/");
                } 
                else if(state === "ID_IMPOSSIBLE"){
                    setIsDuplicated(true)
                    setIDErrorMessage("이미 사용 중인 아이디입니다.");
                }
                else {
                    setButtonClick(false)
                    setSendServer(false)
                    // console.log("double check id: SEND FAIL")
                    alert("회원가입에 실패했습니다.")
                }
    
            } catch (error) {
                console.error(error);
            }
        }
        async function callBackFunc(){
            if(sendServer)
                await checkIdDuplication({inputId,inputPw,inputName});
        }
        console.log(sendServer)
        callBackFunc()
    },[sendServer,inputId,inputPw,inputName, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsDuplicated(false)
        setIsPwError(false)
        setIsRePwError(false)
        setIsNameError(false)
        setButtonClick(false)
        if (inputId.length===0) {
            setIDErrorMessage("필수 정보입니다.")
            setIsDuplicated(true)
        } else if (!idPattern.test(inputId)) {
            setIDErrorMessage("5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.")
            setIsDuplicated(true)
        }
        if(inputPw.length===0){
            setPWErrorMessage("필수 정보입니다.")
            setIsPwError(true)
        }
        if(!pwPattern.test(inputPw)){
            setPWErrorMessage("비밀번호는 8~15자이고 영문 대/소문자, 숫자, 특수기호 조합입니다")
            setIsPwError(true)
        }
        if(reInputPw.length===0){
            setRePWErrorMessage("필수 정보입니다.")
            setIsRePwError(true)
        }
        if(inputPw!==reInputPw){
            setRePWErrorMessage("비밀번호가 일치하지 않습니다.")
            setIsRePwError(true)
        }
        if(inputName.length===0){
            setNameErrorMessage("이름을 입력해주세요")
            setIsNameError(true)
        }
        if(!nameTest(inputName)){
            setNameErrorMessage("이름에 공백 또는 특수문자가 있습니다.")
            setIsNameError(true)
        }
        setButtonClick(true)
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
                    <input className="signup_input" type='text' name='input_id' placeholder="아이디를 입력하세요" value={inputId} onChange={handleInputId}/><br/>
                    {isDuplicated && <p className="error_message">{IDerrorMessage}</p>}
                    <div className="signup_label_div">
                        <label htmlFor='input_pw'>비밀번호</label>
                    </div><br/>
                    <input className="signup_input" type='password' name='input_pw' placeholder="비밀번호를 입력하세요" value={inputPw} onChange={handleInputPw}/><br/>
                    {isPwError && <p className="error_message">{PWerrorMessage}</p>}
                    <div className="signup_label_div">
                        <label htmlFor='input_pw'>비밀번호 확인</label>
                    </div><br/>
                    <input className="signup_input" type='password' name='reInput_pw' placeholder="비밀번호를 다시 입력하세요" value={reInputPw} onChange={handleReInputPw}/><br/>
                    {isRePwError && <p className="error_message">{rePWerrorMessage}</p>}
                    <div className="signup_label_div">
                        <label htmlFor='input_name'>이름</label>
                    </div><br/>
                    <input className="signup_input" type='text' name='input_name' placeholder="이름을 입력하세요" value={inputName} onChange={handleInputName}/><br/>
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