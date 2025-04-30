import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// AWS Amplify configuration
import { Amplify } from 'aws-amplify'

// Configure Amplify
Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_WEB_CLIENT_ID,
    identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: 'NormalDistributionAPI',
        endpoint: import.meta.env.VITE_API_ENDPOINT
      }
    ]
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
