var boxWidth
  , input


var setWidth = function (e) {
  var elem = document.getElementById('mobile-box')

  boxWidth = e.target.value
  elem.setAttribute('data-width', boxWidth)
  elem.style.width = boxWidth + 'px'
}

var simulateMediaQuery = function (e) {
  var actualClass

  for (var elem of document.getElementsByClassName('item')) {
    var actualClass = elem.getAttribute('class')

    if (e.target.checked) {
      elem.setAttribute('class', actualClass + ' expected')
    } else {
      elem.setAttribute('class', actualClass.replace('expected', ''))
    }
  }
}
