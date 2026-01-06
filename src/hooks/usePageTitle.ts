import { useEffect } from 'react'

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | Zamm`
    return () => {
      document.title = 'Zamm'
    }
  }, [title])
}
