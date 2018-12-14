
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.translate(canvas.height / 2, canvas.width/2); // sets point 0,0 in center of the canvas
let time = new Date;

let cloockface = new ClockFace();
cloockface.draw(ctx);





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









  

