export {
    NestedArray,
    Pair
} from './src/type';

export {
    isNot,
    not,
    isDefined,
    defined,
    isUndefined,
    has,
    hasNot,
    isUndefinedOrEmpty,
    undefinedOrEmpty,
    isEmpty,
    empty,
    isArray,
    isObject
} from './src/predicate';


export {
    is,
    isnt,
    arrayEqual,
    arrayEqualBy,
    arrayEquivalent,
    arrayEquivalentBy,
    equal,
    equalBy,
    equalTo,
    equivalent,
    objectEqual,
    objectEqualBy,
    tripleEqual,
    includedIn,
    includedInBy,
    differentFrom,
    differentFromBy,
    containedIn,
    containedInBy,
    jsonEqual,
    on,
    without,
    by
} from './src/comparator';

export {
    compose,
    flow
} from './src/composition';


export {
    reverse,
    flatMap,
    filter,
    asyncFilter,
    map,
    asyncMap,
    append,
    prepend,
    separate,
    take,
    takeRightWhile,
    takeUntil,
    takeWhile,
    takeNth,
    dropWhile,
    drop,
    dropRight,
    dropRightWhile,
    getIth,
    getIthOr,
    apply
} from './src/arraylist';




export {
    intersection,
    intersectionBy,
    union,
    unionBy,
    intersect,
    intersectBy,
    subtract,
    subtractBy,
    unite,
    uniteBy,
    unique,
    uniqueBy,
    duplicates
} from './src/arrayset';


export {
    subtractObject,
    intersectObject,
    uniteObject,
    unionObject
} from './src/objectset'


export {
    mapObject,
    filterObject,
    intoObject
} from './src/objectcoll'


export {copy} from './src/arraylist_objectcoll';

export {get, getOrElse} from './src/arraylist_objectstruct';

export {
    takeOrMake,
    to,
    jsonClone
} from './src/objectstruct';


// TODO make
// .filter(on('pathType')(or(isNot(defined), 'sameRank'))