# aad o365group add

Creates a Microsoft 365 Group

## Usage

```sh
m365 aad o365group add [options]
```

## Options

`-n, --displayName <displayName>`
: Display name for the Microsoft 365 Group

`-d, --description <description>`
: Description for the Microsoft 365 Group

`-m, --mailNickname <mailNickname>`
: Name to use in the group e-mail (part before the `@`)

`--owners [owners]`
: Comma-separated list of Microsoft 365 Group owners

`--members [members]`
: Comma-separated list of Microsoft 365 Group members

`--isPrivate`
: Specify, if the Microsoft 365 Group should be private. If not specified, will create a public group (default)

`--allowMembersToPost [allowMembersToPost]`
: Set if only group members should be able to post conversations to the group

`--hideGroupInOutlook [hideGroupInOutlook]`
: Set to hide the group in Outlook experiences

`--subscribeNewGroupMembers [subscribeNewGroupMembers]`
: Set to subscribe all new group members to receive group conversation emails when new messages are posted in the group

`--welcomeEmailDisabled [welcomeEmailDisabled]`
: Set to not send welcome emails to new group members

`-l, --logoPath [logoPath]`
: Local path to the image file to use as group logo

--8<-- "docs/cmd/_global.md"

## Remarks

When specifying the path to the logo image you can use both relative and absolute paths. Note, that ~ in the path, will not be resolved and will most likely result in an error.
If an invalid user is provided in the comma-separated list of Owners or Members, the command operation will fail and the Microsoft 365 Group will not be created.

## Examples

Create a public Microsoft 365 Group

```sh
m365 aad o365group add --displayName Finance --description "This is the Contoso Finance Group. Please come here and check out the latest news, posts, files, and more." --mailNickname finance
```

Create a private Microsoft 365 Group

```sh
m365 aad o365group add --displayName Finance --description "This is the Contoso Finance Group. Please come here and check out the latest news, posts, files, and more." --mailNickname finance --isPrivate
```

Create a public Microsoft 365 Group and set specified users as its owners

```sh
m365 aad o365group add --displayName Finance --description "This is the Contoso Finance Group. Please come here and check out the latest news, posts, files, and more." --mailNickname finance --owners "DebraB@contoso.onmicrosoft.com,DiegoS@contoso.onmicrosoft.com"
```

Create a public Microsoft 365 Group and set specified users as its members

```sh
m365 aad o365group add --displayName Finance --description "This is the Contoso Finance Group. Please come here and check out the latest news, posts, files, and more." --mailNickname finance --members "DebraB@contoso.onmicrosoft.com,DiegoS@contoso.onmicrosoft.com"
```

Create a public Microsoft 365 Group and allow only group members to be able to post conversations to the group.

```sh
m365 aad o365group add --displayName Finance --description "This is the Contoso Finance Group. Please come here and check out the latest news, posts, files, and more." --mailNickname finance --allowMembersToPost
```

Create a public Microsoft 365 Group and hide it from the Outlook experiences (web and client).

```sh
m365 aad o365group add --displayName Finance --description "This is the Contoso Finance Group. Please come here and check out the latest news, posts, files, and more." --mailNickname finance --hideGroupInOutlook
```

Create a public Microsoft 365 Group and subscribe all new group members to receive group conversation emails when new messages are posted in the group.

```sh
m365 aad o365group add --displayName Finance --description "This is the Contoso Finance Group. Please come here and check out the latest news, posts, files, and more." --mailNickname finance --subscribeNewGroupMembers
```

Create a public Microsoft 365 Group and set to not send welcome emails to new group members.

```sh
m365 aad o365group add --displayName Finance --description "This is the Contoso Finance Group. Please come here and check out the latest news, posts, files, and more." --mailNickname finance --welcomeEmailDisabled
```

Create a public Microsoft 365 Group and set its logo

```sh
m365 aad o365group add --displayName Finance --description "This is the Contoso Finance Group. Please come here and check out the latest news, posts, files, and more." --mailNickname finance --logoPath images/logo.png
```
