import { Command } from 'commander';
import debug from 'debug';
import { rm } from 'fs/promises';
import path from 'path';

import { CaesarCipher, FibonacciRange } from './lib/index.js';

const program = new Command();

const log = debug('ngx');

program
  .name('ngx')
  .version('1.0.0-rc.1')
  .description('A command-line tool for working in this project (nickgalante.tech)');


program
  .command('hide')
  .description('Hide a file using a rotating Fibonacci Range Caesar cipher')
  .argument('<file>', 'The file to hide')
  .action(async (filename) => {
    try {

        const normalizedOutfilePath = path.resolve(process.cwd(), 'public', 'content', 'ee', getEncryptedFilename(filename));
        const outFile = Bun.file(normalizedOutfilePath);

        if (outFile.exists()) {
            await rm(normalizedOutfilePath, { force: true });
        }

        const normalizedFilePath = path.resolve(process.cwd(), 'public', 'content', 'ee', filename);
        const file = Bun.file(normalizedFilePath);
        
        if (!file.exists()) {
            log.extend('missing-file-error')('Error: File not found');
            throw new Error('File not found');
        }

        let text = await file.text();
        let encrypted = '';
        const cipher = new CaesarCipher();
        const range = new FibonacciRange().getSequenceBounded();

        for (let i = 0; i < text.length; i++) {
            let rangeIndex = i % range.length;
            let shift = range[rangeIndex];
            encrypted += cipher.encrypt(text[i], shift);
        }

        let encryptedFilePath = path.resolve(process.cwd(), 'public', 'content', 'ee', getEncryptedFilename(filename));

        await Bun.write(encryptedFilePath, encrypted);
        log.extend('hide-success')('Successfully hidden file %s', filename);

    } catch (error) {
        log.extend('hide-error')('Error: %s', error.message);
        process.exit(1);
    }
  });


program
 .command('reveal')
 .description('Reveal a file using a rotating Fibonacci Range Caesar cipher')
 .argument('<file>', 'The file to reveal')
 .action(async (filename) => {
    try {
        const normalizedOutfilePath = path.resolve(process.cwd(), 'public', 'content', 'ee', getCleanFilename(filename));
        const outFile = Bun.file(normalizedOutfilePath);

        if (!outFile.exists()) {
            log.extend('missing-file-error')('Error: File not found');
            throw new Error('File not found');
        }

        const normalizedFilePath = path.resolve(process.cwd(), 'public', 'content', 'ee', filename);
        const file = Bun.file(normalizedFilePath);

        if (!file.exists()) {
            log.extend('missing-file-error')('Error: File not found');
            throw new Error('File not found');
        }

        let text = await file.text();
        let decrypted = '';
        const cipher = new CaesarCipher().setShiftRight();
        const range = new FibonacciRange().getSequenceBounded();
        for (let i = 0; i < text.length; i++) {
            let rangeIndex = i % range.length;
            let shift = range[rangeIndex];
            decrypted += cipher.decrypt(text[i], shift);
        }
        
        console.log(`Decrypted file: ${filename}`);
        console.log(decrypted);


    } catch (error) {
        log.extend('reveal-error')('Error: %s', error.message);
        process.exit(1);
    }
 });

program
  .command('encrypt')
  .description('Encrypt a file using a Caesar cipher')
  .argument('<text>', 'The text to encrypt')
  .argument('<shift>', 'The shift value to encrypt')
  .action((text, shift) => {
    const cipher = new CaesarCipher();
    const encrypted = cipher.encrypt(text, parseInt(shift));
    console.log(`Encrypted text: ${encrypted}`);
  });
  

function getCleanFilename(filename) {
    const ext = path.extname(filename);
    return path.basename(filename, ext);
}

function getEncryptedFilename(filename) {
    return `${getCleanFilename(filename)}.ee.txt`;
}

program.parse();