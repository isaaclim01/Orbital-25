import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../App';
import { GiButterToast } from 'react-icons/gi';

function LoginPage() {
    return <>
    <h1 className="app-name">
                        HoneyToast <GiButterToast size ="25px"/>
                    </h1>
    <Auth 
        supabaseClient={supabase} 
        appearance={{ theme: ThemeSupa }}
        providers={[]} /> </>;
}

export default LoginPage;