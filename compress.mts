import fs from 'node:fs';
import archiver from 'archiver';

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

const version = packageJson.version;

function compressToZip(name: string, withSrc = false): void {
  const output = fs.createWriteStream(name);
  const archive = archiver('zip');

  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.on('error', function (err) {
    throw err;
  });
  archive.pipe(output);

  archive.directory('dist/js/', 'js');
  archive.directory('dist/css/', 'css');
  if (withSrc) {
    archive.directory('src/', 'src');
    archive.directory('sass/', 'sass');
  }
  archive.file('LICENSE', { name: 'LICENSE' });
  archive.file('README.md', { name: 'README.md' });

  archive.finalize();
}

compressToZip('dist/materialize-v' + version + '.zip');
compressToZip('dist/materialize-src-v' + version + '.zip', true);
