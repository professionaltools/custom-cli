#!/usr/bin/env node
const program = require("commander")
const chalk = require("chalk")
program.version(require("../package.json").version, '-v,--version')
program.name('custom').usage("[global options] command")

program.command("init <projectName>")
  .alias('i')
  .description("generate a new project")
  .action(desc => {
    require("../command/init").init(desc)
  })
program.command("use <templateUrl> <projectName>")
  .description("generate a new project straight from a github template")
  .alias('u')
  .action(() => {
    const args = program.args
    if (program.args.length !== 2) {
      program.help()
    } else {
      require("../command/init").init(args[1],args[0])
    }
  })
program.on("--help", () => {
  console.log()
  console.log(chalk.bgWhite.black('  Examples:'))
  console.log()
  console.log(chalk.gray('    # generate a new project with tips'))
  console.log('    $ custom init')
  console.log()
  console.log(chalk.gray('    # create a new project straight from a github template'))
  console.log('    $ custom use username/repo my-project')
  console.log()
})
program.parse(process.argv)
