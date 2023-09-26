import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appElseHyphen]'
})
export class ElseHyphenDirective {

  @Input('elseHyphen' ) elseHyphen: any;
  constructor(public elRef: ElementRef ) { }

  ngOnChanges() {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class. 
    if(this.elseHyphen == undefined || this.elseHyphen == null || this.elseHyphen == '' )
    this.elRef.nativeElement.innerHTML = '-';
    else this.elRef.nativeElement.innerHTML = this.elseHyphen;
  }
}
