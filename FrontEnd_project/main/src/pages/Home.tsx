
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          Sticky Note Haven
        </h1>
        <p className="text-xl mb-12 text-gray-600 dark:text-gray-300">
          Organize your thoughts, capture your ideas, and keep track of what matters most - all in one beautiful place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {currentUser ? (
            <Button asChild size="lg" className="px-8 py-6 text-lg font-medium">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" variant="default" className="px-8 py-6 text-lg font-medium">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg font-medium">
                <Link to="/login?signup=true">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="font-bold text-xl mb-3">Easy Organization</h3>
          <p className="text-gray-600 dark:text-gray-300">Create color-coded notes to keep your thoughts organized and easily searchable.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="font-bold text-xl mb-3">Works Everywhere</h3>
          <p className="text-gray-600 dark:text-gray-300">Access your notes from any device with a web browser - no installation required.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="font-bold text-xl mb-3">Personalized Experience</h3>
          <p className="text-gray-600 dark:text-gray-300">Customize your note colors and toggle between light and dark themes for comfortable viewing.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;