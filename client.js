const axios = require("axios");

const URL_BASE = "https://servidor-exercicios-js.vercel.app";
const USUARIO = "leonardoels";

async function pegaToken() {
  const resposta = await axios.post(
    URL_BASE + "/token",
    { username: USUARIO },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return resposta.data.accessToken;
}

function montaHeaders(token) {
  return {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  };
}

async function listaExercicios(token) {
  const resposta = await axios.get(URL_BASE + "/exercicio", montaHeaders(token));
  return resposta.data;
}

async function enviaResposta(token, slug, resposta) {
  const r = await axios.post(
    URL_BASE + "/exercicio/" + slug,
    { resposta: resposta },
    montaHeaders(token)
  );
  console.log(slug + ":", r.data.sucesso ? "acertou" : "errou");
}

function soma(entrada) {
  return entrada.a + entrada.b;
}

function tamanhoString(entrada) {
  return entrada.string.length;
}

function nomeDoUsuario(entrada) {
  return entrada.email.split("@")[0];
}

function jacaWars(entrada) {
  const g = 9.8;
  const theta = (entrada.theta * Math.PI) / 180; // seno usa radianos
  const distancia = (entrada.v ** 2 * Math.sin(2 * theta)) / g;

  if (Math.abs(distancia - 100) < 2) {
    return 0;
  }
  if (distancia < 100) {
    return -1;
  }
  return 1;
}

function anoBissexto(entrada) {
  const ano = entrada.ano;
  return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
}

function volumeDaPizza(entrada) {
  // pizza = cilindro -> pi * r^2 * h
  return Math.round(Math.PI * entrada.z ** 2 * entrada.a);
}

function mru(entrada) {
  return entrada.s0 + entrada.v * entrada.t;
}

function inverteString(entrada) {
  return entrada.string.split("").reverse().join("");
}

function somaValores(entrada) {
  let total = 0;
  for (const valor of Object.values(entrada.objeto)) {
    total += valor;
  }
  return total;
}

function ehPrimo(x) {
  if (x < 2) return false;
  for (let i = 2; i * i <= x; i++) {
    if (x % i === 0) return false;
  }
  return true;
}

function nEsimoPrimo(entrada) {
  let contador = 0;
  let numero = 1;
  while (contador < entrada.n) {
    numero++;
    if (ehPrimo(numero)) {
      contador++;
    }
  }
  return numero;
}

function prefixoComum(s1, s2) {
  let i = 0;
  while (i < s1.length && i < s2.length && s1[i] === s2[i]) {
    i++;
  }
  return s1.slice(0, i);
}

function maiorPrefixoComum(entrada) {
  const strings = entrada.strings;
  let maior = "";
  // compara todos os pares de strings
  for (let i = 0; i < strings.length; i++) {
    for (let j = i + 1; j < strings.length; j++) {
      const prefixo = prefixoComum(strings[i], strings[j]);
      if (prefixo.length > maior.length) {
        maior = prefixo;
      }
    }
  }
  return maior;
}

function somaSegundoMaiorEMenor(entrada) {
  // copia antes de ordenar pra nao mexer no array original
  const ordenados = [...entrada.numeros].sort((a, b) => a - b);
  const segundoMenor = ordenados[1];
  const segundoMaior = ordenados[ordenados.length - 2];
  return segundoMaior + segundoMenor;
}

function ehPalindromo(palavra) {
  return palavra === palavra.split("").reverse().join("");
}

function contaPalindromos(entrada) {
  return entrada.palavras.filter(ehPalindromo).length;
}

function somaDeStringsDeInts(entrada) {
  return entrada.strings
    .map((s) => parseInt(s))
    .reduce((acc, n) => acc + n, 0);
}

// slug do exercicio -> funcao que resolve
const solucoes = {
  "soma": soma,
  "tamanho-string": tamanhoString,
  "nome-do-usuario": nomeDoUsuario,
  "jaca-wars": jacaWars,
  "ano-bissexto": anoBissexto,
  "volume-da-pizza": volumeDaPizza,
  "mru": mru,
  "inverte-string": inverteString,
  "soma-valores": somaValores,
  "n-esimo-primo": nEsimoPrimo,
  "maior-prefixo-comum": maiorPrefixoComum,
  "soma-segundo-maior-e-menor-numeros": somaSegundoMaiorEMenor,
  "conta-palindromos": contaPalindromos,
  "soma-de-strings-de-ints": somaDeStringsDeInts,
};

async function main() {
  const token = await pegaToken();
  const exercicios = await listaExercicios(token);

  for (const slug in exercicios) {
    if (!solucoes[slug]) {
      console.log(slug + ": ainda nao fiz");
      continue;
    }
    const resposta = solucoes[slug](exercicios[slug].entrada);
    await enviaResposta(token, slug, resposta);
  }
}

main();
