import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ThemeService {
	private theme: BehaviorSubject<"light" | "dark"> = new BehaviorSubject(
		(localStorage.getItem("theme") as "light" | "dark") ?? "light"
	);
	public themeObs = this.theme.asObservable();

	constructor() {}

	public setTheme(theme: "light" | "dark") {
		this.theme.next(theme);
		localStorage.setItem("theme", theme);
		document.body.setAttribute("data-bs-theme", theme);
	}
}
