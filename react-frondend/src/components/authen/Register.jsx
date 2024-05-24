import { useEffect, useState } from 'react'
import './Register.css'
import Navbar from '../navbar/navbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function Register() {
  const navigate = useNavigate();
  const [permisInput, setPermis] = useState(false)
  const [Email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [inputConfirmPass, setInputConfirm] = useState("")
  const [checkUppercase, setUppercase] = useState(false)
  const [checkSpecial, setSpecial] = useState(false)
  const [checkNumber, setNumber] = useState(false)
  const [confirmPass, setConfirmPass] = useState(false)
  const inputEmail = (event) => {
    var inputPass = event.target.value
    setPassword(inputPass)
  }
  const inputPassword = (event) => {
    var inputPass = event.target.value
    setPassword(inputPass)
  }
  const inputConfirmPassword = (event) => {
    var inputPass = event.target.value
    setInputConfirm(inputPass)
  }
  const submitData = async (event) => {
    event.preventDefault();
    var name = document.getElementById("name")
    var surname = document.getElementById("surname")
    var email = document.getElementById("email")
    if (checkNumber == true && checkSpecial == true && checkUppercase == true && confirmPass == true) {
      const res = await axios.post('/api/register', {
        name: name.value,
        surname: surname.value,
        email: email.value,
        password: password
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      name.value = ""
      surname.value = ""
      email.value = ""
      document.getElementById("password").value = ""
      document.getElementById("input-confirm-pass").value = ""
    }
    else {
      console.log("cannot submit")
    }

  }
  useEffect(() => {
    if (localStorage.getItem('token') != null) {
      navigate('/')
    }
    setSpecial(false)
    setUppercase(false)
    setNumber(false)
    for (let i = 0; i < password.length; i++) {
      var aciiPass = password.charCodeAt(i)
      if (aciiPass >= 65 && aciiPass <= 90) {
        setUppercase(true)
      }
      if ((aciiPass >= 33 && aciiPass <= 47) || (aciiPass >= 58 && aciiPass <= 64) || (aciiPass >= 91 && aciiPass <= 96) || (aciiPass >= 123 && aciiPass <= 126)) {
        setSpecial(true)
      }
      if (aciiPass >= 48 && aciiPass <= 57) {
        setNumber(true)
      }
    }
    if (password == inputConfirmPass) {
      setConfirmPass(true)
    }
    else {
      setConfirmPass(false)
    }

  })
  return (
    <>
      <div className='register'>
        <div id='block'>
          <form onSubmit={submitData} >
            <div id='container-login'>
              <h2>Register</h2>
              <div id='inner-topic'>
                <label htmlFor="">Name</label>
                <input type="text" name="" id="name" />
                <label htmlFor="">Surname</label>
                <input type="text" name="" id="surname" />
                <label htmlFor="">Email</label>
                <input type="text" name="" id="email" />
                <label htmlFor="">Password</label>
                <input type="password" name="" id="password" onKeyUpCapture={inputPassword} />
                <label htmlFor="">Confirm password</label>
                <input type="password" name="" id="input-confirm-pass" onKeyUpCapture={inputConfirmPassword} />
              </div>

              <button>Sign up</button>
              <p>Or With</p>
              <div className='other-regis'>
                <a href=""><img src="/facebook.png" width="40px" alt="Facebook" /></a>
                <a href=""><img src="/search.png" width="40px" alt="Google" /></a>
                <a href=""><img src="/X.png" width="40px" alt="X" /></a>
              </div>
              <p>Already have account? <a href="/login">Login</a></p>
            </div>

          </form>
        </div>
      </div>

    </>
  )
}

export default Register
