import { Injectable } from '@angular/core';
import { Location, PlatformLocation, LocationStrategy, LocationChangeListener } from "@angular/common";

declare var getSfPageRoot : () => string;


/* 
    A location strategy that works similar to the HashLocationStrategy but 
    works better for Salesforce

    Regular HashlocationStratgey makes paths like

    http://c67.salesforce.com/#/search/result

    This makes paths like

    http://c67.salesforce.com/apex/pagename#search/result
*/
@Injectable()
export class SalesforceHashLocationStrategy extends LocationStrategy {
  constructor(
      private _platformLocation: PlatformLocation) {
    super();
  }

  onPopState(fn: LocationChangeListener): void {
    this._platformLocation.onPopState(fn);
    this._platformLocation.onHashChange(fn);
  }

  getBaseHref(): string {
    return getSfPageRoot();
  }

  path(includeHash: boolean = false): string {
    // The hash value is always prefixed with a `#`
    // and if it is empty then it will stay empty
    let path = this._platformLocation.hash;
    if (!path) path = '#';

    return path.substring(1);
  }

  prepareExternalUrl(internal: string): string {
    let url = internal;
    if (url.endsWith("/")) {
        url = url.substr(0, url.length-1);
    }

    return this.getBaseHref() + "#" + url;
  }

  pushState(state: any, title: string, path: string, queryParams: string) {
    let url = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
    this._platformLocation.pushState(state, title, url);
  }

  replaceState(state: any, title: string, path: string, queryParams: string) {
    let url = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
    this._platformLocation.replaceState(state, title, url);
  }

  forward(): void { this._platformLocation.forward(); }

  back(): void { this._platformLocation.back(); }
}