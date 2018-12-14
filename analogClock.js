
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










  

