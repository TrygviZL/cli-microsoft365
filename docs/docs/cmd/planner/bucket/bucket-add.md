# planner bucket add

Adds a new Microsoft Planner bucket

## Usage

```sh
m365 planner bucket add [options]
```

## Options

`-n, --name <name>`
: Name of the bucket to add.

`--planId [planId]`
: ID of the plan to which the bucket belongs. Specify either `planId` or `planTitle` but not both.

`--planTitle [planTitle]`
: Title of the plan to which the bucket belongs. Specify either `planId` or `planTitle` but not both.

`--ownerGroupId [ownerGroupId]`
: ID of the group to which the plan belongs. Specify `ownerGroupId` or `ownerGroupName` when using `planTitle`.

`--ownerGroupName [ownerGroupName]`
: Name of the group to which the plan belongs. Specify `ownerGroupId` or `ownerGroupName` when using `planTitle`.

`--orderHint [orderHint]`
: Hint used to order items of this type in a list view. The format is defined as outlined [here](https://docs.microsoft.com/en-us/graph/api/resources/planner-order-hint-format?view=graph-rest-1.0).

--8<-- "docs/cmd/_global.md"

## Examples

Adds a Microsoft Planner bucket with the name _My Planner Bucket_ for plan with the ID _xqQg5FS2LkCp935s-FIFm2QAFkHM_ with order hint

```sh
m365 planner bucket add --name "My Planner Bucket" --planId "xqQg5FS2LkCp935s-FIFm2QAFkHM" --orderHint " !"
```

Adds a Microsoft Planner bucket with the name _My Planner Bucket_ for plan with the title _My Planner Plan_ owned by group _My Planner Group_

```sh
m365 planner bucket add --name "My Planner Bucket" --planTitle "My Planner Plan" --ownerGroupName "My Planner Group"
```

## Response

=== "JSON"

    ```json
    {
      "name": "My Planner Bucket",
      "planId": "xqQg5FS2LkCp935s-FIFm2QAFkHM",
      "orderHint": "8585363889524958496",
      "id": "ttEB_Uj690STdR3GC1MIDZgANq1U"
    }
    ```

=== "Text"

    ```text
    id       : ttEB_Uj690STdR3GC1MIDZgANq1U
    name     : My Planner Bucket
    orderHint: 8585363889524958496
    planId   : xqQg5FS2LkCp935s-FIFm2QAFkHM
    ```

=== "CSV"

    ```csv
    id,name,planId,orderHint
    ttEB_Uj690STdR3GC1MIDZgANq1U,My Planner Bucket,xqQg5FS2LkCp935s-FIFm2QAFkHM,8585363889524958496
    ```

=== "Markdown"

    ```md
    # planner bucket add  --name "My Planner Bucket" --planId "xqQg5FS2LkCp935s-FIFm2QAFkHM"

    Date: 27/12/2022

    ## My Planner Bucket (ttEB_Uj690STdR3GC1MIDZgANq1U)

    Property | Value
    ---------|-------
    name | My Planner Bucket
    planId | xqQg5FS2LkCp935s-FIFm2QAFkHM
    orderHint | 8585363889524958496
    id | ttEB_Uj690STdR3GC1MIDZgANq1U
    ```
