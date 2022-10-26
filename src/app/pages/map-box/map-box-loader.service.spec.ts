import { TestBed } from '@angular/core/testing';

import { MapBoxLoaderService } from './map-box-loader.service';

describe('MapBoxLoaderService', () => {
  let service: MapBoxLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapBoxLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
