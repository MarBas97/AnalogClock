let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let radius = canvas.height / 2; //obliczenie promienia zegara 
ctx.translate(radius, radius);
radius = radius * 0.90 //zmiejszenie promienia o 10% aby okrąg zawierał się w canvasie
let ang;
drawClock();
drawSecondsMarks();
drawHourMarks();

function drawClock()
{
    // pole zegara
    ctx.arc(0, 0, radius, 0 , 2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    // środek zegara
    ctx.beginPath();
    ctx.arc(0,0,radius*0.025,0,2*Math.PI);
    ctx.fillStyle = '#456';
    ctx.fill();  

    // cyfry zegara
    
    
    ctx.font = radius*0.1 + "px arial";
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    for(let num= 1; num < 13; num++){
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

function drawSecondsMarks() {

    for (var i = 0; i < 60; i++) {
        ang = (i - 3) * (Math.PI * 2) / 60;       
        ctx.lineWidth = 1;            
        ctx.beginPath();

        let x1 =  Math.cos(ang) * (radius);
        let y1 =  Math.sin(ang) * (radius);
        let x2 =  Math.cos(ang) * (radius - (radius / 30));
        let y2 =  Math.sin(ang) * (radius - (radius / 30));

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.strokeStyle = '#C4D1D5';
        ctx.stroke();
    }
}
function drawHourMarks() {

    for (var i = 0; i < 12; i++) {
        ang = (i - 3) * (Math.PI * 2) / 12;       
        ctx.lineWidth = 1.5;            
        ctx.beginPath();

        let x1 =   Math.cos(ang) * (radius);
        let y1 =   Math.sin(ang) * (radius);
        let x2 =   Math.cos(ang) * (radius - (radius / 15));
        let y2 =   Math.sin(ang) * (radius - (radius / 15));

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.strokeStyle = '#466B76';
        ctx.stroke();
    }
}



