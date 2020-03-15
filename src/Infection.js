import {Link, useLocation, useNavigate} from "react-router-dom";
import {parseAges} from "./Killers";
import {FormattedMessage} from "react-intl";
import {DiceRoll} from "./DiceRoll";
import React from "react";

export function Infection() {
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
            cdcburden: (...chunks) => <a className="external_link" target="_blank" rel="noopener noreferrer"
                                         href="https://www.cdc.gov/flu/about/burden/index.html#:~:text=">{chunks}</a>,
            cnnmaps: (...chunks) => <a className="external_link" target="_blank" rel="noopener noreferrer"
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
            deathrate: (...chunks) => <a className="external_link" target="_blank" rel="noopener noreferrer"
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
          overwhelm: (...chunks) => <a className="external_link" target="_blank" rel="noopener noreferrer"
                                       href="https://www.theatlantic.com/ideas/archive/2020/03/who-gets-hospital-bed/607807/">{chunks}</a>,
        }}
      />
    </div>
  )
}