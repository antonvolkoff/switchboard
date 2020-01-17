import * as path from "path";
import * as dotenv from "dotenv";

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
  public readonly smtpURI: string;

  constructor() {
    this.env = <Environment>process.env.NODE_ENV;
    this.port = parseInt(process.env.PORT) || DEFAULT_PORT;
    this.graphqlSchemaPath = path.join(__dirname, "schema.graphql");
    this.smtpURI = process.env.SMTP_URI;
  }

  public isTest(): boolean {
    return this.env == Environment.test;
  }
}

// I need to change path due to use of yarn workspaces
const dotenvPath = __dirname + "/.env";
dotenv.config({ path: dotenvPath });
const configuration = new Configuration();

export {
  configuration,
  Environment,
};
