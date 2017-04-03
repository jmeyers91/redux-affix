const connect = require('react-redux').connect;
const get = require('lodash.get');

const affix = wrapConnect(connect);
affix.wrapConnect = wrapConnect;

// connect('*')
function identity(value) {
  return value;
}

// connect(['some', 'anotherKey'])
function mapStateToPropsFromKeys(keys) {
  return function mapStateToProps(state) {
    return keys.reduce((props, key) => {
      props[key] = state[key];
      return props;
    }, {});
  }
}

// connect({propKey: 'some.store.state.path'})
function mapStateToPropsFromMap(map) {
  return function mapStateToProps(state) {
    return Object.keys(map).reduce((props, key) => {
      const path = map[key];
      props[key] = get(state[key], path);
      return props;
    }, {});
  }
}

// connect(mapStateToProps, {someProp: someActionCreator})
function mapDispatchToPropsFromMap(map) {
  const propNames = Object.keys(map);
  return function mapDispatchToProps(dispatch) {
    return propNames.reduce((props, propName) => {
      const actionCreator = map[propName];
      props[propName] = function(...args) {
        return dispatch(actionCreator(...args));
      };
      return props;
    }, {});
  }
}

function wrapMapStateToProps(mapStateToProps) {
  if(mapStateToProps) {
    const type = typeof mapStateToProps;
    if(type === 'string') {
      return mapStateToPropsFromKeys([mapStateToProps]);
    } else if(Array.isArray(mapStateToProps)) {
      return mapStateToPropsFromKeys(mapStateToProps);
    } else if(type === 'object') {
      return mapStateToPropsFromMap(mapStateToProps);
    }
  }
  return mapStateToProps;
}

function wrapMapDispatchToProps(mapDispatchToProps) {
  if(mapDispatchToProps && typeof mapDispatchToProps === 'object') {
    return mapDispatchToPropsFromMap(mapDispatchToProps);
  }
  return mapDispatchToProps;
}

function wrapConnect(connect) {
  return function affix(mapStateToProps, mapDispatchToProps, mergeProps, options) {
    return connect(
      wrapMapStateToProps(mapStateToProps),
      wrapMapDispatchToProps(mapDispatchToProps),
      mergeProps,
      options
    );
  }
}
