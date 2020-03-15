import React, {useState} from "react";
import {FormattedMessage} from "react-intl";
import moment from "moment";
import InfectionsLineChart from "./InfectionsLineChart";

const rate = 0.034;
const Ro = 2;

export function KillCount({ages}) {
  let [infected, setInfected] = useState(1);
  let [weeks, setWeeks] = useState(1);
  let [killed, setKilled] = useState(0);
  let [timeline, setTimeline] = useState([
    {
      date: moment().toDate(),
      infected: 1,
      killed: 0,
    }
  ]);

  function nextWeek() {
    let totalInfected = infected * Ro;
    let totalWeeks = weeks + 1;
    let totalKilled = Math.round(infected * rate);

    setInfected(totalInfected);
    setWeeks(totalWeeks);
    setKilled(totalKilled);

    let series = [...timeline];
    series.push({
      date: moment().add(totalWeeks, "weeks").toDate(),
      infected: totalInfected,
      killed: totalKilled,
    });

    setTimeline(series);
  }

  return (
    <React.Fragment>
      <div id="KillCount">
        <button onClick={nextWeek}>
          <FormattedMessage id="kill_count.live_another"/>
        </button>
        <br/>
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
      </div>
      <InfectionsLineChart key={`infected-${timeline.length}`} data={timeline} series="infected"/>
      <InfectionsLineChart key={`killed-${timeline.length}`} data={timeline} series="killed"/>
    </React.Fragment>
  )
}