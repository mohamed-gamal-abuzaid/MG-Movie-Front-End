import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId="177151154262-pi7grokel1jfpphbfgr7rdr2lk29l9vm.apps.googleusercontent.com">
      <AuthProvider>
        <App />

      </AuthProvider>
    </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)