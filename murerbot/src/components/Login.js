import React, { useState }from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import "../css/login.css"
import "../css/grid.min.css"

const Login=()=>{
    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')

    const handleInputId = (e) => {
        setInputId(e.target.value)
    }
    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }

    const onClickLogin = () => {
        console.log('click login')
        sendLoginInfo2Server()
    }

    async function sendLoginInfo2Server() { // 로그인
        try{
            const inputData =  {"userId":inputId, "userPw":inputPw}
            const res = await axios.post(
                "/signInUser",
                inputData
            );

            let state = res.data["state"] // 서버 처리 결과
            if (state == "SIGNIN_SUCCESS") {// 로그인 성공
                console.log("로그인 성공")
                console.log(res.data["nickname"]+"님 환영합니다.")
            }
            else if (state == "SIGNIN_FAIL") // 로그인 실패
                console.log("로그인 실패")
            else // 서버 문제
                console.log("서버 문제")
        
        } catch(e) {
            console.error(e)
        }
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
                            <Link to="/Chat">
                                <div>
                                    <button type='button' onClick={onClickLogin}>Login</button>
                                </div>
                            </Link>
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