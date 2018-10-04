var   screens = document.getElementsByClassName('screen')
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
;

var drawBreakpoints = function() {
  for( var elem of breakpoints ) {
    l = elem.getAttribute("data-val");
    elem.style.left = l * screenW / maxScreen + 'px';
  }
};

var drawSigns = function() {
  var newSigns = document.createElement('div');
  newSigns.setAttribute('id','added-signs');
  document.getElementById('rule').appendChild(newSigns);
  if( ! document.getElementById('added-signs').length ) {
    for( var sIndex = 1, elem; sIndex < signsLength; sIndex++ ) {
      elem = document.createElement('div');
      elem.setAttribute('class','sign added-sign');
      elem.innerHTML = parseInt(sIndex*maxScreen/signsLength);
      elem.style.left = sIndex*100/signsLength + 'vw';
      document.getElementById('added-signs').appendChild(elem);
    }
  }
};

var drawScreens = function() {
  for( var elem of screens ) {
    w = elem.getAttribute("data-width");
    h = elem.getAttribute("data-height");
    l = screenW * w / maxScreen;
    elem.style.width = w  / scaleFactor + 'px';
    elem.style.height = h / scaleFactor + 'px';
    elem.style.left = l + 'px';
  }
};

var setSourceLink = function() {
  document.getElementById('data-source').innerHTML = dataSource;
  document.getElementById('data-source').setAttribute('href', dataSource);
};

var init = function( args ) {
  screenW = args.screenW ? args.screenW : window.innerWidth;
  screenH = args.screenH ? args.screenH : window.innerHeight;
  maxScreen = args.maxScreen ? args.maxScreen : document.getElementsByClassName('active')[0].getAttribute('data-max-screen');
  scaleFactor = args.scaleFactor ? args.scaleFactor : document.getElementsByClassName('active')[0].getAttribute('data-scale');
  dataSource = args.dataSource ? args.dataSource : document.getElementsByClassName('active')[0].getAttribute('data-source');
  signsLength = args.signsLength ? args.signsLength : signs[0].getAttribute('data-length');
  drawBreakpoints();
  drawScreens();
  setSourceLink();
  drawSigns();
};

var resetRule = function() {
  document.getElementById('added-signs').remove();
};

var changeView = function(e, viewNumber) {
  document.getElementsByClassName('active')[0].setAttribute('class','screens-container');
  document.getElementsByClassName('selected')[0].setAttribute('class','button');
  e.target.setAttribute('class','button selected');
  screensContainer[viewNumber-1].setAttribute('class', 'screens-container active');
  document.getElementById('maxScreen').setAttribute('value',document.getElementsByClassName('active')[0].getAttribute('data-max-screen'));
  document.getElementById('maxScreen').value = screensContainer[viewNumber-1].getAttribute('data-max-screen');
  resetRule();
  init( {} );
};

var flipDevice = function(e) {
  var flipText = e.target.firstElementChild.innerText;
  flipText = flipText.split(' x ');
  e.target.firstElementChild.innerText = flipText[1] + ' x ' + flipText[0];
  w = e.target.getAttribute('data-width');
  h = e.target.getAttribute('data-height');
  e.target.setAttribute('data-width',h);
  e.target.setAttribute('data-height',w);
  drawScreens();
};

var enableUsedBkp = function(e) {
  if( e.target.checked ) {
    document.getElementById('used-breakpoints').setAttribute('class','');
  } else {
    document.getElementById('used-breakpoints').setAttribute('class','opacity-none');
  }
};

var setMaxResolution = function(e) {
  var maxScreen = e.target.value;
  document.getElementsByClassName('active')[0].setAttribute('data-max-screen', maxScreen);
  resetRule();
  init( {maxScreen: maxScreen} );
};

var setRuleInterval = function(e) {
  var newInterval = parseInt(e.target.value);
  document.getElementById('main-sign').setAttribute('data-length', newInterval);
  resetRule();
  init( {signsLength: newInterval} );
};

window.addEventListener('resize', function(event){
  init( {} );
});

init( {} );
