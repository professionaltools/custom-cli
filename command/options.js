const templateInfos = [
  // {
  //   type: 'list',
  //   name: 'tplName',
  //   message: 'Select the project platform：',
  //   choices: ['vue', 'react']
  // },
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter the project name：',
    validate(val) {
      if (val.trim() === '') {
        return 'please enter the project name'
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'description',
    message: 'Enter the project description：',
  },
  {
    type: 'input',
    name: 'author',
    message: 'Enter the project author：',
  }
]
const shellOptionList = [
  {
    type: "list",
    message: "请选择依赖安装方式",
    name: "method",
    choices: ["no", "npm install", "cnpm install", "yarn"],
  }
]
module.exports = {
  templateInfos,
  shellOptionList
}
