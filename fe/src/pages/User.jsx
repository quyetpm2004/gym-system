import SideBar from '../components/SideBar/SideBar'
import Header from '../components/Header/Header'
import UserContent from '../components/UserContent/UserContent'
function Customer() {
    return (
        <div>
            <Header />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <div className='col-auto col-md-3 col-xl-2 px-sm-2 px-0'>
                        <SideBar />
                    </div>
                    <div className='col'>
                        <UserContent/>
                    </div>
                </div>   
            </div>
        </div>
    )
}

export default Customer