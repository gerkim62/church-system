import { useRouter, useSearch } from '@tanstack/react-router'

function useRedirectUrl({
  // TODO:change this default when we have a better default
  fallbackUrl = '/app',
}: {
  fallbackUrl?: string
}) {
  const search = useSearch({ strict: false })
  const redirectUrl = search['redirect-url'] ?? fallbackUrl

  const router = useRouter()
  const goToRedirectUrl = () =>
    router.navigate({
      to: redirectUrl,
    })

  return { redirectUrl, goToRedirectUrl }
}

export default useRedirectUrl
