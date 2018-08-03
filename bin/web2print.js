#!/usr/bin/env node

const puppeteer = require('puppeteer')
const watch = require('watch')
const resolve = require('path').resolve
const dirname = require('path').dirname
const fs = require('fs')

const pk = require("../package.json")
const ArgParser = require("../src/ArgParser")
var argParser = new ArgParser()

function printHelp(){
  let help = `
  Web2print converts html+css into printable pdf file, relying on the CSS print
  rules imported from the html input.

  You must use the following options:
    -in=<input html file>     print all the entries (oldest to newest)
    -out=<output pdf file>    print entries with at least one of these tags (coma separated)
    -watch                    converts anytime the input is modified

    Bug or issues: https://github.com/jonathanlurie/web2print
    donethat v${pk.version}
  `

  console.log( help )
}

if( argParser.hasCorruptedArgument() ){
  printHelp()
  process.exit()
}

let input, output
try {
  input = argParser.getArgValue("in")
}catch(e){
  console.log(e.message)
  process.exit()
}

try {
  output = argParser.getArgValue("out")
}catch(e){
  console.log(e.message)
  process.exit()
}

if( typeof input !== 'string' ||
    typeof output !== 'string'){
    console.log("in and out argument must be strings.")
    process.exit()
}

input = resolve(input)
let inputFolder = dirname(input)

if( !fs.existsSync(input) ){
  console.log("The input file must exist.")
  process.exit()
}

let mustWatch = false
try {
  mustWatch = argParser.getArgValue("watch")
}catch(e){}

let converter = async (inputFile, outputFile) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('file:' + inputFile)
  await page.pdf({path: outputFile})
  await browser.close()
  console.log(`[${new Date().toISOString()}] output created.`);
};

if(mustWatch === true){
  console.log("Watch option is used, press ctrl+c to quit...");
  watch.createMonitor(inputFolder, function (monitor) {
    monitor.files[input]

    monitor.on("created", function (f, stat) {
      converter(input, output)
    })

    monitor.on("changed", function (f, curr, prev) {
      converter(input, output)
    })

    monitor.on("removed", function (f, stat) {
      console.log("Input file was removed");
      monitor.stop();
    })
  })
}

converter(input, output)
