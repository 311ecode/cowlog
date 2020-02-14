#!/usr/bin/env node
require('cowlog')()
// const octokit = require('@octokit/rest')
const token = process.env.GITHUB_TOKEN

const { createTokenAuth } = require("@octokit/auth-token");
const { request } = require("@octokit/request");
const { graphql } = require("@octokit/graphql");
const packages = require('./lib/get-packages');
const pacageNames = packages.map(e=>require(`../${e}/package.json`).name).sort();
const diff = require('diff');
const authorization = `token ${token}`;
(async () => {
    const result = await request("GET /orgs/dsl-toolkit/repos", {
        headers: {
            authorization
        },
    });
    const existingRepos = result.data.map(e=>e.name).sort()
    const toCreate = diff.diffArrays(pacageNames.sort(), existingRepos.sort()).filter(e=>e.removed).map(e=>e.value).flat()

    toCreate.forEach( async repository=> await request("POST /orgs/dsl-toolkit/repos", {
        headers: {
            authorization
        },
        name: repository
    })
})()
