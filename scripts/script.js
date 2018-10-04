var screens = document.getElementsByClassName('screen')
  , screensContainer = document.getElementsByClassName('screens-container')
  , breakpoints = document.getElementsByClassName('breakpoint')
  , signs = document.getElementsByClassName('sign')
  , signsLength
  , maxScreen
  , minScreen
  , scaleFactor
  , dataSource
  , screenH
  , screenW
  , ind
  , w
  , h


var ditrectionStyle = function (direction, left, end) {
  var styleElem = document.head.appendChild(document.createElement('style'))

  if(end) {
    styleElem.innerHTML = '[data-val="' + left + '"][data-direction="' + direction + '"]:before {left: 0px; width: ' + (end - left) * screenW / maxScreen + 'px; content: \'from ' + left + 'px to ' + end + ' px\';}'
    return
  }

  if(direction === 'over'){
    styleElem.innerHTML = '[data-val="' + left + '"][data-direction="' + direction + '"]:after {left: 0; content: \'over ' + left + ' px\';}'
    return
  }

  if(direction === 'under'){
    styleElem.innerHTML = '[data-val="' + left + '"][data-direction="' + direction + '"]:before {left: -' + left * screenW / maxScreen + 'px; width: ' + left * screenW / maxScreen + 'px; content: \'under ' + left + ' px\';}'
    return
  }

  if(direction === 'both'){
    styleElem.innerHTML = '' +
      '[data-val="' + left + '"][data-direction="' + direction + '"]:after {left: 0; content: \'over ' + left + ' px\';}' +
      '[data-val="' + left + '"][data-direction="' + direction + '"]:before {left: -' + left * screenW / maxScreen + 'px; width: ' + left * screenW / maxScreen + 'px; content: \'under ' + left + ' px\';}'
    return
  }

}

var ditrectionWidth = function (elem, direction, left, end) {
  elem.style.width = direction === 'under' || end ? left * screenW / maxScreen + 'px' : '100%'
}

var drawBreakpoints = function () {
  for (var elem of breakpoints) {
    var left = elem.getAttribute('data-val')
    var direction = elem.getAttribute('data-direction')
    var end = elem.getAttribute('data-end')
    elem.style.left = left * screenW / maxScreen + 'px'
    if (direction) {
      ditrectionWidth(elem, direction, left, end)
      ditrectionStyle(direction, left, end)
    }
  }
}

var drawSigns = function () {
  var newSigns = document.createElement('div')
  newSigns.setAttribute('id', 'added-signs')
  document.getElementById('rule').appendChild(newSigns)
  if (!document.getElementById('added-signs').length) {
    for (var sIndex = 1, elem; sIndex < signsLength; sIndex++) {
      elem = document.createElement('div')
      elem.setAttribute('class', 'sign added-sign')
      elem.innerHTML = parseInt(sIndex * maxScreen / signsLength)
      elem.style.left = sIndex * 100 / signsLength + 'vw'
      document.getElementById('added-signs').appendChild(elem)
    }
  }
}

var drawScreens = function () {
  for (var elem of screens) {
    w = elem.getAttribute('data-width')
    h = elem.getAttribute('data-height')
    l = screenW * w / maxScreen
    elem.style.width = w / scaleFactor + 'px'
    elem.style.height = h / scaleFactor + 'px'
    elem.style.left = l + 'px'
  }
}

var setSourceLink = function () {
  document.getElementById('data-source').innerHTML = dataSource
  document.getElementById('data-source').setAttribute('href', dataSource)
}

var init = function (args) {
  screenW = args.screenW ? args.screenW : window.innerWidth
  screenH = args.screenH ? args.screenH : window.innerHeight
  maxScreen = args.maxScreen ? args.maxScreen : document.getElementsByClassName('active')[0].getAttribute('data-max-screen')
  scaleFactor = args.scaleFactor ? args.scaleFactor : document.getElementsByClassName('active')[0].getAttribute('data-scale')
  dataSource = args.dataSource ? args.dataSource : document.getElementsByClassName('active')[0].getAttribute('data-source')
  signsLength = args.signsLength ? args.signsLength : signs[0].getAttribute('data-length')
  drawBreakpoints()
  drawScreens()
  setSourceLink()
  drawSigns()
}

var resetRule = function () {
  document.getElementById('added-signs').remove()
}

var changeView = function (e, viewNumber) {
  document.getElementsByClassName('active')[0].setAttribute('class', 'screens-container')
  document.getElementsByClassName('selected')[0].setAttribute('class', 'button')
  e.target.setAttribute('class', 'button selected')
  screensContainer[viewNumber - 1].setAttribute('class', 'screens-container active')
  document.getElementById('maxScreen').setAttribute('value', document.getElementsByClassName('active')[0].getAttribute('data-max-screen'))
  document.getElementById('maxScreen').value = screensContainer[viewNumber - 1].getAttribute('data-max-screen')
  resetRule()
  init({})
}

var flipDevice = function (e) {
  var flipText = e.target.firstElementChild.innerText
  flipText = flipText.split(' x ')
  e.target.firstElementChild.innerText = flipText[1] + ' x ' + flipText[0]
  w = e.target.getAttribute('data-width')
  h = e.target.getAttribute('data-height')
  e.target.setAttribute('data-width', h)
  e.target.setAttribute('data-height', w)
  drawScreens()
}

var enableUsedBkp = function (e) {
  if (e.target.checked) {
    document.getElementById('used-breakpoints').setAttribute('class', '')
  } else {
    document.getElementById('used-breakpoints').setAttribute('class', 'opacity-none')
  }
}

var toggleBreaks = function (e) {
  if (e.target.checked) {
    document.getElementById('base-breakpoints').setAttribute('class', 'opacity-none')
  } else {
    document.getElementById('base-breakpoints').setAttribute('class', '')
  }
}

var setMaxResolution = function (e) {
  var maxScreen = e.target.value
  document.getElementsByClassName('active')[0].setAttribute('data-max-screen', maxScreen)
  resetRule()
  init({maxScreen: maxScreen})
}

var setRuleInterval = function (e) {
  var newInterval = parseInt(e.target.value)
  document.getElementById('main-sign').setAttribute('data-length', newInterval)
  resetRule()
  init({signsLength: newInterval})
}

window.addEventListener('resize', function (event) {
  init({})
})

init({})
