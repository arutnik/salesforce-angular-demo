import { Pipe, PipeTransform } from '@angular/core';

declare var getSfStaticResourceRoot : () => string;

export function getStaticPathForResource(resourcePath : string) {
    return getSfStaticResourceRoot() + resourcePath;
}

/*
 * Ensures a static asset path gets the right prefix
*/
@Pipe({name: 'staticpath'})
export class StaticPathPipe implements PipeTransform {
  transform(value: string): string {

    return getStaticPathForResource(value);
  }
}