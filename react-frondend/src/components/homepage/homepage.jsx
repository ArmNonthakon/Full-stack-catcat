import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/navbar.jsx';
import Searchbar from './searchbar/searchbar.jsx';
import Blog from './blog/blog.jsx';
import Footer from '../footer/footer.jsx';
import './homepage.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
function Homepage() {
    const navigate = new useNavigate()
    const [data, setData] = useState([]);
    const [state, setState] = useState('default')
    const [checkList, setList] = useState(false)
    const callApi = async () => {
        let resError = document.getElementById('error-text')
        try {
            const res = await axios.get("/api/getData", {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            setData(res.data.data);
            resError.textContent = ""
            resError.style.display = "none"
        } catch (error) {
            document.getElementById('error-text').textContent = "Request failed with status code 400"
        }
    };
    const callDataByName = async (event) => {
        event.preventDefault()
        const name = document.getElementById('inputName')
        const id = ""
        if (id != "" && name.value != "") {
            try {
                const res = await axios.post("/api/getDataByName", {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })

            }
            catch (error) {
                console.log(error)
            }
        }
        else if (name.value != "") {
            try {
                const res = await axios.post("/api/getDataByName", {
                    name: name.value
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                setData(res.data.data)
                setState('nameData')
                name.value = ""

            }
            catch (error) {
                console.log(error)
            }
        }
        else {
            console.log("error")
        }

    }
    const showCategory = () => {
        const list = document.getElementById('list')
        const categoryBlock = document.getElementById('category')
        if (checkList == false) {
            setList(true)
            
            categoryBlock.style.display = "block"

        }
        else if (checkList == true) {
            setList(false)
            categoryBlock.style.display = "none"
        }

    }
    const getCategory = async () => {
        const gender = ["Male", "Female"]
        const color = ["White", "Black", "Grey", "Orange", "Brown", "Cream"]
        const min = document.getElementById('min').value
        const max = document.getElementById('max').value
        let resultGender = []
        let resultColor = []
        const resultAge = [parseInt(min), parseInt(max)]
        gender.forEach(element => {
            if (document.getElementById(element).checked != false) {
                resultGender.push(element)
            }
        });
        color.forEach(element => {
            if (document.getElementById(element).checked != false) {
                resultColor.push(element)
            }
        });
        try {
            const res = await axios.post("/api/getDataByCategory", {
                Gender: resultGender,
                Color: resultColor,
                Age: resultAge,

            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            console.log(res.data.data)
            setData(res.data.data)
            setState('categoryData')
        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {

        if (localStorage.getItem('token') != null && state == "default") {
            callApi();
        }
        else if (localStorage.getItem('token') != null && state == "nameData") {
            console.log("Show data by name now")
        }
        else if (localStorage.getItem('token') != null && state == "categoryData") {
            console.log("Show data by category now")
        }
        else {
            navigate('/login')
        }

    }, []);

    return (
        <>
            <form action="" onSubmit={callDataByName}>
                <div className='searchbar'>
                    <div className='group-search-sorting'>
                        <div className='wrapper'>
                            <input type="text" id='inputName' placeholder="Input cat name" />
                            <button >search</button>
                            <img className='searchPic' src="/search (1).png" alt="" />
                        </div>
                        <img className='sorting'  src="/sort.png" id='list' onClick={showCategory} alt="" />
                    </div>

                </div>
            </form>
            <div className='category' id='category'>
                <h4>Gender</h4>
                <div className='contain-category'>
                    <div className='item-category'>
                        <label htmlFor="">Male</label>
                        <input type="checkbox" name="" id="Male" value="male" />
                    </div>
                    <div className='item-category'>
                        <label htmlFor="">Female</label>
                        <input type="checkbox" name="" id="Female" value="female" />
                    </div>

                </div>
                <h4>Color</h4>
                <div className='contain-category'>
                    <div className='item-category'>
                        <label htmlFor="" >White</label>
                        <input type="checkbox" name="" id="White" value="white" />
                    </div>
                    <div className='item-category'>
                        <label htmlFor="">Black</label>
                        <input type="checkbox" name="" id="Black" value="black" />
                    </div>
                    <div className='item-category'>
                        <label htmlFor="">Grey</label>
                        <input type="checkbox" name="" id="Grey" value="grey" />
                    </div>
                    <div className='item-category'>
                        <label htmlFor="">Orange</label>
                        <input type="checkbox" name="" id="Orange" value="orange" />
                    </div>
                    <div className='item-category'>
                        <label htmlFor="">Brown</label>
                        <input type="checkbox" name="" id="Brown" value="brown" />
                    </div>
                    <div className='item-category'>
                        <label htmlFor="">Cream</label>
                        <input type="checkbox" name="" id="Cream" value="cream" />
                    </div>
                </div>
                <h4>Age</h4>
                <div className='contain-category-age'>
                    <input type="text" placeholder='MIN' id='min' />
                    <h4 style={{ margin: "0px 5px" }}>-</h4>
                    <input type="text" name="" placeholder='MAX' id="max" />
                </div>
                <div className='button-category'>
                    <button onClick={getCategory}>SUBMIT</button>
                </div>

            </div>

            <div className='error'>
                <h1 id='error-text'></h1>
            </div>
            <div className='blog-container'>


                {data.map((item, index) => (
                    <Blog key={index} Name={item.Name} Old={item.Old} Describe={item.Describe} Breed={item.Breed} Color={item.Color} Gender={item.Gender} Pic={item.Pic} />
                ))}
            </div>
        </>
    );
}

export default Homepage;
