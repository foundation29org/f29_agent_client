import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute, NavigationStart, NavigationCancel } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap'

import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from 'app/shared/services/lang.service';
import Swal from 'sweetalert2';
import { EventsService } from 'app/shared/services/events.service';
import { v4 as uuidv4 } from 'uuid';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [LangService]
})
export class AppComponent implements OnInit, OnDestroy {

    private subscription: Subscription = new Subscription();
    actualPage: string = '';
    hasLocalLang: boolean = false;
    tituloEvent: string = '';
    isMobile: boolean = false;
    myuuid: string = uuidv4();

    constructor(public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title, public translate: TranslateService, private langService: LangService, private eventsService: EventsService) {
      if(sessionStorage.getItem('uuid')==null){
        this.myuuid = uuidv4();
        sessionStorage.setItem('uuid', this.myuuid);
      }
      this.translate.use('es');
    }
    



    ngOnInit() {

        //evento que escucha si ha habido un error de conexión
    this.eventsService.on('http-error', function (error) {
        var msg1 = 'Connection lost';
        var msg2 = 'Trying to connect ...';
  
        if (sessionStorage.getItem('lang')) {
          var actuallang = sessionStorage.getItem('lang');
          if (actuallang == 'es') {
            msg1 = 'Se ha perdido la conexión';
            msg2 = 'Intentando conectar ...';
          } else if (actuallang == 'pt') {
            msg1 = 'Conexão perdida';
            msg2 = 'Tentando se conectar ...';
          } else if (actuallang == 'de') {
            msg1 = 'Verbindung unterbrochen';
            msg2 = 'Versucht zu verbinden ...';
          } else if (actuallang == 'fr') {
            msg1 = 'Connexion perdue';
            msg2 = 'Essayant de se connecter ...';
          }else if (actuallang == 'it') {
            msg1 = 'Collegamento perso';
            msg2 = 'Tentativo di connessione ...';
          }
        }
        if (error.message) {
          if (error == 'The user does not exist') {
            Swal.fire({
              icon: 'warning',
              title: this.translate.instant("errors.The user does not exist"),
              html: this.translate.instant("errors.The session has been closed")
            })
          }
        } else {
  
          Swal.fire({
            title: msg1,
            text: msg2,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#2F8BE6',
            confirmButtonText: 'OK',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
              location.reload();
            }
  
          });
        }
      }.bind(this));


      this.subscription = this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        (async () => {
          await this.delay(500);
          this.tituloEvent = event['title'];
          var titulo = this.translate.instant(this.tituloEvent);
          this.titleService.setTitle(titulo);
        })();

        //para los anchor de la misma páginano hacer scroll hasta arriba
        if (this.actualPage != event['title']) {
          window.scrollTo(0, 0)
        }
        this.actualPage = event['title'];
      });
  
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}