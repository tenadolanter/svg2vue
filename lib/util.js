"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var path = require("path");
var fs = require("fs");
var genConfig = function (fileList, outFile) {
    var len = fileList.length;
    var components = "";
    for (var i = 0; i < len; i++) {
        var _a = path.parse(fileList[i]), name = _a.name, ext = _a.ext;
        if (ext === ".svg") {
            components += "\"" + name + "\": ()=>import(\"./svg-icons/" + name + ".vue\"),\n";
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
        return __awaiter(this, void 0, void 0, function () {
            var i, fileUrl, stats, isFile, _a, name, ext, content, fileName, svgReg, defReg, _content;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!err) return [3, 1];
                        console.warn("fail to read file...");
                        return [3, 8];
                    case 1:
                        if (!fs.existsSync(outFolder)) {
                            fs.mkdirSync(outFolder);
                        }
                        return [4, genConfig(files, outFolder)];
                    case 2:
                        _b.sent();
                        return [4, genEntry(outFolder)];
                    case 3:
                        _b.sent();
                        i = 0;
                        _b.label = 4;
                    case 4:
                        if (!(i < files.length)) return [3, 8];
                        fileUrl = path.join(entryFolder, files[i]);
                        return [4, fs.statSync(fileUrl)];
                    case 5:
                        stats = _b.sent();
                        isFile = stats.isFile();
                        if (!isFile) return [3, 7];
                        _a = path.parse(files[i]), name = _a.name, ext = _a.ext;
                        if (ext !== ".svg")
                            return [3, 7];
                        return [4, fs.readFileSync(fileUrl, 'utf-8')];
                    case 6:
                        content = _b.sent();
                        fileName = name + ".vue";
                        svgReg = /<svg.*?>([\s\S]*?)<\/svg>/;
                        defReg = /<defs>([\s\S]*?)<\/defs>/;
                        _content = void 0;
                        try {
                            _content = content.replace(/\n/g, '').match(svgReg)[0];
                            _content = _content.replace(defReg, "");
                        }
                        catch (err) { }
                        genComponent(fileName, _content, outFolder);
                        _b.label = 7;
                    case 7:
                        i++;
                        return [3, 4];
                    case 8: return [2];
                }
            });
        });
    });
};
