import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';
import { axisBottom, axisLeft, create, curveBasis, curveCardinal, curveCatmullRom, curveMonotoneX, extent, format, line, scaleLinear, scaleTime, Selection, timeFormat } from 'd3';

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

  private svgChart!: Selection<SVGSVGElement, undefined, null, undefined>;
  private xAxis: any;
  private yAxis: any;

  protected shouldShow: boolean = false;

  constructor() {
    afterNextRender(() => {
      this.chartInit();
    });
  }

  private chartInit(): void {
    const _chartContainer: HTMLDivElement | undefined = this.chart()?.nativeElement;
    if (_chartContainer) {
      this.svgChart = this.createChart();
      const svg = this.svgChart.node()
      svg && _chartContainer.append(svg);
    }
  }

  private createChart() {
    const width = 1000;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }

    // const x = scaleUtc()
    //   .domain([new Date("2023-01-01"), new Date()])
    //   .range([margin.left, width - margin.right])
    this.xAxis = scaleTime()
      .domain(extent(this.data, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right])

    this.yAxis = scaleLinear()
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
      .call(axisBottom(this.xAxis).tickFormat((timeFormat("%b %Y") as any)))

    // append the y axis and tick marks
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(axisLeft(this.yAxis).tickFormat((d) => `${d}%`));

    // add horizontal grid line
    svg.append('g')
      .attr('class', 'horizontalGrid')
      .selectAll()
      .data(this.yAxis.ticks(10))
      .enter().append("line")
      .attr("x1", 41)
      .attr("x2", width - margin.right)
      .attr("y1", (d: any) => this.yAxis(d))
      .attr("y2", (d: any) => this.yAxis(d))
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
        .attr('y1', this.yAxis(zone.max))
        .attr('y2', this.yAxis(zone.max))
        .attr('stroke', zone.color)
        .attr('stroke-width', 1)
        .style('stroke-dasharray', '4 4');
    });




    const lineAabsorptionRate = line()
      .x((d: any) => this.xAxis(d.date))
      .y((d: any) => this.yAxis(d.rate))
      .curve(curveMonotoneX);


    // Append the absorption rate line to the SVG  (Draw line segments with different colour in different zones)
    // Helper function to find the zone based on the rate
    function findZone(rate: number) {
      return zones.find(zone => rate >= zone.min && rate <= zone.max);
    }

    // Helper function to calculate intersection point between two points at a given boundary
    function interpolatePoint(p1: any, p2: any, boundary: any) {
      const ratio = (boundary - p1.rate) / (p2.rate - p1.rate);
      const date = new Date(p1.date.getTime() + ratio * (p2.date.getTime() - p1.date.getTime()));
      return { date, rate: boundary };
    }

    // Draw the continuous line with color transitions across zone boundaries
    for (let i = 0; i < this.data.length - 1; i++) {
      let startPoint = this.data[i];
      let endPoint = this.data[i + 1];
      let segmentData = [startPoint];
      const tolerance = 1e-5; // Small tolerance to prevent infinite looping and ensure continuity

      while (true) {
        const currentZone: any = findZone(startPoint.rate);
        const nextZone = findZone(endPoint.rate);

        if (currentZone === nextZone) {
          // If both points are in the same zone, draw the segment and break
          segmentData.push(endPoint);
          drawLineSegment(segmentData, currentZone.color, lineAabsorptionRate);
          break;
        } else {
          // Find the boundary that the segment crosses
          const boundaryRate = startPoint.rate < endPoint.rate
            ? currentZone.max
            : currentZone.min;

          // Calculate the intersection point at the boundary
          const boundaryPoint = interpolatePoint(startPoint, endPoint, boundaryRate);

          // Check if boundaryPoint is nearly the same as startPoint to prevent infinite looping
          if (Math.abs(boundaryPoint.rate - startPoint.rate) < tolerance) {
            segmentData.push(endPoint);
            drawLineSegment(segmentData, currentZone.color, lineAabsorptionRate);
            break;
          }

          // Draw up to the boundary point
          segmentData.push(boundaryPoint);
          drawLineSegment(segmentData, currentZone.color, lineAabsorptionRate);

          // Prepare for the next segment, moving startPoint slightly forward to avoid retracing
          startPoint = {
            date: new Date(boundaryPoint.date.getTime() + 1), // Slightly move forward in time
            rate: boundaryPoint.rate + (startPoint.rate < endPoint.rate ? tolerance : -tolerance)
          };
          segmentData = [startPoint];
        }
      }
    }


    // Helper function to draw a line segment with a specific color
    function drawLineSegment(segmentData: any, color: any, lineGenerator: any) {
      svg.append('path')
        .datum(segmentData)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);
    }


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



    return svg;
  }

  protected showHideCurveLine(): void {
    // If we are going to show the curve line, append it
    if (!this.shouldShow) {
      if (this.svgChart) {
        const lineAabsorptionRate = line()
          .x((d: any) => this.xAxis(d.date))
          .y((d: any) => this.yAxis(d.rate))
          .curve(curveMonotoneX); // make sharp corners more smooth.

        this.svgChart.append('path')
          .datum(this.data)
          .attr('class', 'absorption-rate-path')  // Add a class for easy selection
          .attr('fill', 'none')
          .attr('stroke', '#bd930b') // main line color
          .attr('stroke-width', 2)
          .attr('d', lineAabsorptionRate);
      }
    } else {
      // If the curve line is to be hidden, remove it
      console.log("curve: ");
      const _curveLines = this.svgChart.node()?.querySelectorAll('.absorption-rate-path')
      if (_curveLines) {
        console.log("_curveLines: ", _curveLines);
        _curveLines.forEach(path => {
          path.remove();
        });
      }
    }
    this.shouldShow = !this.shouldShow
  }

}
