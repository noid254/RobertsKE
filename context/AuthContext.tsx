import React, { createContext, useState, useEffect } from 'react';
import { type User, type AuthContextType } from '../types';
import { USERS } from '../constants';

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: () => false,
    logout: () => {},
    signup: () => false,
    updateUserRole: () => {},
});

// Mock user database stored in localStorage for simulation
const getMockUsers = (): User[] => {
    try {
        const localData = window.localStorage.getItem('roberts-users');
        return localData ? JSON.parse(localData) : USERS;
    } catch (error) {
        return USERS;
    }
};

const setMockUsers = (users: User[]) => {
    window.localStorage.setItem('roberts-users', JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [usersDB, setUsersDB] = useState<User[]>(getMockUsers());

    useEffect(() => {
        // Persist users DB changes to localStorage
        setMockUsers(usersDB);
    }, [usersDB]);

    useEffect(() => {
        // Check for saved user session on initial load
        try {
            const savedUser = window.localStorage.getItem('roberts-user-session');
            if (savedUser) {
                const parsedUser: User = JSON.parse(savedUser);
                const userExists = usersDB.some(u => u.phone === parsedUser.phone);
                if(userExists) {
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                } else {
                     window.localStorage.removeItem('roberts-user-session');
                }
            }
        } catch (error) {
            console.error("Could not parse user session", error);
            window.localStorage.removeItem('roberts-user-session');
        }
    }, [usersDB]);

    const login = (phone: string, otp: string): boolean => {
        const foundUser = usersDB.find(u => u.phone === phone);
        if (!foundUser) return false;

        const isSuperAdmin = phone === '+254723119356' && otp === '3232';
        const isNormalUser = otp === '1234';

        if (isSuperAdmin || isNormalUser) {
            setUser(foundUser);
            setIsAuthenticated(true);
            window.localStorage.setItem('roberts-user-session', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        window.localStorage.removeItem('roberts-user-session');
    };
    
    const signup = (details: Omit<User, 'role'>): boolean => {
        const userExists = usersDB.some(u => u.phone === details.phone);
        if (userExists) {
            alert('A user with this phone number already exists.');
            return false;
        }
        const newUser: User = { ...details, role: 'customer' };
        setUsersDB(prev => [...prev, newUser]);
        
        // Automatically log in the new user
        setUser(newUser);
        setIsAuthenticated(true);
        window.localStorage.setItem('roberts-user-session', JSON.stringify(newUser));
        return true;
    };
    
    const updateUserRole = (phone: string, role: User['role']) => {
        setUsersDB(prevUsers => prevUsers.map(u => u.phone === phone ? { ...u, role } : u));
    };


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup, updateUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};
