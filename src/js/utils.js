const utils = {
    scrollIntoView: (elementId, offsetFromTop = 60) => { // 60 is the typical fixed header height
        setTimeout(() => {
            // We have to wait until after the card has expanded before scrolling
            // We don't need to wait any set amount of time, just want to place in queue so Angular goes first
            const element = document.getElementById(elementId);
            if (element) {
                const rect = element.getBoundingClientRect();
                window.scrollTo({
                    top: rect.top + window.scrollY - offsetFromTop,
                    behavior: 'smooth'
                });
            }
        }, 0);
    }
}

