const port = process.env.PORT || 10000;
const server= require("http").Server();

var io = require("socket.io")(server);

var allusers = {};
var allstickers = {};

io.on("connection", function(socket){
    // console.log("someone is connected");
    // allusers.push(socket.id);

    socket.on("stick", function(data){
      allstickers[this.myRoom].push(data);
      io.to(this.myRoom).emit("newsticker", allstickers[this.myRoom]);
    });

    socket.on("joinroom", function(data){
      console.log(data);
      socket.join(data);

      socket.myRoom(data);
      socket.emit("yourid", socket.id);

      if(!allusers[data]){
        allusers[data] = [];
      }
      if(!allstickers[data]){
        allstickers[data] = [];
      }

      allusers[data].push(socket.id);
      io.to(data).emit("usersjoined", allusers[data]);

    });

    socket.on("mymove", function(data){
        // socket.broadcast.emit("usermove", data);
        socket.to(this.myRoom).emit("newmove", data);
    });

    socket.on("disconnect", function(){
        // var index = allusers.indexOf(socket.id);
        // allusers.splice(index, 1);
        // io.emit("createimage", allusers);
        var index = allusers[this.myRoom].indexOf(socket.id);
        allusers[this.myRoom].splice(index,1);
        io.to(this.myRoom).emit("usersjoined", allusers[this.myRoom]);
    });
});

server.listen(port, (err)=>{
    if(err){
        console.log(err);
        return false;
    }

    console.log("port is running");
})
