import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Homepage from './components/homepage/homepage';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Login from './components/authen/Login';
import Register from './components/authen/Register';
import Footer from './components/footer/footer';
import Cookies from 'js-cookie';
import Manage from './components/manage/manage';
import Navbar from './components/navbar/navbar';
import { useLocation } from 'react-router-dom';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  }
  ,
  {
    path: "/manage",
    element: <Manage />,
  }
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <div class="main">
      <Navbar Path={router.window.location.pathname}/>  
      <div class="content">
        <RouterProvider router={router} />
      </div>
      <footer class="Footer">
        <Footer></Footer>
      </footer>
    </div>


  </>

);
