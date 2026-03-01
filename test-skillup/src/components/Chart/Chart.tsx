import Highcharts from 'highcharts';
import HighchartsReact, { HighchartsReactRefObject } from 'highcharts-react-official';
import React, { Component, RefObject } from 'react';

class Chart extends Component<{ options: any; highcharts?: any }, any> {
  chartRef: RefObject<HighchartsReactRefObject>;

  chartOptions: object;

  chartEle: any;

  showChartLoading: boolean = true;
  highcharts: any = Highcharts;

  constructor(props: { options: any; highcharts?: any }) {
    super(props);
    this.chartRef = React.createRef();
    this.chartOptions = {
      ...this.props.options,
      chart: {
        ...this.props.options.chart,
        events: {
          ...this.props.options.events,
          load: () => {
            this.showChartLoading = false;
            this.chartEle?.hideLoading();
          },
        },
      },
    };
    this.highcharts = this.highcharts;
    
    // Add support for SVG images in Highcharts
    // Add more tags and attributes if required after checking whether they are already allowed by AST
    // https://github.com/highcharts/highcharts/blob/47530de3ed2477330ce3abccf7d6a9c08864a079/ts/Core/Renderer/HTML/AST.ts
    this.highcharts.AST?.allowedAttributes.push('viewBox', 'stroke-dashoffset');
    this.highcharts.AST?.allowedTags.push('image');

  }

  componentDidMount() {
    this.chartEle = this.chartRef.current.chart;
    if (this.showChartLoading) this.chartEle.showLoading();
    else this.chartEle.hideLoading();
  }

  render() {
    return (
      <HighchartsReact
        highcharts={this.highcharts}
        options={this.chartOptions}
        ref={this.chartRef}
      />
    );
  }
}

export { Chart };
