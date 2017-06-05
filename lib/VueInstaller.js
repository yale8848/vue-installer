var fs = require('fs');
var path = require('path');
var lineByLine = require('n-readlines');
var osTmpdir = require('os-tmpdir');
var shell = require('shelljs');
var extend = require('extend');

var clone = require('git-clone-sync');

var defalut = {
    src: 'src',
    vue: ['.vue', '.js'],
    flag: '@github',
    github: 'https://github.com',
    components: 'src/components'
};

var options = {};
var _SEP = path.sep;

function VueInstaller() {

}

var log = function(o) {
    if (typeof o === 'string') {
        // console.log(o);
    } else {
        //  console.log(JSON.stringify(o));
    }

};
VueInstaller.prototype.isFindFile = function(item) {

    var find = false;

    var s = item.lastIndexOf('.');
    if (s != -1) {
        s = item.substring(s);
    } else {
        return find;
    }

    options.vue.forEach(function(suf) {
        if (s === suf) {
            find = true;
        }
    });
    return find;

};
VueInstaller.prototype.findVueFiles = function(dir) {
    log(dir);
    var lists = [];
    var _this = this;
    var find = function(dir) {
        var files = fs.readdirSync(dir);
        files.forEach(function(el) {
            var item = dir + path.sep + el;
            var stats = fs.lstatSync(item);
            if (stats.isFile() && _this.isFindFile(item)) {
                lists.push(item);
            } else if (stats.isDirectory()) {
                find(item);
            }
        });
    };
    find(dir);
    return lists;
};
VueInstaller.prototype.getRemoteComponet = function(lists) {
    var githubs = [];
    lists.forEach(function(f) {
        var liner = new lineByLine(f);
        var line = '';
        do {
            var ln = liner.next();
            line = ln.toString('utf-8');
            var p = line.indexOf(options.flag);
            if (p != -1) {
                var l = line.indexOf('\'', p);
                if (l == -1) {
                    l = line.indexOf('\"', p);
                }
                if (l != -1) {
                    p = line.substring(p, l);
                    githubs.push(p);
                }
            }
        } while (ln);

    });
    return githubs;
};
VueInstaller.prototype.getPathInfo = function(path) {

    path = path.replace('\\', '/');
    var blocks = path.split('/');
    var url = blocks[0].replace(options.flag, options.github) + '/' + blocks[1] + '/' + blocks[2] + '.git';

    var project = blocks[2];
    var tmpDir = osTmpdir() + _SEP + blocks[1] + _SEP + project;
    return {
        url: url,
        usr: blocks[1],
        project: project,
        tmpDir: tmpDir,
        dir: blocks[3]
    };
};
VueInstaller.prototype.download = function(githubs) {
    var dirs = [];
    var dlist = [];
    var _this = this;
    githubs.forEach(function(url) {

        var info = _this.getPathInfo(url);
        var find = function() {
            var f = false;
            dlist.forEach(function(item) {
                if (item === info.url) {
                    f = true;
                    return f;
                }
            });
            return f;
        };
        if (!find()) {
            dlist.push(info.url);
        } else {
            return;
        }
        dirs.push(info);
        var d = process.cwd() + _SEP + options.components +
            _SEP + info.usr + _SEP + info.project;
        if (fs.existsSync(d)) {
            return;
        }
        shell.rm('-rf', info.tmpDir);
        clone(info.url, info.tmpDir);
    });
    return dirs;
};

VueInstaller.prototype.copysrc = function(lists) {
    lists.forEach(function(o) {
        var d = process.cwd() + _SEP + options.components + _SEP +
            o.usr + _SEP + o.project + _SEP + o.dir;
        if (!fs.existsSync(d)) {
            shell.mkdir('-p', d);
        }
        var src = o.tmpDir + _SEP + o.dir + _SEP + '*';
        shell.cp('-Rf', src, d);
    });

};
VueInstaller.prototype.installWrapper = function() {
    var option = options;
    var lists = this.findVueFiles(path.resolve(process.cwd(),
        option.src));
    log(lists);
    lists = this.getRemoteComponet(lists);
    log(lists);
    lists = this.download(lists);
    log(lists);
    this.copysrc(lists);

};
VueInstaller.prototype.install = function(option) {
    try {
        console.log('vue install start...');
        extend(option, defalut);
        options = option;
        log(options);
        this.installWrapper();
        console.log('vue install finish...');
    } catch (error) {
        console.log(JSON.stringify(error));
        process.exit(0);
    }
};
module.exports = new VueInstaller();