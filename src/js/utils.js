const utils = {
  scrollIntoView: (elementId, offsetFromTop=60) => { // 60 is the typical fixed header height
    setTimeout(() => {
        // We have to wait until after the card has expanded before scrolling
        // We don't need to wait any set amount of time, just want to place in queue so Angular goes first
        const el = document.getElementById(elementId);
        if(el) {        
          el.scrollIntoView(true);
          // Scroll down just enough to clear the header
          window.scrollBy(0, -offsetFromTop);
        }
    }, 0);
  }
}

