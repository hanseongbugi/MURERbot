import React, { useState } from "react";
import { Link } from 'react-router-dom'

function SignUp(){
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
        <div>
        <h1>물어봇</h1>
        <div>
            <label htmlFor='input_id'>ID</label><br/>
            <input type='text' name='input_id' value={inputId} onChange={handleInputId}/>
        </div>
        <div>
            <label htmlFor='input_pw'>PW </label><br/>
            <input type='password' name='input_pw' value={inputPw} onChange={handleInputPw}/>
        </div>
        <div>
            <label htmlFor='input_pw'>PW Check</label><br/>
            <input type='password' name='reInput_pw' value={reInputPw} onChange={handleReInputPw}/>
        </div>
        <div>
            <label htmlFor='input_name'>Name</label><br/>
            <input type='text' name='input_name' value={inputName} onChange={handleInputName}/><br/><br/>
        </div>
        <Link to="/">
            <div>
                <button type='button' onClick={onClickSignUp}>회원가입</button>
            </div>
        </Link>
    </div>
    )
}
export default SignUp;