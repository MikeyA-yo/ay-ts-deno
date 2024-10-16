#!/usr/bin/env -S deno run -A

import { objectChecker } from "./error_handling/objectChCompiled.js";

const out = "./out.js"; // Using Deno.cwd() to get current working directory Deno.cwd().slice(2) +
const programName = Deno.args[0]; // Using Deno.args to get command line arguments
// const buf = new Uint8Array(2000)
// await Deno.openSync(programName).read(buf)
const program = Deno.readTextFileSync(programName);

// this function breaks the whole program into lines
function parse(codes: string): string[] {
  return codes.split("\n");
}
// this function breaks a line into words by white space
// function tokenize(code: string): string[] {
//     return code.split(/\s+/);
// }
// this function is peak
function parser(inputString: string) {
  // Separate the input string into segments
  const segments = inputString.match(/(["'`].*?["'`])|\S+/g);

  if (!segments) return [];

  const result: string[] | any = [];

  for (const segment of segments) {
    if (
      segment.startsWith('"') || segment.startsWith("'") ||
      segment.startsWith("`")
    ) {
      // Quoted strings
      result.push(segment);
    } else {
      // Split by parentheses, square brackets, braces, and operators
      const tokens = segment.split(/([()\[\]{}])/).filter((token) =>
        token.trim() !== ""
      );

      // Combine adjacent parentheses, square brackets, or braces
      let combinedToken = "";
      for (const token of tokens) {
        if (
          token === "(" || token === "[" || token === "{" || token === ")" ||
          token === "]" || token === "}"
        ) {
          if (combinedToken !== "") {
            result.push(combinedToken);
            combinedToken = "";
          }
          result.push(token);
        } else {
          combinedToken += token;
        }
      }

      // Push any remaining combined token
      if (combinedToken !== "") {
        result.push(combinedToken);
      }
    }
  }

  return result;
}
function parseStr(inputString: string) {
  const regex = /(["'`])(.*?)\1|\S+/g;
  const matches = inputString.match(regex);

  if (matches) {
    return matches;
  } else {
    return [];
  }
}
// this function breaks a quote statement apart
// function parseStatement(statement): string[] {
//     const regex = /"([^"]+)"|(\w+)|([=\[\]\(\){}÷*+\-])/g; // Matches either a quoted string or a word /("[^"]+"|\w+)/g
//     const matches = statement.match(regex);
//     return matches;
// }
let exporters: string[] = [];
function generateCode(program: any) {
  let code = "";
  let lines = parse(program);
  let newLines = lines.filter((line) => {
    return line.trim() !== "";
  });
  if (newLines[0] == "\\r") {
    newLines[0] = "\n";
  }
  if (newLines[0].includes("#")) {
    newLines[0] = "";
  }

  newLines.forEach((el) => {
    el.includes("{")
      ? (el += "")
      : el.includes(";")
      ? (el += "")
      : el.includes("}")
      ? (el += "")
      : el.includes(",")
      ? (el += "")
      : el.includes(":")
      ? (el += "")
      : el.includes("imp@") ? el += '' : (el += " ;");
    let values: RegExpMatchArray | never[] | string[] = parseStr(el);
    if (
      el.includes("for (") || el.includes("for(") || el.includes("if(") ||
      el.includes("if (") || el.includes("exp@ f")
    ) {
      values = parser(el);
    }
    values[values.length] = "\n";
    for (let i = 0; i < values.length; i++) {
      if (values[i] == "l") {
        values[i] = "let";
      }
      if (values[i] == "print") {
        values[i] = `console.log(${values[i + 1]})`;
        values[i + 1] = " ";
      }
      if (values[i] == "f") {
        values[i] = "function";
      }
      if (values[i] == "exp@") {
        exporters.push(values[i + 2]); // exported variable name to list of exported in a file
        values[i] = "export";
      }
      if (values[i] == "imp@") {
        // let impe = imp(values, values[i]);
        // values[i] = impe
        const impStatementLength = values.length;
        // import for variable
        let importForV = values[i + 1].slice(1, -1);
        const endMark = impStatementLength - 2;
       
        // import location
        let importLocation = values[endMark];
        const impLength = importLocation.length;
        importLocation = importLocation.slice(1, impLength - 1);
        const ayImport = Deno.readTextFileSync(
          `${Deno.cwd()}${importLocation}`,
        );
        //  console.log(values[i],values[impStatementLength - 3])
        //  console.log(importForV,importLocation,values)
        values[i] = "";
        values[i + 1] = "";
        values[2] = "";
        values[endMark] = "";
        if (importForV == importLocation) {
          code += generateCode(ayImport);
        } else {
          //to do actually make sure the file isn't loaded and executed
          let importsForV: string[] = [];
          let condition: any;
          if (importForV.split(",").length > 1) {
            importsForV = importForV.split(","); // ? .map((r) => r.trim())
            //for some reason every works in deno and some doesn't
            condition = exporters.every((r) => importsForV.includes(r));
            for (let i = 0; i < importsForV.length; i++) {
              if (condition) {
                importForV = importsForV.join(", ");
              }
            }
          }
          const tempCode = generateCode(ayImport);
          if (exporters.includes(importForV) || condition) {
            const math =
              `import {rand, round, PI, floor, exp, degToRad, radToDeg} from './math.ts';\n`;
            const utils =
              `import {print, timer, Day, interval, read, write, appendFile, dirname} from './utils.js';\n`;
            const AY = `import {AY} from './objects/AY.js';\n`;
            const exec = ` ${math} ${utils} ${AY}  ${tempCode} `;
            const out2 = import.meta.dirname + "/out2.js";
            Deno.writeTextFileSync(out2, exec);
            code += `import {${importForV}} from "./out2.js"`;
          }
          if (!exporters.includes(importForV) && !condition) {
            console.log("exports: ", exporters);
            console.log("No exports found", importForV);
            Deno.exit(1);
          }
        }
      }
    }
    // switch case will only be used for error handling
    // switch (values[0]) {
    //     case 'l':
    //         values[0] = 'let';

    //         break;
    //     case 'print':
    //         values[0] = `console.log(${values[1]});`;
    //         values[1] = ' '
    //         break;
    //     case 'f':
    //         values[0] = `function`;
    //         break;
    //     default:
    //       break ;
    // }
    //  values = values.filter(value => value !== undefined || value !== null)
    code += values.join(" ");
  });
  return code;
}
const math =
  `import {rand, round, PI, floor, exp, degToRad, radToDeg} from './math.ts';\n`;
const utils =
  `import {print, timer, Day, interval, read, write, appendFile, dirname} from './utils.js';\n`;
const AY = `import {AY} from './objects/AY.js';\n`;
const some = generateCode(program);
const exec = `${math}${utils}${AY} ${some} `;
objectChecker(some);
Deno.writeTextFileSync(out, exec);
import(out);
