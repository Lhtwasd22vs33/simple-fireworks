# simple-fireworks 【简单的烟花】

#### 帮助你简单快捷的生成烟花效果,你只需要给予canvas对象和一些简单的参数



### 使用方法：


````
npm i simple-fireworks
````

````
import fireworks from 'simple-fireworks'
````

````
const canvas = document.querySelector('canvas')

//在创建实例时需要传入canvas对象，如果不传，默认会在body内创建canvas
const new_fireworks = new fireworks(canvas)

// 检测浏览器宽高变化
window.addEventListener('resize', () => {
    changeCanvas()
}, false);
// 设置画布宽高
changeCanvas()

//这里的值*4是为了让绘制出的粒子更细腻
function changeCanvas() {
    canvas.width = window.innerWidth * 4;
    canvas.height = window.innerHeight * 4;
}

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

### draw参数说明:
| 参数名 | 必填 | 值 | 默认值 | 描述 |
| :---: | :---: | :---: | :---: | :---: |
|x|true|Number||canvas对应的x坐标|
|y|true|Number||canvas对应的x坐标|
|count||Number|100|生成粒子的数量|
|radius||Number|100|半径|
|drop||Number|0|下坠速度|
|hue||Number|0-360的随机数|色相|
|hueVariance||Number|0|色调变化|
|saturations||String|'100%'|饱和度|
|brightnessMin||Number|50|最小亮度|
|brightnessMax||Number|80|最大亮度|
|alphaMin||Number|40|最小透明度|
|alphaMax||Number|100|最大透明度|
|color||Array['String']|['']|颜色数组 使用后上述的颜色属性<kbd>hue</kbd>,<kbd>hueVariance</kbd>,<kbd>saturations</kbd>,<kbd>brightnessMin</kbd>,<kbd>brightnessMax</kbd>,<kbd>alphaMin</kbd>,<kbd>alphaMax</kbd>自动失效|
|angleStart||Number|0|开始角度|
|angleEnd||Number|359|结束角度|
|speedMin||Number|0.5|最小扩散速度|
|speedMax||Number|14.5|最大扩散速度|
|acceleration||Number|0|加速度(溅射效果)效果是让开始的速度加快,并且运动距离更远|
|sizeMin||Number|1|最小粒子|
|sizeMax||Number|3|最大粒子|
|dissolve||Number:1~100|5|溶解,消失速度|


### GitHub

