/**
 * babel
 * 简单来说，babel是能够编译成es2015+代码，兼容浏览器运行
 */

//  babel 是如何工作的   抽象语法树（Abstract Syntax Tree, AST），Babel 本质上就是在操作 AST 来完成代码的转译。
// AST：  https://ASTexplorer.net

/**
 * 大多数编译器的工作：
 *  1. Parse(解析)：将源代码转换成更加抽象的表示方法(抽象语法树)
 *  2. Transform(转化): 对抽象语法树做一些特殊处理，让它更符合编译器的期望
 *  3. Generate(代码生成)：将第二步经过转换的抽象语法树生成新的代码
 */

// Parse 解析：一般来说，Parse可细分为两个阶段：词法分析，语法分析
/**
 * 词法分析：
 * 词法分析阶段可以看成是对代码进行“分词”，它接收一段源代码，然后执行一段 tokenize 函数，把代码分割成被称为Tokens 的东西。Tokens 是一个数组，由一些代码的碎片组成，比如数字、标点符号、运算符号等等等等，例如下面这样：
 */
// const add = (a, b) => a + b;
//Tokens: [
//   ({ type: "Keyword", value: "const" },
//   { type: "Identifier", value: "add" },
//   { type: "Punctuator", value: "=" },
//   { type: "Punctuator", value: "(" },
//   { type: "Identifier", value: "a" },
//   { type: "Punctuator", value: "," },
//   { type: "Identifier", value: "b" },
//   { type: "Punctuator", value: ")" },
//   { type: "Punctuator", value: "=>" },
//   { type: "Identifier", value: "a" },
//   { type: "Punctuator", value: "+" },
//   { type: "Identifier", value: "b" })
// ];
/**
 * 语法分析：
 * 「词法分析」之后，代码就已经变成了一个 Tokens 数组了，现在需要通过「语法分析」把 Tokens 转化为上面提到过的 AST。
 *
 * 思考：如何实现一个parse把上面的Tokens转换成语法树(如下面const add = (a, b) => a + b;的一段语法树)
 * 官方实现：https://github.com/babel/babel/tree/master/packages/babel-parser/src/parser
 * 什么是二项式？？？
 */
// {
//     "type": "Program",
//         "body": [
//             {
//                 "type": "VariableDeclaration", // 变量声明
//                 "declarations": [ // 具体声明
//                     {
//                         "type": "VariableDeclarator", // 变量声明
//                         "id": {
//                             "type": "Identifier", // 标识符（最基础的）
//                             "name": "add" // 函数名
//                         },
//                         "init": {
//                             "type": "ArrowFunctionExpression", // 箭头函数
//                             "id": null,
//                             "expression": true,
//                             "generator": false,
//                             "params": [ // 参数
//                                 {
//                                     "type": "Identifier",
//                                     "name": "a"
//                                 },
//                                 {
//                                     "type": "Identifier",
//                                     "name": "b"
//                                 }
//                             ],
//                             "body": { // 函数体
//                                 "type": "BinaryExpression", // 二项式
//                                 "left": { // 二项式左边
//                                     "type": "Identifier",
//                                     "name": "a"
//                                 },
//                                 "operator": "+", // 二项式运算符
//                                 "right": { // 二项式右边
//                                     "type": "Identifier",
//                                     "name": "b"
//                                 }
//                             }
//                         }
//                     }
//                 ],
//                 "kind": "const"
//             }
//         ],
//             "sourceType": "module"
// }

/**
 *Transform(转换)
  主要就是操作AST，Babel对于AST是深度优先遍历，
  1. 声明了一个变量，并且知道了它的内部属性（id、init），然后我们再以此访问每一个属性以及它们的子节点。
  2. id 是一个 Idenrifier，有一个 name 属性表示变量名。
  3. 之后是 init，init 也有好几个内部属性：
        type 是ArrowFunctionExpression，表示这是一个箭头函数表达式
        params 是这个箭头函数的入参，其中每一个参数都是一个 Identifier 类型的节点；
        body 属性是这个箭头函数的主体，这是一个 BinaryExpression 二项式：left、operator、right，分别表示二项式的左边变量、运算符以及右边变量。


  Babel 会维护一个称作 Visitor 的对象，这个对象定义了用于 AST 中获取具体节点的方法。
  babel遍历AST会经过两次节点，遍历的时候和退出的时候，所以实际上visitor看起来像这样的(实际上会复杂很多)
  var visitor = {
    Identifier: {
        enter() {
            console.log('Identifier enter');
        },
        exit() {
            console.log('Identifier exit');
        }
    }
  };

  箭头函数是 ES5 不支持的语法，所以 Babel 得把它转换成普通函数，一层层遍历下去，找到了 ArrowFunctionExpression 节点，这时候就需要把它替换成 FunctionDeclaration 节点。所以，箭头函数可能是这样处理的

  源码：https://github.com/babel/babel/tree/master/packages/babel-traverse。
 */

/**
 * Generate(代码生成)
 * 经过上面两个阶段，需要转译的代码已经经过转换，生成新的 AST 了，最后一个阶段理所应当就是根据这个 AST 来输出代码。

    Babel 是通过 https://github.com/babel/babel/tree/master/packages/babel-generator 来完成的。当然，也是深度优先遍历
 */

/**
 * babel 处理流程：Tokenizer(词法分析，将源码分割成Tokens数组)->Parser(语法解析,将Tokens数组转化成AST)->Traverser(遍历AST并应用转换器)-> Transformer(AST转换器，增删改查AST节点)->Generator(代码生成，将AST转换成源代码)
 */

/**
 * babel 核心
 * 1.@babel/core
 *   + 加载和处理配置
 *   + 加载插件
 *   + 调用parse进行语法解析，生成Ast
 *   + 调用Traverser遍历AST，并使用 ***访问者模式***(???) 应用插件对Ast进行转换
 *   + 生成代码，包括SourceMap转换和源码生成
 * 2. parser(@babel/parser)解析，Traverser(@babel/traverse)转换 Generator(@babel/generator)生成代码
 * 3.插件
 *   语法插件(@babel/plugin-syntax-*) parser不支持扩展，所以这个实际上就是开启parser的某个功能特性
 *   转换插件 @babel/plugin-transform-* 普通的转换插件，
 *   预定义集合(@babel/presets-*) 插件集合或者分组，主要方便用户对插件进行管理和使用。比如preset-env含括所有的标准的最新特性; 再比如preset-react含括所有react相关的插件.
 * 4.插件开发辅助
    @babel/template： 某些场景直接操作AST太麻烦，就比如我们直接操作DOM一样，所以Babel实现了这么一个简单的模板引擎，可以将字符串代码转换为AST。比如在生成一些辅助代码(helper)时会用到这个库

    @babel/types： AST 节点构造器和断言. 插件开发时使用很频繁

    @babel/helper-*： 一些辅助器，用于辅助插件开发，例如简化AST操作

    @babel/helper： 辅助代码，单纯的语法转换可能无法让代码运行起来，比如低版本浏览器无法识别class关键字，这时候需要添加辅助代码，对class进行模拟。
 *
 */

/**
 * 插件是顺序调用的，所以新的的插件（实验性的）放在前面，老的插件定义在后面，因为可能需要新的插件解析过老的插件才会识别
 * presets 是从右执行
 * babel 的配置有四种babel.config.js   .babelrc   .babelrc.js   最后一种是在package.json中配置如下：
 * {
    "name": "my-package",
    "babel": {
        "presets": [],
        "plugins": []
    }
   }
 */
