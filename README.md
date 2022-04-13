# <p align="center">simple-fireworks 【简单的烟花】</p>
#### <p align="center">简单快捷的在js中生成烟花效果 <br> 你可以自定义出属于你的烟花效果 </p>

>注意：simple-fireworks会在body里面创建一个canvas对象，该canvas并不会影响下层内容的点击事件


### 使用方法：

````
npm i simple-fireworks
````

````
import fireworks from 'simple-fireworks'
````

````
// 获取点击坐标
document.addEventListener('mousedown', (e) => {
    //window.devicePixelRatio 屏幕像素比
    var x = e.clientX * window.devicePixelRatio;
    var y = e.clientY * window.devicePixelRatio;

    // 向烟花数组中添加 从底部飞出的 粒子  
    fireworks.particles.push(new fireworks.PointLine(x,y))

}, false);
````


### erase
> 设置canvas擦除 值越小粒子拖尾越长 默认值为0.1 最大值为1 
````
    fireworks.erase[0] = 0.1;
````
    
### LoopFunction
> 该函数会在每一次requestAnimFrame循环后调用 你可以使用下方代码制作一个简易的打点器

````
    fireworks.LoopFunction[0]=function(){}
````
> 这里不使用setInterval 是因为setInterval会在网页隐藏之后继续运行，这样就会导致，用户在网页隐藏后再次打开网页，会一次性生成过多的粒子，requestAnimFrame动画函数会在网页隐藏后自动暂停
````
    // 设置自动生成烟花 每四十个requestAnimFrame循环执行一次
    // 制作一个定时器，每四十个滴答执行一次
    let timerTotal = 40;
    let timerTick = 0;

    fireworks.LoopFunction[0] = function () {

      if (timerTick >= timerTotal) {

        //随机的x,y位置
        let x = Math.random() * window.innerWidth * window.devicePixelRatio;
        let y = Math.random() * window.innerHeight * window.devicePixelRatio;

        //向粒子数组中添加粒子
        var i = 100;
        while (i--) {
          fireworks.particles.push(new fireworks.LineParticle(x, y));
        }

        timerTick = 0;
      } else {
        timerTick++;
      }

    };
````


### LineParticle

> LineParticle 生成一个线形粒子  x:横坐标 y:纵坐标 obj:参数对象 用于修改粒子的参数

````
    //向粒子数组中添加粒子
    var i = 100;
    while (i--) {
        fireworks.particles.push(new fireworks.LineParticle(x, y,obj));
    }
````

#### LineParticle obj参数对象说明

| 参数名 | 必填 | 值 |范围| 默认值 | 描述 |
| :---: | :---: | :---: | :---: | :---: | :---: |
|MinSpeed|false|Number||1|最小速度|
|MaxSpeed|false|Number||10|最大速度|
|Acceleration|false|Number|-1~1|-0.03|加速度 如果值小于1,速度会越来越慢,反之，则越来越快 值为0,速度不会变化|
|Gravity|false|Number||1.4|重力|
|Hue|false|Number|0-360|187-207|色调|
|MinBrightness|false|Number|1-100|50|最小亮度 亮度越小越接近白色|
|MaxBrightness|false|Number|1-100|50|最大亮度 亮度越大越接近白色|
|Alpha|false|Number|0-1|1|初始透明度|
|MinDecay|false|Number|0-1|0.015|最小淡出的速度 透明度减小速度|
|MaxDecay|false|Number|0-1|0.03|最大淡出的速度 透明度减小速度|
|FinishFunction|false|Function|||当前粒子销毁前 运行的函数 如果你想要让烟花发生二次爆炸，可以在这个函数里生成新的粒子|

### 示例:
> #### 链接:[烟花1](https://github.com/Lhtwasd22vs33/simple-fireworks/blob/main/examples/%E7%83%9F%E8%8A%B11.html)

>> ![img](./test/%E7%83%9F%E8%8A%B11.gif)


### CircleParticle
> CircleParticle 生成一个圆形粒子  x:横坐标 y:纵坐标 obj:参数对象 用于修改粒子的参数

````
    //向粒子数组中添加粒子
    var i = 100;
    while (i--) {
        fireworks.particles.push(new fireworks.CircleParticle(x, y,obj));
    }
````
#### CircleParticle obj参数对象说明

| 参数名 | 必填 | 值 |范围| 默认值 | 描述 |
| :---: | :---: | :---: | :---: | :---: | :---: |
|MinSpeed|false|Number||1|最小速度|
|MaxSpeed|false|Number||10|最大速度|
|Acceleration|false|Number|-1~1|-0.03|加速度 如果值小于1,速度会越来越慢,反之，则越来越快 值为0,速度不会变化|
|Gravity|false|Number||1.4|重力|
|Hue|false|Number|0-360|187-207|色调|
|MinBrightness|false|Number|1-100|50|最小亮度 亮度越小越接近白色|
|MaxBrightness|false|Number|1-100|50|最大亮度 亮度越大越接近白色|
|Alpha|false|Number|0-1|1|初始透明度|
|MinDecay|false|Number|0-1|0.015|最小淡出的速度 透明度减小速度|
|MaxDecay|false|Number|0-1|0.03|最大淡出的速度 透明度减小速度|
|FinishFunction|false|Function|||当前粒子销毁前 运行的函数 如果你想要让烟花发生二次爆炸，可以在这个函数里生成新的粒子|
|MinSize|false|Number||1|最小直径|
|MaxSize|false|Number||3|最大直径|
|SizeMinus|false|Boolean||false|半径是否缩小|
|AlphaMinus|false|Boolean||true|透明度是否缩小|

### 示例:
> #### 链接:[烟花2](https://github.com/Lhtwasd22vs33/simple-fireworks/blob/main/examples/%E7%83%9F%E8%8A%B12.html)

>> ![img](./test/%E7%83%9F%E8%8A%B12.gif)

### PointLine
> PointLine 从底部生成一个圆形粒子,向上运动到x,y的位置  x:横坐标 y:纵坐标 obj:参数对象 用于修改粒子的参数

````
    fireworks.particles.push(new fireworks.PointLine(x, y,obj));
````
#### PointLine obj参数对象说明

| 参数名 | 必填 | 值 |范围| 默认值 | 描述 |
| :---: | :---: | :---: | :---: | :---: | :---: |
|Speed|false|Number||5|速度|
|Acceleration|false|Number|-1~1|0|加速度 如果值小于1,速度会越来越慢,反之，则越来越快 值为0,速度不会变化|
|Hue|false|Number|0-360|187-207|色调|
|Brightness|false|Number|1-100|50|亮度|
|Alpha|false|Number|0-1|1|透明度|
|Size|false|Number||1|最小直径|
|FinishFunction|false|Function||默认生成200个随机粒子|当前粒子销毁前 运行的函数 你可以在这个函数里生成新的粒子|

### 示例:
> #### 链接:[烟花3](https://github.com/Lhtwasd22vs33/simple-fireworks/blob/main/examples/%E7%83%9F%E8%8A%B13.html)

>> ![img](./test/%E7%83%9F%E8%8A%B13.gif)

### PulseLine
> PulseLine 生成一个线形粒子,从sx, sy运动到tx,ty的位置 并且在tx,ty的位置生成一个脉冲圆  sx:起始横坐标 sy:起始纵坐标 tx:结束横坐标 ty:结束纵坐标  obj:参数对象 用于修改粒子的参数

````
    fireworks.particles.push(new fireworks.PulseLine(sx, sy,tx,ty,obj));
````
#### PulseLine obj参数对象说明

| 参数名 | 必填 | 值 |范围| 默认值 | 描述 |
| :---: | :---: | :---: | :---: | :---: | :---: |
|Speed|false|Number||2|速度|
|Acceleration|false|Number|-1~1|0|加速度 如果值小于1,速度会越来越慢,反之，则越来越快 值为0,速度不会变化|
|Hue|false|Number|0-360|187-207|色调|
|Brightness|false|Number|1-100|50|亮度|
|Alpha|false|Number|0-1|1|透明度|
|FinishFunction|false|Function||默认生成200个随机粒子|当前粒子销毁前 运行的函数 你可以在这个函数里生成新的粒子|
|MinRadius|false|Number||1|脉冲圆最小直径|
|MaxRadius|false|Number||8|脉冲圆最大直径|
|RadiusAdd|false|Number||0.3|圆直径增大速度|

### 示例:
> #### 链接:[烟花4](https://github.com/Lhtwasd22vs33/simple-fireworks/blob/main/examples/%E7%83%9F%E8%8A%B14.html)

>> ![img](./test/%E7%83%9F%E8%8A%B14.gif)


### 其他示例:
> #### 链接:[烟花5](https://github.com/Lhtwasd22vs33/simple-fireworks/blob/main/examples/%E7%83%9F%E8%8A%B15.html)

>> ![img](./test/%E7%83%9F%E8%8A%B15.gif)

### [GitHub链接:https://github.com/Lhtwasd22vs33/simple-fireworks](https://github.com/Lhtwasd22vs33/simple-fireworks)

### [npm链接:https://www.npmjs.com/package/simple-fireworks](https://www.npmjs.com/package/simple-fireworks)