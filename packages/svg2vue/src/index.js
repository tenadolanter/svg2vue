const PKG = require("../package.json");
const cliInit = require("./cliInit.js");
const cliSync = require("./cliSync.js");
module.exports = (program) => {
  program
  .name(PKG.name)
  .description(PKG.description)
  .version(PKG.version, '-v, --version')

  // 初始化
  program
    .command("init")
    .alias("i")
    .description("初始化配置")
    .action(() => {
      cliInit();
    });

  // 生成
  program
    .command("sync")
    .alias("s")
    .description("生成组件")
    .action(() => {
      cliSync();
    });
};
