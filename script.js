(function() {

  var game;

  ////////////////////////////////////////////////////////////////////////////////////
  // GameObjects
  ////////////////////////////////////////////////////////////////////////////////////

  function Uiharu(img, worldSize){
    this.img = img;
    this.worldSize = worldSize;
    this.pos = {x: (worldSize.w-this.img.width)/2, y: worldSize.h-(this.img.height+15)};
    this.size = {w: this.img.width, h: this.img.height};
    this.moveDir = 0;

    this.draw = function(ctx){
      ctx.drawImage(this.img, this.pos.x, this.pos.y);
    };

    this.update = function(){
      this.move();
    };

    this.move = function(){
      if(this.moveDir > 0){
        this.pos.x += Uiharu.Velocity;

        if(this.pos.x >= this.worldSize.w - this.size.w){
          this.pos.x = this.worldSize.w - this.size.w;
        }
      } else if(this.moveDir < 0){
        this.pos.x -= Uiharu.Velocity;

        if(this.pos.x <= 0){
          this.pos.x = 0;
        }
      }
    };

    this.moveLeft = function(){
      this.moveDir = -1;
    };

    this.moveRight = function(){
      this.moveDir = 1;
    };

    this.moveStop = function(){
      this.moveDir = 0;
    };
  }
  Uiharu.Velocity = 5;

  function Saten(img, worldSize, onHitShowerCallback, onGameEndCallback){
    this.img = img;
    this.worldSize = worldSize;
    this.pos = {x: (worldSize.w-this.img.width)/2, y: 50};
    this.size = {w: this.img.width, h: this.img.height};
    this.minDist = 60;
    this.baseDuration = 1000;
    this.moveTo = new MovePath(this.worldSize.w-this.size.w, this.pos.x, this.minDist, this.baseDuration);
    this.lastTime = new Date().getTime();
    this.fromT = this.lastTime;
    this.fromX = this.pos.x;

    this.state = false;
    this.distT = new Date().getTime() + 1000;

    this.showers = new Showers(onHitShowerCallback, onGameEndCallback);

    this.draw = function(ctx){
      ctx.drawImage(this.img, this.pos.x, this.pos.y);
      this.showers.draw(ctx);
    };

    this.update = function(){
      this.move();
      this.shower();

      this.showers.update();
    };

    this.move = function(){
      var now = new Date().getTime();
      var progress = (now - this.fromT)/this.moveTo.duration;

      this.pos.x = (this.moveTo.distX-this.fromX)*progress + this.fromX;

      if(progress >= 1){
        this.moveTo = new MovePath(this.worldSize.w-this.size.w, this.pos.x, this.minDist, this.baseDuration);
        this.fromT = now;
        this.fromX = this.pos.x;
      }
    }

    this.shower = function(){
      var now = new Date().getTime();

      if(now >= this.distT){
        this.state = !this.state;
        this.distT = (now + 100 + Math.random()*2000);
      }

      if(this.state){
        var orgPos = {x: this.pos.x+5, y: this.pos.y+this.size.h-10};
        this.showers.generate(orgPos, this.worldSize.h);
      }
    }

    function MovePath(maxX, nowX, minDist, baseDuration){
      var distX_;
      var duration_;
      for(;;){
        distX_ = Math.floor(Math.random()*maxX);
        duration_ = baseDuration + Math.random()*1500;
        if(Math.abs(nowX - distX_) >= minDist && Uiharu.Velocity * (duration_/1000)*60 > distX_){
          break;
        }
      }

      this.distX = distX_;
      this.duration = baseDuration + Math.random()*1500;
    }
  }

  function Showers(onHitShowerCallback, onGameEndCallback){
    this.showers = [];

    this.generate = function(orgPos, aliveHeight){
      this.showers.push(new Shower(orgPos, aliveHeight, onHitShowerCallback, onGameEndCallback));
    };

    this.draw = function(ctx){
      for(var i=0, len=this.showers.length; i<len; ++i){
        this.showers[i].draw(ctx);
      }
    };

    this.update = function(){
      this.showers = this.showers.filter(function(e) {
          return e.status !== 0;
      });

      for(var i=0, len=this.showers.length; i<len; ++i){
        this.showers[i].update();
      }
    };
  }

  function Shower(orgPos, aliveHeight, onHitShowerCallback, onGameEndCallback){
    this.pos = orgPos;
    this.aliveHeight = aliveHeight;
    this.status = 1;
    this.radius = 2;

    this.kill = function(){
      this.status = 0;
    };

    this.draw = function(ctx){
      if(this.status === 0){
        return;
      }

      ctx.fillStyle = "#0061FF";
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2, false);   
      ctx.fill();
    };

    this.update = function(){
      this.pos.y += Shower.Velocity;

      var isHit = onHitShowerCallback(this.pos);
      if(isHit){
        this.kill();
      }

      if(this.pos.y >= aliveHeight){
        this.kill();
        onGameEndCallback();
      }
    };
  };

  Shower.Velocity = 3;

  ////////////////////////////////////////////////////////

  function StatusViewer(size, score){
    this.screenSize = size;
    this.score = score;
    this.isDisplayGameOver = false;

    this.setScore = function(score){
      this.score = score;
    };

    this.displayGameOver = function(){
      this.isDisplayGameOver = true;
    }

    this.draw = function(ctx){
      this.drawStatus(ctx);

      if(this.isDisplayGameOver) {
        this.drawGameOver(ctx);
      }
    };

    this.drawStatus = function(ctx){
      ctx.font = "18pt Arial";
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#333';
      ctx.fillText("Score: " + this.score, 20, 20);
    };

    this.drawGameOver = function(ctx){
      ctx.font = "24pt Arial";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("GameOver", this.screenSize.w * 0.5, this.screenSize.h * 0.5);
      ctx.font = "16pt Arial";
      ctx.fillStyle = '#666';
      ctx.fillText("Spaceを押してもう一度", this.screenSize.w * 0.5, this.screenSize.h * 0.5+30);
    };

    this.update = function(){
    };
  };

  function Background(imgs){
    this.img = imgs[0];
    this.imgs = imgs;

    this.draw = function(ctx){
      ctx.drawImage(this.img, 0, 0);
    };

    this.update = function(score){
      if(score > 150){
        this.img = this.imgs[1];
      }
      if(score > 300){
        this.img = this.imgs[2];
      }
      if(score > 500){
        this.img = this.imgs[3];
        this.isRemain = true;
      }
      if(score > 800){
        this.img = this.imgs[4];
      }
      if(score > 1200){
        this.img = this.imgs[5];
      }
      if(score > 1600){
        this.img = this.imgs[6];
      }
    };
  };

  ////////////////////////////////////////////////////////////////////////////////////
  // GameLogics
  ////////////////////////////////////////////////////////////////////////////////////

  function UiharuNoMori() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.score = 0;

    this.statusViewer = null;
    this.uiharu = null;
    this.saten = null;
    this.images = null;
    this.isGameOver = false;

    this.background = null;

    this.start = function(){
      this.init(this.loops.bind(this));
    };

    this.init = function(onInitialized){
      this.score = 0;
      this.isGameOver = false;
      this.statusViewer = new StatusViewer({w: this.width, h: this.height}, this.score);

      // Load Resources
      this.images = new Images(function(){
        var worldSize = {w: this.width, h: this.height};
        var hitCallback = function(showerPos){
          var uiharuPos = this.uiharu.pos;
          var uiharuSize = this.uiharu.size;

          if(showerPos.x <= uiharuPos.x+uiharuSize.w && uiharuPos.x <= showerPos.x && uiharuPos.y <= showerPos.y && showerPos.y <= uiharuPos.y+10){
            if(!this.isGameOver){
              this.score++;
            }
            return true;
          }

          return false;
        }.bind(this);

        var endCallback = function(){
          this.isGameOver = true;
        }.bind(this);

        this.uiharu = new Uiharu(Images.sources.uiharu, worldSize);
        this.saten = new Saten(Images.sources.saten, worldSize, hitCallback, endCallback);
        this.background = new Background([
          Images.sources.bg01,
          Images.sources.bg02,
          Images.sources.bg03,
          Images.sources.bg04,
          Images.sources.bg05,
          Images.sources.bg06,
          Images.sources.bg07
        ]);

        onInitialized();
      }.bind(this));
    };

    this.loops = function(){
      this.draw();
      this.update();

      if(this.isGameOver) {
        this.endGame();
        return;
      }

      requestAnimationFrame(this.loops.bind(this));
    };

    this.draw = function(){
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.background.draw(this.ctx);
      this.uiharu.draw(this.ctx);
      this.saten.draw(this.ctx);
      this.statusViewer.draw(this.ctx);
    };

    this.update = function(){
      this.background.update(this.score);
      this.uiharu.update();
      this.saten.update();
      this.statusViewer.setScore(this.score);
      this.statusViewer.update();
    };

    this.endGame = function(){
      this.statusViewer.displayGameOver();
      this.draw();
      this.genTweetButton();
    };

    this.genTweetButton = function() {
        var button = document.getElementById('tweetButton');
        var score = this.score.toString();
        var twitter = "http://twitter.com/share"
        var url = location.href.toString();
        var hashtag = "初春の森,初春可愛い";
        var text = '初春の森で遊んだ結果，' + score + '本の草木が生い茂りました!';

        button.href = twitter + '?url=' + url + '&hashtags=' + hashtag + '&text=' + text;
        button.style.display = "block";
    }

    document.onkeydown = function (e){
      if(e.keyCode == 37){
        this.uiharu.moveLeft();
      } else if(e.keyCode == 39){
        this.uiharu.moveRight();
      }
      if(this.isGameOver && e.keyCode == 32){
        this.start();
        return false;
      }
    }.bind(this);

    document.onkeyup = function (e){
      if(e.keyCode == 37){
        this.uiharu.moveStop();
      } else if(e.keyCode == 39){
        this.uiharu.moveStop();
      }
    }.bind(this);
  }

  function Images(onLoadedCallback) {
      var numToLoad = Object.keys(Images.sources).length;
      var progress = 0;

      for (var key in Images.sources) {
          var img = new Image();
          var path = Images.sources[key];
          img.src = path;

          (function(key_){
              img.onload = function(){
                  Images.sources[key_] = this;
                  onProgress();
              };
              img.onerror = function(){
                  onProgress();
              };
          })(key);
      }

      function onProgress() {
          progress++;

          if(progress >= numToLoad) {
              onLoadedCallback();
          }
      }
  };

  Images.sources = {
    uiharu: 'images/uiharu.png',
    saten: 'images/saten.png',
    bg01: 'images/01.jpg',
    bg02: 'images/02.jpg',
    bg03: 'images/03.jpg',
    bg04: 'images/04.jpg',
    bg05: 'images/05.jpg',
    bg06: 'images/06.jpg',
    bg07: 'images/07.jpg'
  };

  new UiharuNoMori().start();
})();