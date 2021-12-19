/**
 * The Command interface declares a method for executing a command.
 */
export interface ICommand {
  execute(): Promise<void>;
}
