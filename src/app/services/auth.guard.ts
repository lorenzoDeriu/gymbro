import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
	constructor(private authservice: AuthService, private router: Router) {}

	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (await this.authservice.isAuthenticated()) {
			return true;
		}

		this.router.navigate(["/welcome"]);
		return false;
	}
}
