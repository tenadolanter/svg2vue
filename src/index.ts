const PACKAGE_JSON = require("../package.json");
const genSvg = require("./util")

module.exports = function genProgram(program){
  program
    .name(PACKAGE_JSON.name)
    .description(PACKAGE_JSON.description, {
      INPUT: 'Alias to --input',
    })
    .version(PACKAGE_JSON.version, '-v, --version')
    .arguments('[INPUT]')
    .option( '-f, --folder <FOLDER>', 'path of svgicon folder' )
    .option( '-o, --output <OUTPUT>', 'path of output')
    .action(action);
}


async function action(args, opts, command){
  var input = opts.folder;
  var output = opts.output;
  // if -f -o is not exsit, return help command
  if(input.length === 0 ){
    return command.help();
  }
  if(output.length === 0 ){
    return command.help();
  }
  genSvg(input, output);
}

