# 深入浅出React和Redux

## 易于维护组件的设计要素

拆分组件最关键的就是确定组件的边界。
组件的划分要满足高内聚和低耦合
高内聚指的是把逻辑紧密相关的内容放在一个组件中 。 用户界面无外乎内容 、 交互
行为和样式
低耦合指的是不同组件之间的依赖关系要尽量弱化，也就是每个组件要尽量独立 

## React组件的数据

prop是组件的对外接口，state是组件的内部状态，对外用prop，内部用state


### React的prop

React组件的prop很像是HTML元素的属性，不过，HTML组件属性的值都是字符串类型，即使是内嵌JavaScript，也依然是字符串形式表示代码。React组件的prop所能支持的类型则丰富得多，除了字符串，可以使任何一种JavaScript语言支持的数据类型。当 prop 的类型不是字符串类型时，在 JSX 中必
须用花括号｛｝把 prop 值包住

在构造函数中可以通过props读取prop的值，在其他函数中需要通过this.props读取。

通过PropTypes对props进行规范

可以用defaultProps设置默认

### React的state

组件的state必须是一个JavaScript对象，即使我们需要存储的只是一个数字类型的数据，也只能把它寸作state某个字段对应的值。

this.state读取组件当前的state，但是改变state必须用this.setState

this.setState所做的事情，首先是改变this.state的值，然后驱动组件经历更新过程。

### prop和state的对比

* prop用于定义外部接口，state用于记录内部状态。

* prop的赋值在外部世界使用组件时，state的赋值在组件内部

* 组件不应该改变prop的值，而state存在的目的就是让组件来改变的

## 组件的生命周期

老生常谈的生命周期(也叫钩子函数)

React严格定义了组件的声明周期，生命周期可能会经历如下三个过程：

1. 装载过程(Mount), 也就是把组件第一次在DOM树种渲染的过程

2. 更新过程(Update), 当组件被重新渲染的过程

3. 卸载过程(Unmount),组件从DOM中删除的过程

### mount

装载过程，当组件第一次被渲染的时候，依次调用的:

* constructor
* getInitialState
* getDefaultProps
* componentWillMount
* render
* compoenntDidMount

1. constructor

这是ES6中每个类的构造函数，要创造一个组件类的示例，当然会调用对应的构造函数

**并不是每个组件都需要定义自己的构造函数，无状态的React组件往往就不需要定义构造函数**

React组件需要构造函数的目的往往是

* 初始化state,因为组件生命周期中任何函数都可能要访问state,那么整个生命周期中第一个被调用的构造函数自然是初始化state最理想的地方

* 绑定成员函数的this环境

有一种 `this.foo = ::this.foo` 等同于 `this.foo = this.foo.bind(this)` 这里所使用的两个冒号操作符叫做bind操作符，但是bind操作符可能不会成为ES标准语法的一部分，所以，尽量不要使用！！！

2. getInitialState 和 getDefaultProps

getInitialState这个函数的返回值会初始化组件的state，但这个方法只有用React.createClass方法创造的组件类才会发生作用，ES6语法这个函数不会产生作用。

GetDefaultProps 函数的返回值可以作为props的初始值，ES6方法定义的组件中也不会用到。

getInitialState只出现在装载过程中，整个生命周期过程中，这个函数只被调用一次

3. render

 render函数是每个React组件一定要实现的函数

 一个组件要发挥作用，总是要渲染一些东西，render函数并不做实际的渲染动作，他只是返回一个jsx描述的结构，最终由React来渲染

 某些特殊组件的作用不是渲染界面，或者组件在某些情况下选择没有东西可画，那就让render函数返回一个null或者false,等于告诉React,这个组件这次不需要渲染任何DOM元素

 *render函数应该是一个纯函数*，完全根据state和props来决定返回的结果，不要产生任何副作用。在render中调用setState是错误的，因为一个纯函数不应该引起状态的改变

4. componentWillMount 和 componentDidMount

componentWillMount 会在调用 render 函数之前被调用，  componetDidMount 会在调用
 render 函数之后被调用

 通常不用定义 componentWillMount 函数，这个函数发生在“将要装载”的时候，这个时候没有任何渲染出来的结果，即使调用this.setState修改状态也不会引发重新绘制。换句话说，这个钩子中做的事情都可以提前到constructor中去做，可以认为这个函数存在的主要目的就是为了和componentDidMount对称

render 函数被调用完之后， componentDidMount 函数是不会被立刻调用的， componentDidMount 被调用的时候， render 函数返回的东西已经引发了渲染，组件已经被“装载”到了DOM树上

可以清楚地看到,虽然 componentWillMount 都是紧贴着自己组件的 render 函数之前被调用的, 但 componentDidMount 不是紧跟着 render 函数被调用，当所有三个组件的 render 函数都被调用之后 ，三个组件的 componentDidMount 才连载一起被调用

之所以会有上面的现象，是因为 render 函数本身并不往 DOM 树上渲染或者装载内
容，它只是返回一个 JSX 表示的对象，然后由 React 库来根据返回对象决定如何渲染 。
而 React 库肯定是要把所有组件返回的结果综合起来，才能知道该如何产生对应的 DOM
修改 。 所以，只有 React 库调用三个 Counter 组件的 render 函数之后，才有可能完成装
载，这时候才会依次调用各个组件的 componentDidMount 函数作为装载过程的收尾 。

### 更新过程

当props或者state被修改的时候，就会引发组件的更新过程

* componentWillReceiveProps

* shouldComponentUpdate

* componentWillUpdate

* render 

* componentDidUpdate

 1. componentWillReceiveProps(nextProps)

 只要是父组件的render函数被调用,在render函数里面被渲染的子组件就会经历更新过程，不管父组件传给子组件的props有没有改变，都会触发子组件的 componentWillReceiveProps函数

 this.setState 方法触发的更新过程不会调用这个函数，因为这个函数会根据新的props值来计算出是不是要更新内部状态 state。 更新组件内部状态的方法就是 this.setState , 如果this.setState 的调用导致 componentWillReceiveProps 再一次被调用，那就是一个死循环了。

**在 onClick 中用匿名函数虽然简洁，但是并不值得提倡，因为每次渲染都会创造一个新的匿名方法对象,而且有可能引发子组件不必要的重新渲染。**

所以调用这个钩子的时候，有必要吧传入参数 nextProps 和 this.props 做对比，只有改变了的时候才执行某些逻辑

2. shouldComponentUpdate(nextProps, nextState)

除了 render 函数，shouldComponentUpdate 可能是 React 组件生命周期中最重要的一个函数了，因为它决定了一个组件什么时候不需要渲染，这两个也是react生命周期函数中唯二两个要求有返回结果的函数。render 函数的返回结果将用于构造 DOM 对象，而 shouldComponentUpdate 函数返回一个布尔值，告诉 React 库这个组件在这次更新过程中是否要继续 。

3. componentWillUpdate 和 componentDidUpdate 

如果组件的 shouldComponentUpdate 函数返回 true, React 接下来就会依次调用对应
组件的 componentWillUpdate 、 render 和 componentDidUpdate 函数 。

### 卸载过程

componentWillUnmount 中的工作往往和 componentDidMount 有关，比如，在
componentDidMount 中用非 React 的方法创造了一些 DOM 元素，如果撒手不管可能会造
成内存泄露，那就需要在 componentWillUnmount 中把这些创造的 DOM 元素清理掉。

## 组件向外传递数据

通过props传递进入一个函数，在组件中触发这个props的函数，然后父组件执行相应的函数修改state

## React 组件 state 和 prop 的局限

*每个 Counter 组件都有自己的状态记录当前计数，而父组件 ControlPanel 也有一个状态来存储所有 Counter 计数总和，也就是说，数据发生了重复*

数据一旦重复，带来的一个问题就是如何保证重复的数据一致，如果数据存多份而且不一致，那就很难保证结果正确

干脆不要让任何一个 React 组件存放数据，把数据源存放在 React 组件之外形成全局状态, 让各个组件保持和全局状态一致

props也存在问题，如果爷爷要给孙子传递某些信息，那么必须经过父亲也支持这些props，违反了低耦合的设计要求。



