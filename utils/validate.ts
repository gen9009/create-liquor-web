import fs from 'node:fs'
/**
 * 检查指定目录是否存在且包含有效文件
 *
 * @param {string} dir - 要检查的目录路径
 * @returns {boolean} - 如果目录存在且包含文件（不包含仅有 `.git` 的情况），返回 `true`，否则返回 `false`
 */
export function isExistsFile(dir: string): boolean {
  // 检查目录是否存在
  if (!fs.existsSync(dir)) {
    return false // 如果目录不存在，返回 false
  }

  // 读取目录中的文件列表
  const files = fs.readdirSync(dir)

  // 如果目录为空，返回 false
  if (files.length === 0) {
    return false
  }

  // 如果目录中只有一个文件且该文件是 `.git`，认为该目录没有有效文件，返回 false
  if (files.length === 1 && files[0] === '.git') {
    return false
  }

  // 否则，目录存在且包含有效文件，返回 true
  return true
}

/**
 * @description:  校验是否为合法的项目名
 * @return {boolean}
 * @param {string} name
 */
export function isValidPackageName(name: string): boolean {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
}
