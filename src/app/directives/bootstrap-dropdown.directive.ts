import { Directive, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBootstrapDropdown]'
})
export class BootstrapDropdownDirective implements AfterViewInit {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Bootstrap 5 uses data-bs-toggle="dropdown" for auto-initialization
    // But if that's not working, we can manually attach event listeners
    const element = this.elRef.nativeElement as HTMLElement;
    
    // Add click handler for dropdown toggles
    if (element.getAttribute('data-bs-toggle') === 'dropdown') {
      element.addEventListener('click', (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Find the parent dropdown and toggle it
        const dropdown = element.closest('.dropdown');
        if (dropdown) {
          dropdown.classList.toggle('show');
          element.setAttribute('aria-expanded', 'true');
        }
      });
    }
  }
}
