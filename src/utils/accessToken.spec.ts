import * as assert from 'assert';
import { accessToken } from '../utils/accessToken';

describe('utils/accessToken', () => {
  it('isAppOnlyAccessToken returns undefined when access token is undefined', () => {
    const actual = accessToken.isAppOnlyAccessToken(undefined as any);
    assert.strictEqual(actual, undefined);
  });

  it('isAppOnlyAccessToken returns undefined when access token is empty', () => {
    const actual = accessToken.isAppOnlyAccessToken('');
    assert.strictEqual(actual, undefined);
  });

  it('isAppOnlyAccessToken returns undefined when access token is invalid', () => {
    const actual = accessToken.isAppOnlyAccessToken('abc.def');
    assert.strictEqual(actual, undefined);
  });

  it('isAppOnlyAccessToken returns undefined when non base64 access token passed', () => {
    const actual = accessToken.isAppOnlyAccessToken('abc.def.ghi');
    assert.strictEqual(actual, undefined);
  });

  it('isAppOnlyAccessToken returns true when access token is valid', () => {
    const jwt = JSON.stringify({
      idtyp: 'app'
    });
    const jwt64 = Buffer.from(jwt).toString('base64');
    const token = `abc.${jwt64}.def`;
    const actual = accessToken.isAppOnlyAccessToken(token);
    assert.strictEqual(actual, true);
  });

  it('shows app display name as connected-as for app-only auth', () => {
    const jwt = JSON.stringify({
      app_displayname: 'CLI for Microsoft 365 Contoso'
    });
    const jwt64 = Buffer.from(jwt).toString('base64');
    const token = `abc.${jwt64}.def`;
    const actual = accessToken.getUserNameFromAccessToken(token);
    assert.strictEqual(actual, 'CLI for Microsoft 365 Contoso');
  });

  it('returns empty user name when access token is undefined', () => {
    const actual = accessToken.getUserNameFromAccessToken(undefined as any);
    assert.strictEqual(actual, '');
  });

  it('returns empty user name when empty access token passed', () => {
    const actual = accessToken.getUserNameFromAccessToken('');
    assert.strictEqual(actual, '');
  });

  it('returns empty user name when invalid access token passed', () => {
    const actual = accessToken.getUserNameFromAccessToken('abc.def.ghi');
    assert.strictEqual(actual, '');
  });

  it('shows tenant id from valid access token', () => {
    const jwt = JSON.stringify({
      tid: 'de349bc7-1aeb-4506-8cb3-98db021cadb4'
    });
    const jwt64 = Buffer.from(jwt).toString('base64');
    const token = `abc.${jwt64}.def`;
    const actual = accessToken.getTenantIdFromAccessToken(token);
    assert.strictEqual(actual, 'de349bc7-1aeb-4506-8cb3-98db021cadb4');
  });

  it('returns empty tenant id when access token is undefined', () => {
    const actual = accessToken.getTenantIdFromAccessToken(undefined as any);
    assert.strictEqual(actual, '');
  });

  it('returns empty tenant id when empty access token passed', () => {
    const actual = accessToken.getTenantIdFromAccessToken('');
    assert.strictEqual(actual, '');
  });

  it('returns empty tenant id when invalid access token passed', () => {
    const actual = accessToken.getTenantIdFromAccessToken('abc.def.ghi');
    assert.strictEqual(actual, '');
  });

  it('shows user id from valid access token', () => {
    const jwt = JSON.stringify({
      oid: 'de349bc7-1aeb-4506-8cb3-98db021cadb4'
    });
    const jwt64 = Buffer.from(jwt).toString('base64');
    const token = `abc.${jwt64}.def`;
    const actual = accessToken.getUserIdFromAccessToken(token);
    assert.strictEqual(actual, 'de349bc7-1aeb-4506-8cb3-98db021cadb4');
  });

  it('returns empty userd id when access token is undefined', () => {
    const actual = accessToken.getUserIdFromAccessToken(undefined as any);
    assert.strictEqual(actual, '');
  });

  it('returns empty user id when empty access token passed', () => {
    const actual = accessToken.getUserIdFromAccessToken('');
    assert.strictEqual(actual, '');
  });

  it('returns empty user id when invalid access token passed', () => {
    const actual = accessToken.getUserIdFromAccessToken('abc.def.ghi');
    assert.strictEqual(actual, '');
  });

  it('returns empty user id when incomplete access token passed', () => {
    const actual = accessToken.getUserIdFromAccessToken('abc.def');
    assert.strictEqual(actual, '');
  });
});