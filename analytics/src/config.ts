import * as yargs from "yargs";

export const EXIT_ERROR = 1;
export const MONERO_ESTIMATED_BLOCK_TIME = 60000 * 2;

/**
 * User input for the analytics
 */
 const ARGS = yargs
 .option("pg-user", {
  string: true,
  alias: "u",
  description: "Postgresql username",
  demand: true,
})
.option("pg-credential", {
  string: true,
  alias: "c",
  description: "Postgresql password",
  demand: true,
})
.option("pg-db-name", {
  string: true,
  alias: "n",
  description: "Postgresql database name",
  demand: true,
})
.option("pg-host", {
  string: true,
  alias: "h",
  description: "Postgresql host",
  demand: true,
})
.option("pg-port", {
  string: true,
  alias: "p",
  description: "Postgresql port",
  demand: false,
})
.option("daemon-host", {
  boolean: true,
  default: "http://localhost:38081",
  description: "Host and port of Monero Daemon RPC.",
  demand: false,
})
.option("daemon-user", {
  string: true,
  default: "",
  description: "Username of Monero Daemon RPC.",
  demand: false,
})
.option("daemon-credential", {
  string: true,
  default: "",
  description: "Password of Monero Daemon RPC.",
  demand: false,
})
.option("num-blocks", {
  default: 0,
  number: true,
  description: "Number of blocks from tip to extract",
  demand: false,
})
.option("report", {
  boolean: true,
  description: "FUTURE USE. Generate new analytics report new height",
  demand: false,
})
.option("wipe-db", {
  boolean: true,
  description: "DEV USE. Destructive action. Wipes the Analytics database.",
  demand: false,
})
.option("log-level", {
  string: true,
  alias: "l",
  description: "comma separated list of log levels to maintain",
  demand: false,
}).argv;

// Postgresql constants for the connection string
export const PG_USER: string = ARGS["pg-user"];
export const PG_CREDENTIAL: string = ARGS["pg-credential"];
export const PG_HOST: string = ARGS["pg-host"];
export const PG_PORT: string = ARGS["pg-port"];
export const PG_DB_NAME: string = ARGS["pg-db-name"];

export const MONERO_DAEMON_RPC_USER: string = ARGS["daemon-user"];
export const MONERO_DAEMON_RPC_CREDENTIAL: string = ARGS["daemon-credential"];
export const MONERO_DAEMON_RPC_HOST: string = ARGS["daemon-host"];
export const NUM_BLOCKS_TO_EXTRACT: number = ARGS["num-blocks"];

export const WIPE_DB: boolean = ARGS["wipe-db"];

// global log level
const LOG_LEVEL_ARG: string = ARGS["log-level"];
const IS_MULTI_LOG_LEVEL: boolean =
  LOG_LEVEL_ARG &&
  LOG_LEVEL_ARG.length > 0 &&
  LOG_LEVEL_ARG.indexOf(",") > 0;
const singleLogLevel: string[] = [];
if (!IS_MULTI_LOG_LEVEL && LOG_LEVEL_ARG) {
  singleLogLevel.push(LOG_LEVEL_ARG);
} else {
  // default log level
  singleLogLevel.push("INFO");
  singleLogLevel.push("ERROR");
}
export const LOG_FILTERS: string[] | null = IS_MULTI_LOG_LEVEL
  ? LOG_LEVEL_ARG.split(",")
  : !IS_MULTI_LOG_LEVEL
  ? singleLogLevel
  : null;
