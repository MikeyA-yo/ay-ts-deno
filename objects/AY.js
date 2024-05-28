const AY = {
  isAy: true,
  type(b) {
    return typeof b;
  },
  os: Deno.build.os,
  argv: ["runcmd", ...Deno.args],
  print(...args) {
    let arg = "";
    args.forEach((ar) => {
      arg += ar;
      arg += " ";
    });
    console.log(arg);
  },
  read(out, mode) {
    if (mode != undefined && mode != null) {
      switch (mode) {
        case "utf-8":
          return Deno.readTextFileSync(out);
        default:
          return Deno.open(out, { read: true });
      }
    }
    return Deno.readFileSync(out);
  },
};
export { AY };
