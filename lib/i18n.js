const dictionaries = {
  th: () => import('./i18n/th.json').then((module) => module.default),
  en: () => import('./i18n/en.json').then((module) => module.default),
  zh: () => import('./i18n/zh.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale || 'th']()
