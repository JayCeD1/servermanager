import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ServerService} from "./service/server.service";
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {CustomResponse} from "./interface/custom-response";
import {AppState} from "./interface/app-state";
import {DataState} from "./enum/data-state.enum";
import {Status} from "./enum/status.enum";
import {NgForm} from "@angular/forms";
import {Server} from "./interface/server";
import {NotificationService} from "./service/notification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  title = 'Server App';

  appState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  filterStatus$ = this.filterSubject.asObservable();
  private dataSubject = new BehaviorSubject<CustomResponse>(null)
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private serverService: ServerService, private notifier: NotificationService) {}

  ngOnInit(): void{
    this.appState$ = this.serverService.servers$
        .pipe(
            map(response => {
              this.notifier.onDefault(response.message);
              this.dataSubject.next(response);
              return { dataState: DataState.LOADED_STATE, appData: {...response, data: { servers: response.data.servers.reverse() }} }
            }),
            startWith({ dataState: DataState.LOADING_STATE }),

            catchError((error: string) => {
              this.notifier.onError(error);
              return of({ dataState: DataState.ERROR_STATE, error })
            })
        )
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
      .pipe(
        map(response => {
          const index = this.dataSubject.value.data.servers.findIndex(server => server.id === response.data.server.id);
          this.dataSubject.value.data.servers[index] = response.data.server;
          this.filterSubject.next('');
          this.notifier.onDefault(response.message);

          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData:  this.dataSubject.value }),

        catchError((error: string) => {
          this.filterSubject.next('');
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      )
  }

  filterServers(status: Status): void {
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
      .pipe(
        map(response => {
          this.notifier.onDefault(response.message);
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData:  this.dataSubject.value }),

        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      )
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(<Server>serverForm.value as Server)//either one works
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { servers: [response.data.server, ...this.dataSubject.value.data.servers]}}
          );

          this.isLoading.next(false);

          serverForm.resetForm({ status: this.Status.SERVER_DOWN });
          this.notifier.onDefault(response.message);
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData:  this.dataSubject.value }),

        catchError((error: string) => {
          this.isLoading.next(false);
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      )
  }

  deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id)
      .pipe(
        map(response => {

          this.dataSubject.next(
            {...response, data: { servers: this.dataSubject.value.data.servers.filter(s => s.id !== server.id) }}
          );
          this.notifier.onDefault(response.message);
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData:  this.dataSubject.value }),

        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      )
  }

  printReport(): void {
    this.notifier.onDefault('Report downloaded');
    // window.print(); print pdf
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', '+ tableHtml;
    downloadLink.download = 'server-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  protected readonly status = status;
}
