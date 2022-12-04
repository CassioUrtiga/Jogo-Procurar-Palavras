const letras = [
    'A','B','C','D','E','F','G',
    'H','I','J','K','L','M','N',
    'O','P','Q','R','S','T','U',
    'V','W','X','Y','Z'
]

const palavras = ['BANANA','BELEZA','HINO','VELA','GATO','PEIXE','AMORA','VIVER','COMER','FACA','TIGRE','MESA','ROTINA','BEIJO','CAMA','DAMAS','PADARIA','CADEIRA','DOCUMENTO','LIMPEZA','TIJOLO','LITRO','GOIABA','LENTES','FAIXA','TECIDO','IMAGEM','PLANTA','CACHORRO','ANIMAL','MOCHILA','ANZOL','PISCINA','FORNO','PAINEL','FRIO','CALOR','GIRAFA','MOSCA','RATO','AGRADAR','AREIA','CHAVE','PERNA','DESTINO','CABELO','GAVETA','REGRA','TOMADA','QUEIJO','SENTIMENTO','BOLACHA','BISCOITO','ANDAR','PALAVRA','LUPA','CAMELO','AVESTRUZ','LARANJA','CENOURA','ALMOFADA','BRANCO','PRETO','CAMISA','VESTIDO','SAPATO','MAQUIAGEM','QUADRO','CANTAR','ABELHA','LUNETA','HUMANO','TRISTEZA','ALEGRIA','VOAR','TECLA','ALTURA','PISTA','VASILHA','VIDRO','ABACATE','ZEBRA','ESCOLA','LIVRO','MILHO','PERFUME','ENERGIA','MANTEIGA','PIADA','BLOCO','FLOR','OCEANO','CADERNO','PORTA','JANELA'];

const palavrasGeradas = []; //PALAVRAS QUE FORAM GERADAS
const matrizTeste = []; //MATRIZ FAKE COM AS PALAVRAS E #
const blocosPosicao = []; //MATRIZ POSIÇÃO DAS TD DA TELA
const clicksAtivos = []; //POSIÇÃO DOS CLICKS ATIVOS
const matrizPosPalavras = []; //POSIÇÕES DE CADA PALAVRA (NOME,LIN,COL)

var quantPalavras = 20; //QUANTIDADE MÁXIMA DE PALAVRAS GERADAS
var ordem = document.querySelectorAll('tr').length;
var blocos = document.querySelectorAll('td');

var corClick = 'darkslategrey';
var corConcluidoTable = 'forestgreen';
var corConcluidoOl = 'forestgreen';

var contador = 0;
var vencer = false;

// GERA AS MATRIZES
for (let i=0; i<ordem; i++){
    matrizTeste[i] = new Array(ordem);
    blocosPosicao[i] = new Array(ordem);
    for (let j=0; j<ordem; j++){
        matrizTeste[i][j] = '#';
        blocosPosicao[i][j] = contador;
        contador++;
    }
}

// GERA A QUANTIDADE DE PALAVRAS NA TELA (FORMATO ALEATÓRIO)
for (let i=0; i<quantPalavras; i++){
    var aleatoria;
    var inverte = false;
    
    do{
        aleatoria = palavras[random(palavras.length)];
    }while(palavrasGeradas.includes(aleatoria));

    if (random(2)){ 
        aleatoria = aleatoria.split('').reverse().join("");
        inverte = true;
    }

    switch (random(4)){
        case 0:
            formatoHorizontal();
            break;
        case 1:
            formatoVertical();
            break;
        case 2:
            formatoDiagonalPrincipal();
            break;
        case 3:
            formatoDiagonalSecundaria();
            break;
    }
}

// ADICIONA NA OL AS PALAVRAS GERADAS
let ol = document.getElementsByTagName('ol')[0], item;
for (let i of palavrasGeradas){
    item = document.createElement('li');
    item.textContent = i;
    ol.appendChild(item);
}

// GERA AS LETRAS NA TELA
contador = 0;
for (let i=0; i<ordem; i++){
    for (let j=0; j<ordem; j++){
        if (matrizTeste[i][j] == '#'){
            blocos[contador].innerText = letras[random(letras.length)]
        }else{
            blocos[contador].innerText = matrizTeste[i][j];
        }
        //blocos[contador].innerText = matrizTeste[i][j];
        contador++;
    }
}

// EVENTOS
for (let i=0; i<blocos.length; i++){
    blocos[i].onclick = () =>{
        let td = document.getElementsByTagName('td')[i];
        
        if (td.style.backgroundColor === '' && !vencer){
            td.style.backgroundColor = corClick;
            td.style.transition = '0.5s';
            td.style.transform = 'rotateY(360deg)';
            clicksAtivos.push(i);
        }else if (td.style.backgroundColor === corClick && !vencer){
            td.style.backgroundColor = '';
            td.style.transition = '0.5s';
            td.style.transform = 'rotateY(0deg)';
            clicksAtivos.splice(clicksAtivos.indexOf(i),1);
        }else if (td.style.backgroundColor === corConcluidoTable && !vencer){
            td.style.cursor = 'default';
        }
        
        if (!vencer){
            palavraCorreta();
            clicksMaximo();
            ganhar();
        }
    }
}

// FUNÇÕES
function clicksMaximo(){
    let maior = 0, p, palavraMax;
    let ol = document.getElementsByTagName('ol')[0];

    for (let palavra of palavrasGeradas){
        p = palavra.length
        if (p > maior){
            maior = p;
            palavraMax = palavra;
        }
    }

    for (let li of ol.querySelectorAll('li')){
        if(li.innerText === palavraMax && li.style.backgroundColor === corConcluidoOl){
            palavrasGeradas.splice(palavrasGeradas.indexOf(palavraMax),1);
        }
    }

    for (let i of clicksAtivos){
        let td = document.getElementsByTagName('td')[i];
        if (td.style.backgroundColor === corConcluidoTable){
            clicksAtivos.splice(clicksAtivos.indexOf(i), 1);
        }
    }

    while (clicksAtivos.length > maior-1){
        let td = document.getElementsByTagName('td')[clicksAtivos.shift()];
        td.style.backgroundColor = '';
        td.style.transition = '0.4s';
        td.style.transform = 'rotateY(0deg)';
    }
}

function palavraCorreta(){
    let td, verifica, nome;

    for (let i=0; i<matrizPosPalavras.length; i++){
        let array = Array.from(matrizPosPalavras[i]);
        nome = array.shift();
        verifica = true;
        for (let j=0,l=0,c=1; j<array.length/2; j++,l+=2,c+=2){
            td = document.getElementsByTagName('td')[blocosPosicao[array[l]][array[c]]];
            if (td.style.backgroundColor !== corClick && td.style.backgroundColor !== corConcluidoTable){
                verifica = false;
            }
        }

        if (verifica){
            marcarConcluidoOl(nome);
            
            for (let j=0,l=0,c=1; j<array.length/2; j++,l+=2,c+=2){
                td = document.getElementsByTagName('td')[blocosPosicao[array[l]][array[c]]];
                td.style.backgroundColor = corConcluidoTable;
                td.style.cursor = 'default';
                td.style.boxShadow = 'inset 0px 0px 10px 1px rgba(0, 0, 0, 0.200)';
            }
        }
    }
}

function marcarConcluidoOl(palavra){
    let ol = document.getElementsByTagName('ol')[0];

    for (let li of ol.querySelectorAll('li')){
        if(li.innerText == palavra){
            li.style.backgroundColor = corConcluidoOl;
            li.style.transition = '1s';
            li.style.textDecoration = 'line-through';
        }
    }
}

function ganhar(){
    let ol = document.getElementsByTagName('ol')[0], verifica = true;

    for (let li of ol.querySelectorAll('li')){
        if(li.style.backgroundColor !== corConcluidoOl){
            verifica = false;
        }
    }
    
    if(verifica){
        let table = document.getElementsByTagName('table')[0];
        let tela = document.getElementById('d1');

        table.style.transition = '0.4s';
        table.style.backgroundColor = 'rgba(0, 0, 0, 0.450)';
        table.style.cursor = 'default';

        tela.style.display = 'block';
        vencer = true;
    }
}

function formatoHorizontal(){
    let linha = random(ordem);
    let coluna = random(ordem);

    if(verificaHorizontalDir(linha, coluna, ordem, aleatoria)){
        matrizPosPalavras.unshift(new Array());
        matrizPosPalavras[0].push(addPalavraGerada(aleatoria,inverte));
        for (let i=coluna,j=0; i<ordem && j<aleatoria.length; i++,j++){
            matrizTeste[linha][i] = aleatoria[j];
            matrizPosPalavras[0].push(linha, i);
        }
        palavrasGeradas.push(addPalavraGerada(aleatoria,inverte));
    }else if(verificaHorizontalEsq(linha, coluna, aleatoria)){
        matrizPosPalavras.unshift(new Array());
        matrizPosPalavras[0].push(addPalavraGerada(aleatoria,inverte));
        for (let i=coluna,j=0; i>=0 && j<aleatoria.length; i--,j++){
            matrizTeste[linha][i] = aleatoria[j];
            matrizPosPalavras[0].push(linha, i);
        }
        palavrasGeradas.push(addPalavraGerada(aleatoria,inverte));
    }
}

function formatoVertical(){
    let linha = random(ordem);
    let coluna = random(ordem);
    
    if (verificaVerticalCima(linha, coluna, aleatoria)){
        matrizPosPalavras.unshift(new Array());
        matrizPosPalavras[0].push(addPalavraGerada(aleatoria,inverte));
        for (let i=linha,j=0; i>=0 && j<aleatoria.length; i--,j++){
            matrizTeste[i][coluna] = aleatoria[j];
            matrizPosPalavras[0].push(i, coluna);
        }
        palavrasGeradas.push(addPalavraGerada(aleatoria,inverte));
    }else if (verificaVerticalBaixo(linha, coluna, ordem, aleatoria)){
        matrizPosPalavras.unshift(new Array());
        matrizPosPalavras[0].push(addPalavraGerada(aleatoria,inverte));
        for (let i=linha,j=0; i<ordem && j<aleatoria.length; i++,j++){
            matrizTeste[i][coluna] = aleatoria[j];
            matrizPosPalavras[0].push(i, coluna);
        }
        palavrasGeradas.push(addPalavraGerada(aleatoria,inverte));
    }
}

function formatoDiagonalPrincipal(){
    let linha = random(ordem);
    let coluna = random(ordem);
    
    if (verificaDpCrescente(ordem, linha, coluna, aleatoria)){
        matrizPosPalavras.unshift(new Array());
        matrizPosPalavras[0].push(addPalavraGerada(aleatoria,inverte));
        for (let i=linha,j=coluna,k=0; i>=0 && j<ordem && k<aleatoria.length; i--,j++,k++){
            matrizTeste[i][j] = aleatoria[k];
            matrizPosPalavras[0].push(i, j);
        }
        palavrasGeradas.push(addPalavraGerada(aleatoria,inverte));
    }else if (verificaDpDecrescente(ordem, linha, coluna, aleatoria)){
        matrizPosPalavras.unshift(new Array());
        matrizPosPalavras[0].push(addPalavraGerada(aleatoria,inverte));
        for (let i=linha,j=coluna,k=0; i<ordem && j>=0 && k<aleatoria.length; i++,j--,k++){
            matrizTeste[i][j] = aleatoria[k];
            matrizPosPalavras[0].push(i, j);
        }
        palavrasGeradas.push(addPalavraGerada(aleatoria,inverte));
    }
}

function formatoDiagonalSecundaria(){
    let linha = random(ordem);
    let coluna = random(ordem);

    if (verificaDsCrescente(linha, coluna, aleatoria)){
        matrizPosPalavras.unshift(new Array());
        matrizPosPalavras[0].push(addPalavraGerada(aleatoria,inverte));
        for (let i=linha,j=coluna,k=0; i>=0 && j>=0 && k<aleatoria.length; i--,j--,k++){
            matrizTeste[i][j] = aleatoria[k];
            matrizPosPalavras[0].push(i, j);
        }
        palavrasGeradas.push(addPalavraGerada(aleatoria,inverte));
    }else if (verificaDsDecrescente(ordem,linha,coluna,aleatoria)){
        matrizPosPalavras.unshift(new Array());
        matrizPosPalavras[0].push(addPalavraGerada(aleatoria,inverte));
        for (let i=linha,j=coluna,k=0; i<ordem && j<ordem && k<aleatoria.length; i++,j++,k++){
            matrizTeste[i][j] = aleatoria[k];
            matrizPosPalavras[0].push(i, j);
        }
        palavrasGeradas.push(addPalavraGerada(aleatoria,inverte));
    }
}

function verificaHorizontalDir(linha, coluna, ordem, palavra){
    if (ordem-coluna >= palavra.length){
        for (let i=coluna,j=0; i < ordem && j < palavra.length; i++,j++){
            if(matrizTeste[linha][i] != '#' && matrizTeste[linha][i] != palavra[j]){
                return false;
            }
        }
        return true;
    }
    return false;
}

function verificaHorizontalEsq(linha,coluna,palavra){
    if (coluna+1 >= palavra.length){
        for (let i=coluna,j=0; i >= 0 && j < palavra.length; i--,j++){
            if(matrizTeste[linha][i] != '#' && matrizTeste[linha][i] != palavra[j]){
                return false;
            }
        }
        return true;
    }
    return false;
}

function verificaVerticalCima(linha, coluna, palavra){
    if (linha+1 >= palavra.length){
        for (let i=linha,j=0; i >= 0 && j < palavra.length; i--,j++){
            if(matrizTeste[i][coluna] != '#' && matrizTeste[i][coluna] != palavra[j]){
                return false;
            }
        }
        return true;
    }
    return false;
}

function verificaVerticalBaixo(linha, coluna, ordem, palavra){
    if (ordem-linha >= palavra.length){
        for (let i=linha,j=0; i<ordem && j < palavra.length; i++,j++){
            if(matrizTeste[i][coluna] != '#' && matrizTeste[i][coluna] != palavra[j]){
                return false;
            }
        }
        return true;
    }
    return false;
}

function verificaDpCrescente(ordem, linha, coluna, palavra){
    let contador = 0;

    for (let i=linha,j=coluna; i >= 0 && j < ordem; i--,j++){
        contador++;
    }
    
    if (contador >= palavra.length){
        for (let i=linha,j=coluna,k=0; i>=0 && j<ordem && k<palavra.length; i--,j++,k++){
            if(matrizTeste[i][j] != '#' && matrizTeste[i][j] != palavra[k]){
                return false;
            }
        }
        return true;
    }
    return false;
}

function verificaDpDecrescente(ordem, linha, coluna, palavra){
    let contador = 0;

    for (let i=linha,j=coluna; i < ordem && j >= 0; i++,j--){
        contador++;
    }

    if (contador >= palavra.length){
        for (let i=linha,j=coluna,k=0; i<ordem && j>=0 && k<palavra.length; i++,j--,k++){
            if(matrizTeste[i][j] != '#' && matrizTeste[i][j] != palavra[k]){
                return false;
            }
        }
        return true;
    }
    return false;
}

function verificaDsCrescente(linha, coluna, palavra){
    let contador = 0;

    for (let i=linha,j=coluna; i >= 0 && j >= 0; i--,j--){
        contador++;
    }

    if (contador >= palavra.length){
        for (let i=linha,j=coluna,k=0; i>=0 && j>=0 && k<palavra.length; i--,j--,k++){
            if(matrizTeste[i][j] != '#' && matrizTeste[i][j] != palavra[k]){
                return false;
            }
        }
        return true;
    }
    return false;
}

function verificaDsDecrescente(ordem, linha, coluna, palavra){
    let contador = 0;

    for (let i=linha,j=coluna; i<ordem && j<ordem; i++,j++){
        contador++;
    }
    
    if (contador >= palavra.length){
        for (let i=linha,j=coluna,k=0; i<ordem && j<ordem && k<palavra.length; i++,j++,k++){
            if(matrizTeste[i][j] != '#' && matrizTeste[i][j] != palavra[k]){
                return false;
            }
        }
        return true;
    }
    return false;
}

function random(num) {
    return Math.floor(Math.random() * num)
}

function addPalavraGerada(palavra, inverte){
    return inverte ? palavra.split('').reverse().join("") : palavra;
}