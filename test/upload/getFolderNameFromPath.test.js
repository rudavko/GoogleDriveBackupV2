
const { getFolderNameFromPath } = require('../../src/upload/uploadDirStructure')

it('breaks the path properly', () => {
  const path = '/Users/username/code/GoogleDriveBackupV2/dir'
  expect(getFolderNameFromPath(path)).toEqual('dir')
})
it('breaks the path properly', () => {
  const path = '/Users/username/code/GoogleDriveBackupV2/dir/t2'
  expect(getFolderNameFromPath(path)).toEqual('t2')
})
it('breaks the path properly', () => {
  const path = ''
  expect(getFolderNameFromPath(path)).toEqual('')
})
it('breaks the path properly', () => {
  const path = '/'
  expect(getFolderNameFromPath(path)).toEqual('')
})
it('breaks the path properly', () => {
  const path = 'lol/'
  expect(getFolderNameFromPath(path)).toEqual('')
})