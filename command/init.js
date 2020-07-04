const fs = require("fs")
const path = require("path")
const {exec, spawn} = require("child_process")
const ora = require("ora")
const {promisify} = require("util")
const download = promisify(require("download-git-repo"))
const clear = require("clear")
const chalk = require("chalk")
const inquirer = require("inquirer")
const templates = require("../templates")
const {templateInfos, shellOptionList} = require("./options")
const spawnFunc = async (...args) => {
  return new Promise(resolve => {
    const proc = spawn(...args)
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
    proc.on("close", () => {
      resolve()
    })
  })
}
const METHODS = ["npm install", "cnpm install", "yarn"]
const MAP = {
  0: "npm",
  1: "cnpm",
  2: "yarn"
}
const spinner = ora()
module.exports.init = async (desc, templateURL = "") => {
  clear()
  desc = desc.trim()
  //  判断目录是否已存在
  let isHasDir = fs.existsSync(path.resolve(desc))
  if (isHasDir) {
    spinner.fail("当前目录已存在！")
    return
  }
  if (templateURL === "") {
    templateInfos.unshift({
      type: 'list',
      name: 'tplName',
      message: 'Select the project platform：',
      choices: ['vue', 'react']
    })
  }
  const {tplName, projectName, description, author} = await inquirer.prompt(templateInfos)
  templateURL = templateURL ? templateURL : templates[tplName].url

  spinner.start("Download......")
  await download(templateURL, desc)
  fs.readFile(`${desc}/package.json`, 'utf8', (err, data) => {
    const packageJson = JSON.parse(data)
    packageJson.name = projectName
    packageJson.description = description.trim()
    packageJson.author = author.trim()
    const updatePackageJson = JSON.stringify(packageJson, null, 2)
    fs.writeFile(`./${desc}/package.json`, updatePackageJson, 'utf8', async err => {
      //移除无用文件
      await exec(`rm -rf ${desc}/.git`)
      spinner.succeed()
      const {method} = await inquirer.prompt(shellOptionList)
      if (METHODS.includes(method)) {
        const index = METHODS.indexOf(method)
        let spawnList = index === 2 ? [] : ["install"]
        await spawnFunc(MAP[index], spawnList, {cwd: `./${desc}`})
        console.log(`
                ${chalk.bgWhite.black('   Run This Project  ')}
                ${chalk.yellow(`cd ${desc}`)}
                ${chalk.yellow('npm start')}
              `)
      } else {
        console.log(`
                ${chalk.bgWhite.black('   Run This Project  ')}
                ${chalk.yellow(`cd ${desc}`)}
                ${chalk.yellow('npm install or yarn or cnpm install')}
                ${chalk.yellow('npm start')}
              `)
      }
    })
  })
}
