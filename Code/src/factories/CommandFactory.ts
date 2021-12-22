import { DisablePasswordAuthentication } from '../commands/DisablePasswordAuthentication';
import { DisableRootLogin } from '../commands/DisableRootLogin';
import { Exit } from '../commands/Exit';
import { ICommand } from '../commands/ICommand';
import { CommandType } from '../enums/CommandType';

/**
 * Allow to create a Command from the Command Type.
 */
export class CommandFactory {
  public static create(type: CommandType): ICommand {
    if (type === CommandType.DisableRootLogin) {
      return new DisableRootLogin();
    } else if (type === CommandType.DisablePasswordAuthentication) {
      return new DisablePasswordAuthentication();
    } else if (type === CommandType.Exit) {
      return new Exit();
    }

    return null;
  }
}
