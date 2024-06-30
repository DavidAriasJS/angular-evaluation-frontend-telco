import { formatDate } from '@angular/common';
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective implements OnChanges {
  @Input('appDateFormat') date: string | undefined;
  @Input() format: string = 'MM/dd/yyyy';

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date']) {
      this.el.nativeElement.innerText = formatDate(this.date!, this.format, 'es-ES');
    }
  }
}