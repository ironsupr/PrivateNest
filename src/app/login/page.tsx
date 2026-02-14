'use client';

import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';

export default function LoginPage() {
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="bg-background-white text-navy-900 font-sans antialiased min-h-screen flex flex-col selection:bg-indigo-accent selection:text-white">

            {/* ===== NAV ===== */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-slate-100 bg-white/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4 md:px-8 h-20">
                    <a className="flex items-center space-x-3 group" href="#">
                        <Logo size={40} showText />
                    </a>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleGoogleLogin}
                            className="text-sm font-medium text-navy-700 hover:text-indigo-accent transition-colors px-3 py-2"
                        >
                            Login
                        </button>
                        <button
                            onClick={handleGoogleLogin}
                            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-accent hover:bg-indigo-hover rounded-lg transition-all shadow-soft hover:shadow-glow focus:ring-4 focus:ring-indigo-soft"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-background-offwhite">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                {/* Fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>

                <div className="relative z-10 px-4 mx-auto max-w-7xl text-center">
                    {/* Badge */}
                    <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide mb-8 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        v2.0 Now Live
                    </div>

                    {/* Heading */}
                    <h1 className="animate-fade-in-up-delay-1 mb-8 text-5xl font-extrabold tracking-tight leading-[1.1] text-navy-900 md:text-6xl lg:text-7xl max-w-5xl mx-auto text-balance">
                        Your Private <br className="hidden md:block" />
                        <span className="text-indigo-accent">Digital Sanctuary</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="animate-fade-in-up-delay-2 mb-12 text-lg font-normal text-navy-700 lg:text-xl sm:px-16 xl:px-48 max-w-3xl mx-auto leading-relaxed text-balance">
                        Secure, smart bookmarking with real-time sync. Capture your thoughts and links in a private space that evolves with you. No ads, no tracking.
                    </p>

                    {/* CTAs */}
                    <div className="animate-fade-in-up-delay-3 flex flex-col mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6">
                        <button
                            onClick={handleGoogleLogin}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-navy-800 bg-white border border-slate-200 rounded-xl shadow-soft-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-50"
                        >
                            <div className="absolute inset-0 w-full h-full bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                            <svg aria-hidden="true" className="w-5 h-5 mr-3 relative z-10" viewBox="0 0 488 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="currentColor"></path>
                            </svg>
                            <span className="relative z-10">Continue with Google</span>
                        </button>
                        <a
                            className="inline-flex justify-center items-center px-8 py-4 text-base font-medium text-navy-700 bg-transparent rounded-xl hover:bg-slate-50 hover:text-navy-900 transition-all"
                            href="#how-it-works"
                        >
                            How it works
                            <span className="material-symbols-outlined ml-2 text-lg">arrow_downward</span>
                        </a>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="relative mx-auto mt-16 max-w-6xl px-4 lg:px-0">
                        <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl border border-slate-200/60 ring-1 ring-slate-900/5">
                            {/* Browser chrome */}
                            <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                </div>
                                <div className="flex-1 max-w-2xl mx-auto h-8 bg-white border border-slate-200 rounded-md text-xs flex items-center justify-center text-slate-400 font-sans shadow-sm">
                                    <span className="material-symbols-outlined text-sm mr-2 text-slate-300">lock</span> privatenest.app/dashboard
                                </div>
                            </div>

                            {/* Dashboard body */}
                            <div className="grid grid-cols-12 h-[500px] bg-white">
                                {/* Sidebar */}
                                <div className="hidden md:block col-span-3 lg:col-span-2 border-r border-slate-100 bg-slate-50/50 p-6 space-y-6">
                                    <div className="h-10 w-full bg-indigo-accent/10 text-indigo-700 rounded-lg flex items-center px-4 text-sm font-medium">My Nest</div>
                                    <div className="space-y-3 pl-2">
                                        <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                                        <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                                        <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-200 space-y-3 pl-2">
                                        <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                                        <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Main content */}
                                <div className="col-span-12 md:col-span-9 lg:col-span-10 p-8 md:p-12 bg-white relative">
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="h-10 w-48 bg-slate-100 rounded-lg"></div>
                                        <div className="h-10 w-32 bg-indigo-accent rounded-lg shadow-lg shadow-indigo-200"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Card 1 */}
                                        <div className="p-5 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-lg transition-all cursor-pointer group h-48 flex flex-col justify-between">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                                                    <span className="material-symbols-outlined">article</span>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-slate-300 hover:text-indigo-500">more_horiz</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-5 w-3/4 bg-slate-800/5 rounded group-hover:bg-indigo-50 transition-colors"></div>
                                                <div className="h-4 w-full bg-slate-100 rounded"></div>
                                            </div>
                                        </div>
                                        {/* Card 2 */}
                                        <div className="p-5 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-lg transition-all cursor-pointer group h-48 flex flex-col justify-between">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
                                                    <span className="material-symbols-outlined">design_services</span>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-slate-300 hover:text-indigo-500">more_horiz</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-5 w-2/3 bg-slate-800/5 rounded group-hover:bg-indigo-50 transition-colors"></div>
                                                <div className="h-4 w-11/12 bg-slate-100 rounded"></div>
                                                <div className="h-4 w-4/6 bg-slate-100 rounded"></div>
                                            </div>
                                        </div>
                                        {/* Card 3 */}
                                        <div className="p-5 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-lg transition-all cursor-pointer group h-48 flex flex-col justify-between">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                                                    <span className="material-symbols-outlined">lightbulb</span>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-slate-300 hover:text-indigo-500">more_horiz</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-5 w-5/6 bg-slate-800/5 rounded group-hover:bg-indigo-50 transition-colors"></div>
                                                <div className="h-4 w-full bg-slate-100 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fade overlay at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                        </div>
                        {/* Glow behind preview */}
                        <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl -z-10 rounded-[3rem]"></div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-32 bg-white relative" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-indigo-accent font-bold tracking-wide uppercase text-sm mb-4">Workflow</h2>
                        <p className="text-3xl font-extrabold text-navy-900 sm:text-4xl mb-6">
                            Smart bookmarking in three steps
                        </p>
                        <p className="text-xl text-navy-700 leading-relaxed text-balance">
                            We&apos;ve stripped away the complexity. Focus on collecting what inspires you, let us handle the organization.
                        </p>
                    </div>
                    <div className="grid gap-12 md:grid-cols-3">
                        {/* Step 1 */}
                        <div className="flex flex-col items-start p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-soft-lg transition-all duration-300 group">
                            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white text-indigo-accent shadow-sm mb-8 group-hover:scale-110 transition-transform duration-300 border border-indigo-50">
                                <span className="material-symbols-outlined text-3xl">lock_person</span>
                            </div>
                            <h3 className="text-xl font-bold text-navy-900 mb-4">1. Sign In Securely</h3>
                            <p className="text-navy-700 leading-relaxed">
                                Use your existing Google account for one-click access. No new passwords to remember, just enterprise-grade security for your personal data.
                            </p>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-start p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-soft-lg transition-all duration-300 group">
                            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white text-indigo-accent shadow-sm mb-8 group-hover:scale-110 transition-transform duration-300 border border-indigo-50">
                                <span className="material-symbols-outlined text-3xl">post_add</span>
                            </div>
                            <h3 className="text-xl font-bold text-navy-900 mb-4">2. Add Bookmarks</h3>
                            <p className="text-navy-700 leading-relaxed">
                                Paste a URL or use our browser extension. Our smart engine automatically fetches titles, descriptions, and tags for effortless organization.
                            </p>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-start p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-soft-lg transition-all duration-300 group">
                            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white text-indigo-accent shadow-sm mb-8 group-hover:scale-110 transition-transform duration-300 border border-indigo-50">
                                <span className="material-symbols-outlined text-3xl">sync_saved_locally</span>
                            </div>
                            <h3 className="text-xl font-bold text-navy-900 mb-4">3. Sync Everywhere</h3>
                            <p className="text-navy-700 leading-relaxed">
                                Your nest travels with you. Changes are pushed instantly to all your connected devices—desktop, tablet, or mobile.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIAL ===== */}
            <section className="py-24 bg-background-offwhite border-y border-slate-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="mb-10 flex justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-yellow-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                    </div>
                    <blockquote className="text-2xl md:text-4xl font-semibold text-navy-900 mb-12 leading-tight">
                        &ldquo;Finally, a bookmark manager that doesn&apos;t feel like a cluttered spreadsheet. PrivateNest is beautiful, fast, and actually private.&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-center space-x-4">
                        <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                alt="Portrait of Alex Chen"
                                className="object-cover w-full h-full"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ6xn6CA48R7ucuT-6GZZMO3aUF_j13S-_gDIJ_nkqvxAEeo6KNvVRAyFpfwcHfoFPFwpW590c4qk04ZrEqfnxtowbjDxLKmqMxtFtpVVX1PwlcKh11DOWgbXJfmPiQ99TQridT7lAk7wKeSKyno6yeS-mvvqQ_WhWIoCPvrBu9vPSeAlddY-wFbitGNJj2P8jBVvbIjcBSAWuIPEtCW_PqGLI3Nfg0SluAqmgC-VmkyfLO3ZQ4E2bepAsbWxB5mSl_J6O4HMbbTeo"
                            />
                        </div>
                        <div className="text-left">
                            <div className="text-navy-900 font-bold text-lg">Alex Chen</div>
                            <div className="text-indigo-600 font-medium text-sm">Product Designer</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="bg-navy-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl font-bold tracking-tight mb-6">
                        Ready to organize your digital life?
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300 mb-12 leading-relaxed">
                        Join thousands of users who have found their sanctuary. <br /> Free to start, forever private.
                    </p>
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={handleGoogleLogin}
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-indigo-600 bg-white rounded-xl hover:bg-slate-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:-translate-y-1"
                        >
                            Start Your Nest
                        </button>
                    </div>
                    <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <Logo size={24} showText className="text-white" />
                            <span className="ml-2 border-l border-white/20 pl-3">© 2025</span>
                        </div>
                        <div className="flex space-x-8">
                            <a className="hover:text-white transition-colors" href="#">Privacy</a>
                            <a className="hover:text-white transition-colors" href="#">Terms</a>
                            <a className="hover:text-white transition-colors" href="#">Twitter</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
