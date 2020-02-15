import { OAuth2Client } from 'google-auth-library'
import config from '../config'
import { getNewToken } from './getNewToken'
import { Token } from './token'

export const getToken =
  (oauth2Client: OAuth2Client, token: Token): Promise<Token> =>
    token?.refresh_token ?
      Promise.resolve(token) :
      getNewToken(oauth2Client)


export const authenticateClient =
  (oauth2Client: OAuth2Client): Promise<OAuth2Client> =>
    getToken(oauth2Client, config.token)
      .then((token: Token) => {
        oauth2Client.setCredentials(token)
        return oauth2Client
      })
