#!/usr/bin/env zx

const fs = require('node:fs/promises')
const process = require('node:process')
const { red, yellow, yellowBright } = require('picocolors')
require('zx/globals')

$.verbose = true

async function exce() {
  try {
  // 检查是否是 pnpm 或 npm 环境
    if (!/pnpm|npm|yarn/.test(process.env.npm_config_user_agent ?? ''))
      throw new Error(`${red('𝙭')} 请使用 pnpm/npm/yarn 运行此脚本`)

    // 读取 package.json 版本号
    const packageJson = JSON.parse(await fs.readFile('./package.json'))
    const { version } = packageJson

    // 自动更新版本号 (patch, minor, or major)
    let args = process.argv.slice(3) || []
    const bumpType =  args[0]|| 'patch' // 默认是 patch 版本
    await $`npm version ${bumpType}`

    // 获取更新后的版本号
    const newVersion = JSON.parse(await fs.readFile('./package.json')).version
    console.log(`版本更新: ${yellow(version)} -> ${yellowBright(newVersion)}`)

    // 提交到 Git，添加标签
    // await $`git tag -a v${newVersion} -m "Release version ${newVersion}"`
    await $`git push --follow-tags`

    // 发布到 npm
    await $`npm publish --access public`
  }
  catch (error) {
    console.log(error.message)
  }
}
exce()
