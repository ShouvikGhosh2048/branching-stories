import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Stories = () => {
    const [stories, setStories] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchStories() {
            try {
                const response = await fetch('/api/story/')
                const json = await response.json()

                if (!response.ok) {
                    setError(json.error)
                    return
                }

                setStories(json)
            } catch (err) {
                setError("Couldn't fetch the story")
            }
        }
        fetchStories()
    }, [])

    return (
        <div>
            { error && <p>{ error }</p> }
            { stories && (
                <div className="flex flex-col items-start">
                    { stories.map(story => (
                                <Link key={story._id}
                                        to={`/view-story/${story._id}`}
                                        className="underline truncate max-w-full">{story.title}</Link>
                            ))}
                </div>
            ) }
        </div>
    )
}

export default Stories