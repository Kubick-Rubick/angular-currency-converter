import {
  AfterViewInit,
  OnInit,
  Component,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Currency} from "./shared/interface/Currency";
import {CurrencyService} from "./shared/service/currency.service";

@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
  public title = 'currency-exchange';

  public isDataAvailable: boolean = false;
  public failedToLoad: boolean = false;
  private _from: Currency | any;
  private to: Currency | any;
  public amount_value: number | any;
  @ViewChild('from') fromCmp;
  @ViewChild('to') toCmp;
  @ViewChild('amount_input', {static: false}) amount_input;
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @ViewChild('formExchange', {static: false}) formExchange;

  public resultFrom: string | undefined;
  public resultTo: string | undefined;
  public resultInfo: string | undefined;
  public isResult: boolean = false;
  public lastUpdate: string | undefined;

  //relate relative UAH
  public rateUSD: string | undefined;
  public rateEUR: string | undefined;
  
  get from_symbol(): string {
    return this._from.symbol;
  }

  constructor(private modalService: NgbModal, public service: CurrencyService) {
  }

  ngOnInit(): void {
    this.service.getCurrenciesPromise().then((data) => {
      this._from = data[0];
      this.to = data[1];
      this.isDataAvailable = true
      this.baseExchange();
    },
    () =>{
      this.failedToLoad = true;
      });

      let localAmount: string | null = localStorage.getItem("amount");
      this.amount_value = localAmount ? localAmount : (1).toFixed(2);
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  public selectFrom = (currency: Currency): void =>{
    this._from = currency;
    if(this.isResult)
      this.exchange();
  }

  public selectTo = (currency: Currency): void =>{
    this.to = currency;
    if(this.isResult)
      this.exchange();
  }

  public changeAmountValue(): void{
    this.amount_value = (Math.round( this.amount_value * 100) / 100).toFixed(2);
    localStorage.setItem("amount", this.amount_value);
    if(this.isResult)
      this.exchange();
  }

  public switchCurrencies(): void{
    let temp : Currency = this._from;
    this.fromCmp.selectCurrency(this.to);
    this.toCmp.selectCurrency(temp);
    if(this.isResult)
      this.exchange();
  }

  public exchange(): void{
    let rateBase: number = this.to.rate / this._from.rate;
    let result: number = this.amount_value * rateBase;
    this.resultFrom = this.amount_value + " " + (this._from.full_name ? this._from.full_name :  this._from.name) + " =";
    this.resultTo = (result).toFixed(5) + " " + (this.to.full_name ? this.to.full_name :  this.to.name);
    this.resultInfo = (1).toFixed(2) + " " + this._from.name + " = " + rateBase.toFixed(5) + " " +this.to.name + '\n '
                      +  (1).toFixed(2) + " " + this.to.name + " = " + (1/rateBase).toFixed(5) + " " +this._from.name ;
  }

  public baseExchange(): void{

    let currencyUSD: Currency | undefined = this.service.getCurrencies().find(item => item.name == 'USD');
    let currencyEUR: Currency | undefined = this.service.getCurrencies().find(item => item.name == 'EUR');
    // this.currencyEUR

    this.rateEUR = (1 / currencyEUR!.rate).toFixed(2);
    this.rateUSD = (1 / currencyUSD!.rate).toFixed(2);
  }

  onSubmit(): void {
    this.exchange();
    this.isResult = true;
    var date: object = new Date(this.service.getLastUpdate());
    this.lastUpdate = date.toLocaleString()  + " UTC";
  }

  windowResize(): void{
    this.submitBtn.nativeElement.style.width = this.formExchange.nativeElement.style.width;
  }

  ngAfterViewInit(): void {

  }
}