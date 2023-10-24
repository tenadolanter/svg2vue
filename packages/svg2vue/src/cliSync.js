const fs = require("fs");
const chalk = require("chalk");
const cwd = process.cwd();
const path = require("path");
const prettier = require("prettier");
module.exports = async () => {
  const configFile = "svg2vue.config.js";
  const iconFolderName = "icons";
  const configPath = path.join(cwd, configFile);
  if (!fs.existsSync(configPath)) {
    console.log(chalk.red(`请检查 ${configPath} 配置文件是否正确\n`));
    process.exit(1);
  }
  let options = require(configPath);

  if (!fs.existsSync(options.outputPath)) {
    fs.mkdirSync(options.outputPath, { recursive: true }, (err) => {
      if (err) {
        console.log(chalk.red(`创建文件夹 ${options.outputPath} 失败\n`));
        process.exit(1);
      }
    });
  }
  const inputPath = path.join(cwd, options.inputPath);
  const outputPath = path.join(cwd, options.outputPath);
  const createEnterFile = (outputPath) => {
    let content = `<template>
      <component
        v-if="$options.components[name]"
        :is="$options.components[name]"
      ></component>
    </template>
    <script>
    import icons from "./config.js"
    export default {
      props: {
        name: {
          type: String,
          required: true
        }
      },
      components: {
        ...icons,
      }
    }
    </script>
    `;
    const outPath = path.join(outputPath, "index.vue");
    content = prettier.format(content, {
      parser: "vue",
      singleQuote: true,
      semi: false,
    });
    fs.writeFile(outPath, content, (error) => {
      if (error) {
        console.log(chalk.red(`创建文件 ${outPath} 失败\n`));
        process.exit(1);
      }
    });
  };
  const createConfigFile = (files, outputPath) => {
    const len = files.length;
    let components = "";
    for (let i = 0; i < len; i++) {
      const { name, ext } = path.parse(files[i]);
      if (ext === ".svg") {
        components += `"${name}": ()=>import("./${iconFolderName}/${name}.vue"),\n`;
      }
    }
    let content = `export default {\n ${components} } `;
    content = prettier.format(content, {
      parser: "babel",
      singleQuote: true,
      trailingComma: "es5",
    });
    const outPath = path.join(outputPath, "config.js");
    fs.writeFile(outPath, content, (error) => {
      if (error) {
        console.log(chalk.red(`创建文件 ${outPath} 失败\n`));
        process.exit(1);
      }
    });
  };

  const createIconComponent = (fileName, content, outputPath) => {
    let str = `
    <template>\n${content}\n</template>
    <script>
      export default {
        inheritAttrs: false,
      }
    </script>
    <style scoped>
    svg {
      height: 1em;
      width: 1em;
      vertical-align: middle;
      color: inherit;
      fill: currentColor;
      user-select: none;
    }
    </style>
    `;
    str = prettier.format(str, {
      parser: "vue",
      singleQuote: true,
      semi: false,
    });
    const componentFile = path.join(outputPath, `/${iconFolderName}/`);
    const outPath = path.join(outputPath, `/${iconFolderName}/`, fileName);
    if (!fs.existsSync(componentFile)) {
      fs.mkdirSync(componentFile);
    }
    fs.writeFile(outPath, str, (error) => {
      if (error) {
        console.log(chalk.red(`创建文件 ${outPath} 失败\n`));
        process.exit(1);
      }
    });
  };

  const createIconByFiles = async (files, inputPath, outputPath) => {
    for(let i = 0; i< files.length; i++){
      const fileUrl = path.join(inputPath, files[i]);
      const stats = await fs.statSync(fileUrl);
      const isFile = stats.isFile();
      if(isFile){
        const { name, ext } = path.parse(files[i]);
        if(ext !== ".svg") continue;
        let content = await fs.readFileSync(fileUrl, 'utf-8');
        const fileName = `${name}.vue`;
        const svgReg = /<svg.*?>([\s\S]*?)<\/svg>/;
        const defReg = /<defs>([\s\S]*?)<\/defs>/;
        let _content;
        try{
          // remove '\n' if contains
          _content = content.replace(/\n/g, '').match(svgReg)[0];
          // remove def content
          _content = _content.replace(defReg, "");
        }catch(err){}
        createIconComponent(fileName, _content, outputPath);
      }
    }
  };

  fs.readdir(inputPath, async (err, files) => {
    if (err) {
      console.log(chalk.red(`读取文件夹 ${inputPath} 失败\n`));
      process.exit(0);
    }
    // 如果输出文件不存在，则创建
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }
    // 生成icon组件入口文件
    createEnterFile(outputPath);
    // 生成icon组件列表
    createConfigFile(files, outputPath);
    // 根据循环得到的file，生成icon组件
    createIconByFiles(files, inputPath, outputPath);
  });
};
