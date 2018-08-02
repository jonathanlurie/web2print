const path = require('path');

class ArgParser {
  constructor(){
    //console.log( process.argv );

    this._parsedArgs = {}
    this._appName = path.basename( process.argv[1] );
    this._hasCorruptedArgument = false;
    this._parseArgs();
  }


  _parseArgs(){
    // reinit the thing
    this._parsedArgs = {};
    var rgx = /([-]+)([a-zA-Z]+)(=)?(\S+)?/;

    var argz = process.argv

    for(var i=2; i<argz.length; i++){
        var arg = argz[i];
        var match = rgx.exec(arg);

        if( match ){
          var argName = match[2]; // group 2

          // arg is just --something but not with "=value"
          if( match[3] === undefined && match[4] === undefined ){
            this._parsedArgs[ argName ] = true;

          // arg is --something=value
          }else if( match[3] !== undefined && match[4] !== undefined){
            var argValue = ArgParser._castValue( match[4] )  // group 4
            this._parsedArgs[ argName ] = argValue;

          // arg is like --something1234 or --something= but no value --> nonsens
          }else{
            this._hasCorruptedArgument = true;
          }

        }

    }
  }


  static filterFloat(value) {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
      .test(value))
      return Number(value);
    return NaN;
  }


  static _castValue( value ){

    if( value === undefined ){
      return true;
    }

    if( value === "false" || value === "False" || value === "FALSE"){
      return false;
    }

    if( value === "true" || value === "True" || value === "TRUE"){
      return true;
    }

    // check if it's a number
    var numberVal = ArgParser.filterFloat( value, 10 );
    if( !isNaN(numberVal) )
      return numberVal;

    // checks if it's a data
    var aDate = new Date( value );
    if( !isNaN(aDate.getTime()))
      return aDate;

    // then it's probably just a string
    return value;
  }


  getArgValue( argName ){
    if( argName in this._parsedArgs){
      return this._parsedArgs[argName];
    }else{
      throw {
        message: "The argument --" + argName + " is missing.",
        stillOk: true
      }
    }
  }


  getAppName(){
    return this._appName;
  }


  getNumberOfArgs(){
    return Object.keys( this._parsedArgs ).length;
  }


  hasCorruptedArgument(){
    return this._hasCorruptedArgument;
  }
}

module.exports = ArgParser;
