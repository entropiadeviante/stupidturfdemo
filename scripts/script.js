var breakpoints = document.getElementsByClassName('js-set')
  , breakpointsUsed = document.getElementsByClassName('js-used')
  , dataSource
  , h
  , ind
  , maxScreen
  , maxScreenElement = document.getElementById('maxScreen')
  , minScreen
  , rulerStyles = document.getElementById('rulers')
  , scaleFactor
  , screenH
  , screens = document.getElementsByClassName('js-screen')
  , screensContainer = document.getElementsByClassName('js-screens-container')
  , screensControls = document.getElementsByClassName('js-screens-controls')
  , screenW
  , signs = document.getElementsByClassName('js-sign')
  , signsLength
  , source = document.getElementById('data-source')
  , styles = ''
  , w

var lockStyle = function (direction, left, spacer, set) {
  var w = Math.round((direction - left) * screenW / maxScreen)
  return '.' +
    set +
    '[data-val="' + left + '"]' +
    '[data-direction="' + direction + '"]:before {' +
    'left: 0;' +
    ' width: ' + w + 'px;' +
    ' content: \'' + left + ' to ' + direction + '\';' +
    ' top: ' + spacer + 'px;' +
    '}'
}

var overStyle = function (direction, left, spacer, set) {
  var w = Math.round(left * screenW / maxScreen)
  return '.' +
    set +
    '[data-val="' + left + '"]' +
    '[data-direction="' + direction + '"]:after {' +
    'left: 0;' +
    ' width: calc( 100vw - ' + w + 'px);' +
    ' content: \'over ' + left + '\';' +
    ' top: ' + spacer + 'px;' +
    '}'
}

var underStyle = function (direction, left, spacer, set) {
  var w = Math.round(left * screenW / maxScreen)
  return '.' +
    set +
    '[data-val="' + left + '"]' +
    '[data-direction="' + direction + '"]:before {' +
    'left: -' + w + 'px;' +
    ' width: ' + w + 'px;' +
    ' content: \'under ' + left + '\';' +
    ' top: ' + spacer + 'px;' +
    '}'
}

var ditrectionStyle = function (direction, left, key, classes) {
  var spacer = Number(key) * 40 + 40

  if (direction === 'over') {
    styles += overStyle(direction, left, spacer, classes)
    return
  }

  if (direction === 'under') {
    styles += underStyle(direction, left, spacer, classes)
    return
  }

  if (direction === 'both') {
    styles += underStyle(direction, left, spacer, classes) + overStyle(direction, left, spacer, classes)
    return
  }

  styles += lockStyle(direction, left, spacer, classes)
}

var drawBreakpoints = function (bk) {
  Object.keys(bk).map(function (key) {
    var elem = bk[key]
    var left = elem.getAttribute('data-val')
    var classes = elem.classList

    var set = Object.keys(classes).map(
      function (key) {
        return classes[key]
      }
    ).filter(
      function (css) {
        return css !== 'breakpoint' && !css.includes('js-')
      }
    )

    var direction = elem.getAttribute('data-direction')
    elem.style.left = left * screenW / maxScreen + 'px'
    if (direction) {
      ditrectionStyle(direction, left, key, set)
    }
  })
}

var drawRulers = function () {
  drawBreakpoints(breakpointsUsed)
  drawBreakpoints(breakpoints)
  rulerStyles.innerHTML = styles
  styles = ''
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
  source.setAttribute('href', dataSource)
}

var init = function (args) {
  screenW = args.screenW ? args.screenW : window.innerWidth
  screenH = args.screenH ? args.screenH : window.innerHeight
  maxScreen = args.maxScreen ? args.maxScreen : document.getElementsByClassName('active')[0].getAttribute('data-max-screen')
  scaleFactor = args.scaleFactor ? args.scaleFactor : document.getElementsByClassName('active')[0].getAttribute('data-scale')
  dataSource = args.dataSource ? args.dataSource : document.getElementsByClassName('active')[0].getAttribute('data-source')
  signsLength = args.signsLength ? args.signsLength : signs[0].getAttribute('data-length')
  drawRulers()
  drawScreens()
  setSourceLink()
  drawSigns()
}

var resetRule = function () {
  document.getElementById('added-signs').remove()
}

var changeView = function (e) {
  var target = e.target.getAttribute('data-target')
  var max = screensContainer[target].getAttribute('data-max-screen')

  Object.keys(screensContainer).map(function (key) {
    screensContainer[key].classList.remove('active')
  })

  Object.keys(screensControls).map(function (key) {
    screensControls[key].classList.remove('selected')
  })

  screensContainer[target].classList.add('active')
  screensControls[target].classList.add('selected')

  maxScreenElement.setAttribute('value', max)

  resetRule()

  init({})
}

var flipDevice = function (e) {
  if (e.target.classList.contains('desktop')) {
    return
  }
  var flipText = e.target.firstElementChild.innerText
  flipText = flipText.split(' x ')
  e.target.firstElementChild.innerText = flipText[1] + ' x ' + flipText[0]
  w = e.target.getAttribute('data-width')
  h = e.target.getAttribute('data-height')
  e.target.setAttribute('data-width', h)
  e.target.setAttribute('data-height', w)
  drawScreens()
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
