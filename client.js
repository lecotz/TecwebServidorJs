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

async function main() {
  const token = await pegaToken();
  const exercicios = await listaExercicios(token);

  await enviaResposta(token, "soma", soma(exercicios["soma"].entrada));
  await enviaResposta(token, "tamanho-string", tamanhoString(exercicios["tamanho-string"].entrada));
  await enviaResposta(token, "nome-do-usuario", nomeDoUsuario(exercicios["nome-do-usuario"].entrada));
  await enviaResposta(token, "jaca-wars", jacaWars(exercicios["jaca-wars"].entrada));
  await enviaResposta(token, "ano-bissexto", anoBissexto(exercicios["ano-bissexto"].entrada));
  await enviaResposta(token, "volume-da-pizza", volumeDaPizza(exercicios["volume-da-pizza"].entrada));
  await enviaResposta(token, "mru", mru(exercicios["mru"].entrada));
}

main();
