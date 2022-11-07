import { useContext } from "react"
import { Link } from "react-router-dom"
import { authContext } from "../contexts/authContext"

const Home = () => {
    const { user } = useContext(authContext)

    if (user.token === undefined) {
        return null
    }

    return (
        <div>
            <h1 className="font-bold text-3xl text-center my-7">Stories taken forward</h1>
            <div className="my-7 flex justify-center gap-3">
                <Link to="/stories"
                    className="px-2 py-1 bg-green-700 text-white rounded cursor-pointer">View stories</Link>
                { user.token && (
                    <Link to="/create-story"
                            className="px-2 py-1 bg-green-700 text-white rounded cursor-pointer">Create new story</Link>
                ) }
            </div>
        </div>
    )
}

export default Home