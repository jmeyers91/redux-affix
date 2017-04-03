'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.wrapConnect = wrapConnect;

var _reactRedux = require('react-redux');

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// connect('*')
function identity(value) {
  return value;
}

// connect(['some', 'anotherKey'])
function mapStateToPropsFromKeys(keys) {
  return function mapStateToProps(state) {
    return keys.reduce(function (props, key) {
      props[key] = state[key];
      return props;
    }, {});
  };
}

// connect({propKey: 'some.store.state.path'})
function mapStateToPropsFromMap(map) {
  return function mapStateToProps(state) {
    return Object.keys(map).reduce(function (props, key) {
      var path = map[key];
      props[key] = (0, _lodash2.default)(state[key], path);
      return props;
    }, {});
  };
}

// connect(mapStateToProps, {someProp: someActionCreator})
function mapDispatchToPropsFromMap(map) {
  var propNames = Object.keys(map);
  return function mapDispatchToProps(dispatch, ownProps) {
    return propNames.reduce(function (props, propName) {
      var actionCreator = map[propName];
      props[propName] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        dispatch(actionCreator.apply(undefined, args.concat([ownProps])));
      };
      return props;
    }, {});
  };
}

function wrapMapStateToProps(mapStateToProps) {
  if (mapStateToProps) {
    var type = typeof mapStateToProps === 'undefined' ? 'undefined' : _typeof(mapStateToProps);
    if (type === 'string') {
      return mapStateToPropsFromKeys([mapStateToProps]);
    } else if (Array.isArray(mapStateToProps)) {
      return mapStateToPropsFromKeys(mapStateToProps);
    } else if (type === 'object') {
      return mapStateToPropsFromMap(mapStateToProps);
    }
  }
  return mapStateToProps;
}

function wrapMapDispatchToProps(mapDispatchToProps) {
  if (mapDispatchToProps && (typeof mapDispatchToProps === 'undefined' ? 'undefined' : _typeof(mapDispatchToProps)) === 'object') {
    return mapDispatchToPropsFromMap(mapDispatchToProps);
  }
  return mapDispatchToProps;
}

// for testing
function wrapConnect(connect) {
  return function affix(mapStateToProps, mapDispatchToProps, mergeProps, options) {
    return connect(wrapMapStateToProps(mapStateToProps), wrapMapDispatchToProps(mapDispatchToProps), mergeProps, options);
  };
}

exports.default = wrapConnect(_reactRedux.connect);