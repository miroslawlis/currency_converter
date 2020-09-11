import React from "react";

export default function ConversionHistory({
  listaArray,
  wyczyscHistorie,
  toggleHistory,
}) {
  return (
    <div id="history-container" className="hide">
      <div className="column">
        <table>
          <thead>
            <tr>
              <td>Data</td>
              <td>Przed konwersją</td>
              <td>Po konwersji</td>
            </tr>
          </thead>
          <tbody>
            {listaArray.map((row, index) => (
              <tr key={index}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div id="reset-history" onClick={wyczyscHistorie}>
          Wyczyść historię
        </div>
      </div>
      <div className="column">
        <div id="toggle-history" onClick={toggleHistory}>
          X Historia
        </div>
      </div>
    </div>
  );
}
