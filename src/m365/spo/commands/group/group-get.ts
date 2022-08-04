import { AxiosRequestConfig } from 'axios';
import { Logger } from '../../../../cli';
import {
  CommandOption
} from '../../../../Command';
import GlobalOptions from '../../../../GlobalOptions';
import request from '../../../../request';
import { validation } from '../../../../utils';
import SpoCommand from '../../../base/SpoCommand';
import commands from '../../commands';

interface CommandArgs {
  options: Options;
}

interface Options extends GlobalOptions {
  webUrl: string;
  id?: number;
  name?: string;
  associatedGroup?: string;
}

class SpoGroupGetCommand extends SpoCommand {
  public get name(): string {
    return commands.GROUP_GET;
  }

  public get description(): string {
    return 'Gets site group';
  }

  public getTelemetryProperties(args: CommandArgs): any {
    const telemetryProps: any = super.getTelemetryProperties(args);
    telemetryProps.id = (!(!args.options.id)).toString();
    telemetryProps.name = (!(!args.options.name)).toString();
    telemetryProps.associatedGroup = args.options.associatedGroup;
    return telemetryProps;
  }

  public commandAction(logger: Logger, args: CommandArgs, cb: () => void): void {
    if (this.verbose) {
      logger.logToStderr(`Retrieving information for group in site at ${args.options.webUrl}...`);
    }

    let requestUrl: string = '';

    if (args.options.id) {
      requestUrl = `${args.options.webUrl}/_api/web/sitegroups/GetById('${encodeURIComponent(args.options.id)}')`;
    }
    else if (args.options.name) {
      requestUrl = `${args.options.webUrl}/_api/web/sitegroups/GetByName('${encodeURIComponent(args.options.name as string)}')`;
    } 
    else if (args.options.associatedGroup) {
      switch (args.options.associatedGroup.toLowerCase()) {
        case 'owner':
          requestUrl = `${args.options.webUrl}/_api/web/AssociatedOwnerGroup`;
          break;
        case 'member':
          requestUrl = `${args.options.webUrl}/_api/web/AssociatedMemberGroup`;
          break;
        case 'visitor':
          requestUrl = `${args.options.webUrl}/_api/web/AssociatedVisitorGroup`;
          break;
      }
    }

    const requestOptions: AxiosRequestConfig = {
      url: requestUrl,
      method: 'GET',
      headers: {
        'accept': 'application/json;odata=nometadata'
      },
      responseType: 'json'
    };

    request
      .get(requestOptions)
      .then((groupInstance): void => {
        logger.log(groupInstance);

        cb();
      }, (err: any): void => this.handleRejectedODataJsonPromise(err, logger, cb));
  }

  public options(): CommandOption[] {
    const options: CommandOption[] = [
      {
        option: '-u, --webUrl <webUrl>'
      },
      {
        option: '-i, --id [id]'
      },
      {
        option: '--name [name]'
      },
      {
        option: '--associatedGroup [associatedGroup]',
        autocomplete: ['Owner', 'Member', 'Visitor']
      }
    ];

    const parentOptions: CommandOption[] = super.options();
    return options.concat(parentOptions);
  }

  public optionSets(): string[][] | undefined {
    return [
      ['id', 'name', 'associatedGroup']
    ];
  }

  public validate(args: CommandArgs): boolean | string {
    if (args.options.id && isNaN(args.options.id)) {
      return `Specified id ${args.options.id} is not a number`;
    }

    if (args.options.associatedGroup && ['owner', 'member', 'visitor'].indexOf(args.options.associatedGroup.toLowerCase()) === -1) {
      return `${args.options.associatedGroup} is not a valid associatedGroup value. Allowed values are Owner|Member|Visitor.`;
    }

    return validation.isValidSharePointUrl(args.options.webUrl);
  }
}

module.exports = new SpoGroupGetCommand();
