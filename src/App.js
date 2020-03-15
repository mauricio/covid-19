import React, {useEffect, useMemo, useRef, useState} from "react"
import serializeForm from "form-serialize"
import {BrowserRouter, Link, Route, Routes, useLocation, useNavigate} from "react-router-dom"
import {FormattedMessage, useIntl} from "react-intl";

function App() {
  let [persons, setPersons] = useState(4)
  let doFocusRef = useRef(false)
  let focusRef = useRef()
  let formRef = useRef()
  let navigate = useNavigate()

  useEffect(() => {
    if (doFocusRef.current === false) {
      doFocusRef.current = true
    } else {
      focusRef.current.focus()
    }
  }, [persons])

  function handleSubmit(event) {
    event.preventDefault()
    let values = serializeForm(event.target, {hash: true}).ages.filter(
      v => v !== "UNSET"
    )
    navigate(`infected/?ages=${values.map(v => v)}`)
  }

  return (
    <div id="App">
      <div className="prelude">
        <h1><FormattedMessage id="app.title"/></h1>
        <p>
          <FormattedMessage id="app.first_paragraph"/>
        </p>
      </div>
      <hr/>
      <form id="HouseHoldForm" ref={formRef} onSubmit={handleSubmit}>
        {Array.from({length: persons}).map((_, index, arr) => (
          <label
            key={index}
            ref={arr.length - 1 === index ? focusRef : undefined}
          >
            <span>
              {index === 0 ? <FormattedMessage id="app.your_age"/> :
                <FormattedMessage id="app.household_member" values={{index: index}}/>}:
            </span>{" "}
            <AgeSelect defaultValue={index < 2 ? 40 : undefined}/>
          </label>
        ))}
        <button type="button" onClick={() => setPersons(persons + 1)}>
          <FormattedMessage id="app.add_another"/>
        </button>
        <button type="submit">
          <FormattedMessage id="app.next"/>
        </button>
      </form>
    </div>
  )
}

function AgeSelect(props) {
  return (
    <select name="ages" {...props}>
      <option value="UNSET">
        {useIntl().messages["age_select.set_an_age"]}
      </option>
      {Array.from({length: 100}).map((_, index) => (
        <option key={index}>{index}</option>
      ))}
    </select>
  )
}

////////////////////////////////////////////////////////////////////////////////
function Infection() {
  let location = useLocation()
  let navigate = useNavigate()
  let ages = parseAges(location.search)
  if (ages === null) {
    setTimeout(() => navigate("/"), [])
    return null
  }

  return (
    <div id="App">
      <div className="prelude">
        <h1>
          <FormattedMessage id="app.youre_infected"/>
        </h1>
        <p>
          <FormattedMessage id="app.lets_roll"/>
        </p>
      </div>
      <div id="DiceRolls" className="center">
        {ages.map((age, index) => (
          <DiceRoll key={index} age={age}/>
        ))}
      </div>
      <p>
        <FormattedMessage id="app.did_not_die"/>
      </p>
      <Link className="big-link" to={`/killers${location.search}`}>
        <FormattedMessage id="app.your_kill_count"/>
      </Link>

      <hr/>
      <h2>
        <FormattedMessage id="app.more_information"/>
      </h2>
      <p>
        <FormattedMessage
          id="app.more_information_content"
          values={{
            i: (...chunks) => <i>{chunks}</i>,
          }}
        />
      </p>
      <p>
        <FormattedMessage id="app.just_like_flu"/>
      </p>
      <p>
        <FormattedMessage
          id="app.just_like_flu_content"
          values={{
            cdcburden: (...chunks) => <a class="external_link" target="_blank"
                                         href="https://www.cdc.gov/flu/about/burden/index.html#:~:text=">{chunks}</a>,
            cnnmaps: (...chunks) => <a class="external_link" target="_blank"
                                       href="https://www.cnn.com/interactive/2020/health/coronavirus-maps-and-cases/">{chunks}</a>,
          }}
        />
      </p>
      <p>
        <FormattedMessage id="app.full_story"/>
      </p>
      <ul>
        <li>
          <FormattedMessage id="app.fatality_rate"/>
        </li>
        <li>
          <FormattedMessage id="app.infection_growth_rate"/>
        </li>
      </ul>
      <p>
        <FormattedMessage
          id="app.fatality_rate_detail"
        />
      </p>
      <p>
        <FormattedMessage
          id="app.fatality_rate_numbers"
          values={{
            b: (...chunks) => <b>{chunks}</b>,
            p: (...chunks) => <p>{chunks}</p>,
            deathrate: (...chunks) => <a class="external_link" target="_blank"
                                         href="https://www.sciencealert.com/covid-19-s-death-rate-is-higher-than-thought-but-it-should-drop">{chunks}</a>,
          }}
        />
      </p>

      <div className="bars">
        <div className="bar covid">
          <span className="padding-adjust">COVID-19</span>
        </div>
        <div className="bar flu">
          <span className="padding-adjust">Influenza</span>
        </div>
      </div>
      <FormattedMessage
        id="app.fatality_rate_growth"
        values={{
          b: (...chunks) => <b>{chunks}</b>,
          p: (...chunks) => <p>{chunks}</p>,
          overwhelm: (...chunks) => <a class="external_link" target="_blank"
                                       href="https://www.theatlantic.com/ideas/archive/2020/03/who-gets-hospital-bed/607807/">{chunks}</a>,
        }}
      />
    </div>
  )
}

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

function DiceRoll({age}) {
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

////////////////////////////////////////////////////////////////////////////////
function KillCount({ages}) {
  let [infected, setInfected] = useState(1)
  let [weeks, setWeeks] = useState(1)
  let rate = 0.034
  let Ro = 2

  let killed = Math.round(infected * rate)

  function nextWeek() {
    setInfected(infected * Ro)
    setWeeks(weeks + 1)
  }

  return (
    <div id="KillCount">
      <div aria-hidden="true">
        {Array.from({length: killed}).map((_, index) => (
          // eslint-disable-next-line
          <span key={index}>💀</span>
        ))}
      </div>
      <p>
        <FormattedMessage id="kill_count.week" values={{weeks: weeks}}/>
      </p>
      <p>
        <FormattedMessage id="kill_count.infected" values={{infected: infected}}/>
      </p>
      <p>
        <FormattedMessage id="kill_count.killed" values={{killed: killed}}/>
      </p>
      <button onClick={nextWeek}>
        <FormattedMessage id="kill_count.live_another"/>
      </button>
    </div>
  )
}

function Killers() {
  let location = useLocation()
  let navigate = useNavigate()
  let ages = parseAges(location.search)
  if (ages === null) {
    setTimeout(() => navigate("/"), [])
    return null
  }

  return (
    <div id="App">
      <div className="prelude">
        <FormattedMessage
          id="killers.your_kill_count"
          values={{
            h1: (...chunks) => <h1>{chunks}</h1>,
            p: (...chunks) => <p>{chunks}</p>,
          }}
        />
      </div>
      <KillCount ages={ages}/>
      <p>
        <FormattedMessage
          id="killers.stay_home"
          values={{
            stayhome: (...chunks) => <a class="external_link" target="_blank"
                                        href="https://medium.com/@joschabach/flattening-the-curve-is-a-deadly-delusion-eea324fe9727">{chunks}</a>,
          }}
        />
      </p>
      <hr/>
      <h2>
        <FormattedMessage id="app.more_information"/>
      </h2>
      <p>
        <FormattedMessage
          id="killers.previous_page_content"
          values={{
            link: (...chunks) => <Link to={`/infected${location.search}`}>
              {chunks}
            </Link>,
          }}
        />
      </p>
      <FormattedMessage
        id="killers.what_sucks"
        values={{
          p: (...chunks) => <p>{chunks}</p>,
        }}
      />
      <a
        style={{display: "block", border: "solid 1px"}}
        href="https://www.worldometers.info/coronavirus/country/us/"
      >
        <img
          style={{width: "100%"}}
          alt="graph showing a nearly perfect algorithmic growth rate"
          src="/graph.png"
        />
      </a>
      <p>
        <FormattedMessage
          id="killers.attack_rate"
          values={{
            i: (...chunks) => <i>{chunks}</i>,
            a: (...chunks) => <a class="external_link" target="_blank"
                                 href="https://www.worldometers.info/coronavirus/#repro">{chunks}</a>,
          }}
        />
      </p>
    </div>
  )
}

function parseAges(search) {
  let params = new URLSearchParams(search)
  try {
    return params
      .get("ages")
      .split(",")
      .map(str => Number(str))
  } catch (e) {
    return null
  }
}

function AppRoot() {
  let location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="/infected" element={<Infection/>}/>
      <Route path="/killers" element={<Killers/>}/>
    </Routes>
  )
}

export default () => (
  <BrowserRouter>
    <AppRoot/>
  </BrowserRouter>
)
