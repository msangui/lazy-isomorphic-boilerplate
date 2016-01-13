var sassLint = require('sass-lint');
var walk = require('walk');
var chalk = require("chalk");
var table = require("text-table");
var files   = [];
function pluralize(word, count) {
    return (count === 1 ? word : word + "s");
}
// Walker options

function formatter(results, filePath) {

    var output = "\n",
        total = 0,
        errors = 0,
        warnings = 0,
        summaryColor = "yellow";

    var messages = results;

    if (messages.length === 0) {
        return;
    }

    total += messages.length;
    output += chalk.underline(filePath) + "\n";

    output += table(
            messages.map(function(message) {
                var messageType;

                if (message.fatal || message.severity === 2) {
                    messageType = chalk.red("error");
                    summaryColor = "red";
                    errors++;
                } else {
                    messageType = chalk.yellow("warning");
                    warnings++;
                }

                return [
                    "",
                    message.line || 0,
                    message.column || 0,
                    messageType,
                    message.message.replace(/\.$/, ""),
                    chalk.gray(message.ruleId || "")
                ];
            }),
            {
                align: ["", "r", "l"],
                stringLength: function(str) {
                    return chalk.stripColor(str).length;
                }
            }
        ).split("\n").map(function(el) {
                return el.replace(/(\d+)\s+(\d+)/, function(m, p1, p2) {
                    return chalk.gray(p1 + ":" + p2);
                });
            }).join("\n") + "\n\n";

    if (total > 0) {
        output += chalk[summaryColor].bold([
            "\u2716 ", total, pluralize(" problem", total),
            " (", errors, pluralize(" error", errors), ", ",
            warnings, pluralize(" warning", warnings), ")\n"
        ].join(""));
    }

    return total > 0 ? output : "";
}

function lint(input, options, webpack, callback) {
    var walker  = walk.walk('./src', { followLinks: false });

    walker.on('file', function(root, stat, next) {
        if (/scss/.test(stat.name)) {
            var fileName = root + '/' + stat.name;
            try {
                var report = sassLint.lintFiles(fileName, {}, '.sass-lint.yml')[0];
                if (report && report.messages.length) {

                    if (report.warningCount && options.quiet) {
                        report.warningCount = 0;
                        report.messages = report.messages
                            .filter(function(message) {
                                return message.severity !== 1;
                            });
                    }

                    if (report.errorCount || report.warningCount) {
                        var messages = formatter(report.messages, fileName);

                        // Default emitter behavior
                        var emitter = report.errorCount ? webpack.emitError : webpack.emitWarning;

                        // Force emitError or emitWarning by setting option
                        if (options.emitError) {
                            emitter = webpack.emitError;
                        } else if (options.emitWarning) {
                            emitter = webpack.emitWarning;
                        }

                        if (emitter) {
                            emitter(messages);
                            if (options.failOnError && report.errorCount) {
                                throw new Error('Module failed because of a sasslint error.');
                            } else if (options.failOnWarning && report.warningCount) {
                                throw new Error('Module failed because of a sasslint warning.');
                            }
                        } else {
                            throw new Error(
                                'Your module system doesn\'t support emitWarning.' +
                                'Update available? \n' +
                                messages
                            );
                        }
                    }
                }
            } catch (e) {
                webpack.emitError(e);
            }

        }
        next();
    });

    walker.on('end', function () {
        if (callback) {
            callback(null, input);
        }
    });
}

/**
 * Webpack Loader
 *
 * @param {String|Buffer} input JavaScript string
 * @returns {String|Buffer} original input
 */
module.exports = function(input) {

    this.cacheable();

    var callback = this.async();

    if (!callback) { // sync
        lint(input, {}, this);

        return input;
    } else { // async
        try {
            lint(input, {}, this, callback);
        } catch(e) {
            callback(e);
        }
    }
};
