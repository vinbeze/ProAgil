import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

defineLocale('pt-br',ptBrLocale)


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  imagemLargura: number = 50;
  imagemMargem: number = 2;
  mostrarImagem: boolean = false;
  registerForm!: FormGroup;

  _filtroLista = '';

  constructor(
    private eventoService: EventoService,
    private modalService:  BsModalService,
    private fb: FormBuilder,
    private localService:  BsLocaleService
  ) {
    this.localService.use('pt-br')
  }

  get filtroLista(){
    return this._filtroLista;
  }
  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }


  openModal(template: any){
    template.show();
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLowerCase();
    return this.eventos.filter(
      (      evento: { tema: string; }) => evento.tema.toLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation(){
    this.registerForm = this.fb.group({
        tema: ['',
          [Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
        local: ['',Validators.required],
        dataEvento: ['',Validators.required],
        qtdPessoas: ['',
          [Validators.required,Validators.max(120000)]],
        imagemURL: ['',Validators.required],
        telefone: ['',Validators.required],
        email: ['',
          [Validators.required,Validators.email]],
    })
  }

  salvarAlteracao(){

  }

  getEventos(){
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
