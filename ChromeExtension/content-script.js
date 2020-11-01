console.log("HERERE")
fetch('http://127.0.0.1:5000/insert')
    .then(response => response.text())
    .then(data => {
        document.querySelector('body').insertAdjacentHTML('afterend',data);
        // other code
        // eg update injected elements,
        // add event listeners or logic to connect to other parts of the app

        //I would prefer not to have this code here, but that is a convo for later I think....
        var arrows = document.querySelectorAll('.arrow')
        for ( const arrow of arrows){
            console.log("arrow")
            arrow.addEventListener('click',function(){
                fetch('http://127.0.0.1:5000/getNextArticle')
                .then(response => response.text())
                .then(data => {
                    window.location.replace(data)
                })
            })
        }
    }).catch(err => {
        // handle error
    });
