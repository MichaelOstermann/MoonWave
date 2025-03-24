import { signal } from '../signal'

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
export const $prefersDarkMode = signal(prefersDarkMode.matches)
prefersDarkMode.addEventListener('change', event => $prefersDarkMode.set(event.matches))
