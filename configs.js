const options = [
  {
    type: 'list',
    name: 'tplName',
    message: 'Select the project platform：',
    choices: ['vue', 'react']
  },
  {
    type: 'input',
    name: 'name',
    message: 'Enter the project name：',
    validate(val) {
      return val !== ''
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
module.exports = {
  options,
}
