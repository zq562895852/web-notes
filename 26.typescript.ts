// 类型定义
type IUserInfoFunc = (user: IUser) => string;

// 接口定义
interface IUser {
  name: string;
  age: number;
  findOne: () => void;
}

const getUser: IUser = {
  name: "dd",
  age: 10,
  findOne() {}
};

interface Func {
  (x: number, y: number, desc?: string): void;
}

const sum: Func = function(x, y, desc = "可选") {};

// 接口实现
