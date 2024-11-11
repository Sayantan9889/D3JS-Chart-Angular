import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';
import { axisBottom, axisLeft, create, curveBasis, curveMonotoneX, extent, format, line, scaleLinear, scaleUtc, Selection, timeFormat } from 'd3';

@Component({
  selector: 'app-chart6',
  standalone: true,
  imports: [],
  templateUrl: './chart6.component.html',
  styleUrl: './chart6.component.scss'
})
export class Chart6Component {
  private chart = viewChild<ElementRef<HTMLDivElement>>('chart6');

  private data: Array<{ date: Date, rental: number, inventory: number }> = [
    { date: new Date('2023-10-01'), rental: 7000, inventory: 2000 },
    { date: new Date('2023-11-01'), rental: 10000, inventory: 12000 },
    { date: new Date('2023-12-01'), rental: 100000, inventory: 10000 },
    { date: new Date('2024-01-01'), rental: 35000, inventory: 305000 },
    { date: new Date('2024-02-01'), rental: 45000, inventory: 65000 },
    { date: new Date('2024-03-01'), rental: 405000, inventory: 705000 },
    { date: new Date('2024-04-01'), rental: 300000, inventory: 500000 },
    { date: new Date('2024-05-01'), rental: 505000, inventory: 705000 },
    { date: new Date('2024-06-01'), rental: 300000, inventory: 500000 },
    { date: new Date('2024-07-01'), rental: 505000, inventory: 705000 },
    { date: new Date('2024-08-01'), rental: 705000, inventory: 905000 },
    { date: new Date('2024-09-01'), rental: 405000, inventory: 605000 },
    { date: new Date('2024-10-01'), rental: 605000, inventory: 805000 },
    { date: new Date('2024-11-01'), rental: 750000, inventory: 950000 }
  ];


  constructor() {
    afterNextRender(() => {
      this.chartInit();
    });
  }

  private chartInit(): void {
    console.log("chart: ", this.chart());
    const chartContainer: HTMLDivElement | undefined = this.chart()?.nativeElement;
    if (chartContainer) {
      const svg = this.createChart(1228, 400, 20, 20, 40, 60);
      svg && chartContainer.append(svg);
    }
  }


  /**
   * This method is responsible for creating chart image in svg format and return it.
   * 
   * @param width is the total width of the SVG element that contains the chart, including the margins.
   * @param height is the total height of the SVG element that contains the chart, including the margins.
   * @param top is the margin-top of the svg
   * @param right is the margin-right of the svg
   * @param bottom is the margin-bottom of the svg
   * @param left is the margin-left of the svg
   */
  private createChart(width: number, height: number, top: number, right: number, bottom: number, left: number): SVGSVGElement | null {
    // Set up SVG dimensions
    const svg = create('svg')
      .attr('width', width + left + right)
      .attr('height', height + top + bottom)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Append the x-axis
    const xScale = this.createXScale(width, { right: right, left: left });
    svg.append('g')
      .attr('transform', `translate(0, ${height - bottom})`)
      .call(this.createXAxis(xScale));

    // Append the y-axis
    const yScale = this.createYScale(height, { top: top, bottom: bottom });
    svg.append('g')
      .attr('transform', `translate(${left}, 0)`)
      .call(this.createYAxis(yScale));

    // add the horizontal grid lines
    this.createHorizontalGrid(svg, yScale, width, { right: right, left: left });

    // Append the rental line
    const rentalLine = this.createLine(xScale, yScale, 'rental');
    this.appendLines(svg, 'steelblue', 'steelblue', 1.5, rentalLine, xScale, yScale, 'rental')

    // Append the rental line
    const inventoryLine = this.createLine(xScale, yScale, 'inventory');
    this.appendLines(svg, 'grey', 'grey', 1.5, inventoryLine, xScale, yScale, 'inventory')


    return svg.node();
  }



  /**
   *  This method is responsible for creating a time scale for the x-axis of the chart.
   */
  private createXScale(width: number, margin: { right: number, left: number }) {
    const xScale = scaleUtc()
      .domain(extent(this.data, (d: any) => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);
    return xScale;
  }
  /**
   * This method is responsible for creating and configuring the x-axis for the chart
   */
  private createXAxis(xScale: any) {
    const xAxis = axisBottom(xScale)
      .tickFormat(timeFormat('%b %y') as any);
    return xAxis;

  }




  /**
   * This method is responsible for creating a linear scale for the y-axis of the chart.
   */
  private createYScale(height: number, margin: { top: number, bottom: number }) {
    const yScale = scaleLinear()
      .domain([0, 1000000])
      .range([height - margin.bottom, margin.top]);
    return yScale;
  }
  /**
   * This method is responsible for creating and configuring the y-axis for the chart
   */
  private createYAxis(yScale: any) {
    const yAxis = axisLeft(yScale)
      .tickFormat(format('.0s') as any);
    return yAxis;
  }




  /**
   * This method is responsible for adding the horizontal grid to the chart
   */
  private createHorizontalGrid(svg: Selection<SVGSVGElement, undefined, null, undefined>, yScale: any, width: number, margin: { right: number, left: number }) {
    svg.append('g')
      .attr('class', 'horizontalGrid')
      .selectAll()
      .data(yScale.ticks(10))
      .enter().append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d: any) => yScale(d))
      .attr("y2", (d: any) => yScale(d))
      .attr("stroke", "#e0e0e0") // Change color of grid lines as needed
      .attr("stroke-width", 1);
  }




  /**
   * This method is responsible for creating a line function for the chart
   */
  private createLine(xScale: any, yScale: any, lineType: string) {
    return line()
      .x((d: any) => xScale(d.date))
      .y((d: any) => yScale(d[lineType]))
      .curve(curveMonotoneX);
  }
  /**
   * this meathod is responsible for dwaring a line using 'createLine' method for the chart and appent it to svg
   */
  private appendLines(svg: Selection<SVGSVGElement, undefined, null, undefined>, _fill: string, stroke: string, stroke_width: number, line: any, xScale: any, yScale: any, lineType: string) {
    console.log("_fill: ", _fill);
    svg.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', stroke)
      .attr('stroke-width', stroke_width)
      .attr('d', line);

    svg.append('circle')
      .attr('cx', xScale(this.data[this.data.length - 1].date))
      .attr('cy', yScale((this.data[this.data.length - 1] as any)[lineType]))
      .attr('r', 4)
      .attr('fill', _fill);
  }
}
