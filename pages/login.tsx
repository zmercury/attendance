import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion' // Add this import
import { FcGoogle } from 'react-icons/fc' // Make sure to install react-icons

export default function AuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('') // Add this line
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        } else if (data?.user) {
            router.push('/dashboard')
        }

        setLoading(false)
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        console.log('Registration response:', data, error) // Add this line

        if (error) {
            setError(error.message)
            console.error('Registration error:', error) // Add this line
        } else if (data.user) {
            console.log('User registered:', data.user) // Add this line
            setError("Registration successful! Check your email for the confirmation link.")
        }

        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        }
        // If successful, the page will redirect, so we don't need to handle that case here
    }

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    }

    const testSignUp = async () => {
        const { data, error } = await supabase.auth.signUp({
            email: 'test@example.com',
            password: 'testpassword123',
        })
        console.log('Test sign up result:', data, error)
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <motion.form 
                                onSubmit={handleLogin} 
                                className="space-y-4"
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                transition={{ duration: 0.5 }}
                            >
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    <FcGoogle className="mr-2 h-4 w-4" />
                                    Google
                                </Button>
                            </motion.form>
                        </TabsContent>
                        <TabsContent value="register">
                            <motion.form 
                                onSubmit={handleRegister} 
                                className="space-y-4"
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                transition={{ duration: 0.5 }}
                            >
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Registering...' : 'Register'}
                                </Button>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    <FcGoogle className="mr-2 h-4 w-4" />
                                    Google
                                </Button>
                            </motion.form>
                        </TabsContent>
                    </Tabs>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </div>
            </div>
        </div>
    )
}