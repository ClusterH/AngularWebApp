import {MatPaginatorIntl} from '@angular/material/paginator';
import { TranslateParser, TranslateService } from '@ngx-translate/core';

export class CustomPaginator extends MatPaginatorIntl {

  private rangeLabelIntl: string;
  itemsPerPageLabel = 'Test';
  nextPageLabel     = 'Next page';
  previousPageLabel = 'Previous page';

  constructor(private translateService: TranslateService, private translateParser: TranslateParser) {
    super();
  }

  getTranslations() {
    this.translateService.get([
      'VEHICLES.ITEMS_PER_PAGE',
      'VEHICLES.NEXT_PAGE',
      'VEHICLES.PREVIOUS_PAGE',
      'VEHICLES.RANGE'
    ])
      .subscribe(translation => {
        this.itemsPerPageLabel = translation['VEHICLES.ITEMS_PER_PAGE'];
        this.nextPageLabel = translation['VEHICLES.NEXT_PAGE'];
        this.previousPageLabel = translation['VEHICLES.PREVIOUS_PAGE'];
        this.rangeLabelIntl = translation['VEHICLES.RANGE'];
        this.changes.next();
      });
  }

  getRangeLabel = (page, pageSize, length) => {
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return this.translateParser.interpolate(this.rangeLabelIntl, { startIndex, endIndex, length });
  };

}