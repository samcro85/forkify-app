import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Facciamo il re-factor delle funzioni 'getJSON' e 'postJSON' in una sola funzione
/* export const AJAX = async function (url, uploadData = undefined) {
  try {
    fetchPromise = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    console.log(fetchPromise);
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    // Se non viene trovata la risorsa (respone.ok= false) nel 'data' si avrà una proprietà col messaggio di errore(data.message)
    if (!response.ok === true)
      throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (error) {
    // Rilanciando l'errore la Promise restituita dalla funzione verrà respinta.
    throw error;
  }
}; */
export const getJSON = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    // Se non viene trovata la risorsa (respone.ok= false) nel 'data' si avrà una proprietà col messaggio di errore(data.message)
    if (!response.ok === true)
      throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (error) {
    // Rilanciando l'errore la Promise restituita dalla funzione verrà respinta.
    throw error;
  }
};

export const postJSON = async function (url, uploadData) {
  try {
    const response = await Promise.race([
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);

    // La API in risposta rimanda i dati che abbiamo inviato
    const data = await response.json();
    console.log(data);
    // Se non viene trovata la risorsa (respone.ok= false) nel 'data' si avrà una proprietà col messaggio di errore(data.message)
    if (!response.ok === true)
      throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (error) {
    // Rilanciando l'errore la Promise restituita dalla funzione verrà respinta.
    throw error;
  }
};
