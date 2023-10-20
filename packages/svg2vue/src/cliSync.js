const fs = require("fs");
const chalk = require("chalk");
const cwd = process.cwd();
const path = require("path");
module.exports = async () => {
  const configFile = "svg2vue.config.js";
  const configPath = path.join(cwd, configFile);
  if (!fs.existsSync(configPath)) {
    console.log(chalk.red(`请检查 ${configPath} 配置文件是否正确\n`));
    process.exit(1);
  }
  let options = require(configPath);

  if(!fs.existsSync(options.outputPath)) {
    fs.mkdirSync(options.outputPath, { recursive: true }, (err) => {
      if(err) {
        console.log(chalk.red(`创建文件夹 ${options.outputPath} 失败\n`));
        process.exit(1);
      }
    })
  }
  const inputPath = path.join(cwd ,options.inputPath);
  const outputPath = path.join(cwd ,options.outputPath);

  fs.readdir(inputPath, async (err, files) => {
    if(err) {
      console.log(chalk.red(`读取文件夹 ${inputPath} 失败\n`));
      process.exit(0);
    }
    // 如果输入文件不存在，则创建
    if(!fs.existsSync(outputPath)){
      fs.mkdirSync(outputPath);
    }
  })
}