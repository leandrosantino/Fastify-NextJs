import { copyFileSync as copyFile, mkdirSync as mkdir, existsSync, writeFileSync } from 'fs'
import { exec, ExecOptions } from 'child_process'
import path from 'path';
import ncp from 'ncp'
import { rimrafSync as rmdir } from 'rimraf'
import packageJson from './package.json'

const output = path.join(__dirname, '../app')

const paterns = {
  output,
  dir: [
    { from: path.join(__dirname, 'static'), to: path.join(output, 'core', 'static') },
    { from: path.join(__dirname, 'prisma'), to: path.join(output, 'prisma') },
    { from: path.join(__dirname, 'build', 'server'), to: path.join(output, 'core', 'server') },
  ],
};

(async () => {

  await shell('npm run export', {
    cwd: path.join(__dirname, '../view')
  })

  await shell('npm run build')

  console.log('- Clear output dir \n')
  rmdir(paterns.output)
  mkdir(paterns.output)
  console.log('- Create core dir \n')
  mkdir(path.join(paterns.output, 'core'))

  for await (let patern of paterns.dir) {
    await copyDir(patern.from, patern.to)
  }

  createPackageJson()

  await shell('npm i', {
    cwd: paterns.output
  })

  await shell('npm run db.migrate', {
    cwd: paterns.output
  })

})()


function createPackageJson() {
  packageJson.scripts.server = 'node core/server/index'
  writeFileSync(path.join(output, './package.json'), JSON.stringify(packageJson, null, 4))
}

function shell(command: string, options?: ExecOptions) {
  console.log(`- Exec: ${command} \n`)
  return new Promise<void>((resolve, reject) => {
    const process = exec(command, options, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
    process.stdout?.on('data', console.log)
    process.stderr?.on('data', console.error)
  })
}

function copyDir(from: string, to: string) {
  console.log(`- Copy from ${path.basename(from)} to ${path.basename(to)} \n`)
  return new Promise<void>((resolve, reject) => {
    ncp(from, to, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}
