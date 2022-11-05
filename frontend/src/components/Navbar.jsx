import { useContext } from "react"
import { Link } from "react-router-dom"
import { authContext } from "../contexts/authContext"

const Navbar = () => {
    const { user, dispatch } = useContext(authContext)
    
    function logout() {
        localStorage.removeItem('userToken')
        dispatch({
            type: 'LOGOUT'
        })
    }

    return (
        <nav className="p-2 bg-green-700 text-white flex justify-between">
            <Link to="/">Branching stories</Link>
            { user.token && (
                <div className="flex gap-3">
                    <Link to="/">{ user.username }</Link>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
            { user.token === null && (
                <div className="flex gap-3">
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar