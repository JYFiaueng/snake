// 2016年8月21日 17:40:42

var $game = $('#game');
var $score = $('#score');
var $start = $('#start');
var $mark = $('#mark');
var game_arrSild = 20;
var game_WH = ScreenAdaptation();
var snake_WH = game_WH/game_arrSild;
var snake_head = {};
var snake_end = {};
var food_pos = {};
var game_arr = [];
var food_str = '';
var speed = 550 - $('#speed').value;
var direction;
var id = -1;
var gameover = false;
var directionMove = true;
var directionChange = [];
var score = 0;
var keyStart = true;
var documentWidth = window.screen.availWidth;

function init(){
	initArr();
	createFoot();
	snakePos();
	drawSnake();
}

function move(){
	id = setInterval(function (){
		if(gameover){
			clearInterval(id);
			$mark.style.display = 'block';
			return;
		}
		// 更改蛇头位置
		switch(direction){
			case 'l':moveLeft();break;
			case 't':moveTop();break;
			case 'r':moveRight();break;
			case 'b':moveBottom();break;
		}
		// 蛇头碰到自己否？
		if(game_arr[snake_head.x][snake_head.y] !== 1){
			// 没碰到自己就可以占用下一个位置
			game_arr[snake_head.x][snake_head.y] = 1;
			// 下一个位置是否有食物？
			if(snake_head.x === food_pos.x && snake_head.y === food_pos.y){
				createFoot();
				score++;
				$score.innerHTML = score;
			}else{
				// 蛇尾前进
				game_arr[snake_end.x][snake_end.y] = 0;
				if(directionChange.length !== 0){
					// 蛇尾到达最近拐弯处，把弯去掉并重置蛇尾的方向
					if(directionChange[0].x == snake_end.x && directionChange[0].y == snake_end.y){
						snake_end.d = directionChange[0].d;
						directionChange.splice(0, 1);
					}
				}
				// 蛇尾沿当前方向移动一步
				switch(snake_end.d){
					case 'l':snake_end.x -= 1;break;
					case 'r':snake_end.x += 1;break;
					case 't':snake_end.y -= 1;break;
					case 'b':snake_end.y += 1;break;
				}
			}
		}else{
			gameover = true;
			return;
		}
		drawSnake();
		directionMove = true;
	}, speed);
}

function moveLeft(){
	if(snake_head.x > 0){
		snake_head.x -= 1;
	}else{
		gameover = true;
	}
}
function moveTop(){
	if(snake_head.y > 0){
		snake_head.y -= 1;
	}else{
		gameover = true;
	}
}
function moveRight(){
	if(snake_head.x < game_arrSild-1){
		snake_head.x += 1;
	}else{
		gameover = true;
	}
}
function moveBottom(){
	if(snake_head.y < game_arrSild-1){
		snake_head.y += 1;
	}else{
		gameover = true;
	}
}

function snakePos(){
	// 随机蛇头位置
	var x = parseInt(Math.random()*(game_arrSild-7)+3);
	var y = parseInt(Math.random()*(game_arrSild-7)+3);
	snake_head.x = x;
	snake_head.y = y;
	game_arr[x][y] = 1;
	// 随机一个移动方向并设定蛇尾位置和方向
	switch(parseInt(Math.random()*3)){
		case 0:x -= 1;direction = 'r';break;
		case 1:x += 1;direction = 'l';break;
		case 2:y -= 1;direction = 'b';break;
		case 3:y += 1;direction = 't';break;
	}
	snake_end.x = x;
	snake_end.y = y;
	snake_end.d = direction;
	game_arr[x][y] = 1;
}
// 初始化数组
function initArr(){
	for(var i = 0; i < game_arrSild; i++){
		game_arr[i] = [];
		for(var j = 0; j < game_arrSild; j++){
			game_arr[i][j] = 0;
		}
	}
}
// 画蛇
function drawSnake(){
	var html = '';
	for(var i = 0; i < game_arrSild; i++){
		for(var j = 0; j < game_arrSild; j++){
			var p = getPos(i, j);
			if(game_arr[i][j] === 1){
				if(i === snake_head.x && j === snake_head.y){
					html += '<div style="background: url(favicon_jyf.ico);background-size:cover;position:absolute;left:'+p.x+'px;top:'+p.y+'px;width:'+snake_WH+'px;height:'+snake_WH+'px;"></div>';
				}else{
					html += '<div style="background: url(loading.gif);background-size:cover;position:absolute;left:'+p.x+'px;top:'+p.y+'px;width:'+snake_WH+'px;height:'+snake_WH+'px;"></div>';
				}
			}
		}
	}
	html += food_str;
	$game.innerHTML = html;
}
// 创建一个食物
function createFoot(){
	var x = parseInt(Math.random()*game_arrSild);
	var y = parseInt(Math.random()*game_arrSild);
	// 创建的食物不能在蛇已经占用的位置
	while(game_arr[x][y] === 1){
		x = parseInt(Math.random()*game_arrSild);
		y = parseInt(Math.random()*game_arrSild);
	}
	food_pos.x = x;
	food_pos.y = y;
	var p = getPos(x, y);
	food_str = '<div style="background:url(apple.png);background-size:cover;position:absolute;left:'+p.x+'px;top:'+p.y+'px;width:'+snake_WH+'px;height:'+snake_WH+'px;"></div>';
}
// 获取绝对位置
function getPos(x, y){
	return {
		x:x*snake_WH,
		y:y*snake_WH,
	};
}
// 屏幕适配
function ScreenAdaptation(){
	var w = window.screen.availWidth;
	var h = window.screen.availHeight;
	if(w > h){
		return h*0.8;
	}else{
		return w*0.8;
	}
}

function $(str){
	return document.querySelector(str);
}

function $all(str){
	return document.querySelectorAll(str);
}
// 键盘事件，根据事件更改数据，压入拐角
document.addEventListener('keydown', function(event){
	if(directionMove){
		directionMove = false;
		switch(event.keyCode){
			case 37:
				event.preventDefault();
				if(direction !== 'r'){
					direction = 'l';
					directionChange.push({
						x:snake_head.x,
						y:snake_head.y,
						d:direction
					});
				}
				break;
			case 38:
				event.preventDefault();
				if(direction !== 'b'){
					direction = 't';
					directionChange.push({
						x:snake_head.x,
						y:snake_head.y,
						d:direction
					});
				}
				break;
			case 39:
				event.preventDefault();
				if(direction !== 'l'){
					direction = 'r';
					directionChange.push({
						x:snake_head.x,
						y:snake_head.y,
						d:direction
					});
				}
				break;
			case 40:
				event.preventDefault();
				if(direction !== 't'){
					direction = 'b';
					directionChange.push({
						x:snake_head.x,
						y:snake_head.y,
						d:direction
					});
				}
				break;
			default:
				break;
		}
	}
	if(keyStart){
		move();
		keyStart = false;
	}
	console.log(direction);
});

$game.addEventListener('touchstart', function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});
$game.addEventListener('touchend', function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	var deltx = endx - startx;
	var delty = endy - starty;
	if(keyStart){
		move();
		keyStart = false;
	}
	if(Math.abs(deltx)<0.1*documentWidth && Math.abs(delty)<0.1*documentWidth){
		return;
	}
	if(Math.abs(deltx) >= Math.abs(delty)){
		if(deltx > 0){
			if(direction !== 'l'){
				direction = 'r';
				directionChange.push({
					x:snake_head.x,
					y:snake_head.y,
					d:direction
				});
			}
		}else{
			if(direction !== 'r'){
				direction = 'l';
				directionChange.push({
					x:snake_head.x,
					y:snake_head.y,
					d:direction
				});
			}
		}
	}else{
		if(delty > 0){
			if(direction !== 't'){
				direction = 'b';
				directionChange.push({
					x:snake_head.x,
					y:snake_head.y,
					d:direction
				});
			}
		}else{
			if(direction !== 'b'){
				direction = 't';
				directionChange.push({
					x:snake_head.x,
					y:snake_head.y,
					d:direction
				});
			}
		}
	}
	console.log(direction);
});

$start.addEventListener('click', function(){
	snake_head = {};
	snake_end = {};
	food_pos = {};
	id = -1;
	gameover = false;
	directionMove = true;
	directionChange = [];
	score = 0;
	$score.innerHTML = '0';
	$mark.style.display = 'none';
	speed = 550 - $('#speed').value;
	$game.style.display = 'block';
	init();
	keyStart = true;
});

(function(){
	$game.style.width = game_WH+'px';
	$game.style.height = game_WH+'px';
})();

// 2016年8月21日 23:20:06