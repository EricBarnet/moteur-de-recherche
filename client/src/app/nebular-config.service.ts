import { Injectable } from '@angular/core';
import { NbThemeModule, NbThemeService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class NebularConfigService {

  constructor(private themeService: NbThemeService) {
    NbThemeModule.forRoot({ name: 'default' });
  }
}
