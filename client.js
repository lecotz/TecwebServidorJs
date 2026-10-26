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

async function main() {
  const token = await pegaToken();
  const exercicios = await listaExercicios(token);

  await enviaResposta(token, "soma", soma(exercicios["soma"].entrada));
  await enviaResposta(token, "tamanho-string", tamanhoString(exercicios["tamanho-string"].entrada));
  await enviaResposta(token, "nome-do-usuario", nomeDoUsuario(exercicios["nome-do-usuario"].entrada));
}

main();
