import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'faixaValida', standalone: true })
export class FaixaValidaPipe implements PipeTransform {
  transform(faixas: any[]): any[] {
    if (!faixas) return [];
    return faixas.filter(f => f.mediaPreco > 0);
  }
}
