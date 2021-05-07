"use strict";
const path = require("path");
const fs = require("fs");
const genConfig = (fileList, outFile)=>{
  const len = fileList.length;
  let components = "";
  for(let i = 0; i < len; i++){
    const item = fileList[i];
    const isSvgReg = /\.svg$/;
    if(isSvgReg.test(item)){
      const fileName = item.split('.svg')[0];
      components += `"${fileName}": ()=>import("./svg-icons/${fileName}.vue"),\n`
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
  fs.readdir(entryFolder, function(err, files){
    if(err) console.warn("fail to read file...");
    else {
      if(!fs.existsSync(outFolder)){
        fs.mkdirSync(outFolder);
      }
      genConfig(files, outFolder);
      genEntry(outFolder);
      const fileList:string[] = [];
      for(let i = 0; i< files.length; i++){
        fileList.push(files[i]);
        const fileUrl = path.join(entryFolder, files[i]);
        const stats = fs.statSync(fileUrl);
        const isFile = stats.isFile();
        const isSvgReg = /\.svg$/;
        if(isFile && isSvgReg.test(files[i])){
          let content = fs.readFileSync(fileUrl, 'utf-8');
          const file = files[i].split(".svg")[0];
          const fileName = `${file}.vue`;
          const svgReg = /<svg.*?>([\s\S]*?)<\/svg>/;
          let _content;
          try{
            _content = content.match(svgReg)[0];
          }catch(err){}
          genComponent(fileName, _content, outFolder);
        }
      }
    }
  })
}
