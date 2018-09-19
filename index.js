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

// 440 is the frequency. the number controls the pitch.

note(audio, 440)()