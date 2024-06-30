import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { DateFormatDirective } from './directives/date-format.directive';

@NgModule({
  declarations: [
    ErrorComponent,
    DateFormatDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
  
  ]
})
export class SharedModule { }
