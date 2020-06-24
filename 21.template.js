// 模板原理
// 关于 Vue 编译原理这块的整体逻辑主要分三个部分，也可以说是分三步，这三个部分是有前后关系的：

// 第一步是将 模板字符串 转换成 element ASTs（解析器）
// 第二步是对 AST 进行静态节点标记，主要用来做虚拟DOM的渲染优化（优化器）
// 第三步是 使用 element ASTs 生成 render 函数代码字符串（代码生成器）

// 解析器主要是将模板字符串转换成element AST
{
  tag: "div";
  type: 1;
  staticRoot: false;
  static: false;
  plain: true;
  parent: undefined;
  attrsList: [];
  attrsMap: {
  }
  children: [
    {
      tag: "p",
      type: 1,
      staticRoot: false,
      static: false,
      plain: true,
      parent: { tag: "div" },
      attrsList: [],
      attrsMap: {},
      children: [
        {
          type: 2,
          text: "{{name}}",
          static: false,
          expression: "_s(name)"
        }
      ]
    }
  ];
}
// 这段模板字符串会扔到 while 中去循环，然后 一段一段 的截取，把截取到的 每一小段字符串 进行解析，直到最后截没了，也就解析完了
