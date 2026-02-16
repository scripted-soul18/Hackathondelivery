import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'customer' or 'owner'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check initial session
        const checkSession = async () => {
            if (supabase) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setUser(session.user);
                    // Fetch role from DB or metadata here
                }
            }
            setLoading(false);
        };
        checkSession();

        // Listen for auth changes
        if (supabase) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });
            return () => subscription.unsubscribe();
        }
    }, []);

    const signInWithGoogle = async (selectedRole) => {
        if (supabase) {
            // In real app, we'd store the selected role in metadata or local storage 
            // to assign it after redirect
            localStorage.setItem('pendingRole', selectedRole);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } else {
            // MOCK LOGIN
            const mockUser = {
                id: 'mock-user-123',
                email: 'mockuser@example.com',
                user_metadata: { full_name: 'Demo User' }
            };
            setUser(mockUser);
            setRole(selectedRole);
            localStorage.setItem('swiftcart_role', selectedRole);
        }
    };

    const signOut = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
        setRole(null);
        localStorage.removeItem('swiftcart_role');
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
