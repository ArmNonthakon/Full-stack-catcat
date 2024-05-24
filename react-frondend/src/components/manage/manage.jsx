import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import axios from "axios";
import "./manage.css"
function Manage() {
    const [data, setData] = useState([]);
    const callApi = async () => {
        try {

            const res = await axios.get("/api/getData", {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            setData(res.data.data)

        } catch (error) {
        }
    };
    const addData = async () => {
        const name = document.getElementById('name')
        const describe = document.getElementById('describe')
        const breed = document.getElementById('breed')
        const old = document.getElementById('old')
        const color = document.getElementById('color')
        const gender = document.getElementById('gender')
        const pic = document.getElementById('pic')
        try {
            const res = await axios.post("/api/addData", {
                name: name.value,
                describe: describe.value,
                breed: breed.value,
                old: parseInt(old.value),
                color: color.value,
                gender: gender.value,
                pic: pic.value
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            name.value = ""
            describe.value = ""
            breed.value = ""
            old.value = ""
            color.value = ""
            gender.value = ""
            pic.value = ""
            callApi()
        } catch (error) {
            console.log(error)
        }
    }
    const deleteData = async (ID) => {
        try {
            const res = await axios.delete("/api/deleteData/"+ID, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            console.log(res.data.data)
            callApi()
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        callApi();



    }, []);
    return (
        <>
            <div className="manage">
                <div>
                    <p className="add-topic"></p>
                    <div className="add-sec">
                        <div>
                            <label htmlFor="">Name: </label>
                            <input type="text" id="name" />
                        </div>
                        <div>
                            <label htmlFor="">Describe :</label>
                            <input type="text" id="describe" />
                        </div>
                        <div>
                            <label htmlFor="">Breed :</label>
                            <input type="text" id="breed" />
                        </div>
                        <div>
                            <label htmlFor="">Old :</label>
                            <input type="text" id="old" />
                        </div>
                        <div className="add-sec">
                            <div>
                                <label htmlFor="">Color :</label>
                                <input type="text" id="color" />
                            </div>
                            <div>
                                <label htmlFor="">Gender :</label>
                                <input type="text" id="gender" />
                            </div>
                            <div>
                                <label htmlFor="">Pic :</label>
                                <input type="text" id="pic" />
                            </div>
                        </div>

                    </div>
                    <div className="add-button-sec">
                        <button className="addButton" onClick={addData}>Add Data</button>
                    </div>
                </div>

                <div className="manage-topic">
                    <p>All data</p>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Breed</th>
                            <th>Old</th>
                            <th>Color</th>
                            <th>Gender</th>
                            <th className="td-button"></th>
                            <th className="td-button"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td id={"ID" + index}>{item.ID}</td>
                                <td>{item.Name}</td>
                                <td>{item.Breed}</td>
                                <td>{item.Old}</td>
                                <td>{item.Color}</td>
                                <td>{item.Gender}</td>
                                <td className="td-button"><button className="updateButton">Update</button></td>
                                <td className="td-button"><button className="deleteButton" onClick={() => deleteData(item.ID)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>


        </>
    )
}

export default Manage