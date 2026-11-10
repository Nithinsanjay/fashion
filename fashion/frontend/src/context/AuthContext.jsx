import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

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

    // Login handler
    const login = async (email, password) => {
        // We will connect this to FastAPI backend /api/auth/login
        // For now, it logs the user in immediately:
        const mockUser = {
            id: 1,
            name: email.split('@')[0],
            email: email,
            preferredDepartment: 'unisex',
        }
        setUser(mockUser)
        localStorage.setItem('69store_user', JSON.stringify(mockUser))
        setIsAuthOpen(false)
        return { success: true }
    }

    // Register handler
    const register = async (name, email, password, preferredDepartment) => {
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            preferredDepartment: preferredDepartment || 'unisex',
        }
        setUser(newUser)
        localStorage.setItem('69store_user', JSON.stringify(newUser))
        setIsAuthOpen(false)
        return { success: true }
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