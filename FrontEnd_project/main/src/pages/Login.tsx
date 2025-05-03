
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, currentUser } = useAuth();

  // Check if we should show signup form based on URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsSignUp(params.get('signup') === 'true');
  }, [location]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const success = isSignUp 
      ? signup(username, password)
      : login(username, password);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Update URL without page reload
    const newUrl = isSignUp ? '/login' : '/login?signup=true';
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Sign up to start creating and organizing your notes'
              : 'Log in to access your notes'
            }
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              {isSignUp ? 'Create Account' : 'Log In'}
            </Button>
            
            <div className="text-sm text-center text-gray-500 dark:text-gray-400">
              {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
              <button 
                type="button" 
                onClick={toggleMode}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </div>
            
            <Link to="/" className="text-sm text-primary hover:underline font-medium">
              Back to Home
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;