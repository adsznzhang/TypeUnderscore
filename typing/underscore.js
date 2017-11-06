//    Underscore.js 1.8.3
//    http://underscore.org

(function(){
    //Baseline setup
    var root =typeof self =='object' && self.self === self && self || typeof global == 'object' && global.global === global && global || this;

    var previousUnderscore = root._;

    var ArrayProto = Array.prototype, ObjProto = Object.prototype;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ArrayProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var nativeIsArray  = Array.isArray,
        nativeKeys= Object.keys,
        nativeCreate = Object.create;

    // short for constructor function
    var Ctor = function() {

    };

    var _ = function(obj) {
        if(obj instanceof _) return obj;
        if(!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    if(typeof exports != 'undefined' && !exprots.nodeType) {
        if(typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    }else {
        root._ = _;
    }

    _.VERSION = '1.8.3';

    var optimizeCb = function(func, context, argCount) {
        if(context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
        case 1:
            return function (value) {
                return func.call(context, value);
            };
        case 3:
            return function (value, index, collecttion) {
                return func.call(context, value, index, collecttion);
            };
        case 4:
            return function(accumulator, value, index, collection) {
                return func.call(context,accumulator,value,index,collection);
            };
        }
        return function() {
            return func.apply(context,arguments);
        };
    };

    var bultinIteratee;

    var cb = function (value, context, argCount) {
        if(_.iteratee !== bultinIteratee) return _.iteratee (value,context);

        if(value == null) return _identity;

        if(_.isFunction(value)) return optimizeCb(value,context, argCount);

        if(_.isObject(value)) return _.matcher(value);

        return _.property(value);
    };


    _.iteratee = bultinIteratee = function (value,context) {
        return cb(value, context, Infinity);
    };


    var restArgs = function (func, )





}());
