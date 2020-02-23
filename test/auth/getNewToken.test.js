describe('creates server', () => {
  const server = {
    close: jest.fn(),
    listen: jest.fn(() => server)
  }
  const createServer = jest.fn(() => server)
  jest.setMock('http', { createServer })
  beforeEach(() => jest.clearAllMocks())
  it('processes code fine', done => {
    const code = 'lol123hfhf'
    const { waitForCode } = require('../../src/auth/getNewToken')
    const url = `http://localhost:8080?code=${code}`
    const oauth2ClientMock = {
      generateAuthUrl: jest.fn(() => url)
    }
    const req = {
      url,
      connection: {
        unref: jest.fn()
      }
    }
    const resp = {
      write: jest.fn(),
      end: jest.fn()
    }
    waitForCode(oauth2ClientMock)
      .then(v => {
        expect(v).toBe(code)
        console.log('v', v)
        done()
      })
    const makeRequest = createServer.mock.calls[0][0]
    makeRequest(req, resp)
  })
  it('processes with no code fine', done => {
    const { waitForCode } = require('../../src/auth/getNewToken')
    const url = `http://localhost:8080?error=invalid_grant`
    const oauth2ClientMock = {
      generateAuthUrl: jest.fn(() => url)
    }
    const req = {
      url,
      connection: {
        unref: jest.fn()
      }
    }
    const resp = {
      write: jest.fn(),
      end: jest.fn()
    }
    waitForCode(oauth2ClientMock)
      .catch(v => {
        expect(v).toBe('No refresh token')
        console.log('v', v)
        done()
      })
    const makeRequest = createServer.mock.calls[0][0]
    makeRequest(req, resp)
  })
  describe('gets new  token', () => {
    const refreshToken = 'jfkr93jg49FR43kk'
    const getToken = jest.fn(() => Promise.resolve({
      tokens: {
        refresh_token: refreshToken
      }
    }))
    const saveToken = jest.fn()
    const oauth2ClientMock = {
      getToken,
      generateAuthUrl: jest.fn(() => '')
    }
    jest.setMock('../../src/auth/saveToken', { saveToken })
    const { getNewToken } = require('../../src/auth/getNewToken')

    it('fine', done => {
      const req = {
        url: 'http://localhost:8080?code=hjkhjkhjk',
        connection: {
          unref: jest.fn()
        }
      }
      const resp = {
        write: jest.fn(),
        end: jest.fn()
      }

      getNewToken(oauth2ClientMock)
        .then(v => {
          expect(v.refresh_token).toBe(refreshToken)
          done()
        })
      const makeRequest = createServer.mock.calls[0][0]
      makeRequest(req, resp)
    })
  })
})

