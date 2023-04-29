```js
const SocketIO = require('socket.io');

module.exports = (server) => {
   // 서버 연결, path는 프론트와 일치시켜준다.
   const io = SocketIO(server, { path: '/socket.io' });

   //* 웹소켓 연결 시
   io.on('connection', (socket) => {
      const req = socket.request; // 웹소켓과는 달리 req객체를 따로 뽑아야함

      //* ip 정보 얻기
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
      // socket.id 는 소켓 연결된 고유한 클라이언트 식별자라고 보면된다. 채팅방의 입장한 고유한 사람

      //* 연결 종료 시
      socket.on('disconnect', () => {
         console.log('클라이언트 접속 해제', ip, socket.id);
         clearInterval(socket.interval);
      });

      //* 에러 시
      socket.on('error', (error) => {
         console.error(error);
      });

      //* 클라이언트로부터 메시지
      socket.on('reply', (data) => {
         console.log(data);
      });

      //* 클라이언트로 메세지 보내기
      socket.interval = setInterval(() => {
         // 3초마다 클라이언트로 메시지 전송
         socket.emit('news', 'Hello Socket.IO');
      }, 3000);
   });
};
```

클라이언트에서 연결 요청
```html
<!DOCTYPE html>
<html>
   <head>
      <meta charset="UTF-8">
      <title>GIF 채팅방</title>
   </head>
   <body>
      <div>F12를 눌러 console 탭과 network 탭을 확인하세요.</div>

      <!-- 익스프레스 서버와 소켓 서버가 연결이 되면, 소켓IO 서버에서 js파일을 넣어준다 -->
      <script src="/socket.io/socket.io.js"></script>
      <script>
         // 위의 socket.io.js에서 뽑아 쓴다.
         const socket = io.connect('http://localhost:8005', {
            // 웹소켓의 프로토콜은 ws:// 인데 http를 써주는 이유가 polling 방식으로 연결 시도를 해보고, 그다음에 웹소켓이 가능하면 웹소켓으로 업그레이드(101 코드) 하는 것이다
            // 먼저 http로 연결해서 웹소켓 지원여부를 확인하고, 확인되면 ws로 업그레이드 해주는 방식인 것이다.
            // 그래서 ws 프로토콜이 아니라 http 프로토콜을 사용한다는 점이 ws 모듈과는 다른 점이다.
            path: '/socket.io', // 서버 path와 일치시켜준다
            //transports: ['websocket'] // polling 시도하지말고 바로 웹소켓으로 하려면 설정
         });

         socket.on('news', function (data) {
            console.log(data);

            socket.emit('reply', 'Hello Node.JS');
         });
      </script>
   </body>
</html>
```
socket.request 속성으로 요청 객체에 접근할 수 있고, socket.request.res 로는 응답 객체에 접근할 수 있다.

socket.id 로 소켓 고유의 아이디도 가져올 수 있으며 이 아이디로 소켓의 주인을 특정할 수 있다. (특정 채팅방 참여자에게 귓속말을 보낸다거나 강퇴시킨다거나)

disconnect는 클라이언트가 연결을 끊었을 때 발생하고, error는 통신 과정에서 에러가 나왔을 때 발생한다.

reply는 사용자가 직접 만든 이벤트이다.

클라이언트에서 reply라는 이벤트 명으로 데이터를 보낼 때 서버에서 받는 부분이다.

클라이언트에게 전송 emit(이밋 이라 읽는다) 메서드로 3초마다 클라이언트 한 명에게 메시지를 보내는 부분이 있는데, 인수가 두 개이다.

첫 번째 인수는 이벤트 이름, 두 번째 인수는 데이터다.

웹소켓 지원 안하는 구형 브라우저 때문에, socket.IO는 먼저 polling 방식으로 연결 시도를 해보고,

그다음에 웹소켓이 가능하면 웹소켓으로 업그레이드(101 코드) 한다.

### 네임스페이스

네임스페이스란 Express의 라우팅처럼 url에 지정된 위치에 따라 신호의 처리를 다르게 하는 기술

서버와 클라이언트가 연결되면 실시간 데이터 공유가 가능한데, socket을 그냥 사용하면 데이터가 모든 socket으로 들어가게 된다.

하지만 특정 페이지에서 소켓이 보내주는 모든 실시간 메세지를 모두 받을 필요는 없다. 불필요하며 낭비이기 때문이다.

**Namespace 단어 말 그대로 이름이 붙은 공간이며, 소켓을 묶어주는 단위라고 생각하면 된다.**

```js
// 네임스페이스 등록
const room = io.of('/room');
const chat = io.of('/chat');

// room 네임스페이스 전용 이벤트
room.on('connection', (socket) => {
  console.log('room 네임스페이스에 접속');
  
  socket.on('disconnect', () => {
     console.log('room 네임스페이스 접속 해제');
  });
  
  socket.emit('newroom', '방 만들어'); // 같은 room 네임스페이스 소켓으로만 이벤트가 날라간다.
});

// chat 네임스페이스 전용 이벤트
chat.on('connection', (socket) => {
  console.log('chat 네임스페이스에 접속');

  socket.on('disconnect', () => {
     console.log('chat 네임스페이스 접속 해제');
     socket.leave(roomId);
  });
  
  socket.emit('join', '참여') // 같은 chat 네임스페이스 소켓으로만 이벤트가 날라간다.
});
```

> 네임스페이스 설정 io.of('/something')

io.of 를 통해 namespace를 /room과 /chat 으로 나누어 지정해주었다.

네임스페이스의 연결 처리는 제각각이라 연결 콜백(connection)을 따로따로 등록 해준다

이렇게 되면 namespace 객체는 클라이언트에서 /room 혹은 /chat 네임스페이스를 사용하는 소켓과만 통신을 하게 된다.

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io.connect('http://localhost:8005/room', { // room 네임스페이스
     path: '/socket.io'
  });

  //* newRoom 이벤트 시 room 네임스페이스 에서만 통신 하게 된다.
  socket.on('newRoom', function (data) {
    // ...
  });

  // removeRoom 이벤트 시 room 네임스페이스 에서만 통신 하게 된다.
  socket.on('removeRoom', function (data) {
    // ...
  });
</script>
```

### 외부 파일에서 특정 Namespace 에 이벤트 보내기

핵심은 io 객체를 전역 변수 더나아가 전 파일에서 공통으로 사용할 수 있는 public 변수로 만들어주는 것이다.

public 변수로 만들면, 외부 파일에서 만일 io객체에 접근해 사용할 필요가 있다면 간단하게 req.app.get('io') 로 가져와 소켓IO 기능을 마음껏 사용할 수 있는 것이다.

```js
// app.js
const SocketIO = require('socket.io');
const io = SocketIO(server, { path: '/socket.io' });
   
// path를 지정한 고유한 io객체를 전역으로 등록. 
// 전역변수로 등록함으로서, 다른 파일에서 바로 io객체를 가져와 소켓 설정을 할 수 있다.
app.set('io', io);
```

```js
// 외부파일.js
//^ req.app.get('io') / res.app.get('io') 를 사용해서 익스프레스 객체로 io를 가져와 사용할 수 있게 된다.
const io = req.app.get('io'); // 전역변수로 등록해논 io객체를 가져옴
io.of('/room').emit('newRoom', "message"); // 특정 room네임스페이스에게만 newRoom 이벤트와 메세지를 보냄
```

```js
// 기본 네임스페이스 이벤트 수신
io.on('connection', socket => {
  socket.on('disconnect', () => {});
});

// 기본 네임스페이스 이벤트 송신
io.sockets.emit('hi', 'everyone');
io.emit('hi', 'everyone'); // short form
```

Default namespace

Default namespace를 / 라고 부르며, 기본적으로 연결되는 Socket.IO 클라이언트와 서버가 기본적으로 수신하는 클라이언트다.

이 네임 스페이스는 io.sockets 또는 간단히 io로 식별된다.

```js
// 기본 네임스페이스 이벤트 수신
io.on('connection', socket => {
  socket.on('disconnect', () => {});
});

// 기본 네임스페이스 이벤트 송신
io.sockets.emit('hi', 'everyone');
io.emit('hi', 'everyone'); // short form
```

### Custom namespaces

사용자 정의 네임 스페이스를 설정하려면 io.of 함수를 사용한다.

```js
const nsp = io.of('/my-namespace');

nsp.on('connection', socket => {
  console.log('someone connected');
});

nsp.emit('hi', 'everyone!');
```

### Namespace middleware

모든 Socket에 대해 실행되는 함수로, 소켓과 다음 등록된 미들웨어로 실행을 선택적으로 조절 할 수 있다.

즉, express의 app.use 의 소켓IO 버젼이라고 생각하면 된다.

우리가 이때까지 쓴 express의 미들웨어가 그러했듯이, next() 를 통해 다음 메소드로 넘길수 있으며, 또한 다른 미들웨어를 소켓 메소드 내에 선언해서 사용할 수 있다.

```js
const cookieParser = require('cookie-parser');
const io = SocketIO(server, { path: '/socket.io' });

// default namespace
io.use((socket, next) => {
  if (isValid(socket.request)) {
    // 외부모듈 미들웨어를 안에다 쓰일수 있다. 미들웨어 확장 원칙에 따라 res, req인자를 준다 (후술)
    cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
    next();
  } else {
    // next(인수)를 하면 바로 똑같이 Handling middleware error로 넘어가게 된다. (후술)
    next(new Error('invalid'));
  }
});

// custom namespace
io.of('/admin').use(async (socket, next) => {
  const user = await fetchUser(socket.handshake.query);
  if (user.isAdmin) {
    socket.user = user;
    next();
  } else {
    next(new Error('forbidden'));
  }
});
```

### Handling middleware error

next 메소드가 Error 객체와 함께 호출되면 클라이언트는 connect_error 이벤트를 수신한다.

express의 에러처리 미들웨어의 소켓IO 버젼 이라고 보면 된다.

```js
// ... next(new Error('inavlid'))

socket.on('connect_error', (err) => {
  console.log(err.message); // prints the message associated with the error, e.g. "thou shall not pass" in the example above
});
```

### Compatibility with Express middleware

네임스페이스 미들웨어 안에서 기존 Express 미들웨어 모듈과 함께 호환시켜 사용하려면,

미들웨어 확장 절칙에 따라 (res, req, next) 인자를 주어야 한다.

```js
io.use((socket, next) => {
	// 외부모듈 미들웨어를 안에다 쓰일수 있다. 미들웨어 확장 원칙에 따라 res, req인자를 준다 (후술)
    cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
});
```

공식문서에는 wrap 이라는 helper함수 기법을 제공해주는데, 이 기법을 사용하면 app.use() 와 같이 좀더 깔끔하게 미들웨어들을 배치할 수 있게 된다.

물론 어디까지나 선택적인 방법일 뿐이다.

### ROOM

각 클라이언트는 socket을 가지게 되며, 이 socket은 namespace를 가지고, 각 namespace는 room을 가진다.

네임스페이스를 통해 큰 줄기의 데이터 통신을 만들고 룸을 통해 미세하게 소켓을 연결할 수 있는 것이다.

위 코드를 살펴보면 독특하게 join, to, leave 등 친숙한 동사, 전치사 메서드들이 보이는데,

이는 socket.io에서 채팅방의 논리를 미리 메서드로 구현해놓은 것이다.

```js
// 전체 보내기
req.app.get('io').emit('이벤트', 메세지);

// 네임스페이스에 있는 유저한테만 보내기
req.app.get('io').of('네임스페이스').emit('이벤트', 메세지);

// 네임스페이스에 있으면서, 그안에 룸에 있는 유저한테만 보내기
req.app.get('io').of('네임스페이스').to(roomId).emit('이벤트', 메세지);

// 특정 유저한테만 보내기 (1:1대화, 귓속말)
req.app.get('io').to(socket.id).emit('이벤트', 메세지);

// 나를 제외한 모든 유저에게 보내기
req.app.get('io').broadcast.emit('event_name', msg);
```