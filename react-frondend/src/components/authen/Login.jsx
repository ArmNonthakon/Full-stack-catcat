import './Login.css'
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Login() {
  const navigate = useNavigate();
  const submitData = async (event) => {
    event.preventDefault();
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    try {
      const response = await axios.post('/api/login', {
        email: email.value,
        password: password.value
      },);

      
      email.value = "";
      password.value = "";
      localStorage.setItem("token", response.data)
      document.getElementById("response-text").style.color = "green";
      document.getElementById("response-text").textContent = "Login success!!";
      const goToHome = setTimeout(() => {
        navigate(0)
      }, 3000);

    } catch (error) {
      console.error(error);
      document.getElementById("response-text").textContent = "*Email or Password incorrect";
    }
  };
  useEffect(() => {
    if (localStorage.getItem('token') != null) {
      navigate('/')
    }
  }, [])
  return (
    <>
      <div className='login'>
        <div id='block'>
          <form onSubmit={submitData}>
            <div id='container-login'>
              <h2>Login</h2>
              <div id='inner-topic'>
                <label htmlFor="">Email</label>
                <input type="text" id="email" />
                <label htmlFor="">Password</label>
                <input type="password" id="password" />
                <p id='response-text'></p>
              </div>
              <button type="submit">Login</button>
              <p>Or With</p>
              <div className='other-regis'>
                <a href=""><img src="/facebook.png" width="40px" alt="Facebook" /></a>
                <a href=""><img src="/search.png" width="40px" alt="Google" /></a>
                <a href=""><img src="/X.png" width="40px" alt="X" /></a>
              </div>
              <p>Don't have an account? <a href="/register">Sign up</a></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
