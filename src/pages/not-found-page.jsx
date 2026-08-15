import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg">{t('not_found.message')}</p>
      <Link to="/" className="text-blue-500 underline">
        {t('not_found.back_home')}
      </Link>
    </div>
  )
}

export default NotFoundPage
