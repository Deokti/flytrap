function isMobileByScreen() {
  const {userAgent, platform, maxTouchPoints, userAgentData} = window.navigator;

  const isIOS = /(iphone|ipod|ipad)/i.test(userAgent);
  const _platform = platform || userAgentData.platform;

  const isIpad = _platform === 'iPad' || (_platform === 'MacIntel' && maxTouchPoints > 0 && !window.MSStream);
  const isAndroid = /android/i.test(userAgent);

  return isAndroid || isIOS || isIpad;
}

function getPerformance() {
  return window.performance
    || window.mozPerformance
    || window.msPerformance
    || window.webkitPerformance
    || {};
}

function detectGPU() {
  let canvas = document.createElement('canvas');
  let performance = getPerformance();
  let data = {};
  let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    data["dbgRenderInfo"] = debugInfo;
    data["UNMASKED_VENDOR_WEBGL"] = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    data["UNMASKED_RENDERER_WEBGL"] = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    data["VENDOR"] = gl.getParameter(gl.VENDOR);
    data["RENDERER"] = gl.getParameter(gl.VENDOR);
  }

  data["performance"] = performance;
  return data;
}

function detectScreen() {
  let data = {};

  data["height"] = screen.height; // Device screen height (i.e. all physically visible stuff)
  data["width"] = screen.width;  // Device screen width (that is, all physically visible stuff).

  data["availHeight"] = screen.availHeight; // Device screen height minus the operating system taskbar (if present).
  data["availWidth"] = screen.availWidth;  // Device screen width, minus the operating system taskbar (if present).

  data["clientHeight"] = document.body.clientHeight; // Inner height of the HTML document body, including padding but not the horizontal scrollbar height, border, or margin.
  data["clientWidth"] = document.body.clientWidth;  // Full width of the HTML page as coded, minus the vertical scroll bar.

  data["innerHeight"] = window.innerHeight; // The current document's viewport height, minus taskbars, and so on.
  data["innerWidth"] = window.innerWidth;  // The browser viewport width (including vertical scroll bar, includes padding but not border or margin).

  data["outerHeight"] = window.outerHeight; // Height the current window visibly takes up on screen (including taskbars, menus, and so on.)
  data["outerWidth"] = window.outerWidth;  // The outer window width (including vertical scroll bar, toolbars, etc., includes padding and border but not margin).

  data["isMobile"] = isMobileByScreen();

  return data;
}

function detectBattery(callback) {
  let success = function (battery) {
    if (battery) {
      function setStatus() {
        console.log("Set status");

        callback({
          "batteryLevel": Math.round(battery.level * 100) + "%",
          "chargingStatus": (battery.charging) ? "" : "not ",
          "batteryCharged": (battery.chargingTime === "Infinity") ? "Infinity" : parseInt(battery.chargingTime / 60, 10),
          "batteryDischarged": (battery.dischargingTime == "Infinity") ? "Infinity" : parseInt(battery.dischargingTime / 60, 10)
        });
      }

      // Set initial status
      setStatus();

      // Set events
      battery.addEventListener("levelchange", setStatus, false);
      battery.addEventListener("chargingchange", setStatus, false);
      battery.addEventListener("chargingtimechange", setStatus, false);
      battery.addEventListener("dischargingtimechange", setStatus, false);
    } else {
      callback({"error": "Battery API not supported on your device/computer"});
    }
  }
  let noGood = function (error) {
    callback({"error": error.message});
  };
  try {
    navigator.getBattery() //returns a promise
      .then(success)
      .catch(noGood);

  } catch (error) {
    callback({"error": error.message});
    console.warn(error.message);
  }
}

// хз что это но оно работает
function navigation_mode(callback) {
  var nm_sendData = function (data) {
    callback({'d': data, 'dn': navigator.doNotTrack});
  }

  function ifIncognito(incog, func) {
    var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (!fs) {
      var db = indexedDB.open("test");
      db.onerror = function () {
        nm_sendData('incognito')
        var storage = window.sessionStorage;
        try {
          storage.setItem("p123", "test");
          storage.remododo325em("p123");
        } catch (e) {
          if (e.code === DOMException.QUOTA_EXCEEDED_ERR && storage.length === 0) {
            nm_sendData('incognito')
          }
        }
      };
      db.onsuccess = function () {
        nm_sendData('normal')
      };
    } else {
      if (incog) fs(window.TEMPORARY, 100, () => {
      }, func); else fs(window.TEMPORARY, 100, func, () => {
      });
    }
  }

  ifIncognito(true, () => {
    nm_sendData('incognito')
  });
  ifIncognito(false, () => {
    nm_sendData('normal')
  })
}

function getNavigatorData() {
  return {
    "appCodeName": navigator.appCodeName, // Устарело
    "appName": navigator.appName, // Устарело
    "appVersion": navigator.appVersion, // Устарело
    "buildID": navigator.buildID,
    "cookieEnabled": navigator.cookieEnabled,
    "doNotTrack": navigator.doNotTrack,
    "hardwareConcurrency": navigator.hardwareConcurrency,
    "language": navigator.language,
    "languages": navigator.languages,
    "maxTouchPoints": navigator.maxTouchPoints,
    "onLine": navigator.onLine,
    "oscpu": navigator.oscpu,
    "pdfViewerEnabled": navigator.pdfViewerEnabled,
    "platform": navigator.platform,
    "product": navigator.product,
    "productSub": navigator.productSub,
    "userAgent": navigator.userAgent,
    "vendor": navigator.vendor,
    "vendorSub": navigator.vendorSub,
    "webdriver": navigator.webdriver,
    "javaEnabled": navigator.javaEnabled(),
  }
}

function getNetworkInfo() {
  if (!navigator.connection) return false;

  return {
    "type": navigator.connection.type, "downlink": navigator.connection.downlink, // ' Mb/s'
    "rtt": navigator.connection.rtt, // ms
    "downlinkMax": navigator.connection.downlinkMax, // Mb/s
    "effectiveType": navigator.connection.effectiveType, "saveData": navigator.connection.saveData,
  }
}

function getJSVersion() {
  const versions = ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2.0"];
  const _length = versions.length;
  const tagScript = document.getElementsByTagName('script')[0];

  // Как глобальная переменная в window
  globalJSVersion = "";

  for (i = 0; i < _length; i++) {
    const g = document.createElement('script');

    g.setAttribute("language", "JavaScript" + versions[i]);

    // Перезаписывает globalJSVersion версией пользователя
    g.text = "globalJSVersion='" + versions[i] + "';";
    tagScript.parentNode.insertBefore(g, tagScript);
  }

  return globalJSVersion;
}

// detectPublicIP(sendData)
// https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript
// ---------------------------------------------------------------
function getJSON(url, callback, error_callback = undefined) {
  $.getJSON(url, callback)
    .fail(function () {
      if (error_callback === undefined) {
        callback({});
      } else {
        error_callback({});
      }
    });
}

function detectPublicIP(callback) { // callback
                                    // Может узнать использует ли человек tor или vpn
  getJSON('https://api.ipregistry.co/?key=tryout', callback, function (err) {
    getJSON('https://ipapi.co/json/', callback,)
  })
}
