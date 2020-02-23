import fs from 'fs'
import { Token } from './token'
export const saveToken = (refreshToken: Token) =>
  fs.writeFileSync('token.json', JSON.stringify(refreshToken))
