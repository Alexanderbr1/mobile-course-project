import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {AuthContextType, User} from '@/types'
import {http} from '@/api/http'
import {AxiosPromise, AxiosResponse} from 'axios'

const AuthContext = createContext<AuthContextType | null>(null)

interface GetUserResponse {
    created_at: string
    email: string
    first_name: string
    id: number
    last_name: string
}

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const loadAuthData = async () => {
            const storedAuth = await AsyncStorage.getItem('auth')
            const storedToken = await AsyncStorage.getItem('token')
            setIsAuthenticated(storedAuth === 'true')
            setToken(storedToken)
        }
        loadAuthData()
    }, [])

    const login = async (tokenData: string) => {
        await AsyncStorage.setItem('auth', 'true')
        await AsyncStorage.setItem('token', tokenData)

        setIsAuthenticated(true)
        setToken(tokenData)
    }

    const logout = async () => {
        await AsyncStorage.removeItem('auth')
        await AsyncStorage.removeItem('token')

        setIsAuthenticated(false)
        setToken(null)
    }

    return (
        <AuthContext.Provider
            value={{isAuthenticated, token, login, logout}}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
