import path from 'path'
import fs from 'fs'
import { getFiles } from '../files/getHierarchy'
import { drive_v3 } from 'googleapis'
import { FOLDER_TYPE } from '../config/constants'

interface FileStructure {
  [path: string]: (string | FileStructure)[]
}
interface DirDriveIds {
  [path: string]: string | null | undefined
}

export const getFolderNameFromPath = (pathName: string): string =>
  pathName.split(path.sep).pop() || ''

export const uploadDirStructure = async (dirPath: string, drive: drive_v3.Drive): Promise<(FileStructure | DirDriveIds)[]> => {
  const files = getFiles(dirPath)
  const fileStructure: FileStructure = {}
  const dirDriveIds: DirDriveIds = {
    [dirPath]: ''
  }
  for await (let { dir, dirent } of files) {
    if (dirent) {
      console.log('checking file', dirent.name)
      const fileRequest = await drive.files.list({ q: `'${dirDriveIds[dir.path]}' in parents and name = '${dirent.name}'` })
      const files = fileRequest?.data?.files
      if (!files?.length) {
        const media = {
          body: fs.createReadStream(path.join(dir.path, dirent.name))
        }
        console.log('uploading', dirent.name);
        console.time('uploaded ' + dirent.name)
        const fileUpload = await drive.files.create({
          media,
          requestBody: {
            name: dirent.name,
            parents: [dirDriveIds[dir.path] || '']
          }
        })
        if (fileUpload?.status !== 200) {
          console.log(fileUpload);
        }
        console.timeEnd('uploaded ' + dirent.name)
      }
    } else {
      const folderName = getFolderNameFromPath(dir.path)
      const response = await drive.files.list({ q: `name = '${folderName}'` })
      if (!response?.data?.files?.length) {
        const requestBody: { [key: string]: string | string[] } = {
          name: folderName,
          mimeType: FOLDER_TYPE,
        }

        const parentId = dirDriveIds[path.dirname(dir.path)]
        if (parentId) {
          requestBody.parents = [parentId]
        }
        const response = await drive.files.create({
          requestBody
        })
        dirDriveIds[dir.path] = response?.data?.id
        console.log('created', response?.status)
      } else {
        dirDriveIds[dir.path] = response?.data?.files?.pop()?.id
      }
    }
  }
  console.log('finished uploading the files')
  return [fileStructure, dirDriveIds]
}


