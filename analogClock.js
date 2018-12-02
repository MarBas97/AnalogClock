
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.translate(canvas.height / 2, canvas.width/2); // ustawienie punktu 0,0 w środku canvas, skraca długość kodu i zwiększa jego czytelność
let time = new Date;
let seconds =  time.getSeconds(); // aktualny czas ustawiany jest tylko jeden raz...
let minutes =  time.getMinutes(); // ...uniezależnienie czasu zegara od aktualnego czasu...
let hours =  time.getHours();     // ...umożliwi to zmianę godziny na zegarze 
setInterval(showClock, 1000);
    
function showClock() {
        

    let ang;
    let radius = canvas.height / 2; //obliczenie promienia zegara 
    radius = radius * 0.90 //zmiejszenie promienia o 10% aby okrąg zawierał się w canvasie
    ctx.clearRect(-canvas.height / 2,-canvas.width/2,canvas.width,canvas.height); //teoretycznie niepotrzebe ale uzyskuje się tym lepszy efekt wizualny
        
    drawClockBasicFace();
    drawMarks();
    drawHoursHand();
    drawMinutesHand();
    drawSecondsHand();
        


function drawClockBasicFace()
{
    // pole zegara
    ctx.beginPath();
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
    for(let num= 1; num < 13; num++)
    {
        ang = num * Math.PI/6 - Math.PI/2;       
        let y1 = Math.sin(ang)*radius*0.85;
        let x1 = Math.cos(ang)*radius*0.85;
        ctx.fillText(num.toString(), x1, y1);
    }   

    

}

function drawMarks() 
{
    
    for (var i = 0; i < 60; i++) 
    {

        ang = i  * (Math.PI * 2) / 60;       
        ctx.lineWidth = 1;            
        ctx.beginPath();

        let x1 =  Math.cos(ang) * (radius);
        let y1 =  Math.sin(ang) * (radius);
        let x2 =  Math.cos(ang) * (radius - (radius / 30));
        let y2 =  Math.sin(ang) * (radius - (radius / 30));
        ctx.strokeStyle = '#C4D1D5';

        if(i%5===0)
        {
            ctx.lineWidth = 1.5; 
            x2 =   Math.cos(ang) * (radius - (radius / 15));
            y2 =   Math.sin(ang) * (radius - (radius / 15));
            ctx.strokeStyle = '#504C4C';

        }
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.stroke();
    }
}

function drawSecondsHand()
{
    ctx.lineWidth = 1.5;  
    ang = Math.PI * 2* (seconds/60) - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(ang)*radius*0.9,Math.sin(ang)*radius*0.9);
    ctx.strokeStyle = '#586A73';        
    ctx.stroke();
    seconds++;
    if(seconds == 60)
    {
        seconds=0;
    }
}

function drawMinutesHand()
{
    let mHand = document.createElement("mHand");
    ctx.lineWidth = 2.5;
    
    ang = (Math.PI * 2* (minutes/60)) - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo((Math.cos(ang)*radius*0.75),Math.sin(ang)*radius*0.75);
    ctx.strokeStyle = '#586A73';        
    ctx.stroke();
    if(seconds==59)
    {
        minutes++
        if(minutes==60)
        {
            minutes=0;
        }
    }
}

function drawHoursHand()
{
    ctx.lineWidth = 4;
    
    ang = (Math.PI * 2* (hours/12)) - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo((Math.cos(ang)*radius*0.45),Math.sin(ang)*radius*0.45);
    ctx.strokeStyle = '#586A73';        
    ctx.stroke();
    if(minutes==59)
    {
        hours++
        if(hours==12)
        {
            minutes=0;
        }
    }
}
}
