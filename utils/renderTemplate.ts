import * as fs from 'node:fs'
import * as path from 'node:path'
import deepMerge from './deepMerge'
import sortDependencies from './sortDependencies'

/**
 * 生成目录文件
 * @param {string} src 模板路径
 * @param {string} dest 目标路径
 */
function renderTemplate(src, dest) {
  const stats = fs.statSync(src) // 获取路径的详细信息

  if (stats.isDirectory()) {
    if (path.basename(src) === 'node_modules') return// 跳过 node_modules 文件夹
    fs.mkdirSync(dest, { recursive: true }) // 自动递归创建父级目录
    for (const file of fs.readdirSync(src)) {
      renderTemplate(path.resolve(src, file), path.resolve(dest, file))
    }
    return
  }

  const filename = path.basename(src)

  // 合并 package.json
  if (filename === 'package.json' && fs.existsSync(dest)) {
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newPackage = JSON.parse(fs.readFileSync(src, 'utf8'))
    const pkg = sortDependencies(deepMerge(existing, newPackage))
    fs.writeFileSync(dest, `${JSON.stringify(pkg, null, 2)}\n`)
    return
  }

  fs.copyFileSync(src, dest)
}

export default renderTemplate
