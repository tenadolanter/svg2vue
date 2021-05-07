"use strict";
var path = require("path");
var fs = require("fs");
var genConfig = function (fileList, outFile) {
    var len = fileList.length;
    var components = "";
    for (var i = 0; i < len; i++) {
        var item = fileList[i];
        var isSvgReg = /\.svg$/;
        if (isSvgReg.test(item)) {
            var fileName = item.split('.svg')[0];
            components += "\"" + fileName + "\": ()=>import(\"./svg-icons/" + fileName + ".vue\"),\n";
        }
    }
    var content = "export default {\n " + components + " } ";
    var outPath = path.join(outFile, "config.js");
    fs.writeFile(outPath, content, function (error) {
        if (error)
            console.error("fail to write into file...");
    });
};
var genEntry = function (outFile) {
    var content = "<template>\n    <component\n      class=\"form-icon\"\n      v-if=\"$options.components[name]\"\n      :is=\"$options.components[name]\"\n    ></component>\n  </template>\n  <script>\n  import Vue from \"vue\";\n  import icons from \"./config.js\"\n  export default Vue.extend({\n    props: {\n      name: {\n        type: String,\n        required: true\n      }\n    },\n    components: {\n      ...icons,\n    }\n  })\n  </script>\n  <style scoped>\n  .form-icon {\n    height: 1em;\n    width: 1em;\n    vertical-align: middle;\n    color: inherit;\n    fill: currentColor;\n    user-select: none;\n  }\n  </style>\n  ";
    var outPath = path.join(outFile, "index.vue");
    fs.writeFile(outPath, content, function (error) {
        if (error)
            console.error("fail to write into file...");
    });
};
var genComponent = function (fileName, content, outFile) {
    var fileContent = "\n<template>\n" + content + "\n</template>\n<script>\n  import Vue from \"vue\";\n  export default Vue.extend({\n    inheritAttrs: false,\n  })\n</script>\n";
    var componentFile = path.join(outFile, "/svg-icons/");
    var outPath = path.join(outFile, "/svg-icons/", fileName);
    if (!fs.existsSync(componentFile)) {
        fs.mkdirSync(componentFile);
    }
    fs.writeFile(outPath, fileContent, function (error) {
        if (error)
            console.error("fail to write into file...");
    });
};
module.exports = function genSvg(entryFolder, outFolder) {
    fs.readdir(entryFolder, function (err, files) {
        if (err)
            console.warn("fail to read file...");
        else {
            if (!fs.existsSync(outFolder)) {
                fs.mkdirSync(outFolder);
            }
            genConfig(files, outFolder);
            genEntry(outFolder);
            var fileList = [];
            for (var i = 0; i < files.length; i++) {
                fileList.push(files[i]);
                var fileUrl = path.join(entryFolder, files[i]);
                var stats = fs.statSync(fileUrl);
                var isFile = stats.isFile();
                var isSvgReg = /\.svg$/;
                if (isFile && isSvgReg.test(files[i])) {
                    var content = fs.readFileSync(fileUrl, 'utf-8');
                    var file = files[i].split(".svg")[0];
                    var fileName = file + ".vue";
                    var svgReg = /<svg.*?>([\s\S]*?)<\/svg>/;
                    var _content = void 0;
                    try {
                        _content = content.match(svgReg)[0];
                    }
                    catch (err) { }
                    genComponent(fileName, _content, outFolder);
                }
            }
        }
    });
};
