<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://camo.githubusercontent.com/d48e119d92ea31ff925a13734c1d778555d9a9aa382550a5d3ed3ad29b53620c/68747470733a2f2f692e6962622e636f2f4d44386a4836302f61707074726164652d6c6f676f2e6a7067" width="200" alt="Nest Logo" /></a>
</p>

## Description

A project copy of a [fork](https://github.com/victorFreixinho/express-query-adapter/tree/feat/add-mongo-support) from [express-query-adapter](https://github.com/Tool-Kid/express-query-adapter).

### Main feature implemented on fork

As mongodb does not support Typeorm's built-in find operators, this branch adds a new parameter "dialect", which can for now receive the value "mongodb", and will generate the query with the specific format for this dialect.

## Installation

The installation will also build the project (with postinstall script). This is necessary because we will need to install that git project on other projects, and we will need to access built files.

To install the project, run:

```bash
$ npm install
```

## Command Tools

### Lint

```bash
$ npx nx lint express-query-adapter
```

### Test

```bash
$ npx nx test express-query-adapter
```

### Build

```bash
$ npx nx build express-query-adapter
```

## License

Nest is [MIT licensed](LICENSE).
