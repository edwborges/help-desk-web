import { ChamadoService } from './../../../services/chamado.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { Cliente } from 'src/app/models/cliente';
import { Page } from 'src/app/models/page';
import { Tecnico } from 'src/app/models/tecnico';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-chamado-create',
  templateUrl: './chamado-create.component.html',
  styleUrls: ['./chamado-create.component.css']
})
export class ChamadoCreateComponent implements OnInit {

  chamado: Chamado = {
    prioridade: '',
    status: '',
    titulo: '',
    observacoes: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: ''
  }

  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];

  prioridade: FormControl = new FormControl(null, Validators.required);
  status: FormControl = new FormControl(null, Validators.required);
  titulo: FormControl = new FormControl(null, Validators.required);
  observacoes: FormControl = new FormControl(null, Validators.required);
  tecnico: FormControl = new FormControl(null, Validators.required);
  cliente: FormControl = new FormControl(null, Validators.required);

  ngOnInit(): void {
    this.findAllClientes();
    this.findAllTecnicos();
  }

  constructor(
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toast: ToastrService,
    private router: Router
  ){}

  create(): void {
    this.chamadoService.create(this.chamado).subscribe(resposta => {
      this.toast.success("Chamado criado com sucesso!", 'Novo Chamado');
      this.router.navigate(['chamados']);
    }, ex => {
      if(ex.error.errors) {
        ex.error.errors.forEach(element => {
          this.toast.error(element.message);
        });
      } else {
        this.toast.error(ex.error.message);
      }
    })
  }
 
  findAllClientes(page?: number, size?: number): void {
    this.clienteService.findAll(page, size).subscribe((resposta: Page<Cliente>) => {
      this.clientes = resposta.content;
    });
  }

  findAllTecnicos(page?: number, size?: number): void {
    this.tecnicoService.findAll(page, size).subscribe((resposta: Page<Tecnico>) => {
      this.tecnicos = resposta.content;
    });
  }

  validaCampos(): boolean {
    return this.prioridade.valid && this.status.valid &&
           this.titulo.valid && this.observacoes.valid &&
           this.tecnico.valid && this.cliente.valid
  }
}
