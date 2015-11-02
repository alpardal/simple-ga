(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var proto = {
    init: function init() {
        console.log('Initing app...');
    }
};

var App = {
    create: function create() {
        return Object.create(proto);
    }
};

exports.App = App;

},{}],2:[function(require,module,exports){
'use strict';

var _app = require('./app');

var app = _app.App.create();
app.init();

},{"./app":1}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hbmRyZS9jb2RlL2dhL2FwcC9hcHAuanMiLCIvaG9tZS9hbmRyZS9jb2RlL2dhL2FwcC9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUEsSUFBSSxLQUFLLEdBQUc7QUFDUixRQUFJLEVBQUEsZ0JBQUc7QUFDSCxlQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDakM7Q0FDSixDQUFDOztBQUVGLElBQUksR0FBRyxHQUFHO0FBQ04sVUFBTSxFQUFBLGtCQUFHO0FBQ0wsZUFBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQy9CO0NBQ0osQ0FBQzs7UUFHTSxHQUFHLEdBQUgsR0FBRzs7Ozs7bUJDYk8sT0FBTzs7QUFFekIsSUFBTSxHQUFHLEdBQUcsU0FBSSxNQUFNLEVBQUUsQ0FBQztBQUN6QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IHByb3RvID0ge1xuICAgIGluaXQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdJbml0aW5nIGFwcC4uLicpO1xuICAgIH1cbn07XG5cbmxldCBBcHAgPSB7XG4gICAgY3JlYXRlKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShwcm90byk7XG4gICAgfVxufTtcblxuXG5leHBvcnQge0FwcH07XG4iLCJpbXBvcnQge0FwcH0gZnJvbSAnLi9hcHAnO1xuXG5jb25zdCBhcHAgPSBBcHAuY3JlYXRlKCk7XG5hcHAuaW5pdCgpO1xuIl19
