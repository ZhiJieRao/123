### 关于Element-ui slot的理解
> * https://www.cnblogs.com/aLandon/p/11592596.html
> * https://blog.csdn.net/qq_44218173/article/details/117409592?spm=1001.2101.3001.6650.1

### less-loader报错
> * *Error: Rule can only have one resource source (provided resource and test + include + exclude)*
> * https://blog.csdn.net/weixin_40643648/article/details/109444867

### split和空字符串问题
> *如果一个空字符串用split以空格分割，则返回的结果是空数组，里面会包含了一项空字符串
> false == 0 输出true；因为在做判断的时候，两者中有boolean（布尔类型），会把boolean先转化为number（数字类型），false为0，true是1。也就是等价于判断 0 == 0 ，结果为true。
> console.log(''==false) 输出为true 解释:js中空字符串与0相等，也就意味着空字符串等于false。
> '0' == false 正确输出为true；这里犯了一个错误认为结果会是false，我想的是空字符串等于false，非空字符串等于true，true和false肯定是不等的啊！但是，可但是.......忽略了一个js规则：string（字符串类型）和number作比较的时候，string会先转化成number。此时字符串0转化为了数字0，即： 0 == 0；结果应该为true。

### $set,$nextTick的应用及Object.assign()方法的用法
> 在params.vue组件应用
> 
  * **使用$set共有三种情况**
  * 当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
  * 当你修改数组的长度时，例如：vm.items.length = newLength
  * 由于 JavaScript 的限制，Vue不能检测对象属性的添加或删除
  * https://blog.csdn.net/Oralinge/article/details/103567230
> Object.assign()
  * 对象属性的合并、浅拷贝 -- 能用assign()就能用扩展运算符
  * D:\JS\TESTtest\assign.html


### .native的理解
> 例子 D:\JS\TESTtest\vue_.native

### 利用ES6封装全局方法
> judgeRes.js

### ES7 padStart(),padEnd()的应用
>  如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。---定义全局过滤器 main.js

### 字符串与数字相加减
> 当字符串与数字相加时，数字转换为string类型，起到一个拼接的作用;当字符串与数字相减时，字符串则转换为number类型，即是数字与数字进行相减。 ---Add.vue

### 深拷贝&&浅拷贝
>首先，在JS中，数据类型分为基本数据类型和引用数据类型两种，对于基本数据类型来说，它的值直接存储在栈内存中，而对于引用类型来说，它在栈内存中仅仅存储了一个引用，而真正的数据存储在堆内存中。
https://blog.csdn.net/weixin_57983561/article/details/117198822
> 问题:API要求的提交的goods_cat要以逗号分隔的字符串,而我创建的addForm.goods_cat是数组,如果直接把数组转为字符串,又会不符合**级联选择器**绑定v-model的属性值必须是数组的规定,
![图片](https://img-blog.csdnimg.cn/01f61b2cc5064afba25246d6677b9a66.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAd2VpeGluXzQ2NTgzODA1,size_10,color_FFFFFF,t_70,g_se,x_16)

![图片](https://img-blog.csdnimg.cn/b971c9afaa4141bfba424d69631c0d39.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAd2VpeGluXzQ2NTgzODA1,size_20,color_FFFFFF,t_70,g_se,x_16)

> 如果用浅拷贝、直接*const ADDFORM=this.addForm*赋值,则最终还会改变原对象addForm赋值
> ==所以我们利用深拷贝==
> *const ADDFORM = JSON.parse(JSON.stringify(this.addForm)* 
> *ADDFORM.goods_cat = ADDFORM.goods_cat.join(',')*

这样我们就可以把深拷贝的对象ADDFORM提交给服务器，而且原来的addForm.goods_cat还是数组,ADDFORM.goods_cat则变为符合要求的字符串了

***
如果想要用axios来获取本地的json文件则，则此json==文件一定要放到public文件夹中
  -- Order.vue

> * 扩展运算符合并对象，*obj = {...obj1,...obj2}* 合并两个对象的相同属性，以obj2为准，不同属性会进行拼接。