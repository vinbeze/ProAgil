import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, MinValidator, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';

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
  modalRef: BsModalRef  = new BsModalRef();
  registerForm!: FormGroup;

  _filtroLista = '';

  constructor(
    private eventoService: EventoService,
    private modalService:  BsModalService
  ) { }

  get filtroLista(){
    return this._filtroLista;
  }
  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }


  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
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
    this.registerForm = new FormGroup({
        tema: new FormControl('',
          [Validators.required,Validators.minLength(4),Validators.maxLength(50)]),
        local: new FormControl('',Validators.required),
        dataEvento: new FormControl('',Validators.required),
        qtdPessoas: new FormControl('',
          [Validators.required,Validators.max(120000)]),
        imagemURL: new FormControl('',Validators.required),
        telefone: new FormControl('',Validators.required),
        email: new FormControl('',
          [Validators.required,Validators.email]),
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
