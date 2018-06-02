"use strict";
/**
 * Translates a typescript generated define() call to a sap.ui.define() taking out the 'require' and 'exports' dependencies
 * @param aDependencies array of dependencies, including 'require' as first and 'exports' as second.
 * @param vFactory factory function with dependencies arguments, including 'require' as first and 'exports' as second.
 * @returns UI5 module.
 */
function define(aDependencies, vFactory) {
    //remove the dependencies "require" and "exports" generated by typescript compiler
    var newDependencies = aDependencies.slice(2);
    //overrides the typescript generated factory, passing to the original factory:
    // - null instead of the dependency "require"
    // - a new object with an empty "default" property as "exports"
    //and returns the default export of the typescript generated module
    var newFactory = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var exports = { default: undefined };
        vFactory.apply(void 0, [null, exports].concat(args.map(function (d) { return ({ default: d }); })));
        return exports.default;
    };
    //call the original sap.ui.define() function, with adapted dependencies and factory
    return sap.ui.define(newDependencies, newFactory);
}
/**
 * Convert a class definition to the UI5 format of inheritance. This decorator can only be used in a class that extends from
 * another UI5 class. If your class doesn't extends from any other, don't use this decorator or make your class extend from
 * sap.ui.base.Object
 * @param name Full name of the class. This parameter will be passed to BaseClass.extend(name, ...) method at runtime.
 */
function UI5(name) {
    return function (target) {
        var functionMembers = Object.getOwnPropertyNames(function () { });
        var staticMembers = Object.getOwnPropertyNames(target).filter(function (o) { return functionMembers.indexOf(o) === -1; });
        var instanceMethods = Object.getOwnPropertyNames(target.prototype);
        var baseClass = Object.getPrototypeOf(target); // it is the same as: baseClass = target.__proto__;
        var thisClass = {};
        staticMembers.forEach(function (m) { return thisClass[m] = target[m]; });
        instanceMethods.forEach(function (m) { return thisClass[m] = target.prototype[m]; });
        if (typeof baseClass.extend === "function") {
            return baseClass.extend(name, thisClass);
        }
        else {
            throw new Error("This class doesn't inherit from a UI5 class");
        }
    };
}
//# sourceMappingURL=ui5ts.js.map