import { ICommand } from './commands/ICommand';
import { CommandType } from './enums/CommandType';
import { CommandFactory } from './factories/CommandFactory';

const term = require('terminal-kit').terminal;

//  'b. Enable SSH key authentication only',
//  'c. Enable firewall',
//  'd. Add firewall rule',
const items = ['a. Disable root login', 'b. Disable password authentication', 'c. Exit'];
const itemsCommands = [CommandType.DisableRootLogin, CommandType.DisablePasswordAuthentication, CommandType.Exit];

if (require.main === module) {
  main();
}

function main() {
  showMenu();
}

function showMenu() {
  console.clear();

  term.cyan('Terminal Secure SSH Server.\n');
  term.cyan('Program to make ssh more secure on ubuntu/pop-os/debian server.\n');
  term.cyan('Use the arrow to browse the menu.\n');

  term.singleColumnMenu(items, function (error: any, response: any) {
    const commandType = itemsCommands[response.selectedIndex];
    const command = CommandFactory.create(commandType);

    // Execute command
    executor(command);
  });
}

async function executor(cmd: ICommand) {
  term('\n').eraseLineAfter.white('Do you want to continue? [Y|n] ');

  // Wait for a yes no response
  // Exit on y and ENTER key
  // Abort on n
  term.yesOrNo({ yes: ['y', 'ENTER'], no: ['n'] }, async function (error: any, result: any) {
    term('\n');

    if (result) {
      // Execute command
      await cmd.execute();

      term('\n').eraseLineAfter.white('Press Enter to Continue');

      // Wait for Enter key
      term.inputField(function (error: any, result: any) {
        showMenu();
      });
    } else {
      showMenu();
    }
  });
}
