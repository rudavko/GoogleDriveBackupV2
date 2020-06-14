import { getFiles } from '../files/getHierarchy'

export const upload = async (dirPath: string) => {
  const files = getFiles(dirPath)
  for await (let file of files) {
    console.log(file.name, file.isDirectory())
  }
  console.log('finished getting the files')
}


