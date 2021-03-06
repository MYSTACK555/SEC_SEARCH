import { Config } from '../configs/Config';
import { ICommand } from './ICommand';

const fs = require('fs');
const term = require('terminal-kit').terminal;
const config: Config = require('../config.json');

export class DisablePasswordAuthentication implements ICommand {
  readonly sshd_config_file = config.linuxSystemPath + 'etc/ssh/sshd_config';

  public async execute(): Promise<void> {
    // If backup created
    if (await this.createSshdBackup()) {
      await this.editPasswordAuthenticationInSshd();
    }

    return Promise.resolve();
  }

  private createSshdBackup(): Promise<Boolean> {
    term('\n').eraseLineAfter.white('Creating sshd_config backup...');

    return new Promise<Boolean>((resolve, reject) => {
      // Create sshd_config backup
      fs.copyFile(this.sshd_config_file, `${this.sshd_config_file}_${new Date().valueOf()}.bak`, (error: any) => {
        if (error) {
          term.red(' Failed');
          resolve(false);
        }

        term.green(' Done');
        resolve(true);
      });
    });
  }

  private editPasswordAuthenticationInSshd(): Promise<void> {
    const self = this;
    const lineToAdd = 'PasswordAuthentication no';

    term('\n').eraseLineAfter.white('Editing sshd_config...');

    return new Promise<void>((resolve, reject) => {
      fs.readFile(this.sshd_config_file, 'utf8', async function (error: any, data: any) {
        if (error) {
          term.red(' Failed');
          reject(error);
        }

        const re = new RegExp('^(|.)PasswordAuthentication.*$', 'gm');

        // If PasswordAuthentication not found in file
        if (data.match(re) == null) {
          // Add new PasswordAuthentication line
          fs.appendFile(self.sshd_config_file, lineToAdd + '\r\n', async function (error: any) {
            if (error) {
              term.red(' Failed');
              reject(error);
            }

            term.green(' Done');
            resolve();
          });
        } else {
          // Replace PasswordAuthentication with PasswordAuthentication no
          const result = data.replace(re, lineToAdd);

          // Replace PasswordAuthentication to PasswordAuthentication no
          fs.writeFile(self.sshd_config_file, result, 'utf8', async function (error: any) {
            if (error) {
              term.red(' Failed');
              reject(error);
            }

            term.green(' Done');
            resolve();
          });
        }
      });
    });
  }
}
