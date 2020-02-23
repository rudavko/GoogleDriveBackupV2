import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import config from '../config'
import { authenticateClient } from './authenticateClient'

export const getOAuth2Client = (): OAuth2Client => {
  const { clientId, clientSecret } = config.credentials
  return new google.auth.OAuth2(clientId, clientSecret, 'http://localhost:8080')
}

export const getAuth = (): Promise<OAuth2Client> => {
  const oauth2Client = getOAuth2Client()
  return authenticateClient(oauth2Client)
}
