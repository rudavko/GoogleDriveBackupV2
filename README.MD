## Uploading the specifiend catalog structure to Google Drive
### Configuration
1. Get client id and client secret from (Google Cloud)[https://console.cloud.google.com/apis/credentials], and put into .env:
```
CLIENT_ID=<client_id>
CLIENT_SECRET=<client_secret>
```
2. Update the path in config/dirPath.ts
3. 
```
npm i
npm run start
```
Should prompt you to visit the login page, copy the token and paste back into the terminal.
After that the upload should begin.
