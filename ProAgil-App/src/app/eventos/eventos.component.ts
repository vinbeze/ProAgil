import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ThrowStmt } from '@angular/compiler';

defineLocale('pt-br', ptBrLocale)


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento!: Evento;
  imagemLargura: number = 50;
  imagemMargem: number = 2;
  mostrarImagem: boolean = false;
  registerForm!: FormGroup;
  modoSalvar= 'post';
  bodyDeletarEvento = '';

  _filtroLista = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localService: BsLocaleService
  ) {
    this.localService.use('pt-br')
  }

  get filtroLista() {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }


  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  novoEvento(template: any){
    this.modoSalvar = 'post'
    this.openModal(template);
  }

  editarEvento(evento:Evento,template:any){
    this.modoSalvar = 'put'
    this.openModal(template);
    this.evento = evento;
    this.registerForm.patchValue(evento);

    if(evento){
      this.registerForm.setValue({tema : evento.tema,
          local: evento.local,
          dataEvento: evento.dataEvento,
          qtdPessoas: evento.qtdPessoas,
          imagemURL: evento.imagemURL,
          telefone: evento.telefone,
          email: evento.email
      })
    }

  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; }) => evento.tema.toLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation() {
    this.registerForm = this.fb.group({
      tema: ['',
        [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['',
        [Validators.required, Validators.max(120000)]],
      imagemURL: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['',
        [Validators.required, Validators.email]],
    })
  }

  salvarAlteracao(template: any) {
    
    if (this.registerForm.valid) {
      if(this.modoSalvar === 'post'){
        this.evento = Object.assign({}, this.registerForm.value);
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
          }, error => {
            console.log(error);
          }
        );
      } else {
        this.evento = Object.assign({eventoId: this.evento.eventoId}, this.registerForm.value);
        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
          }, error => {
            console.log(error);
          }
        );
      }


    }
  }

  excluirEvento(evento: Evento,confirm: any){
    this.openModal(confirm);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.eventoId}`;

  }

  confirmeDelete(template: any){
    this.eventoService.deleteEvento(this.evento).subscribe(
      () => {
        template.hide();
        this.getEventos();
      }, error => {
        console.log(error)
      }
    );
  }

  getEventos() {
    this.eventoService.getEvento().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      }, error => {
        console.log(error);
      }

    )

  }

}
