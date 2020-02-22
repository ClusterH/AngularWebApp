import { Component } from '@angular/core';

@Component({
  selector: 'app-block-temp',
  styles: [`
    :host {
      text-align: center;
    }
  `],
  template: `
    <div class="block-ui-template">
      <i class="feather ft-refresh-cw icon-spin font-medium-2" aria-hidden="true"></i>
      <div><strong>{{message}}</strong></div>
    </div>
  `
})
export class BlockTemplateComponent {
  message: any;
}
