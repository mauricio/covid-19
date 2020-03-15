import React, {useEffect, useRef, useState} from "react"
import serializeForm from "form-serialize"
import {BrowserRouter, Route, Routes, useLocation, useNavigate} from "react-router-dom"
import {FormattedMessage, useIntl} from "react-intl";
import {Killers} from "./Killers";
import {Infection} from "./Infection";

const UNSET = "UNSET";

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
      v => v !== UNSET
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
      <option value={UNSET}>
        {useIntl().messages["age_select.set_an_age"]}
      </option>
      {Array.from({length: 100}).map((_, index) => (
        <option key={index}>{index}</option>
      ))}
    </select>
  )
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
