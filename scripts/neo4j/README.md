## Guide

Generate Module With CURD Resolver Interface. Module name is `post-group` and
direction is `src`:

`yarn run crud:generate post-group src`

Result like:

```sh
yarn run v1.22.19
$ node ./scripts/generate-crud post-group src/notification
CREATE post-group.args.ts
CREATE post-group.crud.ts
CREATE post-group.entity.ts
CREATE post-group.interface.ts
CREATE post-group.module.ts
CREATE post-group.resolver.ts
CREATE post-group.schema.ts
CREATE post-group.service.ts
CREATE post-group.spec.ts
✨  Done in 0.45s.
```
