import React, { useState } from "react";
import { ReactComponent as ExchangeArrows } from "./svg.svg";

export default function CurrencyInputs(props) {
  const {
    options,
    selectedCurrencyFrom,
    selectedCurrencyTo,
    onChangeCurrencyFrom,
    onChangeCurrencyTo,
    onChangeIloscFrom,
    onChangeIloscTo,
    toAmount,
    fromAmount,
  } = props;

  let errorInputMsg1, errorInputMsg2, errorInput1, errorInput2;

  if (isNaN(fromAmount)) {
    // newAmount = 0; // for input type="number" to disable error in console log
    errorInputMsg1 = "Niepoprawna wartość";
    errorInput1 = "error";
  } else if (
    (isNaN(fromAmount) &&
      typeof fromAmount !== "number" &&
      !/^[0-9]*$/.test(fromAmount)) ||
    fromAmount === ""
  ) {
    errorInputMsg1 = "Niepoprawna wartość";
    errorInput1 = "error";
  }

  return (
    <div className="container">
      <div className={"controls " + errorInput1}>
      <div className="input-currency">
        <input
          id="waluta1"
          type="text"
          value={fromAmount}
          onChange={onChangeIloscFrom}
        />
        <div className="currency">{selectedCurrencyFrom}</div>
      </div>
      <div className="validator">{errorInputMsg1}</div>
      </div>

      <div className={"input-currency " + errorInput2}>
        <input
          id="waluta2"
          type="text"
          className={errorInput2}
          value={toAmount}
          onChange={onChangeIloscTo}
        />
        <div className="currency">{selectedCurrencyTo}</div>
        <div className="validator">{errorInputMsg2}</div>
      </div>

      <div className="select-wrapper">
        <select
          id="waluta3"
          value={selectedCurrencyFrom}
          onChange={onChangeCurrencyFrom}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <div className="spacer">
          <ExchangeArrows />
        </div>

        <select
          id="waluta4"
          value={selectedCurrencyTo}
          onChange={onChangeCurrencyTo}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
