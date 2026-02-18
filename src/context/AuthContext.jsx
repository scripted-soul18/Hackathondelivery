import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'customer' or 'owner'
    const [loading, setLoading] = useState(true);

//**improvement - Extracted role fetcher from DB (secure,not localstorage)
        // Check initial session
        const fetchRoleFromDB = async (userId) =>{
            const{data, error} = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();
            if (!error && data?.role) {
                setRole(data.role);
            }
        };
        useEffect(() => {
            const checkSession = async () => {
                try {
                    if (supabase) {
                        const { data:{session}} = await supabase.auth.getSession();
                        if(session){
                            setUser(session.user);
                            await fetchRoleFromDB(session.user.id);
                            localStorage.removeItem('pendingRole); 
                        }
                    }   
        
            } catch(err) {
                    //catch errors so that the app doesnt silently break
                    console.error('Session check failed:',err);
            } finally {   
                    setLoading(false);
            } 
        };
        checkSession();

        if (supabase) {
            const { data:{subscription}}=supabase.auth.onAuthStateChange(async (_event,session) => {
                setUser(session?.user??null);


                if (session?.user){
                    await fetchRoleFromDB(session.user.id);
                }else{
                    setRole(null);
                }
            });
            return () => subscription.unsubscribe();
        } 
    },[]);
    const signInWithGoogle = async (selectedRole) => {
        if (supabase){
            //store selected role so we can save it to DB after redirect
            //we will have to save these role to profile tables which is created in supabase

            localStorage.setItem('pendingRole',selectedRole);

            const {error} = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options:{
                    redirectTo: window.location.origin
                }
            });
            if(error) throw error;
        }else{
            const mockUser = {
                id: 'mock-user-123',
                email: 'mockuser@example.com',
                user_metadata: { full_name: 'Demo User' }
            };
            setUser(mockUser);
            setRole(selectedRole);
            localStorage.setItem('swiftcart_role',selectedRole);
        }
    };

    const signOut = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
        setRole(null);
        localStorage.removeItem('swiftcart_role');
        // ✅ IMPROVEMENT 5: Also remove pendingRole on sign out (was missing before)
        localStorage.removeItem('pendingRole');
    };

    return (
        // ✅ IMPROVEMENT 6: Exposed setRole in context so other components can update role if needed
        <AuthContext.Provider value={{ user, role, setRole, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

                                                                                                    
                                                                                                    
        
