
/**
 * dependencies.
 */

var configurable = require('configurable.js')
  , emitter = require('emitter')
  , classes = require('classes')
  , mouse = require('mouse')
  , domify = require('domify')
  , tpl = require('./template')
  , resize = require('./resize')
  , merge = require('merge');

/**
 * export `Resizable`.
 */

module.exports = function(el, opts){
  return new Resizable(el, opts);
};

/**
 * initialize new `Resizable`.
 * 
 * @param {Element} el
 * @param {Object} opts
 */

function Resizable(el, opts){
  this.settings = {};
  this.set('handles', 'all');
  this.set(opts || {});
  this.els = [];
  this.el = el;
}

/**
 * mixins.
 */

configurable(Resizable.prototype);
emitter(Resizable.prototype);

/**
 * build resizable.
 * 
 * @return {Resizable}
 */

Resizable.prototype.build = function(){
  var all = split(this.get('handles'))
    , len = all.length
    , handle
    , cname
    , axis;

  // split handles
  function split(str){
    return 'all' == str
      ? 'se.sw.ne.nw.e.w.s.n'.split('.')
      : str.split(/ *, */);
  }

  // classes
  this.classes = classes(this.el);
  this.classes.add('resizable');

  // append handles
  for (var i = 0; i < len; ++i) {
    cname = ' resizable-' + all[i];
    axis = domify(tpl)[0];
    axis.className += cname;
    axis.__axis = all[i];
    this.els.push(axis);
    this.el.appendChild(axis);
  }

  // bind mouse
  this.mouse = mouse(this.el, this);
  this.mouse.bind();

  return this;
};

/**
 * on-mousedown
 */

Resizable.prototype.onmousedown = function(e){
  if (e.target.__axis) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.axis = e.target.__axis;
    var styles = window.getComputedStyle(this.el);
    this.resizing = true;
    this.x = e.pageX;
    this.y = e.pageY;
    this.h = parseInt(styles.height);
    this.w = parseInt(styles.width);
    this.left = parseInt(styles.left) || 0;
    this.top = parseInt(styles.top) || 0;
    this.classes.add('resizable-resizing');
  }
};

/**
 * on-mousemove
 */

Resizable.prototype.onmousemove = function(e){
  if (this.resizing) {
    var fn = resize[this.axis];
    var x = (e.pageX - this.x) || 0;
    var y = (e.pageY - this.y) || 0;
    var o = { x: x, y: y };
    if (!fn) return;
    var style = fn.call(this, e, o);
    if (0 > style.width) return;
    if (0 > style.height) return;
    merge(this.el.style, style);
  }
};

/**
 * on-mouseup
 */

Resizable.prototype.onmouseup = function(e){
  this.classes.remove('resizable-resizing');
  this.resizing = null;
};

/**
 * destroy resizable.
 */

Resizable.prototype.destroy = function(){
  if (this.els.length) {
    var el = this.el;
    this.classes.remove('resizable');
    this.classes = null;
    this.mouse.unbind();
    this.mouse = null;
    while (el = this.els.pop()) {
      this.el.removeChild(el);
    }
  }
};
