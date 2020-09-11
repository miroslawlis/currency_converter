import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyInputs from "./CurrencyInputs";
import ConversionHistory from "./ConversionHistory";

const BASE_URL = "https://api.exchangeratesapi.io/latest";

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setKursWymiany] = useState();
  const [amount, setAmount] = useState(1);
  const [exchangeDirection, setExchangeDirection] = useState(true);
  const [historiaKonwersjiArray, setHistoriaKonwersjiArray] = useState([]);
  let toAmount, fromAmount;

  if (exchangeDirection) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(obslugaBledowFetch)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setKursWymiany(data.rates[firstCurrency]);
        zaladujZstorage();
      })
      .catch((error) => {
        console.log("error: " + error);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      // cuz api can throw error when there is no exchange rates for given day
      setKursWymiany(1);
      return;
    }
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => setKursWymiany(data.rates[toCurrency]));
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    zapiszHistorie();
  }, [historiaKonwersjiArray]);

  function obslugaBledowFetch(res) {
    if (!res.ok) {
      throw Error(res.statusText);
    }
    console.log("connection error?: " + res);
    return res;
  }

  function handlerChangeFromAmount(e) {
    setAmount(e.target.value);
    setExchangeDirection(true);
  }

  function handlerChangeToAmount(e) {
    setAmount(e.target.value);
    setExchangeDirection(false);
  }

  function konwersjaStringNaLiczbe(string, places) {
    if (places === false) {
      return parseInt(parseFloat(string).toFixed(2));
    } else {
      return parseFloat(string).toFixed(2);
    }
  }

  function handlerZaktualizujTabele() {
    if (validatorInput() === false) {
      return;
    }

    const dataKonwersji = new Date()
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join(".");
    const inputVal1 = konwersjaStringNaLiczbe(
      document.getElementById("waluta1").value
    );
    const inputVal2 = konwersjaStringNaLiczbe(
      document.getElementById("waluta2").value
    );
    const selectVal1 = document.getElementById("waluta3").value;
    const selectVal2 = document.getElementById("waluta4").value;

    const newValue = [
      dataKonwersji,
      inputVal1 + " " + selectVal1,
      inputVal2 + " " + selectVal2,
    ];

    const updatedState = [...historiaKonwersjiArray, newValue];

    setHistoriaKonwersjiArray(updatedState);
  }

  function zapiszHistorie() {
    if (historiaKonwersjiArray.length > 0) {
      sessionStorage.setItem(
        "historiaKonwersji",
        JSON.stringify(historiaKonwersjiArray)
      );
    }
  }

  function zaladujZstorage() {
    if (sessionStorage.getItem("historiaKonwersji") !== null) {
      setHistoriaKonwersjiArray(
        JSON.parse(sessionStorage.getItem("historiaKonwersji"))
      );
    }
  }

  function wyczyscHistorie() {
    setHistoriaKonwersjiArray([]);
    sessionStorage.removeItem("historiaKonwersji");
  }

  function historyToggle() {
    const el = document.getElementById("history-container");

    if (el.classList.contains("hide")) {
      el.classList.remove("hide");
      el.classList.add("show");
    } else {
      el.classList.remove("show");
      el.classList.add("hide");
    }
  }

  function validatorInput() {
    let value1 = toAmount;
    let value2 = fromAmount;

    console.log(value1);

    if (
      (isNaN(value1) &&
        typeof value1 !== "number" &&
        !/^[0-9]*$/.test(value1)) ||
      value1 === ""
    ) {
      return false;
    }

    if (
      (isNaN(value2) &&
        typeof value2 !== "number" &&
        !/^[0-9]*$/.test(value2)) ||
      value2 === ""
    ) {
      return false;
    }
  }

  return (
    <div id="app">
      <div id="outer-container">
        <div id="inner-container">
          <h1>Konwerter walut</h1>
          <CurrencyInputs
            options={currencyOptions}
            selectedCurrencyFrom={fromCurrency}
            selectedCurrencyTo={toCurrency}
            onChangeCurrencyFrom={(e) => setFromCurrency(e.target.value)}
            onChangeCurrencyTo={(e) => setToCurrency(e.target.value)}
            onChangeIloscFrom={handlerChangeFromAmount}
            onChangeIloscTo={handlerChangeToAmount}
            toAmount={toAmount}
            fromAmount={fromAmount}
          />
        </div>
        <div id="convert" onClick={handlerZaktualizujTabele}>
          Konwertuj
        </div>
      </div>
      <ConversionHistory
        listaArray={historiaKonwersjiArray}
        wyczyscHistorie={wyczyscHistorie}
        toggleHistory={historyToggle}
      />
    </div>
  );
}

export default App;
