import { filter, withLatestFrom } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreFacade } from 'src/app/core/store/store.facade';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit, OnDestroy {
  @ViewChild('joinButton') joinButton;
  @ViewChild('nickInput') nickInput;
  private _subscription$: Subscription = new Subscription();

  private nickInputKeyUp$: Observable<KeyboardEvent>;
  private nickInputValue$: Observable<string>;
  private nickInputEnter$: Observable<KeyboardEvent>;
  private isJoinButtonDisabled$: Observable<boolean>;
  private joinButtonClicks$: Observable<MouseEvent>;
  private submitForm$: Observable<string>;

  public isJoinButtonDisabled: boolean = true;
  public nickInputValue: string = '';

  constructor(
    private storeFacade: StoreFacade,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.serve();
    this.subscribe();
    this.cd.detectChanges();
  }

  private serve(): void {
    const { nickInput, joinButton } = this;
    this.nickInputKeyUp$ = fromEvent(nickInput.nativeElement, 'keyup');
    this.nickInputValue$ = this.nickInputKeyUp$.pipe(
      map((event) => (event.target as HTMLInputElement).value)
    );
    this.nickInputEnter$ = this.nickInputKeyUp$.pipe(
      filter((event) => event.key === 'Enter')
    );
    this.isJoinButtonDisabled$ = this.nickInputValue$.pipe(
      map((nickInputValue) => nickInputValue.length < 3)
    );

    this.joinButtonClicks$ = fromEvent(joinButton.nativeElement, 'click');

    this.submitForm$ = merge(this.joinButtonClicks$, this.nickInputEnter$).pipe(
      withLatestFrom(this.nickInputValue$),
      map(([, nickInputValues]) => nickInputValues)
    );
  }

  private subscribe(): void {
    this._subscription$.add(
      this.isJoinButtonDisabled$.subscribe((data) => {
        this.isJoinButtonDisabled = data;
      })
    );

    this._subscription$.add(
      this.nickInputValue$.subscribe((data) => {
        this.nickInputValue = data;
      })
    );

    this._subscription$.add(
      this.submitForm$.subscribe((nickname: string) => {
        this.storeFacade.authClient(nickname);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}
