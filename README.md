### 关于Element-ui slot的理解
> * https://www.cnblogs.com/aLandon/p/11592596.html
> * https://blog.csdn.net/qq_44218173/article/details/117409592?spm=1001.2101.3001.6650.1

### less-loader报错
> * Error: Rule can only have one resource source (provided resource and test + include + exclude)
> * https://blog.csdn.net/weixin_43862596/article/details/122850154s

### split和空字符串问题
> *如果一个空字符串用split以空格分割，则返回的结果是空数组，里面会包含了一项空字符串
> false == 0 输出true；因为在做判断的时候，两者中有boolean（布尔类型），会把boolean先转化为number（数字类型），false为0，true是1。也就是等价于判断 0 == 0 ，结果为true。
> console.log(''==false) 输出为true 解释:js中空字符串与0相等，也就意味着空字符串等于false。
> '0' == false 正确输出为true；这里犯了一个错误认为结果会是false，我想的是空字符串等于false，非空字符串等于true，true和false肯定是不等的啊！但是，可但是.......忽略了一个js规则：string（字符串类型）和number作比较的时候，string会先转化成number。此时字符串0转化为了数字0，即： 0 == 0；结果应该为true。

### $set,$nextTick的应用
> 在params.vue组件应用

### .native的理解
> 例子 D:\JS\TESTtest\vue_.native

### 利用ES6封装全局方法
> judgeRes.js