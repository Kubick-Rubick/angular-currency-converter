import {Component, Input} from '@angular/core';
import {Currency} from "../../shared/interface/Currency";

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['../currency-selector.component.scss']
})
export class CurrenciesComponent{
  //@ts-ignore
  @Input() selectCurrency: Function;
  //@ts-ignore
  @Input() currency: Currency;

  public selectCurrencyFunc(currency: Currency): void{
    this.selectCurrency(currency);
  }

}