var Tokenizer = function() {
    function b(a) {
        this.type = a || e.Invalid;
        this.next = {}
    }

    function k(a, e, f) {
        for (var l, d, k = 0; k < e.length - 1; ++k) l = e[k], d = a.next[l], d || (d = new b, a.next[l] = d), a = d;
        l = e[k];
        if (a.next[l]) throw "addParseWord: termination state already exist";
        a.next[l] = f
    }

    function d(a, e, f) {
        for (var b = e.length - 1; 0 <= b; --b) {
            var l = e[b];
            if (a.next[l]) throw "addParseLoop: termination state already exist";
            a.next[l] = f
        }
    }

    function a(a, f, w) {
        this.col = this.line = 1;
        this.report_whitespaces = !1;
        this.start_state = new b;
        d(this.start_state,
          ['"', "'"], new b(e.String));
        var m = new b(e.Identifier),
        v = s;
        d(this.start_state, s, m);
        d(m, v, m);
        d(m, r, m);
        m = new b(e.Whitespace);
        d(this.start_state, a, m);
        d(m, a, m);
        for (a = 0; a < f.length; ++a) k(this.start_state, f[a], new b(e.Punctuator));
        f = this.start_state;
        a = new b;
        var p = new b(e.Numeric),
        m = new b(e.Numeric),
        y = new b(e.Numeric),
        v = new b,
        C = ["e", "E"],
        A = ["."],
        z = r;
        d(f, u, p);
        d(p, z, p);
        d(f, ["0"], y);
        d(y, r, p);
        z = new b(e.Numeric);
        d(z, r, z);
        d(p, A, z);
        d(y, A, z);
        d(z, C, v);
        d(p, C, v);
        d(y, C, v);
        p = f.next[A[0]];
        p || (p = new b, f.next[A[0]] = p);
        d(p,
          r, z);
        d(m, r, m);
        d(m, A, a);
        d(v, r, m);
        d(v, A, a);
        d(v, ["+", "-"], m);
        a = new b;
        k(f, "0x", a);
        f = l;
        m = new b(e.Numeric);
        d(a, l, m);
        d(m, f, m);
        f = new b(e.Comment);
        k(this.start_state, "//", f);
        k(this.start_state, "/*", f);
        this.keyword_state = new b;
        for (a = 0; a < w.length; ++a) k(this.keyword_state, w[a], new b(e.Keyword))
    }
    var e = {
        Invalid: 0,
        Comment: 1,
        Whitespace: 2,
        Keyword: 3,
        Punctuator: 4,
        Identifier: 5,
        Numeric: 6,
        String: 7
    },
    f = [];
    (function() {
        for (var a in e) f[e[a]] = a
    })();
        var l = "0123456789abcdefABCDEF".split(""),
        r = "0123456789".split(""),
        u = "123456789".split(""),
        s = [];
        (function() {
            for (var a = 97; 122 >= a; ++a) s.push(String.fromCharCode(a));
            for (a = 65; 90 >= a; ++a) s.push(String.fromCharCode(a));
            s.push("_")
        })();
        a.prototype.__collectToken = function(a, b, l) {
            var d = this.line,
            k = this.col;
            if (l === e.Whitespace)
                for (var p = 0; p < b.length; p++) "\n" === b[p] ? (++this.line, this.col = 1) : this.col++;
                else this.col += b.length;
                if (this.report_whitespaces || l !== e.Whitespace) {
                    if (p = l === e.Identifier) {
                        a: {
                            for (var r = this.keyword_state, p = b.length, s = 0; s < p; ++s)
                                if (r = r.next[b[s]], !r) {
                                    p = e.Invalid;
                                    break a
                                } p = r.type
                        }
                        p =
                        p === e.Keyword
                    }
                    p && (l = e.Keyword);
                    a.push({
                        value: b,
                        type: f[l],
                        line: d,
                        col: k
                    });
                    return !0
                }
                return !1
        };
        a.prototype.throwError = function(a, e, f) {
            throw "Error (ln " + this.line + ":" + this.col + "):" + a;
        };
        a.prototype.reportWhitespaces = function(a) {
            this.report_whitespaces = a
        };
        a.prototype.tokenize = function(a, f, b) {
            f = f || 0;
            b = b || a.length;
            b -= f;
            var l = this.start_state,
            d = [],
            k = "";
            for (this.col = this.line = 1; f < b; ++f) {
                var r = a[f],
                s = l.next[r];
                if (s) l = s, k += r;
                else if (l = l.type, l === e.Invalid && this.throwError("invalid token " + k), l === e.String) {
                    for (r =
                        k; f < b; ++f) {
                        s = a[f];
                    r += s;
                    if ("\\" === s) r += a[++f];
                    else if (s === k || "\n" === s) break;
                    ++this.col
                        }(f >= b || a[f] !== k) && this.throwError("invalid string termination");
                        ++this.col;
                        this.__collectToken(d, r, l);
                        l = this.start_state;
                        k = ""
                } else if (l === e.Comment) {
                    if ("//" === k) {
                        for (k = f; f < b && "\n" !== a[f]; ++f);
                        this.col += f - k;
                        ++this.line
                    } else
                        for (; f < b - 1; ++f)
                            if (s = a[f], "*" === s && "/" === a[f + 1]) {
                                ++f;
                                break
                            } else "\n" === s ? (++this.line, this.col = 1) : ++this.col;
                            l = this.start_state;
                    k = ""
                } else this.__collectToken(d, k, l), k = r, (l = this.start_state.next[r]) ||
                    this.throwError("invalid character code = " + r.charCodeAt(0))
            }
            0 < k.length && (l.type === e.Invalid && this.throwError("invalid token " + k), this.__collectToken(d, k, l.type));
            return d
        };
        return a
}();
"undefined" !== typeof module && module.exports && (module.exports = Tokenizer);
"undefined" !== typeof module && module.exports && (Tokenizer = require("./Tokenizer.js"));
var TCTokenizer = function() {
    function b() {
        Tokenizer.call(this, k, d, a)
    }
    var k = [" ", "\t", "\n", "\r"],
    d = ", ( ) ; { } [ ] . ? : + - * / % & | ^ ! ~ < > = *= /= %= += -= &= ^= |= && || == >= <= != ++ -- << >> <<= >>=".split(" "),
    a = "if for do while else continue break return".split(" ");
    b.prototype = Object.create(Tokenizer.prototype);
    b.prototype.tokenize = function(a, f) {
        f && (a = a.replace(/\/\/int\s/g, "int "), a = a.replace(/\/\*int\*\/\s?/g, "int "));
        return Tokenizer.prototype.tokenize.call(this, a)
    };
    return b
}();
"undefined" !== typeof module && module.exports && (module.exports = TCTokenizer);
if ("undefined" !== typeof module && module.exports) var SymbolStack = require("./SymbolStack.js");
var TCParser = function() {
    function b(a, e, f) {
        this.type = e;
        this.value = f;
        if (3 < arguments.length) {
            var b = arguments.length - 3;
            this.children = Array(b);
            for (var d = 0; d < b; ++d) this.children[d] = arguments[d + 3]
        } else this.children = [null, null], this.children.length = 0;
        a ? (this.line = a.line, this.col = a.col) : this.col = this.line = -1
    }

    function k() {
        this.node = []
    }

    function d(a, e) {
        this.tokens = a;
        this.index = 0;
        this.func_def = {
            sin: 1,
            cos: 1,
            tan: 1,
            atan: 1,
            atan2: 2
        };
        this.operators = [{
            "^": 2
        }, {
            "*": 2,
            "/": 2,
            "%": 2
        }, {
            "+": 2,
            "-": 2
        }, {
            "<<": 2,
            ">>": 2
        }, {
            "<": 2,
            ">": 2,
            "<=": 2,
            ">=": 2
        },
        {
            "==": 2,
            "!=": 2
        }, {
            "&": 2
        }, {
            "|": 2
        }, {
            "&&": 2
        }, {
            "||": 2
        }
        ];
        this.assignment_operators = {
            "=": 2,
            "*=": 2,
            "/=": 2,
            "%=": 2,
            "+=": 2,
            "-=": 2,
            "&=": 2,
            "^=": 2,
            "|=": 2,
            "<<=": 2,
            ">>=": 2
        };
        this.unary_operators = {
            "++": 1,
            "--": 1,
            "&": 1,
            "+": 1,
            "-": 1,
            "~": 1,
            "!": 1
        };
        this.postfix_operators = {
            "++": -1,
            "--": -1
        };
        this.noderef = new k;
        this.type_def = new SymbolStack;
        this.type_def.push("double", null);
        this.type_def.push("int", null);
        this.type_def.push("uint8", null);
        this.type_def.push("int16", null);
        this.type_def.push("uint16", null);
        this.type_def.push("int32", null);
        this.type_def.push("uint32", null);
        this.type_def.push("float32", null);
        this.type_def.push("float64", null);
        e && (this.type_def.push("float", null), this.type_def.push("vec2", null), this.type_def.push("vec3", null), this.type_def.push("vec4", null), this.type_def.push("mat2",
                                                                                                                                                                          null), this.type_def.push("mat3", null), this.type_def.push("mat4", null));
        this.simple_expression = !1;
        for (var f = this.operators, b = {}, d = f.length, u = 0; u < d; ++u) {
            var s = f[u],
            h;
            for (h in s) b[h] = u
        }
        this.operators_to_priority = b;
        this.line_mapping = null
    }
    k.prototype.expect = function(a, e) {
        this.node.length < e && a.throwError("expected " + e + " arguments")
    };
    k.prototype.empty = function() {
        return 0 >= this.node.length
    };
    k.prototype.push = function(a) {
        this.node.push(a)
    };
    k.prototype.pop = function() {
        return 0 >= this.node.length ? null : this.node.pop()
    };
    k.prototype.size = function() {
        return this.node.length
    };
    k.prototype.collectArgs = function(a, e, f) {
        if (this.node.length < f) throw "negative number of arguments for function call ?!";
        for (var b = f; b < this.node.length; ++b, ++e) a[e] = this.node[b];
        this.node.length = f
    };
    d.prototype.createTree = function() {
        return new b(null, "program")
    };
    d.prototype.getVersion = function(a) {
        return "eval 1.0"
    };
    d.prototype.evaluateExpr = function(a) {
        switch (a.type) {
            case "group":
            case "simple_program":
            case "block":
                return this.evaluateExpr(a.children[0]);
            case "unary":
                var e = this.evaluateExpr(a.children[0]);
                switch (a.value) {
                    case "-":
                        return -e;
                    case "+":
                        return e
                }
                throw "evaluateExpr: invalid unary operator " + a.value;
                    case "operator":
                        var e = this.evaluateExpr(a.children[0]),
                        f = this.evaluateExpr(a.children[1]);
                        switch (a.value) {
                            case "^":
                                return Math.pow(e, f);
                            case "%":
                                return e - f * Math.floor(e / f);
                            case "*":
                                return e * f;
                            case "/":
                                return e / f;
                            case "+":
                                return e + f;
                            case "-":
                                return e - f
                        }
                        throw "evaluateExpr: invalid operator " + a.value;
                            case "numeric":
                                return parseFloat(a.value);
                            case "call":
                                f =
                                a.children[1];
                                switch (a.children[0].value) {
                                    case "abs":
                                    case "fabs":
                                        return e = this.evaluateExpr(f.children[0]), Math.abs(e);
                                    case "sgn":
                                    case "sign":
                                        return e = this.evaluateExpr(f.children[0]), 0 === e ? 0 : 2 * (0 < e) - 1;
                                    case "exp":
                                        return e = this.evaluateExpr(f.children[0]), Math.exp(e);
                                    case "log":
                                        return e = this.evaluateExpr(f.children[0]), Math.log(e);
                                    case "sqrt":
                                        return e = this.evaluateExpr(f.children[0]), Math.sqrt(e);
                                    case "floor":
                                        return e = this.evaluateExpr(f.children[0]), Math.floor(e);
                                    case "ceil":
                                        return e = this.evaluateExpr(f.children[0]),
                                        Math.floor(e);
                                    case "sin":
                                        return e = this.evaluateExpr(f.children[0]), Math.sin(e);
                                    case "cos":
                                        return e = this.evaluateExpr(f.children[0]), Math.cos(e);
                                    case "asin":
                                        return e = this.evaluateExpr(f.children[0]), Math.asin(e);
                                    case "acos":
                                        return e = this.evaluateExpr(f.children[0]), Math.acos(e);
                                    case "tan":
                                        return e = this.evaluateExpr(f.children[0]), Math.tan(e);
                                    case "atan":
                                        return e = this.evaluateExpr(f.children[0]), Math.atan(e);
                                    case "atan2":
                                        return e = this.evaluateExpr(f.children[0]), f = this.evaluateExpr(f.children[1]), Math.atan2(e,
                                                                                                                                      f);
                                    case "pow":
                                        return e = this.evaluateExpr(f.children[0]), f = this.evaluateExpr(f.children[1]), Math.pow(e, f);
                                    case "int":
                                        return e = this.evaluateExpr(f.children[0]), parseInt(e);
                                    case "float":
                                    case "double":
                                        return this.evaluateExpr(f.children[0])
                                }
                                throw "evaluateExpr: invalid function";
                                    case "term":
                                        if ("pi" === a.value.toLowerCase()) return Math.PI;
                                        throw "evaluateExpr: variables are not supported";
        }
        throw "evaluateExpr: bad expr";
    };
    d.prototype.printExpr = function(a, e, f) {
        if (!e) throw "printExpr: null expr";
        if ("group" ===
            e.type) {
            a += e.value[0];
        for (f = 0; f < e.children.length; ++f) a += this.printExpr("", e.children[f]), f < e.children.length - 1 && (a += ",");
        a += e.value[1]
            } else if ("operator" === e.type || "assign" === e.type) {
                var b = !1,
                d = null;
                "operator" === e.type && (d = e.value, f && this.operators_to_priority[f] < this.operators_to_priority[d] && (b = !0));
                "^" === e.value ? a += "Math.pow(" + this.printExpr("", e.children[0], d) + "," + this.printExpr("", e.children[1], d) + ")" : (b && (a += "("), a += this.printExpr("", e.children[0], d) + e.value + this.printExpr("", e.children[1],
                                                                                                                                                                                                                                      d), b && (a += ")"))
            } else if ("numeric" === e.type) a += e.value;
            else if ("call" === e.type) f = e.children[0].value, void 0 !== this.func_def[f] && (a += "Math."), a += f + this.printExpr("", e.children[1]);
            else if ("term" === e.type) a += e.value;
            else if ("unary" === e.type) a += e.value + this.printExpr("", e.children[0]);
            else if ("postop" === e.type) a += this.printExpr("", e.children[0]) + e.value;
            else if ("member" === e.type) a += this.printExpr("", e.children[0]) + e.value + this.printExpr("", e.children[1]);
            else if ("id" === e.type) a += e.value;
            else if ("index" ===
                e.type) a += this.printExpr("", e.children[0]) + e.value[0] + this.printExpr("", e.children[1]) + e.value[1];
        else if ("scope" === e.type || "simple_program" === e.type) {
            (b = "scope" === e.type) && (a += "{");
            for (f = 0; f < e.children.length; ++f) a += this.printExpr("", e.children[f]), f < e.children.length - 1 && "block" === e.children[f].type && "" === e.children[f].value && (a += " ");
            b && (a += "}")
        } else if ("block" === e.type) {
            for (f = 0; f < e.children.length; ++f) a += this.printExpr("", e.children[f]), f < e.children.length - 1 && (a += ",");
            a += e.value
        } else if ("if" ===
            e.type)
            for (a += e.type + this.printExpr("", e.children[0]) + this.printExpr("", e.children[1]), f = 2; f < e.children.length; ++f) a += "else " + this.printExpr("", e.children[f]);
            else if ("while" === e.type) a += e.type + this.printExpr("", e.children[0]) + this.printExpr("", e.children[1]);
            else if ("do" === e.type) a += e.type, "scope" !== e.children[0].type && (a += " "), a += this.printExpr("", e.children[0]), "scope" !== e.children[0].type && "" === e.children[0].value && (a += ";"), a += e.value + this.printExpr("", e.children[1]) + ";";
            else if ("for" === e.type) a +=
                e.type + e.value[0], a += this.printExpr("", e.children[0]), a += this.printExpr("", e.children[1]), a += this.printExpr("", e.children[2]), a += this.printExpr("", e.children[3]);
        else if ("continue" === e.type || "break" === e.type) a += e.type + e.value;
        else if ("return" === e.type) a += e.type, "group" !== e.children[0].children[0].type && (a += " "), a += this.printExpr("", e.children[0]);
        else if ("cond" === e.type) a += this.printExpr("", e.children[0]) + "?", a += this.printExpr("", e.children[1]) + ":", a += this.printExpr("", e.children[2]);
        else if ("tuple" ===
            e.type) {
            a += "[";
        for (f = 0; f < e.children.length; ++f) 0 < f && (a += ","), a += this.printExpr("", e.children[f]);
        a += "]"
            } else throw "printExpr: bad expr";
            return a
    };
    d.prototype.printNode = function(a, e, f) {
        var b = e;
        void 0 !== f && (b = 2 == f ? b + " " : b + "|", e = f ? e + " " : e + "|");
        b += a.type;
        a.value && (b += " " + a.value);
        b += "\n";
        for (f = 0; f < a.children.length; ++f) b += this.printNode(a.children[f], e, f === a.children.length - 1 ? 1 : 1 < a.children.length ? 0 : 2);
        return b
    };
    d.prototype.parseSimple = function(a) {
        this.simple_expression = !0;
        a = a || new b(null, "simple_program");
        this.parseExprScope();
        this.noderef.collectArgs(a.children, 0, 0);
        return a
    };
    d.prototype.parse = function(a) {
        a = a || new b(null, "program");
        try {
            this.parseProgram(), this.noderef.collectArgs(a.children, 0, 0)
        } catch (e) {
            throw this.noderef.collectArgs(a.children, 0, 0), e;
        }
        return a
    };
    d.prototype.parseDefinition = function(a, e) {
        if ("enum" === a.value) {
            this.next();
            this.expect("{");
            var f = this.getDeclScope();
            this.optional(";");
            var d = new b(a, "enum", "", f);
            this.noderef.push(d);
            return !0
        }
        if ("static" === a.value) return this.next(), d =
            new b(a, "static", "", this.getDeclBlock(";")), this.noderef.push(d), !0;
        if ("struct" === a.value) {
            this.next();
            f = null;
            this.optional("{") && (f = this.getDeclScope());
            var k = this.next();
            "Identifier" !== k.type && this.throwError("struct name expected", k);
            d = new b(a, "struct", k.value);
            f && (d.children[0] = f);
            if (this.optional(":")) {
                f || this.throwError(": not expected in predefinition", k);
                do f = this.next(), "Identifier" !== f.type && this.throwError("parent struct name expected", f), d.children.push(new b(f, "parent", f.value)); while (this.optional(","))
            }
            this.expect(";");
            this.noderef.push(d);
            this.type_def.push(k.value, d);
            return !0
        }
        return !1
    };
    d.prototype.parseProgram = function() {
        for (;;) {
            var a = this.peek(!0);
            if (!a) break;
            if (!this.parseDefinition(a, !0))
                if ("Identifier" === a.type || "(" === a.value) {
                    this.next();
                    var e = null,
                    f;
                    "(" === a.value ? f = "" : (void 0 !== this.type_def.get(a.value) && (e = a, a = this.next(), "Identifier" !== a.type && this.throwError("function name expected after type " + a.value, a)), f = a.value, this.expect("("));
                    this.type_def.scope_start();
                    a = new b(a, "function", f);
                    a.children[0] =
                    this.getDeclBlock(")", !0);
                    this.expect("{");
                    a.children[1] = this.getExprScope();
                    e && a.children.push(new b(e, "return_type", e.value));
                    this.noderef.push(a);
                    this.type_def.scope_end()
                } else this.throwError("unexpected " + f, a)
        }
    };
    d.prototype.parseDeclScope = function(a) {
        for (;;) {
            var e = this.peek(!a);
            if (!e) break;
            if ("}" === e.value) {
                this.next();
                a || this.throwError("unexpected }", e);
                break
            } else e = this.getDeclBlock(";"), this.noderef.push(e)
        }
    };
    d.prototype.parseExprScope = function(a) {
        for (;;) {
            var e = this.peek(!a);
            if (!e) break;
            if ("}" === e.value) {
                this.next();
                a || this.throwError("unexpected }", e);
                break
            } else this.parseExprStat()
        }
    };
    d.prototype.parseExprStat = function() {
        var a = this.peek();
        "{" == a.value ? (this.next(), a = this.getExprScope(), this.noderef.push(a)) : this.parseDefinition(a, !1) || ("Keyword" === a.type ? this.parseKeyword() : (a = "Identifier" === a.type && void 0 !== this.type_def.get(a.value) ? this.getDeclBlock(";") : this.getExprBlock(";"), this.noderef.push(a)))
    };
    d.prototype.getDeclBlock = function(a, e) {
        var f = this.noderef.size();
        this.parseDeclComma(a,
                            !1, e) || (a = "");
                            var d = new b(this.last(), "block", a);
                            this.noderef.collectArgs(d.children, 0, f);
                            return d
    };
    d.prototype.getExprBlock = function(a) {
        var e = this.noderef.size();
        this.parseExprComma(a) || (a = "");
        a = new b(this.last(), "block", a);
        this.noderef.collectArgs(a.children, 0, e);
        return a
    };
    d.prototype.getDeclScope = function() {
        var a = this.noderef.size();
        this.parseDeclScope(!0);
        var e = new b(this.last(), "scope", "{}");
        this.noderef.collectArgs(e.children, 0, a);
        return e
    };
    d.prototype.getExprScope = function() {
        var a = this.noderef.size();
        this.parseExprScope(!0);
        var e = new b(this.last(), "scope", "{}");
        this.noderef.collectArgs(e.children, 0, a);
        return e
    };
    d.prototype.getOptionalExprBlock = function(a) {
        return this.optional(a) ? new b(this.last(), "block", a) : this.getExprBlock(a)
    };
    d.prototype.getOptionalDeclBlock = function(a) {
        return this.optional(a) ? new b(this.last(), "block", a) : this.getDeclBlock(a)
    };
    d.prototype.parseKeyword = function() {
        var a = this.next();
        if ("if" === a.value || "while" === a.value) {
            var e = new b(a, a.value, "()");
            this.expect("(");
            this.parseExpr();
            e.children[0] = new b(a, "group", "()", this.noderef.pop());
            this.expect(")");
            this.parseExprStat();
            e.children[1] = this.noderef.pop();
            if ("if" === a.value)
                for (var f = 2;; ++f)
                    if ((a = this.peek(!0)) && "else" === a.value) this.next(), this.parseExprStat(), e.children[f] = this.noderef.pop();
                    else break;
                    this.noderef.push(e)
        } else "do" === a.value ? (e = new b(a, a.value, "while"), this.parseExprStat(), e.children[0] = this.noderef.pop(), this.expect("while"), this.expect("("), this.parseExpr(), e.children[1] = new b(a, "group", "()", this.noderef.pop()),
            this.expect(")"), this.expect(";"), this.noderef.push(e)) : "for" === a.value ? (e = new b(a, a.value, "()"), this.expect("("), e.children[0] = this.getOptionalDeclBlock(";"), e.children[1] = this.getOptionalExprBlock(";"), e.children[2] = this.getOptionalExprBlock(")"), this.parseExprStat(), e.children[3] = this.noderef.pop(), this.noderef.push(e)) : "continue" === a.value || "break" === a.value ? (this.expect(";"), e = new b(a, a.value, ";"), this.noderef.push(e)) : "return" === a.value && (e = this.noderef.size(), this.optional(";") || (this.parseExpr(),
                                                                                                                                                                                                                                                                this.expect(";")), f = this.noderef.size() - e, 1 < f && this.throwError("more than one return argument", a), e = new b(a, a.value, ""), e.children[0] = 0 < f ? new b(a, "block", ";", this.noderef.pop()) : new b(a, "block", ";"), this.noderef.push(e))
    };
    d.prototype.parseArrayExpr = function() {
        var a = this.peek();
        if ("{" === a.value) {
            this.next();
            var e = this.noderef.size();
            this.parseArrayComma("}");
            a = new b(a, "array", "{}");
            this.noderef.collectArgs(a.children, 0, e);
            this.noderef.push(a)
        } else this.parseExpr()
    };
        d.prototype.parseArrayComma = function(a,
                                               e) {
            for (this.parseArrayExpr();;) {
                var b = this.peek();
                if (!b) return !1;
                if (b.value === a) return e || this.next(), !0;
                "," === b.value ? (this.next(), this.parseArrayExpr()) : this.throwError("unexpected block end", b)
            }
                                               };
                                               d.prototype.parseExprComma = function(a, e) {
                                                   this.parseExpr();
                                                   for (var b = ";" === a;;) {
                                                       var d = this.peek(b);
                                                       if (!d) return !1;
                                                       if (d.value === a) return e || this.next(), !0;
                                                       if ("," === d.value) this.next(), this.parseExpr();
                                                       else {
                                                           if ("}" === d.value && ";" === a) return !1;
                                                           this.throwError("unexpected block end", d)
                                                       }
                                                   }
                                               };
                                               d.prototype.parseDeclComma =
                                               function(a, e, b) {
                                                   for (this.parseDeclExpr(a, b);;) {
                                                       var d = this.peek();
                                                       if (d.value === a) return e || this.next(), !0;
                                                       if ("," === d.value) this.next(), this.parseDeclExpr(a, b);
                                                       else {
                                                           if ("}" === d.value && ";" === a) return !1;
                                                           this.throwError("unexpected block end", d)
                                                       }
                                                   }
                                               };
                                               d.prototype.parseDeclExpr = function(a, e) {
                                                   var f = this.peek(!0);
                                                   if (f && "Identifier" === f.type && void 0 !== this.type_def.get(f.value)) {
                                                       this.next();
                                                       var d = this.noderef.size(),
                                                       f = new b(f, "var", f.value);
                                                       e ? this.parseExpr() : this.parseExprComma(a, !0);
                                                       this.noderef.collectArgs(f.children,
                                                                                0, d);
                                                       this.noderef.push(f)
                                                   } else this.parseExpr()
                                               };
                                                   d.prototype.parseExpr = function() {
                                                       this.parseAssignmentExpr()
                                                   };
                                                   d.prototype.parseAssignmentExpr = function() {
                                                       for (this.parseCondExpr();;) {
                                                           var a = this.peek(!0);
                                                           if (!a) break;
                                                           if (void 0 !== this.assignment_operators[a.value]) {
                                                               var e = this.noderef.pop(),
                                                               f = e;
                                                               ("group" === f.type || "operator" === f.type || "assign" === f.type || "unary" === f.type && "&" !== f.value || "postop" === f.type || "cond" === f.type || "function" === f.type || "call" === f.type) && this.throwError(this.printExpr("", e) + " is invalide left side of assignment",
                                                                                                                                                                                                                                                                a);
                                                               this.next();
                                                               "{" === this.peek().value ? this.parseArrayExpr() : this.parseAssignmentExpr();
                                                               a = new b(a, "assign", a.value, e, this.noderef.pop());
                                                               this.noderef.push(a)
                                                           }
                                                           break
                                                       }
                                                   };
                                                   d.prototype.parseCondExpr = function() {
                                                       for (this.parseOpArg(this.operators.length - 1);;) {
                                                           var a = this.peek(!0);
                                                           if (!a) break;
                                                           "?" === a.value && (this.next(), a = new b(a, "cond", "?"), a.children[0] = this.noderef.pop(), this.parseExpr(), this.expect(":"), a.children[1] = this.noderef.pop(), this.parseCondExpr(), a.children[2] = this.noderef.pop(), this.noderef.push(a));
                                                           break
                                                       }
                                                   };
                                                   d.prototype.parseOpArg = function(a) {
                                                       if (0 > a) this.parseUnaryArg();
                                                       else {
                                                           var e = this.operators[a];
                                                           for (this.parseOpArg(a - 1);;) {
                                                               var f = this.peek(!0);
                                                               if (!f) break;
                                                               if (void 0 !== e[f.value]) {
                                                                   var d = this.noderef.pop();
                                                                   this.next();
                                                                   this.parseOpArg(a - 1);
                                                                   f = new b(f, "operator", f.value, d, this.noderef.pop());
                                                                   this.noderef.push(f)
                                                               } else break
                                                           }
                                                       }
                                                   };
                                                   d.prototype.parseUnaryArg = function() {
                                                       var a = this.peek();
                                                       if ("Punctuator" === a.type && void 0 !== this.unary_operators[a.value]) this.next(), this.parseUnaryArg(), a = new b(a, "unary", a.value,
                                                           this.noderef.pop()), this.noderef.push(a);
                                                       else if ("[" === a.value) {
                                                           this.next();
                                                           var e = this.noderef.size();
                                                           this.parseExprComma("]");
                                                           a = new b(a, "tuple", "[]");
                                                           this.noderef.collectArgs(a.children, 0, e);
                                                           this.noderef.push(a)
                                                       } else this.parsePostfix()
                                                   };
                                                       d.prototype.parseLGroup = function() {};
                                                       d.prototype.parsePostfix = function() {
                                                           for (this.parseArg();;) {
                                                               var a = this.peek(!0);
                                                               if (!a) break;
                                                               if (void 0 !== this.postfix_operators[a.value]) {
                                                                   this.next();
                                                                   var e = new b(a, "postop", a.value, this.noderef.pop());
                                                                   this.noderef.push(e)
                                                               } else if ("." ===
                                                                   a.value) this.next(), e = new b(a, "member", a.value), e.children[0] = this.noderef.pop(), this.parseId(), e.children[1] = this.noderef.pop(), this.noderef.push(e);
                                                               else if ("[" === a.value) this.next(), e = new b(a, "index", "[]"), e.children[0] = this.noderef.pop(), a = this.noderef.size(), this.parseExpr(), this.expect("]"), a < this.noderef.size() && (e.children[1] = this.noderef.pop()), this.noderef.push(e);
                                                               else if ("(" === a.value) {
                                                                   this.next();
                                                                   e = new b(a, "call", "");
                                                                   e.children[0] = this.noderef.pop();
                                                                   var f = new b(a, "group", "()");
                                                                   e.children[1] =
                                                                   f;
                                                                   a = this.noderef.size();
                                                                   this.parseExprComma(")");
                                                                   this.noderef.collectArgs(f.children, 0, a);
                                                                   this.noderef.push(e)
                                                               } else break
                                                           }
                                                       };
                                                       d.prototype.parseId = function() {
                                                           var a = this.next();
                                                           "Identifier" === a.type ? (a = new b(a, "id", a.value), this.noderef.push(a)) : this.throwError("member name expected", a)
                                                       };
                                                       d.prototype.parseArg = function() {
                                                           var a = this.peek();
                                                           if ("Numeric" === a.type) this.next(), a = new b(a, "numeric", a.value), this.noderef.push(a);
                                                           else if ("String" === a.type) this.next(), a = new b(a, "string", a.value), this.noderef.push(a);
                                                           else if ("(" === a.value) {
                                                               this.next();
                                                               var e = this.noderef.size();
                                                               this.parseArrayComma(")");
                                                               a = new b(a, "group", "()");
                                                               this.noderef.collectArgs(a.children, 0, e);
                                                               this.noderef.push(a)
                                                           } else "Identifier" === a.type && (this.next(), a = new b(a, "term", a.value), this.noderef.push(a))
                                                       };
                                                           d.prototype.setLineMapping = function(a) {
                                                               this.line_mapping = a
                                                           };
                                                           d.prototype.getErrorLine = function(a) {
                                                               var e = this.line_mapping;
                                                               if (!e) return a;
                                                               var b = e.length;
                                                               if (a >= b) {
                                                                   if (0 < b) return a - (b - e[b - 1])
                                                               } else if (0 <= a) return e[a];
                                                               return a
                                                           };
                                                           d.prototype.throwError =
                                                           function(a, e) {
                                                               var b, d;
                                                               void 0 === e ? 0 < this.index ? (d = this.tokens[this.index - 1], b = d.line, d = d.col) : d = b = 1 : (b = e.line, d = e.col);
                                                               throw "Error (ln " + this.getErrorLine(b) + ":" + d + "): " + a;
                                                           };
                                                           d.prototype.next = function(a) {
                                                               if (this.index < this.tokens.length) return this.tokens[this.index++];
                                                               a || this.throwError("unexpected end");
                                                               return null
                                                           };
                                                           d.prototype.last = function() {
                                                               return 0 < this.index ? this.tokens[this.index - 1] : null
                                                           };
                                                           d.prototype.peek = function(a) {
                                                               if (this.index < this.tokens.length) return this.tokens[this.index];
                                                               a || this.throwError("unexpected end");
                                                               return null
                                                           };
                                                           d.prototype.expect = function(a, e) {
                                                               e = e ? e : this.next();
                                                               e.value != a && this.throwError("expected " + a, e)
                                                           };
                                                           d.prototype.optional = function(a) {
                                                               return this.index < this.tokens.length && this.tokens[this.index].value == a ? (++this.index, !0) : !1
                                                           };
                                                           return d
}();
"undefined" !== typeof module && module.exports && (module.exports = TCParser);
SymbolStack = function() {
    function b() {
        this.stack = [];
        this.hash = {};
        this.offset = []
    }
    b.prototype.print_top = function() {
        for (var b = this.top(), d = this.stack.length; b < d; ++b) console.log(this.stack[b])
    };
        b.prototype.push = function(b, d) {
            this.stack.push(b);
            this.hash[b] = d
        };
        b.prototype.top = function() {
            if (1 > this.offset.length) throw "symbol stack underflow";
            return this.offset[this.offset.length - 1]
        };
        b.prototype.get_scope_depth = function() {
            return this.offset.length
        };
        b.prototype.scope_start = function() {
            this.offset.push(this.stack.length)
        };
        b.prototype.scope_end = function() {
            if (0 >= this.offset.length) throw "SymbolStack failure";
            for (var b = this.stack.length - this.offset.pop(); 0 < b; --b) {
                var d = this.stack.pop();
                delete this.hash[d]
            }
        };
        b.prototype.scope = function(b) {
            this.scope_start();
            b();
            this.scope_end()
        };
        b.prototype.get = function(b) {
            return this.hash[b]
        };
        return b
}();
"undefined" !== typeof module && module.exports && (module.exports = SymbolStack);
var GeneratorBase = function() {
    function b() {
        this.code = "";
        this.line_mapping = null
    }
    b.prototype.add = function(b) {
        this.code += b
    };
    b.prototype.setLineMapping = function(b) {
        this.line_mapping = b
    };
    b.prototype.getErrorLine = function(b) {
        var d = this.line_mapping;
        if (!d) return b;
        var a = d.length;
        if (b >= a) {
            if (0 < a) return b - (a - d[a - 1])
        } else if (0 <= b) return d[b];
        return b
    };
    b.prototype.throwError = function(b, d) {
        if (d && 0 <= d.line) throw "Error (ln " + this.getErrorLine(d.line) + ":" + d.col + "): " + b;
        throw b;
    };
    b.prototype.throwWarning = function(b,
                                        d) {
        d && 0 <= d.line ? console.log("Warning (ln " + this.getErrorLine(d.line) + ":" + d.col + "): " + b) : console.log("Warning: " + b)
                                        };
                                        b.prototype.generate = function(b) {
                                            return this.code
                                        };
                                        return b
}();
"undefined" !== typeof module && module.exports && (module.exports = GeneratorBase);
"undefined" !== typeof module && module.exports && (GeneratorBase = require("./GeneratorBase.js"), SymbolStack = require("./SymbolStack.js"));
var GeneratorCommon = function() {
    function b(c, q, g) {
        GeneratorBase.call(this);
        var a = q.statics_def,
        D = q.func_def,
        B = q.term_func_def;
        q = q.const_def;
        this.language = c;
        var f = c === b.LanguageCpp,
        d = c === b.LanguageKc,
        E = c === b.LanguageJs;
        c = c === b.LanguageGLSL;
        this.is_cpp = f;
        this.is_kc = d;
        this.is_js = E;
        this.is_c_like = f || d || c;
        this.is_cpp_or_glsl = (this.is_glsl = c) || f;
        c ? (this.no_double_type = !0, this.float_type = m) : (this.no_double_type = !1, this.float_type = v);
        this.int_type = p;
        this.int_type_def = new l(this.int_type, !0, 1);
        this.bool_type_def =
        new l(this.int_type, !0, 1);
        this.bool_type_def.is_bool = !0;
        this.float_type_def = new l(this.float_type, !0, 1);
        this.uint8_type_def = new l("uint8", !0, 1);
        this.uint8_type_def.elem_ctor = "Uint8Array";
        this.uint8_type_def.elem_bytes = 1;
        this.uint8_type_def.is_typed_array = !0;
        this.int16_type_def = new l("int16", !0, 1);
        this.int16_type_def.elem_ctor = "Int16Array";
        this.int16_type_def.elem_bytes = 2;
        this.int16_type_def.is_typed_array = !0;
        this.uint16_type_def = new l("uint16", !0, 1);
        this.uint16_type_def.elem_ctor = "Uint16Array";
        this.uint16_type_def.elem_bytes = 2;
        this.uint16_type_def.is_typed_array = !0;
        this.int32_type_def = new l("int32", !0, 1);
        this.int32_type_def.elem_ctor = "Int32Array";
        this.int32_type_def.elem_bytes = 4;
        this.int32_type_def.is_typed_array = !0;
        this.uint32_type_def = new l("uint32", !0, 1);
        this.uint32_type_def.elem_ctor = "Uint32Array";
        this.uint32_type_def.elem_bytes = 4;
        this.uint32_type_def.is_typed_array = !0;
        this.float32_type_def = new l("float32", !0, 1);
        this.float32_type_def.elem_ctor = "Float32Array";
        this.float32_type_def.elem_bytes = 4;
        this.float32_type_def.is_typed_array = !0;
        this.float64_type_def = new l("float64", !0, 1);
        this.float64_type_def.elem_ctor = "Float64Array";
        this.float64_type_def.elem_bytes = 8;
        this.float64_type_def.is_typed_array = !0;
        this.typed_array_type_defs = {
            uint8: this.uint8_type_def,
            int16: this.int16_type_def,
            uint16: this.uint16_type_def,
            int32: this.int32_type_def,
            uint32: this.uint32_type_def,
            float32: this.float32_type_def,
            float64: this.float64_type_def
        };
        this.string_type_def = new l(y, !1, 0);
        this.mat_type_def = this.vec_type_def = null;
        if (this.is_vectormath = g.use_vecmat) {
            var t = new e(this.float_type, null);
            t.name = "x";
            var k = new e(this.float_type, null);
            k.name = "y";
            var n = new e(this.float_type, null);
            n.name = "z";
            var w = new e(this.float_type, null);
            w.name = "w";
            this.vec_type_def = [null, null, new l("vec2", !0, 2, [t, k]), new l("vec3", !0, 3, [t, k, n]), new l("vec4", !0, 4, [t, k, n,
                                                                                                                  w
            ])];
            t = new e(null, this.vec_type_def[2]);
            t.name = "x";
            k = new e(null, this.vec_type_def[2]);
            k.name = "y";
            n = new e(null, this.vec_type_def[3]);
            n.name = "x";
            w = new e(null, this.vec_type_def[3]);
            w.name = "y";
            var r = new e(null, this.vec_type_def[3]);
            r.name = "z";
            var s = new e(null, this.vec_type_def[4]);
            s.name = "x";
            var u = new e(null, this.vec_type_def[4]);
            u.name = "y";
            var z = new e(null, this.vec_type_def[4]);
            z.name = "z";
            var F = new e(null, this.vec_type_def[4]);
            F.name = "w";
            this.mat_type_def = [null, null, new l("mat2", !0, 4, [t, k]), new l("mat3",
                                                                                 !0, 9, [n, w, r]), new l("mat4", !0, 16, [s, u, z, F])];
                                                                                 for (t = 0; t < this.mat_type_def.length; ++t)
                                                                                     if (k = this.mat_type_def[t]) k.is_matrix = !0
        }
        this.any_type_def = new l(C, !1, 0);
        this.declared_struct = new SymbolStack;
        if (this.is_vectormath) {
            for (t = 0; t < this.vec_type_def.length; ++t)(k = this.vec_type_def[t]) && this.declared_struct.push(k.name, k);
            for (t = 0; t < this.mat_type_def.length; ++t)(k = this.mat_type_def[t]) && this.declared_struct.push(k.name, k)
        }
        this.eval_version = g.eval_version;
        this.sub_term = f ? {
            pi: {
                name: "M_PI",
                type: "numeric"
            },
            PI: {
                name: "M_PI",
                type: "numeric"
            }
        } : c ? {} : d ? {
            pi: {
                name: "pi",
                type: "numeric"
            },
            PI: {
                name: "PI",
                type: "numeric"
            }
        } : {
            pi: {
                name: "Math.PI",
                type: "numeric"
            },
            PI: {
                name: "Math.PI",
                type: "numeric"
            }
        };
        k = d || c ? "" : "libdraw.";
        n = d ? "" : "()";
        if (B)
            for (t in B) this.sub_term[t] = {
                name: k + B[t] + n,
                type: "function"
            };
        this.sub_function = {};
        E ? (B = {
            "sign(f)f": "$sign",
             "sgn(f)f": "$sign",
             "fract(f)f": "$fract",
             "sin(f)fc": "Math.sin",
             "cos(f)fc": "Math.cos",
             "asin(f)f": "Math.asin",
             "acos(f)f": "Math.acos",
             "floor(f)fc": "Math.floor",
             "ceil(f)fc": "Math.ceil",
             "abs(f)f": "Math.abs",
             "fabs(f)f": "Math.abs",
             "sqrt(f)fc": "Math.sqrt",
             "int(f)ic": "parseInt",
             "double(i)fc": "",
             "pow(ff)f": "Math.pow",
             "exp(f)f": "Math.exp",
             "tan(f)fc": "Math.tan",
             "atan(f)fc": "Math.atan",
             "atan2(ff)fc": "Math.atan2",
             "log(f)f": "Math.log"
        }, this.is_vectormath && (B["float(i)fc"] = "")) : (B = f ? "fabs" : "abs", E = f ? "libdraw.sgn" : "sign", B = {
            "sign(f)f": E,
                                                            "sgn(f)f": E,
                                                            "fract(f)f": "fract",
                                                            "sin(f)fc": "sin",
                                                            "cos(f)fc": "cos",
                                                            "asin(f)f": "asin",
                                                            "acos(f)f": "acos",
                                                            "floor(f)fc": "floor",
                                                            "ceil(f)fc": "ceil",
                                                            "abs(f)f": B,
                                                            "fabs(f)f": B,
                                                            "sqrt(f)fc": f ?
                                                            "libdraw._sqrt" : "sqrt",
                                                            "int(f)ic": "int",
                                                            "double(i)fc": c ? "float" : "double",
                                                            "pow(ff)f": "pow",
                                                            "exp(f)f": "exp",
                                                            "tan(f)fc": "tan",
                                                            "atan(f)fc": "atan",
                                                            "atan2(ff)fc": "atan2",
                                                            "log(f)f": "log"
        }, this.is_vectormath && (B["float(i)fc"] = c ? "float" : "double"));
        for (t in B) this.addSubFunction(t, B[t]);
        if (0 < g.eval_version)
            for (t in g = d ? {
                "min(ff)f": "min",
                 "max(ff)f": "max"
            } : c ? {
                "min(ff)f": "min",
                 "max(ff)f": "max"
            } : f ? {
                "min(ff)f": "libdraw._min",
                 "max(ff)f": "libdraw._max"
            } : {
                "min(ff)f": "Math.min",
                 "max(ff)f": "Math.max"
            }, g) this.addSubFunction(t,
                                      g[t]);
            if (this.is_vectormath) {
                g = {
                    "vec2(v2)v2": "$dup2",
                    "vec2(v3)v2": "$dup2",
                    "vec2(v4)v2": "$dup2",
                    "vec3(v3)v3": "$dup3",
                    "vec3(v4)v3": "$dup3",
                    "vec4(v4)v4": "$dup4",
                    "vec2(f)v2": "$vec2_f",
                    "vec2(ff)v2": "$vec2",
                    "vec3(f)v3": "$vec3_f",
                    "vec3(v2f)v3": "$vec3_v2f",
                    "vec3(fv2)v3": "$vec3_fv2",
                    "vec3(fff)v3": "$vec3",
                    "vec4(f)v4": "$vec4_f",
                    "vec4(v2ff)v4": "$vec4_v2ff",
                    "vec4(fv2f)v4": "$vec4_fv2f",
                    "vec4(ffv2)v4": "$vec4_ffv2",
                    "vec4(v2v2)v4": "$vec4_v2v2",
                    "vec4(v3f)v4": "$vec4_v3f",
                    "vec4(fv3)v4": "$vec4_fv3",
                    "vec4(ffff)v4": "$vec4",
                    "mat2(f)m2": "$mat2_f",
                    "mat2(m3)m2": "$mat2_m3",
                    "mat2(m4)m2": "$mat2_m4",
                    "mat2(v2v2)m2": "$mat2_v2v2",
                    "mat2(ffff)m2": "$mat2",
                    "mat3(f)m3": "$mat3_f",
                    "mat3(v3v3v3)m3": "$mat3_v3v3v3",
                    "mat3(m2)m3": "$mat3_m2",
                    "mat3(m4)m3": "$mat3_m4",
                    "mat3(fffffffff)m3": "$mat3",
                    "mat4(f)m4": "$mat4_f",
                    "mat4(m2)m4": "$mat4_m2",
                    "mat4(m3)m4": "$mat4_m3",
                    "mat4(v4v4v4v4)m4": "$mat4_v4v4v4v4",
                    "mat4(ffffffffffffffff)m4": "$mat4",
                    "abs(v2)v2": "$abs2",
                    "abs(v3)v3": "$abs3",
                    "abs(v4)v4": "$abs4",
                    "length(v2)f": "$length2",
                    "length(v3)f": "$length3",
                    "length(v4)f": "$length4",
                    "dot(v2v2)f": "$dot2",
                    "dot(v3v3)f": "$dot3",
                    "dot(v4v4)f": "$dot4",
                    "cross(v2v2)f": "$cross2",
                    "cross(v3v3)v3": "$cross3",
                    "distance(v2v2)f": "$distance2",
                    "distance(v3v3)f": "$distance3",
                    "distance(v4v4)f": "$distance4",
                    "transpose(m2)m2": "$transpose2",
                    "transpose(m3)m3": "$transpose3",
                    "transpose(m4)m4": "$transpose4",
                    "floor(v2)v2": "$floor2",
                    "floor(v3)v3": "$floor3",
                    "floor(v4)v4": "$floor4",
                    "ceil(v2)v2": "$ceil2",
                    "ceil(v3)v3": "$ceil3",
                    "ceil(v4)v4": "$ceil4",
                    "fract(v2)v2": "$fract2",
                    "fract(v3)v3": "$fract3",
                    "fract(v4)v4": "$fract4"
                };
                if (this.is_cpp)
                    for (t in g) f = t.substr(0, 3), g[t] = "vec" === f || "mat" === f ? t.substr(0, t.indexOf("(")) : "libvec::" + t.substr(0, t.indexOf("("));
                    else if (!this.is_js)
                        for (t in g) g[t] = t.substr(0, t.indexOf("("));
                        for (t in g) this.addSubFunction(t, g[t])
            }
            if (d || c) {
                if (D)
                    for (t in D) this.addSubFunction(t, D[t])
            } else if (D)
                for (t in D) this.addSubFunction(t, "libdraw." + D[t]);
                this.indent = 0;
        this.new_line = !1;
        this.function_var = new SymbolStack;
        this.function_autovar = new SymbolStack;
        this.function_reserved_var =
        new SymbolStack;
        this.scope_index_stack = [];
        this.unique_scope_index = this.current_scope_index = 0;
        this.declared_var = new SymbolStack;
        this.declared_function = new SymbolStack;
        this.declared_const = new SymbolStack;
        this.current_return_type = [];
        this.declared_const.push("pi", Math.PI);
        this.declared_const.push("PI", Math.PI);
        if (q)
            for (t in q) this.declared_const.push(t, q[t]);
            if (a)
                for (t in a) D = a[t], q = new h(this.float_type, D.name, null), "array" === D.type && (q.is_array = !0, q.offsets.push(1), q.offsets.push(D.size), q.dimensions.push(D.size)),
                    q.name_wsi = k + q.name, this.declared_var.push(q.name, q);
        this.print_expr_type = [A];
        this.warning_level = 0
    }

    function k(c, q, g, a) {
        this.name = c;
        this.code_name = q;
        this.args = g;
        this.ret_type = a;
        this.is_const = !1
    }

    function d(c, q, g) {
        c = new h(c, null, null);
        c.is_ref = q;
        g && (c.type_struct = g, c.is_object = g.is_complex, c.size = g.size);
        return c
    }

    function a(c) {
        for (;
             "group" === c.type && 1 == c.children.length;) c = c.children[0];
        return c
    }

    function e(c, q) {
        this.type = c ? c : q.name;
        this.offsets = [];
        this.dimensions = [];
        this.type_struct = q;
        this.is_object = !!q;
        this.is_array = !1;
        this.size = q ? q.size : 1;
        this.name = null
    }

    function f(c) {
        this.size = c
    }

    function l(c, q, g, a) {
        this.name = c;
        this.is_complex = !q || 1 < g;
        this.is_algebraic = q;
        this.is_matrix = !1;
        void 0 !== a ? this.fields = this.new_fields = a : (this.new_fields = [], this.fields = []);
        this.size = g;
        this.parent = null;
        this.is_bool = !1
    }

    function r(c) {
        this.is_index = "index" === c.type;
        this.node = c;
        this.member_offset = this.size = 0
    }

    function u(c, q) {
        return 1 !== q.size ? !1 : q == c.bool_type_def || q == c.int_type_def || q == c.float_type_def || !!q.is_typed_array
    }

    function s(c, q, g) {
        return q ===
        g || u(c, q) && u(c, g) ? !0 : !1
    }

    function h(c, q, g) {
        e.call(this, c);
        this.name_wsi = this.name = q;
        this.assign_node = g;
        this.assign_value = null;
        this.is_static = this.is_func_arg = this.is_auto = this.is_ref = !1;
        this.ref_alias = null
    }

    function n(c) {
        var q = "",
        td = c.is_typed_array ? c.typed_type_def : c.is_object && c.type_struct && c.type_struct.uniform_typed_def;
        if (td) q += " = new " + td.elem_ctor + "(" + c.size + ")";
        else if (c.is_array || c.is_object)
            if (c.size <= b.MaxInlineArray) {
                for (var q = q + " = [", g = 0; g < c.size; ++g) q += "0", g < c.size - 1 && (q += ",");
                q += "]"
            } else q += " = $zero(" + c.size + ")";
            else q += " = 0";
            return q
    }

    function w(c) {
        this.type = c.type;
        this.value = c.value;
        this.children = Array(c.children.length);
        this.line =
        c.line;
        this.col = c.col;
        this.array_def = this.type_def = null;
        this.is_const = !1
    }
    var m = "float",
    v = "double",
    p = "int",
    y = "string",
    C = "any",
    A = 0;
    b.prototype = Object.create(GeneratorBase.prototype);
    b.prototype.findSubFunction = function(c, q) {
        var g = this.sub_function[c];
        if (!g) return null;
        if (!q) return g[0];
        "group" !== q.type && this.throwError("expected function " + c + " arguments inside ()", q);
        var a = g.length;
        if (1 === a && !g[0].args) return g[0];
        for (var b = q.children.length, e = !1, f = 0; f < a; ++f)
            if (g[f].args.length === b) {
                for (var e = !0, d =
                    g[f].args, h = !0, l = 0; l < b; ++l) {
                    var m = d[l];
                if (m.type === y) {
                    if (this.getNodeInfo(q.children[l]).type_def.name !== y) {
                        h = !1;
                        break
                    }
                } else if (m.type !== C) {
                    var k = this.getNodeInfo(q.children[l]).type_def,
                    n = m.type_struct;
                    if (k.name === y || n && n.is_algebraic && (!k.is_algebraic || n.size != k.size) || !n && 1 === m.size && 1 < k.size) {
                        h = !1;
                        break
                    }
                }
                    }
                    if (h) return g[f]
            } d = "function " + c + " expects ";
                h = [];
                l = -1;
                for (f = 0; f < a; ++f) m = g[f].args.length, m !== l && (h.push(m), l = m);
                for (f = 0; f < h.length; ++f) d += h[f], f < h.length - 2 ? d += ", " : f < h.length - 1 && (d += " or ");
                d += " arguments";
        this.throwError(e ? d + " with different types" : d + (", " + b + " given"), q)
    };
    b.prototype.addSubFunction = function(c, q) {
        var g = null,
        a = null,
        b = !1,
        e, f = c.indexOf("(");
        if (0 > f) e = c;
        else {
            e = c.substr(0, f);
            g = [];
            for (f += 1; f < c.length && ")" !== c[f]; ++f) {
                var x = !1;
                "&" === c[f] && (++f, x = !0);
                if ("a" === c[f]) x = d(C, x), g.push(x);
                else if ("s" === c[f]) x = d(y, x), g.push(x);
                else if ("i" === c[f]) x = d(this.int_type, x), g.push(x);
                else if ("f" === c[f]) x = d(this.float_type, x), g.push(x);
                else if ("v" === c[f]) {
                    if (!this.is_vectormath) return;
                    ++f;
                    var h =
                    parseInt(c[f]);
                    (2 > h || 4 < h) && this.throwError("internal error: sub function " + e, null);
                    h = this.vec_type_def[h];
                    x = d(h.name, x, h);
                    g.push(x)
                } else if ("m" === c[f]) {
                    if (!this.is_vectormath) return;
                    ++f;
                    h = parseInt(c[f]);
                    (2 > h || 4 < h) && this.throwError("internal error: sub function " + e, null);
                    h = this.mat_type_def[h];
                    x = d(h.name, x, h);
                    g.push(x)
                } else "[" === c[f] && (h = c.indexOf("]"), (0 > h || h === f + 1) && this.throwError("internal error: sub function " + e, null), x = d(this.float_type, x), x.is_array = !0, x.size = parseInt(c.substr(f + 1, h - 1 - f)), g.push(x),
                    f = h)
            }
            if (f < c.length - 1 && ")" === c[f]) {
                ++f;
                if ("f" === c[f]) a = this.float_type_def;
                else if ("i" === c[f]) a = this.int_type_def;
                else if ("v" === c[f]) {
                    if (!this.is_vectormath) return;
                    ++f;
                    h = parseInt(c[f]);
                    (2 > h || 4 < h) && this.throwError("internal error: sub function " + e, null);
                    a = this.vec_type_def[h]
                } else if ("m" === c[f]) {
                    if (!this.is_vectormath) return;
                    ++f;
                    h = parseInt(c[f]);
                    (2 > h || 4 < h) && this.throwError("internal error: sub function " + e, null);
                    a = this.mat_type_def[h]
                } else throw "internal: unknown sub return type " + c[f];
                f < c.length - 1 &&
                "c" === c[f + 1] && (b = !0)
            }
        }
        g = new k(e, q, g, a);
        g.is_const = b;
        this.sub_function[e] ? this.sub_function[e].push(g) : this.sub_function[e] = [g]
    };
    b.prototype.function_start = function() {
        this.function_var.scope_start();
        this.function_autovar.scope_start();
        this.function_reserved_var.scope_start();
        this.declared_function.scope_start();
        this.scope_index_stack.push(this.current_scope_index);
        this.scope_index_stack.push(this.unique_scope_index);
        this.unique_scope_index = this.current_scope_index = 0;
        this.current_return_type.push(this.float_type_def);
        this.scope_start()
    };
    b.prototype.function_end = function() {
        this.scope_end();
        this.current_return_type.pop();
        this.unique_scope_index = this.scope_index_stack.pop();
        this.current_scope_index = this.scope_index_stack.pop();
        this.declared_function.scope_end();
        this.function_reserved_var.scope_end();
        this.function_autovar.scope_end();
        this.function_var.scope_end()
    };
    b.prototype.scope_start = function() {
        this.declared_const.scope_start();
        this.declared_struct.scope_start();
        this.declared_var.scope_start();
        this.scope_index_stack.push(this.current_scope_index);
        this.current_scope_index = ++this.unique_scope_index
    };
    b.prototype.scope_end = function() {
        this.current_scope_index = this.scope_index_stack.pop();
        this.declared_var.scope_end();
        this.declared_struct.scope_end();
        this.declared_const.scope_end()
    };
    b.LanguageKc = 0;
    b.LanguageCpp = 1;
    b.LanguageJs = 2;
    b.LanguageAsmJs = 3;
    b.LanguageGLSL = 4;
    b.MaxInlineArray = 9;
    b.MaxInlineDup = 4;
    b.StateNone = 0;
    b.StateFunctionScope = 1;
    b.StateNoBreak = 2;
    b.StateNoSemicolon = 3;
    b.StatePassByRef = 4;
    b.StateAllowBool = 5;
    b.prototype.getIndent = function() {
        this.new_line = !1;
        for (var c = "", a = 0; a < this.indent; a++) c += "  ";
        return c
    };
    b.prototype.getIndentOpt = function() {
        var c = "";
        if (this.new_line) {
            this.new_line = !1;
            for (var a = 0; a < this.indent; a++) c += "  "
        }
        return c
    };
    b.prototype.printEnumKc = function(c) {
        (0 >= c.children.length || "scope" !== c.children[0].type || 0 >= c.children[0].length) && this.throwError("invalid enum scope", c);
        var a = "";
        c = c.children[0].children;
        for (var g = 0; g < c.length; ++g) {
            this.new_line && (a += this.getIndent());
            a += "enum{\n";
            ++this.indent;
            this.new_line = !0;
            for (var b = c[g].children,
                e = 0; e < b.length; ++e) {
                var f = b[e];
            this.new_line && (a += this.getIndent());
            "assign" === f.type ? (a += f.children[0].value + " = ", a += this.printConstExpr(f.children[1])) : "term" === f.type ? a += f.value : this.throwError("printEnumKc: expected term or assign", f);
            e < b.length - 1 && (this.new_line = !0, a += ",\n" + this.getIndent())
                }--this.indent;
                this.new_line = !0;
                a += "\n" + this.getIndent() + "};\n";
                this.new_line = !0
        }
        return a
    };
    b.prototype.storeEnum = function(c, a) {
        (0 >= c.children.length || "scope" !== c.children[0].type || 0 >= c.children[0].length) &&
        this.throwError("invalid enum scope", c);
        var g, b = !1,
        e = !1;
        a && (g = "", e = !0);
        for (var f = c.children[0].children, d = 0; d < f.length; ++d)
            for (var h = f[d].children, l = 0, m = 0; m < h.length; ++m) {
                var k = h[m],
                n, p = null,
                w = !1;
                "assign" === k.type ? ("=" === k.value && 2 === k.children.length && "term" === k.children[0].type || this.throwError("invalid enum assignment", k), n = k.children[0].value, p = k.children[1], l = this.evaluateConstExpr(p)) : ("term" !== k.type && this.throwError("invalid enumerator", k), n = k.value, w = !0);
                void 0 !== this.declared_const.get(n) &&
                this.throwError("const. " + n + " already defined", k);
                a && (parseInt(l) === l || this.is_kc ? (e && (this.new_line && (g += this.getIndent()), g += "enum{", ++this.indent), b && (g += ","), this.new_line = !0, g += "\n" + this.getIndent(), g = p ? g + (n + " = " + this.printConstExpr(p)) : 0 !== l && w ? g + n : g + (n + " = " + l), e = !1, b = !0) : (e || (--this.indent, this.new_line = !0, g += "\n" + this.getIndent() + "};\n", this.new_line = !0), this.new_line && (g += this.getIndent()), g += "#define " + n + " (", g = p ? g + this.printConstExpr(p) : g + l, g += ")\n", e = this.new_line = !0, b = !1));
                this.declared_const.push(n,
                                         l);
                l += 1
            }
            if (a) return e || (--this.indent, this.new_line = !0, g += "\n" + this.getIndent() + "};\n", this.new_line = !0), g
    };
        b.StructField = e;
        b.prototype.getArray = function(c, q, g, e) {
            var b = c;
            for (g.push(q);;) {
                "index" !== b.type && 2 != b.children.length && this.throwError("invalid array definition", b);
                c = a(b.children[0]);
                "term" !== c.type && "index" !== c.type && this.throwError("expected array name", b);
                b = b.children[1];
                b = {
                    node: b,
                    value: this.evaluateConstExpr(b),
                    is_ceil: !1
                };
                b.value !== parseInt(b.value) && (b.value = Math.ceil(b.value), b.is_ceil = !0);
                e.push(b);
                q *= b.value;
                g.push(q);
                if ("term" === c.type) return c.value;
                b = c
            }
        };
        b.prototype.createStructField = function(c, a) {
            var g = null,
            td = this.typed_array_type_defs[a];
            td ? this.is_js || this.throwError("fixed-width type '" + a + "' is only supported for JS output (found " + (this.is_glsl ? "GLSL" : this.is_cpp ? "C++" : this.is_kc ? "KenC" : "this") + ")", c) : a !== this.float_type && a !== this.int_type && ((g = this.declared_struct.get(a)) || this.throwError("struct " + a + " is undefined", c));
            g = new e(a, g);
            td && (g.is_typed_array = !0, g.typed_type_def = td);
            "term" === c.type ? g.name = c.value : "index" === c.type ? (g.is_array = !0, g.name = this.getArray(c, g.type_struct ? g.type_struct.size : 1, g.offsets, g.dimensions), g.size = g.offsets[g.offsets.length - 1]) : this.throwError("invalid struct field definition", c);
            return g
        };
        b.prototype.storeStruct = function(c) {
            var a = c.value;
            void 0 !== this.declared_struct.get(a) && this.throwError("struct " + a + ": redefinition", c);
            var g = new l(a, !1, 0);
            if (2 < c.children.length) this.throwError("struct: only single inheritance is supported", c);
            else if (2 == c.children.length) {
                "parent" !== c.children[1].type && this.throwError("struct: invalid parent definition", c);
                var b = this.declared_struct.get(c.children[1].value);
                if (void 0 !== b) {
                    g.parent = b;
                    for (var e = 0; e < b.fields.length; ++e) {
                        var f = b.fields[e];
                        g.fields.push(f)
                    }
                    g.size += g.parent.size
                } else this.throwError("struct: undeclared parent", c)
            }
            c = c.children[0];
            for (e = 0; e < c.children.length; ++e)
                if (b = c.children[e], "term" === b.type || "index" === b.type) f = this.createStructField(b, this.float_type), g.size += f.size, g.fields.push(f);
                else {
                    "block" === b.type && 0 < b.children.length && "var" === b.children[0].type && (1 !== b.children.length && this.throwError("struct: one block per type expected", b), b = b.children[0]);
                    var d;
                    "block" === b.type ? d = this.float_type : "var" === b.type ? d = b.value :
                    this.throwError("struct: invalid struct member", b);
                    for (var h = 0; h < b.children.length; ++h) f = b.children[h], "term" !== f.type && "index" !== f.type && this.throwError("struct: invalid member", f), f = this.createStructField(f, d), g.size += f.size, g.fields.push(f), g.new_fields.push(f)
                }
                var utd = g.fields.length ? g.fields[0].typed_type_def || null : null;
                for (var uti = 1; utd && uti < g.fields.length; ++uti) g.fields[uti].typed_type_def === utd || (utd = null);
                g.uniform_typed_def = utd;
                this.declared_struct.push(a, g);
                    return g
        };
        b.prototype.printDimensions = function(c) {
            for (var a = "", g = c.length - 1; 0 <= g; --g) {
                var b = c[g];
                b.is_ceil ? a = this.is_kc ? a + ("[ceil(" + this.printConstExpr(b.node) + ")]") : a + ("[" + b.value + "]") : this.is_glsl ? (this.print_expr_type.push(1),
                                                                                                                                               a += "[" + this.printConstExpr(b.node) + "]", this.print_expr_type.pop()) : a += "[" + this.printConstExpr(b.node) + "]"
            }
            return a
        };
        b.prototype.printStruct = function(c, a) {
            var g = "";
            if (this.is_kc) g += "struct {\n";
            else {
                for (var g = g + ("struct " + c.value), b = 1; b < c.children.length; ++b) {
                    var e = c.children[b];
                    "parent" !== e.type && this.throwError("struct: invalid parent definition", e);
                    1 == b && (g += " : public ");
                    g += e.value;
                    b < c.children.length - 1 && (g += ", ")
                }
                g += " {\n"
            }
            this.new_line = !0;
            ++this.indent;
            for (var e = this.is_cpp_or_glsl ? "" : this.float_type,
                f = this.is_cpp_or_glsl ? a.new_fields : a.fields, b = 0; b < f.length; ++b) {
                var d = f[b],
                h = d.type;
            0 < b && (h === e ? g += "," : (g += ";\n", this.new_line = !0));
            this.new_line && (g += this.getIndent());
            if (h !== e) {
                if (this.is_cpp_or_glsl || h !== this.float_type) g += h + " ";
                e = h
            }
            g += d.name;
            d.is_array && (g += this.printDimensions(d.dimensions))
                }
                this.is_cpp_or_glsl && 0 < f.length && (g += ";");
                --this.indent;
                this.new_line = !0;
                g += "\n" + this.getIndent() + "}";
                this.is_kc && (g += " " + c.value);
                this.new_line = !0;
                return g + ";\n"
        };
        b.prototype.storeStatic = function(c, a) {
            1 >
            c.children.length && this.throwError("invalid static syntax", c);
            var g = c.children[0];
            ("block" !== g.type || 1 > g.children.length) && this.throwError("invalid static block", g);
            var b, e = !1;
            a && (b = "");
            var f, d = g.children[0];
            "var" === d.type ? (f = d.value, g = d) : f = this.float_type;
            for (d = 0; d < g.children.length; ++d) {
                var h = g.children[d],
                l = this.createVariable(f, h, !0, !1, !1),
                m = l.name + "$" + this.current_scope_index;
                this.is_js && (l.name_wsi = m);
                void 0 === this.declared_var.get(l.name) && void 0 === this.function_autovar.get(l.name) || this.throwError("variable " +
                l.name + " already defined", h);
                void 0 !== this.function_var.get(m) && this.throwError("internal generator error: scope var " + m + " not unique", h);
                this.declared_var.push(l.name, l);
                this.function_var.push(m, l);
                this.function_reserved_var.push(l.name, l);
                a ? (b = e ? b + ", " : b + "static ", b += this.printVariable(l, !e, !1, h), e = !0) : this.is_js && l.is_static && l.assign_node && (l.assign_value = this.printAssignNode(l.assign_node))
            }
            if (a) return this.new_line = !0, b + ";\n"
        };
            b.prototype.storeAutoVar = function(c) {
                var a = c.value;
                return void 0 ===
                this.declared_var.get(a) && void 0 === this.function_autovar.get(a) ? (c = this.createVariable(this.float_type, c, !1, !1, !0), this.function_autovar.push(a, c), !0) : !1
            };
            b.prototype.getFunc = function(c) {
                var a = c.children[0].value,
                g = this.findSubFunction(a, c.children[1]);
                if (g) return g;
                (g = this.declared_function.get(a)) || this.throwError("call to undeclared function " + a, c);
                return g
            };
            b.prototype.getVar = function(c) {
                var a = this.declared_var.get(c);
                void 0 === a && (a = this.function_autovar.get(c));
                return a
            };
            b.prototype.storeVar =
            function(c) {
                for (var q = c.value, g = "", b = !0, e = 0; e < c.children.length; ++e) {
                    var f = c.children[e],
                    d = this.createVariable(q, f, !1, !1, !1),
                    h = d.name + "$" + this.current_scope_index;
                    if (this.is_js && d.is_ref && (d.type === this.float_type || d.type === this.int_type)) {
                        var l = a(d.assign_node.children[1]);
                        "term" === l.type && (l = this.getVar(l.value), void 0 === l && this.throwError("reference to undeclared variable" + rev_name, f), l.is_ref || (d.is_ref = !1, d.ref_alias = l))
                    }
                    d.is_ref && !d.ref_alias && (d.is_func_arg = !0);
                    this.is_js && (d.name_wsi = h);
                    void 0 ===
                    this.declared_var.get(d.name) && void 0 === this.function_autovar.get(d.name) || this.throwError("variable " + d.name + " already defined", f);
                    void 0 !== this.function_var.get(h) && this.throwError("internal generator error: scope var " + h + " not unique", f);
                    this.declared_var.push(d.name, d);
                    this.function_var.push(h, d);
                    this.function_reserved_var.push(d.name, d);
                    d.ref_alias ? (d.name = d.ref_alias.name, d.name_wsi = d.ref_alias.name_wsi) : (g += this.printVariable(d, b, !1, f), b = !1, e < c.children.length - 1 && (g += ", "))
                }
                return g
            };
            b.prototype.getComplexTerm =
            function(c) {
                for (var a = null, g = [], b = c;;)
                    if (b || this.throwError("internal error: no field node", c), "member" === b.type || "index" === b.type) 2 !== b.children.length && this.throwError("invalid " + b.type + " node", b), g.push(new r(b)), b = b.children[0];
                    else if ("term" === b.type) {
                        0 !== b.children.length && this.throwError("invalid term node", b);
                        a = b;
                        break
                    } else this.throwError("invalid term node, expected member or index", b);
                    c = a.value;
                void 0 !== this.sub_term[c] && this.throwError("invalid complex term " + c, b);
                b = this.declared_var.get(c);
                void 0 === b && (b = this.function_autovar.get(c), void 0 === b && this.throwError("object or array " + c + " is undefined", a));
                for (var a = b, e = 0, f = a.size, d = !1, h = null, l = g.length - 1; 0 <= l; --l)
                    if (f = g[l], d = f.node, f.is_index)
                        if (a.is_array) ++e, h = a.dimensions.length - e, 0 > h && this.throwError("array " + a.name + " dimension is " + a.dimensions.length + ", but " + e + " was given", d), d = a.offsets[h], f = f.size = d, h = a.type_struct, d = e === a.dimensions.length ? !1 : !0;
                        else {
                            h = 0;
                            this.is_vectormath && this.mat_type_def && (b.type_struct === this.mat_type_def[2] ?
                            h = 2 : b.type_struct === this.mat_type_def[3] ? h = 3 : b.type_struct === this.mat_type_def[4] && (h = 4));
                            0 === h && (a !== b ? this.throwError("field of term " + c + " is not an array", d) : this.throwError("term " + c + " is not an array", d));
                            (e = a.type_struct) || (a !== b ? this.throwError("field of term " + c + " is not an object", d) : this.throwError("term " + c + " is not an object", d));
                            d = d.children[1];
                            "numeric" !== d.type && this.throwError("expected constant index in " + e.name + " term", d);
                            var m = parseInt(d.value);
                            (0 > m || m >= h) && this.throwError("expected index in range [0.." +
                            (h - 1) + "] in " + e.name + " term", d);
                            for (h = k = 0; h < m; ++h) k += a.size;
                            h >= e.fields.length && this.throwError("internal error", d);
                            a = e.fields[h];
                            f.size = a.size;
                            f.member_offset = k;
                            e = 0;
                            f = a.size;
                            h = a.type_struct;
                            d = !1
                        }
                        else {
                            a.is_array && e !== a.dimensions.length && this.throwError("array " + a.name + " dimension is " + a.dimensions.length + ", but " + e + " was given", d);
                            (e = a.type_struct) || (a !== b ? this.throwError("field of term " + c + " is not an object", d) : this.throwError("term " + c + " is not an object", d));
                            for (var m = d.children[1].value, k = 0,
                                h = 0; h < e.fields.length; ++h) {
                                a = e.fields[h];
                            if (a.name === m) break;
                            k += a.size
                                }
                                h >= e.fields.length && this.throwError("" + m + " is not a member of " + e.name, d);
                                f.size = a.size;
                                f.member_offset = k;
                                e = 0;
                                f = a.size;
                                h = a.type_struct;
                                d = !1
                        }
                        h || (a.type === this.int_type ? h = this.int_type_def : a.type === this.float_type ? h = this.float_type_def : this.typed_array_type_defs[a.type] && (h = this.typed_array_type_defs[a.type]));
                        return {
                            v: b,
                            field_list: g,
                            size: f,
                            is_array: d,
                            type_def: h
                        }
            };
            b.prototype.printComplexTerm = function(c, a, g) {
                var b = "",
                e = this.getComplexTerm(c),
                f = e.field_list,
                d = e.v,
                h = e.size,
                l = e.is_array,
                m = e.type_def,
                k =
                "",
                n = !1;
                if (this.is_js)
                    for (e = f.length - 1; 0 <= e; --e) {
                        var p = f[e],
                        w = p.node;
                        p.is_index ? (n && (k += "+"), k += "(" + this.printExpr(p.node.children[1]) + ")", 1 !== p.size && (k += "*" + p.size)) : (n && (k += "+"), k += p.member_offset);
                        n = !0
                    }
                    a ? (a[0] = h, a[1] = l, a[2] = m) : m ? m.is_algebraic && !l || this.throwError("expected algebraic term", c) : this.throwError("internal error: complex term has no type", c);
                if (this.is_js) k.length || (k = "0"), d.is_func_arg && (d.is_ref || d.is_object || d.is_array) ? (f = "0" !== k ? "+" + k : "", b = g && d.is_ref || 1 !== h ? b + (d.name_wsi + "$ref," +
                    d.name_wsi + "$ofs" + f) : b + (d.name_wsi + "$ref[" + d.name_wsi + "$ofs" + f + "]")) : g ? (!g || d.is_object || d.is_array || d.is_ref || this.throwError("expected object or array or reference", c), d.is_ref ? (b += d.name_wsi + "$ref," + d.name_wsi + "$ofs", "0" !== k && (b += "+" + k)) : b += d.name_wsi + "," + k) : 1 !== h ? b = a ? b + (d.name_wsi + "," + k) : b + ("$dup(" + h + "," + d.name_wsi + "," + k + ")") : 1 === h ? (b += d.name_wsi, b += "[" + k + "]") : (b += d.name_wsi, b += "," + k);
                else
                    for (b += d.name_wsi, e = f.length - 1; 0 <= e; --e) p = f[e], w = p.node, p.is_index ? (g = w.children[1], d = this.isIntExpr(g), this.is_glsl ?
                        (d || this.throwError("indices must be integers", w), b += "[", this.print_expr_type.push(1), b += this.printExpr(g), this.print_expr_type.pop(), b += "]") : this.is_kc || d ? (b += "[", b += this.printExpr(g), b += "]") : (b += "[(int)(", b += this.printExpr(g), b += ")]")) : b += "." + w.children[1].value;
                return b
            };
            b.prototype.getNodeInfo = function(c) {
                if (c.type_def) return c;
                var a = this.any_type_def,
                g = null,
                b = !1;
                switch (c.type) {
                    case "string":
                        a = this.string_type_def;
                        break;
                    case "group":
                        var e = c.children.length;
                        if (0 < e) {
                            var d = this.getNodeInfo(c.children[e -
                            1]),
                            a = d.type_def,
                            g = d.array_def;
                            1 === e && (b = d.is_const)
                        }
                        break;
                    case "unary":
                        switch (c.value) {
                            case "++":
                            case "--":
                                d = this.getNodeInfo(c.children[0]);
                                a = d.type_def;
                                g = d.array_def;
                                break;
                            case "+":
                            case "-":
                                d = this.getNodeInfo(c.children[0]);
                                a = d.type_def;
                                g = d.array_def;
                                b = d.is_const;
                                break;
                            case "!":
                                (d = this.getNodeInfo(c.children[0])) && d.is_complex && this.throwError("unary operator " + c.value + " failed, expected numeric term", c), a = this.int_type_def;
                                break;
                            case "~":
                                (d = this.getNodeInfo(c.children[0])) && d.is_complex && this.throwError("unary operator " + c.value + " failed, expected numeric term", c), a = this.int_type_def
                        }
                        break;
                            case "postop":
                                switch (c.value) {
                                    case "++":
                                    case "--":
                                        d = this.getNodeInfo(c.children[0]),
                                        a = d.type_def, g = d.array_def
                                }
                                break;
                                    case "operator":
                                        var e = this.getNodeInfo(c.children[0]),
                                        d = this.getNodeInfo(c.children[1]),
                                        h = e.type_def,
                                        l = d.type_def;
                                        h.is_algebraic && l.is_algebraic || this.throwError("operator " + c.value + " failed, expected algebraic terms", c);
                                        (e.array_def || d.array_def) && this.throwError("operator " + c.value + " failed, expected non-array terms", c);
                                        switch (c.value) {
                                            case "<":
                                            case ">":
                                            case "<=":
                                            case ">=":
                                            case "||":
                                            case "&&":
                                                1 === h.size && 1 === l.size || this.throwError("operator " + c.value + " failed, expected numerical terms",
                                                                                                c);
                                                a = this.bool_type_def;
                                                break;
                                            case "==":
                                            case "!=":
                                                a = this.bool_type_def;
                                                break;
                                            case "&":
                                            case "|":
                                            case "<<":
                                            case ">>":
                                                1 === h.size && 1 === l.size || this.throwError("operator " + c.value + " failed, expected numerical terms", c);
                                                a = this.int_type_def;
                                                break;
                                            case "/":
                                                h === this.int_type_def && l === this.int_type_def && !this.suppress_int_div_check && this.throwError("'/' between two int operands would perform real (non-truncating) division here -- unlike C, RiceScript's int is not enforced at runtime. Wrap it in int(a / b) for truncating (C-style) division, or cast one side to double, e.g. a / double(b), for real division.", c);
                                            case "*":
                                            case "+":
                                            case "-":
                                            case "%":
                                                a = h === l ? h : u(this, h) && u(this, l) ? h === this.float_type_def || l === this.float_type_def ? this.float_type_def : this.int_type_def : 1 === h.size ? l : 1 === l.size ? h : h.size < l.size ? h : l;
                                                b = e.is_const && d.is_const;
                                                break;
                                            case "^":
                                                1 !== l.size && this.throwError("power exponent must be numerical value",
                                                                                c), a = h, b = e.is_const && d.is_const
                                        }
                                        break;
                                            case "cond":
                                                e = this.getNodeInfo(c.children[1]);
                                                d = this.getNodeInfo(c.children[2]);
                                                h = e.type_def;
                                                l = d.type_def;
                                                h === l ? a = h : u(this, h) && u(this, l) ? a = h === this.float_type_def && l === this.float_type_def ? this.float_type_def : this.int_type_def : this.throwError("conditional statement ? has incompatible operands", c);
                                                b = this.getNodeInfo(c.children[0]).is_const && e.is_const && d.is_const;
                                                break;
                                            case "numeric":
                                                a = 0 <= c.value.indexOf("x") || 0 <= c.value.indexOf("X") ? this.int_type_def : 0 > c.value.indexOf(".") && 0 > c.value.toLowerCase().indexOf("e") ?
                                                this.int_type_def : this.float_type_def;
                                                b = !0;
                                                break;
                                            case "call":
                                                var castName = c.children[0].value,
                                                isCastCall = "int" === castName || "double" === castName;
                                                isCastCall && (this.suppress_int_div_check = (this.suppress_int_div_check || 0) + 1);
                                                e = this.getFunc(c);
                                                isCastCall && --this.suppress_int_div_check;
                                                e.ret_type && (a = e.ret_type);
                                                if (e.is_const)
                                                    for (b = !0, e = c.children[1].children, d = 0; d < e.length; ++d)
                                                        if (!this.getNodeInfo(e[d]).is_const) {
                                                            b = !1;
                                                            break
                                                        } break;
                                            case "index":
                                            case "member":
                                                e = this.getComplexTerm(c);
                                                e.type_def && (a = e.type_def);
                                                e.is_array && (g = new f(e.size));
                                                break;
                                            case "term":
                                                e = this.getTermType(c), e.type_def && (a = e.type_def), e.array_def && (g = e.array_def), b = e.is_const
                }
                c.type_def = a;
                c.array_def = g;
                c.is_const = b;
                return c
            };
            b.prototype.isIntExpr = function(c) {
                switch (c.type) {
                    case "group":
                        var a = c.children.length;
                        if (this.is_glsl && 1 !== a) break;
                        return this.isIntExpr(c.children[a - 1]);
                    case "unary":
                        switch (c.value) {
                            case "-":
                                return this.isIntExpr(c.children[0])
                        }
                        break;
                            case "operator":
                                switch (c.value) {
                                    case "%":
                                    case "*":
                                    case "+":
                                    case "-":
                                        return a = this.isIntExpr(c.children[0]), c = this.isIntExpr(c.children[1]), a && c
                                }
                                break;
                                    case "numeric":
                                        return 0 <= c.value.indexOf("x") || 0 <= c.value.indexOf("X") ? !0 : 0 > c.value.indexOf(".") && 0 > c.value.toLowerCase().indexOf("e");
                                    case "term":
                                        a = this.sub_term[c.value];
                                        if (void 0 !== a) break;
                                        a = this.declared_const.get(c.value);
                    if (void 0 !== a) return a === parseInt(a);
                    a = this.declared_var.get(c.value);
                    void 0 === a && (a = this.function_autovar.get(c.value));
                    if (void 0 !== a) return a.type === this.int_type && 1 === a.size
                }
                return !1
            };
            b.prototype.evaluateConstExpr = function(c) {
                var a;
                switch (c.type) {
                    case "group":
                        return 1 !== c.children.length && this.throwError("evaluateConstExpr: invalid () group", c), this.evaluateConstExpr(c.children[0]);
                    case "unary":
                        var g = this.evaluateConstExpr(c.children[0]);
                        switch (c.value) {
                            case "+":
                                a =
                                g;
                                break;
                            case "-":
                                a = -g;
                                break;
                            default:
                                this.throwError("evaluateConstExpr: invalid unary operator", c)
                        }
                        return a;
                            case "operator":
                                var g = this.evaluateConstExpr(c.children[0]),
                                b = this.evaluateConstExpr(c.children[1]);
                                switch (c.value) {
                                    case "^":
                                        a = Math.pow(g, b);
                                        break;
                                    case "%":
                                        a = g - b * Math.floor(g / b);
                                        break;
                                    case "*":
                                        a = g * b;
                                        break;
                                    case "/":
                                        a = g / b;
                                        break;
                                    case "+":
                                        a = g + b;
                                        break;
                                    case "-":
                                        a = g - b;
                                        break;
                                    case "<<":
                                        a = g << b;
                                        break;
                                    case ">>":
                                        a = g >> b;
                                        break;
                                    default:
                                        this.throwError("evaluateConstExpr: invalid operator", c)
                                }
                                return a;
                                    case "numeric":
                                        return 0 <= c.value.indexOf("x") || 0 <= c.value.indexOf("X") ?
                                        parseInt(c.value) : parseFloat(c.value);
                                    case "call":
                                        g = c.children[0].value;
                                        b = c.children[1];
                                        switch (g) {
                                            case "ceil":
                                                g = this.evaluateConstExpr(b.children[0]);
                                                a = Math.ceil(g);
                                                break;
                                            case "floor":
                                                g = this.evaluateConstExpr(b.children[0]);
                                                a = Math.floor(g);
                                                break;
                                            case "sqrt":
                                                g = this.evaluateConstExpr(b.children[0]);
                                                a = Math.sqrt(g);
                                                break;
                                            case "sin":
                                                g = this.evaluateConstExpr(b.children[0]);
                                                a = Math.sin(g);
                                                break;
                                            case "cos":
                                                g = this.evaluateConstExpr(b.children[0]);
                                                a = Math.cos(g);
                                                break;
                                            case "tan":
                                                g = this.evaluateConstExpr(b.children[0]);
                                                a = Math.tan(g);
                                                break;
                                            case "atan":
                                                g = this.evaluateConstExpr(b.children[0]);
                                                a = Math.atan(g);
                                                break;
                                            case "atan2":
                                                g = this.evaluateConstExpr(b.children[0]);
                                                b = this.evaluateConstExpr(b.children[1]);
                                                a = Math.atan2(g, b);
                                                break;
                                            case "int":
                                                g = this.evaluateConstExpr(b.children[0]);
                                                a = parseInt(g);
                                                break;
                                            case "double":
                                            case "float":
                                                a = this.evaluateConstExpr(b.children[0]);
                                                break;
                                            default:
                                                this.throwError("evaluateConstExpr: invalid function " + g, c)
                                        }
                                        return a;
                                            case "term":
                                                return a = this.declared_const.get(c.value), void 0 === a && this.throwError("unknown enum term " +
                                                c.value, c), a
                }
                this.throwError("evaluateConstExpr: bad expr", c)
            };
            b.prototype.printConstExpr = function(c) {
                var b = "";
                switch (c.type) {
                    case "group":
                        1 !== c.children.length && this.throwError("printConstExpr: invalid () group", c);
                        b += c.value[0];
                        b += this.printConstExpr(c.children[0]);
                        b += c.value[1];
                        break;
                    case "operator":
                        if (this.is_kc || "^" !== c.value) b += this.printConstExpr(c.children[0]) + c.value + this.printConstExpr(c.children[1]);
                        else {
                            var g = a(c.children[0]);
                            if ("term" !== g.type && "numeric" !== g.type || "numeric" !== c.children[1].type ||
                                "2" !== c.children[1].value && "3" !== c.children[1].value) b += this.evaluateConstExpr(c);
                            else {
                                for (var g = parseInt(c.children[1].value), b = b + "(", e = 0; e < g; e++) b += this.printConstExpr(c.children[0]), e < g - 1 && (b += "*");
                                b += ")"
                            }
                        }
                        break;
                    case "numeric":
                        b += this.printNumeric(c.value);
                        break;
                    case "call":
                        this.is_kc ? ((g = this.findSubFunction(c.children[0].value, c.children[1])) ? b += g.code_name : this.throwError("printConstExpr: built-in function call expected", c), b += this.printConstExpr(c.children[1])) : b += this.evaluateConstExpr(c);
                        break;
                    case "term":
                        g = this.sub_term[c.value];
                        void 0 !== g ? b += g.name : this.is_js || this.is_glsl ? (g = this.declared_const.get(c.value), b = void 0 !== g ? b + ("(" + this.printNumeric(g) + ")") : b + c.value) : b += c.value;
                        break;
                    case "unary":
                        "+" === c.value ? b += this.printConstExpr(c.children[0]) : "-" === c.value ? b += c.value + this.printConstExpr(c.children[0]) : this.throwError("printConstExpr: invalid unary operator " + c.value, c);
                        break;
                    default:
                        this.throwError("expected constant expr.", c)
                }
                return b
            };
            b.prototype.printTerm = function(c, a, b, e) {
                var d =
                "",
                f = this.sub_term[c.value];
                if (void 0 !== f) d += f.name;
                else if (f = this.declared_const.get(c.value), void 0 !== f) d = this.is_cpp || this.is_kc ? d + c.value : d + ("(" + this.printNumeric(f) + ")"), b && (b[0] = 1, b[1] = !1, b[2] = f === parseInt(f) ? this.int_type_def : this.float_type_def);
                else if (a && this.storeAutoVar(c)) d += c.value, b && (b[0] = 1, b[1] = !1, b[2] = this.float_type_def);
                else {
                    a = c.value;
                    f = this.declared_var.get(a);
                    void 0 === f ? (f = this.function_autovar.get(a), void 0 === f && this.throwError("undefined variable " + a, c)) : a = f.name_wsi;
                    if (!e &&
                        !b && (f.is_array || f.is_object)) {
                        !f.is_array && f.type_struct && f.type_struct.is_algebraic || this.throwError("expected algebraic term", c);
                    if (this.is_js && f.is_ref) {
                        d += "[";
                        for (c = 0; c < f.size; ++c) 0 < c && (d += ","), d += a + "$ref[" + a + "$ofs", 0 < c && (d += "+" + c), d += "]";
                        d += "]"
                    } else d += a;
                    return d
                        }
                        this.is_js ? (d += a, f.is_func_arg && (f.is_ref || f.is_object || f.is_array) ? d = f.is_array || 1 !== f.size ? d + ("$ref," + a + "$ofs") : d + ("$ref[" + a + "$ofs]") : f.is_object && (d += ",0")) : d += a;
                        b ? (b[0] = f.size, b[1] = f.is_array, b[2] = f.type === this.int_type ? this.int_type_def : f.type === this.float_type ? this.float_type_def : !f.type_struct && f.is_auto ? this.float_type_def :
                        f.type_struct) : e || !f.is_array && !f.is_object || this.throwError("expected value term", c)
                }
                return d
            };
            b.prototype.getTermType = function(c) {
                var a = {
                    type_def: null,
                    array_def: null,
                    is_const: !1
                },
                b = c.value,
                e = this.sub_term[b];
                if (void 0 !== e) return a.type_def = this.float_type_def, a;
                e = this.declared_const.get(b);
                if (void 0 !== e) return e === parseInt(e) ? a.type_def = this.int_type_def : a.type_def = this.float_type_def, a.is_const = !0, a;
                e = this.declared_var.get(b);
                if (void 0 === e && (e = this.function_autovar.get(b), void 0 === e)) return this.throwError("undeclared variable " +
                    b, c), a;
                e.type === this.int_type ? a.type_def = this.int_type_def : e.type === this.float_type ? a.type_def = this.float_type_def : this.typed_array_type_defs[e.type] ? a.type_def = this.typed_array_type_defs[e.type] : e.type_struct && (a.type_def = e.type_struct);
                e.is_array && (a.array_def = new f(e.size));
                return a
            };
            b.prototype.isIntTerm = function(c) {
                if (!c) return !1;
                if ("term" !== c.type)
                    if ("index" === c.type || "member" === c.type) {
                        for (c = c.children[0]; c && "term" !== c.type;)
                            if ("index" === c.type || "member" === c.type) c = c.children[0];
                            else return !1;
                            if (!c) return !1
                    } else return !1;
                    c = c.value;
                if (void 0 !== this.sub_term[c]) return !1;
                var a = this.declared_var.get(c);
                void 0 === a && (a = this.function_autovar.get(c));
                return a && a.type === this.int_type ? !0 : !1
            };
            b.prototype.printLValue = function(c, a) {
                return "term" === c.type ? this.printTerm(c, !0, a) : "index" === c.type || "member" === c.type ? this.printComplexTerm(c, a) : this.printExpr(c)
            };
            b.prototype.printArrayDefinition = function(c) {
                for (var a = "", a = this.is_c_like ? a + "{" : a + "[", b = 0; b < c.children.length; ++b) {
                    0 < b && (a += ",");
                    var e = c.children[b],
                    a = "array" === e.type ? a + this.printArrayDefinition(e) : a + this.printConstExpr(e)
                }
                return a =
                this.is_c_like ? a + "}" : a + "]"
            };
            b.prototype.printRValue = function(c, a) {
                switch (c.type) {
                    case "assign":
                        return this.printAssign(c, a);
                    case "term":
                        return this.printTerm(c, !1, a);
                    case "index":
                    case "member":
                        return this.printComplexTerm(c, a)
                }
                this.getNodeInfo(c);
                var b = this.printExpr(c);
                a && (c.array_def ? (a[0] = c.array_def.size, a[1] = !0) : (a[0] = c.type_def.size, a[1] = !1), a[2] = c.type_def, this.is_js && 1 < a[0] && (b += ",0"));
                return b
            };
            b.prototype.printAssign = function(c, a) {
                !this.is_js && ("<<=" === c.value || ">>=" === c.value) && this.throwError("operator " + c.value + " is not supported for " + (this.is_glsl ? "GLSL" : this.is_cpp ? "C++" : this.is_kc ? "KenC" : "this") + " output (JS target only)", c);
                var b = [1, !1, null],
                e = [1, !1, null];
                if (this.is_glsl) {
                    var d = this.isIntTerm(c.children[0]) ||
                    this.isIntTerm(c.children[1]);
                    this.print_expr_type.push(d ? 1 : A)
                }
                var d = this.printLValue(c.children[0], b),
                f = c.children[1],
                h = !1;
                "assign" === f.type && (f = f.children[0], h = !0);
                f = this.printRValue(f, e);
                this.is_glsl && this.print_expr_type.pop();
                a && (a[0] = b[0], a[1] = b[1], a[2] = b[2]);
                (b[1] || e[1]) && this.throwError("opertor " + c.value + " failed, expected non-array terms", c);
                var l = b[0],
                m = e[0],
                b = b[2],
                e = e[2];
                b === this.int_type_def && e === this.float_type_def && this.throwError("operator " + c.value + " failed: assigning a double-valued expression to an int without an explicit cast is not allowed. Write int(<expr>) to truncate explicitly.", c);
                if (1 === l || this.is_c_like) {
                    1 === l && 1 !== m && this.throwError("left and right term has different size " + l + " != " + m, c);
                    1 !==
                    m && b && e && b.is_complex !== e.is_complex && this.throwError("left and right term has different type " + b.name + " != " + e.name, c);
                    if (this.is_cpp) {
                        if ("%=" === c.value && b === this.float_type_def) return d + " = libdraw._fmod(" + d + "," + f + ")";
                        if ("^=" === c.value) return d + " = pow(" + d + "," + f + ")"
                    } else if (this.is_glsl) {
                        if ("%=" === c.value && b === this.float_type_def) return d + " = mod(" + d + "," + f + ")";
                        if ("^=" === c.value) return d + " = pow(" + d + "," + f + ")"
                    } else if (this.is_js) {
                        if ("%=" === c.value && b === this.float_type_def) return d + " = $mod(" + d + "," + f + ")";
                        if ("^=" === c.value) return d + " = Math.pow(" + d + "," + f + ")"
                    }
                    return d + " " + c.value + " " + f
                }
                var k = "$copy";
                if ("=" !== c.value) {
                    b && e || this.throwError("internal error: operator " +
                    c.value + " failed, unknown type", c);
                    b.is_algebraic && e.is_algebraic || this.throwError("operator " + c.value + " failed, expected algebraic terms", c);
                    "^=" === c.value && this.throwError("operator " + c.value + " failed, not supported for vectors and matrices", c);
                    var n = !1;
                    b.is_matrix && 1 !== m || e.is_matrix && 1 !== l ? (1 !== l && 1 !== m && ("*=" !== c.value && this.throwError("operator " + c.value + " failed, not supported between vectors and matrices", c), b.is_matrix && e.is_matrix && m !== l && this.throwError("operator " + c.value + " failed, matrices must have the same rank",
                                                                                                                                                                                                                                                                c), b.is_matrix && !e.is_matrix && this.throwError("operator " + c.value + " failed, expected matrix on a right side", c), !b.is_matrix && e.is_matrix && m !== l * l && this.throwError("operator " + c.value + " failed, incompatible matrix, rank " + l + " expected", c)), k = k + "mat" + l, n = !0) : 4 >= l && (k += l, n = !0);
                                                                                                                                                                                                                                                                switch (c.value) {
                                                                                                                                                                                                                                                                case "+=":
                                                                                                                                                                                                                                                                k += "add";
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "*=":
                                                                                                                                                                                                                                                                k += "mul";
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "/=":
                                                                                                                                                                                                                                                                k += "div";
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "-=":
                                                                                                                                                                                                                                                                k += "sub";
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "%=":
                                                                                                                                                                                                                                                                k += "mod";
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                default:
                                                                                                                                                                                                                                                                this.throwError("operator " + c.value + " failed, unsupported", c)
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                k += m;
                                                                                                                                                                                                                                                                k = n ? k + "(" :
                                                                                                                                                                                                                                                                k + ("(" + l + ",")
                } else s(this, b, e) || this.throwError("left and right term has different type " + b.name + " != " + e.name, c), l !== m && this.throwError("left and right term has different size " + l + " != " + m, c), k = 4 >= l ? k + (l + "(") : k + ("(" + l + ",");
                return h ? "(" + this.printAssign(c.children[1]) + "," + k + d + "," + f + "))" : k + d + "," + f + ")"
            };
            b.prototype.printCall = function(c, b, g, e) {
                "group" !== c.type && this.throwError("expected function " + b + " arguments inside ()", c);
                if (!e) return g + this.printExpr(c);
                var d = e.length;
                d !== c.children.length && this.throwError("function " +
                b + " expects " + d + " arguments, " + c.children.length + " given", c);
                b = g + "(";
                for (g = 0; g < d; ++g) {
                    var f = a(c.children[g]),
                    h = e[g];
                    "unary" === f.type && "&" === f.value && (h.is_ref || this.throwError("unexpected &", c), f = f.children[0]);
                    if (!h.is_ref || h.is_object || h.is_array || "term" !== f.type)
                        if (h.is_ref || h.is_object || h.is_array)
                            if (h.is_ref || !h.is_object || h.is_array || !h.type_struct || !h.type_struct.is_algebraic || "unary" !== f.type && "operator" !== f.type && "call" !== f.type) {
                                var l = [1, !1, null];
                                b += this.printComplexTerm(f, l, !0);
                                if (h.size !==
                                    l[0] && (h.size > l[0] || 0 < this.warning_level)) this[h.size < l[0] ? "throwWarning" : "throwError"]("passed reference to object of size " + l[0] + ", " + h.size + " expected", c)
                            } else b += this.printExpr(f);
                            else b += this.printExpr(f);
                            else b += this.printTerm(f, !0);
                            g < d - 1 && (b += ",")
                }
                return b + ")"
            };
            b.prototype.printCallJS = function(c, e, g, f) {
                "group" !== c.type && this.throwError("expected function " + e + " arguments inside ()", c);
                if (!f) return g + this.printExpr(c);
                var d = f.length;
                d !== c.children.length && this.throwError("function " + e + " expects " +
                d + " arguments, " + c.children.length + " given", c);
                e = "";
                for (var h = 0, l = [], k = 0; k < d; ++k) {
                    var m = c.children[k],
                    n = f[k];
                    "unary" === m.type && "&" === m.value && (n.is_ref || this.throwError("unexpected &", c), m = m.children[0]);
                    !n.is_ref || n.is_object || n.is_array || "term" !== m.type || (n = this.getVar(m.value), n && n.is_ref || (h || (e += "("), e += "$ref.push(" + this.printTerm(m, !0) + "),", l.push(m), ++h))
                }
                0 < h && (e += "$val=");
                e += g + "(";
                for (k = g = 0; k < d; ++k) {
                    m = a(c.children[k]);
                    n = f[k];
                    "unary" === m.type && "&" === m.value && (m = m.children[0]);
                    if (n.is_ref &&
                        g < h && m === l[g]) e += "$ref,$ref.length-" + (h - g), ++g;
                    else if (n.is_ref || n.is_object || n.is_array)
                        if (n.is_ref || !n.is_object || n.is_array || !n.type_struct || !n.type_struct.is_algebraic || "unary" !== m.type && "operator" !== m.type && "call" !== m.type) {
                            var p = [1, !1, null];
                            e += this.printComplexTerm(m, p, !0);
                            if (n.size !== p[0] && (n.size > p[0] || 0 < this.warning_level)) this[n.size < p[0] ? "throwWarning" : "throwError"]("passed reference to object of size " + p[0] + ", " + n.size + " expected", c);
                            n.is_typed_array && p[2] !== n.typed_type_def && this.throwError("passed " + (p[2] && p[2].name || "unknown") + " array reference where " + n.typed_type_def.name + " array expected", c)
                        } else e += this.printExpr(m, b.StatePassByRef);
                        else e +=
                            this.printExpr(m);
                    k < d - 1 && (e += ",")
                }
                e += ")";
                if (0 < h) {
                    e += ",";
                    for (k = l.length - 1; 0 <= k; --k) m = l[k], e += this.printTerm(m, !0) + "=$ref.pop(),";
                    e += "$val)"
                }
                return e
            };
            b.prototype.printNumeric = function(c) {
                c = "" + c;
                if (this.is_glsl) {
                    var a = this.print_expr_type,
                    b = a.length;
                    1 > b && this.throwError("printNumeric: internal error");
                    a[b - 1] === A && 0 > c.indexOf(".") && 0 > c.indexOf("e") && (c += ".0")
                }
                return c
            };
            var z = {
                "==": !0,
                "!=": !0,
                "<": !0,
                "<=": !0,
                ">": !0,
                ">=": !0,
                "||": !0,
                "&&": !0
            };
            b.prototype.printExpr = function(c, e) {
                var g = this.new_line ? this.getIndent() :
                "";
            if (this.is_js && !e && "numeric" !== c.type && "term" !== c.type && (this.getNodeInfo(c), c.is_const)) return g += "(" + this.evaluateConstExpr(c) + ")";
            var f = e === b.StatePassByRef;
                switch (c.type) {
                    case "enum":
                        this.is_kc ? (g += this.printEnumKc(c), this.storeEnum(c)) : this.is_cpp ? g += this.storeEnum(c, !0) : this.storeEnum(c);
                        break;
                    case "group":
                        if (1 === c.children.length && f) g += this.printExpr(c.children[0], b.StatePassByRef), f = !1;
                        else {
                            g += c.value[0];
                            f && this.throwError("no comma inside () allowed", c);
                            var d, h = c.children.length;
                            for (d =
                                0; d < h - 1; ++d) g += this.printExpr(c.children[d]) + ",";
                            d < h && (g += this.printExpr(c.children[d], e === b.StateAllowBool ? e : 0));
                            g += c.value[1]
                        }
                        break;
                    case "operator":
                        h = c.children[0];
                        d = c.children[1];
                        var l = this.getNodeInfo(h).type_def,
                        m = this.getNodeInfo(d).type_def;
                        l.is_algebraic && m.is_algebraic || this.throwError("operator " + c.value + " failed, expected algebraic terms", c);
                        (h.array_def || d.array_def) && this.throwError("operator " + c.value + " failed, expected non-array terms", c);
                        !this.is_js && ("<<" === c.value || ">>" === c.value) && this.throwError("operator " + c.value + " is not supported for " + (this.is_glsl ? "GLSL" : this.is_cpp ? "C++" : this.is_kc ? "KenC" : "this") + " output (JS target only)", c);
                        if (this.is_js) {
                            var k = l.size,
                            n = m.size;
                            if (l.is_complex ||
                                m.is_complex) {
                                h = a(h);
                            d = a(d);
                            h = this.printExpr(h, 1 < k ? b.StatePassByRef : b.StateNone);
                            d = this.printExpr(d, 1 < n ? b.StatePassByRef : b.StateNone);
                            1 === k && 1 === n && this.throwError("internal error: operator " + c.value + " failed, expected complex terms", c);
                            var p = !1;
                            l.is_matrix && 1 !== n || m.is_matrix && 1 !== k ? ("*" !== c.value && this.throwError("operator " + c.value + " failed, not supported between vectors and matrices", c), l.is_matrix && m.is_matrix && n !== k && this.throwError("operator " + c.value + " failed, matrices must have the same rank",
                                                                                                                                                                                                                                                               c), l.is_matrix && !m.is_matrix && k !== n * n && this.throwError("operator " + c.value + " failed, incompatible matrix, rank " + n + " expected", c), !l.is_matrix && m.is_matrix && n !== k * k && this.throwError("operator " + c.value + " failed, incompatible matrix, rank " + k + " expected", c), p = !0) : 1 === k || 1 === n || k === n && s(this, l, m) || this.throwError("operator " + c.value + " failed, expected equal types or scalar term", c);
                                                                                                                                                                                                                                                               m = (p ? "$mat" : "$vec") + k;
                                                                                                                                                                                                                                                               l = !1;
                                                                                                                                                                                                                                                               switch (c.value) {
                                                                                                                                                                                                                                                                case "*":
                                                                                                                                                                                                                                                                k < n ? (m += "lmul", l = !0) : m += "mul";
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "/":
                                                                                                                                                                                                                                                                m += "div";
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "+":
                                                                                                                                                                                                                                                                m +=
                                                                                                                                                                                                                                                                "add";
                            break;
                                                                                                                                                                                                                                                                case "-":
                                                                                                                                                                                                                                                                m += "sub";
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "%":
                                                                                                                                                                                                                                                                m += "mod";
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "^":
                                                                                                                                                                                                                                                                1 !== n && this.throwError("operator " + c.value + " failed, expected scalar exponent", c);
                                                                                                                                                                                                                                                                m += "pow";
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                default:
                                                                                                                                                                                                                                                                this.throwError("operator " + c.value + " failed, unsupported", c)
                                                                                                                                                                                                                                                               }
                                                                                                                                                                                                                                                               k < n && !l && this.throwError("operator " + c.value + " failed, expected smaller term on a right-side", c);
                                                                                                                                                                                                                                                               g += m + n + "(" + h + "," + d + ")";
                                                                                                                                                                                                                                                               break
                                }
                        }
                        this.is_glsl && (k = this.isIntTerm(h) || this.isIntTerm(d), this.print_expr_type.push(k ? 1 : A));
                        if (this.is_kc || "^" !== c.value) "%" === c.value ? (m = null,
                            this.is_cpp ? m = this.isIntExpr(h) && this.isIntExpr(d) ? "libdraw._imod" : "libdraw._fmod" : this.is_glsl ? m = "mod" : this.is_js && (m = "$mod"), g = m ? g + (m + "(" + this.printExpr(h) + "," + this.printExpr(d) + ")") : g + (this.printExpr(h) + c.value + this.printExpr(d))) : this.is_cpp && "/" === c.value ? g += this.printExpr(h) + c.value + "(" + this.float_type + ")(" + this.printExpr(d) + ")" : this.is_glsl && "/" === c.value ? g += this.printExpr(h) + c.value + this.float_type + "(" + this.printExpr(d) + ")" : !this.is_js || "||" !== c.value && "&&" !== c.value ? g = this.is_js && e !== b.StateAllowBool &&
                            z[c.value] ? g + ("((" + this.printExpr(h, b.StateAllowBool) + c.value + this.printExpr(d, b.StateAllowBool) + ")|0)") : g + (this.printExpr(h) + c.value + this.printExpr(d)) : (h = l !== this.bool_type_def ? "Boolean(" + this.printExpr(h, b.StateAllowBool) + ")" : this.printExpr(h, b.StateAllowBool), d = m !== this.bool_type_def ? "Boolean(" + this.printExpr(d, b.StateAllowBool) + ")" : this.printExpr(d, b.StateAllowBool), g = e !== b.StateAllowBool ? g + ("((" + h + c.value + d + ")|0)") : g + (h + c.value + d));
                        else if (m = a(h), k = a(d), "term" !== m.type && "numeric" !== m.type ||
                            "numeric" !== k.type || "2" !== k.value && "3" !== k.value) g = this.is_cpp ? "numeric" !== k.type || "2" !== k.value && "3" !== k.value ? g + ("pow(" + this.printExpr(h) + "," + this.printExpr(d) + ")") : g + ("libdraw.pow" + k.value + "(" + this.printExpr(h) + ")") : this.is_glsl ? "numeric" !== k.type || "2" !== k.value && "3" !== k.value ? g + ("pow(" + this.printExpr(h) + "," + this.printExpr(d) + ")") : g + ("_pow" + k.value + "(" + this.printExpr(h) + ")") : "numeric" !== k.type || "2" !== k.value && "3" !== k.value ? g + ("Math.pow(" + this.printExpr(h) + "," + this.printExpr(d) + ")") : g + ("$pow" + k.value +
                            "(" + this.printExpr(h) + ")");
                        else {
                            m = parseInt(k.value);
                            g += "(";
                            for (d = 0; d < m; d++) g += this.printExpr(h), d < m - 1 && (g += "*");
                            g += ")"
                        }
                        this.is_glsl && this.print_expr_type.pop();
                        break;
                                                                                                                                                                                                                                                                case "assign":
                                                                                                                                                                                                                                                                g += this.printAssign(c);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "numeric":
                                                                                                                                                                                                                                                                g += this.printNumeric(c.value);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "string":
                                                                                                                                                                                                                                                                g = this.is_js && '"' === c.value[0] ? g + ('"' + c.value.substr(1, c.value.length - 2) + '"') : g + c.value;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "call":
                                                                                                                                                                                                                                                                var castName = c.children[0].value,
                                                                                                                                                                                                                                                                isCastCall = "int" === castName || "double" === castName;
                                                                                                                                                                                                                                                                isCastCall && (this.suppress_int_div_check = (this.suppress_int_div_check || 0) + 1);
                                                                                                                                                                                                                                                                h = this.getFunc(c);
                                                                                                                                                                                                                                                                isCastCall && --this.suppress_int_div_check;
                                                                                                                                                                                                                                                                g = this.is_js ? g + this.printCallJS(c.children[1], h.name, h.code_name, h.args) : g + this.printCall(c.children[1],
                                                                                                                                                                                                                                                                h.name, h.code_name, h.args);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "term":
                                                                                                                                                                                                                                                                g += this.printTerm(c, !1, null, f);
                                                                                                                                                                                                                                                                f = !1;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "unary":
                                                                                                                                                                                                                                                                !this.is_js && "~" === c.value && this.throwError("operator " + c.value + " is not supported for " + (this.is_glsl ? "GLSL" : this.is_cpp ? "C++" : this.is_kc ? "KenC" : "this") + " output (JS target only)", c);
                                                                                                                                                                                                                                                                h = c.children[0];
                                                                                                                                                                                                                                                                if ((l = this.getNodeInfo(h).type_def) && l.is_complex) {
                                                                                                                                                                                                                                                                if (l.is_algebraic && !l.is_matrix && ("-" === c.value || "+" === c.value)) {
                                                                                                                                                                                                                                                                "-" === c.value ? g = this.is_js ? g + ("$vec" + l.size + "neg(" + this.printExpr(h, b.StatePassByRef) + ")") : g + (" " + c.value + this.printExpr(h)) : f ? (g += this.printExpr(h, b.StatePassByRef), f = !1) : g += this.printExpr(h);
                                                                                                                                                                                                                                                                break
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                this.throwError("prefix operator " + c.value + " failed, expected value term",
                                                                                                                                                                                                                                                                c)
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                g += " " + c.value + this.printExpr(h);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "postop":
                                                                                                                                                                                                                                                                h = c.children[0];
                                                                                                                                                                                                                                                                (l = this.getNodeInfo(h).type_def) && l.is_complex && this.throwError("postfix operator " + c.value + " failed, expected value term", c);
                                                                                                                                                                                                                                                                g += this.printExpr(h) + c.value + " ";
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "member":
                                                                                                                                                                                                                                                                g += this.printComplexTerm(c, null, f);
                                                                                                                                                                                                                                                                f = !1;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "id":
                                                                                                                                                                                                                                                                g += c.value;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "index":
                                                                                                                                                                                                                                                                g += this.printComplexTerm(c, null, f);
                                                                                                                                                                                                                                                                f = !1;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "program":
                                                                                                                                                                                                                                                                for (d = 0; d < c.children.length; ++d) g += this.printExpr(c.children[d], b.StateFunctionScope);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "scope":
                                                                                                                                                                                                                                                                this.scope_start();
                                                                                                                                                                                                                                                                ++this.indent;
                                                                                                                                                                                                                                                                e !== b.StateFunctionScope ? (g += "{\n", this.new_line = !0) : g += "  ";
                                                                                                                                                                                                                                                                for (d = 0; d < c.children.length; ++d) g += this.printExpr(c.children[d]), d < c.children.length - 1 && "block" === c.children[d].type && "" === c.children[d].value && (g += " ");
                                                                                                                                                                                                                                                                e !== b.StateFunctionScope || 0 != d && "return" === c.children[d - 1].type || (h = this.currentReturnType(), h.is_complex ? this.throwError("function must return value of complex type " + h.name, 0 < d ? c.children[d - 1] : c) : this.is_cpp_or_glsl && (this.new_line && (g += this.getIndent()), g += "return 0;\n",
                                                                                                                                                                                                                                                                this.new_line = !0));
                                                                                                                                                                                                                                                                --this.indent;
                                                                                                                                                                                                                                                                this.new_line && (g += this.getIndent());
                                                                                                                                                                                                                                                                g += "}";
                                                                                                                                                                                                                                                                e !== b.StateFunctionScope && (g += "\n", this.new_line = !0);
                                                                                                                                                                                                                                                                this.scope_end();
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "block":
                                                                                                                                                                                                                                                                h = e === b.StateAllowBool ? e : 0;
                                                                                                                                                                                                                                                                for (d = 0; d < c.children.length; ++d) g += this.printExpr(c.children[d], h), d < c.children.length - 1 && (g += ",");
                                                                                                                                                                                                                                                                e !== b.StateNoSemicolon && (g += c.value, e === b.StateNoBreak || e === b.StateAllowBool || ";" !== c.value && 0 !== c.value.length || (g += "\n", this.new_line = !0));
                    break;
                                                                                                                                                                                                                                                                case "if":
                                                                                                                                                                                                                                                                g += c.type + this.printExpr(c.children[0], b.StateAllowBool) +
                                                                                                                                                                                                                                                                this.printExpr(c.children[1]);
                                                                                                                                                                                                                                                                for (d = 2; d < c.children.length; ++d) this.new_line && (g += this.getIndent()), g += "else " + this.printExpr(c.children[d]);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "while":
                                                                                                                                                                                                                                                                g += c.type + this.printExpr(c.children[0], b.StateAllowBool) + this.printExpr(c.children[1]);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "do":
                                                                                                                                                                                                                                                                g += c.type;
                                                                                                                                                                                                                                                                "scope" !== c.children[0].type && (g += " ");
                                                                                                                                                                                                                                                                g += this.printExpr(c.children[0]);
                                                                                                                                                                                                                                                                "scope" !== c.children[0].type && "" === c.children[0].value && (g += ";");
                                                                                                                                                                                                                                                                g += c.value + this.printExpr(c.children[1], b.StateAllowBool) + ";";
                                                                                                                                                                                                                                                                g += "\n";
                                                                                                                                                                                                                                                                this.new_line = !0;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "for":
                                                                                                                                                                                                                                                                this.scope_start();
                                                                                                                                                                                                                                                                g += c.type + c.value[0];
                                                                                                                                                                                                                                                                g += this.printExpr(c.children[0], b.StateNoBreak);
                                                                                                                                                                                                                                                                g += this.printExpr(c.children[1], b.StateAllowBool);
                                                                                                                                                                                                                                                                g += this.printExpr(c.children[2], b.StateNoBreak);
                                                                                                                                                                                                                                                                if (h = "scope" !== c.children[3].type) g += "\n", this.new_line = !0, ++this.indent;
                                                                                                                                                                                                                                                                g += this.printExpr(c.children[3]);
                    h && --this.indent;
                    this.scope_end();
                    break;
                                                                                                                                                                                                                                                                case "continue":
                                                                                                                                                                                                                                                                case "break":
                                                                                                                                                                                                                                                                g += c.type + c.value;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "return":
                                                                                                                                                                                                                                                                g += c.type;
                                                                                                                                                                                                                                                                "block" !== c.children[0].type && ";" !== c.children[0].value && this.throwError("internal error: expected return <block>;",
                                                                                                                                                                                                                                                                c);
                                                                                                                                                                                                                                                                h = this.currentReturnType();
                                                                                                                                                                                                                                                                h.is_complex ? (0 < c.children[0].children.length && "group" !== c.children[0].children[0].type && (g += " "), g += this.printExpr(c.children[0])) : 0 == c.children[0].children.length ? (g += " 0;\n", this.new_line = !0) : this.is_cpp_or_glsl && h === this.int_type_def ? (g += " int(" + this.printExpr(c.children[0], b.StateNoSemicolon) + ");\n", this.new_line = !0) : (0 < c.children[0].children.length && "group" !== c.children[0].children[0].type && (g += " "), g += this.printExpr(c.children[0]));
                                                                                                                                                                                                                                                                0 < c.children[0].children.length ?
                                                                                                                                                                                                                                                                (d = this.getNodeInfo(c.children[0].children[0]).type_def, (d.is_complex && d !== h || h.is_complex != d.is_complex) && this.throwError("expected " + h.name + " return expression type, got " + d.name, c.children[0])) : h.is_complex && this.throwError("expected " + h.name + " return expression type", c.children[0]);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "cond":
                                                                                                                                                                                                                                                                g += this.printExpr(c.children[0], b.StateAllowBool) + "?";
                                                                                                                                                                                                                                                                g += this.printExpr(c.children[1]) + ":";
                                                                                                                                                                                                                                                                g += this.printExpr(c.children[2]);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "array":
                                                                                                                                                                                                                                                                this.throwError("unexpected array definition", c);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "tuple":
                                                                                                                                                                                                                                                                this.throwError("tuples are not supported yet", c);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "var":
                                                                                                                                                                                                                                                                g += this.storeVar(c);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "struct":
                                                                                                                                                                                                                                                                (1 > c.children.length || "scope" !== c.children[0].type) && this.throwError("struct: scope invalid", c);
                                                                                                                                                                                                                                                                h = this.storeStruct(c);
                                                                                                                                                                                                                                                                this.is_c_like && (g += this.printStruct(c, h));
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "static":
                                                                                                                                                                                                                                                                this.is_c_like ? g += this.storeStatic(c, !0) : this.storeStatic(c);
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                case "function":
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                default:
                                                                                                                                                                                                                                                                this.throwError("printExpr: bad expr " + c.type + " " + c.value)
                }
                f && (g += ",0");
                return g
            };
            b.prototype.printFunctionProto =
            function(c, a, b) {};
            b.prototype.storeFunction = function(c, a) {
                var b;
                b = c.value && 0 !== c.value.length ? c.value : "main" + this.getFuncArgString(c.children[0]);
                if (a)(f = this.declared_function.get(b)) || this.throwError("storeFunction: internal error", c), this.generateFunction(c, b, f.args);
                else {
                    this.declared_function.get(b) && this.throwError("function " + b + " is already declared", c);
                    var e = this.findFuncArgList(c.children[0]),
                    d = this.getFunctionReturnType(c),
                    f = new k(b, b, e, d);
                    this.declared_function.push(b, f);
                    this.is_cpp && "program" !==
                    c.type && "main" !== b && this.printFunctionProto(b, e, d.name)
                }
            };
            b.prototype.generateSubFunctions = function(c) {
                for (var a in c.children) {
                    var b = c.children[a];
                    "function" === b.type && ((0 >= b.children.length || "block" !== b.children[0].type) && this.throwError("expected ( in function declaration"), this.storeFunction(b, !1))
                }
                for (a in c.children) b = c.children[a], "function" === b.type && this.storeFunction(b, !0)
            };
                b.Variable = h;
                b.prototype.printAssignNode = function(c) {
                    c = c.children[1];
                    return "array" === c.type ? " = " + this.printArrayDefinition(c) :
                    " = " + this.printRValue(c)
                };
                b.prototype.printVariable = function(c, a, b, e) {
                    var d = "";
                    a && this.is_c_like && (!this.is_kc || !c.is_static || c.type !== this.float_type && c.type !== this.int_type) && (d = this.is_kc && c.type === this.int_type ? d + (this.float_type + " ") : d + (c.type + " "));
                    if (c.is_ref) {
                        this.is_glsl && this.throwError("glsl does not support references", e);
                        if (b) return d = this.is_js ? d + (c.name_wsi + "$ref," + c.name_wsi + "$ofs") : d + ("&" + c.name_wsi);
                        c.assign_node || this.throwError("reference must be assigned", e);
                        b = c.assign_node.children[1];
                        a = [1, !1, null];
                        this.is_js ? (b = this.printComplexTerm(b, a, !0), a[0] !== c.size && this.throwError("unexpected referenced variable size, " + a[0] + " != " + c.size, e), a = b.indexOf(","), (1 > a || a >= b.length - 1) && this.throwError("internal error in reference expression generation", e), d += c.name_wsi + "$ref", d += "=" + b.substr(0, a) + ",", d += c.name_wsi + "$ofs", d += "=" + b.substr(a + 1)) : (d += "&" + c.name_wsi, d += " = " + this.printComplexTerm(b, a, !0));
                        return d
                    }
                    if (!(b || c.is_static || c.is_array || c.is_ref) && c.assign_node && "array" !== c.assign_node.children[1].type) return this.is_js &&
                        c.is_object && (d += c.name_wsi + n(c) + ", "), d += this.printAssign(c.assign_node);
                    d += c.name_wsi;
                    this.is_c_like && c.is_array && (d += this.printDimensions(c.dimensions));
                    if (b) return d;
                    c.assign_node ? d = c.assign_value ? d + c.assign_value : c.is_typed_array && "array" === c.assign_node.children[1].type ? d + (" = " + c.typed_type_def.elem_ctor + ".from(" + this.printArrayDefinition(c.assign_node.children[1]) + ")") : d + this.printAssignNode(c.assign_node) : this.is_js && (d += n(c));
                    return d
                };
                b.prototype.createVariable = function(c, a, b, d, e) {
                    var f, l = a,
                    k = null;
                    this.no_double_type && c === v ? c = this.float_type : this.no_double_type || c !== m || (c = this.float_type);
                    "assign" === a.type && ("=" !== a.value && this.throwError("invalid variable assignment " +
                    a.value, a), l = a.children[0], k = a);
                    "unary" === l.type && "&" === l.value ? (1 === l.children.length && "term" === l.children[0].type || this.throwError("invalid referenced variable", l), f = new h(c, l.children[0].value, k), f.is_ref = !0) : "index" === l.type ? (f = new h(c, null, k), f.is_array = !0) : "term" !== l.type || 0 < l.children.length ? this.throwError("invalid variable", l) : (f = new h(c, l.value, k), f.is_ref = !1);
                    var td = this.typed_array_type_defs[c];
                    td ? (this.is_js || this.throwError("fixed-width array type '" + c + "' is only supported for JS output (found " + (this.is_glsl ? "GLSL" : this.is_cpp ? "C++" : this.is_kc ? "KenC" : "this") + ")", a), f.is_array || this.throwError("fixed-width type '" + c + "' must be declared as an array (e.g. " + c + " " + (f.name || "x") + "[N];) - bare scalar " + c + " variables are not supported, use the " + c + "(x) cast function on a double instead", a), f.is_typed_array = !0, f.typed_type_def = td) : f.type !== this.float_type && f.type !== this.int_type && (f.type_struct = this.declared_struct.get(c), f.is_object = !0, f.type_struct || this.throwError("struct " +
                    c + " is undefined", a), f.size = f.type_struct.size);
                    f.is_array && (f.name = this.getArray(l, f.type_struct ? f.type_struct.size : 1, f.offsets, f.dimensions), f.name_wsi = f.name, f.size = f.offsets[f.offsets.length - 1]);
                    f.is_static = !!b;
                    f.is_func_arg = !!d;
                    f.is_auto = !!e;
                    return f
                };
                b.prototype.printFuncArg = function(c) {
                    var a = "";
                    c.is_ref ? a = this.is_kc ? c.type === this.float_type || c.type === this.int_type ? a + ("&" + c.name) : a + (c.type + "& " + c.name) : this.is_glsl ? a + ("out " + c.type + " " + c.name) : this.is_cpp ? a + (c.type + "& " + c.name) : a + (c.name + "$ref," +
                    c.name + "$ofs") : (a = this.is_kc ? c.type === this.float_type || c.type === this.int_type ? a + c.name : a + (c.type + " " + c.name) : this.is_cpp_or_glsl ? a + (c.type + " " + c.name) : c.is_array || c.is_object ? !c.is_object || c.is_ref || c.is_array ? a + (c.name + "$ref," + c.name + "$ofs") : a + ("$" + c.name + "$ref,$" + c.name + "$ofs") : a + c.name, this.is_c_like && c.is_array && (a += this.printDimensions(c.dimensions)));
                    return a
                };
                b.prototype.printFuncArgList = function(a) {
                    for (var b = "", d = 0; d < a.length; ++d) b += this.printFuncArg(a[d]), d < a.length - 1 && (b += ",");
                    return b
                };
                b.prototype.getFuncArgString = function(a) {
                    a && "block" === a.type || this.throwError("expected function arguments", a);
                    if (!a.children.length) return "";
                    var b = "_",
                    d;
                    for (d in a.children) var e = a.children[d],
                        b = "var" !== e.type ? b + "f" : b + e.value[0];
                    return b
                };
                b.prototype.findFuncArgList = function(a) {
                    a && "block" === a.type || this.throwError("expected function arguments", a);
                    var b = [],
                    d;
                    for (d in a.children) {
                        var e = a.children[d],
                        f;
                        "var" !== e.type ? f = this.float_type : (f = e.value, e = e.children[0]);
                        f = this.createVariable(f, e, !1, !0, !1);
                        b.push(f)
                    }
                    return b
                };
                b.prototype.declareFuncArgList = function(a) {
                    for (var b = 0; b < a.length; ++b) {
                        var d = a[b];
                        this.declared_var.push(d.name, d)
                    }
                };
                b.prototype.printAutoVars = function() {
                    for (var a = "", b = this.function_autovar.stack, d = this.function_autovar.top(), e = b.length; d < e; ++d) {
                        var f = this.function_autovar.get(b[d]);
                        this.is_js ? a += this.getIndentOpt() + "var " + f.name + " = 0;\n" : this.is_kc ? a += this.getIndentOpt() + f.name + " = 0;\n" : this.is_glsl ? (a += this.getIndentOpt() + f.type + " " + f.name + " = ", a = f.type === this.int_type ? a +
                        "0" : a + "0.0", a += ";\n") : a += this.getIndentOpt() + f.type + " " + f.name + " = 0;\n";
                        this.new_line = !0
                    }
                    return a
                };
                b.prototype.generateFunctionScope = function(a) {
                    "scope" !== a.type && "program" !== a.type && this.throwError("function scope expected", a);
                    return this.printExpr(a, b.StateFunctionScope)
                };
                b.prototype.currentReturnType = function() {
                    var a = this.current_return_type.length;
                    1 > a && this.throwError("internal return_type error", null);
                    return this.current_return_type[a - 1]
                };
                b.prototype.getFunctionReturnType = function(a) {
                    var b =
                    null;
                    if (2 < a.children.length) {
                        var d = a.children[2].value;
                        d === p ? (this.is_kc && this.throwError("function must return " + v, a.children[2]), b = this.int_type_def) : d === v || d === m ? b = this.float_type_def : this.is_kc ? this.throwError("function must return " + p + " or " + v, a.children[2]) : ((b = this.declared_struct.get(d)) || this.throwError("undeclared return type " + d, a.children[2]), b.is_complex && !b.is_algebraic && this.throwError("only algebraic return types are allowed", a.children[2]))
                    } else b = this.float_type_def;
                    return b
                };
                b.prototype.getFunctionBody =
                function(a) {
                    (2 > a.children.length || "scope" !== a.children[1].type) && this.throwError("function scope declaration expected", a);
                    var b = this.current_return_type.length;
                    1 > b && this.throwError("internal return_type error", a);
                    this.current_return_type[b - 1] = this.getFunctionReturnType(a);
                    return a.children[1]
                };
                b.prototype.generateFunction = function(a) {};
                b.KeywordHash = {
                    program: !0,
                    main: !0,
                    "try": !0,
                    "catch": !0
                };
                b.prototype.fixParseTree = function(a) {
                    var d = new w(a);
                    if ("term" === a.type || "function" === a.type || "id" === a.type) {
                        for (var e =
                            a.value, f = 0; f < e.length && "_" === e[f]; ++f);
                        if (b.KeywordHash[e.substr(f)]) d.value = "_" + a.value;
                        else if (this.is_kc && !this.sub_term[a.value] && !this.findSubFunction(a.value, null)) {
                            for (var e = a.value, f = "", h = 0; h < e.length; h++) {
                                var l = e.charCodeAt(h);
                                65 <= l && 90 >= l ? (l = String.fromCharCode(l + 32), f += "_" + l) : f = 95 === e.charCodeAt(h) ? f + "__" : f + e[h]
                            }
                            d.value = f
                        }
                    }
                    e = a.children.length;
                    for (f = 0; f < e; ++f) d.children[f] = this.fixParseTree(a.children[f]);
                    return d
                };
                b.prototype.generate = function(a) {
                    a = this.fixParseTree(a);
                    "program" === a.type &&
                    this.generateFunction(a, "program", null);
                    return this.code
                };
                return b
}();
"undefined" !== typeof module && module.exports && (module.exports = GeneratorCommon);
"undefined" !== typeof module && module.exports && (GeneratorCommon = require("./GeneratorCommon.js"));
var JSGenerator = function() {
    function b(b, d) {
        GeneratorCommon.call(this, GeneratorCommon.LanguageJs, b, d)
    }
    b.prototype = Object.create(GeneratorCommon.prototype);
    b.prototype.printVars = function(b) {
        for (var d = "", a = this.function_var.stack, e = this.function_var.top(), f = a.length; e < f; ++e) {
            var l = this.function_var.get(a[e]);
            l.ref_alias || l.is_static !== b || (d += this.getIndentOpt() + "var ", d += this.printVariable(l, !0, !b, null), d += ";\n", this.new_line = !0)
        }
        return d
    };
    b.prototype.printFuncArgDup = function(b) {
        var d = "";
        if (this.is_js &&
            b.is_object && !b.is_ref && !b.is_array) {
            this.new_line && (d += this.getIndent());
        d += "var " + b.name + "$ref = ";
        if (b.size <= GeneratorCommon.MaxInlineDup) {
            for (var d = d + "[", a = 0; a < b.size; ++a) 0 < a && (d += ","), d += "$" + b.name + "$ref[$" + b.name + "$ofs+" + a + "]";
            d += "];\n"
        } else d += "$dup(" + b.size + ",$" + b.name + "$ref,$" + b.name + "$ofs);\n";
        d += this.getIndent();
            d += "var " + b.name + "$ofs = 0;\n";
            this.new_line = !0
            }
            return d
    };
    b.prototype.printFuncArgDupList = function(b) {
        for (var d = "", a = 0; a < b.length; ++a) d += this.printFuncArgDup(b[a]);
        return d
    };
    b.prototype.generateFunction =
    function(b, d, a) {
        var e = "program" === b.type;
        this.new_line && this.add(this.getIndent());
        e || this.add("var " + d + " = ");
        this.add("(function(");
        e && this.add("libdraw");
        this.add("){\n");
        this.new_line = !0;
        ++this.indent;
        e && (this.add("  function $zero(size){\n    var ret = new Array(size);\n    for(var i=0; i<size; ++i)\n      ret[i] = 0;\n    return ret;\n  }\n  function $dup(size,ref,ofs){\n    var ret = new Array(size);\n    for(var i=0; i<size; ++i)\n      ret[i] = ref[ofs+i];\n    return ret;\n  }\n  function $copy(size,dref,dofs,ref,ofs){\n    for(var i=0; i<size; ++i)\n      dref[dofs+i] = ref[ofs+i];\n  }\n  function $copy2(dref,dofs,ref,ofs){\n    dref[dofs] = ref[ofs];\n    dref[dofs+1] = ref[ofs+1];\n  }\n  function $copy3(dref,dofs,ref,ofs){\n    dref[dofs] = ref[ofs];\n    dref[dofs+1] = ref[ofs+1];\n    dref[dofs+2] = ref[ofs+2];\n  }\n  function $copy4(dref,dofs,ref,ofs){\n    dref[dofs] = ref[ofs];\n    dref[dofs+1] = ref[ofs+1];\n    dref[dofs+2] = ref[ofs+2];\n    dref[dofs+3] = ref[ofs+3];\n  }\n  function $pow2(x){\n    return x*x;\n  }\n  function $pow3(x){\n    return x*x*x;\n  }\n  function $mod(x,y){\n    return x - y*Math.floor(x/y);\n  }\n  function $sign(x){ return (x === 0) ? 0 : (x > 0) * 2 - 1; }\n  function $fract(x){ return x - Math.floor(x); }\n  var $val, $ref = [];\n"),
              this.is_vectormath && (d = function(a, b) {
                  return "  function $copy" + a + "1(size,dref,dofs,val){\n    for(var i=0; i<size; ++i)\n      dref[dofs+i] " + b + "= val;\n  }\n  function $copy2" + a + "1(dref,dofs,val){\n    dref[dofs] " + b + "= val;\n    dref[dofs+1] " + b + "= val;\n  }\n  function $copy2" + a + "2(dref,dofs,ref,ofs){\n    dref[dofs] " + b + "= ref[ofs];\n    dref[dofs+1] " + b + "= ref[ofs+1];\n  }\n  function $copy3" + a + "1(dref,dofs,val){\n    dref[dofs] " + b + "= val;\n    dref[dofs+1] " + b + "= val;\n    dref[dofs+2] " + b +
                  "= val;\n  }\n  function $copy3" + a + "3(dref,dofs,ref,ofs){\n    dref[dofs] " + b + "= ref[ofs];\n    dref[dofs+1] " + b + "= ref[ofs+1];\n    dref[dofs+2] " + b + "= ref[ofs+2];\n  }\n  function $copy4" + a + "1(dref,dofs,val){\n    dref[dofs] " + b + "= val;\n    dref[dofs+1] " + b + "= val;\n    dref[dofs+2] " + b + "= val;\n    dref[dofs+4] " + b + "= val;\n  }\n  function $copy4" + a + "4(dref,dofs,ref,ofs){\n    dref[dofs] " + b + "= ref[ofs];\n    dref[dofs+1] " + b + "= ref[ofs+1];\n    dref[dofs+2] " + b + "= ref[ofs+2];\n    dref[dofs+3] " +
                  b + "= ref[ofs+3];\n  }\n"
              }, this.add(d("add", "+") + d("sub", "-") + d("mul", "*") + d("div", "/") + d("mod", "%")), d = function(a, b) {
                  return "  function $vec2" + a + "1(dref,dofs,val){\n    return [dref[dofs]" + b + "val,dref[dofs+1]" + b + "val];\n  }\n  function $vec2" + a + "2(dref,dofs,ref,ofs){\n    return [dref[dofs]" + b + "ref[ofs],dref[dofs+1]" + b + "ref[ofs+1]];\n  }\n  function $vec3" + a + "1(dref,dofs,val){\n    return [dref[dofs]" + b + "val,dref[dofs+1]" + b + "val,dref[dofs+2]" + b + "val];\n  }\n  function $vec3" + a + "3(dref,dofs,ref,ofs){\n    return [dref[dofs]" +
                  b + "ref[ofs],dref[dofs+1]" + b + "ref[ofs+1],dref[dofs+2]" + b + "ref[ofs+2]];\n  }\n  function $vec4" + a + "1(dref,dofs,val){\n    return [dref[dofs]" + b + "val,dref[dofs+1]" + b + "val,dref[dofs+2]" + b + "val,dref[dofs+3]" + b + "val];\n  }\n  function $vec4" + a + "4(dref,dofs,ref,ofs){\n    return [dref[dofs]" + b + "ref[ofs],dref[dofs+1]" + b + "ref[ofs+1],dref[dofs+2]" + b + "ref[ofs+2],dref[dofs+3]" + b + "ref[ofs+3]];\n  }\n"
              }, this.add(d("add", "+") + d("sub", "-") + d("mul", "*") + d("div", "/") + d("mod", "%")), this.add(function(a, b) {
                  return "  function $vec1l" +
                  a + "2(vf,v,o){\n    return [vf" + b + "v[o],vf" + b + "v[o+1]];\n  }\n  function $vec1l" + a + "3(vf,v,o){\n    return [vf" + b + "v[o],vf" + b + "v[o+1],vf" + b + "v[o+2]];\n  }\n  function $vec1l" + a + "4(vf,v,o){\n    return [vf" + b + "v[o],vf" + b + "v[o+1],vf" + b + "v[o+2],vf" + b + "v[o+3]];\n  }\n"
              }("mul", "*")), this.add(function(a, b) {
                  return "  function $vec2" + a + "(dref,dofs){\n    return [" + b + "dref[dofs]," + b + "dref[dofs+1]];\n  }\n  function $vec3" + a + "(dref,dofs){\n    return [" + b + "dref[dofs]," + b + "dref[dofs+1]," + b + "dref[dofs+2]];\n  }\n  function $vec4" +
                  a + "(dref,dofs){\n    return [" + b + "dref[dofs]," + b + "dref[dofs+1]," + b + "dref[dofs+2]," + b + "dref[dofs+3]];\n  }\n"
              }("neg", "-")), this.add("  function $vec9mul1(v,o,vf){\n    return [v[o]*vf,v[o+1]*vf,v[o+2]*vf,v[o+3]*vf,v[o+4]*vf,v[o+5]*vf,v[o+6]*vf,v[o+7]*vf,v[o+8]*vf];\n  }\n  function $vec16mul1(v,o,vf){\n    return [v[o]*vf,v[o+1]*vf,v[o+2]*vf,v[o+3]*vf,v[o+4]*vf,v[o+5]*vf,v[o+6]*vf,v[o+7]*vf,v[o+8]*vf,v[o+9]*vf,v[o+10]*vf,v[o+11]*vf,v[o+12]*vf,v[o+13]*vf,v[o+14]*vf,v[o+15]*vf,];\n  }\n  function $vec1lmul9(vf,v,o){\n    return [v[o]*vf,v[o+1]*vf,v[o+2]*vf,v[o+3]*vf,v[o+4]*vf,v[o+5]*vf,v[o+6]*vf,v[o+7]*vf,v[o+8]*vf];\n  }\n  function $vec1lmul16(vf,v,o){\n    return [v[o]*vf,v[o+1]*vf,v[o+2]*vf,v[o+3]*vf,v[o+4]*vf,v[o+5]*vf,v[o+6]*vf,v[o+7]*vf,v[o+8]*vf,v[o+9]*vf,v[o+10]*vf,v[o+11]*vf,v[o+12]*vf,v[o+13]*vf,v[o+14]*vf,v[o+15]*vf,];\n  }\n  function $mat2lmul4(dref,dofs,ref,ofs){\n    var x=dref[dofs],y=dref[dofs+1];\n    return [x*ref[ofs]+y*ref[ofs+1],x*ref[ofs+2]+y*ref[ofs+3]];\n  }\n  function $mat4mul2(ref,ofs,dref,dofs){\n    var x=dref[dofs],y=dref[dofs+1];\n    return [x*ref[ofs]+y*ref[ofs+2],x*ref[ofs+1]+y*ref[ofs+3]];\n  }\n  function $copymat2mul4(dref,dofs,ref,ofs){\n    var x=dref[dofs],y=dref[dofs+1];\n    dref[dofs  ]=x*ref[ofs  ]+y*ref[ofs+1];\n    dref[dofs+1]=x*ref[ofs+2]+y*ref[ofs+3];\n  }\n  function $mat3lmul9(dref,dofs,ref,ofs){\n    var x=dref[dofs],y=dref[dofs+1],z=dref[dofs+2]; return [\n      x*ref[ofs  ]+y*ref[ofs+1]+z*ref[ofs+2],\n      x*ref[ofs+3]+y*ref[ofs+4]+z*ref[ofs+5],\n      x*ref[ofs+6]+y*ref[ofs+7]+z*ref[ofs+8]];\n  }\n  function $mat9mul3(ref,ofs,dref,dofs){\n    var x=dref[dofs],y=dref[dofs+1],z=dref[dofs+2]; return [\n      x*ref[ofs  ]+y*ref[ofs+3]+z*ref[ofs+6],\n      x*ref[ofs+1]+y*ref[ofs+4]+z*ref[ofs+7],\n      x*ref[ofs+2]+y*ref[ofs+5]+z*ref[ofs+8]];\n  }\n  function $copymat3mul9(dref,dofs,ref,ofs){\n    var x=dref[dofs],y=dref[dofs+1],z=dref[dofs+2];\n    dref[dofs  ]=x*ref[ofs  ]+y*ref[ofs+1]+z*ref[ofs+2];\n    dref[dofs+1]=x*ref[ofs+3]+y*ref[ofs+4]+z*ref[ofs+5];\n    dref[dofs+2]=x*ref[ofs+6]+y*ref[ofs+7]+z*ref[ofs+8];\n  }\n  function $mat4lmul16(dref,dofs,ref,ofs){\n    var x=dref[dofs],y=dref[dofs+1],z=dref[dofs+2],w=dref[dofs+3]; return [\n      x*ref[ofs  ]+y*ref[ofs+1]+z*ref[ofs+2]+w*ref[ofs+3],\n      x*ref[ofs+4]+y*ref[ofs+5]+z*ref[ofs+6]+w*ref[ofs+7],\n      x*ref[ofs+8]+y*ref[ofs+9]+z*ref[ofs+10]+w*ref[ofs+11],\n      x*ref[ofs+12]+y*ref[ofs+13]+z*ref[ofs+14]+w*ref[ofs+15]];\n  }\n  function $mat16mul4(ref,ofs,dref,dofs){\n    var x=dref[dofs],y=dref[dofs+1],z=dref[dofs+2],w=dref[dofs+3]; return [\n      x*ref[ofs  ]+y*ref[ofs+4]+z*ref[ofs+8]+w*ref[ofs+12],\n      x*ref[ofs+1]+y*ref[ofs+5]+z*ref[ofs+9]+w*ref[ofs+13],\n      x*ref[ofs+2]+y*ref[ofs+6]+z*ref[ofs+10]+w*ref[ofs+14],\n      x*ref[ofs+3]+y*ref[ofs+7]+z*ref[ofs+11]+w*ref[ofs+15]];\n  }\n  function $copymat4mul16(dref,dofs,ref,ofs){\n    var x=dref[dofs],y=dref[dofs+1],z=dref[dofs+2],w=dref[dofs+3];\n    dref[dofs  ]=x*ref[ofs  ]+y*ref[ofs+1]+z*ref[ofs+2]+w*ref[ofs+3];\n    dref[dofs+1]=x*ref[ofs+4]+y*ref[ofs+5]+z*ref[ofs+6]+w*ref[ofs+7];\n    dref[dofs+2]=x*ref[ofs+8]+y*ref[ofs+9]+z*ref[ofs+10]+w*ref[ofs+11];\n    dref[dofs+3]=x*ref[ofs+12]+y*ref[ofs+13]+z*ref[ofs+14]+w*ref[ofs+15];\n  }\n  function $mat4mul4(dref,dofs,ref,ofs){\n    var a00=dref[dofs],a01=dref[dofs+1],a10=dref[dofs+2],a11=dref[dofs+3];\n    var b00=ref[ofs],b01=ref[ofs+1],b10=ref[ofs+2],b11=ref[ofs+3]; return [\n      a00*b00 + a10*b01,\n      a01*b00 + a11*b01,\n      a00*b10 + a10*b11,\n      a01*b10 + a11*b11];\n  }\n  function $copymat4mul4(dref,dofs,ref,ofs){\n    var a00=dref[dofs],a01=dref[dofs+1],a10=dref[dofs+2],a11=dref[dofs+3];\n    var b00=ref[ofs],b01=ref[ofs+1],b10=ref[ofs+2],b11=ref[ofs+3];\n    dref[dofs  ]=a00*b00 + a10*b01;\n    dref[dofs+1]=a01*b00 + a11*b01;\n    dref[dofs+2]=a00*b10 + a10*b11;\n    dref[dofs+3]=a01*b10 + a11*b11;\n  }\n  function $mat9mul9(dref,dofs,ref,ofs){\n    var a00=dref[dofs  ],a01=dref[dofs+1],a02=dref[dofs+2],\n        a10=dref[dofs+3],a11=dref[dofs+4],a12=dref[dofs+5],\n        a20=dref[dofs+6],a21=dref[dofs+7],a22=dref[dofs+8];\n    var b00=ref[ofs  ],b01=ref[ofs+1],b02=ref[ofs+2],\n        b10=ref[ofs+3],b11=ref[ofs+4],b12=ref[ofs+5],\n        b20=ref[ofs+6],b21=ref[ofs+7],b22=ref[ofs+8]; return [\n      a00*b00 + a10*b01 + a20*b02,\n      a01*b00 + a11*b01 + a21*b02,\n      a02*b00 + a12*b01 + a22*b02,\n      a00*b10 + a10*b11 + a20*b12,\n      a01*b10 + a11*b11 + a21*b12,\n      a02*b10 + a12*b11 + a22*b12,\n      a00*b20 + a10*b21 + a20*b22,\n      a01*b20 + a11*b21 + a21*b22,\n      a02*b20 + a12*b21 + a22*b22];\n  }\n  function $copymat9mul9(dref,dofs,ref,ofs){\n    var a00=dref[dofs  ],a01=dref[dofs+1],a02=dref[dofs+2],\n        a10=dref[dofs+3],a11=dref[dofs+4],a12=dref[dofs+5],\n        a20=dref[dofs+6],a21=dref[dofs+7],a22=dref[dofs+8];\n    var b00=ref[ofs  ],b01=ref[ofs+1],b02=ref[ofs+2],\n        b10=ref[ofs+3],b11=ref[ofs+4],b12=ref[ofs+5],\n        b20=ref[ofs+6],b21=ref[ofs+7],b22=ref[ofs+8];\n    dref[dofs  ]=a00*b00 + a10*b01 + a20*b02;\n    dref[dofs+1]=a01*b00 + a11*b01 + a21*b02;\n    dref[dofs+2]=a02*b00 + a12*b01 + a22*b02;\n    dref[dofs+3]=a00*b10 + a10*b11 + a20*b12;\n    dref[dofs+4]=a01*b10 + a11*b11 + a21*b12;\n    dref[dofs+5]=a02*b10 + a12*b11 + a22*b12;\n    dref[dofs+6]=a00*b20 + a10*b21 + a20*b22;\n    dref[dofs+7]=a01*b20 + a11*b21 + a21*b22;\n    dref[dofs+8]=a02*b20 + a12*b21 + a22*b22;\n  }\n  function $mat16mul16(dref,dofs,ref,ofs){\n    var a00=dref[dofs   ],a01=dref[dofs+ 1],a02=dref[dofs+ 2],a03=dref[dofs+ 3],\n        a10=dref[dofs+ 4],a11=dref[dofs+ 5],a12=dref[dofs+ 6],a13=dref[dofs+ 7],\n        a20=dref[dofs+ 8],a21=dref[dofs+ 9],a22=dref[dofs+10],a23=dref[dofs+11],\n        a30=dref[dofs+12],a31=dref[dofs+13],a32=dref[dofs+14],a33=dref[dofs+15];\n    var b00=ref[ofs   ],b01=ref[ofs+ 1],b02=ref[ofs+ 2],b03=ref[ofs+ 3],\n        b10=ref[ofs+ 4],b11=ref[ofs+ 5],b12=ref[ofs+ 6],b13=ref[ofs+ 7],\n        b20=ref[ofs+ 8],b21=ref[ofs+ 9],b22=ref[ofs+10],b23=ref[ofs+11],\n        b30=ref[ofs+12],b31=ref[ofs+13],b32=ref[ofs+14],b33=ref[ofs+15]; return [\n      a00*b00 + a10*b01 + a20*b02 + a30*b03,\n      a01*b00 + a11*b01 + a21*b02 + a31*b03,\n      a02*b00 + a12*b01 + a22*b02 + a32*b03,\n      a03*b00 + a13*b01 + a23*b02 + a33*b03,\n      a00*b10 + a10*b11 + a20*b12 + a30*b13,\n      a01*b10 + a11*b11 + a21*b12 + a31*b13,\n      a02*b10 + a12*b11 + a22*b12 + a32*b13,\n      a03*b10 + a13*b11 + a23*b12 + a33*b13,\n      a00*b20 + a10*b21 + a20*b22 + a30*b23,\n      a01*b20 + a11*b21 + a21*b22 + a31*b23,\n      a02*b20 + a12*b21 + a22*b22 + a32*b23,\n      a03*b20 + a13*b21 + a23*b22 + a33*b23,\n      a00*b30 + a10*b31 + a20*b32 + a30*b33,\n      a01*b30 + a11*b31 + a21*b32 + a31*b33,\n      a02*b30 + a12*b31 + a22*b32 + a32*b33,\n      a03*b30 + a13*b31 + a23*b32 + a33*b33];\n  }\n  function $copymat16mul16(dref,dofs,ref,ofs){\n    var a00=dref[dofs   ],a01=dref[dofs+ 1],a02=dref[dofs+ 2],a03=dref[dofs+ 3],\n        a10=dref[dofs+ 4],a11=dref[dofs+ 5],a12=dref[dofs+ 6],a13=dref[dofs+ 7],\n        a20=dref[dofs+ 8],a21=dref[dofs+ 9],a22=dref[dofs+10],a23=dref[dofs+11],\n        a30=dref[dofs+12],a31=dref[dofs+13],a32=dref[dofs+14],a33=dref[dofs+15];\n    var b00=ref[ofs   ],b01=ref[ofs+ 1],b02=ref[ofs+ 2],b03=ref[ofs+ 3],\n        b10=ref[ofs+ 4],b11=ref[ofs+ 5],b12=ref[ofs+ 6],b13=ref[ofs+ 7],\n        b20=ref[ofs+ 8],b21=ref[ofs+ 9],b22=ref[ofs+10],b23=ref[ofs+11],\n        b30=ref[ofs+12],b31=ref[ofs+13],b32=ref[ofs+14],b33=ref[ofs+15];\n    dref[dofs   ]=a00*b00 + a10*b01 + a20*b02 + a30*b03;\n    dref[dofs+ 1]=a01*b00 + a11*b01 + a21*b02 + a31*b03;\n    dref[dofs+ 2]=a02*b00 + a12*b01 + a22*b02 + a32*b03;\n    dref[dofs+ 3]=a03*b00 + a13*b01 + a23*b02 + a33*b03;\n    dref[dofs+ 4]=a00*b10 + a10*b11 + a20*b12 + a30*b13;\n    dref[dofs+ 5]=a01*b10 + a11*b11 + a21*b12 + a31*b13;\n    dref[dofs+ 6]=a02*b10 + a12*b11 + a22*b12 + a32*b13;\n    dref[dofs+ 7]=a03*b10 + a13*b11 + a23*b12 + a33*b13;\n    dref[dofs+ 8]=a00*b20 + a10*b21 + a20*b22 + a30*b23;\n    dref[dofs+ 9]=a01*b20 + a11*b21 + a21*b22 + a31*b23;\n    dref[dofs+10]=a02*b20 + a12*b21 + a22*b22 + a32*b23;\n    dref[dofs+11]=a03*b20 + a13*b21 + a23*b22 + a33*b23;\n    dref[dofs+12]=a00*b30 + a10*b31 + a20*b32 + a30*b33;\n    dref[dofs+13]=a01*b30 + a11*b31 + a21*b32 + a31*b33;\n    dref[dofs+14]=a02*b30 + a12*b31 + a22*b32 + a32*b33;\n    dref[dofs+15]=a03*b30 + a13*b31 + a23*b32 + a33*b33;\n  }\n"),
                                     this.add("  function $dup2(v,o) { return [v[o],v[o+1]]; }\n  function $dup3(v,o) { return [v[o],v[o+1],v[o+2]]; }\n  function $dup4(v,o) { return [v[o],v[o+1],v[o+2],v[o+3]]; }\n  function $vec2_f(x) { return [x,x]; }\n  function $vec2(x,y) { return [x,y]; }\n  function $vec3_f(x) { return [x,x,x]; }\n  function $vec3_v2f(v,o,x) { return [v[o],v[o+1],x]; }\n  function $vec3_fv2(x,v,o) { return [x,v[o],v[o+1]]; }\n  function $vec3(x,y,z) { return [x,y,z]; }\n  function $vec4_f(x) { return [x,x,x,x]; }\n  function $vec4_v2ff(v,o,z,w) { return [v[o],v[o+1],z,w]; }\n  function $vec4_fv2f(x,v,o,w) { return [x,v[o],v[o+1],w]; }\n  function $vec4_ffv2(x,y,v,o) { return [x,y,v[o],v[o+1]]; }\n  function $vec4_v2v2(v,o,vv,oo) { return [v[o],v[o+1],vv[oo],vv[oo+1]]; }\n  function $vec4_v3f(v,o,x) { return [v[o],v[o+1],v[o+2],x]; }\n  function $vec4_fv3(v,o,x) { return [x,v[o],v[o+1],v[o+2]]; }\n  function $vec4(x,y,z,w) { return [x,y,z,w]; }\n  function $mat2_f(x) { return [x,0,0,x]; }\n  function $mat2_m3(v,o) { return [v[o],v[o+1],v[o+3],v[o+4]]; }\n  function $mat2_m4(v,o) { return [v[o],v[o+1],v[o+4],v[o+5]]; }\n  function $mat2_v2v2(v,o,vv,oo) { return [v[o],v[o+1],vv[oo],vv[oo+1]]; }\n  function $mat2(x,y,z,w) { return [x,y,z,w]; }\n  function $mat3_f(x) { return [x,0,0,0,x,0,0,0,x]; }\n  function $mat3_m2(v,o) { return [v[o],v[o+1],0, v[o+2],v[o+3],0, 0,0,1]; }\n  function $mat3_m4(v,o) { return [v[o],v[o+1],v[o+2],v[o+4],v[o+5],v[o+6],v[o+8],v[o+9],v[o+10]]; }\n  function $mat3(x0,y0,z0,x1,y1,z1,x2,y2,z2) { return [x0,y0,z0,x1,y1,z1,x2,y2,z2]; }\n  function $mat3_v3v3v3(vx,ox,vy,oy,vz,oz) {\n    return [vx[ox],vx[ox+1],vx[ox+2],vy[oy],vy[oy+1],vy[oy+2],vz[oz],vz[oz+1],vz[oz+2]]; }\n  function $mat4_f(x) { return [x,0,0,0,0,x,0,0,0,0,x,0,0,0,0,x]; }\n  function $mat4_m2(v,o) { return [v[o],v[o+1],0,0, v[o+2],v[o+3],0,0,0, 0,0,1,0, 0,0,0,1]; }\n  function $mat4_m3(v,o) { return [v[o],v[o+1],v[o+2],0, v[o+3],v[o+4],v[o+5],0, v[o+6],v[o+7],v[o+8],0, 0,0,0,1]; }\n  function $mat4_v4v4v4v4(vx,ox,vy,oy,vz,oz,vw,ow) {\n    return [[vx[ox],vx[ox+1],vx[ox+2],vx[ox+3],vy[oy],vy[oy+1],vy[oy+2],vy[oy+3],\n      vz[oz],vz[oz+1],vz[oz+2],vz[oz+3],vw[ow],vw[ow+1],vw[ow+2],vw[ow+3]]]; }\n  function $mat4(x0,y0,z0,w0,x1,y1,z1,w1,x2,y2,z2,w2,x3,y3,z3,w3) {\n    return [x0,y0,z0,w0,x1,y1,z1,w1,x2,y2,z2,w2,x3,y3,z3,w3]; }\n"),
                                     this.add(" function $cross3(v,o,vv,oo) { var ux=v[o],uy=v[o+1],uz=v[o+2],vx=vv[oo],vy=vv[oo+1],vz=vv[oo+2]; return [uy*vz-vy*uz,uz*vx-vz*ux,ux*vy-vx*uy]; }\n function $cross2(v,o,vv,oo) { return v[o]*vv[oo+1]-v[o+1]*vv[oo]; }\n function $dot2(v,o,vv,oo) { return v[o]*vv[oo] + v[o+1]*vv[oo+1]; }\n function $dot3(v,o,vv,oo) { return v[o]*vv[oo] + v[o+1]*vv[oo+1] + v[o+2]*vv[oo+2]; }\n function $dot4(v,o,vv,oo) { return v[o]*vv[oo] + v[o+1]*vv[oo+1] + v[o+2]*vv[oo+2] + v[o+3]*vv[oo+3]; }\n function $length2(v,o) { var x=v[o],y=v[o+1]; return Math.sqrt(x*x + y*y); }\n function $length3(v,o) { var x=v[o],y=v[o+1],z=v[o+2]; return Math.sqrt(x*x + y*y + z*z); }\n function $length4(v,o) { var x=v[o],y=v[o+1],z=v[o+2],w=v[o+3]; return Math.sqrt(x*x + y*y + z*z + w*w); }\n function $abs2(v,o) { return [Math.abs(v[o]),Math.abs(v[o+1])]; }\n function $abs3(v,o) { return [Math.abs(v[o]),Math.abs(v[o+1]),Math.abs(v[o+2])]; }\n function $abs4(v,o) { return [Math.abs(v[o]),Math.abs(v[o+1]),Math.abs(v[o+2]),Math.abs(v[o+3])]; }\n function $distance2(v,o,vv,oo) { var x=v[o]-vv[oo],y=v[o+1]-vv[oo+1]; return Math.sqrt(x*x + y*y); }\n function $distance3(v,o,vv,oo) { var x=v[o]-vv[oo],y=v[o+1]-vv[oo+1],z=v[o+2]-vv[oo+2]; return Math.sqrt(x*x + y*y + z*z); }\n function $distance4(v,o,vv,oo) { var x=v[o]-vv[oo],y=v[o+1]-vv[oo+1],z=v[o+2]-vv[oo+2],w=v[o+3]-vv[oo+3]; return Math.sqrt(x*x + y*y + z*z + w*w); }\n function $transpose2(v,o) { return [v[o],v[o+2],v[o+1],v[o+3]]; }\n function $transpose3(v,o) { return [v[o],v[o+3],v[o+6],v[o+1],v[o+4],v[o+7],v[o+2],v[o+5],v[o+8]]; }\n function $transpose4(v,o) { return [v[o],v[o+4],v[o+8],v[o+12], v[o+1],v[o+5],v[o+9],v[o+13], v[o+2],v[o+6],v[o+10],v[o+14], v[o+3],v[o+7],v[o+11],v[o+15]]; }\n function $floor2(v,o) { return [Math.floor(v[o]),Math.floor(v[o+1])]; }\n function $floor3(v,o) { return [Math.floor(v[o]),Math.floor(v[o+1]),Math.floor(v[o+2])]; }\n function $floor4(v,o) { return [Math.floor(v[o]),Math.floor(v[o+1]),Math.floor(v[o+2]),Math.floor(v[o+3])]; }\n function $ceil2(v,o) { return [Math.ceil(v[o]),Math.ceil(v[o+1])]; }\n function $ceil3(v,o) { return [Math.ceil(v[o]),Math.ceil(v[o+1]),Math.ceil(v[o+2])]; }\n function $ceil4(v,o) { return [Math.ceil(v[o]),Math.ceil(v[o+1]),Math.ceil(v[o+2]),Math.ceil(v[o+3])]; }\n function $fract2(v,o) { var x=v[o],y=v[o+1]; return [x-Math.floor(x),y-Math.floor(y)]; }\n function $fract3(v,o) { var x=v[o],y=v[o+1],z=v[o+2]; return [x-Math.floor(x),y-Math.floor(y),z-Math.floor(z)]; }\n function $fract4(v,o) { var x=v[o],y=v[o+1],z=v[o+2],w=v[o+3]; return [x-Math.floor(x),y-Math.floor(y),z-Math.floor(z),w-Math.floor(w)]; }\n")),
              this.new_line = !0);
        this.function_start();
        e ? (this.new_line = !1, d = this.generateFunctionScope(b), this.new_line = !0, this.add(this.printVars(!0)), this.add(this.getIndent() + d), d = b) : (d = this.getFunctionBody(b), a && this.declareFuncArgList(a));
        this.generateSubFunctions(d);
        e ? this.add(this.getIndentOpt() + "return main;") : (b = a ? this.printFuncArgList(a) : "", this.new_line = !1, d = this.generateFunctionScope(d), this.new_line = !0, this.add(this.printVars(!0)), this.add(this.getIndentOpt() + "return function(" + b + ")"), ++this.indent,
                                                              this.add("{\n"), this.new_line = !0, a && this.add(this.printFuncArgDupList(a)), this.add(this.printVars(!1)), this.add(this.printAutoVars()), --this.indent, this.new_line && this.add(this.getIndent()), this.add(d), this.add(";"));
        --this.indent;
        this.add("\n" + this.getIndent());
        e ? this.add("});\n") : this.add("}());\n");
        this.new_line = !0;
        this.function_end()
    };
    return b
}();
"undefined" !== typeof module && module.exports && (module.exports = JSGeneratorTC);
"undefined" !== typeof module && module.exports && (GeneratorCommon = require("./GeneratorCommon.js"));
var GLSLGenerator = function() {
    function b(b, d) {
        GeneratorCommon.call(this, GeneratorCommon.LanguageGLSL, b, d);
        this.namespace = "program"
    }
    b.prototype = Object.create(GeneratorCommon.prototype);
    b.prototype.setNamespace = function(b) {
        this.namespace = b
    };
    b.prototype.printFunctionProto = function(b, d, a) {
        d = d ? this.printFuncArgList(d) : "";
        this.add(a + " " + b + "(" + d + ");\n\n")
    };
    b.HEADER = "float _pow2(float x) { return x*x; }\nfloat _pow3(float x) { return x*x*x; }\n";
    b.prototype.generateFunction = function(b, d, a) {
        this.function_start();
        "program" !== b.type ? a && this.declareFuncArgList(a) : (this.add(this.generateFunctionScope(b)), this.add("\n"));
        this.generateSubFunctions(b);
        "program" !== b.type && (b = this.getFunctionBody(b), a = a ? this.printFuncArgList(a) : "", b = this.generateFunctionScope(b), this.add(this.currentReturnType().name + " " + d + "(" + a + ")"), ++this.indent, this.add("{\n"), this.new_line = !0, this.add(this.printAutoVars()), --this.indent, this.new_line && this.add(this.getIndent()), this.add(b), this.add("\n\n"));
        this.function_end()
    };
    return b
}();
"undefined" !== typeof module && module.exports && (module.exports = GLSLGenerator);
var TCAlgebra = function() {
    function b() {}

    function k(a) {
        for (var b = a.children, d = b.length, e = 0; e < d; ++e) {
            var f = b[e];
            f.parent = a;
            k(f)
        }
    }

    function d(a) {
        var b = a.children,
        e = b.length;
        if ("group" === a.type) {
            if (1 !== e) throw "comma separated terms in a group are not allowed";
            return d(b[0])
        }
        for (var f = 0; f < e; ++f) {
            var l = b[f],
            k = d(l);
            k !== l && (b[f] = k)
        }
        return a
    }

    function a(b, d) {
        if (b.type !== d.type || b.value !== d.value) return !1;
        var e = b.children,
        f = d.children,
        l = e.length;
        if (l !== f.length) return !1;
        for (var k = 0; k < l; ++k)
            if (!a(e[k], f[k])) return !1;
            return !0
    }

    function e(a) {
        var b = a.children,
        d = b.length,
        f = Array(d);
        a = {
            type: a.type,
            value: a.value,
            children: f,
            parent: null
        };
        for (var l = 0; l < d; ++l) {
            var k = e(b[l]);
            k.parent = a;
            f[l] = k
        }
        return a
    }

    function f(a, b, d, f, l) {
        if ("operator" !== a.type || a.value !== b) return !1;
        var k = a.children;
        if (2 !== k.length) throw "required two-argument operator " + b;
        f = f ? 1 : 0;
        var r = k[1 - f];
        if ("operator" !== r.type || r.value !== d) return !1;
        var s = r.children;
        if (2 !== s.length) throw "required two-argument operator " + d;
        if (l) return !0;
        l = k[f];
        a.value = d;
        a = {
            type: a.type,
            value: b,
            children: [null, null],
            parent: a
        };
        d = s[f];
        a.children[f] = l;
        a.children[1 - f] = d;
        l.parent = a;
        d.parent = a;
        k[f] = a;
        r.value = b;
        d = e(l);
        d.parent = r;
        s[f] = d;
        return !0
    }

    function l(a, b, d, e) {
        f(a, b, d, e, !1);
        a = a.children;
        for (var k = a.length, p = 0; p < k; ++p) l(a[p], b, d, e)
    }

    function r(b, d, e, f, l) {
        if ("operator" !== b.type || b.value !== e) return !1;
        var k = b.children;
        if (2 !== k.length) throw "required two-argument operator " + e;
        f = f ? 1 : 0;
        var r = k[f];
        if ("operator" !== r.type || r.value !== d) return !1;
        var s = k[1 - f];
        if ("operator" !== s.type || s.value !== d) return !1;
        var u = r.children;
        if (2 !== u.length) throw "required two-argument operator " + d;
        r = s.children;
        if (2 !== r.length) throw "required two-argument operator " + d;
        var z = u[f];
        if (!a(r[f], z)) return !1;
        if (l) return !0;
        l = u[1 - f];
        l.parent = s;
        r[f] = l;
        z.parent = b;
        k[f] = z;
        b.value = d;
        s.value = e;
        return !0
    }

    function u(a, b, d, e) {
        r(a, b, d, e, !1);
        a = a.children;
        for (var f = a.length, l = 0; l < f; ++l) u(a[l], b, d, e)
    }

    function s(a, b) {
        if ("operator" !== a.type || !a.parent || "operator" !== a.parent.type || a.parent.value !== a.value) return !1;
        var d = a.parent,
        e = d.children,
        f =
        a.children;
        if (2 !== e.length || 2 !== f.length) throw "required two-argument operator " + a.value;
        if (b) return !0;
        if (e[1] === a) return e[1] = f[1], e[1].parent = d, f[1] = f[0], f[0] = e[0], f[0].parent = a, e[0] = a, !0;
        if (e[0] !== a) throw "bad parenting";
        e[0] = f[0];
        e[0].parent = d;
        f[0] = f[1];
        f[1] = e[1];
        f[1].parent = a;
        e[1] = a;
        return !0
    }
    b.prototype.prepareTree = function(a) {
        a.parent = null;
        a = d(a);
        k(a);
        return a
    };
    b.prototype.distribute = function(a, b, d, e, l) {
        return f(a, b, d, e, l)
    };
    b.prototype.leftDistributeAll = function(a, b, d) {
        return l(a, b, d, !1)
    };
    b.prototype.rightDistributeAll =
    function(a, b, d) {
        return l(a, b, d, !0)
    };
    b.prototype.compact = function(a, b, d, e, f) {
        return r(a, b, d, e, f)
    };
    b.prototype.leftCompactAll = function(a, b, d) {
        return u(a, b, d, !1)
    };
    b.prototype.rightCompactAll = function(a, b, d) {
        return u(a, b, d, !0)
    };
    b.prototype.associativeFlip = function(a, b) {
        return s(a, b)
    };
    b.prototype.commutativeFlip = function(a, b) {
        var d;
        if ("operator" !== a.type) d = !1;
        else {
            d = a.children;
            if (2 !== d.length) throw "required two-argument operator " + a.value;
            if (!b) {
                var e = d[0];
                d[0] = d[1];
                d[1] = e
            }
            d = !0
        }
        return d
    };
    return b
}();
var ShaderParser = function() {
    function b(a) {
        a = a.charCodeAt(0);
        return 128 > a && e[a]
    }

    function k(a, b, d, e, k) {
        this.start = a;
        this.end = b;
        this.type = d;
        this.value = e;
        this.line_pos = k;
        this.expand_line_count = this.expand_line_pos = 0
    }

    function d(a, b, d, e, k) {
        this.type = a;
        this.h_start = b;
        this.c_start = d;
        this.line_start = e;
        this.line_count = 0;
        this.name = void 0 !== k ? k : "";
        this.trans_code = this.code = null;
        this.is_eval = this.is_empty = !1;
        this.macros = []
    }

    function a() {}
    var e = function() {
        for (var a = Array(128), b = 0; 128 > b; ++b) a[b] = 65 <= b && 90 >= b || 97 <=
            b && 122 >= b || 48 <= b && 57 >= b;
        return a
    }();
    d.prototype.empty = function() {
        return this.is_empty
    };
    a.Shader = d;
    a.Macro = k;
    a.parse = function(a, e, r) {
        e = e || 0;
        r = r || a.length;
        r -= e;
        var u = !0,
        s = 1,
        h = e,
        n = [],
        w = !0;
        for (n.push(new d("e", e, e, 0)); h < r; ++h) {
            var m = a[h];
            if ("/" === m) {
                if (h >= r - 1) throw "Invalid / character at line " + s;
                m = a[h + 1];
                if ("*" === m)
                    for (h += 2; h < r - 1; ++h)
                        if (m = a[h], "*" === m && "/" === a[h + 1]) {
                            ++h;
                            break
                        } else "\n" === m && ++s;
                        else if ("/" === m)
                            for (; h < r - 1 && "\n" !== a[h + 1]; ++h);
                            else w = !1
            } else if ("\n" === m) u = !0, ++s;
            else if ("g" === m) {
                if (w = u = !1, !(h >= r - 3 || "l" !== a[h + 1] || "_" !== a[h + 2] || 0 < h && b(a[h - 1]))) {
                    var v = "gl_";
                    e = h;
                    for (h += 2; h < r - 1; ++h) {
                        m = a[h + 1];
                        if (!b(m)) break;
                        v += m
                    }
                    var m = n[n.length - 1],
                    p = m.c_start;
                    e -= p;
                    p = h + 1 - p;
                    m.macros.push(new k(e, p, "gl_", v, s))
                }
            } else if (u)
                if ("@" === m) {
                    if (h >= r - 1) throw "Invalid shader signature at line " + s;
                    for (v = h; 0 < v && (m = a[v - 1], " " === m || "\t" === m); --v);
                    ++h;
                    e = a[h];
                    if ("f" !== e && "v" !== e && ":" !== e) throw "Unknown shader type @" + e + " at line " + s;
                    ":" !== e && ++h;
                    var y = "";
                    if (h >= r || ":" !== a[h]) {
                        if (m = a[h], "\r" !== m && "\n" !== m && " " !== m && "\t" !==
                            m && "/" !== m) throw "Invalid shader signature at line " + s;
                    } else {
                        for (++h; h < r; ++h)
                            if (m = a[h], "\r" !== m && "\n" !== m && " " !== m && "\t" !== m) y += m;
                            else break;
                            if (":" === e && 0 == y.length) throw "Expected name after @: at line " + s;
                    }
                    for (; h < r && "\n" !== a[h]; ++h);
                    p = h === r ? r : h + 1;
                    --h;
                    m = n[n.length - 1];
                    m.is_empty = w;
                    m.line_count = s - m.line_start;
                    n.push(new d(e, v, p, s, y));
                    w = !0
                } else if ("#" === m) {
                    w = !1;
                    e = h;
                    for (y = ""; h < r - 1; ++h) {
                        m = a[h + 1];
                        if (" " === m || "\t" === m || "\n" === m || "\r" === m) break;
                        y += m
                    }
                    for (var C = p = !1, A = !1, v = ""; h < r - 1; ++h) {
                        m = a[h + 1];
                        if ("\r" === m ||
                            "\n" === m) break;
                        C ? h < r - 2 && "*" === m && "/" === a[h + 2] && (++h, p = C = !1) : "/" === m ? (!p && h < r - 2 && "*" === a[h + 2] && (++h, C = !0), p = !0) : p || (" " === m || "\t" === m ? A = 0 < v.length : (A && (v += " ", A = !1), v += m))
                    }
                    if ("use" === y || "option" === y || "version" === y || "extension" === y || 1 === n.length) m = n[n.length - 1], p = m.c_start, e -= p, p = h + 1 - p, m.macros.push(new k(e, p, y, v, s))
                } else " " !== m && "\t" !== m && (w = u = !1)
        }
        m = n[n.length - 1];
        m.is_empty = w;
        m.line_count = s - m.line_start;
        u = n.length;
        for (s = 0; s < u; ++s) p = n[s].c_start, h = r, s < u - 1 && (h = n[s + 1].h_start), n[s].code = a.substr(p, h -
            p);
        return n
    };
    return a
}();
