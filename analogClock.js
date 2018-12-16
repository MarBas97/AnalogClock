
var canvas = document.getElementById("canvas");
var ctx = self.canvas.getContext("2d");


ctx.translate(canvas.height / 2, canvas.width/2); // sets point 0,0 in center of the canvas

var clock = new Clock();
clock.build();
clock.renderIndicators();
clock.update();

document.addEventListener('mousedown',function(){
  let ag = new AngleGetter({xpos: event.clientX - canvas.width/2, ypos: event.clientY - canvas.width/2})
  let ang = ag.getAngle();
  tmp = (30 * ang) / (Math.PI + 15);
        
  tmp2 = (6 * ang) / (Math.PI + 3);

  let minute = (30 * clock.indicators.m.angle) / (Math.PI + 15);

  let hour  = (6 * clock.indicators.h.angle) / (Math.PI + 3);
  console.log(hour.toString());
  console.log(tmp2.toString());
  if(tmp<minute+0.25 && tmp>minute-0.25)   // easier to click on hand     
    { 
      clock.indicators.m.style = 'blue';                 
    }
  if(tmp2<hour+0.5 && tmp2>hour-0.5)   // easier to click on hand     
    { 
      clock.indicators.h.style = 'blue';                 
    }
})

document.addEventListener('mouseup',function(){
  let ag = new AngleGetter({xpos: event.clientX - canvas.width/2, ypos: event.clientY - canvas.width/2})
  if(clock.indicators.m.style == 'blue')
  {
     clock.offset.m += ag.getAngle() - clock.indicators.m.angle;
     clock.indicators.m.style = 'black';
  }
  if(clock.indicators.h.style == 'blue')
  {
     clock.offset.h += ag.getAngle() - clock.indicators.h.angle;
     clock.indicators.h.style = 'red';
  }
  
})




function Clock()
{
  var self = this;
  self.now = new Date();
  self.clockface = new ClockFace();
  self.offset = {
    m : 0,
    h : 0
  }
    
  
  self.indicators = {
    s: new Indicator({radius: 165}),
    m: new Indicator({radius: 150, lineWidth: 2.75}),
    h: new Indicator({radius: 100, lineWidth: 5, style: 'red'})
  }
  
  self.angle = {
    s: 0,
    m: 0,
    h: 0
  };


  self.build = function(){
    self.clockface.draw(ctx);
    self.clockface.drawNumbers(ctx);
    self.clockface.drawMarks(ctx);
  }

  self.renderIndicators = function(){
    
    let second = self.now.getSeconds();
    let minute = self.now.getMinutes();
    let hour = self.now.getHours();
    
    if(hour/12 >= 1)
      hour = hour - 12;

    self.angle.s = (Math.PI * 2 * (second / 60)) - Math.PI / 2;
    self.angle.m = (Math.PI * 2 * (minute / 60) + (second * Math.PI / (30 * 60))) - Math.PI / 2
    self.angle.h = (Math.PI * 2 * (hour / 12) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60))) - Math.PI / 2

    self.indicators.s.angle = self.angle.s;
    self.indicators.m.angle = self.angle.m  + self.offset.m;
    self.indicators.h.angle = self.angle.h + self.offset.h;
    self.indicators.s.drawhand(ctx);
    self.indicators.m.drawhand(ctx);
    self.indicators.h.drawhand(ctx);
  }
  
  


  self.update = function(){
    self.now = new Date();
    ctx.clearRect(-canvas.height / 2,-canvas.width/2,canvas.width,canvas.height);
    self.build();
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
    self.radius = (ctx.canvas.height/2) * 0.9;
    

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
      let tickmark;
      let ang = 0;
      const numberofmarks = 60; 
      ctx.save();
      let secondmarkposition = self.radius - self.radius / 30;
      let hourdmarkposition = self.radius - self.radius / 15;  
      for (var i = 0; i < numberofmarks; i++){
        ang = i  * (Math.PI * 2) / numberofmarks; 
        if(!(i%5==0))
           tickmark = new TickMark({angle: ang, lineWidth: 2.5, markposition:secondmarkposition});
        else
           tickmark = new TickMark({angle: ang, lineWidth: 3.5, markposition:hourdmarkposition});  
        tickmark.drawmark(ctx,self.radius);      
      }
      ctx.restore();
    }

    self.drawNumbers = function(ctx)
    {     
      let ang;
      const numbers = 13;
      const numberposition = self.radius*0.85;

      for(let numbertodraw= 1; numbertodraw < numbers; numbertodraw++){
        ang = numbertodraw * Math.PI / 6 - Math.PI / 2;       
        let y1 = Math.sin(ang)*numberposition;
        let x1 = Math.cos(ang)*numberposition;
        let clocknumber = new ClockNumber({number: numbertodraw})  
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
  self.markposition = 350;
  
  self.angle = 0;

  for (var key in opt)
    self[key] = opt[key];

  self.drawmark = function(ctx,radius)
  {
    ctx.save();     
    ctx.lineWidth = self.lineWidth;            
    ctx.beginPath();
    let x1 =  Math.cos(self.angle) * radius;
    let y1 =  Math.sin(self.angle) * radius;
    let x2 =  Math.cos(self.angle) * self.markposition;
    let y2 =  Math.sin(self.angle) * self.markposition;             
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

  self.font  = 20 + "px arial";
  self.textBaseline="middle";
  self.textAlign="center";
  self.number = 0;

  for (var key in opt)
    self[key] = opt[key];

  self.drawnumber = function(ctx,x,y)
  {
    ctx.save();
    ctx.font  = self.font;
    ctx.textBaseline=self.textBaseline;
    ctx.textAlign=self.textAlign;
    ctx.fillText(self.number.toString(),x,y);
    ctx.restore();
  }
}

function Indicator(opt)
{
  var self = this;

  self.lineWidth = 2;
  self.angle = 20;
  self.style = 'black';
  self.radius =  (ctx.canvas.height/2)*0.8;

  for (var key in opt)
    self[key] = opt[key];
    
  self.drawhand = function(ctx)
  {
    let x = Math.cos(self.angle)*self.radius;
    let y = Math.sin(self.angle)*self.radius;
    
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


function AngleGetter(opt)
{
  var self = this;

  self.xpos = 0;
  self.ypos = 0;

  for (var key in opt)
    self[key] = opt[key];
    
  self.getAngle = function()
  {
    console.log(self.xpos.toString());
    let angle;
    if(self.xpos<0)
        {
          angle =  Math.atan(self.ypos/self.xpos)+Math.PI;
        }
        else
        {
          angle =  Math.atan(self.ypos/self.xpos);
        } 
        return angle;
  }
}





  

