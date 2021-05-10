"use strict";
const path = require("path");
const fs = require("fs");
const genConfig = (fileList, outFile)=>{
  const len = fileList.length;
  let components = "";
  for(let i = 0; i < len; i++){
    const { name, ext } = path.parse(fileList[i]);
    if(ext === ".svg"){
      components += `"${name}": ()=>import("./svg-icons/${name}.vue"),\n`
    }
  }
  const content = `export default {\n ${components} } `
  const outPath = path.join(outFile, "config.js")
  fs.writeFile(outPath, content, (error)=>{
    if(error) console.error("fail to write into file...");
  });
}

const genEntry = (outFile)=> {
  const content =
  `<template>
    <component
      class="form-icon"
      v-if="$options.components[name]"
      :is="$options.components[name]"
    ></component>
  </template>
  <script>
  import Vue from "vue";
  import icons from "./config.js"
  export default Vue.extend({
    props: {
      name: {
        type: String,
        required: true
      }
    },
    components: {
      ...icons,
    }
  })
  </script>
  <style scoped>
  .form-icon {
    height: 1em;
    width: 1em;
    vertical-align: middle;
    color: inherit;
    fill: currentColor;
    user-select: none;
  }
  </style>
  `
  const outPath = path.join(outFile, "index.vue");
  fs.writeFile(outPath, content, (error)=>{
    if(error) console.error("fail to write into file...");
  });
}

const genComponent = (fileName, content, outFile) => {
  const fileContent = `
<template>\n${content}\n</template>
<script>
  import Vue from "vue";
  export default Vue.extend({
    inheritAttrs: false,
  })
</script>
`
  const componentFile = path.join(outFile, "/svg-icons/");
  const outPath = path.join(outFile, "/svg-icons/", fileName);
  if(!fs.existsSync(componentFile)){
    fs.mkdirSync(componentFile);
  }
  fs.writeFile(outPath, fileContent, (error)=>{
    if(error) console.error("fail to write into file...");
  });
}


module.exports = function genSvg(entryFolder, outFolder){
  fs.readdir(entryFolder, async function(err, files){
    if(err) console.warn("fail to read file...");
    else {
      // is folder is not exist, create
      if(!fs.existsSync(outFolder)){
        fs.mkdirSync(outFolder);
      }
      await genConfig(files, outFolder);
      await genEntry(outFolder);
      for(let i = 0; i< files.length; i++){
        const fileUrl = path.join(entryFolder, files[i]);
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
          genComponent(fileName, _content, outFolder);
        }
      }
    }
  })
}
