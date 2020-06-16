const wait = (delay: number) => new Promise(resolve => {
  setTimeout(() => resolve(), delay * 1000)
})

export async function launchAndRetry<T>(func: Function, delay = 0): Promise<T> {
  if (delay) console.log('waiting for', delay)
  try {
    await wait(delay)
    return await func()
  } catch (e) {
    if (e?.errors?.[0]?.reason === 'userRateLimitExceeded') {
      console.log('userRateLimitExceeded')
    } else {
      console.log('er', e?.code, e?.errors)
    }
    return await launchAndRetry(func, (delay + 1) * 2)
  }
}