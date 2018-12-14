
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.translate(canvas.height / 2, canvas.width/2); // sets point 0,0 in center of the canvas
let time = new Date;

let cloockface = new ClockFace();
cloockface.draw(ctx);
cloockface.drawMarks(ctx);




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

      for(let numbertodraw= 1; numbertodraw < numbers; num++){
        ang = num * Math.PI / 6 - Math.PI / 2;       
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









  

