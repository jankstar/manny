"use strict";
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
//# sourceMappingURL=UI5.js.map