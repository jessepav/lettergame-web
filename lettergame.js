let holder = document.getElementById("holder");
let button = document.getElementById("all-purpose-button");
let background = document.getElementById("background");
let letter = document.querySelector(".single-letter");

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
  layoutLetter();
}

function layoutLetter() {
  letter.style.fontSize = ch * 1 + 'px';
  let lw = letter.clientWidth;
  letter.style.left = (cw/2 - lw/2) + 'px';
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
    let l = keyEv.key.toUpperCase();
    letter.textContent = l;
    layoutLetter();
  }
});
