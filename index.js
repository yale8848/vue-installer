var vueInstaler = require('./lib/VueInstaller');

function Index(option) {
    this.option = option || {};

}
var isInstalled = false;
Index.prototype.apply = function(comp) {
    var compiler = comp;

    var _this = this;

    compiler.plugin('compile', function(params) {
        if (!isInstalled) {
            vueInstaler.install(_this.option);
        }
        isInstalled = true;
    });

    /*
        compiler.plugin('compilation', function(compilation) {
            compilation.plugin('optimize', function() {});
        });

        compiler.plugin('emit', function(compilation, callback) {
            callback();
        });

        compiler.plugin('before-compile', function(params, callback) {
            callback();
        });

        compiler.plugin('done', function() {});
        compiler.plugin('after-compile', function(params, callback) {
            callback();
        });*/
};

module.exports = Index;