export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}
let buf = new Uint8Array(2000)
 await Deno.openSync('main.ts').read(buf)
let text = new TextDecoder().decode(buf)
console.log( text);
