import { TASK_STORAGE_SAVE, TASK_STORAGE_COMPARE } from "./constants";

import { extendConfig, task, types } from "hardhat/config";
import { ActionType } from "hardhat/types";

import { compareConfigExtender, mergeCompareArgs } from "./config";
import { StorageLayout } from "./storage/storage-layout";
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import { CompareArgs } from "./types";

extendConfig(compareConfigExtender);

const storageSave: ActionType<CompareArgs> = async (taskArgs, env) => {
  mergeCompareArgs(env, taskArgs);

  // Make sure that contract artifacts are up-to-date.
  await env.run(TASK_COMPILE, {
    quiet: true,
    force: true,
  });

  const storageLayout = new StorageLayout(env);
  await storageLayout.saveSnapshot();
};

const storageCompare: ActionType<CompareArgs> = async (taskArgs, env) => {
  mergeCompareArgs(env, taskArgs);

  // Make sure that contract artifacts are up-to-date.
  await env.run(TASK_COMPILE, {
    quiet: true,
    force: true,
  });

  const storageLayout = new StorageLayout(env);
  await storageLayout.compareSnapshots();
};

task(TASK_STORAGE_SAVE, "Saves the contract storage layout")
  .addOptionalParam(
    "snapshotPath",
    "Path to the directory where you want to save the storage layout snapshot.",
    undefined,
    types.string
  )
  .setAction(storageSave);

// TODO: make proper documentation

task(TASK_STORAGE_COMPARE, "Compare current storage layout with given.")
  .addOptionalParam(
    "snapshotPath",
    "Path to the directory where you want to save the storage layout snapshot.",
    undefined,
    types.string
  )
  .setAction(storageCompare);
