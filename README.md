# redux-thunk-resource
a library used with redux-thunk to make redux easier

redux-thunk-resource主要是用来减少模版代码，让redux写起来更方便，与redux-thunk结合使用。

它主要做了两件事：
1. 将action和reducer结合，写action时直接写reducer，省去了定义action_type的麻烦。
2. 以资源概念为核心，默认为含有异步请求的资源添加isFetching和error状态。

[![Build Status](https://travis-ci.org/wcxaa/redux-thunk-resource.svg?branch=master)](https://travis-ci.org/wcxaa/redux-thunk-resource)
[![npm version](http://img.shields.io/npm/v/redux-thunk-resource.svg)](https://www.npmjs.com/package/redux-thunk-resource)
[![npm downloads](http://img.shields.io/npm/dm/redux-thunk-resource.svg)](https://www.npmjs.com/package/redux-thunk-resource)

## Getting Started
### Installation
```bash
$ npm install --save redux-actions
```
or
```bash
$ yarn add redux-actions
```

## Usage
```js
import Resource from 'redux-thunk-resource';

const resource = new Resource();

const setObj = resource.createAction(obj => () => ({ ...obj }));

export const fetchObj = resource.createRequest(() => async dispatch => {
    const res = await /* any fetch */ fetch({
        url: `http://www.example.com/obj`,
    });
    dispatch(setObj(res));
});

export default resource.createReducer();

```

## Example
[React-cnodejs](https://github.com/wcxaa/React-cnodejs)


## API
### Resource
#### Constructor(config)
#####  Arguments
1. `config` (*Object*): 
```js
{
    hasAddOns: boolean // default: true
}
```
新建resource时，可以传入配置项，hasAddOns默认为true，为资源添加isFetching、error状态，为false时不加这些状态。

#### Resource Methods
##### createAction
```js
const setSearchKey = resource.createAction( searchKey => state => ({
    searchKey: { ...state.searchKey, ...searchKey },
}));

// use
dispatch(setSearchKey({
    page: 1,
    ipp: 20,
}))
```
上面createAction括号中searchKey是需要设置到store的参数，第二层state是此次设置前此资源的state，最后返回一个新state，会和原来state合并。

##### createRequest
```js
export const fetchObj = resource.createRequest(user => async dispatch => {
    const res = await /* any fetch */ fetch({
        url: `http://www.example.com/obj`,
        data: user
    });
    dispatch(setObj(res));
});
// or
export const fetchObj = resource.createRequest(() => dispatch =>
    request({
        url: `http://www.example.com/obj`,
        mock: {
            a: 'a',
            b: 'b',
        },
    }).then(res => dispatch(setObj(res))),
);

// use
store.dispatch(fetchObj({
	id:1
}));
// or
// 可以和react-redux结合使用，connect后直接
fetchObj({
	id:1
});
```
createRequest会为request做一层包装, 第一层参数user是fetchObj时传入的参数，第二层开始就是redux-thunk的写法，具体请查阅[此处](https://github.com/gaearon/redux-thunk#motivation)。注意：
1. 如上所示，无论用async或promise，返回必须是个promise。
2. createRequest中只能包装一个请求，如果包含2个或2个以上的请求，需要将资源进行拆分。比如排行榜中需要发2个请求，一个是全部的排行榜，一个是自己的排行，需要将资源拆分成all和mine，变成2个资源，每个资源内一次dispatch只发一个请求。

当然也可以不用createRequest包装，此时写法就是redux-thunk的标准写法
注意：如果Resource构建函数中传入hasAddOns: false，则使用createRequest包装会报错。

##### createReducer
```js
export default resource.createReducer(initState);
```
创建一个reducer，可以传入此resource的initState。


