let score = 0;
let gameInterval;
let bombInterval = 2000;
let bombs = [];
let gameSpeedUpInterval;

const gameArea = document.getElementById('gameArea');
const leftZone = document.getElementById('leftZone');
const centerZone = document.getElementById('centerZone');
const rightZone = document.getElementById('rightZone');
const scoreDisplay = document.getElementById('score');
const retryButton = document.getElementById('retryButton');

function createBomb(fromBottom = false) {
  const bomb = document.createElement('div');
  bomb.classList.add('bomb');
  bomb.classList.add(Math.random() < 0.5 ? 'red' : 'blue');
  const startX = centerZone.offsetLeft + centerZone.clientWidth / 2 - 15;
  const startY = fromBottom ? gameArea.clientHeight - 30 : 0;
  bomb.style.left = `${startX}px`;
  bomb.style.top = `${startY}px`;
  gameArea.appendChild(bomb);

  bomb.bombTimeout = setTimeout(() => {
    bomb.classList.add('blink');
    bomb.explodeTimeout = setTimeout(() => {
      bombExplosion(bomb);
    }, 3000);
  }, 5000);

  bombs.push(bomb);

  bomb.draggable = true;
  bomb.addEventListener('mousedown', dragStart);
  bomb.addEventListener('touchstart', dragStart);
  bomb.addEventListener('mouseup', dragEnd);
  bomb.addEventListener('touchend', dragEnd);

  moveBomb(bomb);
}

function dragStart(event) {
  event.preventDefault();
  const bomb = event.target;
  bomb.classList.add('dragging');
  bomb.offsetX = (event.touches ? event.touches[0].clientX : event.clientX) - bomb.getBoundingClientRect().left;
  bomb.offsetY = (event.touches ? event.touches[0].clientY : event.clientY) - bomb.getBoundingClientRect().top;
  document.addEventListener('mousemove', dragging);
  document.addEventListener('touchmove', dragging);
}

function dragging(event) {
  event.preventDefault();
  const bomb = document.querySelector('.dragging');
  if (!bomb) return;

  bomb.style.left = `${(event.touches ? event.touches[0].clientX : event.clientX) - bomb.offsetX}px`;
  bomb.style.top = `${(event.touches ? event.touches[0].clientY : event.clientY) - bomb.offsetY}px`;
}

function dragEnd(event) {
  event.preventDefault();
  const bomb = document.querySelector('.dragging');
  if (!bomb) return;

  bomb.classList.remove('dragging');
  document.removeEventListener('mousemove', dragging);
  document.removeEventListener('touchmove', dragging);

  const bombRect = bomb.getBoundingClientRect();
  const leftRect = leftZone.getBoundingClientRect();
  const rightRect = rightZone.getBoundingClientRect();

  if (bomb.classList.contains('red') && isInZone(bombRect, rightRect)) {
    gameOver();
  } else if (bomb.classList.contains('blue') && isInZone(bombRect, leftRect)) {
    gameOver();
  } else if (isInZone(bombRect, leftRect) || isInZone(bombRect, rightRect)) {
    bomb.draggable = false;
    clearTimeout(bomb.bombTimeout);
    clearTimeout(bomb.explodeTimeout);
    bomb.style.position = 'relative';
    bomb.style.left = '';
    bomb.style.top = '';
    bomb.style.transform = 'none';

    if (isInZone(bombRect, leftRect)) {
      leftZone.appendChild(bomb);
    } else if (isInZone(bombRect, rightRect)) {
      rightZone.appendChild(bomb);
    }
    
    score++;
    scoreDisplay.innerText = `Score: ${score}`;
  }
}

function isInZone(bombRect, zoneRect) {
  return (
    bombRect.left >= zoneRect.left &&
    bombRect.right <= zoneRect.right &&
    bombRect.top >= zoneRect.top &&
    bombRect.bottom <= zoneRect.bottom
  );
}

function moveBomb(bomb) {
  bomb.moveInterval = setInterval(() => {
    bomb.style.left = `${parseFloat(bomb.style.left) + (Math.random() - 0.5) * 10}px`;
    bomb.style.top = `${parseFloat(bomb.style.top) + (Math.random() - 0.5) * 10}px`;
  }, 500);
}

function bombExplosion(bomb) {
  bomb.classList.remove('blink');
  bomb.classList.add('explosion');
  bomb.style.backgroundColor = 'yellow';
  setTimeout(() => gameOver(), 500);
}

function gameOver() {
  clearInterval(gameInterval);
  clearInterval(gameSpeedUpInterval);
  bombs.forEach(bomb => {
    clearTimeout(bomb.bombTimeout);
    clearTimeout(bomb.explodeTimeout);
    clearInterval(bomb.moveInterval);
    bomb.remove();
  });
  bombs = [];
  alert(`Game Over! Your score is ${score}`);
  score = 0;
  scoreDisplay.innerText = `Score: ${score}`;
  retryButton.style.display = 'block';
}

function speedUpGame() {
  clearInterval(gameInterval);
  bombInterval = bombInterval > 500 ? bombInterval - 500 : 500;
  gameInterval = setInterval(() => {
    createBomb();
    if (score >= 5) {
      createBomb(true);
    }
    if (score >= 10) {
      createBomb();
      createBomb(true);
    }
  }, bombInterval);
}

retryButton.addEventListener('click', () => {
  retryButton.style.display = 'none';
  bombInterval = 2000;
  gameInterval = setInterval(() => {
    createBomb();
    if (score >= 5) {
      createBomb(true);
    }
    if (score >= 10) {
      createBomb();
      createBomb(true);
    }
  }, bombInterval);
  gameSpeedUpInterval = setInterval(speedUpGame, 10000);
});

gameInterval = setInterval(() => {
  createBomb();
  if (score >= 5) {
    createBomb(true);
  }
  if (score >= 10) {
    createBomb();
    createBomb(true);
  }
}, bombInterval);
gameSpeedUpInterval = setInterval(speedUpGame, 10000);
