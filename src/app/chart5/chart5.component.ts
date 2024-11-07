import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';
import { axisBottom, axisLeft, create, curveMonotoneX, extent, format, line, scaleLinear, scaleTime, timeFormat } from 'd3';

@Component({
  selector: 'app-chart5',
  standalone: true,
  imports: [],
  templateUrl: './chart5.component.html',
  styleUrl: './chart5.component.scss'
})
export class Chart5Component {
  private chart = viewChild<ElementRef<HTMLDivElement>>('chart5');
  private data: Array<any> = [
    { date: new Date(2009, 11, 1), rate: 0 },
    { date: new Date(2010, 2, 1), rate: 35 },
    { date: new Date(2011, 5, 1), rate: 50 },
    { date: new Date(2014, 10, 1), rate: 120 },
    { date: new Date(2015, 8, 1), rate: 95 },
    { date: new Date(2017, 3, 1), rate: 70 },
    { date: new Date(2018, 7, 1), rate: 55 },
    { date: new Date(2020, 1, 1), rate: 40 },
    { date: new Date(2021, 5, 1), rate: 130 },
    { date: new Date(2022, 10, 1), rate: 70 },
    { date: new Date(2023, 8, 1), rate: 10 }
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
    const width = 1000;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }

    // const x = scaleUtc()
    //   .domain([new Date("2023-01-01"), new Date()])
    //   .range([margin.left, width - margin.right])
    const x = scaleTime()
      .domain(extent(this.data, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right])

    const y = scaleLinear()
      .domain([0, 150])
      .range([height - margin.bottom, margin.top]);

    const svg = create('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // append the x axis and tick marks
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(axisBottom(x).tickFormat((timeFormat("%b %Y") as any)))

    // append the y axis and tick marks
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(axisLeft(y).tickFormat((d) => `${d}%`));

    // add horizontal grid line
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
    // Define zones for market conditions
    const zones = [
      { color: '#d73027', label: "Seller's Market", min: 0, max: 30 },
      { color: '#66c2a5', label: "Balanced Market", min: 30, max: 60 },
      { color: '#4575b4', label: "Buyer's Market", min: 60, max: 150 }
    ];

    // Draw lines for market condition zones
    zones.forEach(zone => {
      svg.append('line')
        .attr('x1', 41)
        .attr('x2', width - margin.right)
        .attr('y1', y(zone.max))
        .attr('y2', y(zone.max))
        .attr('stroke', zone.color)
        .attr('stroke-width', 1)
        .style('stroke-dasharray', '4 4');
    });




    // Define line generators for each line
    const lineAabsorptionRate = line()
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.rate))
      .curve(curveMonotoneX); // make sharp corners more smooth.

    // Append the absorption rate line to the SVG  (Draw line segments with single color)
    svg.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', '#66c2a5') // main line color
      .attr('stroke-width', 2)
      .attr('d', lineAabsorptionRate);


    // // Helper function to find the zone based on the rate
    // function findZone(rate: number) {
    //   return zones.find(zone => rate >= zone.min && rate <= zone.max);
    // }

    // // Helper function to calculate intersection point between two points at a given boundary
    // function interpolatePoint(p1:any, p2:any, boundary:any) {
    //   const ratio = (boundary - p1.rate) / (p2.rate - p1.rate);
    //   const date = new Date(p1.date.getTime() + ratio * (p2.date.getTime() - p1.date.getTime()));
    //   return { date, rate: boundary };
    // }

    // // Draw the continuous line with color transitions across zone boundaries
    // for (let i = 0; i < this.data.length - 1; i++) {
    //   let startPoint = this.data[i];
    //   let endPoint = this.data[i + 1];

    //   let currentZone:any = findZone(startPoint.rate);
    //   let segmentData = [startPoint];

    //   // Check for zone crossings between startPoint and endPoint
    //   for (const boundaryZone of zones) {
    //     if ((startPoint.rate < boundaryZone.min && endPoint.rate >= boundaryZone.min) ||
    //       (startPoint.rate > boundaryZone.max && endPoint.rate <= boundaryZone.max)) {
    //       // Calculate intersection point at the boundary
    //       const boundaryRate = startPoint.rate < endPoint.rate ? boundaryZone.min : boundaryZone.max;
    //       const boundaryPoint = interpolatePoint(startPoint, endPoint, boundaryRate);

    //       // Draw the line segment up to the boundary
    //       segmentData.push(boundaryPoint);
    //       drawLineSegment(segmentData, currentZone.color);

    //       // Start a new segment from the boundary point and update the current zone
    //       segmentData = [boundaryPoint];
    //       currentZone = findZone(boundaryRate);
    //     }
    //   }

    //   // Complete the remaining segment from the last boundary point to the endpoint
    //   segmentData.push(endPoint);
    //   drawLineSegment(segmentData, currentZone.color);
    // }

    // // Helper function to draw a line segment with a specific color
    // function drawLineSegment(segmentData:any[], color:any) {
    //   svg.append('path')
    //     .datum(segmentData)
    //     .attr('fill', 'none')
    //     .attr('stroke', color)
    //     .attr('stroke-width', 2)
    //     .attr('d', line<{ date: Date; rate: number }>()
    //       .x(d => x(d.date))
    //       .y(d => y(d.rate))
    //       .curve(curveMonotoneX)
    //     );
    // }





    // Legend (Optional, will be added by html/css)
    zones.forEach((zone, i) => {
      svg.append('rect')
        .attr('x', (i + 3.5) * 150)
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', zone.color);

      svg.append('text')
        .attr('x', (i + 3.5) * 150 + 20)
        .attr('y', 7)
        .text(zone.label)
        .style('font-size', '12px')
        .attr('alignment-baseline', 'middle');
    });

    return svg.node();
  }
}
