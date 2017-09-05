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

#### 2.