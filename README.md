# <p align="center">simple-fireworks 【简单的烟花】</p>

<br>

#### <p align="center">简单快捷的在js中生成烟花效果 <br> 拥有很强的自定义效果,你可以自定义出属于你的烟花效果 </p>

>注意：simple-fireworks会在body里面创建一个canvas对象，该canvas并不会影响下层内容的点击事件

<br>

### 使用方法：

````
npm i simple-fireworks
````

````
import fireworks from 'simple-fireworks'
````

````

const new_fireworks = new fireworks()

// 获取点击坐标
document.addEventListener('mousedown', (e) => {
    //canvas的宽高*4 所以坐标也*4
    var x = e.clientX * 4;
    var y = e.clientY * 4;

    // 绘制烟花
    new_fireworks.draw({
        x,
        y
    })

}, false);
````

<br>

### draw参数说明:

> 这里的范围只是我个人推荐使用的值的范围,代码内部并未进行参数值是否在范围内的判断,所以除了x,y以外,请最好不要将参数的值设置为0等判断为false的值,如果设置为0,将使用默认值.

| 参数名 | 必填 | 值 |范围| 默认值 | 描述 |
| :---: | :---: | :---: | :---: | :---: | :---: |
|x*|true|Number|||canvas对应的x坐标|
|y*|true|Number|||canvas对应的x坐标|
|count||Number||100|生成粒子的数量|
|radius||Number||100|半径|
|drop||Number||0|下坠速度|
|hue||Number||0-360的随机数|色相|
|hueVariance||Number||0|色调变化|
|saturations||String||'100%'|饱和度|
|brightnessMin||Number||50|最小亮度|
|brightnessMax||Number||80|最大亮度|
|alphaMin||Number||40|最小透明度|
|alphaMax||Number||100|最大透明度|
|angleStart||Number||0|开始角度|
|angleEnd||Number||359|结束角度|
|speedMin||Number||0.5|最小扩散速度|
|speedMax||Number||14.5|最大扩散速度|
|acceleration||Number||0|加速度(溅射效果) 效果是会让一开始的速度很快,并且运动距离更远|
|sizeMin||Number||1|最小粒子|
|sizeMax||Number||3|最大粒子|
|dissolve||Number:1~100||5|溶解,消失速度|
|erasingSpeed||Number||10|擦除速度,速度越慢拖尾越长|
|is_line||Boolean|true or false|false|是否从底部生成线条飞出|
|line_size||Number||2|线条粗细|
|ling_speed||Number||4|线条向上的速度|
|two_explode||Boolean||false|是否二次爆开|
|two_obj||object||{}|第二次爆开的烟花参数 参数内容同上,这里的x,y,值为第一次爆开的粒子的位置|

<br>


### 示例
> [烟花](https://github.com/Lhtwasd22vs33/simple-fireworks/blob/main/examples/%E7%83%9F%E8%8A%B11.html)

![img](./test/fireworks_1.gif)

> [二次爆炸](https://github.com/Lhtwasd22vs33/simple-fireworks/blob/main/examples/%E7%83%9F%E8%8A%B12.html)

![img](./test/fireworks_2.gif)


<br>


### [GitHub链接:https://github.com/Lhtwasd22vs33/simple-fireworks](https://github.com/Lhtwasd22vs33/simple-fireworks)