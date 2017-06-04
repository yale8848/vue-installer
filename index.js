function Index(option) {
    this.option = option;

}

Index.prototype.apply = function(complier) {
    var com = "";
    compiler.plugin('done', function() {
        console.log('Hello World!');
    });
    compiler.plugin("before-compile", function(params, callback) {
        com = JSON.stringify(compiler, null, 2);
        console.log("The before-compile is starting to compile...");
        callback();
    });
    compiler.plugin("after-compile", function(params, callback) {
        console.log("The after-compile is starting to compile...");
        callback();
    });
    compiler.plugin("compile", function(params) {
        console.log("The compiler is starting to compile...");
    });

    compiler.plugin("compilation", function(compilation) {
        console.log("The compilation is starting a new compilation...");
        compilation.plugin("optimize", function() {
            console.log("The compilation is starting to optimize files...");
        });
    });

    compiler.plugin("emit", function(compilation, callback) {
        console.log("The compilation is going to emit files... ");

        // Create a header string for the generated file:
        var filelist = 'In this build:\n\n';

        // Loop through all compiled assets,
        // adding a new line item for each filename.
        for (var filename in compilation.assets) {
            filelist += ('- ' + filename + '\n');
        }

        // Insert this list into the Webpack build as a new file asset:
        compilation.assets['filelist.md'] = {
            source: function() {
                return com;
            },
            size: function() {
                return com.length;
            }
        };

        callback();
    });
}

module.exports = Index;