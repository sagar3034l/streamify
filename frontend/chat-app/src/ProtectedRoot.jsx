

import { Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';


const ProtectedRoot = ({ isAuthenticated, isOnboarded }) => {
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isOnboarded) return <Navigate to="/onboarding" />;
  return <Layout showSidebar={true}>
        <HomePage />
     </Layout>
};

export default ProtectedRoot;

