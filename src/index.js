"use strict"
class fireworks {
    constructor() {
        // 动态创建canvas对象
        this.id="fireworks-canvas"
        let canvasdom = document.createElement("canvas");
        canvasdom.id = this.id;
        canvasdom.style.position = "fixed";
        canvasdom.style.left = "0";
        canvasdom.style.top = "0";
        canvasdom.style.zIndex = -1;
        canvasdom.style.pointerEvents ='none';
        document.body.appendChild(canvasdom);
        this.canvas=document.getElementById(this.id);
        
        // 获取屏幕像素比
        this.pixel_ratio=window.devicePixelRatio;

        // 设置canvas宽高
        this.canvas.width=innerWidth*this.pixel_ratio
        this.canvas.height=innerHeight*this.pixel_ratio

        // 当里浏览器宽高变化时
        window.addEventListener('resize', () => {
            this._changeCanvas()
        }, false);

        // 创建画布对象
        this.context = this.canvas.getContext('2d');
        // 创建烟花对象
        this._fireworks = {}
    }
    clearCanvas(erasingSpeed) {
        // 清除画布内容
        this.context.globalCompositeOperation = 'destination-out';
        if(erasingSpeed){
            this.context.fillStyle = 'rgba(0,0,0,' + erasingSpeed / 100 + ')';
        }else{
            this.context.fillStyle = 'rgba(0,0,0,' + 10 / 100 + ')';
        }
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.globalCompositeOperation = 'lighter';
        this._clearCanvas = requestAnimationFrame(() => {
            this.clearCanvas(erasingSpeed)
        })
    }
    _changeCanvas(){
        this.canvas.width=innerWidth*this.pixel_ratio
        this.canvas.height=innerHeight*this.pixel_ratio
    }
    draw(obj) {
        if (!this._clearCanvas) {
            this.clearCanvas(obj.erasingSpeed)
        }

        if (!this._fireworks) {
            this._fireworks = {}
        }

        this.key = Date.now()

        let _obj = JSON.parse(JSON.stringify(obj))

        _obj.key = this.key

        this._init(_obj)
    }
    _init(obj){
        if(obj.is_line){
            this._fireworks[obj.key] = {
                particles: [],
                line_x:obj.x,
                line_y:window.innerHeight,
                line_top:obj.y,
                two_explode:obj.two_explode||false
            }
        }else{
            this._fireworks[obj.key] = {
                particles: [],
                two_explode:obj.two_explode||false
            }
        }
        
        this._createFireworks(obj)
        if(obj.is_line){
            this.line_to_Top(obj)
        }else{
            this._drawFireworks(obj)
        }
        
    }
    _init_2(obj){
        this.key = Date.now()
        obj.key=this.key
        this._fireworks[obj.key] = {
            particles: [],
            two_explode:obj.two_explode||false
        }
        for(let i=0 ;i<obj.two_particles.length;i++){
            obj.x=obj.two_particles[i].x
            obj.y=obj.two_particles[i].y
            this._createFireworks(obj)
        }

        this._drawFireworks(obj)
    }

    _createFireworks(obj) {
        
        let { x, y } = obj
        if( !x ){throw new Error(`fireworks x值不能为 ${x}`);}
        if( !y ){throw new Error(`fireworks y值不能为 ${y}`);}

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
    // 烟花从底部飞出的动画
    line_to_Top(obj) {
        let key =obj.key
        let line_size =obj.line_size || 2
        let ling_speed=obj.ling_speed || 6

        this._fireworks[key].line_y -= ling_speed
        // 绘制
        this.context.beginPath();
        this.context.arc(this._fireworks[key].line_x, this._fireworks[key].line_y, line_size, 0, Math.PI * 2, false);
        this.context.closePath();
        // 设置颜色  
        this.context.fillStyle = '#fff';
        this.context.fill();

        // 判断动画是否结束
        if (this._fireworks[key].line_y <= this._fireworks[key].line_top) {
            // 清除动画
            cancelAnimationFrame(this._fireworks[key].line_am_id)
            // 播放烟花炸开的动画 
            this._drawFireworks(obj);
        } else {
            // 动画循环
            this._fireworks[key].line_am_id = requestAnimationFrame(() => { this.line_to_Top(obj) });
        }
    }
    _drawFireworks(obj) {
        let radius = obj.radius || 100
        let drop = obj.drop || 0
        let saturations = obj.saturations || '100%'
        let is_alpha_0 = false
        let is_alpha_5 = false

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
            if (p.alpha > 0.5) {
                is_alpha_5 = true
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
        if (!is_alpha_5&&this._fireworks[obj.key].two_explode) {
            let two_obj=JSON.parse(JSON.stringify(obj.two_obj))
            two_obj.two_particles=this._fireworks[obj.key].particles
            this._init_2(two_obj)
            this._fireworks[obj.key].two_explode=false
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