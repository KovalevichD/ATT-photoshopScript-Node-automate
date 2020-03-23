"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var newCommandStack = function () {
    var stack = new Map();
    return {
        push: function (data) { return new Promise(function (resolve) {
            if (!stack.has(data.command))
                stack.set(data.command, []);
            stack.get(data.command).push(data);
            return resolve();
        }); },
        resolve: function (commandName) { return new Promise(function (resolve) {
            if (stack.has(commandName)) {
                var command = stack.get(commandName).shift();
                if (command) {
                    command.resolve();
                }
            }
            return resolve();
        }); }
    };
};
exports.default = newCommandStack;
//# sourceMappingURL=commands.js.map