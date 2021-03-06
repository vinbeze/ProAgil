import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';


defineLocale('pt-br', ptBrLocale)


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = "Eventos";

  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento!: Evento;
  imagemLargura: number = 50;
  imagemMargem: number = 2;
  mostrarImagem: boolean = false;
  registerForm!: FormGroup;
  modoSalvar= 'post';
  bodyDeletarEvento = '';

  dataAtual!: string;


  file!: FileList;
  fileNameToUpdate!: string;

  _filtroLista = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localService: BsLocaleService,
    private toastr: ToastrService
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
    this.evento = Object.assign({},evento) ;
    this.fileNameToUpdate = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);

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

  uploadImagem(){
    if(this.modoSalvar === 'post'){
      const nomeArquivo = this.evento.imagemURL.split('\\',3);
      this.evento.imagemURL = nomeArquivo[2];

      this.eventoService.postUpload(this.file,nomeArquivo[2])
      .subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();

          this.getEventos();
        }
      );
    } else {
      this.evento.imagemURL = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file,this.fileNameToUpdate)
      .subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();

          this.getEventos();
        }
      )
    }
    
  }

  salvarAlteracao(template: any) {
    
    if (this.registerForm.valid) {
      if(this.modoSalvar === 'post'){
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com Sucesso!');
          }, error => {
            this.toastr.error(`Erro ao Inserir: ${error}`)
            console.log(error);
          }
        );
      } else {
        this.evento = Object.assign({eventoId: this.evento.eventoId}, this.registerForm.value);
        
        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com Sucesso!');
          }, error => {
            this.toastr.error(`Erro ao Editar: ${error}` )
            console.log(error);
          }
        );
      }


    }
  }

  onFileChange(event : any){
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      this.file = event.target.files;
      console.log(this.file);
    }
  }

  excluirEvento(evento: Evento,confirm: any){
    this.openModal(confirm);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, C??digo: ${evento.eventoId}`;

  }

  confirmeDelete(template: any){
    this.eventoService.deleteEvento(this.evento).subscribe(
      () => {
        template.hide();
        this.getEventos();
        this.toastr.success('Deletado com Sucesso!');
      }, error => {
        this.toastr.error('Erro ao tentar Deletar')
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
        this.toastr.error(`Erro ao tentar Carregar eventos: ${error}` )
      }

    )

  }

}
