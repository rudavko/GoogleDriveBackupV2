import { google } from 'googleapis'
import { getAuth } from './auth/auth'
import { uploadDirStructure } from './upload/uploadDirStructure'
import { dirPaths } from './config/dirPath'

console.log('STARTED')
getAuth()
  .then(auth => {
    if (!auth) return
    const drive = google.drive({ version: 'v3', auth })
    return Promise.all(dirPaths.map(dirPath => uploadDirStructure(dirPath, drive)))
  })
  .then(result => console.log(result))
  .catch(er => console.log('err:', er))

