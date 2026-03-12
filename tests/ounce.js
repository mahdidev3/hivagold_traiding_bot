(function() {
    const n = document.createElement("link").relList;
    if (n && n.supports && n.supports("modulepreload"))
        return;
    for (const u of document.querySelectorAll('link[rel="modulepreload"]'))
        l(u);
    new MutationObserver(u => {
        for (const c of u)
            if (c.type === "childList")
                for (const f of c.addedNodes)
                    f.tagName === "LINK" && f.rel === "modulepreload" && l(f)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function i(u) {
        const c = {};
        return u.integrity && (c.integrity = u.integrity),
        u.referrerPolicy && (c.referrerPolicy = u.referrerPolicy),
        u.crossOrigin === "use-credentials" ? c.credentials = "include" : u.crossOrigin === "anonymous" ? c.credentials = "omit" : c.credentials = "same-origin",
        c
    }
    function l(u) {
        if (u.ep)
            return;
        u.ep = !0;
        const c = i(u);
        fetch(u.href, c)
    }
}
)();
var yi = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function w0(a) {
    return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a
}
var No = {
    exports: {}
}
  , Ir = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var kd;
function eU() {
    if (kd)
        return Ir;
    kd = 1;
    var a = Symbol.for("react.transitional.element")
      , n = Symbol.for("react.fragment");
    function i(l, u, c) {
        var f = null;
        if (c !== void 0 && (f = "" + c),
        u.key !== void 0 && (f = "" + u.key),
        "key"in u) {
            c = {};
            for (var h in u)
                h !== "key" && (c[h] = u[h])
        } else
            c = u;
        return u = c.ref,
        {
            $$typeof: a,
            type: l,
            key: f,
            ref: u !== void 0 ? u : null,
            props: c
        }
    }
    return Ir.Fragment = n,
    Ir.jsx = i,
    Ir.jsxs = i,
    Ir
}
var Zd;
function tU() {
    return Zd || (Zd = 1,
    No.exports = eU()),
    No.exports
}
var U = tU()
  , Ro = {
    exports: {}
}
  , gA = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qd;
function aU() {
    if (qd)
        return gA;
    qd = 1;
    var a = Symbol.for("react.transitional.element")
      , n = Symbol.for("react.portal")
      , i = Symbol.for("react.fragment")
      , l = Symbol.for("react.strict_mode")
      , u = Symbol.for("react.profiler")
      , c = Symbol.for("react.consumer")
      , f = Symbol.for("react.context")
      , h = Symbol.for("react.forward_ref")
      , B = Symbol.for("react.suspense")
      , d = Symbol.for("react.memo")
      , Q = Symbol.for("react.lazy")
      , C = Symbol.iterator;
    function v(p) {
        return p === null || typeof p != "object" ? null : (p = C && p[C] || p["@@iterator"],
        typeof p == "function" ? p : null)
    }
    var D = {
        isMounted: function() {
            return !1
        },
        enqueueForceUpdate: function() {},
        enqueueReplaceState: function() {},
        enqueueSetState: function() {}
    }
      , L = Object.assign
      , x = {};
    function _(p, F, J) {
        this.props = p,
        this.context = F,
        this.refs = x,
        this.updater = J || D
    }
    _.prototype.isReactComponent = {},
    _.prototype.setState = function(p, F) {
        if (typeof p != "object" && typeof p != "function" && p != null)
            throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, p, F, "setState")
    }
    ,
    _.prototype.forceUpdate = function(p) {
        this.updater.enqueueForceUpdate(this, p, "forceUpdate")
    }
    ;
    function O() {}
    O.prototype = _.prototype;
    function I(p, F, J) {
        this.props = p,
        this.context = F,
        this.refs = x,
        this.updater = J || D
    }
    var R = I.prototype = new O;
    R.constructor = I,
    L(R, _.prototype),
    R.isPureReactComponent = !0;
    var z = Array.isArray
      , X = {
        H: null,
        A: null,
        T: null,
        S: null,
        V: null
    }
      , V = Object.prototype.hasOwnProperty;
    function k(p, F, J, Z, tA, fA) {
        return J = fA.ref,
        {
            $$typeof: a,
            type: p,
            key: F,
            ref: J !== void 0 ? J : null,
            props: fA
        }
    }
    function q(p, F) {
        return k(p.type, F, void 0, void 0, void 0, p.props)
    }
    function W(p) {
        return typeof p == "object" && p !== null && p.$$typeof === a
    }
    function nA(p) {
        var F = {
            "=": "=0",
            ":": "=2"
        };
        return "$" + p.replace(/[=:]/g, function(J) {
            return F[J]
        })
    }
    var uA = /\/+/g;
    function oA(p, F) {
        return typeof p == "object" && p !== null && p.key != null ? nA("" + p.key) : F.toString(36)
    }
    function cA() {}
    function mA(p) {
        switch (p.status) {
        case "fulfilled":
            return p.value;
        case "rejected":
            throw p.reason;
        default:
            switch (typeof p.status == "string" ? p.then(cA, cA) : (p.status = "pending",
            p.then(function(F) {
                p.status === "pending" && (p.status = "fulfilled",
                p.value = F)
            }, function(F) {
                p.status === "pending" && (p.status = "rejected",
                p.reason = F)
            })),
            p.status) {
            case "fulfilled":
                return p.value;
            case "rejected":
                throw p.reason
            }
        }
        throw p
    }
    function FA(p, F, J, Z, tA) {
        var fA = typeof p;
        (fA === "undefined" || fA === "boolean") && (p = null);
        var rA = !1;
        if (p === null)
            rA = !0;
        else
            switch (fA) {
            case "bigint":
            case "string":
            case "number":
                rA = !0;
                break;
            case "object":
                switch (p.$$typeof) {
                case a:
                case n:
                    rA = !0;
                    break;
                case Q:
                    return rA = p._init,
                    FA(rA(p._payload), F, J, Z, tA)
                }
            }
        if (rA)
            return tA = tA(p),
            rA = Z === "" ? "." + oA(p, 0) : Z,
            z(tA) ? (J = "",
            rA != null && (J = rA.replace(uA, "$&/") + "/"),
            FA(tA, F, J, "", function(Lt) {
                return Lt
            })) : tA != null && (W(tA) && (tA = q(tA, J + (tA.key == null || p && p.key === tA.key ? "" : ("" + tA.key).replace(uA, "$&/") + "/") + rA)),
            F.push(tA)),
            1;
        rA = 0;
        var WA = Z === "" ? "." : Z + ":";
        if (z(p))
            for (var MA = 0; MA < p.length; MA++)
                Z = p[MA],
                fA = WA + oA(Z, MA),
                rA += FA(Z, F, J, fA, tA);
        else if (MA = v(p),
        typeof MA == "function")
            for (p = MA.call(p),
            MA = 0; !(Z = p.next()).done; )
                Z = Z.value,
                fA = WA + oA(Z, MA++),
                rA += FA(Z, F, J, fA, tA);
        else if (fA === "object") {
            if (typeof p.then == "function")
                return FA(mA(p), F, J, Z, tA);
            throw F = String(p),
            Error("Objects are not valid as a React child (found: " + (F === "[object Object]" ? "object with keys {" + Object.keys(p).join(", ") + "}" : F) + "). If you meant to render a collection of children, use an array instead.")
        }
        return rA
    }
    function K(p, F, J) {
        if (p == null)
            return p;
        var Z = []
          , tA = 0;
        return FA(p, Z, "", "", function(fA) {
            return F.call(J, fA, tA++)
        }),
        Z
    }
    function j(p) {
        if (p._status === -1) {
            var F = p._result;
            F = F(),
            F.then(function(J) {
                (p._status === 0 || p._status === -1) && (p._status = 1,
                p._result = J)
            }, function(J) {
                (p._status === 0 || p._status === -1) && (p._status = 2,
                p._result = J)
            }),
            p._status === -1 && (p._status = 0,
            p._result = F)
        }
        if (p._status === 1)
            return p._result.default;
        throw p._result
    }
    var AA = typeof reportError == "function" ? reportError : function(p) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
            var F = new window.ErrorEvent("error",{
                bubbles: !0,
                cancelable: !0,
                message: typeof p == "object" && p !== null && typeof p.message == "string" ? String(p.message) : String(p),
                error: p
            });
            if (!window.dispatchEvent(F))
                return
        } else if (typeof process == "object" && typeof process.emit == "function") {
            process.emit("uncaughtException", p);
            return
        }
        console.error(p)
    }
    ;
    function BA() {}
    return gA.Children = {
        map: K,
        forEach: function(p, F, J) {
            K(p, function() {
                F.apply(this, arguments)
            }, J)
        },
        count: function(p) {
            var F = 0;
            return K(p, function() {
                F++
            }),
            F
        },
        toArray: function(p) {
            return K(p, function(F) {
                return F
            }) || []
        },
        only: function(p) {
            if (!W(p))
                throw Error("React.Children.only expected to receive a single React element child.");
            return p
        }
    },
    gA.Component = _,
    gA.Fragment = i,
    gA.Profiler = u,
    gA.PureComponent = I,
    gA.StrictMode = l,
    gA.Suspense = B,
    gA.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = X,
    gA.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function(p) {
            return X.H.useMemoCache(p)
        }
    },
    gA.cache = function(p) {
        return function() {
            return p.apply(null, arguments)
        }
    }
    ,
    gA.cloneElement = function(p, F, J) {
        if (p == null)
            throw Error("The argument must be a React element, but you passed " + p + ".");
        var Z = L({}, p.props)
          , tA = p.key
          , fA = void 0;
        if (F != null)
            for (rA in F.ref !== void 0 && (fA = void 0),
            F.key !== void 0 && (tA = "" + F.key),
            F)
                !V.call(F, rA) || rA === "key" || rA === "__self" || rA === "__source" || rA === "ref" && F.ref === void 0 || (Z[rA] = F[rA]);
        var rA = arguments.length - 2;
        if (rA === 1)
            Z.children = J;
        else if (1 < rA) {
            for (var WA = Array(rA), MA = 0; MA < rA; MA++)
                WA[MA] = arguments[MA + 2];
            Z.children = WA
        }
        return k(p.type, tA, void 0, void 0, fA, Z)
    }
    ,
    gA.createContext = function(p) {
        return p = {
            $$typeof: f,
            _currentValue: p,
            _currentValue2: p,
            _threadCount: 0,
            Provider: null,
            Consumer: null
        },
        p.Provider = p,
        p.Consumer = {
            $$typeof: c,
            _context: p
        },
        p
    }
    ,
    gA.createElement = function(p, F, J) {
        var Z, tA = {}, fA = null;
        if (F != null)
            for (Z in F.key !== void 0 && (fA = "" + F.key),
            F)
                V.call(F, Z) && Z !== "key" && Z !== "__self" && Z !== "__source" && (tA[Z] = F[Z]);
        var rA = arguments.length - 2;
        if (rA === 1)
            tA.children = J;
        else if (1 < rA) {
            for (var WA = Array(rA), MA = 0; MA < rA; MA++)
                WA[MA] = arguments[MA + 2];
            tA.children = WA
        }
        if (p && p.defaultProps)
            for (Z in rA = p.defaultProps,
            rA)
                tA[Z] === void 0 && (tA[Z] = rA[Z]);
        return k(p, fA, void 0, void 0, null, tA)
    }
    ,
    gA.createRef = function() {
        return {
            current: null
        }
    }
    ,
    gA.forwardRef = function(p) {
        return {
            $$typeof: h,
            render: p
        }
    }
    ,
    gA.isValidElement = W,
    gA.lazy = function(p) {
        return {
            $$typeof: Q,
            _payload: {
                _status: -1,
                _result: p
            },
            _init: j
        }
    }
    ,
    gA.memo = function(p, F) {
        return {
            $$typeof: d,
            type: p,
            compare: F === void 0 ? null : F
        }
    }
    ,
    gA.startTransition = function(p) {
        var F = X.T
          , J = {};
        X.T = J;
        try {
            var Z = p()
              , tA = X.S;
            tA !== null && tA(J, Z),
            typeof Z == "object" && Z !== null && typeof Z.then == "function" && Z.then(BA, AA)
        } catch (fA) {
            AA(fA)
        } finally {
            X.T = F
        }
    }
    ,
    gA.unstable_useCacheRefresh = function() {
        return X.H.useCacheRefresh()
    }
    ,
    gA.use = function(p) {
        return X.H.use(p)
    }
    ,
    gA.useActionState = function(p, F, J) {
        return X.H.useActionState(p, F, J)
    }
    ,
    gA.useCallback = function(p, F) {
        return X.H.useCallback(p, F)
    }
    ,
    gA.useContext = function(p) {
        return X.H.useContext(p)
    }
    ,
    gA.useDebugValue = function() {}
    ,
    gA.useDeferredValue = function(p, F) {
        return X.H.useDeferredValue(p, F)
    }
    ,
    gA.useEffect = function(p, F, J) {
        var Z = X.H;
        if (typeof J == "function")
            throw Error("useEffect CRUD overload is not enabled in this build of React.");
        return Z.useEffect(p, F)
    }
    ,
    gA.useId = function() {
        return X.H.useId()
    }
    ,
    gA.useImperativeHandle = function(p, F, J) {
        return X.H.useImperativeHandle(p, F, J)
    }
    ,
    gA.useInsertionEffect = function(p, F) {
        return X.H.useInsertionEffect(p, F)
    }
    ,
    gA.useLayoutEffect = function(p, F) {
        return X.H.useLayoutEffect(p, F)
    }
    ,
    gA.useMemo = function(p, F) {
        return X.H.useMemo(p, F)
    }
    ,
    gA.useOptimistic = function(p, F) {
        return X.H.useOptimistic(p, F)
    }
    ,
    gA.useReducer = function(p, F, J) {
        return X.H.useReducer(p, F, J)
    }
    ,
    gA.useRef = function(p) {
        return X.H.useRef(p)
    }
    ,
    gA.useState = function(p) {
        return X.H.useState(p)
    }
    ,
    gA.useSyncExternalStore = function(p, F, J) {
        return X.H.useSyncExternalStore(p, F, J)
    }
    ,
    gA.useTransition = function() {
        return X.H.useTransition()
    }
    ,
    gA.version = "19.1.0",
    gA
}
var Wd;
function jc() {
    return Wd || (Wd = 1,
    Ro.exports = aU()),
    Ro.exports
}
var Y = jc();
const OA = w0(Y);
var Go = {
    exports: {}
}
  , Kr = {}
  , Vo = {
    exports: {}
}
  , Xo = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Pd;
function nU() {
    return Pd || (Pd = 1,
    function(a) {
        function n(K, j) {
            var AA = K.length;
            K.push(j);
            A: for (; 0 < AA; ) {
                var BA = AA - 1 >>> 1
                  , p = K[BA];
                if (0 < u(p, j))
                    K[BA] = j,
                    K[AA] = p,
                    AA = BA;
                else
                    break A
            }
        }
        function i(K) {
            return K.length === 0 ? null : K[0]
        }
        function l(K) {
            if (K.length === 0)
                return null;
            var j = K[0]
              , AA = K.pop();
            if (AA !== j) {
                K[0] = AA;
                A: for (var BA = 0, p = K.length, F = p >>> 1; BA < F; ) {
                    var J = 2 * (BA + 1) - 1
                      , Z = K[J]
                      , tA = J + 1
                      , fA = K[tA];
                    if (0 > u(Z, AA))
                        tA < p && 0 > u(fA, Z) ? (K[BA] = fA,
                        K[tA] = AA,
                        BA = tA) : (K[BA] = Z,
                        K[J] = AA,
                        BA = J);
                    else if (tA < p && 0 > u(fA, AA))
                        K[BA] = fA,
                        K[tA] = AA,
                        BA = tA;
                    else
                        break A
                }
            }
            return j
        }
        function u(K, j) {
            var AA = K.sortIndex - j.sortIndex;
            return AA !== 0 ? AA : K.id - j.id
        }
        if (a.unstable_now = void 0,
        typeof performance == "object" && typeof performance.now == "function") {
            var c = performance;
            a.unstable_now = function() {
                return c.now()
            }
        } else {
            var f = Date
              , h = f.now();
            a.unstable_now = function() {
                return f.now() - h
            }
        }
        var B = []
          , d = []
          , Q = 1
          , C = null
          , v = 3
          , D = !1
          , L = !1
          , x = !1
          , _ = !1
          , O = typeof setTimeout == "function" ? setTimeout : null
          , I = typeof clearTimeout == "function" ? clearTimeout : null
          , R = typeof setImmediate < "u" ? setImmediate : null;
        function z(K) {
            for (var j = i(d); j !== null; ) {
                if (j.callback === null)
                    l(d);
                else if (j.startTime <= K)
                    l(d),
                    j.sortIndex = j.expirationTime,
                    n(B, j);
                else
                    break;
                j = i(d)
            }
        }
        function X(K) {
            if (x = !1,
            z(K),
            !L)
                if (i(B) !== null)
                    L = !0,
                    V || (V = !0,
                    oA());
                else {
                    var j = i(d);
                    j !== null && FA(X, j.startTime - K)
                }
        }
        var V = !1
          , k = -1
          , q = 5
          , W = -1;
        function nA() {
            return _ ? !0 : !(a.unstable_now() - W < q)
        }
        function uA() {
            if (_ = !1,
            V) {
                var K = a.unstable_now();
                W = K;
                var j = !0;
                try {
                    A: {
                        L = !1,
                        x && (x = !1,
                        I(k),
                        k = -1),
                        D = !0;
                        var AA = v;
                        try {
                            e: {
                                for (z(K),
                                C = i(B); C !== null && !(C.expirationTime > K && nA()); ) {
                                    var BA = C.callback;
                                    if (typeof BA == "function") {
                                        C.callback = null,
                                        v = C.priorityLevel;
                                        var p = BA(C.expirationTime <= K);
                                        if (K = a.unstable_now(),
                                        typeof p == "function") {
                                            C.callback = p,
                                            z(K),
                                            j = !0;
                                            break e
                                        }
                                        C === i(B) && l(B),
                                        z(K)
                                    } else
                                        l(B);
                                    C = i(B)
                                }
                                if (C !== null)
                                    j = !0;
                                else {
                                    var F = i(d);
                                    F !== null && FA(X, F.startTime - K),
                                    j = !1
                                }
                            }
                            break A
                        } finally {
                            C = null,
                            v = AA,
                            D = !1
                        }
                        j = void 0
                    }
                } finally {
                    j ? oA() : V = !1
                }
            }
        }
        var oA;
        if (typeof R == "function")
            oA = function() {
                R(uA)
            }
            ;
        else if (typeof MessageChannel < "u") {
            var cA = new MessageChannel
              , mA = cA.port2;
            cA.port1.onmessage = uA,
            oA = function() {
                mA.postMessage(null)
            }
        } else
            oA = function() {
                O(uA, 0)
            }
            ;
        function FA(K, j) {
            k = O(function() {
                K(a.unstable_now())
            }, j)
        }
        a.unstable_IdlePriority = 5,
        a.unstable_ImmediatePriority = 1,
        a.unstable_LowPriority = 4,
        a.unstable_NormalPriority = 3,
        a.unstable_Profiling = null,
        a.unstable_UserBlockingPriority = 2,
        a.unstable_cancelCallback = function(K) {
            K.callback = null
        }
        ,
        a.unstable_forceFrameRate = function(K) {
            0 > K || 125 < K ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : q = 0 < K ? Math.floor(1e3 / K) : 5
        }
        ,
        a.unstable_getCurrentPriorityLevel = function() {
            return v
        }
        ,
        a.unstable_next = function(K) {
            switch (v) {
            case 1:
            case 2:
            case 3:
                var j = 3;
                break;
            default:
                j = v
            }
            var AA = v;
            v = j;
            try {
                return K()
            } finally {
                v = AA
            }
        }
        ,
        a.unstable_requestPaint = function() {
            _ = !0
        }
        ,
        a.unstable_runWithPriority = function(K, j) {
            switch (K) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            default:
                K = 3
            }
            var AA = v;
            v = K;
            try {
                return j()
            } finally {
                v = AA
            }
        }
        ,
        a.unstable_scheduleCallback = function(K, j, AA) {
            var BA = a.unstable_now();
            switch (typeof AA == "object" && AA !== null ? (AA = AA.delay,
            AA = typeof AA == "number" && 0 < AA ? BA + AA : BA) : AA = BA,
            K) {
            case 1:
                var p = -1;
                break;
            case 2:
                p = 250;
                break;
            case 5:
                p = 1073741823;
                break;
            case 4:
                p = 1e4;
                break;
            default:
                p = 5e3
            }
            return p = AA + p,
            K = {
                id: Q++,
                callback: j,
                priorityLevel: K,
                startTime: AA,
                expirationTime: p,
                sortIndex: -1
            },
            AA > BA ? (K.sortIndex = AA,
            n(d, K),
            i(B) === null && K === i(d) && (x ? (I(k),
            k = -1) : x = !0,
            FA(X, AA - BA))) : (K.sortIndex = p,
            n(B, K),
            L || D || (L = !0,
            V || (V = !0,
            oA()))),
            K
        }
        ,
        a.unstable_shouldYield = nA,
        a.unstable_wrapCallback = function(K) {
            var j = v;
            return function() {
                var AA = v;
                v = j;
                try {
                    return K.apply(this, arguments)
                } finally {
                    v = AA
                }
            }
        }
    }(Xo)),
    Xo
}
var $d;
function rU() {
    return $d || ($d = 1,
    Vo.exports = nU()),
    Vo.exports
}
var Yo = {
    exports: {}
}
  , Be = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ah;
function lU() {
    if (Ah)
        return Be;
    Ah = 1;
    var a = jc();
    function n(B) {
        var d = "https://react.dev/errors/" + B;
        if (1 < arguments.length) {
            d += "?args[]=" + encodeURIComponent(arguments[1]);
            for (var Q = 2; Q < arguments.length; Q++)
                d += "&args[]=" + encodeURIComponent(arguments[Q])
        }
        return "Minified React error #" + B + "; visit " + d + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    }
    function i() {}
    var l = {
        d: {
            f: i,
            r: function() {
                throw Error(n(522))
            },
            D: i,
            C: i,
            L: i,
            m: i,
            X: i,
            S: i,
            M: i
        },
        p: 0,
        findDOMNode: null
    }
      , u = Symbol.for("react.portal");
    function c(B, d, Q) {
        var C = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
        return {
            $$typeof: u,
            key: C == null ? null : "" + C,
            children: B,
            containerInfo: d,
            implementation: Q
        }
    }
    var f = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function h(B, d) {
        if (B === "font")
            return "";
        if (typeof d == "string")
            return d === "use-credentials" ? d : ""
    }
    return Be.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = l,
    Be.createPortal = function(B, d) {
        var Q = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!d || d.nodeType !== 1 && d.nodeType !== 9 && d.nodeType !== 11)
            throw Error(n(299));
        return c(B, d, null, Q)
    }
    ,
    Be.flushSync = function(B) {
        var d = f.T
          , Q = l.p;
        try {
            if (f.T = null,
            l.p = 2,
            B)
                return B()
        } finally {
            f.T = d,
            l.p = Q,
            l.d.f()
        }
    }
    ,
    Be.preconnect = function(B, d) {
        typeof B == "string" && (d ? (d = d.crossOrigin,
        d = typeof d == "string" ? d === "use-credentials" ? d : "" : void 0) : d = null,
        l.d.C(B, d))
    }
    ,
    Be.prefetchDNS = function(B) {
        typeof B == "string" && l.d.D(B)
    }
    ,
    Be.preinit = function(B, d) {
        if (typeof B == "string" && d && typeof d.as == "string") {
            var Q = d.as
              , C = h(Q, d.crossOrigin)
              , v = typeof d.integrity == "string" ? d.integrity : void 0
              , D = typeof d.fetchPriority == "string" ? d.fetchPriority : void 0;
            Q === "style" ? l.d.S(B, typeof d.precedence == "string" ? d.precedence : void 0, {
                crossOrigin: C,
                integrity: v,
                fetchPriority: D
            }) : Q === "script" && l.d.X(B, {
                crossOrigin: C,
                integrity: v,
                fetchPriority: D,
                nonce: typeof d.nonce == "string" ? d.nonce : void 0
            })
        }
    }
    ,
    Be.preinitModule = function(B, d) {
        if (typeof B == "string")
            if (typeof d == "object" && d !== null) {
                if (d.as == null || d.as === "script") {
                    var Q = h(d.as, d.crossOrigin);
                    l.d.M(B, {
                        crossOrigin: Q,
                        integrity: typeof d.integrity == "string" ? d.integrity : void 0,
                        nonce: typeof d.nonce == "string" ? d.nonce : void 0
                    })
                }
            } else
                d == null && l.d.M(B)
    }
    ,
    Be.preload = function(B, d) {
        if (typeof B == "string" && typeof d == "object" && d !== null && typeof d.as == "string") {
            var Q = d.as
              , C = h(Q, d.crossOrigin);
            l.d.L(B, Q, {
                crossOrigin: C,
                integrity: typeof d.integrity == "string" ? d.integrity : void 0,
                nonce: typeof d.nonce == "string" ? d.nonce : void 0,
                type: typeof d.type == "string" ? d.type : void 0,
                fetchPriority: typeof d.fetchPriority == "string" ? d.fetchPriority : void 0,
                referrerPolicy: typeof d.referrerPolicy == "string" ? d.referrerPolicy : void 0,
                imageSrcSet: typeof d.imageSrcSet == "string" ? d.imageSrcSet : void 0,
                imageSizes: typeof d.imageSizes == "string" ? d.imageSizes : void 0,
                media: typeof d.media == "string" ? d.media : void 0
            })
        }
    }
    ,
    Be.preloadModule = function(B, d) {
        if (typeof B == "string")
            if (d) {
                var Q = h(d.as, d.crossOrigin);
                l.d.m(B, {
                    as: typeof d.as == "string" && d.as !== "script" ? d.as : void 0,
                    crossOrigin: Q,
                    integrity: typeof d.integrity == "string" ? d.integrity : void 0
                })
            } else
                l.d.m(B)
    }
    ,
    Be.requestFormReset = function(B) {
        l.d.r(B)
    }
    ,
    Be.unstable_batchedUpdates = function(B, d) {
        return B(d)
    }
    ,
    Be.useFormState = function(B, d, Q) {
        return f.H.useFormState(B, d, Q)
    }
    ,
    Be.useFormStatus = function() {
        return f.H.useHostTransitionStatus()
    }
    ,
    Be.version = "19.1.0",
    Be
}
var eh;
function iU() {
    if (eh)
        return Yo.exports;
    eh = 1;
    function a() {
        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
            try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)
            } catch (n) {
                console.error(n)
            }
    }
    return a(),
    Yo.exports = lU(),
    Yo.exports
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var th;
function sU() {
    if (th)
        return Kr;
    th = 1;
    var a = rU()
      , n = jc()
      , i = iU();
    function l(A) {
        var e = "https://react.dev/errors/" + A;
        if (1 < arguments.length) {
            e += "?args[]=" + encodeURIComponent(arguments[1]);
            for (var t = 2; t < arguments.length; t++)
                e += "&args[]=" + encodeURIComponent(arguments[t])
        }
        return "Minified React error #" + A + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    }
    function u(A) {
        return !(!A || A.nodeType !== 1 && A.nodeType !== 9 && A.nodeType !== 11)
    }
    function c(A) {
        var e = A
          , t = A;
        if (A.alternate)
            for (; e.return; )
                e = e.return;
        else {
            A = e;
            do
                e = A,
                (e.flags & 4098) !== 0 && (t = e.return),
                A = e.return;
            while (A)
        }
        return e.tag === 3 ? t : null
    }
    function f(A) {
        if (A.tag === 13) {
            var e = A.memoizedState;
            if (e === null && (A = A.alternate,
            A !== null && (e = A.memoizedState)),
            e !== null)
                return e.dehydrated
        }
        return null
    }
    function h(A) {
        if (c(A) !== A)
            throw Error(l(188))
    }
    function B(A) {
        var e = A.alternate;
        if (!e) {
            if (e = c(A),
            e === null)
                throw Error(l(188));
            return e !== A ? null : A
        }
        for (var t = A, r = e; ; ) {
            var s = t.return;
            if (s === null)
                break;
            var o = s.alternate;
            if (o === null) {
                if (r = s.return,
                r !== null) {
                    t = r;
                    continue
                }
                break
            }
            if (s.child === o.child) {
                for (o = s.child; o; ) {
                    if (o === t)
                        return h(s),
                        A;
                    if (o === r)
                        return h(s),
                        e;
                    o = o.sibling
                }
                throw Error(l(188))
            }
            if (t.return !== r.return)
                t = s,
                r = o;
            else {
                for (var g = !1, w = s.child; w; ) {
                    if (w === t) {
                        g = !0,
                        t = s,
                        r = o;
                        break
                    }
                    if (w === r) {
                        g = !0,
                        r = s,
                        t = o;
                        break
                    }
                    w = w.sibling
                }
                if (!g) {
                    for (w = o.child; w; ) {
                        if (w === t) {
                            g = !0,
                            t = o,
                            r = s;
                            break
                        }
                        if (w === r) {
                            g = !0,
                            r = o,
                            t = s;
                            break
                        }
                        w = w.sibling
                    }
                    if (!g)
                        throw Error(l(189))
                }
            }
            if (t.alternate !== r)
                throw Error(l(190))
        }
        if (t.tag !== 3)
            throw Error(l(188));
        return t.stateNode.current === t ? A : e
    }
    function d(A) {
        var e = A.tag;
        if (e === 5 || e === 26 || e === 27 || e === 6)
            return A;
        for (A = A.child; A !== null; ) {
            if (e = d(A),
            e !== null)
                return e;
            A = A.sibling
        }
        return null
    }
    var Q = Object.assign
      , C = Symbol.for("react.element")
      , v = Symbol.for("react.transitional.element")
      , D = Symbol.for("react.portal")
      , L = Symbol.for("react.fragment")
      , x = Symbol.for("react.strict_mode")
      , _ = Symbol.for("react.profiler")
      , O = Symbol.for("react.provider")
      , I = Symbol.for("react.consumer")
      , R = Symbol.for("react.context")
      , z = Symbol.for("react.forward_ref")
      , X = Symbol.for("react.suspense")
      , V = Symbol.for("react.suspense_list")
      , k = Symbol.for("react.memo")
      , q = Symbol.for("react.lazy")
      , W = Symbol.for("react.activity")
      , nA = Symbol.for("react.memo_cache_sentinel")
      , uA = Symbol.iterator;
    function oA(A) {
        return A === null || typeof A != "object" ? null : (A = uA && A[uA] || A["@@iterator"],
        typeof A == "function" ? A : null)
    }
    var cA = Symbol.for("react.client.reference");
    function mA(A) {
        if (A == null)
            return null;
        if (typeof A == "function")
            return A.$$typeof === cA ? null : A.displayName || A.name || null;
        if (typeof A == "string")
            return A;
        switch (A) {
        case L:
            return "Fragment";
        case _:
            return "Profiler";
        case x:
            return "StrictMode";
        case X:
            return "Suspense";
        case V:
            return "SuspenseList";
        case W:
            return "Activity"
        }
        if (typeof A == "object")
            switch (A.$$typeof) {
            case D:
                return "Portal";
            case R:
                return (A.displayName || "Context") + ".Provider";
            case I:
                return (A._context.displayName || "Context") + ".Consumer";
            case z:
                var e = A.render;
                return A = A.displayName,
                A || (A = e.displayName || e.name || "",
                A = A !== "" ? "ForwardRef(" + A + ")" : "ForwardRef"),
                A;
            case k:
                return e = A.displayName || null,
                e !== null ? e : mA(A.type) || "Memo";
            case q:
                e = A._payload,
                A = A._init;
                try {
                    return mA(A(e))
                } catch {}
            }
        return null
    }
    var FA = Array.isArray
      , K = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
      , j = i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
      , AA = {
        pending: !1,
        data: null,
        method: null,
        action: null
    }
      , BA = []
      , p = -1;
    function F(A) {
        return {
            current: A
        }
    }
    function J(A) {
        0 > p || (A.current = BA[p],
        BA[p] = null,
        p--)
    }
    function Z(A, e) {
        p++,
        BA[p] = A.current,
        A.current = e
    }
    var tA = F(null)
      , fA = F(null)
      , rA = F(null)
      , WA = F(null);
    function MA(A, e) {
        switch (Z(rA, e),
        Z(fA, A),
        Z(tA, null),
        e.nodeType) {
        case 9:
        case 11:
            A = (A = e.documentElement) && (A = A.namespaceURI) ? yd(A) : 0;
            break;
        default:
            if (A = e.tagName,
            e = e.namespaceURI)
                e = yd(e),
                A = pd(e, A);
            else
                switch (A) {
                case "svg":
                    A = 1;
                    break;
                case "math":
                    A = 2;
                    break;
                default:
                    A = 0
                }
        }
        J(tA),
        Z(tA, A)
    }
    function Lt() {
        J(tA),
        J(fA),
        J(rA)
    }
    function ps(A) {
        A.memoizedState !== null && Z(WA, A);
        var e = tA.current
          , t = pd(e, A.type);
        e !== t && (Z(fA, A),
        Z(tA, t))
    }
    function il(A) {
        fA.current === A && (J(tA),
        J(fA)),
        WA.current === A && (J(WA),
        xr._currentValue = AA)
    }
    var ms = Object.prototype.hasOwnProperty
      , Fs = a.unstable_scheduleCallback
      , Es = a.unstable_cancelCallback
      , LQ = a.unstable_shouldYield
      , IQ = a.unstable_requestPaint
      , at = a.unstable_now
      , KQ = a.unstable_getCurrentPriorityLevel
      , ef = a.unstable_ImmediatePriority
      , tf = a.unstable_UserBlockingPriority
      , sl = a.unstable_NormalPriority
      , _Q = a.unstable_LowPriority
      , af = a.unstable_IdlePriority
      , OQ = a.log
      , MQ = a.unstable_setDisableYieldValue
      , On = null
      , He = null;
    function It(A) {
        if (typeof OQ == "function" && MQ(A),
        He && typeof He.setStrictMode == "function")
            try {
                He.setStrictMode(On, A)
            } catch {}
    }
    var xe = Math.clz32 ? Math.clz32 : GQ
      , NQ = Math.log
      , RQ = Math.LN2;
    function GQ(A) {
        return A >>>= 0,
        A === 0 ? 32 : 31 - (NQ(A) / RQ | 0) | 0
    }
    var ul = 256
      , ol = 4194304;
    function Ba(A) {
        var e = A & 42;
        if (e !== 0)
            return e;
        switch (A & -A) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 4:
            return 4;
        case 8:
            return 8;
        case 16:
            return 16;
        case 32:
            return 32;
        case 64:
            return 64;
        case 128:
            return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return A & 4194048;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            return A & 62914560;
        case 67108864:
            return 67108864;
        case 134217728:
            return 134217728;
        case 268435456:
            return 268435456;
        case 536870912:
            return 536870912;
        case 1073741824:
            return 0;
        default:
            return A
        }
    }
    function cl(A, e, t) {
        var r = A.pendingLanes;
        if (r === 0)
            return 0;
        var s = 0
          , o = A.suspendedLanes
          , g = A.pingedLanes;
        A = A.warmLanes;
        var w = r & 134217727;
        return w !== 0 ? (r = w & ~o,
        r !== 0 ? s = Ba(r) : (g &= w,
        g !== 0 ? s = Ba(g) : t || (t = w & ~A,
        t !== 0 && (s = Ba(t))))) : (w = r & ~o,
        w !== 0 ? s = Ba(w) : g !== 0 ? s = Ba(g) : t || (t = r & ~A,
        t !== 0 && (s = Ba(t)))),
        s === 0 ? 0 : e !== 0 && e !== s && (e & o) === 0 && (o = s & -s,
        t = e & -e,
        o >= t || o === 32 && (t & 4194048) !== 0) ? e : s
    }
    function Mn(A, e) {
        return (A.pendingLanes & ~(A.suspendedLanes & ~A.pingedLanes) & e) === 0
    }
    function VQ(A, e) {
        switch (A) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
            return e + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return e + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
            return -1;
        default:
            return -1
        }
    }
    function nf() {
        var A = ul;
        return ul <<= 1,
        (ul & 4194048) === 0 && (ul = 256),
        A
    }
    function rf() {
        var A = ol;
        return ol <<= 1,
        (ol & 62914560) === 0 && (ol = 4194304),
        A
    }
    function bs(A) {
        for (var e = [], t = 0; 31 > t; t++)
            e.push(A);
        return e
    }
    function Nn(A, e) {
        A.pendingLanes |= e,
        e !== 268435456 && (A.suspendedLanes = 0,
        A.pingedLanes = 0,
        A.warmLanes = 0)
    }
    function XQ(A, e, t, r, s, o) {
        var g = A.pendingLanes;
        A.pendingLanes = t,
        A.suspendedLanes = 0,
        A.pingedLanes = 0,
        A.warmLanes = 0,
        A.expiredLanes &= t,
        A.entangledLanes &= t,
        A.errorRecoveryDisabledLanes &= t,
        A.shellSuspendCounter = 0;
        var w = A.entanglements
          , y = A.expirationTimes
          , H = A.hiddenUpdates;
        for (t = g & ~t; 0 < t; ) {
            var M = 31 - xe(t)
              , G = 1 << M;
            w[M] = 0,
            y[M] = -1;
            var S = H[M];
            if (S !== null)
                for (H[M] = null,
                M = 0; M < S.length; M++) {
                    var T = S[M];
                    T !== null && (T.lane &= -536870913)
                }
            t &= ~G
        }
        r !== 0 && lf(A, r, 0),
        o !== 0 && s === 0 && A.tag !== 0 && (A.suspendedLanes |= o & ~(g & ~e))
    }
    function lf(A, e, t) {
        A.pendingLanes |= e,
        A.suspendedLanes &= ~e;
        var r = 31 - xe(e);
        A.entangledLanes |= e,
        A.entanglements[r] = A.entanglements[r] | 1073741824 | t & 4194090
    }
    function sf(A, e) {
        var t = A.entangledLanes |= e;
        for (A = A.entanglements; t; ) {
            var r = 31 - xe(t)
              , s = 1 << r;
            s & e | A[r] & e && (A[r] |= e),
            t &= ~s
        }
    }
    function Hs(A) {
        switch (A) {
        case 2:
            A = 1;
            break;
        case 8:
            A = 4;
            break;
        case 32:
            A = 16;
            break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            A = 128;
            break;
        case 268435456:
            A = 134217728;
            break;
        default:
            A = 0
        }
        return A
    }
    function xs(A) {
        return A &= -A,
        2 < A ? 8 < A ? (A & 134217727) !== 0 ? 32 : 268435456 : 8 : 2
    }
    function uf() {
        var A = j.p;
        return A !== 0 ? A : (A = window.event,
        A === void 0 ? 32 : Vd(A.type))
    }
    function YQ(A, e) {
        var t = j.p;
        try {
            return j.p = A,
            e()
        } finally {
            j.p = t
        }
    }
    var Kt = Math.random().toString(36).slice(2)
      , ce = "__reactFiber$" + Kt
      , ye = "__reactProps$" + Kt
      , Ma = "__reactContainer$" + Kt
      , Ss = "__reactEvents$" + Kt
      , zQ = "__reactListeners$" + Kt
      , jQ = "__reactHandles$" + Kt
      , of = "__reactResources$" + Kt
      , Rn = "__reactMarker$" + Kt;
    function Ts(A) {
        delete A[ce],
        delete A[ye],
        delete A[Ss],
        delete A[zQ],
        delete A[jQ]
    }
    function Na(A) {
        var e = A[ce];
        if (e)
            return e;
        for (var t = A.parentNode; t; ) {
            if (e = t[Ma] || t[ce]) {
                if (t = e.alternate,
                e.child !== null || t !== null && t.child !== null)
                    for (A = bd(A); A !== null; ) {
                        if (t = A[ce])
                            return t;
                        A = bd(A)
                    }
                return e
            }
            A = t,
            t = A.parentNode
        }
        return null
    }
    function Ra(A) {
        if (A = A[ce] || A[Ma]) {
            var e = A.tag;
            if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3)
                return A
        }
        return null
    }
    function Gn(A) {
        var e = A.tag;
        if (e === 5 || e === 26 || e === 27 || e === 6)
            return A.stateNode;
        throw Error(l(33))
    }
    function Ga(A) {
        var e = A[of];
        return e || (e = A[of] = {
            hoistableStyles: new Map,
            hoistableScripts: new Map
        }),
        e
    }
    function ee(A) {
        A[Rn] = !0
    }
    var cf = new Set
      , ff = {};
    function ga(A, e) {
        Va(A, e),
        Va(A + "Capture", e)
    }
    function Va(A, e) {
        for (ff[A] = e,
        A = 0; A < e.length; A++)
            cf.add(e[A])
    }
    var JQ = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$")
      , Bf = {}
      , gf = {};
    function kQ(A) {
        return ms.call(gf, A) ? !0 : ms.call(Bf, A) ? !1 : JQ.test(A) ? gf[A] = !0 : (Bf[A] = !0,
        !1)
    }
    function fl(A, e, t) {
        if (kQ(e))
            if (t === null)
                A.removeAttribute(e);
            else {
                switch (typeof t) {
                case "undefined":
                case "function":
                case "symbol":
                    A.removeAttribute(e);
                    return;
                case "boolean":
                    var r = e.toLowerCase().slice(0, 5);
                    if (r !== "data-" && r !== "aria-") {
                        A.removeAttribute(e);
                        return
                    }
                }
                A.setAttribute(e, "" + t)
            }
    }
    function Bl(A, e, t) {
        if (t === null)
            A.removeAttribute(e);
        else {
            switch (typeof t) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                A.removeAttribute(e);
                return
            }
            A.setAttribute(e, "" + t)
        }
    }
    function ft(A, e, t, r) {
        if (r === null)
            A.removeAttribute(t);
        else {
            switch (typeof r) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                A.removeAttribute(t);
                return
            }
            A.setAttributeNS(e, t, "" + r)
        }
    }
    var Ds, df;
    function Xa(A) {
        if (Ds === void 0)
            try {
                throw Error()
            } catch (t) {
                var e = t.stack.trim().match(/\n( *(at )?)/);
                Ds = e && e[1] || "",
                df = -1 < t.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < t.stack.indexOf("@") ? "@unknown:0:0" : ""
            }
        return `
` + Ds + A + df
    }
    var Ls = !1;
    function Is(A, e) {
        if (!A || Ls)
            return "";
        Ls = !0;
        var t = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
            var r = {
                DetermineComponentFrameRoot: function() {
                    try {
                        if (e) {
                            var G = function() {
                                throw Error()
                            };
                            if (Object.defineProperty(G.prototype, "props", {
                                set: function() {
                                    throw Error()
                                }
                            }),
                            typeof Reflect == "object" && Reflect.construct) {
                                try {
                                    Reflect.construct(G, [])
                                } catch (T) {
                                    var S = T
                                }
                                Reflect.construct(A, [], G)
                            } else {
                                try {
                                    G.call()
                                } catch (T) {
                                    S = T
                                }
                                A.call(G.prototype)
                            }
                        } else {
                            try {
                                throw Error()
                            } catch (T) {
                                S = T
                            }
                            (G = A()) && typeof G.catch == "function" && G.catch(function() {})
                        }
                    } catch (T) {
                        if (T && S && typeof T.stack == "string")
                            return [T.stack, S.stack]
                    }
                    return [null, null]
                }
            };
            r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
            var s = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
            s && s.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", {
                value: "DetermineComponentFrameRoot"
            });
            var o = r.DetermineComponentFrameRoot()
              , g = o[0]
              , w = o[1];
            if (g && w) {
                var y = g.split(`
`)
                  , H = w.split(`
`);
                for (s = r = 0; r < y.length && !y[r].includes("DetermineComponentFrameRoot"); )
                    r++;
                for (; s < H.length && !H[s].includes("DetermineComponentFrameRoot"); )
                    s++;
                if (r === y.length || s === H.length)
                    for (r = y.length - 1,
                    s = H.length - 1; 1 <= r && 0 <= s && y[r] !== H[s]; )
                        s--;
                for (; 1 <= r && 0 <= s; r--,
                s--)
                    if (y[r] !== H[s]) {
                        if (r !== 1 || s !== 1)
                            do
                                if (r--,
                                s--,
                                0 > s || y[r] !== H[s]) {
                                    var M = `
` + y[r].replace(" at new ", " at ");
                                    return A.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", A.displayName)),
                                    M
                                }
                            while (1 <= r && 0 <= s);
                        break
                    }
            }
        } finally {
            Ls = !1,
            Error.prepareStackTrace = t
        }
        return (t = A ? A.displayName || A.name : "") ? Xa(t) : ""
    }
    function ZQ(A) {
        switch (A.tag) {
        case 26:
        case 27:
        case 5:
            return Xa(A.type);
        case 16:
            return Xa("Lazy");
        case 13:
            return Xa("Suspense");
        case 19:
            return Xa("SuspenseList");
        case 0:
        case 15:
            return Is(A.type, !1);
        case 11:
            return Is(A.type.render, !1);
        case 1:
            return Is(A.type, !0);
        case 31:
            return Xa("Activity");
        default:
            return ""
        }
    }
    function hf(A) {
        try {
            var e = "";
            do
                e += ZQ(A),
                A = A.return;
            while (A);
            return e
        } catch (t) {
            return `
Error generating stack: ` + t.message + `
` + t.stack
        }
    }
    function Me(A) {
        switch (typeof A) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
            return A;
        case "object":
            return A;
        default:
            return ""
        }
    }
    function Qf(A) {
        var e = A.type;
        return (A = A.nodeName) && A.toLowerCase() === "input" && (e === "checkbox" || e === "radio")
    }
    function qQ(A) {
        var e = Qf(A) ? "checked" : "value"
          , t = Object.getOwnPropertyDescriptor(A.constructor.prototype, e)
          , r = "" + A[e];
        if (!A.hasOwnProperty(e) && typeof t < "u" && typeof t.get == "function" && typeof t.set == "function") {
            var s = t.get
              , o = t.set;
            return Object.defineProperty(A, e, {
                configurable: !0,
                get: function() {
                    return s.call(this)
                },
                set: function(g) {
                    r = "" + g,
                    o.call(this, g)
                }
            }),
            Object.defineProperty(A, e, {
                enumerable: t.enumerable
            }),
            {
                getValue: function() {
                    return r
                },
                setValue: function(g) {
                    r = "" + g
                },
                stopTracking: function() {
                    A._valueTracker = null,
                    delete A[e]
                }
            }
        }
    }
    function gl(A) {
        A._valueTracker || (A._valueTracker = qQ(A))
    }
    function wf(A) {
        if (!A)
            return !1;
        var e = A._valueTracker;
        if (!e)
            return !0;
        var t = e.getValue()
          , r = "";
        return A && (r = Qf(A) ? A.checked ? "true" : "false" : A.value),
        A = r,
        A !== t ? (e.setValue(A),
        !0) : !1
    }
    function dl(A) {
        if (A = A || (typeof document < "u" ? document : void 0),
        typeof A > "u")
            return null;
        try {
            return A.activeElement || A.body
        } catch {
            return A.body
        }
    }
    var WQ = /[\n"\\]/g;
    function Ne(A) {
        return A.replace(WQ, function(e) {
            return "\\" + e.charCodeAt(0).toString(16) + " "
        })
    }
    function Ks(A, e, t, r, s, o, g, w) {
        A.name = "",
        g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? A.type = g : A.removeAttribute("type"),
        e != null ? g === "number" ? (e === 0 && A.value === "" || A.value != e) && (A.value = "" + Me(e)) : A.value !== "" + Me(e) && (A.value = "" + Me(e)) : g !== "submit" && g !== "reset" || A.removeAttribute("value"),
        e != null ? _s(A, g, Me(e)) : t != null ? _s(A, g, Me(t)) : r != null && A.removeAttribute("value"),
        s == null && o != null && (A.defaultChecked = !!o),
        s != null && (A.checked = s && typeof s != "function" && typeof s != "symbol"),
        w != null && typeof w != "function" && typeof w != "symbol" && typeof w != "boolean" ? A.name = "" + Me(w) : A.removeAttribute("name")
    }
    function Cf(A, e, t, r, s, o, g, w) {
        if (o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (A.type = o),
        e != null || t != null) {
            if (!(o !== "submit" && o !== "reset" || e != null))
                return;
            t = t != null ? "" + Me(t) : "",
            e = e != null ? "" + Me(e) : t,
            w || e === A.value || (A.value = e),
            A.defaultValue = e
        }
        r = r ?? s,
        r = typeof r != "function" && typeof r != "symbol" && !!r,
        A.checked = w ? A.checked : !!r,
        A.defaultChecked = !!r,
        g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" && (A.name = g)
    }
    function _s(A, e, t) {
        e === "number" && dl(A.ownerDocument) === A || A.defaultValue === "" + t || (A.defaultValue = "" + t)
    }
    function Ya(A, e, t, r) {
        if (A = A.options,
        e) {
            e = {};
            for (var s = 0; s < t.length; s++)
                e["$" + t[s]] = !0;
            for (t = 0; t < A.length; t++)
                s = e.hasOwnProperty("$" + A[t].value),
                A[t].selected !== s && (A[t].selected = s),
                s && r && (A[t].defaultSelected = !0)
        } else {
            for (t = "" + Me(t),
            e = null,
            s = 0; s < A.length; s++) {
                if (A[s].value === t) {
                    A[s].selected = !0,
                    r && (A[s].defaultSelected = !0);
                    return
                }
                e !== null || A[s].disabled || (e = A[s])
            }
            e !== null && (e.selected = !0)
        }
    }
    function Uf(A, e, t) {
        if (e != null && (e = "" + Me(e),
        e !== A.value && (A.value = e),
        t == null)) {
            A.defaultValue !== e && (A.defaultValue = e);
            return
        }
        A.defaultValue = t != null ? "" + Me(t) : ""
    }
    function vf(A, e, t, r) {
        if (e == null) {
            if (r != null) {
                if (t != null)
                    throw Error(l(92));
                if (FA(r)) {
                    if (1 < r.length)
                        throw Error(l(93));
                    r = r[0]
                }
                t = r
            }
            t == null && (t = ""),
            e = t
        }
        t = Me(e),
        A.defaultValue = t,
        r = A.textContent,
        r === t && r !== "" && r !== null && (A.value = r)
    }
    function za(A, e) {
        if (e) {
            var t = A.firstChild;
            if (t && t === A.lastChild && t.nodeType === 3) {
                t.nodeValue = e;
                return
            }
        }
        A.textContent = e
    }
    var PQ = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function yf(A, e, t) {
        var r = e.indexOf("--") === 0;
        t == null || typeof t == "boolean" || t === "" ? r ? A.setProperty(e, "") : e === "float" ? A.cssFloat = "" : A[e] = "" : r ? A.setProperty(e, t) : typeof t != "number" || t === 0 || PQ.has(e) ? e === "float" ? A.cssFloat = t : A[e] = ("" + t).trim() : A[e] = t + "px"
    }
    function pf(A, e, t) {
        if (e != null && typeof e != "object")
            throw Error(l(62));
        if (A = A.style,
        t != null) {
            for (var r in t)
                !t.hasOwnProperty(r) || e != null && e.hasOwnProperty(r) || (r.indexOf("--") === 0 ? A.setProperty(r, "") : r === "float" ? A.cssFloat = "" : A[r] = "");
            for (var s in e)
                r = e[s],
                e.hasOwnProperty(s) && t[s] !== r && yf(A, s, r)
        } else
            for (var o in e)
                e.hasOwnProperty(o) && yf(A, o, e[o])
    }
    function Os(A) {
        if (A.indexOf("-") === -1)
            return !1;
        switch (A) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
            return !1;
        default:
            return !0
        }
    }
    var $Q = new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]])
      , Aw = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function hl(A) {
        return Aw.test("" + A) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : A
    }
    var Ms = null;
    function Ns(A) {
        return A = A.target || A.srcElement || window,
        A.correspondingUseElement && (A = A.correspondingUseElement),
        A.nodeType === 3 ? A.parentNode : A
    }
    var ja = null
      , Ja = null;
    function mf(A) {
        var e = Ra(A);
        if (e && (A = e.stateNode)) {
            var t = A[ye] || null;
            A: switch (A = e.stateNode,
            e.type) {
            case "input":
                if (Ks(A, t.value, t.defaultValue, t.defaultValue, t.checked, t.defaultChecked, t.type, t.name),
                e = t.name,
                t.type === "radio" && e != null) {
                    for (t = A; t.parentNode; )
                        t = t.parentNode;
                    for (t = t.querySelectorAll('input[name="' + Ne("" + e) + '"][type="radio"]'),
                    e = 0; e < t.length; e++) {
                        var r = t[e];
                        if (r !== A && r.form === A.form) {
                            var s = r[ye] || null;
                            if (!s)
                                throw Error(l(90));
                            Ks(r, s.value, s.defaultValue, s.defaultValue, s.checked, s.defaultChecked, s.type, s.name)
                        }
                    }
                    for (e = 0; e < t.length; e++)
                        r = t[e],
                        r.form === A.form && wf(r)
                }
                break A;
            case "textarea":
                Uf(A, t.value, t.defaultValue);
                break A;
            case "select":
                e = t.value,
                e != null && Ya(A, !!t.multiple, e, !1)
            }
        }
    }
    var Rs = !1;
    function Ff(A, e, t) {
        if (Rs)
            return A(e, t);
        Rs = !0;
        try {
            var r = A(e);
            return r
        } finally {
            if (Rs = !1,
            (ja !== null || Ja !== null) && (ei(),
            ja && (e = ja,
            A = Ja,
            Ja = ja = null,
            mf(e),
            A)))
                for (e = 0; e < A.length; e++)
                    mf(A[e])
        }
    }
    function Vn(A, e) {
        var t = A.stateNode;
        if (t === null)
            return null;
        var r = t[ye] || null;
        if (r === null)
            return null;
        t = r[e];
        A: switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
            (r = !r.disabled) || (A = A.type,
            r = !(A === "button" || A === "input" || A === "select" || A === "textarea")),
            A = !r;
            break A;
        default:
            A = !1
        }
        if (A)
            return null;
        if (t && typeof t != "function")
            throw Error(l(231, e, typeof t));
        return t
    }
    var Bt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u")
      , Gs = !1;
    if (Bt)
        try {
            var Xn = {};
            Object.defineProperty(Xn, "passive", {
                get: function() {
                    Gs = !0
                }
            }),
            window.addEventListener("test", Xn, Xn),
            window.removeEventListener("test", Xn, Xn)
        } catch {
            Gs = !1
        }
    var _t = null
      , Vs = null
      , Ql = null;
    function Ef() {
        if (Ql)
            return Ql;
        var A, e = Vs, t = e.length, r, s = "value"in _t ? _t.value : _t.textContent, o = s.length;
        for (A = 0; A < t && e[A] === s[A]; A++)
            ;
        var g = t - A;
        for (r = 1; r <= g && e[t - r] === s[o - r]; r++)
            ;
        return Ql = s.slice(A, 1 < r ? 1 - r : void 0)
    }
    function wl(A) {
        var e = A.keyCode;
        return "charCode"in A ? (A = A.charCode,
        A === 0 && e === 13 && (A = 13)) : A = e,
        A === 10 && (A = 13),
        32 <= A || A === 13 ? A : 0
    }
    function Cl() {
        return !0
    }
    function bf() {
        return !1
    }
    function pe(A) {
        function e(t, r, s, o, g) {
            this._reactName = t,
            this._targetInst = s,
            this.type = r,
            this.nativeEvent = o,
            this.target = g,
            this.currentTarget = null;
            for (var w in A)
                A.hasOwnProperty(w) && (t = A[w],
                this[w] = t ? t(o) : o[w]);
            return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? Cl : bf,
            this.isPropagationStopped = bf,
            this
        }
        return Q(e.prototype, {
            preventDefault: function() {
                this.defaultPrevented = !0;
                var t = this.nativeEvent;
                t && (t.preventDefault ? t.preventDefault() : typeof t.returnValue != "unknown" && (t.returnValue = !1),
                this.isDefaultPrevented = Cl)
            },
            stopPropagation: function() {
                var t = this.nativeEvent;
                t && (t.stopPropagation ? t.stopPropagation() : typeof t.cancelBubble != "unknown" && (t.cancelBubble = !0),
                this.isPropagationStopped = Cl)
            },
            persist: function() {},
            isPersistent: Cl
        }),
        e
    }
    var da = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function(A) {
            return A.timeStamp || Date.now()
        },
        defaultPrevented: 0,
        isTrusted: 0
    }, Ul = pe(da), Yn = Q({}, da, {
        view: 0,
        detail: 0
    }), ew = pe(Yn), Xs, Ys, zn, vl = Q({}, Yn, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: js,
        button: 0,
        buttons: 0,
        relatedTarget: function(A) {
            return A.relatedTarget === void 0 ? A.fromElement === A.srcElement ? A.toElement : A.fromElement : A.relatedTarget
        },
        movementX: function(A) {
            return "movementX"in A ? A.movementX : (A !== zn && (zn && A.type === "mousemove" ? (Xs = A.screenX - zn.screenX,
            Ys = A.screenY - zn.screenY) : Ys = Xs = 0,
            zn = A),
            Xs)
        },
        movementY: function(A) {
            return "movementY"in A ? A.movementY : Ys
        }
    }), Hf = pe(vl), tw = Q({}, vl, {
        dataTransfer: 0
    }), aw = pe(tw), nw = Q({}, Yn, {
        relatedTarget: 0
    }), zs = pe(nw), rw = Q({}, da, {
        animationName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    }), lw = pe(rw), iw = Q({}, da, {
        clipboardData: function(A) {
            return "clipboardData"in A ? A.clipboardData : window.clipboardData
        }
    }), sw = pe(iw), uw = Q({}, da, {
        data: 0
    }), xf = pe(uw), ow = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
    }, cw = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
    }, fw = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey"
    };
    function Bw(A) {
        var e = this.nativeEvent;
        return e.getModifierState ? e.getModifierState(A) : (A = fw[A]) ? !!e[A] : !1
    }
    function js() {
        return Bw
    }
    var gw = Q({}, Yn, {
        key: function(A) {
            if (A.key) {
                var e = ow[A.key] || A.key;
                if (e !== "Unidentified")
                    return e
            }
            return A.type === "keypress" ? (A = wl(A),
            A === 13 ? "Enter" : String.fromCharCode(A)) : A.type === "keydown" || A.type === "keyup" ? cw[A.keyCode] || "Unidentified" : ""
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: js,
        charCode: function(A) {
            return A.type === "keypress" ? wl(A) : 0
        },
        keyCode: function(A) {
            return A.type === "keydown" || A.type === "keyup" ? A.keyCode : 0
        },
        which: function(A) {
            return A.type === "keypress" ? wl(A) : A.type === "keydown" || A.type === "keyup" ? A.keyCode : 0
        }
    })
      , dw = pe(gw)
      , hw = Q({}, vl, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0
    })
      , Sf = pe(hw)
      , Qw = Q({}, Yn, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: js
    })
      , ww = pe(Qw)
      , Cw = Q({}, da, {
        propertyName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    })
      , Uw = pe(Cw)
      , vw = Q({}, vl, {
        deltaX: function(A) {
            return "deltaX"in A ? A.deltaX : "wheelDeltaX"in A ? -A.wheelDeltaX : 0
        },
        deltaY: function(A) {
            return "deltaY"in A ? A.deltaY : "wheelDeltaY"in A ? -A.wheelDeltaY : "wheelDelta"in A ? -A.wheelDelta : 0
        },
        deltaZ: 0,
        deltaMode: 0
    })
      , yw = pe(vw)
      , pw = Q({}, da, {
        newState: 0,
        oldState: 0
    })
      , mw = pe(pw)
      , Fw = [9, 13, 27, 32]
      , Js = Bt && "CompositionEvent"in window
      , jn = null;
    Bt && "documentMode"in document && (jn = document.documentMode);
    var Ew = Bt && "TextEvent"in window && !jn
      , Tf = Bt && (!Js || jn && 8 < jn && 11 >= jn)
      , Df = " "
      , Lf = !1;
    function If(A, e) {
        switch (A) {
        case "keyup":
            return Fw.indexOf(e.keyCode) !== -1;
        case "keydown":
            return e.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
            return !0;
        default:
            return !1
        }
    }
    function Kf(A) {
        return A = A.detail,
        typeof A == "object" && "data"in A ? A.data : null
    }
    var ka = !1;
    function bw(A, e) {
        switch (A) {
        case "compositionend":
            return Kf(e);
        case "keypress":
            return e.which !== 32 ? null : (Lf = !0,
            Df);
        case "textInput":
            return A = e.data,
            A === Df && Lf ? null : A;
        default:
            return null
        }
    }
    function Hw(A, e) {
        if (ka)
            return A === "compositionend" || !Js && If(A, e) ? (A = Ef(),
            Ql = Vs = _t = null,
            ka = !1,
            A) : null;
        switch (A) {
        case "paste":
            return null;
        case "keypress":
            if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
                if (e.char && 1 < e.char.length)
                    return e.char;
                if (e.which)
                    return String.fromCharCode(e.which)
            }
            return null;
        case "compositionend":
            return Tf && e.locale !== "ko" ? null : e.data;
        default:
            return null
        }
    }
    var xw = {
        color: !0,
        date: !0,
        datetime: !0,
        "datetime-local": !0,
        email: !0,
        month: !0,
        number: !0,
        password: !0,
        range: !0,
        search: !0,
        tel: !0,
        text: !0,
        time: !0,
        url: !0,
        week: !0
    };
    function _f(A) {
        var e = A && A.nodeName && A.nodeName.toLowerCase();
        return e === "input" ? !!xw[A.type] : e === "textarea"
    }
    function Of(A, e, t, r) {
        ja ? Ja ? Ja.push(r) : Ja = [r] : ja = r,
        e = ii(e, "onChange"),
        0 < e.length && (t = new Ul("onChange","change",null,t,r),
        A.push({
            event: t,
            listeners: e
        }))
    }
    var Jn = null
      , kn = null;
    function Sw(A) {
        Qd(A, 0)
    }
    function yl(A) {
        var e = Gn(A);
        if (wf(e))
            return A
    }
    function Mf(A, e) {
        if (A === "change")
            return e
    }
    var Nf = !1;
    if (Bt) {
        var ks;
        if (Bt) {
            var Zs = "oninput"in document;
            if (!Zs) {
                var Rf = document.createElement("div");
                Rf.setAttribute("oninput", "return;"),
                Zs = typeof Rf.oninput == "function"
            }
            ks = Zs
        } else
            ks = !1;
        Nf = ks && (!document.documentMode || 9 < document.documentMode)
    }
    function Gf() {
        Jn && (Jn.detachEvent("onpropertychange", Vf),
        kn = Jn = null)
    }
    function Vf(A) {
        if (A.propertyName === "value" && yl(kn)) {
            var e = [];
            Of(e, kn, A, Ns(A)),
            Ff(Sw, e)
        }
    }
    function Tw(A, e, t) {
        A === "focusin" ? (Gf(),
        Jn = e,
        kn = t,
        Jn.attachEvent("onpropertychange", Vf)) : A === "focusout" && Gf()
    }
    function Dw(A) {
        if (A === "selectionchange" || A === "keyup" || A === "keydown")
            return yl(kn)
    }
    function Lw(A, e) {
        if (A === "click")
            return yl(e)
    }
    function Iw(A, e) {
        if (A === "input" || A === "change")
            return yl(e)
    }
    function Kw(A, e) {
        return A === e && (A !== 0 || 1 / A === 1 / e) || A !== A && e !== e
    }
    var Se = typeof Object.is == "function" ? Object.is : Kw;
    function Zn(A, e) {
        if (Se(A, e))
            return !0;
        if (typeof A != "object" || A === null || typeof e != "object" || e === null)
            return !1;
        var t = Object.keys(A)
          , r = Object.keys(e);
        if (t.length !== r.length)
            return !1;
        for (r = 0; r < t.length; r++) {
            var s = t[r];
            if (!ms.call(e, s) || !Se(A[s], e[s]))
                return !1
        }
        return !0
    }
    function Xf(A) {
        for (; A && A.firstChild; )
            A = A.firstChild;
        return A
    }
    function Yf(A, e) {
        var t = Xf(A);
        A = 0;
        for (var r; t; ) {
            if (t.nodeType === 3) {
                if (r = A + t.textContent.length,
                A <= e && r >= e)
                    return {
                        node: t,
                        offset: e - A
                    };
                A = r
            }
            A: {
                for (; t; ) {
                    if (t.nextSibling) {
                        t = t.nextSibling;
                        break A
                    }
                    t = t.parentNode
                }
                t = void 0
            }
            t = Xf(t)
        }
    }
    function zf(A, e) {
        return A && e ? A === e ? !0 : A && A.nodeType === 3 ? !1 : e && e.nodeType === 3 ? zf(A, e.parentNode) : "contains"in A ? A.contains(e) : A.compareDocumentPosition ? !!(A.compareDocumentPosition(e) & 16) : !1 : !1
    }
    function jf(A) {
        A = A != null && A.ownerDocument != null && A.ownerDocument.defaultView != null ? A.ownerDocument.defaultView : window;
        for (var e = dl(A.document); e instanceof A.HTMLIFrameElement; ) {
            try {
                var t = typeof e.contentWindow.location.href == "string"
            } catch {
                t = !1
            }
            if (t)
                A = e.contentWindow;
            else
                break;
            e = dl(A.document)
        }
        return e
    }
    function qs(A) {
        var e = A && A.nodeName && A.nodeName.toLowerCase();
        return e && (e === "input" && (A.type === "text" || A.type === "search" || A.type === "tel" || A.type === "url" || A.type === "password") || e === "textarea" || A.contentEditable === "true")
    }
    var _w = Bt && "documentMode"in document && 11 >= document.documentMode
      , Za = null
      , Ws = null
      , qn = null
      , Ps = !1;
    function Jf(A, e, t) {
        var r = t.window === t ? t.document : t.nodeType === 9 ? t : t.ownerDocument;
        Ps || Za == null || Za !== dl(r) || (r = Za,
        "selectionStart"in r && qs(r) ? r = {
            start: r.selectionStart,
            end: r.selectionEnd
        } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(),
        r = {
            anchorNode: r.anchorNode,
            anchorOffset: r.anchorOffset,
            focusNode: r.focusNode,
            focusOffset: r.focusOffset
        }),
        qn && Zn(qn, r) || (qn = r,
        r = ii(Ws, "onSelect"),
        0 < r.length && (e = new Ul("onSelect","select",null,e,t),
        A.push({
            event: e,
            listeners: r
        }),
        e.target = Za)))
    }
    function ha(A, e) {
        var t = {};
        return t[A.toLowerCase()] = e.toLowerCase(),
        t["Webkit" + A] = "webkit" + e,
        t["Moz" + A] = "moz" + e,
        t
    }
    var qa = {
        animationend: ha("Animation", "AnimationEnd"),
        animationiteration: ha("Animation", "AnimationIteration"),
        animationstart: ha("Animation", "AnimationStart"),
        transitionrun: ha("Transition", "TransitionRun"),
        transitionstart: ha("Transition", "TransitionStart"),
        transitioncancel: ha("Transition", "TransitionCancel"),
        transitionend: ha("Transition", "TransitionEnd")
    }
      , $s = {}
      , kf = {};
    Bt && (kf = document.createElement("div").style,
    "AnimationEvent"in window || (delete qa.animationend.animation,
    delete qa.animationiteration.animation,
    delete qa.animationstart.animation),
    "TransitionEvent"in window || delete qa.transitionend.transition);
    function Qa(A) {
        if ($s[A])
            return $s[A];
        if (!qa[A])
            return A;
        var e = qa[A], t;
        for (t in e)
            if (e.hasOwnProperty(t) && t in kf)
                return $s[A] = e[t];
        return A
    }
    var Zf = Qa("animationend")
      , qf = Qa("animationiteration")
      , Wf = Qa("animationstart")
      , Ow = Qa("transitionrun")
      , Mw = Qa("transitionstart")
      , Nw = Qa("transitioncancel")
      , Pf = Qa("transitionend")
      , $f = new Map
      , Au = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    Au.push("scrollEnd");
    function We(A, e) {
        $f.set(A, e),
        ga(e, [A])
    }
    var AB = new WeakMap;
    function Re(A, e) {
        if (typeof A == "object" && A !== null) {
            var t = AB.get(A);
            return t !== void 0 ? t : (e = {
                value: A,
                source: e,
                stack: hf(e)
            },
            AB.set(A, e),
            e)
        }
        return {
            value: A,
            source: e,
            stack: hf(e)
        }
    }
    var Ge = []
      , Wa = 0
      , eu = 0;
    function pl() {
        for (var A = Wa, e = eu = Wa = 0; e < A; ) {
            var t = Ge[e];
            Ge[e++] = null;
            var r = Ge[e];
            Ge[e++] = null;
            var s = Ge[e];
            Ge[e++] = null;
            var o = Ge[e];
            if (Ge[e++] = null,
            r !== null && s !== null) {
                var g = r.pending;
                g === null ? s.next = s : (s.next = g.next,
                g.next = s),
                r.pending = s
            }
            o !== 0 && eB(t, s, o)
        }
    }
    function ml(A, e, t, r) {
        Ge[Wa++] = A,
        Ge[Wa++] = e,
        Ge[Wa++] = t,
        Ge[Wa++] = r,
        eu |= r,
        A.lanes |= r,
        A = A.alternate,
        A !== null && (A.lanes |= r)
    }
    function tu(A, e, t, r) {
        return ml(A, e, t, r),
        Fl(A)
    }
    function Pa(A, e) {
        return ml(A, null, null, e),
        Fl(A)
    }
    function eB(A, e, t) {
        A.lanes |= t;
        var r = A.alternate;
        r !== null && (r.lanes |= t);
        for (var s = !1, o = A.return; o !== null; )
            o.childLanes |= t,
            r = o.alternate,
            r !== null && (r.childLanes |= t),
            o.tag === 22 && (A = o.stateNode,
            A === null || A._visibility & 1 || (s = !0)),
            A = o,
            o = o.return;
        return A.tag === 3 ? (o = A.stateNode,
        s && e !== null && (s = 31 - xe(t),
        A = o.hiddenUpdates,
        r = A[s],
        r === null ? A[s] = [e] : r.push(e),
        e.lane = t | 536870912),
        o) : null
    }
    function Fl(A) {
        if (50 < vr)
            throw vr = 0,
            so = null,
            Error(l(185));
        for (var e = A.return; e !== null; )
            A = e,
            e = A.return;
        return A.tag === 3 ? A.stateNode : null
    }
    var $a = {};
    function Rw(A, e, t, r) {
        this.tag = A,
        this.key = t,
        this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null,
        this.index = 0,
        this.refCleanup = this.ref = null,
        this.pendingProps = e,
        this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null,
        this.mode = r,
        this.subtreeFlags = this.flags = 0,
        this.deletions = null,
        this.childLanes = this.lanes = 0,
        this.alternate = null
    }
    function Te(A, e, t, r) {
        return new Rw(A,e,t,r)
    }
    function au(A) {
        return A = A.prototype,
        !(!A || !A.isReactComponent)
    }
    function gt(A, e) {
        var t = A.alternate;
        return t === null ? (t = Te(A.tag, e, A.key, A.mode),
        t.elementType = A.elementType,
        t.type = A.type,
        t.stateNode = A.stateNode,
        t.alternate = A,
        A.alternate = t) : (t.pendingProps = e,
        t.type = A.type,
        t.flags = 0,
        t.subtreeFlags = 0,
        t.deletions = null),
        t.flags = A.flags & 65011712,
        t.childLanes = A.childLanes,
        t.lanes = A.lanes,
        t.child = A.child,
        t.memoizedProps = A.memoizedProps,
        t.memoizedState = A.memoizedState,
        t.updateQueue = A.updateQueue,
        e = A.dependencies,
        t.dependencies = e === null ? null : {
            lanes: e.lanes,
            firstContext: e.firstContext
        },
        t.sibling = A.sibling,
        t.index = A.index,
        t.ref = A.ref,
        t.refCleanup = A.refCleanup,
        t
    }
    function tB(A, e) {
        A.flags &= 65011714;
        var t = A.alternate;
        return t === null ? (A.childLanes = 0,
        A.lanes = e,
        A.child = null,
        A.subtreeFlags = 0,
        A.memoizedProps = null,
        A.memoizedState = null,
        A.updateQueue = null,
        A.dependencies = null,
        A.stateNode = null) : (A.childLanes = t.childLanes,
        A.lanes = t.lanes,
        A.child = t.child,
        A.subtreeFlags = 0,
        A.deletions = null,
        A.memoizedProps = t.memoizedProps,
        A.memoizedState = t.memoizedState,
        A.updateQueue = t.updateQueue,
        A.type = t.type,
        e = t.dependencies,
        A.dependencies = e === null ? null : {
            lanes: e.lanes,
            firstContext: e.firstContext
        }),
        A
    }
    function El(A, e, t, r, s, o) {
        var g = 0;
        if (r = A,
        typeof A == "function")
            au(A) && (g = 1);
        else if (typeof A == "string")
            g = VC(A, t, tA.current) ? 26 : A === "html" || A === "head" || A === "body" ? 27 : 5;
        else
            A: switch (A) {
            case W:
                return A = Te(31, t, e, s),
                A.elementType = W,
                A.lanes = o,
                A;
            case L:
                return wa(t.children, s, o, e);
            case x:
                g = 8,
                s |= 24;
                break;
            case _:
                return A = Te(12, t, e, s | 2),
                A.elementType = _,
                A.lanes = o,
                A;
            case X:
                return A = Te(13, t, e, s),
                A.elementType = X,
                A.lanes = o,
                A;
            case V:
                return A = Te(19, t, e, s),
                A.elementType = V,
                A.lanes = o,
                A;
            default:
                if (typeof A == "object" && A !== null)
                    switch (A.$$typeof) {
                    case O:
                    case R:
                        g = 10;
                        break A;
                    case I:
                        g = 9;
                        break A;
                    case z:
                        g = 11;
                        break A;
                    case k:
                        g = 14;
                        break A;
                    case q:
                        g = 16,
                        r = null;
                        break A
                    }
                g = 29,
                t = Error(l(130, A === null ? "null" : typeof A, "")),
                r = null
            }
        return e = Te(g, t, e, s),
        e.elementType = A,
        e.type = r,
        e.lanes = o,
        e
    }
    function wa(A, e, t, r) {
        return A = Te(7, A, r, e),
        A.lanes = t,
        A
    }
    function nu(A, e, t) {
        return A = Te(6, A, null, e),
        A.lanes = t,
        A
    }
    function ru(A, e, t) {
        return e = Te(4, A.children !== null ? A.children : [], A.key, e),
        e.lanes = t,
        e.stateNode = {
            containerInfo: A.containerInfo,
            pendingChildren: null,
            implementation: A.implementation
        },
        e
    }
    var An = []
      , en = 0
      , bl = null
      , Hl = 0
      , Ve = []
      , Xe = 0
      , Ca = null
      , dt = 1
      , ht = "";
    function Ua(A, e) {
        An[en++] = Hl,
        An[en++] = bl,
        bl = A,
        Hl = e
    }
    function aB(A, e, t) {
        Ve[Xe++] = dt,
        Ve[Xe++] = ht,
        Ve[Xe++] = Ca,
        Ca = A;
        var r = dt;
        A = ht;
        var s = 32 - xe(r) - 1;
        r &= ~(1 << s),
        t += 1;
        var o = 32 - xe(e) + s;
        if (30 < o) {
            var g = s - s % 5;
            o = (r & (1 << g) - 1).toString(32),
            r >>= g,
            s -= g,
            dt = 1 << 32 - xe(e) + s | t << s | r,
            ht = o + A
        } else
            dt = 1 << o | t << s | r,
            ht = A
    }
    function lu(A) {
        A.return !== null && (Ua(A, 1),
        aB(A, 1, 0))
    }
    function iu(A) {
        for (; A === bl; )
            bl = An[--en],
            An[en] = null,
            Hl = An[--en],
            An[en] = null;
        for (; A === Ca; )
            Ca = Ve[--Xe],
            Ve[Xe] = null,
            ht = Ve[--Xe],
            Ve[Xe] = null,
            dt = Ve[--Xe],
            Ve[Xe] = null
    }
    var Ce = null
      , VA = null
      , pA = !1
      , va = null
      , nt = !1
      , su = Error(l(519));
    function ya(A) {
        var e = Error(l(418, ""));
        throw $n(Re(e, A)),
        su
    }
    function nB(A) {
        var e = A.stateNode
          , t = A.type
          , r = A.memoizedProps;
        switch (e[ce] = A,
        e[ye] = r,
        t) {
        case "dialog":
            wA("cancel", e),
            wA("close", e);
            break;
        case "iframe":
        case "object":
        case "embed":
            wA("load", e);
            break;
        case "video":
        case "audio":
            for (t = 0; t < pr.length; t++)
                wA(pr[t], e);
            break;
        case "source":
            wA("error", e);
            break;
        case "img":
        case "image":
        case "link":
            wA("error", e),
            wA("load", e);
            break;
        case "details":
            wA("toggle", e);
            break;
        case "input":
            wA("invalid", e),
            Cf(e, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0),
            gl(e);
            break;
        case "select":
            wA("invalid", e);
            break;
        case "textarea":
            wA("invalid", e),
            vf(e, r.value, r.defaultValue, r.children),
            gl(e)
        }
        t = r.children,
        typeof t != "string" && typeof t != "number" && typeof t != "bigint" || e.textContent === "" + t || r.suppressHydrationWarning === !0 || vd(e.textContent, t) ? (r.popover != null && (wA("beforetoggle", e),
        wA("toggle", e)),
        r.onScroll != null && wA("scroll", e),
        r.onScrollEnd != null && wA("scrollend", e),
        r.onClick != null && (e.onclick = si),
        e = !0) : e = !1,
        e || ya(A)
    }
    function rB(A) {
        for (Ce = A.return; Ce; )
            switch (Ce.tag) {
            case 5:
            case 13:
                nt = !1;
                return;
            case 27:
            case 3:
                nt = !0;
                return;
            default:
                Ce = Ce.return
            }
    }
    function Wn(A) {
        if (A !== Ce)
            return !1;
        if (!pA)
            return rB(A),
            pA = !0,
            !1;
        var e = A.tag, t;
        if ((t = e !== 3 && e !== 27) && ((t = e === 5) && (t = A.type,
        t = !(t !== "form" && t !== "button") || Fo(A.type, A.memoizedProps)),
        t = !t),
        t && VA && ya(A),
        rB(A),
        e === 13) {
            if (A = A.memoizedState,
            A = A !== null ? A.dehydrated : null,
            !A)
                throw Error(l(317));
            A: {
                for (A = A.nextSibling,
                e = 0; A; ) {
                    if (A.nodeType === 8)
                        if (t = A.data,
                        t === "/$") {
                            if (e === 0) {
                                VA = $e(A.nextSibling);
                                break A
                            }
                            e--
                        } else
                            t !== "$" && t !== "$!" && t !== "$?" || e++;
                    A = A.nextSibling
                }
                VA = null
            }
        } else
            e === 27 ? (e = VA,
            Pt(A.type) ? (A = xo,
            xo = null,
            VA = A) : VA = e) : VA = Ce ? $e(A.stateNode.nextSibling) : null;
        return !0
    }
    function Pn() {
        VA = Ce = null,
        pA = !1
    }
    function lB() {
        var A = va;
        return A !== null && (Ee === null ? Ee = A : Ee.push.apply(Ee, A),
        va = null),
        A
    }
    function $n(A) {
        va === null ? va = [A] : va.push(A)
    }
    var uu = F(null)
      , pa = null
      , Qt = null;
    function Ot(A, e, t) {
        Z(uu, e._currentValue),
        e._currentValue = t
    }
    function wt(A) {
        A._currentValue = uu.current,
        J(uu)
    }
    function ou(A, e, t) {
        for (; A !== null; ) {
            var r = A.alternate;
            if ((A.childLanes & e) !== e ? (A.childLanes |= e,
            r !== null && (r.childLanes |= e)) : r !== null && (r.childLanes & e) !== e && (r.childLanes |= e),
            A === t)
                break;
            A = A.return
        }
    }
    function cu(A, e, t, r) {
        var s = A.child;
        for (s !== null && (s.return = A); s !== null; ) {
            var o = s.dependencies;
            if (o !== null) {
                var g = s.child;
                o = o.firstContext;
                A: for (; o !== null; ) {
                    var w = o;
                    o = s;
                    for (var y = 0; y < e.length; y++)
                        if (w.context === e[y]) {
                            o.lanes |= t,
                            w = o.alternate,
                            w !== null && (w.lanes |= t),
                            ou(o.return, t, A),
                            r || (g = null);
                            break A
                        }
                    o = w.next
                }
            } else if (s.tag === 18) {
                if (g = s.return,
                g === null)
                    throw Error(l(341));
                g.lanes |= t,
                o = g.alternate,
                o !== null && (o.lanes |= t),
                ou(g, t, A),
                g = null
            } else
                g = s.child;
            if (g !== null)
                g.return = s;
            else
                for (g = s; g !== null; ) {
                    if (g === A) {
                        g = null;
                        break
                    }
                    if (s = g.sibling,
                    s !== null) {
                        s.return = g.return,
                        g = s;
                        break
                    }
                    g = g.return
                }
            s = g
        }
    }
    function Ar(A, e, t, r) {
        A = null;
        for (var s = e, o = !1; s !== null; ) {
            if (!o) {
                if ((s.flags & 524288) !== 0)
                    o = !0;
                else if ((s.flags & 262144) !== 0)
                    break
            }
            if (s.tag === 10) {
                var g = s.alternate;
                if (g === null)
                    throw Error(l(387));
                if (g = g.memoizedProps,
                g !== null) {
                    var w = s.type;
                    Se(s.pendingProps.value, g.value) || (A !== null ? A.push(w) : A = [w])
                }
            } else if (s === WA.current) {
                if (g = s.alternate,
                g === null)
                    throw Error(l(387));
                g.memoizedState.memoizedState !== s.memoizedState.memoizedState && (A !== null ? A.push(xr) : A = [xr])
            }
            s = s.return
        }
        A !== null && cu(e, A, t, r),
        e.flags |= 262144
    }
    function xl(A) {
        for (A = A.firstContext; A !== null; ) {
            if (!Se(A.context._currentValue, A.memoizedValue))
                return !0;
            A = A.next
        }
        return !1
    }
    function ma(A) {
        pa = A,
        Qt = null,
        A = A.dependencies,
        A !== null && (A.firstContext = null)
    }
    function fe(A) {
        return iB(pa, A)
    }
    function Sl(A, e) {
        return pa === null && ma(A),
        iB(A, e)
    }
    function iB(A, e) {
        var t = e._currentValue;
        if (e = {
            context: e,
            memoizedValue: t,
            next: null
        },
        Qt === null) {
            if (A === null)
                throw Error(l(308));
            Qt = e,
            A.dependencies = {
                lanes: 0,
                firstContext: e
            },
            A.flags |= 524288
        } else
            Qt = Qt.next = e;
        return t
    }
    var Gw = typeof AbortController < "u" ? AbortController : function() {
        var A = []
          , e = this.signal = {
            aborted: !1,
            addEventListener: function(t, r) {
                A.push(r)
            }
        };
        this.abort = function() {
            e.aborted = !0,
            A.forEach(function(t) {
                return t()
            })
        }
    }
      , Vw = a.unstable_scheduleCallback
      , Xw = a.unstable_NormalPriority
      , PA = {
        $$typeof: R,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0
    };
    function fu() {
        return {
            controller: new Gw,
            data: new Map,
            refCount: 0
        }
    }
    function er(A) {
        A.refCount--,
        A.refCount === 0 && Vw(Xw, function() {
            A.controller.abort()
        })
    }
    var tr = null
      , Bu = 0
      , tn = 0
      , an = null;
    function Yw(A, e) {
        if (tr === null) {
            var t = tr = [];
            Bu = 0,
            tn = ho(),
            an = {
                status: "pending",
                value: void 0,
                then: function(r) {
                    t.push(r)
                }
            }
        }
        return Bu++,
        e.then(sB, sB),
        e
    }
    function sB() {
        if (--Bu === 0 && tr !== null) {
            an !== null && (an.status = "fulfilled");
            var A = tr;
            tr = null,
            tn = 0,
            an = null;
            for (var e = 0; e < A.length; e++)
                (0,
                A[e])()
        }
    }
    function zw(A, e) {
        var t = []
          , r = {
            status: "pending",
            value: null,
            reason: null,
            then: function(s) {
                t.push(s)
            }
        };
        return A.then(function() {
            r.status = "fulfilled",
            r.value = e;
            for (var s = 0; s < t.length; s++)
                (0,
                t[s])(e)
        }, function(s) {
            for (r.status = "rejected",
            r.reason = s,
            s = 0; s < t.length; s++)
                (0,
                t[s])(void 0)
        }),
        r
    }
    var uB = K.S;
    K.S = function(A, e) {
        typeof e == "object" && e !== null && typeof e.then == "function" && Yw(A, e),
        uB !== null && uB(A, e)
    }
    ;
    var Fa = F(null);
    function gu() {
        var A = Fa.current;
        return A !== null ? A : KA.pooledCache
    }
    function Tl(A, e) {
        e === null ? Z(Fa, Fa.current) : Z(Fa, e.pool)
    }
    function oB() {
        var A = gu();
        return A === null ? null : {
            parent: PA._currentValue,
            pool: A
        }
    }
    var ar = Error(l(460))
      , cB = Error(l(474))
      , Dl = Error(l(542))
      , du = {
        then: function() {}
    };
    function fB(A) {
        return A = A.status,
        A === "fulfilled" || A === "rejected"
    }
    function Ll() {}
    function BB(A, e, t) {
        switch (t = A[t],
        t === void 0 ? A.push(e) : t !== e && (e.then(Ll, Ll),
        e = t),
        e.status) {
        case "fulfilled":
            return e.value;
        case "rejected":
            throw A = e.reason,
            dB(A),
            A;
        default:
            if (typeof e.status == "string")
                e.then(Ll, Ll);
            else {
                if (A = KA,
                A !== null && 100 < A.shellSuspendCounter)
                    throw Error(l(482));
                A = e,
                A.status = "pending",
                A.then(function(r) {
                    if (e.status === "pending") {
                        var s = e;
                        s.status = "fulfilled",
                        s.value = r
                    }
                }, function(r) {
                    if (e.status === "pending") {
                        var s = e;
                        s.status = "rejected",
                        s.reason = r
                    }
                })
            }
            switch (e.status) {
            case "fulfilled":
                return e.value;
            case "rejected":
                throw A = e.reason,
                dB(A),
                A
            }
            throw nr = e,
            ar
        }
    }
    var nr = null;
    function gB() {
        if (nr === null)
            throw Error(l(459));
        var A = nr;
        return nr = null,
        A
    }
    function dB(A) {
        if (A === ar || A === Dl)
            throw Error(l(483))
    }
    var Mt = !1;
    function hu(A) {
        A.updateQueue = {
            baseState: A.memoizedState,
            firstBaseUpdate: null,
            lastBaseUpdate: null,
            shared: {
                pending: null,
                lanes: 0,
                hiddenCallbacks: null
            },
            callbacks: null
        }
    }
    function Qu(A, e) {
        A = A.updateQueue,
        e.updateQueue === A && (e.updateQueue = {
            baseState: A.baseState,
            firstBaseUpdate: A.firstBaseUpdate,
            lastBaseUpdate: A.lastBaseUpdate,
            shared: A.shared,
            callbacks: null
        })
    }
    function Nt(A) {
        return {
            lane: A,
            tag: 0,
            payload: null,
            callback: null,
            next: null
        }
    }
    function Rt(A, e, t) {
        var r = A.updateQueue;
        if (r === null)
            return null;
        if (r = r.shared,
        (bA & 2) !== 0) {
            var s = r.pending;
            return s === null ? e.next = e : (e.next = s.next,
            s.next = e),
            r.pending = e,
            e = Fl(A),
            eB(A, null, t),
            e
        }
        return ml(A, r, e, t),
        Fl(A)
    }
    function rr(A, e, t) {
        if (e = e.updateQueue,
        e !== null && (e = e.shared,
        (t & 4194048) !== 0)) {
            var r = e.lanes;
            r &= A.pendingLanes,
            t |= r,
            e.lanes = t,
            sf(A, t)
        }
    }
    function wu(A, e) {
        var t = A.updateQueue
          , r = A.alternate;
        if (r !== null && (r = r.updateQueue,
        t === r)) {
            var s = null
              , o = null;
            if (t = t.firstBaseUpdate,
            t !== null) {
                do {
                    var g = {
                        lane: t.lane,
                        tag: t.tag,
                        payload: t.payload,
                        callback: null,
                        next: null
                    };
                    o === null ? s = o = g : o = o.next = g,
                    t = t.next
                } while (t !== null);
                o === null ? s = o = e : o = o.next = e
            } else
                s = o = e;
            t = {
                baseState: r.baseState,
                firstBaseUpdate: s,
                lastBaseUpdate: o,
                shared: r.shared,
                callbacks: r.callbacks
            },
            A.updateQueue = t;
            return
        }
        A = t.lastBaseUpdate,
        A === null ? t.firstBaseUpdate = e : A.next = e,
        t.lastBaseUpdate = e
    }
    var Cu = !1;
    function lr() {
        if (Cu) {
            var A = an;
            if (A !== null)
                throw A
        }
    }
    function ir(A, e, t, r) {
        Cu = !1;
        var s = A.updateQueue;
        Mt = !1;
        var o = s.firstBaseUpdate
          , g = s.lastBaseUpdate
          , w = s.shared.pending;
        if (w !== null) {
            s.shared.pending = null;
            var y = w
              , H = y.next;
            y.next = null,
            g === null ? o = H : g.next = H,
            g = y;
            var M = A.alternate;
            M !== null && (M = M.updateQueue,
            w = M.lastBaseUpdate,
            w !== g && (w === null ? M.firstBaseUpdate = H : w.next = H,
            M.lastBaseUpdate = y))
        }
        if (o !== null) {
            var G = s.baseState;
            g = 0,
            M = H = y = null,
            w = o;
            do {
                var S = w.lane & -536870913
                  , T = S !== w.lane;
                if (T ? (vA & S) === S : (r & S) === S) {
                    S !== 0 && S === tn && (Cu = !0),
                    M !== null && (M = M.next = {
                        lane: 0,
                        tag: w.tag,
                        payload: w.payload,
                        callback: null,
                        next: null
                    });
                    A: {
                        var sA = A
                          , lA = w;
                        S = e;
                        var TA = t;
                        switch (lA.tag) {
                        case 1:
                            if (sA = lA.payload,
                            typeof sA == "function") {
                                G = sA.call(TA, G, S);
                                break A
                            }
                            G = sA;
                            break A;
                        case 3:
                            sA.flags = sA.flags & -65537 | 128;
                        case 0:
                            if (sA = lA.payload,
                            S = typeof sA == "function" ? sA.call(TA, G, S) : sA,
                            S == null)
                                break A;
                            G = Q({}, G, S);
                            break A;
                        case 2:
                            Mt = !0
                        }
                    }
                    S = w.callback,
                    S !== null && (A.flags |= 64,
                    T && (A.flags |= 8192),
                    T = s.callbacks,
                    T === null ? s.callbacks = [S] : T.push(S))
                } else
                    T = {
                        lane: S,
                        tag: w.tag,
                        payload: w.payload,
                        callback: w.callback,
                        next: null
                    },
                    M === null ? (H = M = T,
                    y = G) : M = M.next = T,
                    g |= S;
                if (w = w.next,
                w === null) {
                    if (w = s.shared.pending,
                    w === null)
                        break;
                    T = w,
                    w = T.next,
                    T.next = null,
                    s.lastBaseUpdate = T,
                    s.shared.pending = null
                }
            } while (!0);
            M === null && (y = G),
            s.baseState = y,
            s.firstBaseUpdate = H,
            s.lastBaseUpdate = M,
            o === null && (s.shared.lanes = 0),
            kt |= g,
            A.lanes = g,
            A.memoizedState = G
        }
    }
    function hB(A, e) {
        if (typeof A != "function")
            throw Error(l(191, A));
        A.call(e)
    }
    function QB(A, e) {
        var t = A.callbacks;
        if (t !== null)
            for (A.callbacks = null,
            A = 0; A < t.length; A++)
                hB(t[A], e)
    }
    var nn = F(null)
      , Il = F(0);
    function wB(A, e) {
        A = Ft,
        Z(Il, A),
        Z(nn, e),
        Ft = A | e.baseLanes
    }
    function Uu() {
        Z(Il, Ft),
        Z(nn, nn.current)
    }
    function vu() {
        Ft = Il.current,
        J(nn),
        J(Il)
    }
    var Gt = 0
      , dA = null
      , xA = null
      , kA = null
      , Kl = !1
      , rn = !1
      , Ea = !1
      , _l = 0
      , sr = 0
      , ln = null
      , jw = 0;
    function YA() {
        throw Error(l(321))
    }
    function yu(A, e) {
        if (e === null)
            return !1;
        for (var t = 0; t < e.length && t < A.length; t++)
            if (!Se(A[t], e[t]))
                return !1;
        return !0
    }
    function pu(A, e, t, r, s, o) {
        return Gt = o,
        dA = e,
        e.memoizedState = null,
        e.updateQueue = null,
        e.lanes = 0,
        K.H = A === null || A.memoizedState === null ? eg : tg,
        Ea = !1,
        o = t(r, s),
        Ea = !1,
        rn && (o = UB(e, t, r, s)),
        CB(A),
        o
    }
    function CB(A) {
        K.H = Vl;
        var e = xA !== null && xA.next !== null;
        if (Gt = 0,
        kA = xA = dA = null,
        Kl = !1,
        sr = 0,
        ln = null,
        e)
            throw Error(l(300));
        A === null || te || (A = A.dependencies,
        A !== null && xl(A) && (te = !0))
    }
    function UB(A, e, t, r) {
        dA = A;
        var s = 0;
        do {
            if (rn && (ln = null),
            sr = 0,
            rn = !1,
            25 <= s)
                throw Error(l(301));
            if (s += 1,
            kA = xA = null,
            A.updateQueue != null) {
                var o = A.updateQueue;
                o.lastEffect = null,
                o.events = null,
                o.stores = null,
                o.memoCache != null && (o.memoCache.index = 0)
            }
            K.H = $w,
            o = e(t, r)
        } while (rn);
        return o
    }
    function Jw() {
        var A = K.H
          , e = A.useState()[0];
        return e = typeof e.then == "function" ? ur(e) : e,
        A = A.useState()[0],
        (xA !== null ? xA.memoizedState : null) !== A && (dA.flags |= 1024),
        e
    }
    function mu() {
        var A = _l !== 0;
        return _l = 0,
        A
    }
    function Fu(A, e, t) {
        e.updateQueue = A.updateQueue,
        e.flags &= -2053,
        A.lanes &= ~t
    }
    function Eu(A) {
        if (Kl) {
            for (A = A.memoizedState; A !== null; ) {
                var e = A.queue;
                e !== null && (e.pending = null),
                A = A.next
            }
            Kl = !1
        }
        Gt = 0,
        kA = xA = dA = null,
        rn = !1,
        sr = _l = 0,
        ln = null
    }
    function me() {
        var A = {
            memoizedState: null,
            baseState: null,
            baseQueue: null,
            queue: null,
            next: null
        };
        return kA === null ? dA.memoizedState = kA = A : kA = kA.next = A,
        kA
    }
    function ZA() {
        if (xA === null) {
            var A = dA.alternate;
            A = A !== null ? A.memoizedState : null
        } else
            A = xA.next;
        var e = kA === null ? dA.memoizedState : kA.next;
        if (e !== null)
            kA = e,
            xA = A;
        else {
            if (A === null)
                throw dA.alternate === null ? Error(l(467)) : Error(l(310));
            xA = A,
            A = {
                memoizedState: xA.memoizedState,
                baseState: xA.baseState,
                baseQueue: xA.baseQueue,
                queue: xA.queue,
                next: null
            },
            kA === null ? dA.memoizedState = kA = A : kA = kA.next = A
        }
        return kA
    }
    function bu() {
        return {
            lastEffect: null,
            events: null,
            stores: null,
            memoCache: null
        }
    }
    function ur(A) {
        var e = sr;
        return sr += 1,
        ln === null && (ln = []),
        A = BB(ln, A, e),
        e = dA,
        (kA === null ? e.memoizedState : kA.next) === null && (e = e.alternate,
        K.H = e === null || e.memoizedState === null ? eg : tg),
        A
    }
    function Ol(A) {
        if (A !== null && typeof A == "object") {
            if (typeof A.then == "function")
                return ur(A);
            if (A.$$typeof === R)
                return fe(A)
        }
        throw Error(l(438, String(A)))
    }
    function Hu(A) {
        var e = null
          , t = dA.updateQueue;
        if (t !== null && (e = t.memoCache),
        e == null) {
            var r = dA.alternate;
            r !== null && (r = r.updateQueue,
            r !== null && (r = r.memoCache,
            r != null && (e = {
                data: r.data.map(function(s) {
                    return s.slice()
                }),
                index: 0
            })))
        }
        if (e == null && (e = {
            data: [],
            index: 0
        }),
        t === null && (t = bu(),
        dA.updateQueue = t),
        t.memoCache = e,
        t = e.data[e.index],
        t === void 0)
            for (t = e.data[e.index] = Array(A),
            r = 0; r < A; r++)
                t[r] = nA;
        return e.index++,
        t
    }
    function Ct(A, e) {
        return typeof e == "function" ? e(A) : e
    }
    function Ml(A) {
        var e = ZA();
        return xu(e, xA, A)
    }
    function xu(A, e, t) {
        var r = A.queue;
        if (r === null)
            throw Error(l(311));
        r.lastRenderedReducer = t;
        var s = A.baseQueue
          , o = r.pending;
        if (o !== null) {
            if (s !== null) {
                var g = s.next;
                s.next = o.next,
                o.next = g
            }
            e.baseQueue = s = o,
            r.pending = null
        }
        if (o = A.baseState,
        s === null)
            A.memoizedState = o;
        else {
            e = s.next;
            var w = g = null
              , y = null
              , H = e
              , M = !1;
            do {
                var G = H.lane & -536870913;
                if (G !== H.lane ? (vA & G) === G : (Gt & G) === G) {
                    var S = H.revertLane;
                    if (S === 0)
                        y !== null && (y = y.next = {
                            lane: 0,
                            revertLane: 0,
                            action: H.action,
                            hasEagerState: H.hasEagerState,
                            eagerState: H.eagerState,
                            next: null
                        }),
                        G === tn && (M = !0);
                    else if ((Gt & S) === S) {
                        H = H.next,
                        S === tn && (M = !0);
                        continue
                    } else
                        G = {
                            lane: 0,
                            revertLane: H.revertLane,
                            action: H.action,
                            hasEagerState: H.hasEagerState,
                            eagerState: H.eagerState,
                            next: null
                        },
                        y === null ? (w = y = G,
                        g = o) : y = y.next = G,
                        dA.lanes |= S,
                        kt |= S;
                    G = H.action,
                    Ea && t(o, G),
                    o = H.hasEagerState ? H.eagerState : t(o, G)
                } else
                    S = {
                        lane: G,
                        revertLane: H.revertLane,
                        action: H.action,
                        hasEagerState: H.hasEagerState,
                        eagerState: H.eagerState,
                        next: null
                    },
                    y === null ? (w = y = S,
                    g = o) : y = y.next = S,
                    dA.lanes |= G,
                    kt |= G;
                H = H.next
            } while (H !== null && H !== e);
            if (y === null ? g = o : y.next = w,
            !Se(o, A.memoizedState) && (te = !0,
            M && (t = an,
            t !== null)))
                throw t;
            A.memoizedState = o,
            A.baseState = g,
            A.baseQueue = y,
            r.lastRenderedState = o
        }
        return s === null && (r.lanes = 0),
        [A.memoizedState, r.dispatch]
    }
    function Su(A) {
        var e = ZA()
          , t = e.queue;
        if (t === null)
            throw Error(l(311));
        t.lastRenderedReducer = A;
        var r = t.dispatch
          , s = t.pending
          , o = e.memoizedState;
        if (s !== null) {
            t.pending = null;
            var g = s = s.next;
            do
                o = A(o, g.action),
                g = g.next;
            while (g !== s);
            Se(o, e.memoizedState) || (te = !0),
            e.memoizedState = o,
            e.baseQueue === null && (e.baseState = o),
            t.lastRenderedState = o
        }
        return [o, r]
    }
    function vB(A, e, t) {
        var r = dA
          , s = ZA()
          , o = pA;
        if (o) {
            if (t === void 0)
                throw Error(l(407));
            t = t()
        } else
            t = e();
        var g = !Se((xA || s).memoizedState, t);
        g && (s.memoizedState = t,
        te = !0),
        s = s.queue;
        var w = mB.bind(null, r, s, A);
        if (or(2048, 8, w, [A]),
        s.getSnapshot !== e || g || kA !== null && kA.memoizedState.tag & 1) {
            if (r.flags |= 2048,
            sn(9, Nl(), pB.bind(null, r, s, t, e), null),
            KA === null)
                throw Error(l(349));
            o || (Gt & 124) !== 0 || yB(r, e, t)
        }
        return t
    }
    function yB(A, e, t) {
        A.flags |= 16384,
        A = {
            getSnapshot: e,
            value: t
        },
        e = dA.updateQueue,
        e === null ? (e = bu(),
        dA.updateQueue = e,
        e.stores = [A]) : (t = e.stores,
        t === null ? e.stores = [A] : t.push(A))
    }
    function pB(A, e, t, r) {
        e.value = t,
        e.getSnapshot = r,
        FB(e) && EB(A)
    }
    function mB(A, e, t) {
        return t(function() {
            FB(e) && EB(A)
        })
    }
    function FB(A) {
        var e = A.getSnapshot;
        A = A.value;
        try {
            var t = e();
            return !Se(A, t)
        } catch {
            return !0
        }
    }
    function EB(A) {
        var e = Pa(A, 2);
        e !== null && _e(e, A, 2)
    }
    function Tu(A) {
        var e = me();
        if (typeof A == "function") {
            var t = A;
            if (A = t(),
            Ea) {
                It(!0);
                try {
                    t()
                } finally {
                    It(!1)
                }
            }
        }
        return e.memoizedState = e.baseState = A,
        e.queue = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Ct,
            lastRenderedState: A
        },
        e
    }
    function bB(A, e, t, r) {
        return A.baseState = t,
        xu(A, xA, typeof r == "function" ? r : Ct)
    }
    function kw(A, e, t, r, s) {
        if (Gl(A))
            throw Error(l(485));
        if (A = e.action,
        A !== null) {
            var o = {
                payload: s,
                action: A,
                next: null,
                isTransition: !0,
                status: "pending",
                value: null,
                reason: null,
                listeners: [],
                then: function(g) {
                    o.listeners.push(g)
                }
            };
            K.T !== null ? t(!0) : o.isTransition = !1,
            r(o),
            t = e.pending,
            t === null ? (o.next = e.pending = o,
            HB(e, o)) : (o.next = t.next,
            e.pending = t.next = o)
        }
    }
    function HB(A, e) {
        var t = e.action
          , r = e.payload
          , s = A.state;
        if (e.isTransition) {
            var o = K.T
              , g = {};
            K.T = g;
            try {
                var w = t(s, r)
                  , y = K.S;
                y !== null && y(g, w),
                xB(A, e, w)
            } catch (H) {
                Du(A, e, H)
            } finally {
                K.T = o
            }
        } else
            try {
                o = t(s, r),
                xB(A, e, o)
            } catch (H) {
                Du(A, e, H)
            }
    }
    function xB(A, e, t) {
        t !== null && typeof t == "object" && typeof t.then == "function" ? t.then(function(r) {
            SB(A, e, r)
        }, function(r) {
            return Du(A, e, r)
        }) : SB(A, e, t)
    }
    function SB(A, e, t) {
        e.status = "fulfilled",
        e.value = t,
        TB(e),
        A.state = t,
        e = A.pending,
        e !== null && (t = e.next,
        t === e ? A.pending = null : (t = t.next,
        e.next = t,
        HB(A, t)))
    }
    function Du(A, e, t) {
        var r = A.pending;
        if (A.pending = null,
        r !== null) {
            r = r.next;
            do
                e.status = "rejected",
                e.reason = t,
                TB(e),
                e = e.next;
            while (e !== r)
        }
        A.action = null
    }
    function TB(A) {
        A = A.listeners;
        for (var e = 0; e < A.length; e++)
            (0,
            A[e])()
    }
    function DB(A, e) {
        return e
    }
    function LB(A, e) {
        if (pA) {
            var t = KA.formState;
            if (t !== null) {
                A: {
                    var r = dA;
                    if (pA) {
                        if (VA) {
                            e: {
                                for (var s = VA, o = nt; s.nodeType !== 8; ) {
                                    if (!o) {
                                        s = null;
                                        break e
                                    }
                                    if (s = $e(s.nextSibling),
                                    s === null) {
                                        s = null;
                                        break e
                                    }
                                }
                                o = s.data,
                                s = o === "F!" || o === "F" ? s : null
                            }
                            if (s) {
                                VA = $e(s.nextSibling),
                                r = s.data === "F!";
                                break A
                            }
                        }
                        ya(r)
                    }
                    r = !1
                }
                r && (e = t[0])
            }
        }
        return t = me(),
        t.memoizedState = t.baseState = e,
        r = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: DB,
            lastRenderedState: e
        },
        t.queue = r,
        t = PB.bind(null, dA, r),
        r.dispatch = t,
        r = Tu(!1),
        o = Ou.bind(null, dA, !1, r.queue),
        r = me(),
        s = {
            state: e,
            dispatch: null,
            action: A,
            pending: null
        },
        r.queue = s,
        t = kw.bind(null, dA, s, o, t),
        s.dispatch = t,
        r.memoizedState = A,
        [e, t, !1]
    }
    function IB(A) {
        var e = ZA();
        return KB(e, xA, A)
    }
    function KB(A, e, t) {
        if (e = xu(A, e, DB)[0],
        A = Ml(Ct)[0],
        typeof e == "object" && e !== null && typeof e.then == "function")
            try {
                var r = ur(e)
            } catch (g) {
                throw g === ar ? Dl : g
            }
        else
            r = e;
        e = ZA();
        var s = e.queue
          , o = s.dispatch;
        return t !== e.memoizedState && (dA.flags |= 2048,
        sn(9, Nl(), Zw.bind(null, s, t), null)),
        [r, o, A]
    }
    function Zw(A, e) {
        A.action = e
    }
    function _B(A) {
        var e = ZA()
          , t = xA;
        if (t !== null)
            return KB(e, t, A);
        ZA(),
        e = e.memoizedState,
        t = ZA();
        var r = t.queue.dispatch;
        return t.memoizedState = A,
        [e, r, !1]
    }
    function sn(A, e, t, r) {
        return A = {
            tag: A,
            create: t,
            deps: r,
            inst: e,
            next: null
        },
        e = dA.updateQueue,
        e === null && (e = bu(),
        dA.updateQueue = e),
        t = e.lastEffect,
        t === null ? e.lastEffect = A.next = A : (r = t.next,
        t.next = A,
        A.next = r,
        e.lastEffect = A),
        A
    }
    function Nl() {
        return {
            destroy: void 0,
            resource: void 0
        }
    }
    function OB() {
        return ZA().memoizedState
    }
    function Rl(A, e, t, r) {
        var s = me();
        r = r === void 0 ? null : r,
        dA.flags |= A,
        s.memoizedState = sn(1 | e, Nl(), t, r)
    }
    function or(A, e, t, r) {
        var s = ZA();
        r = r === void 0 ? null : r;
        var o = s.memoizedState.inst;
        xA !== null && r !== null && yu(r, xA.memoizedState.deps) ? s.memoizedState = sn(e, o, t, r) : (dA.flags |= A,
        s.memoizedState = sn(1 | e, o, t, r))
    }
    function MB(A, e) {
        Rl(8390656, 8, A, e)
    }
    function NB(A, e) {
        or(2048, 8, A, e)
    }
    function RB(A, e) {
        return or(4, 2, A, e)
    }
    function GB(A, e) {
        return or(4, 4, A, e)
    }
    function VB(A, e) {
        if (typeof e == "function") {
            A = A();
            var t = e(A);
            return function() {
                typeof t == "function" ? t() : e(null)
            }
        }
        if (e != null)
            return A = A(),
            e.current = A,
            function() {
                e.current = null
            }
    }
    function XB(A, e, t) {
        t = t != null ? t.concat([A]) : null,
        or(4, 4, VB.bind(null, e, A), t)
    }
    function Lu() {}
    function YB(A, e) {
        var t = ZA();
        e = e === void 0 ? null : e;
        var r = t.memoizedState;
        return e !== null && yu(e, r[1]) ? r[0] : (t.memoizedState = [A, e],
        A)
    }
    function zB(A, e) {
        var t = ZA();
        e = e === void 0 ? null : e;
        var r = t.memoizedState;
        if (e !== null && yu(e, r[1]))
            return r[0];
        if (r = A(),
        Ea) {
            It(!0);
            try {
                A()
            } finally {
                It(!1)
            }
        }
        return t.memoizedState = [r, e],
        r
    }
    function Iu(A, e, t) {
        return t === void 0 || (Gt & 1073741824) !== 0 ? A.memoizedState = e : (A.memoizedState = t,
        A = kg(),
        dA.lanes |= A,
        kt |= A,
        t)
    }
    function jB(A, e, t, r) {
        return Se(t, e) ? t : nn.current !== null ? (A = Iu(A, t, r),
        Se(A, e) || (te = !0),
        A) : (Gt & 42) === 0 ? (te = !0,
        A.memoizedState = t) : (A = kg(),
        dA.lanes |= A,
        kt |= A,
        e)
    }
    function JB(A, e, t, r, s) {
        var o = j.p;
        j.p = o !== 0 && 8 > o ? o : 8;
        var g = K.T
          , w = {};
        K.T = w,
        Ou(A, !1, e, t);
        try {
            var y = s()
              , H = K.S;
            if (H !== null && H(w, y),
            y !== null && typeof y == "object" && typeof y.then == "function") {
                var M = zw(y, r);
                cr(A, e, M, Ke(A))
            } else
                cr(A, e, r, Ke(A))
        } catch (G) {
            cr(A, e, {
                then: function() {},
                status: "rejected",
                reason: G
            }, Ke())
        } finally {
            j.p = o,
            K.T = g
        }
    }
    function qw() {}
    function Ku(A, e, t, r) {
        if (A.tag !== 5)
            throw Error(l(476));
        var s = kB(A).queue;
        JB(A, s, e, AA, t === null ? qw : function() {
            return ZB(A),
            t(r)
        }
        )
    }
    function kB(A) {
        var e = A.memoizedState;
        if (e !== null)
            return e;
        e = {
            memoizedState: AA,
            baseState: AA,
            baseQueue: null,
            queue: {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: Ct,
                lastRenderedState: AA
            },
            next: null
        };
        var t = {};
        return e.next = {
            memoizedState: t,
            baseState: t,
            baseQueue: null,
            queue: {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: Ct,
                lastRenderedState: t
            },
            next: null
        },
        A.memoizedState = e,
        A = A.alternate,
        A !== null && (A.memoizedState = e),
        e
    }
    function ZB(A) {
        var e = kB(A).next.queue;
        cr(A, e, {}, Ke())
    }
    function _u() {
        return fe(xr)
    }
    function qB() {
        return ZA().memoizedState
    }
    function WB() {
        return ZA().memoizedState
    }
    function Ww(A) {
        for (var e = A.return; e !== null; ) {
            switch (e.tag) {
            case 24:
            case 3:
                var t = Ke();
                A = Nt(t);
                var r = Rt(e, A, t);
                r !== null && (_e(r, e, t),
                rr(r, e, t)),
                e = {
                    cache: fu()
                },
                A.payload = e;
                return
            }
            e = e.return
        }
    }
    function Pw(A, e, t) {
        var r = Ke();
        t = {
            lane: r,
            revertLane: 0,
            action: t,
            hasEagerState: !1,
            eagerState: null,
            next: null
        },
        Gl(A) ? $B(e, t) : (t = tu(A, e, t, r),
        t !== null && (_e(t, A, r),
        Ag(t, e, r)))
    }
    function PB(A, e, t) {
        var r = Ke();
        cr(A, e, t, r)
    }
    function cr(A, e, t, r) {
        var s = {
            lane: r,
            revertLane: 0,
            action: t,
            hasEagerState: !1,
            eagerState: null,
            next: null
        };
        if (Gl(A))
            $B(e, s);
        else {
            var o = A.alternate;
            if (A.lanes === 0 && (o === null || o.lanes === 0) && (o = e.lastRenderedReducer,
            o !== null))
                try {
                    var g = e.lastRenderedState
                      , w = o(g, t);
                    if (s.hasEagerState = !0,
                    s.eagerState = w,
                    Se(w, g))
                        return ml(A, e, s, 0),
                        KA === null && pl(),
                        !1
                } catch {} finally {}
            if (t = tu(A, e, s, r),
            t !== null)
                return _e(t, A, r),
                Ag(t, e, r),
                !0
        }
        return !1
    }
    function Ou(A, e, t, r) {
        if (r = {
            lane: 2,
            revertLane: ho(),
            action: r,
            hasEagerState: !1,
            eagerState: null,
            next: null
        },
        Gl(A)) {
            if (e)
                throw Error(l(479))
        } else
            e = tu(A, t, r, 2),
            e !== null && _e(e, A, 2)
    }
    function Gl(A) {
        var e = A.alternate;
        return A === dA || e !== null && e === dA
    }
    function $B(A, e) {
        rn = Kl = !0;
        var t = A.pending;
        t === null ? e.next = e : (e.next = t.next,
        t.next = e),
        A.pending = e
    }
    function Ag(A, e, t) {
        if ((t & 4194048) !== 0) {
            var r = e.lanes;
            r &= A.pendingLanes,
            t |= r,
            e.lanes = t,
            sf(A, t)
        }
    }
    var Vl = {
        readContext: fe,
        use: Ol,
        useCallback: YA,
        useContext: YA,
        useEffect: YA,
        useImperativeHandle: YA,
        useLayoutEffect: YA,
        useInsertionEffect: YA,
        useMemo: YA,
        useReducer: YA,
        useRef: YA,
        useState: YA,
        useDebugValue: YA,
        useDeferredValue: YA,
        useTransition: YA,
        useSyncExternalStore: YA,
        useId: YA,
        useHostTransitionStatus: YA,
        useFormState: YA,
        useActionState: YA,
        useOptimistic: YA,
        useMemoCache: YA,
        useCacheRefresh: YA
    }
      , eg = {
        readContext: fe,
        use: Ol,
        useCallback: function(A, e) {
            return me().memoizedState = [A, e === void 0 ? null : e],
            A
        },
        useContext: fe,
        useEffect: MB,
        useImperativeHandle: function(A, e, t) {
            t = t != null ? t.concat([A]) : null,
            Rl(4194308, 4, VB.bind(null, e, A), t)
        },
        useLayoutEffect: function(A, e) {
            return Rl(4194308, 4, A, e)
        },
        useInsertionEffect: function(A, e) {
            Rl(4, 2, A, e)
        },
        useMemo: function(A, e) {
            var t = me();
            e = e === void 0 ? null : e;
            var r = A();
            if (Ea) {
                It(!0);
                try {
                    A()
                } finally {
                    It(!1)
                }
            }
            return t.memoizedState = [r, e],
            r
        },
        useReducer: function(A, e, t) {
            var r = me();
            if (t !== void 0) {
                var s = t(e);
                if (Ea) {
                    It(!0);
                    try {
                        t(e)
                    } finally {
                        It(!1)
                    }
                }
            } else
                s = e;
            return r.memoizedState = r.baseState = s,
            A = {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: A,
                lastRenderedState: s
            },
            r.queue = A,
            A = A.dispatch = Pw.bind(null, dA, A),
            [r.memoizedState, A]
        },
        useRef: function(A) {
            var e = me();
            return A = {
                current: A
            },
            e.memoizedState = A
        },
        useState: function(A) {
            A = Tu(A);
            var e = A.queue
              , t = PB.bind(null, dA, e);
            return e.dispatch = t,
            [A.memoizedState, t]
        },
        useDebugValue: Lu,
        useDeferredValue: function(A, e) {
            var t = me();
            return Iu(t, A, e)
        },
        useTransition: function() {
            var A = Tu(!1);
            return A = JB.bind(null, dA, A.queue, !0, !1),
            me().memoizedState = A,
            [!1, A]
        },
        useSyncExternalStore: function(A, e, t) {
            var r = dA
              , s = me();
            if (pA) {
                if (t === void 0)
                    throw Error(l(407));
                t = t()
            } else {
                if (t = e(),
                KA === null)
                    throw Error(l(349));
                (vA & 124) !== 0 || yB(r, e, t)
            }
            s.memoizedState = t;
            var o = {
                value: t,
                getSnapshot: e
            };
            return s.queue = o,
            MB(mB.bind(null, r, o, A), [A]),
            r.flags |= 2048,
            sn(9, Nl(), pB.bind(null, r, o, t, e), null),
            t
        },
        useId: function() {
            var A = me()
              , e = KA.identifierPrefix;
            if (pA) {
                var t = ht
                  , r = dt;
                t = (r & ~(1 << 32 - xe(r) - 1)).toString(32) + t,
                e = "«" + e + "R" + t,
                t = _l++,
                0 < t && (e += "H" + t.toString(32)),
                e += "»"
            } else
                t = jw++,
                e = "«" + e + "r" + t.toString(32) + "»";
            return A.memoizedState = e
        },
        useHostTransitionStatus: _u,
        useFormState: LB,
        useActionState: LB,
        useOptimistic: function(A) {
            var e = me();
            e.memoizedState = e.baseState = A;
            var t = {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: null,
                lastRenderedState: null
            };
            return e.queue = t,
            e = Ou.bind(null, dA, !0, t),
            t.dispatch = e,
            [A, e]
        },
        useMemoCache: Hu,
        useCacheRefresh: function() {
            return me().memoizedState = Ww.bind(null, dA)
        }
    }
      , tg = {
        readContext: fe,
        use: Ol,
        useCallback: YB,
        useContext: fe,
        useEffect: NB,
        useImperativeHandle: XB,
        useInsertionEffect: RB,
        useLayoutEffect: GB,
        useMemo: zB,
        useReducer: Ml,
        useRef: OB,
        useState: function() {
            return Ml(Ct)
        },
        useDebugValue: Lu,
        useDeferredValue: function(A, e) {
            var t = ZA();
            return jB(t, xA.memoizedState, A, e)
        },
        useTransition: function() {
            var A = Ml(Ct)[0]
              , e = ZA().memoizedState;
            return [typeof A == "boolean" ? A : ur(A), e]
        },
        useSyncExternalStore: vB,
        useId: qB,
        useHostTransitionStatus: _u,
        useFormState: IB,
        useActionState: IB,
        useOptimistic: function(A, e) {
            var t = ZA();
            return bB(t, xA, A, e)
        },
        useMemoCache: Hu,
        useCacheRefresh: WB
    }
      , $w = {
        readContext: fe,
        use: Ol,
        useCallback: YB,
        useContext: fe,
        useEffect: NB,
        useImperativeHandle: XB,
        useInsertionEffect: RB,
        useLayoutEffect: GB,
        useMemo: zB,
        useReducer: Su,
        useRef: OB,
        useState: function() {
            return Su(Ct)
        },
        useDebugValue: Lu,
        useDeferredValue: function(A, e) {
            var t = ZA();
            return xA === null ? Iu(t, A, e) : jB(t, xA.memoizedState, A, e)
        },
        useTransition: function() {
            var A = Su(Ct)[0]
              , e = ZA().memoizedState;
            return [typeof A == "boolean" ? A : ur(A), e]
        },
        useSyncExternalStore: vB,
        useId: qB,
        useHostTransitionStatus: _u,
        useFormState: _B,
        useActionState: _B,
        useOptimistic: function(A, e) {
            var t = ZA();
            return xA !== null ? bB(t, xA, A, e) : (t.baseState = A,
            [A, t.queue.dispatch])
        },
        useMemoCache: Hu,
        useCacheRefresh: WB
    }
      , un = null
      , fr = 0;
    function Xl(A) {
        var e = fr;
        return fr += 1,
        un === null && (un = []),
        BB(un, A, e)
    }
    function Br(A, e) {
        e = e.props.ref,
        A.ref = e !== void 0 ? e : null
    }
    function Yl(A, e) {
        throw e.$$typeof === C ? Error(l(525)) : (A = Object.prototype.toString.call(e),
        Error(l(31, A === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : A)))
    }
    function ag(A) {
        var e = A._init;
        return e(A._payload)
    }
    function ng(A) {
        function e(E, m) {
            if (A) {
                var b = E.deletions;
                b === null ? (E.deletions = [m],
                E.flags |= 16) : b.push(m)
            }
        }
        function t(E, m) {
            if (!A)
                return null;
            for (; m !== null; )
                e(E, m),
                m = m.sibling;
            return null
        }
        function r(E) {
            for (var m = new Map; E !== null; )
                E.key !== null ? m.set(E.key, E) : m.set(E.index, E),
                E = E.sibling;
            return m
        }
        function s(E, m) {
            return E = gt(E, m),
            E.index = 0,
            E.sibling = null,
            E
        }
        function o(E, m, b) {
            return E.index = b,
            A ? (b = E.alternate,
            b !== null ? (b = b.index,
            b < m ? (E.flags |= 67108866,
            m) : b) : (E.flags |= 67108866,
            m)) : (E.flags |= 1048576,
            m)
        }
        function g(E) {
            return A && E.alternate === null && (E.flags |= 67108866),
            E
        }
        function w(E, m, b, N) {
            return m === null || m.tag !== 6 ? (m = nu(b, E.mode, N),
            m.return = E,
            m) : (m = s(m, b),
            m.return = E,
            m)
        }
        function y(E, m, b, N) {
            var eA = b.type;
            return eA === L ? M(E, m, b.props.children, N, b.key) : m !== null && (m.elementType === eA || typeof eA == "object" && eA !== null && eA.$$typeof === q && ag(eA) === m.type) ? (m = s(m, b.props),
            Br(m, b),
            m.return = E,
            m) : (m = El(b.type, b.key, b.props, null, E.mode, N),
            Br(m, b),
            m.return = E,
            m)
        }
        function H(E, m, b, N) {
            return m === null || m.tag !== 4 || m.stateNode.containerInfo !== b.containerInfo || m.stateNode.implementation !== b.implementation ? (m = ru(b, E.mode, N),
            m.return = E,
            m) : (m = s(m, b.children || []),
            m.return = E,
            m)
        }
        function M(E, m, b, N, eA) {
            return m === null || m.tag !== 7 ? (m = wa(b, E.mode, N, eA),
            m.return = E,
            m) : (m = s(m, b),
            m.return = E,
            m)
        }
        function G(E, m, b) {
            if (typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint")
                return m = nu("" + m, E.mode, b),
                m.return = E,
                m;
            if (typeof m == "object" && m !== null) {
                switch (m.$$typeof) {
                case v:
                    return b = El(m.type, m.key, m.props, null, E.mode, b),
                    Br(b, m),
                    b.return = E,
                    b;
                case D:
                    return m = ru(m, E.mode, b),
                    m.return = E,
                    m;
                case q:
                    var N = m._init;
                    return m = N(m._payload),
                    G(E, m, b)
                }
                if (FA(m) || oA(m))
                    return m = wa(m, E.mode, b, null),
                    m.return = E,
                    m;
                if (typeof m.then == "function")
                    return G(E, Xl(m), b);
                if (m.$$typeof === R)
                    return G(E, Sl(E, m), b);
                Yl(E, m)
            }
            return null
        }
        function S(E, m, b, N) {
            var eA = m !== null ? m.key : null;
            if (typeof b == "string" && b !== "" || typeof b == "number" || typeof b == "bigint")
                return eA !== null ? null : w(E, m, "" + b, N);
            if (typeof b == "object" && b !== null) {
                switch (b.$$typeof) {
                case v:
                    return b.key === eA ? y(E, m, b, N) : null;
                case D:
                    return b.key === eA ? H(E, m, b, N) : null;
                case q:
                    return eA = b._init,
                    b = eA(b._payload),
                    S(E, m, b, N)
                }
                if (FA(b) || oA(b))
                    return eA !== null ? null : M(E, m, b, N, null);
                if (typeof b.then == "function")
                    return S(E, m, Xl(b), N);
                if (b.$$typeof === R)
                    return S(E, m, Sl(E, b), N);
                Yl(E, b)
            }
            return null
        }
        function T(E, m, b, N, eA) {
            if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
                return E = E.get(b) || null,
                w(m, E, "" + N, eA);
            if (typeof N == "object" && N !== null) {
                switch (N.$$typeof) {
                case v:
                    return E = E.get(N.key === null ? b : N.key) || null,
                    y(m, E, N, eA);
                case D:
                    return E = E.get(N.key === null ? b : N.key) || null,
                    H(m, E, N, eA);
                case q:
                    var hA = N._init;
                    return N = hA(N._payload),
                    T(E, m, b, N, eA)
                }
                if (FA(N) || oA(N))
                    return E = E.get(b) || null,
                    M(m, E, N, eA, null);
                if (typeof N.then == "function")
                    return T(E, m, b, Xl(N), eA);
                if (N.$$typeof === R)
                    return T(E, m, b, Sl(m, N), eA);
                Yl(m, N)
            }
            return null
        }
        function sA(E, m, b, N) {
            for (var eA = null, hA = null, aA = m, iA = m = 0, ne = null; aA !== null && iA < b.length; iA++) {
                aA.index > iA ? (ne = aA,
                aA = null) : ne = aA.sibling;
                var yA = S(E, aA, b[iA], N);
                if (yA === null) {
                    aA === null && (aA = ne);
                    break
                }
                A && aA && yA.alternate === null && e(E, aA),
                m = o(yA, m, iA),
                hA === null ? eA = yA : hA.sibling = yA,
                hA = yA,
                aA = ne
            }
            if (iA === b.length)
                return t(E, aA),
                pA && Ua(E, iA),
                eA;
            if (aA === null) {
                for (; iA < b.length; iA++)
                    aA = G(E, b[iA], N),
                    aA !== null && (m = o(aA, m, iA),
                    hA === null ? eA = aA : hA.sibling = aA,
                    hA = aA);
                return pA && Ua(E, iA),
                eA
            }
            for (aA = r(aA); iA < b.length; iA++)
                ne = T(aA, E, iA, b[iA], N),
                ne !== null && (A && ne.alternate !== null && aA.delete(ne.key === null ? iA : ne.key),
                m = o(ne, m, iA),
                hA === null ? eA = ne : hA.sibling = ne,
                hA = ne);
            return A && aA.forEach(function(aa) {
                return e(E, aa)
            }),
            pA && Ua(E, iA),
            eA
        }
        function lA(E, m, b, N) {
            if (b == null)
                throw Error(l(151));
            for (var eA = null, hA = null, aA = m, iA = m = 0, ne = null, yA = b.next(); aA !== null && !yA.done; iA++,
            yA = b.next()) {
                aA.index > iA ? (ne = aA,
                aA = null) : ne = aA.sibling;
                var aa = S(E, aA, yA.value, N);
                if (aa === null) {
                    aA === null && (aA = ne);
                    break
                }
                A && aA && aa.alternate === null && e(E, aA),
                m = o(aa, m, iA),
                hA === null ? eA = aa : hA.sibling = aa,
                hA = aa,
                aA = ne
            }
            if (yA.done)
                return t(E, aA),
                pA && Ua(E, iA),
                eA;
            if (aA === null) {
                for (; !yA.done; iA++,
                yA = b.next())
                    yA = G(E, yA.value, N),
                    yA !== null && (m = o(yA, m, iA),
                    hA === null ? eA = yA : hA.sibling = yA,
                    hA = yA);
                return pA && Ua(E, iA),
                eA
            }
            for (aA = r(aA); !yA.done; iA++,
            yA = b.next())
                yA = T(aA, E, iA, yA.value, N),
                yA !== null && (A && yA.alternate !== null && aA.delete(yA.key === null ? iA : yA.key),
                m = o(yA, m, iA),
                hA === null ? eA = yA : hA.sibling = yA,
                hA = yA);
            return A && aA.forEach(function(AU) {
                return e(E, AU)
            }),
            pA && Ua(E, iA),
            eA
        }
        function TA(E, m, b, N) {
            if (typeof b == "object" && b !== null && b.type === L && b.key === null && (b = b.props.children),
            typeof b == "object" && b !== null) {
                switch (b.$$typeof) {
                case v:
                    A: {
                        for (var eA = b.key; m !== null; ) {
                            if (m.key === eA) {
                                if (eA = b.type,
                                eA === L) {
                                    if (m.tag === 7) {
                                        t(E, m.sibling),
                                        N = s(m, b.props.children),
                                        N.return = E,
                                        E = N;
                                        break A
                                    }
                                } else if (m.elementType === eA || typeof eA == "object" && eA !== null && eA.$$typeof === q && ag(eA) === m.type) {
                                    t(E, m.sibling),
                                    N = s(m, b.props),
                                    Br(N, b),
                                    N.return = E,
                                    E = N;
                                    break A
                                }
                                t(E, m);
                                break
                            } else
                                e(E, m);
                            m = m.sibling
                        }
                        b.type === L ? (N = wa(b.props.children, E.mode, N, b.key),
                        N.return = E,
                        E = N) : (N = El(b.type, b.key, b.props, null, E.mode, N),
                        Br(N, b),
                        N.return = E,
                        E = N)
                    }
                    return g(E);
                case D:
                    A: {
                        for (eA = b.key; m !== null; ) {
                            if (m.key === eA)
                                if (m.tag === 4 && m.stateNode.containerInfo === b.containerInfo && m.stateNode.implementation === b.implementation) {
                                    t(E, m.sibling),
                                    N = s(m, b.children || []),
                                    N.return = E,
                                    E = N;
                                    break A
                                } else {
                                    t(E, m);
                                    break
                                }
                            else
                                e(E, m);
                            m = m.sibling
                        }
                        N = ru(b, E.mode, N),
                        N.return = E,
                        E = N
                    }
                    return g(E);
                case q:
                    return eA = b._init,
                    b = eA(b._payload),
                    TA(E, m, b, N)
                }
                if (FA(b))
                    return sA(E, m, b, N);
                if (oA(b)) {
                    if (eA = oA(b),
                    typeof eA != "function")
                        throw Error(l(150));
                    return b = eA.call(b),
                    lA(E, m, b, N)
                }
                if (typeof b.then == "function")
                    return TA(E, m, Xl(b), N);
                if (b.$$typeof === R)
                    return TA(E, m, Sl(E, b), N);
                Yl(E, b)
            }
            return typeof b == "string" && b !== "" || typeof b == "number" || typeof b == "bigint" ? (b = "" + b,
            m !== null && m.tag === 6 ? (t(E, m.sibling),
            N = s(m, b),
            N.return = E,
            E = N) : (t(E, m),
            N = nu(b, E.mode, N),
            N.return = E,
            E = N),
            g(E)) : t(E, m)
        }
        return function(E, m, b, N) {
            try {
                fr = 0;
                var eA = TA(E, m, b, N);
                return un = null,
                eA
            } catch (aA) {
                if (aA === ar || aA === Dl)
                    throw aA;
                var hA = Te(29, aA, null, E.mode);
                return hA.lanes = N,
                hA.return = E,
                hA
            } finally {}
        }
    }
    var on = ng(!0)
      , rg = ng(!1)
      , Ye = F(null)
      , rt = null;
    function Vt(A) {
        var e = A.alternate;
        Z($A, $A.current & 1),
        Z(Ye, A),
        rt === null && (e === null || nn.current !== null || e.memoizedState !== null) && (rt = A)
    }
    function lg(A) {
        if (A.tag === 22) {
            if (Z($A, $A.current),
            Z(Ye, A),
            rt === null) {
                var e = A.alternate;
                e !== null && e.memoizedState !== null && (rt = A)
            }
        } else
            Xt()
    }
    function Xt() {
        Z($A, $A.current),
        Z(Ye, Ye.current)
    }
    function Ut(A) {
        J(Ye),
        rt === A && (rt = null),
        J($A)
    }
    var $A = F(0);
    function zl(A) {
        for (var e = A; e !== null; ) {
            if (e.tag === 13) {
                var t = e.memoizedState;
                if (t !== null && (t = t.dehydrated,
                t === null || t.data === "$?" || Ho(t)))
                    return e
            } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
                if ((e.flags & 128) !== 0)
                    return e
            } else if (e.child !== null) {
                e.child.return = e,
                e = e.child;
                continue
            }
            if (e === A)
                break;
            for (; e.sibling === null; ) {
                if (e.return === null || e.return === A)
                    return null;
                e = e.return
            }
            e.sibling.return = e.return,
            e = e.sibling
        }
        return null
    }
    function Mu(A, e, t, r) {
        e = A.memoizedState,
        t = t(r, e),
        t = t == null ? e : Q({}, e, t),
        A.memoizedState = t,
        A.lanes === 0 && (A.updateQueue.baseState = t)
    }
    var Nu = {
        enqueueSetState: function(A, e, t) {
            A = A._reactInternals;
            var r = Ke()
              , s = Nt(r);
            s.payload = e,
            t != null && (s.callback = t),
            e = Rt(A, s, r),
            e !== null && (_e(e, A, r),
            rr(e, A, r))
        },
        enqueueReplaceState: function(A, e, t) {
            A = A._reactInternals;
            var r = Ke()
              , s = Nt(r);
            s.tag = 1,
            s.payload = e,
            t != null && (s.callback = t),
            e = Rt(A, s, r),
            e !== null && (_e(e, A, r),
            rr(e, A, r))
        },
        enqueueForceUpdate: function(A, e) {
            A = A._reactInternals;
            var t = Ke()
              , r = Nt(t);
            r.tag = 2,
            e != null && (r.callback = e),
            e = Rt(A, r, t),
            e !== null && (_e(e, A, t),
            rr(e, A, t))
        }
    };
    function ig(A, e, t, r, s, o, g) {
        return A = A.stateNode,
        typeof A.shouldComponentUpdate == "function" ? A.shouldComponentUpdate(r, o, g) : e.prototype && e.prototype.isPureReactComponent ? !Zn(t, r) || !Zn(s, o) : !0
    }
    function sg(A, e, t, r) {
        A = e.state,
        typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(t, r),
        typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(t, r),
        e.state !== A && Nu.enqueueReplaceState(e, e.state, null)
    }
    function ba(A, e) {
        var t = e;
        if ("ref"in e) {
            t = {};
            for (var r in e)
                r !== "ref" && (t[r] = e[r])
        }
        if (A = A.defaultProps) {
            t === e && (t = Q({}, t));
            for (var s in A)
                t[s] === void 0 && (t[s] = A[s])
        }
        return t
    }
    var jl = typeof reportError == "function" ? reportError : function(A) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
            var e = new window.ErrorEvent("error",{
                bubbles: !0,
                cancelable: !0,
                message: typeof A == "object" && A !== null && typeof A.message == "string" ? String(A.message) : String(A),
                error: A
            });
            if (!window.dispatchEvent(e))
                return
        } else if (typeof process == "object" && typeof process.emit == "function") {
            process.emit("uncaughtException", A);
            return
        }
        console.error(A)
    }
    ;
    function ug(A) {
        jl(A)
    }
    function og(A) {
        console.error(A)
    }
    function cg(A) {
        jl(A)
    }
    function Jl(A, e) {
        try {
            var t = A.onUncaughtError;
            t(e.value, {
                componentStack: e.stack
            })
        } catch (r) {
            setTimeout(function() {
                throw r
            })
        }
    }
    function fg(A, e, t) {
        try {
            var r = A.onCaughtError;
            r(t.value, {
                componentStack: t.stack,
                errorBoundary: e.tag === 1 ? e.stateNode : null
            })
        } catch (s) {
            setTimeout(function() {
                throw s
            })
        }
    }
    function Ru(A, e, t) {
        return t = Nt(t),
        t.tag = 3,
        t.payload = {
            element: null
        },
        t.callback = function() {
            Jl(A, e)
        }
        ,
        t
    }
    function Bg(A) {
        return A = Nt(A),
        A.tag = 3,
        A
    }
    function gg(A, e, t, r) {
        var s = t.type.getDerivedStateFromError;
        if (typeof s == "function") {
            var o = r.value;
            A.payload = function() {
                return s(o)
            }
            ,
            A.callback = function() {
                fg(e, t, r)
            }
        }
        var g = t.stateNode;
        g !== null && typeof g.componentDidCatch == "function" && (A.callback = function() {
            fg(e, t, r),
            typeof s != "function" && (Zt === null ? Zt = new Set([this]) : Zt.add(this));
            var w = r.stack;
            this.componentDidCatch(r.value, {
                componentStack: w !== null ? w : ""
            })
        }
        )
    }
    function AC(A, e, t, r, s) {
        if (t.flags |= 32768,
        r !== null && typeof r == "object" && typeof r.then == "function") {
            if (e = t.alternate,
            e !== null && Ar(e, t, s, !0),
            t = Ye.current,
            t !== null) {
                switch (t.tag) {
                case 13:
                    return rt === null ? oo() : t.alternate === null && XA === 0 && (XA = 3),
                    t.flags &= -257,
                    t.flags |= 65536,
                    t.lanes = s,
                    r === du ? t.flags |= 16384 : (e = t.updateQueue,
                    e === null ? t.updateQueue = new Set([r]) : e.add(r),
                    fo(A, r, s)),
                    !1;
                case 22:
                    return t.flags |= 65536,
                    r === du ? t.flags |= 16384 : (e = t.updateQueue,
                    e === null ? (e = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([r])
                    },
                    t.updateQueue = e) : (t = e.retryQueue,
                    t === null ? e.retryQueue = new Set([r]) : t.add(r)),
                    fo(A, r, s)),
                    !1
                }
                throw Error(l(435, t.tag))
            }
            return fo(A, r, s),
            oo(),
            !1
        }
        if (pA)
            return e = Ye.current,
            e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256),
            e.flags |= 65536,
            e.lanes = s,
            r !== su && (A = Error(l(422), {
                cause: r
            }),
            $n(Re(A, t)))) : (r !== su && (e = Error(l(423), {
                cause: r
            }),
            $n(Re(e, t))),
            A = A.current.alternate,
            A.flags |= 65536,
            s &= -s,
            A.lanes |= s,
            r = Re(r, t),
            s = Ru(A.stateNode, r, s),
            wu(A, s),
            XA !== 4 && (XA = 2)),
            !1;
        var o = Error(l(520), {
            cause: r
        });
        if (o = Re(o, t),
        Ur === null ? Ur = [o] : Ur.push(o),
        XA !== 4 && (XA = 2),
        e === null)
            return !0;
        r = Re(r, t),
        t = e;
        do {
            switch (t.tag) {
            case 3:
                return t.flags |= 65536,
                A = s & -s,
                t.lanes |= A,
                A = Ru(t.stateNode, r, A),
                wu(t, A),
                !1;
            case 1:
                if (e = t.type,
                o = t.stateNode,
                (t.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (Zt === null || !Zt.has(o))))
                    return t.flags |= 65536,
                    s &= -s,
                    t.lanes |= s,
                    s = Bg(s),
                    gg(s, A, t, r),
                    wu(t, s),
                    !1
            }
            t = t.return
        } while (t !== null);
        return !1
    }
    var dg = Error(l(461))
      , te = !1;
    function le(A, e, t, r) {
        e.child = A === null ? rg(e, null, t, r) : on(e, A.child, t, r)
    }
    function hg(A, e, t, r, s) {
        t = t.render;
        var o = e.ref;
        if ("ref"in r) {
            var g = {};
            for (var w in r)
                w !== "ref" && (g[w] = r[w])
        } else
            g = r;
        return ma(e),
        r = pu(A, e, t, g, o, s),
        w = mu(),
        A !== null && !te ? (Fu(A, e, s),
        vt(A, e, s)) : (pA && w && lu(e),
        e.flags |= 1,
        le(A, e, r, s),
        e.child)
    }
    function Qg(A, e, t, r, s) {
        if (A === null) {
            var o = t.type;
            return typeof o == "function" && !au(o) && o.defaultProps === void 0 && t.compare === null ? (e.tag = 15,
            e.type = o,
            wg(A, e, o, r, s)) : (A = El(t.type, null, r, e, e.mode, s),
            A.ref = e.ref,
            A.return = e,
            e.child = A)
        }
        if (o = A.child,
        !ku(A, s)) {
            var g = o.memoizedProps;
            if (t = t.compare,
            t = t !== null ? t : Zn,
            t(g, r) && A.ref === e.ref)
                return vt(A, e, s)
        }
        return e.flags |= 1,
        A = gt(o, r),
        A.ref = e.ref,
        A.return = e,
        e.child = A
    }
    function wg(A, e, t, r, s) {
        if (A !== null) {
            var o = A.memoizedProps;
            if (Zn(o, r) && A.ref === e.ref)
                if (te = !1,
                e.pendingProps = r = o,
                ku(A, s))
                    (A.flags & 131072) !== 0 && (te = !0);
                else
                    return e.lanes = A.lanes,
                    vt(A, e, s)
        }
        return Gu(A, e, t, r, s)
    }
    function Cg(A, e, t) {
        var r = e.pendingProps
          , s = r.children
          , o = A !== null ? A.memoizedState : null;
        if (r.mode === "hidden") {
            if ((e.flags & 128) !== 0) {
                if (r = o !== null ? o.baseLanes | t : t,
                A !== null) {
                    for (s = e.child = A.child,
                    o = 0; s !== null; )
                        o = o | s.lanes | s.childLanes,
                        s = s.sibling;
                    e.childLanes = o & ~r
                } else
                    e.childLanes = 0,
                    e.child = null;
                return Ug(A, e, r, t)
            }
            if ((t & 536870912) !== 0)
                e.memoizedState = {
                    baseLanes: 0,
                    cachePool: null
                },
                A !== null && Tl(e, o !== null ? o.cachePool : null),
                o !== null ? wB(e, o) : Uu(),
                lg(e);
            else
                return e.lanes = e.childLanes = 536870912,
                Ug(A, e, o !== null ? o.baseLanes | t : t, t)
        } else
            o !== null ? (Tl(e, o.cachePool),
            wB(e, o),
            Xt(),
            e.memoizedState = null) : (A !== null && Tl(e, null),
            Uu(),
            Xt());
        return le(A, e, s, t),
        e.child
    }
    function Ug(A, e, t, r) {
        var s = gu();
        return s = s === null ? null : {
            parent: PA._currentValue,
            pool: s
        },
        e.memoizedState = {
            baseLanes: t,
            cachePool: s
        },
        A !== null && Tl(e, null),
        Uu(),
        lg(e),
        A !== null && Ar(A, e, r, !0),
        null
    }
    function kl(A, e) {
        var t = e.ref;
        if (t === null)
            A !== null && A.ref !== null && (e.flags |= 4194816);
        else {
            if (typeof t != "function" && typeof t != "object")
                throw Error(l(284));
            (A === null || A.ref !== t) && (e.flags |= 4194816)
        }
    }
    function Gu(A, e, t, r, s) {
        return ma(e),
        t = pu(A, e, t, r, void 0, s),
        r = mu(),
        A !== null && !te ? (Fu(A, e, s),
        vt(A, e, s)) : (pA && r && lu(e),
        e.flags |= 1,
        le(A, e, t, s),
        e.child)
    }
    function vg(A, e, t, r, s, o) {
        return ma(e),
        e.updateQueue = null,
        t = UB(e, r, t, s),
        CB(A),
        r = mu(),
        A !== null && !te ? (Fu(A, e, o),
        vt(A, e, o)) : (pA && r && lu(e),
        e.flags |= 1,
        le(A, e, t, o),
        e.child)
    }
    function yg(A, e, t, r, s) {
        if (ma(e),
        e.stateNode === null) {
            var o = $a
              , g = t.contextType;
            typeof g == "object" && g !== null && (o = fe(g)),
            o = new t(r,o),
            e.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null,
            o.updater = Nu,
            e.stateNode = o,
            o._reactInternals = e,
            o = e.stateNode,
            o.props = r,
            o.state = e.memoizedState,
            o.refs = {},
            hu(e),
            g = t.contextType,
            o.context = typeof g == "object" && g !== null ? fe(g) : $a,
            o.state = e.memoizedState,
            g = t.getDerivedStateFromProps,
            typeof g == "function" && (Mu(e, t, g, r),
            o.state = e.memoizedState),
            typeof t.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (g = o.state,
            typeof o.componentWillMount == "function" && o.componentWillMount(),
            typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(),
            g !== o.state && Nu.enqueueReplaceState(o, o.state, null),
            ir(e, r, o, s),
            lr(),
            o.state = e.memoizedState),
            typeof o.componentDidMount == "function" && (e.flags |= 4194308),
            r = !0
        } else if (A === null) {
            o = e.stateNode;
            var w = e.memoizedProps
              , y = ba(t, w);
            o.props = y;
            var H = o.context
              , M = t.contextType;
            g = $a,
            typeof M == "object" && M !== null && (g = fe(M));
            var G = t.getDerivedStateFromProps;
            M = typeof G == "function" || typeof o.getSnapshotBeforeUpdate == "function",
            w = e.pendingProps !== w,
            M || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (w || H !== g) && sg(e, o, r, g),
            Mt = !1;
            var S = e.memoizedState;
            o.state = S,
            ir(e, r, o, s),
            lr(),
            H = e.memoizedState,
            w || S !== H || Mt ? (typeof G == "function" && (Mu(e, t, G, r),
            H = e.memoizedState),
            (y = Mt || ig(e, t, y, r, S, H, g)) ? (M || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(),
            typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()),
            typeof o.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (e.flags |= 4194308),
            e.memoizedProps = r,
            e.memoizedState = H),
            o.props = r,
            o.state = H,
            o.context = g,
            r = y) : (typeof o.componentDidMount == "function" && (e.flags |= 4194308),
            r = !1)
        } else {
            o = e.stateNode,
            Qu(A, e),
            g = e.memoizedProps,
            M = ba(t, g),
            o.props = M,
            G = e.pendingProps,
            S = o.context,
            H = t.contextType,
            y = $a,
            typeof H == "object" && H !== null && (y = fe(H)),
            w = t.getDerivedStateFromProps,
            (H = typeof w == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (g !== G || S !== y) && sg(e, o, r, y),
            Mt = !1,
            S = e.memoizedState,
            o.state = S,
            ir(e, r, o, s),
            lr();
            var T = e.memoizedState;
            g !== G || S !== T || Mt || A !== null && A.dependencies !== null && xl(A.dependencies) ? (typeof w == "function" && (Mu(e, t, w, r),
            T = e.memoizedState),
            (M = Mt || ig(e, t, M, r, S, T, y) || A !== null && A.dependencies !== null && xl(A.dependencies)) ? (H || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, T, y),
            typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, T, y)),
            typeof o.componentDidUpdate == "function" && (e.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || g === A.memoizedProps && S === A.memoizedState || (e.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != "function" || g === A.memoizedProps && S === A.memoizedState || (e.flags |= 1024),
            e.memoizedProps = r,
            e.memoizedState = T),
            o.props = r,
            o.state = T,
            o.context = y,
            r = M) : (typeof o.componentDidUpdate != "function" || g === A.memoizedProps && S === A.memoizedState || (e.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != "function" || g === A.memoizedProps && S === A.memoizedState || (e.flags |= 1024),
            r = !1)
        }
        return o = r,
        kl(A, e),
        r = (e.flags & 128) !== 0,
        o || r ? (o = e.stateNode,
        t = r && typeof t.getDerivedStateFromError != "function" ? null : o.render(),
        e.flags |= 1,
        A !== null && r ? (e.child = on(e, A.child, null, s),
        e.child = on(e, null, t, s)) : le(A, e, t, s),
        e.memoizedState = o.state,
        A = e.child) : A = vt(A, e, s),
        A
    }
    function pg(A, e, t, r) {
        return Pn(),
        e.flags |= 256,
        le(A, e, t, r),
        e.child
    }
    var Vu = {
        dehydrated: null,
        treeContext: null,
        retryLane: 0,
        hydrationErrors: null
    };
    function Xu(A) {
        return {
            baseLanes: A,
            cachePool: oB()
        }
    }
    function Yu(A, e, t) {
        return A = A !== null ? A.childLanes & ~t : 0,
        e && (A |= ze),
        A
    }
    function mg(A, e, t) {
        var r = e.pendingProps, s = !1, o = (e.flags & 128) !== 0, g;
        if ((g = o) || (g = A !== null && A.memoizedState === null ? !1 : ($A.current & 2) !== 0),
        g && (s = !0,
        e.flags &= -129),
        g = (e.flags & 32) !== 0,
        e.flags &= -33,
        A === null) {
            if (pA) {
                if (s ? Vt(e) : Xt(),
                pA) {
                    var w = VA, y;
                    if (y = w) {
                        A: {
                            for (y = w,
                            w = nt; y.nodeType !== 8; ) {
                                if (!w) {
                                    w = null;
                                    break A
                                }
                                if (y = $e(y.nextSibling),
                                y === null) {
                                    w = null;
                                    break A
                                }
                            }
                            w = y
                        }
                        w !== null ? (e.memoizedState = {
                            dehydrated: w,
                            treeContext: Ca !== null ? {
                                id: dt,
                                overflow: ht
                            } : null,
                            retryLane: 536870912,
                            hydrationErrors: null
                        },
                        y = Te(18, null, null, 0),
                        y.stateNode = w,
                        y.return = e,
                        e.child = y,
                        Ce = e,
                        VA = null,
                        y = !0) : y = !1
                    }
                    y || ya(e)
                }
                if (w = e.memoizedState,
                w !== null && (w = w.dehydrated,
                w !== null))
                    return Ho(w) ? e.lanes = 32 : e.lanes = 536870912,
                    null;
                Ut(e)
            }
            return w = r.children,
            r = r.fallback,
            s ? (Xt(),
            s = e.mode,
            w = Zl({
                mode: "hidden",
                children: w
            }, s),
            r = wa(r, s, t, null),
            w.return = e,
            r.return = e,
            w.sibling = r,
            e.child = w,
            s = e.child,
            s.memoizedState = Xu(t),
            s.childLanes = Yu(A, g, t),
            e.memoizedState = Vu,
            r) : (Vt(e),
            zu(e, w))
        }
        if (y = A.memoizedState,
        y !== null && (w = y.dehydrated,
        w !== null)) {
            if (o)
                e.flags & 256 ? (Vt(e),
                e.flags &= -257,
                e = ju(A, e, t)) : e.memoizedState !== null ? (Xt(),
                e.child = A.child,
                e.flags |= 128,
                e = null) : (Xt(),
                s = r.fallback,
                w = e.mode,
                r = Zl({
                    mode: "visible",
                    children: r.children
                }, w),
                s = wa(s, w, t, null),
                s.flags |= 2,
                r.return = e,
                s.return = e,
                r.sibling = s,
                e.child = r,
                on(e, A.child, null, t),
                r = e.child,
                r.memoizedState = Xu(t),
                r.childLanes = Yu(A, g, t),
                e.memoizedState = Vu,
                e = s);
            else if (Vt(e),
            Ho(w)) {
                if (g = w.nextSibling && w.nextSibling.dataset,
                g)
                    var H = g.dgst;
                g = H,
                r = Error(l(419)),
                r.stack = "",
                r.digest = g,
                $n({
                    value: r,
                    source: null,
                    stack: null
                }),
                e = ju(A, e, t)
            } else if (te || Ar(A, e, t, !1),
            g = (t & A.childLanes) !== 0,
            te || g) {
                if (g = KA,
                g !== null && (r = t & -t,
                r = (r & 42) !== 0 ? 1 : Hs(r),
                r = (r & (g.suspendedLanes | t)) !== 0 ? 0 : r,
                r !== 0 && r !== y.retryLane))
                    throw y.retryLane = r,
                    Pa(A, r),
                    _e(g, A, r),
                    dg;
                w.data === "$?" || oo(),
                e = ju(A, e, t)
            } else
                w.data === "$?" ? (e.flags |= 192,
                e.child = A.child,
                e = null) : (A = y.treeContext,
                VA = $e(w.nextSibling),
                Ce = e,
                pA = !0,
                va = null,
                nt = !1,
                A !== null && (Ve[Xe++] = dt,
                Ve[Xe++] = ht,
                Ve[Xe++] = Ca,
                dt = A.id,
                ht = A.overflow,
                Ca = e),
                e = zu(e, r.children),
                e.flags |= 4096);
            return e
        }
        return s ? (Xt(),
        s = r.fallback,
        w = e.mode,
        y = A.child,
        H = y.sibling,
        r = gt(y, {
            mode: "hidden",
            children: r.children
        }),
        r.subtreeFlags = y.subtreeFlags & 65011712,
        H !== null ? s = gt(H, s) : (s = wa(s, w, t, null),
        s.flags |= 2),
        s.return = e,
        r.return = e,
        r.sibling = s,
        e.child = r,
        r = s,
        s = e.child,
        w = A.child.memoizedState,
        w === null ? w = Xu(t) : (y = w.cachePool,
        y !== null ? (H = PA._currentValue,
        y = y.parent !== H ? {
            parent: H,
            pool: H
        } : y) : y = oB(),
        w = {
            baseLanes: w.baseLanes | t,
            cachePool: y
        }),
        s.memoizedState = w,
        s.childLanes = Yu(A, g, t),
        e.memoizedState = Vu,
        r) : (Vt(e),
        t = A.child,
        A = t.sibling,
        t = gt(t, {
            mode: "visible",
            children: r.children
        }),
        t.return = e,
        t.sibling = null,
        A !== null && (g = e.deletions,
        g === null ? (e.deletions = [A],
        e.flags |= 16) : g.push(A)),
        e.child = t,
        e.memoizedState = null,
        t)
    }
    function zu(A, e) {
        return e = Zl({
            mode: "visible",
            children: e
        }, A.mode),
        e.return = A,
        A.child = e
    }
    function Zl(A, e) {
        return A = Te(22, A, null, e),
        A.lanes = 0,
        A.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null
        },
        A
    }
    function ju(A, e, t) {
        return on(e, A.child, null, t),
        A = zu(e, e.pendingProps.children),
        A.flags |= 2,
        e.memoizedState = null,
        A
    }
    function Fg(A, e, t) {
        A.lanes |= e;
        var r = A.alternate;
        r !== null && (r.lanes |= e),
        ou(A.return, e, t)
    }
    function Ju(A, e, t, r, s) {
        var o = A.memoizedState;
        o === null ? A.memoizedState = {
            isBackwards: e,
            rendering: null,
            renderingStartTime: 0,
            last: r,
            tail: t,
            tailMode: s
        } : (o.isBackwards = e,
        o.rendering = null,
        o.renderingStartTime = 0,
        o.last = r,
        o.tail = t,
        o.tailMode = s)
    }
    function Eg(A, e, t) {
        var r = e.pendingProps
          , s = r.revealOrder
          , o = r.tail;
        if (le(A, e, r.children, t),
        r = $A.current,
        (r & 2) !== 0)
            r = r & 1 | 2,
            e.flags |= 128;
        else {
            if (A !== null && (A.flags & 128) !== 0)
                A: for (A = e.child; A !== null; ) {
                    if (A.tag === 13)
                        A.memoizedState !== null && Fg(A, t, e);
                    else if (A.tag === 19)
                        Fg(A, t, e);
                    else if (A.child !== null) {
                        A.child.return = A,
                        A = A.child;
                        continue
                    }
                    if (A === e)
                        break A;
                    for (; A.sibling === null; ) {
                        if (A.return === null || A.return === e)
                            break A;
                        A = A.return
                    }
                    A.sibling.return = A.return,
                    A = A.sibling
                }
            r &= 1
        }
        switch (Z($A, r),
        s) {
        case "forwards":
            for (t = e.child,
            s = null; t !== null; )
                A = t.alternate,
                A !== null && zl(A) === null && (s = t),
                t = t.sibling;
            t = s,
            t === null ? (s = e.child,
            e.child = null) : (s = t.sibling,
            t.sibling = null),
            Ju(e, !1, s, t, o);
            break;
        case "backwards":
            for (t = null,
            s = e.child,
            e.child = null; s !== null; ) {
                if (A = s.alternate,
                A !== null && zl(A) === null) {
                    e.child = s;
                    break
                }
                A = s.sibling,
                s.sibling = t,
                t = s,
                s = A
            }
            Ju(e, !0, t, null, o);
            break;
        case "together":
            Ju(e, !1, null, null, void 0);
            break;
        default:
            e.memoizedState = null
        }
        return e.child
    }
    function vt(A, e, t) {
        if (A !== null && (e.dependencies = A.dependencies),
        kt |= e.lanes,
        (t & e.childLanes) === 0)
            if (A !== null) {
                if (Ar(A, e, t, !1),
                (t & e.childLanes) === 0)
                    return null
            } else
                return null;
        if (A !== null && e.child !== A.child)
            throw Error(l(153));
        if (e.child !== null) {
            for (A = e.child,
            t = gt(A, A.pendingProps),
            e.child = t,
            t.return = e; A.sibling !== null; )
                A = A.sibling,
                t = t.sibling = gt(A, A.pendingProps),
                t.return = e;
            t.sibling = null
        }
        return e.child
    }
    function ku(A, e) {
        return (A.lanes & e) !== 0 ? !0 : (A = A.dependencies,
        !!(A !== null && xl(A)))
    }
    function eC(A, e, t) {
        switch (e.tag) {
        case 3:
            MA(e, e.stateNode.containerInfo),
            Ot(e, PA, A.memoizedState.cache),
            Pn();
            break;
        case 27:
        case 5:
            ps(e);
            break;
        case 4:
            MA(e, e.stateNode.containerInfo);
            break;
        case 10:
            Ot(e, e.type, e.memoizedProps.value);
            break;
        case 13:
            var r = e.memoizedState;
            if (r !== null)
                return r.dehydrated !== null ? (Vt(e),
                e.flags |= 128,
                null) : (t & e.child.childLanes) !== 0 ? mg(A, e, t) : (Vt(e),
                A = vt(A, e, t),
                A !== null ? A.sibling : null);
            Vt(e);
            break;
        case 19:
            var s = (A.flags & 128) !== 0;
            if (r = (t & e.childLanes) !== 0,
            r || (Ar(A, e, t, !1),
            r = (t & e.childLanes) !== 0),
            s) {
                if (r)
                    return Eg(A, e, t);
                e.flags |= 128
            }
            if (s = e.memoizedState,
            s !== null && (s.rendering = null,
            s.tail = null,
            s.lastEffect = null),
            Z($A, $A.current),
            r)
                break;
            return null;
        case 22:
        case 23:
            return e.lanes = 0,
            Cg(A, e, t);
        case 24:
            Ot(e, PA, A.memoizedState.cache)
        }
        return vt(A, e, t)
    }
    function bg(A, e, t) {
        if (A !== null)
            if (A.memoizedProps !== e.pendingProps)
                te = !0;
            else {
                if (!ku(A, t) && (e.flags & 128) === 0)
                    return te = !1,
                    eC(A, e, t);
                te = (A.flags & 131072) !== 0
            }
        else
            te = !1,
            pA && (e.flags & 1048576) !== 0 && aB(e, Hl, e.index);
        switch (e.lanes = 0,
        e.tag) {
        case 16:
            A: {
                A = e.pendingProps;
                var r = e.elementType
                  , s = r._init;
                if (r = s(r._payload),
                e.type = r,
                typeof r == "function")
                    au(r) ? (A = ba(r, A),
                    e.tag = 1,
                    e = yg(null, e, r, A, t)) : (e.tag = 0,
                    e = Gu(null, e, r, A, t));
                else {
                    if (r != null) {
                        if (s = r.$$typeof,
                        s === z) {
                            e.tag = 11,
                            e = hg(null, e, r, A, t);
                            break A
                        } else if (s === k) {
                            e.tag = 14,
                            e = Qg(null, e, r, A, t);
                            break A
                        }
                    }
                    throw e = mA(r) || r,
                    Error(l(306, e, ""))
                }
            }
            return e;
        case 0:
            return Gu(A, e, e.type, e.pendingProps, t);
        case 1:
            return r = e.type,
            s = ba(r, e.pendingProps),
            yg(A, e, r, s, t);
        case 3:
            A: {
                if (MA(e, e.stateNode.containerInfo),
                A === null)
                    throw Error(l(387));
                r = e.pendingProps;
                var o = e.memoizedState;
                s = o.element,
                Qu(A, e),
                ir(e, r, null, t);
                var g = e.memoizedState;
                if (r = g.cache,
                Ot(e, PA, r),
                r !== o.cache && cu(e, [PA], t, !0),
                lr(),
                r = g.element,
                o.isDehydrated)
                    if (o = {
                        element: r,
                        isDehydrated: !1,
                        cache: g.cache
                    },
                    e.updateQueue.baseState = o,
                    e.memoizedState = o,
                    e.flags & 256) {
                        e = pg(A, e, r, t);
                        break A
                    } else if (r !== s) {
                        s = Re(Error(l(424)), e),
                        $n(s),
                        e = pg(A, e, r, t);
                        break A
                    } else {
                        switch (A = e.stateNode.containerInfo,
                        A.nodeType) {
                        case 9:
                            A = A.body;
                            break;
                        default:
                            A = A.nodeName === "HTML" ? A.ownerDocument.body : A
                        }
                        for (VA = $e(A.firstChild),
                        Ce = e,
                        pA = !0,
                        va = null,
                        nt = !0,
                        t = rg(e, null, r, t),
                        e.child = t; t; )
                            t.flags = t.flags & -3 | 4096,
                            t = t.sibling
                    }
                else {
                    if (Pn(),
                    r === s) {
                        e = vt(A, e, t);
                        break A
                    }
                    le(A, e, r, t)
                }
                e = e.child
            }
            return e;
        case 26:
            return kl(A, e),
            A === null ? (t = Td(e.type, null, e.pendingProps, null)) ? e.memoizedState = t : pA || (t = e.type,
            A = e.pendingProps,
            r = ui(rA.current).createElement(t),
            r[ce] = e,
            r[ye] = A,
            se(r, t, A),
            ee(r),
            e.stateNode = r) : e.memoizedState = Td(e.type, A.memoizedProps, e.pendingProps, A.memoizedState),
            null;
        case 27:
            return ps(e),
            A === null && pA && (r = e.stateNode = Hd(e.type, e.pendingProps, rA.current),
            Ce = e,
            nt = !0,
            s = VA,
            Pt(e.type) ? (xo = s,
            VA = $e(r.firstChild)) : VA = s),
            le(A, e, e.pendingProps.children, t),
            kl(A, e),
            A === null && (e.flags |= 4194304),
            e.child;
        case 5:
            return A === null && pA && ((s = r = VA) && (r = xC(r, e.type, e.pendingProps, nt),
            r !== null ? (e.stateNode = r,
            Ce = e,
            VA = $e(r.firstChild),
            nt = !1,
            s = !0) : s = !1),
            s || ya(e)),
            ps(e),
            s = e.type,
            o = e.pendingProps,
            g = A !== null ? A.memoizedProps : null,
            r = o.children,
            Fo(s, o) ? r = null : g !== null && Fo(s, g) && (e.flags |= 32),
            e.memoizedState !== null && (s = pu(A, e, Jw, null, null, t),
            xr._currentValue = s),
            kl(A, e),
            le(A, e, r, t),
            e.child;
        case 6:
            return A === null && pA && ((A = t = VA) && (t = SC(t, e.pendingProps, nt),
            t !== null ? (e.stateNode = t,
            Ce = e,
            VA = null,
            A = !0) : A = !1),
            A || ya(e)),
            null;
        case 13:
            return mg(A, e, t);
        case 4:
            return MA(e, e.stateNode.containerInfo),
            r = e.pendingProps,
            A === null ? e.child = on(e, null, r, t) : le(A, e, r, t),
            e.child;
        case 11:
            return hg(A, e, e.type, e.pendingProps, t);
        case 7:
            return le(A, e, e.pendingProps, t),
            e.child;
        case 8:
            return le(A, e, e.pendingProps.children, t),
            e.child;
        case 12:
            return le(A, e, e.pendingProps.children, t),
            e.child;
        case 10:
            return r = e.pendingProps,
            Ot(e, e.type, r.value),
            le(A, e, r.children, t),
            e.child;
        case 9:
            return s = e.type._context,
            r = e.pendingProps.children,
            ma(e),
            s = fe(s),
            r = r(s),
            e.flags |= 1,
            le(A, e, r, t),
            e.child;
        case 14:
            return Qg(A, e, e.type, e.pendingProps, t);
        case 15:
            return wg(A, e, e.type, e.pendingProps, t);
        case 19:
            return Eg(A, e, t);
        case 31:
            return r = e.pendingProps,
            t = e.mode,
            r = {
                mode: r.mode,
                children: r.children
            },
            A === null ? (t = Zl(r, t),
            t.ref = e.ref,
            e.child = t,
            t.return = e,
            e = t) : (t = gt(A.child, r),
            t.ref = e.ref,
            e.child = t,
            t.return = e,
            e = t),
            e;
        case 22:
            return Cg(A, e, t);
        case 24:
            return ma(e),
            r = fe(PA),
            A === null ? (s = gu(),
            s === null && (s = KA,
            o = fu(),
            s.pooledCache = o,
            o.refCount++,
            o !== null && (s.pooledCacheLanes |= t),
            s = o),
            e.memoizedState = {
                parent: r,
                cache: s
            },
            hu(e),
            Ot(e, PA, s)) : ((A.lanes & t) !== 0 && (Qu(A, e),
            ir(e, null, null, t),
            lr()),
            s = A.memoizedState,
            o = e.memoizedState,
            s.parent !== r ? (s = {
                parent: r,
                cache: r
            },
            e.memoizedState = s,
            e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = s),
            Ot(e, PA, r)) : (r = o.cache,
            Ot(e, PA, r),
            r !== s.cache && cu(e, [PA], t, !0))),
            le(A, e, e.pendingProps.children, t),
            e.child;
        case 29:
            throw e.pendingProps
        }
        throw Error(l(156, e.tag))
    }
    function yt(A) {
        A.flags |= 4
    }
    function Hg(A, e) {
        if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
            A.flags &= -16777217;
        else if (A.flags |= 16777216,
        !_d(e)) {
            if (e = Ye.current,
            e !== null && ((vA & 4194048) === vA ? rt !== null : (vA & 62914560) !== vA && (vA & 536870912) === 0 || e !== rt))
                throw nr = du,
                cB;
            A.flags |= 8192
        }
    }
    function ql(A, e) {
        e !== null && (A.flags |= 4),
        A.flags & 16384 && (e = A.tag !== 22 ? rf() : 536870912,
        A.lanes |= e,
        gn |= e)
    }
    function gr(A, e) {
        if (!pA)
            switch (A.tailMode) {
            case "hidden":
                e = A.tail;
                for (var t = null; e !== null; )
                    e.alternate !== null && (t = e),
                    e = e.sibling;
                t === null ? A.tail = null : t.sibling = null;
                break;
            case "collapsed":
                t = A.tail;
                for (var r = null; t !== null; )
                    t.alternate !== null && (r = t),
                    t = t.sibling;
                r === null ? e || A.tail === null ? A.tail = null : A.tail.sibling = null : r.sibling = null
            }
    }
    function GA(A) {
        var e = A.alternate !== null && A.alternate.child === A.child
          , t = 0
          , r = 0;
        if (e)
            for (var s = A.child; s !== null; )
                t |= s.lanes | s.childLanes,
                r |= s.subtreeFlags & 65011712,
                r |= s.flags & 65011712,
                s.return = A,
                s = s.sibling;
        else
            for (s = A.child; s !== null; )
                t |= s.lanes | s.childLanes,
                r |= s.subtreeFlags,
                r |= s.flags,
                s.return = A,
                s = s.sibling;
        return A.subtreeFlags |= r,
        A.childLanes = t,
        e
    }
    function tC(A, e, t) {
        var r = e.pendingProps;
        switch (iu(e),
        e.tag) {
        case 31:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
            return GA(e),
            null;
        case 1:
            return GA(e),
            null;
        case 3:
            return t = e.stateNode,
            r = null,
            A !== null && (r = A.memoizedState.cache),
            e.memoizedState.cache !== r && (e.flags |= 2048),
            wt(PA),
            Lt(),
            t.pendingContext && (t.context = t.pendingContext,
            t.pendingContext = null),
            (A === null || A.child === null) && (Wn(e) ? yt(e) : A === null || A.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024,
            lB())),
            GA(e),
            null;
        case 26:
            return t = e.memoizedState,
            A === null ? (yt(e),
            t !== null ? (GA(e),
            Hg(e, t)) : (GA(e),
            e.flags &= -16777217)) : t ? t !== A.memoizedState ? (yt(e),
            GA(e),
            Hg(e, t)) : (GA(e),
            e.flags &= -16777217) : (A.memoizedProps !== r && yt(e),
            GA(e),
            e.flags &= -16777217),
            null;
        case 27:
            il(e),
            t = rA.current;
            var s = e.type;
            if (A !== null && e.stateNode != null)
                A.memoizedProps !== r && yt(e);
            else {
                if (!r) {
                    if (e.stateNode === null)
                        throw Error(l(166));
                    return GA(e),
                    null
                }
                A = tA.current,
                Wn(e) ? nB(e) : (A = Hd(s, r, t),
                e.stateNode = A,
                yt(e))
            }
            return GA(e),
            null;
        case 5:
            if (il(e),
            t = e.type,
            A !== null && e.stateNode != null)
                A.memoizedProps !== r && yt(e);
            else {
                if (!r) {
                    if (e.stateNode === null)
                        throw Error(l(166));
                    return GA(e),
                    null
                }
                if (A = tA.current,
                Wn(e))
                    nB(e);
                else {
                    switch (s = ui(rA.current),
                    A) {
                    case 1:
                        A = s.createElementNS("http://www.w3.org/2000/svg", t);
                        break;
                    case 2:
                        A = s.createElementNS("http://www.w3.org/1998/Math/MathML", t);
                        break;
                    default:
                        switch (t) {
                        case "svg":
                            A = s.createElementNS("http://www.w3.org/2000/svg", t);
                            break;
                        case "math":
                            A = s.createElementNS("http://www.w3.org/1998/Math/MathML", t);
                            break;
                        case "script":
                            A = s.createElement("div"),
                            A.innerHTML = "<script><\/script>",
                            A = A.removeChild(A.firstChild);
                            break;
                        case "select":
                            A = typeof r.is == "string" ? s.createElement("select", {
                                is: r.is
                            }) : s.createElement("select"),
                            r.multiple ? A.multiple = !0 : r.size && (A.size = r.size);
                            break;
                        default:
                            A = typeof r.is == "string" ? s.createElement(t, {
                                is: r.is
                            }) : s.createElement(t)
                        }
                    }
                    A[ce] = e,
                    A[ye] = r;
                    A: for (s = e.child; s !== null; ) {
                        if (s.tag === 5 || s.tag === 6)
                            A.appendChild(s.stateNode);
                        else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
                            s.child.return = s,
                            s = s.child;
                            continue
                        }
                        if (s === e)
                            break A;
                        for (; s.sibling === null; ) {
                            if (s.return === null || s.return === e)
                                break A;
                            s = s.return
                        }
                        s.sibling.return = s.return,
                        s = s.sibling
                    }
                    e.stateNode = A;
                    A: switch (se(A, t, r),
                    t) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                        A = !!r.autoFocus;
                        break A;
                    case "img":
                        A = !0;
                        break A;
                    default:
                        A = !1
                    }
                    A && yt(e)
                }
            }
            return GA(e),
            e.flags &= -16777217,
            null;
        case 6:
            if (A && e.stateNode != null)
                A.memoizedProps !== r && yt(e);
            else {
                if (typeof r != "string" && e.stateNode === null)
                    throw Error(l(166));
                if (A = rA.current,
                Wn(e)) {
                    if (A = e.stateNode,
                    t = e.memoizedProps,
                    r = null,
                    s = Ce,
                    s !== null)
                        switch (s.tag) {
                        case 27:
                        case 5:
                            r = s.memoizedProps
                        }
                    A[ce] = e,
                    A = !!(A.nodeValue === t || r !== null && r.suppressHydrationWarning === !0 || vd(A.nodeValue, t)),
                    A || ya(e)
                } else
                    A = ui(A).createTextNode(r),
                    A[ce] = e,
                    e.stateNode = A
            }
            return GA(e),
            null;
        case 13:
            if (r = e.memoizedState,
            A === null || A.memoizedState !== null && A.memoizedState.dehydrated !== null) {
                if (s = Wn(e),
                r !== null && r.dehydrated !== null) {
                    if (A === null) {
                        if (!s)
                            throw Error(l(318));
                        if (s = e.memoizedState,
                        s = s !== null ? s.dehydrated : null,
                        !s)
                            throw Error(l(317));
                        s[ce] = e
                    } else
                        Pn(),
                        (e.flags & 128) === 0 && (e.memoizedState = null),
                        e.flags |= 4;
                    GA(e),
                    s = !1
                } else
                    s = lB(),
                    A !== null && A.memoizedState !== null && (A.memoizedState.hydrationErrors = s),
                    s = !0;
                if (!s)
                    return e.flags & 256 ? (Ut(e),
                    e) : (Ut(e),
                    null)
            }
            if (Ut(e),
            (e.flags & 128) !== 0)
                return e.lanes = t,
                e;
            if (t = r !== null,
            A = A !== null && A.memoizedState !== null,
            t) {
                r = e.child,
                s = null,
                r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (s = r.alternate.memoizedState.cachePool.pool);
                var o = null;
                r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool),
                o !== s && (r.flags |= 2048)
            }
            return t !== A && t && (e.child.flags |= 8192),
            ql(e, e.updateQueue),
            GA(e),
            null;
        case 4:
            return Lt(),
            A === null && Uo(e.stateNode.containerInfo),
            GA(e),
            null;
        case 10:
            return wt(e.type),
            GA(e),
            null;
        case 19:
            if (J($A),
            s = e.memoizedState,
            s === null)
                return GA(e),
                null;
            if (r = (e.flags & 128) !== 0,
            o = s.rendering,
            o === null)
                if (r)
                    gr(s, !1);
                else {
                    if (XA !== 0 || A !== null && (A.flags & 128) !== 0)
                        for (A = e.child; A !== null; ) {
                            if (o = zl(A),
                            o !== null) {
                                for (e.flags |= 128,
                                gr(s, !1),
                                A = o.updateQueue,
                                e.updateQueue = A,
                                ql(e, A),
                                e.subtreeFlags = 0,
                                A = t,
                                t = e.child; t !== null; )
                                    tB(t, A),
                                    t = t.sibling;
                                return Z($A, $A.current & 1 | 2),
                                e.child
                            }
                            A = A.sibling
                        }
                    s.tail !== null && at() > $l && (e.flags |= 128,
                    r = !0,
                    gr(s, !1),
                    e.lanes = 4194304)
                }
            else {
                if (!r)
                    if (A = zl(o),
                    A !== null) {
                        if (e.flags |= 128,
                        r = !0,
                        A = A.updateQueue,
                        e.updateQueue = A,
                        ql(e, A),
                        gr(s, !0),
                        s.tail === null && s.tailMode === "hidden" && !o.alternate && !pA)
                            return GA(e),
                            null
                    } else
                        2 * at() - s.renderingStartTime > $l && t !== 536870912 && (e.flags |= 128,
                        r = !0,
                        gr(s, !1),
                        e.lanes = 4194304);
                s.isBackwards ? (o.sibling = e.child,
                e.child = o) : (A = s.last,
                A !== null ? A.sibling = o : e.child = o,
                s.last = o)
            }
            return s.tail !== null ? (e = s.tail,
            s.rendering = e,
            s.tail = e.sibling,
            s.renderingStartTime = at(),
            e.sibling = null,
            A = $A.current,
            Z($A, r ? A & 1 | 2 : A & 1),
            e) : (GA(e),
            null);
        case 22:
        case 23:
            return Ut(e),
            vu(),
            r = e.memoizedState !== null,
            A !== null ? A.memoizedState !== null !== r && (e.flags |= 8192) : r && (e.flags |= 8192),
            r ? (t & 536870912) !== 0 && (e.flags & 128) === 0 && (GA(e),
            e.subtreeFlags & 6 && (e.flags |= 8192)) : GA(e),
            t = e.updateQueue,
            t !== null && ql(e, t.retryQueue),
            t = null,
            A !== null && A.memoizedState !== null && A.memoizedState.cachePool !== null && (t = A.memoizedState.cachePool.pool),
            r = null,
            e.memoizedState !== null && e.memoizedState.cachePool !== null && (r = e.memoizedState.cachePool.pool),
            r !== t && (e.flags |= 2048),
            A !== null && J(Fa),
            null;
        case 24:
            return t = null,
            A !== null && (t = A.memoizedState.cache),
            e.memoizedState.cache !== t && (e.flags |= 2048),
            wt(PA),
            GA(e),
            null;
        case 25:
            return null;
        case 30:
            return null
        }
        throw Error(l(156, e.tag))
    }
    function aC(A, e) {
        switch (iu(e),
        e.tag) {
        case 1:
            return A = e.flags,
            A & 65536 ? (e.flags = A & -65537 | 128,
            e) : null;
        case 3:
            return wt(PA),
            Lt(),
            A = e.flags,
            (A & 65536) !== 0 && (A & 128) === 0 ? (e.flags = A & -65537 | 128,
            e) : null;
        case 26:
        case 27:
        case 5:
            return il(e),
            null;
        case 13:
            if (Ut(e),
            A = e.memoizedState,
            A !== null && A.dehydrated !== null) {
                if (e.alternate === null)
                    throw Error(l(340));
                Pn()
            }
            return A = e.flags,
            A & 65536 ? (e.flags = A & -65537 | 128,
            e) : null;
        case 19:
            return J($A),
            null;
        case 4:
            return Lt(),
            null;
        case 10:
            return wt(e.type),
            null;
        case 22:
        case 23:
            return Ut(e),
            vu(),
            A !== null && J(Fa),
            A = e.flags,
            A & 65536 ? (e.flags = A & -65537 | 128,
            e) : null;
        case 24:
            return wt(PA),
            null;
        case 25:
            return null;
        default:
            return null
        }
    }
    function xg(A, e) {
        switch (iu(e),
        e.tag) {
        case 3:
            wt(PA),
            Lt();
            break;
        case 26:
        case 27:
        case 5:
            il(e);
            break;
        case 4:
            Lt();
            break;
        case 13:
            Ut(e);
            break;
        case 19:
            J($A);
            break;
        case 10:
            wt(e.type);
            break;
        case 22:
        case 23:
            Ut(e),
            vu(),
            A !== null && J(Fa);
            break;
        case 24:
            wt(PA)
        }
    }
    function dr(A, e) {
        try {
            var t = e.updateQueue
              , r = t !== null ? t.lastEffect : null;
            if (r !== null) {
                var s = r.next;
                t = s;
                do {
                    if ((t.tag & A) === A) {
                        r = void 0;
                        var o = t.create
                          , g = t.inst;
                        r = o(),
                        g.destroy = r
                    }
                    t = t.next
                } while (t !== s)
            }
        } catch (w) {
            IA(e, e.return, w)
        }
    }
    function Yt(A, e, t) {
        try {
            var r = e.updateQueue
              , s = r !== null ? r.lastEffect : null;
            if (s !== null) {
                var o = s.next;
                r = o;
                do {
                    if ((r.tag & A) === A) {
                        var g = r.inst
                          , w = g.destroy;
                        if (w !== void 0) {
                            g.destroy = void 0,
                            s = e;
                            var y = t
                              , H = w;
                            try {
                                H()
                            } catch (M) {
                                IA(s, y, M)
                            }
                        }
                    }
                    r = r.next
                } while (r !== o)
            }
        } catch (M) {
            IA(e, e.return, M)
        }
    }
    function Sg(A) {
        var e = A.updateQueue;
        if (e !== null) {
            var t = A.stateNode;
            try {
                QB(e, t)
            } catch (r) {
                IA(A, A.return, r)
            }
        }
    }
    function Tg(A, e, t) {
        t.props = ba(A.type, A.memoizedProps),
        t.state = A.memoizedState;
        try {
            t.componentWillUnmount()
        } catch (r) {
            IA(A, e, r)
        }
    }
    function hr(A, e) {
        try {
            var t = A.ref;
            if (t !== null) {
                switch (A.tag) {
                case 26:
                case 27:
                case 5:
                    var r = A.stateNode;
                    break;
                case 30:
                    r = A.stateNode;
                    break;
                default:
                    r = A.stateNode
                }
                typeof t == "function" ? A.refCleanup = t(r) : t.current = r
            }
        } catch (s) {
            IA(A, e, s)
        }
    }
    function lt(A, e) {
        var t = A.ref
          , r = A.refCleanup;
        if (t !== null)
            if (typeof r == "function")
                try {
                    r()
                } catch (s) {
                    IA(A, e, s)
                } finally {
                    A.refCleanup = null,
                    A = A.alternate,
                    A != null && (A.refCleanup = null)
                }
            else if (typeof t == "function")
                try {
                    t(null)
                } catch (s) {
                    IA(A, e, s)
                }
            else
                t.current = null
    }
    function Dg(A) {
        var e = A.type
          , t = A.memoizedProps
          , r = A.stateNode;
        try {
            A: switch (e) {
            case "button":
            case "input":
            case "select":
            case "textarea":
                t.autoFocus && r.focus();
                break A;
            case "img":
                t.src ? r.src = t.src : t.srcSet && (r.srcset = t.srcSet)
            }
        } catch (s) {
            IA(A, A.return, s)
        }
    }
    function Zu(A, e, t) {
        try {
            var r = A.stateNode;
            mC(r, A.type, t, e),
            r[ye] = e
        } catch (s) {
            IA(A, A.return, s)
        }
    }
    function Lg(A) {
        return A.tag === 5 || A.tag === 3 || A.tag === 26 || A.tag === 27 && Pt(A.type) || A.tag === 4
    }
    function qu(A) {
        A: for (; ; ) {
            for (; A.sibling === null; ) {
                if (A.return === null || Lg(A.return))
                    return null;
                A = A.return
            }
            for (A.sibling.return = A.return,
            A = A.sibling; A.tag !== 5 && A.tag !== 6 && A.tag !== 18; ) {
                if (A.tag === 27 && Pt(A.type) || A.flags & 2 || A.child === null || A.tag === 4)
                    continue A;
                A.child.return = A,
                A = A.child
            }
            if (!(A.flags & 2))
                return A.stateNode
        }
    }
    function Wu(A, e, t) {
        var r = A.tag;
        if (r === 5 || r === 6)
            A = A.stateNode,
            e ? (t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t).insertBefore(A, e) : (e = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
            e.appendChild(A),
            t = t._reactRootContainer,
            t != null || e.onclick !== null || (e.onclick = si));
        else if (r !== 4 && (r === 27 && Pt(A.type) && (t = A.stateNode,
        e = null),
        A = A.child,
        A !== null))
            for (Wu(A, e, t),
            A = A.sibling; A !== null; )
                Wu(A, e, t),
                A = A.sibling
    }
    function Wl(A, e, t) {
        var r = A.tag;
        if (r === 5 || r === 6)
            A = A.stateNode,
            e ? t.insertBefore(A, e) : t.appendChild(A);
        else if (r !== 4 && (r === 27 && Pt(A.type) && (t = A.stateNode),
        A = A.child,
        A !== null))
            for (Wl(A, e, t),
            A = A.sibling; A !== null; )
                Wl(A, e, t),
                A = A.sibling
    }
    function Ig(A) {
        var e = A.stateNode
          , t = A.memoizedProps;
        try {
            for (var r = A.type, s = e.attributes; s.length; )
                e.removeAttributeNode(s[0]);
            se(e, r, t),
            e[ce] = A,
            e[ye] = t
        } catch (o) {
            IA(A, A.return, o)
        }
    }
    var pt = !1
      , zA = !1
      , Pu = !1
      , Kg = typeof WeakSet == "function" ? WeakSet : Set
      , ae = null;
    function nC(A, e) {
        if (A = A.containerInfo,
        po = di,
        A = jf(A),
        qs(A)) {
            if ("selectionStart"in A)
                var t = {
                    start: A.selectionStart,
                    end: A.selectionEnd
                };
            else
                A: {
                    t = (t = A.ownerDocument) && t.defaultView || window;
                    var r = t.getSelection && t.getSelection();
                    if (r && r.rangeCount !== 0) {
                        t = r.anchorNode;
                        var s = r.anchorOffset
                          , o = r.focusNode;
                        r = r.focusOffset;
                        try {
                            t.nodeType,
                            o.nodeType
                        } catch {
                            t = null;
                            break A
                        }
                        var g = 0
                          , w = -1
                          , y = -1
                          , H = 0
                          , M = 0
                          , G = A
                          , S = null;
                        e: for (; ; ) {
                            for (var T; G !== t || s !== 0 && G.nodeType !== 3 || (w = g + s),
                            G !== o || r !== 0 && G.nodeType !== 3 || (y = g + r),
                            G.nodeType === 3 && (g += G.nodeValue.length),
                            (T = G.firstChild) !== null; )
                                S = G,
                                G = T;
                            for (; ; ) {
                                if (G === A)
                                    break e;
                                if (S === t && ++H === s && (w = g),
                                S === o && ++M === r && (y = g),
                                (T = G.nextSibling) !== null)
                                    break;
                                G = S,
                                S = G.parentNode
                            }
                            G = T
                        }
                        t = w === -1 || y === -1 ? null : {
                            start: w,
                            end: y
                        }
                    } else
                        t = null
                }
            t = t || {
                start: 0,
                end: 0
            }
        } else
            t = null;
        for (mo = {
            focusedElem: A,
            selectionRange: t
        },
        di = !1,
        ae = e; ae !== null; )
            if (e = ae,
            A = e.child,
            (e.subtreeFlags & 1024) !== 0 && A !== null)
                A.return = e,
                ae = A;
            else
                for (; ae !== null; ) {
                    switch (e = ae,
                    o = e.alternate,
                    A = e.flags,
                    e.tag) {
                    case 0:
                        break;
                    case 11:
                    case 15:
                        break;
                    case 1:
                        if ((A & 1024) !== 0 && o !== null) {
                            A = void 0,
                            t = e,
                            s = o.memoizedProps,
                            o = o.memoizedState,
                            r = t.stateNode;
                            try {
                                var sA = ba(t.type, s, t.elementType === t.type);
                                A = r.getSnapshotBeforeUpdate(sA, o),
                                r.__reactInternalSnapshotBeforeUpdate = A
                            } catch (lA) {
                                IA(t, t.return, lA)
                            }
                        }
                        break;
                    case 3:
                        if ((A & 1024) !== 0) {
                            if (A = e.stateNode.containerInfo,
                            t = A.nodeType,
                            t === 9)
                                bo(A);
                            else if (t === 1)
                                switch (A.nodeName) {
                                case "HEAD":
                                case "HTML":
                                case "BODY":
                                    bo(A);
                                    break;
                                default:
                                    A.textContent = ""
                                }
                        }
                        break;
                    case 5:
                    case 26:
                    case 27:
                    case 6:
                    case 4:
                    case 17:
                        break;
                    default:
                        if ((A & 1024) !== 0)
                            throw Error(l(163))
                    }
                    if (A = e.sibling,
                    A !== null) {
                        A.return = e.return,
                        ae = A;
                        break
                    }
                    ae = e.return
                }
    }
    function _g(A, e, t) {
        var r = t.flags;
        switch (t.tag) {
        case 0:
        case 11:
        case 15:
            zt(A, t),
            r & 4 && dr(5, t);
            break;
        case 1:
            if (zt(A, t),
            r & 4)
                if (A = t.stateNode,
                e === null)
                    try {
                        A.componentDidMount()
                    } catch (g) {
                        IA(t, t.return, g)
                    }
                else {
                    var s = ba(t.type, e.memoizedProps);
                    e = e.memoizedState;
                    try {
                        A.componentDidUpdate(s, e, A.__reactInternalSnapshotBeforeUpdate)
                    } catch (g) {
                        IA(t, t.return, g)
                    }
                }
            r & 64 && Sg(t),
            r & 512 && hr(t, t.return);
            break;
        case 3:
            if (zt(A, t),
            r & 64 && (A = t.updateQueue,
            A !== null)) {
                if (e = null,
                t.child !== null)
                    switch (t.child.tag) {
                    case 27:
                    case 5:
                        e = t.child.stateNode;
                        break;
                    case 1:
                        e = t.child.stateNode
                    }
                try {
                    QB(A, e)
                } catch (g) {
                    IA(t, t.return, g)
                }
            }
            break;
        case 27:
            e === null && r & 4 && Ig(t);
        case 26:
        case 5:
            zt(A, t),
            e === null && r & 4 && Dg(t),
            r & 512 && hr(t, t.return);
            break;
        case 12:
            zt(A, t);
            break;
        case 13:
            zt(A, t),
            r & 4 && Ng(A, t),
            r & 64 && (A = t.memoizedState,
            A !== null && (A = A.dehydrated,
            A !== null && (t = BC.bind(null, t),
            TC(A, t))));
            break;
        case 22:
            if (r = t.memoizedState !== null || pt,
            !r) {
                e = e !== null && e.memoizedState !== null || zA,
                s = pt;
                var o = zA;
                pt = r,
                (zA = e) && !o ? jt(A, t, (t.subtreeFlags & 8772) !== 0) : zt(A, t),
                pt = s,
                zA = o
            }
            break;
        case 30:
            break;
        default:
            zt(A, t)
        }
    }
    function Og(A) {
        var e = A.alternate;
        e !== null && (A.alternate = null,
        Og(e)),
        A.child = null,
        A.deletions = null,
        A.sibling = null,
        A.tag === 5 && (e = A.stateNode,
        e !== null && Ts(e)),
        A.stateNode = null,
        A.return = null,
        A.dependencies = null,
        A.memoizedProps = null,
        A.memoizedState = null,
        A.pendingProps = null,
        A.stateNode = null,
        A.updateQueue = null
    }
    var NA = null
      , Fe = !1;
    function mt(A, e, t) {
        for (t = t.child; t !== null; )
            Mg(A, e, t),
            t = t.sibling
    }
    function Mg(A, e, t) {
        if (He && typeof He.onCommitFiberUnmount == "function")
            try {
                He.onCommitFiberUnmount(On, t)
            } catch {}
        switch (t.tag) {
        case 26:
            zA || lt(t, e),
            mt(A, e, t),
            t.memoizedState ? t.memoizedState.count-- : t.stateNode && (t = t.stateNode,
            t.parentNode.removeChild(t));
            break;
        case 27:
            zA || lt(t, e);
            var r = NA
              , s = Fe;
            Pt(t.type) && (NA = t.stateNode,
            Fe = !1),
            mt(A, e, t),
            Fr(t.stateNode),
            NA = r,
            Fe = s;
            break;
        case 5:
            zA || lt(t, e);
        case 6:
            if (r = NA,
            s = Fe,
            NA = null,
            mt(A, e, t),
            NA = r,
            Fe = s,
            NA !== null)
                if (Fe)
                    try {
                        (NA.nodeType === 9 ? NA.body : NA.nodeName === "HTML" ? NA.ownerDocument.body : NA).removeChild(t.stateNode)
                    } catch (o) {
                        IA(t, e, o)
                    }
                else
                    try {
                        NA.removeChild(t.stateNode)
                    } catch (o) {
                        IA(t, e, o)
                    }
            break;
        case 18:
            NA !== null && (Fe ? (A = NA,
            Ed(A.nodeType === 9 ? A.body : A.nodeName === "HTML" ? A.ownerDocument.body : A, t.stateNode),
            Lr(A)) : Ed(NA, t.stateNode));
            break;
        case 4:
            r = NA,
            s = Fe,
            NA = t.stateNode.containerInfo,
            Fe = !0,
            mt(A, e, t),
            NA = r,
            Fe = s;
            break;
        case 0:
        case 11:
        case 14:
        case 15:
            zA || Yt(2, t, e),
            zA || Yt(4, t, e),
            mt(A, e, t);
            break;
        case 1:
            zA || (lt(t, e),
            r = t.stateNode,
            typeof r.componentWillUnmount == "function" && Tg(t, e, r)),
            mt(A, e, t);
            break;
        case 21:
            mt(A, e, t);
            break;
        case 22:
            zA = (r = zA) || t.memoizedState !== null,
            mt(A, e, t),
            zA = r;
            break;
        default:
            mt(A, e, t)
        }
    }
    function Ng(A, e) {
        if (e.memoizedState === null && (A = e.alternate,
        A !== null && (A = A.memoizedState,
        A !== null && (A = A.dehydrated,
        A !== null))))
            try {
                Lr(A)
            } catch (t) {
                IA(e, e.return, t)
            }
    }
    function rC(A) {
        switch (A.tag) {
        case 13:
        case 19:
            var e = A.stateNode;
            return e === null && (e = A.stateNode = new Kg),
            e;
        case 22:
            return A = A.stateNode,
            e = A._retryCache,
            e === null && (e = A._retryCache = new Kg),
            e;
        default:
            throw Error(l(435, A.tag))
        }
    }
    function $u(A, e) {
        var t = rC(A);
        e.forEach(function(r) {
            var s = gC.bind(null, A, r);
            t.has(r) || (t.add(r),
            r.then(s, s))
        })
    }
    function De(A, e) {
        var t = e.deletions;
        if (t !== null)
            for (var r = 0; r < t.length; r++) {
                var s = t[r]
                  , o = A
                  , g = e
                  , w = g;
                A: for (; w !== null; ) {
                    switch (w.tag) {
                    case 27:
                        if (Pt(w.type)) {
                            NA = w.stateNode,
                            Fe = !1;
                            break A
                        }
                        break;
                    case 5:
                        NA = w.stateNode,
                        Fe = !1;
                        break A;
                    case 3:
                    case 4:
                        NA = w.stateNode.containerInfo,
                        Fe = !0;
                        break A
                    }
                    w = w.return
                }
                if (NA === null)
                    throw Error(l(160));
                Mg(o, g, s),
                NA = null,
                Fe = !1,
                o = s.alternate,
                o !== null && (o.return = null),
                s.return = null
            }
        if (e.subtreeFlags & 13878)
            for (e = e.child; e !== null; )
                Rg(e, A),
                e = e.sibling
    }
    var Pe = null;
    function Rg(A, e) {
        var t = A.alternate
          , r = A.flags;
        switch (A.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
            De(e, A),
            Le(A),
            r & 4 && (Yt(3, A, A.return),
            dr(3, A),
            Yt(5, A, A.return));
            break;
        case 1:
            De(e, A),
            Le(A),
            r & 512 && (zA || t === null || lt(t, t.return)),
            r & 64 && pt && (A = A.updateQueue,
            A !== null && (r = A.callbacks,
            r !== null && (t = A.shared.hiddenCallbacks,
            A.shared.hiddenCallbacks = t === null ? r : t.concat(r))));
            break;
        case 26:
            var s = Pe;
            if (De(e, A),
            Le(A),
            r & 512 && (zA || t === null || lt(t, t.return)),
            r & 4) {
                var o = t !== null ? t.memoizedState : null;
                if (r = A.memoizedState,
                t === null)
                    if (r === null)
                        if (A.stateNode === null) {
                            A: {
                                r = A.type,
                                t = A.memoizedProps,
                                s = s.ownerDocument || s;
                                e: switch (r) {
                                case "title":
                                    o = s.getElementsByTagName("title")[0],
                                    (!o || o[Rn] || o[ce] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = s.createElement(r),
                                    s.head.insertBefore(o, s.querySelector("head > title"))),
                                    se(o, r, t),
                                    o[ce] = A,
                                    ee(o),
                                    r = o;
                                    break A;
                                case "link":
                                    var g = Id("link", "href", s).get(r + (t.href || ""));
                                    if (g) {
                                        for (var w = 0; w < g.length; w++)
                                            if (o = g[w],
                                            o.getAttribute("href") === (t.href == null || t.href === "" ? null : t.href) && o.getAttribute("rel") === (t.rel == null ? null : t.rel) && o.getAttribute("title") === (t.title == null ? null : t.title) && o.getAttribute("crossorigin") === (t.crossOrigin == null ? null : t.crossOrigin)) {
                                                g.splice(w, 1);
                                                break e
                                            }
                                    }
                                    o = s.createElement(r),
                                    se(o, r, t),
                                    s.head.appendChild(o);
                                    break;
                                case "meta":
                                    if (g = Id("meta", "content", s).get(r + (t.content || ""))) {
                                        for (w = 0; w < g.length; w++)
                                            if (o = g[w],
                                            o.getAttribute("content") === (t.content == null ? null : "" + t.content) && o.getAttribute("name") === (t.name == null ? null : t.name) && o.getAttribute("property") === (t.property == null ? null : t.property) && o.getAttribute("http-equiv") === (t.httpEquiv == null ? null : t.httpEquiv) && o.getAttribute("charset") === (t.charSet == null ? null : t.charSet)) {
                                                g.splice(w, 1);
                                                break e
                                            }
                                    }
                                    o = s.createElement(r),
                                    se(o, r, t),
                                    s.head.appendChild(o);
                                    break;
                                default:
                                    throw Error(l(468, r))
                                }
                                o[ce] = A,
                                ee(o),
                                r = o
                            }
                            A.stateNode = r
                        } else
                            Kd(s, A.type, A.stateNode);
                    else
                        A.stateNode = Ld(s, r, A.memoizedProps);
                else
                    o !== r ? (o === null ? t.stateNode !== null && (t = t.stateNode,
                    t.parentNode.removeChild(t)) : o.count--,
                    r === null ? Kd(s, A.type, A.stateNode) : Ld(s, r, A.memoizedProps)) : r === null && A.stateNode !== null && Zu(A, A.memoizedProps, t.memoizedProps)
            }
            break;
        case 27:
            De(e, A),
            Le(A),
            r & 512 && (zA || t === null || lt(t, t.return)),
            t !== null && r & 4 && Zu(A, A.memoizedProps, t.memoizedProps);
            break;
        case 5:
            if (De(e, A),
            Le(A),
            r & 512 && (zA || t === null || lt(t, t.return)),
            A.flags & 32) {
                s = A.stateNode;
                try {
                    za(s, "")
                } catch (T) {
                    IA(A, A.return, T)
                }
            }
            r & 4 && A.stateNode != null && (s = A.memoizedProps,
            Zu(A, s, t !== null ? t.memoizedProps : s)),
            r & 1024 && (Pu = !0);
            break;
        case 6:
            if (De(e, A),
            Le(A),
            r & 4) {
                if (A.stateNode === null)
                    throw Error(l(162));
                r = A.memoizedProps,
                t = A.stateNode;
                try {
                    t.nodeValue = r
                } catch (T) {
                    IA(A, A.return, T)
                }
            }
            break;
        case 3:
            if (fi = null,
            s = Pe,
            Pe = oi(e.containerInfo),
            De(e, A),
            Pe = s,
            Le(A),
            r & 4 && t !== null && t.memoizedState.isDehydrated)
                try {
                    Lr(e.containerInfo)
                } catch (T) {
                    IA(A, A.return, T)
                }
            Pu && (Pu = !1,
            Gg(A));
            break;
        case 4:
            r = Pe,
            Pe = oi(A.stateNode.containerInfo),
            De(e, A),
            Le(A),
            Pe = r;
            break;
        case 12:
            De(e, A),
            Le(A);
            break;
        case 13:
            De(e, A),
            Le(A),
            A.child.flags & 8192 && A.memoizedState !== null != (t !== null && t.memoizedState !== null) && (ro = at()),
            r & 4 && (r = A.updateQueue,
            r !== null && (A.updateQueue = null,
            $u(A, r)));
            break;
        case 22:
            s = A.memoizedState !== null;
            var y = t !== null && t.memoizedState !== null
              , H = pt
              , M = zA;
            if (pt = H || s,
            zA = M || y,
            De(e, A),
            zA = M,
            pt = H,
            Le(A),
            r & 8192)
                A: for (e = A.stateNode,
                e._visibility = s ? e._visibility & -2 : e._visibility | 1,
                s && (t === null || y || pt || zA || Ha(A)),
                t = null,
                e = A; ; ) {
                    if (e.tag === 5 || e.tag === 26) {
                        if (t === null) {
                            y = t = e;
                            try {
                                if (o = y.stateNode,
                                s)
                                    g = o.style,
                                    typeof g.setProperty == "function" ? g.setProperty("display", "none", "important") : g.display = "none";
                                else {
                                    w = y.stateNode;
                                    var G = y.memoizedProps.style
                                      , S = G != null && G.hasOwnProperty("display") ? G.display : null;
                                    w.style.display = S == null || typeof S == "boolean" ? "" : ("" + S).trim()
                                }
                            } catch (T) {
                                IA(y, y.return, T)
                            }
                        }
                    } else if (e.tag === 6) {
                        if (t === null) {
                            y = e;
                            try {
                                y.stateNode.nodeValue = s ? "" : y.memoizedProps
                            } catch (T) {
                                IA(y, y.return, T)
                            }
                        }
                    } else if ((e.tag !== 22 && e.tag !== 23 || e.memoizedState === null || e === A) && e.child !== null) {
                        e.child.return = e,
                        e = e.child;
                        continue
                    }
                    if (e === A)
                        break A;
                    for (; e.sibling === null; ) {
                        if (e.return === null || e.return === A)
                            break A;
                        t === e && (t = null),
                        e = e.return
                    }
                    t === e && (t = null),
                    e.sibling.return = e.return,
                    e = e.sibling
                }
            r & 4 && (r = A.updateQueue,
            r !== null && (t = r.retryQueue,
            t !== null && (r.retryQueue = null,
            $u(A, t))));
            break;
        case 19:
            De(e, A),
            Le(A),
            r & 4 && (r = A.updateQueue,
            r !== null && (A.updateQueue = null,
            $u(A, r)));
            break;
        case 30:
            break;
        case 21:
            break;
        default:
            De(e, A),
            Le(A)
        }
    }
    function Le(A) {
        var e = A.flags;
        if (e & 2) {
            try {
                for (var t, r = A.return; r !== null; ) {
                    if (Lg(r)) {
                        t = r;
                        break
                    }
                    r = r.return
                }
                if (t == null)
                    throw Error(l(160));
                switch (t.tag) {
                case 27:
                    var s = t.stateNode
                      , o = qu(A);
                    Wl(A, o, s);
                    break;
                case 5:
                    var g = t.stateNode;
                    t.flags & 32 && (za(g, ""),
                    t.flags &= -33);
                    var w = qu(A);
                    Wl(A, w, g);
                    break;
                case 3:
                case 4:
                    var y = t.stateNode.containerInfo
                      , H = qu(A);
                    Wu(A, H, y);
                    break;
                default:
                    throw Error(l(161))
                }
            } catch (M) {
                IA(A, A.return, M)
            }
            A.flags &= -3
        }
        e & 4096 && (A.flags &= -4097)
    }
    function Gg(A) {
        if (A.subtreeFlags & 1024)
            for (A = A.child; A !== null; ) {
                var e = A;
                Gg(e),
                e.tag === 5 && e.flags & 1024 && e.stateNode.reset(),
                A = A.sibling
            }
    }
    function zt(A, e) {
        if (e.subtreeFlags & 8772)
            for (e = e.child; e !== null; )
                _g(A, e.alternate, e),
                e = e.sibling
    }
    function Ha(A) {
        for (A = A.child; A !== null; ) {
            var e = A;
            switch (e.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
                Yt(4, e, e.return),
                Ha(e);
                break;
            case 1:
                lt(e, e.return);
                var t = e.stateNode;
                typeof t.componentWillUnmount == "function" && Tg(e, e.return, t),
                Ha(e);
                break;
            case 27:
                Fr(e.stateNode);
            case 26:
            case 5:
                lt(e, e.return),
                Ha(e);
                break;
            case 22:
                e.memoizedState === null && Ha(e);
                break;
            case 30:
                Ha(e);
                break;
            default:
                Ha(e)
            }
            A = A.sibling
        }
    }
    function jt(A, e, t) {
        for (t = t && (e.subtreeFlags & 8772) !== 0,
        e = e.child; e !== null; ) {
            var r = e.alternate
              , s = A
              , o = e
              , g = o.flags;
            switch (o.tag) {
            case 0:
            case 11:
            case 15:
                jt(s, o, t),
                dr(4, o);
                break;
            case 1:
                if (jt(s, o, t),
                r = o,
                s = r.stateNode,
                typeof s.componentDidMount == "function")
                    try {
                        s.componentDidMount()
                    } catch (H) {
                        IA(r, r.return, H)
                    }
                if (r = o,
                s = r.updateQueue,
                s !== null) {
                    var w = r.stateNode;
                    try {
                        var y = s.shared.hiddenCallbacks;
                        if (y !== null)
                            for (s.shared.hiddenCallbacks = null,
                            s = 0; s < y.length; s++)
                                hB(y[s], w)
                    } catch (H) {
                        IA(r, r.return, H)
                    }
                }
                t && g & 64 && Sg(o),
                hr(o, o.return);
                break;
            case 27:
                Ig(o);
            case 26:
            case 5:
                jt(s, o, t),
                t && r === null && g & 4 && Dg(o),
                hr(o, o.return);
                break;
            case 12:
                jt(s, o, t);
                break;
            case 13:
                jt(s, o, t),
                t && g & 4 && Ng(s, o);
                break;
            case 22:
                o.memoizedState === null && jt(s, o, t),
                hr(o, o.return);
                break;
            case 30:
                break;
            default:
                jt(s, o, t)
            }
            e = e.sibling
        }
    }
    function Ao(A, e) {
        var t = null;
        A !== null && A.memoizedState !== null && A.memoizedState.cachePool !== null && (t = A.memoizedState.cachePool.pool),
        A = null,
        e.memoizedState !== null && e.memoizedState.cachePool !== null && (A = e.memoizedState.cachePool.pool),
        A !== t && (A != null && A.refCount++,
        t != null && er(t))
    }
    function eo(A, e) {
        A = null,
        e.alternate !== null && (A = e.alternate.memoizedState.cache),
        e = e.memoizedState.cache,
        e !== A && (e.refCount++,
        A != null && er(A))
    }
    function it(A, e, t, r) {
        if (e.subtreeFlags & 10256)
            for (e = e.child; e !== null; )
                Vg(A, e, t, r),
                e = e.sibling
    }
    function Vg(A, e, t, r) {
        var s = e.flags;
        switch (e.tag) {
        case 0:
        case 11:
        case 15:
            it(A, e, t, r),
            s & 2048 && dr(9, e);
            break;
        case 1:
            it(A, e, t, r);
            break;
        case 3:
            it(A, e, t, r),
            s & 2048 && (A = null,
            e.alternate !== null && (A = e.alternate.memoizedState.cache),
            e = e.memoizedState.cache,
            e !== A && (e.refCount++,
            A != null && er(A)));
            break;
        case 12:
            if (s & 2048) {
                it(A, e, t, r),
                A = e.stateNode;
                try {
                    var o = e.memoizedProps
                      , g = o.id
                      , w = o.onPostCommit;
                    typeof w == "function" && w(g, e.alternate === null ? "mount" : "update", A.passiveEffectDuration, -0)
                } catch (y) {
                    IA(e, e.return, y)
                }
            } else
                it(A, e, t, r);
            break;
        case 13:
            it(A, e, t, r);
            break;
        case 23:
            break;
        case 22:
            o = e.stateNode,
            g = e.alternate,
            e.memoizedState !== null ? o._visibility & 2 ? it(A, e, t, r) : Qr(A, e) : o._visibility & 2 ? it(A, e, t, r) : (o._visibility |= 2,
            cn(A, e, t, r, (e.subtreeFlags & 10256) !== 0)),
            s & 2048 && Ao(g, e);
            break;
        case 24:
            it(A, e, t, r),
            s & 2048 && eo(e.alternate, e);
            break;
        default:
            it(A, e, t, r)
        }
    }
    function cn(A, e, t, r, s) {
        for (s = s && (e.subtreeFlags & 10256) !== 0,
        e = e.child; e !== null; ) {
            var o = A
              , g = e
              , w = t
              , y = r
              , H = g.flags;
            switch (g.tag) {
            case 0:
            case 11:
            case 15:
                cn(o, g, w, y, s),
                dr(8, g);
                break;
            case 23:
                break;
            case 22:
                var M = g.stateNode;
                g.memoizedState !== null ? M._visibility & 2 ? cn(o, g, w, y, s) : Qr(o, g) : (M._visibility |= 2,
                cn(o, g, w, y, s)),
                s && H & 2048 && Ao(g.alternate, g);
                break;
            case 24:
                cn(o, g, w, y, s),
                s && H & 2048 && eo(g.alternate, g);
                break;
            default:
                cn(o, g, w, y, s)
            }
            e = e.sibling
        }
    }
    function Qr(A, e) {
        if (e.subtreeFlags & 10256)
            for (e = e.child; e !== null; ) {
                var t = A
                  , r = e
                  , s = r.flags;
                switch (r.tag) {
                case 22:
                    Qr(t, r),
                    s & 2048 && Ao(r.alternate, r);
                    break;
                case 24:
                    Qr(t, r),
                    s & 2048 && eo(r.alternate, r);
                    break;
                default:
                    Qr(t, r)
                }
                e = e.sibling
            }
    }
    var wr = 8192;
    function fn(A) {
        if (A.subtreeFlags & wr)
            for (A = A.child; A !== null; )
                Xg(A),
                A = A.sibling
    }
    function Xg(A) {
        switch (A.tag) {
        case 26:
            fn(A),
            A.flags & wr && A.memoizedState !== null && YC(Pe, A.memoizedState, A.memoizedProps);
            break;
        case 5:
            fn(A);
            break;
        case 3:
        case 4:
            var e = Pe;
            Pe = oi(A.stateNode.containerInfo),
            fn(A),
            Pe = e;
            break;
        case 22:
            A.memoizedState === null && (e = A.alternate,
            e !== null && e.memoizedState !== null ? (e = wr,
            wr = 16777216,
            fn(A),
            wr = e) : fn(A));
            break;
        default:
            fn(A)
        }
    }
    function Yg(A) {
        var e = A.alternate;
        if (e !== null && (A = e.child,
        A !== null)) {
            e.child = null;
            do
                e = A.sibling,
                A.sibling = null,
                A = e;
            while (A !== null)
        }
    }
    function Cr(A) {
        var e = A.deletions;
        if ((A.flags & 16) !== 0) {
            if (e !== null)
                for (var t = 0; t < e.length; t++) {
                    var r = e[t];
                    ae = r,
                    jg(r, A)
                }
            Yg(A)
        }
        if (A.subtreeFlags & 10256)
            for (A = A.child; A !== null; )
                zg(A),
                A = A.sibling
    }
    function zg(A) {
        switch (A.tag) {
        case 0:
        case 11:
        case 15:
            Cr(A),
            A.flags & 2048 && Yt(9, A, A.return);
            break;
        case 3:
            Cr(A);
            break;
        case 12:
            Cr(A);
            break;
        case 22:
            var e = A.stateNode;
            A.memoizedState !== null && e._visibility & 2 && (A.return === null || A.return.tag !== 13) ? (e._visibility &= -3,
            Pl(A)) : Cr(A);
            break;
        default:
            Cr(A)
        }
    }
    function Pl(A) {
        var e = A.deletions;
        if ((A.flags & 16) !== 0) {
            if (e !== null)
                for (var t = 0; t < e.length; t++) {
                    var r = e[t];
                    ae = r,
                    jg(r, A)
                }
            Yg(A)
        }
        for (A = A.child; A !== null; ) {
            switch (e = A,
            e.tag) {
            case 0:
            case 11:
            case 15:
                Yt(8, e, e.return),
                Pl(e);
                break;
            case 22:
                t = e.stateNode,
                t._visibility & 2 && (t._visibility &= -3,
                Pl(e));
                break;
            default:
                Pl(e)
            }
            A = A.sibling
        }
    }
    function jg(A, e) {
        for (; ae !== null; ) {
            var t = ae;
            switch (t.tag) {
            case 0:
            case 11:
            case 15:
                Yt(8, t, e);
                break;
            case 23:
            case 22:
                if (t.memoizedState !== null && t.memoizedState.cachePool !== null) {
                    var r = t.memoizedState.cachePool.pool;
                    r != null && r.refCount++
                }
                break;
            case 24:
                er(t.memoizedState.cache)
            }
            if (r = t.child,
            r !== null)
                r.return = t,
                ae = r;
            else
                A: for (t = A; ae !== null; ) {
                    r = ae;
                    var s = r.sibling
                      , o = r.return;
                    if (Og(r),
                    r === t) {
                        ae = null;
                        break A
                    }
                    if (s !== null) {
                        s.return = o,
                        ae = s;
                        break A
                    }
                    ae = o
                }
        }
    }
    var lC = {
        getCacheForType: function(A) {
            var e = fe(PA)
              , t = e.data.get(A);
            return t === void 0 && (t = A(),
            e.data.set(A, t)),
            t
        }
    }
      , iC = typeof WeakMap == "function" ? WeakMap : Map
      , bA = 0
      , KA = null
      , QA = null
      , vA = 0
      , HA = 0
      , Ie = null
      , Jt = !1
      , Bn = !1
      , to = !1
      , Ft = 0
      , XA = 0
      , kt = 0
      , xa = 0
      , ao = 0
      , ze = 0
      , gn = 0
      , Ur = null
      , Ee = null
      , no = !1
      , ro = 0
      , $l = 1 / 0
      , Ai = null
      , Zt = null
      , ie = 0
      , qt = null
      , dn = null
      , hn = 0
      , lo = 0
      , io = null
      , Jg = null
      , vr = 0
      , so = null;
    function Ke() {
        if ((bA & 2) !== 0 && vA !== 0)
            return vA & -vA;
        if (K.T !== null) {
            var A = tn;
            return A !== 0 ? A : ho()
        }
        return uf()
    }
    function kg() {
        ze === 0 && (ze = (vA & 536870912) === 0 || pA ? nf() : 536870912);
        var A = Ye.current;
        return A !== null && (A.flags |= 32),
        ze
    }
    function _e(A, e, t) {
        (A === KA && (HA === 2 || HA === 9) || A.cancelPendingCommit !== null) && (Qn(A, 0),
        Wt(A, vA, ze, !1)),
        Nn(A, t),
        ((bA & 2) === 0 || A !== KA) && (A === KA && ((bA & 2) === 0 && (xa |= t),
        XA === 4 && Wt(A, vA, ze, !1)),
        st(A))
    }
    function Zg(A, e, t) {
        if ((bA & 6) !== 0)
            throw Error(l(327));
        var r = !t && (e & 124) === 0 && (e & A.expiredLanes) === 0 || Mn(A, e)
          , s = r ? oC(A, e) : co(A, e, !0)
          , o = r;
        do {
            if (s === 0) {
                Bn && !r && Wt(A, e, 0, !1);
                break
            } else {
                if (t = A.current.alternate,
                o && !sC(t)) {
                    s = co(A, e, !1),
                    o = !1;
                    continue
                }
                if (s === 2) {
                    if (o = e,
                    A.errorRecoveryDisabledLanes & o)
                        var g = 0;
                    else
                        g = A.pendingLanes & -536870913,
                        g = g !== 0 ? g : g & 536870912 ? 536870912 : 0;
                    if (g !== 0) {
                        e = g;
                        A: {
                            var w = A;
                            s = Ur;
                            var y = w.current.memoizedState.isDehydrated;
                            if (y && (Qn(w, g).flags |= 256),
                            g = co(w, g, !1),
                            g !== 2) {
                                if (to && !y) {
                                    w.errorRecoveryDisabledLanes |= o,
                                    xa |= o,
                                    s = 4;
                                    break A
                                }
                                o = Ee,
                                Ee = s,
                                o !== null && (Ee === null ? Ee = o : Ee.push.apply(Ee, o))
                            }
                            s = g
                        }
                        if (o = !1,
                        s !== 2)
                            continue
                    }
                }
                if (s === 1) {
                    Qn(A, 0),
                    Wt(A, e, 0, !0);
                    break
                }
                A: {
                    switch (r = A,
                    o = s,
                    o) {
                    case 0:
                    case 1:
                        throw Error(l(345));
                    case 4:
                        if ((e & 4194048) !== e)
                            break;
                    case 6:
                        Wt(r, e, ze, !Jt);
                        break A;
                    case 2:
                        Ee = null;
                        break;
                    case 3:
                    case 5:
                        break;
                    default:
                        throw Error(l(329))
                    }
                    if ((e & 62914560) === e && (s = ro + 300 - at(),
                    10 < s)) {
                        if (Wt(r, e, ze, !Jt),
                        cl(r, 0, !0) !== 0)
                            break A;
                        r.timeoutHandle = md(qg.bind(null, r, t, Ee, Ai, no, e, ze, xa, gn, Jt, o, 2, -0, 0), s);
                        break A
                    }
                    qg(r, t, Ee, Ai, no, e, ze, xa, gn, Jt, o, 0, -0, 0)
                }
            }
            break
        } while (!0);
        st(A)
    }
    function qg(A, e, t, r, s, o, g, w, y, H, M, G, S, T) {
        if (A.timeoutHandle = -1,
        G = e.subtreeFlags,
        (G & 8192 || (G & 16785408) === 16785408) && (Hr = {
            stylesheets: null,
            count: 0,
            unsuspend: XC
        },
        Xg(e),
        G = zC(),
        G !== null)) {
            A.cancelPendingCommit = G(ad.bind(null, A, e, o, t, r, s, g, w, y, M, 1, S, T)),
            Wt(A, o, g, !H);
            return
        }
        ad(A, e, o, t, r, s, g, w, y)
    }
    function sC(A) {
        for (var e = A; ; ) {
            var t = e.tag;
            if ((t === 0 || t === 11 || t === 15) && e.flags & 16384 && (t = e.updateQueue,
            t !== null && (t = t.stores,
            t !== null)))
                for (var r = 0; r < t.length; r++) {
                    var s = t[r]
                      , o = s.getSnapshot;
                    s = s.value;
                    try {
                        if (!Se(o(), s))
                            return !1
                    } catch {
                        return !1
                    }
                }
            if (t = e.child,
            e.subtreeFlags & 16384 && t !== null)
                t.return = e,
                e = t;
            else {
                if (e === A)
                    break;
                for (; e.sibling === null; ) {
                    if (e.return === null || e.return === A)
                        return !0;
                    e = e.return
                }
                e.sibling.return = e.return,
                e = e.sibling
            }
        }
        return !0
    }
    function Wt(A, e, t, r) {
        e &= ~ao,
        e &= ~xa,
        A.suspendedLanes |= e,
        A.pingedLanes &= ~e,
        r && (A.warmLanes |= e),
        r = A.expirationTimes;
        for (var s = e; 0 < s; ) {
            var o = 31 - xe(s)
              , g = 1 << o;
            r[o] = -1,
            s &= ~g
        }
        t !== 0 && lf(A, t, e)
    }
    function ei() {
        return (bA & 6) === 0 ? (yr(0),
        !1) : !0
    }
    function uo() {
        if (QA !== null) {
            if (HA === 0)
                var A = QA.return;
            else
                A = QA,
                Qt = pa = null,
                Eu(A),
                un = null,
                fr = 0,
                A = QA;
            for (; A !== null; )
                xg(A.alternate, A),
                A = A.return;
            QA = null
        }
    }
    function Qn(A, e) {
        var t = A.timeoutHandle;
        t !== -1 && (A.timeoutHandle = -1,
        EC(t)),
        t = A.cancelPendingCommit,
        t !== null && (A.cancelPendingCommit = null,
        t()),
        uo(),
        KA = A,
        QA = t = gt(A.current, null),
        vA = e,
        HA = 0,
        Ie = null,
        Jt = !1,
        Bn = Mn(A, e),
        to = !1,
        gn = ze = ao = xa = kt = XA = 0,
        Ee = Ur = null,
        no = !1,
        (e & 8) !== 0 && (e |= e & 32);
        var r = A.entangledLanes;
        if (r !== 0)
            for (A = A.entanglements,
            r &= e; 0 < r; ) {
                var s = 31 - xe(r)
                  , o = 1 << s;
                e |= A[s],
                r &= ~o
            }
        return Ft = e,
        pl(),
        t
    }
    function Wg(A, e) {
        dA = null,
        K.H = Vl,
        e === ar || e === Dl ? (e = gB(),
        HA = 3) : e === cB ? (e = gB(),
        HA = 4) : HA = e === dg ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1,
        Ie = e,
        QA === null && (XA = 1,
        Jl(A, Re(e, A.current)))
    }
    function Pg() {
        var A = K.H;
        return K.H = Vl,
        A === null ? Vl : A
    }
    function $g() {
        var A = K.A;
        return K.A = lC,
        A
    }
    function oo() {
        XA = 4,
        Jt || (vA & 4194048) !== vA && Ye.current !== null || (Bn = !0),
        (kt & 134217727) === 0 && (xa & 134217727) === 0 || KA === null || Wt(KA, vA, ze, !1)
    }
    function co(A, e, t) {
        var r = bA;
        bA |= 2;
        var s = Pg()
          , o = $g();
        (KA !== A || vA !== e) && (Ai = null,
        Qn(A, e)),
        e = !1;
        var g = XA;
        A: do
            try {
                if (HA !== 0 && QA !== null) {
                    var w = QA
                      , y = Ie;
                    switch (HA) {
                    case 8:
                        uo(),
                        g = 6;
                        break A;
                    case 3:
                    case 2:
                    case 9:
                    case 6:
                        Ye.current === null && (e = !0);
                        var H = HA;
                        if (HA = 0,
                        Ie = null,
                        wn(A, w, y, H),
                        t && Bn) {
                            g = 0;
                            break A
                        }
                        break;
                    default:
                        H = HA,
                        HA = 0,
                        Ie = null,
                        wn(A, w, y, H)
                    }
                }
                uC(),
                g = XA;
                break
            } catch (M) {
                Wg(A, M)
            }
        while (!0);
        return e && A.shellSuspendCounter++,
        Qt = pa = null,
        bA = r,
        K.H = s,
        K.A = o,
        QA === null && (KA = null,
        vA = 0,
        pl()),
        g
    }
    function uC() {
        for (; QA !== null; )
            Ad(QA)
    }
    function oC(A, e) {
        var t = bA;
        bA |= 2;
        var r = Pg()
          , s = $g();
        KA !== A || vA !== e ? (Ai = null,
        $l = at() + 500,
        Qn(A, e)) : Bn = Mn(A, e);
        A: do
            try {
                if (HA !== 0 && QA !== null) {
                    e = QA;
                    var o = Ie;
                    e: switch (HA) {
                    case 1:
                        HA = 0,
                        Ie = null,
                        wn(A, e, o, 1);
                        break;
                    case 2:
                    case 9:
                        if (fB(o)) {
                            HA = 0,
                            Ie = null,
                            ed(e);
                            break
                        }
                        e = function() {
                            HA !== 2 && HA !== 9 || KA !== A || (HA = 7),
                            st(A)
                        }
                        ,
                        o.then(e, e);
                        break A;
                    case 3:
                        HA = 7;
                        break A;
                    case 4:
                        HA = 5;
                        break A;
                    case 7:
                        fB(o) ? (HA = 0,
                        Ie = null,
                        ed(e)) : (HA = 0,
                        Ie = null,
                        wn(A, e, o, 7));
                        break;
                    case 5:
                        var g = null;
                        switch (QA.tag) {
                        case 26:
                            g = QA.memoizedState;
                        case 5:
                        case 27:
                            var w = QA;
                            if (!g || _d(g)) {
                                HA = 0,
                                Ie = null;
                                var y = w.sibling;
                                if (y !== null)
                                    QA = y;
                                else {
                                    var H = w.return;
                                    H !== null ? (QA = H,
                                    ti(H)) : QA = null
                                }
                                break e
                            }
                        }
                        HA = 0,
                        Ie = null,
                        wn(A, e, o, 5);
                        break;
                    case 6:
                        HA = 0,
                        Ie = null,
                        wn(A, e, o, 6);
                        break;
                    case 8:
                        uo(),
                        XA = 6;
                        break A;
                    default:
                        throw Error(l(462))
                    }
                }
                cC();
                break
            } catch (M) {
                Wg(A, M)
            }
        while (!0);
        return Qt = pa = null,
        K.H = r,
        K.A = s,
        bA = t,
        QA !== null ? 0 : (KA = null,
        vA = 0,
        pl(),
        XA)
    }
    function cC() {
        for (; QA !== null && !LQ(); )
            Ad(QA)
    }
    function Ad(A) {
        var e = bg(A.alternate, A, Ft);
        A.memoizedProps = A.pendingProps,
        e === null ? ti(A) : QA = e
    }
    function ed(A) {
        var e = A
          , t = e.alternate;
        switch (e.tag) {
        case 15:
        case 0:
            e = vg(t, e, e.pendingProps, e.type, void 0, vA);
            break;
        case 11:
            e = vg(t, e, e.pendingProps, e.type.render, e.ref, vA);
            break;
        case 5:
            Eu(e);
        default:
            xg(t, e),
            e = QA = tB(e, Ft),
            e = bg(t, e, Ft)
        }
        A.memoizedProps = A.pendingProps,
        e === null ? ti(A) : QA = e
    }
    function wn(A, e, t, r) {
        Qt = pa = null,
        Eu(e),
        un = null,
        fr = 0;
        var s = e.return;
        try {
            if (AC(A, s, e, t, vA)) {
                XA = 1,
                Jl(A, Re(t, A.current)),
                QA = null;
                return
            }
        } catch (o) {
            if (s !== null)
                throw QA = s,
                o;
            XA = 1,
            Jl(A, Re(t, A.current)),
            QA = null;
            return
        }
        e.flags & 32768 ? (pA || r === 1 ? A = !0 : Bn || (vA & 536870912) !== 0 ? A = !1 : (Jt = A = !0,
        (r === 2 || r === 9 || r === 3 || r === 6) && (r = Ye.current,
        r !== null && r.tag === 13 && (r.flags |= 16384))),
        td(e, A)) : ti(e)
    }
    function ti(A) {
        var e = A;
        do {
            if ((e.flags & 32768) !== 0) {
                td(e, Jt);
                return
            }
            A = e.return;
            var t = tC(e.alternate, e, Ft);
            if (t !== null) {
                QA = t;
                return
            }
            if (e = e.sibling,
            e !== null) {
                QA = e;
                return
            }
            QA = e = A
        } while (e !== null);
        XA === 0 && (XA = 5)
    }
    function td(A, e) {
        do {
            var t = aC(A.alternate, A);
            if (t !== null) {
                t.flags &= 32767,
                QA = t;
                return
            }
            if (t = A.return,
            t !== null && (t.flags |= 32768,
            t.subtreeFlags = 0,
            t.deletions = null),
            !e && (A = A.sibling,
            A !== null)) {
                QA = A;
                return
            }
            QA = A = t
        } while (A !== null);
        XA = 6,
        QA = null
    }
    function ad(A, e, t, r, s, o, g, w, y) {
        A.cancelPendingCommit = null;
        do
            ai();
        while (ie !== 0);
        if ((bA & 6) !== 0)
            throw Error(l(327));
        if (e !== null) {
            if (e === A.current)
                throw Error(l(177));
            if (o = e.lanes | e.childLanes,
            o |= eu,
            XQ(A, t, o, g, w, y),
            A === KA && (QA = KA = null,
            vA = 0),
            dn = e,
            qt = A,
            hn = t,
            lo = o,
            io = s,
            Jg = r,
            (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? (A.callbackNode = null,
            A.callbackPriority = 0,
            dC(sl, function() {
                return sd(),
                null
            })) : (A.callbackNode = null,
            A.callbackPriority = 0),
            r = (e.flags & 13878) !== 0,
            (e.subtreeFlags & 13878) !== 0 || r) {
                r = K.T,
                K.T = null,
                s = j.p,
                j.p = 2,
                g = bA,
                bA |= 4;
                try {
                    nC(A, e, t)
                } finally {
                    bA = g,
                    j.p = s,
                    K.T = r
                }
            }
            ie = 1,
            nd(),
            rd(),
            ld()
        }
    }
    function nd() {
        if (ie === 1) {
            ie = 0;
            var A = qt
              , e = dn
              , t = (e.flags & 13878) !== 0;
            if ((e.subtreeFlags & 13878) !== 0 || t) {
                t = K.T,
                K.T = null;
                var r = j.p;
                j.p = 2;
                var s = bA;
                bA |= 4;
                try {
                    Rg(e, A);
                    var o = mo
                      , g = jf(A.containerInfo)
                      , w = o.focusedElem
                      , y = o.selectionRange;
                    if (g !== w && w && w.ownerDocument && zf(w.ownerDocument.documentElement, w)) {
                        if (y !== null && qs(w)) {
                            var H = y.start
                              , M = y.end;
                            if (M === void 0 && (M = H),
                            "selectionStart"in w)
                                w.selectionStart = H,
                                w.selectionEnd = Math.min(M, w.value.length);
                            else {
                                var G = w.ownerDocument || document
                                  , S = G && G.defaultView || window;
                                if (S.getSelection) {
                                    var T = S.getSelection()
                                      , sA = w.textContent.length
                                      , lA = Math.min(y.start, sA)
                                      , TA = y.end === void 0 ? lA : Math.min(y.end, sA);
                                    !T.extend && lA > TA && (g = TA,
                                    TA = lA,
                                    lA = g);
                                    var E = Yf(w, lA)
                                      , m = Yf(w, TA);
                                    if (E && m && (T.rangeCount !== 1 || T.anchorNode !== E.node || T.anchorOffset !== E.offset || T.focusNode !== m.node || T.focusOffset !== m.offset)) {
                                        var b = G.createRange();
                                        b.setStart(E.node, E.offset),
                                        T.removeAllRanges(),
                                        lA > TA ? (T.addRange(b),
                                        T.extend(m.node, m.offset)) : (b.setEnd(m.node, m.offset),
                                        T.addRange(b))
                                    }
                                }
                            }
                        }
                        for (G = [],
                        T = w; T = T.parentNode; )
                            T.nodeType === 1 && G.push({
                                element: T,
                                left: T.scrollLeft,
                                top: T.scrollTop
                            });
                        for (typeof w.focus == "function" && w.focus(),
                        w = 0; w < G.length; w++) {
                            var N = G[w];
                            N.element.scrollLeft = N.left,
                            N.element.scrollTop = N.top
                        }
                    }
                    di = !!po,
                    mo = po = null
                } finally {
                    bA = s,
                    j.p = r,
                    K.T = t
                }
            }
            A.current = e,
            ie = 2
        }
    }
    function rd() {
        if (ie === 2) {
            ie = 0;
            var A = qt
              , e = dn
              , t = (e.flags & 8772) !== 0;
            if ((e.subtreeFlags & 8772) !== 0 || t) {
                t = K.T,
                K.T = null;
                var r = j.p;
                j.p = 2;
                var s = bA;
                bA |= 4;
                try {
                    _g(A, e.alternate, e)
                } finally {
                    bA = s,
                    j.p = r,
                    K.T = t
                }
            }
            ie = 3
        }
    }
    function ld() {
        if (ie === 4 || ie === 3) {
            ie = 0,
            IQ();
            var A = qt
              , e = dn
              , t = hn
              , r = Jg;
            (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? ie = 5 : (ie = 0,
            dn = qt = null,
            id(A, A.pendingLanes));
            var s = A.pendingLanes;
            if (s === 0 && (Zt = null),
            xs(t),
            e = e.stateNode,
            He && typeof He.onCommitFiberRoot == "function")
                try {
                    He.onCommitFiberRoot(On, e, void 0, (e.current.flags & 128) === 128)
                } catch {}
            if (r !== null) {
                e = K.T,
                s = j.p,
                j.p = 2,
                K.T = null;
                try {
                    for (var o = A.onRecoverableError, g = 0; g < r.length; g++) {
                        var w = r[g];
                        o(w.value, {
                            componentStack: w.stack
                        })
                    }
                } finally {
                    K.T = e,
                    j.p = s
                }
            }
            (hn & 3) !== 0 && ai(),
            st(A),
            s = A.pendingLanes,
            (t & 4194090) !== 0 && (s & 42) !== 0 ? A === so ? vr++ : (vr = 0,
            so = A) : vr = 0,
            yr(0)
        }
    }
    function id(A, e) {
        (A.pooledCacheLanes &= e) === 0 && (e = A.pooledCache,
        e != null && (A.pooledCache = null,
        er(e)))
    }
    function ai(A) {
        return nd(),
        rd(),
        ld(),
        sd()
    }
    function sd() {
        if (ie !== 5)
            return !1;
        var A = qt
          , e = lo;
        lo = 0;
        var t = xs(hn)
          , r = K.T
          , s = j.p;
        try {
            j.p = 32 > t ? 32 : t,
            K.T = null,
            t = io,
            io = null;
            var o = qt
              , g = hn;
            if (ie = 0,
            dn = qt = null,
            hn = 0,
            (bA & 6) !== 0)
                throw Error(l(331));
            var w = bA;
            if (bA |= 4,
            zg(o.current),
            Vg(o, o.current, g, t),
            bA = w,
            yr(0, !1),
            He && typeof He.onPostCommitFiberRoot == "function")
                try {
                    He.onPostCommitFiberRoot(On, o)
                } catch {}
            return !0
        } finally {
            j.p = s,
            K.T = r,
            id(A, e)
        }
    }
    function ud(A, e, t) {
        e = Re(t, e),
        e = Ru(A.stateNode, e, 2),
        A = Rt(A, e, 2),
        A !== null && (Nn(A, 2),
        st(A))
    }
    function IA(A, e, t) {
        if (A.tag === 3)
            ud(A, A, t);
        else
            for (; e !== null; ) {
                if (e.tag === 3) {
                    ud(e, A, t);
                    break
                } else if (e.tag === 1) {
                    var r = e.stateNode;
                    if (typeof e.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Zt === null || !Zt.has(r))) {
                        A = Re(t, A),
                        t = Bg(2),
                        r = Rt(e, t, 2),
                        r !== null && (gg(t, r, e, A),
                        Nn(r, 2),
                        st(r));
                        break
                    }
                }
                e = e.return
            }
    }
    function fo(A, e, t) {
        var r = A.pingCache;
        if (r === null) {
            r = A.pingCache = new iC;
            var s = new Set;
            r.set(e, s)
        } else
            s = r.get(e),
            s === void 0 && (s = new Set,
            r.set(e, s));
        s.has(t) || (to = !0,
        s.add(t),
        A = fC.bind(null, A, e, t),
        e.then(A, A))
    }
    function fC(A, e, t) {
        var r = A.pingCache;
        r !== null && r.delete(e),
        A.pingedLanes |= A.suspendedLanes & t,
        A.warmLanes &= ~t,
        KA === A && (vA & t) === t && (XA === 4 || XA === 3 && (vA & 62914560) === vA && 300 > at() - ro ? (bA & 2) === 0 && Qn(A, 0) : ao |= t,
        gn === vA && (gn = 0)),
        st(A)
    }
    function od(A, e) {
        e === 0 && (e = rf()),
        A = Pa(A, e),
        A !== null && (Nn(A, e),
        st(A))
    }
    function BC(A) {
        var e = A.memoizedState
          , t = 0;
        e !== null && (t = e.retryLane),
        od(A, t)
    }
    function gC(A, e) {
        var t = 0;
        switch (A.tag) {
        case 13:
            var r = A.stateNode
              , s = A.memoizedState;
            s !== null && (t = s.retryLane);
            break;
        case 19:
            r = A.stateNode;
            break;
        case 22:
            r = A.stateNode._retryCache;
            break;
        default:
            throw Error(l(314))
        }
        r !== null && r.delete(e),
        od(A, t)
    }
    function dC(A, e) {
        return Fs(A, e)
    }
    var ni = null
      , Cn = null
      , Bo = !1
      , ri = !1
      , go = !1
      , Sa = 0;
    function st(A) {
        A !== Cn && A.next === null && (Cn === null ? ni = Cn = A : Cn = Cn.next = A),
        ri = !0,
        Bo || (Bo = !0,
        QC())
    }
    function yr(A, e) {
        if (!go && ri) {
            go = !0;
            do
                for (var t = !1, r = ni; r !== null; ) {
                    if (A !== 0) {
                        var s = r.pendingLanes;
                        if (s === 0)
                            var o = 0;
                        else {
                            var g = r.suspendedLanes
                              , w = r.pingedLanes;
                            o = (1 << 31 - xe(42 | A) + 1) - 1,
                            o &= s & ~(g & ~w),
                            o = o & 201326741 ? o & 201326741 | 1 : o ? o | 2 : 0
                        }
                        o !== 0 && (t = !0,
                        gd(r, o))
                    } else
                        o = vA,
                        o = cl(r, r === KA ? o : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1),
                        (o & 3) === 0 || Mn(r, o) || (t = !0,
                        gd(r, o));
                    r = r.next
                }
            while (t);
            go = !1
        }
    }
    function hC() {
        cd()
    }
    function cd() {
        ri = Bo = !1;
        var A = 0;
        Sa !== 0 && (FC() && (A = Sa),
        Sa = 0);
        for (var e = at(), t = null, r = ni; r !== null; ) {
            var s = r.next
              , o = fd(r, e);
            o === 0 ? (r.next = null,
            t === null ? ni = s : t.next = s,
            s === null && (Cn = t)) : (t = r,
            (A !== 0 || (o & 3) !== 0) && (ri = !0)),
            r = s
        }
        yr(A)
    }
    function fd(A, e) {
        for (var t = A.suspendedLanes, r = A.pingedLanes, s = A.expirationTimes, o = A.pendingLanes & -62914561; 0 < o; ) {
            var g = 31 - xe(o)
              , w = 1 << g
              , y = s[g];
            y === -1 ? ((w & t) === 0 || (w & r) !== 0) && (s[g] = VQ(w, e)) : y <= e && (A.expiredLanes |= w),
            o &= ~w
        }
        if (e = KA,
        t = vA,
        t = cl(A, A === e ? t : 0, A.cancelPendingCommit !== null || A.timeoutHandle !== -1),
        r = A.callbackNode,
        t === 0 || A === e && (HA === 2 || HA === 9) || A.cancelPendingCommit !== null)
            return r !== null && r !== null && Es(r),
            A.callbackNode = null,
            A.callbackPriority = 0;
        if ((t & 3) === 0 || Mn(A, t)) {
            if (e = t & -t,
            e === A.callbackPriority)
                return e;
            switch (r !== null && Es(r),
            xs(t)) {
            case 2:
            case 8:
                t = tf;
                break;
            case 32:
                t = sl;
                break;
            case 268435456:
                t = af;
                break;
            default:
                t = sl
            }
            return r = Bd.bind(null, A),
            t = Fs(t, r),
            A.callbackPriority = e,
            A.callbackNode = t,
            e
        }
        return r !== null && r !== null && Es(r),
        A.callbackPriority = 2,
        A.callbackNode = null,
        2
    }
    function Bd(A, e) {
        if (ie !== 0 && ie !== 5)
            return A.callbackNode = null,
            A.callbackPriority = 0,
            null;
        var t = A.callbackNode;
        if (ai() && A.callbackNode !== t)
            return null;
        var r = vA;
        return r = cl(A, A === KA ? r : 0, A.cancelPendingCommit !== null || A.timeoutHandle !== -1),
        r === 0 ? null : (Zg(A, r, e),
        fd(A, at()),
        A.callbackNode != null && A.callbackNode === t ? Bd.bind(null, A) : null)
    }
    function gd(A, e) {
        if (ai())
            return null;
        Zg(A, e, !0)
    }
    function QC() {
        bC(function() {
            (bA & 6) !== 0 ? Fs(ef, hC) : cd()
        })
    }
    function ho() {
        return Sa === 0 && (Sa = nf()),
        Sa
    }
    function dd(A) {
        return A == null || typeof A == "symbol" || typeof A == "boolean" ? null : typeof A == "function" ? A : hl("" + A)
    }
    function hd(A, e) {
        var t = e.ownerDocument.createElement("input");
        return t.name = e.name,
        t.value = e.value,
        A.id && t.setAttribute("form", A.id),
        e.parentNode.insertBefore(t, e),
        A = new FormData(A),
        t.parentNode.removeChild(t),
        A
    }
    function wC(A, e, t, r, s) {
        if (e === "submit" && t && t.stateNode === s) {
            var o = dd((s[ye] || null).action)
              , g = r.submitter;
            g && (e = (e = g[ye] || null) ? dd(e.formAction) : g.getAttribute("formAction"),
            e !== null && (o = e,
            g = null));
            var w = new Ul("action","action",null,r,s);
            A.push({
                event: w,
                listeners: [{
                    instance: null,
                    listener: function() {
                        if (r.defaultPrevented) {
                            if (Sa !== 0) {
                                var y = g ? hd(s, g) : new FormData(s);
                                Ku(t, {
                                    pending: !0,
                                    data: y,
                                    method: s.method,
                                    action: o
                                }, null, y)
                            }
                        } else
                            typeof o == "function" && (w.preventDefault(),
                            y = g ? hd(s, g) : new FormData(s),
                            Ku(t, {
                                pending: !0,
                                data: y,
                                method: s.method,
                                action: o
                            }, o, y))
                    },
                    currentTarget: s
                }]
            })
        }
    }
    for (var Qo = 0; Qo < Au.length; Qo++) {
        var wo = Au[Qo]
          , CC = wo.toLowerCase()
          , UC = wo[0].toUpperCase() + wo.slice(1);
        We(CC, "on" + UC)
    }
    We(Zf, "onAnimationEnd"),
    We(qf, "onAnimationIteration"),
    We(Wf, "onAnimationStart"),
    We("dblclick", "onDoubleClick"),
    We("focusin", "onFocus"),
    We("focusout", "onBlur"),
    We(Ow, "onTransitionRun"),
    We(Mw, "onTransitionStart"),
    We(Nw, "onTransitionCancel"),
    We(Pf, "onTransitionEnd"),
    Va("onMouseEnter", ["mouseout", "mouseover"]),
    Va("onMouseLeave", ["mouseout", "mouseover"]),
    Va("onPointerEnter", ["pointerout", "pointerover"]),
    Va("onPointerLeave", ["pointerout", "pointerover"]),
    ga("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
    ga("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),
    ga("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    ga("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
    ga("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")),
    ga("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var pr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ")
      , vC = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(pr));
    function Qd(A, e) {
        e = (e & 4) !== 0;
        for (var t = 0; t < A.length; t++) {
            var r = A[t]
              , s = r.event;
            r = r.listeners;
            A: {
                var o = void 0;
                if (e)
                    for (var g = r.length - 1; 0 <= g; g--) {
                        var w = r[g]
                          , y = w.instance
                          , H = w.currentTarget;
                        if (w = w.listener,
                        y !== o && s.isPropagationStopped())
                            break A;
                        o = w,
                        s.currentTarget = H;
                        try {
                            o(s)
                        } catch (M) {
                            jl(M)
                        }
                        s.currentTarget = null,
                        o = y
                    }
                else
                    for (g = 0; g < r.length; g++) {
                        if (w = r[g],
                        y = w.instance,
                        H = w.currentTarget,
                        w = w.listener,
                        y !== o && s.isPropagationStopped())
                            break A;
                        o = w,
                        s.currentTarget = H;
                        try {
                            o(s)
                        } catch (M) {
                            jl(M)
                        }
                        s.currentTarget = null,
                        o = y
                    }
            }
        }
    }
    function wA(A, e) {
        var t = e[Ss];
        t === void 0 && (t = e[Ss] = new Set);
        var r = A + "__bubble";
        t.has(r) || (wd(e, A, 2, !1),
        t.add(r))
    }
    function Co(A, e, t) {
        var r = 0;
        e && (r |= 4),
        wd(t, A, r, e)
    }
    var li = "_reactListening" + Math.random().toString(36).slice(2);
    function Uo(A) {
        if (!A[li]) {
            A[li] = !0,
            cf.forEach(function(t) {
                t !== "selectionchange" && (vC.has(t) || Co(t, !1, A),
                Co(t, !0, A))
            });
            var e = A.nodeType === 9 ? A : A.ownerDocument;
            e === null || e[li] || (e[li] = !0,
            Co("selectionchange", !1, e))
        }
    }
    function wd(A, e, t, r) {
        switch (Vd(e)) {
        case 2:
            var s = kC;
            break;
        case 8:
            s = ZC;
            break;
        default:
            s = Io
        }
        t = s.bind(null, e, t, A),
        s = void 0,
        !Gs || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (s = !0),
        r ? s !== void 0 ? A.addEventListener(e, t, {
            capture: !0,
            passive: s
        }) : A.addEventListener(e, t, !0) : s !== void 0 ? A.addEventListener(e, t, {
            passive: s
        }) : A.addEventListener(e, t, !1)
    }
    function vo(A, e, t, r, s) {
        var o = r;
        if ((e & 1) === 0 && (e & 2) === 0 && r !== null)
            A: for (; ; ) {
                if (r === null)
                    return;
                var g = r.tag;
                if (g === 3 || g === 4) {
                    var w = r.stateNode.containerInfo;
                    if (w === s)
                        break;
                    if (g === 4)
                        for (g = r.return; g !== null; ) {
                            var y = g.tag;
                            if ((y === 3 || y === 4) && g.stateNode.containerInfo === s)
                                return;
                            g = g.return
                        }
                    for (; w !== null; ) {
                        if (g = Na(w),
                        g === null)
                            return;
                        if (y = g.tag,
                        y === 5 || y === 6 || y === 26 || y === 27) {
                            r = o = g;
                            continue A
                        }
                        w = w.parentNode
                    }
                }
                r = r.return
            }
        Ff(function() {
            var H = o
              , M = Ns(t)
              , G = [];
            A: {
                var S = $f.get(A);
                if (S !== void 0) {
                    var T = Ul
                      , sA = A;
                    switch (A) {
                    case "keypress":
                        if (wl(t) === 0)
                            break A;
                    case "keydown":
                    case "keyup":
                        T = dw;
                        break;
                    case "focusin":
                        sA = "focus",
                        T = zs;
                        break;
                    case "focusout":
                        sA = "blur",
                        T = zs;
                        break;
                    case "beforeblur":
                    case "afterblur":
                        T = zs;
                        break;
                    case "click":
                        if (t.button === 2)
                            break A;
                    case "auxclick":
                    case "dblclick":
                    case "mousedown":
                    case "mousemove":
                    case "mouseup":
                    case "mouseout":
                    case "mouseover":
                    case "contextmenu":
                        T = Hf;
                        break;
                    case "drag":
                    case "dragend":
                    case "dragenter":
                    case "dragexit":
                    case "dragleave":
                    case "dragover":
                    case "dragstart":
                    case "drop":
                        T = aw;
                        break;
                    case "touchcancel":
                    case "touchend":
                    case "touchmove":
                    case "touchstart":
                        T = ww;
                        break;
                    case Zf:
                    case qf:
                    case Wf:
                        T = lw;
                        break;
                    case Pf:
                        T = Uw;
                        break;
                    case "scroll":
                    case "scrollend":
                        T = ew;
                        break;
                    case "wheel":
                        T = yw;
                        break;
                    case "copy":
                    case "cut":
                    case "paste":
                        T = sw;
                        break;
                    case "gotpointercapture":
                    case "lostpointercapture":
                    case "pointercancel":
                    case "pointerdown":
                    case "pointermove":
                    case "pointerout":
                    case "pointerover":
                    case "pointerup":
                        T = Sf;
                        break;
                    case "toggle":
                    case "beforetoggle":
                        T = mw
                    }
                    var lA = (e & 4) !== 0
                      , TA = !lA && (A === "scroll" || A === "scrollend")
                      , E = lA ? S !== null ? S + "Capture" : null : S;
                    lA = [];
                    for (var m = H, b; m !== null; ) {
                        var N = m;
                        if (b = N.stateNode,
                        N = N.tag,
                        N !== 5 && N !== 26 && N !== 27 || b === null || E === null || (N = Vn(m, E),
                        N != null && lA.push(mr(m, N, b))),
                        TA)
                            break;
                        m = m.return
                    }
                    0 < lA.length && (S = new T(S,sA,null,t,M),
                    G.push({
                        event: S,
                        listeners: lA
                    }))
                }
            }
            if ((e & 7) === 0) {
                A: {
                    if (S = A === "mouseover" || A === "pointerover",
                    T = A === "mouseout" || A === "pointerout",
                    S && t !== Ms && (sA = t.relatedTarget || t.fromElement) && (Na(sA) || sA[Ma]))
                        break A;
                    if ((T || S) && (S = M.window === M ? M : (S = M.ownerDocument) ? S.defaultView || S.parentWindow : window,
                    T ? (sA = t.relatedTarget || t.toElement,
                    T = H,
                    sA = sA ? Na(sA) : null,
                    sA !== null && (TA = c(sA),
                    lA = sA.tag,
                    sA !== TA || lA !== 5 && lA !== 27 && lA !== 6) && (sA = null)) : (T = null,
                    sA = H),
                    T !== sA)) {
                        if (lA = Hf,
                        N = "onMouseLeave",
                        E = "onMouseEnter",
                        m = "mouse",
                        (A === "pointerout" || A === "pointerover") && (lA = Sf,
                        N = "onPointerLeave",
                        E = "onPointerEnter",
                        m = "pointer"),
                        TA = T == null ? S : Gn(T),
                        b = sA == null ? S : Gn(sA),
                        S = new lA(N,m + "leave",T,t,M),
                        S.target = TA,
                        S.relatedTarget = b,
                        N = null,
                        Na(M) === H && (lA = new lA(E,m + "enter",sA,t,M),
                        lA.target = b,
                        lA.relatedTarget = TA,
                        N = lA),
                        TA = N,
                        T && sA)
                            e: {
                                for (lA = T,
                                E = sA,
                                m = 0,
                                b = lA; b; b = Un(b))
                                    m++;
                                for (b = 0,
                                N = E; N; N = Un(N))
                                    b++;
                                for (; 0 < m - b; )
                                    lA = Un(lA),
                                    m--;
                                for (; 0 < b - m; )
                                    E = Un(E),
                                    b--;
                                for (; m--; ) {
                                    if (lA === E || E !== null && lA === E.alternate)
                                        break e;
                                    lA = Un(lA),
                                    E = Un(E)
                                }
                                lA = null
                            }
                        else
                            lA = null;
                        T !== null && Cd(G, S, T, lA, !1),
                        sA !== null && TA !== null && Cd(G, TA, sA, lA, !0)
                    }
                }
                A: {
                    if (S = H ? Gn(H) : window,
                    T = S.nodeName && S.nodeName.toLowerCase(),
                    T === "select" || T === "input" && S.type === "file")
                        var eA = Mf;
                    else if (_f(S))
                        if (Nf)
                            eA = Iw;
                        else {
                            eA = Dw;
                            var hA = Tw
                        }
                    else
                        T = S.nodeName,
                        !T || T.toLowerCase() !== "input" || S.type !== "checkbox" && S.type !== "radio" ? H && Os(H.elementType) && (eA = Mf) : eA = Lw;
                    if (eA && (eA = eA(A, H))) {
                        Of(G, eA, t, M);
                        break A
                    }
                    hA && hA(A, S, H),
                    A === "focusout" && H && S.type === "number" && H.memoizedProps.value != null && _s(S, "number", S.value)
                }
                switch (hA = H ? Gn(H) : window,
                A) {
                case "focusin":
                    (_f(hA) || hA.contentEditable === "true") && (Za = hA,
                    Ws = H,
                    qn = null);
                    break;
                case "focusout":
                    qn = Ws = Za = null;
                    break;
                case "mousedown":
                    Ps = !0;
                    break;
                case "contextmenu":
                case "mouseup":
                case "dragend":
                    Ps = !1,
                    Jf(G, t, M);
                    break;
                case "selectionchange":
                    if (_w)
                        break;
                case "keydown":
                case "keyup":
                    Jf(G, t, M)
                }
                var aA;
                if (Js)
                    A: {
                        switch (A) {
                        case "compositionstart":
                            var iA = "onCompositionStart";
                            break A;
                        case "compositionend":
                            iA = "onCompositionEnd";
                            break A;
                        case "compositionupdate":
                            iA = "onCompositionUpdate";
                            break A
                        }
                        iA = void 0
                    }
                else
                    ka ? If(A, t) && (iA = "onCompositionEnd") : A === "keydown" && t.keyCode === 229 && (iA = "onCompositionStart");
                iA && (Tf && t.locale !== "ko" && (ka || iA !== "onCompositionStart" ? iA === "onCompositionEnd" && ka && (aA = Ef()) : (_t = M,
                Vs = "value"in _t ? _t.value : _t.textContent,
                ka = !0)),
                hA = ii(H, iA),
                0 < hA.length && (iA = new xf(iA,A,null,t,M),
                G.push({
                    event: iA,
                    listeners: hA
                }),
                aA ? iA.data = aA : (aA = Kf(t),
                aA !== null && (iA.data = aA)))),
                (aA = Ew ? bw(A, t) : Hw(A, t)) && (iA = ii(H, "onBeforeInput"),
                0 < iA.length && (hA = new xf("onBeforeInput","beforeinput",null,t,M),
                G.push({
                    event: hA,
                    listeners: iA
                }),
                hA.data = aA)),
                wC(G, A, H, t, M)
            }
            Qd(G, e)
        })
    }
    function mr(A, e, t) {
        return {
            instance: A,
            listener: e,
            currentTarget: t
        }
    }
    function ii(A, e) {
        for (var t = e + "Capture", r = []; A !== null; ) {
            var s = A
              , o = s.stateNode;
            if (s = s.tag,
            s !== 5 && s !== 26 && s !== 27 || o === null || (s = Vn(A, t),
            s != null && r.unshift(mr(A, s, o)),
            s = Vn(A, e),
            s != null && r.push(mr(A, s, o))),
            A.tag === 3)
                return r;
            A = A.return
        }
        return []
    }
    function Un(A) {
        if (A === null)
            return null;
        do
            A = A.return;
        while (A && A.tag !== 5 && A.tag !== 27);
        return A || null
    }
    function Cd(A, e, t, r, s) {
        for (var o = e._reactName, g = []; t !== null && t !== r; ) {
            var w = t
              , y = w.alternate
              , H = w.stateNode;
            if (w = w.tag,
            y !== null && y === r)
                break;
            w !== 5 && w !== 26 && w !== 27 || H === null || (y = H,
            s ? (H = Vn(t, o),
            H != null && g.unshift(mr(t, H, y))) : s || (H = Vn(t, o),
            H != null && g.push(mr(t, H, y)))),
            t = t.return
        }
        g.length !== 0 && A.push({
            event: e,
            listeners: g
        })
    }
    var yC = /\r\n?/g
      , pC = /\u0000|\uFFFD/g;
    function Ud(A) {
        return (typeof A == "string" ? A : "" + A).replace(yC, `
`).replace(pC, "")
    }
    function vd(A, e) {
        return e = Ud(e),
        Ud(A) === e
    }
    function si() {}
    function SA(A, e, t, r, s, o) {
        switch (t) {
        case "children":
            typeof r == "string" ? e === "body" || e === "textarea" && r === "" || za(A, r) : (typeof r == "number" || typeof r == "bigint") && e !== "body" && za(A, "" + r);
            break;
        case "className":
            Bl(A, "class", r);
            break;
        case "tabIndex":
            Bl(A, "tabindex", r);
            break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
            Bl(A, t, r);
            break;
        case "style":
            pf(A, r, o);
            break;
        case "data":
            if (e !== "object") {
                Bl(A, "data", r);
                break
            }
        case "src":
        case "href":
            if (r === "" && (e !== "a" || t !== "href")) {
                A.removeAttribute(t);
                break
            }
            if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
                A.removeAttribute(t);
                break
            }
            r = hl("" + r),
            A.setAttribute(t, r);
            break;
        case "action":
        case "formAction":
            if (typeof r == "function") {
                A.setAttribute(t, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
                break
            } else
                typeof o == "function" && (t === "formAction" ? (e !== "input" && SA(A, e, "name", s.name, s, null),
                SA(A, e, "formEncType", s.formEncType, s, null),
                SA(A, e, "formMethod", s.formMethod, s, null),
                SA(A, e, "formTarget", s.formTarget, s, null)) : (SA(A, e, "encType", s.encType, s, null),
                SA(A, e, "method", s.method, s, null),
                SA(A, e, "target", s.target, s, null)));
            if (r == null || typeof r == "symbol" || typeof r == "boolean") {
                A.removeAttribute(t);
                break
            }
            r = hl("" + r),
            A.setAttribute(t, r);
            break;
        case "onClick":
            r != null && (A.onclick = si);
            break;
        case "onScroll":
            r != null && wA("scroll", A);
            break;
        case "onScrollEnd":
            r != null && wA("scrollend", A);
            break;
        case "dangerouslySetInnerHTML":
            if (r != null) {
                if (typeof r != "object" || !("__html"in r))
                    throw Error(l(61));
                if (t = r.__html,
                t != null) {
                    if (s.children != null)
                        throw Error(l(60));
                    A.innerHTML = t
                }
            }
            break;
        case "multiple":
            A.multiple = r && typeof r != "function" && typeof r != "symbol";
            break;
        case "muted":
            A.muted = r && typeof r != "function" && typeof r != "symbol";
            break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
            break;
        case "autoFocus":
            break;
        case "xlinkHref":
            if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
                A.removeAttribute("xlink:href");
                break
            }
            t = hl("" + r),
            A.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", t);
            break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
            r != null && typeof r != "function" && typeof r != "symbol" ? A.setAttribute(t, "" + r) : A.removeAttribute(t);
            break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
            r && typeof r != "function" && typeof r != "symbol" ? A.setAttribute(t, "") : A.removeAttribute(t);
            break;
        case "capture":
        case "download":
            r === !0 ? A.setAttribute(t, "") : r !== !1 && r != null && typeof r != "function" && typeof r != "symbol" ? A.setAttribute(t, r) : A.removeAttribute(t);
            break;
        case "cols":
        case "rows":
        case "size":
        case "span":
            r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? A.setAttribute(t, r) : A.removeAttribute(t);
            break;
        case "rowSpan":
        case "start":
            r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? A.removeAttribute(t) : A.setAttribute(t, r);
            break;
        case "popover":
            wA("beforetoggle", A),
            wA("toggle", A),
            fl(A, "popover", r);
            break;
        case "xlinkActuate":
            ft(A, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
            break;
        case "xlinkArcrole":
            ft(A, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
            break;
        case "xlinkRole":
            ft(A, "http://www.w3.org/1999/xlink", "xlink:role", r);
            break;
        case "xlinkShow":
            ft(A, "http://www.w3.org/1999/xlink", "xlink:show", r);
            break;
        case "xlinkTitle":
            ft(A, "http://www.w3.org/1999/xlink", "xlink:title", r);
            break;
        case "xlinkType":
            ft(A, "http://www.w3.org/1999/xlink", "xlink:type", r);
            break;
        case "xmlBase":
            ft(A, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
            break;
        case "xmlLang":
            ft(A, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
            break;
        case "xmlSpace":
            ft(A, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
            break;
        case "is":
            fl(A, "is", r);
            break;
        case "innerText":
        case "textContent":
            break;
        default:
            (!(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (t = $Q.get(t) || t,
            fl(A, t, r))
        }
    }
    function yo(A, e, t, r, s, o) {
        switch (t) {
        case "style":
            pf(A, r, o);
            break;
        case "dangerouslySetInnerHTML":
            if (r != null) {
                if (typeof r != "object" || !("__html"in r))
                    throw Error(l(61));
                if (t = r.__html,
                t != null) {
                    if (s.children != null)
                        throw Error(l(60));
                    A.innerHTML = t
                }
            }
            break;
        case "children":
            typeof r == "string" ? za(A, r) : (typeof r == "number" || typeof r == "bigint") && za(A, "" + r);
            break;
        case "onScroll":
            r != null && wA("scroll", A);
            break;
        case "onScrollEnd":
            r != null && wA("scrollend", A);
            break;
        case "onClick":
            r != null && (A.onclick = si);
            break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
            break;
        case "innerText":
        case "textContent":
            break;
        default:
            if (!ff.hasOwnProperty(t))
                A: {
                    if (t[0] === "o" && t[1] === "n" && (s = t.endsWith("Capture"),
                    e = t.slice(2, s ? t.length - 7 : void 0),
                    o = A[ye] || null,
                    o = o != null ? o[t] : null,
                    typeof o == "function" && A.removeEventListener(e, o, s),
                    typeof r == "function")) {
                        typeof o != "function" && o !== null && (t in A ? A[t] = null : A.hasAttribute(t) && A.removeAttribute(t)),
                        A.addEventListener(e, r, s);
                        break A
                    }
                    t in A ? A[t] = r : r === !0 ? A.setAttribute(t, "") : fl(A, t, r)
                }
        }
    }
    function se(A, e, t) {
        switch (e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
            break;
        case "img":
            wA("error", A),
            wA("load", A);
            var r = !1, s = !1, o;
            for (o in t)
                if (t.hasOwnProperty(o)) {
                    var g = t[o];
                    if (g != null)
                        switch (o) {
                        case "src":
                            r = !0;
                            break;
                        case "srcSet":
                            s = !0;
                            break;
                        case "children":
                        case "dangerouslySetInnerHTML":
                            throw Error(l(137, e));
                        default:
                            SA(A, e, o, g, t, null)
                        }
                }
            s && SA(A, e, "srcSet", t.srcSet, t, null),
            r && SA(A, e, "src", t.src, t, null);
            return;
        case "input":
            wA("invalid", A);
            var w = o = g = s = null
              , y = null
              , H = null;
            for (r in t)
                if (t.hasOwnProperty(r)) {
                    var M = t[r];
                    if (M != null)
                        switch (r) {
                        case "name":
                            s = M;
                            break;
                        case "type":
                            g = M;
                            break;
                        case "checked":
                            y = M;
                            break;
                        case "defaultChecked":
                            H = M;
                            break;
                        case "value":
                            o = M;
                            break;
                        case "defaultValue":
                            w = M;
                            break;
                        case "children":
                        case "dangerouslySetInnerHTML":
                            if (M != null)
                                throw Error(l(137, e));
                            break;
                        default:
                            SA(A, e, r, M, t, null)
                        }
                }
            Cf(A, o, w, y, H, g, s, !1),
            gl(A);
            return;
        case "select":
            wA("invalid", A),
            r = g = o = null;
            for (s in t)
                if (t.hasOwnProperty(s) && (w = t[s],
                w != null))
                    switch (s) {
                    case "value":
                        o = w;
                        break;
                    case "defaultValue":
                        g = w;
                        break;
                    case "multiple":
                        r = w;
                    default:
                        SA(A, e, s, w, t, null)
                    }
            e = o,
            t = g,
            A.multiple = !!r,
            e != null ? Ya(A, !!r, e, !1) : t != null && Ya(A, !!r, t, !0);
            return;
        case "textarea":
            wA("invalid", A),
            o = s = r = null;
            for (g in t)
                if (t.hasOwnProperty(g) && (w = t[g],
                w != null))
                    switch (g) {
                    case "value":
                        r = w;
                        break;
                    case "defaultValue":
                        s = w;
                        break;
                    case "children":
                        o = w;
                        break;
                    case "dangerouslySetInnerHTML":
                        if (w != null)
                            throw Error(l(91));
                        break;
                    default:
                        SA(A, e, g, w, t, null)
                    }
            vf(A, r, s, o),
            gl(A);
            return;
        case "option":
            for (y in t)
                if (t.hasOwnProperty(y) && (r = t[y],
                r != null))
                    switch (y) {
                    case "selected":
                        A.selected = r && typeof r != "function" && typeof r != "symbol";
                        break;
                    default:
                        SA(A, e, y, r, t, null)
                    }
            return;
        case "dialog":
            wA("beforetoggle", A),
            wA("toggle", A),
            wA("cancel", A),
            wA("close", A);
            break;
        case "iframe":
        case "object":
            wA("load", A);
            break;
        case "video":
        case "audio":
            for (r = 0; r < pr.length; r++)
                wA(pr[r], A);
            break;
        case "image":
            wA("error", A),
            wA("load", A);
            break;
        case "details":
            wA("toggle", A);
            break;
        case "embed":
        case "source":
        case "link":
            wA("error", A),
            wA("load", A);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
            for (H in t)
                if (t.hasOwnProperty(H) && (r = t[H],
                r != null))
                    switch (H) {
                    case "children":
                    case "dangerouslySetInnerHTML":
                        throw Error(l(137, e));
                    default:
                        SA(A, e, H, r, t, null)
                    }
            return;
        default:
            if (Os(e)) {
                for (M in t)
                    t.hasOwnProperty(M) && (r = t[M],
                    r !== void 0 && yo(A, e, M, r, t, void 0));
                return
            }
        }
        for (w in t)
            t.hasOwnProperty(w) && (r = t[w],
            r != null && SA(A, e, w, r, t, null))
    }
    function mC(A, e, t, r) {
        switch (e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
            break;
        case "input":
            var s = null
              , o = null
              , g = null
              , w = null
              , y = null
              , H = null
              , M = null;
            for (T in t) {
                var G = t[T];
                if (t.hasOwnProperty(T) && G != null)
                    switch (T) {
                    case "checked":
                        break;
                    case "value":
                        break;
                    case "defaultValue":
                        y = G;
                    default:
                        r.hasOwnProperty(T) || SA(A, e, T, null, r, G)
                    }
            }
            for (var S in r) {
                var T = r[S];
                if (G = t[S],
                r.hasOwnProperty(S) && (T != null || G != null))
                    switch (S) {
                    case "type":
                        o = T;
                        break;
                    case "name":
                        s = T;
                        break;
                    case "checked":
                        H = T;
                        break;
                    case "defaultChecked":
                        M = T;
                        break;
                    case "value":
                        g = T;
                        break;
                    case "defaultValue":
                        w = T;
                        break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                        if (T != null)
                            throw Error(l(137, e));
                        break;
                    default:
                        T !== G && SA(A, e, S, T, r, G)
                    }
            }
            Ks(A, g, w, y, H, M, o, s);
            return;
        case "select":
            T = g = w = S = null;
            for (o in t)
                if (y = t[o],
                t.hasOwnProperty(o) && y != null)
                    switch (o) {
                    case "value":
                        break;
                    case "multiple":
                        T = y;
                    default:
                        r.hasOwnProperty(o) || SA(A, e, o, null, r, y)
                    }
            for (s in r)
                if (o = r[s],
                y = t[s],
                r.hasOwnProperty(s) && (o != null || y != null))
                    switch (s) {
                    case "value":
                        S = o;
                        break;
                    case "defaultValue":
                        w = o;
                        break;
                    case "multiple":
                        g = o;
                    default:
                        o !== y && SA(A, e, s, o, r, y)
                    }
            e = w,
            t = g,
            r = T,
            S != null ? Ya(A, !!t, S, !1) : !!r != !!t && (e != null ? Ya(A, !!t, e, !0) : Ya(A, !!t, t ? [] : "", !1));
            return;
        case "textarea":
            T = S = null;
            for (w in t)
                if (s = t[w],
                t.hasOwnProperty(w) && s != null && !r.hasOwnProperty(w))
                    switch (w) {
                    case "value":
                        break;
                    case "children":
                        break;
                    default:
                        SA(A, e, w, null, r, s)
                    }
            for (g in r)
                if (s = r[g],
                o = t[g],
                r.hasOwnProperty(g) && (s != null || o != null))
                    switch (g) {
                    case "value":
                        S = s;
                        break;
                    case "defaultValue":
                        T = s;
                        break;
                    case "children":
                        break;
                    case "dangerouslySetInnerHTML":
                        if (s != null)
                            throw Error(l(91));
                        break;
                    default:
                        s !== o && SA(A, e, g, s, r, o)
                    }
            Uf(A, S, T);
            return;
        case "option":
            for (var sA in t)
                if (S = t[sA],
                t.hasOwnProperty(sA) && S != null && !r.hasOwnProperty(sA))
                    switch (sA) {
                    case "selected":
                        A.selected = !1;
                        break;
                    default:
                        SA(A, e, sA, null, r, S)
                    }
            for (y in r)
                if (S = r[y],
                T = t[y],
                r.hasOwnProperty(y) && S !== T && (S != null || T != null))
                    switch (y) {
                    case "selected":
                        A.selected = S && typeof S != "function" && typeof S != "symbol";
                        break;
                    default:
                        SA(A, e, y, S, r, T)
                    }
            return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
            for (var lA in t)
                S = t[lA],
                t.hasOwnProperty(lA) && S != null && !r.hasOwnProperty(lA) && SA(A, e, lA, null, r, S);
            for (H in r)
                if (S = r[H],
                T = t[H],
                r.hasOwnProperty(H) && S !== T && (S != null || T != null))
                    switch (H) {
                    case "children":
                    case "dangerouslySetInnerHTML":
                        if (S != null)
                            throw Error(l(137, e));
                        break;
                    default:
                        SA(A, e, H, S, r, T)
                    }
            return;
        default:
            if (Os(e)) {
                for (var TA in t)
                    S = t[TA],
                    t.hasOwnProperty(TA) && S !== void 0 && !r.hasOwnProperty(TA) && yo(A, e, TA, void 0, r, S);
                for (M in r)
                    S = r[M],
                    T = t[M],
                    !r.hasOwnProperty(M) || S === T || S === void 0 && T === void 0 || yo(A, e, M, S, r, T);
                return
            }
        }
        for (var E in t)
            S = t[E],
            t.hasOwnProperty(E) && S != null && !r.hasOwnProperty(E) && SA(A, e, E, null, r, S);
        for (G in r)
            S = r[G],
            T = t[G],
            !r.hasOwnProperty(G) || S === T || S == null && T == null || SA(A, e, G, S, r, T)
    }
    var po = null
      , mo = null;
    function ui(A) {
        return A.nodeType === 9 ? A : A.ownerDocument
    }
    function yd(A) {
        switch (A) {
        case "http://www.w3.org/2000/svg":
            return 1;
        case "http://www.w3.org/1998/Math/MathML":
            return 2;
        default:
            return 0
        }
    }
    function pd(A, e) {
        if (A === 0)
            switch (e) {
            case "svg":
                return 1;
            case "math":
                return 2;
            default:
                return 0
            }
        return A === 1 && e === "foreignObject" ? 0 : A
    }
    function Fo(A, e) {
        return A === "textarea" || A === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null
    }
    var Eo = null;
    function FC() {
        var A = window.event;
        return A && A.type === "popstate" ? A === Eo ? !1 : (Eo = A,
        !0) : (Eo = null,
        !1)
    }
    var md = typeof setTimeout == "function" ? setTimeout : void 0
      , EC = typeof clearTimeout == "function" ? clearTimeout : void 0
      , Fd = typeof Promise == "function" ? Promise : void 0
      , bC = typeof queueMicrotask == "function" ? queueMicrotask : typeof Fd < "u" ? function(A) {
        return Fd.resolve(null).then(A).catch(HC)
    }
    : md;
    function HC(A) {
        setTimeout(function() {
            throw A
        })
    }
    function Pt(A) {
        return A === "head"
    }
    function Ed(A, e) {
        var t = e
          , r = 0
          , s = 0;
        do {
            var o = t.nextSibling;
            if (A.removeChild(t),
            o && o.nodeType === 8)
                if (t = o.data,
                t === "/$") {
                    if (0 < r && 8 > r) {
                        t = r;
                        var g = A.ownerDocument;
                        if (t & 1 && Fr(g.documentElement),
                        t & 2 && Fr(g.body),
                        t & 4)
                            for (t = g.head,
                            Fr(t),
                            g = t.firstChild; g; ) {
                                var w = g.nextSibling
                                  , y = g.nodeName;
                                g[Rn] || y === "SCRIPT" || y === "STYLE" || y === "LINK" && g.rel.toLowerCase() === "stylesheet" || t.removeChild(g),
                                g = w
                            }
                    }
                    if (s === 0) {
                        A.removeChild(o),
                        Lr(e);
                        return
                    }
                    s--
                } else
                    t === "$" || t === "$?" || t === "$!" ? s++ : r = t.charCodeAt(0) - 48;
            else
                r = 0;
            t = o
        } while (t);
        Lr(e)
    }
    function bo(A) {
        var e = A.firstChild;
        for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
            var t = e;
            switch (e = e.nextSibling,
            t.nodeName) {
            case "HTML":
            case "HEAD":
            case "BODY":
                bo(t),
                Ts(t);
                continue;
            case "SCRIPT":
            case "STYLE":
                continue;
            case "LINK":
                if (t.rel.toLowerCase() === "stylesheet")
                    continue
            }
            A.removeChild(t)
        }
    }
    function xC(A, e, t, r) {
        for (; A.nodeType === 1; ) {
            var s = t;
            if (A.nodeName.toLowerCase() !== e.toLowerCase()) {
                if (!r && (A.nodeName !== "INPUT" || A.type !== "hidden"))
                    break
            } else if (r) {
                if (!A[Rn])
                    switch (e) {
                    case "meta":
                        if (!A.hasAttribute("itemprop"))
                            break;
                        return A;
                    case "link":
                        if (o = A.getAttribute("rel"),
                        o === "stylesheet" && A.hasAttribute("data-precedence"))
                            break;
                        if (o !== s.rel || A.getAttribute("href") !== (s.href == null || s.href === "" ? null : s.href) || A.getAttribute("crossorigin") !== (s.crossOrigin == null ? null : s.crossOrigin) || A.getAttribute("title") !== (s.title == null ? null : s.title))
                            break;
                        return A;
                    case "style":
                        if (A.hasAttribute("data-precedence"))
                            break;
                        return A;
                    case "script":
                        if (o = A.getAttribute("src"),
                        (o !== (s.src == null ? null : s.src) || A.getAttribute("type") !== (s.type == null ? null : s.type) || A.getAttribute("crossorigin") !== (s.crossOrigin == null ? null : s.crossOrigin)) && o && A.hasAttribute("async") && !A.hasAttribute("itemprop"))
                            break;
                        return A;
                    default:
                        return A
                    }
            } else if (e === "input" && A.type === "hidden") {
                var o = s.name == null ? null : "" + s.name;
                if (s.type === "hidden" && A.getAttribute("name") === o)
                    return A
            } else
                return A;
            if (A = $e(A.nextSibling),
            A === null)
                break
        }
        return null
    }
    function SC(A, e, t) {
        if (e === "")
            return null;
        for (; A.nodeType !== 3; )
            if ((A.nodeType !== 1 || A.nodeName !== "INPUT" || A.type !== "hidden") && !t || (A = $e(A.nextSibling),
            A === null))
                return null;
        return A
    }
    function Ho(A) {
        return A.data === "$!" || A.data === "$?" && A.ownerDocument.readyState === "complete"
    }
    function TC(A, e) {
        var t = A.ownerDocument;
        if (A.data !== "$?" || t.readyState === "complete")
            e();
        else {
            var r = function() {
                e(),
                t.removeEventListener("DOMContentLoaded", r)
            };
            t.addEventListener("DOMContentLoaded", r),
            A._reactRetry = r
        }
    }
    function $e(A) {
        for (; A != null; A = A.nextSibling) {
            var e = A.nodeType;
            if (e === 1 || e === 3)
                break;
            if (e === 8) {
                if (e = A.data,
                e === "$" || e === "$!" || e === "$?" || e === "F!" || e === "F")
                    break;
                if (e === "/$")
                    return null
            }
        }
        return A
    }
    var xo = null;
    function bd(A) {
        A = A.previousSibling;
        for (var e = 0; A; ) {
            if (A.nodeType === 8) {
                var t = A.data;
                if (t === "$" || t === "$!" || t === "$?") {
                    if (e === 0)
                        return A;
                    e--
                } else
                    t === "/$" && e++
            }
            A = A.previousSibling
        }
        return null
    }
    function Hd(A, e, t) {
        switch (e = ui(t),
        A) {
        case "html":
            if (A = e.documentElement,
            !A)
                throw Error(l(452));
            return A;
        case "head":
            if (A = e.head,
            !A)
                throw Error(l(453));
            return A;
        case "body":
            if (A = e.body,
            !A)
                throw Error(l(454));
            return A;
        default:
            throw Error(l(451))
        }
    }
    function Fr(A) {
        for (var e = A.attributes; e.length; )
            A.removeAttributeNode(e[0]);
        Ts(A)
    }
    var je = new Map
      , xd = new Set;
    function oi(A) {
        return typeof A.getRootNode == "function" ? A.getRootNode() : A.nodeType === 9 ? A : A.ownerDocument
    }
    var Et = j.d;
    j.d = {
        f: DC,
        r: LC,
        D: IC,
        C: KC,
        L: _C,
        m: OC,
        X: NC,
        S: MC,
        M: RC
    };
    function DC() {
        var A = Et.f()
          , e = ei();
        return A || e
    }
    function LC(A) {
        var e = Ra(A);
        e !== null && e.tag === 5 && e.type === "form" ? ZB(e) : Et.r(A)
    }
    var vn = typeof document > "u" ? null : document;
    function Sd(A, e, t) {
        var r = vn;
        if (r && typeof e == "string" && e) {
            var s = Ne(e);
            s = 'link[rel="' + A + '"][href="' + s + '"]',
            typeof t == "string" && (s += '[crossorigin="' + t + '"]'),
            xd.has(s) || (xd.add(s),
            A = {
                rel: A,
                crossOrigin: t,
                href: e
            },
            r.querySelector(s) === null && (e = r.createElement("link"),
            se(e, "link", A),
            ee(e),
            r.head.appendChild(e)))
        }
    }
    function IC(A) {
        Et.D(A),
        Sd("dns-prefetch", A, null)
    }
    function KC(A, e) {
        Et.C(A, e),
        Sd("preconnect", A, e)
    }
    function _C(A, e, t) {
        Et.L(A, e, t);
        var r = vn;
        if (r && A && e) {
            var s = 'link[rel="preload"][as="' + Ne(e) + '"]';
            e === "image" && t && t.imageSrcSet ? (s += '[imagesrcset="' + Ne(t.imageSrcSet) + '"]',
            typeof t.imageSizes == "string" && (s += '[imagesizes="' + Ne(t.imageSizes) + '"]')) : s += '[href="' + Ne(A) + '"]';
            var o = s;
            switch (e) {
            case "style":
                o = yn(A);
                break;
            case "script":
                o = pn(A)
            }
            je.has(o) || (A = Q({
                rel: "preload",
                href: e === "image" && t && t.imageSrcSet ? void 0 : A,
                as: e
            }, t),
            je.set(o, A),
            r.querySelector(s) !== null || e === "style" && r.querySelector(Er(o)) || e === "script" && r.querySelector(br(o)) || (e = r.createElement("link"),
            se(e, "link", A),
            ee(e),
            r.head.appendChild(e)))
        }
    }
    function OC(A, e) {
        Et.m(A, e);
        var t = vn;
        if (t && A) {
            var r = e && typeof e.as == "string" ? e.as : "script"
              , s = 'link[rel="modulepreload"][as="' + Ne(r) + '"][href="' + Ne(A) + '"]'
              , o = s;
            switch (r) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
                o = pn(A)
            }
            if (!je.has(o) && (A = Q({
                rel: "modulepreload",
                href: A
            }, e),
            je.set(o, A),
            t.querySelector(s) === null)) {
                switch (r) {
                case "audioworklet":
                case "paintworklet":
                case "serviceworker":
                case "sharedworker":
                case "worker":
                case "script":
                    if (t.querySelector(br(o)))
                        return
                }
                r = t.createElement("link"),
                se(r, "link", A),
                ee(r),
                t.head.appendChild(r)
            }
        }
    }
    function MC(A, e, t) {
        Et.S(A, e, t);
        var r = vn;
        if (r && A) {
            var s = Ga(r).hoistableStyles
              , o = yn(A);
            e = e || "default";
            var g = s.get(o);
            if (!g) {
                var w = {
                    loading: 0,
                    preload: null
                };
                if (g = r.querySelector(Er(o)))
                    w.loading = 5;
                else {
                    A = Q({
                        rel: "stylesheet",
                        href: A,
                        "data-precedence": e
                    }, t),
                    (t = je.get(o)) && So(A, t);
                    var y = g = r.createElement("link");
                    ee(y),
                    se(y, "link", A),
                    y._p = new Promise(function(H, M) {
                        y.onload = H,
                        y.onerror = M
                    }
                    ),
                    y.addEventListener("load", function() {
                        w.loading |= 1
                    }),
                    y.addEventListener("error", function() {
                        w.loading |= 2
                    }),
                    w.loading |= 4,
                    ci(g, e, r)
                }
                g = {
                    type: "stylesheet",
                    instance: g,
                    count: 1,
                    state: w
                },
                s.set(o, g)
            }
        }
    }
    function NC(A, e) {
        Et.X(A, e);
        var t = vn;
        if (t && A) {
            var r = Ga(t).hoistableScripts
              , s = pn(A)
              , o = r.get(s);
            o || (o = t.querySelector(br(s)),
            o || (A = Q({
                src: A,
                async: !0
            }, e),
            (e = je.get(s)) && To(A, e),
            o = t.createElement("script"),
            ee(o),
            se(o, "link", A),
            t.head.appendChild(o)),
            o = {
                type: "script",
                instance: o,
                count: 1,
                state: null
            },
            r.set(s, o))
        }
    }
    function RC(A, e) {
        Et.M(A, e);
        var t = vn;
        if (t && A) {
            var r = Ga(t).hoistableScripts
              , s = pn(A)
              , o = r.get(s);
            o || (o = t.querySelector(br(s)),
            o || (A = Q({
                src: A,
                async: !0,
                type: "module"
            }, e),
            (e = je.get(s)) && To(A, e),
            o = t.createElement("script"),
            ee(o),
            se(o, "link", A),
            t.head.appendChild(o)),
            o = {
                type: "script",
                instance: o,
                count: 1,
                state: null
            },
            r.set(s, o))
        }
    }
    function Td(A, e, t, r) {
        var s = (s = rA.current) ? oi(s) : null;
        if (!s)
            throw Error(l(446));
        switch (A) {
        case "meta":
        case "title":
            return null;
        case "style":
            return typeof t.precedence == "string" && typeof t.href == "string" ? (e = yn(t.href),
            t = Ga(s).hoistableStyles,
            r = t.get(e),
            r || (r = {
                type: "style",
                instance: null,
                count: 0,
                state: null
            },
            t.set(e, r)),
            r) : {
                type: "void",
                instance: null,
                count: 0,
                state: null
            };
        case "link":
            if (t.rel === "stylesheet" && typeof t.href == "string" && typeof t.precedence == "string") {
                A = yn(t.href);
                var o = Ga(s).hoistableStyles
                  , g = o.get(A);
                if (g || (s = s.ownerDocument || s,
                g = {
                    type: "stylesheet",
                    instance: null,
                    count: 0,
                    state: {
                        loading: 0,
                        preload: null
                    }
                },
                o.set(A, g),
                (o = s.querySelector(Er(A))) && !o._p && (g.instance = o,
                g.state.loading = 5),
                je.has(A) || (t = {
                    rel: "preload",
                    as: "style",
                    href: t.href,
                    crossOrigin: t.crossOrigin,
                    integrity: t.integrity,
                    media: t.media,
                    hrefLang: t.hrefLang,
                    referrerPolicy: t.referrerPolicy
                },
                je.set(A, t),
                o || GC(s, A, t, g.state))),
                e && r === null)
                    throw Error(l(528, ""));
                return g
            }
            if (e && r !== null)
                throw Error(l(529, ""));
            return null;
        case "script":
            return e = t.async,
            t = t.src,
            typeof t == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = pn(t),
            t = Ga(s).hoistableScripts,
            r = t.get(e),
            r || (r = {
                type: "script",
                instance: null,
                count: 0,
                state: null
            },
            t.set(e, r)),
            r) : {
                type: "void",
                instance: null,
                count: 0,
                state: null
            };
        default:
            throw Error(l(444, A))
        }
    }
    function yn(A) {
        return 'href="' + Ne(A) + '"'
    }
    function Er(A) {
        return 'link[rel="stylesheet"][' + A + "]"
    }
    function Dd(A) {
        return Q({}, A, {
            "data-precedence": A.precedence,
            precedence: null
        })
    }
    function GC(A, e, t, r) {
        A.querySelector('link[rel="preload"][as="style"][' + e + "]") ? r.loading = 1 : (e = A.createElement("link"),
        r.preload = e,
        e.addEventListener("load", function() {
            return r.loading |= 1
        }),
        e.addEventListener("error", function() {
            return r.loading |= 2
        }),
        se(e, "link", t),
        ee(e),
        A.head.appendChild(e))
    }
    function pn(A) {
        return '[src="' + Ne(A) + '"]'
    }
    function br(A) {
        return "script[async]" + A
    }
    function Ld(A, e, t) {
        if (e.count++,
        e.instance === null)
            switch (e.type) {
            case "style":
                var r = A.querySelector('style[data-href~="' + Ne(t.href) + '"]');
                if (r)
                    return e.instance = r,
                    ee(r),
                    r;
                var s = Q({}, t, {
                    "data-href": t.href,
                    "data-precedence": t.precedence,
                    href: null,
                    precedence: null
                });
                return r = (A.ownerDocument || A).createElement("style"),
                ee(r),
                se(r, "style", s),
                ci(r, t.precedence, A),
                e.instance = r;
            case "stylesheet":
                s = yn(t.href);
                var o = A.querySelector(Er(s));
                if (o)
                    return e.state.loading |= 4,
                    e.instance = o,
                    ee(o),
                    o;
                r = Dd(t),
                (s = je.get(s)) && So(r, s),
                o = (A.ownerDocument || A).createElement("link"),
                ee(o);
                var g = o;
                return g._p = new Promise(function(w, y) {
                    g.onload = w,
                    g.onerror = y
                }
                ),
                se(o, "link", r),
                e.state.loading |= 4,
                ci(o, t.precedence, A),
                e.instance = o;
            case "script":
                return o = pn(t.src),
                (s = A.querySelector(br(o))) ? (e.instance = s,
                ee(s),
                s) : (r = t,
                (s = je.get(o)) && (r = Q({}, t),
                To(r, s)),
                A = A.ownerDocument || A,
                s = A.createElement("script"),
                ee(s),
                se(s, "link", r),
                A.head.appendChild(s),
                e.instance = s);
            case "void":
                return null;
            default:
                throw Error(l(443, e.type))
            }
        else
            e.type === "stylesheet" && (e.state.loading & 4) === 0 && (r = e.instance,
            e.state.loading |= 4,
            ci(r, t.precedence, A));
        return e.instance
    }
    function ci(A, e, t) {
        for (var r = t.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), s = r.length ? r[r.length - 1] : null, o = s, g = 0; g < r.length; g++) {
            var w = r[g];
            if (w.dataset.precedence === e)
                o = w;
            else if (o !== s)
                break
        }
        o ? o.parentNode.insertBefore(A, o.nextSibling) : (e = t.nodeType === 9 ? t.head : t,
        e.insertBefore(A, e.firstChild))
    }
    function So(A, e) {
        A.crossOrigin == null && (A.crossOrigin = e.crossOrigin),
        A.referrerPolicy == null && (A.referrerPolicy = e.referrerPolicy),
        A.title == null && (A.title = e.title)
    }
    function To(A, e) {
        A.crossOrigin == null && (A.crossOrigin = e.crossOrigin),
        A.referrerPolicy == null && (A.referrerPolicy = e.referrerPolicy),
        A.integrity == null && (A.integrity = e.integrity)
    }
    var fi = null;
    function Id(A, e, t) {
        if (fi === null) {
            var r = new Map
              , s = fi = new Map;
            s.set(t, r)
        } else
            s = fi,
            r = s.get(t),
            r || (r = new Map,
            s.set(t, r));
        if (r.has(A))
            return r;
        for (r.set(A, null),
        t = t.getElementsByTagName(A),
        s = 0; s < t.length; s++) {
            var o = t[s];
            if (!(o[Rn] || o[ce] || A === "link" && o.getAttribute("rel") === "stylesheet") && o.namespaceURI !== "http://www.w3.org/2000/svg") {
                var g = o.getAttribute(e) || "";
                g = A + g;
                var w = r.get(g);
                w ? w.push(o) : r.set(g, [o])
            }
        }
        return r
    }
    function Kd(A, e, t) {
        A = A.ownerDocument || A,
        A.head.insertBefore(t, e === "title" ? A.querySelector("head > title") : null)
    }
    function VC(A, e, t) {
        if (t === 1 || e.itemProp != null)
            return !1;
        switch (A) {
        case "meta":
        case "title":
            return !0;
        case "style":
            if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "")
                break;
            return !0;
        case "link":
            if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
                break;
            switch (e.rel) {
            case "stylesheet":
                return A = e.disabled,
                typeof e.precedence == "string" && A == null;
            default:
                return !0
            }
        case "script":
            if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string")
                return !0
        }
        return !1
    }
    function _d(A) {
        return !(A.type === "stylesheet" && (A.state.loading & 3) === 0)
    }
    var Hr = null;
    function XC() {}
    function YC(A, e, t) {
        if (Hr === null)
            throw Error(l(475));
        var r = Hr;
        if (e.type === "stylesheet" && (typeof t.media != "string" || matchMedia(t.media).matches !== !1) && (e.state.loading & 4) === 0) {
            if (e.instance === null) {
                var s = yn(t.href)
                  , o = A.querySelector(Er(s));
                if (o) {
                    A = o._p,
                    A !== null && typeof A == "object" && typeof A.then == "function" && (r.count++,
                    r = Bi.bind(r),
                    A.then(r, r)),
                    e.state.loading |= 4,
                    e.instance = o,
                    ee(o);
                    return
                }
                o = A.ownerDocument || A,
                t = Dd(t),
                (s = je.get(s)) && So(t, s),
                o = o.createElement("link"),
                ee(o);
                var g = o;
                g._p = new Promise(function(w, y) {
                    g.onload = w,
                    g.onerror = y
                }
                ),
                se(o, "link", t),
                e.instance = o
            }
            r.stylesheets === null && (r.stylesheets = new Map),
            r.stylesheets.set(e, A),
            (A = e.state.preload) && (e.state.loading & 3) === 0 && (r.count++,
            e = Bi.bind(r),
            A.addEventListener("load", e),
            A.addEventListener("error", e))
        }
    }
    function zC() {
        if (Hr === null)
            throw Error(l(475));
        var A = Hr;
        return A.stylesheets && A.count === 0 && Do(A, A.stylesheets),
        0 < A.count ? function(e) {
            var t = setTimeout(function() {
                if (A.stylesheets && Do(A, A.stylesheets),
                A.unsuspend) {
                    var r = A.unsuspend;
                    A.unsuspend = null,
                    r()
                }
            }, 6e4);
            return A.unsuspend = e,
            function() {
                A.unsuspend = null,
                clearTimeout(t)
            }
        }
        : null
    }
    function Bi() {
        if (this.count--,
        this.count === 0) {
            if (this.stylesheets)
                Do(this, this.stylesheets);
            else if (this.unsuspend) {
                var A = this.unsuspend;
                this.unsuspend = null,
                A()
            }
        }
    }
    var gi = null;
    function Do(A, e) {
        A.stylesheets = null,
        A.unsuspend !== null && (A.count++,
        gi = new Map,
        e.forEach(jC, A),
        gi = null,
        Bi.call(A))
    }
    function jC(A, e) {
        if (!(e.state.loading & 4)) {
            var t = gi.get(A);
            if (t)
                var r = t.get(null);
            else {
                t = new Map,
                gi.set(A, t);
                for (var s = A.querySelectorAll("link[data-precedence],style[data-precedence]"), o = 0; o < s.length; o++) {
                    var g = s[o];
                    (g.nodeName === "LINK" || g.getAttribute("media") !== "not all") && (t.set(g.dataset.precedence, g),
                    r = g)
                }
                r && t.set(null, r)
            }
            s = e.instance,
            g = s.getAttribute("data-precedence"),
            o = t.get(g) || r,
            o === r && t.set(null, s),
            t.set(g, s),
            this.count++,
            r = Bi.bind(this),
            s.addEventListener("load", r),
            s.addEventListener("error", r),
            o ? o.parentNode.insertBefore(s, o.nextSibling) : (A = A.nodeType === 9 ? A.head : A,
            A.insertBefore(s, A.firstChild)),
            e.state.loading |= 4
        }
    }
    var xr = {
        $$typeof: R,
        Provider: null,
        Consumer: null,
        _currentValue: AA,
        _currentValue2: AA,
        _threadCount: 0
    };
    function JC(A, e, t, r, s, o, g, w) {
        this.tag = 1,
        this.containerInfo = A,
        this.pingCache = this.current = this.pendingChildren = null,
        this.timeoutHandle = -1,
        this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null,
        this.callbackPriority = 0,
        this.expirationTimes = bs(-1),
        this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0,
        this.entanglements = bs(0),
        this.hiddenUpdates = bs(null),
        this.identifierPrefix = r,
        this.onUncaughtError = s,
        this.onCaughtError = o,
        this.onRecoverableError = g,
        this.pooledCache = null,
        this.pooledCacheLanes = 0,
        this.formState = w,
        this.incompleteTransitions = new Map
    }
    function Od(A, e, t, r, s, o, g, w, y, H, M, G) {
        return A = new JC(A,e,t,g,w,y,H,G),
        e = 1,
        o === !0 && (e |= 24),
        o = Te(3, null, null, e),
        A.current = o,
        o.stateNode = A,
        e = fu(),
        e.refCount++,
        A.pooledCache = e,
        e.refCount++,
        o.memoizedState = {
            element: r,
            isDehydrated: t,
            cache: e
        },
        hu(o),
        A
    }
    function Md(A) {
        return A ? (A = $a,
        A) : $a
    }
    function Nd(A, e, t, r, s, o) {
        s = Md(s),
        r.context === null ? r.context = s : r.pendingContext = s,
        r = Nt(e),
        r.payload = {
            element: t
        },
        o = o === void 0 ? null : o,
        o !== null && (r.callback = o),
        t = Rt(A, r, e),
        t !== null && (_e(t, A, e),
        rr(t, A, e))
    }
    function Rd(A, e) {
        if (A = A.memoizedState,
        A !== null && A.dehydrated !== null) {
            var t = A.retryLane;
            A.retryLane = t !== 0 && t < e ? t : e
        }
    }
    function Lo(A, e) {
        Rd(A, e),
        (A = A.alternate) && Rd(A, e)
    }
    function Gd(A) {
        if (A.tag === 13) {
            var e = Pa(A, 67108864);
            e !== null && _e(e, A, 67108864),
            Lo(A, 67108864)
        }
    }
    var di = !0;
    function kC(A, e, t, r) {
        var s = K.T;
        K.T = null;
        var o = j.p;
        try {
            j.p = 2,
            Io(A, e, t, r)
        } finally {
            j.p = o,
            K.T = s
        }
    }
    function ZC(A, e, t, r) {
        var s = K.T;
        K.T = null;
        var o = j.p;
        try {
            j.p = 8,
            Io(A, e, t, r)
        } finally {
            j.p = o,
            K.T = s
        }
    }
    function Io(A, e, t, r) {
        if (di) {
            var s = Ko(r);
            if (s === null)
                vo(A, e, r, hi, t),
                Xd(A, r);
            else if (WC(s, A, e, t, r))
                r.stopPropagation();
            else if (Xd(A, r),
            e & 4 && -1 < qC.indexOf(A)) {
                for (; s !== null; ) {
                    var o = Ra(s);
                    if (o !== null)
                        switch (o.tag) {
                        case 3:
                            if (o = o.stateNode,
                            o.current.memoizedState.isDehydrated) {
                                var g = Ba(o.pendingLanes);
                                if (g !== 0) {
                                    var w = o;
                                    for (w.pendingLanes |= 2,
                                    w.entangledLanes |= 2; g; ) {
                                        var y = 1 << 31 - xe(g);
                                        w.entanglements[1] |= y,
                                        g &= ~y
                                    }
                                    st(o),
                                    (bA & 6) === 0 && ($l = at() + 500,
                                    yr(0))
                                }
                            }
                            break;
                        case 13:
                            w = Pa(o, 2),
                            w !== null && _e(w, o, 2),
                            ei(),
                            Lo(o, 2)
                        }
                    if (o = Ko(r),
                    o === null && vo(A, e, r, hi, t),
                    o === s)
                        break;
                    s = o
                }
                s !== null && r.stopPropagation()
            } else
                vo(A, e, r, null, t)
        }
    }
    function Ko(A) {
        return A = Ns(A),
        _o(A)
    }
    var hi = null;
    function _o(A) {
        if (hi = null,
        A = Na(A),
        A !== null) {
            var e = c(A);
            if (e === null)
                A = null;
            else {
                var t = e.tag;
                if (t === 13) {
                    if (A = f(e),
                    A !== null)
                        return A;
                    A = null
                } else if (t === 3) {
                    if (e.stateNode.current.memoizedState.isDehydrated)
                        return e.tag === 3 ? e.stateNode.containerInfo : null;
                    A = null
                } else
                    e !== A && (A = null)
            }
        }
        return hi = A,
        null
    }
    function Vd(A) {
        switch (A) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
            return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
            return 8;
        case "message":
            switch (KQ()) {
            case ef:
                return 2;
            case tf:
                return 8;
            case sl:
            case _Q:
                return 32;
            case af:
                return 268435456;
            default:
                return 32
            }
        default:
            return 32
        }
    }
    var Oo = !1
      , $t = null
      , Aa = null
      , ea = null
      , Sr = new Map
      , Tr = new Map
      , ta = []
      , qC = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function Xd(A, e) {
        switch (A) {
        case "focusin":
        case "focusout":
            $t = null;
            break;
        case "dragenter":
        case "dragleave":
            Aa = null;
            break;
        case "mouseover":
        case "mouseout":
            ea = null;
            break;
        case "pointerover":
        case "pointerout":
            Sr.delete(e.pointerId);
            break;
        case "gotpointercapture":
        case "lostpointercapture":
            Tr.delete(e.pointerId)
        }
    }
    function Dr(A, e, t, r, s, o) {
        return A === null || A.nativeEvent !== o ? (A = {
            blockedOn: e,
            domEventName: t,
            eventSystemFlags: r,
            nativeEvent: o,
            targetContainers: [s]
        },
        e !== null && (e = Ra(e),
        e !== null && Gd(e)),
        A) : (A.eventSystemFlags |= r,
        e = A.targetContainers,
        s !== null && e.indexOf(s) === -1 && e.push(s),
        A)
    }
    function WC(A, e, t, r, s) {
        switch (e) {
        case "focusin":
            return $t = Dr($t, A, e, t, r, s),
            !0;
        case "dragenter":
            return Aa = Dr(Aa, A, e, t, r, s),
            !0;
        case "mouseover":
            return ea = Dr(ea, A, e, t, r, s),
            !0;
        case "pointerover":
            var o = s.pointerId;
            return Sr.set(o, Dr(Sr.get(o) || null, A, e, t, r, s)),
            !0;
        case "gotpointercapture":
            return o = s.pointerId,
            Tr.set(o, Dr(Tr.get(o) || null, A, e, t, r, s)),
            !0
        }
        return !1
    }
    function Yd(A) {
        var e = Na(A.target);
        if (e !== null) {
            var t = c(e);
            if (t !== null) {
                if (e = t.tag,
                e === 13) {
                    if (e = f(t),
                    e !== null) {
                        A.blockedOn = e,
                        YQ(A.priority, function() {
                            if (t.tag === 13) {
                                var r = Ke();
                                r = Hs(r);
                                var s = Pa(t, r);
                                s !== null && _e(s, t, r),
                                Lo(t, r)
                            }
                        });
                        return
                    }
                } else if (e === 3 && t.stateNode.current.memoizedState.isDehydrated) {
                    A.blockedOn = t.tag === 3 ? t.stateNode.containerInfo : null;
                    return
                }
            }
        }
        A.blockedOn = null
    }
    function Qi(A) {
        if (A.blockedOn !== null)
            return !1;
        for (var e = A.targetContainers; 0 < e.length; ) {
            var t = Ko(A.nativeEvent);
            if (t === null) {
                t = A.nativeEvent;
                var r = new t.constructor(t.type,t);
                Ms = r,
                t.target.dispatchEvent(r),
                Ms = null
            } else
                return e = Ra(t),
                e !== null && Gd(e),
                A.blockedOn = t,
                !1;
            e.shift()
        }
        return !0
    }
    function zd(A, e, t) {
        Qi(A) && t.delete(e)
    }
    function PC() {
        Oo = !1,
        $t !== null && Qi($t) && ($t = null),
        Aa !== null && Qi(Aa) && (Aa = null),
        ea !== null && Qi(ea) && (ea = null),
        Sr.forEach(zd),
        Tr.forEach(zd)
    }
    function wi(A, e) {
        A.blockedOn === e && (A.blockedOn = null,
        Oo || (Oo = !0,
        a.unstable_scheduleCallback(a.unstable_NormalPriority, PC)))
    }
    var Ci = null;
    function jd(A) {
        Ci !== A && (Ci = A,
        a.unstable_scheduleCallback(a.unstable_NormalPriority, function() {
            Ci === A && (Ci = null);
            for (var e = 0; e < A.length; e += 3) {
                var t = A[e]
                  , r = A[e + 1]
                  , s = A[e + 2];
                if (typeof r != "function") {
                    if (_o(r || t) === null)
                        continue;
                    break
                }
                var o = Ra(t);
                o !== null && (A.splice(e, 3),
                e -= 3,
                Ku(o, {
                    pending: !0,
                    data: s,
                    method: t.method,
                    action: r
                }, r, s))
            }
        }))
    }
    function Lr(A) {
        function e(y) {
            return wi(y, A)
        }
        $t !== null && wi($t, A),
        Aa !== null && wi(Aa, A),
        ea !== null && wi(ea, A),
        Sr.forEach(e),
        Tr.forEach(e);
        for (var t = 0; t < ta.length; t++) {
            var r = ta[t];
            r.blockedOn === A && (r.blockedOn = null)
        }
        for (; 0 < ta.length && (t = ta[0],
        t.blockedOn === null); )
            Yd(t),
            t.blockedOn === null && ta.shift();
        if (t = (A.ownerDocument || A).$$reactFormReplay,
        t != null)
            for (r = 0; r < t.length; r += 3) {
                var s = t[r]
                  , o = t[r + 1]
                  , g = s[ye] || null;
                if (typeof o == "function")
                    g || jd(t);
                else if (g) {
                    var w = null;
                    if (o && o.hasAttribute("formAction")) {
                        if (s = o,
                        g = o[ye] || null)
                            w = g.formAction;
                        else if (_o(s) !== null)
                            continue
                    } else
                        w = g.action;
                    typeof w == "function" ? t[r + 1] = w : (t.splice(r, 3),
                    r -= 3),
                    jd(t)
                }
            }
    }
    function Mo(A) {
        this._internalRoot = A
    }
    Ui.prototype.render = Mo.prototype.render = function(A) {
        var e = this._internalRoot;
        if (e === null)
            throw Error(l(409));
        var t = e.current
          , r = Ke();
        Nd(t, r, A, e, null, null)
    }
    ,
    Ui.prototype.unmount = Mo.prototype.unmount = function() {
        var A = this._internalRoot;
        if (A !== null) {
            this._internalRoot = null;
            var e = A.containerInfo;
            Nd(A.current, 2, null, A, null, null),
            ei(),
            e[Ma] = null
        }
    }
    ;
    function Ui(A) {
        this._internalRoot = A
    }
    Ui.prototype.unstable_scheduleHydration = function(A) {
        if (A) {
            var e = uf();
            A = {
                blockedOn: null,
                target: A,
                priority: e
            };
            for (var t = 0; t < ta.length && e !== 0 && e < ta[t].priority; t++)
                ;
            ta.splice(t, 0, A),
            t === 0 && Yd(A)
        }
    }
    ;
    var Jd = n.version;
    if (Jd !== "19.1.0")
        throw Error(l(527, Jd, "19.1.0"));
    j.findDOMNode = function(A) {
        var e = A._reactInternals;
        if (e === void 0)
            throw typeof A.render == "function" ? Error(l(188)) : (A = Object.keys(A).join(","),
            Error(l(268, A)));
        return A = B(e),
        A = A !== null ? d(A) : null,
        A = A === null ? null : A.stateNode,
        A
    }
    ;
    var $C = {
        bundleType: 0,
        version: "19.1.0",
        rendererPackageName: "react-dom",
        currentDispatcherRef: K,
        reconcilerVersion: "19.1.0"
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
        var vi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!vi.isDisabled && vi.supportsFiber)
            try {
                On = vi.inject($C),
                He = vi
            } catch {}
    }
    return Kr.createRoot = function(A, e) {
        if (!u(A))
            throw Error(l(299));
        var t = !1
          , r = ""
          , s = ug
          , o = og
          , g = cg
          , w = null;
        return e != null && (e.unstable_strictMode === !0 && (t = !0),
        e.identifierPrefix !== void 0 && (r = e.identifierPrefix),
        e.onUncaughtError !== void 0 && (s = e.onUncaughtError),
        e.onCaughtError !== void 0 && (o = e.onCaughtError),
        e.onRecoverableError !== void 0 && (g = e.onRecoverableError),
        e.unstable_transitionCallbacks !== void 0 && (w = e.unstable_transitionCallbacks)),
        e = Od(A, 1, !1, null, null, t, r, s, o, g, w, null),
        A[Ma] = e.current,
        Uo(A),
        new Mo(e)
    }
    ,
    Kr.hydrateRoot = function(A, e, t) {
        if (!u(A))
            throw Error(l(299));
        var r = !1
          , s = ""
          , o = ug
          , g = og
          , w = cg
          , y = null
          , H = null;
        return t != null && (t.unstable_strictMode === !0 && (r = !0),
        t.identifierPrefix !== void 0 && (s = t.identifierPrefix),
        t.onUncaughtError !== void 0 && (o = t.onUncaughtError),
        t.onCaughtError !== void 0 && (g = t.onCaughtError),
        t.onRecoverableError !== void 0 && (w = t.onRecoverableError),
        t.unstable_transitionCallbacks !== void 0 && (y = t.unstable_transitionCallbacks),
        t.formState !== void 0 && (H = t.formState)),
        e = Od(A, 1, !0, e, t ?? null, r, s, o, g, w, y, H),
        e.context = Md(null),
        t = e.current,
        r = Ke(),
        r = Hs(r),
        s = Nt(r),
        s.callback = null,
        Rt(t, s, r),
        t = r,
        e.current.lanes = t,
        Nn(e, t),
        st(e),
        A[Ma] = e.current,
        Uo(A),
        new Ui(e)
    }
    ,
    Kr.version = "19.1.0",
    Kr
}
var ah;
function uU() {
    if (ah)
        return Go.exports;
    ah = 1;
    function a() {
        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
            try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)
            } catch (n) {
                console.error(n)
            }
    }
    return a(),
    Go.exports = sU(),
    Go.exports
}
var oU = uU();
const cU = w0(oU);
function C0() {
    return {
        exchange: "hivagold",
        fromSymbol: "ounce",
        toSymbol: "gold"
    }
}
const fU = 3e3;
class BU {
    constructor(n) {
        this.wsUrl = n || this._detectWsUrl(),
        this.socket = null,
        this.channelToSubscription = new Map,
        this.lastMessageTime = Date.now(),
        this.connect()
    }
    _detectWsUrl() {
        const n = window.location
          , i = n.hostname === "localhost" || n.hostname === "127.0.0.1"
          , l = n.hostname
          , u = window.location.protocol === "https:" ? "wss" : "ws";
        return i ? `${u}://localhost:9001/ws/ounce/live-bars/` : `${u}://${l.replace(/\:\d+$/, "")}/ounce/ws/ounce/live-bars/`
    }
    connect() {
        this.socket = new WebSocket(this.wsUrl),
        this.socket.addEventListener("open", () => {
            console.log("[🟢 WebSocket] Connected:", this.wsUrl),
            this._resubscribeAll()
        }
        ),
        this.socket.addEventListener("close", () => {
            console.warn("[🟠 WebSocket] Disconnected. Retrying in 3s..."),
            setTimeout( () => this.connect(), fU)
        }
        ),
        this.socket.addEventListener("error", n => {
            console.error("[🔴 WebSocket] Error:", n)
        }
        ),
        this.socket.addEventListener("message", n => {
            this.lastMessageTime = Date.now(),
            this._handleMessage(n.data)
        }
        )
    }
    _handleMessage(n) {
        try {
            const i = JSON.parse(n)
              , {TYPE: l, M: u, FSYM: c, TSYM: f, TS: h, P: B} = i;
            if (parseInt(l) !== 0)
                return;
            const d = parseInt(h) * 1e3
              , Q = parseFloat(B)
              , C = `0~${u}~${c}~${f}`
              , v = this.channelToSubscription.get(C);
            if (!v)
                return;
            const D = v.lastDailyBar
              , L = this._getNextBarTime(D.time, v.resolution)
              , x = d >= L ? {
                time: L,
                open: Q,
                high: Q,
                low: Q,
                close: Q
            } : {
                ...D,
                high: Math.max(D.high, Q),
                low: Math.min(D.low, Q),
                close: Q
            };
            v.lastDailyBar = x,
            v.handlers.forEach(_ => _.callback(x)),
            window.lastBarInfo = {
                open: x.open,
                time: x.time,
                resolution: v.resolution
            }
        } catch (i) {
            console.error("[WebSocket] Failed to parse message:", i)
        }
    }
    _getNextBarTime(n, i) {
        const l = new Date(n)
          , u = {
            1: () => l.setMinutes(l.getMinutes() + 1),
            5: () => l.setMinutes(l.getMinutes() + 5),
            15: () => l.setMinutes(l.getMinutes() + 15),
            30: () => l.setMinutes(l.getMinutes() + 30),
            60: () => l.setHours(l.getHours() + 1),
            240: () => l.setHours(l.getHours() + 4),
            "1D": () => l.setDate(l.getDate() + 1),
            "1W": () => l.setDate(l.getDate() + 7),
            "1M": () => l.setMonth(l.getMonth() + 1)
        };
        return u[i] && u[i](),
        l.getTime()
    }
    _resubscribeAll() {
        for (const [n,i] of this.channelToSubscription.entries())
            this._sendMessage({
                action: "SubAdd",
                subs: [n]
            })
    }
    _sendMessage(n) {
        this.socket.readyState === WebSocket.OPEN ? this.socket.send(JSON.stringify(n)) : console.warn("[WebSocket] Cannot send message, socket not open.")
    }
    subscribe(n, i, l, u, c, f) {
        const {exchange: h, fromSymbol: B, toSymbol: d} = C0(n.full_name)
          , Q = `0~${h}~${B}~${d}`
          , C = {
            id: u,
            callback: l
        };
        let v = this.channelToSubscription.get(Q);
        v ? v.handlers.push(C) : (v = {
            subscriberUID: u,
            resolution: i,
            lastDailyBar: f,
            handlers: [C]
        },
        this.channelToSubscription.set(Q, v),
        this._sendMessage({
            action: "SubAdd",
            subs: [Q]
        })),
        console.log(`[🧷 Subscribed] ${u} to ${Q}`)
    }
    unsubscribe(n) {
        for (const [i,l] of this.channelToSubscription.entries()) {
            const u = l.handlers.findIndex(c => c.id === n);
            if (u !== -1) {
                l.handlers.splice(u, 1),
                l.handlers.length === 0 && (this._sendMessage({
                    action: "SubRemove",
                    subs: [i]
                }),
                this.channelToSubscription.delete(i),
                console.log(`[❌ Unsubscribed] ${n} from ${i}`));
                break
            }
        }
    }
}
const U0 = new BU;
function gU(...a) {
    U0.subscribe(...a)
}
function dU(a) {
    U0.unsubscribe(a)
}
let gc = "";
const dc = window.location
  , hU = dc.hostname === "localhost" || dc.hostname === "127.0.0.1";
hU ? gc = "http://localhost:8001/" : gc = `https://${dc.hostname}/ounce/`;
function QU() {
    const a = document.cookie.match(/csrftoken=([^;]+)/);
    return a ? a[1] : null
}
async function we(a, n="GET", i=null) {
    const l = {
        "Content-Type": "application/json",
        "X-CSRFToken": QU()
    }
      , u = {
        method: n,
        headers: l,
        credentials: "include"
    };
    i && (u.body = JSON.stringify(i));
    try {
        const c = `${gc}${a}`;
        console.log("🧪 Final API URL:", c, "METHOD:", n, "BODY:", i);
        const f = await fetch(c, u)
          , h = await f.json();
        if (!f.ok)
            throw new Error(h.detail || "خطای ناشناس");
        return h
    } catch (c) {
        throw console.error("❌ API Error:", c.message),
        c
    }
}
class wU {
    constructor() {
        this.lastBarsCache = new Map,
        this.configuration = {
            supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"]
        },
        console.log("🟢 Datafeed instance created")
    }
    async getAllSymbols() {
        const n = [{
            description: "انس جهانی",
            exchange: "هیوا گلد",
            full_name: "hivagold:ounce/gold",
            symbol: "ounce/gold",
            type: "crypto"
        }];
        return console.log("🔵 symbols returned:", n),
        n
    }
    onReady(n) {
        console.log("🟢 onReady called"),
        setTimeout( () => n(this.configuration))
    }
    async resolveSymbol(n, i, l) {
        console.log("🟡 resolveSymbol called with:", n);
        try {
            const c = (await this.getAllSymbols()).find(f => f.full_name === n);
            if (!c)
                throw new Error("Symbol not found");
            i({
                ticker: c.full_name,
                name: c.symbol,
                description: c.description,
                type: c.type,
                session: "24x7",
                timezone: "Etc/UTC",
                exchange: c.exchange,
                minmov: 1,
                pricescale: 100,
                has_intraday: !0,
                has_no_volume: !0,
                supported_resolutions: this.configuration.supported_resolutions
            })
        } catch (u) {
            console.error("❌ resolveSymbol error:", u.message),
            l(u.message)
        }
    }
    async getBars(n, i, {from: l, to: u, firstDataRequest: c}, f, h) {
        console.log("🟠 getBars called", {
            symbolInfo: n,
            resolution: i,
            from: l,
            to: u
        });
        const {fromSymbol: B} = C0()
          , d = new URLSearchParams({
            symbol: B,
            from: l,
            to: u,
            resolution: i
        }).toString();
        try {
            const Q = await we(`api/ounce-bars/?${d}`);
            if (console.log("📦 API response:", Q),
            !Array.isArray(Q) || Q.length === 0 || Q.error)
                return f([], {
                    noData: !0
                });
            const C = Q.map(v => ({
                time: v.time * 1e3,
                open: v.open,
                high: v.high,
                low: v.low,
                close: v.close
            }));
            c && this.lastBarsCache.set(n.full_name, C.at(-1)),
            f(C, {
                noData: !1
            })
        } catch (Q) {
            console.error("🚨 getBars error:", Q),
            h(Q)
        }
    }
    subscribeBars(n, i, l, u, c) {
        console.log("📡 subscribeBars called", {
            symbolInfo: n,
            resolution: i
        });
        const f = this.lastBarsCache.get(n.full_name);
        gU(n, i, l, u, c, f)
    }
    unsubscribeBars(n) {
        console.log("❎ unsubscribeBars called", n),
        dU(n)
    }
}
function nh({mobile: a=!1}) {
    const n = Y.useRef(null)
      , i = Y.useRef(null)
      , u = "chartState_ouncegold";
    return Y.useEffect( () => {
        const c = document.createElement("script");
        return c.src = "/ounce/charting_library/charting_library.js",
        c.async = !0,
        c.onload = () => {
            if (window.TradingView) {
                const f = new window.TradingView.widget({
                    symbol: "hivagold:ounce/gold",
                    interval: "1",
                    container: n.current,
                    datafeed: new wU,
                    library_path: "/ounce/charting_library/",
                    autosize: !0,
                    adaptive_logo: !1,
                    locale: "en",
                    theme: "Dark",
                    hide_side_toolbar: !1,
                    disabled_features: ["header_symbol_search", "header_compare", "save_shortcut"],
                    enabled_features: ["hide_left_toolbar_by_default", "header_fullscreen_button", "fullscreen_toolbar", "header_in_fullscreen_mode", "side_toolbar_in_fullscreen_mode"],
                    load_last_chart: !0,
                    overrides: {}
                });
                i.current = f,
                ( (B=20, d=500) => {
                    let Q = 0;
                    const C = () => {
                        Q++;
                        try {
                            const v = localStorage.getItem(u);
                            if (v && typeof f.load == "function")
                                f.load(JSON.parse(v), () => {
                                    console.log(`✅ Chart state loaded (attempt ${Q})`)
                                }
                                );
                            else
                                throw new Error("widget.load not ready yet")
                        } catch (v) {
                            Q < B ? (console.warn(`🔁 Retry ${Q}: ${v.message}`),
                            setTimeout(C, d)) : console.error("❌ Chart state load failed.")
                        }
                    }
                    ;
                    C()
                }
                )(),
                setTimeout( () => {
                    setInterval( () => {
                        var B;
                        (B = i.current) != null && B.save && i.current.save(d => {
                            localStorage.setItem(u, JSON.stringify(d))
                        }
                        )
                    }
                    , 1e3)
                }
                , 1e4),
                window.addEventListener("beforeunload", () => {
                    var B;
                    (B = i.current) != null && B.save && i.current.save(d => {
                        localStorage.setItem(u, JSON.stringify(d))
                    }
                    )
                }
                )
            } else
                console.error("❌ TradingView is not defined")
        }
        ,
        document.body.appendChild(c),
        () => {
            window.removeEventListener("beforeunload", () => {}
            )
        }
    }
    , []),
    U.jsx("div", {
        className: `w-full rounded-xl shadow ${a ? "h-screen" : "h-full"}`,
        ref: n
    })
}
function v0(a) {
    var n, i, l = "";
    if (typeof a == "string" || typeof a == "number")
        l += a;
    else if (typeof a == "object")
        if (Array.isArray(a)) {
            var u = a.length;
            for (n = 0; n < u; n++)
                a[n] && (i = v0(a[n])) && (l && (l += " "),
                l += i)
        } else
            for (i in a)
                a[i] && (l && (l += " "),
                l += i);
    return l
}
function Ia() {
    for (var a, n, i = 0, l = "", u = arguments.length; i < u; i++)
        (a = arguments[i]) && (n = v0(a)) && (l && (l += " "),
        l += n);
    return l
}
function CU(a) {
    if (typeof document > "u")
        return;
    let n = document.head || document.getElementsByTagName("head")[0]
      , i = document.createElement("style");
    i.type = "text/css",
    n.firstChild ? n.insertBefore(i, n.firstChild) : n.appendChild(i),
    i.styleSheet ? i.styleSheet.cssText = a : i.appendChild(document.createTextNode(a))
}
CU(`:root{--toastify-color-light: #fff;--toastify-color-dark: #121212;--toastify-color-info: #3498db;--toastify-color-success: #07bc0c;--toastify-color-warning: #f1c40f;--toastify-color-error: hsl(6, 78%, 57%);--toastify-color-transparent: rgba(255, 255, 255, .7);--toastify-icon-color-info: var(--toastify-color-info);--toastify-icon-color-success: var(--toastify-color-success);--toastify-icon-color-warning: var(--toastify-color-warning);--toastify-icon-color-error: var(--toastify-color-error);--toastify-container-width: fit-content;--toastify-toast-width: 320px;--toastify-toast-offset: 16px;--toastify-toast-top: max(var(--toastify-toast-offset), env(safe-area-inset-top));--toastify-toast-right: max(var(--toastify-toast-offset), env(safe-area-inset-right));--toastify-toast-left: max(var(--toastify-toast-offset), env(safe-area-inset-left));--toastify-toast-bottom: max(var(--toastify-toast-offset), env(safe-area-inset-bottom));--toastify-toast-background: #fff;--toastify-toast-padding: 14px;--toastify-toast-min-height: 64px;--toastify-toast-max-height: 800px;--toastify-toast-bd-radius: 6px;--toastify-toast-shadow: 0px 4px 12px rgba(0, 0, 0, .1);--toastify-font-family: sans-serif;--toastify-z-index: 9999;--toastify-text-color-light: #757575;--toastify-text-color-dark: #fff;--toastify-text-color-info: #fff;--toastify-text-color-success: #fff;--toastify-text-color-warning: #fff;--toastify-text-color-error: #fff;--toastify-spinner-color: #616161;--toastify-spinner-color-empty-area: #e0e0e0;--toastify-color-progress-light: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);--toastify-color-progress-dark: #bb86fc;--toastify-color-progress-info: var(--toastify-color-info);--toastify-color-progress-success: var(--toastify-color-success);--toastify-color-progress-warning: var(--toastify-color-warning);--toastify-color-progress-error: var(--toastify-color-error);--toastify-color-progress-bgo: .2}.Toastify__toast-container{z-index:var(--toastify-z-index);-webkit-transform:translate3d(0,0,var(--toastify-z-index));position:fixed;width:var(--toastify-container-width);box-sizing:border-box;color:#fff;display:flex;flex-direction:column}.Toastify__toast-container--top-left{top:var(--toastify-toast-top);left:var(--toastify-toast-left)}.Toastify__toast-container--top-center{top:var(--toastify-toast-top);left:50%;transform:translate(-50%);align-items:center}.Toastify__toast-container--top-right{top:var(--toastify-toast-top);right:var(--toastify-toast-right);align-items:end}.Toastify__toast-container--bottom-left{bottom:var(--toastify-toast-bottom);left:var(--toastify-toast-left)}.Toastify__toast-container--bottom-center{bottom:var(--toastify-toast-bottom);left:50%;transform:translate(-50%);align-items:center}.Toastify__toast-container--bottom-right{bottom:var(--toastify-toast-bottom);right:var(--toastify-toast-right);align-items:end}.Toastify__toast{--y: 0;position:relative;touch-action:none;width:var(--toastify-toast-width);min-height:var(--toastify-toast-min-height);box-sizing:border-box;margin-bottom:1rem;padding:var(--toastify-toast-padding);border-radius:var(--toastify-toast-bd-radius);box-shadow:var(--toastify-toast-shadow);max-height:var(--toastify-toast-max-height);font-family:var(--toastify-font-family);z-index:0;display:flex;flex:1 auto;align-items:center;word-break:break-word}@media only screen and (max-width: 480px){.Toastify__toast-container{width:100vw;left:env(safe-area-inset-left);margin:0}.Toastify__toast-container--top-left,.Toastify__toast-container--top-center,.Toastify__toast-container--top-right{top:env(safe-area-inset-top);transform:translate(0)}.Toastify__toast-container--bottom-left,.Toastify__toast-container--bottom-center,.Toastify__toast-container--bottom-right{bottom:env(safe-area-inset-bottom);transform:translate(0)}.Toastify__toast-container--rtl{right:env(safe-area-inset-right);left:initial}.Toastify__toast{--toastify-toast-width: 100%;margin-bottom:0;border-radius:0}}.Toastify__toast-container[data-stacked=true]{width:var(--toastify-toast-width)}.Toastify__toast--stacked{position:absolute;width:100%;transform:translate3d(0,var(--y),0) scale(var(--s));transition:transform .3s}.Toastify__toast--stacked[data-collapsed] .Toastify__toast-body,.Toastify__toast--stacked[data-collapsed] .Toastify__close-button{transition:opacity .1s}.Toastify__toast--stacked[data-collapsed=false]{overflow:visible}.Toastify__toast--stacked[data-collapsed=true]:not(:last-child)>*{opacity:0}.Toastify__toast--stacked:after{content:"";position:absolute;left:0;right:0;height:calc(var(--g) * 1px);bottom:100%}.Toastify__toast--stacked[data-pos=top]{top:0}.Toastify__toast--stacked[data-pos=bot]{bottom:0}.Toastify__toast--stacked[data-pos=bot].Toastify__toast--stacked:before{transform-origin:top}.Toastify__toast--stacked[data-pos=top].Toastify__toast--stacked:before{transform-origin:bottom}.Toastify__toast--stacked:before{content:"";position:absolute;left:0;right:0;bottom:0;height:100%;transform:scaleY(3);z-index:-1}.Toastify__toast--rtl{direction:rtl}.Toastify__toast--close-on-click{cursor:pointer}.Toastify__toast-icon{margin-inline-end:10px;width:22px;flex-shrink:0;display:flex}.Toastify--animate{animation-fill-mode:both;animation-duration:.5s}.Toastify--animate-icon{animation-fill-mode:both;animation-duration:.3s}.Toastify__toast-theme--dark{background:var(--toastify-color-dark);color:var(--toastify-text-color-dark)}.Toastify__toast-theme--light,.Toastify__toast-theme--colored.Toastify__toast--default{background:var(--toastify-color-light);color:var(--toastify-text-color-light)}.Toastify__toast-theme--colored.Toastify__toast--info{color:var(--toastify-text-color-info);background:var(--toastify-color-info)}.Toastify__toast-theme--colored.Toastify__toast--success{color:var(--toastify-text-color-success);background:var(--toastify-color-success)}.Toastify__toast-theme--colored.Toastify__toast--warning{color:var(--toastify-text-color-warning);background:var(--toastify-color-warning)}.Toastify__toast-theme--colored.Toastify__toast--error{color:var(--toastify-text-color-error);background:var(--toastify-color-error)}.Toastify__progress-bar-theme--light{background:var(--toastify-color-progress-light)}.Toastify__progress-bar-theme--dark{background:var(--toastify-color-progress-dark)}.Toastify__progress-bar--info{background:var(--toastify-color-progress-info)}.Toastify__progress-bar--success{background:var(--toastify-color-progress-success)}.Toastify__progress-bar--warning{background:var(--toastify-color-progress-warning)}.Toastify__progress-bar--error{background:var(--toastify-color-progress-error)}.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info,.Toastify__progress-bar-theme--colored.Toastify__progress-bar--success,.Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning,.Toastify__progress-bar-theme--colored.Toastify__progress-bar--error{background:var(--toastify-color-transparent)}.Toastify__close-button{color:#fff;position:absolute;top:6px;right:6px;background:transparent;outline:none;border:none;padding:0;cursor:pointer;opacity:.7;transition:.3s ease;z-index:1}.Toastify__toast--rtl .Toastify__close-button{left:6px;right:unset}.Toastify__close-button--light{color:#000;opacity:.3}.Toastify__close-button>svg{fill:currentColor;height:16px;width:14px}.Toastify__close-button:hover,.Toastify__close-button:focus{opacity:1}@keyframes Toastify__trackProgress{0%{transform:scaleX(1)}to{transform:scaleX(0)}}.Toastify__progress-bar{position:absolute;bottom:0;left:0;width:100%;height:100%;z-index:1;opacity:.7;transform-origin:left}.Toastify__progress-bar--animated{animation:Toastify__trackProgress linear 1 forwards}.Toastify__progress-bar--controlled{transition:transform .2s}.Toastify__progress-bar--rtl{right:0;left:initial;transform-origin:right;border-bottom-left-radius:initial}.Toastify__progress-bar--wrp{position:absolute;overflow:hidden;bottom:0;left:0;width:100%;height:5px;border-bottom-left-radius:var(--toastify-toast-bd-radius);border-bottom-right-radius:var(--toastify-toast-bd-radius)}.Toastify__progress-bar--wrp[data-hidden=true]{opacity:0}.Toastify__progress-bar--bg{opacity:var(--toastify-color-progress-bgo);width:100%;height:100%}.Toastify__spinner{width:20px;height:20px;box-sizing:border-box;border:2px solid;border-radius:100%;border-color:var(--toastify-spinner-color-empty-area);border-right-color:var(--toastify-spinner-color);animation:Toastify__spin .65s linear infinite}@keyframes Toastify__bounceInRight{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(3000px,0,0)}60%{opacity:1;transform:translate3d(-25px,0,0)}75%{transform:translate3d(10px,0,0)}90%{transform:translate3d(-5px,0,0)}to{transform:none}}@keyframes Toastify__bounceOutRight{20%{opacity:1;transform:translate3d(-20px,var(--y),0)}to{opacity:0;transform:translate3d(2000px,var(--y),0)}}@keyframes Toastify__bounceInLeft{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(-3000px,0,0)}60%{opacity:1;transform:translate3d(25px,0,0)}75%{transform:translate3d(-10px,0,0)}90%{transform:translate3d(5px,0,0)}to{transform:none}}@keyframes Toastify__bounceOutLeft{20%{opacity:1;transform:translate3d(20px,var(--y),0)}to{opacity:0;transform:translate3d(-2000px,var(--y),0)}}@keyframes Toastify__bounceInUp{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,3000px,0)}60%{opacity:1;transform:translate3d(0,-20px,0)}75%{transform:translate3d(0,10px,0)}90%{transform:translate3d(0,-5px,0)}to{transform:translateZ(0)}}@keyframes Toastify__bounceOutUp{20%{transform:translate3d(0,calc(var(--y) - 10px),0)}40%,45%{opacity:1;transform:translate3d(0,calc(var(--y) + 20px),0)}to{opacity:0;transform:translate3d(0,-2000px,0)}}@keyframes Toastify__bounceInDown{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,-3000px,0)}60%{opacity:1;transform:translate3d(0,25px,0)}75%{transform:translate3d(0,-10px,0)}90%{transform:translate3d(0,5px,0)}to{transform:none}}@keyframes Toastify__bounceOutDown{20%{transform:translate3d(0,calc(var(--y) - 10px),0)}40%,45%{opacity:1;transform:translate3d(0,calc(var(--y) + 20px),0)}to{opacity:0;transform:translate3d(0,2000px,0)}}.Toastify__bounce-enter--top-left,.Toastify__bounce-enter--bottom-left{animation-name:Toastify__bounceInLeft}.Toastify__bounce-enter--top-right,.Toastify__bounce-enter--bottom-right{animation-name:Toastify__bounceInRight}.Toastify__bounce-enter--top-center{animation-name:Toastify__bounceInDown}.Toastify__bounce-enter--bottom-center{animation-name:Toastify__bounceInUp}.Toastify__bounce-exit--top-left,.Toastify__bounce-exit--bottom-left{animation-name:Toastify__bounceOutLeft}.Toastify__bounce-exit--top-right,.Toastify__bounce-exit--bottom-right{animation-name:Toastify__bounceOutRight}.Toastify__bounce-exit--top-center{animation-name:Toastify__bounceOutUp}.Toastify__bounce-exit--bottom-center{animation-name:Toastify__bounceOutDown}@keyframes Toastify__zoomIn{0%{opacity:0;transform:scale3d(.3,.3,.3)}50%{opacity:1}}@keyframes Toastify__zoomOut{0%{opacity:1}50%{opacity:0;transform:translate3d(0,var(--y),0) scale3d(.3,.3,.3)}to{opacity:0}}.Toastify__zoom-enter{animation-name:Toastify__zoomIn}.Toastify__zoom-exit{animation-name:Toastify__zoomOut}@keyframes Toastify__flipIn{0%{transform:perspective(400px) rotateX(90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotateX(-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotateX(10deg);opacity:1}80%{transform:perspective(400px) rotateX(-5deg)}to{transform:perspective(400px)}}@keyframes Toastify__flipOut{0%{transform:translate3d(0,var(--y),0) perspective(400px)}30%{transform:translate3d(0,var(--y),0) perspective(400px) rotateX(-20deg);opacity:1}to{transform:translate3d(0,var(--y),0) perspective(400px) rotateX(90deg);opacity:0}}.Toastify__flip-enter{animation-name:Toastify__flipIn}.Toastify__flip-exit{animation-name:Toastify__flipOut}@keyframes Toastify__slideInRight{0%{transform:translate3d(110%,0,0);visibility:visible}to{transform:translate3d(0,var(--y),0)}}@keyframes Toastify__slideInLeft{0%{transform:translate3d(-110%,0,0);visibility:visible}to{transform:translate3d(0,var(--y),0)}}@keyframes Toastify__slideInUp{0%{transform:translate3d(0,110%,0);visibility:visible}to{transform:translate3d(0,var(--y),0)}}@keyframes Toastify__slideInDown{0%{transform:translate3d(0,-110%,0);visibility:visible}to{transform:translate3d(0,var(--y),0)}}@keyframes Toastify__slideOutRight{0%{transform:translate3d(0,var(--y),0)}to{visibility:hidden;transform:translate3d(110%,var(--y),0)}}@keyframes Toastify__slideOutLeft{0%{transform:translate3d(0,var(--y),0)}to{visibility:hidden;transform:translate3d(-110%,var(--y),0)}}@keyframes Toastify__slideOutDown{0%{transform:translate3d(0,var(--y),0)}to{visibility:hidden;transform:translate3d(0,500px,0)}}@keyframes Toastify__slideOutUp{0%{transform:translate3d(0,var(--y),0)}to{visibility:hidden;transform:translate3d(0,-500px,0)}}.Toastify__slide-enter--top-left,.Toastify__slide-enter--bottom-left{animation-name:Toastify__slideInLeft}.Toastify__slide-enter--top-right,.Toastify__slide-enter--bottom-right{animation-name:Toastify__slideInRight}.Toastify__slide-enter--top-center{animation-name:Toastify__slideInDown}.Toastify__slide-enter--bottom-center{animation-name:Toastify__slideInUp}.Toastify__slide-exit--top-left,.Toastify__slide-exit--bottom-left{animation-name:Toastify__slideOutLeft;animation-timing-function:ease-in;animation-duration:.3s}.Toastify__slide-exit--top-right,.Toastify__slide-exit--bottom-right{animation-name:Toastify__slideOutRight;animation-timing-function:ease-in;animation-duration:.3s}.Toastify__slide-exit--top-center{animation-name:Toastify__slideOutUp;animation-timing-function:ease-in;animation-duration:.3s}.Toastify__slide-exit--bottom-center{animation-name:Toastify__slideOutDown;animation-timing-function:ease-in;animation-duration:.3s}@keyframes Toastify__spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}
`);
var al = a => typeof a == "number" && !isNaN(a)
  , Oa = a => typeof a == "string"
  , Tt = a => typeof a == "function"
  , UU = a => Oa(a) || al(a)
  , hc = a => Oa(a) || Tt(a) ? a : null
  , vU = (a, n) => a === !1 || al(a) && a > 0 ? a : n
  , Qc = a => Y.isValidElement(a) || Oa(a) || Tt(a) || al(a);
function yU(a, n, i=300) {
    let {scrollHeight: l, style: u} = a;
    requestAnimationFrame( () => {
        u.minHeight = "initial",
        u.height = l + "px",
        u.transition = `all ${i}ms`,
        requestAnimationFrame( () => {
            u.height = "0",
            u.padding = "0",
            u.margin = "0",
            setTimeout(n, i)
        }
        )
    }
    )
}
function pU({enter: a, exit: n, appendPosition: i=!1, collapse: l=!0, collapseDuration: u=300}) {
    return function({children: c, position: f, preventExitTransition: h, done: B, nodeRef: d, isIn: Q, playToast: C}) {
        let v = i ? `${a}--${f}` : a
          , D = i ? `${n}--${f}` : n
          , L = Y.useRef(0);
        return Y.useLayoutEffect( () => {
            let x = d.current
              , _ = v.split(" ")
              , O = I => {
                I.target === d.current && (C(),
                x.removeEventListener("animationend", O),
                x.removeEventListener("animationcancel", O),
                L.current === 0 && I.type !== "animationcancel" && x.classList.remove(..._))
            }
            ;
            x.classList.add(..._),
            x.addEventListener("animationend", O),
            x.addEventListener("animationcancel", O)
        }
        , []),
        Y.useEffect( () => {
            let x = d.current
              , _ = () => {
                x.removeEventListener("animationend", _),
                l ? yU(x, B, u) : B()
            }
            ;
            Q || (h ? _() : (L.current = 1,
            x.className += ` ${D}`,
            x.addEventListener("animationend", _)))
        }
        , [Q]),
        OA.createElement(OA.Fragment, null, c)
    }
}
function rh(a, n) {
    return {
        content: y0(a.content, a.props),
        containerId: a.props.containerId,
        id: a.props.toastId,
        theme: a.props.theme,
        type: a.props.type,
        data: a.props.data || {},
        isLoading: a.props.isLoading,
        icon: a.props.icon,
        reason: a.removalReason,
        status: n
    }
}
function y0(a, n, i=!1) {
    return Y.isValidElement(a) && !Oa(a.type) ? Y.cloneElement(a, {
        closeToast: n.closeToast,
        toastProps: n,
        data: n.data,
        isPaused: i
    }) : Tt(a) ? a({
        closeToast: n.closeToast,
        toastProps: n,
        data: n.data,
        isPaused: i
    }) : a
}
function mU({closeToast: a, theme: n, ariaLabel: i="close"}) {
    return OA.createElement("button", {
        className: `Toastify__close-button Toastify__close-button--${n}`,
        type: "button",
        onClick: l => {
            l.stopPropagation(),
            a(!0)
        }
        ,
        "aria-label": i
    }, OA.createElement("svg", {
        "aria-hidden": "true",
        viewBox: "0 0 14 16"
    }, OA.createElement("path", {
        fillRule: "evenodd",
        d: "M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"
    })))
}
function FU({delay: a, isRunning: n, closeToast: i, type: l="default", hide: u, className: c, controlledProgress: f, progress: h, rtl: B, isIn: d, theme: Q}) {
    let C = u || f && h === 0
      , v = {
        animationDuration: `${a}ms`,
        animationPlayState: n ? "running" : "paused"
    };
    f && (v.transform = `scaleX(${h})`);
    let D = Ia("Toastify__progress-bar", f ? "Toastify__progress-bar--controlled" : "Toastify__progress-bar--animated", `Toastify__progress-bar-theme--${Q}`, `Toastify__progress-bar--${l}`, {
        "Toastify__progress-bar--rtl": B
    })
      , L = Tt(c) ? c({
        rtl: B,
        type: l,
        defaultClassName: D
    }) : Ia(D, c)
      , x = {
        [f && h >= 1 ? "onTransitionEnd" : "onAnimationEnd"]: f && h < 1 ? null : () => {
            d && i()
        }
    };
    return OA.createElement("div", {
        className: "Toastify__progress-bar--wrp",
        "data-hidden": C
    }, OA.createElement("div", {
        className: `Toastify__progress-bar--bg Toastify__progress-bar-theme--${Q} Toastify__progress-bar--${l}`
    }), OA.createElement("div", {
        role: "progressbar",
        "aria-hidden": C ? "true" : "false",
        "aria-label": "notification timer",
        className: L,
        style: v,
        ...x
    }))
}
var EU = 1
  , p0 = () => `${EU++}`;
function bU(a, n, i) {
    let l = 1
      , u = 0
      , c = []
      , f = []
      , h = n
      , B = new Map
      , d = new Set
      , Q = I => (d.add(I),
    () => d.delete(I))
      , C = () => {
        f = Array.from(B.values()),
        d.forEach(I => I())
    }
      , v = ({containerId: I, toastId: R, updateId: z}) => {
        let X = I ? I !== a : a !== 1
          , V = B.has(R) && z == null;
        return X || V
    }
      , D = (I, R) => {
        B.forEach(z => {
            var X;
            (R == null || R === z.props.toastId) && ((X = z.toggle) == null || X.call(z, I))
        }
        )
    }
      , L = I => {
        var R, z;
        (z = (R = I.props) == null ? void 0 : R.onClose) == null || z.call(R, I.removalReason),
        I.isActive = !1
    }
      , x = I => {
        if (I == null)
            B.forEach(L);
        else {
            let R = B.get(I);
            R && L(R)
        }
        C()
    }
      , _ = () => {
        u -= c.length,
        c = []
    }
      , O = I => {
        var R, z;
        let {toastId: X, updateId: V} = I.props
          , k = V == null;
        I.staleId && B.delete(I.staleId),
        I.isActive = !0,
        B.set(X, I),
        C(),
        i(rh(I, k ? "added" : "updated")),
        k && ((z = (R = I.props).onOpen) == null || z.call(R))
    }
    ;
    return {
        id: a,
        props: h,
        observe: Q,
        toggle: D,
        removeToast: x,
        toasts: B,
        clearQueue: _,
        buildToast: (I, R) => {
            if (v(R))
                return;
            let {toastId: z, updateId: X, data: V, staleId: k, delay: q} = R
              , W = X == null;
            W && u++;
            let nA = {
                ...h,
                style: h.toastStyle,
                key: l++,
                ...Object.fromEntries(Object.entries(R).filter( ([oA,cA]) => cA != null)),
                toastId: z,
                updateId: X,
                data: V,
                isIn: !1,
                className: hc(R.className || h.toastClassName),
                progressClassName: hc(R.progressClassName || h.progressClassName),
                autoClose: R.isLoading ? !1 : vU(R.autoClose, h.autoClose),
                closeToast(oA) {
                    B.get(z).removalReason = oA,
                    x(z)
                },
                deleteToast() {
                    let oA = B.get(z);
                    if (oA != null) {
                        if (i(rh(oA, "removed")),
                        B.delete(z),
                        u--,
                        u < 0 && (u = 0),
                        c.length > 0) {
                            O(c.shift());
                            return
                        }
                        C()
                    }
                }
            };
            nA.closeButton = h.closeButton,
            R.closeButton === !1 || Qc(R.closeButton) ? nA.closeButton = R.closeButton : R.closeButton === !0 && (nA.closeButton = Qc(h.closeButton) ? h.closeButton : !0);
            let uA = {
                content: I,
                props: nA,
                staleId: k
            };
            h.limit && h.limit > 0 && u > h.limit && W ? c.push(uA) : al(q) ? setTimeout( () => {
                O(uA)
            }
            , q) : O(uA)
        }
        ,
        setProps(I) {
            h = I
        },
        setToggle: (I, R) => {
            let z = B.get(I);
            z && (z.toggle = R)
        }
        ,
        isToastActive: I => {
            var R;
            return (R = B.get(I)) == null ? void 0 : R.isActive
        }
        ,
        getSnapshot: () => f
    }
}
var ve = new Map
  , $r = []
  , wc = new Set
  , HU = a => wc.forEach(n => n(a))
  , m0 = () => ve.size > 0;
function xU() {
    $r.forEach(a => E0(a.content, a.options)),
    $r = []
}
var SU = (a, {containerId: n}) => {
    var i;
    return (i = ve.get(n || 1)) == null ? void 0 : i.toasts.get(a)
}
;
function F0(a, n) {
    var i;
    if (n)
        return !!((i = ve.get(n)) != null && i.isToastActive(a));
    let l = !1;
    return ve.forEach(u => {
        u.isToastActive(a) && (l = !0)
    }
    ),
    l
}
function TU(a) {
    if (!m0()) {
        $r = $r.filter(n => a != null && n.options.toastId !== a);
        return
    }
    if (a == null || UU(a))
        ve.forEach(n => {
            n.removeToast(a)
        }
        );
    else if (a && ("containerId"in a || "id"in a)) {
        let n = ve.get(a.containerId);
        n ? n.removeToast(a.id) : ve.forEach(i => {
            i.removeToast(a.id)
        }
        )
    }
}
var DU = (a={}) => {
    ve.forEach(n => {
        n.props.limit && (!a.containerId || n.id === a.containerId) && n.clearQueue()
    }
    )
}
;
function E0(a, n) {
    Qc(a) && (m0() || $r.push({
        content: a,
        options: n
    }),
    ve.forEach(i => {
        i.buildToast(a, n)
    }
    ))
}
function LU(a) {
    var n;
    (n = ve.get(a.containerId || 1)) == null || n.setToggle(a.id, a.fn)
}
function b0(a, n) {
    ve.forEach(i => {
        (n == null || !(n != null && n.containerId) || (n == null ? void 0 : n.containerId) === i.id) && i.toggle(a, n == null ? void 0 : n.id)
    }
    )
}
function IU(a) {
    let n = a.containerId || 1;
    return {
        subscribe(i) {
            let l = bU(n, a, HU);
            ve.set(n, l);
            let u = l.observe(i);
            return xU(),
            () => {
                u(),
                ve.delete(n)
            }
        },
        setProps(i) {
            var l;
            (l = ve.get(n)) == null || l.setProps(i)
        },
        getSnapshot() {
            var i;
            return (i = ve.get(n)) == null ? void 0 : i.getSnapshot()
        }
    }
}
function KU(a) {
    return wc.add(a),
    () => {
        wc.delete(a)
    }
}
function _U(a) {
    return a && (Oa(a.toastId) || al(a.toastId)) ? a.toastId : p0()
}
function nl(a, n) {
    return E0(a, n),
    n.toastId
}
function us(a, n) {
    return {
        ...n,
        type: n && n.type || a,
        toastId: _U(n)
    }
}
function os(a) {
    return (n, i) => nl(n, us(a, i))
}
function DA(a, n) {
    return nl(a, us("default", n))
}
DA.loading = (a, n) => nl(a, us("default", {
    isLoading: !0,
    autoClose: !1,
    closeOnClick: !1,
    closeButton: !1,
    draggable: !1,
    ...n
}));
function OU(a, {pending: n, error: i, success: l}, u) {
    let c;
    n && (c = Oa(n) ? DA.loading(n, u) : DA.loading(n.render, {
        ...u,
        ...n
    }));
    let f = {
        isLoading: null,
        autoClose: null,
        closeOnClick: null,
        closeButton: null,
        draggable: null
    }
      , h = (d, Q, C) => {
        if (Q == null) {
            DA.dismiss(c);
            return
        }
        let v = {
            type: d,
            ...f,
            ...u,
            data: C
        }
          , D = Oa(Q) ? {
            render: Q
        } : Q;
        return c ? DA.update(c, {
            ...v,
            ...D
        }) : DA(D.render, {
            ...v,
            ...D
        }),
        C
    }
      , B = Tt(a) ? a() : a;
    return B.then(d => h("success", l, d)).catch(d => h("error", i, d)),
    B
}
DA.promise = OU;
DA.success = os("success");
DA.info = os("info");
DA.error = os("error");
DA.warning = os("warning");
DA.warn = DA.warning;
DA.dark = (a, n) => nl(a, us("default", {
    theme: "dark",
    ...n
}));
function MU(a) {
    TU(a)
}
DA.dismiss = MU;
DA.clearWaitingQueue = DU;
DA.isActive = F0;
DA.update = (a, n={}) => {
    let i = SU(a, n);
    if (i) {
        let {props: l, content: u} = i
          , c = {
            delay: 100,
            ...l,
            ...n,
            toastId: n.toastId || a,
            updateId: p0()
        };
        c.toastId !== a && (c.staleId = a);
        let f = c.render || u;
        delete c.render,
        nl(f, c)
    }
}
;
DA.done = a => {
    DA.update(a, {
        progress: 1
    })
}
;
DA.onChange = KU;
DA.play = a => b0(!0, a);
DA.pause = a => b0(!1, a);
function NU(a) {
    var n;
    let {subscribe: i, getSnapshot: l, setProps: u} = Y.useRef(IU(a)).current;
    u(a);
    let c = (n = Y.useSyncExternalStore(i, l, l)) == null ? void 0 : n.slice();
    function f(h) {
        if (!c)
            return [];
        let B = new Map;
        return a.newestOnTop && c.reverse(),
        c.forEach(d => {
            let {position: Q} = d.props;
            B.has(Q) || B.set(Q, []),
            B.get(Q).push(d)
        }
        ),
        Array.from(B, d => h(d[0], d[1]))
    }
    return {
        getToastToRender: f,
        isToastActive: F0,
        count: c == null ? void 0 : c.length
    }
}
function RU(a) {
    let[n,i] = Y.useState(!1)
      , [l,u] = Y.useState(!1)
      , c = Y.useRef(null)
      , f = Y.useRef({
        start: 0,
        delta: 0,
        removalDistance: 0,
        canCloseOnClick: !0,
        canDrag: !1,
        didMove: !1
    }).current
      , {autoClose: h, pauseOnHover: B, closeToast: d, onClick: Q, closeOnClick: C} = a;
    LU({
        id: a.toastId,
        containerId: a.containerId,
        fn: i
    }),
    Y.useEffect( () => {
        if (a.pauseOnFocusLoss)
            return v(),
            () => {
                D()
            }
    }
    , [a.pauseOnFocusLoss]);
    function v() {
        document.hasFocus() || O(),
        window.addEventListener("focus", _),
        window.addEventListener("blur", O)
    }
    function D() {
        window.removeEventListener("focus", _),
        window.removeEventListener("blur", O)
    }
    function L(k) {
        if (a.draggable === !0 || a.draggable === k.pointerType) {
            I();
            let q = c.current;
            f.canCloseOnClick = !0,
            f.canDrag = !0,
            q.style.transition = "none",
            a.draggableDirection === "x" ? (f.start = k.clientX,
            f.removalDistance = q.offsetWidth * (a.draggablePercent / 100)) : (f.start = k.clientY,
            f.removalDistance = q.offsetHeight * (a.draggablePercent === 80 ? a.draggablePercent * 1.5 : a.draggablePercent) / 100)
        }
    }
    function x(k) {
        let {top: q, bottom: W, left: nA, right: uA} = c.current.getBoundingClientRect();
        k.nativeEvent.type !== "touchend" && a.pauseOnHover && k.clientX >= nA && k.clientX <= uA && k.clientY >= q && k.clientY <= W ? O() : _()
    }
    function _() {
        i(!0)
    }
    function O() {
        i(!1)
    }
    function I() {
        f.didMove = !1,
        document.addEventListener("pointermove", z),
        document.addEventListener("pointerup", X)
    }
    function R() {
        document.removeEventListener("pointermove", z),
        document.removeEventListener("pointerup", X)
    }
    function z(k) {
        let q = c.current;
        if (f.canDrag && q) {
            f.didMove = !0,
            n && O(),
            a.draggableDirection === "x" ? f.delta = k.clientX - f.start : f.delta = k.clientY - f.start,
            f.start !== k.clientX && (f.canCloseOnClick = !1);
            let W = a.draggableDirection === "x" ? `${f.delta}px, var(--y)` : `0, calc(${f.delta}px + var(--y))`;
            q.style.transform = `translate3d(${W},0)`,
            q.style.opacity = `${1 - Math.abs(f.delta / f.removalDistance)}`
        }
    }
    function X() {
        R();
        let k = c.current;
        if (f.canDrag && f.didMove && k) {
            if (f.canDrag = !1,
            Math.abs(f.delta) > f.removalDistance) {
                u(!0),
                a.closeToast(!0),
                a.collapseAll();
                return
            }
            k.style.transition = "transform 0.2s, opacity 0.2s",
            k.style.removeProperty("transform"),
            k.style.removeProperty("opacity")
        }
    }
    let V = {
        onPointerDown: L,
        onPointerUp: x
    };
    return h && B && (V.onMouseEnter = O,
    a.stacked || (V.onMouseLeave = _)),
    C && (V.onClick = k => {
        Q && Q(k),
        f.canCloseOnClick && d(!0)
    }
    ),
    {
        playToast: _,
        pauseToast: O,
        isRunning: n,
        preventExitTransition: l,
        toastRef: c,
        eventHandlers: V
    }
}
var GU = typeof window < "u" ? Y.useLayoutEffect : Y.useEffect
  , cs = ({theme: a, type: n, isLoading: i, ...l}) => OA.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "100%",
    height: "100%",
    fill: a === "colored" ? "currentColor" : `var(--toastify-icon-color-${n})`,
    ...l
});
function VU(a) {
    return OA.createElement(cs, {
        ...a
    }, OA.createElement("path", {
        d: "M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"
    }))
}
function XU(a) {
    return OA.createElement(cs, {
        ...a
    }, OA.createElement("path", {
        d: "M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"
    }))
}
function YU(a) {
    return OA.createElement(cs, {
        ...a
    }, OA.createElement("path", {
        d: "M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"
    }))
}
function zU(a) {
    return OA.createElement(cs, {
        ...a
    }, OA.createElement("path", {
        d: "M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"
    }))
}
function jU() {
    return OA.createElement("div", {
        className: "Toastify__spinner"
    })
}
var Cc = {
    info: XU,
    warning: VU,
    success: YU,
    error: zU,
    spinner: jU
}
  , JU = a => a in Cc;
function kU({theme: a, type: n, isLoading: i, icon: l}) {
    let u = null
      , c = {
        theme: a,
        type: n
    };
    return l === !1 || (Tt(l) ? u = l({
        ...c,
        isLoading: i
    }) : Y.isValidElement(l) ? u = Y.cloneElement(l, c) : i ? u = Cc.spinner() : JU(n) && (u = Cc[n](c))),
    u
}
var ZU = a => {
    let {isRunning: n, preventExitTransition: i, toastRef: l, eventHandlers: u, playToast: c} = RU(a)
      , {closeButton: f, children: h, autoClose: B, onClick: d, type: Q, hideProgressBar: C, closeToast: v, transition: D, position: L, className: x, style: _, progressClassName: O, updateId: I, role: R, progress: z, rtl: X, toastId: V, deleteToast: k, isIn: q, isLoading: W, closeOnClick: nA, theme: uA, ariaLabel: oA} = a
      , cA = Ia("Toastify__toast", `Toastify__toast-theme--${uA}`, `Toastify__toast--${Q}`, {
        "Toastify__toast--rtl": X
    }, {
        "Toastify__toast--close-on-click": nA
    })
      , mA = Tt(x) ? x({
        rtl: X,
        position: L,
        type: Q,
        defaultClassName: cA
    }) : Ia(cA, x)
      , FA = kU(a)
      , K = !!z || !B
      , j = {
        closeToast: v,
        type: Q,
        theme: uA
    }
      , AA = null;
    return f === !1 || (Tt(f) ? AA = f(j) : Y.isValidElement(f) ? AA = Y.cloneElement(f, j) : AA = mU(j)),
    OA.createElement(D, {
        isIn: q,
        done: k,
        position: L,
        preventExitTransition: i,
        nodeRef: l,
        playToast: c
    }, OA.createElement("div", {
        id: V,
        tabIndex: 0,
        onClick: d,
        "data-in": q,
        className: mA,
        ...u,
        style: _,
        ref: l,
        ...q && {
            role: R,
            "aria-label": oA
        }
    }, FA != null && OA.createElement("div", {
        className: Ia("Toastify__toast-icon", {
            "Toastify--animate-icon Toastify__zoom-enter": !W
        })
    }, FA), y0(h, a, !n), AA, !a.customProgressBar && OA.createElement(FU, {
        ...I && !K ? {
            key: `p-${I}`
        } : {},
        rtl: X,
        theme: uA,
        delay: B,
        isRunning: n,
        isIn: q,
        closeToast: v,
        hide: C,
        type: Q,
        className: O,
        controlledProgress: K,
        progress: z || 0
    })))
}
  , qU = (a, n=!1) => ({
    enter: `Toastify--animate Toastify__${a}-enter`,
    exit: `Toastify--animate Toastify__${a}-exit`,
    appendPosition: n
})
  , WU = pU(qU("bounce", !0))
  , PU = {
    position: "top-right",
    transition: WU,
    autoClose: 5e3,
    closeButton: !0,
    pauseOnHover: !0,
    pauseOnFocusLoss: !0,
    draggable: "touch",
    draggablePercent: 80,
    draggableDirection: "x",
    role: "alert",
    theme: "light",
    "aria-label": "Notifications Alt+T",
    hotKeys: a => a.altKey && a.code === "KeyT"
};
function $U(a) {
    let n = {
        ...PU,
        ...a
    }
      , i = a.stacked
      , [l,u] = Y.useState(!0)
      , c = Y.useRef(null)
      , {getToastToRender: f, isToastActive: h, count: B} = NU(n)
      , {className: d, style: Q, rtl: C, containerId: v, hotKeys: D} = n;
    function L(_) {
        let O = Ia("Toastify__toast-container", `Toastify__toast-container--${_}`, {
            "Toastify__toast-container--rtl": C
        });
        return Tt(d) ? d({
            position: _,
            rtl: C,
            defaultClassName: O
        }) : Ia(O, hc(d))
    }
    function x() {
        i && (u(!0),
        DA.play())
    }
    return GU( () => {
        var _;
        if (i) {
            let O = c.current.querySelectorAll('[data-in="true"]')
              , I = 12
              , R = (_ = n.position) == null ? void 0 : _.includes("top")
              , z = 0
              , X = 0;
            Array.from(O).reverse().forEach( (V, k) => {
                let q = V;
                q.classList.add("Toastify__toast--stacked"),
                k > 0 && (q.dataset.collapsed = `${l}`),
                q.dataset.pos || (q.dataset.pos = R ? "top" : "bot");
                let W = z * (l ? .2 : 1) + (l ? 0 : I * k);
                q.style.setProperty("--y", `${R ? W : W * -1}px`),
                q.style.setProperty("--g", `${I}`),
                q.style.setProperty("--s", `${1 - (l ? X : 0)}`),
                z += q.offsetHeight,
                X += .025
            }
            )
        }
    }
    , [l, B, i]),
    Y.useEffect( () => {
        function _(O) {
            var I;
            let R = c.current;
            D(O) && ((I = R.querySelector('[tabIndex="0"]')) == null || I.focus(),
            u(!1),
            DA.pause()),
            O.key === "Escape" && (document.activeElement === R || R != null && R.contains(document.activeElement)) && (u(!0),
            DA.play())
        }
        return document.addEventListener("keydown", _),
        () => {
            document.removeEventListener("keydown", _)
        }
    }
    , [D]),
    OA.createElement("section", {
        ref: c,
        className: "Toastify",
        id: v,
        onMouseEnter: () => {
            i && (u(!1),
            DA.pause())
        }
        ,
        onMouseLeave: x,
        "aria-live": "polite",
        "aria-atomic": "false",
        "aria-relevant": "additions text",
        "aria-label": n["aria-label"]
    }, f( (_, O) => {
        let I = O.length ? {
            ...Q
        } : {
            ...Q,
            pointerEvents: "none"
        };
        return OA.createElement("div", {
            tabIndex: -1,
            className: L(_),
            "data-stacked": i,
            style: I,
            key: `c-${_}`
        }, O.map( ({content: R, props: z}) => OA.createElement(ZU, {
            ...z,
            stacked: i,
            collapseAll: x,
            isIn: h(z.toastId, z.containerId),
            key: `t-${z.key}`
        }, R)))
    }
    ))
}
let Uc = [];
function Qe({title: a, text: n="", type: i="info"}) {
    Uc.push({
        title: a,
        text: n,
        type: i
    })
}
function Av() {
    const a = () => {
        for (; Uc.length > 0; ) {
            const n = Uc.shift();
            DA[n.type](U.jsxs("div", {
                children: [U.jsx("strong", {
                    children: n.title
                }), n.text && U.jsx("div", {
                    className: "text-xs mt-1",
                    children: n.text
                })]
            }))
        }
    }
    ;
    return Y.useEffect( () => {
        const n = setInterval(a, 500);
        return () => clearInterval(n)
    }
    , []),
    U.jsx($U, {
        position: "top-left",
        autoClose: 3e3,
        hideProgressBar: !1,
        newestOnTop: !0,
        closeOnClick: !0,
        rtl: !0,
        pauseOnFocusLoss: !0,
        draggable: !0,
        pauseOnHover: !0,
        theme: "dark",
        limit: 3
    })
}
const lh = "pip_value_cache"
  , ih = "margin_value_cache";
async function pi() {
    if (!document.cookie.includes("csrftoken="))
        try {
            await fetch("http://localhost:8001/api/csrf/", {
                credentials: "include"
            }),
            console.log("✅ CSRF token fetched and set.")
        } catch (n) {
            console.error("❌ Failed to fetch CSRF token:", n)
        }
}
function sh(a) {
    let i = et(a).replace(/[^0-9.]/g, "");
    const [l,u] = i.split(".");
    let c = l.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (u ? `${c}.${u}` : c).replace(/\d/g, B => "۰۱۲۳۴۵۶۷۸۹"[B])
}
const CA = a => {
    if (a == null || a === "")
        return "";
    const n = et(a)
      , [i,l] = n.split(".")
      , u = i.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (l !== void 0 ? `${u}.${l}` : u).replace(/\d/g, f => "۰۱۲۳۴۵۶۷۸۹"[f])
}
;
function et(a) {
    if (a == null || a === "")
        return "";
    const n = "۰۱۲۳۴۵۶۷۸۹";
    return String(a).replace(/[۰-۹]/g, i => "0123456789"[n.indexOf(i)]).replace(/,/g, "").replace(/٬/g, "")
}
function uh(a) {
    return a > 0 ? "text-green-400" : a < 0 ? "text-red-400" : "text-white"
}
function zo(a) {
    return a == "buy" ? "text-green-400" : a == "sell" ? "text-red-400" : "text-white"
}
async function ev() {
    const a = localStorage.getItem(lh);
    if (a)
        return Number(a);
    try {
        const n = await we("api/static-value/");
        if (n != null && n.pip_value)
            return localStorage.setItem(lh, n.pip_value),
            Number(n.pip_value)
    } catch (n) {
        console.error("❌ خطا در دریافت pip_value:", n.message)
    }
    return null
}
async function tv() {
    const a = localStorage.getItem(ih);
    if (a)
        return Number(a);
    try {
        const n = await we("api/static-value/");
        if (n != null && n.margin_per_unit)
            return localStorage.setItem(ih, n.margin_per_unit),
            Number(n.margin_per_unit)
    } catch (n) {
        console.error("❌ خطا در دریافت margin_per_unit:", n.message)
    }
    return null
}
function jo(a, n, i, l, u) {
    if (a == null || n == null || i == null || u == null || isNaN(a) || isNaN(n) || isNaN(i) || isNaN(u))
        return 0;
    const c = l === "buy" ? n - a : a - n;
    return Math.round(c * u * i)
}
const av = (a=768) => {
    const [n,i] = Y.useState( () => window.innerWidth <= a);
    return Y.useEffect( () => {
        const l = () => i(window.innerWidth <= a);
        return window.addEventListener("resize", l),
        () => window.removeEventListener("resize", l)
    }
    , [a]),
    n
}
;
function oh({mobile: a=!1, onOrderSuccess: n, selectedPrice: i}) {
    const [l,u] = Y.useState("lafz")
      , [c,f] = Y.useState(!1)
      , [h,B] = Y.useState(1)
      , [d,Q] = Y.useState("")
      , [C,v] = Y.useState("")
      , [D,L] = Y.useState("");
    Y.useEffect( () => {
        i && (u("order"),
        Q(i.toString()))
    }
    , [i]);
    const x = async _ => {
        try {
            const O = {
                order_type: l === "lafz" ? "verbal" : "limit",
                action: _,
                units: Number(et(h))
            };
            l === "order" && (O.price = Number(et(d))),
            c && (C && (O.take_profit = Number(et(C))),
            D && (O.stop_loss = Number(et(D)))),
            await we("api/order/create/", "POST", O),
            Qe({
                title: "موفقیت",
                text: "سفارش با موفقیت ثبت شد.",
                type: "success"
            }),
            n == null || n()
        } catch (O) {
            const I = O == null ? void 0 : O.message;
            let R = "خطای ناشناخته‌ای رخ داد.";
            Array.isArray(I) ? R = I.join(" ") : typeof I == "string" && (R = I.replace(/[\[\]']/g, "")),
            Qe({
                title: "خطا",
                text: R,
                type: "error"
            })
        }
    }
    ;
    return U.jsxs("div", {
        className: "bg-gray-800 rounded-xl p-4 flex flex-col gap-4",
        children: [U.jsxs("div", {
            className: `${a ? "flex flex-col gap-2" : "grid grid-cols-2 gap-2"}`,
            children: [U.jsx("button", {
                onClick: () => u("order"),
                className: `py-2 rounded-xl ${l === "order" ? "bg-blue-500" : "bg-gray-600"}`,
                children: "اوردر"
            }), U.jsx("button", {
                onClick: () => u("lafz"),
                className: `py-2 rounded-xl ${l === "lafz" ? "bg-blue-500" : "bg-gray-600"}`,
                children: "لفظ"
            })]
        }), U.jsxs("div", {
            className: "flex items-center gap-4",
            children: [U.jsx("label", {
                children: "حجم"
            }), U.jsx("input", {
                type: "text",
                value: CA(h),
                onChange: _ => B(CA(_.target.value)),
                placeholder: "حجم",
                className: "bg-gray-700 p-2 rounded-xl w-full"
            })]
        }), l === "order" && U.jsxs("div", {
            className: "flex items-center gap-4",
            children: [U.jsx("label", {
                children: "قیمت"
            }), U.jsx("input", {
                type: "text",
                value: CA(d),
                placeholder: "قیمت",
                onChange: _ => Q(CA(_.target.value)),
                className: "bg-gray-700 p-2 rounded-xl w-full"
            })]
        }), U.jsxs("label", {
            className: "text-sm flex items-center gap-2 cursor-pointer select-none",
            children: [U.jsx("input", {
                type: "checkbox",
                checked: c,
                onChange: () => f(!c)
            }), "حد سود و ضرر"]
        }), c && U.jsxs("div", {
            className: `${a ? "flex flex-col gap-2" : "grid grid-cols-2 gap-2"}`,
            children: [U.jsx("input", {
                type: "text",
                placeholder: "حد سود",
                value: CA(C),
                onChange: _ => v(CA(_.target.value)),
                className: "bg-gray-700 p-2 rounded-xl w-full"
            }), U.jsx("input", {
                type: "text",
                placeholder: "حد ضرر",
                value: CA(D),
                onChange: _ => L(CA(_.target.value)),
                className: "bg-gray-700 p-2 rounded-xl w-full"
            })]
        }), U.jsxs("div", {
            className: `${a ? "flex flex-col gap-2" : "grid grid-cols-2 gap-2"}`,
            children: [U.jsx("button", {
                className: "bg-green-500 hover:bg-green-600 py-2 rounded-xl w-full",
                onClick: () => x("buy"),
                children: "خرید"
            }), U.jsx("button", {
                className: "bg-red-600 hover:bg-red-700 py-2 rounded-xl w-full",
                onClick: () => x("sell"),
                children: "فروش"
            })]
        })]
    })
}
const H0 = Y.createContext(null);
function nv({children: a}) {
    const [n,i] = Y.useState(null);
    return U.jsx(H0.Provider, {
        value: {
            price: n,
            setPrice: i
        },
        children: a
    })
}
function Jc() {
    return Y.useContext(H0)
}
const bt = {};
function vc(a, n, i, l=1 / 0, u=3e3) {
    const c = window.location
      , f = c.hostname === "localhost" || c.hostname === "127.0.0.1"
      , h = c.hostname
      , B = window.location.protocol === "https:" ? "wss" : "ws";
    let d = "";
    f ? d = `${B}://localhost:9001${a}` : d = `${B}://${h.replace(/\:\d+$/, "")}/ounce${a}`;
    let Q = 0;
    const C = () => {
        if (bt[d] && bt[d].readyState < 2)
            return bt[d];
        if (bt[d]) {
            try {
                bt[d].close()
            } catch {}
            delete bt[d]
        }
        const v = new WebSocket(d);
        v.onmessage = D => {
            const L = JSON.parse(D.data);
            n == null || n(L)
        }
        ,
        v.onopen = () => {
            console.log(`✅ Connected to ${a}`),
            Q = 0
        }
        ,
        v.onclose = () => {
            delete bt[d],
            Q < l && (Q++,
            Q > 5 && Qe({
                title: "عدم اتصال",
                text: "در حال تلاش برای اتصال مجدد...",
                type: "info"
            }),
            setTimeout(C, u))
        }
        ,
        v.onerror = D => {
            console.error(`⚠️ Error on WebSocket (${a}):`, D)
        }
        ,
        bt[d] = v
    }
    ;
    return C(),
    bt[d]
}
/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rv = a => a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
  , lv = a => a.replace(/^([A-Z])|[\s-_]+(\w)/g, (n, i, l) => l ? l.toUpperCase() : i.toLowerCase())
  , ch = a => {
    const n = lv(a);
    return n.charAt(0).toUpperCase() + n.slice(1)
}
  , x0 = (...a) => a.filter( (n, i, l) => !!n && n.trim() !== "" && l.indexOf(n) === i).join(" ").trim()
  , iv = a => {
    for (const n in a)
        if (n.startsWith("aria-") || n === "role" || n === "title")
            return !0
}
;
/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var sv = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const uv = Y.forwardRef( ({color: a="currentColor", size: n=24, strokeWidth: i=2, absoluteStrokeWidth: l, className: u="", children: c, iconNode: f, ...h}, B) => Y.createElement("svg", {
    ref: B,
    ...sv,
    width: n,
    height: n,
    stroke: a,
    strokeWidth: l ? Number(i) * 24 / Number(n) : i,
    className: x0("lucide", u),
    ...!c && !iv(h) && {
        "aria-hidden": "true"
    },
    ...h
}, [...f.map( ([d,Q]) => Y.createElement(d, Q)), ...Array.isArray(c) ? c : [c]]));
/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fs = (a, n) => {
    const i = Y.forwardRef( ({className: l, ...u}, c) => Y.createElement(uv, {
        ref: c,
        iconNode: n,
        className: x0(`lucide-${rv(ch(a))}`, `lucide-${a}`, l),
        ...u
    }));
    return i.displayName = ch(a),
    i
}
;
/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ov = [["path", {
    d: "M10.268 21a2 2 0 0 0 3.464 0",
    key: "vwvbt9"
}], ["path", {
    d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
    key: "11g9vi"
}]]
  , cv = fs("bell", ov);
/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fv = [["path", {
    d: "M4 12h16",
    key: "1lakjw"
}], ["path", {
    d: "M4 18h16",
    key: "19g7jn"
}], ["path", {
    d: "M4 6h16",
    key: "1o0s65"
}]]
  , Bv = fs("menu", fv);
/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gv = [["circle", {
    cx: "18",
    cy: "5",
    r: "3",
    key: "gq8acd"
}], ["circle", {
    cx: "6",
    cy: "12",
    r: "3",
    key: "w7nqdw"
}], ["circle", {
    cx: "18",
    cy: "19",
    r: "3",
    key: "1xt0gg"
}], ["line", {
    x1: "8.59",
    x2: "15.42",
    y1: "13.51",
    y2: "17.49",
    key: "47mynk"
}], ["line", {
    x1: "15.41",
    x2: "8.59",
    y1: "6.51",
    y2: "10.49",
    key: "1n3mei"
}]]
  , fh = fs("share-2", gv);
/**
 * @license lucide-react v0.508.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const dv = [["path", {
    d: "M18 6 6 18",
    key: "1bl5f8"
}], ["path", {
    d: "m6 6 12 12",
    key: "d8bk6v"
}]]
  , hv = fs("x", dv);
/*!
 * html2canvas 1.4.1 <https://html2canvas.hertzen.com>
 * Copyright (c) 2022 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var yc = function(a, n) {
    return yc = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(i, l) {
        i.__proto__ = l
    }
    || function(i, l) {
        for (var u in l)
            Object.prototype.hasOwnProperty.call(l, u) && (i[u] = l[u])
    }
    ,
    yc(a, n)
};
function tt(a, n) {
    if (typeof n != "function" && n !== null)
        throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
    yc(a, n);
    function i() {
        this.constructor = a
    }
    a.prototype = n === null ? Object.create(n) : (i.prototype = n.prototype,
    new i)
}
var pc = function() {
    return pc = Object.assign || function(n) {
        for (var i, l = 1, u = arguments.length; l < u; l++) {
            i = arguments[l];
            for (var c in i)
                Object.prototype.hasOwnProperty.call(i, c) && (n[c] = i[c])
        }
        return n
    }
    ,
    pc.apply(this, arguments)
};
function Ue(a, n, i, l) {
    function u(c) {
        return c instanceof i ? c : new i(function(f) {
            f(c)
        }
        )
    }
    return new (i || (i = Promise))(function(c, f) {
        function h(Q) {
            try {
                d(l.next(Q))
            } catch (C) {
                f(C)
            }
        }
        function B(Q) {
            try {
                d(l.throw(Q))
            } catch (C) {
                f(C)
            }
        }
        function d(Q) {
            Q.done ? c(Q.value) : u(Q.value).then(h, B)
        }
        d((l = l.apply(a, [])).next())
    }
    )
}
function de(a, n) {
    var i = {
        label: 0,
        sent: function() {
            if (c[0] & 1)
                throw c[1];
            return c[1]
        },
        trys: [],
        ops: []
    }, l, u, c, f;
    return f = {
        next: h(0),
        throw: h(1),
        return: h(2)
    },
    typeof Symbol == "function" && (f[Symbol.iterator] = function() {
        return this
    }
    ),
    f;
    function h(d) {
        return function(Q) {
            return B([d, Q])
        }
    }
    function B(d) {
        if (l)
            throw new TypeError("Generator is already executing.");
        for (; i; )
            try {
                if (l = 1,
                u && (c = d[0] & 2 ? u.return : d[0] ? u.throw || ((c = u.return) && c.call(u),
                0) : u.next) && !(c = c.call(u, d[1])).done)
                    return c;
                switch (u = 0,
                c && (d = [d[0] & 2, c.value]),
                d[0]) {
                case 0:
                case 1:
                    c = d;
                    break;
                case 4:
                    return i.label++,
                    {
                        value: d[1],
                        done: !1
                    };
                case 5:
                    i.label++,
                    u = d[1],
                    d = [0];
                    continue;
                case 7:
                    d = i.ops.pop(),
                    i.trys.pop();
                    continue;
                default:
                    if (c = i.trys,
                    !(c = c.length > 0 && c[c.length - 1]) && (d[0] === 6 || d[0] === 2)) {
                        i = 0;
                        continue
                    }
                    if (d[0] === 3 && (!c || d[1] > c[0] && d[1] < c[3])) {
                        i.label = d[1];
                        break
                    }
                    if (d[0] === 6 && i.label < c[1]) {
                        i.label = c[1],
                        c = d;
                        break
                    }
                    if (c && i.label < c[2]) {
                        i.label = c[2],
                        i.ops.push(d);
                        break
                    }
                    c[2] && i.ops.pop(),
                    i.trys.pop();
                    continue
                }
                d = n.call(a, i)
            } catch (Q) {
                d = [6, Q],
                u = 0
            } finally {
                l = c = 0
            }
        if (d[0] & 5)
            throw d[1];
        return {
            value: d[0] ? d[1] : void 0,
            done: !0
        }
    }
}
function mi(a, n, i) {
    if (arguments.length === 2)
        for (var l = 0, u = n.length, c; l < u; l++)
            (c || !(l in n)) && (c || (c = Array.prototype.slice.call(n, 0, l)),
            c[l] = n[l]);
    return a.concat(c || n)
}
var Dt = function() {
    function a(n, i, l, u) {
        this.left = n,
        this.top = i,
        this.width = l,
        this.height = u
    }
    return a.prototype.add = function(n, i, l, u) {
        return new a(this.left + n,this.top + i,this.width + l,this.height + u)
    }
    ,
    a.fromClientRect = function(n, i) {
        return new a(i.left + n.windowBounds.left,i.top + n.windowBounds.top,i.width,i.height)
    }
    ,
    a.fromDOMRectList = function(n, i) {
        var l = Array.from(i).find(function(u) {
            return u.width !== 0
        });
        return l ? new a(l.left + n.windowBounds.left,l.top + n.windowBounds.top,l.width,l.height) : a.EMPTY
    }
    ,
    a.EMPTY = new a(0,0,0,0),
    a
}()
  , Bs = function(a, n) {
    return Dt.fromClientRect(a, n.getBoundingClientRect())
}
  , Qv = function(a) {
    var n = a.body
      , i = a.documentElement;
    if (!n || !i)
        throw new Error("Unable to get document size");
    var l = Math.max(Math.max(n.scrollWidth, i.scrollWidth), Math.max(n.offsetWidth, i.offsetWidth), Math.max(n.clientWidth, i.clientWidth))
      , u = Math.max(Math.max(n.scrollHeight, i.scrollHeight), Math.max(n.offsetHeight, i.offsetHeight), Math.max(n.clientHeight, i.clientHeight));
    return new Dt(0,0,l,u)
}
  , gs = function(a) {
    for (var n = [], i = 0, l = a.length; i < l; ) {
        var u = a.charCodeAt(i++);
        if (u >= 55296 && u <= 56319 && i < l) {
            var c = a.charCodeAt(i++);
            (c & 64512) === 56320 ? n.push(((u & 1023) << 10) + (c & 1023) + 65536) : (n.push(u),
            i--)
        } else
            n.push(u)
    }
    return n
}
  , JA = function() {
    for (var a = [], n = 0; n < arguments.length; n++)
        a[n] = arguments[n];
    if (String.fromCodePoint)
        return String.fromCodePoint.apply(String, a);
    var i = a.length;
    if (!i)
        return "";
    for (var l = [], u = -1, c = ""; ++u < i; ) {
        var f = a[u];
        f <= 65535 ? l.push(f) : (f -= 65536,
        l.push((f >> 10) + 55296, f % 1024 + 56320)),
        (u + 1 === i || l.length > 16384) && (c += String.fromCharCode.apply(String, l),
        l.length = 0)
    }
    return c
}
  , Bh = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  , wv = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Fi = 0; Fi < Bh.length; Fi++)
    wv[Bh.charCodeAt(Fi)] = Fi;
var gh = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  , Rr = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Ei = 0; Ei < gh.length; Ei++)
    Rr[gh.charCodeAt(Ei)] = Ei;
var Cv = function(a) {
    var n = a.length * .75, i = a.length, l, u = 0, c, f, h, B;
    a[a.length - 1] === "=" && (n--,
    a[a.length - 2] === "=" && n--);
    var d = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(n) : new Array(n)
      , Q = Array.isArray(d) ? d : new Uint8Array(d);
    for (l = 0; l < i; l += 4)
        c = Rr[a.charCodeAt(l)],
        f = Rr[a.charCodeAt(l + 1)],
        h = Rr[a.charCodeAt(l + 2)],
        B = Rr[a.charCodeAt(l + 3)],
        Q[u++] = c << 2 | f >> 4,
        Q[u++] = (f & 15) << 4 | h >> 2,
        Q[u++] = (h & 3) << 6 | B & 63;
    return d
}
  , Uv = function(a) {
    for (var n = a.length, i = [], l = 0; l < n; l += 2)
        i.push(a[l + 1] << 8 | a[l]);
    return i
}
  , vv = function(a) {
    for (var n = a.length, i = [], l = 0; l < n; l += 4)
        i.push(a[l + 3] << 24 | a[l + 2] << 16 | a[l + 1] << 8 | a[l]);
    return i
}
  , Ka = 5
  , kc = 11
  , Jo = 2
  , yv = kc - Ka
  , S0 = 65536 >> Ka
  , pv = 1 << Ka
  , ko = pv - 1
  , mv = 1024 >> Ka
  , Fv = S0 + mv
  , Ev = Fv
  , bv = 32
  , Hv = Ev + bv
  , xv = 65536 >> kc
  , Sv = 1 << yv
  , Tv = Sv - 1
  , dh = function(a, n, i) {
    return a.slice ? a.slice(n, i) : new Uint16Array(Array.prototype.slice.call(a, n, i))
}
  , Dv = function(a, n, i) {
    return a.slice ? a.slice(n, i) : new Uint32Array(Array.prototype.slice.call(a, n, i))
}
  , Lv = function(a, n) {
    var i = Cv(a)
      , l = Array.isArray(i) ? vv(i) : new Uint32Array(i)
      , u = Array.isArray(i) ? Uv(i) : new Uint16Array(i)
      , c = 24
      , f = dh(u, c / 2, l[4] / 2)
      , h = l[5] === 2 ? dh(u, (c + l[4]) / 2) : Dv(l, Math.ceil((c + l[4]) / 4));
    return new Iv(l[0],l[1],l[2],l[3],f,h)
}
  , Iv = function() {
    function a(n, i, l, u, c, f) {
        this.initialValue = n,
        this.errorValue = i,
        this.highStart = l,
        this.highValueIndex = u,
        this.index = c,
        this.data = f
    }
    return a.prototype.get = function(n) {
        var i;
        if (n >= 0) {
            if (n < 55296 || n > 56319 && n <= 65535)
                return i = this.index[n >> Ka],
                i = (i << Jo) + (n & ko),
                this.data[i];
            if (n <= 65535)
                return i = this.index[S0 + (n - 55296 >> Ka)],
                i = (i << Jo) + (n & ko),
                this.data[i];
            if (n < this.highStart)
                return i = Hv - xv + (n >> kc),
                i = this.index[i],
                i += n >> Ka & Tv,
                i = this.index[i],
                i = (i << Jo) + (n & ko),
                this.data[i];
            if (n <= 1114111)
                return this.data[this.highValueIndex]
        }
        return this.errorValue
    }
    ,
    a
}()
  , hh = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  , Kv = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var bi = 0; bi < hh.length; bi++)
    Kv[hh.charCodeAt(bi)] = bi;
var _v = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA=="
  , Qh = 50
  , Ov = 1
  , T0 = 2
  , D0 = 3
  , Mv = 4
  , Nv = 5
  , wh = 7
  , L0 = 8
  , Ch = 9
  , ia = 10
  , mc = 11
  , Uh = 12
  , Fc = 13
  , Rv = 14
  , Gr = 15
  , Ec = 16
  , Hi = 17
  , _r = 18
  , Gv = 19
  , vh = 20
  , bc = 21
  , Or = 22
  , Zo = 23
  , mn = 24
  , Oe = 25
  , Vr = 26
  , Xr = 27
  , Fn = 28
  , Vv = 29
  , Da = 30
  , Xv = 31
  , xi = 32
  , Si = 33
  , Hc = 34
  , xc = 35
  , Sc = 36
  , Al = 37
  , Tc = 38
  , Ji = 39
  , ki = 40
  , qo = 41
  , I0 = 42
  , Yv = 43
  , zv = [9001, 65288]
  , K0 = "!"
  , UA = "×"
  , Ti = "÷"
  , Dc = Lv(_v)
  , Ht = [Da, Sc]
  , Lc = [Ov, T0, D0, Nv]
  , _0 = [ia, L0]
  , yh = [Xr, Vr]
  , jv = Lc.concat(_0)
  , ph = [Tc, Ji, ki, Hc, xc]
  , Jv = [Gr, Fc]
  , kv = function(a, n) {
    n === void 0 && (n = "strict");
    var i = []
      , l = []
      , u = [];
    return a.forEach(function(c, f) {
        var h = Dc.get(c);
        if (h > Qh ? (u.push(!0),
        h -= Qh) : u.push(!1),
        ["normal", "auto", "loose"].indexOf(n) !== -1 && [8208, 8211, 12316, 12448].indexOf(c) !== -1)
            return l.push(f),
            i.push(Ec);
        if (h === Mv || h === mc) {
            if (f === 0)
                return l.push(f),
                i.push(Da);
            var B = i[f - 1];
            return jv.indexOf(B) === -1 ? (l.push(l[f - 1]),
            i.push(B)) : (l.push(f),
            i.push(Da))
        }
        if (l.push(f),
        h === Xv)
            return i.push(n === "strict" ? bc : Al);
        if (h === I0 || h === Vv)
            return i.push(Da);
        if (h === Yv)
            return c >= 131072 && c <= 196605 || c >= 196608 && c <= 262141 ? i.push(Al) : i.push(Da);
        i.push(h)
    }),
    [l, i, u]
}
  , Wo = function(a, n, i, l) {
    var u = l[i];
    if (Array.isArray(a) ? a.indexOf(u) !== -1 : a === u)
        for (var c = i; c <= l.length; ) {
            c++;
            var f = l[c];
            if (f === n)
                return !0;
            if (f !== ia)
                break
        }
    if (u === ia)
        for (var c = i; c > 0; ) {
            c--;
            var h = l[c];
            if (Array.isArray(a) ? a.indexOf(h) !== -1 : a === h)
                for (var B = i; B <= l.length; ) {
                    B++;
                    var f = l[B];
                    if (f === n)
                        return !0;
                    if (f !== ia)
                        break
                }
            if (h !== ia)
                break
        }
    return !1
}
  , mh = function(a, n) {
    for (var i = a; i >= 0; ) {
        var l = n[i];
        if (l === ia)
            i--;
        else
            return l
    }
    return 0
}
  , Zv = function(a, n, i, l, u) {
    if (i[l] === 0)
        return UA;
    var c = l - 1;
    if (Array.isArray(u) && u[c] === !0)
        return UA;
    var f = c - 1
      , h = c + 1
      , B = n[c]
      , d = f >= 0 ? n[f] : 0
      , Q = n[h];
    if (B === T0 && Q === D0)
        return UA;
    if (Lc.indexOf(B) !== -1)
        return K0;
    if (Lc.indexOf(Q) !== -1 || _0.indexOf(Q) !== -1)
        return UA;
    if (mh(c, n) === L0)
        return Ti;
    if (Dc.get(a[c]) === mc || (B === xi || B === Si) && Dc.get(a[h]) === mc || B === wh || Q === wh || B === Ch || [ia, Fc, Gr].indexOf(B) === -1 && Q === Ch || [Hi, _r, Gv, mn, Fn].indexOf(Q) !== -1 || mh(c, n) === Or || Wo(Zo, Or, c, n) || Wo([Hi, _r], bc, c, n) || Wo(Uh, Uh, c, n))
        return UA;
    if (B === ia)
        return Ti;
    if (B === Zo || Q === Zo)
        return UA;
    if (Q === Ec || B === Ec)
        return Ti;
    if ([Fc, Gr, bc].indexOf(Q) !== -1 || B === Rv || d === Sc && Jv.indexOf(B) !== -1 || B === Fn && Q === Sc || Q === vh || Ht.indexOf(Q) !== -1 && B === Oe || Ht.indexOf(B) !== -1 && Q === Oe || B === Xr && [Al, xi, Si].indexOf(Q) !== -1 || [Al, xi, Si].indexOf(B) !== -1 && Q === Vr || Ht.indexOf(B) !== -1 && yh.indexOf(Q) !== -1 || yh.indexOf(B) !== -1 && Ht.indexOf(Q) !== -1 || [Xr, Vr].indexOf(B) !== -1 && (Q === Oe || [Or, Gr].indexOf(Q) !== -1 && n[h + 1] === Oe) || [Or, Gr].indexOf(B) !== -1 && Q === Oe || B === Oe && [Oe, Fn, mn].indexOf(Q) !== -1)
        return UA;
    if ([Oe, Fn, mn, Hi, _r].indexOf(Q) !== -1)
        for (var C = c; C >= 0; ) {
            var v = n[C];
            if (v === Oe)
                return UA;
            if ([Fn, mn].indexOf(v) !== -1)
                C--;
            else
                break
        }
    if ([Xr, Vr].indexOf(Q) !== -1)
        for (var C = [Hi, _r].indexOf(B) !== -1 ? f : c; C >= 0; ) {
            var v = n[C];
            if (v === Oe)
                return UA;
            if ([Fn, mn].indexOf(v) !== -1)
                C--;
            else
                break
        }
    if (Tc === B && [Tc, Ji, Hc, xc].indexOf(Q) !== -1 || [Ji, Hc].indexOf(B) !== -1 && [Ji, ki].indexOf(Q) !== -1 || [ki, xc].indexOf(B) !== -1 && Q === ki || ph.indexOf(B) !== -1 && [vh, Vr].indexOf(Q) !== -1 || ph.indexOf(Q) !== -1 && B === Xr || Ht.indexOf(B) !== -1 && Ht.indexOf(Q) !== -1 || B === mn && Ht.indexOf(Q) !== -1 || Ht.concat(Oe).indexOf(B) !== -1 && Q === Or && zv.indexOf(a[h]) === -1 || Ht.concat(Oe).indexOf(Q) !== -1 && B === _r)
        return UA;
    if (B === qo && Q === qo) {
        for (var D = i[c], L = 1; D > 0 && (D--,
        n[D] === qo); )
            L++;
        if (L % 2 !== 0)
            return UA
    }
    return B === xi && Q === Si ? UA : Ti
}
  , qv = function(a, n) {
    n || (n = {
        lineBreak: "normal",
        wordBreak: "normal"
    });
    var i = kv(a, n.lineBreak)
      , l = i[0]
      , u = i[1]
      , c = i[2];
    (n.wordBreak === "break-all" || n.wordBreak === "break-word") && (u = u.map(function(h) {
        return [Oe, Da, I0].indexOf(h) !== -1 ? Al : h
    }));
    var f = n.wordBreak === "keep-all" ? c.map(function(h, B) {
        return h && a[B] >= 19968 && a[B] <= 40959
    }) : void 0;
    return [l, u, f]
}
  , Wv = function() {
    function a(n, i, l, u) {
        this.codePoints = n,
        this.required = i === K0,
        this.start = l,
        this.end = u
    }
    return a.prototype.slice = function() {
        return JA.apply(void 0, this.codePoints.slice(this.start, this.end))
    }
    ,
    a
}()
  , Pv = function(a, n) {
    var i = gs(a)
      , l = qv(i, n)
      , u = l[0]
      , c = l[1]
      , f = l[2]
      , h = i.length
      , B = 0
      , d = 0;
    return {
        next: function() {
            if (d >= h)
                return {
                    done: !0,
                    value: null
                };
            for (var Q = UA; d < h && (Q = Zv(i, c, u, ++d, f)) === UA; )
                ;
            if (Q !== UA || d === h) {
                var C = new Wv(i,Q,B,d);
                return B = d,
                {
                    value: C,
                    done: !1
                }
            }
            return {
                done: !0,
                value: null
            }
        }
    }
}
  , $v = 1
  , Ay = 2
  , rl = 4
  , Fh = 8
  , Pi = 10
  , Eh = 47
  , Jr = 92
  , ey = 9
  , ty = 32
  , Di = 34
  , Mr = 61
  , ay = 35
  , ny = 36
  , ry = 37
  , Li = 39
  , Ii = 40
  , Nr = 41
  , ly = 95
  , be = 45
  , iy = 33
  , sy = 60
  , uy = 62
  , oy = 64
  , cy = 91
  , fy = 93
  , By = 61
  , gy = 123
  , Ki = 63
  , dy = 125
  , bh = 124
  , hy = 126
  , Qy = 128
  , Hh = 65533
  , Po = 42
  , La = 43
  , wy = 44
  , Cy = 58
  , Uy = 59
  , el = 46
  , vy = 0
  , yy = 8
  , py = 11
  , my = 14
  , Fy = 31
  , Ey = 127
  , ut = -1
  , O0 = 48
  , M0 = 97
  , N0 = 101
  , by = 102
  , Hy = 117
  , xy = 122
  , R0 = 65
  , G0 = 69
  , V0 = 70
  , Sy = 85
  , Ty = 90
  , he = function(a) {
    return a >= O0 && a <= 57
}
  , Dy = function(a) {
    return a >= 55296 && a <= 57343
}
  , En = function(a) {
    return he(a) || a >= R0 && a <= V0 || a >= M0 && a <= by
}
  , Ly = function(a) {
    return a >= M0 && a <= xy
}
  , Iy = function(a) {
    return a >= R0 && a <= Ty
}
  , Ky = function(a) {
    return Ly(a) || Iy(a)
}
  , _y = function(a) {
    return a >= Qy
}
  , _i = function(a) {
    return a === Pi || a === ey || a === ty
}
  , $i = function(a) {
    return Ky(a) || _y(a) || a === ly
}
  , xh = function(a) {
    return $i(a) || he(a) || a === be
}
  , Oy = function(a) {
    return a >= vy && a <= yy || a === py || a >= my && a <= Fy || a === Ey
}
  , la = function(a, n) {
    return a !== Jr ? !1 : n !== Pi
}
  , Oi = function(a, n, i) {
    return a === be ? $i(n) || la(n, i) : $i(a) ? !0 : !!(a === Jr && la(a, n))
}
  , $o = function(a, n, i) {
    return a === La || a === be ? he(n) ? !0 : n === el && he(i) : he(a === el ? n : a)
}
  , My = function(a) {
    var n = 0
      , i = 1;
    (a[n] === La || a[n] === be) && (a[n] === be && (i = -1),
    n++);
    for (var l = []; he(a[n]); )
        l.push(a[n++]);
    var u = l.length ? parseInt(JA.apply(void 0, l), 10) : 0;
    a[n] === el && n++;
    for (var c = []; he(a[n]); )
        c.push(a[n++]);
    var f = c.length
      , h = f ? parseInt(JA.apply(void 0, c), 10) : 0;
    (a[n] === G0 || a[n] === N0) && n++;
    var B = 1;
    (a[n] === La || a[n] === be) && (a[n] === be && (B = -1),
    n++);
    for (var d = []; he(a[n]); )
        d.push(a[n++]);
    var Q = d.length ? parseInt(JA.apply(void 0, d), 10) : 0;
    return i * (u + h * Math.pow(10, -f)) * Math.pow(10, B * Q)
}
  , Ny = {
    type: 2
}
  , Ry = {
    type: 3
}
  , Gy = {
    type: 4
}
  , Vy = {
    type: 13
}
  , Xy = {
    type: 8
}
  , Yy = {
    type: 21
}
  , zy = {
    type: 9
}
  , jy = {
    type: 10
}
  , Jy = {
    type: 11
}
  , ky = {
    type: 12
}
  , Zy = {
    type: 14
}
  , Mi = {
    type: 23
}
  , qy = {
    type: 1
}
  , Wy = {
    type: 25
}
  , Py = {
    type: 24
}
  , $y = {
    type: 26
}
  , Ap = {
    type: 27
}
  , ep = {
    type: 28
}
  , tp = {
    type: 29
}
  , ap = {
    type: 31
}
  , Ic = {
    type: 32
}
  , X0 = function() {
    function a() {
        this._value = []
    }
    return a.prototype.write = function(n) {
        this._value = this._value.concat(gs(n))
    }
    ,
    a.prototype.read = function() {
        for (var n = [], i = this.consumeToken(); i !== Ic; )
            n.push(i),
            i = this.consumeToken();
        return n
    }
    ,
    a.prototype.consumeToken = function() {
        var n = this.consumeCodePoint();
        switch (n) {
        case Di:
            return this.consumeStringToken(Di);
        case ay:
            var i = this.peekCodePoint(0)
              , l = this.peekCodePoint(1)
              , u = this.peekCodePoint(2);
            if (xh(i) || la(l, u)) {
                var c = Oi(i, l, u) ? Ay : $v
                  , f = this.consumeName();
                return {
                    type: 5,
                    value: f,
                    flags: c
                }
            }
            break;
        case ny:
            if (this.peekCodePoint(0) === Mr)
                return this.consumeCodePoint(),
                Vy;
            break;
        case Li:
            return this.consumeStringToken(Li);
        case Ii:
            return Ny;
        case Nr:
            return Ry;
        case Po:
            if (this.peekCodePoint(0) === Mr)
                return this.consumeCodePoint(),
                Zy;
            break;
        case La:
            if ($o(n, this.peekCodePoint(0), this.peekCodePoint(1)))
                return this.reconsumeCodePoint(n),
                this.consumeNumericToken();
            break;
        case wy:
            return Gy;
        case be:
            var h = n
              , B = this.peekCodePoint(0)
              , d = this.peekCodePoint(1);
            if ($o(h, B, d))
                return this.reconsumeCodePoint(n),
                this.consumeNumericToken();
            if (Oi(h, B, d))
                return this.reconsumeCodePoint(n),
                this.consumeIdentLikeToken();
            if (B === be && d === uy)
                return this.consumeCodePoint(),
                this.consumeCodePoint(),
                Py;
            break;
        case el:
            if ($o(n, this.peekCodePoint(0), this.peekCodePoint(1)))
                return this.reconsumeCodePoint(n),
                this.consumeNumericToken();
            break;
        case Eh:
            if (this.peekCodePoint(0) === Po)
                for (this.consumeCodePoint(); ; ) {
                    var Q = this.consumeCodePoint();
                    if (Q === Po && (Q = this.consumeCodePoint(),
                    Q === Eh))
                        return this.consumeToken();
                    if (Q === ut)
                        return this.consumeToken()
                }
            break;
        case Cy:
            return $y;
        case Uy:
            return Ap;
        case sy:
            if (this.peekCodePoint(0) === iy && this.peekCodePoint(1) === be && this.peekCodePoint(2) === be)
                return this.consumeCodePoint(),
                this.consumeCodePoint(),
                Wy;
            break;
        case oy:
            var C = this.peekCodePoint(0)
              , v = this.peekCodePoint(1)
              , D = this.peekCodePoint(2);
            if (Oi(C, v, D)) {
                var f = this.consumeName();
                return {
                    type: 7,
                    value: f
                }
            }
            break;
        case cy:
            return ep;
        case Jr:
            if (la(n, this.peekCodePoint(0)))
                return this.reconsumeCodePoint(n),
                this.consumeIdentLikeToken();
            break;
        case fy:
            return tp;
        case By:
            if (this.peekCodePoint(0) === Mr)
                return this.consumeCodePoint(),
                Xy;
            break;
        case gy:
            return Jy;
        case dy:
            return ky;
        case Hy:
        case Sy:
            var L = this.peekCodePoint(0)
              , x = this.peekCodePoint(1);
            return L === La && (En(x) || x === Ki) && (this.consumeCodePoint(),
            this.consumeUnicodeRangeToken()),
            this.reconsumeCodePoint(n),
            this.consumeIdentLikeToken();
        case bh:
            if (this.peekCodePoint(0) === Mr)
                return this.consumeCodePoint(),
                zy;
            if (this.peekCodePoint(0) === bh)
                return this.consumeCodePoint(),
                Yy;
            break;
        case hy:
            if (this.peekCodePoint(0) === Mr)
                return this.consumeCodePoint(),
                jy;
            break;
        case ut:
            return Ic
        }
        return _i(n) ? (this.consumeWhiteSpace(),
        ap) : he(n) ? (this.reconsumeCodePoint(n),
        this.consumeNumericToken()) : $i(n) ? (this.reconsumeCodePoint(n),
        this.consumeIdentLikeToken()) : {
            type: 6,
            value: JA(n)
        }
    }
    ,
    a.prototype.consumeCodePoint = function() {
        var n = this._value.shift();
        return typeof n > "u" ? -1 : n
    }
    ,
    a.prototype.reconsumeCodePoint = function(n) {
        this._value.unshift(n)
    }
    ,
    a.prototype.peekCodePoint = function(n) {
        return n >= this._value.length ? -1 : this._value[n]
    }
    ,
    a.prototype.consumeUnicodeRangeToken = function() {
        for (var n = [], i = this.consumeCodePoint(); En(i) && n.length < 6; )
            n.push(i),
            i = this.consumeCodePoint();
        for (var l = !1; i === Ki && n.length < 6; )
            n.push(i),
            i = this.consumeCodePoint(),
            l = !0;
        if (l) {
            var u = parseInt(JA.apply(void 0, n.map(function(B) {
                return B === Ki ? O0 : B
            })), 16)
              , c = parseInt(JA.apply(void 0, n.map(function(B) {
                return B === Ki ? V0 : B
            })), 16);
            return {
                type: 30,
                start: u,
                end: c
            }
        }
        var f = parseInt(JA.apply(void 0, n), 16);
        if (this.peekCodePoint(0) === be && En(this.peekCodePoint(1))) {
            this.consumeCodePoint(),
            i = this.consumeCodePoint();
            for (var h = []; En(i) && h.length < 6; )
                h.push(i),
                i = this.consumeCodePoint();
            var c = parseInt(JA.apply(void 0, h), 16);
            return {
                type: 30,
                start: f,
                end: c
            }
        } else
            return {
                type: 30,
                start: f,
                end: f
            }
    }
    ,
    a.prototype.consumeIdentLikeToken = function() {
        var n = this.consumeName();
        return n.toLowerCase() === "url" && this.peekCodePoint(0) === Ii ? (this.consumeCodePoint(),
        this.consumeUrlToken()) : this.peekCodePoint(0) === Ii ? (this.consumeCodePoint(),
        {
            type: 19,
            value: n
        }) : {
            type: 20,
            value: n
        }
    }
    ,
    a.prototype.consumeUrlToken = function() {
        var n = [];
        if (this.consumeWhiteSpace(),
        this.peekCodePoint(0) === ut)
            return {
                type: 22,
                value: ""
            };
        var i = this.peekCodePoint(0);
        if (i === Li || i === Di) {
            var l = this.consumeStringToken(this.consumeCodePoint());
            return l.type === 0 && (this.consumeWhiteSpace(),
            this.peekCodePoint(0) === ut || this.peekCodePoint(0) === Nr) ? (this.consumeCodePoint(),
            {
                type: 22,
                value: l.value
            }) : (this.consumeBadUrlRemnants(),
            Mi)
        }
        for (; ; ) {
            var u = this.consumeCodePoint();
            if (u === ut || u === Nr)
                return {
                    type: 22,
                    value: JA.apply(void 0, n)
                };
            if (_i(u))
                return this.consumeWhiteSpace(),
                this.peekCodePoint(0) === ut || this.peekCodePoint(0) === Nr ? (this.consumeCodePoint(),
                {
                    type: 22,
                    value: JA.apply(void 0, n)
                }) : (this.consumeBadUrlRemnants(),
                Mi);
            if (u === Di || u === Li || u === Ii || Oy(u))
                return this.consumeBadUrlRemnants(),
                Mi;
            if (u === Jr)
                if (la(u, this.peekCodePoint(0)))
                    n.push(this.consumeEscapedCodePoint());
                else
                    return this.consumeBadUrlRemnants(),
                    Mi;
            else
                n.push(u)
        }
    }
    ,
    a.prototype.consumeWhiteSpace = function() {
        for (; _i(this.peekCodePoint(0)); )
            this.consumeCodePoint()
    }
    ,
    a.prototype.consumeBadUrlRemnants = function() {
        for (; ; ) {
            var n = this.consumeCodePoint();
            if (n === Nr || n === ut)
                return;
            la(n, this.peekCodePoint(0)) && this.consumeEscapedCodePoint()
        }
    }
    ,
    a.prototype.consumeStringSlice = function(n) {
        for (var i = 5e4, l = ""; n > 0; ) {
            var u = Math.min(i, n);
            l += JA.apply(void 0, this._value.splice(0, u)),
            n -= u
        }
        return this._value.shift(),
        l
    }
    ,
    a.prototype.consumeStringToken = function(n) {
        var i = ""
          , l = 0;
        do {
            var u = this._value[l];
            if (u === ut || u === void 0 || u === n)
                return i += this.consumeStringSlice(l),
                {
                    type: 0,
                    value: i
                };
            if (u === Pi)
                return this._value.splice(0, l),
                qy;
            if (u === Jr) {
                var c = this._value[l + 1];
                c !== ut && c !== void 0 && (c === Pi ? (i += this.consumeStringSlice(l),
                l = -1,
                this._value.shift()) : la(u, c) && (i += this.consumeStringSlice(l),
                i += JA(this.consumeEscapedCodePoint()),
                l = -1))
            }
            l++
        } while (!0)
    }
    ,
    a.prototype.consumeNumber = function() {
        var n = []
          , i = rl
          , l = this.peekCodePoint(0);
        for ((l === La || l === be) && n.push(this.consumeCodePoint()); he(this.peekCodePoint(0)); )
            n.push(this.consumeCodePoint());
        l = this.peekCodePoint(0);
        var u = this.peekCodePoint(1);
        if (l === el && he(u))
            for (n.push(this.consumeCodePoint(), this.consumeCodePoint()),
            i = Fh; he(this.peekCodePoint(0)); )
                n.push(this.consumeCodePoint());
        l = this.peekCodePoint(0),
        u = this.peekCodePoint(1);
        var c = this.peekCodePoint(2);
        if ((l === G0 || l === N0) && ((u === La || u === be) && he(c) || he(u)))
            for (n.push(this.consumeCodePoint(), this.consumeCodePoint()),
            i = Fh; he(this.peekCodePoint(0)); )
                n.push(this.consumeCodePoint());
        return [My(n), i]
    }
    ,
    a.prototype.consumeNumericToken = function() {
        var n = this.consumeNumber()
          , i = n[0]
          , l = n[1]
          , u = this.peekCodePoint(0)
          , c = this.peekCodePoint(1)
          , f = this.peekCodePoint(2);
        if (Oi(u, c, f)) {
            var h = this.consumeName();
            return {
                type: 15,
                number: i,
                flags: l,
                unit: h
            }
        }
        return u === ry ? (this.consumeCodePoint(),
        {
            type: 16,
            number: i,
            flags: l
        }) : {
            type: 17,
            number: i,
            flags: l
        }
    }
    ,
    a.prototype.consumeEscapedCodePoint = function() {
        var n = this.consumeCodePoint();
        if (En(n)) {
            for (var i = JA(n); En(this.peekCodePoint(0)) && i.length < 6; )
                i += JA(this.consumeCodePoint());
            _i(this.peekCodePoint(0)) && this.consumeCodePoint();
            var l = parseInt(i, 16);
            return l === 0 || Dy(l) || l > 1114111 ? Hh : l
        }
        return n === ut ? Hh : n
    }
    ,
    a.prototype.consumeName = function() {
        for (var n = ""; ; ) {
            var i = this.consumeCodePoint();
            if (xh(i))
                n += JA(i);
            else if (la(i, this.peekCodePoint(0)))
                n += JA(this.consumeEscapedCodePoint());
            else
                return this.reconsumeCodePoint(i),
                n
        }
    }
    ,
    a
}()
  , Y0 = function() {
    function a(n) {
        this._tokens = n
    }
    return a.create = function(n) {
        var i = new X0;
        return i.write(n),
        new a(i.read())
    }
    ,
    a.parseValue = function(n) {
        return a.create(n).parseComponentValue()
    }
    ,
    a.parseValues = function(n) {
        return a.create(n).parseComponentValues()
    }
    ,
    a.prototype.parseComponentValue = function() {
        for (var n = this.consumeToken(); n.type === 31; )
            n = this.consumeToken();
        if (n.type === 32)
            throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
        this.reconsumeToken(n);
        var i = this.consumeComponentValue();
        do
            n = this.consumeToken();
        while (n.type === 31);
        if (n.type === 32)
            return i;
        throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one")
    }
    ,
    a.prototype.parseComponentValues = function() {
        for (var n = []; ; ) {
            var i = this.consumeComponentValue();
            if (i.type === 32)
                return n;
            n.push(i),
            n.push()
        }
    }
    ,
    a.prototype.consumeComponentValue = function() {
        var n = this.consumeToken();
        switch (n.type) {
        case 11:
        case 28:
        case 2:
            return this.consumeSimpleBlock(n.type);
        case 19:
            return this.consumeFunction(n)
        }
        return n
    }
    ,
    a.prototype.consumeSimpleBlock = function(n) {
        for (var i = {
            type: n,
            values: []
        }, l = this.consumeToken(); ; ) {
            if (l.type === 32 || rp(l, n))
                return i;
            this.reconsumeToken(l),
            i.values.push(this.consumeComponentValue()),
            l = this.consumeToken()
        }
    }
    ,
    a.prototype.consumeFunction = function(n) {
        for (var i = {
            name: n.value,
            values: [],
            type: 18
        }; ; ) {
            var l = this.consumeToken();
            if (l.type === 32 || l.type === 3)
                return i;
            this.reconsumeToken(l),
            i.values.push(this.consumeComponentValue())
        }
    }
    ,
    a.prototype.consumeToken = function() {
        var n = this._tokens.shift();
        return typeof n > "u" ? Ic : n
    }
    ,
    a.prototype.reconsumeToken = function(n) {
        this._tokens.unshift(n)
    }
    ,
    a
}()
  , ll = function(a) {
    return a.type === 15
}
  , _n = function(a) {
    return a.type === 17
}
  , LA = function(a) {
    return a.type === 20
}
  , np = function(a) {
    return a.type === 0
}
  , Kc = function(a, n) {
    return LA(a) && a.value === n
}
  , z0 = function(a) {
    return a.type !== 31
}
  , Kn = function(a) {
    return a.type !== 31 && a.type !== 4
}
  , ot = function(a) {
    var n = []
      , i = [];
    return a.forEach(function(l) {
        if (l.type === 4) {
            if (i.length === 0)
                throw new Error("Error parsing function args, zero tokens for arg");
            n.push(i),
            i = [];
            return
        }
        l.type !== 31 && i.push(l)
    }),
    i.length && n.push(i),
    n
}
  , rp = function(a, n) {
    return n === 11 && a.type === 12 || n === 28 && a.type === 29 ? !0 : n === 2 && a.type === 3
}
  , fa = function(a) {
    return a.type === 17 || a.type === 15
}
  , qA = function(a) {
    return a.type === 16 || fa(a)
}
  , j0 = function(a) {
    return a.length > 1 ? [a[0], a[1]] : [a[0]]
}
  , oe = {
    type: 17,
    number: 0,
    flags: rl
}
  , Zc = {
    type: 16,
    number: 50,
    flags: rl
}
  , sa = {
    type: 16,
    number: 100,
    flags: rl
}
  , Yr = function(a, n, i) {
    var l = a[0]
      , u = a[1];
    return [_A(l, n), _A(typeof u < "u" ? u : l, i)]
}
  , _A = function(a, n) {
    if (a.type === 16)
        return a.number / 100 * n;
    if (ll(a))
        switch (a.unit) {
        case "rem":
        case "em":
            return 16 * a.number;
        case "px":
        default:
            return a.number
        }
    return a.number
}
  , J0 = "deg"
  , k0 = "grad"
  , Z0 = "rad"
  , q0 = "turn"
  , ds = {
    name: "angle",
    parse: function(a, n) {
        if (n.type === 15)
            switch (n.unit) {
            case J0:
                return Math.PI * n.number / 180;
            case k0:
                return Math.PI / 200 * n.number;
            case Z0:
                return n.number;
            case q0:
                return Math.PI * 2 * n.number
            }
        throw new Error("Unsupported angle type")
    }
}
  , W0 = function(a) {
    return a.type === 15 && (a.unit === J0 || a.unit === k0 || a.unit === Z0 || a.unit === q0)
}
  , P0 = function(a) {
    var n = a.filter(LA).map(function(i) {
        return i.value
    }).join(" ");
    switch (n) {
    case "to bottom right":
    case "to right bottom":
    case "left top":
    case "top left":
        return [oe, oe];
    case "to top":
    case "bottom":
        return Ze(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
        return [oe, sa];
    case "to right":
    case "left":
        return Ze(90);
    case "to top left":
    case "to left top":
    case "right bottom":
    case "bottom right":
        return [sa, sa];
    case "to bottom":
    case "top":
        return Ze(180);
    case "to top right":
    case "to right top":
    case "left bottom":
    case "bottom left":
        return [sa, oe];
    case "to left":
    case "right":
        return Ze(270)
    }
    return 0
}
  , Ze = function(a) {
    return Math.PI * a / 180
}
  , oa = {
    name: "color",
    parse: function(a, n) {
        if (n.type === 18) {
            var i = lp[n.name];
            if (typeof i > "u")
                throw new Error('Attempting to parse an unsupported color function "' + n.name + '"');
            return i(a, n.values)
        }
        if (n.type === 5) {
            if (n.value.length === 3) {
                var l = n.value.substring(0, 1)
                  , u = n.value.substring(1, 2)
                  , c = n.value.substring(2, 3);
                return ua(parseInt(l + l, 16), parseInt(u + u, 16), parseInt(c + c, 16), 1)
            }
            if (n.value.length === 4) {
                var l = n.value.substring(0, 1)
                  , u = n.value.substring(1, 2)
                  , c = n.value.substring(2, 3)
                  , f = n.value.substring(3, 4);
                return ua(parseInt(l + l, 16), parseInt(u + u, 16), parseInt(c + c, 16), parseInt(f + f, 16) / 255)
            }
            if (n.value.length === 6) {
                var l = n.value.substring(0, 2)
                  , u = n.value.substring(2, 4)
                  , c = n.value.substring(4, 6);
                return ua(parseInt(l, 16), parseInt(u, 16), parseInt(c, 16), 1)
            }
            if (n.value.length === 8) {
                var l = n.value.substring(0, 2)
                  , u = n.value.substring(2, 4)
                  , c = n.value.substring(4, 6)
                  , f = n.value.substring(6, 8);
                return ua(parseInt(l, 16), parseInt(u, 16), parseInt(c, 16), parseInt(f, 16) / 255)
            }
        }
        if (n.type === 20) {
            var h = St[n.value.toUpperCase()];
            if (typeof h < "u")
                return h
        }
        return St.TRANSPARENT
    }
}
  , ca = function(a) {
    return (255 & a) === 0
}
  , re = function(a) {
    var n = 255 & a
      , i = 255 & a >> 8
      , l = 255 & a >> 16
      , u = 255 & a >> 24;
    return n < 255 ? "rgba(" + u + "," + l + "," + i + "," + n / 255 + ")" : "rgb(" + u + "," + l + "," + i + ")"
}
  , ua = function(a, n, i, l) {
    return (a << 24 | n << 16 | i << 8 | Math.round(l * 255) << 0) >>> 0
}
  , Sh = function(a, n) {
    if (a.type === 17)
        return a.number;
    if (a.type === 16) {
        var i = n === 3 ? 1 : 255;
        return n === 3 ? a.number / 100 * i : Math.round(a.number / 100 * i)
    }
    return 0
}
  , Th = function(a, n) {
    var i = n.filter(Kn);
    if (i.length === 3) {
        var l = i.map(Sh)
          , u = l[0]
          , c = l[1]
          , f = l[2];
        return ua(u, c, f, 1)
    }
    if (i.length === 4) {
        var h = i.map(Sh)
          , u = h[0]
          , c = h[1]
          , f = h[2]
          , B = h[3];
        return ua(u, c, f, B)
    }
    return 0
};
function Ac(a, n, i) {
    return i < 0 && (i += 1),
    i >= 1 && (i -= 1),
    i < 1 / 6 ? (n - a) * i * 6 + a : i < 1 / 2 ? n : i < 2 / 3 ? (n - a) * 6 * (2 / 3 - i) + a : a
}
var Dh = function(a, n) {
    var i = n.filter(Kn)
      , l = i[0]
      , u = i[1]
      , c = i[2]
      , f = i[3]
      , h = (l.type === 17 ? Ze(l.number) : ds.parse(a, l)) / (Math.PI * 2)
      , B = qA(u) ? u.number / 100 : 0
      , d = qA(c) ? c.number / 100 : 0
      , Q = typeof f < "u" && qA(f) ? _A(f, 1) : 1;
    if (B === 0)
        return ua(d * 255, d * 255, d * 255, 1);
    var C = d <= .5 ? d * (B + 1) : d + B - d * B
      , v = d * 2 - C
      , D = Ac(v, C, h + 1 / 3)
      , L = Ac(v, C, h)
      , x = Ac(v, C, h - 1 / 3);
    return ua(D * 255, L * 255, x * 255, Q)
}
  , lp = {
    hsl: Dh,
    hsla: Dh,
    rgb: Th,
    rgba: Th
}
  , kr = function(a, n) {
    return oa.parse(a, Y0.create(n).parseComponentValue())
}
  , St = {
    ALICEBLUE: 4042850303,
    ANTIQUEWHITE: 4209760255,
    AQUA: 16777215,
    AQUAMARINE: 2147472639,
    AZURE: 4043309055,
    BEIGE: 4126530815,
    BISQUE: 4293182719,
    BLACK: 255,
    BLANCHEDALMOND: 4293643775,
    BLUE: 65535,
    BLUEVIOLET: 2318131967,
    BROWN: 2771004159,
    BURLYWOOD: 3736635391,
    CADETBLUE: 1604231423,
    CHARTREUSE: 2147418367,
    CHOCOLATE: 3530104575,
    CORAL: 4286533887,
    CORNFLOWERBLUE: 1687547391,
    CORNSILK: 4294499583,
    CRIMSON: 3692313855,
    CYAN: 16777215,
    DARKBLUE: 35839,
    DARKCYAN: 9145343,
    DARKGOLDENROD: 3095837695,
    DARKGRAY: 2846468607,
    DARKGREEN: 6553855,
    DARKGREY: 2846468607,
    DARKKHAKI: 3182914559,
    DARKMAGENTA: 2332068863,
    DARKOLIVEGREEN: 1433087999,
    DARKORANGE: 4287365375,
    DARKORCHID: 2570243327,
    DARKRED: 2332033279,
    DARKSALMON: 3918953215,
    DARKSEAGREEN: 2411499519,
    DARKSLATEBLUE: 1211993087,
    DARKSLATEGRAY: 793726975,
    DARKSLATEGREY: 793726975,
    DARKTURQUOISE: 13554175,
    DARKVIOLET: 2483082239,
    DEEPPINK: 4279538687,
    DEEPSKYBLUE: 12582911,
    DIMGRAY: 1768516095,
    DIMGREY: 1768516095,
    DODGERBLUE: 512819199,
    FIREBRICK: 2988581631,
    FLORALWHITE: 4294635775,
    FORESTGREEN: 579543807,
    FUCHSIA: 4278255615,
    GAINSBORO: 3705462015,
    GHOSTWHITE: 4177068031,
    GOLD: 4292280575,
    GOLDENROD: 3668254975,
    GRAY: 2155905279,
    GREEN: 8388863,
    GREENYELLOW: 2919182335,
    GREY: 2155905279,
    HONEYDEW: 4043305215,
    HOTPINK: 4285117695,
    INDIANRED: 3445382399,
    INDIGO: 1258324735,
    IVORY: 4294963455,
    KHAKI: 4041641215,
    LAVENDER: 3873897215,
    LAVENDERBLUSH: 4293981695,
    LAWNGREEN: 2096890111,
    LEMONCHIFFON: 4294626815,
    LIGHTBLUE: 2916673279,
    LIGHTCORAL: 4034953471,
    LIGHTCYAN: 3774873599,
    LIGHTGOLDENRODYELLOW: 4210742015,
    LIGHTGRAY: 3553874943,
    LIGHTGREEN: 2431553791,
    LIGHTGREY: 3553874943,
    LIGHTPINK: 4290167295,
    LIGHTSALMON: 4288707327,
    LIGHTSEAGREEN: 548580095,
    LIGHTSKYBLUE: 2278488831,
    LIGHTSLATEGRAY: 2005441023,
    LIGHTSLATEGREY: 2005441023,
    LIGHTSTEELBLUE: 2965692159,
    LIGHTYELLOW: 4294959359,
    LIME: 16711935,
    LIMEGREEN: 852308735,
    LINEN: 4210091775,
    MAGENTA: 4278255615,
    MAROON: 2147483903,
    MEDIUMAQUAMARINE: 1724754687,
    MEDIUMBLUE: 52735,
    MEDIUMORCHID: 3126187007,
    MEDIUMPURPLE: 2473647103,
    MEDIUMSEAGREEN: 1018393087,
    MEDIUMSLATEBLUE: 2070474495,
    MEDIUMSPRINGGREEN: 16423679,
    MEDIUMTURQUOISE: 1221709055,
    MEDIUMVIOLETRED: 3340076543,
    MIDNIGHTBLUE: 421097727,
    MINTCREAM: 4127193855,
    MISTYROSE: 4293190143,
    MOCCASIN: 4293178879,
    NAVAJOWHITE: 4292783615,
    NAVY: 33023,
    OLDLACE: 4260751103,
    OLIVE: 2155872511,
    OLIVEDRAB: 1804477439,
    ORANGE: 4289003775,
    ORANGERED: 4282712319,
    ORCHID: 3664828159,
    PALEGOLDENROD: 4008225535,
    PALEGREEN: 2566625535,
    PALETURQUOISE: 2951671551,
    PALEVIOLETRED: 3681588223,
    PAPAYAWHIP: 4293907967,
    PEACHPUFF: 4292524543,
    PERU: 3448061951,
    PINK: 4290825215,
    PLUM: 3718307327,
    POWDERBLUE: 2967529215,
    PURPLE: 2147516671,
    REBECCAPURPLE: 1714657791,
    RED: 4278190335,
    ROSYBROWN: 3163525119,
    ROYALBLUE: 1097458175,
    SADDLEBROWN: 2336560127,
    SALMON: 4202722047,
    SANDYBROWN: 4104413439,
    SEAGREEN: 780883967,
    SEASHELL: 4294307583,
    SIENNA: 2689740287,
    SILVER: 3233857791,
    SKYBLUE: 2278484991,
    SLATEBLUE: 1784335871,
    SLATEGRAY: 1887473919,
    SLATEGREY: 1887473919,
    SNOW: 4294638335,
    SPRINGGREEN: 16744447,
    STEELBLUE: 1182971135,
    TAN: 3535047935,
    TEAL: 8421631,
    THISTLE: 3636451583,
    TOMATO: 4284696575,
    TRANSPARENT: 0,
    TURQUOISE: 1088475391,
    VIOLET: 4001558271,
    WHEAT: 4125012991,
    WHITE: 4294967295,
    WHITESMOKE: 4126537215,
    YELLOW: 4294902015,
    YELLOWGREEN: 2597139199
}
  , ip = {
    name: "background-clip",
    initialValue: "border-box",
    prefix: !1,
    type: 1,
    parse: function(a, n) {
        return n.map(function(i) {
            if (LA(i))
                switch (i.value) {
                case "padding-box":
                    return 1;
                case "content-box":
                    return 2
                }
            return 0
        })
    }
}
  , sp = {
    name: "background-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
}
  , hs = function(a, n) {
    var i = oa.parse(a, n[0])
      , l = n[1];
    return l && qA(l) ? {
        color: i,
        stop: l
    } : {
        color: i,
        stop: null
    }
}
  , Lh = function(a, n) {
    var i = a[0]
      , l = a[a.length - 1];
    i.stop === null && (i.stop = oe),
    l.stop === null && (l.stop = sa);
    for (var u = [], c = 0, f = 0; f < a.length; f++) {
        var h = a[f].stop;
        if (h !== null) {
            var B = _A(h, n);
            B > c ? u.push(B) : u.push(c),
            c = B
        } else
            u.push(null)
    }
    for (var d = null, f = 0; f < u.length; f++) {
        var Q = u[f];
        if (Q === null)
            d === null && (d = f);
        else if (d !== null) {
            for (var C = f - d, v = u[d - 1], D = (Q - v) / (C + 1), L = 1; L <= C; L++)
                u[d + L - 1] = D * L;
            d = null
        }
    }
    return a.map(function(x, _) {
        var O = x.color;
        return {
            color: O,
            stop: Math.max(Math.min(1, u[_] / n), 0)
        }
    })
}
  , up = function(a, n, i) {
    var l = n / 2
      , u = i / 2
      , c = _A(a[0], n) - l
      , f = u - _A(a[1], i);
    return (Math.atan2(f, c) + Math.PI * 2) % (Math.PI * 2)
}
  , op = function(a, n, i) {
    var l = typeof a == "number" ? a : up(a, n, i)
      , u = Math.abs(n * Math.sin(l)) + Math.abs(i * Math.cos(l))
      , c = n / 2
      , f = i / 2
      , h = u / 2
      , B = Math.sin(l - Math.PI / 2) * h
      , d = Math.cos(l - Math.PI / 2) * h;
    return [u, c - d, c + d, f - B, f + B]
}
  , At = function(a, n) {
    return Math.sqrt(a * a + n * n)
}
  , Ih = function(a, n, i, l, u) {
    var c = [[0, 0], [0, n], [a, 0], [a, n]];
    return c.reduce(function(f, h) {
        var B = h[0]
          , d = h[1]
          , Q = At(i - B, l - d);
        return (u ? Q < f.optimumDistance : Q > f.optimumDistance) ? {
            optimumCorner: h,
            optimumDistance: Q
        } : f
    }, {
        optimumDistance: u ? 1 / 0 : -1 / 0,
        optimumCorner: null
    }).optimumCorner
}
  , cp = function(a, n, i, l, u) {
    var c = 0
      , f = 0;
    switch (a.size) {
    case 0:
        a.shape === 0 ? c = f = Math.min(Math.abs(n), Math.abs(n - l), Math.abs(i), Math.abs(i - u)) : a.shape === 1 && (c = Math.min(Math.abs(n), Math.abs(n - l)),
        f = Math.min(Math.abs(i), Math.abs(i - u)));
        break;
    case 2:
        if (a.shape === 0)
            c = f = Math.min(At(n, i), At(n, i - u), At(n - l, i), At(n - l, i - u));
        else if (a.shape === 1) {
            var h = Math.min(Math.abs(i), Math.abs(i - u)) / Math.min(Math.abs(n), Math.abs(n - l))
              , B = Ih(l, u, n, i, !0)
              , d = B[0]
              , Q = B[1];
            c = At(d - n, (Q - i) / h),
            f = h * c
        }
        break;
    case 1:
        a.shape === 0 ? c = f = Math.max(Math.abs(n), Math.abs(n - l), Math.abs(i), Math.abs(i - u)) : a.shape === 1 && (c = Math.max(Math.abs(n), Math.abs(n - l)),
        f = Math.max(Math.abs(i), Math.abs(i - u)));
        break;
    case 3:
        if (a.shape === 0)
            c = f = Math.max(At(n, i), At(n, i - u), At(n - l, i), At(n - l, i - u));
        else if (a.shape === 1) {
            var h = Math.max(Math.abs(i), Math.abs(i - u)) / Math.max(Math.abs(n), Math.abs(n - l))
              , C = Ih(l, u, n, i, !1)
              , d = C[0]
              , Q = C[1];
            c = At(d - n, (Q - i) / h),
            f = h * c
        }
        break
    }
    return Array.isArray(a.size) && (c = _A(a.size[0], l),
    f = a.size.length === 2 ? _A(a.size[1], u) : c),
    [c, f]
}
  , fp = function(a, n) {
    var i = Ze(180)
      , l = [];
    return ot(n).forEach(function(u, c) {
        if (c === 0) {
            var f = u[0];
            if (f.type === 20 && f.value === "to") {
                i = P0(u);
                return
            } else if (W0(f)) {
                i = ds.parse(a, f);
                return
            }
        }
        var h = hs(a, u);
        l.push(h)
    }),
    {
        angle: i,
        stops: l,
        type: 1
    }
}
  , Ni = function(a, n) {
    var i = Ze(180)
      , l = [];
    return ot(n).forEach(function(u, c) {
        if (c === 0) {
            var f = u[0];
            if (f.type === 20 && ["top", "left", "right", "bottom"].indexOf(f.value) !== -1) {
                i = P0(u);
                return
            } else if (W0(f)) {
                i = (ds.parse(a, f) + Ze(270)) % Ze(360);
                return
            }
        }
        var h = hs(a, u);
        l.push(h)
    }),
    {
        angle: i,
        stops: l,
        type: 1
    }
}
  , Bp = function(a, n) {
    var i = Ze(180)
      , l = []
      , u = 1
      , c = 0
      , f = 3
      , h = [];
    return ot(n).forEach(function(B, d) {
        var Q = B[0];
        if (d === 0) {
            if (LA(Q) && Q.value === "linear") {
                u = 1;
                return
            } else if (LA(Q) && Q.value === "radial") {
                u = 2;
                return
            }
        }
        if (Q.type === 18) {
            if (Q.name === "from") {
                var C = oa.parse(a, Q.values[0]);
                l.push({
                    stop: oe,
                    color: C
                })
            } else if (Q.name === "to") {
                var C = oa.parse(a, Q.values[0]);
                l.push({
                    stop: sa,
                    color: C
                })
            } else if (Q.name === "color-stop") {
                var v = Q.values.filter(Kn);
                if (v.length === 2) {
                    var C = oa.parse(a, v[1])
                      , D = v[0];
                    _n(D) && l.push({
                        stop: {
                            type: 16,
                            number: D.number * 100,
                            flags: D.flags
                        },
                        color: C
                    })
                }
            }
        }
    }),
    u === 1 ? {
        angle: (i + Ze(180)) % Ze(360),
        stops: l,
        type: u
    } : {
        size: f,
        shape: c,
        stops: l,
        position: h,
        type: u
    }
}
  , $0 = "closest-side"
  , AQ = "farthest-side"
  , eQ = "closest-corner"
  , tQ = "farthest-corner"
  , aQ = "circle"
  , nQ = "ellipse"
  , rQ = "cover"
  , lQ = "contain"
  , gp = function(a, n) {
    var i = 0
      , l = 3
      , u = []
      , c = [];
    return ot(n).forEach(function(f, h) {
        var B = !0;
        if (h === 0) {
            var d = !1;
            B = f.reduce(function(C, v) {
                if (d)
                    if (LA(v))
                        switch (v.value) {
                        case "center":
                            return c.push(Zc),
                            C;
                        case "top":
                        case "left":
                            return c.push(oe),
                            C;
                        case "right":
                        case "bottom":
                            return c.push(sa),
                            C
                        }
                    else
                        (qA(v) || fa(v)) && c.push(v);
                else if (LA(v))
                    switch (v.value) {
                    case aQ:
                        return i = 0,
                        !1;
                    case nQ:
                        return i = 1,
                        !1;
                    case "at":
                        return d = !0,
                        !1;
                    case $0:
                        return l = 0,
                        !1;
                    case rQ:
                    case AQ:
                        return l = 1,
                        !1;
                    case lQ:
                    case eQ:
                        return l = 2,
                        !1;
                    case tQ:
                        return l = 3,
                        !1
                    }
                else if (fa(v) || qA(v))
                    return Array.isArray(l) || (l = []),
                    l.push(v),
                    !1;
                return C
            }, B)
        }
        if (B) {
            var Q = hs(a, f);
            u.push(Q)
        }
    }),
    {
        size: l,
        shape: i,
        stops: u,
        position: c,
        type: 2
    }
}
  , Ri = function(a, n) {
    var i = 0
      , l = 3
      , u = []
      , c = [];
    return ot(n).forEach(function(f, h) {
        var B = !0;
        if (h === 0 ? B = f.reduce(function(Q, C) {
            if (LA(C))
                switch (C.value) {
                case "center":
                    return c.push(Zc),
                    !1;
                case "top":
                case "left":
                    return c.push(oe),
                    !1;
                case "right":
                case "bottom":
                    return c.push(sa),
                    !1
                }
            else if (qA(C) || fa(C))
                return c.push(C),
                !1;
            return Q
        }, B) : h === 1 && (B = f.reduce(function(Q, C) {
            if (LA(C))
                switch (C.value) {
                case aQ:
                    return i = 0,
                    !1;
                case nQ:
                    return i = 1,
                    !1;
                case lQ:
                case $0:
                    return l = 0,
                    !1;
                case AQ:
                    return l = 1,
                    !1;
                case eQ:
                    return l = 2,
                    !1;
                case rQ:
                case tQ:
                    return l = 3,
                    !1
                }
            else if (fa(C) || qA(C))
                return Array.isArray(l) || (l = []),
                l.push(C),
                !1;
            return Q
        }, B)),
        B) {
            var d = hs(a, f);
            u.push(d)
        }
    }),
    {
        size: l,
        shape: i,
        stops: u,
        position: c,
        type: 2
    }
}
  , dp = function(a) {
    return a.type === 1
}
  , hp = function(a) {
    return a.type === 2
}
  , qc = {
    name: "image",
    parse: function(a, n) {
        if (n.type === 22) {
            var i = {
                url: n.value,
                type: 0
            };
            return a.cache.addImage(n.value),
            i
        }
        if (n.type === 18) {
            var l = iQ[n.name];
            if (typeof l > "u")
                throw new Error('Attempting to parse an unsupported image function "' + n.name + '"');
            return l(a, n.values)
        }
        throw new Error("Unsupported image type " + n.type)
    }
};
function Qp(a) {
    return !(a.type === 20 && a.value === "none") && (a.type !== 18 || !!iQ[a.name])
}
var iQ = {
    "linear-gradient": fp,
    "-moz-linear-gradient": Ni,
    "-ms-linear-gradient": Ni,
    "-o-linear-gradient": Ni,
    "-webkit-linear-gradient": Ni,
    "radial-gradient": gp,
    "-moz-radial-gradient": Ri,
    "-ms-radial-gradient": Ri,
    "-o-radial-gradient": Ri,
    "-webkit-radial-gradient": Ri,
    "-webkit-gradient": Bp
}, wp = {
    name: "background-image",
    initialValue: "none",
    type: 1,
    prefix: !1,
    parse: function(a, n) {
        if (n.length === 0)
            return [];
        var i = n[0];
        return i.type === 20 && i.value === "none" ? [] : n.filter(function(l) {
            return Kn(l) && Qp(l)
        }).map(function(l) {
            return qc.parse(a, l)
        })
    }
}, Cp = {
    name: "background-origin",
    initialValue: "border-box",
    prefix: !1,
    type: 1,
    parse: function(a, n) {
        return n.map(function(i) {
            if (LA(i))
                switch (i.value) {
                case "padding-box":
                    return 1;
                case "content-box":
                    return 2
                }
            return 0
        })
    }
}, Up = {
    name: "background-position",
    initialValue: "0% 0%",
    type: 1,
    prefix: !1,
    parse: function(a, n) {
        return ot(n).map(function(i) {
            return i.filter(qA)
        }).map(j0)
    }
}, vp = {
    name: "background-repeat",
    initialValue: "repeat",
    prefix: !1,
    type: 1,
    parse: function(a, n) {
        return ot(n).map(function(i) {
            return i.filter(LA).map(function(l) {
                return l.value
            }).join(" ")
        }).map(yp)
    }
}, yp = function(a) {
    switch (a) {
    case "no-repeat":
        return 1;
    case "repeat-x":
    case "repeat no-repeat":
        return 2;
    case "repeat-y":
    case "no-repeat repeat":
        return 3;
    case "repeat":
    default:
        return 0
    }
}, In;
(function(a) {
    a.AUTO = "auto",
    a.CONTAIN = "contain",
    a.COVER = "cover"
}
)(In || (In = {}));
var pp = {
    name: "background-size",
    initialValue: "0",
    prefix: !1,
    type: 1,
    parse: function(a, n) {
        return ot(n).map(function(i) {
            return i.filter(mp)
        })
    }
}, mp = function(a) {
    return LA(a) || qA(a)
}, Qs = function(a) {
    return {
        name: "border-" + a + "-color",
        initialValue: "transparent",
        prefix: !1,
        type: 3,
        format: "color"
    }
}, Fp = Qs("top"), Ep = Qs("right"), bp = Qs("bottom"), Hp = Qs("left"), ws = function(a) {
    return {
        name: "border-radius-" + a,
        initialValue: "0 0",
        prefix: !1,
        type: 1,
        parse: function(n, i) {
            return j0(i.filter(qA))
        }
    }
}, xp = ws("top-left"), Sp = ws("top-right"), Tp = ws("bottom-right"), Dp = ws("bottom-left"), Cs = function(a) {
    return {
        name: "border-" + a + "-style",
        initialValue: "solid",
        prefix: !1,
        type: 2,
        parse: function(n, i) {
            switch (i) {
            case "none":
                return 0;
            case "dashed":
                return 2;
            case "dotted":
                return 3;
            case "double":
                return 4
            }
            return 1
        }
    }
}, Lp = Cs("top"), Ip = Cs("right"), Kp = Cs("bottom"), _p = Cs("left"), Us = function(a) {
    return {
        name: "border-" + a + "-width",
        initialValue: "0",
        type: 0,
        prefix: !1,
        parse: function(n, i) {
            return ll(i) ? i.number : 0
        }
    }
}, Op = Us("top"), Mp = Us("right"), Np = Us("bottom"), Rp = Us("left"), Gp = {
    name: "color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
}, Vp = {
    name: "direction",
    initialValue: "ltr",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "rtl":
            return 1;
        case "ltr":
        default:
            return 0
        }
    }
}, Xp = {
    name: "display",
    initialValue: "inline-block",
    prefix: !1,
    type: 1,
    parse: function(a, n) {
        return n.filter(LA).reduce(function(i, l) {
            return i | Yp(l.value)
        }, 0)
    }
}, Yp = function(a) {
    switch (a) {
    case "block":
    case "-webkit-box":
        return 2;
    case "inline":
        return 4;
    case "run-in":
        return 8;
    case "flow":
        return 16;
    case "flow-root":
        return 32;
    case "table":
        return 64;
    case "flex":
    case "-webkit-flex":
        return 128;
    case "grid":
    case "-ms-grid":
        return 256;
    case "ruby":
        return 512;
    case "subgrid":
        return 1024;
    case "list-item":
        return 2048;
    case "table-row-group":
        return 4096;
    case "table-header-group":
        return 8192;
    case "table-footer-group":
        return 16384;
    case "table-row":
        return 32768;
    case "table-cell":
        return 65536;
    case "table-column-group":
        return 131072;
    case "table-column":
        return 262144;
    case "table-caption":
        return 524288;
    case "ruby-base":
        return 1048576;
    case "ruby-text":
        return 2097152;
    case "ruby-base-container":
        return 4194304;
    case "ruby-text-container":
        return 8388608;
    case "contents":
        return 16777216;
    case "inline-block":
        return 33554432;
    case "inline-list-item":
        return 67108864;
    case "inline-table":
        return 134217728;
    case "inline-flex":
        return 268435456;
    case "inline-grid":
        return 536870912
    }
    return 0
}, zp = {
    name: "float",
    initialValue: "none",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "left":
            return 1;
        case "right":
            return 2;
        case "inline-start":
            return 3;
        case "inline-end":
            return 4
        }
        return 0
    }
}, jp = {
    name: "letter-spacing",
    initialValue: "0",
    prefix: !1,
    type: 0,
    parse: function(a, n) {
        return n.type === 20 && n.value === "normal" ? 0 : n.type === 17 || n.type === 15 ? n.number : 0
    }
}, As;
(function(a) {
    a.NORMAL = "normal",
    a.STRICT = "strict"
}
)(As || (As = {}));
var Jp = {
    name: "line-break",
    initialValue: "normal",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "strict":
            return As.STRICT;
        case "normal":
        default:
            return As.NORMAL
        }
    }
}, kp = {
    name: "line-height",
    initialValue: "normal",
    prefix: !1,
    type: 4
}, Kh = function(a, n) {
    return LA(a) && a.value === "normal" ? 1.2 * n : a.type === 17 ? n * a.number : qA(a) ? _A(a, n) : n
}, Zp = {
    name: "list-style-image",
    initialValue: "none",
    type: 0,
    prefix: !1,
    parse: function(a, n) {
        return n.type === 20 && n.value === "none" ? null : qc.parse(a, n)
    }
}, qp = {
    name: "list-style-position",
    initialValue: "outside",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "inside":
            return 0;
        case "outside":
        default:
            return 1
        }
    }
}, _c = {
    name: "list-style-type",
    initialValue: "none",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "disc":
            return 0;
        case "circle":
            return 1;
        case "square":
            return 2;
        case "decimal":
            return 3;
        case "cjk-decimal":
            return 4;
        case "decimal-leading-zero":
            return 5;
        case "lower-roman":
            return 6;
        case "upper-roman":
            return 7;
        case "lower-greek":
            return 8;
        case "lower-alpha":
            return 9;
        case "upper-alpha":
            return 10;
        case "arabic-indic":
            return 11;
        case "armenian":
            return 12;
        case "bengali":
            return 13;
        case "cambodian":
            return 14;
        case "cjk-earthly-branch":
            return 15;
        case "cjk-heavenly-stem":
            return 16;
        case "cjk-ideographic":
            return 17;
        case "devanagari":
            return 18;
        case "ethiopic-numeric":
            return 19;
        case "georgian":
            return 20;
        case "gujarati":
            return 21;
        case "gurmukhi":
            return 22;
        case "hebrew":
            return 22;
        case "hiragana":
            return 23;
        case "hiragana-iroha":
            return 24;
        case "japanese-formal":
            return 25;
        case "japanese-informal":
            return 26;
        case "kannada":
            return 27;
        case "katakana":
            return 28;
        case "katakana-iroha":
            return 29;
        case "khmer":
            return 30;
        case "korean-hangul-formal":
            return 31;
        case "korean-hanja-formal":
            return 32;
        case "korean-hanja-informal":
            return 33;
        case "lao":
            return 34;
        case "lower-armenian":
            return 35;
        case "malayalam":
            return 36;
        case "mongolian":
            return 37;
        case "myanmar":
            return 38;
        case "oriya":
            return 39;
        case "persian":
            return 40;
        case "simp-chinese-formal":
            return 41;
        case "simp-chinese-informal":
            return 42;
        case "tamil":
            return 43;
        case "telugu":
            return 44;
        case "thai":
            return 45;
        case "tibetan":
            return 46;
        case "trad-chinese-formal":
            return 47;
        case "trad-chinese-informal":
            return 48;
        case "upper-armenian":
            return 49;
        case "disclosure-open":
            return 50;
        case "disclosure-closed":
            return 51;
        case "none":
        default:
            return -1
        }
    }
}, vs = function(a) {
    return {
        name: "margin-" + a,
        initialValue: "0",
        prefix: !1,
        type: 4
    }
}, Wp = vs("top"), Pp = vs("right"), $p = vs("bottom"), Am = vs("left"), em = {
    name: "overflow",
    initialValue: "visible",
    prefix: !1,
    type: 1,
    parse: function(a, n) {
        return n.filter(LA).map(function(i) {
            switch (i.value) {
            case "hidden":
                return 1;
            case "scroll":
                return 2;
            case "clip":
                return 3;
            case "auto":
                return 4;
            case "visible":
            default:
                return 0
            }
        })
    }
}, tm = {
    name: "overflow-wrap",
    initialValue: "normal",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "break-word":
            return "break-word";
        case "normal":
        default:
            return "normal"
        }
    }
}, ys = function(a) {
    return {
        name: "padding-" + a,
        initialValue: "0",
        prefix: !1,
        type: 3,
        format: "length-percentage"
    }
}, am = ys("top"), nm = ys("right"), rm = ys("bottom"), lm = ys("left"), im = {
    name: "text-align",
    initialValue: "left",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "right":
            return 2;
        case "center":
        case "justify":
            return 1;
        case "left":
        default:
            return 0
        }
    }
}, sm = {
    name: "position",
    initialValue: "static",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "relative":
            return 1;
        case "absolute":
            return 2;
        case "fixed":
            return 3;
        case "sticky":
            return 4
        }
        return 0
    }
}, um = {
    name: "text-shadow",
    initialValue: "none",
    type: 1,
    prefix: !1,
    parse: function(a, n) {
        return n.length === 1 && Kc(n[0], "none") ? [] : ot(n).map(function(i) {
            for (var l = {
                color: St.TRANSPARENT,
                offsetX: oe,
                offsetY: oe,
                blur: oe
            }, u = 0, c = 0; c < i.length; c++) {
                var f = i[c];
                fa(f) ? (u === 0 ? l.offsetX = f : u === 1 ? l.offsetY = f : l.blur = f,
                u++) : l.color = oa.parse(a, f)
            }
            return l
        })
    }
}, om = {
    name: "text-transform",
    initialValue: "none",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "uppercase":
            return 2;
        case "lowercase":
            return 1;
        case "capitalize":
            return 3
        }
        return 0
    }
}, cm = {
    name: "transform",
    initialValue: "none",
    prefix: !0,
    type: 0,
    parse: function(a, n) {
        if (n.type === 20 && n.value === "none")
            return null;
        if (n.type === 18) {
            var i = gm[n.name];
            if (typeof i > "u")
                throw new Error('Attempting to parse an unsupported transform function "' + n.name + '"');
            return i(n.values)
        }
        return null
    }
}, fm = function(a) {
    var n = a.filter(function(i) {
        return i.type === 17
    }).map(function(i) {
        return i.number
    });
    return n.length === 6 ? n : null
}, Bm = function(a) {
    var n = a.filter(function(B) {
        return B.type === 17
    }).map(function(B) {
        return B.number
    })
      , i = n[0]
      , l = n[1];
    n[2],
    n[3];
    var u = n[4]
      , c = n[5];
    n[6],
    n[7],
    n[8],
    n[9],
    n[10],
    n[11];
    var f = n[12]
      , h = n[13];
    return n[14],
    n[15],
    n.length === 16 ? [i, l, u, c, f, h] : null
}, gm = {
    matrix: fm,
    matrix3d: Bm
}, _h = {
    type: 16,
    number: 50,
    flags: rl
}, dm = [_h, _h], hm = {
    name: "transform-origin",
    initialValue: "50% 50%",
    prefix: !0,
    type: 1,
    parse: function(a, n) {
        var i = n.filter(qA);
        return i.length !== 2 ? dm : [i[0], i[1]]
    }
}, Qm = {
    name: "visible",
    initialValue: "none",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "hidden":
            return 1;
        case "collapse":
            return 2;
        case "visible":
        default:
            return 0
        }
    }
}, Zr;
(function(a) {
    a.NORMAL = "normal",
    a.BREAK_ALL = "break-all",
    a.KEEP_ALL = "keep-all"
}
)(Zr || (Zr = {}));
var wm = {
    name: "word-break",
    initialValue: "normal",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "break-all":
            return Zr.BREAK_ALL;
        case "keep-all":
            return Zr.KEEP_ALL;
        case "normal":
        default:
            return Zr.NORMAL
        }
    }
}
  , Cm = {
    name: "z-index",
    initialValue: "auto",
    prefix: !1,
    type: 0,
    parse: function(a, n) {
        if (n.type === 20)
            return {
                auto: !0,
                order: 0
            };
        if (_n(n))
            return {
                auto: !1,
                order: n.number
            };
        throw new Error("Invalid z-index number parsed")
    }
}
  , sQ = {
    name: "time",
    parse: function(a, n) {
        if (n.type === 15)
            switch (n.unit.toLowerCase()) {
            case "s":
                return 1e3 * n.number;
            case "ms":
                return n.number
            }
        throw new Error("Unsupported time type")
    }
}
  , Um = {
    name: "opacity",
    initialValue: "1",
    type: 0,
    prefix: !1,
    parse: function(a, n) {
        return _n(n) ? n.number : 1
    }
}
  , vm = {
    name: "text-decoration-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
}
  , ym = {
    name: "text-decoration-line",
    initialValue: "none",
    prefix: !1,
    type: 1,
    parse: function(a, n) {
        return n.filter(LA).map(function(i) {
            switch (i.value) {
            case "underline":
                return 1;
            case "overline":
                return 2;
            case "line-through":
                return 3;
            case "none":
                return 4
            }
            return 0
        }).filter(function(i) {
            return i !== 0
        })
    }
}
  , pm = {
    name: "font-family",
    initialValue: "",
    prefix: !1,
    type: 1,
    parse: function(a, n) {
        var i = []
          , l = [];
        return n.forEach(function(u) {
            switch (u.type) {
            case 20:
            case 0:
                i.push(u.value);
                break;
            case 17:
                i.push(u.number.toString());
                break;
            case 4:
                l.push(i.join(" ")),
                i.length = 0;
                break
            }
        }),
        i.length && l.push(i.join(" ")),
        l.map(function(u) {
            return u.indexOf(" ") === -1 ? u : "'" + u + "'"
        })
    }
}
  , mm = {
    name: "font-size",
    initialValue: "0",
    prefix: !1,
    type: 3,
    format: "length"
}
  , Fm = {
    name: "font-weight",
    initialValue: "normal",
    type: 0,
    prefix: !1,
    parse: function(a, n) {
        if (_n(n))
            return n.number;
        if (LA(n))
            switch (n.value) {
            case "bold":
                return 700;
            case "normal":
            default:
                return 400
            }
        return 400
    }
}
  , Em = {
    name: "font-variant",
    initialValue: "none",
    type: 1,
    prefix: !1,
    parse: function(a, n) {
        return n.filter(LA).map(function(i) {
            return i.value
        })
    }
}
  , bm = {
    name: "font-style",
    initialValue: "normal",
    prefix: !1,
    type: 2,
    parse: function(a, n) {
        switch (n) {
        case "oblique":
            return "oblique";
        case "italic":
            return "italic";
        case "normal":
        default:
            return "normal"
        }
    }
}
  , Ae = function(a, n) {
    return (a & n) !== 0
}
  , Hm = {
    name: "content",
    initialValue: "none",
    type: 1,
    prefix: !1,
    parse: function(a, n) {
        if (n.length === 0)
            return [];
        var i = n[0];
        return i.type === 20 && i.value === "none" ? [] : n
    }
}
  , xm = {
    name: "counter-increment",
    initialValue: "none",
    prefix: !0,
    type: 1,
    parse: function(a, n) {
        if (n.length === 0)
            return null;
        var i = n[0];
        if (i.type === 20 && i.value === "none")
            return null;
        for (var l = [], u = n.filter(z0), c = 0; c < u.length; c++) {
            var f = u[c]
              , h = u[c + 1];
            if (f.type === 20) {
                var B = h && _n(h) ? h.number : 1;
                l.push({
                    counter: f.value,
                    increment: B
                })
            }
        }
        return l
    }
}
  , Sm = {
    name: "counter-reset",
    initialValue: "none",
    prefix: !0,
    type: 1,
    parse: function(a, n) {
        if (n.length === 0)
            return [];
        for (var i = [], l = n.filter(z0), u = 0; u < l.length; u++) {
            var c = l[u]
              , f = l[u + 1];
            if (LA(c) && c.value !== "none") {
                var h = f && _n(f) ? f.number : 0;
                i.push({
                    counter: c.value,
                    reset: h
                })
            }
        }
        return i
    }
}
  , Tm = {
    name: "duration",
    initialValue: "0s",
    prefix: !1,
    type: 1,
    parse: function(a, n) {
        return n.filter(ll).map(function(i) {
            return sQ.parse(a, i)
        })
    }
}
  , Dm = {
    name: "quotes",
    initialValue: "none",
    prefix: !0,
    type: 1,
    parse: function(a, n) {
        if (n.length === 0)
            return null;
        var i = n[0];
        if (i.type === 20 && i.value === "none")
            return null;
        var l = []
          , u = n.filter(np);
        if (u.length % 2 !== 0)
            return null;
        for (var c = 0; c < u.length; c += 2) {
            var f = u[c].value
              , h = u[c + 1].value;
            l.push({
                open: f,
                close: h
            })
        }
        return l
    }
}
  , Oh = function(a, n, i) {
    if (!a)
        return "";
    var l = a[Math.min(n, a.length - 1)];
    return l ? i ? l.open : l.close : ""
}
  , Lm = {
    name: "box-shadow",
    initialValue: "none",
    type: 1,
    prefix: !1,
    parse: function(a, n) {
        return n.length === 1 && Kc(n[0], "none") ? [] : ot(n).map(function(i) {
            for (var l = {
                color: 255,
                offsetX: oe,
                offsetY: oe,
                blur: oe,
                spread: oe,
                inset: !1
            }, u = 0, c = 0; c < i.length; c++) {
                var f = i[c];
                Kc(f, "inset") ? l.inset = !0 : fa(f) ? (u === 0 ? l.offsetX = f : u === 1 ? l.offsetY = f : u === 2 ? l.blur = f : l.spread = f,
                u++) : l.color = oa.parse(a, f)
            }
            return l
        })
    }
}
  , Im = {
    name: "paint-order",
    initialValue: "normal",
    prefix: !1,
    type: 1,
    parse: function(a, n) {
        var i = [0, 1, 2]
          , l = [];
        return n.filter(LA).forEach(function(u) {
            switch (u.value) {
            case "stroke":
                l.push(1);
                break;
            case "fill":
                l.push(0);
                break;
            case "markers":
                l.push(2);
                break
            }
        }),
        i.forEach(function(u) {
            l.indexOf(u) === -1 && l.push(u)
        }),
        l
    }
}
  , Km = {
    name: "-webkit-text-stroke-color",
    initialValue: "currentcolor",
    prefix: !1,
    type: 3,
    format: "color"
}
  , _m = {
    name: "-webkit-text-stroke-width",
    initialValue: "0",
    type: 0,
    prefix: !1,
    parse: function(a, n) {
        return ll(n) ? n.number : 0
    }
}
  , Om = function() {
    function a(n, i) {
        var l, u;
        this.animationDuration = $(n, Tm, i.animationDuration),
        this.backgroundClip = $(n, ip, i.backgroundClip),
        this.backgroundColor = $(n, sp, i.backgroundColor),
        this.backgroundImage = $(n, wp, i.backgroundImage),
        this.backgroundOrigin = $(n, Cp, i.backgroundOrigin),
        this.backgroundPosition = $(n, Up, i.backgroundPosition),
        this.backgroundRepeat = $(n, vp, i.backgroundRepeat),
        this.backgroundSize = $(n, pp, i.backgroundSize),
        this.borderTopColor = $(n, Fp, i.borderTopColor),
        this.borderRightColor = $(n, Ep, i.borderRightColor),
        this.borderBottomColor = $(n, bp, i.borderBottomColor),
        this.borderLeftColor = $(n, Hp, i.borderLeftColor),
        this.borderTopLeftRadius = $(n, xp, i.borderTopLeftRadius),
        this.borderTopRightRadius = $(n, Sp, i.borderTopRightRadius),
        this.borderBottomRightRadius = $(n, Tp, i.borderBottomRightRadius),
        this.borderBottomLeftRadius = $(n, Dp, i.borderBottomLeftRadius),
        this.borderTopStyle = $(n, Lp, i.borderTopStyle),
        this.borderRightStyle = $(n, Ip, i.borderRightStyle),
        this.borderBottomStyle = $(n, Kp, i.borderBottomStyle),
        this.borderLeftStyle = $(n, _p, i.borderLeftStyle),
        this.borderTopWidth = $(n, Op, i.borderTopWidth),
        this.borderRightWidth = $(n, Mp, i.borderRightWidth),
        this.borderBottomWidth = $(n, Np, i.borderBottomWidth),
        this.borderLeftWidth = $(n, Rp, i.borderLeftWidth),
        this.boxShadow = $(n, Lm, i.boxShadow),
        this.color = $(n, Gp, i.color),
        this.direction = $(n, Vp, i.direction),
        this.display = $(n, Xp, i.display),
        this.float = $(n, zp, i.cssFloat),
        this.fontFamily = $(n, pm, i.fontFamily),
        this.fontSize = $(n, mm, i.fontSize),
        this.fontStyle = $(n, bm, i.fontStyle),
        this.fontVariant = $(n, Em, i.fontVariant),
        this.fontWeight = $(n, Fm, i.fontWeight),
        this.letterSpacing = $(n, jp, i.letterSpacing),
        this.lineBreak = $(n, Jp, i.lineBreak),
        this.lineHeight = $(n, kp, i.lineHeight),
        this.listStyleImage = $(n, Zp, i.listStyleImage),
        this.listStylePosition = $(n, qp, i.listStylePosition),
        this.listStyleType = $(n, _c, i.listStyleType),
        this.marginTop = $(n, Wp, i.marginTop),
        this.marginRight = $(n, Pp, i.marginRight),
        this.marginBottom = $(n, $p, i.marginBottom),
        this.marginLeft = $(n, Am, i.marginLeft),
        this.opacity = $(n, Um, i.opacity);
        var c = $(n, em, i.overflow);
        this.overflowX = c[0],
        this.overflowY = c[c.length > 1 ? 1 : 0],
        this.overflowWrap = $(n, tm, i.overflowWrap),
        this.paddingTop = $(n, am, i.paddingTop),
        this.paddingRight = $(n, nm, i.paddingRight),
        this.paddingBottom = $(n, rm, i.paddingBottom),
        this.paddingLeft = $(n, lm, i.paddingLeft),
        this.paintOrder = $(n, Im, i.paintOrder),
        this.position = $(n, sm, i.position),
        this.textAlign = $(n, im, i.textAlign),
        this.textDecorationColor = $(n, vm, (l = i.textDecorationColor) !== null && l !== void 0 ? l : i.color),
        this.textDecorationLine = $(n, ym, (u = i.textDecorationLine) !== null && u !== void 0 ? u : i.textDecoration),
        this.textShadow = $(n, um, i.textShadow),
        this.textTransform = $(n, om, i.textTransform),
        this.transform = $(n, cm, i.transform),
        this.transformOrigin = $(n, hm, i.transformOrigin),
        this.visibility = $(n, Qm, i.visibility),
        this.webkitTextStrokeColor = $(n, Km, i.webkitTextStrokeColor),
        this.webkitTextStrokeWidth = $(n, _m, i.webkitTextStrokeWidth),
        this.wordBreak = $(n, wm, i.wordBreak),
        this.zIndex = $(n, Cm, i.zIndex)
    }
    return a.prototype.isVisible = function() {
        return this.display > 0 && this.opacity > 0 && this.visibility === 0
    }
    ,
    a.prototype.isTransparent = function() {
        return ca(this.backgroundColor)
    }
    ,
    a.prototype.isTransformed = function() {
        return this.transform !== null
    }
    ,
    a.prototype.isPositioned = function() {
        return this.position !== 0
    }
    ,
    a.prototype.isPositionedWithZIndex = function() {
        return this.isPositioned() && !this.zIndex.auto
    }
    ,
    a.prototype.isFloating = function() {
        return this.float !== 0
    }
    ,
    a.prototype.isInlineLevel = function() {
        return Ae(this.display, 4) || Ae(this.display, 33554432) || Ae(this.display, 268435456) || Ae(this.display, 536870912) || Ae(this.display, 67108864) || Ae(this.display, 134217728)
    }
    ,
    a
}()
  , Mm = function() {
    function a(n, i) {
        this.content = $(n, Hm, i.content),
        this.quotes = $(n, Dm, i.quotes)
    }
    return a
}()
  , Mh = function() {
    function a(n, i) {
        this.counterIncrement = $(n, xm, i.counterIncrement),
        this.counterReset = $(n, Sm, i.counterReset)
    }
    return a
}()
  , $ = function(a, n, i) {
    var l = new X0
      , u = i !== null && typeof i < "u" ? i.toString() : n.initialValue;
    l.write(u);
    var c = new Y0(l.read());
    switch (n.type) {
    case 2:
        var f = c.parseComponentValue();
        return n.parse(a, LA(f) ? f.value : n.initialValue);
    case 0:
        return n.parse(a, c.parseComponentValue());
    case 1:
        return n.parse(a, c.parseComponentValues());
    case 4:
        return c.parseComponentValue();
    case 3:
        switch (n.format) {
        case "angle":
            return ds.parse(a, c.parseComponentValue());
        case "color":
            return oa.parse(a, c.parseComponentValue());
        case "image":
            return qc.parse(a, c.parseComponentValue());
        case "length":
            var h = c.parseComponentValue();
            return fa(h) ? h : oe;
        case "length-percentage":
            var B = c.parseComponentValue();
            return qA(B) ? B : oe;
        case "time":
            return sQ.parse(a, c.parseComponentValue())
        }
        break
    }
}
  , Nm = "data-html2canvas-debug"
  , Rm = function(a) {
    var n = a.getAttribute(Nm);
    switch (n) {
    case "all":
        return 1;
    case "clone":
        return 2;
    case "parse":
        return 3;
    case "render":
        return 4;
    default:
        return 0
    }
}
  , Oc = function(a, n) {
    var i = Rm(a);
    return i === 1 || n === i
}
  , ct = function() {
    function a(n, i) {
        if (this.context = n,
        this.textNodes = [],
        this.elements = [],
        this.flags = 0,
        Oc(i, 3))
            debugger ;this.styles = new Om(n,window.getComputedStyle(i, null)),
        Rc(i) && (this.styles.animationDuration.some(function(l) {
            return l > 0
        }) && (i.style.animationDuration = "0s"),
        this.styles.transform !== null && (i.style.transform = "none")),
        this.bounds = Bs(this.context, i),
        Oc(i, 4) && (this.flags |= 16)
    }
    return a
}()
  , Gm = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA="
  , Nh = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  , zr = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Gi = 0; Gi < Nh.length; Gi++)
    zr[Nh.charCodeAt(Gi)] = Gi;
var Vm = function(a) {
    var n = a.length * .75, i = a.length, l, u = 0, c, f, h, B;
    a[a.length - 1] === "=" && (n--,
    a[a.length - 2] === "=" && n--);
    var d = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(n) : new Array(n)
      , Q = Array.isArray(d) ? d : new Uint8Array(d);
    for (l = 0; l < i; l += 4)
        c = zr[a.charCodeAt(l)],
        f = zr[a.charCodeAt(l + 1)],
        h = zr[a.charCodeAt(l + 2)],
        B = zr[a.charCodeAt(l + 3)],
        Q[u++] = c << 2 | f >> 4,
        Q[u++] = (f & 15) << 4 | h >> 2,
        Q[u++] = (h & 3) << 6 | B & 63;
    return d
}
  , Xm = function(a) {
    for (var n = a.length, i = [], l = 0; l < n; l += 2)
        i.push(a[l + 1] << 8 | a[l]);
    return i
}
  , Ym = function(a) {
    for (var n = a.length, i = [], l = 0; l < n; l += 4)
        i.push(a[l + 3] << 24 | a[l + 2] << 16 | a[l + 1] << 8 | a[l]);
    return i
}
  , _a = 5
  , Wc = 11
  , ec = 2
  , zm = Wc - _a
  , uQ = 65536 >> _a
  , jm = 1 << _a
  , tc = jm - 1
  , Jm = 1024 >> _a
  , km = uQ + Jm
  , Zm = km
  , qm = 32
  , Wm = Zm + qm
  , Pm = 65536 >> Wc
  , $m = 1 << zm
  , AF = $m - 1
  , Rh = function(a, n, i) {
    return a.slice ? a.slice(n, i) : new Uint16Array(Array.prototype.slice.call(a, n, i))
}
  , eF = function(a, n, i) {
    return a.slice ? a.slice(n, i) : new Uint32Array(Array.prototype.slice.call(a, n, i))
}
  , tF = function(a, n) {
    var i = Vm(a)
      , l = Array.isArray(i) ? Ym(i) : new Uint32Array(i)
      , u = Array.isArray(i) ? Xm(i) : new Uint16Array(i)
      , c = 24
      , f = Rh(u, c / 2, l[4] / 2)
      , h = l[5] === 2 ? Rh(u, (c + l[4]) / 2) : eF(l, Math.ceil((c + l[4]) / 4));
    return new aF(l[0],l[1],l[2],l[3],f,h)
}
  , aF = function() {
    function a(n, i, l, u, c, f) {
        this.initialValue = n,
        this.errorValue = i,
        this.highStart = l,
        this.highValueIndex = u,
        this.index = c,
        this.data = f
    }
    return a.prototype.get = function(n) {
        var i;
        if (n >= 0) {
            if (n < 55296 || n > 56319 && n <= 65535)
                return i = this.index[n >> _a],
                i = (i << ec) + (n & tc),
                this.data[i];
            if (n <= 65535)
                return i = this.index[uQ + (n - 55296 >> _a)],
                i = (i << ec) + (n & tc),
                this.data[i];
            if (n < this.highStart)
                return i = Wm - Pm + (n >> Wc),
                i = this.index[i],
                i += n >> _a & AF,
                i = this.index[i],
                i = (i << ec) + (n & tc),
                this.data[i];
            if (n <= 1114111)
                return this.data[this.highValueIndex]
        }
        return this.errorValue
    }
    ,
    a
}()
  , Gh = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  , nF = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Vi = 0; Vi < Gh.length; Vi++)
    nF[Gh.charCodeAt(Vi)] = Vi;
var rF = 1, ac = 2, nc = 3, Vh = 4, Xh = 5, lF = 7, Yh = 8, rc = 9, lc = 10, zh = 11, jh = 12, Jh = 13, kh = 14, ic = 15, iF = function(a) {
    for (var n = [], i = 0, l = a.length; i < l; ) {
        var u = a.charCodeAt(i++);
        if (u >= 55296 && u <= 56319 && i < l) {
            var c = a.charCodeAt(i++);
            (c & 64512) === 56320 ? n.push(((u & 1023) << 10) + (c & 1023) + 65536) : (n.push(u),
            i--)
        } else
            n.push(u)
    }
    return n
}, sF = function() {
    for (var a = [], n = 0; n < arguments.length; n++)
        a[n] = arguments[n];
    if (String.fromCodePoint)
        return String.fromCodePoint.apply(String, a);
    var i = a.length;
    if (!i)
        return "";
    for (var l = [], u = -1, c = ""; ++u < i; ) {
        var f = a[u];
        f <= 65535 ? l.push(f) : (f -= 65536,
        l.push((f >> 10) + 55296, f % 1024 + 56320)),
        (u + 1 === i || l.length > 16384) && (c += String.fromCharCode.apply(String, l),
        l.length = 0)
    }
    return c
}, uF = tF(Gm), Je = "×", sc = "÷", oF = function(a) {
    return uF.get(a)
}, cF = function(a, n, i) {
    var l = i - 2
      , u = n[l]
      , c = n[i - 1]
      , f = n[i];
    if (c === ac && f === nc)
        return Je;
    if (c === ac || c === nc || c === Vh || f === ac || f === nc || f === Vh)
        return sc;
    if (c === Yh && [Yh, rc, zh, jh].indexOf(f) !== -1 || (c === zh || c === rc) && (f === rc || f === lc) || (c === jh || c === lc) && f === lc || f === Jh || f === Xh || f === lF || c === rF)
        return Je;
    if (c === Jh && f === kh) {
        for (; u === Xh; )
            u = n[--l];
        if (u === kh)
            return Je
    }
    if (c === ic && f === ic) {
        for (var h = 0; u === ic; )
            h++,
            u = n[--l];
        if (h % 2 === 0)
            return Je
    }
    return sc
}, fF = function(a) {
    var n = iF(a)
      , i = n.length
      , l = 0
      , u = 0
      , c = n.map(oF);
    return {
        next: function() {
            if (l >= i)
                return {
                    done: !0,
                    value: null
                };
            for (var f = Je; l < i && (f = cF(n, c, ++l)) === Je; )
                ;
            if (f !== Je || l === i) {
                var h = sF.apply(null, n.slice(u, l));
                return u = l,
                {
                    value: h,
                    done: !1
                }
            }
            return {
                done: !0,
                value: null
            }
        }
    }
}, BF = function(a) {
    for (var n = fF(a), i = [], l; !(l = n.next()).done; )
        l.value && i.push(l.value.slice());
    return i
}, gF = function(a) {
    var n = 123;
    if (a.createRange) {
        var i = a.createRange();
        if (i.getBoundingClientRect) {
            var l = a.createElement("boundtest");
            l.style.height = n + "px",
            l.style.display = "block",
            a.body.appendChild(l),
            i.selectNode(l);
            var u = i.getBoundingClientRect()
              , c = Math.round(u.height);
            if (a.body.removeChild(l),
            c === n)
                return !0
        }
    }
    return !1
}, dF = function(a) {
    var n = a.createElement("boundtest");
    n.style.width = "50px",
    n.style.display = "block",
    n.style.fontSize = "12px",
    n.style.letterSpacing = "0px",
    n.style.wordSpacing = "0px",
    a.body.appendChild(n);
    var i = a.createRange();
    n.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
    var l = n.firstChild
      , u = gs(l.data).map(function(B) {
        return JA(B)
    })
      , c = 0
      , f = {}
      , h = u.every(function(B, d) {
        i.setStart(l, c),
        i.setEnd(l, c + B.length);
        var Q = i.getBoundingClientRect();
        c += B.length;
        var C = Q.x > f.x || Q.y > f.y;
        return f = Q,
        d === 0 ? !0 : C
    });
    return a.body.removeChild(n),
    h
}, hF = function() {
    return typeof new Image().crossOrigin < "u"
}, QF = function() {
    return typeof new XMLHttpRequest().responseType == "string"
}, wF = function(a) {
    var n = new Image
      , i = a.createElement("canvas")
      , l = i.getContext("2d");
    if (!l)
        return !1;
    n.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
    try {
        l.drawImage(n, 0, 0),
        i.toDataURL()
    } catch {
        return !1
    }
    return !0
}, Zh = function(a) {
    return a[0] === 0 && a[1] === 255 && a[2] === 0 && a[3] === 255
}, CF = function(a) {
    var n = a.createElement("canvas")
      , i = 100;
    n.width = i,
    n.height = i;
    var l = n.getContext("2d");
    if (!l)
        return Promise.reject(!1);
    l.fillStyle = "rgb(0, 255, 0)",
    l.fillRect(0, 0, i, i);
    var u = new Image
      , c = n.toDataURL();
    u.src = c;
    var f = Mc(i, i, 0, 0, u);
    return l.fillStyle = "red",
    l.fillRect(0, 0, i, i),
    qh(f).then(function(h) {
        l.drawImage(h, 0, 0);
        var B = l.getImageData(0, 0, i, i).data;
        l.fillStyle = "red",
        l.fillRect(0, 0, i, i);
        var d = a.createElement("div");
        return d.style.backgroundImage = "url(" + c + ")",
        d.style.height = i + "px",
        Zh(B) ? qh(Mc(i, i, 0, 0, d)) : Promise.reject(!1)
    }).then(function(h) {
        return l.drawImage(h, 0, 0),
        Zh(l.getImageData(0, 0, i, i).data)
    }).catch(function() {
        return !1
    })
}, Mc = function(a, n, i, l, u) {
    var c = "http://www.w3.org/2000/svg"
      , f = document.createElementNS(c, "svg")
      , h = document.createElementNS(c, "foreignObject");
    return f.setAttributeNS(null, "width", a.toString()),
    f.setAttributeNS(null, "height", n.toString()),
    h.setAttributeNS(null, "width", "100%"),
    h.setAttributeNS(null, "height", "100%"),
    h.setAttributeNS(null, "x", i.toString()),
    h.setAttributeNS(null, "y", l.toString()),
    h.setAttributeNS(null, "externalResourcesRequired", "true"),
    f.appendChild(h),
    h.appendChild(u),
    f
}, qh = function(a) {
    return new Promise(function(n, i) {
        var l = new Image;
        l.onload = function() {
            return n(l)
        }
        ,
        l.onerror = i,
        l.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(a))
    }
    )
}, ue = {
    get SUPPORT_RANGE_BOUNDS() {
        var a = gF(document);
        return Object.defineProperty(ue, "SUPPORT_RANGE_BOUNDS", {
            value: a
        }),
        a
    },
    get SUPPORT_WORD_BREAKING() {
        var a = ue.SUPPORT_RANGE_BOUNDS && dF(document);
        return Object.defineProperty(ue, "SUPPORT_WORD_BREAKING", {
            value: a
        }),
        a
    },
    get SUPPORT_SVG_DRAWING() {
        var a = wF(document);
        return Object.defineProperty(ue, "SUPPORT_SVG_DRAWING", {
            value: a
        }),
        a
    },
    get SUPPORT_FOREIGNOBJECT_DRAWING() {
        var a = typeof Array.from == "function" && typeof window.fetch == "function" ? CF(document) : Promise.resolve(!1);
        return Object.defineProperty(ue, "SUPPORT_FOREIGNOBJECT_DRAWING", {
            value: a
        }),
        a
    },
    get SUPPORT_CORS_IMAGES() {
        var a = hF();
        return Object.defineProperty(ue, "SUPPORT_CORS_IMAGES", {
            value: a
        }),
        a
    },
    get SUPPORT_RESPONSE_TYPE() {
        var a = QF();
        return Object.defineProperty(ue, "SUPPORT_RESPONSE_TYPE", {
            value: a
        }),
        a
    },
    get SUPPORT_CORS_XHR() {
        var a = "withCredentials"in new XMLHttpRequest;
        return Object.defineProperty(ue, "SUPPORT_CORS_XHR", {
            value: a
        }),
        a
    },
    get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
        var a = !!(typeof Intl < "u" && Intl.Segmenter);
        return Object.defineProperty(ue, "SUPPORT_NATIVE_TEXT_SEGMENTATION", {
            value: a
        }),
        a
    }
}, qr = function() {
    function a(n, i) {
        this.text = n,
        this.bounds = i
    }
    return a
}(), UF = function(a, n, i, l) {
    var u = pF(n, i)
      , c = []
      , f = 0;
    return u.forEach(function(h) {
        if (i.textDecorationLine.length || h.trim().length > 0)
            if (ue.SUPPORT_RANGE_BOUNDS) {
                var B = Wh(l, f, h.length).getClientRects();
                if (B.length > 1) {
                    var d = Pc(h)
                      , Q = 0;
                    d.forEach(function(v) {
                        c.push(new qr(v,Dt.fromDOMRectList(a, Wh(l, Q + f, v.length).getClientRects()))),
                        Q += v.length
                    })
                } else
                    c.push(new qr(h,Dt.fromDOMRectList(a, B)))
            } else {
                var C = l.splitText(h.length);
                c.push(new qr(h,vF(a, l))),
                l = C
            }
        else
            ue.SUPPORT_RANGE_BOUNDS || (l = l.splitText(h.length));
        f += h.length
    }),
    c
}, vF = function(a, n) {
    var i = n.ownerDocument;
    if (i) {
        var l = i.createElement("html2canvaswrapper");
        l.appendChild(n.cloneNode(!0));
        var u = n.parentNode;
        if (u) {
            u.replaceChild(l, n);
            var c = Bs(a, l);
            return l.firstChild && u.replaceChild(l.firstChild, l),
            c
        }
    }
    return Dt.EMPTY
}, Wh = function(a, n, i) {
    var l = a.ownerDocument;
    if (!l)
        throw new Error("Node has no owner document");
    var u = l.createRange();
    return u.setStart(a, n),
    u.setEnd(a, n + i),
    u
}, Pc = function(a) {
    if (ue.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
        var n = new Intl.Segmenter(void 0,{
            granularity: "grapheme"
        });
        return Array.from(n.segment(a)).map(function(i) {
            return i.segment
        })
    }
    return BF(a)
}, yF = function(a, n) {
    if (ue.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
        var i = new Intl.Segmenter(void 0,{
            granularity: "word"
        });
        return Array.from(i.segment(a)).map(function(l) {
            return l.segment
        })
    }
    return FF(a, n)
}, pF = function(a, n) {
    return n.letterSpacing !== 0 ? Pc(a) : yF(a, n)
}, mF = [32, 160, 4961, 65792, 65793, 4153, 4241], FF = function(a, n) {
    for (var i = Pv(a, {
        lineBreak: n.lineBreak,
        wordBreak: n.overflowWrap === "break-word" ? "break-word" : n.wordBreak
    }), l = [], u, c = function() {
        if (u.value) {
            var f = u.value.slice()
              , h = gs(f)
              , B = "";
            h.forEach(function(d) {
                mF.indexOf(d) === -1 ? B += JA(d) : (B.length && l.push(B),
                l.push(JA(d)),
                B = "")
            }),
            B.length && l.push(B)
        }
    }; !(u = i.next()).done; )
        c();
    return l
}, EF = function() {
    function a(n, i, l) {
        this.text = bF(i.data, l.textTransform),
        this.textBounds = UF(n, this.text, l, i)
    }
    return a
}(), bF = function(a, n) {
    switch (n) {
    case 1:
        return a.toLowerCase();
    case 3:
        return a.replace(HF, xF);
    case 2:
        return a.toUpperCase();
    default:
        return a
    }
}, HF = /(^|\s|:|-|\(|\))([a-z])/g, xF = function(a, n, i) {
    return a.length > 0 ? n + i.toUpperCase() : a
}, oQ = function(a) {
    tt(n, a);
    function n(i, l) {
        var u = a.call(this, i, l) || this;
        return u.src = l.currentSrc || l.src,
        u.intrinsicWidth = l.naturalWidth,
        u.intrinsicHeight = l.naturalHeight,
        u.context.cache.addImage(u.src),
        u
    }
    return n
}(ct), cQ = function(a) {
    tt(n, a);
    function n(i, l) {
        var u = a.call(this, i, l) || this;
        return u.canvas = l,
        u.intrinsicWidth = l.width,
        u.intrinsicHeight = l.height,
        u
    }
    return n
}(ct), fQ = function(a) {
    tt(n, a);
    function n(i, l) {
        var u = a.call(this, i, l) || this
          , c = new XMLSerializer
          , f = Bs(i, l);
        return l.setAttribute("width", f.width + "px"),
        l.setAttribute("height", f.height + "px"),
        u.svg = "data:image/svg+xml," + encodeURIComponent(c.serializeToString(l)),
        u.intrinsicWidth = l.width.baseVal.value,
        u.intrinsicHeight = l.height.baseVal.value,
        u.context.cache.addImage(u.svg),
        u
    }
    return n
}(ct), BQ = function(a) {
    tt(n, a);
    function n(i, l) {
        var u = a.call(this, i, l) || this;
        return u.value = l.value,
        u
    }
    return n
}(ct), Nc = function(a) {
    tt(n, a);
    function n(i, l) {
        var u = a.call(this, i, l) || this;
        return u.start = l.start,
        u.reversed = typeof l.reversed == "boolean" && l.reversed === !0,
        u
    }
    return n
}(ct), SF = [{
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
}], TF = [{
    type: 16,
    flags: 0,
    number: 50
}], DF = function(a) {
    return a.width > a.height ? new Dt(a.left + (a.width - a.height) / 2,a.top,a.height,a.height) : a.width < a.height ? new Dt(a.left,a.top + (a.height - a.width) / 2,a.width,a.width) : a
}, LF = function(a) {
    var n = a.type === IF ? new Array(a.value.length + 1).join("•") : a.value;
    return n.length === 0 ? a.placeholder || "" : n
}, es = "checkbox", ts = "radio", IF = "password", Ph = 707406591, $c = function(a) {
    tt(n, a);
    function n(i, l) {
        var u = a.call(this, i, l) || this;
        switch (u.type = l.type.toLowerCase(),
        u.checked = l.checked,
        u.value = LF(l),
        (u.type === es || u.type === ts) && (u.styles.backgroundColor = 3739148031,
        u.styles.borderTopColor = u.styles.borderRightColor = u.styles.borderBottomColor = u.styles.borderLeftColor = 2779096575,
        u.styles.borderTopWidth = u.styles.borderRightWidth = u.styles.borderBottomWidth = u.styles.borderLeftWidth = 1,
        u.styles.borderTopStyle = u.styles.borderRightStyle = u.styles.borderBottomStyle = u.styles.borderLeftStyle = 1,
        u.styles.backgroundClip = [0],
        u.styles.backgroundOrigin = [0],
        u.bounds = DF(u.bounds)),
        u.type) {
        case es:
            u.styles.borderTopRightRadius = u.styles.borderTopLeftRadius = u.styles.borderBottomRightRadius = u.styles.borderBottomLeftRadius = SF;
            break;
        case ts:
            u.styles.borderTopRightRadius = u.styles.borderTopLeftRadius = u.styles.borderBottomRightRadius = u.styles.borderBottomLeftRadius = TF;
            break
        }
        return u
    }
    return n
}(ct), gQ = function(a) {
    tt(n, a);
    function n(i, l) {
        var u = a.call(this, i, l) || this
          , c = l.options[l.selectedIndex || 0];
        return u.value = c && c.text || "",
        u
    }
    return n
}(ct), dQ = function(a) {
    tt(n, a);
    function n(i, l) {
        var u = a.call(this, i, l) || this;
        return u.value = l.value,
        u
    }
    return n
}(ct), hQ = function(a) {
    tt(n, a);
    function n(i, l) {
        var u = a.call(this, i, l) || this;
        u.src = l.src,
        u.width = parseInt(l.width, 10) || 0,
        u.height = parseInt(l.height, 10) || 0,
        u.backgroundColor = u.styles.backgroundColor;
        try {
            if (l.contentWindow && l.contentWindow.document && l.contentWindow.document.documentElement) {
                u.tree = wQ(i, l.contentWindow.document.documentElement);
                var c = l.contentWindow.document.documentElement ? kr(i, getComputedStyle(l.contentWindow.document.documentElement).backgroundColor) : St.TRANSPARENT
                  , f = l.contentWindow.document.body ? kr(i, getComputedStyle(l.contentWindow.document.body).backgroundColor) : St.TRANSPARENT;
                u.backgroundColor = ca(c) ? ca(f) ? u.styles.backgroundColor : f : c
            }
        } catch {}
        return u
    }
    return n
}(ct), KF = ["OL", "UL", "MENU"], Zi = function(a, n, i, l) {
    for (var u = n.firstChild, c = void 0; u; u = c)
        if (c = u.nextSibling,
        CQ(u) && u.data.trim().length > 0)
            i.textNodes.push(new EF(a,u,i.styles));
        else if (Ln(u))
            if (pQ(u) && u.assignedNodes)
                u.assignedNodes().forEach(function(h) {
                    return Zi(a, h, i, l)
                });
            else {
                var f = QQ(a, u);
                f.styles.isVisible() && (_F(u, f, l) ? f.flags |= 4 : OF(f.styles) && (f.flags |= 2),
                KF.indexOf(u.tagName) !== -1 && (f.flags |= 8),
                i.elements.push(f),
                u.slot,
                u.shadowRoot ? Zi(a, u.shadowRoot, f, l) : !as(u) && !UQ(u) && !ns(u) && Zi(a, u, f, l))
            }
}, QQ = function(a, n) {
    return Gc(n) ? new oQ(a,n) : vQ(n) ? new cQ(a,n) : UQ(n) ? new fQ(a,n) : MF(n) ? new BQ(a,n) : NF(n) ? new Nc(a,n) : RF(n) ? new $c(a,n) : ns(n) ? new gQ(a,n) : as(n) ? new dQ(a,n) : yQ(n) ? new hQ(a,n) : new ct(a,n)
}, wQ = function(a, n) {
    var i = QQ(a, n);
    return i.flags |= 4,
    Zi(a, n, i, i),
    i
}, _F = function(a, n, i) {
    return n.styles.isPositionedWithZIndex() || n.styles.opacity < 1 || n.styles.isTransformed() || Af(a) && i.styles.isTransparent()
}, OF = function(a) {
    return a.isPositioned() || a.isFloating()
}, CQ = function(a) {
    return a.nodeType === Node.TEXT_NODE
}, Ln = function(a) {
    return a.nodeType === Node.ELEMENT_NODE
}, Rc = function(a) {
    return Ln(a) && typeof a.style < "u" && !qi(a)
}, qi = function(a) {
    return typeof a.className == "object"
}, MF = function(a) {
    return a.tagName === "LI"
}, NF = function(a) {
    return a.tagName === "OL"
}, RF = function(a) {
    return a.tagName === "INPUT"
}, GF = function(a) {
    return a.tagName === "HTML"
}, UQ = function(a) {
    return a.tagName === "svg"
}, Af = function(a) {
    return a.tagName === "BODY"
}, vQ = function(a) {
    return a.tagName === "CANVAS"
}, $h = function(a) {
    return a.tagName === "VIDEO"
}, Gc = function(a) {
    return a.tagName === "IMG"
}, yQ = function(a) {
    return a.tagName === "IFRAME"
}, A0 = function(a) {
    return a.tagName === "STYLE"
}, VF = function(a) {
    return a.tagName === "SCRIPT"
}, as = function(a) {
    return a.tagName === "TEXTAREA"
}, ns = function(a) {
    return a.tagName === "SELECT"
}, pQ = function(a) {
    return a.tagName === "SLOT"
}, e0 = function(a) {
    return a.tagName.indexOf("-") > 0
}, XF = function() {
    function a() {
        this.counters = {}
    }
    return a.prototype.getCounterValue = function(n) {
        var i = this.counters[n];
        return i && i.length ? i[i.length - 1] : 1
    }
    ,
    a.prototype.getCounterValues = function(n) {
        var i = this.counters[n];
        return i || []
    }
    ,
    a.prototype.pop = function(n) {
        var i = this;
        n.forEach(function(l) {
            return i.counters[l].pop()
        })
    }
    ,
    a.prototype.parse = function(n) {
        var i = this
          , l = n.counterIncrement
          , u = n.counterReset
          , c = !0;
        l !== null && l.forEach(function(h) {
            var B = i.counters[h.counter];
            B && h.increment !== 0 && (c = !1,
            B.length || B.push(1),
            B[Math.max(0, B.length - 1)] += h.increment)
        });
        var f = [];
        return c && u.forEach(function(h) {
            var B = i.counters[h.counter];
            f.push(h.counter),
            B || (B = i.counters[h.counter] = []),
            B.push(h.reset)
        }),
        f
    }
    ,
    a
}(), t0 = {
    integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
    values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
}, a0 = {
    integers: [9e3, 8e3, 7e3, 6e3, 5e3, 4e3, 3e3, 2e3, 1e3, 900, 800, 700, 600, 500, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    values: ["Ք", "Փ", "Ւ", "Ց", "Ր", "Տ", "Վ", "Ս", "Ռ", "Ջ", "Պ", "Չ", "Ո", "Շ", "Ն", "Յ", "Մ", "Ճ", "Ղ", "Ձ", "Հ", "Կ", "Ծ", "Խ", "Լ", "Ի", "Ժ", "Թ", "Ը", "Է", "Զ", "Ե", "Դ", "Գ", "Բ", "Ա"]
}, YF = {
    integers: [1e4, 9e3, 8e3, 7e3, 6e3, 5e3, 4e3, 3e3, 2e3, 1e3, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 19, 18, 17, 16, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    values: ["י׳", "ט׳", "ח׳", "ז׳", "ו׳", "ה׳", "ד׳", "ג׳", "ב׳", "א׳", "ת", "ש", "ר", "ק", "צ", "פ", "ע", "ס", "נ", "מ", "ל", "כ", "יט", "יח", "יז", "טז", "טו", "י", "ט", "ח", "ז", "ו", "ה", "ד", "ג", "ב", "א"]
}, zF = {
    integers: [1e4, 9e3, 8e3, 7e3, 6e3, 5e3, 4e3, 3e3, 2e3, 1e3, 900, 800, 700, 600, 500, 400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    values: ["ჵ", "ჰ", "ჯ", "ჴ", "ხ", "ჭ", "წ", "ძ", "ც", "ჩ", "შ", "ყ", "ღ", "ქ", "ფ", "ჳ", "ტ", "ს", "რ", "ჟ", "პ", "ო", "ჲ", "ნ", "მ", "ლ", "კ", "ი", "თ", "ჱ", "ზ", "ვ", "ე", "დ", "გ", "ბ", "ა"]
}, bn = function(a, n, i, l, u, c) {
    return a < n || a > i ? tl(a, u, c.length > 0) : l.integers.reduce(function(f, h, B) {
        for (; a >= h; )
            a -= h,
            f += l.values[B];
        return f
    }, "") + c
}, mQ = function(a, n, i, l) {
    var u = "";
    do
        i || a--,
        u = l(a) + u,
        a /= n;
    while (a * n >= n);
    return u
}, jA = function(a, n, i, l, u) {
    var c = i - n + 1;
    return (a < 0 ? "-" : "") + (mQ(Math.abs(a), c, l, function(f) {
        return JA(Math.floor(f % c) + n)
    }) + u)
}, Ta = function(a, n, i) {
    i === void 0 && (i = ". ");
    var l = n.length;
    return mQ(Math.abs(a), l, !1, function(u) {
        return n[Math.floor(u % l)]
    }) + i
}, Tn = 1, na = 2, ra = 4, jr = 8, xt = function(a, n, i, l, u, c) {
    if (a < -9999 || a > 9999)
        return tl(a, 4, u.length > 0);
    var f = Math.abs(a)
      , h = u;
    if (f === 0)
        return n[0] + h;
    for (var B = 0; f > 0 && B <= 4; B++) {
        var d = f % 10;
        d === 0 && Ae(c, Tn) && h !== "" ? h = n[d] + h : d > 1 || d === 1 && B === 0 || d === 1 && B === 1 && Ae(c, na) || d === 1 && B === 1 && Ae(c, ra) && a > 100 || d === 1 && B > 1 && Ae(c, jr) ? h = n[d] + (B > 0 ? i[B - 1] : "") + h : d === 1 && B > 0 && (h = i[B - 1] + h),
        f = Math.floor(f / 10)
    }
    return (a < 0 ? l : "") + h
}, n0 = "十百千萬", r0 = "拾佰仟萬", l0 = "マイナス", uc = "마이너스", tl = function(a, n, i) {
    var l = i ? ". " : ""
      , u = i ? "、" : ""
      , c = i ? ", " : ""
      , f = i ? " " : "";
    switch (n) {
    case 0:
        return "•" + f;
    case 1:
        return "◦" + f;
    case 2:
        return "◾" + f;
    case 5:
        var h = jA(a, 48, 57, !0, l);
        return h.length < 4 ? "0" + h : h;
    case 4:
        return Ta(a, "〇一二三四五六七八九", u);
    case 6:
        return bn(a, 1, 3999, t0, 3, l).toLowerCase();
    case 7:
        return bn(a, 1, 3999, t0, 3, l);
    case 8:
        return jA(a, 945, 969, !1, l);
    case 9:
        return jA(a, 97, 122, !1, l);
    case 10:
        return jA(a, 65, 90, !1, l);
    case 11:
        return jA(a, 1632, 1641, !0, l);
    case 12:
    case 49:
        return bn(a, 1, 9999, a0, 3, l);
    case 35:
        return bn(a, 1, 9999, a0, 3, l).toLowerCase();
    case 13:
        return jA(a, 2534, 2543, !0, l);
    case 14:
    case 30:
        return jA(a, 6112, 6121, !0, l);
    case 15:
        return Ta(a, "子丑寅卯辰巳午未申酉戌亥", u);
    case 16:
        return Ta(a, "甲乙丙丁戊己庚辛壬癸", u);
    case 17:
    case 48:
        return xt(a, "零一二三四五六七八九", n0, "負", u, na | ra | jr);
    case 47:
        return xt(a, "零壹貳參肆伍陸柒捌玖", r0, "負", u, Tn | na | ra | jr);
    case 42:
        return xt(a, "零一二三四五六七八九", n0, "负", u, na | ra | jr);
    case 41:
        return xt(a, "零壹贰叁肆伍陆柒捌玖", r0, "负", u, Tn | na | ra | jr);
    case 26:
        return xt(a, "〇一二三四五六七八九", "十百千万", l0, u, 0);
    case 25:
        return xt(a, "零壱弐参四伍六七八九", "拾百千万", l0, u, Tn | na | ra);
    case 31:
        return xt(a, "영일이삼사오육칠팔구", "십백천만", uc, c, Tn | na | ra);
    case 33:
        return xt(a, "零一二三四五六七八九", "十百千萬", uc, c, 0);
    case 32:
        return xt(a, "零壹貳參四五六七八九", "拾百千", uc, c, Tn | na | ra);
    case 18:
        return jA(a, 2406, 2415, !0, l);
    case 20:
        return bn(a, 1, 19999, zF, 3, l);
    case 21:
        return jA(a, 2790, 2799, !0, l);
    case 22:
        return jA(a, 2662, 2671, !0, l);
    case 22:
        return bn(a, 1, 10999, YF, 3, l);
    case 23:
        return Ta(a, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
    case 24:
        return Ta(a, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
    case 27:
        return jA(a, 3302, 3311, !0, l);
    case 28:
        return Ta(a, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", u);
    case 29:
        return Ta(a, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", u);
    case 34:
        return jA(a, 3792, 3801, !0, l);
    case 37:
        return jA(a, 6160, 6169, !0, l);
    case 38:
        return jA(a, 4160, 4169, !0, l);
    case 39:
        return jA(a, 2918, 2927, !0, l);
    case 40:
        return jA(a, 1776, 1785, !0, l);
    case 43:
        return jA(a, 3046, 3055, !0, l);
    case 44:
        return jA(a, 3174, 3183, !0, l);
    case 45:
        return jA(a, 3664, 3673, !0, l);
    case 46:
        return jA(a, 3872, 3881, !0, l);
    case 3:
    default:
        return jA(a, 48, 57, !0, l)
    }
}, FQ = "data-html2canvas-ignore", i0 = function() {
    function a(n, i, l) {
        if (this.context = n,
        this.options = l,
        this.scrolledElements = [],
        this.referenceElement = i,
        this.counters = new XF,
        this.quoteDepth = 0,
        !i.ownerDocument)
            throw new Error("Cloned element does not have an owner document");
        this.documentElement = this.cloneNode(i.ownerDocument.documentElement, !1)
    }
    return a.prototype.toIFrame = function(n, i) {
        var l = this
          , u = jF(n, i);
        if (!u.contentWindow)
            return Promise.reject("Unable to find iframe window");
        var c = n.defaultView.pageXOffset
          , f = n.defaultView.pageYOffset
          , h = u.contentWindow
          , B = h.document
          , d = ZF(u).then(function() {
            return Ue(l, void 0, void 0, function() {
                var Q, C;
                return de(this, function(v) {
                    switch (v.label) {
                    case 0:
                        return this.scrolledElements.forEach($F),
                        h && (h.scrollTo(i.left, i.top),
                        /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (h.scrollY !== i.top || h.scrollX !== i.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"),
                        this.context.windowBounds = this.context.windowBounds.add(h.scrollX - i.left, h.scrollY - i.top, 0, 0))),
                        Q = this.options.onclone,
                        C = this.clonedReferenceElement,
                        typeof C > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : B.fonts && B.fonts.ready ? [4, B.fonts.ready] : [3, 2];
                    case 1:
                        v.sent(),
                        v.label = 2;
                    case 2:
                        return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, kF(B)] : [3, 4];
                    case 3:
                        v.sent(),
                        v.label = 4;
                    case 4:
                        return typeof Q == "function" ? [2, Promise.resolve().then(function() {
                            return Q(B, C)
                        }).then(function() {
                            return u
                        })] : [2, u]
                    }
                })
            })
        });
        return B.open(),
        B.write(WF(document.doctype) + "<html></html>"),
        PF(this.referenceElement.ownerDocument, c, f),
        B.replaceChild(B.adoptNode(this.documentElement), B.documentElement),
        B.close(),
        d
    }
    ,
    a.prototype.createElementClone = function(n) {
        if (Oc(n, 2))
            debugger ;if (vQ(n))
            return this.createCanvasClone(n);
        if ($h(n))
            return this.createVideoClone(n);
        if (A0(n))
            return this.createStyleClone(n);
        var i = n.cloneNode(!1);
        return Gc(i) && (Gc(n) && n.currentSrc && n.currentSrc !== n.src && (i.src = n.currentSrc,
        i.srcset = ""),
        i.loading === "lazy" && (i.loading = "eager")),
        e0(i) ? this.createCustomElementClone(i) : i
    }
    ,
    a.prototype.createCustomElementClone = function(n) {
        var i = document.createElement("html2canvascustomelement");
        return oc(n.style, i),
        i
    }
    ,
    a.prototype.createStyleClone = function(n) {
        try {
            var i = n.sheet;
            if (i && i.cssRules) {
                var l = [].slice.call(i.cssRules, 0).reduce(function(c, f) {
                    return f && typeof f.cssText == "string" ? c + f.cssText : c
                }, "")
                  , u = n.cloneNode(!1);
                return u.textContent = l,
                u
            }
        } catch (c) {
            if (this.context.logger.error("Unable to access cssRules property", c),
            c.name !== "SecurityError")
                throw c
        }
        return n.cloneNode(!1)
    }
    ,
    a.prototype.createCanvasClone = function(n) {
        var i;
        if (this.options.inlineImages && n.ownerDocument) {
            var l = n.ownerDocument.createElement("img");
            try {
                return l.src = n.toDataURL(),
                l
            } catch {
                this.context.logger.info("Unable to inline canvas contents, canvas is tainted", n)
            }
        }
        var u = n.cloneNode(!1);
        try {
            u.width = n.width,
            u.height = n.height;
            var c = n.getContext("2d")
              , f = u.getContext("2d");
            if (f)
                if (!this.options.allowTaint && c)
                    f.putImageData(c.getImageData(0, 0, n.width, n.height), 0, 0);
                else {
                    var h = (i = n.getContext("webgl2")) !== null && i !== void 0 ? i : n.getContext("webgl");
                    if (h) {
                        var B = h.getContextAttributes();
                        (B == null ? void 0 : B.preserveDrawingBuffer) === !1 && this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false", n)
                    }
                    f.drawImage(n, 0, 0)
                }
            return u
        } catch {
            this.context.logger.info("Unable to clone canvas as it is tainted", n)
        }
        return u
    }
    ,
    a.prototype.createVideoClone = function(n) {
        var i = n.ownerDocument.createElement("canvas");
        i.width = n.offsetWidth,
        i.height = n.offsetHeight;
        var l = i.getContext("2d");
        try {
            return l && (l.drawImage(n, 0, 0, i.width, i.height),
            this.options.allowTaint || l.getImageData(0, 0, i.width, i.height)),
            i
        } catch {
            this.context.logger.info("Unable to clone video as it is tainted", n)
        }
        var u = n.ownerDocument.createElement("canvas");
        return u.width = n.offsetWidth,
        u.height = n.offsetHeight,
        u
    }
    ,
    a.prototype.appendChildNode = function(n, i, l) {
        (!Ln(i) || !VF(i) && !i.hasAttribute(FQ) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(i))) && (!this.options.copyStyles || !Ln(i) || !A0(i)) && n.appendChild(this.cloneNode(i, l))
    }
    ,
    a.prototype.cloneChildNodes = function(n, i, l) {
        for (var u = this, c = n.shadowRoot ? n.shadowRoot.firstChild : n.firstChild; c; c = c.nextSibling)
            if (Ln(c) && pQ(c) && typeof c.assignedNodes == "function") {
                var f = c.assignedNodes();
                f.length && f.forEach(function(h) {
                    return u.appendChildNode(i, h, l)
                })
            } else
                this.appendChildNode(i, c, l)
    }
    ,
    a.prototype.cloneNode = function(n, i) {
        if (CQ(n))
            return document.createTextNode(n.data);
        if (!n.ownerDocument)
            return n.cloneNode(!1);
        var l = n.ownerDocument.defaultView;
        if (l && Ln(n) && (Rc(n) || qi(n))) {
            var u = this.createElementClone(n);
            u.style.transitionProperty = "none";
            var c = l.getComputedStyle(n)
              , f = l.getComputedStyle(n, ":before")
              , h = l.getComputedStyle(n, ":after");
            this.referenceElement === n && Rc(u) && (this.clonedReferenceElement = u),
            Af(u) && tE(u);
            var B = this.counters.parse(new Mh(this.context,c))
              , d = this.resolvePseudoContent(n, u, f, Wr.BEFORE);
            e0(n) && (i = !0),
            $h(n) || this.cloneChildNodes(n, u, i),
            d && u.insertBefore(d, u.firstChild);
            var Q = this.resolvePseudoContent(n, u, h, Wr.AFTER);
            return Q && u.appendChild(Q),
            this.counters.pop(B),
            (c && (this.options.copyStyles || qi(n)) && !yQ(n) || i) && oc(c, u),
            (n.scrollTop !== 0 || n.scrollLeft !== 0) && this.scrolledElements.push([u, n.scrollLeft, n.scrollTop]),
            (as(n) || ns(n)) && (as(u) || ns(u)) && (u.value = n.value),
            u
        }
        return n.cloneNode(!1)
    }
    ,
    a.prototype.resolvePseudoContent = function(n, i, l, u) {
        var c = this;
        if (l) {
            var f = l.content
              , h = i.ownerDocument;
            if (!(!h || !f || f === "none" || f === "-moz-alt-content" || l.display === "none")) {
                this.counters.parse(new Mh(this.context,l));
                var B = new Mm(this.context,l)
                  , d = h.createElement("html2canvaspseudoelement");
                oc(l, d),
                B.content.forEach(function(C) {
                    if (C.type === 0)
                        d.appendChild(h.createTextNode(C.value));
                    else if (C.type === 22) {
                        var v = h.createElement("img");
                        v.src = C.value,
                        v.style.opacity = "1",
                        d.appendChild(v)
                    } else if (C.type === 18) {
                        if (C.name === "attr") {
                            var D = C.values.filter(LA);
                            D.length && d.appendChild(h.createTextNode(n.getAttribute(D[0].value) || ""))
                        } else if (C.name === "counter") {
                            var L = C.values.filter(Kn)
                              , x = L[0]
                              , _ = L[1];
                            if (x && LA(x)) {
                                var O = c.counters.getCounterValue(x.value)
                                  , I = _ && LA(_) ? _c.parse(c.context, _.value) : 3;
                                d.appendChild(h.createTextNode(tl(O, I, !1)))
                            }
                        } else if (C.name === "counters") {
                            var R = C.values.filter(Kn)
                              , x = R[0]
                              , z = R[1]
                              , _ = R[2];
                            if (x && LA(x)) {
                                var X = c.counters.getCounterValues(x.value)
                                  , V = _ && LA(_) ? _c.parse(c.context, _.value) : 3
                                  , k = z && z.type === 0 ? z.value : ""
                                  , q = X.map(function(uA) {
                                    return tl(uA, V, !1)
                                }).join(k);
                                d.appendChild(h.createTextNode(q))
                            }
                        }
                    } else if (C.type === 20)
                        switch (C.value) {
                        case "open-quote":
                            d.appendChild(h.createTextNode(Oh(B.quotes, c.quoteDepth++, !0)));
                            break;
                        case "close-quote":
                            d.appendChild(h.createTextNode(Oh(B.quotes, --c.quoteDepth, !1)));
                            break;
                        default:
                            d.appendChild(h.createTextNode(C.value))
                        }
                }),
                d.className = Vc + " " + Xc;
                var Q = u === Wr.BEFORE ? " " + Vc : " " + Xc;
                return qi(i) ? i.className.baseValue += Q : i.className += Q,
                d
            }
        }
    }
    ,
    a.destroy = function(n) {
        return n.parentNode ? (n.parentNode.removeChild(n),
        !0) : !1
    }
    ,
    a
}(), Wr;
(function(a) {
    a[a.BEFORE = 0] = "BEFORE",
    a[a.AFTER = 1] = "AFTER"
}
)(Wr || (Wr = {}));
var jF = function(a, n) {
    var i = a.createElement("iframe");
    return i.className = "html2canvas-container",
    i.style.visibility = "hidden",
    i.style.position = "fixed",
    i.style.left = "-10000px",
    i.style.top = "0px",
    i.style.border = "0",
    i.width = n.width.toString(),
    i.height = n.height.toString(),
    i.scrolling = "no",
    i.setAttribute(FQ, "true"),
    a.body.appendChild(i),
    i
}, JF = function(a) {
    return new Promise(function(n) {
        if (a.complete) {
            n();
            return
        }
        if (!a.src) {
            n();
            return
        }
        a.onload = n,
        a.onerror = n
    }
    )
}, kF = function(a) {
    return Promise.all([].slice.call(a.images, 0).map(JF))
}, ZF = function(a) {
    return new Promise(function(n, i) {
        var l = a.contentWindow;
        if (!l)
            return i("No window assigned for iframe");
        var u = l.document;
        l.onload = a.onload = function() {
            l.onload = a.onload = null;
            var c = setInterval(function() {
                u.body.childNodes.length > 0 && u.readyState === "complete" && (clearInterval(c),
                n(a))
            }, 50)
        }
    }
    )
}, qF = ["all", "d", "content"], oc = function(a, n) {
    for (var i = a.length - 1; i >= 0; i--) {
        var l = a.item(i);
        qF.indexOf(l) === -1 && n.style.setProperty(l, a.getPropertyValue(l))
    }
    return n
}, WF = function(a) {
    var n = "";
    return a && (n += "<!DOCTYPE ",
    a.name && (n += a.name),
    a.internalSubset && (n += a.internalSubset),
    a.publicId && (n += '"' + a.publicId + '"'),
    a.systemId && (n += '"' + a.systemId + '"'),
    n += ">"),
    n
}, PF = function(a, n, i) {
    a && a.defaultView && (n !== a.defaultView.pageXOffset || i !== a.defaultView.pageYOffset) && a.defaultView.scrollTo(n, i)
}, $F = function(a) {
    var n = a[0]
      , i = a[1]
      , l = a[2];
    n.scrollLeft = i,
    n.scrollTop = l
}, AE = ":before", eE = ":after", Vc = "___html2canvas___pseudoelement_before", Xc = "___html2canvas___pseudoelement_after", s0 = `{
    content: "" !important;
    display: none !important;
}`, tE = function(a) {
    aE(a, "." + Vc + AE + s0 + `
         .` + Xc + eE + s0)
}, aE = function(a, n) {
    var i = a.ownerDocument;
    if (i) {
        var l = i.createElement("style");
        l.textContent = n,
        a.appendChild(l)
    }
}, EQ = function() {
    function a() {}
    return a.getOrigin = function(n) {
        var i = a._link;
        return i ? (i.href = n,
        i.href = i.href,
        i.protocol + i.hostname + i.port) : "about:blank"
    }
    ,
    a.isSameOrigin = function(n) {
        return a.getOrigin(n) === a._origin
    }
    ,
    a.setContext = function(n) {
        a._link = n.document.createElement("a"),
        a._origin = a.getOrigin(n.location.href)
    }
    ,
    a._origin = "about:blank",
    a
}(), nE = function() {
    function a(n, i) {
        this.context = n,
        this._options = i,
        this._cache = {}
    }
    return a.prototype.addImage = function(n) {
        var i = Promise.resolve();
        return this.has(n) || (fc(n) || sE(n)) && (this._cache[n] = this.loadImage(n)).catch(function() {}),
        i
    }
    ,
    a.prototype.match = function(n) {
        return this._cache[n]
    }
    ,
    a.prototype.loadImage = function(n) {
        return Ue(this, void 0, void 0, function() {
            var i, l, u, c, f = this;
            return de(this, function(h) {
                switch (h.label) {
                case 0:
                    return i = EQ.isSameOrigin(n),
                    l = !cc(n) && this._options.useCORS === !0 && ue.SUPPORT_CORS_IMAGES && !i,
                    u = !cc(n) && !i && !fc(n) && typeof this._options.proxy == "string" && ue.SUPPORT_CORS_XHR && !l,
                    !i && this._options.allowTaint === !1 && !cc(n) && !fc(n) && !u && !l ? [2] : (c = n,
                    u ? [4, this.proxy(c)] : [3, 2]);
                case 1:
                    c = h.sent(),
                    h.label = 2;
                case 2:
                    return this.context.logger.debug("Added image " + n.substring(0, 256)),
                    [4, new Promise(function(B, d) {
                        var Q = new Image;
                        Q.onload = function() {
                            return B(Q)
                        }
                        ,
                        Q.onerror = d,
                        (uE(c) || l) && (Q.crossOrigin = "anonymous"),
                        Q.src = c,
                        Q.complete === !0 && setTimeout(function() {
                            return B(Q)
                        }, 500),
                        f._options.imageTimeout > 0 && setTimeout(function() {
                            return d("Timed out (" + f._options.imageTimeout + "ms) loading image")
                        }, f._options.imageTimeout)
                    }
                    )];
                case 3:
                    return [2, h.sent()]
                }
            })
        })
    }
    ,
    a.prototype.has = function(n) {
        return typeof this._cache[n] < "u"
    }
    ,
    a.prototype.keys = function() {
        return Promise.resolve(Object.keys(this._cache))
    }
    ,
    a.prototype.proxy = function(n) {
        var i = this
          , l = this._options.proxy;
        if (!l)
            throw new Error("No proxy defined");
        var u = n.substring(0, 256);
        return new Promise(function(c, f) {
            var h = ue.SUPPORT_RESPONSE_TYPE ? "blob" : "text"
              , B = new XMLHttpRequest;
            B.onload = function() {
                if (B.status === 200)
                    if (h === "text")
                        c(B.response);
                    else {
                        var C = new FileReader;
                        C.addEventListener("load", function() {
                            return c(C.result)
                        }, !1),
                        C.addEventListener("error", function(v) {
                            return f(v)
                        }, !1),
                        C.readAsDataURL(B.response)
                    }
                else
                    f("Failed to proxy resource " + u + " with status code " + B.status)
            }
            ,
            B.onerror = f;
            var d = l.indexOf("?") > -1 ? "&" : "?";
            if (B.open("GET", "" + l + d + "url=" + encodeURIComponent(n) + "&responseType=" + h),
            h !== "text" && B instanceof XMLHttpRequest && (B.responseType = h),
            i._options.imageTimeout) {
                var Q = i._options.imageTimeout;
                B.timeout = Q,
                B.ontimeout = function() {
                    return f("Timed out (" + Q + "ms) proxying " + u)
                }
            }
            B.send()
        }
        )
    }
    ,
    a
}(), rE = /^data:image\/svg\+xml/i, lE = /^data:image\/.*;base64,/i, iE = /^data:image\/.*/i, sE = function(a) {
    return ue.SUPPORT_SVG_DRAWING || !oE(a)
}, cc = function(a) {
    return iE.test(a)
}, uE = function(a) {
    return lE.test(a)
}, fc = function(a) {
    return a.substr(0, 4) === "blob"
}, oE = function(a) {
    return a.substr(-3).toLowerCase() === "svg" || rE.test(a)
}, P = function() {
    function a(n, i) {
        this.type = 0,
        this.x = n,
        this.y = i
    }
    return a.prototype.add = function(n, i) {
        return new a(this.x + n,this.y + i)
    }
    ,
    a
}(), Hn = function(a, n, i) {
    return new P(a.x + (n.x - a.x) * i,a.y + (n.y - a.y) * i)
}, Xi = function() {
    function a(n, i, l, u) {
        this.type = 1,
        this.start = n,
        this.startControl = i,
        this.endControl = l,
        this.end = u
    }
    return a.prototype.subdivide = function(n, i) {
        var l = Hn(this.start, this.startControl, n)
          , u = Hn(this.startControl, this.endControl, n)
          , c = Hn(this.endControl, this.end, n)
          , f = Hn(l, u, n)
          , h = Hn(u, c, n)
          , B = Hn(f, h, n);
        return i ? new a(this.start,l,f,B) : new a(B,h,c,this.end)
    }
    ,
    a.prototype.add = function(n, i) {
        return new a(this.start.add(n, i),this.startControl.add(n, i),this.endControl.add(n, i),this.end.add(n, i))
    }
    ,
    a.prototype.reverse = function() {
        return new a(this.end,this.endControl,this.startControl,this.start)
    }
    ,
    a
}(), ke = function(a) {
    return a.type === 1
}, cE = function() {
    function a(n) {
        var i = n.styles
          , l = n.bounds
          , u = Yr(i.borderTopLeftRadius, l.width, l.height)
          , c = u[0]
          , f = u[1]
          , h = Yr(i.borderTopRightRadius, l.width, l.height)
          , B = h[0]
          , d = h[1]
          , Q = Yr(i.borderBottomRightRadius, l.width, l.height)
          , C = Q[0]
          , v = Q[1]
          , D = Yr(i.borderBottomLeftRadius, l.width, l.height)
          , L = D[0]
          , x = D[1]
          , _ = [];
        _.push((c + B) / l.width),
        _.push((L + C) / l.width),
        _.push((f + x) / l.height),
        _.push((d + v) / l.height);
        var O = Math.max.apply(Math, _);
        O > 1 && (c /= O,
        f /= O,
        B /= O,
        d /= O,
        C /= O,
        v /= O,
        L /= O,
        x /= O);
        var I = l.width - B
          , R = l.height - v
          , z = l.width - C
          , X = l.height - x
          , V = i.borderTopWidth
          , k = i.borderRightWidth
          , q = i.borderBottomWidth
          , W = i.borderLeftWidth
          , nA = _A(i.paddingTop, n.bounds.width)
          , uA = _A(i.paddingRight, n.bounds.width)
          , oA = _A(i.paddingBottom, n.bounds.width)
          , cA = _A(i.paddingLeft, n.bounds.width);
        this.topLeftBorderDoubleOuterBox = c > 0 || f > 0 ? RA(l.left + W / 3, l.top + V / 3, c - W / 3, f - V / 3, EA.TOP_LEFT) : new P(l.left + W / 3,l.top + V / 3),
        this.topRightBorderDoubleOuterBox = c > 0 || f > 0 ? RA(l.left + I, l.top + V / 3, B - k / 3, d - V / 3, EA.TOP_RIGHT) : new P(l.left + l.width - k / 3,l.top + V / 3),
        this.bottomRightBorderDoubleOuterBox = C > 0 || v > 0 ? RA(l.left + z, l.top + R, C - k / 3, v - q / 3, EA.BOTTOM_RIGHT) : new P(l.left + l.width - k / 3,l.top + l.height - q / 3),
        this.bottomLeftBorderDoubleOuterBox = L > 0 || x > 0 ? RA(l.left + W / 3, l.top + X, L - W / 3, x - q / 3, EA.BOTTOM_LEFT) : new P(l.left + W / 3,l.top + l.height - q / 3),
        this.topLeftBorderDoubleInnerBox = c > 0 || f > 0 ? RA(l.left + W * 2 / 3, l.top + V * 2 / 3, c - W * 2 / 3, f - V * 2 / 3, EA.TOP_LEFT) : new P(l.left + W * 2 / 3,l.top + V * 2 / 3),
        this.topRightBorderDoubleInnerBox = c > 0 || f > 0 ? RA(l.left + I, l.top + V * 2 / 3, B - k * 2 / 3, d - V * 2 / 3, EA.TOP_RIGHT) : new P(l.left + l.width - k * 2 / 3,l.top + V * 2 / 3),
        this.bottomRightBorderDoubleInnerBox = C > 0 || v > 0 ? RA(l.left + z, l.top + R, C - k * 2 / 3, v - q * 2 / 3, EA.BOTTOM_RIGHT) : new P(l.left + l.width - k * 2 / 3,l.top + l.height - q * 2 / 3),
        this.bottomLeftBorderDoubleInnerBox = L > 0 || x > 0 ? RA(l.left + W * 2 / 3, l.top + X, L - W * 2 / 3, x - q * 2 / 3, EA.BOTTOM_LEFT) : new P(l.left + W * 2 / 3,l.top + l.height - q * 2 / 3),
        this.topLeftBorderStroke = c > 0 || f > 0 ? RA(l.left + W / 2, l.top + V / 2, c - W / 2, f - V / 2, EA.TOP_LEFT) : new P(l.left + W / 2,l.top + V / 2),
        this.topRightBorderStroke = c > 0 || f > 0 ? RA(l.left + I, l.top + V / 2, B - k / 2, d - V / 2, EA.TOP_RIGHT) : new P(l.left + l.width - k / 2,l.top + V / 2),
        this.bottomRightBorderStroke = C > 0 || v > 0 ? RA(l.left + z, l.top + R, C - k / 2, v - q / 2, EA.BOTTOM_RIGHT) : new P(l.left + l.width - k / 2,l.top + l.height - q / 2),
        this.bottomLeftBorderStroke = L > 0 || x > 0 ? RA(l.left + W / 2, l.top + X, L - W / 2, x - q / 2, EA.BOTTOM_LEFT) : new P(l.left + W / 2,l.top + l.height - q / 2),
        this.topLeftBorderBox = c > 0 || f > 0 ? RA(l.left, l.top, c, f, EA.TOP_LEFT) : new P(l.left,l.top),
        this.topRightBorderBox = B > 0 || d > 0 ? RA(l.left + I, l.top, B, d, EA.TOP_RIGHT) : new P(l.left + l.width,l.top),
        this.bottomRightBorderBox = C > 0 || v > 0 ? RA(l.left + z, l.top + R, C, v, EA.BOTTOM_RIGHT) : new P(l.left + l.width,l.top + l.height),
        this.bottomLeftBorderBox = L > 0 || x > 0 ? RA(l.left, l.top + X, L, x, EA.BOTTOM_LEFT) : new P(l.left,l.top + l.height),
        this.topLeftPaddingBox = c > 0 || f > 0 ? RA(l.left + W, l.top + V, Math.max(0, c - W), Math.max(0, f - V), EA.TOP_LEFT) : new P(l.left + W,l.top + V),
        this.topRightPaddingBox = B > 0 || d > 0 ? RA(l.left + Math.min(I, l.width - k), l.top + V, I > l.width + k ? 0 : Math.max(0, B - k), Math.max(0, d - V), EA.TOP_RIGHT) : new P(l.left + l.width - k,l.top + V),
        this.bottomRightPaddingBox = C > 0 || v > 0 ? RA(l.left + Math.min(z, l.width - W), l.top + Math.min(R, l.height - q), Math.max(0, C - k), Math.max(0, v - q), EA.BOTTOM_RIGHT) : new P(l.left + l.width - k,l.top + l.height - q),
        this.bottomLeftPaddingBox = L > 0 || x > 0 ? RA(l.left + W, l.top + Math.min(X, l.height - q), Math.max(0, L - W), Math.max(0, x - q), EA.BOTTOM_LEFT) : new P(l.left + W,l.top + l.height - q),
        this.topLeftContentBox = c > 0 || f > 0 ? RA(l.left + W + cA, l.top + V + nA, Math.max(0, c - (W + cA)), Math.max(0, f - (V + nA)), EA.TOP_LEFT) : new P(l.left + W + cA,l.top + V + nA),
        this.topRightContentBox = B > 0 || d > 0 ? RA(l.left + Math.min(I, l.width + W + cA), l.top + V + nA, I > l.width + W + cA ? 0 : B - W + cA, d - (V + nA), EA.TOP_RIGHT) : new P(l.left + l.width - (k + uA),l.top + V + nA),
        this.bottomRightContentBox = C > 0 || v > 0 ? RA(l.left + Math.min(z, l.width - (W + cA)), l.top + Math.min(R, l.height + V + nA), Math.max(0, C - (k + uA)), v - (q + oA), EA.BOTTOM_RIGHT) : new P(l.left + l.width - (k + uA),l.top + l.height - (q + oA)),
        this.bottomLeftContentBox = L > 0 || x > 0 ? RA(l.left + W + cA, l.top + X, Math.max(0, L - (W + cA)), x - (q + oA), EA.BOTTOM_LEFT) : new P(l.left + W + cA,l.top + l.height - (q + oA))
    }
    return a
}(), EA;
(function(a) {
    a[a.TOP_LEFT = 0] = "TOP_LEFT",
    a[a.TOP_RIGHT = 1] = "TOP_RIGHT",
    a[a.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT",
    a[a.BOTTOM_LEFT = 3] = "BOTTOM_LEFT"
}
)(EA || (EA = {}));
var RA = function(a, n, i, l, u) {
    var c = 4 * ((Math.sqrt(2) - 1) / 3)
      , f = i * c
      , h = l * c
      , B = a + i
      , d = n + l;
    switch (u) {
    case EA.TOP_LEFT:
        return new Xi(new P(a,d),new P(a,d - h),new P(B - f,n),new P(B,n));
    case EA.TOP_RIGHT:
        return new Xi(new P(a,n),new P(a + f,n),new P(B,d - h),new P(B,d));
    case EA.BOTTOM_RIGHT:
        return new Xi(new P(B,n),new P(B,n + h),new P(a + f,d),new P(a,d));
    case EA.BOTTOM_LEFT:
    default:
        return new Xi(new P(B,d),new P(B - f,d),new P(a,n + h),new P(a,n))
    }
}
  , rs = function(a) {
    return [a.topLeftBorderBox, a.topRightBorderBox, a.bottomRightBorderBox, a.bottomLeftBorderBox]
}
  , fE = function(a) {
    return [a.topLeftContentBox, a.topRightContentBox, a.bottomRightContentBox, a.bottomLeftContentBox]
}
  , ls = function(a) {
    return [a.topLeftPaddingBox, a.topRightPaddingBox, a.bottomRightPaddingBox, a.bottomLeftPaddingBox]
}
  , BE = function() {
    function a(n, i, l) {
        this.offsetX = n,
        this.offsetY = i,
        this.matrix = l,
        this.type = 0,
        this.target = 6
    }
    return a
}()
  , Yi = function() {
    function a(n, i) {
        this.path = n,
        this.target = i,
        this.type = 1
    }
    return a
}()
  , gE = function() {
    function a(n) {
        this.opacity = n,
        this.type = 2,
        this.target = 6
    }
    return a
}()
  , dE = function(a) {
    return a.type === 0
}
  , bQ = function(a) {
    return a.type === 1
}
  , hE = function(a) {
    return a.type === 2
}
  , u0 = function(a, n) {
    return a.length === n.length ? a.some(function(i, l) {
        return i === n[l]
    }) : !1
}
  , QE = function(a, n, i, l, u) {
    return a.map(function(c, f) {
        switch (f) {
        case 0:
            return c.add(n, i);
        case 1:
            return c.add(n + l, i);
        case 2:
            return c.add(n + l, i + u);
        case 3:
            return c.add(n, i + u)
        }
        return c
    })
}
  , HQ = function() {
    function a(n) {
        this.element = n,
        this.inlineLevel = [],
        this.nonInlineLevel = [],
        this.negativeZIndex = [],
        this.zeroOrAutoZIndexOrTransformedOrOpacity = [],
        this.positiveZIndex = [],
        this.nonPositionedFloats = [],
        this.nonPositionedInlineLevel = []
    }
    return a
}()
  , xQ = function() {
    function a(n, i) {
        if (this.container = n,
        this.parent = i,
        this.effects = [],
        this.curves = new cE(this.container),
        this.container.styles.opacity < 1 && this.effects.push(new gE(this.container.styles.opacity)),
        this.container.styles.transform !== null) {
            var l = this.container.bounds.left + this.container.styles.transformOrigin[0].number
              , u = this.container.bounds.top + this.container.styles.transformOrigin[1].number
              , c = this.container.styles.transform;
            this.effects.push(new BE(l,u,c))
        }
        if (this.container.styles.overflowX !== 0) {
            var f = rs(this.curves)
              , h = ls(this.curves);
            u0(f, h) ? this.effects.push(new Yi(f,6)) : (this.effects.push(new Yi(f,2)),
            this.effects.push(new Yi(h,4)))
        }
    }
    return a.prototype.getEffects = function(n) {
        for (var i = [2, 3].indexOf(this.container.styles.position) === -1, l = this.parent, u = this.effects.slice(0); l; ) {
            var c = l.effects.filter(function(B) {
                return !bQ(B)
            });
            if (i || l.container.styles.position !== 0 || !l.parent) {
                if (u.unshift.apply(u, c),
                i = [2, 3].indexOf(l.container.styles.position) === -1,
                l.container.styles.overflowX !== 0) {
                    var f = rs(l.curves)
                      , h = ls(l.curves);
                    u0(f, h) || u.unshift(new Yi(h,6))
                }
            } else
                u.unshift.apply(u, c);
            l = l.parent
        }
        return u.filter(function(B) {
            return Ae(B.target, n)
        })
    }
    ,
    a
}()
  , Yc = function(a, n, i, l) {
    a.container.elements.forEach(function(u) {
        var c = Ae(u.flags, 4)
          , f = Ae(u.flags, 2)
          , h = new xQ(u,a);
        Ae(u.styles.display, 2048) && l.push(h);
        var B = Ae(u.flags, 8) ? [] : l;
        if (c || f) {
            var d = c || u.styles.isPositioned() ? i : n
              , Q = new HQ(h);
            if (u.styles.isPositioned() || u.styles.opacity < 1 || u.styles.isTransformed()) {
                var C = u.styles.zIndex.order;
                if (C < 0) {
                    var v = 0;
                    d.negativeZIndex.some(function(L, x) {
                        return C > L.element.container.styles.zIndex.order ? (v = x,
                        !1) : v > 0
                    }),
                    d.negativeZIndex.splice(v, 0, Q)
                } else if (C > 0) {
                    var D = 0;
                    d.positiveZIndex.some(function(L, x) {
                        return C >= L.element.container.styles.zIndex.order ? (D = x + 1,
                        !1) : D > 0
                    }),
                    d.positiveZIndex.splice(D, 0, Q)
                } else
                    d.zeroOrAutoZIndexOrTransformedOrOpacity.push(Q)
            } else
                u.styles.isFloating() ? d.nonPositionedFloats.push(Q) : d.nonPositionedInlineLevel.push(Q);
            Yc(h, Q, c ? Q : i, B)
        } else
            u.styles.isInlineLevel() ? n.inlineLevel.push(h) : n.nonInlineLevel.push(h),
            Yc(h, n, i, B);
        Ae(u.flags, 8) && SQ(u, B)
    })
}
  , SQ = function(a, n) {
    for (var i = a instanceof Nc ? a.start : 1, l = a instanceof Nc ? a.reversed : !1, u = 0; u < n.length; u++) {
        var c = n[u];
        c.container instanceof BQ && typeof c.container.value == "number" && c.container.value !== 0 && (i = c.container.value),
        c.listValue = tl(i, c.container.styles.listStyleType, !0),
        i += l ? -1 : 1
    }
}
  , wE = function(a) {
    var n = new xQ(a,null)
      , i = new HQ(n)
      , l = [];
    return Yc(n, i, i, l),
    SQ(n.container, l),
    i
}
  , o0 = function(a, n) {
    switch (n) {
    case 0:
        return qe(a.topLeftBorderBox, a.topLeftPaddingBox, a.topRightBorderBox, a.topRightPaddingBox);
    case 1:
        return qe(a.topRightBorderBox, a.topRightPaddingBox, a.bottomRightBorderBox, a.bottomRightPaddingBox);
    case 2:
        return qe(a.bottomRightBorderBox, a.bottomRightPaddingBox, a.bottomLeftBorderBox, a.bottomLeftPaddingBox);
    case 3:
    default:
        return qe(a.bottomLeftBorderBox, a.bottomLeftPaddingBox, a.topLeftBorderBox, a.topLeftPaddingBox)
    }
}
  , CE = function(a, n) {
    switch (n) {
    case 0:
        return qe(a.topLeftBorderBox, a.topLeftBorderDoubleOuterBox, a.topRightBorderBox, a.topRightBorderDoubleOuterBox);
    case 1:
        return qe(a.topRightBorderBox, a.topRightBorderDoubleOuterBox, a.bottomRightBorderBox, a.bottomRightBorderDoubleOuterBox);
    case 2:
        return qe(a.bottomRightBorderBox, a.bottomRightBorderDoubleOuterBox, a.bottomLeftBorderBox, a.bottomLeftBorderDoubleOuterBox);
    case 3:
    default:
        return qe(a.bottomLeftBorderBox, a.bottomLeftBorderDoubleOuterBox, a.topLeftBorderBox, a.topLeftBorderDoubleOuterBox)
    }
}
  , UE = function(a, n) {
    switch (n) {
    case 0:
        return qe(a.topLeftBorderDoubleInnerBox, a.topLeftPaddingBox, a.topRightBorderDoubleInnerBox, a.topRightPaddingBox);
    case 1:
        return qe(a.topRightBorderDoubleInnerBox, a.topRightPaddingBox, a.bottomRightBorderDoubleInnerBox, a.bottomRightPaddingBox);
    case 2:
        return qe(a.bottomRightBorderDoubleInnerBox, a.bottomRightPaddingBox, a.bottomLeftBorderDoubleInnerBox, a.bottomLeftPaddingBox);
    case 3:
    default:
        return qe(a.bottomLeftBorderDoubleInnerBox, a.bottomLeftPaddingBox, a.topLeftBorderDoubleInnerBox, a.topLeftPaddingBox)
    }
}
  , vE = function(a, n) {
    switch (n) {
    case 0:
        return zi(a.topLeftBorderStroke, a.topRightBorderStroke);
    case 1:
        return zi(a.topRightBorderStroke, a.bottomRightBorderStroke);
    case 2:
        return zi(a.bottomRightBorderStroke, a.bottomLeftBorderStroke);
    case 3:
    default:
        return zi(a.bottomLeftBorderStroke, a.topLeftBorderStroke)
    }
}
  , zi = function(a, n) {
    var i = [];
    return ke(a) ? i.push(a.subdivide(.5, !1)) : i.push(a),
    ke(n) ? i.push(n.subdivide(.5, !0)) : i.push(n),
    i
}
  , qe = function(a, n, i, l) {
    var u = [];
    return ke(a) ? u.push(a.subdivide(.5, !1)) : u.push(a),
    ke(i) ? u.push(i.subdivide(.5, !0)) : u.push(i),
    ke(l) ? u.push(l.subdivide(.5, !0).reverse()) : u.push(l),
    ke(n) ? u.push(n.subdivide(.5, !1).reverse()) : u.push(n),
    u
}
  , TQ = function(a) {
    var n = a.bounds
      , i = a.styles;
    return n.add(i.borderLeftWidth, i.borderTopWidth, -(i.borderRightWidth + i.borderLeftWidth), -(i.borderTopWidth + i.borderBottomWidth))
}
  , is = function(a) {
    var n = a.styles
      , i = a.bounds
      , l = _A(n.paddingLeft, i.width)
      , u = _A(n.paddingRight, i.width)
      , c = _A(n.paddingTop, i.width)
      , f = _A(n.paddingBottom, i.width);
    return i.add(l + n.borderLeftWidth, c + n.borderTopWidth, -(n.borderRightWidth + n.borderLeftWidth + l + u), -(n.borderTopWidth + n.borderBottomWidth + c + f))
}
  , yE = function(a, n) {
    return a === 0 ? n.bounds : a === 2 ? is(n) : TQ(n)
}
  , pE = function(a, n) {
    return a === 0 ? n.bounds : a === 2 ? is(n) : TQ(n)
}
  , Bc = function(a, n, i) {
    var l = yE(Dn(a.styles.backgroundOrigin, n), a)
      , u = pE(Dn(a.styles.backgroundClip, n), a)
      , c = mE(Dn(a.styles.backgroundSize, n), i, l)
      , f = c[0]
      , h = c[1]
      , B = Yr(Dn(a.styles.backgroundPosition, n), l.width - f, l.height - h)
      , d = FE(Dn(a.styles.backgroundRepeat, n), B, c, l, u)
      , Q = Math.round(l.left + B[0])
      , C = Math.round(l.top + B[1]);
    return [d, Q, C, f, h]
}
  , xn = function(a) {
    return LA(a) && a.value === In.AUTO
}
  , ji = function(a) {
    return typeof a == "number"
}
  , mE = function(a, n, i) {
    var l = n[0]
      , u = n[1]
      , c = n[2]
      , f = a[0]
      , h = a[1];
    if (!f)
        return [0, 0];
    if (qA(f) && h && qA(h))
        return [_A(f, i.width), _A(h, i.height)];
    var B = ji(c);
    if (LA(f) && (f.value === In.CONTAIN || f.value === In.COVER)) {
        if (ji(c)) {
            var d = i.width / i.height;
            return d < c != (f.value === In.COVER) ? [i.width, i.width / c] : [i.height * c, i.height]
        }
        return [i.width, i.height]
    }
    var Q = ji(l)
      , C = ji(u)
      , v = Q || C;
    if (xn(f) && (!h || xn(h))) {
        if (Q && C)
            return [l, u];
        if (!B && !v)
            return [i.width, i.height];
        if (v && B) {
            var D = Q ? l : u * c
              , L = C ? u : l / c;
            return [D, L]
        }
        var x = Q ? l : i.width
          , _ = C ? u : i.height;
        return [x, _]
    }
    if (B) {
        var O = 0
          , I = 0;
        return qA(f) ? O = _A(f, i.width) : qA(h) && (I = _A(h, i.height)),
        xn(f) ? O = I * c : (!h || xn(h)) && (I = O / c),
        [O, I]
    }
    var R = null
      , z = null;
    if (qA(f) ? R = _A(f, i.width) : h && qA(h) && (z = _A(h, i.height)),
    R !== null && (!h || xn(h)) && (z = Q && C ? R / l * u : i.height),
    z !== null && xn(f) && (R = Q && C ? z / u * l : i.width),
    R !== null && z !== null)
        return [R, z];
    throw new Error("Unable to calculate background-size for element")
}
  , Dn = function(a, n) {
    var i = a[n];
    return typeof i > "u" ? a[0] : i
}
  , FE = function(a, n, i, l, u) {
    var c = n[0]
      , f = n[1]
      , h = i[0]
      , B = i[1];
    switch (a) {
    case 2:
        return [new P(Math.round(l.left),Math.round(l.top + f)), new P(Math.round(l.left + l.width),Math.round(l.top + f)), new P(Math.round(l.left + l.width),Math.round(B + l.top + f)), new P(Math.round(l.left),Math.round(B + l.top + f))];
    case 3:
        return [new P(Math.round(l.left + c),Math.round(l.top)), new P(Math.round(l.left + c + h),Math.round(l.top)), new P(Math.round(l.left + c + h),Math.round(l.height + l.top)), new P(Math.round(l.left + c),Math.round(l.height + l.top))];
    case 1:
        return [new P(Math.round(l.left + c),Math.round(l.top + f)), new P(Math.round(l.left + c + h),Math.round(l.top + f)), new P(Math.round(l.left + c + h),Math.round(l.top + f + B)), new P(Math.round(l.left + c),Math.round(l.top + f + B))];
    default:
        return [new P(Math.round(u.left),Math.round(u.top)), new P(Math.round(u.left + u.width),Math.round(u.top)), new P(Math.round(u.left + u.width),Math.round(u.height + u.top)), new P(Math.round(u.left),Math.round(u.height + u.top))]
    }
}
  , EE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  , c0 = "Hidden Text"
  , bE = function() {
    function a(n) {
        this._data = {},
        this._document = n
    }
    return a.prototype.parseMetrics = function(n, i) {
        var l = this._document.createElement("div")
          , u = this._document.createElement("img")
          , c = this._document.createElement("span")
          , f = this._document.body;
        l.style.visibility = "hidden",
        l.style.fontFamily = n,
        l.style.fontSize = i,
        l.style.margin = "0",
        l.style.padding = "0",
        l.style.whiteSpace = "nowrap",
        f.appendChild(l),
        u.src = EE,
        u.width = 1,
        u.height = 1,
        u.style.margin = "0",
        u.style.padding = "0",
        u.style.verticalAlign = "baseline",
        c.style.fontFamily = n,
        c.style.fontSize = i,
        c.style.margin = "0",
        c.style.padding = "0",
        c.appendChild(this._document.createTextNode(c0)),
        l.appendChild(c),
        l.appendChild(u);
        var h = u.offsetTop - c.offsetTop + 2;
        l.removeChild(c),
        l.appendChild(this._document.createTextNode(c0)),
        l.style.lineHeight = "normal",
        u.style.verticalAlign = "super";
        var B = u.offsetTop - l.offsetTop + 2;
        return f.removeChild(l),
        {
            baseline: h,
            middle: B
        }
    }
    ,
    a.prototype.getMetrics = function(n, i) {
        var l = n + " " + i;
        return typeof this._data[l] > "u" && (this._data[l] = this.parseMetrics(n, i)),
        this._data[l]
    }
    ,
    a
}()
  , DQ = function() {
    function a(n, i) {
        this.context = n,
        this.options = i
    }
    return a
}()
  , HE = 1e4
  , xE = function(a) {
    tt(n, a);
    function n(i, l) {
        var u = a.call(this, i, l) || this;
        return u._activeEffects = [],
        u.canvas = l.canvas ? l.canvas : document.createElement("canvas"),
        u.ctx = u.canvas.getContext("2d"),
        l.canvas || (u.canvas.width = Math.floor(l.width * l.scale),
        u.canvas.height = Math.floor(l.height * l.scale),
        u.canvas.style.width = l.width + "px",
        u.canvas.style.height = l.height + "px"),
        u.fontMetrics = new bE(document),
        u.ctx.scale(u.options.scale, u.options.scale),
        u.ctx.translate(-l.x, -l.y),
        u.ctx.textBaseline = "bottom",
        u._activeEffects = [],
        u.context.logger.debug("Canvas renderer initialized (" + l.width + "x" + l.height + ") with scale " + l.scale),
        u
    }
    return n.prototype.applyEffects = function(i) {
        for (var l = this; this._activeEffects.length; )
            this.popEffect();
        i.forEach(function(u) {
            return l.applyEffect(u)
        })
    }
    ,
    n.prototype.applyEffect = function(i) {
        this.ctx.save(),
        hE(i) && (this.ctx.globalAlpha = i.opacity),
        dE(i) && (this.ctx.translate(i.offsetX, i.offsetY),
        this.ctx.transform(i.matrix[0], i.matrix[1], i.matrix[2], i.matrix[3], i.matrix[4], i.matrix[5]),
        this.ctx.translate(-i.offsetX, -i.offsetY)),
        bQ(i) && (this.path(i.path),
        this.ctx.clip()),
        this._activeEffects.push(i)
    }
    ,
    n.prototype.popEffect = function() {
        this._activeEffects.pop(),
        this.ctx.restore()
    }
    ,
    n.prototype.renderStack = function(i) {
        return Ue(this, void 0, void 0, function() {
            var l;
            return de(this, function(u) {
                switch (u.label) {
                case 0:
                    return l = i.element.container.styles,
                    l.isVisible() ? [4, this.renderStackContent(i)] : [3, 2];
                case 1:
                    u.sent(),
                    u.label = 2;
                case 2:
                    return [2]
                }
            })
        })
    }
    ,
    n.prototype.renderNode = function(i) {
        return Ue(this, void 0, void 0, function() {
            return de(this, function(l) {
                switch (l.label) {
                case 0:
                    if (Ae(i.container.flags, 16))
                        debugger ;return i.container.styles.isVisible() ? [4, this.renderNodeBackgroundAndBorders(i)] : [3, 3];
                case 1:
                    return l.sent(),
                    [4, this.renderNodeContent(i)];
                case 2:
                    l.sent(),
                    l.label = 3;
                case 3:
                    return [2]
                }
            })
        })
    }
    ,
    n.prototype.renderTextWithLetterSpacing = function(i, l, u) {
        var c = this;
        if (l === 0)
            this.ctx.fillText(i.text, i.bounds.left, i.bounds.top + u);
        else {
            var f = Pc(i.text);
            f.reduce(function(h, B) {
                return c.ctx.fillText(B, h, i.bounds.top + u),
                h + c.ctx.measureText(B).width
            }, i.bounds.left)
        }
    }
    ,
    n.prototype.createFontStyle = function(i) {
        var l = i.fontVariant.filter(function(f) {
            return f === "normal" || f === "small-caps"
        }).join("")
          , u = IE(i.fontFamily).join(", ")
          , c = ll(i.fontSize) ? "" + i.fontSize.number + i.fontSize.unit : i.fontSize.number + "px";
        return [[i.fontStyle, l, i.fontWeight, c, u].join(" "), u, c]
    }
    ,
    n.prototype.renderTextNode = function(i, l) {
        return Ue(this, void 0, void 0, function() {
            var u, c, f, h, B, d, Q, C, v = this;
            return de(this, function(D) {
                return u = this.createFontStyle(l),
                c = u[0],
                f = u[1],
                h = u[2],
                this.ctx.font = c,
                this.ctx.direction = l.direction === 1 ? "rtl" : "ltr",
                this.ctx.textAlign = "left",
                this.ctx.textBaseline = "alphabetic",
                B = this.fontMetrics.getMetrics(f, h),
                d = B.baseline,
                Q = B.middle,
                C = l.paintOrder,
                i.textBounds.forEach(function(L) {
                    C.forEach(function(x) {
                        switch (x) {
                        case 0:
                            v.ctx.fillStyle = re(l.color),
                            v.renderTextWithLetterSpacing(L, l.letterSpacing, d);
                            var _ = l.textShadow;
                            _.length && L.text.trim().length && (_.slice(0).reverse().forEach(function(O) {
                                v.ctx.shadowColor = re(O.color),
                                v.ctx.shadowOffsetX = O.offsetX.number * v.options.scale,
                                v.ctx.shadowOffsetY = O.offsetY.number * v.options.scale,
                                v.ctx.shadowBlur = O.blur.number,
                                v.renderTextWithLetterSpacing(L, l.letterSpacing, d)
                            }),
                            v.ctx.shadowColor = "",
                            v.ctx.shadowOffsetX = 0,
                            v.ctx.shadowOffsetY = 0,
                            v.ctx.shadowBlur = 0),
                            l.textDecorationLine.length && (v.ctx.fillStyle = re(l.textDecorationColor || l.color),
                            l.textDecorationLine.forEach(function(O) {
                                switch (O) {
                                case 1:
                                    v.ctx.fillRect(L.bounds.left, Math.round(L.bounds.top + d), L.bounds.width, 1);
                                    break;
                                case 2:
                                    v.ctx.fillRect(L.bounds.left, Math.round(L.bounds.top), L.bounds.width, 1);
                                    break;
                                case 3:
                                    v.ctx.fillRect(L.bounds.left, Math.ceil(L.bounds.top + Q), L.bounds.width, 1);
                                    break
                                }
                            }));
                            break;
                        case 1:
                            l.webkitTextStrokeWidth && L.text.trim().length && (v.ctx.strokeStyle = re(l.webkitTextStrokeColor),
                            v.ctx.lineWidth = l.webkitTextStrokeWidth,
                            v.ctx.lineJoin = window.chrome ? "miter" : "round",
                            v.ctx.strokeText(L.text, L.bounds.left, L.bounds.top + d)),
                            v.ctx.strokeStyle = "",
                            v.ctx.lineWidth = 0,
                            v.ctx.lineJoin = "miter";
                            break
                        }
                    })
                }),
                [2]
            })
        })
    }
    ,
    n.prototype.renderReplacedElement = function(i, l, u) {
        if (u && i.intrinsicWidth > 0 && i.intrinsicHeight > 0) {
            var c = is(i)
              , f = ls(l);
            this.path(f),
            this.ctx.save(),
            this.ctx.clip(),
            this.ctx.drawImage(u, 0, 0, i.intrinsicWidth, i.intrinsicHeight, c.left, c.top, c.width, c.height),
            this.ctx.restore()
        }
    }
    ,
    n.prototype.renderNodeContent = function(i) {
        return Ue(this, void 0, void 0, function() {
            var l, u, c, f, h, B, I, I, d, Q, C, v, z, D, L, X, x, _, O, I, R, z, X;
            return de(this, function(V) {
                switch (V.label) {
                case 0:
                    this.applyEffects(i.getEffects(4)),
                    l = i.container,
                    u = i.curves,
                    c = l.styles,
                    f = 0,
                    h = l.textNodes,
                    V.label = 1;
                case 1:
                    return f < h.length ? (B = h[f],
                    [4, this.renderTextNode(B, c)]) : [3, 4];
                case 2:
                    V.sent(),
                    V.label = 3;
                case 3:
                    return f++,
                    [3, 1];
                case 4:
                    if (!(l instanceof oQ))
                        return [3, 8];
                    V.label = 5;
                case 5:
                    return V.trys.push([5, 7, , 8]),
                    [4, this.context.cache.match(l.src)];
                case 6:
                    return I = V.sent(),
                    this.renderReplacedElement(l, u, I),
                    [3, 8];
                case 7:
                    return V.sent(),
                    this.context.logger.error("Error loading image " + l.src),
                    [3, 8];
                case 8:
                    if (l instanceof cQ && this.renderReplacedElement(l, u, l.canvas),
                    !(l instanceof fQ))
                        return [3, 12];
                    V.label = 9;
                case 9:
                    return V.trys.push([9, 11, , 12]),
                    [4, this.context.cache.match(l.svg)];
                case 10:
                    return I = V.sent(),
                    this.renderReplacedElement(l, u, I),
                    [3, 12];
                case 11:
                    return V.sent(),
                    this.context.logger.error("Error loading svg " + l.svg.substring(0, 255)),
                    [3, 12];
                case 12:
                    return l instanceof hQ && l.tree ? (d = new n(this.context,{
                        scale: this.options.scale,
                        backgroundColor: l.backgroundColor,
                        x: 0,
                        y: 0,
                        width: l.width,
                        height: l.height
                    }),
                    [4, d.render(l.tree)]) : [3, 14];
                case 13:
                    Q = V.sent(),
                    l.width && l.height && this.ctx.drawImage(Q, 0, 0, l.width, l.height, l.bounds.left, l.bounds.top, l.bounds.width, l.bounds.height),
                    V.label = 14;
                case 14:
                    if (l instanceof $c && (C = Math.min(l.bounds.width, l.bounds.height),
                    l.type === es ? l.checked && (this.ctx.save(),
                    this.path([new P(l.bounds.left + C * .39363,l.bounds.top + C * .79), new P(l.bounds.left + C * .16,l.bounds.top + C * .5549), new P(l.bounds.left + C * .27347,l.bounds.top + C * .44071), new P(l.bounds.left + C * .39694,l.bounds.top + C * .5649), new P(l.bounds.left + C * .72983,l.bounds.top + C * .23), new P(l.bounds.left + C * .84,l.bounds.top + C * .34085), new P(l.bounds.left + C * .39363,l.bounds.top + C * .79)]),
                    this.ctx.fillStyle = re(Ph),
                    this.ctx.fill(),
                    this.ctx.restore()) : l.type === ts && l.checked && (this.ctx.save(),
                    this.ctx.beginPath(),
                    this.ctx.arc(l.bounds.left + C / 2, l.bounds.top + C / 2, C / 4, 0, Math.PI * 2, !0),
                    this.ctx.fillStyle = re(Ph),
                    this.ctx.fill(),
                    this.ctx.restore())),
                    SE(l) && l.value.length) {
                        switch (v = this.createFontStyle(c),
                        z = v[0],
                        D = v[1],
                        L = this.fontMetrics.getMetrics(z, D).baseline,
                        this.ctx.font = z,
                        this.ctx.fillStyle = re(c.color),
                        this.ctx.textBaseline = "alphabetic",
                        this.ctx.textAlign = DE(l.styles.textAlign),
                        X = is(l),
                        x = 0,
                        l.styles.textAlign) {
                        case 1:
                            x += X.width / 2;
                            break;
                        case 2:
                            x += X.width;
                            break
                        }
                        _ = X.add(x, 0, 0, -X.height / 2 + 1),
                        this.ctx.save(),
                        this.path([new P(X.left,X.top), new P(X.left + X.width,X.top), new P(X.left + X.width,X.top + X.height), new P(X.left,X.top + X.height)]),
                        this.ctx.clip(),
                        this.renderTextWithLetterSpacing(new qr(l.value,_), c.letterSpacing, L),
                        this.ctx.restore(),
                        this.ctx.textBaseline = "alphabetic",
                        this.ctx.textAlign = "left"
                    }
                    if (!Ae(l.styles.display, 2048))
                        return [3, 20];
                    if (l.styles.listStyleImage === null)
                        return [3, 19];
                    if (O = l.styles.listStyleImage,
                    O.type !== 0)
                        return [3, 18];
                    I = void 0,
                    R = O.url,
                    V.label = 15;
                case 15:
                    return V.trys.push([15, 17, , 18]),
                    [4, this.context.cache.match(R)];
                case 16:
                    return I = V.sent(),
                    this.ctx.drawImage(I, l.bounds.left - (I.width + 10), l.bounds.top),
                    [3, 18];
                case 17:
                    return V.sent(),
                    this.context.logger.error("Error loading list-style-image " + R),
                    [3, 18];
                case 18:
                    return [3, 20];
                case 19:
                    i.listValue && l.styles.listStyleType !== -1 && (z = this.createFontStyle(c)[0],
                    this.ctx.font = z,
                    this.ctx.fillStyle = re(c.color),
                    this.ctx.textBaseline = "middle",
                    this.ctx.textAlign = "right",
                    X = new Dt(l.bounds.left,l.bounds.top + _A(l.styles.paddingTop, l.bounds.width),l.bounds.width,Kh(c.lineHeight, c.fontSize.number) / 2 + 1),
                    this.renderTextWithLetterSpacing(new qr(i.listValue,X), c.letterSpacing, Kh(c.lineHeight, c.fontSize.number) / 2 + 2),
                    this.ctx.textBaseline = "bottom",
                    this.ctx.textAlign = "left"),
                    V.label = 20;
                case 20:
                    return [2]
                }
            })
        })
    }
    ,
    n.prototype.renderStackContent = function(i) {
        return Ue(this, void 0, void 0, function() {
            var l, u, O, c, f, O, h, B, O, d, Q, O, C, v, O, D, L, O, x, _, O;
            return de(this, function(I) {
                switch (I.label) {
                case 0:
                    if (Ae(i.element.container.flags, 16))
                        debugger ;return [4, this.renderNodeBackgroundAndBorders(i.element)];
                case 1:
                    I.sent(),
                    l = 0,
                    u = i.negativeZIndex,
                    I.label = 2;
                case 2:
                    return l < u.length ? (O = u[l],
                    [4, this.renderStack(O)]) : [3, 5];
                case 3:
                    I.sent(),
                    I.label = 4;
                case 4:
                    return l++,
                    [3, 2];
                case 5:
                    return [4, this.renderNodeContent(i.element)];
                case 6:
                    I.sent(),
                    c = 0,
                    f = i.nonInlineLevel,
                    I.label = 7;
                case 7:
                    return c < f.length ? (O = f[c],
                    [4, this.renderNode(O)]) : [3, 10];
                case 8:
                    I.sent(),
                    I.label = 9;
                case 9:
                    return c++,
                    [3, 7];
                case 10:
                    h = 0,
                    B = i.nonPositionedFloats,
                    I.label = 11;
                case 11:
                    return h < B.length ? (O = B[h],
                    [4, this.renderStack(O)]) : [3, 14];
                case 12:
                    I.sent(),
                    I.label = 13;
                case 13:
                    return h++,
                    [3, 11];
                case 14:
                    d = 0,
                    Q = i.nonPositionedInlineLevel,
                    I.label = 15;
                case 15:
                    return d < Q.length ? (O = Q[d],
                    [4, this.renderStack(O)]) : [3, 18];
                case 16:
                    I.sent(),
                    I.label = 17;
                case 17:
                    return d++,
                    [3, 15];
                case 18:
                    C = 0,
                    v = i.inlineLevel,
                    I.label = 19;
                case 19:
                    return C < v.length ? (O = v[C],
                    [4, this.renderNode(O)]) : [3, 22];
                case 20:
                    I.sent(),
                    I.label = 21;
                case 21:
                    return C++,
                    [3, 19];
                case 22:
                    D = 0,
                    L = i.zeroOrAutoZIndexOrTransformedOrOpacity,
                    I.label = 23;
                case 23:
                    return D < L.length ? (O = L[D],
                    [4, this.renderStack(O)]) : [3, 26];
                case 24:
                    I.sent(),
                    I.label = 25;
                case 25:
                    return D++,
                    [3, 23];
                case 26:
                    x = 0,
                    _ = i.positiveZIndex,
                    I.label = 27;
                case 27:
                    return x < _.length ? (O = _[x],
                    [4, this.renderStack(O)]) : [3, 30];
                case 28:
                    I.sent(),
                    I.label = 29;
                case 29:
                    return x++,
                    [3, 27];
                case 30:
                    return [2]
                }
            })
        })
    }
    ,
    n.prototype.mask = function(i) {
        this.ctx.beginPath(),
        this.ctx.moveTo(0, 0),
        this.ctx.lineTo(this.canvas.width, 0),
        this.ctx.lineTo(this.canvas.width, this.canvas.height),
        this.ctx.lineTo(0, this.canvas.height),
        this.ctx.lineTo(0, 0),
        this.formatPath(i.slice(0).reverse()),
        this.ctx.closePath()
    }
    ,
    n.prototype.path = function(i) {
        this.ctx.beginPath(),
        this.formatPath(i),
        this.ctx.closePath()
    }
    ,
    n.prototype.formatPath = function(i) {
        var l = this;
        i.forEach(function(u, c) {
            var f = ke(u) ? u.start : u;
            c === 0 ? l.ctx.moveTo(f.x, f.y) : l.ctx.lineTo(f.x, f.y),
            ke(u) && l.ctx.bezierCurveTo(u.startControl.x, u.startControl.y, u.endControl.x, u.endControl.y, u.end.x, u.end.y)
        })
    }
    ,
    n.prototype.renderRepeat = function(i, l, u, c) {
        this.path(i),
        this.ctx.fillStyle = l,
        this.ctx.translate(u, c),
        this.ctx.fill(),
        this.ctx.translate(-u, -c)
    }
    ,
    n.prototype.resizeImage = function(i, l, u) {
        var c;
        if (i.width === l && i.height === u)
            return i;
        var f = (c = this.canvas.ownerDocument) !== null && c !== void 0 ? c : document
          , h = f.createElement("canvas");
        h.width = Math.max(1, l),
        h.height = Math.max(1, u);
        var B = h.getContext("2d");
        return B.drawImage(i, 0, 0, i.width, i.height, 0, 0, l, u),
        h
    }
    ,
    n.prototype.renderBackgroundImage = function(i) {
        return Ue(this, void 0, void 0, function() {
            var l, u, c, f, h, B;
            return de(this, function(d) {
                switch (d.label) {
                case 0:
                    l = i.styles.backgroundImage.length - 1,
                    u = function(Q) {
                        var C, v, D, nA, K, j, cA, mA, q, L, nA, K, j, cA, mA, x, _, O, I, R, z, X, V, k, q, W, nA, uA, oA, cA, mA, FA, K, j, AA, BA, p, F, J, Z, tA, fA;
                        return de(this, function(rA) {
                            switch (rA.label) {
                            case 0:
                                if (Q.type !== 0)
                                    return [3, 5];
                                C = void 0,
                                v = Q.url,
                                rA.label = 1;
                            case 1:
                                return rA.trys.push([1, 3, , 4]),
                                [4, c.context.cache.match(v)];
                            case 2:
                                return C = rA.sent(),
                                [3, 4];
                            case 3:
                                return rA.sent(),
                                c.context.logger.error("Error loading background-image " + v),
                                [3, 4];
                            case 4:
                                return C && (D = Bc(i, l, [C.width, C.height, C.width / C.height]),
                                nA = D[0],
                                K = D[1],
                                j = D[2],
                                cA = D[3],
                                mA = D[4],
                                q = c.ctx.createPattern(c.resizeImage(C, cA, mA), "repeat"),
                                c.renderRepeat(nA, q, K, j)),
                                [3, 6];
                            case 5:
                                dp(Q) ? (L = Bc(i, l, [null, null, null]),
                                nA = L[0],
                                K = L[1],
                                j = L[2],
                                cA = L[3],
                                mA = L[4],
                                x = op(Q.angle, cA, mA),
                                _ = x[0],
                                O = x[1],
                                I = x[2],
                                R = x[3],
                                z = x[4],
                                X = document.createElement("canvas"),
                                X.width = cA,
                                X.height = mA,
                                V = X.getContext("2d"),
                                k = V.createLinearGradient(O, R, I, z),
                                Lh(Q.stops, _).forEach(function(WA) {
                                    return k.addColorStop(WA.stop, re(WA.color))
                                }),
                                V.fillStyle = k,
                                V.fillRect(0, 0, cA, mA),
                                cA > 0 && mA > 0 && (q = c.ctx.createPattern(X, "repeat"),
                                c.renderRepeat(nA, q, K, j))) : hp(Q) && (W = Bc(i, l, [null, null, null]),
                                nA = W[0],
                                uA = W[1],
                                oA = W[2],
                                cA = W[3],
                                mA = W[4],
                                FA = Q.position.length === 0 ? [Zc] : Q.position,
                                K = _A(FA[0], cA),
                                j = _A(FA[FA.length - 1], mA),
                                AA = cp(Q, K, j, cA, mA),
                                BA = AA[0],
                                p = AA[1],
                                BA > 0 && p > 0 && (F = c.ctx.createRadialGradient(uA + K, oA + j, 0, uA + K, oA + j, BA),
                                Lh(Q.stops, BA * 2).forEach(function(WA) {
                                    return F.addColorStop(WA.stop, re(WA.color))
                                }),
                                c.path(nA),
                                c.ctx.fillStyle = F,
                                BA !== p ? (J = i.bounds.left + .5 * i.bounds.width,
                                Z = i.bounds.top + .5 * i.bounds.height,
                                tA = p / BA,
                                fA = 1 / tA,
                                c.ctx.save(),
                                c.ctx.translate(J, Z),
                                c.ctx.transform(1, 0, 0, tA, 0, 0),
                                c.ctx.translate(-J, -Z),
                                c.ctx.fillRect(uA, fA * (oA - Z) + Z, cA, mA * fA),
                                c.ctx.restore()) : c.ctx.fill())),
                                rA.label = 6;
                            case 6:
                                return l--,
                                [2]
                            }
                        })
                    }
                    ,
                    c = this,
                    f = 0,
                    h = i.styles.backgroundImage.slice(0).reverse(),
                    d.label = 1;
                case 1:
                    return f < h.length ? (B = h[f],
                    [5, u(B)]) : [3, 4];
                case 2:
                    d.sent(),
                    d.label = 3;
                case 3:
                    return f++,
                    [3, 1];
                case 4:
                    return [2]
                }
            })
        })
    }
    ,
    n.prototype.renderSolidBorder = function(i, l, u) {
        return Ue(this, void 0, void 0, function() {
            return de(this, function(c) {
                return this.path(o0(u, l)),
                this.ctx.fillStyle = re(i),
                this.ctx.fill(),
                [2]
            })
        })
    }
    ,
    n.prototype.renderDoubleBorder = function(i, l, u, c) {
        return Ue(this, void 0, void 0, function() {
            var f, h;
            return de(this, function(B) {
                switch (B.label) {
                case 0:
                    return l < 3 ? [4, this.renderSolidBorder(i, u, c)] : [3, 2];
                case 1:
                    return B.sent(),
                    [2];
                case 2:
                    return f = CE(c, u),
                    this.path(f),
                    this.ctx.fillStyle = re(i),
                    this.ctx.fill(),
                    h = UE(c, u),
                    this.path(h),
                    this.ctx.fill(),
                    [2]
                }
            })
        })
    }
    ,
    n.prototype.renderNodeBackgroundAndBorders = function(i) {
        return Ue(this, void 0, void 0, function() {
            var l, u, c, f, h, B, d, Q, C = this;
            return de(this, function(v) {
                switch (v.label) {
                case 0:
                    return this.applyEffects(i.getEffects(2)),
                    l = i.container.styles,
                    u = !ca(l.backgroundColor) || l.backgroundImage.length,
                    c = [{
                        style: l.borderTopStyle,
                        color: l.borderTopColor,
                        width: l.borderTopWidth
                    }, {
                        style: l.borderRightStyle,
                        color: l.borderRightColor,
                        width: l.borderRightWidth
                    }, {
                        style: l.borderBottomStyle,
                        color: l.borderBottomColor,
                        width: l.borderBottomWidth
                    }, {
                        style: l.borderLeftStyle,
                        color: l.borderLeftColor,
                        width: l.borderLeftWidth
                    }],
                    f = TE(Dn(l.backgroundClip, 0), i.curves),
                    u || l.boxShadow.length ? (this.ctx.save(),
                    this.path(f),
                    this.ctx.clip(),
                    ca(l.backgroundColor) || (this.ctx.fillStyle = re(l.backgroundColor),
                    this.ctx.fill()),
                    [4, this.renderBackgroundImage(i.container)]) : [3, 2];
                case 1:
                    v.sent(),
                    this.ctx.restore(),
                    l.boxShadow.slice(0).reverse().forEach(function(D) {
                        C.ctx.save();
                        var L = rs(i.curves)
                          , x = D.inset ? 0 : HE
                          , _ = QE(L, -x + (D.inset ? 1 : -1) * D.spread.number, (D.inset ? 1 : -1) * D.spread.number, D.spread.number * (D.inset ? -2 : 2), D.spread.number * (D.inset ? -2 : 2));
                        D.inset ? (C.path(L),
                        C.ctx.clip(),
                        C.mask(_)) : (C.mask(L),
                        C.ctx.clip(),
                        C.path(_)),
                        C.ctx.shadowOffsetX = D.offsetX.number + x,
                        C.ctx.shadowOffsetY = D.offsetY.number,
                        C.ctx.shadowColor = re(D.color),
                        C.ctx.shadowBlur = D.blur.number,
                        C.ctx.fillStyle = D.inset ? re(D.color) : "rgba(0,0,0,1)",
                        C.ctx.fill(),
                        C.ctx.restore()
                    }),
                    v.label = 2;
                case 2:
                    h = 0,
                    B = 0,
                    d = c,
                    v.label = 3;
                case 3:
                    return B < d.length ? (Q = d[B],
                    Q.style !== 0 && !ca(Q.color) && Q.width > 0 ? Q.style !== 2 ? [3, 5] : [4, this.renderDashedDottedBorder(Q.color, Q.width, h, i.curves, 2)] : [3, 11]) : [3, 13];
                case 4:
                    return v.sent(),
                    [3, 11];
                case 5:
                    return Q.style !== 3 ? [3, 7] : [4, this.renderDashedDottedBorder(Q.color, Q.width, h, i.curves, 3)];
                case 6:
                    return v.sent(),
                    [3, 11];
                case 7:
                    return Q.style !== 4 ? [3, 9] : [4, this.renderDoubleBorder(Q.color, Q.width, h, i.curves)];
                case 8:
                    return v.sent(),
                    [3, 11];
                case 9:
                    return [4, this.renderSolidBorder(Q.color, h, i.curves)];
                case 10:
                    v.sent(),
                    v.label = 11;
                case 11:
                    h++,
                    v.label = 12;
                case 12:
                    return B++,
                    [3, 3];
                case 13:
                    return [2]
                }
            })
        })
    }
    ,
    n.prototype.renderDashedDottedBorder = function(i, l, u, c, f) {
        return Ue(this, void 0, void 0, function() {
            var h, B, d, Q, C, v, D, L, x, _, O, I, R, z, X, V, X, V;
            return de(this, function(k) {
                return this.ctx.save(),
                h = vE(c, u),
                B = o0(c, u),
                f === 2 && (this.path(B),
                this.ctx.clip()),
                ke(B[0]) ? (d = B[0].start.x,
                Q = B[0].start.y) : (d = B[0].x,
                Q = B[0].y),
                ke(B[1]) ? (C = B[1].end.x,
                v = B[1].end.y) : (C = B[1].x,
                v = B[1].y),
                u === 0 || u === 2 ? D = Math.abs(d - C) : D = Math.abs(Q - v),
                this.ctx.beginPath(),
                f === 3 ? this.formatPath(h) : this.formatPath(B.slice(0, 2)),
                L = l < 3 ? l * 3 : l * 2,
                x = l < 3 ? l * 2 : l,
                f === 3 && (L = l,
                x = l),
                _ = !0,
                D <= L * 2 ? _ = !1 : D <= L * 2 + x ? (O = D / (2 * L + x),
                L *= O,
                x *= O) : (I = Math.floor((D + x) / (L + x)),
                R = (D - I * L) / (I - 1),
                z = (D - (I + 1) * L) / I,
                x = z <= 0 || Math.abs(x - R) < Math.abs(x - z) ? R : z),
                _ && (f === 3 ? this.ctx.setLineDash([0, L + x]) : this.ctx.setLineDash([L, x])),
                f === 3 ? (this.ctx.lineCap = "round",
                this.ctx.lineWidth = l) : this.ctx.lineWidth = l * 2 + 1.1,
                this.ctx.strokeStyle = re(i),
                this.ctx.stroke(),
                this.ctx.setLineDash([]),
                f === 2 && (ke(B[0]) && (X = B[3],
                V = B[0],
                this.ctx.beginPath(),
                this.formatPath([new P(X.end.x,X.end.y), new P(V.start.x,V.start.y)]),
                this.ctx.stroke()),
                ke(B[1]) && (X = B[1],
                V = B[2],
                this.ctx.beginPath(),
                this.formatPath([new P(X.end.x,X.end.y), new P(V.start.x,V.start.y)]),
                this.ctx.stroke())),
                this.ctx.restore(),
                [2]
            })
        })
    }
    ,
    n.prototype.render = function(i) {
        return Ue(this, void 0, void 0, function() {
            var l;
            return de(this, function(u) {
                switch (u.label) {
                case 0:
                    return this.options.backgroundColor && (this.ctx.fillStyle = re(this.options.backgroundColor),
                    this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)),
                    l = wE(i),
                    [4, this.renderStack(l)];
                case 1:
                    return u.sent(),
                    this.applyEffects([]),
                    [2, this.canvas]
                }
            })
        })
    }
    ,
    n
}(DQ)
  , SE = function(a) {
    return a instanceof dQ || a instanceof gQ ? !0 : a instanceof $c && a.type !== ts && a.type !== es
}
  , TE = function(a, n) {
    switch (a) {
    case 0:
        return rs(n);
    case 2:
        return fE(n);
    case 1:
    default:
        return ls(n)
    }
}
  , DE = function(a) {
    switch (a) {
    case 1:
        return "center";
    case 2:
        return "right";
    case 0:
    default:
        return "left"
    }
}
  , LE = ["-apple-system", "system-ui"]
  , IE = function(a) {
    return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? a.filter(function(n) {
        return LE.indexOf(n) === -1
    }) : a
}
  , KE = function(a) {
    tt(n, a);
    function n(i, l) {
        var u = a.call(this, i, l) || this;
        return u.canvas = l.canvas ? l.canvas : document.createElement("canvas"),
        u.ctx = u.canvas.getContext("2d"),
        u.options = l,
        u.canvas.width = Math.floor(l.width * l.scale),
        u.canvas.height = Math.floor(l.height * l.scale),
        u.canvas.style.width = l.width + "px",
        u.canvas.style.height = l.height + "px",
        u.ctx.scale(u.options.scale, u.options.scale),
        u.ctx.translate(-l.x, -l.y),
        u.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + l.width + "x" + l.height + " at " + l.x + "," + l.y + ") with scale " + l.scale),
        u
    }
    return n.prototype.render = function(i) {
        return Ue(this, void 0, void 0, function() {
            var l, u;
            return de(this, function(c) {
                switch (c.label) {
                case 0:
                    return l = Mc(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, i),
                    [4, _E(l)];
                case 1:
                    return u = c.sent(),
                    this.options.backgroundColor && (this.ctx.fillStyle = re(this.options.backgroundColor),
                    this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)),
                    this.ctx.drawImage(u, -this.options.x * this.options.scale, -this.options.y * this.options.scale),
                    [2, this.canvas]
                }
            })
        })
    }
    ,
    n
}(DQ)
  , _E = function(a) {
    return new Promise(function(n, i) {
        var l = new Image;
        l.onload = function() {
            n(l)
        }
        ,
        l.onerror = i,
        l.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(a))
    }
    )
}
  , OE = function() {
    function a(n) {
        var i = n.id
          , l = n.enabled;
        this.id = i,
        this.enabled = l,
        this.start = Date.now()
    }
    return a.prototype.debug = function() {
        for (var n = [], i = 0; i < arguments.length; i++)
            n[i] = arguments[i];
        this.enabled && (typeof window < "u" && window.console && typeof console.debug == "function" ? console.debug.apply(console, mi([this.id, this.getTime() + "ms"], n)) : this.info.apply(this, n))
    }
    ,
    a.prototype.getTime = function() {
        return Date.now() - this.start
    }
    ,
    a.prototype.info = function() {
        for (var n = [], i = 0; i < arguments.length; i++)
            n[i] = arguments[i];
        this.enabled && typeof window < "u" && window.console && typeof console.info == "function" && console.info.apply(console, mi([this.id, this.getTime() + "ms"], n))
    }
    ,
    a.prototype.warn = function() {
        for (var n = [], i = 0; i < arguments.length; i++)
            n[i] = arguments[i];
        this.enabled && (typeof window < "u" && window.console && typeof console.warn == "function" ? console.warn.apply(console, mi([this.id, this.getTime() + "ms"], n)) : this.info.apply(this, n))
    }
    ,
    a.prototype.error = function() {
        for (var n = [], i = 0; i < arguments.length; i++)
            n[i] = arguments[i];
        this.enabled && (typeof window < "u" && window.console && typeof console.error == "function" ? console.error.apply(console, mi([this.id, this.getTime() + "ms"], n)) : this.info.apply(this, n))
    }
    ,
    a.instances = {},
    a
}()
  , ME = function() {
    function a(n, i) {
        var l;
        this.windowBounds = i,
        this.instanceName = "#" + a.instanceCount++,
        this.logger = new OE({
            id: this.instanceName,
            enabled: n.logging
        }),
        this.cache = (l = n.cache) !== null && l !== void 0 ? l : new nE(this,n)
    }
    return a.instanceCount = 1,
    a
}()
  , NE = function(a, n) {
    return n === void 0 && (n = {}),
    RE(a, n)
};
typeof window < "u" && EQ.setContext(window);
var RE = function(a, n) {
    return Ue(void 0, void 0, void 0, function() {
        var i, l, u, c, f, h, B, d, Q, C, v, D, L, x, _, O, I, R, z, X, k, V, k, q, W, nA, uA, oA, cA, mA, FA, K, j, AA, BA, p, F, J, Z, tA;
        return de(this, function(fA) {
            switch (fA.label) {
            case 0:
                if (!a || typeof a != "object")
                    return [2, Promise.reject("Invalid element provided as first argument")];
                if (i = a.ownerDocument,
                !i)
                    throw new Error("Element is not attached to a Document");
                if (l = i.defaultView,
                !l)
                    throw new Error("Document is not attached to a Window");
                return u = {
                    allowTaint: (q = n.allowTaint) !== null && q !== void 0 ? q : !1,
                    imageTimeout: (W = n.imageTimeout) !== null && W !== void 0 ? W : 15e3,
                    proxy: n.proxy,
                    useCORS: (nA = n.useCORS) !== null && nA !== void 0 ? nA : !1
                },
                c = pc({
                    logging: (uA = n.logging) !== null && uA !== void 0 ? uA : !0,
                    cache: n.cache
                }, u),
                f = {
                    windowWidth: (oA = n.windowWidth) !== null && oA !== void 0 ? oA : l.innerWidth,
                    windowHeight: (cA = n.windowHeight) !== null && cA !== void 0 ? cA : l.innerHeight,
                    scrollX: (mA = n.scrollX) !== null && mA !== void 0 ? mA : l.pageXOffset,
                    scrollY: (FA = n.scrollY) !== null && FA !== void 0 ? FA : l.pageYOffset
                },
                h = new Dt(f.scrollX,f.scrollY,f.windowWidth,f.windowHeight),
                B = new ME(c,h),
                d = (K = n.foreignObjectRendering) !== null && K !== void 0 ? K : !1,
                Q = {
                    allowTaint: (j = n.allowTaint) !== null && j !== void 0 ? j : !1,
                    onclone: n.onclone,
                    ignoreElements: n.ignoreElements,
                    inlineImages: d,
                    copyStyles: d
                },
                B.logger.debug("Starting document clone with size " + h.width + "x" + h.height + " scrolled to " + -h.left + "," + -h.top),
                C = new i0(B,a,Q),
                v = C.clonedReferenceElement,
                v ? [4, C.toIFrame(i, h)] : [2, Promise.reject("Unable to find element in cloned iframe")];
            case 1:
                return D = fA.sent(),
                L = Af(v) || GF(v) ? Qv(v.ownerDocument) : Bs(B, v),
                x = L.width,
                _ = L.height,
                O = L.left,
                I = L.top,
                R = GE(B, v, n.backgroundColor),
                z = {
                    canvas: n.canvas,
                    backgroundColor: R,
                    scale: (BA = (AA = n.scale) !== null && AA !== void 0 ? AA : l.devicePixelRatio) !== null && BA !== void 0 ? BA : 1,
                    x: ((p = n.x) !== null && p !== void 0 ? p : 0) + O,
                    y: ((F = n.y) !== null && F !== void 0 ? F : 0) + I,
                    width: (J = n.width) !== null && J !== void 0 ? J : Math.ceil(x),
                    height: (Z = n.height) !== null && Z !== void 0 ? Z : Math.ceil(_)
                },
                d ? (B.logger.debug("Document cloned, using foreign object rendering"),
                k = new KE(B,z),
                [4, k.render(v)]) : [3, 3];
            case 2:
                return X = fA.sent(),
                [3, 5];
            case 3:
                return B.logger.debug("Document cloned, element located at " + O + "," + I + " with size " + x + "x" + _ + " using computed rendering"),
                B.logger.debug("Starting DOM parsing"),
                V = wQ(B, v),
                R === V.styles.backgroundColor && (V.styles.backgroundColor = St.TRANSPARENT),
                B.logger.debug("Starting renderer for element at " + z.x + "," + z.y + " with size " + z.width + "x" + z.height),
                k = new xE(B,z),
                [4, k.render(V)];
            case 4:
                X = fA.sent(),
                fA.label = 5;
            case 5:
                return (!((tA = n.removeContainer) !== null && tA !== void 0) || tA) && (i0.destroy(D) || B.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")),
                B.logger.debug("Finished rendering"),
                [2, X]
            }
        })
    })
}, GE = function(a, n, i) {
    var l = n.ownerDocument
      , u = l.documentElement ? kr(a, getComputedStyle(l.documentElement).backgroundColor) : St.TRANSPARENT
      , c = l.body ? kr(a, getComputedStyle(l.body).backgroundColor) : St.TRANSPARENT
      , f = typeof i == "string" ? kr(a, i) : i === null ? St.TRANSPARENT : 4294967295;
    return n === l.documentElement ? ca(u) ? ca(c) ? f : c : u : f
}, Wi = {
    exports: {}
}, VE = Wi.exports, f0;
function XE() {
    return f0 || (f0 = 1,
    function(a, n) {
        (function(i, l) {
            l()
        }
        )(VE, function() {
            function i(d, Q) {
                return typeof Q > "u" ? Q = {
                    autoBom: !1
                } : typeof Q != "object" && (console.warn("Deprecated: Expected third argument to be a object"),
                Q = {
                    autoBom: !Q
                }),
                Q.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(d.type) ? new Blob(["\uFEFF", d],{
                    type: d.type
                }) : d
            }
            function l(d, Q, C) {
                var v = new XMLHttpRequest;
                v.open("GET", d),
                v.responseType = "blob",
                v.onload = function() {
                    B(v.response, Q, C)
                }
                ,
                v.onerror = function() {
                    console.error("could not download file")
                }
                ,
                v.send()
            }
            function u(d) {
                var Q = new XMLHttpRequest;
                Q.open("HEAD", d, !1);
                try {
                    Q.send()
                } catch {}
                return 200 <= Q.status && 299 >= Q.status
            }
            function c(d) {
                try {
                    d.dispatchEvent(new MouseEvent("click"))
                } catch {
                    var Q = document.createEvent("MouseEvents");
                    Q.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null),
                    d.dispatchEvent(Q)
                }
            }
            var f = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof yi == "object" && yi.global === yi ? yi : void 0
              , h = f.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent)
              , B = f.saveAs || (typeof window != "object" || window !== f ? function() {}
            : "download"in HTMLAnchorElement.prototype && !h ? function(d, Q, C) {
                var v = f.URL || f.webkitURL
                  , D = document.createElement("a");
                Q = Q || d.name || "download",
                D.download = Q,
                D.rel = "noopener",
                typeof d == "string" ? (D.href = d,
                D.origin === location.origin ? c(D) : u(D.href) ? l(d, Q, C) : c(D, D.target = "_blank")) : (D.href = v.createObjectURL(d),
                setTimeout(function() {
                    v.revokeObjectURL(D.href)
                }, 4e4),
                setTimeout(function() {
                    c(D)
                }, 0))
            }
            : "msSaveOrOpenBlob"in navigator ? function(d, Q, C) {
                if (Q = Q || d.name || "download",
                typeof d != "string")
                    navigator.msSaveOrOpenBlob(i(d, C), Q);
                else if (u(d))
                    l(d, Q, C);
                else {
                    var v = document.createElement("a");
                    v.href = d,
                    v.target = "_blank",
                    setTimeout(function() {
                        c(v)
                    })
                }
            }
            : function(d, Q, C, v) {
                if (v = v || open("", "_blank"),
                v && (v.document.title = v.document.body.innerText = "downloading..."),
                typeof d == "string")
                    return l(d, Q, C);
                var D = d.type === "application/octet-stream"
                  , L = /constructor/i.test(f.HTMLElement) || f.safari
                  , x = /CriOS\/[\d]+/.test(navigator.userAgent);
                if ((x || D && L || h) && typeof FileReader < "u") {
                    var _ = new FileReader;
                    _.onloadend = function() {
                        var R = _.result;
                        R = x ? R : R.replace(/^data:[^;]*;/, "data:attachment/file;"),
                        v ? v.location.href = R : location = R,
                        v = null
                    }
                    ,
                    _.readAsDataURL(d)
                } else {
                    var O = f.URL || f.webkitURL
                      , I = O.createObjectURL(d);
                    v ? v.location = I : location.href = I,
                    v = null,
                    setTimeout(function() {
                        O.revokeObjectURL(I)
                    }, 4e4)
                }
            }
            );
            f.saveAs = B.saveAs = B,
            a.exports = B
        })
    }(Wi)),
    Wi.exports
}
var YE = XE();
function zE({children: a, onClick: n, className: i="", type: l="submit"}) {
    return U.jsx("button", {
        type: l,
        onClick: n,
        className: `
            bg-white text-black border border-yellow-500
            hover:border-primary hover:text-primary hover:bg-yellow-50
            focus:outline-none focus:border-primary
            transition px-3 py-1 rounded-md text-sm ${i}`,
        children: a
    })
}
function zc({children: a, onClick: n, className: i="", type: l="submit"}) {
    return U.jsx("button", {
        type: l,
        onClick: n,
        className: `
            bg-gray-800 text-white border-2 border-gray-900
            hover:border-gray-900 hover:text-black hover:bg-gray-100
            focus:outline-none focus:border-primary
            transition px-3 py-1 rounded-md text-sm ${i}`,
        children: a
    })
}
function jE({isOpen: a, onClose: n, children: i}) {
    return a ? U.jsx("div", {
        className: "fixed inset-0 z-50 bg-transparent bg-white bg-opacity-40 flex justify-center items-center px-2",
        children: U.jsxs("div", {
            className: "p-4 w-full max-w-2xl relative",
            children: [U.jsx(zc, {
                onClick: n,
                className: "absolute top-5 left-[25px] md:left-[115px]",
                children: "✕"
            }), i]
        })
    }) : null
}
var JE = {
    cm: !0,
    mm: !0,
    in: !0,
    px: !0,
    pt: !0,
    pc: !0,
    em: !0,
    ex: !0,
    ch: !0,
    rem: !0,
    vw: !0,
    vh: !0,
    vmin: !0,
    vmax: !0,
    "%": !0
};
function kE(a) {
    if (typeof a == "number")
        return {
            value: a,
            unit: "px"
        };
    var n, i = (a.match(/^[0-9.]*/) || "").toString();
    i.includes(".") ? n = parseFloat(i) : n = parseInt(i, 10);
    var l = (a.match(/[^0-9]*$/) || "").toString();
    return JE[l] ? {
        value: n,
        unit: l
    } : (console.warn("React Spinners: ".concat(a, " is not a valid css value. Defaulting to ").concat(n, "px.")),
    {
        value: n,
        unit: "px"
    })
}
var Sn = function(a, n, i) {
    var l = "react-spinners-".concat(a, "-").concat(i);
    if (typeof window > "u" || !window.document)
        return l;
    var u = document.createElement("style");
    document.head.appendChild(u);
    var c = u.sheet
      , f = `
    @keyframes `.concat(l, ` {
      `).concat(n, `
    }
  `);
    return c && c.insertRule(f, 0),
    l
}
  , ss = function() {
    return ss = Object.assign || function(a) {
        for (var n, i = 1, l = arguments.length; i < l; i++) {
            n = arguments[i];
            for (var u in n)
                Object.prototype.hasOwnProperty.call(n, u) && (a[u] = n[u])
        }
        return a
    }
    ,
    ss.apply(this, arguments)
}
  , ZE = function(a, n) {
    var i = {};
    for (var l in a)
        Object.prototype.hasOwnProperty.call(a, l) && n.indexOf(l) < 0 && (i[l] = a[l]);
    if (a != null && typeof Object.getOwnPropertySymbols == "function")
        for (var u = 0, l = Object.getOwnPropertySymbols(a); u < l.length; u++)
            n.indexOf(l[u]) < 0 && Object.prototype.propertyIsEnumerable.call(a, l[u]) && (i[l[u]] = a[l[u]]);
    return i
}
  , ge = [1, 3, 5]
  , qE = [Sn("PropagateLoader", "25% {transform: translateX(-".concat(ge[0], `rem) scale(0.75)}
    50% {transform: translateX(-`).concat(ge[1], `rem) scale(0.6)}
    75% {transform: translateX(-`).concat(ge[2], `rem) scale(0.5)}
    95% {transform: translateX(0rem) scale(1)}`), "propogate-0"), Sn("PropagateLoader", "25% {transform: translateX(-".concat(ge[0], `rem) scale(0.75)}
    50% {transform: translateX(-`).concat(ge[1], `rem) scale(0.6)}
    75% {transform: translateX(-`).concat(ge[1], `rem) scale(0.6)}
    95% {transform: translateX(0rem) scale(1)}`), "propogate-1"), Sn("PropagateLoader", "25% {transform: translateX(-".concat(ge[0], `rem) scale(0.75)}
    75% {transform: translateX(-`).concat(ge[0], `rem) scale(0.75)}
    95% {transform: translateX(0rem) scale(1)}`), "propogate-2"), Sn("PropagateLoader", "25% {transform: translateX(".concat(ge[0], `rem) scale(0.75)}
    75% {transform: translateX(`).concat(ge[0], `rem) scale(0.75)}
    95% {transform: translateX(0rem) scale(1)}`), "propogate-3"), Sn("PropagateLoader", "25% {transform: translateX(".concat(ge[0], `rem) scale(0.75)}
    50% {transform: translateX(`).concat(ge[1], `rem) scale(0.6)}
    75% {transform: translateX(`).concat(ge[1], `rem) scale(0.6)}
    95% {transform: translateX(0rem) scale(1)}`), "propogate-4"), Sn("PropagateLoader", "25% {transform: translateX(".concat(ge[0], `rem) scale(0.75)}
    50% {transform: translateX(`).concat(ge[1], `rem) scale(0.6)}
    75% {transform: translateX(`).concat(ge[2], `rem) scale(0.5)}
    95% {transform: translateX(0rem) scale(1)}`), "propogate-5")];
function WE(a) {
    var n = a.loading
      , i = n === void 0 ? !0 : n
      , l = a.color
      , u = l === void 0 ? "#000000" : l
      , c = a.speedMultiplier
      , f = c === void 0 ? 1 : c
      , h = a.cssOverride
      , B = h === void 0 ? {} : h
      , d = a.size
      , Q = d === void 0 ? 15 : d
      , C = ZE(a, ["loading", "color", "speedMultiplier", "cssOverride", "size"])
      , v = kE(Q)
      , D = v.value
      , L = v.unit
      , x = ss({
        display: "inherit",
        position: "relative"
    }, B)
      , _ = function(O) {
        return {
            position: "absolute",
            fontSize: "".concat(D / 3).concat(L),
            width: "".concat(D).concat(L),
            height: "".concat(D).concat(L),
            background: u,
            borderRadius: "50%",
            animation: "".concat(qE[O], " ").concat(1.5 / f, "s infinite"),
            animationFillMode: "forwards"
        }
    };
    return i ? Y.createElement("span", ss({
        style: x
    }, C), Y.createElement("span", {
        style: _(0)
    }), Y.createElement("span", {
        style: _(1)
    }), Y.createElement("span", {
        style: _(2)
    }), Y.createElement("span", {
        style: _(3)
    }), Y.createElement("span", {
        style: _(4)
    }), Y.createElement("span", {
        style: _(5)
    })) : null
}
function PE({text: a="لطفاً منتظر بمانید..."}) {
    return U.jsx("div", {
        className: "fixed inset-0 z-50 w-full flex items-center justify-center bg-black bg-opacity-40",
        children: U.jsxs("div", {
            className: "flex flex-col w-[300px] items-center gap-4 bg-white rounded-xl p-6 shadow-xl",
            children: [U.jsx("div", {
                className: "flex justify-center w-full h-[50px] ml-8",
                children: U.jsx(WE, {
                    color: "#FEBA17",
                    size: 35
                })
            }), U.jsx("p", {
                className: "text-gray-700 text-sm",
                children: a
            })]
        })
    })
}
function $E({isOpen: a, onClose: n, trade: i, symbol: l}) {
    const u = Y.useRef(null)
      , [c,f] = Y.useState(null)
      , [h,B] = Y.useState(!0);
    Y.useEffect( () => {
        a ? (B(!0),
        setTimeout(async () => {
            const C = (await NE(u.current, {
                backgroundColor: null,
                scale: 2
            })).toDataURL("image/png");
            f(C),
            B(!1)
        }
        , 300)) : (f(null),
        B(!0))
    }
    , [a]);
    const d = () => {
        c && fetch(c).then(Q => Q.blob()).then(Q => {
            YE.saveAs(Q, `${l}-${i.id}.png`)
        }
        )
    }
    ;
    return U.jsxs(jE, {
        isOpen: a,
        onClose: n,
        children: [h ? U.jsx("div", {
            className: "p-6",
            children: U.jsx(PE, {
                text: "در حال آماده سازی..."
            })
        }) : U.jsxs("div", {
            className: "flex flex-col items-center gap-6",
            children: [c && U.jsx("img", {
                src: c,
                alt: "preview",
                className: "w-full max-w-md rounded-lg shadow-lg border"
            }), U.jsx(zE, {
                onClick: d,
                children: "دانلود تصویر"
            })]
        }), U.jsxs("div", {
            ref: u,
            style: {
                position: "absolute",
                left: "-9999px",
                top: 0
            },
            className: "relative font-bold text-white",
            children: [U.jsx("div", {
                className: "absolute inset-0 flex justify-center items-center pointer-events-none",
                style: {
                    fontSize: "150px",
                    color: "rgba(255, 255, 255, 0.1)",
                    fontWeight: "bold",
                    transform: "rotate(-30deg)",
                    zIndex: 10,
                    userSelect: "none"
                },
                children: "دمو هیواگلد"
            }), U.jsx("img", {
                src: `images/transaction_shut/${l}_${i.action}.jpg`,
                alt: "bg",
                className: "w-full h-full object-cover",
                onLoad: () => console.log("Image loaded")
            }), U.jsxs("div", {
                className: `absolute direction_ltr bottom-[575px] right-[120px] text-7xl ${i.pnl > 0 ? "text-green-300" : "text-red-300"}`,
                children: [i.pnl > 0 ? "+" : "", CA(i.pnl)]
            }), U.jsx("div", {
                className: "absolute bottom-[350px] right-[170px] text-5xl",
                children: CA(i.entry)
            }), U.jsx("div", {
                className: "absolute bottom-[180px] right-[170px] text-5xl",
                children: CA(i.exit)
            }), U.jsx("div", {
                className: "absolute bottom-[70px] right-[250px] text-2xl",
                children: "دمو"
            })]
        })]
    })
}
function A1() {
    const [a,n] = Y.useState([])
      , [i,l] = Y.useState([])
      , [u,c] = Y.useState([])
      , [f,h] = Y.useState(!0)
      , B = async () => {
        try {
            const [d,Q] = await Promise.all([we("api/transaction/"), we("api/order/active/")]);
            n(d.open),
            c(d.closed),
            l(Q)
        } catch (d) {
            Qe({
                title: "خطا",
                text: d.message,
                type: "error"
            })
        } finally {
            h(!1)
        }
    }
    ;
    return Y.useEffect( () => {
        B()
    }
    , []),
    {
        positions: a,
        orders: i,
        history: u,
        loading: f,
        fetchData: B
    }
}
function B0({isOpen: a, onClose: n, transaction: i, onSave: l, mode: u="tp"}) {
    const [c,f] = Y.useState("")
      , [h,B] = Y.useState("");
    Y.useEffect( () => {
        i && (f(CA(i.take_profit ?? "")),
        B(CA(i.stop_loss ?? "")))
    }
    , [i]);
    const d = async () => {
        try {
            const Q = {
                take_profit: Number(et(c)),
                stop_loss: Number(et(h))
            };
            await we(`api/transaction/edit/${i.id}/`, "POST", Q),
            Qe({
                title: "موفق",
                text: "ویرایش با موفقیت انجام شد",
                type: "success"
            }),
            l(),
            n()
        } catch (Q) {
            Qe({
                title: "خطا",
                text: Q.message,
                type: "error"
            })
        }
    }
    ;
    return a ? U.jsx("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50",
        children: U.jsxs("div", {
            className: "bg-gray-900 p-6 rounded-xl w-full max-w-sm space-y-4",
            children: [U.jsx("h2", {
                className: "text-white font-bold text-center",
                children: u === "tp" ? "ویرایش حد سود" : "ویرایش حد ضرر"
            }), u === "tp" && U.jsx("input", {
                type: "text",
                placeholder: "حد سود",
                value: c,
                onChange: Q => f(CA(Q.target.value)),
                className: "w-full bg-gray-700 p-2 rounded-xl"
            }), u === "sl" && U.jsx("input", {
                type: "text",
                placeholder: "حد ضرر",
                value: h,
                onChange: Q => B(CA(Q.target.value)),
                className: "w-full bg-gray-700 p-2 rounded-xl text-center"
            }), U.jsxs("div", {
                className: "flex gap-2",
                children: [U.jsx("button", {
                    onClick: d,
                    className: "bg-blue-500 hover:bg-blue-600 w-full py-2 rounded-xl",
                    children: "ثبت"
                }), U.jsx("button", {
                    onClick: n,
                    className: "bg-gray-600 hover:bg-gray-700 w-full py-2 rounded-xl",
                    children: "انصراف"
                })]
            })]
        })
    }) : null
}
function e1({isOpen: a, onClose: n, onConfirm: i, message: l="آیا مطمئن هستید؟", confirmText: u="تأیید", cancelText: c="انصراف", title: f="تأیید عملیات", confirmClass: h="bg-red-600 hover:bg-red-700"}) {
    return a ? U.jsx("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50",
        children: U.jsxs("div", {
            className: "bg-gray-900 p-6 rounded-xl w-full max-w-sm space-y-4",
            children: [U.jsx("h2", {
                className: "text-white font-bold text-center",
                children: f
            }), U.jsx("p", {
                className: "text-gray-300 text-center",
                children: l
            }), U.jsxs("div", {
                className: "flex gap-2",
                children: [U.jsx("button", {
                    onClick: i,
                    className: `${h} w-full py-2 rounded-xl`,
                    children: u
                }), U.jsx("button", {
                    onClick: n,
                    className: "bg-gray-600 hover:bg-gray-700 w-full py-2 rounded-xl",
                    children: c
                })]
            })]
        })
    }) : null
}
function g0({mobile: a=!1, onOrderSuccess: n}) {
    const [i,l] = Y.useState("positions")
      , [u,c] = Y.useState(!1)
      , [f,h] = Y.useState(null)
      , [B,d] = Y.useState(!1)
      , [Q,C] = Y.useState(!1)
      , [v,D] = Y.useState(!1)
      , [L,x] = Y.useState(null)
      , [_,O] = Y.useState(null)
      , [I,R] = Y.useState(null)
      , [z,X] = Y.useState({
        onConfirm: () => {}
        ,
        title: "",
        message: "",
        confirmText: "",
        confirmClass: ""
    })
      , {positions: V, orders: k, history: q, fetchData: W} = A1()
      , {price: nA} = Jc()
      , [uA,oA] = Y.useState(0)
      , cA = ({onConfirm: F, title: J, message: Z, confirmText: tA, confirmClass: fA}) => {
        X({
            onConfirm: F,
            title: J,
            message: Z,
            confirmText: tA,
            confirmClass: fA
        }),
        d(!0)
    }
      , mA = (F, J=!1) => {
        F.entry = F.entry_price,
        F.status != "liquidated" ? F.exit = F.close_price : F.exit = "حراجی",
        J && (F.pnl = jo(F.entry_price, nA, F.units, F.action, uA)),
        F.referral = localStorage.getItem("referral_code"),
        R({
            trade: F,
            symbol: "ounce"
        })
    }
    ;
    Y.useEffect( () => {
        ev().then(oA);
        const F = vc("/ws/ounce/trading/", J => {
            W()
        }
        );
        return () => {
            var J;
            (J = F == null ? void 0 : F.close) == null || J.call(F)
        }
    }
    , []);
    const FA = [{
        id: "positions",
        label: "معاملات باز"
    }, {
        id: "orders",
        label: "سفارش‌های باز"
    }, {
        id: "history",
        label: "تاریخچه"
    }]
      , K = F => {
        cA({
            onConfirm: async () => {
                try {
                    await we(`api/transaction/close/${F}/`, "POST"),
                    Qe({
                        title: "بسته شد",
                        text: "معامله با موفقیت بسته شد",
                        type: "success"
                    }),
                    W()
                } catch (J) {
                    Qe({
                        title: "خطا",
                        text: J.message,
                        type: "error"
                    })
                } finally {
                    d(!1)
                }
            }
            ,
            title: "تأیید بستن معامله",
            message: "آیا مطمئن هستید که می‌خواهید این معامله را ببندید؟",
            confirmText: "بله، ببند",
            confirmClass: "bg-red-600 hover:bg-red-700"
        })
    }
      , j = F => {
        cA({
            onConfirm: async () => {
                try {
                    await we(`api/order/close/${F}/`, "POST"),
                    Qe({
                        title: "لغو شد",
                        text: "سفارش با موفقیت لغو شد",
                        type: "success"
                    }),
                    W()
                } catch (J) {
                    Qe({
                        title: "خطا",
                        text: J.message,
                        type: "error"
                    })
                } finally {
                    d(!1)
                }
            }
            ,
            title: "تأیید لغو سفارش",
            message: "آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟",
            confirmText: "بله، لغو کن",
            confirmClass: "bg-yellow-600 hover:bg-yellow-700"
        })
    }
      , AA = F => {
        x(F),
        C(!0)
    }
      , BA = F => {
        O(F),
        D(!0)
    }
      , p = () => {
        switch (i) {
        case "positions":
            return U.jsx("div", {
                className: "h-full",
                children: U.jsxs("table", {
                    className: "w-full text-sm text-center whitespace-nowrap",
                    children: [U.jsx("thead", {
                        className: "text-gray-400 border-b border-gray-600",
                        children: U.jsxs("tr", {
                            children: [U.jsx("th", {
                                className: "p-2",
                                children: "جهت معامله"
                            }), U.jsx("th", {
                                className: "p-2",
                                children: "قیمت ورود"
                            }), U.jsx("th", {
                                className: "p-2",
                                children: "تعداد واحد"
                            }), U.jsx("th", {
                                className: "p-2",
                                children: "سود و زیان"
                            }), U.jsx("th", {
                                className: "p-2",
                                children: "حد سود"
                            }), U.jsx("th", {
                                className: "p-2",
                                children: "حد ضرر"
                            }), U.jsx("th", {
                                className: "p-2",
                                children: "اقدام"
                            })]
                        })
                    }), U.jsx("tbody", {
                        children: V.map(F => U.jsxs("tr", {
                            className: "border-b border-gray-700 text-sm",
                            children: [U.jsx("td", {
                                className: `p-2  ${zo(F.action)}`,
                                children: F.action_display
                            }), U.jsx("td", {
                                className: "p-2",
                                children: CA(F.entry_price)
                            }), U.jsx("td", {
                                className: "p-2",
                                children: CA(F.units)
                            }), U.jsx("td", {
                                className: `p-2 direction-ltr ${uh(jo(F.entry_price, nA, F.units, F.action, uA))}`,
                                children: U.jsxs("div", {
                                    className: "flex items-center justify-center gap-2",
                                    children: [CA(jo(F.entry_price, nA, F.units, F.action, uA) ?? 0), U.jsx(zc, {
                                        onClick: () => mA(F, !0),
                                        className: "px-1",
                                        children: U.jsx(fh, {
                                            size: 12
                                        })
                                    })]
                                })
                            }), U.jsxs("td", {
                                className: "p-2",
                                children: [U.jsx("span", {
                                    onClick: () => AA(F),
                                    className: "cursor-pointer",
                                    children: F.take_profit ? CA(F.take_profit) : "-"
                                }), U.jsx("span", {
                                    onClick: () => AA(F),
                                    className: "text-blue-400 cursor-pointer m-1",
                                    children: " ✏️ "
                                })]
                            }), U.jsxs("td", {
                                className: "p-2 gap-1",
                                children: [U.jsx("span", {
                                    onClick: () => BA(F),
                                    className: "cursor-pointer",
                                    children: F.stop_loss ? CA(F.stop_loss) : "-"
                                }), U.jsx("span", {
                                    onClick: () => BA(F),
                                    className: "text-blue-400 cursor-pointer m-1",
                                    children: " ✏️ "
                                })]
                            }), U.jsx("td", {
                                className: "p-2 flex gap-2 justify-center",
                                children: U.jsx("button", {
                                    onClick: () => K(F.id),
                                    className: "bg-red-600 px-2 rounded-xl",
                                    children: "بستن"
                                })
                            })]
                        }, F.id))
                    })]
                })
            });
        case "orders":
            return U.jsxs("table", {
                className: "w-full text-sm text-center whitespace-nowrap",
                children: [U.jsx("thead", {
                    className: "text-gray-400 border-b border-gray-600",
                    children: U.jsxs("tr", {
                        children: [U.jsx("th", {
                            className: "p-2",
                            children: "نوع"
                        }), U.jsx("th", {
                            className: "p-2",
                            children: "قیمت"
                        }), U.jsx("th", {
                            className: "p-2",
                            children: "حجم"
                        }), U.jsx("th", {
                            className: "p-2",
                            children: "اقدام"
                        })]
                    })
                }), U.jsx("tbody", {
                    children: k.map(F => U.jsxs("tr", {
                        className: "border-b border-gray-700 text-sm",
                        children: [U.jsx("td", {
                            className: `p-2  ${zo(F.action)}`,
                            children: F.action_display
                        }), U.jsx("td", {
                            className: "p-2",
                            children: CA(F.price)
                        }), U.jsx("td", {
                            className: "p-2",
                            children: CA(F.units)
                        }), U.jsx("td", {
                            className: "p-2",
                            children: U.jsx("button", {
                                onClick: () => j(F.id),
                                className: "bg-red-600 px-2 rounded-xl",
                                children: "لغو"
                            })
                        })]
                    }, F.id))
                })]
            });
        case "history":
            return U.jsxs("table", {
                className: "w-full text-sm text-center whitespace-nowrap",
                children: [U.jsx("thead", {
                    className: "text-gray-400 border-b border-gray-600",
                    children: U.jsxs("tr", {
                        children: [U.jsx("th", {
                            className: "p-2",
                            children: "نوع"
                        }), U.jsx("th", {
                            className: "p-2",
                            children: "قیمت ورود"
                        }), U.jsx("th", {
                            className: "p-2",
                            children: "قیمت خروج"
                        }), U.jsx("th", {
                            className: "p-2",
                            children: "حجم"
                        }), U.jsx("th", {
                            className: "p-2",
                            children: "سود و ضرر"
                        }), U.jsx("th", {
                            className: "p-2",
                            children: "کارمزد"
                        }), U.jsx("th", {
                            className: "p-2",
                            children: "اشتراک"
                        })]
                    })
                }), U.jsx("tbody", {
                    children: q.map(F => U.jsxs("tr", {
                        children: [U.jsx("td", {
                            className: `p-2  ${zo(F.action)}`,
                            children: F.action_display
                        }), U.jsx("td", {
                            className: "p-2",
                            children: CA(F.entry_price)
                        }), U.jsx("td", {
                            className: "p-2",
                            children: F.status === "liquidated" ? F.status_display : CA(F.close_price ?? "-")
                        }), U.jsx("td", {
                            className: "p-2",
                            children: CA(F.units)
                        }), U.jsx("td", {
                            className: `p-2 direction-ltr ${uh(F.pnl)}`,
                            children: CA(F.pnl ?? 0)
                        }), U.jsx("td", {
                            className: "p-2 direction-ltr",
                            children: CA(F.fee ?? 0)
                        }), U.jsx("td", {
                            className: "p-2 flex gap-2 justify-center",
                            children: U.jsx(zc, {
                                onClick: () => mA(F),
                                children: U.jsx(fh, {
                                    size: 16
                                })
                            })
                        })]
                    }, F.id))
                })]
            });
        default:
            return null
        }
    }
    ;
    return U.jsxs("div", {
        className: `bg-gray-800 p-4 border-t border-gray-700 overflow-x-auto no-scrollbar rounded-xl h-1/3 ${a ? "min-h-[420px]" : ""}`,
        children: [U.jsx("div", {
            className: "flex border-b border-gray-700 mb-4",
            children: FA.map(F => U.jsx("div", {
                onClick: () => l(F.id),
                className: `cursor-pointer px-4 py-2 text-sm font-medium transition border-b-2 ${i === F.id ? "text-blue-400 border-blue-400" : "text-gray-400 border-transparent hover:text-white"}`,
                children: F.label
            }, F.id))
        }), p(), U.jsx(B0, {
            isOpen: Q,
            transaction: L,
            onClose: () => C(!1),
            onSave: () => {
                W(),
                C(!1)
            }
            ,
            mode: "tp"
        }), U.jsx(B0, {
            isOpen: v,
            transaction: _,
            onClose: () => D(!1),
            onSave: () => {
                W(),
                D(!1)
            }
            ,
            mode: "sl"
        }), U.jsx(e1, {
            isOpen: B,
            onClose: () => d(!1),
            ...z
        }), I && U.jsx($E, {
            isOpen: !0,
            onClose: () => R(null),
            trade: I.trade,
            symbol: I.symbol
        })]
    })
}
const d0 = ({onSelectPrice: a}) => {
    const {price: n, setPrice: i} = Jc()
      , [l,u] = Y.useState([])
      , [c,f] = Y.useState([]);
    Y.useEffect( () => {
        const B = vc("/ws/ounce/price/", Q => {
            Q != null && Q.price && i(Number(Q.price))
        }
        )
          , d = setInterval( () => {
            B.readyState === WebSocket.OPEN && B.send(JSON.stringify({
                type: "ping"
            }))
        }
        , 3e4);
        return () => {
            clearInterval(d),
            B.close()
        }
    }
    , []),
    Y.useEffect( () => {
        const B = vc("/ws/ounce/wall/", d => {
            d != null && d.buy && u(d.buy),
            d != null && d.sell && f(d.sell)
        }
        );
        return () => {
            B.close()
        }
    }
    , []),
    Y.useEffect( () => (console.log("📦 OrderWall mounted"),
    () => console.log("❌ OrderWall unmounted")), []);
    const h = (B, d) => (B == null ? void 0 : B.length) > 0 ? B.map( (Q, C) => U.jsxs("div", {
        className: `grid grid-cols-2 text-sm h-1/5 ${d} p-1 text-center cursor-pointer`,
        onClick: () => a(Q.price),
        children: [U.jsx("span", {
            children: CA(Q.price ?? "-")
        }), U.jsx("span", {
            children: CA(Q.volume ?? "-")
        })]
    }, C)) : [...Array(5)].map( (Q, C) => U.jsxs("div", {
        className: `grid grid-cols-2 text-sm h-1/5 ${d} p-1 text-center cursor-pointer`,
        onClick: () => a(item.price),
        children: [U.jsx("span", {
            children: "-"
        }), U.jsx("span", {
            children: "-"
        })]
    }, C));
    return U.jsxs("div", {
        className: "flex flex-col items-center w-full overflow-hidden h-full",
        children: [U.jsxs("div", {
            className: "bg-gray-800 rounded-xl p-3 w-full h-1/2 overflow-y-auto",
            children: [U.jsxs("div", {
                className: "h-1/5 grid grid-cols-2 text-sm text-red-400 p-1 text-center font-semibold",
                children: [U.jsx("span", {
                    children: "قیمت"
                }), U.jsx("span", {
                    children: "حجم"
                })]
            }), U.jsx("div", {
                className: "h-4/5",
                children: h(c, "text-red-400")
            })]
        }), U.jsx("div", {
            className: "text-center text-green-400 text-xl font-bold py-2",
            children: U.jsx("span", {
                children: CA(n)
            })
        }), U.jsxs("div", {
            className: "bg-gray-800 rounded-xl p-3 w-full h-1/2 overflow-y-auto",
            children: [U.jsxs("div", {
                className: "h-1/5 grid grid-cols-2 text-sm text-green-400 p-1 text-center font-semibold",
                children: [U.jsx("span", {
                    children: "قیمت"
                }), U.jsx("span", {
                    children: "حجم"
                })]
            }), U.jsx("div", {
                className: "h-4/5",
                children: h(l, "text-green-400")
            })]
        })]
    })
}
  , h0 = () => {
    const [a,n] = Y.useState("form")
      , [i,l] = Y.useState("ایزوله")
      , [u,c] = Y.useState("")
      , [f,h] = Y.useState(null)
      , [B,d] = Y.useState(0)
      , [Q,C] = Y.useState("");
    Y.useEffect( () => {
        (async () => {
            try {
                await pi();
                const _ = await we("api/portfolio/active/");
                h(_),
                n("info")
            } catch (_) {
                console.log("No active portfolio", _.message)
            }
        }
        )(),
        tv().then(d)
    }
    , []);
    const v = async () => {
        try {
            const x = i === "ایزوله" ? "isolated" : "cross";
            await pi();
            const _ = await we("/api/portfolio/create/", "POST", {
                portfolio_type: x,
                initial_balance: Number(et(u))
            });
            Qe({
                title: "ساخته شد",
                text: "پرتفو با موفقیت ساخته شد",
                type: "success"
            }),
            h(_),
            n("info")
        } catch (x) {
            Qe({
                title: "خطا",
                text: x.message,
                type: "error"
            })
        }
    }
      , D = async () => {
        try {
            await pi(),
            await we("api/portfolio/increase/", "POST", {
                amount: Number(et(Q))
            }),
            Qe({
                title: "افزایش یافت",
                text: "حجم پرتفو افزایش یافت",
                type: "success"
            });
            const x = await we("api/portfolio/active/");
            h(x),
            n("info")
        } catch (x) {
            Qe({
                title: "خطا",
                text: x.message,
                type: "error"
            })
        }
    }
      , L = async () => {
        try {
            await pi(),
            await we(`api/portfolio/close/${f.id}/`, "POST", null),
            Qe({
                title: "لغو شد",
                text: "پرتفو با موفقیت لغو شد",
                type: "success"
            }),
            n("form"),
            h(null)
        } catch (x) {
            Qe({
                title: "خطا",
                text: x.message,
                type: "error"
            })
        }
    }
    ;
    return a === "info" && f ? U.jsxs("div", {
        className: "bg-gray-800 rounded-xl p-4 flex flex-col gap-3 w-full max-w-sm mx-auto mt-4",
        children: [U.jsx("div", {
            className: "text-center font-semibold",
            children: "پرتفو ساخته شد"
        }), U.jsxs("div", {
            children: ["نوع پرتفو: ", i]
        }), U.jsxs("div", {
            children: ["موجودی لحظه‌ای: ", CA(f.total_balance), " تومان"]
        }), U.jsxs("div", {
            children: ["سود و ضرر: ", CA(f.total_balance - f.initial_balance), " تومان"]
        }), U.jsxs("div", {
            children: ["تعداد واحدهای مجاز: ", CA(f.available_units || 0)]
        }), U.jsxs("div", {
            className: "flex gap-2",
            children: [U.jsx("button", {
                className: "bg-gray-700 px-4 py-2 rounded-xl",
                onClick: () => n("info"),
                children: "اطلاعات"
            }), U.jsx("button", {
                className: "bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl",
                onClick: () => n("edit"),
                children: "تغییرات"
            })]
        })]
    }) : a === "edit" && f ? U.jsxs("div", {
        className: "bg-gray-800 rounded-xl p-4 flex flex-col gap-3 w-full max-w-sm mx-auto mt-4",
        children: [U.jsx("div", {
            className: "text-center font-semibold",
            children: "تغییرات پرتفو"
        }), U.jsx("input", {
            type: "text",
            value: Q,
            onChange: x => C(sh(x.target.value)),
            placeholder: "مبلغ مورد افزایش",
            className: "bg-gray-700 p-2 rounded-xl w-full"
        }), U.jsxs("div", {
            className: "flex gap-2",
            children: [U.jsx("button", {
                onClick: D,
                className: "bg-green-500 hover:bg-green-600 py-2 rounded-xl w-full",
                children: "افزایش حجم"
            }), U.jsx("button", {
                onClick: L,
                className: "bg-red-600 hover:bg-red-700 py-2 rounded-xl w-full",
                children: "ابطال پرتفو"
            })]
        }), U.jsx("button", {
            onClick: () => n("info"),
            className: "text-sm text-gray-400 underline mt-2",
            children: "بازگشت"
        })]
    }) : U.jsxs("div", {
        className: "bg-gray-800 rounded-xl p-4 flex flex-col gap-3 w-full max-w-sm mx-auto mt-4",
        children: [U.jsx("div", {
            className: "text-center font-semibold",
            children: "مدیریت پرتفو"
        }), U.jsxs("select", {
            value: i,
            onChange: x => l(x.target.value),
            className: "bg-gray-700 p-2 rounded-xl w-full",
            children: [U.jsx("option", {
                children: "ایزوله"
            }), U.jsx("option", {
                children: "کراس"
            })]
        }), U.jsx("input", {
            type: "text",
            placeholder: "حجم پرتفو (تومان)",
            value: u,
            onChange: x => c(sh(x.target.value)),
            className: "bg-gray-700 p-2 rounded-xl w-full"
        }), U.jsxs("div", {
            className: "text-sm",
            children: ["تعداد واحدهای مجاز :", U.jsx("span", {
                className: "text-green-400 font-semibold ml-2",
                children: u && B ? CA(Math.floor(Number(et(u)) / B)) : "-"
            })]
        }), U.jsx("button", {
            className: "bg-blue-500 hover:bg-blue-600 py-2 rounded-xl",
            onClick: v,
            children: "ساخت پرتفو"
        })]
    })
}
;
function t1() {
    const [a,n] = Y.useState(!1)
      , [i,l] = Y.useState("۰")
      , [u,c] = Y.useState(0)
      , f = [{
        label: "داشبورد",
        href: "https://demo.hivagold.com/dashboard"
    }, {
        label: "برگشت به سایت اصلی",
        href: "https://hivagold.com/dashboard"
    }];
    return Y.useEffect( () => {
        we("api/user-info/").then(h => {
            l(Number(h.balance).toLocaleString("fa-IR")),
            c(h.unread_notifications_count)
        }
        ).catch(h => console.error("❌ دریافت اطلاعات کاربر:", h.message))
    }
    , []),
    U.jsxs("header", {
        className: "bg-gray-900 h-[60px] text-white px-4 py-3 flex items-center justify-between shadow-md border-b border-gray-800 rtl text-sm relative z-50",
        children: [U.jsxs("div", {
            className: "flex justify-between w-full",
            children: [U.jsxs("div", {
                className: "flex items-center gap-4 w-[12%]",
                children: [U.jsx("button", {
                    className: "md:hidden",
                    onClick: () => n(!a),
                    children: a ? U.jsx(hv, {
                        className: "w-5 h-5"
                    }) : U.jsx(Bv, {
                        className: "w-5 h-5"
                    })
                }), U.jsx("nav", {
                    className: "hidden md:flex items-center gap-6",
                    children: f.map(h => U.jsx("a", {
                        href: h.href,
                        className: "text-base font-bold no-underline hover:text-yellow-300 transition",
                        children: h.label
                    }, h.href))
                })]
            }), U.jsx("div", {
                className: "flex justify-center w-[52%]",
                children: U.jsx("a", {
                    href: "https://demo.hivagold.com",
                    className: "md:static md:transform-none w-[180px] h-[108px] z-10",
                    children: U.jsx("img", {
                        src: "logo_white_english.png",
                        alt: "hivagold",
                        className: "w-full h-full object-contain"
                    })
                })
            }), U.jsxs("div", {
                className: "flex items-center gap-4 w-[12%]",
                children: [U.jsxs("a", {
                    href: "https://demo.hivagold.com/notifications/",
                    className: "relative cursor-pointer",
                    children: [U.jsx(cv, {
                        className: `w-5 h-5 transition ${u > 0 ? "text-yellow-300 animate-bounce" : "text-gray-300 hover:text-yellow-300"}`
                    }), u > 0 && U.jsx("span", {
                        className: "absolute -top-2 -right-2 bg-yellow-400 pt-1 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm leading-none",
                        children: u > 99 ? "۹۹+" : CA(u)
                    })]
                }), U.jsxs("div", {
                    className: "hidden md:block font-semibold text-gray-200 text-sm",
                    children: ["موجودی: ", U.jsx("span", {
                        className: "text-green-400",
                        children: i
                    }), " تومان"]
                })]
            })]
        }), a && U.jsxs("div", {
            className: "absolute top-full right-0 w-full bg-gray-800 border-t border-gray-700 py-4 px-6 flex flex-col gap-4 md:hidden animate-fade-in-down",
            children: [f.map(h => U.jsx("a", {
                href: h.href,
                className: "text-base font-bold no-underline hover:text-yellow-300 transition text-right",
                children: h.label
            }, h.href)), U.jsxs("div", {
                className: "text-gray-300 font-semibold text-right",
                children: ["موجودی: ", U.jsx("span", {
                    className: "text-green-400",
                    children: i
                }), " تومان"]
            })]
        })]
    })
}
function Q0({symbol: a="انس طلا"}) {
    const {price: n} = Jc()
      , [i,l] = Y.useState(0);
    Y.useEffect( () => {
        var c;
        if (n && ((c = window.lastBarInfo) != null && c.open)) {
            const f = (n - window.lastBarInfo.open) / window.lastBarInfo.open * 100;
            l(f)
        }
    }
    , [n]);
    const u = i >= 0;
    return U.jsxs("div", {
        className: "bg-gray-900 text-white px-4 py-2 flex items-center justify-between rounded-xl shadow-md text-sm border border-gray-700",
        children: [U.jsxs("div", {
            className: "flex items-center gap-2",
            children: [U.jsx("div", {
                className: "w-6 h-6 bg-yellow-400 text-black text-xs rounded-full flex items-center justify-center font-bold",
                children: "G"
            }), U.jsx("span", {
                className: "font-semibold",
                children: a
            })]
        }), U.jsxs("div", {
            className: "flex items-center gap-4 text-xs",
            children: [U.jsxs("div", {
                className: `px-2 py-1 rounded-lg font-bold ${u ? "bg-green-700 text-green-300" : "bg-red-700 text-red-300"}`,
                children: [u ? "▲" : "▼", " ", CA(Math.abs(i).toFixed(2)), "٪"]
            }), U.jsx("div", {
                className: "text-gray-300 font-medium",
                children: CA(n)
            })]
        })]
    })
}
function a1({notification: a}) {
    const [n,i] = Y.useState(!0);
    return U.jsx(U.Fragment, {
        children: n && U.jsxs("div", {
            className: " bg-gray-800 text-sm border-b border-gray-700 py-2 px-4 relative overflow-hidden rounded-md shadow-md my-2 min-h-[40px]",
            children: [U.jsx("div", {
                className: "absolute top-2 left-2 cursor-pointer z-50",
                onClick: () => i(!1),
                children: U.jsx("span", {
                    className: "hover:text-red-500 text-xs bg-transparent",
                    children: "✕"
                })
            }), U.jsx("div", {
                className: "whitespace-nowrap animate-marquee text-white font-bold text-sm",
                children: a || "اطلاعیه‌ای موجود نیست..."
            })]
        })
    })
}
function n1({notification: a}) {
    const [n,i] = Y.useState("trade")
      , [l,u] = Y.useState(0)
      , [c,f] = Y.useState(null)
      , h = av()
      , B = () => u(d => d + 1);
    return U.jsxs("div", {
        className: "w-screen h-screen bg-gray-900 text-white rtl flex flex-col overflow-scroll",
        children: [U.jsx(t1, {}), U.jsx("div", {
            className: "sm:hidden pt-4 pb-4",
            children: U.jsx(Q0, {
                symbol: "انس طلا"
            })
        }), U.jsx(a1, {
            notification: a
        }), U.jsx("div", {
            className: "flex-1",
            children: h ? U.jsxs("div", {
                className: "px-4 pt-4 pb-24 overflow-y-auto",
                style: {
                    minHeight: "500px"
                },
                children: [U.jsx("div", {
                    style: {
                        display: n === "trade" ? "block" : "none"
                    },
                    children: U.jsxs("div", {
                        className: "flex flex-col gap-4",
                        children: [U.jsxs("div", {
                            className: "flex flex-row gap-2",
                            children: [U.jsx("div", {
                                className: "w-1/2",
                                children: U.jsx(oh, {
                                    mobile: !0,
                                    onOrderSuccess: B,
                                    selectedPrice: c
                                })
                            }), U.jsx("div", {
                                className: "w-1/2",
                                children: U.jsx(d0, {
                                    onSelectPrice: f
                                })
                            })]
                        }), U.jsx(g0, {
                            mobile: !0
                        }, l)]
                    })
                }), U.jsx("div", {
                    style: {
                        display: n === "chart" ? "block" : "none"
                    },
                    children: U.jsx(nh, {
                        mobile: !0
                    })
                }), U.jsx("div", {
                    style: {
                        display: n === "portfolio" ? "block" : "none"
                    },
                    children: U.jsx(h0, {})
                })]
            }) : U.jsxs("div", {
                className: "grid grid-cols-6 h-full",
                children: [U.jsxs("div", {
                    className: "col-span-1 bg-gray-900 p-4 flex flex-col gap-4 border-l border-gray-800 overflow-y-auto",
                    children: [U.jsx(oh, {
                        onOrderSuccess: B,
                        selectedPrice: c
                    }), U.jsx(h0, {}), U.jsx("div", {
                        className: "block",
                        children: U.jsx(Q0, {
                            symbol: "انس طلا"
                        })
                    })]
                }), U.jsxs("div", {
                    className: "col-span-5 flex flex-col p-4 gap-4",
                    children: [U.jsxs("div", {
                        className: "flex flex-row bg-gray-800 p-4 rounded-xl h-2/3",
                        children: [U.jsx("div", {
                            className: "flex w-1/5",
                            children: U.jsx(d0, {
                                onSelectPrice: f
                            })
                        }), U.jsx("div", {
                            className: "flex w-4/5",
                            children: U.jsx(nh, {})
                        })]
                    }), U.jsx(g0, {}, l)]
                })]
            })
        }), U.jsxs("div", {
            className: "sm:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around text-sm z-50",
            children: [U.jsx("button", {
                className: `flex-1 py-3 ${n === "trade" ? "bg-gray-700" : ""}`,
                onClick: () => i("trade"),
                children: "معامله"
            }), U.jsx("button", {
                className: `flex-1 py-3 ${n === "chart" ? "bg-gray-700" : ""}`,
                onClick: () => i("chart"),
                children: "نمودار"
            }), U.jsx("button", {
                className: `flex-1 py-3 ${n === "portfolio" ? "bg-gray-700" : ""}`,
                onClick: () => i("portfolio"),
                children: "پرتفو"
            })]
        }), U.jsx(Av, {})]
    })
}
const r1 = ({text_1: a, text_2: n}) => U.jsxs("div", {
    className: "h-screen w-screen bg-gray-900 text-white flex flex-col items-center justify-center",
    children: [U.jsxs("div", {
        className: "w-full text-white flex flex-col items-center justify-center",
        children: [U.jsx("h1", {
            className: "text-2xl font-bold",
            children: a || " بازار بسته می‌باشد"
        }), U.jsx("p", {
            className: "text-gray-400 mt-4",
            children: n || "لطفاً در ساعات مشخص شده در راهنما مراجعه فرمایید"
        })]
    }), U.jsxs("div", {
        className: "w-full flex flex-row items-center justify-center mt-5",
        children: [U.jsx("a", {
            href: "https://demo.hivagold.com/dashboard",
            className: "text-base font-bold border border-white p-2 rounded-md no-underline hover:bg-white mr-4",
            children: "صفحه اصلی"
        }), U.jsx("a", {
            href: "#",
            onClick: () => window.location.reload(),
            className: "text-base font-bold border border-white p-2 rounded-md no-underline hover:bg-white",
            children: "تلاش مجدد"
        })]
    })]
});
function l1() {
    const [a,n] = Y.useState(!0)
      , [i,l] = Y.useState(!1)
      , [u,c] = Y.useState("")
      , [f,h] = Y.useState(null)
      , [B,d] = Y.useState(null);
    return Y.useEffect( () => {
        (async () => {
            try {
                const C = await we("api/status/");
                n(C.active),
                c(C.notification || "")
            } catch (C) {
                if (n(!1),
                C.message === "Authentication credentials were not provided.") {
                    h("لاگین نکرده اید"),
                    d("ابتدا لاگین کرده سپس وارد این صفحه شوید"),
                    setTimeout( () => {
                        window.location.href = "/user/login"
                    }
                    , 50);
                    return
                }
            } finally {
                l(!0)
            }
        }
        )()
    }
    , []),
    i ? a ? U.jsx(n1, {
        notification: u
    }) : U.jsx(r1, {
        text_1: f,
        text_2: B
    }) : null
}
function Pr() {
    return Pr = Object.assign ? Object.assign.bind() : function(a) {
        for (var n = 1; n < arguments.length; n++) {
            var i = arguments[n];
            for (var l in i)
                ({}).hasOwnProperty.call(i, l) && (a[l] = i[l])
        }
        return a
    }
    ,
    Pr.apply(null, arguments)
}
function i1(a, n) {
    if (a == null)
        return {};
    var i = {};
    for (var l in a)
        if ({}.hasOwnProperty.call(a, l)) {
            if (n.indexOf(l) !== -1)
                continue;
            i[l] = a[l]
        }
    return i
}
/*! @uiw/watermark.js v1.0.1 | MIT © 2024 kenny wang <wowohoo@qq.com> https://uiwjs.github.io/react-watermark */
const s1 = a => {
    if (!a)
        return 1;
    const n = a.backingStorePixelRatio || a.webkitBackingStorePixelRatio || a.mozBackingStorePixelRatio || a.msBackingStorePixelRatio || a.oBackingStorePixelRatio || a.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / n
}
;
let u1 = class {
    constructor(n) {
        this.option = {
            gapX: 212,
            gapY: 222,
            width: 120,
            height: 64,
            rotate: -22,
            fontStyle: "normal",
            fontWeight: "normal",
            fontColor: "rgba(0,0,0,.15)",
            fontSize: 16,
            fontFamily: "sans-serif"
        },
        this.option = Object.assign(Object.assign({}, this.option), n)
    }
    async create() {
        const {image: n="", content: i="", gapX: l=212, gapY: u=222, width: c=120, height: f=64, rotate: h=-22, fontStyle: B="normal", fontWeight: d="normal", fontColor: Q="rgba(0,0,0,.15)", fontSize: C=16, fontFamily: v="sans-serif", offsetLeft: D, offsetTop: L} = this.option
          , x = document.createElement("canvas")
          , _ = x.getContext("2d")
          , O = s1(_)
          , I = `${(l + c) * O}px`
          , R = `${(u + f) * O}px`
          , z = D || l / 2
          , X = L || u / 2;
        return x.setAttribute("width", I),
        x.setAttribute("height", R),
        new Promise(async (V, k) => {
            if (_) {
                _.translate(z * O, X * O),
                _.rotate(Math.PI / 180 * Number(h));
                const q = c * O
                  , W = f * O;
                if (n) {
                    const nA = new Image;
                    nA.crossOrigin = "anonymous",
                    nA.referrerPolicy = "no-referrer",
                    nA.src = n,
                    nA.onload = async () => (_.drawImage(nA, 0, 0, q, W),
                    V(x.toDataURL())),
                    nA.onerror = uA => k(uA)
                } else if (i) {
                    const nA = Number(C) * O;
                    return _.font = `${B} normal ${d} ${nA}px/${W}px ${v}`,
                    _.fillStyle = Q,
                    Array.isArray(i) ? i == null || i.forEach( (uA, oA) => _.fillText(uA, 0, oA * 50)) : _.fillText(i, 0, 0),
                    V(x.toDataURL())
                }
            } else
                return k("Error: Canvas is not supported in the current environment")
        }
        )
    }
}
;
var o1 = ["prefixCls", "text", "className", "markClassName", "markStyle", "content", "rotate", "image", "gapX", "gapY", "width", "height", "offsetLeft", "offsetTop", "fontSize", "fontFamily", "fontWeight", "fontColor", "fontStyle"];
function c1(a, n) {
    var {prefixCls: i="w-watermark", className: l, markClassName: u, markStyle: c, content: f, rotate: h, image: B, gapX: d=212, gapY: Q, width: C=120, height: v, offsetLeft: D, offsetTop: L, fontSize: x, fontFamily: _, fontWeight: O, fontColor: I, fontStyle: R} = a
      , z = i1(a, o1)
      , X = Pr({}, a.style, {
        position: "relative"
    })
      , V = [i + "-wrapper", l].filter(Boolean).join(" ")
      , k = [i, u].filter(Boolean).join(" ")
      , [q,W] = Y.useState("");
    Y.useEffect( () => {
        var uA = new u1({
            content: f,
            rotate: h,
            image: B,
            gapX: d,
            gapY: Q,
            width: C,
            height: v,
            offsetLeft: D,
            offsetTop: L,
            fontSize: x,
            fontFamily: _,
            fontWeight: O,
            fontColor: I,
            fontStyle: R
        });
        uA.create().then(oA => W(oA)).catch( () => {}
        )
    }
    , [f, h, B, d, Q, C, v, D, L, x, _, O, I, R]);
    var nA = Pr({
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9,
        width: "100%",
        height: "100%",
        backgroundSize: d + C + "px",
        backgroundRepeat: "repeat"
    }, c, {
        pointerEvents: "none"
    });
    return nA.backgroundImage = "url(" + q + ")",
    U.jsxs("div", Pr({
        ref: n
    }, z, {
        className: V,
        style: X,
        children: [a.children, U.jsx("div", {
            style: nA,
            className: k
        })]
    }))
}
var f1 = Y.forwardRef(c1);
cU.createRoot(document.getElementById("root")).render(U.jsx(OA.StrictMode, {
    children: U.jsx(nv, {
        children: U.jsx(f1, {
            content: "دمو هیواگلد",
            fontFamily: "Vazirmatn",
            fontSize: 24,
            fontColor: "#9ca3af62",
            children: U.jsx(l1, {})
        })
    })
}));
