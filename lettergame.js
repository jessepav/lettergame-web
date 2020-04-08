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

let spriteCntr = Math.floor(Math.random() * sprites.length);

function startNewSprite() {
    let img = document.createElement("img");
    let spriteName = sprites[spriteCntr];
    spriteCntr = (spriteCntr + 1) % sprites.length;
    img.src = spriteName;
    img.height = ch / 5;
    background.appendChild(img);
    img.classList.add('sprite-img');
    img.addEventListener("animationend", ev => {
        img.remove();
    });
    if (soundEnabled && spriteSoundMap.has(spriteName)) {
        window.setTimeout(() => {
            sound.play(spriteSoundMap.get(spriteName));
        }, 2000);
    }
}

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

let sound = new Howl(howlParams);

const letterRegexp = /^[A-Za-z0-9]$/;

let lastKeyHitTime = performance.now();

document.addEventListener('keydown', keyEv => {
    if (keyEv.repeat)
        return;
    
    const specialKey = keyEv.ctrlKey || keyEv.shiftKey || keyEv.altKey || keyEv.metaKey ||
                       keyEv.code.startsWith("Shift") || keyEv.code.startsWith("Alt") ||
                       keyEv.code.startsWith("Control") || keyEv.code.startsWith("Meta");

    const mappedSound = keySoundMap.get(keyEv.code); // may be undefined

    // We may need to debounce manually, since keyEv.repeat fails on certain keyboards
    if (mappedSound != undefined || !specialKey) {  // basically anything that might make a sound
        let kht = performance.now();
        if (kht - lastKeyHitTime < 300)
            return;
        lastKeyHitTime = kht;
    }

    if (keyEv.code == 'Digit1' && keyEv.ctrlKey && keyEv.shiftKey) {
        keyEv.preventDefault();
        startNewSprite();
    } else if (keyEv.code == 'Digit2' && keyEv.ctrlKey && keyEv.shiftKey) {
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
        if (soundEnabled) {
            if (mappedSound)
                sound.play(mappedSound);
            else
                sound.play(notes[Math.floor(Math.random() * notes.length)]);
        }
        letter.style.fontSize = ch * 0.1 + 'px';
        window.setTimeout(() => {
            letter.style.color = randomColor();
            letter.textContent = key;
            let scale = key == 'Q' ? 0.9 : 1.0;
            console.log(scale);
            letter.style.fontSize = ch * scale + 'px';
        }, 200);
    } else if (soundEnabled) {
        if (mappedSound)
            sound.play(mappedSound);
        else if (!specialKey)
            sound.play(otherSound);
    }

    if (fullscreen)
        keyEv.preventDefault();
});

window.addEventListener('resize', layoutElements);
window.addEventListener('load', () => {
    window.setInterval(() => {
        if (letter)
            letter.style.color = randomColor();
    },
    3500);
    window.setTimeout(() => {
        startNewSprite();
        window.setInterval(startNewSprite, 60000);
    }, 15000);
});

sound.once('load', ev => {
    const loader = document.getElementById("loader");
    loader.remove();
    holder.style.display = 'block';
    layoutElements();
});
