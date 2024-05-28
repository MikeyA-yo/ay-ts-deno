

function print(...a) {
    let b = '';
    a.forEach(te => {
        b += te;
        b += ' ';
    });
    console.log(b);
}

function timer(cb,ms ) {
    return setTimeout(cb, ms);
}

function interval(cb, ms) {
    return setInterval(cb, ms);
}

class Day extends Date {
    getFormattedDate() {
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        return `${this.getDate()}-${months[this.getMonth()]}-${this.getFullYear()}`;
    }
    time() {
        return this.toLocaleTimeString();
    }
    getFullDate() {
        return this.toLocaleDateString();
    }
    getFormalDate() {
        return this.toDateString();
    }
}

function read(out, mode) {
if(mode != undefined && mode != null){
    switch(mode){
        case 'utf-8':
            return Deno.readTextFileSync(out);
        default:
            return Deno.open(out,{read:true});
  
    }
}
    return Deno.readFileSync(out);
}

function write(path, data) {
    const encoder = new TextEncoder();
    data = encoder.encode(data)
    return Deno.writeFileSync(path, data);
}

function appendFile(path, data) {
   return  Deno.writeFileSync(path, data, { append: true });
}

function dirname() {
    return Deno.cwd();
}

export {
    print,
    timer,
    Day,
    interval,
    read,
    write,
    appendFile,
    dirname
};
