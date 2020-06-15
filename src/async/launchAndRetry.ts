const wait = (delay: number) => new Promise(resolve => {
  setTimeout(() => resolve(), delay * 1000)
})

export async function launchAndRetry<T>(func: Function, delay = 0): Promise<T> {
  if (delay) console.log('waiting for', delay)
  try {
    await wait(delay)
    return await func()
  } catch (e) {
    console.log('er', e)
    return await launchAndRetry(func, (delay + 1) * 2)
  }
}