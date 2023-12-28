import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';
import { fileExists, isDev } from '@ootmm/core';
import { codegen } from './codegen';

async function cloneDependencies() {
  const thirdPartyDir = path.resolve('third_party');
  const stampFile = path.resolve(thirdPartyDir, '.stamp');
  if (await fileExists(stampFile))
    return;
  await fs.mkdir(thirdPartyDir, { recursive: true });
  return new Promise((resolve, reject) => {
    const proc = spawn('git', ['clone', '--depth', '50', 'https://github.com/decompals/ultralib', thirdPartyDir + '/ultralib'], { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code !== 0)
        return reject(new Error(`git clone failed with code ${code}`));
      fs.writeFile(stampFile, '').then(_ => resolve(null));
    });
  });
}

async function make() {
  await cloneDependencies();
  return new Promise((resolve, reject) => {
    const args = ['-j', '32'];
    if (isDev()) {
      args.push('DEBUG=1');
    }
    const proc = spawn('make', args, { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) {
        resolve(null);
      } else {
        reject(new Error(`make exited with code ${code}`));
      }
    });
  });
}

async function build() {
  await cloneDependencies();
  await codegen();
  await make();
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
