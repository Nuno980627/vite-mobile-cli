'use strict';
import fs from 'fs'
import { promisify } from 'util'
const access = promisify(fs.access);
export async function fsExist (target) {
  let isExist = false;
  try {
    await access(target, fs.constants.R_OK);
    isExist = true;
  } catch (error) {
    isExist = false;
  }
  return isExist;
};
