
var TimeLoaded = Date.now();

function moveToNextArticle() {

    console.log("test")
    console.log("test")
    var url = 'https://127.0.0.1:5000/getNextArticle'
    var currentArticle = ""
    if (window.location.href.includes('/wiki/')) {
        currentArticle = window.location.href
        console.log(currentArticle)
    }
    if (currentArticle != "") {
        url = url + "?currentURL=" + currentArticle
    } ``

    fetch(url, {
        credentials: 'include',
        crossDomain: true, mode: 'cors'
    })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            window.location.replace(data)
        })

}

function stripArticle() {

    // it's hacky, but it gets the job done. styles the current article. 

    var elementsToClearById = ['mw-page-base', 'mw-head', 'footer', 'mw-navigation', 'siteNotice', 'mw-head-base', 'top', 'mw-data-after-content', 'siteSub'];

    for (x = 0; x < elementsToClearById.length; x++) {
        var element = document.getElementById(elementsToClearById[x]);
        while (element.firstChild) {
            element.removeChild(element.lastChild)
        }
        element.parentNode.removeChild(element);
    }

    var elementsToClearByClass = ['box-Tone', 'box-Expand_section', 'box-Update', 'box-Multiple_issues', 'mw-indicator', 'box-More_citations_needed', 'box-More_citations_needed_section']
    for (x = 0; x < elementsToClearByClass.length; x++) {
        var element = document.getElementsByClassName(elementsToClearByClass[x]);
        while (element.length > 0) {
            element[0].parentNode.removeChild(element[0]);
        }
    }

    var body = document.getElementsByTagName("BODY")[0];
    body.style.backgroundColor = "white";

    var content = document.getElementById('content');
    content.classList.remove("mw-body");
    content.style.margin = null;
    content.style.paddingInlineStart = "10px";
    content.style.color = "black";
    content.style.backgroundColor = "white";
    content.style.marginInlineStart = "200px";
    content.style.fontFamily = "tahoma";

    fetch(chrome.runtime.getURL('/navigation.html'))
        .then(response => response.text())
        .then(data => {
            content.parentNode.insertAdjacentHTML('afterbegin', data);
            updateDrawer();
        }).catch(err => {

        });

}


function updateDrawer() {

    var drawerDiv = document.getElementById("drawer-main-div");
    var links = [{ url: "URL1:)xxxxxxxxxxxxxxxxx" }, { url: "URL 2 :|" }, { url: "URL 3 :(" }];

    for (const link of links) {
        var linkDiv = document.createElement("div");
        linkDiv.classList.add('menu-item');
        var clickLink = document.createElement("a");
        clickLink.innerHTML = link.url;
        drawerDiv.appendChild(linkDiv);
        linkDiv.appendChild(clickLink);
    }
}

fetch('https://127.0.0.1:5000/insert')
    .then(response => response.text())
    .then(data => {
        document.querySelector('body').insertAdjacentHTML('afterend', data);
        //I would prefer not to have this code here, but that is a convo for later I think....

        var thumbs = document.querySelector('#thumbsUp')
        thumbs.addEventListener('click', function () {
            chrome.storage.sync.set({ articleLiked: true }, function () {
                console.log("articleLikedTrue");
                document.getElementById('thumbsUp').style.color = 'black;'
            });
        })

        var arrows = document.querySelectorAll('.arrow')
        for (const arrow of arrows) {
            console.log("arrow")
            arrow.addEventListener('click', function () {
                console.log("test")
                var url = 'https://127.0.0.1:5000/getNextArticle'
                var currentArticle = ""
                if (window.location.href.includes('/wiki/')) {
                    currentArticle = window.location.href
                    console.log(currentArticle)
                }
                if (currentArticle != "") {
                    url = url + "?currentURL=" + currentArticle
                } ``

                fetch(url, {
                    credentials: 'include',
                    crossDomain: true, mode: 'cors'
                })
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
        var url = 'https://127.0.0.1:5000/getNextArticle'
        var currentArticle = ""
        if (window.location.href.includes('/wiki/')) {
            currentArticle = window.location.href
            console.log(currentArticle)
        }
        if (currentArticle != "") {
            url = url + "?currentURL=" + currentArticle
        } 

        fetch(url, {
            credentials: 'include',
            crossDomain: true, mode: 'cors'
        })
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


stripArticle();

var script = document.createElement('script');
script.textContent = actualCode;
document.getElementsByTagName('body')[0].appendChild(script);