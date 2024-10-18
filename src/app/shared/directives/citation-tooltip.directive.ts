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
        tooltip.scrollTop = 0;
        
        // Mostrar el tooltip
        tooltip.style.display = 'block';
        this.positionTooltip(target, tooltip);
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
        tooltip.scrollTop = 0;
        
        // Mostrar el tooltip
        tooltip.style.display = 'block';
        this.positionTooltip(target, tooltip);
      }
    }
  }

  positionTooltip(citation, tooltip) {
    const citationRect = citation.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Resetear estilos
    tooltip.style.left = '50%';
    tooltip.style.right = 'auto';
    tooltip.style.transform = 'translateX(-50%)';

    // Verificar si el tooltip se sale por la izquierda
    if (citationRect.left - tooltipRect.width / 2 < 0) {
      tooltip.style.left = '0';
      tooltip.style.transform = 'translateX(0)';
    }
    // Verificar si el tooltip se sale por la derecha
    else if (citationRect.right + tooltipRect.width / 2 > viewportWidth) {
      tooltip.style.left = 'auto';
      tooltip.style.right = '0';
      tooltip.style.transform = 'translateX(0)';
    }
  }
}