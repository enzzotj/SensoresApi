create table Empresa(
idEmpresa int primary key identity,
Nome varchar (45),
CNPJ char(14),
Telefone char(8),
Responsavel varchar(45)
);

create table Funcionario(
idFuncionario int primary key identity,
Login varchar(45),
Senha varchar(45),
Setor varchar(45),
Email varchar(45),
Status tinyint,
fkEmpresa int,
foreign key (fkEmpresa) references Empresa(idEmpresa),
fkSupervisor int,
foreign key (fkSupervisor) references Funcionario(idFuncionario)
);

create table CadastroCogumelos (
idCadastroCogumelos int primary key identity,
Especie varchar(45)
);

create table Estufa (
idEstufa int primary key identity,
Numero varchar(45),
fkCadastroCogumelos int,
foreign key (fkCadastroCogumelos) references CadastroCogumelos (idCadastroCogumelos),
fkEmpresa int,
foreign key (fkEmpresa) references Empresa (idEmpresa)
);

create table AcessoFuncionario(
idAcesso int primary key identity,
fkEstufa int,
fkFuncionario int,
fkEmpresa int,
dtAcesso datetime,
foreign key (fkEstufa) references Estufa (idEstufa),
foreign key (fkFuncionario) references Funcionario (idFuncionario),
foreign key (fkEmpresa) references Empresa (idEmpresa),
);

create table Sensor(
idSensor int primary key identity,
nomeSensor varchar(45),
fkEstufa int,
foreign key (fkEstufa) references Estufa (idEstufa),
fkEmpresa int,
foreign key (fkEmpresa) references Empresa (idEmpresa)
);

insert into Sensor(nomeSensor, fkEstufa, fkEmpresa) Values('1.NorteDados', 1, 1), ('1.SulDados', 1,1);

create table Dados_Sensor (
idDados_Sensor int primary key identity,
Umidade float,
Temperatura float,
DiaHora datetime,
alert tinyint,
fkSensor int,
foreign key (fkSensor) references Sensor(idSensor)
);


insert into Empresa(Nome, CNPJ, Telefone, Responsavel) values
('SPTECH', 12345678910121, 22045863, 'Alessandro'),
('Cogumelos da Mantiqueira', 98765432101235, 22105864, 'Renata'),
('CoguLTDA', 95175368425823, 24145869, 'Vivian');

insert into Funcionario values
('Paulo', 'Paulo_sptech56', 'Analise', 'paulo@sptech.school', 1, 1, null),
('Rogerio','rogerio_Mantiqueira89', 'Vendas', 'rogerio@cogumelos.mantiqueira.com.br', 1, 2, null),
('Romario', 'romario@cogumelo66', 'Marketing', 'romario@cogu.ltda.com', 1, 3, null),
('Rafael','rafael_Sptech88', 'Financeiro','rafael@sptech.school', 1, 1, 1),
('Gustavo','gustAvo_mantiqueira97', 'Auditoria', 'gustavo@cogumelos.mantiqueira.com.br', 1, 2, 2),
('Pelé', 'pele@cigumelo23', 'Dados', 'pele@cogu.ltda.com', 1, 3, 3);

insert into CadastroCogumelos values
('shitake'),
('Shimeji'),
('Champignon');

insert into Estufa values
('S1', 1, 1),
('M1', 2, 2),
('C1', 3, 3);

select * from [dbo].[Funcionario];