

console.log("HERERE")


var TimeLoaded = Date.now();

function moveToNextArticle(){

        console.log("test")
        fetch('https://127.0.0.1:5000/getNextArticle', {credentials: 'include', 
        crossDomain:true, mode:'cors'})
        .then(response => response.text())
        .then(data => {
            console.log(data)

            window.location.replace(data)
        })              
    
}


fetch('https://127.0.0.1:5000/insert')
    .then(response => response.text())
    .then(data => {
        document.querySelector('body').insertAdjacentHTML('afterend',data);
        //I would prefer not to have this code here, but that is a convo for later I think....

        var thumbs = document.querySelector('#thumbsUp')
        thumbs.addEventListener('click',function(){
            chrome.storage.sync.set({articleLiked: true}, function() {
                console.log("articleLikedTrue");
                document.getElementById('thumbsUp').style.color = 'black;'
              });
        })

        var arrows = document.querySelectorAll('.arrow')
        for ( const arrow of arrows){
            console.log("arrow")
            arrow.addEventListener('click',function(){
                console.log("test")
                var url = 'https://127.0.0.1:5000/getNextArticle'
                var currentArticle=""
                if(window.location.href.includes('/wiki/')){
                    currentArticle = window.location.href.split('/wiki/')[1]
                    console.log(currentArticle)
                }
                if(currentArticle != ""){
                    url = url+"?currentURL=" + currentArticle
                }``
                
                fetch(url, {credentials: 'include', 
                crossDomain:true, mode:'cors'})
                .then(response => response.text())
                .then(data => {
                    console.log(data)
                    window.location.replace(data)
                })              
            })
        }
    }).catch(err => {
        // handle error
    });


var actualCode = `
    window.addEventListener('wheel', (e) => {
    //lastX is colloquially global
    if(window.lastX === undefined){
        window.lastX = 0;
    }
    if(window.xposX === undefined){
        window.xposX = 0;
    }
    
    
    window.xposX = (e.deltaX - window.lastX)*4;
    if((e.deltaX - window.lastX)*4 > 150){
        console.log("Forward to next")
        document.getElementById('swipeIndicator').style.backgroundColor = 'red';
        document.getElementById('swipeIndicator').style.width = e.deltaX - window.lastX*4;
        document.getElementById('swipeIndicator').style.height = e.deltaX - window.lastX*4;
        console.log("test")
        fetch('https://127.0.0.1:5000/getNextArticle', {credentials: 'include', 
        crossDomain:true, mode:'cors'})
        .then(response => response.text())
        .then(data => {
            console.log(data)

            window.location.replace(data)
        })  
    }
    
    
    console.log(window.xposX);
    
    
    if(e.deltaX >0 && window.lastX>0){//if its positive, movement is to right
        console.log("made dot");
        if(!document.contains(document.getElementById('swipeIndicator'))){
            var swipeIndicator = document.createElement('div');
            swipeIndicator.style = "position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:2.5px;background-color:black;"
            swipeIndicator.id = "swipeIndicator";
            document.querySelector('body').appendChild(swipeIndicator);
        }
        
    }
    
    if(document.contains(document.getElementById('swipeIndicator'))){
    
        var val = 'translate3D('+window.xposX+'px, 0px, 0px)'
        document.getElementById('swipeIndicator').style.transform = val;
    }
    
    if(e.deltaX>20 && window.lastX>20){
    console.log("both larger than 20");
    }
        
        console.log(e.deltaX);
        console.log(window.lastX);
    window.lastX = e.deltaX
    });`



var script = document.createElement('script');
script.textContent = actualCode;
document.getElementsByTagName('body')[0].appendChild(script);
