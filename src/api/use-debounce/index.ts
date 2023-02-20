import { useEffect, useState } from 'react'

function useDebounce(data: unknown) {
	const [value, setValue] = useState(data)

	useEffect(() => {
		const timer = setTimeout(() => {
			setValue(data)
		}, 300)

		return () => clearTimeout(timer)
	}, [data])

	return value
}

export default useDebounce
