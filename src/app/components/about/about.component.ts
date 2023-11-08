import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.css"],
})
export class AboutComponent {
	constructor(private router: Router) {}

	backToHome() {
		this.router.navigate(["/home"]);
	}

	isMobileHorizontal() {
		return (
			window.innerHeight < 500 &&
			window.innerWidth > window.innerHeight
		);
	}
}
