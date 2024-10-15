import process from 'node:process'

export function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent
  if (!userAgent) return 'pnpm'
  const regex = /(yarn|pnpm|npm)/
  const match = userAgent.match(regex)

  return match ? match[0] : 'pnpm'
}
