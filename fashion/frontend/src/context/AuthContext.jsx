import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const API_BASE = 'http://localhost:8000'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthOpen, setIsAuthOpen] = useState(false)

    // Check if user session already exists in localStorage on startup
    useEffect(() => {
        const savedUser = localStorage.getItem('69store_user')
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch (err) {
                localStorage.removeItem('69store_user')
            }
        }
    }, [])

    // Real API Login handler
    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.detail || 'Failed to log in.')
            }

            const sessionUser = {
                id: data.id,
                name: data.full_name,
                email: data.email,
                preferredDepartment: data.preferred_department,
                token: data.access_token
            }

            setUser(sessionUser)
            localStorage.setItem('69store_user', JSON.stringify(sessionUser))
            setIsAuthOpen(false)
            return { success: true }
        } catch (err) {
            console.error('Login error:', err)
            throw err
        }
    }

    // Real API Register handler
    const register = async (name, email, password, preferredDepartment) => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: name,
                    email: email,
                    password: password,
                    preferred_department: preferredDepartment || 'unisex'
                })
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.detail || 'Failed to register.')
            }

            const sessionUser = {
                id: data.id,
                name: data.full_name,
                email: data.email,
                preferredDepartment: data.preferred_department,
                token: data.access_token
            }

            setUser(sessionUser)
            localStorage.setItem('69store_user', JSON.stringify(sessionUser))
            setIsAuthOpen(false)
            return { success: true }
        } catch (err) {
            console.error('Registration error:', err)
            throw err
        }
    }

    // Logout handler
    const logout = () => {
        setUser(null)
        localStorage.removeItem('69store_user')
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthOpen,
                openAuth: () => setIsAuthOpen(true),
                closeAuth: () => setIsAuthOpen(false),
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
