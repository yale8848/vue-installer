var fs = require("fs");
var path = require("path")
var lineByLine = require('n-readlines');
var exec = require('child_process').execSync;
var osTmpdir = require('os-tmpdir');
var shell = require('shelljs');

var VALUE_CONST = {
    src: "src",
    vue: ".vue",
    flag: "@github",
    github: "https://github.com",
    components: "src/components"

}

function VueInstaller() {

}

VueInstaller.prototype.findVueFiles = function(dir) {

    var lists = [];
    var find = function(dir) {
        var files = fs.readdirSync(dir);
        files.forEach(function(el) {
            var item = dir + path.sep + el;
            var stats = fs.lstatSync(item);
            if (stats.isFile() && item.indexOf(VALUE_CONST.vue) != -1) {
                lists.push(item);
            } else if (stats.isDirectory()) {
                find(item);
            }
        });
    }
    find(dir);
    return lists;
}
VueInstaller.prototype.getRemoteComponet = function(lists) {
    var githubs = [];
    lists.forEach(function(f) {
        var liner = new lineByLine(f);
        var line;
        while (line = liner.next()) {
            line = line.toString('utf-8');
            var p = line.indexOf(VALUE_CONST.flag);
            if (p != -1) {
                var l = line.indexOf("'", p);
                if (l == -1) {
                    l = line.indexOf("\"", p);
                }
                if (l != -1) {
                    p = line.substring(p, l);
                    githubs.push(p.replace(VALUE_CONST.flag, VALUE_CONST.github));
                }

            }
        }
    });
    return githubs;
}
VueInstaller.prototype.download = function(githubs) {
    githubs.forEach(function(url) {
        var l = url.lastIndexOf('/');
        url = url.substring(0, l);
        l = url.lastIndexOf('/');
        var name = url.substring(l + 1);
        url += ".git";
        var tmp = osTmpdir() + path.sep + name;
        var cmd = "git clone " + url + " " + tmp;
        shell.rm('-rf', tmp);
        console.log(cmd);
        exec(cmd, function(err, stdout, stderr) {
            if (err) {
                console.log(JSON.stringify(err));
                process.exit(0);
            }
        });
    });
}
VueInstaller.prototype.defalut = function(option) {
    option.src = (option.src || VALUE_CONST.src);
}
VueInstaller.prototype.installWrapper = function(option) {
    this.defalut(option);
    var lists = this.findVueFiles(path.resolve(process.cwd(),
        option.src));
    lists = this.getRemoteComponet(lists);
    this.download(lists);

}
VueInstaller.prototype.install = function(option) {
    try {
        this.option = option;
        this.installWrapper(option);
    } catch (error) {
        console.log(JSON.stringify(error));
        process.exit(0);
    }
}

module.exports = new VueInstaller();