import { defineFunction } from "@aws-amplify/backend";

export const mapData = defineFunction({
    name: "mapData",
    entry: "./handler.ts"
});