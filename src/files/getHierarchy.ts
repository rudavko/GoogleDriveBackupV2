import fs from 'fs'
import path from 'path'
interface FileInfo {
  dir: fs.Dir
  dirent?: fs.Dirent
}
export const getFiles = async function* (dirPath: string):
  AsyncGenerator<FileInfo> {
  if (!fs.existsSync(dirPath)) return
  const dir = await fs.promises.opendir(dirPath)
  yield { dir }
  for await (let dirent of dir) {
    if (dirent.isDirectory()) {
      yield* getFiles(path.join(dir.path, dirent.name))
    } else {
      yield { dir, dirent }
    }
  }
  return
}
