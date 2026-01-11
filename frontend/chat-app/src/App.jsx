import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './App.css'
import Signup from './pages/SignUpPage'
import Login from './pages/LoginPage'
import Notifications from './pages/NotificationPage'
import CallPage from './pages/CallPage'
import Onboarding from './pages/OnBoardingPage'
import { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
import ProtectedRoot from './ProtectedRoot'
import { useThemeStore } from './store/useThemeStore'
import Layout from './components/Layout'
import ChatPage from './pages/ChatPage'

function App() {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  const {theme} = useThemeStore();
  if (isLoading) {
    return <PageLoader />
  }
  const router = createBrowserRouter([
    {
      path: '/',
      element: <ProtectedRoot isAuthenticated={isAuthenticated} isOnboarded={isOnboarded} />
    },
    {
      path: '/signup',
      element: <div>
        {
          !isAuthenticated ? <Signup /> : <Navigate to="/" />
        }
      </div>
    }, {
      path: '/login',
      element: <div>
        {
          !isAuthenticated ? <Login /> : <Navigate to={
            isOnboarded ? "/" : "/onboarding"
          } />
        }
      </div>
    }, {
      path: '/notifications',
      element: <div>
       {
        isAuthenticated && isOnboarded ?(
           <Layout showSidebar={true}>
              <Notifications />
           </Layout>
        ) :(
           <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )
       }
      </div>
    },
    {
      path: '/call/:id',
      element: <div>
        {
          isAuthenticated ?
          <CallPage />
           : <Navigate to={'/login'} />
        }
      </div>
    },
    {
      path: '/chat/:id',
      element: <div>
        {
          isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                  <ChatPage />
              </Layout>
          ):(
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        }
      </div>
    },
    {
      path: '/onboarding',
      element: (
        isAuthenticated ? (
                !isOnboarded ? (
                    <Onboarding />
                ) : (<Navigate to="/"/>)
            ) : (
                <Navigate to="/login"/>
            )
      )
    },
  ])

  return (
    <div data-theme={theme}>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
}

export default App
