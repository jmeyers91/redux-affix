# redux-affix

A react-redux's connect function with additional shorthand syntax.

# Usage

`affix` behaves exactly like React-Redux's `connect` function when `mapStateToProps` and `mapDispatchToProps` are functions.

### Pass single state key as `mapStateToProps`

```javascript
affix('todos')
```

With `connect`:

```javascript
connect(({todos}) => ({todos}))
```

### Pass state keys as `mapStateToProps`

```javascript
affix(['todos', 'user'])
```

With `connect`:

```javascript
connect(({todos, user}) => ({todos, user}))
```

### Pass state paths as `mapStateToProps`

```javascript
affix({username: 'user.name', todoCount: 'todos.length'})
```

With `connect`:

```javascript
connect(({todos, user}) => ({
  username: user.name,
  todoCount: todos.length
}))
```

### Pass action creators as `mapDispatchToProps`

```javascript
affix(mapStateToProps, {onToggleTask: toggleTask})
```

With `connect`:

```javascript
connect(mapStateToProps, (dispatch) => ({
  onToggleTask(taskId) {
    return dispatch(toggleTask(taskId));
  }
}))
```
