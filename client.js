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

async function main() {
  const token = await pegaToken();
  console.log("Token:", token);
}

main();
