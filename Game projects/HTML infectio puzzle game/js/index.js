const $board = document.querySelector('board')
const $palette = document.querySelector('colors')
const $gameover = document.querySelector('game-over')
const $tally = document.querySelector('.moves')
const $cap = document.querySelector('.max-moves')
const $level = document.querySelector('.level')
const $skill = document.querySelector('.skill')
const colorArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

let maxMoves = (colors, skill) => {
  return Math.ceil((colors.length * 3.7 - (skill / 1.5)) / 5) * 5
}

let running = false
let cell = '-x'
let moves = 0
let skill = Math.round(colorArray.length/2) || $level.value
let cap = maxMoves(colorArray, skill)
let color

let shuffle = (a) => {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a
}

let setColors = (collection, n) => {
  return n < 10 ? shuffle(collection).slice(0, n) : collection
}

let checkWin = (moves, cap) => {
  let n = 0
  let msg = ''
  if (moves <= cap) {
    if ($board.childNodes[99].className.indexOf(cell) > -1) {
      for (let i = 0; i < 100; i++) {
        if ($board.childNodes[i].className.indexOf(cell) > -1) {
          n++
        }
      }
    }
    if (n === 100) {
      msg = '<i class="new-game fa fa-smile-o"></i>'
      skill++
      running = false
    } else if (n < 100 && moves >= cap) {
      msg = '<i class="new-game fa fa-frown-o"></i>'
      skill--
      running = false
    }
  } else {
    msg = '<i class="new-game fa fa-frown-o"></i>'
    skill--
    running = false
  }
  if(!running) {
    $gameover.innerHTML = msg
  }
  skill = skill < 3 ? 3 : (skill > 10 ? 10 : skill)
}

let checkColor = (color) => {
  let nodes = $board.childNodes
  let boo = ''
  for(let x = 0; x < 100; x++) {
    if(nodes[x].className.indexOf(cell) > -1) {
      nodes[x].className = color + cell
      if (x + 1 < 100 && nodes[x + 1].className === color) {
        nodes[x + 1].className += cell
      }
      if (x + 10 < 100 && nodes[x + 10].className === color) {
        nodes[x + 10].className += cell
      }
      if (x - 1 >= 0 && x % 10 > 0 && nodes[x - 1].className === color) {
        nodes[x - 1].className += cell
      }
      if (x - 10 >= 0 && x % 10 > 0 && nodes[x - 10].className === color) {
        nodes[x - 10].className += cell
      }
    }
  }
}

let builder = (container, element, collection, count, randomize) => {
  container.innerHTML = ''
  count = count || collection.length
  randomize = randomize || false
  for (var i = 0; i < count; i++) {
    let $child = document.createElement(element)
    $child.className = randomize ? collection[Math.floor((Math.random() * collection.length))] : collection[i]
    // $child.style.transitionDelay = Math.floor((Math.random() * 10)) * 100/5 + 'ms'
    container.appendChild($child)
  }
}

let newGame = () => {
  $level.value = skill
  $skill.innerText = skill
  let colors = setColors(colorArray.slice(), skill)
  moves = 0
  cap = maxMoves(colors, skill)
  $tally.innerText = moves
  $gameover.innerHTML = ''
  running = true
  $cap.innerText = cap
  builder($palette, 'color', colors)
  builder($board, 'tile', colors, 100, true)
  color = $board.childNodes[0].className
  $board.className = ''
  $board.childNodes[0].className = color + cell
  checkColor(color)
}

let play = (chip) => {
  if (running && color !== chip){
    color = chip
    if($board.className !== 'started') {
      $board.className = 'started'
    }
    moves++
    $tally.innerText = moves
    checkColor(chip)
    checkWin(moves, cap)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  newGame()
}, false)

$level.addEventListener('change', (e) => {
  skill = e.target.value
  newGame()
}, false)
                          
document.addEventListener('click', (e) => {
  let css = Array.from(e.target.classList)
  if(e.target.tagName == 'COLOR') {
    play(e.target.className)
  }
  else if(css.includes('new-game')) {
    newGame()
  }
})