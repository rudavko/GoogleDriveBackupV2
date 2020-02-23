import { createServer } from 'http'
import config from '../config'
import { Token, makeToken } from './token'
import { OAuth2Client } from 'google-auth-library'
import { saveToken } from './saveToken'

const getAuthUrl = (oauth2Client: OAuth2Client, redirectURI: string) =>
  oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.scope,
    redirect_uri: redirectURI
  })

export const waitForCode = (oauth2Client: OAuth2Client): Promise<string> =>
  new Promise((resolve, reject) => {
    let port = 8080
    const server = createServer((req, resp) => {
      if (!req.url) return reject('No url provided')
      const code = new URL(req.url, `http://localhost`).searchParams.get('code')
      if (!code) return reject('No refresh token')

      resp.write('You can close this!')
      resp.end()
      req.connection.unref()
      server.close()

      return resolve(code)
    }).listen(port)

    const redirectURI = encodeURI(`http://localhost:${port}`)
    const authUrl = getAuthUrl(oauth2Client, redirectURI)

    console.log('Please authenticate this app by visiting this url:')
    console.log(authUrl)
  })


export const getNewToken =
  (oauth2Client: OAuth2Client):
    Promise<Token> => waitForCode(oauth2Client)
      .then(code => oauth2Client.getToken(code))
      .then(token => {
        const refreshToken = makeToken(token.tokens.refresh_token || '')
        saveToken(refreshToken)
        return refreshToken
      })

