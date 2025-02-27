import * as assert from 'assert';
import * as sinon from 'sinon';
import appInsights from '../../../../appInsights';
import auth from '../../../../Auth';
import { Cli } from '../../../../cli/Cli';
import { CommandInfo } from '../../../../cli/CommandInfo';
import { Logger } from '../../../../cli/Logger';
import Command, { CommandError } from '../../../../Command';
import request from '../../../../request';
import { pid } from '../../../../utils/pid';
import { session } from '../../../../utils/session';
import { sinonUtil } from '../../../../utils/sinonUtil';
import commands from '../../commands';
const command: Command = require('./list-retentionlabel-ensure');

describe(commands.LIST_RETENTIONLABEL_ENSURE, () => {
  let log: any[];
  let logger: Logger;
  let commandInfo: CommandInfo;

  before(() => {
    sinon.stub(auth, 'restoreAuth').callsFake(() => Promise.resolve());
    sinon.stub(appInsights, 'trackEvent').callsFake(() => { });
    sinon.stub(pid, 'getProcessName').callsFake(() => '');
    sinon.stub(session, 'getId').callsFake(() => '');
    auth.service.connected = true;
    commandInfo = Cli.getCommandInfo(command);
  });

  beforeEach(() => {
    log = [];
    logger = {
      log: (msg: string) => {
        log.push(msg);
      },
      logRaw: (msg: string) => {
        log.push(msg);
      },
      logToStderr: (msg: string) => {
        log.push(msg);
      }
    };
  });

  afterEach(() => {
    sinonUtil.restore([
      request.get,
      request.post
    ]);
  });

  after(() => {
    sinonUtil.restore([
      auth.restoreAuth,
      appInsights.trackEvent,
      pid.getProcessName,
      session.getId
    ]);
    auth.service.connected = false;
  });

  it('has correct name', () => {
    assert.strictEqual(command.name.startsWith(commands.LIST_RETENTIONLABEL_ENSURE), true);
  });

  it('defines correct alias', () => {
    const alias = command.alias();
    assert.strictEqual((alias && alias.indexOf(commands.LIST_LABEL_SET) !== -1), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('should handle error when trying to set label', async () => {
    sinon.stub(request, 'post').callsFake((opts) => {
      if (opts.url === `https://contoso.sharepoint.com/sites/team1/_api/SP_CompliancePolicy_SPPolicyStoreProxy_SetListComplianceTag`) {
        return Promise.reject({
          error: {
            'odata.error': {
              code: '-1, Microsoft.SharePoint.Client.InvalidOperationException',
              message: {
                value: 'Can not find compliance tag with value: abc. SiteSubscriptionId: ea1787c6-7ce2-4e71-be47-5e0deb30f9e4'
              }
            }
          }
        });
      }

      return Promise.reject('Invalid request');
    });

    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://contoso.sharepoint.com/sites/team1/_api/web/lists/getByTitle('MyLibrary')/?$expand=RootFolder&$select=RootFolder`) {
        return Promise.resolve({ "RootFolder": { "Exists": true, "IsWOPIEnabled": false, "ItemCount": 0, "Name": "MyLibrary", "ProgID": null, "ServerRelativeUrl": "/sites/team1/MyLibrary", "TimeCreated": "2019-01-11T10:03:19Z", "TimeLastModified": "2019-01-11T10:03:20Z", "UniqueId": "faaa6af2-0157-4e9a-a352-6165195923c8", "WelcomePage": "" } }
        );
      }

      return Promise.reject('Invalid request');
    });

    await assert.rejects(command.action(logger, {
      options: {
        webUrl: 'https://contoso.sharepoint.com/sites/team1',
        listTitle: 'MyLibrary'
      }
    } as any), new CommandError("Can not find compliance tag with value: abc. SiteSubscriptionId: ea1787c6-7ce2-4e71-be47-5e0deb30f9e4"));
  });

  it('should handle error if list does not exist', async () => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://contoso.sharepoint.com/sites/team1/_api/web/lists/getByTitle('MyLibrary')/?$expand=RootFolder&$select=RootFolder`) {
        return Promise.reject(new Error("404 - \"404 FILE NOT FOUND\""));
      }

      return Promise.reject('Invalid request');
    });

    await assert.rejects(command.action(logger, {
      options: {
        debug: true,
        webUrl: 'https://contoso.sharepoint.com/sites/team1',
        listTitle: 'MyLibrary',
        name: 'abc'
      }
    } as any), new CommandError('404 - "404 FILE NOT FOUND"'));
  });

  it('should set label for list with deprecated label', async () => {
    const postStub = sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`https://contoso.sharepoint.com/sites/team1/_api/SP_CompliancePolicy_SPPolicyStoreProxy_SetListComplianceTag`) > -1) {
        return Promise.resolve();
      }

      return Promise.reject('Invalid request');
    });

    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://contoso.sharepoint.com/sites/team1/_api/web/lists/getByTitle('MyLibrary')/?$expand=RootFolder&$select=RootFolder`) {
        return Promise.resolve({ "RootFolder": { "Exists": true, "IsWOPIEnabled": false, "ItemCount": 0, "Name": "MyLibrary", "ProgID": null, "ServerRelativeUrl": "/sites/team1/MyLibrary", "TimeCreated": "2019-01-11T10:03:19Z", "TimeLastModified": "2019-01-11T10:03:20Z", "UniqueId": "faaa6af2-0157-4e9a-a352-6165195923c8", "WelcomePage": "" } }
        );
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, {
      options: {
        debug: true,
        webUrl: 'https://contoso.sharepoint.com/sites/team1',
        listTitle: 'MyLibrary',
        label: 'abc'
      }
    });
    const lastCall = postStub.lastCall.args[0];
    assert.strictEqual(lastCall.data.listUrl, 'https://contoso.sharepoint.com/sites/team1/MyLibrary');
    assert.strictEqual(lastCall.data.complianceTagValue, 'abc');
    assert.strictEqual(lastCall.data.blockDelete, false);
    assert.strictEqual(lastCall.data.blockEdit, false);
    assert.strictEqual(lastCall.data.syncToItems, false);
  });

  it('should set label for list (debug)', async () => {
    const postStub = sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`https://contoso.sharepoint.com/sites/team1/_api/SP_CompliancePolicy_SPPolicyStoreProxy_SetListComplianceTag`) > -1) {
        return Promise.resolve();
      }

      return Promise.reject('Invalid request');
    });

    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://contoso.sharepoint.com/sites/team1/_api/web/lists/getByTitle('MyLibrary')/?$expand=RootFolder&$select=RootFolder`) {
        return Promise.resolve({ "RootFolder": { "Exists": true, "IsWOPIEnabled": false, "ItemCount": 0, "Name": "MyLibrary", "ProgID": null, "ServerRelativeUrl": "/sites/team1/MyLibrary", "TimeCreated": "2019-01-11T10:03:19Z", "TimeLastModified": "2019-01-11T10:03:20Z", "UniqueId": "faaa6af2-0157-4e9a-a352-6165195923c8", "WelcomePage": "" } }
        );
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, {
      options: {
        debug: true,
        webUrl: 'https://contoso.sharepoint.com/sites/team1',
        listTitle: 'MyLibrary',
        name: 'abc'
      }
    });
    const lastCall = postStub.lastCall.args[0];
    assert.strictEqual(lastCall.data.listUrl, 'https://contoso.sharepoint.com/sites/team1/MyLibrary');
    assert.strictEqual(lastCall.data.complianceTagValue, 'abc');
    assert.strictEqual(lastCall.data.blockDelete, false);
    assert.strictEqual(lastCall.data.blockEdit, false);
    assert.strictEqual(lastCall.data.syncToItems, false);
  });

  it('should set label for list using listId (debug)', async () => {
    const postStub = sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`https://contoso.sharepoint.com/sites/team1/_api/SP_CompliancePolicy_SPPolicyStoreProxy_SetListComplianceTag`) > -1) {
        return Promise.resolve();
      }

      return Promise.reject('Invalid request');
    });

    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://contoso.sharepoint.com/sites/team1/_api/web/lists(guid'4d535433-2a7b-40b0-9dad-8f0f8f3b3841')/?$expand=RootFolder&$select=RootFolder`) {
        return Promise.resolve({ "RootFolder": { "Exists": true, "IsWOPIEnabled": false, "ItemCount": 0, "Name": "MyLibrary", "ProgID": null, "ServerRelativeUrl": "/sites/team1/MyLibrary", "TimeCreated": "2019-01-11T10:03:19Z", "TimeLastModified": "2019-01-11T10:03:20Z", "UniqueId": "faaa6af2-0157-4e9a-a352-6165195923c8", "WelcomePage": "" } }
        );
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, {
      options: {
        webUrl: 'https://contoso.sharepoint.com/sites/team1',
        listId: '4d535433-2a7b-40b0-9dad-8f0f8f3b3841',
        name: 'abc'
      }
    });
    const lastCall = postStub.lastCall.args[0];
    assert.strictEqual(lastCall.data.listUrl, 'https://contoso.sharepoint.com/sites/team1/MyLibrary');
    assert.strictEqual(lastCall.data.complianceTagValue, 'abc');
    assert.strictEqual(lastCall.data.blockDelete, false);
    assert.strictEqual(lastCall.data.blockEdit, false);
    assert.strictEqual(lastCall.data.syncToItems, false);
  });

  it('should set label for list using blockDelete,blockEdit,syncToItems options', async () => {
    const postStub = sinon.stub(request, 'post').callsFake((opts) => {
      if ((opts.url as string).indexOf(`https://contoso.sharepoint.com/sites/team1/_api/SP_CompliancePolicy_SPPolicyStoreProxy_SetListComplianceTag`) > -1) {
        return Promise.resolve();
      }

      return Promise.reject('Invalid request');
    });

    await command.action(logger, {
      options: {
        webUrl: 'https://contoso.sharepoint.com/sites/team1',
        listUrl: 'MyLibrary',
        name: 'abc',
        blockDelete: true,
        blockEdit: true,
        syncToItems: true
      }
    });
    const lastCall = postStub.lastCall.args[0];
    assert.strictEqual(lastCall.data.listUrl, 'https://contoso.sharepoint.com/sites/team1/MyLibrary');
    assert.strictEqual(lastCall.data.complianceTagValue, 'abc');
    assert.strictEqual(lastCall.data.blockDelete, true);
    assert.strictEqual(lastCall.data.blockEdit, true);
    assert.strictEqual(lastCall.data.syncToItems, true);
  });

  it('fails validation if the url option is not a valid SharePoint site URL', async () => {
    const actual = await command.validate({ options: { webUrl: 'foo', listId: 'cc27a922-8224-4296-90a5-ebbc54da2e85' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the url option is a valid SharePoint site URL', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', name: 'abc', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the listid option is not a valid GUID', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', name: 'abc', listId: 'XXXXX' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the listid option is a valid GUID', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', name: 'abc', listId: 'cc27a922-8224-4296-90a5-ebbc54da2e85' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if listId, listUrl and listTitle options are not passed', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', name: 'abc' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });
});