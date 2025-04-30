import { useState, useEffect } from 'react'
import { Auth, API } from 'aws-amplify'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [apiResponse, setApiResponse] = useState(null)
  const [apiError, setApiError] = useState('')
  const [apiTesting, setApiTesting] = useState(false)

  // Check if user is already signed in
  useEffect(() => {
    checkAuthState()
  }, [])

  async function checkAuthState() {
    try {
      setLoading(true)
      const currentUser = await Auth.currentAuthenticatedUser()
      setUser(currentUser)
      setLoginError('')
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setLoginError('')

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password')
      return
    }

    try {
      setLoading(true)
      const user = await Auth.signIn(loginEmail, loginPassword)
      setUser(user)
      setLoginEmail('')
      setLoginPassword('')
    } catch (error) {
      console.error('Error signing in:', error)
      setLoginError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    try {
      await Auth.signOut()
      setUser(null)
      setApiResponse(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  async function testApi() {
    setApiTesting(true)
    setApiError('')
    setApiResponse(null)

    try {
      // Call the normal distribution API
      const response = await API.get('NormalDistributionAPI', '/api/normal-distribution')
      setApiResponse(response)
    } catch (error) {
      console.error('API error:', error)
      setApiError(error.message || 'Failed to get API response')
    } finally {
      setApiTesting(false)
    }
  }

  return (
    <>
      <h1>D3 Dashboard - Hello World Test</h1>

      <div className="card">
        <h2>Authentication Status</h2>

        {loading ? (
          <p>
            <span className="status-indicator status-loading"></span>
            Loading...
          </p>
        ) : user ? (
          <>
            <p>
              <span className="status-indicator status-success"></span>
              Signed in as {user.attributes?.email}
            </p>

            <div className="user-info">
              <pre>{JSON.stringify(user.attributes, null, 2)}</pre>
            </div>

            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <div className="login-container">
            <p>
              <span className="status-indicator status-error"></span>
              Not signed in
            </p>

            <form onSubmit={handleSignIn}>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              {loginError && <p className="status-message">{loginError}</p>}
              <button type="submit">Sign In</button>
            </form>
          </div>
        )}
      </div>

      <div className="card">
        <h2>API Test</h2>
        <div className="api-test-container">
          <p>Test connection to the normal distribution API</p>

          <button onClick={testApi} disabled={apiTesting || !user}>
            {apiTesting ? 'Testing...' : 'Test API Connection'}
          </button>

          {!user && <p className="status-message">Sign in to test the API</p>}

          {apiError && (
            <p className="status-message">
              <span className="status-indicator status-error"></span>
              {apiError}
            </p>
          )}

          {apiResponse && (
            <>
              <p>
                <span className="status-indicator status-success"></span>
                API Connection Successful
              </p>
              <div className="api-response">
                <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="read-the-docs">
        This is a test application to verify your AWS infrastructure is correctly set up.
      </p>
    </>
  )
}

export default App
