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

async function main() {
  const token = await pegaToken();
  const exercicios = await listaExercicios(token);
  console.log(exercicios);
}

main();
