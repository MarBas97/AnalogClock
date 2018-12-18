
var canvas = document.getElementById("canvas");
var ctx = self.canvas.getContext("2d");
ctx.translate(canvas.height / 2, canvas.width / 2); // sets point 0,0 in center of the canvas
var clock = new Clock();
clock.update();
canvas.addEventListener('mousedown', onMouseDownEvent);
canvas.addEventListener('mouseup', onMouseUpEvent);
  
  

function onMouseDownEvent()
{
  let clickedTime = calculateClickedTime();
  let minute = (30 * clock.indicators.m.angle) / (Math.PI + 15);
  let hour  = (6 * clock.indicators.h.angle) / (Math.PI + 3);
  let threshold = 0.25;

  if((clickedTime[0] < minute + threshold) && (clickedTime[0] > minute - threshold))  // easier to click on hand     
      clock.minuteTimeChanger.highlightIndicator('red');              
  if((clickedTime[1] < hour + threshold) && (clickedTime[1] > hour - threshold))   // easier to click on hand     
      clock.hourTimeChanger.highlightIndicator('red');                 
}

function onMouseUpEvent()
{
  let ag = new AngleGetter({xpos: event.clientX - canvas.width/2, ypos: event.clientY - canvas.width/2})
  if (clock.minuteTimeChanger.isTriggered) 
    clock.minuteTimeChanger.changeTime(ag.getAngle());
  if (clock.hourTimeChanger.isTriggered) 
    clock.hourTimeChanger.changeTime(ag.getAngle());
}

function calculateClickedTime()
{
  let time = [];
  let ag = new AngleGetter({xpos: event.clientX - canvas.width / 2, ypos: event.clientY - canvas.width / 2})
  let ang = ag.getAngle();
  time.push((30 * ang) / (Math.PI + 15));    
  time.push((6 * ang) / (Math.PI + 3));
  return time;
}

function Clock()
{
  var self = this;

  self.now = new Date();
  self.clockface = new ClockFace();

  self.indicators = {
    s: new Indicator({radius: 165}),
    m: new Indicator({radius: 150, lineWidth: 2.75}),
    h: new Indicator({radius: 100, lineWidth: 5, style: 'blue'})
  };

  self.minuteTimeChanger = new TimeChanger({indicator: self.indicators.m});
  self.hourTimeChanger = new TimeChanger({indicator: self.indicators.h});

  self.angle = {
    s: 0,
    m: 0,
    h: 0
  };


  self.buildFace = function() 
  {
    self.clockface.draw(ctx);
    self.clockface.drawNumbers(ctx);
    self.clockface.drawMarks(ctx);
  }

  self.renderIndicators = function() 
  {
    
    let second = self.now.getSeconds();
    let minute = self.now.getMinutes();
    let hour = self.now.getHours();
    
    if(hour/12 >= 1)
      hour = hour - 12;

    self.angle.s = (Math.PI * 2 * (second / 60)) - Math.PI / 2;
    self.angle.m = (Math.PI * 2 * (minute / 60) + (second * Math.PI / (30 * 60))) - Math.PI / 2
    self.angle.h = (Math.PI * 2 * (hour / 12) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60))) - Math.PI / 2

    self.indicators.s.angle = self.angle.s;
    self.indicators.m.angle = self.angle.m  + self.minuteTimeChanger.offset;
    self.indicators.h.angle = self.angle.h + self.hourTimeChanger.offset;

    self.indicators.s.drawhand(ctx);
    self.indicators.m.drawhand(ctx);
    self.indicators.h.drawhand(ctx);
  }
  
  
  self.update = function() 
  {
    self.now = new Date();
    ctx.clearRect(-canvas.height / 2,-canvas.width / 2,canvas.width,canvas.height);
    self.buildFace();
    self.renderIndicators();
    setTimeout(self.update,500);
  }
}


function ClockFace()
{
  let self = this;

  //default properties 
  self.lineWidth = 4;
  self.style = 'black';
  self.radius = (ctx.canvas.height / 2) * 0.9;
    
  self.draw = function(ctx)
  {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = self.lineWidth;
    ctx.strokeStyle = self.style;
    ctx.arc(0, 0, self.radius, 0 , 2 * Math.PI);
    ctx.stroke();
    ctx.restore();     
  }

  self.drawMarks = function(ctx)
  {
    let tickMark;
    let ang = 0;
    const numberOfMarks = 60; 
    let secondMarkPosition = self.radius - self.radius / 30;
    let hourdMarkPosition = self.radius - self.radius / 15;  

    ctx.save();
    for (var i = 0; i < numberOfMarks; i++) {
      ang = i  * (Math.PI * 2) / numberOfMarks; 
      if(!(i%5==0))
        tickMark = new TickMark({angle: ang, lineWidth: 2.5, markPosition: secondMarkPosition});
      else
        tickMark = new TickMark({angle: ang, lineWidth: 3.5, markPosition: hourdMarkPosition});  
      tickMark.drawMark(ctx,self.radius);      
    }
    ctx.restore();
    }

    self.drawNumbers = function(ctx)
    {     
      let ang;
      const numbers = 13;
      const numberPosition = self.radius * 0.85;

      for (let numberToDraw= 1; numberToDraw < numbers; numberToDraw++) {
        ang = numberToDraw * Math.PI / 6 - Math.PI / 2;       
        let y1 = Math.sin(ang) * numberPosition;
        let x1 = Math.cos(ang) * numberPosition;
        let clocknumber = new ClockNumber({number: numberToDraw})  
        clocknumber.drawnumber(ctx,x1,y1);
      }
    }
}

/** Represtent tickmark of the clock
 * 
 * @param {any} opt Optional propierties of TickMark 
 */
function TickMark(opt)
{
  let self = this; 
  
  self.lineWidth = 4;
  self.style = 'black';
  self.markPosition = 350;
  self.angle = 0;

  for (var key in opt)
    self[key] = opt[key];

  self.drawMark = function(ctx,radius)
  {
    ctx.save();     
    ctx.lineWidth = self.lineWidth;            
    ctx.beginPath();
    let x1 =  Math.cos(self.angle) * radius;
    let y1 =  Math.sin(self.angle) * radius;
    let x2 =  Math.cos(self.angle) * self.markPosition;
    let y2 =  Math.sin(self.angle) * self.markPosition;             
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();  
    ctx.restore();
  }
}

/**
 *  Represtent drawable number
 * @param {any} opt Optional propierties of ClockNumber 
 */
function ClockNumber(opt)
{
  var self = this;

  self.font = 20 + "px arial";
  self.textBaseline = "middle";
  self.textAlign = "center";
  self.number = 0;

  for (var key in opt)
    self[key] = opt[key];

  self.drawnumber = function(ctx, x, y)
  {
    ctx.save();
    ctx.font = self.font;
    ctx.textBaseline = self.textBaseline;
    ctx.textAlign = self.textAlign;
    ctx.fillText(self.number.toString(), x, y);
    ctx.restore();
  }
}

/**
 * Represent clock hand  (indicator).
 * @param {any} opt  Optional propierties of Indicator.
 */
function Indicator(opt)
{
  var self = this;

  self.lineWidth = 2;
  self.angle = 20;
  self.style = 'black';
  self.radius =  (ctx.canvas.height / 2) * 0.8;

  for (var key in opt)
    self[key] = opt[key];
    
  self.drawhand = function(ctx)
  {
    let x = Math.cos(self.angle) * self.radius;
    let y = Math.sin(self.angle) * self.radius;
    
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = self.style;
    ctx.lineWidth = self.lineWidth;
    ctx.moveTo(0,0);
    ctx.lineTo(x,y);
    ctx.stroke();
    ctx.restore();
  }

  
}
/**
 * Represents object with calculate angle between center point and 
 * point determined by xpos and ypos.
 * @param {any} opt Optional propierties of AngleGetter 
 */

function AngleGetter(opt)
{
  var self = this;

  self.xpos = 0;
  self.ypos = 0;

  for (var key in opt)
    self[key] = opt[key];
    
  self.getAngle = function()
  {
    let angle;
    if(self.xpos < 0)
      angle =  Math.atan(self.ypos / self.xpos) + Math.PI;
    else
      angle =  Math.atan(self.ypos / self.xpos);
    return angle;
  }
}

/**
 * Represents object with is responsible for 
 * changing time on the clock
 * @param {any} opt Optional propierties of TimeChanger
 */
function TimeChanger(opt)
{
  var self = this;

  self.indicator = 0;
  self.offset = 0;
  self.isTriggered = false;
  self.previousIndicatorColor = 'black';

  for (var key in opt)
    self[key] = opt[key];

  self.highlightIndicator = function(color)
  {
    self.previousIndicatorColor = self.indicator.style;
    self.indicator.style = color;
    self.isTriggered = true;
  }

  self.changeTime = function(angle)
  {
    self.offset += angle - self.indicator.angle;
    self.indicator.style = self.previousIndicatorColor;
    self.isTriggered= false;
    return self.offset;
  }

} 



  

