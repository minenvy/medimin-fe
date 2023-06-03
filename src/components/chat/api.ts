import customFetch from "@/api/fetch"

export async function getMessages(_id: string) {
  try {
    const res = await customFetch('/chat/get-all', { _id }) as Response
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

export async function chatWithBot(question: string) {
  const options = {
    method: 'post',
    body: JSON.stringify({ question }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }
  const res = await fetch('http://127.0.0.1:5000/chat', options).catch(err => console.log(err)) as Response
  const data = await res.json()
  return data
}
