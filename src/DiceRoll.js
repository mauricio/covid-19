import React, {useEffect, useMemo, useState} from "react";
import {FormattedMessage} from "react-intl";

// https://www.worldometers.info/coronavirus/coronavirus-age-sex-demographics/
let rates = [
  [9, 0],
  [19, 0.002],
  [29, 0.002],
  [39, 0.002],
  [49, 0.004],
  [59, 0.013],
  [69, 0.036],
  [79, 0.08],
  [79, 0.148]
]

export function DiceRoll({age}) {
  let [state, setState] = useState("alive") // alive, dead, rolling
  let [rolls, setRolls] = useState(0)

  let rate = useMemo(() => {
    let rate
    for (let [maxAge, ageRate] of rates) {
      rate = ageRate
      if (age < maxAge) break
    }
    return rate
  }, [age])

  function rollDice() {
    setRolls(rolls + 1)
    setState("rolling")
  }

  useEffect(() => {
    if (state === "rolling") {
      let timer = setTimeout(() => {
        let rando = Math.random()
        if (rando <= rate) {
          setState("dead")
        } else {
          setState("alive")
        }
      }, 200)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [state, rate])

  return (
    <div className="DiceRoll" data-state={state}>
      <div>
        <span aria-label={state} role="img">
          {state === "dead"
            ? "💀"
            : state === "alive"
              ? "😅"
              : state === "rolling"
                ? "🤮"
                : null}
        </span>{" "}
        <span>
          <b>
            <FormattedMessage id="dice_roll.age_year_old" values={{age: age}}/>
          </b>
          <br/>
          <FormattedMessage id="dice_roll.fatality_rate" values={{rate: (rate * 100).toFixed(1)}}/>
        </span>
      </div>
      <div>
        <button disabled={state === "dead"} onClick={rollDice}>
          <FormattedMessage id="dice_roll.roll"/>
        </button>
        {" "}
        <span>
          <FormattedMessage id="dice_roll.rolls" values={{rolls: rolls}}/>
        </span>
      </div>
    </div>
  )
}