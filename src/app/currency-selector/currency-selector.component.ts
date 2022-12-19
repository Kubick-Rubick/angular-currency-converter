import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Currency} from "../shared/interface/Currency";
import {CurrencyService} from "../shared/service/currency.service";


@Component({
  selector: 'app-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['../../assets/css/default.scss','./currency-selector.component.scss']
})
export class CurrencySelectorComponent implements OnInit {

  public edited: boolean = true;
  //@ts-ignore
  @Input() changeCurrency: Function;
  //@ts-ignore
  @Input() selectorId: string;
  
  public currencies: Currency[] = [];
  public selectedCurrency: Currency | undefined;
  //@ts-ignore
  public findCurrency: string;
  public ignoreFocusOut: boolean = false;

  public noResultsFind: boolean = false;
  @ViewChild('search_input', {static: false}) search_input;
  @ViewChild('currenciesList', {static: false}) currenciesList;

  constructor(private changeDetector: ChangeDetectorRef,  public service: CurrencyService) {

  }

  ngOnInit(): void {
    this.currencies = this.service.getCurrencies();

    this.selectedCurrency = this.service.getCurrencies()[0];
    this.changeCurrency(this.service.getCurrencies()[0]);
  }

  ngAfterViewInit(): void {
    this.selectCurrencyOnStart();
  }

  public valueFinding(): void {
    this.currencies=this.service.getCurrencies().filter(item =>
      item.name.toLowerCase().includes(this.findCurrency.toLowerCase())
      || item.full_name.toLowerCase().includes(this.findCurrency.toLowerCase())
    );

    this.noResultsFind = this.currencies.length == 0;
  }

  selectCurrency = (currency: Currency): void =>{
    this.selectedCurrency = currency;
    this.changeCurrency(currency);
    this.hideDropdown();

    localStorage.setItem(this.selectorId, currency.name);
  }

  showDropdown(): void {
    this.edited = false;
    this.currenciesList.nativeElement.className = "dropdown-menu scrollable-menu show";
    // this.currenciesList.className = "dropdown-menu scrollable-menu show";
  }

  hideDropdown(): void {
    this.edited = true;
    this.currenciesList.nativeElement.className = "dropdown-menu scrollable-menu";
  }


  dropClick(): void {
    this.findCurrency="";
    this.showDropdown();
    this.changeDetector.detectChanges();
    this.search_input.nativeElement.focus();
    this.valueFinding();
  }

  focusOutInput(): void {
    if(!this.ignoreFocusOut)
      this.hideDropdown();
  }

  private selectCurrencyOnStart(): void {
    let data: Currency | undefined;
    let localData: string | null = localStorage.getItem(this.selectorId);
    console.log(this.selectorId);
    if(localData)
    data = this.service.getCurrencies().find(element => element.name==localData);
    if(!data)
    data = this.service.getCurrencies().find(element => element.name==(this.selectorId == 'from' ? 'EUR' : 'USD'));
    if(data)
    this.selectCurrency(data);
  }

}
