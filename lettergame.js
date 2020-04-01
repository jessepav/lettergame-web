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
  holder.style.width = String(w - margin*2) + 'px';
  holder.style.height = `${h - margin*2}px`;
  cw = holder.clientWidth;
  ch = holder.clientHeight;
  if (letter)
    letter.style.fontSize = ch * 1 + 'px';
}

window.addEventListener('resize', layoutElements);
window.addEventListener('load', layoutElements);

function toggleAnimation() {
  if (background.style.animationPlayState == 'running')
    background.style.animationPlayState = 'paused';
  else
    background.style.animationPlayState = 'running';
}

function toggleFullScreen() {
  if (document.fullscreenElement)
    document.exitFullscreen();
  else
    holder.requestFullscreen();
}

const letterRegexp = /^[A-Za-z0-9]$/;

document.addEventListener('keydown', keyEv => {
  if (keyEv.repeat)
    return;
  if (keyEv.key == 'a' && keyEv.ctrlKey) {
    keyEv.preventDefault();
    toggleAnimation();
    return;
  } else if (keyEv.key == 'f' && keyEv.ctrlKey) {
    keyEv.preventDefault();
    toggleFullScreen();
    return;
  }

  if (letterRegexp.test(keyEv.key)) {
    if (!letter) {
      letter = document.createElement("div");
      letter.classList.add('single-letter');
      letterWrapper.appendChild(letter);
    }
    let l = keyEv.key.toUpperCase();
    letter.style.fontSize = ch * 0.1 + 'px';
    window.setTimeout(() => {
      letter.style.color = randomColor();
      letter.textContent = l;
      let scale = l == 'Q' ? 0.9 : 1.0;
      console.log(scale);
      letter.style.fontSize = ch * scale + 'px'; 
    }, 200);
  }
});
