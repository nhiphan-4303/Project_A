!(function () {
  let d = null,
    c = ["debug", "info", "warn", "error"],
    l = c.reduce(
      (e, a, t) => (
        (e[a] = function () {
          var n = "debug" === a ? "log" : a;
          if (d && console && "function" == typeof console[n]) {
            var e = c.indexOf(d.toString().toLocaleLowerCase());
            if (!0 === d || (-1 < e && e <= t)) {
              for (
                var i = arguments.length, o = new Array(i), r = 0;
                r < i;
                r++
              )
                o[r] = arguments[r];
              let [e, ...t] = [...o];
              console[n](a.toUpperCase() + " - (TTD) " + e, ...t);
            }
          }
        }),
        e
      ),
      {}
    );
  function e(e) {
    d = e;
  }
  let s = null,
    o = {},
    u = {},
    p = {},
    f = {};
  function t(e) {
    var t = e[0],
      e = e[1];
    if ("setIdentifier" !== t) throw "method not implemented";
    i(e);
  }
  function r(e, t) {
    n(t),
      (function i(e, o) {
        let r = g(e, o, s.triggerElements);
        let t = g(e, o, s.cssSelectors);
        u[o] = u[o] || [];
        p[o] = p[o] || [];
        f[o] = f[o] || [];
        for (var n of t)
          n && n.tagName && "INPUT" === n.tagName && p[o].push(n);
        l.debug(`triggers ["${o}"] `, r);
        l.debug(`validInputs ["${o}"] `, t);
        r.forEach((e) => {
          u[o].push(e);
        });
        for (let n = 0; n < r.length; n++) {
          var a = function () {
            try {
              l.debug(
                "Detect event: ",
                s.detectionEventType,
                "on element, ",
                r[n]
              );
              let e = Object.entries(p)
                .map((e) => e[1])
                .flatMap((e) => e);
              for (var t of e) {
                let e = t.value.trim();
                if (m(e)) {
                  l.debug("We detected: ", e), v();
                  break;
                }
              }
            } catch (e) {}
          };
          f[o].push(a),
            r[n].addEventListener(s.detectionEventType, a, {
              once: !0,
              capture: !0,
            });
        }
        let d = w(e);
        for (let n = 0; n < d.length; n++) {
          let e = d[n],
            t = o + "/shadow_root_" + n;
          i(e, t), h(e, t);
        }
      })(e, t);
  }
  function v() {
    if ((l.debug("Detection stopped."), s.detectDynamicNodes)) {
      l.debug("Checking for dynamically added elements is turned off.");
      for (var [e, t] of Object.entries(o)) t && t.disconnect(), (o = {});
    }
    n("all");
  }
  function n(e) {
    if ((l.debug(`clearing detection hooks (${e})`), "all" === e)) {
      for (var [t, n] of Object.entries(u))
        if (n)
          for (let e = 0; e < n.length; e++)
            n[e].removeEventListener(s.detectionEventType, f[t][e], {
              capture: !0,
            });
      (u = {}), (f = []);
    } else {
      var i,
        o,
        r = [];
      for ([i, o] of Object.entries(u))
        if (i.startsWith(e)) {
          if (o)
            for (let e = 0; e < o.length; e++)
              o[e].removeEventListener(s.detectionEventType, f[i][e], {
                capture: !0,
              });
          r.push(i);
        }
      for (let e = 0; e < r.length; e++) {
        var a = r[e];
        (u[a] = []), (f[a] = []);
      }
    }
  }
  function m(e) {
    return (
      (function (e) {
        var t =
          /((([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,}))/i;
        if (s.detectionSubject.includes("email") && t.test(e))
          return (
            (e = e.match(t)[0].toLowerCase().trim()),
            l.debug("We detected email: " + e),
            a(e, "email"),
            !0
          );
        return !1;
      })(e) || !1
    );
  }
  function h(n, i) {
    s.detectDynamicNodes &&
      ((o[i] = new _(function (e, t) {
        l.debug("Detected dynamically added nodes."), r(n, i);
      }, 500)),
      o[i].observe(n, { childList: !0, subtree: !0, attributes: !0 }));
  }
  function i(e) {
    e && e.type && e.identifier
      ? "email" !== e.type
        ? l.error("Identifier type is not supported, ", e.type)
        : (a(e.identifier, e.type), v())
      : l.error("wrong identifier format");
  }
  function a(e, t) {
    var n;
    e &&
      t &&
      ((n = new CustomEvent("detected-identifier", {
        detail: { identifier: e, type: t },
      })),
      l.info("Dispatched event with identifier: ", e, " and type: ", t),
      window.dispatchEvent(n));
  }
  function y(e) {
    if (e && e.__upixel_detection)
      try {
        r(e.__upixel_detection.root, e.__upixel_detection.scopeName);
      } catch (e) {}
  }
  function g(t, n, i) {
    l.debug(`collectElements("${n}", ${i})`);
    let o = [];
    for (var e of i)
      0 < e.length &&
        (e = t.querySelectorAll(e)) &&
        e.forEach((e) => {
          o.includes(e) || o.push(e);
        });
    var r = window.location.hostname,
      a = document.getElementsByTagName("iframe");
    for (let e = 0; e < a.length; e++) {
      var d = a[e];
      if (
        (function (e, t) {
          if (t.src)
            try {
              var n = e === new URL(t.html).hostname;
              return n && l.debug("Iframe " + t.src + " can be accessed"), n;
            } catch (e) {
              l.debug("error: ", e);
            }
        })(r, d) &&
        ((d.__upixel_detection = { root: t, scopeName: n + "/iframe" }),
        d.removeEventListener("load", y),
        d.addEventListener("load", y),
        d.contentDocument)
      )
        for (var c of i)
          0 < c.length &&
            d.contentDocument.querySelectorAll(c).forEach((e) => {
              o.includes(e) || o.push(e);
            });
    }
    return o;
  }
  function w(e) {
    return [...e.querySelectorAll("*")]
      .filter((e) => !!e.shadowRoot)
      .map((e) => e.shadowRoot);
  }
  function _(e, t) {
    (this.callback = e),
      (this.minDelayMs = t),
      (this.lastInvocationTime = 0),
      (this.args = null),
      (this.nextTimeoutHandle = null),
      (this.mutationObserver = new MutationObserver(
        this.throttledCallback.bind(this)
      ));
  }
  (_.prototype.observe = function (e, t) {
    this.mutationObserver.observe(e, t);
  }),
    (_.prototype.disconnect = function () {
      null != this.nextTimeoutHandle && clearTimeout(this.nextTimeoutHandle),
        this.mutationObserver.disconnect();
    }),
    (_.prototype.takeRecords = function () {
      return this.mutationObserver.takeRecords();
    }),
    (_.prototype.throttledCallback = function (e, t) {
      var n = Date.now();
      null != this.args
        ? (this.args = arguments)
        : this.lastInvocationTime + this.minDelayMs < n
        ? ((this.lastInvocationTime = n), this.callback(e, t))
        : ((this.args = arguments),
          (this.nextTimeoutHandle = setTimeout(
            function () {
              (this.lastInvocationTime = Date.now()),
                (this.nextTimeoutHandle = null),
                this.callback.apply(null, this.args),
                (this.args = null);
            }.bind(this),
            this.minDelayMs
          )));
    }),
    (window.ttdPixel = window.ttdPixel || {}),
    (window.ttdPixel.startDetection = function (e) {
      (s = e),
        l.info(
          "Detection started! Library is configured to detect: ",
          s.detectionSubject
        ),
        l.info("Detection event type is ", s.detectionEventType),
        l.debug("Full config: ", s),
        "onclick" === s.detectionEventType && (s.detectionEventType = "click"),
        "onsubmit" === s.detectionEventType || "click" === s.detectionEventType
          ? (e = document.querySelector("body")) &&
            (r(e, "document"), s.detectDynamicNodes) &&
            h(e, "document")
          : l.debug(
              "Detection type not supported! We will not start auto detection."
            ),
        (window.ttdPixelEventsLayer = window.ttdPixelEventsLayer || []),
        window.ttdPixelEventsLayer.forEach(t),
        (window.ttdPixelEventsLayer.push = function (e) {
          return (
            Array.prototype.push.call(window.ttdPixelEventsLayer, e),
            t(e),
            this.length
          );
        });
    }),
    (window.ttdPixel.setIdentifier = i),
    (window.ttdPixel.enableDebug = () => e("debug")),
    (window.ttdPixel.disableLog = () => e(null));
})();
var ttd_dom_ready = (function () {
  var t,
    n,
    i = {
      "[object Boolean]": "boolean",
      "[object Number]": "number",
      "[object String]": "string",
      "[object Function]": "function",
      "[object Array]": "array",
      "[object Date]": "date",
      "[object RegExp]": "regexp",
      "[object Object]": "object",
    },
    s = {
      isReady: !1,
      readyWait: 1,
      holdReady: function (e) {
        e ? s.readyWait++ : s.ready(!0);
      },
      ready: function (e) {
        if ((!0 === e && !--s.readyWait) || (!0 !== e && !s.isReady)) {
          if (!document.body) return setTimeout(s.ready, 1);
          ((s.isReady = !0) !== e && 0 < --s.readyWait) ||
            t.resolveWith(document, [s]);
        }
      },
      bindReady: function () {
        if (!t) {
          if (((t = s._Deferred()), "complete" === document.readyState))
            return setTimeout(s.ready, 1);
          if (document.addEventListener)
            document.addEventListener("DOMContentLoaded", n, !1),
              window.addEventListener("load", s.ready, !1);
          else if (document.attachEvent) {
            document.attachEvent("onreadystatechange", n),
              window.attachEvent("onload", s.ready);
            var e = !1;
            try {
              e = null == window.frameElement;
            } catch (e) {}
            document.documentElement.doScroll && e && o();
          }
        }
      },
      _Deferred: function () {
        var a,
          n,
          d,
          c = [],
          l = {
            done: function () {
              if (!d) {
                var e,
                  t,
                  n,
                  i,
                  o,
                  r = arguments;
                for (a && ((o = a), (a = 0)), e = 0, t = r.length; e < t; e++)
                  "array" === (i = s.type((n = r[e])))
                    ? l.done.apply(l, n)
                    : "function" === i && c.push(n);
                o && l.resolveWith(o[0], o[1]);
              }
              return this;
            },
            resolveWith: function (e, t) {
              if (!d && !a && !n) {
                (t = t || []), (n = 1);
                try {
                  for (; c[0]; ) c.shift().apply(e, t);
                } finally {
                  (a = [e, t]), (n = 0);
                }
              }
              return this;
            },
            resolve: function () {
              return l.resolveWith(this, arguments), this;
            },
            isResolved: function () {
              return !(!n && !a);
            },
            cancel: function () {
              return (d = 1), (c = []), this;
            },
          };
        return l;
      },
      type: function (e) {
        return null == e
          ? String(e)
          : i[Object.prototype.toString.call(e)] || "object";
      },
    };
  function o() {
    if (!s.isReady) {
      try {
        document.documentElement.doScroll("left");
      } catch (e) {
        return void setTimeout(o, 1);
      }
      s.ready();
    }
  }
  return (
    document.addEventListener
      ? (n = function () {
          document.removeEventListener("DOMContentLoaded", n, !1), s.ready();
        })
      : document.attachEvent &&
        (n = function () {
          "complete" === document.readyState &&
            (document.detachEvent("onreadystatechange", n), s.ready());
        }),
    function (e) {
      s.bindReady(), s.type(e), t.done(e);
    }
  );
})();
function TTDUniversalPixelApi(e) {
  return new _TTDUniversalPixelApi_1_1_6(e);
}
function _TTDUniversalPixelApi_1_1_6(q) {
  var $ = "1.1.0";
  function B(e) {
    return new URL(e.html).hostname;
  }
  async function d(a, d, c, e, t, l) {
    (this._uid2SdkListenerLock = {}),
      (this.setupUid2Sdk = function (e, i, o) {
        void 0 === this._uid2SdkListenerLock[e] &&
          ((this._uid2SdkListenerLock[e] = 1),
          void 0 === window.__uid2 &&
          void 0 === window.ttdPixel.uid2SdkLoaderPromise
            ? (window.ttdPixel.uid2SdkLoaderPromise = new Promise((e, t) => {
                var n = document.createElement("script");
                n.setAttribute("defer", !0),
                  n.setAttribute(
                    "src",
                    "../cdn.prod.uidapi.com/uid2-sdk-3.2.0.js"
                  ),
                  n.addEventListener("load", () => {
                    e(), i();
                  }),
                  n.addEventListener("error", (e) => {
                    t(e), o(e);
                  }),
                  document.body.appendChild(n);
              }))
            : (async () => {
                try {
                  await window.ttdPixel.uid2SdkLoaderPromise, i();
                } catch (e) {
                  console.warn("Failed to load uid2 sdk: ", e);
                }
              })());
      });
    var s = document.getElementsByTagName("body")[0];
    if (s) {
      var u = "",
        p = { MonetaryValue: "v", MonetaryValueFormat: "vf" },
        f = [];
      if ("undefined" != typeof _pixelParams)
        for (var v in _pixelParams) {
          var m = _pixelParams[v],
            v = p[v];
          v &&
            m &&
            !/%%.*%%/i.test(m) &&
            f.push(v + "=" + encodeURIComponent(m));
        }
      var h = "adv=" + a,
        y = "upid=" + d.join(","),
        g = q || F(),
        u =
          c + "?" + h + "&ref=" + encodeURIComponent(g) + "&" + y + "&upv=" + $;
      if (e) for (var w in e) u = u + "&" + w + "=" + e[w];
      0 < f.length && (u = u + "&" + f.join("&")),
        navigator.joinAdInterestGroup && (u += "&paapi=1"),
        localStorage.getItem("UID2-sdk-identity") && (u += "&uidcs=1");
      let n,
        i = new Promise((e, t) => {
          n = e;
        });
      var _ = null,
        b = !1,
        E = null;
      "function" == typeof __tcfapi
        ? ((S = setTimeout(N, 1e3)), __tcfapi("addEventListener", 2, H))
        : "function" == typeof __cmp
        ? ((_ = setTimeout(U, 1e3)), __cmp("ping", null, j))
        : "function" == typeof __gpp
        ? void 0 !== (h = x()).gppString
          ? W(h.gppString, h.gppSid)
          : ((D = setTimeout(I, 1e3)), __gpp("addEventListener", P))
        : R();
      let o = !1;
      void 0 !== t && (o = !0);
      let r = a + ":" + d.join(",");
      o
        ? this.setupUid2Sdk(
            r,
            () => k(t),
            (e) => {
              console.warn("UID2 enabled but failed to register hooks: ", e);
            }
          )
        : window.addEventListener("message", (t) => {
            try {
              if (null !== t.origin && "null" !== t.origin) {
                 var e=new URL(t-2.html);
                if (
                  e.hostname.endsWith(".adsrvr.org") &&
                  !o &&
                  "string" == typeof t.data
                ) {
                  let e = JSON.parse(t.data);
                  e.type &&
                    "string" == typeof e.type &&
                    "UID2" === e.type &&
                    e.advertiserId &&
                    "string" == typeof e.advertiserId &&
                    e.advertiserId == a &&
                    this.setupUid2Sdk(
                      r,
                      () => k(e),
                      (e) => {
                        console.warn(
                          "UID2 enabled but failed to register hooks: ",
                          e
                        );
                      }
                    );
                }
              }
            } catch (e) {}
          });
      var D = null,
        L = !1,
        S = null,
        T = !1;
      function k(d) {
        try {
          window.__uid2.callbacks.push(async (e, t) => {
            switch (e) {
              case "SdkLoaded":
                try {
                  (window.__ttd_m_invoke_once =
                    window.__ttd_m_invoke_once || {}),
                    window.__ttd_m_invoke_once._uid2_init ||
                      ((window.__ttd_m_invoke_once._uid2_init = 1),
                      d.baseUrl ||
                        (d.baseUrl = "https://global.prod.uidapi.com/"),
                      __uid2.init({ baseUrl: d.baseUrl }));
                } catch (e) {
                  console.info(
                    "Non-TTD actor initialized UID2 SDK, mind the consistency of UID2 baseUrl."
                  );
                }
                break;
              case "InitCompleted":
                var n = () => t.identity,
                  i = d;
                try {
                  var o,
                    r,
                    a = n();
                  a
                    ? l
                      ? await M(a.advertising_token)
                      : await C(a.advertising_token)
                    : window.ttdPixel.activeDetection ||
                      ((o = new Promise((t) => {
                        window.addEventListener(
                          "detected-identifier",
                          function (e) {
                            t(e.detail.identifier),
                              (window.ttdPixel.activeDetection = null);
                          }
                        ),
                          window.ttdPixel.startDetection(i);
                      })),
                      (r = await (window.ttdPixel.activeDetection = o)),
                      await window.__uid2.setIdentityFromEmail(r, i));
                } catch (e) {
                  console.warn("error setting up fireOrDetact: ", e);
                }
                await 0;
                break;
              case "IdentityUpdated":
                l
                  ? await M(t.identity.advertising_token)
                  : await C(t.identity.advertising_token);
            }
          });
        } catch (e) {
          console.warn("Did not setup uid2 hooks: ", e);
        }
      }
      function x() {
        var e,
          t = __gpp("getGPPData"),
          t = {
            gppString: t?.gppString,
            gppSid: t?.applicableSections?.join(","),
          };
        return (
          void 0 === t.gppString &&
            ((e = __gpp("ping")),
            (t.gppString = e?.gppString),
            (t.gppSid = e?.applicableSections?.join(","))),
          t
        );
      }
      function P(e, t) {
        var n;
        L
          ? __gpp("removeEventListener", function () {}, e.listenerId)
          : "signalStatus" === e.eventName &&
            "ready" === e.data &&
            ((n = x()),
            clearTimeout(D),
            (E = new Date()),
            W(n.gppString, n.gppSid),
            __gpp("removeEventListener", function () {}, e.listenerId));
      }
      function I() {
        (L = !0), R();
      }
      function U() {
        (b = !0), R();
      }
      function j(e) {
        b ||
          (e.cmpLoaded || e.gdprAppliesGlobally
            ? (clearTimeout(_),
              (E = new Date()),
              __cmp("getConsentData", null, R))
            : setTimeout(function () {
                __cmp("ping", null, j);
              }, 200));
      }
      function R(e) {
        null != E && (u = u + "&ret=" + (new Date() - E)),
          b && (u += "&pto=1"),
          null != e &&
            (u =
              u +
              "&gdpr=" +
              (e.gdprApplies ? "1" : "0") +
              "&gdpr_consent=" +
              e.consentData),
          A();
      }
      function A() {
        var e = "universal_pixel_" + d.join("_");
        n(u), O(u, e, "TTD Universal Pixel");
      }
      async function C(e, t) {
        O(
          (await i) + "&uiddt=" + e + "&uidcs=" + t,
          "universal_pixel_" + d.join("_") + "_uid",
          "TTD Universal Pixel with UID"
        );
      }
      function O(e, t, n) {
        let i = document.getElementById(t);
        for (
          ;
          i && i.parentElement.removeChild(i), (i = document.getElementById(t));

        );
        let o = document.createElement("iframe");
        function r() {
          s.appendChild(o);
        }
        o.setAttribute("id", t),
          o.setAttribute("height", 0),
          o.setAttribute("width", 0),
          o.setAttribute("style", "display:none;"),
          o.setAttribute("src", e),
          o.setAttribute("title", n),
          "complete" === document.readyState
            ? setTimeout(r, 0)
            : window.addEventListener
            ? window.addEventListener("load", r)
            : window.attachEvent
            ? window.attachEvent("onload", r)
            : r();
      }
      function N() {
        (T = !0), R();
      }
      function H(e, t) {
        T
          ? __tcfapi("removeEventListener", 2, function (e) {}, e.listenerId)
          : t &&
            (clearTimeout(S),
            (t = e),
            null != E && (u = u + "&ret=" + (new Date() - E)),
            T && (u += "&pto=1"),
            null != t &&
              (u =
                u +
                "&gdpr=" +
                (function (e) {
                  return e ? "1" : "0";
                })(t.gdprApplies) +
                "&gdpr_consent=" +
                t.tcString),
            A(),
            (E = new Date()),
            __tcfapi("removeEventListener", 2, function (e) {}, e.listenerId));
      }
      function W(e, t) {
        null != E && (u = u + "&ret=" + (new Date() - E)),
          null != e && (u = u + "&gpp_consent=" + e),
          null != t && (u = u + "&gpp_sid=" + t),
          A();
      }
      async function M(e) {
        var t = {};
        (t.adv = a),
          (t.referrer_url = q || F()),
          (t.upixel_id = d[0]),
          e && (t.uid2_token = e);
        let i = { data: [{ ...t }] },
          o = `https://${B(c)}/track/realtimeconversion`;
        return new Promise((e, t) => {
          let n = new XMLHttpRequest();
          (n.withCredentials = !0),
            n.open("POST", o),
            n.setRequestHeader("Content-type", "application/json"),
            n.setRequestHeader("eventDataSource", "UpSdk"),
            n.setRequestHeader("eventDataSourceVersion", $),
            (n.onload = () => {
              (200 <= n.status && n.status < 300 ? e : t)(n.response);
            }),
            (n.onerror = () => t(n.statusText)),
            n.send(JSON.stringify(i));
        });
      }
    }
  }
  function F() {
    var e,
      t = window,
      n = "",
      i = !1;
    try {
      top.location.href && (n = top.location.href);
    } catch (e) {
      i = !0;
    }
    if (i)
      for (;;)
        try {
          if (((n = t.document.referrer), window.parent == t)) break;
          t = window.parent;
        } catch (e) {
          break;
        }
    return (
      -1 < n.indexOf("cloudfront.net") &&
        ((i = n),
        (e = (e = "url").replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")),
        (n =
          (null === (e = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(i))
            ? ""
            : decodeURIComponent(e[1].replace(/\+/g, " "))) || n)),
      n
    );
  }
  this.init = async function (t, n, i, o, r, a) {
    if (
      ("string" == typeof arguments[3] ||
        (!arguments[3] && 7 <= arguments.length)) &&
      ((arguments[3] = null), 4 < arguments.length)
    ) {
      for (var e = 4; e < arguments.length; e++)
        arguments[e - 1] = arguments[e];
      delete arguments[arguments.length - 1];
    }
    if (t && "" != t && n && !(n.length <= 0)) {
      let e = i;
      a && ((i = B(i)), (e = `https://${i}/track/cei`)),
        await d(t, n, e, o, r, a);
    }
  };
}
//# sourceMappingURL=up_loader.1.1.0.min.js.map
