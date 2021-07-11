/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { DateTimeFormatPipePipe } from './DateTimeFormatPipe.pipe';

describe('Pipe: DateTimeFormatPipee', () => {
  it('create an instance', () => {
    let pipe = new DateTimeFormatPipePipe('27/12/1960');
    expect(pipe).toBeTruthy();
  });
});
