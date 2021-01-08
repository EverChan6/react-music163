import { useState, useEffect, useCallback } from "react";

const BASE_URL = 'https://corona.lmao.ninja/v2'

export function useCoronaAPI(path, { initialData = null, converter = data => data, refetchInterval = null}) {
  const [data, setData] = useState(initialData)
  const converteData = useCallback(converter, [])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${BASE_URL}${path}`)
      const data = await res.json()
      setData(converteData(data))
    }

    fetchData()

    if(refetchInterval) {
      const intervalId = setInterval(fetchData, refetchInterval)
      return () => clearInterval(intervalId)
    }
  }, [converteData, path, refetchInterval])

  return data
}

