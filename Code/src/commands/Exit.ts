import { ICommand } from './ICommand';

export class Exit implements ICommand {
  public async execute(): Promise<void> {
    console.log(); // Add new line
    process.exit();
  }
}
