# 模块化 React 和 Redux 应用

## 模块化应用要点

Reat 和 Redux 都信奉的公式:  `UI=render(state)`

React 适合于视图层面的东西, 但是不能指望靠 React 来管理应用的状态, Redux 适合管理状态

我们开发一个新应用的时候，要考虑以下几件事情:

* 代码文件的组织结构
* 确定模块的边界
* Store 的状态树设计

## 代码文件的组织方式

在 MVC 框架中，应用代码分为 Controller、 Model 和 View， 这叫做 ‘按角色组织’

受这种 ‘按角色组织’ 代码文件的影响， 在 Redux 应用中，就有一种代码组织方法如下：

```JavaScript
|--reducers/
 ----todoReducer.js
 ----filterReducer.js
|--actions/
 ----todoActions.js
 ----filterActions.js
|--components/
 ----todoList.js
 ----todoItem.js
|--containers/
 ----todoListContainer.js
 ----todoItemContainer.js
 ----filterContainer.js
```

各个目录代码文件的角色如下：

* reducer 目录包含所有 Redux 的 reducer
* actions 目录包含所有 action 构造函数
* components 目录包含所有的傻瓜组件
* containers 目录包含所有的容器组件

`‘按角色组织’`虽然看起来不错，但是不利用应用的扩展，当需要对一个功能进行修改，牵扯到了各个角色，那么你得很费劲才能在各个目录之间跳转，比较浪费时间

### 按功能组织

Redux 适合于 ‘按功能组织’，就是把完成同一应用功能的代码放在一个目录下，一个应用功能包含多个角色代码。

拿现在常见的 Todo 应用为例子，文件目录列表如下

```
|--todoList/
 ----actions.js
 ----actionTypes.js
 ----index.js
 ----reducer.js
 ----views/
 ------component.js
 ------container.js
|--filter/
 ----actions.js
 ----actionType.js
 ----index.js
 ----reducer.js
 ----views/
 ------component.js
 ------container.js
```

* actionTypes 定义 action 类型
* action.js 定义 action 构造函数, 决定了这个功能模块可以接受的动作
* reducer.js 定义这个功能模块如何响应 actions.js 中定义的动作
* views目录，包含这个功能模块所有的 React 组件,包括傻瓜组件和容器组件
* index.js 这个文件吧所有角色导入，然后统一导出

当你需要修改某个功能模块的代码的时候，只要关注对应的目录就行了。

### 模块接口

> 在最理想的情况下，我们应该通过增加代码就能增加系统的功能，而不是通过对现有代码的修改来增加功能

以上，就是程序员的最理想状态。

React 组件本身就应该具有 低耦合性 和 高内聚性，不过，在 Redux 中， React 组件扮演的就是一个视图的角色，还有 reducer、 actions 这些角色参与，对于整个 Redux 应用而言，整体由模块构成，但是模块不再是 React 组件， 而是由 React 组件加上相关 reducer 和 actions 构成的一个小整体

可以预期每个模块之间会有依赖关系，那么我们希望对方如何导入呢？

现在我们既然把一个目录看成一个模块，那么我们要做的就是明确这个模块对外的接口，而这个接口应该实现吧内部封装起来

比如，我们在 todoList/index.js 中，

```JavaScript
import * as actions from './ actions.js ';
import reducer from './reducer.js';
import view from './views/container.js';
export {actions, reducer, view}
```
如果 filter 中的组件想要使用 todoList 中的功能，应该导人 todoList 这个目录，因为导人一个目录的时候，默认导人的就是这个目录下的 index.js 文件， index. 文件中导出的内容，就是这个模块想要公开出来的接口 。

### 状态树设计

因为所有的状态都存在 Store 上， Store 的状态树设计，直接决定了要写哪些 Reducer， 还有 action怎么写，是所有程序逻辑的源头

状态树设计要遵循如下几个原则：

* 一个模块控制一个状态节点
* 避免冗余数据
* 树形结构扁平

#### 一个状态节点只属于一个模块

在 Redux 应用中， Store 上的每个 state 都只能通过 reducer 来更改， 而我们每个模块都有机会导出一个自己的 reducer ， 这个导出的 reducer 最多只能够更改状态树上属于自己那个节点的数据，因为 reducer 之间对状态树上的修改权是互斥的，不可能让两个 reducer 都可以修改同一个状态树上的节点

比如， A 模块的 reducer 负责修改状态树上 a 字段下的数据，那么另一个模块 B 的 reducer 就不可能有机会修改 a 字段下的数据

实际上 Redux Store 上的全部状态，在任何时候，对任何模块都是开放的，通过 store.getState() 总能够读取当整个状态树的数据


#### 避免冗余数据

如果 Store 上存在冗余数据，那么对数据一致性就可能会有影响。

传统的关系型数据库中， 对数据结构的各种‘范式化’，其实就是在去除数据的冗余。

#### 树形结构扁平

如果树形结构层次很深， 往往意味着树形很复杂， 一个很复杂的状态树是难以管理的

## Todo 应用实例

### Todo状态设计

