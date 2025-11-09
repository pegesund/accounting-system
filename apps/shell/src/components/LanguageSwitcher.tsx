import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t('common.language')}:</span>
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="no">{t('languages.no')}</option>
        <option value="en">{t('languages.en')}</option>
      </select>
    </div>
  );
}
