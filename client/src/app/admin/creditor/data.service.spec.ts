import {TestBed} from '@angular/core/testing';
import {DataService} from './data.service';
import {HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('data service', () => {
  let httpTestingController: HttpTestingController;
   let service: DataService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DataService,
      ]
    });
    // httpTestingController = TestBed.get(HttpTestingController);


  });
  describe('getHero with correct url', () => {
    it('should call posts api', () => {
      const response = 'response';
      service = TestBed.get(DataService);
      // const service: DataService = TestBed.get(DataService);
      const httpMock =
        TestBed.get(HttpTestingController);
      service.getUsers(0, 5, 'name', -1, '').subscribe(data => {
        expect(data).toEqual(response);
      });

      const req = httpTestingController.expectNone(
      (request: any) => {
        return request.url === 'api/creditor?page=0&limit=5 &sort=name & order=-1 &filter='' ';

      }
    );
      expect(req.request.method).toEqual('JSONP');
      req.flush(response);
    });
  });
 });
