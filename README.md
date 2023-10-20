## Description

A webservice + frontend app that find max profit from predefined sample of data

## Docs

See [UI README.md](./workspaces/ui/README.md) and [API service README.md](./workspaces/api/README.md) for details about running in development mode

## Running the app in prod

```bash
# build docker image
$ docker build . -t webapp

# run docker image
$ docker run -p 3000:3000 webapp
```

Then open http://localhost:3000