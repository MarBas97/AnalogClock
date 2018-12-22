
var canvas = document.getElementById("canvas");
var ctx = self.canvas.getContext("2d");
ctx.translate(canvas.height / 2, canvas.width / 2); // sets point 0,0 in center of the canvas
var radiusReduce  = 0.45;
var clock = new Clock(canvas.height * radiusReduce); //manipulate radiusReduce to change clock radius. Should be beteween 0 (exclusive) and 0.5 (inclusive)
clock.update();
canvas.addEventListener('mousedown', onMouseDownEvent);
canvas.addEventListener('mouseup', onMouseUpEvent);
  
  
/**
 * Calculates if minute or hour indicator is in the place
 * where user clicked. If true, enables to change position of corresponding indicator.
 */
function onMouseDownEvent()
{
  let clickedTime = calculateClickedTime();
  let minute = (30 * clock.indicators.m.angle) / (Math.PI + 15);
  let hour  = (6 * clock.indicators.h.angle) / (Math.PI + 3);
  let threshold = 0.25;

  if((clickedTime[0] < minute + threshold) && (clickedTime[0] > minute - threshold))
  {
    clock.minuteTimeChanger.highlightIndicator('red');   // threshold makes it easier to click  on hand           
    return;
  }     
  if((clickedTime[1] < hour + threshold) && (clickedTime[1] > hour - threshold))    
    clock.hourTimeChanger.highlightIndicator('red');                 
}

/**
 * If any indicator has been clicked on, changes time to time
 * given by cursor position
 */
function onMouseUpEvent()
{
  let ag = new AngleGetter({xpos: event.clientX - canvas.width/2, ypos: event.clientY - canvas.width/2})
  if (clock.minuteTimeChanger.isTriggered) 
    clock.minuteTimeChanger.changeTime(ag.getAngle());
  if (clock.hourTimeChanger.isTriggered) 
    clock.hourTimeChanger.changeTime(ag.getAngle());
}

/**
 * Calculates the place on the clock face, 
 * where the mouse was clicked 
 */
function calculateClickedTime()
{
  let time = [];
  let ag = new AngleGetter({xpos: event.clientX - canvas.width / 2, ypos: event.clientY - canvas.width / 2})
  let ang = ag.getAngle();
  time.push((30 * ang) / (Math.PI + 15));    
  time.push((6 * ang) / (Math.PI + 3));
  return time;
}

/**
 *  Represents analogue clock
 * @param {number} - radius of the clock
 * @class
 * */
function Clock(clockRadius)
{
  var self = this;

  self.now = new Date();
  self.clockface = new ClockFace({radius: clockRadius});

  self.indicators = {
    s: new Indicator({length: clockRadius * 0.9}),
    m: new Indicator({length: clockRadius * 0.75, lineWidth: 2.75}),
    h: new Indicator({length: clockRadius * 0.55, lineWidth: 5, style: 'blue'})
  };

  self.minuteTimeChanger = new TimeChanger({indicator: self.indicators.m});
  self.hourTimeChanger = new TimeChanger({indicator: self.indicators.h});

  self.angle = {
    s: 0,
    m: 0,
    h: 0
  };

/**
 * Building clock face
 * @memberof Clock
 */
  self.buildFace = function() 
  {
    self.clockface.draw(ctx);
    self.clockface.drawNumbers(ctx);
    self.clockface.drawMarks(ctx);
  }

  /**
   * Render indicators. Angle is given by actual time and offset given by 
   * time changer.
   * @memberof Clock
   */
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
  
  /**
   * Every 500ms clear canvas and render new face and indicators
   * @memberof Clock 
   */
  self.update = function() 
  {
    self.now = new Date();
    ctx.clearRect(-canvas.height / 2,-canvas.width / 2,canvas.width,canvas.height);
    self.buildFace();
    self.renderIndicators();
    setTimeout(self.update,500);
  }
}

/**
 * Represents basic clock face
 * @class
 * @param {any} opt optional Clock parameters. lineWidth, style and radius
 */
function ClockFace(opt)
{
  let self = this;

  self.lineWidth = 4;
  self.style = 'black';
  self.radius = (ctx.canvas.height / 2) * 0.9;
    
  for (var key in opt)
    self[key] = opt[key];
  
  /**
  * Draw circle by given radius and lineWidth
  * @memberof ClockFace
  * @param {any} ctx - 2d context of canvas 
  */
  self.draw = function(ctx)
  {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = self.lineWidth;
    ctx.strokeStyle = self.style;
    ctx.arc(0, 0, self.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();     
  }

  /**
   * Draw constant (60) amount of tickMarks 
   * on 2pi circumference
   * @memberof ClockFace
   * @param {any} ctx - 2d context of canvas 
   */
  self.drawMarks = function(ctx)
  {
    const numberOfMarks = 60; 
    let tickMark;
    let ang = 0;
    let secondMarkPosition = self.radius - self.radius / 30;
    let hourdMarkPosition = self.radius - self.radius / 15;  

    ctx.save();
    for (var i = 0; i < numberOfMarks; i++) {
      ang = i  * (Math.PI * 2) / numberOfMarks; 
      if(!(i%5==0))
        tickMark = new TickMark({angle: ang, lineWidth: 2.5, markPosition: secondMarkPosition});
      else
        tickMark = new TickMark({angle: ang, lineWidth: 3.5, markPosition: hourdMarkPosition});  
      tickMark.drawMark(ctx, self.radius);      
    }
    ctx.restore();
  }

  /**
   * Draw constant (12) amount of clockNumbers 
   * on 2pi circumference
   * @memberof ClockFace
   * @param {any} ctx - 2d context of canvas 
   */
    self.drawNumbers = function(ctx)
    {     
      const numbers = 13;
      const numberPosition = self.radius * 0.85;
      let ang;

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
 * @param {any} opt Optional propierties of TickMark. lineWidth, style, markposition and angle
 * @class
 */
function TickMark(opt)
{
  let self = this; 
  
  //default properties 
  self.lineWidth = 4;
  self.style = 'black';
  self.markPosition = 350;
  self.angle = 0;

  for (var key in opt)
    self[key] = opt[key];

  /**
   * Draw constant (12) amount of clockNumbers 
   * on 2pi circumference. It's important to set
   * radius the same as radius of the clock
   * @memberof TickMark
   * @param {any} ctx - 2d context of canvas 
   * @param {number} radius - radius of the clock
   */
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
 * @param {any} opt Optional propierties of ClockNumber. font, textBaseline, textAlign and number.
 * @class
 */
function ClockNumber(opt)
{
  var self = this;

  //default properties 
  self.font = 20 + "px arial";
  self.textBaseline = "middle";
  self.textAlign = "center";
  self.number = 0;

  for (var key in opt)
    self[key] = opt[key];

  /**
   * Draw number on canvas in position 
   * given by x and y.
   * @memberof ClockNumber
   * @param {any} ctx - 2d context of canvas 
   * @param {x} radius - x position of number on canvas
   * @param {y} radius - y position of number on canvas
   */
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
 * @param {any} opt  Optional propierties of Indicator. lineWidth, angle, style and length.
 * @class
 */

function Indicator(opt)
{
  var self = this;

  //default properties 
  self.lineWidth = 2;
  self.angle = 20;
  self.style = 'black';
  self.length =  (ctx.canvas.height / 2) * 0.8;

  for (var key in opt)
    self[key] = opt[key];
  
/**
* Draw a Indicator from (0,0) point on the canvas
* which given length
* @memberof Indicator
* @param {any} ctx - 2d context of canvas 
*/
  self.drawhand = function(ctx)
  {
    let x = Math.cos(self.angle) * self.length;
    let y = Math.sin(self.angle) * self.length;
    
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
 * @param {any} opt Optional propierties of AngleGetter. x pos and y pos.
 * @class
 */
function AngleGetter(opt)
{
  var self = this;

  //default properties 
  self.xpos = 0;
  self.ypos = 0;

  for (var key in opt)
    self[key] = opt[key];
  
  /**
   * Calculates angle between center of the canvas and point given
   * by x and y.
   * @memberof AngleGetter
   */
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
 * Represents object which is responsible for 
 * changing time on the clock
 * @class
 * @param {any} opt Optional propierties of TimeChanger. Indicator, offset, isTriggered flag and previousIndicatorColor.
 */
function TimeChanger(opt)
{
  var self = this;
 
  //default properties 
  self.indicator = 0;
  self.offset = 0;
  self.isTriggered = false;
  self.previousIndicatorColor = 'black';

  for (var key in opt)
    self[key] = opt[key];

  /**
  * Changes color of indicator color and sets isTriggerd
  * flag on true. Enables to grab the Indicator.
  * @param {string} color - indicator color will be change to this color
  * @memberof TimeChanger
  */
  self.highlightIndicator = function(color)
  {
    self.previousIndicatorColor = self.indicator.style;
    self.indicator.style = color;
    self.isTriggered = true;
  }

  /**
  * Increases offset by difference of param angle and actual indicator
  * angle. Sets color of the indicator on its previous color (before click)
  * and sets isTriggered flag on false.
  * @param {number} angle - angle in radians
  * @memberof TimeChanger
  */
  self.changeTime = function(angle)
  {
    self.offset += angle - self.indicator.angle;
    self.indicator.style = self.previousIndicatorColor;
    self.isTriggered= false;
    return self.offset;
  }
} 



  

