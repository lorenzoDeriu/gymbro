import { Component, OnInit } from "@angular/core";
import ApexCharts from "apexcharts";

@Component({
	selector: "app-your-progress-page",
	templateUrl: "./your-progress-page.component.html",
	styleUrls: ["./your-progress-page.component.css"],
})
export class YourProgressPageComponent implements OnInit {
	public loading = false;

	constructor() {}

	public ngOnInit() {
		setTimeout(() => {
			let options = {
				chart: {
					type: "line",
				},
				series: [
					{
						name: "sales",
						data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
					},
				],
				xaxis: {
					categories: [
						1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
					],
				},
			};

			let chart = new ApexCharts(document.getElementById("chart"), options);

			chart.render();
		}, 1000);
	}
}
