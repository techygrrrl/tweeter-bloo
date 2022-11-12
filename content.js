console.log('🌀 Tweeter Bloo loaded 💩')

const MAX_PROFILE_PAGE_RETRIES = 10;
const MAX_PARENT_RETRIES = 20;

const pooEmoji = `
<svg data-poo="1" style="display: block; width: 20px; height: 20px; padding: 0 10px" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 47.5 47.5"
  style="enable-background:new 0 0 47.5 47.5;" id="svg2" xml:space="preserve">
  <defs id="defs6">
    <clipPath id="clipPath18">
      <path d="M 0,38 38,38 38,0 0,0 0,38 z" id="path20" />
    </clipPath>
  </defs>
  <g transform="matrix(1.25,0,0,-1.25,0,47.5)" id="g12">
    <g id="g14">
      <g clip-path="url(#clipPath18)" id="g16">
        <g transform="translate(34.541,13.8018)" id="g22">
          <path
            d="m 0,0 c 0.364,1.578 0.243,3.266 -0.458,4.946 -0.678,1.625 -1.847,2.91 -3.271,3.773 0.319,1.193 0.235,2.475 -0.324,3.751 -0.841,1.92 -2.66,3.201 -4.712,3.562 0.249,0.572 0.329,1.288 0.036,2.167 -1,3 -5,1 -8,4.999 -2.439,-1.464 -2.969,-3.639 -2.877,-5.487 -2.422,-0.412 -3.8,-0.936 -3.8,-0.936 l 0,-0.002 c -1.361,-0.551 -2.323,-1.884 -2.323,-3.443 0,-0.879 0.318,-1.676 0.829,-2.312 l -0.692,-0.259 10e-4,-0.003 c -2.33,-0.87 -3.975,-2.976 -3.975,-5.439 0,-1.046 0.3,-2.027 0.82,-2.878 -2.824,-1.268 -4.795,-4.022 -4.795,-7.241 0,-4.418 3.691,-8 8.244,-8 3.269,0 6.559,0.703 9.531,1.665 2.243,-1.04 5.695,-1.665 10.892,-1.665 4.05,0 7.333,3.283 7.333,7.333 C 2.459,-3.293 1.506,-1.344 0,0"
            id="path24" style="fill:#1C9BF1;fill-opacity:1;fill-rule:nonzero;stroke:none" />
        </g>
        <g transform="translate(18,21.5)" id="g26">
          <path
            d="M 0,0 C 0,-2.485 -1.567,-4.5 -3.5,-4.5 -5.433,-4.5 -7,-2.485 -7,0 -7,2.485 -5.433,4.5 -3.5,4.5 -1.567,4.5 0,2.485 0,0"
            id="path28" style="fill:#f5f8fa;fill-opacity:1;fill-rule:nonzero;stroke:none" />
        </g>
        <g transform="translate(28,21.5)" id="g30">
          <path
            d="M 0,0 C 0,-2.485 -1.566,-4.5 -3.5,-4.5 -5.434,-4.5 -7,-2.485 -7,0 -7,2.485 -5.434,4.5 -3.5,4.5 -1.566,4.5 0,2.485 0,0"
            id="path32" style="fill:#f5f8fa;fill-opacity:1;fill-rule:nonzero;stroke:none" />
        </g>
        <g transform="translate(17,21.5)" id="g34">
          <path
            d="m 0,0 c 0,-1.381 -0.896,-2.5 -2,-2.5 -1.104,0 -2,1.119 -2,2.5 0,1.381 0.896,2.5 2,2.5 1.104,0 2,-1.119 2,-2.5"
            id="path36" style="fill:#292f33;fill-opacity:1;fill-rule:nonzero;stroke:none" />
        </g>
        <g transform="translate(26,21.5)" id="g38">
          <path
            d="m 0,0 c 0,-1.381 -0.896,-2.5 -2,-2.5 -1.104,0 -2,1.119 -2,2.5 0,1.381 0.896,2.5 2,2.5 1.104,0 2,-1.119 2,-2.5"
            id="path40" style="fill:#292f33;fill-opacity:1;fill-rule:nonzero;stroke:none" />
        </g>
        <g transform="translate(10.4473,12.1055)" id="g42">
          <path
            d="m 0,0 c -0.246,0.492 0.003,0.895 0.553,0.895 l 18,0 c 0.55,0 0.799,-0.403 0.552,-0.895 0,0 -2.552,-5.105 -9.552,-5.105 C 2.553,-5.105 0,0 0,0"
            id="path44" style="fill:#292f33;fill-opacity:1;fill-rule:nonzero;stroke:none" />
        </g>
        <g transform="translate(20,11)" id="g46">
          <path
            d="M 0,0 C -2.771,0 -5.157,-0.922 -6.292,-2.256 -4.8,-3.211 -2.747,-4 0,-4 2.747,-4 4.801,-3.211 6.292,-2.256 5.157,-0.922 2.771,0 0,0"
            id="path48" style="fill:#EF15BF;fill-opacity:1;fill-rule:nonzero;stroke:none" />
        </g>
      </g>
    </g>
  </g>
</svg>
`

////////////////////////
// Globals
////////////////////////
let retryCount = 0;
let retryCountParentNode = 0;

// Profile page
let foundProfileIcon = false;
let checkmarkOnProfileReplaced = false;
let checkmarkOnProfileElement;
let shouldReplaceIconOnProfilePage = null;

// Feed page
// This gets updated from the background script
let globalBlueVerified = {
}



function lookForCheckmarkOnProfilePage() {
  if (foundProfileIcon) return;

  const interval = setInterval(() => {
    checkmarkOnProfileElement = document.querySelector('[data-testid="UserName"] svg')
    if (!checkmarkOnProfileElement) {
      // console.log('404 Checkmark Not Found')
      return
    }

    // console.log('Found the checkmark!', checkmarkOnProfileElement)

    let hasParent = false

    while (!hasParent && retryCountParentNode <= MAX_PARENT_RETRIES) {
      // console.log('Looking for parent')
      retryCountParentNode++

      if (checkmarkOnProfileElement.parentNode) {
        // Open the modal
        checkmarkOnProfileElement.parentNode.click()     
        hasParent = true
      }
    }

    if (retryCountParentNode > MAX_PARENT_RETRIES) {
      foundProfileIcon = false
      clearInterval(interval)
      return
    }

    let hoverCard = document.querySelector('[data-testid="HoverCard"]')
    let hoverCardRetries = 0

    const hoverCardInterval = setInterval(() => {
      hoverCardRetries++

      if (!hoverCard) {
        hoverCard = document.querySelector('[data-testid="HoverCard"]')
        return
      }

      if (hoverCardRetries > 200) {
        clearInterval(hoverCardInterval)
        return
      }
      const textContent = hoverCard.textContent
      if (!textContent) {
        return
      }
  
      shouldReplaceIconOnProfilePage = textContent.includes("Twitter Blue")

      checkmarkOnProfileElement?.parentNode?.click()
      clearInterval(hoverCardInterval)
    }, 20)

    foundProfileIcon = true
    clearInterval(interval)
  }, 500)
}


function replaceCheckmarkOnProfilePage() {
  if (checkmarkOnProfileReplaced) return;
  
  const interval = setInterval(() => {
    retryCount++

    if (retryCount > MAX_PROFILE_PAGE_RETRIES) {
      clearInterval(interval)
      return
    }

    if (!checkmarkOnProfileElement) {
      return
    }

    if (shouldReplaceIconOnProfilePage === null) {
      return;
    }

    if (shouldReplaceIconOnProfilePage === false) {
      clearInterval(interval)
      return;
    }

    const pooImage = document.createElement('span')
    pooImage.style['-webkit-animation'] = 'rotating-poo 2s linear infinite'
    pooImage.style['-moz-animation'] = 'rotating-poo 2s linear infinite'
    pooImage.style['-ms-animation'] = 'rotating-poo 2s linear infinite'
    pooImage.style['-o-animation'] = 'rotating-poo 2s linear infinite'
    pooImage.style['animation'] = 'rotating-poo 2s linear infinite'
    pooImage.innerHTML = pooEmoji

    checkmarkOnProfileElement.replaceWith(pooImage)

    clearInterval(interval)
  }, 500)
}


const MAX_FEED_PAGE_RETRIES = 20

function observeFeed() {
  if (!location.href.endsWith('home')) {
    console.log('Not on home feed')
    return
  }

  const interval = setInterval(() => {
    performFeedCheckMarkReplacement()
  }, 5000)
}



function performFeedCheckMarkReplacement() {
  // console.log('Processing report', report)
  let retryCountFeed = 0;
  let usernamesInFeed = document.querySelectorAll('[data-testid="User-Names"]')

  const interval = setInterval(() => {
    retryCountFeed++;

    usernamesInFeed = document.querySelectorAll('[data-testid="User-Names"]')

    if (retryCountFeed > MAX_FEED_PAGE_RETRIES) {
      clearInterval(interval)
      return
    }

    if (!usernamesInFeed) return

    usernamesInFeed.forEach((usernameNode) => {
      const username = usernameNode.textContent.split('@')[1].split('·')[0]?.trim()
      
      // console.log('Processing username', username)
      
      const isBlueVerified = globalBlueVerified[username]
      // console.log(username, isBlueVerified)
      if (isBlueVerified) {
        console.log(`🌀🌀🌀 username ${username} is blue verified`)
        console.log(usernameNode)

        const svgElement = usernameNode.querySelector('svg')
        if (svgElement && svgElement.hasAttribute('data-poo')) {
          return
        }

        const pooImage = document.createElement('span')
        pooImage.style.display = 'flex'
        pooImage.style['-webkit-animation'] = 'rotating-poo 2s linear infinite'
        pooImage.style['-moz-animation'] = 'rotating-poo 2s linear infinite'
        pooImage.style['-ms-animation'] = 'rotating-poo 2s linear infinite'
        pooImage.style['-o-animation'] = 'rotating-poo 2s linear infinite'
        pooImage.style['animation'] = 'rotating-poo 2s linear infinite'
        pooImage.innerHTML = pooEmoji
    
        svgElement.replaceWith(pooImage)
      } else {
        // console.log(`username ${username} is NOT blue verified`)
      }
    })

    clearInterval(interval)
  }, 500)
}

function performTweeterBloo() {
  lookForCheckmarkOnProfilePage()
  replaceCheckmarkOnProfilePage()
  addAnimationCss()
  observeFeed()
}

function addAnimationCss() {
  const css = `
  @-webkit-keyframes rotating-poo /* Safari and Chrome */ {
    from {
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes rotating-poo {
    from {
      -ms-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -ms-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  `;

  const style = document.createElement('style')
  style.innerHTML = css

  document.head.appendChild(style)
}

function handlePageNavigation(request) {
  resetEverything();
  performTweeterBloo();
}

function resetEverything() {
  retryCount = 0;
  retryCountParentNode = 0;
  foundProfileIcon = false;
  checkmarkOnProfileReplaced = false;
  checkmarkOnProfileElement = null;
  shouldReplaceIconOnProfilePage = null;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.type) {
      case 'URL_CHANGED':
        return handlePageNavigation(request)

      case 'VERIFIED_REPORT':
        return handleVerifiedReport(request)

      default:
        //
    }
});


function handleVerifiedReport(request) {
  if (request.type !== 'VERIFIED_REPORT') {
    return
  }

  globalBlueVerified = {
    ...globalBlueVerified,
    ...request.data,
  }

  performFeedCheckMarkReplacement()
}



// Do everything
performTweeterBloo();