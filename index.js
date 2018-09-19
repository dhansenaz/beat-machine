//function to return sound
let audio = new AudioContext() // browser API

function createSineWave(audio, duration) {
    let oscillator = audio.createOscillator(); //oscillator is built into the web API
    oscillator.type = 'sine';

    oscillator.start(audio.currentTime);
    oscillator.stop(audio.currentTime + duration)

    return oscillator;
};

function rampDown(audio, item, startValue, duration) {
    item.setValueAtTime(startValue, audio.currentTime);
    item.exponentialRampToValueAtTime(0.01, audio.currentTime + duration);
}

function createAmplifier(audio, startValue, duration) {
    let amplifier = audio.createGain();
    rampDown(audio, amplifier.gain, startValue, duration);
    return amplifier;
};

function chain(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].connect(items[ i + 1])
    }
};

function note(audio, frequency) {
    return function() {
        let duration = 1;
        let sineWave = createSineWave(audio, duration);

        chain([sineWave, createAmplifier(audio, 0.2, duration),audio.destination])
        sineWave.connect(audio.destination); //sends the wave to the destination tells the browser to play.
    };
};

function createTrack(color, playSound) {
    var steps =[];
    for(let i = 0; i < 16; i++) {
        steps.push(false)
    }

    return { steps: steps, color: color, playSound: playSound }
};

let BUTTON_SIZE = 26
function buttonPosition(column, row) {
    return {
        x: BUTTON_SIZE / 2 + column * BUTTON_SIZE * 1.5,
        y: BUTTON_SIZE / 2 + row * BUTTON_SIZE * 1.5,
    };
};

function drawButton(screen, column, row, color) {
    let position = buttonPosition(column, row);
    screen.fillStyle = color;
    screen.fillRect(position.x, 
                    position.y, 
                    BUTTON_SIZE, 
                    BUTTON_SIZE)
};

function drawTracks(screen, data) {
    data.tracks.forEach(function(track, row) {
        track.steps.forEach(function(on, column){
            drawButton(screen, 
                    column, 
                    row, 
                    on ? track.color : 'lightgray')
        });
    });
};

let data = { 
    step: 0, 
    tracks: [createTrack("gold", note(audio, 440))]
};

let screen = document.getElementById("screen").getContext('2d');

// draw function which is esentially a loop. this will ensure it keeps drawing.
(function draw() {
    drawTracks(screen, data)
    requestAnimationFrame(draw)
})();
// 440 is the frequency. the number controls the pitch.

note(audio, 440)()