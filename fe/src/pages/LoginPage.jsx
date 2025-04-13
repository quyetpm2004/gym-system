import Header from '../components/Header/Header'
import Login from '../components/Login/Login'
function LoginPage() {
    return (
        <div>
            <Header />
            <div className="container-fluid">
                    <div className="row flex-nowrap">
                        <Login/>
                    </div>
            </div>
        </div>
    )
}

export default LoginPage