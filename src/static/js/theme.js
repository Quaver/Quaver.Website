(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
	typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
	(factory((global.gameforest = {}),global.jQuery));
}(this, (function (exports,$) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: helpers.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
var DATA_OPTION = 'ya-option';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var Helpers =
/*#__PURE__*/
function () {
  function Helpers() {
    this.options = [];
  }

  var _proto = Helpers.prototype;

  _proto.loopArray = function loopArray(element, value) {
    var _this = this;

    if (element.substring(element.length - 1) === ';') {
      element = element.substring(0, element.length - 1);
    }

    return element.split(';').forEach(function (s) {
      var arr = s.split(':');
      value[_this.replaceString(arr[0])] = _this.replaceString(arr[1]);
    });
  };

  _proto.replaceString = function replaceString(string) {
    return string.replace(/\s/g, '');
  };

  _proto.disqus = function disqus(selector) {
    var script = document.createElement('script');
    var iframe = document.createElement('div'); // create script for header

    script.src = "https://" + window.gameforest.disqus + ".disqus.com/embed.js";
    script.setAttribute('data-timestamp', +Number(new Date()));
    iframe.id = 'disqus_thread';
    document.querySelector(selector).appendChild(iframe); // append script

    document.head.appendChild(script);
    document.body.appendChild(script);
    return true;
  };

  _proto.facebook = function facebook(selector) {
    var script = document.createElement('script');
    var root = document.createElement('div');
    var iframe = document.createElement('div');
    script.src = "https://connect.facebook.net/" + window.gameforest.facebook.lang + "/sdk.js#xfbml=1&version=" + window.gameforest.facebook.version + "&appId=" + window.gameforest.facebook.id;
    root.id = 'fb-root';
    iframe.className = 'fb-comments';
    iframe.setAttribute('data-width', '100%');
    iframe.setAttribute('data-numposts', '10');
    iframe.setAttribute('data-href', window.location.href);
    document.querySelector(selector).appendChild(iframe);

    if (!document.getElementById(root.id)) {
      document.body.appendChild(script);
      document.body.appendChild(root);
    }

    return true;
  };

  _proto.vimeo = function vimeo(option) {
    // check data option
    if (option) {
      this.loopArray(option, this.options);
    } // player


    var player = {
      autoplay: this.options.autoplay ? this.options.autoplay : 1,
      loop: this.options.loop ? 1 : 0,
      quality: this.options.quality ? this.options.quality : '1080p',
      mute: this.options.mute ? this.options.mute : 0
    };
    return "?autoplay=" + player.autoplay + "&amp;muted=" + player.mute + "&amp;quality=" + player.quality + "&amp;loop=" + player.loop;
  };

  _proto.youtube = function youtube(option, id) {
    // check data option
    if (option) {
      this.loopArray(option, this.options);
    } // player


    var player = {
      controls: this.options.controls ? this.options.controls : 1,
      autoplay: this.options.autoplay ? this.options.autoplay : 1,
      mute: this.options.mute ? this.options.mute : 0,
      loop: this.options.loop ? this.options.loop + "&amp;playlist=" + id : 0,
      start: this.options.start ? this.options.start : 0
    };
    return "?rel=0&amp;autoplay=" + player.autoplay + "&amp;controls=" + player.controls + "&amp;mute=" + player.mute + "&amp;start=" + player.start + "&amp;loop=" + player.loop;
  };

  _proto.video = function video(src) {
    // get option data attribute
    var option = src.getAttribute(DATA_OPTION); // youtube

    if (this._attr.includes('youtube')) {
      var id = this._attr.split('v=')[1];

      src = "https://www.youtube.com/embed/" + (id + this.youtube(option, id));
    } // vimeo


    if (this._attr.includes('vimeo')) {
      var _id = this._attr.split('https://vimeo.com/')[1];

      src = "https://player.vimeo.com/video/" + (_id + this.vimeo(option));
    } // twitch


    if (this._attr.includes('twitch')) {
      if (this._attr.split('clips.twitch.tv/')[1]) {
        var _id2 = this._attr.split('clips.twitch.tv/')[1];

        src = "https://clips.twitch.tv/embed?autoplay=true&clip=" + _id2 + "&tt_content=embed&tt_medium=clips_embed";
      } else {
        var _id3 = this._attr.split('videos/')[1];

        src = "https://player.twitch.tv/?autoplay=true&video=v" + _id3;
      }
    }

    return src;
  };

  return Helpers;
}();

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: background.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var DATA = 'ya-background';
var DATA_KEY = "[" + DATA + "]";
var VERSION = '1.0.0';
var ClassName = {
  EMBED: 'bg-video',
  EMBED_ITEM: 'bg-video-item',
  CONTAINER: 'container-fluid'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

var Background =
/*#__PURE__*/
function (_Helpers) {
  _inheritsLoose(Background, _Helpers);

  function Background(element) {
    var _this;

    _this = _Helpers.call(this) || this;
    _this._element = element;
    _this._attr = element.getAttribute(DATA);
    _this._iframe = document.createElement('iframe');
    return _this;
  }

  var _proto = Background.prototype;

  _proto._calc = function _calc(el, video) {
    // numbers
    var num = {
      calc: 0.2,
      half: 2,
      x: 16,
      y: 9
    };
    var ratio = num.x / num.y;
    var abundance = this._element.offsetHeight * num.calc; // el parameters

    el.width = this._element.offsetWidth;
    el.outerheight = this._element.offsetHeight;
    el.height = this._element.offsetHeight + abundance; // video paramaters

    video.width = el.width;
    video.height = Math.ceil(video.width / ratio);
    video.marginTop = Math.ceil(-((video.height - el.outerheight) / num.half));
    video.marginLeft = 0; // element height is smaller

    if (video.height < el.height) {
      video.marginTop = Math.ceil(-((el.height - el.outerheight) / num.half));
      video.height = el.height;
      video.width = Math.ceil(video.height * ratio);
      video.marginLeft = Math.ceil(-((video.width - el.width) / num.half));
    }
  } // private
  ;

  _proto._add = function _add(src) {
    // create container
    var container = document.createElement('div');
    container.className = ClassName.CONTAINER;
    var el = {};
    var video = {}; // calculate

    this._calc(el, video); // set style


    this._iframe.setAttribute('style', "width: " + video.width + "px;height: " + video.height + "px;margin-top: " + video.marginTop + "px;margin-left: " + video.marginLeft + "px");

    this.loopArray(src.getAttribute('ya-option'), this.options);

    if (this.options.opacity) {
      this._iframe.style.cssText += "opacity: " + this.options.opacity;
    } // iframe


    this._iframe.className = ClassName.EMBED_ITEM;
    this._iframe.src = this.video(src);
    this._iframe.allow = 'autoplay; encrypted-media'; // add class

    this._element.classList.add(ClassName.EMBED); // append to elements


    this._element.appendChild(container);

    this._element.appendChild(this._iframe);
  };

  _proto._get = function _get() {
    return this._add(this._element);
  } // static
  ;

  Background._init = function _init() {
    var data = new Background(this);

    data._get();
  };

  _createClass(Background, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION;
    }
  }]);

  return Background;
}(Helpers);
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(DATA_KEY).forEach(function (el) {
    Background._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: carousel.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var VERSION$1 = '1.0.0';
var DATA$1 = 'ya-carousel';
var DATA_KEY$1 = "[" + DATA$1 + "]";
var ClassName$1 = {
  CAROUSEL: 'owl-carousel',
  THEME: 'owl-carousel-theme',
  HEIGHT: 'owl-height-100'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

var Carousel =
/*#__PURE__*/
function (_Helpers) {
  _inheritsLoose(Carousel, _Helpers);

  function Carousel(element) {
    var _this;

    _this = _Helpers.call(this) || this;
    _this._element = element;
    _this._attr = element.getAttribute(DATA$1);
    return _this;
  }

  var _proto = Carousel.prototype;

  _proto._option = function _option() {
    if (this._attr) {
      this.loopArray(this._attr, this.options);
    }

    return this.options;
  };

  _proto._add = function _add() {
    var num = 100;
    var id = Math.floor(Math.random() * num);
    var carousel = ClassName$1.CAROUSEL + "-" + id; // add otpion

    this._option(); // check height


    if (this.options.height) {
      this._element.classList.add(ClassName$1.HEIGHT);
    } // set class


    this._element.classList.add(ClassName$1.THEME, carousel); // init carousel


    return $("." + carousel).owlCarousel({
      autoplay: this.options.autoplay ? true : 0,
      autoplaySpeed: this.options.autoplayspeed ? Number(this.options.autoplayspeed) : '',
      loop: this.options.loop ? 0 : true,
      nav: this.options.nav ? 0 : true,
      dots: this.options.dots ? 0 : true,
      items: this.options.items ? Number(this.options.items) : 1,
      margin: this.options.margin ? Number(this.options.margin) : 0,
      center: this.options.center ? true : 0,
      autoWidth: this.options.autowidth ? true : 0,
      slideBy: this.options.slideItem ? Number(this.options.slideItem) : 1,
      responsive: {
        0: {
          items: this.options.xs ? Number(this.options.xs) : 1,
          autoWidth: false,
          margin: 0
        },
        720: {
          items: this.options.sm ? Number(this.options.sm) : 1
        },
        991: {
          items: this.options.md ? Number(this.options.md) : this.options.items
        },
        1140: {
          items: this.options.items ? Number(this.options.items) : 1
        }
      }
    });
  } // private
  ;

  _proto._get = function _get() {
    return this._add();
  } // static
  ;

  Carousel._init = function _init() {
    var data = new Carousel(this);

    data._get();
  };

  _createClass(Carousel, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$1;
    }
  }]);

  return Carousel;
}(Helpers);
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(DATA_KEY$1).forEach(function (el) {
    Carousel._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: disqus.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var DATA$2 = 'ya-disqus';
var DATA_KEY$2 = "[" + DATA$2 + "]";
var VERSION$2 = '1.0.0';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var Disqus =
/*#__PURE__*/
function (_Helpers) {
  _inheritsLoose(Disqus, _Helpers);

  function Disqus(element) {
    var _this;

    _this = _Helpers.call(this) || this;
    _this._element = element;
    _this._attr = element.getAttribute(DATA$2);
    return _this;
  }

  var _proto = Disqus.prototype;

  _proto._get = function _get() {
    return this.disqus(DATA_KEY$2);
  } // static
  ;

  Disqus._init = function _init() {
    var data = new Disqus(this);

    data._get();
  };

  _createClass(Disqus, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$2;
    }
  }]);

  return Disqus;
}(Helpers);
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(DATA_KEY$2).forEach(function (el) {
    Disqus._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: embed.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var DATA$3 = 'ya-embed';
var DATA_KEY$3 = "[" + DATA$3 + "]";
var DATA_TITLE = 'ya-title';
var DATA_LENGTH = 'ya-length';
var VERSION$3 = '1.0.0';
var ClassName$2 = {
  ITEM: 'embed-item',
  TITLE: 'embed-title',
  LENGTH: 'embed-length'
};
var Selector = {
  EMBED: '.embed',
  CAPTION: '.embed-caption',
  IFRAME: "." + ClassName$2.EMBED_ITEM
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

var Embed =
/*#__PURE__*/
function (_Helpers) {
  _inheritsLoose(Embed, _Helpers);

  function Embed(element) {
    var _this;

    _this = _Helpers.call(this) || this;
    _this._element = element;
    _this._attr = element.getAttribute(DATA$3);
    _this._title = element.getAttribute(DATA_TITLE);
    _this._length = element.getAttribute(DATA_LENGTH);
    _this._item = element.querySelector('img');
    _this._embed = element.querySelector(Selector.EMBED);
    _this._iframe = element.querySelector(Selector.IFRAME);
    return _this;
  }

  var _proto = Embed.prototype;

  _proto.caption = function caption() {
    var caption = document.createElement('div'); // caption

    caption.className = 'embed-caption';

    this._element.appendChild(caption);

    if (this._title) {
      var title = document.createElement('div');
      title.className = ClassName$2.TITLE;
      title.innerText = this._title;
      caption.appendChild(title);
    }

    if (this._length) {
      var length = document.createElement('div');
      length.className = ClassName$2.LENGTH;
      length.innerText = this._length;
      caption.appendChild(length);
    }
  };

  _proto._set = function _set() {
    this._item.classList.add(ClassName$2.ITEM);

    this._element.classList.add('embed', 'embed-responsive', 'embed-responsive-16by9');

    if (this._title || this._length) {
      this.caption();
    }

    return true;
  };

  _proto._remove = function _remove() {
    this._item.classList.add('animated', 'fadeOut'); // animated caption


    if (this._title || this._length) {
      this._element.querySelector(Selector.CAPTION).classList.add('animated', 'fadeOut');
    }

    return true;
  } // private
  ;

  _proto._add = function _add(src) {
    // create an element
    var iframe = document.createElement('iframe'); // iframe

    iframe.className = ClassName$2.ITEM;
    iframe.src = this.video(src); // class when clicked

    this._element.classList.add('play');

    this._remove(); // append iframe


    return this._element.appendChild(iframe);
  };

  _proto._get = function _get() {
    var _this2 = this;

    // set classes
    this._set(); // click event


    this._element.addEventListener('click', function (e) {
      e.preventDefault();
      return _this2._add(_this2._element);
    }, false);
  } // static
  ;

  Embed._init = function _init() {
    var data = new Embed(this);

    data._get();
  };

  _createClass(Embed, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$3;
    }
  }]);

  return Embed;
}(Helpers);
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(DATA_KEY$3).forEach(function (el) {
    Embed._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: facebook.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var DATA$4 = 'ya-facebook';
var DATA_KEY$4 = "[" + DATA$4 + "]";
var VERSION$4 = '1.0.0';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var Facebook =
/*#__PURE__*/
function (_Helpers) {
  _inheritsLoose(Facebook, _Helpers);

  function Facebook(element) {
    var _this;

    _this = _Helpers.call(this) || this;
    _this._element = element;
    return _this;
  }

  var _proto = Facebook.prototype;

  _proto._get = function _get() {
    return this.facebook(DATA_KEY$4);
  } // static
  ;

  Facebook._init = function _init() {
    var data = new Facebook(this);

    data._get();
  };

  _createClass(Facebook, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$4;
    }
  }]);

  return Facebook;
}(Helpers);
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(DATA_KEY$4).forEach(function (el) {
    Facebook._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: icons.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
var VERSION$5 = '1.0.0';
var PATH = window.path ? window.path : 'plugins';
var Font = {
  SOLID: '.fas',
  REGULAR: '.far',
  BRAND: '.fab',
  LIGHT: '.fal'
};
var FontAwesome = {
  CSS: PATH + "/fontawesome/css/fontawesome.min.css",
  REGULAR: PATH + "/fontawesome/css/regular.min.css",
  BRAND: PATH + "/fontawesome/css/brands.min.css",
  SOLID: PATH + "/fontawesome/css/solid.min.css",
  LIGHT: PATH + "/fontawesome/css/light.min.css"
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

var Icons =
/*#__PURE__*/
function () {
  function Icons() {
    this._stylesheet = document.createElement('link');
    this._stylesheet.rel = 'stylesheet';
    this._stylesheet.href = FontAwesome.CSS;
  }

  var _proto = Icons.prototype;

  _proto._solid = function _solid() {
    if (document.querySelector(Font.SOLID)) {
      // create stylesheet
      var fas = document.createElement('link');
      fas.rel = 'stylesheet';
      fas.href = FontAwesome.SOLID; // append stylesheet

      document.head.appendChild(fas);
    }

    return true;
  };

  _proto._brand = function _brand() {
    if (document.querySelector(Font.BRAND)) {
      // create stylesheet
      var fab = document.createElement('link');
      fab.rel = 'stylesheet';
      fab.href = FontAwesome.BRAND; // append stylesheet

      document.head.appendChild(fab);
    }

    return true;
  };

  _proto._light = function _light() {
    if (document.querySelector(Font.LIGHT)) {
      // create stylesheet
      var fal = document.createElement('link');
      fal.rel = 'stylesheet';
      fal.href = FontAwesome.LIGHT; // append stylesheet

      document.head.appendChild(fal);
    }

    return true;
  };

  _proto._regular = function _regular() {
    if (document.querySelector(Font.REGULAR)) {
      // create stylesheet
      var far = document.createElement('link');
      far.rel = 'stylesheet';
      far.href = FontAwesome.REGULAR; // append stylesheet

      document.head.appendChild(far);
    }

    return true;
  };

  _proto._get = function _get() {
    // append stylesheet
    document.head.appendChild(this._stylesheet); // detect type

    this._solid();

    this._brand();

    this._light();

    this._regular();
  } // static
  ;

  Icons._init = function _init() {
    var data = new Icons();

    data._get();
  };

  _createClass(Icons, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$5;
    }
  }]);

  return Icons;
}();
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector(Font.SOLID) || document.querySelector(Font.BRAND) || document.querySelector(Font.REGULAR) || document.querySelector(Font.LIGHT)) {
    Icons._init.call();
  }
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: lightbox.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var DATA$5 = 'ya-lightbox';
var DATA_KEY$5 = "[" + DATA$5 + "]";
var VERSION$6 = '1.0.0';
var ClassName$3 = {
  LIGHTBOX: DATA$5,
  BACKDROP: DATA$5 + "-backdrop",
  CLOSE: DATA$5 + "-close",
  BODY: DATA$5 + "-body",
  IFRAME: 'embed-responsive embed-responsive-16by9',
  IFRAME_ITEM: 'embed-responsive-item',
  IMAGE: DATA$5 + "-img",
  ITEM: DATA$5 + "-item",
  FACEBOOK: 'ya-facebook',
  DISQUS: 'ya-disqus'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

var Lightbox =
/*#__PURE__*/
function (_Helpers) {
  _inheritsLoose(Lightbox, _Helpers);

  function Lightbox(element) {
    var _this;

    _this = _Helpers.call(this) || this;
    _this._element = element;
    _this._attr = element.getAttribute('href');
    _this._data = element.getAttribute(DATA$5);
    _this._rel = element.getAttribute('rel');
    return _this;
  }

  var _proto = Lightbox.prototype;

  // private
  _proto._add = function _add(src) {
    var _this2 = this;

    // define types
    var youtube = this._attr.includes('youtube.com/watch');

    var twitch = this._attr.includes('twitch'); // create elements


    var lightbox = document.createElement('div');
    lightbox.backdrop = document.createElement('div');
    lightbox.body = document.createElement('div');
    lightbox.item = document.createElement('div');
    lightbox.close = document.createElement('div'); // add classes

    lightbox.className = ClassName$3.LIGHTBOX;
    lightbox.body.className = ClassName$3.BODY;
    lightbox.close.className = ClassName$3.CLOSE;
    lightbox.backdrop.className = ClassName$3.BACKDROP; // add effect

    lightbox.body.classList.add('animated', 'fast', 'fadeIn', 'animate1');
    lightbox.backdrop.classList.add('animated', 'fadeIn', 'fast'); // add lightbox

    document.body.appendChild(lightbox);
    lightbox.appendChild(lightbox.body);
    lightbox.item.appendChild(lightbox.close);
    lightbox.appendChild(lightbox.backdrop); // check type

    if (this._rel) {
      this._gallery(lightbox); // append gallery

    } else if (youtube || twitch) {
      this._video(lightbox, src); // append video

    } else {
      this._image(lightbox); // append image

    }

    if (this._data) {
      this.loopArray(this._data, this.options);
      lightbox.option = this.options;

      if (lightbox.option.disqus || lightbox.option.facebook) {
        this._comments(lightbox);
      }
    } // remove lightbox


    lightbox.item.addEventListener('click', function (e) {
      e.preventDefault();

      if (!lightbox.element.contains(e.target)) {
        if (lightbox.carousel) {
          if (!lightbox.element.contains(e.target) && !lightbox.carousel.contains(e.target)) {
            _this2._remove(lightbox);
          }
        } else {
          _this2._remove(lightbox);
        }
      }

      return false;
    }, false);
    return true;
  } // gallery
  ;

  _proto._gallery = function _gallery(lightbox) {
    var _this3 = this;

    lightbox.item.className = ClassName$3.ITEM + " ya-lightbox-gallery";
    lightbox.element = document.createElement('img');
    lightbox.element.className = ClassName$3.IMAGE;
    lightbox.element.src = this._attr;
    lightbox.carousel = document.createElement('div');
    lightbox.carousel.className = 'owl-carousel owl-carousel-theme'; // append gallery

    lightbox.body.appendChild(lightbox.item);
    lightbox.item.appendChild(lightbox.carousel);
    lightbox.carousel.appendChild(lightbox.element); // detect gallery

    document.querySelectorAll(DATA_KEY$5 + "[rel=" + this._rel + "]").forEach(function (el) {
      if (_this3._attr !== el.getAttribute('href')) {
        lightbox.element = document.createElement('img');
        lightbox.element.className = ClassName$3.IMAGE;
        lightbox.element.src = el.getAttribute('href'); // append gallery

        lightbox.carousel.appendChild(lightbox.element);
      }
    });
    $('.owl-carousel-theme').owlCarousel({
      loop: true,
      nav: true,
      items: 1
    });
    return true;
  } // video
  ;

  _proto._video = function _video(lightbox, src) {
    lightbox.item.className = ClassName$3.ITEM;
    lightbox.element = document.createElement('iframe');
    lightbox.element.className = ClassName$3.IFRAME_ITEM;
    lightbox.element.src = this.video(src);
    lightbox.embed = document.createElement('div');
    lightbox.embed.className = ClassName$3.IFRAME; // append iframe

    lightbox.body.appendChild(lightbox.item);
    lightbox.item.appendChild(lightbox.embed);
    lightbox.embed.appendChild(lightbox.element);
    return true;
  } // image
  ;

  _proto._image = function _image(lightbox) {
    lightbox.item.className = ClassName$3.ITEM;
    lightbox.element = document.createElement('img');
    lightbox.element.className = ClassName$3.IMAGE;
    lightbox.element.src = this._attr; // append image

    lightbox.body.appendChild(lightbox.item);
    lightbox.item.appendChild(lightbox.element);
    return true;
  };

  _proto._comments = function _comments(lightbox) {
    lightbox.item.classList.add('ya-lightbox-comment');
    lightbox.comments = document.createElement('div');
    lightbox.comments.className = 'ya-lightbox-comments';
    lightbox.comment = document.createElement('div'); // append comment

    lightbox.body.appendChild(lightbox.comments);

    if (lightbox.option.disqus) {
      lightbox.comment.id = 'disqus_thread';
      lightbox.comment.setAttribute(ClassName$3.DISQUS, '');
      lightbox.comments.appendChild(lightbox.comment);
      this.disqus("[" + ClassName$3.DISQUS + "]");
    }

    if (lightbox.option.facebook) {
      lightbox.comment.className = 'fb-comments';
      lightbox.comment.setAttribute(ClassName$3.FACEBOOK, '');
      lightbox.comment.setAttribute('data-width', '100%');
      lightbox.comment.setAttribute('data-numposts', '10');
      lightbox.comments.appendChild(lightbox.comment);
      this.facebook("[" + ClassName$3.FACEBOOK + "]");
    }

    return true;
  };

  _proto._remove = function _remove(lightbox) {
    return document.body.removeChild(lightbox);
  };

  _proto._get = function _get() {
    var _this4 = this;

    this._element.addEventListener('click', function (e) {
      e.preventDefault();

      _this4._add(_this4._element);
    }, false);
  } // static
  ;

  Lightbox._init = function _init() {
    var data = new Lightbox(this);

    data._get();
  };

  _createClass(Lightbox, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$6;
    }
  }]);

  return Lightbox;
}(Helpers);
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(DATA_KEY$5).forEach(function (el) {
    Lightbox._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: navbar.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var VERSION$7 = '1.0.0';
var Selector$1 = {
  NAVBAR: '.navbar',
  SEARCH: '.navbar-search',
  ICON: '.toggle-search',
  CLOSE: '.search-close'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

var Navbar =
/*#__PURE__*/
function () {
  function Navbar() {
    this._element = document.querySelector(Selector$1.SEARCH);
    this._close = document.querySelector(Selector$1.CLOSE);
    this._icon = document.querySelector(Selector$1.ICON);
  }

  var _proto = Navbar.prototype;

  _proto._fix = function _fix() {
    $('.dropdown-lg').on('hide.bs.dropdown', function () {
      document.querySelector('.owl-carousel').classList.add('owl-hide');
    });
    $('.dropdown-lg').on('show.bs.dropdown', function () {
      document.querySelector('.owl-carousel').classList.remove('owl-hide');
    });
  };

  _proto._hover = function _hover() {
    $('.dropdown > .dropdown-menu > .dropdown').hover(function () {
      $(this).toggleClass('show');
    });
    $('.dropdown > .dropdown-menu > .dropdown > .dropdown-item').click(function (e) {
      e.preventDefault();
      return false;
    });
  } // private
  ;

  _proto._toggle = function _toggle() {
    return this._element.classList.toggle('active');
  };

  _proto._remove = function _remove() {
    return this._element.classList.remove('active');
  };

  _proto._get = function _get() {
    var _this = this;

    if (this._icon) {
      this._icon.addEventListener('click', function (e) {
        e.preventDefault();

        _this._toggle();
      }, false);

      this._close.addEventListener('click', function (e) {
        e.preventDefault();

        _this._remove();
      }, false);
    }

    this._fix();

    this._hover();
  } // static
  ;

  Navbar._init = function _init() {
    var data = new Navbar(this);

    data._get();
  };

  _createClass(Navbar, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$7;
    }
  }]);

  return Navbar;
}();
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(Selector$1.NAVBAR).forEach(function (el) {
    Navbar._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: notify.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var DATA$6 = 'ya-notify';
var DATA_KEY$6 = "[" + DATA$6 + "]";
var DATA_TITLE$1 = 'ya-title';
var VERSION$8 = '1.0.0';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var Notify =
/*#__PURE__*/
function (_Helpers) {
  _inheritsLoose(Notify, _Helpers);

  function Notify(element) {
    var _this;

    _this = _Helpers.call(this) || this;
    _this._element = element;
    _this._attr = element.getAttribute(DATA$6);
    _this._title = element.getAttribute(DATA_TITLE$1);
    return _this;
  }

  var _proto = Notify.prototype;

  _proto._remove = function _remove(notify) {
    var time = {
      hide: 3000,
      remove: 4000
    };
    setTimeout(function () {
      notify.classList.remove('fadeInDown');
      notify.classList.add('fadeOutUp');
    }, time.hide);
    setTimeout(function () {
      document.body.removeChild(notify);
    }, time.remove);
  };

  _proto._option = function _option() {
    if (this._attr) {
      this.loopArray(this._attr, this.options);
    }

    return this.options;
  };

  _proto._set = function _set(notify, alert) {
    this._option();

    if (this.options.align) {
      notify.classList.add("notify-" + this.options.align);
    }

    if (this.options.alert) {
      alert.classList.remove('alert-darken-primary');
      alert.classList.add("alert-darken-" + this.options.alert);
    }
  };

  _proto._add = function _add() {
    // constants
    var notify = document.createElement('div');
    var alert = document.createElement('div');
    var text = document.createTextNode(this._title);
    notify.classList.add('notify', 'animated', 'fadeInDown', 'fast');
    alert.classList.add('alert', 'alert-darken-primary');
    document.body.appendChild(notify);
    notify.appendChild(alert);
    alert.appendChild(text); // set notify options

    this._set(notify, alert); // remove notify


    this._remove(notify);
  };

  _proto._get = function _get() {
    var _this2 = this;

    this._element.addEventListener('click', function (e) {
      e.preventDefault();

      _this2._add(_this2._element);
    }, false);
  } // static
  ;

  Notify._init = function _init() {
    var data = new Notify(this);

    data._get();
  };

  _createClass(Notify, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$8;
    }
  }]);

  return Notify;
}(Helpers);
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(DATA_KEY$6).forEach(function (el) {
    Notify._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: progress.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
var DATA$7 = '.progress-loaded';
var VERSION$9 = '1.0.0';
var Selector$2 = {
  VALUE: 'aria-valuenow',
  BAR: '.progress-bar'
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

};

var Progress =
/*#__PURE__*/
function () {
  function Progress(element) {
    this._element = element;
    this._bar = element.querySelector(Selector$2.BAR);
    this._value = this._bar.getAttribute(Selector$2.VALUE);
  }

  var _proto = Progress.prototype;

  _proto._get = function _get() {
    var _this = this;

    var current = 0;
    setInterval(function (el) {
      if (current >= _this._value) {
        clearInterval(el);
      } else {
        current += 1;

        _this._bar.style.setProperty('width', current + "%");
      }
    }, 0);
    return true;
  } // static
  ;

  Progress._init = function _init() {
    var data = new Progress(this);

    data._get();
  };

  _createClass(Progress, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$9;
    }
  }]);

  return Progress;
}();
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(DATA$7).forEach(function (el) {
    Progress._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: sticky.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var DATA$8 = 'ya-sticky';
var DATA_KEY$7 = "[" + DATA$8 + "]";
var VERSION$10 = '1.0.0';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var Sticky =
/*#__PURE__*/
function (_Helpers) {
  _inheritsLoose(Sticky, _Helpers);

  function Sticky(element) {
    var _this;

    _this = _Helpers.call(this) || this;
    _this._element = element;
    _this._attr = element.getAttribute(DATA$8);
    _this._top = document.querySelector('.site-header').offsetHeight;
    _this._zindex = 7;
    return _this;
  }

  var _proto = Sticky.prototype;

  _proto._option = function _option() {
    if (this._attr) {
      this.loopArray(this._attr, this.options);
    }

    return this.options;
  };

  _proto._set = function _set() {
    return $(this._element).sticky({
      topSpacing: this.options.top ? Number(this.options.top) : this._top,
      bottomSpacing: this.options.bottom ? Number(this.options.bottom) : '',
      zIndex: this.options.zindex ? Number(this.options.zindex) : this._zindex
    });
  };

  _proto._get = function _get() {
    // add otpion
    this._option();

    this._set();

    return true;
  } // static
  ;

  Sticky._init = function _init() {
    var data = new Sticky(this);

    data._get();
  };

  _createClass(Sticky, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$10;
    }
  }]);

  return Sticky;
}(Helpers);
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(DATA_KEY$7).forEach(function (el) {
    Sticky._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: style.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var DATA$9 = 'ya-style';
var DATA_KEY$8 = "[" + DATA$9 + "]";
var VERSION$11 = '1.0.0';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var Style =
/*#__PURE__*/
function (_Helpers) {
  _inheritsLoose(Style, _Helpers);

  function Style(element) {
    var _this;

    _this = _Helpers.call(this) || this;
    _this._element = element;
    _this._attr = element.getAttribute(DATA$9);
    _this.option = [];
    return _this;
  }

  var _proto = Style.prototype;

  // private
  _proto._set = function _set(option) {
    var Defaults = {
      bg: option['background-color'] ? "background-color: " + option['background-color'] + " !important;" : '',
      height: option.height ? "height: " + option.height + " !important;" : '',
      opacity: option.opacity ? "opacity: " + option.opacity + " !important;" : '',
      borderColor: option['border-color'] ? "border-color: " + option['border-color'] + ";" : ' '
    };
    return Defaults.height + Defaults.bg + Defaults.opacity + Defaults.borderColor;
  };

  _proto._get = function _get() {
    this.loopArray(this._attr, this.option);
    this._element.style.cssText = this._set(this.option);

    this._element.removeAttribute(DATA$9);
  } // static
  ;

  Style._init = function _init() {
    var data = new Style(this);

    data._get();
  };

  _createClass(Style, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$11;
    }
  }]);

  return Style;
}(Helpers);
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(DATA_KEY$8).forEach(function (el) {
    Style._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: svg.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
var DATA$10 = 'ya-svg';
var DATA_KEY$9 = "[" + DATA$10 + "]";
var VERSION$12 = '1.0.0';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var Svg =
/*#__PURE__*/
function () {
  function Svg(element) {
    this._element = element;
    this._attr = element.getAttribute(DATA$10);
  }

  var _proto = Svg.prototype;

  _proto._get = function _get() {
    var svg = {
      divider: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path  d="M0,6V0h1000v100L0,6z"></path></svg>',
      chat: '<svg viewBox="0 0 48 48" width="48" height="48"><g><path d="M45,3H3A2,2,0,0,0,1,5V35a2,2,0,0,0,2,2h8v9a1,1,0,0,0,1,1,.988.988,0,0,0,.581-.187L26.32,37H45a2,2,0,0,0,2-2V5A2,2,0,0,0,45,3Z" fill="#ea9860"></path> <path d="M21,29H8a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z" fill="#fff"></path> <path d="M40,29H27a1,1,0,0,1,0-2H40a1,1,0,0,1,0,2Z" fill="#fff"></path> <path d="M30,23H8a1,1,0,0,1,0-2H30a1,1,0,0,1,0,2Z" fill="#fff"></path> <path d="M40,23H36a1,1,0,0,1,0-2h4a1,1,0,0,1,0,2Z" fill="#fff"></path></g></svg>',
      article: '<svg viewBox="0 0 48 48" width="48" height="48"><g><path fill="#444444" d="M45,45H3c-1.105,0-2-0.895-2-2V5c0-1.105,0.895-2,2-2h42c1.105,0,2,0.895,2,2v38C47,44.105,46.105,45,45,45z "></path> <rect x="3" y="10" fill="#FFFFFF" width="42" height="33"></rect> <circle fill="#E86C60" cx="4.5" cy="6.5" r="1.5"></circle> <circle fill="#EFD358" cx="9.5" cy="6.5" r="1.5"></circle> <circle fill="#72C472" cx="14.5" cy="6.5" r="1.5"></circle> <path fill="#43A6DD" d="M20,28H8c-0.552,0-1-0.447-1-1V15c0-0.553,0.448-1,1-1h12c0.552,0,1,0.447,1,1v12C21,27.553,20.552,28,20,28 z"></path> <path fill="#B3B3B3" d="M40,16H26c-0.552,0-1-0.447-1-1s0.448-1,1-1h14c0.552,0,1,0.447,1,1S40.552,16,40,16z"></path> <path fill="#B3B3B3" d="M40,22H26c-0.552,0-1-0.447-1-1s0.448-1,1-1h14c0.552,0,1,0.447,1,1S40.552,22,40,22z"></path> <path fill="#B3B3B3" d="M40,33H8c-0.552,0-1-0.447-1-1s0.448-1,1-1h32c0.552,0,1,0.447,1,1S40.552,33,40,33z"></path> <path fill="#B3B3B3" d="M32,39H8c-0.552,0-1-0.447-1-1s0.448-1,1-1h24c0.552,0,1,0.447,1,1S32.552,39,32,39z"></path> <path fill="#B3B3B3" d="M35,28h-9c-0.552,0-1-0.447-1-1s0.448-1,1-1h9c0.552,0,1,0.447,1,1S35.552,28,35,28z"></path></g></svg>',
      monkey: '<svg viewBox="0 0 48 48" width="48" height="48"><g><circle cx="8" cy="20" r="7" fill="#ead8c5"></circle> <path d="M8,28a8,8,0,1,1,8-8A8.009,8.009,0,0,1,8,28ZM8,14a6,6,0,1,0,6,6A6.006,6.006,0,0,0,8,14Z" fill="#87613e"></path> <circle cx="40" cy="20" r="7" fill="#ead8c5"></circle> <path d="M40,28a8,8,0,1,1,8-8A8.009,8.009,0,0,1,40,28Zm0-14a6,6,0,1,0,6,6A6.006,6.006,0,0,0,40,14Z" fill="#87613e"></path> <path d="M24,44A20,20,0,1,1,44,24,20.023,20.023,0,0,1,24,44Z" fill="#87613e"></path> <path d="M24,41A12,12,0,1,1,36,29,12.013,12.013,0,0,1,24,41Z" fill="#ead8c5"></path> <path d="M17,28a8,8,0,1,1,8-8A8.009,8.009,0,0,1,17,28Z" fill="#ead8c5"></path> <path d="M31,28a8,8,0,1,1,8-8A8.009,8.009,0,0,1,31,28Z" fill="#ead8c5"></path> <path d="M17,23a3,3,0,1,1,3-3A3,3,0,0,1,17,23Z" fill="#444"></path> <path d="M31,23a3,3,0,1,1,3-3A3,3,0,0,1,31,23Z" fill="#444"></path> <path d="M21,7a8.277,8.277,0,0,1,8-7c-2,1-1,6-1,6Z" fill="#87613e"></path> <circle cx="22" cy="25" r="1" fill="#c6a279"></circle> <circle cx="26" cy="25" r="1" fill="#c6a279"></circle> <path d="M36,47a4.975,4.975,0,0,1-2.476-.66l-7-4a5,5,0,1,1,4.96-8.682l7,4A5,5,0,0,1,36,47Z" fill="#a67c52"></path> <path d="M12.005,47A5,5,0,0,1,9.52,37.659l7-4a5,5,0,0,1,4.96,8.682l-7,4A4.974,4.974,0,0,1,12.005,47Z" fill="#a67c52"></path> <path d="M26.479,36.451l4.952-1.829a1.44,1.44,0,0,0-1-2.7L25.481,33.75a.959.959,0,1,1-.665-1.8l4.051-1.5a1.44,1.44,0,0,0-1-2.7L19.78,30.741l1.193-2.591a1.92,1.92,0,1,0-3.487-1.606s-3.754,8.183-4.018,8.762a5.986,5.986,0,0,0-.327,3.663,6.246,6.246,0,0,0,8.249,4.479l10.8-3.992a1.44,1.44,0,0,0-1-2.7l-4.052,1.5a.96.96,0,0,1-.665-1.8Z" fill="#e5a57a"></path> <path d="M21.521,36.451l-4.952-1.829a1.44,1.44,0,0,1,1-2.7l4.952,1.829a.959.959,0,1,0,.665-1.8l-4.051-1.5a1.44,1.44,0,0,1,1-2.7l8.089,2.989L27.027,28.15a1.92,1.92,0,1,1,3.487-1.606s3.754,8.183,4.018,8.762a5.986,5.986,0,0,1,.327,3.663,6.246,6.246,0,0,1-8.249,4.479l-10.8-3.992a1.44,1.44,0,0,1,1-2.7l4.052,1.5a.96.96,0,1,0,.665-1.8Z" fill="#eebc99"></path></g></svg>',
      awesome: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><g><path d="M24,46A22,22,0,1,1,46,24,22.025,22.025,0,0,1,24,46Z" fill="#ffd764"/> <path d="M12,25a1,1,0,0,1-.707-1.707l6-6a1,1,0,0,1,1.414,1.414l-6,6A1,1,0,0,1,12,25Z" fill="#444"/><path d="M18,25a1,1,0,0,1-.707-.293l-6-6a1,1,0,0,1,1.414-1.414l6,6A1,1,0,0,1,18,25Z" fill="#444"/> <path d="M36,25a1,1,0,0,0,.707-1.707l-6-6a1,1,0,0,0-1.414,1.414l6,6A1,1,0,0,0,36,25Z" fill="#444"/><path d="M30,25a1,1,0,0,0,.707-.293l6-6a1,1,0,0,0-1.414-1.414l-6,6A1,1,0,0,0,30,25Z" fill="#444"/> <path d="M24,39a5,5,0,1,1,5-5A5.006,5.006,0,0,1,24,39Z" fill="#ae453e"/><ellipse cx="24" cy="37" rx="3.974" ry="2" fill="#fa645a"/></g></svg>',
      like: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><g><path d="M24,46A22,22,0,1,1,46,24,22.025,22.025,0,0,1,24,46Z" fill="#ffd764"/> <circle cx="38" cy="28" r="3" fill="#e86c60" opacity="0.5"/> <circle cx="10" cy="28" r="3" fill="#e86c60" opacity="0.5"/> <path d="M19,24a1,1,0,0,1-1-1,2,2,0,0,0-4,0,1,1,0,0,1-2,0,4,4,0,0,1,8,0A1,1,0,0,1,19,24Z" fill="#444"/> <path d="M35,24a1,1,0,0,1-1-1,2,2,0,0,0-4,0,1,1,0,0,1-2,0,4,4,0,0,1,8,0A1,1,0,0,1,35,24Z" fill="#444"/> <path d="M24.059,39a9.025,9.025,0,0,1-7.81-4.537,1,1,0,0,1,1.736-.994,6.989,6.989,0,0,0,12.147,0,1,1,0,0,1,1.736.994A9.024,9.024,0,0,1,24.059,39Z" fill="#444"/></g></svg>',
      sick: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><g><path d="M24,46A22,22,0,1,1,46,24,22.025,22.025,0,0,1,24,46Z" fill="#ffd764"/> <path d="M12,25a1,1,0,0,1-.448-1.895L15.764,21,11.553,18.9a1,1,0,0,1,.894-1.79l6,3a1,1,0,0,1,0,1.79l-6,3A1,1,0,0,1,12,25Z" fill="#444"/> <path d="M36,25a1,1,0,0,1-.446-.105l-6-3a1,1,0,0,1,0-1.79l6-3a1,1,0,1,1,.894,1.79L32.236,21l4.211,2.105A1,1,0,0,1,36,25Z" fill="#444"/> <path d="M40,42a3.97,3.97,0,0,0-2.666,1.04,6.978,6.978,0,0,0-11.551-1.691,5.97,5.97,0,0,0-7.283-.213,5.978,5.978,0,0,0-8.433,1.457A3.954,3.954,0,0,0,8,42a4,4,0,0,0-4,4H44A4,4,0,0,0,40,42Z" fill="#72c472"/> <circle cx="38" cy="36" r="2" fill="#72c472"/> <circle cx="11.5" cy="37.5" r="1.5" fill="#72c472"/> <path d="M14.134,30H33.866c-1.76-1.809-5.421-3-9.866-3S15.894,28.191,14.134,30Z" fill="#fff"/> <path d="M14.134,30A3.579,3.579,0,0,0,13,32.5c0,3.136,4.729,5.5,11,5.5s11-2.364,11-5.5A3.579,3.579,0,0,0,33.866,30Z" fill="#ae453e"/> <path d="M18,30V43a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V30Z" fill="#72c472"/></g></svg>',
      angry: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><g><path d="M24,46A22,22,0,1,1,46,24,22.025,22.025,0,0,1,24,46Z" fill="#e86c60"/> <circle cx="33" cy="25" r="3" fill="#444"/> <circle cx="15" cy="25" r="3" fill="#444"/> <path d="M17.292,37a1,1,0,0,1-.745-1.667,10,10,0,0,1,14.906,0,1,1,0,1,1-1.49,1.334,8,8,0,0,0-11.926,0A1,1,0,0,1,17.292,37Z" fill="#444"/> <path d="M30,21a1,1,0,0,1-.516-1.857l5-3a1,1,0,0,1,1.03,1.714l-5,3A.994.994,0,0,1,30,21Z" fill="#444"/> <path d="M18,21a.994.994,0,0,1-.514-.143l-5-3a1,1,0,0,1,1.03-1.714l5,3A1,1,0,0,1,18,21Z" fill="#444"/></g></svg>'
    };

    if (this._attr) {
      this._element.innerHTML = svg[this._attr];
    }

    return true;
  } // static
  ;

  Svg._init = function _init() {
    var data = new Svg(this);

    data._get();
  };

  _createClass(Svg, null, [{
    key: "VERSION",
    get: function get() {
      return VERSION$12;
    }
  }]);

  return Svg;
}();
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(DATA_KEY$9).forEach(function (el) {
    Svg._init.call(el);
  });
});

/**
 * ---------------------------------------------------------------------------------------
 * Gameforest Bootstrap Gaming Theme: theme.js
 * Copyright (c) 2019 yakuthemes.com (https://yakuthemes.com)
 *
 * @link      https://themeforest.net/item/gameforest-responsive-gaming-html-theme/5007730
 * @version   5.0.3
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPLv3 License
 * ---------------------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var Theme =
/*#__PURE__*/
function () {
  function Theme() {}

  var _proto = Theme.prototype;

  _proto._bootstrap = function _bootstrap() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
  } // private
  ;

  _proto._load = function _load() {
    this._bootstrap();
  } // static
  ;

  Theme._init = function _init() {
    var data = new Theme();

    data._load();
  };

  return Theme;
}();
/**
 * ------------------------------------------------------------------------
 * Load Event
 * ------------------------------------------------------------------------
*/


document.addEventListener('DOMContentLoaded', function () {
  Theme._init.call();
});

exports.Background = Background;
exports.Carousel = Carousel;
exports.Disqus = Disqus;
exports.Embed = Embed;
exports.Facebook = Facebook;
exports.Icons = Icons;
exports.Lightbox = Lightbox;
exports.Navbar = Navbar;
exports.Notify = Notify;
exports.Progress = Progress;
exports.Sticky = Sticky;
exports.Style = Style;
exports.Svg = Svg;
exports.Theme = Theme;

Object.defineProperty(exports, '__esModule', { value: true });

})));
