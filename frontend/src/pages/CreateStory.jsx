import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { authContext } from "../contexts/authContext"

const CreateStory = () => {
    const [form, setForm] = useState({
        title: '',
        firstEntry: '',
    })
    const [error, setError] = useState('')
    const [disabled, setDisabled] = useState(false)
    const { user, dispatch } = useContext(authContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (user.token === null) { // User is not logged in
            navigate('/')
        }
    }, [user])

    if (!user.token) { // Only show the form if the user is logged in
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

        const { title, firstEntry } = form

        if (title.trim() === '') {
            setError('Title required')
            return
        }
        if (firstEntry.trim() === '') {
            setError('First entry required')
            return
        }
        
        setDisabled(true)

        try {
            const response = await fetch('/api/story/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ title, firstEntry })
            })
            const json = await response.json()
    
            if (!response.ok) {
                if (json.error === 'Invalid authorization') {
                    dispatch({
                        type: 'LOGOUT'
                    })
                    return
                }
                setError(json.error)
                setDisabled(false)
                return
            }

            navigate(`/view-story/${json._id}`)
        }
        catch (err) {
            setError("Couldn't login the user")
            setDisabled(false)
        }
    }

    return (
        <div className="max-w-xs mx-auto text-center space-y-7 mt-3">
            <p className="text-2xl my-7 font-bold">Create story</p>
            { error && <p>{error}</p> }
            <form onSubmit={onFormSubmit} className="space-y-7">
                <input placeholder="Title"
                        name="title"
                        value={form.title}
                        onChange={onFormChange}
                        disabled={disabled}
                        required
                        className="border-solid border border-gray-700 px-2 py-1 rounded w-full"/>
                <textarea placeholder="First entry"
                        name="firstEntry"
                        value={form.firstEntry}
                        onChange={onFormChange}
                        disabled={disabled}
                        required
                        className="border-solid border border-gray-700 px-2 py-1 rounded w-full"
                        rows="10"></textarea>
                <input type="submit"
                        value="Create story"
                        disabled={disabled}
                        className="px-2 py-1 bg-green-700 text-white rounded cursor-pointer"/>
            </form>
        </div>
    )
}

export default CreateStory