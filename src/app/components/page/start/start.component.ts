import { withLatestFrom } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { ClientsFacade } from './../../../store/clients/clients.facade';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { combineLatest, fromEvent, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit, OnDestroy {
  @ViewChild('joinButton') joinButton;
  @ViewChild('nickInput') nickInput;
  private _subscription$: Subscription = new Subscription();

  private nickInputValue$: Observable<string>;
  private isJoinButtonDisabled$: Observable<boolean>;
  private joinButtonClicks$: Observable<MouseEvent>;
  private submitForm$: Observable<string>;

  public isJoinButtonDisabled: boolean = true;
  public nickInputValue: string = '';

  constructor(
    private clientsFacade: ClientsFacade,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.serve();
    this.subscribe();
    this.cd.detectChanges();
  }

  private serve(): void {
    this.nickInputValue$ = fromEvent(
      this.nickInput.nativeElement,
      'keyup'
    ).pipe(map((event: KeyboardEvent) => (event.target as any).value));
    this.isJoinButtonDisabled$ = this.nickInputValue$.pipe(
      map((nickInputValue) => nickInputValue.length < 3)
    );

    this.joinButtonClicks$ = fromEvent(this.joinButton.nativeElement, 'click');
    this.submitForm$ = this.joinButtonClicks$.pipe(
      withLatestFrom(this.nickInputValue$),
      map(([joinButtonClicks, nickInputValues]) => nickInputValues)
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
        this.clientsFacade.authClient(nickname);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
  }
}