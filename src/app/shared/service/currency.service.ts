import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../interface/Currency';
import { Rates } from '../interface/Rates';
import { CurrencyName } from '../interface/CurrencyName';
// import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService{

  public entities$: Subject<Currency[]> = new Subject<Currency[]>;

  private currencies: Currency[] = [];
  private lastUpdate: string | undefined;

  constructor(private http: HttpClient) {
  }

  public getCurrencies(): Currency[]{
    return this.currencies;
  }

  public getLastUpdate(): string {
    //@ts-ignore
    return this.lastUpdate;
  }

  public getCurrencies$(): void{
    if(this.currencies.length == 0) {
      //get rate and short name of currency
      this.http.get<Rates>('https://open.er-api.com/v6/latest/UAH').subscribe(data => {
        for (let key in data.rates){
          let value: number = data.rates[key];
          // for example rate: 38.28, name: USD  
          let currency:Currency = {rate: value, full_name: '', name: key, symbol: ''};
          this.currencies.push(currency);
        }
        // last rate update of service
        this.lastUpdate = data.time_last_update_utc;
        this.http.get<CurrencyName[]>('https://restcountries.com/v3.1/all?fields=currencies').subscribe((data) => {

          data.forEach(currency => {
            let name: string = Object.keys(currency.currencies)[0]
            let index: number = this.currencies.findIndex(element => element.name==name);
            if (index!=-1)
              // get symbol and full name  
              this.currencies[index] = {...this.currencies[index], full_name: currency.currencies[name].name, symbol: currency.currencies[name].symbol}
          })
          this.entities$.next(this.currencies);
        })
      })
    } else {
      this.entities$.next(this.currencies);
    }
  }
}