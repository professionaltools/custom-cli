const fs = require("fs")
const chalk = require("chalk")
const download = require('download-git-repo')
const ora = require("ora")
const symbols = require('log-symbols')
module.exports = (url, name, description, author) => {
  console.log(chalk.white('\n Start generating... \n'))
  const spinner = ora("Downloading...")
  spinner.start()
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
      packageJson.description = description
      packageJson.author = author
      const updatePackageJson = JSON.stringify(packageJson, null, 2)
      fs.writeFile(`./${name}/package.json`, updatePackageJson, 'utf8', err => {
        if (err) {
          spinner.stop()
          console.error(symbols.error, chalk.red(err))
          return
        }
        spinner.succeed();
        console.log(symbols.success, chalk.green('project init successfully!'))
        console.log(`
            ${chalk.bgWhite.black('   Run This Project  ')}
            ${chalk.yellow(`cd ${name}`)}
            ${chalk.yellow('npm install')}
            ${chalk.yellow('npm start')}
          `)
        process.exit()
      })
    })
  })
}
