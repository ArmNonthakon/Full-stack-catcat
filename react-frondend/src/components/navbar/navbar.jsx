import { useEffect, useState } from "react"
import "./navbar.css"
import axios from "axios"
import { Navigate, useNavigate, useLocation } from "react-router-dom"
function Navbar({ Path }) {
    const [showMenuState, setShowMenuState] =useState(false)
    const logout = () => {
        const logout = document.getElementById('authenLogout')
        localStorage.removeItem('token')
        logout.style.display = "none"

    }
    const showMenu = ()=>{
        let menu = document.getElementById('mobile-menu')
        if(showMenuState == false){
            menu.style.display = "flex"
            setShowMenuState(true)
        }
        else{
            menu.style.display = "none"
            setShowMenuState(false)
        }
        
    }
    const checkPath = () => {
        if (Path == "/") {
            const home = document.getElementById('Home')
            home.style.cssText = "margin-bottom: 7px;border-bottom: 3px solid rgba(0, 0, 0, 0.73);text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.741);color: rgba(0, 0, 0, 0.837);"
        }
        else if (Path == "/manage") {
            const manage = document.getElementById('Manage')
            manage.style.cssText = "margin-bottom: 7px;border-bottom: 3px solid rgba(0, 0, 0, 0.73);text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.741);color: rgba(0, 0, 0, 0.837);"
        }
        else {
            console.log('Login and Register');
        }
    }
    useEffect(() => {
        const logout = document.getElementById('authenLogout')
        const authen = document.getElementById('authen')

        if (localStorage.getItem('token') != null) {
            authen.style.display = "none"
            logout.style.display = "flex"
            checkPath()
        }
        else {
            authen.style.display = "flex"
            logout.style.display = "none"
            checkPath()
        }

    })
    return (
        <>
            <nav>
                
                <a id="Home" href="/">HOME</a>
                <a id="Manage" href="/manage">MANAGE DATA</a>
                <img src="/cat (1).png" width="68px" alt="" />
                <a href="/">ABOUT ME</a>
                <div id="authen" className="section-authen">
                    <a href="/login">LOGIN</a>
                    <a className="a-register" href="/register"><button >REGISTER</button></a>

                </div>
                <a href="/login" id="authenLogout" className="logout-button" onClick={logout}>LOGOUT</a>
                <img src="/list.png" width="37px" className="menuPic" onClick={showMenu} alt="" />
            </nav>
            <div className="mobile-menu" id="mobile-menu">
                <div>
                    <img src="/list.png" width="37px" onClick={showMenu} alt="" />
                </div>
                
                <div>
                    <a id="Home" href="/">HOME</a>
                </div>
                <div>
                    <a id="Manage" href="/manage">MANAGE DATA</a>
                </div>
                <div id="authen" class="section-authen">
                    <a href="/login">LOGIN</a>
                    <a className="a-register" href="/register"><button >REGISTER</button></a>
                </div>
                <div className="sec-logout">
                     <a href="/login" id="authenLogout" className="logout-button" onClick={logout}>LOGOUT</a>
                </div>
               
            </div>

        </>
    )
}

export default Navbar