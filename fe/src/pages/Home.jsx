import SideBar from '../components/SideBar/SideBar'
import Header from '../components/Header/Header'
function Home() {
    return (
        <div>
            <Header />
            <div className="container-fluid">
                    <div className="row flex-nowrap">
                        <div className='col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark'><SideBar /></div>
                        <p className='col mt-4'>Chào mừng đến hệ thống quản lý phòng gym</p>
                    </div>
            </div>
        </div>
    )
}

export default Home