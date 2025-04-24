import SideBar from '../components/SideBar/SideBar'
import Header from '../components/Header/Header'
import CustomerContent from '../components/CustomerContent/CustomerContent'
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
                        <CustomerContent/>
                    </div>
                </div>   
            </div>
        </div>
    )
}

export default Customer