let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let radius = canvas.height / 2; //obliczenie promienia zegara 
ctx.translate(radius, radius);
radius = radius * 0.90 //zmiejszenie promienia o 10% aby okrąg zawierał się w canvasie
drawClock(ctx,radius);


function drawClock(ctx,radius)
{
    ctx.arc(0, 0, radius, 0 , 2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0,0,radius*0.05,0,2*Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();  
}
