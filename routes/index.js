const express = require('express')
const router = express.Router()
const protoRoot = require('../proto/proto')
const protobuf = require('protobufjs')
// 响应体的message
const PBMessageResponse = protoRoot.lookup('framework.PBMessageResponse')
const PBMessageRequest = protoRoot.lookup('framework.PBMessageRequest')

router.post('/', function (req, res, next) {
  let data = [];
  req.on("data", function(chunk) {
    data.push(chunk);
  });
  req.on("end", function() {
    data = Buffer.concat(data);
    const myMessage = transformReData(data, 'school.PBStudentListReq')
    console.log(myMessage)
    res.send(PBMessageResponse.encode(myMessage))
  });
})

function getMessageTypeValue(msgType) {
  const PBMessageType = protoRoot.lookup('framework.PBMessageType')
  return PBMessageType.keys[msgType]
}

function transformReData(rawData, responseType) {
  // 判断response是否是arrayBuffer
  if (rawData == null || !isArrayBuffer(rawData)) {
  //   return rawData
  }
  try {
    const buf = protobuf.util.newBuffer(rawData)
    // decode响应体
    const decodedResponse = PBMessageRequest.decode(buf)
    if (decodedResponse.messageData && responseType) {
      const model = protoRoot.lookup(responseType)
      decodedResponse.messageData = model.decode(decodedResponse.messageData)
    }
    return decodedResponse
  } catch (err) {
    return err
  }
}


function isArrayBuffer(obj) {
  return Object.prototype.toString.call(obj) === '[object ArrayBuffer]'
}

module.exports = router
