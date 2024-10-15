#!/usr/bin/env node
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { Answers } from 'prompts'
import parseArgs from 'utils/parseArgs'
import renderTemplate from 'utils/renderTemplate'
import { isExistsFile, isValidPackageName } from 'utils/validate'
import { detectPackageManager } from 'utils/packageManager'
import { blue, bold, yellow, green } from 'picocolors'
import prompts from 'prompts'

async function init() {
  const { values: argv, positionals } = parseArgs
  console.log('🚀::::::🐶💩', argv)
  let answer = [] as Answers<string>
  async function askNext() {
    answer = await prompts([
      {
        type: 'text',
        name: 'projectName',
        message: `🍋 请输入你希望创建的项目名称?`,
        initial: 'liquor-demo',
        validate: (value: string) => !isValidPackageName(value) ? '🍒 项目名称不合法' : true,
      },
      {
        type: 'confirm',
        name: 'shouldOverwrite',
        message: '🍎 是否覆盖同名项目?',
      },
      {
        type: 'select',
        name: 'cssEngine',
        message: '🍓 请选择你希望集成的css预设?',
        choices: [
          { title: 'unocss', value: 'unocss' },
          { title: 'tailwind', value: 'tailwind' },
        ],
      },
      {
        type: 'select',
        name: 'ui',
        message: '🍓 请选择你希望集成的ui组件库?',
        choices: [
          { title: 'ElementPlus', value: 'elementplus' },
          { title: 'Acro', value: 'acro' },
          { title: 'Vuetifyjs', value: 'vuetifyjs' },
        ]
      }
    ])
    return answer
  }

  try {
    console.log()
    console.log(blue(bold(`创建你的 vue3+vite+ts+ui 模版👇${yellow('便于书写demo')}`)))
    console.log()

    const answer = await askNext()
    console.log('🚀::::::🐶💩', answer)

    const { shouldOverwrite, projectName, cssEngine, ui } = answer


    // 如果目录存在，清空文件夹
    let dest = path.join(process.cwd(), projectName)
    if (fs.existsSync(path.join(process.cwd(), projectName))) {
      fs.rmSync(path.join(process.cwd(), projectName), { recursive: true })
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





    let packageManager = detectPackageManager()
    console.log(``)
    console.log(bold(green(`cd ${projectName}`)))
    console.log(bold(green(`${packageManager} install`)))
    console.log(bold(green(`${packageManager == 'npm' ? 'npm run dev' : `${packageManager} dev`}`)))
    console.log(``)
  }
  catch (error) {
    console.log(`👉🏼 Error: 构建失败---${JSON.stringify(error)}`)
  }
}
init()
