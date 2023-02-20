import customFetch from "@/api/fetch"

export async function getMessages(_id: string) {
  try {
    const res = await customFetch('/chat/get-all', { _id })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}
