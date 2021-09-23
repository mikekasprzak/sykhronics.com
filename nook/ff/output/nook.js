// Begin PreJS.txt //
// ----------------------------------------------------------------------------
// Buzz, a Javascript HTML5 Audio library
// v 1.0.x beta
// Licensed under the MIT license.
// http://buzz.jaysalvat.com/
// ----------------------------------------------------------------------------
// Copyright (C) 2011 Jay Salvat
// http://jaysalvat.com/
// ----------------------------------------------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files ( the "Software" ), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// ----------------------------------------------------------------------------
var buzz = {
    defaults: {
        autoplay: false,
        duration: 5000,
        formats: [],
        loop: false,
        placeholder: '--',
        preload: 'metadata',
        volume: 80
    },
    types: {
        'mp3': 'audio/mpeg',
        'ogg': 'audio/ogg',
        'wav': 'audio/wav',
        'aac': 'audio/aac',
        'm4a': 'audio/x-m4a'
    },
    sounds: [],
    el: document.createElement( 'audio' ),
    sound: function( src, options ) {
        options = options || {};
        var pid = 0,
            events = [],
            eventsOnce = {},
            supported = buzz.isSupported();
        // publics
        this.load = function() {
            if ( !supported ) {
              return this;
            }
            this.sound.load();
            return this;
        };
        this.play = function() {
            if ( !supported ) {
              return this;
            }
            this.sound.play();
            return this;
        };
        this.togglePlay = function() {
            if ( !supported ) {
              return this;
            }
            if ( this.sound.paused ) {
                this.sound.play();
            } else {
                this.sound.pause();
            }
            return this;
        };
        this.pause = function() {
            if ( !supported ) {
              return this;
            }
            this.sound.pause();
            return this;
        };
        this.isPaused = function() {
            if ( !supported ) {
              return null;
            }
            return this.sound.paused;
        };
        this.stop = function() {
            if ( !supported  ) {
              return this;
            }
            this.setTime( this.getDuration() );
            this.sound.pause();
            return this;
        };
        this.isEnded = function() {
            if ( !supported ) {
              return null;
            }
            return this.sound.ended;
        };
        this.loop = function() {
            if ( !supported ) {
              return this;
            }
            this.sound.loop = 'loop';
            this.bind( 'ended.buzzloop', function() {
                this.currentTime = 0;
                this.play();
            });
            return this;
        };
        this.unloop = function() {
            if ( !supported ) {
              return this;
            }
            this.sound.removeAttribute( 'loop' );
            this.unbind( 'ended.buzzloop' );
            return this;
        };
        this.mute = function() {
            if ( !supported ) {
              return this;
            }
            this.sound.muted = true;
            return this;
        };
        this.unmute = function() {
            if ( !supported ) {
              return this;
            }
            this.sound.muted = false;
            return this;
        };
        this.toggleMute = function() {
            if ( !supported ) {
              return this;
            }
            this.sound.muted = !this.sound.muted;
            return this;
        };
        this.isMuted = function() {
            if ( !supported ) {
              return null;
            }
            return this.sound.muted;
        };
        this.setVolume = function( volume ) {
            if ( !supported ) {
              return this;
            }
            if ( volume < 0 ) {
              volume = 0;
            }
            if ( volume > 100 ) {
              volume = 100;
            }
            this.volume = volume;
            this.sound.volume = volume / 100;
            return this;
        };
        this.getVolume = function() {
            if ( !supported ) {
              return this;
            }
            return this.volume;
        };
        this.increaseVolume = function( value ) {
            return this.setVolume( this.volume + ( value || 1 ) );
        };
        this.decreaseVolume = function( value ) {
            return this.setVolume( this.volume - ( value || 1 ) );
        };
        this.setTime = function( time ) {
            if ( !supported ) {
              return this;
            }
            this.whenReady( function() {
                this.sound.currentTime = time;
            });
            return this;
        };
        this.getTime = function() {
            if ( !supported ) {
              return null;
            }
            var time = Math.round( this.sound.currentTime * 100 ) / 100;
            return isNaN( time ) ? buzz.defaults.placeholder : time;
        };
        this.setPercent = function( percent ) {
            if ( !supported ) {
              return this;
            }
            return this.setTime( buzz.fromPercent( percent, this.sound.duration ) );
        };
        this.getPercent = function() {
            if ( !supported ) {
              return null;
            }
			var percent = Math.round( buzz.toPercent( this.sound.currentTime, this.sound.duration ) );
            return isNaN( percent ) ? buzz.defaults.placeholder : percent;
        };
        this.setSpeed = function( duration ) {
			if ( !supported ) {
              return this;
            }
            this.sound.playbackRate = duration;
        };
        this.getSpeed = function() {
			if ( !supported ) {
              return null;
            }
            return this.sound.playbackRate;
        };
        this.getDuration = function() {
            if ( !supported ) {
              return null;
            }
            var duration = Math.round( this.sound.duration * 100 ) / 100;
            return isNaN( duration ) ? buzz.defaults.placeholder : duration;
        };
        this.getPlayed = function() {
			if ( !supported ) {
              return null;
            }
            return timerangeToArray( this.sound.played );
        };
        this.getBuffered = function() {
			if ( !supported ) {
              return null;
            }
            return timerangeToArray( this.sound.buffered );
        };
        this.getSeekable = function() {
			if ( !supported ) {
              return null;
            }
            return timerangeToArray( this.sound.seekable );
        };
        this.getErrorCode = function() {
            if ( supported && this.sound.error ) {
                return this.sound.error.code;
            }
            return 0;
        };
        this.getErrorMessage = function() {
			if ( !supported ) {
              return null;
            }
            switch( this.getErrorCode() ) {
                case 1:
                    return 'MEDIA_ERR_ABORTED';
                case 2:
                    return 'MEDIA_ERR_NETWORK';
                case 3:
                    return 'MEDIA_ERR_DECODE';
                case 4:
                    return 'MEDIA_ERR_SRC_NOT_SUPPORTED';
                default:
                    return null;
            }
        };
        this.getStateCode = function() {
			if ( !supported ) {
              return null;
            }
            return this.sound.readyState;
        };
        this.getStateMessage = function() {
			if ( !supported ) {
              return null;
            }
            switch( this.getStateCode() ) {
                case 0:
                    return 'HAVE_NOTHING';
                case 1:
                    return 'HAVE_METADATA';
                case 2:
                    return 'HAVE_CURRENT_DATA';
                case 3:
                    return 'HAVE_FUTURE_DATA';
                case 4:
                    return 'HAVE_ENOUGH_DATA';
                default:
                    return null;
            }
        };
        this.getNetworkStateCode = function() {
			if ( !supported ) {
              return null;
            }
            return this.sound.networkState;
        };
        this.getNetworkStateMessage = function() {
			if ( !supported ) {
              return null;
            }
            switch( this.getNetworkStateCode() ) {
                case 0:
                    return 'NETWORK_EMPTY';
                case 1:
                    return 'NETWORK_IDLE';
                case 2:
                    return 'NETWORK_LOADING';
                case 3:
                    return 'NETWORK_NO_SOURCE';
                default:
                    return null;
            }
        };
        this.set = function( key, value ) {
            if ( !supported ) {
              return this;
            }
            this.sound[ key ] = value;
            return this;
        };
        this.get = function( key ) {
            if ( !supported ) {
              return null;
            }
            return key ? this.sound[ key ] : this.sound;
        };
        this.bind = function( types, func ) {
            if ( !supported ) {
              return this;
            }
            types = types.split( ' ' );
            var that = this,
				efunc = function( e ) { func.call( that, e ); };
            for( var t = 0; t < types.length; t++ ) {
                var type = types[ t ],
                    idx = type;
                    type = idx.split( '.' )[ 0 ];
                    events.push( { idx: idx, func: efunc } );
                    this.sound.addEventListener( type, efunc, true );
            }
            return this;
        };
        this.unbind = function( types ) {
            if ( !supported ) {
              return this;
            }
            types = types.split( ' ' );
            for( var t = 0; t < types.length; t++ ) {
                var idx = types[ t ],
                    type = idx.split( '.' )[ 0 ];
                for( var i = 0; i < events.length; i++ ) {
                    var namespace = events[ i ].idx.split( '.' );
                    if ( events[ i ].idx == idx || ( namespace[ 1 ] && namespace[ 1 ] == idx.replace( '.', '' ) ) ) {
                        this.sound.removeEventListener( type, events[ i ].func, true );
                        // remove event
                        events.splice(i, 1);
                    }
                }
            }
            return this;
        };
        this.bindOnce = function( type, func ) {
            if ( !supported ) {
              return this;
            }
            var that = this;
            eventsOnce[ pid++ ] = false;
            this.bind( pid + type, function() {
               if ( !eventsOnce[ pid ] ) {
                   eventsOnce[ pid ] = true;
                   func.call( that );
               }
               that.unbind( pid + type );
            });
        };
        this.trigger = function( types ) {
            if ( !supported ) {
              return this;
            }
            types = types.split( ' ' );
            for( var t = 0; t < types.length; t++ ) {
                var idx = types[ t ];
                for( var i = 0; i < events.length; i++ ) {
                    var eventType = events[ i ].idx.split( '.' );
                    if ( events[ i ].idx == idx || ( eventType[ 0 ] && eventType[ 0 ] == idx.replace( '.', '' ) ) ) {
                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent( eventType[ 0 ], false, true );
                        this.sound.dispatchEvent( evt );
                    }
                }
            }
            return this;
        };
        this.fadeTo = function( to, duration, callback ) {
			if ( !supported ) {
              return this;
            }
            if ( duration instanceof Function ) {
                callback = duration;
                duration = buzz.defaults.duration;
            } else {
                duration = duration || buzz.defaults.duration;
            }
            var from = this.volume,
				delay = duration / Math.abs( from - to ),
                that = this;
            this.play();
            function doFade() {
                setTimeout( function() {
                    if ( from < to && that.volume < to ) {
                        that.setVolume( that.volume += 1 );
                        doFade();
                    } else if ( from > to && that.volume > to ) {
                        that.setVolume( that.volume -= 1 );
                        doFade();
                    } else if ( callback instanceof Function ) {
                        callback.apply( that );
                    }
                }, delay );
            }
            this.whenReady( function() {
                doFade();
            });
            return this;
        };
        this.fadeIn = function( duration, callback ) {
            if ( !supported ) {
              return this;
            }
            return this.setVolume(0).fadeTo( 100, duration, callback );
        };
        this.fadeOut = function( duration, callback ) {
			if ( !supported ) {
              return this;
            }
            return this.fadeTo( 0, duration, callback );
        };
        this.fadeWith = function( sound, duration ) {
            if ( !supported ) {
              return this;
            }
            this.fadeOut( duration, function() {
                this.stop();
            });
            sound.play().fadeIn( duration );
            return this;
        };
        this.whenReady = function( func ) {
            if ( !supported ) {
              return null;
            }
            var that = this;
            if ( this.sound.readyState === 0 ) {
                this.bind( 'canplay.buzzwhenready', function() {
                    func.call( that );
                });
            } else {
                func.call( that );
            }
        };
        // privates
        function timerangeToArray( timeRange ) {
            var array = [],
                length = timeRange.length - 1;
            for( var i = 0; i <= length; i++ ) {
                array.push({
                    start: timeRange.start( length ),
                    end: timeRange.end( length )
                });
            }
            return array;
        }
        function getExt( filename ) {
            return filename.split('.').pop();
        }
        function addSource( sound, src ) {
            var source = document.createElement( 'source' );
            source.src = src;
            if ( buzz.types[ getExt( src ) ] ) {
                source.type = buzz.types[ getExt( src ) ];
            }
            sound.appendChild( source );
        }
        // init
        if ( supported ) {
            for(var i in buzz.defaults ) {
              if(buzz.defaults.hasOwnProperty(i)) {
                options[ i ] = options[ i ] || buzz.defaults[ i ];
              }
            }
            this.sound = document.createElement( 'audio' );
            if ( src instanceof Array ) {
                for( var j in src ) {
                  if(src.hasOwnProperty(j)) {
                    addSource( this.sound, src[ j ] );
                  }
                }
            } else if ( options.formats.length ) {
                for( var k in options.formats ) {
                  if(options.formats.hasOwnProperty(k)) {
                    addSource( this.sound, src + '.' + options.formats[ k ] );
                  }
                }
            } else {
                addSource( this.sound, src );
            }
            if ( options.loop ) {
                this.loop();
            }
            if ( options.autoplay ) {
                this.sound.autoplay = 'autoplay';
            }
            if ( options.preload === true ) {
                this.sound.preload = 'auto';
            } else if ( options.preload === false ) {
                this.sound.preload = 'none';
            } else {
                this.sound.preload = options.preload;
            }
            this.setVolume( options.volume );
            buzz.sounds.push( this );
        }
    },
    group: function( sounds ) {
        sounds = argsToArray( sounds, arguments );
        // publics
        this.getSounds = function() {
            return sounds;
        };
        this.add = function( soundArray ) {
            soundArray = argsToArray( soundArray, arguments );
            for( var a = 0; a < soundArray.length; a++ ) {
                sounds.push( soundArray[ a ] );
            }
        };
        this.remove = function( soundArray ) {
            soundArray = argsToArray( soundArray, arguments );
            for( var a = 0; a < soundArray.length; a++ ) {
                for( var i = 0; i < sounds.length; i++ ) {
                    if ( sounds[ i ] == soundArray[ a ] ) {
                        delete sounds[ i ];
                        break;
                    }
                }
            }
        };
        this.load = function() {
            fn( 'load' );
            return this;
        };
        this.play = function() {
            fn( 'play' );
            return this;
        };
        this.togglePlay = function( ) {
            fn( 'togglePlay' );
            return this;
        };
        this.pause = function( time ) {
            fn( 'pause', time );
            return this;
        };
        this.stop = function() {
            fn( 'stop' );
            return this;
        };
        this.mute = function() {
            fn( 'mute' );
            return this;
        };
        this.unmute = function() {
            fn( 'unmute' );
            return this;
        };
        this.toggleMute = function() {
            fn( 'toggleMute' );
            return this;
        };
        this.setVolume = function( volume ) {
            fn( 'setVolume', volume );
            return this;
        };
        this.increaseVolume = function( value ) {
            fn( 'increaseVolume', value );
            return this;
        };
        this.decreaseVolume = function( value ) {
            fn( 'decreaseVolume', value );
            return this;
        };
        this.loop = function() {
            fn( 'loop' );
            return this;
        };
        this.unloop = function() {
            fn( 'unloop' );
            return this;
        };
        this.setTime = function( time ) {
            fn( 'setTime', time );
            return this;
        };
        this.setduration = function( duration ) {
            fn( 'setduration', duration );
            return this;
        };
        this.set = function( key, value ) {
            fn( 'set', key, value );
            return this;
        };
        this.bind = function( type, func ) {
            fn( 'bind', type, func );
            return this;
        };
        this.unbind = function( type ) {
            fn( 'unbind', type );
            return this;
        };
        this.bindOnce = function( type, func ) {
            fn( 'bindOnce', type, func );
            return this;
        };
        this.trigger = function( type ) {
            fn( 'trigger', type );
            return this;
        };
        this.fade = function( from, to, duration, callback ) {
            fn( 'fade', from, to, duration, callback );
            return this;
        };
        this.fadeIn = function( duration, callback ) {
            fn( 'fadeIn', duration, callback );
            return this;
        };
        this.fadeOut = function( duration, callback ) {
            fn( 'fadeOut', duration, callback );
            return this;
        };
        // privates
        function fn() {
            var args = argsToArray( null, arguments ),
                func = args.shift();
            for( var i = 0; i < sounds.length; i++ ) {
                sounds[ i ][ func ].apply( sounds[ i ], args );
            }
        }
        function argsToArray( array, args ) {
            return ( array instanceof Array ) ? array : Array.prototype.slice.call( args );
        }
    },
    all: function() {
      return new buzz.group( buzz.sounds );
    },
    isSupported: function() {
        return !!buzz.el.canPlayType;
    },
    isOGGSupported: function() {
        return !!buzz.el.canPlayType && buzz.el.canPlayType( 'audio/ogg; codecs="vorbis"' );
    },
    isWAVSupported: function() {
        return !!buzz.el.canPlayType && buzz.el.canPlayType( 'audio/wav; codecs="1"' );
    },
    isMP3Supported: function() {
        return !!buzz.el.canPlayType && buzz.el.canPlayType( 'audio/mpeg;' );
    },
    isAACSupported: function() {
        return !!buzz.el.canPlayType && ( buzz.el.canPlayType( 'audio/x-m4a;' ) || buzz.el.canPlayType( 'audio/aac;' ) );
    },
    toTimer: function( time, withHours ) {
        var h, m, s;
        h = Math.floor( time / 3600 );
        h = isNaN( h ) ? '--' : ( h >= 10 ) ? h : '0' + h;
        m = withHours ? Math.floor( time / 60 % 60 ) : Math.floor( time / 60 );
        m = isNaN( m ) ? '--' : ( m >= 10 ) ? m : '0' + m;
        s = Math.floor( time % 60 );
        s = isNaN( s ) ? '--' : ( s >= 10 ) ? s : '0' + s;
        return withHours ? h + ':' + m + ':' + s : m + ':' + s;
    },
    fromTimer: function( time ) {
        var splits = time.toString().split( ':' );
        if ( splits && splits.length == 3 ) {
            time = ( parseInt( splits[ 0 ], 10 ) * 3600 ) + ( parseInt(splits[ 1 ], 10 ) * 60 ) + parseInt( splits[ 2 ], 10 );
        }
        if ( splits && splits.length == 2 ) {
            time = ( parseInt( splits[ 0 ], 10 ) * 60 ) + parseInt( splits[ 1 ], 10 );
        }
        return time;
    },
    toPercent: function( value, total, decimal ) {
		var r = Math.pow( 10, decimal || 0 );
		return Math.round( ( ( value * 100 ) / total ) * r ) / r;
    },
    fromPercent: function( percent, total, decimal ) {
		var r = Math.pow( 10, decimal || 0 );
        return  Math.round( ( ( total / 100 ) * percent ) * r ) / r;
    }
};
// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
try {
  this['Module'] = Module;
  Module.test;
} catch(e) {
  this['Module'] = Module = {};
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function(filename) { return Module['read'](filename, true) };
  Module['load'] = function(f) {
    globalEval(read(f));
  };
  if (!Module['arguments']) {
    Module['arguments'] = process['argv'].slice(2);
  }
  module.exports = Module;
}
if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  Module['read'] = read;
  Module['readBinary'] = function(f) {
    return read(f, 'binary');
  };
  if (!Module['arguments']) {
    if (typeof scriptArgs != 'undefined') {
      Module['arguments'] = scriptArgs;
    } else if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
  this['Module'] = Module;
}
if (ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER) {
  if (!Module['print']) {
    Module['print'] = function(x) {
      console.log(x);
    };
  }
  if (!Module['printErr']) {
    Module['printErr'] = function(x) {
      console.log(x);
    };
  }
  this['Module'] = Module;
}
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (!Module['arguments']) {
    if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
}
if (ENVIRONMENT_IS_WORKER) {
  // We can do very little here...
  var TRY_USE_DUMP = false;
  if (!Module['print']) {
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }
  Module['load'] = importScripts;
}
if (!ENVIRONMENT_IS_WORKER && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_SHELL) {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
if (!Module['preRun']) Module['preRun'] = [];
if (!Module['postRun']) Module['postRun'] = [];
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return '((((' +target + ')+' + (quantum-1) + ')>>' + logg + ')<<' + logg + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      '%i1': 1,
      '%i8': 1,
      '%i16': 2,
      '%i32': 4,
      '%i64': 8,
      "%float": 4,
      "%double": 8
    }['%'+type]; // add '%' since float and double confuse Closure compiler as keys, and also spidermonkey as a compiler will remove 's from '_i8' etc
    if (!size) {
      if (type.charAt(type.length-1) == '*') {
        size = Runtime.QUANTUM_SIZE; // A pointer
      } else if (type[0] == 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits/8;
      }
    }
    return size;
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (type == 'i64' || type == 'double' || vararg) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    type.flatIndexes = type.fields.map(function(field) {
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        size = Types.types[field].flatSize;
        alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else {
        throw 'Unclear type in struct: ' + field + ', in ' + type.name_ + ' :: ' + dump(Types.types[type.name_]);
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2 + 2*i;
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xff;
      if (needed) {
        buffer.push(code);
        needed--;
      }
      if (buffer.length == 0) {
        if (code < 128) return String.fromCharCode(code);
        buffer.push(code);
        if (code > 191 && code < 224) {
          needed = 1;
        } else {
          needed = 2;
        }
        return '';
      }
      if (needed > 0) return '';
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var ret;
      if (c1 > 191 && c1 < 224) {
        ret = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      } else {
        ret = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = ((((STACKTOP)+7)>>3)<<3); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = ((((STATICTOP)+7)>>3)<<3); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = ((((DYNAMICTOP)+7)>>3)<<3); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+(((low)>>>(0))))+((+(((high)>>>(0))))*(+(4294967296)))) : ((+(((low)>>>(0))))+((+(((high)|(0))))*(+(4294967296))))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function abort(text) {
  Module.print(text + ':\n' + (new Error).stack);
  ABORT = true;
  throw "Assertion: " + text;
}
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = globalScope['Module']['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length+1);
      writeStringToMemory(value, ret);
      return ret;
    } else if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,((Math.min((+(Math.floor((value)/(+(4294967296))))), (+(4294967295))))|0)>>>0],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return ((x+4095)>>12)<<12;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value, or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATINIT__ = []; // functions called during startup
var __ATMAIN__ = []; // functions called when main() is to be run
var __ATEXIT__ = []; // functions called during shutdown
var runtimeInitialized = false;
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math['imul']) Math['imul'] = function(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyTracking = {};
var calledInit = false, calledRun = false;
var runDependencyWatcher = null;
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    } 
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun && shouldRunNow) run();
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
function addPreRun(func) {
  if (!Module['preRun']) Module['preRun'] = [];
  else if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
  Module['preRun'].push(func);
}
function loadMemoryInitializer(filename) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
  }
  // always do this asynchronously, to keep shell and web as similar as possible
  addPreRun(function() {
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
      applyData(Module['readBinary'](filename));
    } else {
      Browser.asyncLoad(filename, function(data) {
        applyData(data);
      }, function(data) {
        throw 'could not load memory initializer ' + filename;
      });
    }
  });
}
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 1704;
/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } },{ func: function() { __GLOBAL__I_a() } });
var __ZTVN10__cxxabiv120__si_class_type_infoE;
var __ZTVN10__cxxabiv117__class_type_infoE;
var __ZTVN10__cxxabiv120__si_class_type_infoE = __ZTVN10__cxxabiv120__si_class_type_infoE=allocate([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
var __ZTVN10__cxxabiv117__class_type_infoE = __ZTVN10__cxxabiv117__class_type_infoE=allocate([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
/* memory initializer */ allocate([2,0,0,0,8,0,0,0,6,0,0,0,4,0,0,0,2,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,105,47,37,105,0,0,0,87,105,110,0,0,0,0,0,85,110,108,111,99,107,0,0,67,111,110,116,101,110,116,47,87,105,110,46,112,110,103,0,67,111,110,116,101,110,116,47,84,105,116,108,101,46,112,110,103,0,0,0,0,0,0,0,67,111,110,116,101,110,116,47,83,116,97,114,115,45,97,110,100,45,107,101,121,115,46,112,110,103,0,0,0,0,0,0,115,116,100,58,58,98,97,100,95,97,108,108,111,99,0,0,67,111,110,116,101,110,116,47,68,111,111,114,46,112,110,103,0,0,0,0,0,0,0,0,67,111,110,116,101,110,116,47,72,117,100,45,84,104,105,110,103,115,46,112,110,103,0,0,75,101,121,80,105,99,107,117,112,0,0,0,0,0,0,0,83,116,97,114,80,105,99,107,117,112,0,0,0,0,0,0,67,97,110,116,67,104,97,110,103,101,0,0,0,0,0,0,67,104,97,110,103,101,0,0,83,108,105,100,101,0,0,0,67,101,105,108,105,110,103,0,71,114,111,117,110,100,0,0,74,117,109,112,48,50,0,0,74,117,109,112,48,49,0,0,70,111,117,114,66,0,0,0,67,111,110,116,101,110,116,47,78,111,111,107,45,80,108,97,121,101,114,46,112,110,103,0,67,111,110,116,101,110,116,47,78,111,111,107,45,84,105,108,101,115,101,116,46,112,110,103,0,0,0,0,0,0,0,0,0,0,0,0,184,1,0,0,4,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,116,57,101,120,99,101,112,116,105,111,110,0,0,0,0,83,116,57,98,97,100,95,97,108,108,111,99,0,0,0,0,0,0,0,0,144,1,0,0,0,0,0,0,160,1,0,0,176,1,0,0,0,0,0,0,0,0,0,63,0,0,0,0,0,0,128,63,0,0,0,0,10,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,0,0,0,0,1,0,0,0,12,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,1,0,0,0,13,0,0,0,4,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,0,0,0,0,6,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,0,0,0,0,8,0,0,0,16,0,0,0,16,0,0,0,17,0,0,0,17,0,0,0,18,0,0,0,18,0,0,0,19,0,0,0,19,0,0,0,0,0,0,0,9,0,0,0,33,0,0,0,34,0,0,0,35,0,0,0,36,0,0,0,37,0,0,0,38,0,0,0,39,0,0,0,40,0,0,0,41,0,0,0,1,0,0,0,14,0,0,0,12,0,0,0,21,0,0,0,22,0,0,0,23,0,0,0,24,0,0,0,25,0,0,0,26,0,0,0,27,0,0,0,28,0,0,0,29,0,0,0,30,0,0,0,31,0,0,0,32,0,0,0,0,0,0,0,3,0,0,0,43,0,0,0,43,0,0,0,12,0,0,0,1,0,0,0,42,0,0,0,8,0,0,0,10,0,0,0,10,0,0,0,13,0,0,0,13,0,0,0,14,0,0,0,14,0,0,0,15,0,0,0,15,0,0,0,0,0,0,0,1,0,0,0,19,0,0,0,1,0,0,0,15,0,0,0,1,0,0,0,20,0,0,0,4,0,0,0,15,0,0,0,16,0,0,0,17,0,0,0,18,0,0,0,0,0,0,0,8,0,0,0,20,0,0,0,20,0,0,0,21,0,0,0,21,0,0,0,22,0,0,0,22,0,0,0,23,0,0,0,23,0,0,0,0,0,0,0,1,0,0,0,6,0,0,0,1,0,0,0,5,0,0,0,1,0,0,0,4,0,0,0,1,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
  function ___gxx_personality_v0() {
    }
  function _mrGetLayerCount() {
  Module['printErr']('missing function: mrGetLayerCount'); abort(-1);
  }
  function _mrBindLayer() {
  Module['printErr']('missing function: mrBindLayer'); abort(-1);
  }
  function _mrGetWidth() {
  Module['printErr']('missing function: mrGetWidth'); abort(-1);
  }
  function _mrGetHeight() {
  Module['printErr']('missing function: mrGetHeight'); abort(-1);
  }
  function _mrGetSize() {
  Module['printErr']('missing function: mrGetSize'); abort(-1);
  }
  function _mrIndex() {
  Module['printErr']('missing function: mrIndex'); abort(-1);
  }
  function _gelGraphicsInit() {
  Module['printErr']('missing function: gelGraphicsInit'); abort(-1);
  }
  function _gelLoadTileset() {
  Module['printErr']('missing function: gelLoadTileset'); abort(-1);
  }
  function _gelLoadImage() {
  Module['printErr']('missing function: gelLoadImage'); abort(-1);
  }
  function _gelGraphicsExit() {
  Module['printErr']('missing function: gelGraphicsExit'); abort(-1);
  }
  function _sndPlay() {
  Module['printErr']('missing function: sndPlay'); abort(-1);
  }
  function _gelDrawTiles() {
  Module['printErr']('missing function: gelDrawTiles'); abort(-1);
  }
  function _gelBindTileset() {
  Module['printErr']('missing function: gelBindTileset'); abort(-1);
  }
  function _gelDrawTileCentered() {
  Module['printErr']('missing function: gelDrawTileCentered'); abort(-1);
  }
  function _gelBindImage() {
  Module['printErr']('missing function: gelBindImage'); abort(-1);
  }
  Module["_strlen"] = _strlen;
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
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
            next = HEAP8[((textIndex+1)|0)];
          }
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
          // Handle precision.
          var precisionSet = false;
          if (next == 46) {
            var precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          } else {
            var precision = 6; // Standard default.
          }
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
              // Add sign if needed
              if (flagAlwaysSigned) {
                if (currArg < 0) {
                  prefix = '-' + prefix;
                } else {
                  prefix = '+' + prefix;
                }
              }
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
                // Add sign.
                if (flagAlwaysSigned && currArg >= 0) {
                  argText = '+' + argText;
                }
              }
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _snprintf(s, n, format, varargs) {
      // int snprintf(char *restrict s, size_t n, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var limit = (n === undefined) ? result.length
                                    : Math.min(result.length, Math.max(n - 1, 0));
      if (s < 0) {
        s = -s;
        var buf = _malloc(limit+1);
        HEAP32[((s)>>2)]=buf;
        s = buf;
      }
      for (var i = 0; i < limit; i++) {
        HEAP8[(((s)+(i))|0)]=result[i];
      }
      if (limit < n || (n === undefined)) HEAP8[(((s)+(i))|0)]=0;
      return result.length;
    }function _sprintf(s, format, varargs) {
      // int sprintf(char *restrict s, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      return _snprintf(s, undefined, format, varargs);
    }
  function _gelSetColor() {
  Module['printErr']('missing function: gelSetColor'); abort(-1);
  }
  function _gelDrawTextLeft() {
  Module['printErr']('missing function: gelDrawTextLeft'); abort(-1);
  }
  function _gelDrawTextRight() {
  Module['printErr']('missing function: gelDrawTextRight'); abort(-1);
  }
  function _gelDrawTile() {
  Module['printErr']('missing function: gelDrawTile'); abort(-1);
  }
  function _gelDrawImage() {
  Module['printErr']('missing function: gelDrawImage'); abort(-1);
  }
  function _llvm_umul_with_overflow_i32(x, y) {
      x = x>>>0;
      y = y>>>0;
      return ((asm["setTempRet0"](x*y > 4294967295),(x*y)>>>0)|0);
    }
  function _gelDrawTileFlipX() {
  Module['printErr']('missing function: gelDrawTileFlipX'); abort(-1);
  }
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i64=_memset;
  var _floorf=Math.floor;
  var _ceilf=Math.ceil;
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  function _abort() {
      ABORT = true;
      throw 'abort() at ' + (new Error().stack);
    }
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value
      return value;
    }function ___errno_location() {
      return ___errno_state;
    }var ___errno=___errno_location;
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:35,EIDRM:36,ECHRNG:37,EL2NSYNC:38,EL3HLT:39,EL3RST:40,ELNRNG:41,EUNATCH:42,ENOCSI:43,EL2HLT:44,EDEADLK:45,ENOLCK:46,EBADE:50,EBADR:51,EXFULL:52,ENOANO:53,EBADRQC:54,EBADSLT:55,EDEADLOCK:56,EBFONT:57,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:74,ELBIN:75,EDOTDOT:76,EBADMSG:77,EFTYPE:79,ENOTUNIQ:80,EBADFD:81,EREMCHG:82,ELIBACC:83,ELIBBAD:84,ELIBSCN:85,ELIBMAX:86,ELIBEXEC:87,ENOSYS:88,ENMFILE:89,ENOTEMPTY:90,ENAMETOOLONG:91,ELOOP:92,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:106,EPROTOTYPE:107,ENOTSOCK:108,ENOPROTOOPT:109,ESHUTDOWN:110,ECONNREFUSED:111,EADDRINUSE:112,ECONNABORTED:113,ENETUNREACH:114,ENETDOWN:115,ETIMEDOUT:116,EHOSTDOWN:117,EHOSTUNREACH:118,EINPROGRESS:119,EALREADY:120,EDESTADDRREQ:121,EMSGSIZE:122,EPROTONOSUPPORT:123,ESOCKTNOSUPPORT:124,EADDRNOTAVAIL:125,ENETRESET:126,EISCONN:127,ENOTCONN:128,ETOOMANYREFS:129,EPROCLIM:130,EUSERS:131,EDQUOT:132,ESTALE:133,ENOTSUP:134,ENOMEDIUM:135,ENOSHARE:136,ECASECLASH:137,EILSEQ:138,EOVERFLOW:139,ECANCELED:140,ENOTRECOVERABLE:141,EOWNERDEAD:142,ESTRPIPE:143};function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 8: return PAGE_SIZE;
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
        case 0: return 2097152;
        case 3: return 65536;
        case 14: return 32768;
        case 73: return 32767;
        case 39: return 16384;
        case 60: return 1000;
        case 106: return 700;
        case 52: return 256;
        case 62: return 255;
        case 2: return 100;
        case 65: return 64;
        case 36: return 20;
        case 100: return 16;
        case 20: return 6;
        case 53: return 4;
        case 10: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }
  function ___cxa_allocate_exception(size) {
      return _malloc(size);
    }
  function _llvm_eh_exception() {
      return HEAP32[((_llvm_eh_exception.buf)>>2)];
    }
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }
  function ___cxa_is_number_type(type) {
      var isNumber = false;
      try { if (type == __ZTIi) isNumber = true } catch(e){}
      try { if (type == __ZTIj) isNumber = true } catch(e){}
      try { if (type == __ZTIl) isNumber = true } catch(e){}
      try { if (type == __ZTIm) isNumber = true } catch(e){}
      try { if (type == __ZTIx) isNumber = true } catch(e){}
      try { if (type == __ZTIy) isNumber = true } catch(e){}
      try { if (type == __ZTIf) isNumber = true } catch(e){}
      try { if (type == __ZTId) isNumber = true } catch(e){}
      try { if (type == __ZTIe) isNumber = true } catch(e){}
      try { if (type == __ZTIc) isNumber = true } catch(e){}
      try { if (type == __ZTIa) isNumber = true } catch(e){}
      try { if (type == __ZTIh) isNumber = true } catch(e){}
      try { if (type == __ZTIs) isNumber = true } catch(e){}
      try { if (type == __ZTIt) isNumber = true } catch(e){}
      return isNumber;
    }function ___cxa_does_inherit(definiteType, possibilityType, possibility) {
      if (possibility == 0) return false;
      if (possibilityType == 0 || possibilityType == definiteType)
        return true;
      var possibility_type_info;
      if (___cxa_is_number_type(possibilityType)) {
        possibility_type_info = possibilityType;
      } else {
        var possibility_type_infoAddr = HEAP32[((possibilityType)>>2)] - 8;
        possibility_type_info = HEAP32[((possibility_type_infoAddr)>>2)];
      }
      switch (possibility_type_info) {
      case 0: // possibility is a pointer
        // See if definite type is a pointer
        var definite_type_infoAddr = HEAP32[((definiteType)>>2)] - 8;
        var definite_type_info = HEAP32[((definite_type_infoAddr)>>2)];
        if (definite_type_info == 0) {
          // Also a pointer; compare base types of pointers
          var defPointerBaseAddr = definiteType+8;
          var defPointerBaseType = HEAP32[((defPointerBaseAddr)>>2)];
          var possPointerBaseAddr = possibilityType+8;
          var possPointerBaseType = HEAP32[((possPointerBaseAddr)>>2)];
          return ___cxa_does_inherit(defPointerBaseType, possPointerBaseType, possibility);
        } else
          return false; // one pointer and one non-pointer
      case 1: // class with no base class
        return false;
      case 2: // class with base class
        var parentTypeAddr = possibilityType + 8;
        var parentType = HEAP32[((parentTypeAddr)>>2)];
        return ___cxa_does_inherit(definiteType, parentType, possibility);
      default:
        return false; // some unencountered type
      }
    }
  function ___resumeException(ptr) {
      if (HEAP32[((_llvm_eh_exception.buf)>>2)] == 0) HEAP32[((_llvm_eh_exception.buf)>>2)]=ptr;
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";;
    }function ___cxa_find_matching_catch(thrown, throwntype) {
      if (thrown == -1) thrown = HEAP32[((_llvm_eh_exception.buf)>>2)];
      if (throwntype == -1) throwntype = HEAP32[(((_llvm_eh_exception.buf)+(4))>>2)];
      var typeArray = Array.prototype.slice.call(arguments, 2);
      // If throwntype is a pointer, this means a pointer has been
      // thrown. When a pointer is thrown, actually what's thrown
      // is a pointer to the pointer. We'll dereference it.
      if (throwntype != 0 && !___cxa_is_number_type(throwntype)) {
        var throwntypeInfoAddr= HEAP32[((throwntype)>>2)] - 8;
        var throwntypeInfo= HEAP32[((throwntypeInfoAddr)>>2)];
        if (throwntypeInfo == 0)
          thrown = HEAP32[((thrown)>>2)];
      }
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        if (___cxa_does_inherit(typeArray[i], throwntype, thrown))
          return ((asm["setTempRet0"](typeArray[i]),thrown)|0);
      }
      // Shouldn't happen unless we have bogus data in typeArray
      // or encounter a type for which emscripten doesn't have suitable
      // typeinfo defined. Best-efforts match just in case.
      return ((asm["setTempRet0"](throwntype),thrown)|0);
    }function ___cxa_throw(ptr, type, destructor) {
      if (!___cxa_throw.initialized) {
        try {
          HEAP32[((__ZTVN10__cxxabiv119__pointer_type_infoE)>>2)]=0; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv117__class_type_infoE)>>2)]=1; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv120__si_class_type_infoE)>>2)]=2; // Workaround for libcxxabi integration bug
        } catch(e){}
        ___cxa_throw.initialized = true;
      }
      HEAP32[((_llvm_eh_exception.buf)>>2)]=ptr
      HEAP32[(((_llvm_eh_exception.buf)+(4))>>2)]=type
      HEAP32[(((_llvm_eh_exception.buf)+(8))>>2)]=destructor
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++;
      }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";;
    }
  function ___cxa_call_unexpected(exception) {
      Module.printErr('Unexpected exception thrown, this is not properly supported - aborting');
      ABORT = true;
      throw exception;
    }
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : console.log("warning: cannot create object URLs");
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        function getMimetype(name) {
          return {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'bmp': 'image/bmp',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg'
          }[name.substr(name.lastIndexOf('.')+1)];
        }
        var imagePlugin = {};
        imagePlugin['canHandle'] = function(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule) {
        var ctx;
        try {
          if (useWebGL) {
            ctx = canvas.getContext('experimental-webgl', {
              alpha: false
            });
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas - ' + e);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function (func) {
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                         window['mozRequestAnimationFrame'] ||
                                         window['webkitRequestAnimationFrame'] ||
                                         window['msRequestAnimationFrame'] ||
                                         window['oRequestAnimationFrame'] ||
                                         window['setTimeout'];
        }
        window.requestAnimationFrame(func);
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x = event.pageX - (window.scrollX + rect.left);
          var y = event.pageY - (window.scrollY + rect.top);
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
_llvm_eh_exception.buf = allocate(12, "void*", ALLOC_STATIC);
Module["requestFullScreen"] = function(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function(func) { Browser.requestAnimationFrame(func) };
  Module["pauseMainLoop"] = function() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 5242880;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY
var Math_min = Math.min;
function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vffii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_vffii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.__ZTVN10__cxxabiv117__class_type_infoE|0;var n=env.__ZTVN10__cxxabiv120__si_class_type_infoE|0;var o=+env.NaN;var p=+env.Infinity;var q=0;var r=0;var s=0;var t=0;var u=0,v=0,w=0,x=0,y=0.0,z=0,A=0,B=0,C=0.0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=global.Math.floor;var O=global.Math.abs;var P=global.Math.sqrt;var Q=global.Math.pow;var R=global.Math.cos;var S=global.Math.sin;var T=global.Math.tan;var U=global.Math.acos;var V=global.Math.asin;var W=global.Math.atan;var X=global.Math.atan2;var Y=global.Math.exp;var Z=global.Math.log;var _=global.Math.ceil;var $=global.Math.imul;var aa=env.abort;var ab=env.assert;var ac=env.asmPrintInt;var ad=env.asmPrintFloat;var ae=env.min;var af=env.invoke_vi;var ag=env.invoke_vffii;var ah=env.invoke_ii;var ai=env.invoke_v;var aj=env.invoke_iii;var ak=env._gelGraphicsInit;var al=env._snprintf;var am=env._gelDrawTextRight;var an=env.___errno_location;var ao=env.___cxa_throw;var ap=env._mrGetLayerCount;var aq=env._ceilf;var ar=env._gelDrawTextLeft;var as=env._abort;var at=env._gelLoadImage;var au=env.__reallyNegative;var av=env._gelDrawTiles;var aw=env._gelDrawImage;var ax=env._mrGetSize;var ay=env.___setErrNo;var az=env._gelBindTileset;var aA=env._llvm_eh_exception;var aB=env._mrIndex;var aC=env._llvm_umul_with_overflow_i32;var aD=env._sprintf;var aE=env.___cxa_find_matching_catch;var aF=env._gelGraphicsExit;var aG=env._mrGetWidth;var aH=env.___cxa_allocate_exception;var aI=env._sysconf;var aJ=env._gelLoadTileset;var aK=env.__ZSt18uncaught_exceptionv;var aL=env.___cxa_is_number_type;var aM=env._time;var aN=env.__formatString;var aO=env.___cxa_does_inherit;var aP=env._floorf;var aQ=env._sndPlay;var aR=env._gelDrawTileCentered;var aS=env._mrBindLayer;var aT=env.___cxa_call_unexpected;var aU=env._sbrk;var aV=env._gelSetColor;var aW=env._gelBindImage;var aX=env.___gxx_personality_v0;var aY=env._mrGetHeight;var aZ=env._gelDrawTileFlipX;var a_=env.___resumeException;var a$=env._gelDrawTile;
// EMSCRIPTEN_START_FUNCS
function a5(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7>>3<<3;return b|0}function a6(){return i|0}function a7(a){a=a|0;i=a}function a8(a,b){a=a|0;b=b|0;if((q|0)==0){q=a;r=b}}function a9(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function ba(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function bb(a){a=a|0;D=a}function bc(a){a=a|0;E=a}function bd(a){a=a|0;F=a}function be(a){a=a|0;G=a}function bf(a){a=a|0;H=a}function bg(a){a=a|0;I=a}function bh(a){a=a|0;J=a}function bi(a){a=a|0;K=a}function bj(a){a=a|0;L=a}function bk(a){a=a|0;M=a}function bl(){c[108]=m+8;c[110]=n+8}function bm(a,b,d,e){a=+a;b=+b;d=d|0;e=e|0;g[10]=a;g[8]=b;c[386]=d;c[384]=e;return}function bn(d){d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0.0,B=0,C=0;e=c[(c[408]|0)+8+(d<<2)>>2]|0;f=c[e+4>>2]|0;h=c[e>>2]|0;i=(f|0)>0;j=i&(h|0)>0;do{if(j){k=c[e+8>>2]|0;l=0;m=0;while(1){n=$(l,h)|0;o=0;p=m;do{p=((b[k+(o+n<<1)>>1]|0)==1863)+p|0;o=o+1|0;}while((o|0)<(h|0));o=l+1|0;if((o|0)<(f|0)){l=o;m=p}else{break}}if(!j){q=0;r=p;break}m=c[e+8>>2]|0;l=0;k=0;while(1){o=$(l,h)|0;n=0;s=k;do{s=((b[m+(n+o<<1)>>1]|0)==1864)+s|0;n=n+1|0;}while((n|0)<(h|0));n=l+1|0;if((n|0)<(f|0)){l=n;k=s}else{q=s;r=p;break}}}else{q=0;r=0}}while(0);p=c[412]|0;do{if((p|0)!=0){if((r|0)>0){h=p;e=0;while(1){j=c[h+8+(e<<2)>>2]|0;if((j|0)==0){t=h}else{bJ(j);t=c[412]|0}j=e+1|0;if((j|0)<(r|0)){h=t;e=j}else{break}}if((t|0)==0){break}else{u=t}}else{u=p}bJ(u)}}while(0);u=bO((r<<2)+8|0)|0;c[u+4>>2]=r;c[u>>2]=r;c[412]=u;u=c[410]|0;do{if((u|0)!=0){if((q|0)>0){r=u;p=0;while(1){t=c[r+8+(p<<2)>>2]|0;if((t|0)==0){v=r}else{bJ(t);v=c[410]|0}t=p+1|0;if((t|0)<(q|0)){r=v;p=t}else{break}}if((v|0)==0){break}else{w=v}}else{w=u}bJ(w)}}while(0);w=bO((q<<2)+8|0)|0;c[w+4>>2]=q;c[w>>2]=q;c[410]=w;if(i){x=0;y=0;z=0}else{return}while(1){A=+((z<<3)+8|0);i=x;w=y;q=0;while(1){u=c[(c[408]|0)+8+(d<<2)>>2]|0;v=($(c[u>>2]|0,z)|0)+q|0;p=b[(c[u+8>>2]|0)+(v<<1)>>1]|0;if((p<<16>>16|0)==1863){v=bN(44)|0;g[v>>2]=+(q<<3|0);g[v+4>>2]=A;u=v+24|0;r=u;c[r>>2]=0;c[r+4>>2]=0;c[v+8>>2]=968;c[v+12>>2]=0;c[v+16>>2]=0;c[v+20>>2]=0;c[u>>2]=1107296256;g[v+28>>2]=64.0;c[v+32>>2]=1090519040;g[v+36>>2]=64.0;a[v+40|0]=0;a[v+41|0]=0;c[(c[412]|0)+8+(i<<2)>>2]=v;v=c[(c[408]|0)+8+(d<<2)>>2]|0;u=($(c[v>>2]|0,z)|0)+q|0;b[(c[v+8>>2]|0)+(u<<1)>>1]=0;B=w;C=i+1|0}else if((p<<16>>16|0)==1864){p=bN(44)|0;g[p>>2]=+(q<<3|0);g[p+4>>2]=A;u=p+24|0;v=u;c[v>>2]=0;c[v+4>>2]=0;c[p+8>>2]=952;c[p+12>>2]=0;c[p+16>>2]=0;c[p+20>>2]=0;c[u>>2]=1107296256;g[p+28>>2]=64.0;c[p+32>>2]=1082130432;g[p+36>>2]=8.0;a[p+40|0]=0;a[p+41|0]=0;c[(c[410]|0)+8+(w<<2)>>2]=p;p=c[(c[408]|0)+8+(d<<2)>>2]|0;u=($(c[p>>2]|0,z)|0)+q|0;b[(c[p+8>>2]|0)+(u<<1)>>1]=0;B=w+1|0;C=i}else{B=w;C=i}u=q+1|0;if((u|0)<(f|0)){i=C;w=B;q=u}else{break}}q=z+1|0;if((q|0)<(f|0)){x=C;y=B;z=q}else{break}}return}function bo(){var d=0,e=0,f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;do{if((c[408]|0)!=0){d=(ap()|0)==0;e=c[408]|0;if(d){f=e}else{d=0;h=e;while(1){e=c[h+8+(d<<2)>>2]|0;if((e|0)!=0){i=c[e+8>>2]|0;if((i|0)!=0){bK(i)}bJ(e)}e=d+1|0;i=e>>>0<(ap()|0)>>>0;j=c[408]|0;if(i){d=e;h=j}else{f=j;break}}}if((f|0)==0){break}bJ(f)}}while(0);f=c[406]|0;if((f|0)!=0){bJ(f)}f=ap()|0;h=bO((f<<2)+8|0)|0;c[h+4>>2]=f;c[h>>2]=f;c[408]=h;h=ap()|0;if((h|0)>0){f=0;do{aS(f|0);d=bN(12)|0;j=d;e=aG()|0;i=aY()|0;c[d>>2]=e;c[d+4>>2]=i;k=$(i,e)|0;e=aC(k|0,2)|0;i=bO(D?-1:e)|0;c[d+8>>2]=i;if((k|0)!=0){d=k;do{d=d-1|0;b[i+(d<<1)>>1]=0;}while((d|0)!=0)}c[(c[408]|0)+8+(f<<2)>>2]=j;d=ax()|0;if((d|0)>0){i=0;do{k=(aB(i|0)|0)&65535;b[(c[(c[(c[408]|0)+8+(f<<2)>>2]|0)+8>>2]|0)+(i<<1)>>1]=k;i=i+1|0;}while((i|0)<(d|0))}f=f+1|0;}while((f|0)<(h|0))}h=c[408]|0;f=h+4|0;d=c[h+8+((c[f>>2]|0)-1<<2)>>2]|0;i=c[d>>2]|0;j=c[d+4>>2]|0;if((j|0)>0&(i|0)>0){k=c[d+8>>2]|0;d=0;e=0;while(1){l=$(d,i)|0;m=0;n=e;do{o=b[k+(m+l<<1)>>1]|0;n=(o<<16>>16==1859)+n+(o<<16>>16==1861)|0;m=m+1|0;}while((m|0)<(i|0));m=d+1|0;if((m|0)<(j|0)){d=m;e=n}else{p=n;break}}}else{p=0}c[390]=p;p=c[h+8+((c[f>>2]|0)-1<<2)>>2]|0;h=c[p>>2]|0;e=c[p+4>>2]|0;if((e|0)>0&(h|0)>0){d=c[p+8>>2]|0;p=0;j=0;while(1){i=$(p,h)|0;k=0;m=j;do{l=b[d+(k+i<<1)>>1]|0;m=(l<<16>>16==1860)+m+(l<<16>>16==1862)|0;k=k+1|0;}while((k|0)<(h|0));k=p+1|0;if((k|0)<(e|0)){p=k;j=m}else{q=m;break}}}else{q=0}c[392]=q;q=bN(112)|0;c[q>>2]=1128792064;g[q+4>>2]=344.0;c[q+8>>2]=1128792064;g[q+12>>2]=344.0;j=q+32|0;p=j;c[p>>2]=0;c[p+4>>2]=0;c[q+16>>2]=528;c[q+20>>2]=0;c[q+24>>2]=0;c[q+28>>2]=0;c[j>>2]=1107296256;g[q+36>>2]=64.0;c[q+56>>2]=0;c[q+60>>2]=0;a[q+64|0]=0;bQ(q+48|0,0,6);bQ(q+68|0,0,44);a[q+65|0]=1;c[q+40>>2]=1096810496;g[q+44>>2]=28.0;c[406]=q;j=q;q=c[j+4>>2]|0;p=1704;c[p>>2]=c[j>>2];c[p+4>>2]=q;bn((c[f>>2]|0)-1|0);c[420]=0;return}function bp(){c[400]=320;c[402]=240;c[416]=160;c[418]=120;ak(320,240);g[426]=+(c[416]|0);g[427]=+(c[418]|0);c[396]=aJ(336,8,8)|0;c[404]=aJ(312,64,64)|0;c[414]=aJ(184,32,32)|0;c[424]=aJ(160,64,64)|0;c[398]=aJ(112,32,32)|0;c[394]=at(88)|0;c[388]=at(72)|0;c[422]=1;bo();return}function bq(){var a=0;a=c[406]|0;if((a|0)!=0){bJ(a)}aF();return}function br(){var b=0,d=0,e=0.0,f=0,h=0,i=0,j=0.0,l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0,G=0,H=0,I=0,J=0,K=0;bs(c[406]|0);b=c[406]|0;d=b+40|0;e=+g[114];f=b;h=c[f>>2]|0;i=c[f+4>>2]|0;j=(c[k>>2]=h,+g[k>>2])- +g[d>>2]*e;f=d;d=c[f>>2]|0;l=c[f+4>>2]|0;f=c[412]|0;if((c[f+4>>2]|0)==0){m=b;n=i;o=h;p=l;q=d}else{r=(c[k>>2]=l,+g[k>>2]);s=(c[k>>2]=d,+g[k>>2]);t=s+j;u=r+((c[k>>2]=i,+g[k>>2])- +g[b+44>>2]);b=0;i=f;v=e;while(1){f=c[i+8+(b<<2)>>2]|0;d=f+32|0;l=f;e=+g[l>>2];w=e- +g[d>>2]*v;x=+g[l+4>>2]- +g[f+36>>2];l=d;y=+g[l>>2];do{if(t>=w&t<w+(s+y)&u>=x){if(u>=x+(r+ +g[l+4>>2])){break}if((a[f+40|0]&1)!=0){break}d=c[406]|0;if((c[d+72>>2]|0)>0){aQ(64)|0;h=(c[406]|0)+72|0;c[h>>2]=(c[h>>2]|0)-1;h=(c[406]|0)+76|0;c[h>>2]=(c[h>>2]|0)+1;a[(c[(c[412]|0)+8+(b<<2)>>2]|0)+40|0]=1;a[(c[(c[412]|0)+8+(b<<2)>>2]|0)+41|0]=a[(c[406]|0)+64|0]&1;h=c[(c[412]|0)+8+(b<<2)>>2]|0;z=h+8|0;do{if((c[z>>2]|0)!=960){c[z>>2]=960;if((c[h+12>>2]|0)!=0){break}c[h+16>>2]=0;c[h+20>>2]=0}}while(0);h=c[(c[412]|0)+8+(b<<2)>>2]|0;z=h+12|0;if((c[z>>2]|0)==592){break}c[z>>2]=592;c[h+16>>2]=0;c[h+20>>2]=0;break}else{A=y*v;B=e-A;C=B+y;D=(t>C?C:t)-(j<B?B:j);C=j+s*v-(B+A);A=+g[380];do{if(C>A){E=+g[116]}else{if(C>=A){E=A;break}E=-0.0- +g[116]}}while(0);h=d|0;g[h>>2]=D*E+ +g[h>>2];break}}}while(0);f=c[(c[412]|0)+8+(b<<2)>>2]|0;l=f+20|0;h=(c[l>>2]|0)+1|0;c[l>>2]=h;do{if((h|0)>5){c[l>>2]=0;z=f+16|0;F=(c[z>>2]|0)+1|0;c[z>>2]=F;G=f+12|0;H=c[G>>2]|0;if((H|0)==0){if((F|0)!=(c[c[f+8>>2]>>2]|0)){break}c[z>>2]=0;break}else{if((F|0)!=(c[H>>2]|0)){break}c[z>>2]=0;c[G>>2]=0;break}}}while(0);f=b+1|0;l=c[412]|0;if(f>>>0>=(c[l+4>>2]|0)>>>0){break}b=f;i=l;v=+g[114]}i=c[406]|0;b=i;l=i+40|0;m=i;n=c[b+4>>2]|0;o=c[b>>2]|0;p=c[l+4>>2]|0;q=c[l>>2]|0}l=c[410]|0;if((c[l+4>>2]|0)==0){I=m;J=n;K=o}else{v=+g[114];E=(c[k>>2]=p,+g[k>>2]);s=(c[k>>2]=q,+g[k>>2]);j=s+((c[k>>2]=o,+g[k>>2])- +g[m+40>>2]*v);t=E+((c[k>>2]=n,+g[k>>2])- +g[m+44>>2]);m=0;n=l;r=v;while(1){l=c[n+8+(m<<2)>>2]|0;o=l+32|0;q=l;v=+g[q>>2]- +g[o>>2]*r;u=+g[q+4>>2]- +g[l+36>>2];q=o;do{if(j>=v&j<v+(s+ +g[q>>2])&t>=u){if(t>=u+(E+ +g[q+4>>2])){break}if((a[l+40|0]&1)!=0){break}o=c[406]|0;p=o+72|0;b=c[p>>2]|0;if((b|0)!=((c[392]|0)-(c[o+76>>2]|0)|0)){break}c[p>>2]=b-1;b=(c[406]|0)+76|0;c[b>>2]=(c[b>>2]|0)+1;aQ(56)|0;c[422]=3;a[(c[(c[410]|0)+8+(m<<2)>>2]|0)+40|0]=1;b=c[(c[410]|0)+8+(m<<2)>>2]|0;p=b+8|0;if((c[p>>2]|0)==944){break}c[p>>2]=944;if((c[b+12>>2]|0)!=0){break}c[b+16>>2]=0;c[b+20>>2]=0}}while(0);l=c[(c[410]|0)+8+(m<<2)>>2]|0;q=l+20|0;b=(c[q>>2]|0)+1|0;c[q>>2]=b;do{if((b|0)>5){c[q>>2]=0;p=l+16|0;o=(c[p>>2]|0)+1|0;c[p>>2]=o;i=l+12|0;f=c[i>>2]|0;if((f|0)==0){if((o|0)!=(c[c[l+8>>2]>>2]|0)){break}c[p>>2]=0;break}else{if((o|0)!=(c[f>>2]|0)){break}c[p>>2]=0;c[i>>2]=0;break}}}while(0);do{if((c[420]|0)==(c[392]|0)){b=l+8|0;if((c[b>>2]|0)==944){break}c[b>>2]=944;if((c[l+12>>2]|0)!=0){break}c[l+16>>2]=0;c[q>>2]=0}}while(0);q=m+1|0;l=c[410]|0;if(q>>>0>=(c[l+4>>2]|0)>>>0){break}m=q;n=l;r=+g[114]}n=c[406]|0;m=n;I=n;J=c[m+4>>2]|0;K=c[m>>2]|0}m=1704;c[m>>2]=K;c[m+4>>2]=J;J=c[420]|0;m=(c[I+72>>2]|0)+(c[I+76>>2]|0)|0;c[420]=m;if((m|0)!=(c[392]|0)|(m|0)==(J|0)){return}aQ(56)|0;return}function bs(d){d=d|0;var e=0,f=0,h=0,i=0,j=0.0,l=0,m=0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0.0,D=0,E=0,F=0,G=0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,O=0.0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0,V=0,W=0,X=0,Y=0,Z=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0.0,ak=0.0,al=0,am=0.0,an=0.0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0.0,aw=0.0,ax=0.0,ay=0.0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0.0,aF=0.0,aG=0,aH=0,aI=0,aJ=0,aK=0.0,aL=0.0,aM=0,aN=0,aO=0,aP=0,aR=0.0,aS=0.0,aT=0.0,aU=0.0,aV=0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0,a0=0,a1=0,a2=0,a3=0,a4=0,a5=0,a6=0,a7=0,a8=0,a9=0,ba=0.0,bb=0.0,bc=0.0,bd=0.0,be=0,bf=0,bg=0,bh=0,bi=0,bj=0,bk=0,bl=0;e=d+84|0;f=(c[e>>2]|0)+1|0;c[e>>2]=f;do{if((f|0)==4){c[e>>2]=0;h=d+80|0;i=(c[h>>2]|0)+1|0;c[h>>2]=i;if((i|0)!=10){break}c[h>>2]=0}}while(0);e=d+92|0;f=(c[e>>2]|0)+1|0;c[e>>2]=f;do{if((f|0)==4){c[e>>2]=0;h=d+88|0;i=(c[h>>2]|0)+1|0;c[h>>2]=i;if((i|0)!=8){break}c[h>>2]=0}}while(0);e=d+100|0;f=(c[e>>2]|0)+1|0;c[e>>2]=f;do{if((f|0)==4){c[e>>2]=0;h=d+96|0;i=(c[h>>2]|0)+1|0;c[h>>2]=i;if((i|0)!=8){break}c[h>>2]=0}}while(0);e=d+108|0;f=(c[e>>2]|0)+1|0;c[e>>2]=f;do{if((f|0)==4){c[e>>2]=0;h=d+104|0;i=(c[h>>2]|0)+1|0;c[h>>2]=i;if((i|0)!=8){break}c[h>>2]=0}}while(0);e=d|0;g[e>>2]=+g[e>>2]+0.0;f=d+4|0;j=+g[f>>2]+.20000000298023224;g[f>>2]=j;h=d+20|0;i=c[h>>2]|0;l=(i|0)==688;do{if(l){if((c[d+24>>2]|0)>6){m=141}}else{if((i|0)==736){if((c[d+24>>2]|0)>9){m=141;break}else{break}}else{if((i|0)==792){break}else{m=141;break}}}}while(0);if((m|0)==141){n=+g[d>>2];o=n- +g[d+8>>2];p=(a[d+65|0]&1)==0?.15000000596046448:.20000000298023224;q=+g[10];if(o*q>0.0){r=+g[380];if(o<r){s=-0.0-o}else{s=o}o=2.0-s;t=p*(o<r?0.0:o)}else{t=p}g[e>>2]=t*q+n;g[f>>2]=t*0.0+j}u=d+8|0;v=d;w=u|0;x=(g[k>>2]=+g[v>>2]- +g[w>>2],c[k>>2]|0);y=d+12|0;j=+g[v+4>>2]- +g[y>>2];z=d+56|0;L203:do{if((c[z>>2]|0)>0){A=c[386]&1;if((A|0)==0){B=x;C=j;break}do{if(l){if((c[d+24>>2]|0)<=6){B=x;C=j;break L203}}else{if((i|0)!=736){break}if((c[d+24>>2]|0)<=9){B=x;C=j;break L203}}}while(0);do{if((A&~c[384]|0)==0){D=x}else{if((a[d+65|0]&1)==0){aQ(288)|0;D=x;break}aQ(296)|0;if((a[d+48|0]&1)!=0){D=x;break}if((a[d+52|0]&1)==0){D=x;break}E=d+64|0;F=a[E]&1;G=F<<24>>24==0?-1063256064:1084227584;a[E]=F^1;if((c[h>>2]|0)==792){D=G;break}c[h>>2]=792;c[d+24>>2]=0;c[d+28>>2]=0;D=G}}while(0);A=c[z>>2]|0;c[z>>2]=A-1;B=D;C=-0.0-(+(A|0)+1.0)*.5}else{B=x;C=j}}while(0);do{if((c[386]&1|0)==0){if((c[d+60>>2]|0)<=8){break}c[z>>2]=0}}while(0);j=+g[w>>2];t=+g[v>>2];n=+g[y>>2];q=+g[v+4>>2]-n-C;C=t-(t-j-(c[k>>2]=B,+g[k>>2]));g[e>>2]=C;t=+g[f>>2]-q;g[f>>2]=t;B=d+65|0;y=(a[B]&1)==0;q=C-j;C=+g[380];w=q<C;do{if(y){if(w){H=-0.0-q}else{H=q}if(H>4.0){do{if(q>C){I=+g[116]}else{if(!w){I=C;break}I=-0.0- +g[116]}}while(0);g[d>>2]=j+I*4.0;J=+g[380]}else{J=C}p=t-n;x=p<J;if(x){K=-0.0-p}else{K=p}if(K<=4.0){L=t;break}do{if(p>J){M=+g[116]}else{if(!x){M=J;break}M=-0.0- +g[116]}}while(0);p=n+M*4.0;g[f>>2]=p;L=p}else{if(w){O=-0.0-q}else{O=q}if(O>4.0){do{if(q>C){P=+g[116]}else{if(!w){P=C;break}P=-0.0- +g[116]}}while(0);g[d>>2]=j+P*4.0;Q=+g[380]}else{Q=C}p=t-n;x=p<Q;if(x){R=-0.0-p}else{R=p}if(R<=4.0){L=t;break}do{if(p>Q){S=+g[116]}else{if(!x){S=Q;break}S=-0.0- +g[116]}}while(0);p=n+S*4.0;g[f>>2]=p;L=p}}while(0);w=c[v>>2]|0;x=c[v+4>>2]|0;S=(c[k>>2]=w,+g[k>>2]);Q=S-j;j=(c[k>>2]=x,+g[k>>2])-n;D=u;c[D>>2]=w;c[D+4>>2]=x;x=d+48|0;w=a[x]&1;u=w<<24>>24==0;n=+g[10];do{if(u){T=.949999988079071}else{if(n>0.0&Q<0.0){T=.699999988079071;break}if(n<0.0&Q>0.0){T=.699999988079071;break}if(n!=0.0){T=.949999988079071;break}T=.4000000059604645}}while(0);i=d+52|0;l=a[i]&1;t=l<<24>>24!=0&n!=0.0&j>0.0?.30000001192092896:T;g[e>>2]=S+Q*t;Q=L+j*t;g[f>>2]=Q;A=d+40|0;G=d+44|0;t=+g[v>>2]- +g[A>>2]*+g[114];j=+g[v+4>>2]- +g[G>>2];v=A;L=+g[v>>2];S=+g[v+4>>2];v=c[408]|0;F=(c[v+4>>2]|0)-2|0;E=~~+N(+t)>>3;U=~~+N(+j)>>3;T=L+t;V=(~~+_(+T)>>3)+1|0;n=S+j;W=(~~+_(+n)>>3)+1|0;X=c[v+8+(F<<2)>>2]|0;v=c[X>>2]|0;Y=c[X+4>>2]|0;X=(E|0)<0?0:E;E=(U|0)<0?0:U;U=(V|0)<0?0:V;V=(W|0)<0?0:W;W=v-1|0;Z=(X|0)<(v|0)?X:W;X=Y-1|0;aa=(E|0)<(Y|0)?E:X;E=(U|0)<(v|0)?U:W;W=(V|0)<(Y|0)?V:X;a[d+49|0]=w;w=d+50|0;X=d+51|0;a[X]=a[w]&1;a[d+53|0]=l;a[x]=0;a[w]=0;a[i]=0;l=W-1|0;V=(Z|0)<(E|0);if(V){Y=c[(c[408]|0)+8+(F<<2)>>2]|0;U=$(c[Y>>2]|0,l)|0;v=c[Y+8>>2]|0;R=+(l<<3|0);C=R+32.0;l=(g[k>>2]=R,c[k>>2]|0);P=0.0;q=0.0;Y=0;ab=0;ac=0;ad=0;ae=Z;while(1){do{if((b[v+(U+ae<<1)>>1]|0)==1857){O=+(ae<<3|0);if(ad){M=(c[k>>2]=Y,+g[k>>2]);J=M>O?O:M;K=(c[k>>2]=ab,+g[k>>2]);I=K>R?R:K;H=q+M;M=O+8.0;p=P+K;af=1;ag=ac;ah=(g[k>>2]=I,c[k>>2]|0);ai=(g[k>>2]=J,c[k>>2]|0);aj=(H<M?M:H)-J;ak=(p<C?C:p)-I;break}else{af=1;ag=ac|2;ah=l;ai=(g[k>>2]=O,c[k>>2]|0);aj=8.0;ak=32.0;break}}else{af=ad;ag=ac;ah=ab;ai=Y;aj=q;ak=P}}while(0);al=ae+1|0;if((al|0)<(E|0)){P=ak;q=aj;Y=ai;ab=ah;ac=ag;ad=af;ae=al}else{am=ak;an=aj;ao=ai;ap=ah;aq=ag;break}}}else{am=0.0;an=0.0;ao=0;ap=0;aq=0}ag=(aa|0)<(W|0);do{if(ag){ah=c[(c[408]|0)+8+(F<<2)>>2]|0;ai=c[ah>>2]|0;ae=c[ah+8>>2]|0;aj=+((Z<<3)-24|0);ak=aj+32.0;ah=(g[k>>2]=aj,c[k>>2]|0);q=0.0;P=0.0;af=0;ad=0;ac=aq;ab=0;Y=aa;while(1){do{if((b[ae+(($(ai,Y)|0)+Z<<1)>>1]|0)==1857){C=+(Y<<3|0);if(ab){R=(c[k>>2]=af,+g[k>>2]);O=R>aj?aj:R;I=(c[k>>2]=ad,+g[k>>2]);p=I>C?C:I;J=P+R;R=q+I;I=C+8.0;ar=1;as=ac;at=(g[k>>2]=p,c[k>>2]|0);au=(g[k>>2]=O,c[k>>2]|0);av=(J<ak?ak:J)-O;aw=(R<I?I:R)-p;break}else{ar=1;as=ac|4;at=(g[k>>2]=C,c[k>>2]|0);au=ah;av=32.0;aw=8.0;break}}else{ar=ab;as=ac;at=ad;au=af;av=P;aw=q}}while(0);l=Y+1|0;if((l|0)<(W|0)){q=aw;P=av;af=au;ad=at;ac=as;ab=ar;Y=l}else{break}}Y=E-1|0;if(!ag){ax=0.0;ay=0.0;az=0;aA=0;aB=as;aC=at;aD=au;aE=av;aF=aw;break}ab=c[(c[408]|0)+8+(F<<2)>>2]|0;ac=c[ab>>2]|0;ad=c[ab+8>>2]|0;P=+(Y<<3|0);q=P+32.0;ab=(g[k>>2]=P,c[k>>2]|0);ak=0.0;aj=0.0;af=0;ah=0;ai=as;ae=0;l=aa;while(1){do{if((b[ad+(($(ac,l)|0)+Y<<1)>>1]|0)==1857){C=+(l<<3|0);if(ae){p=(c[k>>2]=af,+g[k>>2]);R=p>P?P:p;I=(c[k>>2]=ah,+g[k>>2]);O=I>C?C:I;J=aj+p;p=ak+I;I=C+8.0;aG=1;aH=ai;aI=(g[k>>2]=O,c[k>>2]|0);aJ=(g[k>>2]=R,c[k>>2]|0);aK=(J<q?q:J)-R;aL=(p<I?I:p)-O;break}else{aG=1;aH=ai|8;aI=(g[k>>2]=C,c[k>>2]|0);aJ=ab;aK=32.0;aL=8.0;break}}else{aG=ae;aH=ai;aI=ah;aJ=af;aK=aj;aL=ak}}while(0);U=l+1|0;if((U|0)<(W|0)){ak=aL;aj=aK;af=aJ;ah=aI;ai=aH;ae=aG;l=U}else{ax=aL;ay=aK;az=aJ;aA=aI;aB=aH;aC=at;aD=au;aE=av;aF=aw;break}}}else{ax=0.0;ay=0.0;az=0;aA=0;aB=aq;aC=0;aD=0;aE=0.0;aF=0.0}}while(0);if(V){V=c[(c[408]|0)+8+(F<<2)>>2]|0;F=$(c[V>>2]|0,aa)|0;aq=c[V+8>>2]|0;aw=+((aa<<3)-24|0);av=aw+32.0;aa=(g[k>>2]=aw,c[k>>2]|0);aK=0.0;aL=0.0;V=0;au=0;at=aB;aH=0;aI=Z;while(1){do{if((b[aq+(F+aI<<1)>>1]|0)==1857){aj=+(aI<<3|0);if(aH){ak=(c[k>>2]=V,+g[k>>2]);q=ak>aj?aj:ak;P=(c[k>>2]=au,+g[k>>2]);C=P>aw?aw:P;O=aL+ak;ak=aj+8.0;p=aK+P;aM=1;aN=at;aO=(g[k>>2]=C,c[k>>2]|0);aP=(g[k>>2]=q,c[k>>2]|0);aR=(O<ak?ak:O)-q;aS=(p<av?av:p)-C;break}else{aM=1;aN=at|1;aO=aa;aP=(g[k>>2]=aj,c[k>>2]|0);aR=8.0;aS=32.0;break}}else{aM=aH;aN=at;aO=au;aP=V;aR=aL;aS=aK}}while(0);Z=aI+1|0;if((Z|0)<(E|0)){aK=aS;aL=aR;V=aP;au=aO;at=aN;aH=aM;aI=Z}else{aT=aS;aU=aR;aV=aP;aW=aO;aX=aN;break}}}else{aT=0.0;aU=0.0;aV=0;aW=0;aX=aB}aB=(aX&2|0)!=0;do{if(aB&an>8.0){aR=an+(c[k>>2]=ao,+g[k>>2]);aS=am+(c[k>>2]=ap,+g[k>>2]);if(!(aR>=t&aR<t+(L+an)&aS>=j)){aY=0;break}aY=aS<j+(S+am)?2:0}else{aY=0}}while(0);aN=(aX&1|0)!=0;if(aN&aU>8.0){aS=aU+(c[k>>2]=aV,+g[k>>2]);aR=aT+(c[k>>2]=aW,+g[k>>2]);if(aS>=t&aS<t+(L+aU)&aR>=j){aZ=aR<j+(S+aT)|0}else{aZ=0}a_=aZ|aY}else{a_=aY}aY=(aX&4|0)!=0;if(aY&aF>8.0){aR=aE+(c[k>>2]=aD,+g[k>>2]);aS=aF+(c[k>>2]=aC,+g[k>>2]);if(aR>=t&aR<t+(L+aE)&aS>=j){a$=aS<j+(S+aF)}else{a$=0}a0=a$?a_|4:a_}else{a0=a_}a_=(aX&8|0)!=0;if(a_&ax>8.0){aS=ay+(c[k>>2]=az,+g[k>>2]);aR=ax+(c[k>>2]=aA,+g[k>>2]);if(aS>=t&aS<t+(L+ay)&aR>=j){a1=aR<j+(S+ax)}else{a1=0}a2=a1?a0|8:a0}else{a2=a0}do{if((a2|0)==0){do{if(aB){aR=an+(c[k>>2]=ao,+g[k>>2]);aS=am+(c[k>>2]=ap,+g[k>>2]);if(!(aR>=t&aR<t+(L+an)&aS>=j)){a3=0;break}a3=aS<j+(S+am)?2:0}else{a3=0}}while(0);if(aN){aS=aU+(c[k>>2]=aV,+g[k>>2]);aR=aT+(c[k>>2]=aW,+g[k>>2]);if(aS>=t&aS<t+(L+aU)&aR>=j){a4=aR<j+(S+aT)|0}else{a4=0}a5=a4|a3}else{a5=a3}if(aY){aR=aE+(c[k>>2]=aD,+g[k>>2]);aS=aF+(c[k>>2]=aC,+g[k>>2]);if(aR>=t&aR<t+(L+aE)&aS>=j){a6=aS<j+(S+aF)}else{a6=0}a7=a6?a5|4:a5}else{a7=a5}if(!a_){a8=a7;break}aS=ay+(c[k>>2]=az,+g[k>>2]);aR=ax+(c[k>>2]=aA,+g[k>>2]);if(aS>=t&aS<t+(L+ay)&aR>=j){a9=aR<j+(S+ax)}else{a9=0}a8=a9?a7|8:a7}else{a8=a2}}while(0);do{if((a8&2|0)!=0){aR=(c[k>>2]=ao,+g[k>>2]);aS=(c[k>>2]=ap,+g[k>>2]);aL=an+aR;aK=am+aS;av=(aK>n?n:aK)-(aS<j?j:aS);aK=+g[114];aw=aS+am*aK-(j+S*aK);if((aL>T?T:aL)-(aR<t?t:aR)<=av){break}aR=+g[380];do{if(aw>aR){ba=+g[116]}else{if(aw>=aR){ba=aR;break}ba=-0.0- +g[116]}}while(0);g[f>>2]=Q-av*ba;if(aw<=+g[380]){break}do{if((c[386]&1|0)==0){if(y){c[z>>2]=9;break}else{c[z>>2]=21;break}}}while(0);L378:do{if(u){aQ(280)|0;if((a[B]&1)==0){break}a2=c[h>>2]|0;do{if((a2|0)==688){if((c[d+24>>2]|0)<=6){break L378}}else{if((a2|0)==736){if((c[d+24>>2]|0)>9){break}else{break L378}}else{if((a2|0)==728){break L378}else{break}}}}while(0);c[h>>2]=728;c[d+24>>2]=0;c[d+28>>2]=0}}while(0);a[x]=1}}while(0);do{if((a8&1|0)!=0){ba=(c[k>>2]=aV,+g[k>>2]);Q=(c[k>>2]=aW,+g[k>>2]);am=aU+ba;an=aT+Q;aw=(an>n?n:an)-(Q<j?j:Q);an=+g[114];av=Q+aT*an-(j+S*an);if((am>T?T:am)-(ba<t?t:ba)<=aw){break}ba=+g[380];do{if(av>ba){bb=+g[116]}else{if(av>=ba){bb=ba;break}bb=-0.0- +g[116]}}while(0);g[f>>2]=+g[f>>2]-aw*bb;if(av>=+g[380]){break}c[z>>2]=0;if((a[X]&1)==0){aQ(272)|0}a[w]=1}}while(0);do{if((a8&4|0)!=0){bb=(c[k>>2]=aD,+g[k>>2]);S=(c[k>>2]=aC,+g[k>>2]);aT=aE+bb;aU=aF+S;ba=(aT>T?T:aT)-(bb<t?t:bb);aT=+g[114];am=bb+aE*aT-(t+L*aT);if(ba>(aU>n?n:aU)-(S<j?j:S)){break}S=+g[380];do{if(am>S){bc=+g[116]}else{if(am>=S){bc=S;break}bc=-0.0- +g[116]}}while(0);g[e>>2]=+g[e>>2]-ba*bc;if(aF<=24.0){break}do{if((c[386]&1|0)==0){if((a[B]&1)==0){break}c[z>>2]=16}}while(0);a[i]=1;if(+g[10]>=0.0){break}a[d+64|0]=1}}while(0);do{if((a8&8|0)!=0){aF=(c[k>>2]=az,+g[k>>2]);bc=(c[k>>2]=aA,+g[k>>2]);aE=ay+aF;ba=ax+bc;S=(aE>T?T:aE)-(aF<t?t:aF);aE=+g[114];am=aF+ay*aE-(t+L*aE);if(S>(ba>n?n:ba)-(bc<j?j:bc)){break}bc=+g[380];do{if(am>bc){bd=+g[116]}else{if(am>=bc){bd=bc;break}bd=-0.0- +g[116]}}while(0);g[e>>2]=+g[e>>2]-S*bd;if(ax<=24.0){break}do{if((c[386]&1|0)==0){if((a[B]&1)==0){break}c[z>>2]=16}}while(0);a[i]=1;if(+g[10]<=0.0){break}a[d+64|0]=0}}while(0);do{if((a[x]&1)==0){if((a[i]&1)!=0){m=317;break}z=d+60|0;c[z>>2]=(c[z>>2]|0)+1}else{m=317}}while(0);if((m|0)==317){c[d+60>>2]=0}bC(d);L439:do{if((a[x]&1)==0){z=(a[B]&1)!=0;if(+g[D+4>>2]- +g[f>>2]>0.0){e=(z?520:856)|0;aA=d+16|0;if((c[aA>>2]|0)==(e|0)){break}c[aA>>2]=e;if((c[h>>2]|0)!=0){break}c[d+24>>2]=0;c[d+28>>2]=0;break}if(!z){z=d+16|0;if((c[z>>2]|0)==872){break}c[z>>2]=872;if((c[h>>2]|0)!=0){break}c[d+24>>2]=0;c[d+28>>2]=0;break}z=d+16|0;e=c[z>>2]|0;if((a[i]&1)==0){if((e|0)==584){break}c[z>>2]=584;if((c[h>>2]|0)!=0){break}c[d+24>>2]=0;c[d+28>>2]=0;break}if((e|0)==808){break}aQ(264)|0;if((c[z>>2]|0)==808){break}c[z>>2]=808;if((c[h>>2]|0)!=0){break}c[d+24>>2]=0;c[d+28>>2]=0}else{z=c[h>>2]|0;do{if((z|0)==688){if((c[d+24>>2]|0)<=6){break L439}}else{if((z|0)!=736){break}if((c[d+24>>2]|0)<=9){break L439}}}while(0);e=(a[B]&1)!=0;do{if(+g[10]!=0.0){aA=e?616:880;az=d+16|0;if((c[az>>2]|0)==(aA|0)){break}c[az>>2]=aA;if((z|0)!=0){break}c[d+24>>2]=0;c[d+28>>2]=0}else{aA=e?528:864;az=d+16|0;if((c[az>>2]|0)==(aA|0)){break}c[az>>2]=aA;if((z|0)!=0){break}c[d+24>>2]=0;c[d+28>>2]=0}}while(0);ax=+g[10];if(ax>0.0){a[d+64|0]=0;break}if(ax>=0.0){break}a[d+64|0]=1}}while(0);L478:do{if((c[386]&16&~c[384]|0)!=0){i=c[h>>2]|0;do{if((i|0)==688){if((c[d+24>>2]|0)<=6){break L478}}else{if((i|0)!=736){break}if((c[d+24>>2]|0)<=9){break L478}}}while(0);f=a[B]&1;if(f<<24>>24!=0){a[B]=f^1;c[A>>2]=1086324736;g[G>>2]=6.0;f=d+16|0;do{if((c[f>>2]|0)==864){m=377}else{c[f>>2]=864;if((i|0)!=0){m=377;break}D=d+24|0;c[D>>2]=0;x=d+28|0;c[x>>2]=0;be=D;bf=x;m=379}}while(0);do{if((m|0)==377){if((i|0)==736){break}be=d+24|0;bf=d+28|0;m=379}}while(0);if((m|0)==379){c[h>>2]=736;c[be>>2]=0;c[bf>>2]=0}aQ(256)|0;break}if(!(bE(d)|0)){aQ(240)|0;break}i=a[B]&1;a[B]=i^1;f=A;do{if(i<<24>>24==0){c[f>>2]=1096810496;g[G>>2]=28.0;x=d+16|0;do{if((c[x>>2]|0)==528){bg=c[h>>2]|0;m=362}else{c[x>>2]=528;D=c[h>>2]|0;if((D|0)!=0){bg=D;m=362;break}D=d+24|0;c[D>>2]=0;z=d+28|0;c[z>>2]=0;bh=D;bi=z}}while(0);if((m|0)==362){if((bg|0)==688){break}bh=d+24|0;bi=d+28|0}c[h>>2]=688;c[bh>>2]=0;c[bi>>2]=0}else{c[f>>2]=1086324736;g[G>>2]=6.0;x=d+16|0;do{if((c[x>>2]|0)==864){bj=c[h>>2]|0;m=369}else{c[x>>2]=864;z=c[h>>2]|0;if((z|0)!=0){bj=z;m=369;break}z=d+24|0;c[z>>2]=0;D=d+28|0;c[D>>2]=0;bk=z;bl=D}}while(0);if((m|0)==369){if((bj|0)==736){break}bk=d+24|0;bl=d+28|0}c[h>>2]=736;c[bk>>2]=0;c[bl>>2]=0}}while(0);aQ(256)|0}}while(0);bl=d+28|0;bk=(c[bl>>2]|0)+1|0;c[bl>>2]=bk;if((bk|0)<=5){return}c[bl>>2]=0;bl=d+24|0;bk=(c[bl>>2]|0)+1|0;c[bl>>2]=bk;bj=c[h>>2]|0;if((bj|0)==0){if((bk|0)!=(c[c[d+16>>2]>>2]|0)){return}c[bl>>2]=0;return}else{if((bk|0)!=(c[bj>>2]|0)){return}c[bl>>2]=0;c[h>>2]=0;return}}function bt(){return}function bu(){var a=0,b=0,d=0;a=c[422]|0;if((a|0)==2){br();if((c[386]&2048&~c[384]|0)==0){return}c[422]=1;bo();return}else if((a|0)==3){b=c[386]|0;d=~c[384];do{if((b&16&d|0)==0){if((b&1&d|0)!=0){break}return}}while(0);bo();c[422]=2;return}else if((a|0)==1){a=c[386]|0;d=~c[384];do{if((a&16&d|0)==0){if((a&1&d|0)!=0){break}return}}while(0);c[422]=2;return}else{return}}function bv(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,i=0.0,j=0,k=0.0,l=0.0,m=0.0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;b=((c[400]|0)/8|0)+1|0;d=((c[402]|0)/8|0)+1|0;e=c[(c[408]|0)+8+(a<<2)>>2]|0;f=c[e>>2]|0;h=c[e+4>>2]|0;i=(a|0)==0?.5:1.0;a=c[416]|0;j=c[418]|0;k=i*(+g[426]- +(a|0));l=i*(+g[427]- +(j|0));m=k<0.0?0.0:k;k=l<0.0?0.0:l;n=(~~+N(+m)+a|0)%8|0;a=~~(m*.125);o=(a|0)<0;p=o?0:a;a=~~(i*+(f-b|0))+1|0;q=(p|0)<(a|0);r=q?p:a;a=~~(k*.125);p=(a|0)<0;s=p?0:a;a=~~(i*+(h-d|0))+1|0;t=(s|0)<(a|0);u=t?p?0:(~~+N(+k)+j|0)%8|0:0;j=t?s:a;a=r+b|0;b=j+d|0;av(c[e+8>>2]|0,f|0,h|0,r|0,j|0,((a|0)>(f|0)?f:a)|0,((b|0)>(h|0)?h:b)|0,-1|0,(q?o?0:n:0)|0,u|0);return}function bw(a){a=a|0;var d=0,e=0,f=0,h=0,i=0,j=0.0,k=0,l=0.0,m=0.0,n=0.0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=((c[400]|0)/8|0)+1|0;e=((c[402]|0)/8|0)+1|0;f=c[(c[408]|0)+8+(a<<2)>>2]|0;h=c[f>>2]|0;i=c[f+4>>2]|0;j=(a|0)==0?.5:1.0;f=c[416]|0;k=c[418]|0;l=j*(+g[426]- +(f|0));m=j*(+g[427]- +(k|0));n=l<0.0?0.0:l;l=m<0.0?0.0:m;o=~~(n*.125);p=(o|0)<0;q=p?0:o;o=~~(j*+(h-d|0))+1|0;r=(q|0)<(o|0);s=r?q:o;o=~~(l*.125);q=(o|0)<0;t=q?0:o;o=~~(j*+(i-e|0))+1|0;u=(t|0)<(o|0);v=u?t:o;o=s+d|0;d=(o|0)>(h|0)?h:o;o=v+e|0;e=(o|0)>(i|0)?i:o;if((v|0)>=(e|0)){return}j=+N(+l);o=(s|0)<(d|0);i=r?p?4:4-((~~+N(+n)+f|0)%8|0)|0:4;f=u?q?4:4-((~~j+k|0)%8|0)|0:4;k=v;do{if(o){j=+(f+(k-v<<3)|0);q=s;do{u=c[(c[408]|0)+8+(a<<2)>>2]|0;p=($(c[u>>2]|0,k)|0)+q|0;r=b[(c[u+8>>2]|0)+(p<<1)>>1]|0;if((r<<16>>16|0)==1861){az(c[398]|0);w=c[816+((c[(c[406]|0)+88>>2]|0)+1<<2)>>2]|0;x=421}else if((r<<16>>16|0)==1862){az(c[398]|0);w=c[904+((c[(c[406]|0)+104>>2]|0)+1<<2)>>2]|0;x=421}else if((r<<16>>16|0)==1859){az(c[398]|0);w=c[472+((c[(c[406]|0)+80>>2]|0)+1<<2)>>2]|0;x=421}else if((r<<16>>16|0)==1860){az(c[398]|0);w=c[648+((c[(c[406]|0)+96>>2]|0)+1<<2)>>2]|0;x=421}else if((r<<16>>16|0)!=0){w=0;x=421}if((x|0)==421){x=0;aR(w|0,+(+(i+(q-s<<3)|0)),+j)}q=q+1|0;}while((q|0)<(d|0))}k=k+1|0;}while((k|0)<(e|0));return}function bx(){var a=0,b=0,d=0,e=0,f=0,h=0,j=0,l=0,m=0.0,n=0.0,o=0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0;a=i;i=i+8|0;b=a|0;d=b;e=i;i=i+128|0;aW(c[396]|0);f=c[408]|0;if((c[f+4>>2]|0)==3){h=f}else{f=0;while(1){bv(f);j=f+1|0;l=c[408]|0;if(j>>>0<((c[l+4>>2]|0)-3|0)>>>0){f=j}else{h=l;break}}}f=c[h+8>>2]|0;h=c[f>>2]|0;l=c[f+4>>2]|0;m=+(c[416]|0);n=+(c[418]|0);f=1704;j=c[f>>2]|0;o=c[f+4>>2]|0;c[b>>2]=j;c[b+4>>2]=o;p=(c[k>>2]=j,+g[k>>2])-m;g[b>>2]=p;j=d+4|0;m=(c[k>>2]=o,+g[k>>2])-n;g[j>>2]=m;if(p<0.0){c[b>>2]=0;q=0.0}else{q=p}if(m<0.0){g[j>>2]=0.0;r=0.0}else{r=m}m=+((h<<3)-(c[400]|0)|0);if(q>m){g[b>>2]=m;s=m}else{s=q}q=+((l<<3)-(c[402]|0)|0);if(r>q){g[j>>2]=q;t=q}else{t=r}r=+N(+s);g[b>>2]=r;g[j>>2]=+N(+t);j=c[412]|0;if((c[j+4>>2]|0)!=0){b=0;l=j;do{by(c[l+8+(b<<2)>>2]|0,d);b=b+1|0;l=c[412]|0;}while(b>>>0<(c[l+4>>2]|0)>>>0)}l=c[410]|0;if((c[l+4>>2]|0)!=0){b=0;j=l;do{bz(c[j+8+(b<<2)>>2]|0,d);b=b+1|0;j=c[410]|0;}while(b>>>0<(c[j+4>>2]|0)>>>0)}bA(c[406]|0,d);bw((c[(c[408]|0)+4>>2]|0)-1|0);aW(c[396]|0);bv((c[(c[408]|0)+4>>2]|0)-3|0);d=e|0;e=c[406]|0;j=(c[392]|0)-(c[e+76>>2]|0)|0;aD(d|0,48,(u=i,i=i+16|0,c[u>>2]=c[e+72>>2],c[u+8>>2]=j,u)|0)|0;aV(111,130,228,255);ar(d|0,32.0,17.0,23,304);aV(214,235,255,255);ar(d|0,32.0,16.0,23,304);j=c[390]|0;aD(d|0,48,(u=i,i=i+16|0,c[u>>2]=c[(c[406]|0)+68>>2],c[u+8>>2]=j,u)|0)|0;aV(199,133,0,255);am(d|0,288.0,17.0,23,304);aV(255,227,0,255);am(d|0,288.0,16.0,23,304);aW(c[414]|0);a$(0,0.0,0.0);a$(1,288.0,0.0);i=a;return}function by(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0.0,l=0;aW(c[424]|0);e=c[b+12>>2]|0;f=(e|0)!=0;h=(c[b+16>>2]|0)+1|0;if((a[b+41|0]&1)==0){if(f){i=e}else{i=c[b+8>>2]|0}j=c[i+(h<<2)>>2]|0;k=+N(+(+g[b>>2]- +g[b+24>>2]- +g[d>>2]));a$(j|0,+k,+(+N(+(+g[b+4>>2]- +g[b+28>>2]- +g[d+4>>2]))));return}else{if(f){l=e}else{l=c[b+8>>2]|0}e=c[l+(h<<2)>>2]|0;k=+N(+(+g[b>>2]- +g[b+24>>2]- +g[d>>2]));aZ(e|0,+k,+(+N(+(+g[b+4>>2]- +g[b+28>>2]- +g[d+4>>2]))));return}}function bz(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0.0,l=0;aW(c[424]|0);e=c[b+12>>2]|0;f=(e|0)!=0;h=(c[b+16>>2]|0)+1|0;if((a[b+41|0]&1)==0){if(f){i=e}else{i=c[b+8>>2]|0}j=c[i+(h<<2)>>2]|0;k=+N(+(+g[b>>2]- +g[b+24>>2]- +g[d>>2]));a$(j|0,+k,+(+N(+(+g[b+4>>2]- +g[b+28>>2]- +g[d+4>>2]))));return}else{if(f){l=e}else{l=c[b+8>>2]|0}e=c[l+(h<<2)>>2]|0;k=+N(+(+g[b>>2]- +g[b+24>>2]- +g[d>>2]));aZ(e|0,+k,+(+N(+(+g[b+4>>2]- +g[b+28>>2]- +g[d+4>>2]))));return}}function bA(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0.0,l=0;aW(c[404]|0);e=c[b+20>>2]|0;f=(e|0)!=0;h=(c[b+24>>2]|0)+1|0;if((a[b+64|0]&1)==0){if(f){i=e}else{i=c[b+16>>2]|0}j=c[i+(h<<2)>>2]|0;k=+N(+(+g[b>>2]- +g[b+32>>2]- +g[d>>2]));a$(j|0,+k,+(+N(+(+g[b+4>>2]- +g[b+36>>2]- +g[d+4>>2]))));return}else{if(f){l=e}else{l=c[b+16>>2]|0}e=c[l+(h<<2)>>2]|0;k=+N(+(+g[b>>2]- +g[b+32>>2]- +g[d>>2]));aZ(e|0,+k,+(+N(+(+g[b+4>>2]- +g[b+36>>2]- +g[d+4>>2]))));return}}function bB(){var a=0,b=0,d=0;a=i;i=i+64|0;b=a|0;d=c[422]|0;if((d|0)==1){aW(c[394]|0);aw(0.0,0.0);i=a;return}else if((d|0)==2){bx();i=a;return}else if((d|0)==3){aW(c[388]|0);aw(0.0,0.0);d=b|0;b=c[390]|0;aD(d|0,48,(u=i,i=i+16|0,c[u>>2]=c[(c[406]|0)+68>>2],c[u+8>>2]=b,u)|0)|0;aV(199,133,0,255);ar(d|0,104.0,152.0,46,304);aV(255,227,0,255);ar(d|0,104.0,150.0,46,304);i=a;return}else{i=a;return}}function bC(a){a=a|0;var d=0,e=0,f=0.0,h=0.0,i=0.0,j=0.0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0,u=0,v=0.0;d=a+40|0;e=a;f=+g[e>>2]-(+g[d>>2]+2.0)*+g[114];h=+g[e+4>>2]-(+g[a+44>>2]+2.0);e=d;i=+g[e>>2]+2.0;j=+g[e+4>>2]+2.0;e=c[408]|0;d=(c[e+4>>2]|0)-1|0;k=~~+N(+f)>>3;l=~~+N(+h)>>3;m=(~~+_(+(f+i))>>3)+1|0;n=(~~+_(+(h+j))>>3)+1|0;o=c[e+8+(d<<2)>>2]|0;e=c[o>>2]|0;p=c[o+4>>2]|0;o=(k|0)<0?0:k;k=(l|0)<0?0:l;l=(m|0)<0?0:m;m=(n|0)<0?0:n;n=e-1|0;q=(o|0)<(e|0)?o:n;o=p-1|0;r=(k|0)<(p|0)?k:o;k=(l|0)<(e|0)?l:n;n=(m|0)<(p|0)?m:o;if((r|0)>=(n|0)){return}o=(q|0)<(k|0);s=f+(i+8.0);i=h+(j+8.0);m=a+68|0;p=a+72|0;a=r;do{if(o){j=+(a<<3|0)+8.0;r=j>=h;l=q;do{e=c[(c[408]|0)+8+(d<<2)>>2]|0;t=($(c[e>>2]|0,a)|0)+l|0;u=(c[e+8>>2]|0)+(t<<1)|0;t=b[u>>1]|0;do{if((t-1859&65535)<4){v=+(l<<3|0)+8.0;if(j>=i|v>=f&v<s&r^1){break}b[u>>1]=0;if((t<<16>>16|0)==1862|(t<<16>>16|0)==1860){aQ(208)|0;c[p>>2]=(c[p>>2]|0)+1;break}else if(!((t<<16>>16|0)==1861|(t<<16>>16|0)==1859)){break}aQ(224)|0;e=(c[m>>2]|0)+1|0;c[m>>2]=e;if((e|0)!=(c[390]|0)){break}aQ(56)|0}}while(0);l=l+1|0;}while((l|0)<(k|0))}a=a+1|0;}while((a|0)<(n|0));return}function bD(){c[368]=1065353216;g[369]=1.0;g[370]=1.0;c[376]=1065353216;g[377]=1.0;g[378]=1.0;c[372]=0;g[373]=0.0;g[374]=0.0;return}function bE(d){d=d|0;var e=0,f=0.0,h=0.0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0.0,v=0,w=0;e=d;f=+g[e>>2]- +g[114]*14.0;h=+g[e+4>>2]+-28.0;e=c[408]|0;i=(c[e+4>>2]|0)-2|0;j=~~+N(+f)>>3;k=~~+N(+h)>>3;l=(~~+_(+(f+14.0))>>3)+1|0;m=(~~+_(+(h+28.0))>>3)+1|0;n=c[e+8+(i<<2)>>2]|0;e=c[n>>2]|0;o=c[n+4>>2]|0;n=(j|0)<0?0:j;j=(k|0)<0?0:k;k=(l|0)<0?0:l;l=(m|0)<0?0:m;m=e-1|0;p=(n|0)<(e|0)?n:m;n=o-1|0;q=(j|0)<(o|0)?j:n;j=(k|0)<(e|0)?k:m;m=(l|0)<(o|0)?l:n;n=d+48|0;a[d+49|0]=a[n]&1;a[n]=0;if((q|0)>=(m|0)){r=1;return r|0}n=(p|0)<(j|0);d=(c[408]|0)+8+(i<<2)|0;s=f+22.0;t=h+36.0;i=q;L672:while(1){L674:do{if(n){q=c[d>>2]|0;l=$(c[q>>2]|0,i)|0;o=c[q+8>>2]|0;u=+(i<<3|0)+8.0;q=u<t;if(u<h){k=p;while(1){k=k+1|0;if((k|0)>=(j|0)){break L674}}}else{v=p}do{if(((b[o+(l+v<<1)>>1]|0)-1857&65535)<2){u=+(v<<3|0)+8.0;if(u>=f&u<s&q){r=0;w=508;break L672}}v=v+1|0;}while((v|0)<(j|0))}}while(0);q=i+1|0;if((q|0)<(m|0)){i=q}else{r=1;w=509;break}}if((w|0)==508){return r|0}else if((w|0)==509){return r|0}return 0}function bF(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,ao=0,ap=0,aq=0,ar=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aJ=0;do{if(a>>>0<245){if(a>>>0<11){b=16}else{b=a+11&-8}d=b>>>3;e=c[250]|0;f=e>>>(d>>>0);if((f&3|0)!=0){g=(f&1^1)+d|0;h=g<<1;i=1040+(h<<2)|0;j=1040+(h+2<<2)|0;h=c[j>>2]|0;k=h+8|0;l=c[k>>2]|0;do{if((i|0)==(l|0)){c[250]=e&~(1<<g)}else{if(l>>>0<(c[254]|0)>>>0){as();return 0}m=l+12|0;if((c[m>>2]|0)==(h|0)){c[m>>2]=i;c[j>>2]=l;break}else{as();return 0}}}while(0);l=g<<3;c[h+4>>2]=l|3;j=h+(l|4)|0;c[j>>2]=c[j>>2]|1;n=k;return n|0}if(b>>>0<=(c[252]|0)>>>0){o=b;break}if((f|0)!=0){j=2<<d;l=f<<d&(j|-j);j=(l&-l)-1|0;l=j>>>12&16;i=j>>>(l>>>0);j=i>>>5&8;m=i>>>(j>>>0);i=m>>>2&4;p=m>>>(i>>>0);m=p>>>1&2;q=p>>>(m>>>0);p=q>>>1&1;r=(j|l|i|m|p)+(q>>>(p>>>0))|0;p=r<<1;q=1040+(p<<2)|0;m=1040+(p+2<<2)|0;p=c[m>>2]|0;i=p+8|0;l=c[i>>2]|0;do{if((q|0)==(l|0)){c[250]=e&~(1<<r)}else{if(l>>>0<(c[254]|0)>>>0){as();return 0}j=l+12|0;if((c[j>>2]|0)==(p|0)){c[j>>2]=q;c[m>>2]=l;break}else{as();return 0}}}while(0);l=r<<3;m=l-b|0;c[p+4>>2]=b|3;q=p;e=q+b|0;c[q+(b|4)>>2]=m|1;c[q+l>>2]=m;l=c[252]|0;if((l|0)!=0){q=c[255]|0;d=l>>>3;l=d<<1;f=1040+(l<<2)|0;k=c[250]|0;h=1<<d;do{if((k&h|0)==0){c[250]=k|h;s=f;t=1040+(l+2<<2)|0}else{d=1040+(l+2<<2)|0;g=c[d>>2]|0;if(g>>>0>=(c[254]|0)>>>0){s=g;t=d;break}as();return 0}}while(0);c[t>>2]=q;c[s+12>>2]=q;c[q+8>>2]=s;c[q+12>>2]=f}c[252]=m;c[255]=e;n=i;return n|0}l=c[251]|0;if((l|0)==0){o=b;break}h=(l&-l)-1|0;l=h>>>12&16;k=h>>>(l>>>0);h=k>>>5&8;p=k>>>(h>>>0);k=p>>>2&4;r=p>>>(k>>>0);p=r>>>1&2;d=r>>>(p>>>0);r=d>>>1&1;g=c[1304+((h|l|k|p|r)+(d>>>(r>>>0))<<2)>>2]|0;r=g;d=g;p=(c[g+4>>2]&-8)-b|0;while(1){g=c[r+16>>2]|0;if((g|0)==0){k=c[r+20>>2]|0;if((k|0)==0){break}else{u=k}}else{u=g}g=(c[u+4>>2]&-8)-b|0;k=g>>>0<p>>>0;r=u;d=k?u:d;p=k?g:p}r=d;i=c[254]|0;if(r>>>0<i>>>0){as();return 0}e=r+b|0;m=e;if(r>>>0>=e>>>0){as();return 0}e=c[d+24>>2]|0;f=c[d+12>>2]|0;do{if((f|0)==(d|0)){q=d+20|0;g=c[q>>2]|0;if((g|0)==0){k=d+16|0;l=c[k>>2]|0;if((l|0)==0){v=0;break}else{w=l;x=k}}else{w=g;x=q}while(1){q=w+20|0;g=c[q>>2]|0;if((g|0)!=0){w=g;x=q;continue}q=w+16|0;g=c[q>>2]|0;if((g|0)==0){break}else{w=g;x=q}}if(x>>>0<i>>>0){as();return 0}else{c[x>>2]=0;v=w;break}}else{q=c[d+8>>2]|0;if(q>>>0<i>>>0){as();return 0}g=q+12|0;if((c[g>>2]|0)!=(d|0)){as();return 0}k=f+8|0;if((c[k>>2]|0)==(d|0)){c[g>>2]=f;c[k>>2]=q;v=f;break}else{as();return 0}}}while(0);L889:do{if((e|0)!=0){f=d+28|0;i=1304+(c[f>>2]<<2)|0;do{if((d|0)==(c[i>>2]|0)){c[i>>2]=v;if((v|0)!=0){break}c[251]=c[251]&~(1<<c[f>>2]);break L889}else{if(e>>>0<(c[254]|0)>>>0){as();return 0}q=e+16|0;if((c[q>>2]|0)==(d|0)){c[q>>2]=v}else{c[e+20>>2]=v}if((v|0)==0){break L889}}}while(0);if(v>>>0<(c[254]|0)>>>0){as();return 0}c[v+24>>2]=e;f=c[d+16>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[254]|0)>>>0){as();return 0}else{c[v+16>>2]=f;c[f+24>>2]=v;break}}}while(0);f=c[d+20>>2]|0;if((f|0)==0){break}if(f>>>0<(c[254]|0)>>>0){as();return 0}else{c[v+20>>2]=f;c[f+24>>2]=v;break}}}while(0);if(p>>>0<16){e=p+b|0;c[d+4>>2]=e|3;f=r+(e+4)|0;c[f>>2]=c[f>>2]|1}else{c[d+4>>2]=b|3;c[r+(b|4)>>2]=p|1;c[r+(p+b)>>2]=p;f=c[252]|0;if((f|0)!=0){e=c[255]|0;i=f>>>3;f=i<<1;q=1040+(f<<2)|0;k=c[250]|0;g=1<<i;do{if((k&g|0)==0){c[250]=k|g;y=q;z=1040+(f+2<<2)|0}else{i=1040+(f+2<<2)|0;l=c[i>>2]|0;if(l>>>0>=(c[254]|0)>>>0){y=l;z=i;break}as();return 0}}while(0);c[z>>2]=e;c[y+12>>2]=e;c[e+8>>2]=y;c[e+12>>2]=q}c[252]=p;c[255]=m}f=d+8|0;if((f|0)==0){o=b;break}else{n=f}return n|0}else{if(a>>>0>4294967231){o=-1;break}f=a+11|0;g=f&-8;k=c[251]|0;if((k|0)==0){o=g;break}r=-g|0;i=f>>>8;do{if((i|0)==0){A=0}else{if(g>>>0>16777215){A=31;break}f=(i+1048320|0)>>>16&8;l=i<<f;h=(l+520192|0)>>>16&4;j=l<<h;l=(j+245760|0)>>>16&2;B=14-(h|f|l)+(j<<l>>>15)|0;A=g>>>((B+7|0)>>>0)&1|B<<1}}while(0);i=c[1304+(A<<2)>>2]|0;L697:do{if((i|0)==0){C=0;D=r;E=0}else{if((A|0)==31){F=0}else{F=25-(A>>>1)|0}d=0;m=r;p=i;q=g<<F;e=0;while(1){B=c[p+4>>2]&-8;l=B-g|0;if(l>>>0<m>>>0){if((B|0)==(g|0)){C=p;D=l;E=p;break L697}else{G=p;H=l}}else{G=d;H=m}l=c[p+20>>2]|0;B=c[p+16+(q>>>31<<2)>>2]|0;j=(l|0)==0|(l|0)==(B|0)?e:l;if((B|0)==0){C=G;D=H;E=j;break}else{d=G;m=H;p=B;q=q<<1;e=j}}}}while(0);if((E|0)==0&(C|0)==0){i=2<<A;r=k&(i|-i);if((r|0)==0){o=g;break}i=(r&-r)-1|0;r=i>>>12&16;e=i>>>(r>>>0);i=e>>>5&8;q=e>>>(i>>>0);e=q>>>2&4;p=q>>>(e>>>0);q=p>>>1&2;m=p>>>(q>>>0);p=m>>>1&1;I=c[1304+((i|r|e|q|p)+(m>>>(p>>>0))<<2)>>2]|0}else{I=E}if((I|0)==0){J=D;K=C}else{p=I;m=D;q=C;while(1){e=(c[p+4>>2]&-8)-g|0;r=e>>>0<m>>>0;i=r?e:m;e=r?p:q;r=c[p+16>>2]|0;if((r|0)!=0){p=r;m=i;q=e;continue}r=c[p+20>>2]|0;if((r|0)==0){J=i;K=e;break}else{p=r;m=i;q=e}}}if((K|0)==0){o=g;break}if(J>>>0>=((c[252]|0)-g|0)>>>0){o=g;break}q=K;m=c[254]|0;if(q>>>0<m>>>0){as();return 0}p=q+g|0;k=p;if(q>>>0>=p>>>0){as();return 0}e=c[K+24>>2]|0;i=c[K+12>>2]|0;do{if((i|0)==(K|0)){r=K+20|0;d=c[r>>2]|0;if((d|0)==0){j=K+16|0;B=c[j>>2]|0;if((B|0)==0){L=0;break}else{M=B;N=j}}else{M=d;N=r}while(1){r=M+20|0;d=c[r>>2]|0;if((d|0)!=0){M=d;N=r;continue}r=M+16|0;d=c[r>>2]|0;if((d|0)==0){break}else{M=d;N=r}}if(N>>>0<m>>>0){as();return 0}else{c[N>>2]=0;L=M;break}}else{r=c[K+8>>2]|0;if(r>>>0<m>>>0){as();return 0}d=r+12|0;if((c[d>>2]|0)!=(K|0)){as();return 0}j=i+8|0;if((c[j>>2]|0)==(K|0)){c[d>>2]=i;c[j>>2]=r;L=i;break}else{as();return 0}}}while(0);L747:do{if((e|0)!=0){i=K+28|0;m=1304+(c[i>>2]<<2)|0;do{if((K|0)==(c[m>>2]|0)){c[m>>2]=L;if((L|0)!=0){break}c[251]=c[251]&~(1<<c[i>>2]);break L747}else{if(e>>>0<(c[254]|0)>>>0){as();return 0}r=e+16|0;if((c[r>>2]|0)==(K|0)){c[r>>2]=L}else{c[e+20>>2]=L}if((L|0)==0){break L747}}}while(0);if(L>>>0<(c[254]|0)>>>0){as();return 0}c[L+24>>2]=e;i=c[K+16>>2]|0;do{if((i|0)!=0){if(i>>>0<(c[254]|0)>>>0){as();return 0}else{c[L+16>>2]=i;c[i+24>>2]=L;break}}}while(0);i=c[K+20>>2]|0;if((i|0)==0){break}if(i>>>0<(c[254]|0)>>>0){as();return 0}else{c[L+20>>2]=i;c[i+24>>2]=L;break}}}while(0);do{if(J>>>0<16){e=J+g|0;c[K+4>>2]=e|3;i=q+(e+4)|0;c[i>>2]=c[i>>2]|1}else{c[K+4>>2]=g|3;c[q+(g|4)>>2]=J|1;c[q+(J+g)>>2]=J;i=J>>>3;if(J>>>0<256){e=i<<1;m=1040+(e<<2)|0;r=c[250]|0;j=1<<i;do{if((r&j|0)==0){c[250]=r|j;O=m;P=1040+(e+2<<2)|0}else{i=1040+(e+2<<2)|0;d=c[i>>2]|0;if(d>>>0>=(c[254]|0)>>>0){O=d;P=i;break}as();return 0}}while(0);c[P>>2]=k;c[O+12>>2]=k;c[q+(g+8)>>2]=O;c[q+(g+12)>>2]=m;break}e=p;j=J>>>8;do{if((j|0)==0){Q=0}else{if(J>>>0>16777215){Q=31;break}r=(j+1048320|0)>>>16&8;i=j<<r;d=(i+520192|0)>>>16&4;B=i<<d;i=(B+245760|0)>>>16&2;l=14-(d|r|i)+(B<<i>>>15)|0;Q=J>>>((l+7|0)>>>0)&1|l<<1}}while(0);j=1304+(Q<<2)|0;c[q+(g+28)>>2]=Q;c[q+(g+20)>>2]=0;c[q+(g+16)>>2]=0;m=c[251]|0;l=1<<Q;if((m&l|0)==0){c[251]=m|l;c[j>>2]=e;c[q+(g+24)>>2]=j;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}if((Q|0)==31){R=0}else{R=25-(Q>>>1)|0}l=J<<R;m=c[j>>2]|0;while(1){if((c[m+4>>2]&-8|0)==(J|0)){break}S=m+16+(l>>>31<<2)|0;j=c[S>>2]|0;if((j|0)==0){T=660;break}else{l=l<<1;m=j}}if((T|0)==660){if(S>>>0<(c[254]|0)>>>0){as();return 0}else{c[S>>2]=e;c[q+(g+24)>>2]=m;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}}l=m+8|0;j=c[l>>2]|0;i=c[254]|0;if(m>>>0<i>>>0){as();return 0}if(j>>>0<i>>>0){as();return 0}else{c[j+12>>2]=e;c[l>>2]=e;c[q+(g+8)>>2]=j;c[q+(g+12)>>2]=m;c[q+(g+24)>>2]=0;break}}}while(0);q=K+8|0;if((q|0)==0){o=g;break}else{n=q}return n|0}}while(0);K=c[252]|0;if(o>>>0<=K>>>0){S=K-o|0;J=c[255]|0;if(S>>>0>15){R=J;c[255]=R+o;c[252]=S;c[R+(o+4)>>2]=S|1;c[R+K>>2]=S;c[J+4>>2]=o|3}else{c[252]=0;c[255]=0;c[J+4>>2]=K|3;S=J+(K+4)|0;c[S>>2]=c[S>>2]|1}n=J+8|0;return n|0}J=c[253]|0;if(o>>>0<J>>>0){S=J-o|0;c[253]=S;J=c[256]|0;K=J;c[256]=K+o;c[K+(o+4)>>2]=S|1;c[J+4>>2]=o|3;n=J+8|0;return n|0}do{if((c[244]|0)==0){J=aI(8)|0;if((J-1&J|0)==0){c[246]=J;c[245]=J;c[247]=-1;c[248]=2097152;c[249]=0;c[361]=0;c[244]=(aM(0)|0)&-16^1431655768;break}else{as();return 0}}}while(0);J=o+48|0;S=c[246]|0;K=o+47|0;R=S+K|0;Q=-S|0;S=R&Q;if(S>>>0<=o>>>0){n=0;return n|0}O=c[360]|0;do{if((O|0)!=0){P=c[358]|0;L=P+S|0;if(L>>>0<=P>>>0|L>>>0>O>>>0){n=0}else{break}return n|0}}while(0);L956:do{if((c[361]&4|0)==0){O=c[256]|0;L958:do{if((O|0)==0){T=690}else{L=O;P=1448;while(1){U=P|0;M=c[U>>2]|0;if(M>>>0<=L>>>0){V=P+4|0;if((M+(c[V>>2]|0)|0)>>>0>L>>>0){break}}M=c[P+8>>2]|0;if((M|0)==0){T=690;break L958}else{P=M}}if((P|0)==0){T=690;break}L=R-(c[253]|0)&Q;if(L>>>0>=2147483647){W=0;break}m=aU(L|0)|0;e=(m|0)==((c[U>>2]|0)+(c[V>>2]|0)|0);X=e?m:-1;Y=e?L:0;Z=m;_=L;T=699}}while(0);do{if((T|0)==690){O=aU(0)|0;if((O|0)==-1){W=0;break}g=O;L=c[245]|0;m=L-1|0;if((m&g|0)==0){$=S}else{$=S-g+(m+g&-L)|0}L=c[358]|0;g=L+$|0;if(!($>>>0>o>>>0&$>>>0<2147483647)){W=0;break}m=c[360]|0;if((m|0)!=0){if(g>>>0<=L>>>0|g>>>0>m>>>0){W=0;break}}m=aU($|0)|0;g=(m|0)==(O|0);X=g?O:-1;Y=g?$:0;Z=m;_=$;T=699}}while(0);L978:do{if((T|0)==699){m=-_|0;if((X|0)!=-1){aa=Y;ab=X;T=710;break L956}do{if((Z|0)!=-1&_>>>0<2147483647&_>>>0<J>>>0){g=c[246]|0;O=K-_+g&-g;if(O>>>0>=2147483647){ac=_;break}if((aU(O|0)|0)==-1){aU(m|0)|0;W=Y;break L978}else{ac=O+_|0;break}}else{ac=_}}while(0);if((Z|0)==-1){W=Y}else{aa=ac;ab=Z;T=710;break L956}}}while(0);c[361]=c[361]|4;ad=W;T=707}else{ad=0;T=707}}while(0);do{if((T|0)==707){if(S>>>0>=2147483647){break}W=aU(S|0)|0;Z=aU(0)|0;if(!((Z|0)!=-1&(W|0)!=-1&W>>>0<Z>>>0)){break}ac=Z-W|0;Z=ac>>>0>(o+40|0)>>>0;Y=Z?W:-1;if((Y|0)!=-1){aa=Z?ac:ad;ab=Y;T=710}}}while(0);do{if((T|0)==710){ad=(c[358]|0)+aa|0;c[358]=ad;if(ad>>>0>(c[359]|0)>>>0){c[359]=ad}ad=c[256]|0;L998:do{if((ad|0)==0){S=c[254]|0;if((S|0)==0|ab>>>0<S>>>0){c[254]=ab}c[362]=ab;c[363]=aa;c[365]=0;c[259]=c[244];c[258]=-1;S=0;do{Y=S<<1;ac=1040+(Y<<2)|0;c[1040+(Y+3<<2)>>2]=ac;c[1040+(Y+2<<2)>>2]=ac;S=S+1|0;}while(S>>>0<32);S=ab+8|0;if((S&7|0)==0){ae=0}else{ae=-S&7}S=aa-40-ae|0;c[256]=ab+ae;c[253]=S;c[ab+(ae+4)>>2]=S|1;c[ab+(aa-36)>>2]=40;c[257]=c[248]}else{S=1448;while(1){af=c[S>>2]|0;ag=S+4|0;ah=c[ag>>2]|0;if((ab|0)==(af+ah|0)){T=722;break}ac=c[S+8>>2]|0;if((ac|0)==0){break}else{S=ac}}do{if((T|0)==722){if((c[S+12>>2]&8|0)!=0){break}ac=ad;if(!(ac>>>0>=af>>>0&ac>>>0<ab>>>0)){break}c[ag>>2]=ah+aa;ac=c[256]|0;Y=(c[253]|0)+aa|0;Z=ac;W=ac+8|0;if((W&7|0)==0){ai=0}else{ai=-W&7}W=Y-ai|0;c[256]=Z+ai;c[253]=W;c[Z+(ai+4)>>2]=W|1;c[Z+(Y+4)>>2]=40;c[257]=c[248];break L998}}while(0);if(ab>>>0<(c[254]|0)>>>0){c[254]=ab}S=ab+aa|0;Y=1448;while(1){aj=Y|0;if((c[aj>>2]|0)==(S|0)){T=732;break}Z=c[Y+8>>2]|0;if((Z|0)==0){break}else{Y=Z}}do{if((T|0)==732){if((c[Y+12>>2]&8|0)!=0){break}c[aj>>2]=ab;S=Y+4|0;c[S>>2]=(c[S>>2]|0)+aa;S=ab+8|0;if((S&7|0)==0){ak=0}else{ak=-S&7}S=ab+(aa+8)|0;if((S&7|0)==0){al=0}else{al=-S&7}S=ab+(al+aa)|0;Z=S;W=ak+o|0;ac=ab+W|0;_=ac;K=S-(ab+ak)-o|0;c[ab+(ak+4)>>2]=o|3;do{if((Z|0)==(c[256]|0)){J=(c[253]|0)+K|0;c[253]=J;c[256]=_;c[ab+(W+4)>>2]=J|1}else{if((Z|0)==(c[255]|0)){J=(c[252]|0)+K|0;c[252]=J;c[255]=_;c[ab+(W+4)>>2]=J|1;c[ab+(J+W)>>2]=J;break}J=aa+4|0;X=c[ab+(J+al)>>2]|0;if((X&3|0)==1){$=X&-8;V=X>>>3;L1043:do{if(X>>>0<256){U=c[ab+((al|8)+aa)>>2]|0;Q=c[ab+(aa+12+al)>>2]|0;R=1040+(V<<1<<2)|0;do{if((U|0)!=(R|0)){if(U>>>0<(c[254]|0)>>>0){as();return 0}if((c[U+12>>2]|0)==(Z|0)){break}as();return 0}}while(0);if((Q|0)==(U|0)){c[250]=c[250]&~(1<<V);break}do{if((Q|0)==(R|0)){am=Q+8|0}else{if(Q>>>0<(c[254]|0)>>>0){as();return 0}m=Q+8|0;if((c[m>>2]|0)==(Z|0)){am=m;break}as();return 0}}while(0);c[U+12>>2]=Q;c[am>>2]=U}else{R=S;m=c[ab+((al|24)+aa)>>2]|0;P=c[ab+(aa+12+al)>>2]|0;do{if((P|0)==(R|0)){O=al|16;g=ab+(J+O)|0;L=c[g>>2]|0;if((L|0)==0){e=ab+(O+aa)|0;O=c[e>>2]|0;if((O|0)==0){ao=0;break}else{ap=O;aq=e}}else{ap=L;aq=g}while(1){g=ap+20|0;L=c[g>>2]|0;if((L|0)!=0){ap=L;aq=g;continue}g=ap+16|0;L=c[g>>2]|0;if((L|0)==0){break}else{ap=L;aq=g}}if(aq>>>0<(c[254]|0)>>>0){as();return 0}else{c[aq>>2]=0;ao=ap;break}}else{g=c[ab+((al|8)+aa)>>2]|0;if(g>>>0<(c[254]|0)>>>0){as();return 0}L=g+12|0;if((c[L>>2]|0)!=(R|0)){as();return 0}e=P+8|0;if((c[e>>2]|0)==(R|0)){c[L>>2]=P;c[e>>2]=g;ao=P;break}else{as();return 0}}}while(0);if((m|0)==0){break}P=ab+(aa+28+al)|0;U=1304+(c[P>>2]<<2)|0;do{if((R|0)==(c[U>>2]|0)){c[U>>2]=ao;if((ao|0)!=0){break}c[251]=c[251]&~(1<<c[P>>2]);break L1043}else{if(m>>>0<(c[254]|0)>>>0){as();return 0}Q=m+16|0;if((c[Q>>2]|0)==(R|0)){c[Q>>2]=ao}else{c[m+20>>2]=ao}if((ao|0)==0){break L1043}}}while(0);if(ao>>>0<(c[254]|0)>>>0){as();return 0}c[ao+24>>2]=m;R=al|16;P=c[ab+(R+aa)>>2]|0;do{if((P|0)!=0){if(P>>>0<(c[254]|0)>>>0){as();return 0}else{c[ao+16>>2]=P;c[P+24>>2]=ao;break}}}while(0);P=c[ab+(J+R)>>2]|0;if((P|0)==0){break}if(P>>>0<(c[254]|0)>>>0){as();return 0}else{c[ao+20>>2]=P;c[P+24>>2]=ao;break}}}while(0);ar=ab+(($|al)+aa)|0;at=$+K|0}else{ar=Z;at=K}J=ar+4|0;c[J>>2]=c[J>>2]&-2;c[ab+(W+4)>>2]=at|1;c[ab+(at+W)>>2]=at;J=at>>>3;if(at>>>0<256){V=J<<1;X=1040+(V<<2)|0;P=c[250]|0;m=1<<J;do{if((P&m|0)==0){c[250]=P|m;au=X;av=1040+(V+2<<2)|0}else{J=1040+(V+2<<2)|0;U=c[J>>2]|0;if(U>>>0>=(c[254]|0)>>>0){au=U;av=J;break}as();return 0}}while(0);c[av>>2]=_;c[au+12>>2]=_;c[ab+(W+8)>>2]=au;c[ab+(W+12)>>2]=X;break}V=ac;m=at>>>8;do{if((m|0)==0){aw=0}else{if(at>>>0>16777215){aw=31;break}P=(m+1048320|0)>>>16&8;$=m<<P;J=($+520192|0)>>>16&4;U=$<<J;$=(U+245760|0)>>>16&2;Q=14-(J|P|$)+(U<<$>>>15)|0;aw=at>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=1304+(aw<<2)|0;c[ab+(W+28)>>2]=aw;c[ab+(W+20)>>2]=0;c[ab+(W+16)>>2]=0;X=c[251]|0;Q=1<<aw;if((X&Q|0)==0){c[251]=X|Q;c[m>>2]=V;c[ab+(W+24)>>2]=m;c[ab+(W+12)>>2]=V;c[ab+(W+8)>>2]=V;break}if((aw|0)==31){ax=0}else{ax=25-(aw>>>1)|0}Q=at<<ax;X=c[m>>2]|0;while(1){if((c[X+4>>2]&-8|0)==(at|0)){break}ay=X+16+(Q>>>31<<2)|0;m=c[ay>>2]|0;if((m|0)==0){T=805;break}else{Q=Q<<1;X=m}}if((T|0)==805){if(ay>>>0<(c[254]|0)>>>0){as();return 0}else{c[ay>>2]=V;c[ab+(W+24)>>2]=X;c[ab+(W+12)>>2]=V;c[ab+(W+8)>>2]=V;break}}Q=X+8|0;m=c[Q>>2]|0;$=c[254]|0;if(X>>>0<$>>>0){as();return 0}if(m>>>0<$>>>0){as();return 0}else{c[m+12>>2]=V;c[Q>>2]=V;c[ab+(W+8)>>2]=m;c[ab+(W+12)>>2]=X;c[ab+(W+24)>>2]=0;break}}}while(0);n=ab+(ak|8)|0;return n|0}}while(0);Y=ad;W=1448;while(1){az=c[W>>2]|0;if(az>>>0<=Y>>>0){aA=c[W+4>>2]|0;aB=az+aA|0;if(aB>>>0>Y>>>0){break}}W=c[W+8>>2]|0}W=az+(aA-39)|0;if((W&7|0)==0){aC=0}else{aC=-W&7}W=az+(aA-47+aC)|0;ac=W>>>0<(ad+16|0)>>>0?Y:W;W=ac+8|0;_=ab+8|0;if((_&7|0)==0){aD=0}else{aD=-_&7}_=aa-40-aD|0;c[256]=ab+aD;c[253]=_;c[ab+(aD+4)>>2]=_|1;c[ab+(aa-36)>>2]=40;c[257]=c[248];c[ac+4>>2]=27;c[W>>2]=c[362];c[W+4>>2]=c[1452>>2];c[W+8>>2]=c[1456>>2];c[W+12>>2]=c[1460>>2];c[362]=ab;c[363]=aa;c[365]=0;c[364]=W;W=ac+28|0;c[W>>2]=7;if((ac+32|0)>>>0<aB>>>0){_=W;while(1){W=_+4|0;c[W>>2]=7;if((_+8|0)>>>0<aB>>>0){_=W}else{break}}}if((ac|0)==(Y|0)){break}_=ac-ad|0;W=Y+(_+4)|0;c[W>>2]=c[W>>2]&-2;c[ad+4>>2]=_|1;c[Y+_>>2]=_;W=_>>>3;if(_>>>0<256){K=W<<1;Z=1040+(K<<2)|0;S=c[250]|0;m=1<<W;do{if((S&m|0)==0){c[250]=S|m;aE=Z;aF=1040+(K+2<<2)|0}else{W=1040+(K+2<<2)|0;Q=c[W>>2]|0;if(Q>>>0>=(c[254]|0)>>>0){aE=Q;aF=W;break}as();return 0}}while(0);c[aF>>2]=ad;c[aE+12>>2]=ad;c[ad+8>>2]=aE;c[ad+12>>2]=Z;break}K=ad;m=_>>>8;do{if((m|0)==0){aG=0}else{if(_>>>0>16777215){aG=31;break}S=(m+1048320|0)>>>16&8;Y=m<<S;ac=(Y+520192|0)>>>16&4;W=Y<<ac;Y=(W+245760|0)>>>16&2;Q=14-(ac|S|Y)+(W<<Y>>>15)|0;aG=_>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=1304+(aG<<2)|0;c[ad+28>>2]=aG;c[ad+20>>2]=0;c[ad+16>>2]=0;Z=c[251]|0;Q=1<<aG;if((Z&Q|0)==0){c[251]=Z|Q;c[m>>2]=K;c[ad+24>>2]=m;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}if((aG|0)==31){aH=0}else{aH=25-(aG>>>1)|0}Q=_<<aH;Z=c[m>>2]|0;while(1){if((c[Z+4>>2]&-8|0)==(_|0)){break}aJ=Z+16+(Q>>>31<<2)|0;m=c[aJ>>2]|0;if((m|0)==0){T=840;break}else{Q=Q<<1;Z=m}}if((T|0)==840){if(aJ>>>0<(c[254]|0)>>>0){as();return 0}else{c[aJ>>2]=K;c[ad+24>>2]=Z;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}}Q=Z+8|0;_=c[Q>>2]|0;m=c[254]|0;if(Z>>>0<m>>>0){as();return 0}if(_>>>0<m>>>0){as();return 0}else{c[_+12>>2]=K;c[Q>>2]=K;c[ad+8>>2]=_;c[ad+12>>2]=Z;c[ad+24>>2]=0;break}}}while(0);ad=c[253]|0;if(ad>>>0<=o>>>0){break}_=ad-o|0;c[253]=_;ad=c[256]|0;Q=ad;c[256]=Q+o;c[Q+(o+4)>>2]=_|1;c[ad+4>>2]=o|3;n=ad+8|0;return n|0}}while(0);c[(an()|0)>>2]=12;n=0;return n|0}function bG(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;if((a|0)==0){return}b=a-8|0;d=b;e=c[254]|0;if(b>>>0<e>>>0){as()}f=c[a-4>>2]|0;g=f&3;if((g|0)==1){as()}h=f&-8;i=a+(h-8)|0;j=i;L1215:do{if((f&1|0)==0){k=c[b>>2]|0;if((g|0)==0){return}l=-8-k|0;m=a+l|0;n=m;o=k+h|0;if(m>>>0<e>>>0){as()}if((n|0)==(c[255]|0)){p=a+(h-4)|0;if((c[p>>2]&3|0)!=3){q=n;r=o;break}c[252]=o;c[p>>2]=c[p>>2]&-2;c[a+(l+4)>>2]=o|1;c[i>>2]=o;return}p=k>>>3;if(k>>>0<256){k=c[a+(l+8)>>2]|0;s=c[a+(l+12)>>2]|0;t=1040+(p<<1<<2)|0;do{if((k|0)!=(t|0)){if(k>>>0<e>>>0){as()}if((c[k+12>>2]|0)==(n|0)){break}as()}}while(0);if((s|0)==(k|0)){c[250]=c[250]&~(1<<p);q=n;r=o;break}do{if((s|0)==(t|0)){u=s+8|0}else{if(s>>>0<e>>>0){as()}v=s+8|0;if((c[v>>2]|0)==(n|0)){u=v;break}as()}}while(0);c[k+12>>2]=s;c[u>>2]=k;q=n;r=o;break}t=m;p=c[a+(l+24)>>2]|0;v=c[a+(l+12)>>2]|0;do{if((v|0)==(t|0)){w=a+(l+20)|0;x=c[w>>2]|0;if((x|0)==0){y=a+(l+16)|0;z=c[y>>2]|0;if((z|0)==0){A=0;break}else{B=z;C=y}}else{B=x;C=w}while(1){w=B+20|0;x=c[w>>2]|0;if((x|0)!=0){B=x;C=w;continue}w=B+16|0;x=c[w>>2]|0;if((x|0)==0){break}else{B=x;C=w}}if(C>>>0<e>>>0){as()}else{c[C>>2]=0;A=B;break}}else{w=c[a+(l+8)>>2]|0;if(w>>>0<e>>>0){as()}x=w+12|0;if((c[x>>2]|0)!=(t|0)){as()}y=v+8|0;if((c[y>>2]|0)==(t|0)){c[x>>2]=v;c[y>>2]=w;A=v;break}else{as()}}}while(0);if((p|0)==0){q=n;r=o;break}v=a+(l+28)|0;m=1304+(c[v>>2]<<2)|0;do{if((t|0)==(c[m>>2]|0)){c[m>>2]=A;if((A|0)!=0){break}c[251]=c[251]&~(1<<c[v>>2]);q=n;r=o;break L1215}else{if(p>>>0<(c[254]|0)>>>0){as()}k=p+16|0;if((c[k>>2]|0)==(t|0)){c[k>>2]=A}else{c[p+20>>2]=A}if((A|0)==0){q=n;r=o;break L1215}}}while(0);if(A>>>0<(c[254]|0)>>>0){as()}c[A+24>>2]=p;t=c[a+(l+16)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[254]|0)>>>0){as()}else{c[A+16>>2]=t;c[t+24>>2]=A;break}}}while(0);t=c[a+(l+20)>>2]|0;if((t|0)==0){q=n;r=o;break}if(t>>>0<(c[254]|0)>>>0){as()}else{c[A+20>>2]=t;c[t+24>>2]=A;q=n;r=o;break}}else{q=d;r=h}}while(0);d=q;if(d>>>0>=i>>>0){as()}A=a+(h-4)|0;e=c[A>>2]|0;if((e&1|0)==0){as()}do{if((e&2|0)==0){if((j|0)==(c[256]|0)){B=(c[253]|0)+r|0;c[253]=B;c[256]=q;c[q+4>>2]=B|1;if((q|0)==(c[255]|0)){c[255]=0;c[252]=0}if(B>>>0<=(c[257]|0)>>>0){return}bM(0)|0;return}if((j|0)==(c[255]|0)){B=(c[252]|0)+r|0;c[252]=B;c[255]=q;c[q+4>>2]=B|1;c[d+B>>2]=B;return}B=(e&-8)+r|0;C=e>>>3;L1321:do{if(e>>>0<256){u=c[a+h>>2]|0;g=c[a+(h|4)>>2]|0;b=1040+(C<<1<<2)|0;do{if((u|0)!=(b|0)){if(u>>>0<(c[254]|0)>>>0){as()}if((c[u+12>>2]|0)==(j|0)){break}as()}}while(0);if((g|0)==(u|0)){c[250]=c[250]&~(1<<C);break}do{if((g|0)==(b|0)){D=g+8|0}else{if(g>>>0<(c[254]|0)>>>0){as()}f=g+8|0;if((c[f>>2]|0)==(j|0)){D=f;break}as()}}while(0);c[u+12>>2]=g;c[D>>2]=u}else{b=i;f=c[a+(h+16)>>2]|0;t=c[a+(h|4)>>2]|0;do{if((t|0)==(b|0)){p=a+(h+12)|0;v=c[p>>2]|0;if((v|0)==0){m=a+(h+8)|0;k=c[m>>2]|0;if((k|0)==0){E=0;break}else{F=k;G=m}}else{F=v;G=p}while(1){p=F+20|0;v=c[p>>2]|0;if((v|0)!=0){F=v;G=p;continue}p=F+16|0;v=c[p>>2]|0;if((v|0)==0){break}else{F=v;G=p}}if(G>>>0<(c[254]|0)>>>0){as()}else{c[G>>2]=0;E=F;break}}else{p=c[a+h>>2]|0;if(p>>>0<(c[254]|0)>>>0){as()}v=p+12|0;if((c[v>>2]|0)!=(b|0)){as()}m=t+8|0;if((c[m>>2]|0)==(b|0)){c[v>>2]=t;c[m>>2]=p;E=t;break}else{as()}}}while(0);if((f|0)==0){break}t=a+(h+20)|0;u=1304+(c[t>>2]<<2)|0;do{if((b|0)==(c[u>>2]|0)){c[u>>2]=E;if((E|0)!=0){break}c[251]=c[251]&~(1<<c[t>>2]);break L1321}else{if(f>>>0<(c[254]|0)>>>0){as()}g=f+16|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=E}else{c[f+20>>2]=E}if((E|0)==0){break L1321}}}while(0);if(E>>>0<(c[254]|0)>>>0){as()}c[E+24>>2]=f;b=c[a+(h+8)>>2]|0;do{if((b|0)!=0){if(b>>>0<(c[254]|0)>>>0){as()}else{c[E+16>>2]=b;c[b+24>>2]=E;break}}}while(0);b=c[a+(h+12)>>2]|0;if((b|0)==0){break}if(b>>>0<(c[254]|0)>>>0){as()}else{c[E+20>>2]=b;c[b+24>>2]=E;break}}}while(0);c[q+4>>2]=B|1;c[d+B>>2]=B;if((q|0)!=(c[255]|0)){H=B;break}c[252]=B;return}else{c[A>>2]=e&-2;c[q+4>>2]=r|1;c[d+r>>2]=r;H=r}}while(0);r=H>>>3;if(H>>>0<256){d=r<<1;e=1040+(d<<2)|0;A=c[250]|0;E=1<<r;do{if((A&E|0)==0){c[250]=A|E;I=e;J=1040+(d+2<<2)|0}else{r=1040+(d+2<<2)|0;h=c[r>>2]|0;if(h>>>0>=(c[254]|0)>>>0){I=h;J=r;break}as()}}while(0);c[J>>2]=q;c[I+12>>2]=q;c[q+8>>2]=I;c[q+12>>2]=e;return}e=q;I=H>>>8;do{if((I|0)==0){K=0}else{if(H>>>0>16777215){K=31;break}J=(I+1048320|0)>>>16&8;d=I<<J;E=(d+520192|0)>>>16&4;A=d<<E;d=(A+245760|0)>>>16&2;r=14-(E|J|d)+(A<<d>>>15)|0;K=H>>>((r+7|0)>>>0)&1|r<<1}}while(0);I=1304+(K<<2)|0;c[q+28>>2]=K;c[q+20>>2]=0;c[q+16>>2]=0;r=c[251]|0;d=1<<K;do{if((r&d|0)==0){c[251]=r|d;c[I>>2]=e;c[q+24>>2]=I;c[q+12>>2]=q;c[q+8>>2]=q}else{if((K|0)==31){L=0}else{L=25-(K>>>1)|0}A=H<<L;J=c[I>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(H|0)){break}M=J+16+(A>>>31<<2)|0;E=c[M>>2]|0;if((E|0)==0){N=1019;break}else{A=A<<1;J=E}}if((N|0)==1019){if(M>>>0<(c[254]|0)>>>0){as()}else{c[M>>2]=e;c[q+24>>2]=J;c[q+12>>2]=q;c[q+8>>2]=q;break}}A=J+8|0;B=c[A>>2]|0;E=c[254]|0;if(J>>>0<E>>>0){as()}if(B>>>0<E>>>0){as()}else{c[B+12>>2]=e;c[A>>2]=e;c[q+8>>2]=B;c[q+12>>2]=J;c[q+24>>2]=0;break}}}while(0);q=(c[258]|0)-1|0;c[258]=q;if((q|0)==0){O=1456}else{return}while(1){q=c[O>>2]|0;if((q|0)==0){break}else{O=q+8|0}}c[258]=-1;return}function bH(a){a=a|0;return}function bI(a){a=a|0;return 144|0}function bJ(a){a=a|0;if((a|0)!=0){bG(a)}return}function bK(a){a=a|0;bJ(a);return}function bL(a){a=a|0;bJ(a);return}function bM(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;do{if((c[244]|0)==0){b=aI(8)|0;if((b-1&b|0)==0){c[246]=b;c[245]=b;c[247]=-1;c[248]=2097152;c[249]=0;c[361]=0;c[244]=(aM(0)|0)&-16^1431655768;break}else{as();return 0}}}while(0);if(a>>>0>=4294967232){d=0;return d|0}b=c[256]|0;if((b|0)==0){d=0;return d|0}e=c[253]|0;do{if(e>>>0>(a+40|0)>>>0){f=c[246]|0;g=$((((-40-a-1+e+f|0)>>>0)/(f>>>0)|0)-1|0,f)|0;h=b;i=1448;while(1){j=c[i>>2]|0;if(j>>>0<=h>>>0){if((j+(c[i+4>>2]|0)|0)>>>0>h>>>0){k=i;break}}j=c[i+8>>2]|0;if((j|0)==0){k=0;break}else{i=j}}if((c[k+12>>2]&8|0)!=0){break}i=aU(0)|0;h=k+4|0;if((i|0)!=((c[k>>2]|0)+(c[h>>2]|0)|0)){break}j=aU(-(g>>>0>2147483646?-2147483648-f|0:g)|0)|0;l=aU(0)|0;if(!((j|0)!=-1&l>>>0<i>>>0)){break}j=i-l|0;if((i|0)==(l|0)){break}c[h>>2]=(c[h>>2]|0)-j;c[358]=(c[358]|0)-j;h=c[256]|0;m=(c[253]|0)-j|0;j=h;n=h+8|0;if((n&7|0)==0){o=0}else{o=-n&7}n=m-o|0;c[256]=j+o;c[253]=n;c[j+(o+4)>>2]=n|1;c[j+(m+4)>>2]=40;c[257]=c[248];d=(i|0)!=(l|0)|0;return d|0}}while(0);if((c[253]|0)>>>0<=(c[257]|0)>>>0){d=0;return d|0}c[257]=-1;d=0;return d|0}function bN(a){a=a|0;var b=0,d=0,e=0;b=(a|0)==0?1:a;while(1){d=bF(b)|0;if((d|0)!=0){e=1104;break}a=(B=c[382]|0,c[382]=B+0,B);if((a|0)==0){break}a3[a&15]()}if((e|0)==1104){return d|0}d=aH(4)|0;c[d>>2]=376;ao(d|0,440,4);return 0}function bO(a){a=a|0;return bN(a)|0}function bP(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function bQ(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=b+e|0;if((e|0)>=20){d=d&255;e=b&3;g=d|d<<8|d<<16|d<<24;h=f&~3;if(e){e=b+4-e|0;while((b|0)<(e|0)){a[b]=d;b=b+1|0}}while((b|0)<(h|0)){c[b>>2]=g;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}}function bR(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function bS(a,b){a=a|0;b=b|0;a0[a&7](b|0)}function bT(a,b,c,d,e){a=a|0;b=+b;c=+c;d=d|0;e=e|0;a1[a&3](+b,+c,d|0,e|0)}function bU(a,b){a=a|0;b=b|0;return a2[a&3](b|0)|0}function bV(a){a=a|0;a3[a&15]()}function bW(a,b,c){a=a|0;b=b|0;c=c|0;return a4[a&1](b|0,c|0)|0}function bX(a){a=a|0;aa(0)}function bY(a,b,c,d){a=+a;b=+b;c=c|0;d=d|0;aa(1)}function bZ(a){a=a|0;aa(2);return 0}function b_(){aa(3)}function b$(a,b){a=a|0;b=b|0;aa(4);return 0}
// EMSCRIPTEN_END_FUNCS
var a0=[bX,bX,bL,bX,bH,bX,bX,bX];var a1=[bY,bY,bm,bY];var a2=[bZ,bZ,bI,bZ];var a3=[b_,b_,bt,b_,bu,b_,bq,b_,bp,b_,bB,b_,b_,b_,b_,b_];var a4=[b$,b$];return{_strlen:bP,_free:bG,__Z14GameDrawPausedv:bt,__Z8GameStepv:bu,__GLOBAL__I_a:bD,_memset:bQ,__Z8GameInitv:bp,_malloc:bF,_memcpy:bR,__Z8GameDrawv:bB,__Z9GameInputffii:bm,runPostSets:bl,stackAlloc:a5,stackSave:a6,stackRestore:a7,setThrew:a8,setTempRet0:bb,setTempRet1:bc,setTempRet2:bd,setTempRet3:be,setTempRet4:bf,setTempRet5:bg,setTempRet6:bh,setTempRet7:bi,setTempRet8:bj,setTempRet9:bk,dynCall_vi:bS,dynCall_vffii:bT,dynCall_ii:bU,dynCall_v:bV,dynCall_iii:bW}})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_vi": invoke_vi, "invoke_vffii": invoke_vffii, "invoke_ii": invoke_ii, "invoke_v": invoke_v, "invoke_iii": invoke_iii, "_gelGraphicsInit": _gelGraphicsInit, "_snprintf": _snprintf, "_gelDrawTextRight": _gelDrawTextRight, "___errno_location": ___errno_location, "___cxa_throw": ___cxa_throw, "_mrGetLayerCount": _mrGetLayerCount, "_ceilf": _ceilf, "_gelDrawTextLeft": _gelDrawTextLeft, "_abort": _abort, "_gelLoadImage": _gelLoadImage, "__reallyNegative": __reallyNegative, "_gelDrawTiles": _gelDrawTiles, "_gelDrawImage": _gelDrawImage, "_mrGetSize": _mrGetSize, "___setErrNo": ___setErrNo, "_gelBindTileset": _gelBindTileset, "_llvm_eh_exception": _llvm_eh_exception, "_mrIndex": _mrIndex, "_llvm_umul_with_overflow_i32": _llvm_umul_with_overflow_i32, "_sprintf": _sprintf, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "_gelGraphicsExit": _gelGraphicsExit, "_mrGetWidth": _mrGetWidth, "___cxa_allocate_exception": ___cxa_allocate_exception, "_sysconf": _sysconf, "_gelLoadTileset": _gelLoadTileset, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "___cxa_is_number_type": ___cxa_is_number_type, "_time": _time, "__formatString": __formatString, "___cxa_does_inherit": ___cxa_does_inherit, "_floorf": _floorf, "_sndPlay": _sndPlay, "_gelDrawTileCentered": _gelDrawTileCentered, "_mrBindLayer": _mrBindLayer, "___cxa_call_unexpected": ___cxa_call_unexpected, "_sbrk": _sbrk, "_gelSetColor": _gelSetColor, "_gelBindImage": _gelBindImage, "___gxx_personality_v0": ___gxx_personality_v0, "_mrGetHeight": _mrGetHeight, "_gelDrawTileFlipX": _gelDrawTileFlipX, "___resumeException": ___resumeException, "_gelDrawTile": _gelDrawTile, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "NaN": NaN, "Infinity": Infinity, "__ZTVN10__cxxabiv117__class_type_infoE": __ZTVN10__cxxabiv117__class_type_infoE, "__ZTVN10__cxxabiv120__si_class_type_infoE": __ZTVN10__cxxabiv120__si_class_type_infoE }, buffer);
var _strlen = Module["_strlen"] = asm["_strlen"];
var _free = Module["_free"] = asm["_free"];
var __Z14GameDrawPausedv = Module["__Z14GameDrawPausedv"] = asm["__Z14GameDrawPausedv"];
var __Z8GameStepv = Module["__Z8GameStepv"] = asm["__Z8GameStepv"];
var __GLOBAL__I_a = Module["__GLOBAL__I_a"] = asm["__GLOBAL__I_a"];
var _memset = Module["_memset"] = asm["_memset"];
var __Z8GameInitv = Module["__Z8GameInitv"] = asm["__Z8GameInitv"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var __Z8GameDrawv = Module["__Z8GameDrawv"] = asm["__Z8GameDrawv"];
var __Z9GameInputffii = Module["__Z9GameInputffii"] = asm["__Z9GameInputffii"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vffii = Module["dynCall_vffii"] = asm["dynCall_vffii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };
// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;
// === Auto-generated postamble setup entry stuff ===
Module['callMain'] = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(!Module['preRun'] || Module['preRun'].length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  var ret;
  var initialStackTop = STACKTOP;
  try {
    ret = Module['_main'](argc, argv, 0);
  }
  catch(e) {
    if (e.name == 'ExitStatus') {
      return e.status;
    } else if (e == 'SimulateInfiniteLoop') {
      Module['noExitRuntime'] = true;
    } else {
      throw e;
    }
  } finally {
    STACKTOP = initialStackTop;
  }
  return ret;
}
function run(args) {
  args = args || Module['arguments'];
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return 0;
  }
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    var toRun = Module['preRun'];
    Module['preRun'] = [];
    for (var i = toRun.length-1; i >= 0; i--) {
      toRun[i]();
    }
    if (runDependencies > 0) {
      // a preRun added a dependency, run will be called later
      return 0;
    }
  }
  function doRun() {
    ensureInitRuntime();
    preMain();
    var ret = 0;
    calledRun = true;
    if (Module['_main'] && shouldRunNow) {
      ret = Module['callMain'](args);
      if (!Module['noExitRuntime']) {
        exitRuntime();
      }
    }
    if (Module['postRun']) {
      if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
      while (Module['postRun'].length > 0) {
        Module['postRun'].pop()();
      }
    }
    return ret;
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
    return 0;
  } else {
    return doRun();
  }
}
Module['run'] = Module.run = run;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
  // {{MODULE_ADDITIONS}}
// Begin PostJS.txt //
// - -------------------------------------------------------------------------------------------------------------- - //
var SoundEnabled = true;
// - -------------------------------------------------------------------------------------------------------------- - //
//var SoundFile_Prefix = "Content/Sound/";
//var SoundFile_Ext = ".wav";
//var SoundFile_Prefix = "Content/SoundMP3/";
//var SoundFile_Ext = ".mp3";
var SoundFile_Prefix = "Content/SoundOGG/";
var SoundFile_Ext = ".ogg";
// - -------------------------------------------------------------------------------------------------------------- - //
var SoundNames = {};
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function sndInit() {
	SoundEnabled = !isMobileSafari();
	
	Log( "* Sound (BUZZ) Initialized" );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function sndExit() {
}
// - -------------------------------------------------------------------------------------------------------------- - //
function sndAvailable() {
	if ( !SoundEnabled )
		return false;
	return buzz.isSupported();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function sndLoad( _Name, _File ) {
	if ( !SoundEnabled )
		return;
		
	SoundNames[_Name] = new buzz.sound( SoundFile_Prefix + _File, {
		formats: [ "ogg" ],
		preload: true,
		autoplay: false,
		loop: false
	});
}
// - -------------------------------------------------------------------------------------------------------------- - //
function sndLoadAndPlay( _Name, _File ) {
	if ( !SoundEnabled )
		return;
	SoundNames[_Name] = new buzz.sound( SoundFile_Prefix + _File, {
		formats: [ "ogg" ],
		preload: true,
		autoplay: true,
		loop: false
	});
}
// - -------------------------------------------------------------------------------------------------------------- - //
function sndLoadAndPlayAndLoop( _Name, _File ) {
	if ( !SoundEnabled )
		return;
	SoundNames[_Name] = new buzz.sound( SoundFile_Prefix + _File, {
		formats: [ "ogg" ],
		preload: true,
		autoplay: true,
		loop: true
	});
}
// - -------------------------------------------------------------------------------------------------------------- - //
function sndPlay( _Name ) {
	if ( !SoundEnabled )
		return;
	if ( !SoundNames[_Name].isPaused() )
		SoundNames[_Name].setTime( 0 );
	else
		SoundNames[_Name].play();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function sndHasLoaded( _Name ) {
	if ( !SoundEnabled )
		return false;
	if ( SoundNames[_Name] )
		return SoundNames[_Name].getStateCode() >= 0;//buzz.HAVE_CURRENT_DATA;
	return false;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function sndPause( _Name ) {
	if ( SoundNames[_Name] )
		SoundNames[_Name].pause();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function sndResume( _Name ) {
	if ( SoundNames[_Name] )
		SoundNames[_Name].play();
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function isMobileSafari() {
    return navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)
}
// - -------------------------------------------------------------------------------------------------------------- - //
function isMobile() {
	return 'createTouch' in document;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function Log( val ) {
	if ( isMobile() ) {
//		setTimeout( function() { document.getElementById("HTMLLog").innerHTML += val + "<br />"; }, 50 );
	}
	else {
		console.log( val );
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function NextPowerOfTwo( v ) {
	// http://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2 //
	v--;
	v |= v >> 1;
	v |= v >> 2;
	v |= v >> 4;
	v |= v >> 8;
	v |= v >> 16;
	v++;
	
	return v;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
// http://my.opera.com/GreyWyvern/blog/show.dml/1725165 //
Object.prototype.clone = function() {
	var newObj = (this instanceof Array) ? [] : {};
	for (i in this) {
		if (i == 'clone') continue;
		if (this[i] && typeof this[i] == "object") {
			newObj[i] = this[i].clone();
		} 
		else 
			newObj[i] = this[i]
	} 
	return newObj;
};
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
// http://24ways.org/2005/dont-be-eval //
function evalRequest( url, MyFunc ) {
	Log( "EV..." );
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			Log( "** " + xmlhttp.responseText + " ** " );
			eval(xmlhttp.responseText);
			Generate();
			if ( MyFunc ) {
				Log( "Has Function..." );
				MyFunc();
			}
		}
	}
	Log( "EVO..." );
	xmlhttp.open( "GET", url, false );
	xmlhttp.send(null);
	Log( "EVS..." );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function RGB( r, g, b ) {
	return "rgb(" + r + "," + g + "," + b + ")";
}
// - -------------------------------------------------------------------------------------------------------------- - //
function RGBA( r, g, b, a ) {
	return "rgba(" + r + "," + g + "," + b + "," + (Alpha/255) + ")";
}
// - -------------------------------------------------------------------------------------------------------------- - //
function ColorString( r, g, b, Alpha ) {
	if ( typeof Alpha === 'undefined' ) {
		return "rgb(" + r + "," + g + "," + b + ")";
	}
	else {
		return "rgba(" + r + "," + g + "," + b + "," + (Alpha/255) + ")";
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function C64F_BLACK( Alpha ) { return ColorString( 0, 0, 0, Alpha ); }
function C64F_WHITE( Alpha ) { return ColorString( 255, 255, 255, Alpha ); }
function C64F_RED( Alpha ) { return ColorString( 160, 71, 57, Alpha ); }
function C64F_CYAN( Alpha ) { return ColorString( 105, 194, 203, Alpha ); }
function C64F_PURPLE( Alpha ) { return ColorString( 169, 30, 168, Alpha ); }
function C64F_GREEN( Alpha ) { return ColorString( 70, 187, 84, Alpha ); }
function C64F_BLUE( Alpha ) { return ColorString( 96, 0, 162, Alpha ); }
function C64F_YELLOW( Alpha ) { return ColorString( 192, 227, 120, Alpha ); }
function C64F_ORANGE( Alpha ) { return ColorString( 159, 106, 38, Alpha ); }
function C64F_BROWN( Alpha ) { return ColorString( 105, 90, 0, Alpha ); }
function C64F_LIGHT_RED( Alpha ) { return ColorString( 203, 121, 109, Alpha ); }
function C64F_DARK_GRAY( Alpha ) { return ColorString( 98, 98, 98, Alpha ); }
function C64F_MEDIUM_GRAY( Alpha ) { return ColorString( 137, 137, 137, Alpha ); }
function C64F_LIGHT_GREEN( Alpha ) { return ColorString( 138, 243, 148, Alpha ); }
function C64F_LIGHT_BLUE( Alpha ) { return ColorString( 149, 95, 211, Alpha ); }
function C64F_LIGHT_GRAY( Alpha ) { return ColorString( 173, 173, 173, Alpha ); }
// - -------------------------------------------------------------------------------------------------------------- - //
var RGB_BLACK		=	RGB(0,0,0);
var RGB_GREY		=	RGB(127,127,127);
var RGB_WHITE		=	RGB(255,255,255);
var RGB_RED			=	RGB(255,0,0);
var RGB_GREEN		=	RGB(0,255,0);
var RGB_BLUE		=	RGB(0,0,255);
var RGB_MAGENTA		=	RGB(255,0,255);
var RGB_YELLOW		=	RGB(255,255,0);
var RGB_CYAN		=	RGB(0,255,255);
var RGB_ORANGE		=	RGB(255,127,0);
var RGB_PINK		=	RGB(255,0,127);
var RGB_PURPLE		=	RGB(127,0,255);
var RGB_PUKE		=	RGB(127,255,0);
var RGB_MINT		=	RGB(0,255,127);
var RGB_SKY			=	RGB(0,127,255);
var RGB_DEFAULT		=	RGB_WHITE;
// - -------------------------------------------------------------------------------------------------------------- - //
function RGBF_BLACK		(Alpha) { return ColorString(0,0,0,Alpha); }
function RGBF_GREY		(Alpha) { return ColorString(127,127,127,Alpha); }
function RGBF_WHITE		(Alpha) { return ColorString(255,255,255,Alpha); }
function RGBF_RED		(Alpha) { return ColorString(255,0,0,Alpha); }
function RGBF_GREEN		(Alpha) { return ColorString(0,255,0,Alpha); }
function RGBF_BLUE		(Alpha) { return ColorString(0,0,255,Alpha); }
function RGBF_MAGENTA	(Alpha) { return ColorString(255,0,255,Alpha); }
function RGBF_YELLOW	(Alpha) { return ColorString(255,255,0,Alpha); }
function RGBF_CYAN		(Alpha) { return ColorString(0,255,255,Alpha); }
function RGBF_ORANGE	(Alpha) { return ColorString(255,127,0,Alpha); }
function RGBF_PINK		(Alpha) { return ColorString(255,0,127,Alpha); }
function RGBF_PURPLE	(Alpha) { return ColorString(127,0,255,Alpha); }
function RGBF_PUKE		(Alpha) { return ColorString(127,255,0,Alpha); }
function RGBF_MINT		(Alpha) { return ColorString(0,255,127,Alpha); }
function RGBF_SKY		(Alpha) { return ColorString(0,127,255,Alpha); }
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
// Real //
// - -------------------------------------------------------------------------------------------------------------- - //
var Real_Sin45 = 0.70710678118654752440084436210485;
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
// Vector2D //
// - -------------------------------------------------------------------------------------------------------------- - //
function Vector2D( _x, _y ) {
	// Data //
	this.x = _x;
	this.y = _y;
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Add = function( vs ) {
	this.x += vs.x;
	this.y += vs.y;
	return this;
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Sub = function( vs ) {
	this.x -= vs.x;
	this.y -= vs.y;
	return this;
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Mult = function( vs ) {
	this.x *= vs.x;
	this.y *= vs.y;
	return this;
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Div = function( vs ) {
	this.x /= vs.x;
	this.y /= vs.y;
	return this;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.AddScalar = function( vs ) {
	this.x += vs;
	this.y += vs;
	return this;
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.SubScalar = function( vs ) {
	this.x -= vs;
	this.y -= vs;
	return this;
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.MultScalar = function( vs ) {
	this.x *= vs;
	this.y *= vs;
	return this;
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.DivScalar = function( vs ) {
	this.x /= vs;
	this.y /= vs;
	return this;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Negate = function() {
	this.x = -this.x;
	this.y = -this.y;
	return this;
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Negative = function() {
	return new Vector2D( -this.x, -this.y );
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.FlipX = function() {
	return new Vector2D( -this.x, this.y );
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.FlipY = function() {
	return new Vector2D( this.x, -this.y );
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Tangent = function() {
	return new Vector2D( this.y, -this.x );
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Rotate45 = function() {
	return new Vector2D( (this.x + this.y) * Real_Sin45, (this.y - this.x) * Real_Sin45 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.RotateNegative45 = function() {
	return new Vector2D( (this.x - this.y) * Real_Sin45, (this.y + this.x) * Real_Sin45 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Dot = function( vs ) {
	return (this.x * vs.x) + (this.y * vs.y);
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Mix = function( vs, alpha ) {
	var Copy = this.clone();
	return Copy.MultScalar(1 - alpha).Add( vs.MultScalar(alpha) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.SumOf = function() {
	return this.x + this.y;
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.ProductOf = function() {
	return this.x * this.y;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Manhattan = function() {
	return Math.abs(this.x) + Math.abs(this.y);
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.MagnitudeSquared = function() {
	return (this.x * this.x) + (this.y * this.y);
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Magnitude = function() {
	return Math.sqrt( (this.x * this.x) + (this.y * this.y) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Normalize = function() {
	var Mag = this.Magnitude();
	
	if ( Mag <= 0 ) {
		this.x = 0;
		this.y = 0;
		return this;
	}
	
	this.x /= Mag;
	this.y /= Mag;
	return this;
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.NormalizeRet = function() {
	var Mag = this.Magnitude();
	
	if ( Mag <= 0 ) {
		this.x = 0;
		this.y = 0;
		return Mag;
	}
	
	this.x /= Mag;
	this.y /= Mag;
	return Mag;
}
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.Normal = function() {
	var Copy = this.clone();
	Copy.Normalize();
	return Copy;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
Vector2D.prototype.toString = function() {
	return "(" + this.x + ", " + this.y + ")";
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
// "Operators" - Not actually, but they provide improved syntax by calling builtin functions //
// - -------------------------------------------------------------------------------------------------------------- - //
function Add( a, b ) {
	var Copy = a.clone();
	Copy.Add(b);
	return Copy;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Sub( a, b ) {
	var Copy = a.clone();
	Copy.Sub(b);
	return Copy;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Mult( a, b ) {
	var Copy = a.clone();
	Copy.Mult(b);
	return Copy;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Div( a, b ) {
	var Copy = a.clone();
	Copy.Div(b);
	return Copy;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function AddScalar( a, b ) {
	var Copy = a.clone();
	Copy.AddScalar(b);
	return Copy;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function SubScalar( a, b ) {
	var Copy = a.clone();
	Copy.SubScalar(b);
	return Copy;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function MultScalar( a, b ) {
	var Copy = a.clone();
	Copy.MultScalar(b);
	return Copy;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function DivScalar( a, b ) {
	var Copy = a.clone();
	Copy.DivScalar(b);
	return Copy;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function Dot( a, b ) {
	return a.Dot(b);
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Cross( a, b ) {
	return a.Cross(b);
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Mix( a, b, alpha ) {
	return a.Mix(b, alpha);
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function NearestPoint_on_Sphere( ) {
}
// - -------------------------------------------------------------------------------------------------------------- - //
function NearestPoint_on_Edge_of_Sphere( ) {
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Test_Sphere_vs_Sphere( v1, Radius1, v2, Radius2 ) {
	var Diff = v1.clone();
	Diff.Sub( v2 );
	var RadiusSum = Radius1 + Radius2;
	return Diff.MagnitudeSquared() < (RadiusSum * RadiusSum);
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Solve_Sphere_vs_Sphere( v1, Radius1, v2, Radius2 ) {
	var Diff = v1.clone();
	Diff.Sub( v2 );
	
	var RadiusSum = Radius1 + Radius2;
	var Mag = Diff.NormalizeRet();
	
	if ( Mag > RadiusSum )
		return;
	
	var Push = (RadiusSum - Mag) * 0.5;
	
	Diff.MultScalar( Push );
	
	v1.Add( Diff );
	Diff.Negate();
	v2.Add( Diff );	
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Solve_Sphere_vs_Sphere_with_Mass( v1, Radius1, Mass1, v2, Radius2, Mass2 ) {
	var Diff = v1.clone();
	Diff.Sub( v2 );
	
	var RadiusSum = Radius1 + Radius2;
	var Mag = Diff.NormalizeRet();
	
	if ( Mag > RadiusSum )
		return;
	
	var TotalMass = Mass1+Mass2;
	Mass1 /= TotalMass;
	Mass2 /= TotalMass;
	
	var Push = (RadiusSum - Mag);
	
	var Diff2 = Diff.clone();
	Diff.MultScalar( Push * Mass2 );
	Diff2.MultScalar( Push * Mass1 );
	Diff2.Negate();
	
	v1.Add( Diff );
	v2.Add( Diff2 );	
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Solve_Sphere_vs_Sphere_with_Weights( v1, Radius1, Weight1, v2, Radius2, Weight2 ) {
	var Diff = v1.clone();
	Diff.Sub( v2 );
	
	var RadiusSum = Radius1 + Radius2;
	var Mag = Diff.NormalizeRet();
	
	if ( Mag > RadiusSum )
		return;
	
	var Push = (RadiusSum - Mag);
	
	var Diff2 = Diff.clone();
	Diff.MultScalar( Push * Weight1 );
	Diff2.MultScalar( Push * Weight2 );
	Diff2.Negate();
	
	v1.Add( Diff );
	v2.Add( Diff2 );	
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function NearestPoint_on_AABB( v1, _x, _y, _w, _h ) {
	var Vec = v1.clone();
	
	// Clamp to X //
	if ( Vec.x > _x + _w ) {
		Vec.x = _x + _w;
	}
	else if ( Vec.x < _x ) {
		Vec.x = _x;
	}
	
	// Clamp to Y //
	if ( Vec.y > _y + _h ) {
		Vec.y = _y + _h;
	}
	else if ( Vec.y < _y ) {
		Vec.y = _y;
	}
	
	return Vec;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function NearestPoint_on_Edge_of_AABB( v1, _x, _y, _w, _h ) {
	var Vec = v1.clone();
	
	// Clamp to X //
	if ( Vec.x > _x + _w ) {
		Vec.x = _x + _w;
	}
	else if ( Vec.x < _x ) {
		Vec.x = _x;
	}
	else {
		// Round towards nearest edge //
		if ( (Vec.x - _x) > (_w >> 1) ) {
			Vec.x = _x + _w;
		}
		else {
			Vec.x = _x;
		}
	}
	
	// Clamp to Y //
	if ( Vec.y > _y + _h ) {
		Vec.y = _y + _h;
	}
	else if ( Vec.y < _y ) {
		Vec.y = _y;
	}
	else {
		// Round towards nearest edge //
		if ( (Vec.y - _y) > (_h >> 1) ) {
			Vec.y = _y + _h;
		}
		else {
			Vec.y = _y;
		}		
	}
	
	return Vec;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function NearestPoint_on_WedgeTopLeft( v1, _x, _y, _w, _h ) {
	var Vec = v1.clone();
	var Change = 0;
	
	// Clamp to X //
	if ( Vec.x > _x + _w ) { 	// Right //
		Vec.x = _x + _w;
		Change--;
	}
	else if ( Vec.x < _x ) { 	// Left //
		Vec.x = _x;
		Change++;
	}
	
	// Clamp to Y //
	if ( Vec.y > _y + _h ) {	// Bottom //
		Vec.y = _y + _h;
		Change--;
	}
	else if ( Vec.y < _y ) {	// Top //
		Vec.y = _y;
		Change++;
	}
	
	// Return if there were changes //
	if ( Change > 0 )
		return Vec;
		
	// If there were no changes, we still have work to do //
	var From = new Vector2D( _x, _y + _h );
	var RayTo = new Vector2D( _x + _w, _y );
	RayTo.Sub( From );
	
	var Me = v1.clone();
	Me.Sub( From );
	
	var RayLength = RayTo.NormalizeRet();
	var Result = Dot( RayTo, Me );
	
	if ( Result < 0 ) {
		Vec.x = _x;
		Vec.y = _y + _h;
	}
	else if ( Result > RayLength ) {
		Vec.x = _x + _w;
		Vec.y = _y;
	}
	else {
		Vec.x = From.x + (RayTo.x * Result);
		Vec.y = From.y + (RayTo.y * Result);
	}
	
	return Vec;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function NearestPoint_on_WedgeBottomRight( v1, _x, _y, _w, _h ) {
	var Vec = v1.clone();
	var Change = 0;
	
	// Clamp to X //
	if ( Vec.x > _x + _w ) { 	// Right //
		Vec.x = _x + _w;
		Change++;
	}
	else if ( Vec.x < _x ) { 	// Left //
		Vec.x = _x;
		Change--;
	}
	
	// Clamp to Y //
	if ( Vec.y > _y + _h ) {	// Bottom //
		Vec.y = _y + _h;
		Change++;
	}
	else if ( Vec.y < _y ) {	// Top //
		Vec.y = _y;
		Change--;
	}
	
	// Return if there were changes //
	if ( Change > 0 )
		return Vec;
		
	// If there were no changes, we still have work to do //
	var From = new Vector2D( _x, _y + _h );
	var RayTo = new Vector2D( _x + _w, _y );
	RayTo.Sub( From );
	
	var Me = v1.clone();
	Me.Sub( From );
	
	var RayLength = RayTo.NormalizeRet();
	var Result = Dot( RayTo, Me );
	
	if ( Result < 0 ) {
		Vec.x = _x;
		Vec.y = _y + _h;
	}
	else if ( Result > RayLength ) {
		Vec.x = _x + _w;
		Vec.y = _y;
	}
	else {
		Vec.x = From.x + (RayTo.x * Result);
		Vec.y = From.y + (RayTo.y * Result);
	}
	
	return Vec;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function NearestPoint_on_WedgeTopRight( v1, _x, _y, _w, _h ) {
	var Vec = v1.clone();
	var Change = 0;
	
	// Clamp to X //
	if ( Vec.x > _x + _w ) { 	// Right //
		Vec.x = _x + _w;
		Change++;
	}
	else if ( Vec.x < _x ) { 	// Left //
		Vec.x = _x;
		Change--;
	}
	
	// Clamp to Y //
	if ( Vec.y > _y + _h ) {	// Bottom //
		Vec.y = _y + _h;
		Change--;
	}
	else if ( Vec.y < _y ) {	// Top //
		Vec.y = _y;
		Change++;
	}
	
	// Return if there were changes //
	if ( Change > 0 )
		return Vec;
		
	// If there were no changes, we still have work to do //
	var From = new Vector2D( _x, _y );
	var RayTo = new Vector2D( _x + _w, _y + _h );
	RayTo.Sub( From );
	
	var Me = v1.clone();
	Me.Sub( From );
	
	var RayLength = RayTo.NormalizeRet();
	var Result = Dot( RayTo, Me );
	
	if ( Result < 0 ) {
		Vec.x = _x;
		Vec.y = _y;
	}
	else if ( Result > RayLength ) {
		Vec.x = _x + _w;
		Vec.y = _y + _h;
	}
	else {
		Vec.x = From.x + (RayTo.x * Result);
		Vec.y = From.y + (RayTo.y * Result);
	}
	
	return Vec;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function NearestPoint_on_WedgeBottomLeft( v1, _x, _y, _w, _h ) {
	var Vec = v1.clone();
	var Change = 0;
	
	// Clamp to X //
	if ( Vec.x > _x + _w ) { 	// Right //
		Vec.x = _x + _w;
		Change--;
	}
	else if ( Vec.x < _x ) { 	// Left //
		Vec.x = _x;
		Change++;
	}
	
	// Clamp to Y //
	if ( Vec.y > _y + _h ) {	// Bottom //
		Vec.y = _y + _h;
		Change++;
	}
	else if ( Vec.y < _y ) {	// Top //
		Vec.y = _y;
		Change--;
	}
	
	// Return if there were changes //
	if ( Change > 0 )
		return Vec;
		
	// If there were no changes, we still have work to do //
	var From = new Vector2D( _x, _y );
	var RayTo = new Vector2D( _x + _w, _y + _h );
	RayTo.Sub( From );
	
	var Me = v1.clone();
	Me.Sub( From );
	
	var RayLength = RayTo.NormalizeRet();
	var Result = Dot( RayTo, Me );
	
	if ( Result < 0 ) {
		Vec.x = _x;
		Vec.y = _y;
	}
	else if ( Result > RayLength ) {
		Vec.x = _x + _w;
		Vec.y = _y + _h;
	}
	else {
		Vec.x = From.x + (RayTo.x * Result);
		Vec.y = From.y + (RayTo.y * Result);
	}
	
	return Vec;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function Solve_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, _Func ) {
	// NOTE: This will break if v1 enters the AABB //
	var Diff = v1.clone();
	Diff.Sub( _Func( v1, _x,_y,_w,_h ) );
	
	var Mag = Diff.NormalizeRet();
	if ( Mag > Radius1 )
		return;
	
	var Push = (Radius1 - Mag);// * 0.5;
	
	Diff.MultScalar( Push );
	
	v1.Add( Diff );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function Solve_Sphere_vs_AABB( v1, Radius1, _x, _y, _w, _h ) {
	Solve_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, NearestPoint_on_AABB );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Solve_Sphere_vs_WedgeBottomLeft( v1, Radius1, _x, _y, _w, _h ) {
	Solve_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeBottomLeft );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Solve_Sphere_vs_WedgeTopLeft( v1, Radius1, _x, _y, _w, _h ) {
	Solve_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeTopLeft );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Solve_Sphere_vs_WedgeBottomRight( v1, Radius1, _x, _y, _w, _h ) {
	Solve_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeBottomRight );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Solve_Sphere_vs_WedgeTopRight( v1, Radius1, _x, _y, _w, _h ) {
	Solve_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeTopRight );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function Test_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, _Func ) {
	var Diff = v1.clone();
	Diff.Sub( _Func( v1, _x,_y,_w,_h ) );
	return Diff.MagnitudeSquared() < (Radius1 * Radius1);
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function Test_Sphere_vs_AABB( v1, Radius1, _x, _y, _w, _h ) {
	return Test_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, NearestPoint_on_AABB );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Test_Sphere_vs_WedgeBottomLeft( v1, Radius1, _x, _y, _w, _h ) {
	return Test_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeBottomLeft );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Test_Sphere_vs_WedgeTopLeft( v1, Radius1, _x, _y, _w, _h ) {
	return Test_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeTopLeft );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Test_Sphere_vs_WedgeBottomRight( v1, Radius1, _x, _y, _w, _h ) {
	return Test_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeBottomRight );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Test_Sphere_vs_WedgeTopRight( v1, Radius1, _x, _y, _w, _h ) {
	return Test_Sphere_vs_XYWHShape( v1, Radius1, _x, _y, _w, _h, NearestPoint_on_WedgeTopRight );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
// GelGraphics2D - 2D HTML5 Canvas Drawing Code //
// - -------------------------------------------------------------------------------------------------------------- - //
//"use strict";
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelGraphicsInit( width, height ) {
	Log( "Original Canvas Size: " + Module.canvas.width + ", " + Module.canvas.height );
    try {
		Module.ctx = Module.canvas.getContext("2d");
		if ( !Module.ctx )
			throw 'ERROR: Could not get context!';
			
		Module.canvas.style.backgroundColor = "black";
	    Module.canvas.width = width;
	    Module.canvas.height = height;
    } catch (e) {
		Module.print('ERROR: Canvas not available!');
    }	
	Log( "New Canvas Size: " + Module.canvas.width + ", " + Module.canvas.height );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelGraphicsExit() {	
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelCenterImage( img, x, y ) {
	Module.ctx.drawImage( img, x-(img.width >> 1), y-(img.height >> 1) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelCenterImage( img, x, y, scale_x, scale_y ) {
	Module.ctx.drawImage( img, x-((img.width * scale_x) >> 1), y-((img.height * scale_y) >> 1), img.width * scale_x, img.height * scale_y );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawTextCenter( _Text, _x, _y, _Size, _Font ) {
	Module.ctx.font = "" + _Size + "px " + _Font;
	Module.ctx.textAlign = "left";
	Module.ctx.textBaseline = "top";
	
	// Hack: The C64 font I was using wouldn't perfectly Text Align center, so I manually center //
	var TextWidth = Math.floor( Module.ctx.measureText(_Text).width ) >> 1;
	var TextHeight = Math.floor( _Size ) >> 1;
	Module.ctx.fillText( _Text, Math.floor(_x - TextWidth), Math.floor(_y - TextHeight) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTextCenter( _Text, _x, _y, _Size, _Font ) {
	gelDrawTextCenter( Pointer_stringify(_Text), _x, _y, _Size, Pointer_stringify(_Font) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawTextLeft( _Text, _x, _y, _Size, _Font ) {
	Module.ctx.font = "" + _Size + "px " + _Font;
	Module.ctx.textAlign = "left";
	Module.ctx.textBaseline = "top";
	
	// Hack: The C64 font I was using wouldn't perfectly Text Align center, so I manually center //
//	var TextWidth = Math.floor( Module.ctx.measureText(_Text).width ) >> 1;
	var TextHeight = Math.floor( _Size ) >> 1;
	Module.ctx.fillText( _Text, Math.floor(_x), Math.floor(_y - TextHeight) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTextLeft( _Text, _x, _y, _Size, _Font ) {
	gelDrawTextLeft( Pointer_stringify(_Text), _x, _y, _Size, Pointer_stringify(_Font) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawTextRight( _Text, _x, _y, _Size, _Font ) {
	Module.ctx.font = "" + _Size + "px " + _Font;
	Module.ctx.textAlign = "left";
	Module.ctx.textBaseline = "top";
	
	// Hack: The C64 font I was using wouldn't perfectly Text Align center, so I manually center //
	var TextWidth = Math.floor( Module.ctx.measureText(_Text).width );
	var TextHeight = Math.floor( _Size ) >> 1;
	Module.ctx.fillText( _Text, Math.floor(_x - TextWidth), Math.floor(_y - TextHeight) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTextRight( _Text, _x, _y, _Size, _Font ) {
	gelDrawTextRight( Pointer_stringify(_Text), _x, _y, _Size, Pointer_stringify(_Font) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelSetColor( r, g, b, a ) {
//	Log( typeof a );
	if ( typeof a === 'undefined' ) {
		Module.ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
		Module.ctx.strokeStyle = Module.ctx.fillStyle;
	}
	else {
		Module.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
		Module.ctx.strokeStyle = Module.ctx.fillStyle;
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelSetColorString( str ) {
	Module.ctx.fillStyle = str;
	Module.ctx.strokeStyle = str;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawRectFill( x, y, w, h ) {
	Module.ctx.fillRect( x, y, w, h );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawPixelThinRect( x, y, w, h ) {
	Module.ctx.fillRect( x, y, w, 1 );
	Module.ctx.fillRect( x+1, y+h-1, w-1, 1 );
	Module.ctx.fillRect( x, y+1, 1, h-1 );
	Module.ctx.fillRect( x+w-1, y+1, 1, h-2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawRect( x, y, w, h ) {
	Module.ctx.strokeRect( x, y, w, h );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelClearRect( x, y, w, h ) {
	Module.ctx.clearRect( x, y, w, h );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTriangleShape( x1, y1, x2, y2, x3, y3 ) {
	Module.ctx.beginPath();
	Module.ctx.moveTo( x1, y1 );
	Module.ctx.lineTo( x2, y2 );
	Module.ctx.lineTo( x3, y3 );
	Module.ctx.lineTo( x1, y1 );
	Module.ctx.closePath();
	Module.ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTriangleShapeFill( x1, y1, x2, y2, x3, y3 ) {
	Module.ctx.beginPath();
	Module.ctx.moveTo( x1, y1 );
	Module.ctx.lineTo( x2, y2 );
	Module.ctx.lineTo( x3, y3 );
	Module.ctx.lineTo( x1, y1 );
	Module.ctx.closePath();
	Module.ctx.fill();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawQuadShape( x1, y1, x2, y2, x3, y3, x4, y4 ) {
	Module.ctx.beginPath();
	Module.ctx.moveTo( x1, y1 );
	Module.ctx.lineTo( x2, y2 );
	Module.ctx.lineTo( x3, y3 );
	Module.ctx.lineTo( x4, y4 );
	Module.ctx.lineTo( x1, y1 );
	Module.ctx.closePath();
	Module.ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawQuadShapeFill( x1, y1, x2, y2, x3, y3, x4, y4 ) {
	Module.ctx.beginPath();
	Module.ctx.moveTo( x1, y1 );
	Module.ctx.lineTo( x2, y2 );
	Module.ctx.lineTo( x3, y3 );
	Module.ctx.lineTo( x4, y4 );
	Module.ctx.lineTo( x1, y1 );
	Module.ctx.closePath();
	Module.ctx.fill();
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawWedgeBottomRight( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	_gelDrawTriangleShape( x2,y1, x2,y2, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawWedgeBottomLeft( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	_gelDrawTriangleShape( x1,y1, x2,y2, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawWedgeTopRight( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	_gelDrawTriangleShape( x1,y1, x2,y1, x2,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawWedgeTopLeft( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	_gelDrawTriangleShape( x1,y1, x2,y1, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawWedgeBottomRightFill( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	_gelDrawTriangleShapeFill( x2,y1, x2,y2, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawWedgeBottomLeftFill( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	_gelDrawTriangleShapeFill( x1,y1, x2,y2, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawWedgeTopRightFill( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	_gelDrawTriangleShapeFill( x1,y1, x2,y1, x2,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawWedgeTopLeftFill( x1, y1, w, h ) {
	var x2 = x1+w;
	var y2 = y1+h;
	_gelDrawTriangleShapeFill( x1,y1, x2,y1, x1,y2 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawCircleFill( x, y, Radius ) {
	Module.ctx.beginPath();
	Module.ctx.arc( x, y, Radius, 0, Math.PI*2, true); 
	Module.ctx.closePath();
	Module.ctx.fill();	
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawCircle( x, y, Radius ) {
	Module.ctx.beginPath();
	Module.ctx.arc( x, y, Radius, 0, Math.PI*2, true); 
	Module.ctx.closePath();
	Module.ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawSquareFill( x, y, Radius ) {
	Module.ctx.fillRect( x-Radius, y-Radius, Radius+Radius, Radius+Radius );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawSquare( x, y, Radius ) {
	Module.ctx.strokeRect( x-Radius, y-Radius, Radius+Radius, Radius+Radius );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawPixelThinSquare( x, y, Radius ) {
	_gelDrawPixelThinRect( x-Radius, y-Radius, Radius+Radius, Radius+Radius );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawDiamondFill( x, y, Radius ) {
	Module.ctx.beginPath();
	Module.ctx.moveTo( x-Radius, y );
	Module.ctx.lineTo( x, y-Radius );
	Module.ctx.lineTo( x+Radius, y );
	Module.ctx.lineTo( x, y+Radius );
	Module.ctx.lineTo( x-Radius, y );
	
	Module.ctx.closePath();
	Module.ctx.fill();	
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawDiamond( x, y, Radius ) {
	Module.ctx.beginPath();
	Module.ctx.moveTo( x-Radius, y );
	Module.ctx.lineTo( x, y-Radius );
	Module.ctx.lineTo( x+Radius, y );
	Module.ctx.lineTo( x, y+Radius );
	Module.ctx.lineTo( x-Radius, y );
	Module.ctx.closePath();
	Module.ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawCross( x, y, Radius ) {
	Module.ctx.beginPath();
	Module.ctx.moveTo( x-Radius, y );
	Module.ctx.lineTo( x+Radius, y );
	Module.ctx.moveTo( x, y-Radius );
	Module.ctx.lineTo( x, y+Radius );
	Module.ctx.closePath();
	Module.ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawX( x, y, Radius ) {
	Module.ctx.beginPath();
	Module.ctx.moveTo( x-Radius, y-Radius );
	Module.ctx.lineTo( x+Radius, y+Radius );
	Module.ctx.moveTo( x+Radius, y-Radius );
	Module.ctx.lineTo( x-Radius, y+Radius );
	Module.ctx.closePath();
	Module.ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawLine( x1, y1, x2, y2 ) {
	Module.ctx.beginPath();
	Module.ctx.moveTo( x1, y1 );
	Module.ctx.lineTo( x2, y2 );
	Module.ctx.closePath();
	Module.ctx.stroke();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawText( _x, _y, _Text ) {
	var _Size = 16;
	var _Font = "Commodore";
	
	Module.ctx.font = "" + _Size + "px " + _Font;
	Module.ctx.textAlign = "left";
	Module.ctx.textBaseline = "top";
	// Hack: The C64 font I was using wouldn't perfectly Text Align center, so I manually center //
	var TextWidth = Math.floor( Module.ctx.measureText(_Text).width ) >> 1;
	var TextHeight = Math.floor( _Size ) >> 1;
	Module.ctx.fillText( Pointer_stringify(_Text), Math.floor(_x - TextWidth), Math.floor(_y - TextHeight) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
var ImageData = new Array();
var CurrentImage;
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelLoadImage( FileName ) {
	var NewImage = new Image;
//	ImageData.Data.onload = function() {
//		_super.CellW = _super.Data.width / _XCells;
//		_super.CellH = _super.Data.height / _YCells;
//	};
	NewImage.src = Pointer_stringify(FileName);//allocate(intArrayFromString(FileName), 'i8', ALLOC_STACK);//FileName;
	
	var Index = ImageData.length;
	ImageData.push( NewImage );
	return Index;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelBindImage( ImageId ) {
	CurrentImage = ImageData[ ImageId ];
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawImage( sx, sy ) {
	Module.ctx.drawImage( CurrentImage, sx, sy );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawImageCrop( sx, sy, sw, sh, dx, dy ) {
	Module.ctx.drawImage( CurrentImage, sx, sy, sw, sh, dx, dy, sw, sh );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelLoadTileset( FileName, w, h ) {
	var NewImage = new Image;
	NewImage.src = Pointer_stringify(FileName);
	
	NewImage.Tileset = true;
	NewImage.TileWidth = w;
	NewImage.TileHeight = h;
	
	NewImage.onload = function() {
		NewImage.WidthInTiles = NewImage.width / w;
		NewImage.HeightInTiles = NewImage.height / h;
	};
	
	var Index = ImageData.length;
	ImageData.push( NewImage );
	return Index;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelBindTileset( ImageId ) {
	CurrentImage = ImageData[ ImageId ];
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTile( Tile, dx, dy ) {
	Module.ctx.drawImage( 
		CurrentImage, 
		Math.floor( Tile % CurrentImage.WidthInTiles ) * CurrentImage.TileWidth, Math.floor( Tile / CurrentImage.WidthInTiles ) * CurrentImage.TileHeight,
		CurrentImage.TileWidth, CurrentImage.TileHeight, 
		dx, dy,
		CurrentImage.TileWidth, CurrentImage.TileHeight 
		);
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTileCentered( Tile, dx, dy ) {
	Module.ctx.drawImage( 
		CurrentImage, 
		Math.floor( Tile % CurrentImage.WidthInTiles ) * CurrentImage.TileWidth, Math.floor( Tile / CurrentImage.WidthInTiles ) * CurrentImage.TileHeight,
		CurrentImage.TileWidth, CurrentImage.TileHeight, 
		dx - (CurrentImage.TileWidth>>1), dy - (CurrentImage.TileHeight>>1),
		CurrentImage.TileWidth, CurrentImage.TileHeight 
		);
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTileBaseline( Tile, dx, dy ) {
	Module.ctx.drawImage( 
		CurrentImage, 
		Math.floor( Tile % CurrentImage.WidthInTiles ) * CurrentImage.TileWidth, Math.floor( Tile / CurrentImage.WidthInTiles ) * CurrentImage.TileHeight,
		CurrentImage.TileWidth, CurrentImage.TileHeight, 
		dx - (CurrentImage.TileWidth>>1), dy - (CurrentImage.TileHeight),
		CurrentImage.TileWidth, CurrentImage.TileHeight 
		);
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTileFlipX( Tile, dx, dy ) {
	Module.ctx.scale(-1, 1);
	_gelDrawTile( Tile, -dx-CurrentImage.TileWidth, dy );
	Module.ctx.scale(-1, 1);
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTileFlipY( Tile, dx, dy ) {
	Module.ctx.scale(1, -1);
	_gelDrawTile( Tile, dx, -dy-CurrentImage.TileHeight );
	Module.ctx.scale(1, -1);
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTileFlipXY( Tile, dx, dy ) {
	Module.ctx.scale(-1, -1);
	_gelDrawTile( Tile, -dx-CurrentImage.TileWidth, -dy-CurrentImage.TileHeight );
	Module.ctx.scale(-1, -1);
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _gelDrawTiles( DataPtr, MapWidth, MapHeight, StartX, StartY, EndX, EndY, TileMod, OffsetX, OffsetY ) {
	var Width = MapWidth * 2;
//	OffsetX = Math.floor( OffsetX );
//	OffsetY = Math.floor( OffsetY );
	var dx;
	var dy;
	
	for ( var _y = StartY; _y < EndY; _y++ ) {
		for ( var _x = StartX; _x < EndX; _x++ ) {
			//int Tile = (*MapLayer->Data[Layer])(_x, _y);
			var Tile = HEAP16[ (DataPtr + (Width*_y) + _x + _x) >> 1 ];//getValue( DataPtr + (Width*_y) + _x + _x, 'i16' );
			if ( Tile > 0 ) {
				Tile += TileMod;
//				dx = ((_x - StartX) * 8) - OffsetX;
//				dy = ((_y - StartY) * 8) - OffsetY;
				dx = ((_x - StartX) << 3) - OffsetX;
				dy = ((_y - StartY) << 3) - OffsetY;
				
				Module.ctx.drawImage( 
					CurrentImage, 
//					Math.floor( Tile % CurrentImage.WidthInTiles ) * CurrentImage.TileWidth, Math.floor( Tile / CurrentImage.WidthInTiles ) * CurrentImage.TileHeight,
					(Tile & 0x3F) << 3, (Tile >> 6) << 3,
					CurrentImage.TileWidth, CurrentImage.TileHeight, 
					dx, dy,
					CurrentImage.TileWidth, CurrentImage.TileHeight 
					);
					
//				_gelDrawTile( 
//					Tile, 
//					((_x - StartX) * 8) - OffsetX, 
//					((_y - StartY) * 8) - OffsetY
//					);
			}
		}
	}	
}
// - -------------------------------------------------------------------------------------------------------------- - //
var IntervalHandle = 0;
var GlobalCurrentFrame = 0;
var GlobalDebugMode = false;
var GlobalCameraOffset = Vector2D(0,0);	// Hack //
var FrameRate = 1000/60;
var WorkTime = 0;
var FPSClock = 0;
var FPSClock_Timer = 0;
var FPSClock_Draws = 0;
var FirstRun = true;
var HasInitSounds = false;
var Hack_ShowFPS = false;
var Canvas_Scale;
var Canvas;
// - -------------------------------------------------------------------------------------------------------------- - //
//var Game;
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function InitSounds() {
	Log( "* Init Sounds" );
	
	sndInit();
	sndLoad( 'Jump01', 'Jump01' );
	sndLoad( 'Jump02', 'Jump02' );
	sndLoad( 'Ground', 'Ground2' );
	sndLoad( 'Ceiling', 'Ceiling' );
	sndLoad( 'Slide', 'Slide' );
	sndLoad( 'Change', 'Change' );
	sndLoad( 'CantChange', 'CantChange' );
	sndLoad( 'StarPickup', 'StarPickup' );
	sndLoad( 'KeyPickup', 'KeyPickup2' );
	sndLoad( 'Unlock', 'Unlock' );
	sndLoad( 'Win', 'Win' );
	sndLoadAndPlayAndLoop( 'BGMusic', '../POL-rescue-short' );
	Log( "* Done Init Sounds" );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _sndPlay( SoundName ) {
	sndPlay( Pointer_stringify( SoundName ) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
var MapReader_CurrentLayer = 0;
var MapReader_File = ContentMapData;
// - -------------------------------------------------------------------------------------------------------------- - //
function _mrGetLayerCount() {
	return MapReader_File.layers.length;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _mrBindLayer( _Layer ) {
	MapReader_CurrentLayer = _Layer;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _mrGetWidth() {
	return MapReader_File.layers[MapReader_CurrentLayer].width;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _mrGetHeight() {
	return MapReader_File.layers[MapReader_CurrentLayer].height;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _mrGet( _x, _y ) {
	return MapReader_File.layers[MapReader_CurrentLayer].data[ (_y * _mrGetWidth()) + _x ];
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _mrGetSize() {
	return MapReader_File.layers[MapReader_CurrentLayer].data.length;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function _mrIndex( _Index ) {
	return MapReader_File.layers[MapReader_CurrentLayer].data[ _Index ];
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function gelDrawTextCenter( _Text, _x, _y, _Size, _Font ) {
	ctx = Canvas.getContext("2d");
	ctx.font = "" + _Size + "px " + _Font;
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	
	// Hack: The C64 font I was using wouldn't perfectly Text Align center, so I manually center //
	var TextWidth = Math.floor( ctx.measureText(_Text).width ) >> 1;
	var TextHeight = Math.floor( _Size ) >> 1;
	ctx.fillText( _Text, Math.floor(_x - TextWidth), Math.floor(_y - TextHeight) );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function gelSetColor( r, g, b, a ) {
	ctx = Canvas.getContext("2d");
//	Log( typeof a );
	if ( typeof a === 'undefined' ) {
		ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
		ctx.strokeStyle = ctx.fillStyle;
	}
	else {
		ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
		ctx.strokeStyle = ctx.fillStyle;
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
function gelSetColorString( str ) {
	ctx.fillStyle = str;
	ctx.strokeStyle = str;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function DrawFPS() {
	ctx = Canvas.getContext("2d");
	
	if ( isMobile() )
		ctx.fillStyle = "rgb(128,128,255)";
	else
		ctx.fillStyle = "rgb(255,255,0)";
	ctx.font = "16px Commodore";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillText( FPSClock, Canvas.width - 1, 240-18 );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function Main_Loop() {
	if ( FirstRun ) {
		//Game.Init();
		//GameInit();
		__Z8GameInitv();
		
		WorkTime = new Date().getTime();
		FirstRun = false;
	}
	
	if ( sndAvailable() && (HasInitSounds == false) ) {
		//Game.InitSounds();
		InitSounds();
		WorkTime = new Date().getTime();
		HasInitSounds = true;
	}
	
	// Frame Skipping //
	var CurrentTime = new Date().getTime();
	var TimeDiff = Math.floor(CurrentTime - WorkTime);
	
	// If too much time has passed, disregard clock //
	if ( TimeDiff > 500 ) {
		Log( "* WARNING: Too much time passed (" + TimeDiff + "). Throwing away clock." );
		TimeDiff = 0;
		WorkTime = CurrentTime;
	}
	else if ( TimeDiff < 0 ) {
		TimeDiff = 0;
		WorkTime = CurrentTime;
	}
	if ( TimeDiff > FrameRate ) {
		var FramesToDo = Math.floor( TimeDiff / FrameRate );
	
		var CurrentFrame = GlobalCurrentFrame;
		for ( var idx = 0; idx < FramesToDo; idx++ ) {
			GlobalCurrentFrame++;
			Input_KeyUpdate();
			__Z9GameInputffii( Input_Stick.x, Input_Stick.y, Input_KeyCurrent, Input_KeyLast );
			
			//Game.Step();
			//GameStep();
			__Z8GameStepv();
		}
		
		// NOTE: Comment these two lines for 60 FPS. Uncomment them for 30 FPS //
//		if ( CurrentFrame != GlobalCurrentFrame ) {
//			if ( ((GlobalCurrentFrame - CurrentFrame) > 1) || ((GlobalCurrentFrame & 1) == 0) ) {
				//Game.Draw();
				//GameDraw();
				__Z8GameDrawv();
				FPSClock_Draws++;
				
				if ( Hack_ShowFPS )
					DrawFPS();
//			}
//		}
		
		WorkTime += FramesToDo * FrameRate;
		
		var WorkTimeDiff = WorkTime - (FPSClock_Timer + 1000);
		if ( WorkTimeDiff > 0 ) {
			FPSClock = FPSClock_Draws;
			FPSClock_Draws = 0;
			if ( WorkTimeDiff > 20 )
				FPSClock_Timer = WorkTime;
			else
				FPSClock_Timer += 1000;
		}
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function EnableRequestFrame() {
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function DisableRequestFrame() {
	window.requestAnimFrame = null;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function RunMainLoop() {
	(function animloop(){
		if ( requestAnimFrame ) {
		      requestAnimFrame(animloop);
		      Main_Loop();
		  }
    })();
    // place the rAF *before* the render() to assure as close to 
    // 60fps with the setTimeout fallback.
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function Main_ShowPaused() {
	//Game.ShowPaused();
	gelSetColor( 0,0,0,255 );
	gelDrawTextCenter( "*PAUSED*", Canvas.width >> 1, (Canvas.height >> 1)+3, 48, "ShowG" );
	gelSetColor( 255,254,100,255 );
	gelDrawTextCenter( "*PAUSED*", Canvas.width >> 1, Canvas.height >> 1, 48, "ShowG" );
	__Z14GameDrawPausedv();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Main_GainFocus() {
	Log( "* Gain Focus" );
	// Resume Music //
	sndResume( 'BGMusic' );
	
	// Clear Keys (just in case) //
	Input_KeyPanic();
	
	// Reset Clock //
	WorkTime = new Date().getTime();
	
	// Restart Clock //
	EnableRequestFrame();
	RunMainLoop();
//	if ( IntervalHandle == 0 ) {
//		IntervalHandle = setInterval( Main_Loop, FrameRate );
//	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Main_LoseFocus() {
	Log( "* Lost Focus" );
	// Stop Clock //
//	clearInterval( IntervalHandle );
//	IntervalHandle = 0;
	DisableRequestFrame();
	
	// Pause Music //
	sndPause( 'BGMusic' );
	
	Main_ShowPaused();
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Main_Resize( ) {
	var Sheet = document.styleSheets[0];
	
	// FF/Chrome: cssRules[]. IE: Rules[]. //
	var Rules = Sheet.cssRules ? Sheet.cssRules : Sheet.rules;
	var CanvasRule;
	
	// Search for the rule //
	for ( var idx = 0; idx < Rules.length; idx++ ) {
		if ( Rules[idx].selectorText.toLowerCase() == "canvas" ) {
			// Rule found //
			CanvasRule = Rules[idx];
			break;
		}
	}
	
	// If a rule for canvas was found, edit it //
	if ( CanvasRule ) {
		var Canvas_AspectRatio = Canvas.width / Canvas.height;
				
		var Window_ScaleWidth = window.innerWidth;
		var Window_ScaleHeight = window.innerHeight - (6);	// size of the SoundManager2 Element //
		
		var Window_AspectRatio = Window_ScaleWidth / Window_ScaleHeight;
		
		// Scaling //
		if ( Canvas_AspectRatio < Window_AspectRatio ) {
			Canvas_Scale = Window_ScaleHeight / Canvas.height;
		}
		else {
			Canvas_Scale = Window_ScaleWidth / Canvas.width;
		}
		// Rigid Scaling (do "Floor Only" for pixel precise) //	
		if ( isMobileSafari() ) {
//			Canvas_Scale *= 2;	// Double before we Floor it, so to get values like 2.5, etc //
			Canvas_Scale = Math.floor( Canvas_Scale );
//			Canvas_Scale /= 2;	// Reduce after Floor, so to get values like 2.5, etc //
		}
		else {
			Canvas_Scale = Math.floor( Canvas_Scale );
		}
				
		var TargetWidth = Canvas_Scale * Canvas.height * Canvas_AspectRatio;
		var TargetHeight = Canvas_Scale * Canvas.height;
		// Write to the style element //		
		CanvasRule.style.width = TargetWidth + "px";
		CanvasRule.style.height = TargetHeight + "px";
		CanvasRule.style.left = Math.floor((window.innerWidth - TargetWidth) / 2) + "px";
		CanvasRule.style.top = Math.floor((window.innerHeight - TargetHeight) / 2) + "px";
	}
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
// Input_Stick and the functions neet to be global, since they are used as listeners (and "this" wont propogate) //
var Input_Stick;
var Input_KeyBits;
var Input_KeyCurrent;
var Input_KeyLast;
var KEY_UP = 		0x1;
var KEY_DOWN = 		0x2;
var KEY_LEFT = 		0x4;
var KEY_RIGHT = 	0x8;
var KEY_ACTION = 	0x10;
var KEY_ACTION2 = 	0x20;
var KEY_ACTION3 = 	0x40;
var KEY_ACTION4 = 	0x80;
var KEY_MENU =		0x800;
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyInit() {
	Input_Stick = new Vector2D( 0, 0 );
	Input_KeyBits = 0;
	
	Input_KeyCurrent = 0;
	Input_KeyLast = 0;
	window.addEventListener( 'keydown', Input_KeyDownEvent, true );
	window.addEventListener( 'keyup', Input_KeyUpEvent, true );
	window.addEventListener( 'keypress', Input_KeyPressEvent, true );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyExit() {
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyPanic() {
	Log( "* Input_KeyPanic (clear - some browsers are stupid)" );
	Input_Stick.x = 0;
	Input_Stick.y = 0;
	
	Input_KeyBits = 0;
	
	Input_KeyCurrent = 0;
	Input_KeyLast = 0;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyUpdate() {
	if ( Input_KeyBits & KEY_UP ) {
		Input_Stick.y = -1;
	}
	else if ( Input_KeyBits & KEY_DOWN ) {
		Input_Stick.y = +1;
	}
	else {
		Input_Stick.y = 0;
	}
	if ( Input_KeyBits & KEY_LEFT ) {
		Input_Stick.x = -1;
	}
	else if ( Input_KeyBits & KEY_RIGHT ) {
		Input_Stick.x = +1;
	}
	else {
		Input_Stick.x = 0;
	}
	
	// Stop diagonals from being faster //
//	Input_Stick.Normalize();
	
	// Update the Current and Old //
	Input_KeyLast = Input_KeyCurrent;
	Input_KeyCurrent = Input_KeyBits;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// Key pressed this frame //
function Input_Key( Mask ) {
	return Input_KeyCurrent & Mask;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// Key pressed last frame //
function Input_KeyLast( Mask ) {
	return Input_KeyLast & Mask;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// Key was just pressed this frame //
function Input_KeyPressed( Mask ) {
	return (Input_KeyCurrent ^ Input_KeyLast) & Input_KeyCurrent & Mask;
}
// - -------------------------------------------------------------------------------------------------------------- - //
// Key was just released this frame //
function Input_KeyReleased( Mask ) {
	return (Input_KeyCurrent ^ Input_KeyLast) & Input_KeyLast & Mask;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyDownEvent( e ) {
	switch (e.keyCode) {
		case 38:  /* Up arrow was pressed */
			Input_KeyBits |= KEY_UP;
			break;
		case 40:  /* Down arrow was pressed */
			Input_KeyBits |= KEY_DOWN;
			break;
		case 37:  /* Left arrow was pressed */
			Input_KeyBits |= KEY_LEFT;
			break;
		case 39:  /* Right arrow was pressed */
			Input_KeyBits |= KEY_RIGHT;
			break;
		
		case 48: // 0 //
//			Log( "PlayerPos: " + Game.Player.Pos + " [" + Math.floor(Game.Player.Pos.x/16) + "," +  Math.floor(Game.Player.Pos.y/16) + "]" );
			return false;
			break;
		case 49: // 1 //
			GlobalDebugMode = !GlobalDebugMode;
			return false;
			break;
		case 50: // 2 //
			Hack_ShowFPS = !Hack_ShowFPS;
			break;
		case 51: // 3 //
			Hack_NoCollision = !Hack_NoCollision;
			Log( "Player Collision: " + Hack_NoCollision );
			break;
		case 53: // 5 //
			Game.Generate();
			break;
		case 57: // 9 //
			if ( !(typeof VibrantColorScheme === "undefined") ) {
				VibrantColorScheme = !VibrantColorScheme;
				UpdateColorScheme();
				Log( "Color Scheme Changed. Vibrant: " + VibrantColorScheme );
			}
			break;
		case 27: // ESC //
			Input_KeyBits |= KEY_MENU;
			return false;
			break;
		case 13: // Enter //
		case 17: // CTRL //
		case 32: // Space Bar //
			Input_KeyBits |= KEY_ACTION;		
			return false;
			break;
	};
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyUpEvent( e ) {
	switch (e.keyCode) {
		case 38:  /* Up arrow was pressed */
			Input_KeyBits &= ~KEY_UP;
			break;
		case 40:  /* Down arrow was pressed */
			Input_KeyBits &= ~KEY_DOWN;
			break;
		case 37:  /* Left arrow was pressed */
			Input_KeyBits &= ~KEY_LEFT;
			break;
		case 39:  /* Right arrow was pressed */
			Input_KeyBits &= ~KEY_RIGHT;
			break;
		case 13: // Enter //
		case 17: // CTRL //
		case 32: // Space Bar //
			Input_KeyBits &= ~KEY_ACTION;
			break;
		case 27: // ESC //
			Input_KeyBits &= ~KEY_MENU;
			break;
	};
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_KeyPressEvent( e ) {
	// Certain Keycodes don't work here/only work here in FF //
	switch (e.keyCode) {
		case 8: // Backspace //
		case 113: // F2 //
			GlobalDebugMode = !GlobalDebugMode;
			break;
	};
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
var Input_Mouse;
var Input_MouseBits;
var MOUSE_LMB = 		0x1;
var MOUSE_RMB = 		0x2;
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseInit() {
	Input_Mouse = new Vector2D(0,0);
	Input_Mouse.Visible = false;
	
	Canvas.onmousemove = Input_MouseMove;
	Canvas.onmouseup = Input_MouseUp;
	Canvas.onmousedown = Input_MouseDown;
	
	Canvas.onmouseover = Input_MouseOver;
	Canvas.onmouseout = Input_MouseOut;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseExit() { 
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseMove( e ) {
	Input_Mouse.x = (e.clientX - Canvas.offsetLeft) / Canvas_Scale;
	Input_Mouse.y = (e.clientY - Canvas.offsetTop) / Canvas_Scale;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseOver( e ) {
	Input_Mouse.Visible = true;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseOut( e ) {
	Input_Mouse.Visible = false;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseUp( e ) {
	Input_MouseBits &= ~MOUSE_LMB;
	Log( "Click Up " + Input_Mouse );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_MouseDown( e ) {
	Input_Mouse.x = (e.clientX - Canvas.offsetLeft) / Canvas_Scale;
	Input_Mouse.y = (e.clientY - Canvas.offsetTop) / Canvas_Scale;
	
	Input_MouseBits |= MOUSE_LMB;
	Log( "Click Down " + Input_Mouse );
}
// - -------------------------------------------------------------------------------------------------------------- - //
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_TouchInit() {
	Input_Mouse = new Vector2D(0,0);
	Input_Mouse.Visible = true;//false;
	
	Canvas.ontouchmove = Input_TouchMove;
	Canvas.ontouchstart = Input_TouchStart;
	Canvas.ontouchend = Input_TouchEnd;
//	window.addEventListener("touchmove", Input_TouchMove, false);
//	window.addEventListener("touchstart", Input_TouchStart, false);
//	window.addEventListener("touchend", Input_TouchEnd, false);
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_TouchExit() { 
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_TouchMove( e ) {
	e.preventDefault();
	
	Input_Mouse.x = (e.touches.item(0).clientX - Canvas.offsetLeft) / Canvas_Scale;
	Input_Mouse.y = (e.touches.item(0).clientY - Canvas.offsetTop) / Canvas_Scale;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_TouchStart( e ) {
	e.preventDefault();
	Input_Mouse.x = (e.touches.item(0).clientX - Canvas.offsetLeft) / Canvas_Scale;
	Input_Mouse.y = (e.touches.item(0).clientY - Canvas.offsetTop) / Canvas_Scale;
	
	Input_MouseBits |= MOUSE_LMB;
	
	Log( Input_Mouse );
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Input_TouchEnd( e ) {
	e.preventDefault();
	// Touches Object is Empty on End //
//	Input_Mouse.x = (e.touches.item(0).clientX - Canvas.offsetLeft) / Canvas_Scale;
//	Input_Mouse.y = (e.touches.item(0).clientY - Canvas.offsetTop) / Canvas_Scale;
	
	Input_MouseBits &= ~MOUSE_LMB;
}
// - -------------------------------------------------------------------------------------------------------------- - //
function explore(path) {
  Module.print(path);
  var ret = FS.analyzePath(path);
  Module.print('  isRoot: ' + ret.isRoot);
  Module.print('  exists: ' + ret.exists);
  Module.print('  error: ' + ret.error);
  Module.print('  path: ' + ret.path);
  Module.print('  name: ' + ret.name);
  Module.print('  object.contents: ' + (ret.object && JSON.stringify(Object.keys(ret.object.contents || {}))));
  Module.print('  parentExists: ' + ret.parentExists);
  Module.print('  parentPath: ' + ret.parentPath);
  Module.print('  parentObject.contents: ' + (ret.parentObject && JSON.stringify(Object.keys(ret.parentObject.contents))));
  Module.print('');
}
// - -------------------------------------------------------------------------------------------------------------- - //
function Main() {
	// If no console (Internet Explorer w/o F12 debugging open), make one //
	if ( typeof console === "undefined" || typeof console.log === "undefined" ) {
		console = {};
		console.log = function() { };
	}
	
	/* ***** */
	
	Log( " - ----- GelHTML Initialized ----- -" );
	//gelGraphicsInit();
	
	Canvas = document.getElementById('canvas');
	gelSetColor( 255,254,100,255 );
	gelDrawTextCenter( "Loading...", Canvas.width >> 1, Canvas.height >> 1, 48, "ShowG" );
	// Touch or Mouse //
	if ( isMobile() )
		Input_TouchInit();
	else
		Input_MouseInit();
	Input_KeyInit();
	
	//Game = new cGame();
	
//	explore('');
//	explore('/');
//	explore('.');
//	explore('Content');
//	explore('Content/MapData.json');
//	explore('/Content/MapData.json');
//	explore('Content/MapData.jsonoo');
//	explore('MapData.json');
	window.onblur = Main_LoseFocus;
	window.onfocus = Main_GainFocus;
	window.onresize = Main_Resize;	
	
	Main_Resize();
	window.scrollTo(0,1);
	WorkTime = new Date().getTime();
	// Lock to 30fps //
//	IntervalHandle = setInterval( Main_Loop, FrameRate );
	EnableRequestFrame();
	RunMainLoop();
}
window['Main'] = Main;
// - -------------------------------------------------------------------------------------------------------------- - //
function load() {
	Main();
}
