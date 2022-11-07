import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { authContext } from "../contexts/authContext"

// https://stackoverflow.com/a/7134394

const AddEntryToStory = ({ story, setStory, entries, setEntries, setPath, onCancel, disabled, setDisabled }) => {
    const [text, setText] = useState('')
    const [error, setError] = useState('')
    const { user, dispatch } = useContext(authContext)

    async function onSubmit(e) {
        e.preventDefault()

        if (text.trim() === '') {
            setError('Entry required')
            return
        }

        try {
            setDisabled(true)
            const response = await fetch(`/api/story/${story._id}/entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ text })
            })
            const json = await response.json()

            if (!response.ok) {
                if (json.error === 'Invalid authorization') {
                    dispatch({
                        type: 'LOGOUT'
                    })
                    setDisabled(false)
                    return
                }
                setError(json.error)
                setDisabled(false)
                return
            }

            json.children = []
            const newEntries = new Map(entries)
            newEntries.set(json._id, json)

            setEntries(newEntries)
            setStory({
                ...story,
                children: [...story.children, json._id]
            })
            setPath([ json._id ])
            setDisabled(false)

            onCancel() // Remove the form
        } catch (err) {
            setDisabled(false)
        }
    }

    return (
        <div>
            { error && <p>{ error }</p> }
            <form onSubmit={onSubmit}>
                <textarea value={text}
                            onChange={(e) => {setText(e.target.value)}}
                            disabled={disabled}
                            placeholder="Text"
                            className="border-solid border border-gray-700 px-2 py-1 rounded w-full"
                            rows="10"
                            required></textarea>
                <input type="submit"
                        value='Create entry'
                        disabled={disabled}
                        className="px-2 py-1 mr-2 bg-green-700 text-white rounded cursor-pointer"/>
                <button type="button"
                        onClick={onCancel}
                        disabled={disabled}
                        className="px-2 py-1 bg-red-700 text-white rounded cursor-pointer">Cancel</button>
            </form>
        </div>
    )
}

const AddSubentry = ({ path, setPath, index, entries, setEntries, onCancel, disabled, setDisabled }) => {
    const [text, setText] = useState('')
    const [error, setError] = useState('')
    const { user, dispatch } = useContext(authContext)
    const entry = entries.get(path[index])

    async function onSubmit(e) {
        e.preventDefault()

        if (text.trim() === '') {
            setError('Entry required')
            return
        }

        try {
            setDisabled(true)
            const response = await fetch(`/api/entry/${entry._id}/subentry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ text })
            })
            const json = await response.json()

            if (!response.ok) {
                if (json.error === 'Invalid authorization') {
                    dispatch({
                        type: 'LOGOUT'
                    })
                    setDisabled(false)
                    return
                }
                setError(json.error)
                setDisabled(false)
                return
            }

            json.children = []
            const newEntries = new Map(entries)
            newEntries.set(json._id, json)
            newEntries.set(entry._id, {
                ...entry,
                children: [...entry.children, json._id]
            })

            setPath([ ...path.slice(0, index + 1), json._id ])
            setEntries(newEntries)
            setDisabled(false)

            onCancel()
        } catch (err) {
            setDisabled(false)
        }
    }

    return (
        <div>
            { error && <p>{ error }</p> }
            <form onSubmit={onSubmit}>
                <textarea value={text}
                            onChange={(e) => {setText(e.target.value)}}
                            disabled={disabled}
                            placeholder="Text"
                            className="border-solid border border-gray-700 px-2 py-1 rounded w-full"
                            rows="10"
                            required></textarea>
                <input type="submit"
                        value='Create entry'
                        disabled={disabled}
                        className="px-2 py-1 mr-2 bg-green-700 text-white rounded cursor-pointer"/>
                <button type="button"
                            onClick={onCancel}
                            disabled={disabled}
                            className="px-2 py-1 bg-red-700 text-white rounded cursor-pointer">Cancel</button>
            </form>
        </div>
    )
}

const Entry = ({ entries, setEntries, path, setPath, index, disabled, setDisabled }) => {
    const [addEntry, setAddEntry] = useState(false)
    const { user } = useContext(authContext)

    const entry = entries.get(path[index])
    const subentries = entry.children.map(_id => entries.get(_id))

    function cancelAddEntry() {
        if (disabled) {
            return
        }
        setAddEntry(false)
    }

    async function addEntryToPath(_id) {
        if (disabled) {
            return
        }
        const entry = entries.get(_id)

        if (typeof entry.children !== 'undefined') {
            setPath([ ...path.slice(0, index + 1), _id ])
            return
        }

        try {
            setDisabled(true)
            const response = await fetch(`/api/entry/${_id}/subentries`)
            const json = await response.json()
    
            if (response.ok) {
                const newEntries = new Map(entries)
                newEntries.set(_id, {
                    ...entry,
                    children: json.map(entry => entry._id)
                })
                json.forEach(entry => {
                    newEntries.set(entry._id, entry)
                })
                setEntries(newEntries)
                setPath([ ...path.slice(0, index + 1), _id ])
            }
            setDisabled(false)
        } catch (err) {
            setDisabled(false)
        }
    }
    
    return (
        <div className="border border-solid border-gray-500 rounded p-2 space-y-2">
            <p className="whitespace-pre-wrap break-words">{ entry.text }</p>
            { user.token && !addEntry && (
                    <button onClick={() => { if (!disabled) { setAddEntry(true) } }}
                            className="px-2 py-1 bg-green-700 text-white rounded cursor-pointer">Add entry</button>
                    ) }
            { user.token && addEntry && (
                <AddSubentry path={path} setPath={setPath}
                                index={index}
                                entries={entries} setEntries={setEntries}
                                onCancel={cancelAddEntry}
                                disabled={disabled} setDisabled={setDisabled}/>
            ) }
            <div className="flex flex-col items-start space-y-1">
                { subentries.map(entry => (
                        <button key={entry._id}
                                onClick={() => { addEntryToPath(entry._id) }}
                                className="underline truncate max-w-full">{entry.text}</button>
                    )) }
            </div>
        </div>
    )
}

const Story = ({ story, setStory, entries, setEntries, disabled, setDisabled }) => {
    const [addEntry, setAddEntry] = useState(false)
    // Array of the _id's of the entries in the current path of entries being viewed
    const [path, setPath] = useState([])
    const { user } = useContext(authContext)

    function cancelAddEntry() {
        if (disabled) {
            return
        }
        setAddEntry(false)
    }

    async function addEntryToPath(_id) {
        if (disabled) {
            return
        }
        const entry = entries.get(_id)
        
        // The JSON returned by the API doesn't have the children.
        // Whenever we fetch the children of an entry, we set the corresponding entry's children.
        // Thus we can check entry.children to see if the children have to be fetched.

        if (typeof entry.children !== 'undefined') {
            setPath([ _id ])
            return
        }

        try {
            setDisabled(true)
            const response = await fetch(`/api/entry/${_id}/subentries`)
            const json = await response.json()

            if (response.ok) {
                const newEntries = new Map(entries)
                newEntries.set(_id, {
                    ...entry,
                    children: json.map(entry => entry._id)
                })
                json.forEach(entry => {
                    newEntries.set(entry._id, entry)
                })
                setEntries(newEntries)
                setPath([ _id ])
                setDisabled(false)
            }
        } catch (err) {
            setDisabled(false)
        }
    }

    const storyEntries = story.children.map(_id => entries.get(_id))

    return (
        <div className="space-y-5">
            <p className="font-bold text-2xl text-ellipsis">{ story.title }</p>
            <div className="border border-solid border-gray-500 rounded p-2 space-y-2">
                <p className="text-ellipsis">{ story.firstEntry }</p>
                { user.token && !addEntry && ( 
                        <button onClick={() => { if (!disabled) { setAddEntry(true) } }}
                                className="px-2 py-1 bg-green-700 text-white rounded cursor-pointer">Add entry</button>
                ) }
                { user.token && addEntry && (
                    <AddEntryToStory story={story} setStory={setStory}
                                        entries={entries} setEntries={setEntries}
                                        setPath={setPath}
                                        disabled={disabled} setDisabled={setDisabled}
                                        onCancel={cancelAddEntry}/>
                ) }
                <div className="flex flex-col items-start space-y-1">
                    { storyEntries.map(entry => ( 
                                            <button key={entry._id} 
                                                    onClick={() => { addEntryToPath(entry._id) }} 
                                                    className="underline truncate max-w-full">{entry.text}</button> 
                                        )) }
                </div>
            </div>
            { path.map((_id, index) => ( 
                            <Entry entries={entries} setEntries={setEntries}
                                    path={path} setPath={setPath}
                                    key={_id}
                                    index={index}
                                    disabled={disabled} setDisabled={setDisabled}/> 
                        )) }
        </div>
    )
}

const ViewStory = () => {
    const [story, setStory] = useState(null)
    const [entries, setEntries] = useState(new Map()) // Stores all the fetched entries, using the _id as the key
    const [error, setError] = useState('')
    const [disabled, setDisabled] = useState(false)
    const { storyId } = useParams()

    useEffect(() => {
        setStory(null)
        setDisabled(false)
        async function fetchStory() {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
            try {
                const [storyResponse, entriesResponse]
                    = await Promise.all([fetch(`/api/story/${storyId}`), fetch(`/api/story/${storyId}/entries`)])
                const [storyJSON, entriesJSON] 
                    = await Promise.all([storyResponse.json(), entriesResponse.json()])

                if (!storyResponse.ok) {
                    setError(storyJSON.error)
                    return
                }
                if (!entriesResponse.ok) {
                    setError(entriesJSON.error)
                    return
                }

                storyJSON.children = entriesJSON.map(entry => entry._id)

                const entries = new Map()
                entriesJSON.forEach(entry => {
                    entries.set(entry._id, entry)
                })

                setError('')
                setStory(storyJSON)
                setEntries(entries)
            } catch (err) {
                setError("Couldn't fetch the story")
            }
        }
        fetchStory()
    }, [storyId])

    return (
        <div>
            { error && <p>{ error }</p> }
            { story && <Story story={story} setStory={setStory} 
                                entries={entries} setEntries={setEntries} 
                                disabled={disabled} setDisabled={setDisabled}/> }
        </div>
    )
}

export default ViewStory