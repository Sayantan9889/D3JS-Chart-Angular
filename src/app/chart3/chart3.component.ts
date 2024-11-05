import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';
import { axisBottom, axisLeft, format, scaleBand, scaleLinear, scaleLog, select } from 'd3';

@Component({
  selector: 'app-chart3',
  standalone: true,
  imports: [],
  templateUrl: './chart3.component.html',
  styleUrl: './chart3.component.scss'
})
export class Chart3Component {
  private chart = viewChild<ElementRef<HTMLDivElement>>('chart3');

  private readonly data: Array<{ week: any, values: any }> = [
    { week: "Week 01", values: { "Category A": 900000, "Category B": 500000, "Category C": 300000 } },
    { week: "Week 02", values: { "Category A": 900000, "Category B": 550000, "Category C": 250000 } },
    { week: "Week 03", values: { "Category A": 850000, "Category B": 530000, "Category C": 270000 } },
    { week: "Week 04", values: { "Category A": 920000, "Category B": 600000, "Category C": 280000 } },
  ];


  constructor() {
    afterNextRender(() => {
      this.createChart();
      // this.chartInit();
    });
  }

  // private chartInit() {
  //   const _chart: HTMLDivElement | undefined = this.chart()?.nativeElement;
  //   if (_chart) {
  //     const graph = this.createChart();
  //     graph && _chart.append(graph);
  //   }
  // }

  private createChart() {
    // Set up SVG dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const _chart: HTMLDivElement | undefined = this.chart()?.nativeElement;
    if (_chart) {

      // Create the SVG container
      const svg = select(_chart).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Define scales
      const x0 = scaleBand()
        .domain(this.data.map(d => d.week))
        .range([0, width])
        .padding(0.4)
        .paddingOuter(0);    // No outer padding to remove the first gap;

      const x1 = scaleBand()
        .domain(["Category A", "Category B", "Category C"])
        .range([0, x0.bandwidth()])
        .padding(0.05);

      const y = scaleLinear()
        .domain([0, 1000000])
        .nice()
        .range([height, 0]);

      // Define colors
      const colors: any = { "Category A": "#1B75BB", "Category B": "#42F090", "Category C": "#FFDD00" };

      // Create gradient definitions
      const defs = svg.append("defs");
      Object.keys(colors).forEach(category => {
        const gradient = defs.append("linearGradient")
          .attr("id", `${category.replace(" ", "-")}-gradient`)
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%");

        gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", colors[category])
          .attr("stop-opacity", 1);

        gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", colors[category])
          .attr("stop-opacity", 0);
      });

      // Draw x-axis
      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(axisBottom(x0))
      // .call(g => g.select(".domain").remove())

      // Draw y-axis
      svg.append("g")
        .attr("class", "y-axis")
        .call(axisLeft(y).tickFormat(format(".0s")))
      // .call(g => g.select(".domain").remove())

      // svg.append("g")
      //   .attr("class", "y-axis")
      //   .call(axisLeft(y)
      //     .tickValues([0, 50000, 100000, 150000, 250000, 500000, 1000000])  // Custom tick values
      //     .tickFormat(format(".0s"))  // Short format (e.g., "50k", "1M")
      //   );

      // Add horizontal grid lines
      svg.append("g")
        .attr("class", "horizontalGrid")
        .selectAll()
        .data(y.ticks(10)) // You can adjust the number of ticks as needed
        .enter().append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", (d:any) => y(d))
        .attr("y2", (d:any) => y(d))
        .attr("stroke", "#e0e0e0") // Change color of grid lines as needed
        .attr("stroke-width", 1);

      // Draw bars
      svg.append("g")
        .selectAll("g")
        .data(this.data)
        .enter().append("g")
        .attr("transform", d => `translate(${x0(d.week)},0)`)
        .selectAll("rect")
        .data(d => Object.entries(d.values))
        .enter().append("rect")
        .attr("x", (d: any) => x1(d[0])!)
        .attr("y", (d: any) => y(d[1]))
        .attr("width", x1.bandwidth())
        .attr("height", (d: any) => height - y(d[1]))
        .attr("fill", (d: any) => `url(#${d[0].replace(" ", "-")}-gradient)`);


    }
  }
}











/**********Explanation**************/
/* // ------createChart Method -------
This method does all the heavy lifting to create the chart.

a) Setting Dimensions and Creating SVG Container
//////////////////////////////code
const margin = { top: 20, right: 20, bottom: 40, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const element = this.chart3.nativeElement;

const svg = select(element).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
  /////////////////////////////////
margin: Defines spacing around the chart for the labels and axes.
width and height: Calculate the inner width and height of the chart (excluding margins).
element: Reference to the chart3 div element.
svg: Selects the chart3 div, appends an SVG element to it, sets its dimensions, and translates the inner group (g) element by the margin. This g element is the main container for the chart.

b) Defining Scales
//////////////////////////////code
const x0 = scaleBand()
  .domain(this.data.map(d => d.week))
  .range([0, width])
  .padding(0.2);

const x1 = scaleBand()
  .domain(["Category A", "Category B", "Category C"])
  .range([0, x0.bandwidth()])
  .padding(0.05);

const y = scaleLinear()
  .domain([0, 1000000])
  .nice()
  .range([height, 0]);
////////////////////////////////
x0 (Outer X scale): This scale positions each week's group. scaleBand is a D3 function used for categorical data (like "Week 01", "Week 02").
x1 (Inner X scale): This positions each bar within a group. Each group (week) has three bars for "Category A", "Category B", and "Category C".
y (Y scale): This vertical scale represents values from 0 to 1,000,000, with higher values placed lower on the screen (range([height, 0])).

c) Creating Gradient Definitions
//////////////////////////////code
const colors: any = { "Category A": "blue", "Category B": "green", "Category C": "yellow" };

const defs = svg.append("defs");
Object.keys(colors).forEach(category => {
  const gradient = defs.append("linearGradient")
    .attr("id", `${category.replace(" ", "-")}-gradient`)
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colors[category])
    .attr("stop-opacity", 1);

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colors[category])
    .attr("stop-opacity", 0);
});
/////////////////////////////////////
colors object: Specifies color for each category.
Gradients: Creates linear gradients for each category.
Each gradient has an id (Category-A-gradient, etc.) for use as a fill.
Each gradient has two color stops (top fully opaque, bottom transparent) to create a fading effect.

d) Drawing Axes
//////////////////////////////code
svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(axisBottom(x0));

svg.append("g")
  .attr("class", "y-axis")
  .call(axisLeft(y).tickFormat(format(".0s")));
  //////////////////////////////////
X-Axis: Adds the x-axis at the bottom, mapping each week.
Y-Axis: Adds the y-axis on the left, with numbers formatted in shorthand (e.g., "1M" instead of "1000000").

e) Drawing Bars
//////////////////////////////code
svg.append("g")
  .selectAll("g")
  .data(this.data)
  .enter().append("g")
  .attr("transform", d => `translate(${x0(d.week)},0)`)
  .selectAll("rect")
  .data(d => Object.entries(d.values))
  .enter().append("rect")
  .attr("x", d => x1(d[0])!)
  .attr("y", d => y(d[1]))
  .attr("width", x1.bandwidth())
  .attr("height", d => height - y(d[1]))
  .attr("fill", d => `url(#${d[0].replace(" ", "-")}-gradient)`);
/////////////////////////////////////

Grouping by Week:
.data(this.data): Binds the weekly data.
.enter().append("g"): Creates a new g element for each week.
.attr("transform", d => translate(${x0(d.week)},0)): Positions each week’s group on the x-axis.

Bars for Each Category:
.selectAll("rect"): Adds a rectangle (bar) for each category within each week.
.data(d => Object.entries(d.values)): Binds each category’s value to its respective bar.
.attr("x", d => x1(d[0])): Positions each bar within its weekly group using the inner x scale (x1).
.attr("y", d => y(d[1])): Sets the y-position based on the category’s value.
.attr("height", d => height - y(d[1])): Calculates the bar’s height based on the value.
.attr("fill", d => url(#${d[0].replace(" ", "-")}-gradient)): Fills each bar with its respective gradient.
*/