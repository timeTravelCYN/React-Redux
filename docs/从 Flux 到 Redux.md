# 从 Flux 到 Redux 

## Flux

> Flux一族框架(包括Redux)贯彻的最重要的观点就是---> 单项数据流

### MVC 框架的缺陷

MVC 框架把应用分为三个部分:

* Model(模型)负责管理数据,大部分业务逻辑也应该放在 Model 中;
* View(视图) 负责渲染用户界面,应该避免在 View 中设计业务逻辑
* Controller(控制器) 负责接受用户输入,根据用户输入调用对应的 Model 部分逻辑, 把产生的数据结果交给 View 部分, 让 View 渲染出必要的输出

**在 MVC 中让 View 和 Model 直接对话就是灾难**

一个 Flux 应用包含四个部分

* Dispatcher,处理动作分发，维持 Store 之间的依赖关系
* Store, 负责存储数据和处理数据相关逻辑
* Action, 驱动 Dispatcher 的 JavaScript 对象
* View，视图部分，负责显示用户界面

如果非要把 Flux 和 MVC 做一个结构对比，那么， Flux 的 Dispatcher 相当于 MVC 的
Controller, Flux 的 Store 相当于 MVC 的 Model, Flux 的 View 当然就对应 MVC 的 View
了，至于多出来的这个 Action ，可以理解为对应给 MVC 框架的用户请求 。
在 MVC 框架中，系统能够提供什么样的服务，通过 Controller 暴露函数来实现 。
每增加 一个功能， Controller 往往就要增加一个函数；在 Flux 的世界里，新增加功能
并不需要 Dispatcher 增加新的函数，实际上， Dispatcher 自始至终只需要暴露一个函数
Dispatch ， 当需要增加新的功能时，要做的是增加一种新的 Action 类型， Dispatcher 的对
外接口并不用改变 。

### Flux应用

#### 1. Dispatcher

Dispatcher 存在的作用，就是用来派发 action

#### 2. action

action 顾名思义代表一个‘动作’，这个动作只是一个普通的 JavaScript 对象,代表一个动作的纯数据，类似于 DOM API 中的事件( event )。甚至，和事件相比， action 其实还是更加纯碎的数据对象，因为事件往往还包含一些方法， 比如点击事件就有 preventDefault 方法， 但是 action 对象不自带方法，就是纯碎的数据。

作为管理， action 对象必须有一个名为type的字段， 代表这个 action 对象的类型， 为了记录日志和 debug 方便，这个 type 应该是字符串类型

定义 action 通常需要两个文件，一个定义 action 的类型，一个定义 action 的构造函数。分成两个文件的主要原因是 Store 中会根据 action 类型做不同操作,也就有单独导入 action 类型的需要

#### 3. Store

一个 Store 也是一个对象，这个对象存储应用状态，同时还要接受 Dispatcher 派发的动作，根据动作来决定是否要更新应用状态 。

当 Store 的状态发生变化的时候, 需要通知应用的其他部分作必要的相应。在我们的应用中，做出响应的部分当然就是view部分， 但是我们不应该硬编码这种联系, 应该用消息的方式建立 Store 和 View 的联系。 这就是为什么我们让 CounterStore 扩展了 EventEmitter.prototype， 等于让 CounterStore 成了 EventEmitter 对象, 一个 EventEmitter 实例对象支持下列相关函数。

* emit 函数， 可以广播一个特定事件， 第一个参数是字符串类型的事件名称；
* on 函数，可以增加一个挂载在这个 EventEmitter 对象特定事件上的处理函数, 第一个参数是字符串类型的事件名称，第二个参数是处理函数。
* removeListener 函数， 和 on 函数做的事情相反， 删除挂载在这个 EventEmitter 对象特定事件上的处理函数， 和 on 函数一样， 第一个参数就是事件名称， 第二个参数是处理函数。 要注意， 如果要调用 removeListener 函数， 就一定要保留对处理函数的引用

**严格来说， getCounterValues 这样的 getter 函数, 应该返回一个不可改变的 (Immutable) 数据，这样即使获取到了当前数据，但是也不能够修改，我们要注意，不应该去修改通过 Store 得道的数据**

Dispatcher 有一个函数叫做 register， 接受一个回调函数作为参数，返回的值是一个 token，这个 token 可以用于 Store 之间的同步， 这是 Flux 流程中最核心的部分, 当通过 register 函数把一个回调函数注册到 Dispatcher 之后， 所有派发给 Dispatcher 的 action 对象，都会传递到这个回调中来

比如通过 Dispatcher 派发一个动作

```JavaScript
AppDispatcher.dispatch ({
  type: ActionTypes.INCREMENT, 
  counterCaption: 'First'
});
```
 
 那注册的回调函数就会被调用， 唯一的一个参数就是那个 action 对象，回调函数要做的，就是根据 action 对象来决定如何更新自己的状态

 action 对象必有一个 type 字段，类型是字符串， 用于表示这个 action 对象是什么类型

 action 对象的 type 和 counterCaption 字段结合在一起， 含义就是： ‘名字为 First 的计数器要做加一动作’

 无论是加一或者减一， 都要调用 emitChange 函数， 如果有调用者通过 Counter.addChangeListener 关注了 CounterStore  的状态变化，这个 emitChange 函数调用就会引发监听函数的执行

  SummaryStore 和 CounterStore 接受到 action 对象的顺序是不可控的，但是如果 SummaryStore 先接收了并执行了相应的动作， 此时的 values 其实还没有改变，所以是错的， 所以用到了 waitFor ，它可以接收一个数组做参数，每个元素都是 Dispatcher register 返回的结果，也就是 dispatchToken，  这个 waitFor 函数告诉 Dispatcher,
当前的处理必须要暂停，直到 dispatchToken 代表的那些已注册回调函数执行结束才能继续 。

当一个动作被派发的时候， Dispatcher 就是简单地把所有注册的回调函数全都调用一遍，至于这个动作是不是对方关心的， Flux 的 Dispatcher 不关心，要求每个回调函数去鉴别 。

看起来，这似乎是一种浪费，但是这个设计让 Flux 的 Dispatcher 逻辑最简单化，Dispatcher 的责任越简单，就越不会出现问题 。 毕竟，由回调函数全权决定如何处理 action 对象，也是非常合理的 。

#### 4. View

存在于 Flux 框架中的 React 组件需要实现以下几个功能: 

* 创建时要读取 Store 上状态来初始化组件内部状态
* 当 Store 上状态发生变化时， 组件要立刻同步更新内部状态保持一致
* View 如果要改变 Store 状态， 必须且只能派发 action

### Flux 的优势

回顾一下完全只使用 React 实现的版本， 应用的状态数据只存在于 React 组件之中, 每个组件都要维护驱动自己渲染的状态数据, 单个组件的状态还好维护， 但是如果多个组件之间的状态有关联, 那就麻烦了。React只提供了 props 方法让组件之间通信， 组件之间关系稍微复杂一点， 这种方式就显得非常笨拙

Flux 架构之下， 应用的状态被放在了 Store 中， React 组件只是扮演 View 的作用， 被动根据 Store 的状态来渲染。 在上面的例子中， React 组件依然有自己的状态， 但是已经完全沦为 Store 组件的一个映射， 而不是主动变化的数据。

在 Flux 的实现版本里，用户的操作引发的是一个“动作”的派发，这个派发的动作会发送给所有的 Store 对象，引起 Store对象的状态改变，而不是直接引发组件的状态改变 。 因为组件的状态是 Store 状态的映射，所以改变了 Store 对象也就触发了 React 组件对象的状态改变，从而引发了界面的重新渲染 。

在 Flux 的理念里，如果要改变界面，必须改变 Store 中的状态，如果要改变 Store 中的状态，必须派发一个 action 对象，这就是规矩 。 在这个规矩之下，想要追溯一个应用的逻辑就变得非常容易

我们已经讨论过 MVC 框架的缺点 MVC 最大的问题就是无法禁绝 View 和 Model 之间的直接对话，对应于 MVC 中 View 就是 Flux 中的 View ，对应于 MVC 中的 Model 的就是 Flux 中的 Store ，在 Flux 中， Store 只有 get 方法，没有 set 方法，根本可能直接去修改其内部状态， View 只能通过 get 方法获取 Store 的状态，无法直接去修改状态，如果 View 想要修改 Store 状态的话，只有派发一个 action 对象给 Dispatcher。

### Flux 的不足

#### 1. Store 之间依赖关系

如果两个 Store 之间有逻辑依赖关系，就必须用上 Dispatcher 的 waitFor 函数。

* CounterStore 必须要把注册回调函数时产生的 dispatchToken 公之于众
* SummaryStore 必须要在代码里建立对 CounterStore 的 dispatchToken 的依赖

#### 2. 难以进行服务器端渲染

*如果要在服务端渲染，输出不是一个 DOM 树， 而是一个字符串， 准确来说就是一个全是 HTML 的字符串*

和一个浏览器网页只服务于一个用户不同，在服务器端要同时接受很多用户的请求，如果每个 Store 都是全局唯一的对象，那不同请求的状态肯定就乱套了 。

#### 3. Store 混杂了逻辑和状态

Store 封装了数据和处理数据的逻辑，用面向对象的思维来看，这是一件好事，毕竟对象就是这样定义的 。 但是，当我们需要动态替换一个 Store 的逻辑时，只能把这个 Store 整体替换掉，那也就无法保持 Store 中存储的状态 。


## Redux

> 我们把 Flux 看作一个框架理念的话, Redux 是 Flux 的一种实现。

### Redux 的基本原则

**Flux 的基本原则是“单向数据流”， Redux在此基础上强调三个基本原则**

* 唯一数据源
* 保持状态只读
* 数据改变只能通过纯函数完成

#### 1. 唯一数据源

唯一数据源指的是应用的状态数据应该只存储在唯一的一个 Store 上。

在 Flux 中， 可以拥有多个 Store，这样容易造成数据冗余， 数据一致性方面就会出问题。 虽然 waitFor 方法可以保证多个 Store 之间的更新顺序, 但是这又产生了不同 Store 之间的显示依赖关系

这个唯一 Store 上的状态，是一个树形的对象，每个组件往往只是用树形对象上一部分的数据

#### 2. 保持状态只读

就是不能直接去修改状态， 要修改 Store 的状态， 必须要通过派发一个 action 来完成

#### 3. 数据改变只能通过纯函数完成

` Reducer === 纯函数`

在 Redux 中， 每个 reducer 的函数签名如下所示:

 `reducer(state, action)`

 第一个参数 State 是当前的状态， 第二个参数 action 是接收到的 action 对象， 而 reducer 要做的事情， 就是根据 state 和 action 的值产生一个新的对象返回,注意reducer必须是纯函数，也就是说结果完全由传入的参数决定而不会产生任何副作用

Flux 更新状态的函数只有一个参数 action, 因为状态是由 Store 直接管理的。

reducer 不光接受 action 为参数， 还接受 state 为参数。也就是说， Redux 的 reducer 只负责计算状态，却并不负责存储状态

### Redux 实例

Redux 中每个 action 构造函数都返回一个 action 对象，而 Flux 版本中 action 构造函数并不返回什么，而是把构造的动作函数立刻通过调用 Dispatcher 的 dispatch 函数派发出去 。

### 容器组件和傻瓜组件

在 Redux 框架下， 一个 React 组件基本上就是要完成以下两个功能

* 和 Redux Store 打交道， 读取 Store 的状态，用于初始化组件的状态，同时还要监听 Store 的状态改变； 当 Store 状态发生变化时， 需要更新组件状态， 从而驱动组件重新渲染， 当需要更新 Store 状态时， 就要派发 action 对象

* 根据当前 props 和 state 渲染出用户界面

**让一个组件只专注做一件事，如果发现一个组件做的事情太多了，就可以吧这个组件拆分成多个组件，让每个组件依然只专注做一件事**

我们实际中可以考虑拆分两个组件，分别承担一个任务，然后把两个组件嵌套起来，是父子关系。

  承担第一个任务的组件，也就是负责和 Redux Store 打交道的组件，处于外层，叫做容器组件(聪明组件)， 对于承担第二个任务的组件， 也就是只专心负责渲染界面的组件, 处于内层， 叫做展示组件(傻瓜组件)。

  *傻瓜组件就是一个纯函数，根据 props 产生结果*

  这样的组件拆分方式不只是功能分离，还有就是**傻瓜组件不需要有状态了**，状态全部交由容器组件打点，通过props渲染界面


### 组件 Context

在实际工作中， 一个应用的规模会很大，不会所有的组件都放在一个代码库中，有时候还要通过 npm 方式引入第三方的组件 。 想想看，当开发一个独立的组件的时候，都不知道自己这个组件会存在于哪个应用中，当然不可能预先知道定义唯一 Redux Store 的文件位置了，所以，在组件中直接导人 Store 是非常不利于组件复用的 。
一个应用中，最好只有一个地方需要直接导人 Store ，这个位置当然应该是在调用最顶层 React 组件的位置 。
    

React 提供了一个叫 Context 的功能， 完美的解决这个问题

所谓 Context, 就是上下文环境，让一个树状组件上所有组件都能访问一个共同的对象，为了完成这个任务，需要上级组件和下级组件配合

上级组件要宣城自己支持 context，并且提供一个函数来返回代表 Context 的对象

所有子孙组件， 只要宣城自己需要这个 context， 就可以通过 this.context 访问到这个共同的环境对象


创建一个通过的 context 提供者，可以应用在任何一个应用中， 我们吧这个组件叫做 Provider。 它也是一个 React 组件， 它的 render 函数就是简单的把子组件渲染出来，不做任何附加事情

每个 React 组件的 props 中都有一个特殊属性 children， 代表的是子组件

Provider 需要有一个 getChildContext 方法以及需要定义类的 childContextTypes， 只有这两者都齐备， Provider 的子组件才有可能访问到 context


Context 这个功能相当于提供了一个全局可以访问的对象，但是全局对象或者说全局变量肯定是我们应该避免的用法，只要有一个地方改变了全局对象的值，应用中其他部分就会受影响。所以应该要谨肾使用。

对于 Redux ，因为 Redux 的 Store 封装得很好，没有提供直接修改状态的功能，就是说一个组件虽然能够访问全局唯一的 Store ，却不可能直接修改 Store 中的状态，这样部分克服了作为全局对象的缺点 。 而且，一个应用只有一个 Store ，这个 Store 是 Context里唯一需要的东西，并不算滥用，所以，使用 Context 来传递 Store 是一个不错的选择

### React-Redux

