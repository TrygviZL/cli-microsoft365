import * as assert from 'assert';
import * as sinon from 'sinon';
import { telemetry } from '../../../../telemetry';
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
const command: Command = require('./chat-member-list');

describe(commands.CHAT_MEMBER_LIST, () => {
  let log: string[];
  let logger: Logger;
  let loggerLogSpy: sinon.SinonSpy;
  let commandInfo: CommandInfo;

  before(() => {
    sinon.stub(auth, 'restoreAuth').callsFake(() => Promise.resolve());
    sinon.stub(telemetry, 'trackEvent').callsFake(() => { });
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
    loggerLogSpy = sinon.spy(logger, 'log');
  });

  afterEach(() => {
    sinonUtil.restore([
      request.get
    ]);
  });

  after(() => {
    sinonUtil.restore([
      auth.restoreAuth,
      telemetry.trackEvent,
      pid.getProcessName,
      session.getId
    ]);
    auth.service.connected = false;
  });

  it('has correct name', () => {
    assert.strictEqual(command.name.startsWith(commands.CHAT_MEMBER_LIST), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('defines correct properties for the default output', () => {
    assert.deepStrictEqual(command.defaultProperties(), ['userId', 'displayName', 'email']);
  });

  it('fails validation if chatId is not specified', async () => {
    const actual = await command.validate({
      options: {
      }
    }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if the chatId is not valid', async () => {
    const actual = await command.validate({
      options: {
        chatId: "8b081ef6"
      }
    }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation for an incorrect chatId missing leading 19:.', async () => {
    const actual = await command.validate({
      options: {
        chatId: '8b081ef6-4792-4def-b2c9-c363a1bf41d5_5031bb31-22c0-4f6f-9f73-91d34ab2b32d@unq.gbl.spaces'
      }
    }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation for an incorrect chatId missing trailing @thread.v2 or @unq.gbl.spaces', async () => {
    const actual = await command.validate({
      options: {
        chatId: '19:8b081ef6-4792-4def-b2c9-c363a1bf41d5_5031bb31-22c0-4f6f-9f73-91d34ab2b32d'
      }
    }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('validates for a correct input', async () => {
    const actual = await command.validate({
      options: {
        chatId: "19:8b081ef6-4792-4def-b2c9-c363a1bf41d5_5031bb31-22c0-4f6f-9f73-91d34ab2b32d@unq.gbl.spaces"
      }
    }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('lists chat members (debug)', async () => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/chats/19:8b081ef6-4792-4def-b2c9-c363a1bf41d5_5031bb31-22c0-4f6f-9f73-91d34ab2b32d@unq.gbl.spaces/members`) {
        return Promise.resolve({
          "value": [{ "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "8b081ef6-4792-4def-b2c9-c363a1bf41d5", "roles": ["owner"], "displayName": "John Doe", "userId": "8b081ef6-4792-4def-b2c9-c363a1bf41d5", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z" }, { "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "2de87aaf-844d-4def-9dee-2c317f0be1b3", "roles": ["owner"], "displayName": "Bart Hogan", "userId": "2de87aaf-844d-4def-9dee-2c317f0be1b3", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "0001-01-01T00:00:00Z" }, { "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "07ad17ad-ada5-4f1f-a650-7a963886a8a7", "roles": ["owner"], "displayName": "Minna Pham", "userId": "07ad17ad-ada5-4f1f-a650-7a963886a8a7", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z" }]
        });
      }

      return Promise.reject('Invalid Request');
    });

    await command.action(logger, {
      options: {
        debug: true,
        chatId: "19:8b081ef6-4792-4def-b2c9-c363a1bf41d5_5031bb31-22c0-4f6f-9f73-91d34ab2b32d@unq.gbl.spaces"
      }
    });
    assert(loggerLogSpy.calledWith([
      {
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        "id": "8b081ef6-4792-4def-b2c9-c363a1bf41d5",
        "roles": [
          "owner"
        ],
        "displayName": "John Doe",
        "userId": "8b081ef6-4792-4def-b2c9-c363a1bf41d5",
        "email": null,
        "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb",
        "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z"
      },
      {
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        "id": "2de87aaf-844d-4def-9dee-2c317f0be1b3",
        "roles": [
          "owner"
        ],
        "displayName": "Bart Hogan",
        "userId": "2de87aaf-844d-4def-9dee-2c317f0be1b3",
        "email": null,
        "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb",
        "visibleHistoryStartDateTime": "0001-01-01T00:00:00Z"
      },
      {
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        "id": "07ad17ad-ada5-4f1f-a650-7a963886a8a7",
        "roles": [
          "owner"
        ],
        "displayName": "Minna Pham",
        "userId": "07ad17ad-ada5-4f1f-a650-7a963886a8a7",
        "email": null,
        "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb",
        "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z"
      }
    ]));
  });

  it('lists chat members', async () => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/chats/19:8b081ef6-4792-4def-b2c9-c363a1bf41d5_5031bb31-22c0-4f6f-9f73-91d34ab2b32d@unq.gbl.spaces/members`) {
        return Promise.resolve({
          "value": [{ "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "8b081ef6-4792-4def-b2c9-c363a1bf41d5", "roles": ["owner"], "displayName": "John Doe", "userId": "8b081ef6-4792-4def-b2c9-c363a1bf41d5", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z" }, { "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "2de87aaf-844d-4def-9dee-2c317f0be1b3", "roles": ["owner"], "displayName": "Bart Hogan", "userId": "2de87aaf-844d-4def-9dee-2c317f0be1b3", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "0001-01-01T00:00:00Z" }, { "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "07ad17ad-ada5-4f1f-a650-7a963886a8a7", "roles": ["owner"], "displayName": "Minna Pham", "userId": "07ad17ad-ada5-4f1f-a650-7a963886a8a7", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z" }]
        });
      }

      return Promise.reject('Invalid Request');
    });

    await command.action(logger, {
      options: {
        chatId: "19:8b081ef6-4792-4def-b2c9-c363a1bf41d5_5031bb31-22c0-4f6f-9f73-91d34ab2b32d@unq.gbl.spaces"
      }
    });
    assert(loggerLogSpy.calledWith([
      {
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        "id": "8b081ef6-4792-4def-b2c9-c363a1bf41d5",
        "roles": [
          "owner"
        ],
        "displayName": "John Doe",
        "userId": "8b081ef6-4792-4def-b2c9-c363a1bf41d5",
        "email": null,
        "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb",
        "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z"
      },
      {
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        "id": "2de87aaf-844d-4def-9dee-2c317f0be1b3",
        "roles": [
          "owner"
        ],
        "displayName": "Bart Hogan",
        "userId": "2de87aaf-844d-4def-9dee-2c317f0be1b3",
        "email": null,
        "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb",
        "visibleHistoryStartDateTime": "0001-01-01T00:00:00Z"
      },
      {
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        "id": "07ad17ad-ada5-4f1f-a650-7a963886a8a7",
        "roles": [
          "owner"
        ],
        "displayName": "Minna Pham",
        "userId": "07ad17ad-ada5-4f1f-a650-7a963886a8a7",
        "email": null,
        "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb",
        "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z"
      }
    ]));
  });

  it('outputs all data in json output mode', async () => {
    sinon.stub(request, 'get').callsFake((opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/chats/19:8b081ef6-4792-4def-b2c9-c363a1bf41d5_5031bb31-22c0-4f6f-9f73-91d34ab2b32d@unq.gbl.spaces/members`) {
        return Promise.resolve({
          "value": [{ "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "8b081ef6-4792-4def-b2c9-c363a1bf41d5", "roles": ["owner"], "displayName": "John Doe", "userId": "8b081ef6-4792-4def-b2c9-c363a1bf41d5", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z" }, { "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "2de87aaf-844d-4def-9dee-2c317f0be1b3", "roles": ["owner"], "displayName": "Bart Hogan", "userId": "2de87aaf-844d-4def-9dee-2c317f0be1b3", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "0001-01-01T00:00:00Z" }, { "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "07ad17ad-ada5-4f1f-a650-7a963886a8a7", "roles": ["owner"], "displayName": "Minna Pham", "userId": "07ad17ad-ada5-4f1f-a650-7a963886a8a7", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z" }]
        });
      }

      return Promise.reject('Invalid Request');
    });

    await command.action(logger, {
      options: {
        output: 'json',
        chatId: "19:8b081ef6-4792-4def-b2c9-c363a1bf41d5_5031bb31-22c0-4f6f-9f73-91d34ab2b32d@unq.gbl.spaces"
      }
    });
    assert(loggerLogSpy.calledWith([{ "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "8b081ef6-4792-4def-b2c9-c363a1bf41d5", "roles": ["owner"], "displayName": "John Doe", "userId": "8b081ef6-4792-4def-b2c9-c363a1bf41d5", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z" }, { "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "2de87aaf-844d-4def-9dee-2c317f0be1b3", "roles": ["owner"], "displayName": "Bart Hogan", "userId": "2de87aaf-844d-4def-9dee-2c317f0be1b3", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "0001-01-01T00:00:00Z" }, { "@odata.type": "#microsoft.graph.aadUserConversationMember", "id": "07ad17ad-ada5-4f1f-a650-7a963886a8a7", "roles": ["owner"], "displayName": "Minna Pham", "userId": "07ad17ad-ada5-4f1f-a650-7a963886a8a7", "email": null, "tenantId": "6e5147da-6a35-4275-b3f3-fc069456b6eb", "visibleHistoryStartDateTime": "2019-04-18T23:51:43.255Z" }]));
  });

  it('correctly handles error when listing members', async () => {
    sinon.stub(request, 'get').callsFake(() => {
      return Promise.reject('An error has occurred');
    });

    await assert.rejects(command.action(logger, {
      options: {
        chatId: "19:8b081ef6-4792-4def-b2c9-c363a1bf41d5_5031bb31-22c0-4f6f-9f73-91d34ab2b32d@unq.gbl.spaces"
      }
    } as any), new CommandError('An error has occurred'));
  });
});
