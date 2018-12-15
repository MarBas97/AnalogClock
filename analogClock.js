
var canvas = document.getElementById("canvas");
var ctx = self.canvas.getContext("2d");


ctx.translate(canvas.height / 2, canvas.width/2); // sets point 0,0 in center of the canvas


function Clock()
{
  var self = this;
  self.now = new Date();
  self.clockface = new ClockFace();
  
  self.indicators = {
    s: new Indicator({radius: 170, angle: 0}),
    m: new Indicator({radius: 150, lineWidth: 2.75, angle: 100}),
    h: new Indicator({radius: 100, lineWidth: 5, style: 'red'})
  }
    


  self.build = function(){
  self.clockface.draw(ctx);
  self.clockface.drawNumbers(ctx);
  self.clockface.drawMarks(ctx);
  
  
  }
  
  


  self.update = function(){
    self.now = new Date();
    ctx.clearRect(-canvas.height / 2,-canvas.width/2,canvas.width,canvas.height);
    self.build();
    let second = self.now.getSeconds();
    let minute = self.now.getMinutes();
    let hour = self.now.getHours();

  let angle = {
    s: (Math.PI * 2 * (second / 60)) - Math.PI / 2,
    m: (Math.PI * 2 * (minute / 60) + (second * Math.PI / (30 * 60))) - Math.PI / 2,
    h: (Math.PI * 2 * (hour / 12) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60))) - Math.PI / 2
  };
  self.indicators.s.angle = angle.s;
  self.indicators.m.angle = angle.m;
  self.indicators.h.angle = angle.h;
  self.indicators.s.drawhand(ctx);
  self.indicators.m.drawhand(ctx);
  self.indicators.h.drawhand(ctx);
    setTimeout(self.update,1000);
  }
}


let clock = new Clock();
clock.build();
clock.update();


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








  

