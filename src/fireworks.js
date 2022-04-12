
//requestAnimationFrame
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
})();

//获取一个范围内的随机数
function random(min, max) {
    return Math.random() * (max - min) + min;
}

//计算两点之间的距离
function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// 动态创建canvas对象
const FireworksCanvasId = "Fireworks-Canvas"
const FireworksCanvasDom = document.createElement("canvas");
FireworksCanvasDom.id = FireworksCanvasId;
FireworksCanvasDom.style.position = "fixed";
FireworksCanvasDom.style.left = "0";
FireworksCanvasDom.style.top = "0";
FireworksCanvasDom.style.width = "100%";
FireworksCanvasDom.style.height = "100%";
FireworksCanvasDom.style.zIndex = -1;
FireworksCanvasDom.style.pointerEvents = 'none';
document.body.appendChild(FireworksCanvasDom);
const FireworksCanvas = document.getElementById(FireworksCanvasId);

// 设置canvas宽高
FireworksCanvas.width = window.innerWidth * window.devicePixelRatio
FireworksCanvas.height = window.innerHeight * window.devicePixelRatio

// 检测屏幕宽高变化，修改canvas宽高
window.addEventListener('resize', function () {
    FireworksCanvas.width = window.innerWidth * window.devicePixelRatio
    FireworksCanvas.height = window.innerHeight * window.devicePixelRatio
})

// 创建画布对象
const FireworksCtx = FireworksCanvas.getContext('2d');
// 创建粒子数组
const particles = []
// 颜色
let hue = 197
// 抹去
let erase = [0.1]

let LoopFunction = [function () { }]

class LineParticle {
    constructor(x, y, obj) {
        if (!obj) {
            obj = {}
        }
        this.x = x;
        this.y = y;
        //跟踪每个粒子过去的坐标以创建轨迹效果，增加坐标计数以创建更突出的轨迹
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        //在所有可能的方向上设置一个随机角度，以弧度为单位
        this.angle = random(0, Math.PI * 2);
        // 速度
        this.speed = random(obj.MinSpeed || 1, obj.MaxSpeed || 10);
        //加速度
        this.Acceleration = obj.Acceleration || -0.03;
        //重力将被应用，并把粒子拉下来 1.4
        this.gravity = obj.Gravity || 1.4;
        //将色调设置为整体色调变量的随机数+-20
        this.hue = obj.Hue || random(hue - 20, hue + 20);
        // 亮度
        this.brightness = random(obj.MinBrightness || 50, obj.MaxBrightness || 50);
        // 透明度
        this.alpha = obj.Alpha || 1;
        //设定粒子淡出的速度
        this.decay = random(obj.MinDecay || 0.015, obj.MaxDecay || 0.03);
        // 销毁前 运行的函数
        this.end_fn = obj.FinishFunction || function () { }
        // 判断传入的值为0的情况
        for (let iterator in obj) {
            if (obj[iterator] == 0) {
                this[iterator] = 0
            }
        }
    }
    update(index) {
        //删除坐标数组中的最后一项
        this.coordinates.pop();
        //将当前坐标添加到数组的开头
        this.coordinates.unshift([this.x, this.y]);

        //减慢粒子的速度
        this.speed *= 1 + this.Acceleration;

        //应用速度
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;

        //淡出粒子
        this.alpha -= this.decay;

        //当alpha足够低时，根据传入的索引移除粒子
        if (this.alpha <= this.decay) {
            this.end_fn()
            particles.splice(index, 1);

        }
    }
    draw() {
        FireworksCtx.beginPath();
        //移动到集合中最后跟踪的坐标，然后画一条线到当前的x和y
        FireworksCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        FireworksCtx.lineTo(this.x, this.y);
        FireworksCtx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
        FireworksCtx.stroke();
    }
}
class CircleParticle {
    constructor(x, y, obj) {
        if (!obj) {
            obj = {}
        }
        this.x = x;
        this.y = y;
        //在所有可能的方向上设置一个随机角度，以弧度为单位
        this.angle = random(0, Math.PI * 2);
        // 速度
        this.speed = random(obj.MinSpeed || 1, obj.MaxSpeed || 10);

        //加速度 
        this.Acceleration = obj.Acceleration || -0.03;

        //重力将被应用，并把粒子拉下来 1.4
        this.gravity = obj.Gravity || 1.4;

        //将色调设置为整体色调变量的随机数+-20
        this.hue = obj.Hue || random(hue - 20, hue + 20);
        // 亮度
        this.brightness = random(obj.MinBrightness || 50, obj.MaxBrightness || 50);
        // 透明度
        this.alpha = obj.Alpha || 1;

        //设定粒子淡出的速度
        this.decay = random(obj.MinDecay || 0.015, obj.MaxDecay || 0.03);

        // 直径
        this.size = random(obj.MinSize || 1, obj.MaxSize || 3)

        // 半径是否缩小
        this.is_size_minus = obj.SizeMinus || false
        // 透明度是否缩小
        this.is_alpha_minus = obj.AlphaMinus || true
        // 当前粒子销毁前 运行的函数
        this.end_fn = obj.FinishFunction || function () { }
        // 判断传入的值为0的情况
        for (let iterator in obj) {
            if (obj[iterator] == 0) {
                this[iterator] = 0
            }
        }

    }
    update(index) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;

        //减慢粒子的速度
        this.speed *= 1 + this.Acceleration;

        if (this.is_size_minus) {
            // 半径减小
            this.size -= this.decay;
            if (this.size <= 0.1) {
                this.end_fn()
                particles.splice(index, 1);
            }
        }

        if (this.is_alpha_minus) {
            //淡出粒子
            this.alpha -= this.decay;
            if (this.alpha <= 0.03) {
                this.end_fn()
                particles.splice(index, 1);
            }
        }
    }
    draw() {
        FireworksCtx.beginPath();
        FireworksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        FireworksCtx.fillStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
        FireworksCtx.fill();
        FireworksCtx.closePath();
    }
}
class PointLine {
    constructor(x, y, obj) {
        if (!obj) {
            obj = {}
        }
        this.x = x;
        this.y = y;
        this.top = window.innerHeight * window.devicePixelRatio
        // 速度
        this.speed = obj.Speed || 5;

        // 加速度
        this.acceleration = obj.Acceleration || 0;

        //将色调设置为整体色调变量的随机数+-20
        this.hue = obj.Hue || random(hue - 10, hue + 10);
        // 亮度
        this.brightness = obj.Brightness || 50;
        // 透明度
        this.alpha = obj.Alpha || 1;
        // 直径
        this.size = obj.Size || 1.5
        // 当前粒子销毁前 运行的函数
        this.end_fn = obj.FinishFunction || function (x, y) {
            var count = 100
            while (count--) {
                particles.push(new LineParticle(x, y));
                particles.push(new CircleParticle(x, y));
            }
        }
        // 判断传入的值为0的情况
        for (let iterator in obj) {
            if (obj[iterator] == 0) {
                this[iterator] = 0
            }
        }
    }
    update(index) {
        this.top -= this.speed
        this.speed *= 1 + this.acceleration
        if (this.top <= this.y) {
            this.end_fn(this.x, this.y)
            particles.splice(index, 1);
        }
    }
    draw() {
        FireworksCtx.beginPath();
        FireworksCtx.arc(this.x, this.top, this.size, 0, Math.PI * 2, false);
        FireworksCtx.fillStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
        FireworksCtx.fill();
        FireworksCtx.closePath();
    }
}
class PulseLine {
    constructor(sx, sy, tx, ty, obj) {
        if (!obj) {
            obj = {}
        }
        //实际坐标
        this.x = sx;
        this.y = sy;
        //起始坐标
        this.sx = sx;
        this.sy = sy;
        //目标坐标
        this.tx = tx;
        this.ty = ty;
        //从起点到目标的距离
        this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
        this.distanceTraveled = 0;
        //追踪每个烟花的过去坐标以创建轨迹效果，增加坐标计数以创建更突出的轨迹
        this.coordinates = [];
        this.coordinateCount = 3;

        //用当前坐标填充初始坐标集合
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        // 角度
        this.angle = Math.atan2(ty - sy, tx - sx);
        // 速度
        this.speed = obj.Speed || 2;
        // 加速度
        this.acceleration = obj.Acceleration || 0.05;
        //将色调设置为整体色调变量的随机数+-20
        this.hue = obj.Hue || random(hue - 10, hue + 10);
        // 亮度
        this.brightness = obj.Brightness || 50;
        // 透明度
        this.alpha = obj.Alpha || 1;
        //圆形目标指示器半径
        this.MinRadius = obj.MinRadius || 1
        this.MaxRadius = obj.MaxRadius || 8
        // 起始圆大小
        this.targetRadius = this.MinRadius;
        // 圆半径增大速度
        this.RadiusAdd = obj.RadiusAdd || 0.3

        this.end_fn = obj.FinishFunction || function () {
            let count = 100
            while (count--) {
                particles.push(new LineParticle(this.x, this.y));
                particles.push(new CircleParticle(this.x, this.y));
            }
        }
        // 判断传入的值为0的情况
        for (let iterator in obj) {
            if (obj[iterator] == 0) {
                this[iterator] = 0
            }
        }
    }
    update(index) {
        //删除坐标数组中的最后一项
        this.coordinates.pop();
        //将当前坐标添加到数组的开头
        this.coordinates.unshift([this.x, this.y]);

        //循环圆目标指示器半径 脉冲圆
        if (this.targetRadius < this.MaxRadius) {
            this.targetRadius += this.RadiusAdd;
        } else {
            this.targetRadius = this.MinRadius;
        }

        //加速度
        this.speed *= 1 + this.acceleration;

        //根据角度和速度获取当前速度
        let vx = Math.cos(this.angle) * this.speed;
        let vy = Math.sin(this.angle) * this.speed;

        //在应用速度的情况下，烟花会飞多远
        this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

        //如果行进的距离(包括速度)大于到目标的初始距离，则已经到达目标
        if (this.distanceTraveled >= this.distanceToTarget) {
            this.end_fn()
            //移除
            particles.splice(index, 1);
        } else {
            //目标未达到，继续行进
            this.x += vx;
            this.y += vy;
        }
    }
    draw() {
        FireworksCtx.beginPath();
        //移动到集合中最后一个跟踪的坐标，然后绘制一条到当前x和y的直线
        FireworksCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        FireworksCtx.lineTo(this.x, this.y);
        FireworksCtx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
        
        FireworksCtx.stroke();

        FireworksCtx.beginPath();
        //用一个脉冲圆绘制此烟花的目标
        FireworksCtx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
        FireworksCtx.stroke();
    }
}


// 动画循环
loop()
function loop() {
    requestAnimFrame(loop)

    //清除画布
    FireworksCtx.globalCompositeOperation = 'destination-out';
    FireworksCtx.fillStyle = `rgba(0, 0, 0, ${erase[0]})`;
    FireworksCtx.fillRect(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
    FireworksCtx.globalCompositeOperation = 'lighter';


    //循环遍历每个粒子，绘制它，更新它
    var i = particles.length;
    while (i--) {
        particles[i].draw();
        particles[i].update(i);
    }

    LoopFunction[0]()
}



const fireworks = {
    particles,
    erase,
    LoopFunction,
    LineParticle,
    CircleParticle,
    PointLine,
    PulseLine
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = fireworks
}
else {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return fireworks
        });
    }
    else {
        window.fireworks = fireworks
    }
}