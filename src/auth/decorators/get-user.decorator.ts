import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  if (!req.user) {
    throw new InternalServerErrorException('User not found');
  }
  if (data) {
    return req.user[data];
  }
  return req.user;
});
