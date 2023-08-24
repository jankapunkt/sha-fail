import { SHA256 } from 'meteor/sha'
import cryptojs from "crypto-js"
import sha256 from 'crypto-js/sha256'
import encHex from 'crypto-js/enc-hex'

export const SHA = {}

SHA.generate = async input => {
  const output = {}
  output.m = await attempt(input, generateMeteor)
  output.c = await attempt(input, generateCryptoJs)

  if (Meteor.isServer) {
    output.n = await attempt(input, generateNode)
  }
  if (Meteor.isClient) {
    output.w = await attempt(input, generateWeb)
  }

  const equal = new Set(Object.values(output)).size === 1
  return { input, output, equal }
}

const attempt = async (input, fn) => {
  try {
    return fn(input)
  } catch (e) {
    return e.message
  }
}

const generateMeteor = input => SHA256(input)
const generateCryptoJs = input => {
  const sig = sha256(input);
  return sig.toString(encHex)
}

const generateNode = Meteor.isServer && (() => {
  import crypto from 'node:crypto'

  return input => crypto
    .createHash('sha256')
    .update(input)
    .digest('hex')
})()

const generateWeb = Meteor.isClient && (() => {
  return async input => {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await window.crypto.subtle.digest({ name: 'SHA-256' }, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
    return hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("") // convert bytes to hex string
  }
})()
