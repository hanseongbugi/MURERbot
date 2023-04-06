import React, { useState }from 'react'
import { Link } from 'react-router-dom'

function Login() {
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
    }

    return (
        <div>
            <h1>물어봇</h1>
            <div>
                <input type='text' name='input_id' value={inputId} onChange={handleInputId}/>
            </div>
            <div>
                <input type='password' name='input_pw' value={inputPw} onChange={handleInputPw}/>
            </div>
            <Link to="/Chat">
                <div>
                    <button type='button' onClick={onClickLogin}>Login</button>
                </div>
            </Link>
            <Link to="/SignUp">
                <div>
                    <a href="#">회원가입</a>
                </div>
            </Link>


        </div>
    )
}

export default Login;