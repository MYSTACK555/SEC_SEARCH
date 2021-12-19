import { Config } from '../configs/Config';
import { ICommand } from './ICommand';

const fs = require('fs');
const term = require('terminal-kit').terminal;
const config: Config = require('../config.json');

export class DisableRootLogin implements ICommand {
  readonly sshd_config_file = config.linuxSystemPath + 'etc/ssh/sshd_config';

  public async execute(): Promise<void> {
    // If backup created
    if (await this.createSshdBackup()) {
      await this.editPermitRootLoginInSshd();
    }

    return Promise.resolve();
  }

  private createSshdBackup(): Promise<Boolean> {
    term('\n').eraseLineAfter.white('Creating sshd_config backup...');

    return new Promise<Boolean>((resolve, reject) => {
      // Create sshd_config backup
      fs.copyFile(this.sshd_config_file, `${this.sshd_config_file}.bak`, (error: any) => {
        if (error) {
          term.red(' Failed');
          resolve(false);
        }

        term.green(' Done');
        resolve(true);
      });
    });
  }

  private editPermitRootLoginInSshd(): Promise<void> {
    const self = this;

    term('\n').eraseLineAfter.white('Editing sshd_config...');

    return new Promise<void>((resolve, reject) => {
      fs.readFile(this.sshd_config_file, 'utf8', async function (error: any, data: any) {
        if (error) {
          term.red(' Failed');
          reject(error);
        }

        const re = new RegExp('^(|.)PermitRootLogin.*$', 'gm');
        // Replace PermitRootLogin with PermitRootLogin no
        const result = data.replace(re, 'PermitRootLogin no');

        fs.writeFile(self.sshd_config_file, result, 'utf8', async function (error: any) {
          if (error) {
            term.red(' Failed');
            reject(error);
          }

          term.green(' Done');
          resolve();
        });
      });
    });
  }
}
