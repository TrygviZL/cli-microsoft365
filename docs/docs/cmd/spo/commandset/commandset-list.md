# spo commandset list

Get a list of ListView Command Sets that are added to a site.

## Usage

```sh
m365 spo commandset list [options]
```

## Options

`-u, --webUrl <webUrl>`
: The url of the site.

`-s, --scope [scope]`
: Scope of the ListView Command Sets. Allowed values `Site`, `Web`, `All`. Default to `All`

--8<-- "docs/cmd/_global.md"

## Examples

Retrieves a list of ListView Command Sets.

```sh
m365 spo commandset list --webUrl https://contoso.sharepoint.com/sites/sales
```

## Response

=== "JSON"

    ```json
    [
      {
        "ClientSideComponentId": "b206e130-1a5b-4ae7-86a7-4f91c9924d0a",
        "ClientSideComponentProperties": "",
        "CommandUIExtension": null,
        "Description": null,
        "Group": null,
        "HostProperties": "",
        "Id": "e7000aef-f756-4997-9420-01cc84f9ac9c",
        "ImageUrl": null,
        "Location": "ClientSideExtension.ListViewCommandSet.CommandBar",
        "Name": "{e7000aef-f756-4997-9420-01cc84f9ac9c}",
        "RegistrationId": "100",
        "RegistrationType": 0,
        "Rights": {
          "High": 0,
          "Low": 0
        },
        "Scope": 2,
        "ScriptBlock": null,
        "ScriptSrc": null,
        "Sequence": 0,
        "Title": "test",
        "Url": null,
        "VersionOfUserCustomAction": "16.0.1.0"
      }
    ]
    ```

=== "Text"

    ```text
    Name                                    Location                                           Scope  Id
    --------------------------------------  -------------------------------------------------  -----  ------------------------------------
    {e7000aef-f756-4997-9420-01cc84f9ac9c}  ClientSideExtension.ListViewCommandSet.CommandBar  2      e7000aef-f756-4997-9420-01cc84f9ac9c
    ```

=== "CSV"

    ```csv
    Name,Location,Scope,Id
    {e7000aef-f756-4997-9420-01cc84f9ac9c},ClientSideExtension.ListViewCommandSet.CommandBar,2,e7000aef-f756-4997-9420-01cc84f9ac9c
    ```

=== "Markdown"

    ```md
    # spo commandset list --webUrl "https://ordidev.sharepoint.com"

    Date: 20/2/2023

    ## test (e7000aef-f756-4997-9420-01cc84f9ac9c)

    Property | Value
    ---------|-------
    ClientSideComponentId | b206e130-1a5b-4ae7-86a7-4f91c9924d0a
    ClientSideComponentProperties |
    CommandUIExtension | null
    Description | null
    Group | null
    HostProperties |
    Id | e7000aef-f756-4997-9420-01cc84f9ac9c
    ImageUrl | null
    Location | ClientSideExtension.ListViewCommandSet.CommandBar
    Name | {e7000aef-f756-4997-9420-01cc84f9ac9c}
    RegistrationId | 100
    RegistrationType | 0
    Rights | {"High":0,"Low":0}
    Scope | 2
    ScriptBlock | null
    ScriptSrc | null
    Sequence | 0
    Title | test
    Url | null
    VersionOfUserCustomAction | 16.0.1.0
    ```
