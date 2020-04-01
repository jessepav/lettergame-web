let holder = document.getElementById("holder");
let button = document.getElementById("all-purpose-button");
let background = document.getElementById("background");
let letterWrapper = document.getElementById("letter-wrapper");
let letter = null;

const bw = button.offsetWidth, bh = button.offsetHeight;
let cw, ch;  // dimensions of our holder

function layoutElements() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  button.style.left = `${w / 2 - bw / 2}px`;
  button.style.bottom = '15px';
  holder.style.top = '15px';
  holder.style.left = '15px';
  holder.style.width = String(w - 30) + 'px';
  holder.style.height = `${h - bh - 45}px`;
  cw = holder.clientWidth;
  ch = holder.clientHeight;
  if (letter)
    letter.style.fontSize = ch * 1 + 'px';
}

window.addEventListener('resize', layoutElements);
window.addEventListener('load', layoutElements);

button.addEventListener('click', function() {
  if (background.style.animationPlayState == 'running')
    background.style.animationPlayState = 'paused';
  else
    background.style.animationPlayState = 'running';
});

const letterRegexp = /^[A-Za-z0-9]$/;

document.addEventListener('keydown', keyEv => {
  if (keyEv.repeat)
    return;
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
