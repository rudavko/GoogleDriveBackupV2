import { google } from 'googleapis'
import { getAuth } from './auth'

getAuth()
  .then(auth => {
    if (!auth) return
    const drive = google.drive({ version: 'v3', auth })
    return drive.about.get({ fields: 'storageQuota' })
  })
  .then(result => console.log(result))
  .catch(er => console.log('err:', er))

