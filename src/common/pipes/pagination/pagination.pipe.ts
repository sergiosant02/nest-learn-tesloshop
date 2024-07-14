import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(req: Request, metadata: ArgumentMetadata) {
    console.dir(req);
    return req;
  }
}
