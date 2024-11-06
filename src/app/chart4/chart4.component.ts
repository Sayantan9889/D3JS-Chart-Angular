import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';
import { axisBottom, axisLeft, create, curveMonotoneX, extent, format, line, max, scaleLinear, scaleTime, scaleUtc, timeFormat } from 'd3';

@Component({
  selector: 'app-chart4',
  standalone: true,
  imports: [],
  templateUrl: './chart4.component.html',
  styleUrl: './chart4.component.scss'
})
export class Chart4Component {
  private chart = viewChild<ElementRef<HTMLDivElement>>('chart4');

  private data: Array<any> = [
    { date: new Date(2023, 9, 1), averageListings: 10000, medianPrice: 10000, allProperties: 10000 },
    { date: new Date(2023, 10, 1), averageListings: 25000, medianPrice: 25000, allProperties: 25000 },
    { date: new Date(2023, 11, 1), averageListings: 80000, medianPrice: 85000, allProperties: 90000 },
    { date: new Date(2023, 12, 1), averageListings: 350000, medianPrice: 400000, allProperties: 450000 },
    { date: new Date(2024, 1, 1), averageListings: 300000, medianPrice: 350000, allProperties: 400000 },
    { date: new Date(2024, 2, 1), averageListings: 350000, medianPrice: 400000, allProperties: 450000 },
    { date: new Date(2024, 3, 1), averageListings: 500000, medianPrice: 550000, allProperties: 600000 },
    { date: new Date(2024, 4, 1), averageListings: 550000, medianPrice: 600000, allProperties: 650000 },
    { date: new Date(2024, 5, 1), averageListings: 400000, medianPrice: 450000, allProperties: 500000 },
    { date: new Date(2024, 6, 1), averageListings: 550000, medianPrice: 600000, allProperties: 650000 },
    { date: new Date(2024, 7, 1), averageListings: 600000, medianPrice: 650000, allProperties: 700000 },
    { date: new Date(2024, 8, 1), averageListings: 650000, medianPrice: 700000, allProperties: 750000 },
    { date: new Date(2024, 9, 1), averageListings: 700000, medianPrice: 750000, allProperties: 800000 },
    { date: new Date(2024, 10, 1), averageListings: 750000, medianPrice: 800000, allProperties: 850000 },
    { date: new Date(2024, 11, 1), averageListings: 800000, medianPrice: 850000, allProperties: 900000 }
  ];


  constructor() {
    afterNextRender(() => {
      this.chartInit();
    });
  }

  private chartInit(): void {
    const _chartContainer: HTMLDivElement | undefined = this.chart()?.nativeElement;
    if (_chartContainer) {
      const chart = this.createChart();
      chart && _chartContainer.append(chart);
    }
  }

  private createChart() {
    const width = 700;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }

    // const x = scaleUtc()
    //   .domain([new Date("2023-01-01"), new Date()])
    //   .range([margin.left, width - margin.right])
    const x = scaleTime()
      .domain(extent(this.data, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right])

    const y = scaleLinear()
      .domain([0, 1000000])
      .range([height - margin.bottom, margin.top]);

    const svg = create('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");


    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(axisBottom(x).tickFormat((timeFormat("%b %y") as any)))

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(axisLeft(y).tickFormat(format('.0s')));

    svg.append('g')
      .attr('class', 'horizontalGrid')
      .selectAll()
      .data(y.ticks(10))
      .enter().append("line")
      .attr("x1", 41)
      .attr("x2", width - margin.right)
      .attr("y1", (d: any) => y(d))
      .attr("y2", (d: any) => y(d))
      .attr("stroke", "#e0e0e0") // Change color of grid lines as needed
      .attr("stroke-width", 1);


    // Define line generators for each line
    const lineAverageListings = line()
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.averageListings))
      .curve(curveMonotoneX); // make sharp corners more smooth.

    const lineMedianPrice = line()
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.medianPrice))
      .curve(curveMonotoneX); // make sharp corners more smooth.

    const lineAllProperties = line()
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.allProperties))
      .curve(curveMonotoneX); // make sharp corners more smooth.

    // Append the lines to the SVG
    svg.append('path')
      .attr('class', 'average-line')
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "#42F090")
      .attr("stroke-width", 1.5)
      .attr("d", lineAverageListings);

    svg.append('path')
      .attr('class', 'median-price-line')
      .attr("fill", "none")
      .attr("stroke", "#FFDD00")
      .attr("stroke-width", 1.5)
      .attr("d", lineMedianPrice(this.data));

    svg.append('path')
      .attr('class', 'all-property-line')
      .attr("fill", "none")
      .attr("stroke", "#106BB3")
      .attr("stroke-width", 1.5)
      .attr("d", lineAllProperties(this.data));



    // Legend
    const legendData = [
      { color: '#42F090', text: 'Average Listings' },
      { color: '#FFDD00', text: 'Median Price' },
      { color: '#106BB3', text: 'All Properties' }
    ];

    legendData.forEach((d, i) => {
      svg.append('rect')
        .attr('x', width - 130)
        .attr('y', i * 20)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', d.color);

      svg.append('text')
        .attr('x', width - 115)
        .attr('y', i * 20 + 9)
        .text(d.text)
        .style('font-size', '12px')
        .attr('alignment-baseline', 'middle');
    });


    return svg.node();

  }
}
