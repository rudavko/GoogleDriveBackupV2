require('dotenv').config()
import fs from 'fs'

let refreshToken
if (fs.existsSync('token.json')) {
  refreshToken = JSON.parse(fs.readFileSync('token.json').toString())
}
if (!process.env.CLIENT_ID) throw new Error('No client ID specified in .env')
if (!process.env.CLIENT_SECRET) throw new Error('No client secret specified in .env')
export default {
  scope: 'https://www.googleapis.com/auth/drive.file',
  credentials: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  },
  refreshToken
}
