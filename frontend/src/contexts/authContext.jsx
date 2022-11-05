import { useEffect, useReducer, createContext } from "react"

export const authContext = createContext()

function authContextReducer(user, payload) {
    switch(payload.type) {
        case 'LOGOUT': {
            return {
                token: null
            }
        }
        case 'LOGIN': {
            return payload.user
        }
        default: {
            return user
        }
    }
}

export const AuthContextProvider = ({ children }) => {
    // { token: undefined } means that we haven't fetched the user.
    // token will be null if there isn't a logged in user and a string if there is.
    const [user, dispatch] = useReducer(authContextReducer, { token: undefined })

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('userToken')
            if (!token) {
                dispatch({
                    type: 'LOGOUT'
                })
                return
            }

            try {
                const response = await fetch('/api/user/getMe', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const json = await response.json()
    
                if (!response.ok) {
                    localStorage.removeItem('userToken')
                    dispatch({
                        type: 'LOGOUT'
                    })
                    return
                }

                dispatch({
                    type: 'LOGIN',
                    user: {
                        token,
                        username: json.username
                    }
                })
            } catch (err) {
                // We didn't get a response so we don't know whether the token is valid.
                // So we treat the user as logged out, but we don't remove the token from local storage.
                dispatch({
                    type: 'LOGOUT'
                })
            }
        }
        fetchUser()
    }, [])

    return (
        <authContext.Provider value={{ user, dispatch }}>
            { children }
        </authContext.Provider>
    )
}