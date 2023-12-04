# ui-plugin-select-application

Copyright (C) 2017-2019 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

This package furnishes a single Stripes plugin of type `select-application`,
which can be included in Stripes modules by means of a `<Pluggable
type="select-application">` element. See [the *Plugins*
section](https://github.com/folio-org/stripes-core/blob/master/doc/dev-guide.md#plugins)
of the Module Developer's Guide.

## Props

| Name            | Type                                            | Description                                                                                                                                                                                                                                                                                     | Required |
|-----------------|-------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `renderTrigger` | func: ({ triggerId, onClick, buttonRef }) => {} | Optional render function for the button to open the Select application search modal. The `onClick` prop should be called when the trigger is clicked (assuming it is a Button). The `buttonRef` prop ensures that the trigger button is brought back into focus once the lookup modal is closed |          |

## Additional information

Other [modules](https://dev.folio.org/source-code/#client-side).

See project [ERM](https://issues.folio.org/browse/ERM)
at the [FOLIO issue tracker](https://dev.folio.org/guidelines/issue-tracker/).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
