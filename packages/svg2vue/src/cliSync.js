const fs = require("fs");
const cwd = process.cwd();
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
  
}