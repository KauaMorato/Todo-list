create database if not exists prova_todolist;

use prova_todolist;

create table if not exists usuarios (
    id int auto_increment primary key,
    nome varchar(100) not null,
    email varchar(100) not null unique,
    senha varchar(255) not null
);

create table if not exists tarefas (
    id int auto_increment primary key,
    titulo varchar(255) not null,
    concluida boolean default false,
    usuario_id int not null,
    foreign key (usuario_id) references usuarios(id) on delete cascade
);