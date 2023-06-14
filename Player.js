
export const initVideoPlayer = (id, urlMarkets='') => {

    console.log('init Player')
    const player = videojs(id);
    let markers  = []

    player.controlBar.addChild('button', {
        text: '',
        el: videojs.dom.createEl('span', {className: 'material-icons btn-controls', id: 'replay-ten'})
    });

    player.controlBar.addChild('button', {
        text: '',
        el: videojs.dom.createEl('span', {className: 'material-icons btn-controls', id: 'forward-ten'})
    });

    player.controlBar.addChild('button', {
        text: '',
        el: videojs.dom.createEl('i', {className: 'material-icons btn-controls bookmark'})
    });

    player.markers({
        markerStyle: {
            'width':'9px',
            'border-radius': '40%',
            'background-color': 'orange'
        },
        markerTip:{
            display: true,
            text: function(marker) {
                return "I am a marker tip: "+ marker.text;
            }
        },
        breakOverlay:{
            display: true,
            displayTime: 4,
            style:{
                'width':'100%',
                'height': '30%',
                'background-color': 'rgba(10,10,10,0.6)',
                'color': 'white',
                'font-size': '16px'
            },
            text: function(marker) {
                return "This is a break overlay: " + marker.overlayText;
            },
        },
        markers
    });

    window.addEventListener('load',async() => {
        try {
            const requestMarkers = await(await
                fetch('http://localhost:3000/markers')).json()
            player.markers.add(requestMarkers)
        } catch (error) {
            console.error('error')
        }
    })

    const inputs = document.querySelector('.contenedor')
    const save = document.querySelector('#save')
    const input = document.querySelector('input')

    const bookmark = document.querySelector('.bookmark');
    bookmark.textContent = 'bookmark'
    bookmark.addEventListener('click', event => {
        event.preventDefault()
        player.pause()
        if(inputs.style.display === 'block') {
            inputs.style.display = 'none';
        } else {
            inputs.style.display = 'block';
        }
    })

    let idAdd = 2;
    save.addEventListener('click',async event => {
        event.preventDefault()
        let pausedTime = player.currentTime();

        let newMarker = {
            id: idAdd + 2 ,
            time: pausedTime,
            text: input.value,
            overlayText: input.value,
        }

        player.markers.add([newMarker]);

        const saveMarker = await(await fetch('http://localhost:3000/markers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMarker)
        })).json()


        console.log(saveMarker)

        input.value = ''
        inputs.style.display = 'none'
        player.play()

    })

    const replayTen = document.querySelector('#replay-ten');

    replayTen.textContent = 'replay_10'

    

    replayTen.addEventListener('click', event => {
        let currentTime = player.currentTime();
        player.currentTime(currentTime - 10);
    })

    const forwardTen = document.querySelector('#forward-ten');
    forwardTen.textContent = 'forward_10'

    forwardTen.addEventListener('click', event => {
        let currentTime = player.currentTime();
        player.currentTime(currentTime + 10);
    })

    document.addEventListener('keydown', event => {
        if(event.key === 'k' || event.key === 'K') {
            if(player.play()) {
                console.log('que paso play');
                player.pause()
            } else {
                console.log('que paso pausa');
                player.play()
            }
        }

        if (event.key === '0') {
            player.currentTime(0);
            player.play()
        }

        if(event.key === 'j' || event.key === 'J') {
            let currentTime = player.currentTime();
            player.currentTime(currentTime - 10);
        }

        if(event.key === 'l' || event.key === 'L') {
            let currentTime = player.currentTime();
            player.currentTime(currentTime + 10);
        }

        if (event.key === 'ArrowRight') {
            player.playbackRate(player.playbackRate() + 0.25);
        } else if (event.key === 'ArrowLeft') {
            
            player.playbackRate(player.playbackRate() - 0.25);
        }

        if (event.key === 'ArrowUp') {
            
            player.volume(player.volume() + 0.1);
        } else if (event.key === 'ArrowDown') {
            
            player.volume(player.volume() - 0.1);
        }

        
    })

    return player
}





export const getCurrentTime = (player) => {
    //console.log(player.currentTime());
    return player.currentTime()
}

















