import {rand, round, PI, floor, exp, degToRad, radToDeg} from './math.ts';
import {print, timer, Day, interval, read, write, appendFile, dirname} from './utils.js';
import {AY} from './objects/AY.js';
 try {
let a = "my program variables are nicely scoped" ; 
let b = "hello world" ; 
let c = 3 + 3 ; 
let d = round(rand() * 12) ; 
function print5(){ 
for ( let i = 0; i < 5; i++ ) { 
let b2 = round(rand() * 5) ; 
if ( d > c ) { 
console.log(b)   ; 
} 
print(b2) ; 
} 
} 
// timer(print5, 0) ; 
print5() ; 
let today = new Day() ; 
let time = today.time() ; 
print("hey, world!", d, b, c, a, time, today.getFullDate(), PI(), AY.type(AY.isAy), AY.argv[1]) ; 
}catch(e){
 console.error(e.message);
}