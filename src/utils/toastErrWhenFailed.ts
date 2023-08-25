export function toastErrWhenFailed(promises: Promise<any>[]) {
  return Promise.all(promises).catch((err) => {
    console.log(err)
    alert(`Sync Failed! Please try again later. [${err?.message}]`)
  })
}
