var buzz = {
  defaults: {
    autoplay: false,
    duration: 5e3,
    formats: [],
    loop: false,
    placeholder: "--",
    preload: "metadata",
    volume: 80
  },
  types: {
    "mp3": "audio/mpeg",
    "ogg": "audio/ogg",
    "wav": "audio/wav",
    "aac": "audio/aac",
    "m4a": "audio/x-m4a"
  },
  sounds: [],
  el: document.createElement("audio"),
  sound: (function(src, options) {
    options = options || {};
    var pid = 0, events = [], eventsOnce = {}, supported = buzz.isSupported();
    this.load = (function() {
      if (!supported) {
        return this;
      }
      this.sound.load();
      return this;
    });
    this.play = (function() {
      if (!supported) {
        return this;
      }
      this.sound.play();
      return this;
    });
    this.togglePlay = (function() {
      if (!supported) {
        return this;
      }
      if (this.sound.paused) {
        this.sound.play();
      } else {
        this.sound.pause();
      }
      return this;
    });
    this.pause = (function() {
      if (!supported) {
        return this;
      }
      this.sound.pause();
      return this;
    });
    this.isPaused = (function() {
      if (!supported) {
        return null;
      }
      return this.sound.paused;
    });
    this.stop = (function() {
      if (!supported) {
        return this;
      }
      this.setTime(this.getDuration());
      this.sound.pause();
      return this;
    });
    this.isEnded = (function() {
      if (!supported) {
        return null;
      }
      return this.sound.ended;
    });
    this.loop = (function() {
      if (!supported) {
        return this;
      }
      this.sound.loop = "loop";
      this.bind("ended.buzzloop", (function() {
        this.currentTime = 0;
        this.play();
      }));
      return this;
    });
    this.unloop = (function() {
      if (!supported) {
        return this;
      }
      this.sound.removeAttribute("loop");
      this.unbind("ended.buzzloop");
      return this;
    });
    this.mute = (function() {
      if (!supported) {
        return this;
      }
      this.sound.muted = true;
      return this;
    });
    this.unmute = (function() {
      if (!supported) {
        return this;
      }
      this.sound.muted = false;
      return this;
    });
    this.toggleMute = (function() {
      if (!supported) {
        return this;
      }
      this.sound.muted = !this.sound.muted;
      return this;
    });
    this.isMuted = (function() {
      if (!supported) {
        return null;
      }
      return this.sound.muted;
    });
    this.setVolume = (function(volume) {
      if (!supported) {
        return this;
      }
      if (volume < 0) {
        volume = 0;
      }
      if (volume > 100) {
        volume = 100;
      }
      this.volume = volume;
      this.sound.volume = volume / 100;
      return this;
    });
    this.getVolume = (function() {
      if (!supported) {
        return this;
      }
      return this.volume;
    });
    this.increaseVolume = (function(value) {
      return this.setVolume(this.volume + (value || 1));
    });
    this.decreaseVolume = (function(value) {
      return this.setVolume(this.volume - (value || 1));
    });
    this.setTime = (function(time) {
      if (!supported) {
        return this;
      }
      this.whenReady((function() {
        this.sound.currentTime = time;
      }));
      return this;
    });
    this.getTime = (function() {
      if (!supported) {
        return null;
      }
      var time = Math.round(this.sound.currentTime * 100) / 100;
      return isNaN(time) ? buzz.defaults.placeholder : time;
    });
    this.setPercent = (function(percent) {
      if (!supported) {
        return this;
      }
      return this.setTime(buzz.fromPercent(percent, this.sound.duration));
    });
    this.getPercent = (function() {
      if (!supported) {
        return null;
      }
      var percent = Math.round(buzz.toPercent(this.sound.currentTime, this.sound.duration));
      return isNaN(percent) ? buzz.defaults.placeholder : percent;
    });
    this.setSpeed = (function(duration) {
      if (!supported) {
        return this;
      }
      this.sound.playbackRate = duration;
    });
    this.getSpeed = (function() {
      if (!supported) {
        return null;
      }
      return this.sound.playbackRate;
    });
    this.getDuration = (function() {
      if (!supported) {
        return null;
      }
      var duration = Math.round(this.sound.duration * 100) / 100;
      return isNaN(duration) ? buzz.defaults.placeholder : duration;
    });
    this.getPlayed = (function() {
      if (!supported) {
        return null;
      }
      return timerangeToArray(this.sound.played);
    });
    this.getBuffered = (function() {
      if (!supported) {
        return null;
      }
      return timerangeToArray(this.sound.buffered);
    });
    this.getSeekable = (function() {
      if (!supported) {
        return null;
      }
      return timerangeToArray(this.sound.seekable);
    });
    this.getErrorCode = (function() {
      if (supported && this.sound.error) {
        return this.sound.error.code;
      }
      return 0;
    });
    this.getErrorMessage = (function() {
      if (!supported) {
        return null;
      }
      switch (this.getErrorCode()) {
       case 1:
        return "MEDIA_ERR_ABORTED";
       case 2:
        return "MEDIA_ERR_NETWORK";
       case 3:
        return "MEDIA_ERR_DECODE";
       case 4:
        return "MEDIA_ERR_SRC_NOT_SUPPORTED";
       default:
        return null;
      }
    });
    this.getStateCode = (function() {
      if (!supported) {
        return null;
      }
      return this.sound.readyState;
    });
    this.getStateMessage = (function() {
      if (!supported) {
        return null;
      }
      switch (this.getStateCode()) {
       case 0:
        return "HAVE_NOTHING";
       case 1:
        return "HAVE_METADATA";
       case 2:
        return "HAVE_CURRENT_DATA";
       case 3:
        return "HAVE_FUTURE_DATA";
       case 4:
        return "HAVE_ENOUGH_DATA";
       default:
        return null;
      }
    });
    this.getNetworkStateCode = (function() {
      if (!supported) {
        return null;
      }
      return this.sound.networkState;
    });
    this.getNetworkStateMessage = (function() {
      if (!supported) {
        return null;
      }
      switch (this.getNetworkStateCode()) {
       case 0:
        return "NETWORK_EMPTY";
       case 1:
        return "NETWORK_IDLE";
       case 2:
        return "NETWORK_LOADING";
       case 3:
        return "NETWORK_NO_SOURCE";
       default:
        return null;
      }
    });
    this.set = (function(key, value) {
      if (!supported) {
        return this;
      }
      this.sound[key] = value;
      return this;
    });
    this.get = (function(key) {
      if (!supported) {
        return null;
      }
      return key ? this.sound[key] : this.sound;
    });
    this.bind = (function(types, func) {
      if (!supported) {
        return this;
      }
      types = types.split(" ");
      var that = this, efunc = (function(e) {
        func.call(that, e);
      });
      for (var t = 0; t < types.length; t++) {
        var type = types[t], idx = type;
        type = idx.split(".")[0];
        events.push({
          idx: idx,
          func: efunc
        });
        this.sound.addEventListener(type, efunc, true);
      }
      return this;
    });
    this.unbind = (function(types) {
      if (!supported) {
        return this;
      }
      types = types.split(" ");
      for (var t = 0; t < types.length; t++) {
        var idx = types[t], type = idx.split(".")[0];
        for (var i = 0; i < events.length; i++) {
          var namespace = events[i].idx.split(".");
          if (events[i].idx == idx || namespace[1] && namespace[1] == idx.replace(".", "")) {
            this.sound.removeEventListener(type, events[i].func, true);
            events.splice(i, 1);
          }
        }
      }
      return this;
    });
    this.bindOnce = (function(type, func) {
      if (!supported) {
        return this;
      }
      var that = this;
      eventsOnce[pid++] = false;
      this.bind(pid + type, (function() {
        if (!eventsOnce[pid]) {
          eventsOnce[pid] = true;
          func.call(that);
        }
        that.unbind(pid + type);
      }));
    });
    this.trigger = (function(types) {
      if (!supported) {
        return this;
      }
      types = types.split(" ");
      for (var t = 0; t < types.length; t++) {
        var idx = types[t];
        for (var i = 0; i < events.length; i++) {
          var eventType = events[i].idx.split(".");
          if (events[i].idx == idx || eventType[0] && eventType[0] == idx.replace(".", "")) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(eventType[0], false, true);
            this.sound.dispatchEvent(evt);
          }
        }
      }
      return this;
    });
    this.fadeTo = (function(to, duration, callback) {
      if (!supported) {
        return this;
      }
      if (duration instanceof Function) {
        callback = duration;
        duration = buzz.defaults.duration;
      } else {
        duration = duration || buzz.defaults.duration;
      }
      var from = this.volume, delay = duration / Math.abs(from - to), that = this;
      this.play();
      function doFade() {
        setTimeout((function() {
          if (from < to && that.volume < to) {
            that.setVolume(that.volume += 1);
            doFade();
          } else if (from > to && that.volume > to) {
            that.setVolume(that.volume -= 1);
            doFade();
          } else if (callback instanceof Function) {
            callback.apply(that);
          }
        }), delay);
      }
      this.whenReady((function() {
        doFade();
      }));
      return this;
    });
    this.fadeIn = (function(duration, callback) {
      if (!supported) {
        return this;
      }
      return this.setVolume(0).fadeTo(100, duration, callback);
    });
    this.fadeOut = (function(duration, callback) {
      if (!supported) {
        return this;
      }
      return this.fadeTo(0, duration, callback);
    });
    this.fadeWith = (function(sound, duration) {
      if (!supported) {
        return this;
      }
      this.fadeOut(duration, (function() {
        this.stop();
      }));
      sound.play().fadeIn(duration);
      return this;
    });
    this.whenReady = (function(func) {
      if (!supported) {
        return null;
      }
      var that = this;
      if (this.sound.readyState === 0) {
        this.bind("canplay.buzzwhenready", (function() {
          func.call(that);
        }));
      } else {
        func.call(that);
      }
    });
    function timerangeToArray(timeRange) {
      var array = [], length = timeRange.length - 1;
      for (var i = 0; i <= length; i++) {
        array.push({
          start: timeRange.start(length),
          end: timeRange.end(length)
        });
      }
      return array;
    }
    function getExt(filename) {
      return filename.split(".").pop();
    }
    function addSource(sound, src) {
      var source = document.createElement("source");
      source.src = src;
      if (buzz.types[getExt(src)]) {
        source.type = buzz.types[getExt(src)];
      }
      sound.appendChild(source);
    }
    if (supported) {
      for (var i in buzz.defaults) {
        if (buzz.defaults.hasOwnProperty(i)) {
          options[i] = options[i] || buzz.defaults[i];
        }
      }
      this.sound = document.createElement("audio");
      if (src instanceof Array) {
        for (var j in src) {
          if (src.hasOwnProperty(j)) {
            addSource(this.sound, src[j]);
          }
        }
      } else if (options.formats.length) {
        for (var k in options.formats) {
          if (options.formats.hasOwnProperty(k)) {
            addSource(this.sound, src + "." + options.formats[k]);
          }
        }
      } else {
        addSource(this.sound, src);
      }
      if (options.loop) {
        this.loop();
      }
      if (options.autoplay) {
        this.sound.autoplay = "autoplay";
      }
      if (options.preload === true) {
        this.sound.preload = "auto";
      } else if (options.preload === false) {
        this.sound.preload = "none";
      } else {
        this.sound.preload = options.preload;
      }
      this.setVolume(options.volume);
      buzz.sounds.push(this);
    }
  }),
  group: (function(sounds) {
    sounds = argsToArray(sounds, arguments);
    this.getSounds = (function() {
      return sounds;
    });
    this.add = (function(soundArray) {
      soundArray = argsToArray(soundArray, arguments);
      for (var a = 0; a < soundArray.length; a++) {
        sounds.push(soundArray[a]);
      }
    });
    this.remove = (function(soundArray) {
      soundArray = argsToArray(soundArray, arguments);
      for (var a = 0; a < soundArray.length; a++) {
        for (var i = 0; i < sounds.length; i++) {
          if (sounds[i] == soundArray[a]) {
            delete sounds[i];
            break;
          }
        }
      }
    });
    this.load = (function() {
      fn("load");
      return this;
    });
    this.play = (function() {
      fn("play");
      return this;
    });
    this.togglePlay = (function() {
      fn("togglePlay");
      return this;
    });
    this.pause = (function(time) {
      fn("pause", time);
      return this;
    });
    this.stop = (function() {
      fn("stop");
      return this;
    });
    this.mute = (function() {
      fn("mute");
      return this;
    });
    this.unmute = (function() {
      fn("unmute");
      return this;
    });
    this.toggleMute = (function() {
      fn("toggleMute");
      return this;
    });
    this.setVolume = (function(volume) {
      fn("setVolume", volume);
      return this;
    });
    this.increaseVolume = (function(value) {
      fn("increaseVolume", value);
      return this;
    });
    this.decreaseVolume = (function(value) {
      fn("decreaseVolume", value);
      return this;
    });
    this.loop = (function() {
      fn("loop");
      return this;
    });
    this.unloop = (function() {
      fn("unloop");
      return this;
    });
    this.setTime = (function(time) {
      fn("setTime", time);
      return this;
    });
    this.setduration = (function(duration) {
      fn("setduration", duration);
      return this;
    });
    this.set = (function(key, value) {
      fn("set", key, value);
      return this;
    });
    this.bind = (function(type, func) {
      fn("bind", type, func);
      return this;
    });
    this.unbind = (function(type) {
      fn("unbind", type);
      return this;
    });
    this.bindOnce = (function(type, func) {
      fn("bindOnce", type, func);
      return this;
    });
    this.trigger = (function(type) {
      fn("trigger", type);
      return this;
    });
    this.fade = (function(from, to, duration, callback) {
      fn("fade", from, to, duration, callback);
      return this;
    });
    this.fadeIn = (function(duration, callback) {
      fn("fadeIn", duration, callback);
      return this;
    });
    this.fadeOut = (function(duration, callback) {
      fn("fadeOut", duration, callback);
      return this;
    });
    function fn() {
      var args = argsToArray(null, arguments), func = args.shift();
      for (var i = 0; i < sounds.length; i++) {
        sounds[i][func].apply(sounds[i], args);
      }
    }
    function argsToArray(array, args) {
      return array instanceof Array ? array : Array.prototype.slice.call(args);
    }
  }),
  all: (function() {
    return new buzz.group(buzz.sounds);
  }),
  isSupported: (function() {
    return !!buzz.el.canPlayType;
  }),
  isOGGSupported: (function() {
    return !!buzz.el.canPlayType && buzz.el.canPlayType('audio/ogg; codecs="vorbis"');
  }),
  isWAVSupported: (function() {
    return !!buzz.el.canPlayType && buzz.el.canPlayType('audio/wav; codecs="1"');
  }),
  isMP3Supported: (function() {
    return !!buzz.el.canPlayType && buzz.el.canPlayType("audio/mpeg;");
  }),
  isAACSupported: (function() {
    return !!buzz.el.canPlayType && (buzz.el.canPlayType("audio/x-m4a;") || buzz.el.canPlayType("audio/aac;"));
  }),
  toTimer: (function(time, withHours) {
    var h, m, s;
    h = Math.floor(time / 3600);
    h = isNaN(h) ? "--" : h >= 10 ? h : "0" + h;
    m = withHours ? Math.floor(time / 60 % 60) : Math.floor(time / 60);
    m = isNaN(m) ? "--" : m >= 10 ? m : "0" + m;
    s = Math.floor(time % 60);
    s = isNaN(s) ? "--" : s >= 10 ? s : "0" + s;
    return withHours ? h + ":" + m + ":" + s : m + ":" + s;
  }),
  fromTimer: (function(time) {
    var splits = time.toString().split(":");
    if (splits && splits.length == 3) {
      time = parseInt(splits[0], 10) * 3600 + parseInt(splits[1], 10) * 60 + parseInt(splits[2], 10);
    }
    if (splits && splits.length == 2) {
      time = parseInt(splits[0], 10) * 60 + parseInt(splits[1], 10);
    }
    return time;
  }),
  toPercent: (function(value, total, decimal) {
    var r = Math.pow(10, decimal || 0);
    return Math.round(value * 100 / total * r) / r;
  }),
  fromPercent: (function(percent, total, decimal) {
    var r = Math.pow(10, decimal || 0);
    return Math.round(total / 100 * percent * r) / r;
  })
};

var SoundEnabled = true;

var SoundFile_Prefix = "Content/SoundOGG/";

var SoundFile_Ext = ".ogg";

var SoundNames = {};

function sndInit() {
  SoundEnabled = !isMobileSafari();
  Log("* Sound (BUZZ) Initialized");
}

function sndExit() {}

function sndAvailable() {
  if (!SoundEnabled) return false;
  return buzz.isSupported();
}

function sndLoad(_Name, _File) {
  if (!SoundEnabled) return;
  SoundNames[_Name] = new buzz.sound(SoundFile_Prefix + _File, {
    formats: [ "ogg" ],
    preload: true,
    autoplay: false,
    loop: false
  });
}

function sndLoadAndPlay(_Name, _File) {
  if (!SoundEnabled) return;
  SoundNames[_Name] = new buzz.sound(SoundFile_Prefix + _File, {
    formats: [ "ogg" ],
    preload: true,
    autoplay: true,
    loop: false
  });
}

function sndLoadAndPlayAndLoop(_Name, _File) {
  if (!SoundEnabled) return;
  SoundNames[_Name] = new buzz.sound(SoundFile_Prefix + _File, {
    formats: [ "ogg" ],
    preload: true,
    autoplay: true,
    loop: true
  });
}

function sndPlay(_Name) {
  if (!SoundEnabled) return;
  if (!SoundNames[_Name].isPaused()) SoundNames[_Name].setTime(0); else SoundNames[_Name].play();
}

function sndHasLoaded(_Name) {
  if (!SoundEnabled) return false;
  if (SoundNames[_Name]) return SoundNames[_Name].getStateCode() >= 0;
  return false;
}

function sndPause(_Name) {
  if (SoundNames[_Name]) SoundNames[_Name].pause();
}

function sndResume(_Name) {
  if (SoundNames[_Name]) SoundNames[_Name].play();
}

function isMobileSafari() {
  return navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
}

function isMobile() {
  return "createTouch" in document;
}

function Log(val) {
  if (isMobile()) {} else {
    console.log(val);
  }
}

function NextPowerOfTwo(v) {
  v--;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  v++;
  return v;
}

Object.prototype.clone = (function() {
  var newObj = this instanceof Array ? [] : {};
  for (i in this) {
    if (i == "clone") continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i];
  }
  return newObj;
});

function evalRequest(url, MyFunc) {
  Log("EV...");
  var xmlhttp = new XMLHttpRequest;
  xmlhttp.onreadystatechange = (function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      Log("** " + xmlhttp.responseText + " ** ");
      eval(xmlhttp.responseText);
      Generate();
      if (MyFunc) {
        Log("Has Function...");
        MyFunc();
      }
    }
  });
  Log("EVO...");
  xmlhttp.open("GET", url, false);
  xmlhttp.send(null);
  Log("EVS...");
}

function RGB(r, g, b) {
  return "rgb(" + r + "," + g + "," + b + ")";
}

function RGBA(r, g, b, a) {
  return "rgba(" + r + "," + g + "," + b + "," + Alpha / 255 + ")";
}

function ColorString(r, g, b, Alpha) {
  if (typeof Alpha === "undefined") {
    return "rgb(" + r + "," + g + "," + b + ")";
  } else {
    return "rgba(" + r + "," + g + "," + b + "," + Alpha / 255 + ")";
  }
}

function C64F_BLACK(Alpha) {
  return ColorString(0, 0, 0, Alpha);
}

function C64F_WHITE(Alpha) {
  return ColorString(255, 255, 255, Alpha);
}

function C64F_RED(Alpha) {
  return ColorString(160, 71, 57, Alpha);
}

function C64F_CYAN(Alpha) {
  return ColorString(105, 194, 203, Alpha);
}

function C64F_PURPLE(Alpha) {
  return ColorString(169, 30, 168, Alpha);
}

function C64F_GREEN(Alpha) {
  return ColorString(70, 187, 84, Alpha);
}

function C64F_BLUE(Alpha) {
  return ColorString(96, 0, 162, Alpha);
}

function C64F_YELLOW(Alpha) {
  return ColorString(192, 227, 120, Alpha);
}

function C64F_ORANGE(Alpha) {
  return ColorString(159, 106, 38, Alpha);
}

function C64F_BROWN(Alpha) {
  return ColorString(105, 90, 0, Alpha);
}

function C64F_LIGHT_RED(Alpha) {
  return ColorString(203, 121, 109, Alpha);
}

function C64F_DARK_GRAY(Alpha) {
  return ColorString(98, 98, 98, Alpha);
}

function C64F_MEDIUM_GRAY(Alpha) {
  return ColorString(137, 137, 137, Alpha);
}

function C64F_LIGHT_GREEN(Alpha) {
  return ColorString(138, 243, 148, Alpha);
}

function C64F_LIGHT_BLUE(Alpha) {
  return ColorString(149, 95, 211, Alpha);
}

function C64F_LIGHT_GRAY(Alpha) {
  return ColorString(173, 173, 173, Alpha);
}

var RGB_BLACK = RGB(0, 0, 0);

var RGB_GREY = RGB(127, 127, 127);

var RGB_WHITE = RGB(255, 255, 255);

var RGB_RED = RGB(255, 0, 0);

var RGB_GREEN = RGB(0, 255, 0);

var RGB_BLUE = RGB(0, 0, 255);

var RGB_MAGENTA = RGB(255, 0, 255);

var RGB_YELLOW = RGB(255, 255, 0);

var RGB_CYAN = RGB(0, 255, 255);

var RGB_ORANGE = RGB(255, 127, 0);

var RGB_PINK = RGB(255, 0, 127);

var RGB_PURPLE = RGB(127, 0, 255);

var RGB_PUKE = RGB(127, 255, 0);

var RGB_MINT = RGB(0, 255, 127);

var RGB_SKY = RGB(0, 127, 255);

var RGB_DEFAULT = RGB_WHITE;

function RGBF_BLACK(Alpha) {
  return ColorString(0, 0, 0, Alpha);
}

function RGBF_GREY(Alpha) {
  return ColorString(127, 127, 127, Alpha);
}

function RGBF_WHITE(Alpha) {
  return ColorString(255, 255, 255, Alpha);
}

function RGBF_RED(Alpha) {
  return ColorString(255, 0, 0, Alpha);
}

function RGBF_GREEN(Alpha) {
  return ColorString(0, 255, 0, Alpha);
}

function RGBF_BLUE(Alpha) {
  return ColorString(0, 0, 255, Alpha);
}

function RGBF_MAGENTA(Alpha) {
  return ColorString(255, 0, 255, Alpha);
}

function RGBF_YELLOW(Alpha) {
  return ColorString(255, 255, 0, Alpha);
}

function RGBF_CYAN(Alpha) {
  return ColorString(0, 255, 255, Alpha);
}

function RGBF_ORANGE(Alpha) {
  return ColorString(255, 127, 0, Alpha);
}

function RGBF_PINK(Alpha) {
  return ColorString(255, 0, 127, Alpha);
}

function RGBF_PURPLE(Alpha) {
  return ColorString(127, 0, 255, Alpha);
}

function RGBF_PUKE(Alpha) {
  return ColorString(127, 255, 0, Alpha);
}

function RGBF_MINT(Alpha) {
  return ColorString(0, 255, 127, Alpha);
}

function RGBF_SKY(Alpha) {
  return ColorString(0, 127, 255, Alpha);
}

var Real_Sin45 = .7071067811865476;

function Vector2D(_x, _y) {
  this.x = _x;
  this.y = _y;
}

Vector2D.prototype.Add = (function(vs) {
  this.x += vs.x;
  this.y += vs.y;
  return this;
});

Vector2D.prototype.Sub = (function(vs) {
  this.x -= vs.x;
  this.y -= vs.y;
  return this;
});

Vector2D.prototype.Mult = (function(vs) {
  this.x *= vs.x;
  this.y *= vs.y;
  return this;
});

Vector2D.prototype.Div = (function(vs) {
  this.x /= vs.x;
  this.y /= vs.y;
  return this;
});

Vector2D.prototype.AddScalar = (function(vs) {
  this.x += vs;
  this.y += vs;
  return this;
});

Vector2D.prototype.SubScalar = (function(vs) {
  this.x -= vs;
  this.y -= vs;
  return this;
});

Vector2D.prototype.MultScalar = (function(vs) {
  this.x *= vs;
  this.y *= vs;
  return this;
});

Vector2D.prototype.DivScalar = (function(vs) {
  this.x /= vs;
  this.y /= vs;
  return this;
});

Vector2D.prototype.Negate = (function() {
  this.x = -this.x;
  this.y = -this.y;
  return this;
});

Vector2D.prototype.Negative = (function() {
  return new Vector2D(-this.x, -this.y);
});

Vector2D.prototype.FlipX = (function() {
  return new Vector2D(-this.x, this.y);
});

Vector2D.prototype.FlipY = (function() {
  return new Vector2D(this.x, -this.y);
});

Vector2D.prototype.Tangent = (function() {
  return new Vector2D(this.y, -this.x);
});

Vector2D.prototype.Rotate45 = (function() {
  return new Vector2D((this.x + this.y) * Real_Sin45, (this.y - this.x) * Real_Sin45);
});

Vector2D.prototype.RotateNegative45 = (function() {
  return new Vector2D((this.x - this.y) * Real_Sin45, (this.y + this.x) * Real_Sin45);
});

Vector2D.prototype.Dot = (function(vs) {
  return this.x * vs.x + this.y * vs.y;
});

Vector2D.prototype.Mix = (function(vs, alpha) {
  var Copy = this.clone();
  return Copy.MultScalar(1 - alpha).Add(vs.MultScalar(alpha));
});

Vector2D.prototype.SumOf = (function() {
  return this.x + this.y;
});

Vector2D.prototype.ProductOf = (function() {
  return this.x * this.y;
});

Vector2D.prototype.Manhattan = (function() {
  return Math.abs(this.x) + Math.abs(this.y);
});

Vector2D.prototype.MagnitudeSquared = (function() {
  return this.x * this.x + this.y * this.y;
});

Vector2D.prototype.Magnitude = (function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
});

Vector2D.prototype.Normalize = (function() {
  var Mag = this.Magnitude();
  if (Mag <= 0) {
    this.x = 0;
    this.y = 0;
    return this;
  }
  this.x /= Mag;
  this.y /= Mag;
  return this;
});

Vector2D.prototype.NormalizeRet = (function() {
  var Mag = this.Magnitude();
  if (Mag <= 0) {
    this.x = 0;
    this.y = 0;
    return Mag;
  }
  this.x /= Mag;
  this.y /= Mag;
  return Mag;
});

Vector2D.prototype.Normal = (function() {
  var Copy = this.clone();
  Copy.Normalize();
  return Copy;
});

Vector2D.prototype.toString = (function() {
  return "(" + this.x + ", " + this.y + ")";
});

function Add(a, b) {
  var Copy = a.clone();
  Copy.Add(b);
  return Copy;
}

function Sub(a, b) {
  var Copy = a.clone();
  Copy.Sub(b);
  return Copy;
}

function Mult(a, b) {
  var Copy = a.clone();
  Copy.Mult(b);
  return Copy;
}

function Div(a, b) {
  var Copy = a.clone();
  Copy.Div(b);
  return Copy;
}

function AddScalar(a, b) {
  var Copy = a.clone();
  Copy.AddScalar(b);
  return Copy;
}

function SubScalar(a, b) {
  var Copy = a.clone();
  Copy.SubScalar(b);
  return Copy;
}

function MultScalar(a, b) {
  var Copy = a.clone();
  Copy.MultScalar(b);
  return Copy;
}

function DivScalar(a, b) {
  var Copy = a.clone();
  Copy.DivScalar(b);
  return Copy;
}

function Dot(a, b) {
  return a.Dot(b);
}

function Cross(a, b) {
  return a.Cross(b);
}

function Mix(a, b, alpha) {
  return a.Mix(b, alpha);
}

function NearestPoint_on_Sphere() {}

function NearestPoint_on_Edge_of_Sphere() {}

function Test_Sphere_vs_Sphere(v1, Radius1, v2, Radius2) {
  var Diff = v1.clone();
  Diff.Sub(v2);
  var RadiusSum = Radius1 + Radius2;
  return Diff.MagnitudeSquared() < RadiusSum * RadiusSum;
}

function Solve_Sphere_vs_Sphere(v1, Radius1, v2, Radius2) {
  var Diff = v1.clone();
  Diff.Sub(v2);
  var RadiusSum = Radius1 + Radius2;
  var Mag = Diff.NormalizeRet();
  if (Mag > RadiusSum) return;
  var Push = (RadiusSum - Mag) * .5;
  Diff.MultScalar(Push);
  v1.Add(Diff);
  Diff.Negate();
  v2.Add(Diff);
}

function Solve_Sphere_vs_Sphere_with_Mass(v1, Radius1, Mass1, v2, Radius2, Mass2) {
  var Diff = v1.clone();
  Diff.Sub(v2);
  var RadiusSum = Radius1 + Radius2;
  var Mag = Diff.NormalizeRet();
  if (Mag > RadiusSum) return;
  var TotalMass = Mass1 + Mass2;
  Mass1 /= TotalMass;
  Mass2 /= TotalMass;
  var Push = RadiusSum - Mag;
  var Diff2 = Diff.clone();
  Diff.MultScalar(Push * Mass2);
  Diff2.MultScalar(Push * Mass1);
  Diff2.Negate();
  v1.Add(Diff);
  v2.Add(Diff2);
}

function Solve_Sphere_vs_Sphere_with_Weights(v1, Radius1, Weight1, v2, Radius2, Weight2) {
  var Diff = v1.clone();
  Diff.Sub(v2);
  var RadiusSum = Radius1 + Radius2;
  var Mag = Diff.NormalizeRet();
  if (Mag > RadiusSum) return;
  var Push = RadiusSum - Mag;
  var Diff2 = Diff.clone();
  Diff.MultScalar(Push * Weight1);
  Diff2.MultScalar(Push * Weight2);
  Diff2.Negate();
  v1.Add(Diff);
  v2.Add(Diff2);
}

function NearestPoint_on_AABB(v1, _x, _y, _w, _h) {
  var Vec = v1.clone();
  if (Vec.x > _x + _w) {
    Vec.x = _x + _w;
  } else if (Vec.x < _x) {
    Vec.x = _x;
  }
  if (Vec.y > _y + _h) {
    Vec.y = _y + _h;
  } else if (Vec.y < _y) {
    Vec.y = _y;
  }
  return Vec;
}

function NearestPoint_on_Edge_of_AABB(v1, _x, _y, _w, _h) {
  var Vec = v1.clone();
  if (Vec.x > _x + _w) {
    Vec.x = _x + _w;
  } else if (Vec.x < _x) {
    Vec.x = _x;
  } else {
    if (Vec.x - _x > _w >> 1) {
      Vec.x = _x + _w;
    } else {
      Vec.x = _x;
    }
  }
  if (Vec.y > _y + _h) {
    Vec.y = _y + _h;
  } else if (Vec.y < _y) {
    Vec.y = _y;
  } else {
    if (Vec.y - _y > _h >> 1) {
      Vec.y = _y + _h;
    } else {
      Vec.y = _y;
    }
  }
  return Vec;
}

function NearestPoint_on_WedgeTopLeft(v1, _x, _y, _w, _h) {
  var Vec = v1.clone();
  var Change = 0;
  if (Vec.x > _x + _w) {
    Vec.x = _x + _w;
    Change--;
  } else if (Vec.x < _x) {
    Vec.x = _x;
    Change++;
  }
  if (Vec.y > _y + _h) {
    Vec.y = _y + _h;
    Change--;
  } else if (Vec.y < _y) {
    Vec.y = _y;
    Change++;
  }
  if (Change > 0) return Vec;
  var From = new Vector2D(_x, _y + _h);
  var RayTo = new Vector2D(_x + _w, _y);
  RayTo.Sub(From);
  var Me = v1.clone();
  Me.Sub(From);
  var RayLength = RayTo.NormalizeRet();
  var Result = Dot(RayTo, Me);
  if (Result < 0) {
    Vec.x = _x;
    Vec.y = _y + _h;
  } else if (Result > RayLength) {
    Vec.x = _x + _w;
    Vec.y = _y;
  } else {
    Vec.x = From.x + RayTo.x * Result;
    Vec.y = From.y + RayTo.y * Result;
  }
  return Vec;
}

function NearestPoint_on_WedgeBottomRight(v1, _x, _y, _w, _h) {
  var Vec = v1.clone();
  var Change = 0;
  if (Vec.x > _x + _w) {
    Vec.x = _x + _w;
    Change++;
  } else if (Vec.x < _x) {
    Vec.x = _x;
    Change--;
  }
  if (Vec.y > _y + _h) {
    Vec.y = _y + _h;
    Change++;
  } else if (Vec.y < _y) {
    Vec.y = _y;
    Change--;
  }
  if (Change > 0) return Vec;
  var From = new Vector2D(_x, _y + _h);
  var RayTo = new Vector2D(_x + _w, _y);
  RayTo.Sub(From);
  var Me = v1.clone();
  Me.Sub(From);
  var RayLength = RayTo.NormalizeRet();
  var Result = Dot(RayTo, Me);
  if (Result < 0) {
    Vec.x = _x;
    Vec.y = _y + _h;
  } else if (Result > RayLength) {
    Vec.x = _x + _w;
    Vec.y = _y;
  } else {
    Vec.x = From.x + RayTo.x * Result;
    Vec.y = From.y + RayTo.y * Result;
  }
  return Vec;
}

function NearestPoint_on_WedgeTopRight(v1, _x, _y, _w, _h) {
  var Vec = v1.clone();
  var Change = 0;
  if (Vec.x > _x + _w) {
    Vec.x = _x + _w;
    Change++;
  } else if (Vec.x < _x) {
    Vec.x = _x;
    Change--;
  }
  if (Vec.y > _y + _h) {
    Vec.y = _y + _h;
    Change--;
  } else if (Vec.y < _y) {
    Vec.y = _y;
    Change++;
  }
  if (Change > 0) return Vec;
  var From = new Vector2D(_x, _y);
  var RayTo = new Vector2D(_x + _w, _y + _h);
  RayTo.Sub(From);
  var Me = v1.clone();
  Me.Sub(From);
  var RayLength = RayTo.NormalizeRet();
  var Result = Dot(RayTo, Me);
  if (Result < 0) {
    Vec.x = _x;
    Vec.y = _y;
  } else if (Result > RayLength) {
    Vec.x = _x + _w;
    Vec.y = _y + _h;
  } else {
    Vec.x = From.x + RayTo.x * Result;
    Vec.y = From.y + RayTo.y * Result;
  }
  return Vec;
}

function NearestPoint_on_WedgeBottomLeft(v1, _x, _y, _w, _h) {
  var Vec = v1.clone();
  var Change = 0;
  if (Vec.x > _x + _w) {
    Vec.x = _x + _w;
    Change--;
  } else if (Vec.x < _x) {
    Vec.x = _x;
    Change++;
  }
  if (Vec.y > _y + _h) {
    Vec.y = _y + _h;
    Change++;
  } else if (Vec.y < _y) {
    Vec.y = _y;
    Change--;
  }
  if (Change > 0) return Vec;
  var From = new Vector2D(_x, _y);
  var RayTo = new Vector2D(_x + _w, _y + _h);
  RayTo.Sub(From);
  var Me = v1.clone();
  Me.Sub(From);
  var RayLength = RayTo.NormalizeRet();
  var Result = Dot(RayTo, Me);
  if (Result < 0) {
    Vec.x = _x;
    Vec.y = _y;
  } else if (Result > RayLength) {
    Vec.x = _x + _w;
    Vec.y = _y + _h;
  } else {
    Vec.x = From.x + RayTo.x * Result;
    Vec.y = From.y + RayTo.y * Result;
  }
  return Vec;
}

function Solve_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, _Func) {
  var Diff = v1.clone();
  Diff.Sub(_Func(v1, _x, _y, _w, _h));
  var Mag = Diff.NormalizeRet();
  if (Mag > Radius1) return;
  var Push = Radius1 - Mag;
  Diff.MultScalar(Push);
  v1.Add(Diff);
}

function Solve_Sphere_vs_AABB(v1, Radius1, _x, _y, _w, _h) {
  Solve_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, NearestPoint_on_AABB);
}

function Solve_Sphere_vs_WedgeBottomLeft(v1, Radius1, _x, _y, _w, _h) {
  Solve_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeBottomLeft);
}

function Solve_Sphere_vs_WedgeTopLeft(v1, Radius1, _x, _y, _w, _h) {
  Solve_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeTopLeft);
}

function Solve_Sphere_vs_WedgeBottomRight(v1, Radius1, _x, _y, _w, _h) {
  Solve_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeBottomRight);
}

function Solve_Sphere_vs_WedgeTopRight(v1, Radius1, _x, _y, _w, _h) {
  Solve_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeTopRight);
}

function Test_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, _Func) {
  var Diff = v1.clone();
  Diff.Sub(_Func(v1, _x, _y, _w, _h));
  return Diff.MagnitudeSquared() < Radius1 * Radius1;
}

function Test_Sphere_vs_AABB(v1, Radius1, _x, _y, _w, _h) {
  return Test_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, NearestPoint_on_AABB);
}

function Test_Sphere_vs_WedgeBottomLeft(v1, Radius1, _x, _y, _w, _h) {
  return Test_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeBottomLeft);
}

function Test_Sphere_vs_WedgeTopLeft(v1, Radius1, _x, _y, _w, _h) {
  return Test_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeTopLeft);
}

function Test_Sphere_vs_WedgeBottomRight(v1, Radius1, _x, _y, _w, _h) {
  return Test_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeBottomRight);
}

function Test_Sphere_vs_WedgeTopRight(v1, Radius1, _x, _y, _w, _h) {
  return Test_Sphere_vs_XYWHShape(v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeTopRight);
}

function _gelGraphicsInit(width, height) {
  Log("Original Canvas Size: " + Module.canvas.width + ", " + Module.canvas.height);
  try {
    Module.ctx = Module.canvas.getContext("2d");
    if (!Module.ctx) throw "ERROR: Could not get context!";
    Module.canvas.style.backgroundColor = "black";
    Module.canvas.width = width;
    Module.canvas.height = height;
  } catch (e) {
    Module.print("ERROR: Canvas not available!");
  }
  Log("New Canvas Size: " + Module.canvas.width + ", " + Module.canvas.height);
}

function _gelGraphicsExit() {}

function _gelCenterImage(img, x, y) {
  Module.ctx.drawImage(img, x - (img.width >> 1), y - (img.height >> 1));
}

function _gelCenterImage(img, x, y, scale_x, scale_y) {
  Module.ctx.drawImage(img, x - (img.width * scale_x >> 1), y - (img.height * scale_y >> 1), img.width * scale_x, img.height * scale_y);
}

function gelDrawTextCenter(_Text, _x, _y, _Size, _Font) {
  Module.ctx.font = "" + _Size + "px " + _Font;
  Module.ctx.textAlign = "left";
  Module.ctx.textBaseline = "top";
  var TextWidth = Math.floor(Module.ctx.measureText(_Text).width) >> 1;
  var TextHeight = Math.floor(_Size) >> 1;
  Module.ctx.fillText(_Text, Math.floor(_x - TextWidth), Math.floor(_y - TextHeight));
}

function _gelDrawTextCenter(_Text, _x, _y, _Size, _Font) {
  gelDrawTextCenter(Pointer_stringify(_Text), _x, _y, _Size, Pointer_stringify(_Font));
}

function gelDrawTextLeft(_Text, _x, _y, _Size, _Font) {
  Module.ctx.font = "" + _Size + "px " + _Font;
  Module.ctx.textAlign = "left";
  Module.ctx.textBaseline = "top";
  var TextHeight = Math.floor(_Size) >> 1;
  Module.ctx.fillText(_Text, Math.floor(_x), Math.floor(_y - TextHeight));
}

function _gelDrawTextLeft(_Text, _x, _y, _Size, _Font) {
  gelDrawTextLeft(Pointer_stringify(_Text), _x, _y, _Size, Pointer_stringify(_Font));
}

function gelDrawTextRight(_Text, _x, _y, _Size, _Font) {
  Module.ctx.font = "" + _Size + "px " + _Font;
  Module.ctx.textAlign = "left";
  Module.ctx.textBaseline = "top";
  var TextWidth = Math.floor(Module.ctx.measureText(_Text).width);
  var TextHeight = Math.floor(_Size) >> 1;
  Module.ctx.fillText(_Text, Math.floor(_x - TextWidth), Math.floor(_y - TextHeight));
}

function _gelDrawTextRight(_Text, _x, _y, _Size, _Font) {
  gelDrawTextRight(Pointer_stringify(_Text), _x, _y, _Size, Pointer_stringify(_Font));
}

function _gelSetColor(r, g, b, a) {
  if (typeof a === "undefined") {
    Module.ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    Module.ctx.strokeStyle = Module.ctx.fillStyle;
  } else {
    Module.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";
    Module.ctx.strokeStyle = Module.ctx.fillStyle;
  }
}

function _gelSetColorString(str) {
  Module.ctx.fillStyle = str;
  Module.ctx.strokeStyle = str;
}

function _gelDrawRectFill(x, y, w, h) {
  Module.ctx.fillRect(x, y, w, h);
}

function _gelDrawPixelThinRect(x, y, w, h) {
  Module.ctx.fillRect(x, y, w, 1);
  Module.ctx.fillRect(x + 1, y + h - 1, w - 1, 1);
  Module.ctx.fillRect(x, y + 1, 1, h - 1);
  Module.ctx.fillRect(x + w - 1, y + 1, 1, h - 2);
}

function _gelDrawRect(x, y, w, h) {
  Module.ctx.strokeRect(x, y, w, h);
}

function _gelClearRect(x, y, w, h) {
  Module.ctx.clearRect(x, y, w, h);
}

function _gelDrawTriangleShape(x1, y1, x2, y2, x3, y3) {
  Module.ctx.beginPath();
  Module.ctx.moveTo(x1, y1);
  Module.ctx.lineTo(x2, y2);
  Module.ctx.lineTo(x3, y3);
  Module.ctx.lineTo(x1, y1);
  Module.ctx.closePath();
  Module.ctx.stroke();
}

function _gelDrawTriangleShapeFill(x1, y1, x2, y2, x3, y3) {
  Module.ctx.beginPath();
  Module.ctx.moveTo(x1, y1);
  Module.ctx.lineTo(x2, y2);
  Module.ctx.lineTo(x3, y3);
  Module.ctx.lineTo(x1, y1);
  Module.ctx.closePath();
  Module.ctx.fill();
}

function _gelDrawQuadShape(x1, y1, x2, y2, x3, y3, x4, y4) {
  Module.ctx.beginPath();
  Module.ctx.moveTo(x1, y1);
  Module.ctx.lineTo(x2, y2);
  Module.ctx.lineTo(x3, y3);
  Module.ctx.lineTo(x4, y4);
  Module.ctx.lineTo(x1, y1);
  Module.ctx.closePath();
  Module.ctx.stroke();
}

function _gelDrawQuadShapeFill(x1, y1, x2, y2, x3, y3, x4, y4) {
  Module.ctx.beginPath();
  Module.ctx.moveTo(x1, y1);
  Module.ctx.lineTo(x2, y2);
  Module.ctx.lineTo(x3, y3);
  Module.ctx.lineTo(x4, y4);
  Module.ctx.lineTo(x1, y1);
  Module.ctx.closePath();
  Module.ctx.fill();
}

function _gelDrawWedgeBottomRight(x1, y1, w, h) {
  var x2 = x1 + w;
  var y2 = y1 + h;
  _gelDrawTriangleShape(x2, y1, x2, y2, x1, y2);
}

function _gelDrawWedgeBottomLeft(x1, y1, w, h) {
  var x2 = x1 + w;
  var y2 = y1 + h;
  _gelDrawTriangleShape(x1, y1, x2, y2, x1, y2);
}

function _gelDrawWedgeTopRight(x1, y1, w, h) {
  var x2 = x1 + w;
  var y2 = y1 + h;
  _gelDrawTriangleShape(x1, y1, x2, y1, x2, y2);
}

function _gelDrawWedgeTopLeft(x1, y1, w, h) {
  var x2 = x1 + w;
  var y2 = y1 + h;
  _gelDrawTriangleShape(x1, y1, x2, y1, x1, y2);
}

function _gelDrawWedgeBottomRightFill(x1, y1, w, h) {
  var x2 = x1 + w;
  var y2 = y1 + h;
  _gelDrawTriangleShapeFill(x2, y1, x2, y2, x1, y2);
}

function _gelDrawWedgeBottomLeftFill(x1, y1, w, h) {
  var x2 = x1 + w;
  var y2 = y1 + h;
  _gelDrawTriangleShapeFill(x1, y1, x2, y2, x1, y2);
}

function _gelDrawWedgeTopRightFill(x1, y1, w, h) {
  var x2 = x1 + w;
  var y2 = y1 + h;
  _gelDrawTriangleShapeFill(x1, y1, x2, y1, x2, y2);
}

function _gelDrawWedgeTopLeftFill(x1, y1, w, h) {
  var x2 = x1 + w;
  var y2 = y1 + h;
  _gelDrawTriangleShapeFill(x1, y1, x2, y1, x1, y2);
}

function _gelDrawCircleFill(x, y, Radius) {
  Module.ctx.beginPath();
  Module.ctx.arc(x, y, Radius, 0, Math.PI * 2, true);
  Module.ctx.closePath();
  Module.ctx.fill();
}

function _gelDrawCircle(x, y, Radius) {
  Module.ctx.beginPath();
  Module.ctx.arc(x, y, Radius, 0, Math.PI * 2, true);
  Module.ctx.closePath();
  Module.ctx.stroke();
}

function _gelDrawSquareFill(x, y, Radius) {
  Module.ctx.fillRect(x - Radius, y - Radius, Radius + Radius, Radius + Radius);
}

function _gelDrawSquare(x, y, Radius) {
  Module.ctx.strokeRect(x - Radius, y - Radius, Radius + Radius, Radius + Radius);
}

function _gelDrawPixelThinSquare(x, y, Radius) {
  _gelDrawPixelThinRect(x - Radius, y - Radius, Radius + Radius, Radius + Radius);
}

function _gelDrawDiamondFill(x, y, Radius) {
  Module.ctx.beginPath();
  Module.ctx.moveTo(x - Radius, y);
  Module.ctx.lineTo(x, y - Radius);
  Module.ctx.lineTo(x + Radius, y);
  Module.ctx.lineTo(x, y + Radius);
  Module.ctx.lineTo(x - Radius, y);
  Module.ctx.closePath();
  Module.ctx.fill();
}

function _gelDrawDiamond(x, y, Radius) {
  Module.ctx.beginPath();
  Module.ctx.moveTo(x - Radius, y);
  Module.ctx.lineTo(x, y - Radius);
  Module.ctx.lineTo(x + Radius, y);
  Module.ctx.lineTo(x, y + Radius);
  Module.ctx.lineTo(x - Radius, y);
  Module.ctx.closePath();
  Module.ctx.stroke();
}

function _gelDrawCross(x, y, Radius) {
  Module.ctx.beginPath();
  Module.ctx.moveTo(x - Radius, y);
  Module.ctx.lineTo(x + Radius, y);
  Module.ctx.moveTo(x, y - Radius);
  Module.ctx.lineTo(x, y + Radius);
  Module.ctx.closePath();
  Module.ctx.stroke();
}

function _gelDrawX(x, y, Radius) {
  Module.ctx.beginPath();
  Module.ctx.moveTo(x - Radius, y - Radius);
  Module.ctx.lineTo(x + Radius, y + Radius);
  Module.ctx.moveTo(x + Radius, y - Radius);
  Module.ctx.lineTo(x - Radius, y + Radius);
  Module.ctx.closePath();
  Module.ctx.stroke();
}

function _gelDrawLine(x1, y1, x2, y2) {
  Module.ctx.beginPath();
  Module.ctx.moveTo(x1, y1);
  Module.ctx.lineTo(x2, y2);
  Module.ctx.closePath();
  Module.ctx.stroke();
}

function _gelDrawText(_x, _y, _Text) {
  var _Size = 16;
  var _Font = "Commodore";
  Module.ctx.font = "" + _Size + "px " + _Font;
  Module.ctx.textAlign = "left";
  Module.ctx.textBaseline = "top";
  var TextWidth = Math.floor(Module.ctx.measureText(_Text).width) >> 1;
  var TextHeight = Math.floor(_Size) >> 1;
  Module.ctx.fillText(Pointer_stringify(_Text), Math.floor(_x - TextWidth), Math.floor(_y - TextHeight));
}

var ImageData = new Array;

var CurrentImage;

function _gelLoadImage(FileName) {
  var NewImage = new Image;
  NewImage.src = Pointer_stringify(FileName);
  var Index = ImageData.length;
  ImageData.push(NewImage);
  return Index;
}

function _gelBindImage(ImageId) {
  CurrentImage = ImageData[ImageId];
}

function _gelDrawImage(sx, sy) {
  Module.ctx.drawImage(CurrentImage, sx, sy);
}

function _gelDrawImageCrop(sx, sy, sw, sh, dx, dy) {
  Module.ctx.drawImage(CurrentImage, sx, sy, sw, sh, dx, dy, sw, sh);
}

function _gelLoadTileset(FileName, w, h) {
  var NewImage = new Image;
  NewImage.src = Pointer_stringify(FileName);
  NewImage.Tileset = true;
  NewImage.TileWidth = w;
  NewImage.TileHeight = h;
  NewImage.onload = (function() {
    NewImage.WidthInTiles = NewImage.width / w;
    NewImage.HeightInTiles = NewImage.height / h;
  });
  var Index = ImageData.length;
  ImageData.push(NewImage);
  return Index;
}

function _gelBindTileset(ImageId) {
  CurrentImage = ImageData[ImageId];
}

function _gelDrawTile(Tile, dx, dy) {
  Module.ctx.drawImage(CurrentImage, Math.floor(Tile % CurrentImage.WidthInTiles) * CurrentImage.TileWidth, Math.floor(Tile / CurrentImage.WidthInTiles) * CurrentImage.TileHeight, CurrentImage.TileWidth, CurrentImage.TileHeight, dx, dy, CurrentImage.TileWidth, CurrentImage.TileHeight);
}

function _gelDrawTileCentered(Tile, dx, dy) {
  Module.ctx.drawImage(CurrentImage, Math.floor(Tile % CurrentImage.WidthInTiles) * CurrentImage.TileWidth, Math.floor(Tile / CurrentImage.WidthInTiles) * CurrentImage.TileHeight, CurrentImage.TileWidth, CurrentImage.TileHeight, dx - (CurrentImage.TileWidth >> 1), dy - (CurrentImage.TileHeight >> 1), CurrentImage.TileWidth, CurrentImage.TileHeight);
}

function _gelDrawTileBaseline(Tile, dx, dy) {
  Module.ctx.drawImage(CurrentImage, Math.floor(Tile % CurrentImage.WidthInTiles) * CurrentImage.TileWidth, Math.floor(Tile / CurrentImage.WidthInTiles) * CurrentImage.TileHeight, CurrentImage.TileWidth, CurrentImage.TileHeight, dx - (CurrentImage.TileWidth >> 1), dy - CurrentImage.TileHeight, CurrentImage.TileWidth, CurrentImage.TileHeight);
}

function _gelDrawTileFlipX(Tile, dx, dy) {
  Module.ctx.scale(-1, 1);
  _gelDrawTile(Tile, -dx - CurrentImage.TileWidth, dy);
  Module.ctx.scale(-1, 1);
}

function _gelDrawTileFlipY(Tile, dx, dy) {
  Module.ctx.scale(1, -1);
  _gelDrawTile(Tile, dx, -dy - CurrentImage.TileHeight);
  Module.ctx.scale(1, -1);
}

function _gelDrawTileFlipXY(Tile, dx, dy) {
  Module.ctx.scale(-1, -1);
  _gelDrawTile(Tile, -dx - CurrentImage.TileWidth, -dy - CurrentImage.TileHeight);
  Module.ctx.scale(-1, -1);
}

var IntervalHandle = 0;

var GlobalCurrentFrame = 0;

var GlobalDebugMode = false;

var GlobalCameraOffset = Vector2D(0, 0);

var FrameRate = 1e3 / 60;

var WorkTime = 0;

var FPSClock = 0;

var FPSClock_Timer = 0;

var FPSClock_Draws = 0;

var FirstRun = true;

var HasInitSounds = false;

var Hack_ShowFPS = false;

var Canvas_Scale;

var Canvas;

function InitSounds() {
  Log("* Init Sounds");
  sndInit();
  sndLoad("Jump01", "Jump01");
  sndLoad("Jump02", "Jump02");
  sndLoad("Ground", "Ground2");
  sndLoad("Ceiling", "Ceiling");
  sndLoad("Slide", "Slide");
  sndLoad("Change", "Change");
  sndLoad("CantChange", "CantChange");
  sndLoad("StarPickup", "StarPickup");
  sndLoad("KeyPickup", "KeyPickup2");
  sndLoad("Unlock", "Unlock");
  sndLoad("Win", "Win");
  sndLoadAndPlayAndLoop("BGMusic", "../POL-rescue-short");
  Log("* Done Init Sounds");
}

function _sndPlay(SoundName) {
  sndPlay(Pointer_stringify(SoundName));
}

var MapReader_CurrentLayer = 0;

var MapReader_File = ContentMapData;

function _mrGetLayerCount() {
  return MapReader_File.layers.length;
}

function _mrBindLayer(_Layer) {
  MapReader_CurrentLayer = _Layer;
}

function _mrGetWidth() {
  return MapReader_File.layers[MapReader_CurrentLayer].width;
}

function _mrGetHeight() {
  return MapReader_File.layers[MapReader_CurrentLayer].height;
}

function _mrGet(_x, _y) {
  return MapReader_File.layers[MapReader_CurrentLayer].data[_y * _mrGetWidth() + _x];
}

function _mrGetSize() {
  return MapReader_File.layers[MapReader_CurrentLayer].data.length;
}

function _mrIndex(_Index) {
  return MapReader_File.layers[MapReader_CurrentLayer].data[_Index];
}

function gelDrawTextCenter(_Text, _x, _y, _Size, _Font) {
  ctx = Canvas.getContext("2d");
  ctx.font = "" + _Size + "px " + _Font;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  var TextWidth = Math.floor(ctx.measureText(_Text).width) >> 1;
  var TextHeight = Math.floor(_Size) >> 1;
  ctx.fillText(_Text, Math.floor(_x - TextWidth), Math.floor(_y - TextHeight));
}

function gelSetColor(r, g, b, a) {
  ctx = Canvas.getContext("2d");
  if (typeof a === "undefined") {
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.strokeStyle = ctx.fillStyle;
  } else {
    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";
    ctx.strokeStyle = ctx.fillStyle;
  }
}

function gelSetColorString(str) {
  ctx.fillStyle = str;
  ctx.strokeStyle = str;
}

function DrawFPS() {
  ctx = Canvas.getContext("2d");
  if (isMobile()) ctx.fillStyle = "rgb(128,128,255)"; else ctx.fillStyle = "rgb(255,255,0)";
  ctx.font = "16px Commodore";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(FPSClock, Canvas.width - 1, 240 - 18);
}

function Main_Loop() {
  if (FirstRun) {
    __Z8GameInitv();
    WorkTime = (new Date).getTime();
    FirstRun = false;
  }
  if (sndAvailable() && HasInitSounds == false) {
    InitSounds();
    WorkTime = (new Date).getTime();
    HasInitSounds = true;
  }
  var CurrentTime = (new Date).getTime();
  var TimeDiff = Math.floor(CurrentTime - WorkTime);
  if (TimeDiff > 1e3) {
    Log("* WARNING: Too much time passed (" + TimeDiff + "). Throwing away clock.");
    TimeDiff = 0;
    WorkTime = CurrentTime;
  }
  if (TimeDiff > FrameRate) {
    var FramesToDo = Math.floor(TimeDiff / FrameRate);
    for (var idx = 0; idx < FramesToDo; idx++) {
      GlobalCurrentFrame++;
      Input_KeyUpdate();
      __Z9GameInputffii(Input_Stick.x, Input_Stick.y, Input_KeyCurrent, Input_KeyLast);
      __Z8GameStepv();
    }
    __Z8GameDrawv();
    FPSClock_Draws++;
    if (Hack_ShowFPS) DrawFPS();
    WorkTime += FramesToDo * FrameRate;
    var WorkTimeDiff = WorkTime - (FPSClock_Timer + 1e3);
    if (WorkTimeDiff > 0) {
      FPSClock = FPSClock_Draws;
      FPSClock_Draws = 0;
      if (WorkTimeDiff > 60) FPSClock_Timer = WorkTime; else FPSClock_Timer += 1e3;
    }
  }
}

function Main_ShowPaused() {
  _gelSetColor(255, 254, 100, 255);
  _gelDrawTextCenter("*PAUSED*", Canvas.width >> 1, Canvas.height >> 1, 48, "ShowG");
  __Z14GameDrawPausedv();
}

function Main_GainFocus() {
  Log("* Gain Focus");
  sndResume("BGMusic");
  Input_KeyPanic();
  WorkTime = (new Date).getTime();
  if (IntervalHandle == 0) {
    IntervalHandle = setInterval(Main_Loop, FrameRate);
  }
}

function Main_LoseFocus() {
  Log("* Lost Focus");
  clearInterval(IntervalHandle);
  IntervalHandle = 0;
  sndPause("BGMusic");
  Main_ShowPaused();
}

function Main_Resize() {
  var Sheet = document.styleSheets[0];
  var Rules = Sheet.cssRules ? Sheet.cssRules : Sheet.rules;
  var CanvasRule;
  for (var idx = 0; idx < Rules.length; idx++) {
    if (Rules[idx].selectorText.toLowerCase() == "canvas") {
      CanvasRule = Rules[idx];
      break;
    }
  }
  if (CanvasRule) {
    var Canvas_AspectRatio = Canvas.width / Canvas.height;
    var Window_ScaleWidth = window.innerWidth;
    var Window_ScaleHeight = window.innerHeight - 6;
    var Window_AspectRatio = Window_ScaleWidth / Window_ScaleHeight;
    if (Canvas_AspectRatio < Window_AspectRatio) {
      Canvas_Scale = Window_ScaleHeight / Canvas.height;
    } else {
      Canvas_Scale = Window_ScaleWidth / Canvas.width;
    }
    if (isMobileSafari()) {
      Canvas_Scale = Math.floor(Canvas_Scale);
    } else {
      Canvas_Scale = Math.floor(Canvas_Scale);
    }
    var TargetWidth = Canvas_Scale * Canvas.height * Canvas_AspectRatio;
    var TargetHeight = Canvas_Scale * Canvas.height;
    CanvasRule.style.width = TargetWidth + "px";
    CanvasRule.style.height = TargetHeight + "px";
    CanvasRule.style.left = Math.floor((window.innerWidth - TargetWidth) / 2) + "px";
    CanvasRule.style.top = Math.floor((window.innerHeight - TargetHeight) / 2) + "px";
  }
}

var Input_Stick;

var Input_KeyBits;

var Input_KeyCurrent;

var Input_KeyLast;

var KEY_UP = 1;

var KEY_DOWN = 2;

var KEY_LEFT = 4;

var KEY_RIGHT = 8;

var KEY_ACTION = 16;

var KEY_ACTION2 = 32;

var KEY_ACTION3 = 64;

var KEY_ACTION4 = 128;

var KEY_MENU = 2048;

function Input_KeyInit() {
  Input_Stick = new Vector2D(0, 0);
  Input_KeyBits = 0;
  Input_KeyCurrent = 0;
  Input_KeyLast = 0;
  window.addEventListener("keydown", Input_KeyDownEvent, true);
  window.addEventListener("keyup", Input_KeyUpEvent, true);
  window.addEventListener("keypress", Input_KeyPressEvent, true);
}

function Input_KeyExit() {}

function Input_KeyPanic() {
  Log("* Input_KeyPanic (clear - some browsers are stupid)");
  Input_Stick.x = 0;
  Input_Stick.y = 0;
  Input_KeyBits = 0;
  Input_KeyCurrent = 0;
  Input_KeyLast = 0;
}

function Input_KeyUpdate() {
  if (Input_KeyBits & KEY_UP) {
    Input_Stick.y = -1;
  } else if (Input_KeyBits & KEY_DOWN) {
    Input_Stick.y = +1;
  } else {
    Input_Stick.y = 0;
  }
  if (Input_KeyBits & KEY_LEFT) {
    Input_Stick.x = -1;
  } else if (Input_KeyBits & KEY_RIGHT) {
    Input_Stick.x = +1;
  } else {
    Input_Stick.x = 0;
  }
  Input_KeyLast = Input_KeyCurrent;
  Input_KeyCurrent = Input_KeyBits;
}

function Input_Key(Mask) {
  return Input_KeyCurrent & Mask;
}

function Input_KeyLast(Mask) {
  return Input_KeyLast & Mask;
}

function Input_KeyPressed(Mask) {
  return (Input_KeyCurrent ^ Input_KeyLast) & Input_KeyCurrent & Mask;
}

function Input_KeyReleased(Mask) {
  return (Input_KeyCurrent ^ Input_KeyLast) & Input_KeyLast & Mask;
}

function Input_KeyDownEvent(e) {
  switch (e.keyCode) {
   case 38:
    Input_KeyBits |= KEY_UP;
    break;
   case 40:
    Input_KeyBits |= KEY_DOWN;
    break;
   case 37:
    Input_KeyBits |= KEY_LEFT;
    break;
   case 39:
    Input_KeyBits |= KEY_RIGHT;
    break;
   case 48:
    return false;
    break;
   case 49:
    GlobalDebugMode = !GlobalDebugMode;
    return false;
    break;
   case 50:
    Hack_ShowFPS = !Hack_ShowFPS;
    break;
   case 51:
    Hack_NoCollision = !Hack_NoCollision;
    Log("Player Collision: " + Hack_NoCollision);
    break;
   case 53:
    Game.Generate();
    break;
   case 57:
    if (typeof VibrantColorScheme !== "undefined") {
      VibrantColorScheme = !VibrantColorScheme;
      UpdateColorScheme();
      Log("Color Scheme Changed. Vibrant: " + VibrantColorScheme);
    }
    break;
   case 27:
    Input_KeyBits |= KEY_MENU;
    return false;
    break;
   case 13:
   case 17:
   case 32:
    Input_KeyBits |= KEY_ACTION;
    return false;
    break;
  }
}

function Input_KeyUpEvent(e) {
  switch (e.keyCode) {
   case 38:
    Input_KeyBits &= ~KEY_UP;
    break;
   case 40:
    Input_KeyBits &= ~KEY_DOWN;
    break;
   case 37:
    Input_KeyBits &= ~KEY_LEFT;
    break;
   case 39:
    Input_KeyBits &= ~KEY_RIGHT;
    break;
   case 13:
   case 17:
   case 32:
    Input_KeyBits &= ~KEY_ACTION;
    break;
   case 27:
    Input_KeyBits &= ~KEY_MENU;
    break;
  }
}

function Input_KeyPressEvent(e) {
  switch (e.keyCode) {
   case 8:
   case 113:
    GlobalDebugMode = !GlobalDebugMode;
    break;
  }
}

var Input_Mouse;

var Input_MouseBits;

var MOUSE_LMB = 1;

var MOUSE_RMB = 2;

function Input_MouseInit() {
  Input_Mouse = new Vector2D(0, 0);
  Input_Mouse.Visible = false;
  Canvas.onmousemove = Input_MouseMove;
  Canvas.onmouseup = Input_MouseUp;
  Canvas.onmousedown = Input_MouseDown;
  Canvas.onmouseover = Input_MouseOver;
  Canvas.onmouseout = Input_MouseOut;
}

function Input_MouseExit() {}

function Input_MouseMove(e) {
  Input_Mouse.x = (e.clientX - Canvas.offsetLeft) / Canvas_Scale;
  Input_Mouse.y = (e.clientY - Canvas.offsetTop) / Canvas_Scale;
}

function Input_MouseOver(e) {
  Input_Mouse.Visible = true;
}

function Input_MouseOut(e) {
  Input_Mouse.Visible = false;
}

function Input_MouseUp(e) {
  Input_MouseBits &= ~MOUSE_LMB;
  Log("Click Up " + Input_Mouse);
}

function Input_MouseDown(e) {
  Input_Mouse.x = (e.clientX - Canvas.offsetLeft) / Canvas_Scale;
  Input_Mouse.y = (e.clientY - Canvas.offsetTop) / Canvas_Scale;
  Input_MouseBits |= MOUSE_LMB;
  Log("Click Down " + Input_Mouse);
}

function Input_TouchInit() {
  Input_Mouse = new Vector2D(0, 0);
  Input_Mouse.Visible = true;
  Canvas.ontouchmove = Input_TouchMove;
  Canvas.ontouchstart = Input_TouchStart;
  Canvas.ontouchend = Input_TouchEnd;
}

function Input_TouchExit() {}

function Input_TouchMove(e) {
  e.preventDefault();
  Input_Mouse.x = (e.touches.item(0).clientX - Canvas.offsetLeft) / Canvas_Scale;
  Input_Mouse.y = (e.touches.item(0).clientY - Canvas.offsetTop) / Canvas_Scale;
}

function Input_TouchStart(e) {
  e.preventDefault();
  Input_Mouse.x = (e.touches.item(0).clientX - Canvas.offsetLeft) / Canvas_Scale;
  Input_Mouse.y = (e.touches.item(0).clientY - Canvas.offsetTop) / Canvas_Scale;
  Input_MouseBits |= MOUSE_LMB;
  Log(Input_Mouse);
}

function Input_TouchEnd(e) {
  e.preventDefault();
  Input_MouseBits &= ~MOUSE_LMB;
}

function explore(path) {
  Module.print(path);
  var ret = FS.analyzePath(path);
  Module.print("  isRoot: " + ret.isRoot);
  Module.print("  exists: " + ret.exists);
  Module.print("  error: " + ret.error);
  Module.print("  path: " + ret.path);
  Module.print("  name: " + ret.name);
  Module.print("  object.contents: " + (ret.object && JSON.stringify(Object.keys(ret.object.contents || {}))));
  Module.print("  parentExists: " + ret.parentExists);
  Module.print("  parentPath: " + ret.parentPath);
  Module.print("  parentObject.contents: " + (ret.parentObject && JSON.stringify(Object.keys(ret.parentObject.contents))));
  Module.print("");
}

function Main() {
  if (typeof console === "undefined" || typeof console.log === "undefined") {
    console = {};
    console.log = (function() {});
  }
  Log(" - ----- GelHTML Initialized ----- -");
  Canvas = document.getElementById("canvas");
  gelSetColor(255, 254, 100, 255);
  gelDrawTextCenter("Loading...", Canvas.width >> 1, Canvas.height >> 1, 48, "ShowG");
  if (isMobile()) Input_TouchInit(); else Input_MouseInit();
  Input_KeyInit();
  window.onblur = Main_LoseFocus;
  window.onfocus = Main_GainFocus;
  window.onresize = Main_Resize;
  Main_Resize();
  window.scrollTo(0, 1);
  WorkTime = (new Date).getTime();
  IntervalHandle = setInterval(Main_Loop, FrameRate);
}

window["Main"] = Main;

function load() {
  Main();
}

try {
  this["Module"] = Module;
} catch (e) {
  this["Module"] = Module = {};
}

var ENVIRONMENT_IS_NODE = typeof process === "object";

var ENVIRONMENT_IS_WEB = typeof window === "object";

var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";

var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  Module["print"] = (function(x) {
    process["stdout"].write(x + "\n");
  });
  Module["printErr"] = (function(x) {
    process["stderr"].write(x + "\n");
  });
  var nodeFS = require("fs");
  var nodePath = require("path");
  Module["read"] = (function(filename) {
    filename = nodePath["normalize"](filename);
    var ret = nodeFS["readFileSync"](filename).toString();
    if (!ret && filename != nodePath["resolve"](filename)) {
      filename = path.join(__dirname, "..", "src", filename);
      ret = nodeFS["readFileSync"](filename).toString();
    }
    return ret;
  });
  Module["load"] = (function(f) {
    globalEval(read(f));
  });
  if (!Module["arguments"]) {
    Module["arguments"] = process["argv"].slice(2);
  }
} else if (ENVIRONMENT_IS_SHELL) {
  Module["print"] = print;
  Module["printErr"] = printErr;
  if (typeof read != "undefined") {
    Module["read"] = read;
  } else {
    Module["read"] = (function(f) {
      snarf(f);
    });
  }
  if (!Module["arguments"]) {
    if (typeof scriptArgs != "undefined") {
      Module["arguments"] = scriptArgs;
    } else if (typeof arguments != "undefined") {
      Module["arguments"] = arguments;
    }
  }
} else if (ENVIRONMENT_IS_WEB) {
  if (!Module["print"]) {
    Module["print"] = (function(x) {
      console.log(x);
    });
  }
  if (!Module["printErr"]) {
    Module["printErr"] = (function(x) {
      console.log(x);
    });
  }
  Module["read"] = (function(url) {
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url, false);
    xhr.send(null);
    return xhr.responseText;
  });
  if (!Module["arguments"]) {
    if (typeof arguments != "undefined") {
      Module["arguments"] = arguments;
    }
  }
} else if (ENVIRONMENT_IS_WORKER) {
  Module["load"] = importScripts;
} else {
  throw "Unknown runtime environment. Where are we?";
}

function globalEval(x) {
  eval.call(null, x);
}

if (!Module["load"] == "undefined" && Module["read"]) {
  Module["load"] = (function(f) {
    globalEval(Module["read"](f));
  });
}

if (!Module["printErr"]) {
  Module["printErr"] = (function() {});
}

if (!Module["print"]) {
  Module["print"] = Module["printErr"];
}

if (!Module["arguments"]) {
  Module["arguments"] = [];
}

Module.print = Module["print"];

Module.printErr = Module["printErr"];

var Runtime = {
  stackSave: (function() {
    return STACKTOP;
  }),
  stackRestore: (function(stackTop) {
    STACKTOP = stackTop;
  }),
  forceAlign: (function(target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target / quantum) * quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return "((((" + target + ")+" + (quantum - 1) + ")>>" + logg + ")<<" + logg + ")";
    }
    return "Math.ceil((" + target + ")/" + quantum + ")*" + quantum;
  }),
  isNumberType: (function(type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  }),
  isPointerType: function isPointerType(type) {
    return type[type.length - 1] == "*";
  },
  isStructType: function isStructType(type) {
    if (isPointerType(type)) return false;
    if (/^\[\d+\ x\ (.*)\]/.test(type)) return true;
    if (/<?{ ?[^}]* ?}>?/.test(type)) return true;
    return type[0] == "%";
  },
  INT_TYPES: {
    "i1": 0,
    "i8": 0,
    "i16": 0,
    "i32": 0,
    "i64": 0
  },
  FLOAT_TYPES: {
    "float": 0,
    "double": 0
  },
  bitshift64: (function(low, high, op, bits) {
    var ander = Math.pow(2, bits) - 1;
    if (bits < 32) {
      switch (op) {
       case "shl":
        return [ low << bits, high << bits | (low & ander << 32 - bits) >>> 32 - bits ];
       case "ashr":
        return [ (low >>> bits | (high & ander) << 32 - bits) >> 0 >>> 0, high >> bits >>> 0 ];
       case "lshr":
        return [ (low >>> bits | (high & ander) << 32 - bits) >>> 0, high >>> bits ];
      }
    } else if (bits == 32) {
      switch (op) {
       case "shl":
        return [ 0, low ];
       case "ashr":
        return [ high, (high | 0) < 0 ? ander : 0 ];
       case "lshr":
        return [ high, 0 ];
      }
    } else {
      switch (op) {
       case "shl":
        return [ 0, low << bits - 32 ];
       case "ashr":
        return [ high >> bits - 32 >>> 0, (high | 0) < 0 ? ander : 0 ];
       case "lshr":
        return [ high >>> bits - 32, 0 ];
      }
    }
    abort("unknown bitshift64 op: " + [ value, op, bits ]);
  }),
  or64: (function(x, y) {
    var l = x | 0 | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  }),
  and64: (function(x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  }),
  xor64: (function(x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  }),
  getNativeTypeSize: (function(type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      "%i1": 1,
      "%i8": 1,
      "%i16": 2,
      "%i32": 4,
      "%i64": 8,
      "%float": 4,
      "%double": 8
    }["%" + type];
    if (!size) {
      if (type[type.length - 1] == "*") {
        size = Runtime.QUANTUM_SIZE;
      } else if (type[0] == "i") {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits / 8;
      }
    }
    return size;
  }),
  getNativeFieldSize: (function(type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  }),
  dedup: function dedup(items, ident) {
    var seen = {};
    if (ident) {
      return items.filter((function(item) {
        if (seen[item[ident]]) return false;
        seen[item[ident]] = true;
        return true;
      }));
    } else {
      return items.filter((function(item) {
        if (seen[item]) return false;
        seen[item] = true;
        return true;
      }));
    }
  },
  set: function set() {
    var args = typeof arguments[0] === "object" ? arguments[0] : arguments;
    var ret = {};
    for (var i = 0; i < args.length; i++) {
      ret[args[i]] = 0;
    }
    return ret;
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    type.flatIndexes = type.fields.map((function(field) {
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field);
        alignSize = size;
      } else if (Runtime.isStructType(field)) {
        size = Types.types[field].flatSize;
        alignSize = Types.types[field].alignSize;
      } else {
        throw "Unclear type in struct: " + field + ", in " + type.name_ + " :: " + dump(Types.types[type.name_]);
      }
      alignSize = type.packed ? 1 : Math.min(alignSize, Runtime.QUANTUM_SIZE);
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize);
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr - prev);
      }
      prev = curr;
      return curr;
    }));
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = type.flatFactor != 1;
    return type.flatIndexes;
  },
  generateStructInfo: (function(struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === "undefined" ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      assert(type.fields.length === struct.length, "Number of named fields must match the type for " + typeName);
      alignment = type.flatIndexes;
    } else {
      var type = {
        fields: struct.map((function(item) {
          return item[0];
        }))
      };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach((function(item, i) {
        if (typeof item === "string") {
          ret[item] = alignment[i] + offset;
        } else {
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      }));
    } else {
      struct.forEach((function(item, i) {
        ret[item[1]] = alignment[i];
      }));
    }
    return ret;
  }),
  addFunction: (function(func) {
    var ret = FUNCTION_TABLE.length;
    FUNCTION_TABLE.push(func);
    FUNCTION_TABLE.push(0);
    return ret;
  }),
  stackAlloc: function stackAlloc(size) {
    var ret = STACKTOP;
    STACKTOP += size;
    STACKTOP = STACKTOP + 3 >> 2 << 2;
    return ret;
  },
  staticAlloc: function staticAlloc(size) {
    var ret = STATICTOP;
    STATICTOP += size;
    STATICTOP = STATICTOP + 3 >> 2 << 2;
    if (STATICTOP >= TOTAL_MEMORY) enlargeMemory();
    return ret;
  },
  alignMemory: function alignMemory(size, quantum) {
    var ret = size = Math.ceil(size / (quantum ? quantum : 4)) * (quantum ? quantum : 4);
    return ret;
  },
  makeBigInt: function makeBigInt(low, high, unsigned) {
    var ret = unsigned ? (low >>> 0) + (high >>> 0) * 4294967296 : (low >>> 0) + (high | 0) * 4294967296;
    return ret;
  },
  QUANTUM_SIZE: 4,
  __dummy__: 0
};

var CorrectionsMonitor = {
  MAX_ALLOWED: 0,
  corrections: 0,
  sigs: {},
  note: (function(type, succeed, sig) {
    if (!succeed) {
      this.corrections++;
      if (this.corrections >= this.MAX_ALLOWED) abort("\n\nToo many corrections!");
    }
  }),
  print: (function() {})
};

var __THREW__ = false;

var ABORT = false;

var undef = 0;

var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;

var tempI64, tempI64b;

function abort(text) {
  Module.print(text + ":\n" + (new Error).stack);
  ABORT = true;
  throw "Assertion: " + text;
}

function assert(condition, text) {
  if (!condition) {
    abort("Assertion failed: " + text);
  }
}

var globalScope = this;

function ccall(ident, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == "string") {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length + 1);
      writeStringToMemory(value, ret);
      return ret;
    } else if (type == "array") {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == "string") {
      return Pointer_stringify(value);
    }
    assert(type != "array");
    return value;
  }
  try {
    var func = eval("_" + ident);
  } catch (e) {
    try {
      func = globalScope["Module"]["_" + ident];
    } catch (e) {}
  }
  assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)");
  var i = 0;
  var cArgs = args ? args.map((function(arg) {
    return toC(arg, argTypes[i++]);
  })) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}

Module["ccall"] = ccall;

function cwrap(ident, returnType, argTypes) {
  return (function() {
    return ccall(ident, returnType, argTypes, Array.prototype.slice.call(arguments));
  });
}

Module["cwrap"] = cwrap;

function setValue(ptr, value, type, noSafe) {
  type = type || "i8";
  if (type[type.length - 1] === "*") type = "i32";
  switch (type) {
   case "i1":
    HEAP8[ptr] = value;
    break;
   case "i8":
    HEAP8[ptr] = value;
    break;
   case "i16":
    HEAP16[ptr >> 1] = value;
    break;
   case "i32":
    HEAP32[ptr >> 2] = value;
    break;
   case "i64":
    HEAP32[ptr >> 2] = value;
    break;
   case "float":
    HEAPF32[ptr >> 2] = value;
    break;
   case "double":
    tempDoubleF64[0] = value, HEAP32[ptr >> 2] = tempDoubleI32[0], HEAP32[ptr + 4 >> 2] = tempDoubleI32[1];
    break;
   default:
    abort("invalid type for setValue: " + type);
  }
}

Module["setValue"] = setValue;

function getValue(ptr, type, noSafe) {
  type = type || "i8";
  if (type[type.length - 1] === "*") type = "i32";
  switch (type) {
   case "i1":
    return HEAP8[ptr];
   case "i8":
    return HEAP8[ptr];
   case "i16":
    return HEAP16[ptr >> 1];
   case "i32":
    return HEAP32[ptr >> 2];
   case "i64":
    return HEAP32[ptr >> 2];
   case "float":
    return HEAPF32[ptr >> 2];
   case "double":
    return tempDoubleI32[0] = HEAP32[ptr >> 2], tempDoubleI32[1] = HEAP32[ptr + 4 >> 2], tempDoubleF64[0];
   default:
    abort("invalid type for setValue: " + type);
  }
  return null;
}

Module["getValue"] = getValue;

var ALLOC_NORMAL = 0;

var ALLOC_STACK = 1;

var ALLOC_STATIC = 2;

Module["ALLOC_NORMAL"] = ALLOC_NORMAL;

Module["ALLOC_STACK"] = ALLOC_STACK;

Module["ALLOC_STATIC"] = ALLOC_STATIC;

function allocate(slab, types, allocator) {
  var zeroinit, size;
  if (typeof slab === "number") {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === "string" ? types : null;
  var ret = [ _malloc, Runtime.stackAlloc, Runtime.staticAlloc ][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  if (zeroinit) {
    _memset(ret, 0, size);
    return ret;
  }
  var i = 0, type;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === "function") {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == "i64") type = "i32";
    setValue(ret + i, curr, type);
    i += Runtime.getNativeTypeSize(type);
  }
  return ret;
}

Module["allocate"] = allocate;

function Pointer_stringify(ptr, length) {
  var nullTerminated = typeof length == "undefined";
  var ret = "";
  var i = 0;
  var t;
  var nullByte = String.fromCharCode(0);
  while (1) {
    t = String.fromCharCode(HEAPU8[ptr + i]);
    if (nullTerminated && t == nullByte) {
      break;
    } else {}
    ret += t;
    i += 1;
    if (!nullTerminated && i == length) {
      break;
    }
  }
  return ret;
}

Module["Pointer_stringify"] = Pointer_stringify;

function Array_stringify(array) {
  var ret = "";
  for (var i = 0; i < array.length; i++) {
    ret += String.fromCharCode(array[i]);
  }
  return ret;
}

Module["Array_stringify"] = Array_stringify;

var FUNCTION_TABLE;

var PAGE_SIZE = 4096;

function alignMemoryPage(x) {
  return x + 4095 >> 12 << 12;
}

var HEAP;

var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

var STACK_ROOT, STACKTOP, STACK_MAX;

var STATICTOP;

function enlargeMemory() {
  while (TOTAL_MEMORY <= STATICTOP) {
    TOTAL_MEMORY = alignMemoryPage(2 * TOTAL_MEMORY);
  }
  var oldHEAP8 = HEAP8;
  var buffer = new ArrayBuffer(TOTAL_MEMORY);
  HEAP8 = new Int8Array(buffer);
  HEAP16 = new Int16Array(buffer);
  HEAP32 = new Int32Array(buffer);
  HEAPU8 = new Uint8Array(buffer);
  HEAPU16 = new Uint16Array(buffer);
  HEAPU32 = new Uint32Array(buffer);
  HEAPF32 = new Float32Array(buffer);
  HEAPF64 = new Float64Array(buffer);
  HEAP8.set(oldHEAP8);
}

var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;

var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 10485760;

var FAST_MEMORY = Module["FAST_MEMORY"] || 2097152;

assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1))["subarray"] && !!(new Int32Array(1))["set"], "Cannot fallback to non-typed array case: Code is too specialized");

var buffer = new ArrayBuffer(TOTAL_MEMORY);

HEAP8 = new Int8Array(buffer);

HEAP16 = new Int16Array(buffer);

HEAP32 = new Int32Array(buffer);

HEAPU8 = new Uint8Array(buffer);

HEAPU16 = new Uint16Array(buffer);

HEAPU32 = new Uint32Array(buffer);

HEAPF32 = new Float32Array(buffer);

HEAPF64 = new Float64Array(buffer);

HEAP32[0] = 255;

assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, "Typed arrays 2 must be run on a little-endian system");

var base = intArrayFromString("(null)");

STATICTOP = base.length;

for (var i = 0; i < base.length; i++) {
  HEAP8[i] = base[i];
}

Module["HEAP"] = HEAP;

Module["HEAP8"] = HEAP8;

Module["HEAP16"] = HEAP16;

Module["HEAP32"] = HEAP32;

Module["HEAPU8"] = HEAPU8;

Module["HEAPU16"] = HEAPU16;

Module["HEAPU32"] = HEAPU32;

Module["HEAPF32"] = HEAPF32;

Module["HEAPF64"] = HEAPF64;

STACK_ROOT = STACKTOP = Runtime.alignMemory(STATICTOP);

STACK_MAX = STACK_ROOT + TOTAL_STACK;

var tempDoublePtr = Runtime.alignMemory(STACK_MAX, 8);

var tempDoubleI8 = HEAP8.subarray(tempDoublePtr);

var tempDoubleI32 = HEAP32.subarray(tempDoublePtr >> 2);

var tempDoubleF32 = HEAPF32.subarray(tempDoublePtr >> 2);

var tempDoubleF64 = HEAPF64.subarray(tempDoublePtr >> 3);

function copyTempFloat(ptr) {
  tempDoubleI8[0] = HEAP8[ptr];
  tempDoubleI8[1] = HEAP8[ptr + 1];
  tempDoubleI8[2] = HEAP8[ptr + 2];
  tempDoubleI8[3] = HEAP8[ptr + 3];
}

function copyTempDouble(ptr) {
  tempDoubleI8[0] = HEAP8[ptr];
  tempDoubleI8[1] = HEAP8[ptr + 1];
  tempDoubleI8[2] = HEAP8[ptr + 2];
  tempDoubleI8[3] = HEAP8[ptr + 3];
  tempDoubleI8[4] = HEAP8[ptr + 4];
  tempDoubleI8[5] = HEAP8[ptr + 5];
  tempDoubleI8[6] = HEAP8[ptr + 6];
  tempDoubleI8[7] = HEAP8[ptr + 7];
}

STACK_MAX = tempDoublePtr + 8;

STATICTOP = alignMemoryPage(STACK_MAX);

function callRuntimeCallbacks(callbacks) {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    var func = callback.func;
    if (typeof func === "number") {
      func = FUNCTION_TABLE[func];
    }
    func(callback.arg === undefined ? null : callback.arg);
  }
}

var __ATINIT__ = [];

var __ATMAIN__ = [];

var __ATEXIT__ = [];

function initRuntime() {
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
  CorrectionsMonitor.print();
}

function Array_copy(ptr, num) {
  return Array.prototype.slice.call(HEAP8.subarray(ptr, ptr + num));
  return HEAP.slice(ptr, ptr + num);
}

Module["Array_copy"] = Array_copy;

function TypedArray_copy(ptr, num, offset) {
  if (offset === undefined) {
    offset = 0;
  }
  var arr = new Uint8Array(num - offset);
  for (var i = offset; i < num; ++i) {
    arr[i - offset] = HEAP8[ptr + i];
  }
  return arr.buffer;
}

Module["TypedArray_copy"] = TypedArray_copy;

function String_len(ptr) {
  var i = 0;
  while (HEAP8[ptr + i]) i++;
  return i;
}

Module["String_len"] = String_len;

function String_copy(ptr, addZero) {
  var len = String_len(ptr);
  if (addZero) len++;
  var ret = Array_copy(ptr, len);
  if (addZero) ret[len - 1] = 0;
  return ret;
}

Module["String_copy"] = String_copy;

function intArrayFromString(stringy, dontAddNull, length) {
  var ret = [];
  var t;
  var i = 0;
  if (length === undefined) {
    length = stringy.length;
  }
  while (i < length) {
    var chr = stringy.charCodeAt(i);
    if (chr > 255) {
      chr &= 255;
    }
    ret.push(chr);
    i = i + 1;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}

Module["intArrayFromString"] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 255) {
      chr &= 255;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join("");
}

Module["intArrayToString"] = intArrayToString;

function writeStringToMemory(string, buffer, dontAddNull) {
  var i = 0;
  while (i < string.length) {
    var chr = string.charCodeAt(i);
    if (chr > 255) {
      chr &= 255;
    }
    HEAP8[buffer + i] = chr;
    i = i + 1;
  }
  if (!dontAddNull) {
    HEAP8[buffer + i] = 0;
  }
}

Module["writeStringToMemory"] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[buffer + i] = array[i];
  }
}

Module["writeArrayToMemory"] = writeArrayToMemory;

var STRING_TABLE = [];

function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2 * Math.abs(1 << bits - 1) + value : Math.pow(2, bits) + value;
}

function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << bits - 1) : Math.pow(2, bits - 1);
  if (value >= half && (bits <= 32 || value > half)) {
    value = -2 * half + value;
  }
  return value;
}

var runDependencies = 0;

function addRunDependency() {
  runDependencies++;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
}

function removeRunDependency() {
  runDependencies--;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
  if (runDependencies == 0) run();
}

function __Z9GameInputffii($x, $y, $Current, $Last) {
  HEAPF32[_gx >> 2] = $x;
  HEAPF32[_gy >> 2] = $y;
  HEAP32[__Input_KeyCurrent >> 2] = $Current;
  HEAP32[__Input_KeyLast >> 2] = $Last;
  return;
  return;
}

function __ZNK7cGrid2DIsE5WidthEv($this) {
  return HEAP32[$this >> 2];
  return null;
}

function __ZNK7cGrid2DIsE6HeightEv($this) {
  return HEAP32[$this + 4 >> 2];
  return null;
}

function __ZN7cGrid2DIsEixEj($this, $_Index) {
  return ($_Index << 1) + HEAP32[$this + 8 >> 2] | 0;
  return null;
}

function __ZN8Vector2DC1Ev($this) {
  __ZN8Vector2DC2Ev($this);
  return;
  return;
}

function __Z10CountDoorsi($Layer) {
  var $3 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
  var $4 = __ZNK7cGrid2DIsE5WidthEv($3);
  var $5 = __ZNK7cGrid2DIsE6HeightEv($3);
  var $6 = ($5 | 0) > 0;
  $_$4 : do {
    if ($6) {
      if (($4 | 0) > 0) {
        var $Count_03_us = 0;
        var $_y_04_us = 0;
        while (1) {
          var $_y_04_us;
          var $Count_03_us;
          var $Count_11_us = $Count_03_us;
          var $_x_02_us = 0;
          while (1) {
            var $_x_02_us;
            var $Count_11_us;
            var $11 = __ZN7cGrid2DIsEclEjj($3, $_x_02_us, $_y_04_us);
            var $_Count_1_us = (HEAP16[$11 >> 1] << 16 >> 16 == 1863 & 1) + $Count_11_us | 0;
            var $15 = $_x_02_us + 1 | 0;
            if (($15 | 0) == ($4 | 0)) {
              break;
            }
            var $Count_11_us = $_Count_1_us;
            var $_x_02_us = $15;
          }
          var $9 = $_y_04_us + 1 | 0;
          if (($9 | 0) == ($5 | 0)) {
            var $Count_0_lcssa = $_Count_1_us;
            break $_$4;
          }
          var $Count_03_us = $_Count_1_us;
          var $_y_04_us = $9;
        }
      } else {
        var $_y_04 = 0;
        while (1) {
          var $_y_04;
          var $16 = $_y_04 + 1 | 0;
          if (($16 | 0) == ($5 | 0)) {
            var $Count_0_lcssa = 0;
            break $_$4;
          }
          var $_y_04 = $16;
        }
      }
    } else {
      var $Count_0_lcssa = 0;
    }
  } while (0);
  var $Count_0_lcssa;
  return $Count_0_lcssa;
  return null;
}

function __ZN7cGrid2DIsEclEjj($this, $_x, $_y) {
  var $1 = __ZNK7cGrid2DIsE5IndexEii($this, $_x, $_y);
  return ($1 << 1) + HEAP32[$this + 8 >> 2] | 0;
  return null;
}

function __Z10CountExitsi($Layer) {
  var $3 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
  var $4 = __ZNK7cGrid2DIsE5WidthEv($3);
  var $5 = __ZNK7cGrid2DIsE6HeightEv($3);
  var $6 = ($5 | 0) > 0;
  $_$19 : do {
    if ($6) {
      if (($4 | 0) > 0) {
        var $Count_03_us = 0;
        var $_y_04_us = 0;
        while (1) {
          var $_y_04_us;
          var $Count_03_us;
          var $Count_11_us = $Count_03_us;
          var $_x_02_us = 0;
          while (1) {
            var $_x_02_us;
            var $Count_11_us;
            var $11 = __ZN7cGrid2DIsEclEjj($3, $_x_02_us, $_y_04_us);
            var $_Count_1_us = (HEAP16[$11 >> 1] << 16 >> 16 == 1864 & 1) + $Count_11_us | 0;
            var $15 = $_x_02_us + 1 | 0;
            if (($15 | 0) == ($4 | 0)) {
              break;
            }
            var $Count_11_us = $_Count_1_us;
            var $_x_02_us = $15;
          }
          var $9 = $_y_04_us + 1 | 0;
          if (($9 | 0) == ($5 | 0)) {
            var $Count_0_lcssa = $_Count_1_us;
            break $_$19;
          }
          var $Count_03_us = $_Count_1_us;
          var $_y_04_us = $9;
        }
      } else {
        var $_y_04 = 0;
        while (1) {
          var $_y_04;
          var $16 = $_y_04 + 1 | 0;
          if (($16 | 0) == ($5 | 0)) {
            var $Count_0_lcssa = 0;
            break $_$19;
          }
          var $_y_04 = $16;
        }
      }
    } else {
      var $Count_0_lcssa = 0;
    }
  } while (0);
  var $Count_0_lcssa;
  return $Count_0_lcssa;
  return null;
}

function __Z10CountStarsi($Layer) {
  var $3 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
  var $4 = __ZNK7cGrid2DIsE5WidthEv($3);
  var $5 = __ZNK7cGrid2DIsE6HeightEv($3);
  var $6 = ($5 | 0) > 0;
  $_$31 : do {
    if ($6) {
      if (($4 | 0) > 0) {
        var $StarCount_03_us = 0;
        var $_y_04_us = 0;
        while (1) {
          var $_y_04_us;
          var $StarCount_03_us;
          var $StarCount_11_us = $StarCount_03_us;
          var $_x_02_us = 0;
          while (1) {
            var $_x_02_us;
            var $StarCount_11_us;
            var $11 = __ZN7cGrid2DIsEclEjj($3, $_x_02_us, $_y_04_us);
            var $12 = HEAPU16[$11 >> 1];
            var $StarCount_3_us = ($12 << 16 >> 16 == 1861 & 1) + $StarCount_11_us + ($12 << 16 >> 16 == 1859 & 1) | 0;
            var $17 = $_x_02_us + 1 | 0;
            if (($17 | 0) == ($4 | 0)) {
              break;
            }
            var $StarCount_11_us = $StarCount_3_us;
            var $_x_02_us = $17;
          }
          var $9 = $_y_04_us + 1 | 0;
          if (($9 | 0) == ($5 | 0)) {
            var $StarCount_0_lcssa = $StarCount_3_us;
            break $_$31;
          }
          var $StarCount_03_us = $StarCount_3_us;
          var $_y_04_us = $9;
        }
      } else {
        var $_y_04 = 0;
        while (1) {
          var $_y_04;
          var $18 = $_y_04 + 1 | 0;
          if (($18 | 0) == ($5 | 0)) {
            var $StarCount_0_lcssa = 0;
            break $_$31;
          }
          var $_y_04 = $18;
        }
      }
    } else {
      var $StarCount_0_lcssa = 0;
    }
  } while (0);
  var $StarCount_0_lcssa;
  return $StarCount_0_lcssa;
  return null;
}

function __Z9CountKeysi($Layer) {
  var $3 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
  var $4 = __ZNK7cGrid2DIsE5WidthEv($3);
  var $5 = __ZNK7cGrid2DIsE6HeightEv($3);
  var $6 = ($5 | 0) > 0;
  $_$43 : do {
    if ($6) {
      if (($4 | 0) > 0) {
        var $StarCount_03_us = 0;
        var $_y_04_us = 0;
        while (1) {
          var $_y_04_us;
          var $StarCount_03_us;
          var $StarCount_11_us = $StarCount_03_us;
          var $_x_02_us = 0;
          while (1) {
            var $_x_02_us;
            var $StarCount_11_us;
            var $11 = __ZN7cGrid2DIsEclEjj($3, $_x_02_us, $_y_04_us);
            var $12 = HEAPU16[$11 >> 1];
            var $StarCount_3_us = ($12 << 16 >> 16 == 1862 & 1) + $StarCount_11_us + ($12 << 16 >> 16 == 1860 & 1) | 0;
            var $17 = $_x_02_us + 1 | 0;
            if (($17 | 0) == ($4 | 0)) {
              break;
            }
            var $StarCount_11_us = $StarCount_3_us;
            var $_x_02_us = $17;
          }
          var $9 = $_y_04_us + 1 | 0;
          if (($9 | 0) == ($5 | 0)) {
            var $StarCount_0_lcssa = $StarCount_3_us;
            break $_$43;
          }
          var $StarCount_03_us = $StarCount_3_us;
          var $_y_04_us = $9;
        }
      } else {
        var $_y_04 = 0;
        while (1) {
          var $_y_04;
          var $18 = $_y_04 + 1 | 0;
          if (($18 | 0) == ($5 | 0)) {
            var $StarCount_0_lcssa = 0;
            break $_$43;
          }
          var $_y_04 = $18;
        }
      }
    } else {
      var $StarCount_0_lcssa = 0;
    }
  } while (0);
  var $StarCount_0_lcssa;
  return $StarCount_0_lcssa;
  return null;
}

function __Z18ProcessObjectLayeri($Layer) {
  var $3 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
  var $4 = __ZNK7cGrid2DIsE6HeightEv($3);
  var $5 = __Z10CountDoorsi($Layer);
  var $6 = __Z10CountExitsi($Layer);
  var $7 = HEAP32[_MapDoor >> 2];
  if (($7 | 0) != 0) {
    var $9 = ($5 | 0) > 0;
    $_$57 : do {
      if ($9) {
        var $idx_02 = 0;
        var $10 = $7;
        while (1) {
          var $10;
          var $idx_02;
          var $12 = HEAP32[$10 + ($idx_02 << 2) + 8 >> 2];
          if (($12 | 0) == 0) {
            var $17 = $10;
          } else {
            var $15 = $12;
            __ZdlPv($15);
            var $17 = HEAP32[_MapDoor >> 2];
          }
          var $17;
          var $18 = $idx_02 + 1 | 0;
          if (($18 | 0) == ($5 | 0)) {
            var $_lcssa = $17;
            break $_$57;
          }
          var $idx_02 = $18;
          var $10 = $17;
        }
      } else {
        var $_lcssa = $7;
      }
    } while (0);
    var $_lcssa;
    __Z15delete_GelArrayIP5cDoorEvP8GelArrayIT_E($_lcssa);
  }
  var $20 = __Z12new_GelArrayIP5cDoorEP8GelArrayIT_Ej($5);
  HEAP32[_MapDoor >> 2] = $20;
  var $21 = HEAP32[_MapExit >> 2];
  if (($21 | 0) != 0) {
    var $23 = ($6 | 0) > 0;
    $_$67 : do {
      if ($23) {
        var $idx1_05 = 0;
        var $24 = $21;
        while (1) {
          var $24;
          var $idx1_05;
          var $26 = HEAP32[$24 + ($idx1_05 << 2) + 8 >> 2];
          if (($26 | 0) == 0) {
            var $31 = $24;
          } else {
            var $29 = $26;
            __ZdlPv($29);
            var $31 = HEAP32[_MapExit >> 2];
          }
          var $31;
          var $32 = $idx1_05 + 1 | 0;
          if (($32 | 0) == ($6 | 0)) {
            var $_lcssa4 = $31;
            break $_$67;
          }
          var $idx1_05 = $32;
          var $24 = $31;
        }
      } else {
        var $_lcssa4 = $21;
      }
    } while (0);
    var $_lcssa4;
    __Z15delete_GelArrayIP5cExitEvP8GelArrayIT_E($_lcssa4);
  }
  var $34 = __Z12new_GelArrayIP5cExitEP8GelArrayIT_Ej($6);
  HEAP32[_MapExit >> 2] = $34;
  var $35 = ($4 | 0) > 0;
  $_$75 : do {
    if ($35) {
      var $CurrentDoor_017 = 0;
      var $CurrentExit_018 = 0;
      var $_y_019 = 0;
      while (1) {
        var $_y_019;
        var $CurrentExit_018;
        var $CurrentDoor_017;
        var $38 = ($_y_019 << 3) + 8 | 0;
        var $CurrentDoor_110 = $CurrentDoor_017;
        var $CurrentExit_111 = $CurrentExit_018;
        var $_x_012 = 0;
        while (1) {
          var $_x_012;
          var $CurrentExit_111;
          var $CurrentDoor_110;
          var $41 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
          var $42 = __ZN7cGrid2DIsEclEjj($41, $_x_012, $_y_019);
          var $43 = HEAP16[$42 >> 1];
          if ($43 << 16 >> 16 == 1864) {
            var $57 = __Znwj(44);
            var $58 = $57;
            __ZN5cExitC1Eff($58, $_x_012 << 3 | 0, $38);
            var $61 = $CurrentExit_111 + 1 | 0;
            var $63 = ($CurrentExit_111 << 2) + HEAP32[_MapExit >> 2] + 8 | 0;
            HEAP32[$63 >> 2] = $58;
            var $66 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
            var $67 = __ZN7cGrid2DIsEclEjj($66, $_x_012, $_y_019);
            HEAP16[$67 >> 1] = 0;
            var $CurrentExit_2 = $61;
            var $CurrentDoor_2 = $CurrentDoor_110;
          } else if ($43 << 16 >> 16 == 1863) {
            var $45 = __Znwj(44);
            var $46 = $45;
            __ZN5cDoorC1Eff($46, $_x_012 << 3 | 0, $38);
            var $49 = $CurrentDoor_110 + 1 | 0;
            var $51 = ($CurrentDoor_110 << 2) + HEAP32[_MapDoor >> 2] + 8 | 0;
            HEAP32[$51 >> 2] = $46;
            var $54 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
            var $55 = __ZN7cGrid2DIsEclEjj($54, $_x_012, $_y_019);
            HEAP16[$55 >> 1] = 0;
            var $CurrentExit_2 = $CurrentExit_111;
            var $CurrentDoor_2 = $49;
          } else {
            var $CurrentExit_2 = $CurrentExit_111;
            var $CurrentDoor_2 = $CurrentDoor_110;
          }
          var $CurrentDoor_2;
          var $CurrentExit_2;
          var $69 = $_x_012 + 1 | 0;
          if (($69 | 0) == ($4 | 0)) {
            break;
          }
          var $CurrentDoor_110 = $CurrentDoor_2;
          var $CurrentExit_111 = $CurrentExit_2;
          var $_x_012 = $69;
        }
        var $70 = $_y_019 + 1 | 0;
        if (($70 | 0) == ($4 | 0)) {
          break $_$75;
        }
        var $CurrentDoor_017 = $CurrentDoor_2;
        var $CurrentExit_018 = $CurrentExit_2;
        var $_y_019 = $70;
      }
    }
  } while (0);
  return;
  return;
}

__Z18ProcessObjectLayeri["X"] = 1;

function __Z15delete_GelArrayIP5cDoorEvP8GelArrayIT_E($p) {
  if (($p | 0) != 0) {
    var $3 = $p;
    __ZdlPv($3);
  }
  return;
  return;
}

function __Z12new_GelArrayIP5cDoorEP8GelArrayIT_Ej($_Size) {
  var $2 = ($_Size << 2) + 8 | 0;
  var $3 = __Znaj($2);
  var $4 = $3;
  HEAP32[$3 + 4 >> 2] = $_Size;
  HEAP32[$3 >> 2] = $_Size;
  return $4;
  return null;
}

function __Z15delete_GelArrayIP5cExitEvP8GelArrayIT_E($p) {
  if (($p | 0) != 0) {
    var $3 = $p;
    __ZdlPv($3);
  }
  return;
  return;
}

function __Z12new_GelArrayIP5cExitEP8GelArrayIT_Ej($_Size) {
  var $2 = ($_Size << 2) + 8 | 0;
  var $3 = __Znaj($2);
  var $4 = $3;
  HEAP32[$3 + 4 >> 2] = $_Size;
  HEAP32[$3 >> 2] = $_Size;
  return $4;
  return null;
}

function __ZN5cDoorC1Eff($this, $_x, $_y) {
  __ZN5cDoorC2Eff($this, $_x, $_y);
  return;
  return;
}

function __ZN5cExitC1Eff($this, $_x, $_y) {
  __ZN5cExitC2Eff($this, $_x, $_y);
  return;
  return;
}

function __Z7LoadMapv() {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $1 = __stackBase__;
  if ((HEAP32[_MapLayer >> 2] | 0) != 0) {
    var $4 = _mrGetLayerCount();
    var $5 = ($4 | 0) == 0;
    var $6 = HEAPU32[_MapLayer >> 2];
    $_$101 : do {
      if ($5) {
        var $_lcssa = $6;
      } else {
        var $idx_02 = 0;
        var $7 = $6;
        while (1) {
          var $7;
          var $idx_02;
          var $9 = HEAP32[$7 + ($idx_02 << 2) + 8 >> 2];
          if (($9 | 0) != 0) {
            __ZN7cGrid2DIsED1Ev($9);
            var $12 = $9;
            __ZdlPv($12);
          }
          var $14 = $idx_02 + 1 | 0;
          var $15 = _mrGetLayerCount();
          var $17 = HEAP32[_MapLayer >> 2];
          if ($14 >>> 0 >= $15 >>> 0) {
            var $_lcssa = $17;
            break $_$101;
          }
          var $idx_02 = $14;
          var $7 = $17;
        }
      }
    } while (0);
    var $_lcssa;
    __Z15delete_GelArrayIP7cGrid2DIsEEvP8GelArrayIT_E($_lcssa);
  }
  var $19 = HEAP32[_Player >> 2];
  if (($19 | 0) != 0) {
    var $22 = $19;
    __ZdlPv($22);
  }
  var $24 = _mrGetLayerCount();
  var $25 = __Z12new_GelArrayIP7cGrid2DIsEEP8GelArrayIT_Ej($24);
  HEAP32[_MapLayer >> 2] = $25;
  var $26 = _mrGetLayerCount();
  var $idx1_0 = 0;
  while (1) {
    var $idx1_0;
    if (($idx1_0 | 0) >= ($26 | 0)) {
      break;
    }
    _mrBindLayer($idx1_0);
    var $30 = __Znwj(12);
    var $31 = $30;
    var $32 = _mrGetWidth();
    var $34 = _mrGetHeight();
    HEAP16[$1 >> 1] = 0;
    __ZN7cGrid2DIsEC1EjjRKs($31, $32, $34, $1);
    var $38 = ($idx1_0 << 2) + HEAP32[_MapLayer >> 2] + 8 | 0;
    HEAP32[$38 >> 2] = $31;
    var $39 = _mrGetSize();
    var $40 = ($39 | 0) > 0;
    $_$118 : do {
      if ($40) {
        var $idx2_03 = 0;
        while (1) {
          var $idx2_03;
          var $41 = _mrIndex($idx2_03);
          var $42 = $41 & 65535;
          var $45 = HEAP32[HEAP32[_MapLayer >> 2] + ($idx1_0 << 2) + 8 >> 2];
          var $46 = __ZN7cGrid2DIsEixEj($45, $idx2_03);
          HEAP16[$46 >> 1] = $42;
          var $47 = $idx2_03 + 1 | 0;
          if (($47 | 0) == ($39 | 0)) {
            break $_$118;
          }
          var $idx2_03 = $47;
        }
      }
    } while (0);
    var $idx1_0 = $idx1_0 + 1 | 0;
  }
  var $51 = HEAP32[_MapLayer >> 2] + 4 | 0;
  var $53 = HEAP32[$51 >> 2] - 1 | 0;
  var $54 = __Z10CountStarsi($53);
  HEAP32[_TotalStarsInMap >> 2] = $54;
  var $56 = HEAP32[$51 >> 2] - 1 | 0;
  var $57 = __Z9CountKeysi($56);
  HEAP32[_TotalKeysInMap >> 2] = $57;
  var $58 = __Znwj(108);
  var $59 = $58;
  __ZN7cPlayerC1Eff($59, 200, 344);
  HEAP32[_Player >> 2] = $59;
  var $60 = $58;
  var $61$0 = HEAP32[$60 >> 2];
  var $61$1 = HEAP32[$60 + 4 >> 2];
  var $$emscripten$temp$0 = _CameraPos;
  HEAP32[$$emscripten$temp$0 >> 2] = $61$0;
  HEAP32[$$emscripten$temp$0 + 4 >> 2] = $61$1;
  var $65 = HEAP32[HEAP32[_MapLayer >> 2] + 4 >> 2] - 1 | 0;
  __Z18ProcessObjectLayeri($65);
  HEAP32[_GlobalTotalKeys >> 2] = 0;
  STACKTOP = __stackBase__;
  return;
  return;
}

__Z7LoadMapv["X"] = 1;

function __ZN7cGrid2DIsED1Ev($this) {
  __ZN7cGrid2DIsED2Ev($this);
  return;
  return;
}

function __Z15delete_GelArrayIP7cGrid2DIsEEvP8GelArrayIT_E($p) {
  if (($p | 0) != 0) {
    var $3 = $p;
    __ZdlPv($3);
  }
  return;
  return;
}

function __Z12new_GelArrayIP7cGrid2DIsEEP8GelArrayIT_Ej($_Size) {
  var $2 = ($_Size << 2) + 8 | 0;
  var $3 = __Znaj($2);
  var $4 = $3;
  HEAP32[$3 + 4 >> 2] = $_Size;
  HEAP32[$3 >> 2] = $_Size;
  return $4;
  return null;
}

function __ZN7cGrid2DIsEC1EjjRKs($this, $_w, $_h, $Type) {
  __ZN7cGrid2DIsEC2EjjRKs($this, $_w, $_h, $Type);
  return;
  return;
}

function __ZN7cPlayerC1Eff($this, $_x, $_y) {
  __ZN7cPlayerC2Eff($this, $_x, $_y);
  return;
  return;
}

function __Z8GameInitv() {
  var __stackBase__ = STACKTOP;
  STACKTOP += 16;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 4;
  var $3 = __stackBase__ + 8;
  var $4 = __stackBase__ + 12;
  HEAP32[_ScreenWidth >> 2] = 320;
  HEAP32[_ScreenHeight >> 2] = 240;
  HEAP32[_HalfScreenWidth >> 2] = 160;
  HEAP32[_HalfScreenHeight >> 2] = 120;
  _gelGraphicsInit(320, 240);
  HEAPF32[$2 >> 2] = HEAP32[_HalfScreenWidth >> 2] | 0;
  __ZN4RealC1ERKf($1, $2);
  var $8 = HEAP32[$1 >> 2];
  HEAP32[_CameraPos >> 2] = $8;
  HEAPF32[$4 >> 2] = HEAP32[_HalfScreenHeight >> 2] | 0;
  __ZN4RealC1ERKf($3, $4);
  var $12 = HEAPF32[$3 >> 2];
  HEAPF32[_CameraPos + 4 >> 2] = $12;
  var $13 = _gelLoadTileset(STRING_TABLE.__str | 0, 8, 8);
  HEAP32[_TilesetId >> 2] = $13;
  var $14 = _gelLoadTileset(STRING_TABLE.__str1 | 0, 64, 64);
  HEAP32[_PlayerId >> 2] = $14;
  var $15 = _gelLoadTileset(STRING_TABLE.__str2 | 0, 32, 32);
  HEAP32[_HudId >> 2] = $15;
  var $16 = _gelLoadTileset(STRING_TABLE.__str3 | 0, 64, 64);
  HEAP32[_DoorId >> 2] = $16;
  var $17 = _gelLoadTileset(STRING_TABLE.__str4 | 0, 32, 32);
  HEAP32[_StarsId >> 2] = $17;
  var $18 = _gelLoadImage(STRING_TABLE.__str5 | 0);
  HEAP32[_TitleId >> 2] = $18;
  var $19 = _gelLoadImage(STRING_TABLE.__str6 | 0);
  HEAP32[_WinId >> 2] = $19;
  HEAP32[_GameState >> 2] = 1;
  __Z7LoadMapv();
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN4RealC1ERKf($this, $_Data) {
  __ZN4RealC2ERKf($this, $_Data);
  return;
  return;
}

function __Z8GameExitv() {
  var $1 = HEAP32[_Player >> 2];
  if (($1 | 0) != 0) {
    var $4 = $1;
    __ZdlPv($4);
  }
  _gelGraphicsExit();
  return;
  return;
}

function __Z10EngineStepv() {
  var __stackBase__ = STACKTOP;
  STACKTOP += 172;
  var $PlayerRect = __stackBase__;
  var $1 = __stackBase__ + 20;
  var $Diff = __stackBase__ + 40;
  var $2 = __stackBase__ + 60;
  var $Line = __stackBase__ + 80;
  var $3 = __stackBase__ + 88;
  var $4 = __stackBase__ + 96;
  var $5 = __stackBase__ + 104;
  var $6 = __stackBase__ + 124;
  var $7 = __stackBase__ + 128;
  var $PlayerRect1 = __stackBase__ + 132;
  var $8 = __stackBase__ + 152;
  var $9 = HEAP32[_Player >> 2];
  __ZN7cPlayer4StepEv($9);
  var $10 = HEAP32[_Player >> 2];
  __ZN7cPlayer7GetRectEv($PlayerRect, $10);
  var $11 = HEAP32[_MapDoor >> 2];
  var $14 = (HEAP32[$11 + 4 >> 2] | 0) == 0;
  $_$139 : do {
    if (!$14) {
      var $15 = $Line | 0;
      var $idx_02 = 0;
      var $17 = $11;
      while (1) {
        var $17;
        var $idx_02;
        var $19 = HEAP32[$17 + ($idx_02 << 2) + 8 >> 2];
        __ZN5cDoor7GetRectEv($1, $19);
        var $20 = __ZNK11ShapeRect2DeqERKS_($1, $PlayerRect);
        do {
          if ($20) {
            var $24 = HEAP32[HEAP32[_MapDoor >> 2] + ($idx_02 << 2) + 8 >> 2];
            if ((HEAP8[$24 + 40 | 0] & 1) << 24 >> 24 != 0) {
              break;
            }
            if ((HEAP32[HEAP32[_Player >> 2] + 68 >> 2] | 0) > 0) {
              var $35 = _sndPlay(STRING_TABLE.__str7 | 0);
              var $37 = HEAP32[_Player >> 2] + 68 | 0;
              var $39 = HEAP32[$37 >> 2] - 1 | 0;
              HEAP32[$37 >> 2] = $39;
              var $41 = HEAP32[_Player >> 2] + 72 | 0;
              var $43 = HEAP32[$41 >> 2] + 1 | 0;
              HEAP32[$41 >> 2] = $43;
              HEAP8[HEAP32[HEAP32[_MapDoor >> 2] + ($idx_02 << 2) + 8 >> 2] + 40 | 0] = 1;
              var $51 = HEAP8[HEAP32[_Player >> 2] + 60 | 0] & 1;
              HEAP8[HEAP32[HEAP32[_MapDoor >> 2] + ($idx_02 << 2) + 8 >> 2] + 41 | 0] = $51;
              var $58 = HEAP32[HEAP32[_MapDoor >> 2] + ($idx_02 << 2) + 8 >> 2];
              __ZN5cDoor12SetAnimationEPKi($58, __ZL11Door_Opened | 0);
              var $61 = HEAP32[HEAP32[_MapDoor >> 2] + ($idx_02 << 2) + 8 >> 2];
              __ZN5cDoor24SetIntermediateAnimationEPKi($61, __ZL9Door_Open | 0);
            } else {
              __ZN5cDoor7GetRectEv($2, $24);
              __ZN5boostmiERK11ShapeRect2DS2_($Diff, $PlayerRect, $2);
              __ZNK11ShapeRect2D6CenterEv($3, $PlayerRect);
              var $65 = HEAP32[HEAP32[_MapDoor >> 2] + ($idx_02 << 2) + 8 >> 2];
              __ZN5cDoor7GetRectEv($5, $65);
              __ZNK11ShapeRect2D6CenterEv($4, $5);
              __ZN5boostmiERK8Vector2DS2_($Line, $3, $4);
              var $67 = HEAP32[_Player >> 2] | 0;
              __ZNK4Real6NormalEv($7, $15);
              var $68 = __ZNK11ShapeRect2D5WidthEv($Diff);
              __ZNK4RealmlERKS_($6, $7, $68);
              var $69 = __ZN4RealpLERKS_($67, $6);
            }
          }
        } while (0);
        var $72 = HEAP32[HEAP32[_MapDoor >> 2] + ($idx_02 << 2) + 8 >> 2];
        __ZN5cDoor4StepEv($72);
        var $73 = $idx_02 + 1 | 0;
        var $74 = HEAPU32[_MapDoor >> 2];
        if ($73 >>> 0 >= HEAPU32[$74 + 4 >> 2] >>> 0) {
          break $_$139;
        }
        var $idx_02 = $73;
        var $17 = $74;
      }
    }
  } while (0);
  var $78 = HEAP32[_Player >> 2];
  __ZN7cPlayer7GetRectEv($PlayerRect1, $78);
  var $79 = HEAPU32[_MapExit >> 2];
  var $82 = (HEAP32[$79 + 4 >> 2] | 0) == 0;
  $_$151 : do {
    if (!$82) {
      var $idx2_01 = 0;
      var $83 = $79;
      while (1) {
        var $83;
        var $idx2_01;
        var $85 = HEAP32[$83 + ($idx2_01 << 2) + 8 >> 2];
        __ZN5cExit7GetRectEv($8, $85);
        var $86 = __ZNK11ShapeRect2DeqERKS_($8, $PlayerRect1);
        do {
          if ($86) {
            if ((HEAP8[HEAP32[HEAP32[_MapExit >> 2] + ($idx2_01 << 2) + 8 >> 2] + 40 | 0] & 1) << 24 >> 24 != 0) {
              break;
            }
            var $96 = HEAP32[_Player >> 2];
            var $97 = $96 + 68 | 0;
            var $98 = HEAP32[$97 >> 2];
            if (($98 | 0) != (HEAP32[_TotalKeysInMap >> 2] - HEAP32[$96 + 72 >> 2] | 0)) {
              break;
            }
            var $105 = $98 - 1 | 0;
            HEAP32[$97 >> 2] = $105;
            var $107 = HEAP32[_Player >> 2] + 72 | 0;
            var $109 = HEAP32[$107 >> 2] + 1 | 0;
            HEAP32[$107 >> 2] = $109;
            var $110 = _sndPlay(STRING_TABLE.__str8 | 0);
            HEAP32[_GameState >> 2] = 3;
            HEAP8[HEAP32[HEAP32[_MapExit >> 2] + ($idx2_01 << 2) + 8 >> 2] + 40 | 0] = 1;
            var $117 = HEAP32[HEAP32[_MapExit >> 2] + ($idx2_01 << 2) + 8 >> 2];
            __ZN5cExit12SetAnimationEPKi($117, __ZL11Exit_Opened | 0);
          }
        } while (0);
        var $120 = HEAP32[HEAP32[_MapExit >> 2] + ($idx2_01 << 2) + 8 >> 2];
        __ZN5cExit4StepEv($120);
        var $121 = $idx2_01 + 1 | 0;
        var $122 = HEAPU32[_MapExit >> 2];
        if ($121 >>> 0 >= HEAPU32[$122 + 4 >> 2] >>> 0) {
          break $_$151;
        }
        var $idx2_01 = $121;
        var $83 = $122;
      }
    }
  } while (0);
  var $126 = HEAPU32[_Player >> 2];
  var $127 = $126;
  var $128$0 = HEAP32[$127 >> 2];
  var $128$1 = HEAP32[$127 + 4 >> 2];
  var $$emscripten$temp$0 = _CameraPos;
  HEAP32[$$emscripten$temp$0 >> 2] = $128$0;
  HEAP32[$$emscripten$temp$0 + 4 >> 2] = $128$1;
  var $129 = HEAP32[_GlobalTotalKeys >> 2];
  var $134 = HEAP32[$126 + 68 >> 2] + HEAP32[$126 + 72 >> 2] | 0;
  HEAP32[_GlobalTotalKeys >> 2] = $134;
  if (!(($134 | 0) != (HEAP32[_TotalKeysInMap >> 2] | 0) | ($134 | 0) == ($129 | 0))) {
    var $139 = _sndPlay(STRING_TABLE.__str8 | 0);
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

__Z10EngineStepv["X"] = 1;

function __ZN7cPlayer4StepEv($this) {
  var $784$s2;
  var $779$s2;
  var $500$s2;
  var $499$s2;
  var $495$s2;
  var $494$s2;
  var $454$s2;
  var $453$s2;
  var $448$s2;
  var $447$s2;
  var $257$s2;
  var $221$s2;
  var $216$s2;
  var $210$s2;
  var $205$s2;
  var $199$s2;
  var $194$s2;
  var $188$s2;
  var $183$s2;
  var $Velocity1$s2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 1320;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 8;
  var $3 = __stackBase__ + 12;
  var $4 = __stackBase__ + 16;
  var $5 = __stackBase__ + 20;
  var $Velocity = __stackBase__ + 24;
  var $MoveScalar = __stackBase__ + 32;
  var $6 = __stackBase__ + 36;
  var $7 = __stackBase__ + 40;
  var $MoveRate = __stackBase__ + 44;
  var $8 = __stackBase__ + 48;
  var $9 = __stackBase__ + 52;
  var $10 = __stackBase__ + 56;
  var $11 = __stackBase__ + 60;
  var $12 = __stackBase__ + 64;
  var $13 = __stackBase__ + 72;
  var $14 = __stackBase__ + 80;
  var $15 = __stackBase__ + 84;
  var $16 = __stackBase__ + 88;
  var $Velocity1 = __stackBase__ + 92, $Velocity1$s2 = $Velocity1 >> 2;
  var $17 = __stackBase__ + 100;
  var $18 = __stackBase__ + 104;
  var $19 = __stackBase__ + 108;
  var $20 = __stackBase__ + 112;
  var $21 = __stackBase__ + 116;
  var $22 = __stackBase__ + 120;
  var $23 = __stackBase__ + 124;
  var $24 = __stackBase__ + 128;
  var $25 = __stackBase__ + 132;
  var $26 = __stackBase__ + 136;
  var $27 = __stackBase__ + 140;
  var $28 = __stackBase__ + 144;
  var $29 = __stackBase__ + 148;
  var $30 = __stackBase__ + 152;
  var $31 = __stackBase__ + 156;
  var $32 = __stackBase__ + 160;
  var $33 = __stackBase__ + 164;
  var $34 = __stackBase__ + 172;
  var $35 = __stackBase__ + 180;
  var $36 = __stackBase__ + 184;
  var $37 = __stackBase__ + 188;
  var $38 = __stackBase__ + 192;
  var $39 = __stackBase__ + 196;
  var $40 = __stackBase__ + 200;
  var $41 = __stackBase__ + 204;
  var $42 = __stackBase__ + 208;
  var $43 = __stackBase__ + 212;
  var $44 = __stackBase__ + 216;
  var $45 = __stackBase__ + 220;
  var $46 = __stackBase__ + 224;
  var $47 = __stackBase__ + 228;
  var $48 = __stackBase__ + 232;
  var $49 = __stackBase__ + 236;
  var $50 = __stackBase__ + 240;
  var $51 = __stackBase__ + 244;
  var $52 = __stackBase__ + 248;
  var $53 = __stackBase__ + 252;
  var $54 = __stackBase__ + 256;
  var $55 = __stackBase__ + 260;
  var $56 = __stackBase__ + 264;
  var $57 = __stackBase__ + 268;
  var $58 = __stackBase__ + 272;
  var $59 = __stackBase__ + 276;
  var $60 = __stackBase__ + 280;
  var $61 = __stackBase__ + 284;
  var $62 = __stackBase__ + 288;
  var $63 = __stackBase__ + 292;
  var $64 = __stackBase__ + 296;
  var $65 = __stackBase__ + 300;
  var $66 = __stackBase__ + 304;
  var $67 = __stackBase__ + 308;
  var $Scalar = __stackBase__ + 316;
  var $68 = __stackBase__ + 320;
  var $69 = __stackBase__ + 324;
  var $70 = __stackBase__ + 328;
  var $71 = __stackBase__ + 332;
  var $72 = __stackBase__ + 336;
  var $73 = __stackBase__ + 340;
  var $Rect = __stackBase__ + 348;
  var $74 = __stackBase__ + 368;
  var $75 = __stackBase__ + 376;
  var $76 = __stackBase__ + 384;
  var $77 = __stackBase__ + 392;
  var $VsBottomRect = __stackBase__ + 400;
  var $VsTopRect = __stackBase__ + 420;
  var $VsLeftRect = __stackBase__ + 440;
  var $VsRightRect = __stackBase__ + 460;
  var $VsTopLeftRect = __stackBase__ + 480;
  var $VsTopRightRect = __stackBase__ + 500;
  var $VsBottomLeftRect = __stackBase__ + 520;
  var $VsBottomRightRect = __stackBase__ + 540;
  var $78 = __stackBase__ + 560;
  var $79 = __stackBase__ + 580;
  var $80 = __stackBase__ + 588;
  var $81 = __stackBase__ + 592;
  var $82 = __stackBase__ + 596;
  var $83 = __stackBase__ + 600;
  var $84 = __stackBase__ + 604;
  var $85 = __stackBase__ + 612;
  var $86 = __stackBase__ + 616;
  var $87 = __stackBase__ + 620;
  var $88 = __stackBase__ + 624;
  var $89 = __stackBase__ + 628;
  var $90 = __stackBase__ + 648;
  var $91 = __stackBase__ + 656;
  var $92 = __stackBase__ + 660;
  var $93 = __stackBase__ + 664;
  var $94 = __stackBase__ + 668;
  var $95 = __stackBase__ + 672;
  var $96 = __stackBase__ + 680;
  var $97 = __stackBase__ + 684;
  var $98 = __stackBase__ + 688;
  var $99 = __stackBase__ + 692;
  var $100 = __stackBase__ + 696;
  var $101 = __stackBase__ + 716;
  var $102 = __stackBase__ + 724;
  var $103 = __stackBase__ + 728;
  var $104 = __stackBase__ + 732;
  var $105 = __stackBase__ + 736;
  var $106 = __stackBase__ + 740;
  var $107 = __stackBase__ + 748;
  var $108 = __stackBase__ + 752;
  var $109 = __stackBase__ + 756;
  var $110 = __stackBase__ + 760;
  var $111 = __stackBase__ + 764;
  var $112 = __stackBase__ + 784;
  var $113 = __stackBase__ + 792;
  var $114 = __stackBase__ + 796;
  var $115 = __stackBase__ + 800;
  var $116 = __stackBase__ + 804;
  var $117 = __stackBase__ + 808;
  var $118 = __stackBase__ + 816;
  var $119 = __stackBase__ + 820;
  var $120 = __stackBase__ + 824;
  var $121 = __stackBase__ + 828;
  var $122 = __stackBase__ + 832;
  var $123 = __stackBase__ + 852;
  var $124 = __stackBase__ + 860;
  var $125 = __stackBase__ + 864;
  var $126 = __stackBase__ + 868;
  var $127 = __stackBase__ + 872;
  var $128 = __stackBase__ + 876;
  var $129 = __stackBase__ + 884;
  var $130 = __stackBase__ + 888;
  var $131 = __stackBase__ + 892;
  var $132 = __stackBase__ + 896;
  var $133 = __stackBase__ + 900;
  var $134 = __stackBase__ + 920;
  var $135 = __stackBase__ + 928;
  var $136 = __stackBase__ + 932;
  var $137 = __stackBase__ + 936;
  var $138 = __stackBase__ + 940;
  var $139 = __stackBase__ + 944;
  var $140 = __stackBase__ + 952;
  var $141 = __stackBase__ + 956;
  var $142 = __stackBase__ + 960;
  var $143 = __stackBase__ + 964;
  var $144 = __stackBase__ + 968;
  var $145 = __stackBase__ + 988;
  var $146 = __stackBase__ + 996;
  var $147 = __stackBase__ + 1e3;
  var $148 = __stackBase__ + 1004;
  var $149 = __stackBase__ + 1008;
  var $150 = __stackBase__ + 1012;
  var $151 = __stackBase__ + 1020;
  var $152 = __stackBase__ + 1024;
  var $153 = __stackBase__ + 1028;
  var $154 = __stackBase__ + 1032;
  var $155 = __stackBase__ + 1036;
  var $156 = __stackBase__ + 1056;
  var $157 = __stackBase__ + 1064;
  var $158 = __stackBase__ + 1068;
  var $159 = __stackBase__ + 1072;
  var $160 = __stackBase__ + 1076;
  var $161 = __stackBase__ + 1080;
  var $162 = __stackBase__ + 1088;
  var $163 = __stackBase__ + 1092;
  var $164 = __stackBase__ + 1096;
  var $165 = __stackBase__ + 1100;
  var $Result = __stackBase__ + 1104;
  var $Line = __stackBase__ + 1124;
  var $166 = __stackBase__ + 1132;
  var $167 = __stackBase__ + 1140;
  var $168 = __stackBase__ + 1148;
  var $169 = __stackBase__ + 1152;
  var $Result11 = __stackBase__ + 1156;
  var $Line12 = __stackBase__ + 1176;
  var $170 = __stackBase__ + 1184;
  var $171 = __stackBase__ + 1192;
  var $172 = __stackBase__ + 1200;
  var $173 = __stackBase__ + 1204;
  var $Result13 = __stackBase__ + 1208;
  var $Line14 = __stackBase__ + 1228;
  var $174 = __stackBase__ + 1236;
  var $175 = __stackBase__ + 1244;
  var $176 = __stackBase__ + 1252;
  var $177 = __stackBase__ + 1256;
  var $Result15 = __stackBase__ + 1260;
  var $Line16 = __stackBase__ + 1280;
  var $178 = __stackBase__ + 1288;
  var $179 = __stackBase__ + 1296;
  var $180 = __stackBase__ + 1304;
  var $181 = __stackBase__ + 1308;
  var $182 = __stackBase__ + 1312;
  var $183$s2 = ($this + 80 | 0) >> 2;
  var $185 = HEAP32[$183$s2] + 1 | 0;
  HEAP32[$183$s2] = $185;
  var $186 = ($185 | 0) == 4;
  do {
    if ($186) {
      HEAP32[$183$s2] = 0;
      var $188$s2 = ($this + 76 | 0) >> 2;
      var $190 = HEAP32[$188$s2] + 1 | 0;
      HEAP32[$188$s2] = $190;
      if (($190 | 0) != 10) {
        break;
      }
      HEAP32[$188$s2] = 0;
    }
  } while (0);
  var $194$s2 = ($this + 88 | 0) >> 2;
  var $196 = HEAP32[$194$s2] + 1 | 0;
  HEAP32[$194$s2] = $196;
  var $197 = ($196 | 0) == 4;
  do {
    if ($197) {
      HEAP32[$194$s2] = 0;
      var $199$s2 = ($this + 84 | 0) >> 2;
      var $201 = HEAP32[$199$s2] + 1 | 0;
      HEAP32[$199$s2] = $201;
      if (($201 | 0) != 8) {
        break;
      }
      HEAP32[$199$s2] = 0;
    }
  } while (0);
  var $205$s2 = ($this + 96 | 0) >> 2;
  var $207 = HEAP32[$205$s2] + 1 | 0;
  HEAP32[$205$s2] = $207;
  var $208 = ($207 | 0) == 4;
  do {
    if ($208) {
      HEAP32[$205$s2] = 0;
      var $210$s2 = ($this + 92 | 0) >> 2;
      var $212 = HEAP32[$210$s2] + 1 | 0;
      HEAP32[$210$s2] = $212;
      if (($212 | 0) != 8) {
        break;
      }
      HEAP32[$210$s2] = 0;
    }
  } while (0);
  var $216$s2 = ($this + 104 | 0) >> 2;
  var $218 = HEAP32[$216$s2] + 1 | 0;
  HEAP32[$216$s2] = $218;
  var $219 = ($218 | 0) == 4;
  do {
    if ($219) {
      HEAP32[$216$s2] = 0;
      var $221$s2 = ($this + 100 | 0) >> 2;
      var $223 = HEAP32[$221$s2] + 1 | 0;
      HEAP32[$221$s2] = $223;
      if (($223 | 0) != 8) {
        break;
      }
      HEAP32[$221$s2] = 0;
    }
  } while (0);
  var $227 = $this | 0;
  HEAPF32[$3 >> 2] = 0;
  __ZN4RealC1ERKf($2, $3);
  HEAPF32[$5 >> 2] = .20000000298023224;
  __ZN4RealC1ERKf($4, $5);
  __ZN8Vector2DC1ERK4RealS2_($1, $2, $4);
  var $228 = __ZN8Vector2DpLERKS_($227, $1);
  var $229 = __ZN7cPlayer15NotTransformingEv($this);
  do {
    if ($229) {
      var $231 = __ZN7cPlayer14NotWallJumpingEv($this);
      if (!$231) {
        break;
      }
      var $233 = $this + 8 | 0;
      __ZN5boostmiERK8Vector2DS2_($Velocity, $227, $233);
      if ((HEAP8[$this + 61 | 0] & 1) << 24 >> 24 == 0) {
        HEAPF32[$7 >> 2] = .15000000596046448;
        __ZN4RealC1ERKf($MoveScalar, $7);
      } else {
        HEAPF32[$6 >> 2] = .20000000298023224;
        __ZN4RealC1ERKf($MoveScalar, $6);
      }
      var $241 = $Velocity | 0;
      var $242 = __ZNK4Real7ToFloatEv($241);
      if ($242 * HEAPF32[_gx >> 2] > 0) {
        HEAPF32[$9 >> 2] = 2;
        __ZN4RealC1ERKf($8, $9);
        __ZNK4Real9MagnitudeEv($10, $241);
        __ZNK4RealmiERKS_($MoveRate, $8, $10);
        var $247 = __ZNK4RealcvKfEv($MoveRate);
        var $248 = __ZNK4RealcvKfEv(__ZN4Real4ZeroE);
        if ($247 < $248) {
          HEAPF32[$11 >> 2] = 0;
          __ZN4RealC1ERKf($MoveRate, $11);
        }
        var $252 = __ZN4RealmLERKS_($MoveScalar, $MoveRate);
      }
      __ZN4RealC1ERKf($14, _gx);
      HEAPF32[$16 >> 2] = 0;
      __ZN4RealC1ERKf($15, $16);
      __ZN8Vector2DC1ERK4RealS2_($13, $14, $15);
      __ZN5boostmlERK8Vector2DRK4Real($12, $13, $MoveScalar);
      var $254 = __ZN8Vector2DpLERKS_($227, $12);
    }
  } while (0);
  var $256 = $this + 8 | 0;
  __ZN5boostmiERK8Vector2DS2_($Velocity1, $227, $256);
  var $257$s2 = ($this + 56 | 0) >> 2;
  var $259 = (HEAP32[$257$s2] | 0) > 0;
  do {
    if ($259) {
      var $261 = __Z9Input_Keyi(1);
      if (($261 | 0) == 0) {
        break;
      }
      var $264 = __ZN7cPlayer15NotTransformingEv($this);
      if (!$264) {
        break;
      }
      var $266 = __Z16Input_KeyPressedi(1);
      var $267 = ($266 | 0) == 0;
      do {
        if (!$267) {
          if ((HEAP8[$this + 61 | 0] & 1) << 24 >> 24 == 0) {
            var $303 = _sndPlay(STRING_TABLE.__str12 | 0);
          } else {
            var $274 = _sndPlay(STRING_TABLE.__str11 | 0);
            if ((HEAP8[$this + 48 | 0] & 1) << 24 >> 24 != 0) {
              break;
            }
            if ((HEAP8[$this + 52 | 0] & 1) << 24 >> 24 == 0) {
              break;
            }
            var $285 = $this + 60 | 0;
            if ((HEAP8[$285] & 1) << 24 >> 24 == 0) {
              HEAPF32[$23 >> 2] = 5;
              __ZN4RealC1ERKf($22, $23);
              __ZNK4RealngEv($21, $22);
              var $297 = HEAP32[$21 >> 2];
              HEAP32[$Velocity1$s2] = $297;
            } else {
              HEAPF32[$19 >> 2] = 5;
              __ZN4RealC1ERKf($18, $19);
              var $290 = __ZNK4RealcvKfEv($18);
              HEAPF32[$20 >> 2] = $290;
              __ZN4RealC1ERKf($17, $20);
              var $293 = HEAP32[$17 >> 2];
              HEAP32[$Velocity1$s2] = $293;
            }
            var $301 = HEAP8[$285] & 1 ^ 1;
            HEAP8[$285] = $301;
            __ZN7cPlayer24SetIntermediateAnimationEPKi($this, __ZL13Nook_WallJump | 0);
          }
        }
      } while (0);
      HEAPF32[$26 >> 2] = HEAP32[$257$s2] | 0;
      __ZN4RealC1ERKf($25, $26);
      HEAPF32[$28 >> 2] = 1;
      __ZN4RealC1ERKf($27, $28);
      __ZNK4RealplERKS_($29, $25, $27);
      HEAPF32[$31 >> 2] = .5;
      __ZN4RealC1ERKf($30, $31);
      __ZNK4RealmlERKS_($32, $29, $30);
      __ZNK4RealngEv($24, $32);
      var $308 = HEAPF32[$24 >> 2];
      HEAPF32[$Velocity1$s2 + 1] = $308;
      var $310 = HEAP32[$257$s2] - 1 | 0;
      HEAP32[$257$s2] = $310;
    }
  } while (0);
  var $312 = __Z9Input_Keyi(1);
  if (($312 | 0) == 0) {
    HEAP32[$257$s2] = 0;
  }
  __ZN5boostmiERK8Vector2DS2_($34, $227, $256);
  __ZN5boostmiERK8Vector2DS2_($33, $34, $Velocity1);
  var $316 = __ZN8Vector2DmIERKS_($227, $33);
  var $317 = $this + 61 | 0;
  var $320 = (HEAP8[$317] & 1) << 24 >> 24 == 0;
  var $321 = $this | 0;
  var $322 = $256 | 0;
  do {
    if ($320) {
      __ZNK4RealmiERKS_($51, $321, $322);
      __ZNK4Real9MagnitudeEv($52, $51);
      var $340 = __ZNK4RealcvKfEv($52);
      if ($340 > 4) {
        __ZNK4RealmiERKS_($55, $321, $322);
        __ZNK4Real6NormalEv($56, $55);
        HEAPF32[$58 >> 2] = 4;
        __ZN4RealC1ERKf($57, $58);
        __ZNK4RealmlERKS_($54, $56, $57);
        __ZNK4RealplERKS_($53, $322, $54);
        var $345 = HEAP32[$53 >> 2];
        HEAP32[$this >> 2] = $345;
      }
      var $347 = $this + 4 | 0;
      var $348 = $this + 12 | 0;
      __ZNK4RealmiERKS_($59, $347, $348);
      __ZNK4Real9MagnitudeEv($60, $59);
      var $349 = __ZNK4RealcvKfEv($60);
      if ($349 <= 4) {
        break;
      }
      __ZNK4RealmiERKS_($63, $347, $348);
      __ZNK4Real6NormalEv($64, $63);
      HEAPF32[$66 >> 2] = 4;
      __ZN4RealC1ERKf($65, $66);
      __ZNK4RealmlERKS_($62, $64, $65);
      __ZNK4RealplERKS_($61, $348, $62);
      var $354 = HEAPF32[$61 >> 2];
      HEAPF32[$347 >> 2] = $354;
    } else {
      __ZNK4RealmiERKS_($35, $321, $322);
      __ZNK4Real9MagnitudeEv($36, $35);
      var $324 = __ZNK4RealcvKfEv($36);
      if ($324 > 4) {
        __ZNK4RealmiERKS_($39, $321, $322);
        __ZNK4Real6NormalEv($40, $39);
        HEAPF32[$42 >> 2] = 4;
        __ZN4RealC1ERKf($41, $42);
        __ZNK4RealmlERKS_($38, $40, $41);
        __ZNK4RealplERKS_($37, $322, $38);
        var $329 = HEAP32[$37 >> 2];
        HEAP32[$this >> 2] = $329;
      }
      var $331 = $this + 4 | 0;
      var $332 = $this + 12 | 0;
      __ZNK4RealmiERKS_($43, $331, $332);
      __ZNK4Real9MagnitudeEv($44, $43);
      var $333 = __ZNK4RealcvKfEv($44);
      if ($333 <= 4) {
        break;
      }
      __ZNK4RealmiERKS_($47, $331, $332);
      __ZNK4Real6NormalEv($48, $47);
      HEAPF32[$50 >> 2] = 4;
      __ZN4RealC1ERKf($49, $50);
      __ZNK4RealmlERKS_($46, $48, $49);
      __ZNK4RealplERKS_($45, $332, $46);
      var $338 = HEAPF32[$45 >> 2];
      HEAPF32[$331 >> 2] = $338;
    }
  } while (0);
  __ZN5boostmiERK8Vector2DS2_($67, $227, $256);
  var $356 = $67;
  var $357 = $Velocity1;
  var $358$0 = HEAP32[$356 >> 2];
  var $358$1 = HEAP32[$356 + 4 >> 2];
  HEAP32[$357 >> 2] = $358$0;
  HEAP32[$357 + 4 >> 2] = $358$1;
  var $359 = $this;
  var $360 = $256;
  var $361$0 = HEAP32[$359 >> 2];
  var $361$1 = HEAP32[$359 + 4 >> 2];
  HEAP32[$360 >> 2] = $361$0;
  HEAP32[$360 + 4 >> 2] = $361$1;
  HEAPF32[$68 >> 2] = .949999988079071;
  __ZN4RealC1ERKf($Scalar, $68);
  var $362 = $this + 48 | 0;
  var $365 = (HEAP8[$362] & 1) << 24 >> 24 == 0;
  $_$64 : do {
    if (!$365) {
      var $367 = HEAPF32[_gx >> 2];
      var $368 = $367 > 0;
      do {
        if ($368) {
          var $370 = $Velocity1 | 0;
          var $371 = __ZNK4RealcvKfEv($370);
          if ($371 >= 0) {
            break;
          }
          HEAPF32[$69 >> 2] = .699999988079071;
          __ZN4RealC1ERKf($Scalar, $69);
          break $_$64;
        }
      } while (0);
      var $374 = $367 < 0;
      do {
        if ($374) {
          var $376 = $Velocity1 | 0;
          var $377 = __ZNK4RealcvKfEv($376);
          if ($377 <= 0) {
            break;
          }
          HEAPF32[$70 >> 2] = .699999988079071;
          __ZN4RealC1ERKf($Scalar, $70);
          break $_$64;
        }
      } while (0);
      if ($367 != 0) {
        break;
      }
      HEAPF32[$71 >> 2] = .4000000059604645;
      __ZN4RealC1ERKf($Scalar, $71);
    }
  } while (0);
  var $383 = $this + 52 | 0;
  var $or_cond = (HEAP8[$383] & 1) << 24 >> 24 != 0 & HEAPF32[_gx >> 2] != 0;
  do {
    if ($or_cond) {
      var $390 = $Velocity1 + 4 | 0;
      var $391 = __ZNK4RealcvKfEv($390);
      if ($391 <= 0) {
        break;
      }
      HEAPF32[$72 >> 2] = .30000001192092896;
      __ZN4RealC1ERKf($Scalar, $72);
    }
  } while (0);
  __ZN5boostmlERK8Vector2DRK4Real($73, $Velocity1, $Scalar);
  var $395 = __ZN8Vector2DpLERKS_($227, $73);
  __ZN7cPlayer7GetRectEv($Rect, $this);
  var $399 = HEAP32[HEAP32[_MapLayer >> 2] + 4 >> 2] - 2 | 0;
  __ZNK11ShapeRect2D2P1Ev($74, $Rect);
  var $400 = $74 | 0;
  var $401 = __ZNK4Real7ToFloatEv($400);
  var $floorf = _floorf($401);
  var $403 = ($floorf & -1) >> 3;
  __ZNK11ShapeRect2D2P1Ev($75, $Rect);
  var $404 = $75 + 4 | 0;
  var $405 = __ZNK4Real7ToFloatEv($404);
  var $floorf2 = _floorf($405);
  var $407 = ($floorf2 & -1) >> 3;
  __ZNK11ShapeRect2D2P2Ev($76, $Rect);
  var $408 = $76 | 0;
  var $409 = __ZNK4Real7ToFloatEv($408);
  var $ceilf = _ceilf($409);
  var $412 = ($ceilf & -1) + 8 >> 3 | 0;
  __ZNK11ShapeRect2D2P2Ev($77, $Rect);
  var $413 = $77 + 4 | 0;
  var $414 = __ZNK4Real7ToFloatEv($413);
  var $ceilf3 = _ceilf($414);
  var $417 = ($ceilf3 & -1) + 8 >> 3 | 0;
  var $420 = HEAP32[HEAP32[_MapLayer >> 2] + ($399 << 2) + 8 >> 2];
  var $421 = __ZNK7cGrid2DIsE5WidthEv($420);
  var $422 = __ZNK7cGrid2DIsE6HeightEv($420);
  var $StartX_0 = ($403 | 0) < 0 ? 0 : $403;
  var $StartY_0 = ($407 | 0) < 0 ? 0 : $407;
  var $EndX_0 = ($412 | 0) < 0 ? 0 : $412;
  var $EndY_0 = ($417 | 0) < 0 ? 0 : $417;
  var $427 = $421 - 1 | 0;
  var $StartX_0_ = ($StartX_0 | 0) < ($421 | 0) ? $StartX_0 : $427;
  var $430 = $422 - 1 | 0;
  var $StartY_1 = ($StartY_0 | 0) < ($422 | 0) ? $StartY_0 : $430;
  var $EndX_0_ = ($EndX_0 | 0) < ($421 | 0) ? $EndX_0 : $427;
  var $EndY_1 = ($EndY_0 | 0) < ($422 | 0) ? $EndY_0 : $430;
  var $434 = HEAP8[$362] & 1;
  var $435 = $this + 49 | 0;
  HEAP8[$435] = $434;
  var $436 = $this + 50 | 0;
  var $438 = HEAP8[$436] & 1;
  var $439 = $this + 51 | 0;
  HEAP8[$439] = $438;
  var $441 = HEAP8[$383] & 1;
  HEAP8[$this + 53 | 0] = $441;
  HEAP8[$362] = 0;
  HEAP8[$436] = 0;
  HEAP8[$383] = 0;
  __ZN11ShapeRect2DC1Ev($VsBottomRect);
  __ZN11ShapeRect2DC1Ev($VsTopRect);
  __ZN11ShapeRect2DC1Ev($VsLeftRect);
  __ZN11ShapeRect2DC1Ev($VsRightRect);
  __ZN11ShapeRect2DC1Ev($VsTopLeftRect);
  __ZN11ShapeRect2DC1Ev($VsTopRightRect);
  __ZN11ShapeRect2DC1Ev($VsBottomLeftRect);
  __ZN11ShapeRect2DC1Ev($VsBottomRightRect);
  var $443 = $EndY_1 - 1 | 0;
  var $444 = ($StartX_0_ | 0) < ($EndX_0_ | 0);
  $_$80 : do {
    if ($444) {
      var $446 = $443 << 3 | 0;
      var $447$s2 = ($VsBottomRect | 0) >> 2;
      var $448$s2 = ($89 | 0) >> 2;
      var $_x_020 = $StartX_0_;
      var $Started_021 = 0;
      var $CollisionBits_022 = 0;
      while (1) {
        var $CollisionBits_022;
        var $Started_021;
        var $_x_020;
        var $457 = HEAP32[HEAP32[_MapLayer >> 2] + ($399 << 2) + 8 >> 2];
        var $458 = __ZN7cGrid2DIsEclEjj($457, $_x_020, $443);
        if (HEAP16[$458 >> 1] << 16 >> 16 == 1857) {
          var $465 = $_x_020 << 3 | 0;
          if (($Started_021 & 1) << 24 >> 24 == 0) {
            HEAPF32[$92 >> 2] = $465;
            __ZN4RealC1ERKf($91, $92);
            HEAPF32[$94 >> 2] = $446;
            __ZN4RealC1ERKf($93, $94);
            __ZN8Vector2DC1ERK4RealS2_($90, $91, $93);
            HEAPF32[$97 >> 2] = 8;
            __ZN4RealC1ERKf($96, $97);
            HEAPF32[$99 >> 2] = 32;
            __ZN4RealC1ERKf($98, $99);
            __ZN8Vector2DC1ERK4RealS2_($95, $96, $98);
            __ZN11ShapeRect2DC1ERK8Vector2DS2_($89, $90, $95);
            HEAP32[$447$s2] = HEAP32[$448$s2];
            HEAP32[$447$s2 + 1] = HEAP32[$448$s2 + 1];
            HEAP32[$447$s2 + 2] = HEAP32[$448$s2 + 2];
            HEAP32[$447$s2 + 3] = HEAP32[$448$s2 + 3];
            HEAP32[$447$s2 + 4] = HEAP32[$448$s2 + 4];
            var $CollisionBits_1 = $CollisionBits_022 | 2;
            var $Started_1 = 1;
          } else {
            HEAPF32[$81 >> 2] = $465;
            __ZN4RealC1ERKf($80, $81);
            HEAPF32[$83 >> 2] = $446;
            __ZN4RealC1ERKf($82, $83);
            __ZN8Vector2DC1ERK4RealS2_($79, $80, $82);
            HEAPF32[$86 >> 2] = 8;
            __ZN4RealC1ERKf($85, $86);
            HEAPF32[$88 >> 2] = 32;
            __ZN4RealC1ERKf($87, $88);
            __ZN8Vector2DC1ERK4RealS2_($84, $85, $87);
            __ZN11ShapeRect2DC1ERK8Vector2DS2_($78, $79, $84);
            var $467 = __ZN11ShapeRect2DpLERKS_($VsBottomRect, $78);
            var $CollisionBits_1 = $CollisionBits_022;
            var $Started_1 = $Started_021;
          }
        } else {
          var $CollisionBits_1 = $CollisionBits_022;
          var $Started_1 = $Started_021;
        }
        var $Started_1;
        var $CollisionBits_1;
        var $471 = $_x_020 + 1 | 0;
        if (($471 | 0) == ($EndX_0_ | 0)) {
          var $CollisionBits_0_lcssa = $CollisionBits_1;
          break $_$80;
        }
        var $_x_020 = $471;
        var $Started_021 = $Started_1;
        var $CollisionBits_022 = $CollisionBits_1;
      }
    } else {
      var $CollisionBits_0_lcssa = 0;
    }
  } while (0);
  var $CollisionBits_0_lcssa;
  var $449 = ($StartY_1 | 0) < ($EndY_1 | 0);
  $_$91 : do {
    if ($449) {
      var $452 = ($StartX_0_ << 3) - 24 | 0;
      var $453$s2 = ($VsLeftRect | 0) >> 2;
      var $454$s2 = ($111 | 0) >> 2;
      var $_y4_014 = $StartY_1;
      var $Started2_015 = 0;
      var $CollisionBits_216 = $CollisionBits_0_lcssa;
      while (1) {
        var $CollisionBits_216;
        var $Started2_015;
        var $_y4_014;
        var $474 = HEAP32[HEAP32[_MapLayer >> 2] + ($399 << 2) + 8 >> 2];
        var $475 = __ZN7cGrid2DIsEclEjj($474, $StartX_0_, $_y4_014);
        if (HEAP16[$475 >> 1] << 16 >> 16 == 1857) {
          if (($Started2_015 & 1) << 24 >> 24 == 0) {
            HEAPF32[$114 >> 2] = $452;
            __ZN4RealC1ERKf($113, $114);
            HEAPF32[$116 >> 2] = $_y4_014 << 3 | 0;
            __ZN4RealC1ERKf($115, $116);
            __ZN8Vector2DC1ERK4RealS2_($112, $113, $115);
            HEAPF32[$119 >> 2] = 32;
            __ZN4RealC1ERKf($118, $119);
            HEAPF32[$121 >> 2] = 8;
            __ZN4RealC1ERKf($120, $121);
            __ZN8Vector2DC1ERK4RealS2_($117, $118, $120);
            __ZN11ShapeRect2DC1ERK8Vector2DS2_($111, $112, $117);
            HEAP32[$453$s2] = HEAP32[$454$s2];
            HEAP32[$453$s2 + 1] = HEAP32[$454$s2 + 1];
            HEAP32[$453$s2 + 2] = HEAP32[$454$s2 + 2];
            HEAP32[$453$s2 + 3] = HEAP32[$454$s2 + 3];
            HEAP32[$453$s2 + 4] = HEAP32[$454$s2 + 4];
            var $CollisionBits_3 = $CollisionBits_216 | 4;
            var $Started2_1 = 1;
          } else {
            HEAPF32[$103 >> 2] = $452;
            __ZN4RealC1ERKf($102, $103);
            HEAPF32[$105 >> 2] = $_y4_014 << 3 | 0;
            __ZN4RealC1ERKf($104, $105);
            __ZN8Vector2DC1ERK4RealS2_($101, $102, $104);
            HEAPF32[$108 >> 2] = 32;
            __ZN4RealC1ERKf($107, $108);
            HEAPF32[$110 >> 2] = 8;
            __ZN4RealC1ERKf($109, $110);
            __ZN8Vector2DC1ERK4RealS2_($106, $107, $109);
            __ZN11ShapeRect2DC1ERK8Vector2DS2_($100, $101, $106);
            var $484 = __ZN11ShapeRect2DpLERKS_($VsLeftRect, $100);
            var $CollisionBits_3 = $CollisionBits_216;
            var $Started2_1 = $Started2_015;
          }
        } else {
          var $CollisionBits_3 = $CollisionBits_216;
          var $Started2_1 = $Started2_015;
        }
        var $Started2_1;
        var $CollisionBits_3;
        var $490 = $_y4_014 + 1 | 0;
        if (($490 | 0) == ($EndY_1 | 0)) {
          break;
        }
        var $_y4_014 = $490;
        var $Started2_015 = $Started2_1;
        var $CollisionBits_216 = $CollisionBits_3;
      }
      var $491 = $EndX_0_ - 1 | 0;
      var $493 = $491 << 3 | 0;
      var $494$s2 = ($VsRightRect | 0) >> 2;
      var $495$s2 = ($133 | 0) >> 2;
      var $Started5_07 = 0;
      var $CollisionBits_48 = $CollisionBits_3;
      var $_y7_09 = $StartY_1;
      while (1) {
        var $_y7_09;
        var $CollisionBits_48;
        var $Started5_07;
        var $503 = HEAP32[HEAP32[_MapLayer >> 2] + ($399 << 2) + 8 >> 2];
        var $504 = __ZN7cGrid2DIsEclEjj($503, $491, $_y7_09);
        if (HEAP16[$504 >> 1] << 16 >> 16 == 1857) {
          if (($Started5_07 & 1) << 24 >> 24 == 0) {
            HEAPF32[$136 >> 2] = $493;
            __ZN4RealC1ERKf($135, $136);
            HEAPF32[$138 >> 2] = $_y7_09 << 3 | 0;
            __ZN4RealC1ERKf($137, $138);
            __ZN8Vector2DC1ERK4RealS2_($134, $135, $137);
            HEAPF32[$141 >> 2] = 32;
            __ZN4RealC1ERKf($140, $141);
            HEAPF32[$143 >> 2] = 8;
            __ZN4RealC1ERKf($142, $143);
            __ZN8Vector2DC1ERK4RealS2_($139, $140, $142);
            __ZN11ShapeRect2DC1ERK8Vector2DS2_($133, $134, $139);
            HEAP32[$494$s2] = HEAP32[$495$s2];
            HEAP32[$494$s2 + 1] = HEAP32[$495$s2 + 1];
            HEAP32[$494$s2 + 2] = HEAP32[$495$s2 + 2];
            HEAP32[$494$s2 + 3] = HEAP32[$495$s2 + 3];
            HEAP32[$494$s2 + 4] = HEAP32[$495$s2 + 4];
            var $CollisionBits_5 = $CollisionBits_48 | 8;
            var $Started5_1 = 1;
          } else {
            HEAPF32[$125 >> 2] = $493;
            __ZN4RealC1ERKf($124, $125);
            HEAPF32[$127 >> 2] = $_y7_09 << 3 | 0;
            __ZN4RealC1ERKf($126, $127);
            __ZN8Vector2DC1ERK4RealS2_($123, $124, $126);
            HEAPF32[$130 >> 2] = 32;
            __ZN4RealC1ERKf($129, $130);
            HEAPF32[$132 >> 2] = 8;
            __ZN4RealC1ERKf($131, $132);
            __ZN8Vector2DC1ERK4RealS2_($128, $129, $131);
            __ZN11ShapeRect2DC1ERK8Vector2DS2_($122, $123, $128);
            var $513 = __ZN11ShapeRect2DpLERKS_($VsRightRect, $122);
            var $CollisionBits_5 = $CollisionBits_48;
            var $Started5_1 = $Started5_07;
          }
        } else {
          var $CollisionBits_5 = $CollisionBits_48;
          var $Started5_1 = $Started5_07;
        }
        var $Started5_1;
        var $CollisionBits_5;
        var $519 = $_y7_09 + 1 | 0;
        if (($519 | 0) == ($EndY_1 | 0)) {
          var $CollisionBits_4_lcssa = $CollisionBits_5;
          break $_$91;
        }
        var $Started5_07 = $Started5_1;
        var $CollisionBits_48 = $CollisionBits_5;
        var $_y7_09 = $519;
      }
    } else {
      var $CollisionBits_4_lcssa = $CollisionBits_0_lcssa;
    }
  } while (0);
  var $CollisionBits_4_lcssa;
  $_$111 : do {
    if ($444) {
      var $498 = ($StartY_1 << 3) - 24 | 0;
      var $499$s2 = ($VsTopRect | 0) >> 2;
      var $500$s2 = ($155 | 0) >> 2;
      var $CollisionBits_64 = $CollisionBits_4_lcssa;
      var $Started8_05 = 0;
      var $_x10_06 = $StartX_0_;
      while (1) {
        var $_x10_06;
        var $Started8_05;
        var $CollisionBits_64;
        var $522 = HEAP32[HEAP32[_MapLayer >> 2] + ($399 << 2) + 8 >> 2];
        var $523 = __ZN7cGrid2DIsEclEjj($522, $_x10_06, $StartY_1);
        if (HEAP16[$523 >> 1] << 16 >> 16 == 1857) {
          var $530 = $_x10_06 << 3 | 0;
          if (($Started8_05 & 1) << 24 >> 24 == 0) {
            HEAPF32[$158 >> 2] = $530;
            __ZN4RealC1ERKf($157, $158);
            HEAPF32[$160 >> 2] = $498;
            __ZN4RealC1ERKf($159, $160);
            __ZN8Vector2DC1ERK4RealS2_($156, $157, $159);
            HEAPF32[$163 >> 2] = 8;
            __ZN4RealC1ERKf($162, $163);
            HEAPF32[$165 >> 2] = 32;
            __ZN4RealC1ERKf($164, $165);
            __ZN8Vector2DC1ERK4RealS2_($161, $162, $164);
            __ZN11ShapeRect2DC1ERK8Vector2DS2_($155, $156, $161);
            HEAP32[$499$s2] = HEAP32[$500$s2];
            HEAP32[$499$s2 + 1] = HEAP32[$500$s2 + 1];
            HEAP32[$499$s2 + 2] = HEAP32[$500$s2 + 2];
            HEAP32[$499$s2 + 3] = HEAP32[$500$s2 + 3];
            HEAP32[$499$s2 + 4] = HEAP32[$500$s2 + 4];
            var $Started8_1 = 1;
            var $CollisionBits_7 = $CollisionBits_64 | 1;
          } else {
            HEAPF32[$147 >> 2] = $530;
            __ZN4RealC1ERKf($146, $147);
            HEAPF32[$149 >> 2] = $498;
            __ZN4RealC1ERKf($148, $149);
            __ZN8Vector2DC1ERK4RealS2_($145, $146, $148);
            HEAPF32[$152 >> 2] = 8;
            __ZN4RealC1ERKf($151, $152);
            HEAPF32[$154 >> 2] = 32;
            __ZN4RealC1ERKf($153, $154);
            __ZN8Vector2DC1ERK4RealS2_($150, $151, $153);
            __ZN11ShapeRect2DC1ERK8Vector2DS2_($144, $145, $150);
            var $532 = __ZN11ShapeRect2DpLERKS_($VsTopRect, $144);
            var $Started8_1 = $Started8_05;
            var $CollisionBits_7 = $CollisionBits_64;
          }
        } else {
          var $Started8_1 = $Started8_05;
          var $CollisionBits_7 = $CollisionBits_64;
        }
        var $CollisionBits_7;
        var $Started8_1;
        var $536 = $_x10_06 + 1 | 0;
        if (($536 | 0) == ($EndX_0_ | 0)) {
          var $CollisionBits_6_lcssa = $CollisionBits_7;
          break $_$111;
        }
        var $CollisionBits_64 = $CollisionBits_7;
        var $Started8_05 = $Started8_1;
        var $_x10_06 = $536;
      }
    } else {
      var $CollisionBits_6_lcssa = $CollisionBits_4_lcssa;
    }
  } while (0);
  var $CollisionBits_6_lcssa;
  var $538 = ($CollisionBits_6_lcssa & 2 | 0) != 0;
  do {
    if ($538) {
      var $540 = __ZNK11ShapeRect2D5WidthEv($VsBottomRect);
      var $541 = __ZNK4RealcvKfEv($540);
      if ($541 <= 8) {
        var $ActualCollisionBits_0 = 0;
        break;
      }
      var $544 = __ZNK11ShapeRect2DeqERKS_($Rect, $VsBottomRect);
      if (!$544) {
        var $ActualCollisionBits_0 = 0;
        break;
      }
      var $ActualCollisionBits_0 = 2;
    } else {
      var $ActualCollisionBits_0 = 0;
    }
  } while (0);
  var $ActualCollisionBits_0;
  var $548 = ($CollisionBits_6_lcssa & 1 | 0) != 0;
  do {
    if ($548) {
      var $550 = __ZNK11ShapeRect2D5WidthEv($VsTopRect);
      var $551 = __ZNK4RealcvKfEv($550);
      if ($551 <= 8) {
        var $ActualCollisionBits_1 = $ActualCollisionBits_0;
        break;
      }
      var $554 = __ZNK11ShapeRect2DeqERKS_($Rect, $VsTopRect);
      var $ActualCollisionBits_1 = $554 & 1 | $ActualCollisionBits_0;
    } else {
      var $ActualCollisionBits_1 = $ActualCollisionBits_0;
    }
  } while (0);
  var $ActualCollisionBits_1;
  var $558 = ($CollisionBits_6_lcssa & 4 | 0) != 0;
  do {
    if ($558) {
      var $560 = __ZNK11ShapeRect2D6HeightEv($VsLeftRect);
      var $561 = __ZNK4RealcvKfEv($560);
      if ($561 <= 8) {
        var $ActualCollisionBits_2 = $ActualCollisionBits_1;
        break;
      }
      var $564 = $ActualCollisionBits_1 | 4;
      var $565 = __ZNK11ShapeRect2DeqERKS_($Rect, $VsLeftRect);
      var $_ActualCollisionBits_1 = $565 ? $564 : $ActualCollisionBits_1;
      var $ActualCollisionBits_2 = $_ActualCollisionBits_1;
    } else {
      var $ActualCollisionBits_2 = $ActualCollisionBits_1;
    }
  } while (0);
  var $ActualCollisionBits_2;
  var $568 = ($CollisionBits_6_lcssa & 8 | 0) != 0;
  do {
    if ($568) {
      var $570 = __ZNK11ShapeRect2D6HeightEv($VsRightRect);
      var $571 = __ZNK4RealcvKfEv($570);
      if ($571 <= 8) {
        var $ActualCollisionBits_3 = $ActualCollisionBits_2;
        break;
      }
      var $574 = $ActualCollisionBits_2 | 8;
      var $575 = __ZNK11ShapeRect2DeqERKS_($Rect, $VsRightRect);
      var $_ActualCollisionBits_2 = $575 ? $574 : $ActualCollisionBits_2;
      var $ActualCollisionBits_3 = $_ActualCollisionBits_2;
    } else {
      var $ActualCollisionBits_3 = $ActualCollisionBits_2;
    }
  } while (0);
  var $ActualCollisionBits_3;
  var $577 = ($ActualCollisionBits_3 | 0) == 0;
  do {
    if ($577) {
      if ($538) {
        var $580 = __ZNK11ShapeRect2DeqERKS_($Rect, $VsBottomRect);
        var $_ActualCollisionBits_3 = $580 ? 2 : 0;
        var $ActualCollisionBits_4 = $_ActualCollisionBits_3;
      } else {
        var $ActualCollisionBits_4 = 0;
      }
      var $ActualCollisionBits_4;
      if ($548) {
        var $583 = __ZNK11ShapeRect2DeqERKS_($Rect, $VsTopRect);
        var $ActualCollisionBits_5 = $583 & 1 | $ActualCollisionBits_4;
      } else {
        var $ActualCollisionBits_5 = $ActualCollisionBits_4;
      }
      var $ActualCollisionBits_5;
      if ($558) {
        var $587 = $ActualCollisionBits_5 | 4;
        var $588 = __ZNK11ShapeRect2DeqERKS_($Rect, $VsLeftRect);
        var $_ActualCollisionBits_5 = $588 ? $587 : $ActualCollisionBits_5;
        var $ActualCollisionBits_6 = $_ActualCollisionBits_5;
      } else {
        var $ActualCollisionBits_6 = $ActualCollisionBits_5;
      }
      var $ActualCollisionBits_6;
      if (!$568) {
        var $ActualCollisionBits_7 = $ActualCollisionBits_6;
        break;
      }
      var $591 = $ActualCollisionBits_6 | 8;
      var $592 = __ZNK11ShapeRect2DeqERKS_($Rect, $VsRightRect);
      var $_ActualCollisionBits_6 = $592 ? $591 : $ActualCollisionBits_6;
      var $ActualCollisionBits_7 = $_ActualCollisionBits_6;
    } else {
      var $ActualCollisionBits_7 = $ActualCollisionBits_3;
    }
  } while (0);
  var $ActualCollisionBits_7;
  var $595 = ($ActualCollisionBits_7 & 2 | 0) == 0;
  do {
    if (!$595) {
      __ZN5boostmiERK11ShapeRect2DS2_($Result, $VsBottomRect, $Rect);
      __ZNK11ShapeRect2D6CenterEv($166, $VsBottomRect);
      __ZNK11ShapeRect2D6CenterEv($167, $Rect);
      __ZN5boostmiERK8Vector2DS2_($Line, $166, $167);
      var $597 = __ZNK11ShapeRect2D5WidthEv($Result);
      var $598 = __ZNK4RealcvKfEv($597);
      var $599 = __ZNK11ShapeRect2D6HeightEv($Result);
      var $600 = __ZNK4RealcvKfEv($599);
      if ($598 <= $600) {
        break;
      }
      var $603 = $this + 4 | 0;
      var $604 = $Line + 4 | 0;
      __ZNK4Real6NormalEv($169, $604);
      __ZNK4RealmlERKS_($168, $169, $599);
      var $605 = __ZN4RealmIERKS_($603, $168);
      var $606 = __ZNK4RealcvKfEv($604);
      var $607 = __ZNK4RealcvKfEv(__ZN4Real4ZeroE);
      if ($606 <= $607) {
        break;
      }
      var $610 = __Z9Input_Keyi(1);
      if (($610 | 0) == 0) {
        if ((HEAP8[$317] & 1) << 24 >> 24 == 0) {
          HEAP32[$257$s2] = 9;
        } else {
          HEAP32[$257$s2] = 21;
        }
      }
      var $621 = (HEAP8[$435] & 1) << 24 >> 24 == 0;
      do {
        if ($621) {
          var $623 = _sndPlay(STRING_TABLE.__str13 | 0);
          if ((HEAP8[$317] & 1) << 24 >> 24 == 0) {
            break;
          }
          var $628 = __ZN7cPlayer15NotTransformingEv($this);
          if (!$628) {
            break;
          }
          __ZN7cPlayer24SetIntermediateAnimationEPKi($this, __ZL16Nook_TouchGround | 0);
        }
      } while (0);
      HEAP8[$362] = 1;
    }
  } while (0);
  var $633 = ($ActualCollisionBits_7 & 1 | 0) == 0;
  do {
    if (!$633) {
      __ZN5boostmiERK11ShapeRect2DS2_($Result11, $VsTopRect, $Rect);
      __ZNK11ShapeRect2D6CenterEv($170, $VsTopRect);
      __ZNK11ShapeRect2D6CenterEv($171, $Rect);
      __ZN5boostmiERK8Vector2DS2_($Line12, $170, $171);
      var $635 = __ZNK11ShapeRect2D5WidthEv($Result11);
      var $636 = __ZNK4RealcvKfEv($635);
      var $637 = __ZNK11ShapeRect2D6HeightEv($Result11);
      var $638 = __ZNK4RealcvKfEv($637);
      if ($636 <= $638) {
        break;
      }
      var $641 = $this + 4 | 0;
      var $642 = $Line12 + 4 | 0;
      __ZNK4Real6NormalEv($173, $642);
      __ZNK4RealmlERKS_($172, $173, $637);
      var $643 = __ZN4RealmIERKS_($641, $172);
      var $644 = __ZNK4RealcvKfEv($642);
      var $645 = __ZNK4RealcvKfEv(__ZN4Real4ZeroE);
      if ($644 >= $645) {
        break;
      }
      HEAP32[$257$s2] = 0;
      if ((HEAP8[$439] & 1) << 24 >> 24 == 0) {
        var $652 = _sndPlay(STRING_TABLE.__str14 | 0);
      }
      HEAP8[$436] = 1;
    }
  } while (0);
  var $656 = ($ActualCollisionBits_7 & 4 | 0) == 0;
  do {
    if (!$656) {
      __ZN5boostmiERK11ShapeRect2DS2_($Result13, $VsLeftRect, $Rect);
      __ZNK11ShapeRect2D6CenterEv($174, $VsLeftRect);
      __ZNK11ShapeRect2D6CenterEv($175, $Rect);
      __ZN5boostmiERK8Vector2DS2_($Line14, $174, $175);
      var $658 = __ZNK11ShapeRect2D5WidthEv($Result13);
      var $659 = __ZNK4RealcvKfEv($658);
      var $660 = __ZNK11ShapeRect2D6HeightEv($Result13);
      var $661 = __ZNK4RealcvKfEv($660);
      if ($659 > $661) {
        break;
      }
      var $664 = $Line14 | 0;
      __ZNK4Real6NormalEv($177, $664);
      __ZNK4RealmlERKS_($176, $177, $658);
      var $665 = __ZN4RealmIERKS_($321, $176);
      var $666 = __ZNK11ShapeRect2D6HeightEv($VsLeftRect);
      var $667 = __ZNK4RealcvKfEv($666);
      if ($667 <= 24) {
        break;
      }
      var $670 = __Z9Input_Keyi(1);
      var $671 = ($670 | 0) == 0;
      do {
        if ($671) {
          if ((HEAP8[$317] & 1) << 24 >> 24 == 0) {
            break;
          }
          HEAP32[$257$s2] = 16;
        }
      } while (0);
      HEAP8[$383] = 1;
      if (HEAPF32[_gx >> 2] >= 0) {
        break;
      }
      HEAP8[$this + 60 | 0] = 1;
    }
  } while (0);
  var $684 = ($ActualCollisionBits_7 & 8 | 0) == 0;
  do {
    if (!$684) {
      __ZN5boostmiERK11ShapeRect2DS2_($Result15, $VsRightRect, $Rect);
      __ZNK11ShapeRect2D6CenterEv($178, $VsRightRect);
      __ZNK11ShapeRect2D6CenterEv($179, $Rect);
      __ZN5boostmiERK8Vector2DS2_($Line16, $178, $179);
      var $686 = __ZNK11ShapeRect2D5WidthEv($Result15);
      var $687 = __ZNK4RealcvKfEv($686);
      var $688 = __ZNK11ShapeRect2D6HeightEv($Result15);
      var $689 = __ZNK4RealcvKfEv($688);
      if ($687 > $689) {
        break;
      }
      var $692 = $Line16 | 0;
      __ZNK4Real6NormalEv($181, $692);
      __ZNK4RealmlERKS_($180, $181, $686);
      var $693 = __ZN4RealmIERKS_($321, $180);
      var $694 = __ZNK11ShapeRect2D6HeightEv($VsRightRect);
      var $695 = __ZNK4RealcvKfEv($694);
      if ($695 <= 24) {
        break;
      }
      var $698 = __Z9Input_Keyi(1);
      var $699 = ($698 | 0) == 0;
      do {
        if ($699) {
          if ((HEAP8[$317] & 1) << 24 >> 24 == 0) {
            break;
          }
          HEAP32[$257$s2] = 16;
        }
      } while (0);
      HEAP8[$383] = 1;
      if (HEAPF32[_gx >> 2] <= 0) {
        break;
      }
      HEAP8[$this + 60 | 0] = 0;
    }
  } while (0);
  __ZN7cPlayer12CollectItemsEv($this);
  var $713 = (HEAP8[$362] & 1) << 24 >> 24 == 0;
  do {
    if ($713) {
      __ZN5boostmiERK8Vector2DS2_($182, $256, $227);
      var $736 = $182 + 4 | 0;
      var $737 = __ZNK4RealcvKfEv($736);
      var $741 = (HEAP8[$317] & 1) << 24 >> 24 != 0;
      if ($737 > 0) {
        var $_ZL9Nook_Jump__ZL12Nook_Sm_Jump = $741 ? __ZL9Nook_Jump : __ZL12Nook_Sm_Jump;
        var $743 = $_ZL9Nook_Jump__ZL12Nook_Sm_Jump | 0;
        __ZN7cPlayer12SetAnimationEPKi($this, $743);
      } else {
        if ($741) {
          if ((HEAP8[$383] & 1) << 24 >> 24 == 0) {
            __ZN7cPlayer12SetAnimationEPKi($this, __ZL9Nook_Fall | 0);
          } else {
            if ((HEAP32[$this + 16 >> 2] | 0) != (__ZL13Nook_WallGrab | 0)) {
              var $754 = _sndPlay(STRING_TABLE.__str15 | 0);
            }
            __ZN7cPlayer12SetAnimationEPKi($this, __ZL13Nook_WallGrab | 0);
          }
        } else {
          __ZN7cPlayer12SetAnimationEPKi($this, __ZL12Nook_Sm_Fall | 0);
        }
      }
    } else {
      var $715 = __ZN7cPlayer15NotTransformingEv($this);
      if (!$715) {
        break;
      }
      var $721 = (HEAP8[$317] & 1) << 24 >> 24 != 0;
      if (HEAPF32[_gx >> 2] != 0) {
        var $723 = $721 ? __ZL8Nook_Run | 0 : __ZL11Nook_Sm_Run | 0;
        __ZN7cPlayer12SetAnimationEPKi($this, $723);
      } else {
        var $725 = $721 ? __ZL9Nook_Idle | 0 : __ZL12Nook_Sm_Idle | 0;
        __ZN7cPlayer12SetAnimationEPKi($this, $725);
      }
      var $727 = HEAPF32[_gx >> 2];
      if ($727 > 0) {
        HEAP8[$this + 60 | 0] = 0;
      } else {
        if ($727 >= 0) {
          break;
        }
        HEAP8[$this + 60 | 0] = 1;
      }
    }
  } while (0);
  var $759 = __Z16Input_KeyPressedi(16);
  var $760 = ($759 | 0) == 0;
  do {
    if (!$760) {
      var $762 = __ZN7cPlayer15NotTransformingEv($this);
      if (!$762) {
        break;
      }
      if ((HEAP8[$317] & 1) << 24 >> 24 == 0) {
        var $768 = __ZN7cPlayer16CanTransformHereEv($this);
        if ($768) {
          var $772 = (HEAP8[$317] & 1) << 24 >> 24 == 0;
          __ZN7cPlayer6SetBigEbb($this, $772, 1);
          var $773 = _sndPlay(STRING_TABLE.__str16 | 0);
        } else {
          var $775 = _sndPlay(STRING_TABLE.__str17 | 0);
        }
      } else {
        __ZN7cPlayer6SetBigEbb($this, 0, 1);
        var $777 = _sndPlay(STRING_TABLE.__str16 | 0);
      }
    }
  } while (0);
  var $779$s2 = ($this + 28 | 0) >> 2;
  var $781 = HEAP32[$779$s2] + 1 | 0;
  HEAP32[$779$s2] = $781;
  var $782 = ($781 | 0) > 5;
  do {
    if ($782) {
      HEAP32[$779$s2] = 0;
      var $784$s2 = ($this + 24 | 0) >> 2;
      var $786 = HEAP32[$784$s2] + 1 | 0;
      HEAP32[$784$s2] = $786;
      var $787 = $this + 20 | 0;
      var $788 = HEAP32[$787 >> 2];
      if (($788 | 0) == 0) {
        if (($786 | 0) != (HEAP32[HEAP32[$this + 16 >> 2] >> 2] | 0)) {
          break;
        }
        HEAP32[$784$s2] = 0;
      } else {
        if (($786 | 0) != (HEAP32[$788 >> 2] | 0)) {
          break;
        }
        HEAP32[$784$s2] = 0;
        HEAP32[$787 >> 2] = 0;
      }
    }
  } while (0);
  STACKTOP = __stackBase__;
  return;
  return;
}

__ZN7cPlayer4StepEv["X"] = 1;

function __Z16Input_KeyPressedi($Mask) {
  return HEAP32[__Input_KeyCurrent >> 2] & $Mask & (HEAP32[__Input_KeyLast >> 2] ^ -1);
  return null;
}

function __ZN5cDoor12SetAnimationEPKi($this, $AnimationName) {
  var $1 = $this + 8 | 0;
  var $3 = (HEAP32[$1 >> 2] | 0) == ($AnimationName | 0);
  do {
    if (!$3) {
      HEAP32[$1 >> 2] = $AnimationName;
      if ((HEAP32[$this + 12 >> 2] | 0) != 0) {
        break;
      }
      HEAP32[$this + 16 >> 2] = 0;
      HEAP32[$this + 20 >> 2] = 0;
    }
  } while (0);
  return;
  return;
}

function __ZN5cDoor24SetIntermediateAnimationEPKi($this, $AnimationName) {
  var $1 = $this + 12 | 0;
  if ((HEAP32[$1 >> 2] | 0) != ($AnimationName | 0)) {
    HEAP32[$1 >> 2] = $AnimationName;
    HEAP32[$this + 16 >> 2] = 0;
    HEAP32[$this + 20 >> 2] = 0;
  }
  return;
  return;
}

function __ZN4RealpLERKS_($this, $_Vs) {
  var $3 = $this | 0;
  var $5 = HEAPF32[$3 >> 2] + HEAPF32[$_Vs >> 2];
  HEAPF32[$3 >> 2] = $5;
  return $this;
  return null;
}

function __ZNK11ShapeRect2D5WidthEv($this) {
  return $this + 12 | 0;
  return null;
}

function __ZN5cDoor4StepEv($this) {
  var $6$s2;
  var $1$s2;
  var $1$s2 = ($this + 20 | 0) >> 2;
  var $3 = HEAP32[$1$s2] + 1 | 0;
  HEAP32[$1$s2] = $3;
  var $4 = ($3 | 0) > 5;
  do {
    if ($4) {
      HEAP32[$1$s2] = 0;
      var $6$s2 = ($this + 16 | 0) >> 2;
      var $8 = HEAP32[$6$s2] + 1 | 0;
      HEAP32[$6$s2] = $8;
      var $9 = $this + 12 | 0;
      var $10 = HEAP32[$9 >> 2];
      if (($10 | 0) == 0) {
        if (($8 | 0) != (HEAP32[HEAP32[$this + 8 >> 2] >> 2] | 0)) {
          break;
        }
        HEAP32[$6$s2] = 0;
      } else {
        if (($8 | 0) != (HEAP32[$10 >> 2] | 0)) {
          break;
        }
        HEAP32[$6$s2] = 0;
        HEAP32[$9 >> 2] = 0;
      }
    }
  } while (0);
  return;
  return;
}

function __ZN5cExit12SetAnimationEPKi($this, $AnimationName) {
  var $1 = $this + 8 | 0;
  var $3 = (HEAP32[$1 >> 2] | 0) == ($AnimationName | 0);
  do {
    if (!$3) {
      HEAP32[$1 >> 2] = $AnimationName;
      if ((HEAP32[$this + 12 >> 2] | 0) != 0) {
        break;
      }
      HEAP32[$this + 16 >> 2] = 0;
      HEAP32[$this + 20 >> 2] = 0;
    }
  } while (0);
  return;
  return;
}

function __ZNK4Real7ToFloatEv($this) {
  return HEAPF32[$this >> 2];
  return null;
}

function __ZNK4RealcvKfEv($this) {
  return HEAPF32[$this >> 2];
  return null;
}

function __ZN7cPlayer7GetRectEv($agg_result, $this) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 20;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 8;
  var $3 = __stackBase__ + 16;
  var $4 = $this | 0;
  var $5 = $this + 40 | 0;
  var $6 = $5 | 0;
  __ZNK4RealmlERKS_($3, $6, __ZN4Real4HalfE);
  var $7 = $this + 44 | 0;
  __ZN8Vector2DC1ERK4RealS2_($2, $3, $7);
  __ZN5boostmiERK8Vector2DS2_($1, $4, $2);
  __ZN11ShapeRect2DC1ERK8Vector2DS2_($agg_result, $1, $5);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN5cDoor7GetRectEv($agg_result, $this) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 20;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 8;
  var $3 = __stackBase__ + 16;
  var $4 = $this | 0;
  var $5 = $this + 32 | 0;
  var $6 = $5 | 0;
  __ZNK4RealmlERKS_($3, $6, __ZN4Real4HalfE);
  var $7 = $this + 36 | 0;
  __ZN8Vector2DC1ERK4RealS2_($2, $3, $7);
  __ZN5boostmiERK8Vector2DS2_($1, $4, $2);
  __ZN11ShapeRect2DC1ERK8Vector2DS2_($agg_result, $1, $5);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZNK11ShapeRect2DeqERKS_($this, $Vs) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 60;
  var $r = __stackBase__;
  var $1 = __stackBase__ + 20;
  var $2 = __stackBase__ + 28;
  var $3 = __stackBase__ + 36;
  var $4 = __stackBase__ + 44;
  var $v = __stackBase__ + 52;
  __ZNK11ShapeRect2D2P1Ev($1, $this);
  __ZNK11ShapeRect2D5ShapeEv($3, $this);
  __ZNK11ShapeRect2D5ShapeEv($4, $Vs);
  __ZN5boostplERK8Vector2DS2_($2, $3, $4);
  __ZN10PairRect2DC1ERK8Vector2DS2_($r, $1, $2);
  __ZNK11ShapeRect2D2P2Ev($v, $Vs);
  var $5 = $v | 0;
  var $6 = __ZNK10PairRect2D2P1Ev($r);
  var $7 = $6 | 0;
  var $8 = __ZNK4RealgeERKS_($5, $7);
  do {
    if ($8) {
      var $10 = __ZNK4RealcvKfEv($5);
      var $11 = __ZNK10PairRect2D2P2Ev($r);
      var $12 = $11 | 0;
      var $13 = __ZNK4RealcvKfEv($12);
      if ($10 >= $13) {
        var $_0 = 0;
        break;
      }
      var $16 = $v + 4 | 0;
      var $17 = $6 + 4 | 0;
      var $18 = __ZNK4RealgeERKS_($16, $17);
      if (!$18) {
        var $_0 = 0;
        break;
      }
      var $20 = __ZNK4RealcvKfEv($16);
      var $21 = $11 + 4 | 0;
      var $22 = __ZNK4RealcvKfEv($21);
      var $_0 = $20 < $22;
    } else {
      var $_0 = 0;
    }
  } while (0);
  var $_0;
  STACKTOP = __stackBase__;
  return $_0;
  return null;
}

function __ZN5boostmiERK11ShapeRect2DS2_($agg_result, $lhs, $rhs) {
  var $2$s2;
  var $1$s2;
  var $1$s2 = ($agg_result | 0) >> 2;
  var $2$s2 = ($lhs | 0) >> 2;
  HEAP32[$1$s2] = HEAP32[$2$s2];
  HEAP32[$1$s2 + 1] = HEAP32[$2$s2 + 1];
  HEAP32[$1$s2 + 2] = HEAP32[$2$s2 + 2];
  HEAP32[$1$s2 + 3] = HEAP32[$2$s2 + 3];
  HEAP32[$1$s2 + 4] = HEAP32[$2$s2 + 4];
  var $3 = __ZN11ShapeRect2DmIERKS_($agg_result, $rhs);
  return;
  return;
}

function __ZN5boostmiERK8Vector2DS2_($agg_result, $lhs, $rhs) {
  var $1 = $lhs;
  var $2 = $agg_result;
  var $3$0 = HEAP32[$1 >> 2];
  var $3$1 = HEAP32[$1 + 4 >> 2];
  HEAP32[$2 >> 2] = $3$0;
  HEAP32[$2 + 4 >> 2] = $3$1;
  var $4 = __ZN8Vector2DmIERKS_($agg_result, $rhs);
  return;
  return;
}

function __ZNK11ShapeRect2D6CenterEv($agg_result, $this) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 16;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 8;
  __ZNK11ShapeRect2D2P1Ev($1, $this);
  __ZNK11ShapeRect2D9HalfShapeEv($2, $this);
  __ZN5boostplERK8Vector2DS2_($agg_result, $1, $2);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZNK4Real6NormalEv($agg_result, $this) {
  var $2 = HEAPF32[$this >> 2];
  var $3 = __ZNK4RealcvKfEv(__ZN4Real4ZeroE);
  if ($2 > $3) {
    var $7 = HEAPF32[__ZN4Real3OneE >> 2];
    HEAPF32[$agg_result >> 2] = $7;
  } else {
    if ($2 < $3) {
      __ZNK4RealngEv($agg_result, __ZN4Real3OneE);
    } else {
      var $13 = HEAPF32[__ZN4Real4ZeroE >> 2];
      HEAPF32[$agg_result >> 2] = $13;
    }
  }
  return;
  return;
}

function __ZNK4RealmlERKS_($agg_result, $this, $_Vs) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $1 = __stackBase__;
  var $6 = HEAPF32[$this >> 2] * HEAPF32[$_Vs >> 2];
  HEAPF32[$1 >> 2] = $6;
  __ZN4RealC1ERKf($agg_result, $1);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN5cExit7GetRectEv($agg_result, $this) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 20;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 8;
  var $3 = __stackBase__ + 16;
  var $4 = $this | 0;
  var $5 = $this + 32 | 0;
  var $6 = $5 | 0;
  __ZNK4RealmlERKS_($3, $6, __ZN4Real4HalfE);
  var $7 = $this + 36 | 0;
  __ZN8Vector2DC1ERK4RealS2_($2, $3, $7);
  __ZN5boostmiERK8Vector2DS2_($1, $4, $2);
  __ZN11ShapeRect2DC1ERK8Vector2DS2_($agg_result, $1, $5);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN5cExit4StepEv($this) {
  var $6$s2;
  var $1$s2;
  var $1$s2 = ($this + 20 | 0) >> 2;
  var $3 = HEAP32[$1$s2] + 1 | 0;
  HEAP32[$1$s2] = $3;
  var $4 = ($3 | 0) > 5;
  do {
    if ($4) {
      HEAP32[$1$s2] = 0;
      var $6$s2 = ($this + 16 | 0) >> 2;
      var $8 = HEAP32[$6$s2] + 1 | 0;
      HEAP32[$6$s2] = $8;
      var $9 = $this + 12 | 0;
      var $10 = HEAP32[$9 >> 2];
      if (($10 | 0) == 0) {
        if (($8 | 0) != (HEAP32[HEAP32[$this + 8 >> 2] >> 2] | 0)) {
          break;
        }
        HEAP32[$6$s2] = 0;
      } else {
        if (($8 | 0) != (HEAP32[$10 >> 2] | 0)) {
          break;
        }
        HEAP32[$6$s2] = 0;
        HEAP32[$9 >> 2] = 0;
      }
    }
  } while (0);
  if ((HEAP32[_GlobalTotalKeys >> 2] | 0) == (HEAP32[_TotalKeysInMap >> 2] | 0)) {
    __ZN5cExit12SetAnimationEPKi($this, __ZL11Exit_Opened | 0);
  }
  return;
  return;
}

function __Z8GameStepv() {
  var $1 = HEAP32[_GameState >> 2];
  do {
    if (($1 | 0) == 1) {
      var $3 = __Z16Input_KeyPressedi(16);
      if (($3 | 0) == 0) {
        break;
      }
      HEAP32[_GameState >> 2] = 2;
    } else if (($1 | 0) == 2) {
      __Z10EngineStepv();
    } else if (($1 | 0) == 3) {
      var $8 = __Z16Input_KeyPressedi(16);
      if (($8 | 0) == 0) {
        break;
      }
      __Z7LoadMapv();
      HEAP32[_GameState >> 2] = 2;
    }
  } while (0);
  return;
  return;
}

function __Z9DrawLayeri($Layer) {
  var $3 = ((HEAP32[_ScreenWidth >> 2] | 0) / 8 & -1) + 1 | 0;
  var $6 = ((HEAP32[_ScreenHeight >> 2] | 0) / 8 & -1) + 1 | 0;
  var $9 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
  var $10 = __ZNK7cGrid2DIsE5WidthEv($9);
  var $11 = __ZNK7cGrid2DIsE6HeightEv($9);
  var $CameraScalar_0 = ($Layer | 0) == 0 ? .5 : 1;
  var $13 = __ZNK4Real7ToFloatEv(_CameraPos | 0);
  var $14 = __ZNK4Real7ToFloatEv(_CameraPos + 4 | 0);
  var $21 = ($13 - (HEAP32[_HalfScreenWidth >> 2] | 0)) * $CameraScalar_0;
  var $22 = ($14 - (HEAP32[_HalfScreenHeight >> 2] | 0)) * $CameraScalar_0;
  var $CameraOffsetXCenter_0 = $21 < 0 ? 0 : $21;
  var $CameraOffsetYCenter_0 = $22 < 0 ? 0 : $22;
  var $floorf = _floorf($CameraOffsetXCenter_0);
  var $28 = (($floorf & -1) + HEAP32[_HalfScreenWidth >> 2] | 0) % 8;
  var $floorf1 = _floorf($CameraOffsetYCenter_0);
  var $34 = $CameraOffsetXCenter_0 * .125 & -1;
  var $35 = ($34 | 0) < 0;
  var $OffsetX_0 = $35 ? 0 : $28;
  var $StartX_0 = $35 ? 0 : $34;
  var $40 = (($10 - $3) * $CameraScalar_0 & -1) + 1 | 0;
  var $41 = ($StartX_0 | 0) < ($40 | 0);
  var $OffsetX_1 = $41 ? $OffsetX_0 : 0;
  var $StartX_1 = $41 ? $StartX_0 : $40;
  var $43 = $CameraOffsetYCenter_0 * .125 & -1;
  var $44 = ($43 | 0) < 0;
  var $OffsetY_0 = $44 ? 0 : (($floorf1 & -1) + HEAP32[_HalfScreenHeight >> 2] | 0) % 8;
  var $StartY_0 = $44 ? 0 : $43;
  var $49 = (($11 - $6) * $CameraScalar_0 & -1) + 1 | 0;
  var $50 = ($StartY_0 | 0) < ($49 | 0);
  var $OffsetY_1 = $50 ? $OffsetY_0 : 0;
  var $StartY_1 = $50 ? $StartY_0 : $49;
  var $51 = $StartX_1 + $3 | 0;
  var $EndX_0 = ($51 | 0) > ($10 | 0) ? $10 : $51;
  var $53 = $StartY_1 + $6 | 0;
  var $EndY_0 = ($53 | 0) > ($11 | 0) ? $11 : $53;
  var $or_cond = ($StartY_1 | 0) < ($EndY_0 | 0) & ($StartX_1 | 0) < ($EndX_0 | 0);
  $_$69 : do {
    if ($or_cond) {
      var $_y_03_us = $StartY_1;
      while (1) {
        var $_y_03_us;
        var $79 = ($_y_03_us - $StartY_1 << 3) - $OffsetY_1 | 0;
        var $_x_02_us = $StartX_1;
        while (1) {
          var $_x_02_us;
          var $72 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
          var $73 = __ZN7cGrid2DIsEclEjj($72, $_x_02_us, $_y_03_us);
          var $74 = HEAP16[$73 >> 1];
          if ($74 << 16 >> 16 > 0) {
            var $65 = ($74 << 16 >> 16) - 1 | 0;
            var $69 = ($_x_02_us - $StartX_1 << 3) - $OffsetX_1 | 0;
            _gelDrawTile($65, $69, $79);
          }
          var $61 = $_x_02_us + 1 | 0;
          if (($61 | 0) >= ($EndX_0 | 0)) {
            break;
          }
          var $_x_02_us = $61;
        }
        var $58 = $_y_03_us + 1 | 0;
        if (($58 | 0) >= ($EndY_0 | 0)) {
          break $_$69;
        }
        var $_y_03_us = $58;
      }
    }
  } while (0);
  return;
  return;
}

__Z9DrawLayeri["X"] = 1;

function __Z15DrawObjectLayeri($Layer) {
  var __label__;
  var $3 = ((HEAP32[_ScreenWidth >> 2] | 0) / 8 & -1) + 1 | 0;
  var $6 = ((HEAP32[_ScreenHeight >> 2] | 0) / 8 & -1) + 1 | 0;
  var $9 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
  var $10 = __ZNK7cGrid2DIsE5WidthEv($9);
  var $11 = __ZNK7cGrid2DIsE6HeightEv($9);
  var $CameraScalar_0 = ($Layer | 0) == 0 ? .5 : 1;
  var $13 = __ZNK4Real7ToFloatEv(_CameraPos | 0);
  var $14 = __ZNK4Real7ToFloatEv(_CameraPos + 4 | 0);
  var $21 = ($13 - (HEAP32[_HalfScreenWidth >> 2] | 0)) * $CameraScalar_0;
  var $22 = ($14 - (HEAP32[_HalfScreenHeight >> 2] | 0)) * $CameraScalar_0;
  var $CameraOffsetXCenter_0 = $21 < 0 ? 0 : $21;
  var $CameraOffsetYCenter_0 = $22 < 0 ? 0 : $22;
  var $floorf = _floorf($CameraOffsetXCenter_0);
  var $25 = HEAP32[_HalfScreenWidth >> 2];
  var $floorf1 = _floorf($CameraOffsetYCenter_0);
  var $27 = $CameraOffsetXCenter_0 * .125 & -1;
  var $28 = ($27 | 0) < 0;
  var $StartX_0 = $28 ? 0 : $27;
  var $33 = (($10 - $3) * $CameraScalar_0 & -1) + 1 | 0;
  var $34 = ($StartX_0 | 0) < ($33 | 0);
  var $StartX_1 = $34 ? $StartX_0 : $33;
  var $36 = $CameraOffsetYCenter_0 * .125 & -1;
  var $37 = ($36 | 0) < 0;
  var $StartY_0 = $37 ? 0 : $36;
  var $42 = (($11 - $6) * $CameraScalar_0 & -1) + 1 | 0;
  var $43 = ($StartY_0 | 0) < ($42 | 0);
  var $StartY_1 = $43 ? $StartY_0 : $42;
  var $44 = $StartX_1 + $3 | 0;
  var $EndX_0 = ($44 | 0) > ($10 | 0) ? $10 : $44;
  var $46 = $StartY_1 + $6 | 0;
  var $EndY_0 = ($46 | 0) > ($11 | 0) ? $11 : $46;
  var $48 = ($StartY_1 | 0) < ($EndY_0 | 0);
  $_$81 : do {
    if ($48) {
      var $56 = ($StartX_1 | 0) < ($EndX_0 | 0);
      var $OffsetX_0_op_op = $28 ? 4 : 4 - (($floorf & -1) + $25) % 8 | 0;
      var $57 = $34 ? $OffsetX_0_op_op : 4;
      var $OffsetY_0_op_op = $37 ? 4 : 4 - (($floorf1 & -1) + HEAP32[_HalfScreenHeight >> 2]) % 8 | 0;
      var $58 = $43 ? $OffsetY_0_op_op : 4;
      var $_y_03 = $StartY_1;
      while (1) {
        var $_y_03;
        $_$85 : do {
          if ($56) {
            var $62 = ($_y_03 - $StartY_1 << 3) + $58 | 0;
            var $_x_02 = $StartX_1;
            while (1) {
              var $_x_02;
              var $65 = HEAP32[HEAP32[_MapLayer >> 2] + ($Layer << 2) + 8 >> 2];
              var $66 = __ZN7cGrid2DIsEclEjj($65, $_x_02, $_y_03);
              var $67 = HEAP16[$66 >> 1];
              do {
                if ($67 << 16 >> 16 == 0) {
                  __label__ = 11;
                } else if ($67 << 16 >> 16 == 1859) {
                  var $69 = HEAP32[_StarsId >> 2];
                  _gelBindTileset($69);
                  var $ArtIndex_0 = HEAP32[__ZL9Star_Idle + (HEAP32[HEAP32[_Player >> 2] + 76 >> 2] + 1 << 2) >> 2];
                  __label__ = 10;
                  break;
                } else if ($67 << 16 >> 16 == 1860) {
                  var $77 = HEAP32[_StarsId >> 2];
                  _gelBindTileset($77);
                  var $ArtIndex_0 = HEAP32[__ZL8Key_Idle + (HEAP32[HEAP32[_Player >> 2] + 92 >> 2] + 1 << 2) >> 2];
                  __label__ = 10;
                  break;
                } else if ($67 << 16 >> 16 == 1861) {
                  var $85 = HEAP32[_StarsId >> 2];
                  _gelBindTileset($85);
                  var $ArtIndex_0 = HEAP32[__ZL12Star_Sm_Idle + (HEAP32[HEAP32[_Player >> 2] + 84 >> 2] + 1 << 2) >> 2];
                  __label__ = 10;
                  break;
                } else if ($67 << 16 >> 16 == 1862) {
                  var $93 = HEAP32[_StarsId >> 2];
                  _gelBindTileset($93);
                  var $ArtIndex_0 = HEAP32[__ZL11Key_Sm_Idle + (HEAP32[HEAP32[_Player >> 2] + 100 >> 2] + 1 << 2) >> 2];
                  __label__ = 10;
                  break;
                } else {
                  var $ArtIndex_0 = 0;
                  __label__ = 10;
                }
              } while (0);
              if (__label__ == 10) {
                var $ArtIndex_0;
                var $104 = ($_x_02 - $StartX_1 << 3) + $57 | 0;
                _gelDrawTileCentered($ArtIndex_0, $104, $62);
              }
              var $106 = $_x_02 + 1 | 0;
              if (($106 | 0) >= ($EndX_0 | 0)) {
                break $_$85;
              }
              var $_x_02 = $106;
            }
          }
        } while (0);
        var $108 = $_y_03 + 1 | 0;
        if (($108 | 0) >= ($EndY_0 | 0)) {
          break $_$81;
        }
        var $_y_03 = $108;
      }
    }
  } while (0);
  return;
  return;
}

__Z15DrawObjectLayeri["X"] = 1;

function __Z10EngineDrawv() {
  var $TransformedCameraPos$s2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 208;
  var $TransformedCameraPos = __stackBase__, $TransformedCameraPos$s2 = $TransformedCameraPos >> 2;
  var $1 = __stackBase__ + 8;
  var $2 = __stackBase__ + 16;
  var $3 = __stackBase__ + 20;
  var $4 = __stackBase__ + 24;
  var $5 = __stackBase__ + 28;
  var $6 = __stackBase__ + 32;
  var $7 = __stackBase__ + 36;
  var $8 = __stackBase__ + 40;
  var $9 = __stackBase__ + 44;
  var $10 = __stackBase__ + 48;
  var $11 = __stackBase__ + 52;
  var $12 = __stackBase__ + 56;
  var $13 = __stackBase__ + 60;
  var $14 = __stackBase__ + 64;
  var $15 = __stackBase__ + 68;
  var $16 = __stackBase__ + 72;
  var $17 = __stackBase__ + 76;
  var $Text = __stackBase__ + 80;
  var $18 = HEAP32[_TilesetId >> 2];
  _gelBindImage($18);
  var $19 = HEAPU32[_MapLayer >> 2];
  var $22 = (HEAP32[$19 + 4 >> 2] | 0) == 3;
  $_$100 : do {
    if ($22) {
      var $_lcssa = $19;
    } else {
      var $Layer_06 = 0;
      while (1) {
        var $Layer_06;
        __Z9DrawLayeri($Layer_06);
        var $23 = $Layer_06 + 1 | 0;
        var $24 = HEAPU32[_MapLayer >> 2];
        if ($23 >>> 0 >= (HEAP32[$24 + 4 >> 2] - 3 | 0) >>> 0) {
          var $_lcssa = $24;
          break $_$100;
        }
        var $Layer_06 = $23;
      }
    }
  } while (0);
  var $_lcssa;
  var $30 = HEAP32[$_lcssa + 8 >> 2];
  var $31 = __ZNK7cGrid2DIsE5WidthEv($30);
  var $32 = __ZNK7cGrid2DIsE6HeightEv($30);
  HEAPF32[$3 >> 2] = HEAP32[_HalfScreenWidth >> 2] | 0;
  __ZN4RealC1ERKf($2, $3);
  HEAPF32[$5 >> 2] = HEAP32[_HalfScreenHeight >> 2] | 0;
  __ZN4RealC1ERKf($4, $5);
  __ZN8Vector2DC1ERK4RealS2_($1, $2, $4);
  __ZN5boostmiERK8Vector2DS2_($TransformedCameraPos, _CameraPos, $1);
  var $37 = $TransformedCameraPos | 0;
  var $38 = __ZNK4RealcvKfEv($37);
  if ($38 < 0) {
    HEAPF32[$7 >> 2] = 0;
    __ZN4RealC1ERKf($6, $7);
    var $43 = HEAP32[$6 >> 2];
    HEAP32[$TransformedCameraPos$s2] = $43;
  }
  var $45 = $TransformedCameraPos + 4 | 0;
  var $46 = __ZNK4RealcvKfEv($45);
  if ($46 < 0) {
    HEAPF32[$9 >> 2] = 0;
    __ZN4RealC1ERKf($8, $9);
    var $51 = HEAPF32[$8 >> 2];
    HEAPF32[$45 >> 2] = $51;
  }
  var $53 = __ZNK4RealcvKfEv($37);
  var $57 = ($31 << 3) - HEAP32[_ScreenWidth >> 2] | 0;
  if ($53 > $57) {
    HEAPF32[$11 >> 2] = $57;
    __ZN4RealC1ERKf($10, $11);
    var $62 = HEAP32[$10 >> 2];
    HEAP32[$TransformedCameraPos$s2] = $62;
  }
  var $64 = __ZNK4RealcvKfEv($45);
  var $68 = ($32 << 3) - HEAP32[_ScreenHeight >> 2] | 0;
  if ($64 > $68) {
    HEAPF32[$13 >> 2] = $68;
    __ZN4RealC1ERKf($12, $13);
    var $72 = $45 | 0;
    var $73 = HEAPF32[$12 >> 2];
    HEAPF32[$72 >> 2] = $73;
    var $_pre_phi = $72;
  } else {
    var $_pre_phi = $45 | 0;
  }
  var $_pre_phi;
  var $75 = __ZNK4RealcvKfEv($37);
  var $floorf = _floorf($75);
  HEAPF32[$15 >> 2] = $floorf;
  __ZN4RealC1ERKf($14, $15);
  var $78 = HEAP32[$14 >> 2];
  HEAP32[$TransformedCameraPos$s2] = $78;
  var $79 = __ZNK4RealcvKfEv($45);
  var $floorf1 = _floorf($79);
  HEAPF32[$17 >> 2] = $floorf1;
  __ZN4RealC1ERKf($16, $17);
  var $81 = HEAPF32[$16 >> 2];
  HEAPF32[$_pre_phi >> 2] = $81;
  var $82 = HEAP32[_MapDoor >> 2];
  var $85 = (HEAP32[$82 + 4 >> 2] | 0) == 0;
  $_$117 : do {
    if (!$85) {
      var $idx_03 = 0;
      var $90 = $82;
      while (1) {
        var $90;
        var $idx_03;
        var $92 = HEAP32[$90 + ($idx_03 << 2) + 8 >> 2];
        __ZN5cDoor4DrawERK8Vector2D($92, $TransformedCameraPos);
        var $93 = $idx_03 + 1 | 0;
        var $94 = HEAPU32[_MapDoor >> 2];
        if ($93 >>> 0 >= HEAPU32[$94 + 4 >> 2] >>> 0) {
          break $_$117;
        }
        var $idx_03 = $93;
        var $90 = $94;
      }
    }
  } while (0);
  var $86 = HEAPU32[_MapExit >> 2];
  var $89 = (HEAP32[$86 + 4 >> 2] | 0) == 0;
  $_$121 : do {
    if (!$89) {
      var $idx2_02 = 0;
      var $98 = $86;
      while (1) {
        var $98;
        var $idx2_02;
        var $100 = HEAP32[$98 + ($idx2_02 << 2) + 8 >> 2];
        __ZN5cExit4DrawERK8Vector2D($100, $TransformedCameraPos);
        var $101 = $idx2_02 + 1 | 0;
        var $102 = HEAPU32[_MapExit >> 2];
        if ($101 >>> 0 >= HEAPU32[$102 + 4 >> 2] >>> 0) {
          break $_$121;
        }
        var $idx2_02 = $101;
        var $98 = $102;
      }
    }
  } while (0);
  var $106 = HEAP32[_Player >> 2];
  __ZN7cPlayer4DrawERK8Vector2D($106, $TransformedCameraPos);
  var $110 = HEAP32[HEAP32[_MapLayer >> 2] + 4 >> 2] - 1 | 0;
  __Z15DrawObjectLayeri($110);
  var $111 = HEAP32[_TilesetId >> 2];
  _gelBindImage($111);
  var $115 = HEAP32[HEAP32[_MapLayer >> 2] + 4 >> 2] - 3 | 0;
  __Z9DrawLayeri($115);
  var $116 = $Text | 0;
  var $117 = HEAP32[_Player >> 2];
  var $119 = HEAP32[$117 + 68 >> 2];
  var $123 = HEAP32[_TotalKeysInMap >> 2] - HEAP32[$117 + 72 >> 2] | 0;
  var $124 = _sprintf($116, STRING_TABLE.__str9 | 0, (tempInt = STACKTOP, STACKTOP += 8, HEAP32[tempInt >> 2] = $119, HEAP32[tempInt + 4 >> 2] = $123, tempInt));
  _gelSetColor(111, 130, 228, 255);
  _gelDrawTextLeft($116, 32, 17, 23, STRING_TABLE.__str10 | 0);
  _gelSetColor(214, 235, 255, 255);
  _gelDrawTextLeft($116, 32, 16, 23, STRING_TABLE.__str10 | 0);
  var $127 = HEAP32[HEAP32[_Player >> 2] + 64 >> 2];
  var $128 = HEAP32[_TotalStarsInMap >> 2];
  var $129 = _sprintf($116, STRING_TABLE.__str9 | 0, (tempInt = STACKTOP, STACKTOP += 8, HEAP32[tempInt >> 2] = $127, HEAP32[tempInt + 4 >> 2] = $128, tempInt));
  _gelSetColor(199, 133, 0, 255);
  _gelDrawTextRight($116, 288, 17, 23, STRING_TABLE.__str10 | 0);
  _gelSetColor(255, 227, 0, 255);
  _gelDrawTextRight($116, 288, 16, 23, STRING_TABLE.__str10 | 0);
  var $130 = HEAP32[_HudId >> 2];
  _gelBindImage($130);
  _gelDrawTile(0, 0, 0);
  _gelDrawTile(1, 288, 0);
  STACKTOP = __stackBase__;
  return;
  return;
}

__Z10EngineDrawv["X"] = 1;

function __ZN8Vector2DC1ERK4RealS2_($this, $_x, $_y) {
  __ZN8Vector2DC2ERK4RealS2_($this, $_x, $_y);
  return;
  return;
}

function __ZN5cDoor4DrawERK8Vector2D($this, $Camera) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 32;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 4;
  var $3 = __stackBase__ + 8;
  var $4 = __stackBase__ + 12;
  var $5 = __stackBase__ + 16;
  var $6 = __stackBase__ + 20;
  var $7 = __stackBase__ + 24;
  var $8 = __stackBase__ + 28;
  var $9 = HEAP32[_DoorId >> 2];
  _gelBindImage($9);
  var $15 = HEAP32[$this + 12 >> 2];
  var $16 = ($15 | 0) != 0;
  var $19 = HEAP32[$this + 16 >> 2] + 1 | 0;
  if ((HEAP8[$this + 41 | 0] & 1) << 24 >> 24 == 0) {
    if ($16) {
      var $_pn2 = $15;
    } else {
      var $_pn2 = HEAP32[$this + 8 >> 2];
    }
    var $_pn2;
    var $39 = HEAP32[$_pn2 + ($19 << 2) >> 2];
    var $40 = $this | 0;
    var $41 = $this + 24 | 0;
    __ZNK4RealmiERKS_($5, $40, $41);
    var $42 = $Camera | 0;
    __ZNK4RealmiERKS_($6, $5, $42);
    var $43 = __ZNK4RealcvKfEv($6);
    var $floorf4 = _floorf($43);
    var $44 = $this + 4 | 0;
    var $45 = $this + 28 | 0;
    __ZNK4RealmiERKS_($7, $44, $45);
    var $46 = $Camera + 4 | 0;
    __ZNK4RealmiERKS_($8, $7, $46);
    var $47 = __ZNK4RealcvKfEv($8);
    var $floorf5 = _floorf($47);
    _gelDrawTile($39, $floorf4, $floorf5);
  } else {
    if ($16) {
      var $_pn = $15;
    } else {
      var $_pn = HEAP32[$this + 8 >> 2];
    }
    var $_pn;
    var $25 = HEAP32[$_pn + ($19 << 2) >> 2];
    var $26 = $this | 0;
    var $27 = $this + 24 | 0;
    __ZNK4RealmiERKS_($1, $26, $27);
    var $28 = $Camera | 0;
    __ZNK4RealmiERKS_($2, $1, $28);
    var $29 = __ZNK4RealcvKfEv($2);
    var $floorf = _floorf($29);
    var $30 = $this + 4 | 0;
    var $31 = $this + 28 | 0;
    __ZNK4RealmiERKS_($3, $30, $31);
    var $32 = $Camera + 4 | 0;
    __ZNK4RealmiERKS_($4, $3, $32);
    var $33 = __ZNK4RealcvKfEv($4);
    var $floorf3 = _floorf($33);
    _gelDrawTileFlipX($25, $floorf, $floorf3);
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

__ZN5cDoor4DrawERK8Vector2D["X"] = 1;

function __Z14GameDrawPausedv() {
  return;
  return;
}

function __Z9Input_Keyi($Mask) {
  return HEAP32[__Input_KeyCurrent >> 2] & $Mask;
  return null;
}

function __ZN7cGrid2DIsE4FillEPsjRKs($Dest, $Size, $Value) {
  var $1 = ($Size | 0) == 0;
  $_$33 : do {
    if (!$1) {
      var $_in = $Size;
      while (1) {
        var $_in;
        var $2 = $_in - 1 | 0;
        var $3 = HEAP16[$Value >> 1];
        HEAP16[$Dest + ($2 << 1) >> 1] = $3;
        if (($2 | 0) == 0) {
          break $_$33;
        }
        var $_in = $2;
      }
    }
  } while (0);
  return;
  return;
}

function __ZNK7cGrid2DIsE4SizeEv($this) {
  return HEAP32[$this + 4 >> 2] * HEAP32[$this >> 2] | 0;
  return null;
}

function __ZNK11ShapeRect2D2P1Ev($agg_result, $this) {
  var $2 = $this + 4 | 0;
  var $3 = $agg_result;
  var $4$0 = HEAP32[$2 >> 2];
  var $4$1 = HEAP32[$2 + 4 >> 2];
  HEAP32[$3 >> 2] = $4$0;
  HEAP32[$3 + 4 >> 2] = $4$1;
  return;
  return;
}

function __ZN4RealmIERKS_($this, $_Vs) {
  var $3 = $this | 0;
  var $5 = HEAPF32[$3 >> 2] - HEAPF32[$_Vs >> 2];
  HEAPF32[$3 >> 2] = $5;
  return $this;
  return null;
}

function __ZN8Vector2DC2ERK4RealS2_($this, $_x, $_y) {
  var $3 = HEAP32[$_x >> 2];
  HEAP32[$this >> 2] = $3;
  var $6 = HEAPF32[$_y >> 2];
  HEAPF32[$this + 4 >> 2] = $6;
  return;
  return;
}

function __ZN11ShapeRect2DC2ERK8Vector2DS2_($this, $_Vec1, $_Vec2) {
  var $2 = $_Vec1;
  var $3 = $this + 4 | 0;
  var $4$0 = HEAP32[$2 >> 2];
  var $4$1 = HEAP32[$2 + 4 >> 2];
  HEAP32[$3 >> 2] = $4$0;
  HEAP32[$3 + 4 >> 2] = $4$1;
  var $6 = $_Vec2;
  var $7 = $this + 12 | 0;
  var $8$0 = HEAP32[$6 >> 2];
  var $8$1 = HEAP32[$6 + 4 >> 2];
  HEAP32[$7 >> 2] = $8$0;
  HEAP32[$7 + 4 >> 2] = $8$1;
  return;
  return;
}

function __ZNK11ShapeRect2D5ShapeEv($agg_result, $this) {
  var $2 = $this + 12 | 0;
  var $3 = $agg_result;
  var $4$0 = HEAP32[$2 >> 2];
  var $4$1 = HEAP32[$2 + 4 >> 2];
  HEAP32[$3 >> 2] = $4$0;
  HEAP32[$3 + 4 >> 2] = $4$1;
  return;
  return;
}

function __ZN4RealmLERKS_($this, $_Vs) {
  var $3 = $this | 0;
  var $5 = HEAPF32[$3 >> 2] * HEAPF32[$_Vs >> 2];
  HEAPF32[$3 >> 2] = $5;
  return $this;
  return null;
}

function __ZNK4RealgeERKS_($this, $_Vs) {
  return HEAPF32[$this >> 2] >= HEAPF32[$_Vs >> 2];
  return null;
}

function __ZNK10PairRect2D2P1Ev($this) {
  return $this + 4 | 0;
  return null;
}

function __ZNK10PairRect2D2P2Ev($this) {
  return $this + 12 | 0;
  return null;
}

function __ZN7cPlayer15NotTransformingEv($this) {
  var $2 = HEAP32[$this + 20 >> 2];
  var $3 = ($2 | 0) == (__ZL17Nook_Sm_Transform | 0);
  do {
    if ($3) {
      var $_0 = (HEAP32[$this + 24 >> 2] | 0) > 6;
    } else {
      if (($2 | 0) != (__ZL14Nook_Transform | 0)) {
        var $_0 = 1;
        break;
      }
      var $_0 = (HEAP32[$this + 24 >> 2] | 0) > 9;
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

function __ZN7cPlayer14NotWallJumpingEv($this) {
  return (HEAP32[$this + 20 >> 2] | 0) != (__ZL13Nook_WallJump | 0);
  return null;
}

function __ZN7cPlayer24SetIntermediateAnimationEPKi($this, $AnimationName) {
  var $1 = $this + 20 | 0;
  if ((HEAP32[$1 >> 2] | 0) != ($AnimationName | 0)) {
    HEAP32[$1 >> 2] = $AnimationName;
    HEAP32[$this + 24 >> 2] = 0;
    HEAP32[$this + 28 >> 2] = 0;
  }
  return;
  return;
}

function __ZNK11ShapeRect2D6HeightEv($this) {
  return $this + 16 | 0;
  return null;
}

function __ZN7cPlayer12SetAnimationEPKi($this, $AnimationName) {
  var $1 = $this + 16 | 0;
  var $3 = (HEAP32[$1 >> 2] | 0) == ($AnimationName | 0);
  do {
    if (!$3) {
      HEAP32[$1 >> 2] = $AnimationName;
      if ((HEAP32[$this + 20 >> 2] | 0) != 0) {
        break;
      }
      HEAP32[$this + 24 >> 2] = 0;
      HEAP32[$this + 28 >> 2] = 0;
    }
  } while (0);
  return;
  return;
}

function __ZN5cExit4DrawERK8Vector2D($this, $Camera) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 32;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 4;
  var $3 = __stackBase__ + 8;
  var $4 = __stackBase__ + 12;
  var $5 = __stackBase__ + 16;
  var $6 = __stackBase__ + 20;
  var $7 = __stackBase__ + 24;
  var $8 = __stackBase__ + 28;
  var $9 = HEAP32[_DoorId >> 2];
  _gelBindImage($9);
  var $15 = HEAP32[$this + 12 >> 2];
  var $16 = ($15 | 0) != 0;
  var $19 = HEAP32[$this + 16 >> 2] + 1 | 0;
  if ((HEAP8[$this + 41 | 0] & 1) << 24 >> 24 == 0) {
    if ($16) {
      var $_pn2 = $15;
    } else {
      var $_pn2 = HEAP32[$this + 8 >> 2];
    }
    var $_pn2;
    var $39 = HEAP32[$_pn2 + ($19 << 2) >> 2];
    var $40 = $this | 0;
    var $41 = $this + 24 | 0;
    __ZNK4RealmiERKS_($5, $40, $41);
    var $42 = $Camera | 0;
    __ZNK4RealmiERKS_($6, $5, $42);
    var $43 = __ZNK4RealcvKfEv($6);
    var $floorf4 = _floorf($43);
    var $44 = $this + 4 | 0;
    var $45 = $this + 28 | 0;
    __ZNK4RealmiERKS_($7, $44, $45);
    var $46 = $Camera + 4 | 0;
    __ZNK4RealmiERKS_($8, $7, $46);
    var $47 = __ZNK4RealcvKfEv($8);
    var $floorf5 = _floorf($47);
    _gelDrawTile($39, $floorf4, $floorf5);
  } else {
    if ($16) {
      var $_pn = $15;
    } else {
      var $_pn = HEAP32[$this + 8 >> 2];
    }
    var $_pn;
    var $25 = HEAP32[$_pn + ($19 << 2) >> 2];
    var $26 = $this | 0;
    var $27 = $this + 24 | 0;
    __ZNK4RealmiERKS_($1, $26, $27);
    var $28 = $Camera | 0;
    __ZNK4RealmiERKS_($2, $1, $28);
    var $29 = __ZNK4RealcvKfEv($2);
    var $floorf = _floorf($29);
    var $30 = $this + 4 | 0;
    var $31 = $this + 28 | 0;
    __ZNK4RealmiERKS_($3, $30, $31);
    var $32 = $Camera + 4 | 0;
    __ZNK4RealmiERKS_($4, $3, $32);
    var $33 = __ZNK4RealcvKfEv($4);
    var $floorf3 = _floorf($33);
    _gelDrawTileFlipX($25, $floorf, $floorf3);
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

__ZN5cExit4DrawERK8Vector2D["X"] = 1;

function __ZN7cPlayer4DrawERK8Vector2D($this, $Camera) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 32;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 4;
  var $3 = __stackBase__ + 8;
  var $4 = __stackBase__ + 12;
  var $5 = __stackBase__ + 16;
  var $6 = __stackBase__ + 20;
  var $7 = __stackBase__ + 24;
  var $8 = __stackBase__ + 28;
  var $9 = HEAP32[_PlayerId >> 2];
  _gelBindImage($9);
  var $15 = HEAP32[$this + 20 >> 2];
  var $16 = ($15 | 0) != 0;
  var $19 = HEAP32[$this + 24 >> 2] + 1 | 0;
  if ((HEAP8[$this + 60 | 0] & 1) << 24 >> 24 == 0) {
    if ($16) {
      var $_pn2 = $15;
    } else {
      var $_pn2 = HEAP32[$this + 16 >> 2];
    }
    var $_pn2;
    var $39 = HEAP32[$_pn2 + ($19 << 2) >> 2];
    var $40 = $this | 0;
    var $41 = $this + 32 | 0;
    __ZNK4RealmiERKS_($5, $40, $41);
    var $42 = $Camera | 0;
    __ZNK4RealmiERKS_($6, $5, $42);
    var $43 = __ZNK4RealcvKfEv($6);
    var $floorf4 = _floorf($43);
    var $44 = $this + 4 | 0;
    var $45 = $this + 36 | 0;
    __ZNK4RealmiERKS_($7, $44, $45);
    var $46 = $Camera + 4 | 0;
    __ZNK4RealmiERKS_($8, $7, $46);
    var $47 = __ZNK4RealcvKfEv($8);
    var $floorf5 = _floorf($47);
    _gelDrawTile($39, $floorf4, $floorf5);
  } else {
    if ($16) {
      var $_pn = $15;
    } else {
      var $_pn = HEAP32[$this + 16 >> 2];
    }
    var $_pn;
    var $25 = HEAP32[$_pn + ($19 << 2) >> 2];
    var $26 = $this | 0;
    var $27 = $this + 32 | 0;
    __ZNK4RealmiERKS_($1, $26, $27);
    var $28 = $Camera | 0;
    __ZNK4RealmiERKS_($2, $1, $28);
    var $29 = __ZNK4RealcvKfEv($2);
    var $floorf = _floorf($29);
    var $30 = $this + 4 | 0;
    var $31 = $this + 36 | 0;
    __ZNK4RealmiERKS_($3, $30, $31);
    var $32 = $Camera + 4 | 0;
    __ZNK4RealmiERKS_($4, $3, $32);
    var $33 = __ZNK4RealcvKfEv($4);
    var $floorf3 = _floorf($33);
    _gelDrawTileFlipX($25, $floorf, $floorf3);
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

__ZN7cPlayer4DrawERK8Vector2D["X"] = 1;

function __Z8GameDrawv() {
  var __stackBase__ = STACKTOP;
  STACKTOP += 64;
  var $Text = __stackBase__;
  var $1 = HEAP32[_GameState >> 2];
  if (($1 | 0) == 1) {
    var $3 = HEAP32[_TitleId >> 2];
    _gelBindImage($3);
    _gelDrawImage(0, 0);
  } else if (($1 | 0) == 2) {
    __Z10EngineDrawv();
  } else if (($1 | 0) == 3) {
    var $6 = HEAP32[_WinId >> 2];
    _gelBindImage($6);
    _gelDrawImage(0, 0);
    var $7 = $Text | 0;
    var $10 = HEAP32[HEAP32[_Player >> 2] + 64 >> 2];
    var $11 = HEAP32[_TotalStarsInMap >> 2];
    var $12 = _sprintf($7, STRING_TABLE.__str9 | 0, (tempInt = STACKTOP, STACKTOP += 8, HEAP32[tempInt >> 2] = $10, HEAP32[tempInt + 4 >> 2] = $11, tempInt));
    _gelSetColor(199, 133, 0, 255);
    _gelDrawTextLeft($7, 104, 152, 46, STRING_TABLE.__str10 | 0);
    _gelSetColor(255, 227, 0, 255);
    _gelDrawTextLeft($7, 104, 150, 46, STRING_TABLE.__str10 | 0);
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN7cGrid2DIsEC2EjjRKs($this, $_w, $_h, $Type) {
  HEAP32[$this >> 2] = $_w;
  HEAP32[$this + 4 >> 2] = $_h;
  var $3 = $this + 8 | 0;
  var $4 = $_w * $_h | 0;
  var $5 = _llvm_umul_with_overflow_i32($4, 2);
  var $6 = $5.f1;
  var $7 = $5.f0;
  var $8 = $6 ? -1 : $7;
  var $9 = __Znaj($8);
  HEAP32[$3 >> 2] = $9;
  __ZN7cGrid2DIsE4FillERKs($this, $Type);
  return;
  return;
}

function __ZN7cGrid2DIsE4FillERKs($this, $Value) {
  var $2 = HEAP32[$this + 8 >> 2];
  var $3 = __ZNK7cGrid2DIsE4SizeEv($this);
  __ZN7cGrid2DIsE4FillEPsjRKs($2, $3, $Value);
  return;
  return;
}

function __ZN7cGrid2DIsED2Ev($this) {
  var $1 = $this + 8 | 0;
  var $2 = HEAP32[$1 >> 2];
  if (($2 | 0) != 0) {
    var $5 = $2;
    __ZdaPv($5);
    HEAP32[$1 >> 2] = 0;
  }
  return;
  return;
}

function __ZN11ShapeRect2DmIERKS_($this, $Vs) {
  var $25$s2;
  var $24$s2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 116;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 20;
  var $3 = __stackBase__ + 28;
  var $4 = __stackBase__ + 32;
  var $5 = __stackBase__ + 40;
  var $6 = __stackBase__ + 48;
  var $7 = __stackBase__ + 52;
  var $8 = __stackBase__ + 60;
  var $9 = __stackBase__ + 68;
  var $10 = __stackBase__ + 76;
  var $11 = __stackBase__ + 80;
  var $12 = __stackBase__ + 88;
  var $13 = __stackBase__ + 96;
  var $14 = __stackBase__ + 100;
  var $15 = __stackBase__ + 108;
  __ZNK11ShapeRect2D2P1Ev($4, $this);
  var $16 = $4 | 0;
  __ZNK11ShapeRect2D2P1Ev($5, $Vs);
  var $17 = $5 | 0;
  __ZNK4Real3MaxERKS_($3, $16, $17);
  __ZNK11ShapeRect2D2P1Ev($7, $this);
  var $18 = $7 + 4 | 0;
  __ZNK11ShapeRect2D2P1Ev($8, $Vs);
  var $19 = $8 + 4 | 0;
  __ZNK4Real3MaxERKS_($6, $18, $19);
  __ZN8Vector2DC1ERK4RealS2_($2, $3, $6);
  __ZNK11ShapeRect2D2P2Ev($11, $this);
  var $20 = $11 | 0;
  __ZNK11ShapeRect2D2P2Ev($12, $Vs);
  var $21 = $12 | 0;
  __ZNK4Real3MinERKS_($10, $20, $21);
  __ZNK11ShapeRect2D2P2Ev($14, $this);
  var $22 = $14 + 4 | 0;
  __ZNK11ShapeRect2D2P2Ev($15, $Vs);
  var $23 = $15 + 4 | 0;
  __ZNK4Real3MinERKS_($13, $22, $23);
  __ZN8Vector2DC1ERK4RealS2_($9, $10, $13);
  __ZN11ShapeRect2D5_PairERK8Vector2DS2_($1, $2, $9);
  var $24$s2 = ($this | 0) >> 2;
  var $25$s2 = ($1 | 0) >> 2;
  HEAP32[$24$s2] = HEAP32[$25$s2];
  HEAP32[$24$s2 + 1] = HEAP32[$25$s2 + 1];
  HEAP32[$24$s2 + 2] = HEAP32[$25$s2 + 2];
  HEAP32[$24$s2 + 3] = HEAP32[$25$s2 + 3];
  HEAP32[$24$s2 + 4] = HEAP32[$25$s2 + 4];
  STACKTOP = __stackBase__;
  return $this;
  return null;
}

function __ZN11ShapeRect2D5_PairERK8Vector2DS2_($agg_result, $_Vec1, $_Vec2) {
  __ZN11ShapeRect2DC1ERKbS1_RK8Vector2DS4_($agg_result, undef, undef, $_Vec1, $_Vec2);
  return;
  return;
}

function __ZNK4Real3MaxERKS_($agg_result, $this, $_Vs) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $Number = __stackBase__;
  var $3 = HEAPF32[$this >> 2];
  HEAPF32[$Number >> 2] = $3;
  var $4 = __ZNK4RealcvKfEv($Number);
  var $5 = __ZNK4RealcvKfEv($_Vs);
  if ($4 < $5) {
    var $10 = HEAPF32[$_Vs >> 2];
    HEAPF32[$agg_result >> 2] = $10;
  } else {
    HEAPF32[$agg_result >> 2] = $3;
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZNK11ShapeRect2D2P2Ev($agg_result, $this) {
  var $1 = $this + 4 | 0;
  var $2 = $this + 12 | 0;
  __ZN5boostplERK8Vector2DS2_($agg_result, $1, $2);
  return;
  return;
}

function __ZNK4Real3MinERKS_($agg_result, $this, $_Vs) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $Number = __stackBase__;
  var $3 = HEAPF32[$this >> 2];
  HEAPF32[$Number >> 2] = $3;
  var $4 = __ZNK4RealcvKfEv($Number);
  var $5 = __ZNK4RealcvKfEv($_Vs);
  if ($4 > $5) {
    var $10 = HEAPF32[$_Vs >> 2];
    HEAPF32[$agg_result >> 2] = $10;
  } else {
    HEAPF32[$agg_result >> 2] = $3;
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN5boostplERK8Vector2DS2_($agg_result, $lhs, $rhs) {
  var $1 = $lhs;
  var $2 = $agg_result;
  var $3$0 = HEAP32[$1 >> 2];
  var $3$1 = HEAP32[$1 + 4 >> 2];
  HEAP32[$2 >> 2] = $3$0;
  HEAP32[$2 + 4 >> 2] = $3$1;
  var $4 = __ZN8Vector2DpLERKS_($agg_result, $rhs);
  return;
  return;
}

function __ZN8Vector2DpLERKS_($this, $_Vs) {
  var $1 = $this | 0;
  var $2 = $_Vs | 0;
  var $3 = __ZN4RealpLERKS_($1, $2);
  var $4 = $this + 4 | 0;
  var $5 = $_Vs + 4 | 0;
  var $6 = __ZN4RealpLERKS_($4, $5);
  return $this;
  return null;
}

function __ZN11ShapeRect2DC1ERKbS1_RK8Vector2DS4_($this, $0, $1, $_Vec1, $_Vec2) {
  __ZN11ShapeRect2DC2ERKbS1_RK8Vector2DS4_($this, undef, undef, $_Vec1, $_Vec2);
  return;
  return;
}

function __ZN11ShapeRect2DC2ERKbS1_RK8Vector2DS4_($this, $0, $1, $_Vec1, $_Vec2) {
  var $4 = $_Vec1;
  var $5 = $this + 4 | 0;
  var $6$0 = HEAP32[$4 >> 2];
  var $6$1 = HEAP32[$4 + 4 >> 2];
  HEAP32[$5 >> 2] = $6$0;
  HEAP32[$5 + 4 >> 2] = $6$1;
  var $7 = $this + 12 | 0;
  __ZN5boostmiERK8Vector2DS2_($7, $_Vec2, $_Vec1);
  return;
  return;
}

function __ZNK7cGrid2DIsE5IndexEii($this, $_x, $_y) {
  var $1 = __ZNK7cGrid2DIsE5WidthEv($this);
  return $1 * $_y + $_x | 0;
  return null;
}

function __ZN8Vector2DmIERKS_($this, $_Vs) {
  var $1 = $this | 0;
  var $2 = $_Vs | 0;
  var $3 = __ZN4RealmIERKS_($1, $2);
  var $4 = $this + 4 | 0;
  var $5 = $_Vs + 4 | 0;
  var $6 = __ZN4RealmIERKS_($4, $5);
  return $this;
  return null;
}

function __ZNK4RealmiERKS_($agg_result, $this, $_Vs) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $1 = __stackBase__;
  var $6 = HEAPF32[$this >> 2] - HEAPF32[$_Vs >> 2];
  HEAPF32[$1 >> 2] = $6;
  __ZN4RealC1ERKf($agg_result, $1);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN11ShapeRect2DC1ERK8Vector2DS2_($this, $_Vec1, $_Vec2) {
  __ZN11ShapeRect2DC2ERK8Vector2DS2_($this, $_Vec1, $_Vec2);
  return;
  return;
}

function __ZNK4RealngEv($agg_result, $this) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $1 = __stackBase__;
  var $4 = -HEAPF32[$this >> 2];
  HEAPF32[$1 >> 2] = $4;
  __ZN4RealC1ERKf($agg_result, $1);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZNK11ShapeRect2D9HalfShapeEv($agg_result, $this) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 8;
  var $1 = __stackBase__;
  __ZNK11ShapeRect2D5ShapeEv($1, $this);
  __ZN5boostmlERK8Vector2DRK4Real($agg_result, $1, __ZN4Real4HalfE);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN5boostmlERK8Vector2DRK4Real($agg_result, $lhs, $rhs) {
  var $1 = $lhs;
  var $2 = $agg_result;
  var $3$0 = HEAP32[$1 >> 2];
  var $3$1 = HEAP32[$1 + 4 >> 2];
  HEAP32[$2 >> 2] = $3$0;
  HEAP32[$2 + 4 >> 2] = $3$1;
  var $4 = __ZN8Vector2DmLERK4Real($agg_result, $rhs);
  return;
  return;
}

function __ZN8Vector2DmLERK4Real($this, $_Vs) {
  var $1 = $this | 0;
  var $2 = __ZN4RealmLERKS_($1, $_Vs);
  var $3 = $this + 4 | 0;
  var $4 = __ZN4RealmLERKS_($3, $_Vs);
  return $this;
  return null;
}

function __ZN10PairRect2DC1ERK8Vector2DS2_($this, $_Vec1, $_Vec2) {
  __ZN10PairRect2DC2ERK8Vector2DS2_($this, $_Vec1, $_Vec2);
  return;
  return;
}

function __ZN10PairRect2DC2ERK8Vector2DS2_($this, $_Vec1, $_Vec2) {
  var $2 = $_Vec1;
  var $3 = $this + 4 | 0;
  var $4$0 = HEAP32[$2 >> 2];
  var $4$1 = HEAP32[$2 + 4 >> 2];
  HEAP32[$3 >> 2] = $4$0;
  HEAP32[$3 + 4 >> 2] = $4$1;
  var $5 = $this + 12 | 0;
  __ZN5boostplERK8Vector2DS2_($5, $_Vec1, $_Vec2);
  return;
  return;
}

function __ZNK4Real9MagnitudeEv($agg_result, $this) {
  __ZNK4Real3AbsEv($agg_result, $this);
  return;
  return;
}

function __ZNK4RealplERKS_($agg_result, $this, $_Vs) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $1 = __stackBase__;
  var $6 = HEAPF32[$this >> 2] + HEAPF32[$_Vs >> 2];
  HEAPF32[$1 >> 2] = $6;
  __ZN4RealC1ERKf($agg_result, $1);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN11ShapeRect2DC1Ev($this) {
  __ZN11ShapeRect2DC2Ev($this);
  return;
  return;
}

function __ZN11ShapeRect2DpLERKS_($this, $Vs) {
  var $25$s2;
  var $24$s2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 116;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 20;
  var $3 = __stackBase__ + 28;
  var $4 = __stackBase__ + 32;
  var $5 = __stackBase__ + 40;
  var $6 = __stackBase__ + 48;
  var $7 = __stackBase__ + 52;
  var $8 = __stackBase__ + 60;
  var $9 = __stackBase__ + 68;
  var $10 = __stackBase__ + 76;
  var $11 = __stackBase__ + 80;
  var $12 = __stackBase__ + 88;
  var $13 = __stackBase__ + 96;
  var $14 = __stackBase__ + 100;
  var $15 = __stackBase__ + 108;
  __ZNK11ShapeRect2D2P1Ev($4, $this);
  var $16 = $4 | 0;
  __ZNK11ShapeRect2D2P1Ev($5, $Vs);
  var $17 = $5 | 0;
  __ZNK4Real3MinERKS_($3, $16, $17);
  __ZNK11ShapeRect2D2P1Ev($7, $this);
  var $18 = $7 + 4 | 0;
  __ZNK11ShapeRect2D2P1Ev($8, $Vs);
  var $19 = $8 + 4 | 0;
  __ZNK4Real3MinERKS_($6, $18, $19);
  __ZN8Vector2DC1ERK4RealS2_($2, $3, $6);
  __ZNK11ShapeRect2D2P2Ev($11, $this);
  var $20 = $11 | 0;
  __ZNK11ShapeRect2D2P2Ev($12, $Vs);
  var $21 = $12 | 0;
  __ZNK4Real3MaxERKS_($10, $20, $21);
  __ZNK11ShapeRect2D2P2Ev($14, $this);
  var $22 = $14 + 4 | 0;
  __ZNK11ShapeRect2D2P2Ev($15, $Vs);
  var $23 = $15 + 4 | 0;
  __ZNK4Real3MaxERKS_($13, $22, $23);
  __ZN8Vector2DC1ERK4RealS2_($9, $10, $13);
  __ZN11ShapeRect2D5_PairERK8Vector2DS2_($1, $2, $9);
  var $24$s2 = ($this | 0) >> 2;
  var $25$s2 = ($1 | 0) >> 2;
  HEAP32[$24$s2] = HEAP32[$25$s2];
  HEAP32[$24$s2 + 1] = HEAP32[$25$s2 + 1];
  HEAP32[$24$s2 + 2] = HEAP32[$25$s2 + 2];
  HEAP32[$24$s2 + 3] = HEAP32[$25$s2 + 3];
  HEAP32[$24$s2 + 4] = HEAP32[$25$s2 + 4];
  STACKTOP = __stackBase__;
  return $this;
  return null;
}

function __ZN7cPlayer12CollectItemsEv($this) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 136;
  var $Rect = __stackBase__;
  var $1 = __stackBase__ + 20;
  var $2 = __stackBase__ + 24;
  var $3 = __stackBase__ + 28;
  var $4 = __stackBase__ + 32;
  var $5 = __stackBase__ + 36;
  var $6 = __stackBase__ + 44;
  var $7 = __stackBase__ + 52;
  var $8 = __stackBase__ + 60;
  var $VsRect = __stackBase__ + 68;
  var $9 = __stackBase__ + 88;
  var $10 = __stackBase__ + 96;
  var $11 = __stackBase__ + 100;
  var $12 = __stackBase__ + 104;
  var $13 = __stackBase__ + 108;
  var $14 = __stackBase__ + 112;
  var $15 = __stackBase__ + 120;
  var $16 = __stackBase__ + 124;
  var $17 = __stackBase__ + 128;
  var $18 = __stackBase__ + 132;
  HEAPF32[$2 >> 2] = 2;
  __ZN4RealC1ERKf($1, $2);
  HEAPF32[$4 >> 2] = 2;
  __ZN4RealC1ERKf($3, $4);
  __ZN7cPlayer11GetRectPlusE4RealS0_($Rect, $this, $1, $3);
  var $22 = HEAP32[HEAP32[_MapLayer >> 2] + 4 >> 2] - 1 | 0;
  __ZNK11ShapeRect2D2P1Ev($5, $Rect);
  var $23 = $5 | 0;
  var $24 = __ZNK4Real7ToFloatEv($23);
  var $floorf = _floorf($24);
  var $26 = ($floorf & -1) >> 3;
  __ZNK11ShapeRect2D2P1Ev($6, $Rect);
  var $27 = $6 + 4 | 0;
  var $28 = __ZNK4Real7ToFloatEv($27);
  var $floorf6 = _floorf($28);
  var $30 = ($floorf6 & -1) >> 3;
  __ZNK11ShapeRect2D2P2Ev($7, $Rect);
  var $31 = $7 | 0;
  var $32 = __ZNK4Real7ToFloatEv($31);
  var $ceilf = _ceilf($32);
  var $35 = ($ceilf & -1) + 8 >> 3 | 0;
  __ZNK11ShapeRect2D2P2Ev($8, $Rect);
  var $36 = $8 + 4 | 0;
  var $37 = __ZNK4Real7ToFloatEv($36);
  var $ceilf7 = _ceilf($37);
  var $40 = ($ceilf7 & -1) + 8 >> 3 | 0;
  var $43 = HEAP32[HEAP32[_MapLayer >> 2] + ($22 << 2) + 8 >> 2];
  var $44 = __ZNK7cGrid2DIsE5WidthEv($43);
  var $45 = __ZNK7cGrid2DIsE6HeightEv($43);
  var $StartX_0 = ($26 | 0) < 0 ? 0 : $26;
  var $StartY_0 = ($30 | 0) < 0 ? 0 : $30;
  var $EndX_0 = ($35 | 0) < 0 ? 0 : $35;
  var $EndY_0 = ($40 | 0) < 0 ? 0 : $40;
  var $50 = $44 - 1 | 0;
  var $StartX_0_ = ($StartX_0 | 0) < ($44 | 0) ? $StartX_0 : $50;
  var $53 = $45 - 1 | 0;
  var $StartY_1 = ($StartY_0 | 0) < ($45 | 0) ? $StartY_0 : $53;
  var $EndX_0_ = ($EndX_0 | 0) < ($44 | 0) ? $EndX_0 : $50;
  var $EndY_1 = ($EndY_0 | 0) < ($45 | 0) ? $EndY_0 : $53;
  var $56 = ($StartY_1 | 0) < ($EndY_1 | 0);
  $_$96 : do {
    if ($56) {
      var $57 = ($StartX_0_ | 0) < ($EndX_0_ | 0);
      var $58 = $this + 64 | 0;
      var $59 = $this + 68 | 0;
      var $_y_09 = $StartY_1;
      while (1) {
        var $_y_09;
        $_$100 : do {
          if ($57) {
            var $61 = $_y_09 << 3 | 0;
            var $_x_08 = $StartX_0_;
            while (1) {
              var $_x_08;
              var $64 = HEAP32[HEAP32[_MapLayer >> 2] + ($22 << 2) + 8 >> 2];
              var $65 = __ZN7cGrid2DIsEclEjj($64, $_x_08, $_y_09);
              var $66 = HEAPU16[$65 >> 1];
              var $67 = ($66 - 1859 & 65535 & 65535) < 4;
              do {
                if ($67) {
                  HEAPF32[$11 >> 2] = $_x_08 << 3 | 0;
                  __ZN4RealC1ERKf($10, $11);
                  HEAPF32[$13 >> 2] = $61;
                  __ZN4RealC1ERKf($12, $13);
                  __ZN8Vector2DC1ERK4RealS2_($9, $10, $12);
                  HEAPF32[$16 >> 2] = 8;
                  __ZN4RealC1ERKf($15, $16);
                  HEAPF32[$18 >> 2] = 8;
                  __ZN4RealC1ERKf($17, $18);
                  __ZN8Vector2DC1ERK4RealS2_($14, $15, $17);
                  __ZN11ShapeRect2DC1ERK8Vector2DS2_($VsRect, $9, $14);
                  var $71 = __ZNK11ShapeRect2DeqERKS_($Rect, $VsRect);
                  if (!$71) {
                    break;
                  }
                  var $75 = HEAP32[HEAP32[_MapLayer >> 2] + ($22 << 2) + 8 >> 2];
                  var $76 = __ZN7cGrid2DIsEclEjj($75, $_x_08, $_y_09);
                  HEAP16[$76 >> 1] = 0;
                  if ($66 << 16 >> 16 == 1861 || $66 << 16 >> 16 == 1859) {
                    var $78 = _sndPlay(STRING_TABLE.__str18 | 0);
                    var $80 = HEAP32[$58 >> 2] + 1 | 0;
                    HEAP32[$58 >> 2] = $80;
                    if (($80 | 0) != (HEAP32[_TotalStarsInMap >> 2] | 0)) {
                      break;
                    }
                    var $84 = _sndPlay(STRING_TABLE.__str8 | 0);
                  } else if ($66 << 16 >> 16 == 1862 || $66 << 16 >> 16 == 1860) {
                    var $86 = _sndPlay(STRING_TABLE.__str19 | 0);
                    var $88 = HEAP32[$59 >> 2] + 1 | 0;
                    HEAP32[$59 >> 2] = $88;
                  } else {
                    break;
                  }
                }
              } while (0);
              var $90 = $_x_08 + 1 | 0;
              if (($90 | 0) == ($EndX_0_ | 0)) {
                break $_$100;
              }
              var $_x_08 = $90;
            }
          }
        } while (0);
        var $91 = $_y_09 + 1 | 0;
        if (($91 | 0) == ($EndY_1 | 0)) {
          break $_$96;
        }
        var $_y_09 = $91;
      }
    }
  } while (0);
  STACKTOP = __stackBase__;
  return;
  return;
}

__ZN7cPlayer12CollectItemsEv["X"] = 1;

function _cJSON_GetErrorPtr() {
  return HEAP32[_ep >> 2];
  return null;
}

function __ZN4RealC2ERKf($this, $_Data) {
  var $2 = HEAPF32[$_Data >> 2];
  HEAPF32[$this >> 2] = $2;
  return;
  return;
}

function __ZN4RealC2Ev($this) {
  HEAPF32[$this >> 2] = 0;
  return;
  return;
}

function __ZN8Vector3DC2ERK4RealS2_S2_($this, $_x, $_y, $_z) {
  var $3 = HEAP32[$_x >> 2];
  HEAP32[$this >> 2] = $3;
  var $6 = HEAPF32[$_y >> 2];
  HEAPF32[$this + 4 >> 2] = $6;
  var $9 = HEAPF32[$_z >> 2];
  HEAPF32[$this + 8 >> 2] = $9;
  return;
  return;
}

function _cJSON_InitHooks($hooks) {
  if (($hooks | 0) == 0) {
    HEAP32[_cJSON_malloc >> 2] = 2;
    var $storemerge = 4;
  } else {
    var $5 = HEAP32[$hooks >> 2];
    var $7 = ($5 | 0) == 0 ? 2 : $5;
    HEAP32[_cJSON_malloc >> 2] = $7;
    var $9 = HEAP32[$hooks + 4 >> 2];
    var $11 = ($9 | 0) == 0 ? 4 : $9;
    var $storemerge = $11;
  }
  var $storemerge;
  HEAP32[_cJSON_free >> 2] = $storemerge;
  return;
  return;
}

function __ZN7cPlayer16CanTransformHereEv($this) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 136;
  var $Rect = __stackBase__;
  var $1 = __stackBase__ + 20;
  var $2 = __stackBase__ + 24;
  var $3 = __stackBase__ + 28;
  var $4 = __stackBase__ + 32;
  var $5 = __stackBase__ + 36;
  var $6 = __stackBase__ + 44;
  var $7 = __stackBase__ + 52;
  var $8 = __stackBase__ + 60;
  var $VsRect = __stackBase__ + 68;
  var $9 = __stackBase__ + 88;
  var $10 = __stackBase__ + 96;
  var $11 = __stackBase__ + 100;
  var $12 = __stackBase__ + 104;
  var $13 = __stackBase__ + 108;
  var $14 = __stackBase__ + 112;
  var $15 = __stackBase__ + 120;
  var $16 = __stackBase__ + 124;
  var $17 = __stackBase__ + 128;
  var $18 = __stackBase__ + 132;
  HEAPF32[$2 >> 2] = 14;
  __ZN4RealC1ERKf($1, $2);
  HEAPF32[$4 >> 2] = 28;
  __ZN4RealC1ERKf($3, $4);
  __ZN7cPlayer7GetRectE4RealS0_($Rect, $this, $1, $3);
  var $22 = HEAP32[HEAP32[_MapLayer >> 2] + 4 >> 2] - 2 | 0;
  __ZNK11ShapeRect2D2P1Ev($5, $Rect);
  var $23 = $5 | 0;
  var $24 = __ZNK4Real7ToFloatEv($23);
  var $floorf = _floorf($24);
  var $26 = ($floorf & -1) >> 3;
  __ZNK11ShapeRect2D2P1Ev($6, $Rect);
  var $27 = $6 + 4 | 0;
  var $28 = __ZNK4Real7ToFloatEv($27);
  var $floorf2 = _floorf($28);
  var $30 = ($floorf2 & -1) >> 3;
  __ZNK11ShapeRect2D2P2Ev($7, $Rect);
  var $31 = $7 | 0;
  var $32 = __ZNK4Real7ToFloatEv($31);
  var $ceilf = _ceilf($32);
  var $35 = ($ceilf & -1) + 8 >> 3 | 0;
  __ZNK11ShapeRect2D2P2Ev($8, $Rect);
  var $36 = $8 + 4 | 0;
  var $37 = __ZNK4Real7ToFloatEv($36);
  var $ceilf3 = _ceilf($37);
  var $40 = ($ceilf3 & -1) + 8 >> 3 | 0;
  var $43 = HEAP32[HEAP32[_MapLayer >> 2] + ($22 << 2) + 8 >> 2];
  var $44 = __ZNK7cGrid2DIsE5WidthEv($43);
  var $45 = __ZNK7cGrid2DIsE6HeightEv($43);
  var $StartX_0 = ($26 | 0) < 0 ? 0 : $26;
  var $StartY_0 = ($30 | 0) < 0 ? 0 : $30;
  var $EndX_0 = ($35 | 0) < 0 ? 0 : $35;
  var $EndY_0 = ($40 | 0) < 0 ? 0 : $40;
  var $50 = $44 - 1 | 0;
  var $StartX_0_ = ($StartX_0 | 0) < ($44 | 0) ? $StartX_0 : $50;
  var $53 = $45 - 1 | 0;
  var $StartY_1 = ($StartY_0 | 0) < ($45 | 0) ? $StartY_0 : $53;
  var $EndX_0_ = ($EndX_0 | 0) < ($44 | 0) ? $EndX_0 : $50;
  var $EndY_1 = ($EndY_0 | 0) < ($45 | 0) ? $EndY_0 : $53;
  var $56 = $this + 48 | 0;
  var $58 = HEAP8[$56] & 1;
  HEAP8[$this + 49 | 0] = $58;
  HEAP8[$56] = 0;
  var $_y_0 = $StartY_1;
  $_$2 : while (1) {
    var $_y_0;
    if (($_y_0 | 0) >= ($EndY_1 | 0)) {
      var $_0 = 1;
      break;
    }
    var $63 = $_y_0 << 3 | 0;
    var $_x_0 = $StartX_0_;
    while (1) {
      var $_x_0;
      if (($_x_0 | 0) >= ($EndX_0_ | 0)) {
        break;
      }
      var $69 = HEAP32[HEAP32[_MapLayer >> 2] + ($22 << 2) + 8 >> 2];
      var $70 = __ZN7cGrid2DIsEclEjj($69, $_x_0, $_y_0);
      if ((HEAP16[$70 >> 1] - 1857 & 65535 & 65535) < 2) {
        HEAPF32[$11 >> 2] = $_x_0 << 3 | 0;
        __ZN4RealC1ERKf($10, $11);
        HEAPF32[$13 >> 2] = $63;
        __ZN4RealC1ERKf($12, $13);
        __ZN8Vector2DC1ERK4RealS2_($9, $10, $12);
        HEAPF32[$16 >> 2] = 8;
        __ZN4RealC1ERKf($15, $16);
        HEAPF32[$18 >> 2] = 8;
        __ZN4RealC1ERKf($17, $18);
        __ZN8Vector2DC1ERK4RealS2_($14, $15, $17);
        __ZN11ShapeRect2DC1ERK8Vector2DS2_($VsRect, $9, $14);
        var $76 = __ZNK11ShapeRect2DeqERKS_($Rect, $VsRect);
        if ($76) {
          var $_0 = 0;
          break $_$2;
        }
      }
      var $_x_0 = $_x_0 + 1 | 0;
    }
    var $_y_0 = $_y_0 + 1 | 0;
  }
  var $_0;
  STACKTOP = __stackBase__;
  return $_0;
  return null;
}

__ZN7cPlayer16CanTransformHereEv["X"] = 1;

function __ZN7cPlayer6SetBigEbb($this, $_IsBig, $_SetAnimation) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 32;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 4;
  var $3 = __stackBase__ + 8;
  var $4 = __stackBase__ + 12;
  var $5 = __stackBase__ + 16;
  var $6 = __stackBase__ + 20;
  var $7 = __stackBase__ + 24;
  var $8 = __stackBase__ + 28;
  HEAP8[$this + 61 | 0] = $_IsBig & 1;
  var $11 = $this + 40 | 0;
  do {
    if ($_IsBig) {
      HEAPF32[$2 >> 2] = 14;
      __ZN4RealC1ERKf($1, $2);
      var $15 = HEAP32[$1 >> 2];
      HEAP32[$11 >> 2] = $15;
      HEAPF32[$4 >> 2] = 28;
      __ZN4RealC1ERKf($3, $4);
      var $18 = HEAPF32[$3 >> 2];
      HEAPF32[$this + 44 >> 2] = $18;
      if (!$_SetAnimation) {
        break;
      }
      __ZN7cPlayer12SetAnimationEPKi($this, __ZL9Nook_Idle | 0);
      __ZN7cPlayer24SetIntermediateAnimationEPKi($this, __ZL17Nook_Sm_Transform | 0);
    } else {
      HEAPF32[$6 >> 2] = 6;
      __ZN4RealC1ERKf($5, $6);
      var $23 = HEAP32[$5 >> 2];
      HEAP32[$11 >> 2] = $23;
      HEAPF32[$8 >> 2] = 6;
      __ZN4RealC1ERKf($7, $8);
      var $26 = HEAPF32[$7 >> 2];
      HEAPF32[$this + 44 >> 2] = $26;
      if (!$_SetAnimation) {
        break;
      }
      __ZN7cPlayer12SetAnimationEPKi($this, __ZL12Nook_Sm_Idle | 0);
      __ZN7cPlayer24SetIntermediateAnimationEPKi($this, __ZL14Nook_Transform | 0);
    }
  } while (0);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN7cPlayer7GetRectE4RealS0_($agg_result, $this, $ForcedWidth, $ForcedHeight) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 28;
  var tempParam = $ForcedWidth;
  $ForcedWidth = STACKTOP;
  STACKTOP += 4;
  HEAP32[$ForcedWidth >> 2] = HEAP32[tempParam >> 2];
  var tempParam = $ForcedHeight;
  $ForcedHeight = STACKTOP;
  STACKTOP += 4;
  HEAP32[$ForcedHeight >> 2] = HEAP32[tempParam >> 2];
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 8;
  var $3 = __stackBase__ + 16;
  var $4 = __stackBase__ + 20;
  var $5 = $this | 0;
  __ZNK4RealmlERKS_($3, $ForcedWidth, __ZN4Real4HalfE);
  __ZN8Vector2DC1ERK4RealS2_($2, $3, $ForcedHeight);
  __ZN5boostmiERK8Vector2DS2_($1, $5, $2);
  __ZN8Vector2DC1ERK4RealS2_($4, $ForcedWidth, $ForcedHeight);
  __ZN11ShapeRect2DC1ERK8Vector2DS2_($agg_result, $1, $4);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN7cPlayer11GetRectPlusE4RealS0_($agg_result, $this, $_w, $_h) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 44;
  var tempParam = $_w;
  $_w = STACKTOP;
  STACKTOP += 4;
  HEAP32[$_w >> 2] = HEAP32[tempParam >> 2];
  var tempParam = $_h;
  $_h = STACKTOP;
  STACKTOP += 4;
  HEAP32[$_h >> 2] = HEAP32[tempParam >> 2];
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 8;
  var $3 = __stackBase__ + 16;
  var $4 = __stackBase__ + 20;
  var $5 = __stackBase__ + 24;
  var $6 = __stackBase__ + 28;
  var $7 = __stackBase__ + 36;
  var $8 = $this | 0;
  var $9 = $this + 40 | 0;
  var $10 = $9 | 0;
  __ZNK4RealplERKS_($4, $10, $_w);
  __ZNK4RealmlERKS_($3, $4, __ZN4Real4HalfE);
  var $11 = $this + 44 | 0;
  __ZNK4RealplERKS_($5, $11, $_h);
  __ZN8Vector2DC1ERK4RealS2_($2, $3, $5);
  __ZN5boostmiERK8Vector2DS2_($1, $8, $2);
  __ZN8Vector2DC1ERK4RealS2_($7, $_w, $_h);
  __ZN5boostplERK8Vector2DS2_($6, $9, $7);
  __ZN11ShapeRect2DC1ERK8Vector2DS2_($agg_result, $1, $6);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN11ShapeRect2DC2Ev($this) {
  var $1 = $this + 4 | 0;
  __ZN8Vector2DC1Ev($1);
  var $2 = $this + 12 | 0;
  __ZN8Vector2DC1Ev($2);
  return;
  return;
}

function __ZNK4Real3AbsEv($agg_result, $this) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $1 = __stackBase__;
  var $2 = $this | 0;
  var $3 = HEAPF32[$2 >> 2];
  var $4 = __ZNK4RealcvKfEv(__ZN4Real4ZeroE);
  if ($3 < $4) {
    var $7 = -$3;
    HEAPF32[$1 >> 2] = $7;
    __ZN4RealC1ERKf($agg_result, $1);
  } else {
    __ZN4RealC1ERKf($agg_result, $2);
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN7cPlayerC2Eff($this, $_x, $_y) {
  var $this$s2 = $this >> 2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 40;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 4;
  var $3 = __stackBase__ + 8;
  var $4 = __stackBase__ + 12;
  var $5 = __stackBase__ + 16;
  var $6 = __stackBase__ + 20;
  var $7 = __stackBase__ + 24;
  var $8 = __stackBase__ + 28;
  var $9 = __stackBase__ + 32;
  var $10 = __stackBase__ + 36;
  HEAPF32[$1 >> 2] = $_x;
  HEAPF32[$2 >> 2] = $_y;
  var $11 = $this | 0;
  __ZN4RealC1ERKf($3, $1);
  __ZN4RealC1ERKf($4, $2);
  __ZN8Vector2DC1ERK4RealS2_($11, $3, $4);
  var $12 = $this + 8 | 0;
  __ZN4RealC1ERKf($5, $1);
  __ZN4RealC1ERKf($6, $2);
  __ZN8Vector2DC1ERK4RealS2_($12, $5, $6);
  var $13 = $this + 32 | 0;
  __ZN8Vector2DC1Ev($13);
  var $14 = $this + 40 | 0;
  __ZN8Vector2DC1Ev($14);
  HEAP32[$this$s2 + 4] = __ZL9Nook_Idle | 0;
  HEAP32[$this$s2 + 5] = 0;
  HEAP32[$this$s2 + 6] = 0;
  HEAP32[$this$s2 + 7] = 0;
  HEAPF32[$8 >> 2] = 32;
  __ZN4RealC1ERKf($7, $8);
  var $21 = HEAP32[$7 >> 2];
  HEAP32[$13 >> 2] = $21;
  HEAPF32[$10 >> 2] = 64;
  __ZN4RealC1ERKf($9, $10);
  var $24 = HEAPF32[$9 >> 2];
  HEAPF32[$this$s2 + 9] = $24;
  var $25 = $this + 48 | 0;
  HEAP32[$this$s2 + 14] = 0;
  HEAP8[$this + 60 | 0] = 0;
  var $28 = $this + 64 | 0;
  HEAP8[$25] = 0;
  HEAP8[$25 + 1] = 0;
  HEAP8[$25 + 2] = 0;
  HEAP8[$25 + 3] = 0;
  HEAP8[$25 + 4] = 0;
  HEAP8[$25 + 5] = 0;
  var $29 = $28;
  for (var $$dest = $29 >> 2, $$stop = $$dest + 11; $$dest < $$stop; $$dest++) {
    HEAP32[$$dest] = 0;
  }
  __ZN7cPlayer6SetBigEbb($this, 1, 0);
  STACKTOP = __stackBase__;
  return;
  return;
}

__ZN7cPlayerC2Eff["X"] = 1;

function __ZN5cExitC2Eff($this, $_x, $_y) {
  var $this$s2 = $this >> 2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 48;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 4;
  var $3 = __stackBase__ + 8;
  var $4 = __stackBase__ + 12;
  var $5 = __stackBase__ + 16;
  var $6 = __stackBase__ + 20;
  var $7 = __stackBase__ + 24;
  var $8 = __stackBase__ + 28;
  var $9 = __stackBase__ + 32;
  var $10 = __stackBase__ + 36;
  var $11 = __stackBase__ + 40;
  var $12 = __stackBase__ + 44;
  HEAPF32[$1 >> 2] = $_x;
  HEAPF32[$2 >> 2] = $_y;
  var $13 = $this | 0;
  __ZN4RealC1ERKf($3, $1);
  __ZN4RealC1ERKf($4, $2);
  __ZN8Vector2DC1ERK4RealS2_($13, $3, $4);
  var $14 = $this + 24 | 0;
  __ZN8Vector2DC1Ev($14);
  var $15 = $this + 32 | 0;
  __ZN8Vector2DC1Ev($15);
  HEAP32[$this$s2 + 2] = __ZL11Exit_Closed | 0;
  HEAP32[$this$s2 + 3] = 0;
  HEAP32[$this$s2 + 4] = 0;
  HEAP32[$this$s2 + 5] = 0;
  HEAPF32[$6 >> 2] = 32;
  __ZN4RealC1ERKf($5, $6);
  var $22 = HEAP32[$5 >> 2];
  HEAP32[$14 >> 2] = $22;
  HEAPF32[$8 >> 2] = 64;
  __ZN4RealC1ERKf($7, $8);
  var $25 = HEAPF32[$7 >> 2];
  HEAPF32[$this$s2 + 7] = $25;
  HEAPF32[$10 >> 2] = 4;
  __ZN4RealC1ERKf($9, $10);
  var $28 = HEAP32[$9 >> 2];
  HEAP32[$15 >> 2] = $28;
  HEAPF32[$12 >> 2] = 8;
  __ZN4RealC1ERKf($11, $12);
  var $31 = HEAPF32[$11 >> 2];
  HEAPF32[$this$s2 + 9] = $31;
  HEAP8[$this + 40 | 0] = 0;
  HEAP8[$this + 41 | 0] = 0;
  STACKTOP = __stackBase__;
  return;
  return;
}

__ZN5cExitC2Eff["X"] = 1;

function __ZN5cDoorC2Eff($this, $_x, $_y) {
  var $this$s2 = $this >> 2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 48;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 4;
  var $3 = __stackBase__ + 8;
  var $4 = __stackBase__ + 12;
  var $5 = __stackBase__ + 16;
  var $6 = __stackBase__ + 20;
  var $7 = __stackBase__ + 24;
  var $8 = __stackBase__ + 28;
  var $9 = __stackBase__ + 32;
  var $10 = __stackBase__ + 36;
  var $11 = __stackBase__ + 40;
  var $12 = __stackBase__ + 44;
  HEAPF32[$1 >> 2] = $_x;
  HEAPF32[$2 >> 2] = $_y;
  var $13 = $this | 0;
  __ZN4RealC1ERKf($3, $1);
  __ZN4RealC1ERKf($4, $2);
  __ZN8Vector2DC1ERK4RealS2_($13, $3, $4);
  var $14 = $this + 24 | 0;
  __ZN8Vector2DC1Ev($14);
  var $15 = $this + 32 | 0;
  __ZN8Vector2DC1Ev($15);
  HEAP32[$this$s2 + 2] = __ZL11Door_Closed | 0;
  HEAP32[$this$s2 + 3] = 0;
  HEAP32[$this$s2 + 4] = 0;
  HEAP32[$this$s2 + 5] = 0;
  HEAPF32[$6 >> 2] = 32;
  __ZN4RealC1ERKf($5, $6);
  var $22 = HEAP32[$5 >> 2];
  HEAP32[$14 >> 2] = $22;
  HEAPF32[$8 >> 2] = 64;
  __ZN4RealC1ERKf($7, $8);
  var $25 = HEAPF32[$7 >> 2];
  HEAPF32[$this$s2 + 7] = $25;
  HEAPF32[$10 >> 2] = 8;
  __ZN4RealC1ERKf($9, $10);
  var $28 = HEAP32[$9 >> 2];
  HEAP32[$15 >> 2] = $28;
  HEAPF32[$12 >> 2] = 64;
  __ZN4RealC1ERKf($11, $12);
  var $31 = HEAPF32[$11 >> 2];
  HEAPF32[$this$s2 + 9] = $31;
  HEAP8[$this + 40 | 0] = 0;
  HEAP8[$this + 41 | 0] = 0;
  STACKTOP = __stackBase__;
  return;
  return;
}

__ZN5cDoorC2Eff["X"] = 1;

function __ZN8Vector2DC2Ev($this) {
  var $1 = $this | 0;
  __ZN4RealC1Ev($1);
  var $2 = $this + 4 | 0;
  __ZN4RealC1Ev($2);
  return;
  return;
}

function __ZN4RealC1Ev($this) {
  __ZN4RealC2Ev($this);
  return;
  return;
}

function __ZN4Real6RandomEv($agg_result) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $1 = __stackBase__;
  var $2 = _rand();
  HEAPF32[$1 >> 2] = ($2 | 0) * 4.656612873077393e-10;
  __ZN4RealC1ERKf($agg_result, $1);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __Z14LogIndentationic($Count, $Val) {
  if (($Count | 0) > 0) {
    var $3 = $Count + 1 | 0;
    var $4 = _llvm_stacksave();
    var $5 = STACKTOP;
    STACKTOP += $3;
    STACKTOP = STACKTOP + 3 >> 2 << 2;
    _memset($5, $Val, $Count, 1);
    HEAP8[$5 + $Count | 0] = 0;
    var $7 = _printf($5, (tempInt = STACKTOP, STACKTOP += 1, STACKTOP = STACKTOP + 3 >> 2 << 2, HEAP32[tempInt >> 2] = 0, tempInt));
    _llvm_stackrestore($4);
  }
  return;
  return;
}

function __Z6PreLogPKc($s) {
  var $1 = HEAP8[$s];
  var $2 = $1 << 24 >> 24 == 0;
  do {
    if (!$2) {
      if (HEAP8[$s + 1 | 0] << 24 >> 24 != 32) {
        break;
      }
      if ($1 << 24 >> 24 == 42) {
        var $9 = HEAP32[_CurrentLogIndentation >> 2];
        __Z14LogIndentationic($9, 32);
        var $11 = HEAP8[$s];
      } else {
        var $11 = $1;
      }
      var $11;
      if ($11 << 24 >> 24 == 62) {
        var $14 = HEAP32[_CurrentLogIndentation >> 2];
        __Z14LogIndentationic($14, 62);
        var $16 = HEAP8[$s];
      } else {
        var $16 = $11;
      }
      var $16;
      if ($16 << 24 >> 24 == 33) {
        var $18 = HEAP32[_CurrentLogIndentation >> 2];
        __Z14LogIndentationic($18, 33);
      } else if ($16 << 24 >> 24 == 43) {
        var $20 = HEAP32[_CurrentLogIndentation >> 2];
        __Z14LogIndentationic($20, 32);
        var $22 = HEAP32[_CurrentLogIndentation >> 2] + 1 | 0;
        HEAP32[_CurrentLogIndentation >> 2] = $22;
      } else if ($16 << 24 >> 24 == 45) {
        var $25 = HEAP32[_CurrentLogIndentation >> 2] - 1 | 0;
        HEAP32[_CurrentLogIndentation >> 2] = $25;
        __Z14LogIndentationic($25, 32);
      } else {
        break;
      }
    }
  } while (0);
  return;
  return;
}

function __Z9LogAlwaysPKcz($s) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $vl = __stackBase__;
  HEAP32[$vl >> 2] = arguments[__Z9LogAlwaysPKcz.length];
  __Z6PreLogPKc($s);
  var $2 = HEAP32[$vl >> 2];
  var $3 = _printf($s, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $2, tempInt));
  var $putchar = _putchar(10);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __Z10_LogAlwaysPKcz($s) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $vl = __stackBase__;
  HEAP32[$vl >> 2] = arguments[__Z10_LogAlwaysPKcz.length];
  __Z6PreLogPKc($s);
  var $2 = HEAP32[$vl >> 2];
  var $3 = _printf($s, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $2, tempInt));
  STACKTOP = __stackBase__;
  return;
  return;
}

function __Z3LogPKcz($s) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $vl = __stackBase__;
  if ((HEAP32[_LogLevel >> 2] | 0) > 0) {
    HEAP32[$vl >> 2] = arguments[__Z3LogPKcz.length];
    __Z6PreLogPKc($s);
    var $5 = HEAP32[$vl >> 2];
    var $6 = _printf($s, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $5, tempInt));
    var $putchar = _putchar(10);
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function __Z4VLogPKcz($s) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $vl = __stackBase__;
  if ((HEAP32[_LogLevel >> 2] | 0) > 1) {
    HEAP32[$vl >> 2] = arguments[__Z4VLogPKcz.length];
    __Z6PreLogPKc($s);
    var $5 = HEAP32[$vl >> 2];
    var $6 = _printf($s, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $5, tempInt));
    var $putchar = _putchar(10);
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function __Z5VVLogPKcz($s) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $vl = __stackBase__;
  if ((HEAP32[_LogLevel >> 2] | 0) > 2) {
    HEAP32[$vl >> 2] = arguments[__Z5VVLogPKcz.length];
    __Z6PreLogPKc($s);
    var $5 = HEAP32[$vl >> 2];
    var $6 = _printf($s, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $5, tempInt));
    var $putchar = _putchar(10);
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function __Z6VVVLogPKcz($s) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $vl = __stackBase__;
  if ((HEAP32[_LogLevel >> 2] | 0) > 3) {
    HEAP32[$vl >> 2] = arguments[__Z6VVVLogPKcz.length];
    __Z6PreLogPKc($s);
    var $5 = HEAP32[$vl >> 2];
    var $6 = _printf($s, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $5, tempInt));
    var $putchar = _putchar(10);
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function __Z4_LogPKcz($s) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $vl = __stackBase__;
  if ((HEAP32[_LogLevel >> 2] | 0) > 0) {
    HEAP32[$vl >> 2] = arguments[__Z4_LogPKcz.length];
    __Z6PreLogPKc($s);
    var $5 = HEAP32[$vl >> 2];
    var $6 = _printf($s, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $5, tempInt));
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function __Z5_VLogPKcz($s) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $vl = __stackBase__;
  if ((HEAP32[_LogLevel >> 2] | 0) > 1) {
    HEAP32[$vl >> 2] = arguments[__Z5_VLogPKcz.length];
    __Z6PreLogPKc($s);
    var $5 = HEAP32[$vl >> 2];
    var $6 = _printf($s, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $5, tempInt));
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function __Z6_VVLogPKcz($s) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $vl = __stackBase__;
  if ((HEAP32[_LogLevel >> 2] | 0) > 2) {
    HEAP32[$vl >> 2] = arguments[__Z6_VVLogPKcz.length];
    __Z6PreLogPKc($s);
    var $5 = HEAP32[$vl >> 2];
    var $6 = _printf($s, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $5, tempInt));
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function __Z7_VVVLogPKcz($s) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $vl = __stackBase__;
  if ((HEAP32[_LogLevel >> 2] | 0) > 3) {
    HEAP32[$vl >> 2] = arguments[__Z7_VVVLogPKcz.length];
    __Z6PreLogPKc($s);
    var $5 = HEAP32[$vl >> 2];
    var $6 = _printf($s, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $5, tempInt));
  }
  STACKTOP = __stackBase__;
  return;
  return;
}

function ___cxx_global_var_init22() {
  var __stackBase__ = STACKTOP;
  STACKTOP += 24;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 4;
  var $3 = __stackBase__ + 8;
  var $4 = __stackBase__ + 12;
  var $5 = __stackBase__ + 16;
  var $6 = __stackBase__ + 20;
  HEAPF32[$2 >> 2] = 1;
  __ZN4RealC1ERKf($1, $2);
  HEAPF32[$4 >> 2] = 1;
  __ZN4RealC1ERKf($3, $4);
  HEAPF32[$6 >> 2] = 1;
  __ZN4RealC1ERKf($5, $6);
  __ZN8Vector3DC1ERK4RealS2_S2_(__ZN8Vector3D8IdentityE, $1, $3, $5);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __ZN8Vector3DC1ERK4RealS2_S2_($this, $_x, $_y, $_z) {
  __ZN8Vector3DC2ERK4RealS2_S2_($this, $_x, $_y, $_z);
  return;
  return;
}

function ___cxx_global_var_init123() {
  var __stackBase__ = STACKTOP;
  STACKTOP += 24;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 4;
  var $3 = __stackBase__ + 8;
  var $4 = __stackBase__ + 12;
  var $5 = __stackBase__ + 16;
  var $6 = __stackBase__ + 20;
  HEAPF32[$2 >> 2] = 1;
  __ZN4RealC1ERKf($1, $2);
  HEAPF32[$4 >> 2] = 1;
  __ZN4RealC1ERKf($3, $4);
  HEAPF32[$6 >> 2] = 1;
  __ZN4RealC1ERKf($5, $6);
  __ZN8Vector3DC1ERK4RealS2_S2_(__ZN8Vector3D3OneE, $1, $3, $5);
  STACKTOP = __stackBase__;
  return;
  return;
}

function ___cxx_global_var_init224() {
  var __stackBase__ = STACKTOP;
  STACKTOP += 24;
  var $1 = __stackBase__;
  var $2 = __stackBase__ + 4;
  var $3 = __stackBase__ + 8;
  var $4 = __stackBase__ + 12;
  var $5 = __stackBase__ + 16;
  var $6 = __stackBase__ + 20;
  HEAPF32[$2 >> 2] = 0;
  __ZN4RealC1ERKf($1, $2);
  HEAPF32[$4 >> 2] = 0;
  __ZN4RealC1ERKf($3, $4);
  HEAPF32[$6 >> 2] = 0;
  __ZN4RealC1ERKf($5, $6);
  __ZN8Vector3DC1ERK4RealS2_S2_(__ZN8Vector3D4ZeroE, $1, $3, $5);
  STACKTOP = __stackBase__;
  return;
  return;
}

function __GLOBAL__I_a25() {
  ___cxx_global_var_init22();
  ___cxx_global_var_init123();
  ___cxx_global_var_init224();
  return;
  return;
}

function _cJSON_Delete($c) {
  var $_01$s2;
  var $1 = ($c | 0) == 0;
  $_$102 : do {
    if (!$1) {
      var $_01 = $c, $_01$s2 = $_01 >> 2;
      while (1) {
        var $_01;
        var $3 = HEAP32[$_01$s2];
        var $4 = $_01 + 12 | 0;
        var $5 = HEAP32[$4 >> 2];
        var $7 = ($5 & 256 | 0) == 0;
        do {
          if ($7) {
            var $10 = HEAP32[$_01$s2 + 2];
            if (($10 | 0) == 0) {
              var $14 = $5;
              break;
            }
            _cJSON_Delete($10);
            var $14 = HEAP32[$4 >> 2];
          } else {
            var $14 = $5;
          }
        } while (0);
        var $14;
        var $16 = ($14 & 256 | 0) == 0;
        do {
          if ($16) {
            var $19 = HEAP32[$_01$s2 + 4];
            if (($19 | 0) == 0) {
              break;
            }
            var $22 = HEAP32[_cJSON_free >> 2];
            FUNCTION_TABLE[$22]($19);
          }
        } while (0);
        var $25 = HEAP32[$_01$s2 + 8];
        if (($25 | 0) != 0) {
          var $28 = HEAP32[_cJSON_free >> 2];
          FUNCTION_TABLE[$28]($25);
        }
        var $30 = HEAP32[_cJSON_free >> 2];
        FUNCTION_TABLE[$30]($_01);
        if (($3 | 0) == 0) {
          break $_$102;
        }
        var $_01 = $3, $_01$s2 = $_01 >> 2;
      }
    }
  } while (0);
  return;
  return;
}

function _cJSON_Parse($value) {
  var $1 = _cJSON_New_Item();
  HEAP32[_ep >> 2] = 0;
  var $2 = ($1 | 0) == 0;
  do {
    if ($2) {
      var $_0 = 0;
    } else {
      var $4 = _skip($value);
      var $5 = _parse_value($1, $4);
      if (($5 | 0) != 0) {
        var $_0 = $1;
        break;
      }
      _cJSON_Delete($1);
      var $_0 = 0;
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

function _parse_value($item, $value) {
  var $1 = ($value | 0) == 0;
  $_$123 : do {
    if ($1) {
      var $_0 = 0;
    } else {
      var $3 = _strncmp($value, STRING_TABLE.__str26 | 0, 4);
      if (($3 | 0) == 0) {
        HEAP32[$item + 12 >> 2] = 2;
        var $_0 = $value + 4 | 0;
      } else {
        var $9 = _strncmp($value, STRING_TABLE.__str127 | 0, 5);
        if (($9 | 0) == 0) {
          HEAP32[$item + 12 >> 2] = 0;
          var $_0 = $value + 5 | 0;
        } else {
          var $15 = _strncmp($value, STRING_TABLE.__str228 | 0, 4);
          if (($15 | 0) == 0) {
            HEAP32[$item + 12 >> 2] = 1;
            HEAP32[$item + 20 >> 2] = 1;
            var $_0 = $value + 4 | 0;
          } else {
            var $22 = HEAPU8[$value];
            do {
              if ($22 << 24 >> 24 == 34) {
                var $24 = _parse_string($item, $value);
                var $_0 = $24;
                break $_$123;
              } else if ($22 << 24 >> 24 != 45) {
                if (($22 - 48 & 255 & 255) < 10) {
                  break;
                }
                if ($22 << 24 >> 24 == 91) {
                  var $31 = _parse_array($item, $value);
                  var $_0 = $31;
                  break $_$123;
                } else if ($22 << 24 >> 24 == 123) {
                  var $33 = _parse_object($item, $value);
                  var $_0 = $33;
                  break $_$123;
                } else {
                  HEAP32[_ep >> 2] = $value;
                  var $_0 = 0;
                  break $_$123;
                }
              }
            } while (0);
            var $28 = _parse_number($item, $value);
            var $_0 = $28;
          }
        }
      }
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

function _skip($in) {
  var $_0 = $in;
  while (1) {
    var $_0;
    if (($_0 | 0) == 0) {
      break;
    }
    var $4 = HEAPU8[$_0];
    if (!($4 << 24 >> 24 != 0 & ($4 & 255) < 33)) {
      break;
    }
    var $_0 = $_0 + 1 | 0;
  }
  return $_0;
  return null;
}

function _cJSON_GetArraySize($array) {
  var $c_01 = HEAP32[$array + 8 >> 2];
  var $2 = ($c_01 | 0) == 0;
  $_$22 : do {
    if ($2) {
      var $i_0_lcssa = 0;
    } else {
      var $i_02 = 0;
      var $c_03 = $c_01;
      while (1) {
        var $c_03;
        var $i_02;
        var $3 = $i_02 + 1 | 0;
        var $c_0 = HEAP32[$c_03 >> 2];
        if (($c_0 | 0) == 0) {
          var $i_0_lcssa = $3;
          break $_$22;
        }
        var $i_02 = $3;
        var $c_03 = $c_0;
      }
    }
  } while (0);
  var $i_0_lcssa;
  return $i_0_lcssa;
  return null;
}

function _cJSON_GetArrayItem($array, $item) {
  var $c_01 = HEAP32[$array + 8 >> 2];
  var $or_cond2 = ($c_01 | 0) != 0 & ($item | 0) > 0;
  $_$27 : do {
    if ($or_cond2) {
      var $_03 = $item;
      var $c_04 = $c_01;
      while (1) {
        var $c_04;
        var $_03;
        var $4 = $_03 - 1 | 0;
        var $c_0 = HEAP32[$c_04 >> 2];
        if (!(($c_0 | 0) != 0 & ($4 | 0) > 0)) {
          var $c_0_lcssa = $c_0;
          break $_$27;
        }
        var $_03 = $4;
        var $c_04 = $c_0;
      }
    } else {
      var $c_0_lcssa = $c_01;
    }
  } while (0);
  var $c_0_lcssa;
  return $c_0_lcssa;
  return null;
}

function _suffix_object($prev, $item) {
  HEAP32[$prev >> 2] = $item;
  HEAP32[$item + 4 >> 2] = $prev;
  return;
  return;
}

function _cJSON_DetachItemFromArray($array, $which) {
  var $_pre$s2;
  var $11$s2;
  var $1$s2;
  var $1$s2 = ($array + 8 | 0) >> 2;
  var $c_02 = HEAP32[$1$s2];
  var $2 = ($c_02 | 0) != 0;
  var $4 = $2 & ($which | 0) > 0;
  $_$76 : do {
    if ($4) {
      var $_013 = $which;
      var $c_04 = $c_02;
      while (1) {
        var $c_04;
        var $_013;
        var $6 = $_013 - 1 | 0;
        var $c_0 = HEAP32[$c_04 >> 2];
        var $7 = ($c_0 | 0) != 0;
        if (!($7 & ($6 | 0) > 0)) {
          var $c_0_lcssa = $c_0;
          var $_lcssa = $7;
          break $_$76;
        }
        var $_013 = $6;
        var $c_04 = $c_0;
      }
    } else {
      var $c_0_lcssa = $c_02;
      var $_lcssa = $2;
    }
  } while (0);
  var $_lcssa;
  var $c_0_lcssa;
  if ($_lcssa) {
    var $11$s2 = ($c_0_lcssa + 4 | 0) >> 2;
    var $12 = HEAP32[$11$s2];
    var $_pre$s2 = ($c_0_lcssa | 0) >> 2;
    if (($12 | 0) != 0) {
      var $15 = HEAP32[$_pre$s2];
      var $16 = $12 | 0;
      HEAP32[$16 >> 2] = $15;
    }
    var $17 = HEAP32[$_pre$s2];
    if (($17 | 0) != 0) {
      var $20 = HEAP32[$11$s2];
      var $21 = $17 + 4 | 0;
      HEAP32[$21 >> 2] = $20;
    }
    if (($c_0_lcssa | 0) == (HEAP32[$1$s2] | 0)) {
      var $25 = HEAP32[$_pre$s2];
      HEAP32[$1$s2] = $25;
    }
    HEAP32[$_pre$s2] = 0;
    HEAP32[$11$s2] = 0;
    var $_0 = $c_0_lcssa;
  } else {
    var $_0 = 0;
  }
  var $_0;
  return $_0;
  return null;
}

function _cJSON_Print($item) {
  var $1 = _print_value($item, 0, 1);
  return $1;
  return null;
}

function _print_value($item, $depth, $fmt) {
  var $1 = ($item | 0) == 0;
  do {
    if ($1) {
      var $_0 = 0;
    } else {
      var $5 = HEAP32[$item + 12 >> 2] & 255;
      if (($5 | 0) == 2) {
        var $7 = _cJSON_strdup(STRING_TABLE.__str26 | 0);
        var $_0 = $7;
      } else if (($5 | 0) == 0) {
        var $9 = _cJSON_strdup(STRING_TABLE.__str127 | 0);
        var $_0 = $9;
      } else if (($5 | 0) == 1) {
        var $11 = _cJSON_strdup(STRING_TABLE.__str228 | 0);
        var $_0 = $11;
      } else if (($5 | 0) == 3) {
        var $13 = _print_number($item);
        var $_0 = $13;
      } else if (($5 | 0) == 4) {
        var $item_idx_val = HEAP32[$item + 16 >> 2];
        var $15 = _print_string($item_idx_val);
        var $_0 = $15;
      } else if (($5 | 0) == 5) {
        var $17 = _print_array($item, $depth, $fmt);
        var $_0 = $17;
      } else if (($5 | 0) == 6) {
        var $19 = _print_object($item, $depth, $fmt);
        var $_0 = $19;
      } else {
        var $_0 = 0;
        break;
      }
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

function _cJSON_PrintUnformatted($item) {
  var $1 = _print_value($item, 0, 0);
  return $1;
  return null;
}

function _cJSON_GetObjectItem($object, $string) {
  var $c_0_in = $object + 8 | 0;
  while (1) {
    var $c_0_in;
    var $c_0 = HEAP32[$c_0_in >> 2];
    if (($c_0 | 0) == 0) {
      break;
    }
    var $6 = HEAP32[$c_0 + 32 >> 2];
    var $7 = _cJSON_strcasecmp($6, $string);
    if (($7 | 0) == 0) {
      break;
    }
    var $c_0_in = $c_0 | 0;
  }
  return $c_0;
  return null;
}

function _cJSON_strcasecmp($s1, $s2) {
  var $1 = ($s1 | 0) == 0;
  $_$38 : do {
    if ($1) {
      var $_0 = ($s2 | 0) != 0 & 1;
    } else {
      if (($s2 | 0) == 0) {
        var $_0 = 1;
        break;
      }
      var $_01 = $s1;
      var $_02 = $s2;
      while (1) {
        var $_02;
        var $_01;
        var $7 = HEAP8[$_01] << 24 >> 24;
        var $8 = _tolower($7);
        var $10 = HEAP8[$_02] << 24 >> 24;
        var $11 = _tolower($10);
        var $13 = HEAPU8[$_01];
        if (($8 | 0) != ($11 | 0)) {
          break;
        }
        if ($13 << 24 >> 24 == 0) {
          var $_0 = 0;
          break $_$38;
        }
        var $_01 = $_01 + 1 | 0;
        var $_02 = $_02 + 1 | 0;
      }
      var $20 = $13 & 255;
      var $21 = _tolower($20);
      var $23 = HEAPU8[$_02] & 255;
      var $24 = _tolower($23);
      var $_0 = $21 - $24 | 0;
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

function _cJSON_AddItemToArray($array, $item) {
  var $1 = $array + 8 | 0;
  var $2 = HEAP32[$1 >> 2];
  if (($item | 0) != 0) {
    if (($2 | 0) == 0) {
      HEAP32[$1 >> 2] = $item;
    } else {
      var $c_0 = $2;
      while (1) {
        var $c_0;
        if (($c_0 | 0) == 0) {
          break;
        }
        var $10 = HEAP32[$c_0 >> 2];
        if (($10 | 0) == 0) {
          break;
        }
        var $c_0 = $10;
      }
      _suffix_object($c_0, $item);
    }
  }
  return;
  return;
}

function _cJSON_AddItemToObject($object, $string, $item) {
  if (($item | 0) != 0) {
    var $3 = $item + 32 | 0;
    var $4 = HEAP32[$3 >> 2];
    if (($4 | 0) != 0) {
      var $7 = HEAP32[_cJSON_free >> 2];
      FUNCTION_TABLE[$7]($4);
    }
    var $9 = _cJSON_strdup($string);
    HEAP32[$3 >> 2] = $9;
    _cJSON_AddItemToArray($object, $item);
  }
  return;
  return;
}

function _cJSON_strdup($str) {
  var $1 = _strlen($str);
  var $2 = $1 + 1 | 0;
  var $3 = HEAP32[_cJSON_malloc >> 2];
  var $4 = FUNCTION_TABLE[$3]($2);
  if (($4 | 0) == 0) {
    var $_0 = 0;
  } else {
    _memcpy($4, $str, $2, 1);
    var $_0 = $4;
  }
  var $_0;
  return $_0;
  return null;
}

function _cJSON_AddItemReferenceToArray($array, $item) {
  var $1 = _create_reference($item);
  _cJSON_AddItemToArray($array, $1);
  return;
  return;
}

function _create_reference($item) {
  var $1$s2;
  var $1 = _cJSON_New_Item(), $1$s2 = $1 >> 2;
  if (($1 | 0) == 0) {
    var $_0 = 0;
  } else {
    var $4 = $1;
    var $5 = $item;
    _memcpy($4, $5, 36, 1);
    HEAP32[$1$s2 + 8] = 0;
    var $7 = $1 + 12 | 0;
    var $9 = HEAP32[$7 >> 2] | 256;
    HEAP32[$7 >> 2] = $9;
    HEAP32[$1$s2 + 1] = 0;
    HEAP32[$1$s2] = 0;
    var $_0 = $1;
  }
  var $_0;
  return $_0;
  return null;
}

function _cJSON_AddItemReferenceToObject($object, $string, $item) {
  var $1 = _create_reference($item);
  _cJSON_AddItemToObject($object, $string, $1);
  return;
  return;
}

function _cJSON_DeleteItemFromArray($array, $which) {
  var $1 = _cJSON_DetachItemFromArray($array, $which);
  _cJSON_Delete($1);
  return;
  return;
}

function _cJSON_DetachItemFromObject($object, $string) {
  var $c_0_in = $object + 8 | 0;
  var $i_0 = 0;
  while (1) {
    var $i_0;
    var $c_0_in;
    var $c_0 = HEAP32[$c_0_in >> 2];
    if (($c_0 | 0) == 0) {
      var $_0 = 0;
      break;
    }
    var $6 = HEAP32[$c_0 + 32 >> 2];
    var $7 = _cJSON_strcasecmp($6, $string);
    if (($7 | 0) == 0) {
      var $12 = _cJSON_DetachItemFromArray($object, $i_0);
      var $_0 = $12;
      break;
    }
    var $c_0_in = $c_0 | 0;
    var $i_0 = $i_0 + 1 | 0;
  }
  var $_0;
  return $_0;
  return null;
}

function _cJSON_DeleteItemFromObject($object, $string) {
  var $1 = _cJSON_DetachItemFromObject($object, $string);
  _cJSON_Delete($1);
  return;
  return;
}

function _cJSON_ReplaceItemInArray($array, $which, $newitem) {
  var $1$s2;
  var $1$s2 = ($array + 8 | 0) >> 2;
  var $c_01 = HEAP32[$1$s2];
  var $2 = ($c_01 | 0) != 0;
  var $4 = $2 & ($which | 0) > 0;
  $_$103 : do {
    if ($4) {
      var $_02 = $which;
      var $c_03 = $c_01;
      while (1) {
        var $c_03;
        var $_02;
        var $6 = $_02 - 1 | 0;
        var $c_0 = HEAP32[$c_03 >> 2];
        var $7 = ($c_0 | 0) != 0;
        if (!($7 & ($6 | 0) > 0)) {
          var $c_0_lcssa = $c_0;
          var $_lcssa = $7;
          break $_$103;
        }
        var $_02 = $6;
        var $c_03 = $c_0;
      }
    } else {
      var $c_0_lcssa = $c_01;
      var $_lcssa = $2;
    }
  } while (0);
  var $_lcssa;
  var $c_0_lcssa;
  if ($_lcssa) {
    var $11 = $c_0_lcssa | 0;
    var $12 = HEAP32[$11 >> 2];
    HEAP32[$newitem >> 2] = $12;
    var $14 = $c_0_lcssa + 4 | 0;
    var $15 = HEAP32[$14 >> 2];
    var $16 = $newitem + 4 | 0;
    HEAP32[$16 >> 2] = $15;
    if (($12 | 0) != 0) {
      var $19 = $12 + 4 | 0;
      HEAP32[$19 >> 2] = $newitem;
    }
    if (($c_0_lcssa | 0) == (HEAP32[$1$s2] | 0)) {
      HEAP32[$1$s2] = $newitem;
    } else {
      var $26 = HEAP32[$16 >> 2] | 0;
      HEAP32[$26 >> 2] = $newitem;
    }
    HEAP32[$14 >> 2] = 0;
    HEAP32[$11 >> 2] = 0;
    _cJSON_Delete($c_0_lcssa);
  }
  return;
  return;
}

function _cJSON_ReplaceItemInObject($object, $string, $newitem) {
  var $c_0_in = $object + 8 | 0;
  var $i_0 = 0;
  while (1) {
    var $i_0;
    var $c_0_in;
    var $c_0 = HEAP32[$c_0_in >> 2];
    if (($c_0 | 0) == 0) {
      break;
    }
    var $6 = HEAP32[$c_0 + 32 >> 2];
    var $7 = _cJSON_strcasecmp($6, $string);
    if (($7 | 0) == 0) {
      var $12 = _cJSON_strdup($string);
      HEAP32[$newitem + 32 >> 2] = $12;
      _cJSON_ReplaceItemInArray($object, $i_0, $newitem);
      break;
    }
    var $c_0_in = $c_0 | 0;
    var $i_0 = $i_0 + 1 | 0;
  }
  return;
  return;
}

function _cJSON_CreateNull() {
  var $1 = _cJSON_New_Item();
  if (($1 | 0) != 0) {
    HEAP32[$1 + 12 >> 2] = 2;
  }
  return $1;
  return null;
}

function _cJSON_CreateTrue() {
  var $1 = _cJSON_New_Item();
  if (($1 | 0) != 0) {
    HEAP32[$1 + 12 >> 2] = 1;
  }
  return $1;
  return null;
}

function _cJSON_CreateFalse() {
  var $1 = _cJSON_New_Item();
  if (($1 | 0) != 0) {
    HEAP32[$1 + 12 >> 2] = 0;
  }
  return $1;
  return null;
}

function _cJSON_CreateBool($b) {
  var $1 = _cJSON_New_Item();
  if (($1 | 0) != 0) {
    HEAP32[$1 + 12 >> 2] = ($b | 0) != 0 & 1;
  }
  return $1;
  return null;
}

function _cJSON_CreateNumber($num) {
  var $1 = _cJSON_New_Item();
  if (($1 | 0) != 0) {
    HEAP32[$1 + 12 >> 2] = 3;
    var $5 = $1 + 24 | 0;
    tempDoubleF64[0] = $num, HEAP32[$5 >> 2] = tempDoubleI32[0], HEAP32[$5 + 4 >> 2] = tempDoubleI32[1];
    HEAP32[$1 + 20 >> 2] = $num & -1;
  }
  return $1;
  return null;
}

function _cJSON_CreateString($string) {
  var $1 = _cJSON_New_Item();
  if (($1 | 0) != 0) {
    HEAP32[$1 + 12 >> 2] = 4;
    var $5 = _cJSON_strdup($string);
    HEAP32[$1 + 16 >> 2] = $5;
  }
  return $1;
  return null;
}

function _cJSON_CreateArray() {
  var $1 = _cJSON_New_Item();
  if (($1 | 0) != 0) {
    HEAP32[$1 + 12 >> 2] = 5;
  }
  return $1;
  return null;
}

function _cJSON_CreateObject() {
  var $1 = _cJSON_New_Item();
  if (($1 | 0) != 0) {
    HEAP32[$1 + 12 >> 2] = 6;
  }
  return $1;
  return null;
}

function _cJSON_CreateIntArray($numbers, $count) {
  var $1 = _cJSON_CreateArray();
  var $or_cond1 = ($1 | 0) != 0 & ($count | 0) > 0;
  $_$158 : do {
    if ($or_cond1) {
      var $4 = $1 + 8 | 0;
      var $i_02_us = 0;
      var $p_03_us = 0;
      while (1) {
        var $p_03_us;
        var $i_02_us;
        var $8 = HEAP32[$numbers + ($i_02_us << 2) >> 2] | 0;
        var $9 = _cJSON_CreateNumber($8);
        if (($i_02_us | 0) == 0) {
          HEAP32[$4 >> 2] = $9;
        } else {
          _suffix_object($p_03_us, $9);
        }
        var $12 = $i_02_us + 1 | 0;
        if (($12 | 0) == ($count | 0)) {
          break $_$158;
        }
        var $i_02_us = $12;
        var $p_03_us = $9;
      }
    }
  } while (0);
  return $1;
  return null;
}

function _cJSON_CreateFloatArray($numbers, $count) {
  var $1 = _cJSON_CreateArray();
  var $or_cond1 = ($1 | 0) != 0 & ($count | 0) > 0;
  $_$168 : do {
    if ($or_cond1) {
      var $4 = $1 + 8 | 0;
      var $i_02_us = 0;
      var $p_03_us = 0;
      while (1) {
        var $p_03_us;
        var $i_02_us;
        var $8 = HEAPF32[$numbers + ($i_02_us << 2) >> 2];
        var $9 = _cJSON_CreateNumber($8);
        if (($i_02_us | 0) == 0) {
          HEAP32[$4 >> 2] = $9;
        } else {
          _suffix_object($p_03_us, $9);
        }
        var $12 = $i_02_us + 1 | 0;
        if (($12 | 0) == ($count | 0)) {
          break $_$168;
        }
        var $i_02_us = $12;
        var $p_03_us = $9;
      }
    }
  } while (0);
  return $1;
  return null;
}

function _cJSON_CreateDoubleArray($numbers, $count) {
  var $1 = _cJSON_CreateArray();
  var $or_cond1 = ($1 | 0) != 0 & ($count | 0) > 0;
  $_$178 : do {
    if ($or_cond1) {
      var $4 = $1 + 8 | 0;
      var $i_02_us = 0;
      var $p_03_us = 0;
      while (1) {
        var $p_03_us;
        var $i_02_us;
        var $6 = ($i_02_us << 3) + $numbers | 0;
        var $7 = (tempDoubleI32[0] = HEAP32[$6 >> 2], tempDoubleI32[1] = HEAP32[$6 + 4 >> 2], tempDoubleF64[0]);
        var $8 = _cJSON_CreateNumber($7);
        if (($i_02_us | 0) == 0) {
          HEAP32[$4 >> 2] = $8;
        } else {
          _suffix_object($p_03_us, $8);
        }
        var $11 = $i_02_us + 1 | 0;
        if (($11 | 0) == ($count | 0)) {
          break $_$178;
        }
        var $i_02_us = $11;
        var $p_03_us = $8;
      }
    }
  } while (0);
  return $1;
  return null;
}

function _cJSON_CreateStringArray($strings, $count) {
  var $1 = _cJSON_CreateArray();
  var $or_cond1 = ($1 | 0) != 0 & ($count | 0) > 0;
  $_$188 : do {
    if ($or_cond1) {
      var $4 = $1 + 8 | 0;
      var $i_02_us = 0;
      var $p_03_us = 0;
      while (1) {
        var $p_03_us;
        var $i_02_us;
        var $7 = HEAP32[$strings + ($i_02_us << 2) >> 2];
        var $8 = _cJSON_CreateString($7);
        if (($i_02_us | 0) == 0) {
          HEAP32[$4 >> 2] = $8;
        } else {
          _suffix_object($p_03_us, $8);
        }
        var $11 = $i_02_us + 1 | 0;
        if (($11 | 0) == ($count | 0)) {
          break $_$188;
        }
        var $i_02_us = $11;
        var $p_03_us = $8;
      }
    }
  } while (0);
  return $1;
  return null;
}

function _print_number($item) {
  var __label__;
  var $1 = $item + 24 | 0;
  var $2 = (tempDoubleI32[0] = HEAP32[$1 >> 2], tempDoubleI32[1] = HEAP32[$1 + 4 >> 2], tempDoubleF64[0]);
  var $3 = $item + 20 | 0;
  var $6 = (HEAP32[$3 >> 2] | 0) - $2;
  var $7 = _fabs($6);
  var $8 = $7 > 2.220446049250313e-16;
  do {
    if (!$8) {
      if (!($2 <= 2147483647 & $2 >= -2147483648)) {
        __label__ = 5;
        break;
      }
      var $13 = HEAP32[_cJSON_malloc >> 2];
      var $14 = FUNCTION_TABLE[$13](21);
      if (($14 | 0) == 0) {
        var $str_0 = 0;
        __label__ = 12;
        break;
      }
      var $17 = HEAP32[$3 >> 2];
      var $18 = _sprintf($14, STRING_TABLE.__str632 | 0, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $17, tempInt));
      var $str_0 = $14;
      __label__ = 12;
      break;
    }
    __label__ = 5;
  } while (0);
  $_$202 : do {
    if (__label__ == 5) {
      var $20 = HEAP32[_cJSON_malloc >> 2];
      var $21 = FUNCTION_TABLE[$20](64);
      if (($21 | 0) == 0) {
        var $str_0 = 0;
        break;
      }
      var $24 = _floor($2);
      var $25 = $24 - $2;
      var $26 = _fabs($25);
      if ($26 > 2.220446049250313e-16) {
        var $31 = _fabs($2);
        var $32 = $31 < 1e-6;
        do {
          if (!$32) {
            var $34 = _fabs($2);
            if ($34 > 1e9) {
              break;
            }
            var $39 = _sprintf($21, STRING_TABLE.__str935 | 0, (tempInt = STACKTOP, STACKTOP += 8, tempDoubleF64[0] = $2, HEAP32[tempInt >> 2] = tempDoubleI32[0], HEAP32[tempInt + 4 >> 2] = tempDoubleI32[1], tempInt));
            var $str_0 = $21;
            break $_$202;
          }
        } while (0);
        var $37 = _sprintf($21, STRING_TABLE.__str834 | 0, (tempInt = STACKTOP, STACKTOP += 8, tempDoubleF64[0] = $2, HEAP32[tempInt >> 2] = tempDoubleI32[0], HEAP32[tempInt + 4 >> 2] = tempDoubleI32[1], tempInt));
        var $str_0 = $21;
      } else {
        var $29 = _sprintf($21, STRING_TABLE.__str733 | 0, (tempInt = STACKTOP, STACKTOP += 8, tempDoubleF64[0] = $2, HEAP32[tempInt >> 2] = tempDoubleI32[0], HEAP32[tempInt + 4 >> 2] = tempDoubleI32[1], tempInt));
        var $str_0 = $21;
      }
    }
  } while (0);
  var $str_0;
  return $str_0;
  return null;
}

function _print_string($item_0_4_val) {
  var $1 = _print_string_ptr($item_0_4_val);
  return $1;
  return null;
}

function _print_array($item, $depth, $fmt) {
  var $56$s2;
  var $43$s2;
  var __label__;
  var $1 = $item + 8 | 0;
  var $child_017 = HEAP32[$1 >> 2];
  var $2 = ($child_017 | 0) == 0;
  $_$2 : do {
    if ($2) {
      var $numentries_0_lcssa = 0;
    } else {
      var $numentries_018 = 0;
      var $child_019 = $child_017;
      while (1) {
        var $child_019;
        var $numentries_018;
        var $3 = $numentries_018 + 1 | 0;
        var $child_0 = HEAP32[$child_019 >> 2];
        if (($child_0 | 0) == 0) {
          var $numentries_0_lcssa = $3;
          break $_$2;
        }
        var $numentries_018 = $3;
        var $child_019 = $child_0;
      }
    }
  } while (0);
  var $numentries_0_lcssa;
  var $6 = HEAP32[_cJSON_malloc >> 2];
  var $7 = $numentries_0_lcssa << 2;
  var $8 = FUNCTION_TABLE[$6]($7);
  var $9 = $8;
  var $10 = ($8 | 0) == 0;
  $_$6 : do {
    if ($10) {
      var $_0 = 0;
    } else {
      _memset($8, 0, $7, 1);
      var $child_17 = HEAPU32[$1 >> 2];
      var $12 = ($child_17 | 0) == 0;
      $_$8 : do {
        if ($12) {
          var $len_0_lcssa35 = 5;
          __label__ = 8;
        } else {
          var $13 = $depth + 1 | 0;
          var $16 = ($fmt | 0) != 0 & 1 | 2;
          var $len_08 = 5;
          var $i_09 = 0;
          var $child_111 = $child_17;
          while (1) {
            var $child_111;
            var $i_09;
            var $len_08;
            var $18 = _print_value($child_111, $13, $fmt);
            var $19 = ($i_09 << 2) + $9 | 0;
            HEAP32[$19 >> 2] = $18;
            if (($18 | 0) == 0) {
              __label__ = 9;
              break $_$8;
            }
            var $22 = $i_09 + 1 | 0;
            var $23 = _strlen($18);
            var $25 = $16 + $len_08 + $23 | 0;
            var $child_1 = HEAP32[$child_111 >> 2];
            if (($child_1 | 0) == 0) {
              var $len_0_lcssa35 = $25;
              __label__ = 8;
              break $_$8;
            }
            var $len_08 = $25;
            var $i_09 = $22;
            var $child_111 = $child_1;
          }
        }
      } while (0);
      do {
        if (__label__ == 8) {
          var $len_0_lcssa35;
          var $28 = HEAP32[_cJSON_malloc >> 2];
          var $29 = FUNCTION_TABLE[$28]($len_0_lcssa35);
          if (($29 | 0) == 0) {
            break;
          }
          HEAP8[$29] = 91;
          var $39 = $29 + 1 | 0;
          HEAP8[$39] = 0;
          var $40 = ($numentries_0_lcssa | 0) > 0;
          $_$16 : do {
            if ($40) {
              var $41 = $numentries_0_lcssa - 1 | 0;
              if (($fmt | 0) == 0) {
                var $ptr_04_us = $39;
                var $i_25_us = 0;
                while (1) {
                  var $i_25_us;
                  var $ptr_04_us;
                  var $43$s2 = (($i_25_us << 2) + $9 | 0) >> 2;
                  var $44 = HEAP32[$43$s2];
                  var $45 = _strcpy($ptr_04_us, $44);
                  var $46 = HEAP32[$43$s2];
                  var $47 = _strlen($46);
                  var $48 = $ptr_04_us + $47 | 0;
                  if (($i_25_us | 0) == ($41 | 0)) {
                    var $ptr_2_us = $48;
                    var $51 = $46;
                  } else {
                    var $55 = $47 + ($ptr_04_us + 1) | 0;
                    HEAP8[$48] = 44;
                    HEAP8[$55] = 0;
                    var $ptr_2_us = $55;
                    var $51 = HEAP32[$43$s2];
                  }
                  var $51;
                  var $ptr_2_us;
                  var $52 = HEAP32[_cJSON_free >> 2];
                  FUNCTION_TABLE[$52]($51);
                  var $53 = $i_25_us + 1 | 0;
                  if (($53 | 0) == ($numentries_0_lcssa | 0)) {
                    var $ptr_0_lcssa = $ptr_2_us;
                    break $_$16;
                  }
                  var $ptr_04_us = $ptr_2_us;
                  var $i_25_us = $53;
                }
              } else {
                var $ptr_04 = $39;
                var $i_25 = 0;
                while (1) {
                  var $i_25;
                  var $ptr_04;
                  var $56$s2 = (($i_25 << 2) + $9 | 0) >> 2;
                  var $57 = HEAP32[$56$s2];
                  var $58 = _strcpy($ptr_04, $57);
                  var $59 = HEAP32[$56$s2];
                  var $60 = _strlen($59);
                  var $61 = $ptr_04 + $60 | 0;
                  if (($i_25 | 0) == ($41 | 0)) {
                    var $ptr_2 = $61;
                    var $67 = $59;
                  } else {
                    var $64 = $60 + ($ptr_04 + 1) | 0;
                    HEAP8[$61] = 44;
                    var $65 = $60 + ($ptr_04 + 2) | 0;
                    HEAP8[$64] = 32;
                    HEAP8[$65] = 0;
                    var $ptr_2 = $65;
                    var $67 = HEAP32[$56$s2];
                  }
                  var $67;
                  var $ptr_2;
                  var $68 = HEAP32[_cJSON_free >> 2];
                  FUNCTION_TABLE[$68]($67);
                  var $69 = $i_25 + 1 | 0;
                  if (($69 | 0) == ($numentries_0_lcssa | 0)) {
                    var $ptr_0_lcssa = $ptr_2;
                    break $_$16;
                  }
                  var $ptr_04 = $ptr_2;
                  var $i_25 = $69;
                }
              }
            } else {
              var $ptr_0_lcssa = $39;
            }
          } while (0);
          var $ptr_0_lcssa;
          var $70 = HEAP32[_cJSON_free >> 2];
          FUNCTION_TABLE[$70]($8);
          HEAP8[$ptr_0_lcssa] = 93;
          HEAP8[$ptr_0_lcssa + 1 | 0] = 0;
          var $_0 = $29;
          break $_$6;
        }
      } while (0);
      var $30 = ($numentries_0_lcssa | 0) > 0;
      $_$31 : do {
        if ($30) {
          var $i_13 = 0;
          while (1) {
            var $i_13;
            var $32 = HEAP32[$9 + ($i_13 << 2) >> 2];
            if (($32 | 0) != 0) {
              var $35 = HEAP32[_cJSON_free >> 2];
              FUNCTION_TABLE[$35]($32);
            }
            var $36 = $i_13 + 1 | 0;
            if (($36 | 0) == ($numentries_0_lcssa | 0)) {
              break $_$31;
            }
            var $i_13 = $36;
          }
        }
      } while (0);
      var $37 = HEAP32[_cJSON_free >> 2];
      FUNCTION_TABLE[$37]($8);
      var $_0 = 0;
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

_print_array["X"] = 1;

function _print_object($item, $depth, $fmt) {
  var $79$s2;
  var $69$s2;
  var __label__;
  var $1 = $item + 8 | 0;
  var $child_029 = HEAP32[$1 >> 2];
  var $2 = ($child_029 | 0) == 0;
  $_$40 : do {
    if ($2) {
      var $numentries_0_lcssa = 0;
    } else {
      var $numentries_030 = 0;
      var $child_031 = $child_029;
      while (1) {
        var $child_031;
        var $numentries_030;
        var $3 = $numentries_030 + 1 | 0;
        var $child_0 = HEAP32[$child_031 >> 2];
        if (($child_0 | 0) == 0) {
          var $numentries_0_lcssa = $3;
          break $_$40;
        }
        var $numentries_030 = $3;
        var $child_031 = $child_0;
      }
    }
  } while (0);
  var $numentries_0_lcssa;
  var $6 = HEAP32[_cJSON_malloc >> 2];
  var $7 = $numentries_0_lcssa << 2;
  var $8 = FUNCTION_TABLE[$6]($7);
  var $9 = $8;
  var $10 = ($8 | 0) == 0;
  $_$44 : do {
    if ($10) {
      var $_0 = 0;
    } else {
      var $12 = HEAP32[_cJSON_malloc >> 2];
      var $13 = FUNCTION_TABLE[$12]($7);
      var $14 = $13;
      if (($13 | 0) == 0) {
        var $17 = HEAP32[_cJSON_free >> 2];
        FUNCTION_TABLE[$17]($8);
        var $_0 = 0;
      } else {
        _memset($8, 0, $7, 1);
        _memset($13, 0, $7, 1);
        var $19 = $depth + 1 | 0;
        var $21 = ($fmt | 0) != 0;
        var $_ = $21 ? $depth + 8 | 0 : 7;
        var $child_119 = HEAP32[$1 >> 2];
        var $22 = ($child_119 | 0) == 0;
        do {
          if ($22) {
            var $len_0_lcssa41 = $_;
            __label__ = 12;
          } else {
            var $23 = $21 ? $depth + 5 | 0 : 2;
            var $i_020 = 0;
            var $len_021 = $_;
            var $fail_022 = 0;
            var $child_123 = $child_119;
            while (1) {
              var $child_123;
              var $fail_022;
              var $len_021;
              var $i_020;
              var $26 = HEAP32[$child_123 + 32 >> 2];
              var $27 = _print_string_ptr($26);
              var $28 = ($i_020 << 2) + $14 | 0;
              HEAP32[$28 >> 2] = $27;
              var $29 = _print_value($child_123, $19, $fmt);
              var $30 = $i_020 + 1 | 0;
              var $31 = ($i_020 << 2) + $9 | 0;
              HEAP32[$31 >> 2] = $29;
              if (($27 | 0) == 0 | ($29 | 0) == 0) {
                var $fail_1 = 1;
                var $len_1 = $len_021;
              } else {
                var $35 = _strlen($29);
                var $36 = _strlen($27);
                var $fail_1 = $fail_022;
                var $len_1 = $23 + $len_021 + $35 + $36 | 0;
              }
              var $len_1;
              var $fail_1;
              var $child_1 = HEAP32[$child_123 >> 2];
              if (($child_1 | 0) == 0) {
                break;
              }
              var $i_020 = $30;
              var $len_021 = $len_1;
              var $fail_022 = $fail_1;
              var $child_123 = $child_1;
            }
            if (($fail_1 | 0) == 0) {
              var $len_0_lcssa41 = $len_1;
              __label__ = 12;
              break;
            }
            __label__ = 13;
            break;
          }
        } while (0);
        do {
          if (__label__ == 12) {
            var $len_0_lcssa41;
            var $44 = HEAP32[_cJSON_malloc >> 2];
            var $45 = FUNCTION_TABLE[$44]($len_0_lcssa41);
            if (($45 | 0) == 0) {
              break;
            }
            HEAP8[$45] = 123;
            var $62 = $45 + 1 | 0;
            if ($21) {
              var $64 = $45 + 2 | 0;
              HEAP8[$62] = 10;
              var $ptr_0 = $64;
            } else {
              var $ptr_0 = $62;
            }
            var $ptr_0;
            HEAP8[$ptr_0] = 0;
            var $66 = ($numentries_0_lcssa | 0) > 0;
            $_$63 : do {
              if ($66) {
                var $67 = $numentries_0_lcssa - 1 | 0;
                var $brmerge = ($depth | 0) < 0 | $21 ^ 1;
                var $i_215 = 0;
                var $ptr_116 = $ptr_0;
                while (1) {
                  var $ptr_116;
                  var $i_215;
                  if ($brmerge) {
                    var $ptr_3 = $ptr_116;
                  } else {
                    var $lftr_limit38 = $ptr_116 + $19 | 0;
                    _memset($ptr_116, 9, $19, 1);
                    var $ptr_3 = $lftr_limit38;
                  }
                  var $ptr_3;
                  var $69$s2 = (($i_215 << 2) + $14 | 0) >> 2;
                  var $70 = HEAP32[$69$s2];
                  var $71 = _strcpy($ptr_3, $70);
                  var $72 = HEAP32[$69$s2];
                  var $73 = _strlen($72);
                  var $75 = $73 + ($ptr_3 + 1) | 0;
                  HEAP8[$ptr_3 + $73 | 0] = 58;
                  if ($21) {
                    var $77 = $73 + ($ptr_3 + 2) | 0;
                    HEAP8[$75] = 9;
                    var $ptr_4 = $77;
                  } else {
                    var $ptr_4 = $75;
                  }
                  var $ptr_4;
                  var $79$s2 = (($i_215 << 2) + $9 | 0) >> 2;
                  var $80 = HEAP32[$79$s2];
                  var $81 = _strcpy($ptr_4, $80);
                  var $82 = HEAP32[$79$s2];
                  var $83 = _strlen($82);
                  var $84 = $ptr_4 + $83 | 0;
                  if (($i_215 | 0) == ($67 | 0)) {
                    var $ptr_5 = $84;
                  } else {
                    var $87 = $83 + ($ptr_4 + 1) | 0;
                    HEAP8[$84] = 44;
                    var $ptr_5 = $87;
                  }
                  var $ptr_5;
                  if ($21) {
                    HEAP8[$ptr_5] = 10;
                    var $ptr_6 = $ptr_5 + 1 | 0;
                  } else {
                    var $ptr_6 = $ptr_5;
                  }
                  var $ptr_6;
                  HEAP8[$ptr_6] = 0;
                  var $92 = HEAP32[_cJSON_free >> 2];
                  var $93 = HEAP32[$69$s2];
                  FUNCTION_TABLE[$92]($93);
                  var $94 = HEAP32[_cJSON_free >> 2];
                  var $95 = HEAP32[$79$s2];
                  FUNCTION_TABLE[$94]($95);
                  var $96 = $i_215 + 1 | 0;
                  if (($96 | 0) == ($numentries_0_lcssa | 0)) {
                    var $ptr_1_lcssa = $ptr_6;
                    break $_$63;
                  }
                  var $i_215 = $96;
                  var $ptr_116 = $ptr_6;
                }
              } else {
                var $ptr_1_lcssa = $ptr_0;
              }
            } while (0);
            var $ptr_1_lcssa;
            var $97 = HEAP32[_cJSON_free >> 2];
            FUNCTION_TABLE[$97]($13);
            var $98 = HEAP32[_cJSON_free >> 2];
            FUNCTION_TABLE[$98]($8);
            if ($21 & ($depth | 0) > 0) {
              var $lftr_limit = $ptr_1_lcssa + $depth | 0;
              _memset($ptr_1_lcssa, 9, $depth, 1);
              var $ptr_8 = $lftr_limit;
            } else {
              var $ptr_8 = $ptr_1_lcssa;
            }
            var $ptr_8;
            HEAP8[$ptr_8] = 125;
            HEAP8[$ptr_8 + 1 | 0] = 0;
            var $_0 = $45;
            break $_$44;
          }
        } while (0);
        var $46 = ($numentries_0_lcssa | 0) > 0;
        $_$84 : do {
          if ($46) {
            var $i_15 = 0;
            while (1) {
              var $i_15;
              var $48 = HEAP32[$14 + ($i_15 << 2) >> 2];
              if (($48 | 0) != 0) {
                var $51 = HEAP32[_cJSON_free >> 2];
                FUNCTION_TABLE[$51]($48);
              }
              var $54 = HEAP32[$9 + ($i_15 << 2) >> 2];
              if (($54 | 0) != 0) {
                var $57 = HEAP32[_cJSON_free >> 2];
                FUNCTION_TABLE[$57]($54);
              }
              var $58 = $i_15 + 1 | 0;
              if (($58 | 0) == ($numentries_0_lcssa | 0)) {
                break $_$84;
              }
              var $i_15 = $58;
            }
          }
        } while (0);
        var $59 = HEAP32[_cJSON_free >> 2];
        FUNCTION_TABLE[$59]($13);
        var $60 = HEAP32[_cJSON_free >> 2];
        FUNCTION_TABLE[$60]($8);
        var $_0 = 0;
      }
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

_print_object["X"] = 1;

function _print_string_ptr($str) {
  var __label__;
  var $1 = ($str | 0) == 0;
  do {
    if ($1) {
      var $3 = _cJSON_strdup(__str329 | 0);
      var $_0 = $3;
    } else {
      var $ptr_0 = $str;
      var $len_0 = 0;
      while (1) {
        var $len_0;
        var $ptr_0;
        var $4 = HEAPU8[$ptr_0];
        var $5 = $4 & 255;
        if ($4 << 24 >> 24 == 0) {
          var $len_2 = $len_0;
          break;
        }
        var $8 = $len_0 + 1 | 0;
        if (($8 | 0) == 0) {
          var $len_2 = 0;
          break;
        }
        var $memchr = _memchr(STRING_TABLE.__str430 | 0, $5, 8);
        if (($memchr | 0) == 0) {
          var $_ = ($4 & 255) < 32 ? $len_0 + 6 | 0 : $8;
          var $len_1 = $_;
        } else {
          var $len_1 = $len_0 + 2 | 0;
        }
        var $len_1;
        var $ptr_0 = $ptr_0 + 1 | 0;
        var $len_0 = $len_1;
      }
      var $len_2;
      var $19 = HEAP32[_cJSON_malloc >> 2];
      var $21 = FUNCTION_TABLE[$19]($len_2 + 3 | 0);
      if (($21 | 0) == 0) {
        var $_0 = 0;
        break;
      }
      var $24 = $21 + 1 | 0;
      HEAP8[$21] = 34;
      var $25 = HEAP8[$str];
      var $26 = $25 << 24 >> 24 == 0;
      $_$108 : do {
        if ($26) {
          var $ptr2_0_lcssa = $24;
        } else {
          var $ptr2_02 = $24;
          var $ptr_13 = $str;
          var $27 = $25;
          while (1) {
            var $27;
            var $ptr_13;
            var $ptr2_02;
            var $28 = ($27 & 255) < 32;
            do {
              if (!$28) {
                if ($27 << 24 >> 24 == 92 || $27 << 24 >> 24 == 34) {
                  __label__ = 14;
                  break;
                }
                HEAP8[$ptr2_02] = $27;
                var $ptr_1_be = $ptr_13 + 1 | 0;
                var $ptr2_0_be = $ptr2_02 + 1 | 0;
                __label__ = 16;
                break;
              }
              __label__ = 14;
            } while (0);
            if (__label__ == 14) {
              var $33 = $ptr2_02 + 1 | 0;
              HEAP8[$ptr2_02] = 92;
              var $34 = $ptr_13 + 1 | 0;
              var $36 = HEAPU8[$ptr_13] & 255;
              if (($36 | 0) == 92) {
                HEAP8[$33] = 92;
                var $ptr_1_be = $34;
                var $ptr2_0_be = $ptr2_02 + 2 | 0;
              } else if (($36 | 0) == 34) {
                HEAP8[$33] = 34;
                var $ptr_1_be = $34;
                var $ptr2_0_be = $ptr2_02 + 2 | 0;
              } else if (($36 | 0) == 8) {
                HEAP8[$33] = 98;
                var $ptr_1_be = $34;
                var $ptr2_0_be = $ptr2_02 + 2 | 0;
              } else if (($36 | 0) == 12) {
                HEAP8[$33] = 102;
                var $ptr_1_be = $34;
                var $ptr2_0_be = $ptr2_02 + 2 | 0;
              } else if (($36 | 0) == 10) {
                HEAP8[$33] = 110;
                var $ptr_1_be = $34;
                var $ptr2_0_be = $ptr2_02 + 2 | 0;
              } else if (($36 | 0) == 13) {
                HEAP8[$33] = 114;
                var $ptr_1_be = $34;
                var $ptr2_0_be = $ptr2_02 + 2 | 0;
              } else if (($36 | 0) == 9) {
                HEAP8[$33] = 116;
                var $ptr_1_be = $34;
                var $ptr2_0_be = $ptr2_02 + 2 | 0;
              } else {
                var $54 = _sprintf($33, STRING_TABLE.__str531 | 0, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $36, tempInt));
                var $ptr_1_be = $34;
                var $ptr2_0_be = $ptr2_02 + 6 | 0;
              }
            }
            var $ptr2_0_be;
            var $ptr_1_be;
            var $39 = HEAPU8[$ptr_1_be];
            if ($39 << 24 >> 24 == 0) {
              var $ptr2_0_lcssa = $ptr2_0_be;
              break $_$108;
            }
            var $ptr2_02 = $ptr2_0_be;
            var $ptr_13 = $ptr_1_be;
            var $27 = $39;
          }
        }
      } while (0);
      var $ptr2_0_lcssa;
      HEAP8[$ptr2_0_lcssa] = 34;
      HEAP8[$ptr2_0_lcssa + 1 | 0] = 0;
      var $_0 = $21;
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

_print_string_ptr["X"] = 1;

function _parse_string($item, $str) {
  var $uc$s2;
  var __stackBase__ = STACKTOP;
  STACKTOP += 8;
  var __label__;
  var $uc = __stackBase__, $uc$s2 = $uc >> 2;
  var $uc2 = __stackBase__ + 4;
  var $1 = $str + 1 | 0;
  var $3 = HEAP8[$str] << 24 >> 24 == 34;
  do {
    if ($3) {
      var $len_0 = 1;
      var $ptr_0 = $1;
      while (1) {
        var $ptr_0;
        var $len_0;
        var $5 = HEAP8[$ptr_0];
        if ($5 << 24 >> 24 == 34 || $5 << 24 >> 24 == 0) {
          break;
        }
        var $ptr_0_be = $5 << 24 >> 24 == 92 ? $ptr_0 + 2 | 0 : $ptr_0 + 1 | 0;
        var $len_0 = $len_0 + 1 | 0;
        var $ptr_0 = $ptr_0_be;
      }
      var $9 = HEAP32[_cJSON_malloc >> 2];
      var $10 = FUNCTION_TABLE[$9]($len_0);
      if (($10 | 0) == 0) {
        var $_0 = 0;
        break;
      }
      var $ptr2_0 = $10;
      var $ptr_1 = $1;
      while (1) {
        var $ptr_1;
        var $ptr2_0;
        var $12 = HEAP8[$ptr_1];
        if ($12 << 24 >> 24 == 34 || $12 << 24 >> 24 == 0) {
          break;
        }
        var $15 = $ptr_1 + 1 | 0;
        if ($12 << 24 >> 24 == 92) {
          var $19 = HEAPU8[$15];
          var $20 = $19 << 24 >> 24;
          $_$141 : do {
            if (($20 | 0) == 98) {
              HEAP8[$ptr2_0] = 8;
              var $ptr2_5 = $ptr2_0 + 1 | 0;
              var $ptr_3 = $15;
            } else if (($20 | 0) == 102) {
              HEAP8[$ptr2_0] = 12;
              var $ptr2_5 = $ptr2_0 + 1 | 0;
              var $ptr_3 = $15;
            } else if (($20 | 0) == 110) {
              HEAP8[$ptr2_0] = 10;
              var $ptr2_5 = $ptr2_0 + 1 | 0;
              var $ptr_3 = $15;
            } else if (($20 | 0) == 114) {
              HEAP8[$ptr2_0] = 13;
              var $ptr2_5 = $ptr2_0 + 1 | 0;
              var $ptr_3 = $15;
            } else if (($20 | 0) == 116) {
              HEAP8[$ptr2_0] = 9;
              var $ptr2_5 = $ptr2_0 + 1 | 0;
              var $ptr_3 = $15;
            } else if (($20 | 0) == 117) {
              var $33 = _sscanf($ptr_1 + 2 | 0, STRING_TABLE.__str1036 | 0, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $uc, tempInt));
              var $34 = $ptr_1 + 5 | 0;
              var $35 = HEAPU32[$uc$s2];
              if (($35 - 56320 | 0) >>> 0 < 1024 | ($35 | 0) == 0) {
                var $ptr2_5 = $ptr2_0;
                var $ptr_3 = $34;
                break;
              }
              var $39 = ($35 - 55296 | 0) >>> 0 < 1024;
              do {
                if ($39) {
                  if (HEAP8[$ptr_1 + 6 | 0] << 24 >> 24 != 92) {
                    var $ptr2_5 = $ptr2_0;
                    var $ptr_3 = $34;
                    break $_$141;
                  }
                  if (HEAP8[$ptr_1 + 7 | 0] << 24 >> 24 != 117) {
                    var $ptr2_5 = $ptr2_0;
                    var $ptr_3 = $34;
                    break $_$141;
                  }
                  var $50 = _sscanf($ptr_1 + 8 | 0, STRING_TABLE.__str1036 | 0, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $uc2, tempInt));
                  var $51 = $ptr_1 + 11 | 0;
                  var $52 = HEAPU32[$uc2 >> 2];
                  if (($52 - 56320 | 0) >>> 0 > 1023) {
                    var $ptr2_5 = $ptr2_0;
                    var $ptr_3 = $51;
                    break $_$141;
                  }
                  var $59 = $52 & 1023 | HEAP32[$uc$s2] << 10 & 982016 | 65536;
                  HEAP32[$uc$s2] = $59;
                  var $ptr_213_ph = $51;
                  var $71 = $59;
                  __label__ = 27;
                  break;
                }
                if ($35 >>> 0 < 128) {
                  var $ptr2_3 = $ptr2_0 + 1 | 0;
                  var $ptr_21318 = $34;
                  var $len_223 = 1;
                  var $95 = $35;
                  __label__ = 30;
                  break;
                }
                if ($35 >>> 0 < 2048) {
                  var $ptr2_2 = $ptr2_0 + 2 | 0;
                  var $ptr_21319 = $34;
                  var $len_224 = 2;
                  var $87 = $35;
                  __label__ = 29;
                  break;
                }
                if ($35 >>> 0 >= 65536) {
                  var $ptr_213_ph = $34;
                  var $71 = $35;
                  __label__ = 27;
                  break;
                }
                var $ptr2_1 = $ptr2_0 + 3 | 0;
                var $ptr_21320 = $34;
                var $len_225 = 3;
                var $79 = $35;
                __label__ = 28;
                break;
              } while (0);
              do {
                if (__label__ == 27) {
                  var $71;
                  var $ptr_213_ph;
                  var $75 = $ptr2_0 + 3 | 0;
                  HEAP8[$75] = ($71 & 63 | 128) & 255;
                  var $77 = HEAPU32[$uc$s2] >>> 6;
                  HEAP32[$uc$s2] = $77;
                  var $ptr2_1 = $75;
                  var $ptr_21320 = $ptr_213_ph;
                  var $len_225 = 4;
                  var $79 = $77;
                  __label__ = 28;
                  break;
                }
              } while (0);
              do {
                if (__label__ == 28) {
                  var $79;
                  var $len_225;
                  var $ptr_21320;
                  var $ptr2_1;
                  var $83 = $ptr2_1 - 1 | 0;
                  HEAP8[$83] = ($79 & 63 | 128) & 255;
                  var $85 = HEAPU32[$uc$s2] >>> 6;
                  HEAP32[$uc$s2] = $85;
                  var $ptr2_2 = $83;
                  var $ptr_21319 = $ptr_21320;
                  var $len_224 = $len_225;
                  var $87 = $85;
                  __label__ = 29;
                  break;
                }
              } while (0);
              if (__label__ == 29) {
                var $87;
                var $len_224;
                var $ptr_21319;
                var $ptr2_2;
                var $91 = $ptr2_2 - 1 | 0;
                HEAP8[$91] = ($87 & 63 | 128) & 255;
                var $93 = HEAPU32[$uc$s2] >>> 6;
                HEAP32[$uc$s2] = $93;
                var $ptr2_3 = $91;
                var $ptr_21318 = $ptr_21319;
                var $len_223 = $len_224;
                var $95 = $93;
              }
              var $95;
              var $len_223;
              var $ptr_21318;
              var $ptr2_3;
              var $96 = STRING_TABLE._firstByteMark + $len_223 | 0;
              HEAP8[$ptr2_3 - 1 | 0] = (HEAPU8[$96] & 255 | $95) & 255;
              var $ptr2_5 = $ptr2_3 + ($len_223 - 1) | 0;
              var $ptr_3 = $ptr_21318;
            } else {
              HEAP8[$ptr2_0] = $19;
              var $ptr2_5 = $ptr2_0 + 1 | 0;
              var $ptr_3 = $15;
            }
          } while (0);
          var $ptr_3;
          var $ptr2_5;
          var $ptr2_0 = $ptr2_5;
          var $ptr_1 = $ptr_3 + 1 | 0;
        } else {
          HEAP8[$ptr2_0] = $12;
          var $ptr2_0 = $ptr2_0 + 1 | 0;
          var $ptr_1 = $15;
        }
      }
      HEAP8[$ptr2_0] = 0;
      var $ptr_4 = HEAP8[$ptr_1] << 24 >> 24 == 34 ? $ptr_1 + 1 | 0 : $ptr_1;
      HEAP32[$item + 16 >> 2] = $10;
      HEAP32[$item + 12 >> 2] = 4;
      var $_0 = $ptr_4;
    } else {
      HEAP32[_ep >> 2] = $str;
      var $_0 = 0;
    }
  } while (0);
  var $_0;
  STACKTOP = __stackBase__;
  return $_0;
  return null;
}

_parse_string["X"] = 1;

function _parse_number($item, $num) {
  var __label__;
  var $2 = HEAP8[$num] << 24 >> 24 == 45;
  var $sign_0 = $2 ? -1 : 1;
  var $_0 = $2 ? $num + 1 | 0 : $num;
  var $_1 = HEAP8[$_0] << 24 >> 24 == 48 ? $_0 + 1 | 0 : $_0;
  var $7 = HEAPU8[$_1];
  var $8 = ($7 - 49 & 255 & 255) < 9;
  $_$174 : do {
    if ($8) {
      var $_2 = $_1;
      var $n_0 = 0;
      var $9 = $7;
      while (1) {
        var $9;
        var $n_0;
        var $_2;
        var $11 = $_2 + 1 | 0;
        var $15 = $n_0 * 10 + (($9 << 24 >> 24) - 48 | 0);
        var $16 = HEAPU8[$11];
        if (($16 - 48 & 255 & 255) >= 10) {
          var $_3 = $11;
          var $n_1 = $15;
          var $18 = $16;
          break $_$174;
        }
        var $_2 = $11;
        var $n_0 = $15;
        var $9 = $16;
      }
    } else {
      var $_3 = $_1;
      var $n_1 = 0;
      var $18 = $7;
    }
  } while (0);
  var $18;
  var $n_1;
  var $_3;
  var $19 = $18 << 24 >> 24 == 46;
  $_$178 : do {
    if ($19) {
      var $21 = $_3 + 1 | 0;
      var $22 = HEAPU8[$21];
      if (($22 - 48 & 255 & 255) >= 10) {
        var $signsubscale_1 = 1;
        var $_7 = $_3;
        var $subscale_1 = 0;
        var $scale_128 = 0;
        var $n_329 = $n_1;
        __label__ = 12;
        break;
      }
      var $_4 = $21;
      var $n_2 = $n_1;
      var $scale_0 = 0;
      var $24 = $22;
      while (1) {
        var $24;
        var $scale_0;
        var $n_2;
        var $_4;
        var $26 = $_4 + 1 | 0;
        var $30 = $n_2 * 10 + (($24 << 24 >> 24) - 48 | 0);
        var $31 = $scale_0 - 1;
        var $32 = HEAPU8[$26];
        if (($32 - 48 & 255 & 255) >= 10) {
          var $_5 = $26;
          var $n_3 = $30;
          var $scale_1 = $31;
          var $34 = $32;
          __label__ = 6;
          break $_$178;
        }
        var $_4 = $26;
        var $n_2 = $30;
        var $scale_0 = $31;
        var $24 = $32;
      }
    } else {
      var $_5 = $_3;
      var $n_3 = $n_1;
      var $scale_1 = 0;
      var $34 = $18;
      __label__ = 6;
    }
  } while (0);
  $_$182 : do {
    if (__label__ == 6) {
      var $34;
      var $scale_1;
      var $n_3;
      var $_5;
      if (!($34 << 24 >> 24 == 101 || $34 << 24 >> 24 == 69)) {
        var $signsubscale_1 = 1;
        var $_7 = $_5;
        var $subscale_1 = 0;
        var $scale_128 = $scale_1;
        var $n_329 = $n_3;
        break;
      }
      var $35 = $_5 + 1 | 0;
      var $36 = HEAP8[$35];
      if ($36 << 24 >> 24 == 43) {
        var $signsubscale_0_ph = 1;
        var $_6_ph = $_5 + 2 | 0;
      } else if ($36 << 24 >> 24 == 45) {
        var $signsubscale_0_ph = -1;
        var $_6_ph = $_5 + 2 | 0;
      } else {
        var $signsubscale_0_ph = 1;
        var $_6_ph = $35;
      }
      var $_6_ph;
      var $signsubscale_0_ph;
      var $41 = HEAPU8[$_6_ph];
      if (($41 - 48 & 255 & 255) >= 10) {
        var $signsubscale_1 = $signsubscale_0_ph;
        var $_7 = $_6_ph;
        var $subscale_1 = 0;
        var $scale_128 = $scale_1;
        var $n_329 = $n_3;
        break;
      }
      var $subscale_012 = 0;
      var $_613 = $_6_ph;
      var $43 = $41;
      while (1) {
        var $43;
        var $_613;
        var $subscale_012;
        var $46 = $_613 + 1 | 0;
        var $48 = ($43 << 24 >> 24) + ($subscale_012 * 10 - 48) | 0;
        var $49 = HEAPU8[$46];
        if (($49 - 48 & 255 & 255) >= 10) {
          var $signsubscale_1 = $signsubscale_0_ph;
          var $_7 = $46;
          var $subscale_1 = $48;
          var $scale_128 = $scale_1;
          var $n_329 = $n_3;
          break $_$182;
        }
        var $subscale_012 = $48;
        var $_613 = $46;
        var $43 = $49;
      }
    }
  } while (0);
  var $n_329;
  var $scale_128;
  var $subscale_1;
  var $_7;
  var $signsubscale_1;
  var $51 = $sign_0 * $n_329;
  var $55 = _llvm_pow_f64(10, $scale_128 + ($signsubscale_1 * $subscale_1 | 0));
  var $56 = $51 * $55;
  var $57 = $item + 24 | 0;
  tempDoubleF64[0] = $56, HEAP32[$57 >> 2] = tempDoubleI32[0], HEAP32[$57 + 4 >> 2] = tempDoubleI32[1];
  HEAP32[$item + 20 >> 2] = $56 & -1;
  HEAP32[$item + 12 >> 2] = 3;
  return $_7;
  return null;
}

_parse_number["X"] = 1;

function _parse_array($item, $value) {
  var $2 = HEAP8[$value] << 24 >> 24 == 91;
  $_$2 : do {
    if ($2) {
      HEAP32[$item + 12 >> 2] = 5;
      var $6 = $value + 1 | 0;
      var $7 = _skip($6);
      if (HEAP8[$7] << 24 >> 24 == 93) {
        var $_0 = $7 + 1 | 0;
      } else {
        var $13 = _cJSON_New_Item();
        HEAP32[$item + 8 >> 2] = $13;
        if (($13 | 0) == 0) {
          var $_0 = 0;
          break;
        }
        var $17 = _skip($7);
        var $18 = _parse_value($13, $17);
        var $19 = _skip($18);
        if (($19 | 0) == 0) {
          var $_0 = 0;
          break;
        }
        var $child_0 = $13;
        var $_01 = $19;
        while (1) {
          var $_01;
          var $child_0;
          var $21 = HEAP8[$_01];
          if ($21 << 24 >> 24 == 44) {
            var $23 = _cJSON_New_Item();
            if (($23 | 0) == 0) {
              var $_0 = 0;
              break $_$2;
            }
            HEAP32[$child_0 >> 2] = $23;
            HEAP32[$23 + 4 >> 2] = $child_0;
            var $29 = _skip($_01 + 1 | 0);
            var $30 = _parse_value($23, $29);
            var $31 = _skip($30);
            if (($31 | 0) == 0) {
              var $_0 = 0;
              break $_$2;
            }
            var $child_0 = $23;
            var $_01 = $31;
          } else if ($21 << 24 >> 24 == 93) {
            var $_0 = $_01 + 1 | 0;
            break $_$2;
          } else {
            HEAP32[_ep >> 2] = $_01;
            var $_0 = 0;
            break $_$2;
          }
        }
      }
    } else {
      HEAP32[_ep >> 2] = $value;
      var $_0 = 0;
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

function _parse_object($item, $value) {
  var $2 = HEAP8[$value] << 24 >> 24 == 123;
  $_$18 : do {
    if ($2) {
      HEAP32[$item + 12 >> 2] = 6;
      var $6 = $value + 1 | 0;
      var $7 = _skip($6);
      if (HEAP8[$7] << 24 >> 24 == 125) {
        var $_0 = $7 + 1 | 0;
      } else {
        var $13 = _cJSON_New_Item();
        HEAP32[$item + 8 >> 2] = $13;
        if (($13 | 0) == 0) {
          var $_0 = 0;
          break;
        }
        var $17 = _skip($7);
        var $18 = _parse_string($13, $17);
        var $19 = _skip($18);
        if (($19 | 0) == 0) {
          var $_0 = 0;
          break;
        }
        var $22 = $13 + 16 | 0;
        var $23 = HEAP32[$22 >> 2];
        HEAP32[$13 + 32 >> 2] = $23;
        HEAP32[$22 >> 2] = 0;
        if (HEAP8[$19] << 24 >> 24 == 58) {
          var $29 = $19 + 1 | 0;
          var $30 = _skip($29);
          var $31 = _parse_value($13, $30);
          var $32 = _skip($31);
          if (($32 | 0) == 0) {
            var $_0 = 0;
            break;
          }
          var $child_0 = $13;
          var $_01 = $32;
          while (1) {
            var $_01;
            var $child_0;
            var $34 = HEAP8[$_01];
            if ($34 << 24 >> 24 == 44) {
              var $36 = _cJSON_New_Item();
              if (($36 | 0) == 0) {
                var $_0 = 0;
                break $_$18;
              }
              HEAP32[$child_0 >> 2] = $36;
              HEAP32[$36 + 4 >> 2] = $child_0;
              var $42 = _skip($_01 + 1 | 0);
              var $43 = _parse_string($36, $42);
              var $44 = _skip($43);
              if (($44 | 0) == 0) {
                var $_0 = 0;
                break $_$18;
              }
              var $47 = $36 + 16 | 0;
              var $48 = HEAP32[$47 >> 2];
              HEAP32[$36 + 32 >> 2] = $48;
              HEAP32[$47 >> 2] = 0;
              if (HEAP8[$44] << 24 >> 24 != 58) {
                HEAP32[_ep >> 2] = $44;
                var $_0 = 0;
                break $_$18;
              }
              var $54 = $44 + 1 | 0;
              var $55 = _skip($54);
              var $56 = _parse_value($36, $55);
              var $57 = _skip($56);
              if (($57 | 0) == 0) {
                var $_0 = 0;
                break $_$18;
              }
              var $child_0 = $36;
              var $_01 = $57;
            } else if ($34 << 24 >> 24 == 125) {
              var $_0 = $_01 + 1 | 0;
              break $_$18;
            } else {
              HEAP32[_ep >> 2] = $_01;
              var $_0 = 0;
              break $_$18;
            }
          }
        } else {
          HEAP32[_ep >> 2] = $19;
          var $_0 = 0;
        }
      }
    } else {
      HEAP32[_ep >> 2] = $value;
      var $_0 = 0;
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

_parse_object["X"] = 1;

function _cJSON_New_Item() {
  var $1 = HEAP32[_cJSON_malloc >> 2];
  var $2 = FUNCTION_TABLE[$1](36);
  var $3 = $2;
  if (($2 | 0) != 0) {
    _memset($2, 0, 36, 1);
  }
  return $3;
  return null;
}

function _malloc($bytes) {
  var __label__;
  var $1 = $bytes >>> 0 < 245;
  do {
    if ($1) {
      if ($bytes >>> 0 < 11) {
        var $8 = 16;
      } else {
        var $8 = $bytes + 11 & -8;
      }
      var $8;
      var $9 = $8 >>> 3;
      var $10 = HEAPU32[__gm_ >> 2];
      var $11 = $10 >>> ($9 >>> 0);
      if (($11 & 3 | 0) != 0) {
        var $17 = ($11 & 1 ^ 1) + $9 | 0;
        var $18 = $17 << 1;
        var $20 = ($18 << 2) + __gm_ + 40 | 0;
        var $21 = ($18 + 2 << 2) + __gm_ + 40 | 0;
        var $22 = HEAPU32[$21 >> 2];
        var $23 = $22 + 8 | 0;
        var $24 = HEAPU32[$23 >> 2];
        if (($20 | 0) == ($24 | 0)) {
          HEAP32[__gm_ >> 2] = $10 & (1 << $17 ^ -1);
        } else {
          if ($24 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
            _abort();
            throw "Reached an unreachable!";
          } else {
            HEAP32[$21 >> 2] = $24;
            HEAP32[$24 + 12 >> 2] = $20;
          }
        }
        var $38 = $17 << 3;
        HEAP32[$22 + 4 >> 2] = $38 | 3;
        var $43 = $22 + ($38 | 4) | 0;
        var $45 = HEAP32[$43 >> 2] | 1;
        HEAP32[$43 >> 2] = $45;
        var $mem_0 = $23;
        __label__ = 38;
        break;
      }
      if ($8 >>> 0 <= HEAPU32[__gm_ + 8 >> 2] >>> 0) {
        var $nb_0 = $8;
        __label__ = 30;
        break;
      }
      if (($11 | 0) != 0) {
        var $54 = 2 << $9;
        var $57 = $11 << $9 & ($54 | -$54);
        var $60 = ($57 & -$57) - 1 | 0;
        var $62 = $60 >>> 12 & 16;
        var $63 = $60 >>> ($62 >>> 0);
        var $65 = $63 >>> 5 & 8;
        var $66 = $63 >>> ($65 >>> 0);
        var $68 = $66 >>> 2 & 4;
        var $69 = $66 >>> ($68 >>> 0);
        var $71 = $69 >>> 1 & 2;
        var $72 = $69 >>> ($71 >>> 0);
        var $74 = $72 >>> 1 & 1;
        var $80 = ($65 | $62 | $68 | $71 | $74) + ($72 >>> ($74 >>> 0)) | 0;
        var $81 = $80 << 1;
        var $83 = ($81 << 2) + __gm_ + 40 | 0;
        var $84 = ($81 + 2 << 2) + __gm_ + 40 | 0;
        var $85 = HEAPU32[$84 >> 2];
        var $86 = $85 + 8 | 0;
        var $87 = HEAPU32[$86 >> 2];
        if (($83 | 0) == ($87 | 0)) {
          HEAP32[__gm_ >> 2] = $10 & (1 << $80 ^ -1);
        } else {
          if ($87 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
            _abort();
            throw "Reached an unreachable!";
          } else {
            HEAP32[$84 >> 2] = $87;
            HEAP32[$87 + 12 >> 2] = $83;
          }
        }
        var $101 = $80 << 3;
        var $102 = $101 - $8 | 0;
        HEAP32[$85 + 4 >> 2] = $8 | 3;
        var $105 = $85;
        var $107 = $105 + $8 | 0;
        HEAP32[$105 + ($8 | 4) >> 2] = $102 | 1;
        HEAP32[$105 + $101 >> 2] = $102;
        var $113 = HEAPU32[__gm_ + 8 >> 2];
        if (($113 | 0) != 0) {
          var $116 = HEAP32[__gm_ + 20 >> 2];
          var $119 = $113 >>> 2 & 1073741822;
          var $121 = ($119 << 2) + __gm_ + 40 | 0;
          var $122 = HEAPU32[__gm_ >> 2];
          var $123 = 1 << ($113 >>> 3);
          var $125 = ($122 & $123 | 0) == 0;
          do {
            if ($125) {
              HEAP32[__gm_ >> 2] = $122 | $123;
              var $F4_0 = $121;
              var $_pre_phi = ($119 + 2 << 2) + __gm_ + 40 | 0;
            } else {
              var $129 = ($119 + 2 << 2) + __gm_ + 40 | 0;
              var $130 = HEAPU32[$129 >> 2];
              if ($130 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                var $F4_0 = $130;
                var $_pre_phi = $129;
                break;
              }
              _abort();
              throw "Reached an unreachable!";
            }
          } while (0);
          var $_pre_phi;
          var $F4_0;
          HEAP32[$_pre_phi >> 2] = $116;
          HEAP32[$F4_0 + 12 >> 2] = $116;
          var $137 = $116 + 8 | 0;
          HEAP32[$137 >> 2] = $F4_0;
          var $138 = $116 + 12 | 0;
          HEAP32[$138 >> 2] = $121;
        }
        HEAP32[__gm_ + 8 >> 2] = $102;
        HEAP32[__gm_ + 20 >> 2] = $107;
        var $mem_0 = $86;
        __label__ = 38;
        break;
      }
      if ((HEAP32[__gm_ + 4 >> 2] | 0) == 0) {
        var $nb_0 = $8;
        __label__ = 30;
        break;
      }
      var $145 = _tmalloc_small($8);
      if (($145 | 0) == 0) {
        var $nb_0 = $8;
        __label__ = 30;
        break;
      }
      var $mem_0 = $145;
      __label__ = 38;
      break;
    } else {
      if ($bytes >>> 0 > 4294967231) {
        var $nb_0 = -1;
        __label__ = 30;
        break;
      }
      var $151 = $bytes + 11 & -8;
      if ((HEAP32[__gm_ + 4 >> 2] | 0) == 0) {
        var $nb_0 = $151;
        __label__ = 30;
        break;
      }
      var $155 = _tmalloc_large($151);
      if (($155 | 0) == 0) {
        var $nb_0 = $151;
        __label__ = 30;
        break;
      }
      var $mem_0 = $155;
      __label__ = 38;
      break;
    }
  } while (0);
  if (__label__ == 30) {
    var $nb_0;
    var $157 = HEAPU32[__gm_ + 8 >> 2];
    if ($nb_0 >>> 0 > $157 >>> 0) {
      var $186 = HEAPU32[__gm_ + 12 >> 2];
      if ($nb_0 >>> 0 < $186 >>> 0) {
        var $189 = $186 - $nb_0 | 0;
        HEAP32[__gm_ + 12 >> 2] = $189;
        var $190 = HEAPU32[__gm_ + 24 >> 2];
        var $191 = $190;
        HEAP32[__gm_ + 24 >> 2] = $191 + $nb_0 | 0;
        HEAP32[$nb_0 + ($191 + 4) >> 2] = $189 | 1;
        HEAP32[$190 + 4 >> 2] = $nb_0 | 3;
        var $mem_0 = $190 + 8 | 0;
      } else {
        var $202 = _sys_alloc($nb_0);
        var $mem_0 = $202;
      }
    } else {
      var $160 = $157 - $nb_0 | 0;
      var $161 = HEAPU32[__gm_ + 20 >> 2];
      if ($160 >>> 0 > 15) {
        var $164 = $161;
        HEAP32[__gm_ + 20 >> 2] = $164 + $nb_0 | 0;
        HEAP32[__gm_ + 8 >> 2] = $160;
        HEAP32[$nb_0 + ($164 + 4) >> 2] = $160 | 1;
        HEAP32[$164 + $157 >> 2] = $160;
        HEAP32[$161 + 4 >> 2] = $nb_0 | 3;
      } else {
        HEAP32[__gm_ + 8 >> 2] = 0;
        HEAP32[__gm_ + 20 >> 2] = 0;
        HEAP32[$161 + 4 >> 2] = $157 | 3;
        var $179 = $157 + ($161 + 4) | 0;
        var $181 = HEAP32[$179 >> 2] | 1;
        HEAP32[$179 >> 2] = $181;
      }
      var $mem_0 = $161 + 8 | 0;
    }
  }
  var $mem_0;
  return $mem_0;
  return null;
}

Module["_malloc"] = _malloc;

_malloc["X"] = 1;

function _tmalloc_small($nb) {
  var $R_1$s2;
  var $v_0_ph$s2;
  var __label__;
  var $1 = HEAP32[__gm_ + 4 >> 2];
  var $4 = ($1 & -$1) - 1 | 0;
  var $6 = $4 >>> 12 & 16;
  var $7 = $4 >>> ($6 >>> 0);
  var $9 = $7 >>> 5 & 8;
  var $10 = $7 >>> ($9 >>> 0);
  var $12 = $10 >>> 2 & 4;
  var $13 = $10 >>> ($12 >>> 0);
  var $15 = $13 >>> 1 & 2;
  var $16 = $13 >>> ($15 >>> 0);
  var $18 = $16 >>> 1 & 1;
  var $26 = HEAPU32[__gm_ + (($9 | $6 | $12 | $15 | $18) + ($16 >>> ($18 >>> 0)) << 2) + 304 >> 2];
  var $v_0_ph = $26, $v_0_ph$s2 = $v_0_ph >> 2;
  var $rsize_0_ph = (HEAP32[$26 + 4 >> 2] & -8) - $nb | 0;
  $_$98 : while (1) {
    var $rsize_0_ph;
    var $v_0_ph;
    var $t_0 = $v_0_ph;
    while (1) {
      var $t_0;
      var $33 = HEAP32[$t_0 + 16 >> 2];
      if (($33 | 0) == 0) {
        var $37 = HEAP32[$t_0 + 20 >> 2];
        if (($37 | 0) == 0) {
          break $_$98;
        }
        var $39 = $37;
      } else {
        var $39 = $33;
      }
      var $39;
      var $43 = (HEAP32[$39 + 4 >> 2] & -8) - $nb | 0;
      if ($43 >>> 0 < $rsize_0_ph >>> 0) {
        var $v_0_ph = $39, $v_0_ph$s2 = $v_0_ph >> 2;
        var $rsize_0_ph = $43;
        continue $_$98;
      }
      var $t_0 = $39;
    }
  }
  var $46 = $v_0_ph;
  var $47 = HEAPU32[__gm_ + 16 >> 2];
  var $48 = $46 >>> 0 < $47 >>> 0;
  do {
    if (!$48) {
      var $50 = $46 + $nb | 0;
      var $51 = $50;
      if ($46 >>> 0 >= $50 >>> 0) {
        break;
      }
      var $55 = HEAPU32[$v_0_ph$s2 + 6];
      var $57 = HEAPU32[$v_0_ph$s2 + 3];
      var $58 = ($57 | 0) == ($v_0_ph | 0);
      do {
        if ($58) {
          var $69 = $v_0_ph + 20 | 0;
          var $70 = HEAP32[$69 >> 2];
          if (($70 | 0) == 0) {
            var $73 = $v_0_ph + 16 | 0;
            var $74 = HEAP32[$73 >> 2];
            if (($74 | 0) == 0) {
              var $R_1 = 0, $R_1$s2 = $R_1 >> 2;
              break;
            }
            var $RP_0 = $73;
            var $R_0 = $74;
          } else {
            var $RP_0 = $69;
            var $R_0 = $70;
            __label__ = 14;
          }
          while (1) {
            var $R_0;
            var $RP_0;
            var $76 = $R_0 + 20 | 0;
            var $77 = HEAP32[$76 >> 2];
            if (($77 | 0) != 0) {
              var $RP_0 = $76;
              var $R_0 = $77;
              continue;
            }
            var $80 = $R_0 + 16 | 0;
            var $81 = HEAPU32[$80 >> 2];
            if (($81 | 0) == 0) {
              break;
            }
            var $RP_0 = $80;
            var $R_0 = $81;
          }
          if ($RP_0 >>> 0 < $47 >>> 0) {
            _abort();
            throw "Reached an unreachable!";
          } else {
            HEAP32[$RP_0 >> 2] = 0;
            var $R_1 = $R_0, $R_1$s2 = $R_1 >> 2;
          }
        } else {
          var $61 = HEAPU32[$v_0_ph$s2 + 2];
          if ($61 >>> 0 < $47 >>> 0) {
            _abort();
            throw "Reached an unreachable!";
          } else {
            HEAP32[$61 + 12 >> 2] = $57;
            HEAP32[$57 + 8 >> 2] = $61;
            var $R_1 = $57, $R_1$s2 = $R_1 >> 2;
          }
        }
      } while (0);
      var $R_1;
      var $89 = ($55 | 0) == 0;
      $_$125 : do {
        if (!$89) {
          var $91 = $v_0_ph + 28 | 0;
          var $93 = (HEAP32[$91 >> 2] << 2) + __gm_ + 304 | 0;
          var $95 = ($v_0_ph | 0) == (HEAP32[$93 >> 2] | 0);
          do {
            if ($95) {
              HEAP32[$93 >> 2] = $R_1;
              if (($R_1 | 0) != 0) {
                break;
              }
              var $101 = HEAP32[__gm_ + 4 >> 2] & (1 << HEAP32[$91 >> 2] ^ -1);
              HEAP32[__gm_ + 4 >> 2] = $101;
              break $_$125;
            }
            if ($55 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
              _abort();
              throw "Reached an unreachable!";
            } else {
              var $107 = $55 + 16 | 0;
              if ((HEAP32[$107 >> 2] | 0) == ($v_0_ph | 0)) {
                HEAP32[$107 >> 2] = $R_1;
              } else {
                HEAP32[$55 + 20 >> 2] = $R_1;
              }
              if (($R_1 | 0) == 0) {
                break $_$125;
              }
            }
          } while (0);
          if ($R_1 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
            _abort();
            throw "Reached an unreachable!";
          } else {
            HEAP32[$R_1$s2 + 6] = $55;
            var $123 = HEAPU32[$v_0_ph$s2 + 4];
            if (($123 | 0) != 0) {
              if ($123 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                _abort();
                throw "Reached an unreachable!";
              } else {
                HEAP32[$R_1$s2 + 4] = $123;
                HEAP32[$123 + 24 >> 2] = $R_1;
              }
            }
            var $135 = HEAPU32[$v_0_ph$s2 + 5];
            if (($135 | 0) == 0) {
              break;
            }
            if ($135 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
              _abort();
              throw "Reached an unreachable!";
            } else {
              HEAP32[$R_1$s2 + 5] = $135;
              HEAP32[$135 + 24 >> 2] = $R_1;
            }
          }
        }
      } while (0);
      if ($rsize_0_ph >>> 0 < 16) {
        var $149 = $rsize_0_ph + $nb | 0;
        HEAP32[$v_0_ph$s2 + 1] = $149 | 3;
        var $153 = $149 + ($46 + 4) | 0;
        var $155 = HEAP32[$153 >> 2] | 1;
        HEAP32[$153 >> 2] = $155;
      } else {
        HEAP32[$v_0_ph$s2 + 1] = $nb | 3;
        HEAP32[$nb + ($46 + 4) >> 2] = $rsize_0_ph | 1;
        HEAP32[$46 + $rsize_0_ph + $nb >> 2] = $rsize_0_ph;
        var $164 = HEAPU32[__gm_ + 8 >> 2];
        if (($164 | 0) != 0) {
          var $167 = HEAPU32[__gm_ + 20 >> 2];
          var $170 = $164 >>> 2 & 1073741822;
          var $172 = ($170 << 2) + __gm_ + 40 | 0;
          var $173 = HEAPU32[__gm_ >> 2];
          var $174 = 1 << ($164 >>> 3);
          var $176 = ($173 & $174 | 0) == 0;
          do {
            if ($176) {
              HEAP32[__gm_ >> 2] = $173 | $174;
              var $F1_0 = $172;
              var $_pre_phi = ($170 + 2 << 2) + __gm_ + 40 | 0;
            } else {
              var $180 = ($170 + 2 << 2) + __gm_ + 40 | 0;
              var $181 = HEAPU32[$180 >> 2];
              if ($181 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                var $F1_0 = $181;
                var $_pre_phi = $180;
                break;
              }
              _abort();
              throw "Reached an unreachable!";
            }
          } while (0);
          var $_pre_phi;
          var $F1_0;
          HEAP32[$_pre_phi >> 2] = $167;
          HEAP32[$F1_0 + 12 >> 2] = $167;
          HEAP32[$167 + 8 >> 2] = $F1_0;
          HEAP32[$167 + 12 >> 2] = $172;
        }
        HEAP32[__gm_ + 8 >> 2] = $rsize_0_ph;
        HEAP32[__gm_ + 20 >> 2] = $51;
      }
      return $v_0_ph + 8 | 0;
    }
  } while (0);
  _abort();
  throw "Reached an unreachable!";
  return null;
}

_tmalloc_small["X"] = 1;

function _sys_alloc($nb) {
  var $sp_0$s2;
  var __label__;
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    _init_mparams();
  }
  var $7 = (HEAP32[__gm_ + 440 >> 2] & 4 | 0) == 0;
  do {
    if ($7) {
      var $9 = HEAP32[__gm_ + 24 >> 2];
      var $10 = ($9 | 0) == 0;
      do {
        if ($10) {
          __label__ = 6;
        } else {
          var $12 = $9;
          var $13 = _segment_holding($12);
          if (($13 | 0) == 0) {
            __label__ = 6;
            break;
          }
          var $41 = HEAP32[_mparams + 8 >> 2];
          var $46 = $nb + 47 - HEAP32[__gm_ + 12 >> 2] + $41 & -$41;
          if ($46 >>> 0 >= 2147483647) {
            __label__ = 14;
            break;
          }
          var $49 = _sbrk($46);
          if (($49 | 0) == (HEAP32[$13 >> 2] + HEAP32[$13 + 4 >> 2] | 0)) {
            var $tbase_0 = $49;
            var $asize_1 = $46;
            var $br_0 = $49;
            __label__ = 13;
            break;
          }
          var $br_08 = $49;
          var $asize_19 = $46;
          __label__ = 15;
          break;
        }
      } while (0);
      do {
        if (__label__ == 6) {
          var $15 = _sbrk(0);
          if (($15 | 0) == -1) {
            __label__ = 14;
            break;
          }
          var $18 = HEAP32[_mparams + 8 >> 2];
          var $22 = $18 + ($nb + 47) & -$18;
          var $23 = $15;
          var $24 = HEAP32[_mparams + 4 >> 2];
          var $25 = $24 - 1 | 0;
          if (($25 & $23 | 0) == 0) {
            var $asize_0 = $22;
          } else {
            var $asize_0 = $22 - $23 + ($25 + $23 & -$24) | 0;
          }
          var $asize_0;
          if ($asize_0 >>> 0 >= 2147483647) {
            __label__ = 14;
            break;
          }
          var $37 = _sbrk($asize_0);
          if (($37 | 0) == ($15 | 0)) {
            var $tbase_0 = $15;
            var $asize_1 = $asize_0;
            var $br_0 = $37;
            __label__ = 13;
            break;
          }
          var $br_08 = $37;
          var $asize_19 = $asize_0;
          __label__ = 15;
          break;
        }
      } while (0);
      if (__label__ == 13) {
        var $br_0;
        var $asize_1;
        var $tbase_0;
        if (($tbase_0 | 0) != -1) {
          var $tsize_220 = $asize_1;
          var $tbase_221 = $tbase_0;
          __label__ = 26;
          break;
        }
        var $br_08 = $br_0;
        var $asize_19 = $asize_1;
      } else if (__label__ == 14) {
        var $59 = HEAP32[__gm_ + 440 >> 2] | 4;
        HEAP32[__gm_ + 440 >> 2] = $59;
        __label__ = 23;
        break;
      }
      var $asize_19;
      var $br_08;
      var $60 = -$asize_19 | 0;
      var $or_cond = ($br_08 | 0) != -1 & $asize_19 >>> 0 < 2147483647;
      do {
        if ($or_cond) {
          if ($asize_19 >>> 0 >= ($nb + 48 | 0) >>> 0) {
            var $asize_2 = $asize_19;
            __label__ = 21;
            break;
          }
          var $67 = HEAP32[_mparams + 8 >> 2];
          var $72 = $nb + 47 - $asize_19 + $67 & -$67;
          if ($72 >>> 0 >= 2147483647) {
            var $asize_2 = $asize_19;
            __label__ = 21;
            break;
          }
          var $75 = _sbrk($72);
          if (($75 | 0) == -1) {
            var $79 = _sbrk($60);
            __label__ = 22;
            break;
          }
          var $asize_2 = $72 + $asize_19 | 0;
          __label__ = 21;
          break;
        } else {
          var $asize_2 = $asize_19;
          __label__ = 21;
        }
      } while (0);
      if (__label__ == 21) {
        var $asize_2;
        if (($br_08 | 0) != -1) {
          var $tsize_220 = $asize_2;
          var $tbase_221 = $br_08;
          __label__ = 26;
          break;
        }
      }
      var $84 = HEAP32[__gm_ + 440 >> 2] | 4;
      HEAP32[__gm_ + 440 >> 2] = $84;
      __label__ = 23;
      break;
    }
    __label__ = 23;
  } while (0);
  do {
    if (__label__ == 23) {
      var $85 = HEAP32[_mparams + 8 >> 2];
      var $89 = $85 + ($nb + 47) & -$85;
      if ($89 >>> 0 >= 2147483647) {
        __label__ = 49;
        break;
      }
      var $92 = _sbrk($89);
      var $93 = _sbrk(0);
      if (!(($93 | 0) != -1 & ($92 | 0) != -1 & $92 >>> 0 < $93 >>> 0)) {
        __label__ = 49;
        break;
      }
      var $98 = $93 - $92 | 0;
      if ($98 >>> 0 <= ($nb + 40 | 0) >>> 0 | ($92 | 0) == -1) {
        __label__ = 49;
        break;
      }
      var $tsize_220 = $98;
      var $tbase_221 = $92;
      __label__ = 26;
      break;
    }
  } while (0);
  $_$151 : do {
    if (__label__ == 26) {
      var $tbase_221;
      var $tsize_220;
      var $103 = HEAP32[__gm_ + 432 >> 2] + $tsize_220 | 0;
      HEAP32[__gm_ + 432 >> 2] = $103;
      if ($103 >>> 0 > HEAPU32[__gm_ + 436 >> 2] >>> 0) {
        HEAP32[__gm_ + 436 >> 2] = $103;
      }
      var $108 = HEAPU32[__gm_ + 24 >> 2];
      var $109 = ($108 | 0) == 0;
      $_$156 : do {
        if ($109) {
          var $111 = HEAPU32[__gm_ + 16 >> 2];
          if (($111 | 0) == 0 | $tbase_221 >>> 0 < $111 >>> 0) {
            HEAP32[__gm_ + 16 >> 2] = $tbase_221;
          }
          HEAP32[__gm_ + 444 >> 2] = $tbase_221;
          HEAP32[__gm_ + 448 >> 2] = $tsize_220;
          HEAP32[__gm_ + 456 >> 2] = 0;
          var $116 = HEAP32[_mparams >> 2];
          HEAP32[__gm_ + 36 >> 2] = $116;
          HEAP32[__gm_ + 32 >> 2] = -1;
          _init_bins();
          _init_top($tbase_221, $tsize_220 - 40 | 0);
        } else {
          var $sp_0 = __gm_ + 444 | 0, $sp_0$s2 = $sp_0 >> 2;
          while (1) {
            var $sp_0;
            if (($sp_0 | 0) == 0) {
              break;
            }
            var $122 = HEAPU32[$sp_0$s2];
            var $123 = $sp_0 + 4 | 0;
            var $124 = HEAPU32[$123 >> 2];
            var $125 = $122 + $124 | 0;
            if (($tbase_221 | 0) == ($125 | 0)) {
              if ((HEAP32[$sp_0$s2 + 3] & 8 | 0) != 0) {
                break;
              }
              var $135 = $108;
              if (!($135 >>> 0 >= $122 >>> 0 & $135 >>> 0 < $125 >>> 0)) {
                break;
              }
              HEAP32[$123 >> 2] = $124 + $tsize_220 | 0;
              var $140 = HEAP32[__gm_ + 24 >> 2];
              var $142 = HEAP32[__gm_ + 12 >> 2] + $tsize_220 | 0;
              _init_top($140, $142);
              break $_$156;
            }
            var $sp_0 = HEAP32[$sp_0$s2 + 2], $sp_0$s2 = $sp_0 >> 2;
          }
          if ($tbase_221 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
            HEAP32[__gm_ + 16 >> 2] = $tbase_221;
          }
          var $146 = $tbase_221 + $tsize_220 | 0;
          var $sp_1 = __gm_ + 444 | 0;
          while (1) {
            var $sp_1;
            if (($sp_1 | 0) == 0) {
              break;
            }
            var $150 = $sp_1 | 0;
            var $151 = HEAPU32[$150 >> 2];
            if (($151 | 0) == ($146 | 0)) {
              if ((HEAP32[$sp_1 + 12 >> 2] & 8 | 0) != 0) {
                break;
              }
              HEAP32[$150 >> 2] = $tbase_221;
              var $161 = $sp_1 + 4 | 0;
              var $163 = HEAP32[$161 >> 2] + $tsize_220 | 0;
              HEAP32[$161 >> 2] = $163;
              var $164 = _prepend_alloc($tbase_221, $151, $nb);
              var $_0 = $164;
              __label__ = 50;
              break $_$151;
            }
            var $sp_1 = HEAP32[$sp_1 + 8 >> 2];
          }
          _add_segment($tbase_221, $tsize_220);
        }
      } while (0);
      var $166 = HEAPU32[__gm_ + 12 >> 2];
      if ($166 >>> 0 <= $nb >>> 0) {
        __label__ = 49;
        break;
      }
      var $169 = $166 - $nb | 0;
      HEAP32[__gm_ + 12 >> 2] = $169;
      var $170 = HEAPU32[__gm_ + 24 >> 2];
      var $171 = $170;
      HEAP32[__gm_ + 24 >> 2] = $171 + $nb | 0;
      HEAP32[$nb + ($171 + 4) >> 2] = $169 | 1;
      HEAP32[$170 + 4 >> 2] = $nb | 3;
      var $_0 = $170 + 8 | 0;
      __label__ = 50;
      break;
    }
  } while (0);
  if (__label__ == 49) {
    var $181 = ___errno();
    HEAP32[$181 >> 2] = 12;
    var $_0 = 0;
  }
  var $_0;
  return $_0;
  return null;
}

_sys_alloc["X"] = 1;

function _tmalloc_large($nb) {
  var $R_1$s2;
  var $113$s2;
  var $t_224$s2;
  var $v_3_lcssa$s2;
  var $t_0$s2;
  var $nb$s2 = $nb >> 2;
  var __label__;
  var $1 = -$nb | 0;
  var $2 = $nb >>> 8;
  var $3 = ($2 | 0) == 0;
  do {
    if ($3) {
      var $idx_0 = 0;
    } else {
      if ($nb >>> 0 > 16777215) {
        var $idx_0 = 31;
        break;
      }
      var $9 = ($2 + 1048320 | 0) >>> 16 & 8;
      var $10 = $2 << $9;
      var $13 = ($10 + 520192 | 0) >>> 16 & 4;
      var $14 = $10 << $13;
      var $17 = ($14 + 245760 | 0) >>> 16 & 2;
      var $23 = 14 - ($13 | $9 | $17) + ($14 << $17 >>> 15) | 0;
      var $idx_0 = $nb >>> (($23 + 7 | 0) >>> 0) & 1 | $23 << 1;
    }
  } while (0);
  var $idx_0;
  var $31 = HEAPU32[__gm_ + ($idx_0 << 2) + 304 >> 2];
  var $32 = ($31 | 0) == 0;
  $_$6 : do {
    if ($32) {
      var $v_2 = 0;
      var $rsize_2 = $1;
      var $t_1 = 0;
    } else {
      if (($idx_0 | 0) == 31) {
        var $39 = 0;
      } else {
        var $39 = 25 - ($idx_0 >>> 1) | 0;
      }
      var $39;
      var $v_0 = 0;
      var $rsize_0 = $1;
      var $t_0 = $31, $t_0$s2 = $t_0 >> 2;
      var $sizebits_0 = $nb << $39;
      var $rst_0 = 0;
      while (1) {
        var $rst_0;
        var $sizebits_0;
        var $t_0;
        var $rsize_0;
        var $v_0;
        var $44 = HEAP32[$t_0$s2 + 1] & -8;
        var $45 = $44 - $nb | 0;
        if ($45 >>> 0 < $rsize_0 >>> 0) {
          if (($44 | 0) == ($nb | 0)) {
            var $v_2 = $t_0;
            var $rsize_2 = $45;
            var $t_1 = $t_0;
            break $_$6;
          }
          var $v_1 = $t_0;
          var $rsize_1 = $45;
        } else {
          var $v_1 = $v_0;
          var $rsize_1 = $rsize_0;
        }
        var $rsize_1;
        var $v_1;
        var $51 = HEAPU32[$t_0$s2 + 5];
        var $54 = HEAPU32[(($sizebits_0 >>> 31 << 2) + 16 >> 2) + $t_0$s2];
        var $rst_1 = ($51 | 0) == 0 | ($51 | 0) == ($54 | 0) ? $rst_0 : $51;
        if (($54 | 0) == 0) {
          var $v_2 = $v_1;
          var $rsize_2 = $rsize_1;
          var $t_1 = $rst_1;
          break $_$6;
        }
        var $v_0 = $v_1;
        var $rsize_0 = $rsize_1;
        var $t_0 = $54, $t_0$s2 = $t_0 >> 2;
        var $sizebits_0 = $sizebits_0 << 1;
        var $rst_0 = $rst_1;
      }
    }
  } while (0);
  var $t_1;
  var $rsize_2;
  var $v_2;
  var $or_cond19 = ($t_1 | 0) == 0 & ($v_2 | 0) == 0;
  do {
    if ($or_cond19) {
      var $63 = 2 << $idx_0;
      var $67 = HEAP32[__gm_ + 4 >> 2] & ($63 | -$63);
      if (($67 | 0) == 0) {
        var $t_2_ph = $t_1;
        break;
      }
      var $72 = ($67 & -$67) - 1 | 0;
      var $74 = $72 >>> 12 & 16;
      var $75 = $72 >>> ($74 >>> 0);
      var $77 = $75 >>> 5 & 8;
      var $78 = $75 >>> ($77 >>> 0);
      var $80 = $78 >>> 2 & 4;
      var $81 = $78 >>> ($80 >>> 0);
      var $83 = $81 >>> 1 & 2;
      var $84 = $81 >>> ($83 >>> 0);
      var $86 = $84 >>> 1 & 1;
      var $t_2_ph = HEAP32[__gm_ + (($77 | $74 | $80 | $83 | $86) + ($84 >>> ($86 >>> 0)) << 2) + 304 >> 2];
    } else {
      var $t_2_ph = $t_1;
    }
  } while (0);
  var $t_2_ph;
  var $95 = ($t_2_ph | 0) == 0;
  $_$22 : do {
    if ($95) {
      var $rsize_3_lcssa = $rsize_2;
      var $v_3_lcssa = $v_2, $v_3_lcssa$s2 = $v_3_lcssa >> 2;
    } else {
      var $t_224 = $t_2_ph, $t_224$s2 = $t_224 >> 2;
      var $rsize_325 = $rsize_2;
      var $v_326 = $v_2;
      while (1) {
        var $v_326;
        var $rsize_325;
        var $t_224;
        var $99 = (HEAP32[$t_224$s2 + 1] & -8) - $nb | 0;
        var $100 = $99 >>> 0 < $rsize_325 >>> 0;
        var $rsize_4 = $100 ? $99 : $rsize_325;
        var $v_4 = $100 ? $t_224 : $v_326;
        var $102 = HEAPU32[$t_224$s2 + 4];
        if (($102 | 0) != 0) {
          var $t_224 = $102, $t_224$s2 = $t_224 >> 2;
          var $rsize_325 = $rsize_4;
          var $v_326 = $v_4;
          continue;
        }
        var $105 = HEAPU32[$t_224$s2 + 5];
        if (($105 | 0) == 0) {
          var $rsize_3_lcssa = $rsize_4;
          var $v_3_lcssa = $v_4, $v_3_lcssa$s2 = $v_3_lcssa >> 2;
          break $_$22;
        }
        var $t_224 = $105, $t_224$s2 = $t_224 >> 2;
        var $rsize_325 = $rsize_4;
        var $v_326 = $v_4;
      }
    }
  } while (0);
  var $v_3_lcssa;
  var $rsize_3_lcssa;
  var $107 = ($v_3_lcssa | 0) == 0;
  $_$27 : do {
    if ($107) {
      var $_0 = 0;
    } else {
      if ($rsize_3_lcssa >>> 0 >= (HEAP32[__gm_ + 8 >> 2] - $nb | 0) >>> 0) {
        var $_0 = 0;
        break;
      }
      var $113 = $v_3_lcssa, $113$s2 = $113 >> 2;
      var $114 = HEAPU32[__gm_ + 16 >> 2];
      var $115 = $113 >>> 0 < $114 >>> 0;
      do {
        if (!$115) {
          var $117 = $113 + $nb | 0;
          var $118 = $117;
          if ($113 >>> 0 >= $117 >>> 0) {
            break;
          }
          var $122 = HEAPU32[$v_3_lcssa$s2 + 6];
          var $124 = HEAPU32[$v_3_lcssa$s2 + 3];
          var $125 = ($124 | 0) == ($v_3_lcssa | 0);
          do {
            if ($125) {
              var $136 = $v_3_lcssa + 20 | 0;
              var $137 = HEAP32[$136 >> 2];
              if (($137 | 0) == 0) {
                var $140 = $v_3_lcssa + 16 | 0;
                var $141 = HEAP32[$140 >> 2];
                if (($141 | 0) == 0) {
                  var $R_1 = 0, $R_1$s2 = $R_1 >> 2;
                  break;
                }
                var $RP_0 = $140;
                var $R_0 = $141;
              } else {
                var $RP_0 = $136;
                var $R_0 = $137;
                __label__ = 28;
              }
              while (1) {
                var $R_0;
                var $RP_0;
                var $143 = $R_0 + 20 | 0;
                var $144 = HEAP32[$143 >> 2];
                if (($144 | 0) != 0) {
                  var $RP_0 = $143;
                  var $R_0 = $144;
                  continue;
                }
                var $147 = $R_0 + 16 | 0;
                var $148 = HEAPU32[$147 >> 2];
                if (($148 | 0) == 0) {
                  break;
                }
                var $RP_0 = $147;
                var $R_0 = $148;
              }
              if ($RP_0 >>> 0 < $114 >>> 0) {
                _abort();
                throw "Reached an unreachable!";
              } else {
                HEAP32[$RP_0 >> 2] = 0;
                var $R_1 = $R_0, $R_1$s2 = $R_1 >> 2;
              }
            } else {
              var $128 = HEAPU32[$v_3_lcssa$s2 + 2];
              if ($128 >>> 0 < $114 >>> 0) {
                _abort();
                throw "Reached an unreachable!";
              } else {
                HEAP32[$128 + 12 >> 2] = $124;
                HEAP32[$124 + 8 >> 2] = $128;
                var $R_1 = $124, $R_1$s2 = $R_1 >> 2;
              }
            }
          } while (0);
          var $R_1;
          var $156 = ($122 | 0) == 0;
          $_$49 : do {
            if (!$156) {
              var $158 = $v_3_lcssa + 28 | 0;
              var $160 = (HEAP32[$158 >> 2] << 2) + __gm_ + 304 | 0;
              var $162 = ($v_3_lcssa | 0) == (HEAP32[$160 >> 2] | 0);
              do {
                if ($162) {
                  HEAP32[$160 >> 2] = $R_1;
                  if (($R_1 | 0) != 0) {
                    break;
                  }
                  var $168 = HEAP32[__gm_ + 4 >> 2] & (1 << HEAP32[$158 >> 2] ^ -1);
                  HEAP32[__gm_ + 4 >> 2] = $168;
                  break $_$49;
                }
                if ($122 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  var $174 = $122 + 16 | 0;
                  if ((HEAP32[$174 >> 2] | 0) == ($v_3_lcssa | 0)) {
                    HEAP32[$174 >> 2] = $R_1;
                  } else {
                    HEAP32[$122 + 20 >> 2] = $R_1;
                  }
                  if (($R_1 | 0) == 0) {
                    break $_$49;
                  }
                }
              } while (0);
              if ($R_1 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                _abort();
                throw "Reached an unreachable!";
              } else {
                HEAP32[$R_1$s2 + 6] = $122;
                var $190 = HEAPU32[$v_3_lcssa$s2 + 4];
                if (($190 | 0) != 0) {
                  if ($190 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$R_1$s2 + 4] = $190;
                    HEAP32[$190 + 24 >> 2] = $R_1;
                  }
                }
                var $202 = HEAPU32[$v_3_lcssa$s2 + 5];
                if (($202 | 0) == 0) {
                  break;
                }
                if ($202 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  HEAP32[$R_1$s2 + 5] = $202;
                  HEAP32[$202 + 24 >> 2] = $R_1;
                }
              }
            }
          } while (0);
          var $214 = $rsize_3_lcssa >>> 0 < 16;
          $_$77 : do {
            if ($214) {
              var $216 = $rsize_3_lcssa + $nb | 0;
              HEAP32[$v_3_lcssa$s2 + 1] = $216 | 3;
              var $220 = $216 + ($113 + 4) | 0;
              var $222 = HEAP32[$220 >> 2] | 1;
              HEAP32[$220 >> 2] = $222;
            } else {
              HEAP32[$v_3_lcssa$s2 + 1] = $nb | 3;
              HEAP32[$nb$s2 + ($113$s2 + 1)] = $rsize_3_lcssa | 1;
              HEAP32[($rsize_3_lcssa >> 2) + $113$s2 + $nb$s2] = $rsize_3_lcssa;
              if ($rsize_3_lcssa >>> 0 < 256) {
                var $235 = $rsize_3_lcssa >>> 2 & 1073741822;
                var $237 = ($235 << 2) + __gm_ + 40 | 0;
                var $238 = HEAPU32[__gm_ >> 2];
                var $239 = 1 << ($rsize_3_lcssa >>> 3);
                var $241 = ($238 & $239 | 0) == 0;
                do {
                  if ($241) {
                    HEAP32[__gm_ >> 2] = $238 | $239;
                    var $F5_0 = $237;
                    var $_pre_phi = ($235 + 2 << 2) + __gm_ + 40 | 0;
                  } else {
                    var $245 = ($235 + 2 << 2) + __gm_ + 40 | 0;
                    var $246 = HEAPU32[$245 >> 2];
                    if ($246 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      var $F5_0 = $246;
                      var $_pre_phi = $245;
                      break;
                    }
                    _abort();
                    throw "Reached an unreachable!";
                  }
                } while (0);
                var $_pre_phi;
                var $F5_0;
                HEAP32[$_pre_phi >> 2] = $118;
                HEAP32[$F5_0 + 12 >> 2] = $118;
                HEAP32[$nb$s2 + ($113$s2 + 2)] = $F5_0;
                HEAP32[$nb$s2 + ($113$s2 + 3)] = $237;
              } else {
                var $258 = $117;
                var $259 = $rsize_3_lcssa >>> 8;
                var $260 = ($259 | 0) == 0;
                do {
                  if ($260) {
                    var $I7_0 = 0;
                  } else {
                    if ($rsize_3_lcssa >>> 0 > 16777215) {
                      var $I7_0 = 31;
                      break;
                    }
                    var $266 = ($259 + 1048320 | 0) >>> 16 & 8;
                    var $267 = $259 << $266;
                    var $270 = ($267 + 520192 | 0) >>> 16 & 4;
                    var $271 = $267 << $270;
                    var $274 = ($271 + 245760 | 0) >>> 16 & 2;
                    var $280 = 14 - ($270 | $266 | $274) + ($271 << $274 >>> 15) | 0;
                    var $I7_0 = $rsize_3_lcssa >>> (($280 + 7 | 0) >>> 0) & 1 | $280 << 1;
                  }
                } while (0);
                var $I7_0;
                var $287 = ($I7_0 << 2) + __gm_ + 304 | 0;
                HEAP32[$nb$s2 + ($113$s2 + 7)] = $I7_0;
                var $290 = $nb + ($113 + 16) | 0;
                HEAP32[$nb$s2 + ($113$s2 + 5)] = 0;
                HEAP32[$290 >> 2] = 0;
                var $294 = HEAP32[__gm_ + 4 >> 2];
                var $295 = 1 << $I7_0;
                if (($294 & $295 | 0) == 0) {
                  var $299 = $294 | $295;
                  HEAP32[__gm_ + 4 >> 2] = $299;
                  HEAP32[$287 >> 2] = $258;
                  HEAP32[$nb$s2 + ($113$s2 + 6)] = $287;
                  HEAP32[$nb$s2 + ($113$s2 + 3)] = $258;
                  HEAP32[$nb$s2 + ($113$s2 + 2)] = $258;
                } else {
                  if (($I7_0 | 0) == 31) {
                    var $314 = 0;
                  } else {
                    var $314 = 25 - ($I7_0 >>> 1) | 0;
                  }
                  var $314;
                  var $K12_0 = $rsize_3_lcssa << $314;
                  var $T_0 = HEAP32[$287 >> 2];
                  while (1) {
                    var $T_0;
                    var $K12_0;
                    if ((HEAP32[$T_0 + 4 >> 2] & -8 | 0) == ($rsize_3_lcssa | 0)) {
                      var $341 = $T_0 + 8 | 0;
                      var $342 = HEAPU32[$341 >> 2];
                      var $344 = HEAPU32[__gm_ + 16 >> 2];
                      var $345 = $T_0 >>> 0 < $344 >>> 0;
                      do {
                        if (!$345) {
                          if ($342 >>> 0 < $344 >>> 0) {
                            break;
                          }
                          HEAP32[$342 + 12 >> 2] = $258;
                          HEAP32[$341 >> 2] = $258;
                          HEAP32[$nb$s2 + ($113$s2 + 2)] = $342;
                          HEAP32[$nb$s2 + ($113$s2 + 3)] = $T_0;
                          HEAP32[$nb$s2 + ($113$s2 + 6)] = 0;
                          break $_$77;
                        }
                      } while (0);
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      var $323 = ($K12_0 >>> 31 << 2) + $T_0 + 16 | 0;
                      var $324 = HEAPU32[$323 >> 2];
                      if (($324 | 0) == 0) {
                        if ($323 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                          HEAP32[$323 >> 2] = $258;
                          HEAP32[$nb$s2 + ($113$s2 + 6)] = $T_0;
                          HEAP32[$nb$s2 + ($113$s2 + 3)] = $258;
                          HEAP32[$nb$s2 + ($113$s2 + 2)] = $258;
                          break $_$77;
                        }
                        _abort();
                        throw "Reached an unreachable!";
                      } else {
                        var $K12_0 = $K12_0 << 1;
                        var $T_0 = $324;
                      }
                    }
                  }
                }
              }
            }
          } while (0);
          var $_0 = $v_3_lcssa + 8 | 0;
          break $_$27;
        }
      } while (0);
      _abort();
      throw "Reached an unreachable!";
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

_tmalloc_large["X"] = 1;

function _sys_trim($pad) {
  var $31$s2;
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    _init_mparams();
  }
  var $5 = $pad >>> 0 < 4294967232;
  $_$183 : do {
    if ($5) {
      var $7 = HEAPU32[__gm_ + 24 >> 2];
      if (($7 | 0) == 0) {
        var $released_2 = 0;
        break;
      }
      var $11 = HEAPU32[__gm_ + 12 >> 2];
      var $12 = $11 >>> 0 > ($pad + 40 | 0) >>> 0;
      do {
        if ($12) {
          var $14 = HEAPU32[_mparams + 8 >> 2];
          var $17 = -40 - $pad - 1 + $11 + $14 | 0;
          var $18 = Math.floor(($17 >>> 0) / ($14 >>> 0));
          var $20 = ($18 - 1) * $14 | 0;
          var $21 = $7;
          var $22 = _segment_holding($21);
          if ((HEAP32[$22 + 12 >> 2] & 8 | 0) != 0) {
            break;
          }
          var $28 = _sbrk(0);
          var $31$s2 = ($22 + 4 | 0) >> 2;
          if (($28 | 0) != (HEAP32[$22 >> 2] + HEAP32[$31$s2] | 0)) {
            break;
          }
          var $_ = $20 >>> 0 > 2147483646 ? -2147483648 - $14 | 0 : $20;
          var $38 = -$_ | 0;
          var $39 = _sbrk($38);
          var $40 = _sbrk(0);
          if (!(($39 | 0) != -1 & $40 >>> 0 < $28 >>> 0)) {
            break;
          }
          var $46 = $28 - $40 | 0;
          if (($28 | 0) == ($40 | 0)) {
            break;
          }
          var $50 = HEAP32[$31$s2] - $46 | 0;
          HEAP32[$31$s2] = $50;
          var $52 = HEAP32[__gm_ + 432 >> 2] - $46 | 0;
          HEAP32[__gm_ + 432 >> 2] = $52;
          var $53 = HEAP32[__gm_ + 24 >> 2];
          var $55 = HEAP32[__gm_ + 12 >> 2] - $46 | 0;
          _init_top($53, $55);
          var $released_2 = ($28 | 0) != ($40 | 0);
          break $_$183;
        }
      } while (0);
      if (HEAPU32[__gm_ + 12 >> 2] >>> 0 <= HEAPU32[__gm_ + 28 >> 2] >>> 0) {
        var $released_2 = 0;
        break;
      }
      HEAP32[__gm_ + 28 >> 2] = -1;
      var $released_2 = 0;
    } else {
      var $released_2 = 0;
    }
  } while (0);
  var $released_2;
  return $released_2 & 1;
  return null;
}

_sys_trim["X"] = 1;

function _free($mem) {
  var $R7_1$s2;
  var $R_1$s2;
  var $p_0$s2;
  var $165$s2;
  var $_sum2$s2;
  var $14$s2;
  var $mem$s2 = $mem >> 2;
  var __label__;
  var $1 = ($mem | 0) == 0;
  $_$2 : do {
    if (!$1) {
      var $3 = $mem - 8 | 0;
      var $4 = $3;
      var $5 = HEAPU32[__gm_ + 16 >> 2];
      var $6 = $3 >>> 0 < $5 >>> 0;
      $_$4 : do {
        if (!$6) {
          var $10 = HEAPU32[$mem - 4 >> 2];
          var $11 = $10 & 3;
          if (($11 | 0) == 1) {
            break;
          }
          var $14 = $10 & -8, $14$s2 = $14 >> 2;
          var $15 = $mem + ($14 - 8) | 0;
          var $16 = $15;
          var $18 = ($10 & 1 | 0) == 0;
          $_$7 : do {
            if ($18) {
              var $21 = HEAPU32[$3 >> 2];
              if (($11 | 0) == 0) {
                break $_$2;
              }
              var $_sum2 = -8 - $21 | 0, $_sum2$s2 = $_sum2 >> 2;
              var $24 = $mem + $_sum2 | 0;
              var $25 = $24;
              var $26 = $21 + $14 | 0;
              if ($24 >>> 0 < $5 >>> 0) {
                break $_$4;
              }
              if (($25 | 0) == (HEAP32[__gm_ + 20 >> 2] | 0)) {
                var $165$s2 = ($mem + ($14 - 4) | 0) >> 2;
                if ((HEAP32[$165$s2] & 3 | 0) != 3) {
                  var $p_0 = $25, $p_0$s2 = $p_0 >> 2;
                  var $psize_0 = $26;
                  break;
                }
                HEAP32[__gm_ + 8 >> 2] = $26;
                var $171 = HEAP32[$165$s2] & -2;
                HEAP32[$165$s2] = $171;
                HEAP32[$_sum2$s2 + ($mem$s2 + 1)] = $26 | 1;
                HEAP32[$15 >> 2] = $26;
                break $_$2;
              }
              if ($21 >>> 0 < 256) {
                var $37 = HEAPU32[$_sum2$s2 + ($mem$s2 + 2)];
                var $40 = HEAPU32[$_sum2$s2 + ($mem$s2 + 3)];
                if (($37 | 0) == ($40 | 0)) {
                  var $46 = HEAP32[__gm_ >> 2] & (1 << ($21 >>> 3) ^ -1);
                  HEAP32[__gm_ >> 2] = $46;
                  var $p_0 = $25, $p_0$s2 = $p_0 >> 2;
                  var $psize_0 = $26;
                } else {
                  var $51 = (($21 >>> 2 & 1073741822) << 2) + __gm_ + 40 | 0;
                  var $or_cond = ($37 | 0) != ($51 | 0) & $37 >>> 0 < $5 >>> 0;
                  do {
                    if (!$or_cond) {
                      if (!(($40 | 0) == ($51 | 0) | $40 >>> 0 >= $5 >>> 0)) {
                        break;
                      }
                      HEAP32[$37 + 12 >> 2] = $40;
                      HEAP32[$40 + 8 >> 2] = $37;
                      var $p_0 = $25, $p_0$s2 = $p_0 >> 2;
                      var $psize_0 = $26;
                      break $_$7;
                    }
                  } while (0);
                  _abort();
                  throw "Reached an unreachable!";
                }
              } else {
                var $62 = $24;
                var $65 = HEAPU32[$_sum2$s2 + ($mem$s2 + 6)];
                var $68 = HEAPU32[$_sum2$s2 + ($mem$s2 + 3)];
                var $69 = ($68 | 0) == ($62 | 0);
                do {
                  if ($69) {
                    var $82 = $_sum2 + ($mem + 20) | 0;
                    var $83 = HEAP32[$82 >> 2];
                    if (($83 | 0) == 0) {
                      var $87 = $_sum2 + ($mem + 16) | 0;
                      var $88 = HEAP32[$87 >> 2];
                      if (($88 | 0) == 0) {
                        var $R_1 = 0, $R_1$s2 = $R_1 >> 2;
                        break;
                      }
                      var $RP_0 = $87;
                      var $R_0 = $88;
                    } else {
                      var $RP_0 = $82;
                      var $R_0 = $83;
                      __label__ = 21;
                    }
                    while (1) {
                      var $R_0;
                      var $RP_0;
                      var $90 = $R_0 + 20 | 0;
                      var $91 = HEAP32[$90 >> 2];
                      if (($91 | 0) != 0) {
                        var $RP_0 = $90;
                        var $R_0 = $91;
                        continue;
                      }
                      var $94 = $R_0 + 16 | 0;
                      var $95 = HEAPU32[$94 >> 2];
                      if (($95 | 0) == 0) {
                        break;
                      }
                      var $RP_0 = $94;
                      var $R_0 = $95;
                    }
                    if ($RP_0 >>> 0 < $5 >>> 0) {
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      HEAP32[$RP_0 >> 2] = 0;
                      var $R_1 = $R_0, $R_1$s2 = $R_1 >> 2;
                    }
                  } else {
                    var $73 = HEAPU32[$_sum2$s2 + ($mem$s2 + 2)];
                    if ($73 >>> 0 < $5 >>> 0) {
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      HEAP32[$73 + 12 >> 2] = $68;
                      HEAP32[$68 + 8 >> 2] = $73;
                      var $R_1 = $68, $R_1$s2 = $R_1 >> 2;
                    }
                  }
                } while (0);
                var $R_1;
                if (($65 | 0) == 0) {
                  var $p_0 = $25, $p_0$s2 = $p_0 >> 2;
                  var $psize_0 = $26;
                  break;
                }
                var $106 = $_sum2 + ($mem + 28) | 0;
                var $108 = (HEAP32[$106 >> 2] << 2) + __gm_ + 304 | 0;
                var $110 = ($62 | 0) == (HEAP32[$108 >> 2] | 0);
                do {
                  if ($110) {
                    HEAP32[$108 >> 2] = $R_1;
                    if (($R_1 | 0) != 0) {
                      break;
                    }
                    var $116 = HEAP32[__gm_ + 4 >> 2] & (1 << HEAP32[$106 >> 2] ^ -1);
                    HEAP32[__gm_ + 4 >> 2] = $116;
                    var $p_0 = $25, $p_0$s2 = $p_0 >> 2;
                    var $psize_0 = $26;
                    break $_$7;
                  }
                  if ($65 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    var $122 = $65 + 16 | 0;
                    if ((HEAP32[$122 >> 2] | 0) == ($62 | 0)) {
                      HEAP32[$122 >> 2] = $R_1;
                    } else {
                      HEAP32[$65 + 20 >> 2] = $R_1;
                    }
                    if (($R_1 | 0) == 0) {
                      var $p_0 = $25, $p_0$s2 = $p_0 >> 2;
                      var $psize_0 = $26;
                      break $_$7;
                    }
                  }
                } while (0);
                if ($R_1 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  HEAP32[$R_1$s2 + 6] = $65;
                  var $139 = HEAPU32[$_sum2$s2 + ($mem$s2 + 4)];
                  if (($139 | 0) != 0) {
                    if ($139 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      HEAP32[$R_1$s2 + 4] = $139;
                      HEAP32[$139 + 24 >> 2] = $R_1;
                    }
                  }
                  var $152 = HEAPU32[$_sum2$s2 + ($mem$s2 + 5)];
                  if (($152 | 0) == 0) {
                    var $p_0 = $25, $p_0$s2 = $p_0 >> 2;
                    var $psize_0 = $26;
                    break;
                  }
                  if ($152 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$R_1$s2 + 5] = $152;
                    HEAP32[$152 + 24 >> 2] = $R_1;
                    var $p_0 = $25, $p_0$s2 = $p_0 >> 2;
                    var $psize_0 = $26;
                  }
                }
              }
            } else {
              var $p_0 = $4, $p_0$s2 = $p_0 >> 2;
              var $psize_0 = $14;
            }
          } while (0);
          var $psize_0;
          var $p_0;
          var $177 = $p_0;
          if ($177 >>> 0 >= $15 >>> 0) {
            break;
          }
          var $181 = $mem + ($14 - 4) | 0;
          var $182 = HEAPU32[$181 >> 2];
          if (($182 & 1 | 0) == 0) {
            break;
          }
          var $187 = ($182 & 2 | 0) == 0;
          do {
            if ($187) {
              if (($16 | 0) == (HEAP32[__gm_ + 24 >> 2] | 0)) {
                var $193 = HEAP32[__gm_ + 12 >> 2] + $psize_0 | 0;
                HEAP32[__gm_ + 12 >> 2] = $193;
                HEAP32[__gm_ + 24 >> 2] = $p_0;
                var $194 = $193 | 1;
                HEAP32[$p_0$s2 + 1] = $194;
                if (($p_0 | 0) == (HEAP32[__gm_ + 20 >> 2] | 0)) {
                  HEAP32[__gm_ + 20 >> 2] = 0;
                  HEAP32[__gm_ + 8 >> 2] = 0;
                }
                if ($193 >>> 0 <= HEAPU32[__gm_ + 28 >> 2] >>> 0) {
                  break $_$2;
                }
                var $203 = _sys_trim(0);
                break $_$2;
              }
              if (($16 | 0) == (HEAP32[__gm_ + 20 >> 2] | 0)) {
                var $209 = HEAP32[__gm_ + 8 >> 2] + $psize_0 | 0;
                HEAP32[__gm_ + 8 >> 2] = $209;
                HEAP32[__gm_ + 20 >> 2] = $p_0;
                var $210 = $209 | 1;
                HEAP32[$p_0$s2 + 1] = $210;
                var $213 = $177 + $209 | 0;
                HEAP32[$213 >> 2] = $209;
                break $_$2;
              }
              var $216 = ($182 & -8) + $psize_0 | 0;
              var $217 = $182 >>> 3;
              var $218 = $182 >>> 0 < 256;
              $_$82 : do {
                if ($218) {
                  var $222 = HEAPU32[$mem$s2 + $14$s2];
                  var $225 = HEAPU32[(($14 | 4) >> 2) + $mem$s2];
                  if (($222 | 0) == ($225 | 0)) {
                    var $231 = HEAP32[__gm_ >> 2] & (1 << $217 ^ -1);
                    HEAP32[__gm_ >> 2] = $231;
                  } else {
                    var $236 = (($182 >>> 2 & 1073741822) << 2) + __gm_ + 40 | 0;
                    var $237 = ($222 | 0) == ($236 | 0);
                    do {
                      if ($237) {
                        __label__ = 63;
                      } else {
                        if ($222 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                          __label__ = 66;
                          break;
                        }
                        __label__ = 63;
                        break;
                      }
                    } while (0);
                    do {
                      if (__label__ == 63) {
                        if (($225 | 0) != ($236 | 0)) {
                          if ($225 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                            break;
                          }
                        }
                        HEAP32[$222 + 12 >> 2] = $225;
                        HEAP32[$225 + 8 >> 2] = $222;
                        break $_$82;
                      }
                    } while (0);
                    _abort();
                    throw "Reached an unreachable!";
                  }
                } else {
                  var $251 = $15;
                  var $254 = HEAPU32[$14$s2 + ($mem$s2 + 4)];
                  var $257 = HEAPU32[(($14 | 4) >> 2) + $mem$s2];
                  var $258 = ($257 | 0) == ($251 | 0);
                  do {
                    if ($258) {
                      var $272 = $14 + ($mem + 12) | 0;
                      var $273 = HEAP32[$272 >> 2];
                      if (($273 | 0) == 0) {
                        var $277 = $14 + ($mem + 8) | 0;
                        var $278 = HEAP32[$277 >> 2];
                        if (($278 | 0) == 0) {
                          var $R7_1 = 0, $R7_1$s2 = $R7_1 >> 2;
                          break;
                        }
                        var $RP9_0 = $277;
                        var $R7_0 = $278;
                      } else {
                        var $RP9_0 = $272;
                        var $R7_0 = $273;
                        __label__ = 73;
                      }
                      while (1) {
                        var $R7_0;
                        var $RP9_0;
                        var $280 = $R7_0 + 20 | 0;
                        var $281 = HEAP32[$280 >> 2];
                        if (($281 | 0) != 0) {
                          var $RP9_0 = $280;
                          var $R7_0 = $281;
                          continue;
                        }
                        var $284 = $R7_0 + 16 | 0;
                        var $285 = HEAPU32[$284 >> 2];
                        if (($285 | 0) == 0) {
                          break;
                        }
                        var $RP9_0 = $284;
                        var $R7_0 = $285;
                      }
                      if ($RP9_0 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                        _abort();
                        throw "Reached an unreachable!";
                      } else {
                        HEAP32[$RP9_0 >> 2] = 0;
                        var $R7_1 = $R7_0, $R7_1$s2 = $R7_1 >> 2;
                      }
                    } else {
                      var $262 = HEAPU32[$mem$s2 + $14$s2];
                      if ($262 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                        _abort();
                        throw "Reached an unreachable!";
                      } else {
                        HEAP32[$262 + 12 >> 2] = $257;
                        HEAP32[$257 + 8 >> 2] = $262;
                        var $R7_1 = $257, $R7_1$s2 = $R7_1 >> 2;
                      }
                    }
                  } while (0);
                  var $R7_1;
                  if (($254 | 0) == 0) {
                    break;
                  }
                  var $297 = $14 + ($mem + 20) | 0;
                  var $299 = (HEAP32[$297 >> 2] << 2) + __gm_ + 304 | 0;
                  var $301 = ($251 | 0) == (HEAP32[$299 >> 2] | 0);
                  do {
                    if ($301) {
                      HEAP32[$299 >> 2] = $R7_1;
                      if (($R7_1 | 0) != 0) {
                        break;
                      }
                      var $307 = HEAP32[__gm_ + 4 >> 2] & (1 << HEAP32[$297 >> 2] ^ -1);
                      HEAP32[__gm_ + 4 >> 2] = $307;
                      break $_$82;
                    }
                    if ($254 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      var $313 = $254 + 16 | 0;
                      if ((HEAP32[$313 >> 2] | 0) == ($251 | 0)) {
                        HEAP32[$313 >> 2] = $R7_1;
                      } else {
                        HEAP32[$254 + 20 >> 2] = $R7_1;
                      }
                      if (($R7_1 | 0) == 0) {
                        break $_$82;
                      }
                    }
                  } while (0);
                  if ($R7_1 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$R7_1$s2 + 6] = $254;
                    var $330 = HEAPU32[$14$s2 + ($mem$s2 + 2)];
                    if (($330 | 0) != 0) {
                      if ($330 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                        _abort();
                        throw "Reached an unreachable!";
                      } else {
                        HEAP32[$R7_1$s2 + 4] = $330;
                        HEAP32[$330 + 24 >> 2] = $R7_1;
                      }
                    }
                    var $343 = HEAPU32[$14$s2 + ($mem$s2 + 3)];
                    if (($343 | 0) == 0) {
                      break;
                    }
                    if ($343 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      _abort();
                      throw "Reached an unreachable!";
                    } else {
                      HEAP32[$R7_1$s2 + 5] = $343;
                      HEAP32[$343 + 24 >> 2] = $R7_1;
                    }
                  }
                }
              } while (0);
              HEAP32[$p_0$s2 + 1] = $216 | 1;
              HEAP32[$177 + $216 >> 2] = $216;
              if (($p_0 | 0) != (HEAP32[__gm_ + 20 >> 2] | 0)) {
                var $psize_1 = $216;
                break;
              }
              HEAP32[__gm_ + 8 >> 2] = $216;
              break $_$2;
            } else {
              HEAP32[$181 >> 2] = $182 & -2;
              HEAP32[$p_0$s2 + 1] = $psize_0 | 1;
              HEAP32[$177 + $psize_0 >> 2] = $psize_0;
              var $psize_1 = $psize_0;
            }
          } while (0);
          var $psize_1;
          if ($psize_1 >>> 0 < 256) {
            var $373 = $psize_1 >>> 2 & 1073741822;
            var $375 = ($373 << 2) + __gm_ + 40 | 0;
            var $376 = HEAPU32[__gm_ >> 2];
            var $377 = 1 << ($psize_1 >>> 3);
            var $379 = ($376 & $377 | 0) == 0;
            do {
              if ($379) {
                HEAP32[__gm_ >> 2] = $376 | $377;
                var $F16_0 = $375;
                var $_pre_phi = ($373 + 2 << 2) + __gm_ + 40 | 0;
              } else {
                var $383 = ($373 + 2 << 2) + __gm_ + 40 | 0;
                var $384 = HEAPU32[$383 >> 2];
                if ($384 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  var $F16_0 = $384;
                  var $_pre_phi = $383;
                  break;
                }
                _abort();
                throw "Reached an unreachable!";
              }
            } while (0);
            var $_pre_phi;
            var $F16_0;
            HEAP32[$_pre_phi >> 2] = $p_0;
            HEAP32[$F16_0 + 12 >> 2] = $p_0;
            HEAP32[$p_0$s2 + 2] = $F16_0;
            HEAP32[$p_0$s2 + 3] = $375;
            break $_$2;
          }
          var $394 = $p_0;
          var $395 = $psize_1 >>> 8;
          var $396 = ($395 | 0) == 0;
          do {
            if ($396) {
              var $I18_0 = 0;
            } else {
              if ($psize_1 >>> 0 > 16777215) {
                var $I18_0 = 31;
                break;
              }
              var $402 = ($395 + 1048320 | 0) >>> 16 & 8;
              var $403 = $395 << $402;
              var $406 = ($403 + 520192 | 0) >>> 16 & 4;
              var $407 = $403 << $406;
              var $410 = ($407 + 245760 | 0) >>> 16 & 2;
              var $416 = 14 - ($406 | $402 | $410) + ($407 << $410 >>> 15) | 0;
              var $I18_0 = $psize_1 >>> (($416 + 7 | 0) >>> 0) & 1 | $416 << 1;
            }
          } while (0);
          var $I18_0;
          var $423 = ($I18_0 << 2) + __gm_ + 304 | 0;
          HEAP32[$p_0$s2 + 7] = $I18_0;
          HEAP32[$p_0$s2 + 5] = 0;
          HEAP32[$p_0$s2 + 4] = 0;
          var $427 = HEAP32[__gm_ + 4 >> 2];
          var $428 = 1 << $I18_0;
          var $430 = ($427 & $428 | 0) == 0;
          $_$154 : do {
            if ($430) {
              var $432 = $427 | $428;
              HEAP32[__gm_ + 4 >> 2] = $432;
              HEAP32[$423 >> 2] = $394;
              HEAP32[$p_0$s2 + 6] = $423;
              HEAP32[$p_0$s2 + 3] = $p_0;
              HEAP32[$p_0$s2 + 2] = $p_0;
            } else {
              if (($I18_0 | 0) == 31) {
                var $443 = 0;
              } else {
                var $443 = 25 - ($I18_0 >>> 1) | 0;
              }
              var $443;
              var $K19_0 = $psize_1 << $443;
              var $T_0 = HEAP32[$423 >> 2];
              while (1) {
                var $T_0;
                var $K19_0;
                if ((HEAP32[$T_0 + 4 >> 2] & -8 | 0) == ($psize_1 | 0)) {
                  var $467 = $T_0 + 8 | 0;
                  var $468 = HEAPU32[$467 >> 2];
                  var $470 = HEAPU32[__gm_ + 16 >> 2];
                  var $471 = $T_0 >>> 0 < $470 >>> 0;
                  do {
                    if (!$471) {
                      if ($468 >>> 0 < $470 >>> 0) {
                        break;
                      }
                      HEAP32[$468 + 12 >> 2] = $394;
                      HEAP32[$467 >> 2] = $394;
                      HEAP32[$p_0$s2 + 2] = $468;
                      HEAP32[$p_0$s2 + 3] = $T_0;
                      HEAP32[$p_0$s2 + 6] = 0;
                      break $_$154;
                    }
                  } while (0);
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  var $452 = ($K19_0 >>> 31 << 2) + $T_0 + 16 | 0;
                  var $453 = HEAPU32[$452 >> 2];
                  if (($453 | 0) == 0) {
                    if ($452 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      HEAP32[$452 >> 2] = $394;
                      HEAP32[$p_0$s2 + 6] = $T_0;
                      HEAP32[$p_0$s2 + 3] = $p_0;
                      HEAP32[$p_0$s2 + 2] = $p_0;
                      break $_$154;
                    }
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    var $K19_0 = $K19_0 << 1;
                    var $T_0 = $453;
                  }
                }
              }
            }
          } while (0);
          var $482 = HEAP32[__gm_ + 32 >> 2] - 1 | 0;
          HEAP32[__gm_ + 32 >> 2] = $482;
          if (($482 | 0) != 0) {
            break $_$2;
          }
          _release_unused_segments();
          break $_$2;
        }
      } while (0);
      _abort();
      throw "Reached an unreachable!";
    }
  } while (0);
  return;
  return;
}

Module["_free"] = _free;

_free["X"] = 1;

function _malloc_footprint() {
  return HEAP32[__gm_ + 432 >> 2];
  return null;
}

function _malloc_max_footprint() {
  return HEAP32[__gm_ + 436 >> 2];
  return null;
}

function _release_unused_segments() {
  var $sp_01 = HEAP32[__gm_ + 452 >> 2];
  var $1 = ($sp_01 | 0) == 0;
  $_$2 : do {
    if (!$1) {
      var $sp_02 = $sp_01;
      while (1) {
        var $sp_02;
        var $sp_0 = HEAP32[$sp_02 + 8 >> 2];
        if (($sp_0 | 0) == 0) {
          break $_$2;
        }
        var $sp_02 = $sp_0;
      }
    }
  } while (0);
  HEAP32[__gm_ + 32 >> 2] = -1;
  return;
  return;
}

function _calloc($n_elements, $elem_size) {
  var $1 = ($n_elements | 0) == 0;
  do {
    if ($1) {
      var $req_0 = 0;
    } else {
      var $3 = $elem_size * $n_elements | 0;
      if (($elem_size | $n_elements) >>> 0 <= 65535) {
        var $req_0 = $3;
        break;
      }
      var $7 = Math.floor(($3 >>> 0) / ($n_elements >>> 0));
      if (($7 | 0) == ($elem_size | 0)) {
        var $req_0 = $3;
        break;
      }
      var $req_0 = -1;
    }
  } while (0);
  var $req_0;
  var $11 = _malloc($req_0);
  var $12 = ($11 | 0) == 0;
  do {
    if (!$12) {
      if ((HEAP32[$11 - 4 >> 2] & 3 | 0) == 0) {
        break;
      }
      _memset($11, 0, $req_0, 1);
    }
  } while (0);
  return $11;
  return null;
}

function _realloc($oldmem, $bytes) {
  if (($oldmem | 0) == 0) {
    var $3 = _malloc($bytes);
    var $_0 = $3;
  } else {
    var $5 = _internal_realloc($oldmem, $bytes);
    var $_0 = $5;
  }
  var $_0;
  return $_0;
  return null;
}

function _memalign($alignment, $bytes) {
  var $1 = _internal_memalign($alignment, $bytes);
  return $1;
  return null;
}

function _internal_memalign($alignment, $bytes) {
  var $50$s2;
  var $1 = $alignment >>> 0 < 9;
  do {
    if ($1) {
      var $3 = _malloc($bytes);
      var $_0 = $3;
    } else {
      var $_01 = $alignment >>> 0 < 16 ? 16 : $alignment;
      var $8 = ($_01 - 1 & $_01 | 0) == 0;
      $_$56 : do {
        if ($8) {
          var $_1 = $_01;
        } else {
          if ($_01 >>> 0 <= 16) {
            var $_1 = 16;
            break;
          }
          var $a_08 = 16;
          while (1) {
            var $a_08;
            var $10 = $a_08 << 1;
            if ($10 >>> 0 >= $_01 >>> 0) {
              var $_1 = $10;
              break $_$56;
            }
            var $a_08 = $10;
          }
        }
      } while (0);
      var $_1;
      if ((-64 - $_1 | 0) >>> 0 > $bytes >>> 0) {
        if ($bytes >>> 0 < 11) {
          var $22 = 16;
        } else {
          var $22 = $bytes + 11 & -8;
        }
        var $22;
        var $25 = _malloc($22 + ($_1 + 12) | 0);
        if (($25 | 0) == 0) {
          var $_0 = 0;
          break;
        }
        var $28 = $25 - 8 | 0;
        if ((($25 >>> 0) % ($_1 >>> 0) | 0) == 0) {
          var $p_0_in = $28;
          var $leader_1 = 0;
        } else {
          var $37 = $25 + ($_1 - 1) & -$_1;
          var $38 = $37 - 8 | 0;
          var $40 = $28;
          if (($38 - $40 | 0) >>> 0 > 15) {
            var $46 = $38;
          } else {
            var $46 = $37 + ($_1 - 8) | 0;
          }
          var $46;
          var $48 = $46 - $40 | 0;
          var $50$s2 = ($25 - 4 | 0) >> 2;
          var $51 = HEAP32[$50$s2];
          var $53 = ($51 & -8) - $48 | 0;
          if (($51 & 3 | 0) == 0) {
            var $59 = HEAP32[$28 >> 2] + $48 | 0;
            HEAP32[$46 >> 2] = $59;
            HEAP32[$46 + 4 >> 2] = $53;
            var $p_0_in = $46;
            var $leader_1 = 0;
          } else {
            var $65 = $46 + 4 | 0;
            var $69 = $53 | HEAP32[$65 >> 2] & 1 | 2;
            HEAP32[$65 >> 2] = $69;
            var $71 = $53 + ($46 + 4) | 0;
            var $73 = HEAP32[$71 >> 2] | 1;
            HEAP32[$71 >> 2] = $73;
            var $77 = $48 | HEAP32[$50$s2] & 1 | 2;
            HEAP32[$50$s2] = $77;
            var $79 = $25 + ($48 - 4) | 0;
            var $81 = HEAP32[$79 >> 2] | 1;
            HEAP32[$79 >> 2] = $81;
            var $p_0_in = $46;
            var $leader_1 = $25;
          }
        }
        var $leader_1;
        var $p_0_in;
        var $83 = $p_0_in + 4 | 0;
        var $84 = HEAPU32[$83 >> 2];
        var $86 = ($84 & 3 | 0) == 0;
        do {
          if ($86) {
            var $trailer_0 = 0;
          } else {
            var $88 = $84 & -8;
            if ($88 >>> 0 <= ($22 + 16 | 0) >>> 0) {
              var $trailer_0 = 0;
              break;
            }
            var $92 = $88 - $22 | 0;
            HEAP32[$83 >> 2] = $22 | $84 & 1 | 2;
            HEAP32[$p_0_in + ($22 | 4) >> 2] = $92 | 3;
            var $100 = $p_0_in + ($88 | 4) | 0;
            var $102 = HEAP32[$100 >> 2] | 1;
            HEAP32[$100 >> 2] = $102;
            var $trailer_0 = $22 + ($p_0_in + 8) | 0;
          }
        } while (0);
        var $trailer_0;
        if (($leader_1 | 0) != 0) {
          _free($leader_1);
        }
        if (($trailer_0 | 0) != 0) {
          _free($trailer_0);
        }
        var $_0 = $p_0_in + 8 | 0;
      } else {
        var $15 = ___errno();
        HEAP32[$15 >> 2] = 12;
        var $_0 = 0;
      }
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

_internal_memalign["X"] = 1;

function _independent_calloc($n_elements, $elem_size, $chunks) {
  var __stackBase__ = STACKTOP;
  STACKTOP += 4;
  var $sz = __stackBase__;
  HEAP32[$sz >> 2] = $elem_size;
  var $1 = _ialloc($n_elements, $sz, 3, $chunks);
  STACKTOP = __stackBase__;
  return $1;
  return null;
}

function _ialloc($n_elements, $sizes, $opts, $chunks) {
  var $marray_1$s2;
  var __label__;
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    _init_mparams();
  }
  var $5 = ($chunks | 0) == 0;
  var $6 = ($n_elements | 0) == 0;
  do {
    if ($5) {
      if ($6) {
        var $10 = _malloc(0);
        var $_0 = $10;
        __label__ = 30;
        break;
      }
      var $13 = $n_elements << 2;
      if ($13 >>> 0 < 11) {
        var $marray_0 = 0;
        var $array_size_0 = 16;
        __label__ = 9;
        break;
      }
      var $marray_0 = 0;
      var $array_size_0 = $13 + 11 & -8;
      __label__ = 9;
      break;
    } else {
      if ($6) {
        var $_0 = $chunks;
        __label__ = 30;
        break;
      }
      var $marray_0 = $chunks;
      var $array_size_0 = 0;
      __label__ = 9;
      break;
    }
  } while (0);
  do {
    if (__label__ == 9) {
      var $array_size_0;
      var $marray_0;
      var $20 = ($opts & 1 | 0) == 0;
      $_$102 : do {
        if ($20) {
          if ($6) {
            var $element_size_0 = 0;
            var $contents_size_1 = 0;
            break;
          }
          var $contents_size_07 = 0;
          var $i_08 = 0;
          while (1) {
            var $i_08;
            var $contents_size_07;
            var $31 = HEAPU32[$sizes + ($i_08 << 2) >> 2];
            if ($31 >>> 0 < 11) {
              var $37 = 16;
            } else {
              var $37 = $31 + 11 & -8;
            }
            var $37;
            var $38 = $37 + $contents_size_07 | 0;
            var $39 = $i_08 + 1 | 0;
            if (($39 | 0) == ($n_elements | 0)) {
              var $element_size_0 = 0;
              var $contents_size_1 = $38;
              break $_$102;
            }
            var $contents_size_07 = $38;
            var $i_08 = $39;
          }
        } else {
          var $22 = HEAPU32[$sizes >> 2];
          if ($22 >>> 0 < 11) {
            var $28 = 16;
          } else {
            var $28 = $22 + 11 & -8;
          }
          var $28;
          var $element_size_0 = $28;
          var $contents_size_1 = $28 * $n_elements | 0;
        }
      } while (0);
      var $contents_size_1;
      var $element_size_0;
      var $43 = _malloc($array_size_0 - 4 + $contents_size_1 | 0);
      if (($43 | 0) == 0) {
        var $_0 = 0;
        break;
      }
      var $46 = $43 - 8 | 0;
      var $50 = HEAP32[$43 - 4 >> 2] & -8;
      if (($opts & 2 | 0) != 0) {
        var $55 = -4 - $array_size_0 + $50 | 0;
        _memset($43, 0, $55, 1);
      }
      if (($marray_0 | 0) == 0) {
        var $61 = $43 + $contents_size_1 | 0;
        var $62 = $50 - $contents_size_1 | 3;
        HEAP32[$43 + ($contents_size_1 - 4) >> 2] = $62;
        var $marray_1 = $61, $marray_1$s2 = $marray_1 >> 2;
        var $remainder_size_0 = $contents_size_1;
      } else {
        var $marray_1 = $marray_0, $marray_1$s2 = $marray_1 >> 2;
        var $remainder_size_0 = $50;
      }
      var $remainder_size_0;
      var $marray_1;
      HEAP32[$marray_1$s2] = $43;
      var $66 = $n_elements - 1 | 0;
      var $67 = ($66 | 0) == 0;
      $_$121 : do {
        if ($67) {
          var $p_0_in_lcssa = $46;
          var $remainder_size_1_lcssa = $remainder_size_0;
        } else {
          if (($element_size_0 | 0) == 0) {
            var $p_0_in3_us = $46;
            var $remainder_size_14_us = $remainder_size_0;
            var $i_15_us = 0;
            while (1) {
              var $i_15_us;
              var $remainder_size_14_us;
              var $p_0_in3_us;
              var $81 = HEAPU32[$sizes + ($i_15_us << 2) >> 2];
              if ($81 >>> 0 < 11) {
                var $size_0_us = 16;
              } else {
                var $size_0_us = $81 + 11 & -8;
              }
              var $size_0_us;
              var $71 = $remainder_size_14_us - $size_0_us | 0;
              HEAP32[$p_0_in3_us + 4 >> 2] = $size_0_us | 3;
              var $75 = $p_0_in3_us + $size_0_us | 0;
              var $76 = $i_15_us + 1 | 0;
              HEAP32[($76 << 2 >> 2) + $marray_1$s2] = $size_0_us + ($p_0_in3_us + 8) | 0;
              if (($76 | 0) == ($66 | 0)) {
                var $p_0_in_lcssa = $75;
                var $remainder_size_1_lcssa = $71;
                break $_$121;
              }
              var $p_0_in3_us = $75;
              var $remainder_size_14_us = $71;
              var $i_15_us = $76;
            }
          } else {
            var $69 = $element_size_0 | 3;
            var $_sum = $element_size_0 + 8 | 0;
            var $p_0_in3 = $46;
            var $remainder_size_14 = $remainder_size_0;
            var $i_15 = 0;
            while (1) {
              var $i_15;
              var $remainder_size_14;
              var $p_0_in3;
              var $87 = $remainder_size_14 - $element_size_0 | 0;
              HEAP32[$p_0_in3 + 4 >> 2] = $69;
              var $90 = $p_0_in3 + $element_size_0 | 0;
              var $91 = $i_15 + 1 | 0;
              HEAP32[($91 << 2 >> 2) + $marray_1$s2] = $p_0_in3 + $_sum | 0;
              if (($91 | 0) == ($66 | 0)) {
                var $p_0_in_lcssa = $90;
                var $remainder_size_1_lcssa = $87;
                break $_$121;
              }
              var $p_0_in3 = $90;
              var $remainder_size_14 = $87;
              var $i_15 = $91;
            }
          }
        }
      } while (0);
      var $remainder_size_1_lcssa;
      var $p_0_in_lcssa;
      HEAP32[$p_0_in_lcssa + 4 >> 2] = $remainder_size_1_lcssa | 3;
      var $_0 = $marray_1;
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

_ialloc["X"] = 1;

function _independent_comalloc($n_elements, $sizes, $chunks) {
  var $1 = _ialloc($n_elements, $sizes, 0, $chunks);
  return $1;
  return null;
}

function _valloc($bytes) {
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    _init_mparams();
  }
  var $5 = HEAP32[_mparams + 4 >> 2];
  var $6 = _memalign($5, $bytes);
  return $6;
  return null;
}

function _pvalloc($bytes) {
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    _init_mparams();
  }
  var $5 = HEAP32[_mparams + 4 >> 2];
  var $9 = $bytes - 1 + $5 & -$5;
  var $10 = _memalign($5, $9);
  return $10;
  return null;
}

function _malloc_trim($pad) {
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    _init_mparams();
  }
  var $5 = _sys_trim($pad);
  return $5;
  return null;
}

function _mallinfo($agg_result) {
  _internal_mallinfo($agg_result);
  return;
  return;
}

function _internal_mallinfo($agg_result) {
  var $agg_result$s2 = $agg_result >> 2;
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    _init_mparams();
  }
  var $5 = HEAPU32[__gm_ + 24 >> 2];
  if (($5 | 0) == 0) {
    var $nm_0_0 = 0;
    var $nm_1_0 = 0;
    var $nm_9_0 = 0;
    var $nm_8_0 = 0;
    var $nm_4_0 = 0;
    var $nm_5_0 = 0;
    var $nm_7_0 = 0;
  } else {
    var $8 = HEAPU32[__gm_ + 12 >> 2];
    var $9 = $8 + 40 | 0;
    var $s_02 = __gm_ + 444 | 0;
    var $sum_03 = $9;
    var $mfree_04 = $9;
    var $nfree_05 = 1;
    while (1) {
      var $nfree_05;
      var $mfree_04;
      var $sum_03;
      var $s_02;
      var $12 = HEAPU32[$s_02 >> 2];
      var $14 = $12 + 8 | 0;
      if (($14 & 7 | 0) == 0) {
        var $21 = 0;
      } else {
        var $21 = -$14 & 7;
      }
      var $21;
      var $23 = $s_02 + 4 | 0;
      var $q_0_in = $12 + $21 | 0;
      var $nfree_1 = $nfree_05;
      var $mfree_1 = $mfree_04;
      var $sum_1 = $sum_03;
      while (1) {
        var $sum_1;
        var $mfree_1;
        var $nfree_1;
        var $q_0_in;
        if ($q_0_in >>> 0 < $12 >>> 0) {
          break;
        }
        if ($q_0_in >>> 0 >= ($12 + HEAP32[$23 >> 2] | 0) >>> 0 | ($q_0_in | 0) == ($5 | 0)) {
          break;
        }
        var $34 = HEAP32[$q_0_in + 4 >> 2];
        if (($34 | 0) == 7) {
          break;
        }
        var $37 = $34 & -8;
        var $38 = $37 + $sum_1 | 0;
        if (($34 & 3 | 0) == 1) {
          var $nfree_2 = $nfree_1 + 1 | 0;
          var $mfree_2 = $37 + $mfree_1 | 0;
        } else {
          var $nfree_2 = $nfree_1;
          var $mfree_2 = $mfree_1;
        }
        var $mfree_2;
        var $nfree_2;
        var $q_0_in = $q_0_in + $37 | 0;
        var $nfree_1 = $nfree_2;
        var $mfree_1 = $mfree_2;
        var $sum_1 = $38;
      }
      var $47 = HEAPU32[$s_02 + 8 >> 2];
      if (($47 | 0) == 0) {
        break;
      }
      var $s_02 = $47;
      var $sum_03 = $sum_1;
      var $mfree_04 = $mfree_1;
      var $nfree_05 = $nfree_1;
    }
    var $50 = HEAP32[__gm_ + 432 >> 2];
    var $nm_0_0 = $sum_1;
    var $nm_1_0 = $nfree_1;
    var $nm_9_0 = $8;
    var $nm_8_0 = $mfree_1;
    var $nm_4_0 = $50 - $sum_1 | 0;
    var $nm_5_0 = HEAP32[__gm_ + 436 >> 2];
    var $nm_7_0 = $50 - $mfree_1 | 0;
  }
  var $nm_7_0;
  var $nm_5_0;
  var $nm_4_0;
  var $nm_8_0;
  var $nm_9_0;
  var $nm_1_0;
  var $nm_0_0;
  HEAP32[$agg_result$s2] = $nm_0_0;
  HEAP32[$agg_result$s2 + 1] = $nm_1_0;
  HEAP32[$agg_result$s2 + 2] = 0;
  HEAP32[$agg_result$s2 + 3] = 0;
  HEAP32[$agg_result$s2 + 4] = $nm_4_0;
  HEAP32[$agg_result$s2 + 5] = $nm_5_0;
  HEAP32[$agg_result$s2 + 6] = 0;
  HEAP32[$agg_result$s2 + 7] = $nm_7_0;
  HEAP32[$agg_result$s2 + 8] = $nm_8_0;
  HEAP32[$agg_result$s2 + 9] = $nm_9_0;
  return;
  return;
}

_internal_mallinfo["X"] = 1;

function _malloc_stats() {
  _internal_malloc_stats();
  return;
  return;
}

function _internal_malloc_stats() {
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    _init_mparams();
  }
  var $5 = HEAPU32[__gm_ + 24 >> 2];
  var $6 = ($5 | 0) == 0;
  $_$184 : do {
    if ($6) {
      var $maxfp_0 = 0;
      var $fp_0 = 0;
      var $used_3 = 0;
    } else {
      var $8 = HEAP32[__gm_ + 436 >> 2];
      var $9 = HEAPU32[__gm_ + 432 >> 2];
      var $s_03 = __gm_ + 444 | 0;
      var $used_04 = $9 - 40 - HEAP32[__gm_ + 12 >> 2] | 0;
      while (1) {
        var $used_04;
        var $s_03;
        var $14 = HEAPU32[$s_03 >> 2];
        var $16 = $14 + 8 | 0;
        if (($16 & 7 | 0) == 0) {
          var $23 = 0;
        } else {
          var $23 = -$16 & 7;
        }
        var $23;
        var $25 = $s_03 + 4 | 0;
        var $q_0_in = $14 + $23 | 0;
        var $used_1 = $used_04;
        while (1) {
          var $used_1;
          var $q_0_in;
          if ($q_0_in >>> 0 < $14 >>> 0) {
            break;
          }
          if ($q_0_in >>> 0 >= ($14 + HEAP32[$25 >> 2] | 0) >>> 0 | ($q_0_in | 0) == ($5 | 0)) {
            break;
          }
          var $36 = HEAP32[$q_0_in + 4 >> 2];
          if (($36 | 0) == 7) {
            break;
          }
          var $40 = $36 & -8;
          var $41 = ($36 & 3 | 0) == 1 ? $40 : 0;
          var $used_2 = $used_1 - $41 | 0;
          var $q_0_in = $q_0_in + $40 | 0;
          var $used_1 = $used_2;
        }
        var $44 = HEAPU32[$s_03 + 8 >> 2];
        if (($44 | 0) == 0) {
          var $maxfp_0 = $8;
          var $fp_0 = $9;
          var $used_3 = $used_1;
          break $_$184;
        }
        var $s_03 = $44;
        var $used_04 = $used_1;
      }
    }
  } while (0);
  var $used_3;
  var $fp_0;
  var $maxfp_0;
  var $48 = HEAP32[HEAP32[__impure_ptr >> 2] + 12 >> 2];
  var $49 = _fprintf($48, STRING_TABLE.__str37 | 0, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $maxfp_0, tempInt));
  var $52 = HEAP32[HEAP32[__impure_ptr >> 2] + 12 >> 2];
  var $53 = _fprintf($52, STRING_TABLE.__str138 | 0, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $fp_0, tempInt));
  var $56 = HEAP32[HEAP32[__impure_ptr >> 2] + 12 >> 2];
  var $57 = _fprintf($56, STRING_TABLE.__str239 | 0, (tempInt = STACKTOP, STACKTOP += 4, HEAP32[tempInt >> 2] = $used_3, tempInt));
  return;
  return;
}

_internal_malloc_stats["X"] = 1;

function _mallopt($param_number, $value) {
  var $1 = _change_mparam($param_number, $value);
  return $1;
  return null;
}

function _change_mparam($param_number, $value) {
  var __label__;
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    _init_mparams();
  } else {
    __label__ = 3;
  }
  do {
    if (($param_number | 0) == -1) {
      HEAP32[_mparams + 16 >> 2] = $value;
      var $_0 = 1;
    } else if (($param_number | 0) == -2) {
      if (HEAPU32[_mparams + 4 >> 2] >>> 0 > $value >>> 0) {
        var $_0 = 0;
        break;
      }
      if (($value - 1 & $value | 0) != 0) {
        var $_0 = 0;
        break;
      }
      HEAP32[_mparams + 8 >> 2] = $value;
      var $_0 = 1;
    } else if (($param_number | 0) == -3) {
      HEAP32[_mparams + 12 >> 2] = $value;
      var $_0 = 1;
    } else {
      var $_0 = 0;
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

function _internal_realloc($oldmem, $bytes) {
  var $21$s2;
  var $8$s2;
  var __label__;
  var $1 = $bytes >>> 0 > 4294967231;
  $_$22 : do {
    if ($1) {
      var $3 = ___errno();
      HEAP32[$3 >> 2] = 12;
      var $_0 = 0;
    } else {
      var $5 = $oldmem - 8 | 0;
      var $6 = $5;
      var $8$s2 = ($oldmem - 4 | 0) >> 2;
      var $9 = HEAPU32[$8$s2];
      var $10 = $9 & -8;
      var $_sum = $10 - 8 | 0;
      var $12 = $oldmem + $_sum | 0;
      var $14 = $5 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0;
      do {
        if (!$14) {
          var $16 = $9 & 3;
          if (!(($16 | 0) != 1 & ($_sum | 0) > -8)) {
            break;
          }
          var $21$s2 = ($oldmem + ($10 - 4) | 0) >> 2;
          if ((HEAP32[$21$s2] & 1 | 0) == 0) {
            break;
          }
          if ($bytes >>> 0 < 11) {
            var $31 = 16;
          } else {
            var $31 = $bytes + 11 & -8;
          }
          var $31;
          var $32 = ($16 | 0) == 0;
          do {
            if ($32) {
              var $34 = _mmap_resize($6, $31);
              var $extra_0 = 0;
              var $newp_0 = $34;
              __label__ = 17;
              break;
            }
            if ($10 >>> 0 < $31 >>> 0) {
              if (($12 | 0) != (HEAP32[__gm_ + 24 >> 2] | 0)) {
                __label__ = 21;
                break;
              }
              var $55 = HEAP32[__gm_ + 12 >> 2] + $10 | 0;
              if ($55 >>> 0 <= $31 >>> 0) {
                __label__ = 21;
                break;
              }
              var $58 = $55 - $31 | 0;
              var $60 = $oldmem + ($31 - 8) | 0;
              HEAP32[$8$s2] = $31 | $9 & 1 | 2;
              var $66 = $58 | 1;
              HEAP32[$oldmem + ($31 - 4) >> 2] = $66;
              HEAP32[__gm_ + 24 >> 2] = $60;
              HEAP32[__gm_ + 12 >> 2] = $58;
              var $extra_0 = 0;
              var $newp_0 = $6;
              __label__ = 17;
              break;
            }
            var $38 = $10 - $31 | 0;
            if ($38 >>> 0 <= 15) {
              var $extra_0 = 0;
              var $newp_0 = $6;
              __label__ = 17;
              break;
            }
            HEAP32[$8$s2] = $31 | $9 & 1 | 2;
            HEAP32[$oldmem + ($31 - 4) >> 2] = $38 | 3;
            var $48 = HEAP32[$21$s2] | 1;
            HEAP32[$21$s2] = $48;
            var $extra_0 = $oldmem + $31 | 0;
            var $newp_0 = $6;
            __label__ = 17;
            break;
          } while (0);
          do {
            if (__label__ == 17) {
              var $newp_0;
              var $extra_0;
              if (($newp_0 | 0) == 0) {
                break;
              }
              if (($extra_0 | 0) != 0) {
                _free($extra_0);
              }
              var $_0 = $newp_0 + 8 | 0;
              break $_$22;
            }
          } while (0);
          var $75 = _malloc($bytes);
          if (($75 | 0) == 0) {
            var $_0 = 0;
            break $_$22;
          }
          var $81 = (HEAP32[$8$s2] & 3 | 0) == 0 ? 8 : 4;
          var $82 = $10 - $81 | 0;
          var $84 = $82 >>> 0 < $bytes >>> 0 ? $82 : $bytes;
          _memcpy($75, $oldmem, $84, 1);
          _free($oldmem);
          var $_0 = $75;
          break $_$22;
        }
      } while (0);
      _abort();
      throw "Reached an unreachable!";
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

_internal_realloc["X"] = 1;

function _init_mparams() {
  if ((HEAP32[_mparams >> 2] | 0) == 0) {
    var $4 = _sysconf(8);
    if (($4 - 1 & $4 | 0) == 0) {
      HEAP32[_mparams + 8 >> 2] = $4;
      HEAP32[_mparams + 4 >> 2] = $4;
      HEAP32[_mparams + 12 >> 2] = -1;
      HEAP32[_mparams + 16 >> 2] = 2097152;
      HEAP32[_mparams + 20 >> 2] = 0;
      HEAP32[__gm_ + 440 >> 2] = 0;
      var $10 = _time(0);
      HEAP32[_mparams >> 2] = $10 & -16 ^ 1431655768;
    } else {
      _abort();
      throw "Reached an unreachable!";
    }
  }
  return;
  return;
}

function _malloc_usable_size($mem) {
  var $1 = ($mem | 0) == 0;
  do {
    if ($1) {
      var $_0 = 0;
    } else {
      var $5 = HEAP32[$mem - 4 >> 2];
      var $6 = $5 & 3;
      if (($6 | 0) == 1) {
        var $_0 = 0;
        break;
      }
      var $11 = ($6 | 0) == 0 ? 8 : 4;
      var $_0 = ($5 & -8) - $11 | 0;
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

function _mmap_resize($oldp, $nb) {
  var $3 = HEAP32[$oldp + 4 >> 2] & -8;
  var $4 = $nb >>> 0 < 256;
  do {
    if ($4) {
      var $_0 = 0;
    } else {
      if ($3 >>> 0 >= ($nb + 4 | 0) >>> 0) {
        if (($3 - $nb | 0) >>> 0 <= HEAP32[_mparams + 8 >> 2] << 1 >>> 0) {
          var $_0 = $oldp;
          break;
        }
      }
      var $_0 = 0;
    }
  } while (0);
  var $_0;
  return $_0;
  return null;
}

function _segment_holding($addr) {
  var $sp_0$s2;
  var $sp_0 = __gm_ + 444 | 0, $sp_0$s2 = $sp_0 >> 2;
  while (1) {
    var $sp_0;
    var $3 = HEAPU32[$sp_0$s2];
    if ($3 >>> 0 <= $addr >>> 0) {
      if (($3 + HEAP32[$sp_0$s2 + 1] | 0) >>> 0 > $addr >>> 0) {
        var $_0 = $sp_0;
        break;
      }
    }
    var $12 = HEAPU32[$sp_0$s2 + 2];
    if (($12 | 0) == 0) {
      var $_0 = 0;
      break;
    }
    var $sp_0 = $12, $sp_0$s2 = $sp_0 >> 2;
  }
  var $_0;
  return $_0;
  return null;
}

function _init_top($p, $psize) {
  var $1 = $p;
  var $3 = $p + 8 | 0;
  if (($3 & 7 | 0) == 0) {
    var $10 = 0;
  } else {
    var $10 = -$3 & 7;
  }
  var $10;
  var $13 = $psize - $10 | 0;
  HEAP32[__gm_ + 24 >> 2] = $1 + $10 | 0;
  HEAP32[__gm_ + 12 >> 2] = $13;
  HEAP32[$10 + ($1 + 4) >> 2] = $13 | 1;
  HEAP32[$psize + ($1 + 4) >> 2] = 40;
  var $19 = HEAP32[_mparams + 16 >> 2];
  HEAP32[__gm_ + 28 >> 2] = $19;
  return;
  return;
}

function _init_bins() {
  var $i_02 = 0;
  while (1) {
    var $i_02;
    var $2 = $i_02 << 1;
    var $4 = ($2 << 2) + __gm_ + 40 | 0;
    HEAP32[__gm_ + ($2 + 3 << 2) + 40 >> 2] = $4;
    HEAP32[__gm_ + ($2 + 2 << 2) + 40 >> 2] = $4;
    var $7 = $i_02 + 1 | 0;
    if (($7 | 0) == 32) {
      break;
    }
    var $i_02 = $7;
  }
  return;
  return;
}

function _prepend_alloc($newbase, $oldbase, $nb) {
  var $R_1$s2;
  var $_sum$s2;
  var $19$s2;
  var $oldbase$s2 = $oldbase >> 2;
  var $newbase$s2 = $newbase >> 2;
  var __label__;
  var $2 = $newbase + 8 | 0;
  if (($2 & 7 | 0) == 0) {
    var $9 = 0;
  } else {
    var $9 = -$2 & 7;
  }
  var $9;
  var $12 = $oldbase + 8 | 0;
  if (($12 & 7 | 0) == 0) {
    var $19 = 0, $19$s2 = $19 >> 2;
  } else {
    var $19 = -$12 & 7, $19$s2 = $19 >> 2;
  }
  var $19;
  var $20 = $oldbase + $19 | 0;
  var $21 = $20;
  var $_sum = $9 + $nb | 0, $_sum$s2 = $_sum >> 2;
  var $25 = $newbase + $_sum | 0;
  var $26 = $25;
  var $27 = $20 - ($newbase + $9) - $nb | 0;
  HEAP32[($9 + 4 >> 2) + $newbase$s2] = $nb | 3;
  var $32 = ($21 | 0) == (HEAP32[__gm_ + 24 >> 2] | 0);
  $_$35 : do {
    if ($32) {
      var $35 = HEAP32[__gm_ + 12 >> 2] + $27 | 0;
      HEAP32[__gm_ + 12 >> 2] = $35;
      HEAP32[__gm_ + 24 >> 2] = $26;
      var $36 = $35 | 1;
      HEAP32[$_sum$s2 + ($newbase$s2 + 1)] = $36;
    } else {
      if (($21 | 0) == (HEAP32[__gm_ + 20 >> 2] | 0)) {
        var $44 = HEAP32[__gm_ + 8 >> 2] + $27 | 0;
        HEAP32[__gm_ + 8 >> 2] = $44;
        HEAP32[__gm_ + 20 >> 2] = $26;
        var $45 = $44 | 1;
        HEAP32[$_sum$s2 + ($newbase$s2 + 1)] = $45;
        var $49 = $newbase + $44 + $_sum | 0;
        HEAP32[$49 >> 2] = $44;
      } else {
        var $53 = HEAPU32[$19$s2 + ($oldbase$s2 + 1)];
        if (($53 & 3 | 0) == 1) {
          var $57 = $53 & -8;
          var $58 = $53 >>> 3;
          var $59 = $53 >>> 0 < 256;
          $_$43 : do {
            if ($59) {
              var $63 = HEAPU32[(($19 | 8) >> 2) + $oldbase$s2];
              var $66 = HEAPU32[$19$s2 + ($oldbase$s2 + 3)];
              if (($63 | 0) == ($66 | 0)) {
                var $72 = HEAP32[__gm_ >> 2] & (1 << $58 ^ -1);
                HEAP32[__gm_ >> 2] = $72;
              } else {
                var $77 = (($53 >>> 2 & 1073741822) << 2) + __gm_ + 40 | 0;
                var $78 = ($63 | 0) == ($77 | 0);
                do {
                  if ($78) {
                    __label__ = 15;
                  } else {
                    if ($63 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                      __label__ = 18;
                      break;
                    }
                    __label__ = 15;
                    break;
                  }
                } while (0);
                do {
                  if (__label__ == 15) {
                    if (($66 | 0) != ($77 | 0)) {
                      if ($66 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                        break;
                      }
                    }
                    HEAP32[$63 + 12 >> 2] = $66;
                    HEAP32[$66 + 8 >> 2] = $63;
                    break $_$43;
                  }
                } while (0);
                _abort();
                throw "Reached an unreachable!";
              }
            } else {
              var $92 = $20;
              var $95 = HEAPU32[(($19 | 24) >> 2) + $oldbase$s2];
              var $98 = HEAPU32[$19$s2 + ($oldbase$s2 + 3)];
              var $99 = ($98 | 0) == ($92 | 0);
              do {
                if ($99) {
                  var $_sum67 = $19 | 16;
                  var $113 = $_sum67 + ($oldbase + 4) | 0;
                  var $114 = HEAP32[$113 >> 2];
                  if (($114 | 0) == 0) {
                    var $118 = $oldbase + $_sum67 | 0;
                    var $119 = HEAP32[$118 >> 2];
                    if (($119 | 0) == 0) {
                      var $R_1 = 0, $R_1$s2 = $R_1 >> 2;
                      break;
                    }
                    var $RP_0 = $118;
                    var $R_0 = $119;
                  } else {
                    var $RP_0 = $113;
                    var $R_0 = $114;
                    __label__ = 25;
                  }
                  while (1) {
                    var $R_0;
                    var $RP_0;
                    var $121 = $R_0 + 20 | 0;
                    var $122 = HEAP32[$121 >> 2];
                    if (($122 | 0) != 0) {
                      var $RP_0 = $121;
                      var $R_0 = $122;
                      continue;
                    }
                    var $125 = $R_0 + 16 | 0;
                    var $126 = HEAPU32[$125 >> 2];
                    if (($126 | 0) == 0) {
                      break;
                    }
                    var $RP_0 = $125;
                    var $R_0 = $126;
                  }
                  if ($RP_0 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$RP_0 >> 2] = 0;
                    var $R_1 = $R_0, $R_1$s2 = $R_1 >> 2;
                  }
                } else {
                  var $103 = HEAPU32[(($19 | 8) >> 2) + $oldbase$s2];
                  if ($103 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$103 + 12 >> 2] = $98;
                    HEAP32[$98 + 8 >> 2] = $103;
                    var $R_1 = $98, $R_1$s2 = $R_1 >> 2;
                  }
                }
              } while (0);
              var $R_1;
              if (($95 | 0) == 0) {
                break;
              }
              var $138 = $19 + ($oldbase + 28) | 0;
              var $140 = (HEAP32[$138 >> 2] << 2) + __gm_ + 304 | 0;
              var $142 = ($92 | 0) == (HEAP32[$140 >> 2] | 0);
              do {
                if ($142) {
                  HEAP32[$140 >> 2] = $R_1;
                  if (($R_1 | 0) != 0) {
                    break;
                  }
                  var $148 = HEAP32[__gm_ + 4 >> 2] & (1 << HEAP32[$138 >> 2] ^ -1);
                  HEAP32[__gm_ + 4 >> 2] = $148;
                  break $_$43;
                }
                if ($95 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  var $154 = $95 + 16 | 0;
                  if ((HEAP32[$154 >> 2] | 0) == ($92 | 0)) {
                    HEAP32[$154 >> 2] = $R_1;
                  } else {
                    HEAP32[$95 + 20 >> 2] = $R_1;
                  }
                  if (($R_1 | 0) == 0) {
                    break $_$43;
                  }
                }
              } while (0);
              if ($R_1 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                _abort();
                throw "Reached an unreachable!";
              } else {
                HEAP32[$R_1$s2 + 6] = $95;
                var $_sum3132 = $19 | 16;
                var $171 = HEAPU32[($_sum3132 >> 2) + $oldbase$s2];
                if (($171 | 0) != 0) {
                  if ($171 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    _abort();
                    throw "Reached an unreachable!";
                  } else {
                    HEAP32[$R_1$s2 + 4] = $171;
                    HEAP32[$171 + 24 >> 2] = $R_1;
                  }
                }
                var $184 = HEAPU32[($_sum3132 + 4 >> 2) + $oldbase$s2];
                if (($184 | 0) == 0) {
                  break;
                }
                if ($184 >>> 0 < HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  HEAP32[$R_1$s2 + 5] = $184;
                  HEAP32[$184 + 24 >> 2] = $R_1;
                }
              }
            }
          } while (0);
          var $oldfirst_0 = $oldbase + ($57 | $19) | 0;
          var $qsize_0 = $57 + $27 | 0;
        } else {
          var $oldfirst_0 = $21;
          var $qsize_0 = $27;
        }
        var $qsize_0;
        var $oldfirst_0;
        var $200 = $oldfirst_0 + 4 | 0;
        var $202 = HEAP32[$200 >> 2] & -2;
        HEAP32[$200 >> 2] = $202;
        HEAP32[$_sum$s2 + ($newbase$s2 + 1)] = $qsize_0 | 1;
        HEAP32[($qsize_0 >> 2) + $newbase$s2 + $_sum$s2] = $qsize_0;
        if ($qsize_0 >>> 0 < 256) {
          var $212 = $qsize_0 >>> 2 & 1073741822;
          var $214 = ($212 << 2) + __gm_ + 40 | 0;
          var $215 = HEAPU32[__gm_ >> 2];
          var $216 = 1 << ($qsize_0 >>> 3);
          var $218 = ($215 & $216 | 0) == 0;
          do {
            if ($218) {
              HEAP32[__gm_ >> 2] = $215 | $216;
              var $F4_0 = $214;
              var $_pre_phi = ($212 + 2 << 2) + __gm_ + 40 | 0;
            } else {
              var $222 = ($212 + 2 << 2) + __gm_ + 40 | 0;
              var $223 = HEAPU32[$222 >> 2];
              if ($223 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                var $F4_0 = $223;
                var $_pre_phi = $222;
                break;
              }
              _abort();
              throw "Reached an unreachable!";
            }
          } while (0);
          var $_pre_phi;
          var $F4_0;
          HEAP32[$_pre_phi >> 2] = $26;
          HEAP32[$F4_0 + 12 >> 2] = $26;
          HEAP32[$_sum$s2 + ($newbase$s2 + 2)] = $F4_0;
          HEAP32[$_sum$s2 + ($newbase$s2 + 3)] = $214;
        } else {
          var $235 = $25;
          var $236 = $qsize_0 >>> 8;
          var $237 = ($236 | 0) == 0;
          do {
            if ($237) {
              var $I7_0 = 0;
            } else {
              if ($qsize_0 >>> 0 > 16777215) {
                var $I7_0 = 31;
                break;
              }
              var $243 = ($236 + 1048320 | 0) >>> 16 & 8;
              var $244 = $236 << $243;
              var $247 = ($244 + 520192 | 0) >>> 16 & 4;
              var $248 = $244 << $247;
              var $251 = ($248 + 245760 | 0) >>> 16 & 2;
              var $257 = 14 - ($247 | $243 | $251) + ($248 << $251 >>> 15) | 0;
              var $I7_0 = $qsize_0 >>> (($257 + 7 | 0) >>> 0) & 1 | $257 << 1;
            }
          } while (0);
          var $I7_0;
          var $264 = ($I7_0 << 2) + __gm_ + 304 | 0;
          HEAP32[$_sum$s2 + ($newbase$s2 + 7)] = $I7_0;
          var $267 = $_sum + ($newbase + 16) | 0;
          HEAP32[$_sum$s2 + ($newbase$s2 + 5)] = 0;
          HEAP32[$267 >> 2] = 0;
          var $271 = HEAP32[__gm_ + 4 >> 2];
          var $272 = 1 << $I7_0;
          if (($271 & $272 | 0) == 0) {
            var $276 = $271 | $272;
            HEAP32[__gm_ + 4 >> 2] = $276;
            HEAP32[$264 >> 2] = $235;
            HEAP32[$_sum$s2 + ($newbase$s2 + 6)] = $264;
            HEAP32[$_sum$s2 + ($newbase$s2 + 3)] = $235;
            HEAP32[$_sum$s2 + ($newbase$s2 + 2)] = $235;
          } else {
            if (($I7_0 | 0) == 31) {
              var $291 = 0;
            } else {
              var $291 = 25 - ($I7_0 >>> 1) | 0;
            }
            var $291;
            var $K8_0 = $qsize_0 << $291;
            var $T_0 = HEAP32[$264 >> 2];
            while (1) {
              var $T_0;
              var $K8_0;
              if ((HEAP32[$T_0 + 4 >> 2] & -8 | 0) == ($qsize_0 | 0)) {
                var $318 = $T_0 + 8 | 0;
                var $319 = HEAPU32[$318 >> 2];
                var $321 = HEAPU32[__gm_ + 16 >> 2];
                var $322 = $T_0 >>> 0 < $321 >>> 0;
                do {
                  if (!$322) {
                    if ($319 >>> 0 < $321 >>> 0) {
                      break;
                    }
                    HEAP32[$319 + 12 >> 2] = $235;
                    HEAP32[$318 >> 2] = $235;
                    HEAP32[$_sum$s2 + ($newbase$s2 + 2)] = $319;
                    HEAP32[$_sum$s2 + ($newbase$s2 + 3)] = $T_0;
                    HEAP32[$_sum$s2 + ($newbase$s2 + 6)] = 0;
                    break $_$35;
                  }
                } while (0);
                _abort();
                throw "Reached an unreachable!";
              } else {
                var $300 = ($K8_0 >>> 31 << 2) + $T_0 + 16 | 0;
                var $301 = HEAPU32[$300 >> 2];
                if (($301 | 0) == 0) {
                  if ($300 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                    HEAP32[$300 >> 2] = $235;
                    HEAP32[$_sum$s2 + ($newbase$s2 + 6)] = $T_0;
                    HEAP32[$_sum$s2 + ($newbase$s2 + 3)] = $235;
                    HEAP32[$_sum$s2 + ($newbase$s2 + 2)] = $235;
                    break $_$35;
                  }
                  _abort();
                  throw "Reached an unreachable!";
                } else {
                  var $K8_0 = $K8_0 << 1;
                  var $T_0 = $301;
                }
              }
            }
          }
        }
      }
    }
  } while (0);
  return $newbase + ($9 | 8) | 0;
  return null;
}

_prepend_alloc["X"] = 1;

function __ZNKSt9bad_alloc4whatEv($this) {
  return STRING_TABLE.__str340 | 0;
  return null;
}

function __ZNKSt20bad_array_new_length4whatEv($this) {
  return STRING_TABLE.__str1441 | 0;
  return null;
}

function __ZSt15get_new_handlerv() {
  var $1 = (tempValue = HEAP32[__ZL13__new_handler >> 2], HEAP32[__ZL13__new_handler >> 2] = tempValue, tempValue);
  return $1;
  return null;
}

function __ZSt15set_new_handlerPFvvE($handler) {
  var $1 = $handler;
  var $2 = (tempValue = HEAP32[__ZL13__new_handler >> 2], HEAP32[__ZL13__new_handler >> 2] = $1, tempValue);
  return $2;
  return null;
}

function __ZNSt9bad_allocC2Ev($this) {
  HEAP32[$this >> 2] = __ZTVSt9bad_alloc + 8 | 0;
  return;
  return;
}

function __ZdlPv($ptr) {
  if (($ptr | 0) != 0) {
    _free($ptr);
  }
  return;
  return;
}

function __ZdlPvRKSt9nothrow_t($ptr, $0) {
  __ZdlPv($ptr);
  return;
  return;
}

function __ZdaPv($ptr) {
  __ZdlPv($ptr);
  return;
  return;
}

function __ZdaPvRKSt9nothrow_t($ptr, $0) {
  __ZdaPv($ptr);
  return;
  return;
}

function __ZNSt9bad_allocD0Ev($this) {
  __ZNSt9bad_allocD2Ev($this);
  var $1 = $this;
  __ZdlPv($1);
  return;
  return;
}

function __ZNSt9bad_allocD2Ev($this) {
  var $1 = $this | 0;
  __ZNSt9exceptionD2Ev($1);
  return;
  return;
}

function __ZNSt20bad_array_new_lengthC2Ev($this) {
  var $1 = $this | 0;
  __ZNSt9bad_allocC2Ev($1);
  HEAP32[$this >> 2] = __ZTVSt20bad_array_new_length + 8 | 0;
  return;
  return;
}

function __ZNSt20bad_array_new_lengthD0Ev($this) {
  var $1 = $this | 0;
  __ZNSt9bad_allocD2Ev($1);
  var $2 = $this;
  __ZdlPv($2);
  return;
  return;
}

function _add_segment($tbase, $tsize) {
  var $23$s2;
  var $1$s2;
  var $1 = HEAPU32[__gm_ + 24 >> 2], $1$s2 = $1 >> 2;
  var $2 = $1;
  var $3 = _segment_holding($2);
  var $5 = HEAP32[$3 >> 2];
  var $7 = HEAP32[$3 + 4 >> 2];
  var $8 = $5 + $7 | 0;
  var $10 = $5 + ($7 - 39) | 0;
  if (($10 & 7 | 0) == 0) {
    var $17 = 0;
  } else {
    var $17 = -$10 & 7;
  }
  var $17;
  var $18 = $5 + ($7 - 47) + $17 | 0;
  var $22 = $18 >>> 0 < ($1 + 16 | 0) >>> 0 ? $2 : $18;
  var $23 = $22 + 8 | 0, $23$s2 = $23 >> 2;
  var $24 = $23;
  var $25 = $tbase;
  var $26 = $tsize - 40 | 0;
  _init_top($25, $26);
  var $28 = $22 + 4 | 0;
  HEAP32[$28 >> 2] = 27;
  HEAP32[$23$s2] = HEAP32[__gm_ + 444 >> 2];
  HEAP32[$23$s2 + 1] = HEAP32[__gm_ + 448 >> 2];
  HEAP32[$23$s2 + 2] = HEAP32[__gm_ + 452 >> 2];
  HEAP32[$23$s2 + 3] = HEAP32[__gm_ + 456 >> 2];
  HEAP32[__gm_ + 444 >> 2] = $tbase;
  HEAP32[__gm_ + 448 >> 2] = $tsize;
  HEAP32[__gm_ + 456 >> 2] = 0;
  HEAP32[__gm_ + 452 >> 2] = $24;
  var $30 = $22 + 28 | 0;
  HEAP32[$30 >> 2] = 7;
  var $32 = ($22 + 32 | 0) >>> 0 < $8 >>> 0;
  $_$5 : do {
    if ($32) {
      var $33 = $30;
      while (1) {
        var $33;
        var $34 = $33 + 4 | 0;
        HEAP32[$34 >> 2] = 7;
        if (($33 + 8 | 0) >>> 0 >= $8 >>> 0) {
          break $_$5;
        }
        var $33 = $34;
      }
    }
  } while (0);
  var $38 = ($22 | 0) == ($2 | 0);
  $_$9 : do {
    if (!$38) {
      var $42 = $22 - $1 | 0;
      var $43 = $2 + $42 | 0;
      var $45 = $42 + ($2 + 4) | 0;
      var $47 = HEAP32[$45 >> 2] & -2;
      HEAP32[$45 >> 2] = $47;
      var $48 = $42 | 1;
      HEAP32[$1$s2 + 1] = $48;
      var $50 = $43;
      HEAP32[$50 >> 2] = $42;
      if ($42 >>> 0 < 256) {
        var $55 = $42 >>> 2 & 1073741822;
        var $57 = ($55 << 2) + __gm_ + 40 | 0;
        var $58 = HEAPU32[__gm_ >> 2];
        var $59 = 1 << ($42 >>> 3);
        var $61 = ($58 & $59 | 0) == 0;
        do {
          if ($61) {
            var $63 = $58 | $59;
            HEAP32[__gm_ >> 2] = $63;
            var $F_0 = $57;
            var $_pre_phi = ($55 + 2 << 2) + __gm_ + 40 | 0;
          } else {
            var $65 = ($55 + 2 << 2) + __gm_ + 40 | 0;
            var $66 = HEAPU32[$65 >> 2];
            if ($66 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
              var $F_0 = $66;
              var $_pre_phi = $65;
              break;
            }
            _abort();
            throw "Reached an unreachable!";
          }
        } while (0);
        var $_pre_phi;
        var $F_0;
        HEAP32[$_pre_phi >> 2] = $1;
        HEAP32[$F_0 + 12 >> 2] = $1;
        HEAP32[$1$s2 + 2] = $F_0;
        HEAP32[$1$s2 + 3] = $57;
      } else {
        var $76 = $1;
        var $77 = $42 >>> 8;
        var $78 = ($77 | 0) == 0;
        do {
          if ($78) {
            var $I1_0 = 0;
          } else {
            if ($42 >>> 0 > 16777215) {
              var $I1_0 = 31;
              break;
            }
            var $84 = ($77 + 1048320 | 0) >>> 16 & 8;
            var $85 = $77 << $84;
            var $88 = ($85 + 520192 | 0) >>> 16 & 4;
            var $89 = $85 << $88;
            var $92 = ($89 + 245760 | 0) >>> 16 & 2;
            var $98 = 14 - ($88 | $84 | $92) + ($89 << $92 >>> 15) | 0;
            var $I1_0 = $42 >>> (($98 + 7 | 0) >>> 0) & 1 | $98 << 1;
          }
        } while (0);
        var $I1_0;
        var $105 = ($I1_0 << 2) + __gm_ + 304 | 0;
        HEAP32[$1$s2 + 7] = $I1_0;
        HEAP32[$1$s2 + 5] = 0;
        HEAP32[$1$s2 + 4] = 0;
        var $109 = HEAP32[__gm_ + 4 >> 2];
        var $110 = 1 << $I1_0;
        if (($109 & $110 | 0) == 0) {
          var $114 = $109 | $110;
          HEAP32[__gm_ + 4 >> 2] = $114;
          HEAP32[$105 >> 2] = $76;
          HEAP32[$1$s2 + 6] = $105;
          HEAP32[$1$s2 + 3] = $1;
          HEAP32[$1$s2 + 2] = $1;
        } else {
          if (($I1_0 | 0) == 31) {
            var $125 = 0;
          } else {
            var $125 = 25 - ($I1_0 >>> 1) | 0;
          }
          var $125;
          var $K2_0 = $42 << $125;
          var $T_0 = HEAP32[$105 >> 2];
          while (1) {
            var $T_0;
            var $K2_0;
            if ((HEAP32[$T_0 + 4 >> 2] & -8 | 0) == ($42 | 0)) {
              var $149 = $T_0 + 8 | 0;
              var $150 = HEAPU32[$149 >> 2];
              var $152 = HEAPU32[__gm_ + 16 >> 2];
              var $153 = $T_0 >>> 0 < $152 >>> 0;
              do {
                if (!$153) {
                  if ($150 >>> 0 < $152 >>> 0) {
                    break;
                  }
                  HEAP32[$150 + 12 >> 2] = $76;
                  HEAP32[$149 >> 2] = $76;
                  HEAP32[$1$s2 + 2] = $150;
                  HEAP32[$1$s2 + 3] = $T_0;
                  HEAP32[$1$s2 + 6] = 0;
                  break $_$9;
                }
              } while (0);
              _abort();
              throw "Reached an unreachable!";
            } else {
              var $134 = ($K2_0 >>> 31 << 2) + $T_0 + 16 | 0;
              var $135 = HEAPU32[$134 >> 2];
              if (($135 | 0) == 0) {
                if ($134 >>> 0 >= HEAPU32[__gm_ + 16 >> 2] >>> 0) {
                  HEAP32[$134 >> 2] = $76;
                  HEAP32[$1$s2 + 6] = $T_0;
                  HEAP32[$1$s2 + 3] = $1;
                  HEAP32[$1$s2 + 2] = $1;
                  break $_$9;
                }
                _abort();
                throw "Reached an unreachable!";
              } else {
                var $K2_0 = $K2_0 << 1;
                var $T_0 = $135;
              }
            }
          }
        }
      }
    }
  } while (0);
  return;
  return;
}

_add_segment["X"] = 1;

function __Znwj($size) {
  var $_0_ph = ($size | 0) == 0 ? 1 : $size;
  while (1) {
    var $2 = _malloc($_0_ph);
    if (($2 | 0) == 0) {
      var $5 = __ZSt15get_new_handlerv();
      if (($5 | 0) == 0) {
        var $14 = ___cxa_allocate_exception(4);
        var $15 = $14;
        __ZNSt9bad_allocC2Ev($15);
        ___cxa_throw($14, __ZTISt9bad_alloc, 6);
        throw "Reached an unreachable!";
      } else {
        FUNCTION_TABLE[$5]();
      }
    } else {
      return $2;
    }
  }
  return null;
}

function __ZnwjRKSt9nothrow_t($size, $0) {
  var $2 = __Znwj($size);
  return undefined;
  return null;
}

function __Znaj($size) {
  var $1 = __Znwj($size);
  return $1;
  return null;
}

function __ZnajRKSt9nothrow_t($size, $nothrow) {
  var $1 = __Znaj($size);
  var $p_0 = $1;
  var $p_0;
  return $p_0;
  return null;
}

function __ZSt17__throw_bad_allocv() {
  var $1 = ___cxa_allocate_exception(4);
  var $2 = $1;
  __ZNSt9bad_allocC2Ev($2);
  ___cxa_throw($1, __ZTISt9bad_alloc, 6);
  throw "Reached an unreachable!";
}

var i64Math = null;

function ___gxx_personality_v0() {}

var _mrGetLayerCount;

var _mrBindLayer;

var _mrGetWidth;

var _mrGetHeight;

var _mrGetSize;

var _mrIndex;

function _memcpy(dest, src, num, align) {
  if (num >= 20 && src % 2 == dest % 2) {
    if (src % 4 == dest % 4) {
      var stop = src + num;
      while (src % 4) {
        HEAP8[dest++] = HEAP8[src++];
      }
      var src4 = src >> 2, dest4 = dest >> 2, stop4 = stop >> 2;
      while (src4 < stop4) {
        HEAP32[dest4++] = HEAP32[src4++];
      }
      src = src4 << 2;
      dest = dest4 << 2;
      while (src < stop) {
        HEAP8[dest++] = HEAP8[src++];
      }
    } else {
      var stop = src + num;
      if (src % 2) {
        HEAP8[dest++] = HEAP8[src++];
      }
      var src2 = src >> 1, dest2 = dest >> 1, stop2 = stop >> 1;
      while (src2 < stop2) {
        HEAP16[dest2++] = HEAP16[src2++];
      }
      src = src2 << 1;
      dest = dest2 << 1;
      if (src < stop) {
        HEAP8[dest++] = HEAP8[src++];
      }
    }
  } else {
    while (num--) {
      HEAP8[dest++] = HEAP8[src++];
    }
  }
}

var _llvm_memcpy_p0i8_p0i8_i32 = _memcpy;

var _gelGraphicsInit;

var _gelLoadTileset;

var _gelLoadImage;

var _gelGraphicsExit;

var _sndPlay;

var _floor = Math.floor;

var _gelDrawTile;

var _gelBindTileset;

var _gelDrawTileCentered;

var _gelBindImage;

function __formatString(format, varargs) {
  var textIndex = format;
  var argIndex = 0;
  function getNextArg(type) {
    var ret;
    if (type === "double") {
      ret = (tempDoubleI32[0] = HEAP32[varargs + argIndex >> 2], tempDoubleI32[1] = HEAP32[varargs + argIndex + 4 >> 2], tempDoubleF64[0]);
    } else if (type == "i64") {
      ret = [ HEAP32[varargs + argIndex >> 2], HEAP32[varargs + argIndex + 4 >> 2] ];
    } else {
      type = "i32";
      ret = HEAP32[varargs + argIndex >> 2];
    }
    argIndex += Runtime.getNativeFieldSize(type);
    return ret;
  }
  var ret = [];
  var curr, next, currArg;
  while (1) {
    var startTextIndex = textIndex;
    curr = HEAP8[textIndex];
    if (curr === 0) break;
    next = HEAP8[textIndex + 1];
    if (curr == "%".charCodeAt(0)) {
      var flagAlwaysSigned = false;
      var flagLeftAlign = false;
      var flagAlternative = false;
      var flagZeroPad = false;
      flagsLoop : while (1) {
        switch (next) {
         case "+".charCodeAt(0):
          flagAlwaysSigned = true;
          break;
         case "-".charCodeAt(0):
          flagLeftAlign = true;
          break;
         case "#".charCodeAt(0):
          flagAlternative = true;
          break;
         case "0".charCodeAt(0):
          if (flagZeroPad) {
            break flagsLoop;
          } else {
            flagZeroPad = true;
            break;
          }
         default:
          break flagsLoop;
        }
        textIndex++;
        next = HEAP8[textIndex + 1];
      }
      var width = 0;
      if (next == "*".charCodeAt(0)) {
        width = getNextArg("i32");
        textIndex++;
        next = HEAP8[textIndex + 1];
      } else {
        while (next >= "0".charCodeAt(0) && next <= "9".charCodeAt(0)) {
          width = width * 10 + (next - "0".charCodeAt(0));
          textIndex++;
          next = HEAP8[textIndex + 1];
        }
      }
      var precisionSet = false;
      if (next == ".".charCodeAt(0)) {
        var precision = 0;
        precisionSet = true;
        textIndex++;
        next = HEAP8[textIndex + 1];
        if (next == "*".charCodeAt(0)) {
          precision = getNextArg("i32");
          textIndex++;
        } else {
          while (1) {
            var precisionChr = HEAP8[textIndex + 1];
            if (precisionChr < "0".charCodeAt(0) || precisionChr > "9".charCodeAt(0)) break;
            precision = precision * 10 + (precisionChr - "0".charCodeAt(0));
            textIndex++;
          }
        }
        next = HEAP8[textIndex + 1];
      } else {
        var precision = 6;
      }
      var argSize;
      switch (String.fromCharCode(next)) {
       case "h":
        var nextNext = HEAP8[textIndex + 2];
        if (nextNext == "h".charCodeAt(0)) {
          textIndex++;
          argSize = 1;
        } else {
          argSize = 2;
        }
        break;
       case "l":
        var nextNext = HEAP8[textIndex + 2];
        if (nextNext == "l".charCodeAt(0)) {
          textIndex++;
          argSize = 8;
        } else {
          argSize = 4;
        }
        break;
       case "L":
       case "q":
       case "j":
        argSize = 8;
        break;
       case "z":
       case "t":
       case "I":
        argSize = 4;
        break;
       default:
        argSize = null;
      }
      if (argSize) textIndex++;
      next = HEAP8[textIndex + 1];
      if ([ "d", "i", "u", "o", "x", "X", "p" ].indexOf(String.fromCharCode(next)) != -1) {
        var signed = next == "d".charCodeAt(0) || next == "i".charCodeAt(0);
        argSize = argSize || 4;
        var currArg = getNextArg("i" + argSize * 8);
        var origArg = currArg;
        var argText;
        if (argSize == 8) {
          currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == "u".charCodeAt(0));
        }
        if (argSize <= 4) {
          var limit = Math.pow(256, argSize) - 1;
          currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
        }
        var currAbsArg = Math.abs(currArg);
        var prefix = "";
        if (next == "d".charCodeAt(0) || next == "i".charCodeAt(0)) {
          if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1]); else argText = reSign(currArg, 8 * argSize, 1).toString(10);
        } else if (next == "u".charCodeAt(0)) {
          if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else argText = unSign(currArg, 8 * argSize, 1).toString(10);
          currArg = Math.abs(currArg);
        } else if (next == "o".charCodeAt(0)) {
          argText = (flagAlternative ? "0" : "") + currAbsArg.toString(8);
        } else if (next == "x".charCodeAt(0) || next == "X".charCodeAt(0)) {
          prefix = flagAlternative ? "0x" : "";
          if (currArg < 0) {
            currArg = -currArg;
            argText = (currAbsArg - 1).toString(16);
            var buffer = [];
            for (var i = 0; i < argText.length; i++) {
              buffer.push((15 - parseInt(argText[i], 16)).toString(16));
            }
            argText = buffer.join("");
            while (argText.length < argSize * 2) argText = "f" + argText;
          } else {
            argText = currAbsArg.toString(16);
          }
          if (next == "X".charCodeAt(0)) {
            prefix = prefix.toUpperCase();
            argText = argText.toUpperCase();
          }
        } else if (next == "p".charCodeAt(0)) {
          if (currAbsArg === 0) {
            argText = "(nil)";
          } else {
            prefix = "0x";
            argText = currAbsArg.toString(16);
          }
        }
        if (precisionSet) {
          while (argText.length < precision) {
            argText = "0" + argText;
          }
        }
        if (flagAlwaysSigned) {
          if (currArg < 0) {
            prefix = "-" + prefix;
          } else {
            prefix = "+" + prefix;
          }
        }
        while (prefix.length + argText.length < width) {
          if (flagLeftAlign) {
            argText += " ";
          } else {
            if (flagZeroPad) {
              argText = "0" + argText;
            } else {
              prefix = " " + prefix;
            }
          }
        }
        argText = prefix + argText;
        argText.split("").forEach((function(chr) {
          ret.push(chr.charCodeAt(0));
        }));
      } else if ([ "f", "F", "e", "E", "g", "G" ].indexOf(String.fromCharCode(next)) != -1) {
        var currArg = getNextArg("double");
        var argText;
        if (isNaN(currArg)) {
          argText = "nan";
          flagZeroPad = false;
        } else if (!isFinite(currArg)) {
          argText = (currArg < 0 ? "-" : "") + "inf";
          flagZeroPad = false;
        } else {
          var isGeneral = false;
          var effectivePrecision = Math.min(precision, 20);
          if (next == "g".charCodeAt(0) || next == "G".charCodeAt(0)) {
            isGeneral = true;
            precision = precision || 1;
            var exponent = parseInt(currArg.toExponential(effectivePrecision).split("e")[1], 10);
            if (precision > exponent && exponent >= -4) {
              next = (next == "g".charCodeAt(0) ? "f" : "F").charCodeAt(0);
              precision -= exponent + 1;
            } else {
              next = (next == "g".charCodeAt(0) ? "e" : "E").charCodeAt(0);
              precision--;
            }
            effectivePrecision = Math.min(precision, 20);
          }
          if (next == "e".charCodeAt(0) || next == "E".charCodeAt(0)) {
            argText = currArg.toExponential(effectivePrecision);
            if (/[eE][-+]\d$/.test(argText)) {
              argText = argText.slice(0, -1) + "0" + argText.slice(-1);
            }
          } else if (next == "f".charCodeAt(0) || next == "F".charCodeAt(0)) {
            argText = currArg.toFixed(effectivePrecision);
          }
          var parts = argText.split("e");
          if (isGeneral && !flagAlternative) {
            while (parts[0].length > 1 && parts[0].indexOf(".") != -1 && (parts[0].slice(-1) == "0" || parts[0].slice(-1) == ".")) {
              parts[0] = parts[0].slice(0, -1);
            }
          } else {
            if (flagAlternative && argText.indexOf(".") == -1) parts[0] += ".";
            while (precision > effectivePrecision++) parts[0] += "0";
          }
          argText = parts[0] + (parts.length > 1 ? "e" + parts[1] : "");
          if (next == "E".charCodeAt(0)) argText = argText.toUpperCase();
          if (flagAlwaysSigned && currArg >= 0) {
            argText = "+" + argText;
          }
        }
        while (argText.length < width) {
          if (flagLeftAlign) {
            argText += " ";
          } else {
            if (flagZeroPad && (argText[0] == "-" || argText[0] == "+")) {
              argText = argText[0] + "0" + argText.slice(1);
            } else {
              argText = (flagZeroPad ? "0" : " ") + argText;
            }
          }
        }
        if (next < "a".charCodeAt(0)) argText = argText.toUpperCase();
        argText.split("").forEach((function(chr) {
          ret.push(chr.charCodeAt(0));
        }));
      } else if (next == "s".charCodeAt(0)) {
        var arg = getNextArg("i8*");
        var copiedString;
        if (arg) {
          copiedString = String_copy(arg);
          if (precisionSet && copiedString.length > precision) {
            copiedString = copiedString.slice(0, precision);
          }
        } else {
          copiedString = intArrayFromString("(null)", true);
        }
        if (!flagLeftAlign) {
          while (copiedString.length < width--) {
            ret.push(" ".charCodeAt(0));
          }
        }
        ret = ret.concat(copiedString);
        if (flagLeftAlign) {
          while (copiedString.length < width--) {
            ret.push(" ".charCodeAt(0));
          }
        }
      } else if (next == "c".charCodeAt(0)) {
        if (flagLeftAlign) ret.push(getNextArg("i8"));
        while (--width > 0) {
          ret.push(" ".charCodeAt(0));
        }
        if (!flagLeftAlign) ret.push(getNextArg("i8"));
      } else if (next == "n".charCodeAt(0)) {
        var ptr = getNextArg("i32*");
        HEAP32[ptr >> 2] = ret.length;
      } else if (next == "%".charCodeAt(0)) {
        ret.push(curr);
      } else {
        for (var i = startTextIndex; i < textIndex + 2; i++) {
          ret.push(HEAP8[i]);
        }
      }
      textIndex += 2;
    } else {
      ret.push(curr);
      textIndex += 1;
    }
  }
  return ret;
}

function _snprintf(s, n, format, varargs) {
  var result = __formatString(format, varargs);
  var limit = n === undefined ? result.length : Math.min(result.length, n - 1);
  for (var i = 0; i < limit; i++) {
    HEAP8[s + i] = result[i];
  }
  HEAP8[s + i] = 0;
  return result.length;
}

function _sprintf(s, format, varargs) {
  return _snprintf(s, undefined, format, varargs);
}

var _gelSetColor;

var _gelDrawTextLeft;

var _gelDrawTextRight;

var _gelDrawImage;

function _llvm_umul_with_overflow_i32(x, y) {
  x = x >>> 0;
  y = y >>> 0;
  return {
    f0: x * y >>> 0,
    f1: x * y > 4294967295
  };
}

var _gelDrawTileFlipX;

var ___rand_state = 42;

function _rand() {
  ___rand_state = (1103515245 * ___rand_state + 12345) % 4294967296;
  return ___rand_state & 2147483647;
}

function _llvm_stacksave() {
  var self = _llvm_stacksave;
  if (!self.LLVM_SAVEDSTACKS) {
    self.LLVM_SAVEDSTACKS = [];
  }
  self.LLVM_SAVEDSTACKS.push(Runtime.stackSave());
  return self.LLVM_SAVEDSTACKS.length - 1;
}

var ERRNO_CODES = {
  E2BIG: 7,
  EACCES: 13,
  EADDRINUSE: 98,
  EADDRNOTAVAIL: 99,
  EAFNOSUPPORT: 97,
  EAGAIN: 11,
  EALREADY: 114,
  EBADF: 9,
  EBADMSG: 74,
  EBUSY: 16,
  ECANCELED: 125,
  ECHILD: 10,
  ECONNABORTED: 103,
  ECONNREFUSED: 111,
  ECONNRESET: 104,
  EDEADLK: 35,
  EDESTADDRREQ: 89,
  EDOM: 33,
  EDQUOT: 122,
  EEXIST: 17,
  EFAULT: 14,
  EFBIG: 27,
  EHOSTUNREACH: 113,
  EIDRM: 43,
  EILSEQ: 84,
  EINPROGRESS: 115,
  EINTR: 4,
  EINVAL: 22,
  EIO: 5,
  EISCONN: 106,
  EISDIR: 21,
  ELOOP: 40,
  EMFILE: 24,
  EMLINK: 31,
  EMSGSIZE: 90,
  EMULTIHOP: 72,
  ENAMETOOLONG: 36,
  ENETDOWN: 100,
  ENETRESET: 102,
  ENETUNREACH: 101,
  ENFILE: 23,
  ENOBUFS: 105,
  ENODATA: 61,
  ENODEV: 19,
  ENOENT: 2,
  ENOEXEC: 8,
  ENOLCK: 37,
  ENOLINK: 67,
  ENOMEM: 12,
  ENOMSG: 42,
  ENOPROTOOPT: 92,
  ENOSPC: 28,
  ENOSR: 63,
  ENOSTR: 60,
  ENOSYS: 38,
  ENOTCONN: 107,
  ENOTDIR: 20,
  ENOTEMPTY: 39,
  ENOTRECOVERABLE: 131,
  ENOTSOCK: 88,
  ENOTSUP: 95,
  ENOTTY: 25,
  ENXIO: 6,
  EOVERFLOW: 75,
  EOWNERDEAD: 130,
  EPERM: 1,
  EPIPE: 32,
  EPROTO: 71,
  EPROTONOSUPPORT: 93,
  EPROTOTYPE: 91,
  ERANGE: 34,
  EROFS: 30,
  ESPIPE: 29,
  ESRCH: 3,
  ESTALE: 116,
  ETIME: 62,
  ETIMEDOUT: 110,
  ETXTBSY: 26,
  EWOULDBLOCK: 11,
  EXDEV: 18
};

function ___setErrNo(value) {
  if (!___setErrNo.ret) ___setErrNo.ret = allocate([ 0 ], "i32", ALLOC_STATIC);
  HEAP32[___setErrNo.ret >> 2] = value;
  return value;
}

var _stdin = 0;

var _stdout = 0;

var _stderr = 0;

var __impure_ptr = 0;

var FS = {
  currentPath: "/",
  nextInode: 2,
  streams: [ null ],
  ignorePermissions: true,
  absolutePath: (function(relative, base) {
    if (typeof relative !== "string") return null;
    if (base === undefined) base = FS.currentPath;
    if (relative && relative[0] == "/") base = "";
    var full = base + "/" + relative;
    var parts = full.split("/").reverse();
    var absolute = [ "" ];
    while (parts.length) {
      var part = parts.pop();
      if (part == "" || part == ".") {} else if (part == "..") {
        if (absolute.length > 1) absolute.pop();
      } else {
        absolute.push(part);
      }
    }
    return absolute.length == 1 ? "/" : absolute.join("/");
  }),
  analyzePath: (function(path, dontResolveLastLink, linksVisited) {
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null
    };
    path = FS.absolutePath(path);
    if (path == "/") {
      ret.isRoot = true;
      ret.exists = ret.parentExists = true;
      ret.name = "/";
      ret.path = ret.parentPath = "/";
      ret.object = ret.parentObject = FS.root;
    } else if (path !== null) {
      linksVisited = linksVisited || 0;
      path = path.slice(1).split("/");
      var current = FS.root;
      var traversed = [ "" ];
      while (path.length) {
        if (path.length == 1 && current.isFolder) {
          ret.parentExists = true;
          ret.parentPath = traversed.length == 1 ? "/" : traversed.join("/");
          ret.parentObject = current;
          ret.name = path[0];
        }
        var target = path.shift();
        if (!current.isFolder) {
          ret.error = ERRNO_CODES.ENOTDIR;
          break;
        } else if (!current.read) {
          ret.error = ERRNO_CODES.EACCES;
          break;
        } else if (!current.contents.hasOwnProperty(target)) {
          ret.error = ERRNO_CODES.ENOENT;
          break;
        }
        current = current.contents[target];
        if (current.link && !(dontResolveLastLink && path.length == 0)) {
          if (linksVisited > 40) {
            ret.error = ERRNO_CODES.ELOOP;
            break;
          }
          var link = FS.absolutePath(current.link, traversed.join("/"));
          ret = FS.analyzePath([ link ].concat(path).join("/"), dontResolveLastLink, linksVisited + 1);
          return ret;
        }
        traversed.push(target);
        if (path.length == 0) {
          ret.exists = true;
          ret.path = traversed.join("/");
          ret.object = current;
        }
      }
    }
    return ret;
  }),
  findObject: (function(path, dontResolveLastLink) {
    FS.ensureRoot();
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (ret.exists) {
      return ret.object;
    } else {
      ___setErrNo(ret.error);
      return null;
    }
  }),
  createObject: (function(parent, name, properties, canRead, canWrite) {
    if (!parent) parent = "/";
    if (typeof parent === "string") parent = FS.findObject(parent);
    if (!parent) {
      ___setErrNo(ERRNO_CODES.EACCES);
      throw new Error("Parent path must exist.");
    }
    if (!parent.isFolder) {
      ___setErrNo(ERRNO_CODES.ENOTDIR);
      throw new Error("Parent must be a folder.");
    }
    if (!parent.write && !FS.ignorePermissions) {
      ___setErrNo(ERRNO_CODES.EACCES);
      throw new Error("Parent folder must be writeable.");
    }
    if (!name || name == "." || name == "..") {
      ___setErrNo(ERRNO_CODES.ENOENT);
      throw new Error("Name must not be empty.");
    }
    if (parent.contents.hasOwnProperty(name)) {
      ___setErrNo(ERRNO_CODES.EEXIST);
      throw new Error("Can't overwrite object.");
    }
    parent.contents[name] = {
      read: canRead === undefined ? true : canRead,
      write: canWrite === undefined ? false : canWrite,
      timestamp: Date.now(),
      inodeNumber: FS.nextInode++
    };
    for (var key in properties) {
      if (properties.hasOwnProperty(key)) {
        parent.contents[name][key] = properties[key];
      }
    }
    return parent.contents[name];
  }),
  createFolder: (function(parent, name, canRead, canWrite) {
    var properties = {
      isFolder: true,
      isDevice: false,
      contents: {}
    };
    return FS.createObject(parent, name, properties, canRead, canWrite);
  }),
  createPath: (function(parent, path, canRead, canWrite) {
    var current = FS.findObject(parent);
    if (current === null) throw new Error("Invalid parent.");
    path = path.split("/").reverse();
    while (path.length) {
      var part = path.pop();
      if (!part) continue;
      if (!current.contents.hasOwnProperty(part)) {
        FS.createFolder(current, part, canRead, canWrite);
      }
      current = current.contents[part];
    }
    return current;
  }),
  createFile: (function(parent, name, properties, canRead, canWrite) {
    properties.isFolder = false;
    return FS.createObject(parent, name, properties, canRead, canWrite);
  }),
  createDataFile: (function(parent, name, data, canRead, canWrite) {
    if (typeof data === "string") {
      var dataArray = new Array(data.length);
      for (var i = 0, len = data.length; i < len; ++i) dataArray[i] = data.charCodeAt(i);
      data = dataArray;
    }
    var properties = {
      isDevice: false,
      contents: data
    };
    return FS.createFile(parent, name, properties, canRead, canWrite);
  }),
  createLazyFile: (function(parent, name, url, canRead, canWrite) {
    var properties = {
      isDevice: false,
      url: url
    };
    return FS.createFile(parent, name, properties, canRead, canWrite);
  }),
  createLink: (function(parent, name, target, canRead, canWrite) {
    var properties = {
      isDevice: false,
      link: target
    };
    return FS.createFile(parent, name, properties, canRead, canWrite);
  }),
  createDevice: (function(parent, name, input, output) {
    if (!(input || output)) {
      throw new Error("A device must have at least one callback defined.");
    }
    var ops = {
      isDevice: true,
      input: input,
      output: output
    };
    return FS.createFile(parent, name, ops, Boolean(input), Boolean(output));
  }),
  forceLoadFile: (function(obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    var success = true;
    if (typeof XMLHttpRequest !== "undefined") {
      assert("Cannot do synchronous binary XHRs in modern browsers. Use --embed-file or --preload-file in emcc");
    } else if (Module["read"]) {
      try {
        obj.contents = intArrayFromString(Module["read"](obj.url), true);
      } catch (e) {
        success = false;
      }
    } else {
      throw new Error("Cannot load without read() or XMLHttpRequest.");
    }
    if (!success) ___setErrNo(ERRNO_CODES.EIO);
    return success;
  }),
  ensureRoot: (function() {
    if (FS.root) return;
    FS.root = {
      read: true,
      write: true,
      isFolder: true,
      isDevice: false,
      timestamp: Date.now(),
      inodeNumber: 1,
      contents: {}
    };
  }),
  init: (function(input, output, error) {
    assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
    FS.init.initialized = true;
    FS.ensureRoot();
    input = input || Module["stdin"];
    output = output || Module["stdout"];
    error = error || Module["stderr"];
    var stdinOverridden = true, stdoutOverridden = true, stderrOverridden = true;
    if (!input) {
      stdinOverridden = false;
      input = (function() {
        if (!input.cache || !input.cache.length) {
          var result;
          if (typeof window != "undefined" && typeof window.prompt == "function") {
            result = window.prompt("Input: ");
          } else if (typeof readline == "function") {
            result = readline();
          }
          if (!result) result = "";
          input.cache = intArrayFromString(result + "\n", true);
        }
        return input.cache.shift();
      });
    }
    function simpleOutput(val) {
      if (val === null || val === "\n".charCodeAt(0)) {
        output.printer(output.buffer.join(""));
        output.buffer = [];
      } else {
        output.buffer.push(String.fromCharCode(val));
      }
    }
    if (!output) {
      stdoutOverridden = false;
      output = simpleOutput;
    }
    if (!output.printer) output.printer = Module["print"];
    if (!output.buffer) output.buffer = [];
    if (!error) {
      stderrOverridden = false;
      error = simpleOutput;
    }
    if (!error.printer) error.printer = Module["print"];
    if (!error.buffer) error.buffer = [];
    FS.createFolder("/", "tmp", true, true);
    var devFolder = FS.createFolder("/", "dev", true, true);
    var stdin = FS.createDevice(devFolder, "stdin", input);
    var stdout = FS.createDevice(devFolder, "stdout", null, output);
    var stderr = FS.createDevice(devFolder, "stderr", null, error);
    FS.createDevice(devFolder, "tty", input, output);
    FS.streams[1] = {
      path: "/dev/stdin",
      object: stdin,
      position: 0,
      isRead: true,
      isWrite: false,
      isAppend: false,
      isTerminal: !stdinOverridden,
      error: false,
      eof: false,
      ungotten: []
    };
    FS.streams[2] = {
      path: "/dev/stdout",
      object: stdout,
      position: 0,
      isRead: false,
      isWrite: true,
      isAppend: false,
      isTerminal: !stdoutOverridden,
      error: false,
      eof: false,
      ungotten: []
    };
    FS.streams[3] = {
      path: "/dev/stderr",
      object: stderr,
      position: 0,
      isRead: false,
      isWrite: true,
      isAppend: false,
      isTerminal: !stderrOverridden,
      error: false,
      eof: false,
      ungotten: []
    };
    _stdin = allocate([ 1 ], "void*", ALLOC_STATIC);
    _stdout = allocate([ 2 ], "void*", ALLOC_STATIC);
    _stderr = allocate([ 3 ], "void*", ALLOC_STATIC);
    FS.createPath("/", "dev/shm/tmp", true, true);
    FS.streams[_stdin] = FS.streams[1];
    FS.streams[_stdout] = FS.streams[2];
    FS.streams[_stderr] = FS.streams[3];
    __impure_ptr = allocate([ allocate([ 0, 0, 0, 0, _stdin, 0, 0, 0, _stdout, 0, 0, 0, _stderr, 0, 0, 0 ], "void*", ALLOC_STATIC) ], "void*", ALLOC_STATIC);
  }),
  quit: (function() {
    if (!FS.init.initialized) return;
    if (FS.streams[2] && FS.streams[2].object.output.buffer.length > 0) FS.streams[2].object.output("\n".charCodeAt(0));
    if (FS.streams[3] && FS.streams[3].object.output.buffer.length > 0) FS.streams[3].object.output("\n".charCodeAt(0));
  }),
  standardizePath: (function(path) {
    if (path.substr(0, 2) == "./") path = path.substr(2);
    return path;
  }),
  deleteFile: (function(path) {
    var path = FS.analyzePath(path);
    if (!path.parentExists || !path.exists) {
      throw "Invalid path " + path;
    }
    delete path.parentObject.contents[path.name];
  })
};

function _pwrite(fildes, buf, nbyte, offset) {
  var stream = FS.streams[fildes];
  if (!stream || stream.object.isDevice) {
    ___setErrNo(ERRNO_CODES.EBADF);
    return -1;
  } else if (!stream.isWrite) {
    ___setErrNo(ERRNO_CODES.EACCES);
    return -1;
  } else if (stream.object.isFolder) {
    ___setErrNo(ERRNO_CODES.EISDIR);
    return -1;
  } else if (nbyte < 0 || offset < 0) {
    ___setErrNo(ERRNO_CODES.EINVAL);
    return -1;
  } else {
    var contents = stream.object.contents;
    while (contents.length < offset) contents.push(0);
    for (var i = 0; i < nbyte; i++) {
      contents[offset + i] = HEAPU8[buf + i];
    }
    stream.object.timestamp = Date.now();
    return i;
  }
}

function _write(fildes, buf, nbyte) {
  var stream = FS.streams[fildes];
  if (!stream) {
    ___setErrNo(ERRNO_CODES.EBADF);
    return -1;
  } else if (!stream.isWrite) {
    ___setErrNo(ERRNO_CODES.EACCES);
    return -1;
  } else if (nbyte < 0) {
    ___setErrNo(ERRNO_CODES.EINVAL);
    return -1;
  } else {
    if (stream.object.isDevice) {
      if (stream.object.output) {
        for (var i = 0; i < nbyte; i++) {
          try {
            stream.object.output(HEAP8[buf + i]);
          } catch (e) {
            ___setErrNo(ERRNO_CODES.EIO);
            return -1;
          }
        }
        stream.object.timestamp = Date.now();
        return i;
      } else {
        ___setErrNo(ERRNO_CODES.ENXIO);
        return -1;
      }
    } else {
      var bytesWritten = _pwrite(fildes, buf, nbyte, stream.position);
      if (bytesWritten != -1) stream.position += bytesWritten;
      return bytesWritten;
    }
  }
}

function _fwrite(ptr, size, nitems, stream) {
  var bytesToWrite = nitems * size;
  if (bytesToWrite == 0) return 0;
  var bytesWritten = _write(stream, ptr, bytesToWrite);
  if (bytesWritten == -1) {
    if (FS.streams[stream]) FS.streams[stream].error = true;
    return -1;
  } else {
    return Math.floor(bytesWritten / size);
  }
}

function _fprintf(stream, format, varargs) {
  var result = __formatString(format, varargs);
  var stack = Runtime.stackSave();
  var ret = _fwrite(allocate(result, "i8", ALLOC_STACK), 1, result.length, stream);
  Runtime.stackRestore(stack);
  return ret;
}

function _printf(format, varargs) {
  var stdout = HEAP32[_stdout >> 2];
  return _fprintf(stdout, format, varargs);
}

function _llvm_stackrestore(p) {
  var self = _llvm_stacksave;
  var ret = self.LLVM_SAVEDSTACKS[p];
  self.LLVM_SAVEDSTACKS.splice(p, 1);
  Runtime.stackRestore(ret);
}

var _llvm_va_start;

function _llvm_va_end() {}

function _strlen(ptr) {
  return String_len(ptr);
}

function _tolower(chr) {
  if (chr >= "A".charCodeAt(0) && chr <= "Z".charCodeAt(0)) {
    return chr - "A".charCodeAt(0) + "a".charCodeAt(0);
  } else {
    return chr;
  }
}

function _memset(ptr, value, num, align) {
  if (num >= 20) {
    var stop = ptr + num;
    while (ptr % 4) {
      HEAP8[ptr++] = value;
    }
    if (value < 0) value += 256;
    var ptr4 = ptr >> 2, stop4 = stop >> 2, value4 = value | value << 8 | value << 16 | value << 24;
    while (ptr4 < stop4) {
      HEAP32[ptr4++] = value4;
    }
    ptr = ptr4 << 2;
    while (ptr < stop) {
      HEAP8[ptr++] = value;
    }
  } else {
    while (num--) {
      HEAP8[ptr++] = value;
    }
  }
}

var _llvm_memset_p0i8_i32 = _memset;

function _strcpy(pdest, psrc) {
  var i = 0;
  do {
    HEAP8[pdest + i] = HEAP8[psrc + i];
    i++;
  } while (HEAP8[psrc + i - 1] != 0);
  return pdest;
}

var _fabs = Math.abs;

function _strncmp(px, py, n) {
  var i = 0;
  while (i < n) {
    var x = HEAP8[px + i];
    var y = HEAP8[py + i];
    if (x == y && x == 0) return 0;
    if (x == 0) return -1;
    if (y == 0) return 1;
    if (x == y) {
      i++;
      continue;
    } else {
      return x > y ? 1 : -1;
    }
  }
  return 0;
}

var _llvm_pow_f64 = Math.pow;

function __isFloat(text) {
  return !!/^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?$/.exec(text);
}

function __scanString(format, get, unget, varargs) {
  format = Pointer_stringify(format);
  var formatIndex = 0;
  var argsi = 0;
  var fields = 0;
  var argIndex = 0;
  for (var formatIndex = 0; formatIndex < format.length; formatIndex++) {
    if (next <= 0) return fields;
    var next = get();
    if (next <= 0) return fields;
    if (format[formatIndex] === "%") {
      formatIndex++;
      var maxSpecifierStart = formatIndex;
      while (format[formatIndex].charCodeAt(0) >= "0".charCodeAt(0) && format[formatIndex].charCodeAt(0) <= "9".charCodeAt(0)) {
        formatIndex++;
      }
      var max_;
      if (formatIndex != maxSpecifierStart) {
        max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
      }
      var long_ = false;
      if (format[formatIndex] == "l") {
        long_ = true;
        formatIndex++;
      }
      var type = format[formatIndex];
      formatIndex++;
      var curr = 0;
      var buffer = [];
      if (type == "f") {
        var last = -1;
        while (next > 0) {
          buffer.push(String.fromCharCode(next));
          if (__isFloat(buffer.join(""))) {
            last = buffer.length;
          }
          next = get();
        }
        while (buffer.length > last) {
          buffer.pop();
          unget();
        }
      } else {
        while ((curr < max_ || isNaN(max_)) && next > 0) {
          if (type === "d" && next >= "0".charCodeAt(0) && next <= "9".charCodeAt(0) || type === "x" && (next >= "0".charCodeAt(0) && next <= "9".charCodeAt(0) || next >= "a".charCodeAt(0) && next <= "f".charCodeAt(0) || next >= "A".charCodeAt(0) && next <= "F".charCodeAt(0)) || type === "s" && next != " ".charCodeAt(0) && next != "\t".charCodeAt(0) && next != "\n".charCodeAt(0) && (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) {
            buffer.push(String.fromCharCode(next));
            next = get();
            curr++;
          } else {
            break;
          }
        }
      }
      if (buffer.length === 0) return 0;
      var text = buffer.join("");
      var argPtr = HEAP32[varargs + argIndex >> 2];
      argIndex += Runtime.getNativeFieldSize("void*");
      switch (type) {
       case "d":
        HEAP32[argPtr >> 2] = parseInt(text, 10);
        break;
       case "x":
        HEAP32[argPtr >> 2] = parseInt(text, 16);
        break;
       case "f":
        if (long_) {
          tempDoubleF64[0] = parseFloat(text), HEAP32[argPtr >> 2] = tempDoubleI32[0], HEAP32[argPtr + 4 >> 2] = tempDoubleI32[1];
        } else {
          HEAPF32[argPtr >> 2] = parseFloat(text);
        }
        break;
       case "s":
        var array = intArrayFromString(text);
        for (var j = 0; j < array.length; j++) {
          HEAP8[argPtr + j] = array[j];
        }
        break;
      }
      fields++;
    } else {
      if (format[formatIndex].charCodeAt(0) !== next) {
        unget(next);
        return fields;
      }
    }
  }
  return fields;
}

function _sscanf(s, format, varargs) {
  var index = 0;
  var get = (function() {
    return HEAP8[s + index++];
  });
  var unget = (function() {
    index--;
  });
  return __scanString(format, get, unget, varargs);
}

function _abort() {
  ABORT = true;
  throw "abort() at " + (new Error).stack;
}

function _sysconf(name) {
  switch (name) {
   case 8:
    return PAGE_SIZE;
   case 54:
   case 56:
   case 21:
   case 61:
   case 63:
   case 22:
   case 67:
   case 23:
   case 24:
   case 25:
   case 26:
   case 27:
   case 69:
   case 28:
   case 101:
   case 70:
   case 71:
   case 29:
   case 30:
   case 199:
   case 75:
   case 76:
   case 32:
   case 43:
   case 44:
   case 80:
   case 46:
   case 47:
   case 45:
   case 48:
   case 49:
   case 42:
   case 82:
   case 33:
   case 7:
   case 108:
   case 109:
   case 107:
   case 112:
   case 119:
   case 121:
    return 200809;
   case 13:
   case 104:
   case 94:
   case 95:
   case 34:
   case 35:
   case 77:
   case 81:
   case 83:
   case 84:
   case 85:
   case 86:
   case 87:
   case 88:
   case 89:
   case 90:
   case 91:
   case 94:
   case 95:
   case 110:
   case 111:
   case 113:
   case 114:
   case 115:
   case 116:
   case 117:
   case 118:
   case 120:
   case 40:
   case 16:
   case 79:
   case 19:
    return -1;
   case 92:
   case 93:
   case 5:
   case 72:
   case 6:
   case 74:
   case 92:
   case 93:
   case 96:
   case 97:
   case 98:
   case 99:
   case 102:
   case 103:
   case 105:
    return 1;
   case 38:
   case 66:
   case 50:
   case 51:
   case 4:
    return 1024;
   case 15:
   case 64:
   case 41:
    return 32;
   case 55:
   case 37:
   case 17:
    return 2147483647;
   case 18:
   case 1:
    return 47839;
   case 59:
   case 57:
    return 99;
   case 68:
   case 58:
    return 2048;
   case 0:
    return 2097152;
   case 3:
    return 65536;
   case 14:
    return 32768;
   case 73:
    return 32767;
   case 39:
    return 16384;
   case 60:
    return 1e3;
   case 106:
    return 700;
   case 52:
    return 256;
   case 62:
    return 255;
   case 2:
    return 100;
   case 65:
    return 64;
   case 36:
    return 20;
   case 100:
    return 16;
   case 20:
    return 6;
   case 53:
    return 4;
  }
  ___setErrNo(ERRNO_CODES.EINVAL);
  return -1;
}

function _time(ptr) {
  var ret = Math.floor(Date.now() / 1e3);
  if (ptr) {
    HEAP32[ptr >> 2] = ret;
  }
  return ret;
}

function ___errno_location() {
  return ___setErrNo.ret;
}

var ___errno = ___errno_location;

function _sbrk(bytes) {
  var self = _sbrk;
  if (!self.called) {
    STATICTOP = alignMemoryPage(STATICTOP);
    self.called = true;
  }
  var ret = STATICTOP;
  if (bytes != 0) Runtime.staticAlloc(bytes);
  return ret;
}

function ___cxa_allocate_exception(size) {
  return _malloc(size);
}

function _llvm_eh_exception() {
  return HEAP32[_llvm_eh_exception.buf >> 2];
}

function __ZSt18uncaught_exceptionv() {
  return !!__ZSt18uncaught_exceptionv.uncaught_exception;
}

function ___cxa_is_number_type(type) {
  var isNumber = false;
  try {
    if (type == __ZTIi) isNumber = true;
  } catch (e) {}
  try {
    if (type == __ZTIl) isNumber = true;
  } catch (e) {}
  try {
    if (type == __ZTIx) isNumber = true;
  } catch (e) {}
  try {
    if (type == __ZTIf) isNumber = true;
  } catch (e) {}
  try {
    if (type == __ZTId) isNumber = true;
  } catch (e) {}
  return isNumber;
}

function ___cxa_does_inherit(definiteType, possibilityType, possibility) {
  if (possibility == 0) return false;
  if (possibilityType == 0 || possibilityType == definiteType) return true;
  var possibility_type_info;
  if (___cxa_is_number_type(possibilityType)) {
    possibility_type_info = possibilityType;
  } else {
    var possibility_type_infoAddr = HEAP32[possibilityType >> 2] - 8;
    possibility_type_info = HEAP32[possibility_type_infoAddr >> 2];
  }
  switch (possibility_type_info) {
   case 0:
    var definite_type_infoAddr = HEAP32[definiteType >> 2] - 8;
    var definite_type_info = HEAP32[definite_type_infoAddr >> 2];
    if (definite_type_info == 0) {
      var defPointerBaseAddr = definiteType + 8;
      var defPointerBaseType = HEAP32[defPointerBaseAddr >> 2];
      var possPointerBaseAddr = possibilityType + 8;
      var possPointerBaseType = HEAP32[possPointerBaseAddr >> 2];
      return ___cxa_does_inherit(defPointerBaseType, possPointerBaseType, possibility);
    } else return false;
   case 1:
    return false;
   case 2:
    var parentTypeAddr = possibilityType + 8;
    var parentType = HEAP32[parentTypeAddr >> 2];
    return ___cxa_does_inherit(definiteType, parentType, possibility);
   default:
    return false;
  }
}

function ___cxa_find_matching_catch(thrown, throwntype, typeArray) {
  if (throwntype != 0 && !___cxa_is_number_type(throwntype)) {
    var throwntypeInfoAddr = HEAP32[throwntype >> 2] - 8;
    var throwntypeInfo = HEAP32[throwntypeInfoAddr >> 2];
    if (throwntypeInfo == 0) thrown = HEAP32[thrown >> 2];
  }
  for (var i = 0; i < typeArray.length; i++) {
    if (___cxa_does_inherit(typeArray[i], throwntype, thrown)) return {
      f0: thrown,
      f1: typeArray[i]
    };
  }
  return {
    f0: thrown,
    f1: throwntype
  };
}

function ___cxa_throw(ptr, type, destructor) {
  if (!___cxa_throw.initialized) {
    try {
      HEAP32[__ZTVN10__cxxabiv119__pointer_type_infoE >> 2] = 0;
    } catch (e) {}
    try {
      HEAP32[__ZTVN10__cxxabiv117__class_type_infoE >> 2] = 1;
    } catch (e) {}
    try {
      HEAP32[__ZTVN10__cxxabiv120__si_class_type_infoE >> 2] = 2;
    } catch (e) {}
    ___cxa_throw.initialized = true;
  }
  Module.printErr("Compiled code throwing an exception, " + [ ptr, type, destructor ] + ", at " + (new Error).stack);
  HEAP32[_llvm_eh_exception.buf >> 2] = ptr;
  HEAP32[_llvm_eh_exception.buf + 4 >> 2] = type;
  HEAP32[_llvm_eh_exception.buf + 8 >> 2] = destructor;
  if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
    __ZSt18uncaught_exceptionv.uncaught_exception = 1;
  } else {
    __ZSt18uncaught_exceptionv.uncaught_exception++;
  }
  throw ptr;
}

function ___cxa_call_unexpected(exception) {
  ABORT = true;
  throw exception;
}

function ___cxa_begin_catch(ptr) {
  __ZSt18uncaught_exceptionv.uncaught_exception--;
  return ptr;
}

function ___cxa_free_exception(ptr) {
  return _free(ptr);
}

function ___cxa_end_catch() {
  if (___cxa_end_catch.rethrown) {
    ___cxa_end_catch.rethrown = false;
    return;
  }
  __THREW__ = false;
  HEAP32[_llvm_eh_exception.buf + 4 >> 2] = 0;
  var ptr = HEAP32[_llvm_eh_exception.buf >> 2];
  var destructor = HEAP32[_llvm_eh_exception.buf + 8 >> 2];
  if (destructor) {
    FUNCTION_TABLE[destructor](ptr);
    HEAP32[_llvm_eh_exception.buf + 8 >> 2] = 0;
  }
  if (ptr) {
    ___cxa_free_exception(ptr);
    HEAP32[_llvm_eh_exception.buf >> 2] = 0;
  }
}

var __ZNSt9exceptionD2Ev;

var _llvm_memset_p0i8_i64 = _memset;

var _floorf = Math.floor;

var _ceilf = Math.ceil;

function _fputc(c, stream) {
  var chr = unSign(c & 255);
  HEAP8[_fputc.ret] = chr;
  var ret = _write(stream, _fputc.ret, 1);
  if (ret == -1) {
    if (stream in FS.streams) FS.streams[stream].error = true;
    return -1;
  } else {
    return chr;
  }
}

function _putchar(c) {
  return _fputc(c, HEAP32[_stdout >> 2]);
}

function _memchr(ptr, chr, num) {
  chr = unSign(chr);
  for (var i = 0; i < num; i++) {
    if (HEAP8[ptr] == chr) return ptr;
    ptr++;
  }
  return 0;
}

__ATINIT__.unshift({
  func: (function() {
    if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
  })
});

__ATMAIN__.push({
  func: (function() {
    FS.ignorePermissions = false;
  })
});

__ATEXIT__.push({
  func: (function() {
    FS.quit();
  })
});

___setErrNo(0);

_llvm_eh_exception.buf = allocate(12, "void*", ALLOC_STATIC);

_fputc.ret = allocate([ 0 ], "i8", ALLOC_STATIC);

Module.callMain = function callMain(args) {
  var argc = args.length + 1;
  function pad() {
    for (var i = 0; i < 4 - 1; i++) {
      argv.push(0);
    }
  }
  var argv = [ allocate(intArrayFromString("/bin/this.program"), "i8", ALLOC_STATIC) ];
  pad();
  for (var i = 0; i < argc - 1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), "i8", ALLOC_STATIC));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, "i32", ALLOC_STATIC);
  return _main(argc, argv, 0);
};

var _ScreenWidth;

var _ScreenHeight;

var _HalfScreenWidth;

var _HalfScreenHeight;

var _GameState;

var _TilesetId;

var _PlayerId;

var _HudId;

var _DoorId;

var _StarsId;

var _TitleId;

var _WinId;

var _CameraPos;

var _MapLayer;

var _GlobalTotalKeys;

var _gx;

var _gy;

var __Input_KeyCurrent;

var __Input_KeyLast;

var _TotalStarsInMap;

var _TotalKeysInMap;

var _MapDoor;

var _MapExit;

var _Player;

var __ZL11Door_Opened;

var __ZL9Door_Open;

var __ZL11Exit_Opened;

var __ZL9Star_Idle;

var __ZL8Key_Idle;

var __ZL12Star_Sm_Idle;

var __ZL11Key_Sm_Idle;

var __ZL13Nook_WallJump;

var __ZL16Nook_TouchGround;

var __ZL8Nook_Run;

var __ZL11Nook_Sm_Run;

var __ZL9Nook_Idle;

var __ZL12Nook_Sm_Idle;

var __ZL9Nook_Jump;

var __ZL12Nook_Sm_Jump;

var __ZL13Nook_WallGrab;

var __ZL9Nook_Fall;

var __ZL12Nook_Sm_Fall;

var __ZL17Nook_Sm_Transform;

var __ZL14Nook_Transform;

var __ZL11Exit_Closed;

var __ZL11Door_Closed;

__ATINIT__ = __ATINIT__.concat([ {
  func: __GLOBAL__I_a25
} ]);

var _llvm_used;

var __ZN4Real8IdentityE;

var __ZN4Real4ZeroE;

var __ZN4Real3OneE;

var __ZN4Real4HalfE;

var __ZN4Real7QuarterE;

var __ZN4Real12SmallestUnitE;

var __ZN4Real2PiE;

var __ZN4Real5TwoPiE;

var __ZN4Real5Sin45E;

var _LogLevel;

var _CurrentLogIndentation;

var __ZN8Vector3D8IdentityE;

var __ZN8Vector3D3OneE;

var __ZN8Vector3D4ZeroE;

var _ep;

var _cJSON_malloc;

var _cJSON_free;

var __str329;

var __gm_;

var _mparams;

var __impure_ptr;

var __ZSt7nothrow;

var __ZL13__new_handler;

var __ZTVSt9bad_alloc;

var __ZTVSt20bad_array_new_length;

var __ZTVN10__cxxabiv120__si_class_type_infoE;

var __ZTISt9exception;

var __ZTISt9bad_alloc;

var __ZTISt20bad_array_new_length;

var __ZNSt9bad_allocC1Ev;

var __ZNSt9bad_allocD1Ev;

var __ZNSt20bad_array_new_lengthC1Ev;

var __ZNSt20bad_array_new_lengthD1Ev;

var __ZNSt20bad_array_new_lengthD2Ev;

_ScreenWidth = allocate(1, "i32", ALLOC_STATIC);

_ScreenHeight = allocate(1, "i32", ALLOC_STATIC);

_HalfScreenWidth = allocate(1, "i32", ALLOC_STATIC);

_HalfScreenHeight = allocate(1, "i32", ALLOC_STATIC);

_GameState = allocate(1, "i32", ALLOC_STATIC);

_TilesetId = allocate(1, "i32", ALLOC_STATIC);

_PlayerId = allocate(1, "i32", ALLOC_STATIC);

_HudId = allocate(1, "i32", ALLOC_STATIC);

_DoorId = allocate(1, "i32", ALLOC_STATIC);

_StarsId = allocate(1, "i32", ALLOC_STATIC);

_TitleId = allocate(1, "i32", ALLOC_STATIC);

_WinId = allocate(1, "i32", ALLOC_STATIC);

_CameraPos = allocate(8, "float", ALLOC_STATIC);

_MapLayer = allocate(1, "%struct.GelArray*", ALLOC_STATIC);

_GlobalTotalKeys = allocate(1, "i32", ALLOC_STATIC);

_gx = allocate(1, "float", ALLOC_STATIC);

_gy = allocate(1, "float", ALLOC_STATIC);

__Input_KeyCurrent = allocate(1, "i32", ALLOC_STATIC);

__Input_KeyLast = allocate(1, "i32", ALLOC_STATIC);

_TotalStarsInMap = allocate(1, "i32", ALLOC_STATIC);

_TotalKeysInMap = allocate(1, "i32", ALLOC_STATIC);

_MapDoor = allocate(1, "%struct.GelArray.0*", ALLOC_STATIC);

_MapExit = allocate(1, "%struct.GelArray.1*", ALLOC_STATIC);

_Player = allocate(1, "%class.cPlayer*", ALLOC_STATIC);

STRING_TABLE.__str = allocate([ 67, 111, 110, 116, 101, 110, 116, 47, 78, 111, 111, 107, 45, 84, 105, 108, 101, 115, 101, 116, 46, 112, 110, 103, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str1 = allocate([ 67, 111, 110, 116, 101, 110, 116, 47, 78, 111, 111, 107, 45, 80, 108, 97, 121, 101, 114, 46, 112, 110, 103, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str2 = allocate([ 67, 111, 110, 116, 101, 110, 116, 47, 72, 117, 100, 45, 84, 104, 105, 110, 103, 115, 46, 112, 110, 103, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str3 = allocate([ 67, 111, 110, 116, 101, 110, 116, 47, 68, 111, 111, 114, 46, 112, 110, 103, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str4 = allocate([ 67, 111, 110, 116, 101, 110, 116, 47, 83, 116, 97, 114, 115, 45, 97, 110, 100, 45, 107, 101, 121, 115, 46, 112, 110, 103, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str5 = allocate([ 67, 111, 110, 116, 101, 110, 116, 47, 84, 105, 116, 108, 101, 46, 112, 110, 103, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str6 = allocate([ 67, 111, 110, 116, 101, 110, 116, 47, 87, 105, 110, 46, 112, 110, 103, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str7 = allocate([ 85, 110, 108, 111, 99, 107, 0 ], "i8", ALLOC_STATIC);

__ZL11Door_Opened = allocate([ 1, 0, 0, 0, 4, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL9Door_Open = allocate([ 4, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

STRING_TABLE.__str8 = allocate([ 87, 105, 110, 0 ], "i8", ALLOC_STATIC);

__ZL11Exit_Opened = allocate([ 1, 0, 0, 0, 6, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL9Star_Idle = allocate([ 10, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 7, 0, 0, 0, 8, 0, 0, 0, 9, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL8Key_Idle = allocate([ 8, 0, 0, 0, 16, 0, 0, 0, 16, 0, 0, 0, 17, 0, 0, 0, 17, 0, 0, 0, 18, 0, 0, 0, 18, 0, 0, 0, 19, 0, 0, 0, 19, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL12Star_Sm_Idle = allocate([ 8, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 13, 0, 0, 0, 13, 0, 0, 0, 14, 0, 0, 0, 14, 0, 0, 0, 15, 0, 0, 0, 15, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL11Key_Sm_Idle = allocate([ 8, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 21, 0, 0, 0, 21, 0, 0, 0, 22, 0, 0, 0, 22, 0, 0, 0, 23, 0, 0, 0, 23, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

STRING_TABLE.__str9 = allocate([ 37, 105, 47, 37, 105, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str10 = allocate([ 70, 111, 117, 114, 66, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str11 = allocate([ 74, 117, 109, 112, 48, 49, 0 ], "i8", ALLOC_STATIC);

__ZL13Nook_WallJump = allocate([ 3, 0, 0, 0, 43, 0, 0, 0, 43, 0, 0, 0, 12, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

STRING_TABLE.__str12 = allocate([ 74, 117, 109, 112, 48, 50, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str13 = allocate([ 71, 114, 111, 117, 110, 100, 0 ], "i8", ALLOC_STATIC);

__ZL16Nook_TouchGround = allocate([ 1, 0, 0, 0, 14, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

STRING_TABLE.__str14 = allocate([ 67, 101, 105, 108, 105, 110, 103, 0 ], "i8", ALLOC_STATIC);

__ZL8Nook_Run = allocate([ 6, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 7, 0, 0, 0, 8, 0, 0, 0, 9, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL11Nook_Sm_Run = allocate([ 4, 0, 0, 0, 15, 0, 0, 0, 16, 0, 0, 0, 17, 0, 0, 0, 18, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL9Nook_Idle = allocate([ 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL12Nook_Sm_Idle = allocate([ 1, 0, 0, 0, 15, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL9Nook_Jump = allocate([ 1, 0, 0, 0, 12, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL12Nook_Sm_Jump = allocate([ 1, 0, 0, 0, 19, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL13Nook_WallGrab = allocate([ 1, 0, 0, 0, 42, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

STRING_TABLE.__str15 = allocate([ 83, 108, 105, 100, 101, 0 ], "i8", ALLOC_STATIC);

__ZL9Nook_Fall = allocate([ 1, 0, 0, 0, 13, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL12Nook_Sm_Fall = allocate([ 1, 0, 0, 0, 20, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

STRING_TABLE.__str16 = allocate([ 67, 104, 97, 110, 103, 101, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str17 = allocate([ 67, 97, 110, 116, 67, 104, 97, 110, 103, 101, 0 ], "i8", ALLOC_STATIC);

__ZL17Nook_Sm_Transform = allocate([ 9, 0, 0, 0, 33, 0, 0, 0, 34, 0, 0, 0, 35, 0, 0, 0, 36, 0, 0, 0, 37, 0, 0, 0, 38, 0, 0, 0, 39, 0, 0, 0, 40, 0, 0, 0, 41, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL14Nook_Transform = allocate([ 12, 0, 0, 0, 21, 0, 0, 0, 22, 0, 0, 0, 23, 0, 0, 0, 24, 0, 0, 0, 25, 0, 0, 0, 26, 0, 0, 0, 27, 0, 0, 0, 28, 0, 0, 0, 29, 0, 0, 0, 30, 0, 0, 0, 31, 0, 0, 0, 32, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

STRING_TABLE.__str18 = allocate([ 83, 116, 97, 114, 80, 105, 99, 107, 117, 112, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str19 = allocate([ 75, 101, 121, 80, 105, 99, 107, 117, 112, 0 ], "i8", ALLOC_STATIC);

__ZL11Exit_Closed = allocate([ 1, 0, 0, 0, 5, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

__ZL11Door_Closed = allocate([ 1, 0, 0, 0, 0, 0, 0, 0 ], [ "i32", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

_llvm_used = allocate([ 8, 0, 0, 0, 10, 0, 0, 0, 12, 0, 0, 0, 14, 0, 0, 0, 16, 0, 0, 0, 18, 0, 0, 0 ], [ "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0 ], ALLOC_STATIC);

__ZN4Real8IdentityE = allocate([ 1, 0, 0, 0 ], [ "float", 0, 0, 0 ], ALLOC_STATIC);

__ZN4Real4ZeroE = allocate(4, "float", ALLOC_STATIC);

__ZN4Real3OneE = allocate([ 1, 0, 0, 0 ], [ "float", 0, 0, 0 ], ALLOC_STATIC);

__ZN4Real4HalfE = allocate([ .5, 0, 0, 0 ], [ "float", 0, 0, 0 ], ALLOC_STATIC);

__ZN4Real7QuarterE = allocate([ .25, 0, 0, 0 ], [ "float", 0, 0, 0 ], ALLOC_STATIC);

__ZN4Real12SmallestUnitE = allocate([ .004999999888241291, 0, 0, 0 ], [ "float", 0, 0, 0 ], ALLOC_STATIC);

__ZN4Real2PiE = allocate([ 3.1415927410125732, 0, 0, 0 ], [ "float", 0, 0, 0 ], ALLOC_STATIC);

__ZN4Real5TwoPiE = allocate([ 6.2831854820251465, 0, 0, 0 ], [ "float", 0, 0, 0 ], ALLOC_STATIC);

__ZN4Real5Sin45E = allocate([ .7071067690849304, 0, 0, 0 ], [ "float", 0, 0, 0 ], ALLOC_STATIC);

_LogLevel = allocate([ 1 ], [ "i32", 0, 0, 0, 0 ], ALLOC_STATIC);

_CurrentLogIndentation = allocate(1, "i32", ALLOC_STATIC);

__ZN8Vector3D8IdentityE = allocate(12, "float", ALLOC_STATIC);

__ZN8Vector3D3OneE = allocate(12, "float", ALLOC_STATIC);

__ZN8Vector3D4ZeroE = allocate(12, "float", ALLOC_STATIC);

_ep = allocate(1, "i8*", ALLOC_STATIC);

_cJSON_malloc = allocate([ 2 ], [ "i8* (i32)*", 0, 0, 0, 0 ], ALLOC_STATIC);

_cJSON_free = allocate([ 4 ], [ "void (i8*)*", 0, 0, 0, 0 ], ALLOC_STATIC);

STRING_TABLE.__str26 = allocate([ 110, 117, 108, 108, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str127 = allocate([ 102, 97, 108, 115, 101, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str228 = allocate([ 116, 114, 117, 101, 0 ], "i8", ALLOC_STATIC);

__str329 = allocate(1, "i8", ALLOC_STATIC);

STRING_TABLE.__str430 = allocate([ 34, 92, 8, 12, 10, 13, 9, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str531 = allocate([ 117, 37, 48, 52, 120, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str632 = allocate([ 37, 100, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str733 = allocate([ 37, 46, 48, 102, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str834 = allocate([ 37, 101, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str935 = allocate([ 37, 102, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str1036 = allocate([ 37, 52, 120, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE._firstByteMark = allocate([ 0, 0, 192, 224, 240, 248, 252 ], "i8", ALLOC_STATIC);

__gm_ = allocate(468, [ "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0, "*", 0, 0, 0, "i32", 0, 0, 0 ], ALLOC_STATIC);

_mparams = allocate(24, "i32", ALLOC_STATIC);

STRING_TABLE.__str37 = allocate([ 109, 97, 120, 32, 115, 121, 115, 116, 101, 109, 32, 98, 121, 116, 101, 115, 32, 61, 32, 37, 49, 48, 108, 117, 10, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str138 = allocate([ 115, 121, 115, 116, 101, 109, 32, 98, 121, 116, 101, 115, 32, 32, 32, 32, 32, 61, 32, 37, 49, 48, 108, 117, 10, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__str239 = allocate([ 105, 110, 32, 117, 115, 101, 32, 98, 121, 116, 101, 115, 32, 32, 32, 32, 32, 61, 32, 37, 49, 48, 108, 117, 10, 0 ], "i8", ALLOC_STATIC);

__ZSt7nothrow = allocate([ undef ], "i8", ALLOC_STATIC);

__ZL13__new_handler = allocate(1, "void ()*", ALLOC_STATIC);

__ZTVSt9bad_alloc = allocate([ 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 20, 0, 0, 0, 22, 0, 0, 0 ], [ "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0 ], ALLOC_STATIC);

allocate(1, "void*", ALLOC_STATIC);

STRING_TABLE.__str340 = allocate([ 115, 116, 100, 58, 58, 98, 97, 100, 95, 97, 108, 108, 111, 99, 0 ], "i8", ALLOC_STATIC);

__ZTVSt20bad_array_new_length = allocate([ 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 24, 0, 0, 0, 26, 0, 0, 0 ], [ "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0, "*", 0, 0, 0 ], ALLOC_STATIC);

allocate(1, "void*", ALLOC_STATIC);

STRING_TABLE.__str1441 = allocate([ 98, 97, 100, 95, 97, 114, 114, 97, 121, 95, 110, 101, 119, 95, 108, 101, 110, 103, 116, 104, 0 ], "i8", ALLOC_STATIC);

STRING_TABLE.__ZTSSt9bad_alloc = allocate([ 83, 116, 57, 98, 97, 100, 95, 97, 108, 108, 111, 99, 0 ], "i8", ALLOC_STATIC);

__ZTISt9bad_alloc = allocate(12, "*", ALLOC_STATIC);

STRING_TABLE.__ZTSSt20bad_array_new_length = allocate([ 83, 116, 50, 48, 98, 97, 100, 95, 97, 114, 114, 97, 121, 95, 110, 101, 119, 95, 108, 101, 110, 103, 116, 104, 0 ], "i8", ALLOC_STATIC);

__ZTISt20bad_array_new_length = allocate(12, "*", ALLOC_STATIC);

HEAP32[__ZTVSt9bad_alloc + 4 >> 2] = __ZTISt9bad_alloc;

HEAP32[__ZTVSt20bad_array_new_length + 4 >> 2] = __ZTISt20bad_array_new_length;

__ZTVN10__cxxabiv120__si_class_type_infoE = allocate([ 2, 0, 0, 0, 0 ], [ "i8*", 0, 0, 0, 0 ], ALLOC_STATIC);

HEAP32[__ZTISt9bad_alloc >> 2] = __ZTVN10__cxxabiv120__si_class_type_infoE + 8 | 0;

HEAP32[__ZTISt9bad_alloc + 4 >> 2] = STRING_TABLE.__ZTSSt9bad_alloc | 0;

HEAP32[__ZTISt9bad_alloc + 8 >> 2] = __ZTISt9exception;

HEAP32[__ZTISt20bad_array_new_length >> 2] = __ZTVN10__cxxabiv120__si_class_type_infoE + 8 | 0;

HEAP32[__ZTISt20bad_array_new_length + 4 >> 2] = STRING_TABLE.__ZTSSt20bad_array_new_length | 0;

HEAP32[__ZTISt20bad_array_new_length + 8 >> 2] = __ZTISt9bad_alloc;

__ZNSt9bad_allocC1Ev = 28;

__ZNSt9bad_allocD1Ev = 6;

__ZNSt20bad_array_new_lengthC1Ev = 30;

__ZNSt20bad_array_new_lengthD1Ev = 6;

__ZNSt20bad_array_new_lengthD2Ev = 6;

FUNCTION_TABLE = [ 0, 0, _malloc, 0, _free, 0, __ZNSt9bad_allocD2Ev, 0, __Z9GameInputffii, 0, __Z8GameInitv, 0, __Z8GameExitv, 0, __Z8GameStepv, 0, __Z14GameDrawPausedv, 0, __Z8GameDrawv, 0, __ZNSt9bad_allocD0Ev, 0, __ZNKSt9bad_alloc4whatEv, 0, __ZNSt20bad_array_new_lengthD0Ev, 0, __ZNKSt20bad_array_new_length4whatEv, 0, __ZNSt9bad_allocC2Ev, 0, __ZNSt20bad_array_new_lengthC2Ev, 0 ];

Module["FUNCTION_TABLE"] = FUNCTION_TABLE;

function run(args) {
  args = args || Module["arguments"];
  if (Module["setStatus"]) {
    Module["setStatus"]("");
  }
  if (Module["preRun"]) {
    Module["preRun"]();
  }
  var ret = null;
  if (Module["_main"]) {
    preMain();
    ret = Module.callMain(args);
    if (!Module["noExitRuntime"]) {
      exitRuntime();
    }
  }
  if (Module["postRun"]) {
    Module["postRun"]();
  }
  return ret;
}

Module["run"] = run;

initRuntime();

if (Module["noInitialRun"]) {
  addRunDependency();
}

if (runDependencies == 0) {
  var ret = run();
}
// EMSCRIPTEN_GENERATED_FUNCTIONS: ["__Z9GameInputffii","__ZNK7cGrid2DIsE5WidthEv","__ZNK7cGrid2DIsE6HeightEv","__ZN7cGrid2DIsEixEj","__ZN8Vector2DC1Ev","__Z10CountDoorsi","__ZN7cGrid2DIsEclEjj","__Z10CountExitsi","__Z10CountStarsi","__Z9CountKeysi","__Z18ProcessObjectLayeri","__Z15delete_GelArrayIP5cDoorEvP8GelArrayIT_E","__Z12new_GelArrayIP5cDoorEP8GelArrayIT_Ej","__Z15delete_GelArrayIP5cExitEvP8GelArrayIT_E","__Z12new_GelArrayIP5cExitEP8GelArrayIT_Ej","__ZN5cDoorC1Eff","__ZN5cExitC1Eff","__Z7LoadMapv","__ZN7cGrid2DIsED1Ev","__Z15delete_GelArrayIP7cGrid2DIsEEvP8GelArrayIT_E","__Z12new_GelArrayIP7cGrid2DIsEEP8GelArrayIT_Ej","__ZN7cGrid2DIsEC1EjjRKs","__ZN7cPlayerC1Eff","__Z8GameInitv","__ZN4RealC1ERKf","__Z8GameExitv","__Z10EngineStepv","__ZN7cPlayer4StepEv","__Z16Input_KeyPressedi","__ZN5cDoor12SetAnimationEPKi","__ZN5cDoor24SetIntermediateAnimationEPKi","__ZN4RealpLERKS_","__ZNK11ShapeRect2D5WidthEv","__ZN5cDoor4StepEv","__ZN5cExit12SetAnimationEPKi","__ZNK4Real7ToFloatEv","__ZNK4RealcvKfEv","__ZN7cPlayer7GetRectEv","__ZN5cDoor7GetRectEv","__ZNK11ShapeRect2DeqERKS_","__ZN5boostmiERK11ShapeRect2DS2_","__ZN5boostmiERK8Vector2DS2_","__ZNK11ShapeRect2D6CenterEv","__ZNK4Real6NormalEv","__ZNK4RealmlERKS_","__ZN5cExit7GetRectEv","__ZN5cExit4StepEv","__Z8GameStepv","__Z9DrawLayeri","__Z15DrawObjectLayeri","__Z10EngineDrawv","__ZN8Vector2DC1ERK4RealS2_","__ZN5cDoor4DrawERK8Vector2D","__Z14GameDrawPausedv","__Z9Input_Keyi","__ZN7cGrid2DIsE4FillEPsjRKs","__ZNK7cGrid2DIsE4SizeEv","__ZNK11ShapeRect2D2P1Ev","__ZN4RealmIERKS_","__ZN8Vector2DC2ERK4RealS2_","__ZN11ShapeRect2DC2ERK8Vector2DS2_","__ZNK11ShapeRect2D5ShapeEv","__ZN4RealmLERKS_","__ZNK4RealgeERKS_","__ZNK10PairRect2D2P1Ev","__ZNK10PairRect2D2P2Ev","__ZN7cPlayer15NotTransformingEv","__ZN7cPlayer14NotWallJumpingEv","__ZN7cPlayer24SetIntermediateAnimationEPKi","__ZNK11ShapeRect2D6HeightEv","__ZN7cPlayer12SetAnimationEPKi","__ZN5cExit4DrawERK8Vector2D","__ZN7cPlayer4DrawERK8Vector2D","__Z8GameDrawv","__ZN7cGrid2DIsEC2EjjRKs","__ZN7cGrid2DIsE4FillERKs","__ZN7cGrid2DIsED2Ev","__ZN11ShapeRect2DmIERKS_","__ZN11ShapeRect2D5_PairERK8Vector2DS2_","__ZNK4Real3MaxERKS_","__ZNK11ShapeRect2D2P2Ev","__ZNK4Real3MinERKS_","__ZN5boostplERK8Vector2DS2_","__ZN8Vector2DpLERKS_","__ZN11ShapeRect2DC1ERKbS1_RK8Vector2DS4_","__ZN11ShapeRect2DC2ERKbS1_RK8Vector2DS4_","__ZNK7cGrid2DIsE5IndexEii","__ZN8Vector2DmIERKS_","__ZNK4RealmiERKS_","__ZN11ShapeRect2DC1ERK8Vector2DS2_","__ZNK4RealngEv","__ZNK11ShapeRect2D9HalfShapeEv","__ZN5boostmlERK8Vector2DRK4Real","__ZN8Vector2DmLERK4Real","__ZN10PairRect2DC1ERK8Vector2DS2_","__ZN10PairRect2DC2ERK8Vector2DS2_","__ZNK4Real9MagnitudeEv","__ZNK4RealplERKS_","__ZN11ShapeRect2DC1Ev","__ZN11ShapeRect2DpLERKS_","__ZN7cPlayer12CollectItemsEv","_cJSON_GetErrorPtr","__ZN4RealC2ERKf","__ZN4RealC2Ev","__ZN8Vector3DC2ERK4RealS2_S2_","_cJSON_InitHooks","__ZN7cPlayer16CanTransformHereEv","__ZN7cPlayer6SetBigEbb","__ZN7cPlayer7GetRectE4RealS0_","__ZN7cPlayer11GetRectPlusE4RealS0_","__ZN11ShapeRect2DC2Ev","__ZNK4Real3AbsEv","__ZN7cPlayerC2Eff","__ZN5cExitC2Eff","__ZN5cDoorC2Eff","__ZN8Vector2DC2Ev","__ZN4RealC1Ev","__ZN4Real6RandomEv","__Z14LogIndentationic","__Z6PreLogPKc","__Z9LogAlwaysPKcz","__Z10_LogAlwaysPKcz","__Z3LogPKcz","__Z4VLogPKcz","__Z5VVLogPKcz","__Z6VVVLogPKcz","__Z4_LogPKcz","__Z5_VLogPKcz","__Z6_VVLogPKcz","__Z7_VVVLogPKcz","___cxx_global_var_init22","__ZN8Vector3DC1ERK4RealS2_S2_","___cxx_global_var_init123","___cxx_global_var_init224","__GLOBAL__I_a25","_cJSON_Delete","_cJSON_Parse","_parse_value","_skip","_cJSON_GetArraySize","_cJSON_GetArrayItem","_suffix_object","_cJSON_DetachItemFromArray","_cJSON_Print","_print_value","_cJSON_PrintUnformatted","_cJSON_GetObjectItem","_cJSON_strcasecmp","_cJSON_AddItemToArray","_cJSON_AddItemToObject","_cJSON_strdup","_cJSON_AddItemReferenceToArray","_create_reference","_cJSON_AddItemReferenceToObject","_cJSON_DeleteItemFromArray","_cJSON_DetachItemFromObject","_cJSON_DeleteItemFromObject","_cJSON_ReplaceItemInArray","_cJSON_ReplaceItemInObject","_cJSON_CreateNull","_cJSON_CreateTrue","_cJSON_CreateFalse","_cJSON_CreateBool","_cJSON_CreateNumber","_cJSON_CreateString","_cJSON_CreateArray","_cJSON_CreateObject","_cJSON_CreateIntArray","_cJSON_CreateFloatArray","_cJSON_CreateDoubleArray","_cJSON_CreateStringArray","_print_number","_print_string","_print_array","_print_object","_print_string_ptr","_parse_string","_parse_number","_parse_array","_parse_object","_cJSON_New_Item","_malloc","_tmalloc_small","_sys_alloc","_tmalloc_large","_sys_trim","_free","_malloc_footprint","_malloc_max_footprint","_release_unused_segments","_calloc","_realloc","_memalign","_internal_memalign","_independent_calloc","_ialloc","_independent_comalloc","_valloc","_pvalloc","_malloc_trim","_mallinfo","_internal_mallinfo","_malloc_stats","_internal_malloc_stats","_mallopt","_change_mparam","_internal_realloc","_init_mparams","_malloc_usable_size","_mmap_resize","_segment_holding","_init_top","_init_bins","_prepend_alloc","__ZNKSt9bad_alloc4whatEv","__ZNKSt20bad_array_new_length4whatEv","__ZSt15get_new_handlerv","__ZSt15set_new_handlerPFvvE","__ZNSt9bad_allocC2Ev","__ZdlPv","__ZdlPvRKSt9nothrow_t","__ZdaPv","__ZdaPvRKSt9nothrow_t","__ZNSt9bad_allocD0Ev","__ZNSt9bad_allocD2Ev","__ZNSt20bad_array_new_lengthC2Ev","__ZNSt20bad_array_new_lengthD0Ev","_add_segment","__Znwj","__ZnwjRKSt9nothrow_t","__Znaj","__ZnajRKSt9nothrow_t","__ZSt17__throw_bad_allocv"]

