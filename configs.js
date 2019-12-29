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
      if(val !== ''){
        return val
      }
      return 'please enter the project name'
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
