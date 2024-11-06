import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';
import { axisBottom, axisLeft, create, curveMonotoneX, groupSort, line, max, scaleBand, scaleLinear, scalePoint } from 'd3';

@Component({
  selector: 'app-chart2',
  standalone: true,
  imports: [],
  templateUrl: './chart2.component.html',
  styleUrl: './chart2.component.scss'
})
export class Chart2Component {
  private chart = viewChild<ElementRef<HTMLDivElement>>('chart2');

  protected data: Array<any> = [
    { "letter": "A", "frequency": 0.08167 },
    { "letter": "B", "frequency": 0.01492 },
    { "letter": "C", "frequency": 0.02782 },
    { "letter": "D", "frequency": 0.04253 },
    { "letter": "E", "frequency": 0.12702 },
    { "letter": "F", "frequency": 0.02288 },
    { "letter": "G", "frequency": 0.02015 },
    { "letter": "H", "frequency": 0.06094 },
    { "letter": "I", "frequency": 0.06966 },
    { "letter": "J", "frequency": 0.00153 },
    { "letter": "K", "frequency": 0.00772 },
    { "letter": "L", "frequency": 0.04025 },
    { "letter": "M", "frequency": 0.02406 },
    { "letter": "N", "frequency": 0.06749 },
    { "letter": "O", "frequency": 0.07507 },
    { "letter": "P", "frequency": 0.01929 },
    { "letter": "Q", "frequency": 0.00095 },
    { "letter": "R", "frequency": 0.05987 },
    { "letter": "S", "frequency": 0.06327 },
    { "letter": "T", "frequency": 0.09056 },
    { "letter": "U", "frequency": 0.02758 },
    { "letter": "V", "frequency": 0.00978 },
    { "letter": "W", "frequency": 0.0236 },
    { "letter": "X", "frequency": 0.0015 },
    { "letter": "Y", "frequency": 0.01974 },
    { "letter": "Z", "frequency": 0.00074 }
  ];

  constructor() {
    afterNextRender(() => {
      this.chartInit();
    });
  };

  chartInit() {
    const _chart: HTMLDivElement | undefined = this.chart()?.nativeElement;
    if (_chart) {
      const graph = this.createChart();
      graph && _chart.append(graph);
    }
  }

  createChart(): SVGSVGElement | null {
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 40;

    const x: any = scaleBand()  // x - axis
      // .domain(this.data.map((d) => d.letter))
      .domain(
        this.data
          .sort((a, b) => b.frequency - a.frequency) // Sort by descending frequency
          .map(d => d.letter)
      )
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const y: any = scaleLinear()  // y - axis
      .domain([0, max(this.data, (d) => d.frequency)])
      .range([height - marginBottom, marginTop])


    const svg = create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.append('g')   // append x - axis
      .attr('transform', `translate(0, ${height - marginBottom})`)
      .call(axisBottom(x).tickSizeOuter(0))

    svg.append('g') // append y - axis
      .attr("transform", `translate(${marginLeft},0)`)
      .call(axisLeft(y).tickFormat((y: any) => (y * 100).toFixed()))
      .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "#4682B4")
        .attr("text-anchor", "start")
        .text("↑ Frequency (%)"));

    // Declare the line generator.
    const lineFunc: any = line()
      .x((d: any) => x(d.letter))
      .y((d: any) => y(d.frequency))
      .curve(curveMonotoneX) // make sharp corners more smooth.

    // Append a path for the line.
    svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", lineFunc(this.data));


    return svg.node();
  }


  /** Will work same */
  // createChart(): SVGSVGElement | null {
  //   const width = 928;
  //   const height = 500;
  //   const marginTop = 20;
  //   const marginRight = 0;
  //   const marginBottom = 30;
  //   const marginLeft = 40;

  //   // Use scalePoint instead of scaleBand for x-axis
  //   const x = scalePoint()
  //     .domain(this.data.map(d => d.letter))
  //     .range([marginLeft, width - marginRight])
  //     .padding(0.5);

  //   const y = scaleLinear()  // y-axis
  //     .domain([0, max(this.data, (d) => d.frequency)])
  //     .nice()
  //     .range([height - marginBottom, marginTop]);

  //   const svg = create('svg')
  //     .attr('width', width)
  //     .attr('height', height)
  //     .attr('viewBox', [0, 0, width, height])
  //     .attr("style", "max-width: 100%; height: auto;");

  //   svg.append('g')   // Append x-axis
  //     .attr('transform', `translate(0, ${height - marginBottom})`)
  //     .call(axisBottom(x).tickSizeOuter(0));

  //   svg.append('g') // Append y-axis
  //     .attr("transform", `translate(${marginLeft},0)`)
  //     .call(axisLeft(y).tickFormat((y: any) => (y * 100).toFixed()));

  //   // Declare the line generator
  //   const lineFunc = line()
  //     .x((d: any) => x(d.letter)!)
  //     .y((d: any) => y(d.frequency));

  //   // Append a path for the line
  //   svg.append("path")
  //     .attr("fill", "none")
  //     .attr("stroke", "steelblue")
  //     .attr("stroke-width", 1.5)
  //     .attr("d", lineFunc(this.data));

  //   return svg.node();
  // }
}
