let holder = document.getElementById("holder");
let background = document.getElementById("background");
let letterWrapper = document.getElementById("letter-wrapper");
let letter = null;


let cw, ch;  // dimensions of our holder

function layoutElements() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let margin = document.fullscreenElement ? 0 : 15;
    holder.style.top = margin + 'px';
    holder.style.left = margin + 'px';
    holder.style.width = String(w - margin * 2) + 'px';
    holder.style.height = `${h - margin * 2}px`;
    cw = holder.clientWidth;
    ch = holder.clientHeight;
    if (letter)
        letter.style.fontSize = ch * 1 + 'px';
}

window.addEventListener('resize', layoutElements);
window.addEventListener('load', () => {
    window.setInterval(() => {
        if (letter)
            letter.style.color = randomColor();
    },
        3500);
});

function toggleAnimation(el) {
    let running = window.getComputedStyle(el).getPropertyValue('animation-play-state') == 'running';
    if (running)
        el.style.animationPlayState = 'paused';
    else
        el.style.animationPlayState = 'running';
}

let fullscreen = false;

function toggleFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        holder.style.cursor = 'default';
        navigator.keyboard.unlock();
        fullscreen = false;
    } else {
        holder.requestFullscreen();
        holder.style.cursor = 'none';
        navigator.keyboard.lock();
        fullscreen = true;
    }
}

let sound = new Howl({
    src: ['lettergame-sounds.mp3'],
    sprite: {
        'boing': [108, 965],
        'googoo': [9692, 1449],
        'note1': [1621, 996],
        'note2': [3185, 1106],
        'note3': [4854, 1168],
        'note4': [6538, 988],
        'note5': [8053, 1094]
    }
});
const notes = ['note1', 'note2', 'note3', 'note4', 'note5'];

sound.once('load', ev => {
    const loader = document.getElementById("loader");
    loader.parentNode.removeChild(loader);
    holder.style.display = 'block';
    layoutElements();
});

let soundEnabled = true;

const letterRegexp = /^[A-Za-z0-9]$/;

document.addEventListener('keydown', keyEv => {
    if (keyEv.repeat)
        return;

    const specialKey = keyEv.ctrlKey || keyEv.shiftKey || keyEv.altKey || keyEv.metaKey ||
                       keyEv.code.startsWith("Shift") || keyEv.code.startsWith("Alt") ||
                       keyEv.code.startsWith("Control") || keyEv.code.startsWith("Meta");

    if (keyEv.code == 'Digit2' && keyEv.ctrlKey && keyEv.shiftKey) {
        keyEv.preventDefault();
        if (letter)
            letter.classList.toggle('animate');
    } else if (keyEv.code == 'Digit3' && keyEv.ctrlKey && keyEv.shiftKey) {
        keyEv.preventDefault();
        toggleFullScreen();
    } else if (keyEv.code == 'Digit4' && keyEv.ctrlKey && keyEv.shiftKey) {
        keyEv.preventDefault();
        background.classList.toggle('plain-background');
    } else if (keyEv.code == 'Digit5' && keyEv.ctrlKey && keyEv.shiftKey) {
        keyEv.preventDefault();
        soundEnabled = !soundEnabled;
    } else if (keyEv.code == 'Backspace') {
        if (letter)
            letter.textContent = '';
    } else if (!specialKey && letterRegexp.test(keyEv.key)) {
        if (!letter) {
            letter = document.createElement("div");
            letter.classList.add('single-letter');
            letter.classList.add('animate');
            letterWrapper.appendChild(letter);
        }
        let key = keyEv.key.toUpperCase();
        if (soundEnabled)
            sound.play(notes[Math.floor(Math.random() * notes.length)]);
        letter.style.fontSize = ch * 0.1 + 'px';
        window.setTimeout(() => {
            letter.style.color = randomColor();
            letter.textContent = key;
            let scale = key == 'Q' ? 0.9 : 1.0;
            console.log(scale);
            letter.style.fontSize = ch * scale + 'px';
        }, 200);
    } else if (soundEnabled) {
        if (keyEv.code == 'Space')
            sound.play('googoo');
        else if (fullscreen || !specialKey)
            sound.play('boing');
    }

    if (fullscreen)
        keyEv.preventDefault();
});
