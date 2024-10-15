import * as esbuild from 'esbuild'

/*
  打包入口 src/main.ts
  打包输出 lib
  打包格式 esm
*/
await esbuild.build({
  entryPoints: ['main.ts'],
  bundle: true,
  outfile: 'outfile.cjs',
  format: 'cjs',
  minify: false, // 是否压缩代码
  sourcemap: false,
  platform: 'node',
})
