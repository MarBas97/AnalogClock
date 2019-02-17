

class ClockFace {

    ctx
    lineWidth: number
    style: string
    radius: number
    constructor(ctx, lineWidth, style, radius) {
        this.ctx = ctx;
        this.lineWidth = lineWidth;
        this.style = style;
        this.radius = radius;
    }

    draw() { 
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.style;
    this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.restore();
    }

    drawMarks()
  {
    const numberOfMarks = 60; 
    let tickMark;
    let ang = 0;
    let secondMarkPosition = this.radius - this.radius / 30;
    let hourdMarkPosition = this.radius - this.radius / 15;  

    this.ctx.save();
    for (var i = 0; i < numberOfMarks; i++) {
      ang = i  * (Math.PI * 2) / numberOfMarks; 
      if(!(i%5==0))
        tickMark = new TickMark(this.ctx,2.5,'black', secondMarkPosition, ang);
      else
        tickMark = new TickMark(this.ctx,4.5,'black', hourdMarkPosition, ang);  
      tickMark.drawMark(this.radius);      
    }
    this.ctx.restore();
  }


  drawNumbers()
    {     
      const numbers = 13;
      const numberPosition = this.radius * 0.85;
      let ang;

      for (let numberToDraw= 1; numberToDraw < numbers; numberToDraw++) {
        ang = numberToDraw * Math.PI / 6 - Math.PI / 2;       
        let y1 = Math.sin(ang) * numberPosition;
        let x1 = Math.cos(ang) * numberPosition;
        let clocknumber = new ClockNumber(20 + "px arial", "middle", "center", numberToDraw, this.ctx);
        clocknumber.drawnumber(x1,y1);
      }
    }
}



class Indicator {

    ctx
    lineWidth: Number;
    style: string;
    length: number;
    angle: number;
    type: string;
    time: number;

    constructor(ctx, lineWidth, style, length, time, type) {
        this.ctx = ctx;
        this.lineWidth = lineWidth;
        this.style = style;
        this.length = length;
        this.time = time;
        this.type = type;      
    }

    public drawIndicator() {
        this.angle = this.calculateAngleByTime(this.time)
        let x = Math.cos(this.angle) * this.length;
        let y = Math.sin(this.angle) * this.length;
    
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.style;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(x,y);
        this.ctx.stroke();
        this.ctx.restore();
    }

     calculateAngleByTime(time) {
      let angle;
      let seconds = Math.floor(time / 1000 % 60);
      let minutes = Math.floor((time / 60000) % 60)
      let hours = Math.round(time / 3600000) % 24

      if(this.type == 's') {
        angle = (Math.PI * 2 * (seconds / 60)) - Math.PI / 2;
        this.time = seconds;
      }
        else if (this.type == 'm') {
          angle = (Math.PI * 2 * (minutes / 60) + (seconds * Math.PI / (30 * 60))) - Math.PI / 2;
          this.time = minutes;
        }
        else {
          this.time = hours;
          angle = (Math.PI * 2 * (hours / 12) + (minutes * Math.PI / (6 * 60)) + (seconds * Math.PI / (360 * 60))) - Math.PI / 2;
        }
      
      return angle;
    }
}

class TickMark {

  lineWidth: number;
  style: String
  markPosition: number;
  angle: number;
  ctx;

  constructor(ctx, lineWidth, style, markPosition, angle) {
    this.ctx = ctx;
    this.lineWidth = lineWidth;
    this.style = style;
    this.markPosition = markPosition;
    this.angle = angle;
}

  drawMark(radius)
  {
    this.ctx.save();     
    this.ctx.lineWidth = this.lineWidth;            
    this.ctx.beginPath();
    let x1 =  Math.cos(this.angle) * radius;
    let y1 =  Math.sin(this.angle) * radius;
    let x2 =  Math.cos(this.angle) * this.markPosition;
    let y2 =  Math.sin(this.angle) * this.markPosition;             
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();  
    this.ctx.restore();
  }
}

class ClockNumber {
  font;
  textBaseline;
  textAlign;
  number;
  ctx 

  constructor(font, textBaseline, textAlign, number, ctx) {
    this.font = font;
    this.textBaseline = textBaseline;
    this.textAlign = textAlign;
    this.number = number;
    this.ctx = ctx;
}



drawnumber = function(x, y)
  {
    this.ctx.save();
    this.ctx.font = this.font;
    this.ctx.textBaseline = this.textBaseline;
    this.ctx.textAlign = this.textAlign;
    this.ctx.fillText(this.number.toString(), x, y);
    this.ctx.restore();
  }
}

class Clock {
  canvas 
  clockRadius: number;
  clockFace : ClockFace;
  private ctx: CanvasRenderingContext2D

  indicators: Indicator[] = [];
  

  constructor(canvas, clockRadius) {
    this.canvas = canvas  
    this.clockRadius = clockRadius;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.translate(this.canvas.height / 2, this.canvas.width / 2);
    this.clockFace = new ClockFace(this.ctx, 4, 'black', this.clockRadius)
    this.indicators.push(new Indicator(this.ctx, 1.5, 'black', this.clockRadius * 0.9, Date.now(), 's'),
    new Indicator(this.ctx, 2.75, 'black', this.clockRadius * 0.75, Date.now(), 'm'),
    new Indicator(this.ctx, 5, 'blue', this.clockRadius * 0.55, Date.now(), 'h'))
  }

  buildFace() 
  {
    this.clockFace.draw();
    this.clockFace.drawNumbers();
    this.clockFace.drawMarks();
  }


  renderIndicators() {
    this.indicators.forEach(element => {
      element.time = Date.now();
      element.drawIndicator();
    });
  }


  update() {
    setTimeout(() => {
      this.ctx.clearRect(-this.canvas.height / 2, -this.canvas.width / 2, this.canvas.width, this.canvas.height);
      this.buildFace();
      this.renderIndicators();
      this.update();
    }, 500);
  }
}

class AngleGetter {

  /**
   * Calculates angle between center of the canvas and point given
   * by x and y.
   * @memberof AngleGetter
   */
    

  getAngle(x, y)
  {
    let angle;
    if(x < 0)
      angle =  Math.atan(y / x) + Math.PI;
    else
      angle =  Math.atan(y / x);
    return angle;
  }
}

class TimeChanger {

  clock: Clock;

  constructor(clock: Clock) {
    this.clock = clock;
  }

  

  indicatorClicked() {
    this.clock.indicators.forEach(element => {
      
    });
  }

  


}


import * as _ from 'lodash'

// canvas properties
var W = 600;
var H = 600;
const canvas = document.querySelector('canvas');
canvas.width = W;
canvas.height = H;
//

let clock = new Clock(canvas, W / 2.5);
clock.update();





