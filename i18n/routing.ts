import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "zh", "ja", "ko", "es", "fr", "de","it"],
  defaultLocale: "en",
  localePrefix: "as-needed",
})

export const localeNames: Record<string, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano", // Added locale name
}

export const localeFlags: Record<string, string> = {
  en: "🇺🇸",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ko: "🇰🇷",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  it: "🇮🇹", // Added locale flag
}
