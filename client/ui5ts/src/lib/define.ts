/**
 * Translates a typescript generated define() call to a sap.ui.define() taking out the 'require' and 'exports' dependencies
 * @param aDependencies array of dependencies, including 'require' as first and 'exports' as second.
 * @param vFactory factory function with dependencies arguments, including 'require' as first and 'exports' as second.
 * @returns UI5 module.
 */
function define(aDependencies: string[], vFactory: (...args: any[]) => any): any
{
    //remove the dependencies "require" and "exports" generated by typescript compiler
    var newDependencies = aDependencies.slice(2);

    //overrides the typescript generated factory, passing to the original factory:
    // - null instead of the dependency "require"
    // - a new object with an empty "default" property as "exports"
    //and returns the default export of the typescript generated module
    var newFactory = (...args: any[]) => {
        var exports: { default: any } = { default: undefined };
        vFactory(null, exports, ...args.map((d: any) => ({ default: d })));
        return exports.default;
    };

    //call the original sap.ui.define() function, with adapted dependencies and factory
    return sap.ui.define(newDependencies, newFactory);
}
