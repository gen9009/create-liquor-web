#!/usr/bin/env node
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { Answers } from 'prompts'
import parseArgs from 'utils/parseArgs'
import renderTemplate from 'utils/renderTemplate'
import { isExistsFile, isValidPackageName } from 'utils/validate'
import { detectPackageManager } from 'utils/packageManager'
import { bold, yellow, green, red, blueBright } from 'picocolors'
import boxen from 'boxen';
import ora from 'ora'

import prompts from 'prompts'

async function init() {
  const { values: argv, positionals } = parseArgs
  let targetDir = positionals[0] || ''
  const defaultProjectName = !targetDir ? 'liquor-demo' : targetDir

  async function askNext() {
    return await prompts(
      [
        {
          type: targetDir ? null : 'text',
          name: 'projectName',
          message: `🍋 请输入你希望创建的项目名称?`,
          initial: defaultProjectName,
          validate: (value: string) => !isValidPackageName(value) ? `${red('𝙭')} 项目名称不合法` : true,
          onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName)
        },
        {
          type: () => !isExistsFile(targetDir) ? null : 'toggle',
          name: 'shouldOverwrite',
          message: '🍎 是否覆盖同名项目?',
          inactive: '否',
          active: '是',
        },
        {
          name: 'overwriteChecker',
          type: (prev, values) => {
            if (values.shouldOverwrite === false) {
              throw new Error(red('𝙭') + ` 构建取消`)
            }
            return null
          }
        },
        {
          type: 'select',
          name: 'cssEngine',
          message: '🥥 请选择你希望集成的css预设?',
          choices: [
            { title: 'unocss', value: 'unocss' },
            { title: 'tailwind', value: 'tailwind' },
          ],
        },
        {
          type: 'select',
          name: 'ui',
          message: '🍐 请选择你希望集成的ui组件库?',
          choices: [
            { title: 'ElementPlus', value: 'elementplus' },
            { title: 'Arco', value: 'arco' },
            { title: 'Vuetifyjs', value: 'vuetifyjs' },
          ]
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('𝙭') + ` 构建取消`)
        }
      })
  }

  console.log()
  console.log(boxen(blueBright((`创建你的vue3+vite+ts+ui模版，${bold(yellow('便于编码demo'))}`)), { padding: { top: 0.2, right: 1, bottom: 0.2, left: 1 }, margin: 0.1, borderColor: '#bd9d51', borderStyle: 'round' }))
  console.log()

  let answer = {} as Answers<string>
  try {
    answer = await askNext()
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }

  const { shouldOverwrite, cssEngine, ui } = answer
  // 添加loading
  const spinner = ora({
    text: yellow('初始化项目中...'),
    color: 'green',
  })
  console.log()
  spinner.start()
  console.log()

  // 如果目录存在，清空文件夹
  let dest = path.join(process.cwd(), targetDir)
  if (fs.existsSync(dest) || shouldOverwrite) {
    fs.rmSync(dest, { recursive: true })
  }
  // 如果不存在，创建文件夹
  else {
    fs.mkdirSync(dest)
  }
  function render(templateName: string) {
    const templateTarget = path.resolve(__dirname, `template/${templateName}`)
    renderTemplate(templateTarget, dest)

  }

  // 创建模版
  render('base')
  // 集成css预设
  render(`css-engine/${cssEngine}`)
  // 集成ui组件配置
  render(`comp/${ui}`)
  // 集成入口配置
  let entry = [cssEngine, ui].join('-')
  render(`entry/${entry}`)
  // 集成vite配置
  render(`vite-plugin/${cssEngine}`)

  // 修改package.json初始化项目名称
  const packageJson = JSON.parse(fs.readFileSync(path.join(dest, 'package.json')).toString())
  packageJson.name = targetDir
  fs.writeFileSync(path.join(dest, 'package.json'), JSON.stringify(packageJson, null, 2))

  spinner.text = `${green('初始化项目成功')}\n\n🍍 ${dest} `
  spinner.succeed()

  let packageManager = detectPackageManager()
  console.log(``)
  console.log(blueBright('📖 可执行以下命令'))
  console.log(bold(green(`cd ${targetDir}`)))
  console.log(bold(green(`${packageManager} install`)))
  console.log(bold(green(`${packageManager == 'npm' ? 'npm run dev' : `${packageManager} dev`}`)))
  console.log(``)

}
init()
