console.log("HERERE")


var TimeLoaded = Date.now();


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

