const StatsD = require("hot-shots");
import { configuration } from "./configuration";

const client = new StatsD({ mock: configuration.isTest() });

type MetricKey = "mail.received.count" | "mail.sent.count";

const increment = (key: MetricKey): void => client.increment(key);

export { increment };
