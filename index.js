#!/usr/bin/env node

const bilibili = require('./bilibili');
const douyu = require('./douyu');
const { Command } = require('commander');

const program = new Command();
program
  .name("livestream-url")
  .description("Get livestream url")
  .version("0.1.0");

program
  .command("douyu")
  .description("Get douyu livestream url")
  .argument("<room_number>", "Room number of the livestream")
  .action(async (room_number) => {
    console.log(await douyu.get_h5_url(room_number));
  });

program
  .command("bilibili")
  .description("Get bilibili livestream url")
  .argument("<room_number>", "Room number of the livestream")
  .action(async (room_number) => {
    console.log(await bilibili.get_live_urls(room_number));
  });

program.parse();