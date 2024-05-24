import './searchbar.css'

function searchbar() {
    const callDataByName = async ()=>{
        try{
            const res = await axios.post("http://127.0.0.1:3000/getDataByName",{
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
            })
            console.log(res.data.data)
        }
        catch(error){

        }
    }
    return (
        <>
            <div className="searchbar">
                <h3 style={{marginRight: 10}}>ID :</h3>
                <input type="text" />
                <h3 style={{marginLeft:20,marginRight: 10}}>NAME :</h3>
                <input type="text" />
                <h3 className='search-button'>search</h3>
            </div>

        </>
    )
}
export default searchbar