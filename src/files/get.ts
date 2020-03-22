import fs from 'fs'
import path from 'path'

export const getFiles = async function* (dirPath: string):
  AsyncGenerator<fs.Dirent> {
  if (!fs.existsSync(dirPath)) return
  const dir = await fs.promises.opendir(dirPath)
  for await (let dirent of dir) {
    if (dirent.isDirectory()) {
      yield* getFiles(path.join(dir.path, dirent.name))
    } else {
      yield dirent
    }
  }
  return
}
