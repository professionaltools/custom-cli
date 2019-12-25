const templates = require("../templates")
const inquirer = require("inquirer")
const questions = require("../configs")
const common = require("./common")
module.exports = () => {
  inquirer.prompt(questions.options).then(({tplName, name, description, author}) => {
    const url = templates[tplName].url
    common(url, name, description, author)
  })
}
