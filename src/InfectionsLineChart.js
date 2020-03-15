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

  createSeries(s, name) {
    let series = this.chart.series.push(new am4charts.LineSeries());
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
      this.processOver(event.target.parent.parent.parent);
    });

    segment.events.on("out", function (event) {
      this.processOut(event.target.parent.parent.parent);
    });

    series.data = this.props.data;
    return series;
  }

  processOver(hoveredSeries) {
    hoveredSeries.toFront();

    hoveredSeries.segments.each(function (segment) {
      segment.setState("hover");
    });

    this.chart.series.each(function (series) {
      if (series !== hoveredSeries) {
        series.segments.each(function (segment) {
          segment.setState("dimmed");
        });
        series.bulletsContainer.setState("dimmed");
      }
    });
  }

  processOut(hoveredSeries) {
    this.chart.series.each(function (series) {
      series.segments.each(function (segment) {
        segment.setState("default");
      });
      series.bulletsContainer.setState("default");
    });
  }

  drawChart() {
    if (!this.el) {
      return;
    }

    this.chart = am4core.create(ReactDOM.findDOMNode(this.el), am4charts.XYChart);

    let dateAxis = this.chart.yAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.inversed = true;
    let valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis());

    this.series = this.createSeries(this.props.series, this.props.intl.messages[`kill_count.${this.props.series}_label`]);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.series.data = this.props.data;
  }

  componentDidMount() {
    this.drawChart()
  }

  render() {
    return (
      <React.Fragment>
        <h1>
          <FormattedMessage id={`kill_count.${this.props.series}_label`}/>
        </h1>
        <div ref={el => this.el = el} style={{height: "200px"}}/>
      </React.Fragment>
    );
  }

}

export default injectIntl(InfectionsLineChart);