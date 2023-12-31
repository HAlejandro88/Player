
export const initVideoPlayer = (id, urlMarkets='', width = 730,height = 400) => {
    
    createVideo({src: 'http://vjs.zencdn.net/v/oceans.webm', width,height, id})


    
    console.log('init Player')
    const player = videojs(id,{
        responsive: true,
        playbackRates: [0.50, 1, 1.50, 2, 2.50, 3, 3.50, 4, 4.50, 5, 5.50, 6, 6.50, 7, 7.50, 8]
    });
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

    player.controlBar.addChild('button', {
        text: '',
        el: videojs.dom.createEl('span', {className: 'material-icons', id: 'help'})
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
    bookmark.style.marginTop = '3.3px'
    bookmark.style.cursor = 'pointer'

    createTooltip('bookmark', bookmark)

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
    replayTen.style.marginTop = '3.3px'
    replayTen.style.cursor = 'pointer'

    createTooltip('replayTen', replayTen)

    replayTen.addEventListener('click', event => {
        let currentTime = player.currentTime();
        player.currentTime(currentTime - 10);
    })

    const forwardTen = document.querySelector('#forward-ten');
    forwardTen.textContent = 'forward_10'
    forwardTen.style.marginTop = '3.3px'
    forwardTen.style.cursor = 'pointer'

    createTooltip('forwardTen', forwardTen)

    forwardTen.addEventListener('click', event => {
        let currentTime = player.currentTime();
        player.currentTime(currentTime + 10);
    })

    const help = document.querySelector('#help')
    help.textContent = 'help'
    help.style.marginTop = '2.3px'
    help.style.cursor = 'pointer'

    help.addEventListener('click', event => {

    })




    document.addEventListener('keydown', event => {
        if (event.key === 'k' || event.key === 'K') {
            if (player.paused()) {
                player.play();
            } else {
                player.pause();
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
            player.playbackRate(player.playbackRate() + 0.50);
        } else if (event.key === 'ArrowLeft') {
            
            player.playbackRate(player.playbackRate() - 0.50);
        }

        if (event.key === 'ArrowUp') {
            
            player.volume(player.volume() + 0.1);
        } else if (event.key === 'ArrowDown') {
            
            player.volume(player.volume() - 0.1);
        }
    })

    
    return player
}

export const createVideo = ({width, height, src, id}) => {

    const divConteiner = document.createElement('div')
    divConteiner.classList.add('container-md')
    divConteiner.classList.add('mt-1')

    const video = document.createElement('video');
    video.id = id;
    video.controls = true;
    video.className = 'video-js vjs-default-skin';
    video.autoplay = true;
    video.loop = true;
    video.width = width;
    video.height = height;
  
    // Crear las fuentes de video
   /* const sourceMP4 = document.createElement('source');
    sourceMP4.src = 'http://vjs.zencdn.net/v/oceans.mp4';
    sourceMP4.type = 'video/mp4';*/
  
    const sourceWebM = document.createElement('source');
    sourceWebM.src = src;
    sourceWebM.type = 'video/webm';
  
    // Agregar las fuentes de video al elemento de video
    //video.appendChild(sourceMP4);
    video.appendChild(sourceWebM);
  
    // Crear el contenedor para la entrada de texto y botones
    const contenedor = document.createElement('div');
    contenedor.className = 'contenedor';
  
    // Crear el grupo de entrada de texto
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group mb-3 mt-2';
  
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.placeholder = 'Escribe una pequeña nota';
    input.setAttribute('aria-label', "Recipient's username");
    input.setAttribute('aria-describedby', 'basic-addon2');
  
    inputGroup.appendChild(input);
  
    // Crear el contenedor para los botones
    const alignBtn = document.createElement('div');
    alignBtn.className = 'align-btn';
  
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-outline-secondary';
    cancelBtn.textContent = 'Cancelar';
  
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-dark';
    saveBtn.id = 'save';
    saveBtn.textContent = 'Guardar';
  
    alignBtn.appendChild(cancelBtn);
    alignBtn.appendChild(saveBtn);
  
    // Agregar el elemento de video y los contenedores al contenedor principal
    divConteiner.appendChild(video);
    contenedor.appendChild(inputGroup);
    contenedor.appendChild(alignBtn);
    divConteiner.appendChild(contenedor);

    document.body.appendChild(divConteiner)
  
    // Lógica adicional o manipulación de eventos se puede agregar aquí
  
    // Evento click para el botón "Guardar"
    saveBtn.addEventListener('click', function() {
        const note = input.value;
      // Lógica para guardar la nota...
        console.log('Nota guardada:', note);
    });
}


export const getCurrentTime = (player) => {
    //console.log(player.currentTime());
    return player.currentTime()
}



const createTooltip = (text = 'hola tooltip', element) => {
    //const help = document.querySelector('#help')
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#333'
    tooltip.style.color = '#fff'
    tooltip.style.padding = '5px'
    tooltip.style.borderRadius = '4px'
    tooltip.style.display = 'none'
    tooltip.textContent = text


    element.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
    });

// Evento al salir del elemento objetivo (ocultar tooltip)
    element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    element.addEventListener('mousemove', (event) => {
        tooltip.style.display = 'block';
        tooltip.style.left = `${event.clientX + 10}px`; // Ajusta la posición horizontal del tooltip
        tooltip.style.top = `${event.clientY + 10}px`; // Ajusta la posición vertical del tooltip
    });

    document.body.appendChild(tooltip)
    
}

