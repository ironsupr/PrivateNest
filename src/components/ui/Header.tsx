'use client';

import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from './ThemeToggle';
import { LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
    const supabase = createClient();
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string>('');
    const [userAvatar, setUserAvatar] = useState<string>('');

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email || '');
                setUserAvatar(user.user_metadata?.avatar_url || '');
            }
        };
        getUser();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className="header">
            <div className="header-inner">
                <div className="header-brand">
                    <Logo size={32} />
                    <h1 className="header-title">PrivateNest</h1>
                </div>
                <div className="header-actions">
                    <ThemeToggle />
                    {userAvatar && (
                        <img
                            src={userAvatar}
                            alt="User avatar"
                            className="header-avatar"
                            referrerPolicy="no-referrer"
                        />
                    )}
                    <span className="header-email">{userEmail}</span>
                    <button
                        onClick={handleSignOut}
                        className="btn btn-ghost"
                        aria-label="Sign out"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
