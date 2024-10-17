import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCitationTooltip]'
})
export class CitationTooltipDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('citation-number')) {
      const tooltip = target.querySelector('.tooltip-content') as HTMLElement;
      if (tooltip) {
        this.renderer.setStyle(tooltip, 'display', 'block');
      }
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (target.classList.contains('citation-number') || target.classList.contains('tooltip-content')) {
      const citationNumber = target.classList.contains('citation-number') ? target : target.closest('.citation-number');
      const tooltip = citationNumber.querySelector('.tooltip-content') as HTMLElement;
      if (tooltip && !citationNumber.contains(relatedTarget) && !tooltip.contains(relatedTarget)) {
        this.renderer.setStyle(tooltip, 'display', 'none');
      }
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('citation-number')) {
      const tooltip = target.querySelector('.tooltip-content') as HTMLElement;
      if (tooltip) {
        const currentDisplay = tooltip.style.display;
        this.renderer.setStyle(tooltip, 'display', currentDisplay === 'none' ? 'block' : 'none');
      }
    }
  }
}