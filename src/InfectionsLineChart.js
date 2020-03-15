import React from "react";
import * as am4core from "@amcharts/amcharts4/core";
import ReactDOM from "react-dom";
import * as am4charts from "@amcharts/amcharts4/charts";
import {FormattedMessage, injectIntl} from "react-intl";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

class InfectionsLineChart extends React.Component {

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  componentDidMount() {
    if (!this.el) {
      return;
    }

    let chart = am4core.create(ReactDOM.findDOMNode(this.el), am4charts.XYChart);

    let dateAxis = chart.yAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.inversed = true;
    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());

    createSeries("infected", this.props.intl.messages["kill_count.infected_label"], this.props.data);

    //createSeries("killed", this.props.intl.messages["kill_count.killed_label"], this.props.data);

    function createSeries(s, name, data) {
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueX = s;
      series.dataFields.dateY = "date";
      series.name = name;

      let segment = series.segments.template;
      segment.interactionsEnabled = true;

      let hoverState = segment.states.create("hover");
      hoverState.properties.strokeWidth = 3;

      let dimmed = segment.states.create("dimmed");
      dimmed.properties.stroke = am4core.color("#dadada");

      segment.events.on("over", function (event) {
        processOver(event.target.parent.parent.parent);
      });

      segment.events.on("out", function (event) {
        processOut(event.target.parent.parent.parent);
      });

      series.data = data;
      return series;
    }

    function processOver(hoveredSeries) {
      hoveredSeries.toFront();

      hoveredSeries.segments.each(function (segment) {
        segment.setState("hover");
      });

      chart.series.each(function (series) {
        if (series !== hoveredSeries) {
          series.segments.each(function (segment) {
            segment.setState("dimmed");
          });
          series.bulletsContainer.setState("dimmed");
        }
      });
    }

    function processOut(hoveredSeries) {
      chart.series.each(function (series) {
        series.segments.each(function (segment) {
          segment.setState("default");
        });
        series.bulletsContainer.setState("default");
      });
    }

    this.chart = chart;
  }

  render() {
    return (
      <React.Fragment>
        <h1>
          <FormattedMessage id="kill_count.infected_label"/>
        </h1>
        <div ref={el => this.el = el} style={{height: "400px"}}/>
      </React.Fragment>
    );
  }

}

export default injectIntl(InfectionsLineChart);