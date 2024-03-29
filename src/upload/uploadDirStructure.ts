import fs from 'fs'
import path from 'path'
import { drive_v3 } from 'googleapis'
import { GaxiosPromise } from 'gaxios'

import { FOLDER_TYPE } from '../config/constants'
import { getFiles } from '../files/getHierarchy'
import { launchAndRetry } from '../async/launchAndRetry'

interface FileStructure {
  [path: string]: (string | FileStructure)[]
}
interface DirDriveIds {
  [path: string]: string | null | undefined
}

export const getFolderNameFromPath = (pathName: string): string =>
  pathName.split(path.sep).pop() || ''

const deleteFile = (filePath: string) =>
  fs.promises.unlink(filePath)
    .then(() => console.log('deleted', filePath))
    .catch(er => console.log(er))

export const uploadDirStructure = async (dirPath: string, drive: drive_v3.Drive): Promise<(FileStructure | DirDriveIds)[]> => {
  const files = getFiles(dirPath)
  const fileStructure: FileStructure = {}
  const dirDriveIds: DirDriveIds = {
    [dirPath]: ''
  }
  for await (let { dir, dirent } of files) {
    if (dirent) {
      console.log('checking file', dirent.name)
      const filePath = path.join(dir.path, dirent.name)
      const fileRequest = await launchAndRetry<GaxiosPromise<drive_v3.Schema$FileList>>(
        () => drive.files.list({ q: `'${dirDriveIds[dir.path]}' in parents and name = "${dirent?.name}"` }))
      const files = fileRequest?.data?.files
      if (files?.length) {
        await deleteFile(filePath)
      } else {
        const media = {
          body: fs.createReadStream(filePath)
        }
        console.log('uploading', dirent.name);
        console.time('uploaded ' + dirent.name)
        const fileUpload = await launchAndRetry<GaxiosPromise<drive_v3.Schema$File>>(() => drive.files.create({
          media,
          requestBody: {
            name: dirent?.name,
            parents: [dirDriveIds[dir.path] || '']
          }
        }))
        if (fileUpload?.status === 200) {
          await deleteFile(filePath)
        } else {
          console.log(fileUpload);
        }
        console.timeEnd('uploaded ' + dirent.name)
      }
    } else {
      const folderName = getFolderNameFromPath(dir.path)
      const response = await drive.files.list({ q: `name = "${folderName}"` })
      if (response?.data?.files?.length) {
        dirDriveIds[dir.path] = response?.data?.files?.pop()?.id
      } else {
        const requestBody: { [key: string]: string | string[] } = {
          name: folderName,
          mimeType: FOLDER_TYPE,
        }

        const parentId = dirDriveIds[path.dirname(dir.path)]
        if (parentId) {
          requestBody.parents = [parentId]
        }
        const response = await launchAndRetry<GaxiosPromise<drive_v3.Schema$File>>(() => drive.files.create({
          requestBody
        }))
        dirDriveIds[dir.path] = response?.data?.id
        console.log('created', response?.status)
      }
    }
  }
  console.log('finished uploading the files')
  return [fileStructure, dirDriveIds]
}


