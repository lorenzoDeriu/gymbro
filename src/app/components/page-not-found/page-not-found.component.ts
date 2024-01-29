import { Component, OnInit } from "@angular/core";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-page-not-found",
	templateUrl: "./page-not-found.component.html",
	styleUrls: ["./page-not-found.component.css"],
})
export class PageNotFoundComponent implements OnInit {
	public theme: "light" | "dark";

	constructor(private themeService: ThemeService) {}

	ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});
	}
}
