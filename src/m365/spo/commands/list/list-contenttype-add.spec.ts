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
const command: Command = require('./list-contenttype-add');

describe(commands.LIST_CONTENTTYPE_ADD, () => {
  const response = {
    "Description": "Create a new folder.",
    "DisplayFormTemplateName": "ListForm",
    "DisplayFormUrl": "",
    "DocumentTemplate": "",
    "DocumentTemplateUrl": "",
    "EditFormTemplateName": "ListForm",
    "EditFormUrl": "",
    "Group": "Folder Content Types",
    "Hidden": false,
    "Id": {
      "StringValue": "0x0120000EAD53EDAD7C6647B0D976EEC953F99E"
    },
    "JSLink": "",
    "MobileDisplayFormUrl": "",
    "MobileEditFormUrl": "",
    "MobileNewFormUrl": "",
    "Name": "Folder",
    "NewFormTemplateName": "ListForm",
    "NewFormUrl": "",
    "ReadOnly": false,
    "SchemaXml": "<ContentType ID=\"0x0120000EAD53EDAD7C6647B0D976EEC953F99E\" Name=\"Folder\" Group=\"Folder Content Types\" Description=\"Create a new folder.\" Sealed=\"TRUE\" Version=\"0\" DelayActivateTemplateBinding=\"GROUP,SPSPERS,SITEPAGEPUBLISHING\" FeatureId=\"{695b6570-a48b-4a8e-8ea5-26ea7fc1d162}\"><Fields><Field ID=\"{c042a256-787d-4a6f-8a8a-cf6ab767f12d}\" Type=\"Computed\" DisplayName=\"Content Type\" Name=\"ContentType\" DisplaceOnUpgrade=\"TRUE\" RenderXMLUsingPattern=\"TRUE\" Sortable=\"FALSE\" SourceID=\"http://schemas.microsoft.com/sharepoint/v3\" StaticName=\"ContentType\" Group=\"_Hidden\" PITarget=\"MicrosoftWindowsSharePointServices\" PIAttribute=\"ContentTypeID\" FromBaseType=\"TRUE\"><FieldRefs><FieldRef Name=\"ContentTypeId\"/></FieldRefs><DisplayPattern><MapToContentType><Column Name=\"ContentTypeId\"/></MapToContentType></DisplayPattern></Field><Field ID=\"{fa564e0f-0c70-4ab9-b863-0177e6ddd247}\" Type=\"Text\" Name=\"Title\" ShowInNewForm=\"FALSE\" ShowInFileDlg=\"FALSE\" DisplayName=\"Title\" Sealed=\"TRUE\" SourceID=\"http://schemas.microsoft.com/sharepoint/v3\" StaticName=\"Title\" ColName=\"nvarchar8\" Required=\"FALSE\" Hidden=\"TRUE\"/><Field ID=\"{8553196d-ec8d-4564-9861-3dbe931050c8}\" ShowInFileDlg=\"FALSE\" ShowInVersionHistory=\"FALSE\" Type=\"File\" Name=\"FileLeafRef\" DisplayName=\"Name\" AuthoringInfo=\"(for use in forms)\" List=\"Docs\" FieldRef=\"ID\" ShowField=\"LeafName\" JoinColName=\"DoclibRowId\" JoinRowOrdinal=\"0\" JoinType=\"INNER\" Required=\"TRUE\" NoCustomize=\"TRUE\" SourceID=\"http://schemas.microsoft.com/sharepoint/v3\" StaticName=\"FileLeafRef\" FromBaseType=\"TRUE\" Hidden=\"FALSE\"/><Field ID=\"{b824e17e-a1b3-426e-aecf-f0184d900485}\" Name=\"ItemChildCount\" DisplaceOnUpgrade=\"TRUE\" ReadOnly=\"TRUE\" ShowInFileDlg=\"FALSE\" Type=\"Lookup\" DisplayName=\"Item Child Count\" List=\"Docs\" FieldRef=\"ID\" ShowField=\"ItemChildCount\" JoinColName=\"DoclibRowId\" JoinRowOrdinal=\"0\" JoinType=\"INNER\" SourceID=\"http://schemas.microsoft.com/sharepoint/v3\" StaticName=\"ItemChildCount\" FromBaseType=\"TRUE\"/><Field ID=\"{960ff01f-2b6d-4f1b-9c3f-e19ad8927341}\" Name=\"FolderChildCount\" DisplaceOnUpgrade=\"TRUE\" ReadOnly=\"TRUE\" ShowInFileDlg=\"FALSE\" Type=\"Lookup\" DisplayName=\"Folder Child Count\" List=\"Docs\" FieldRef=\"ID\" ShowField=\"FolderChildCount\" JoinColName=\"DoclibRowId\" JoinRowOrdinal=\"0\" JoinType=\"INNER\" SourceID=\"http://schemas.microsoft.com/sharepoint/v3\" StaticName=\"FolderChildCount\" FromBaseType=\"TRUE\"/></Fields><XmlDocuments><XmlDocument NamespaceURI=\"http://schemas.microsoft.com/sharepoint/v3/contenttype/forms\"><FormTemplates xmlns=\"http://schemas.microsoft.com/sharepoint/v3/contenttype/forms\"><Display>ListForm</Display><Edit>ListForm</Edit><New>ListForm</New></FormTemplates></XmlDocument></XmlDocuments></ContentType>",
    "Scope": "/Shared Documents",
    "Sealed": true,
    "StringId": "0x0120000EAD53EDAD7C6647B0D976EEC953F99E"
  };

  let log: any[];
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
      request.post
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
    assert.strictEqual(command.name.startsWith(commands.LIST_CONTENTTYPE_ADD), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('adds content type to the specific list if listTitle option is passed (debug)', async () => {
    sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === `https://contoso.sharepoint.com/sites/dummy/_api/web/lists/getByTitle('Documents')/ContentTypes/AddAvailableContentType`) {
        if (opts.headers &&
          opts.headers.accept &&
          (opts.headers.accept as string).indexOf('application/json') === 0 &&
          JSON.stringify(opts.data) === JSON.stringify({
            contentTypeId: '0x0120'
          })) {
          return response;
        }
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        debug: true,
        listTitle: 'Documents',
        webUrl: 'https://contoso.sharepoint.com/sites/dummy',
        id: '0x0120'
      }
    });
    assert(loggerLogSpy.calledWith(response));
  });

  it('adds content type to the specific list if listTitle option is passed', async () => {
    sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === `https://contoso.sharepoint.com/sites/dummy/_api/web/lists/getByTitle('Documents')/ContentTypes/AddAvailableContentType`) {
        if (opts.headers &&
          opts.headers.accept &&
          (opts.headers.accept as string).indexOf('application/json') === 0 &&
          JSON.stringify(opts.data) === JSON.stringify({
            contentTypeId: '0x0120'
          })) {
          return response;
        }
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        listTitle: 'Documents',
        webUrl: 'https://contoso.sharepoint.com/sites/dummy',
        id: '0x0120'
      }
    });
    assert(loggerLogSpy.calledWith(response));
  });

  it('adds content type to the specific list if listId option is passed (debug)', async () => {
    sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === `https://contoso.sharepoint.com/sites/dummy/_api/web/lists(guid'dfddade1-4729-428d-881e-7fedf3cae50d')/ContentTypes/AddAvailableContentType`) {
        if (opts.headers &&
          opts.headers.accept &&
          (opts.headers.accept as string).indexOf('application/json') === 0 &&
          JSON.stringify(opts.data) === JSON.stringify({
            contentTypeId: '0x0120'
          })) {
          return response;
        }
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        debug: true,
        listId: 'dfddade1-4729-428d-881e-7fedf3cae50d',
        webUrl: 'https://contoso.sharepoint.com/sites/dummy',
        id: '0x0120'
      }
    });
    assert(loggerLogSpy.calledWith(response));
  });

  it('adds content type to the specific list if listId option is passed', async () => {
    sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === `https://contoso.sharepoint.com/sites/dummy/_api/web/lists(guid'dfddade1-4729-428d-881e-7fedf3cae50d')/ContentTypes/AddAvailableContentType`) {
        if (opts.headers &&
          opts.headers.accept &&
          (opts.headers.accept as string).indexOf('application/json') === 0 &&
          JSON.stringify(opts.data) === JSON.stringify({
            contentTypeId: '0x0120'
          })) {
          return response;
        }
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        listId: 'dfddade1-4729-428d-881e-7fedf3cae50d',
        webUrl: 'https://contoso.sharepoint.com/sites/dummy',
        id: '0x0120'
      }
    });
    assert(loggerLogSpy.calledWith(response));
  });

  it('command correctly handles list get reject request', async () => {
    const err = 'list retrieve error';
    sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === `https://contoso.sharepoint.com/_api/web/lists/getByTitle('Documents')/ContentTypes/AddAvailableContentType`) {
        throw err;
      }

      throw 'Invalid request';
    });

    await assert.rejects(command.action(logger, {
      options: {
        debug: true,
        listTitle: 'Documents',
        webUrl: 'https://contoso.sharepoint.com',
        id: '0x0120'
      }
    }), new CommandError(err));
  });

  it('uses correct API url when listTitle option is passed', async () => {
    sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === `https://contoso.sharepoint.com/_api/web/lists/getByTitle('Documents')/ContentTypes/AddAvailableContentType`) {
        return response;
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        listTitle: 'Documents',
        webUrl: 'https://contoso.sharepoint.com',
        id: '0x0120'
      }
    });
    assert(loggerLogSpy.calledWith(response));
  });

  it('uses correct API url when listId option is passed', async () => {
    sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === `https://contoso.sharepoint.com/_api/web/lists(guid'dfddade1-4729-428d-881e-7fedf3cae50d')/ContentTypes/AddAvailableContentType`) {
        return response;
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        listId: 'dfddade1-4729-428d-881e-7fedf3cae50d',
        webUrl: 'https://contoso.sharepoint.com',
        contentTypeId: '0x0120'
      }
    });
    assert(loggerLogSpy.calledWith(response));
  });

  it('adds contenttype to list when list url is used', async () => {
    sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/_api/web/GetList(\'%2Fsites%2Fdocuments\')/ContentTypes/AddAvailableContentType') {
        return response;
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        webUrl: 'https://contoso.sharepoint.com',
        listUrl: 'sites/documents',
        id: '0x0120'
      }
    });
    assert(loggerLogSpy.calledWith(response));
  });

  it('adds contenttype to list when list url is used (debug)', async () => {
    sinon.stub(request, 'post').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/_api/web/GetList(\'%2Fsites%2Fdocuments\')/ContentTypes/AddAvailableContentType') {
        return response;
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        debug: true,
        webUrl: 'https://contoso.sharepoint.com',
        listUrl: 'sites/documents',
        contentTypeId: '0x0120'
      }
    });
    assert(loggerLogSpy.calledWith(response));
  });

  it('fails validation if both listId and listTitle options are not passed', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', id: '0x0120' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if the webUrl option is not a valid SharePoint site URL', async () => {
    const actual = await command.validate({ options: { webUrl: 'foo', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', id: '0x0120' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the webUrl option is a valid SharePoint site URL', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', id: '0x0120' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if the listId option is not a valid GUID', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '12345', id: '0x0120' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if the listId option is a valid GUID', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', id: '0x0120' } }, commandInfo);
    assert(actual);
  });

  it('passes validation if the listTitle option is passed', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listTitle: 'Documents', id: '0x0120' } }, commandInfo);
    assert(actual);
  });

  it('fails validation if both listId and listTitle options are passed', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', listTitle: 'Documents', id: '0x0120' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if the contentTypeId option is not passed', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', listTitle: 'Documents' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if listId and listUrl are specified', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listId: '0CD891EF-AFCE-4E55-B836-FCE03286CCCF', listUrl: '/sites/Documents' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if listTitle and listUrl are specified', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com', listTitle: 'Documents', listUrl: '/sites/Documents' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation neither listTitle nor listId or listUrl is specified', async () => {
    const actual = await command.validate({ options: { webUrl: 'https://contoso.sharepoint.com' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('configures command types', () => {
    assert.notStrictEqual(typeof command.types, 'undefined', 'command types undefined');
    assert.notStrictEqual(command.types.string, 'undefined', 'command string types undefined');
  });

  it('configures content type ID as string option', () => {
    const types = command.types;
    ['i', 'id'].forEach(o => {
      assert.notStrictEqual((types.string as string[]).indexOf(o), -1, `option ${o} not specified as string`);
    });
  });
});
