const fs = require("fs")
const path = require("path")
const shell = require("shelljs")
const chalk = require("chalk")
const download = require('download-git-repo')
const ora = require("ora")
const symbols = require('log-symbols')
const inquirer = require("inquirer")
module.exports = (url, name, description, author) => {
  name = name.trim()
  const spinner = ora()
  console.log(chalk.white('\n Start generating... \n'))
  //  判断目录是否已存在
  let isHasDir = fs.existsSync(path.resolve(name));
  if (isHasDir) {
    spinner.fail('当前目录已存在!');
    return false;
  }
  spinner.start("Downloading...")
  download(url, name, err => {
    if (err) {
      spinner.fail()
      console.log(symbols.error, chalk.red(`Generation failed. ${err}`))
      return
    }
    fs.readFile(`./${name}/package.json`, 'utf8', (err, data) => {
      if (err) {
        spinner.stop()
        console.error(symbols.error, chalk.red(err))
        return
      }
      const packageJson = JSON.parse(data)
      packageJson.name = name
      packageJson.description = description.trim()
      packageJson.author = author.trim()
      const updatePackageJson = JSON.stringify(packageJson, null, 2)
      fs.writeFile(`./${name}/package.json`, updatePackageJson, 'utf8', err => {
        if (err) {
          spinner.stop()
          console.error(symbols.error, chalk.red(err))
          return
        }
        // 移除无用的文件
        shell.rm('-rf', `${name}/.git`)
        spinner.succeed();
        console.log(symbols.success, chalk.green('project init successfully!'))
        const shellOptionList = [
          {
            type: "confirm",
            message: "是否直接安装依赖",
            name: "install",
          }, {
            type: "list",
            message: "请选择依赖安装方式",
            name: "method",
            choices: ["npm install","cnpm install", "yarn"],
            when: function (answers) { // 当watch为true的时候才会提问当前问题
              return answers.install
            }
          }
        ]
        inquirer.prompt(shellOptionList).then(res => {
          if (res.install) {
            shell.cd(name)
            spinner.start(`正在帮你安装依赖...`);
            shell.exec(res.method)
            spinner.succeed('依赖安装成功!')
            console.log(`
                ${chalk.bgWhite.black('   Run This Project  ')}
                ${chalk.yellow(`cd ${name}`)}
                ${chalk.yellow('npm start')}
              `)
          } else {
            console.log(`
                ${chalk.bgWhite.black('   Run This Project  ')}
                ${chalk.yellow(`cd ${name}`)}
                ${chalk.yellow('npm install or yarn or cnpm install')}
                ${chalk.yellow('npm start')}
              `)
          }
          process.exit()
        })
      })
    })
  })
}
