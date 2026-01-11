import {Navigate} from 'react-router-dom'

export default function ProtectRoute({children,isAuthenticated}){
    return isAuthenticated ? children : <Navigate to="/login" />;
}