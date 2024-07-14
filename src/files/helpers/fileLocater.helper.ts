import * as fs from 'fs-extra';

export const fileLocater = (
  req,
  file: Express.Multer.File,
  callback: Function,
) => {
  console.log(req.params['folder']);
  if (!req.params['folder']) {
    callback(new Error('Invalid file location'), false);
  }
  fs.ensureDirSync(`./static/${req.params['folder']}`);
  callback(null, `./static/${req.params['folder']}`);
};
