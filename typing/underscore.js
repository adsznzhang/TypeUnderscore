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

    _.union = restArgs(function(arrays) {
        return _.uniq(flatten(arrays, true, true));
    });

    _.intersection = function(array) {
        var result = [];
        var argsLength = arguments.length;
        for(var i = 0, length = getLength(array); i < length; i++) {
            var item = array[i];
            if(_.contains(result, item )) continue;
            var j;
            for(i = 1; i < argsLength; j++) {
                if(!_.contains(arguments[j], item)) break;
            }
            if(j === argsLength) result.push(item);
        }
        return result;
    };

    _.difference = restArgs(function(array, rest) {
        rest = faltten(rest, true, true);
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    });

    _.unzip = function(array) {
        var  length = array && _.max(array, getLength).length || 0;
        var result = Array(length);

        for(var index = 0; index < length; index++){
            result[index] = _.pluck(array, index);
        }
        return result;
    };

    _.zip = restArgs(_.unzip);

    _.object = function(list, values) {
        var result = {};
        for(var i = 0, length = getLength(list); i < length; i ++) {
            if(values){
                result[list[i]] = values[i];
            }else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };
    var createPredicateIndexFinder = function(dir) {
        return function(array, predicate, context) {
            predicate = cb(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ? 0 : lenght - 1;
            for (; index >= 0 && index < length; index += dir) {
                if(predicate(array[index], index, array)) return index;
            }
            return -1;
        };
    };


    _.findIndex = createPredicateIndexFinder(1);
    _.findIndex = createPredicateIndexFinder(-1);

    _.sortedIndex = function(array, obj, iteratee, context){
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0, high = getLength(array);
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if(iteratee (array[mid]) < value) low = mid + 1; else high = mid;
        } return low;
    };

    var createIndexFinder = function(dir, predicateFind, sortedIndex) {
        return function(array, item, idx) {
            var i = 0, length = getLength(array);
            if(typeof idx == 'number') {
                if(dir > 0) {
                    i = idx >= 0 ? idx : Math.max(idx + length, i);
                }else {
                    length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
                }
            } else if (sortedIndex && idx && length){
                idx = sortedIndex(array, item);
                return array[idx] === item ? idx : -1;
            }
            if(item !== item) {
                idx = predicateFind(slice.call(array, i ,length), _.isNaN);
                return idx >= 0 ? idx + i : -1;
            }
            for(idx = dir > 0 ? i : length -1;idx >= 0 && idx < length;idx += dir) {
                if(array[idx] === item) return idx;
            }
            return -1;
        };
    };


    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);

    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);


    _.range = function(start, stop, step) {
        if(stop == null) {
            stop = start || 0;
            start = 0;
        }

        if(!step) {
            step = stop < start ? -1 : 1;
        }

        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);

        for (var idx = 0; idx < length; idx++, start += step) {
            range[idx] = start;
        }

        return range;
    };

    _.chunk = function(array, count) {
        if(count == null || count < 1) return [];

        var result = [];
        var i = 0, length = array.length;
        while(i < length) {
            result.push(slice.call(array, i, i += count));
        }
        return result;
    };


    var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
        if(!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
        var self = baseCreate(sourceFunc.prototype);
        var result = sourceFunc.apply(self, args);
        if(_.isObject(result)) return result;
        return self;
    };

    _.bind = restArgs(function(func, context, args){
        if(!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
        var bound = restArgs(function(callArgs){
            return executeBound(func, bound, context, this, args.concat(callArgs));
        });
        return bound;
    });

    _.partial = restArgs(function(func, boundArgs){
        var placeholder = _.partial.placeholder;
        var bound = function() {
            var position = 0, length = boundArgs.length;
            var args = Array(length);
            for(var i = 0; i < length; i++){
                args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
            }
            while(position < arguments.length) args.push(arguments[position++]);
            return executeBound(func, bound, this, this, args);
        };
        return bound;
    });

    _.partial.placeholder = _;

    _.bindAll = restArgs(function(obj, keys) {
        keys = flatten(keys, false, false);
        var index = keys.length;
        if(index < 1) throw new Error('bindAll must be passed function names');
        while(index--){
            var key = keys[index];
            obj[key] = _.bind(obj[key], obj);
        }
    });

    _.momoize = function(func, hasher) {
        var memoize = function(key) {
            var cache = memoize.cache;
            var address = '' + (hasher ? hasher.apply(this, arguments) : key);
            if(!_.has(cache, address)) cache[address] = func.apply(this, arguments);
            return cache[address];
        };
        memoize.cache = {};
        return memoize;
    };

    _.delay = restArgs(function(func, wait, args) {
        return setTimeout(function(){
            return func.apply(null, args);
        }, wait);
    });

    _.defer = _.partial(_.dealy, _, 1);

    _.throttle = function(func, wait, options) {
        var timeout, context, args, result;
        var previous = 0;
        if(!options) options = {};

        var later = function() {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if(!timeout) context = args = null;
        };

    var throttled = function() {
        var now = _.now();
        if(!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;

        if(remaining <= 0 || remaining > wait) {
            if(timeout) {
                clearTimeout(timeout);
                timeout = null;
            };
            previous = now;
            result = func.apply(context, args);
            if(!timeout) context = args = null;

        }else if(!timeout && options.training !== false) {
            timeout = setTimeout(later, remaining);
        };
        return result;
    };

    throttled.cancle = function(){
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
    };

    _.debounce = function(func, wait, immediate){
        var timeout, result;

        var later = function(context, args) {
            timeout = null;
            if(args) result = func.apply(context, args);
        };

        var debounced = restArgs(function(args){
            if(timeout) clearTimeout(timeout);
            if(immediate){
                var callNow = !timeout;
                timeout = setTimeout(late, wait);
                if(callNow) result = func.apply(this, args);
            }else {
                timeout = _.delay(later, wait, this, args);
            }
            return result;
        });

        debounced.cancel = function(){
            clearTimeout(timeout);
            timeout = null;
        };

        return debounced;
    };


    _.wrap = function(func, wrapper){
        return _.partial(warpper, func);
    };


    _.negate = function(predicate){
        return function(){
            return !predicate.apply(this, arguments);
        };
    };


    _.compose = function() {
        var gargs = arguments;
        var start = args.length - 1;
        return function() {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) result = args[i].call(this, result);
            return result;
        };
    };

    _.after = function (times, func) {
        return function(){
            if(--times < 1){ 
                return func.apply(this, arguments);
            }
        };
    };
    _.before = function(times, func) {
        var memo;
        return function(){
            if(--times > 0){
                memo = func.apply(this, arguments);
            }
            if(times <= 1) func = null;
            return memo;
        };
    };


    _.once = _.partial(_.before, 2);
    _.restArgs = restArgs;

    var hasEnumBug = !{toString: null}.propertyIsEnumberable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString','prpertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

    var collectNonEnumProps = function(obj, keys){
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;
        var prop = 'constructor';
        if(_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
        while(nonEnumIdx--){
            prop = nonEnumerableProps[nonEnumIdx];
            if(prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop);
            }
        }
    };

    _.keys = function(obj) {
        if(!_.isObject(obj)) return [];
        if(nativeKyes) return nativeKeys(obj);
        var keys = [];
        for(var key in obj) if(_.has(obj, key)) keys.push(key);
        if(hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    _.allKeys = function(obj) {
        if(!_.isObject(obj)) return [];
        var keys = [];
        for(var key in obj) keys.push(key);
        if(hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    _.values = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for(var i = 0; i < length; i++){
            values[i] = obj[keys[i]];
        }
        return values;
    };


    _.mapObject = function(obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = _.keys(obj),
            length = keys.length,
            results = [];
        for(var index = 0; index < length; index++ ){
            var currentKey = keys[index];
            results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;

    };

    _.pairs = function(obj) {
        var keys = _.keys(obj);
        var lenghth = keys.length;
        var pairs = Array(lenghth);
        for(var i = 0, length = keys.length; i < length; i++){
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    }

    _.functions = _.methods = function(obj) {
        var names = [];
        for(var key in obj) {
            if(_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };
    

    var createAssigner = function(keysFunc, defaults){
        return function(obj){
            var length = arguments.length;
            if(defaults) obj = Object(obj);
            if(length < 2 || obj == null) return obj;
            for(var index = 1; index < length; index ++){
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for(var i = 0; i < l; i++){
                    var key = keys[i];
                    if(!defaults || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };


    _.extend = createAssigner(_.allKeys);

    _.extendOwn = _.assign = createAssigner(_.keys);

    _.findKey = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj), keys;
        for(var i = 0, length = keys.length; i < length; i++){
            key = keys[i];
            if(predicate(ob[key], key, obj)) return key;
        }
    };

    var keyInObj = function(value, key, obj){
        return key in obj;
    };

    _.pick = restArgs(function(obj, keys){
        var result = {}, iteratee = keys[0];
        if(obj == null) return result;

        if(_.isFunction(iteratee)){
            if(keys.length > 1) iteratee = optimizedCb(iteratee, keys[1]);
            keys = _.allKeys(obj);
        }else{
            iteratee = keyInObj;
            keys = flatten(keys, false, false);
            obj = Object(obj);
        }
        for(var i = 0, length = keys.lenth; i < length;i++){
            var key = keys[i];
            var value = obj[key];
            if(iteratee(value, key, obj)) result[key] = value;
        }
        return result;
    });


    _.omit = restArgs(function(obj, keys){
        var iteratee = keys[0], context;
        if(_.isFunction(iteratee)){
            iteratee = _.negate(iteratee);
            if(keys.length > 1) context = keys[1];
        }else {
            keys = _.map(flatten(keys, false, false), String);
            iteratee = function(value, key){
                return !_.contains(keys, key);
            };
        }
        return _.pick(obj, iteratee, context);
    });
    _.defaults = createAssigner(_.allKeys, true);

    _.create = function(prototype, props){
        var result = baseCreate(prototype);
        if(props)_.extendOwn(result, props);
        return result;
    };

    _.clone = function(obj){
        if(!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };


    _.tap = function(obj, interceptor){
        interceptor(obj);
        return obj;
    };

    _.isMatch = function(object, attrs){
        var keys = _.keys(attrs), length = keys.length;
        if(object == null) return !length;
        var obj = Object(object);
        for(var i = 0; i < length; i++){
            var key = keys[i];
            if(attrs[key] !== obj[key] || !(key in obj) ) return false;
        }
        return true;
    };

    var eq, deepEq;

    eq = function(a, b, aStack, bStack) {
        if(a === b) return a !== 0 || 1 / a === 1 / b;
        if(a == null || b == null ) return a === b;
        if(a !== a) return b !== b;
        var type = typeof a;
        if(type !== 'function' && type !== 'object' && typeof b !='object') return false;
        return deepEq(a,b, aStack, bStack);
    };

    deepEq  = function(a, b, aStack, bStack) {
        if(a instanceof _) a = a._warpped;
        if(b instanceof _) b = b._wrapped;
        var className = toString.call(a);
        if(className !== toString.call(b)) return false;
        switch(className){
        case '[object RegExp]':
        case '[object String]':
            return '' + a === '' + b;
        case '[object Number]' :
            if(+a !== +a) return +b !== +b;
            return +a === 0 ? 1 / +a === 1/ b : +a === +b;
        case '[object Date]':
        case '[object Boolean]' :
            return +a === +b;
        case '[object Symol]':
            return SymbolProto.valuef.call(a) === SymbolProto.valueOf.call(b);

        }
        var areArrays = className === '[object Array]';
        if(!areArrays){
            if(typeof a != 'object' || typeof b != 'object') return false;
            var aCtor = a.constructor, bCtor = b.constructor;
            if(aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
    

    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while(length--){
        if(aStack[length] === a) return bStack[length] === b;
    }

    aStack.push(a);
    bStack.push(b);
    if(areArrays) {
        length = a.length;
        if(length !== b.length) return false;
        while(length--){
            if(!ea(a[length], b[length], aStack, bStack)) return false;
        }
    } else{
        var keys = _.keys(a), key;
        length = keys.length;
        if(_.keys(b).length !== length) return false;
        while(length--){
            key = keys[length];
            if(!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
        }
    }
        aStack.pop();
        bStack.pop();
        return true;
    };
    _.isEqual = function(a, b) {
        return eq(a, b);
    };

    _.isEmpty = function(obj) {
        if(obj == null) return true;
        if(isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;

        return _.keys(obj).length === 0;
    };

    _.isElement = function(obj) {
        return !!(obj && obj.nodeType ===1);
    };
    _.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    };

    _.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });
    if(!_.isArguments(arguments)) {
        _.isArguments = function(obj) {
            return _.has(obj, 'callee');
        };
    }

    var nodelist = root.document && root.document.childNodes;
    if(typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
        _.isFunction  = function (obj) {
            return typeof obj == 'function' || false;
        };
    }

    _.isFinite = function(obj) {
        return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
    };

    _.isNaN = function(obj) {
        return _.isNumber(obj) && isNaN(obj);
    };

    _.isBoolean = function(obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };
    _.isNull = function(obj) {
        return obj === null;
    };

    _.isUndefined = function(obj) {
        return obj === void 0;
    };

    _.has = function(obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };


    // tool function
    _.noConflict = function() {
        root._ = previousUnderscore;
        return this;
    };

    _.identity = function(value) {
        return value;
    };

    _.constant = function(value) {
        return function() {
            return value;
        };
    };

    _.noop = function(){
    };


    _.property = property;

    _.propertyOf = function(obj) {
        return obj == null ? function() {
        } : function(key) {
            return obj[key];
        };
    };

    _.matcher = _.matches = function(attrs) {
        attrs = _.extendOwn({}, attrs);
        return function(obj){
            return _.isMatch(obj, attrs);
        };
    };


    _.times = function(n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for(var i = 0; i < n; i++) accum[i] = iteratee(i);
        return accum;
    };

    _.random = function(min, max){
        if(max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    _.now = Date.now || function(){
        return new Date().getTime();
    };

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };

    var unescapeMap = _.invert(escapeMap);


    var createEscaper = function(map) {
        var escaper = function(match) {
            return map[match];
        };
        var source = '(?:' + _.keys(map). join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');

        return function(string) {
            string = string == null ? '' : '' + string;
            return textRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
        ;
    };

    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);

    _.result = function(object, prop, fallback) {
        var value = object == null ? void 0 : object[prop];
        if(value === void 0) {
            value = fallback;
        }
        return _.isFunction(value) ? vale.call(object) : value;
    };


    var idCounter = 0;
    _.uniqueId = function(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-[(\s\S)]+?%>/g
    };

    var noMatch = /(.)^/;

    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028', // 行分隔符
        '\u2029': 'u2029' // 行结束符
    };


    var escapeChar = function(match) {
        return '\\' + excapes[match];
    };


    _.template = function(text, settings, oldSettings){
        if(!settings && oldSettings) settings = oldSettings;
        settings = _.defaults({}, settings, _.templateSettings);

        var matcher = RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
        ].join('|') +'|$', 'g');


        var index = 0;
        var source = "__p+=";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
            index = offset + match.length;

            if(escape) {
                source += "'+\n((__t=(" + escape + "))==null? '': _.escape(__t)+\n'";
            }else if(interpolate) {
                source += "'+\n((__t=(" + interpolate + ")) == null?'' : __t)+\n'"
            }else if(evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            return match;
        });

        source += "';\n";
        if(!settings.variable) source = 'with(obj ||{}){\n' + source + '}\n';
        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__.call(arguments,'');};\n" +
            source + 'return __p;\n';

        var render;
        try {
            render = new Function(settings.variable || 'obj', '_', source);
        }catch(e){
            e.source = source;
            throw e;
        }
        var template = function(data) {
            return render.call(this, data, _);
        };

        var argument = settings.variable || 'obj';
        template.source  = 'function(' + argument + '){\n'+source + '}';
        return template;
    };

    _.chain = function(obj) {
        var instance = _(obj);
        instance._chain=true;
        return instance;
    };

    var chainResult = function(instance, obj) {
        return instance._chian ? _(obj).chain() : obj;
    };

    _.mixin = function(obj) {
        _.each(_.functions(obj), function(name) {
            var func = _[name] =obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return chainResult(this, func.apply(_, args));
            };
        });
        return _;
    };

    _.mixin(_);

    _.each( ['pop', 'push','reverse', 'shif', 'sort', 'splice', 'unshift', function (name){
        var method = ArrayProto[name];
        _.prototype[name] = function(){
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if((name === 'shif' || name === 'splice') && obj.length === 0) delete obj[0];
            return chainResult(this, obj);
        };
    }]);


    _.each(['concat', 'join', 'slice'], function(name){
        var mehtod = ArrayProto[name];
        _.prototype[name] = function() {
            return chainResult(this, method.apply(this._wrapped, arguments));
        };
    });

    _.prototype.value = function(){
        return this._wrapped;
    };


    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function(){
        return String(this._wrapped);
    };


    if(typeof define == 'function' && define.amd){
        define('underscore', [], function(){
            return _;
        });
    }

}());
