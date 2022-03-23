/*
    obj:{
        // 位于canvas的x轴坐标 必填  Number
        // x,
        // 位于canvas的y轴坐标 必填 Number
        // y,
        // 数量 默认:100 Number
        // count: 100,
        // 烟花半径 默认:100 Number
        // radius: 100,
        // 下坠速度 默认:0 Number
        // drop: 1,

        // 色相  默认为0-360的随机数 Number
        // hue: 240,
        // 色调变化 默认:0 Number
        // hueVariance: 30,
        // 饱和度 默认:100% 数值越大颜色越鲜艳  String
        // saturations:'100%',

        // 角度 默认:0-359 Number
        // angleStart:0,
        // angleEnd:359,

        // 向四周扩散速度 默认:0.5-14.5 Number
        // speedMin:1,
        // speedMax:4,

        // 粒子大小 默认:1-3 Number
        // sizeMin: 1,
        // sizeMax: 20,

        // 亮度 默认:50-80  亮度越高越接近白色 Number
        // brightnessMin:50,
        // brightnessMax:80,

        // 透明度 默认:40-100 Number
        // alphaMin:40,
        // alphaMax:100,

        // 颜色 如果有此数值 hue和hueVariance自动失效 Array['String']
        // color:['red','blue','green'],

        // 溶解，消失速度 1-100  默认:5 Number
        // dissolve: 7,

        // 加速度  默认:0  溅射效果 效果是让开始的速度加快，并且运动距离更远 Number
        acceleration: 10,
    }
*/


class fireworks {
    constructor(canvas) {
        this.canvas = canvas
        this.context = this.canvas.getContext('2d');
        this._fireworks = {}
    }
    clearCanvas() {
        this.context.globalCompositeOperation = 'destination-out';
        this.context.fillStyle = 'rgba(0,0,0,' + 10 / 100 + ')';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.globalCompositeOperation = 'lighter';
        this._clearCanvas = requestAnimationFrame(() => {
            this.clearCanvas()
        })
    }
    draw(obj) {
        if (!this._clearCanvas) {
            this.clearCanvas()
        }

        if (!this._fireworks) {
            this._fireworks = {}
        }

        this.key = Date.now()

        let _obj = JSON.parse(JSON.stringify(obj))

        _obj.key = this.key

        this._init_1(_obj)
    }
    _init_1(obj){
        this._fireworks[obj.key] = {
            particles: []
        }
        this._createFireworks(obj)
        this._drawFireworks(obj)
    }
    _createFireworks(obj) {
        this._fireworks[obj.key].particles = []
        let { x, y } = obj
        let hue = obj.hue || Math.floor(Math.random() * 361);
        let hueVariance = obj.hueVariance || 0;
        let count = obj.count || 100;

        let angleStart = obj.angleStart || 0
        let angleEnd = obj.angleEnd || 359

        let speedMin = obj.speedMin || 0.5
        let speedMax = obj.speedMax || 14.5

        let sizeMin = obj.sizeMin || 1
        let sizeMax = obj.sizeMax || 3

        let brightnessMin = obj.brightnessMin || 50
        let brightnessMax = obj.brightnessMax || 80

        let alphaMin = obj.alphaMin || 40
        let alphaMax = obj.alphaMax || 100

        let dissolve = '005'
        if (obj.dissolve) {
            if (obj.dissolve < 10 && obj.dissolve > 0) {
                dissolve = '00' + obj.dissolve
            } else if (obj.dissolve < 100 && obj.dissolve > 10) {
                dissolve = '0' + obj.dissolve
            } else {
                dissolve = obj.dissolve
            }
        }


        let acceleration = obj.acceleration || 0

        for (let i = 0; i < count; i++) {
            let p = {};
            let angle = Math.floor(Math.random() * (angleEnd - angleStart + 1)) + angleStart;
            p.radians = angle * Math.PI / 180;
            p.x = x;
            p.y = y;


            p.speed = (Math.random() * (speedMax + speedMin)) + speedMin;
            p.radius = p.speed + acceleration

            p.size = Math.random() * (sizeMax - sizeMin + 1) + sizeMin
            p.brightness = Math.floor(Math.random() * (brightnessMax - brightnessMin + 1)) + brightnessMin
            p.alpha = (Math.floor(Math.random() * (alphaMax - alphaMin + 1)) + alphaMin) / 100;

            if (obj.color) {
                p.color = obj.color[Math.floor(Math.random() * (obj.color.length + 1))]
            }
            p.hue = Math.floor(Math.random() * ((hue + hueVariance) - (hue - hueVariance))) + (hue - hueVariance);

            p.dissolve = dissolve
            this._fireworks[obj.key].particles.push(p);
        }
    }
    _drawFireworks(obj) {
        let radius = obj.radius || 100
        let drop = obj.drop || 0
        let saturations = obj.saturations || '100%'
        let is_alpha_0 = false
        for (let i = 0; i < this._fireworks[obj.key].particles.length; i++) {
            let p = this._fireworks[obj.key].particles[i];
            let vx = Math.cos(p.radians) * p.radius;
            let vy = Math.sin(p.radians) * p.radius + drop;
            p.x += vx;
            p.y += vy;
            p.radius *= 1 - p.speed / radius;
            p.alpha -= `0.${p.dissolve}` - 0;
            if (p.alpha > 0) {
                is_alpha_0 = true
            }
            this.context.beginPath();
            this.context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
            this.context.closePath();

            if (p.color) {
                this.context.fillStyle = p.color;
            } else {
                this.context.fillStyle = 'hsla(' + p.hue + ', ' + saturations + ', ' + p.brightness + '%, ' + p.alpha + ')';
            }
            this.context.fill();
        }
        if (is_alpha_0) {
            this._fireworks[obj.key].am_id = requestAnimationFrame(() => { this._drawFireworks(obj) });
        } else {
            cancelAnimationFrame(this._fireworks[obj.key].am_id)
            delete this._fireworks[obj.key]
        }
    }
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = fireworks;
}
else {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return fireworks;
        });
    }
    else {
        window.fireworks = fireworks;
    }
}