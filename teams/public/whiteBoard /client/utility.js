

function createbox(){

    let stickyPad = document.createElement("div");
    let navBar = document.createElement("div");
    let close = document.createElement("div");
    let minimize = document.createElement("div");
    let container = document.createElement("div");
    
    stickyPad.appendChild(navBar);
    stickyPad.appendChild(container);
    navBar.appendChild(close);
    navBar.appendChild(minimize);

    stickyPad.setAttribute("class" , "stickyPad");
    navBar.setAttribute("class" , "navBar");
    close.setAttribute("class" , "close");
    minimize.setAttribute("class" , "minimize");
    container.setAttribute("class" , "container");

    document.body.appendChild(stickyPad);

    let initialX = null;
    let initialY = null;
    let  isStickyDown = false;

    navBar.addEventListener("mousedown" ,function(event){
        initialX = event.clientX;
        initialY = event.clientY;
        isStickyDown = true;
    })

   board.addEventListener('mousemove' ,function(event){
       if( isStickyDown == true){
           let finalX = event.clientX;
           let finalY = event.clientY;

           let dx = finalX - initialX;
           let dy = finalY - initialY;

           let { top , left } = board.getBoundingClientRect();
           stickyPad.style.top = dy + top + "px";
           stickyPad.style.left = dx + left + "px";
           initialX = finalX;
           initialY = finalY;
       }
   })
    window.addEventListener("mouseup" , function(event){
        isStickyDown = false;
    })
    close.addEventListener("click" , function(event){
        stickyPad.remove();
    })
    let flag = true ;
    minimize.addEventListener("click" ,function(){
        if(flag == true){
            container.style.display = "none";
        }
        else{
            container.style.display = "block"
        }
        flag = !flag;
    })
    return container;
}