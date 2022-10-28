// não altere!
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');
const sql = require('mssql');

// não altere!
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// configure a linha abaixo caso queira que os dados capturados sejam inseridos no banco de dados.
// false -> nao insere
// true -> insere
const HABILITAR_OPERACAO_INSERIR = false;

// altere o valor da variável AMBIENTE para o valor desejado:
// API conectada ao banco de dados remoto, SQL Server -> 'producao'
// API conectada ao banco de dados local, MySQL Workbench - 'desenvolvimento'
const AMBIENTE = 'desenvolvimento';
const serial = async (
    valoresDht11Umidade1,
    valoresDht11Temperatura1,
    valoresDht11Umidade2,
    valoresDht11Temperatura2,
    valoresDht11Umidade3,
    valoresDht11Temperatura3,
    valoresDht11Umidade4,
    valoresDht11Temperatura4,
    valoresDht11Umidade5,
    valoresDht11Temperatura5
) => {
    let poolBancoDados = ''

    if (AMBIENTE == 'desenvolvimento') {
        poolBancoDados = mysql.createPool(
            {
                // altere!
                // CREDENCIAIS DO BANCO LOCAL - MYSQL WORKBENCH
                host: 'localhost',
                user: 'aluno',
                password: 'sptech',
                database: 'FungiTec'
            }
        ).promise();
    } else if (AMBIENTE == 'producao') {
        console.log('Projeto rodando inserindo dados em nuvem. Configure as credenciais abaixo.');
    } else {
        throw new Error('Ambiente não configurado. Verifique o arquivo "main.js" e tente novamente.');
    }


    const portas = await serialport.SerialPort.list();
    const portaArduino = portas.find((porta) => porta.vendorId == 2341 && porta.productId == 43);
    if (!portaArduino) {
        throw new Error('O arduino não foi encontrado em nenhuma porta serial');
    }
    const arduino = new serialport.SerialPort(
        {
            path: portaArduino.path,
            baudRate: SERIAL_BAUD_RATE
        }
    );
    arduino.on('open', () => {
        console.log(`A leitura do arduino foi iniciada na porta ${portaArduino.path} utilizando Baud Rate de ${SERIAL_BAUD_RATE}`);
    });
    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => {
        console.log(data);
        const valores = data.split(';');
        const dht11Umidade1 = parseFloat(valores[0]);
        const dht11Temperatura1 = parseFloat(valores[1]);
        const dht11Umidade2 = parseFloat(valores[2]);
        const dht11Temperatura2 = parseFloat(valores[3]);
        const dht11Umidade3 = parseFloat(valores[4]);
        const dht11Temperatura3 = parseFloat(valores[5]);
        const dht11Umidade4 = parseFloat(valores[6]);
        const dht11Temperatura4 = parseFloat(valores[7]);
        const dht11Umidade5 = parseFloat(valores[8]);
        const dht11Temperatura5 = parseFloat(valores[9]);
        

        valoresDht11Umidade1.push(dht11Umidade1);
        valoresDht11Temperatura1.push(dht11Temperatura1);
        valoresDht11Umidade2.push(dht11Umidade2);
        valoresDht11Temperatura2.push(dht11Temperatura2);
        valoresDht11Umidade3.push(dht11Umidade3);
        valoresDht11Temperatura3.push(dht11Temperatura3);
        valoresDht11Umidade4.push(dht11Umidade4);
        valoresDht11Temperatura4.push(dht11Temperatura4);
        valoresDht11Umidade5.push(dht11Umidade5);
        valoresDht11Temperatura5.push(dht11Temperatura5);


        if (HABILITAR_OPERACAO_INSERIR) {
            if (AMBIENTE == 'producao') {
                // altere!
                // Este insert irá inserir os dados na tabela "medida"
                // -> altere nome da tabela e colunas se necessário
                // Este insert irá inserir dados de fk_aquario id=1 (fixo no comando do insert abaixo)
                // >> Importante! você deve ter o aquario de id 1 cadastrado.
                sqlquery = `INSERT INTO sensor (umidade1, temperatura1, umidade2, temperatura2, umidade3, temperatura3, umidade4, temperatura4, umidade5, temperatura5) VALUES (${dht11Umidade1}, ${dht11Temperatura1},${dht11Umidade2}, ${dht11Temperatura2}, ${dht11Umidade3}, ${dht11Temperatura3}, ${dht11Umidade4}, ${dht11Temperatura4}, ${dht11Umidade5}, ${dht11Temperatura5})`;

                // CREDENCIAIS DO BANCO REMOTO - SQL SERVER
                // Importante! você deve ter criado o usuário abaixo com os comandos presentes no arquivo
                // "script-criacao-usuario-sqlserver.sql", presente neste diretório.
                const connStr = "Server=servidor-acquatec.database.windows.net;Database=FungiTec;User Id=aluno;Password=sptech;";

                function inserirComando(conn, sqlquery) {
                    conn.query(sqlquery);
                    console.log("valores inseridos no banco: ", dht11Umidade1 + ", " + dht11Temperatura1 + ", " + dht11Umidade2 + ", " + dht11Temperatura2 + ", " + dht11Umidade3 + ", " + dht11Temperatura3 + ", " + dht11Umidade4 + ", " + dht11Temperatura4 + ", " + dht11Umidade5 + ", " + dht11Temperatura5)
                }

                sql.connect(connStr)
                    .then(conn => inserirComando(conn, sqlquery))
                    .catch(err => console.log("erro! " + err));

            } else if (AMBIENTE == 'desenvolvimento') {

                // altere!
                // Este insert irá inserir os dados na tabela "medida"
                // -> altere nome da tabela e colunas se necessário
                // Este insert irá inserir dados de fk_aquario id=1 (fixo no comando do insert abaixo)
                // >> você deve ter o aquario de id 1 cadastrado.
                await poolBancoDados.execute(
                    'INSERT INTO sensor (umidade1, temperatura1, umidade2, temperatura2, umidade3, temperatura3, umidade4, temperatura4, umidade5, temperatura5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [dht11Umidade1, dht11Temperatura1, dht11Umidade2, dht11Temperatura2, dht11Umidade3, dht11Temperatura3, dht11Umidade4, dht11Temperatura4, dht11Umidade5, dht11Temperatura5]
                );
                console.log("valores inseridos no banco: ", dht11Umidade1 + ", " + dht11Temperatura1 + ", " + dht11Umidade2 + ", " + dht11Temperatura2 + ", " + dht11Umidade3 + ", " + dht11Temperatura3 + ", " + dht11Umidade4 + ", " + dht11Temperatura4 + ", " + dht11Umidade5 + ", " + dht11Temperatura5)

            } else {
                throw new Error('Ambiente não configurado. Verifique o arquivo "main.js" e tente novamente.');
            }
        }
    });
    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem}`)
    });
}


// não altere!
const servidor = (
    valoresDht11Umidade1,
    valoresDht11Temperatura1,
    valoresDht11Umidade2,
    valoresDht11Temperatura2,
    valoresDht11Umidade3,
    valoresDht11Temperatura3,
    valoresDht11Umidade4,
    valoresDht11Temperatura4,
    valoresDht11Umidade5,
    valoresDht11Temperatura5
) => {
    const app = express();
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });
    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta ${SERVIDOR_PORTA}`);
    });
    app.get('/sensores/dht11/umidade1', (_, response) => {
        return response.json(valoresDht11Umidade1);
    });
    app.get('/sensores/dht11/temperatura1', (_, response) => {
        return response.json(valoresDht11Temperatura1);
    });
    app.get('/sensores/dht11/umidade2', (_, response) => {
        return response.json(valoresDht11Umidade2);
    });
    app.get('/sensores/dht11/temperatura2', (_, response) => {
        return response.json(valoresDht11Temperatura2);
    });
    app.get('/sensores/dht11/umidade3', (_, response) => {
        return response.json(valoresDht11Umidade3);
    });
    app.get('/sensores/dht11/temperatura3', (_, response) => {
        return response.json(valoresDht11Temperatura3);
    });
    app.get('/sensores/dht11/umidade4', (_, response) => {
        return response.json(valoresDht11Umidade4);
    });
    app.get('/sensores/dht11/temperatura4', (_, response) => {
        return response.json(valoresDht11Temperatura4);
    });
    app.get('/sensores/dht11/umidade5', (_, response) => {
        return response.json(valoresDht11Umidade5);
    });
    app.get('/sensores/dht11/temperatura5', (_, response) => {
        return response.json(valoresDht11Temperatura5);
    });
}

(async () => {
    const valoresDht11Umidade1 = [];
    const valoresDht11Temperatura1 = [];
    const valoresDht11Umidade2 = [];
    const valoresDht11Temperatura2 = [];
    const valoresDht11Umidade3 = [];
    const valoresDht11Temperatura3 = [];
    const valoresDht11Umidade4 = [];
    const valoresDht11Temperatura4 = [];
    const valoresDht11Umidade5 = [];
    const valoresDht11Temperatura5 = [];
    await serial(
        valoresDht11Umidade1,
        valoresDht11Temperatura1,
        valoresDht11Umidade2,
        valoresDht11Temperatura2,
        valoresDht11Umidade3,
        valoresDht11Temperatura3,
        valoresDht11Umidade4,
        valoresDht11Temperatura4,
        valoresDht11Umidade5,
        valoresDht11Temperatura5

    );
    servidor(
        valoresDht11Umidade1,
        valoresDht11Temperatura1,
        valoresDht11Umidade2,
        valoresDht11Temperatura2,
        valoresDht11Umidade3,
        valoresDht11Temperatura3,
        valoresDht11Umidade4,
        valoresDht11Temperatura4,
        valoresDht11Umidade5,
        valoresDht11Temperatura5
    );
})();