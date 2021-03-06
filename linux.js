"use strict";

const net = require("net");
const exec = require("child_process").exec;

const get = cmd => {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) return reject(err);
      (stdout || "").trim().split("\n").some(line => {
        const [_, gateway, iface] = /default via (.+?) dev (.+?)( |$)/.exec(line) || [];
        if (gateway && net.isIP(gateway)) {
          resolve({gateway: gateway, interface: (iface ? iface : null)});
          return true;
        }
      });
      reject(new Error("Unable to determine default gateway"));
    });
  });
};

module.exports.v4 = () => get("ip -4 r");
module.exports.v6 = () => get("ip -6 r");
