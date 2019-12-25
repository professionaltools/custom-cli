const inquirer = require("inquirer")
const questions = require("../configs")
const common = require("./common")
module.exports = (url, name) => {
  inquirer.prompt(questions.options.slice(-2)).then(({description, author}) => {
    common(url, name, description, author)
  })
}
