const server = require('http').createServer();
const io = require('socket.io')(server);


const asyncRedis = require("async-redis");
redisClient      = asyncRedis.createClient({host : 'localhost', port : 6379}),
redisClient.on("error", function (err) {
  console.log("Error " + err);
});


io.on('connection', client => {
  // console.log('client connected',client);

  redisClient.set(client.handshake.query.id, client.id);

  client.on('sendMessage', async data => { 
      //console.log('client',client)
      // let groups = await redisClient.set('groups','BING');
      // let members = await redisClient.get('groups');
      // console.log('members',members);
      let receiverId = await redisClient.get(data.receiver);
      // console.log('data',client.handshake.query.id,'==>',data.receiver);
      io.to(receiverId).emit('messageFromServer',data);

   });
  client.on('disconnect', () => { 
      // console.log('client disconnected',client.handshake.query);
      redisClient.set(client.handshake.query.id, client.id);
   });
});
server.listen(3200);
console.log('server is running on port 3200');