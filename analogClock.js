
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.translate(canvas.height / 2, canvas.width/2); // sets point 0,0 in center of the canvas
let time = new Date;
let choosenFlag = 'notchosen';
/**
 * Represent acutal second,set only once to allow changable time
 */
let seconds =  time.getSeconds(); 
/**
 * Represent acutal minute,set only once to allow changable time
 */
let minutes =  time.getMinutes(); 
/**
 * Represent acutal hour,set only once to allow changable time
 */
let hours =  time.getHours();     
setInterval(showClock, 1000);
    
 function showClock() 
 {

 
        
/**
 * Represent angle between center of the clock and destination point
 */
    let ang;
/**
 * Represent radius of the clock. Most of the parts of the clock base on this value
 */
    let radius = canvas.height / 2; 
    radius = radius * 0.90 
    ctx.clearRect(-canvas.height / 2,-canvas.width/2,canvas.width,canvas.height); //unnecessary but provides better visual efect
        
    drawClockBasicFace();
    drawMarks();
    drawHoursHand();
    drawMinutesHand();
    drawSecondsHand();
        


/**
 * Draw basic clock face:
 *  clock field, center of the clock and numbers
 */
function drawClockBasicFace()
{
    // field of clock
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0 , 2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    // center of the clock
    ctx.beginPath();
    ctx.arc(0,0,radius*0.025,0,2*Math.PI);
    ctx.fillStyle = '#456';
    ctx.fill();  

    // clock numbers
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

/**
 * Draw 60 time marks
 * every 5 is thicker and darker.
 */
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
/**
 * Draw second hand 
 * clock filed is divided into 60 parts,
 * angle is calculated based on actual second.
 */
function drawSecondsHand()
{
    ctx.lineWidth = 1.5;  
    ang = Math.PI * 2* (seconds/60) - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(0,0);
    let x = Math.cos(ang)*radius*0.9;
    let y = Math.sin(ang)*radius*0.9;
    ctx.lineTo(x,y);
    ctx.strokeStyle = '#586A73';        
    ctx.stroke();
    seconds++;
    if(seconds == 60)
    {
        seconds=0;
    }
}

/**
 * Draw minute hand,
 * clock filed is divided into 60 parts,
 * angle is calculated based on actual minute.
 */
function drawMinutesHand()
{
    
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#586A73';
    
    ang = (Math.PI * 2* (minutes/60)) - Math.PI/2;
    
    
    ctx.beginPath();
    ctx.moveTo(0,0);
    
    let x = Math.cos(ang)*radius*0.75;
    let y = Math.sin(ang)*radius*0.75;   
    ctx.lineTo(x,y);
            
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

/**
 * Draw hour hand,
 * clock filed is divided into 12 parts,
 * angle is calculated based on actual hour.
 */
function drawHoursHand()
{
    
    ctx.lineWidth = 4;
    
    ang = (Math.PI * 2* (hours/12)) - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(0,0);
    let x = Math.cos(ang)*radius*0.45;
    let y = Math.sin(ang)*radius*0.45;
    ctx.lineTo(x,y);
    ctx.strokeStyle = '#586A73';        
    ctx.stroke();
    if(minutes==59 && seconds==59)
    {
        hours++
        if(hours==12)
        {
            minutes=0;
        }
    }
}
}  
    

/**
 * On mouse down function check 
 * if any hand had been choosen
 * if not, function chooseHand is called.
 */
onmousedown = function()
    {    
        if(choosenFlag  == 'notchosen')
        {
            xpos = this.event.clientX - canvas.width/2;
            ypos = this.event.clientY - canvas.height/2;
            chooseHand(xpos,ypos);                     
        }      
    }
    /**
     * Based on which hand had been choosen 
     * calls setHour or setMinute function.
     */
onmouseup = function()
    {
        xpos = this.event.clientX - canvas.width/2;
        ypos = this.event.clientY - canvas.height/2;
        if(choosenFlag == 'h-hand')
        {          
            setHour(xpos,ypos);
        }
        if(choosenFlag == 'm-hand')
        {       
            setMinute(xpos,ypos);
        }
    }

/**
 * Calcutales if mouse cursor is near one of the clock hands,
 * if true, sets choosenFlag to corresponding hand.
 * @param {number} xpos - x position of cursor
 * @param {number} ypos - y position of cursor
 */
function chooseHand(xpos,ypos)
    {      
        
        
        if(xpos<0)
        {
            ang =  Math.atan(ypos/xpos)+Math.PI;
        }
        else
        {
            ang =  Math.atan(ypos/xpos);
        }  
        tmp = Math.round((30*ang)/Math.PI +15);
        
        tmp2 = Math.round((6*ang)/Math.PI +3); 
        if(tmp<minutes+2 && tmp>minutes-2)   // easier to click on hand     
        { 
            
            choosenFlag = 'm-hand';     
            console.log(flag);           
        }
        let englishformathour = hours;
        if(englishformathour>=12) 
        {
            englishformathour -= 12; // 20 ==> 8, 21==>9 itd
        }
        
        
        if(tmp2<englishformathour+1 && tmp2>englishformathour-1)        
        {           
            choosenFlag = 'h-hand';   
            console.log(flag);   
        }
    }
/**
 * Set hour based on angle between acutal mouse position
 * and center of the clock.
 * @param {number} xpos - x position of cursor
 * @param {number} ypos - y position of cursor
 */
    function setHour(xpos,ypos)
    {
        ang = calculateAngle(xpos,ypos);    
        hours = Math.round((6*ang)/Math.PI +3);        
        choosenFlag  = 'notchosen';
    }

    /**
     * Set minute based on angle between acutal mouse position
     * and center of the clock.
     * @param {number} xpos - x position of cursor
     * @param {number} ypos - y position of cursor
     */
    function setMinute(xpos,ypos)
    {
        
        ang = calculateAngle(xpos,ypos);    
        minutes = Math.round((30*ang)/Math.PI +15);        
        choosenFlag  = 'notchosen';
    }

/**
 * Calcutales angle between actual mouse position 
 * and center of the clock.
 * @param {number} xpos - x position of cursor
 * @param {number} ypos - y position of cursor
 */
    function calculateAngle(xpos,ypos)
    {     
        
        if(xpos<0)
        {
            ang =  Math.atan(ypos/xpos)+Math.PI;
        }
        else
        {
            ang =  Math.atan(ypos/xpos);
        }  
        return ang;
        
    }
    

