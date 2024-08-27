var Dy = Object.defineProperty,
  _y = Object.defineProperties;
var Ey = Object.getOwnPropertyDescriptors;
var qd = Object.getOwnPropertySymbols;
var by = Object.prototype.hasOwnProperty,
  Iy = Object.prototype.propertyIsEnumerable;
var Zd = (t, e, r) =>
    e in t
      ? Dy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  D = (t, e) => {
    for (var r in (e ||= {})) by.call(e, r) && Zd(t, r, e[r]);
    if (qd) for (var r of qd(e)) Iy.call(e, r) && Zd(t, r, e[r]);
    return t;
  },
  q = (t, e) => _y(t, Ey(e));
var ar = (t, e, r) =>
  new Promise((n, i) => {
    var o = (c) => {
        try {
          a(r.next(c));
        } catch (l) {
          i(l);
        }
      },
      s = (c) => {
        try {
          a(r.throw(c));
        } catch (l) {
          i(l);
        }
      },
      a = (c) => (c.done ? n(c.value) : Promise.resolve(c.value).then(o, s));
    a((r = r.apply(t, e)).next());
  });
function Yd(t, e) {
  return Object.is(t, e);
}
var be = null,
  yo = !1,
  Co = 1,
  $t = Symbol("SIGNAL");
function J(t) {
  let e = be;
  return (be = t), e;
}
function Qd() {
  return be;
}
var ci = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function pc(t) {
  if (yo) throw new Error("");
  if (be === null) return;
  be.consumerOnSignalRead(t);
  let e = be.nextProducerIndex++;
  if (
    (Eo(be), e < be.producerNode.length && be.producerNode[e] !== t && ai(be))
  ) {
    let r = be.producerNode[e];
    _o(r, be.producerIndexOfThis[e]);
  }
  be.producerNode[e] !== t &&
    ((be.producerNode[e] = t),
    (be.producerIndexOfThis[e] = ai(be) ? ef(t, be, e) : 0)),
    (be.producerLastReadVersion[e] = t.version);
}
function My() {
  Co++;
}
function Kd(t) {
  if (!(ai(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Co)) {
    if (!t.producerMustRecompute(t) && !mc(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = Co);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Co);
  }
}
function Jd(t) {
  if (t.liveConsumerNode === void 0) return;
  let e = yo;
  yo = !0;
  try {
    for (let r of t.liveConsumerNode) r.dirty || xy(r);
  } finally {
    yo = e;
  }
}
function Xd() {
  return be?.consumerAllowSignalWrites !== !1;
}
function xy(t) {
  (t.dirty = !0), Jd(t), t.consumerMarkedDirty?.(t);
}
function Do(t) {
  return t && (t.nextProducerIndex = 0), J(t);
}
function gc(t, e) {
  if (
    (J(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (ai(t))
      for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
        _o(t.producerNode[r], t.producerIndexOfThis[r]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function mc(t) {
  Eo(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e];
    if (n !== r.version || (Kd(r), n !== r.version)) return !0;
  }
  return !1;
}
function vc(t) {
  if ((Eo(t), ai(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      _o(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function ef(t, e, r) {
  if ((tf(t), t.liveConsumerNode.length === 0 && nf(t)))
    for (let n = 0; n < t.producerNode.length; n++)
      t.producerIndexOfThis[n] = ef(t.producerNode[n], t, n);
  return t.liveConsumerIndexOfThis.push(r), t.liveConsumerNode.push(e) - 1;
}
function _o(t, e) {
  if ((tf(t), t.liveConsumerNode.length === 1 && nf(t)))
    for (let n = 0; n < t.producerNode.length; n++)
      _o(t.producerNode[n], t.producerIndexOfThis[n]);
  let r = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    Eo(i), (i.producerIndexOfThis[n] = e);
  }
}
function ai(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function Eo(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function tf(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function nf(t) {
  return t.producerNode !== void 0;
}
function rf(t) {
  let e = Object.create(Sy);
  e.computation = t;
  let r = () => {
    if ((Kd(e), pc(e), e.value === wo)) throw e.error;
    return e.value;
  };
  return (r[$t] = e), r;
}
var fc = Symbol("UNSET"),
  hc = Symbol("COMPUTING"),
  wo = Symbol("ERRORED"),
  Sy = q(D({}, ci), {
    value: fc,
    dirty: !0,
    error: null,
    equal: Yd,
    producerMustRecompute(t) {
      return t.value === fc || t.value === hc;
    },
    producerRecomputeValue(t) {
      if (t.value === hc) throw new Error("Detected cycle in computations.");
      let e = t.value;
      t.value = hc;
      let r = Do(t),
        n;
      try {
        n = t.computation();
      } catch (i) {
        (n = wo), (t.error = i);
      } finally {
        gc(t, r);
      }
      if (e !== fc && e !== wo && n !== wo && t.equal(e, n)) {
        t.value = e;
        return;
      }
      (t.value = n), t.version++;
    },
  });
function Ty() {
  throw new Error();
}
var of = Ty;
function sf() {
  of();
}
function af(t) {
  of = t;
}
var Ay = null;
function cf(t) {
  let e = Object.create(uf);
  e.value = t;
  let r = () => (pc(e), e.value);
  return (r[$t] = e), r;
}
function yc(t, e) {
  Xd() || sf(), t.equal(t.value, e) || ((t.value = e), Ny(t));
}
function lf(t, e) {
  Xd() || sf(), yc(t, e(t.value));
}
var uf = q(D({}, ci), { equal: Yd, value: void 0 });
function Ny(t) {
  t.version++, My(), Jd(t), Ay?.();
}
function L(t) {
  return typeof t == "function";
}
function cr(t) {
  let r = t((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var bo = cr(
  (t) =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r);
    }
);
function Pn(t, e) {
  if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var pe = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let o of r) o.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (L(n))
        try {
          n();
        } catch (o) {
          e = o instanceof bo ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            df(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof bo ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new bo(e);
    }
  }
  add(e) {
    var r;
    if (e && e !== this)
      if (this.closed) df(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this;
    return r === e || (Array.isArray(r) && r.includes(e));
  }
  _addParent(e) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }
  _removeParent(e) {
    let { _parentage: r } = this;
    r === e ? (this._parentage = null) : Array.isArray(r) && Pn(r, e);
  }
  remove(e) {
    let { _finalizers: r } = this;
    r && Pn(r, e), e instanceof t && e._removeParent(this);
  }
};
pe.EMPTY = (() => {
  let t = new pe();
  return (t.closed = !0), t;
})();
var Cc = pe.EMPTY;
function Io(t) {
  return (
    t instanceof pe ||
    (t && "closed" in t && L(t.remove) && L(t.add) && L(t.unsubscribe))
  );
}
function df(t) {
  L(t) ? t() : t.unsubscribe();
}
var mt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var lr = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = lr;
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r);
  },
  clearTimeout(t) {
    let { delegate: e } = lr;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function Mo(t) {
  lr.setTimeout(() => {
    let { onUnhandledError: e } = mt;
    if (e) e(t);
    else throw t;
  });
}
function li() {}
var ff = wc("C", void 0, void 0);
function hf(t) {
  return wc("E", void 0, t);
}
function pf(t) {
  return wc("N", t, void 0);
}
function wc(t, e, r) {
  return { kind: t, value: e, error: r };
}
var Fn = null;
function ur(t) {
  if (mt.useDeprecatedSynchronousErrorHandling) {
    let e = !Fn;
    if ((e && (Fn = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = Fn;
      if (((Fn = null), r)) throw n;
    }
  } else t();
}
function gf(t) {
  mt.useDeprecatedSynchronousErrorHandling &&
    Fn &&
    ((Fn.errorThrown = !0), (Fn.error = t));
}
var kn = class extends pe {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Io(e) && e.add(this))
          : (this.destination = Py);
    }
    static create(e, r, n) {
      return new dr(e, r, n);
    }
    next(e) {
      this.isStopped ? _c(pf(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? _c(hf(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? _c(ff, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Ry = Function.prototype.bind;
function Dc(t, e) {
  return Ry.call(t, e);
}
var Ec = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(e);
        } catch (n) {
          xo(n);
        }
    }
    error(e) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(e);
        } catch (n) {
          xo(n);
        }
      else xo(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (r) {
          xo(r);
        }
    }
  },
  dr = class extends kn {
    constructor(e, r, n) {
      super();
      let i;
      if (L(e) || !e)
        i = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let o;
        this && mt.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && Dc(e.next, o),
              error: e.error && Dc(e.error, o),
              complete: e.complete && Dc(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new Ec(i);
    }
  };
function xo(t) {
  mt.useDeprecatedSynchronousErrorHandling ? gf(t) : Mo(t);
}
function Oy(t) {
  throw t;
}
function _c(t, e) {
  let { onStoppedNotification: r } = mt;
  r && lr.setTimeout(() => r(t, e));
}
var Py = { closed: !0, next: li, error: Oy, complete: li };
var fr = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function Je(t) {
  return t;
}
function bc(...t) {
  return Ic(t);
}
function Ic(t) {
  return t.length === 0
    ? Je
    : t.length === 1
    ? t[0]
    : function (r) {
        return t.reduce((n, i) => i(n), r);
      };
}
var Y = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new t();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, i) {
      let o = ky(r) ? r : new dr(r, n, i);
      return (
        ur(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = mf(n)),
        new n((i, o) => {
          let s = new dr({
            next: (a) => {
              try {
                r(a);
              } catch (c) {
                o(c), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [fr]() {
      return this;
    }
    pipe(...r) {
      return Ic(r)(this);
    }
    toPromise(r) {
      return (
        (r = mf(r)),
        new r((n, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => n(o)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function mf(t) {
  var e;
  return (e = t ?? mt.Promise) !== null && e !== void 0 ? e : Promise;
}
function Fy(t) {
  return t && L(t.next) && L(t.error) && L(t.complete);
}
function ky(t) {
  return (t && t instanceof kn) || (Fy(t) && Io(t));
}
function Mc(t) {
  return L(t?.lift);
}
function z(t) {
  return (e) => {
    if (Mc(e))
      return e.lift(function (r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function $(t, e, r, n, i) {
  return new xc(t, e, r, n, i);
}
var xc = class extends kn {
  constructor(e, r, n, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (c) {
              e.error(c);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (c) {
              e.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function hr() {
  return z((t, e) => {
    let r = null;
    t._refCount++;
    let n = $(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null;
        return;
      }
      let i = t._connection,
        o = r;
      (r = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(n), n.closed || (r = t.connect());
  });
}
var pr = class extends Y {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Mc(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new pe();
      let r = this.getSubject();
      e.add(
        this.source.subscribe(
          $(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = pe.EMPTY));
    }
    return e;
  }
  refCount() {
    return hr()(this);
  }
};
var vf = cr(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var xe = (() => {
    class t extends Y {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new So(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new vf();
      }
      next(r) {
        ur(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        ur(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        ur(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: o } = this;
        return n || i
          ? Cc
          : ((this.currentObservers = null),
            o.push(r),
            new pe(() => {
              (this.currentObservers = null), Pn(o, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: o } = this;
        n ? r.error(i) : o && r.complete();
      }
      asObservable() {
        let r = new Y();
        return (r.source = this), r;
      }
    }
    return (t.create = (e, r) => new So(e, r)), t;
  })(),
  So = class extends xe {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r);
    }
    next(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    error(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    complete() {
      var e, r;
      (r =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        r === void 0 ||
        r.call(e);
    }
    _subscribe(e) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(e)) !== null && n !== void 0
        ? n
        : Cc;
    }
  };
var Ie = class extends xe {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let r = super._subscribe(e);
    return !r.closed && e.next(this._value), r;
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this;
    if (e) throw r;
    return this._throwIfClosed(), n;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var Sc = {
  now() {
    return (Sc.delegate || Date).now();
  },
  delegate: void 0,
};
var To = class extends pe {
  constructor(e, r) {
    super();
  }
  schedule(e, r = 0) {
    return this;
  }
};
var ui = {
  setInterval(t, e, ...r) {
    let { delegate: n } = ui;
    return n?.setInterval ? n.setInterval(t, e, ...r) : setInterval(t, e, ...r);
  },
  clearInterval(t) {
    let { delegate: e } = ui;
    return (e?.clearInterval || clearInterval)(t);
  },
  delegate: void 0,
};
var Ao = class extends To {
  constructor(e, r) {
    super(e, r), (this.scheduler = e), (this.work = r), (this.pending = !1);
  }
  schedule(e, r = 0) {
    var n;
    if (this.closed) return this;
    this.state = e;
    let i = this.id,
      o = this.scheduler;
    return (
      i != null && (this.id = this.recycleAsyncId(o, i, r)),
      (this.pending = !0),
      (this.delay = r),
      (this.id =
        (n = this.id) !== null && n !== void 0
          ? n
          : this.requestAsyncId(o, this.id, r)),
      this
    );
  }
  requestAsyncId(e, r, n = 0) {
    return ui.setInterval(e.flush.bind(e, this), n);
  }
  recycleAsyncId(e, r, n = 0) {
    if (n != null && this.delay === n && this.pending === !1) return r;
    r != null && ui.clearInterval(r);
  }
  execute(e, r) {
    if (this.closed) return new Error("executing a cancelled action");
    this.pending = !1;
    let n = this._execute(e, r);
    if (n) return n;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(e, r) {
    let n = !1,
      i;
    try {
      this.work(e);
    } catch (o) {
      (n = !0), (i = o || new Error("Scheduled action threw falsy error"));
    }
    if (n) return this.unsubscribe(), i;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: e, scheduler: r } = this,
        { actions: n } = r;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        Pn(n, this),
        e != null && (this.id = this.recycleAsyncId(r, e, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var gr = class t {
  constructor(e, r = t.now) {
    (this.schedulerActionCtor = e), (this.now = r);
  }
  schedule(e, r = 0, n) {
    return new this.schedulerActionCtor(this, e).schedule(n, r);
  }
};
gr.now = Sc.now;
var No = class extends gr {
  constructor(e, r = gr.now) {
    super(e, r), (this.actions = []), (this._active = !1);
  }
  flush(e) {
    let { actions: r } = this;
    if (this._active) {
      r.push(e);
      return;
    }
    let n;
    this._active = !0;
    do if ((n = e.execute(e.state, e.delay))) break;
    while ((e = r.shift()));
    if (((this._active = !1), n)) {
      for (; (e = r.shift()); ) e.unsubscribe();
      throw n;
    }
  }
};
var yf = new No(Ao);
var Xe = new Y((t) => t.complete());
function Cf(t) {
  return t && L(t.schedule);
}
function wf(t) {
  return t[t.length - 1];
}
function Ro(t) {
  return L(wf(t)) ? t.pop() : void 0;
}
function ln(t) {
  return Cf(wf(t)) ? t.pop() : void 0;
}
function _f(t, e, r, n) {
  function i(o) {
    return o instanceof r
      ? o
      : new r(function (s) {
          s(o);
        });
  }
  return new (r || (r = Promise))(function (o, s) {
    function a(u) {
      try {
        l(n.next(u));
      } catch (h) {
        s(h);
      }
    }
    function c(u) {
      try {
        l(n.throw(u));
      } catch (h) {
        s(h);
      }
    }
    function l(u) {
      u.done ? o(u.value) : i(u.value).then(a, c);
    }
    l((n = n.apply(t, e || [])).next());
  });
}
function Df(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Ln(t) {
  return this instanceof Ln ? ((this.v = t), this) : new Ln(t);
}
function Ef(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    a("next"),
    a("throw"),
    a("return", s),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(g) {
    return function (w) {
      return Promise.resolve(w).then(g, h);
    };
  }
  function a(g, w) {
    n[g] &&
      ((i[g] = function (O) {
        return new Promise(function (N, R) {
          o.push([g, O, N, R]) > 1 || c(g, O);
        });
      }),
      w && (i[g] = w(i[g])));
  }
  function c(g, w) {
    try {
      l(n[g](w));
    } catch (O) {
      m(o[0][3], O);
    }
  }
  function l(g) {
    g.value instanceof Ln
      ? Promise.resolve(g.value.v).then(u, h)
      : m(o[0][2], g);
  }
  function u(g) {
    c("next", g);
  }
  function h(g) {
    c("throw", g);
  }
  function m(g, w) {
    g(w), o.shift(), o.length && c(o[0][0], o[0][1]);
  }
}
function bf(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    r;
  return e
    ? e.call(t)
    : ((t = typeof Df == "function" ? Df(t) : t[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(o) {
    r[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = t[o](s)), i(a, c, s.done, s.value);
        });
      };
  }
  function i(o, s, a, c) {
    Promise.resolve(c).then(function (l) {
      o({ value: l, done: a });
    }, s);
  }
}
var Oo = (t) => t && typeof t.length == "number" && typeof t != "function";
function Po(t) {
  return L(t?.then);
}
function Fo(t) {
  return L(t[fr]);
}
function ko(t) {
  return Symbol.asyncIterator && L(t?.[Symbol.asyncIterator]);
}
function Lo(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function Ly() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Vo = Ly();
function jo(t) {
  return L(t?.[Vo]);
}
function Uo(t) {
  return Ef(this, arguments, function* () {
    let r = t.getReader();
    try {
      for (;;) {
        let { value: n, done: i } = yield Ln(r.read());
        if (i) return yield Ln(void 0);
        yield yield Ln(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function Bo(t) {
  return L(t?.getReader);
}
function Ce(t) {
  if (t instanceof Y) return t;
  if (t != null) {
    if (Fo(t)) return Vy(t);
    if (Oo(t)) return jy(t);
    if (Po(t)) return Uy(t);
    if (ko(t)) return If(t);
    if (jo(t)) return By(t);
    if (Bo(t)) return $y(t);
  }
  throw Lo(t);
}
function Vy(t) {
  return new Y((e) => {
    let r = t[fr]();
    if (L(r.subscribe)) return r.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function jy(t) {
  return new Y((e) => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
    e.complete();
  });
}
function Uy(t) {
  return new Y((e) => {
    t.then(
      (r) => {
        e.closed || (e.next(r), e.complete());
      },
      (r) => e.error(r)
    ).then(null, Mo);
  });
}
function By(t) {
  return new Y((e) => {
    for (let r of t) if ((e.next(r), e.closed)) return;
    e.complete();
  });
}
function If(t) {
  return new Y((e) => {
    Hy(t, e).catch((r) => e.error(r));
  });
}
function $y(t) {
  return If(Uo(t));
}
function Hy(t, e) {
  var r, n, i, o;
  return _f(this, void 0, void 0, function* () {
    try {
      for (r = bf(t); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        n && !n.done && (o = r.return) && (yield o.call(r));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function Ge(t, e, r, n = 0, i = !1) {
  let o = e.schedule(function () {
    r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((t.add(o), !i)) return o;
}
function $o(t, e = 0) {
  return z((r, n) => {
    r.subscribe(
      $(
        n,
        (i) => Ge(n, t, () => n.next(i), e),
        () => Ge(n, t, () => n.complete(), e),
        (i) => Ge(n, t, () => n.error(i), e)
      )
    );
  });
}
function Ho(t, e = 0) {
  return z((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e));
  });
}
function Mf(t, e) {
  return Ce(t).pipe(Ho(e), $o(e));
}
function xf(t, e) {
  return Ce(t).pipe(Ho(e), $o(e));
}
function Sf(t, e) {
  return new Y((r) => {
    let n = 0;
    return e.schedule(function () {
      n === t.length
        ? r.complete()
        : (r.next(t[n++]), r.closed || this.schedule());
    });
  });
}
function Tf(t, e) {
  return new Y((r) => {
    let n;
    return (
      Ge(r, e, () => {
        (n = t[Vo]()),
          Ge(
            r,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              o ? r.complete() : r.next(i);
            },
            0,
            !0
          );
      }),
      () => L(n?.return) && n.return()
    );
  });
}
function zo(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new Y((r) => {
    Ge(r, e, () => {
      let n = t[Symbol.asyncIterator]();
      Ge(
        r,
        e,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Af(t, e) {
  return zo(Uo(t), e);
}
function Nf(t, e) {
  if (t != null) {
    if (Fo(t)) return Mf(t, e);
    if (Oo(t)) return Sf(t, e);
    if (Po(t)) return xf(t, e);
    if (ko(t)) return zo(t, e);
    if (jo(t)) return Tf(t, e);
    if (Bo(t)) return Af(t, e);
  }
  throw Lo(t);
}
function de(t, e) {
  return e ? Nf(t, e) : Ce(t);
}
function F(...t) {
  let e = ln(t);
  return de(t, e);
}
function mr(t, e) {
  let r = L(t) ? t : () => t,
    n = (i) => i.error(r());
  return new Y(e ? (i) => e.schedule(n, 0, i) : n);
}
function Tc(t) {
  return !!t && (t instanceof Y || (L(t.lift) && L(t.subscribe)));
}
var Ht = cr(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function V(t, e) {
  return z((r, n) => {
    let i = 0;
    r.subscribe(
      $(n, (o) => {
        n.next(t.call(e, o, i++));
      })
    );
  });
}
var { isArray: zy } = Array;
function Gy(t, e) {
  return zy(e) ? t(...e) : t(e);
}
function Go(t) {
  return V((e) => Gy(t, e));
}
var { isArray: Wy } = Array,
  { getPrototypeOf: qy, prototype: Zy, keys: Yy } = Object;
function Wo(t) {
  if (t.length === 1) {
    let e = t[0];
    if (Wy(e)) return { args: e, keys: null };
    if (Qy(e)) {
      let r = Yy(e);
      return { args: r.map((n) => e[n]), keys: r };
    }
  }
  return { args: t, keys: null };
}
function Qy(t) {
  return t && typeof t == "object" && qy(t) === Zy;
}
function qo(t, e) {
  return t.reduce((r, n, i) => ((r[n] = e[i]), r), {});
}
function di(...t) {
  let e = ln(t),
    r = Ro(t),
    { args: n, keys: i } = Wo(t);
  if (n.length === 0) return de([], e);
  let o = new Y(Ky(n, e, i ? (s) => qo(i, s) : Je));
  return r ? o.pipe(Go(r)) : o;
}
function Ky(t, e, r = Je) {
  return (n) => {
    Rf(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let c = 0; c < i; c++)
          Rf(
            e,
            () => {
              let l = de(t[c], e),
                u = !1;
              l.subscribe(
                $(
                  n,
                  (h) => {
                    (o[c] = h), u || ((u = !0), a--), a || n.next(r(o.slice()));
                  },
                  () => {
                    --s || n.complete();
                  }
                )
              );
            },
            n
          );
      },
      n
    );
  };
}
function Rf(t, e, r) {
  t ? Ge(r, t, e) : e();
}
function Of(t, e, r, n, i, o, s, a) {
  let c = [],
    l = 0,
    u = 0,
    h = !1,
    m = () => {
      h && !c.length && !l && e.complete();
    },
    g = (O) => (l < n ? w(O) : c.push(O)),
    w = (O) => {
      o && e.next(O), l++;
      let N = !1;
      Ce(r(O, u++)).subscribe(
        $(
          e,
          (R) => {
            i?.(R), o ? g(R) : e.next(R);
          },
          () => {
            N = !0;
          },
          void 0,
          () => {
            if (N)
              try {
                for (l--; c.length && l < n; ) {
                  let R = c.shift();
                  s ? Ge(e, s, () => w(R)) : w(R);
                }
                m();
              } catch (R) {
                e.error(R);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      $(e, g, () => {
        (h = !0), m();
      })
    ),
    () => {
      a?.();
    }
  );
}
function we(t, e, r = 1 / 0) {
  return L(e)
    ? we((n, i) => V((o, s) => e(n, o, i, s))(Ce(t(n, i))), r)
    : (typeof e == "number" && (r = e), z((n, i) => Of(n, i, t, r)));
}
function vr(t = 1 / 0) {
  return we(Je, t);
}
function Pf() {
  return vr(1);
}
function yr(...t) {
  return Pf()(de(t, ln(t)));
}
function Zo(t) {
  return new Y((e) => {
    Ce(t()).subscribe(e);
  });
}
function Ac(...t) {
  let e = Ro(t),
    { args: r, keys: n } = Wo(t),
    i = new Y((o) => {
      let { length: s } = r;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        l = s;
      for (let u = 0; u < s; u++) {
        let h = !1;
        Ce(r[u]).subscribe(
          $(
            o,
            (m) => {
              h || ((h = !0), l--), (a[u] = m);
            },
            () => c--,
            void 0,
            () => {
              (!c || !h) && (l || o.next(n ? qo(n, a) : a), o.complete());
            }
          )
        );
      }
    });
  return e ? i.pipe(Go(e)) : i;
}
function We(t, e) {
  return z((r, n) => {
    let i = 0;
    r.subscribe($(n, (o) => t.call(e, o, i++) && n.next(o)));
  });
}
function un(t) {
  return z((e, r) => {
    let n = null,
      i = !1,
      o;
    (n = e.subscribe(
      $(r, void 0, void 0, (s) => {
        (o = Ce(t(s, un(t)(e)))),
          n ? (n.unsubscribe(), (n = null), o.subscribe(r)) : (i = !0);
      })
    )),
      i && (n.unsubscribe(), (n = null), o.subscribe(r));
  });
}
function Ff(t, e, r, n, i) {
  return (o, s) => {
    let a = r,
      c = e,
      l = 0;
    o.subscribe(
      $(
        s,
        (u) => {
          let h = l++;
          (c = a ? t(c, u, h) : ((a = !0), u)), n && s.next(c);
        },
        i &&
          (() => {
            a && s.next(c), s.complete();
          })
      )
    );
  };
}
function zt(t, e) {
  return L(e) ? we(t, e, 1) : we(t, 1);
}
function Yo(t, e = yf) {
  return z((r, n) => {
    let i = null,
      o = null,
      s = null,
      a = () => {
        if (i) {
          i.unsubscribe(), (i = null);
          let l = o;
          (o = null), n.next(l);
        }
      };
    function c() {
      let l = s + t,
        u = e.now();
      if (u < l) {
        (i = this.schedule(void 0, l - u)), n.add(i);
        return;
      }
      a();
    }
    r.subscribe(
      $(
        n,
        (l) => {
          (o = l), (s = e.now()), i || ((i = e.schedule(c, t)), n.add(i));
        },
        () => {
          a(), n.complete();
        },
        void 0,
        () => {
          o = i = null;
        }
      )
    );
  });
}
function dn(t) {
  return z((e, r) => {
    let n = !1;
    e.subscribe(
      $(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => {
          n || r.next(t), r.complete();
        }
      )
    );
  });
}
function Gt(t) {
  return t <= 0
    ? () => Xe
    : z((e, r) => {
        let n = 0;
        e.subscribe(
          $(r, (i) => {
            ++n <= t && (r.next(i), t <= n && r.complete());
          })
        );
      });
}
function Nc(t) {
  return V(() => t);
}
function Qo(t = Jy) {
  return z((e, r) => {
    let n = !1;
    e.subscribe(
      $(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => (n ? r.complete() : r.error(t()))
      )
    );
  });
}
function Jy() {
  return new Ht();
}
function fn(t) {
  return z((e, r) => {
    try {
      e.subscribe(r);
    } finally {
      r.add(t);
    }
  });
}
function xt(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? We((i, o) => t(i, o, n)) : Je,
      Gt(1),
      r ? dn(e) : Qo(() => new Ht())
    );
}
function Cr(t) {
  return t <= 0
    ? () => Xe
    : z((e, r) => {
        let n = [];
        e.subscribe(
          $(
            r,
            (i) => {
              n.push(i), t < n.length && n.shift();
            },
            () => {
              for (let i of n) r.next(i);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            }
          )
        );
      });
}
function Rc(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? We((i, o) => t(i, o, n)) : Je,
      Cr(1),
      r ? dn(e) : Qo(() => new Ht())
    );
}
function Oc(t, e) {
  return z(Ff(t, e, arguments.length >= 2, !0));
}
function Pc(...t) {
  let e = ln(t);
  return z((r, n) => {
    (e ? yr(t, r, e) : yr(t, r)).subscribe(n);
  });
}
function Re(t, e) {
  return z((r, n) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && n.complete();
    r.subscribe(
      $(
        n,
        (c) => {
          i?.unsubscribe();
          let l = 0,
            u = o++;
          Ce(t(c, u)).subscribe(
            (i = $(
              n,
              (h) => n.next(e ? e(c, h, u, l++) : h),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function Fc(t) {
  return z((e, r) => {
    Ce(t).subscribe($(r, () => r.complete(), li)), !r.closed && e.subscribe(r);
  });
}
function Se(t, e, r) {
  let n = L(t) || e || r ? { next: t, error: e, complete: r } : t;
  return n
    ? z((i, o) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        i.subscribe(
          $(
            o,
            (c) => {
              var l;
              (l = n.next) === null || l === void 0 || l.call(n, c), o.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = n.complete) === null || c === void 0 || c.call(n),
                o.complete();
            },
            (c) => {
              var l;
              (a = !1),
                (l = n.error) === null || l === void 0 || l.call(n, c),
                o.error(c);
            },
            () => {
              var c, l;
              a && ((c = n.unsubscribe) === null || c === void 0 || c.call(n)),
                (l = n.finalize) === null || l === void 0 || l.call(n);
            }
          )
        );
      })
    : Je;
}
var _h = "https://g.co/ng/security#xss",
  A = class extends Error {
    constructor(e, r) {
      super(Os(e, r)), (this.code = e);
    }
  };
function Os(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
function _i(t) {
  return { toString: t }.toString();
}
var Ko = "__parameters__";
function Xy(t) {
  return function (...r) {
    if (t) {
      let n = t(...r);
      for (let i in n) this[i] = n[i];
    }
  };
}
function Eh(t, e, r) {
  return _i(() => {
    let n = Xy(e);
    function i(...o) {
      if (this instanceof i) return n.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(c, l, u) {
        let h = c.hasOwnProperty(Ko)
          ? c[Ko]
          : Object.defineProperty(c, Ko, { value: [] })[Ko];
        for (; h.length <= u; ) h.push(null);
        return (h[u] = h[u] || []).push(s), c;
      }
    }
    return (
      r && (i.prototype = Object.create(r.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
var Ve = globalThis;
function oe(t) {
  for (let e in t) if (t[e] === oe) return e;
  throw Error("Could not find renamed property on target object.");
}
function e0(t, e) {
  for (let r in e) e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r]);
}
function Ue(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(Ue).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let r = e.indexOf(`
`);
  return r === -1 ? e : e.substring(0, r);
}
function kf(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var t0 = oe({ __forward_ref__: oe });
function dt(t) {
  return (
    (t.__forward_ref__ = dt),
    (t.toString = function () {
      return Ue(this());
    }),
    t
  );
}
function je(t) {
  return bh(t) ? t() : t;
}
function bh(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(t0) && t.__forward_ref__ === dt
  );
}
function b(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function Oe(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function Ps(t) {
  return Lf(t, Mh) || Lf(t, xh);
}
function Ih(t) {
  return Ps(t) !== null;
}
function Lf(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function n0(t) {
  let e = t && (t[Mh] || t[xh]);
  return e || null;
}
function Vf(t) {
  return t && (t.hasOwnProperty(jf) || t.hasOwnProperty(r0)) ? t[jf] : null;
}
var Mh = oe({ ɵprov: oe }),
  jf = oe({ ɵinj: oe }),
  xh = oe({ ngInjectableDef: oe }),
  r0 = oe({ ngInjectorDef: oe }),
  x = class {
    constructor(e, r) {
      (this._desc = e),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof r == "number"
          ? (this.__NG_ELEMENT_ID__ = r)
          : r !== void 0 &&
            (this.ɵprov = b({
              token: this,
              providedIn: r.providedIn || "root",
              factory: r.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Sh(t) {
  return t && !!t.ɵproviders;
}
var i0 = oe({ ɵcmp: oe }),
  o0 = oe({ ɵdir: oe }),
  s0 = oe({ ɵpipe: oe }),
  a0 = oe({ ɵmod: oe }),
  ss = oe({ ɵfac: oe }),
  hi = oe({ __NG_ELEMENT_ID__: oe }),
  Uf = oe({ __NG_ENV_ID__: oe });
function Un(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function c0(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : Un(t);
}
function l0(t, e) {
  let r = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new A(-200, t);
}
function Fl(t, e) {
  throw new A(-201, !1);
}
var U = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(U || {}),
  Qc;
function Th() {
  return Qc;
}
function qe(t) {
  let e = Qc;
  return (Qc = t), e;
}
function Ah(t, e, r) {
  let n = Ps(t);
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & U.Optional) return null;
  if (e !== void 0) return e;
  Fl(t, "Injector");
}
var u0 = {},
  gi = u0,
  Kc = "__NG_DI_FLAG__",
  as = "ngTempTokenPath",
  d0 = "ngTokenPath",
  f0 = /\n/gm,
  h0 = "\u0275",
  Bf = "__source",
  Er;
function p0() {
  return Er;
}
function hn(t) {
  let e = Er;
  return (Er = t), e;
}
function g0(t, e = U.Default) {
  if (Er === void 0) throw new A(-203, !1);
  return Er === null
    ? Ah(t, void 0, e)
    : Er.get(t, e & U.Optional ? null : void 0, e);
}
function T(t, e = U.Default) {
  return (Th() || g0)(je(t), e);
}
function C(t, e = U.Default) {
  return T(t, Fs(e));
}
function Fs(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Jc(t) {
  let e = [];
  for (let r = 0; r < t.length; r++) {
    let n = je(t[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new A(900, !1);
      let i,
        o = U.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          c = m0(a);
        typeof c == "number" ? (c === -1 ? (i = a.token) : (o |= c)) : (i = a);
      }
      e.push(T(i, o));
    } else e.push(T(n));
  }
  return e;
}
function Nh(t, e) {
  return (t[Kc] = e), (t.prototype[Kc] = e), t;
}
function m0(t) {
  return t[Kc];
}
function v0(t, e, r, n) {
  let i = t[as];
  throw (
    (e[Bf] && i.unshift(e[Bf]),
    (t.message = y0(
      `
` + t.message,
      i,
      r,
      n
    )),
    (t[d0] = i),
    (t[as] = null),
    t)
  );
}
function y0(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == h0
      ? t.slice(2)
      : t;
  let i = Ue(e);
  if (Array.isArray(e)) i = e.map(Ue).join(" -> ");
  else if (typeof e == "object") {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : Ue(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${r}${n ? "(" + n + ")" : ""}[${i}]: ${t.replace(
    f0,
    `
  `
  )}`;
}
var ks = Nh(Eh("Optional"), 8);
var kl = Nh(Eh("SkipSelf"), 4);
function $n(t, e) {
  let r = t.hasOwnProperty(ss);
  return r ? t[ss] : null;
}
function Ll(t, e) {
  t.forEach((r) => (Array.isArray(r) ? Ll(r, e) : e(r)));
}
function Rh(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function cs(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function C0(t, e, r, n) {
  let i = t.length;
  if (i == e) t.push(r, n);
  else if (i === 1) t.push(n, t[0]), (t[0] = r);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = r), (t[e + 1] = n);
  }
}
function w0(t, e, r) {
  let n = Ei(t, e);
  return n >= 0 ? (t[n | 1] = r) : ((n = ~n), C0(t, n, e, r)), n;
}
function kc(t, e) {
  let r = Ei(t, e);
  if (r >= 0) return t[r | 1];
}
function Ei(t, e) {
  return D0(t, e, 1);
}
function D0(t, e, r) {
  let n = 0,
    i = t.length >> r;
  for (; i !== n; ) {
    let o = n + ((i - n) >> 1),
      s = t[o << r];
    if (e === s) return o << r;
    s > e ? (i = o) : (n = o + 1);
  }
  return ~(i << r);
}
var Ir = {},
  ct = [],
  Mr = new x(""),
  Oh = new x("", -1),
  Ph = new x(""),
  ls = class {
    get(e, r = gi) {
      if (r === gi) {
        let n = new Error(`NullInjectorError: No provider for ${Ue(e)}!`);
        throw ((n.name = "NullInjectorError"), n);
      }
      return r;
    }
  },
  Fh = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(Fh || {}),
  At = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(At || {}),
  mn = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(mn || {});
function _0(t, e, r) {
  let n = t.length;
  for (;;) {
    let i = t.indexOf(e, r);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === n || t.charCodeAt(i + o) <= 32) return i;
    }
    r = i + 1;
  }
}
function Xc(t, e, r) {
  let n = 0;
  for (; n < r.length; ) {
    let i = r[n];
    if (typeof i == "number") {
      if (i !== 0) break;
      n++;
      let o = r[n++],
        s = r[n++],
        a = r[n++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = r[++n];
      E0(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), n++;
    }
  }
  return n;
}
function kh(t) {
  return t === 3 || t === 4 || t === 6;
}
function E0(t) {
  return t.charCodeAt(0) === 64;
}
function mi(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let r = -1;
      for (let n = 0; n < e.length; n++) {
        let i = e[n];
        typeof i == "number"
          ? (r = i)
          : r === 0 ||
            (r === -1 || r === 2
              ? $f(t, r, i, null, e[++n])
              : $f(t, r, i, null, null));
      }
    }
  return t;
}
function $f(t, e, r, n, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == "number") break;
    if (a === r) {
      if (n === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (n === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, n !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, r),
    n !== null && t.splice(o++, 0, n),
    i !== null && t.splice(o++, 0, i);
}
var Lh = "ng-template";
function b0(t, e, r, n) {
  let i = 0;
  if (n) {
    for (; i < e.length && typeof e[i] == "string"; i += 2)
      if (e[i] === "class" && _0(e[i + 1].toLowerCase(), r, 0) !== -1)
        return !0;
  } else if (Vl(t)) return !1;
  if (((i = e.indexOf(1, i)), i > -1)) {
    let o;
    for (; ++i < e.length && typeof (o = e[i]) == "string"; )
      if (o.toLowerCase() === r) return !0;
  }
  return !1;
}
function Vl(t) {
  return t.type === 4 && t.value !== Lh;
}
function I0(t, e, r) {
  let n = t.type === 4 && !r ? Lh : t.value;
  return e === n;
}
function M0(t, e, r) {
  let n = 4,
    i = t.attrs,
    o = i !== null ? T0(i) : 0,
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == "number") {
      if (!s && !vt(n) && !vt(c)) return !1;
      if (s && vt(c)) continue;
      (s = !1), (n = c | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (c !== "" && !I0(t, c, r)) || (c === "" && e.length === 1))
        ) {
          if (vt(n)) return !1;
          s = !0;
        }
      } else if (n & 8) {
        if (i === null || !b0(t, i, c, r)) {
          if (vt(n)) return !1;
          s = !0;
        }
      } else {
        let l = e[++a],
          u = x0(c, i, Vl(t), r);
        if (u === -1) {
          if (vt(n)) return !1;
          s = !0;
          continue;
        }
        if (l !== "") {
          let h;
          if (
            (u > o ? (h = "") : (h = i[u + 1].toLowerCase()), n & 2 && l !== h)
          ) {
            if (vt(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return vt(n) || s;
}
function vt(t) {
  return (t & 1) === 0;
}
function x0(t, e, r, n) {
  if (e === null) return -1;
  let i = 0;
  if (n || !r) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return A0(e, t);
}
function S0(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if (M0(t, e[n], r)) return !0;
  return !1;
}
function T0(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e];
    if (kh(r)) return e;
  }
  return t.length;
}
function A0(t, e) {
  let r = t.indexOf(4);
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r];
      if (typeof n == "number") return -1;
      if (n === e) return r;
      r++;
    }
  return -1;
}
function Hf(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function N0(t) {
  let e = t[0],
    r = 1,
    n = 2,
    i = "",
    o = !1;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      if (n & 2) {
        let a = t[++r];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else n & 8 ? (i += "." + s) : n & 4 && (i += " " + s);
    else
      i !== "" && !vt(s) && ((e += Hf(o, i)), (i = "")),
        (n = s),
        (o = o || !vt(n));
    r++;
  }
  return i !== "" && (e += Hf(o, i)), e;
}
function R0(t) {
  return t.map(N0).join(",");
}
function O0(t) {
  let e = [],
    r = [],
    n = 1,
    i = 2;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++n]) : i === 8 && r.push(o);
    else {
      if (!vt(i)) break;
      i = o;
    }
    n++;
  }
  return { attrs: e, classes: r };
}
function Q(t) {
  return _i(() => {
    let e = $h(t),
      r = q(D({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Fh.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || At.Emulated,
        styles: t.styles || ct,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    Hh(r);
    let n = t.dependencies;
    return (
      (r.directiveDefs = Gf(n, !1)), (r.pipeDefs = Gf(n, !0)), (r.id = k0(r)), r
    );
  });
}
function P0(t) {
  return vn(t) || Vh(t);
}
function F0(t) {
  return t !== null;
}
function Pe(t) {
  return _i(() => ({
    type: t.type,
    bootstrap: t.bootstrap || ct,
    declarations: t.declarations || ct,
    imports: t.imports || ct,
    exports: t.exports || ct,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function zf(t, e) {
  if (t == null) return Ir;
  let r = {};
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let i = t[n],
        o,
        s,
        a = mn.None;
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        e ? ((r[o] = a !== mn.None ? [n, a] : n), (e[o] = s)) : (r[o] = n);
    }
  return r;
}
function fe(t) {
  return _i(() => {
    let e = $h(t);
    return Hh(e), e;
  });
}
function jl(t) {
  return {
    type: t.type,
    name: t.name,
    factory: null,
    pure: t.pure !== !1,
    standalone: t.standalone === !0,
    onDestroy: t.type.prototype.ngOnDestroy || null,
  };
}
function vn(t) {
  return t[i0] || null;
}
function Vh(t) {
  return t[o0] || null;
}
function jh(t) {
  return t[s0] || null;
}
function Uh(t) {
  let e = vn(t) || Vh(t) || jh(t);
  return e !== null ? e.standalone : !1;
}
function Bh(t, e) {
  let r = t[a0] || null;
  if (!r && e === !0)
    throw new Error(`Type ${Ue(t)} does not have '\u0275mod' property.`);
  return r;
}
function $h(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || Ir,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || ct,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: zf(t.inputs, e),
    outputs: zf(t.outputs),
    debugInfo: null,
  };
}
function Hh(t) {
  t.features?.forEach((e) => e(t));
}
function Gf(t, e) {
  if (!t) return null;
  let r = e ? jh : P0;
  return () => (typeof t == "function" ? t() : t).map((n) => r(n)).filter(F0);
}
function k0(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of r) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), "c" + e;
}
function Ls(t) {
  return { ɵproviders: t };
}
function L0(...t) {
  return { ɵproviders: zh(!0, t), ɵfromNgModule: !0 };
}
function zh(t, ...e) {
  let r = [],
    n = new Set(),
    i,
    o = (s) => {
      r.push(s);
    };
  return (
    Ll(e, (s) => {
      let a = s;
      el(a, o, [], n) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && Gh(i, o),
    r
  );
}
function Gh(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: i } = t[r];
    Ul(i, (o) => {
      e(o, n);
    });
  }
}
function el(t, e, r, n) {
  if (((t = je(t)), !t)) return !1;
  let i = null,
    o = Vf(t),
    s = !o && vn(t);
  if (!o && !s) {
    let c = t.ngModule;
    if (((o = Vf(c)), o)) i = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = n.has(i);
  if (s) {
    if (a) return !1;
    if ((n.add(i), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let l of c) el(l, e, r, n);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      n.add(i);
      let l;
      try {
        Ll(o.imports, (u) => {
          el(u, e, r, n) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && Gh(l, e);
    }
    if (!a) {
      let l = $n(i) || (() => new i());
      e({ provide: i, useFactory: l, deps: ct }, i),
        e({ provide: Ph, useValue: i, multi: !0 }, i),
        e({ provide: Mr, useValue: () => T(i), multi: !0 }, i);
    }
    let c = o.providers;
    if (c != null && !a) {
      let l = t;
      Ul(c, (u) => {
        e(u, l);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function Ul(t, e) {
  for (let r of t)
    Sh(r) && (r = r.ɵproviders), Array.isArray(r) ? Ul(r, e) : e(r);
}
var V0 = oe({ provide: String, useValue: oe });
function Wh(t) {
  return t !== null && typeof t == "object" && V0 in t;
}
function j0(t) {
  return !!(t && t.useExisting);
}
function U0(t) {
  return !!(t && t.useFactory);
}
function xr(t) {
  return typeof t == "function";
}
function B0(t) {
  return !!t.useClass;
}
var Vs = new x(""),
  ns = {},
  $0 = {},
  Lc;
function Bl() {
  return Lc === void 0 && (Lc = new ls()), Lc;
}
var Be = class {},
  vi = class extends Be {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        nl(e, (s) => this.processProvider(s)),
        this.records.set(Oh, wr(void 0, this)),
        i.has("environment") && this.records.set(Be, wr(void 0, this));
      let o = this.records.get(Vs);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(Ph, ct, U.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let e = J(null);
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy();
        let r = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let n of r) n();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          J(e);
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let r = hn(this),
        n = qe(void 0),
        i;
      try {
        return e();
      } finally {
        hn(r), qe(n);
      }
    }
    get(e, r = gi, n = U.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Uf))) return e[Uf](this);
      n = Fs(n);
      let i,
        o = hn(this),
        s = qe(void 0);
      try {
        if (!(n & U.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let l = q0(e) && Ps(e);
            l && this.injectableDefInScope(l)
              ? (c = wr(tl(e), ns))
              : (c = null),
              this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = n & U.Self ? Bl() : this.parent;
        return (r = n & U.Optional && r === gi ? null : r), a.get(e, r);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[as] = a[as] || []).unshift(Ue(e)), o)) throw a;
          return v0(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        qe(s), hn(o);
      }
    }
    resolveInjectorInitializers() {
      let e = J(null),
        r = hn(this),
        n = qe(void 0),
        i;
      try {
        let o = this.get(Mr, ct, U.Self);
        for (let s of o) s();
      } finally {
        hn(r), qe(n), J(e);
      }
    }
    toString() {
      let e = [],
        r = this.records;
      for (let n of r.keys()) e.push(Ue(n));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new A(205, !1);
    }
    processProvider(e) {
      e = je(e);
      let r = xr(e) ? e : je(e && e.provide),
        n = z0(e);
      if (!xr(e) && e.multi === !0) {
        let i = this.records.get(r);
        i ||
          ((i = wr(void 0, ns, !0)),
          (i.factory = () => Jc(i.multi)),
          this.records.set(r, i)),
          (r = e),
          i.multi.push(e);
      }
      this.records.set(r, n);
    }
    hydrate(e, r) {
      let n = J(null);
      try {
        return (
          r.value === ns && ((r.value = $0), (r.value = r.factory())),
          typeof r.value == "object" &&
            r.value &&
            W0(r.value) &&
            this._ngOnDestroyHooks.add(r.value),
          r.value
        );
      } finally {
        J(n);
      }
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let r = je(e.providedIn);
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function tl(t) {
  let e = Ps(t),
    r = e !== null ? e.factory : $n(t);
  if (r !== null) return r;
  if (t instanceof x) throw new A(204, !1);
  if (t instanceof Function) return H0(t);
  throw new A(204, !1);
}
function H0(t) {
  if (t.length > 0) throw new A(204, !1);
  let r = n0(t);
  return r !== null ? () => r.factory(t) : () => new t();
}
function z0(t) {
  if (Wh(t)) return wr(void 0, t.useValue);
  {
    let e = qh(t);
    return wr(e, ns);
  }
}
function qh(t, e, r) {
  let n;
  if (xr(t)) {
    let i = je(t);
    return $n(i) || tl(i);
  } else if (Wh(t)) n = () => je(t.useValue);
  else if (U0(t)) n = () => t.useFactory(...Jc(t.deps || []));
  else if (j0(t)) n = () => T(je(t.useExisting));
  else {
    let i = je(t && (t.useClass || t.provide));
    if (G0(t)) n = () => new i(...Jc(t.deps));
    else return $n(i) || tl(i);
  }
  return n;
}
function wr(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 };
}
function G0(t) {
  return !!t.deps;
}
function W0(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function q0(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof x);
}
function nl(t, e) {
  for (let r of t)
    Array.isArray(r) ? nl(r, e) : r && Sh(r) ? nl(r.ɵproviders, e) : e(r);
}
function nt(t, e) {
  t instanceof vi && t.assertNotDestroyed();
  let r,
    n = hn(t),
    i = qe(void 0);
  try {
    return e();
  } finally {
    hn(n), qe(i);
  }
}
function Zh() {
  return Th() !== void 0 || p0() != null;
}
function Z0(t) {
  if (!Zh()) throw new A(-203, !1);
}
function Y0(t) {
  let e = Ve.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function Q0(t) {
  return typeof t == "function";
}
var Yt = 0,
  H = 1,
  k = 2,
  $e = 3,
  yt = 4,
  wt = 5,
  us = 6,
  ds = 7,
  Ct = 8,
  Sr = 9,
  Nt = 10,
  me = 11,
  yi = 12,
  Wf = 13,
  Vr = 14,
  Rt = 15,
  Tr = 16,
  Dr = 17,
  Ar = 18,
  js = 19,
  Yh = 20,
  pn = 21,
  Vc = 22,
  lt = 23,
  et = 25,
  Qh = 1;
var Hn = 7,
  fs = 8,
  hs = 9,
  ut = 10,
  ps = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(ps || {});
function gn(t) {
  return Array.isArray(t) && typeof t[Qh] == "object";
}
function Qt(t) {
  return Array.isArray(t) && t[Qh] === !0;
}
function $l(t) {
  return (t.flags & 4) !== 0;
}
function Us(t) {
  return t.componentOffset > -1;
}
function Bs(t) {
  return (t.flags & 1) === 1;
}
function yn(t) {
  return !!t.template;
}
function rl(t) {
  return (t[k] & 512) !== 0;
}
var il = class {
  constructor(e, r, n) {
    (this.previousValue = e), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Kh(t, e, r, n) {
  e !== null ? e.applyValueToInputSignal(e, n) : (t[r] = n);
}
function Dn() {
  return Jh;
}
function Jh(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = J0), K0;
}
Dn.ngInherit = !0;
function K0() {
  let t = ep(this),
    e = t?.current;
  if (e) {
    let r = t.previous;
    if (r === Ir) t.previous = e;
    else for (let n in e) r[n] = e[n];
    (t.current = null), this.ngOnChanges(e);
  }
}
function J0(t, e, r, n, i) {
  let o = this.declaredInputs[n],
    s = ep(t) || X0(t, { previous: Ir, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[o];
  (a[o] = new il(l && l.currentValue, r, c === Ir)), Kh(t, e, i, r);
}
var Xh = "__ngSimpleChanges__";
function ep(t) {
  return t[Xh] || null;
}
function X0(t, e) {
  return (t[Xh] = e);
}
var qf = null;
var St = function (t, e, r) {
    qf?.(t, e, r);
  },
  eC = "svg",
  tC = "math";
function Ot(t) {
  for (; Array.isArray(t); ) t = t[Yt];
  return t;
}
function tp(t, e) {
  return Ot(e[t]);
}
function ft(t, e) {
  return Ot(e[t.index]);
}
function np(t, e) {
  return t.data[e];
}
function Hl(t, e) {
  return t[e];
}
function _n(t, e) {
  let r = e[t];
  return gn(r) ? r : r[Yt];
}
function zl(t) {
  return (t[k] & 128) === 128;
}
function nC(t) {
  return Qt(t[$e]);
}
function Nr(t, e) {
  return e == null ? null : t[e];
}
function rp(t) {
  t[Dr] = 0;
}
function ip(t) {
  t[k] & 1024 || ((t[k] |= 1024), zl(t) && $s(t));
}
function rC(t, e) {
  for (; t > 0; ) (e = e[Vr]), t--;
  return e;
}
function Ci(t) {
  return !!(t[k] & 9216 || t[lt]?.dirty);
}
function ol(t) {
  t[Nt].changeDetectionScheduler?.notify(7),
    t[k] & 64 && (t[k] |= 1024),
    Ci(t) && $s(t);
}
function $s(t) {
  t[Nt].changeDetectionScheduler?.notify(0);
  let e = zn(t);
  for (; e !== null && !(e[k] & 8192 || ((e[k] |= 8192), !zl(e))); ) e = zn(e);
}
function op(t, e) {
  if ((t[k] & 256) === 256) throw new A(911, !1);
  t[pn] === null && (t[pn] = []), t[pn].push(e);
}
function iC(t, e) {
  if (t[pn] === null) return;
  let r = t[pn].indexOf(e);
  r !== -1 && t[pn].splice(r, 1);
}
function zn(t) {
  let e = t[$e];
  return Qt(e) ? e[$e] : e;
}
var B = { lFrame: gp(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var sp = !1;
function oC() {
  return B.lFrame.elementDepthCount;
}
function sC() {
  B.lFrame.elementDepthCount++;
}
function aC() {
  B.lFrame.elementDepthCount--;
}
function ap() {
  return B.bindingsEnabled;
}
function cC() {
  return B.skipHydrationRootTNode !== null;
}
function lC(t) {
  return B.skipHydrationRootTNode === t;
}
function uC() {
  B.skipHydrationRootTNode = null;
}
function X() {
  return B.lFrame.lView;
}
function Ae() {
  return B.lFrame.tView;
}
function I(t) {
  return (B.lFrame.contextLView = t), t[Ct];
}
function M(t) {
  return (B.lFrame.contextLView = null), t;
}
function Fe() {
  let t = cp();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function cp() {
  return B.lFrame.currentTNode;
}
function dC() {
  let t = B.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function Yn(t, e) {
  let r = B.lFrame;
  (r.currentTNode = t), (r.isParent = e);
}
function Gl() {
  return B.lFrame.isParent;
}
function lp() {
  B.lFrame.isParent = !1;
}
function fC() {
  return B.lFrame.contextLView;
}
function up() {
  return sp;
}
function Zf(t) {
  sp = t;
}
function Hs() {
  let t = B.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function hC() {
  return B.lFrame.bindingIndex;
}
function pC(t) {
  return (B.lFrame.bindingIndex = t);
}
function zs() {
  return B.lFrame.bindingIndex++;
}
function dp(t) {
  let e = B.lFrame,
    r = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), r;
}
function gC() {
  return B.lFrame.inI18n;
}
function mC(t, e) {
  let r = B.lFrame;
  (r.bindingIndex = r.bindingRootIndex = t), sl(e);
}
function vC() {
  return B.lFrame.currentDirectiveIndex;
}
function sl(t) {
  B.lFrame.currentDirectiveIndex = t;
}
function yC(t) {
  let e = B.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function fp(t) {
  B.lFrame.currentQueryIndex = t;
}
function CC(t) {
  let e = t[H];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[wt] : null;
}
function hp(t, e, r) {
  if (r & U.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(r & U.Host); )
      if (((i = CC(o)), i === null || ((o = o[Vr]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let n = (B.lFrame = pp());
  return (n.currentTNode = e), (n.lView = t), !0;
}
function Wl(t) {
  let e = pp(),
    r = t[H];
  (B.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1);
}
function pp() {
  let t = B.lFrame,
    e = t === null ? null : t.child;
  return e === null ? gp(t) : e;
}
function gp(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function mp() {
  let t = B.lFrame;
  return (B.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var vp = mp;
function ql() {
  let t = mp();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function wC(t) {
  return (B.lFrame.contextLView = rC(t, B.lFrame.contextLView))[Ct];
}
function Qn() {
  return B.lFrame.selectedIndex;
}
function Gn(t) {
  B.lFrame.selectedIndex = t;
}
function Gs() {
  let t = B.lFrame;
  return np(t.tView, t.selectedIndex);
}
function DC() {
  return B.lFrame.currentNamespace;
}
var yp = !0;
function Ws() {
  return yp;
}
function qs(t) {
  yp = t;
}
function _C(t, e, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (n) {
    let s = Jh(e);
    (r.preOrderHooks ??= []).push(t, s),
      (r.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (r.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((r.preOrderHooks ??= []).push(t, o),
      (r.preOrderCheckHooks ??= []).push(t, o));
}
function Zs(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let o = t.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = o;
    s && (t.contentHooks ??= []).push(-r, s),
      a &&
        ((t.contentHooks ??= []).push(r, a),
        (t.contentCheckHooks ??= []).push(r, a)),
      c && (t.viewHooks ??= []).push(-r, c),
      l &&
        ((t.viewHooks ??= []).push(r, l), (t.viewCheckHooks ??= []).push(r, l)),
      u != null && (t.destroyHooks ??= []).push(r, u);
  }
}
function rs(t, e, r) {
  Cp(t, e, 3, r);
}
function is(t, e, r, n) {
  (t[k] & 3) === r && Cp(t, e, r, n);
}
function jc(t, e) {
  let r = t[k];
  (r & 3) === e && ((r &= 16383), (r += 1), (t[k] = r));
}
function Cp(t, e, r, n) {
  let i = n !== void 0 ? t[Dr] & 65535 : 0,
    o = n ?? -1,
    s = e.length - 1,
    a = 0;
  for (let c = i; c < s; c++)
    if (typeof e[c + 1] == "number") {
      if (((a = e[c]), n != null && a >= n)) break;
    } else
      e[c] < 0 && (t[Dr] += 65536),
        (a < o || o == -1) &&
          (EC(t, r, e, c), (t[Dr] = (t[Dr] & 4294901760) + c + 2)),
        c++;
}
function Yf(t, e) {
  St(4, t, e);
  let r = J(null);
  try {
    e.call(t);
  } finally {
    J(r), St(5, t, e);
  }
}
function EC(t, e, r, n) {
  let i = r[n] < 0,
    o = r[n + 1],
    s = i ? -r[n] : r[n],
    a = t[s];
  i
    ? t[k] >> 14 < t[Dr] >> 16 &&
      (t[k] & 3) === e &&
      ((t[k] += 16384), Yf(a, o))
    : Yf(a, o);
}
var br = -1,
  Wn = class {
    constructor(e, r, n) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function bC(t) {
  return t instanceof Wn;
}
function IC(t) {
  return (t.flags & 8) !== 0;
}
function MC(t) {
  return (t.flags & 16) !== 0;
}
var Uc = {},
  al = class {
    constructor(e, r) {
      (this.injector = e), (this.parentInjector = r);
    }
    get(e, r, n) {
      n = Fs(n);
      let i = this.injector.get(e, Uc, n);
      return i !== Uc || r === Uc ? i : this.parentInjector.get(e, r, n);
    }
  };
function wp(t) {
  return t !== br;
}
function gs(t) {
  return t & 32767;
}
function xC(t) {
  return t >> 16;
}
function ms(t, e) {
  let r = xC(t),
    n = e;
  for (; r > 0; ) (n = n[Vr]), r--;
  return n;
}
var cl = !0;
function vs(t) {
  let e = cl;
  return (cl = t), e;
}
var SC = 256,
  Dp = SC - 1,
  _p = 5,
  TC = 0,
  Tt = {};
function AC(t, e, r) {
  let n;
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(hi) && (n = r[hi]),
    n == null && (n = r[hi] = TC++);
  let i = n & Dp,
    o = 1 << i;
  e.data[t + (i >> _p)] |= o;
}
function ys(t, e) {
  let r = Ep(t, e);
  if (r !== -1) return r;
  let n = e[H];
  n.firstCreatePass &&
    ((t.injectorIndex = e.length),
    Bc(n.data, t),
    Bc(e, null),
    Bc(n.blueprint, null));
  let i = Zl(t, e),
    o = t.injectorIndex;
  if (wp(i)) {
    let s = gs(i),
      a = ms(i, e),
      c = a[H].data;
    for (let l = 0; l < 8; l++) e[o + l] = a[s + l] | c[s + l];
  }
  return (e[o + 8] = i), o;
}
function Bc(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function Ep(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Zl(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let r = 0,
    n = null,
    i = e;
  for (; i !== null; ) {
    if (((n = Sp(i)), n === null)) return br;
    if ((r++, (i = i[Vr]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return br;
}
function ll(t, e, r) {
  AC(t, e, r);
}
function NC(t, e) {
  if (e === "class") return t.classes;
  if (e === "style") return t.styles;
  let r = t.attrs;
  if (r) {
    let n = r.length,
      i = 0;
    for (; i < n; ) {
      let o = r[i];
      if (kh(o)) break;
      if (o === 0) i = i + 2;
      else if (typeof o == "number")
        for (i++; i < n && typeof r[i] == "string"; ) i++;
      else {
        if (o === e) return r[i + 1];
        i = i + 2;
      }
    }
  }
  return null;
}
function bp(t, e, r) {
  if (r & U.Optional || t !== void 0) return t;
  Fl(e, "NodeInjector");
}
function Ip(t, e, r, n) {
  if (
    (r & U.Optional && n === void 0 && (n = null), !(r & (U.Self | U.Host)))
  ) {
    let i = t[Sr],
      o = qe(void 0);
    try {
      return i ? i.get(e, n, r & U.Optional) : Ah(e, n, r & U.Optional);
    } finally {
      qe(o);
    }
  }
  return bp(n, e, r);
}
function Mp(t, e, r, n = U.Default, i) {
  if (t !== null) {
    if (e[k] & 2048 && !(n & U.Self)) {
      let s = kC(t, e, r, n, Tt);
      if (s !== Tt) return s;
    }
    let o = xp(t, e, r, n, Tt);
    if (o !== Tt) return o;
  }
  return Ip(e, r, n, i);
}
function xp(t, e, r, n, i) {
  let o = PC(r);
  if (typeof o == "function") {
    if (!hp(e, t, n)) return n & U.Host ? bp(i, r, n) : Ip(e, r, n, i);
    try {
      let s;
      if (((s = o(n)), s == null && !(n & U.Optional))) Fl(r);
      else return s;
    } finally {
      vp();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = Ep(t, e),
      c = br,
      l = n & U.Host ? e[Rt][wt] : null;
    for (
      (a === -1 || n & U.SkipSelf) &&
      ((c = a === -1 ? Zl(t, e) : e[a + 8]),
      c === br || !Kf(n, !1)
        ? (a = -1)
        : ((s = e[H]), (a = gs(c)), (e = ms(c, e))));
      a !== -1;

    ) {
      let u = e[H];
      if (Qf(o, a, u.data)) {
        let h = RC(a, e, r, s, n, l);
        if (h !== Tt) return h;
      }
      (c = e[a + 8]),
        c !== br && Kf(n, e[H].data[a + 8] === l) && Qf(o, a, e)
          ? ((s = u), (a = gs(c)), (e = ms(c, e)))
          : (a = -1);
    }
  }
  return i;
}
function RC(t, e, r, n, i, o) {
  let s = e[H],
    a = s.data[t + 8],
    c = n == null ? Us(a) && cl : n != s && (a.type & 3) !== 0,
    l = i & U.Host && o === a,
    u = OC(a, s, r, c, l);
  return u !== null ? Rr(e, s, u, a) : Tt;
}
function OC(t, e, r, n, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    c = t.directiveStart,
    l = t.directiveEnd,
    u = o >> 20,
    h = n ? a : a + u,
    m = i ? a + u : l;
  for (let g = h; g < m; g++) {
    let w = s[g];
    if ((g < c && r === w) || (g >= c && w.type === r)) return g;
  }
  if (i) {
    let g = s[c];
    if (g && yn(g) && g.type === r) return c;
  }
  return null;
}
function Rr(t, e, r, n) {
  let i = t[r],
    o = e.data;
  if (bC(i)) {
    let s = i;
    s.resolving && l0(c0(o[r]));
    let a = vs(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      l = s.injectImpl ? qe(s.injectImpl) : null,
      u = hp(t, n, U.Default);
    try {
      (i = t[r] = s.factory(void 0, o, t, n)),
        e.firstCreatePass && r >= n.directiveStart && _C(r, o[r], e);
    } finally {
      l !== null && qe(l), vs(a), (s.resolving = !1), vp();
    }
  }
  return i;
}
function PC(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(hi) ? t[hi] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & Dp : FC) : e;
}
function Qf(t, e, r) {
  let n = 1 << t;
  return !!(r[e + (t >> _p)] & n);
}
function Kf(t, e) {
  return !(t & U.Self) && !(t & U.Host && e);
}
var Bn = class {
  constructor(e, r) {
    (this._tNode = e), (this._lView = r);
  }
  get(e, r, n) {
    return Mp(this._tNode, this._lView, e, Fs(n), r);
  }
};
function FC() {
  return new Bn(Fe(), X());
}
function Dt(t) {
  return _i(() => {
    let e = t.prototype.constructor,
      r = e[ss] || ul(e),
      n = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== n; ) {
      let o = i[ss] || ul(i);
      if (o && o !== r) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function ul(t) {
  return bh(t)
    ? () => {
        let e = ul(je(t));
        return e && e();
      }
    : $n(t);
}
function kC(t, e, r, n, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[k] & 2048 && !(s[k] & 512); ) {
    let a = xp(o, s, r, n | U.Self, Tt);
    if (a !== Tt) return a;
    let c = o.parent;
    if (!c) {
      let l = s[Yh];
      if (l) {
        let u = l.get(r, Tt, n);
        if (u !== Tt) return u;
      }
      (c = Sp(s)), (s = s[Vr]);
    }
    o = c;
  }
  return i;
}
function Sp(t) {
  let e = t[H],
    r = e.type;
  return r === 2 ? e.declTNode : r === 1 ? t[wt] : null;
}
function Yl(t) {
  return NC(Fe(), t);
}
function Jf(t, e = null, r = null, n) {
  let i = Tp(t, e, r, n);
  return i.resolveInjectorInitializers(), i;
}
function Tp(t, e = null, r = null, n, i = new Set()) {
  let o = [r || ct, L0(t)];
  return (
    (n = n || (typeof t == "object" ? void 0 : Ue(t))),
    new vi(o, e || Bl(), n || null, i)
  );
}
var jn = class jn {
  static create(e, r) {
    if (Array.isArray(e)) return Jf({ name: "" }, r, e, "");
    {
      let n = e.name ?? "";
      return Jf({ name: n }, e.parent, e.providers, n);
    }
  }
};
(jn.THROW_IF_NOT_FOUND = gi),
  (jn.NULL = new ls()),
  (jn.ɵprov = b({ token: jn, providedIn: "any", factory: () => T(Oh) })),
  (jn.__NG_ELEMENT_ID__ = -1);
var tt = jn;
var LC = new x("");
LC.__NG_ELEMENT_ID__ = (t) => {
  let e = Fe();
  if (e === null) throw new A(204, !1);
  if (e.type & 2) return e.value;
  if (t & U.Optional) return null;
  throw new A(204, !1);
};
var VC = "ngOriginalError";
function $c(t) {
  return t[VC];
}
var Ql = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = jC), (e.__NG_ENV_ID__ = (n) => n);
    let t = e;
    return t;
  })(),
  dl = class extends Ql {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return op(this._lView, e), () => iC(this._lView, e);
    }
  };
function jC() {
  return new dl(X());
}
var Kt = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new Ie(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  e.ɵprov = b({ token: e, providedIn: "root", factory: () => new e() });
  let t = e;
  return t;
})();
var fl = class extends xe {
    constructor(e = !1) {
      super(),
        (this.destroyRef = void 0),
        (this.pendingTasks = void 0),
        (this.__isAsync = e),
        Zh() &&
          ((this.destroyRef = C(Ql, { optional: !0 }) ?? void 0),
          (this.pendingTasks = C(Kt, { optional: !0 }) ?? void 0));
    }
    emit(e) {
      let r = J(null);
      try {
        super.next(e);
      } finally {
        J(r);
      }
    }
    subscribe(e, r, n) {
      let i = e,
        o = r || (() => null),
        s = n;
      if (e && typeof e == "object") {
        let c = e;
        (i = c.next?.bind(c)),
          (o = c.error?.bind(c)),
          (s = c.complete?.bind(c));
      }
      this.__isAsync &&
        ((o = this.wrapInTimeout(o)),
        i && (i = this.wrapInTimeout(i)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: i, error: o, complete: s });
      return e instanceof pe && e.add(a), a;
    }
    wrapInTimeout(e) {
      return (r) => {
        let n = this.pendingTasks?.add();
        setTimeout(() => {
          e(r), n !== void 0 && this.pendingTasks?.remove(n);
        });
      };
    }
  },
  De = fl;
function Cs(...t) {}
function Ap(t) {
  let e, r;
  function n() {
    t = Cs;
    try {
      r !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(r),
        e !== void 0 && clearTimeout(e);
    } catch {}
  }
  return (
    (e = setTimeout(() => {
      t(), n();
    })),
    typeof requestAnimationFrame == "function" &&
      (r = requestAnimationFrame(() => {
        t(), n();
      })),
    () => n()
  );
}
function Xf(t) {
  return (
    queueMicrotask(() => t()),
    () => {
      t = Cs;
    }
  );
}
var re = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new De(!1)),
        (this.onMicrotaskEmpty = new De(!1)),
        (this.onStable = new De(!1)),
        (this.onError = new De(!1)),
        typeof Zone > "u")
      )
        throw new A(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.callbackScheduled = !1),
        $C(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new A(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new A(909, !1);
    }
    run(e, r, n) {
      return this._inner.run(e, r, n);
    }
    runTask(e, r, n, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, UC, Cs, Cs);
      try {
        return o.runTask(s, r, n);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  UC = {};
function Kl(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function BC(t) {
  t.isCheckStableRunning ||
    t.callbackScheduled ||
    ((t.callbackScheduled = !0),
    Zone.root.run(() => {
      Ap(() => {
        (t.callbackScheduled = !1),
          hl(t),
          (t.isCheckStableRunning = !0),
          Kl(t),
          (t.isCheckStableRunning = !1);
      });
    }),
    hl(t));
}
function $C(t) {
  let e = () => {
    BC(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, o, s, a) => {
      if (HC(a)) return r.invokeTask(i, o, s, a);
      try {
        return eh(t), r.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          th(t);
      }
    },
    onInvoke: (r, n, i, o, s, a, c) => {
      try {
        return eh(t), r.invoke(i, o, s, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection &&
          !t.callbackScheduled &&
          !zC(a) &&
          e(),
          th(t);
      }
    },
    onHasTask: (r, n, i, o) => {
      r.hasTask(i, o),
        n === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), hl(t), Kl(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (r, n, i, o) => (
      r.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function hl(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.callbackScheduled === !0)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function eh(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function th(t) {
  t._nesting--, Kl(t);
}
var ws = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new De()),
      (this.onMicrotaskEmpty = new De()),
      (this.onStable = new De()),
      (this.onError = new De());
  }
  run(e, r, n) {
    return e.apply(r, n);
  }
  runGuarded(e, r, n) {
    return e.apply(r, n);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, r, n, i) {
    return e.apply(r, n);
  }
};
function HC(t) {
  return Np(t, "__ignore_ng_zone__");
}
function zC(t) {
  return Np(t, "__scheduler_tick__");
}
function Np(t, e) {
  return !Array.isArray(t) || t.length !== 1 ? !1 : t[0]?.data?.[e] === !0;
}
function GC(t = "zone.js", e) {
  return t === "noop" ? new ws() : t === "zone.js" ? new re(e) : t;
}
var Wt = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let r = this._findOriginalError(e);
      this._console.error("ERROR", e),
        r && this._console.error("ORIGINAL ERROR", r);
    }
    _findOriginalError(e) {
      let r = e && $c(e);
      for (; r && $c(r); ) r = $c(r);
      return r || null;
    }
  },
  WC = new x("", {
    providedIn: "root",
    factory: () => {
      let t = C(re),
        e = C(Wt);
      return (r) => t.runOutsideAngular(() => e.handleError(r));
    },
  });
function qC() {
  return Ys(Fe(), X());
}
function Ys(t, e) {
  return new _t(ft(t, e));
}
var _t = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  e.__NG_ELEMENT_ID__ = qC;
  let t = e;
  return t;
})();
function Rp(t) {
  return (t.flags & 128) === 128;
}
var Op = new Map(),
  ZC = 0;
function YC() {
  return ZC++;
}
function QC(t) {
  Op.set(t[js], t);
}
function KC(t) {
  Op.delete(t[js]);
}
var nh = "__ngContext__";
function Cn(t, e) {
  gn(e) ? ((t[nh] = e[js]), QC(e)) : (t[nh] = e);
}
function Pp(t) {
  return kp(t[yi]);
}
function Fp(t) {
  return kp(t[yt]);
}
function kp(t) {
  for (; t !== null && !Qt(t); ) t = t[yt];
  return t;
}
var pl;
function Lp(t) {
  pl = t;
}
function JC() {
  if (pl !== void 0) return pl;
  if (typeof document < "u") return document;
  throw new A(210, !1);
}
var Qs = new x("", { providedIn: "root", factory: () => XC }),
  XC = "ng",
  Jl = new x(""),
  Pt = new x("", { providedIn: "platform", factory: () => "unknown" });
var Xl = new x("", {
  providedIn: "root",
  factory: () =>
    JC().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var ew = "h",
  tw = "b";
var nw = () => null;
function eu(t, e, r = !1) {
  return nw(t, e, r);
}
var Vp = !1,
  rw = new x("", { providedIn: "root", factory: () => Vp });
var Jo;
function iw() {
  if (Jo === void 0 && ((Jo = null), Ve.trustedTypes))
    try {
      Jo = Ve.trustedTypes.createPolicy("angular#unsafe-bypass", {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return Jo;
}
function rh(t) {
  return iw()?.createScriptURL(t) || t;
}
var Ds = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${_h})`;
  }
};
function bi(t) {
  return t instanceof Ds ? t.changingThisBreaksApplicationSecurity : t;
}
function tu(t, e) {
  let r = ow(t);
  if (r != null && r !== e) {
    if (r === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${r} (see ${_h})`);
  }
  return r === e;
}
function ow(t) {
  return (t instanceof Ds && t.getTypeName()) || null;
}
var sw = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function jp(t) {
  return (t = String(t)), t.match(sw) ? t : "unsafe:" + t;
}
var Ks = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(Ks || {});
function Kn(t) {
  let e = Bp();
  return e ? e.sanitize(Ks.URL, t) || "" : tu(t, "URL") ? bi(t) : jp(Un(t));
}
function aw(t) {
  let e = Bp();
  if (e) return rh(e.sanitize(Ks.RESOURCE_URL, t) || "");
  if (tu(t, "ResourceURL")) return rh(bi(t));
  throw new A(904, !1);
}
function cw(t, e) {
  return (e === "src" &&
    (t === "embed" ||
      t === "frame" ||
      t === "iframe" ||
      t === "media" ||
      t === "script")) ||
    (e === "href" && (t === "base" || t === "link"))
    ? aw
    : Kn;
}
function Up(t, e, r) {
  return cw(e, r)(t);
}
function Bp() {
  let t = X();
  return t && t[Nt].sanitizer;
}
var lw = /^>|^->|<!--|-->|--!>|<!-$/g,
  uw = /(<|>)/g,
  dw = "\u200B$1\u200B";
function fw(t) {
  return t.replace(lw, (e) => e.replace(uw, dw));
}
function $p(t) {
  return t.ownerDocument.defaultView;
}
function Hp(t) {
  return t instanceof Function ? t() : t;
}
function hw(t) {
  return (t ?? C(tt)).get(Pt) === "browser";
}
var qt = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    );
  })(qt || {}),
  pw;
function nu(t, e) {
  return pw(t, e);
}
function _r(t, e, r, n, i) {
  if (n != null) {
    let o,
      s = !1;
    Qt(n) ? (o = n) : gn(n) && ((s = !0), (n = n[Yt]));
    let a = Ot(n);
    t === 0 && r !== null
      ? i == null
        ? Zp(e, r, a)
        : _s(e, r, a, i || null, !0)
      : t === 1 && r !== null
      ? _s(e, r, a, i || null, !0)
      : t === 2
      ? Aw(e, a, s)
      : t === 3 && e.destroyNode(a),
      o != null && Rw(e, t, o, r, i);
  }
}
function gw(t, e) {
  return t.createText(e);
}
function mw(t, e, r) {
  t.setValue(e, r);
}
function vw(t, e) {
  return t.createComment(fw(e));
}
function zp(t, e, r) {
  return t.createElement(e, r);
}
function yw(t, e) {
  Gp(t, e), (e[Yt] = null), (e[wt] = null);
}
function Cw(t, e, r, n, i, o) {
  (n[Yt] = i), (n[wt] = e), Xs(t, n, r, 1, i, o);
}
function Gp(t, e) {
  e[Nt].changeDetectionScheduler?.notify(8), Xs(t, e, e[me], 2, null, null);
}
function ww(t) {
  let e = t[yi];
  if (!e) return Hc(t[H], t);
  for (; e; ) {
    let r = null;
    if (gn(e)) r = e[yi];
    else {
      let n = e[ut];
      n && (r = n);
    }
    if (!r) {
      for (; e && !e[yt] && e !== t; ) gn(e) && Hc(e[H], e), (e = e[$e]);
      e === null && (e = t), gn(e) && Hc(e[H], e), (r = e && e[yt]);
    }
    e = r;
  }
}
function Dw(t, e, r, n) {
  let i = ut + n,
    o = r.length;
  n > 0 && (r[i - 1][yt] = e),
    n < o - ut
      ? ((e[yt] = r[i]), Rh(r, ut + n, e))
      : (r.push(e), (e[yt] = null)),
    (e[$e] = r);
  let s = e[Tr];
  s !== null && r !== s && Wp(s, e);
  let a = e[Ar];
  a !== null && a.insertView(t), ol(e), (e[k] |= 128);
}
function Wp(t, e) {
  let r = t[hs],
    n = e[$e];
  if (gn(n)) t[k] |= ps.HasTransplantedViews;
  else {
    let i = n[$e][Rt];
    e[Rt] !== i && (t[k] |= ps.HasTransplantedViews);
  }
  r === null ? (t[hs] = [e]) : r.push(e);
}
function ru(t, e) {
  let r = t[hs],
    n = r.indexOf(e);
  r.splice(n, 1);
}
function gl(t, e) {
  if (t.length <= ut) return;
  let r = ut + e,
    n = t[r];
  if (n) {
    let i = n[Tr];
    i !== null && i !== t && ru(i, n), e > 0 && (t[r - 1][yt] = n[yt]);
    let o = cs(t, ut + e);
    yw(n[H], n);
    let s = o[Ar];
    s !== null && s.detachView(o[H]),
      (n[$e] = null),
      (n[yt] = null),
      (n[k] &= -129);
  }
  return n;
}
function qp(t, e) {
  if (!(e[k] & 256)) {
    let r = e[me];
    r.destroyNode && Xs(t, e, r, 3, null, null), ww(e);
  }
}
function Hc(t, e) {
  if (e[k] & 256) return;
  let r = J(null);
  try {
    (e[k] &= -129),
      (e[k] |= 256),
      e[lt] && vc(e[lt]),
      Ew(t, e),
      _w(t, e),
      e[H].type === 1 && e[me].destroy();
    let n = e[Tr];
    if (n !== null && Qt(e[$e])) {
      n !== e[$e] && ru(n, e);
      let i = e[Ar];
      i !== null && i.detachView(t);
    }
    KC(e);
  } finally {
    J(r);
  }
}
function _w(t, e) {
  let r = t.cleanup,
    n = e[ds];
  if (r !== null)
    for (let o = 0; o < r.length - 1; o += 2)
      if (typeof r[o] == "string") {
        let s = r[o + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2);
      } else {
        let s = n[r[o + 1]];
        r[o].call(s);
      }
  n !== null && (e[ds] = null);
  let i = e[pn];
  if (i !== null) {
    e[pn] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function Ew(t, e) {
  let r;
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = e[r[n]];
      if (!(i instanceof Wn)) {
        let o = r[n + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              c = o[s + 1];
            St(4, a, c);
            try {
              c.call(a);
            } finally {
              St(5, a, c);
            }
          }
        else {
          St(4, i, o);
          try {
            o.call(i);
          } finally {
            St(5, i, o);
          }
        }
      }
    }
}
function bw(t, e, r) {
  return Iw(t, e.parent, r);
}
function Iw(t, e, r) {
  let n = e;
  for (; n !== null && n.type & 168; ) (e = n), (n = e.parent);
  if (n === null) return r[Yt];
  {
    let { componentOffset: i } = n;
    if (i > -1) {
      let { encapsulation: o } = t.data[n.directiveStart + i];
      if (o === At.None || o === At.Emulated) return null;
    }
    return ft(n, r);
  }
}
function _s(t, e, r, n, i) {
  t.insertBefore(e, r, n, i);
}
function Zp(t, e, r) {
  t.appendChild(e, r);
}
function ih(t, e, r, n, i) {
  n !== null ? _s(t, e, r, n, i) : Zp(t, e, r);
}
function Yp(t, e) {
  return t.parentNode(e);
}
function Mw(t, e) {
  return t.nextSibling(e);
}
function xw(t, e, r) {
  return Tw(t, e, r);
}
function Sw(t, e, r) {
  return t.type & 40 ? ft(t, r) : null;
}
var Tw = Sw,
  oh;
function Js(t, e, r, n) {
  let i = bw(t, n, e),
    o = e[me],
    s = n.parent || e[wt],
    a = xw(s, n, e);
  if (i != null)
    if (Array.isArray(r))
      for (let c = 0; c < r.length; c++) ih(o, i, r[c], a, !1);
    else ih(o, i, r, a, !1);
  oh !== void 0 && oh(o, n, e, r, i);
}
function fi(t, e) {
  if (e !== null) {
    let r = e.type;
    if (r & 3) return ft(e, t);
    if (r & 4) return ml(-1, t[e.index]);
    if (r & 8) {
      let n = e.child;
      if (n !== null) return fi(t, n);
      {
        let i = t[e.index];
        return Qt(i) ? ml(-1, i) : Ot(i);
      }
    } else {
      if (r & 128) return fi(t, e.next);
      if (r & 32) return nu(e, t)() || Ot(t[e.index]);
      {
        let n = Qp(t, e);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let i = zn(t[Rt]);
          return fi(i, n);
        } else return fi(t, e.next);
      }
    }
  }
  return null;
}
function Qp(t, e) {
  if (e !== null) {
    let n = t[Rt][wt],
      i = e.projection;
    return n.projection[i];
  }
  return null;
}
function ml(t, e) {
  let r = ut + t + 1;
  if (r < e.length) {
    let n = e[r],
      i = n[H].firstChild;
    if (i !== null) return fi(n, i);
  }
  return e[Hn];
}
function Aw(t, e, r) {
  t.removeChild(null, e, r);
}
function iu(t, e, r, n, i, o, s) {
  for (; r != null; ) {
    if (r.type === 128) {
      r = r.next;
      continue;
    }
    let a = n[r.index],
      c = r.type;
    if (
      (s && e === 0 && (a && Cn(Ot(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (c & 8) iu(t, e, r.child, n, i, o, !1), _r(e, t, i, a, o);
      else if (c & 32) {
        let l = nu(r, n),
          u;
        for (; (u = l()); ) _r(e, t, i, u, o);
        _r(e, t, i, a, o);
      } else c & 16 ? Nw(t, e, n, r, i, o) : _r(e, t, i, a, o);
    r = s ? r.projectionNext : r.next;
  }
}
function Xs(t, e, r, n, i, o) {
  iu(r, n, t.firstChild, e, i, o, !1);
}
function Nw(t, e, r, n, i, o) {
  let s = r[Rt],
    c = s[wt].projection[n.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      _r(e, t, i, u, o);
    }
  else {
    let l = c,
      u = s[$e];
    Rp(n) && (l.flags |= 128), iu(t, e, l, u, i, o, !0);
  }
}
function Rw(t, e, r, n, i) {
  let o = r[Hn],
    s = Ot(r);
  o !== s && _r(e, t, n, o, i);
  for (let a = ut; a < r.length; a++) {
    let c = r[a];
    Xs(c[H], c, t, e, n, o);
  }
}
function Ow(t, e, r, n, i) {
  if (e) i ? t.addClass(r, n) : t.removeClass(r, n);
  else {
    let o = n.indexOf("-") === -1 ? void 0 : qt.DashCase;
    i == null
      ? t.removeStyle(r, n, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= qt.Important)),
        t.setStyle(r, n, i, o));
  }
}
function Pw(t, e, r) {
  t.setAttribute(e, "style", r);
}
function Kp(t, e, r) {
  r === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", r);
}
function Jp(t, e, r) {
  let { mergedAttrs: n, classes: i, styles: o } = r;
  n !== null && Xc(t, e, n),
    i !== null && Kp(t, e, i),
    o !== null && Pw(t, e, o);
}
var Et = {};
function v(t = 1) {
  Xp(Ae(), X(), Qn() + t, !1);
}
function Xp(t, e, r, n) {
  if (!n)
    if ((e[k] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && rs(e, o, r);
    } else {
      let o = t.preOrderHooks;
      o !== null && is(e, o, 0, r);
    }
  Gn(r);
}
function E(t, e = U.Default) {
  let r = X();
  if (r === null) return T(t, e);
  let n = Fe();
  return Mp(n, r, je(t), e);
}
function eg() {
  let t = "invalid";
  throw new Error(t);
}
function tg(t, e, r, n, i, o) {
  let s = J(null);
  try {
    let a = null;
    i & mn.SignalBased && (a = e[n][$t]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & mn.HasDecoratorInputTransform &&
        (o = t.inputTransforms[n].call(e, o)),
      t.setInput !== null ? t.setInput(e, a, o, r, n) : Kh(e, a, n, o);
  } finally {
    J(s);
  }
}
function Fw(t, e) {
  let r = t.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        if (i < 0) Gn(~i);
        else {
          let o = i,
            s = r[++n],
            a = r[++n];
          mC(s, o);
          let c = e[o];
          a(2, c);
        }
      }
    } finally {
      Gn(-1);
    }
}
function ea(t, e, r, n, i, o, s, a, c, l, u) {
  let h = e.blueprint.slice();
  return (
    (h[Yt] = i),
    (h[k] = n | 4 | 128 | 8 | 64),
    (l !== null || (t && t[k] & 2048)) && (h[k] |= 2048),
    rp(h),
    (h[$e] = h[Vr] = t),
    (h[Ct] = r),
    (h[Nt] = s || (t && t[Nt])),
    (h[me] = a || (t && t[me])),
    (h[Sr] = c || (t && t[Sr]) || null),
    (h[wt] = o),
    (h[js] = YC()),
    (h[us] = u),
    (h[Yh] = l),
    (h[Rt] = e.type == 2 ? t[Rt] : h),
    h
  );
}
function Ii(t, e, r, n, i) {
  let o = t.data[e];
  if (o === null) (o = kw(t, e, r, n, i)), gC() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = r), (o.value = n), (o.attrs = i);
    let s = dC();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Yn(o, !0), o;
}
function kw(t, e, r, n, i) {
  let o = cp(),
    s = Gl(),
    a = s ? o : o && o.parent,
    c = (t.data[e] = Bw(t, a, r, e, n, i));
  return (
    t.firstChild === null && (t.firstChild = c),
    o !== null &&
      (s
        ? o.child == null && c.parent !== null && (o.child = c)
        : o.next === null && ((o.next = c), (c.prev = o))),
    c
  );
}
function ng(t, e, r, n) {
  if (r === 0) return -1;
  let i = e.length;
  for (let o = 0; o < r; o++) e.push(n), t.blueprint.push(n), t.data.push(null);
  return i;
}
function rg(t, e, r, n, i) {
  let o = Qn(),
    s = n & 2;
  try {
    Gn(-1), s && e.length > et && Xp(t, e, et, !1), St(s ? 2 : 0, i), r(n, i);
  } finally {
    Gn(o), St(s ? 3 : 1, i);
  }
}
function ou(t, e, r) {
  if ($l(e)) {
    let n = J(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        if (a.contentQueries) {
          let c = r[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      J(n);
    }
  }
}
function su(t, e, r) {
  ap() && (qw(t, e, r, ft(r, e)), (r.flags & 64) === 64 && sg(t, e, r));
}
function au(t, e, r = ft) {
  let n = e.localNames;
  if (n !== null) {
    let i = e.index + 1;
    for (let o = 0; o < n.length; o += 2) {
      let s = n[o + 1],
        a = s === -1 ? r(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function ig(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = cu(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function cu(t, e, r, n, i, o, s, a, c, l, u) {
  let h = et + n,
    m = h + i,
    g = Lw(h, m),
    w = typeof l == "function" ? l() : l;
  return (g[H] = {
    type: t,
    blueprint: g,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: g.slice().fill(null, h),
    bindingStartIndex: h,
    expandoStartIndex: m,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: w,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function Lw(t, e) {
  let r = [];
  for (let n = 0; n < e; n++) r.push(n < t ? null : Et);
  return r;
}
function Vw(t, e, r, n) {
  let o = n.get(rw, Vp) || r === At.ShadowDom,
    s = t.selectRootElement(e, o);
  return jw(s), s;
}
function jw(t) {
  Uw(t);
}
var Uw = () => null;
function Bw(t, e, r, n, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    cC() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function sh(t, e, r, n, i) {
  for (let o in e) {
    if (!e.hasOwnProperty(o)) continue;
    let s = e[o];
    if (s === void 0) continue;
    n ??= {};
    let a,
      c = mn.None;
    Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
    let l = o;
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue;
      l = i[o];
    }
    t === 0 ? ah(n, r, l, a, c) : ah(n, r, l, a);
  }
  return n;
}
function ah(t, e, r, n, i) {
  let o;
  t.hasOwnProperty(r) ? (o = t[r]).push(e, n) : (o = t[r] = [e, n]),
    i !== void 0 && o.push(i);
}
function $w(t, e, r) {
  let n = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    c = null,
    l = null;
  for (let u = n; u < i; u++) {
    let h = o[u],
      m = r ? r.get(h) : null,
      g = m ? m.inputs : null,
      w = m ? m.outputs : null;
    (c = sh(0, h.inputs, u, c, g)), (l = sh(1, h.outputs, u, l, w));
    let O = c !== null && s !== null && !Vl(e) ? iD(c, u, s) : null;
    a.push(O);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (e.flags |= 8),
    c.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = l);
}
function Hw(t) {
  return t === "class"
    ? "className"
    : t === "for"
    ? "htmlFor"
    : t === "formaction"
    ? "formAction"
    : t === "innerHtml"
    ? "innerHTML"
    : t === "readonly"
    ? "readOnly"
    : t === "tabindex"
    ? "tabIndex"
    : t;
}
function lu(t, e, r, n, i, o, s, a) {
  let c = ft(e, r),
    l = e.inputs,
    u;
  !a && l != null && (u = l[n])
    ? (du(t, r, u, n, i), Us(e) && zw(r, e.index))
    : e.type & 3
    ? ((n = Hw(n)),
      (i = s != null ? s(i, e.value || "", n) : i),
      o.setProperty(c, n, i))
    : e.type & 12;
}
function zw(t, e) {
  let r = _n(e, t);
  r[k] & 16 || (r[k] |= 64);
}
function uu(t, e, r, n) {
  if (ap()) {
    let i = n === null ? null : { "": -1 },
      o = Yw(t, r),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && og(t, e, r, s, i, a),
      i && Qw(r, n, i);
  }
  r.mergedAttrs = mi(r.mergedAttrs, r.attrs);
}
function og(t, e, r, n, i, o) {
  for (let l = 0; l < n.length; l++) ll(ys(r, e), t, n[l].type);
  Jw(r, t.data.length, n.length);
  for (let l = 0; l < n.length; l++) {
    let u = n[l];
    u.providersResolver && u.providersResolver(u);
  }
  let s = !1,
    a = !1,
    c = ng(t, e, n.length, null);
  for (let l = 0; l < n.length; l++) {
    let u = n[l];
    (r.mergedAttrs = mi(r.mergedAttrs, u.hostAttrs)),
      Xw(t, r, e, c, u),
      Kw(c, u, i),
      u.contentQueries !== null && (r.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) &&
        (r.flags |= 64);
    let h = u.type.prototype;
    !s &&
      (h.ngOnChanges || h.ngOnInit || h.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (h.ngOnChanges || h.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      c++;
  }
  $w(t, r, o);
}
function Gw(t, e, r, n, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    Ww(s) != a && s.push(a), s.push(r, n, o);
  }
}
function Ww(t) {
  let e = t.length;
  for (; e > 0; ) {
    let r = t[--e];
    if (typeof r == "number" && r < 0) return r;
  }
  return 0;
}
function qw(t, e, r, n) {
  let i = r.directiveStart,
    o = r.directiveEnd;
  Us(r) && eD(e, r, t.data[i + r.componentOffset]),
    t.firstCreatePass || ys(r, e),
    Cn(n, e);
  let s = r.initialInputs;
  for (let a = i; a < o; a++) {
    let c = t.data[a],
      l = Rr(e, t, a, r);
    if ((Cn(l, e), s !== null && rD(e, a - i, l, c, r, s), yn(c))) {
      let u = _n(r.index, e);
      u[Ct] = Rr(e, t, a, r);
    }
  }
}
function sg(t, e, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    o = r.index,
    s = vC();
  try {
    Gn(o);
    for (let a = n; a < i; a++) {
      let c = t.data[a],
        l = e[a];
      sl(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          Zw(c, l);
    }
  } finally {
    Gn(-1), sl(s);
  }
}
function Zw(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function Yw(t, e) {
  let r = t.directiveRegistry,
    n = null,
    i = null;
  if (r)
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      if (S0(e, s.selectors, !1))
        if ((n || (n = []), yn(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              n.unshift(...a, s);
            let c = a.length;
            vl(t, e, c);
          } else n.unshift(s), vl(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, n, i), n.push(s);
    }
  return n === null ? null : [n, i];
}
function vl(t, e, r) {
  (e.componentOffset = r), (t.components ??= []).push(e.index);
}
function Qw(t, e, r) {
  if (e) {
    let n = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = r[e[i + 1]];
      if (o == null) throw new A(-301, !1);
      n.push(e[i], o);
    }
  }
}
function Kw(t, e, r) {
  if (r) {
    if (e.exportAs)
      for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
    yn(e) && (r[""] = t);
  }
}
function Jw(t, e, r) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + r),
    (t.providerIndexes = e);
}
function Xw(t, e, r, n, i) {
  t.data[n] = i;
  let o = i.factory || (i.factory = $n(i.type, !0)),
    s = new Wn(o, yn(i), E);
  (t.blueprint[n] = s), (r[n] = s), Gw(t, e, n, ng(t, r, i.hostVars, Et), i);
}
function eD(t, e, r) {
  let n = ft(e, t),
    i = ig(r),
    o = t[Nt].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = ta(
    t,
    ea(t, i, null, s, n, e, null, o.createRenderer(n, r), null, null, null)
  );
  t[e.index] = a;
}
function tD(t, e, r, n, i, o) {
  let s = ft(t, e);
  nD(e[me], s, o, t.value, r, n, i);
}
function nD(t, e, r, n, i, o, s) {
  if (o == null) t.removeAttribute(e, i, r);
  else {
    let a = s == null ? Un(o) : s(o, n || "", i);
    t.setAttribute(e, i, a, r);
  }
}
function rD(t, e, r, n, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        l = s[a++],
        u = s[a++],
        h = s[a++];
      tg(n, r, c, l, u, h);
    }
}
function iD(t, e, r) {
  let n = null,
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (t.hasOwnProperty(o)) {
      n === null && (n = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === e) {
          n.push(o, s[a + 1], s[a + 2], r[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return n;
}
function ag(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null];
}
function cg(t, e) {
  let r = t.contentQueries;
  if (r !== null) {
    let n = J(null);
    try {
      for (let i = 0; i < r.length; i += 2) {
        let o = r[i],
          s = r[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          fp(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      J(n);
    }
  }
}
function ta(t, e) {
  return t[yi] ? (t[Wf][yt] = e) : (t[yi] = e), (t[Wf] = e), e;
}
function yl(t, e, r) {
  fp(0);
  let n = J(null);
  try {
    e(t, r);
  } finally {
    J(n);
  }
}
function oD(t) {
  return (t[ds] ??= []);
}
function sD(t) {
  return (t.cleanup ??= []);
}
function lg(t, e) {
  let r = t[Sr],
    n = r ? r.get(Wt, null) : null;
  n && n.handleError(e);
}
function du(t, e, r, n, i) {
  for (let o = 0; o < r.length; ) {
    let s = r[o++],
      a = r[o++],
      c = r[o++],
      l = e[s],
      u = t.data[s];
    tg(u, l, n, a, c, i);
  }
}
function ug(t, e, r) {
  let n = tp(e, t);
  mw(t[me], n, r);
}
function aD(t, e) {
  let r = _n(e, t),
    n = r[H];
  cD(n, r);
  let i = r[Yt];
  i !== null && r[us] === null && (r[us] = eu(i, r[Sr])), fu(n, r, r[Ct]);
}
function cD(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function fu(t, e, r) {
  Wl(e);
  try {
    let n = t.viewQuery;
    n !== null && yl(1, n, r);
    let i = t.template;
    i !== null && rg(t, e, i, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[Ar]?.finishViewCreation(t),
      t.staticContentQueries && cg(t, e),
      t.staticViewQueries && yl(2, t.viewQuery, r);
    let o = t.components;
    o !== null && lD(e, o);
  } catch (n) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      n)
    );
  } finally {
    (e[k] &= -5), ql();
  }
}
function lD(t, e) {
  for (let r = 0; r < e.length; r++) aD(t, e[r]);
}
function uD(t, e, r, n) {
  let i = J(null);
  try {
    let o = e.tView,
      a = t[k] & 4096 ? 4096 : 16,
      c = ea(
        t,
        o,
        r,
        a,
        null,
        e,
        null,
        null,
        n?.injector ?? null,
        n?.embeddedViewInjector ?? null,
        n?.dehydratedView ?? null
      ),
      l = t[e.index];
    c[Tr] = l;
    let u = t[Ar];
    return u !== null && (c[Ar] = u.createEmbeddedView(o)), fu(o, c, r), c;
  } finally {
    J(i);
  }
}
function ch(t, e) {
  return !e || e.firstChild === null || Rp(t);
}
function dD(t, e, r, n = !0) {
  let i = e[H];
  if ((Dw(i, e, t, r), n)) {
    let s = ml(r, t),
      a = e[me],
      c = Yp(a, t[Hn]);
    c !== null && Cw(i, t[wt], a, e, c, s);
  }
  let o = e[us];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function Es(t, e, r, n, i = !1) {
  for (; r !== null; ) {
    if (r.type === 128) {
      r = i ? r.projectionNext : r.next;
      continue;
    }
    let o = e[r.index];
    o !== null && n.push(Ot(o)), Qt(o) && fD(o, n);
    let s = r.type;
    if (s & 8) Es(t, e, r.child, n);
    else if (s & 32) {
      let a = nu(r, e),
        c;
      for (; (c = a()); ) n.push(c);
    } else if (s & 16) {
      let a = Qp(e, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let c = zn(e[Rt]);
        Es(c[H], c, a, n, !0);
      }
    }
    r = i ? r.projectionNext : r.next;
  }
  return n;
}
function fD(t, e) {
  for (let r = ut; r < t.length; r++) {
    let n = t[r],
      i = n[H].firstChild;
    i !== null && Es(n[H], n, i, e);
  }
  t[Hn] !== t[Yt] && e.push(t[Hn]);
}
var dg = [];
function hD(t) {
  return t[lt] ?? pD(t);
}
function pD(t) {
  let e = dg.pop() ?? Object.create(mD);
  return (e.lView = t), e;
}
function gD(t) {
  t.lView[lt] !== t && ((t.lView = null), dg.push(t));
}
var mD = q(D({}, ci), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    $s(t.lView);
  },
  consumerOnSignalRead() {
    this.lView[lt] = this;
  },
});
function vD(t) {
  let e = t[lt] ?? Object.create(yD);
  return (e.lView = t), e;
}
var yD = q(D({}, ci), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    let e = zn(t.lView);
    for (; e && !fg(e[H]); ) e = zn(e);
    e && ip(e);
  },
  consumerOnSignalRead() {
    this.lView[lt] = this;
  },
});
function fg(t) {
  return t.type !== 2;
}
var CD = 100;
function hg(t, e = !0, r = 0) {
  let n = t[Nt],
    i = n.rendererFactory,
    o = !1;
  o || i.begin?.();
  try {
    wD(t, r);
  } catch (s) {
    throw (e && lg(t, s), s);
  } finally {
    o || (i.end?.(), n.inlineEffectRunner?.flush());
  }
}
function wD(t, e) {
  let r = up();
  try {
    Zf(!0), Cl(t, e);
    let n = 0;
    for (; Ci(t); ) {
      if (n === CD) throw new A(103, !1);
      n++, Cl(t, 1);
    }
  } finally {
    Zf(r);
  }
}
function DD(t, e, r, n) {
  let i = e[k];
  if ((i & 256) === 256) return;
  let o = !1,
    s = !1;
  !o && e[Nt].inlineEffectRunner?.flush(), Wl(e);
  let a = !0,
    c = null,
    l = null;
  o ||
    (fg(t)
      ? ((l = hD(e)), (c = Do(l)))
      : Qd() === null
      ? ((a = !1), (l = vD(e)), (c = Do(l)))
      : e[lt] && (vc(e[lt]), (e[lt] = null)));
  try {
    rp(e), pC(t.bindingStartIndex), r !== null && rg(t, e, r, 2, n);
    let u = (i & 3) === 3;
    if (!o)
      if (u) {
        let g = t.preOrderCheckHooks;
        g !== null && rs(e, g, null);
      } else {
        let g = t.preOrderHooks;
        g !== null && is(e, g, 0, null), jc(e, 0);
      }
    if ((s || _D(e), pg(e, 0), t.contentQueries !== null && cg(t, e), !o))
      if (u) {
        let g = t.contentCheckHooks;
        g !== null && rs(e, g);
      } else {
        let g = t.contentHooks;
        g !== null && is(e, g, 1), jc(e, 1);
      }
    Fw(t, e);
    let h = t.components;
    h !== null && mg(e, h, 0);
    let m = t.viewQuery;
    if ((m !== null && yl(2, m, n), !o))
      if (u) {
        let g = t.viewCheckHooks;
        g !== null && rs(e, g);
      } else {
        let g = t.viewHooks;
        g !== null && is(e, g, 2), jc(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[Vc])) {
      for (let g of e[Vc]) g();
      e[Vc] = null;
    }
    o || (e[k] &= -73);
  } catch (u) {
    throw (o || $s(e), u);
  } finally {
    l !== null && (gc(l, c), a && gD(l)), ql();
  }
}
function pg(t, e) {
  for (let r = Pp(t); r !== null; r = Fp(r))
    for (let n = ut; n < r.length; n++) {
      let i = r[n];
      gg(i, e);
    }
}
function _D(t) {
  for (let e = Pp(t); e !== null; e = Fp(e)) {
    if (!(e[k] & ps.HasTransplantedViews)) continue;
    let r = e[hs];
    for (let n = 0; n < r.length; n++) {
      let i = r[n];
      ip(i);
    }
  }
}
function ED(t, e, r) {
  let n = _n(e, t);
  gg(n, r);
}
function gg(t, e) {
  zl(t) && Cl(t, e);
}
function Cl(t, e) {
  let n = t[H],
    i = t[k],
    o = t[lt],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && mc(o))),
    (s ||= !1),
    o && (o.dirty = !1),
    (t[k] &= -9217),
    s)
  )
    DD(n, t, n.template, t[Ct]);
  else if (i & 8192) {
    pg(t, 1);
    let a = n.components;
    a !== null && mg(t, a, 1);
  }
}
function mg(t, e, r) {
  for (let n = 0; n < e.length; n++) ED(t, e[n], r);
}
function hu(t, e) {
  let r = up() ? 64 : 1088;
  for (t[Nt].changeDetectionScheduler?.notify(e); t; ) {
    t[k] |= r;
    let n = zn(t);
    if (rl(t) && !n) return t;
    t = n;
  }
  return null;
}
var qn = class {
    get rootNodes() {
      let e = this._lView,
        r = e[H];
      return Es(r, e, r.firstChild, []);
    }
    constructor(e, r, n = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[Ct];
    }
    set context(e) {
      this._lView[Ct] = e;
    }
    get destroyed() {
      return (this._lView[k] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[$e];
        if (Qt(e)) {
          let r = e[fs],
            n = r ? r.indexOf(this) : -1;
          n > -1 && (gl(e, n), cs(r, n));
        }
        this._attachedToViewContainer = !1;
      }
      qp(this._lView[H], this._lView);
    }
    onDestroy(e) {
      op(this._lView, e);
    }
    markForCheck() {
      hu(this._cdRefInjectingView || this._lView, 4);
    }
    detach() {
      this._lView[k] &= -129;
    }
    reattach() {
      ol(this._lView), (this._lView[k] |= 128);
    }
    detectChanges() {
      (this._lView[k] |= 1024), hg(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new A(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      this._appRef = null;
      let e = rl(this._lView),
        r = this._lView[Tr];
      r !== null && !e && ru(r, this._lView), Gp(this._lView[H], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new A(902, !1);
      this._appRef = e;
      let r = rl(this._lView),
        n = this._lView[Tr];
      n !== null && !r && Wp(n, this._lView), ol(this._lView);
    }
  },
  na = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = MD;
    let t = e;
    return t;
  })(),
  bD = na,
  ID = class extends bD {
    constructor(e, r, n) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = r),
        (this.elementRef = n);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r);
    }
    createEmbeddedViewImpl(e, r, n) {
      let i = uD(this._declarationLView, this._declarationTContainer, e, {
        embeddedViewInjector: r,
        dehydratedView: n,
      });
      return new qn(i);
    }
  };
function MD() {
  return xD(Fe(), X());
}
function xD(t, e) {
  return t.type & 4 ? new ID(e, t, Ys(t, e)) : null;
}
var tP = new RegExp(`^(\\d+)*(${tw}|${ew})*(.*)`);
var SD = () => null;
function lh(t, e) {
  return SD(t, e);
}
var Or = class {},
  vg = new x("", { providedIn: "root", factory: () => !1 });
var yg = new x(""),
  wl = class {},
  bs = class {};
function TD(t) {
  let e = Error(`No component factory found for ${Ue(t)}.`);
  return (e[AD] = t), e;
}
var AD = "ngComponent";
var Dl = class {
    resolveComponentFactory(e) {
      throw TD(e);
    }
  },
  Mu = class Mu {};
Mu.NULL = new Dl();
var Pr = Mu,
  Fr = class {},
  Ft = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => ND();
    let t = e;
    return t;
  })();
function ND() {
  let t = X(),
    e = Fe(),
    r = _n(e.index, t);
  return (gn(r) ? r : t)[me];
}
var RD = (() => {
  let e = class e {};
  e.ɵprov = b({ token: e, providedIn: "root", factory: () => null });
  let t = e;
  return t;
})();
var uh = new Set();
function jr(t) {
  uh.has(t) ||
    (uh.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
var Ze = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(Ze || {}),
  OD = { destroy() {} };
function pu(t, e) {
  !e && Z0(pu);
  let r = e?.injector ?? C(tt);
  return hw(r)
    ? (jr("NgAfterNextRender"), FD(t, r, !0, e?.phase ?? Ze.MixedReadWrite))
    : OD;
}
function PD(t, e) {
  if (t instanceof Function)
    switch (e) {
      case Ze.EarlyRead:
        return { earlyRead: t };
      case Ze.Write:
        return { write: t };
      case Ze.MixedReadWrite:
        return { mixedReadWrite: t };
      case Ze.Read:
        return { read: t };
    }
  return t;
}
function FD(t, e, r, n) {
  let i = PD(t, n),
    o = e.get(gu),
    s = (o.handler ??= new El()),
    a = [],
    c = [],
    l = () => {
      for (let g of c) s.unregister(g);
      u();
    },
    u = e.get(Ql).onDestroy(l),
    h = 0,
    m = (g, w) => {
      if (!w) return;
      let O = r ? (...R) => (h--, h < 1 && l(), w(...R)) : w,
        N = nt(e, () => new _l(g, a, O));
      s.register(N), c.push(N), h++;
    };
  return (
    m(Ze.EarlyRead, i.earlyRead),
    m(Ze.Write, i.write),
    m(Ze.MixedReadWrite, i.mixedReadWrite),
    m(Ze.Read, i.read),
    { destroy: l }
  );
}
var _l = class {
    constructor(e, r, n) {
      (this.phase = e),
        (this.pipelinedArgs = r),
        (this.callbackFn = n),
        (this.zone = C(re)),
        (this.errorHandler = C(Wt, { optional: !0 })),
        C(Or, { optional: !0 })?.notify(6);
    }
    invoke() {
      try {
        let e = this.zone.runOutsideAngular(() =>
          this.callbackFn.apply(null, this.pipelinedArgs)
        );
        this.pipelinedArgs.splice(0, this.pipelinedArgs.length, e);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  El = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [Ze.EarlyRead]: new Set(),
          [Ze.Write]: new Set(),
          [Ze.MixedReadWrite]: new Set(),
          [Ze.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let e of Object.values(this.buckets)) for (let r of e) r.invoke();
      this.executingCallbacks = !1;
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  gu = (() => {
    let e = class e {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        this.executeInternalCallbacks(), this.handler?.execute();
      }
      executeInternalCallbacks() {
        let n = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let i of n) i();
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = b({ token: e, providedIn: "root", factory: () => new e() });
    let t = e;
    return t;
  })();
function Is(t, e, r) {
  let n = r ? t.styles : null,
    i = r ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = kf(i, a);
      else if (o == 2) {
        let c = a,
          l = e[++s];
        n = kf(n, c + ": " + l + ";");
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n),
    r ? (t.classes = i) : (t.classesWithoutHost = i);
}
var Ms = class extends Pr {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let r = vn(e);
    return new kr(r, this.ngModule);
  }
};
function dh(t, e) {
  let r = [];
  for (let n in t) {
    if (!t.hasOwnProperty(n)) continue;
    let i = t[n];
    if (i === void 0) continue;
    let o = Array.isArray(i),
      s = o ? i[0] : i,
      a = o ? i[1] : mn.None;
    e
      ? r.push({
          propName: s,
          templateName: n,
          isSignal: (a & mn.SignalBased) !== 0,
        })
      : r.push({ propName: s, templateName: n });
  }
  return r;
}
function kD(t) {
  let e = t.toLowerCase();
  return e === "svg" ? eC : e === "math" ? tC : null;
}
var kr = class extends bs {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = dh(e.inputs, !0);
      if (r !== null)
        for (let i of n)
          r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
      return n;
    }
    get outputs() {
      return dh(this.componentDef.outputs, !1);
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = R0(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(e, r, n, i) {
      let o = J(null);
      try {
        i = i || this.ngModule;
        let s = i instanceof Be ? i : i?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new al(e, s) : e,
          c = a.get(Fr, null);
        if (c === null) throw new A(407, !1);
        let l = a.get(RD, null),
          u = a.get(gu, null),
          h = a.get(Or, null),
          m = {
            rendererFactory: c,
            sanitizer: l,
            inlineEffectRunner: null,
            afterRenderEventManager: u,
            changeDetectionScheduler: h,
          },
          g = c.createRenderer(null, this.componentDef),
          w = this.componentDef.selectors[0][0] || "div",
          O = n
            ? Vw(g, n, this.componentDef.encapsulation, a)
            : zp(g, w, kD(w)),
          N = 512;
        this.componentDef.signals
          ? (N |= 4096)
          : this.componentDef.onPush || (N |= 16);
        let R = null;
        O !== null && (R = eu(O, a, !0));
        let ye = cu(0, null, null, 1, 0, null, null, null, null, null, null),
          ce = ea(null, ye, null, N, null, null, m, g, a, null, R);
        Wl(ce);
        let ie, st;
        try {
          let Ee = this.componentDef,
            at,
            sr = null;
          Ee.findHostDirectiveDefs
            ? ((at = []),
              (sr = new Map()),
              Ee.findHostDirectiveDefs(Ee, at, sr),
              at.push(Ee))
            : (at = [Ee]);
          let Cy = LD(ce, O),
            wy = VD(Cy, O, Ee, at, ce, m, g);
          (st = np(ye, et)),
            O && BD(g, Ee, O, n),
            r !== void 0 && $D(st, this.ngContentSelectors, r),
            (ie = UD(wy, Ee, at, sr, ce, [HD])),
            fu(ye, ce, null);
        } finally {
          ql();
        }
        return new bl(this.componentType, ie, Ys(st, ce), ce, st);
      } finally {
        J(o);
      }
    }
  },
  bl = class extends wl {
    constructor(e, r, n, i, o) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new qn(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        i;
      if (n !== null && (i = n[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), r))
        )
          return;
        let o = this._rootLView;
        du(o[H], o, i, e, r), this.previousInputValues.set(e, r);
        let s = _n(this._tNode.index, o);
        hu(s, 1);
      }
    }
    get injector() {
      return new Bn(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function LD(t, e) {
  let r = t[H],
    n = et;
  return (t[n] = e), Ii(r, n, 2, "#host", null);
}
function VD(t, e, r, n, i, o, s) {
  let a = i[H];
  jD(n, t, e, s);
  let c = null;
  e !== null && (c = eu(e, i[Sr]));
  let l = o.rendererFactory.createRenderer(e, r),
    u = 16;
  r.signals ? (u = 4096) : r.onPush && (u = 64);
  let h = ea(i, ig(r), null, u, i[t.index], t, o, l, null, null, c);
  return (
    a.firstCreatePass && vl(a, t, n.length - 1), ta(i, h), (i[t.index] = h)
  );
}
function jD(t, e, r, n) {
  for (let i of t) e.mergedAttrs = mi(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (Is(e, e.mergedAttrs, !0), r !== null && Jp(n, r, e));
}
function UD(t, e, r, n, i, o) {
  let s = Fe(),
    a = i[H],
    c = ft(s, i);
  og(a, i, s, r, null, n);
  for (let u = 0; u < r.length; u++) {
    let h = s.directiveStart + u,
      m = Rr(i, a, h, s);
    Cn(m, i);
  }
  sg(a, i, s), c && Cn(c, i);
  let l = Rr(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[Ct] = i[Ct] = l), o !== null)) for (let u of o) u(l, e);
  return ou(a, s, i), l;
}
function BD(t, e, r, n) {
  if (n) Xc(t, r, ["ng-version", "18.1.4"]);
  else {
    let { attrs: i, classes: o } = O0(e.selectors[0]);
    i && Xc(t, r, i), o && o.length > 0 && Kp(t, r, o.join(" "));
  }
}
function $D(t, e, r) {
  let n = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = r[i];
    n.push(o != null ? Array.from(o) : null);
  }
}
function HD() {
  let t = Fe();
  Zs(X()[H], t);
}
var Ur = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = zD;
  let t = e;
  return t;
})();
function zD() {
  let t = Fe();
  return WD(t, X());
}
var GD = Ur,
  Cg = class extends GD {
    constructor(e, r, n) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return Ys(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Bn(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Zl(this._hostTNode, this._hostLView);
      if (wp(e)) {
        let r = ms(e, this._hostLView),
          n = gs(e),
          i = r[H].data[n + 8];
        return new Bn(i, r);
      } else return new Bn(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let r = fh(this._lContainer);
      return (r !== null && r[e]) || null;
    }
    get length() {
      return this._lContainer.length - ut;
    }
    createEmbeddedView(e, r, n) {
      let i, o;
      typeof n == "number"
        ? (i = n)
        : n != null && ((i = n.index), (o = n.injector));
      let s = lh(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(r || {}, o, s);
      return this.insertImpl(a, i, ch(this._hostTNode, s)), a;
    }
    createComponent(e, r, n, i, o) {
      let s = e && !Q0(e),
        a;
      if (s) a = r;
      else {
        let w = r || {};
        (a = w.index),
          (n = w.injector),
          (i = w.projectableNodes),
          (o = w.environmentInjector || w.ngModuleRef);
      }
      let c = s ? e : new kr(vn(e)),
        l = n || this.parentInjector;
      if (!o && c.ngModule == null) {
        let O = (s ? l : this.parentInjector).get(Be, null);
        O && (o = O);
      }
      let u = vn(c.componentType ?? {}),
        h = lh(this._lContainer, u?.id ?? null),
        m = h?.firstChild ?? null,
        g = c.create(l, i, m, o);
      return this.insertImpl(g.hostView, a, ch(this._hostTNode, h)), g;
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0);
    }
    insertImpl(e, r, n) {
      let i = e._lView;
      if (nC(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = i[$e],
            l = new Cg(c, c[wt], c[$e]);
          l.detach(l.indexOf(e));
        }
      }
      let o = this._adjustIndex(r),
        s = this._lContainer;
      return dD(s, i, o, n), e.attachToViewContainerRef(), Rh(zc(s), o, e), e;
    }
    move(e, r) {
      return this.insert(e, r);
    }
    indexOf(e) {
      let r = fh(this._lContainer);
      return r !== null ? r.indexOf(e) : -1;
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = gl(this._lContainer, r);
      n && (cs(zc(this._lContainer), r), qp(n[H], n));
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = gl(this._lContainer, r);
      return n && cs(zc(this._lContainer), r) != null ? new qn(n) : null;
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r;
    }
  };
function fh(t) {
  return t[fs];
}
function zc(t) {
  return t[fs] || (t[fs] = []);
}
function WD(t, e) {
  let r,
    n = e[t.index];
  return (
    Qt(n) ? (r = n) : ((r = ag(n, e, null, t)), (e[t.index] = r), ta(e, r)),
    ZD(r, e, t, n),
    new Cg(r, t, e)
  );
}
function qD(t, e) {
  let r = t[me],
    n = r.createComment(""),
    i = ft(e, t),
    o = Yp(r, i);
  return _s(r, o, n, Mw(r, i), !1), n;
}
var ZD = KD,
  YD = () => !1;
function QD(t, e, r) {
  return YD(t, e, r);
}
function KD(t, e, r, n) {
  if (t[Hn]) return;
  let i;
  r.type & 8 ? (i = Ot(n)) : (i = qD(e, r)), (t[Hn] = i);
}
function JD(t) {
  return typeof t == "function" && t[$t] !== void 0;
}
function Mi(t, e) {
  jr("NgSignals");
  let r = cf(t),
    n = r[$t];
  return (
    e?.equal && (n.equal = e.equal),
    (r.set = (i) => yc(n, i)),
    (r.update = (i) => lf(n, i)),
    (r.asReadonly = XD.bind(r)),
    r
  );
}
function XD() {
  let t = this[$t];
  if (t.readonlyFn === void 0) {
    let e = () => this();
    (e[$t] = t), (t.readonlyFn = e);
  }
  return t.readonlyFn;
}
function wg(t) {
  return JD(t) && typeof t.set == "function";
}
function e_(t) {
  let e = [],
    r = new Map();
  function n(i) {
    let o = r.get(i);
    if (!o) {
      let s = t(i);
      r.set(i, (o = s.then(i_)));
    }
    return o;
  }
  return (
    xs.forEach((i, o) => {
      let s = [];
      i.templateUrl &&
        s.push(
          n(i.templateUrl).then((l) => {
            i.template = l;
          })
        );
      let a = typeof i.styles == "string" ? [i.styles] : i.styles || [];
      if (((i.styles = a), i.styleUrl && i.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
        );
      if (i.styleUrls?.length) {
        let l = i.styles.length,
          u = i.styleUrls;
        i.styleUrls.forEach((h, m) => {
          a.push(""),
            s.push(
              n(h).then((g) => {
                (a[l + m] = g),
                  u.splice(u.indexOf(h), 1),
                  u.length == 0 && (i.styleUrls = void 0);
              })
            );
        });
      } else
        i.styleUrl &&
          s.push(
            n(i.styleUrl).then((l) => {
              a.push(l), (i.styleUrl = void 0);
            })
          );
      let c = Promise.all(s).then(() => o_(o));
      e.push(c);
    }),
    n_(),
    Promise.all(e).then(() => {})
  );
}
var xs = new Map(),
  t_ = new Set();
function n_() {
  let t = xs;
  return (xs = new Map()), t;
}
function r_() {
  return xs.size === 0;
}
function i_(t) {
  return typeof t == "string" ? t : t.text();
}
function o_(t) {
  t_.delete(t);
}
function s_(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function Ye(t) {
  let e = s_(t.type),
    r = !0,
    n = [t];
  for (; e; ) {
    let i;
    if (yn(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new A(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (r) {
        n.push(i);
        let s = t;
        (s.inputs = Xo(t.inputs)),
          (s.inputTransforms = Xo(t.inputTransforms)),
          (s.declaredInputs = Xo(t.declaredInputs)),
          (s.outputs = Xo(t.outputs));
        let a = i.hostBindings;
        a && d_(t, a);
        let c = i.viewQuery,
          l = i.contentQueries;
        if (
          (c && l_(t, c),
          l && u_(t, l),
          a_(t, i),
          e0(t.outputs, i.outputs),
          yn(i) && i.data.animation)
        ) {
          let u = t.data;
          u.animation = (u.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === Ye && (r = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  c_(n);
}
function a_(t, e) {
  for (let r in e.inputs) {
    if (!e.inputs.hasOwnProperty(r) || t.inputs.hasOwnProperty(r)) continue;
    let n = e.inputs[r];
    if (
      n !== void 0 &&
      ((t.inputs[r] = n),
      (t.declaredInputs[r] = e.declaredInputs[r]),
      e.inputTransforms !== null)
    ) {
      let i = Array.isArray(n) ? n[0] : n;
      if (!e.inputTransforms.hasOwnProperty(i)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[i] = e.inputTransforms[i]);
    }
  }
}
function c_(t) {
  let e = 0,
    r = null;
  for (let n = t.length - 1; n >= 0; n--) {
    let i = t[n];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = mi(i.hostAttrs, (r = mi(r, i.hostAttrs))));
  }
}
function Xo(t) {
  return t === Ir ? {} : t === ct ? [] : t;
}
function l_(t, e) {
  let r = t.viewQuery;
  r
    ? (t.viewQuery = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.viewQuery = e);
}
function u_(t, e) {
  let r = t.contentQueries;
  r
    ? (t.contentQueries = (n, i, o) => {
        e(n, i, o), r(n, i, o);
      })
    : (t.contentQueries = e);
}
function d_(t, e) {
  let r = t.hostBindings;
  r
    ? (t.hostBindings = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.hostBindings = e);
}
function mu(t) {
  let e = t.inputConfig,
    r = {};
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let i = e[n];
      Array.isArray(i) && i[3] && (r[n] = i[3]);
    }
  t.inputTransforms = r;
}
var wn = class {},
  wi = class {};
var Ss = class extends wn {
    constructor(e, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Ms(this));
      let i = Bh(e);
      (this._bootstrapComponents = Hp(i.bootstrap)),
        (this._r3Injector = Tp(
          e,
          r,
          [
            { provide: wn, useValue: this },
            { provide: Pr, useValue: this.componentFactoryResolver },
            ...n,
          ],
          Ue(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  Ts = class extends wi {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new Ss(this.moduleType, e, []);
    }
  };
function f_(t, e, r) {
  return new Ss(t, e, r);
}
var Il = class extends wn {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new Ms(this)),
      (this.instance = null);
    let r = new vi(
      [
        ...e.providers,
        { provide: wn, useValue: this },
        { provide: Pr, useValue: this.componentFactoryResolver },
      ],
      e.parent || Bl(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = r),
      e.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function ra(t, e, r = null) {
  return new Il({
    providers: t,
    parent: e,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
function Dg(t) {
  return p_(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function h_(t, e) {
  if (Array.isArray(t)) for (let r = 0; r < t.length; r++) e(t[r]);
  else {
    let r = t[Symbol.iterator](),
      n;
    for (; !(n = r.next()).done; ) e(n.value);
  }
}
function p_(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
function vu(t, e, r) {
  return (t[e] = r);
}
function g_(t, e) {
  return t[e];
}
function Zt(t, e, r) {
  let n = t[e];
  return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function _g(t, e, r, n) {
  let i = Zt(t, e, r);
  return Zt(t, e + 1, n) || i;
}
function m_(t, e, r, n, i) {
  let o = _g(t, e, r, n);
  return Zt(t, e + 2, i) || o;
}
function v_(t) {
  return (t.flags & 32) === 32;
}
function y_(t, e, r, n, i, o, s, a, c) {
  let l = e.consts,
    u = Ii(e, t, 4, s || null, a || null);
  uu(e, r, u, Nr(l, c)), Zs(e, u);
  let h = (u.tView = cu(
    2,
    u,
    n,
    i,
    o,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    l,
    null
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, u), (h.queries = e.queries.embeddedTView(u))),
    u
  );
}
function C_(t, e, r, n, i, o, s, a, c, l) {
  let u = r + et,
    h = e.firstCreatePass ? y_(u, e, t, n, i, o, s, a, c) : e.data[u];
  Yn(h, !1);
  let m = w_(e, t, h, r);
  Ws() && Js(e, t, m, h), Cn(m, t);
  let g = ag(m, t, m, h);
  return (
    (t[u] = g),
    ta(t, g),
    QD(g, h, t),
    Bs(h) && su(e, t, h),
    c != null && au(t, h, l),
    h
  );
}
function P(t, e, r, n, i, o, s, a) {
  let c = X(),
    l = Ae(),
    u = Nr(l.consts, o);
  return C_(c, l, t, e, r, n, i, u, s, a), P;
}
var w_ = D_;
function D_(t, e, r, n) {
  return qs(!0), e[me].createComment("");
}
function Jn(t, e, r, n) {
  let i = X(),
    o = zs();
  if (Zt(i, o, e)) {
    let s = Ae(),
      a = Gs();
    tD(a, i, t, e, r, n);
  }
  return Jn;
}
function Eg(t, e, r, n) {
  return Zt(t, zs(), r) ? e + Un(r) + n : Et;
}
function __(t, e, r, n, i, o, s, a) {
  let c = hC(),
    l = m_(t, c, r, i, s);
  return dp(3), l ? e + Un(r) + n + Un(i) + o + Un(s) + a : Et;
}
function es(t, e) {
  return (t << 17) | (e << 2);
}
function Zn(t) {
  return (t >> 17) & 32767;
}
function E_(t) {
  return (t & 2) == 2;
}
function b_(t, e) {
  return (t & 131071) | (e << 17);
}
function Ml(t) {
  return t | 2;
}
function Lr(t) {
  return (t & 131068) >> 2;
}
function Gc(t, e) {
  return (t & -131069) | (e << 2);
}
function I_(t) {
  return (t & 1) === 1;
}
function xl(t) {
  return t | 1;
}
function M_(t, e, r, n, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = Zn(s),
    c = Lr(s);
  t[n] = r;
  let l = !1,
    u;
  if (Array.isArray(r)) {
    let h = r;
    (u = h[1]), (u === null || Ei(h, u) > 0) && (l = !0);
  } else u = r;
  if (i)
    if (c !== 0) {
      let m = Zn(t[a + 1]);
      (t[n + 1] = es(m, a)),
        m !== 0 && (t[m + 1] = Gc(t[m + 1], n)),
        (t[a + 1] = b_(t[a + 1], n));
    } else
      (t[n + 1] = es(a, 0)), a !== 0 && (t[a + 1] = Gc(t[a + 1], n)), (a = n);
  else
    (t[n + 1] = es(c, 0)),
      a === 0 ? (a = n) : (t[c + 1] = Gc(t[c + 1], n)),
      (c = n);
  l && (t[n + 1] = Ml(t[n + 1])),
    hh(t, u, n, !0),
    hh(t, u, n, !1),
    x_(e, u, t, n, o),
    (s = es(a, c)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function x_(t, e, r, n, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    Ei(o, e) >= 0 &&
    (r[n + 1] = xl(r[n + 1]));
}
function hh(t, e, r, n) {
  let i = t[r + 1],
    o = e === null,
    s = n ? Zn(i) : Lr(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let c = t[s],
      l = t[s + 1];
    S_(c, e) && ((a = !0), (t[s + 1] = n ? xl(l) : Ml(l))),
      (s = n ? Zn(l) : Lr(l));
  }
  a && (t[r + 1] = n ? Ml(i) : xl(i));
}
function S_(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? Ei(t, e) >= 0
    : !1;
}
function _(t, e, r) {
  let n = X(),
    i = zs();
  if (Zt(n, i, e)) {
    let o = Ae(),
      s = Gs();
    lu(o, s, n, t, e, n[me], r, !1);
  }
  return _;
}
function ph(t, e, r, n, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  du(t, r, o[s], s, n);
}
function Br(t, e, r) {
  return bg(t, e, r, !1), Br;
}
function ia(t, e) {
  return bg(t, e, null, !0), ia;
}
function bg(t, e, r, n) {
  let i = X(),
    o = Ae(),
    s = dp(2);
  if ((o.firstUpdatePass && A_(o, t, s, n), e !== Et && Zt(i, s, e))) {
    let a = o.data[Qn()];
    F_(o, a, i, i[me], t, (i[s + 1] = k_(e, r)), n, s);
  }
}
function T_(t, e) {
  return e >= t.expandoStartIndex;
}
function A_(t, e, r, n) {
  let i = t.data;
  if (i[r + 1] === null) {
    let o = i[Qn()],
      s = T_(t, r);
    L_(o, n) && e === null && !s && (e = !1),
      (e = N_(i, o, e, n)),
      M_(i, o, e, r, s, n);
  }
}
function N_(t, e, r, n) {
  let i = yC(t),
    o = n ? e.residualClasses : e.residualStyles;
  if (i === null)
    (n ? e.classBindings : e.styleBindings) === 0 &&
      ((r = Wc(null, t, e, r, n)), (r = Di(r, e.attrs, n)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((r = Wc(i, t, e, r, n)), o === null)) {
        let c = R_(t, e, n);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Wc(null, t, e, c[1], n)),
          (c = Di(c, e.attrs, n)),
          O_(t, e, n, c));
      } else o = P_(t, e, n);
  }
  return (
    o !== void 0 && (n ? (e.residualClasses = o) : (e.residualStyles = o)), r
  );
}
function R_(t, e, r) {
  let n = r ? e.classBindings : e.styleBindings;
  if (Lr(n) !== 0) return t[Zn(n)];
}
function O_(t, e, r, n) {
  let i = r ? e.classBindings : e.styleBindings;
  t[Zn(i)] = n;
}
function P_(t, e, r) {
  let n,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    n = Di(n, s, r);
  }
  return Di(n, e.attrs, r);
}
function Wc(t, e, r, n, i) {
  let o = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast;
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((o = e[a]), (n = Di(n, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (r.directiveStylingLast = a), n;
}
function Di(t, e, r) {
  let n = r ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === n &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          w0(t, s, r ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function F_(t, e, r, n, i, o, s, a) {
  if (!(e.type & 3)) return;
  let c = t.data,
    l = c[a + 1],
    u = I_(l) ? gh(c, e, r, i, Lr(l), s) : void 0;
  if (!As(u)) {
    As(o) || (E_(l) && (o = gh(c, null, r, i, a, s)));
    let h = tp(Qn(), r);
    Ow(n, s, h, i, o);
  }
}
function gh(t, e, r, n, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let c = t[i],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      h = u === null,
      m = r[i + 1];
    m === Et && (m = h ? ct : void 0);
    let g = h ? kc(m, n) : u === n ? m : void 0;
    if ((l && !As(g) && (g = kc(c, n)), As(g) && ((a = g), s))) return a;
    let w = t[i + 1];
    i = s ? Zn(w) : Lr(w);
  }
  if (e !== null) {
    let c = o ? e.residualClasses : e.residualStyles;
    c != null && (a = kc(c, n));
  }
  return a;
}
function As(t) {
  return t !== void 0;
}
function k_(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = Ue(bi(t)))),
    t
  );
}
function L_(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
function V_(t, e, r, n, i, o) {
  let s = e.consts,
    a = Nr(s, i),
    c = Ii(e, t, 2, n, a);
  return (
    uu(e, r, c, Nr(s, o)),
    c.attrs !== null && Is(c, c.attrs, !1),
    c.mergedAttrs !== null && Is(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function f(t, e, r, n) {
  let i = X(),
    o = Ae(),
    s = et + t,
    a = i[me],
    c = o.firstCreatePass ? V_(s, o, i, e, r, n) : o.data[s],
    l = j_(o, i, c, a, e, t);
  i[s] = l;
  let u = Bs(c);
  return (
    Yn(c, !0),
    Jp(a, l, c),
    !v_(c) && Ws() && Js(o, i, l, c),
    oC() === 0 && Cn(l, i),
    sC(),
    u && (su(o, i, c), ou(o, c, i)),
    n !== null && au(i, c),
    f
  );
}
function d() {
  let t = Fe();
  Gl() ? lp() : ((t = t.parent), Yn(t, !1));
  let e = t;
  lC(e) && uC(), aC();
  let r = Ae();
  return (
    r.firstCreatePass && (Zs(r, t), $l(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      IC(e) &&
      ph(r, e, X(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      MC(e) &&
      ph(r, e, X(), e.stylesWithoutHost, !1),
    d
  );
}
function ge(t, e, r, n) {
  return f(t, e, r, n), d(), ge;
}
var j_ = (t, e, r, n, i, o) => (qs(!0), zp(n, i, DC()));
function U_(t, e, r, n, i) {
  let o = e.consts,
    s = Nr(o, n),
    a = Ii(e, t, 8, "ng-container", s);
  s !== null && Is(a, s, !0);
  let c = Nr(o, i);
  return uu(e, r, a, c), e.queries !== null && e.queries.elementStart(e, a), a;
}
function yu(t, e, r) {
  let n = X(),
    i = Ae(),
    o = t + et,
    s = i.firstCreatePass ? U_(o, i, n, e, r) : i.data[o];
  Yn(s, !0);
  let a = B_(i, n, s, t);
  return (
    (n[o] = a),
    Ws() && Js(i, n, a, s),
    Cn(a, n),
    Bs(s) && (su(i, n, s), ou(i, s, n)),
    r != null && au(n, s),
    yu
  );
}
function Cu() {
  let t = Fe(),
    e = Ae();
  return (
    Gl() ? lp() : ((t = t.parent), Yn(t, !1)),
    e.firstCreatePass && (Zs(e, t), $l(t) && e.queries.elementEnd(t)),
    Cu
  );
}
var B_ = (t, e, r, n) => (qs(!0), vw(e[me], ""));
function K() {
  return X();
}
var Vn = void 0;
function $_(t) {
  let e = t,
    r = Math.floor(Math.abs(t)),
    n = t.toString().replace(/^[^.]*\.?/, "").length;
  return r === 1 && n === 0 ? 1 : 5;
}
var H_ = [
    "en",
    [["a", "p"], ["AM", "PM"], Vn],
    [["AM", "PM"], Vn, Vn],
    [
      ["S", "M", "T", "W", "T", "F", "S"],
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    ],
    Vn,
    [
      ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    ],
    Vn,
    [
      ["B", "A"],
      ["BC", "AD"],
      ["Before Christ", "Anno Domini"],
    ],
    0,
    [6, 0],
    ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
    ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
    ["{1}, {0}", Vn, "{1} 'at' {0}", Vn],
    [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"],
    ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"],
    "USD",
    "$",
    "US Dollar",
    {},
    "ltr",
    $_,
  ],
  qc = {};
function ht(t) {
  let e = z_(t),
    r = mh(e);
  if (r) return r;
  let n = e.split("-")[0];
  if (((r = mh(n)), r)) return r;
  if (n === "en") return H_;
  throw new A(701, !1);
}
function mh(t) {
  return (
    t in qc ||
      (qc[t] =
        Ve.ng &&
        Ve.ng.common &&
        Ve.ng.common.locales &&
        Ve.ng.common.locales[t]),
    qc[t]
  );
}
var ve = (function (t) {
  return (
    (t[(t.LocaleId = 0)] = "LocaleId"),
    (t[(t.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
    (t[(t.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
    (t[(t.DaysFormat = 3)] = "DaysFormat"),
    (t[(t.DaysStandalone = 4)] = "DaysStandalone"),
    (t[(t.MonthsFormat = 5)] = "MonthsFormat"),
    (t[(t.MonthsStandalone = 6)] = "MonthsStandalone"),
    (t[(t.Eras = 7)] = "Eras"),
    (t[(t.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
    (t[(t.WeekendRange = 9)] = "WeekendRange"),
    (t[(t.DateFormat = 10)] = "DateFormat"),
    (t[(t.TimeFormat = 11)] = "TimeFormat"),
    (t[(t.DateTimeFormat = 12)] = "DateTimeFormat"),
    (t[(t.NumberSymbols = 13)] = "NumberSymbols"),
    (t[(t.NumberFormats = 14)] = "NumberFormats"),
    (t[(t.CurrencyCode = 15)] = "CurrencyCode"),
    (t[(t.CurrencySymbol = 16)] = "CurrencySymbol"),
    (t[(t.CurrencyName = 17)] = "CurrencyName"),
    (t[(t.Currencies = 18)] = "Currencies"),
    (t[(t.Directionality = 19)] = "Directionality"),
    (t[(t.PluralCase = 20)] = "PluralCase"),
    (t[(t.ExtraData = 21)] = "ExtraData"),
    t
  );
})(ve || {});
function z_(t) {
  return t.toLowerCase().replace(/_/g, "-");
}
var Ns = "en-US";
var G_ = Ns;
function W_(t) {
  typeof t == "string" && (G_ = t.toLowerCase().replace(/_/g, "-"));
}
var q_ = (t, e, r) => {};
function S(t, e, r, n) {
  let i = X(),
    o = Ae(),
    s = Fe();
  return Ig(o, i, i[me], s, t, e, n), S;
}
function Z_(t, e, r, n) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === r && i[o + 1] === n) {
        let a = e[ds],
          c = i[o + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function Ig(t, e, r, n, i, o, s) {
  let a = Bs(n),
    l = t.firstCreatePass && sD(t),
    u = e[Ct],
    h = oD(e),
    m = !0;
  if (n.type & 3 || s) {
    let O = ft(n, e),
      N = s ? s(O) : O,
      R = h.length,
      ye = s ? (ie) => s(Ot(ie[n.index])) : n.index,
      ce = null;
    if ((!s && a && (ce = Z_(t, e, i, n.index)), ce !== null)) {
      let ie = ce.__ngLastListenerFn__ || ce;
      (ie.__ngNextListenerFn__ = o), (ce.__ngLastListenerFn__ = o), (m = !1);
    } else {
      (o = yh(n, e, u, o)), q_(O, i, o);
      let ie = r.listen(N, i, o);
      h.push(o, ie), l && l.push(i, ye, R, R + 1);
    }
  } else o = yh(n, e, u, o);
  let g = n.outputs,
    w;
  if (m && g !== null && (w = g[i])) {
    let O = w.length;
    if (O)
      for (let N = 0; N < O; N += 2) {
        let R = w[N],
          ye = w[N + 1],
          st = e[R][ye].subscribe(o),
          Ee = h.length;
        h.push(o, st), l && l.push(i, n.index, Ee, -(Ee + 1));
      }
  }
}
function vh(t, e, r, n) {
  let i = J(null);
  try {
    return St(6, e, r), r(n) !== !1;
  } catch (o) {
    return lg(t, o), !1;
  } finally {
    St(7, e, r), J(i);
  }
}
function yh(t, e, r, n) {
  return function i(o) {
    if (o === Function) return n;
    let s = t.componentOffset > -1 ? _n(t.index, e) : e;
    hu(s, 5);
    let a = vh(e, r, n, o),
      c = i.__ngNextListenerFn__;
    for (; c; ) (a = vh(e, r, c, o) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function y(t = 1) {
  return wC(t);
}
function xi(t, e, r) {
  return Mg(t, "", e, "", r), xi;
}
function Mg(t, e, r, n, i) {
  let o = X(),
    s = Eg(o, e, r, n);
  if (s !== Et) {
    let a = Ae(),
      c = Gs();
    lu(a, c, o, t, s, o[me], i, !1);
  }
  return Mg;
}
function Y_(t, e, r, n) {
  r >= t.data.length && ((t.data[r] = null), (t.blueprint[r] = null)),
    (e[r] = n);
}
function oa(t) {
  let e = fC();
  return Hl(e, et + t);
}
function p(t, e = "") {
  let r = X(),
    n = Ae(),
    i = t + et,
    o = n.firstCreatePass ? Ii(n, i, 1, e, null) : n.data[i],
    s = Q_(n, r, o, e, t);
  (r[i] = s), Ws() && Js(n, r, s, o), Yn(o, !1);
}
var Q_ = (t, e, r, n, i) => (qs(!0), gw(e[me], n));
function Me(t) {
  return he("", t, ""), Me;
}
function he(t, e, r) {
  let n = X(),
    i = Eg(n, t, e, r);
  return i !== Et && ug(n, Qn(), i), he;
}
function wu(t, e, r, n, i, o, s) {
  let a = X(),
    c = __(a, t, e, r, n, i, o, s);
  return c !== Et && ug(a, Qn(), c), wu;
}
function G(t, e, r) {
  wg(e) && (e = e());
  let n = X(),
    i = zs();
  if (Zt(n, i, e)) {
    let o = Ae(),
      s = Gs();
    lu(o, s, n, t, e, n[me], r, !1);
  }
  return G;
}
function Z(t, e) {
  let r = wg(t);
  return r && t.set(e), r;
}
function W(t, e) {
  let r = X(),
    n = Ae(),
    i = Fe();
  return Ig(n, r, r[me], i, t, e), W;
}
function K_(t, e, r) {
  let n = Ae();
  if (n.firstCreatePass) {
    let i = yn(t);
    Sl(r, n.data, n.blueprint, i, !0), Sl(e, n.data, n.blueprint, i, !1);
  }
}
function Sl(t, e, r, n, i) {
  if (((t = je(t)), Array.isArray(t)))
    for (let o = 0; o < t.length; o++) Sl(t[o], e, r, n, i);
  else {
    let o = Ae(),
      s = X(),
      a = Fe(),
      c = xr(t) ? t : je(t.provide),
      l = qh(t),
      u = a.providerIndexes & 1048575,
      h = a.directiveStart,
      m = a.providerIndexes >> 20;
    if (xr(t) || !t.multi) {
      let g = new Wn(l, i, E),
        w = Yc(c, e, i ? u : u + m, h);
      w === -1
        ? (ll(ys(a, s), o, c),
          Zc(o, t, e.length),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(g),
          s.push(g))
        : ((r[w] = g), (s[w] = g));
    } else {
      let g = Yc(c, e, u + m, h),
        w = Yc(c, e, u, u + m),
        O = g >= 0 && r[g],
        N = w >= 0 && r[w];
      if ((i && !N) || (!i && !O)) {
        ll(ys(a, s), o, c);
        let R = eE(i ? X_ : J_, r.length, i, n, l);
        !i && N && (r[w].providerFactory = R),
          Zc(o, t, e.length, 0),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(R),
          s.push(R);
      } else {
        let R = xg(r[i ? w : g], l, !i && n);
        Zc(o, t, g > -1 ? g : w, R);
      }
      !i && n && N && r[w].componentProviders++;
    }
  }
}
function Zc(t, e, r, n) {
  let i = xr(e),
    o = B0(e);
  if (i || o) {
    let c = (o ? je(e.useClass) : e).prototype.ngOnDestroy;
    if (c) {
      let l = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let u = l.indexOf(r);
        u === -1 ? l.push(r, [n, c]) : l[u + 1].push(n, c);
      } else l.push(r, c);
    }
  }
}
function xg(t, e, r) {
  return r && t.componentProviders++, t.multi.push(e) - 1;
}
function Yc(t, e, r, n) {
  for (let i = r; i < n; i++) if (e[i] === t) return i;
  return -1;
}
function J_(t, e, r, n) {
  return Tl(this.multi, []);
}
function X_(t, e, r, n) {
  let i = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Rr(r, r[H], this.providerFactory.index, n);
    (o = a.slice(0, s)), Tl(i, o);
    for (let c = s; c < a.length; c++) o.push(a[c]);
  } else (o = []), Tl(i, o);
  return o;
}
function Tl(t, e) {
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    e.push(n());
  }
  return e;
}
function eE(t, e, r, n, i) {
  let o = new Wn(t, r, E);
  return (
    (o.multi = []),
    (o.index = e),
    (o.componentProviders = 0),
    xg(o, i, n && !r),
    o
  );
}
function kt(t, e = []) {
  return (r) => {
    r.providersResolver = (n, i) => K_(n, i ? i(t) : t, e);
  };
}
var tE = (() => {
  let e = class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let i = zh(!1, n.type),
          o =
            i.length > 0
              ? ra([i], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = b({
    token: e,
    providedIn: "environment",
    factory: () => new e(T(Be)),
  });
  let t = e;
  return t;
})();
function Sg(t) {
  jr("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(tE).getOrCreateStandaloneInjector(t));
}
function Tg(t, e, r) {
  let n = Hs() + t,
    i = X();
  return i[n] === Et ? vu(i, n, r ? e.call(r) : e()) : g_(i, n);
}
function Si(t, e, r, n) {
  return Ng(X(), Hs(), t, e, r, n);
}
function Ag(t, e) {
  let r = t[e];
  return r === Et ? void 0 : r;
}
function Ng(t, e, r, n, i, o) {
  let s = e + r;
  return Zt(t, s, i) ? vu(t, s + 1, o ? n.call(o, i) : n(i)) : Ag(t, s + 1);
}
function nE(t, e, r, n, i, o, s) {
  let a = e + r;
  return _g(t, a, i, o)
    ? vu(t, a + 2, s ? n.call(s, i, o) : n(i, o))
    : Ag(t, a + 2);
}
function Ti(t, e) {
  let r = Ae(),
    n,
    i = t + et;
  r.firstCreatePass
    ? ((n = rE(e, r.pipeRegistry)),
      (r.data[i] = n),
      n.onDestroy && (r.destroyHooks ??= []).push(i, n.onDestroy))
    : (n = r.data[i]);
  let o = n.factory || (n.factory = $n(n.type, !0)),
    s,
    a = qe(E);
  try {
    let c = vs(!1),
      l = o();
    return vs(c), Y_(r, X(), i, l), l;
  } finally {
    qe(a);
  }
}
function rE(t, e) {
  if (e)
    for (let r = e.length - 1; r >= 0; r--) {
      let n = e[r];
      if (t === n.name) return n;
    }
}
function Du(t, e, r) {
  let n = t + et,
    i = X(),
    o = Hl(i, n);
  return Og(i, n) ? Ng(i, Hs(), e, o.transform, r, o) : o.transform(r);
}
function Rg(t, e, r, n) {
  let i = t + et,
    o = X(),
    s = Hl(o, i);
  return Og(o, i) ? nE(o, Hs(), e, s.transform, r, n, s) : s.transform(r, n);
}
function Og(t, e) {
  return t[H].data[e].pure;
}
var ts = null;
function iE(t) {
  (ts !== null &&
    (t.defaultEncapsulation !== ts.defaultEncapsulation ||
      t.preserveWhitespaces !== ts.preserveWhitespaces)) ||
    (ts = t);
}
var sa = (() => {
  let e = class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "platform" }));
  let t = e;
  return t;
})();
var _u = new x(""),
  Ai = new x(""),
  aa = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._ngZone = n),
          (this.registry = i),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          Eu || (oE(o), o.addToWindow(i)),
          this._watchAngularEvents(),
          n.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                re.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      isStable() {
        return this._isZoneStable && !this._ngZone.hasPendingMacrotasks;
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let n = this._callbacks.pop();
              clearTimeout(n.timeoutId), n.doneCb();
            }
          });
        else {
          let n = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((i) =>
            i.updateCb && i.updateCb(n) ? (clearTimeout(i.timeoutId), !1) : !0
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((n) => ({
              source: n.source,
              creationLocation: n.creationLocation,
              data: n.data,
            }))
          : [];
      }
      addCallback(n, i, o) {
        let s = -1;
        i &&
          i > 0 &&
          (s = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== s
            )),
              n();
          }, i)),
          this._callbacks.push({ doneCb: n, timeoutId: s, updateCb: o });
      }
      whenStable(n, i, o) {
        if (o && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(n, i, o), this._runCallbacksIfReady();
      }
      registerApplication(n) {
        this.registry.registerApplication(n, this);
      }
      unregisterApplication(n) {
        this.registry.unregisterApplication(n);
      }
      findProviders(n, i, o) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(re), T(ca), T(Ai));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ca = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(n, i) {
        this._applications.set(n, i);
      }
      unregisterApplication(n) {
        this._applications.delete(n);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(n) {
        return this._applications.get(n) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(n, i = !0) {
        return Eu?.findTestabilityInTree(this, n, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function oE(t) {
  Eu = t;
}
var Eu;
function Xn(t) {
  return !!t && typeof t.then == "function";
}
function Pg(t) {
  return !!t && typeof t.subscribe == "function";
}
var la = new x(""),
  Fg = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            (this.resolve = n), (this.reject = i);
          })),
          (this.appInits = C(la, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let s = o();
          if (Xn(s)) n.push(s);
          else if (Pg(s)) {
            let a = new Promise((c, l) => {
              s.subscribe({ complete: c, error: l });
            });
            n.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ua = new x("");
function sE() {
  af(() => {
    throw new A(600, !1);
  });
}
function aE(t) {
  return t.isBoundToModule;
}
var cE = 10;
function lE(t, e, r) {
  try {
    let n = r();
    return Xn(n)
      ? n.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : n;
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n);
  }
}
function kg(t, e) {
  return Array.isArray(e) ? e.reduce(kg, t) : D(D({}, t), e);
}
var En = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = C(WC)),
        (this.afterRenderEffectManager = C(gu)),
        (this.zonelessEnabled = C(vg)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new xe()),
        (this.afterTick = new xe()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = C(Kt).hasPendingTasks.pipe(V((n) => !n))),
        (this._injector = C(Be));
    }
    get allViews() {
      return [...this.externalTestViews.keys(), ...this._views];
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, i) {
      let o = n instanceof bs;
      if (!this._injector.get(Fg).done) {
        let g = !o && Uh(n),
          w = !1;
        throw new A(405, w);
      }
      let a;
      o ? (a = n) : (a = this._injector.get(Pr).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let c = aE(a) ? void 0 : this._injector.get(wn),
        l = i || a.selector,
        u = a.create(tt.NULL, [], l, c),
        h = u.location.nativeElement,
        m = u.injector.get(_u, null);
      return (
        m?.registerApplication(h),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            os(this.components, u),
            m?.unregisterApplication(h);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(n) {
      if (this._runningTick) throw new A(101, !1);
      let i = J(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(n);
      } catch (o) {
        this.internalErrorHandler(o);
      } finally {
        (this._runningTick = !1), J(i), this.afterTick.next();
      }
    }
    detectChangesInAttachedViews(n) {
      let i = null;
      this._injector.destroyed ||
        (i = this._injector.get(Fr, null, { optional: !0 }));
      let o = 0,
        s = this.afterRenderEffectManager;
      for (; o < cE; ) {
        let a = o === 0;
        if (n || !a) {
          this.beforeRender.next(a);
          for (let { _lView: c, notifyErrorHandler: l } of this._views)
            uE(c, l, a, this.zonelessEnabled);
        } else i?.begin?.(), i?.end?.();
        if (
          (o++,
          s.executeInternalCallbacks(),
          !this.allViews.some(({ _lView: c }) => Ci(c)) &&
            (s.execute(), !this.allViews.some(({ _lView: c }) => Ci(c))))
        )
          break;
      }
    }
    attachView(n) {
      let i = n;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(n) {
      let i = n;
      os(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let i = this._injector.get(ua, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => os(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new A(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function os(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function uE(t, e, r, n) {
  if (!r && !Ci(t)) return;
  hg(t, e, r && !n ? 0 : 1);
}
var Al = class {
    constructor(e, r) {
      (this.ngModuleFactory = e), (this.componentFactories = r);
    }
  },
  da = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new Ts(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          o = Bh(n),
          s = Hp(o.declarations).reduce((a, c) => {
            let l = vn(c);
            return l && a.push(new kr(l)), a;
          }, []);
        return new Al(i, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  dE = new x("");
function fE(t, e, r) {
  let n = new Ts(r);
  return Promise.resolve(n);
}
function Ch(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var hE = (() => {
  let e = class e {
    constructor() {
      (this.zone = C(re)),
        (this.changeDetectionScheduler = C(Or)),
        (this.applicationRef = C(En));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.changeDetectionScheduler.runningTick ||
                this.zone.run(() => {
                  this.applicationRef.tick();
                });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function pE({ ngZoneFactory: t, ignoreChangesOutsideZone: e }) {
  return (
    (t ??= () => new re(Lg())),
    [
      { provide: re, useFactory: t },
      {
        provide: Mr,
        multi: !0,
        useFactory: () => {
          let r = C(hE, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: Mr,
        multi: !0,
        useFactory: () => {
          let r = C(gE);
          return () => {
            r.initialize();
          };
        },
      },
      e === !0 ? { provide: yg, useValue: !0 } : [],
    ]
  );
}
function Lg(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var gE = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new pe()),
        (this.initialized = !1),
        (this.zone = C(re)),
        (this.pendingTasks = C(Kt));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              re.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            re.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var mE = (() => {
  let e = class e {
    constructor() {
      (this.appRef = C(En)),
        (this.taskService = C(Kt)),
        (this.ngZone = C(re)),
        (this.zonelessEnabled = C(vg)),
        (this.disableScheduling = C(yg, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < "u" && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new pe()),
        (this.cancelScheduledCallback = null),
        (this.shouldRefreshViews = !1),
        (this.useMicrotaskScheduler = !1),
        (this.runningTick = !1),
        (this.pendingRenderTaskId = null),
        this.subscriptions.add(
          this.appRef.afterTick.subscribe(() => {
            this.runningTick || this.cleanup();
          })
        ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          })
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof ws || !this.zoneIsDefined));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      switch (n) {
        case 3:
        case 2:
        case 0:
        case 4:
        case 5:
        case 1: {
          this.shouldRefreshViews = !0;
          break;
        }
        case 8:
        case 7:
        case 6:
        case 9:
        default:
      }
      if (!this.shouldScheduleTick()) return;
      let i = this.useMicrotaskScheduler ? Xf : Ap;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.zoneIsDefined
          ? Zone.root.run(() => {
              this.cancelScheduledCallback = i(() => {
                this.tick(this.shouldRefreshViews);
              });
            })
          : (this.cancelScheduledCallback = i(() => {
              this.tick(this.shouldRefreshViews);
            }));
    }
    shouldScheduleTick() {
      return !(
        this.disableScheduling ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled && this.zoneIsDefined && re.isInAngularZone())
      );
    }
    tick(n) {
      if (this.runningTick || this.appRef.destroyed) return;
      let i = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick(n);
          },
          void 0,
          this.schedulerTickApplyArgs
        );
      } catch (o) {
        throw (this.taskService.remove(i), o);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        Xf(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(i);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.shouldRefreshViews = !1),
        (this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(n);
      }
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function vE() {
  return (typeof $localize < "u" && $localize.locale) || Ns;
}
var fa = new x("", {
  providedIn: "root",
  factory: () => C(fa, U.Optional | U.SkipSelf) || vE(),
});
var Vg = new x(""),
  jg = (() => {
    let e = class e {
      constructor(n) {
        (this._injector = n),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(n, i) {
        let o = GC(
          i?.ngZone,
          Lg({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          })
        );
        return o.run(() => {
          let s = i?.ignoreChangesOutsideZone,
            a = f_(n.moduleType, this.injector, [
              ...pE({ ngZoneFactory: () => o, ignoreChangesOutsideZone: s }),
              { provide: Or, useExisting: mE },
            ]),
            c = a.injector.get(Wt, null);
          return (
            o.runOutsideAngular(() => {
              let l = o.onError.subscribe({
                next: (u) => {
                  c.handleError(u);
                },
              });
              a.onDestroy(() => {
                os(this._modules, a), l.unsubscribe();
              });
            }),
            lE(c, o, () => {
              let l = a.injector.get(Fg);
              return (
                l.runInitializers(),
                l.donePromise.then(() => {
                  let u = a.injector.get(fa, Ns);
                  return W_(u || Ns), this._moduleDoBootstrap(a), a;
                })
              );
            })
          );
        });
      }
      bootstrapModule(n, i = []) {
        let o = kg({}, i);
        return fE(this.injector, o, n).then((s) =>
          this.bootstrapModuleFactory(s, o)
        );
      }
      _moduleDoBootstrap(n) {
        let i = n.injector.get(En);
        if (n._bootstrapComponents.length > 0)
          n._bootstrapComponents.forEach((o) => i.bootstrap(o));
        else if (n.instance.ngDoBootstrap) n.instance.ngDoBootstrap(i);
        else throw new A(-403, !1);
        this._modules.push(n);
      }
      onDestroy(n) {
        this._destroyListeners.push(n);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new A(404, !1);
        this._modules.slice().forEach((i) => i.destroy()),
          this._destroyListeners.forEach((i) => i());
        let n = this._injector.get(Vg, null);
        n && (n.forEach((i) => i()), n.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(tt));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  pi = null,
  Ug = new x("");
function yE(t) {
  if (pi && !pi.get(Ug, !1)) throw new A(400, !1);
  sE(), (pi = t);
  let e = t.get(jg);
  return DE(t), e;
}
function bu(t, e, r = []) {
  let n = `Platform: ${e}`,
    i = new x(n);
  return (o = []) => {
    let s = Bg();
    if (!s || s.injector.get(Ug, !1)) {
      let a = [...r, ...o, { provide: i, useValue: !0 }];
      t ? t(a) : yE(CE(a, n));
    }
    return wE(i);
  };
}
function CE(t = [], e) {
  return tt.create({
    name: e,
    providers: [
      { provide: Vs, useValue: "platform" },
      { provide: Vg, useValue: new Set([() => (pi = null)]) },
      ...t,
    ],
  });
}
function wE(t) {
  let e = Bg();
  if (!e) throw new A(401, !1);
  return e;
}
function Bg() {
  return pi?.get(jg) ?? null;
}
function DE(t) {
  t.get(Jl, null)?.forEach((r) => r());
}
var er = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = _E;
  let t = e;
  return t;
})();
function _E(t) {
  return EE(Fe(), X(), (t & 16) === 16);
}
function EE(t, e, r) {
  if (Us(t) && !r) {
    let n = _n(t.index, e);
    return new qn(n, n);
  } else if (t.type & 175) {
    let n = e[Rt];
    return new qn(n, e);
  }
  return null;
}
var Nl = class {
    constructor() {}
    supports(e) {
      return Dg(e);
    }
    create(e) {
      return new Rl(e);
    }
  },
  bE = (t, e) => e,
  Rl = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || bE);
    }
    forEachItem(e) {
      let r;
      for (r = this._itHead; r !== null; r = r._next) e(r);
    }
    forEachOperation(e) {
      let r = this._itHead,
        n = this._removalsHead,
        i = 0,
        o = null;
      for (; r || n; ) {
        let s = !n || (r && r.currentIndex < wh(n, i, o)) ? r : n,
          a = wh(s, i, o),
          c = s.currentIndex;
        if (s === n) i--, (n = n._nextRemoved);
        else if (((r = r._next), s.previousIndex == null)) i++;
        else {
          o || (o = []);
          let l = a - i,
            u = c - i;
          if (l != u) {
            for (let m = 0; m < l; m++) {
              let g = m < o.length ? o[m] : (o[m] = 0),
                w = g + m;
              u <= w && w < l && (o[m] = g + 1);
            }
            let h = s.previousIndex;
            o[h] = u - l;
          }
        }
        a !== c && e(s, a, c);
      }
    }
    forEachPreviousItem(e) {
      let r;
      for (r = this._previousItHead; r !== null; r = r._nextPrevious) e(r);
    }
    forEachAddedItem(e) {
      let r;
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
    }
    forEachMovedItem(e) {
      let r;
      for (r = this._movesHead; r !== null; r = r._nextMoved) e(r);
    }
    forEachRemovedItem(e) {
      let r;
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
    }
    forEachIdentityChange(e) {
      let r;
      for (r = this._identityChangesHead; r !== null; r = r._nextIdentityChange)
        e(r);
    }
    diff(e) {
      if ((e == null && (e = []), !Dg(e))) throw new A(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let r = this._itHead,
        n = !1,
        i,
        o,
        s;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (o = e[a]),
            (s = this._trackByFn(a, o)),
            r === null || !Object.is(r.trackById, s)
              ? ((r = this._mismatch(r, o, s, a)), (n = !0))
              : (n && (r = this._verifyReinsertion(r, o, s, a)),
                Object.is(r.item, o) || this._addIdentityChange(r, o)),
            (r = r._next);
      } else
        (i = 0),
          h_(e, (a) => {
            (s = this._trackByFn(i, a)),
              r === null || !Object.is(r.trackById, s)
                ? ((r = this._mismatch(r, a, s, i)), (n = !0))
                : (n && (r = this._verifyReinsertion(r, a, s, i)),
                  Object.is(r.item, a) || this._addIdentityChange(r, a)),
              (r = r._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(r), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, r, n, i) {
      let o;
      return (
        e === null ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(n, null)),
        e !== null
          ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
            this._reinsertAfter(e, o, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(n, i)),
            e !== null
              ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new Ol(r, n), o, i))),
        e
      );
    }
    _verifyReinsertion(e, r, n, i) {
      let o =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(n, null);
      return (
        o !== null
          ? (e = this._reinsertAfter(o, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let r = e._next;
        this._addToRemovals(this._unlink(e)), (e = r);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, r, n) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        o = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
        o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
        this._insertAfter(e, r, n),
        this._addToMoves(e, n),
        e
      );
    }
    _moveAfter(e, r, n) {
      return (
        this._unlink(e), this._insertAfter(e, r, n), this._addToMoves(e, n), e
      );
    }
    _addAfter(e, r, n) {
      return (
        this._insertAfter(e, r, n),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, r, n) {
      let i = r === null ? this._itHead : r._next;
      return (
        (e._next = i),
        (e._prev = r),
        i === null ? (this._itTail = e) : (i._prev = e),
        r === null ? (this._itHead = e) : (r._next = e),
        this._linkedRecords === null && (this._linkedRecords = new Rs()),
        this._linkedRecords.put(e),
        (e.currentIndex = n),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let r = e._prev,
        n = e._next;
      return (
        r === null ? (this._itHead = n) : (r._next = n),
        n === null ? (this._itTail = r) : (n._prev = r),
        e
      );
    }
    _addToMoves(e, r) {
      return (
        e.previousIndex === r ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Rs()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, r) {
      return (
        (e.item = r),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  Ol = class {
    constructor(e, r) {
      (this.item = e),
        (this.trackById = r),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  Pl = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, r) {
      let n;
      for (n = this._head; n !== null; n = n._nextDup)
        if ((r === null || r <= n.currentIndex) && Object.is(n.trackById, e))
          return n;
      return null;
    }
    remove(e) {
      let r = e._prevDup,
        n = e._nextDup;
      return (
        r === null ? (this._head = n) : (r._nextDup = n),
        n === null ? (this._tail = r) : (n._prevDup = r),
        this._head === null
      );
    }
  },
  Rs = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let r = e.trackById,
        n = this.map.get(r);
      n || ((n = new Pl()), this.map.set(r, n)), n.add(e);
    }
    get(e, r) {
      let n = e,
        i = this.map.get(n);
      return i ? i.get(e, r) : null;
    }
    remove(e) {
      let r = e.trackById;
      return this.map.get(r).remove(e) && this.map.delete(r), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function wh(t, e, r) {
  let n = t.previousIndex;
  if (n === null) return n;
  let i = 0;
  return r && n < r.length && (i = r[n]), n + e + i;
}
function Dh() {
  return new Iu([new Nl()]);
}
var Iu = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n;
    }
    static create(n, i) {
      if (i != null) {
        let o = i.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (i) => e.create(n, i || Dh()),
        deps: [[e, new kl(), new ks()]],
      };
    }
    find(n) {
      let i = this.factories.find((o) => o.supports(n));
      if (i != null) return i;
      throw new A(901, !1);
    }
  };
  e.ɵprov = b({ token: e, providedIn: "root", factory: Dh });
  let t = e;
  return t;
})();
var $g = bu(null, "core", []),
  Hg = (() => {
    let e = class e {
      constructor(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(En));
    }),
      (e.ɵmod = Pe({ type: e })),
      (e.ɵinj = Oe({}));
    let t = e;
    return t;
  })();
var zg = new x("");
function bn(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
function Ni(t, e) {
  jr("NgSignals");
  let r = rf(t);
  return e?.equal && (r[$t].equal = e.equal), r;
}
function Jt(t) {
  let e = J(null);
  try {
    return t();
  } finally {
    J(e);
  }
}
function Gg(t) {
  let e = vn(t);
  if (!e) return null;
  let r = new kr(e);
  return {
    get selector() {
      return r.selector;
    },
    get type() {
      return r.componentType;
    },
    get inputs() {
      return r.inputs;
    },
    get outputs() {
      return r.outputs;
    },
    get ngContentSelectors() {
      return r.ngContentSelectors;
    },
    get isStandalone() {
      return e.standalone;
    },
    get isSignal() {
      return e.signals;
    },
  };
}
var Jg = null;
function Lt() {
  return Jg;
}
function Xg(t) {
  Jg ??= t;
}
var Da = class {};
var Ne = new x(""),
  ku = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => C(ME), providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  em = new x(""),
  ME = (() => {
    let e = class e extends ku {
      constructor() {
        super(),
          (this._doc = C(Ne)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return Lt().getBaseHref(this._doc);
      }
      onPopState(n) {
        let i = Lt().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("popstate", n, !1),
          () => i.removeEventListener("popstate", n)
        );
      }
      onHashChange(n) {
        let i = Lt().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("hashchange", n, !1),
          () => i.removeEventListener("hashchange", n)
        );
      }
      get href() {
        return this._location.href;
      }
      get protocol() {
        return this._location.protocol;
      }
      get hostname() {
        return this._location.hostname;
      }
      get port() {
        return this._location.port;
      }
      get pathname() {
        return this._location.pathname;
      }
      get search() {
        return this._location.search;
      }
      get hash() {
        return this._location.hash;
      }
      set pathname(n) {
        this._location.pathname = n;
      }
      pushState(n, i, o) {
        this._history.pushState(n, i, o);
      }
      replaceState(n, i, o) {
        this._history.replaceState(n, i, o);
      }
      forward() {
        this._history.forward();
      }
      back() {
        this._history.back();
      }
      historyGo(n = 0) {
        this._history.go(n);
      }
      getState() {
        return this._history.state;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })();
function Lu(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let r = 0;
  return (
    t.endsWith("/") && r++,
    e.startsWith("/") && r++,
    r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + "/" + e
  );
}
function Wg(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === "/" ? 1 : 0);
  return t.slice(0, n) + t.slice(r);
}
function en(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var nn = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => C(Vu), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  tm = new x(""),
  Vu = (() => {
    let e = class e extends nn {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            C(Ne).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return Lu(this._baseHref, n);
      }
      path(n = !1) {
        let i =
            this._platformLocation.pathname + en(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${i}${o}` : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + en(s));
        this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + en(s));
        this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(ku), T(tm, 8));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  nm = (() => {
    let e = class e extends nn {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._baseHref = ""),
          (this._removeListenerFns = []),
          i != null && (this._baseHref = i);
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      path(n = !1) {
        let i = this._platformLocation.hash ?? "#";
        return i.length > 0 ? i.substring(1) : i;
      }
      prepareExternalUrl(n) {
        let i = Lu(this._baseHref, n);
        return i.length > 0 ? "#" + i : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + en(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + en(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(ku), T(tm, 8));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Hr = (() => {
    let e = class e {
      constructor(n) {
        (this._subject = new De()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = n);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = TE(Wg(qg(i)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: o.state,
              type: o.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(n = !1) {
        return this.normalize(this._locationStrategy.path(n));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(n, i = "") {
        return this.path() == this.normalize(n + en(i));
      }
      normalize(n) {
        return e.stripTrailingSlash(SE(this._basePath, qg(n)));
      }
      prepareExternalUrl(n) {
        return (
          n && n[0] !== "/" && (n = "/" + n),
          this._locationStrategy.prepareExternalUrl(n)
        );
      }
      go(n, i = "", o = null) {
        this._locationStrategy.pushState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + en(i)), o);
      }
      replaceState(n, i = "", o = null) {
        this._locationStrategy.replaceState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + en(i)), o);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(n = 0) {
        this._locationStrategy.historyGo?.(n);
      }
      onUrlChange(n) {
        return (
          this._urlChangeListeners.push(n),
          (this._urlChangeSubscription ??= this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
          () => {
            let i = this._urlChangeListeners.indexOf(n);
            this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(n = "", i) {
        this._urlChangeListeners.forEach((o) => o(n, i));
      }
      subscribe(n, i, o) {
        return this._subject.subscribe({ next: n, error: i, complete: o });
      }
    };
    (e.normalizeQueryParams = en),
      (e.joinWithSlash = Lu),
      (e.stripTrailingSlash = Wg),
      (e.ɵfac = function (i) {
        return new (i || e)(T(nn));
      }),
      (e.ɵprov = b({ token: e, factory: () => xE(), providedIn: "root" }));
    let t = e;
    return t;
  })();
function xE() {
  return new Hr(T(nn));
}
function SE(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let r = e.substring(t.length);
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : e;
}
function qg(t) {
  return t.replace(/\/index.html$/, "");
}
function TE(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/);
    return r;
  }
  return t;
}
var He = (function (t) {
    return (
      (t[(t.Format = 0)] = "Format"), (t[(t.Standalone = 1)] = "Standalone"), t
    );
  })(He || {}),
  ae = (function (t) {
    return (
      (t[(t.Narrow = 0)] = "Narrow"),
      (t[(t.Abbreviated = 1)] = "Abbreviated"),
      (t[(t.Wide = 2)] = "Wide"),
      (t[(t.Short = 3)] = "Short"),
      t
    );
  })(ae || {}),
  rt = (function (t) {
    return (
      (t[(t.Short = 0)] = "Short"),
      (t[(t.Medium = 1)] = "Medium"),
      (t[(t.Long = 2)] = "Long"),
      (t[(t.Full = 3)] = "Full"),
      t
    );
  })(rt || {}),
  In = {
    Decimal: 0,
    Group: 1,
    List: 2,
    PercentSign: 3,
    PlusSign: 4,
    MinusSign: 5,
    Exponential: 6,
    SuperscriptingExponent: 7,
    PerMille: 8,
    Infinity: 9,
    NaN: 10,
    TimeSeparator: 11,
    CurrencyDecimal: 12,
    CurrencyGroup: 13,
  };
function AE(t) {
  return ht(t)[ve.LocaleId];
}
function NE(t, e, r) {
  let n = ht(t),
    i = [n[ve.DayPeriodsFormat], n[ve.DayPeriodsStandalone]],
    o = pt(i, e);
  return pt(o, r);
}
function RE(t, e, r) {
  let n = ht(t),
    i = [n[ve.DaysFormat], n[ve.DaysStandalone]],
    o = pt(i, e);
  return pt(o, r);
}
function OE(t, e, r) {
  let n = ht(t),
    i = [n[ve.MonthsFormat], n[ve.MonthsStandalone]],
    o = pt(i, e);
  return pt(o, r);
}
function PE(t, e) {
  let n = ht(t)[ve.Eras];
  return pt(n, e);
}
function ha(t, e) {
  let r = ht(t);
  return pt(r[ve.DateFormat], e);
}
function pa(t, e) {
  let r = ht(t);
  return pt(r[ve.TimeFormat], e);
}
function ga(t, e) {
  let n = ht(t)[ve.DateTimeFormat];
  return pt(n, e);
}
function Ea(t, e) {
  let r = ht(t),
    n = r[ve.NumberSymbols][e];
  if (typeof n > "u") {
    if (e === In.CurrencyDecimal) return r[ve.NumberSymbols][In.Decimal];
    if (e === In.CurrencyGroup) return r[ve.NumberSymbols][In.Group];
  }
  return n;
}
function rm(t) {
  if (!t[ve.ExtraData])
    throw new Error(
      `Missing extra locale data for the locale "${
        t[ve.LocaleId]
      }". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`
    );
}
function FE(t) {
  let e = ht(t);
  return (
    rm(e),
    (e[ve.ExtraData][2] || []).map((n) =>
      typeof n == "string" ? xu(n) : [xu(n[0]), xu(n[1])]
    )
  );
}
function kE(t, e, r) {
  let n = ht(t);
  rm(n);
  let i = [n[ve.ExtraData][0], n[ve.ExtraData][1]],
    o = pt(i, e) || [];
  return pt(o, r) || [];
}
function pt(t, e) {
  for (let r = e; r > -1; r--) if (typeof t[r] < "u") return t[r];
  throw new Error("Locale data API: locale data undefined");
}
function xu(t) {
  let [e, r] = t.split(":");
  return { hours: +e, minutes: +r };
}
var LE =
    /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
  ma = {},
  VE =
    /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/,
  tn = (function (t) {
    return (
      (t[(t.Short = 0)] = "Short"),
      (t[(t.ShortGMT = 1)] = "ShortGMT"),
      (t[(t.Long = 2)] = "Long"),
      (t[(t.Extended = 3)] = "Extended"),
      t
    );
  })(tn || {}),
  te = (function (t) {
    return (
      (t[(t.FullYear = 0)] = "FullYear"),
      (t[(t.Month = 1)] = "Month"),
      (t[(t.Date = 2)] = "Date"),
      (t[(t.Hours = 3)] = "Hours"),
      (t[(t.Minutes = 4)] = "Minutes"),
      (t[(t.Seconds = 5)] = "Seconds"),
      (t[(t.FractionalSeconds = 6)] = "FractionalSeconds"),
      (t[(t.Day = 7)] = "Day"),
      t
    );
  })(te || {}),
  ee = (function (t) {
    return (
      (t[(t.DayPeriods = 0)] = "DayPeriods"),
      (t[(t.Days = 1)] = "Days"),
      (t[(t.Months = 2)] = "Months"),
      (t[(t.Eras = 3)] = "Eras"),
      t
    );
  })(ee || {});
function jE(t, e, r, n) {
  let i = ZE(t);
  e = Xt(r, e) || e;
  let s = [],
    a;
  for (; e; )
    if (((a = VE.exec(e)), a)) {
      s = s.concat(a.slice(1));
      let u = s.pop();
      if (!u) break;
      e = u;
    } else {
      s.push(e);
      break;
    }
  let c = i.getTimezoneOffset();
  n && ((c = om(n, c)), (i = qE(i, n, !0)));
  let l = "";
  return (
    s.forEach((u) => {
      let h = GE(u);
      l += h
        ? h(i, r, c)
        : u === "''"
        ? "'"
        : u.replace(/(^'|'$)/g, "").replace(/''/g, "'");
    }),
    l
  );
}
function _a(t, e, r) {
  let n = new Date(0);
  return n.setFullYear(t, e, r), n.setHours(0, 0, 0), n;
}
function Xt(t, e) {
  let r = AE(t);
  if (((ma[r] ??= {}), ma[r][e])) return ma[r][e];
  let n = "";
  switch (e) {
    case "shortDate":
      n = ha(t, rt.Short);
      break;
    case "mediumDate":
      n = ha(t, rt.Medium);
      break;
    case "longDate":
      n = ha(t, rt.Long);
      break;
    case "fullDate":
      n = ha(t, rt.Full);
      break;
    case "shortTime":
      n = pa(t, rt.Short);
      break;
    case "mediumTime":
      n = pa(t, rt.Medium);
      break;
    case "longTime":
      n = pa(t, rt.Long);
      break;
    case "fullTime":
      n = pa(t, rt.Full);
      break;
    case "short":
      let i = Xt(t, "shortTime"),
        o = Xt(t, "shortDate");
      n = va(ga(t, rt.Short), [i, o]);
      break;
    case "medium":
      let s = Xt(t, "mediumTime"),
        a = Xt(t, "mediumDate");
      n = va(ga(t, rt.Medium), [s, a]);
      break;
    case "long":
      let c = Xt(t, "longTime"),
        l = Xt(t, "longDate");
      n = va(ga(t, rt.Long), [c, l]);
      break;
    case "full":
      let u = Xt(t, "fullTime"),
        h = Xt(t, "fullDate");
      n = va(ga(t, rt.Full), [u, h]);
      break;
  }
  return n && (ma[r][e] = n), n;
}
function va(t, e) {
  return (
    e &&
      (t = t.replace(/\{([^}]+)}/g, function (r, n) {
        return e != null && n in e ? e[n] : r;
      })),
    t
  );
}
function bt(t, e, r = "-", n, i) {
  let o = "";
  (t < 0 || (i && t <= 0)) && (i ? (t = -t + 1) : ((t = -t), (o = r)));
  let s = String(t);
  for (; s.length < e; ) s = "0" + s;
  return n && (s = s.slice(s.length - e)), o + s;
}
function UE(t, e) {
  return bt(t, 3).substring(0, e);
}
function _e(t, e, r = 0, n = !1, i = !1) {
  return function (o, s) {
    let a = BE(t, o);
    if (((r > 0 || a > -r) && (a += r), t === te.Hours))
      a === 0 && r === -12 && (a = 12);
    else if (t === te.FractionalSeconds) return UE(a, e);
    let c = Ea(s, In.MinusSign);
    return bt(a, e, c, n, i);
  };
}
function BE(t, e) {
  switch (t) {
    case te.FullYear:
      return e.getFullYear();
    case te.Month:
      return e.getMonth();
    case te.Date:
      return e.getDate();
    case te.Hours:
      return e.getHours();
    case te.Minutes:
      return e.getMinutes();
    case te.Seconds:
      return e.getSeconds();
    case te.FractionalSeconds:
      return e.getMilliseconds();
    case te.Day:
      return e.getDay();
    default:
      throw new Error(`Unknown DateType value "${t}".`);
  }
}
function le(t, e, r = He.Format, n = !1) {
  return function (i, o) {
    return $E(i, o, t, e, r, n);
  };
}
function $E(t, e, r, n, i, o) {
  switch (r) {
    case ee.Months:
      return OE(e, i, n)[t.getMonth()];
    case ee.Days:
      return RE(e, i, n)[t.getDay()];
    case ee.DayPeriods:
      let s = t.getHours(),
        a = t.getMinutes();
      if (o) {
        let l = FE(e),
          u = kE(e, i, n),
          h = l.findIndex((m) => {
            if (Array.isArray(m)) {
              let [g, w] = m,
                O = s >= g.hours && a >= g.minutes,
                N = s < w.hours || (s === w.hours && a < w.minutes);
              if (g.hours < w.hours) {
                if (O && N) return !0;
              } else if (O || N) return !0;
            } else if (m.hours === s && m.minutes === a) return !0;
            return !1;
          });
        if (h !== -1) return u[h];
      }
      return NE(e, i, n)[s < 12 ? 0 : 1];
    case ee.Eras:
      return PE(e, n)[t.getFullYear() <= 0 ? 0 : 1];
    default:
      let c = r;
      throw new Error(`unexpected translation type ${c}`);
  }
}
function ya(t) {
  return function (e, r, n) {
    let i = -1 * n,
      o = Ea(r, In.MinusSign),
      s = i > 0 ? Math.floor(i / 60) : Math.ceil(i / 60);
    switch (t) {
      case tn.Short:
        return (i >= 0 ? "+" : "") + bt(s, 2, o) + bt(Math.abs(i % 60), 2, o);
      case tn.ShortGMT:
        return "GMT" + (i >= 0 ? "+" : "") + bt(s, 1, o);
      case tn.Long:
        return (
          "GMT" +
          (i >= 0 ? "+" : "") +
          bt(s, 2, o) +
          ":" +
          bt(Math.abs(i % 60), 2, o)
        );
      case tn.Extended:
        return n === 0
          ? "Z"
          : (i >= 0 ? "+" : "") +
              bt(s, 2, o) +
              ":" +
              bt(Math.abs(i % 60), 2, o);
      default:
        throw new Error(`Unknown zone width "${t}"`);
    }
  };
}
var HE = 0,
  wa = 4;
function zE(t) {
  let e = _a(t, HE, 1).getDay();
  return _a(t, 0, 1 + (e <= wa ? wa : wa + 7) - e);
}
function im(t) {
  let e = t.getDay(),
    r = e === 0 ? -3 : wa - e;
  return _a(t.getFullYear(), t.getMonth(), t.getDate() + r);
}
function Su(t, e = !1) {
  return function (r, n) {
    let i;
    if (e) {
      let o = new Date(r.getFullYear(), r.getMonth(), 1).getDay() - 1,
        s = r.getDate();
      i = 1 + Math.floor((s + o) / 7);
    } else {
      let o = im(r),
        s = zE(o.getFullYear()),
        a = o.getTime() - s.getTime();
      i = 1 + Math.round(a / 6048e5);
    }
    return bt(i, t, Ea(n, In.MinusSign));
  };
}
function Ca(t, e = !1) {
  return function (r, n) {
    let o = im(r).getFullYear();
    return bt(o, t, Ea(n, In.MinusSign), e);
  };
}
var Tu = {};
function GE(t) {
  if (Tu[t]) return Tu[t];
  let e;
  switch (t) {
    case "G":
    case "GG":
    case "GGG":
      e = le(ee.Eras, ae.Abbreviated);
      break;
    case "GGGG":
      e = le(ee.Eras, ae.Wide);
      break;
    case "GGGGG":
      e = le(ee.Eras, ae.Narrow);
      break;
    case "y":
      e = _e(te.FullYear, 1, 0, !1, !0);
      break;
    case "yy":
      e = _e(te.FullYear, 2, 0, !0, !0);
      break;
    case "yyy":
      e = _e(te.FullYear, 3, 0, !1, !0);
      break;
    case "yyyy":
      e = _e(te.FullYear, 4, 0, !1, !0);
      break;
    case "Y":
      e = Ca(1);
      break;
    case "YY":
      e = Ca(2, !0);
      break;
    case "YYY":
      e = Ca(3);
      break;
    case "YYYY":
      e = Ca(4);
      break;
    case "M":
    case "L":
      e = _e(te.Month, 1, 1);
      break;
    case "MM":
    case "LL":
      e = _e(te.Month, 2, 1);
      break;
    case "MMM":
      e = le(ee.Months, ae.Abbreviated);
      break;
    case "MMMM":
      e = le(ee.Months, ae.Wide);
      break;
    case "MMMMM":
      e = le(ee.Months, ae.Narrow);
      break;
    case "LLL":
      e = le(ee.Months, ae.Abbreviated, He.Standalone);
      break;
    case "LLLL":
      e = le(ee.Months, ae.Wide, He.Standalone);
      break;
    case "LLLLL":
      e = le(ee.Months, ae.Narrow, He.Standalone);
      break;
    case "w":
      e = Su(1);
      break;
    case "ww":
      e = Su(2);
      break;
    case "W":
      e = Su(1, !0);
      break;
    case "d":
      e = _e(te.Date, 1);
      break;
    case "dd":
      e = _e(te.Date, 2);
      break;
    case "c":
    case "cc":
      e = _e(te.Day, 1);
      break;
    case "ccc":
      e = le(ee.Days, ae.Abbreviated, He.Standalone);
      break;
    case "cccc":
      e = le(ee.Days, ae.Wide, He.Standalone);
      break;
    case "ccccc":
      e = le(ee.Days, ae.Narrow, He.Standalone);
      break;
    case "cccccc":
      e = le(ee.Days, ae.Short, He.Standalone);
      break;
    case "E":
    case "EE":
    case "EEE":
      e = le(ee.Days, ae.Abbreviated);
      break;
    case "EEEE":
      e = le(ee.Days, ae.Wide);
      break;
    case "EEEEE":
      e = le(ee.Days, ae.Narrow);
      break;
    case "EEEEEE":
      e = le(ee.Days, ae.Short);
      break;
    case "a":
    case "aa":
    case "aaa":
      e = le(ee.DayPeriods, ae.Abbreviated);
      break;
    case "aaaa":
      e = le(ee.DayPeriods, ae.Wide);
      break;
    case "aaaaa":
      e = le(ee.DayPeriods, ae.Narrow);
      break;
    case "b":
    case "bb":
    case "bbb":
      e = le(ee.DayPeriods, ae.Abbreviated, He.Standalone, !0);
      break;
    case "bbbb":
      e = le(ee.DayPeriods, ae.Wide, He.Standalone, !0);
      break;
    case "bbbbb":
      e = le(ee.DayPeriods, ae.Narrow, He.Standalone, !0);
      break;
    case "B":
    case "BB":
    case "BBB":
      e = le(ee.DayPeriods, ae.Abbreviated, He.Format, !0);
      break;
    case "BBBB":
      e = le(ee.DayPeriods, ae.Wide, He.Format, !0);
      break;
    case "BBBBB":
      e = le(ee.DayPeriods, ae.Narrow, He.Format, !0);
      break;
    case "h":
      e = _e(te.Hours, 1, -12);
      break;
    case "hh":
      e = _e(te.Hours, 2, -12);
      break;
    case "H":
      e = _e(te.Hours, 1);
      break;
    case "HH":
      e = _e(te.Hours, 2);
      break;
    case "m":
      e = _e(te.Minutes, 1);
      break;
    case "mm":
      e = _e(te.Minutes, 2);
      break;
    case "s":
      e = _e(te.Seconds, 1);
      break;
    case "ss":
      e = _e(te.Seconds, 2);
      break;
    case "S":
      e = _e(te.FractionalSeconds, 1);
      break;
    case "SS":
      e = _e(te.FractionalSeconds, 2);
      break;
    case "SSS":
      e = _e(te.FractionalSeconds, 3);
      break;
    case "Z":
    case "ZZ":
    case "ZZZ":
      e = ya(tn.Short);
      break;
    case "ZZZZZ":
      e = ya(tn.Extended);
      break;
    case "O":
    case "OO":
    case "OOO":
    case "z":
    case "zz":
    case "zzz":
      e = ya(tn.ShortGMT);
      break;
    case "OOOO":
    case "ZZZZ":
    case "zzzz":
      e = ya(tn.Long);
      break;
    default:
      return null;
  }
  return (Tu[t] = e), e;
}
function om(t, e) {
  t = t.replace(/:/g, "");
  let r = Date.parse("Jan 01, 1970 00:00:00 " + t) / 6e4;
  return isNaN(r) ? e : r;
}
function WE(t, e) {
  return (t = new Date(t.getTime())), t.setMinutes(t.getMinutes() + e), t;
}
function qE(t, e, r) {
  let n = r ? -1 : 1,
    i = t.getTimezoneOffset(),
    o = om(e, i);
  return WE(t, n * (o - i));
}
function ZE(t) {
  if (Zg(t)) return t;
  if (typeof t == "number" && !isNaN(t)) return new Date(t);
  if (typeof t == "string") {
    if (((t = t.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(t))) {
      let [i, o = 1, s = 1] = t.split("-").map((a) => +a);
      return _a(i, o - 1, s);
    }
    let r = parseFloat(t);
    if (!isNaN(t - r)) return new Date(r);
    let n;
    if ((n = t.match(LE))) return YE(n);
  }
  let e = new Date(t);
  if (!Zg(e)) throw new Error(`Unable to convert "${t}" into a date`);
  return e;
}
function YE(t) {
  let e = new Date(0),
    r = 0,
    n = 0,
    i = t[8] ? e.setUTCFullYear : e.setFullYear,
    o = t[8] ? e.setUTCHours : e.setHours;
  t[9] && ((r = Number(t[9] + t[10])), (n = Number(t[9] + t[11]))),
    i.call(e, Number(t[1]), Number(t[2]) - 1, Number(t[3]));
  let s = Number(t[4] || 0) - r,
    a = Number(t[5] || 0) - n,
    c = Number(t[6] || 0),
    l = Math.floor(parseFloat("0." + (t[7] || 0)) * 1e3);
  return o.call(e, s, a, c, l), e;
}
function Zg(t) {
  return t instanceof Date && !isNaN(t.valueOf());
}
function ba(t, e) {
  e = encodeURIComponent(e);
  for (let r of t.split(";")) {
    let n = r.indexOf("="),
      [i, o] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var Au = /\s+/,
  Yg = [],
  Ia = (() => {
    let e = class e {
      constructor(n, i) {
        (this._ngEl = n),
          (this._renderer = i),
          (this.initialClasses = Yg),
          (this.stateMap = new Map());
      }
      set klass(n) {
        this.initialClasses = n != null ? n.trim().split(Au) : Yg;
      }
      set ngClass(n) {
        this.rawClass = typeof n == "string" ? n.trim().split(Au) : n;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let n = this.rawClass;
        if (Array.isArray(n) || n instanceof Set)
          for (let i of n) this._updateState(i, !0);
        else if (n != null)
          for (let i of Object.keys(n)) this._updateState(i, !!n[i]);
        this._applyStateDiff();
      }
      _updateState(n, i) {
        let o = this.stateMap.get(n);
        o !== void 0
          ? (o.enabled !== i && ((o.changed = !0), (o.enabled = i)),
            (o.touched = !0))
          : this.stateMap.set(n, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let n of this.stateMap) {
          let i = n[0],
            o = n[1];
          o.changed
            ? (this._toggleClass(i, o.enabled), (o.changed = !1))
            : o.touched ||
              (o.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (o.touched = !1);
        }
      }
      _toggleClass(n, i) {
        (n = n.trim()),
          n.length > 0 &&
            n.split(Au).forEach((o) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(_t), E(Ft));
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [0, "class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var Nu = class {
    constructor(e, r, n, i) {
      (this.$implicit = e),
        (this.ngForOf = r),
        (this.index = n),
        (this.count = i);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  Mn = (() => {
    let e = class e {
      set ngForOf(n) {
        (this._ngForOf = n), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(n) {
        this._trackByFn = n;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(n, i, o) {
        (this._viewContainer = n),
          (this._template = i),
          (this._differs = o),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(n) {
        n && (this._template = n);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let n = this._ngForOf;
          if (!this._differ && n)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(n).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let n = this._differ.diff(this._ngForOf);
          n && this._applyChanges(n);
        }
      }
      _applyChanges(n) {
        let i = this._viewContainer;
        n.forEachOperation((o, s, a) => {
          if (o.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new Nu(o.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            );
          else if (a == null) i.remove(s === null ? void 0 : s);
          else if (s !== null) {
            let c = i.get(s);
            i.move(c, a), Qg(c, o);
          }
        });
        for (let o = 0, s = i.length; o < s; o++) {
          let c = i.get(o).context;
          (c.index = o), (c.count = s), (c.ngForOf = this._ngForOf);
        }
        n.forEachIdentityChange((o) => {
          let s = i.get(o.currentIndex);
          Qg(s, o);
        });
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Ur), E(na), E(Iu));
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function Qg(t, e) {
  t.context.$implicit = e.item;
}
var ke = (() => {
    let e = class e {
      constructor(n, i) {
        (this._viewContainer = n),
          (this._context = new Ru()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = i);
      }
      set ngIf(n) {
        (this._context.$implicit = this._context.ngIf = n), this._updateView();
      }
      set ngIfThen(n) {
        Kg("ngIfThen", n),
          (this._thenTemplateRef = n),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(n) {
        Kg("ngIfElse", n),
          (this._elseTemplateRef = n),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context
              )));
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Ur), E(na));
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [["", "ngIf", ""]],
        inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  Ru = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function Kg(t, e) {
  if (!!!(!e || e.createEmbeddedView))
    throw new Error(`${t} must be a TemplateRef, but received '${Ue(e)}'.`);
}
function sm(t, e) {
  return new A(2100, !1);
}
var QE =
    /(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])\S*/g,
  am = (() => {
    let e = class e {
      transform(n) {
        if (n == null) return null;
        if (typeof n != "string") throw sm(e, n);
        return n.replace(
          QE,
          (i) => i[0].toUpperCase() + i.slice(1).toLowerCase()
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵpipe = jl({ name: "titlecase", type: e, pure: !0, standalone: !0 }));
    let t = e;
    return t;
  })();
var KE = "mediumDate",
  JE = new x(""),
  XE = new x(""),
  cm = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this.locale = n),
          (this.defaultTimezone = i),
          (this.defaultOptions = o);
      }
      transform(n, i, o, s) {
        if (n == null || n === "" || n !== n) return null;
        try {
          let a = i ?? this.defaultOptions?.dateFormat ?? KE,
            c =
              o ??
              this.defaultOptions?.timezone ??
              this.defaultTimezone ??
              void 0;
          return jE(n, a, s || this.locale, c);
        } catch (a) {
          throw sm(e, a.message);
        }
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(fa, 16), E(JE, 24), E(XE, 24));
    }),
      (e.ɵpipe = jl({ name: "date", type: e, pure: !0, standalone: !0 }));
    let t = e;
    return t;
  })();
var lm = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Pe({ type: e })),
      (e.ɵinj = Oe({}));
    let t = e;
    return t;
  })(),
  ju = "browser",
  eb = "server";
function tb(t) {
  return t === ju;
}
function Ma(t) {
  return t === eb;
}
var um = (() => {
    let e = class e {};
    e.ɵprov = b({
      token: e,
      providedIn: "root",
      factory: () => (tb(C(Pt)) ? new Ou(C(Ne), window) : new Pu()),
    });
    let t = e;
    return t;
  })(),
  Ou = class {
    constructor(e, r) {
      (this.document = e), (this.window = r), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      let r = nb(this.document, e);
      r && (this.scrollToElement(r), r.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let r = e.getBoundingClientRect(),
        n = r.left + this.window.pageXOffset,
        i = r.top + this.window.pageYOffset,
        o = this.offset();
      this.window.scrollTo(n - o[0], i - o[1]);
    }
  };
function nb(t, e) {
  let r = t.getElementById(e) || t.getElementsByName(e)[0];
  if (r) return r;
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let n = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = n.currentNode;
    for (; i; ) {
      let o = i.shadowRoot;
      if (o) {
        let s = o.getElementById(e) || o.querySelector(`[name="${e}"]`);
        if (s) return s;
      }
      i = n.nextNode();
    }
  }
  return null;
}
var Pu = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  $r = class {};
var Oi = class {},
  Sa = class {},
  rn = class t {
    constructor(e) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        e
          ? typeof e == "string"
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  e
                    .split(
                      `
`
                    )
                    .forEach((r) => {
                      let n = r.indexOf(":");
                      if (n > 0) {
                        let i = r.slice(0, n),
                          o = i.toLowerCase(),
                          s = r.slice(n + 1).trim();
                        this.maybeSetNormalizedName(i, o),
                          this.headers.has(o)
                            ? this.headers.get(o).push(s)
                            : this.headers.set(o, [s]);
                      }
                    });
              })
            : typeof Headers < "u" && e instanceof Headers
            ? ((this.headers = new Map()),
              e.forEach((r, n) => {
                this.setHeaderEntries(n, r);
              }))
            : (this.lazyInit = () => {
                (this.headers = new Map()),
                  Object.entries(e).forEach(([r, n]) => {
                    this.setHeaderEntries(r, n);
                  });
              })
          : (this.headers = new Map());
    }
    has(e) {
      return this.init(), this.headers.has(e.toLowerCase());
    }
    get(e) {
      this.init();
      let r = this.headers.get(e.toLowerCase());
      return r && r.length > 0 ? r[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(e) {
      return this.init(), this.headers.get(e.toLowerCase()) || null;
    }
    append(e, r) {
      return this.clone({ name: e, value: r, op: "a" });
    }
    set(e, r) {
      return this.clone({ name: e, value: r, op: "s" });
    }
    delete(e, r) {
      return this.clone({ name: e, value: r, op: "d" });
    }
    maybeSetNormalizedName(e, r) {
      this.normalizedNames.has(r) || this.normalizedNames.set(r, e);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof t
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
          (this.lazyUpdate = null)));
    }
    copyFrom(e) {
      e.init(),
        Array.from(e.headers.keys()).forEach((r) => {
          this.headers.set(r, e.headers.get(r)),
            this.normalizedNames.set(r, e.normalizedNames.get(r));
        });
    }
    clone(e) {
      let r = new t();
      return (
        (r.lazyInit =
          this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
        (r.lazyUpdate = (this.lazyUpdate || []).concat([e])),
        r
      );
    }
    applyUpdate(e) {
      let r = e.name.toLowerCase();
      switch (e.op) {
        case "a":
        case "s":
          let n = e.value;
          if ((typeof n == "string" && (n = [n]), n.length === 0)) return;
          this.maybeSetNormalizedName(e.name, r);
          let i = (e.op === "a" ? this.headers.get(r) : void 0) || [];
          i.push(...n), this.headers.set(r, i);
          break;
        case "d":
          let o = e.value;
          if (!o) this.headers.delete(r), this.normalizedNames.delete(r);
          else {
            let s = this.headers.get(r);
            if (!s) return;
            (s = s.filter((a) => o.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(r), this.normalizedNames.delete(r))
                : this.headers.set(r, s);
          }
          break;
      }
    }
    setHeaderEntries(e, r) {
      let n = (Array.isArray(r) ? r : [r]).map((o) => o.toString()),
        i = e.toLowerCase();
      this.headers.set(i, n), this.maybeSetNormalizedName(e, i);
    }
    forEach(e) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((r) =>
          e(this.normalizedNames.get(r), this.headers.get(r))
        );
    }
  };
var Bu = class {
  encodeKey(e) {
    return dm(e);
  }
  encodeValue(e) {
    return dm(e);
  }
  decodeKey(e) {
    return decodeURIComponent(e);
  }
  decodeValue(e) {
    return decodeURIComponent(e);
  }
};
function rb(t, e) {
  let r = new Map();
  return (
    t.length > 0 &&
      t
        .replace(/^\?/, "")
        .split("&")
        .forEach((i) => {
          let o = i.indexOf("="),
            [s, a] =
              o == -1
                ? [e.decodeKey(i), ""]
                : [e.decodeKey(i.slice(0, o)), e.decodeValue(i.slice(o + 1))],
            c = r.get(s) || [];
          c.push(a), r.set(s, c);
        }),
    r
  );
}
var ib = /%(\d[a-f0-9])/gi,
  ob = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function dm(t) {
  return encodeURIComponent(t).replace(ib, (e, r) => ob[r] ?? e);
}
function xa(t) {
  return `${t}`;
}
var Vt = class t {
  constructor(e = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = e.encoder || new Bu()),
      e.fromString)
    ) {
      if (e.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = rb(e.fromString, this.encoder);
    } else
      e.fromObject
        ? ((this.map = new Map()),
          Object.keys(e.fromObject).forEach((r) => {
            let n = e.fromObject[r],
              i = Array.isArray(n) ? n.map(xa) : [xa(n)];
            this.map.set(r, i);
          }))
        : (this.map = null);
  }
  has(e) {
    return this.init(), this.map.has(e);
  }
  get(e) {
    this.init();
    let r = this.map.get(e);
    return r ? r[0] : null;
  }
  getAll(e) {
    return this.init(), this.map.get(e) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(e, r) {
    return this.clone({ param: e, value: r, op: "a" });
  }
  appendAll(e) {
    let r = [];
    return (
      Object.keys(e).forEach((n) => {
        let i = e[n];
        Array.isArray(i)
          ? i.forEach((o) => {
              r.push({ param: n, value: o, op: "a" });
            })
          : r.push({ param: n, value: i, op: "a" });
      }),
      this.clone(r)
    );
  }
  set(e, r) {
    return this.clone({ param: e, value: r, op: "s" });
  }
  delete(e, r) {
    return this.clone({ param: e, value: r, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((e) => {
          let r = this.encoder.encodeKey(e);
          return this.map
            .get(e)
            .map((n) => r + "=" + this.encoder.encodeValue(n))
            .join("&");
        })
        .filter((e) => e !== "")
        .join("&")
    );
  }
  clone(e) {
    let r = new t({ encoder: this.encoder });
    return (
      (r.cloneFrom = this.cloneFrom || this),
      (r.updates = (this.updates || []).concat(e)),
      r
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
        this.updates.forEach((e) => {
          switch (e.op) {
            case "a":
            case "s":
              let r = (e.op === "a" ? this.map.get(e.param) : void 0) || [];
              r.push(xa(e.value)), this.map.set(e.param, r);
              break;
            case "d":
              if (e.value !== void 0) {
                let n = this.map.get(e.param) || [],
                  i = n.indexOf(xa(e.value));
                i !== -1 && n.splice(i, 1),
                  n.length > 0
                    ? this.map.set(e.param, n)
                    : this.map.delete(e.param);
              } else {
                this.map.delete(e.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var $u = class {
  constructor() {
    this.map = new Map();
  }
  set(e, r) {
    return this.map.set(e, r), this;
  }
  get(e) {
    return (
      this.map.has(e) || this.map.set(e, e.defaultValue()), this.map.get(e)
    );
  }
  delete(e) {
    return this.map.delete(e), this;
  }
  has(e) {
    return this.map.has(e);
  }
  keys() {
    return this.map.keys();
  }
};
function sb(t) {
  switch (t) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function fm(t) {
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function hm(t) {
  return typeof Blob < "u" && t instanceof Blob;
}
function pm(t) {
  return typeof FormData < "u" && t instanceof FormData;
}
function ab(t) {
  return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var Ri = class t {
    constructor(e, r, n, i) {
      (this.url = r),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = e.toUpperCase());
      let o;
      if (
        (sb(this.method) || i
          ? ((this.body = n !== void 0 ? n : null), (o = i))
          : (o = n),
        o &&
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          (this.transferCache = o.transferCache)),
        (this.headers ??= new rn()),
        (this.context ??= new $u()),
        !this.params)
      )
        (this.params = new Vt()), (this.urlWithParams = r);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = r;
        else {
          let a = r.indexOf("?"),
            c = a === -1 ? "?" : a < r.length - 1 ? "&" : "";
          this.urlWithParams = r + c + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == "string" ||
          fm(this.body) ||
          hm(this.body) ||
          pm(this.body) ||
          ab(this.body)
        ? this.body
        : this.body instanceof Vt
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || pm(this.body)
        ? null
        : hm(this.body)
        ? this.body.type || null
        : fm(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof Vt
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(e = {}) {
      let r = e.method || this.method,
        n = e.url || this.url,
        i = e.responseType || this.responseType,
        o = e.transferCache ?? this.transferCache,
        s = e.body !== void 0 ? e.body : this.body,
        a = e.withCredentials ?? this.withCredentials,
        c = e.reportProgress ?? this.reportProgress,
        l = e.headers || this.headers,
        u = e.params || this.params,
        h = e.context ?? this.context;
      return (
        e.setHeaders !== void 0 &&
          (l = Object.keys(e.setHeaders).reduce(
            (m, g) => m.set(g, e.setHeaders[g]),
            l
          )),
        e.setParams &&
          (u = Object.keys(e.setParams).reduce(
            (m, g) => m.set(g, e.setParams[g]),
            u
          )),
        new t(r, n, s, {
          params: u,
          headers: l,
          context: h,
          reportProgress: c,
          responseType: i,
          withCredentials: a,
          transferCache: o,
        })
      );
    }
  },
  Sn = (function (t) {
    return (
      (t[(t.Sent = 0)] = "Sent"),
      (t[(t.UploadProgress = 1)] = "UploadProgress"),
      (t[(t.ResponseHeader = 2)] = "ResponseHeader"),
      (t[(t.DownloadProgress = 3)] = "DownloadProgress"),
      (t[(t.Response = 4)] = "Response"),
      (t[(t.User = 5)] = "User"),
      t
    );
  })(Sn || {}),
  Pi = class {
    constructor(e, r = 200, n = "OK") {
      (this.headers = e.headers || new rn()),
        (this.status = e.status !== void 0 ? e.status : r),
        (this.statusText = e.statusText || n),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  Ta = class t extends Pi {
    constructor(e = {}) {
      super(e), (this.type = Sn.ResponseHeader);
    }
    clone(e = {}) {
      return new t({
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  Fi = class t extends Pi {
    constructor(e = {}) {
      super(e),
        (this.type = Sn.Response),
        (this.body = e.body !== void 0 ? e.body : null);
    }
    clone(e = {}) {
      return new t({
        body: e.body !== void 0 ? e.body : this.body,
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  xn = class extends Pi {
    constructor(e) {
      super(e, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              e.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              e.url || "(unknown url)"
            }: ${e.status} ${e.statusText}`),
        (this.error = e.error || null);
    }
  },
  Cm = 200,
  cb = 204;
function Uu(t, e) {
  return {
    body: e,
    headers: t.headers,
    context: t.context,
    observe: t.observe,
    params: t.params,
    reportProgress: t.reportProgress,
    responseType: t.responseType,
    withCredentials: t.withCredentials,
    transferCache: t.transferCache,
  };
}
var ki = (() => {
    let e = class e {
      constructor(n) {
        this.handler = n;
      }
      request(n, i, o = {}) {
        let s;
        if (n instanceof Ri) s = n;
        else {
          let l;
          o.headers instanceof rn ? (l = o.headers) : (l = new rn(o.headers));
          let u;
          o.params &&
            (o.params instanceof Vt
              ? (u = o.params)
              : (u = new Vt({ fromObject: o.params }))),
            (s = new Ri(n, i, o.body !== void 0 ? o.body : null, {
              headers: l,
              context: o.context,
              params: u,
              reportProgress: o.reportProgress,
              responseType: o.responseType || "json",
              withCredentials: o.withCredentials,
              transferCache: o.transferCache,
            }));
        }
        let a = F(s).pipe(zt((l) => this.handler.handle(l)));
        if (n instanceof Ri || o.observe === "events") return a;
        let c = a.pipe(We((l) => l instanceof Fi));
        switch (o.observe || "body") {
          case "body":
            switch (s.responseType) {
              case "arraybuffer":
                return c.pipe(
                  V((l) => {
                    if (l.body !== null && !(l.body instanceof ArrayBuffer))
                      throw new Error("Response is not an ArrayBuffer.");
                    return l.body;
                  })
                );
              case "blob":
                return c.pipe(
                  V((l) => {
                    if (l.body !== null && !(l.body instanceof Blob))
                      throw new Error("Response is not a Blob.");
                    return l.body;
                  })
                );
              case "text":
                return c.pipe(
                  V((l) => {
                    if (l.body !== null && typeof l.body != "string")
                      throw new Error("Response is not a string.");
                    return l.body;
                  })
                );
              case "json":
              default:
                return c.pipe(V((l) => l.body));
            }
          case "response":
            return c;
          default:
            throw new Error(
              `Unreachable: unhandled observe type ${o.observe}}`
            );
        }
      }
      delete(n, i = {}) {
        return this.request("DELETE", n, i);
      }
      get(n, i = {}) {
        return this.request("GET", n, i);
      }
      head(n, i = {}) {
        return this.request("HEAD", n, i);
      }
      jsonp(n, i) {
        return this.request("JSONP", n, {
          params: new Vt().append(i, "JSONP_CALLBACK"),
          observe: "body",
          responseType: "json",
        });
      }
      options(n, i = {}) {
        return this.request("OPTIONS", n, i);
      }
      patch(n, i, o = {}) {
        return this.request("PATCH", n, Uu(o, i));
      }
      post(n, i, o = {}) {
        return this.request("POST", n, Uu(o, i));
      }
      put(n, i, o = {}) {
        return this.request("PUT", n, Uu(o, i));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(Oi));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  lb = /^\)\]\}',?\n/,
  ub = "X-Request-URL";
function gm(t) {
  if (t.url) return t.url;
  let e = ub.toLocaleLowerCase();
  return t.headers.get(e);
}
var db = (() => {
    let e = class e {
      constructor() {
        (this.fetchImpl =
          C(Hu, { optional: !0 })?.fetch ?? fetch.bind(globalThis)),
          (this.ngZone = C(re));
      }
      handle(n) {
        return new Y((i) => {
          let o = new AbortController();
          return (
            this.doRequest(n, o.signal, i).then(zu, (s) =>
              i.error(new xn({ error: s }))
            ),
            () => o.abort()
          );
        });
      }
      doRequest(n, i, o) {
        return ar(this, null, function* () {
          let s = this.createRequestInit(n),
            a;
          try {
            let w = this.ngZone.runOutsideAngular(() =>
              this.fetchImpl(n.urlWithParams, D({ signal: i }, s))
            );
            fb(w), o.next({ type: Sn.Sent }), (a = yield w);
          } catch (w) {
            o.error(
              new xn({
                error: w,
                status: w.status ?? 0,
                statusText: w.statusText,
                url: n.urlWithParams,
                headers: w.headers,
              })
            );
            return;
          }
          let c = new rn(a.headers),
            l = a.statusText,
            u = gm(a) ?? n.urlWithParams,
            h = a.status,
            m = null;
          if (
            (n.reportProgress &&
              o.next(new Ta({ headers: c, status: h, statusText: l, url: u })),
            a.body)
          ) {
            let w = a.headers.get("content-length"),
              O = [],
              N = a.body.getReader(),
              R = 0,
              ye,
              ce,
              ie = typeof Zone < "u" && Zone.current;
            yield this.ngZone.runOutsideAngular(() =>
              ar(this, null, function* () {
                for (;;) {
                  let { done: Ee, value: at } = yield N.read();
                  if (Ee) break;
                  if ((O.push(at), (R += at.length), n.reportProgress)) {
                    ce =
                      n.responseType === "text"
                        ? (ce ?? "") +
                          (ye ??= new TextDecoder()).decode(at, { stream: !0 })
                        : void 0;
                    let sr = () =>
                      o.next({
                        type: Sn.DownloadProgress,
                        total: w ? +w : void 0,
                        loaded: R,
                        partialText: ce,
                      });
                    ie ? ie.run(sr) : sr();
                  }
                }
              })
            );
            let st = this.concatChunks(O, R);
            try {
              let Ee = a.headers.get("Content-Type") ?? "";
              m = this.parseBody(n, st, Ee);
            } catch (Ee) {
              o.error(
                new xn({
                  error: Ee,
                  headers: new rn(a.headers),
                  status: a.status,
                  statusText: a.statusText,
                  url: gm(a) ?? n.urlWithParams,
                })
              );
              return;
            }
          }
          h === 0 && (h = m ? Cm : 0),
            h >= 200 && h < 300
              ? (o.next(
                  new Fi({
                    body: m,
                    headers: c,
                    status: h,
                    statusText: l,
                    url: u,
                  })
                ),
                o.complete())
              : o.error(
                  new xn({
                    error: m,
                    headers: c,
                    status: h,
                    statusText: l,
                    url: u,
                  })
                );
        });
      }
      parseBody(n, i, o) {
        switch (n.responseType) {
          case "json":
            let s = new TextDecoder().decode(i).replace(lb, "");
            return s === "" ? null : JSON.parse(s);
          case "text":
            return new TextDecoder().decode(i);
          case "blob":
            return new Blob([i], { type: o });
          case "arraybuffer":
            return i.buffer;
        }
      }
      createRequestInit(n) {
        let i = {},
          o = n.withCredentials ? "include" : void 0;
        if (
          (n.headers.forEach((s, a) => (i[s] = a.join(","))),
          n.headers.has("Accept") ||
            (i.Accept = "application/json, text/plain, */*"),
          !n.headers.has("Content-Type"))
        ) {
          let s = n.detectContentTypeHeader();
          s !== null && (i["Content-Type"] = s);
        }
        return {
          body: n.serializeBody(),
          method: n.method,
          headers: i,
          credentials: o,
        };
      }
      concatChunks(n, i) {
        let o = new Uint8Array(i),
          s = 0;
        for (let a of n) o.set(a, s), (s += a.length);
        return o;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Hu = class {};
function zu() {}
function fb(t) {
  t.then(zu, zu);
}
function wm(t, e) {
  return e(t);
}
function hb(t, e) {
  return (r, n) => e.intercept(r, { handle: (i) => t(i, n) });
}
function pb(t, e, r) {
  return (n, i) => nt(r, () => e(n, (o) => t(o, i)));
}
var gb = new x(""),
  Gu = new x(""),
  mb = new x(""),
  Dm = new x("", { providedIn: "root", factory: () => !0 });
function vb() {
  let t = null;
  return (e, r) => {
    t === null && (t = (C(gb, { optional: !0 }) ?? []).reduceRight(hb, wm));
    let n = C(Kt);
    if (C(Dm)) {
      let o = n.add();
      return t(e, r).pipe(fn(() => n.remove(o)));
    } else return t(e, r);
  };
}
var mm = (() => {
  let e = class e extends Oi {
    constructor(n, i) {
      super(),
        (this.backend = n),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = C(Kt)),
        (this.contributeToStability = C(Dm));
    }
    handle(n) {
      if (this.chain === null) {
        let i = Array.from(
          new Set([...this.injector.get(Gu), ...this.injector.get(mb, [])])
        );
        this.chain = i.reduceRight((o, s) => pb(o, s, this.injector), wm);
      }
      if (this.contributeToStability) {
        let i = this.pendingTasks.add();
        return this.chain(n, (o) => this.backend.handle(o)).pipe(
          fn(() => this.pendingTasks.remove(i))
        );
      } else return this.chain(n, (i) => this.backend.handle(i));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(T(Sa), T(Be));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var yb = /^\)\]\}',?\n/;
function Cb(t) {
  return "responseURL" in t && t.responseURL
    ? t.responseURL
    : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
    ? t.getResponseHeader("X-Request-URL")
    : null;
}
var vm = (() => {
    let e = class e {
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === "JSONP") throw new A(-2800, !1);
        let i = this.xhrFactory;
        return (i.ɵloadImpl ? de(i.ɵloadImpl()) : F(null)).pipe(
          Re(
            () =>
              new Y((s) => {
                let a = i.build();
                if (
                  (a.open(n.method, n.urlWithParams),
                  n.withCredentials && (a.withCredentials = !0),
                  n.headers.forEach((N, R) =>
                    a.setRequestHeader(N, R.join(","))
                  ),
                  n.headers.has("Accept") ||
                    a.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*"
                    ),
                  !n.headers.has("Content-Type"))
                ) {
                  let N = n.detectContentTypeHeader();
                  N !== null && a.setRequestHeader("Content-Type", N);
                }
                if (n.responseType) {
                  let N = n.responseType.toLowerCase();
                  a.responseType = N !== "json" ? N : "text";
                }
                let c = n.serializeBody(),
                  l = null,
                  u = () => {
                    if (l !== null) return l;
                    let N = a.statusText || "OK",
                      R = new rn(a.getAllResponseHeaders()),
                      ye = Cb(a) || n.url;
                    return (
                      (l = new Ta({
                        headers: R,
                        status: a.status,
                        statusText: N,
                        url: ye,
                      })),
                      l
                    );
                  },
                  h = () => {
                    let {
                        headers: N,
                        status: R,
                        statusText: ye,
                        url: ce,
                      } = u(),
                      ie = null;
                    R !== cb &&
                      (ie =
                        typeof a.response > "u" ? a.responseText : a.response),
                      R === 0 && (R = ie ? Cm : 0);
                    let st = R >= 200 && R < 300;
                    if (n.responseType === "json" && typeof ie == "string") {
                      let Ee = ie;
                      ie = ie.replace(yb, "");
                      try {
                        ie = ie !== "" ? JSON.parse(ie) : null;
                      } catch (at) {
                        (ie = Ee),
                          st && ((st = !1), (ie = { error: at, text: ie }));
                      }
                    }
                    st
                      ? (s.next(
                          new Fi({
                            body: ie,
                            headers: N,
                            status: R,
                            statusText: ye,
                            url: ce || void 0,
                          })
                        ),
                        s.complete())
                      : s.error(
                          new xn({
                            error: ie,
                            headers: N,
                            status: R,
                            statusText: ye,
                            url: ce || void 0,
                          })
                        );
                  },
                  m = (N) => {
                    let { url: R } = u(),
                      ye = new xn({
                        error: N,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: R || void 0,
                      });
                    s.error(ye);
                  },
                  g = !1,
                  w = (N) => {
                    g || (s.next(u()), (g = !0));
                    let R = { type: Sn.DownloadProgress, loaded: N.loaded };
                    N.lengthComputable && (R.total = N.total),
                      n.responseType === "text" &&
                        a.responseText &&
                        (R.partialText = a.responseText),
                      s.next(R);
                  },
                  O = (N) => {
                    let R = { type: Sn.UploadProgress, loaded: N.loaded };
                    N.lengthComputable && (R.total = N.total), s.next(R);
                  };
                return (
                  a.addEventListener("load", h),
                  a.addEventListener("error", m),
                  a.addEventListener("timeout", m),
                  a.addEventListener("abort", m),
                  n.reportProgress &&
                    (a.addEventListener("progress", w),
                    c !== null &&
                      a.upload &&
                      a.upload.addEventListener("progress", O)),
                  a.send(c),
                  s.next({ type: Sn.Sent }),
                  () => {
                    a.removeEventListener("error", m),
                      a.removeEventListener("abort", m),
                      a.removeEventListener("load", h),
                      a.removeEventListener("timeout", m),
                      n.reportProgress &&
                        (a.removeEventListener("progress", w),
                        c !== null &&
                          a.upload &&
                          a.upload.removeEventListener("progress", O)),
                      a.readyState !== a.DONE && a.abort();
                  }
                );
              })
          )
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T($r));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  _m = new x(""),
  wb = "XSRF-TOKEN",
  Db = new x("", { providedIn: "root", factory: () => wb }),
  _b = "X-XSRF-TOKEN",
  Eb = new x("", { providedIn: "root", factory: () => _b }),
  Aa = class {},
  bb = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this.doc = n),
          (this.platform = i),
          (this.cookieName = o),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let n = this.doc.cookie || "";
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = ba(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(Ne), T(Pt), T(Db));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Ib(t, e) {
  let r = t.url.toLowerCase();
  if (
    !C(_m) ||
    t.method === "GET" ||
    t.method === "HEAD" ||
    r.startsWith("http://") ||
    r.startsWith("https://")
  )
    return e(t);
  let n = C(Aa).getToken(),
    i = C(Eb);
  return (
    n != null &&
      !t.headers.has(i) &&
      (t = t.clone({ headers: t.headers.set(i, n) })),
    e(t)
  );
}
var Em = (function (t) {
  return (
    (t[(t.Interceptors = 0)] = "Interceptors"),
    (t[(t.LegacyInterceptors = 1)] = "LegacyInterceptors"),
    (t[(t.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
    (t[(t.NoXsrfProtection = 3)] = "NoXsrfProtection"),
    (t[(t.JsonpSupport = 4)] = "JsonpSupport"),
    (t[(t.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
    (t[(t.Fetch = 6)] = "Fetch"),
    t
  );
})(Em || {});
function Mb(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function xb(...t) {
  let e = [
    ki,
    vm,
    mm,
    { provide: Oi, useExisting: mm },
    { provide: Sa, useFactory: () => C(db, { optional: !0 }) ?? C(vm) },
    { provide: Gu, useValue: Ib, multi: !0 },
    { provide: _m, useValue: !0 },
    { provide: Aa, useClass: bb },
  ];
  for (let r of t) e.push(...r.ɵproviders);
  return Ls(e);
}
var ym = new x("");
function Sb() {
  return Mb(Em.LegacyInterceptors, [
    { provide: ym, useFactory: vb },
    { provide: Gu, useExisting: ym, multi: !0 },
  ]);
}
var bm = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Pe({ type: e })),
    (e.ɵinj = Oe({ providers: [xb(Sb())] }));
  let t = e;
  return t;
})();
var Zu = class extends Da {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Yu = class t extends Zu {
    static makeCurrent() {
      Xg(new t());
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r);
    }
    remove(e) {
      e.remove();
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, r) {
      return r === "window"
        ? window
        : r === "document"
        ? e
        : r === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let r = Tb();
      return r == null ? null : Ab(r);
    }
    resetBaseElement() {
      Li = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return ba(document.cookie, e);
    }
  },
  Li = null;
function Tb() {
  return (
    (Li = Li || document.querySelector("base")),
    Li ? Li.getAttribute("href") : null
  );
}
function Ab(t) {
  return new URL(t, document.baseURI).pathname;
}
var Qu = class {
    addToWindow(e) {
      (Ve.getAngularTestability = (n, i = !0) => {
        let o = e.findTestabilityInTree(n, i);
        if (o == null) throw new A(5103, !1);
        return o;
      }),
        (Ve.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (Ve.getAllAngularRootElements = () => e.getAllRootElements());
      let r = (n) => {
        let i = Ve.getAllAngularTestabilities(),
          o = i.length,
          s = function () {
            o--, o == 0 && n();
          };
        i.forEach((a) => {
          a.whenStable(s);
        });
      };
      Ve.frameworkStabilizers || (Ve.frameworkStabilizers = []),
        Ve.frameworkStabilizers.push(r);
    }
    findTestabilityInTree(e, r, n) {
      if (r == null) return null;
      let i = e.getTestability(r);
      return (
        i ??
        (n
          ? Lt().isShadowRoot(r)
            ? this.findTestabilityInTree(e, r.host, !0)
            : this.findTestabilityInTree(e, r.parentElement, !0)
          : null)
      );
    }
  },
  Nb = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Na = new x(""),
  Tm = (() => {
    let e = class e {
      constructor(n, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, i, o) {
        return this._findPluginFor(i).addEventListener(n, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(n))), !i))
          throw new A(5101, !1);
        return this._eventNameToPlugin.set(n, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(Na), T(re));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Vi = class {
    constructor(e) {
      this._doc = e;
    }
  },
  Wu = "ng-app-id",
  Am = (() => {
    let e = class e {
      constructor(n, i, o, s = {}) {
        (this.doc = n),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Ma(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((i) => i.remove()), n.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n);
      }
      onStyleRemoved(n) {
        let i = this.styleRef;
        i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${Wu}="${this.appId}"]`);
        if (n?.length) {
          let i = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(n, i) {
        let o = this.styleRef;
        if (o.has(n)) {
          let s = o.get(n);
          return (s.usage += i), s.usage;
        }
        return o.set(n, { usage: i, elements: [] }), i;
      }
      getStyleElement(n, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === n) return o.delete(i), s.removeAttribute(Wu), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Wu, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, i) {
        let o = this.getStyleElement(n, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(Ne), T(Qs), T(Xl, 8), T(Pt));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  qu = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  Ju = /%COMP%/g,
  Nm = "%COMP%",
  Rb = `_nghost-${Nm}`,
  Ob = `_ngcontent-${Nm}`,
  Pb = !0,
  Fb = new x("", { providedIn: "root", factory: () => Pb });
function kb(t) {
  return Ob.replace(Ju, t);
}
function Lb(t) {
  return Rb.replace(Ju, t);
}
function Rm(t, e) {
  return e.map((r) => r.replace(Ju, t));
}
var Mm = (() => {
    let e = class e {
      constructor(n, i, o, s, a, c, l, u = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = l),
          (this.nonce = u),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Ma(c)),
          (this.defaultRenderer = new ji(n, a, l, this.platformIsServer));
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === At.ShadowDom &&
          (i = q(D({}, i), { encapsulation: At.Emulated }));
        let o = this.getOrCreateRenderer(n, i);
        return (
          o instanceof Ra
            ? o.applyToHost(n)
            : o instanceof Ui && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            c = this.ngZone,
            l = this.eventManager,
            u = this.sharedStylesHost,
            h = this.removeStylesOnCompDestroy,
            m = this.platformIsServer;
          switch (i.encapsulation) {
            case At.Emulated:
              s = new Ra(l, u, i, this.appId, h, a, c, m);
              break;
            case At.ShadowDom:
              return new Ku(l, u, n, i, a, c, this.nonce, m);
            default:
              s = new Ui(l, u, i, h, a, c, m);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        T(Tm),
        T(Am),
        T(Qs),
        T(Fb),
        T(Ne),
        T(Pt),
        T(re),
        T(Xl)
      );
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ji = class {
    constructor(e, r, n, i) {
      (this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, r) {
      return r
        ? this.doc.createElementNS(qu[r] || r, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, r) {
      (xm(e) ? e.content : e).appendChild(r);
    }
    insertBefore(e, r, n) {
      e && (xm(e) ? e.content : e).insertBefore(r, n);
    }
    removeChild(e, r) {
      r.remove();
    }
    selectRootElement(e, r) {
      let n = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!n) throw new A(-5104, !1);
      return r || (n.textContent = ""), n;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, r, n, i) {
      if (i) {
        r = i + ":" + r;
        let o = qu[i];
        o ? e.setAttributeNS(o, r, n) : e.setAttribute(r, n);
      } else e.setAttribute(r, n);
    }
    removeAttribute(e, r, n) {
      if (n) {
        let i = qu[n];
        i ? e.removeAttributeNS(i, r) : e.removeAttribute(`${n}:${r}`);
      } else e.removeAttribute(r);
    }
    addClass(e, r) {
      e.classList.add(r);
    }
    removeClass(e, r) {
      e.classList.remove(r);
    }
    setStyle(e, r, n, i) {
      i & (qt.DashCase | qt.Important)
        ? e.style.setProperty(r, n, i & qt.Important ? "important" : "")
        : (e.style[r] = n);
    }
    removeStyle(e, r, n) {
      n & qt.DashCase ? e.style.removeProperty(r) : (e.style[r] = "");
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n);
    }
    setValue(e, r) {
      e.nodeValue = r;
    }
    listen(e, r, n) {
      if (
        typeof e == "string" &&
        ((e = Lt().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${r}`);
      return this.eventManager.addEventListener(
        e,
        r,
        this.decoratePreventDefault(n)
      );
    }
    decoratePreventDefault(e) {
      return (r) => {
        if (r === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function xm(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var Ku = class extends ji {
    constructor(e, r, n, i, o, s, a, c) {
      super(e, o, s, c),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = Rm(i.id, i.styles);
      for (let u of l) {
        let h = document.createElement("style");
        a && h.setAttribute("nonce", a),
          (h.textContent = u),
          this.shadowRoot.appendChild(h);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r);
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
    }
    removeChild(e, r) {
      return super.removeChild(null, r);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Ui = class extends ji {
    constructor(e, r, n, i, o, s, a, c) {
      super(e, o, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? Rm(c, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Ra = class extends Ui {
    constructor(e, r, n, i, o, s, a, c) {
      let l = i + "-" + n.id;
      super(e, r, n, o, s, a, c, l),
        (this.contentAttr = kb(l)),
        (this.hostAttr = Lb(l));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, r) {
      let n = super.createElement(e, r);
      return super.setAttribute(n, this.contentAttr, ""), n;
    }
  },
  Vb = (() => {
    let e = class e extends Vi {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, i, o) {
        return (
          n.addEventListener(i, o, !1), () => this.removeEventListener(n, i, o)
        );
      }
      removeEventListener(n, i, o) {
        return n.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(Ne));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  jb = (() => {
    let e = class e extends Vi {
      constructor(n) {
        super(n), (this.delegate = C(zg, { optional: !0 }));
      }
      supports(n) {
        return this.delegate ? this.delegate.supports(n) : !1;
      }
      addEventListener(n, i, o) {
        return this.delegate.addEventListener(n, i, o);
      }
      removeEventListener(n, i, o) {
        return this.delegate.removeEventListener(n, i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(Ne));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Sm = ["alt", "control", "meta", "shift"],
  Ub = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  Bb = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  $b = (() => {
    let e = class e extends Vi {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => Lt().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = e._normalizeKey(i.pop()),
          a = "",
          c = i.indexOf("code");
        if (
          (c > -1 && (i.splice(c, 1), (a = "code.")),
          Sm.forEach((u) => {
            let h = i.indexOf(u);
            h > -1 && (i.splice(h, 1), (a += u + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let l = {};
        return (l.domEventName = o), (l.fullKey = a), l;
      }
      static matchEventFullKeyCode(n, i) {
        let o = Ub[n.key] || n.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = n.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Sm.forEach((a) => {
                if (a !== o) {
                  let c = Bb[a];
                  c(n) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(n, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(Ne));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Hb() {
  Yu.makeCurrent();
}
function zb() {
  return new Wt();
}
function Gb() {
  return Lp(document), document;
}
var Wb = [
    { provide: Pt, useValue: ju },
    { provide: Jl, useValue: Hb, multi: !0 },
    { provide: Ne, useFactory: Gb, deps: [] },
  ],
  Om = bu($g, "browser", Wb),
  qb = new x(""),
  Zb = [
    { provide: Ai, useClass: Qu, deps: [] },
    { provide: _u, useClass: aa, deps: [re, ca, Ai] },
    { provide: aa, useClass: aa, deps: [re, ca, Ai] },
  ],
  Yb = [
    { provide: Vs, useValue: "root" },
    { provide: Wt, useFactory: zb, deps: [] },
    { provide: Na, useClass: Vb, multi: !0, deps: [Ne, re, Pt] },
    { provide: Na, useClass: $b, multi: !0, deps: [Ne] },
    { provide: Na, useClass: jb, multi: !0 },
    Mm,
    Am,
    Tm,
    { provide: Fr, useExisting: Mm },
    { provide: $r, useClass: Nb, deps: [] },
    [],
  ],
  Pm = (() => {
    let e = class e {
      constructor(n) {}
      static withServerTransition(n) {
        return { ngModule: e, providers: [{ provide: Qs, useValue: n.appId }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(qb, 12));
    }),
      (e.ɵmod = Pe({ type: e })),
      (e.ɵinj = Oe({ providers: [...Yb, ...Zb], imports: [lm, Hg] }));
    let t = e;
    return t;
  })();
var Fm = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(T(Ne));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var Wm = (() => {
    let e = class e {
      constructor(n, i) {
        (this._renderer = n),
          (this._elementRef = i),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {});
      }
      setProperty(n, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, i);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty("disabled", n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Ft), E(_t));
    }),
      (e.ɵdir = fe({ type: e }));
    let t = e;
    return t;
  })(),
  Ua = (() => {
    let e = class e extends Wm {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Dt(e)))(o || e);
      };
    })()),
      (e.ɵdir = fe({ type: e, features: [Ye] }));
    let t = e;
    return t;
  })(),
  Zi = new x("");
var Qb = { provide: Zi, useExisting: dt(() => Le), multi: !0 };
function Kb() {
  let t = Lt() ? Lt().getUserAgent() : "";
  return /android (\d+)/.test(t.toLowerCase());
}
var Jb = new x(""),
  Le = (() => {
    let e = class e extends Wm {
      constructor(n, i, o) {
        super(n, i),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !Kb());
      }
      writeValue(n) {
        let i = n ?? "";
        this.setProperty("value", i);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Ft), E(_t), E(Jb, 8));
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            S("input", function (a) {
              return o._handleInput(a.target.value);
            })("blur", function () {
              return o.onTouched();
            })("compositionstart", function () {
              return o._compositionStart();
            })("compositionend", function (a) {
              return o._compositionEnd(a.target.value);
            });
        },
        features: [kt([Qb]), Ye],
      }));
    let t = e;
    return t;
  })();
function Wi(t) {
  return (
    t == null || ((typeof t == "string" || Array.isArray(t)) && t.length === 0)
  );
}
var Yi = new x(""),
  qm = new x("");
function Xb(t) {
  return (e) => {
    if (Wi(e.value) || Wi(t)) return null;
    let r = parseFloat(e.value);
    return !isNaN(r) && r < t ? { min: { min: t, actual: e.value } } : null;
  };
}
function eI(t) {
  return (e) => {
    if (Wi(e.value) || Wi(t)) return null;
    let r = parseFloat(e.value);
    return !isNaN(r) && r > t ? { max: { max: t, actual: e.value } } : null;
  };
}
function tI(t) {
  return Wi(t.value) ? { required: !0 } : null;
}
function Lm(t) {
  return null;
}
function Zm(t) {
  return t != null;
}
function Ym(t) {
  return Xn(t) ? de(t) : t;
}
function Qm(t) {
  let e = {};
  return (
    t.forEach((r) => {
      e = r != null ? D(D({}, e), r) : e;
    }),
    Object.keys(e).length === 0 ? null : e
  );
}
function Km(t, e) {
  return e.map((r) => r(t));
}
function nI(t) {
  return !t.validate;
}
function Jm(t) {
  return t.map((e) => (nI(e) ? e : (r) => e.validate(r)));
}
function rI(t) {
  if (!t) return null;
  let e = t.filter(Zm);
  return e.length == 0
    ? null
    : function (r) {
        return Qm(Km(r, e));
      };
}
function ed(t) {
  return t != null ? rI(Jm(t)) : null;
}
function iI(t) {
  if (!t) return null;
  let e = t.filter(Zm);
  return e.length == 0
    ? null
    : function (r) {
        let n = Km(r, e).map(Ym);
        return Ac(n).pipe(V(Qm));
      };
}
function td(t) {
  return t != null ? iI(Jm(t)) : null;
}
function Vm(t, e) {
  return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
}
function oI(t) {
  return t._rawValidators;
}
function sI(t) {
  return t._rawAsyncValidators;
}
function Xu(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function Pa(t, e) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function jm(t, e) {
  let r = Xu(e);
  return (
    Xu(t).forEach((i) => {
      Pa(r, i) || r.push(i);
    }),
    r
  );
}
function Um(t, e) {
  return Xu(e).filter((r) => !Pa(t, r));
}
var Fa = class {
    constructor() {
      (this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(e) {
      (this._rawValidators = e || []),
        (this._composedValidatorFn = ed(this._rawValidators));
    }
    _setAsyncValidators(e) {
      (this._rawAsyncValidators = e || []),
        (this._composedAsyncValidatorFn = td(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(e) {
      this._onDestroyCallbacks.push(e);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((e) => e()),
        (this._onDestroyCallbacks = []);
    }
    reset(e = void 0) {
      this.control && this.control.reset(e);
    }
    hasError(e, r) {
      return this.control ? this.control.hasError(e, r) : !1;
    }
    getError(e, r) {
      return this.control ? this.control.getError(e, r) : null;
    }
  },
  Wr = class extends Fa {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  qi = class extends Fa {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  ka = class {
    constructor(e) {
      this._cd = e;
    }
    get isTouched() {
      return this._cd?.control?._touched?.(), !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return this._cd?.control?._pristine?.(), !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return this._cd?.control?._status?.(), !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return this._cd?._submitted?.(), !!this._cd?.submitted;
    }
  },
  aI = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  yF = q(D({}, aI), { "[class.ng-submitted]": "isSubmitted" }),
  Qe = (() => {
    let e = class e extends ka {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(qi, 2));
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (i, o) {
          i & 2 &&
            ia("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending);
        },
        features: [Ye],
      }));
    let t = e;
    return t;
  })(),
  Tn = (() => {
    let e = class e extends ka {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Wr, 10));
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [
          ["", "formGroupName", ""],
          ["", "formArrayName", ""],
          ["", "ngModelGroup", ""],
          ["", "formGroup", ""],
          ["form", 3, "ngNoForm", ""],
          ["", "ngForm", ""],
        ],
        hostVars: 16,
        hostBindings: function (i, o) {
          i & 2 &&
            ia("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending)("ng-submitted", o.isSubmitted);
        },
        features: [Ye],
      }));
    let t = e;
    return t;
  })();
var Bi = "VALID",
  Oa = "INVALID",
  zr = "PENDING",
  $i = "DISABLED",
  qr = class {},
  La = class extends qr {
    constructor(e, r) {
      super(), (this.value = e), (this.source = r);
    }
  },
  zi = class extends qr {
    constructor(e, r) {
      super(), (this.pristine = e), (this.source = r);
    }
  },
  Gi = class extends qr {
    constructor(e, r) {
      super(), (this.touched = e), (this.source = r);
    }
  },
  Gr = class extends qr {
    constructor(e, r) {
      super(), (this.status = e), (this.source = r);
    }
  };
function Xm(t) {
  return (Ba(t) ? t.validators : t) || null;
}
function cI(t) {
  return Array.isArray(t) ? ed(t) : t || null;
}
function ev(t, e) {
  return (Ba(e) ? e.asyncValidators : t) || null;
}
function lI(t) {
  return Array.isArray(t) ? td(t) : t || null;
}
function Ba(t) {
  return t != null && !Array.isArray(t) && typeof t == "object";
}
function uI(t, e, r) {
  let n = t.controls;
  if (!(e ? Object.keys(n) : n).length) throw new A(1e3, "");
  if (!n[r]) throw new A(1001, "");
}
function dI(t, e, r) {
  t._forEachChild((n, i) => {
    if (r[i] === void 0) throw new A(1002, "");
  });
}
var Va = class {
    constructor(e, r) {
      (this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = null),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this._status = Ni(() => this.statusReactive())),
        (this.statusReactive = Mi(void 0)),
        (this._pristine = Ni(() => this.pristineReactive())),
        (this.pristineReactive = Mi(!0)),
        (this._touched = Ni(() => this.touchedReactive())),
        (this.touchedReactive = Mi(!1)),
        (this._events = new xe()),
        (this.events = this._events.asObservable()),
        (this._onDisabledChange = []),
        this._assignValidators(e),
        this._assignAsyncValidators(r);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(e) {
      this._rawValidators = this._composedValidatorFn = e;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(e) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
    }
    get parent() {
      return this._parent;
    }
    get status() {
      return Jt(this.statusReactive);
    }
    set status(e) {
      Jt(() => this.statusReactive.set(e));
    }
    get valid() {
      return this.status === Bi;
    }
    get invalid() {
      return this.status === Oa;
    }
    get pending() {
      return this.status == zr;
    }
    get disabled() {
      return this.status === $i;
    }
    get enabled() {
      return this.status !== $i;
    }
    get pristine() {
      return Jt(this.pristineReactive);
    }
    set pristine(e) {
      Jt(() => this.pristineReactive.set(e));
    }
    get dirty() {
      return !this.pristine;
    }
    get touched() {
      return Jt(this.touchedReactive);
    }
    set touched(e) {
      Jt(() => this.touchedReactive.set(e));
    }
    get untouched() {
      return !this.touched;
    }
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : "change";
    }
    setValidators(e) {
      this._assignValidators(e);
    }
    setAsyncValidators(e) {
      this._assignAsyncValidators(e);
    }
    addValidators(e) {
      this.setValidators(jm(e, this._rawValidators));
    }
    addAsyncValidators(e) {
      this.setAsyncValidators(jm(e, this._rawAsyncValidators));
    }
    removeValidators(e) {
      this.setValidators(Um(e, this._rawValidators));
    }
    removeAsyncValidators(e) {
      this.setAsyncValidators(Um(e, this._rawAsyncValidators));
    }
    hasValidator(e) {
      return Pa(this._rawValidators, e);
    }
    hasAsyncValidator(e) {
      return Pa(this._rawAsyncValidators, e);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(e = {}) {
      let r = this.touched === !1;
      this.touched = !0;
      let n = e.sourceControl ?? this;
      this._parent &&
        !e.onlySelf &&
        this._parent.markAsTouched(q(D({}, e), { sourceControl: n })),
        r && e.emitEvent !== !1 && this._events.next(new Gi(!0, n));
    }
    markAllAsTouched(e = {}) {
      this.markAsTouched({
        onlySelf: !0,
        emitEvent: e.emitEvent,
        sourceControl: this,
      }),
        this._forEachChild((r) => r.markAllAsTouched(e));
    }
    markAsUntouched(e = {}) {
      let r = this.touched === !0;
      (this.touched = !1), (this._pendingTouched = !1);
      let n = e.sourceControl ?? this;
      this._forEachChild((i) => {
        i.markAsUntouched({
          onlySelf: !0,
          emitEvent: e.emitEvent,
          sourceControl: n,
        });
      }),
        this._parent && !e.onlySelf && this._parent._updateTouched(e, n),
        r && e.emitEvent !== !1 && this._events.next(new Gi(!1, n));
    }
    markAsDirty(e = {}) {
      let r = this.pristine === !0;
      this.pristine = !1;
      let n = e.sourceControl ?? this;
      this._parent &&
        !e.onlySelf &&
        this._parent.markAsDirty(q(D({}, e), { sourceControl: n })),
        r && e.emitEvent !== !1 && this._events.next(new zi(!1, n));
    }
    markAsPristine(e = {}) {
      let r = this.pristine === !1;
      (this.pristine = !0), (this._pendingDirty = !1);
      let n = e.sourceControl ?? this;
      this._forEachChild((i) => {
        i.markAsPristine({ onlySelf: !0, emitEvent: e.emitEvent });
      }),
        this._parent && !e.onlySelf && this._parent._updatePristine(e, n),
        r && e.emitEvent !== !1 && this._events.next(new zi(!0, n));
    }
    markAsPending(e = {}) {
      this.status = zr;
      let r = e.sourceControl ?? this;
      e.emitEvent !== !1 &&
        (this._events.next(new Gr(this.status, r)),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !e.onlySelf &&
          this._parent.markAsPending(q(D({}, e), { sourceControl: r }));
    }
    disable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = $i),
        (this.errors = null),
        this._forEachChild((i) => {
          i.disable(q(D({}, e), { onlySelf: !0 }));
        }),
        this._updateValue();
      let n = e.sourceControl ?? this;
      e.emitEvent !== !1 &&
        (this._events.next(new La(this.value, n)),
        this._events.next(new Gr(this.status, n)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(q(D({}, e), { skipPristineCheck: r }), this),
        this._onDisabledChange.forEach((i) => i(!0));
    }
    enable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = Bi),
        this._forEachChild((n) => {
          n.enable(q(D({}, e), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent }),
        this._updateAncestors(q(D({}, e), { skipPristineCheck: r }), this),
        this._onDisabledChange.forEach((n) => n(!1));
    }
    _updateAncestors(e, r) {
      this._parent &&
        !e.onlySelf &&
        (this._parent.updateValueAndValidity(e),
        e.skipPristineCheck || this._parent._updatePristine({}, r),
        this._parent._updateTouched({}, r));
    }
    setParent(e) {
      this._parent = e;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(e = {}) {
      if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
        let n = this._cancelExistingSubscription();
        (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === Bi || this.status === zr) &&
            this._runAsyncValidator(n, e.emitEvent);
      }
      let r = e.sourceControl ?? this;
      e.emitEvent !== !1 &&
        (this._events.next(new La(this.value, r)),
        this._events.next(new Gr(this.status, r)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !e.onlySelf &&
          this._parent.updateValueAndValidity(
            q(D({}, e), { sourceControl: r })
          );
    }
    _updateTreeValidity(e = { emitEvent: !0 }) {
      this._forEachChild((r) => r._updateTreeValidity(e)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? $i : Bi;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(e, r) {
      if (this.asyncValidator) {
        (this.status = zr),
          (this._hasOwnPendingAsyncValidator = { emitEvent: r !== !1 });
        let n = Ym(this.asyncValidator(this));
        this._asyncValidationSubscription = n.subscribe((i) => {
          (this._hasOwnPendingAsyncValidator = null),
            this.setErrors(i, { emitEvent: r, shouldHaveEmitted: e });
        });
      }
    }
    _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let e = this._hasOwnPendingAsyncValidator?.emitEvent ?? !1;
        return (this._hasOwnPendingAsyncValidator = null), e;
      }
      return !1;
    }
    setErrors(e, r = {}) {
      (this.errors = e),
        this._updateControlsErrors(
          r.emitEvent !== !1,
          this,
          r.shouldHaveEmitted
        );
    }
    get(e) {
      let r = e;
      return r == null ||
        (Array.isArray(r) || (r = r.split(".")), r.length === 0)
        ? null
        : r.reduce((n, i) => n && n._find(i), this);
    }
    getError(e, r) {
      let n = r ? this.get(r) : this;
      return n && n.errors ? n.errors[e] : null;
    }
    hasError(e, r) {
      return !!this.getError(e, r);
    }
    get root() {
      let e = this;
      for (; e._parent; ) e = e._parent;
      return e;
    }
    _updateControlsErrors(e, r, n) {
      (this.status = this._calculateStatus()),
        e && this.statusChanges.emit(this.status),
        (e || n) && this._events.next(new Gr(this.status, r)),
        this._parent && this._parent._updateControlsErrors(e, r, n);
    }
    _initObservables() {
      (this.valueChanges = new De()), (this.statusChanges = new De());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? $i
        : this.errors
        ? Oa
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(zr)
        ? zr
        : this._anyControlsHaveStatus(Oa)
        ? Oa
        : Bi;
    }
    _anyControlsHaveStatus(e) {
      return this._anyControls((r) => r.status === e);
    }
    _anyControlsDirty() {
      return this._anyControls((e) => e.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((e) => e.touched);
    }
    _updatePristine(e, r) {
      let n = !this._anyControlsDirty(),
        i = this.pristine !== n;
      (this.pristine = n),
        this._parent && !e.onlySelf && this._parent._updatePristine(e, r),
        i && this._events.next(new zi(this.pristine, r));
    }
    _updateTouched(e = {}, r) {
      (this.touched = this._anyControlsTouched()),
        this._events.next(new Gi(this.touched, r)),
        this._parent && !e.onlySelf && this._parent._updateTouched(e, r);
    }
    _registerOnCollectionChange(e) {
      this._onCollectionChange = e;
    }
    _setUpdateStrategy(e) {
      Ba(e) && e.updateOn != null && (this._updateOn = e.updateOn);
    }
    _parentMarkedDirty(e) {
      let r = this._parent && this._parent.dirty;
      return !e && !!r && !this._parent._anyControlsDirty();
    }
    _find(e) {
      return null;
    }
    _assignValidators(e) {
      (this._rawValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedValidatorFn = cI(this._rawValidators));
    }
    _assignAsyncValidators(e) {
      (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedAsyncValidatorFn = lI(this._rawAsyncValidators));
    }
  },
  ja = class extends Va {
    constructor(e, r, n) {
      super(Xm(r), ev(n, r)),
        (this.controls = e),
        this._initObservables(),
        this._setUpdateStrategy(r),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    registerControl(e, r) {
      return this.controls[e]
        ? this.controls[e]
        : ((this.controls[e] = r),
          r.setParent(this),
          r._registerOnCollectionChange(this._onCollectionChange),
          r);
    }
    addControl(e, r, n = {}) {
      this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(e, r = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    setControl(e, r, n = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        r && this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    contains(e) {
      return this.controls.hasOwnProperty(e) && this.controls[e].enabled;
    }
    setValue(e, r = {}) {
      dI(this, !0, e),
        Object.keys(e).forEach((n) => {
          uI(this, !0, n),
            this.controls[n].setValue(e[n], {
              onlySelf: !0,
              emitEvent: r.emitEvent,
            });
        }),
        this.updateValueAndValidity(r);
    }
    patchValue(e, r = {}) {
      e != null &&
        (Object.keys(e).forEach((n) => {
          let i = this.controls[n];
          i && i.patchValue(e[n], { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r));
    }
    reset(e = {}, r = {}) {
      this._forEachChild((n, i) => {
        n.reset(e ? e[i] : null, { onlySelf: !0, emitEvent: r.emitEvent });
      }),
        this._updatePristine(r, this),
        this._updateTouched(r, this),
        this.updateValueAndValidity(r);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (e, r, n) => ((e[n] = r.getRawValue()), e)
      );
    }
    _syncPendingControls() {
      let e = this._reduceChildren(!1, (r, n) =>
        n._syncPendingControls() ? !0 : r
      );
      return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
    }
    _forEachChild(e) {
      Object.keys(this.controls).forEach((r) => {
        let n = this.controls[r];
        n && e(n, r);
      });
    }
    _setUpControls() {
      this._forEachChild((e) => {
        e.setParent(this),
          e._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(e) {
      for (let [r, n] of Object.entries(this.controls))
        if (this.contains(r) && e(n)) return !0;
      return !1;
    }
    _reduceValue() {
      let e = {};
      return this._reduceChildren(
        e,
        (r, n, i) => ((n.enabled || this.disabled) && (r[i] = n.value), r)
      );
    }
    _reduceChildren(e, r) {
      let n = e;
      return (
        this._forEachChild((i, o) => {
          n = r(n, i, o);
        }),
        n
      );
    }
    _allControlsDisabled() {
      for (let e of Object.keys(this.controls))
        if (this.controls[e].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(e) {
      return this.controls.hasOwnProperty(e) ? this.controls[e] : null;
    }
  };
var nd = new x("CallSetDisabledState", {
    providedIn: "root",
    factory: () => rd,
  }),
  rd = "always";
function fI(t, e) {
  return [...e.path, t];
}
function tv(t, e, r = rd) {
  nv(t, e),
    e.valueAccessor.writeValue(t.value),
    (t.disabled || r === "always") &&
      e.valueAccessor.setDisabledState?.(t.disabled),
    pI(t, e),
    mI(t, e),
    gI(t, e),
    hI(t, e);
}
function Bm(t, e) {
  t.forEach((r) => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(e);
  });
}
function hI(t, e) {
  if (e.valueAccessor.setDisabledState) {
    let r = (n) => {
      e.valueAccessor.setDisabledState(n);
    };
    t.registerOnDisabledChange(r),
      e._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(r);
      });
  }
}
function nv(t, e) {
  let r = oI(t);
  e.validator !== null
    ? t.setValidators(Vm(r, e.validator))
    : typeof r == "function" && t.setValidators([r]);
  let n = sI(t);
  e.asyncValidator !== null
    ? t.setAsyncValidators(Vm(n, e.asyncValidator))
    : typeof n == "function" && t.setAsyncValidators([n]);
  let i = () => t.updateValueAndValidity();
  Bm(e._rawValidators, i), Bm(e._rawAsyncValidators, i);
}
function pI(t, e) {
  e.valueAccessor.registerOnChange((r) => {
    (t._pendingValue = r),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === "change" && rv(t, e);
  });
}
function gI(t, e) {
  e.valueAccessor.registerOnTouched(() => {
    (t._pendingTouched = !0),
      t.updateOn === "blur" && t._pendingChange && rv(t, e),
      t.updateOn !== "submit" && t.markAsTouched();
  });
}
function rv(t, e) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    e.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1);
}
function mI(t, e) {
  let r = (n, i) => {
    e.valueAccessor.writeValue(n), i && e.viewToModelUpdate(n);
  };
  t.registerOnChange(r),
    e._registerOnDestroy(() => {
      t._unregisterOnChange(r);
    });
}
function vI(t, e) {
  t == null, nv(t, e);
}
function yI(t, e) {
  if (!t.hasOwnProperty("model")) return !1;
  let r = t.model;
  return r.isFirstChange() ? !0 : !Object.is(e, r.currentValue);
}
function CI(t) {
  return Object.getPrototypeOf(t.constructor) === Ua;
}
function wI(t, e) {
  t._syncPendingControls(),
    e.forEach((r) => {
      let n = r.control;
      n.updateOn === "submit" &&
        n._pendingChange &&
        (r.viewToModelUpdate(n._pendingValue), (n._pendingChange = !1));
    });
}
function DI(t, e) {
  if (!e) return null;
  Array.isArray(e);
  let r, n, i;
  return (
    e.forEach((o) => {
      o.constructor === Le ? (r = o) : CI(o) ? (n = o) : (i = o);
    }),
    i || n || r || null
  );
}
var _I = { provide: Wr, useExisting: dt(() => on) },
  Hi = Promise.resolve(),
  on = (() => {
    let e = class e extends Wr {
      get submitted() {
        return Jt(this.submittedReactive);
      }
      constructor(n, i, o) {
        super(),
          (this.callSetDisabledState = o),
          (this._submitted = Ni(() => this.submittedReactive())),
          (this.submittedReactive = Mi(!1)),
          (this._directives = new Set()),
          (this.ngSubmit = new De()),
          (this.form = new ja({}, ed(n), td(i)));
      }
      ngAfterViewInit() {
        this._setUpdateStrategy();
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      get controls() {
        return this.form.controls;
      }
      addControl(n) {
        Hi.then(() => {
          let i = this._findContainer(n.path);
          (n.control = i.registerControl(n.name, n.control)),
            tv(n.control, n, this.callSetDisabledState),
            n.control.updateValueAndValidity({ emitEvent: !1 }),
            this._directives.add(n);
        });
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        Hi.then(() => {
          let i = this._findContainer(n.path);
          i && i.removeControl(n.name), this._directives.delete(n);
        });
      }
      addFormGroup(n) {
        Hi.then(() => {
          let i = this._findContainer(n.path),
            o = new ja({});
          vI(o, n),
            i.registerControl(n.name, o),
            o.updateValueAndValidity({ emitEvent: !1 });
        });
      }
      removeFormGroup(n) {
        Hi.then(() => {
          let i = this._findContainer(n.path);
          i && i.removeControl(n.name);
        });
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      updateModel(n, i) {
        Hi.then(() => {
          this.form.get(n.path).setValue(i);
        });
      }
      setValue(n) {
        this.control.setValue(n);
      }
      onSubmit(n) {
        return (
          this.submittedReactive.set(!0),
          wI(this.form, this._directives),
          this.ngSubmit.emit(n),
          n?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n), this.submittedReactive.set(!1);
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.form._updateOn = this.options.updateOn);
      }
      _findContainer(n) {
        return n.pop(), n.length ? this.form.get(n) : this.form;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(Yi, 10), E(qm, 10), E(nd, 8));
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [
          ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
          ["ng-form"],
          ["", "ngForm", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            S("submit", function (a) {
              return o.onSubmit(a);
            })("reset", function () {
              return o.onReset();
            });
        },
        inputs: { options: [0, "ngFormOptions", "options"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        features: [kt([_I]), Ye],
      }));
    let t = e;
    return t;
  })();
function $m(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function Hm(t) {
  return (
    typeof t == "object" &&
    t !== null &&
    Object.keys(t).length === 2 &&
    "value" in t &&
    "disabled" in t
  );
}
var EI = class extends Va {
  constructor(e = null, r, n) {
    super(Xm(r), ev(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(e),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Ba(r) &&
        (r.nonNullable || r.initialValueIsDefault) &&
        (Hm(e) ? (this.defaultValue = e.value) : (this.defaultValue = e));
  }
  setValue(e, r = {}) {
    (this.value = this._pendingValue = e),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach((n) =>
          n(this.value, r.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(r);
  }
  patchValue(e, r = {}) {
    this.setValue(e, r);
  }
  reset(e = this.defaultValue, r = {}) {
    this._applyFormState(e),
      this.markAsPristine(r),
      this.markAsUntouched(r),
      this.setValue(this.value, r),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(e) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(e) {
    this._onChange.push(e);
  }
  _unregisterOnChange(e) {
    $m(this._onChange, e);
  }
  registerOnDisabledChange(e) {
    this._onDisabledChange.push(e);
  }
  _unregisterOnDisabledChange(e) {
    $m(this._onDisabledChange, e);
  }
  _forEachChild(e) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(e) {
    Hm(e)
      ? ((this.value = this._pendingValue = e.value),
        e.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = e);
  }
};
var bI = { provide: qi, useExisting: dt(() => ze) },
  zm = Promise.resolve(),
  ze = (() => {
    let e = class e extends qi {
      constructor(n, i, o, s, a, c) {
        super(),
          (this._changeDetectorRef = a),
          (this.callSetDisabledState = c),
          (this.control = new EI()),
          (this._registered = !1),
          (this.name = ""),
          (this.update = new De()),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = DI(this, s));
      }
      ngOnChanges(n) {
        if ((this._checkForErrors(), !this._registered || "name" in n)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let i = n.name.previousValue;
            this.formDirective.removeControl({
              name: i,
              path: this._getPath(i),
            });
          }
          this._setUpControl();
        }
        "isDisabled" in n && this._updateDisabled(n),
          yI(n, this.viewModel) &&
            (this._updateValue(this.model), (this.viewModel = this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      get path() {
        return this._getPath(this.name);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      _setUpControl() {
        this._setUpdateStrategy(),
          this._isStandalone()
            ? this._setUpStandalone()
            : this.formDirective.addControl(this),
          (this._registered = !0);
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.control._updateOn = this.options.updateOn);
      }
      _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
      }
      _setUpStandalone() {
        tv(this.control, this, this.callSetDisabledState),
          this.control.updateValueAndValidity({ emitEvent: !1 });
      }
      _checkForErrors() {
        this._isStandalone() || this._checkParentType(), this._checkName();
      }
      _checkParentType() {}
      _checkName() {
        this.options && this.options.name && (this.name = this.options.name),
          !this._isStandalone() && this.name;
      }
      _updateValue(n) {
        zm.then(() => {
          this.control.setValue(n, { emitViewToModelChange: !1 }),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _updateDisabled(n) {
        let i = n.isDisabled.currentValue,
          o = i !== 0 && bn(i);
        zm.then(() => {
          o && !this.control.disabled
            ? this.control.disable()
            : !o && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _getPath(n) {
        return this._parent ? fI(n, this._parent) : [n];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        E(Wr, 9),
        E(Yi, 10),
        E(qm, 10),
        E(Zi, 10),
        E(er, 8),
        E(nd, 8)
      );
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [
          ["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""],
        ],
        inputs: {
          name: "name",
          isDisabled: [0, "disabled", "isDisabled"],
          model: [0, "ngModel", "model"],
          options: [0, "ngModelOptions", "options"],
        },
        outputs: { update: "ngModelChange" },
        exportAs: ["ngModel"],
        features: [kt([bI]), Ye, Dn],
      }));
    let t = e;
    return t;
  })(),
  An = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
        hostAttrs: ["novalidate", ""],
      }));
    let t = e;
    return t;
  })(),
  II = { provide: Zi, useExisting: dt(() => Qi), multi: !0 },
  Qi = (() => {
    let e = class e extends Ua {
      writeValue(n) {
        let i = n ?? "";
        this.setProperty("value", i);
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          n(i == "" ? null : parseFloat(i));
        };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Dt(e)))(o || e);
      };
    })()),
      (e.ɵdir = fe({
        type: e,
        selectors: [
          ["input", "type", "number", "formControlName", ""],
          ["input", "type", "number", "formControl", ""],
          ["input", "type", "number", "ngModel", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            S("input", function (a) {
              return o.onChange(a.target.value);
            })("blur", function () {
              return o.onTouched();
            });
        },
        features: [kt([II]), Ye],
      }));
    let t = e;
    return t;
  })();
var MI = { provide: Zi, useExisting: dt(() => ov), multi: !0 };
function iv(t, e) {
  return t == null
    ? `${e}`
    : (e && typeof e == "object" && (e = "Object"), `${t}: ${e}`.slice(0, 50));
}
function xI(t) {
  return t.split(":")[0];
}
var ov = (() => {
    let e = class e extends Ua {
      constructor() {
        super(...arguments),
          (this._optionMap = new Map()),
          (this._idCounter = 0),
          (this._compareWith = Object.is);
      }
      set compareWith(n) {
        this._compareWith = n;
      }
      writeValue(n) {
        this.value = n;
        let i = this._getOptionId(n),
          o = iv(i, n);
        this.setProperty("value", o);
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          (this.value = this._getOptionValue(i)), n(this.value);
        };
      }
      _registerOption() {
        return (this._idCounter++).toString();
      }
      _getOptionId(n) {
        for (let i of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(i), n)) return i;
        return null;
      }
      _getOptionValue(n) {
        let i = xI(n);
        return this._optionMap.has(i) ? this._optionMap.get(i) : n;
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Dt(e)))(o || e);
      };
    })()),
      (e.ɵdir = fe({
        type: e,
        selectors: [
          ["select", "formControlName", "", 3, "multiple", ""],
          ["select", "formControl", "", 3, "multiple", ""],
          ["select", "ngModel", "", 3, "multiple", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            S("change", function (a) {
              return o.onChange(a.target.value);
            })("blur", function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: "compareWith" },
        features: [kt([MI]), Ye],
      }));
    let t = e;
    return t;
  })(),
  sv = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._element = n),
          (this._renderer = i),
          (this._select = o),
          this._select && (this.id = this._select._registerOption());
      }
      set ngValue(n) {
        this._select != null &&
          (this._select._optionMap.set(this.id, n),
          this._setElementValue(iv(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._setElementValue(n),
          this._select && this._select.writeValue(this._select.value);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, "value", n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select.writeValue(this._select.value));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(_t), E(Ft), E(ov, 9));
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [["option"]],
        inputs: { ngValue: "ngValue", value: "value" },
      }));
    let t = e;
    return t;
  })(),
  SI = { provide: Zi, useExisting: dt(() => $a), multi: !0 };
function Gm(t, e) {
  return t == null
    ? `${e}`
    : (typeof e == "string" && (e = `'${e}'`),
      e && typeof e == "object" && (e = "Object"),
      `${t}: ${e}`.slice(0, 50));
}
function TI(t) {
  return t.split(":")[0];
}
var $a = (() => {
    let e = class e extends Ua {
      constructor() {
        super(...arguments),
          (this._optionMap = new Map()),
          (this._idCounter = 0),
          (this._compareWith = Object.is);
      }
      set compareWith(n) {
        this._compareWith = n;
      }
      writeValue(n) {
        this.value = n;
        let i;
        if (Array.isArray(n)) {
          let o = n.map((s) => this._getOptionId(s));
          i = (s, a) => {
            s._setSelected(o.indexOf(a.toString()) > -1);
          };
        } else
          i = (o, s) => {
            o._setSelected(!1);
          };
        this._optionMap.forEach(i);
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          let o = [],
            s = i.selectedOptions;
          if (s !== void 0) {
            let a = s;
            for (let c = 0; c < a.length; c++) {
              let l = a[c],
                u = this._getOptionValue(l.value);
              o.push(u);
            }
          } else {
            let a = i.options;
            for (let c = 0; c < a.length; c++) {
              let l = a[c];
              if (l.selected) {
                let u = this._getOptionValue(l.value);
                o.push(u);
              }
            }
          }
          (this.value = o), n(o);
        };
      }
      _registerOption(n) {
        let i = (this._idCounter++).toString();
        return this._optionMap.set(i, n), i;
      }
      _getOptionId(n) {
        for (let i of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(i)._value, n)) return i;
        return null;
      }
      _getOptionValue(n) {
        let i = TI(n);
        return this._optionMap.has(i) ? this._optionMap.get(i)._value : n;
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Dt(e)))(o || e);
      };
    })()),
      (e.ɵdir = fe({
        type: e,
        selectors: [
          ["select", "multiple", "", "formControlName", ""],
          ["select", "multiple", "", "formControl", ""],
          ["select", "multiple", "", "ngModel", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            S("change", function (a) {
              return o.onChange(a.target);
            })("blur", function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: "compareWith" },
        features: [kt([SI]), Ye],
      }));
    let t = e;
    return t;
  })(),
  av = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._element = n),
          (this._renderer = i),
          (this._select = o),
          this._select && (this.id = this._select._registerOption(this));
      }
      set ngValue(n) {
        this._select != null &&
          ((this._value = n),
          this._setElementValue(Gm(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._select
          ? ((this._value = n),
            this._setElementValue(Gm(this.id, n)),
            this._select.writeValue(this._select.value))
          : this._setElementValue(n);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, "value", n);
      }
      _setSelected(n) {
        this._renderer.setProperty(this._element.nativeElement, "selected", n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select.writeValue(this._select.value));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(_t), E(Ft), E($a, 9));
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [["option"]],
        inputs: { ngValue: "ngValue", value: "value" },
      }));
    let t = e;
    return t;
  })();
function cv(t) {
  return typeof t == "number" ? t : parseFloat(t);
}
var id = (() => {
    let e = class e {
      constructor() {
        this._validator = Lm;
      }
      ngOnChanges(n) {
        if (this.inputName in n) {
          let i = this.normalizeInput(n[this.inputName].currentValue);
          (this._enabled = this.enabled(i)),
            (this._validator = this._enabled ? this.createValidator(i) : Lm),
            this._onChange && this._onChange();
        }
      }
      validate(n) {
        return this._validator(n);
      }
      registerOnValidatorChange(n) {
        this._onChange = n;
      }
      enabled(n) {
        return n != null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = fe({ type: e, features: [Dn] }));
    let t = e;
    return t;
  })(),
  AI = { provide: Yi, useExisting: dt(() => od), multi: !0 },
  od = (() => {
    let e = class e extends id {
      constructor() {
        super(...arguments),
          (this.inputName = "max"),
          (this.normalizeInput = (n) => cv(n)),
          (this.createValidator = (n) => eI(n));
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Dt(e)))(o || e);
      };
    })()),
      (e.ɵdir = fe({
        type: e,
        selectors: [
          ["input", "type", "number", "max", "", "formControlName", ""],
          ["input", "type", "number", "max", "", "formControl", ""],
          ["input", "type", "number", "max", "", "ngModel", ""],
        ],
        hostVars: 1,
        hostBindings: function (i, o) {
          i & 2 && Jn("max", o._enabled ? o.max : null);
        },
        inputs: { max: "max" },
        features: [kt([AI]), Ye],
      }));
    let t = e;
    return t;
  })(),
  NI = { provide: Yi, useExisting: dt(() => sd), multi: !0 },
  sd = (() => {
    let e = class e extends id {
      constructor() {
        super(...arguments),
          (this.inputName = "min"),
          (this.normalizeInput = (n) => cv(n)),
          (this.createValidator = (n) => Xb(n));
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Dt(e)))(o || e);
      };
    })()),
      (e.ɵdir = fe({
        type: e,
        selectors: [
          ["input", "type", "number", "min", "", "formControlName", ""],
          ["input", "type", "number", "min", "", "formControl", ""],
          ["input", "type", "number", "min", "", "ngModel", ""],
        ],
        hostVars: 1,
        hostBindings: function (i, o) {
          i & 2 && Jn("min", o._enabled ? o.min : null);
        },
        inputs: { min: "min" },
        features: [kt([NI]), Ye],
      }));
    let t = e;
    return t;
  })(),
  RI = { provide: Yi, useExisting: dt(() => sn), multi: !0 };
var sn = (() => {
  let e = class e extends id {
    constructor() {
      super(...arguments),
        (this.inputName = "required"),
        (this.normalizeInput = bn),
        (this.createValidator = (n) => tI);
    }
    enabled(n) {
      return n;
    }
  };
  (e.ɵfac = (() => {
    let n;
    return function (o) {
      return (n || (n = Dt(e)))(o || e);
    };
  })()),
    (e.ɵdir = fe({
      type: e,
      selectors: [
        ["", "required", "", "formControlName", "", 3, "type", "checkbox"],
        ["", "required", "", "formControl", "", 3, "type", "checkbox"],
        ["", "required", "", "ngModel", "", 3, "type", "checkbox"],
      ],
      hostVars: 1,
      hostBindings: function (i, o) {
        i & 2 && Jn("required", o._enabled ? "" : null);
      },
      inputs: { required: "required" },
      features: [kt([RI]), Ye],
    }));
  let t = e;
  return t;
})();
var OI = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Pe({ type: e })),
    (e.ɵinj = Oe({}));
  let t = e;
  return t;
})();
var lv = (() => {
  let e = class e {
    static withConfig(n) {
      return {
        ngModule: e,
        providers: [{ provide: nd, useValue: n.callSetDisabledState ?? rd }],
      };
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Pe({ type: e })),
    (e.ɵinj = Oe({ imports: [OI] }));
  let t = e;
  return t;
})();
var j = "primary",
  uo = Symbol("RouteTitle"),
  dd = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Xr(t) {
  return new dd(t);
}
function PI(t, e, r) {
  let n = r.path.split("/");
  if (
    n.length > t.length ||
    (r.pathMatch === "full" && (e.hasChildren() || n.length < t.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < n.length; o++) {
    let s = n[o],
      a = t[o];
    if (s[0] === ":") i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, n.length), posParams: i };
}
function FI(t, e) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; ++r) if (!jt(t[r], e[r])) return !1;
  return !0;
}
function jt(t, e) {
  let r = t ? fd(t) : void 0,
    n = e ? fd(e) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let i;
  for (let o = 0; o < r.length; o++)
    if (((i = r[o]), !wv(t[i], e[i]))) return !1;
  return !0;
}
function fd(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function wv(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let r = [...t].sort(),
      n = [...e].sort();
    return r.every((i, o) => n[o] === i);
  } else return t === e;
}
function Dv(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Rn(t) {
  return Tc(t) ? t : Xn(t) ? de(Promise.resolve(t)) : F(t);
}
var kI = { exact: Ev, subset: bv },
  _v = { exact: LI, subset: VI, ignored: () => !0 };
function uv(t, e, r) {
  return (
    kI[r.paths](t.root, e.root, r.matrixParams) &&
    _v[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function LI(t, e) {
  return jt(t, e);
}
function Ev(t, e, r) {
  if (
    !rr(t.segments, e.segments) ||
    !Ga(t.segments, e.segments, r) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let n in e.children)
    if (!t.children[n] || !Ev(t.children[n], e.children[n], r)) return !1;
  return !0;
}
function VI(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((r) => wv(t[r], e[r]))
  );
}
function bv(t, e, r) {
  return Iv(t, e, e.segments, r);
}
function Iv(t, e, r, n) {
  if (t.segments.length > r.length) {
    let i = t.segments.slice(0, r.length);
    return !(!rr(i, r) || e.hasChildren() || !Ga(i, r, n));
  } else if (t.segments.length === r.length) {
    if (!rr(t.segments, r) || !Ga(t.segments, r, n)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !bv(t.children[i], e.children[i], n)) return !1;
    return !0;
  } else {
    let i = r.slice(0, t.segments.length),
      o = r.slice(t.segments.length);
    return !rr(t.segments, i) || !Ga(t.segments, i, n) || !t.children[j]
      ? !1
      : Iv(t.children[j], e, o, n);
  }
}
function Ga(t, e, r) {
  return e.every((n, i) => _v[r](t[i].parameters, n.parameters));
}
var cn = class {
    constructor(e = new ne([], {}), r = {}, n = null) {
      (this.root = e), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Xr(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return BI.serialize(this);
    }
  },
  ne = class {
    constructor(e, r) {
      (this.segments = e),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Wa(this);
    }
  },
  nr = class {
    constructor(e, r) {
      (this.path = e), (this.parameters = r);
    }
    get parameterMap() {
      return (this._parameterMap ??= Xr(this.parameters)), this._parameterMap;
    }
    toString() {
      return xv(this);
    }
  };
function jI(t, e) {
  return rr(t, e) && t.every((r, n) => jt(r.parameters, e[n].parameters));
}
function rr(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function UI(t, e) {
  let r = [];
  return (
    Object.entries(t.children).forEach(([n, i]) => {
      n === j && (r = r.concat(e(i, n)));
    }),
    Object.entries(t.children).forEach(([n, i]) => {
      n !== j && (r = r.concat(e(i, n)));
    }),
    r
  );
}
var fo = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => new ei(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ei = class {
    parse(e) {
      let r = new pd(e);
      return new cn(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      );
    }
    serialize(e) {
      let r = `/${Ki(e.root, !0)}`,
        n = zI(e.queryParams),
        i = typeof e.fragment == "string" ? `#${$I(e.fragment)}` : "";
      return `${r}${n}${i}`;
    }
  },
  BI = new ei();
function Wa(t) {
  return t.segments.map((e) => xv(e)).join("/");
}
function Ki(t, e) {
  if (!t.hasChildren()) return Wa(t);
  if (e) {
    let r = t.children[j] ? Ki(t.children[j], !1) : "",
      n = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== j && n.push(`${i}:${Ki(o, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    );
  } else {
    let r = UI(t, (n, i) =>
      i === j ? [Ki(t.children[j], !1)] : [`${i}:${Ki(n, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[j] != null
      ? `${Wa(t)}/${r[0]}`
      : `${Wa(t)}/(${r.join("//")})`;
  }
}
function Mv(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function Ha(t) {
  return Mv(t).replace(/%3B/gi, ";");
}
function $I(t) {
  return encodeURI(t);
}
function hd(t) {
  return Mv(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function qa(t) {
  return decodeURIComponent(t);
}
function dv(t) {
  return qa(t.replace(/\+/g, "%20"));
}
function xv(t) {
  return `${hd(t.path)}${HI(t.parameters)}`;
}
function HI(t) {
  return Object.entries(t)
    .map(([e, r]) => `;${hd(e)}=${hd(r)}`)
    .join("");
}
function zI(t) {
  let e = Object.entries(t)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((i) => `${Ha(r)}=${Ha(i)}`).join("&")
        : `${Ha(r)}=${Ha(n)}`
    )
    .filter((r) => r);
  return e.length ? `?${e.join("&")}` : "";
}
var GI = /^[^\/()?;#]+/;
function ad(t) {
  let e = t.match(GI);
  return e ? e[0] : "";
}
var WI = /^[^\/()?;=#]+/;
function qI(t) {
  let e = t.match(WI);
  return e ? e[0] : "";
}
var ZI = /^[^=?&#]+/;
function YI(t) {
  let e = t.match(ZI);
  return e ? e[0] : "";
}
var QI = /^[^&#]+/;
function KI(t) {
  let e = t.match(QI);
  return e ? e[0] : "";
}
var pd = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new ne([], {})
        : new ne([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (e.length > 0 || Object.keys(r).length > 0) && (n[j] = new ne(e, r)),
      n
    );
  }
  parseSegment() {
    let e = ad(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new A(4009, !1);
    return this.capture(e), new nr(qa(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let r = qI(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let i = ad(this.remaining);
      i && ((n = i), this.capture(n));
    }
    e[qa(r)] = qa(n);
  }
  parseQueryParam(e) {
    let r = YI(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let s = KI(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let i = dv(r),
      o = dv(n);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = ad(this.remaining),
        i = this.remaining[n.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new A(4010, !1);
      let o;
      n.indexOf(":") > -1
        ? ((o = n.slice(0, n.indexOf(":"))), this.capture(o), this.capture(":"))
        : e && (o = j);
      let s = this.parseChildren();
      (r[o] = Object.keys(s).length === 1 ? s[j] : new ne([], s)),
        this.consumeOptional("//");
    }
    return r;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new A(4011, !1);
  }
};
function Sv(t) {
  return t.segments.length > 0 ? new ne([], { [j]: t }) : t;
}
function Tv(t) {
  let e = {};
  for (let [n, i] of Object.entries(t.children)) {
    let o = Tv(i);
    if (n === j && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[n] = o);
  }
  let r = new ne(t.segments, e);
  return JI(r);
}
function JI(t) {
  if (t.numberOfChildren === 1 && t.children[j]) {
    let e = t.children[j];
    return new ne(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function ir(t) {
  return t instanceof cn;
}
function XI(t, e, r = null, n = null) {
  let i = Av(t);
  return Nv(i, e, r, n);
}
function Av(t) {
  let e;
  function r(o) {
    let s = {};
    for (let c of o.children) {
      let l = r(c);
      s[c.outlet] = l;
    }
    let a = new ne(o.url, s);
    return o === t && (e = a), a;
  }
  let n = r(t.root),
    i = Sv(n);
  return e ?? i;
}
function Nv(t, e, r, n) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return cd(i, i, i, r, n);
  let o = eM(e);
  if (o.toRoot()) return cd(i, i, new ne([], {}), r, n);
  let s = tM(o, i, t),
    a = s.processChildren
      ? eo(s.segmentGroup, s.index, o.commands)
      : Ov(s.segmentGroup, s.index, o.commands);
  return cd(i, s.segmentGroup, a, r, n);
}
function Za(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function ro(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function cd(t, e, r, n, i) {
  let o = {};
  n &&
    Object.entries(n).forEach(([c, l]) => {
      o[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let s;
  t === e ? (s = r) : (s = Rv(t, e, r));
  let a = Sv(Tv(s));
  return new cn(a, o, i);
}
function Rv(t, e, r) {
  let n = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (n[i] = r) : (n[i] = Rv(o, e, r));
    }),
    new ne(t.segments, n)
  );
}
var Ya = class {
  constructor(e, r, n) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      e && n.length > 0 && Za(n[0]))
    )
      throw new A(4003, !1);
    let i = n.find(ro);
    if (i && i !== Dv(n)) throw new A(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function eM(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new Ya(!0, 0, t);
  let e = 0,
    r = !1,
    n = t.reduce((i, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([c, l]) => {
              a[c] = typeof l == "string" ? l.split("/") : l;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != "string"
        ? [...i, o]
        : s === 0
        ? (o.split("/").forEach((a, c) => {
            (c == 0 && a === ".") ||
              (c == 0 && a === ""
                ? (r = !0)
                : a === ".."
                ? e++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, o];
    }, []);
  return new Ya(r, e, n);
}
var Qr = class {
  constructor(e, r, n) {
    (this.segmentGroup = e), (this.processChildren = r), (this.index = n);
  }
};
function tM(t, e, r) {
  if (t.isAbsolute) return new Qr(e, !0, 0);
  if (!r) return new Qr(e, !1, NaN);
  if (r.parent === null) return new Qr(r, !0, 0);
  let n = Za(t.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n;
  return nM(r, i, t.numberOfDoubleDots);
}
function nM(t, e, r) {
  let n = t,
    i = e,
    o = r;
  for (; o > i; ) {
    if (((o -= i), (n = n.parent), !n)) throw new A(4005, !1);
    i = n.segments.length;
  }
  return new Qr(n, !1, i - o);
}
function rM(t) {
  return ro(t[0]) ? t[0].outlets : { [j]: t };
}
function Ov(t, e, r) {
  if (((t ??= new ne([], {})), t.segments.length === 0 && t.hasChildren()))
    return eo(t, e, r);
  let n = iM(t, e, r),
    i = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < t.segments.length) {
    let o = new ne(t.segments.slice(0, n.pathIndex), {});
    return (
      (o.children[j] = new ne(t.segments.slice(n.pathIndex), t.children)),
      eo(o, 0, i)
    );
  } else
    return n.match && i.length === 0
      ? new ne(t.segments, {})
      : n.match && !t.hasChildren()
      ? gd(t, e, r)
      : n.match
      ? eo(t, 0, i)
      : gd(t, e, r);
}
function eo(t, e, r) {
  if (r.length === 0) return new ne(t.segments, {});
  {
    let n = rM(r),
      i = {};
    if (
      Object.keys(n).some((o) => o !== j) &&
      t.children[j] &&
      t.numberOfChildren === 1 &&
      t.children[j].segments.length === 0
    ) {
      let o = eo(t.children[j], e, r);
      return new ne(t.segments, o.children);
    }
    return (
      Object.entries(n).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = Ov(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        n[o] === void 0 && (i[o] = s);
      }),
      new ne(t.segments, i)
    );
  }
}
function iM(t, e, r) {
  let n = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (n >= r.length) return o;
    let s = t.segments[i],
      a = r[n];
    if (ro(a)) break;
    let c = `${a}`,
      l = n < r.length - 1 ? r[n + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!hv(c, l, s)) return o;
      n += 2;
    } else {
      if (!hv(c, {}, s)) return o;
      n++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: n };
}
function gd(t, e, r) {
  let n = t.segments.slice(0, e),
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (ro(o)) {
      let c = oM(o.outlets);
      return new ne(n, c);
    }
    if (i === 0 && Za(r[0])) {
      let c = t.segments[e];
      n.push(new nr(c.path, fv(r[0]))), i++;
      continue;
    }
    let s = ro(o) ? o.outlets[j] : `${o}`,
      a = i < r.length - 1 ? r[i + 1] : null;
    s && a && Za(a)
      ? (n.push(new nr(s, fv(a))), (i += 2))
      : (n.push(new nr(s, {})), i++);
  }
  return new ne(n, {});
}
function oM(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (e[r] = gd(new ne([], {}), 0, n));
    }),
    e
  );
}
function fv(t) {
  let e = {};
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function hv(t, e, r) {
  return t == r.path && jt(e, r.parameters);
}
var to = "imperative",
  Te = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = "NavigationStart"),
      (t[(t.NavigationEnd = 1)] = "NavigationEnd"),
      (t[(t.NavigationCancel = 2)] = "NavigationCancel"),
      (t[(t.NavigationError = 3)] = "NavigationError"),
      (t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
      (t[(t.ResolveStart = 5)] = "ResolveStart"),
      (t[(t.ResolveEnd = 6)] = "ResolveEnd"),
      (t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
      (t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (t[(t.ActivationStart = 13)] = "ActivationStart"),
      (t[(t.ActivationEnd = 14)] = "ActivationEnd"),
      (t[(t.Scroll = 15)] = "Scroll"),
      (t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
      t
    );
  })(Te || {}),
  gt = class {
    constructor(e, r) {
      (this.id = e), (this.url = r);
    }
  },
  ti = class extends gt {
    constructor(e, r, n = "imperative", i = null) {
      super(e, r),
        (this.type = Te.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Ut = class extends gt {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = Te.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  ot = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    );
  })(ot || {}),
  Qa = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(Qa || {}),
  an = class extends gt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = Te.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Nn = class extends gt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = Te.NavigationSkipped);
    }
  },
  io = class extends gt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.error = n),
        (this.target = i),
        (this.type = Te.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Ka = class extends gt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = Te.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  md = class extends gt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = Te.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  vd = class extends gt {
    constructor(e, r, n, i, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = Te.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  yd = class extends gt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = Te.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Cd = class extends gt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = Te.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  wd = class {
    constructor(e) {
      (this.route = e), (this.type = Te.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Dd = class {
    constructor(e) {
      (this.route = e), (this.type = Te.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  _d = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Te.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Ed = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Te.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  bd = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Te.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Id = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Te.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Ja = class {
    constructor(e, r, n) {
      (this.routerEvent = e),
        (this.position = r),
        (this.anchor = n),
        (this.type = Te.Scroll);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  oo = class {},
  ni = class {
    constructor(e, r) {
      (this.url = e), (this.navigationBehaviorOptions = r);
    }
  };
function sM(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = ra(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function Mt(t) {
  return t.outlet || j;
}
function aM(t, e) {
  let r = t.filter((n) => Mt(n) === e);
  return r.push(...t.filter((n) => Mt(n) !== e)), r;
}
function ho(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var Md = class {
    get injector() {
      return ho(this.route?.snapshot) ?? this.rootInjector;
    }
    set injector(e) {}
    constructor(e) {
      (this.rootInjector = e),
        (this.outlet = null),
        (this.route = null),
        (this.children = new po(this.rootInjector)),
        (this.attachRef = null);
    }
  },
  po = (() => {
    let e = class e {
      constructor(n) {
        (this.rootInjector = n), (this.contexts = new Map());
      }
      onChildOutletCreated(n, i) {
        let o = this.getOrCreateContext(n);
        (o.outlet = i), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let i = this.getContext(n);
        return (
          i || ((i = new Md(this.rootInjector)), this.contexts.set(n, i)), i
        );
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(Be));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Xa = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let r = this.pathFromRoot(e);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(e) {
      let r = xd(e, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(e) {
      let r = xd(e, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(e) {
      let r = Sd(e, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return Sd(e, this._root).map((r) => r.value);
    }
  };
function xd(t, e) {
  if (t === e.value) return e;
  for (let r of e.children) {
    let n = xd(t, r);
    if (n) return n;
  }
  return null;
}
function Sd(t, e) {
  if (t === e.value) return [e];
  for (let r of e.children) {
    let n = Sd(t, r);
    if (n.length) return n.unshift(e), n;
  }
  return [];
}
var it = class {
  constructor(e, r) {
    (this.value = e), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Yr(t) {
  let e = {};
  return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var ec = class extends Xa {
  constructor(e, r) {
    super(e), (this.snapshot = r), Ld(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Pv(t) {
  let e = cM(t),
    r = new Ie([new nr("", {})]),
    n = new Ie({}),
    i = new Ie({}),
    o = new Ie({}),
    s = new Ie(""),
    a = new or(r, n, o, s, i, j, t, e.root);
  return (a.snapshot = e.root), new ec(new it(a, []), e);
}
function cM(t) {
  let e = {},
    r = {},
    n = {},
    i = "",
    o = new Kr([], e, n, i, r, j, t, null, {});
  return new nc("", new it(o, []));
}
var or = class {
  constructor(e, r, n, i, o, s, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(V((l) => l[uo])) ?? F(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(V((e) => Xr(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(V((e) => Xr(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function tc(t, e, r = "emptyOnly") {
  let n,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (r === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: D(D({}, e.params), t.params),
          data: D(D({}, e.data), t.data),
          resolve: D(D(D(D({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (n = {
          params: D({}, t.params),
          data: D({}, t.data),
          resolve: D(D({}, t.data), t._resolvedData ?? {}),
        }),
    i && kv(i) && (n.resolve[uo] = i.title),
    n
  );
}
var Kr = class {
    get title() {
      return this.data?.[uo];
    }
    constructor(e, r, n, i, o, s, a, c, l) {
      (this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= Xr(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Xr(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((n) => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${r}')`;
    }
  },
  nc = class extends Xa {
    constructor(e, r) {
      super(r), (this.url = e), Ld(this, r);
    }
    toString() {
      return Fv(this._root);
    }
  };
function Ld(t, e) {
  (e.value._routerState = t), e.children.forEach((r) => Ld(t, r));
}
function Fv(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(Fv).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function ld(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot;
    (t.snapshot = r),
      jt(e.queryParams, r.queryParams) ||
        t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      jt(e.params, r.params) || t.paramsSubject.next(r.params),
      FI(e.url, r.url) || t.urlSubject.next(r.url),
      jt(e.data, r.data) || t.dataSubject.next(r.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function Td(t, e) {
  let r = jt(t.params, e.params) && jI(t.url, e.url),
    n = !t.parent != !e.parent;
  return r && !n && (!t.parent || Td(t.parent, e.parent));
}
function kv(t) {
  return typeof t.title == "string" || t.title === null;
}
var Vd = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = j),
          (this.activateEvents = new De()),
          (this.deactivateEvents = new De()),
          (this.attachEvents = new De()),
          (this.detachEvents = new De()),
          (this.parentContexts = C(po)),
          (this.location = C(Ur)),
          (this.changeDetector = C(er)),
          (this.inputBinder = C(ac, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: o } = n.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new A(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new A(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new A(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, i) {
        (this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new A(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          a = n.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          l = new Ad(n, c, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: l,
          environmentInjector: i,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = fe({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [Dn],
      }));
    let t = e;
    return t;
  })(),
  Ad = class t {
    __ngOutletInjector(e) {
      return new t(this.route, this.childContexts, e);
    }
    constructor(e, r, n) {
      (this.route = e), (this.childContexts = r), (this.parent = n);
    }
    get(e, r) {
      return e === or
        ? this.route
        : e === po
        ? this.childContexts
        : this.parent.get(e, r);
    }
  },
  ac = new x(""),
  pv = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map();
      }
      bindActivatedRouteToOutletComponent(n) {
        this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
      }
      unsubscribeFromRouteData(n) {
        this.outletDataSubscriptions.get(n)?.unsubscribe(),
          this.outletDataSubscriptions.delete(n);
      }
      subscribeToRouteData(n) {
        let { activatedRoute: i } = n,
          o = di([i.queryParams, i.params, i.data])
            .pipe(
              Re(
                ([s, a, c], l) => (
                  (c = D(D(D({}, s), a), c)),
                  l === 0 ? F(c) : Promise.resolve(c)
                )
              )
            )
            .subscribe((s) => {
              if (
                !n.isActivated ||
                !n.activatedComponentRef ||
                n.activatedRoute !== i ||
                i.component === null
              ) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              let a = Gg(i.component);
              if (!a) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              for (let { templateName: c } of a.inputs)
                n.activatedComponentRef.setInput(c, s[c]);
            });
        this.outletDataSubscriptions.set(n, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function lM(t, e, r) {
  let n = so(t, e._root, r ? r._root : void 0);
  return new ec(n, e);
}
function so(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = e.value;
    let i = uM(t, e, r);
    return new it(n, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => so(t, a))),
          s
        );
      }
    }
    let n = dM(e.value),
      i = e.children.map((o) => so(t, o));
    return new it(n, i);
  }
}
function uM(t, e, r) {
  return e.children.map((n) => {
    for (let i of r.children)
      if (t.shouldReuseRoute(n.value, i.value.snapshot)) return so(t, n, i);
    return so(t, n);
  });
}
function dM(t) {
  return new or(
    new Ie(t.url),
    new Ie(t.params),
    new Ie(t.queryParams),
    new Ie(t.fragment),
    new Ie(t.data),
    t.outlet,
    t.component,
    t
  );
}
var ao = class {
    constructor(e, r) {
      (this.redirectTo = e), (this.navigationBehaviorOptions = r);
    }
  },
  Lv = "ngNavigationCancelingError";
function rc(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = ir(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = Vv(!1, ot.Redirect);
  return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function Vv(t, e) {
  let r = new Error(`NavigationCancelingError: ${t || ""}`);
  return (r[Lv] = !0), (r.cancellationCode = e), r;
}
function fM(t) {
  return jv(t) && ir(t.url);
}
function jv(t) {
  return !!t && t[Lv];
}
var hM = (t, e, r, n) =>
    V(
      (i) => (
        new Nd(e, i.targetRouterState, i.currentRouterState, r, n).activate(t),
        i
      )
    ),
  Nd = class {
    constructor(e, r, n, i, o) {
      (this.routeReuseStrategy = e),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, e),
        ld(this.futureState.root),
        this.activateChildRoutes(r, n, e);
    }
    deactivateChildRoutes(e, r, n) {
      let i = Yr(r);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], n), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, n);
        });
    }
    deactivateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if (i === o)
        if (i.component) {
          let s = n.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, r, s.children);
        } else this.deactivateChildRoutes(e, r, n);
      else o && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r);
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = Yr(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = Yr(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(e, r, n) {
      let i = Yr(r);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], n),
          this.forwardEvent(new Id(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new Ed(e.value.snapshot));
    }
    activateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if ((ld(i), i === o))
        if (i.component) {
          let s = n.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, r, s.children);
        } else this.activateChildRoutes(e, r, n);
      else if (i.component) {
        let s = n.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            ld(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else
          (s.attachRef = null),
            (s.route = i),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
      } else this.activateChildRoutes(e, null, n);
    }
  },
  ic = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  Jr = class {
    constructor(e, r) {
      (this.component = e), (this.route = r);
    }
  };
function pM(t, e, r) {
  let n = t._root,
    i = e ? e._root : null;
  return Ji(n, i, r, [n.value]);
}
function gM(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function ii(t, e) {
  let r = Symbol(),
    n = e.get(t, r);
  return n === r ? (typeof t == "function" && !Ih(t) ? t : e.get(t)) : n;
}
function Ji(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = Yr(e);
  return (
    t.children.forEach((s) => {
      mM(s, o[s.value.outlet], r, n.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => no(a, r.getContext(s), i)),
    i
  );
}
function mM(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = t.value,
    s = e ? e.value : null,
    a = r ? r.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let c = vM(s, o, o.routeConfig.runGuardsAndResolvers);
    c
      ? i.canActivateChecks.push(new ic(n))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? Ji(t, e, a ? a.children : null, n, i) : Ji(t, e, r, n, i),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new Jr(a.outlet.component, s));
  } else
    s && no(e, a, i),
      i.canActivateChecks.push(new ic(n)),
      o.component
        ? Ji(t, null, a ? a.children : null, n, i)
        : Ji(t, null, r, n, i);
  return i;
}
function vM(t, e, r) {
  if (typeof r == "function") return r(t, e);
  switch (r) {
    case "pathParamsChange":
      return !rr(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !rr(t.url, e.url) || !jt(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Td(t, e) || !jt(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !Td(t, e);
  }
}
function no(t, e, r) {
  let n = Yr(t),
    i = t.value;
  Object.entries(n).forEach(([o, s]) => {
    i.component
      ? e
        ? no(s, e.children.getContext(o), r)
        : no(s, null, r)
      : no(s, e, r);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new Jr(e.outlet.component, i))
        : r.canDeactivateChecks.push(new Jr(null, i))
      : r.canDeactivateChecks.push(new Jr(null, i));
}
function go(t) {
  return typeof t == "function";
}
function yM(t) {
  return typeof t == "boolean";
}
function CM(t) {
  return t && go(t.canLoad);
}
function wM(t) {
  return t && go(t.canActivate);
}
function DM(t) {
  return t && go(t.canActivateChild);
}
function _M(t) {
  return t && go(t.canDeactivate);
}
function EM(t) {
  return t && go(t.canMatch);
}
function Uv(t) {
  return t instanceof Ht || t?.name === "EmptyError";
}
var za = Symbol("INITIAL_VALUE");
function ri() {
  return Re((t) =>
    di(t.map((e) => e.pipe(Gt(1), Pc(za)))).pipe(
      V((e) => {
        for (let r of e)
          if (r !== !0) {
            if (r === za) return za;
            if (r === !1 || bM(r)) return r;
          }
        return !0;
      }),
      We((e) => e !== za),
      Gt(1)
    )
  );
}
function bM(t) {
  return ir(t) || t instanceof ao;
}
function IM(t, e) {
  return we((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && o.length === 0
      ? F(q(D({}, r), { guardsResult: !0 }))
      : MM(s, n, i, t).pipe(
          we((a) => (a && yM(a) ? xM(n, o, t, e) : F(a))),
          V((a) => q(D({}, r), { guardsResult: a }))
        );
  });
}
function MM(t, e, r, n) {
  return de(t).pipe(
    we((i) => RM(i.component, i.route, r, e, n)),
    xt((i) => i !== !0, !0)
  );
}
function xM(t, e, r, n) {
  return de(e).pipe(
    zt((i) =>
      yr(
        TM(i.route.parent, n),
        SM(i.route, n),
        NM(t, i.path, r),
        AM(t, i.route, r)
      )
    ),
    xt((i) => i !== !0, !0)
  );
}
function SM(t, e) {
  return t !== null && e && e(new bd(t)), F(!0);
}
function TM(t, e) {
  return t !== null && e && e(new _d(t)), F(!0);
}
function AM(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!n || n.length === 0) return F(!0);
  let i = n.map((o) =>
    Zo(() => {
      let s = ho(e) ?? r,
        a = ii(o, s),
        c = wM(a) ? a.canActivate(e, t) : nt(s, () => a(e, t));
      return Rn(c).pipe(xt());
    })
  );
  return F(i).pipe(ri());
}
function NM(t, e, r) {
  let n = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => gM(s))
      .filter((s) => s !== null)
      .map((s) =>
        Zo(() => {
          let a = s.guards.map((c) => {
            let l = ho(s.node) ?? r,
              u = ii(c, l),
              h = DM(u) ? u.canActivateChild(n, t) : nt(l, () => u(n, t));
            return Rn(h).pipe(xt());
          });
          return F(a).pipe(ri());
        })
      );
  return F(o).pipe(ri());
}
function RM(t, e, r, n, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return F(!0);
  let s = o.map((a) => {
    let c = ho(e) ?? i,
      l = ii(a, c),
      u = _M(l) ? l.canDeactivate(t, e, r, n) : nt(c, () => l(t, e, r, n));
    return Rn(u).pipe(xt());
  });
  return F(s).pipe(ri());
}
function OM(t, e, r, n) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return F(!0);
  let o = i.map((s) => {
    let a = ii(s, t),
      c = CM(a) ? a.canLoad(e, r) : nt(t, () => a(e, r));
    return Rn(c);
  });
  return F(o).pipe(ri(), Bv(n));
}
function Bv(t) {
  return bc(
    Se((e) => {
      if (typeof e != "boolean") throw rc(t, e);
    }),
    V((e) => e === !0)
  );
}
function PM(t, e, r, n) {
  let i = e.canMatch;
  if (!i || i.length === 0) return F(!0);
  let o = i.map((s) => {
    let a = ii(s, t),
      c = EM(a) ? a.canMatch(e, r) : nt(t, () => a(e, r));
    return Rn(c);
  });
  return F(o).pipe(ri(), Bv(n));
}
var co = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  lo = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function Zr(t) {
  return mr(new co(t));
}
function FM(t) {
  return mr(new A(4e3, !1));
}
function kM(t) {
  return mr(Vv(!1, ot.GuardRejected));
}
var Rd = class {
    constructor(e, r) {
      (this.urlSerializer = e), (this.urlTree = r);
    }
    lineralizeSegments(e, r) {
      let n = [],
        i = r.root;
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return F(n);
        if (i.numberOfChildren > 1 || !i.children[j])
          return FM(`${e.redirectTo}`);
        i = i.children[j];
      }
    }
    applyRedirectCommands(e, r, n, i, o) {
      if (typeof r != "string") {
        let a = r,
          {
            queryParams: c,
            fragment: l,
            routeConfig: u,
            url: h,
            outlet: m,
            params: g,
            data: w,
            title: O,
          } = i,
          N = nt(o, () =>
            a({
              params: g,
              data: w,
              queryParams: c,
              fragment: l,
              routeConfig: u,
              url: h,
              outlet: m,
              title: O,
            })
          );
        if (N instanceof cn) throw new lo(N);
        r = N;
      }
      let s = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        e,
        n
      );
      if (r[0] === "/") throw new lo(s);
      return s;
    }
    applyRedirectCreateUrlTree(e, r, n, i) {
      let o = this.createSegmentGroup(e, r.root, n, i);
      return new cn(
        o,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      );
    }
    createQueryParams(e, r) {
      let n = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == "string" && o[0] === ":") {
            let a = o.substring(1);
            n[i] = r[a];
          } else n[i] = o;
        }),
        n
      );
    }
    createSegmentGroup(e, r, n, i) {
      let o = this.createSegments(e, r.segments, n, i),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, c]) => {
          s[a] = this.createSegmentGroup(e, c, n, i);
        }),
        new ne(o, s)
      );
    }
    createSegments(e, r, n, i) {
      return r.map((o) =>
        o.path[0] === ":" ? this.findPosParam(e, o, i) : this.findOrReturn(o, n)
      );
    }
    findPosParam(e, r, n) {
      let i = n[r.path.substring(1)];
      if (!i) throw new A(4001, !1);
      return i;
    }
    findOrReturn(e, r) {
      let n = 0;
      for (let i of r) {
        if (i.path === e.path) return r.splice(n), i;
        n++;
      }
      return e;
    }
  },
  Od = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function LM(t, e, r, n, i) {
  let o = jd(t, e, r);
  return o.matched
    ? ((n = sM(e, n)),
      PM(n, e, r, i).pipe(V((s) => (s === !0 ? o : D({}, Od)))))
    : F(o);
}
function jd(t, e, r) {
  if (e.path === "**") return VM(r);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || r.length > 0)
      ? D({}, Od)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || PI)(r, t, e);
  if (!i) return D({}, Od);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, c]) => {
    o[a] = c.path;
  });
  let s =
    i.consumed.length > 0
      ? D(D({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: r.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function VM(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? Dv(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function gv(t, e, r, n) {
  return r.length > 0 && BM(t, r, n)
    ? {
        segmentGroup: new ne(e, UM(n, new ne(r, t.children))),
        slicedSegments: [],
      }
    : r.length === 0 && $M(t, r, n)
    ? {
        segmentGroup: new ne(t.segments, jM(t, r, n, t.children)),
        slicedSegments: r,
      }
    : { segmentGroup: new ne(t.segments, t.children), slicedSegments: r };
}
function jM(t, e, r, n) {
  let i = {};
  for (let o of r)
    if (cc(t, e, o) && !n[Mt(o)]) {
      let s = new ne([], {});
      i[Mt(o)] = s;
    }
  return D(D({}, n), i);
}
function UM(t, e) {
  let r = {};
  r[j] = e;
  for (let n of t)
    if (n.path === "" && Mt(n) !== j) {
      let i = new ne([], {});
      r[Mt(n)] = i;
    }
  return r;
}
function BM(t, e, r) {
  return r.some((n) => cc(t, e, n) && Mt(n) !== j);
}
function $M(t, e, r) {
  return r.some((n) => cc(t, e, n));
}
function cc(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === "";
}
function HM(t, e, r, n) {
  return Mt(t) !== n && (n === j || !cc(e, r, t)) ? !1 : jd(e, t, r).matched;
}
function zM(t, e, r) {
  return e.length === 0 && !t.children[r];
}
var Pd = class {};
function GM(t, e, r, n, i, o, s = "emptyOnly") {
  return new Fd(t, e, r, n, i, s, o).recognize();
}
var WM = 31,
  Fd = class {
    constructor(e, r, n, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Rd(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new A(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = gv(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        V(({ children: r, rootSnapshot: n }) => {
          let i = new it(n, r),
            o = new nc("", i),
            s = XI(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            { state: o, tree: s }
          );
        })
      );
    }
    match(e) {
      let r = new Kr(
        [],
        Object.freeze({}),
        Object.freeze(D({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        j,
        this.rootComponentType,
        null,
        {}
      );
      return this.processSegmentGroup(this.injector, this.config, e, j, r).pipe(
        V((n) => ({ children: n, rootSnapshot: r })),
        un((n) => {
          if (n instanceof lo)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof co ? this.noMatchError(n) : n;
        })
      );
    }
    processSegmentGroup(e, r, n, i, o) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n, o)
        : this.processSegment(e, r, n, n.segments, i, !0, o).pipe(
            V((s) => (s instanceof it ? [s] : []))
          );
    }
    processChildren(e, r, n, i) {
      let o = [];
      for (let s of Object.keys(n.children))
        s === "primary" ? o.unshift(s) : o.push(s);
      return de(o).pipe(
        zt((s) => {
          let a = n.children[s],
            c = aM(r, s);
          return this.processSegmentGroup(e, c, a, s, i);
        }),
        Oc((s, a) => (s.push(...a), s)),
        dn(null),
        Rc(),
        we((s) => {
          if (s === null) return Zr(n);
          let a = $v(s);
          return qM(a), F(a);
        })
      );
    }
    processSegment(e, r, n, i, o, s, a) {
      return de(r).pipe(
        zt((c) =>
          this.processSegmentAgainstRoute(
            c._injector ?? e,
            r,
            c,
            n,
            i,
            o,
            s,
            a
          ).pipe(
            un((l) => {
              if (l instanceof co) return F(null);
              throw l;
            })
          )
        ),
        xt((c) => !!c),
        un((c) => {
          if (Uv(c)) return zM(n, i, o) ? F(new Pd()) : Zr(n);
          throw c;
        })
      );
    }
    processSegmentAgainstRoute(e, r, n, i, o, s, a, c) {
      return HM(n, i, o, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, n, o, s, c)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, r, n, o, s, c)
          : Zr(i)
        : Zr(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, i, o, s, a) {
      let {
        matched: c,
        parameters: l,
        consumedSegments: u,
        positionalParamSegments: h,
        remainingSegments: m,
      } = jd(r, i, o);
      if (!c) return Zr(r);
      typeof i.redirectTo == "string" &&
        i.redirectTo[0] === "/" &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > WM && (this.allowRedirects = !1));
      let g = new Kr(
          o,
          l,
          Object.freeze(D({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          mv(i),
          Mt(i),
          i.component ?? i._loadedComponent ?? null,
          i,
          vv(i)
        ),
        w = tc(g, a, this.paramsInheritanceStrategy);
      (g.params = Object.freeze(w.params)), (g.data = Object.freeze(w.data));
      let O = this.applyRedirects.applyRedirectCommands(
        u,
        i.redirectTo,
        h,
        g,
        e
      );
      return this.applyRedirects
        .lineralizeSegments(i, O)
        .pipe(we((N) => this.processSegment(e, n, r, N.concat(m), s, !1, a)));
    }
    matchSegmentAgainstRoute(e, r, n, i, o, s) {
      let a = LM(r, n, i, e, this.urlSerializer);
      return (
        n.path === "**" && (r.children = {}),
        a.pipe(
          Re((c) =>
            c.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, i).pipe(
                  Re(({ routes: l }) => {
                    let u = n._loadedInjector ?? e,
                      {
                        parameters: h,
                        consumedSegments: m,
                        remainingSegments: g,
                      } = c,
                      w = new Kr(
                        m,
                        h,
                        Object.freeze(D({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        mv(n),
                        Mt(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        vv(n)
                      ),
                      O = tc(w, s, this.paramsInheritanceStrategy);
                    (w.params = Object.freeze(O.params)),
                      (w.data = Object.freeze(O.data));
                    let { segmentGroup: N, slicedSegments: R } = gv(r, m, g, l);
                    if (R.length === 0 && N.hasChildren())
                      return this.processChildren(u, l, N, w).pipe(
                        V((ce) => new it(w, ce))
                      );
                    if (l.length === 0 && R.length === 0)
                      return F(new it(w, []));
                    let ye = Mt(n) === o;
                    return this.processSegment(
                      u,
                      l,
                      N,
                      R,
                      ye ? j : o,
                      !0,
                      w
                    ).pipe(V((ce) => new it(w, ce instanceof it ? [ce] : [])));
                  })
                ))
              : Zr(r)
          )
        )
      );
    }
    getChildConfig(e, r, n) {
      return r.children
        ? F({ routes: r.children, injector: e })
        : r.loadChildren
        ? r._loadedRoutes !== void 0
          ? F({ routes: r._loadedRoutes, injector: r._loadedInjector })
          : OM(e, r, n, this.urlSerializer).pipe(
              we((i) =>
                i
                  ? this.configLoader.loadChildren(e, r).pipe(
                      Se((o) => {
                        (r._loadedRoutes = o.routes),
                          (r._loadedInjector = o.injector);
                      })
                    )
                  : kM(r)
              )
            )
        : F({ routes: [], injector: e });
    }
  };
function qM(t) {
  t.sort((e, r) =>
    e.value.outlet === j
      ? -1
      : r.value.outlet === j
      ? 1
      : e.value.outlet.localeCompare(r.value.outlet)
  );
}
function ZM(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function $v(t) {
  let e = [],
    r = new Set();
  for (let n of t) {
    if (!ZM(n)) {
      e.push(n);
      continue;
    }
    let i = e.find((o) => n.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : e.push(n);
  }
  for (let n of r) {
    let i = $v(n.children);
    e.push(new it(n.value, i));
  }
  return e.filter((n) => !r.has(n));
}
function mv(t) {
  return t.data || {};
}
function vv(t) {
  return t.resolve || {};
}
function YM(t, e, r, n, i, o) {
  return we((s) =>
    GM(t, e, r, n, s.extractedUrl, i, o).pipe(
      V(({ state: a, tree: c }) =>
        q(D({}, s), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function QM(t, e) {
  return we((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r;
    if (!i.length) return F(r);
    let o = new Set(i.map((c) => c.route)),
      s = new Set();
    for (let c of o) if (!s.has(c)) for (let l of Hv(c)) s.add(l);
    let a = 0;
    return de(s).pipe(
      zt((c) =>
        o.has(c)
          ? KM(c, n, t, e)
          : ((c.data = tc(c, c.parent, t).resolve), F(void 0))
      ),
      Se(() => a++),
      Cr(1),
      we((c) => (a === s.size ? F(r) : Xe))
    );
  });
}
function Hv(t) {
  let e = t.children.map((r) => Hv(r)).flat();
  return [t, ...e];
}
function KM(t, e, r, n) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !kv(i) && (o[uo] = i.title),
    JM(o, t, e, n).pipe(
      V(
        (s) => (
          (t._resolvedData = s), (t.data = tc(t, t.parent, r).resolve), null
        )
      )
    )
  );
}
function JM(t, e, r, n) {
  let i = fd(t);
  if (i.length === 0) return F({});
  let o = {};
  return de(i).pipe(
    we((s) =>
      XM(t[s], e, r, n).pipe(
        xt(),
        Se((a) => {
          if (a instanceof ao) throw rc(new ei(), a);
          o[s] = a;
        })
      )
    ),
    Cr(1),
    Nc(o),
    un((s) => (Uv(s) ? Xe : mr(s)))
  );
}
function XM(t, e, r, n) {
  let i = ho(e) ?? n,
    o = ii(t, i),
    s = o.resolve ? o.resolve(e, r) : nt(i, () => o(e, r));
  return Rn(s);
}
function ud(t) {
  return Re((e) => {
    let r = t(e);
    return r ? de(r).pipe(V(() => e)) : F(e);
  });
}
var zv = (() => {
    let e = class e {
      buildTitle(n) {
        let i,
          o = n.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === j));
        return i;
      }
      getResolvedTitleForRoute(n) {
        return n.data[uo];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => C(ex), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ex = (() => {
    let e = class e extends zv {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let i = this.buildTitle(n);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(Fm));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  mo = new x("", { providedIn: "root", factory: () => ({}) }),
  tx = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵcmp = Q({
        type: e,
        selectors: [["ng-component"]],
        standalone: !0,
        features: [Sg],
        decls: 1,
        vars: 0,
        template: function (i, o) {
          i & 1 && ge(0, "router-outlet");
        },
        dependencies: [Vd],
        encapsulation: 2,
      }));
    let t = e;
    return t;
  })();
function Ud(t) {
  let e = t.children && t.children.map(Ud),
    r = e ? q(D({}, t), { children: e }) : D({}, t);
  return (
    !r.component &&
      !r.loadComponent &&
      (e || r.loadChildren) &&
      r.outlet &&
      r.outlet !== j &&
      (r.component = tx),
    r
  );
}
var oc = new x(""),
  Bd = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = C(da));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return F(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let i = Rn(n.loadComponent()).pipe(
            V(Gv),
            Se((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            fn(() => {
              this.componentLoaders.delete(n);
            })
          ),
          o = new pr(i, () => new xe()).pipe(hr());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return F({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = nx(i, this.compiler, n, this.onLoadEndListener).pipe(
            fn(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new pr(s, () => new xe()).pipe(hr());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function nx(t, e, r, n) {
  return Rn(t.loadChildren()).pipe(
    V(Gv),
    we((i) =>
      i instanceof wi || Array.isArray(i) ? F(i) : de(e.compileModuleAsync(i))
    ),
    V((i) => {
      n && n(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(r).injector),
            (s = o.get(oc, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Ud), injector: o }
      );
    })
  );
}
function rx(t) {
  return t && typeof t == "object" && "default" in t;
}
function Gv(t) {
  return rx(t) ? t.default : t;
}
var $d = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => C(ix), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ix = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, i) {
        return n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Wv = new x(""),
  qv = new x("");
function ox(t, e, r) {
  let n = t.get(qv),
    i = t.get(Ne);
  return t.get(re).runOutsideAngular(() => {
    if (!i.startViewTransition || n.skipNextTransition)
      return (n.skipNextTransition = !1), new Promise((l) => setTimeout(l));
    let o,
      s = new Promise((l) => {
        o = l;
      }),
      a = i.startViewTransition(() => (o(), sx(t))),
      { onViewTransitionCreated: c } = n;
    return c && nt(t, () => c({ transition: a, from: e, to: r })), s;
  });
}
function sx(t) {
  return new Promise((e) => {
    pu({ read: () => setTimeout(e) }, { injector: t });
  });
}
var ax = new x(""),
  Hd = (() => {
    let e = class e {
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      constructor() {
        (this.currentNavigation = null),
          (this.currentTransition = null),
          (this.lastSuccessfulNavigation = null),
          (this.events = new xe()),
          (this.transitionAbortSubject = new xe()),
          (this.configLoader = C(Bd)),
          (this.environmentInjector = C(Be)),
          (this.urlSerializer = C(fo)),
          (this.rootContexts = C(po)),
          (this.location = C(Hr)),
          (this.inputBindingEnabled = C(ac, { optional: !0 }) !== null),
          (this.titleStrategy = C(zv)),
          (this.options = C(mo, { optional: !0 }) || {}),
          (this.paramsInheritanceStrategy =
            this.options.paramsInheritanceStrategy || "emptyOnly"),
          (this.urlHandlingStrategy = C($d)),
          (this.createViewTransition = C(Wv, { optional: !0 })),
          (this.navigationErrorHandler = C(ax, { optional: !0 })),
          (this.navigationId = 0),
          (this.afterPreactivation = () => F(void 0)),
          (this.rootComponentType = null);
        let n = (o) => this.events.next(new wd(o)),
          i = (o) => this.events.next(new Dd(o));
        (this.configLoader.onLoadEndListener = i),
          (this.configLoader.onLoadStartListener = n);
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(n) {
        let i = ++this.navigationId;
        this.transitions?.next(
          q(D(D({}, this.transitions.value), n), { id: i })
        );
      }
      setupNavigations(n, i, o) {
        return (
          (this.transitions = new Ie({
            id: 0,
            currentUrlTree: i,
            currentRawUrl: i,
            extractedUrl: this.urlHandlingStrategy.extract(i),
            urlAfterRedirects: this.urlHandlingStrategy.extract(i),
            rawUrl: i,
            extras: {},
            resolve: () => {},
            reject: () => {},
            promise: Promise.resolve(!0),
            source: to,
            restoredState: null,
            currentSnapshot: o.snapshot,
            targetSnapshot: null,
            currentRouterState: o,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
          })),
          this.transitions.pipe(
            We((s) => s.id !== 0),
            V((s) =>
              q(D({}, s), {
                extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
              })
            ),
            Re((s) => {
              let a = !1,
                c = !1;
              return F(s).pipe(
                Re((l) => {
                  if (this.navigationId > s.id)
                    return (
                      this.cancelNavigationTransition(
                        s,
                        "",
                        ot.SupersededByNewNavigation
                      ),
                      Xe
                    );
                  (this.currentTransition = s),
                    (this.currentNavigation = {
                      id: l.id,
                      initialUrl: l.rawUrl,
                      extractedUrl: l.extractedUrl,
                      targetBrowserUrl:
                        typeof l.extras.browserUrl == "string"
                          ? this.urlSerializer.parse(l.extras.browserUrl)
                          : l.extras.browserUrl,
                      trigger: l.source,
                      extras: l.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? q(D({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                    });
                  let u =
                      !n.navigated ||
                      this.isUpdatingInternalState() ||
                      this.isUpdatedBrowserUrl(),
                    h = l.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                  if (!u && h !== "reload") {
                    let m = "";
                    return (
                      this.events.next(
                        new Nn(
                          l.id,
                          this.urlSerializer.serialize(l.rawUrl),
                          m,
                          Qa.IgnoredSameUrlNavigation
                        )
                      ),
                      l.resolve(!1),
                      Xe
                    );
                  }
                  if (this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))
                    return F(l).pipe(
                      Re((m) => {
                        let g = this.transitions?.getValue();
                        return (
                          this.events.next(
                            new ti(
                              m.id,
                              this.urlSerializer.serialize(m.extractedUrl),
                              m.source,
                              m.restoredState
                            )
                          ),
                          g !== this.transitions?.getValue()
                            ? Xe
                            : Promise.resolve(m)
                        );
                      }),
                      YM(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        n.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy
                      ),
                      Se((m) => {
                        (s.targetSnapshot = m.targetSnapshot),
                          (s.urlAfterRedirects = m.urlAfterRedirects),
                          (this.currentNavigation = q(
                            D({}, this.currentNavigation),
                            { finalUrl: m.urlAfterRedirects }
                          ));
                        let g = new Ka(
                          m.id,
                          this.urlSerializer.serialize(m.extractedUrl),
                          this.urlSerializer.serialize(m.urlAfterRedirects),
                          m.targetSnapshot
                        );
                        this.events.next(g);
                      })
                    );
                  if (
                    u &&
                    this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)
                  ) {
                    let {
                        id: m,
                        extractedUrl: g,
                        source: w,
                        restoredState: O,
                        extras: N,
                      } = l,
                      R = new ti(m, this.urlSerializer.serialize(g), w, O);
                    this.events.next(R);
                    let ye = Pv(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = s =
                        q(D({}, l), {
                          targetSnapshot: ye,
                          urlAfterRedirects: g,
                          extras: q(D({}, N), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      (this.currentNavigation.finalUrl = g),
                      F(s)
                    );
                  } else {
                    let m = "";
                    return (
                      this.events.next(
                        new Nn(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          m,
                          Qa.IgnoredByUrlHandlingStrategy
                        )
                      ),
                      l.resolve(!1),
                      Xe
                    );
                  }
                }),
                Se((l) => {
                  let u = new md(
                    l.id,
                    this.urlSerializer.serialize(l.extractedUrl),
                    this.urlSerializer.serialize(l.urlAfterRedirects),
                    l.targetSnapshot
                  );
                  this.events.next(u);
                }),
                V(
                  (l) => (
                    (this.currentTransition = s =
                      q(D({}, l), {
                        guards: pM(
                          l.targetSnapshot,
                          l.currentSnapshot,
                          this.rootContexts
                        ),
                      })),
                    s
                  )
                ),
                IM(this.environmentInjector, (l) => this.events.next(l)),
                Se((l) => {
                  if (
                    ((s.guardsResult = l.guardsResult),
                    l.guardsResult && typeof l.guardsResult != "boolean")
                  )
                    throw rc(this.urlSerializer, l.guardsResult);
                  let u = new vd(
                    l.id,
                    this.urlSerializer.serialize(l.extractedUrl),
                    this.urlSerializer.serialize(l.urlAfterRedirects),
                    l.targetSnapshot,
                    !!l.guardsResult
                  );
                  this.events.next(u);
                }),
                We((l) =>
                  l.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(l, "", ot.GuardRejected),
                      !1)
                ),
                ud((l) => {
                  if (l.guards.canActivateChecks.length)
                    return F(l).pipe(
                      Se((u) => {
                        let h = new yd(
                          u.id,
                          this.urlSerializer.serialize(u.extractedUrl),
                          this.urlSerializer.serialize(u.urlAfterRedirects),
                          u.targetSnapshot
                        );
                        this.events.next(h);
                      }),
                      Re((u) => {
                        let h = !1;
                        return F(u).pipe(
                          QM(
                            this.paramsInheritanceStrategy,
                            this.environmentInjector
                          ),
                          Se({
                            next: () => (h = !0),
                            complete: () => {
                              h ||
                                this.cancelNavigationTransition(
                                  u,
                                  "",
                                  ot.NoDataFromResolver
                                );
                            },
                          })
                        );
                      }),
                      Se((u) => {
                        let h = new Cd(
                          u.id,
                          this.urlSerializer.serialize(u.extractedUrl),
                          this.urlSerializer.serialize(u.urlAfterRedirects),
                          u.targetSnapshot
                        );
                        this.events.next(h);
                      })
                    );
                }),
                ud((l) => {
                  let u = (h) => {
                    let m = [];
                    h.routeConfig?.loadComponent &&
                      !h.routeConfig._loadedComponent &&
                      m.push(
                        this.configLoader.loadComponent(h.routeConfig).pipe(
                          Se((g) => {
                            h.component = g;
                          }),
                          V(() => {})
                        )
                      );
                    for (let g of h.children) m.push(...u(g));
                    return m;
                  };
                  return di(u(l.targetSnapshot.root)).pipe(dn(null), Gt(1));
                }),
                ud(() => this.afterPreactivation()),
                Re(() => {
                  let { currentSnapshot: l, targetSnapshot: u } = s,
                    h = this.createViewTransition?.(
                      this.environmentInjector,
                      l.root,
                      u.root
                    );
                  return h ? de(h).pipe(V(() => s)) : F(s);
                }),
                V((l) => {
                  let u = lM(
                    n.routeReuseStrategy,
                    l.targetSnapshot,
                    l.currentRouterState
                  );
                  return (
                    (this.currentTransition = s =
                      q(D({}, l), { targetRouterState: u })),
                    (this.currentNavigation.targetRouterState = u),
                    s
                  );
                }),
                Se(() => {
                  this.events.next(new oo());
                }),
                hM(
                  this.rootContexts,
                  n.routeReuseStrategy,
                  (l) => this.events.next(l),
                  this.inputBindingEnabled
                ),
                Gt(1),
                Se({
                  next: (l) => {
                    (a = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new Ut(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects)
                        )
                      ),
                      this.titleStrategy?.updateTitle(
                        l.targetRouterState.snapshot
                      ),
                      l.resolve(!0);
                  },
                  complete: () => {
                    a = !0;
                  },
                }),
                Fc(
                  this.transitionAbortSubject.pipe(
                    Se((l) => {
                      throw l;
                    })
                  )
                ),
                fn(() => {
                  !a &&
                    !c &&
                    this.cancelNavigationTransition(
                      s,
                      "",
                      ot.SupersededByNewNavigation
                    ),
                    this.currentTransition?.id === s.id &&
                      ((this.currentNavigation = null),
                      (this.currentTransition = null));
                }),
                un((l) => {
                  if (((c = !0), jv(l)))
                    this.events.next(
                      new an(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        l.message,
                        l.cancellationCode
                      )
                    ),
                      fM(l)
                        ? this.events.next(
                            new ni(l.url, l.navigationBehaviorOptions)
                          )
                        : s.resolve(!1);
                  else {
                    let u = new io(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      l,
                      s.targetSnapshot ?? void 0
                    );
                    try {
                      let h = nt(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(u)
                      );
                      if (h instanceof ao) {
                        let { message: m, cancellationCode: g } = rc(
                          this.urlSerializer,
                          h
                        );
                        this.events.next(
                          new an(
                            s.id,
                            this.urlSerializer.serialize(s.extractedUrl),
                            m,
                            g
                          )
                        ),
                          this.events.next(
                            new ni(h.redirectTo, h.navigationBehaviorOptions)
                          );
                      } else {
                        this.events.next(u);
                        let m = n.errorHandler(l);
                        s.resolve(!!m);
                      }
                    } catch (h) {
                      this.options.resolveNavigationPromiseOnError
                        ? s.resolve(!1)
                        : s.reject(h);
                    }
                  }
                  return Xe;
                })
              );
            })
          )
        );
      }
      cancelNavigationTransition(n, i, o) {
        let s = new an(
          n.id,
          this.urlSerializer.serialize(n.extractedUrl),
          i,
          o
        );
        this.events.next(s), n.resolve(!1);
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let n = this.urlHandlingStrategy.extract(
            this.urlSerializer.parse(this.location.path(!0))
          ),
          i =
            this.currentNavigation?.targetBrowserUrl ??
            this.currentNavigation?.extractedUrl;
        return (
          n.toString() !== i?.toString() &&
          !this.currentNavigation?.extras.skipLocationChange
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function cx(t) {
  return t !== to;
}
var lx = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => C(ux), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  kd = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig;
    }
  },
  ux = (() => {
    let e = class e extends kd {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Dt(e)))(o || e);
      };
    })()),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Zv = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: () => C(dx), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  dx = (() => {
    let e = class e extends Zv {
      constructor() {
        super(...arguments),
          (this.location = C(Hr)),
          (this.urlSerializer = C(fo)),
          (this.options = C(mo, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = C($d)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new cn()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Pv(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && n(i.url, i.state);
        });
      }
      handleRouterEvent(n, i) {
        if (n instanceof ti) this.stateMemento = this.createStateMemento();
        else if (n instanceof Nn) this.rawUrlTree = i.initialUrl;
        else if (n instanceof Ka) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(i.targetBrowserUrl ?? o, i);
          }
        } else
          n instanceof oo
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                !i.extras.skipLocationChange &&
                this.setBrowserUrl(i.targetBrowserUrl ?? this.rawUrlTree, i))
            : n instanceof an &&
              (n.code === ot.GuardRejected || n.code === ot.NoDataFromResolver)
            ? this.restoreHistory(i)
            : n instanceof io
            ? this.restoreHistory(i, !0)
            : n instanceof Ut &&
              ((this.lastSuccessfulId = n.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, i) {
        let o = n instanceof cn ? this.urlSerializer.serialize(n) : n;
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = D(D({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, "", a);
        } else {
          let s = D(
            D({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(o, "", s);
        }
      }
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: i }
          : { navigationId: n };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Dt(e)))(o || e);
      };
    })()),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Xi = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(Xi || {});
function Yv(t, e) {
  t.events
    .pipe(
      We(
        (r) =>
          r instanceof Ut ||
          r instanceof an ||
          r instanceof io ||
          r instanceof Nn
      ),
      V((r) =>
        r instanceof Ut || r instanceof Nn
          ? Xi.COMPLETE
          : (
              r instanceof an
                ? r.code === ot.Redirect ||
                  r.code === ot.SupersededByNewNavigation
                : !1
            )
          ? Xi.REDIRECTING
          : Xi.FAILED
      ),
      We((r) => r !== Xi.REDIRECTING),
      Gt(1)
    )
    .subscribe(() => {
      e();
    });
}
function fx(t) {
  throw t;
}
var hx = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  px = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  ue = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.console = C(sa)),
          (this.stateManager = C(Zv)),
          (this.options = C(mo, { optional: !0 }) || {}),
          (this.pendingTasks = C(Kt)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = C(Hd)),
          (this.urlSerializer = C(fo)),
          (this.location = C(Hr)),
          (this.urlHandlingStrategy = C($d)),
          (this._events = new xe()),
          (this.errorHandler = this.options.errorHandler || fx),
          (this.navigated = !1),
          (this.routeReuseStrategy = C(lx)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = C(oc, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!C(ac, { optional: !0 })),
          (this.eventsSubscription = new pe()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof an &&
                  i.code !== ot.Redirect &&
                  i.code !== ot.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof Ut) this.navigated = !0;
              else if (i instanceof ni) {
                let a = i.navigationBehaviorOptions,
                  c = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  l = D(
                    {
                      browserUrl: o.extras.browserUrl,
                      info: o.extras.info,
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        o.extras.replaceUrl ||
                        this.urlUpdateStrategy === "eager" ||
                        cx(o.source),
                    },
                    a
                  );
                this.scheduleNavigation(c, to, null, l, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            mx(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              to,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", i);
              }, 0);
            }
          );
      }
      navigateToSyncWithBrowser(n, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let l = D({}, o);
          delete l.navigationId,
            delete l.ɵrouterPageId,
            Object.keys(l).length !== 0 && (s.state = l);
        }
        let c = this.parseUrl(n);
        this.scheduleNavigation(c, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(Ud)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: l,
          } = i,
          u = l ? this.currentUrlTree.fragment : a,
          h = null;
        switch (c) {
          case "merge":
            h = D(D({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            h = this.currentUrlTree.queryParams;
            break;
          default:
            h = s || null;
        }
        h !== null && (h = this.removeEmptyProps(h));
        let m;
        try {
          let g = o ? o.snapshot : this.routerState.snapshot.root;
          m = Av(g);
        } catch {
          (typeof n[0] != "string" || n[0][0] !== "/") && (n = []),
            (m = this.currentUrlTree.root);
        }
        return Nv(m, n, h, u ?? null);
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let o = ir(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, to, null, i);
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return gx(n), this.navigateByUrl(this.createUrlTree(n, i), i);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, i) {
        let o;
        if (
          (i === !0 ? (o = D({}, hx)) : i === !1 ? (o = D({}, px)) : (o = i),
          ir(n))
        )
          return uv(this.currentUrlTree, n, o);
        let s = this.parseUrl(n);
        return uv(this.currentUrlTree, s, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {}
        );
      }
      scheduleNavigation(n, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, l, u;
        a
          ? ((c = a.resolve), (l = a.reject), (u = a.promise))
          : (u = new Promise((m, g) => {
              (c = m), (l = g);
            }));
        let h = this.pendingTasks.add();
        return (
          Yv(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(h));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: c,
            reject: l,
            promise: u,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          u.catch((m) => Promise.reject(m))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function gx(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new A(4008, !1);
}
function mx(t) {
  return !(t instanceof oo) && !(t instanceof ni);
}
var oi = (() => {
  let e = class e {
    constructor(n, i, o, s, a, c) {
      (this.router = n),
        (this.route = i),
        (this.tabIndexAttribute = o),
        (this.renderer = s),
        (this.el = a),
        (this.locationStrategy = c),
        (this.href = null),
        (this.onChanges = new xe()),
        (this.preserveFragment = !1),
        (this.skipLocationChange = !1),
        (this.replaceUrl = !1),
        (this.routerLinkInput = null);
      let l = a.nativeElement.tagName?.toLowerCase();
      (this.isAnchorElement = l === "a" || l === "area"),
        this.isAnchorElement
          ? (this.subscription = n.events.subscribe((u) => {
              u instanceof Ut && this.updateHref();
            }))
          : this.setTabIndexIfNotOnNativeEl("0");
    }
    setTabIndexIfNotOnNativeEl(n) {
      this.tabIndexAttribute != null ||
        this.isAnchorElement ||
        this.applyAttributeValue("tabindex", n);
    }
    ngOnChanges(n) {
      this.isAnchorElement && this.updateHref(), this.onChanges.next(this);
    }
    set routerLink(n) {
      n == null
        ? ((this.routerLinkInput = null), this.setTabIndexIfNotOnNativeEl(null))
        : (ir(n)
            ? (this.routerLinkInput = n)
            : (this.routerLinkInput = Array.isArray(n) ? n : [n]),
          this.setTabIndexIfNotOnNativeEl("0"));
    }
    onClick(n, i, o, s, a) {
      let c = this.urlTree;
      if (
        c === null ||
        (this.isAnchorElement &&
          (n !== 0 ||
            i ||
            o ||
            s ||
            a ||
            (typeof this.target == "string" && this.target != "_self")))
      )
        return !0;
      let l = {
        skipLocationChange: this.skipLocationChange,
        replaceUrl: this.replaceUrl,
        state: this.state,
        info: this.info,
      };
      return this.router.navigateByUrl(c, l), !this.isAnchorElement;
    }
    ngOnDestroy() {
      this.subscription?.unsubscribe();
    }
    updateHref() {
      let n = this.urlTree;
      this.href =
        n !== null && this.locationStrategy
          ? this.locationStrategy?.prepareExternalUrl(
              this.router.serializeUrl(n)
            )
          : null;
      let i =
        this.href === null
          ? null
          : Up(this.href, this.el.nativeElement.tagName.toLowerCase(), "href");
      this.applyAttributeValue("href", i);
    }
    applyAttributeValue(n, i) {
      let o = this.renderer,
        s = this.el.nativeElement;
      i !== null ? o.setAttribute(s, n, i) : o.removeAttribute(s, n);
    }
    get urlTree() {
      return this.routerLinkInput === null
        ? null
        : ir(this.routerLinkInput)
        ? this.routerLinkInput
        : this.router.createUrlTree(this.routerLinkInput, {
            relativeTo:
              this.relativeTo !== void 0 ? this.relativeTo : this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: this.preserveFragment,
          });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(ue), E(or), Yl("tabindex"), E(Ft), E(_t), E(nn));
  }),
    (e.ɵdir = fe({
      type: e,
      selectors: [["", "routerLink", ""]],
      hostVars: 1,
      hostBindings: function (i, o) {
        i & 1 &&
          S("click", function (a) {
            return o.onClick(
              a.button,
              a.ctrlKey,
              a.shiftKey,
              a.altKey,
              a.metaKey
            );
          }),
          i & 2 && Jn("target", o.target);
      },
      inputs: {
        target: "target",
        queryParams: "queryParams",
        fragment: "fragment",
        queryParamsHandling: "queryParamsHandling",
        state: "state",
        info: "info",
        relativeTo: "relativeTo",
        preserveFragment: [2, "preserveFragment", "preserveFragment", bn],
        skipLocationChange: [2, "skipLocationChange", "skipLocationChange", bn],
        replaceUrl: [2, "replaceUrl", "replaceUrl", bn],
        routerLink: "routerLink",
      },
      standalone: !0,
      features: [mu, Dn],
    }));
  let t = e;
  return t;
})();
var sc = class {};
var vx = (() => {
    let e = class e {
      constructor(n, i, o, s, a) {
        (this.router = n),
          (this.injector = o),
          (this.preloadingStrategy = s),
          (this.loader = a);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            We((n) => n instanceof Ut),
            zt(() => this.preload())
          )
          .subscribe(() => {});
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config);
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
      }
      processRoutes(n, i) {
        let o = [];
        for (let s of i) {
          s.providers &&
            !s._injector &&
            (s._injector = ra(s.providers, n, `Route: ${s.path}`));
          let a = s._injector ?? n,
            c = s._loadedInjector ?? a;
          ((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            o.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              o.push(this.processRoutes(c, s.children ?? s._loadedRoutes));
        }
        return de(o).pipe(vr());
      }
      preloadConfig(n, i) {
        return this.preloadingStrategy.preload(i, () => {
          let o;
          i.loadChildren && i.canLoad === void 0
            ? (o = this.loader.loadChildren(n, i))
            : (o = F(null));
          let s = o.pipe(
            we((a) =>
              a === null
                ? F(void 0)
                : ((i._loadedRoutes = a.routes),
                  (i._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? n, a.routes))
            )
          );
          if (i.loadComponent && !i._loadedComponent) {
            let a = this.loader.loadComponent(i);
            return de([s, a]).pipe(vr());
          } else return s;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(ue), T(da), T(Be), T(sc), T(Bd));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Qv = new x(""),
  yx = (() => {
    let e = class e {
      constructor(n, i, o, s, a = {}) {
        (this.urlSerializer = n),
          (this.transitions = i),
          (this.viewportScroller = o),
          (this.zone = s),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = "imperative"),
          (this.restoredId = 0),
          (this.store = {}),
          (a.scrollPositionRestoration ||= "disabled"),
          (a.anchorScrolling ||= "disabled");
      }
      init() {
        this.options.scrollPositionRestoration !== "disabled" &&
          this.viewportScroller.setHistoryScrollRestoration("manual"),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents());
      }
      createScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof ti
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = n.navigationTrigger),
              (this.restoredId = n.restoredState
                ? n.restoredState.navigationId
                : 0))
            : n instanceof Ut
            ? ((this.lastId = n.id),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.urlAfterRedirects).fragment
              ))
            : n instanceof Nn &&
              n.code === Qa.IgnoredSameUrlNavigation &&
              ((this.lastSource = void 0),
              (this.restoredId = 0),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.url).fragment
              ));
        });
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof Ja &&
            (n.position
              ? this.options.scrollPositionRestoration === "top"
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === "enabled" &&
                  this.viewportScroller.scrollToPosition(n.position)
              : n.anchor && this.options.anchorScrolling === "enabled"
              ? this.viewportScroller.scrollToAnchor(n.anchor)
              : this.options.scrollPositionRestoration !== "disabled" &&
                this.viewportScroller.scrollToPosition([0, 0]));
        });
      }
      scheduleScrollEvent(n, i) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.transitions.events.next(
                new Ja(
                  n,
                  this.lastSource === "popstate"
                    ? this.store[this.restoredId]
                    : null,
                  i
                )
              );
            });
          }, 0);
        });
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      eg();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Cx(t) {
  return t.routerState.root;
}
function vo(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function wx() {
  let t = C(tt);
  return (e) => {
    let r = t.get(En);
    if (e !== r.components[0]) return;
    let n = t.get(ue),
      i = t.get(Kv);
    t.get(zd) === 1 && n.initialNavigation(),
      t.get(Jv, null, U.Optional)?.setUpPreloading(),
      t.get(Qv, null, U.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var Kv = new x("", { factory: () => new xe() }),
  zd = new x("", { providedIn: "root", factory: () => 1 });
function Dx() {
  return vo(2, [
    { provide: zd, useValue: 0 },
    {
      provide: la,
      multi: !0,
      deps: [tt],
      useFactory: (e) => {
        let r = e.get(em, Promise.resolve());
        return () =>
          r.then(
            () =>
              new Promise((n) => {
                let i = e.get(ue),
                  o = e.get(Kv);
                Yv(i, () => {
                  n(!0);
                }),
                  (e.get(Hd).afterPreactivation = () => (
                    n(!0), o.closed ? F(void 0) : o
                  )),
                  i.initialNavigation();
              })
          );
      },
    },
  ]);
}
function _x() {
  return vo(3, [
    {
      provide: la,
      multi: !0,
      useFactory: () => {
        let e = C(ue);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: zd, useValue: 2 },
  ]);
}
var Jv = new x("");
function Ex(t) {
  return vo(0, [
    { provide: Jv, useExisting: vx },
    { provide: sc, useExisting: t },
  ]);
}
function bx() {
  return vo(8, [pv, { provide: ac, useExisting: pv }]);
}
function Ix(t) {
  let e = [
    { provide: Wv, useValue: ox },
    {
      provide: qv,
      useValue: D({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return vo(9, e);
}
var yv = new x("ROUTER_FORROOT_GUARD"),
  Mx = [
    Hr,
    { provide: fo, useClass: ei },
    ue,
    po,
    { provide: or, useFactory: Cx, deps: [ue] },
    Bd,
    [],
  ],
  Gd = (() => {
    let e = class e {
      constructor(n) {}
      static forRoot(n, i) {
        return {
          ngModule: e,
          providers: [
            Mx,
            [],
            { provide: oc, multi: !0, useValue: n },
            { provide: yv, useFactory: Ax, deps: [[ue, new ks(), new kl()]] },
            { provide: mo, useValue: i || {} },
            i?.useHash ? Sx() : Tx(),
            xx(),
            i?.preloadingStrategy ? Ex(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? Nx(i) : [],
            i?.bindToComponentInputs ? bx().ɵproviders : [],
            i?.enableViewTransitions ? Ix().ɵproviders : [],
            Rx(),
          ],
        };
      }
      static forChild(n) {
        return {
          ngModule: e,
          providers: [{ provide: oc, multi: !0, useValue: n }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(T(yv, 8));
    }),
      (e.ɵmod = Pe({ type: e })),
      (e.ɵinj = Oe({}));
    let t = e;
    return t;
  })();
function xx() {
  return {
    provide: Qv,
    useFactory: () => {
      let t = C(um),
        e = C(re),
        r = C(mo),
        n = C(Hd),
        i = C(fo);
      return (
        r.scrollOffset && t.setOffset(r.scrollOffset), new yx(i, n, t, e, r)
      );
    },
  };
}
function Sx() {
  return { provide: nn, useClass: nm };
}
function Tx() {
  return { provide: nn, useClass: Vu };
}
function Ax(t) {
  return "guarded";
}
function Nx(t) {
  return [
    t.initialNavigation === "disabled" ? _x().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? Dx().ɵproviders : [],
  ];
}
var Cv = new x("");
function Rx() {
  return [
    { provide: Cv, useFactory: wx },
    { provide: ua, multi: !0, useExisting: Cv },
  ];
}
var lc = (() => {
  let e = class e {
    constructor(n) {
      this.router = n;
    }
    canActivate() {
      return localStorage.getItem("currentUser")
        ? !0
        : (this.router.navigate(["/login"]), !1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(T(ue));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var Ke = (() => {
  let e = class e {
    constructor(n) {
      (this.http = n), (this.apiUrl = "http://localhost:4000/api/users");
    }
    login(n, i) {
      return this.http.post(`${this.apiUrl}/userLogin`, {
        username: n,
        password: i,
      });
    }
    adminLogin(n, i) {
      return this.http.post(`${this.apiUrl}/adminLogin`, {
        username: n,
        password: i,
      });
    }
    getUserByIdGet(n) {
      return this.http.get(`${this.apiUrl}/${n}`);
    }
    getUserByIdPost(n) {
      return this.http.post(`${this.apiUrl}/getUserByIdPost`, { id: n });
    }
    getUserByUsername(n) {
      return this.http.get(`${this.apiUrl}/:${n}`);
    }
    registerUser(n) {
      return this.http.post(`${this.apiUrl}/register`, n);
    }
    addUserByAdmin(n) {
      return this.http.post(`${this.apiUrl}/addUserByAdmin`, n);
    }
    changePassword(n, i, o) {
      return this.http.patch(`${this.apiUrl}/changePassword`, {
        username: n,
        oldPassword: i,
        newPassword: o,
      });
    }
    verifyPassword(n, i) {
      return this.http.post(`${this.apiUrl}/verifyPassword`, {
        username: n,
        password: i,
      });
    }
    activateUser(n) {
      return this.http.patch(`${this.apiUrl}/activateUser`, { username: n });
    }
    deactivateUser(n) {
      return this.http.patch(`${this.apiUrl}/deactivateUser`, { username: n });
    }
    deleteUser(n) {
      return this.http.delete(`${this.apiUrl}/deleteUser`, {
        body: { username: n },
      });
    }
    checkUsername(n) {
      return this.http.post(`${this.apiUrl}/checkUsername`, { username: n });
    }
    checkEmail(n) {
      return this.http.post(`${this.apiUrl}/checkEmail`, { email: n });
    }
    uploadProfilePicture(n) {
      return this.http.post(`${this.apiUrl}/uploadProfilePicture`, n);
    }
    getProfilePicture(n) {
      return this.http.get(`${this.apiUrl}/profile-picture/${n}`, {
        responseType: "blob",
      });
    }
    toggleFavouriteRecipe(n, i) {
      return this.http.post(`${this.apiUrl}/toggle-favourite`, {
        userId: n,
        recipeId: i,
      });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(T(ki));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var On = (() => {
  let e = class e {
    constructor(n) {
      (this.http = n), (this.apiUrl = "http://localhost:4000/api/recipes");
    }
    addRecipe(n) {
      return this.http.post(`${this.apiUrl}/add`, n);
    }
    getAllRecipes() {
      return this.http.get(`${this.apiUrl}/all`);
    }
    sortRecipes(n, i) {
      let o = new Vt().set("sortBy", n).set("order", i);
      return this.http.get(`${this.apiUrl}/sort`, { params: o });
    }
    getRecipeById(n) {
      return this.http.get(`${this.apiUrl}/recipe/${n}`);
    }
    addCommentAndRating(n) {
      return this.http.post(`${this.apiUrl}/recipe/comment`, n);
    }
    updateCommentAndRating(n) {
      return this.http.put(`${this.apiUrl}/recipe/edit-comment`, n);
    }
    deleteComment(n, i) {
      let o = { recipeId: n, commentId: i };
      return this.http.delete(`${this.apiUrl}/recipe-delete-comment`, {
        body: o,
      });
    }
    searchRecipes(n) {
      return (
        console.log(n),
        this.http.get(`${this.apiUrl}/search?term=${encodeURIComponent(n)}`)
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(T(ki));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var dc = (() => {
  let e = class e {
    constructor() {
      this.searchTermSubject = new Ie("");
    }
    setSearchTerm(n) {
      this.searchTermSubject.next(n);
    }
    getSearchTerm() {
      return this.searchTermSubject.asObservable();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Ox(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div")(1, "input", 6),
      W("ngModelChange", function (i) {
        I(r);
        let o = y(2);
        return Z(o.searchTerm, i) || (o.searchTerm = i), M(i);
      }),
      S("input", function () {
        I(r);
        let i = y(2);
        return M(i.onSearchChange(i.searchTerm));
      }),
      d()();
  }
  if (t & 2) {
    let r = y(2);
    v(), G("ngModel", r.searchTerm);
  }
}
function Px(t, e) {
  if ((t & 1 && (f(0, "div"), P(1, Ox, 2, 1, "div", 4), d()), t & 2)) {
    let r = y();
    v(), _("ngIf", r.isHomeRoute());
  }
}
function Fx(t, e) {
  t & 1 && (f(0, "div", 7), ge(1, "div", 8), d());
}
function kx(t, e) {
  t & 1 && (f(0, "li")(1, "a", 11), p(2, "Login"), d()());
}
function Lx(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "li")(1, "a", 2),
      S("click", function () {
        I(r);
        let i = y(3);
        return M(i.logout());
      }),
      p(2, "Logout"),
      d()();
  }
}
function Vx(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div")(1, "ul", 9)(2, "li")(3, "a", 2),
      S("click", function () {
        I(r);
        let i = y(2);
        return M(i.goHome());
      }),
      p(4, "Home"),
      d()(),
      f(5, "li")(6, "a", 10),
      p(7, "Top 9"),
      d()(),
      P(8, kx, 3, 0, "li", 4)(9, Lx, 3, 0, "li", 4),
      d()();
  }
  if (t & 2) {
    let r = y(2);
    v(8),
      _("ngIf", !r.isLoggedIn() && !r.isLoginRoute()),
      v(),
      _("ngIf", r.isLoggedIn());
  }
}
function jx(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "li")(1, "a", 2),
      S("click", function () {
        I(r);
        let i = y(4);
        return M(i.logout());
      }),
      p(2, "Logout"),
      d()();
  }
}
function Ux(t, e) {
  if (
    (t & 1 &&
      (f(0, "li")(1, "a"),
      p(2, "More"),
      d(),
      f(3, "ul", 13)(4, "li")(5, "a", 16),
      p(6, "Profile"),
      d()(),
      P(7, jx, 3, 0, "li", 4),
      d()()),
    t & 2)
  ) {
    let r = y(3);
    v(7), _("ngIf", r.isLoggedIn());
  }
}
function Bx(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "li")(1, "a", 2),
      S("click", function () {
        I(r);
        let i = y(3);
        return M(i.logout());
      }),
      p(2, "Logout"),
      d()();
  }
}
function $x(t, e) {
  if (
    (t & 1 &&
      (f(0, "div")(1, "ul", 9)(2, "li")(3, "a", 12),
      p(4, "Home"),
      d()(),
      f(5, "li")(6, "a", 10),
      p(7, "Top 9"),
      d()(),
      f(8, "li")(9, "a"),
      p(10, "Recipes"),
      d(),
      f(11, "ul", 13)(12, "li")(13, "a", 14),
      p(14, "Favourites"),
      d()()()(),
      f(15, "li")(16, "a", 15),
      p(17, "Become a Chef"),
      d()(),
      P(18, Ux, 8, 1, "li", 4)(19, Bx, 3, 0, "li", 4),
      d()()),
    t & 2)
  ) {
    let r = y(2);
    v(18), _("ngIf", !r.isProfileRoute()), v(), _("ngIf", r.isProfileRoute());
  }
}
function Hx(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "li")(1, "a", 2),
      S("click", function () {
        I(r);
        let i = y(4);
        return M(i.logout());
      }),
      p(2, "Logout"),
      d()();
  }
}
function zx(t, e) {
  if (
    (t & 1 &&
      (f(0, "li")(1, "a"),
      p(2, "More"),
      d(),
      f(3, "ul", 13)(4, "li")(5, "a", 16),
      p(6, "Profile"),
      d()(),
      P(7, Hx, 3, 0, "li", 4),
      d()()),
    t & 2)
  ) {
    let r = y(3);
    v(7), _("ngIf", r.isLoggedIn());
  }
}
function Gx(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "li")(1, "a", 2),
      S("click", function () {
        I(r);
        let i = y(3);
        return M(i.logout());
      }),
      p(2, "Logout"),
      d()();
  }
}
function Wx(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div")(1, "ul", 9)(2, "li")(3, "a", 2),
      S("click", function () {
        I(r);
        let i = y(2);
        return M(i.goHome());
      }),
      p(4, "Home"),
      d()(),
      f(5, "li")(6, "a", 10),
      p(7, "Top 9"),
      d()(),
      f(8, "li")(9, "a"),
      p(10, "Recipes"),
      d(),
      f(11, "ul", 13)(12, "li")(13, "a", 17),
      p(14, "My Recipes"),
      d()(),
      f(15, "li")(16, "a", 18),
      p(17, "Add Recipe"),
      d()(),
      f(18, "li")(19, "a", 14),
      p(20, "Favourites"),
      d()()()(),
      f(21, "li")(22, "a", 19),
      p(23, "Candidates"),
      d()(),
      P(24, zx, 8, 1, "li", 4)(25, Gx, 3, 0, "li", 4),
      d()();
  }
  if (t & 2) {
    let r = y(2);
    v(24), _("ngIf", !r.isProfileRoute()), v(), _("ngIf", r.isProfileRoute());
  }
}
function qx(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "li")(1, "a", 2),
      S("click", function () {
        I(r);
        let i = y(4);
        return M(i.logout());
      }),
      p(2, "Logout"),
      d()();
  }
}
function Zx(t, e) {
  if (
    (t & 1 &&
      (f(0, "li")(1, "a"),
      p(2, "More"),
      d(),
      f(3, "ul", 13)(4, "li")(5, "a", 16),
      p(6, "Profile"),
      d()(),
      P(7, qx, 3, 0, "li", 4),
      d()()),
    t & 2)
  ) {
    let r = y(3);
    v(7), _("ngIf", r.isLoggedIn());
  }
}
function Yx(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "li")(1, "a", 2),
      S("click", function () {
        I(r);
        let i = y(3);
        return M(i.logout());
      }),
      p(2, "Logout"),
      d()();
  }
}
function Qx(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div")(1, "ul", 9)(2, "li")(3, "a", 2),
      S("click", function () {
        I(r);
        let i = y(2);
        return M(i.goHome());
      }),
      p(4, "Home"),
      d()(),
      f(5, "li")(6, "a", 10),
      p(7, "Top 9"),
      d()(),
      f(8, "li")(9, "a", 20),
      p(10, "Dashboard"),
      d()(),
      P(11, Zx, 8, 1, "li", 4)(12, Yx, 3, 0, "li", 4),
      d()();
  }
  if (t & 2) {
    let r = y(2);
    v(11), _("ngIf", !r.isProfileRoute()), v(), _("ngIf", r.isProfileRoute());
  }
}
function Kx(t, e) {
  if (
    (t & 1 &&
      (f(0, "div"),
      P(1, Vx, 10, 2, "div", 4)(2, $x, 20, 2, "div", 4)(3, Wx, 26, 2, "div", 4)(
        4,
        Qx,
        13,
        2,
        "div",
        4
      ),
      d()),
    t & 2)
  ) {
    let r = y();
    v(),
      _("ngIf", r.isGuess()),
      v(),
      _("ngIf", r.isUser()),
      v(),
      _("ngIf", r.isChef()),
      v(),
      _("ngIf", r.isAdmin());
  }
}
var ey = (() => {
  let e = class e {
    constructor(n, i, o) {
      (this.router = n),
        (this.recipeService = i),
        (this.searchService = o),
        (this.role = "guest"),
        (this.userId = null),
        (this.isLoading = !0),
        (this.searchTerm = "");
    }
    ngOnInit() {
      setTimeout(() => {
        this.loadUserRole(), (this.isLoading = !1);
      }, 300);
    }
    loadUserRole() {
      let n = localStorage.getItem("currentUser");
      if (n) {
        let i = JSON.parse(n);
        (this.role = i.role), (this.userId = i._id);
      } else this.role = "guest";
    }
    isLoggedIn() {
      return localStorage.getItem("currentUser") !== null;
    }
    isHomeRoute() {
      return this.router.url === "/";
    }
    onSearchChange(n) {
      (this.searchTerm = n), this.searchService.setSearchTerm(this.searchTerm);
    }
    isLoginRoute() {
      return this.router.url === "/login";
    }
    isProfileRoute() {
      return this.router.url === "/profile";
    }
    isAdminLoginRoute() {
      return this.router.url === "/admin-login";
    }
    logout() {
      localStorage.removeItem("currentUser"),
        (this.role = "guest"),
        (this.userId = null),
        this.router.navigate(["/"]).then(() => {
          location.reload();
        });
    }
    isGuess() {
      return this.role === "guest";
    }
    isUser() {
      return this.role === "user";
    }
    isChef() {
      return this.role === "chef";
    }
    isAdmin() {
      return this.role === "admin";
    }
    goHome() {
      this.router.navigate(["/"]).then(() => {
        location.reload();
      });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(ue), E(On), E(dc));
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-header"]],
      decls: 8,
      vars: 3,
      consts: [
        [1, "navbar"],
        [1, "logo"],
        [3, "click"],
        ["src", "assets/logo_circle.png", "alt", "logo"],
        [4, "ngIf"],
        ["class", "loading-indicator", 4, "ngIf"],
        [
          "type",
          "text",
          "placeholder",
          "Search for recipes...",
          1,
          "search-bar",
          3,
          "ngModelChange",
          "input",
          "ngModel",
        ],
        [1, "loading-indicator"],
        [1, "spinner"],
        [1, "nav-links"],
        ["routerLink", "/top-9-recipes"],
        ["routerLink", "/login"],
        ["routerLink", "/"],
        [1, "sub-links"],
        ["routerLink", "/favourites"],
        ["routerLink", "/become-a-chef"],
        ["routerLink", "/profile"],
        ["routerLink", "/my-recipes"],
        ["routerLink", "/recipe-add"],
        ["routerLink", "/candidates"],
        ["routerLink", "/admin-dashboard"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "header")(1, "nav", 0)(2, "div", 1)(3, "a", 2),
          S("click", function () {
            return o.goHome();
          }),
          ge(4, "img", 3),
          d()(),
          P(5, Px, 2, 1, "div", 4)(6, Fx, 2, 0, "div", 5)(
            7,
            Kx,
            5,
            4,
            "div",
            4
          ),
          d()()),
          i & 2 &&
            (v(5),
            _("ngIf", !o.isLoading && !o.isAdminLoginRoute()),
            v(),
            _("ngIf", o.isLoading),
            v(),
            _("ngIf", !o.isLoading && !o.isAdminLoginRoute()));
      },
      dependencies: [ke, oi, Le, Qe, ze],
      styles: [
        "header[_ngcontent-%COMP%]{font-size:1rem;background-color:#bb9c7f;color:#fff;padding-left:15px;position:fixed;top:0;left:0;width:100%;height:8%;min-height:73px;z-index:1000;border:2px solid #ffdd57}.navbar[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.logo[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#ffdd57;font-size:1.5em;text-decoration:none;display:inline-block;line-height:73px}.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100px;height:auto;display:block}.nav-links[_ngcontent-%COMP%]{list-style-type:none;margin-right:25px;padding:0;display:flex;gap:20px}.nav-links[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{position:relative;display:inline-block;border:2px solid #ffdd57;border-radius:5px;padding:5px 10px}.nav-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#fff;text-decoration:none;font-size:1.5em;white-space:nowrap;transition:color .3s ease}.nav-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#ffdd57;border-color:#ffdd57}.loading-indicator[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;background-color:#fffc;z-index:1001}.loading-indicator[_ngcontent-%COMP%]   .spinner[_ngcontent-%COMP%]{border:8px solid #f3f3f3;border-top:8px solid #bb9c7f;border-radius:50%;width:60px;height:60px;animation:_ngcontent-%COMP%_spin 1s linear infinite}@keyframes _ngcontent-%COMP%_spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.sub-links[_ngcontent-%COMP%]{font-size:.8rem;display:none;position:absolute;top:100%;right:0;text-align:right;background-color:#ff7bffbf;padding:10px;border-radius:5px;list-style-type:none;box-shadow:0 8px 16px #0003;z-index:1000}.nav-links[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover   .sub-links[_ngcontent-%COMP%]{display:block}.sub-links[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin:5px 0;padding:5px;text-align:left}.sub-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#fff;text-decoration:none;display:block;padding:5px 10px;border-radius:3px}.sub-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#ffdd57;background-color:#0056b3}.search-bar[_ngcontent-%COMP%]{padding:8px;font-size:1rem;border-radius:4px;border:1px solid #ffdd57;width:300px;margin-left:20px}.search-bar[_ngcontent-%COMP%]:focus{outline:none;border-color:#ffdd57;box-shadow:0 0 5px #ffdd57cc}",
      ],
    }));
  let t = e;
  return t;
})();
var ty = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-footer"]],
      decls: 6,
      vars: 0,
      template: function (i, o) {
        i & 1 &&
          (f(0, "footer")(1, "p"),
          p(2, "\xA9 2024 "),
          f(3, "strong"),
          p(4, "Be a Chef"),
          d(),
          p(5, ". All rights reserved."),
          d()());
      },
      styles: [
        "footer[_ngcontent-%COMP%]{position:fixed;left:0;bottom:0;width:100%;height:5%;min-height:18px;background-color:#bb9c7f;text-align:left;padding-left:15px;box-sizing:border-box;display:none;color:#ffdd57}footer.visible[_ngcontent-%COMP%]{display:block}",
      ],
    }));
  let t = e;
  return t;
})();
var ny = (() => {
  let e = class e {
    ngAfterViewInit() {
      this.checkFooterVisibility();
    }
    onWindowScroll() {
      this.checkFooterVisibility();
    }
    checkFooterVisibility() {
      let n = document.querySelector("footer");
      if (n) {
        let i = window.innerHeight,
          o = document.body.offsetHeight;
        o <= i || window.innerHeight + window.scrollY >= o
          ? n.classList.add("visible")
          : n.classList.remove("visible");
      }
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-root"]],
      hostBindings: function (i, o) {
        i & 1 &&
          S(
            "scroll",
            function () {
              return o.onWindowScroll();
            },
            !1,
            $p
          );
      },
      decls: 4,
      vars: 0,
      template: function (i, o) {
        i & 1 &&
          (ge(0, "app-header"),
          f(1, "main"),
          ge(2, "router-outlet"),
          d(),
          ge(3, "app-footer"));
      },
      dependencies: [Vd, ey, ty],
      styles: [
        "html[_ngcontent-%COMP%], body[_ngcontent-%COMP%]{margin:0;padding:0;height:100%;font-family:Arial,sans-serif}main[_ngcontent-%COMP%]{flex:1;padding-top:70px;padding-bottom:60px}",
      ],
    }));
  let t = e;
  return t;
})();
function eS(t, e) {
  if ((t & 1 && (f(0, "p", 10), p(1), d()), t & 2)) {
    let r = y();
    v(), Me(r.errorMessage);
  }
}
var ry = (() => {
  let e = class e {
    constructor(n, i) {
      (this.userService = n),
        (this.router = i),
        (this.username = ""),
        (this.password = ""),
        (this.errorMessage = "");
    }
    login() {
      this.userService.login(this.username, this.password).subscribe(
        (n) => {
          localStorage.setItem("currentUser", JSON.stringify(n)),
            this.router.navigate(["/"]).then(() => {
              location.reload();
            });
        },
        (n) => {
          console.error("Login failed", n),
            (this.errorMessage = "Invalid username or password");
        }
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(Ke), E(ue));
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-login"]],
      decls: 20,
      vars: 3,
      consts: [
        [1, "login-container"],
        [3, "ngSubmit"],
        ["for", "username"],
        [
          "type",
          "text",
          "id",
          "username",
          "name",
          "username",
          "required",
          "",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["for", "password"],
        [
          "type",
          "password",
          "id",
          "password",
          "name",
          "password",
          "required",
          "",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["type", "submit"],
        ["class", "error", 4, "ngIf"],
        [1, "register-link"],
        ["routerLink", "/register"],
        [1, "error"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "div", 0)(1, "h2"),
          p(2, "Login"),
          d(),
          f(3, "form", 1),
          S("ngSubmit", function () {
            return o.login();
          }),
          f(4, "div")(5, "label", 2),
          p(6, "Username"),
          d(),
          f(7, "input", 3),
          W("ngModelChange", function (a) {
            return Z(o.username, a) || (o.username = a), a;
          }),
          d()(),
          f(8, "div")(9, "label", 4),
          p(10, "Password"),
          d(),
          f(11, "input", 5),
          W("ngModelChange", function (a) {
            return Z(o.password, a) || (o.password = a), a;
          }),
          d()(),
          f(12, "button", 6),
          p(13, "Login"),
          d()(),
          P(14, eS, 2, 1, "p", 7),
          f(15, "p", 8),
          p(16, " If you are not registered, "),
          f(17, "a", 9),
          p(18, "sign up here"),
          d(),
          p(19, ". "),
          d()()),
          i & 2 &&
            (v(7),
            G("ngModel", o.username),
            v(4),
            G("ngModel", o.password),
            v(3),
            _("ngIf", o.errorMessage));
      },
      dependencies: [ke, oi, An, Le, Qe, Tn, sn, ze, on],
      styles: [
        ".login-container[_ngcontent-%COMP%]{max-width:400px;margin:0 auto;padding:1rem;border:1px solid #ccc;border-radius:5px;box-shadow:0 0 10px #0000001a}.login-container[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{text-align:center}.login-container[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{margin-bottom:1rem}.login-container[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:block;margin-bottom:.5rem}.login-container[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;padding:.5rem;box-sizing:border-box}.login-container[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:100%;padding:.5rem;background-color:#bb9c7f;color:#fff;border:none;border-radius:5px;cursor:pointer}.login-container[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#0056b3}.error[_ngcontent-%COMP%]{color:#cc1b00;text-align:center}.register-link[_ngcontent-%COMP%]{text-align:center;margin-top:1rem}.register-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#bb9c7f;text-decoration:none;font-weight:700}.register-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration:underline}",
      ],
    }));
  let t = e;
  return t;
})();
function tS(t, e) {
  if ((t & 1 && (f(0, "div", 10), p(1), d()), t & 2)) {
    let r = y();
    v(), he(" ", r.errorMessage, " ");
  }
}
var iy = (() => {
  let e = class e {
    constructor(n, i) {
      (this.userService = n),
        (this.router = i),
        (this.username = ""),
        (this.password = ""),
        (this.errorMessage = null);
    }
    login() {
      this.userService.adminLogin(this.username, this.password).subscribe(
        (n) => {
          localStorage.setItem("currentUser", JSON.stringify(n)),
            this.router.navigate(["/"]).then(() => {
              location.reload();
            });
        },
        (n) => {
          console.error("Admin login failed", n),
            (this.errorMessage = "Invalid username or password");
        }
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(Ke), E(ue));
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-admin-login"]],
      decls: 16,
      vars: 4,
      consts: [
        ["loginForm", "ngForm"],
        [1, "admin-login-container"],
        [3, "ngSubmit"],
        [1, "form-group"],
        ["for", "username"],
        [
          "type",
          "text",
          "id",
          "username",
          "name",
          "username",
          "required",
          "",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["for", "password"],
        [
          "type",
          "password",
          "id",
          "password",
          "name",
          "password",
          "required",
          "",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["type", "submit", 3, "disabled"],
        ["class", "error-message", 4, "ngIf"],
        [1, "error-message"],
      ],
      template: function (i, o) {
        if (i & 1) {
          let s = K();
          f(0, "div", 1)(1, "h2"),
            p(2, "Admin Login"),
            d(),
            f(3, "form", 2, 0),
            S("ngSubmit", function () {
              return I(s), M(o.login());
            }),
            f(5, "div", 3)(6, "label", 4),
            p(7, "Username"),
            d(),
            f(8, "input", 5),
            W("ngModelChange", function (c) {
              return I(s), Z(o.username, c) || (o.username = c), M(c);
            }),
            d()(),
            f(9, "div", 3)(10, "label", 6),
            p(11, "Password"),
            d(),
            f(12, "input", 7),
            W("ngModelChange", function (c) {
              return I(s), Z(o.password, c) || (o.password = c), M(c);
            }),
            d()(),
            f(13, "button", 8),
            p(14, "Login"),
            d()(),
            P(15, tS, 2, 1, "div", 9),
            d();
        }
        if (i & 2) {
          let s = oa(4);
          v(8),
            G("ngModel", o.username),
            v(4),
            G("ngModel", o.password),
            v(),
            _("disabled", !s.valid),
            v(2),
            _("ngIf", o.errorMessage);
        }
      },
      dependencies: [ke, An, Le, Qe, Tn, sn, ze, on],
      styles: [
        ".admin-login-container[_ngcontent-%COMP%]{max-width:400px;margin:50px auto;padding:20px;border:1px solid #ccc;border-radius:5px;background-color:#f9f9f9}h2[_ngcontent-%COMP%]{text-align:center;margin-bottom:20px}.form-group[_ngcontent-%COMP%]{margin-bottom:15px}label[_ngcontent-%COMP%]{display:block;margin-bottom:5px}input[_ngcontent-%COMP%]{width:100%;padding:8px;box-sizing:border-box;border:1px solid #ccc;border-radius:3px}button[_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#bb9c7f;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:16px}button[_ngcontent-%COMP%]:disabled{background-color:#ccc}.error-message[_ngcontent-%COMP%]{color:#cc1b00;text-align:center;margin-top:15px}",
      ],
    }));
  let t = e;
  return t;
})();
var nS = () => ["firstname", "lastname", "username", "email", "phone"];
function rS(t, e) {
  if ((t & 1 && ge(0, "img", 6), t & 2)) {
    let r = y(2);
    _("src", r.photoUrl, Kn);
  }
}
function iS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "p")(1, "strong"),
      p(2),
      Ti(3, "titlecase"),
      d(),
      p(4),
      f(5, "button", 7),
      S("click", function () {
        I(r);
        let i = y().$implicit,
          o = y(2);
        return M(o.startEdit(i));
      }),
      p(6, "Edit"),
      d()();
  }
  if (t & 2) {
    let r = y().$implicit,
      n = y(2);
    v(2), he("", Du(3, 2, r), ":"), v(2), he(" ", n.user[r], " ");
  }
}
function oS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div")(1, "label"),
      p(2),
      Ti(3, "titlecase"),
      d(),
      f(4, "input", 8),
      W("ngModelChange", function (i) {
        I(r);
        let o = y().$implicit,
          s = y(2);
        return Z(s.editValues[o], i) || (s.editValues[o] = i), M(i);
      }),
      d(),
      f(5, "label"),
      p(6, "Password to confirm:"),
      d(),
      f(7, "input", 9),
      W("ngModelChange", function (i) {
        I(r);
        let o = y(3);
        return Z(o.passwordForSave, i) || (o.passwordForSave = i), M(i);
      }),
      d(),
      f(8, "button", 7),
      S("click", function () {
        I(r);
        let i = y().$implicit,
          o = y(2);
        return M(o.saveEdit(i));
      }),
      p(9, "Save"),
      d(),
      f(10, "button", 7),
      S("click", function () {
        I(r);
        let i = y().$implicit,
          o = y(2);
        return M(o.cancelEdit(i));
      }),
      p(11, "Cancel"),
      d()();
  }
  if (t & 2) {
    let r = y().$implicit,
      n = y(2);
    v(2),
      he("", Du(3, 3, r), ":"),
      v(2),
      G("ngModel", n.editValues[r]),
      v(3),
      G("ngModel", n.passwordForSave);
  }
}
function sS(t, e) {
  if (
    (t & 1 &&
      (f(0, "div"), P(1, iS, 7, 4, "p", 5)(2, oS, 12, 5, "div", 5), d()),
    t & 2)
  ) {
    let r = e.$implicit,
      n = y(2);
    v(), _("ngIf", !n.isEditing[r]), v(), _("ngIf", n.isEditing[r]);
  }
}
function aS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div")(1, "h3"),
      p(2, "Change Password"),
      d(),
      f(3, "button", 7),
      S("click", function () {
        I(r);
        let i = y(2);
        return M(i.startPasswordChange());
      }),
      p(4, "Edit Password"),
      d()();
  }
}
function cS(t, e) {
  if ((t & 1 && (f(0, "div", 12), p(1), d()), t & 2)) {
    let r = y(3);
    v(), Me(r.passwordError);
  }
}
function lS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div")(1, "label"),
      p(2, "Current Password:"),
      d(),
      f(3, "input", 9),
      W("ngModelChange", function (i) {
        I(r);
        let o = y(2);
        return Z(o.oldPassword, i) || (o.oldPassword = i), M(i);
      }),
      d(),
      f(4, "label"),
      p(5, "New Password:"),
      d(),
      f(6, "input", 10),
      W("ngModelChange", function (i) {
        I(r);
        let o = y(2);
        return Z(o.newPassword, i) || (o.newPassword = i), M(i);
      }),
      S("input", function () {
        I(r);
        let i = y(2);
        return M(i.validateNewPassword());
      }),
      d(),
      f(7, "label"),
      p(8, "Confirm New Password:"),
      d(),
      f(9, "input", 10),
      W("ngModelChange", function (i) {
        I(r);
        let o = y(2);
        return Z(o.confirmNewPassword, i) || (o.confirmNewPassword = i), M(i);
      }),
      S("input", function () {
        I(r);
        let i = y(2);
        return M(i.validateNewPassword());
      }),
      d(),
      P(10, cS, 2, 1, "div", 11),
      f(11, "button", 7),
      S("click", function () {
        I(r);
        let i = y(2);
        return M(i.savePasswordChange());
      }),
      p(12, "Change Password"),
      d(),
      f(13, "button", 7),
      S("click", function () {
        I(r);
        let i = y(2);
        return M(i.cancelPasswordChange());
      }),
      p(14, "Cancel"),
      d()();
  }
  if (t & 2) {
    let r = y(2);
    v(3),
      G("ngModel", r.oldPassword),
      v(3),
      G("ngModel", r.newPassword),
      v(3),
      G("ngModel", r.confirmNewPassword),
      v(),
      _("ngIf", r.passwordError);
  }
}
function uS(t, e) {
  if (
    (t & 1 &&
      (f(0, "div", 2)(1, "div"),
      P(2, rS, 1, 1, "img", 3),
      d(),
      P(3, sS, 3, 2, "div", 4)(4, aS, 5, 0, "div", 5)(5, lS, 15, 4, "div", 5),
      d()),
    t & 2)
  ) {
    let r = y();
    v(2),
      _("ngIf", r.photoUrl),
      v(),
      _("ngForOf", Tg(4, nS)),
      v(),
      _("ngIf", !r.isEditingPassword),
      v(),
      _("ngIf", r.isEditingPassword);
  }
}
var oy = (() => {
  let e = class e {
    constructor(n, i) {
      (this.router = n),
        (this.userService = i),
        (this.user = null),
        (this.photoUrl = null),
        (this.isEditing = {}),
        (this.editValues = {}),
        (this.isEditingPassword = !1),
        (this.oldPassword = ""),
        (this.newPassword = ""),
        (this.confirmNewPassword = ""),
        (this.passwordForSave = ""),
        (this.passwordError = null);
    }
    ngOnInit() {
      let n = localStorage.getItem("currentUser");
      n && (this.user = JSON.parse(n)),
        this.user &&
          this.user.photo &&
          this.user.photo.data &&
          (this.photoUrl = `data:${this.user.photo.contentType};base64,${this.user.photo.data}`);
    }
    startEdit(n) {
      (this.isEditing[n] = !0), (this.editValues[n] = this.user[n]);
    }
    cancelEdit(n) {
      (this.isEditing[n] = !1), (this.editValues[n] = this.user[n]);
    }
    startPasswordChange() {
      this.isEditingPassword = !0;
    }
    cancelPasswordChange() {
      (this.isEditingPassword = !1),
        (this.oldPassword = ""),
        (this.newPassword = ""),
        (this.confirmNewPassword = ""),
        (this.passwordError = null);
    }
    validateNewPassword() {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        this.newPassword
      )
        ? this.newPassword !== this.confirmNewPassword
          ? ((this.passwordError = "New passwords do not match."), !1)
          : ((this.passwordError = null), !0)
        : ((this.passwordError =
            "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters."),
          !1);
    }
    saveEdit(n) {
      if (!this.passwordForSave) {
        alert("Please enter your current password to confirm changes.");
        return;
      }
      this.userService
        .verifyPassword(this.user.username, this.passwordForSave)
        .subscribe(
          (i) => {
            i
              ? ((this.user[n] = this.editValues[n]),
                (this.isEditing[n] = !1),
                alert("Profile updated successfully."))
              : alert("Incorrect current password.");
          },
          (i) => {
            console.error("Password verification failed:", i),
              alert("An error occurred while verifying your password.");
          }
        );
    }
    savePasswordChange() {
      if (!this.oldPassword) {
        alert("Please enter your current password.");
        return;
      }
      this.validateNewPassword() &&
        this.userService
          .changePassword(
            this.user.username,
            this.oldPassword,
            this.newPassword
          )
          .subscribe(
            () => {
              alert("Password changed successfully."),
                this.cancelPasswordChange();
            },
            (n) => {
              console.error("Password change failed:", n),
                alert("Failed to change password. Please try again.");
            }
          );
    }
    logout() {
      localStorage.removeItem("currentUser"), this.router.navigate(["/"]);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(ue), E(Ke));
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-profile"]],
      decls: 4,
      vars: 1,
      consts: [
        [1, "profile-container"],
        ["class", "profile-info", 4, "ngIf"],
        [1, "profile-info"],
        ["alt", "Profile Picture", 3, "src", 4, "ngIf"],
        [4, "ngFor", "ngForOf"],
        [4, "ngIf"],
        ["alt", "Profile Picture", 3, "src"],
        [3, "click"],
        [3, "ngModelChange", "ngModel"],
        ["type", "password", 3, "ngModelChange", "ngModel"],
        ["type", "password", 3, "ngModelChange", "input", "ngModel"],
        ["class", "error-message", 4, "ngIf"],
        [1, "error-message"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "div", 0)(1, "h2"),
          p(2, "Profile Information"),
          d(),
          P(3, uS, 6, 5, "div", 1),
          d()),
          i & 2 && (v(3), _("ngIf", o.user));
      },
      dependencies: [Mn, ke, Le, Qe, ze, am],
      styles: [
        ".profile-container[_ngcontent-%COMP%]{max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:8px;background-color:#f9f9f9}.profile-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:10px 0}.profile-info[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:block;margin:5px 0}.profile-info[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;padding:8px;margin-bottom:10px;border:1px solid #ccc;border-radius:4px}button[_ngcontent-%COMP%]{margin-right:10px;padding:5px 10px;background-color:#bb9c7f;color:#fff;border:none;border-radius:4px;cursor:pointer}button[_ngcontent-%COMP%]:hover{background-color:#0056b3}.logout-button[_ngcontent-%COMP%]{background-color:#dc3545}.logout-button[_ngcontent-%COMP%]:hover{background-color:#c82333}.error-message[_ngcontent-%COMP%]{color:#cc1b00;margin-top:5px}",
      ],
    }));
  let t = e;
  return t;
})();
function dS(t, e) {
  if ((t & 1 && (f(0, "div", 23), p(1), d()), t & 2)) {
    let r = y();
    v(), Me(r.usernameError);
  }
}
function fS(t, e) {
  if ((t & 1 && (f(0, "div", 23), p(1), d()), t & 2)) {
    let r = y();
    v(), Me(r.passwordError);
  }
}
function hS(t, e) {
  t & 1 && (f(0, "div", 23), p(1, " Passwords do not match. "), d());
}
function pS(t, e) {
  if ((t & 1 && (f(0, "div", 23), p(1), d()), t & 2)) {
    let r = y();
    v(), Me(r.emailError);
  }
}
function gS(t, e) {
  if ((t & 1 && (f(0, "div", 23), p(1), d()), t & 2)) {
    let r = y();
    v(), he(" ", r.errorMessage, " ");
  }
}
var sy = (() => {
  let e = class e {
    constructor(n, i) {
      (this.userService = n),
        (this.router = i),
        (this.user = {
          firstname: "",
          lastname: "",
          username: "",
          password: "",
          email: "",
          phone: "",
        }),
        (this.confirmPassword = ""),
        (this.selectedFile = null),
        (this.errorMessage = null),
        (this.passwordError = null),
        (this.usernameError = null),
        (this.emailError = null);
    }
    onFileSelected(n) {
      let i = n.target.files[0];
      this.selectedFile = i;
    }
    validatePassword() {
      let n = this.user.password;
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        n
      )
        ? (this.passwordError = null)
        : (this.passwordError =
            "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.");
    }
    isPasswordValid() {
      return (
        !this.passwordError &&
        this.user.password === this.confirmPassword &&
        this.user.password.length > 0
      );
    }
    checkUsernameAvailability() {
      this.userService
        .checkUsername(this.user.username)
        .pipe(Yo(300))
        .subscribe(
          (n) => {
            this.usernameError =
              n.message === "Username is taken."
                ? "Username is already taken."
                : null;
          },
          (n) => {
            console.error("Error checking username availability:", n);
          }
        );
    }
    checkEmailAvailability() {
      this.userService
        .checkEmail(this.user.email)
        .pipe(Yo(300))
        .subscribe(
          (n) => {
            this.emailError =
              n.message === "E-mail is taken."
                ? "Email is already registered."
                : null;
          },
          (n) => {
            console.error("Error checking email availability:", n);
          }
        );
    }
    onSubmit() {
      return ar(this, null, function* () {
        if (!this.selectedFile) {
          this.errorMessage = "Profile picture is required.";
          return;
        }
        if (this.usernameError || this.emailError || !this.isPasswordValid()) {
          this.errorMessage = "Please fix the errors before submitting.";
          return;
        }
        let n = new FormData();
        n.append("firstname", this.user.firstname),
          n.append("lastname", this.user.lastname),
          n.append("username", this.user.username),
          n.append("password", this.user.password),
          n.append("email", this.user.email),
          n.append("phone", this.user.phone),
          n.append("photo", this.selectedFile);
        try {
          let i = yield this.userService.registerUser(n).toPromise();
          this.router.navigate(["/login"]);
        } catch (i) {
          i.status === 409
            ? i.error.conflictField === "username"
              ? (this.usernameError = "Username is already taken.")
              : i.error.conflictField === "email"
              ? (this.emailError = "Email is already registered.")
              : (this.errorMessage = "Registration failed. Please try again.")
            : (console.error("Registration failed:", i),
              (this.errorMessage = "Registration failed. Please try again."));
        }
      });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(Ke), E(ue));
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-user-registration"]],
      decls: 48,
      vars: 13,
      consts: [
        ["registrationForm", "ngForm"],
        [1, "registration-container"],
        [3, "ngSubmit"],
        [1, "form-group"],
        ["for", "firstname"],
        [
          "type",
          "text",
          "id",
          "firstname",
          "name",
          "firstname",
          "required",
          "",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["for", "lastname"],
        [
          "type",
          "text",
          "id",
          "lastname",
          "name",
          "lastname",
          "required",
          "",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["for", "username"],
        [
          "type",
          "text",
          "id",
          "username",
          "name",
          "username",
          "required",
          "",
          3,
          "ngModelChange",
          "input",
          "ngModel",
        ],
        ["class", "error-message", 4, "ngIf"],
        ["for", "password"],
        [
          "type",
          "password",
          "id",
          "password",
          "name",
          "password",
          "required",
          "",
          3,
          "ngModelChange",
          "input",
          "ngModel",
        ],
        ["for", "confirmPassword"],
        [
          "type",
          "password",
          "id",
          "confirmPassword",
          "name",
          "confirmPassword",
          "required",
          "",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["for", "email"],
        [
          "type",
          "email",
          "id",
          "email",
          "name",
          "email",
          "required",
          "",
          3,
          "ngModelChange",
          "input",
          "ngModel",
        ],
        ["for", "phone"],
        [
          "type",
          "tel",
          "id",
          "phone",
          "name",
          "phone",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["for", "photo"],
        [
          "type",
          "file",
          "id",
          "photo",
          "name",
          "photo",
          "required",
          "",
          3,
          "change",
        ],
        ["type", "submit", 3, "disabled"],
        ["routerLink", "/login"],
        [1, "error-message"],
      ],
      template: function (i, o) {
        if (i & 1) {
          let s = K();
          f(0, "div", 1)(1, "h2"),
            p(2, "User Registration"),
            d(),
            f(3, "form", 2, 0),
            S("ngSubmit", function () {
              return I(s), M(o.onSubmit());
            }),
            f(5, "div", 3)(6, "label", 4),
            p(7, "First Name"),
            d(),
            f(8, "input", 5),
            W("ngModelChange", function (c) {
              return (
                I(s), Z(o.user.firstname, c) || (o.user.firstname = c), M(c)
              );
            }),
            d()(),
            f(9, "div", 3)(10, "label", 6),
            p(11, "Last Name"),
            d(),
            f(12, "input", 7),
            W("ngModelChange", function (c) {
              return I(s), Z(o.user.lastname, c) || (o.user.lastname = c), M(c);
            }),
            d()(),
            f(13, "div", 3)(14, "label", 8),
            p(15, "Username"),
            d(),
            f(16, "input", 9),
            W("ngModelChange", function (c) {
              return I(s), Z(o.user.username, c) || (o.user.username = c), M(c);
            }),
            S("input", function () {
              return I(s), M(o.checkUsernameAvailability());
            }),
            d(),
            P(17, dS, 2, 1, "div", 10),
            d(),
            f(18, "div", 3)(19, "label", 11),
            p(20, "Password"),
            d(),
            f(21, "input", 12),
            W("ngModelChange", function (c) {
              return I(s), Z(o.user.password, c) || (o.user.password = c), M(c);
            }),
            S("input", function () {
              return I(s), M(o.validatePassword());
            }),
            d(),
            P(22, fS, 2, 1, "div", 10),
            d(),
            f(23, "div", 3)(24, "label", 13),
            p(25, "Confirm Password"),
            d(),
            f(26, "input", 14),
            W("ngModelChange", function (c) {
              return (
                I(s), Z(o.confirmPassword, c) || (o.confirmPassword = c), M(c)
              );
            }),
            d(),
            P(27, hS, 2, 0, "div", 10),
            d(),
            f(28, "div", 3)(29, "label", 15),
            p(30, "Email"),
            d(),
            f(31, "input", 16),
            W("ngModelChange", function (c) {
              return I(s), Z(o.user.email, c) || (o.user.email = c), M(c);
            }),
            S("input", function () {
              return I(s), M(o.checkEmailAvailability());
            }),
            d(),
            P(32, pS, 2, 1, "div", 10),
            d(),
            f(33, "div", 3)(34, "label", 17),
            p(35, "Phone Number"),
            d(),
            f(36, "input", 18),
            W("ngModelChange", function (c) {
              return I(s), Z(o.user.phone, c) || (o.user.phone = c), M(c);
            }),
            d()(),
            f(37, "div", 3)(38, "label", 19),
            p(39, "Profile Picture"),
            d(),
            f(40, "input", 20),
            S("change", function (c) {
              return I(s), M(o.onFileSelected(c));
            }),
            d()(),
            f(41, "button", 21),
            p(42, " Register "),
            d()(),
            P(43, gS, 2, 1, "div", 10),
            f(44, "p"),
            p(45, " Already have an account? "),
            f(46, "a", 22),
            p(47, "Login here"),
            d()()();
        }
        if (i & 2) {
          let s = oa(4);
          v(8),
            G("ngModel", o.user.firstname),
            v(4),
            G("ngModel", o.user.lastname),
            v(4),
            G("ngModel", o.user.username),
            v(),
            _("ngIf", o.usernameError),
            v(4),
            G("ngModel", o.user.password),
            v(),
            _("ngIf", o.passwordError),
            v(4),
            G("ngModel", o.confirmPassword),
            v(),
            _(
              "ngIf",
              o.confirmPassword && o.confirmPassword !== o.user.password
            ),
            v(4),
            G("ngModel", o.user.email),
            v(),
            _("ngIf", o.emailError),
            v(4),
            G("ngModel", o.user.phone),
            v(5),
            _("disabled", !s.valid || !o.isPasswordValid()),
            v(2),
            _("ngIf", o.errorMessage);
        }
      },
      dependencies: [ke, oi, An, Le, Qe, Tn, sn, ze, on],
      styles: [
        ".registration-container[_ngcontent-%COMP%]{max-width:500px;margin:50px auto;padding:20px;border:1px solid #ccc;border-radius:5px;background-color:#f9f9f9}h2[_ngcontent-%COMP%]{text-align:center;margin-bottom:20px}.form-group[_ngcontent-%COMP%]{margin-bottom:15px}label[_ngcontent-%COMP%]{display:block;margin-bottom:5px}input[_ngcontent-%COMP%]{width:100%;padding:8px;box-sizing:border-box;border:1px solid #ccc;border-radius:3px}button[_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#bb9c7f;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:16px}button[_ngcontent-%COMP%]:disabled{background-color:#ccc}.error-message[_ngcontent-%COMP%]{color:#cc1b00;text-align:center;margin-top:15px}",
      ],
    }));
  let t = e;
  return t;
})();
function mS(t, e) {
  if ((t & 1 && (f(0, "option", 16), p(1), d()), t & 2)) {
    let r = e.$implicit;
    _("value", r), v(), Me(r);
  }
}
function vS(t, e) {
  if ((t & 1 && (f(0, "option", 16), p(1), d()), t & 2)) {
    let r = e.$implicit;
    _("value", r), v(), Me(r);
  }
}
function yS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div")(1, "label", 17),
      p(2, "Ingredient Name:"),
      d(),
      f(3, "input", 18),
      W("ngModelChange", function (i) {
        let o = I(r).$implicit;
        return Z(o.name, i) || (o.name = i), M(i);
      }),
      d(),
      f(4, "label", 19),
      p(5, "Quantity:"),
      d(),
      f(6, "input", 20),
      W("ngModelChange", function (i) {
        let o = I(r).$implicit;
        return Z(o.quantity, i) || (o.quantity = i), M(i);
      }),
      d(),
      f(7, "label", 21),
      p(8, "Unit:"),
      d(),
      f(9, "input", 22),
      W("ngModelChange", function (i) {
        let o = I(r).$implicit;
        return Z(o.unit, i) || (o.unit = i), M(i);
      }),
      d(),
      f(10, "button", 12),
      S("click", function () {
        let i = I(r).index,
          o = y();
        return M(o.removeIngredient(i));
      }),
      p(11, " Remove Ingredient "),
      d()();
  }
  if (t & 2) {
    let r = e.$implicit;
    v(3),
      G("ngModel", r.name),
      v(3),
      G("ngModel", r.quantity),
      v(3),
      G("ngModel", r.unit);
  }
}
var ay = (function (t) {
    return (
      (t.Vegetarian = "Vegetarian"),
      (t.Vegan = "Vegan"),
      (t.GlutenFree = "Gluten-Free"),
      (t.DairyFree = "Dairy-Free"),
      (t.LowCarb = "Low-Carb"),
      (t.HighProtein = "High-Protein"),
      (t.QuickEasy = "Quick & Easy"),
      (t.KidFriendly = "Kid-Friendly"),
      (t.Spicy = "Spicy"),
      (t.ComfortFood = "Comfort Food"),
      (t.Healthy = "Healthy"),
      (t.LowCalorie = "Low-Calorie"),
      (t.Keto = "Keto"),
      (t.Paleo = "Paleo"),
      (t.Seasonal = "Seasonal"),
      (t.Holiday = "Holiday"),
      (t.BudgetFriendly = "Budget-Friendly"),
      (t.OnePot = "One-Pot"),
      (t.Grilling = "Grilling"),
      (t.Dessert = "Dessert"),
      t
    );
  })(ay || {}),
  cy = (function (t) {
    return (
      (t.Appetizers = "Appetizers"),
      (t.MainCourse = "Main Course"),
      (t.SideDish = "Side Dish"),
      (t.Desserts = "Desserts"),
      (t.Soups = "Soups"),
      (t.Salads = "Salads"),
      (t.Beverages = "Beverages"),
      (t.Breakfast = "Breakfast"),
      (t.Brunch = "Brunch"),
      (t.Lunch = "Lunch"),
      (t.Dinner = "Dinner"),
      (t.Snacks = "Snacks"),
      (t.Baking = "Baking"),
      (t.SaucesDips = "Sauces & Dips"),
      (t.Pasta = "Pasta"),
      (t.Pizza = "Pizza"),
      (t.GrillingBBQ = "Grilling & BBQ"),
      (t.Casseroles = "Casseroles"),
      (t.Seafood = "Seafood"),
      (t.Vegetarian = "Vegetarian"),
      t
    );
  })(cy || {}),
  ly = (() => {
    let e = class e {
      constructor(n, i) {
        (this.recipeService = n),
          (this.router = i),
          (this.name = ""),
          (this.category = []),
          (this.description = ""),
          (this.ingredients = []),
          (this.tags = []),
          (this.image = null),
          (this.categories = Object.values(cy)),
          (this.tagsList = Object.values(ay));
      }
      addIngredient() {
        this.ingredients.push({ name: "", quantity: 0, unit: "" });
      }
      removeIngredient(n) {
        this.ingredients.splice(n, 1);
      }
      onFileSelected(n) {
        let i = n.target.files[0];
        i && (this.image = i);
      }
      onSubmit() {
        let n = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (!n || !n._id) {
          console.error("User not found in local storage");
          return;
        }
        let i = new FormData();
        i.append("name", this.name),
          i.append("category", this.category.join(",")),
          i.append("description", this.description),
          i.append("ingredients", JSON.stringify(this.ingredients)),
          i.append("tags", this.tags.join(",")),
          i.append("createdBy", n._id),
          this.image && i.append("image", this.image),
          this.recipeService.addRecipe(i).subscribe(
            (o) => {
              console.log("Recipe added successfully", o),
                this.router.navigate(["/recipes"]);
            },
            (o) => {
              console.error("Failed to add recipe", o);
            }
          );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(E(On), E(ue));
    }),
      (e.ɵcmp = Q({
        type: e,
        selectors: [["app-recipe-add"]],
        decls: 26,
        vars: 7,
        consts: [
          [1, "recipe-add-container"],
          [3, "submit"],
          ["for", "name"],
          [
            "type",
            "text",
            "id",
            "name",
            "name",
            "name",
            "required",
            "",
            3,
            "ngModelChange",
            "ngModel",
          ],
          ["for", "category"],
          [
            "id",
            "category",
            "name",
            "category",
            "multiple",
            "",
            "required",
            "",
            3,
            "ngModelChange",
            "ngModel",
          ],
          [3, "value", 4, "ngFor", "ngForOf"],
          ["for", "tags"],
          [
            "id",
            "tags",
            "name",
            "tags",
            "multiple",
            "",
            "required",
            "",
            3,
            "ngModelChange",
            "ngModel",
          ],
          ["for", "description"],
          [
            "id",
            "description",
            "name",
            "description",
            "required",
            "",
            3,
            "ngModelChange",
            "ngModel",
          ],
          [4, "ngFor", "ngForOf"],
          ["type", "button", 3, "click"],
          ["for", "image"],
          ["type", "file", "id", "image", 3, "change"],
          ["type", "submit"],
          [3, "value"],
          ["for", "ingredientName"],
          [
            "type",
            "text",
            "name",
            "ingredientName",
            "required",
            "",
            3,
            "ngModelChange",
            "ngModel",
          ],
          ["for", "ingredientQuantity"],
          [
            "type",
            "number",
            "name",
            "ingredientQuantity",
            "required",
            "",
            3,
            "ngModelChange",
            "ngModel",
          ],
          ["for", "ingredientUnit"],
          [
            "type",
            "text",
            "name",
            "ingredientUnit",
            3,
            "ngModelChange",
            "ngModel",
          ],
        ],
        template: function (i, o) {
          i & 1 &&
            (f(0, "div", 0)(1, "h2"),
            p(2, "Add New Recipe"),
            d(),
            f(3, "form", 1),
            S("submit", function () {
              return o.onSubmit();
            }),
            f(4, "label", 2),
            p(5, "Recipe Name:"),
            d(),
            f(6, "input", 3),
            W("ngModelChange", function (a) {
              return Z(o.name, a) || (o.name = a), a;
            }),
            d(),
            f(7, "label", 4),
            p(8, "Category:"),
            d(),
            f(9, "select", 5),
            W("ngModelChange", function (a) {
              return Z(o.category, a) || (o.category = a), a;
            }),
            P(10, mS, 2, 2, "option", 6),
            d(),
            f(11, "label", 7),
            p(12, "Tags:"),
            d(),
            f(13, "select", 8),
            W("ngModelChange", function (a) {
              return Z(o.tags, a) || (o.tags = a), a;
            }),
            P(14, vS, 2, 2, "option", 6),
            d(),
            f(15, "label", 9),
            p(16, "Description:"),
            d(),
            f(17, "textarea", 10),
            W("ngModelChange", function (a) {
              return Z(o.description, a) || (o.description = a), a;
            }),
            d(),
            P(18, yS, 12, 3, "div", 11),
            f(19, "button", 12),
            S("click", function () {
              return o.addIngredient();
            }),
            p(20, "Add Ingredient"),
            d(),
            f(21, "label", 13),
            p(22, "Upload Image:"),
            d(),
            f(23, "input", 14),
            S("change", function (a) {
              return o.onFileSelected(a);
            }),
            d(),
            f(24, "button", 15),
            p(25, "Add Recipe"),
            d()()()),
            i & 2 &&
              (v(6),
              G("ngModel", o.name),
              v(3),
              G("ngModel", o.category),
              v(),
              _("ngForOf", o.categories),
              v(3),
              G("ngModel", o.tags),
              v(),
              _("ngForOf", o.tagsList),
              v(3),
              G("ngModel", o.description),
              v(),
              _("ngForOf", o.ingredients));
        },
        dependencies: [Mn, An, sv, av, Le, Qi, $a, Qe, Tn, sn, ze, on],
        styles: [
          ".recipe-add-container[_ngcontent-%COMP%]{max-width:600px;margin:0 auto;padding:20px;background-color:#f9f9f9;border-radius:8px;box-shadow:0 0 10px #0000001a}.recipe-add-container[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{text-align:center;margin-bottom:20px}label[_ngcontent-%COMP%]{display:block;margin-bottom:8px;font-weight:700}input[type=text][_ngcontent-%COMP%], input[type=number][_ngcontent-%COMP%], textarea[_ngcontent-%COMP%], select[_ngcontent-%COMP%]{width:100%;padding:8px;margin-bottom:12px;border:1px solid #ccc;border-radius:4px}textarea[_ngcontent-%COMP%]{height:100px}button[type=button][_ngcontent-%COMP%]{background-color:#f44336;color:#fff;border:none;padding:8px 12px;border-radius:4px;margin-top:5px;cursor:pointer}button[type=button][_ngcontent-%COMP%]:hover{background-color:#d32f2f}button[type=submit][_ngcontent-%COMP%]{background-color:#4caf50;color:#fff;padding:12px 20px;border:none;border-radius:4px;cursor:pointer;width:100%}button[type=submit][_ngcontent-%COMP%]:hover{background-color:#45a049}",
        ],
      }));
    let t = e;
    return t;
  })();
var CS = (t) => ({ active: t });
function wS(t, e) {
  t & 1 && (f(0, "div")(1, "p"), p(2, "No recipes available."), d()());
}
function DS(t, e) {
  if ((t & 1 && ge(0, "img", 22), t & 2)) {
    let r = y().$implicit,
      n = y(2);
    xi("alt", r.name), _("src", n.getImageSrc(r.image), Kn);
  }
}
function _S(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div", 8),
      S("click", function () {
        let i = I(r).$implicit,
          o = y(2);
        return M(o.viewRecipe(i));
      }),
      P(1, DS, 1, 2, "img", 9),
      f(2, "div", 10)(3, "h2", 11)(4, "span", 12),
      p(5),
      d(),
      f(6, "span", 13),
      p(7),
      d()(),
      f(8, "p")(9, "strong"),
      p(10, "Category:"),
      d(),
      p(11),
      d(),
      f(12, "p")(13, "strong"),
      p(14, "Tags:"),
      d(),
      p(15),
      d(),
      f(16, "p", 14)(17, "span", 15)(18, "span", 16)(19, "span", 17),
      p(20, "\u2605\u2605\u2605\u2605\u2605"),
      d(),
      f(21, "span", 18),
      p(22, "\u2605\u2605\u2605\u2605\u2605"),
      d()()(),
      f(23, "span", 19),
      ge(24, "i", 20),
      p(25),
      d(),
      ge(26, "span"),
      d(),
      f(27, "p", 2),
      S("click", function () {
        let i = I(r).$implicit,
          o = y(2);
        return M(o.viewRecipe(i));
      }),
      f(28, "span", 21)(29, "strong"),
      p(30, ". . ."),
      d()()()()();
  }
  if (t & 2) {
    let r = e.$implicit;
    v(),
      _("ngIf", r.image),
      v(4),
      he(" ", r.name, " "),
      v(2),
      he(" \u2764 ", r.favourites, " "),
      v(4),
      he(" ", r.category.join(", "), ""),
      v(4),
      he(" ", r.tags.join(", "), ""),
      v(4),
      Br("width", (r.averageRating / 5) * 100, "%"),
      v(6),
      he("", r.comments.length, " ");
  }
}
function ES(t, e) {
  if ((t & 1 && (f(0, "div", 6), P(1, _S, 31, 8, "div", 7), d()), t & 2)) {
    let r = y();
    v(), _("ngForOf", r.recipes);
  }
}
function bS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "button", 25),
      S("click", function () {
        let i = I(r).$implicit,
          o = y(2);
        return M(o.setPage(i));
      }),
      p(1),
      d();
  }
  if (t & 2) {
    let r = e.$implicit,
      n = y(2);
    _("ngClass", Si(2, CS, r === n.currentPage)), v(), he(" ", r, " ");
  }
}
function IS(t, e) {
  if ((t & 1 && (f(0, "div", 23), P(1, bS, 2, 4, "button", 24), d()), t & 2)) {
    let r = y();
    v(), _("ngForOf", r.getPaginationArray());
  }
}
var Wd = (() => {
  let e = class e {
    constructor(n, i, o) {
      (this.recipeService = n),
        (this.router = i),
        (this.searchService = o),
        (this.recipes = []),
        (this.originalRecipes = []),
        (this.currentPage = 1),
        (this.recipesPerPage = 9),
        (this.totalPages = 1),
        (this.sortBy = ""),
        (this.order = "asc");
    }
    ngOnInit() {
      this.searchService
        .getSearchTerm()
        .pipe(
          Re((n) =>
            n
              ? this.recipeService.searchRecipes(n)
              : this.recipeService.getAllRecipes()
          )
        )
        .subscribe(
          (n) => {
            (this.originalRecipes = n),
              (this.totalPages = Math.ceil(
                this.originalRecipes.length / this.recipesPerPage
              )),
              this.setPage(this.currentPage);
          },
          (n) => {
            console.error("Error fetching recipes:", n);
          }
        );
    }
    setPage(n) {
      if (n < 1 || n > this.totalPages) return;
      this.currentPage = n;
      let i = (this.currentPage - 1) * this.recipesPerPage,
        o = i + this.recipesPerPage;
      this.recipes = this.originalRecipes.slice(i, o);
    }
    sortRecipes(n) {
      this.sortBy === n
        ? (this.order = this.order === "asc" ? "desc" : "asc")
        : ((this.sortBy = n), (this.order = "asc")),
        (this.recipes = this.sortArray(
          this.originalRecipes,
          this.sortBy,
          this.order
        )),
        this.setPage(1);
    }
    sortArray(n, i, o) {
      return n.sort((s, a) =>
        o === "asc" ? (s[i] > a[i] ? 1 : -1) : s[i] < a[i] ? 1 : -1
      );
    }
    viewRecipe(n) {
      localStorage.setItem("currentRecipe", JSON.stringify(n)),
        this.router.navigate([`/recipe/${n._id}`]);
    }
    getImageSrc(n) {
      return `data:${n.contentType};base64,${n.data || n.imageBase64}`;
    }
    getPaginationArray() {
      return Array.from({ length: this.totalPages }, (n, i) => i + 1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(On), E(ue), E(dc));
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-recipes"]],
      decls: 11,
      vars: 3,
      consts: [
        [1, "recipes-container"],
        [1, "sort-buttons"],
        [3, "click"],
        [4, "ngIf"],
        ["class", "recipe-list", 4, "ngIf"],
        ["class", "pagination", 4, "ngIf"],
        [1, "recipe-list"],
        ["class", "recipe-card", 3, "click", 4, "ngFor", "ngForOf"],
        [1, "recipe-card", 3, "click"],
        [3, "src", "alt", 4, "ngIf"],
        [1, "recipe-content"],
        [1, "recipe-header"],
        [1, "recipe-name"],
        [1, "recipe-author"],
        [1, "comments-section"],
        [1, "rating-stars"],
        [1, "star-wrapper"],
        [1, "filled-stars"],
        [1, "empty-stars"],
        [1, "comment-icon"],
        [1, "bi", "bi-chat-dots"],
        [1, "ellipsis"],
        [3, "src", "alt"],
        [1, "pagination"],
        ["class", "page-btn", 3, "ngClass", "click", 4, "ngFor", "ngForOf"],
        [1, "page-btn", 3, "click", "ngClass"],
      ],
      template: function (i, o) {
        i & 1 &&
          (f(0, "div", 0)(1, "div", 1)(2, "button", 2),
          S("click", function () {
            return o.sortRecipes("averageRating");
          }),
          p(3, "Sort by Rating"),
          d(),
          f(4, "button", 2),
          S("click", function () {
            return o.sortRecipes("createdAt");
          }),
          p(5, "Sort by Newest"),
          d(),
          f(6, "button", 2),
          S("click", function () {
            return o.sortRecipes("name");
          }),
          p(7, "Sort by Name (A-Z/Z-A)"),
          d()(),
          P(8, wS, 3, 0, "div", 3)(9, ES, 2, 1, "div", 4)(
            10,
            IS,
            2,
            1,
            "div",
            5
          ),
          d()),
          i & 2 &&
            (v(8),
            _("ngIf", o.recipes.length === 0),
            v(),
            _("ngIf", o.recipes.length > 0),
            v(),
            _("ngIf", o.totalPages > 1));
      },
      dependencies: [Ia, Mn, ke],
      styles: [
        ".recipes-container[_ngcontent-%COMP%]{max-width:1200px;margin:0 auto;padding:20px}.sort-buttons[_ngcontent-%COMP%]{display:flex;gap:10px;margin-bottom:20px}.recipe-list[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}.recipe-card[_ngcontent-%COMP%]{background-color:#fff;border-radius:8px;box-shadow:0 2px 8px #0000001a;overflow:hidden;display:flex;flex-direction:column;cursor:pointer}.recipe-card[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:200px;object-fit:cover}.recipe-content[_ngcontent-%COMP%]{padding:15px}.recipe-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0 0 10px;font-size:1.5em;color:#333}.recipe-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:5px 0;color:#666}.recipe-content[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:#333}.empty-card[_ngcontent-%COMP%]{background:transparent;box-shadow:none}.pagination[_ngcontent-%COMP%]{margin-top:20px;display:flex;justify-content:center}.page-btn[_ngcontent-%COMP%]{background-color:#bb9c7f;color:#fff;border:none;padding:10px 20px;margin:0 5px;border-radius:5px;cursor:pointer;transition:background-color .3s}.page-btn.active[_ngcontent-%COMP%], .page-btn[_ngcontent-%COMP%]:hover{background-color:#0056b3}.recipe-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:#000;cursor:pointer;transition:color .3s ease}.recipe-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]:hover{color:#ffdd57;text-decoration:underline}.recipe-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.recipe-name[_ngcontent-%COMP%]{font-weight:700;font-size:1.8rem}.recipe-author[_ngcontent-%COMP%]{font-size:.9em;color:red}.recipe-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.rating-stars[_ngcontent-%COMP%]{display:inline-block;position:relative;font-size:1.2rem;line-height:1}.star-wrapper[_ngcontent-%COMP%]{position:relative;display:inline-block;color:#e0e0e0;white-space:nowrap}.filled-stars[_ngcontent-%COMP%]{position:absolute;top:0;left:0;color:#ffc107;overflow:hidden;white-space:nowrap;width:0;transition:width .3s ease}.empty-stars[_ngcontent-%COMP%]{color:#e0e0e0}.comments-section[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.comment-icon[_ngcontent-%COMP%]{margin-left:auto;font-size:1.3rem;color:#000}.comment-icon[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.comment-icon[_ngcontent-%COMP%]   .bi-chat-dots[_ngcontent-%COMP%]{padding-right:5px;margin-left:auto;font-size:1.2rem;color:#000}.ellipsis[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;width:100%;text-align:center}.ellipsis[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:1.2rem}",
      ],
    }));
  let t = e;
  return t;
})();
var MS = (t) => ({ "is-favourite": t }),
  xS = (t) => ({ filled: t });
function SS(t, e) {
  if ((t & 1 && ge(0, "img", 28), t & 2)) {
    let r = y(2);
    xi("alt", r.recipe.name),
      _(
        "src",
        "data:" + r.recipe.image.contentType + ";base64," + r.recipe.image.data,
        Kn
      );
  }
}
function TS(t, e) {
  if ((t & 1 && (f(0, "div", 29)(1, "p"), p(2), d()()), t & 2)) {
    let r = e.$implicit;
    v(2), wu(" ", r.name, ": ", r.quantity, " ", r.unit, " ");
  }
}
function AS(t, e) {
  if ((t & 1 && (f(0, "div", 30)(1, "p"), p(2), d()()), t & 2)) {
    let r = e.$implicit;
    v(2), Me(r);
  }
}
function NS(t, e) {
  if ((t & 1 && (f(0, "div", 31)(1, "p"), p(2), d()()), t & 2)) {
    let r = e.$implicit;
    v(2), Me(r);
  }
}
function RS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "p", 32),
      S("click", function () {
        I(r);
        let i = y(2);
        return M(i.toggleComments());
      }),
      p(1),
      d();
  }
  if (t & 2) {
    let r = y(2);
    v(), he(" ", r.recipe.comments.length, " comments ");
  }
}
function OS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "p", 33),
      S("click", function () {
        I(r);
        let i = y(2);
        return M(i.toggleComments());
      }),
      p(1, " Hide "),
      d();
  }
}
function PS(t, e) {
  if ((t & 1 && (yu(0), f(1, "span", 42), p(2, "\u2605"), d(), Cu()), t & 2)) {
    let r = e.$implicit,
      n = y().$implicit,
      i = y(3);
    v(), _("ngClass", Si(1, xS, r <= (i.getUserRating(n.username) || 0)));
  }
}
function FS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div", 43)(1, "button", 44),
      S("click", function () {
        I(r);
        let i = y(4);
        return M(i.toggleEdit());
      }),
      p(2, "Edit your comment"),
      d(),
      f(3, "button", 44),
      S("click", function () {
        I(r);
        let i = y().$implicit,
          o = y(3);
        return M(o.openDeleteModal(i._id));
      }),
      p(4, " Delete your comment "),
      d()();
  }
}
function kS(t, e) {
  if (
    (t & 1 &&
      (f(0, "div", 38),
      ge(1, "p"),
      f(2, "p"),
      p(3),
      Ti(4, "date"),
      f(5, "span", 39),
      P(6, PS, 3, 3, "ng-container", 40),
      d()(),
      f(7, "p")(8, "strong"),
      p(9),
      d(),
      f(10, "i"),
      p(11),
      d()(),
      P(12, FS, 5, 0, "div", 41),
      d()),
    t & 2)
  ) {
    let r = e.$implicit,
      n = y(3);
    v(3),
      he(" ", Rg(4, 5, r.createdAt, "d.M.yyyy. HH:mm"), " "),
      v(3),
      _("ngForOf", n.getStarArray(n.getUserRating(r.username))),
      v(3),
      he("", r.username, ": "),
      v(2),
      Me(r.comment),
      v(),
      _("ngIf", r.username === n.currentUser.username);
  }
}
function LS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div", 45)(1, "textarea", 46),
      W("ngModelChange", function (i) {
        I(r);
        let o = y(3);
        return Z(o.newComment, i) || (o.newComment = i), M(i);
      }),
      d(),
      f(2, "label", 47),
      p(3, "Rating:"),
      d(),
      f(4, "input", 48),
      W("ngModelChange", function (i) {
        I(r);
        let o = y(3);
        return Z(o.newRating, i) || (o.newRating = i), M(i);
      }),
      d(),
      ge(5, "br"),
      f(6, "button", 44),
      S("click", function () {
        I(r);
        let i = y(3);
        return M(i.saveCommentAndRating(!1));
      }),
      p(7, "Save"),
      d()();
  }
  if (t & 2) {
    let r = y(3);
    v(), G("ngModel", r.newComment), v(3), G("ngModel", r.newRating);
  }
}
function VS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div", 50)(1, "textarea", 51),
      W("ngModelChange", function (i) {
        I(r);
        let o = y(4);
        return Z(o.newComment, i) || (o.newComment = i), M(i);
      }),
      d(),
      f(2, "input", 52),
      W("ngModelChange", function (i) {
        I(r);
        let o = y(4);
        return Z(o.newRating, i) || (o.newRating = i), M(i);
      }),
      d(),
      ge(3, "br"),
      f(4, "button", 44),
      S("click", function () {
        I(r);
        let i = y(4);
        return M(i.saveCommentAndRating(!0));
      }),
      p(5, "Update"),
      d()();
  }
  if (t & 2) {
    let r = y(4);
    v(), G("ngModel", r.newComment), v(), G("ngModel", r.newRating);
  }
}
function jS(t, e) {
  if ((t & 1 && (f(0, "div"), P(1, VS, 6, 2, "div", 49), d()), t & 2)) {
    let r = y(3);
    v(), _("ngIf", r.editing);
  }
}
function US(t, e) {
  if (
    (t & 1 &&
      (f(0, "div", 34),
      P(1, kS, 13, 8, "div", 35)(2, LS, 8, 2, "div", 36)(
        3,
        jS,
        2,
        1,
        "div",
        37
      ),
      d()),
    t & 2)
  ) {
    let r = y(2);
    v(),
      _("ngForOf", r.recipe.comments),
      v(),
      _("ngIf", !r.hasUserComment() || !r.hasUserRating()),
      v(),
      _("ngIf", r.hasUserComment() || r.hasUserRating());
  }
}
function BS(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div", 2)(1, "div", 3)(2, "h1", 4),
      p(3),
      d(),
      f(4, "div", 5)(5, "span", 6),
      S("click", function () {
        I(r);
        let i = y();
        return M(i.toggleFavourite());
      }),
      p(6, "\u2764"),
      d(),
      f(7, "span"),
      p(8),
      d()()(),
      f(9, "div", 7),
      P(10, SS, 1, 2, "img", 8),
      f(11, "div", 9)(12, "div", 10)(13, "h2"),
      p(14, "Ingredients"),
      d(),
      P(15, TS, 3, 3, "div", 11),
      d(),
      f(16, "div", 12)(17, "h2"),
      p(18, "Categories"),
      d(),
      P(19, AS, 3, 1, "div", 13),
      d(),
      f(20, "div", 14)(21, "h2"),
      p(22, "Tags"),
      d(),
      P(23, NS, 3, 1, "div", 15),
      d()()(),
      f(24, "div", 16)(25, "h2"),
      p(26, "Description"),
      d(),
      f(27, "p"),
      p(28),
      d()(),
      f(29, "div", 17)(30, "div", 18)(31, "div", 19)(32, "div")(33, "p")(
        34,
        "strong"
      ),
      p(35, "Rating: "),
      d(),
      f(36, "span", 20)(37, "span", 21)(38, "span", 22),
      p(39, "\u2605\u2605\u2605\u2605\u2605"),
      d(),
      f(40, "span", 23),
      p(41, "\u2605\u2605\u2605\u2605\u2605"),
      d()()()(),
      P(42, RS, 2, 1, "p", 24)(43, OS, 2, 0, "p", 25),
      d(),
      f(44, "p", 26),
      p(45, " Author: "),
      ge(46, "br"),
      d()()(),
      P(47, US, 4, 3, "div", 27),
      d()();
  }
  if (t & 2) {
    let r = y();
    v(3),
      Me(r.recipe.name),
      v(2),
      _("ngClass", Si(13, MS, r.isFavourite)),
      v(3),
      Me(r.recipe.favourites),
      v(2),
      _("ngIf", r.recipe.image),
      v(5),
      _("ngForOf", r.recipe.ingredients),
      v(4),
      _("ngForOf", r.recipe.category),
      v(4),
      _("ngForOf", r.recipe.tags),
      v(5),
      Me(r.recipe.description),
      v(10),
      Br("width", r.getStarFillPercentage(), "%"),
      v(4),
      _("ngIf", !r.showComments),
      v(),
      _("ngIf", r.showComments),
      v(4),
      _("ngIf", r.showComments);
  }
}
function $S(t, e) {
  if (t & 1) {
    let r = K();
    f(0, "div", 53)(1, "div", 54)(2, "h3"),
      p(3, "Are you sure you want to delete this comment?"),
      d(),
      f(4, "div", 55)(5, "button", 56),
      S("click", function () {
        I(r);
        let i = y();
        return M(i.closeDeleteModal());
      }),
      p(6, "Cancel"),
      d(),
      f(7, "button", 57),
      S("click", function () {
        I(r);
        let i = y();
        return M(i.confirmDeleteComment());
      }),
      p(8, " Delete "),
      d()()()();
  }
}
var uy = (() => {
  let e = class e {
    constructor(n, i, o) {
      (this.recipeService = n),
        (this.userService = i),
        (this.router = o),
        (this.showComments = !1),
        (this.editing = !1),
        (this.updating = !1),
        (this.newComment = ""),
        (this.newRating = 0),
        (this.currentUser = JSON.parse(localStorage.getItem("currentUser"))),
        (this.isFavourite = !1),
        (this.showDeleteModal = !1),
        (this.commentToDelete = null);
    }
    getLocalTime(n) {
      return new Date(n).toLocaleString();
    }
    getUserRating(n) {
      let i = this.recipe.ratings.find((o) => o.username === n);
      return i ? i.rating : null;
    }
    getStarArray(n) {
      return Array(5)
        .fill(1)
        .map((i, o) => o + 1);
    }
    getStarFillPercentage() {
      return (this.recipe.averageRating / 5) * 100;
    }
    loadRecipe() {
      let n = JSON.parse(localStorage.getItem("currentRecipe"))._id;
      this.recipeService.getRecipeById(n).subscribe(
        (i) => {
          (this.recipe = i),
            (this.isFavourite = this.currentUser.favouriteRecepies.includes(n));
        },
        (i) => {
          console.error("Error fetching recipe:", i);
        }
      );
    }
    ngOnInit() {
      localStorage.getItem("currentUser")
        ? (this.loadRecipe(), (this.showComments = !0))
        : (this.showComments = !1);
      let n = JSON.parse(localStorage.getItem("currentRecipe"))._id,
        i = JSON.parse(localStorage.getItem("currentRecipe")).createdBy;
      i &&
        this.userService.getUserByIdPost(i).subscribe(
          (o) => {
            this.author = o;
          },
          (o) => {
            console.error("Error fetching user:", o);
          }
        ),
        this.recipeService.getRecipeById(n).subscribe(
          (o) => {
            (this.recipe = o),
              (this.isFavourite =
                this.currentUser.favouriteRecepies.includes(n));
            let s = this.recipe.comments.find(
                (l) => l.username === this.currentUser.username
              ),
              a = this.recipe.ratings.find(
                (l) => l.username === this.currentUser.username
              );
            s && (this.newComment = s.comment),
              a && (this.newRating = a.rating);
            let c = this.recipe.ratings.reduce((l, u) => l + u.rating, 0);
            this.recipe.averageRating = c / this.recipe.ratings.length || 0;
          },
          (o) => {
            console.error("Error fetching recipe:", o);
          }
        );
    }
    toggleFavourite() {
      let n = this.currentUser._id,
        i = this.recipe._id;
      this.userService.toggleFavouriteRecipe(n, i).subscribe(
        (o) => {
          (this.isFavourite = o.isFavourite),
            (this.recipe.favourites = o.favouritesCount),
            this.isFavourite
              ? this.currentUser.favouriteRecepies.push(i)
              : (this.currentUser.favouriteRecepies =
                  this.currentUser.favouriteRecepies.filter((s) => s !== i)),
            localStorage.setItem(
              "currentUser",
              JSON.stringify(this.currentUser)
            );
        },
        (o) => {
          console.error("Error toggling favourite:", o);
        }
      );
    }
    toggleComments() {
      localStorage.getItem("currentUser")
        ? (this.showComments = !this.showComments)
        : this.router.navigate(["/login"]).then(() => {
            location.reload();
          });
    }
    toggleEdit() {
      this.editing = !this.editing;
    }
    hasUserComment() {
      return this.recipe.comments.some(
        (n) => n.username === this.currentUser.username
      );
    }
    hasUserRating() {
      return this.recipe.ratings.some(
        (n) => n.username === this.currentUser.username
      );
    }
    saveCommentAndRating(n) {
      if (!this.newComment && !this.newRating) {
        alert("Please provide a comment or rating.");
        return;
      }
      let i = {
        recipeId: this.recipe._id,
        userId: this.currentUser._id,
        username: this.currentUser.username,
        commentText: this.newComment,
        ratingValue: this.newRating,
      };
      this.recipeService.updateCommentAndRating(i).subscribe(
        (o) => {
          let s = this.recipe.comments.findIndex(
            (l) => l.userId === this.currentUser._id
          );
          s !== -1 &&
            (this.recipe.comments[s] = q(D({}, this.recipe.comments[s]), {
              commentText: this.newComment,
              ratingValue: this.newRating,
            })),
            (this.newComment = ""),
            (this.newRating = 0);
          let a = this.recipe.comments.reduce((l, u) => l + u.ratingValue, 0);
          this.recipe.averageRating =
            this.recipe.comments.length > 0
              ? a / this.recipe.comments.length
              : "N/A";
          let c = JSON.parse(localStorage.getItem("currentRecipe"))._id;
          this.router.navigate([`/recipe/${c}`]).then(() => {
            location.reload();
          });
        },
        (o) => {
          console.error("Error updating comment and rating:", o);
        }
      );
    }
    deleteComment(n) {
      this.toggleEdit(),
        confirm("Are you sure you want to delete your comment?") &&
          this.recipeService.deleteComment(this.recipe._id, n).subscribe(
            (i) => {
              this.recipe.comments = this.recipe.comments.filter(
                (a) => a._id !== n
              );
              let o = this.recipe.ratings.reduce((a, c) => a + c.rating, 0);
              (this.recipe.averageRating =
                this.recipe.ratings.length > 0
                  ? o / this.recipe.ratings.length
                  : "N/A"),
                (this.showComments = !0);
              let s = JSON.parse(localStorage.getItem("currentRecipe"))._id;
              this.router.navigate([`/recipe/${s}`]).then(() => {
                location.reload();
              });
            },
            (i) => {
              console.error("Error deleting comment:", i);
            }
          );
    }
    openDeleteModal(n) {
      (this.showDeleteModal = !0), (this.commentToDelete = n);
    }
    closeDeleteModal() {
      (this.showDeleteModal = !1), (this.commentToDelete = null);
    }
    confirmDeleteComment() {
      this.commentToDelete &&
        this.recipeService
          .deleteComment(this.recipe._id, this.commentToDelete)
          .subscribe(
            (n) => {
              (this.recipe.comments = this.recipe.comments.filter(
                (o) => o._id !== this.commentToDelete
              )),
                this.closeDeleteModal();
              let i = JSON.parse(localStorage.getItem("currentRecipe"))._id;
              this.router.navigate([`/recipe/${i}`]).then(() => {
                location.reload();
              });
            },
            (n) => {
              console.error("Error deleting comment:", n),
                this.closeDeleteModal();
            }
          );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(On), E(Ke), E(ue));
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-recipe-detail"]],
      decls: 2,
      vars: 2,
      consts: [
        ["class", "recipe-detail-container", 4, "ngIf"],
        ["class", "modal", 4, "ngIf"],
        [1, "recipe-detail-container"],
        [1, "recipe-header"],
        [1, "recipe-title"],
        [1, "favourites"],
        [1, "favourite-icon", 3, "click", "ngClass"],
        [1, "recipe-content"],
        ["class", "recipe-image", 3, "src", "alt", 4, "ngIf"],
        [1, "recipe-details"],
        [1, "ingredients-section"],
        ["class", "ingredient", 4, "ngFor", "ngForOf"],
        [1, "category-section"],
        ["class", "category", 4, "ngFor", "ngForOf"],
        [1, "tags-section"],
        ["class", "tag", 4, "ngFor", "ngForOf"],
        [1, "description-section"],
        [1, "comments-section"],
        [1, "summary"],
        [1, "summary-content"],
        [1, "rating-stars"],
        [1, "star-wrapper"],
        [1, "filled-stars"],
        [1, "empty-stars"],
        ["class", "show-more", 3, "click", 4, "ngIf"],
        ["class", "show-less", 3, "click", 4, "ngIf"],
        [1, "author-info"],
        ["class", "comments", 4, "ngIf"],
        [1, "recipe-image", 3, "src", "alt"],
        [1, "ingredient"],
        [1, "category"],
        [1, "tag"],
        [1, "show-more", 3, "click"],
        [1, "show-less", 3, "click"],
        [1, "comments"],
        ["class", "comment", 4, "ngFor", "ngForOf"],
        ["class", "comment-input", 4, "ngIf"],
        [4, "ngIf"],
        [1, "comment"],
        [1, "stars"],
        [4, "ngFor", "ngForOf"],
        ["class", "comment-actions", 4, "ngIf"],
        [1, "star", 3, "ngClass"],
        [1, "comment-actions"],
        [3, "click"],
        [1, "comment-input"],
        [
          "placeholder",
          "Enter your comment here",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["for", "rating"],
        [
          "type",
          "number",
          "id",
          "rating",
          "min",
          "1",
          "max",
          "5",
          3,
          "ngModelChange",
          "ngModel",
        ],
        ["class", "edit-input", 4, "ngIf"],
        [1, "edit-input"],
        [3, "ngModelChange", "ngModel"],
        [
          "type",
          "number",
          "min",
          "1",
          "max",
          "5",
          3,
          "ngModelChange",
          "ngModel",
        ],
        [1, "modal"],
        [1, "modal-content"],
        [1, "modal-actions"],
        [1, "cancel-button", 3, "click"],
        [1, "delete-button", 3, "click"],
      ],
      template: function (i, o) {
        i & 1 && P(0, BS, 48, 15, "div", 0)(1, $S, 9, 0, "div", 1),
          i & 2 && (_("ngIf", o.recipe), v(), _("ngIf", o.showDeleteModal));
      },
      dependencies: [Ia, Mn, ke, Le, Qi, Qe, sd, od, ze, cm],
      styles: [
        ".recipe-detail-container[_ngcontent-%COMP%]{max-width:900px;margin:0 auto;padding:20px;background-color:#fff;border-radius:8px;box-shadow:0 0 10px #0000001a}.recipe-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.recipe-title[_ngcontent-%COMP%]{font-size:2rem;margin:0}.favourites[_ngcontent-%COMP%]{display:flex;align-items:center;font-size:1.5rem}.favourite-icon[_ngcontent-%COMP%]{cursor:pointer;font-size:2rem;color:#ccc;transition:color .3s}.favourite-icon.is-favourite[_ngcontent-%COMP%]{color:#e74c3c}.favourite-icon[_ngcontent-%COMP%]:hover{color:#ff6f61}.recipe-content[_ngcontent-%COMP%]{display:flex;align-items:flex-start;margin-bottom:20px}.recipe-image[_ngcontent-%COMP%]{width:300px;height:auto;border-radius:8px;margin-right:20px}.recipe-details[_ngcontent-%COMP%]{display:flex;flex:1;justify-content:space-between}.ingredients-section[_ngcontent-%COMP%], .category-section[_ngcontent-%COMP%], .tags-section[_ngcontent-%COMP%]{flex:1;margin-left:20px}.ingredient[_ngcontent-%COMP%], .category[_ngcontent-%COMP%], .tag[_ngcontent-%COMP%]{color:#000;border-radius:5px;font-size:14px}.ingredient[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .category[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .tag[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:5px 0;padding:5px 0}.description-section[_ngcontent-%COMP%]{margin-top:20px}.comments-section[_ngcontent-%COMP%]{margin-top:30px;border-top:1px solid #ccc;padding-top:20px}.summary[_ngcontent-%COMP%]{font-weight:700;margin-bottom:10px}.summary-content[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.summary-content[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{display:flex;flex-direction:column}.show-more[_ngcontent-%COMP%]{text-align:left;color:#000;cursor:pointer;margin-top:5px}.show-less[_ngcontent-%COMP%]{text-align:center;color:#ffc107;cursor:pointer;margin-top:5px}.show-less[_ngcontent-%COMP%]:hover, .show-more[_ngcontent-%COMP%]:hover{color:#ffc107}.author-info[_ngcontent-%COMP%]{margin-left:auto;text-align:right}.comments[_ngcontent-%COMP%]{margin-top:10px}.comment[_ngcontent-%COMP%]{margin-bottom:15px;padding:15px;border:1px solid #ccc;border-radius:8px;background-color:#f9f9f9}.comment-actions[_ngcontent-%COMP%]{margin-top:10px;display:flex;gap:10px}.comment-input[_ngcontent-%COMP%], .edit-input[_ngcontent-%COMP%]{margin-top:20px}textarea[_ngcontent-%COMP%]{width:100%;padding:10px;border-radius:4px;border:1px solid #ccc}button[_ngcontent-%COMP%]{margin-top:10px;padding:10px 20px;background-color:#bb9c7f;color:#fff;border:none;border-radius:4px;cursor:pointer}button[_ngcontent-%COMP%]:hover{background-color:#0056b3}.stars[_ngcontent-%COMP%]{margin-left:5px}.star[_ngcontent-%COMP%]{font-size:20px;margin-right:2px;color:#e0e0e0}.star.filled[_ngcontent-%COMP%]{color:#ffc107}.rating-stars[_ngcontent-%COMP%]{display:inline-block;position:relative;font-size:20px;line-height:1}.star-wrapper[_ngcontent-%COMP%]{position:relative;display:inline-block;color:#e0e0e0;white-space:nowrap}.filled-stars[_ngcontent-%COMP%]{position:absolute;top:0;left:0;color:#ffc107;overflow:hidden;white-space:nowrap;width:0}.empty-stars[_ngcontent-%COMP%]{color:#e0e0e0}.modal[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;position:fixed;z-index:1000;left:0;top:0;width:100%;height:100%;background-color:#00000080}.modal-content[_ngcontent-%COMP%]{background-color:#fff;padding:20px;border-radius:8px;max-width:500px;text-align:center}.modal-content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-bottom:20px;color:#333}.modal-actions[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.cancel-button[_ngcontent-%COMP%], .delete-button[_ngcontent-%COMP%]{padding:10px 40px;border-radius:4px;border:none;cursor:pointer}.cancel-button[_ngcontent-%COMP%]{background-color:#ccc;color:#333}.delete-button[_ngcontent-%COMP%]{background-color:#e74c3c;color:#fff}.cancel-button[_ngcontent-%COMP%]:hover{background-color:#bbb}.delete-button[_ngcontent-%COMP%]:hover{background-color:#c0392b}",
      ],
    }));
  let t = e;
  return t;
})();
function HS(t, e) {
  if (
    (t & 1 &&
      (f(0, "div")(1, "h2"),
      p(2, "Author Details"),
      d(),
      f(3, "p")(4, "strong"),
      p(5, "First Name:"),
      d(),
      p(6),
      d(),
      f(7, "p")(8, "strong"),
      p(9, "Last Name:"),
      d(),
      p(10),
      d()()),
    t & 2)
  ) {
    let r = y();
    v(6), he(" ", r.author.firstname, ""), v(4), he(" ", r.author.lastname, "");
  }
}
var dy = (() => {
  let e = class e {
    constructor(n) {
      this.userService = n;
    }
    ngOnInit() {
      let n = JSON.parse(localStorage.getItem("currentUser"))?._id;
      console.log(n),
        n
          ? this.userService.getUserByIdPost(n).subscribe(
              (i) => {
                this.author = i;
              },
              (i) => {
                console.error("Error fetching user:", i);
              }
            )
          : console.error("User ID not found in localStorage"),
        console.log(this.author);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(E(Ke));
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-top-9-recipes"]],
      decls: 1,
      vars: 1,
      consts: [[4, "ngIf"]],
      template: function (i, o) {
        i & 1 && P(0, HS, 11, 2, "div", 0), i & 2 && _("ngIf", o.author);
      },
      dependencies: [ke],
    }));
  let t = e;
  return t;
})();
var fy = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-favourites"]],
      decls: 2,
      vars: 0,
      template: function (i, o) {
        i & 1 && (f(0, "p"), p(1, "favourites works!"), d());
      },
    }));
  let t = e;
  return t;
})();
var hy = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-become-a-chef"]],
      decls: 2,
      vars: 0,
      template: function (i, o) {
        i & 1 && (f(0, "p"), p(1, "become-a-chef works!"), d());
      },
    }));
  let t = e;
  return t;
})();
var py = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-my-recipes"]],
      decls: 2,
      vars: 0,
      template: function (i, o) {
        i & 1 && (f(0, "p"), p(1, "my-recipes works!"), d());
      },
    }));
  let t = e;
  return t;
})();
var gy = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-candidates"]],
      decls: 2,
      vars: 0,
      template: function (i, o) {
        i & 1 && (f(0, "p"), p(1, "candidates works!"), d());
      },
    }));
  let t = e;
  return t;
})();
var my = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Q({
      type: e,
      selectors: [["app-admin-dashboard"]],
      decls: 2,
      vars: 0,
      template: function (i, o) {
        i & 1 && (f(0, "p"), p(1, "admin-dashboard works!"), d());
      },
    }));
  let t = e;
  return t;
})();
var zS = [
    { path: "", component: Wd },
    { path: "login", component: ry },
    { path: "register", component: sy },
    { path: "profile", component: oy, canActivate: [lc] },
    { path: "admin-login", component: iy },
    { path: "admin-dashboard", component: my },
    { path: "recipe-add", component: ly },
    { path: "recipes", component: Wd },
    { path: "recipe/:id", component: uy },
    { path: "top-9-recipes", component: dy },
    { path: "favourites", component: fy },
    { path: "become-a-chef", component: hy },
    { path: "my-recipes", component: py },
    { path: "candidates", component: gy },
    { path: "**", redirectTo: "login", pathMatch: "full" },
  ],
  vy = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Pe({ type: e })),
      (e.ɵinj = Oe({ imports: [Gd.forRoot(zS), Gd] }));
    let t = e;
    return t;
  })();
var yy = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Pe({ type: e, bootstrap: [ny] })),
    (e.ɵinj = Oe({ providers: [lc, Ke], imports: [Pm, vy, bm, lv] }));
  let t = e;
  return t;
})();
Om()
  .bootstrapModule(yy, { ngZoneEventCoalescing: !0 })
  .catch((t) => console.error(t));
