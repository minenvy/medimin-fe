import { domain } from "@/constants/links"

function customFetch(path: string, body?: any) {
  return new Promise((resolve) =>
    resolve(
      fetch(domain + path, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
        .catch(err => console.log(err)))
  )
}

export default customFetch
