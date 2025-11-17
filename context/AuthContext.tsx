import React, { createContext, useState, useEffect } from 'react';
import { type User, type AuthContextType } from '../types';
import { USERS } from '../constants';

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: (phone, otp) => false,
    logout: () => {},
    signup: (details) => false,
    updateUserRole: (phone, role) => {},
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
            const savedUserJSON = window.localStorage.getItem('roberts-user-session');
            if (savedUserJSON) {
                const savedUser: Partial<User> = JSON.parse(savedUserJSON);
                
                // Validate that the saved user has a phone number to look up
                if (savedUser && typeof savedUser.phone === 'string') {
                    const fullUserFromDB = usersDB.find(u => u.phone === savedUser.phone);
                    
                    if (fullUserFromDB) {
                        // Found the user in our current "database". Use this fresh data.
                        setUser(fullUserFromDB);
                        setIsAuthenticated(true);
                        
                        // Optional: Resync localStorage with the fresh data to keep it updated.
                        if (JSON.stringify(fullUserFromDB) !== savedUserJSON) {
                            window.localStorage.setItem('roberts-user-session', JSON.stringify(fullUserFromDB));
                        }
                    } else {
                        // User in session doesn't exist in the DB anymore. Clear session.
                        setUser(null);
                        setIsAuthenticated(false);
                        window.localStorage.removeItem('roberts-user-session');
                    }
                } else {
                    // The saved session object is invalid/corrupted. Clear it.
                    setUser(null);
                    setIsAuthenticated(false);
                    window.localStorage.removeItem('roberts-user-session');
                }
            }
        } catch (error) {
            console.error("Could not parse user session", error);
            setUser(null);
            setIsAuthenticated(false);
            window.localStorage.removeItem('roberts-user-session');
        }
    }, [usersDB]);

    const login = (phone: string, otp: string): boolean => {
        const foundUser = usersDB.find(u => u.phone === phone);
        if (!foundUser) return false;

        const correctOtp = (foundUser.phone === '+254723119356') ? '3232' : '1234';
        
        if (otp === correctOtp) {
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
    
    const signup = (details: Omit<User, 'role' | 'bio' | 'avatarUrl'>): boolean => {
        const userExists = usersDB.some(u => u.phone === details.phone);
        if (userExists) {
            alert('A user with this phone number already exists.');
            return false;
        }
        const newUser: User = { 
            ...details, 
            role: 'customer',
            bio: 'New Roberts Indoor Solutions customer.',
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(details.name)}&background=random`,
        };
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