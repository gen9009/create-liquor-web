import process from 'node:process' // Node.js v18+ 提供
import { parseArgs } from 'node:util'

// 定义选项
const options: { [key: string]: Record<'type', 'string' | 'boolean'> } = {}

// 从命令行读取参数
const args = process.argv.slice(2)

// 使用 parseArgs 来解析命令行参数
export default parseArgs({
  args, // 传递的参数数组
  options, // 定义的参数选项
  strict: false, // 是否严格模式，非定义的参数是否报错
})
