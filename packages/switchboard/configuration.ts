import * as path from "path";

const DEFAULT_PORT = 4000;

enum Environment {
  development = "development",
  test = "test",
  production = "production",
}

class Configuration {
  public readonly env: Environment;
  public readonly port: number;
  public readonly graphqlSchemaPath: string;

  constructor() {
    this.env = <Environment>process.env.NODE_ENV;
    this.port = parseInt(process.env.PORT) || DEFAULT_PORT;
    this.graphqlSchemaPath = path.join(__dirname, "schema.graphql");
  }

  public isTest(): boolean {
    return this.env == Environment.test;
  }
}

const configuration = new Configuration();

export {
  configuration,
  Environment,
};
