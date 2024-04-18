const AY = {
    isAy: true,
    type(b) {
        return typeof b;
    },
    os: Deno.build.os,
    argv: ['runcmd', ...Deno.args]
};

export { AY };
