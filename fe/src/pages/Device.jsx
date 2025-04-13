import SideBar from '../components/SideBar/SideBar'
import Header from '../components/Header/Header'
import DeviceContent from '../components/DeviceContent/DeviceContent'
function Device() {
    return (
        <div>
            <Header />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <div className='col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark'>
                        <SideBar />
                    </div>
                    <div className='col'>
                        <DeviceContent/>
                    </div>
                </div>   
            </div>
        </div>
    )
}

export default Device