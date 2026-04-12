# Google OAuth2 Sign-In Setup Guide

This guide walks through setting up Google OAuth2 authentication for the Blog Management System.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter project name: "Blog Management System"
5. Click "CREATE"

## Step 2: Enable the OAuth2 API

1. In the Cloud Console, navigate to **APIs & Services** > **Library**
2. Search for "Google+ API" (or just "Google ID")
3. Click on "Google+ API"
4. Click "ENABLE"

## Step 3: Create OAuth2 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click "CREATE CREDENTIALS" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - User Type: External
   - Add your email as a test user
   - Add scopes: `email`, `profile`, `openid`
4. Back to Credentials, click "CREATE CREDENTIALS" > "OAuth client ID"
5. Application type: **Web application**
6. Name: "Blog Management System Backend"
7. Authorized JavaScript origins:
   ```
   http://localhost:8080
   http://localhost:3000
   ```
8. Authorized redirect URIs:
   ```
   http://localhost:8080/login/oauth2/code/google
   http://localhost:8080/api/auth/google/callback
   http://localhost:3000/oauth/callback
   ```
9. Click "CREATE"
10. Copy the **Client ID** and **Client Secret**

## Step 4: Update Application Configuration

Edit `src/main/resources/application.yaml` and add:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: YOUR_GOOGLE_CLIENT_ID
            client-secret: YOUR_GOOGLE_CLIENT_SECRET
            redirect-uri: http://localhost:8080/login/oauth2/code/google
            scope: openid,email,profile
        provider:
          google:
            token-uri: https://www.googleapis.com/oauth2/v4/token
            user-info-uri: https://www.googleapis.com/oauth2/v2/userinfo
            authorization-uri: https://accounts.google.com/o/oauth2/v2/auth
            jwk-set-uri: https://www.googleapis.com/oauth2/v3/certs
```

## Step 5: Frontend Configuration

### Option A: Authorization Code Flow (Recommended - Server-Redirects)

```html
<!-- Link user to your backend OAuth endpoint -->
<a href="http://localhost:8080/oauth2/authorization/google">
  Sign in with Google
</a>
```

The authorization flow:
1. User clicks "Sign in with Google"
2. Browser redirects to Google login
3. Google redirects back to `http://localhost:8080/login/oauth2/code/google`
4. Spring Security exchanges code for tokens
5. OAuth2AuthenticationSuccessHandler redirects to frontend with JWT tokens

### Option B: Implicit Flow (Frontend Direct to Google)

For single-page apps using Google Sign-In button:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
<div id="g_id_onload"
     data-client_id="YOUR_GOOGLE_CLIENT_ID"
     data-callback="handleCredentialResponse">
</div>
<div class="g_id_signin" data-type="standard"></div>

<script>
function handleCredentialResponse(response) {
  // Send idToken to backend
  fetch('http://localhost:8080/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      idToken: response.credential
    })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('username', data.username);
    window.location.href = '/dashboard';
  });
}
</script>
```

## Step 6: Production Deployment

For production, update the configuration with your domain:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: YOUR_PRODUCTION_CLIENT_ID
            client-secret: YOUR_PRODUCTION_CLIENT_SECRET
            redirect-uri: https://yourdomain.com/login/oauth2/code/google
            scope: openid,email,profile
```

And update authorized redirect URIs in Google Cloud Console to match your production domain.

## Step 7: Testing

1. Start the backend: `mvn spring-boot:run`
2. Start the frontend
3. Click "Sign in with Google"
4. You should be redirected to your app with JWT tokens

## Troubleshooting

### "Redirect URI mismatch"
- Ensure the redirect URI in Google Cloud Console exactly matches your Spring Security configuration
- Check for trailing slashes and protocol (http vs https)

### "Invalid client"
- Verify Client ID and Client Secret are correct
- Ensure you enabled the Google+ API

### "Token expired"
- Use the refresh token to get a new access token via `/api/auth/refresh`

## Additional Notes

- **Token Validation**: The current implementation (`extractEmailFromToken`) is a placeholder. For production, integrate Google's auth library:
  ```xml
  <dependency>
    <groupId>com.google.auth</groupId>
    <artifactId>google-auth-library-oauth2-http</artifactId>
    <version>1.11.0</version>
  </dependency>
  ```

- **User Creation**: New users are created automatically on first Google login with email and username derived from email
- **Existing Users**: If a user already exists with that email, they're logged in without creating a new account

## Architecture

```
Frontend (Google Sign-In) 
    ↓
Backend /api/auth/google
    ↓
AuthService.authenticateWithGoogle()
    ↓
GoogleOAuth2UserService (if using OAuth2 login endpoint)
    ↓
OAuth2AuthenticationSuccessHandler
    ↓
Generate JWT tokens + Refresh token
    ↓
Return to Frontend
```
