export default function Header() {
    return (
    <div className="container-fluid">
        <div className="row">
        <nav className="navbar navbar-light bg-light px-3">
            <a className="navbar-brand" href="/">GYM admin</a>
            <div className="dropdown">
                <a 
                    href="/" 
                    className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle" 
                    id="dropdownUser1" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    role="button"
                >
                    <img 
                        src="https://github.com/mdo.png" 
                        alt="user" 
                        width="30" 
                        height="30" 
                        className="rounded-circle"
                    />
                    <span className="d-none d-sm-inline mx-2">admin</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end text-small shadow" aria-labelledby="dropdownUser1">
                    <li><a className="dropdown-item" href="/">New project...</a></li>
                    <li><a className="dropdown-item" href="/">Settings</a></li>
                    <li><a className="dropdown-item" href="/">Profile</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="/">Sign out</a></li>
                </ul>
            </div>
        </nav>
        </div>
        
    </div>
    );
}
