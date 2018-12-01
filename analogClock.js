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

    var ang;
    var num;
    ctx.font = radius*0.15 + "px arial";
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    for(num= 1; num < 13; num++){
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius*0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius*0.85);
        ctx.rotate(-ang);
    }
}
