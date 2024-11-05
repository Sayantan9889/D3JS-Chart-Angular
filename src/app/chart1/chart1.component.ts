import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, inject } from '@angular/core';
import { axisBottom, axisLeft, create, groupSort, max, scaleBand, scaleLinear, scaleUtc } from 'd3';


@Component({
  selector: 'app-chart1',
  standalone: true,
  imports: [],
  templateUrl: './chart1.component.html',
  styleUrl: './chart1.component.scss'
})
export class Chart1Component {

  private documents = inject(DOCUMENT);

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
  }

  chartInit() {
    const chart = this.documents.getElementById("chart1");
    if (chart) {
      const graph = this.createChart();
      graph && chart.append(graph);
    }
  }

  createChart() {
    const width = 928;
    const height = 500;
    const marginTop = 30;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 40;


    // Declare the x (horizontal position) scale.
    const x: any = scaleBand()
      // .domain(this.data.map((d) => d.letter))
      .domain(groupSort(this.data, ([d]) => -d.frequency, (d) => d.letter)) // descending frequency
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    // Declare the y (vertical position) scale.
    const y = scaleLinear()
      .domain([0, max(this.data, (d) => d.frequency)])
      .range([height - marginBottom, marginTop]);

    // Create the SVG container.
    const svg = create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Add a rect for each bar.
    svg.append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(this.data)
      .join("rect")
      .attr("x", (d) => x(d.letter))
      .attr("y", (d) => y(d.frequency))
      .attr("height", (d) => y(0) - y(d.frequency))
      .attr("width", x.bandwidth());

    // Add the x-axis and label.
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(axisBottom(x).tickSizeOuter(0));

    // Add the y-axis and label, and remove the domain line.
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(axisLeft(y).tickFormat((y: any) => (y * 100).toFixed()))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Frequency (%)"));



    // Return the SVG element.
    return svg.node();

  }
}
