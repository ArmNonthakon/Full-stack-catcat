import './blog.css'


function blog({ Name, Old, Describe,Breed ,Color,Gender,Pic}) {
    return (
        <>
            <div className="Blog">
                <h2>{Name}</h2>
                <div className='blog-img'>
                    <img src={Pic} width="100%" alt="" />
                </div>
                <div className='blog-topic'>
                    <h3>About me</h3>
                </div>
                
                <div className='blog-content'>
                    <div className='about-content'><span className='space'></span>{Describe}</div>
                    <p>Age: {Old} year old</p>
                    <p>Color: {Color}</p>
                    <p>Gender: {Gender}</p>
                    <p>Breed: {Breed}</p>
                </div>

            </div>

        </>
    )

}
export default blog