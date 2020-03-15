import {Link, useLocation, useNavigate} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import React from "react";
import {KillCount} from "./KillCount";

export function parseAges(search) {
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

export function Killers() {
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
            stayhome: (...chunks) => <a className="external_link" target="_blank" rel="noopener noreferrer"
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
            a: (...chunks) => <a className="external_link" target="_blank" rel="noopener noreferrer"
                                 href="https://www.worldometers.info/coronavirus/#repro">{chunks}</a>,
          }}
        />
      </p>
    </div>
  )
}