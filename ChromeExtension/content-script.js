console.log("HERERE")


var TimeLoaded = Date.now();
window.addEventListener('beforeunload', function (e) {
    // Cancel the event
    //Send the information about what we did 
    if(chrome.storage){
        chrome.storage.sync.get(['articleLiked'],function(obj){
        fetch('https://127.0.0.1:5000/pushUserInteractionData', {
        method: 'POST',
        credentials: 'include',
        crossDomain:true,
        headers: {
            'Accept': 'text/html',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            timeSpent: TimeLoaded - Date.now(),
            liked: obj['articleLiked']
        })})
        });
    
    // .then(response => response.text())
    // .then(data => {
    //     console.log("test")
    //     console.log(data)
    //     e.returnValue = "";
    // })    \
    chrome.storage.sync.set({articleLiked: false}, function() {
        console.log("articleLikedFalse");
      });
    }
  });

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
                fetch('https://127.0.0.1:5000/getNextArticle', {credentials: 'include', 
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

