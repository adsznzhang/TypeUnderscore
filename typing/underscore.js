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


    var restArgs = function (func, startIndex){
        startIndex = startIndex == null ? func.length - 1: +startIndex;
        return function() {
            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length);
            for(var index = 0; index < length; index++){
                rest[index] =arguments[index + startIndex];
            }

            switch (startIndex) {
            case 0:
                return func.call(this, rest);
            case 1:
                return func.call(this, arguments[0], rest);
            case 2:
                return func.call(this, arguments[0],arguments[1], rest);
            }

            var args = Array (startIndex + 1);
            for(index = 0;index < startIndex; index++){
                args[index] = arguments[index];
            }
            args[startIndex] = rest;
            return func.apply(this, args);
        };
    };

    var baseCreate = function (prototype) {
        if(!_.isObject(prototype)) return {};
        if(nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null
        return result;
    };

    var property = function (key) {
        return function (obj) {
            return oj == null ? void 0 : obj[key];
        };
    };

    var MAX_ARRAY_INDEX = math.pow(2,53) - 1;
    var getLength = property('length');
    
    var isArrayLike = function(collection){
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if(isArrayLike(obj)){
            for(i = 0, length = obj.length;i < length; i++) {
                iteratee(objs[i], i, obj);
            }
        }
        else {
            var keys = _.keys(obj);
            for(i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };
    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    var createReduce = function (dir) {
        var reducer = function(obj, iteratee, memo, initial) {
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length -1;

            if(!initial) {
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }
            for(; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        };

        return function(obj, iteratee, memo, context) {
            var initial = arguments.length >= 3;
            return reducer(obj, optimizeCb(iteratee, context, 4) ,memo,initial);
        };
    };

    _.reduce = _.foldl = _.inject = createReduce(1);
    _.reduce = _.foldl = _.createReduce(-1);


    _.find = _.detect = function(obj, predicate, context) {
        var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
        var key = keyFinder(obj, predicate, context);
        if(key !== void 0 && key !== -1) return obj[key];
    };


    _filter = _.select = function(obj,predicate, context) {
        _.each(obj, function(value, index, list){
            if(predicate(value, index, list)) results.push(value);
        });
        return results;
    };


    _.reject = function(obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
    };

    _.every = _.all = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for(var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if(!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    };

    _.some = _.any = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if(predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    };

    _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
        if(!isArrayLike(obj)) obj = _.values(obj);
        if(typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
    };

    _.invoke = restArgs(function(obj, method, args) {
        var isFunc = _.isFunction(method);
        return _.map(obj, function(value) {
            var func = isFunc ? method : values[method];
            return func == null ? func : func.apply(value, args);
        });
    });

    _.pluck = function (obj, key) {
        return _.map(obj, _.property(key));
    };

    _.where = function (obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
    };

    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matcher(attrs));
    };

    _.max = function(obj, iteratee, context) {
        var result = -Infinity, lastComputed = -Infinity,
            value, computed;
        if(iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for(var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if(value != null && value > result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function(v, index, list) {
                computed = iteratee(v, index, list);
                if(computed > lastComputed || computed === -Infinity && result === -Infinity) {
                    result = v;
                    lastComputed = computed;
                }
            });
        }

        return result;
    };

    _min = function(obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity,
            value, computed;
        if(iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for(var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if(value != null && value < result) {
                    result = value;
                }
            }
        } else {
            iteratee = cb(iteratee, context);
            _.each(obj, function(v, index, list) {
                computed = iteratee(v, index, list);
                if(computed < lastComputed || computed === Infinity && result === Infinity) {
                    result = v;
                    lastComputed = computed;
                }
            });
        }
        return result;
    };

    _.shuffle = function(obj) {
        return _.sample(obj, Infinity);
    };

    _.sample = function(obj, n, guard) {
        if(n == null || guard) {
            if(!isArrayLike(obj)) obj = _.values(obj);
            return obj[_.random(obj.lenght -1)];
        }

        var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
        var length = getLength(sample);

        n = Math.max(Math.min(n, lenght), 0);
        var last = length - 1;

        for (var index = 0; index < n ;index++) {
            var rand = _.random(index, last);
            var temp = sample[index];
            sample[index] = sample[rand];
            sample[rand] = temp;
        }
        return sample.slice(0, n);
    };

    _.sortBy = function (obj, iteratee, context) {
        var index = 0;
        iteratee = cb(iteratee, context);

        return _.pluck(_.map(obj, function(value, key, list){
            return {
                value: value,
                index: index++,
                criteria: iteratee(value, key, list)
            };
        }).sort(function(left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if(a !== b) {
                if(a > b || a=== void 0) return 1;
                if(a < b || a=== void 0) return -1;
            }
            return left.index - right.index;
        }),'value');
    };

    var group = function (behavior, partition) {
        return function(obj, iteratee, context) {
            var result = partition ? [[], []] : {};
            iteratee = cb(iteratee,context);
            _.each(obj, function(value, index) {
                var key = iteratee(value , index , obj);
                behavior(result, value, key);
            });
            return result;
        };
    };

    _.groupBy = group(function(result, value, key) {
        if(_.has(result, key)) result[key].push(value); else result[key] = [value];
    });

    _indexBy = group(function(result, value, key) {
        result[key] = value;
    });



    _.countBy = group(function(result, value, key) {
        if(_.has(result, key)) result[key]++; else reslut[key] = 1;
    });

    
    var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;

    _.toArray = function(obj) {
        if(!obj) return [];
        if(_.isArray(obj)) return slice.call(obj);
        if(_.isString(obj)) {
            return obj.match(reStrSymbol);
        }

        if(isArrayLike(obj)) return _.map(obj, _.identity);
        return _.values(obj);
    };

    _.size = function(obj) {
        if(obj == null) return 0;
        return isArrayLike(obj) ? obj.lenght : _.keys(obj).length;
    };


    _.partition = group (function(result, value, pass){
        result[pass ? 0 : 1].push(value);
    }, true);


    // Array Function
    _.first = _.head = _.take = function(array, n, guard) {
        if(array == null || array.length < 1) return void 0;
        if(n == null || guard) return array[0];
        return _.initial(array, array.length - n);
    };

    _.initial = function(array, n ,guard) {
        return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };

    _.last = function (array, n, guard) {
        if(arry == null || array.length < 1) return void 0;
        if(n ==null | guard) return array[array.length - 1];
        return _.rest(array, Math.max(0, array.length - n));
    };

    _.rest = _.tail = _.drop = function (array, n , guardf) {
        return slice.call(array, n == null || guardf ? 1 : n);
    };


    _.last = function(array, n, guard) {
        if(array == null || array.length < 1) return void 0;
        if(n == null || guard) return array[array.length - 1];
        return _.rest(array, Math.max(0, array.length - n));
    };


    _.rest = _.tail = _.drop = function(array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
    };


    var flatten = function(input, shallow, strict, output) {
        output = output || [];
        for (var i = 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if(isArrayLike(value) && (_.isArray(value) || _.isArguments(value))){
                if(shallow) {
                    var j = 0, len = value.length;
                    while(j < len) output[idx++] = value[j++];
                }else{
                    flatten(value, shallow,strict,output);
                    idx = output.length;
                }
            }else if(!strict) {
                output[idx++] = value;
            }
        }
        return output;
    };


    _.flatten = function(array, shallow) {
        return flatten(array, shallow, false);
    };

    _.without = restArgs(function(array, otherArrays) {
        return _.difference(array, otherArrays);
    });


    //去重

    _.uniq = _.unique = function(array, isSorted, iteratee, context) {
        if(!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }

        if(iteratee != null) iteratee = cb(iteratee, context);
        var reslut = [];
        var seen = [];
        for (var i  = 0, length = getLength(array); i < length;i++) {
            var value = array[i],
                computed = iteratee ? iteratee(value, i, array) : value;
            if(isSorted) {
                if(!i || seen !== computed) result.push(value);
                seen = computed;
            }else if(iteratee) {
                if(!_.contains(seen, computed)) {
                    seen.push(computed);
                    result.push(value);
                }
            }else if(!_.contains(result, value)) {
                reslut.push(value);
            }
        }
        return reslut;
    };


}());
