import React, { useState }from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from "axios";
import "../css/login.css"
import "../css/grid.min.css"

let state = "SUCCESS"

const Login=()=>{
    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')
    const navigate = useNavigate()

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
                "/signInUser",
                userInfo
            );
            console.log(res.data);
            state = res.data["state"]
            if(state==="SIGNIN_SUCCESS")
                navigate("/Chat")
            else if(state === "SIGNIN_FAIL"){
                alert("로그인에 실패하였습니다.")
            }
        }catch (error) {
            console.error(error);
        }
    }
    const onClickLogin = () => {
        console.log('click login')
        sendLogin({inputId,inputPw}) //로그인 기능 활성화 시 주석 해제
        //navigate("/Chat")
    }

    return (
        <>
        <div className="container">
            <div className="login_page">
                <div className="login_title">
                    <div className="row">
                        <div className="col-12">
                            <h1>물어봇</h1>
                        </div>
                    </div>
                </div>

                <div className="input_group">
                    <div className="row">
                        <div className="col-12">
                            <input className="input_id" type='text' name='input_id' placeholder="아이디를 입력하세요" value={inputId} onChange={handleInputId}/>
                        </div>
                        
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <input className="input_pw" type='password' name='input_pw' placeholder="비밀번호를 입력하세요"value={inputPw} onChange={handleInputPw}/>
                        </div>
                    </div>
                </div>

                <div className="login_button">
                    <div className="row">
                        <div className="col-12">
                            <div>
                                <button type='button' onClick={onClickLogin}>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                <div className="goto_signup_div">
                    <div className="row">
                        <div className="col-7"></div>
                        <div className="col-2 goto_signup_line">
                            <div>
                                <Link className="goto_signup" to="/SignUp">회원가입</Link>
                            </div>
                        </div>
                        <div className="col-3"></div>
                    </div>
                </div>
            </div>

            
        </div>
        
        </>
    )
}

export default Login;