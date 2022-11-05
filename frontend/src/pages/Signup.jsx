import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { authContext } from "../contexts/authContext"

const Signup = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [disabled, setDisabled] = useState(false)
    const { user, dispatch } = useContext(authContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (user.token) { // User is logged in
            navigate('/')
        }
    }, [user])

    if (user.token !== null) { // Only show signup form if the user isn't logged in
        return <div></div>
    }

    function onFormChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    async function onFormSubmit(e) {
        e.preventDefault()
        if (disabled) {
            return
        }

        const { username, password, confirmPassword } = form

        if (password !== confirmPassword) {
            setError("The passwords don't match")
            return
        }

        if (username.trim() === '') {
            setError('Username required')
            return
        }
        
        setDisabled(true)

        try {
            const response = await fetch('/api/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            const json = await response.json()
    
            if (!response.ok) {
                setError(json.error)
                setDisabled(false)
                return
            }

            localStorage.setItem('userToken', json)
            dispatch({
                type: 'LOGIN',
                user: {
                    token: json,
                    username: username.trim()
                }
            })
        }
        catch (err) {
            setError("Couldn't create the user")
        }

        setDisabled(false)
    }

    return (
        <div className="max-w-xs mx-auto text-center space-y-7 mt-3">
            <p className="text-2xl my-7 font-bold">Signup</p>
            { error && <p>{error}</p> }
            <form onSubmit={onFormSubmit} className="space-y-7">
                <input placeholder="Username"
                        name="username"
                        value={form.username}
                        onChange={onFormChange}
                        disabled={disabled}
                        required
                        className="border-solid border border-gray-700 px-2 py-1 rounded w-full"/>
                <input type="password"
                        placeholder="Password"
                        name="password"
                        value={form.password}
                        onChange={onFormChange}
                        disabled={disabled}
                        required
                        className="border-solid border border-gray-700 px-2 py-1 rounded w-full"/>
                <input type="password"
                        placeholder="Confirm password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={onFormChange}
                        disabled={disabled}
                        required
                        className="border-solid border border-gray-700 px-2 py-1 rounded w-full"/>
                <input type="submit"
                        value="Signup"
                        disabled={disabled}
                        className="px-2 py-1 bg-green-700 text-white rounded cursor-pointer"/>
            </form>
        </div>
    )
}

export default Signup